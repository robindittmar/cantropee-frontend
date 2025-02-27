<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {convertLocalDateForInput} from "@/core/convert";
import {deriveVat} from "@/core/tax-helper";
import type {Category} from "@/core/category";
import {req} from "@/core/requests";
import {ExecutionPolicy} from "@/core/recurring-transaction";
import {toast, ToastColor} from "@/core/toaster";
import {lang} from "@/core/languages";

const props = defineProps<{
  categories: Category[],
  showTaxes: boolean,
  currency: string;
}>();

const emit = defineEmits(['submit-recurring-transaction']);

const startOfNextMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1);
}
const nextMonth = startOfNextMonth();

const newRecurringTransaction = () => {
  return {
    isDeposit: true,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    executionPolicy: ExecutionPolicy.StartOfMonth,
    firstExecution: nextMonth,
    nextExecution: nextMonth,
    hasLastExecution: false,
    lastExecution: nextMonth,
    value: 0,
    value19: 0,
    value7: 0,
    vat19: 0,
    vat7: 0,
    selectedCategory: props.categories[0]?.name ?? '',
    note: '',
  };
}

const r = ref(newRecurringTransaction());
watch(() => r.value.executionPolicy, () => {
  setFirstExecution(r.value.firstExecution);
  setLastExecution(r.value.lastExecution);
});

const submitting = ref(false);

const setFirstExecution = (value: Date) => {
  let current = r.value;
  if (current.executionPolicy === ExecutionPolicy.StartOfMonth) {
    current.firstExecution = new Date(value.getFullYear(), value.getMonth());
  } else if (current.executionPolicy === ExecutionPolicy.EndOfMonth) {
    current.firstExecution = new Date(
        value.getFullYear(),
        value.getMonth() + 1,
        0,
        23,
        59,
        59,
    );
  }
};

const setLastExecution = (value: Date) => {
  let current = r.value;
  if (current.executionPolicy === ExecutionPolicy.StartOfMonth) {
    current.lastExecution = new Date(value.getFullYear(), value.getMonth());
  } else if (current.executionPolicy === ExecutionPolicy.EndOfMonth) {
    current.lastExecution = new Date(
        value.getFullYear(),
        value.getMonth() + 1,
        0,
        23,
        59,
        59,
    );
  }
};

const setValue = (event: Event) => {
  let current = r.value;

  current.value = (event.target as HTMLInputElement).valueAsNumber;
  if (current.value < 0) {
    current.value = 0;
  }
  current.value19 = 0;
  current.value7 = 0;
  current.vat19 = 0;
  current.vat7 = 0;

  r.value = current;
};

const setValue19 = (event: Event) => {
  let current = r.value;

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

  r.value = current;
};

const setValue7 = (event: Event) => {
  let current = r.value;

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

  r.value = current;
};

const submitRecurring = async () => {
  const current = r.value;

  if (isNaN(current.firstExecution.getTime())) {
    toast(lang.value.firstExecutionIsInvalidDate, ToastColor.Warning);
    return;
  }
  if (current.hasLastExecution && isNaN(current.lastExecution.getTime())) {
    toast(lang.value.lastExecutionIsInvalidDate, ToastColor.Warning);
    return;
  }

  submitting.value = true;

  const payload = {
    timezone: current.timezone,
    executionPolicy: ExecutionPolicy.StartOfMonth,
    executionPolicyData: {},
    firstExecution: current.firstExecution,
    lastExecution: current.hasLastExecution ? current.lastExecution : null,
    category: current.selectedCategory,
    value: (current.value * 100) * (current.isDeposit ? 1 : -1),
    value19: (current.value19 * 100) * (current.isDeposit ? 1 : -1),
    value7: (current.value7 * 100) * (current.isDeposit ? 1 : -1),
    vat19: (current.vat19 * 100) * (current.isDeposit ? 1 : -1),
    vat7: (current.vat7 * 100) * (current.isDeposit ? 1 : -1),
    note: current.note.length > 0 ? current.note : undefined,
  };

  const res = await req('/api/recurring', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload),
  });

  submitting.value = false;

  if (!res.ok) {
    console.warn(res);
  }

  r.value = newRecurringTransaction();
  emit('submit-recurring-transaction');
}

onMounted(() => {
  const modal = document.querySelector('#recurringModal');
  modal?.addEventListener('shown.bs.modal', () => {
    if (r.value.selectedCategory === '') {
      r.value.selectedCategory = props.categories[0].name ?? '';
    }
  });
});
</script>

