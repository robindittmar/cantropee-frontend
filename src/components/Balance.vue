<script setup lang="ts">
// defineProps<{}>();

import { onMounted } from 'vue';

let balance = {
  total: { amount: 0, currency: 'EUR' },
  isPositive: true,
  vat: {
    total: { amount: 0, currency: 'EUR' },
    vat19: { amount: 0, currency: 'EUR' },
    vat7: { amount: 0, currency: 'EUR' },
  },
};

const fetchBalance = async () => {
  // const res = await fetch(`/api/transactions/balance?from=${dateToURI(effectiveFrom)}&to=${dateToURI(effectiveTo)}`);
  // balance = await res.json();
  // balance.isPositive = balance.total.amount >= 0;
};

const moneyToString = (m: { amount: number; currency: string }) => {
  return m.currency + ' ' + (m.amount / 100).toFixed(2);
};
const dateToURI = (dt: Date) => {
  return encodeURI(dt.toISOString());
};

onMounted(() => {
  fetchBalance();
});
</script>

<template>
  <div class="row">
    <div class="col">
      <div class="card">
        <img id="brand-image" src="/public/img/cat-jam.gif" class="rounded mx-auto d-block" />
        <div class="card-body">
          <div class="row">
            <h5 class="card-title text-center">cantropee</h5>
            <h1
              class="card-title text-center"
              :class="{ 'text-success': balance.isPositive, 'text-danger': !balance.isPositive }"
            >
              {{ moneyToString(balance.total) }}
            </h1>
            <span class="text-center text-sm-center">{{ moneyToString(balance.vat.total) }}</span>
          </div>
          <div class="row">
            <div class="col">
              <button type="button" class="btn btn-success w-100" data-bs-toggle="modal" data-bs-target="#depositModal">
                <i class="fa-solid fa-arrow-up"></i>
              </button>
            </div>
            <div class="col">
              <button type="button" class="btn btn-danger w-100" data-bs-toggle="modal" data-bs-target="#withdrawModal">
                <i class="fa-solid fa-arrow-down"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
