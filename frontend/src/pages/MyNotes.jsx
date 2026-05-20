import { useState, useEffect } from 'react';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import NoteCard from '../components/NoteCard';
import Spinner from '../components/Spinner';
import { FaBook, FaUpload } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MyNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchMyNotes = async () => {
    try {
      const { data } = await axios.get('/notes/my/notes');
      setNotes(data);
    } catch (error) {
      toast.error('Failed to fetch your notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyNotes();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await axios.delete(`/notes/${id}`);
      toast.success('Note deleted successfully!');
      setNotes(notes.filter((note) => note._id !== id));
    } catch (error) {
      toast.error('Failed to delete note');
    }
  };

  return (
    <div>
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-10 px-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">My Notes</h1>
            <p className="text-blue-100 mt-1">
              Notes uploaded by {user?.name}
            </p>
          </div>
          <Link
            to="/upload"
            className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-800 font-semibold py-2 px-6 rounded-xl transition"
          >
            <FaUpload />
            Upload New
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        {loading ? (
          <Spinner />
        ) : notes.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-500">
              No notes uploaded yet
            </h3>
            <p className="text-gray-400 mt-2">
              Share your knowledge with fellow students!
            </p>
            <Link
              to="/upload"
              className="mt-6 inline-flex items-center gap-2 bg-blue-600 text-white py-3 px-8 rounded-xl hover:bg-blue-700 transition"
            >
              <FaUpload />
              Upload Your First Note
            </Link>
          </div>
        ) : (
          <>
            <p className="text-gray-500 mb-6 font-medium">
              {notes.length} {notes.length === 1 ? 'note' : 'notes'} uploaded
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note) => (
                <NoteCard key={note._id} note={note} onDelete={handleDelete} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyNotes;