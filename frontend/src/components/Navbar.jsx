import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBook, FaUpload, FaSignOutAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold hover:opacity-90 transition"
        >
          <FaBook className="text-yellow-300" />
          <span>NoteShare</span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm hidden sm:block text-blue-100">
                Hi, {user.name}!
              </span>
              <Link
                to="/upload"
                className="flex items-center gap-1 bg-white text-blue-600 hover:bg-blue-50 text-sm font-medium py-2 px-4 rounded-xl transition"
              >
                <FaUpload />
                <span className="hidden sm:block">Upload</span>
              </Link>
              <Link
                to="/my-notes"
                className="flex items-center gap-1 bg-blue-500 hover:bg-blue-400 text-white text-sm font-medium py-2 px-4 rounded-xl transition"
              >
                <FaBook />
                <span className="hidden sm:block">My Notes</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 bg-red-500 hover:bg-red-400 text-white text-sm font-medium py-2 px-4 rounded-xl transition"
              >
                <FaSignOutAlt />
                <span className="hidden sm:block">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-1 bg-white text-blue-600 hover:bg-blue-50 text-sm font-medium py-2 px-4 rounded-xl transition"
              >
                <FaSignInAlt />
                Login
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-300 text-gray-800 text-sm font-medium py-2 px-4 rounded-xl transition"
              >
                <FaUserPlus />
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;