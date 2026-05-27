import { useState, useEffect } from 'react';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import NoteCard from '../components/NoteCard';
import Spinner from '../components/Spinner';
import { FaSearch, FaUpload } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { KTU_DATA, DEPARTMENTS, SCHEMES, SEMESTERS } from '../data/ktuData';

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [scheme, setScheme] = useState('');
  const [department, setDepartment] = useState('');
  const [semester, setSemester] = useState('');
  const [subject, setSubject] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const { user } = useAuth();

  const getSubjects = () => {
    if (scheme && department && semester) {
      return KTU_DATA[scheme]?.[department]?.[semester] || [];
    }
    return [];
  };

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (scheme) params.scheme = scheme;
      if (department) params.department = department;
      if (semester) params.semester = semester;
      if (subject) params.subject = subject;

      const { data } = await axios.get('/notes', { params });

// Sort notes
const sorted = [...data].sort((a, b) => {
  if (sortBy === 'rating') {
    return (b.averageRating || 0) - (a.averageRating || 0);
  }
  return new Date(b.createdAt) - new Date(a.createdAt);
});

setNotes(sorted);
      setNotes(data);
    } catch (error) {
      toast.error('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  fetchNotes();
}, [scheme, department, semester, subject, sortBy]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchNotes();
  };

  const handleSchemeChange = (e) => {
    setScheme(e.target.value);
    setDepartment('');
    setSemester('');
    setSubject('');
  };

  const handleDepartmentChange = (e) => {
    setDepartment(e.target.value);
    setSemester('');
    setSubject('');
  };

  const handleSemesterChange = (e) => {
    setSemester(e.target.value);
    setSubject('');
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

  const handleClearFilters = () => {
    setScheme('');
    setDepartment('');
    setSemester('');
    setSubject('');
    setSearch('');
  };

  const subjects = getSubjects();
  const hasFilters = scheme || department || semester || subject || search;

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 sm:py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl sm:text-5xl font-bold mb-3">
            📚 Share & Discover Notes
          </h1>
          <p className="text-blue-100 text-sm sm:text-lg mb-6">
            Learn together , Grow together
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notes..."
                className="w-full rounded-xl pl-8 pr-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-300 text-gray-800 font-semibold py-2.5 px-4 rounded-xl transition text-sm"
            >
              Search
            </button>
          </form>

          {/* CTA */}
          {!user && (
            <p className="mt-4 text-blue-100 text-xs sm:text-sm">
              Want to share your notes?{' '}
              <Link to="/register" className="text-yellow-300 font-semibold hover:underline">
                Create a free account
              </Link>
            </p>
          )}
          {user && (
            <Link
              to="/upload"
              className="mt-4 inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-800 font-semibold py-2 px-6 rounded-xl transition text-sm"
            >
              <FaUpload />
              Upload Notes
            </Link>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-10">

        {/* Filter Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-700">
              Filter Notes
            </h2>
            {hasFilters && (
              <button
                onClick={handleClearFilters}
                className="text-xs sm:text-sm text-red-500 hover:text-red-700 font-medium transition"
              >
                Clear Filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Scheme
              </label>
              <select
                value={scheme}
                onChange={handleSchemeChange}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">All Schemes</option>
                {SCHEMES.map((s) => (
                  <option key={s} value={s}>KTU {s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={handleDepartmentChange}
                disabled={!scheme}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">
                  {scheme ? 'All Depts' : 'Select Scheme'}
                </option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Semester
              </label>
              <select
                value={semester}
                onChange={handleSemesterChange}
                disabled={!department}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">
                  {department ? 'All Sems' : 'Select Dept'}
                </option>
                {SEMESTERS.map((s) => (
                  <option key={s} value={s}>Sem {s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={!semester}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">
                  {semester ? 'All Subjects' : 'Select Sem'}
                </option>
                {subjects.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count + Sort */}
<div className="flex justify-between items-center mb-4 sm:mb-6">
  <span className="text-gray-500 text-xs sm:text-sm font-medium">
    {loading ? 'Loading...' : `${notes.length} notes found`}
  </span>
  <div className="flex items-center gap-2">
    {hasFilters && (
      <span className="text-blue-600 text-xs sm:text-sm font-medium">
        Filters applied
      </span>
    )}
    <select
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value)}
      className="border border-gray-300 rounded-xl px-3 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
    >
      <option value="newest">Newest First</option>
      <option value="rating">Top Rated</option>
    </select>
  </div>
</div>

        {/* Notes Grid */}
        {loading ? (
          <Spinner />
        ) : notes.length === 0 ? (
          <div className="text-center py-16 sm:py-20">
            <div className="text-5xl sm:text-6xl mb-4">🔍</div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-500">
              No notes found
            </h3>
            <p className="text-gray-400 mt-2 text-sm">
              Try different filters or search terms
            </p>
            {hasFilters && (
              <button
                onClick={handleClearFilters}
                className="mt-4 inline-block bg-blue-600 text-white py-2 px-6 rounded-xl hover:bg-blue-700 transition text-sm"
              >
                Clear All Filters
              </button>
            )}
            {user && (
              <Link
                to="/upload"
                className="mt-4 ml-3 inline-block bg-green-600 text-white py-2 px-6 rounded-xl hover:bg-green-700 transition text-sm"
              >
                Upload Notes
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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