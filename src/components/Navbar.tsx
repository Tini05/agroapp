import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, LogIn, LogOut, Shield, Globe } from "lucide-react";
import { auth } from "../firebase";
import { translateText } from "../utils/translate"; // Import LibreTranslate function
import "bootstrap/dist/css/bootstrap.min.css";
import "../Navbar.css"; // Custom styles

export default function Navbar() {
  const [bvbOpen, setBvbOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [language, setLanguage] = useState<string>(() => {
    // Check sessionStorage for saved language preference
    const savedLanguage = sessionStorage.getItem("language");
    return savedLanguage || "en"; // Default to English if no preference is found
  });
  const adminEmails = ["agimalimi7@gmail.com", "staff@example.com"];
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Menu items to be translated
  const menuItems = {
    home: "Shtepia",
    news: "Lajme Bujqësore",
    agriculture: "Bujqësia",
    veterinary: "Veterina",
    beekeeping: "Bletaria",
    circularEconomy: "Ekonomia Qarkulluese",
    bioProduction: "Bio Produksioni",
    ecoSystem: "Eco Sistemi",
    greenFarming: "Green Farming"
  };

  // Detect scroll for navbar effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle user authentication state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Function to change language & apply translations
  const changeLanguage = async (lng: string) => {
    setLanguage(lng);
    setLangOpen(false); // Close dropdown

    // Save language preference in sessionStorage
    sessionStorage.setItem("language", lng);

    // Fetch translations for menu items
    const translatedItems: Record<string, string> = {};
    for (const key in menuItems) {
      translatedItems[key] = await translateText(menuItems[key as keyof typeof menuItems], lng);
    }

    // Save translations to sessionStorage
    sessionStorage.setItem("translations", JSON.stringify(translatedItems));

    // Update the state with the new translations
    setTranslations(translatedItems);
  };

  // Load translations from sessionStorage if available
  // useEffect(() => {
    // const savedTranslations = sessionStorage.getItem("translations");
    // if (savedTranslations) {
    //   setTranslations(JSON.parse(savedTranslations));
    // } else {
    //   // If translations are not in sessionStorage, fetch them
    //   changeLanguage(language); // Fetch translations for the default language
    // }
  // }, [language]); // Only run when language changes

  return (
    <nav className={`navbar navbar-expand-lg fixed-top ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="container-fluid px-4">
        <Link to="/" className="navbar-brand fw-bold">AgroWebsite</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item"><Link to="/" className="nav-link">{translations.home || menuItems.home}</Link></li>
            <li className="nav-item"><Link to="/lajme-bujqesore" className="nav-link">{translations.news || menuItems.news}</Link></li>

            {/* BVB Dropdown */}
            <li className="nav-item dropdown position-relative">
              <button
                className="nav-link dropdown-toggle d-flex align-items-center"
                onClick={() => setBvbOpen(!bvbOpen)}
              >
                BVB <ChevronDown size={16} className="ms-1" />
              </button>
              {bvbOpen && (
                <ul className="dropdown-menu show animate__animated animate__fadeIn">
                  <li><Link to="/bvb/bujqesia" className="dropdown-item">{translations.agriculture || menuItems.agriculture}</Link></li>
                  <li><Link to="/bvb/veterina" className="dropdown-item">{translations.veterinary || menuItems.veterinary}</Link></li>
                  <li><Link to="/bvb/bletaria" className="dropdown-item">{translations.beekeeping || menuItems.beekeeping}</Link></li>
                </ul>
              )}
            </li>

            <li className="nav-item"><Link to="/ekonomia-qarkulluese" className="nav-link">{translations.circularEconomy || menuItems.circularEconomy}</Link></li>
            <li className="nav-item"><Link to="/bio-produksioni" className="nav-link">{translations.bioProduction || menuItems.bioProduction}</Link></li>
            <li className="nav-item"><Link to="/eco-sistemi" className="nav-link">{translations.ecoSystem || menuItems.ecoSystem}</Link></li>
            <li className="nav-item"><Link to="/green-farming" className="nav-link">{translations.greenFarming || menuItems.greenFarming}</Link></li>

            {/* Language Switcher */}
            {/* <li className="nav-item dropdown position-relative">
              <button className="nav-link dropdown-toggle d-flex align-items-center" onClick={() => setLangOpen(!langOpen)}>
                <Globe size={18} className="me-1" /> {language.toUpperCase()} <ChevronDown size={16} className="ms-1" />
              </button>
              {langOpen && (
                <ul className="dropdown-menu show animate__animated animate__fadeIn">
                  <li><button className="dropdown-item" onClick={() => changeLanguage("sq")}>Shqip 🇦🇱</button></li>
                  <li><button className="dropdown-item" onClick={() => changeLanguage("mk")}>Македонски 🇲🇰</button></li>
                  <li><button className="dropdown-item" onClick={() => changeLanguage("en")}>English 🇬🇧</button></li>
                </ul>
              )}
            </li> */}

            {/* Admin Panel Button */}
            {user && adminEmails.includes(user.email) && (
              <li className="nav-item">
                <Link className="nav-link text-warning d-flex align-items-center" to="/admin-panel">
                  <Shield size={18} className="me-1" /> Admin
                </Link>
              </li>
            )}

            {/* Admin Login/Logout */}
            <li className="nav-item ms-3">
              {user ? (
                <button className="btn-icon btn-danger" onClick={() => auth.signOut()}>
                  <LogOut size={18} />
                </button>
              ) : (
                <Link className="btn-icon btn-primary" to="/admin-login">
                  <LogIn size={18} />
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
