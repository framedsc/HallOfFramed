import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        dark: true,
        themes: {
            light: {
                primary: '#424242',
                secondary: '#673ab7',
                accent: '#e91e63',
                error: '#f44336',
                warning: '#ff9800',
                info: '#03a9f4',
                success: '#4caf50'
            },
            dark: {
                primary: '#424242',
                secondary: '#673ab7',
                accent: '#e91e63',
                error: '#f44336',
                warning: '#ff9800',
                info: '#03a9f4',
                success: '#4caf50'
            }
        },
    },
});
