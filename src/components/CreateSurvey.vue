<template>
  <v-dialog
    v-model="dialog"
    width="500"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        class="mb-2 mr-2"
        fixed
        bottom
        right
        fab
        color="primary"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon large>mdi-plus-circle</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Stwórz ankietę</v-toolbar-title>
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
      <div class="mx-md-16 mt-md-10 mt-3">
        <div>
          <v-row class="px-5">
            <v-col cols="12" md="6">
              <div class="d-flex justify-end">
                <v-btn color="error" text @click="deleteSurveyClick"
                  >Usuń ankietę</v-btn
                >
              </div>
              <v-form
                v-model="valid"
                ref="surveyForm"
                :disabled="loader"
                class="pr-2"
                :class="!$vuetify.breakpoint.mobile ? 'borderClass' : ''"
              >
                <v-text-field
                  outlined
                  class="mb-2"
                  v-model="survey.name"
                  :counter="100"
                  :rules="nameRules"
                  label="Nazwa ankiety"
                  required
                ></v-text-field>
                <v-text-field
                  outlined
                  class="mb-2"
                  v-model="survey.treatment"
                  :counter="100"
                  :rules="treatmentRules"
                  label="Nazwa zabiegu"
                  required
                ></v-text-field>
                <v-textarea
                  outlined
                  rows="1"
                  v-model="survey.description"
                  auto-grow
                  clearable
                  label="Opis ankiety (opcjonalny)"
                >
                </v-textarea>
                <div class="d-flex mt-n3">
                  <v-checkbox
                    v-model="survey.summable"
                    label="Podsumowalna"
                  ></v-checkbox>
                  <div :hidden="!survey.summable">
                    <v-checkbox
                      v-model="groupSummable"
                      label="Grupowe sumowanie"
                      class="ml-3"
                    ></v-checkbox>
                  </div>
                </div>
              </v-form>
            </v-col>
            <v-col
              cols="12"
              md="6"
              v-for="(field, i) in survey.fields"
              :key="i"
            >
              <div class="d-flex justify-end">
                <v-btn text color="primary" @click="copyFliedClick(i)"
                  >Kopiuj pole</v-btn
                >
                <v-btn color="error" text @click="survey.fields.splice(i, 1)"
                  >Usuń pole</v-btn
                >
              </div>
              <NewField :field="field" :number="i" />
            </v-col>
          </v-row>
          <div class="d-flex px-5">
            <v-btn color="primary mb-5" @click="addFliedClick"
              >Dodaj pole</v-btn
            >
            <v-spacer></v-spacer>
            <v-btn
              color="primary mb-5"
              :disabled="!valid"
              @click="saveClick"
              :loading="loader"
              >Utwórz ankietę</v-btn
            >
          </div>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import NewField from "@/components/NewField";
import { mapGetters, mapActions } from "vuex";
export default {
  components: {
    NewField,
  },
  data: () => ({
    dialog: false,
    next: false,
    loader: false,
    valid: true,
    survey: {
      name: "",
      treatment: "",
      description: "",
      fields: [],
      summable: false,
      groupSummable: false,
    },
    groupSummable: false,
    nameRules: [
      (v) => !!v || "Nazwa ankiety jest wymagana",
      (v) =>
        (v && v.length <= 100) ||
        "Nazwa ankiety musi być krótsza niż 100 znaków",
    ],
    treatmentRules: [
      (v) => !!v || "Nazwa zabiegu, którego dotyczy ankieta jest wymagana",
      (v) =>
        (v && v.length <= 100) ||
        "Nazwa zabiegu musi być krótsza niż 100 znaków",
    ],
  }),
  computed: mapGetters(["getSurveyAlert"]),
  methods: {
    ...mapActions(["createSurvey"]),
    addFliedClick() {
      this.survey.fields.push({
        group: null,
        groupSummable: this.survey.groupSummable && this.survey.summable,
        data: null,
        name: "",
        description: "",
        required: true,
        type: "text",
        options: [
          {
            text: "",
            value: "",
          },
          {
            text: "",
            value: "",
          },
          {
            text: "",
            value: "",
          },
        ],
      });
    },
    copyFliedClick(i) {
      let copiedField = Object.assign({}, this.survey.fields[i]);
      this.survey.fields.splice(i + 1, 0, copiedField);
    },
    async saveClick() {
      if (!this.$refs.surveyForm.validate()) return;
      this.loader = true;
      this.next = true;
      this.survey.fields.forEach((field) => {
        if (field.type !== "select" && field.type !== "radio") {
          delete field.options;
        } else {
          if (field.options[0].value.length === 0) {
            field.options.forEach((opt) => {
              opt.value = opt.text;
            });
          }
        }
      });
      await this.createSurvey(this.survey);
      this.loader = false;
      setTimeout(() => {
        this.dialog = false;
        this.$refs.surveyForm.reset();
        this.survey.fields = [];
      }, 1500);
    },
    deleteSurveyClick() {
      this.$refs.surveyForm.reset();
      this.survey.fields = [];
    },
  },
  watch: {
    groupSummable(val) {
      this.survey.groupSummable = val;
      this.survey.fields.forEach((field) => {
        field.groupSummable = val;
      });
    },
  },
};
</script>