<template>
  <div class="modal modal-lg fade" id="recurringModal" tabindex="-1" aria-labelledby="recurringModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="recurringModalLabel">{{ lang.recurringPayment }}</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div>
            <div class="mb-3">
              <label for="executionPolicy" class="form-label">{{ lang.recurringExecutionStrategy }}</label>
              <select id="executionPolicy" class="form-select" v-model="r.executionPolicy">
                <option :value="ExecutionPolicy.StartOfMonth">{{ lang.startOfMonth }}</option>
                <option :value="ExecutionPolicy.EndOfMonth">{{ lang.endOfMonth }}</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="recurringFirstExecution" class="form-label">{{ lang.firstExecution }}</label>
              <input id="recurringFirstExecution" class="form-control" type="datetime-local"
                     :value="r.firstExecution && convertLocalDateForInput(r.firstExecution)"
                     @input="setFirstExecution(new Date(($event.target as HTMLInputElement)?.value))"/>
            </div>
            <div class="form-check mb-3">
              <input id="recurringLastExecutionEnabled" class="form-check-input" type="checkbox"
                     v-model="r.hasLastExecution" />
              <label for="recurringLastExecutionEnabled" class="form-check-label">{{ lang.lastExecution }}</label>
            </div>
            <div v-if="r.hasLastExecution" class="mb-3">
              <label for="recurringLastExecution" class="form-label">{{ lang.lastExecution }}</label>
              <input id="recurringLastExecution" class="form-control" type="datetime-local"
                     :value="r.lastExecution && convertLocalDateForInput(r.lastExecution)"
                     @input="setLastExecution(new Date(($event.target as HTMLInputElement)?.value))"/>
            </div>
            <div class="mb-3">
              <label for="recurringTimezone" class="form-label">{{ lang.timezone }}</label>
              <input id="recurringTimezone" class="form-control" type="text" maxlength="128" v-model="r.timezone" disabled/>
            </div>
            <div class="mb-3">
              <button v-if="r.isDeposit" @click="r.isDeposit = false"
                      class="btn btn-success w-100">
                {{ lang.depositTitle }}
              </button>
              <button v-else @click="r.isDeposit = true"
                      class="btn btn-danger w-100">
                {{ lang.withdrawalTitle }}
              </button>
            </div>
            <div class="mb-3">
              <label for="recurringGroupValue" class="form-label">{{ lang.value }}</label>
              <div id="recurringGroupValue" class="input-group mb-3">
                <span class="input-group-text" id="recurringValueAddon">{{ currency }}</span>
                <input id="recurringValue" class="form-control"
                       aria-describedby="recurringValueAddon" type="number" step=".01"
                       :value="r.value"
                       @input="setValue"/>
              </div>
            </div>
            <template v-if="!r.isDeposit && showTaxes">
              <div class="mb-3">
                <label for="recurringGroupValue19" class="form-label">{{ lang.value19 }} | {{ lang.vat19 }}</label>
                <div id="recurringGroupValue19" class="input-group mb-3">
                  <span class="input-group-text" id="recurringValue19addon">{{ currency }}</span>
                  <input id="recurringValue19" class="form-control"
                         aria-describedby="recurringValue19addon" type="number" step=".01"
                         :value="r.value19"
                         @input="setValue19"/>
                  <span class="input-group-text" id="recurringVat19addon">{{ currency }}</span>
                  <input id="recurringVat19" class="form-control" aria-describedby="recurringVat19addon"
                         type="text" :value="r.vat19" disabled/>
                </div>
              </div>
              <div class="mb-3">
                <label for="recurringGroupValue7" class="form-label">{{ lang.value7 }} | {{ lang.vat7 }}</label>
                <div id="recurringGroupValue7" class="input-group mb-3">
                  <span class="input-group-text" id="recurringValue7addon">{{ currency }}</span>
                  <input id="recurringValue7" class="form-control"
                         aria-describedby="recurringValue7addon" type="number" step=".01"
                         :value="r.value7"
                         @input="setValue7"/>
                  <span class="input-group-text" id="recurringVat7addon">{{ currency }}</span>
                  <input id="recurringVat7" class="form-control" aria-describedby="recurringVat7addon"
                         type="text" :value="r.vat7" disabled/>
                </div>
              </div>
            </template>
            <div class="mb-3">
              <label for="recurringCategory" class="form-label">{{ lang.category }}</label>
              <select id="recurringCategory" class="form-select" v-model="r.selectedCategory">
                <option v-for="category in categories" :key="category.id" :value="category.name">
                  {{ category.name }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label for="recurringNote" class="form-label">{{ lang.note }}</label>
              <input id="recurringNote" class="form-control" type="text" maxlength="128" v-model="r.note"/>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="r = newRecurringTransaction()"
                  data-bs-dismiss="modal">
            {{ lang.cancel }}
          </button>
          <button type="button" class="btn btn-primary" :disabled="submitting || r.value <= 0" @click="submitRecurring">
            {{ lang.save }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>