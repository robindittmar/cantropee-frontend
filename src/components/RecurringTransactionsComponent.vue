<script setup lang="ts">
import type {Ref} from "vue";
import {onMounted, ref} from "vue";
import {dateToString, moneyToString} from "@/core/convert";
import type {Category} from "@/core/category";
import type {RecurringTransaction} from "@/core/recurring-transaction";
import RecurringTransactionModal from "@/components/RecurringTransactionModal.vue";
import DetailRecurringTransaction from "@/components/DetailRecurringTransaction.vue";
import {Modal} from "bootstrap";
import {req} from "@/core/requests";
import {lang} from "@/core/languages";

const props = defineProps<{
  currency: string,
  displayValues: boolean,
  showTaxes: boolean,
  categories: Category[],
}>();

const emit = defineEmits(['updated-recurring-transaction']);

const initialLoadDone = ref(false);
let recurringTransactions: Ref<RecurringTransaction[]> = ref([]);
let selectedRecurringTransaction: Ref<string | null> = ref(null);
let animating = false;
let openCollapse: Element | null;

const fetchRecurringTransactions = async () => {
  const res = await req('/api/recurring');

  if (res.ok) {
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
    initialLoadDone.value = true;
  }
};

const selectRecurringTransaction = (transactionId: string) => {
  if (animating) {
    return;
  }

  let current = selectedRecurringTransaction.value;

  if (current === transactionId) {
    current = null;
  } else {
    current = transactionId;
  }

  selectedRecurringTransaction.value = current;
};

const waitForExpand = (el: any, done: any) => {
  let tid = selectedRecurringTransaction.value;
  animating = true;

  openCollapse = document.querySelector(`#detailCollapse-${tid}`);
  if (openCollapse) {
    openCollapse.addEventListener('shown.bs.collapse', () => {
      animating = false;
      done();
    });
  } else {
    animating = false;
    done();
  }
};

const waitForCollapse = (el: any, done: any) => {
  animating = true;

  if (openCollapse) {
    openCollapse.addEventListener('hidden.bs.collapse', () => {
      animating = false;
      done();
      openCollapse = null;
    });
  } else {
    animating = false;
    done();
  }
};

const showModal = () => {
  const modal = Modal.getOrCreateInstance('#recurringModal');
  modal.show();
};

const hideModal = () => {
  const modal = Modal.getOrCreateInstance('#recurringModal');
  modal.hide();

  fetchRecurringTransactions();
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
            <th scope="col">{{ lang.nextExecution }}</th>
            <th scope="col">{{ lang.value }}</th>
          </tr>
          </thead>
          <tbody class="table-group-divider">
          <template v-if="initialLoadDone">
            <template v-if="recurringTransactions.length > 0">
              <template v-for="(recurring, i) in recurringTransactions" :key="recurring.id">
                <tr @click="selectRecurringTransaction(recurring.id)">
                  <td :class="{'text-muted': !recurring.active}">{{ i + 1 }}</td>
                  <td :class="{'text-muted': !recurring.active}">{{ dateToString(recurring.nextExecution) }}</td>
                  <td :class="{'text-muted': !recurring.active, 'positive-value': recurring.isPositive && displayValues && recurring.active, 'negative-value': !recurring.isPositive && displayValues && recurring.active}">
                    {{ displayValues ? moneyToString(recurring.value, currency) : '***' }}
                  </td>
                </tr>
                <Transition
                    :css="false"
                    @enter="waitForExpand"
                    @leave="waitForCollapse">
                  <tr v-if="recurring.id === selectedRecurringTransaction" class="no-hover">
                    <td colspan="3">
                      <DetailRecurringTransaction :recurring-transaction="recurring" :currency="currency"
                                                  :display-values="displayValues" :show-taxes="showTaxes"
                                                  :categories="categories"
                                                  @updated-recurring-transaction="fetchRecurringTransactions"
                                                  @deleted-recurring-transaction="fetchRecurringTransactions"/>
                    </td>
                  </tr>
                </Transition>
              </template>
            </template>
            <template v-else>
              <tr>
                <td colspan="3">
                  <div class="d-flex justify-content-center">
<!--                    <i class="fa-solid fa-ghost"></i>-->
                    <img id="brand-image" alt="No Content" src="/public/img/no-content.png" class="rounded mx-auto d-block" />
                  </div>
                </td>
              </tr>
            </template>
          </template>
          <template v-else>
            <tr>
              <td colspan="3">
                <div class="d-flex justify-content-center mt-4">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
              </td>
            </tr>
          </template>
          </tbody>
        </table>
      </div>
    </div>
    <div class="d-flex justify-content-center pt-2 pb-2">
      <button class="btn btn-success" @click="showModal">
        <i class="fa-solid fa-plus"></i>&nbsp;{{ lang.new }}
      </button>
      <RecurringTransactionModal :categories="categories" :show-taxes="showTaxes" :currency="currency"
                                 @submit-recurring-transaction="hideModal"/>
    </div>
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

.table-hover > tbody > tr.no-hover:hover > td,
.no-hover > td {
  --bs-table-bg-state: --var(--bs-table-bg-dark);
}
</style>