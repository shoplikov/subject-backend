const express = require('express');
const router = express.Router();
const Article = require('../models/article');
require('dotenv').config();

// Admin login route
router.get('/login', (req, res) => {
    res.render('admin/login');
});

// Admin authentication route
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (username === adminUsername && password === adminPassword) {
        req.session.isAdmin = true; 
        res.redirect('/admin/dashboard');
    } else {
        res.redirect('/admin/login');
    }
});

// Admin dashboard route
router.get('/dashboard', async (req, res) => {
    try {
        if (req.session.isAdmin) {
            const articles = await Article.find({});
            res.render('admin/dashboard', { articles });
        } else {
            res.redirect('/admin/login');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Edit article route
router.get('/edit/:id', async (req, res) => {
    try {
        if (req.session.isAdmin) {
            const article = await Article.findById(req.params.id);
            res.render('admin/edit', { article });
        } else {
            res.redirect('/admin/login');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/edit/:id', async (req, res) => {
    try {
        if (req.session.isAdmin) {
            const { title, content } = req.body;
            await Article.findByIdAndUpdate(req.params.id, { title, content });
            res.redirect('/admin/dashboard');
        } else {
            res.redirect('/admin/login');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Delete article route
router.get('/delete/:id', async (req, res) => {
    try {
        if (req.session.isAdmin) {
            await Article.findByIdAndDelete(req.params.id);
            res.redirect('/admin/dashboard');
        } else {
            res.redirect('/admin/login');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
