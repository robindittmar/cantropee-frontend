<script setup lang="ts">
import {convertLocalDateForInput, valueToString} from "@/core/convert";
import type {RecurringTransaction} from "@/core/recurring-transaction";
import {onBeforeUnmount, onMounted, ref} from "vue";
import {Collapse, Modal} from "bootstrap";
import {deriveVat} from "@/core/tax-helper";
import type {Category} from "@/core/category";
import {req} from "@/core/requests";
import {lang} from "@/core/languages";

const props = defineProps<{
  recurringTransaction: RecurringTransaction,
  categories: Category[],
  currency: string,
  displayValues: boolean,
  showTaxes: boolean,
}>();

const emit = defineEmits(['updated-recurring-transaction', 'deleted-recurring-transaction']);

const copyRecurringTransaction = () => {
  return {
    id: props.recurringTransaction.id,
    insertTimestamp: props.recurringTransaction.insertTimestamp,
    timezone: props.recurringTransaction.timezone,
    executionPolicy: props.recurringTransaction.executionPolicy,
    executionPolicyData: props.recurringTransaction.executionPolicyData,
    firstExecution: props.recurringTransaction.firstExecution,
    nextExecution: props.recurringTransaction.nextExecution,
    lastExecution: props.recurringTransaction.lastExecution,
    category: props.recurringTransaction.category,
    value: Math.abs(props.recurringTransaction.value / 100),
    value19: Math.abs(props.recurringTransaction.value19 ?? 0 / 100),
    value7: Math.abs(props.recurringTransaction.value7 ?? 0 / 100),
    vat19: Math.abs(props.recurringTransaction.vat19 ?? 0 / 100),
    vat7: Math.abs(props.recurringTransaction.vat7 ?? 0 / 100),
    note: props.recurringTransaction.note,
    isPositive: props.recurringTransaction.isPositive,
  };
};

let isDeposit = ref(props.recurringTransaction.value >= 0);
let editing = ref(false);
const selectedCategory = ref('');
let recurringCopy = ref(copyRecurringTransaction());

let cascadeDelete = ref(false);
let confirmDelete = ref(false);

const setValue = (event: Event) => {
  let current = recurringCopy.value;

  current.value = (event.target as HTMLInputElement).valueAsNumber;
  if (current.value < 0) {
    current.value = 0;
  }
  current.value19 = 0;
  current.value7 = 0;
  current.vat19 = 0;
  current.vat7 = 0;

  recurringCopy.value = current;
}

const setValue19 = (event: Event) => {
  let current = recurringCopy.value;

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

  recurringCopy.value = current;
};

const setValue7 = (event: Event) => {
  let current = recurringCopy.value;

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

  recurringCopy.value = current;
};

const showConfirmDelete = () => {
  cascadeDelete.value = false;
  confirmDelete.value = false;

  const modal = Modal.getOrCreateInstance('#confirmDeleteModal');
  modal.show();
};

const hideConfirmDelete = () => {
  const modal = Modal.getOrCreateInstance('#confirmDeleteModal');
  modal.hide();
};

const deleteRecurringTransaction = async () => {
  const res = await req(`/api/recurring/${props.recurringTransaction.id}?cascade=${cascadeDelete.value}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
  });

  let success = await res.json();
  if (success.success) {
    emit('deleted-recurring-transaction');
    hideConfirmDelete();
  }
};

// const editRecurringTransaction = async (edit: boolean) => {
//   editing.value = edit;
//
//   if (edit) {
//     selectedCategory.value = props.recurringTransaction.category;
//   } else {
//     recurringCopy.value = copyRecurringTransaction();
//   }
// };
//
// const submitTransaction = async() => {
//   let edited = {...recurringCopy.value};
//
//   edited.value *= 100;
//   edited.value19 *= 100;
//   edited.value7 *= 100;
//   edited.vat19 *= 100;
//   edited.vat7 *= 100;
//   edited.category = selectedCategory.value;
//   if (isDeposit.value) {
//     edited.value19 = 0;
//     edited.value7 = 0;
//     edited.vat19 = 0;
//     edited.vat7 = 0;
//   } else {
//     edited.value = -edited.value;
//     edited.value19 = -edited.value19;
//     edited.value7 = -edited.value7;
//     edited.vat19 = -edited.vat19;
//     edited.vat7 = -edited.vat7;
//   }
//
//   const res = await req(`/api/recurring/${edited.id}`, {
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(edited),
//   });
//
//   let newId = await res.json();
//   emit('updated-recurring-transaction', newId.id);
// };

onMounted(() => {
  const collapse = Collapse.getOrCreateInstance(`#detailCollapse-${props.recurringTransaction.id}`);
  collapse.show();
});

