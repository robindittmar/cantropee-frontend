<script setup lang="ts">
import {watch, ref} from "vue";
import {moneyToString} from "@/core/convert";
import type {Balance} from "@/core/balance";

const props = defineProps<{
  balance: Balance,
  currency: string,
  showPending: boolean,
  displayValues: boolean,
  showTaxes: boolean,
  title: string,
}>();

defineEmits(['request-deposit', 'request-withdrawal']);


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
          <button type="button" class="btn btn-success w-100" @click="$emit('request-deposit')">
            <i class="fa-solid fa-plus"></i>&nbsp;Einzahlen
          </button>
        </div>
        <div class="col">
          <button type="button" class="btn btn-danger w-100" @click="$emit('request-withdrawal')">
            <i class="fa-solid fa-minus"></i>&nbsp;Auszahlen
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
