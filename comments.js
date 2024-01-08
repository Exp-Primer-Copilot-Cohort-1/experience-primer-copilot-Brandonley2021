// Create web server
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create comments object
const commentsByPostId = {};

// Create endpoint to handle post requests
app.post('/posts/:id/comments', async (req, res) => {
    // Get the post id from the url
    const postId = req.params.id;

    // Get the comment from the request body
    const { content } = req.body;

    // Get the comments array for the given post id
    const comments = commentsByPostId[postId] || [];

    // Create a unique id for the comment
    const commentId = Math.random().toString(36).substr(2, 5);

    // Push the comment into the comments array
    comments.push({ id: commentId, content, status: 'pending' });

    // Save the comments array for the given post id
    commentsByPostId[postId] = comments;

    // Emit an event to the event bus
    await axios.post('http://event-bus-srv:4005/events', {
        type: 'CommentCreated',
        data: {
            id: commentId,
            content,
            postId,
            status: 'pending',
        },
    });

    // Send a response to the request
    res.status(201).send(comments);
});

// Create endpoint to handle get requests
app.get('/posts/:id/comments', (req, res) => {
    // Get the post id from the url
    const postId = req.params.id;

    // Get the comments array for the given post id
    const comments = commentsByPostId[postId] || [];

    // Send a response to the request
    res.send(comments);
});

// Create endpoint to handle post requests
app.post('/events', async (req, res) => {
    // Get the event type and data from the request body
    const { type, data } = req.body;

    // Check if the event type is CommentModerated
    if (type === 'CommentModerated') {
        // Get the post id and comment id from the data
        const { postId, id, status, content } = data;

        // Get the comments array for the given post id
        const comments = commentsByPostId[postId];