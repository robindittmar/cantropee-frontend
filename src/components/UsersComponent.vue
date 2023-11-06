<script setup lang="ts">
import type {Ref} from "vue";
import {onMounted, ref} from "vue";
import {req} from "@/core/requests";
import type {User} from "@/core/user";

const props = defineProps<{
  user: User;
}>();

interface OrgUser {
  id: string;
  email: string;
  role: string;
}

let users: Ref<OrgUser[]> = ref([]);

const fetchUsers = async () => {
  const res = await req('/api/users');
  if (res.ok) {
    users.value = (await res.json());
  }
};

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <div class="card">
    <div class="row">
      <div class="col table-responsive">
        <table class="table table-hover" >
          <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">E-Mail</th>
            <th scope="col">Rolle</th>
          </tr>
          </thead>
          <tbody class="table-group-divider">
          <template v-for="(orgUser, i) in users" :key="orgUser.id">
            <tr>
              <template v-if="orgUser.id !== user.id">
                <td>{{ i + 1 }}</td>
                <td>{{ orgUser.email }}</td>
                <td>{{ orgUser.role }}</td>
              </template>
              <template v-else>
                <th scope="row">{{ i + 1 }}</th>
                <th scope="row">{{ orgUser.email }} <i>*</i></th>
                <th scope="row">{{ orgUser.role }}</th>
              </template>
            </tr>
          </template>
          </tbody>
        </table>
      </div>
    </div>
    <div class="d-flex justify-content-center pt-2 pb-2">
      <button class="btn btn-success" disabled>
        <i class="fa-solid fa-plus"></i>&nbsp;Neu
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>
