<template>
  <v-container fluid>
    <v-card
      class="mx-auto mt-16"
      max-width="1100"
      elevation="24"
      rounded="xl"
    >
      <v-card-title class="grey--text text--darken-2"
        >Ankiety do wysłania
        <v-spacer></v-spacer>
        <v-autocomplete
          no-data-text="Brak ankiet"
          label="Szukaj"
          append-outer-icon="mdi-magnify"
          class="mr-3"
          :items="getSurveys"
          item-text="name"
          item-value="id"
          clearable
        ></v-autocomplete
      ></v-card-title>
      <v-card-text style="min-height: 300px">
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
      <v-card-actions>
        <v-spacer></v-spacer>
        <CreateSurvey />
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Survey from "@/components/Survey";
import CreateSurvey from "@/components/CreateSurvey";
export default {
  methods: {
    ...mapActions(["fetchSurveys"]),
  },
  computed: {
    ...mapGetters(["getSurveys"]),
  },
  components: {
    Survey,
    CreateSurvey,
  },
  mounted() {
    this.fetchSurveys();
  },
};
</script>
