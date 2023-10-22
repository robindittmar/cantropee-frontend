<script setup lang="ts">
import {onMounted, ref} from "vue";
import type {Ref} from "vue";
import type {Transaction} from "@/transaction";
import BalanceComponent from '@/components/BalanceComponent.vue';
import FilterComponent from "@/components/FilterComponent.vue";
import TransactionsComponent from "@/components/TransactionsComponent.vue";
import DepositTransaction from "@/components/DepositTransaction.vue";
import WithdrawalTransaction from "@/components/WithdrawalTransaction.vue";
import DetailTransaction from "@/components/DetailTransaction.vue";
import {Modal} from "bootstrap";


const now = new Date();
let effectiveSpan = ref({
  from: new Date(now.getFullYear(), now.getMonth()),
  to: new Date(now.getFullYear(), now.getMonth() + 1),
});
let categories: Ref<[{id: number, name: string}]> = ref([{id: 0, name: ''}]);
let showPending = ref(false);
let displayValues = ref(false);
let sortingOrder = ref('desc');

const requestDeposit = () => {
  // TODO: not a fan at all of this
  const modal = Modal.getOrCreateInstance('#depositModal');
  modal.show();
};

const hideDeposit = () => {
  const modal = Modal.getOrCreateInstance('#depositModal');
  modal.hide();

  forceReload();
};

const requestWithdrawal = () => {
  // TODO: not a fan at all of this
  const modal = Modal.getOrCreateInstance('#withdrawModal');
  modal.show();
};

const hideWithdrawal = () => {
  const modal = Modal.getOrCreateInstance('#withdrawModal');
  modal.hide();

  forceReload();
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
};

const nextMonth = () => moveEffectiveSpan(1);
const prevMonth = () => moveEffectiveSpan(-1);

const toggleShowPending = () => {
  showPending.value = !showPending.value;
};

const toggleDisplayValues = () => {
  displayValues.value = !displayValues.value;
};

const toggleSortingOrder = () => {
  sortingOrder.value = sortingOrder.value === 'asc' ? 'desc' : 'asc';
};

const forceReload = () => {
  effectiveSpan.value = {
    from: new Date(effectiveSpan.value.from),
    to: new Date(effectiveSpan.value.to)
  };
};

const fetchCategories = async () => {
  const res = await fetch('/api/categories');
  categories.value = await res.json();
};

onMounted(() => {
  fetchCategories();
});
</script>

<template>
  <div class="container">
    <header>
        <div class="row mt-2">
          <div class="col">
            <BalanceComponent :effective-span="effectiveSpan" :show-pending="showPending" :display-values="displayValues"
                              @request-deposit="requestDeposit" @request-withdrawal="requestWithdrawal"/>
          </div>
        </div>
      <div class="row mt-2">
        <div class="col">
          <FilterComponent :effective-span="effectiveSpan" @next-month="nextMonth" @prev-month="prevMonth"
                           :show-pending="showPending" @toggle-show-pending="toggleShowPending"
                           :display-values="displayValues" @toggle-private-mode="toggleDisplayValues"
                           :sorting-order="sortingOrder" @toggle-sorting-order="toggleSortingOrder"/>
        </div>
      </div>
    </header>

    <main>
      <div class="row mt-2">
        <div class="col">
          <TransactionsComponent :effective-span="effectiveSpan" :show-pending="showPending" :display-values="displayValues"
                                 :sorting-order="sortingOrder"/>
        </div>
      </div>
    </main>
  </div>

  <DepositTransaction :categories="categories" @submit-deposit="hideDeposit"/>
  <WithdrawalTransaction :categories="categories" @submit-withdrawal="hideWithdrawal"/>
</template>

<style scoped></style>
