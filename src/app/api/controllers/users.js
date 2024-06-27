"use strict";

var db = require("../config/db");
var tokenUtils = require("../../../utils/tokenUtils");

module.exports = {
  createToken: (req, res) => {
    console.log(req.params);
    let { id, username, roleId } = req.params;
    //create token
    let payload = {
      id,
      username,
      roleId,
      exp: Math.floor(Date.now() / 1000) + 15,
    };
    let token = tokenUtils.createToken(payload);
    res.json(token);
  },
  verifyToken: (req, res) => {
    console.log(req.params);
    let token = req.params.token;
    let decodedPayload = tokenUtils.verifyToken(token);
    res.json(decodedPayload);
  },
  getUserByUserName: (req, res) => {
    console.log(req.params);
    let username = req.params.username;
    let password = req.params.password;
    let sql = "SELECT * FROM user WHERE username = ? AND password = ?";
    db.query(sql, [username, password], (error, response) => {
      if (error) throw error;
      res.json(response);
    });
  },
  getUserById: (req, res) => {
    console.log(req.params);
    let id = req.params.id;
    let sql = "SELECT * FROM user WHERE id = ?";
    db.query(sql, [id], (error, response) => {
      if (error) throw error;
      res.json(response);
    });
  },
};
