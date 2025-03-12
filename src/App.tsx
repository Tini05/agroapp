import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import LajmeBujqesore from "./pages/LajmeBujqesore";
import ArticlePage from "./pages/ArticlePage";
import Bujqesia from "./pages/Bujqesia";
import Veterina from "./pages/Veterina";
import Bletaria from "./pages/Bletaria";
import EkonomiaQarkulluese from "./pages/EkonomiaQarkulluese";
import BioProduksioni from "./pages/BioProduksioni";
import EcoSistemi from "./pages/EcoSistemi";
import GreenFarming from "./pages/GreenFarming";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import "./App.css";
import "./Navbar.css";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lajme-bujqesore" element={<LajmeBujqesore />} />
        <Route path="/article/:category/:id" element={<ArticlePage />} />
        <Route path="/bvb/bujqesia" element={<Bujqesia />} />
        <Route path="/bvb/veterina" element={<Veterina />} />
        <Route path="/bvb/bletaria" element={<Bletaria />} />
        <Route path="/ekonomia-qarkulluese" element={<EkonomiaQarkulluese />} />
        <Route path="/bio-produksioni" element={<BioProduksioni />} />
        <Route path="/eco-sistemi" element={<EcoSistemi />} />
        <Route path="/green-farming" element={<GreenFarming />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
