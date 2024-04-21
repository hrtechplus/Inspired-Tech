const express = require('express');

// Define your testing routes here
router.get('/test', (req, res) => {
  res.send('This is a test route');
});

router.post('/test', (req, res) => {
  const { body } = req;
  res.json({ message: 'Test route received', data: body });
});

module.exports = router;
