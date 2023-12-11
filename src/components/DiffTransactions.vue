<script setup lang="ts">
import type {TransactionDiff} from "@/core/transaction";
import {dateToString, valueToString} from "@/core/convert";
import {onMounted, onBeforeUnmount} from "vue";
import {Modal} from "bootstrap";
import {lang} from "@/core/languages";

const props = defineProps<{
  history: TransactionDiff[],
  displayValues: boolean,
  showTaxes: boolean,
}>();

const emit = defineEmits(['modal-closed']);

const diffValueToString = (v: number | undefined): string => {
  if (v === undefined) {
    return '';
  }

  if (props.displayValues) {
    return valueToString(Math.abs(v));
  } else {
    return '***';
  }
};

onMounted(() => {
  const modal = Modal.getOrCreateInstance('#diffModal');
  modal.show();

  const modalElem = document.querySelector('#diffModal');
  modalElem?.addEventListener('hidden.bs.modal', () => {
    emit('modal-closed');
  });
});

onBeforeUnmount(() => {
  const modal = Modal.getOrCreateInstance('#diffModal');
  modal.hide();
});
</script>

<template>
  <div class="modal modal-xl fade" id="diffModal" tabindex="-1" aria-labelledby="diffModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="diffModalLabel">{{ lang.history }}</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="table-responsive">
            <table class="table">
              <thead>
              <tr>
                <th scope="col">{{ lang.creationDate }}</th>
                <th scope="col">{{ lang.bookingDate }}</th>
                <th scope="col">{{ lang.transactionType }}</th>
                <th scope="col">{{ lang.value }}</th>
                <template v-if="showTaxes">
                  <th scope="col">{{ lang.value19 }}</th>
                  <th scope="col">{{ lang.vat19 }}</th>
                  <th scope="col">{{ lang.value7 }}</th>
                  <th scope="col">{{ lang.vat7 }}</th>
                </template>
                <th scope="col">{{ lang.category }}</th>
                <th scope="col">{{ lang.note }}</th>
              </tr>
              </thead>
              <tbody class="table-group-divider">
              <template v-for="(diff, idx) in history" :key="diff.insertTimestamp">
                <tr>
                  <th scope="row">
                    {{ dateToString(diff.insertTimestamp) }}
                  </th>
                  <td :class="{'text-info': idx === 0, 'text-warning': idx !== 0}">
                    {{ diff.effectiveTimestamp && dateToString(diff.effectiveTimestamp) }}
                  </td>
                  <td :class="{'text-success': !!diff.isDeposit, 'text-danger': !diff.isDeposit}">
                    {{ diff.isDeposit === undefined ? undefined : (diff.isDeposit ? lang.depositTitle : lang.withdrawalTitle) }}
                  </td>
                  <td :class="{'text-info': idx === 0, 'text-warning': idx !== 0}">
                    {{ diffValueToString(diff.value) }}
                  </td>
                  <template v-if="showTaxes">
                    <td :class="{'text-info': idx === 0, 'text-warning': idx !== 0}">
                      {{ diffValueToString(diff.value19) }}
                    </td>
                    <td :class="{'text-info': idx === 0, 'text-warning': idx !== 0}">
                      {{ diffValueToString(diff.vat19) }}
                    </td>
                    <td :class="{'text-info': idx === 0, 'text-warning': idx !== 0}">
                      {{ diffValueToString(diff.value7) }}
                    </td>
                    <td :class="{'text-info': idx === 0, 'text-warning': idx !== 0}">
                      {{ diffValueToString(diff.vat7) }}
                    </td>
                  </template>
                  <td :class="{'text-info': idx === 0, 'text-warning': idx !== 0}">
                    {{ diff.category }}
                  </td>
                  <td :class="{'text-info': idx === 0, 'text-warning': idx !== 0}">
                    {{ diff.note === undefined ? undefined : ((diff.note === null || diff.note === '') ? '/' : diff.note) }}
                  </td>
                </tr>
              </template>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>