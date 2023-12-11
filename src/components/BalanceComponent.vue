<script setup lang="ts">
import {watch, ref} from "vue";
import {moneyToString} from "@/core/convert";
import type {Balance} from "@/core/balance";
import {lang} from "@/core/languages";
import DepositTransaction from "@/components/DepositTransaction.vue";
import WithdrawalTransaction from "@/components/WithdrawalTransaction.vue";
import type {Category} from "@/core/category";
import {Modal} from "bootstrap";

const props = defineProps<{
  balance: Balance,
  categories: Category[],
  currency: string,
  showPending: boolean,
  displayValues: boolean,
  showTaxes: boolean,
  title: string,
}>();

const emit = defineEmits(['transaction-booked']);


const recalculateBalance = () => {
  if (props.showPending) {
    totalBalance.value = props.balance.total + props.balance.pending.total;
    totalVat.value = props.balance.vat.total + props.balance.pending.vat.total;
  } else {
    totalBalance.value = props.balance.total;
    totalVat.value = props.balance.vat.total;
  }
};

let totalBalance = ref(0.0);
let totalVat = ref(0.0);

watch(() => props.balance, () => {
  recalculateBalance();
})

watch(() => props.showPending, () => {
  recalculateBalance();
});

const requestWithdrawal = () => {
  const modal = Modal.getOrCreateInstance('#withdrawModal');
  modal.show();
};

const requestDeposit = () => {
  const modal = Modal.getOrCreateInstance('#depositModal');
  modal.show();
};

const hideDeposit = () => {
  const modal = Modal.getOrCreateInstance('#depositModal');
  modal.hide();

  emit('transaction-booked');
};

const hideWithdrawal = () => {
  const modal = Modal.getOrCreateInstance('#withdrawModal');
  modal.hide();

  emit('transaction-booked');
};
</script>

<template>
  <div class="card">
    <img id="brand-image" alt="cat-jam" src="/public/img/frog.svg" class="rounded mx-auto d-block" />
    <div class="card-body">
      <div class="row">
        <h5 class="card-title text-center">{{ title }}</h5>
        <h1
          class="card-title text-center"
          :class="{ 'text-success': totalBalance >= 0 && displayValues, 'text-danger': totalBalance < 0 && displayValues }"
        >
          {{ displayValues ? moneyToString(totalBalance, currency) : '***' }}
        </h1>
        <span v-if="showTaxes" class="text-center text-sm-center">{{ displayValues ? moneyToString(totalVat, currency) : '***' }}</span>
      </div>
      <div class="row">
        <div class="col">
          <button type="button" class="btn btn-success w-100" @click="requestDeposit">
            <i class="fa-solid fa-plus"></i>&nbsp;{{ lang.deposit }}
          </button>
        </div>
        <div class="col">
          <button type="button" class="btn btn-danger w-100" @click="requestWithdrawal">
            <i class="fa-solid fa-minus"></i>&nbsp;{{ lang.withdraw }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <DepositTransaction :categories="categories" :currency="currency"
                      @submit-deposit="hideDeposit"/>
  <WithdrawalTransaction :categories="categories" :currency="currency" :show-taxes="showTaxes"
                         @submit-withdrawal="hideWithdrawal"/>
</template>

<style scoped></style>
