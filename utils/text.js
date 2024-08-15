let textGetWithLanguage = (user, key) => {
    let language = user?.language ? user.language : "ru"
    let pathMessage = require(`../public/locales/${language}/translation.json`)
    return pathMessage[key]
}


module.exports = { textGetWithLanguage }