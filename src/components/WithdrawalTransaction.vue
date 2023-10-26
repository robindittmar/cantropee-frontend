<script setup lang="ts">
import {onMounted, ref} from "vue";
import {convertLocalDateForInput} from "@/convert";
import {Currencies, Money} from "ts-money";
import {deriveVat} from "@/tax-helper";

const props = defineProps<{
  categories: {
    id: number;
    name: string;
  }[],
}>();

const emit = defineEmits(['submit-withdrawal']);

const value = ref(0);
const value19 = ref(0);
const value7 = ref(0);
const vat19 = ref(0);
const vat7 = ref(0);
const selectedCategory = ref('');
const note = ref('');
const effectiveTimestamp = ref(new Date());

const resetValues = () => {
  value.value = 0;
  value19.value = 0;
  value7.value = 0;
  vat19.value = 0;
  vat7.value = 0;
  selectedCategory.value = props.categories[0].name ?? '';
  note.value = '';
  effectiveTimestamp.value = new Date();
}

const setVat = () => {
  const vats = deriveVat(value19.value, value7.value);
  vat19.value = vats.vat19;
  vat7.value = vats.vat7;
}

const setValue19 = (event: Event) => {
  value19.value = (event.target as HTMLInputElement).valueAsNumber;
  value7.value = new Money(Math.round(value.value * 100), Currencies.EUR)
      .subtract(new Money(Math.round(value19.value * 100), Currencies.EUR))
      .amount / 100;

  setVat();
};

const setValue7 = (event: Event) => {
  value7.value = (event.target as HTMLInputElement).valueAsNumber;
  value19.value = new Money(Math.round(value.value * 100), Currencies.EUR)
      .subtract(new Money(Math.round(value7.value * 100), Currencies.EUR))
      .amount / 100;

  setVat();
};

const submitWithdrawal = async () => {
  const payload = {
    effectiveTimestamp: effectiveTimestamp.value,
    category: selectedCategory.value,
    value: -(value.value * 100),
    value19: -(value19.value * 100),
    value7: -(value7.value * 100),
    vat19: -(vat19.value * 100),
    vat7: -(vat7.value * 100),
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
  emit('submit-withdrawal');
}

onMounted(() => {
  const modal = document.querySelector('#withdrawModal');
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
                       v-model="value"/>
              </div>
            </div>
            <div class="mb-3">
              <label for="withdrawGroupValue19" class="form-label">19% Anteil | 19% Steuern</label>
              <div id="withdrawGroupValue19" class="input-group mb-3">
                <span class="input-group-text" id="withdrawValue19addon">EUR</span>
                <input id="withdrawValue19" class="form-control"
                       aria-describedby="withdrawValue19addon" type="number" step=".01"
                       :value="value19"
                       @input="setValue19"/>
                <span class="input-group-text" id="withdrawVat19addon">EUR</span>
                <input id="withdrawVat19" class="form-control" aria-describedby="withdrawVat19addon"
                       type="text" :value="vat19" disabled/>
              </div>
            </div>
            <div class="mb-3">
              <label for="withdrawGroupValue7" class="form-label">7% Anteil | 7% Steuern</label>
              <div id="withdrawGroupValue7" class="input-group mb-3">
                <span class="input-group-text" id="withdrawValue7addon">EUR</span>
                <input id="withdrawValue7" class="form-control"
                       aria-describedby="withdrawValue7addon" type="number" step=".01"
                       :value="value7"
                       @input="setValue7"/>
                <span class="input-group-text" id="withdrawVat7addon">EUR</span>
                <input id="withdrawVat7" class="form-control" aria-describedby="withdrawVat7addon"
                       type="text" :value="vat7" disabled/>
              </div>
            </div>
            <div class="mb-3">
              <label for="withdrawCategory" class="form-label">Kategorie</label>
              <select id="withdrawCategory" class="form-select" v-model="selectedCategory">
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
              <label for="withdrawDateTime" class="form-label">Buchungsdatum</label>
              <input id="withdrawDateTime" class="form-control" type="datetime-local"
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
          <button type="button" class="btn btn-primary" :disabled="value <= 0" @click="submitWithdrawal">
            Buchen
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>