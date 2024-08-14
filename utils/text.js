let textGetWithLanguage = (user, key) => {
    let pathMessage = require(`../public/locales/ru/translation.json`)
    return pathMessage[key]
}


module.exports = { textGetWithLanguage }