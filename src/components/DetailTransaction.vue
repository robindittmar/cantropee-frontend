<script setup lang="ts">
import {convertLocalDateForInput} from "@/convert";
import type {Transaction} from "@/transaction";
import type {Ref} from "vue";
import {onBeforeUnmount, onMounted, ref} from "vue";
import {Collapse} from "bootstrap";
import {Currencies, Money} from "ts-money";
import {deriveVat} from "@/tax-helper";
import type {Category} from "@/category";
import DiffTransactions from "@/components/DiffTransactions.vue";
import {getTransactionById} from "@/transaction";

const props = defineProps<{
  transaction: Transaction,
  categories: Category[],
  displayValues: boolean,
}>();

const emit = defineEmits(['updated-transaction']);

const copyTransaction = () => {
  return {
    id: props.transaction.id,
    refId: props.transaction.refId,
    category: props.transaction.category,
    insertTimestamp: props.transaction.insertTimestamp,
    effectiveTimestamp: props.transaction.effectiveTimestamp,
    value: props.transaction.value.toDecimal(),
    value19: props.transaction.value19.toDecimal(),
    value7: props.transaction.value7.toDecimal(),
    vat19: props.transaction.vat19.toDecimal(),
    vat7: props.transaction.vat7.toDecimal(),
    note: props.transaction.note,
  }
};

let editing = ref(false);
const selectedCategory = ref('');
let transactionCopy = ref(copyTransaction());
let child: Ref<Transaction | undefined> = ref(undefined);

const setValue19 = (event: Event) => {
  let current = transactionCopy.value;

  current.value19 = (event.target as HTMLInputElement).valueAsNumber;
  current.value7 = new Money(Math.round(current.value * 100), Currencies.EUR)
      .subtract(new Money(Math.round(current.value19 * 100), Currencies.EUR))
      .amount / 100;

  let vats = deriveVat(current.value19, current.value7);
  current.vat19 = vats.vat19;
  current.vat7 = vats.vat7;

  transactionCopy.value = current;
};

const setValue7 = (event: Event) => {
  let current = transactionCopy.value;

  current.value7 = (event.target as HTMLInputElement).valueAsNumber;
  current.value19 = new Money(Math.round(current.value * 100), Currencies.EUR)
      .subtract(new Money(Math.round(current.value7 * 100), Currencies.EUR))
      .amount / 100;

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
  let edited = transactionCopy.value;

  edited.value *= 100;
  edited.value19 *= 100;
  edited.vat19 *= 100;
  edited.vat7 *= 100;
  edited.category = selectedCategory.value;

  const res = await fetch('/api/transactions', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(edited),
  });

  let newId = await res.json();
  emit('updated-transaction', newId.id);
};

const fetchChild = async () => {
  if(props.transaction.refId) {
    child.value = await getTransactionById(props.transaction.refId);
  }
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
                     aria-describedby="detailValueAddon" type="text" :value="displayValues ? transaction.value.toString() : '***'"
                     disabled/>
              <input v-else id="detailValue" class="form-control"
                     aria-describedby="detailValueAddon" type="number" step=".01"
                     v-model="transactionCopy.value"/>
            </div>
          </div>
          <div class="mb-3">
            <label for="detailGroupValue19" class="form-label">19% Anteil | 19% Steuern</label>
            <div id="detailGroupValue19" class="input-group mb-3">
              <span class="input-group-text" id="detailValue19addon">EUR</span>
              <input v-if="!editing" id="detailValue19" class="form-control"
                     aria-describedby="detailValue19addon" type="text"
                     :value="displayValues ? transaction.value19.toString() : '***'"
                     disabled/>
              <input v-else id="detailValue19" class="form-control"
                     aria-describedby="detailValue19addon" type="number" step=".01"
                     :value="transactionCopy.value19"
                     @input="setValue19"/>
              <span class="input-group-text" id="detailVat19addon">EUR</span>
              <input v-if="!editing" id="detailVat19" class="form-control" aria-describedby="detailVat19addon"
                     :value="displayValues ? transaction.vat19.toString() : '***'"
                     disabled/>
              <input v-else id="detailVat19" class="form-control" aria-describedby="detailVat19addon"
                     type="number" step=".01"
                     v-model="transactionCopy.vat19"/>
            </div>
          </div>
          <div class="mb-3">
            <label for="detailGroupValue7" class="form-label">7% Anteil | 7% Steuern</label>
            <div id="detailGroupValue7" class="input-group mb-3">
              <span class="input-group-text" id="detailValue7addon">EUR</span>
              <input v-if="!editing" id="detailValue7" class="form-control"
                     aria-describedby="detailValue7addon" type="text"
                     :value="displayValues ? transaction.value7.toString() : '***'"
                     disabled/>
              <input v-else id="detailValue7" class="form-control"
                     aria-describedby="detailValue7addon" type="number" step=".01"
                     :value="transactionCopy.value7"
                     @input="setValue7"/>
              <span class="input-group-text" id="detailVat7addon">EUR</span>
              <input v-if="!editing" id="detailVat7" class="form-control" aria-describedby="detailVat7addon"
                     type="text" :value="displayValues ? transaction.vat7.toString() : '***'"
                     disabled/>
              <input v-else id="detailVat7" class="form-control" aria-describedby="detailVat7addon"
                     type="number" step=".01"
                     v-model="transactionCopy.vat7">
            </div>
          </div>
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
          <div class="mb-3">
            <button v-if="!!props.transaction.refId && child === undefined && !editing" type="button" class="btn btn-primary" @click="fetchChild">
              Historie...
            </button>
            <button v-if="child" type="button" class="btn btn-danger" @click="child = undefined">
              Historie schließen
            </button>
          </div>
        </div>
      </div>
      <div v-if="child === undefined" class="row">
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
    </div>
  </div>

  <DiffTransactions v-if="child" :transaction="child" :parent="props.transaction" :display-values="displayValues"/>
</template>

<style scoped>

</style>