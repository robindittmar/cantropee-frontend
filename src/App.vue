<script setup lang="ts">
import {onMounted, ref} from "vue";
import type {Ref} from "vue";
import type {User, UserSettings} from "@/user";
import type {Category} from '@/category';
import {defaultUser, fetchUser, updateUserSettings} from "@/user";
import HomeView from "@/views/HomeView.vue";
import SettingsView from "@/views/SettingsView.vue";
import {fetchCategories} from "@/category";
import OrganizationView from "@/views/OrganizationView.vue";

enum View {
  Home,
  Organization,
  Settings
}
let selectedView: Ref<View> = ref(View.Home);

const setView = (view: View) => {
  selectedView.value = view;
};

let initialLoadDone = ref(false);
let user: Ref<User> = ref(defaultUser());
let categories: Ref<Category[]> = ref([{id: 0, name: ''}]);

const changeOrganization = (orgId: string) => {
  location.reload();
}

const updateSettings = async (settings: UserSettings) => {
  if (await updateUserSettings(settings)) {
    let intermediate = user.value;

    intermediate.settings = settings;
    user.value = intermediate;
  }
}

const afterMounted = async () => {
  categories.value = await fetchCategories();
};

onMounted(async () => {
  user.value = await fetchUser();
  initialLoadDone.value = true;

  afterMounted();
});
</script>

<template>
  <template v-if="initialLoadDone">
  <HomeView v-if="selectedView === View.Home"
            :user="user" :categories="categories"/>
  <OrganizationView v-if="selectedView === View.Organization"
                    :user="user" :categories="categories"
                    @change-organization="changeOrganization"/>
  <SettingsView v-if="selectedView === View.Settings"
                :user="user" :categories="categories"
                @update-user-settings="updateSettings"/>
  <div class="bottom-filler">
  </div>
  <div class="fixed-bottom">
    <div class="container mb-1 d-flex justify-content-center">
      <div class="btn-group" role="group">
        <input type="radio" class="btn-check" name="radioHomeView" id="radioHomeView" autocomplete="off"
               @click="setView(View.Home)"
               :checked="selectedView === View.Home">
        <label class="btn btn-outline-primary" for="radioHomeView"><i class="fa-solid fa-house"></i></label>

        <input type="radio" class="btn-check" name="radioOrgView" id="radioOrgView" autocomplete="off"
               @click="setView(View.Organization)"
               :checked="selectedView === View.Organization">
        <label class="btn btn-outline-primary" for="radioOrgView"><i class="fa-solid fa-building"></i></label>

        <input type="radio" class="btn-check" name="radioTransactionsView" id="radioTransactionsView" autocomplete="off"
               @click="setView(View.Settings)"
               :checked="selectedView === View.Settings">
        <label class="btn btn-outline-primary" for="radioTransactionsView"><i class="fa-solid fa-gear"></i></label>
      </div>
    </div>
  </div>
  </template>
  <template v-else>
    <div class="d-flex justify-content-center mt-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </template>
</template>

<style scoped>
.bottom-filler {
  min-height: 50px;
}
</style>
