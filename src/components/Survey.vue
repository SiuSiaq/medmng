<template>
  <v-dialog
    v-model="dialog"
    width="500"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-list-item v-bind="attrs" v-on="on">
        <v-list-item-avatar>
          <v-icon class="warning" dark> mdi-clipboard-list-outline </v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title> Prostatektomia</v-list-item-title>
          <v-list-item-subtitle
            >Bogusław Biernacki 27.10.2020</v-list-item-subtitle
          >
        </v-list-item-content>
      </v-list-item>
    </template>
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Ankieta</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <div class="pa-10 mx-auto">
        <div class="text-h5 text-center">
          Prostatektomia ankieta przed zabiegiem
        </div>
        <v-form style="max-width: 700px" class="mx-auto mt-5">
          <v-text-field
            :rules="[(v) => !!v || 'Waga jest wymagana']"
            type="number"
            label="Waga (kg)"
            required
          ></v-text-field>
          <v-text-field
            :rules="[(v) => !!v || 'Wzrost jest wymagany']"
            type="number"
            label="Wzrost (cm)"
            required
          ></v-text-field>
          <v-text-field
            :rules="[(v) => !!v || 'Obwód pasa jest wymagany']"
            type="number"
            label="Obwód pasa (cm)"
            required
          ></v-text-field>
          <div class="caption">Palenie</div>
          <v-radio-group v-model="smoke" row>
            <v-radio label="Tak" value="true"></v-radio>
            <v-radio label="Nie" value="false"></v-radio>
          </v-radio-group>
          <div class="d-flex justify-end">
            <v-btn color="primary">Zapisz</v-btn>
          </div>
        </v-form>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    smoke: false,
  }),
};
</script>
