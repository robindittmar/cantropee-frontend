<script setup lang="ts">

import {ref, watch} from "vue";
import type {User} from "@/core/user";
import type {Category} from "@/core/category";
import RecurringTransactionsComponent from "@/components/RecurringTransactionsComponent.vue";
import {req} from "@/core/requests";
import {lang} from "@/core/languages";
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
    <div class="card-body">
      <div class="row">
        <div class="col">
          <div class="button-group mb-3 text-center">
            <button class="btn btn-primary btn-lg dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              {{ user.currentOrganization?.name }}
            </button>
            <ul class="dropdown-menu">
              <li v-for="org in user.organizations" :key="org.id">
                <a class="dropdown-item" @click="selectedOrg = org.id">{{ org.name }}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <h4 class="text-center mt-5">{{ lang.recurringPayments }}</h4>
      <div class="card">
        <RecurringTransactionsComponent :display-values="!user.settings.privateMode"
                                        :currency="user.currentOrganization?.currency ?? 'EUR'"
                                        :show-taxes="user.currentOrganization?.usesTaxes ?? false"
                                        :categories="categories"/>
      </div>
      <template v-if="user.currentOrganization?.privileges?.includes('admin')">
        <h4 class="text-center mt-5">{{ lang.categories }}</h4>
        <div class="card">
          <CategoriesComponent :categories="categories" @update-categories="$emit('update-categories')"/>
        </div>
        <h4 class="text-center mt-5">{{ lang.users }}</h4>
        <div class="card">
          <UsersComponent :user="user"/>
        </div>
        <h4 class="text-center mt-5">{{ lang.roles }}</h4>
        <div class="card">
          <RolesComponent :user="user"/>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>

</style>