import { useLocation, useNavigate } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { rasa } from "../assets";
import { navigation } from "../constants";
import Button from "./Button";
import MenuSvg from "../assets/svg/MenuSvg";
import { HamburgerMenu } from "./design/Header";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../store/AuthContext";
import confetti from "canvas-confetti";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signout } = useAuth();
  const [openNavigation, setOpenNavigation] = useState(false);
  const headerRef = useRef(null);
  const [scrollAfterNavigation, setScrollAfterNavigation] = useState(null);

  function handleNameClick() {
    setOpenNavigation(false);
    enablePageScroll();
    navigate("/");
    const duration = 2 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  }

  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };

  useEffect(() => {
    if (scrollAfterNavigation) {
      setTimeout(() => {
        scrollToFunc(scrollAfterNavigation);
        setScrollAfterNavigation(null); // Reset the state
      }, 0); // Execute after the current event loop
    }
  }, [scrollAfterNavigation]);

  const scrollToFunc = function (url) {
    console.log("Scrolling");
    const element = document.querySelector(url);
    if (element) {
      const headerHeight = headerRef.current?.offsetHeight || 0;
      const targetPosition =
        element.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "auto",
      });
    }
  };

  const handleClick = (e, url) => {
    if (e) {
      e.preventDefault();
    }
    console.log(url);

    if (url) {
      if (url.startsWith("#")) {
        navigate("/");
        setScrollAfterNavigation(url);
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
    navigate(`/${formId}`); // Navigate to /signin or /signup
    if (openNavigation) {
      enablePageScroll();
      setOpenNavigation(false);
    }
  };

  const handleSignOut = () => {
    signout();
    const mainSections = document.querySelectorAll("section");
    mainSections.forEach((section) => {
      section.style.display = "block";
    });
    navigate("/"); // Redirect to home page after sign-out
  };

  return (
    <div
      ref={headerRef}
      className={`fixed top-0 left-0 w-full z-50 border-b border-n-6 lg:bg-n-8/90 lg:backdrop-blur-sm ${
        openNavigation ? "bg-n-8" : "bg-n-8/90 backdrop-blur-sm"
      }`}
    >
      <div className="flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4">
        <a
          className="block w-[12rem] xl:mr-8"
          href="#hero"
          onClick={(e) => handleClick(e, "#hero")}
        >
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
            <div className="flex flex-col items-center lg:hidden">
              {user ? (
                <>
                  <button
                    onClick={handleNameClick}
                    className="text-n-1 whitespace-nowrap"
                  >
                    {user.name}
                  </button>
                  <Button
                    className="mt-2 whitespace-nowrap"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <div className="flex flex-col items-center">
                  <Button
                    className="whitespace-nowrap"
                    onClick={() => handleAuthClick("signup")}
                  >
                    New Account
                  </Button>
                  <Button
                    className="mt-2 whitespace-nowrap"
                    onClick={() => handleAuthClick("signin")}
                  >
                    Sign In
                  </Button>
                </div>
              )}
            </div>
          </div>
          <HamburgerMenu />
        </nav>
        <div className="flex items-center ml-auto">
          {user ? (
            <>
              <button
                onClick={handleNameClick}
                className="lg:block mr-4 text-n-1 hidden whitespace-nowrap"
              >
                {user.name}
              </button>
              <Button className="hidden lg:flex" onClick={handleSignOut}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button
                className="text-n-1/50 transition-colors hover:text-n-1 mr-2 lg:mr-4 hidden whitespace-nowrap lg:block"
                onClick={() => handleAuthClick("signup")}
              >
                New Account
              </Button>
              <Button
                className="hidden whitespace-nowrap lg:block"
                onClick={() => handleAuthClick("signin")}
              >
                Sign In
              </Button>
            </>
          )}
          <Button
            className="ml-4 lg:hidden"
            px="px-3"
            onClick={toggleNavigation}
          >
            <MenuSvg openNavigation={openNavigation} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
