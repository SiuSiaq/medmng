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
            {{ treatment.description.length > 0 ? treatment.description : 'Brak opisu'}}</v-list-item-subtitle
          >
        </v-list-item-content>
      </v-list-item>
    </template>
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Zabieg</v-toolbar-title>
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
      <v-row class="mx-3 mx-md-8 mt-md-6 mt-4">
        <v-col cols="12" md="6">
          <div class="mb-4 text-md-h4 text-h5 grey--text text--darken-2">
            Informacje
          </div>
          <div class="ml-3">
            <div class="caption">Nazwa zabiegu</div>
            <div>{{ treatment.name }}</div>
            <div class="mt-2 caption">Opis</div>
            <div>
              {{ treatment.description }}
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="6">
          <div class="mb-4 text-md-h4 text-h5 grey--text text--darken-2">
            Dla pacjenta
          </div>
          <v-list>
            <v-list-item-group>
              <v-subheader>Przed zabiegiem</v-subheader>
              <v-list-item
                v-for="survey in treatment.patientBefore"
                :key="survey.id"
              >
                <v-list-item-avatar>
                  <v-icon class="warning white--text">
                    mdi-clipboard-outline
                  </v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ survey.name }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-subheader>Po zabiegu</v-subheader>
              <v-list-item
                v-for="survey in treatment.patientAfter"
                :key="survey.id"
              >
                <v-list-item-avatar>
                  <v-icon class="warning white--text">
                    mdi-clipboard-outline
                  </v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ survey.name }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-col>
        <v-col cols="12" md="6">
          <div class="mb-4 text-md-h4 text-h5 grey--text text--darken-2">
            Dla lekarza
          </div>
          <v-list>
            <v-list-item-group>
              <v-subheader>Przed zabiegiem</v-subheader>
              <v-list-item
                v-for="survey in treatment.doctorBefore"
                :key="survey.id"
              >
                <v-list-item-avatar>
                  <v-icon class="warning white--text">
                    mdi-clipboard-outline
                  </v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ survey.name }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-subheader>Po zabiegu</v-subheader>
              <v-list-item
                v-for="survey in treatment.doctorAfter"
                :key="survey.id"
              >
                <v-list-item-avatar>
                  <v-icon class="warning white--text">
                    mdi-clipboard-outline
                  </v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ survey.name }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data: () => ({
    dialog: false,
  }),
  computed: mapGetters(["getSurveyAlert"]),
  props: ["treatment"],
};
</script>
