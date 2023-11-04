import type {Ref} from "vue";
import {ref} from "vue";
import {Toast} from "bootstrap";

export enum ToastColor {
    Info,
    Warning,
    Danger,
}

export interface CantropeeToast {
    id: number,
    body: string,
    color: ToastColor,
}

let toastCounter = 0;
export const toasts: Ref<CantropeeToast[]> = ref([]);

export const toast = (body: string, color: ToastColor = ToastColor.Info) => {
    toasts.value.push({
        id: toastCounter,
        body: body,
        color: color,
    });
    toastCounter += 1;
};

export const removeToast = (id: number) => {
    toasts.value = toasts.value.filter(t => t.id !== id);
};
