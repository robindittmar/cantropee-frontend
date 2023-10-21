<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {convertLocalDateForInput} from "@/convert";
import {Currencies, Money} from "ts-money";

const props = defineProps<{
  categories: {
    id: number;
    name: string;
  }[],
}>();

const emit = defineEmits(['submit-withdrawal']);

// const v19 = new Money(value19.value, Currencies.EUR);
// return (v19.divide(119).multiply(19).amount) / 100;

// const v7 = new Money(value7.value, Currencies.EUR);
// return (v7.divide(117).multiply(7).amount) / 100;

const value = ref(0);
const value19 = ref(0);
const value7 = ref(0);
const vat19 = ref(0);
const vat7 = ref(0);
const selectedCategory = ref('');
const effectiveTimestamp = ref(new Date());

const resetValues = () => {
  value.value = 0;
  value19.value = 0;
  value7.value = 0;
  vat19.value = 0;
  vat7.value = 0;
  selectedCategory.value = props.categories[0].name ?? '';
  effectiveTimestamp.value = new Date();
}

const deriveVat = () => {
  vat19.value = new Money(value19.value * 100, Currencies.EUR).divide(119).multiply(19).amount / 100;
  vat7.value = new Money(value7.value * 100, Currencies.EUR).divide(107).multiply(7).amount / 100;
}

const setValue19 = (event: Event) => {
  value19.value = (event.target as HTMLInputElement).valueAsNumber;
  value7.value = new Money(value.value * 100, Currencies.EUR)
      .subtract(new Money(value19.value * 100, Currencies.EUR))
      .amount / 100;

  deriveVat();
};

const setValue7 = (event: Event) => {
  value7.value = (event.target as HTMLInputElement).valueAsNumber;
  value19.value = new Money(value.value * 100, Currencies.EUR)
      .subtract(new Money(value7.value * 100, Currencies.EUR))
      .amount / 100;

  deriveVat();
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
  };

  const res = await fetch('/api/transactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload),
  });

  // await this.fetchBalance();
  // await this.fetchTransactions();

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
              <label for="withdraw-group-value" class="form-label">Betrag</label>
              <div id="withdraw-group-value" class="input-group mb-3">
                <span class="input-group-text" id="depositValueAddon">EUR</span>
                <input id="withdrawValue" class="form-control"
                       aria-describedby="withdrawValueAddon" type="number" step=".01"
                       v-model="value"/>
              </div>
            </div>
            <div class="mb-3">
              <label for="withdraw-group-value19" class="form-label">19% Anteil | 19% Steuern</label>
              <div id="withdraw-group-value19" class="input-group mb-3">
                <span class="input-group-text" id="withdrawValue19addon">EUR</span>
                <input id="withdrawValue19" class="form-control"
                       aria-describedby="withdrawValue19addon" type="number" step=".01"
                       :value="value19"
                       @input="setValue19"/>
                <span class="input-group-text" id="withdrawVat19addon">EUR</span>
                <input id="withdrawVat19" class="form-control" aria-describedby="withdrawVat19addon"
                       type="text" step=".01" disabled
                       :value="vat19"/>
              </div>
            </div>
            <div class="mb-3">
              <label for="withdraw-group-value7" class="form-label">7% Anteil | 7% Steuern</label>
              <div id="withdraw-group-value7" class="input-group mb-3">
                <span class="input-group-text" id="withdrawValue7addon">EUR</span>
                <input id="withdrawValue7" class="form-control"
                       aria-describedby="withdrawValue7addon" type="number" step=".01"
                       :value="value7"
                       @input="setValue7"/>
                <span class="input-group-text" id="withdrawVat7addon">EUR</span>
                <input id="withdrawVat7" class="form-control" aria-describedby="withdrawVat7addon"
                       type="text" step=".01" disabled
                       :value="vat7"/>
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
          <button type="button" class="btn btn-primary" @click="submitWithdrawal">
            Buchen
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>