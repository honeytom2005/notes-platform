const Note = require('../models/Note');
const { cloudinary } = require('../config/cloudinary');

// @route   POST /api/notes
// @desc    Upload a new note
// @access  Private
const uploadNote = async (req, res) => {
  try {
    const { title, subject, semester, description } = req.body;

    // Check required fields
    if (!title || !subject || !semester) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF file' });
    }

    // Create note in database
    const note = await Note.create({
      title,
      subject,
      semester,
      description,
      fileUrl: req.file.path,
      filePublicId: req.file.filename,
      uploadedBy: req.user._id,
      uploaderName: req.user.name,
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/notes
// @desc    Get all notes with search and filter
// @access  Public
const getAllNotes = async (req, res) => {
  try {
    const { search, subject, semester } = req.query;

    // Build filter object
    let filter = {};

    if (subject) {
      filter.subject = { $regex: subject, $options: 'i' };
    }

    if (semester) {
      filter.semester = semester;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Get notes sorted by newest first
    const notes = await Note.find(filter).sort({ createdAt: -1 });

    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/notes/:id
// @desc    Get single note by ID
// @access  Public
const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   DELETE /api/notes/:id
// @desc    Delete a note
// @access  Private
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this note' });
    }

    // Delete file from Cloudinary
    await cloudinary.uploader.destroy(note.filePublicId, {
      resource_type: 'raw',
    });

    await note.deleteOne();

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/notes/my
// @desc    Get notes uploaded by logged in user
// @access  Private
const getMyNotes = async (req, res) => {
  try {
    const notes = await Note.find({ uploadedBy: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadNote,
  getAllNotes,
  getNoteById,
  deleteNote,
  getMyNotes,
};