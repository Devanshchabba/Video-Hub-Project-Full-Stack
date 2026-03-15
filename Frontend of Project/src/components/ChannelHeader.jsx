
function ChannelHeader({ user }) {


    console.log("CoverImage is this  --- >",user.coverImage);

    return (
        <div className="border-b pb-4">
            {/* <img src={user.coverImage} alt="cover" className="h-40 w-full object-cover rounded-lg" /> */}
            {user.coverImage ? (<img src={user.coverImage} alt="cover" className="h-40 w-full object-cover rounded-lg" />) : <div className="h-40 w-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg" />}
            {/* <div className="h-40 w-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg" /> */}

            {/* Profile Info */}
            <div className="mt-4 flex items-center gap-4">
                <img
                    src={user.avatar}
                    alt="avatar"
                    className="h-20 w-20 rounded-full border-4 border-white -mt-10"
                />

                <div className="flex-1">
                    <h1 className="text-xl font-bold">{user.name}</h1>
                    <p className="text-sm text-gray-600">
                        {user.subscribers} subscribers • {user.videos} videos
                    </p>
                    <p className="mt-1 text-sm text-gray-700">
                        {/* {user.bio} */}
                    </p>
                </div>

                <button className="rounded-full bg-black px-5 py-2 text-sm font-semibold text-white">
                    Subscribe
                </button>
            </div>
        </div>
    );
}

export default ChannelHeader;
