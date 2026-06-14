const buildStreamAssetPath = (videoId, assetPath = '') => {
    const normalizedAssetPath = assetPath ? `/${assetPath}` : '';
    return `/api/v1/videos/video/${videoId}/stream${normalizedAssetPath}`;
}

const buildAbsoluteUrl = (req, relativePath) => {
    const requestOrigin = req?.get?.('host') ? `${req.protocol}://${req.get('host')}` : '';
    return requestOrigin ? `${requestOrigin}${relativePath}` : relativePath;
}

const attachPlaybackUrls = (video, req) => {
    if (!video) {
        return video;
    }
    const plainVideo = typeof video.toObject === 'function' ? video.toObject() : { ...video };
    

    const videoId = plainVideo._id?.toString?.() || plainVideo._id;

    if (!videoId) {
        return plainVideo;
    }

    const streamPath = buildStreamAssetPath(videoId);
    const streamUrl = buildAbsoluteUrl(req, streamPath);
    const sourceVideoUrl = plainVideo.videoFile || null;
    const sourceHlsUrl = plainVideo.hlsUrl || null;
    const playbackUrl = sourceVideoUrl || streamUrl;

    return {
        ...plainVideo,
        streamPath,
        streamUrl,
        playbackUrl,
        videoUrl: playbackUrl,
        mp4Url: sourceVideoUrl,
        hlsPlaybackUrl: streamUrl,
        hlsManifestUrl: sourceHlsUrl,
        sourceVideoUrl,
        sourceHlsUrl,
        directVideoUrl: sourceVideoUrl,
        directHlsUrl: sourceHlsUrl,
    };
}

const attachPlaybackUrlsToList = (videos, req) => {
    if (!Array.isArray(videos)) {
        return [];
    }

    return videos.map((video) => attachPlaybackUrls(video, req));
}

export { buildStreamAssetPath, attachPlaybackUrls, attachPlaybackUrlsToList };
