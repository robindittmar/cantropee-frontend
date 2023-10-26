<script setup lang="ts">
import {convertLocalDateForInput} from "@/convert";
import type {Transaction} from "@/transaction";
import {onBeforeUnmount, onMounted, ref} from "vue";
import {Collapse} from "bootstrap";
import {Currencies, Money} from "ts-money";
import {deriveVat} from "@/tax-helper";

const props = defineProps<{
  transaction: Transaction,
  displayValues: boolean,
}>();

const emit = defineEmits(['updated-transaction']);
let editing = ref(false);
let copyTransaction = ref({
  id: props.transaction.id,
  rowIdx: props.transaction.rowIdx,
  refId: props.transaction.refId,
  category: props.transaction.category,
  insertTimestamp: props.transaction.insertTimestamp,
  effectiveTimestamp: props.transaction.effectiveTimestamp,
  pending: props.transaction.pending,
  isPositive: props.transaction.isPositive,
  value: props.transaction.value.toDecimal(),
  value19: props.transaction.value19.toDecimal(),
  value7: props.transaction.value7.toDecimal(),
  vat19: props.transaction.vat19.toDecimal(),
  vat7: props.transaction.vat7.toDecimal(),
  note: props.transaction.note,
});

const setValue19 = (event: Event) => {
  let current = copyTransaction.value;

  current.value19 = (event.target as HTMLInputElement).valueAsNumber;
  current.value7 = new Money(Math.round(current.value * 100), Currencies.EUR)
      .subtract(new Money(Math.round(current.value19 * 100), Currencies.EUR))
      .amount / 100;

  let vats = deriveVat(current.value19, current.value7);
  current.vat19 = vats.vat19;
  current.vat7 = vats.vat7;

  copyTransaction.value = current;
};

const setValue7 = (event: Event) => {
  let current = copyTransaction.value;

  current.value7 = (event.target as HTMLInputElement).valueAsNumber;
  current.value19 = new Money(Math.round(current.value * 100), Currencies.EUR)
      .subtract(new Money(Math.round(current.value7 * 100), Currencies.EUR))
      .amount / 100;

  let vats = deriveVat(current.value19, current.value7);
  current.vat19 = vats.vat19;
  current.vat7 = vats.vat7;

  copyTransaction.value = current;
};

const editTransaction = async () => {
  editing.value = true;
};

const submitTransaction = async() => {
  let edited = copyTransaction.value;

  edited.value *= 100;
  edited.value19 *= 100;
  edited.vat19 *= 100;
  edited.vat7 *= 100;

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
                     v-model="copyTransaction.value"/>
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
                     :value="copyTransaction.value19"
                     @input="setValue19"/>
              <span class="input-group-text" id="detailVat19addon">EUR</span>
              <input v-if="!editing" id="detailVat19" class="form-control" aria-describedby="detailVat19addon"
                     :value="displayValues ? transaction.vat19.toString() : '***'"
                     disabled/>
              <input v-else id="detailVat19" class="form-control" aria-describedby="detailVat19addon"
                     type="number" step=".01"
                     v-model="copyTransaction.vat19"/>
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
                     :value="copyTransaction.value7"
                     @input="setValue7"/>
              <span class="input-group-text" id="detailVat7addon">EUR</span>
              <input v-if="!editing" id="detailVat7" class="form-control" aria-describedby="detailVat7addon"
                     type="text" :value="displayValues ? transaction.vat7.toString() : '***'"
                     disabled/>
              <input v-else id="detailVat7" class="form-control" aria-describedby="detailVat7addon"
                     type="number" step=".01"
                     v-model="copyTransaction.vat7">
            </div>
          </div>
          <div class="form-check mb-3">
            <input id="detailIsCorrection" class="form-check-input" type="checkbox"
                   :checked="!!transaction.refId"
                   disabled/>
            <label for="detailIsCorrection" class="form-check-label">Korrektur</label>
          </div>
          <div class="mb-3">
            <label for="detailCategory" class="form-label">Kategorie</label>
            <input v-if="!editing" id="detailCategory" class="form-control" type="text"
                   :value="transaction.category" disabled/>
            <input v-else id="detailCategory" class="form-control" type="text" value="Das ist mir grad zu doof hier"/>
          </div>
          <div class="mb-3">
            <label for="detailNote" class="form-label">Notiz</label>
            <input id="detailNote" class="form-control" type="text"
                   v-model="copyTransaction.note"
                   :disabled="!editing"/>
          </div>
          <div class="mb-3">
            <label for="detailEffectiveTime" class="form-label">Buchungsdatum</label>
            <input id="detailEffectiveTime" class="form-control" type="datetime-local"
                   :value="copyTransaction.effectiveTimestamp && convertLocalDateForInput(copyTransaction.effectiveTimestamp)"
                   @input="copyTransaction.effectiveTimestamp = new Date(($event.target as HTMLInputElement)?.value)"
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
          <button v-if="!editing" type="button" class="btn btn-secondary w-100" @click="editTransaction">
            Bearbeiten...
          </button>
          <button v-else type="button" class="btn btn-primary w-100" @click="submitTransaction">
            Speichern
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>