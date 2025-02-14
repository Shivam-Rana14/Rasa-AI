import { useLocation, useNavigate } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { rasa } from "../assets";
import { navigation } from "../constants";
import Button from "./Button";
import MenuSvg from "../assets/svg/MenuSvg";
import { HamburgerMenu } from "./design/Header";
import { useState } from "react";
import { showAuthForm } from "../utils/auth";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openNavigation, setOpenNavigation] = useState(false);
  const { user, signout } = useAuth();

  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };

  const handleClick = (e, url) => {
    e.preventDefault();

    if (url.startsWith('#')) {
      // Handle anchor links
      const element = document.querySelector(url);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Handle route navigation
      if (url === '/rasa-ai' && !user) {
        // If trying to access Rasa AI without being logged in
        handleAuthClick('signIn');
      } else {
        navigate(url);
      }
    }

    if (openNavigation) {
      enablePageScroll();
      setOpenNavigation(false);
    }
  };

  const handleAuthClick = (formId) => {
    showAuthForm(formId);
    handleClick();
  };

  const handleSignOut = () => {
    signout();
    // Show all sections after signing out
    const mainSections = document.querySelectorAll('section');
    mainSections.forEach(section => {
      section.style.display = 'block';
    });
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 border-b border-n-6 lg:bg-n-8/90 lg:backdrop-blur-sm ${
        openNavigation ? "bg-n-8" : "bg-n-8/90 backdrop-blur-sm"
      }`}
    >
      <div className="flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4">
        <a className="block w-[12rem] xl:mr-8" href="#hero" onClick={(e) => handleClick(e, '#hero')}>
          <img src={rasa} width={190} height={40} alt="Rasa.ai" />
        </a>
        <nav
          className={`${openNavigation ? `flex` : `hidden`}
           fixed top-[5rem] left-0 right-0 bottom-0 bg-n-8 lg:static lg:flex lg:mx-auto lg:bg-transparent`}
        >
          <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
            {navigation.map((item) => (
              <a
                key={item.id}
                href={item.url}
                onClick={(e) => handleClick(e, item.url)}
                className={`block relative font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 ${
                  item.onlyMobile ? "lg:hidden" : ""
                } px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold ${
                  item.url === location.hash
                    ? "z-2 lg:text-n-1"
                    : "lg:text-n-1/50"
                } lg:leading-5 lg:hover:text-n-1 xl:px-12`}
              >
                {item.title}
              </a>
            ))}
          </div>
          <HamburgerMenu />
        </nav>
        {user ? (
          <>
            <span className="hidden lg:block mr-8 text-n-1">
              Welcome, {user.name}
            </span>
            <Button className="hidden lg:flex" onClick={handleSignOut}>
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <Button
              className="hidden mr-8 text-n-1/50 transition-colors hover:text-n-1 lg:block"
              onClick={() => handleAuthClick('signUp')}
            >
              New Account
            </Button>
            <Button
              className="hidden lg:flex"
              onClick={() => handleAuthClick('signIn')}
            >
              Sign In
            </Button>
          </>
        )}
        <Button
          className="ml-auto lg:hidden"
          px="px-3"
          onClick={toggleNavigation}
        >
          <MenuSvg openNavigation={openNavigation} />
        </Button>
      </div>
    </div>
  );
};

export default Header;
