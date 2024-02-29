const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const Article = require('./models/article');
const User = require('./models/user');
const axios = require('axios');
const adminRoutes = require('./routes/admin');
require('dotenv').config(); 

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/blog_app').then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false
}));

// check if user is authenticated
const authMiddleware = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/login');
    }
};

// Routes
app.use('/', authRoutes);

// Route to render the write_blog form
app.get('/write_blog', authMiddleware, (req, res) => {
    res.render('write_blog', { userId: req.session.userId });
});

// Route to handle article submission
app.post('/submit_article', authMiddleware, async (req, res) => {
    try {
        const { title, content, imageUrl } = req.body; 
        const article = new Article({
            title,
            content,
            imageUrl, 
            author: req.session.userId
        });
        await article.save();

        // Update the user's articles array
        const user = await User.findById(req.session.userId);
        user.articles.push(article);
        await user.save();

        res.redirect('/');
    } catch (error) {
        console.error("Error submitting article:", error);
        res.status(500).send('Internal Server Error');
    }
});

// Define route for viewing single article
app.get('/articles/:id', async (req, res) => {
    try {
        const articleId = req.params.id;
        const article = await Article.findById(articleId).populate('author');

        if (!article) {
            return res.status(404).send('Article not found');
        }

        const articleTitle = article.title;

        // Make request to News API to fetch similar articles based on the title
        const newsApiKey = process.env.NEWS_API_KEY;
        const newsApiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(articleTitle)}&apiKey=${newsApiKey}`;
        const response = await axios.get(newsApiUrl);

        // Extract relevant information from News API response
        let similarArticles = response.data.articles.map(article => ({
            title: article.title,
            url: article.url,
            source: article.source.name
        }));

        // 5 articles limitation
        similarArticles = similarArticles.slice(0, 5);

        res.render('article', { article, similarArticles, userId: req.session.userId }); // Pass both article and similarArticles to the template
    } catch (error) {
        console.error("Error fetching article:", error);
        res.status(500).send('Internal Server Error');
    }
});


// Route to display submitted articles on the main page
app.get('/', authMiddleware, async (req, res) => {
    try {
        const articles = await Article.find().populate('author').sort({ createdAt: 'desc' });
        res.render('main', { articles, userId: req.session.userId });
    } catch (error) {
        console.error("Error fetching articles:", error);
        res.status(500).send('Internal Server Error');
    }
});

app.use('/admin', adminRoutes); 

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
