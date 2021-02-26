<template>
  <v-container fluid :class="$vuetify.breakpoint.mobile ? 'pa-0' : ''">
    <v-row no-gutters v-if="!$vuetify.breakpoint.mobile" style="height: 100%">
      <CreateTreatment />
      <v-col cols="12" md="3">
        <v-card class="px-4 pt-2" elevation="3" rounded="lg" height="100%">
          <v-autocomplete
            no-data-text="Brak zabiegów w bazie danych"
            @change="searchSelect"
            offset-y
            v-model="searchTreatmentId"
            :items="getTreatments"
            item-text="name"
            item-value="id"
            label="Zabieg"
            prepend-icon="mdi-account-search-outline"
          ></v-autocomplete>
          <v-list three-line class="treatmentList">
            <v-list-item-group>
              <v-list-item
                @click="selectedTreatment = treatment"
                v-for="treatment in getTreatments"
                :key="treatment.id"
              >
                <v-list-item-avatar>
                  <v-icon class="primary white--text"> mdi-medical-bag </v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ treatment.name }}</v-list-item-title>
                  <v-list-item-subtitle
                    >{{
                      treatment.created instanceof Date
                        ? treatment.created.toISOString().slice(0, 10)
                        : treatment.created
                            .toDate()
                            .toISOString()
                            .slice(0, 10)
                    }}<br />
                    {{
                      treatment.description.length > 0
                        ? treatment.description
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
          class="mt-5 mt-md-0 ml-md-5 treatmentPreview"
          rounded="lg"
          height="100%"
        >
          <TreatmentPreview :treatment="selectedTreatment" />
        </div>
      </v-col>
    </v-row>

    <div v-else class="treatmentsPage">
      <CreateTreatment />
      <v-tabs v-model="tab" background-color="primary" color="white" grow>
        <v-tab v-for="item in ['Lista', 'Zabieg']" :key="item">
          {{ item }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item class="pa-4">
          <v-autocomplete
            no-data-text="Brak zabiegów w bazie danych"
            @change="searchSelect"
            offset-y
            v-model="searchTreatmentId"
            :items="getTreatments"
            item-text="name"
            item-value="id"
            label="Zabieg"
            prepend-icon="mdi-account-search-outline"
          ></v-autocomplete>
          <v-list three-line style="overflow-y: scroll;">
            <v-list-item-group>
              <v-list-item
                @click="selectedTreatment = treatment"
                v-for="treatment in getTreatments"
                :key="treatment.id"
              >
                <v-list-item-avatar>
                  <v-icon class="primary white--text"> mdi-medical-bag </v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ treatment.name }}</v-list-item-title>
                  <v-list-item-subtitle
                    >{{
                      treatment.created instanceof Date
                        ? treatment.created.toISOString().slice(0, 10)
                        : treatment.created
                            .toDate()
                            .toISOString()
                            .slice(0, 10)
                    }}<br />
                    {{
                      treatment.description.length > 0
                        ? treatment.description
                        : "Brak opisu"
                    }}</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list> </v-tab-item
        ><v-tab-item>
          <div style="max-width: 100%">
            <TreatmentPreview :treatment="selectedTreatment" />
          </div> </v-tab-item
      ></v-tabs-items>
    </div>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import TreatmentPreview from "@/components/TreatmentPreview";
import CreateTreatment from "@/components/CreateTreatment";
export default {
  components: {
    TreatmentPreview,
    CreateTreatment,
  },
  data: () => ({
    tab: 0,
    first: false,
    selectedTreatment: {
      patientSurveys: [],
      doctorSurveys: [],
    },
    searchTreatmentId: null,
  }),
  methods: {
    ...mapActions([]),
    searchSelect() {
      if (this.searchTreatmentId !== undefined) {
        this.selectedTreatment = this.getTreatments.find((v) => {
          return v.id === this.searchTreatmentId;
        });
      }
    },
  },
  computed: {
    ...mapGetters(["getTreatments"]),
  },
  mounted() {
    if (this.getTreatments.length > 0) {
      this.selectedTreatment = this.getTreatments[0];
      this.searchTreatmentId = this.getTreatments[0].id;
    }
  },
  watch: {
    selectedTreatment(val) {
      if (!this.first) this.first = true;
      else {
        this.searchTreatmentId = val.id;
        this.tab = 1;
      }
    },
  },
};
</script>

<style scoped>
.treatmentsPage {
  height: 100%;
  background: #fff;
}

.treatmentPreview {
  max-height: 87vh;
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.treatmentPreview::-webkit-scrollbar {
  display: none;
}

.treatmentList {
  overflow-y: scroll;
  max-height: 74vh;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.treatmentList::-webkit-scrollbar {
  display: none;
}
</style>
