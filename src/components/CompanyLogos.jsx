import { companyLogos } from "../constants";

const CompanyLogos = ({ className }) => {
  return (
    <div className={className}>
      <h5 className="tagline mb-6 text-center text-n-1/50">
        Helping You Choose the Perfect Outfit at
      </h5>
      <ul className="flex lg:bg-n-6/70 lg:backdrop-blur-md rounded-full lg:rounded-[40px] p-2">
        {companyLogos.map((logo, index) => (
          <li
            className="flex items-center justify-center flex-1 h-[8.5rem] hover:bg-white/10 hover:backdrop-blur-sm rounded-lg"
            key={index}
          >
            <img src={logo} width={134} height={28} alt={logo} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompanyLogos;
