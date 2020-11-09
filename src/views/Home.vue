<template>
  <v-container fluid>
    <v-card
      class="mx-auto mt-16"
      max-width="1100"
      elevation="24"
      rounded="xl"
    >
      <v-card-title class="text-h4 grey--text text--darken-2"
        >Ankiety</v-card-title
      >
      <v-card-text style="min-height: 300px">
        <v-list two-line>
          <v-list-item-group>
            <v-subheader>Do wypełnienia</v-subheader>
            <div class="text-subtitle-1 ml-5" v-if="getIncompletedPatientSurveys.length === 0">Brak ankiet do wypełnienia</div>
            <Survey v-for="survey in getIncompletedPatientSurveys" :key="survey.id" :survey="survey"/>
            <v-subheader>Wypełnione</v-subheader>
            <div class="text-subtitle-1 ml-5" v-if="getCompletedPatientSurveys.length === 0">Brak wypełnionych ankiet</div>
            <Survey v-for="survey in getCompletedPatientSurveys" :key="survey.id" :survey="survey"/>
          </v-list-item-group>
        </v-list>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import Survey from "@/components/Survey";
import { mapActions, mapGetters } from 'vuex';
export default {
  components: {
    Survey,
  },
  data: () => ({

  }),
  computed: mapGetters(['getCompletedPatientSurveys', 'getIncompletedPatientSurveys']),
  methods: {
    ...mapActions(['fetchPatientSurveys']),
  },
  mounted() {
    this.fetchPatientSurveys()
  }
};
</script>

<style scoped>
</style>
