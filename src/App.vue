<script setup lang="ts">
import {onMounted, ref} from "vue";
import type {Ref} from "vue";
import type {User, UserSettings} from "@/user";
import {defaultUser, fetchUser, updateUserSettings} from "@/user";
import HomeView from "@/views/HomeView.vue";
import SettingsView from "@/views/SettingsView.vue";

enum View {
  Home,
  Settings
}
let selectedView: Ref<View> = ref(View.Home);

const setView = (view: View) => {
  selectedView.value = view;
};

let user: Ref<User> = ref(defaultUser());

const updateSettings = async (settings: UserSettings) => {
  if (await updateUserSettings(settings)) {
    let intermediate = user.value;

    intermediate.settings = settings;
    user.value = intermediate;
  }
}

onMounted(async () => {
  user.value = await fetchUser();
});
</script>

<template>
  <HomeView v-if="selectedView === View.Home"
            :user="user"/>
  <SettingsView v-if="selectedView === View.Settings"
                :user="user" @update-user-settings="updateSettings"/>

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
