import React from 'react';

// --- SVG Icons ---
const ThreeDotsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
    </svg>
);

const LikeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.894-2.913 3.614-5.001 6.842-5.001 3.228 0 5.948 2.088 6.842 5.001 1.023 3.328 1.023 6.665 0 9.993-1.021 3.329-3.743 5.002-6.842 5.002-3.228 0-5.949-1.673-6.842-5.002-1.023-3.328-1.023-6.665 0-9.993z" />
    </svg>
);

const DislikeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 15h2.25m-2.25 0h3.375c1.061 0 1.954-.784 1.954-1.833v-1.083m-1.954 1.833H12a2.25 2.25 0 002.25-2.25V6.75m3.375 0h-3.375m-3.375 0h3.375C16.152 6.75 17 5.864 17 4.75V2.25c0-1.114-.9-2-2-2h-3c-1.114 0-2 .886-2 2v2.5M10.75 15v1.5m0-1.5H12a2.25 2.25 0 002.25-2.25V9m-.75-4.5h3.375c.861 0 1.64.589 1.927 1.442l.623 1.841A.75.75 0 0019.5 9h-7.5m-2.25-4.5H9C7.9 4.5 7 5.397 7 6.5V18a2.25 2.25 0 002.25 2.25h8.25c1.114 0 2-.886 2-2V7.75c0-1.114-.9-2-2-2H10.75z" />
    </svg>
);

const ShareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186A4.486 4.486 0 0112 7.5a4.486 4.486 0 014.783 3.207 4.486 4.486 0 000 2.186A4.486 4.486 0 0112 16.5a4.486 4.486 0 01-4.783-3.207m0 0v-.583m0 0H9m12 0a2.25 2.25 0 00-2.25-2.25H15M12 18.75a4.5 4.5 0 110-9 4.5 4.5 0 010 9z" />
    </svg>
);

const CommentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.756 3 12c0 1.09.287 2.123.792 3.03C3.597 15.688 3 16.5 3 17.25c0 .354.128.697.35.952l1.378 1.378c.38.38.868.618 1.392.703C7.032 21.08 7.9 21.75 9 21.75c1.09 0 2.123-.287 3.03-.792.688.204 1.5.312 2.25.312 1.118 0 2.17-.468 2.94-1.298l.004-.007a.997.997 0 00-.004-1.408 1.002 1.002 0 00-1.408.004L13.5 19.5h-.008a3.75 3.75 0 01-2.94 1.298c-1.118 0-2.17-.468-2.94-1.298l-.004-.007a.997.997 0 00-.004-1.408 1.002 1.002 0 00-1.408.004L5.25 18.75V18c0-.75.312-1.5.792-2.03C6.46 14.868 7.5 14.25 8.25 14.25c1.118 0 2.17.468 2.94 1.298l.004.007a.997.997 0 00.004 1.408 1.002 1.002 0 001.408-.004L13.5 16.5h.008a3.75 3.75 0 012.94-1.298c1.118 0 2.17.468 2.94 1.298l.004.007a.997.997 0 00.004 1.408 1.002 1.002 0 001.408-.004L20.25 17.25c0-.75-.312-1.5-.792-2.03C19.54 14.868 18.5 14.25 17.25 14.25h-.008a3.75 3.75 0 01-2.94-1.298c-1.118 0-2.17-.468-2.94-1.298l-.004-.007a.997.997 0 00-.004-1.408 1.002 1.002 0 00-1.408.004L10.5 12.75V12c0-.75-.312-1.5-.792-2.03C9.54 9.132 8.5 8.5 7.25 8.5h-.008a3.75 3.75 0 01-2.94-1.298c-1.118 0-2.17-.468-2.94-1.298l-.004-.007a.997.997 0 00-.004-1.408 1.002 1.002 0 00-1.408.004L3 7.75V7c0-.75.312-1.5.792-2.03C4.46 4.132 5.5 3.5 6.75 3.5h.008a3.75 3.75 0 012.94-1.298c1.118 0 2.17.468 2.94 1.298l.004.007a.997.997 0 00.004 1.408 1.002 1.002 0 001.408-.004L15 4.5h.008a3.75 3.75 0 012.94-1.298c1.118 0 2.17.468 2.94 1.298l.004.007a.997.997 0 00.004 1.408 1.002 1.002 0 001.408-.004L21.75 5.25V5c0-.75-.312-1.5-.792-2.03C20.54 2.132 19.5 1.5 18.25 1.5H18" />
    </svg>
);


// --- Components ---

const PostHeader = ({ channelName, timeAgo, edited }) => (
    <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
            <img className="w-10 h-10 rounded-full" src="https://placehold.co/40x40/3B82F6/FFFFFF?text=BS" alt="Channel Avatar" />
            <div>
                <span className="text-white font-semibold text-sm">{channelName}</span>
                <p className="text-gray-400 text-xs">
                    {timeAgo} {edited && <span className="text-gray-500">(edited)</span>}
                </p>
            </div>
        </div>
        <button className="p-1 rounded-full hover:bg-gray-800">
            <ThreeDotsIcon />
        </button>
    </div>
);

const PostActions = ({ likes, comments }) => (
    <div className="flex items-center space-x-6 mt-4 text-gray-400">
        <button className="flex items-center space-x-2 hover:text-white">
            <LikeIcon />
            <span>{likes}</span>
        </button>
        <button className="hover:text-white">
            <DislikeIcon />
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
            <CommentIcon />
            <span>{comments}</span>
        </button>
        <button className="hover:text-white">
            <ShareIcon />
        </button>
    </div>
);

