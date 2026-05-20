import { useState, useEffect } from 'react';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import NoteCard from '../components/NoteCard';
import Spinner from '../components/Spinner';
import { FaSearch, FaBook, FaUpload } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SUBJECTS = [
  'All',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'English',
  'History',
  'Geography',
  'Economics',
  'Other',
];

const SEMESTERS = ['All', '1', '2', '3', '4', '5', '6', '7', '8'];

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('All');
  const [semester, setSemester] = useState('All');
  const { user } = useAuth();

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (subject !== 'All') params.subject = subject;
      if (semester !== 'All') params.semester = semester;

      const { data } = await axios.get('/notes', { params });
      setNotes(data);
    } catch (error) {
      toast.error('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [subject, semester]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchNotes();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await axios.delete(`/notes/${id}`);
      toast.success('Note deleted!');
      setNotes(notes.filter((note) => note._id !== id));
    } catch (error) {
      toast.error('Failed to delete note');
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            📚 Share & Discover Notes
          </h1>
          <p className="text-blue-100 text-lg mb-8">
            Find study notes uploaded by students, for students
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notes by title, subject..."
                className="w-full rounded-xl pl-10 pr-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-300 text-gray-800 font-semibold py-3 px-6 rounded-xl transition"
            >
              Search
            </button>
          </form>

          {/* Upload CTA */}
          {!user && (
            <p className="mt-6 text-blue-100 text-sm">
              Want to share your notes?{' '}
              <Link to="/register" className="text-yellow-300 font-semibold hover:underline">
                Create a free account
              </Link>
            </p>
          )}
          {user && (
            <Link
              to="/upload"
              className="mt-6 inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-800 font-semibold py-3 px-8 rounded-xl transition"
            >
              <FaUpload />
              Upload Your Notes
            </Link>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Stats Bar */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div className="flex gap-4 flex-wrap">
            {/* Subject Filter */}
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s === 'All' ? '📚 All Subjects' : s}
                </option>
              ))}
            </select>

            {/* Semester Filter */}
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {SEMESTERS.map((s) => (
                <option key={s} value={s}>
                  {s === 'All' ? '🎓 All Semesters' : `Semester ${s}`}
                </option>
              ))}
            </select>
          </div>

          {/* Results Count */}
          <span className="text-gray-500 text-sm font-medium">
            {loading ? 'Loading...' : `${notes.length} notes found`}
          </span>
        </div>

        {/* Notes Grid */}
        {loading ? (
          <Spinner />
        ) : notes.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-500">
              No notes found
            </h3>
            <p className="text-gray-400 mt-2">
              Try a different search or filter
            </p>
            {user && (
              <Link
                to="/upload"
                className="mt-4 inline-block bg-blue-600 text-white py-2 px-6 rounded-xl hover:bg-blue-700 transition"
              >
                Be the first to upload!
              </Link>
            )}
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

export default Home;