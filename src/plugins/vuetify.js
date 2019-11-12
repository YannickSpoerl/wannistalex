import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import '@fortawesome/fontawesome-free/css/all.css'

Vue.use(Vuetify);

export default new Vuetify({
    iconfont: 'fa',
    theme: {
        themes: {
            light: {
                primary: '#009587'
            }
        }
    }
});
