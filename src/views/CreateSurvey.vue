<template>
  <v-container fluid class="back">
    <v-card
      rounded="xl"
      elevation="24"
      class="mx-auto mt-14 px-3"
      max-width="1300"
      min-height="400"
    >
      <v-card-title class="text-center grey--text text--darken-2"
        >Nowa ankieta</v-card-title
      >
      <div
        v-if="!create"
        class="d-flex justify-center align-center"
        style="height: 250px"
      >
        <v-btn large color="primary" @click="create = true"
          >stwórz ankietę</v-btn
        >
      </div>
      <div v-else>
        <v-card-text>
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
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary mb-5" @click="addFliedClick">Dodaj pole</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary mb-5" @click="saveClick" :loading="loader"
            >Zapisz ankietę</v-btn
          >
        </v-card-actions>
      </div>
    </v-card>
  </v-container>
</template>

<script>
import NewField from "@/components/NewField";
import { mapActions } from "vuex";
export default {
  components: {
    NewField,
  },
  data: () => ({
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
      await this.createSurvey(this.survey);
      this.loader = false;
    },
    deleteSurveyClick() {
      this.survey = {
        name: "",
        treatment: "",
        description: "",
        fields: [],
      };
      this.create = false
    },
  },
};
</script>

<style scoped>
.back {
  height: 91vh;
  background: #1976d2;
}
.borderClass {
  border-bottom: 3px solid #1976d2;
  border-right: 3px solid #1976d2;
  border-bottom-right-radius: 25px;
}
</style>