<script setup lang="ts">

import {ref, watch} from "vue";
import type {User} from "@/core/user";
import type {Category} from "@/core/category";
import RecurringTransactionsComponent from "@/components/RecurringTransactionsComponent.vue";
import {req} from "@/core/requests";
import UsersComponent from "@/components/UsersComponent.vue";
import CategoriesComponent from "@/components/CategoriesComponent.vue";
import RolesComponent from "@/components/RolesComponent.vue";

const props = defineProps<{
  user: User;
  categories: Category[];
}>();

const emit = defineEmits(['change-organization', 'update-categories']);

const selectedOrg = ref(props.user.currentOrganization?.id ?? '');
watch(selectedOrg, async () => {
  const orgId = selectedOrg.value;

  const result = await req('/api/session/organization', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({organizationId: orgId}),
  });

  if (result.ok) {
    emit('change-organization', orgId);
  }
});
</script>

<template>
  <div class="card">
    <div class="d-flex justify-content-end pt-2 pe-2">
      <a class="btn btn-outline-secondary" href="/api/export">
        <i class="fa-solid fa-download"></i>
      </a>
    </div>
    <h2 class="card-title text-center mt-2">{{ user.currentOrganization?.name }}</h2>
    <div class="card-body">
      <div class="row">
        <div class="col">
          <div class="mb-3">
            <select id="organizationSelect" class="form-select" v-model="selectedOrg">
              <option v-for="org in user.organizations" :key="org.id" :value="org.id"
                      :selected="org.id === user.currentOrganization?.id">
                {{ org.name }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <h4 class="text-center mt-5">Daueraufträge</h4>
      <div class="row">
        <div class="col">
          <RecurringTransactionsComponent :display-values="!user.settings.privateMode"
                                          :currency="user.currentOrganization?.currency ?? 'EUR'"
                                          :show-taxes="user.currentOrganization?.usesTaxes ?? false"
                                          :categories="categories"/>
        </div>
      </div>
      <template v-if="user.currentOrganization?.privileges?.includes('admin')">
        <h4 class="text-center mt-5">Kategorien</h4>
        <div class="row">
          <div class="col">
            <CategoriesComponent :categories="categories" @update-categories="$emit('update-categories')"/>
          </div>
        </div>
        <h4 class="text-center mt-5">Benutzer</h4>
        <div class="row">
          <div class="col">
            <UsersComponent :user="user"/>
          </div>
        </div>
        <h4 class="text-center mt-5">Rollen</h4>
        <div class="row">
          <div class="col">
            <RolesComponent :user="user"/>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>

</style>