<template>
  <v-app>
    <v-main class="appstyle">
      <Navbar />
      <v-alert
        transition="slide-y-transition"
        dense
        :type="getMainAlert.success ? 'success' : 'error'"
        rounded="0"
        v-model="getMainAlert.show"
      >
        {{ getMainAlert.text }}
      </v-alert>
      <router-view style="height: 100%;"></router-view>
    </v-main>
  </v-app>
</template>

<script>
import Navbar from "@/components/Navbar";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "App",
  components: {
    Navbar,
  },
  methods: {
    ...mapActions(["authStateChanged"]),
  },
  created() {
    this.authStateChanged();
  },
  computed: {
    ...mapGetters(["getMainAlert"]),
  },
};
</script>

<style>
.appstyle {
  background: #1976d2;
  height: 100%;
}
</style>
