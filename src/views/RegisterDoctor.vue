<template>
  <v-container>
    <v-stepper
      style="max-width: 800px;"
      v-model="el"
      vertical
      class="mx-auto rounded-xl mt-10"
    >
      <div class="text-h4 grey--text text--darken-2 ml-4 mt-4">Rejestracja</div>
      <v-stepper-step step="1" :complete="el > 1"> Dane konta </v-stepper-step>

      <v-stepper-content step="1">
        <v-form ref="registerForm" v-model="valid">
          <v-text-field
            class="mt-1"
            outlined
            v-model="email"
            :rules="emailRules"
            label="E-mail"
            required
          ></v-text-field>
          <v-text-field
            outlined
            v-model="password"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="passwordRules"
            :type="show ? 'text' : 'password'"
            label="Hasło"
            hint="Conajmniej 6 znaków"
            counter
            @click:append="show = !show"
          ></v-text-field>
          <div class="d-flex">
            <v-spacer></v-spacer>
            <v-btn color="primary" :disabled="!valid" @click="stepFirstClick">
              Dalej
            </v-btn>
          </div>
        </v-form>
      </v-stepper-content>

      <v-stepper-step step="2" :complete="el > 2">
        Dane osobowe
      </v-stepper-step>

      <v-stepper-content step="2">
        <v-form ref="personalForm" v-model="personalValid" class="mx-5">
          <v-text-field
            class="mt-1"
            outlined
            v-model="name"
            :counter="50"
            :rules="nameRules"
            label="Imię"
            required
          ></v-text-field>
          <v-text-field
            outlined
            v-model="surname"
            :counter="50"
            :rules="surnameRules"
            label="Nazwisko"
            required
          ></v-text-field>
          <v-text-field
            outlined
            v-model="phone"
            :rules="phoneRules"
            label="Telefon"
            required
          ></v-text-field>
          <v-text-field
            outlined
            v-model="pesel"
            :rules="peselRules"
            label="PESEL"
            required
          ></v-text-field>
          <div class="d-flex">
            <v-btn text @click="el = 1"> Wróć </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              :disabled="!personalValid"
              @click="stepSecondClick"
            >
              Dalej
            </v-btn>
          </div>
        </v-form>
      </v-stepper-content>

      <v-stepper-step step="3"> Adres </v-stepper-step>

      <v-stepper-content step="3">
        <v-form ref="addressForm" v-model="addressValid" class="mx-5">
          <v-text-field
            class="mt-1"
            outlined
            v-model="address.city"
            :counter="40"
            :rules="cityRules"
            label="Miejscowość"
            required
          ></v-text-field>
          <v-text-field
            outlined
            v-model="address.street"
            :counter="100"
            :rules="streetRules"
            label="Ulica i numer budynku"
            required
          ></v-text-field>
          <v-text-field
            outlined
            v-model="address.local_number"
            label="Numer lokalu (opcjonalne)"
            type="number"
          ></v-text-field>
          <v-text-field
            outlined
            v-model="address.zip_code"
            :counter="6"
            :rules="zipcodeRules"
            label="Kod pocztowy"
            required
          ></v-text-field>
          <v-autocomplete
            no-data-text="Brak instytutów w bazie danych"
            outlined
            v-model="instituteSelect"
            label="Instytut"
            :items="institutes"
            item-text="name"
            item-value="ref"
            :rules="[(v) => !!v || 'Instytut jest wymagany']"
            required
          >
          </v-autocomplete>
          <v-autocomplete
            no-data-text="Brak instytutów w bazie danych"
            outlined
            v-model="wardRef"
            label="Oddział"
            :items="selectedInstitute.wards"
            item-text="name"
            item-value="ref"
            :rules="[(v) => !!v || 'Brak oddziałów w bazie']"
            required
          >
          </v-autocomplete>
          <v-text-field
            outlined
            v-model="instituteCode"
            :counter="8"
            :rules="instituteCodeRules"
            label="Kod instytutu"
            required
          ></v-text-field>
          <div class="d-flex mt-2 mb-1">
            <v-btn text @click="el = 2"> Wróć </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              :disabled="!addressValid"
              @click="registerClick"
              :loading="loader"
            >
              Zarejestruj
            </v-btn>
          </div>
        </v-form>
      </v-stepper-content>
    </v-stepper>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data: () => ({
    el: 1,
    registerLoader: false,
    show: false,
    loader: false,
    valid: true,
    personalValid: true,
    addressValid: true,
    wardRef: null,
    address: {
      country: "Poland",
      city: "",
      street: "",
      local_number: null,
      zip_code: "",
    },
    instituteCode: "",
    instituteCodeRules: [
      (v) => !!v || "Kod instytucji jest wymagany",
      (v) => (v && v.length == 8) || "Kod instytucji musi składać się z 8 znaków",
    ],
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
    name: "",
    nameRules: [
      (v) => !!v || "Imię jest wymagane",
      (v) => (v && v.length <= 50) || "Imię musi być krótsze niż 50 znaków",
    ],
    surname: "",
    surnameRules: [
      (v) => !!v || "Nazwisko jest wymagane",
      (v) => (v && v.length <= 50) || "Nazwisko musi być krótsze niż 50 znaków",
    ],
    phone: "",
    phoneRules: [
      (v) => !!v || "Numer telefonu jest wymagany",
      (v) => /^\d{9}$/.test(v) || "Niepoprawny numer telefonu",
    ],
    pesel: "",
    peselRules: [
      (v) => !!v || "PESEL jest wymagany",
      (v) => /^\d{11}$/.test(v) || "Niepoprawny numer PESEL",
    ],
    zipcodeRules: [
      (v) => !!v || "Kod pocztowy jest wymagany",
      (v) => /^\d{2}-\d{3}$/.test(v) || "Niepoprawny kod pocztowy",
      (v) => (v && v.length <= 6) || "Niepoprawny kod pocztowy",
    ],
    cityRules: [
      (v) => !!v || "Miejscowość jest wymagana",
      (v) =>
        (v && v.length <= 30) ||
        "Nazwa miejscowości musi być krótsza niż 30 znaków",
    ],
    streetRules: [
      (v) => !!v || "Ulica i numer budynku są wymagane",
      (v) =>
        (v && v.length <= 100) ||
        "Nazwa miejscowości musi być krótsza niż 100 znaków",
    ],
    institutes: [],
    selectedInstitute: {
      wards: [],
    },
    instituteSelect: null,
  }),
  methods: {
    ...mapActions(["registerDoctor", "fetchInstitutesList"]),
    stepFirstClick() {
      if (!this.$refs.registerForm.validate()) return;
      this.el = 2;
    },
    stepSecondClick() {
      if (!this.$refs.personalForm.validate()) return;
      this.el = 3;
    },
    async registerClick() {
      if (!this.$refs.addressForm.validate()) return;

      this.loader = true;
      const data = {
        email: this.email,
        password: this.password,
        address: this.address,
        pesel: this.pesel,
        name: this.name,
        surname: this.surname,
        phone: this.phone,
        local_number: this.local_number,
        instituteRef: this.selectedInstitute.ref,
        instituteName: this.selectedInstitute.name,
        instituteCode: this.instituteCode,
        wardRef: this.wardRef,
      };
      await this.registerDoctor(data);
      this.loader = false;
      console.log("Registerd!");
    },
    async getInstitutes() {
      this.institutes = await this.fetchInstitutesList();
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
    instituteSelect(val) {
      if (val) {
        this.selectedInstitute = this.institutes.find((v) => (v.ref = val));
        console.log(this.selectedInstitute.name);
      }
    },
  },
  mounted() {
    this.getInstitutes();
  },
};
</script>
