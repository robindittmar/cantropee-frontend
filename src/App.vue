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
import {toast, toasts} from "@/core/toaster";
import ChartView from "@/views/ChartView.vue";
import {req} from "@/core/requests";
import {availableLangCodes, availableLocaleCodes, lang, langCode, languages, localeCode} from "@/core/languages";
import ChangeLanguageComponent from "@/components/ChangeLanguageComponent.vue";

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

let invite: string | null = null;
let initialLoadDone = ref(false);
let user: Ref<User> = ref(defaultUser());
let privateMode: Ref<boolean> = ref(true);
let categories: Ref<Category[]> = ref([{id: 0, name: ''}]);


const changeOrganization = (orgId: string) => {
  location.reload();
}

const initialLoad = async () => {
  try {
    user.value = await fetchUser();
    categories.value = await fetchCategories();

    privateMode.value = user.value.settings.privateMode;
    selectLanguage(user.value.settings.language);
    selectLocale(user.value.settings.locale);
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
  let result = await req('/api/logout', {
    method: 'POST',
  });

  if (result.ok) {
    authorized.value = false;
    setView(View.Home);
  }
};

const updateSettings = async (settings: UserSettings) => {
  if (await updateUserSettings(settings)) {
    let intermediate = user.value;

    intermediate.settings = settings;
    user.value = intermediate;

    selectLanguage(settings.language);
    selectLocale(settings.locale);

    toast(lang.value.settingsSaved);
  }
}

const selectLanguage = (code: string) => {
  if (!availableLangCodes.includes(code)) {
    return;
  }
  if (langCode.value === code) {
    return;
  }

  langCode.value = code;
  lang.value = languages[code];
  localStorage.setItem('lang', code);
};

const selectLocale = (code: string) => {
  if (!availableLocaleCodes.includes(code)) {
    return;
  }
  if (localeCode.value === code) {
    return;
  }

  localeCode.value = code;
};

onMounted(async () => {
  selectedView.value = parseInt(localStorage.getItem('view') ?? View.Home.toString());
  let storedLang = localStorage.getItem('lang');
  if (storedLang) {
    langCode.value = storedLang;
  }
  selectLanguage(langCode.value);

  let url = new URL(location.href);
  invite = url.searchParams.get('invite');
  url.searchParams.delete('invite');
  history.replaceState(null, 'Cantropee', url);
  if (!invite) {
    await initialLoad();
  } else {
    initialLoadDone.value = true;
  }
});
</script>

<template>
  <template v-if="initialLoadDone">
    <template v-if="authorized">
      <div class="d-flex justify-content-end pt-2 pe-2">
        <h6 class="me-2 mt-2">{{ user.email }}</h6>
        <ChangeLanguageComponent :lang-code="langCode" @set-language="selectLanguage"/>
        <div class="me-2">
          <input id="privateModeCheckbox" class="btn-check" type="checkbox" v-model="privateMode"/>
          <label for="privateModeCheckbox" class="btn btn-outline-primary w-100"><i class="fa-solid fa-eye-slash"></i></label>
        </div>
        <a class="btn btn-outline-danger me-2" @click="logout">
          <i class="fa-solid fa-arrow-right-from-bracket"></i>
        </a>
      </div>

      <HomeView v-if="selectedView === View.Home"
                :user="user" :display-values="!privateMode" :categories="categories"/>

      <ChartView v-if="selectedView === View.Chart"/>

      <OrganizationView v-if="selectedView === View.Organization"
                        :user="user" :display-values="!privateMode" :categories="categories"
                        @change-organization="changeOrganization"
                        @update-categories="reloadCategories"/>

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
      <div class="d-flex justify-content-end pt-2 pe-2">
        <ChangeLanguageComponent :lang-code="langCode" @set-language="selectLanguage"/>
      </div>
      <LoginView :invite="invite" @authenticated="initialLoad" @invite-consumed="invite = null"/>
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
