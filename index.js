const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors")
const config = require('./config/config');
const botRoutes = require('./botRoutes/botRoutes');
const errorHandler = require('./middlewares/errorhandler');
const bot = require('./src/main.js');
const startBot = require("./src/utils/startBot.js")
const router = require('./routes/basic.js');
const path = require('path');
const { default: mongoose } = require('mongoose');
const { updateUser, updateUserData } = require('./controller/user.js');
const userRoutes = require('./routes/user.js');
const adminRoutes = require('./routes/admin');
const advertiseRoutes = require('./routes/advertise.js');
const announceRoutes = require('./routes/announce.js');
const barterRoutes = require('./routes/barter.js');
const collaborationRoutes = require('./routes/collaboration.js');
const { parser } = require('./middlewares/parser.js');
const { User } = require('./src/database/index.js');
const Announce = require('./models/announce.js');
const Barter = require('./models/barter.js');
const Advertise = require('./models/advertise.js');
const { publishPromotion, getWithCategoryPromotion, setAgree, setSelect, removeUserFromPromotionAgree, createPromotion, getMyPromotions } = require('./controller/all.js');
const uploadMiddleware = require('./middlewares/upload.js');
const Collaboration = require('./models/collaboration.js');
const { default: axios } = require('axios');
const app = express();
const BOT_TOKEN = process.env.BOT_TOKEN
// Set up default mongoose connection MONGO
const mongoDBURL = process.env.MONGO_URI;
mongoose.connect(mongoDBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
});

const promotions = {
    "users": User,
    "advertise": Advertise,
    "announce": Announce,
    "barter": Barter,
    "collaboration": Collaboration,
}


const allowedOrigins = [
    'https://blogerwebapp.vercel.app',
    'https://bloger-agency-adminka.vercel.app',
    "http://localhost:3000",
    "http://localhost:5173",
    'https://web.telegram.org',
    "https://d419-2605-6440-4015-8000-9e86-7d6c-9b1a-76a5.ngrok-free.app"
];

