<script setup lang="ts">
import {ref, watch} from "vue";
import type {User} from "@/core/user";
import type {Category} from "@/core/category";
import {req} from "@/core/requests";
import {availableLangCodes, availableLocaleCodes, lang} from "@/core/languages";
import {toast, ToastColor} from "@/core/toaster";
import ChangePasswordForm from "@/components/ChangePasswordForm.vue";
import {Collapse} from "bootstrap";

const props = defineProps<{
  user: User;
  categories: Category[];
}>();

const emit = defineEmits(['user-logout', 'update-user-settings']);

watch(() => props.user, () => {
  settings.value = props.user.settings;
  organizations.value = props.user.organizations;
});

let settings = ref(props.user.settings);
let organizations = ref(props.user.organizations);

let creatingInvite = ref(false);
let inviteUrl = ref('');

const closeResetPassword = () => {
  const collapse = Collapse.getOrCreateInstance('#resetPasswordCollapse');
  collapse.hide();

  toast(lang.value.passwordChangedSuccess, ToastColor.Success);
};

const createInvite = async () => {
  creatingInvite.value = true;

  let result = await req('/api/invite', {
    method: 'POST',
  });

  if (result.ok) {
    let resp = await result.json();
    inviteUrl.value = `https://cantropee.dittmar.dev/?invite=${resp.id}`;

    setTimeout(() => {
      creatingInvite.value = false;
    }, 3000);

    await copyInviteToClipboard();
  } else {
    creatingInvite.value = false;
  }
};

const copyInviteToClipboard = async () => {
  const url = inviteUrl.value;
  try {
    await navigator.clipboard.writeText(url);
    toast(lang.value.copyToClipboardSuccess);
  } catch (err) {
    toast(lang.value.copyToClipboardFailure, ToastColor.Danger);
  }
};
</script>

<template>
  <div class="container">
    <header>

    </header>

    <main>
      <div class="row mt-2">
        <div class="col">
          <h1>{{ lang.userSettings }}</h1>

          <div class="input-group mt-3">
            <span class="input-group-text">{{ lang.languageSetting }}</span>
            <select id="languageSelect" class="form-select" v-model="settings.language">
              <option v-for="langCode in availableLangCodes" :key="langCode" :value="langCode">
                {{ langCode }}
              </option>
            </select>
          </div>

          <div class="input-group mt-3">
            <span class="input-group-text">{{ lang.localeSetting }}</span>
            <select id="languageSelect" class="form-select" v-model="settings.locale">
              <option v-for="localeCode in availableLocaleCodes" :key="localeCode" :value="localeCode">
                {{ localeCode }}
              </option>
            </select>
          </div>

          <div class="form-check mt-3">
            <input id="privateModeCheck" type="checkbox" class="form-check-input" v-model="settings.privateMode">
            <label for="privateModeCheck" class="form-check-label">{{ lang.privateModeActiveOnLoad }}</label>
          </div>

          <div class="form-check mt-3">
            <input id="defaultPreviewCheck" type="checkbox" class="form-check-input" v-model="settings.defaultPreviewPending">
            <label for="defaultPreviewCheck" class="form-check-label">{{ lang.previewActiveOnLoad }}</label>
          </div>

          <div class="form-check mt-3">
            <input id="defaultSortingCheck" type="checkbox" class="form-check-input" v-model="settings.defaultSortingOrderAsc">
            <label for="defaultSortingCheck" class="form-check-label">{{ lang.sortingAscendingOnLoad }}</label>
          </div>

          <button class="btn btn-primary mt-3" @click="$emit('update-user-settings', settings)">{{ lang.save }}</button>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <hr class="mb-4"/>
          <div>
            <button class="btn btn-primary" data-bs-toggle="collapse" data-bs-target="#resetPasswordCollapse">{{ lang.resetPassword }}</button>
            <div id="resetPasswordCollapse" class="collapse pt-4">
              <ChangePasswordForm :require-current-password="true" @password-changed="closeResetPassword"/>
            </div>
          </div>
        </div>
      </div>
      <div v-if="user.settings.canCreateInvite" class="row mt-2">
        <div class="col">
          <hr/>
          <h1>{{ lang.invite }}</h1>

          <div class="input-group mt-3">
            <div class="form-floating">
              <input id="inviteInput" class="form-control" type="text" :value="inviteUrl" disabled/>
              <label for="inviteInput" class="form-label">{{ lang.invite }}</label>
            </div>
            <button class="btn btn-secondary" @click="copyInviteToClipboard" :disabled="inviteUrl.length === 0">
              <i class="fa-solid fa-copy"></i>
            </button>
          </div>
          <div class="mt-3">
            <button class="btn btn-primary" @click="createInvite" :disabled="creatingInvite">{{ lang.createInvite }}</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>

</style>