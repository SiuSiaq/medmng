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
      <v-textarea
        outlined
        rows="1"
        v-model="field.description"
        auto-grow
        clearable
        label="Opis (opcjonalny)"
      >
      </v-textarea>
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
      <div :hidden="type > 4 || type < 3">
        <v-text-field
          v-for="(option, i) in field.options"
          :key="i"
          v-model="option.text"
          outlined
          :rules="[(v) => !!v || 'Opcja jest wymagana']"
          label="Opcja"
          append-outer-icon="mdi-minus"
          @click:append-outer="field.options.splice(i, 1)"
          required
        ></v-text-field>
        <v-btn text color="primary" class="mt-n1 mb-1" @click="field.options.push({text: ''})">dodaj opcje</v-btn>
      </div>
    </v-form>
    <v-divider class="mb-3 primary"></v-divider>
  </div>
</template>

<script>
export default {
  props: ['field', 'number'],
  data: () => ({
    name: "",
    nameRules: [
      (v) => !!v || "Nazwa pola jest wymagana",
      (v) =>
        (v && v.length <= 250) || "Nazwa pola musi być krótsza niż 250 znaków",
    ],
    columnName: '',
    columnNameRules: [
      (v) =>
        (v && v.length <= 250) || "Nazwa kolumny musi być krótsza niż 250 znaków",
    ],
    description: "",
    type: 1,
    types: [
      {
        name: "Tekst",
        text: 'text',
        val: 1,
      },
      {
        name: "Liczba",
        text: 'number',
        val: 2,
      },
      {
        name: "Jednokrotny wybór",
        text: 'select',
        val: 3,
      },
      {
        name: "Wielokrotny wybór",
        text: 'radio',
        val: 4,
      },
      {
        name: "Tak/Nie",
        text: 'truefalse',
        val: 5,
      },
    ],
  }),
  watch: {
    type(val) {
      this.field.type = this.types[val - 1].text
    },
  },
  computed: {
    question() {
      return `Pytanie ${this.number + 1}`
    }
  }
};
</script>