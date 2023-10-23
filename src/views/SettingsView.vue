<script setup lang="ts">
import {ref, watch} from "vue";
import type {User} from "@/user";
import OrganizationComponent from "@/components/OrganizationComponent.vue";

const props = defineProps<{
  user: User;
}>();

defineEmits(['update-user-settings']);

watch(() => props.user, () => {
  settings.value = props.user.settings;
});

let settings = ref(props.user.settings);
</script>

<template>
  <div class="container">
    <header>
      <div class="row mt-2">
        <div class="col">
          <OrganizationComponent />
        </div>
      </div>
    </header>

    <main>
      <div class="row mt-2">
        <div class="col">
          <h1>Nutzer Einstellungen</h1>

          <div class="form-check">
            <input id="privateModeCheck" type="checkbox" class="form-check-input" v-model="settings.privateMode">
            <label for="privateModeCheck" class="form-check-label">Privater Modus</label>
          </div>

          <button class="btn btn-primary" @click="$emit('update-user-settings', settings)">Speichern</button>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>

</style>