<script setup lang="ts">
import {onMounted, ref} from "vue";
import {convertLocalDateForInput} from "@/convert";
import type {Category} from "@/category";

const props = defineProps<{
  categories: Category[],
}>();

const emit = defineEmits(['submit-deposit']);

const newTransaction = () => {
  return {
    value: 0,
    selectedCategory: props.categories[0]?.name ?? '',
    note: '',
    effectiveTimestamp: new Date(),
  };
}

const t = ref(newTransaction());

const setValue = (event: Event) => {
  let current = t.value;

  current.value = (event.target as HTMLInputElement).valueAsNumber;
  if (current.value < 0) {
    current.value = 0;
  }

  t.value = current;
};

const submitDeposit = async () => {
  const current = t.value;
  const payload = {
    effectiveTimestamp: current.effectiveTimestamp,
    category: current.selectedCategory,
    value: Math.round(current.value * 100),
    value19: 0,
    value7: 0,
    vat19: 0,
    vat7: 0,
    note: current.note.length > 0 ? current.note : undefined,
  };

  const res = await fetch('/api/transactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload),
  });

  t.value = newTransaction();
  emit('submit-deposit');
}

onMounted(() => {
  const modal = document.querySelector('#depositModal');
  modal?.addEventListener('shown.bs.modal', () => {
    t.value.effectiveTimestamp = new Date();

    if (t.value.selectedCategory === '') {
      t.value.selectedCategory = props.categories[0].name ?? '';
    }
  });
});
</script>

<template>
  <div class="modal fade" id="depositModal" tabindex="-1" aria-labelledby="depositModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="depositModalLabel">Einzahlen</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div>
            <div class="mb-3">
              <label for="depositGroupValue" class="form-label">Betrag</label>
              <div id="depositGroupValue" class="input-group mb-3">
                <span class="input-group-text" id="depositValueAddon">EUR</span>
                <input id="depositValue" class="form-control"
                       aria-describedby="depositValueAddon" type="number" step=".01"
                       :value="t.value"
                       @input="setValue"/>
              </div>
            </div>
            <div class="mb-3">
              <label for="depositCategory" class="form-label">Kategorie</label>
              <select id="depositCategory" class="form-select" v-model="t.selectedCategory">
                <option v-for="category in categories" :key="category.id" :value="category.name"
                        :selected="category.id === 1">
                  {{ category.name }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label for="depositNote" class="form-label">Notiz</label>
              <input id="depositNote" class="form-control" type="text" maxlength="128" v-model="t.note"/>
            </div>
            <div class="mb-3">
              <label for="depositDateTime" class="form-label">Buchungsdatum</label>
              <input id="depositDateTime" class="form-control" type="datetime-local"
                     :value="t.effectiveTimestamp && convertLocalDateForInput(t.effectiveTimestamp)"
                     @input="t.effectiveTimestamp = new Date(($event.target as HTMLInputElement)?.value)"/>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="t = newTransaction()"
                  data-bs-dismiss="modal">
            Abbrechen
          </button>
          <button type="button" class="btn btn-primary" :disabled="t.value <= 0" @click="submitDeposit">
            Buchen
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>