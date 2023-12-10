<script setup lang="ts">
import {ref, watch} from "vue";
import type {User} from "@/core/user";
import type {Category} from "@/core/category";
import {req} from "@/core/requests";
import {lang} from "@/core/languages";

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

let inviteId = ref('');
let inviteExpires = ref('');

const createInvite = async () => {
  let result = await req('/api/invite', {
    method: 'POST',
  });

  if (result.ok) {
    let resp = await result.json();
    inviteId.value = resp.id;
    inviteExpires.value = resp.expiresAt.toLocaleString();
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
          <h1>Nutzer Einstellungen</h1>

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
      <div v-if="user.settings.canCreateInvite" class="row mt-2">
        <div class="col">
          <h1>{{ lang.invite }}</h1>

          <div class="input-group mt-3">
            <div class="form-floating">
              <input id="inviteInput" class="form-control" type="text" :value="inviteId" disabled/>
              <label for="inviteInput" class="form-label">{{ lang.invite }}</label>
            </div>
            <div class="form-floating">
              <input id="expiresInput" class="form-control" type="text" :value="inviteExpires" disabled/>
              <label for="expiresInput" class="form-label">{{ lang.validUntil }}</label>
            </div>
          </div>
          <div class="mt-3">
            <button class="btn btn-primary" @click="createInvite">{{ lang.createInvite }}</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>

</style>