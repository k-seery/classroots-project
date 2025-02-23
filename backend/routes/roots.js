// backend/routes/roots.js
const express = require('express');
const router = express.Router();
const Class = require('../models/Class');
const User = require('../models/User');

router.get('/', async (req, res, next) => {
  try {
    const classes = await Class.find({});
    res.json(classes);
  } catch (err) {
    next(err);
  }
});

router.post('/:id/join', async (req, res, next) => {
  try {
    const classId = req.params.id;
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (user.enrolledClasses.includes(classId)) {
      return res.status(400).json({ error: 'Already joined this class' });
    }
    user.enrolledClasses.push(classId);
    await user.save();
    const classObj = await Class.findById(classId);
    if (!classObj) return res.status(404).json({ error: 'Class not found' });
    classObj.members.push(userId);
    await classObj.save();
    res.json({ message: 'Successfully joined the class Root.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
