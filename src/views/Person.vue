<template>
  <v-container fluid class="home">
    <v-card
      class="mx-auto mt-16 px-2"
      max-width="1100"
      :min-height="!$vuetify.breakpoint.mobile ? '400' : '500'"
      elevation="24"
      rounded="xl"
    >
      <v-card-title class="text-h4 grey--text text--darken-2"
        >Dane osobowe</v-card-title
      >
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <div class="caption">Imię</div>
            <div class="black--text text-subtitle-1">{{ getUserData.name }}</div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="caption">Nazwisko</div>
            <div class="black--text text-subtitle-1">{{ getUserData.surname }}</div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="caption">E-mail</div>
            <div class="black--text text-subtitle-1">{{ getUserData.email }}</div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="caption">Telefon</div>
            <div class="black--text text-subtitle-1">{{ getUserData.phone }}</div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="caption">Adres zamieszkania</div>
            <div class="black--text text-subtitle-1">
              {{
                `${getAddress.city}, ul. ${getAddress.street}${
                  getAddress.local_number ? "/" + getAddress.local_number : ""
                }`
              }}
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="caption">Płeć</div>
            <div class="black--text text-subtitle-1">{{ getUserData.sex === 'm' ? 'Mężczyzna' : 'Kobieta' }}</div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="caption">Data urodzenia</div>
            <div class="black--text text-subtitle-1">{{ getUserData.birthday.toDate().toISOString().slice(0,10) }}</div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: mapGetters(["getUserData", "getAddress"]),
};
</script>
