import Section from "./Section";
import Heading from "./Heading";
import ClipPath from "../assets/svg/ClipPath";
import Button from "./Button";
import { GradientLight } from "./design/Benefits";
import { pricing } from "../constants";

const Pricing = () => {
  return (
    <Section id="pricing" className="overflow-hidden" crosses>
      <div className="container relative z-2">
        <Heading
          className="md:max-w-md lg:max-w-2xl"
          title="Choose your perfect plan"
          text="Select the plan that best fits your needs and start transforming your style with AI"
        />

        <div className="flex flex-wrap gap-10 mb-10 justify-center">
          {pricing.map((plan) => (
            <div
              className="block relative p-0.5 bg-no-repeat bg-[length:100%_100%] md:max-w-[24rem]"
              key={plan.id}
            >
              <div className="relative z-2 flex flex-col min-h-[22rem] p-[2.4rem]">
                <h5 className="h5 mb-4">{plan.title}</h5>
                <div className="mb-6">
                  <div className="text-3xl font-bold text-n-1 mb-1">
                    {plan.price === null ? "Custom" : `$${plan.price}`}
                  </div>
                  <p className="text-n-3">{plan.description}</p>
                </div>
                <ul className="space-y-4 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-n-3 body-2">
                      <svg
                        className="w-6 h-6 mr-2 text-color-1"
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
                <div className="mt-auto">
                  <Button className="w-full" white={plan.id === "1"}>
                    {plan.price === null ? "Contact Us" : "Get Started"}
                  </Button>
                </div>
              </div>

              {plan.id === "1" && <GradientLight />}

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

export default Pricing;
