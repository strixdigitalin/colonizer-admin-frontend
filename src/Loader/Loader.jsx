// Loader.js
import React from "react";
import "./loader.css"

const Loader = () => {
  return (
    <div className="loader-container fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="loader">
        <div className="loader-circle"></div>
      </div>
    </div>
  );
};

export default Loader;
