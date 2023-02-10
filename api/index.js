const express = require('express');
const router = express.Router();
const { getUserById } = require('../db/users')
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

// GET /api/health
router.get('/api/health', async (req, res, next) => {
    try {
        res.send({
            message:"I am healthy"
        });
    } catch (error) {
        next(error); 
    }
})

// ROUTER: /api/users
const usersRouter = require('./users');
router.use('/api/users', usersRouter);

// ROUTER: /api/activities
const activitiesRouter = require('./activities');
router.use('/api/activities', activitiesRouter);

// ROUTER: /api/routines
const routinesRouter = require('./routines');
router.use('/api/routines', routinesRouter);

// ROUTER: /api/routine_activities
const routineActivitiesRouter = require('./routineActivities');
router.use('/api/routine_activities', routineActivitiesRouter);


router.use('/api/unknown', async (error, req, res, next) => {
    res.send({
        error: error.name,
        name: error.name,
        message: error.message
    });
});


module.exports = router;
