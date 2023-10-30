<script setup lang="ts">
import type {Ref} from "vue";
import {onMounted, ref} from "vue";
import {dateToString, moneyToString} from "../convert";
import type {Category} from "@/category";
import type {RecurringTransaction} from "@/recurring-transaction";

const props = defineProps<{
  currency: string,
  displayValues: boolean,
  categories: Category[],
}>();

const emit = defineEmits(['updated-recurring-transaction']);

let recurringTransactions: Ref<RecurringTransaction[]> = ref([]);

const fetchRecurringTransactions = async () => {
  const res = await fetch('/api/recurring');
  recurringTransactions.value = (await res.json()).map((r: RecurringTransaction) => {
    r.insertTimestamp = new Date(r.insertTimestamp);
    r.firstExecution = new Date(r.firstExecution);
    r.nextExecution = new Date(r.nextExecution);
    if (r.lastExecution) {
      r.lastExecution = new Date(r.lastExecution);
    }

    r.isPositive = r.value >= 0;
    return r;
  });
};

onMounted(() => {
  fetchRecurringTransactions();
});
</script>

<template>
  <div class="card">
    <div class="row">
      <div class="col table-responsive">
        <table class="table table-hover" >
          <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Nächste Ausführung</th>
            <th scope="col">Betrag</th>
          </tr>
          </thead>
          <tbody class="table-group-divider">
          <template v-for="(recurring, i) in recurringTransactions" :key="recurring.id">
            <tr>
              <td>{{ i + 1 }}</td>
              <td>{{ dateToString(recurring.nextExecution) }}</td>
              <td :class="{'positive-value': recurring.isPositive && displayValues, 'negative-value': !recurring.isPositive && displayValues}">
                {{ displayValues ? moneyToString(recurring.value, currency) : '***' }}
              </td>
            </tr>
          </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div class="d-flex justify-content-center pt-2 pe-2">
    <button class="btn btn-outline-secondary">
      <i class="fa-solid fa-plus"></i>&nbsp;Dieser Button (noch) gar nichts.
    </button>
  </div>
</template>

<style scoped>
.positive-value {
  font-weight: bold;
  color: #008000 !important;
}

.negative-value {
  font-weight: bold;
  color: #c20000 !important;
}
</style>