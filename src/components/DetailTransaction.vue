<script setup lang="ts">
import {convertLocalDateForInput, valueToString} from "@/core/convert";
import type {Transaction, TransactionDiff} from "@/core/transaction";
import type {Ref} from "vue";
import {onBeforeUnmount, onMounted, ref} from "vue";
import {Collapse} from "bootstrap";
import {deriveVat} from "@/core/tax-helper";
import type {Category} from "@/core/category";
import DiffTransactions from "@/components/DiffTransactions.vue";
import {req} from "@/core/requests";

const props = defineProps<{
  transaction: Transaction,
  categories: Category[],
  currency: string,
  displayValues: boolean,
  showTaxes: boolean,
}>();

const emit = defineEmits(['updated-transaction']);

const copyTransaction = () => {
  return {
    id: props.transaction.id,
    refId: props.transaction.refId,
    category: props.transaction.category,
    insertTimestamp: props.transaction.insertTimestamp,
    effectiveTimestamp: props.transaction.effectiveTimestamp,
    value: Math.abs(props.transaction.value / 100),
    value19: Math.abs(props.transaction.value19 / 100),
    value7: Math.abs(props.transaction.value7 / 100),
    vat19: Math.abs(props.transaction.vat19 / 100),
    vat7: Math.abs(props.transaction.vat7 / 100),
    note: props.transaction.note,
  };
};

let isDeposit = ref(props.transaction.value >= 0);
let editing = ref(false);
const selectedCategory = ref('');
let transactionCopy = ref(copyTransaction());
let history: Ref<TransactionDiff[] | undefined> = ref(undefined);

const setValue = (event: Event) => {
  let current = transactionCopy.value;

  current.value = (event.target as HTMLInputElement).valueAsNumber;
  if (current.value < 0) {
    current.value = 0;
  }
  current.value19 = 0;
  current.value7 = 0;
  current.vat19 = 0;
  current.vat7 = 0;

  transactionCopy.value = current;
}

const setValue19 = (event: Event) => {
  let current = transactionCopy.value;

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

  transactionCopy.value = current;
};

const setValue7 = (event: Event) => {
  let current = transactionCopy.value;

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

  transactionCopy.value = current;
};

const editTransaction = async (edit: boolean) => {
  editing.value = edit;

  if (edit) {
    selectedCategory.value = props.transaction.category;
  } else {
    transactionCopy.value = copyTransaction();
  }
};

const submitTransaction = async() => {
  let edited = {...transactionCopy.value};

  edited.value *= 100;
  edited.value19 *= 100;
  edited.value7 *= 100;
  edited.vat19 *= 100;
  edited.vat7 *= 100;
  edited.category = selectedCategory.value;
  if (isDeposit.value) {
    edited.value19 = 0;
    edited.value7 = 0;
    edited.vat19 = 0;
    edited.vat7 = 0;
  } else {
    edited.value = -edited.value;
    edited.value19 = -edited.value19;
    edited.value7 = -edited.value7;
    edited.vat19 = -edited.vat19;
    edited.vat7 = -edited.vat7;
  }

  const res = await req('/api/transactions', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(edited),
  });

  let newId = await res.json();
  emit('updated-transaction', newId.id);
};

const fetchHistory = async () => {
  const result = await req(`/api/transactions/${props.transaction.id}/history`);

  history.value = (await result.json()).map((t: TransactionDiff) => {
    t.insertTimestamp = new Date(t.insertTimestamp);
    if (t.effectiveTimestamp) {
      t.effectiveTimestamp = new Date(t.effectiveTimestamp);
    }

    return t;
  });
};

onMounted(() => {
  const collapse = Collapse.getOrCreateInstance(`#detailCollapse-${props.transaction.id}`);
  collapse.show();
});

onBeforeUnmount(() => {
  const collapse = Collapse.getOrCreateInstance(`#detailCollapse-${props.transaction.id}`);
  collapse.hide();
});
</script>

