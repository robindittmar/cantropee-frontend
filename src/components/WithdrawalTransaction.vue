<script setup lang="ts">
import {onMounted, ref} from "vue";
import {convertLocalDateForInput} from "@/core/convert";
import {deriveVat} from "@/core/tax-helper";
import type {Category} from "@/core/category";
import type {Transaction} from "@/core/transaction";

const props = defineProps<{
  categories: Category[],
}>();

const emit = defineEmits(['submit-withdrawal']);

const newTransaction = () => {
  return {
    value: 0,
    value19: 0,
    value7: 0,
    vat19: 0,
    vat7: 0,
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
  current.value19 = 0;
  current.value7 = 0;
  current.vat19 = 0;
  current.vat7 = 0;

  t.value = current;
};

const setValue19 = (event: Event) => {
  let current = t.value;

  current.value19 = (event.target as HTMLInputElement).valueAsNumber;
  if (current.value19 < 0) {
    current.value19 = 0;
  } else if (current.value19 > current.value) {
    current.value19 = current.value;
  }

  current.value7 = (Math.round(current.value * 100) - Math.round(current.value19 * 100)) / 100;

  let vats = deriveVat(current.value19, current.value7);
  current.vat19 = vats.vat19;
  current.vat7 = vats.vat7;

  t.value = current;
};

const setValue7 = (event: Event) => {
  let current = t.value;

  current.value7 = (event.target as HTMLInputElement).valueAsNumber;
  if (current.value7 < 0) {
    current.value7 = 0;
  } else if (current.value7 > current.value) {
    current.value7 = current.value;
  }

  current.value19 = (Math.round(current.value * 100) - Math.round(current.value7 * 100)) / 100;

  let vats = deriveVat(current.value19, current.value7);
  current.vat19 = vats.vat19;
  current.vat7 = vats.vat7;

  t.value = current;
};

const submitWithdrawal = async () => {
  const current = t.value;
  const payload = {
    effectiveTimestamp: current.effectiveTimestamp,
    category: current.selectedCategory,
    value: -(current.value * 100),
    value19: -(current.value19 * 100),
    value7: -(current.value7 * 100),
    vat19: -(current.vat19 * 100),
    vat7: -(current.vat7 * 100),
    note: current.note.length > 0 ? current.note : undefined,
  };

  const res = await req('/api/transactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    console.warn('call to /api/transactions not ok');
    console.warn(res);
  }

  t.value = newTransaction();
  emit('submit-withdrawal');
}

onMounted(() => {
  const modal = document.querySelector('#withdrawModal');
  modal?.addEventListener('shown.bs.modal', () => {
    t.value.effectiveTimestamp = new Date();

    if (t.value.selectedCategory === '') {
      t.value.selectedCategory = props.categories[0].name ?? '';
    }
  });

  t.value = newTransaction();
});
</script>

<template>
  <div class="modal fade" id="withdrawModal" tabindex="-1" aria-labelledby="withdrawModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="withdrawModalLabel">Auszahlen</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div>
            <div class="mb-3">
              <label for="withdrawGroupValue" class="form-label">Betrag</label>
              <div id="withdrawGroupValue" class="input-group mb-3">
                <span class="input-group-text" id="withdrawValueAddon">EUR</span>
                <input id="withdrawValue" class="form-control"
                       aria-describedby="withdrawValueAddon" type="number" step=".01"
                       :value="t.value"
                       @input="setValue"/>
              </div>
            </div>
            <div class="mb-3">
              <label for="withdrawGroupValue19" class="form-label">19% Anteil | 19% Steuern</label>
              <div id="withdrawGroupValue19" class="input-group mb-3">
                <span class="input-group-text" id="withdrawValue19addon">EUR</span>
                <input id="withdrawValue19" class="form-control"
                       aria-describedby="withdrawValue19addon" type="number" step=".01"
                       :value="t.value19"
                       @input="setValue19"/>
                <span class="input-group-text" id="withdrawVat19addon">EUR</span>
                <input id="withdrawVat19" class="form-control" aria-describedby="withdrawVat19addon"
                       type="text" :value="t.vat19" disabled/>
              </div>
            </div>
            <div class="mb-3">
              <label for="withdrawGroupValue7" class="form-label">7% Anteil | 7% Steuern</label>
              <div id="withdrawGroupValue7" class="input-group mb-3">
                <span class="input-group-text" id="withdrawValue7addon">EUR</span>
                <input id="withdrawValue7" class="form-control"
                       aria-describedby="withdrawValue7addon" type="number" step=".01"
                       :value="t.value7"
                       @input="setValue7"/>
                <span class="input-group-text" id="withdrawVat7addon">EUR</span>
                <input id="withdrawVat7" class="form-control" aria-describedby="withdrawVat7addon"
                       type="text" :value="t.vat7" disabled/>
              </div>
            </div>
            <div class="mb-3">
              <label for="withdrawCategory" class="form-label">Kategorie</label>
              <select id="withdrawCategory" class="form-select" v-model="t.selectedCategory">
                <option v-for="category in categories" :key="category.id" :value="category.name">
                  {{ category.name }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label for="withdrawNote" class="form-label">Notiz</label>
              <input id="withdrawNote" class="form-control" type="text" maxlength="128" v-model="t.note"/>
            </div>
            <div class="mb-3">
              <label for="withdrawDateTime" class="form-label">Buchungsdatum</label>
              <input id="withdrawDateTime" class="form-control" type="datetime-local"
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
          <button type="button" class="btn btn-primary" :disabled="t.value <= 0" @click="submitWithdrawal">
            Buchen
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>