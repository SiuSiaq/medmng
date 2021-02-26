<template>
  <nav>
    <v-app-bar app flat dark color="primary">
      <v-app-bar-nav-icon
        v-if="getIsLoggedIn"
        @click="draw = !draw"
      ></v-app-bar-nav-icon>

      <v-toolbar-title class="text-uppercase font-weight-bold white--text">
        med
        <span class="font-weight-light">form+</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-navigation-drawer v-model="draw" color="primary" app temporary>
      <v-list nav>
        <v-list-item-group>
          <v-list-item
            v-for="item in getUserData.doctor ? itemsDoctor : items"
            :key="item.text"
            router
            :to="item.route"
          >
            <v-list-item-icon>
              <v-icon class="white--text">{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title
                class="white--text"
                v-text="item.text"
              ></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="logOutClick">
            <v-list-item-icon>
              <v-icon class="white--text">mdi-logout-variant</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title class="white--text">Wyloguj</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  components: {},
  data: () => ({
    draw: false,
    settings: "/settings",
    items: [
      { icon: "mdi-view-dashboard", text: "Home", route: "/" },
      { icon: "mdi-account", text: "Dane osobowe", route: "/personaldata" },
    ],
    itemsDoctor: [
      { icon: "mdi-view-dashboard", text: "Home", route: "/" },
      { icon: "mdi-clipboard-list-outline", text: "Ankiety", route: "/surveys" },
      { icon: "mdi-medical-bag", text: "Umówione zabiegi", route: "/appointments" },
      { icon: "mdi-account-box-multiple", text: "Pacjenci", route: "/patients" },
      { icon: "mdi-needle", text: "Zabiegi", route: "/treatments" },
      { icon: "mdi-account", text: "Dane osobowe", route: "/personaldata" },
    ],
  }),
  methods: {
    ...mapActions(["logOut"]),
    async logOutClick() {
      await this.logOut();
      this.$router.push("login");
    },
  },
  computed: {
    ...mapGetters(["getIsLoggedIn", 'getUserData']),
  },
};
</script>
