import { benefits } from "../constants";
import Heading from "./Heading";
import Section from "./Section";
import Arrow from "../assets/svg/Arrow";
import { GradientLight } from "./design/Benefits";
import ClipPath from "../assets/svg/ClipPath";
import { motion, useInView, useScroll, useAnimation } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const Benefits = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { threshold: 0.1, once: false });
  const { scrollYProgress } = useScroll({ container: containerRef });
  const [isMobile, setIsMobile] = useState(false);

  const controls = useAnimation();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [isInView, controls]);

  const itemVariants = {
    hidden: (i) => {
      const positions = [
        { x: -25, y: 0 },
        { x: 25, y: 0 },
        { x: 0, y: -25 },
        { x: 0, y: 25 },
      ];
      const position = positions[i % 4];
      return {
        opacity: 0,
        x: position.x,
        y: position.y,
      };
    },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: isMobile ? i * 0.1 : 0,
      },
    }),
    hover: {
      scale: 1.03,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const getScrollY = (index) => {
    const baseMovement = isMobile ? 10 : 30;
    return (
      scrollYProgress.get() * (index % 2 === 0 ? baseMovement : -baseMovement)
    );
  };

  return (
    <Section id="features" crosses>
      <motion.div className="container relative z-2" ref={containerRef}>
        <Heading
          className="md:max-w-md lg:max-w-2xl"
          title="Style made simple with RASA.ai"
        />

        <div
          className={`flex ${
            isMobile
              ? "flex-col w-full gap-4 px-4"
              : "flex-wrap justify-center gap-6"
          } mb-10`}
        >
          {benefits.map((item, index) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              initial="hidden"
              animate={controls}
              whileHover="hover"
              whileTap={{ scale: 0.98 }}
              className={`block relative p-0.5 bg-no-repeat bg-[length:100%_100%] ${
                isMobile
                  ? "w-full my-2"
                  : "w-full sm:w-[45%] md:w-[30%] lg:w-[24rem]"
              } rounded-2xl overflow-hidden transform transition-all`}
              style={{
                backgroundImage: `url(${item.backgroundUrl})`,
                y: getScrollY(index),
              }}
              custom={index}
            >
              <div className="relative z-2 flex flex-col min-h-[22rem] p-[2.4rem] pointer-events-none">
                <h5 className="h5 mb-5 text-n-1">{item.title}</h5>
                <p className="body-2 mb-6 text-n-3">{item.text}</p>
                <div className="flex items-center mt-auto">
                  <img
                    src={item.iconUrl}
                    width={48}
                    height={48}
                    alt={item.title}
                    className="rounded-full"
                  />
                  <p className="ml-auto font-code text-xs font-bold text-n-1 uppercase tracking-wider">
                    Explore more
                  </p>
                  <Arrow />
                </div>
              </div>

              {<GradientLight />}

              <div
                className="absolute inset-0.5 bg-n-8"
                style={{ clipPath: "url(#benefits)" }}
              >
                <motion.div
                  className="absolute inset-0 opacity-0 transition-opacity"
                  whileHover={{ opacity: 0.1 }}
                  whileTap={{ opacity: 0.1 }}
                >
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      width="100%"
                      height="100%"
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </motion.div>
              </div>

              <ClipPath />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Section>
  );
};

export default Benefits;
