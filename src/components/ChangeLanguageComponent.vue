<script setup lang="ts">
import {availableLangCodes} from "@/core/languages";

const props = defineProps<{
  langCode: string;
}>();
const emit = defineEmits(['set-language']);
</script>

<template>
  <div class="button-group me-2 text-center">
    <button class="btn btn-outline-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
      {{ langCode.substring(0, 2).toUpperCase() }}
    </button>
    <ul class="dropdown-menu">
      <li v-for="language in availableLangCodes" :key="language">
        <a class="dropdown-item" @click="$emit('set-language', language)">{{ language.substring(0, 2).toUpperCase() }}</a>
      </li>
    </ul>
  </div>
</template>

<style scoped>

</style>