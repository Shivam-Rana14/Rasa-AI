import ButtonGradient from "./assets/svg/ButtonGradient";
import Benefits from "./components/Benefits";
import Collaboration from "./components/Collaboration";
import Header from "./components/Header";
import Hero from "./components/Hero";
import HowToUse from "./components/HowToUse";
import Pricing from "./components/Pricing";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import RasaAI from "./components/RasaAI";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./store/AuthContext";
import { Routes, Route } from "react-router-dom";
import RasaAiContextProvider from "./store/RasaAiContext";
import DeveloperCredit from "./components/DeveloperCredit";

const App = () => {
  return (
    <AuthProvider>
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Header />
        <Routes>
          <Route
            path="/rasa-ai"
            element={
              <ProtectedRoute>
                <RasaAiContextProvider>
                  <RasaAI />
                </RasaAiContextProvider>
              </ProtectedRoute>
            }
          />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/"
            element={
              <>
                <Hero />
                <Benefits />
                <Collaboration />
                <HowToUse />
                <Pricing />
                <DeveloperCredit />
              </>
            }
          />
        </Routes>
      </div>
      <ButtonGradient />
    </AuthProvider>
  );
};

export default App;
