import { howToUse } from "../constants";
import Heading from "./Heading";
import Section from "./Section";
import { GradientLight } from "./design/Benefits";
import ClipPath from "../assets/svg/ClipPath";
import Arrow from "../assets/svg/Arrow";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const HowToUse = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [userInteracted, setUserInteracted] = useState(false);

  const minSwipeDistance = 50;

  const defaultInterval = 3000;
  const extendedInterval = 6000;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const interval = setInterval(
      () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % howToUse.length);
      },
      userInteracted ? extendedInterval : defaultInterval
    );

    if (userInteracted) {
      const timer = setTimeout(() => {
        setUserInteracted(false);
      }, extendedInterval);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }

    return () => clearInterval(interval);
  }, [userInteracted]);

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      //go to next card
      setCurrentIndex((prevIndex) => (prevIndex + 1) % howToUse.length);
      setUserInteracted(true);
    } else if (isRightSwipe) {
      //go to previous card
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + howToUse.length) % howToUse.length
      );
      setUserInteracted(true);
    }
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
    setUserInteracted(true);
  };

  const handleArrowClick = (direction) => {
    if (direction === "next") {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % howToUse.length);
    } else {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + howToUse.length) % howToUse.length
      );
    }
    setUserInteracted(true);
  };

  const mobileCardVariants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  };

  const renderPaginationDots = () => {
    return (
      <div className="flex justify-center gap-2 mt-8">
        {howToUse.map((_, index) => (
          <button
            key={`dot-${index}`}
            onClick={() => handleDotClick(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? "bg-primary w-4" : "bg-n-4"
            }`}
            aria-label={`Go to step ${index + 1}`}
          />
        ))}
      </div>
    );
  };

  return (
    <Section id="how-to-use" crosses className="py-16">
      <div className="container relative z-2">
        <Heading
          className="md:max-w-md lg:max-w-2xl xl:max-w-4xl"
          title="How to Get Started"
          text="Transform your style in just a few simple steps with our AI-powered fashion assistant"
        />

        {isMobile ? (
          // Mobile view with improved card sizing
          <div className="mb-10">
            <div
              className="relative h-[28rem] mx-auto"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <div className="overflow-hidden mx-auto px-4">
                <AnimatePresence initial={false} mode="wait">
                  <motion.div
                    key={`mobile-card-${currentIndex}`}
                    variants={mobileCardVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="relative p-0.5 bg-no-repeat bg-[length:100%_100%] rounded-2xl overflow-hidden mx-auto"
                    style={{
                      backgroundImage: `url(${howToUse[currentIndex].backgroundUrl})`,
                      width: "100%",
                      maxWidth: "320px",
                      height: "26rem",
                    }}
                  >
                    <div className="relative z-2 flex flex-col h-full p-6">
                      <div className="flex items-center justify-center mb-5 w-12 h-12 bg-n-6 rounded-xl">
                        <img
                          src={howToUse[currentIndex].iconUrl}
                          width={24}
                          height={24}
                          alt={howToUse[currentIndex].title}
                        />
                      </div>

                      <h5 className="h5 mb-4">
                        {howToUse[currentIndex].title}
                      </h5>
                      <p className="body-2 mb-6 text-n-3">
                        {howToUse[currentIndex].text}
                      </p>

                      <div className="flex items-center mt-auto w-full">
                        <div className="flex items-center justify-center w-10 h-10 bg-n-6 rounded-xl">
                          <div className="flex items-center justify-center w-8 h-8 bg-n-7 rounded-[0.75rem]">
                            <div className="font-code text-xs font-bold text-n-3">
                              {String(
                                Number(howToUse[currentIndex].id) + 1
                              ).padStart(2, "00")}
                            </div>
                          </div>
                        </div>
                        <p className="ml-auto font-code text-xs font-bold text-n-1 uppercase tracking-wider">
                          Step {Number(howToUse[currentIndex].id) + 1}
                        </p>
                        <Arrow className="ml-2" />
                      </div>
                    </div>

                    {<GradientLight />}

                    <div
                      className="absolute inset-0.5 bg-n-8"
                      style={{ clipPath: "url(#benefits)" }}
                    >
                      <div className="absolute inset-0 opacity-0 transition-opacity hover:opacity-10"></div>
                    </div>

                    <ClipPath />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-2 px-4">
              {renderPaginationDots()}

              <div className="flex justify-between mt-4 max-w-xs mx-auto">
                <button
                  onClick={() => handleArrowClick("prev")}
                  className="p-2 bg-n-7 rounded-full hover:bg-n-6 transition-colors"
                  aria-label="Previous step"
                >
                  <Arrow className="transform rotate-180" />
                </button>
                <button
                  onClick={() => handleArrowClick("next")}
                  className="p-2 bg-n-7 rounded-full hover:bg-n-6 transition-colors"
                  aria-label="Next step"
                >
                  <Arrow />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="relative h-[30rem] w-full mb-8">
              {howToUse.map((item, index) => {
                const distance =
                  (index - currentIndex + howToUse.length) % howToUse.length;
                const adjustedDistance =
                  distance > howToUse.length / 2
                    ? distance - howToUse.length
                    : distance;

                let position = "left-1/2";
                let translateX = "translate(-50%, -50%)";

                if (adjustedDistance === 1) {
                  position = "left-[75%]";
                  translateX = "translate(-50%, -50%)";
                } else if (adjustedDistance === -1) {
                  position = "left-[25%]";
                  translateX = "translate(-50%, -50%)";
                } else if (Math.abs(adjustedDistance) > 1) {
                  return null;
                }

                // Set consistent card size
                const cardWidth =
                  adjustedDistance === 0 ? "w-80 md:w-96" : "w-64 md:w-80";
                const zIndex = adjustedDistance === 0 ? 30 : 20;
                const opacity = adjustedDistance === 0 ? 1 : 0.6;
                const scale = adjustedDistance === 0 ? "scale-100" : "scale-90";

                return (
                  <div
                    key={item.id}
                    className={`absolute top-1/2 ${position} ${cardWidth} p-0.5 bg-no-repeat bg-[length:100%_100%] rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer ${scale}`}
                    style={{
                      backgroundImage: `url(${item.backgroundUrl})`,
                      transform: translateX,
                      height: adjustedDistance === 0 ? "28rem" : "24rem",
                      zIndex: zIndex,
                      opacity: opacity,
                      transformOrigin: "center center",
                    }}
                    onClick={() =>
                      index !== currentIndex && handleDotClick(index)
                    }
                  >
                    <div className="relative z-2 flex flex-col h-full p-6 md:p-8">
                      <div className="flex items-center justify-center mb-5 md:mb-6 w-12 h-12 bg-n-6 rounded-xl">
                        <img
                          src={item.iconUrl}
                          width={24}
                          height={24}
                          alt={item.title}
                        />
                      </div>

                      <h5 className="h5 mb-4 md:mb-6">{item.title}</h5>
                      <p className="body-2 mb-6 md:mb-8 text-n-3">
                        {item.text}
                      </p>

                      <div className="flex items-center mt-auto">
                        <div className="flex items-center justify-center w-10 h-10 bg-n-6 rounded-xl">
                          <div className="flex items-center justify-center w-8 h-8 bg-n-7 rounded-[0.75rem]">
                            <div className="font-code text-xs font-bold text-n-3">
                              {String(Number(item.id) + 1).padStart(2, "00")}
                            </div>
                          </div>
                        </div>
                        <p className="ml-auto font-code text-xs font-bold text-n-1 uppercase tracking-wider">
                          Step {Number(item.id) + 1}
                        </p>
                        <Arrow className="ml-2" />
                      </div>
                    </div>

                    {<GradientLight />}

                    <div
                      className="absolute inset-0.5 bg-n-8"
                      style={{ clipPath: "url(#benefits)" }}
                    >
                      <div className="absolute inset-0 opacity-0 transition-opacity hover:opacity-10"></div>
                    </div>

                    <ClipPath />
                  </div>
                );
              })}
            </div>

            {renderPaginationDots()}

            <div className="flex justify-center mt-4 gap-8">
              <button
                onClick={() => handleArrowClick("prev")}
                className="p-2 bg-n-7 rounded-full hover:bg-n-6 transition-colors"
                aria-label="Previous step"
              >
                <Arrow className="transform rotate-180" />
              </button>
              <button
                onClick={() => handleArrowClick("next")}
                className="p-2 bg-n-7 rounded-full hover:bg-n-6 transition-colors"
                aria-label="Next step"
              >
                <Arrow />
              </button>
            </div>
          </div>
        )}
      </div>
    </Section>
  );
};

export default HowToUse;
