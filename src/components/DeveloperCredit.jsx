import { Instagram, Github, Linkedin } from "lucide-react";
import { curve } from "../assets";
import { useState, useRef, useEffect } from "react";

const DeveloperCredit = () => {
  const socialLinks = [
    {
      icon: <Instagram className="h-5 w-5 text-color-6" />,
      url: "https://www.instagram.com/__shivam.rana__/?hl=en#",
      label: "Instagram",
    },
    {
      icon: <Github className="h-5 w-5 text-color-4" />,
      url: "https://github.com/Shivam-Rana14",
      label: "GitHub",
    },
    {
      icon: <Linkedin className="h-5 w-5 " />,
      url: "https://www.linkedin.com/in/shivam-rana-/",
      label: "LinkedIn",
    },
  ];

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showSmiley, setShowSmiley] = useState(false);
  const [smileyPosition, setSmileyPosition] = useState({ x: 50, y: 50 });
  const [transitionSpeed, setTransitionSpeed] = useState(3);
  const [cycleTimeout, setCycleTimeout] = useState(null);

  const handleClick = () => {
    setIsModalVisible(true);
    setShowSmiley(false);

    const hideTimeout = setTimeout(() => {
      setIsModalVisible(false);
    }, 10000);

    if (cycleTimeout) {
      clearTimeout(cycleTimeout);
    }
    setCycleTimeout(hideTimeout);
    return () => clearTimeout(hideTimeout);
  };

  useEffect(() => {
    const moveSmiley = () => {
      const newX = Math.random() * (window.innerWidth - 40);
      const newY = Math.random() * (window.innerHeight - 40);

      setTransitionSpeed(5);

      setTimeout(() => {
        setTransitionSpeed(3);
      }, 500);

      setSmileyPosition({ x: newX, y: newY });
    };

    const moveInterval = setInterval(moveSmiley, 3000);

    return () => clearInterval(moveInterval);
  }, []);

  useEffect(() => {
    const showSmileyCycle = () => {
      setShowSmiley(true);
      const showTimeout = setTimeout(() => {
        setShowSmiley(false);
        const hideTimeout = setTimeout(showSmileyCycle, 120000);
        setCycleTimeout(hideTimeout);
        return () => clearTimeout(hideTimeout);
      }, 10000);
      return () => clearTimeout(showTimeout);
    };

    showSmileyCycle();
    return () => {
      if (cycleTimeout) {
        clearTimeout(cycleTimeout);
      }
    };
  }, []);

  return (
    <>
      {showSmiley && (
        <div
          className="fixed z-20 cursor-pointer"
          style={{
            left: `${smileyPosition.x}px`,
            top: `${smileyPosition.y}px`,
            transition: `left ${transitionSpeed}s ease-in-out, top ${transitionSpeed}s ease-in-out`,
          }}
          onClick={handleClick}
        >
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 h-8 text-yellow-400"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 3a1 1 0 100 2 1 1 0 000-2zm-3 7a1 1 0 112 0v4a1 1 0 11-2 0v-4zm6 0a1 1 0 112 0v4a1 1 0 11-2 0v-4z"
                clipRule="evenodd"
              />
            </svg>
            <div className="absolute -top-10 left-0 bg-n-7 text-n-2 p-2 rounded-md shadow-md whitespace-nowrap">
              Click Me!
            </div>
          </div>
        </div>
      )}

      {isModalVisible && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50">
          <div className="bg-n-8 p-8 rounded-lg shadow-lg">
            <div className="text-center mb-4">
              <p className="text-sm text-n-2">Crafted with passion by</p>
              <p className="text-lg text-color-3 font-semibold relative inline-block">
                Shivam Rana
                <img
                  src={curve}
                  className="absolute bottom-0 left-0 w-full xl:-mb-1"
                  width={624}
                  height={20}
                  alt="Curve"
                />
              </p>
            </div>

            <div className="flex justify-center gap-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-n-6 hover:bg-n-5 transition-colors"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeveloperCredit;
