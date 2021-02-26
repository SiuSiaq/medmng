<template>
  <v-container fluid :class="$vuetify.breakpoint.mobile ? 'pa-0' : ''">
    <v-row no-gutters v-if="!$vuetify.breakpoint.mobile" style="height: 100%;">
      <CreateSurvey />
      <v-col cols="12" md="3">
        <v-card class="px-4 pt-2" rounded="lg" height="100%" elevation="3">
          <v-autocomplete
            no-data-text="Brak ankiet w bazie danych"
            @change="searchSelect"
            offset-y
            v-model="searchSurveyId"
            :items="getSurveys"
            item-text="name"
            item-value="id"
            label="Ankieta"
            prepend-icon="mdi-account-search-outline"
          ></v-autocomplete>
          <v-list three-line class="surveyList">
            <v-list-item-group>
              <v-list-item
                @click="selectedSurvey = survey"
                v-for="survey in getSurveys"
                :key="survey.id"
              >
                <v-list-item-avatar>
                  <v-icon class="white--text primary">
                    mdi-clipboard-outline
                  </v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ survey.name }}</v-list-item-title>
                  <v-list-item-subtitle
                    >{{ survey.date }}<br />
                    {{
                      survey.description.length > 0
                        ? survey.description
                        : "Brak opisu"
                    }}</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="12" md="9">
        <div
          class="mt-5 mt-md-0 ml-md-5 surveyPreview"
          rounded="lg"
          height="100%"
        >
          <SurveyPreview :survey="selectedSurvey" />
        </div>
      </v-col>
    </v-row>

    <div v-else class="surveysPage">
      <CreateSurvey />
      <v-tabs v-model="tab" background-color="primary" color="white" grow>
        <v-tab v-for="item in ['Lista', 'Ankieta']" :key="item">
          {{ item }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item class="pa-4">
          <v-autocomplete
            no-data-text="Brak ankiet w bazie danych"
            @change="searchSelect"
            offset-y
            v-model="searchSurveyId"
            :items="getSurveys"
            item-text="name"
            item-value="id"
            label="Ankieta"
            prepend-icon="mdi-account-search-outline"
          ></v-autocomplete>
          <v-list three-line style="overflow-y: scroll;">
            <v-list-item-group>
              <v-list-item
                @click="selectedSurvey = survey"
                v-for="survey in getSurveys"
                :key="survey.id"
              >
                <v-list-item-avatar>
                  <v-icon class="white--text primary">
                    mdi-clipboard-outline
                  </v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ survey.name }}</v-list-item-title>
                  <v-list-item-subtitle
                    >{{ survey.date }}<br />
                    {{
                      survey.description.length > 0
                        ? survey.description
                        : "Brak opisu"
                    }}</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-tab-item>
        <v-tab-item>
          <div style="max-width: 100%;">
            <SurveyPreview :survey="selectedSurvey" />
          </div> </v-tab-item
      ></v-tabs-items>
    </div>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import SurveyPreview from "@/components/SurveyPreview";
import CreateSurvey from "@/components/CreateSurvey";
export default {
  components: {
    SurveyPreview,
    CreateSurvey,
  },
  data: () => ({
    tab: 0,
    first: false,
    selectedSurvey: {
      description: "",
    },
    searchSurveyId: null,
  }),
  methods: {
    ...mapActions([]),
    searchSelect() {
      if (this.searchSurveyId !== undefined) {
        this.selectedSurvey = this.getSurveys.find((v) => {
          return v.id === this.searchSurveyId;
        });
      }
    },
  },
  computed: {
    ...mapGetters(["getSurveys"]),
  },
  mounted() {
    if (this.getSurveys.length > 0) {
      this.selectedSurvey = this.getSurveys[0];
      this.searchSurveyId = this.getSurveys[0].id;
    }
  },
  watch: {
    selectedSurvey(val) {
      if (!this.first) this.first = true;
      else {
        this.searchSurveyId = val.id;
        this.tab = 1;
      }
    },
  },
};
</script>

<style scoped>
.surveysPage {
  height: 100%;
  background: #fff;
}

.surveyPreview {
  max-height: 87vh;
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.surveyPreview::-webkit-scrollbar {
  display: none;
}

.surveyList {
  overflow-y: scroll;
  max-height: 74vh;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.surveyList::-webkit-scrollbar {
  display: none;
}
</style>
