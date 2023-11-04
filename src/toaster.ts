import type {Ref} from "vue";
import {ref} from "vue";

export enum ToastColor {
    Info,
    Warning,
    Danger,
}

export interface CantropeeToast {
    id: number,
    title: string,
    subtitle: string,
    body: string,
    color: ToastColor,
}

let toastCounter = 0;
export const toasts: Ref<CantropeeToast[]> = ref([]);

export const toast = (title: string, body: string) => {
    toasts.value.push({
        id: toastCounter,
        title: title,
        subtitle: 'just now',
        body: body,
        color: ToastColor.Info,
    });
    toastCounter += 1;
};

export const removeToast = (id: number) => {
    toasts.value = toasts.value.filter(t => t.id !== id);
};
