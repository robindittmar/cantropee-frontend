<script setup lang="ts">
import {onMounted} from "vue";
import {Toast} from "bootstrap";
import type {CantropeeToast} from "@/toaster";
import {removeToast, ToastColor} from "@/toaster";

const props = defineProps<{
  toast: CantropeeToast
}>();

onMounted(() => {
  const el = document.querySelector(`#toast-${props.toast.id}`);

  if (el) {
    el.addEventListener('hidden.bs.toast', () => {
      removeToast(props.toast.id);
    });

    const t = Toast.getOrCreateInstance(el);
    t.show();
  }
});
</script>

<template>
  <div :id="'toast-' + toast.id" class="toast" role="alert" aria-live="assertive" aria-atomic="true"
       :class="{'text-bg-primary': toast.color === ToastColor.Info}">
    <div class="toast-header">
      <strong class="me-auto">{{ toast.title }}</strong>
      <small>{{ toast.subtitle }}</small>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body">
      {{ toast.body }}
    </div>
  </div>
</template>

<style scoped>

</style>