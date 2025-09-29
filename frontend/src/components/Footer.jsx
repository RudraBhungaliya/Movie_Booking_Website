import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-6 w-full">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} CineBook. All rights reserved.
        </p>
        <p className="text-xs mt-2">
          Built with 🍿 and ❤️ for movie lovers everywhere.
        </p>
      </div>
    </footer>
  );
}

