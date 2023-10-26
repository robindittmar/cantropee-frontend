<script setup lang="ts">
import {computed} from "vue";

const props = defineProps<{
  effectiveSpan: {
    from: Date,
    to: Date,
  },
  showPending: boolean,
  displayValues: boolean,
  sortingOrder: string,
}>();

defineEmits(['next-month', 'prev-month', 'toggle-show-pending', 'toggle-sorting-order'])

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
  <div class="input-group mb-3">
    <button class="btn btn-secondary" @click="$emit('prev-month')">
      <i class="fa-solid fa-arrow-left"></i>
    </button>
    <input id="currentMonthString" class="form-control text-center" :value="yearMonthString" type="text" disabled />
    <button class="btn btn-secondary" @click="$emit('next-month')">
      <i class="fa-solid fa-arrow-right"></i>
    </button>
    <button class="btn btn-secondary ms-3" @click="$emit('toggle-sorting-order')">
      <i v-if="sortingOrder === 'asc'" class="fa-solid fa-arrow-up"></i>
      <i v-else class="fa-solid fa-arrow-down"></i>
    </button>
    <div class="ps-3">
      <input id="showPendingCheckbox" class="btn-check" type="checkbox" :checked="showPending" @click="$emit('toggle-show-pending')" :disabled="!previewAvailable"/>
      <label for="showPendingCheckbox" class="btn w-100" :class="{'btn-outline-primary': previewAvailable}">Vorschau</label>
    </div>
  </div>
</template>

<style scoped>

</style>