<template>
  <div>
    <v-form>
      <v-text-field
        outlined
        class="mb-2"
        v-model="field.name"
        :counter="250"
        :rules="nameRules"
        :label="question"
        required
      ></v-text-field>
      <v-text-field
        outlined
        class="mb-2"
        v-model="field.columnName"
        :counter="250"
        :rules="columnNameRules"
        label="Nazwa kolumny"
        required
      ></v-text-field>
      <div :hidden="!field.groupSummable">
      <v-text-field
        outlined
        class="mb-2"
        v-model="field.group"
        :counter="250"
        :rules="groupRules"
        label="Grupa"
        required
      ></v-text-field>
      </div>
      <v-textarea
        outlined
        rows="1"
        v-model="field.description"
        auto-grow
        clearable
        label="Opis (opcjonalny)"
      >
      </v-textarea>
      <div class="d-flex">
        <v-select
          outlined
          label="Typ pola"
          :rules="[(v) => !!v || `Typ pola jest wymagany`]"
          :items="types"
          v-model="type"
          item-text="name"
          item-value="val"
        >
        </v-select>
        <div :hidden="type != 3">
          <v-checkbox
            v-model="checkboxValues"
            label="Wartości"
            class="ml-3"
          ></v-checkbox>
        </div>
      </div>
      <div :hidden="type > 4 || type < 3">
        <div v-for="(option, i) in field.options" :key="i">
          <v-text-field
            v-model="option.text"
            outlined
            :rules="[(v) => !!v || 'Opcja jest wymagana']"
            label="Opcja"
            append-outer-icon="mdi-minus"
            @click:append-outer="field.options.splice(i, 1)"
            required
          ></v-text-field>
          <div :hidden="!checkboxValues">
            <v-text-field
              v-model="option.value"
              outlined
              :rules="[(v) => !!v || 'Wartość opcji jest wymagana']"
              label="Wartość opcji"
              required
            ></v-text-field>
          </div>
        </div>
        <v-btn
          text
          color="primary"
          class="mt-n1 mb-1"
          @click="field.options.push({ text: '', value: '' })"
          >dodaj opcje</v-btn
        >
      </div>
    </v-form>
    <v-divider class="mb-3 primary"></v-divider>
  </div>
</template>

<script>
export default {
  props: ["field", "number"],
  data: () => ({
    checkboxValues: false,
    name: "",
    nameRules: [
      (v) => !!v || "Nazwa pola jest wymagana",
      (v) =>
        (v && v.length <= 250) || "Nazwa pola musi być krótsza niż 250 znaków",
    ],
    columnName: "",
    columnNameRules: [
      (v) =>
        (v && v.length <= 250) ||
        "Nazwa kolumny musi być krótsza niż 250 znaków",
    ],
    groupRules: [
      (v) =>
        (v && v.length <= 250) || "Nazwa grupy musi być krótsza niż 250 znaków",
    ],
    description: "",
    type: 1,
    types: [
      {
        name: "Tekst",
        text: "text",
        val: 1,
      },
      {
        name: "Liczba",
        text: "number",
        val: 2,
      },
      {
        name: "Jednokrotny wybór",
        text: "select",
        val: 3,
      },
      {
        name: "Wielokrotny wybór",
        text: "radio",
        val: 4,
      },
      {
        name: "Tak/Nie",
        text: "truefalse",
        val: 5,
      },
    ],
  }),
  watch: {
    type(val) {
      this.field.type = this.types[val - 1].text;
    },
  },
  computed: {
    question() {
      return `Pytanie ${this.number + 1}`;
    },
  },
  mounted() {
    switch (this.field.type) {
      case "text":
        this.type = 1;
        break;
      case "number":
        this.type = 2;
        break;
      case "select":
        this.type = 3;
        this.copyOptions();
        break;
      case "radio":
        this.type = 4;
        this.copyOptions();
        break;
      case "truefalse":
        this.type = 5;
        break;
      default:
        this.type = 1;
        break;
    }
  },
  methods: {
    copyOptions() {
      let options = this.field.options.slice();
      let arr = [];
      options.forEach((opt) => {
        arr.push({
          text: opt.text,
          value: opt.value,
        });
      });
      this.field.options = arr;
    },
  },
};
</script>
