<template>
  <div class="pt-5 px-3 ml-5" style="max-width: 500px">
    <div class="caption">Pacjent</div>
    <div class="mb-2">{{ appointment.patient }}</div>
    <div class="caption">Zabieg</div>
    <div class="mb-2">{{ appointment.name }}</div>
    <div class="caption">Termin</div>
    <div class="mb-6">
      {{
        appointment.date
          .toDate()
          .toISOString()
          .slice(0, 10)
      }}
    </div>
  <v-btn class="ml-n4" color="error" text>usuń</v-btn>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: ["appointment"],
  data: () => ({
    dialog: false,
  }),
  computed: {
    ...mapGetters(["getSurveyAlert"]),
  },
};
</script>
