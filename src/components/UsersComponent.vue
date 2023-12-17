<script setup lang="ts">
import type {Ref} from "vue";
import {onMounted, ref} from "vue";
import {req} from "@/core/requests";
import {lang} from "@/core/languages";
import type {User} from "@/core/user";
import AddUserModal from "@/components/AddUserModal.vue";

const props = defineProps<{
  user: User;
}>();

interface OrgUser {
  id: string;
  email: string;
  role: string;
}

const initialLoadDone = ref(false);
const addingUser = ref(false);
const users: Ref<OrgUser[]> = ref([]);

const fetchUsers = async () => {
  const res = await req('/api/users');
  if (res.ok) {
    users.value = (await res.json());
    initialLoadDone.value = true;
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
            <th scope="col">{{ lang.email }}</th>
            <th scope="col">{{ lang.role }}</th>
          </tr>
          </thead>
          <tbody class="table-group-divider">
          <template v-if="initialLoadDone">
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
          </template>
          <template v-else>
            <tr>
              <td colspan="3">
                <div class="d-flex justify-content-center mt-4">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
              </td>
            </tr>
          </template>
          </tbody>
        </table>
      </div>
    </div>
    <div class="d-flex justify-content-center pt-2 pb-2">
      <button class="btn btn-success" @click="addingUser = true">
        <i class="fa-solid fa-plus"></i>&nbsp;{{ lang.add }}
      </button>
    </div>
  </div>

  <AddUserModal v-if="addingUser" @user-added="fetchUsers" @modal-closed="addingUser = false"/>
</template>

<style scoped>

</style>
