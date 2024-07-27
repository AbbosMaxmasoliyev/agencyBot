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
const { publishPromotion, getWithCategoryPromotion, setAgree, setSelect, removeUserFromPromotionAgree } = require('./controller/all.js');
const upload = require("./middlewares/upload.js")
const app = express();

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




const corsOptions = {
    origin: [
        'https://blogerwebapp.vercel.app',
        'https://bloger-agency-adminka.vercel.app',
        "http://localhost:3000",
        "http://localhost:5173",
        'https://web.telegram.org'
    ],
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
    try {
        let allCategories = [
            { value: "fitness", label: "Фитнес" },
            { value: "sport", label: "Спорт" },
            { value: "travel", label: "Путешествия" },
        ];

        res.status(200).send(allCategories);
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
app.post('/publish/:promotion/:id', publishPromotion);
app.get('/promotion/:promotion/category/:category/:id', getWithCategoryPromotion);
app.get('/agree/:id/promotion/:promotion/:promotionId', setAgree);
app.get('/remove/:id/promotion/:promotion/:promotionId', removeUserFromPromotionAgree);
app.get('/select/:id/promotion/:promotion/:promotionId', setSelect);

app.post('/upload', upload.single('image'), (req, res) => {
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
        console.error(error);
        res.status(500).send({ message: 'Fayl yuklashda xatolik yuz berdi' });
    }
});




const PORT = process.env.PORT || config.port;

startBot(bot)

app.listen(PORT, () => {


    console.log(`Server is running on port http://localhost:${PORT}`);
});
