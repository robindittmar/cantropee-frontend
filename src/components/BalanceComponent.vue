<script setup lang="ts">
import {watch, onMounted, ref, computed} from "vue";
import {Money, Currencies} from "ts-money";
import {dateToURI, moneyToString} from "../convert";

const props = defineProps<{
  effectiveSpan: {
    from: Date,
    to: Date,
  },
  showPending: boolean,
}>();

defineEmits(['request-deposit', 'request-withdrawal']);

let balance = {
  total: new Money(0, Currencies.EUR),
  vat: {
    total: new Money(0, Currencies.EUR),
    vat19: new Money(0, Currencies.EUR),
    vat7: new Money(0, Currencies.EUR),
  },
  pending: {
    total: new Money(0, Currencies.EUR),
    vat: {
      total: new Money(0, Currencies.EUR),
      vat19: new Money(0, Currencies.EUR),
      vat7: new Money(0, Currencies.EUR),
    },
  },
};

const recalculateBalance = () => {
  if (props.showPending) {
    totalBalance.value = balance.total.add(balance.pending.total);
    totalVat.value = balance.vat.total.add(balance.pending.vat.total);
  } else {
    totalBalance.value = balance.total;
    totalVat.value = balance.vat.total;
  }
};

let totalBalance = ref(new Money(0.0, Currencies.EUR));
let totalVat = ref(new Money(0.0, Currencies.EUR));

watch(() => props.showPending, () => {
  recalculateBalance();
});

watch(() => props.effectiveSpan, () => {
  fetchBalance();
});

const fetchBalance = async () => {
  const res = await fetch(`/api/transactions/balance?from=${dateToURI(props.effectiveSpan.from)}&to=${dateToURI(props.effectiveSpan.to)}`);
  let newBalance = await res.json();
  newBalance.total = new Money(newBalance.total.amount, newBalance.total.currency);
  newBalance.vat = {
    total: new Money(newBalance.vat.total.amount, newBalance.vat.total.currency),
    vat19: new Money(newBalance.vat.vat19.amount, newBalance.vat.vat19.currency),
    vat7: new Money(newBalance.vat.vat7.amount, newBalance.vat.vat7.currency),
  };
  newBalance.pending = {
    total: new Money(newBalance.pending.total.amount, newBalance.pending.total.currency),
    vat: {
      total: new Money(newBalance.pending.vat.total.amount, newBalance.pending.vat.total.currency),
      vat19: new Money(newBalance.pending.vat.vat19.amount, newBalance.pending.vat.vat19.currency),
      vat7: new Money(newBalance.pending.vat.vat7.amount, newBalance.pending.vat.vat7.currency),
    }
  }

  balance = newBalance;
  recalculateBalance();
};

onMounted(() => {
  fetchBalance();
});
</script>

<template>
  <div class="card">
    <img id="brand-image" src="/public/img/cat-jam.gif" class="rounded mx-auto d-block" />
    <div class="card-body">
      <div class="row">
        <h5 class="card-title text-center">cantropee</h5>
        <h1
          class="card-title text-center"
          :class="{ 'text-success': totalBalance.amount >= 0, 'text-danger': totalBalance.amount < 0 }"
        >
          {{ moneyToString(totalBalance) }}
        </h1>
        <span class="text-center text-sm-center">{{ moneyToString(totalVat) }}</span>
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
