<template>
  <div class="settings">
    <v-container>
      <v-card>
        <v-container>
          <v-list subheader two-line flat>
            <v-subheader>Основное</v-subheader>
            <v-list-item>
              <v-list-item-action>
                <v-checkbox
                  v-model="settings.formatData"
                  color="primary"
                  @change="updateSettings()"
                ></v-checkbox>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Форматирование данных</v-list-item-title>
                <v-list-item-subtitle>
                  Использовать форматирование внешних ключей в таблицах
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-list subheader two-line flat>
            <v-subheader>Интерфейс</v-subheader>
            <v-list-item>
              <v-list-item-action>
                <v-checkbox
                  v-model="settings.dark"
                  color="primary"
                  @change="updateSettings()"
                ></v-checkbox>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Тёмная тема</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item three-line :disabled="$vuetify.breakpoint.mdAndDown">
              <v-list-item-action>
                <v-checkbox
                  v-model="settings.drawerClipped"
                  @change="updateSettings()"
                  :disabled="$vuetify.breakpoint.mdAndDown"
                  color="primary"
                ></v-checkbox>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Обрезанное меню</v-list-item-title>
                <v-list-item-subtitle>
                  Если активно, навигационное меню слева будет расположено под
                  верхней панелью
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-container>
      </v-card>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data() {
    return {
      settings: this.$store.state.settings,
    };
  },
  // created() {
  //   const savedSettings = window.localStorage.getItem("settings");
  //   if (savedSettings) {
  //     const parsed = JSON.parse(savedSettings);
  //     for (const key in parsed) {
  //       this.settings[key] = parsed[key];
  //     }
  //     this.settings = JSON.parse(savedSettings);
  //   }
  // },
  methods: {
    updateSettings(): void {
      this.$store.commit("settings/update", this.settings);
      this.$vuetify.theme.dark = this.$store.state.settings.dark;
      window.localStorage.setItem("settings", JSON.stringify(this.settings));
    },
  },
});
</script>
