<template>
  <v-dialog
    v-model="dialog"
    width="500"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn fixed bottom right fab color="primary" v-bind="attrs" v-on="on">
        <v-icon large>mdi-plus-circle</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Dodaj zabieg</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-alert
        transition="slide-y-transition"
        dense
        :type="getSurveyAlert.success ? 'success' : 'error'"
        rounded="0"
        v-model="getSurveyAlert.show"
      >
        {{ getSurveyAlert.text }}
      </v-alert>

      <v-form class="mt-5 px-3" ref="form" v-model="valid">
        <v-row class="mt-md-6 mt-4">
          <v-col cols="12">
            <div class="mx-auto">
              <div class="mb-4 text-md-h4 text-h5 grey--text text--darken-2">
                Informacje
              </div>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    outlined
                    v-model="treatment.name"
                    :counter="100"
                    :rules="nameRules"
                    label="Nazwa zabiegu"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-textarea
                    outlined
                    rows="1"
                    v-model="treatment.description"
                    auto-grow
                    clearable
                    label="Opis zabiegu"
                    required
                  >
                  </v-textarea>
                </v-col>
              </v-row>
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="mb-4 text-md-h4 text-h5 grey--text text--darken-2">
              Dla pacjenta
            </div>
            <div class="ml-3" v-for="(item, i) in patientSurveys" :key="i">
              <v-autocomplete
                label="Ankieta"
                v-model="item.id"
                :items="getSurveys"
                outlined
                item-text="name"
                item-value="id"
                clearable
              >
              </v-autocomplete>
              <div class="d-flex">
                <v-select
                  class="mr-4"
                  style="max-width: 200px;"
                  label="Przed/Po"
                  flat
                  :items="['Przed', 'Po', 'Natychmiast', 'W dniu wykonania']"
                  v-model="item.timeType"
                ></v-select>
                <v-text-field
                  style="max-width: 200px;"
                  label="Liczba dni"
                  :disabled="
                    item.timeType === 'Natychmiast' ||
                      item.timeType === 'W dniu wykonania'
                  "
                  :rules="[(v) => !!v || `Czas wysłania jest wymagany`]"
                  v-model="item.days"
                  :required="
                    item.timeType === 'Natychmiast' ||
                      item.timeType === 'W dniu wykonania'
                  "
                >
                </v-text-field>
                <v-spacer></v-spacer>
                <v-btn
                  text
                  color="error"
                  class="mr-5"
                  @click="patientSurveys.splice(i, 1)"
                  >Usuń</v-btn
                >
              </div>
            </div>
            <v-btn
              color="primary"
              class="ml-3"
              @click="
                patientSurveys.push({
                  itemType: 'Przed',
                  days: 0,
                  id: null,
                })
              "
              >Dodaj ankietę</v-btn
            >
          </v-col>
          <v-col cols="12" md="6">
            <div class="mb-4 text-md-h4 text-h5 grey--text text--darken-2">
              Dla lekarza
            </div>
            <div class="ml-3" v-for="(item, i) in doctorSurveys" :key="i">
              <v-autocomplete
                no-data-text="Brak ankiet"
                label="Ankieta"
                v-model="item.id"
                :items="getSurveys"
                outlined
                item-text="name"
                item-value="id"
                clearable
              >
              </v-autocomplete>
              <div class="d-flex">
                <v-select
                  class="mr-4"
                  style="max-width: 200px;"
                  label="Przed/Po"
                  flat
                  :items="['Przed', 'Po', 'Natychmiast', 'W dniu wykonania']"
                  v-model="item.timeType"
                  :rules="[(v) => !!v || `Ankieta jest wymagana`]"
                  required
                ></v-select>
                <v-text-field
                  style="max-width: 200px;"
                  label="Liczba dni"
                  :disabled="
                    item.timeType === 'Natychmiast' ||
                      item.timeType === 'W dniu wykonania'
                  "
                  :rules="[(v) => !!v || `Czas wysłania jest wymagany`]"
                  v-model="item.days"
                  :required="
                    item.timeType === 'Natychmiast' ||
                      item.timeType === 'W dniu wykonania'
                  "
                >
                </v-text-field>
                <v-spacer></v-spacer>
                <v-btn
                  text
                  color="error"
                  class="mr-5"
                  @click="doctorSurveys.splice(i, 1)"
                  >Usuń</v-btn
                >
              </div>
            </div>
            <v-btn
              color="primary"
              class="ml-3"
              @click="
                doctorSurveys.push({
                  itemType: 'Przed',
                  days: 0,
                  id: null,
                })
              "
              >Dodaj ankietę</v-btn
            >
          </v-col>
        </v-row>
        <div class="d-flex justify-end">
          <v-btn
            class="mb-5 mt-6"
            :loading="loader"
            :disabled="!valid"
            color="primary"
            @click="createTreatmentClick"
            >Utwórz zabieg</v-btn
          >
        </div>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["getSurveyAlert", "getSurveys", "getUserData"]),
  },
  data: () => ({
    treatment: {
      name: "",
      description: "",
      created: "",
    },
    dialog: false,
    valid: true,
    patientSurveys: [],
    doctorSurveys: [],
    loader: false,
    nameRules: [
      (v) => !!v || "Nazwa ankiety jest wymagana",
      (v) =>
        (v && v.length <= 100) ||
        "Nazwa ankiety musi być krótsza niż 100 znaków",
    ],
  }),
  methods: {
    ...mapActions(["createTreatment"]),
    async createTreatmentClick() {
      if (!this.$refs.form.validate()) return;
      this.loader = true;

      this.treatment.patientSurveys = [];
      if (this.patientSurveys.length > 0) {
        this.patientSurveys.forEach((item) => {
          let el = this.getSurveys.find((e) => e.id === item.id);
          item.ref = this.getUserData.wardRef
            .collection("surveys")
            .doc(item.id);
          delete item.id;
          this.treatment.patientSurveys.push({ name: el.name, ...item });
        });
      }

      this.treatment.doctorSurveys = [];
      if (this.doctorSurveys.length > 0) {
        this.doctorSurveys.forEach((item) => {
          let el = this.getSurveys.find((e) => e.id === item.id);
          item.ref = this.getUserData.wardRef
            .collection("surveys")
            .doc(item.id);
          delete item.id;
          this.treatment.doctorSurveys.push({ name: el.name, ...item });
        });
      }

      await this.createTreatment(this.treatment);
      this.loader = false;
      this.$refs.form.reset();
      setTimeout(() => {
        this.dialog = false;
      }, 1500);
    },
  },
};
</script>
