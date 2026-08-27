import vouch from './assets/Vouch.png';
import vouch1 from './assets/UMAI.png';
import vouch2 from './assets/UMAnalytics.png';
import vouch3 from './assets/UMDashboard.png';
import vouch4 from './assets/UMInventory.png';
import KNCHome from './assets/KNCHome.png';
import KNCHome2 from './assets/KNCHome2.png';
import KNCHome3 from './assets/KNCHome3.png';
import KNCLogin from './assets/KNCLogin.png';
import KNCPayment from './assets/KNCPayment.png';
import featuredBgVouch from './assets/featured-bg-vouch.jpg';
import featuredBgKicks from './assets/featured-bg-kicks.jpg';
import KNCShop from './assets/KNCShop.png';
import KNCShop2 from './assets/KNCShop2.png';
import KNCShop3 from './assets/KNCShop3.png';
import KNCShop4 from './assets/KNCShop4.png';
import KNCShop5 from './assets/KNCShop5.png';
import yugenHero from './assets/yugen/01-selected-hero.webp';
import yugenGallery from './assets/yugen/02-selected-gallery.webp';
import yugenPhilosophy from './assets/yugen/03-selected-philosophy.webp';
import yugenCraft from './assets/yugen/04-selected-craft.webp';
import yugenMenuHero from './assets/yugen/05-selected-menu-hero.webp';
import yugenMenuList from './assets/yugen/06-selected-menu-list.webp';
import yugenReservation from './assets/yugen/07-selected-reservation.webp';
import yugenSignature from './assets/yugen/08-selected-signature.webp';
import yugenFeaturedBackground from './assets/yugen/featured-fujifilm.webp';
import onyxHome from './assets/onyx/01-home.png';
import onyxRegister from './assets/onyx/02-register.png';
import onyxLogin from './assets/onyx/03-login.png';
import onyxCatalog from './assets/onyx/04-catalog.png';
import onyxProductDetail from './assets/onyx/05-product-detail.png';
import onyxCart from './assets/onyx/06-cart.png';
import onyxCheckout from './assets/onyx/07-checkout.png';
import onyxReceipt from './assets/onyx/08-receipt.png';
import onyxConfirmationEmail from './assets/onyx/09-confirmation-email.png';
import onyxAdminDashboard from './assets/onyx/10-admin-dashboard.png';
import onyxAdminProducts from './assets/onyx/11-admin-products.png';
import onyxAdminAddProduct from './assets/onyx/12-admin-add-product.png';
import onyxAdminProductDetail from './assets/onyx/13-admin-product-detail.png';
import onyxAdminOrderDetail from './assets/onyx/14-admin-order-detail.png';
import onyxFeaturedBackground from './assets/onyx/featured-sunset.png';

