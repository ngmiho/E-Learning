'use strict'

var lessons = require('../controllers/lessons')
var users = require('../controllers/users')
const multer = require('multer')
const path = require('path');
const { projectRoot } = require('../../../utils/pathUtils')
const fs = require('fs');

const uploadDir = path.resolve(projectRoot, 'public', 'assets');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        let currentOriginalname = file.originalname
        console.log(parseInt("testt" + currentOriginalname))
        if (currentOriginalname.indexOf("-", 13) !== -1 && parseInt(currentOriginalname) > 999999999999)
            currentOriginalname = currentOriginalname.substring(14)
        return cb(null,  Date.now() + "-" + Buffer.from(currentOriginalname, 'latin1').toString('utf8'));
    }
})

const upload = multer({ 
    storage,
    limits: { fileSize: 1000000 * 1024 }
 })


module.exports = function(app) {
    app.route('/api/v1/users/:username/:password').get(users.getUserByUserName)
    app.route('/api/v1/users/:id').get(users.getUserById)
    app.route('/api/v1/users/token/create/:id/:username/:roleId').get(users.createToken)
    app.route('/api/v1/users/token/verify/:token').get(users.verifyToken)

    app.route('/api/v1/lessons/countLessonCategoryId/:id').get(lessons.countLessonCategoryId)
    app.route('/api/v1/lessons/getIdsByLessonCategoryId/:lessonCategoryId').get(lessons.getIdsByLessonCategoryId)
    app.route('/api/v1/lessons').get(lessons.getAll)
    app.route('/api/v1/lessons/files/:filename').get(lessons.getFiles)
    app.route('/api/v1/lessons/:id').get(lessons.getByID)
    app.route('/api/v1/lessons/:page/:limit').get(lessons.getPaginationByID)
    app.post('/api/v1/lessons', upload.single('file'), lessons.create)
    app.put('/api/v1/lessons/:id', upload.single('file'), lessons.update)
    app.delete('/api/v1/lessons/:id', lessons.delete)
}