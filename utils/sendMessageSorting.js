const { default: axios } = require("axios");
const User = require("../models/user");

const BOT_TOKEN = process.env.BOT_TOKEN
const WEB_APP_URL = process.env.WEB_APP



const sendMessageToUser = (userId, message) => {
    console.log(userId);
    return new Promise((resolve, reject) => {
        axios.post(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
            {
                chat_id: userId,
                ...message
            }
        ).then(response => {
            resolve(response)
        })
            .catch(error => {
                reject(error)
            });;

    });
};




// Function to send messages to all users
const sendMessagesToUsers = async (users, promotionKey, id) => {

    try {
        const sendPromises = users.map(user => sendMessageToUser(user.userId,
            {
                text: textGetWithLanguage(user, "posted_for_you"),
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: textGetWithLanguage(user, "view"),
                                web_app: { url: `${WEB_APP_URL}user/${user.userId}/promotion/${promotionKey}/view/${id}` }
                            }
                        ]
                    ]
                }
            }));
        const results = await Promise.all(sendPromises);
        return results
    } catch (error) {
        return error;
    }
};



module.exports = sendMessagesToUsers