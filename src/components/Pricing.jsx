import Section from "./Section";
import Heading from "./Heading";
import Button from "./Button";
import { pricing } from "../constants";
import { LeftLine, RightLine } from "./design/Pricing";

const Pricing = () => {
  return (
    <Section id="pricing" className="overflow-hidden">
      <div className="container relative z-2">
        <Heading
          className="md:max-w-md lg:max-w-2xl text-center"
          title="Choose Your Perfect Plan"
          text="Select the plan that best fits your needs and start transforming your style with AI"
        />

        <div className="flex flex-col md:flex-row gap-8 md:gap-10 mb-10 justify-center items-center">
          <LeftLine />
          {pricing.map((plan) => (
            <div
              key={plan.id}
              className="bg-no-repeat bg-[length:100%_100%] rounded-2xl p-6 md:p-8 w-full md:w-[24rem] shadow-lg transition-transform hover:scale-105"
              style={{
                backgroundImage: `url(${plan.backgroundUrl})`,
              }}
            >
              <div className="bg-n-8 rounded-2xl p-6 md:p-8 flex flex-col">
                <h3 className="text-2xl font-semibold text-n-1 mb-4 text-center">
                  {plan.title}
                </h3>
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-color-1 mb-2">
                    {plan.price === null ? "Custom" : `$${plan.price}`}
                  </div>
                  <p className="text-n-3">{plan.description}</p>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center text-n-3 body-2"
                    >
                      <svg
                        className="w-5 h-5 mr-2 text-color-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="text-center mt-auto">
                  <Button className="w-full" white={plan.id === "1"}>
                    {plan.price === null ? "Contact Us" : "Get Started"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
          <RightLine />
        </div>
      </div>
    </Section>
  );
};

export default Pricing;
