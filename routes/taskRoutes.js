const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');

// Apply protect middleware to all task endpoints
router.use(protect);

// 1. CREATE Task
router.post('/', async (req, res) => {
  try {
    const { title, description, priority } = req.body;
    const newTask = await Task.create({
      title,
      description,
      priority,
    });
    res.status(201).json({ success: true, data: newTask });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// 2. READ All Tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;