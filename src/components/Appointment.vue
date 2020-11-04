<template>
  <v-dialog
    v-model="dialog"
    width="500"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-list-item v-bind="attrs" v-on="on">
        <v-list-item-avatar>
          <v-icon class="warning white--text"> mdi-medical-bag </v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ appointment.name }}</v-list-item-title>
          <v-list-item-subtitle
            >{{ appointment.date.toDate().toISOString().slice(0, 10) }}<br />
            {{ appointment.patient }}</v-list-item-subtitle
          >
        </v-list-item-content>
      </v-list-item>
    </template>
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Umówiony zabieg</v-toolbar-title>
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
      <div class="mt-15 px-3 mx-auto" style="max-width: 600px">
        <div class="caption">Pacjent</div>
        <div class="mb-2">{{appointment.patient}}</div>
        <div class="caption">Zabieg</div>
        <div class="mb-2">{{appointment.name}}</div>
        <div class="caption">Termin</div>
        <div class="mb-6">{{appointment.date.toDate().toISOString().slice(0,10)}}</div>
        <div class="d-flex">
          <v-btn color="error" text>usuń</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="dialog = false">zamknij</v-btn>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: ["appointment"],
  data: () => ({
    dialog: false,
  }),
  computed: {
    ...mapGetters(["getSurveyAlert"]),
  },
};
</script>