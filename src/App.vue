<script setup lang="ts">
import {onMounted, ref} from "vue";
import type {Ref} from "vue";
import BalanceComponent from '@/components/BalanceComponent.vue';
import FilterComponent from "@/components/FilterComponent.vue";
import TransactionsComponent from "@/components/TransactionsComponent.vue";
import DepositTransaction from "@/components/DepositTransaction.vue";
import {Modal} from "bootstrap";
import WithdrawalTransaction from "@/components/WithdrawalTransaction.vue";


const now = new Date();
let effectiveSpan = ref({
  from: new Date(now.getFullYear(), now.getMonth()),
  to: new Date(now.getFullYear(), now.getMonth() + 1),
});
let categories: Ref<[{id: number, name: string}]> = ref([{id: 0, name: ''}]);
let showPending = ref(false);

const requestDeposit = () => {
  // TODO: not a fan at all of this
  const modal = Modal.getOrCreateInstance('#depositModal');
  modal.show();
};

const requestWithdrawal = () => {
  // TODO: not a fan at all of this
  const modal = Modal.getOrCreateInstance('#withdrawModal');
  modal.show();
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

const setShowPending = (show: boolean) => {
  showPending.value = show;
}

const forceReload = () => {
  effectiveSpan.value = {
    from: new Date(effectiveSpan.value.from),
    to: new Date(effectiveSpan.value.to)
  };
};

const fetchCategories = async () => {
  const res = await fetch('/api/categories');
  categories.value = await res.json();
  // categories.value = JSON.parse("[{\"id\":1,\"name\":\"Nicht spezifiziert\"},{\"id\":2,\"name\":\"Einkauf\"},{\"id\":3,\"name\":\"Kassenabschöpfung\"},{\"id\":4,\"name\":\"Lohnzahlung\"}]");
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
            <BalanceComponent :effective-span="effectiveSpan" :show-pending="showPending"
                     @request-deposit="requestDeposit" @request-withdrawal="requestWithdrawal"/>
          </div>
        </div>
      <div class="row mt-2">
        <div class="col">
          <FilterComponent :effective-span="effectiveSpan" @next-month="nextMonth" @prev-month="prevMonth"
                  :show-pending="showPending" @set-show-pending="setShowPending"/>
        </div>
      </div>
    </header>

    <main>
      <div class="row mt-2">
        <div class="col">
          <TransactionsComponent :effective-span="effectiveSpan" :show-pending="showPending"/>
        </div>
      </div>
    </main>
  </div>

  <DepositTransaction :categories="categories" @submit-deposit="forceReload"/>
  <WithdrawalTransaction :categories="categories" @submit-withdrawal="forceReload"/>
</template>

<style scoped></style>
