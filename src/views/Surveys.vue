<template>
  <v-container fluid class="surveys">
    <v-card
      class="mx-auto mt-16"
      max-width="800"
      :height="!$vuetify.breakpoint.mobile ? '400' : '500'"
      elevation="24"
      rounded="xl"
    >
      <v-card-title class="grey--text text--darken-2"
        >Ankiety do wysłania
        <v-spacer></v-spacer>
        <v-autocomplete
          label="Szukaj"
          append-outer-icon="mdi-magnify"
          class="mr-3"
          :items="getSurveys"
          item-text="name"
          item-value="id"
          clearable
        ></v-autocomplete
      ></v-card-title>
      <v-card-text>
        <v-list three-line>
          <v-list-item-group>
            <Survey
              :sendable="true"
              :survey="survey"
              v-for="survey in getSurveys"
              :key="survey.id"
            />
          </v-list-item-group>
        </v-list>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Survey from "@/components/Survey";
export default {
  methods: {
    ...mapActions(["fetchSurveys", 'fetchPatients']),
  },
  computed: {
    ...mapGetters(["getSurveys"]),
  },
  components: {
    Survey,
  },
  mounted() {
    this.fetchSurveys();
    this.fetchPatients();
  },
};
</script>

<style scoped>
.surveys {
  height: 91vh;
  background: #1976d2;
}
</style>
