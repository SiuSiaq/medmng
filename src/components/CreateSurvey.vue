<template>
  <v-dialog
    v-model="dialog"
    width="500"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" class="mr-2 mb-2" color="primary"
        >Stwórz ankietę</v-btn
      >
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
        <div
          v-if="!create"
          class="d-flex justify-center align-center"
          style="height: 250px"
        >
          <v-btn v-if="!next" large color="primary" @click="create = true"
            >stwórz ankietę</v-btn
          >
          <v-btn v-else large color="primary" @click="create = true"
            >stwórz kolejną ankietę</v-btn
          >
        </div>
        <div v-else>
          <v-row>
            <v-col cols="12" md="6">
              <div class="d-flex justify-end">
                <v-btn color="error" text @click="deleteSurveyClick"
                  >Usuń ankietę</v-btn
                >
              </div>
              <v-form
                v-model="valid"
                ref="surveyForm"
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
              </v-form>
            </v-col>
            <v-col
              cols="12"
              md="6"
              v-for="(field, i) in survey.fields"
              :key="i"
            >
              <div
                class="d-flex justify-end"
                @click="survey.fields.splice(i, 1)"
              >
                <v-btn color="error" text>Usuń pole</v-btn>
              </div>
              <NewField :field="field" />
            </v-col>
          </v-row>
          <div class="d-flex">
            <v-btn color="primary mb-5" @click="addFliedClick"
              >Dodaj pole</v-btn
            >
            <v-spacer></v-spacer>
            <v-btn color="primary mb-5" @click="saveClick" :loading="loader"
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
    create: false,
    loader: false,
    valid: true,
    survey: {
      name: "",
      treatment: "",
      description: "",
      fields: [],
    },
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
        data: null,
        name: "",
        description: "",
        required: true,
        type: "text",
        options: [
          {
            text: "",
          },
        ],
      });
    },
    async saveClick() {
      if (!this.$refs.surveyForm.validate()) return;
      this.loader = true;
      this.next = true;
      this.survey.fields.forEach((field) => {
        if (field.type !== "select" && field.type !== "radio")
          delete field.options;
      });
      await this.createSurvey(this.survey);
      this.loader = false;
      this.survey = {
        name: "",
        treatment: "",
        description: "",
        fields: [],
      };
      this.create = false;
    },
    deleteSurveyClick() {
      this.survey = {
        name: "",
        treatment: "",
        description: "",
        fields: [],
      };
      this.create = false;
    },
  },
};
</script>