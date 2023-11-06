<script setup lang="ts">
import {onMounted, ref} from "vue";
import type {Ref} from "vue";
import type {User, UserSettings} from "@/core/user";
import type {Category} from '@/core/category';
import {authorized, defaultUser, fetchUser, updateUserSettings} from "@/core/user";
import HomeView from "@/views/HomeView.vue";
import SettingsView from "@/views/SettingsView.vue";
import {fetchCategories} from "@/core/category";
import OrganizationView from "@/views/OrganizationView.vue";
import ToastComponent from "@/components/ToastComponent.vue";
import LoginView from "@/views/LoginView.vue";
import {toasts} from "@/core/toaster";
import ChartView from "@/views/ChartView.vue";

enum View {
  Home,
  Chart,
  Organization,
  Settings
}
let selectedView: Ref<View> = ref(View.Home);

const setView = (view: View) => {
  selectedView.value = view;
  localStorage.setItem('view', view.toString());
};

let initialLoadDone = ref(false);
let user: Ref<User> = ref(defaultUser());
let categories: Ref<Category[]> = ref([{id: 0, name: ''}]);


const changeOrganization = (orgId: string) => {
  location.reload();
}

const initialLoad = async () => {
  try {
    user.value = await fetchUser();
    categories.value = await fetchCategories();
    authorized.value = true;
  } catch {
    authorized.value = false;
  }

  initialLoadDone.value = true;
};

const reloadCategories = async () => {
  categories.value = await fetchCategories();
};

const logout = async () => {
  authorized.value = false;
  setView(View.Home);
};

const updateSettings = async (settings: UserSettings) => {
  if (await updateUserSettings(settings)) {
    let intermediate = user.value;

    intermediate.settings = settings;
    user.value = intermediate;
  }
}

onMounted(async () => {
  selectedView.value = parseInt(localStorage.getItem('view') ?? View.Home.toString());

  await initialLoad();
});
</script>

<template>
  <template v-if="initialLoadDone">
    <template v-if="authorized">
      <HomeView v-if="selectedView === View.Home"
                :user="user" :categories="categories"/>

      <ChartView v-if="selectedView === View.Chart"/>

      <OrganizationView v-if="selectedView === View.Organization"
                        :user="user" :categories="categories"
                        @change-organization="changeOrganization"
                        @update-categories="reloadCategories"/>

      <SettingsView v-if="selectedView === View.Settings"
                    :user="user" :categories="categories"
                    @user-logout="logout"
                    @update-user-settings="updateSettings"/>
      <div class="bottom-filler">
      </div>
      <div class="fixed-bottom">
        <div class="container mb-1 d-flex justify-content-center">
          <div class="btn-group" role="group">
            <input type="radio" class="btn-check" name="radioHomeView" id="radioHomeView" autocomplete="off"
                   @click="setView(View.Home)"
                   :checked="selectedView === View.Home"/>
            <label class="btn btn-outline-primary" for="radioHomeView"><i class="fa-solid fa-house"></i></label>

            <input type="radio" class="btn-check" name="radioChartView" id="radioChartView" autocomplete="off"
                   @click="setView(View.Chart)"
                   :checked="selectedView === View.Chart"/>
            <label class="btn btn-outline-primary" for="radioChartView"><i class="fa-solid fa-chart-simple"></i></label>

            <input type="radio" class="btn-check" name="radioOrgView" id="radioOrgView" autocomplete="off"
                   @click="setView(View.Organization)"
                   :checked="selectedView === View.Organization"/>
            <label class="btn btn-outline-primary" for="radioOrgView"><i class="fa-solid fa-building"></i></label>

            <input type="radio" class="btn-check" name="radioTransactionsView" id="radioTransactionsView" autocomplete="off"
                   @click="setView(View.Settings)"
                   :checked="selectedView === View.Settings"/>
            <label class="btn btn-outline-primary" for="radioTransactionsView"><i class="fa-solid fa-gear"></i></label>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <LoginView @authenticated="initialLoad"/>
    </template>
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <ToastComponent v-for="toast of toasts" :key="toast.id" :toast="toast"/>
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
