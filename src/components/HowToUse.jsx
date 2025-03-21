import { howToUse } from "../constants";
import Heading from "./Heading";
import Section from "./Section";
import { GradientLight } from "./design/Benefits";
import ClipPath from "../assets/svg/ClipPath";
import Arrow from "../assets/svg/Arrow";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const HowToUse = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % howToUse.length);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isMobile]);

  const cardVariants = {
    initial: { opacity: 0, x: 50, scale: 0.9 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -50, scale: 0.9 },
  };

  return (
    <Section id="how-to-use" crosses className="py-16">
      <div className="container relative z-2">
        <Heading
          className="md:max-w-md lg:max-w-2xl xl:max-w-4xl"
          title="How to Get Started"
          text="Transform your style in just a few simple steps with our AI-powered fashion assistant"
        />

        <div className="flex justify-center mb-10">
          <div
            className={`flex ${
              isMobile ? "flex-col w-full gap-4 px-4" : "gap-6 xl:gap-8"
            }`}
            ref={containerRef}
          >
            {howToUse.map((item, index) => (
              <motion.div
                key={item.id}
                className={`relative p-0.5 bg-no-repeat bg-[length:100%_100%] rounded-2xl overflow-hidden transform transition-all ${
                  isMobile
                    ? "w-full max-w-md my-2 mx-auto px-0 "
                    : index === currentIndex
                    ? "w-full sm:w-[45%] md:w-[30%] lg:w-[24rem] xl:w-[28rem] shadow-2xl z-[1000] my-8"
                    : "w-[8rem] sm:w-[12rem] md:w-[15rem] xl:w-[18rem] opacity-50 pointer-events-none z-0 my-8"
                }`}
                style={{
                  backgroundImage: `url(${item.backgroundUrl})`,
                }}
              >
                {isMobile || index === currentIndex ? (
                  <div className="relative z-2 flex flex-col min-h-[22rem] p-6 sm:p-8 w-full">
                    <div className="flex items-center justify-center mb-6 w-12 h-12 bg-n-6 rounded-xl">
                      <img
                        src={item.iconUrl}
                        width={24}
                        height={24}
                        alt={item.title}
                      />
                    </div>

                    <h5 className="h5 mb-6">{item.title}</h5>
                    <p className="body-2 mb-8 text-n-3">{item.text}</p>

                    <div className="flex items-center mt-auto w-full">
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
                ) : (
                  <AnimatePresence initial={false} mode="wait">
                    <motion.div
                      variants={cardVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{
                        duration: 0.5,
                        type: "spring",
                        stiffness: 100,
                      }}
                      className="relative z-2 flex flex-col min-h-[22rem] p-8 pointer-events-none"
                    >
                      <div className="flex items-center justify-center mb-6 w-12 h-12 bg-n-6 rounded-xl">
                        <img
                          src={item.iconUrl}
                          width={24}
                          height={24}
                          alt={item.title}
                        />
                      </div>

                      <h5 className="h5 mb-6">{item.title}</h5>
                      <p className="body-2 mb-8 text-n-3">{item.text}</p>

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
                        <Arrow />
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}

                {<GradientLight />}

                <div
                  className="absolute inset-0.5 bg-n-8"
                  style={{ clipPath: "url(#benefits)" }}
                >
                  <div className="absolute inset-0 opacity-0 transition-opacity hover:opacity-10"></div>
                </div>

                <ClipPath />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default HowToUse;
