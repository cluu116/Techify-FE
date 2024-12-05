import {definePreset} from '@primevue/themes';
import Lara from '@primevue/themes/lara';


const myPreset = definePreset(Lara, {
    semantic: {
        primary: {
            50: '{blue.50}',
            100: '{blue.100}',
            200: '{blue.200}',
            300: '{blue.300}',
            400: '{blue.400}',
            500: '{blue.500}',
            600: '{blue.600}',
            700: '{blue.700}',
            800: '{blue.800}',
            900: '{blue.900}',
            950: '{blue.950}'
        },
        colorScheme: {
            light: {
                primary: {
                    color: '#6c7fd8',
                    contrastColor: '#ffffff',
                    hoverColor: '#6c7fd8',
                    activeColor: '#3f64e9'
                },
                highlight: {
                    background: '#6c7fd8',
                    focusBackground: '#6c7fd8',
                    color: '#ffffff',
                    focusColor: '#ffffff'
                },
            }
        }
    }
});

export default myPreset;