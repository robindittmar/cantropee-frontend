<script setup lang="ts">
import type {Transaction} from "@/transaction";
import {convertLocalDateForInput, valueToString} from "@/convert";
import {ref} from "vue";

const props = defineProps<{
  parent: Transaction,
  transaction: Transaction,
  displayValues: boolean,
}>();

let isDeposit = ref(props.transaction.value >= 0);
let valueChanged = props.transaction.value !== props.parent.value;
let value19Changed = props.transaction.value19 !== props.parent.value19;
let vat19Changed = props.transaction.vat19 !== props.parent.vat19;
let value7Changed = props.transaction.value7 !== props.parent.value7;
let vat7Changed = props.transaction.vat7 !== props.parent.vat7;
let categoryChanged = props.transaction.category !== props.parent.category;
let noteChanged = props.transaction.note !== props.parent.note;
let effectiveTimestampChanged = props.transaction.effectiveTimestamp.getTime() !== props.parent.effectiveTimestamp.getTime();
</script>

<template>
  <div class="m-3">
    <div class="row">
      <div class="col">
        <div class="mb-3">
          <button v-if="isDeposit" @click="isDeposit = false"
                  class="btn btn-outline-success w-100"
                  disabled>
            Einzahlung
          </button>
          <button v-else @click="isDeposit = true"
                  class="btn btn-outline-danger w-100"
                  disabled>
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
          <label for="detailGroupValue" class="form-label" :class="{'text-warning': valueChanged}">Betrag</label>
          <div id="detailGroupValue" class="input-group mb-3">
            <span class="input-group-text" id="detailValueAddon">EUR</span>
            <input id="detailValue" class="form-control"
                   :class="{'text-warning': valueChanged}"
                   aria-describedby="detailValueAddon" type="text" :value="displayValues ? valueToString(Math.abs(transaction.value)) : '***'"
                   disabled/>
          </div>
        </div>
        <template v-if="!isDeposit">
        <div class="mb-3">
          <label for="detailGroupValue19" class="form-label"
                 :class="{'text-warning': value19Changed || vat19Changed}">19% Anteil | 19% Steuern</label>
          <div id="detailGroupValue19" class="input-group mb-3">
            <span class="input-group-text" id="detailValue19addon">EUR</span>
            <input id="detailValue19" class="form-control"
                   :class="{'text-warning': value19Changed}"
                   aria-describedby="detailValue19addon" type="text"
                   :value="displayValues ? valueToString(Math.abs(transaction.value19)) : '***'"
                   disabled/>
            <span class="input-group-text" id="detailVat19addon">EUR</span>
            <input id="detailVat19" class="form-control" aria-describedby="detailVat19addon"
                   :class="{'text-warning': vat19Changed}"
                   :value="displayValues ? valueToString(Math.abs(transaction.vat19)) : '***'"
                   disabled/>
          </div>
        </div>
        <div class="mb-3">
          <label for="detailGroupValue7" class="form-label"
                 :class="{'text-warning': value7Changed || vat7Changed}">7% Anteil | 7% Steuern</label>
          <div id="detailGroupValue7" class="input-group mb-3">
            <span class="input-group-text" id="detailValue7addon">EUR</span>
            <input id="detailValue7" class="form-control"
                   :class="{'text-warning': value7Changed}"
                   aria-describedby="detailValue7addon" type="text"
                   :value="displayValues ? valueToString(Math.abs(transaction.value7)) : '***'"
                   disabled/>
            <span class="input-group-text" id="detailVat7addon">EUR</span>
            <input id="detailVat7" class="form-control" aria-describedby="detailVat7addon"
                   :class="{'text-warning': vat7Changed}"
                   type="text" :value="displayValues ? valueToString(Math.abs(transaction.vat7)) : '***'"
                   disabled/>
          </div>
        </div>
        </template>
        <div class="mb-3">
          <label for="detailCategory" class="form-label" :class="{'text-warning': categoryChanged}">Kategorie</label>
          <input id="detailCategory" class="form-control" type="text"
                 :class="{'text-warning': categoryChanged}"
                 :value="transaction.category" disabled/>
        </div>
        <div class="mb-3">
          <label for="detailNote" class="form-label" :class="{'text-warning': noteChanged}">Notiz</label>
          <input id="detailNote" class="form-control" type="text"
                 :class="{'text-warning': noteChanged}"
                 :value="transaction.note"
                 disabled/>
        </div>
        <div class="mb-3">
          <label for="detailEffectiveTime" class="form-label" :class="{'text-warning': effectiveTimestampChanged}">Buchungsdatum</label>
          <input id="detailEffectiveTime" class="form-control" type="datetime-local"
                 :class="{'text-warning': effectiveTimestampChanged}"
                 :value="transaction.effectiveTimestamp && convertLocalDateForInput(transaction.effectiveTimestamp)"
                 disabled/>
        </div>
        <div class="mb-3">
          <label for="detailInsertTime" class="form-label">Erstelldatum</label>
          <input id="detailInsertTime" class="form-control" type="datetime-local"
                 :value="transaction.insertTimestamp && convertLocalDateForInput(transaction.insertTimestamp)"
                 disabled/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>