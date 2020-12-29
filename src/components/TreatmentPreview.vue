<template>
  <v-row class="mx-3 pt-md-4">
    <v-col cols="12" md="6">
      <div class="mb-4 text-md-h4 text-h5 grey--text text--darken-2">
        Informacje
      </div>
      <div class="ml-3">
        <div class="caption">Nazwa zabiegu</div>
        <div>{{ treatment.name }}</div>
        <div class="mt-2 caption">Opis</div>
        <div>
          {{ treatment.description ?  treatment.description : 'Brak opisu'}}
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
          <v-list-item v-for="survey in treatment.doctorAfter" :key="survey.id">
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
</template>

<script>
export default {
  data: () => ({
    
  }),
  props: ["treatment"],
};
</script>

<style></style>
