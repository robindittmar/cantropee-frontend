<script setup lang="ts">
import Balance from './components/Balance.vue';
import {ref} from "vue";

let effectiveFrom = ref(new Date(0));
let effectiveTo = ref(new Date());
</script>

<template>
  <header>
    <div class="wrapper">
      <!-- Timespan picker? -->
    </div>
  </header>

  <main>
    <Balance />
  </main>
</template>

<style scoped></style>
