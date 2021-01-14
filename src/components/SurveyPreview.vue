<template>
  <div class="pa-5 mx-auto">
    <div class="text-h5 text-center">
      {{ survey.name }}
    </div>
    <v-form
      readonly
      v-model="valid"
      ref="form"
      style="max-width: 700px"
      class="mx-auto mt-5"
    >
      <div class="caption">Opis</div>
      <div class="mb-6">
        {{ survey.description.length > 0 ? survey.description : "Brak opisu" }}
      </div>
      <div v-for="(field, i) in survey.fields" :key="i">
        <div>{{ i + 1 + ") " + field.name }} <span v-if="field.required" class="primary--text">*</span></div>
        <div v-if="field.description">
          <div class="caption">{{field.description}}</div>
        </div>
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
          :required="field.required"
          v-model="field.data"
        ></v-text-field>
        <v-select
          outlined
          v-else-if="field.type === 'select'"
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
        >
          <v-radio value="true" label="Tak"></v-radio>
          <v-radio value="false" label="Nie"></v-radio>
        </v-radio-group>
      </div>
      <div class="d-flex">
        <v-btn
          v-if="getUserData.doctor"
          color="primary"
          :loading="downloadLoader"
          @click="downloadClick"
          >Pobierz</v-btn
        >
        <v-spacer></v-spacer>
        <SendSurvey :survey="survey" />
      </div>
    </v-form>
  </div>
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
    ...mapActions(["downloadSurvey"]),
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
      a.dataset.downloadurl = [
        `${this.survey.name}/json`,
        a.download,
        a.href,
      ].join(":");
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
  computed: mapGetters(["getUserData"]),
  components: {
    SendSurvey,
  },
};
</script>

<style></style>