onBeforeUnmount(() => {
  const collapse = Collapse.getOrCreateInstance(`#detailCollapse-${props.recurringTransaction.id}`);
  collapse.hide();
});
</script>

<template>
  <div class="collapse" :id="'detailCollapse-' + recurringTransaction.id" tabindex="-1" aria-hidden="true">
    <div class="m-3">
      <div class="row">
        <div class="col">
          <div class="mb-3">
            <button v-if="isDeposit" @click="isDeposit = false"
                    class="btn w-100"
                    :class="{'btn-outline-success': !editing, 'btn-success': editing}"
                    :disabled="!editing">
              {{ lang.depositTitle }}
            </button>
            <button v-else @click="isDeposit = true"
                    class="btn w-100"
                    :class="{'btn-outline-danger': !editing, 'btn-danger': editing}"
                    :disabled="!editing">
              {{ lang.withdrawalTitle }}
            </button>
          </div>
          <div class="mb-3">
            <div id="detailGroupId" class="input-group mb-3">
              <span class="input-group-text" id="detailIdAddon">ID</span>
              <input id="detailId" class="form-control"
                     aria-describedby="detailIdAddon" type="text" :value="recurringCopy.id"
                     disabled/>
            </div>
          </div>
          <div class="mb-3">
            <label for="detailFirstExecution" class="form-label">{{ lang.firstExecution }}</label>
            <input id="detailFirstExecution" class="form-control" type="datetime-local"
                   :value="recurringCopy.firstExecution && convertLocalDateForInput(recurringCopy.firstExecution)"
                   @input="recurringCopy.firstExecution = new Date(($event.target as HTMLInputElement)?.value)"
                   disabled/>
          </div>
          <div class="mb-3">
            <label for="detailNextExecution" class="form-label">{{ lang.nextExecution }}</label>
            <input id="detailNextExecution" class="form-control" type="datetime-local"
                   :value="recurringCopy.nextExecution && convertLocalDateForInput(recurringCopy.nextExecution)"
                   @input="recurringCopy.nextExecution = new Date(($event.target as HTMLInputElement)?.value)"
                   disabled/>
          </div>
          <div v-if="recurringTransaction.lastExecution" class="mb-3">
            <label for="detailLastExecution" class="form-label">{{ lang.lastExecution }}</label>
            <input id="detailLastExecution" class="form-control" type="datetime-local"
                   :value="recurringCopy.lastExecution && convertLocalDateForInput(recurringCopy.lastExecution)"
                   @input="recurringCopy.lastExecution = new Date(($event.target as HTMLInputElement)?.value)"
                   disabled/>
          </div>
          <div class="mb-3">
            <label for="detailGroupValue" class="form-label">{{ lang.value }}</label>
            <div id="detailGroupValue" class="input-group mb-3">
              <span class="input-group-text" id="detailValueAddon">{{ currency }}</span>
              <input v-if="!editing" id="detailValue" class="form-control"
                     aria-describedby="detailValueAddon" type="text" :value="displayValues ? valueToString(Math.abs(recurringTransaction.value)) : '***'"
                     disabled/>
              <input v-else id="detailValue" class="form-control"
                     aria-describedby="detailValueAddon" type="number" step=".01"
                     :value="recurringCopy.value"
                     @input="setValue"/>
            </div>
          </div>
          <template v-if="!isDeposit && showTaxes">
            <div class="mb-3">
              <label for="detailGroupValue19" class="form-label">{{ lang.value19 }} | {{ lang.vat19 }}</label>
              <div id="detailGroupValue19" class="input-group mb-3">
                <span class="input-group-text" id="detailValue19addon">{{ currency }}</span>
                <input v-if="!editing" id="detailValue19" class="form-control"
                       aria-describedby="detailValue19addon" type="text"
                       :value="displayValues ? valueToString(Math.abs(recurringTransaction.value19 ?? 0)) : '***'"
                       disabled/>
                <input v-else id="detailValue19" class="form-control"
                       aria-describedby="detailValue19addon" type="number" step=".01"
                       :value="recurringCopy.value19"
                       @input="setValue19"/>
                <span class="input-group-text" id="detailVat19addon">{{ currency }}</span>
                <input v-if="!editing" id="detailVat19" class="form-control" aria-describedby="detailVat19addon"
                       :value="displayValues ? valueToString(Math.abs(recurringTransaction.vat19 ?? 0)) : '***'"
                       disabled/>
                <input v-else id="detailVat19" class="form-control" aria-describedby="detailVat19addon"
                       type="number" step=".01"
                       v-model="recurringCopy.vat19"
                       disabled/>
              </div>
            </div>
            <div class="mb-3">
              <label for="detailGroupValue7" class="form-label">{{ lang.value7 }} | {{ lang.vat7 }}</label>
              <div id="detailGroupValue7" class="input-group mb-3">
                <span class="input-group-text" id="detailValue7addon">{{ currency }}</span>
                <input v-if="!editing" id="detailValue7" class="form-control"
                       aria-describedby="detailValue7addon" type="text"
                       :value="displayValues ? valueToString(Math.abs(recurringTransaction.value7 ?? 0)) : '***'"
                       disabled/>
                <input v-else id="detailValue7" class="form-control"
                       aria-describedby="detailValue7addon" type="number" step=".01"
                       :value="recurringCopy.value7"
                       @input="setValue7"/>
                <span class="input-group-text" id="detailVat7addon">{{ currency }}</span>
                <input v-if="!editing" id="detailVat7" class="form-control" aria-describedby="detailVat7addon"
                       type="text" :value="displayValues ? valueToString(Math.abs(recurringTransaction.vat7 ?? 0)) : '***'"
                       disabled/>
                <input v-else id="detailVat7" class="form-control" aria-describedby="detailVat7addon"
                       type="number" step=".01"
                       v-model="recurringCopy.vat7"
                       disabled>
              </div>
            </div>
          </template>
          <div class="mb-3">
            <label for="detailCategory" class="form-label">{{ lang.category }}</label>
            <input v-if="!editing" id="detailCategory" class="form-control" type="text"
                   :value="recurringTransaction.category" disabled/>
            <select v-else id="withdrawCategory" class="form-select" v-model="selectedCategory">
              <option v-for="category in categories" :key="category.id" :value="category.name"
                      :selected="category.id === 1">
                {{ category.name }}
              </option>
            </select>
          </div>
          <div class="mb-3">
            <label for="detailNote" class="form-label">{{ lang.note }}</label>
            <input id="detailNote" class="form-control" type="text"
                   v-model="recurringCopy.note"
                   :disabled="!editing"/>
          </div>
          <div class="mb-3">
            <label for="detailInsertTime" class="form-label">{{ lang.creationDate }}</label>
            <input v-if="!editing" id="detailInsertTime" class="form-control" type="datetime-local"
                   :value="recurringTransaction.insertTimestamp && convertLocalDateForInput(recurringTransaction.insertTimestamp)"
                   disabled/>
            <input v-else id="detailInsertTime" class="form-control" value="<auto-generiert>" disabled/>
          </div>
        </div>
      </div>

      <template v-if="recurringTransaction.active">
      <div class="row">
        <div class="col">
          <button class="btn btn-danger" @click="showConfirmDelete"><i class="fa-solid fa-trash"></i>&nbsp;{{ lang.delete }}...</button>
        </div>
      </div>

      <div class="modal fade" id="confirmDeleteModal" tabindex="-1" aria-labelledby="confirmDeleteModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="confirmDeleteModalLabel">{{ lang.confirm }}</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div>
                <div class="form-check mb-3">
                  <input id="recurringCascadeDelete" class="form-check-input" type="checkbox" v-model="cascadeDelete"/>
                  <label for="recurringCascadeDelete" class="form-check-label">{{ lang.recurringDeleteTransactionsCascasing }}</label>
                </div>
                <div class="form-check mb-3">
                  <input id="recurringConfirmDelete" class="form-check-input" type="checkbox" v-model="confirmDelete"/>
                  <label for="recurringConfirmDelete" class="form-check-label">{{ lang.confirmDelete }}</label>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                {{ lang.cancel }}
              </button>
              <button type="button" class="btn btn-danger" :disabled="!confirmDelete" @click="deleteRecurringTransaction">
                <i class="fa-solid fa-trash"></i>&nbsp;{{ lang.delete }}
              </button>
            </div>
          </div>
        </div>
      </div>
      </template>
    </div>
  </div>
</template>

<style scoped>

</style>