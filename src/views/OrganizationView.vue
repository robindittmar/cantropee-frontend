<script setup lang="ts">
import type {User} from "@/core/user";
import type {Category} from "@/core/category";
import OrganizationComponent from "@/components/OrganizationComponent.vue";

const props = defineProps<{
  user: User;
  categories: Category[];
}>();

const emit = defineEmits(['change-organization']);

</script>

<template>
  <div class="container">
    <div class="row mt-2">
      <div class="col">
        <OrganizationComponent :categories="categories" :user="user"
                               @change-organization="$emit('change-organization')"/>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>