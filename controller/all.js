const Advertise = require("../models/advertise");
const Announce = require("../models/announce");
const Barter = require("../models/barter");
const Collaboration = require("../models/collaboration");
const User = require("../models/user");
const { sendMessageToUser } = require("../src/core/bot");
const sendMessagesToUsers = require("../utils/sendMessageSorting");
const { textGetWithLanguage } = require("../utils/text");

const WEB_APP = process.env.WEB_APP


const promotions = {
    "users": User,
    "advertise": Advertise,
    "announce": Announce,
    "barter": Barter,
    "collaboration": Collaboration,
}



const publishPromotion = async (req, res) => {
    let promotionKey = req.params.promotion
    let id = req.params.id
    console.log(promotionKey, id);
    try {



        const promotion = await promotions[promotionKey](req.body);
        let users = await User.find({
            status: true,
            userId: { $ne: id }  // userId qiymati id ga teng bo‘lmagan hujjatlarni qidirish
        });
        console.log(users, " => Users");

        let results = await sendMessagesToUsers(users)
        console.log(results);
        res.status(201).send({ succes: true, message: "Barchaga jo'natildi" });
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
};



const createPromotion = async (req, res) => {

    let promotionKey = req.params.promotion
    console.log(req.body);

    try {
        let userId;
        console.log(req.body);

        // Ikkinchi added
        if (req.body.owner) {
            // Foydalanuvchini qidiring
            let user = await User.findOne({ userId: req.body.owner, status: true, active: true });
            if (!user) {
                return res.status(404).send({ message: 'Foydalanuvchi topilmadi' });
            }
            userId = user._id;
        } else {
            // Agar owner bo‘lmasa, admin_owner ni olish
            userId = req.body.admin_owner;
        }

        // agree maydonidagi qiymatlarni tekshirish va to'g'ri formatda ekanligini ta'minlash
        let agree = [];
        if (req.body.agree && Array.isArray(req.body.agree)) {
            agree = req.body.agree.filter(id => mongoose.Types.ObjectId.isValid(id));
        }

        // Promotion maydonini tekshirish
        let promotion = [];
        if (req.body.promotion && Array.isArray(req.body.promotion)) {
            promotion = req.body.promotion.filter(promo => typeof promo === 'string' && promo.trim() !== '');
        }

        // Collaboration yaratish
        const collaboration = promotions[promotionKey]({
            ...req.body,
            owner: userId,
            agree,
            promotion  // Promotion maydonini qo‘shish
        });

        console.log(collaboration);

        // Saqlash
        await collaboration.save();

        // Promotion yaratish
        let users = await User.find({
            status: true,
            active: true,
            "web_app.category": { $in: collaboration.category },
            // _id: { $ne: collaboration.owner } // Agar kerak bo'lsa, ma'lum bir hujjatni chiqarib tashlash uchun
        })
        console.log(users);

        // 
        res.status(201).send(collaboration);
        users.forEach(user => {
            try {
                sendMessageToUser(textGetWithLanguage(user, "posted_for_you"), user.userId, {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: textGetWithLanguage(user, "view"), web_app: { url: `${WEB_APP}/user/${user.userId}/promotion/${promotionKey}/view/${collaboration._id}` } }],
                        ],
                        resize: true
                    }
                })
            } catch (error) {
                console.log(error);

            }
        })
        // Xabar yuborish

    } catch (error) {
        console.log(error);
        res.status(400).send({ error: 'Ishlatishda xatolik yuz berdi', details: error.message });
    }
};




const getWithCategoryPromotion = async (req, res) => {
    let promotionKey = req.params.promotion
    let category = req.params.category
    let id = req.params.id
    try {
        let user = await User.findOne({ userId: id })



        const promotion = await promotions[promotionKey].find({ category: category });


        console.log(promotion);
        if (promotion.length) {
            return res.status(200).send(promotion)
        }

        return res.status(400).send({ message: `${promotionKey} not found for you` })

    } catch (error) {
        return res.status(400).send(error);

    }
}



