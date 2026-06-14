import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import videoService from '../components/video.js';
import Loading from '../assets/Loading.jsx';
import { getErrorMessage } from '../utils/getErrorMessage.js';

function UploadVideoForm() {
    const { videoId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const isEditing = Boolean(videoId);

    // State for text fields
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    // State for files
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);

    // State for UI
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [loadingVideo, setLoadingVideo] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        if (!isEditing) return;

        const loadVideo = async () => {
            setLoadingVideo(true);
            try {
                const response = await videoService.getVideo(videoId);
                const videoData = response?.data?.data ?? response?.data;
                if (videoData) {
                    setTitle(videoData.title || '');
                    setDescription(videoData.description || '');
                    if (videoData.thumbnail) {
                        setThumbnailPreview(videoData.thumbnail);
                    }
                }
            } catch (err) {
                console.error('Error loading video for edit:', err);
                setError(getErrorMessage(err, 'Unable to load video details.'));
            } finally {
                setLoadingVideo(false);
            }
        };

        loadVideo();
    }, [isEditing, videoId]);

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

    const navigateBack = () => {
        if (location.state?.from) {
            navigate(location.state.from);
        } else {
            navigate(-1);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !description.trim()) {
            setError('Please fill in both title and description.');
            return;
        }

        setUploading(true);
        setError(null);
        setSuccess(null);

        try {
            if (isEditing) {
                const hasFiles = Boolean(thumbnail || videoFile);

                if (hasFiles) {
                    const updateFormData = new FormData();
                    updateFormData.append('title', title.trim());
                    updateFormData.append('description', description.trim());
                    if (thumbnail) updateFormData.append('thumbnail', thumbnail);
                    if (videoFile) updateFormData.append('video', videoFile);
                    await videoService.updateVideo(videoId, updateFormData);
                } else {
                    await videoService.updateVideo(videoId, {
                        title: title.trim(),
                        description: description.trim(),
                    });
                }

                setSuccess('Video updated successfully.');
                navigateBack();
            } else {
                if (!videoFile || !thumbnail) {
                    setError('Please fill in all fields and select both files.');
                    return;
                }

                const formData = new FormData();
                formData.append('title', title.trim());
                formData.append('description', description.trim());
                formData.append('thumbnail', thumbnail);
                formData.append('video', videoFile);

                const response = await videoService.handleUploadVideo(formData);
                setSuccess('Video uploaded successfully! ID: ' + response._id);
                setTitle('');
                setDescription('');
                setVideoFile(null);
                setThumbnail(null);
                setThumbnailPreview(null);
                document.getElementById('videoFile').value = null;
                document.getElementById('thumbnail').value = null;
            }
        } catch (err) {
            setError(getErrorMessage(err, isEditing ? 'Unable to update video.' : 'An unknown error occurred during upload.'));
        } finally {
            setUploading(false);
        }
    };

    if (isEditing && loadingVideo) {
        return (
            <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md text-center">
                <p className="text-gray-700">Loading video details...</p>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-4"
        >
            <h2 className="text-2xl font-bold text-center">
                {isEditing ? 'Edit Video' : 'Upload Your Video'}
            </h2>

            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-white">
                    Title
                </label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className=" dark:text-white dark:bg-gray-700 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    required
                />
            </div>

            {/* Description */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-white">
                    Description
                </label>
                <textarea
                    id="description"
                    rows="4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="dark:text-white dark:bg-gray-700 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    required
                />
            </div>

            {/* Thumbnail */}
            <div>
                <label htmlFor="thumbnail" className=" dark:text-white block text-sm font-medium text-gray-700">
                    Thumbnail (Image)
                </label>
                <input
                    type="file"
                    id="thumbnail"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className=" dark:text-white dark:bg-gray-700 mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                    required={!isEditing}
                />
                {/* Thumbnail Preview */}
                {thumbnailPreview && (
                    <div className="mt-4">
                        <img src={thumbnailPreview} alt="Thumbnail Preview" className="w-48 rounded-md" />
                    </div>
                )}
                {isEditing && (
                    <p className="text-xs text-gray-500 mt-2">Leave thumbnail empty to keep the existing image.</p>
                )}
            </div>

            {/* Video File */}
            <div>
                <label htmlFor="videoFile" className="block text-sm font-medium dark:text-white text-gray-700">
                    Video File
                </label>
                <input
                    type="file"
                    id="videoFile"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className=" dark:text-white dark:bg-gray-700 mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                    required={!isEditing}
                />
                {videoFile && (
                    <p className="text-sm text-gray-600 mt-2">Selected: {videoFile.name}</p>
                )}
                {isEditing && (
                    <p className="text-xs text-gray-500 mt-2">Leave video empty to keep the existing file.</p>
                )}
            </div>

            {/* Feedback */}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}

            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={navigateBack}
                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={uploading}
                    className="w-full rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                >
                    {uploading ? <Loading /> : isEditing ? 'Save Changes' : 'Upload Video'}
                </button>
            </div>
        </form>
    );
}

export default UploadVideoForm;
