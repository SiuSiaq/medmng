<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col cols="12" md="3">
        <v-card class="px-4 pt-2">
          <v-autocomplete
            no-data-text="Brak pacjentów w bazie danych"
            @change="searchSelect"
            offset-y
            v-model="searchPatientId"
            :items="getPatients"
            item-text="fullname"
            item-value="id"
            label="Pacjent"
            prepend-icon="mdi-account-search-outline"
          ></v-autocomplete>
          <v-list
            v-if="!$vuetify.breakpoint.mobile"
            three-line
            style="height:76vh; overflow-y: scroll;"
          >
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
                  <v-list-item-title>{{ patient.fullname }}</v-list-item-title>
                  <v-list-item-subtitle
                    >{{ patient.phone }} <br />
                    {{ patient.email }}</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="12" md="9">
        <v-card class="mt-5 mt-md-0 ml-md-5">
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
          </v-row>
          <v-row>
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
        </v-card>
      </v-col>
    </v-row>
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
          this.patientCompleted = surveys.completed;
          this.patientIncompleted = surveys.incompleted;
        }
      }
    },
  },
};
</script>
