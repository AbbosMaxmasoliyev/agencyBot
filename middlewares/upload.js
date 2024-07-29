const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB


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

const upload = multer({
    storage: storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: (req, file, cb) => {
        // Fayl turi tekshiruvi
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Fayl turi ruxsat etilmagan'), false);
        }
    }
}).single('image');


const uploadMiddleware = (req, res, next) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // Multer xatoliklari
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(413).json({ error: 'Fayl hajmi ruxsat etilganidan katta' });
            }
            return res.status(400).json({ error: err.message });
        } else if (err) {
            // Boshqa xatoliklar
            return res.status(400).json({ error: err.message });
        }
        next();
    });
};


module.exports = uploadMiddleware
