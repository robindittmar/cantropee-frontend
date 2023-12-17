<script setup lang="ts">
import {Modal} from "bootstrap";
import {type Ref, onBeforeUnmount, onMounted, ref} from "vue";
import {req} from "@/core/requests";
import {lang} from "@/core/languages";
import type {Role} from "@/core/role";

const emit = defineEmits(['user-added', 'modal-closed']);

let submitting = ref(false);
let roles: Ref<Role[]> = ref([]);
let email = ref([]);
let selectedRole = ref('');

const fetchRoles = async () => {
  const result = await req('/api/roles');
  if (result.ok) {
    roles.value = (await result.json()).roles ?? [];
    selectedRole.value = roles.value[0].id;
  }
};

const addUser = async () => {
  submitting.value = true;
  const result = await req('/api/organization/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email.value,
      roleId: selectedRole.value,
    }),
  });

  submitting.value = false;

  if (result.ok) {
    emit('user-added');
    closeModal();
  }
};

const closeModal = () => {
  const modal = Modal.getOrCreateInstance('#addUserModal');
  modal.hide();
};

onMounted(() => {
  fetchRoles();

  const modal = Modal.getOrCreateInstance('#addUserModal');
  modal.show();

  const modalElem = document.querySelector('#addUserModal');
  modalElem?.addEventListener('hidden.bs.modal', () => {
    emit('modal-closed');
  });
});

onBeforeUnmount(() => {
  closeModal();
});
</script>

<template>
  <div class="modal fade" id="addUserModal" tabindex="-1" aria-labelledby="addUserModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="addUserModalLabel">{{ lang.addUserToOrganization }}</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="addUser">
            <div class="mb-3">
              <label for="email" class="form-label">{{ lang.email }}</label>
              <input id="email" class="form-control" v-model="email"/>
            </div>

            <div class="mb-3">
              <label for="role" class="form-label">{{ lang.role }}</label>
              <select id="recurringCategory" class="form-select" v-model="selectedRole">
                <option v-for="role in roles" :key="role.id" :value="role.id">
                  {{ role.name }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <input type="submit" class="btn btn-primary w-100" :disabled="submitting || email.length === 0" :value="lang.add"/>
            </div>
            <div class="mb-3">
              <button @click="closeModal" class="btn btn-secondary w-100">{{ lang.cancel }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>