import { howToUse } from "../constants";
import Heading from "./Heading";
import Section from "./Section";
import { GradientLight } from "./design/Benefits";
import ClipPath from "../assets/svg/ClipPath";
import Arrow from "../assets/svg/Arrow";

const HowToUse = () => {
  return (
    <Section id="how-to-use">
      <div className="container relative z-2">
        <Heading
          className="md:max-w-md lg:max-w-2xl"
          title="How to Get Started"
          text="Transform your style in just a few simple steps with our AI-powered fashion assistant"
        />

        <div className="flex flex-wrap gap-10 mb-10">
          {howToUse.map((item) => (
            <div
              className="block relative p-0.5 bg-no-repeat bg-[length:100%_100%] md:max-w-[24rem]"
              style={{
                backgroundImage: `url(${item.backgroundUrl})`,
              }}
              key={item.id}
            >
              <div className="relative z-2 flex flex-col min-h-[22rem] p-[2.4rem] pointer-events-none">
                <div className="flex items-center justify-center mb-3 w-12 h-12 bg-n-6 rounded-xl">
                  <img
                    src={item.iconUrl}
                    width={24}
                    height={24}
                    alt={item.title}
                  />
                </div>
                <h5 className="h5 mb-5">{item.title}</h5>
                <p className="body-2 mb-6 text-n-3">{item.text}</p>
                <div className="flex items-center mt-auto">
                  <div className="flex items-center justify-center w-10 h-10 bg-n-6 rounded-xl">
                    <div className="flex items-center justify-center w-8 h-8 bg-n-7 rounded-[0.75rem]">
                      <div className="font-code text-xs font-bold text-n-3">
                        {String(Number(item.id) + 1).padStart(2, "0")}
                      </div>
                    </div>
                  </div>
                  <p className="ml-auto font-code text-xs font-bold text-n-1 uppercase tracking-wider">
                    Step {Number(item.id) + 1}
                  </p>
                  <Arrow />
                </div>
              </div>

              {item.light && <GradientLight />}

              <div
                className="absolute inset-0.5 bg-n-8"
                style={{ clipPath: "url(#benefits)" }}
              >
                <div className="absolute inset-0 opacity-0 transition-opacity hover:opacity-10">
                </div>
              </div>

              <ClipPath />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default HowToUse;
