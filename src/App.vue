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
import ToastComponent from "@/components/ToastComponent.vue";
import LoginView from "@/views/LoginView.vue";

enum View {
  Home,
  Organization,
  Settings
}
let selectedView: Ref<View> = ref(View.Home);

const setView = (view: View) => {
  selectedView.value = view;
  localStorage.setItem('view', view.toString());
};

let authenticated = ref(false);
let initialLoadDone = ref(false);
let user: Ref<User> = ref(defaultUser());
let categories: Ref<Category[]> = ref([{id: 0, name: ''}]);
let toasts: Ref<{title: string, subtitle: string, body: string}[]> = ref([]);

const changeOrganization = (orgId: string) => {
  location.reload();
}

const initialLoad = async () => {
  try {
    user.value = await fetchUser();
    categories.value = await fetchCategories();
    authenticated.value = true;
  } catch {
    authenticated.value = false;
  }

  initialLoadDone.value = true;
};

const logout = async () => {
  authenticated.value = false;
  setView(View.Home);
};

const updateSettings = async (settings: UserSettings) => {
  if (await updateUserSettings(settings)) {
    let intermediate = user.value;

    intermediate.settings = settings;
    user.value = intermediate;
  }
}

const toast = (title: string, body: string) => {
  let toast = {
    title,
    body,
    subtitle: 'just now',
  };

  toasts.value.push(toast);
  setInterval(() => {
    toasts.value = toasts.value.filter(t => t.title !== toast.title);
  }, 10000);
};

onMounted(async () => {
  selectedView.value = parseInt(localStorage.getItem('view') ?? View.Home.toString());

  await initialLoad();
});
</script>

<template>
  <template v-if="initialLoadDone">
    <template v-if="authenticated">
    <HomeView v-if="selectedView === View.Home"
              :user="user" :categories="categories"/>
    <OrganizationView v-if="selectedView === View.Organization"
                      :user="user" :categories="categories"
                      @change-organization="changeOrganization"/>
    <SettingsView v-if="selectedView === View.Settings"
                  :user="user" :categories="categories"
                  @user-logout="logout"
                  @update-user-settings="updateSettings"/>
    <div class="bottom-filler">
    </div>
    <ToastComponent v-for="toast of toasts" :key="toast.title" :title="toast.title" :subtitle="toast.subtitle" :body="toast.body"/>
    <div class="fixed-bottom">
      <div class="container mb-1 d-flex justify-content-center">
        <div class="btn-group" role="group">
          <input type="radio" class="btn-check" name="radioHomeView" id="radioHomeView" autocomplete="off"
                 @click="setView(View.Home)"
                 :checked="selectedView === View.Home">
          <label class="btn btn-outline-primary" for="radioHomeView"><i class="fa-solid fa-house"></i></label>

          <input type="radio" class="btn-check" name="radioChartView" id="radioChartView" autocomplete="off"
                 disabled />
          <label class="btn btn-outline-primary" for="radioChartView"><i class="fa-solid fa-chart-simple"></i></label>

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
      <LoginView @authenticated="initialLoad"/>
    </template>
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
