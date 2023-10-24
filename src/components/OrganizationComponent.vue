<script setup lang="ts">

import type {User} from "@/user";

const _props = defineProps<{
  user: User;
}>();
</script>

<template>
  <div class="card">
    <div class="d-flex justify-content-end pt-2 pe-2">
      <a class="btn btn-outline-secondary" href="/api/export">
        <i class="fa-solid fa-download"></i>
      </a>
    </div>
    <img id="brand-image" alt="cat-jam" src="/public/img/cat-jam.gif" class="rounded mx-auto d-block" />
    <div class="card-body">
      <div class="row">
        <h2 class="card-title text-center">{{ user.currentOrg?.name }}</h2>
        <h3 class="text-center">{{ user.email }}</h3>
      </div>
      <div class="mb-3">
        <select id="organizationSelect" class="form-select">
          <option v-for="org in user.organizations" :key="org.id" :value="org.id"
                  :selected="org.id === user.currentOrg?.id">
            {{ org.name }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>