const PlaylistContent = ({ thumbnail, title, channel, videoCount, firstVideoTitle, firstVideoDuration, secondVideoTitle, secondVideoDuration }) => (
    <div className="bg-gray-800 rounded-lg overflow-hidden mt-3">
        <div className="relative">
            <img className="w-full h-48 object-cover" src={thumbnail} alt="Playlist Thumbnail" />
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-md flex items-center">
                <span className="mr-1">{videoCount} videos</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M2 10a8 8 0 1116 0A8 8 0 012 10zm6.25-3.25a.75.75 0 00-1.5 0v4.69L5.4 9.17a.75.75 0 10-1.2.96l2.5 3.25a.75.75 0 001.137.089l4-5.5a.75.75 0 10-1.138-.992L8.25 10.5V6.75z" clipRule="evenodd" />
                </svg>
            </div>
        </div>
        <div className="p-4">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-gray-400 text-sm">{channel} • Playlist</p>
            <div className="mt-3 space-y-2">
                <div className="flex justify-between items-center text-gray-300 text-sm">
                    <span>{firstVideoTitle}</span>
                    <span>{firstVideoDuration}</span>
                </div>
                <div className="flex justify-between items-center text-gray-300 text-sm">
                    <span>{secondVideoTitle}</span>
                    <span>{secondVideoDuration}</span>
                </div>
            </div>
            <button className="mt-4 w-full text-center text-blue-500 hover:text-blue-400 font-medium text-sm">
                VIEW FULL PLAYLIST
            </button>
        </div>
    </div>
);

const ImageContent = ({ imageUrl }) => (
    <div className="mt-3">
        <img src={imageUrl} alt="Community Post Image" className="w-full rounded-lg object-cover" />
    </div>
);

const CommunityPostCard = ({ post }) => {
    return (
        <div className="bg-gray-900 p-4 rounded-lg shadow-md border border-gray-800">
            <PostHeader channelName={post.channelName} timeAgo={post.timeAgo} edited={post.edited} />
            
            <p className="text-gray-300 text-sm">
                {post.text}
                {post.text.length > 150 && ( // Example: show "Read more" for longer texts
                    <span className="text-blue-500 hover:text-blue-400 cursor-pointer ml-1">Read more</span>
                )}
            </p>

            {post.type === 'playlist' && (
                <PlaylistContent
                    thumbnail={post.content.thumbnail}
                    title={post.content.title}
                    channel={post.content.channel}
                    videoCount={post.content.videoCount}
                    firstVideoTitle={post.content.firstVideoTitle}
                    d
                    firstVideoDuration={post.content.firstVideoDuration}
                    secondVideoTitle={post.content.secondVideoTitle}
                    secondVideoDuration={post.content.secondVideoDuration}
                />
            )}

            {post.type === 'image' && (
                <ImageContent imageUrl={post.content.imageUrl} />
            )}
            
            <PostActions likes={post.likes} comments={post.comments} />
        </div>
    );
};

// --- Mock Data ---
const postData = [
    {
        id: 1,
        channelName: "BeastBoyShub",
        timeAgo: "3 weeks ago",
        edited: false,
        text: "ALL PREVIOUS MEMBERS ONLY STREAMS ARE NOW AVAILABLE FOR EVERYONE!!!\n\nI kept them unlisted so I don't spam everyone's feed with so many _",
        type: "playlist",
        content: {
            thumbnail: "https://placehold.co/600x300/F06292/FFFFFF?text=GOD+OF+WAR",
            title: "EVERYONE CAN WATCH NOW (Previous Members Only_ ",
            channel: "BeastBoyShub - Playlist",
            videoCount: "153",
            firstVideoTitle: "All 8 Valkyries Defeated | 🟢 GOD OF WA_ ",
            firstVideoDuration: "3:41:47",
            secondVideoTitle: "THE FINAL FIGHT WITH BALDUR | 🟢 (GO_ ",
            secondVideoDuration: "3:38:29"
        },
        likes: "2K",
        comments: "185"
    },
    {
        id: 2,
        channelName: "BeastBoyShub",
        timeAgo: "3 months ago",
        edited: true,
        text: "I am coming back sooner than expected. China was unique in many ways. Phantom Blade Zero flew me out to play their new Demo, This game is an upcoming hack n slash/souls like with some insane moveset and animations. I reacted to the trailer some months ago as _",
        type: "image",
        content: {
            imageUrl: "https://placehold.co/600x300/4CAF50/FFFFFF?text=CHINA+TRIP"
        },
        likes: "1.5K",
        comments: "120"
    },
    {
        id: 3,
        channelName: "AnotherCreator",
        timeAgo: "1 day ago",
        edited: false,
        text: "Just released a new video about React hooks! Go check it out!",
        type: "text", // Example of a text-only post
        content: null,
        likes: "500",
        comments: "30"
    }
];

// --- Main Page Component ---
const CommunityPost = () => {
    return (
        <div className="min-h-screen bg-black text-white py-8">
            <div className="container mx-auto max-w-2xl px-4 space-y-6">
                {postData.map(post => (
                    <CommunityPostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
};

export default CommunityPost;
