import { Settings } from "../../@types/Settings";

export default {
  namespaced: true,
  state: {
    dark: false,
    drawerClipped: false,
    formatData: true,
  },
  mutations: {
    update(state: Settings, payload: Settings) {
      for (const key of Object.keys(payload)) {
        state[key] = payload[key];
      }
    },
  },
  actions: {},
};
