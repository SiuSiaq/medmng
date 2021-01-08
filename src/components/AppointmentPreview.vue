<template>
  <v-row class="pt-5 px-3 ml-5">
    <v-col cols="12" md="6">
      <div class="caption">Pacjent</div>
      <div class="mb-2">{{ appointment.patient }}</div>
      <div class="caption">Zabieg</div>
      <div class="mb-2">{{ appointment.name }}</div>
      <div class="caption">Termin</div>
      <div class="mb-6">
        {{
          appointment.date
            .toDate()
            .toISOString()
            .slice(0, 10)
        }}
      </div>
    </v-col>
    <v-col cols="12" md="6">
      <v-list>
        <v-list-item-group>
          <v-subheader>Niewypełnione</v-subheader>
          <div class="text-subtitle-1 ml-5" v-if="false">
            Brak niewypełnionych
          </div>
          <v-list-item
            v-for="survey in surveys.filter((v) => !v.completed)"
            :key="survey.id"
          >
            <v-list-item-avatar>
              <v-icon class="primary white--text">
                {{
                  survey.type === "doctor"
                    ? "mdi-doctor"
                    : "mdi-account-outline"
                }}
              </v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ survey.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
        <v-list-item-group>
          <v-subheader>Wypełnione</v-subheader>
          <div class="text-subtitle-1 ml-5" v-if="false">
            Brak wypełnionych ankiet
          </div>
          <v-list-item
            v-for="survey in surveys.filter((v) => v.completed)"
            :key="survey.id"
          >
            <v-list-item-avatar>
              <v-icon class="success white--text">
                {{
                  survey.type === "doctor"
                    ? "mdi-doctor"
                    : "mdi-account-outline"
                }}
              </v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ survey.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  props: ["appointment"],
  data: () => ({
    dialog: false,
    surveys: [],
  }),
  methods: {
    ...mapActions(["fetchAppointmentSurveys"]),
    async loadSurveys() {
      this.surveys = [];
      if (this.appointment)
        this.surveys = await this.fetchAppointmentSurveys(this.appointment.id);
    },
  },
  computed: {
    ...mapGetters(["getSurveyAlert"]),
  },
  watch: {
    appointment() {
      this.loadSurveys();
    },
  },
  mounted() {
    this.loadSurveys();
  }
};
</script>
