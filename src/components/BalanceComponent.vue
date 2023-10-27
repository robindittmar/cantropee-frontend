<script setup lang="ts">
import {watch, onMounted, ref} from "vue";
import {dateToURI, moneyToString} from "@/convert";

const props = defineProps<{
  effectiveSpan: {
    from: Date,
    to: Date,
  },
  currency: string,
  showPending: boolean,
  displayValues: boolean,
  title: string,
}>();

defineEmits(['request-deposit', 'request-withdrawal']);

let balance = {
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
};

const recalculateBalance = () => {
  if (props.showPending) {
    totalBalance.value = balance.total + balance.pending.total;
    totalVat.value = balance.vat.total + balance.pending.vat.total;
  } else {
    totalBalance.value = balance.total;
    totalVat.value = balance.vat.total;
  }
};

let totalBalance = ref(0.0);
let totalVat = ref(0.0);

watch(() => props.showPending, () => {
  recalculateBalance();
});

watch(() => props.effectiveSpan, () => {
  fetchBalance();
});

const fetchBalance = async () => {
  const res = await fetch(`/api/transactions/balance?from=${dateToURI(props.effectiveSpan.from)}&to=${dateToURI(props.effectiveSpan.to)}`);
  balance = await res.json();

  recalculateBalance();
};

onMounted(() => {
  fetchBalance();
});
</script>

<template>
  <div class="card">
    <img id="brand-image" alt="cat-jam" src="/public/img/cat-jam.gif" class="rounded mx-auto d-block" />
    <div class="card-body">
      <div class="row">
        <h5 class="card-title text-center">{{ title }}</h5>
        <h1
          class="card-title text-center"
          :class="{ 'text-success': totalBalance >= 0 && displayValues, 'text-danger': totalBalance < 0 && displayValues }"
        >
          {{ displayValues ? moneyToString(totalBalance, currency) : '***' }}
        </h1>
        <span class="text-center text-sm-center">{{ displayValues ? moneyToString(totalVat, currency) : '***' }}</span>
      </div>
      <div class="row">
        <div class="col">
          <button type="button" class="btn btn-success w-100" @click="$emit('request-deposit')">
            <i class="fa-solid fa-arrow-up"></i>
          </button>
        </div>
        <div class="col">
          <button type="button" class="btn btn-danger w-100" @click="$emit('request-withdrawal')">
            <i class="fa-solid fa-arrow-down"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
