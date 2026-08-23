// src/components/Loader.jsx
// A simple reusable loading spinner shown while waiting for API calls.
const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader-spinner"></div>
      <p>Loading...</p>
    </div>
  );
};

export default Loader;
