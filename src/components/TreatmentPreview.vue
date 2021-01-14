<template>
  <v-row class="mx-3 pt-md-4">
    <v-col cols="12" md="4">
      <div class="mb-4 text-md-h4 text-h5 grey--text text--darken-2">
        Informacje
      </div>
      <div class="ml-3">
        <div class="caption">Nazwa zabiegu</div>
        <div>{{ treatment.name }}</div>
        <div class="mt-2 caption">Opis</div>
        <div>
          {{ treatment.description ? treatment.description : "Brak opisu" }}
        </div>
      </div>
    </v-col>
    <v-col cols="12" md="4">
      <div class="mb-4 text-md-h4 text-h5 grey--text text--darken-2">
        Dla pacjenta
      </div>
      <v-list two-line>
        <v-list-item-group>
          <div v-for="time in times" :key="time.time">
            <div
              v-if="
                treatment.patientSurveys.filter((v) => v.timeType === time.time)
                  .length > 0
              "
            >
              <v-subheader>{{ time.text }}</v-subheader>
              <v-list-item
                v-for="survey in treatment.patientSurveys.filter(
                  (v) => v.timeType === time.time
                )"
                :key="survey.id"
              >
                <v-list-item-avatar>
                  <v-icon class="primary white--text">
                    mdi-clipboard-outline
                  </v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ survey.name }}</v-list-item-title>
                  <v-list-item-subtitle
                    v-if="time.time === 'Przed' || time.time === 'Po'"
                    >{{ survey.days }} dni
                    {{ time.time.toLowerCase() }}</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
            </div>
          </div>
        </v-list-item-group>
      </v-list>
    </v-col>
    <v-col cols="12" md="4">
      <div class="mb-4 text-md-h4 text-h5 grey--text text--darken-2">
        Dla doktora
      </div>
      <v-list two-line>
        <v-list-item-group>
          <div v-for="time in times" :key="time.time">
            <div
              v-if="
                treatment.doctorSurveys.filter((v) => v.timeType === time.time)
                  .length > 0
              "
            >
              <v-subheader>{{ time.text }}</v-subheader>
              <v-list-item
                v-for="survey in treatment.doctorSurveys.filter(
                  (v) => v.timeType === time.time
                )"
                :key="survey.id"
              >
                <v-list-item-avatar>
                  <v-icon class="primary white--text">
                    mdi-clipboard-outline
                  </v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ survey.name }}</v-list-item-title>
                  <v-list-item-subtitle
                    v-if="time.time === 'Przed' || time.time === 'Po'"
                    >{{ survey.days }} dni
                    {{ time.time.toLowerCase() }}</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
            </div>
          </div>
        </v-list-item-group>
      </v-list>
    </v-col>
    <v-col cols="12">
      <v-btn
        v-if="getUserData.doctor"
        color="primary"
        :loading="downloadLoader"
        @click="downloadClick"
        >Pobierz</v-btn
      >
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data: () => ({
    times: [
      {
        time: "Przed",
        text: "Przed zabiegiem",
      },
      {
        time: "Natychmiast",
        text: "Natychmiast przy umówieniu",
      },
      {
        time: "W dniu wykonania",
        text: "W dniu wykonania",
      },
      {
        time: "Po",
        text: "Po zabiegu",
      },
    ],
    downloadLoader: false,
  }),
  props: ["treatment"],
  methods: {
    ...mapActions(["downloadTreatmentData"]),
    async downloadClick() {
      this.downloadLoader = true;
      let treatmentData = await this.downloadTreatmentData(this.treatment.id);
      if (!treatmentData) {
        this.downloadLoader = false;
        return;
      }
      const data = JSON.stringify(treatmentData);
      const blob = new Blob([data], { type: "text/plain" });
      const e = document.createEvent("MouseEvents"),
        a = document.createElement("a");
      a.download = `${this.treatment.name}.json`;
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = [
        `${this.treatment.name}/json`,
        a.download,
        a.href,
      ].join(":");
      this.downloadLoader = false;
      e.initEvent(
        "click",
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      );
      a.dispatchEvent(e);
    },
  },
  computed: {
    ...mapGetters(["getUserData"]),
  },
};
</script>

<style></style>
