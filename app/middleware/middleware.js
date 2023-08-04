const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const responseMsg = require("../utils/responseMsg");


exports.authJWT = async (req, res, next) => {
    const path = ['/api/login', '/api/register', '/api/email-verify', '/api/forgotPassword', '/api/update-password', '/api/email-resend']

    if (path.includes(req.path)) return next()

    if (req.headers.authorization) {
        try {
            const data = await jwt.verify(req.headers.authorization, process.env.JWT_SECRET)
            req.user = data;
            return next()

        } catch (error) {
            res.status(401).send({
                error: { message: [responseMsg.Unauthorized] }
            })
        }
    } else
        res.status(401).send({
            error: { message: [responseMsg.Unauthorized] }
        })
};

exports.fileUploader = async (req, res, next) => {

    const BASE_PATH = __dirname
    const storage = multer.diskStorage({

        destination: function (req, file, cb) {
            cb(null, path.join(BASE_PATH, '../upload'))
        },

        filename: function (req, file, cb) {
            cb(null, Date.now() + file.originalname)
        },
    })
    const fileFilter = (req, file, cb) => {
        if (file.mimetype === 'image/jpe' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf' || file.mimetype === 'video/mp4' || file.mimetype === 'video/webm' || file.mimetype === 'audio/mpeg' || file.mimetype === 'audio/mp3' || file.mimetype === 'audio/wav') {
            cb(null, true)
        }
        else {
            cb(null, true)
        }
    }
    const upload = multer({
        storage: storage,
        limits: { fileSize: 1024 * 1024 * 1024 * 5 },
        fileFilter: fileFilter
    })

    upload.single("file")(req, res, next)

}

