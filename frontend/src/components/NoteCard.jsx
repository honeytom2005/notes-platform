import { FaDownload, FaTrash, FaBook, FaUser, FaCalendar } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const NoteCard = ({ note, onDelete }) => {
  const { user } = useAuth();

  const handleDownload = () => {
    window.open(note.fileUrl, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col gap-4 border border-gray-100">
      
      {/* Top Badge */}
      <div className="flex justify-between items-start">
        <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
          Semester {note.semester}
        </span>
        <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">
          {note.subject}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-gray-800 line-clamp-2">
        {note.title}
      </h3>

      {/* Description */}
      {note.description && (
        <p className="text-gray-500 text-sm line-clamp-2">
          {note.description}
        </p>
      )}

      {/* Meta Info */}
      <div className="flex flex-col gap-1 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <FaUser className="text-blue-400" />
          <span>{note.uploaderName}</span>
        </div>
        <div className="flex items-center gap-1">
          <FaCalendar className="text-blue-400" />
          <span>{new Date(note.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mt-auto">
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-xl transition-colors duration-200"
        >
          <FaDownload />
          Download
        </button>

        {/* Show delete only if user owns this note */}
        {user && user._id === note.uploadedBy && (
          <button
            onClick={() => onDelete(note._id)}
            className="flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-600 text-sm font-medium py-2 px-4 rounded-xl transition-colors duration-200"
          >
            <FaTrash />
          </button>
        )}
      </div>
    </div>
  );
};

export default NoteCard;