<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import type {Ref} from "vue";
import type {User} from "@/core/user";
import BalanceComponent from '@/components/BalanceComponent.vue';
import FilterComponent from "@/components/FilterComponent.vue";
import TransactionsComponent from "@/components/TransactionsComponent.vue";
import DepositTransaction from "@/components/DepositTransaction.vue";
import WithdrawalTransaction from "@/components/WithdrawalTransaction.vue";
import {Modal} from "bootstrap";
import type {Category} from "@/core/category";
import {dateToURI} from "@/core/convert";
import {req} from "@/core/requests";
import type {Transaction} from "@/core/transaction";
import type {Paginated} from "@/core/paginated";
import type {Balance} from "@/core/balance";

const props = defineProps<{
  user: User;
  categories: Category[];
}>();

const now = new Date();
let effectiveSpan = ref({
  from: new Date(now.getFullYear(), now.getMonth()),
  to: new Date(now.getFullYear(), now.getMonth() + 1),
});

let showPending = ref(props.user.settings.defaultPreviewPending);
let displayValues = ref(!props.user.settings.privateMode);
let selectedCategory = ref(0);
let notesFilter = ref('');
let sortingOrder = ref(props.user.settings.defaultSortingOrderAsc ? 'asc' : 'desc');

watch(() => props.user, () => {
  showPending.value = props.user.settings.defaultPreviewPending;
  displayValues.value = !props.user.settings.privateMode;
  sortingOrder.value = props.user.settings.defaultSortingOrderAsc ? 'asc' : 'desc';
});


let balanceRef: Ref<Balance> = ref({
  total: 0,
  vat: {
    total: 0,
    vat19: 0,
    vat7: 0,
  },
  pending: {
    total: 0,
    vat: {
      total: 0,
      vat19: 0,
      vat7: 0,
    },
  },
});

const navigationStep = 20;
let transactionsRef: Ref<Paginated<Transaction>> = ref({
  start: 0,
  count: navigationStep,
  total: -1,
  data: [],
});

let abortFetch: AbortController | null = null;
const fetchTransactions = async () => {
  if (abortFetch) {
    abortFetch.abort();
  }

  // let uri = `/api/transactions?from=${dateToURI(effectiveSpan.value.from)}&to=${dateToURI(effectiveSpan.value.to)}&pending=${showPending.value}&start=${transactionsRef.value.start}&count=${navigationStep}&order=${sortingOrder.value}`;
  let uri = `/api/transactions?pending=${showPending.value}&start=${transactionsRef.value.start}&count=${navigationStep}&order=${sortingOrder.value}`;
  if (selectedCategory.value > 0) {
    uri += `&category=${selectedCategory.value}`;
  }
  if (notesFilter.value.length > 0) {
    uri += `&note=${notesFilter.value}`;
  }

  abortFetch = new AbortController();
  const res = await req(uri, {signal: abortFetch.signal});
  let {balance, transactions} = await res.json();

  abortFetch = null;

  transactions.data = transactions.data.map((t: Transaction) => {
    t.insertTimestamp = new Date(t.insertTimestamp);
    t.effectiveTimestamp = new Date(t.effectiveTimestamp);
    t.isPositive = t.value >= 0;
    return t;
  });

  transactionsRef.value = transactions;
  balanceRef.value = balance;
};

const moveEffectiveSpan = (monthOffset: number) => {
  let newFrom = new Date(effectiveSpan.value.from);
  let newTo = new Date(effectiveSpan.value.to);
  newFrom.setMonth(newFrom.getMonth() + monthOffset);
  newTo.setMonth(newTo.getMonth() + monthOffset);

  effectiveSpan.value = {
    from: newFrom,
    to: newTo,
  };

  fetchTransactions();
};

const nextMonth = () => moveEffectiveSpan(1);
const prevMonth = () => moveEffectiveSpan(-1);

const nextPage = () => {
  transactionsRef.value.start += navigationStep;
  fetchTransactions();
};
const prevPage = () => {
  transactionsRef.value.start -= navigationStep;
  fetchTransactions();
};

const selectPage = (page: number) => {
  transactionsRef.value.start = (page - 1) * navigationStep;
  fetchTransactions();
};

const toggleShowPending = () => {
  showPending.value = !showPending.value;
  fetchTransactions();
};

const setCategory = (categoryId: number) => {
  transactionsRef.value.start = 0;
  selectedCategory.value = categoryId;
  fetchTransactions();
};

let noteTimoutId: number | null = null;
const setNotes = (note: string) => {
  transactionsRef.value.start = 0;
  notesFilter.value = note;
  if (noteTimoutId) {
    clearTimeout(noteTimoutId);
  }

  noteTimoutId = setTimeout(async () => {
    await fetchTransactions();
    noteTimoutId = null;
  }, 500);
}

const toggleSortingOrder = () => {
  sortingOrder.value = sortingOrder.value === 'asc' ? 'desc' : 'asc';
  fetchTransactions();
};

onMounted(() => {
  fetchTransactions();
});
</script>

<template>
  <div class="container">
    <header>
      <div class="row mt-2">
        <div class="col">
          <BalanceComponent :balance="balanceRef" :currency="user.currentOrganization?.currency ?? 'EUR'"
                            :categories="categories"
                            :show-pending="showPending" :display-values="displayValues"
                            :title="user.currentOrganization?.name ?? 'cantropee'"
                            :show-taxes="user.currentOrganization?.usesTaxes ?? false"
                            @transaction-booked="fetchTransactions"/>
        </div>
      </div>
      <div class="row mt-2">
        <div class="col">
          <FilterComponent :effective-span="effectiveSpan" @next-month="nextMonth" @prev-month="prevMonth"
                           :show-pending="showPending" @toggle-show-pending="toggleShowPending"
                           :categories="categories" @set-category="setCategory"
                           :sorting-order="sortingOrder" @toggle-sorting-order="toggleSortingOrder"
                           @set-notes="setNotes"/>
        </div>
      </div>
    </header>

    <main>
      <div class="row mt-2">
        <div class="col">
          <TransactionsComponent :transactions="transactionsRef" :currency="user.currentOrganization?.currency ?? 'EUR'"
                                 :display-values="displayValues" :categories="categories"
                                 :selected-category="selectedCategory"
                                 :show-taxes="user.currentOrganization?.usesTaxes ?? false"
                                 :transactions-per-page="navigationStep"
                                 @updated-transaction="fetchTransactions"
                                 @transactions-next-page="nextPage"
                                 @transactions-prev-page="prevPage"
                                 @transactions-select-page="selectPage"/>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped></style>
