<template>
  <v-container fluid :class="$vuetify.breakpoint.mobile ? 'pa-0' : ''">
    <v-card
      v-if="!$vuetify.breakpoint.mobile"
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
            <div
              class="text-subtitle-1 ml-5"
              v-if="getIncompletedPatientSurveys.length === 0"
            >
              Brak ankiet do wypełnienia
            </div>
            <Survey
              v-for="survey in getIncompletedPatientSurveys"
              :key="survey.id"
              :survey="survey"
            />
            <v-subheader>Wypełnione</v-subheader>
            <div
              class="text-subtitle-1 ml-5"
              v-if="getCompletedPatientSurveys.length === 0"
            >
              Brak wypełnionych ankiet
            </div>
            <Survey
              v-for="survey in getCompletedPatientSurveys"
              :key="survey.id"
              :survey="survey"
            />
          </v-list-item-group>
        </v-list>
      </v-card-text>
    </v-card>
    <div v-else class="homePage">
      <v-tabs v-model="tab" background-color="primary" color="white" grow>
        <v-tab v-for="item in ['Do wypełnienia', 'Wypełnione']" :key="item">
          {{ item }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item class="pa-4">
          <v-list two-line>
            <v-list-item-group>
              <div
                class="text-h6 text-center font-weight-regular"
                v-if="getIncompletedPatientSurveys.length === 0"
              >
                Brak ankiet do wypełnienia
              </div>
              <Survey
                v-for="survey in getIncompletedPatientSurveys"
                :key="survey.id"
                :survey="survey"
              /> </v-list-item-group
          ></v-list>
        </v-tab-item>
        <v-tab-item class="pa-4">
          <v-list two-line>
            <v-list-item-group>
              <div
                class="text-h6 text-center font-weight-regular"
                v-if="getCompletedPatientSurveys.length === 0"
              >
                Brak wypełnionych ankiet
              </div>
              <Survey
                v-for="survey in getCompletedPatientSurveys"
                :key="survey.id"
                :survey="survey"
              />
            </v-list-item-group>
          </v-list>
        </v-tab-item>
      </v-tabs-items>
    </div>
  </v-container>
</template>

<script>
import Survey from "@/components/Survey";
import { mapGetters } from "vuex";
export default {
  components: {
    Survey,
  },
  data: () => ({
    tab: 0,
  }),
  computed: {
    ...mapGetters([
      "getCompletedPatientSurveys",
      "getIncompletedPatientSurveys",
    ]),
  }
};
</script>

<style scoped>
.homePage {
  height: 100%;
  background: #fff;
}
</style>
