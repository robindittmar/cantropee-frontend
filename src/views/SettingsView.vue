<script setup lang="ts">
import {ref, watch} from "vue";
import type {User} from "@/user";
import OrganizationComponent from "@/components/OrganizationComponent.vue";

const props = defineProps<{
  user: User;
}>();

defineEmits(['change-organization', 'update-user-settings']);

watch(() => props.user, () => {
  settings.value = props.user.settings;
  organizations.value = props.user.organizations;
});

let settings = ref(props.user.settings);
let organizations = ref(props.user.organizations);
</script>

<template>
  <div class="container">
    <header>
      <div class="d-flex justify-content-end pt-2 pe-2">
        <h6 class="me-2">{{ user.email }}</h6>
        <a class="btn btn-outline-danger me-2" href="/logout">
          <i class="fa-solid fa-arrow-right-from-bracket"></i>
        </a>
      </div>
      <div class="row mt-2">
        <div class="col">
          <OrganizationComponent :user="user" @change-organization="$emit('change-organization')"/>
        </div>
      </div>
    </header>

    <main>
      <div class="row mt-2">
        <div class="col">
          <h1>Nutzer Einstellungen</h1>

          <div class="form-check mt-3">
            <input id="privateModeCheck" type="checkbox" class="form-check-input" v-model="settings.privateMode">
            <label for="privateModeCheck" class="form-check-label">Privater Modus</label>
          </div>

          <div class="form-check mt-3">
            <input id="defaultPreviewCheck" type="checkbox" class="form-check-input" v-model="settings.defaultPreviewPending">
            <label for="defaultPreviewCheck" class="form-check-label">"Vorschau" aktiv wenn Seite geladen wird</label>
          </div>

          <div class="form-check mt-3">
            <input id="defaultSortingCheck" type="checkbox" class="form-check-input" v-model="settings.defaultSortingOrderAsc">
            <label for="defaultSortingCheck" class="form-check-label">Sortierung aufsteigend wenn Seite geladen wird</label>
          </div>

          <button class="btn btn-primary mt-3" @click="$emit('update-user-settings', settings)">Speichern</button>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>

</style>