import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex justify-between items-center">

        <Link to="/" className="flex items-center gap-2 text-lg sm:text-xl font-bold hover:opacity-90 transition">
          <span className="text-yellow-300">📚</span>
          <span>NoteShare</span>
        </Link>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                to="/upload"
                className="bg-white text-blue-600 hover:bg-blue-50 text-xs sm:text-sm font-medium py-1.5 sm:py-2 px-3 sm:px-4 rounded-xl transition"
              >
                📤 <span className="hidden sm:inline">Upload</span>
              </Link>
              <Link
                to="/my-notes"
                className="bg-blue-500 hover:bg-blue-400 text-white text-xs sm:text-sm font-medium py-1.5 sm:py-2 px-3 sm:px-4 rounded-xl transition"
              >
                📖 <span className="hidden sm:inline">My Notes</span>
              </Link>
              <Link
                to="/profile"
                className="bg-purple-500 hover:bg-purple-400 text-white text-xs sm:text-sm font-medium py-1.5 sm:py-2 px-3 sm:px-4 rounded-xl transition"
              >
                👤 <span className="hidden sm:inline">{user.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-400 text-white text-xs sm:text-sm font-medium py-1.5 sm:py-2 px-3 sm:px-4 rounded-xl transition"
              >
                🚪 <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-white text-blue-600 hover:bg-blue-50 text-xs sm:text-sm font-medium py-1.5 sm:py-2 px-3 sm:px-4 rounded-xl transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-yellow-400 hover:bg-yellow-300 text-gray-800 text-xs sm:text-sm font-medium py-1.5 sm:py-2 px-3 sm:px-4 rounded-xl transition"
              >
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