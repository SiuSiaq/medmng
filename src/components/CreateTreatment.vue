<template>
  <v-dialog
    v-model="dialog"
    width="500"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" color="primary" class="mr-2 mb-2">
        Stwórz zabieg
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
          <v-col cols="12" md="6">
            <div class="mb-4 text-md-h4 text-h5 grey--text text--darken-2">
              Informacje
            </div>
            <div class="ml-3">
              <v-text-field
                outlined
                class="mb-2 mt-5 mt-md-9"
                v-model="treatment.name"
                :counter="100"
                :rules="nameRules"
                label="Nazwa zabiegu"
                required
              ></v-text-field>
              <v-textarea
                class="mt-md-5"
                outlined
                rows="1"
                v-model="treatment.description"
                auto-grow
                clearable
                label="Opis zabiegu (opcjonalny)"
              >
              </v-textarea>
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="mb-4 text-md-h4 text-h5 grey--text text--darken-2">
              Dla pacjenta
            </div>
            <div class="ml-3">
              <div class="caption">Przed zabiegiem</div>
              <v-autocomplete
                v-model="patientBefore"
                :items="getSurveys"
                outlined
                item-text="name"
                item-value="id"
                multiple
                small-chips
                clearable
              >
              </v-autocomplete>
              <div class="caption">Po zabiegu</div>
              <v-autocomplete
                v-model="patientAfter"
                :items="getSurveys"
                outlined
                item-text="name"
                item-value="id"
                multiple
                small-chips
                clearable
              >
              </v-autocomplete>
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="mb-4 text-md-h4 text-h5 grey--text text--darken-2">
              Dla lekarza
            </div>
            <div class="ml-3">
              <div class="caption">Przed zabiegiem</div>
              <v-autocomplete
                v-model="doctorBefore"
                :items="getSurveys"
                outlined
                item-text="name"
                item-value="id"
                multiple
                small-chips
                clearable
              >
              </v-autocomplete>
              <div class="caption">Po zabiegu</div>
              <v-autocomplete
                v-model="doctorAfter"
                :items="getSurveys"
                outlined
                item-text="name"
                item-value="id"
                multiple
                small-chips
                clearable
              >
              </v-autocomplete>
            </div>
          </v-col>
        </v-row>
        <div class="d-flex justify-end">
          <v-btn
            class="mb-5"
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
    ...mapGetters(["getSurveyAlert", "getSurveys"]),
  },
  data: () => ({
    treatment: {
      name: "",
      description: "",
      created: "",
    },
    dialog: false,
    valid: true,
    patientBefore: [],
    patientAfter: [],
    doctorBefore: [],
    doctorAfter: [],
    loader: false,
    nameRules: [
      (v) => !!v || "Nazwa ankiety jest wymagana",
      (v) =>
        (v && v.length <= 100) ||
        "Nazwa ankiety musi być krótsza niż 100 znaków",
    ],
  }),
  methods: {
    ...mapActions(["fetchSurveys", "createTreatment"]),
    async createTreatmentClick() {
      if(!this.$refs.form.validate()) return;
      this.loader = true;
      if (this.patientBefore.length > 0) {
        this.treatment.patientBefore = [];
        this.patientBefore.forEach((v) => {
          let el = this.getSurveys.find((e) => e.id === v);
          this.treatment.patientBefore.push({ name: el.name, id: el.id });
        });
      }
      if (this.patientAfter.length > 0) {
        this.treatment.patientAfter = [];
        this.patientAfter.forEach((v) => {
          let el = this.getSurveys.find((e) => e.id === v);
          this.treatment.patientAfter.push({ name: el.name, id: el.id });
        });
      }
      if (this.doctorBefore.length > 0) {
        this.treatment.doctorBefore = [];
        this.doctorBefore.forEach((v) => {
          let el = this.getSurveys.find((e) => e.id === v);
          this.treatment.doctorBefore.push({ name: el.name, id: el.id });
        });
      }
      if (this.doctorAfter.length > 0) {
        this.treatment.doctorAfter = [];
        this.doctorAfter.forEach((v) => {
          let el = this.getSurveys.find((e) => e.id === v);
          this.treatment.doctorAfter.push({ name: el.name, id: el.id });
        });
      }
      if(!this.treatment.description) this.treatment.description = '';
      await this.createTreatment(this.treatment);
      this.loader = false;
      this.$refs.form.reset();
      setTimeout(() => {
        this.dialog = false;
      }, 1500);
    },
  },
  mounted() {
    this.fetchSurveys();
  },
};
</script>