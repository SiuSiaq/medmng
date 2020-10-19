<template>
  <v-container fluid class="home">
    <v-card
      class="mx-auto mt-16"
      max-width="800"
      :height="!$vuetify.breakpoint.mobile ? '400' : '500'"
      elevation="24"
      rounded="xl"
    >
      <v-card-title class="grey--text text--darken-2"
        >Ankiety</v-card-title
      >
      <v-card-text>
        <v-list two-line>
          <v-list-item-group>
            <v-subheader inset v-if="getIncompletedPatientSurveys.length > 0">Do wypełnienia</v-subheader>
            <Survey v-for="(survey, i) in getIncompletedPatientSurveys" :key="i" :survey="survey"/>
            <v-divider inset v-if="getIncompletedPatientSurveys.length > 0 && getCompletedPatientSurveys.length > 0"></v-divider>
            <v-subheader inset v-if="getCompletedPatientSurveys.length > 0">Wypełnione</v-subheader>
            <Survey v-for="(survey, i) in getCompletedPatientSurveys" :key="i" :survey="survey"/>
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
.home {
  height: 90vh;
}
</style>
