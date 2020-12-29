<template>
  <v-container fluid :class="$vuetify.breakpoint.mobile ? 'pa-0' : ''">
    <v-row no-gutters v-if="!$vuetify.breakpoint.mobile" style="height: 100%">
      <v-col cols="12" md="3">
        <v-card class="px-4 pt-2" rounded="lg" height="100%">
          <v-autocomplete
            no-data-text="Brak umówionych zabiegów w bazie danych"
            @change="searchSelect"
            offset-y
            v-model="searchAppointmentId"
            :items="getAppointments"
            item-text="name"
            item-value="id"
            label="Zaplanowany zabieg"
            prepend-icon="mdi-account-search-outline"
          ></v-autocomplete>
          <v-list three-line style="overflow-y: scroll;">
            <v-list-item-group>
              <v-list-item
                @click="selectedAppointment = appointment"
                v-for="appointment in getAppointments"
                :key="appointment.id"
              >
                <v-list-item-avatar>
                  <v-icon class="warning white--text">
                    mdi-hospital-box-outline
                  </v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ appointment.name }}</v-list-item-title>
                  <v-list-item-subtitle
                    >{{
                      appointment.date
                        .toDate()
                        .toISOString()
                        .slice(0, 10)
                    }}<br />
                    {{ appointment.patient }}</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="12" md="9">
        <v-card
          class="mt-5 mt-md-0 ml-md-5 overflow-y: scroll;"
          rounded="lg"
          height="100%"
        >
          <AppointmentPreview :appointment="selectedAppointment" />
        </v-card>
      </v-col>
    </v-row>

    <div v-else class="appointmentsPage">
      <v-tabs v-model="tab" background-color="primary" color="white" grow>
        <v-tab v-for="item in ['Lista', 'Zabieg']" :key="item">
          {{ item }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item class="pa-4">
          <v-autocomplete
            no-data-text="Brak umówionych zabiegów w bazie danych"
            @change="searchSelect"
            offset-y
            v-model="searchAppointmentId"
            :items="getAppointments"
            item-text="name"
            item-value="id"
            label="Zaplanowany zabieg"
            prepend-icon="mdi-account-search-outline"
          ></v-autocomplete>
          <v-list three-line style="overflow-y: scroll;">
            <v-list-item-group>
              <v-list-item
                @click="selectedAppointment = appointment"
                v-for="appointment in getAppointments"
                :key="appointment.id"
              >
                <v-list-item-avatar>
                  <v-icon class="warning white--text">
                    mdi-hospital-box-outline
                  </v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ appointment.name }}</v-list-item-title>
                  <v-list-item-subtitle
                    >{{
                      appointment.date
                        .toDate()
                        .toISOString()
                        .slice(0, 10)
                    }}<br />
                    {{ appointment.patient }}</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list> </v-tab-item
        ><v-tab-item>
          <div style="max-width: 100%">
            <AppointmentPreview :appointment="selectedAppointment" />
          </div> </v-tab-item
      ></v-tabs-items>
    </div>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import AppointmentPreview from "@/components/AppointmentPreview";
export default {
  components: {
    AppointmentPreview,
  },
  data: () => ({
    tab: 0,
    first: false,
    selectedAppointment: null,
    searchAppointmentId: null,
  }),
  methods: {
    ...mapActions([]),
    searchSelect() {
      if (this.searchAppointmentId !== undefined) {
        this.selectedAppointment = this.getAppointments.find(
          (v) => v.id === this.searchAppointmentId
        );
      }
    },
  },
  computed: {
    ...mapGetters(["getAppointments"]),
  },
  mounted() {
    if (this.getAppointments.length > 0) {
      this.selectedAppointment = this.getAppointments[0];
      this.searchAppointmentId = this.getAppointments[0].id;
    }
  },
  watch: {
    selectedAppointment(val) {
      if (!this.first) this.first = true;
      else {
        this.searchAppointmentId = val.id;
        this.tab = 1;
      }
    },
  },
};
</script>

<style scoped>
.appointmentsPage {
  height: 100%;
  background: #fff;
}
</style>
