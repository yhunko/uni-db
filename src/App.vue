<template>
  <v-app>
    <v-app-bar
      color="primary"
      :clipped-left="$store.state.settings.drawerClipped"
      dark
      app
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>{{ tr.route[$route.name] }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="goTo('https://github.com/yegorgunko/uni-db')" icon>
        <v-icon>mdi-github</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      :clipped="$store.state.settings.drawerClipped"
      app
    >
      <v-list rounded nav>
        <v-list-item color="primary" to="/" exact link>
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Главная</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-group prepend-icon="mdi-table-large" value="true" no-action>
          <template v-slot:activator>
            <v-list-item-title>Таблицы</v-list-item-title>
          </template>
          <v-list-item
            v-for="(item, i) in sequence"
            :key="i"
            :to="`/table/${item.name}`"
            link
            exact
          >
            <v-list-item-title
              v-text="tr.table[item.name][item.name]"
            ></v-list-item-title>
          </v-list-item>
        </v-list-group>
        <v-list-item color="primary" to="/settings" exact link>
          <v-list-item-icon>
            <v-icon>mdi-cog</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Настройки</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";

import translation from "@/constants/translation";

type Sequence = {
  name: string;
};

export default Vue.extend({
  name: "App",
  data() {
    return {
      drawer: null as unknown,
      navSelected: 0,
      sequence: [] as Sequence[],
      tr: translation,
    };
  },
  async created() {
    try {
      const savedSettings = window.localStorage.getItem("settings");
      if (savedSettings) {
        this.$store.commit("settings/update", JSON.parse(savedSettings));
      }
      this.$vuetify.theme.dark = this.$store.state.settings.dark;
      const res = await axios.get("/api/list");
      this.sequence = res.data;
    } catch (err) {
      window.alert(err);
    }
  },
  methods: {
    goTo(url: string): void {
      window.open(url, "_blank");
    },
  },
});
</script>
