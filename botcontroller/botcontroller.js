// controllers/botController.js
const { Telegraf, Markup } = require('telegraf');
const config = require('../config/config');
const User = require('../models/user');
const { updateUser, deleteUserWithId } = require('../controller/user');
const { keyboard, inlineKeyboard } = require('telegraf/markup');

const stage = require('./scenes');

const bot = new Telegraf(config.botToken);

bot.use(stage.middleware());
bot.start(async (ctx) => {

    let telegram_id = ctx.message.chat.id

    try {

        let checkingId = await User.findOne({ userId: telegram_id })
        console.log(checkingId);

        if (!checkingId) {
            let user = await User.create({ userId: telegram_id })
            console.log(user.save());
            if (user) {
                // if (!user.firstName || !user.lastName || !user.phoneNumber) {
                ctx.scene.enter('auth');
                // } else {
                    // ctx.scene.enter("start");
                // }
            }

        } else {
            ctx.reply(`Botga xush kelibsiz ${checkingId.first_name}!`, {

                reply_markup: {

                    keyboard: [
                        [
                            { text: `🛒 Obunalar` },
                            { text: `📮 To'lovlar tarixi` },
                        ],
                        [
                            { text: `⁉️ Yordam` },
                            { text: `⚙️ Sozlamalar` },
                        ],
                        [
                            { text: `🤝 Hamkorlik qilish`, },
                            { text: `Web App`, web_app: { url: "https://form.123formbuilder.com/6703110/web-hosting-registration-form" } },
                        ]
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: false
                }
            });
        }
    } catch (error) {

    }



});





bot.help((ctx) => {
    ctx.reply('Salom! Qanday yordam bera olaman?', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Rasm yuborish', callback_data: 'send_photo' }]
            ]
        }
    })
});

// Foydalanuvchi tugmani bosganda ushlash
bot.on('text', (ctx) => textRoutes(ctx));


bot.on('callback_query', async (ctx) => {
    console.log("query");
    if (ctx.callbackQuery.data === 'send_photo') {
        ctx.replyWithPhoto('https://picsum.photos/450/350', {
            caption: 'Mana sizga rasm!',

        });
    } else if (ctx.callbackQuery.data === 'delete_account') {
        let userTelegramId = ctx.chat.id

        try {
            let deleteInfo = await deleteUserWithId(userTelegramId)
            console.log(deleteInfo, "=> Tashqi");
        } catch (error) {

        }
        ctx.replyWithPhoto('https://picsum.photos/450/350', {
            caption: 'Mana sizga rasm!',

        });
    }
    ctx.answerCbQuery();
});


bot.on("contact", async (ctx) => {
    const telegramId = ctx.message.chat.id;
    const phoneNumber = ctx.message.contact.phone_number;
    try {
        let updateUserInfo = await updateUser(telegramId, "phone_number", phoneNumber)
        if (updateUserInfo) {

            ctx.reply(`Iltimos ismingizni quyidagi ko'rinishda kiriting:\nIsm: Abbos `);

        }
    } catch (error) {
        ctx.reply(`Iltimos ismingizni quyidagi ko'rinishda kiriting:\nIsm: Abbos `);

    }

})

async function textRoutes(ctx) {
    let userMessage = ctx.message.text

    // Telefon raqamini tekshirish uchun regex
    const phoneRegex = /^[+]?[0-9]{10,13}$/;
    const nameRegex = /^Ism:\s*[A-Za-zÀ-ÖØ-öø-ÿ]+$/
    const surnameRegex = /^Familiya:\s*[A-Za-zÀ-ÖØ-öø-ÿ]+$/


    let telegramUserId = ctx.message.chat.id


    if (nameRegex.test(userMessage)) {
        try {
            let name = userMessage.replace("Ism: ", "")
            let updateUserInfo = await updateUser(telegramUserId, "first_name", name)
            console.log(updateUserInfo, "=> Updates");
            if (!updateUserInfo.first_name) {
                ctx.reply("Iltimos familiyangizni quyidagi ko'rinishda kiriting:\nIsm: Abbos ");
            } else {
                ctx.reply("Iltimos familiyangizni quyidagi ko'rinishda kiriting:\nFamiliya: Makxmasoliyev ");
            }
        } catch (error) {
            ctx.reply("Ro'yxatdan o'tish muvaffaqqiyatsizlikka uchradi", {
                keyboard: [
                    [
                        { text: "Ro'yxatdan o'tish" }
                    ]
                ]
            });
        }

    }

    if (surnameRegex.test(userMessage)) {
        try {
            let surname = userMessage.replace("Familiya: ", "")
            let updateUserInfo = await updateUser(telegramUserId, "last_name", surname)

            if (updateUserInfo) {
                console.log(updateUserInfo);
                ctx.reply(`Siz muvaffaqqiyatli ro'yxatdan o'tdingiz`, {
                    reply_markup: {
                        keyboard: [[
                            { text: 'App', web_app: { url: 'https://your-domain.com/miniapp' } }
                        ]],
                        resize_keyboard: true,
                        one_time_keyboard: true
                    }
                });
            }
        } catch (error) {
            ctx.reply("Ro'yxatdan o'tish muvaffaqqiyatsizlikka uchradi", {
                keyboard: [
                    [
                        { text: "Ro'yxatdan o'tish" }
                    ]
                ]
            });
        }



    }




    switch (userMessage) {
        case "Ro'yxatdan o'tish":
            ctx.reply('Iltimos, telefon raqamingizni yuboring:', {
                reply_markup: {
                    keyboard: [
                        [
                            {
                                text: 'Telefon raqamni yuborish',
                                request_contact: true
                            }
                        ]
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            });
            break;
        case "🤝 Hamkorlik qilish":
            ctx.replyWithPhoto('https://picsum.photos/451/350', {
                caption: "Agar sizda maqsadli auditoriya va unda sotuvlar bilan ishlasangiz bizning xizmat aynan siz uchun.\n\n\nFormani to'ldiring: https://forms.gle/HHvDJfzRiS13sfMz6\nyoki\nPastdagi 🖌 Bog'lanish tugmasini tanlang",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '📎 Bog\'lanish', url: 'https://example.com' }],
                        [{ text: '🖌 Bog\'lanish', url: 'https://t.me/examplechannel' }]
                    ]
                }
            });
            break;
        case "⚙️ Sozlamalar":
            ctx.replyWithPhoto('https://picsum.photos/451/350', {
                caption: "Agar sizda maqsadli auditoriya va unda sotuvlar bilan ishlasangiz bizning xizmat aynan siz uchun.\n\n\nFormani to'ldiring: https://forms.gle/HHvDJfzRiS13sfMz6\nyoki\nPastdagi 🖌 Bog'lanish tugmasini tanlang",
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: 'Hisobni o\'chirish', callback_data: "delete_account" },
                            { text: '🖌 Bog\'lanish', url: 'https://t.me/examplechannel' }
                        ]
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true,
                    remove_keyboard: false,
                }
            });
            break;

    }
}





bot.on("")


bot.on('sticker', (ctx) => {
    const sticker = ctx.message.sticker;
    const stickerInfo = `Stiker ID: ${sticker.file_id}\nEmoji: ${sticker.emoji}`;
    ctx.reply(stickerInfo);
});

bot.command('hello', (ctx) => {
    ctx.reply('Hello World!');
});



bot.command('salom', (ctx) => {
    ctx.reply('Hello world')
})

module.exports = bot;
