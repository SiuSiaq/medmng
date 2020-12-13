<template>
  <v-container fluid class="surveys">
    <v-card class="mx-auto mt-16" max-width="1100" elevation="24" rounded="xl">
      <v-card-title class="grey--text text--darken-2"
        >Zabiegi
        <v-spacer></v-spacer>
        <v-autocomplete
          no-data-text="Brak zabiegów"
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
            <Treatment
              v-for="treatment in getTreatments"
              :key="treatment.id"
              :treatment="treatment"
            />
          </v-list-item-group>
        </v-list>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <CreateTreatment />
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import Treatment from "@/components/Treatment";
import CreateTreatment from "@/components/CreateTreatment";
import { mapGetters } from "vuex";
export default {
  components: {
    Treatment,
    CreateTreatment,
  },
  computed: {
    ...mapGetters(["getTreatments"]),
  },
};
</script>