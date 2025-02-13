import ButtonGradient from "./assets/svg/ButtonGradient";
import Benefits from "./components/Benefits";
import Collaboration from "./components/Collaboration";
import Header from "./components/Header";
import Hero from "./components/Hero";
import HowToUse from "./components/HowToUse";
import Pricing from "./components/Pricing";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import { AuthProvider } from "./context/AuthContext";


const App = () => {
  return (
    <AuthProvider>
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Header />
        <div id="signIn" className="hidden">
          <SignIn />
        </div>
        <div id="signUp" className="hidden">
          <SignUp />
        </div>
        <Hero />
        <Benefits />
        <Collaboration />
          <HowToUse />
          <Pricing />
      </div>
      <ButtonGradient />
    </AuthProvider>
  );
};

export default App;
