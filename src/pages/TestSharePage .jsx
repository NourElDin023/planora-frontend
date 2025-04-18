import React from "react";
import SharePageComponent from "../components/SharePageComponent";

const TestSharePage = () => {
  const mockCurrentUser = "ayat"; // Just a mock current user

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Test Sharing Page</h1>
      <SharePageComponent pageId={1} currentUser={mockCurrentUser} />
    </div>
  );
};

export default TestSharePage;
