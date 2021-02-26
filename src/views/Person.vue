<template>
  <v-container
    fluid
    class="personPage pa-0"
  >
    <div
      style="width: 100%;"
      :class="$vuetify.breakpoint.mobile ? 'personBaner pt-1' : 'personBanerDesktop pt-4'"
      class="primary mx-0 pl-6"
    >
      <div :class="$vuetify.breakpoint.mobile ? 'text-h4' : 'text-h3'" class="font-weight-medium white--text">Dane osobowe</div>
    </div>
    <v-row class="mt-4 ml-md-4 ml-0 pl-3">
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
      <v-col cols="12" md="6" v-if="!getUserData.doctor">
        <div class="caption">Adres zamieszkania</div>
        <div class="black--text text-subtitle-1">
          {{
            `${getAddress.city}, ul. ${getAddress.street}${
              getAddress.local_number ? "/" + getAddress.local_number : ""
            }`
          }}
        </div>
      </v-col>
      <v-col cols="12" md="6" v-if="!getUserData.doctor">
        <div class="caption">Płeć</div>
        <div class="black--text text-subtitle-1">
          {{ getUserData.sex === "m" ? "Mężczyzna" : "Kobieta" }}
        </div>
      </v-col>
      <v-col cols="12" md="6" v-if="!getUserData.doctor">
        <div class="caption">Data urodzenia</div>
        <div class="black--text text-subtitle-1">
          {{
            getUserData.birthday
              .toDate()
              .toISOString()
              .slice(0, 10)
          }}
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: mapGetters(["getUserData", "getAddress"]),
};
</script>

<style scoped>
.personPage {
  height: 100%;
  background: #fff;
}

.personBanerDesktop {
  height: 100px;
}

.personBaner {
  height: 60px;
}
</style>
