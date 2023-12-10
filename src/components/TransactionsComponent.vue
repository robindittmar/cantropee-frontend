<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
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
}>();

const emit = defineEmits(['updated-transaction', 'transactions-next-page', 'transactions-prev-page']);

let showNotes = ref(false);
let showCategories = ref(false);
let showVat19 = ref(false);
let showVat7 = ref(false);
let columnCount = ref(3);

let selectedTransaction: Ref<string | null> = ref(null);
let animating = false;
let openCollapse: Element | null;

watch(() => props.transactions, () => {
  selectedTransaction.value = null;
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
              <td v-if="showVat19">{{ displayValues ? moneyToString(transaction.vat19, currency) : '***' }}</td>
              <td v-if="showVat7">{{ displayValues ? moneyToString(transaction.vat7, currency) : '***' }}</td>
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