<template>
  <div class="collapse" :id="'detailCollapse-' + transaction.id" tabindex="-1" aria-hidden="true">
    <div class="m-3">
      <div class="row">
        <div class="col">
          <div class="mb-3">
            <button v-if="isDeposit" @click="isDeposit = false"
                    class="btn w-100"
                    :class="{'btn-outline-success': !editing, 'btn-success': editing}"
                    :disabled="!editing">
              Einzahlung
            </button>
            <button v-else @click="isDeposit = true"
                    class="btn w-100"
                    :class="{'btn-outline-danger': !editing, 'btn-danger': editing}"
                    :disabled="!editing">
              Auszahlung
            </button>
          </div>
          <div class="mb-3">
            <div id="detailGroupId" class="input-group mb-3">
              <span class="input-group-text" id="detailIdAddon">ID</span>
              <input id="detailId" class="form-control"
                     aria-describedby="detailIdAddon" type="text" :value="transaction.id"
                     disabled/>
            </div>
          </div>
          <div class="mb-3">
            <label for="detailGroupValue" class="form-label">Betrag</label>
            <div id="detailGroupValue" class="input-group mb-3">
              <span class="input-group-text" id="detailValueAddon">EUR</span>
              <input v-if="!editing" id="detailValue" class="form-control"
                     aria-describedby="detailValueAddon" type="text" :value="displayValues ? valueToString(Math.abs(transaction.value)) : '***'"
                     disabled/>
              <input v-else id="detailValue" class="form-control"
                     aria-describedby="detailValueAddon" type="number" step=".01"
                     :value="transactionCopy.value"
                     @input="setValue"/>
            </div>
          </div>
          <template v-if="!isDeposit && showTaxes">
            <div class="mb-3">
              <label for="detailGroupValue19" class="form-label">19% Anteil | 19% Steuern</label>
              <div id="detailGroupValue19" class="input-group mb-3">
                <span class="input-group-text" id="detailValue19addon">EUR</span>
                <input v-if="!editing" id="detailValue19" class="form-control"
                       aria-describedby="detailValue19addon" type="text"
                       :value="displayValues ? valueToString(Math.abs(transaction.value19)) : '***'"
                       disabled/>
                <input v-else id="detailValue19" class="form-control"
                       aria-describedby="detailValue19addon" type="number" step=".01"
                       :value="transactionCopy.value19"
                       @input="setValue19"/>
                <span class="input-group-text" id="detailVat19addon">EUR</span>
                <input v-if="!editing" id="detailVat19" class="form-control" aria-describedby="detailVat19addon"
                       :value="displayValues ? valueToString(Math.abs(transaction.vat19)) : '***'"
                       disabled/>
                <input v-else id="detailVat19" class="form-control" aria-describedby="detailVat19addon"
                       type="number" step=".01"
                       v-model="transactionCopy.vat19"
                       disabled/>
              </div>
            </div>
            <div class="mb-3">
              <label for="detailGroupValue7" class="form-label">7% Anteil | 7% Steuern</label>
              <div id="detailGroupValue7" class="input-group mb-3">
                <span class="input-group-text" id="detailValue7addon">EUR</span>
                <input v-if="!editing" id="detailValue7" class="form-control"
                       aria-describedby="detailValue7addon" type="text"
                       :value="displayValues ? valueToString(Math.abs(transaction.value7)) : '***'"
                       disabled/>
                <input v-else id="detailValue7" class="form-control"
                       aria-describedby="detailValue7addon" type="number" step=".01"
                       :value="transactionCopy.value7"
                       @input="setValue7"/>
                <span class="input-group-text" id="detailVat7addon">EUR</span>
                <input v-if="!editing" id="detailVat7" class="form-control" aria-describedby="detailVat7addon"
                       type="text" :value="displayValues ? valueToString(Math.abs(transaction.vat7)) : '***'"
                       disabled/>
                <input v-else id="detailVat7" class="form-control" aria-describedby="detailVat7addon"
                       type="number" step=".01"
                       v-model="transactionCopy.vat7"
                       disabled>
              </div>
            </div>
          </template>
          <div class="mb-3">
            <label for="detailCategory" class="form-label">Kategorie</label>
            <input v-if="!editing" id="detailCategory" class="form-control" type="text"
                   :value="transaction.category" disabled/>
            <select v-else id="withdrawCategory" class="form-select" v-model="selectedCategory">
              <option v-for="category in categories" :key="category.id" :value="category.name"
                      :selected="category.id === 1">
                {{ category.name }}
              </option>
            </select>
          </div>
          <div class="mb-3">
            <label for="detailNote" class="form-label">Notiz</label>
            <input id="detailNote" class="form-control" type="text"
                   v-model="transactionCopy.note"
                   :disabled="!editing"/>
          </div>
          <div class="mb-3">
            <label for="detailEffectiveTime" class="form-label">Buchungsdatum</label>
            <input id="detailEffectiveTime" class="form-control" type="datetime-local"
                   :value="transactionCopy.effectiveTimestamp && convertLocalDateForInput(transactionCopy.effectiveTimestamp)"
                   @input="transactionCopy.effectiveTimestamp = new Date(($event.target as HTMLInputElement)?.value)"
                   :disabled="!editing"/>
          </div>
          <div class="mb-3">
            <label for="detailInsertTime" class="form-label">Erstelldatum</label>
            <input v-if="!editing" id="detailInsertTime" class="form-control" type="datetime-local"
                   :value="transaction.insertTimestamp && convertLocalDateForInput(transaction.insertTimestamp)"
                   disabled/>
            <input v-else id="detailInsertTime" class="form-control" value="<auto-generiert>" disabled/>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div v-if="!editing">
            <button type="button" class="btn btn-secondary w-100" @click="editTransaction(true)">
              Bearbeiten...
            </button>
          </div>
          <div v-else class="btn-group w-100">
            <button type="button" class="btn btn-secondary" @click="editTransaction(false)">
              Abbrechen
            </button>
            <button type="button" class="btn btn-primary" @click="submitTransaction">
              Speichern
            </button>
          </div>
        </div>
      </div>
      <div class="row">
        <div clas="col">
          <div class="mt-3">
            <button v-if="!!props.transaction.refId" type="button" class="btn btn-primary w-100" @click="fetchHistory">
              Historie...
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <DiffTransactions v-if="history" :history="history" :display-values="displayValues"
                    @modal-closed="history = undefined"/>
</template>

<style scoped>

</style>