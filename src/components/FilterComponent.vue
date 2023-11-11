<script setup lang="ts">
import {computed, ref, watch} from "vue";
import type {Category} from "@/core/category";

const props = defineProps<{
  effectiveSpan: {
    from: Date,
    to: Date,
  },
  showPending: boolean,
  sortingOrder: string,
  categories: Category[],
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

const yearMonthString = computed(() => {
  return props.effectiveSpan.from.toLocaleString('de-DE', {
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
        <button class="btn btn-secondary" @click="$emit('prev-month')">
          <i class="fa-solid fa-arrow-left"></i>
        </button>
        <input id="currentMonthString" class="form-control text-center" :value="yearMonthString" type="text" disabled />
        <button class="btn btn-secondary" @click="$emit('next-month')">
          <i class="fa-solid fa-arrow-right"></i>
        </button>
        <div class="ps-3">
          <button class="btn btn-primary" data-bs-toggle="collapse" data-bs-target="#transactionsFilterCollapse">
            <i class="fa-solid fa-filter"></i>
          </button>
        </div>
        <div class="ps-3">
          <input id="showPendingCheckbox" class="btn-check" type="checkbox" :checked="showPending" @click="$emit('toggle-show-pending')" :disabled="!previewAvailable"/>
          <label for="showPendingCheckbox" class="btn w-100" :class="{'btn-outline-primary': previewAvailable}">Vorschau</label>
        </div>
      </div>
    </div>
  </div>
  <div class="row mt-1">
    <div class="col">
      <div class="collapse" id="transactionsFilterCollapse" aria-hidden="true">
        <div class="mt-1">
          <label for="sortingOrd" class="form-label me-3">Sortierung</label>
          <button id="sortingOrd" class="btn btn-secondary" @click="$emit('toggle-sorting-order')">
            <template v-if="sortingOrder === 'asc'">
              <i class="fa-solid fa-arrow-up"></i>&nbsp;Aufsteigend
            </template>
            <template v-else>
              <i class="fa-solid fa-arrow-down"></i>&nbsp;Absteigend
            </template>
          </button>
        </div>
        <div class="form-floating mt-3">
          <select id="transactionsCategory" class="form-select" v-model="selectedCategory">
            <option :value="0" selected>Alle</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
          <label for="transactionsCategory" class="form-label">Kategorie</label>
        </div>
        <div class="input-group mt-3">
          <div class="form-floating">
            <input id="notesFilter" class="form-control" type="text" v-model="notesFilter"/>
            <label for="notesFilter" class="form-label">Notiz</label>
          </div>
          <button class="btn btn-secondary w-25" @click="$emit('set-notes', notesFilter)"><i class="fa-solid fa-magnifying-glass"></i></button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>