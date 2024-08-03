let textGetWithLanguage = (user, key) => {
    let pathMessage = require(`../public/locales/${user.language}/translation.json`)
    return pathMessage[key]
}


module.exports = { textGetWithLanguage }