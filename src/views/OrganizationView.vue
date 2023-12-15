<script setup lang="ts">
import {computed, type Ref, ref, watch} from "vue";
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

enum OrgView {
  RecurringPayments,
  Categories,
  Users,
  Roles,
}

let view: Ref<OrgView> = ref(OrgView.RecurringPayments);

let hasAdmin = computed(() => {
  return props.user.currentOrganization?.privileges?.includes('admin');
});

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
  <div class="container">
    <div class="row mt-2">
      <div class="col">
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
            <div class="row">
              <div class="col">
                <ul class="nav nav-underline ms-3">
                  <li class="nav-item">
                    <button class="nav-link" :class="{'active': view === OrgView.RecurringPayments}" @click="view = OrgView.RecurringPayments">{{ lang.recurringPayments }}</button>
                  </li>
                  <li class="nav-item">
                    <button class="nav-link" :class="{'active': view === OrgView.Categories, 'disabled': !hasAdmin}" @click="view = OrgView.Categories">{{ lang.categories }}</button>
                  </li>
                  <li class="nav-item">
                    <button class="nav-link" :class="{'active': view === OrgView.Users, 'disabled': !hasAdmin}" @click="view = OrgView.Users">{{ lang.users }}</button>
                  </li>
                  <li class="nav-item">
                    <button class="nav-link" :class="{'active': view === OrgView.Roles, 'disabled': !hasAdmin}" @click="view = OrgView.Roles">{{ lang.roles }}</button>
                  </li>
                </ul>
                <template v-if="view === OrgView.RecurringPayments">
                  <RecurringTransactionsComponent :display-values="!user.settings.privateMode"
                                                  :currency="user.currentOrganization?.currency ?? 'EUR'"
                                                  :show-taxes="user.currentOrganization?.usesTaxes ?? false"
                                                  :categories="categories"/>
                </template>
                <template v-else-if="view === OrgView.Categories">
                  <CategoriesComponent :categories="categories" @update-categories="$emit('update-categories')"/>
                </template>
                <template v-else-if="view === OrgView.Users">
                  <UsersComponent :user="user"/>
                </template>
                <template v-else-if="view === OrgView.Roles">
                  <RolesComponent :user="user"/>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>