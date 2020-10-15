<template>
  <v-container fluid class="home">
    <v-card
      class="mx-auto mt-16"
      max-width="800"
      :height="!$vuetify.breakpoint.mobile ? '400' : '500'"
      elevation="24"
      rounded="xl"
    >
      <v-card-title class="grey--text text--darken-2"
        >Ankiety do wypełnienia</v-card-title
      >
      <v-card-text>
        <v-list two-line>
          <v-list-item-group>
            <Survey />
          </v-list-item-group>
        </v-list>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import Survey from "@/components/Survey";
export default {
  components: {
    Survey,
  },
};
</script>

<style scoped>
.home {
  height: 90vh;
  background-image: linear-gradient(0, transparent 50%, #1976d2 50%);
}
</style>
