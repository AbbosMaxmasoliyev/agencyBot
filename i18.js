// i18n.js
const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const path = require('path');

i18next.use(Backend).init({
    lng: 'uz', // Default til (o‘zbek tili)
    fallbackLng: 'uz', // Agar tarjima mavjud bo‘lmasa rus tiliga o‘tadi
    backend: {
        loadPath: path.join(__dirname, '/public/locales', '{{lng}}', '{{ns}}.json')
    },
    interpolation: {
        escapeValue: false // XSS himoya uchun, lekin React bilan foydali emas
    }
}, (err, t) => {
    if (err) return console.log('Something went wrong loading', err);
    console.log('i18next is ready...');
});

module.exports = i18next;
