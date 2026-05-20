const express = require('express');
const router = express.Router();
const {
  uploadNote,
  getAllNotes,
  getNoteById,
  deleteNote,
  getMyNotes,
} = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

// Public routes
router.get('/', getAllNotes);

// Private routes
router.get('/my/notes', protect, getMyNotes);
router.post('/', protect, upload.single('file'), uploadNote);
router.delete('/:id', protect, deleteNote);

// Must be last
router.get('/:id', getNoteById);

module.exports = router;