const setAgree = async (req, res) => {
    let userId = req.params.id;
    let promotion = req.params.promotion;
    let promotionId = req.params.promotionId;
    try {
        console.log(promotionId);
        console.log(promotion);


        let user = await User.findOne({ userId, active: true, status: true });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        console.log(promotionId);
        // let promotionResponse = await promotions[promotion].findById(
        //     promotionId,

        // )
        const promotionDoc = await promotions[promotion].findById(promotionId).populate("owner");
        console.log(promotionDoc);

        if (!promotionDoc) {
            return res.status(404).json({ message: 'Promotion topilmadi' });
        }

        if (promotionDoc?.agree?.length) {

            if (!promotionDoc.agree.includes(user._id)) {
                promotionDoc.agree.push(user._id);
                await promotionDoc.save();
                return res.status(200).json({ message: "Foydalanuvchi muvaffaqiyatli qo'shildi", promotionDoc });
            } else {
                return res.status(402).json({ message: 'Foydalanuvci oldindan mavjud' });

            }
        }
        promotionDoc.agree = []
        promotionDoc.agree.push(user._id);
        console.log(promotion);

        await promotionDoc.save();
        sendMessageToUser(`${textGetWithLanguage(promotionDoc.owner, "agreement")}\n${textGetWithLanguage(promotionDoc.owner, promotion)}\n${textGetWithLanguage(promotionDoc.owner, "named")}:${promotionDoc.title}\n${textGetWithLanguage(promotionDoc.owner, "whoIs")} ${user.phoneNumber}`, promotionDoc.owner.userId)
        res.status(200).json({ message: 'Foydalanuvchi muvaffaqiyatli qo‘shildi', promotionDoc })
        // Agar user ID oldindan mavjud bo'lmasa, qo'shing



    } catch (error) {
        console.error(error);
        res.status(400).send({ message: "Error fetching promotions", error });
    }
};


const getMyPromotions = async (req, res) => {
    console.log(req.query);

    const { userId, promotion } = req.query
    console.log(promotions[promotion]);

    try {
        let user = await User.findOne({ userId: userId, active: true })
        console.log(user);
        const collaborations = await promotions[promotion].find({ owner: user._id }).populate("owner").populate("agree");
        console.log(collaborations);
        res.status(200).send(collaborations);
    } catch (error) {
        res.status(500).send(error);
    }
};




const removeUserFromPromotionAgree = async (req, res) => {
    const { id, promotionId, promotion } = req.params;

    try {
        // Foydalanuvchini toping

        console.log(id);
        // Ma'lumotni yangilang va user IDni agree maydonidan olib tashlang
        const promotionDoc = await promotions[promotion].findByIdAndUpdate(
            promotionId,
            { $pull: { agree: id } },
            { new: true }  // Bu yangilangan hujjatni qaytaradi
        );

        if (!promotionDoc) {
            return res.status(404).json({ message: 'Promotion topilmadi' });
        }

        res.status(200).json({ message: 'Foydalanuvchi muvaffaqiyatli olib tashlandi', promotionDoc });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Xatolik yuz berdi' });
    }
};

const setSelect = async (req, res) => {
    let userId = req.params.id;
    let promotion = req.params.promotion;
    let promotionId = req.params.promotionId;
    try {
        let user = await User.findOne({ userId, active: true });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        let promotionFind = await await promotions[promotion].findById(
            promotionId,
        )
        if (promotionFind.owner === user._id) {

            let promotionResponse = await await promotions[promotion].findByIdAndUpdate(
                promotionId,
                { $push: { agree: user._id } },
                { new: true }
            )

            if (!promotionResponse) {
                return res.status(404).send({ message: 'Promotion topilmadi' });
            }

            res.status(200).send({ message: 'Foydalanuvchi muvaffaqiyatli qo‘shildi', promotionResponse });
        } else {

            return res.status(404).send({ message: `Ushbu promotionni o'zgartira olmaysiz` });

        }



    } catch (error) {
        console.error(error);
        res.status(400).send({ message: "Error fetching promotions", error });
    }
};



module.exports = { publishPromotion, getWithCategoryPromotion, setAgree, setSelect, removeUserFromPromotionAgree, promotions, createPromotion, getMyPromotions }