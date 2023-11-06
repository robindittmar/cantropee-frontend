<script setup lang="ts">
import type {Ref} from "vue";
import {onMounted, ref} from "vue";
import type {Role} from "@/core/role";
import {req} from "@/core/requests";

const roles: Ref<Role[]> = ref([]);
const selectedRole = ref('');

const selectRole = (roleId: string) => {
  selectedRole.value = roleId;
}

const fetchRoles = async () => {
  const result = await req('/api/roles');
  if (result.ok) {
    roles.value = (await result.json()).roles ?? [];
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
          <template v-for="(role, i) in roles" :key="role.id">
            <template v-if="role.id === selectedRole">
              <tr>
                <td>
                  <div class="input-group">
                    <button class="btn btn-primary" disabled><i class="fa-solid fa-floppy-disk"></i></button>
                    <button class="btn btn-secondary" @click="selectRole('')"><i class="fa-solid fa-xmark"></i></button>
                    <button class="btn btn-danger" disabled><i class="fa-solid fa-trash"></i></button>
                  </div>
                </td>
                <td>
                  <input id="categoryName" class="form-control" type="text" maxlength="128" :value="role.name"/>
                </td>
                <td><input type="checkbox" class="form-check-input" :checked="role.privileges.includes('read')"/></td>
                <td><input type="checkbox" class="form-check-input" :checked="role.privileges.includes('write')"/></td>
                <td><input type="checkbox" class="form-check-input" :checked="role.privileges.includes('admin')"/></td>
              </tr>
            </template>
            <template v-else>
              <tr @click="selectRole(role.id)">
                <td>{{ i + 1 }}</td>
                <td>{{ role.name }}</td>
                <td><input type="checkbox" class="form-check-input" :checked="role.privileges.includes('read')" disabled/></td>
                <td><input type="checkbox" class="form-check-input" :checked="role.privileges.includes('write')" disabled/></td>
                <td><input type="checkbox" class="form-check-input" :checked="role.privileges.includes('admin')" disabled/></td>
              </tr>
            </template>
          </template>
<!--          <template v-if="newCategory">-->
<!--            <tr>-->
<!--              <td></td>-->
<!--              <td>-->
<!--                <div class="input-group">-->
<!--                  <input id="newCategoryName" class="form-control" type="text" maxlength="128" v-model="newCategory.name"/>-->
<!--                  <button class="btn btn-primary" @click="insertCategory(newCategory)"><i class="fa-solid fa-floppy-disk"></i></button>-->
<!--                  <button class="btn btn-secondary" @click="cancelNewCategory"><i class="fa-solid fa-xmark"></i></button>-->
<!--                </div>-->
<!--              </td>-->
<!--            </tr>-->
<!--          </template>-->
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