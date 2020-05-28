<template>
  <div class="home d-flex flex-column align-center">
    <div class="display-1">{{ greeting }}</div>
    <v-card
      v-if="values.length > 1"
      class="mx-auto text-center mt-5"
      width="95%"
    >
      <v-card-text>
        <v-sheet color="rgba(0, 0, 0, .12)">
          <v-sparkline
            :value="values"
            :labels="labels"
            :gradient="['#f72047', '#ffd200', '#1feaea']"
            height="100"
            stroke-linecap="round"
            auto-draw
            auto-line-width
            smooth
          >
          </v-sparkline>
        </v-sheet>
      </v-card-text>
      <v-card-text>
        <div class="display-1">
          Кол-во запросов за текущие сутки
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";
import format from "date-fns/format";

export default Vue.extend({
  name: "Home",
  data() {
    return {
      greeting: "",
      labels: [] as string[],
      values: [] as number[],
    };
  },
  async mounted() {
    const hours = new Date().getHours();
    if (hours >= 0 && hours <= 5) {
      this.greeting = "Доброй ночи!";
    } else if (hours >= 6 && hours <= 11) {
      this.greeting = "Доброе утро!";
    } else if (hours >= 12 && hours <= 17) {
      this.greeting = "Добрый день!";
    } else {
      this.greeting = "Добрый вечер!";
    }
    const statsRes = await axios.get("/api/stats");
    if (statsRes.status === 200) {
      let { data } = statsRes;
      data = data[format(new Date(), "dd.MM.uuuu")];
      for (let i = 0; i < 25; i += 1) {
        const hour = i.toString().padStart(2, "0");
        this.labels.push(hour);
        this.values.push(data[hour] || 0);
      }
    }
  },
  methods: {},
});
</script>
