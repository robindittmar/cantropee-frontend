<script setup lang="ts">
import type {Ref} from "vue";
import {ref} from "vue";
import type {Category} from "@/core/category";
import {req} from "@/core/requests";
import {toast, ToastColor} from "@/core/toaster";

const props = defineProps<{
  categories: Category[];
}>();
const emit = defineEmits(['update-categories']);

const selectedCategory: Ref<number> = ref(0);
const categoryCopy: Ref<Category> = ref({id: 0, name: ''});
const newCategory: Ref<Category | undefined> = ref(undefined);

const inserting = ref(false);
const updating = ref(false);
const deleting = ref(false);

const selectCategory = (categoryId: number) => {
  categoryCopy.value = {...props.categories.find(c => c.id === categoryId) ?? {id: 0, name: ''}};
  selectedCategory.value = categoryId;
};

const startNewCategory = () => {
  newCategory.value = {
    id: 0,
    name: 'Unbenannt',
  };
};

const cancelNewCategory = () => {
  newCategory.value = undefined;
};

const insertCategory = async (category: Category) => {
  inserting.value = true;

  let result = await req('/api/categories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({name: category.name}),
  });

  inserting.value = false;

  if (result.ok) {
    emit('update-categories');
    toast('Kategorie erfolgreich erstellt', ToastColor.Success);

    newCategory.value = undefined;
  }
};

const updateCategory = async (category: Category) => {
  updating.value = true;

  let result = await req('/api/categories', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(category),
  });

  updating.value = false;

  if (result.ok) {
    emit('update-categories');
    toast('Kategorie erfolgreich gespeichert', ToastColor.Success);
    selectedCategory.value = 0;
  }
};

const deleteCategory = async (category: Category) => {
  deleting.value = true;

  let result = await req('/api/categories', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({id: category.id}),
  });

  deleting.value = false;

  if (result.ok) {
    emit('update-categories');
    toast('Kategorie erfolgreich gelöscht', ToastColor.Success);
    selectedCategory.value = 0;
  }
};
</script>

<template>
  <div class="card">
    <div class="row">
      <div class="col table-responsive">
        <table class="table table-hover" >
          <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Kategorie</th>
          </tr>
          </thead>
          <tbody class="table-group-divider">
          <template v-for="(category, i) in categories" :key="category.id">
            <template v-if="category.id === selectedCategory">
              <tr>
                <td>{{ i + 1 }}</td>
                <td>
                  <div class="input-group">
                    <input id="categoryName" class="form-control" type="text" maxlength="128" v-model="categoryCopy.name"/>
                    <button class="btn btn-primary" @click="updateCategory(categoryCopy)" :disabled="updating"><i class="fa-solid fa-floppy-disk"></i></button>
                    <button class="btn btn-secondary" @click="selectCategory(0)"><i class="fa-solid fa-xmark"></i></button>
                    <button class="btn btn-danger" @click="deleteCategory(categoryCopy)" :disabled="deleting"><i class="fa-solid fa-trash"></i></button>
                  </div>
                </td>
              </tr>
            </template>
            <template v-else>
              <tr @click="selectCategory(category.id)">
                <td>{{ i + 1 }}</td>
                <td>{{ category.name }}</td>
              </tr>
            </template>
          </template>
          <template v-if="newCategory">
            <tr>
              <td></td>
              <td>
                <div class="input-group">
                  <input id="newCategoryName" class="form-control" type="text" maxlength="128" v-model="newCategory.name"/>
                  <button class="btn btn-primary" @click="insertCategory(newCategory)" :disabled="inserting"><i class="fa-solid fa-floppy-disk"></i></button>
                  <button class="btn btn-secondary" @click="cancelNewCategory"><i class="fa-solid fa-xmark"></i></button>
                </div>
              </td>
            </tr>
          </template>
          </tbody>
        </table>
      </div>
    </div>
    <div class="d-flex justify-content-center pt-2 pb-2">
      <button class="btn btn-success" @click="startNewCategory">
        <i class="fa-solid fa-plus"></i>&nbsp;Neu
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>