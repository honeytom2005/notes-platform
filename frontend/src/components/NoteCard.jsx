import { useState } from 'react';
import { FaTrash, FaUser, FaCalendar, FaStar, FaEye } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import toast from 'react-hot-toast';

const NoteCard = ({ note, onDelete }) => {
  const { user } = useAuth();
  const [averageRating, setAverageRating] = useState(note.averageRating || 0);
  const [totalRatings, setTotalRatings] = useState(note.ratings?.length || 0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [views, setViews] = useState(note.views || 0);
  const [userRating, setUserRating] = useState(() => {
    if (user && note.ratings) {
      const found = note.ratings.find((r) => r.user === user._id);
      return found ? found.rating : 0;
    }
    return 0;
  });

  const handleView = () => {
  const pdfUrl = `https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(note.fileUrl)}`;
  window.open(pdfUrl, '_blank');
};

const handleOpenPDF = async () => {
  try {
    const { data } = await axios.put(`/notes/${note._id}/views`);
    setViews(data.views);
  } catch (error) {
    console.log('View count error:', error);
  }

  // Use Google Docs viewer instead of Drive viewer
  const fileUrl = note.fileUrl;
  const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=false`;
  window.open(googleDocsUrl, '_blank');
};
  const handleRate = async (rating) => {
    if (!user) {
      toast.error('Please login to rate notes!');
      return;
    }
    try {
      const { data } = await axios.post(`/notes/${note._id}/rate`, { rating });
      setAverageRating(data.averageRating);
      setTotalRatings(data.totalRatings);
      setUserRating(rating);
      toast.success('Rating submitted!');
    } catch (error) {
      toast.error('Failed to submit rating');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-4 sm:p-6 flex flex-col gap-3 border border-gray-100">

      {/* Top Badges */}
      <div className="flex flex-wrap gap-1.5">
        <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">
          S{note.semester}
        </span>
        <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-0.5 rounded-full">
          {note.department}
        </span>
        <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
          {note.scheme} Scheme
        </span>
      </div>

      {/* Title */}
      <h3 className="text-base sm:text-lg font-bold text-gray-800 line-clamp-2">
        {note.title}
      </h3>

      {/* Subject */}
      <p className="text-blue-600 text-xs sm:text-sm font-medium">
        {note.subject}
      </p>

      {/* Description */}
      {note.description && (
        <p className="text-gray-500 text-xs sm:text-sm line-clamp-2">
          {note.description}
        </p>
      )}

      {/* Star Rating */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={`cursor-pointer text-lg transition-colors duration-150 ${
                star <= (hoveredStar || userRating || averageRating)
                  ? 'text-yellow-400'
                  : 'text-gray-300'
              }`}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              onClick={() => handleRate(star)}
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">
            {averageRating > 0
              ? `${averageRating.toFixed(1)} (${totalRatings})`
              : 'No ratings'}
          </span>
        </div>
        {user && userRating > 0 && (
          <p className="text-xs text-green-600">
            You rated {userRating} star{userRating > 1 ? 's' : ''}
          </p>
        )}
        {!user && (
          <p className="text-xs text-gray-400">
            Login to rate
          </p>
        )}
      </div>

      {/* Meta Info */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <FaUser className="text-blue-400" />
          <span>{note.uploaderName}</span>
        </div>
        <div className="flex items-center gap-1">
          <FaCalendar className="text-blue-400" />
          <span>{new Date(note.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <FaEye className="text-blue-400" />
          <span>{views} {views === 1 ? 'download' : 'downloads'}</span>
        </div>
      </div>

      {/* Buttons */}
<div className="flex gap-2 mt-auto">
  <button
    onClick={handleOpenPDF}
    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium py-2 px-3 rounded-xl transition-colors duration-200"
  >
    <FaEye />
    Open PDF
  </button>
  {user && user._id === note.uploadedBy && (
    <button
      onClick={() => onDelete(note._id)}
      className="flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-600 text-xs sm:text-sm font-medium py-2 px-3 rounded-xl transition-colors duration-200"
    >
      <FaTrash />
    </button>
  )}
</div>
    </div>
  );
};

export default NoteCard;