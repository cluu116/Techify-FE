import '@/assets/tailwind.css'
import {createApp} from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import MyPreset from "@/presets/MyPreset.js";
import ToastService from 'primevue/toastservice';
import {DialogService, Ripple, StyleClass, Toast} from "primevue";
import 'primeicons/primeicons.css'
import router from "@/router/router.js";
import {ConfirmationService} from "primevue";

const app = createApp(App);
app.directive('ripple', Ripple);
app.directive('styleclass', StyleClass);
app.use(ConfirmationService);
app.use(DialogService);
app.use(router);
app.use(ToastService);
app.component('Toast', Toast);
app.use(PrimeVue, {
    theme: {
        preset: MyPreset,
        options: {
            darkModeSelector: false,
            ripple: true,
        }
    }
});
app.mount('#app')