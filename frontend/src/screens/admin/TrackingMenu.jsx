import React, { useEffect } from 'react';

const RedirectComponent = ({ url }) => {
  useEffect(() => {
    // Redirect to the specified URL when the component mounts
    window.location.href = url;
  }, [url]); // Run this effect whenever the URL prop changes

  // Render null since this component immediately redirects
  return null;
};

const TrackingScreen = () => {
  return (
    <div>
      <h1>You are Redirecting</h1>
      <p>Redirecting to Inspired Tech Tracking...</p>
      <RedirectComponent url='http://localhost:3006/' />
    </div>
  );
};

export default TrackingScreen;
