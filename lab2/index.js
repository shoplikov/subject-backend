const express = require('express');
const mongoose = require('mongoose');
const Task = require('./models/Task');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost/todo_db')

// Routes
app.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.render('index', { tasks });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// app.post('/', async (req, res) => {
//     const { title } = req.body;
//     try {
//         await Task.create({ title });
//         res.redirect('/');
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Server Error');
//     }
// });

// app.post('/:id/complete', async (req, res) => {
//     const taskId = req.params.id;
//     try {
//         const task = await Task.findById(taskId);
//         task.completed = true;
//         await task.save();
//         res.redirect('/');
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Server Error');
//     }
// });

// app.post('/:id/delete', async (req, res) => {
//     const taskId = req.params.id;
//     try {
//         await Task.findByIdAndDelete(taskId);
//         res.redirect('/');
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Server Error');
//     }
// });

// Add a task
app.post('/', async (req, res) => {
    const { title } = req.body;
    try {
        await Task.create({ title });
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Mark a task as completed
app.patch('/:id/complete', async (req, res) => {
    const taskId = req.params.id;
    try {
        const task = await Task.findById(taskId);
        task.completed = true;
        await task.save();
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Delete a task
app.delete('/:id/delete', async (req, res) => {
    const taskId = req.params.id;
    try {
        await Task.findByIdAndDelete(taskId);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


app.listen(3000, () => {
    console.log(`http://localhost:3000`);
});
