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
          <v-icon
            :class="survey.completed ? 'success' : 'warning'"
            class="white--text"
          >
            {{
              survey.completed
                ? "mdi-clipboard-check-outline"
                : "mdi-clipboard-edit-outline"
            }}
          </v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ survey.name }}</v-list-item-title>
          <v-list-item-subtitle
            >{{ timeText }}<br />
            {{
              survey.description.length > 0 ? survey.description : "Brak opisu"
            }}</v-list-item-subtitle
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
      <v-alert
        transition="slide-y-transition"
        dense
        :type="getSurveyAlert.success ? 'success' : 'error'"
        rounded="0"
        v-model="getSurveyAlert.show"
      >
        {{ getSurveyAlert.text }}
      </v-alert>
      <div class="pa-10 mx-auto">
        <div class="text-h5 text-center">
          {{ survey.name }}
        </div>
        <v-form
          :readonly="survey.completed || sendable"
          v-model="valid"
          ref="form"
          style="max-width: 700px"
          class="mx-auto mt-5"
        >
          <div class="caption">Opis</div>
          <div class="mb-2">
            {{
              survey.description.length > 0 ? survey.description : "Brak opisu"
            }}
          </div>
          <div v-for="(field, i) in survey.fields" :key="i">
            <div class="caption">{{ i + 1 + ". " + field.name }}</div>
            <v-text-field
              outlined
              v-if="field.type === 'number'"
              :rules="[(v) => !!v || `Pole jest wymagane`]"
              type="number"
              :required="field.required"
              v-model="field.data"
            ></v-text-field>
            <v-text-field
              outlined
              v-else-if="field.type === 'text'"
              :rules="[(v) => !!v || `Pole jest wymagane`]"
              :required="field.required"
              v-model="field.data"
            ></v-text-field>
            <v-select
            item-text="text"
            item-value="value"
              outlined
              v-else-if="field.type === 'select'"
              :rules="[(v) => !!v || `Pole jest wymagane`]"
              :required="field.required"
              :items="field.options"
              v-model="field.data"
            >
            </v-select>
            <v-radio-group
              v-else-if="field.type === 'radio'"
              :required="field.required"
              v-model="field.data"
              :multiple="field.multiple"
              :rules="[(v) => !!v || `Pole jest wymagane`]"
            >
              <v-radio
                v-for="(item, i) in field.options"
                :key="i"
                :value="item.text"
              ></v-radio>
            </v-radio-group>
            <v-radio-group
              v-else-if="field.type === 'truefalse'"
              :required="field.required"
              v-model="field.data"
              :rules="[(v) => !!v || `Pole jest wymagane`]"
            >
              <v-radio value="true" label="Tak"></v-radio>
              <v-radio value="false" label="Nie"></v-radio>
            </v-radio-group>
          </div>
          <div class="d-flex">
            <v-btn
              v-if="getUserData.doctor && sendable"
              color="primary"
              :loading="downloadLoader"
              @click="downloadClick"
              >Pobierz</v-btn
            >
            <v-spacer></v-spacer>
            <SendSurvey :survey="survey" v-if="sendable" />
            <v-btn
              v-else-if="!survey.completed"
              color="primary"
              :loading="loader"
              @click.prevent="submitClick"
              >Wyślij</v-btn
            >
            <v-btn v-else color="primary" @click.prevent="dialog = false"
              >Zamknij</v-btn
            >
          </div>
        </v-form>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import SendSurvey from "@/components/SendSurvey";
export default {
  props: ["survey", "sendable"],
  data: () => ({
    dialog: false,
    loader: false,
    downloadLoader: false,
    valid: true,
  }),
  methods: {
    ...mapActions(["submitSurvey", "downloadSurvey"]),
    async submitClick() {
      if (!this.$refs.form.validate()) return;
      this.loader = true;
      await this.submitSurvey(this.survey);
      this.loader = false;
    },
    reset() {
      this.$refs.form.reset();
    },
    async downloadClick() {
      this.downloadLoader = true;
      let surveysData = await this.downloadSurvey(this.survey.id);
      const data = JSON.stringify(surveysData);
      const blob = new Blob([data], { type: "text/plain" });
      const e = document.createEvent("MouseEvents"),
        a = document.createElement("a");
      a.download = `${this.survey.name}.json`;
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
      this.downloadLoader = false;
      e.initEvent(
        "click",
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      );
      a.dispatchEvent(e);
    },
  },
  computed: {
    ...mapGetters(["getSurveyAlert", "getUserData"]),
    timeText() {
      let date;
      if (this.survey.completed) {
        this.survey.submitted instanceof Date
          ? (date = this.survey.submitted)
          : (date = this.survey.submitted.toDate());
      } else {
        date = this.survey.sentDate.toDate();
      }
      let dd = String(date.getDate()).padStart(2, "0");
      let mm = String(date.getMonth() + 1).padStart(2, "0");
      let yy = date.getFullYear();
      return `${
        this.survey.completed ? "Wypełniona" : "Wysłana"
      } ${dd}-${mm}-${yy}`;
    },
  },
  components: {
    SendSurvey,
  },
};
</script>
