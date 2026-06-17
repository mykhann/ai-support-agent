import { useState } from "react";
import LandingPage from "./components/LandingPage";
import FaqScreen from "./components/FaqScreen"; 

function App() {
  const [viewMode, setViewMode] = useState("landing"); 

  return (
    <>
      {viewMode === "landing" ? (
        <LandingPage onEnterChat={() => setViewMode("chat")} />
      ) : (
        <FaqScreen onBackToHome={() => setViewMode("landing")} />
      )}
    </>
  );
}

export default App;