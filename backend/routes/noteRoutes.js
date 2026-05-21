const express = require('express');
const router = express.Router();
const {
  uploadNote,
  getAllNotes,
  getNoteById,
  deleteNote,
  getMyNotes,
  rateNote,
  incrementViews,
} = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

// Public routes
router.get('/', getAllNotes);

// Private routes
router.get('/my/notes', protect, getMyNotes);
router.post('/', protect, upload.single('file'), uploadNote);
router.delete('/:id', protect, deleteNote);
router.post('/:id/rate', protect, rateNote);
router.put('/:id/views', incrementViews);

// Must be last
router.get('/:id', getNoteById);

module.exports = router;