const Advertise = require("../models/advertise");
const Announce = require("../models/announce");
const Barter = require("../models/barter");
const Collaboration = require("../models/collaboration");
const User = require("../models/user");
const sendMessagesToUsers = require("../utils/sendMessageSorting");

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
            'web_app.category': promotion.category
        })
        console.log(users, " => Users");

        let results = await sendMessagesToUsers(users)
        console.log(results);
        res.status(201).send({ succes: true, message: "Barchaga jo'natildi" });
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
};




const getWithCategoryPromotion = async (req, res) => {
    let promotionKey = req.params.promotion
    let id = req.params.id
    console.log(promotionKey, id);
    try {
        let user = await User.findOne({ userId: id })
        console.log(user.web_app.category);

        const promotion = await promotions[promotionKey].find({ category: user.web_app.category, status: true, owner: { $ne: user._id } });
        console.log(promotion);
        if (promotion.length) {
            return res.status(200).send(promotion)
        }

        return res.status(400).send({ message: `${promotionKey} not found for you` })

    } catch (error) {
        return res.status(400).send(error);

    }
}



const getPublishWaitingPromotion = async (req, res) => {
    let userId = req.params.id;
    try {
        let user = await User.findOne({ userId });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        let findDataPromises = Object.keys(promotions).map(async (promotion) => {
            return {
                key: promotion,
                value: await promotions[promotion].find({ owner: user._id, status: false })
            }

        });

        let findDataResults = await Promise.all(findDataPromises);


        res.status(200).send(findDataResults);
    } catch (error) {
        console.error(error);
        res.status(400).send({ message: "Error fetching promotions", error });
    }
};



module.exports = { publishPromotion, getWithCategoryPromotion, getPublishWaitingPromotion, promotions }