const corsOptions = {
    origin: (origin, callback) => {
        // Agar origin ro'yxatda bo'lsa yoki null (Postman yoki shunga o'xshash asboblar uchun)
        if (allowedOrigins.includes(origin) || !origin) {
            console.log(origin);
            callback(null, true);
        } else {
            console.log(origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};


app.use(cors(corsOptions));


app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', botRoutes);

app.get('/site', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// app.use(errorHandler);

// Start bot

app.get("/bot/:id", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/all", async (req, res) => {
    try {
        let users = await User.find();
        let orders = await User.find({ status: false });
        let announces = await Announce.find();
        let barters = await Barter.find();
        let advertises = await Advertise.find();
        let allData = [
            { title: "Пользователи", count: users.length, link: "users" },
            { title: "Заказы", count: orders.length, link: "orders" },
            { title: "Объявления", count: announces.length, link: "announces" },
            { title: "Бартеры", count: barters.length, link: "barters" },
            { title: "Реклама", count: advertises.length, link: "advertises" },
        ];

        res.status(200).send(allData);
    } catch (error) {
        res.status(400).send({ msg: error.message });
    }
});

app.get("/categories", async (req, res) => {
    let { promotion } = req.query


    try {
        let allCategories = [
            { "ru": "Шоу", "uz": "Шоу", "value": "show" },
            { "ru": "Звезда", "uz": "Звезда", "value": "star" },
            { "ru": "Певец", "uz": "Певец", "value": "singer" },
            { "ru": "Актер", "uz": "Актер", "value": "actor" },
            { "ru": "Музыка", "uz": "Музыка", "value": "music" },
            { "ru": "Новостной блог", "uz": "Новостной блог", "value": "news_blog" },
            { "ru": "Паблики", "uz": "Паблики", "value": "publics" },
            { "ru": "Геймер - стример", "uz": "Геймер - стример", "value": "gamer_streamer" },
            { "ru": "Авто блог", "uz": "Авто блог", "value": "auto_blog" },
            { "ru": "Фуд блогер", "uz": "Фуд блогер", "value": "food_blog" },
            { "ru": "Бизнес блогер / заработок / крипта", "uz": "Бизнес блогер / заработок / крипта", "value": "business_blog" },
            { "ru": "Лайфстайл", "uz": "Лайфстайл", "value": "lifestyle" },
            { "ru": "Семья", "uz": "Семья", "value": "family" },
            { "ru": "Здоровье / медицина", "uz": "Здоровье / медицина", "value": "health_medicine" },
            { "ru": "Спорт", "uz": "Спорт", "value": "sport" },
            { "ru": "Искусство", "uz": "Искусство", "value": "art" },
            { "ru": "Туризм", "uz": "Туризм", "value": "travel" },
            { "ru": "Fashion / мода / одежда", "uz": "Fashion / мода / одежда", "value": "fashion" },
            { "ru": "Модель", "uz": "Модель", "value": "model" },
            { "ru": "Бьюти / красота блогер", "uz": "Бьюти / красота блогер", "value": "beauty" },
            { "ru": "Вайнер / развлекательный", "uz": "Вайнер / развлекательный", "value": "vines" },
            { "ru": "Техно блогер", "uz": "Техно блогер", "value": "tech_blog" },
            { "ru": "Религия", "uz": "Религия", "value": "religion" },
            { "ru": "Мотивация", "uz": "Мотивация", "value": "motivation" },
            { "ru": "Обучение", "uz": "Обучение", "value": "education" },
            { "ru": "Недвижимость", "uz": "Недвижимость", "value": "real_estate" },
            { "ru": "Интерьер дизайнер", "uz": "Интерьер дизайнер", "value": "interior_design" },
            { "ru": "Маркетинг", "uz": "Маркетинг", "value": "marketing" }
        ]





        let counts = {}

        if (promotion) {
            if (!promotions[promotion]) {
                return res.status(400).send({ error: "Promotion not found" })
            }

            let length = await promotions[promotion].aggregate([
                {
                    $group: {
                        _id: "$category", // Kategoriyaga ko'ra guruhlaymiz
                        count: { $sum: 1 } // Har bir kategoriya uchun sonini hisoblaymiz
                    }
                }
            ])
            length.forEach(value => counts[value._id] = value.count)
        }
        res.status(200).send({ categories: allCategories, length: counts });
    } catch (error) {
        res.status(400).send({ msg: error.message });
    }
});

app.get("/roles", async (req, res) => {
    try {
        let allCategories = [
            { value: "bloger", label: "Блогер" },
            { value: "freelancer", label: "Фрилансер" },
            { value: "reklama", label: "Рекламодатель" },
        ];

        res.status(200).send(allCategories);
    } catch (error) {
        res.status(400).send({ msg: error.message });
    }
});





app.use("/users", userRoutes)
app.use('/admin', adminRoutes);
app.use('/advertise', advertiseRoutes);
app.use('/announce', announceRoutes);
app.use('/barter', barterRoutes);
app.use('/collaboration', collaborationRoutes);
app.post('/create/:promotion/', createPromotion);
app.get("/my-promotion/", getMyPromotions)
app.get('/promotion/:promotion/category/:category/:id', getWithCategoryPromotion);
app.get('/agree/:id/promotion/:promotion/:promotionId', setAgree);
app.get('/remove/:id/promotion/:promotion/:promotionId', removeUserFromPromotionAgree);
app.get('/select/:id/promotion/:promotion/:promotionId', setSelect);

app.post('/upload', uploadMiddleware, (req, res) => {
    try {
        // Yuklangan fayl ma'lumotlarini olish
        const file = req.file;
        if (!file) {
            return res.status(400).send({ message: 'Fayl yuklanmadi' });
        }

        // Cloudinary URL ni qaytarish
        res.status(200).send({
            message: 'Fayl muvaffaqiyatli yuklandi',
            url: file.path // Cloudinary URL
        });
    } catch (error) {
        console.error(JSON.stringify(error));
        res.status(500).send({ message: 'Fayl yuklashda xatolik yuz berdi' });
    }
});



const PORT = process.env.PORT || config.port;

startBot(bot)

app.listen(PORT, () => {


    console.log(`Server is running on port http://localhost:${PORT}`);
});
