<template>
  <v-app>
    <Navbar />
    <v-main class="appstyle">
      <v-alert
        transition="slide-y-transition"
        dense
        :type="getMainAlert.success ? 'success' : 'error'"
        rounded="0"
        v-model="getMainAlert.show"
      >
        {{ getMainAlert.text }}
      </v-alert>
      <transition name="slide" mode="out-in">
        <router-view></router-view>
      </transition>
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

<style scoped>
.appstyle {
  background: #1976d2;
}
.slide-enter-active,
.slide-leave-active {
  transition: opacity 1s, transform 1s;
}
.slide-enter,
.slide-leave-to {
  opacity: 0;
  transform: translateX(-30%);
}
</style>
