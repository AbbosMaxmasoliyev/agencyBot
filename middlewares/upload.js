const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');


const cloudinary = require('cloudinary').v2;

// Cloudinary konfiguratsiyasi
cloudinary.config({
    cloud_name: "dzs4ep8w2",
    api_key: "811353889898835",
    api_secret: "31V2SD0UCTJfVwKo31Cak42MIrs"
});


// Multer uchun Cloudinary storage ni sozlash
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'blogerAgency', // Cloudinarydagi papka nomi
        format: async (req, file) => 'png', // Fayl formati (masalan, jpg)
        public_id: (req, file) => file.originalname.split('.')[0], // Fayl nomi
    },
});

const upload = multer({ storage: storage });


module.exports = upload
