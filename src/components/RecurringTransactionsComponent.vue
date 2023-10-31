<script setup lang="ts">
import type {Ref} from "vue";
import {onMounted, ref} from "vue";
import {dateToString, moneyToString} from "../convert";
import type {Category} from "@/category";
import type {RecurringTransaction} from "@/recurring-transaction";
import RecurringTransactionModal from "@/components/RecurringTransactionModal.vue";
import DetailRecurringTransaction from "@/components/DetailRecurringTransaction.vue";
import {Modal} from "bootstrap";

const props = defineProps<{
  currency: string,
  displayValues: boolean,
  categories: Category[],
}>();

const emit = defineEmits(['updated-recurring-transaction']);

let recurringTransactions: Ref<RecurringTransaction[]> = ref([]);
let selectedRecurringTransaction: Ref<string | null> = ref(null);
let animating = false;
let openCollapse: Element | null;

const fetchRecurringTransactions = async () => {
  const res = await fetch('/api/recurring');
  recurringTransactions.value = (await res.json()).map((r: RecurringTransaction) => {
    r.insertTimestamp = new Date(r.insertTimestamp);
    r.firstExecution = new Date(r.firstExecution);
    r.nextExecution = new Date(r.nextExecution);
    if (r.lastExecution) {
      r.lastExecution = new Date(r.lastExecution);
    }

    r.isPositive = r.value >= 0;
    return r;
  });
};

const updatedRecurringTransaction = () => {};

const selectRecurringTransaction = (transactionId: string) => {
  if (animating) {
    return;
  }

  let current = selectedRecurringTransaction.value;

  if (current === transactionId) {
    current = null;
  } else {
    current = transactionId;
  }

  selectedRecurringTransaction.value = current;
};

const waitForExpand = (el: any, done: any) => {
  let tid = selectedRecurringTransaction.value;
  animating = true;

  openCollapse = document.querySelector(`#detailCollapse-${tid}`);
  if (openCollapse) {
    openCollapse.addEventListener('shown.bs.collapse', () => {
      animating = false;
      done();
    });
  } else {
    animating = false;
    done();
  }
};

const waitForCollapse = (el: any, done: any) => {
  animating = true;

  if (openCollapse) {
    openCollapse.addEventListener('hidden.bs.collapse', () => {
      animating = false;
      done();
      openCollapse = null;
    });
  } else {
    animating = false;
    done();
  }
};

const showModal = () => {
  const modal = Modal.getOrCreateInstance('#recurringModal');
  modal.show();
};

const hideModal = () => {
  const modal = Modal.getOrCreateInstance('#recurringModal');
  modal.hide();

  fetchRecurringTransactions();
};

onMounted(() => {
  fetchRecurringTransactions();
});
</script>

<template>
  <div class="card">
    <div class="row">
      <div class="col table-responsive">
        <table class="table table-hover" >
          <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Nächste Ausführung</th>
            <th scope="col">Betrag</th>
          </tr>
          </thead>
          <tbody class="table-group-divider">
          <template v-for="(recurring, i) in recurringTransactions" :key="recurring.id">
            <tr @click="selectRecurringTransaction(recurring.id)">
              <td>{{ i + 1 }}</td>
              <td>{{ dateToString(recurring.nextExecution) }}</td>
              <td :class="{'positive-value': recurring.isPositive && displayValues, 'negative-value': !recurring.isPositive && displayValues}">
                {{ displayValues ? moneyToString(recurring.value, currency) : '***' }}
              </td>
            </tr>
            <Transition
                :css="false"
                @enter="waitForExpand"
                @leave="waitForCollapse">
              <tr v-if="recurring.id === selectedRecurringTransaction" class="no-hover">
                <td colspan="3">
                  <DetailRecurringTransaction :recurring-transaction="recurring" :currency="currency"
                                              :display-values="displayValues"
                                              :categories="categories"
                                              @updated-recurring-transaction="updatedRecurringTransaction"
                                              @deleted-recurring-transaction="updatedRecurringTransaction"/>
                </td>
              </tr>
            </Transition>
          </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div class="d-flex justify-content-center pt-2 pe-2">
    <button class="btn btn-primary" @click="showModal">
      <i class="fa-solid fa-plus"></i>&nbsp;Neu
    </button>
    <RecurringTransactionModal :categories="categories" @submit-recurring-transaction="hideModal"/>
  </div>
</template>

<style scoped>
.positive-value {
  font-weight: bold;
  color: #008000 !important;
}

.negative-value {
  font-weight: bold;
  color: #c20000 !important;
}

.table-hover > tbody > tr.no-hover:hover > td,
.no-hover > td {
  --bs-table-bg-state: --var(--bs-table-bg-dark);
}
</style>