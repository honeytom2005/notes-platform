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
  const { user } = useAuth();

  // Get subjects based on scheme, department, semester
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
      setNotes(data);
    } catch (error) {
      toast.error('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [scheme, department, semester, subject]);

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
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            📚 Share & Discover Notes
          </h1>
          <p className="text-blue-100 text-lg mb-8">
            Find KTU study notes uploaded by students, for students
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notes by title or subject..."
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

        {/* Filter Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Filter Notes
            </h2>
            {hasFilters && (
              <button
                onClick={handleClearFilters}
                className="text-sm text-red-500 hover:text-red-700 font-medium transition"
              >
                Clear Filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Scheme */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Scheme
              </label>
              <select
                value={scheme}
                onChange={handleSchemeChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">All Schemes</option>
                {SCHEMES.map((s) => (
                  <option key={s} value={s}>KTU {s}</option>
                ))}
              </select>
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={handleDepartmentChange}
                disabled={!scheme}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">
                  {scheme ? 'All Departments' : 'Select Scheme first'}
                </option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Semester */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Semester
              </label>
              <select
                value={semester}
                onChange={handleSemesterChange}
                disabled={!department}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">
                  {department ? 'All Semesters' : 'Select Department first'}
                </option>
                {SEMESTERS.map((s) => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={!semester}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">
                  {semester ? 'All Subjects' : 'Select Semester first'}
                </option>
                {subjects.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-gray-500 text-sm font-medium">
            {loading ? 'Loading...' : `${notes.length} notes found`}
          </span>
          {hasFilters && (
            <span className="text-blue-600 text-sm font-medium">
              Filters applied
            </span>
          )}
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
              Try different filters or search terms
            </p>
            {hasFilters && (
              <button
                onClick={handleClearFilters}
                className="mt-4 inline-block bg-blue-600 text-white py-2 px-6 rounded-xl hover:bg-blue-700 transition"
              >
                Clear All Filters
              </button>
            )}
            {user && (
              <Link
                to="/upload"
                className="mt-4 ml-3 inline-block bg-green-600 text-white py-2 px-6 rounded-xl hover:bg-green-700 transition"
              >
                Upload Notes
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