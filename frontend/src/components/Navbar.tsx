import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import SubmitEventDialog from "./SubmitEventDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/context/LanguageContext";

const getFlagUrl = (lang: string) => {
  switch (lang) {
    case "pt-br":
      return "https://flagcdn.com/24x18/br.png";
    case "en-us":
      return "https://flagcdn.com/24x18/us.png";
    case "es-es":
      return "https://flagcdn.com/24x18/es.png";
    default:
      return "https://flagcdn.com/24x18/un.png";
  }
};

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { t, language, setLanguage } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`py-4 px-6 fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200"
          : "bg-white/20 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="p-2 rounded-full bg-tech-purple text-white transition-all group-hover:rotate-12">
            <img
              src="img/logotipo_icon_white.png"
              alt="Calendário"
              className="h-6 w-6 invert brightness-0"
            />
          </div>
          <span className="text-xl font-bold transition-colors text-tech-dark">
            <img
              src="img/logotipo_lettering.png"
              alt="Calendário"
              className="max-h-10"
            />
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-white/20 p-1"
                >
                  <img
                    src={getFlagUrl(language)}
                    alt={language}
                    className="w-6 h-auto"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setLanguage("pt-br")}
                  className={language === "pt-br" ? "bg-gray-100" : ""}
                >
                  <img
                    src={getFlagUrl("pt-br")}
                    alt="BR"
                    className="w-5 h-auto mr-2"
                  />
                  Português (BR)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLanguage("en-us")}
                  className={language === "en-us" ? "bg-gray-100" : ""}
                >
                  <img
                    src={getFlagUrl("en-us")}
                    alt="US"
                    className="w-5 h-auto mr-2"
                  />
                  English (US)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLanguage("es-es")}
                  className={language === "es-es" ? "bg-gray-100" : ""}
                >
                  <img
                    src={getFlagUrl("es-es")}
                    alt="ES"
                    className="w-5 h-auto mr-2"
                  />
                  Español
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Link
            to="/contribute"
            className="relative group text-gray-600 hover:text-tech-purple transition-colors"
          >
            {t("nav.contribute")}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-tech-purple transition-all group-hover:w-full"></span>
          </Link>

          <SubmitEventDialog
            trigger={
              <Button className="bg-gradient-to-r from-tech-purple to-purple-600 hover:from-tech-purple/90 hover:to-purple-600/90 transition-all hover:shadow-lg">
                {t("nav.addEvent")}
              </Button>
            }
          />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-white/20 p-1"
              >
                <img
                  src={getFlagUrl(language)}
                  alt={language}
                  className="w-6 h-auto"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setLanguage("pt-br")}
                className={language === "pt-br" ? "bg-gray-100" : ""}
              >
                <img
                  src="https://flagcdn.com/br.svg"
                  alt="BR"
                  className="w-5 h-auto mr-2"
                />
                Português (BR)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setLanguage("en-us")}
                className={language === "en-us" ? "bg-gray-100" : ""}
              >
                <img
                  src="https://flagcdn.com/us.svg"
                  alt="US"
                  className="w-5 h-auto mr-2"
                />
                English (US)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setLanguage("es-es")}
                className={language === "es-es" ? "bg-gray-100" : ""}
              >
                <img
                  src="https://flagcdn.com/es.svg"
                  alt="ES"
                  className="w-5 h-auto mr-2"
                />
                Español
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-600 p-1 rounded-full"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="md:hidden fixed inset-x-0 top-[64px] z-50 bg-white/95 backdrop-blur-sm flex flex-col px-6 py-4 space-y-4 overflow-y-auto animate-in slide-in-from-top duration-300">
            <Link
              to="/"
              className={`text-lg font-medium py-2 px-4 rounded-lg transition-colors ${
                location.pathname === "/"
                  ? "text-tech-purple bg-purple-50"
                  : "text-gray-800 hover:bg-gray-50"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/contribute"
              className={`text-lg font-medium py-2 px-4 rounded-lg transition-colors ${
                location.pathname === "/contribute"
                  ? "text-tech-purple bg-purple-50"
                  : "text-gray-800 hover:bg-gray-50"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("nav.contribute")}
            </Link>
            <div className="pt-2">
              <SubmitEventDialog
                trigger={
                  <Button className="w-full bg-tech-purple hover:bg-tech-purple/90 text-white py-6 text-lg font-medium rounded-lg transition-all hover:shadow-lg">
                    {t("nav.addEvent")}
                  </Button>
                }
              />
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
