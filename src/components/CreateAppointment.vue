<template>
  <v-dialog
    v-model="dialog"
    width="500"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" color="primary" class="mr-2 mb-2">
        Umów zabieg
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
          outlined
          :rules="[(v) => !!v || `Pacjent jest wymagany`]"
          :items="getPatients"
          v-model="patient"
          item-text="fullname"
          item-value="id"
        >
        </v-autocomplete>
        <div class="caption">Zabieg</div>
        <v-autocomplete
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
          :close-on-content-click="false"
          :return-value.sync="appointment.date"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              outlined
              v-model="appointment.date"
              append-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="appointment.date" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu = false"> anuluj </v-btn>
            <v-btn
              text
              color="primary"
              @click="$refs.menu.save(appointment.date)"
            >
              OK
            </v-btn>
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
    loader: false,
    dialog: false,
    valid: true,
    patient: null,
    treatment: null,
    appointment: {
      date: new Date().toISOString().slice(0, 10),
    },
    menu: false,
  }),
  methods: {
    ...mapActions(["addAppointment"]),
    async addClick() {
      if (!this.patient || !this.treatment) return;
      this.loader = true;
      let patient = this.getPatients.find((v) => v.id === this.patient);
      let treatment = this.getTreatments.find((v) => v.id === this.treatment);
      this.appointment.name = treatment.name;
      this.appointment.patient = patient.fullname;
      this.appointment.patientRef = patient.id;
      this.appointment.treatmentRef = treatment.id;
      await this.addAppointment(this.appointment);
      this.loader = false;
      setTimeout(() => {
        this.dialog = false;
        this.patient = null;
        this.treatment = null;
      }, 2000);
    },
  },
  computed: mapGetters(["getSurveyAlert", "getPatients", "getTreatments"]),
};
</script>
