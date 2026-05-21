import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import NoteCard from '../components/NoteCard';
import Spinner from '../components/Spinner';
import { FaUser, FaBook, FaCalendar, FaUpload } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalNotes: 0,
    totalDownloads: 0,
    averageRating: 0,
  });

  const fetchMyNotes = async () => {
    try {
      const { data } = await axios.get('/notes/my/notes');
      setNotes(data);

      // Calculate stats
      const totalDownloads = data.reduce((acc, note) => acc + (note.views || 0), 0);
      const ratingsSum = data.reduce((acc, note) => acc + (note.averageRating || 0), 0);
      const averageRating = data.length > 0 ? ratingsSum / data.length : 0;

      setStats({
        totalNotes: data.length,
        totalDownloads,
        averageRating,
      });
    } catch (error) {
      toast.error('Failed to fetch profile data');
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
      const updatedNotes = notes.filter((note) => note._id !== id);
      setNotes(updatedNotes);
      setStats((prev) => ({
        ...prev,
        totalNotes: prev.totalNotes - 1,
      }));
    } catch (error) {
      toast.error('Failed to delete note');
    }
  };

  return (
    <div>
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center gap-6">

            {/* Avatar */}
            <div className="bg-white rounded-full p-6">
              <FaUser className="text-blue-600 text-4xl" />
            </div>

            {/* User Info */}
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold">{user?.name}</h1>
              <p className="text-blue-100 mt-1">{user?.email}</p>
              <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
                <FaCalendar className="text-blue-200 text-sm" />
                <span className="text-blue-100 text-sm">
                  Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Upload Button */}
            <div className="sm:ml-auto">
              <Link
                to="/upload"
                className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-800 font-semibold py-3 px-6 rounded-xl transition"
              >
                <FaUpload />
                Upload Notes
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-white bg-opacity-20 rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold">{stats.totalNotes}</div>
              <div className="text-blue-100 text-sm mt-1">Notes Uploaded</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold">{stats.totalDownloads}</div>
              <div className="text-blue-100 text-sm mt-1">Total Downloads</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold">
                {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : 'N/A'}
              </div>
              <div className="text-blue-100 text-sm mt-1">Avg Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          My Uploaded Notes
        </h2>

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NoteCard key={note._id} note={note} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;