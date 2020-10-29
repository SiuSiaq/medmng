<template>
  <v-container fluid class="surveys">
    <v-card class="mx-auto mt-16" max-width="1100" elevation="24" rounded="xl">
      <v-card-title class="grey--text text--darken-2"
        >Umówione zabiegi
        <v-spacer></v-spacer>
        <v-autocomplete
          label="Szukaj"
          append-outer-icon="mdi-magnify"
          class="mr-3"
          item-text="name"
          item-value="id"
          clearable
        ></v-autocomplete
      ></v-card-title>
      <v-card-text style="min-height: 300px">
        <v-list three-line>
          <v-list-item-group>
              <Appointment :appointment="appointment" v-for="appointment in getAppointments" :key="appointment.id"/>
          </v-list-item-group>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <CreateAppointment />
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import CreateAppointment from "@/components/CreateAppointment";
import Appointment from "@/components/Appointment";
import { mapActions, mapGetters } from 'vuex';
export default {
  methods: {
    ...mapActions(["fetchPatients", 'fetchTreatments', 'fetchAppointments']),
  },
  components: {
    CreateAppointment,
    Appointment,
  },
  computed: {
      ...mapGetters(['getAppointments']),
  },
  mounted() {
    this.fetchPatients();
    this.fetchTreatments();
    this.fetchAppointments();
  },
};
</script>