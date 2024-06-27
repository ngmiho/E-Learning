'use strict'

var db = require('../config/db')

var path = require('path')
var fs = require('fs')
var { projectRoot } = require('../../../utils/pathUtils')

module.exports = {
    getFiles: (req, res) => {
        const filename = req.params.filename
        var directoryPath = path.join(projectRoot, 'public', 'assets', filename)
        fs.access(directoryPath, fs.constants.F_OK, (err) => {
            if (err) return res.status(500).send('Unable to scan directory: ' + err)
            res.sendFile(directoryPath)
        })
    },
    getAll: (req, res) => {
        let sql = 'SELECT * FROM lessons ORDER BY id DESC'
        db.query(sql, (error, response) => {
            if (error) throw error
            res.json(response)
        })
    },
    getByID: (req, res) => {
        console.log(req.params.id)
        let id = req.params.id
        let sql = 'SELECT * FROM lessons WHERE id = ?'
        db.query(sql, [ id ], (error, response) => {
            if (error) throw error
            res.json(response)
        })
    },
    getPaginationByID: (req, res) => {
        console.log(req.params.page)
        let page = req.params.page
        let limit = req.params.limit
        let index = page * limit
        let arr = []
        for (let i = index, j = 0; j < limit; ++i, ++j) {
            arr.push(i)
        }
        let sql = 'SELECT * FROM lessons WHERE  id = ? OR id = ? OR id = ? OR id = ? OR id = ?'
        db.query(sql, [ arr[0], arr[1], arr[2], arr[3], arr[4] ], (error, response) => {
            if (error) throw error
            res.json(response)
        })
    },
    create: (req, res) => {
        console.log(req.body)
        let {lessonCategoryId, name, description, type, content, order, uploadedBy, createdAt, updatedAt } = req.body
        let fileName = req.file.filename
        let sql = 'INSERT INTO lessons (lessonCategoryId, `name`, ' 
                    + '`description`, `type`, content, '
                    + '`order`, locationPath, uploadedBy, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        db.query(sql, [lessonCategoryId, name, description, type, content, order, fileName, uploadedBy, createdAt, updatedAt ], 
            (error, response) => {
                if (error) throw error
                res.json(response)
                console.log("test2" + response)
            })
    },
    update: (req, res) => {
        console.log(req.body)
        let { id, lessonCategoryId, name, description, type, content, order, locationPath, uploadedBy, updatedAt } = req.body
        let currentLocationPath = path.join(projectRoot, "public", "assets", req.body.currentLocationPath)
        let fileName = req.file.filename
        let sql = 'UPDATE lessons SET lessonCategoryId = ?, `name` = ?, `description` = ?, '
                    + 'type = ?, content = ?, `order` = ?, '
                    + 'locationPath = ?, uploadedBy = ?, updatedAt = ? WHERE id = ?'
        db.query(sql, [ lessonCategoryId, name, description, type, content, order, fileName, uploadedBy, updatedAt, id ], 
            (error, response) => {
                if (error) throw error
                res.json(response)
                fs.unlink(currentLocationPath, (err) => {
                    if (err) {
                        console.error("Failed to delete file:", err)
                    } else {
                        console.error("Deleted file successfully")
                    }
                })
            })
            
    },
    delete: (req, res) => {
        console.log(req.params.id)
        let id = req.params.id
        let locationPath = path.join(projectRoot, "public", "assets", req.query.locationPath)
        let sql = 'DELETE FROM lessons WHERE id = ?'
        db.query(sql, [ id ], (error, response) => {
            if (error) throw error
            res.json(response)
            fs.unlink(locationPath, (err) => {
                if (err) {
                    console.error("Failed to delete file:", err);
                } else {
                    console.error("Deleted file successfully");
                }
            })
        })
    },
    countLessonCategoryId: (req, res) => {
        console.log(req.params.id)
        let id = req.params.id
        let sql = "SELECT COUNT(*) as total FROM lessons WHERE lessonCategoryId = ?"
        db.query(sql, [ id ], (error, response) => {
            if (error) throw error
            res.json(response)
        })
    },
    getIdsByLessonCategoryId: (req, res) => {
        console.log(req.params.lessonCategoryId)
        let lessonCategoryId = req.params.lessonCategoryId
        let sql = "SELECT id FROM lessons WHERE lessonCategoryId = ?"
        db.query(sql, [ lessonCategoryId ], (error, response) => {
            if (error) throw error
            res.json(response)
        })
    }
}