<script setup lang="ts">
import {computed, ref, watch} from "vue";
import type {Category} from "@/core/category";
import {lang, langCode} from "@/core/languages";

const props = defineProps<{
  effectiveSpan: {
    from: Date,
    to: Date,
  },
  showPending: boolean,
  sortingOrder: string,
  categories: Category[],
  showMonthPicker: boolean,
}>();

const emit = defineEmits([
  'next-month',
  'prev-month',
  'toggle-show-pending',
  'toggle-sorting-order',
  'set-category',
  'set-notes',
]);

let selectedCategory = ref(0);
watch(selectedCategory, () => {
  emit('set-category', selectedCategory.value);
});

const notesFilter = ref('');
watch(notesFilter, () => {
  emit('set-notes', notesFilter.value);
});

const yearMonthString = computed(() => {
  return props.effectiveSpan.from.toLocaleString(langCode.value, {
    month: 'short',
    year: 'numeric',
  });
});

const previewAvailable = computed(() => {
  return props.effectiveSpan.to > new Date();
});
</script>

<template>
  <div class="row">
    <div class="col">
      <div class="input-group">
        <div class="form-floating">
          <input id="notesFilter" class="form-control" type="text" v-model="notesFilter"/>
          <label for="notesFilter" class="form-label">{{ lang.search }}</label>
        </div>
        <button class="btn btn-primary" data-bs-toggle="collapse" data-bs-target="#transactionsFilterCollapse">
          <i class="fa-solid fa-filter"></i>
        </button>
      </div>
    </div>
  </div>
  <div class="row mt-3">
    <div class="col">
      <div class="collapse mb-3" id="transactionsFilterCollapse" aria-hidden="true">
        <div class="form-floating">
          <select id="transactionsCategory" class="form-select" v-model="selectedCategory">
            <option :value="0" selected>{{ lang.all }}</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
          <label for="transactionsCategory" class="form-label">{{ lang.category }}</label>
        </div>
        <div class="mt-3">
          <input id="showPendingCheckbox" class="btn-check" type="checkbox" :checked="showPending" @click="$emit('toggle-show-pending')" :disabled="!previewAvailable"/>
          <label for="showPendingCheckbox" class="btn w-100" :class="{'btn-outline-primary': previewAvailable}">{{ lang.preview }}</label>
        </div>
        <div class="mt-3">
          <button id="sortingOrd" class="btn btn-secondary w-100" @click="$emit('toggle-sorting-order')">
            <template v-if="sortingOrder === 'asc'">
              <i class="fa-solid fa-arrow-up"></i>&nbsp;{{ lang.ascending }}
            </template>
            <template v-else>
              <i class="fa-solid fa-arrow-down"></i>&nbsp;{{ lang.descending }}
            </template>
          </button>
        </div>
        <div v-if="showMonthPicker" class="input-group mt-3">
          <button class="btn btn-secondary" @click="$emit('prev-month')">
            <i class="fa-solid fa-arrow-left"></i>
          </button>
          <input id="currentMonthString" class="form-control text-center" :value="yearMonthString" type="text" disabled />
          <button class="btn btn-secondary" @click="$emit('next-month')">
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>