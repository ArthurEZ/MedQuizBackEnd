const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

// Route for uploading single image
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  res.json({
    message: 'Upload successful',
    filename: req.file.filename,
    path: `/public/${req.file.filename}`,
  });
});

module.exports = router;
