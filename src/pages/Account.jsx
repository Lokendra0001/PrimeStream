import React from "react";

const Account = () => {
  return (
    <div className="h-[90vh] overflow-y-auto w-full bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Profile Header */}
        <div className="relative">
          {/* Cover Photo */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-400"></div>
          
          {/* Profile Picture */}
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-blue-500 flex items-center justify-center text-white text-5xl font-bold shadow-xl">
              T
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-20 px-6 pb-6 text-center">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-800">TechTuber</h1>
            <p className="text-gray-500">@techtuber</p>
          </div>

          {/* Verified Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              <svg 
                className="w-4 h-4 mr-1" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
              </svg>
              Verified Creator
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">1.2M</div>
              <div className="text-sm text-gray-500">Views</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">245K</div>
              <div className="text-sm text-gray-500">Subscribers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">48</div>
              <div className="text-sm text-gray-500">Videos</div>
            </div>
          </div>

          {/* Bio */}
          <div className="mb-6 text-gray-600">
            <p>Creating tech content that matters. Tutorials, reviews, and more!</p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-3">
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors shadow-md">
              Subscribe
            </button>
            <button className="px-6 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium rounded-full transition-colors">
              Message
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="border-t border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div>
                  <h4 className="font-medium text-gray-800">New Video Uploaded</h4>
                  <p className="text-sm text-gray-500">3 days ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;