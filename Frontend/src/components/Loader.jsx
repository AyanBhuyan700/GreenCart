import React from 'react';

function Loader() {
  return (
    <div className="h-screen flex justify-center items-center bg-white">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-t-[#4fbf8b] border-b-transparent border-l-[#4fbf8b] border-r-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
}

export default Loader;
