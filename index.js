// index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const config = require('./config/config');
const botRoutes = require('./botRoutes/botRoutes');
const errorHandler = require('./middlewares/errorhandler');
const bot = require('./src/main.js');
const startBot = require("./src/utils/startBot.js");
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
const { publishPromotion, getWithCategoryPromotion, getPublishWaitingPromotion } = require('./controller/all.js');

const app = express();

// Set up default mongoose connection
const mongoDB = process.env.MONGO_URL;
mongoose.connect(mongoDB, {
    useNewUrlParser: true, // Even though it's deprecated, it won't hurt to leave it for backward compatibility
    useUnifiedTopology: true, // This is the recommended option to use
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1); // Exit the application with failure code
});

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', botRoutes);

app.get('/site', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(errorHandler);

// Define the domain for the webhook
const webhookDomain = 'https://agencybot.onrender.com';


// Set webhook
bot.telegram.setWebhook(webhookDomain);

// Start bot (if not using webhooks)
startBot(bot);

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
            {
                title: "Пользователи",
                count: users.length,
                link: "users"
            },
            {
                title: "Заказы",
                count: orders.length,
                link: "orders"
            },
            {
                title: "Объявления",
                count: announces.length,
                link: "announces"
            },
            {
                title: "Бартеры",
                count: barters.length,
                link: "barters"
            },
            {
                title: "Реклама",
                count: advertises.length,
                link: "advertises"
            },
        ];

        res.status(200).send(allData);
    } catch (error) {
        res.status(400).send({ msg: error.message });
    }
});

app.get("/categories", async (req, res) => {
    try {
        let allCategories = [
            {
                "value": "fitness",
                "label": "Фитнес"
            },
            {
                "value": "sport",
                "label": "Спорт"
            },
            {
                "value": "travel",
                "label": "Путешествия"
            }
        ];

        res.status(200).send(allCategories);
    } catch (error) {
        res.status(400).send({ msg: error.message });
    }
});

app.use("/users", userRoutes);
app.use('/admin', adminRoutes);
app.use('/advertise', advertiseRoutes);
app.use('/announce', announceRoutes);
app.use('/barter', barterRoutes);
app.use('/collaboration', collaborationRoutes);
app.post('/publish/:promotion', publishPromotion);
app.get('/promotion/:promotion/:id', getWithCategoryPromotion);
app.get('/publish/:id', getPublishWaitingPromotion);

app.listen(config.port, () => {
    console.log(`Server is running on port http://localhost:${config.port}`);
});
