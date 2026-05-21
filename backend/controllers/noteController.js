const Note = require('../models/Note');
const { cloudinary } = require('../config/cloudinary');

const uploadNote = async (req, res) => {
  try {
    const { title, subject, semester, scheme, department, description } = req.body;

    if (!title || !subject || !semester || !scheme || !department) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF file' });
    }

    const note = await Note.create({
      title,
      subject,
      semester,
      scheme,
      department,
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

const getAllNotes = async (req, res) => {
  try {
    const { search, subject, semester, scheme, department } = req.query;

    let filter = {};

    if (scheme) filter.scheme = scheme;
    if (department) filter.department = department;
    if (semester) filter.semester = semester;
    if (subject) filter.subject = { $regex: subject, $options: 'i' };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const notes = await Note.find(filter).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const incrementViews = async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json({ views: note.views });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getNoteById = async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this note' });
    }

    await cloudinary.uploader.destroy(note.filePublicId, {
      resource_type: 'raw',
    });

    await note.deleteOne();
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

const rateNote = async (req, res) => {
  try {
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const alreadyRated = note.ratings.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyRated) {
      alreadyRated.rating = rating;
    } else {
      note.ratings.push({ user: req.user._id, rating });
    }

    note.averageRating =
      note.ratings.reduce((acc, r) => acc + r.rating, 0) /
      note.ratings.length;

    await note.save();

    res.json({
      averageRating: note.averageRating,
      totalRatings: note.ratings.length,
    });
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
  rateNote,
  incrementViews,
};