<script setup lang="ts">
import type {Ref} from "vue";
import {onMounted, ref} from "vue";
import type {Role} from "@/core/role";
import {req} from "@/core/requests";
import {toast, ToastColor} from "@/core/toaster";

const emit = defineEmits(['update-roles']);

interface SimplifiedRole {
  id: string;
  name: string;
  read: boolean;
  write: boolean;
  admin: boolean;
}

const nullSimplifiedRole = () => {
  return {
    id: '',
    name: '',
    read: false,
    write: false,
    admin: false,
  };
};

const initialLoadDone = ref(false);
const roles: Ref<SimplifiedRole[]> = ref([]);
const selectedRole = ref('');
const roleCopy: Ref<SimplifiedRole> = ref(nullSimplifiedRole());
const newRole: Ref<SimplifiedRole | undefined> = ref(undefined);

const selectRole = (roleId: string) => {
  roleCopy.value = {...roles.value.find(r => r.id === roleId) ?? nullSimplifiedRole()};
  selectedRole.value = roleId;
}

const simplifiedToRole = (simplified: SimplifiedRole): Role => {
  const privileges = [];
  if (simplified.read) { privileges.push('read'); }
  if (simplified.write) { privileges.push('write'); }
  if (simplified.admin) { privileges.push('admin'); }

  return {
    id: simplified.id,
    name: simplified.name,
    privileges: privileges,
  };
};

const fetchRoles = async () => {
  const result = await req('/api/roles');
  if (result.ok) {
    roles.value = (await result.json()).roles?.map((r: any) => {
      r.read = r.privileges.includes('read');
      r.write = r.privileges.includes('write');
      r.admin = r.privileges.includes('admin');
      return r;
    }) ?? [];
    initialLoadDone.value = true;
  }
};

const startNewRole = () => {
  newRole.value = {
    id: '',
    name: 'Unbenannt',
    read: false,
    write: false,
    admin: false,
  };
};

const cancelNewRole = () => {
  newRole.value = undefined;
};

const insertRole = async (role: SimplifiedRole) => {
  const payload = simplifiedToRole(role);

  let result = await req('/api/roles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload),
  });

  if (result.ok) {
    await fetchRoles();
    emit('update-roles');
    toast('Rolle erfolgreich erstellt', ToastColor.Success);

    newRole.value = undefined;
  }
};

const updateRole = async (role: SimplifiedRole) => {
  const payload = simplifiedToRole(role);

  let result = await req('/api/roles', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload),
  });

  if (result.ok) {
    await fetchRoles();
    emit('update-roles');
    toast('Rolle erfolgreich gespeichert', ToastColor.Success);
    selectedRole.value = '';
  }
};

const deleteRole = async (role: SimplifiedRole) => {
  let result = await req('/api/roles', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({id: role.id}),
  });

  if (result.ok) {
    await fetchRoles();
    emit('update-roles');
    toast('Rolle erfolgreich gelöscht', ToastColor.Success);
    selectedRole.value = '';
  }
};

onMounted(() => {
  fetchRoles();
})
</script>

<template>
  <div class="card">
    <div class="row">
      <div class="col table-responsive">
        <table class="table table-hover" >
          <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Lesen</th>
            <th scope="col">Schreiben</th>
            <th scope="col">Admin</th>
          </tr>
          </thead>
          <tbody class="table-group-divider">
          <template v-if="initialLoadDone">
            <template v-for="(role, i) in roles" :key="role.id">
              <template v-if="role.id === selectedRole">
                <tr>
                  <td>
                    <div class="input-group">
                      <button class="btn btn-primary" @click="updateRole(roleCopy)"><i class="fa-solid fa-floppy-disk"></i></button>
                      <button class="btn btn-secondary" @click="selectRole('')"><i class="fa-solid fa-xmark"></i></button>
                      <button class="btn btn-danger" @click="deleteRole(role)"><i class="fa-solid fa-trash"></i></button>
                    </div>
                  </td>
                  <td>
                    <input id="categoryName" class="form-control" type="text" maxlength="128" v-model="roleCopy.name"/>
                  </td>
                  <td><input type="checkbox" class="form-check-input" v-model="roleCopy.read"/></td>
                  <td><input type="checkbox" class="form-check-input" v-model="roleCopy.write"/></td>
                  <td><input type="checkbox" class="form-check-input" v-model="roleCopy.admin"/></td>
                </tr>
              </template>
              <template v-else>
                <tr @click="selectRole(role.id)">
                  <td>{{ i + 1 }}</td>
                  <td>{{ role.name }}</td>
                  <td><input type="checkbox" class="form-check-input" :checked="role.read" disabled/></td>
                  <td><input type="checkbox" class="form-check-input" :checked="role.write" disabled/></td>
                  <td><input type="checkbox" class="form-check-input" :checked="role.admin" disabled/></td>
                </tr>
              </template>
            </template>
          </template>
          <template v-else>
            <tr>
              <td colspan="5">
                <div class="d-flex justify-content-center mt-4">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
              </td>
            </tr>
          </template>
          <template v-if="newRole">
            <tr>
              <td>
                <div class="input-group">
                  <button class="btn btn-primary" @click="insertRole(newRole)"><i class="fa-solid fa-floppy-disk"></i></button>
                  <button class="btn btn-secondary" @click="newRole = undefined"><i class="fa-solid fa-xmark"></i></button>
                </div>
              </td>
              <td>
                <input id="categoryName" class="form-control" type="text" maxlength="128" v-model="newRole.name"/>
              </td>
              <td><input type="checkbox" class="form-check-input" v-model="newRole.read"/></td>
              <td><input type="checkbox" class="form-check-input" v-model="newRole.write"/></td>
              <td><input type="checkbox" class="form-check-input" v-model="newRole.admin"/></td>
            </tr>
          </template>
          </tbody>
        </table>
      </div>
    </div>
    <div class="d-flex justify-content-center pt-2 pb-2">
      <button class="btn btn-success" @click="newRole = nullSimplifiedRole()">
        <i class="fa-solid fa-plus"></i>&nbsp;Neu
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>