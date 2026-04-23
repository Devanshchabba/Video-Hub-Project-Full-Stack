import React, { useState } from 'react';
import videoService from '../components/video.js'; // Make sure this path is correct
import Loading from '../assets/Loading.jsx'; // Import your Loading

function UploadVideoForm() {
    // State for text fields
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    // State for files
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);

    // State for UI
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // --- Handlers ---

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setThumbnail(file);
            // Create a local URL to preview the image
            setThumbnailPreview(URL.createObjectURL(file)); 
            setError(null);
        } else {
            setThumbnail(null);
            setThumbnailPreview(null);
            setError('Please select a valid image file (PNG, JPG, etc.).');
        }
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('video/')) {
            setVideoFile(file);
            setError(null);
        } else {
            setVideoFile(null);
            setError('Please select a valid video file (MP4, AVI, etc.).');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !description || !videoFile || !thumbnail) {
            setError('Please fill in all fields and select both files.');
            return;
        }

        setUploading(true);
        setError(null);
        setSuccess(null);

        // We MUST use FormData for file uploads
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('thumbnail', thumbnail);
        formData.append('video', videoFile);
        // console.log(formData)
        try {
            // We'll add this 'uploadVideo' function in Step 2
            const response = await videoService.handleUploadVideo(formData);
            setSuccess('Video uploaded successfully! ID: ' + response.data._id);
            // Clear the form
            setTitle('');
            setDescription('');
            setVideoFile(null);
            setThumbnail(null);
            setThumbnailPreview(null);
            // Reset file inputs (this is a bit of a hack, but effective)
            document.getElementById('videoFile').value = null;
            document.getElementById('thumbnail').value = null;

        } catch (err) {
            setError(err.message || 'An unknown error occurred during upload.');
            throw err
        } finally {
            setUploading(false);
        }
    };

    // --- Render ---

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-4"
        >
            <h2 className="text-2xl font-bold text-center">Upload Your Video</h2>

            {/* Title */
            
            }
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                </label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    required
                />
            </div>

            {/* Description */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                </label>
                <textarea
                    id="description"
                    rows="4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    required
                />
            </div>

            {/* Thumbnail */}
            <div>
                <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">
                    Thumbnail (Image)
                </label>
                <input
                    type="file"
                    id="thumbnail"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                    required
                />
                {/* Thumbnail Preview */}
                {thumbnailPreview && (
                    <div className="mt-4">
                        <img src={thumbnailPreview} alt="Thumbnail Preview" className="w-48 rounded-md" />
                    </div>
                )}
            </div>

            {/* Video File */}
            <div>
                <label htmlFor="videoFile" className="block text-sm font-medium text-gray-700">
                    Video File
                </label>
                <input
                    type="file"
                    id="videoFile"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                    required
                />
                {videoFile && (
                    <p className="text-sm text-gray-600 mt-2">Selected: {videoFile.name}</p>
                )}
            </div>

            {/* Feedback */}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={uploading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
                {uploading ? <Loading /> : 'Upload Video'}
            </button>
        </form>
    );
}

export default UploadVideoForm;