<template>
  <v-container fluid :class="$vuetify.breakpoint.mobile ? 'pa-0' : ''">
    <v-row no-gutters v-if="!$vuetify.breakpoint.mobile">
      <v-col cols="12" md="3">
        <v-card
          class="px-4 pt-2"
          rounded="lg"
          height="100%"
          elevation="3"
        >
          <div class="d-flex align-center">
            <v-autocomplete
              no-data-text="Brak pacjentów w bazie danych"
              @change="searchSelect"
              offset-y
              v-model="searchPatientId"
              :items="getPatients"
              :item-text="searchOptionModel"
              item-value="id"
              label="Pacjent"
              prepend-icon="mdi-account-search-outline"
            ></v-autocomplete>
            <v-menu :close-on-content-click="true">
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon>
                  <v-icon>mdi-cog</v-icon>
                </v-btn>
              </template>

              <v-list>
                <v-list-item @click="searchOptionClick(i)" v-for="(option, i) in searchOptions" :key="i">
                  <v-list-item-title>{{ option.text }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
          <v-list three-line class="patientList">
            <v-list-item-group>
              <v-list-item
                @click="selectedPatient = patient"
                v-for="patient in getPatients"
                :key="patient.id"
              >
                <v-list-item-avatar class="white--text" color="primary">{{
                  patient.name[0]
                }}</v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ searchOptionModel === "fullname" ? patient.fullname : patient.pesel }}</v-list-item-title>
                  <v-list-item-subtitle
                    >{{ searchOptionModel === "fullname" ? patient.pesel : patient.fullname }} <br />
                    {{ patient.email }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="12" md="9">
        <div
          class="mt-5 mt-md-0 ml-md-5 patientPreview"
          height="100%"
          rounded="lg"
        >
          <v-row class="pa-5">
            <v-col cols="6">
              <div class="caption">Imię</div>
              <div>{{ selectedPatient.name }}</div>
            </v-col>
            <v-col cols="6">
              <div class="caption">Nazwisko</div>
              <div>{{ selectedPatient.surname }}</div>
            </v-col>
            <v-col cols="6">
              <div class="caption">Telefon</div>
              <div>{{ selectedPatient.phone }}</div>
            </v-col>
            <v-col cols="12" sm="6">
              <div class="caption">Email</div>
              <div>{{ selectedPatient.email }}</div>
            </v-col>
            <v-col cols="12" sm="6">
              <div class="caption">Zarejestrowany</div>
              <div>
                {{ registeredText }}
              </div>
            </v-col>
            <v-col cols="12">
              <v-list two-line>
                <v-list-item-group>
                  <v-subheader>Do wypełnienia</v-subheader>
                  <div
                    class="text-subtitle-1 ml-5"
                    v-if="patientIncompleted.length === 0"
                  >
                    Brak ankiet do wypełnienia
                  </div>
                  <Survey
                    v-for="survey in patientIncompleted"
                    :key="survey.id"
                    :survey="survey"
                  />
                  <v-subheader>Wypełnione</v-subheader>
                  <div
                    class="text-subtitle-1 ml-5"
                    v-if="patientCompleted.length === 0"
                  >
                    Brak wypełnionych ankiet
                  </div>
                  <Survey
                    v-for="survey in patientCompleted"
                    :key="survey.id"
                    :survey="survey"
                  />
                </v-list-item-group>
              </v-list>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>

    <div v-else class="patientsPage">
      <v-tabs v-model="tab" background-color="primary" color="white" grow>
        <v-tab v-for="item in ['Lista', 'Pacjent']" :key="item">
          {{ item }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item class="pa-4">
          <div class="d-flex align-center">
            <v-autocomplete
              no-data-text="Brak pacjentów w bazie danych"
              @change="searchSelect"
              offset-y
              v-model="searchPatientId"
              :items="getPatients"
              :item-text="searchOptionModel"
              item-value="id"
              label="Pacjent"
              prepend-icon="mdi-account-search-outline"
            ></v-autocomplete>
            <v-menu :close-on-content-click="true">
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon>
                  <v-icon>mdi-cog</v-icon>
                </v-btn>
              </template>

              <v-list>
                <v-list-item @click="searchOptionClick(i)" v-for="(option, i) in searchOptions" :key="i">
                  <v-list-item-title>{{ option.text }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
          <v-list three-line style="overflow-y: scroll;">
            <v-list-item-group>
              <v-list-item
                @click="selectedPatient = patient"
                v-for="patient in getPatients"
                :key="patient.id"
              >
                <v-list-item-avatar class="white--text" color="primary">{{
                  patient.name[0]
                }}</v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ searchOptionModel === "fullname" ? patient.fullname : patient.pesel }}</v-list-item-title>
                  <v-list-item-subtitle
                    >{{ searchOptionModel === "fullname" ? patient.pesel : patient.fullname }} <br />
                    {{ patient.email }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list> </v-tab-item
        ><v-tab-item>
          <v-row class="pa-5" style="max-width: 100%">
            <v-col cols="6">
              <div class="caption">Imię</div>
              <div>{{ selectedPatient.name }}</div>
            </v-col>
            <v-col cols="6">
              <div class="caption">Nazwisko</div>
              <div>{{ selectedPatient.surname }}</div>
            </v-col>
            <v-col cols="6">
              <div class="caption">Telefon</div>
              <div>{{ selectedPatient.phone }}</div>
            </v-col>
            <v-col cols="12">
              <div class="caption">Email</div>
              <div>{{ selectedPatient.email }}</div>
            </v-col>
            <v-col cols="12">
              <div class="caption">Zarejestrowany</div>
              <div>
                {{ registeredText }}
              </div>
            </v-col>
            <v-col cols="12">
              <v-list two-line>
                <v-list-item-group>
                  <v-subheader>Do wypełnienia</v-subheader>
                  <div
                    class="text-subtitle-1 ml-5"
                    v-if="patientIncompleted.length === 0"
                  >
                    Brak ankiet do wypełnienia
                  </div>
                  <Survey
                    v-for="survey in patientIncompleted"
                    :key="survey.id"
                    :survey="survey"
                  />
                  <v-subheader>Wypełnione</v-subheader>
                  <div
                    class="text-subtitle-1 ml-5"
                    v-if="patientCompleted.length === 0"
                  >
                    Brak wypełnionych ankiet
                  </div>
                  <Survey
                    v-for="survey in patientCompleted"
                    :key="survey.id"
                    :survey="survey"
                  />
                </v-list-item-group>
              </v-list>
            </v-col>
          </v-row> </v-tab-item
      ></v-tabs-items>
    </div>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Survey from "@/components/Survey";
export default {
  components: {
    Survey,
  },
  data: () => ({
    searchOptions: [
      {
        text: "Imię i nazwisko",
        value: "fullname",
      },
      {
        text: "PESEL",
        value: "pesel",
      },
    ],
    searchOption: {
        text: "Imię i nazwisko",
        value: "fullname",
      },
    searchOptionModel: 'fullname',
    tab: 0,
    selectedPatient: {
      name: "",
      surname: "",
      phone: "",
      email: "",
    },
    searchPatientId: null,
    patientCompleted: [],
    patientIncompleted: [],
  }),
  methods: {
    ...mapActions(["fetchPatientDataSurveys"]),
    searchSelect() {
      if (this.searchPatientId !== undefined) {
        this.selectedPatient = this.getPatients.find((v) => {
          return v.id === this.searchPatientId;
        });
      }
    },
    searchOptionClick(i) {
      this.searchOptionModel = this.searchOptions[i].value;
    }
  },
  computed: {
    ...mapGetters(["getPatients"]),
    registeredText() {
      if (this.selectedPatient.registered) {
        const date = this.selectedPatient.registered.toDate();
        let dd = String(date.getDate()).padStart(2, "0");
        let mm = String(date.getMonth() + 1).padStart(2, "0");
        let yy = date.getFullYear();
        return `${dd}-${mm}-${yy}`;
      } else {
        return "Brak";
      }
    },
  },
  watch: {
    async selectedPatient(val) {
      if (val) {
        let surveys = await this.fetchPatientDataSurveys(val.id);
        if (surveys) {
          this.patientCompleted = [...surveys.completed].sort((a, b) => {
            return a.sentDate.toDate() - b.sentDate.toDate();
          });
          this.patientIncompleted = [...surveys.incompleted].sort((a, b) => {
            return a.sentDate.toDate() - b.sentDate.toDate();
          });
        }
      }
    },
  },
  mounted() {
    if (this.getPatients.length > 0) {
      this.selectedPatient = this.getPatients[0];
      this.searchPatientId = this.getPatients[0].id;
    }
  },
};
</script>

<style scoped>
.patientsPage {
  height: 100%;
  background: #fff;
}
.patientPreview {
  max-height: 87vh;
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.patientPreview::-webkit-scrollbar {
  display: none;
}

.patientList {
  overflow-y: scroll;
  max-height: 74vh;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.patientList::-webkit-scrollbar {
  display: none;
}
</style>
