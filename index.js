const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const config = require('./config/config');
const botRoutes = require('./botRoutes/botRoutes');
const errorHandler = require('./middlewares/errorhandler');
const bot = require('./src/main.js');
const startBot = require("./src/utils/startBot.js");
const path = require('path');
const { default: mongoose } = require('mongoose');
const { User } = require('./src/database/index.js');
const Announce = require('./models/announce.js');
const Barter = require('./models/barter.js');
const Advertise = require('./models/advertise.js');

const app = express();

// Set up default mongoose connection
const mongoDB = process.env.MONGO_URI;
mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
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

const PORT = process.env.PORT || config.port;
app.listen(PORT, () => {


    console.log(`Server is running on port http://localhost:${PORT}`);
    startBot(bot)
});
