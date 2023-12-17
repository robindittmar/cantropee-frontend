<script setup lang="ts">
import {onMounted, onUnmounted, ref, watch} from "vue";
import type {Ref} from "vue";
import {dateToString, moneyToString} from "@/core/convert";
import type {Transaction} from "@/core/transaction";
import DetailTransaction from "@/components/DetailTransaction.vue";
import type {Category} from "@/core/category";
import type {Paginated} from "@/core/paginated";
import {lang} from "@/core/languages";

const props = defineProps<{
  currency: string,
  displayValues: boolean,
  showTaxes: boolean,
  categories: Category[],
  transactions: Paginated<Transaction>,
  transactionsPerPage: number,
}>();

const emit = defineEmits([
  'updated-transaction',
  'transactions-next-page',
  'transactions-prev-page',
  'transactions-select-page'
]);

let showNotes = ref(false);
let showCategories = ref(false);
let showVat19 = ref(false);
let showVat7 = ref(false);
let columnCount = ref(3);

let selectedTransaction: Ref<string | null> = ref(null);
let animating = false;
let openCollapse: Element | null;

let prevPageAvail = ref(false);
let nextPageAvail = ref(false);
let pagesAvailable = ref(0);
let currentPage = ref(0);


watch(() => props.transactions, () => {
  selectedTransaction.value = null;

  prevPageAvail.value = props.transactions.start !== 0;
  nextPageAvail.value = props.transactions.start + props.transactions.count < props.transactions.total;
  pagesAvailable.value = Math.round((props.transactions.total / props.transactionsPerPage) + 0.495);
  currentPage.value = Math.round(props.transactions.start / props.transactionsPerPage) + 1;
});

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
  emit('transactions-next-page');
};
const prevPage = () => {
  emit('transactions-prev-page');
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

const transformNote = (note: string): string => {
  if (note.length >= 32) {
    return note.substring(0, 29) + '...';
  }
  return note;
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

const updateWindowSize = () => {
  showNotes.value = window.innerWidth >= 768;
  showCategories.value = window.innerWidth >= 992;
  showVat19.value = props.showTaxes && window.innerWidth >= 1200;
  showVat7.value = props.showTaxes && window.innerWidth >= 1400;

  if (showNotes.value) {
    columnCount.value += 1;
  }
  if (showCategories.value) {
    columnCount.value += 1;
  }
  if (showVat19.value) {
    columnCount.value += 1;
  }
  if (showVat7.value) {
    columnCount.value += 1;
  }
};

onMounted(() => {
  updateWindowSize();
  window.addEventListener('resize', updateWindowSize);
});
onUnmounted(() => {
  window.removeEventListener('resize', updateWindowSize);
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
            <th scope="col">{{ lang.bookingDate }}</th>
            <th scope="col">{{ lang.value }}</th>
            <th v-if="showVat19" scope="col">{{ lang.vat19 }}</th>
            <th v-if="showVat7" scope="col">{{ lang.vat7 }}</th>
            <th v-if="showNotes" scope="col">{{ lang.note }}</th>
            <th v-if="showCategories" scope="col">{{ lang.category }}</th>
          </tr>
          </thead>
          <tbody class="table-group-divider">
          <template v-for="transaction in transactions.data" :key="transaction.id">
            <tr @click="selectTransaction(transaction.id)">
            <template v-if="transaction.pending">
              <th class="text-muted" scope="row">{{ transaction.rowIdx }}</th>
              <td class="text-muted">{{ dateToString(transaction.effectiveTimestamp) }}</td>
              <td class="text-muted">{{ displayValues ? moneyToString(transaction.value, currency) : '***' }}</td>
              <td v-if="showVat19" class="text-muted">{{ displayValues ? moneyToString(transaction.vat19, currency) : '***' }}</td>
              <td v-if="showVat7" class="text-muted">{{ displayValues ? moneyToString(transaction.vat7, currency) : '***' }}</td>
              <td v-if="showNotes" class="text-muted">{{ transaction.note ? transformNote(transaction.note) : '' }}</td>
              <td v-if="showCategories" class="text-muted">{{ transaction.category }}</td>
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
              <td v-if="showVat19" :class="{'positive-value': transaction.isPositive && displayValues, 'negative-value': !transaction.isPositive && displayValues}">{{ displayValues ? moneyToString(transaction.vat19, currency) : '***' }}</td>
              <td v-if="showVat7" :class="{'positive-value': transaction.isPositive && displayValues, 'negative-value': !transaction.isPositive && displayValues}">{{ displayValues ? moneyToString(transaction.vat7, currency) : '***' }}</td>
              <td v-if="showNotes">{{ transaction.note ? transformNote(transaction.note) : '' }}</td>
              <td v-if="showCategories">{{ transaction.category }}</td>
            </template>
            </tr>
            <Transition
                :css="false"
                @enter="waitForExpand"
                @leave="waitForCollapse">
            <tr v-if="transaction.id === selectedTransaction" class="no-hover">
              <td :colspan="columnCount">
                <DetailTransaction :transaction="transaction" :currency="currency" :display-values="displayValues"
                                   :categories="categories" :show-taxes="showTaxes"
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
      <nav aria-label="Pagination">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{'disabled': !prevPageAvail}">
            <button class="page-link" @click="prevPage">&laquo;</button>
          </li>
          <li v-for="i in pagesAvailable" :key="i">
            <button class="page-link" :class="{'active': currentPage === i}" @click="$emit('transactions-select-page', i)">{{ i }}</button>
          </li>
          <li class="page-item" :class="{'disabled': !nextPageAvail}">
            <button class="page-link" @click="nextPage">&raquo;</button>
          </li>
        </ul>
      </nav>
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