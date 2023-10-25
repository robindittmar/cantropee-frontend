<script setup lang="ts">
import {convertLocalDateForInput} from "@/convert";
import type {Transaction} from "@/transaction";
import {onBeforeUnmount, onMounted} from "vue";
import {Collapse} from "bootstrap";

const props = defineProps<{
  transaction: Transaction,
  displayValues: boolean,
}>();

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
  <div class="collapse" :id="'detailCollapse-' + transaction.id" tabindex="-1" aria-labelledby="detailModalLabel" aria-hidden="true">
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
              <input id="detailValue" class="form-control"
                     aria-describedby="detailValueAddon" type="text" :value="displayValues ? transaction.value.toString() : '***'"
                     disabled/>
            </div>
          </div>
          <div class="mb-3">
            <label for="detailGroupValue19" class="form-label">19% Anteil | 19% Steuern</label>
            <div id="detailGroupValue19" class="input-group mb-3">
              <span class="input-group-text" id="detailValue19addon">EUR</span>
              <input id="detailValue19" class="form-control"
                     aria-describedby="detailValue19addon" type="text"
                     :value="displayValues ? transaction.value19.toString() : '***'"
                     disabled/>
              <span class="input-group-text" id="detailVat19addon">EUR</span>
              <input id="detailVat19" class="form-control" aria-describedby="detailVat19addon"
                     type="text" :value="displayValues ? transaction.vat19.toString() : '***'"
                     disabled/>
            </div>
          </div>
          <div class="mb-3">
            <label for="detailGroupValue7" class="form-label">7% Anteil | 7% Steuern</label>
            <div id="detailGroupValue7" class="input-group mb-3">
              <span class="input-group-text" id="detailValue7addon">EUR</span>
              <input id="detailValue7" class="form-control"
                     aria-describedby="detailValue7addon" type="text"
                     :value="displayValues ? transaction.value7.toString() : '***'"
                     disabled/>
              <span class="input-group-text" id="detailVat7addon">EUR</span>
              <input id="detailVat7" class="form-control" aria-describedby="detailVat7addon"
                     type="text" :value="displayValues ? transaction.vat7.toString() : '***'"
                     disabled/>
            </div>
          </div>
          <div class="form-check mb-3">
            <input id="detailIsCorrection" class="form-check-input" :checked="transaction.refId !== undefined"
                   disabled/>
            <label for="detailIsCorrection" class="form-check-label">Ist eine Korrektur</label>
          </div>
          <div class="mb-3">
            <label for="detailCategory" class="form-label">Kategorie</label>
            <input id="detailCategory" class="form-control" type="text"
                   :value="transaction.category" disabled/>
          </div>
          <div class="mb-3">
            <label for="detailNote" class="form-label">Notiz</label>
            <input id="detailNote" class="form-control" type="text"
                   :value="transaction.note" disabled/>
          </div>
          <div class="mb-3">
            <label for="detailDateTime" class="form-label">Buchungsdatum</label>
            <input id="detailDateTime" class="form-control" type="datetime-local"
                   :value="transaction.effectiveTimestamp && convertLocalDateForInput(transaction.effectiveTimestamp)"
                   disabled/>
          </div>
          <div class="mb-3">
            <label for="detailDateTime" class="form-label">Erstelldatum</label>
            <input id="detailDateTime" class="form-control" type="datetime-local"
                   :value="transaction.insertTimestamp && convertLocalDateForInput(transaction.insertTimestamp)"
                   disabled/>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <button type="button" class="btn btn-secondary w-100">
            (wip!) Bearbeiten...
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>