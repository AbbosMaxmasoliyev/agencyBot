const User = require("../models/user");

async function updateUser(userId, path, updateInfo) {


    return new Promise(async (resolve, reject) => {
        // Ma'lumotni yangilash jarayoni
        // Muvaffaqiyatli tugatilganda resolve chaqiriladi
        // Xato yuz bersa reject chaqiriladi
        const user = await User.findOne({ userId });
        if (!user) {
            reject(new Error('User not found'));
        }

        user[path] = updateInfo;
        user.save();
        resolve(user);
    });
}



async function updateUserData(userTelegramId, updatingData) {
    const updatePromises = Object.keys(updatingData).map((key) => {
        return updateUser(userTelegramId, key, updatingData[key]);
    });

    try {
        await Promise.all(updatePromises);
        console.log("Barcha yangilanishlar muvaffaqiyatli bajarildi.");
    } catch (error) {
        console.error("Yangilanishlar davomida xatolik yuz berdi:", error);
    }
}

async function deleteUserWithId(userId) {
    const user = await User.findOneAndDelete({ userId });
    console.log(user, "=> Ichki");
    if (!user) {
        throw new Error('User not found');
    }
    return user.save();
}

module.exports = { updateUser, deleteUserWithId, updateUserData }