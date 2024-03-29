import { HiHeart } from "react-icons/hi";
import { getDate } from "../util/helpers";

const Footer = () => {
 
  return (
    <footer className="p-1 border-secondary border-t-2">
      <p className="flex items-center text-sm justify-center">
        Made with <HiHeart className="mx-1 text-red-500" /> by:{" "}
        <a
          href="https://www.natashajohnson.dev/"
          className="underline ml-1"
          target="_blank"
          rel="noopener noreferrer"
          referrerPolicy="no-referrer"
        >
          {" "}
          Natasha Johnson
        </a>
        <span className="ml-1">{getDate()}</span>
      </p>
    </footer>
  );
};

export default Footer;
