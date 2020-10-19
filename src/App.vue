<template>
  <v-app>
    <Navbar />
    <v-main class="appstyle">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import Navbar from '@/components/Navbar'
import { mapActions } from 'vuex';
export default {
  name: 'App',
  components: {
    Navbar,
  },
  methods: {
    ...mapActions(['authStateChanged']),
  },
  created() {
    this.authStateChanged();
  }
};
</script>

<style scoped>
  .appstyle{
    background: #1976d2;
  }
</style>
