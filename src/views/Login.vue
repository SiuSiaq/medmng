<template>
  <v-container>
    <v-card max-width="500px" class="mt-15 mx-auto px-5">
      <v-card-title class="grey--text">Logowanie</v-card-title>
      <v-form ref="form" v-model="valid">
        <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>
        <v-text-field
          v-model="password"
          :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="passwordRules"
          :type="show ? 'text' : 'password'"
          label="Hasło"
          hint="Conajmniej 6 znaków"
          counter
          @click:append="show = !show"
        ></v-text-field>
      </v-form>
      <v-card-actions>  
        <v-card-actions>
          <v-btn @click="reset" text>resetuj</v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            :loading="loader"
            :disabled="!valid"
            @click="logInClick"
          >zaloguj</v-btn>
        </v-card-actions>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data: () => ({
    show: false,
    loader: false,
    valid: true,
    email: "",
    emailRules: [
      (v) => !!v || "E-mail jest wymagany",
      (v) => /.+@.+\..+/.test(v) || "E-mail musi być poprawny",
    ],
    password: "",
    passwordRules: [
      (v) => !!v || "Hasło jest wymagane",
      (v) => v.length >= 6 || "Conajmniej 6 znaków",
    ],
  }),
  methods: {
    ...mapActions(["logIn"]),
    validate() {
      this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
      this.email = "";
      this.password = "";
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    async logInClick() {
      if (!this.$refs.form.validate()) return;

      this.loader = true;
      const data = {
        email: this.email,
        password: this.password,
      };
      await this.logIn(data);
      this.loader = false;
    },
  },
  computed: {
    ...mapGetters(["getUser"]),
    user() {
      return this.getUser;
    },
  },
  watch: {
    user(value) {
      if (value !== null && value !== undefined) {
        this.$router.push("/");
      }
    },
  },
};
</script>
