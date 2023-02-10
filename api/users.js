/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const { 
    createUser, 
    getUser,
    getUserByUsername, 
    getPublicRoutinesByUser,
    getAllRoutinesByUser
} = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { JWT_SECRET } = process.env;
//const { requireUser } = require('./utils')

// POST /api/users/register
router.post("/register", async (req, res, next) => {
    const { username, password } = req.body;
  
    try {
        const _user = await getUserByUsername(username);
        if (_user) {
          next({
            name: "User Exists",
            message: `User ${username} already exists.`,
          });
        } else if (password.length <= 8) {
          next({
            name: "Password Too Short",
            message: "Password must be at least 8 characters",
          });
        } else {
          const hashedPassword = await bcrypt.hash(password, 10);
          const user = await createUser({
            username,
            password: hashedPassword,
          });

     
      const token = jwt.sign(
        {
          id: user.id,
          username,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1w",
        }
      );
  
      res.send({
        message: "Thank you for signing up",
        token: token,
        user:{ id:user.id , username:user.username}
      });
    }
    } catch (err) {
      next(err);
    }
  });

// POST /api/users/login

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;
