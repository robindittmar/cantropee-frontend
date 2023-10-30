<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import type {Ref} from "vue";
import {dateToURI, dateToString, moneyToString} from "../convert";
import type {Transaction} from "@/transaction";
import DetailTransaction from "@/components/DetailTransaction.vue";
import type {Category} from "@/category";

const props = defineProps<{
  effectiveSpan: {
    from: Date,
    to: Date,
  },
  currency: string,
  showPending: boolean,
  displayValues: boolean,
  sortingOrder: string,
  categories: Category[],
}>();

const emit = defineEmits(['updated-transaction']);

watch(() => props.effectiveSpan, () => {
  transactions.value.start = 0;
  fetchTransactions();
});

watch(() => props.showPending, () => {
  transactions.value.start = 0;
  fetchTransactions();
});

watch(() => props.sortingOrder, () => {
  fetchTransactions();
})

const navigationStep = 10;
let transactions: any = ref({
  start: 0,
  count: navigationStep,
  total: -1,
  data: [],
});
let selectedTransaction: Ref<string | null> = ref(null);
let animating = false;
let openCollapse: Element | null;

const fetchTransactions = async () => {
  const res = await fetch(`/api/transactions?from=${dateToURI(props.effectiveSpan.from)}&to=${dateToURI(props.effectiveSpan.to)}&pending=${props.showPending}&start=${transactions.value.start}&count=${navigationStep}&order=${props.sortingOrder}`);
  let paginatedResult = await res.json();

  paginatedResult.data = paginatedResult.data.map((t: Transaction) => {
    t.insertTimestamp = new Date(t.insertTimestamp);
    t.effectiveTimestamp = new Date(t.effectiveTimestamp);
    t.isPositive = t.value >= 0;
    return t;
  });

  transactions.value = paginatedResult;
  selectedTransaction.value = null;
};

const updatedTransaction = (transactionId: string) => {
  selectedTransaction.value = transactionId;
  emit('updated-transaction', transactionId);
};

const selectTransaction = (transactionId: string) => {
  if (animating) {
    return;
  }

  let current = selectedTransaction.value;

  if (current === transactionId) {
    current = null;
  } else {
    current = transactionId;
  }

  selectedTransaction.value = current;
};

const nextPage = () => {
  transactions.value.start += navigationStep;
  fetchTransactions();
};
const prevPage = () => {
  transactions.value.start -= navigationStep;
  fetchTransactions();
};

const waitForExpand = (el: any, done: any) => {
  let tid = selectedTransaction.value;
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

onMounted(() => {
  fetchTransactions();
})
</script>

<template>
  <div class="card">
    <div class="row">
      <div class="col table-responsive">
        <table class="table table-hover" >
          <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Buchungsdatum</th>
            <th scope="col">Betrag</th>
          </tr>
          </thead>
          <tbody class="table-group-divider">
          <template v-for="transaction in transactions.data" :key="transaction.id">
            <tr @click="selectTransaction(transaction.id)">
            <template v-if="transaction.pending">
              <th class="text-muted" scope="row">{{ transaction.rowIdx }}</th>
              <td class="text-muted">{{ dateToString(transaction.effectiveTimestamp) }}</td>
              <td class="text-muted">{{ displayValues ? moneyToString(transaction.value, currency) : '***' }}</td>
            </template>
            <template v-else>
              <th :class="{'positive-value': transaction.isPositive && displayValues, 'negative-value': !transaction.isPositive && displayValues}"
                  scope="row">
                {{ transaction.rowIdx }}
              </th>
              <td>{{ dateToString(transaction.effectiveTimestamp) }}</td>
              <td :class="{'positive-value': transaction.isPositive && displayValues, 'negative-value': !transaction.isPositive && displayValues}">
                {{ displayValues ? moneyToString(transaction.value, currency) : '***' }}
              </td>
            </template>
            </tr>
            <Transition
                :css="false"
                @enter="waitForExpand"
                @leave="waitForCollapse">
            <tr v-if="transaction.id === selectedTransaction" class="no-hover">
              <td colspan="3">
                <DetailTransaction :transaction="transaction" :currency="currency" :display-values="displayValues"
                                   :categories="categories"
                                   @updated-transaction="updatedTransaction"/>
              </td>
            </tr>
            </Transition>
          </template>
          </tbody>
        </table>
      </div>
    </div>

    <template v-if="transactions.total > transactions.count">
    <div class="row ms-1 align-items-center">
      <div class="col">
        <div class="input-group mb-3 pe-3">
          <input id="tableStart" class="form-control"
                 :value="transactions.start + 1 + ' - ' + (transactions.start + transactions.count)"
                 aria-describedby="startEndDivider" type="text" disabled/>
          <span class="input-group-text" id="startEndDivider">/</span>
          <input id="tableEnd" class="form-control"
                 :value="transactions.total"
                 aria-describedby="startEndDivider"
                 type="text" disabled/>
          <button @click="prevPage" :disabled="transactions.start === 0" class="btn btn-secondary">
            <i class="fa-solid fa-arrow-left"></i>
          </button>
          <button @click="nextPage"
                  :disabled="transactions.start + transactions.count >= transactions.total"
                  class="btn btn-secondary">
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
    </template>
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