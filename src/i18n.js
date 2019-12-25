import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n);

const getNavigatorLanguage = () => {
    if (navigator.languages && navigator.languages.length) {
        return navigator.languages[0];
    } else {
        return navigator.userLanguage || navigator.language || navigator.browserLanguage || 'en';
    }
};

function loadLocaleMessages () {
    const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i);
    const messages = {};
    locales.keys().forEach(key => {
        const matched = key.match(/([A-Za-z0-9-_]+)\./i);
        if (matched && matched.length > 1) {
            const locale = matched[1];
            messages[locale] = locales(key);
        }
    });
    return messages;
}

const userLanguage = getNavigatorLanguage().slice(0, 2);

export default new VueI18n({
    locale: userLanguage,
    fallbackLocale: 'en',
    messages: loadLocaleMessages()
})