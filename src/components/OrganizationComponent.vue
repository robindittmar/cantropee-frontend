<script setup lang="ts">
import type {Ref} from "vue";
import {ref} from "vue";

// const props = defineProps<{}>();

interface Organization {
  id: string;
  name: string;
  users: User[] | undefined;
}

interface User {
  id: string;
  email: string;
  role: string;
}

let organization: Ref<Organization | undefined> = ref(undefined);
let availableOrgs: Ref<string[]> = ref([]);

const fetchOrganizations = async () => {
  const result = await fetch('/api/organizations');
  const orgs = await result.json();

  let orgIds = [];
  for (const org of orgs) {
    if (org.id === orgs.selectedId) {
      organization.value = org;
    }

    orgIds.push(org.id);
  }

  availableOrgs.value = orgIds;
};

</script>

<template>
  <div class="card">
  <template v-if="organization">
    <div class="d-flex justify-content-end pt-2 pe-2">
      <a class="btn btn-outline-secondary" href="/api/export">
        <i class="fa-solid fa-download"></i>
      </a>
    </div>
    <img id="brand-image" alt="cat-jam" src="/public/img/cat-jam.gif" class="rounded mx-auto d-block" />
    <div class="card-body">
      <div class="row">
        <h5 class="card-title text-center">cantropee</h5>
      </div>
    </div>
  </template>
  <template v-else>
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </template>
  </div>
</template>

<style scoped>

</style>