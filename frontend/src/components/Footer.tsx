import React from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, ExternalLink } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-tech-dark text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold mb-2">
              <img
                src="img/logotipo_white.png"
                alt="WhiteStone Dev Logo"
                className="max-h-12"
              />
            </h3>
            <p className="text-gray-300 text-sm mb-1">
              {t("footer.maintained")}
            </p>
            <p className="text-gray-300 text-sm">
              {t("footer.initiative")}{" "}
              <a
                href="https://whitestone.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-tech-purple hover:underline inline-flex items-center"
              >
                whiteStone_dev
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </p>
          </div>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8 items-center">
            <div className="flex flex-col space-y-2">
              <Link to="/" className="text-gray-300 hover:text-white">
                {t("footer.events")}
              </Link>
              <Link to="/contribute" className="text-gray-300 hover:text-white">
                {t("footer.contribute")}
              </Link>
            </div>
            <div className="flex flex-col space-y-2 md:space-y-3">
              <a
                href="https://github.com/whitestonedev/calendario-tech"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-300 hover:text-white bg-gray-800 px-4 py-2 rounded-md"
              >
                <Github className="h-5 w-5" />
                <span>{t("footer.github")}</span>
              </a>
              <a
                href="https://www.linkedin.com/company/whitestone-dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-300 hover:text-white bg-gray-800 px-4 py-2 rounded-md"
              >
                <Linkedin className="h-5 w-5" />
                <span>{t("footer.linkedin")}</span>
              </a>
            </div>
          </div>
        </div>
        <div className="text-center text-gray-400 text-sm mt-8">
          &copy; {new Date().getFullYear()} whiteStone_dev & Calendario Tech.{" "}
          {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
