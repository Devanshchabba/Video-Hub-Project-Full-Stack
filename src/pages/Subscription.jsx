import React from 'react';

// --- Reusable Components ---

/**
 * Verified Checkmark Icon Component
 */
const VerifiedIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-gray-400">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
    </svg>
);

/**
 * Bell Icon Component
 */
const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-1.99a4.5 4.5 0 00-4.5-4.5h-3a4.5 4.5 0 00-4.5 4.5v1.99A8.967 8.967 0 013.546 15.77a23.847 23.847 0 005.454 1.31A3.75 3.75 0 0010.5 21h3a3.75 3.75 0 001.357-.918z" />
    </svg>
);

/**
 * Chevron Down Icon Component
 */
const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-4 w-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
);

/**
 * The "Subscribed" button
 */
const SubscribedButton = () => (
    <button className="flex items-center space-x-2 rounded-full bg-gray-700 px-4 py-2 font-medium text-white transition-colors hover:bg-gray-600">
        <BellIcon />
        <span>Subscribed</span>
        <ChevronDownIcon />
    </button>
);

/**
 * A single Subscription Item card
 */
const SubscriptionItem = ({ channel }) => (
    <>
        <div className="flex flex-col items-start space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
                <img className="h-24 w-24 rounded-full object-cover md:h-32 md:w-32" src={channel.avatarUrl} alt={`${channel.name} Avatar`} />
            </div>
            
            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-semibold truncate">{channel.name}</h2>
                    <VerifiedIcon />
                </div>
                <p className="mt-1 text-sm text-gray-400">
                    {channel.handle} • {channel.subscribers}
                </p>
                <p className="mt-2 text-sm text-gray-300 line-clamp-2">
                    {channel.description}
                </p>
            </div>
            
            {/* Button */}
            <div className="flex-shrink-0">
                <SubscribedButton />
            </div>
        </div>
        {/* Separator */}
        <hr className="border-gray-700" />
    </>
);

/**
 * Filter Dropdown Component
 */
const FilterDropdown = () => (
    <div className="mb-8">
        <button className="flex items-center space-x-2 rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700">
            <span>Most relevant</span>
            <ChevronDownIcon />
        </button>
    </div>
);

/**
 * Header Component
 */
const Header = () => (
    <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-white">
            All subscriptions
        </h1>
    </div>
);

// --- Mock Data ---
// In a real app, this would come from an API
const subscriptionsData = [
    {
        id: 1,
        name: "BeastBoyShub",
        handle: "@BeastBoyShub",
        subscribers: "7.02M subscribers",
        description: "Playing Games and Sharing My Thoughts Is What I Do!",
        avatarUrl: "https://placehold.co/128x128/3B82F6/FFFFFF?text=BBS"
    },
    {
        id: 2,
        name: "Peepal Farm",
        handle: "@peepalfarm",
        subscribers: "1.99M subscribers",
        description: "Peepal Farm is a stray animal rescue and an awareness organization, working to help animals heal and be heard. We are located in Village Dhanotu, District Kangra, Himachal Pradesh",
        avatarUrl: "https://placehold.co/128x128/FFFFFF/000000?text=PF"
    },
    {
        id: 3,
        name: "Gagan Choudhary",
        handle: "@GaganChoudhary",
        subscribers: "2.0M subscribers",
        description: "Hi. I do Automobile and Aviation content on the internet. I swear by my audience and always put their interest first. Honesty, transparency and reliability are three key pillars for me.",
        avatarUrl: "https://placehold.co/128x128/16A34A/FFFFFF?text=GC"
    }
];

/**
 * The Main Page Component
 */
const SubscriptionsPage = () => {
    return (
        <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
            <Header />
            <FilterDropdown />

            {/* Subscriptions List */}
            <div className="space-y-6">
                {subscriptionsData.map(channel => (
                    <SubscriptionItem key={channel.id} channel={channel} />
                ))}
            </div>
        </div>
    );
};
export default SubscriptionsPage;
