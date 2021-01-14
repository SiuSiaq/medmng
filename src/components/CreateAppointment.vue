<template>
  <v-dialog
    v-model="dialog"
    width="500"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn class="mr-md-4 mb-md-4" fixed bottom right fab color="primary" v-bind="attrs" v-on="on">
        <v-icon large>mdi-plus-circle</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Umów zabieg</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-alert
        transition="slide-y-transition"
        dense
        :type="getSurveyAlert.success ? 'success' : 'error'"
        rounded="0"
        v-model="getSurveyAlert.show"
      >
        {{ getSurveyAlert.text }}
      </v-alert>

      <v-form
        class="mt-15 px-3 mx-auto"
        style="max-width: 600px"
        ref="form"
        v-model="valid"
      >
        <div class="caption">Pacjent</div>
        <v-autocomplete
          no-data-text="Brak pacjentów"
          outlined
          :rules="[(v) => !!v || `Pacjent jest wymagany`]"
          :items="getPatients"
          v-model="patient"
          item-text="fullname"
          item-value="id"
        >
        </v-autocomplete>
        <div class="caption">Doktor</div>
        <v-autocomplete
          no-data-text="Brak doktorów"
          outlined
          :rules="[(v) => !!v || `Doktor jest wymagany`]"
          :items="getDoctors"
          v-model="doctor"
          item-text="fullname"
          item-value="id"
        >
        </v-autocomplete>
        <div class="caption">Zabieg</div>
        <v-autocomplete
          no-data-text="Brak zabiegów"
          outlined
          :rules="[(v) => !!v || `Zabieg jest wymagany`]"
          :items="getTreatments"
          v-model="treatment"
          item-text="name"
          item-value="id"
        >
        </v-autocomplete>
        <div class="caption">Termin zabiegu</div>
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="true"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              outlined
              v-model="computedDateFormatted"
              append-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
              :rules="[(v) => !!v || 'Data zabiegu jest wymagana']"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="dateDisplay"
            no-title
            scrollable
            @input="menu = false"
          >
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu = false"> anuluj </v-btn>
          </v-date-picker>
        </v-menu>
        <div class="d-flex">
          <v-spacer></v-spacer>
          <v-btn color="primary" :loading="loader" @click="addClick"
            >Zapisz</v-btn
          >
        </div>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data: () => ({
    dateDisplay: new Date().toISOString().slice(0, 10),
    loader: false,
    dialog: false,
    valid: true,
    patient: null,
    doctor: null,
    treatment: null,
    appointment: {
      date: new Date(),
    },
    menu: false,
  }),
  methods: {
    ...mapActions(["addAppointment"]),
    async addClick() {
      if (!this.patient || !this.treatment) return;
      this.loader = true;
      let patient = this.getPatients.find((v) => v.id === this.patient);
      let doctor = this.getDoctors.find((v) => v.id === this.doctor);
      let treatment = this.getTreatments.find((v) => v.id === this.treatment);
      this.appointment.name = treatment.name;
      this.appointment.patient = patient.fullname;
      this.appointment.patientRef = patient.id;
      this.appointment.doctorRef = doctor.id;
      this.appointment.treatmentRef = treatment.id;
      this.appointment.surveys = [
        ...treatment.patientSurveys.map((v) => {
          return { ...v, completed: false, status: "pending", type: "patient" };
        }),
        ...treatment.doctorSurveys.map((v) => {
          return { ...v, completed: false, status: "pending", type: "doctor" };
        }),
      ];
      this.appointment.surveys.forEach((survey) => {
        switch (survey.timeType) {
          case "Przed":
            survey.sendDate = new Date(this.appointment.date);
            survey.sendDate.setDate(survey.sendDate.getDate() - survey.days);
            break;
          case "Po":
            survey.sendDate = new Date(this.appointment.date);
            survey.sendDate.setDate(survey.sendDate.getDate() + survey.days);
            break;
          case "Natychmiast":
            survey.sendDate = new Date();
            break;
          case "W dniu wykonania":
            survey.sendDate = this.appointment.date;
            break;
          default:
            break;
        }
      });
      this.appointment.surveyRequiredCount = this.appointment.surveys.length;
      this.appointment.surveyCount = 0;
      await this.addAppointment(this.appointment);
      this.loader = false;
      setTimeout(() => {
        this.dialog = false;
        this.patient = null;
        this.treatment = null;
      }, 2000);
    },
    formatDate(date) {
      if (!date) return null;

      const year = date.getFullYear(),
        month = String(date.getDate()).padStart(2, "0"),
        day = String(date.getMonth() + 1).padStart(2, "0");
      return `${day}-${month}-${year}`;
    },
  },
  computed: {
    ...mapGetters([
      "getSurveyAlert",
      "getPatients",
      "getDoctors",
      "getTreatments",
    ]),
    computedDateFormatted: {
      get() {
        return this.formatDate(this.appointment.date);
      },
      set(val) {
        this.appointment.date = val;
      },
    },
  },
  watch: {
    dateDisplay(val) {
      this.appointment.date = new Date(Date.parse(val));
    },
  },
};
</script>
