const express = require('express');
const pick = require('lodash/pick');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const Config = require('../config');
const auth = require('../middleware/auth');

const User = require('../models/Profiles');
const Organizations = require('../models/Organizations');
const Alarms = require('../models/Alarms');

const router = express.Router();

router
    .route('/login')
    .get(auth, async (req, res) => {
        if (req.user) {
            return res.redirect('/screens');
        }

        const orgs = await Organizations.getAll();

        return res.render('nodes/login', {
            orgs: orgs,
            authFailed: req.query.authFailed
        });
    });

router
    .route('/signup')
    .get(auth, async (req, res) => {
        if (req.user) {
            return res.redirect('/screens');
        }

        const orgs = await Organizations.getAll();

        return res.render('nodes/signup', {
            orgs: orgs,
            signupFailed: req.query.signupFailed
        });
    });

router
    .route('/logout')
    .get(async (req, res) => {
        try {
            return res.clearCookie("secretToken").redirect('/login');
        } catch (err) {
            console.log(err);
        }
    });

router
    .route('/signup')
    .post(async (req, res) => {
        try {
            const { username, tinorg, password } = pick(req.body, 'username', 'tinorg', 'password');

            if (!(username && password && tinorg)) {
                return res.redirect('/signup/?signupFailed=invalidCredentials');
            }


            const orgExists = await Organizations.findByTIN(tinorg);
            if (!orgExists) {
                return res.redirect('/signup/?signupFailed=noOrg');
            }

            const userExists = await User.getUser(username, tinorg);
            if (userExists) {
                return res.redirect('/signup/?signupFailed=userExists');
            }

            const encryptedPassword = await bcrypt.hash(password, 10);

            const user = await User.createUser(username, tinorg, encryptedPassword);

            return res.redirect('/login');
        } catch (err) {
            console.log(err);
            return res.redirect('/signup/?signupFailed=failAccess');
        }
    });

router
    .route('/login')
    .post(async (req, res) => {
        try {
            const { username, tinorg, password } = pick(req.body, 'username', 'tinorg', 'password');

            if (!(username && password && tinorg)) {
                return res.redirect('/login/?authFailed=invalidCredentials');
            }

            const user = await User.getUser(username, tinorg);

            if (!user || user.pin == null) {
                return res.redirect('/login/?authFailed=noUser');
            }

            if (user && (await bcrypt.compare(password, user.pin))) {
                const token = jwt.sign(
                    { user_id: user.profile_id },
                    Config.TOKEN_SECRET,
                    {
                        expiresIn: "9h",
                    }
                );

                return res.cookie("secretToken", token, { httpOnly: true }).redirect('/screens');
            } else {
                return res.redirect('/login/?authFailed=wrongPassword');
            }
        } catch (err) {
            console.log(err);
            return res.redirect('/login/?authFailed=failAccess');
        }
    });

router
    .route('/screens')
    .get(auth, (req, res) => {
        try {
            if (!req.user) {
                return res.redirect('/login');
            }
            
            return res.render('nodes/screens', { user: req.user });
        } catch (err) {
            console.log(err);
            res.status(404).send('Error accessing screens page');
        }
    });

router
    .route('/alarms')
    .get(auth, async (req, res) => {
        try {
            if (!req.user) {
                return res.redirect('/login');
            }

            res.render('nodes/alarms');
        } catch (err) {
            console.log(err);
            res.status(500).send('Error accessing alarm page');
        }
    });

router
    .route('/profile')
    .get(auth, async (req, res) => {
        try {
            if (!req.user) {
                return res.redirect('/login');
            }

            res.render('nodes/profile');
        } catch (err) {
            console.log(err);
            res.status(404).send('Error accessing profile page');
        }
    });

router
    .route('/timetables')
    .get(auth, async (req, res) => {
        try {
            if (!req.user) {
                return res.redirect('/login');
            }

            res.render('nodes/timetables');
        } catch (err) {
            console.log(err);
            res.status(404).send('Error accessing timetables page');
        }
    });

router
    .route('/buses')
    .get(auth, async (req, res) => {
        try {
            if (!req.user) {
                return res.redirect('/login');
            }

            res.render('nodes/buses');
        } catch (err) {
            console.log(err);
            res.status(404).send('Error accessing buses page');
        }
    });

router
    .route('/phones')
    .get(auth, async (req, res) => {
        try {
            if (!req.user) {
                return res.redirect('/login');
            }

            res.render('nodes/phones');
        } catch (err) {
            console.log(err);
            res.status(404).send('Error accessing phones page');
        }
    });

router
    .route('/payslips')
    .get(auth, async (req, res) => {
        try {
            if (!req.user) {
                return res.redirect('/login');
            }

            res.render('nodes/payslips');
        } catch (err) {
            console.log(err);
            res.status(404).send('Error accessing phones page');
        }
    });

router
    .route('/support')
    .get(auth, async (req, res) => {
        try {
            if (!req.user) {
                return res.redirect('/login');
            }

            res.render('nodes/support', {
                success: req.query.success,
                failure: req.query.failure,
            });
        } catch (err) {
            console.log(err);
            res.status(404).send('Error accessing support page');
        }
    });

router
    .route('/extras')
    .get(auth, async (req, res) => {
        try {
            if (!req.user) {
                return res.redirect('/login');
            }

            res.render('nodes/extras');
        } catch (err) {
            console.log(err);
            res.status(404).send('Error accessing extras page');
        }
    });

router
    .route('/reports')
    .get(auth, async (req, res) => {
        try {
            if (!req.user) {
                return res.redirect('/login');
            }

            res.render('nodes/reports');
        } catch (err) {
            console.log(err);
            res.status(404).send('Error accessing reports page');
        }
    });

module.exports = router;