<script setup lang="ts">
import type {Transaction} from "@/transaction";
import {convertLocalDateForInput} from "@/convert";
import type {Ref} from "vue";
import {ref} from "vue";
import {getTransactionById} from "@/transaction";

const props = defineProps<{
  parent: Transaction,
  transaction: Transaction,
  displayValues: boolean,
}>();

let valueChanged = !props.transaction.value.equals(props.parent.value);
let value19Changed = !props.transaction.value19.equals(props.parent.value19);
let vat19Changed = !props.transaction.vat19.equals(props.parent.vat19);
let value7Changed = !props.transaction.value7.equals(props.parent.value7);
let vat7Changed = !props.transaction.vat7.equals(props.parent.vat7);
let categoryChanged = props.transaction.category !== props.parent.category;
let noteChanged = props.transaction.note !== props.parent.note;
let effectiveTimestampChanged = props.transaction.effectiveTimestamp.getTime() !== props.parent.effectiveTimestamp.getTime();

let child: Ref<Transaction | undefined> = ref(undefined);
const fetchChild = async () => {
  if(props.transaction.refId) {
    child.value = await getTransactionById(props.transaction.refId);
  }
};

</script>

<template>
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
          <label for="detailGroupValue" class="form-label" :class="{'text-warning': valueChanged}">Betrag</label>
          <div id="detailGroupValue" class="input-group mb-3">
            <span class="input-group-text" id="detailValueAddon">EUR</span>
            <input id="detailValue" class="form-control"
                   :class="{'text-warning': valueChanged}"
                   aria-describedby="detailValueAddon" type="text" :value="displayValues ? transaction.value.toString() : '***'"
                   disabled/>
          </div>
        </div>
        <div class="mb-3">
          <label for="detailGroupValue19" class="form-label"
                 :class="{'text-warning': value19Changed || vat19Changed}">19% Anteil | 19% Steuern</label>
          <div id="detailGroupValue19" class="input-group mb-3">
            <span class="input-group-text" id="detailValue19addon">EUR</span>
            <input id="detailValue19" class="form-control"
                   :class="{'text-warning': value19Changed}"
                   aria-describedby="detailValue19addon" type="text"
                   :value="displayValues ? transaction.value19.toString() : '***'"
                   disabled/>
            <span class="input-group-text" id="detailVat19addon">EUR</span>
            <input id="detailVat19" class="form-control" aria-describedby="detailVat19addon"
                   :class="{'text-warning': vat19Changed}"
                   :value="displayValues ? transaction.vat19.toString() : '***'"
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
                   :value="displayValues ? transaction.value7.toString() : '***'"
                   disabled/>
            <span class="input-group-text" id="detailVat7addon">EUR</span>
            <input id="detailVat7" class="form-control" aria-describedby="detailVat7addon"
                   :class="{'text-warning': vat7Changed}"
                   type="text" :value="displayValues ? transaction.vat7.toString() : '***'"
                   disabled/>
          </div>
        </div>
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
        <div class="mb-3">
          <button v-if="!!props.transaction.refId && child === undefined" type="button" class="btn btn-primary" @click="fetchChild">
            Historie...
          </button>
          <button v-if="child" type="button" class="btn btn-danger" @click="child = undefined">
            Historie schließen
          </button>
        </div>
      </div>
    </div>
  </div>

  <DiffTransactions v-if="child" :transaction="child" :parent="transaction" :display-values="displayValues"/>
</template>

<style scoped>

</style>