import About from "../../pages/footer/About.jsx";
import HowItWorks from "../../pages/footer/HowItWorks.jsx";
import TradeAssurance from "../../pages/footer/TradeAssurance.jsx";
import SuccessStories from "../../pages/footer/SuccessStories.jsx";
import Press from "../../pages/footer/Press.jsx";
import Careers from "../../pages/footer/Careers.jsx";
import PrivacyPolicy from "../../pages/footer/PrivacyPolicy.jsx";
import Terms from "../../pages/footer/Terms.jsx";
import Cookies from "../../pages/footer/Cookies.jsx";

const footerRoutes = [
    { path: "about", element: <About /> },
    { path: "how-it-works", element: <HowItWorks /> },
    { path: "trade-assurance", element: <TradeAssurance /> },
    { path: "success-stories", element: <SuccessStories /> },
    { path: "press", element: <Press /> },
    { path: "careers", element: <Careers /> },
    { path: "privacy-policy", element: <PrivacyPolicy /> },
    { path: "terms", element: <Terms /> },
    { path: "cookies", element: <Cookies /> },
];

export default footerRoutes;