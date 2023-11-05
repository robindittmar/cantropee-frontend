<script setup lang="ts">
import {onMounted} from "vue";
import {Chart} from "chart.js/auto";

onMounted(() => {
  const ctx = document.querySelector('#myChart') as HTMLCanvasElement;
  if (ctx) {
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Januar', 'Feburar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'Septempber', 'Oktober', 'November', 'Dezember'],
        datasets: [{
          label: 'Bilanz',
          data: [1000.00, 300.00, -430.00, 60.0, -348, 1000, 3800, 5800, -400, 1300, 1200, -1500],
          borderWidth: 1,
        }],
      },
    });
  }
});
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <canvas id="myChart"></canvas>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>