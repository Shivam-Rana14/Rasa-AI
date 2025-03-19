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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % howToUse.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const cardVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <Section id="how-to-use" crosses className="py-16">
      {" "}
      {/* Increased Section Padding */}
      <div className="container relative z-2">
        <Heading
          className="md:max-w-md lg:max-w-2xl"
          title="How to Get Started"
          text="Transform your style in just a few simple steps with our AI-powered fashion assistant"
        />

        <div className="flex justify-center mb-10">
          <div className="flex gap-6" ref={containerRef}>
            {" "}
            {howToUse.map((item, index) => (
              <div
                key={item.id}
                className={`relative p-0.5 rounded-2xl overflow-hidden transform transition-all ${
                  index === currentIndex
                    ? "w-full sm:w-[45%] md:w-[30%] lg:w-[24rem] shadow-2xl z-[1000] my-8"
                    : "w-[8rem] sm:w-[12rem] md:w-[15rem] opacity-50 pointer-events-none z-0 my-8"
                }`}
                style={{
                  backgroundImage: item.backgroundUrl
                    ? `url(${item.backgroundUrl})`
                    : "none",
                  backgroundSize: "cover",
                }}
              >
                {index === currentIndex && (
                  <AnimatePresence initial={false} mode="wait">
                    <motion.div
                      variants={cardVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.5 }}
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default HowToUse;
