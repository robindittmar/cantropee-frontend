<script setup lang="ts">
import {onMounted, ref} from "vue";
import type {Ref} from "vue";
import HomeView from "@/views/HomeView.vue";
import SettingsView from "@/views/SettingsView.vue";
import type {UserSettings} from "@/user-settings";
import {defaultUserSettings, fetchUserSettings, updateUserSettings} from "@/user-settings";

enum View {
  Home,
  Settings
}
let selectedView: Ref<View> = ref(View.Home);

const setView = (view: View) => {
  selectedView.value = view;
};

let userSettings: Ref<UserSettings> = ref(defaultUserSettings());

const updateSettings = async (settings: UserSettings) => {
  if (await updateUserSettings(settings)) {
    userSettings.value = settings;
  }
}

onMounted(async () => {
  userSettings.value = await fetchUserSettings();
});
</script>

<template>
  <HomeView v-if="selectedView === View.Home"
          :userSettings="userSettings"/>
  <SettingsView v-if="selectedView === View.Settings"
                :userSettings="userSettings" @update-user-settings="updateSettings"/>

  <div class="fixed-bottom">
    <div class="container mb-1 d-flex justify-content-center">
      <div class="btn-group" role="group">
        <input type="radio" class="btn-check" name="radioHomeView" id="radioHomeView" autocomplete="off"
               @click="setView(View.Home)"
               :checked="selectedView === View.Home">
        <label class="btn btn-outline-primary" for="radioHomeView">Home</label>

        <input type="radio" class="btn-check" name="radioTransactionsView" id="radioTransactionsView" autocomplete="off"
               @click="setView(View.Settings)"
               :checked="selectedView === View.Settings">
        <label class="btn btn-outline-primary" for="radioTransactionsView">Einstellungen</label>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
