<script setup lang="ts">
import {onMounted, ref} from "vue";
import {convertLocalDateForInput} from "@/convert";

const props = defineProps<{
  categories: {
    id: number;
    name: string;
  }[],
}>();

const emit = defineEmits(['submit-deposit']);

const value = ref(0);
const selectedCategory = ref('');
const note = ref('');
const effectiveTimestamp = ref(new Date());

const resetValues = () => {
  value.value = 0;
  selectedCategory.value = props.categories[0].name ?? '';
  note.value = '';
  effectiveTimestamp.value = new Date();
}

const submitDeposit = async () => {
  const payload = {
    effectiveTimestamp: effectiveTimestamp.value,
    category: selectedCategory.value,
    value: value.value * 100,
    value19: 0,
    value7: 0,
    vat19: 0,
    vat7: 0,
    note: note.value.length > 0 ? note.value : undefined,
  };

  const res = await fetch('/api/transactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload),
  });

  resetValues();
  emit('submit-deposit');
}

onMounted(() => {
  const modal = document.querySelector('#depositModal');
  modal?.addEventListener('shown.bs.modal', () => {
    effectiveTimestamp.value = new Date();

    if (selectedCategory.value === '') {
      selectedCategory.value = props.categories[0].name ?? '';
    }
  });

  resetValues();
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
                       v-model="value"/>
              </div>
            </div>
            <div class="mb-3">
              <label for="depositCategory" class="form-label">Kategorie</label>
              <select id="depositCategory" class="form-select" v-model="selectedCategory">
                <option v-for="category in categories" :key="category.id" :value="category.name"
                        :selected="category.id === 1">
                  {{ category.name }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label for="depositNote" class="form-label">Notiz</label>
              <input id="depositNote" class="form-control" type="text" maxlength="128" v-model="note"/>
            </div>
            <div class="mb-3">
              <label for="depositDateTime" class="form-label">Buchungsdatum</label>
              <input id="depositDateTime" class="form-control" type="datetime-local"
                     :value="effectiveTimestamp && convertLocalDateForInput(effectiveTimestamp)"
                     @input="effectiveTimestamp = new Date(($event.target as HTMLInputElement)?.value)"/>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="resetValues"
                  data-bs-dismiss="modal">
            Abbrechen
          </button>
          <button type="button" class="btn btn-primary" :disabled="value <= 0" @click="submitDeposit">
            Buchen
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>