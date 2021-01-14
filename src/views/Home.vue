<template>
  <v-container
    class="homePage pa-0"
    fluid
  >
    <div v-if="!$vuetify.breakpoint.mobile" style="width: 100%; height: 100px;" class="primary mx-0 pt-4 pl-6">
      <div class="text-h3 font-weight-medium white--text">Ankiety</div>
    </div>
    <v-row v-if="!$vuetify.breakpoint.mobile" class="mx-auto mt-3 px-5" max-width="1100">
      <v-col cols="12" md="6">
        <div class="text-h6 font-weight-regular">Do wypełnienia</div>
        <v-list two-line>
          <v-list-item-group>
            <div
              class="text-subtitle-1 ml-5"
              v-if="getIncompletedUserSurveys.length === 0"
            >
              Brak ankiet do wypełnienia
            </div>
            <Survey
              v-for="survey in getIncompletedUserSurveys"
              :key="survey.id"
              :survey="survey"
            /> </v-list-item-group
        ></v-list>
      </v-col>
      <v-col cols="12" md="6">
        <div class="text-h6 font-weight-regular">Wypełnione</div>
        <v-list two-line>
          <v-list-item-group>
            <div
              class="text-subtitle-1 ml-5"
              v-if="getCompletedUserSurveys.length === 0"
            >
              Brak wypełnionych ankiet
            </div>
            <Survey
              v-for="survey in getCompletedUserSurveys"
              :key="survey.id"
              :survey="survey"
            /> </v-list-item-group
        ></v-list>
      </v-col>
    </v-row>
    <div v-else>
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
                v-if="getIncompletedUserSurveys.length === 0"
              >
                Brak ankiet do wypełnienia
              </div>
              <Survey
                v-for="survey in getIncompletedUserSurveys"
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
                v-if="getCompletedUserSurveys.length === 0"
              >
                Brak wypełnionych ankiet
              </div>
              <Survey
                v-for="survey in getCompletedUserSurveys"
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
    ...mapGetters(["getCompletedUserSurveys", "getIncompletedUserSurveys"]),
  },
};
</script>

<style scoped>
.homePage {
  height: 100%;
  background: #fff;
}
</style>