export const PROJECTS_DATA = [
  {
    id: "01",
    title: "Vouch AI-Assistant Dashboard",
    category: "Full-stack Developer",
    desc: "User Friendly dashboard that displays revenue streams for Grab Merchants. Also it has personal AI Assistant where it helps to generate analytics.",
    img: vouch,
    bgImg: featuredBgVouch,
    gallery: [vouch, vouch1, vouch2, vouch3, vouch4],
    featuredTools: ["HTML", "CSS", "JavaScript", "R"],
    tools: ["HTML", "CSS", "Javascript", "R"],
    duration: "1 weeks",
    roles: "Full-stack Developer",
    summary: "A user-friendly dashboard designed for Grab merchants that visualizes key revenue streams and business performance in an intuitive interface. The platform integrates a personal AI assistant using n8n that generates actionable analytics, helping merchants understand trends, optimize decisions, and improve overall business outcomes.",
    githubUrl: "https://github.com/urboiflex/AmbatuWIN"
  },
  {
    id: "02",
    title: "Kicks & Co.",
    category: "Full-stack Developer",
    desc: "Kicks & Co. is a luxury-inspired e-commerce marketplace dedicated exclusively to premium sneakers. Designed with an emphasis on high-end, award-winning aesthetics.",
    img: KNCHome,
    bgImg: featuredBgKicks,
    gallery: [KNCLogin, KNCHome, KNCHome2, KNCHome3, KNCShop, KNCShop2, KNCShop3, KNCShop4, KNCShop5, KNCPayment],
    featuredTools: ["React.js", "GSAP", "ASP.NET", "MySQL"],
    tools: ["React.js", "HTML", "CSS", "Tailwind", "Javascript", "GSAP", "ASP.NET", "C#", "MySQL", "XML"],
    duration: "3 weeks",
    roles: "Full-stack Developer",
    summary: "Kicks & Co. is a fully functional e-commerce platform designed to emulate a real-life virtual sneaker store. Targeted at young adults and sneaker enthusiasts, the platform delivers an elegant, high-end shopping experience featuring sophisticated front-end animations, smooth scrolling, and parallax effects. The project successfully bridges the gap between customer-facing usability and advanced, dynamic data management.",
    githubUrl: "https://github.com/urboiflex/Kicks-Co-E-Commerce-Website"
  },
  {
    id: "03",
    title: "YUGEN Concept",
    category: "Landing Page",
    desc: "An immersive Japanese fine-dining concept that guides guests from the restaurant's philosophy and menu experience to a complete reservation journey.",
    img: yugenHero,
    bgImg: yugenFeaturedBackground,
    gallery: [
      yugenHero,
      yugenGallery,
      yugenPhilosophy,
      yugenCraft,
      yugenMenuHero,
      yugenMenuList,
      yugenReservation,
      yugenSignature,
    ],
    featuredTools: ["Next.js", "GSAP", "Lenis", "Tailwind CSS"],
    tools: ["Next.js", "React", "Turbopack", "Tailwind CSS", "GSAP", "ScrollTrigger", "Lenis", "Next/Image", "Sonner"],
    duration: "Concept project",
    roles: "Landing Page Developer",
    summary: "YUGEN Concept is a cinematic restaurant website built around an omakase dining narrative. The experience combines editorial typography, full-screen food imagery, scroll-led storytelling, an extensive menu gallery, chef presentation, and a reservation interface in one cohesive journey. Motion and smooth scrolling support the atmosphere without obscuring practical navigation or the path to booking.",
    visitUrl: "https://yugen-restaurant.vercel.app/"
  },
  {
    id: "04",
    title: "ONYX Gaming E-Commerce",
    category: "Full-Stack E-Commerce Developer",
    desc: "A full-stack gaming store with personalized shopping, secure checkout, AI support, and complete admin tools.",
    img: onyxHome,
    bgImg: onyxFeaturedBackground,
    gallery: [
      onyxHome,
      onyxRegister,
      onyxLogin,
      onyxCatalog,
      onyxProductDetail,
      onyxCart,
      onyxCheckout,
      onyxReceipt,
      onyxConfirmationEmail,
      onyxAdminDashboard,
      onyxAdminProducts,
      onyxAdminAddProduct,
      onyxAdminProductDetail,
      onyxAdminOrderDetail,
    ],
    featuredTools: ["ASP.NET", "C#", "PostgreSQL", "AWS"],
    tools: [
      "ASP.NET Web Forms",
      "C#",
      "HTML",
      "CSS",
      "JavaScript",
      "PostgreSQL",
      "Npgsql",
      "AWS Elastic Beanstalk",
      "Amazon EC2",
      "Amazon RDS",
      "AWS S3",
      "AWS CloudFront",
      "AWS Lambda",
      "Amazon API Gateway",
      "AWS CloudWatch",
      "Amazon SNS",
      "Stripe",
      "OAuth 2.0",
      "Gemini API",
      "GitHub Actions",
    ],
    duration: "1 month",
    roles: "Full-Stack E-Commerce Developer",
    modalSummary: "A full-stack gaming commerce platform with personalized shopping, secure checkout, AI support, and complete administration tools. I developed the admin experience, OAuth authentication, and recommendation logic within its hybrid AWS architecture.",
    summary: "ONYX is a full-stack gaming store with personalized browsing, secure checkout, AI support, and complete administration tools. I developed the administrator experience, OAuth authentication, and recommendation logic. The platform is supported by PostgreSQL, Stripe, Gemini, and a hybrid AWS architecture.",
    githubUrl: "https://github.com/pendetas/ONYX_VS2022"
  }
];
