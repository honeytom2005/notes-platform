import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import { FaUpload, FaFilePdf } from 'react-icons/fa';
import { KTU_DATA, DEPARTMENTS, SCHEMES, SEMESTERS } from '../data/ktuData';

const Upload = () => {
  const [formData, setFormData] = useState({
    title: '',
    scheme: '',
    department: '',
    semester: '',
    subject: '',
    description: '',
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Get subjects based on scheme, department, semester
  const getSubjects = () => {
    const { scheme, department, semester } = formData;
    if (scheme && department && semester) {
      return KTU_DATA[scheme]?.[department]?.[semester] || [];
    }
    return [];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Reset dependent fields when parent changes
    if (name === 'scheme') {
      setFormData({ ...formData, scheme: value, department: '', semester: '', subject: '' });
    } else if (name === 'department') {
      setFormData({ ...formData, department: value, semester: '', subject: '' });
    } else if (name === 'semester') {
      setFormData({ ...formData, semester: value, subject: '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === 'application/pdf') {
      setFile(selected);
    } else {
      toast.error('Please select a PDF file only!');
      e.target.value = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a PDF file!');
      return;
    }
    if (!formData.subject) {
      toast.error('Please select a subject!');
      return;
    }
    setLoading(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('scheme', formData.scheme);
      data.append('department', formData.department);
      data.append('semester', formData.semester);
      data.append('subject', formData.subject);
      data.append('description', formData.description);
      data.append('file', file);

      await axios.post('/notes', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Notes uploaded successfully!');
      navigate('/my-notes');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const subjects = getSubjects();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <div className="bg-blue-100 p-4 rounded-full">
              <FaUpload className="text-blue-600 text-3xl" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Upload Notes</h1>
          <p className="text-gray-500 text-sm mt-1">
            Share your study notes with fellow students
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Data Structures Module 1 Notes"
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Scheme */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Scheme <span className="text-red-500">*</span>
            </label>
            <select
              name="scheme"
              value={formData.scheme}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Scheme</option>
              {SCHEMES.map((s) => (
                <option key={s} value={s}>KTU {s} Scheme</option>
              ))}
            </select>
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department <span className="text-red-500">*</span>
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              disabled={!formData.scheme}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">
                {formData.scheme ? 'Select Department' : 'Select Scheme first'}
              </option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Semester */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Semester <span className="text-red-500">*</span>
            </label>
            <select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              required
              disabled={!formData.department}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">
                {formData.department ? 'Select Semester' : 'Select Department first'}
              </option>
              {SEMESTERS.map((s) => (
                <option key={s} value={s}>Semester {s}</option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject <span className="text-red-500">*</span>
            </label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              disabled={!formData.semester}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">
                {formData.semester ? 'Select Subject' : 'Select Semester first'}
              </option>
              {subjects.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of the notes..."
              rows={3}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PDF File <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition">
              <FaFilePdf className="text-red-400 text-4xl mx-auto mb-2" />
              {file ? (
                <p className="text-sm text-green-600 font-medium">{file.name}</p>
              ) : (
                <p className="text-sm text-gray-500">Click to select a PDF file</p>
              )}
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="mt-3 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Uploading...
              </>
            ) : (
              <>
                <FaUpload />
                Upload Notes
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;