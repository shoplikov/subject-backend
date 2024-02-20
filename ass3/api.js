const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Blog = require('./models/blog_scheme');

const app = express();

mongoose.connect('mongodb://localhost:27017/BlogPlatform');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// POST /blogs: 
app.post('/blogs', async (req, res) => {
  try {
    const blog = new Blog(req.body);
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /blogs: 
app.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /blogs/:id: 
app.get('/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog with your ID was not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /blogs/:id: 
app.put('/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedBlog) {
      return res.status(404).json({ message: 'Blog with your ID was not found' });
    }
    res.json(updatedBlog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /blogs/:id:
app.delete('/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (!deletedBlog) {
      return res.status(404).json({ message: 'Blog with your ID was not found' });
    }
    res.json({ message: 'Blog was deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(3000, () => {
  console.log(`http://localhost:3000`);
});
