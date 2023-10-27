<script setup lang="ts">

import type {User} from "@/user";
import {ref, watch} from "vue";

const props = defineProps<{
  user: User;
}>();

const emit = defineEmits(['change-organization']);

const selectedOrg = ref(props.user.currentOrg?.id ?? '');
watch(selectedOrg, async () => {
  const orgId = selectedOrg.value;

  await fetch('/api/session/organization', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({organizationId: orgId}),
  });

  emit('change-organization', orgId);
});
</script>

<template>
  <div class="card">
    <div class="d-flex justify-content-end pt-2 pe-2">
      <a class="btn btn-outline-secondary" href="/api/export">
        <i class="fa-solid fa-download"></i>
      </a>
    </div>
    <h2 class="card-title text-center mt-2">{{ user.currentOrg?.name }}</h2>
    <div class="card-body">
      <div class="row">
        <div class="col">
          <div class="mb-3">
            <select id="organizationSelect" class="form-select" v-model="selectedOrg">
              <option v-for="org in user.organizations" :key="org.id" :value="org.id"
                      :selected="org.id === user.currentOrg?.id">
                {{ org.name }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>