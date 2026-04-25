import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';

import motivationImg from './assets/anjay.jpeg';
import alphatonCert from './assets/Alphaton.jpg';
import apuCareerCert from './assets/MegaCareer.jpg';
import sparkathonCert from './assets/sparkathon certificate.png';
import goldlevel from './assets/GoldLevel.jpg';
import SQLInter from './assets/SQLIntermediate.jpg';
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
import KNCShop from './assets/KNCShop.png';
import KNCShop2 from './assets/KNCShop2.png';
import KNCShop3 from './assets/KNCShop3.png';
import KNCShop4 from './assets/KNCShop4.png';
import KNCShop5 from './assets/KNCShop5.png';
import ecobro from './assets/Dashboard Page.png';
import ecobro1 from './assets/Login Page.png';
import ecobro2 from './assets/News Page.png';
import ecobro3 from './assets/Profile Page.png';
import ecobro4 from './assets/Register Page.png';
import ecobro5 from './assets/Reward Page.png';
import ecobro6 from './assets/Tracker Page.png';

// --- Global Project Data ---
const PROJECTS_DATA = [
  {
    id: "01",
    title: "Vouch AI-Assistant Dashboard",
    category: "Hackathon Project / Full Stack",
    desc: "User Friendly dashboard that displays revenue streams for Grab Merchants. Also it has personal AI Assistant where it helps to generate analytics.",
    img: vouch,
    gallery: [vouch, vouch1, vouch2, vouch3, vouch4], // <-- Multi-image gallery added here!
    tools: ["HTML", "CSS", "Javascript", "R"],
    duration: "1 weeks",
    roles: "Front-end / Back-end",
    summary: "A user-friendly dashboard designed for Grab merchants that visualizes key revenue streams and business performance in an intuitive interface. The platform integrates a personal AI assistant using n8n that generates actionable analytics, helping merchants understand trends, optimize decisions, and improve overall business outcomes.",
    githubUrl: "https://github.com/urboiflex/AmbatuWIN"
  },
  {
    id: "02",
    title: "Kicks & Co. Website",
    category: "Design / Frontend / Backend",
    desc: "Kicks & Co. is a luxury-inspired e-commerce marketplace dedicated exclusively to premium sneakers. Designed with an emphasis on high-end, award-winning aesthetics.",
    img: KNCHome,
    gallery: [KNCLogin, KNCHome, KNCHome2, KNCHome3, KNCShop, KNCShop2, KNCShop3, KNCShop4, KNCShop5, KNCPayment], // <-- Multi-image gallery added here!
    tools: ["HTML", "CSS", "Tailwind", "Javascript", "GSAP", "ASP.NET", "C#", "MySQL", "XML"],
    duration: "3 weeks",
    roles: "Developer",
    summary: "Kicks & Co. is a fully functional e-commerce platform designed to emulate a real-life virtual sneaker store. Targeted at young adults and sneaker enthusiasts, the platform delivers an elegant, high-end shopping experience featuring sophisticated front-end animations, smooth scrolling, and parallax effects. The project successfully bridges the gap between customer-facing usability and advanced, dynamic data management.",
    githubUrl: "https://github.com/urboiflex/Kicks-Co-E-Commerce-Website"
  },
  {
    id: "03",
    title: "EcoBro Mobile App",
    category: "Design",
    desc: "A clean, intuitive mobile application designed to help users track, reduce, and offset their daily carbon emissions through actionable habits and a gamified rewards system.",
    img: ecobro,
    gallery: [ecobro, ecobro1, ecobro2, ecobro3, ecobro4, ecobro5, ecobro6], // <-- Multi-image gallery added here!
    tools: ["Figma"],
    duration: "3 days",
    roles: "Developer",
    summary: "EcoBro empowers users to cultivate sustainable lifestyles by making environmental impact measurable and rewarding. The application combines daily habit tracking with an engaging points-based system, incentivizing eco-friendly choices like utilizing public transit, reducing plastic waste, and conserving energy. Designed with a fresh, modern aesthetic, the interface provides a seamless user experience that turns climate awareness into daily action. Through localized climate news, personalized carbon budgets, and tangible milestone rewards, EcoBro bridges the gap between environmental responsibility and user engagement, offering a comprehensive tool for conscious living.",
    githubUrl: "https://github.com/urboiflex/EcoBro"
  }
];

const EXPERIENCE_DATA = [
  {
    id: 1,
    period: "Dec 2025 — Present",
    company: "WorldQuant",
    role: "Part-time Researcher",
    desc: "Developed strong financial analysis and money management skills through hands-on research activities. Participated in financial workshops and events, gaining exposure to quantitative analysis and real-world market insights."
  },
  {
    id: 2,
    period: "July 2025 - Nov 2025",
    company: "ASSA ABLOY Malaysia",
    role: "Product Marketing & Opening Solutions Intern",
    desc: "Integrating automation of data analytics processes, enhancing efficiency across teams. Utilized Python to clean and optimize company data, improving data integrity. Also participated in improving company data collection using LLama and Azure AI"
  },
  {
    id: 3,
    period: "Jan 2025 — Dec 2025",
    company: "Asia Pacific University Indonesian Student Society (AUISS) | PPI APU",
    role: "Resource & Information Staff",
    desc: "Responsible for managing and coordinating bookings and logistics for student-related resources, including transport, venue reservations, and event equipment."
  }
];

const AWARDS_DATA = [
  {
    id: 1,
    year: "2025",
    title: "APU Alphaton 3rd Place", 
    issuer: "WorldQuant",
    img: alphatonCert 
  },
  {
    id: 2,
    year: "2025",
    title: "APU Mega Career Fair Staff",
    issuer: "Asia Pacific University",
    img: apuCareerCert 
  },
  {
    id: 3,
    year: "2024",
    title: "Sparkathon Finalist",
    issuer: "APU x BAT",
    img: sparkathonCert 
  },
  {
    id: 4,
    year: "2025",
    title: "Gold Level Quant",
    issuer: "WorldQuant",
    img: goldlevel
  },
  {
    id: 5,
    year: "2025",
    title: "SQl Intermediate Test",
    issuer: "Hackerrank",
    img: SQLInter
  }
];

// --- Skill Data & Icon URLs ---
const FRONTEND_SKILLS = [
  { name: 'TypeScript', url: 'https://cdn-icons-png.flaticon.com/512/5968/5968381.png' },
  { name: 'React.js', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/3840px-React-icon.svg.png' },
  { name: 'Next.js', url: 'https://img.icons8.com/color/1200/nextjs.jpg' },
  { name: 'Tailwind CSS', url: 'https://www.svgrepo.com/show/374118/tailwind.svg' },
  { name: 'HTML', url: 'https://cdn-icons-png.flaticon.com/512/919/919827.png' },
  { name: 'CSS', url: 'https://cdn-icons-png.flaticon.com/512/5968/5968242.png' } 
];

const BACKEND_SKILLS = [
  { name: 'TypeScript', url: 'https://cdn-icons-png.flaticon.com/512/5968/5968381.png' },
  { name: 'Node.js', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6bebC_d4eWwJ-x9ntqDuT94TvOgumSBVWHg&s' },
  { name: 'Python', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1280px-Python-logo-notext.svg.png' },
  { name: 'Java', url: 'https://cdn-icons-png.flaticon.com/512/226/226777.png' },
  { name: 'C#', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Csharp_Logo.png' }, 
  { name: 'XML', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3NoooAK_XO7hNS7Gw8_0ZxhUerKGgkcs_pg&s' }, 
  { name: 'SQL', url: 'https://img.icons8.com/fluent/1200/sql.jpg' }
];

const TOOL_SKILLS = [
  { name: 'Microsoft 365', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Microsoft_365_%282022%29.svg/500px-Microsoft_365_%282022%29.svg.png' }, 
  { name: 'VSCode', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Visual_Studio_Code_1.35_icon.svg/500px-Visual_Studio_Code_1.35_icon.svg.png' }, 
  { name: 'SAP', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHd0EmiAFrtoL_VQfssOOGKUCb7KovafdMSw&s' },
  { name: 'Github', url: 'https://cdn.simpleicons.org/github/white' },
  { name: 'Figma', url: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg' },
  { name: 'Power BI', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/New_Power_BI_Logo.svg/960px-New_Power_BI_Logo.svg.png' }, 
  { name: 'Canva', url: 'https://static.vecteezy.com/system/resources/thumbnails/048/759/334/small/canva-transparent-icon-free-png.png' } 
];

// --- Custom SVG Icons ---
const LinkedinIcon = ({ size = 20, strokeWidth = 1.5 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);
const InstagramIcon = ({ size = 20, strokeWidth = 1.5 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);
const GithubIcon = ({ size = 20, strokeWidth = 1.5 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
);
const MailIcon = ({ size = 20, strokeWidth = 1.5 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
);

// --- Global GSAP Utility ---
const initFluidParallax = () => {
  if (!window.gsap) return;
  window.gsap.utils.toArray('[data-speed]').forEach(el => {
    const speed = parseFloat(el.getAttribute('data-speed'));
    window.gsap.to(el, {
      y: -120 * speed, // Dynamic upward lift
      ease: "none",
      scrollTrigger: {
        trigger: el.parentElement,
        start: "top bottom",
        end: "bottom top",
        scrub: 2 // This creates the heavy, buttery "lag"
      }
    });
  });
};

// --- Luxury Interactive Cursor Component ---
const CustomCursor = () => {
  const [hoverType, setHoverType] = useState(null); 
  const [cursorImg, setCursorImg] = useState(null);

  // High-Performance Refs to bypass React State stutters
  const targetRef = useRef({ x: -100, y: -100 });
  const dotRef = useRef({ x: -100, y: -100 });
  const ringRef = useRef({ x: -100, y: -100 });
  
  const dotEl = useRef(null);
  const ringEl = useRef(null);

  useEffect(() => {
    let animationFrameId;
    const updatePosition = (e) => {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;
      
      const target = e.target;
      const imgTarget = target.closest('[data-cursor-img]');
      
      if (target.closest('.view-project-cursor')) {
        setHoverType('project');
        setCursorImg(null);
      } else if (imgTarget) {
        setHoverType(imgTarget.dataset.cursorType || 'skill');
        setCursorImg(imgTarget.dataset.cursorImg);
      } else if (target.closest('a, button, .project-link, .project-clickable, input, textarea')) {
        setHoverType('link');
        setCursorImg(null);
      } else {
        setHoverType(null);
        setCursorImg(null);
      }
    };

    window.addEventListener('mousemove', updatePosition);

    const ticker = () => {
      // "Heavy" Professional Lerp Physics
      dotRef.current.x += (targetRef.current.x - dotRef.current.x) * 0.15; // Dot trails smoothly
      dotRef.current.y += (targetRef.current.y - dotRef.current.y) * 0.15;
      
      ringRef.current.x += (targetRef.current.x - ringRef.current.x) * 0.05; // Ring drags heavily
      ringRef.current.y += (targetRef.current.y - ringRef.current.y) * 0.05;

      if (dotEl.current) {
        dotEl.current.style.transform = `translate3d(${dotRef.current.x}px, ${dotRef.current.y}px, 0)`;
      }
      if (ringEl.current) {
        ringEl.current.style.transform = `translate3d(${ringRef.current.x}px, ${ringRef.current.y}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(ticker);
    };
    
    ticker();

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const isProject = hoverType === 'project';
  const isLink = hoverType === 'link';
  const isSkill = hoverType === 'skill';
  const isEdu = hoverType === 'education';
  const hasCustomImg = isSkill || isEdu;

  return (
    <>
      {/* Core Cursor Dot (Fast) */}
      <div 
        ref={dotEl}
        className="fixed top-0 left-0 pointer-events-none z-[110] will-change-transform"
      >
        <div className={`flex items-center justify-center transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] -translate-x-1/2 -translate-y-1/2
          ${isProject ? 'w-24 h-24 rounded-[50%] bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)] text-white font-medium text-xs tracking-widest' : 
            isSkill ? 'w-16 h-16 rounded-[50%] bg-[#111111]/95 backdrop-blur-xl border border-[#E8383D]/40 p-4 shadow-[0_0_20px_rgba(232,56,61,0.3)]' :
            isEdu ? 'w-[20rem] h-[12rem] md:w-[28rem] md:h-[16rem] rounded-xl bg-[#0a0a0a] overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]' :
            isLink ? 'w-0 h-0 rounded-[50%] opacity-0' : 'w-2 h-2 rounded-[50%] bg-[#E8383D]'}`}
        >
          {isProject && <span className="relative z-10 opacity-100 animate-[fadeInUp_0.3s_ease-out]">VIEW</span>}
          {/* Using a key forces React to re-trigger the CSS fade animation when the image changes */}
          {isSkill && cursorImg && <img key={cursorImg} src={cursorImg} alt="Skill Icon" className="w-full h-full object-contain opacity-0 animate-custom-fade" />}
          {isEdu && cursorImg && <img key={cursorImg} src={cursorImg} alt="Education Preview" className="w-full h-full object-cover opacity-0 animate-custom-fade" />}
        </div>
      </div>
      
      {/* Trailing Cursor Ring (Heavy Lag) */}
      <div 
        ref={ringEl}
        className="fixed top-0 left-0 pointer-events-none z-[105] will-change-transform"
      >
        <div className={`flex items-center justify-center rounded-[50%] transition-all duration-500 ease-out -translate-x-1/2 -translate-y-1/2
          ${(isProject || hasCustomImg) ? 'w-0 h-0 opacity-0' : 
            isLink ? 'w-16 h-16 bg-white/20 opacity-100' : 'w-8 h-8 border border-white/20 opacity-50'}`}
        />
      </div>
    </>
  );
};

// --- Live Clock Component ---
const LiveClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const format = (options) => time.toLocaleTimeString('en-US', { timeZone: 'Asia/Kuala_Lumpur', ...options });
  const hours = format({ hour12: false, hour: '2-digit' });
  const minutes = format({ minute: '2-digit' });
  const seconds = format({ second: '2-digit' });

  return (
    <div className="flex items-end gap-3 font-['Montserrat',_sans-serif] mt-1">
      <div className="flex items-baseline text-4xl md:text-5xl font-thin tracking-tighter text-white">
        <span>{hours}</span>
        <span className="animate-[pulse_2s_ease-in-out_infinite] opacity-30 mx-1 -translate-y-1">:</span>
        <span>{minutes}</span>
      </div>
      <div className="flex flex-col pb-1">
        <span className="text-[#E8383D] text-sm font-medium tracking-widest w-6">{seconds}</span>
        <span className="text-[10px] tracking-widest opacity-40 uppercase">MYT</span>
      </div>
    </div>
  );
};

// --- Fully Interactive Physics Canvas Background ---
const TraceTrailBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: true }); 
    let animationFrameId;
    let particles = [];
    let sakuraPetals = [];
    let ambientParticles = [];
    let mouse = { x: -100, y: -100 };
    let lastMouse = { x: -100, y: -100 };
    let isHovering = false;

    const initAmbientParticles = (w, h) => {
      ambientParticles = [];
      for(let i = 0; i < 60; i++) {
        ambientParticles.push(new AmbientParticle(w, h));
      }
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initAmbientParticles(canvas.width, canvas.height);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
      lastMouse.x = mouse.x === -100 ? e.clientX : mouse.x;
      lastMouse.y = mouse.y === -100 ? e.clientY : mouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      
      isHovering = !!e.target.closest('a, button, h1, h2, h3, span, input, img, .project-card, .project-clickable');
      
      const dx = mouse.x - lastMouse.x;
      const dy = mouse.y - lastMouse.y;
      const dist = Math.hypot(dx, dy);
      const steps = Math.max(1, Math.floor(dist / 2)); 
      
      for(let i = 0; i < steps; i++) {
        const lerpX = lastMouse.x + dx * (i / steps);
        const lerpY = lastMouse.y + dy * (i / steps);
        const color = isHovering ? '232, 56, 61' : '255, 255, 255';
        particles.push(new TraceParticle(lerpX, lerpY, color));
      }

      if (isHovering && dist > 2 && Math.random() > 0.5) {
          sakuraPetals.push(new SakuraParticle(mouse.x, mouse.y, dx, dy));
      }
    });

    class AmbientParticle {
      constructor(w, h) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.type = Math.random() > 0.6 ? 'firefly' : 'sakura';

        if (this.type === 'firefly') {
          this.baseVx = (Math.random() - 0.5) * 0.4;
          this.baseVy = (Math.random() - 0.5) * 0.4;
          this.size = Math.random() * 1.5 + 0.8;
          this.baseAlpha = Math.random() * 0.4 + 0.1;
          this.pulseSpeed = Math.random() * 0.02 + 0.01;
          this.color = '255, 223, 100'; 
        } else {
          this.baseVx = Math.random() * 0.5 + 0.1; 
          this.baseVy = Math.random() * 0.8 + 0.2; 
          this.size = Math.random() * 2.5 + 1.5;
          this.baseAlpha = Math.random() * 0.2 + 0.05;
          this.spin = (Math.random() - 0.5) * 0.03;
          this.color = Math.random() > 0.5 ? '255, 228, 225' : '255, 183, 197';
        }
        
        this.vx = this.baseVx;
        this.vy = this.baseVy || (Math.random() - 0.5) * 0.4;
        this.angle = Math.random() * Math.PI * 2;
      }
      
      update(w, h, mx, my, hovering) {
        let targetVx = this.baseVx;
        let targetVy = this.type === 'firefly' ? this.baseVy : (this.baseVy || 0.5);

        if (mx !== -100 && my !== -100) {
            const dx = this.x - mx;
            const dy = this.y - my;
            const dist = Math.hypot(dx, dy);
            const radius = hovering ? 300 : 150;

            if (dist < radius) {
                const force = Math.pow((radius - dist) / radius, 2);
                if (hovering) {
                    targetVx -= (dx / dist) * force * 1.5;
                    targetVy -= (dy / dist) * force * 1.5;
                } else {
                    targetVx += (dx / dist) * force * 2;
                    targetVy += (dy / dist) * force * 2;
                }
            }
        }

        this.vx += (targetVx - this.vx) * 0.05;
        this.vy += (targetVy - this.vy) * 0.05;
        this.x += this.vx;
        this.y += this.vy;

        if (this.type === 'firefly') {
          this.angle += this.pulseSpeed;
          this.x += Math.sin(this.angle) * 0.2; 
        } else {
          this.angle += this.spin;
          this.x += Math.sin(this.y * 0.01) * 0.3; 
        }

        if (this.x > w + 20) this.x = -20;
        else if (this.x < -20) this.x = w + 20;
        if (this.y > h + 20) this.y = -20;
        else if (this.y < -20) this.y = h + 20;
      }
      
      draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        if (this.type === 'firefly') {
          const alpha = this.baseAlpha + Math.sin(this.angle) * 0.3;
          const currentAlpha = Math.max(0.05, alpha);
          ctx.shadowBlur = 15;
          ctx.shadowColor = `rgba(${this.color}, ${currentAlpha})`;
          ctx.beginPath();
          ctx.arc(0, 0, this.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${this.color}, ${currentAlpha})`;
          ctx.fill();
        } else {
          ctx.rotate(this.angle);
          ctx.fillStyle = `rgba(${this.color}, ${this.baseAlpha})`;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(this.size, -this.size, 0, -this.size * 2);
          ctx.quadraticCurveTo(-this.size, -this.size, 0, 0);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    class TraceParticle {
      constructor(x, y, color) {
        this.x = x; 
        this.y = y;
        this.size = 12; 
        this.life = 1;
        this.color = color;
      }
      update() {
        this.life -= 0.012; 
        this.size -= 0.06;  
      }
      draw(ctx) {
        if (this.life <= 0 || this.size <= 0) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.life * 0.12})`;
        ctx.fill();
      }
    }

    class SakuraParticle {
      constructor(x, y, dx, dy) {
        this.x = x + (Math.random() - 0.5) * 20;
        this.y = y + (Math.random() - 0.5) * 20;
        this.size = Math.random() * 4 + 3;
        this.vx = dx * 0.05 + (Math.random() - 0.5) * 2;
        this.vy = dy * 0.05 + Math.random() * 1.5 + 0.5;
        this.life = 1;
        this.angle = Math.random() * Math.PI * 2;
        this.spin = (Math.random() - 0.5) * 0.2;
        this.color = Math.random() > 0.4 ? '255, 183, 197' : '232, 56, 61';
      }
      update() {
        this.x += this.vx + Math.sin(this.life * 15) * 0.8;
        this.y += this.vy;
        this.angle += this.spin;
        this.life -= 0.008; 
      }
      draw(ctx) {
        if (this.life <= 0) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = `rgba(${this.color}, ${this.life})`;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(this.size, -this.size, 0, -this.size * 2);
        ctx.quadraticCurveTo(-this.size, -this.size, 0, 0);
        ctx.fill();
        ctx.restore();
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < ambientParticles.length; i++) {
        ambientParticles[i].update(canvas.width, canvas.height, mouse.x, mouse.y, isHovering);
        ambientParticles[i].draw(ctx);
      }
      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw(ctx);
        if (particles[i].life <= 0) particles.splice(i, 1);
      }
      for (let i = sakuraPetals.length - 1; i >= 0; i--) {
        sakuraPetals[i].update();
        sakuraPetals[i].draw(ctx);
        if (sakuraPetals[i].life <= 0) sakuraPetals.splice(i, 1);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};

// --- Kinetic Magnetic Typography Component ---
const InteractiveTitle = ({ text, className = "" }) => {
  const containerRef = useRef(null);
  const lettersRef = useRef([]);

  useEffect(() => {
    let isResting = true;

    const handleMouseMove = (e) => {
      if (!window.gsap || !containerRef.current) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const { clientX, clientY } = e;
      
      // Calculate optimization boundaries (skip math if mouse is far away)
      const isFar = 
        clientY < containerRect.top - 300 || 
        clientY > containerRect.bottom + 300 ||
        clientX < containerRect.left - 300 ||
        clientX > containerRect.right + 300;

      if (isFar) {
        if (!isResting) {
          lettersRef.current.forEach((letter) => {
            if (letter) {
              window.gsap.to(letter, {
                y: 0, x: 0, rotateZ: 0, rotateX: 0, color: 'inherit', textShadow: 'none', scale: 1,
                duration: 1.5, ease: 'elastic.out(1, 0.3)', overwrite: "auto"
              });
            }
          });
          isResting = true;
        }
        return;
      }

      isResting = false;

      // Magnetic field displacement for each letter
      lettersRef.current.forEach((letter) => {
        if (!letter) return;
        const rect = letter.getBoundingClientRect();
        
        // Get absolute center of the specific letter
        const letterCenterX = rect.left + rect.width / 2;
        const letterCenterY = rect.top + rect.height / 2;

        const distanceX = clientX - letterCenterX;
        const distanceY = clientY - letterCenterY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        const radius = 250; // generous radius for fluid feel

        if (distance < radius) {
          const force = Math.pow((radius - distance) / radius, 1.5);
          
          window.gsap.to(letter, {
            y: -force * 40, // Elegant upward lift
            x: (distanceX / distance) * -force * 20, // Gentle magnetic repel on X-axis
            rotateZ: (distanceX / distance) * force * 15, // Smooth organic tilt
            rotateX: force * 45, // 3D bend backward away from cursor
            color: '#E8383D', // Vermilion red ignition
            textShadow: '0px 20px 40px rgba(232,56,61,0.6)',
            scale: 1 + force * 0.15,
            duration: 0.5,
            ease: 'power3.out',
            overwrite: "auto"
          });
        } else {
          // Graceful organic snap-back
          window.gsap.to(letter, {
            y: 0, x: 0, rotateZ: 0, rotateX: 0, color: 'inherit', textShadow: 'none', scale: 1,
            duration: 1.2, ease: 'elastic.out(1, 0.3)', overwrite: "auto"
          });
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <span
      ref={containerRef}
      className="flex whitespace-nowrap"
      style={{ perspective: '1000px' }}
    >
      {text.split('').map((char, i) => (
        <span
          key={i}
          ref={el => lettersRef.current[i] = el}
          className={`inline-block relative z-10 will-change-transform cursor-none ${className}`}
          style={{ transformOrigin: 'center bottom' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
};

// --- LUXURIOUS COMING SOON OVERLAY ---
const ComingSoonOverlay = ({ isOpen, onClose }) => {
  const containerRef = useRef(null);
  const curtainTopRef = useRef(null);
  const curtainBottomRef = useRef(null);
  const textContainerRef = useRef(null);

  useEffect(() => {
    if (!window.gsap) return;
    const tl = window.gsap.timeline();

    if (isOpen) {
      window.gsap.set(containerRef.current, { visibility: 'visible', pointerEvents: 'auto' });
      
      // Cinematic Split Curtain Entrance
      tl.to([curtainTopRef.current, curtainBottomRef.current], {
          height: "50vh",
          duration: 1.2,
          ease: "expo.inOut",
          stagger: 0.1
        })
        .fromTo('.gallery-stagger', 
          { y: 100, opacity: 0, rotateX: 15 },
          { y: 0, opacity: 1, rotateX: 0, duration: 1.5, stagger: 0.1, ease: "power4.out" },
          "-=0.6"
        );
    } else {
      // Exit Animation
      tl.to('.gallery-stagger', { y: -50, opacity: 0, duration: 0.6, stagger: 0.05, ease: "power3.in" })
        .to([curtainBottomRef.current, curtainTopRef.current], { 
          height: "0vh", 
          duration: 1, 
          ease: "expo.inOut",
          stagger: 0.1
        }, "-=0.2")
        .set(containerRef.current, { visibility: 'hidden', pointerEvents: 'none' });
    }
  }, [isOpen]);

  // Mouse Parallax Effect for the overlay text
  useEffect(() => {
    if (!isOpen || !window.gsap) return;
    
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 80;
      const y = (e.clientY / window.innerHeight - 0.5) * 80;
      
      window.gsap.to(textContainerRef.current, {
        x: x,
        y: y,
        duration: 2,
        ease: "power3.out"
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100] flex items-center justify-center invisible">
      
      {/* Split Curtains */}
      <div ref={curtainTopRef} className="absolute top-0 left-0 w-full h-0 bg-[#050505] shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col justify-end overflow-hidden z-10">
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>
      <div ref={curtainBottomRef} className="absolute bottom-0 left-0 w-full h-0 bg-[#050505] shadow-[0_-10px_30px_rgba(0,0,0,0.5)] overflow-hidden z-10">
         <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>
      
      {/* 3D Floating Text Container */}
      <div ref={textContainerRef} className="relative z-20 flex flex-col items-center justify-center text-center px-4 w-full" style={{ perspective: '1000px' }}>
        <div className="overflow-hidden mb-2 w-full">
           <p className="gallery-stagger text-[#E8383D] font-light tracking-[0.4em] uppercase text-sm md:text-base w-full text-center">The Collection</p>
        </div>
        <div className="overflow-hidden pb-4 w-full flex justify-center">
           <h2 className="gallery-stagger text-[12vw] md:text-[8vw] font-thin font-['Zen_Old_Mincho',_serif] uppercase tracking-tighter leading-none text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] w-full text-center">
             Gallery
           </h2>
        </div>
        <div className="w-[1px] h-16 bg-gradient-to-b from-[#E8383D] to-transparent gallery-stagger my-6"></div>
        <div className="overflow-hidden w-full">
           <h3 className="gallery-stagger text-2xl md:text-3xl font-extralight tracking-[0.3em] text-white/80 uppercase mb-6 w-full text-center">Coming Soon</h3>
        </div>
        <div className="overflow-hidden w-full flex justify-center">
           <p className="gallery-stagger font-extralight tracking-wide text-sm md:text-base text-white/50 max-w-md text-center leading-relaxed">
             Not much to see here yet - but trust me, I’m working on it.
           </p>
        </div>
        <div className="overflow-hidden mt-16 w-full flex justify-center">
          <button onClick={onClose} className="gallery-stagger group relative font-light tracking-widest text-sm uppercase project-link text-white/60 hover:text-white transition-colors duration-300 py-2">
            Return to Portfolio
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-full h-[1px] bg-[#E8383D] transition-all duration-500"></span>
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Page Components ---

const HomeView = ({ isLoaded }) => {
  const heroRef = useRef(null);
  const motivationRef = useRef(null);
  const skillsRef = useRef(null);
  const educationRef = useRef(null);
  const experienceRef = useRef(null);
  const awardsRef = useRef(null);
  const contactRef = useRef(null);

  useLayoutEffect(() => {
    if (!isLoaded || !window.gsap) return;

    const ctx = window.gsap.context(() => {
      initFluidParallax(); // Apply the heavy floating lag to all [data-speed] elements!

      // Hero Entry
      window.gsap.fromTo(heroRef.current.querySelectorAll('.hero-anim-skew'),
        { y: 80, opacity: 0, skewY: 5 },
        { y: 0, opacity: 1, skewY: 0, duration: 1.2, stagger: 0.15, ease: "power4.out", delay: 0.1 }
      );
      window.gsap.fromTo(heroRef.current.querySelectorAll('.hero-anim-fade'),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.2, ease: "power3.out", delay: 0.4 }
      );

      // Motivation
      if (motivationRef.current) {
        window.gsap.fromTo(motivationRef.current.querySelectorAll('.mot-text'),
          { x: -30, opacity: 0 },
          { x: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: "power4.out", scrollTrigger: { trigger: motivationRef.current, start: "top 80%" } }
        );
        window.gsap.fromTo(motivationRef.current.querySelectorAll('.mot-img'),
          { scale: 1.05, opacity: 0, filter: "blur(10px)" },
          { scale: 1, opacity: 1, filter: "blur(0px)", duration: 1.5, ease: "power3.out", scrollTrigger: { trigger: motivationRef.current, start: "top 75%" } }
        );
      }

      // Skills
      if (skillsRef.current) {
        window.gsap.fromTo(skillsRef.current.querySelectorAll('.skill-pill'),
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: "back.out(1.5)", scrollTrigger: { trigger: skillsRef.current, start: "top 85%" } }
        );
      }

      // Education
      if (educationRef.current) {
        const line = educationRef.current.querySelector('.edu-timeline-line');
        const nodes = educationRef.current.querySelectorAll('.edu-node');
        const items = educationRef.current.querySelectorAll('.edu-content');

        window.gsap.to(line, { scaleY: 1, ease: "none", scrollTrigger: { trigger: educationRef.current, start: "top 60%", end: "bottom 80%", scrub: true } });
        window.gsap.fromTo(nodes, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, stagger: 0.3, ease: "back.out(2)", scrollTrigger: { trigger: educationRef.current, start: "top 75%" } });
        window.gsap.fromTo(items, { x: 30, opacity: 0, scale: 0.98 }, { x: 0, opacity: 1, scale: 1, duration: 1.2, stagger: 0.3, ease: "power4.out", scrollTrigger: { trigger: educationRef.current, start: "top 75%" } });
      }

      // Experience (Entry isolated to opacity/filter to allow data-speed Y-axis parallax)
      if (experienceRef.current) {
        window.gsap.fromTo(experienceRef.current.querySelectorAll('.exp-item'),
          { opacity: 0, filter: "blur(10px)" },
          { opacity: 1, filter: "blur(0px)", duration: 1.2, stagger: 0.15, ease: "power4.out", scrollTrigger: { trigger: experienceRef.current, start: "top 80%" } }
        );
      }

      // Awards (Changed to vertical list entry)
      if (awardsRef.current) {
        window.gsap.fromTo(awardsRef.current.querySelectorAll('.award-item'),
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1.2, stagger: 0.1, ease: "power4.out", scrollTrigger: { trigger: awardsRef.current, start: "top 85%" } }
        );
      }

      // Cinematic Contact Reveal
      if (contactRef.current) {
        window.gsap.fromTo(contactRef.current.querySelectorAll('.contact-reveal'),
          { y: "120%", opacity: 0 },
          { y: "0%", opacity: 1, duration: 1.4, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: contactRef.current, start: "top 85%" } }
        );
        window.gsap.fromTo(contactRef.current.querySelector('.contact-line'),
          { scaleX: 0 },
          { scaleX: 1, duration: 1.5, ease: "expo.inOut", scrollTrigger: { trigger: contactRef.current, start: "top 85%" } }
        );
      }
    });

    return () => ctx.revert();
  }, [isLoaded]);

  return (
    <>
      <section ref={heroRef} className="min-h-[80vh] flex items-center pt-32 md:pt-48">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 w-full items-center">
          <div className="lg:col-span-7 flex flex-col justify-center text-white relative z-10 will-change-transform" data-speed="1.2">
            
            {/* Luxury Editorial Typography Lockup */}
            <div className="relative mb-8 md:mb-12">
              <div className="absolute -left-6 md:-left-12 top-4 bottom-0 flex items-start opacity-0 hero-anim-fade hidden md:flex">
                 <span className="font-['Zen_Old_Mincho',_serif] text-xs tracking-[0.8em] text-[#E8383D] opacity-60" style={{ writingMode: 'vertical-rl' }}>
                   ウェブ開発者
                 </span>
              </div>
              <h1 className="flex flex-col items-start opacity-0 hero-anim-skew">
                <InteractiveTitle 
                  text="JOVAN" 
                  className="font-['Zen_Old_Mincho',_serif] text-7xl md:text-9xl lg:text-[11rem] tracking-[-0.02em] leading-[0.85] text-white" 
                />
                <InteractiveTitle 
                  text="CHANDRA" 
                  className="text-xl md:text-3xl lg:text-4xl font-extralight tracking-[0.4em] md:tracking-[0.7em] text-white/60 mt-2 md:mt-6 ml-1 md:ml-2" 
                />
              </h1>
            </div>

            <p className="text-lg md:text-xl font-extralight opacity-80 tracking-wide mb-24 opacity-0 hero-anim-fade">
              Final Year Business Information System Student <span className="text-[#E8383D] mx-2">/</span> Website Designer
            </p>

            <div className="mt-8 md:mt-16 opacity-0 hero-anim-fade">
              <p className="text-sm md:text-base font-light opacity-70 leading-relaxed max-w-xs">
                For business inquiries, email me at<br/>
                <a href="mailto:jovan.rc1212@gmail.com" className="inline-block mt-1 border-b border-transparent hover:border-[#E8383D] hover:text-[#E8383D] hover:drop-shadow-[0_0_8px_rgba(232,56,61,0.5)] transition-all duration-500 pb-1 project-link">jovan.rc1212@gmail.com</a>
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 lg:pl-12 text-white relative z-10 opacity-0 hero-anim-fade will-change-transform" data-speed="0.8">
            <div className="mb-6 border-b border-white/20 pb-4">
              <h2 className="text-xl md:text-2xl font-light tracking-widest uppercase">About Me</h2>
            </div>
            <div className="space-y-6 text-sm md:text-base font-extralight opacity-80 leading-relaxed">
              <p className="hover:text-[#E8383D] transition-colors duration-300">I am currently in my final year of Bachelor of Information Technology at Asia Pacific University.</p>
              <p className="hover:text-[#E8383D] transition-colors duration-300">My primary focus is on web development and UI/UX design, supported by hands-on experience through several university projects. I enjoy exploring emerging technologies and experimenting with creative ideas to build innovative digital solutions.</p>
              <p className="hover:text-[#E8383D] transition-colors duration-300">Beyond academics, I actively engage in sports such as badminton and pickleball, which help me maintain a balanced and disciplined lifestyle.</p>
            </div>
          </div>
        </div>
      </section>

      <section ref={motivationRef} className="mt-24 md:mt-48 text-white relative z-10">
        <div className="border-b border-white/20 pb-4 mb-12 will-change-transform" data-speed="0.2">
          <h2 className="text-2xl font-light tracking-widest uppercase mot-text">Motivation</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="space-y-6 text-base md:text-lg font-extralight opacity-80 leading-relaxed max-w-xl will-change-transform" data-speed="0.4">
            <p className="mot-text hover:text-[#E8383D] transition-colors duration-300">I am a full-stack developer with a strong interest in frontend development. I enjoy exploring new ideas and technologies, especially in web development. I like discovering new libraries, testing new features, and building better user experiences.</p>
            <p className="mot-text hover:text-[#E8383D] transition-colors duration-300">I am also learning beyond web development, especially in Artificial Intelligence. I’m exploring how AI works in chatbots and Robotic Process Automation (RPA). This helps me understand how technology can solve real-world problems.</p>
            <p className="mot-text hover:text-[#E8383D] transition-colors duration-300">I am still exploring my career path and where I can grow the most. I enjoy building solutions that make users happy, especially through websites. For now, I am focused on improving my technical, design, and business skills.</p>
          </div>
          <div className="w-full aspect-[4/3] bg-[#0a0a0a] overflow-hidden relative border border-white/10 group shadow-[0_0_30px_rgba(255,255,255,0.02)] mot-img will-change-transform" data-speed="0.6">
            <div className="absolute inset-0 bg-[#E8383D]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-10 pointer-events-none mix-blend-overlay"></div>
            <img 
                src={motivationImg} 
                alt="My Motivation" 
                className="w-full h-full object-cover grayscale opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
              />
          </div>
        </div>
      </section>

      <section ref={skillsRef} className="mt-32 md:mt-48 text-white relative z-10">
        <div className="border-b border-white/20 pb-4 mb-16 will-change-transform" data-speed="0.2">
          <h2 className="text-2xl font-light tracking-widest uppercase">Skills</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          <div className="will-change-transform" data-speed="0.3">
            <h3 className="text-lg md:text-xl font-light tracking-widest uppercase mb-8 text-[#E8383D]">Frontend</h3>
            <div className="flex flex-wrap gap-3">
              {FRONTEND_SKILLS.map((skill) => (
                <div key={skill.name} className="overflow-hidden p-1 -m-1">
                  <span 
                    className="skill-pill block border border-white/20 rounded-full px-5 py-2 text-sm font-extralight hover:bg-transparent hover:text-[#E8383D] hover:border-[#E8383D] hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(232,56,61,0.4)] transition-all duration-300 cursor-none"
                    data-cursor-img={skill.url}
                    data-cursor-type="skill"
                  >
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="will-change-transform" data-speed="0.5">
            <h3 className="text-lg md:text-xl font-light tracking-widest uppercase mb-8 text-[#E8383D]">Backend</h3>
            <div className="flex flex-wrap gap-3">
              {BACKEND_SKILLS.map((skill) => (
                <div key={skill.name} className="overflow-hidden p-1 -m-1">
                  <span 
                    className="skill-pill block border border-white/20 rounded-full px-5 py-2 text-sm font-extralight hover:bg-transparent hover:text-[#E8383D] hover:border-[#E8383D] hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(232,56,61,0.4)] transition-all duration-300 cursor-none"
                    data-cursor-img={skill.url}
                    data-cursor-type="skill"
                  >
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="will-change-transform" data-speed="0.7">
            <h3 className="text-lg md:text-xl font-light tracking-widest uppercase mb-8 text-[#E8383D]">Tools</h3>
            <div className="flex flex-wrap gap-3">
              {TOOL_SKILLS.map((skill) => (
                <div key={skill.name} className="overflow-hidden p-1 -m-1">
                  <span 
                    className="skill-pill block border border-white/20 rounded-full px-5 py-2 text-sm font-extralight hover:bg-transparent hover:text-[#E8383D] hover:border-[#E8383D] hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(232,56,61,0.4)] transition-all duration-300 cursor-none"
                    data-cursor-img={skill.url}
                    data-cursor-type="skill"
                  >
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section ref={educationRef} className="mt-32 md:mt-48 text-white relative z-10">
        <div className="border-b border-white/20 pb-4 mb-16 will-change-transform" data-speed="0.2">
          <h2 className="text-2xl font-light tracking-widest uppercase">Education</h2>
        </div>

        <div className="relative border-l-0 ml-2 md:ml-4 space-y-24 pb-8">
          <div className="absolute top-4 left-[5px] w-[1px] h-full bg-white/10 hidden md:block"></div>
          <div className="absolute top-4 left-[4.5px] w-[2px] h-full bg-[#E8383D] origin-top scale-y-0 edu-timeline-line hidden md:block z-0 shadow-[0_0_10px_rgba(232,56,61,0.5)]"></div>

          

          <div 
            className="relative md:pl-16 group cursor-none will-change-transform"
            data-speed="0.3"
            data-cursor-img="https://backend.studyfans.com/storage/media/Universities/main_image/2784/HZojmHanwatI1sXj7diGynUsWP9wkIa64NOSyIGg.webp"
            data-cursor-type="education"
          >
            <div className="absolute top-3 left-0 w-3 h-3 rounded-full bg-[#111111] border-[1.5px] border-white/30 group-hover:border-[#E8383D] group-hover:bg-[#E8383D] group-hover:scale-150 group-hover:shadow-[0_0_20px_rgba(232,56,61,0.8)] transition-all duration-500 z-10 hidden md:block edu-node"></div>
            
            <div className="edu-content">
              <p className="text-[#E8383D] text-xs md:text-sm tracking-widest uppercase mb-3 font-light">Sept 2023 — Sept 2026</p>
              <h3 className="text-3xl md:text-5xl font-thin tracking-wide mb-4 text-white group-hover:text-[#E8383D] group-hover:translate-x-3 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">Asia Pacific University</h3>
              <p className="text-base md:text-lg font-extralight opacity-70 max-w-2xl leading-relaxed group-hover:translate-x-3 transition-all duration-500 delay-75 ease-[cubic-bezier(0.16,1,0.3,1)]">
                Bachelor of Information Technology with a Specialism in Business Information System.
              </p>
              <p className="text-base md:text-lg font-extralight opacity-70 max-w-2xl leading-relaxed group-hover:translate-x-3 transition-all duration-500 delay-75 ease-[cubic-bezier(0.16,1,0.3,1)]">
                GPA : 3.6/4.0
              </p>
            </div>
          </div>

          <div 
            className="relative md:pl-16 group cursor-none will-change-transform"
            data-speed="0.5"
            data-cursor-img="https://iics.sch.id/wp-content/uploads/2021/10/IPEKA-INTEGRATED.webp"
            data-cursor-type="education"
          >
            <div className="absolute top-3 left-0 w-3 h-3 rounded-full bg-[#111111] border-[1.5px] border-white/30 group-hover:border-[#E8383D] group-hover:bg-[#E8383D] group-hover:scale-150 group-hover:shadow-[0_0_20px_rgba(232,56,61,0.8)] transition-all duration-500 z-10 hidden md:block edu-node"></div>
            
            <div className="edu-content">
              <p className="text-[#E8383D] text-xs md:text-sm tracking-widest uppercase mb-3 font-light">Jul 2020 — May 2023</p>
              <h3 className="text-3xl md:text-5xl font-thin tracking-wide mb-4 text-white group-hover:text-[#E8383D] group-hover:translate-x-3 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">IPEKA Senior Highschool</h3>
              <p className="text-base md:text-lg font-extralight opacity-70 max-w-2xl leading-relaxed group-hover:translate-x-3 transition-all duration-500 delay-75 ease-[cubic-bezier(0.16,1,0.3,1)]">
                Social Sciences.
              </p>
              <p className="text-base md:text-lg font-extralight opacity-70 max-w-2xl leading-relaxed group-hover:translate-x-3 transition-all duration-500 delay-75 ease-[cubic-bezier(0.16,1,0.3,1)]">
                Score : 86/100
              </p>
            </div>
          </div>

          
        </div>
      </section>

      {/* --- Interactive Experience Section --- */}
      <section ref={experienceRef} className="mt-32 md:mt-48 text-white relative z-10">
        <div className="border-b border-white/20 pb-4 mb-12 will-change-transform" data-speed="0.2">
          <h2 className="text-2xl font-light tracking-widest uppercase">Experience</h2>
        </div>
        
        <div className="flex flex-col w-full border-b border-white/20">
          {EXPERIENCE_DATA.map((item, i) => (
            <div key={item.id} className="exp-item relative border-t border-white/20 py-10 md:py-16 group cursor-none project-link overflow-hidden will-change-transform" data-speed={0.3 + (i * 0.2)}>
              {/* Sweeping Red Background Line Hover */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-[#E8383D] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] z-10"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start md:items-center relative z-20">
                <div className="md:col-span-3">
                  <p className="text-xs md:text-sm font-light tracking-[0.2em] text-white/50 group-hover:text-white transition-colors duration-500">{item.period}</p>
                </div>
                <div className="md:col-span-5 flex flex-col group-hover:translate-x-4 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-thin tracking-wide text-white mb-2">{item.company}</h3>
                  <p className="text-[#E8383D] text-xs md:text-sm tracking-widest uppercase font-medium">{item.role}</p>
                </div>
                <div className="md:col-span-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] mt-4 md:mt-0">
                  <p className="text-sm font-extralight text-white/70 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Awards & Certifications Section --- */}
      <section ref={awardsRef} className="mt-32 md:mt-48 text-white relative z-10">
        <div className="border-b border-white/20 pb-4 mb-12 will-change-transform" data-speed="0.2">
          <h2 className="text-2xl font-light tracking-widest uppercase">Awards & Certifications</h2>
        </div>

        <div className="flex flex-col w-full">
          {AWARDS_DATA.map((award, i) => (
            <div 
              key={award.id} 
              className="award-item group flex flex-col md:flex-row md:items-center justify-between border-t border-white/20 py-8 md:py-12 cursor-none project-link will-change-transform relative overflow-hidden" 
              data-speed={0.2 + (i * 0.1)}
              data-cursor-img={award.img}
              data-cursor-type="education" // Reusing the large cinematic cursor from Education!
            >
              {/* Sweeping Bottom Red Line Hover */}
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#E8383D] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] z-10"></div>

              <div className="flex items-baseline gap-6 md:gap-12 relative z-20 group-hover:translate-x-6 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] w-full md:w-auto">
                <span className="text-sm font-light tracking-widest text-white/40 group-hover:text-[#E8383D] transition-colors duration-500 w-12 md:w-16 shrink-0">
                  {award.year}
                </span>
                <h3 className="text-2xl md:text-4xl lg:text-5xl font-thin tracking-wide text-white group-hover:text-white transition-colors duration-500 font-['Zen_Old_Mincho',_serif]">
                  {award.title}
                </h3>
              </div>
              
              <div className="relative z-20 opacity-60 group-hover:opacity-100 transition-opacity duration-500 md:text-right mt-4 md:mt-0 pl-[4.5rem] md:pl-0">
                <span className="text-xs md:text-sm font-extralight tracking-widest uppercase text-white/80 group-hover:text-[#E8383D]">
                  {award.issuer}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Grand Cinematic Contact / Footer Section --- */}
      <section ref={contactRef} className="mt-40 md:mt-56 text-white relative z-10 pb-8 md:pb-12">
        
        {/* Massive Screen-Spanning Typography */}
        <div className="w-full flex flex-col mb-16 md:mb-24 uppercase select-none">
          <div className="overflow-hidden will-change-transform" data-speed="0.2">
            <p className="text-[#E8383D] font-['Zen_Old_Mincho',_serif] tracking-[0.4em] text-sm md:text-base contact-reveal mb-4 ml-2">お問い合わせ</p>
          </div>
          <div className="overflow-hidden w-full will-change-transform" data-speed="0.8">
            <h2 className="text-[14vw] md:text-[11vw] leading-[0.85] font-thin tracking-tighter contact-reveal">LET'S</h2>
          </div>
          <div className="overflow-hidden w-full flex justify-center md:pl-[10vw] will-change-transform" data-speed="0.5">
            <h2 className="text-[14vw] md:text-[11vw] leading-[0.85] font-thin tracking-tighter contact-reveal text-white/80">WORK</h2>
          </div>
          <div className="overflow-hidden w-full flex justify-end will-change-transform" data-speed="0.2">
            <h2 className="text-[14vw] md:text-[11vw] leading-[0.85] font-thin tracking-tighter contact-reveal font-['Zen_Old_Mincho',_serif] italic text-white/40">
              TOGETHER<span className="text-[#E8383D] not-italic">.</span>
            </h2>
          </div>
        </div>

        {/* Animated Hairline Divider */}
        <div className="w-full h-[1px] bg-white/20 origin-left contact-line mb-12 md:mb-16"></div>

        {/* High-End Editorial Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 items-end">
          
          {/* Time & Location (Span 4) */}
          <div className="md:col-span-4 flex flex-col gap-8 md:gap-12 will-change-transform" data-speed="0.3">
            <div className="overflow-hidden">
              <div className="contact-reveal flex flex-col gap-2">
                <span className="text-[10px] md:text-xs tracking-[0.2em] uppercase opacity-40">Local Time</span>
                <LiveClock />
              </div>
            </div>
            <div className="overflow-hidden">
              <div className="contact-reveal flex flex-col gap-2">
                <span className="text-[10px] md:text-xs tracking-[0.2em] uppercase opacity-40">Location</span>
                <span className="font-light tracking-widest text-base md:text-lg">Kuala Lumpur, <span className="text-[#E8383D]">MY</span></span>
              </div>
            </div>
          </div>

          {/* Socials (Span 3) */}
          <div className="md:col-span-3 flex flex-col gap-4 will-change-transform" data-speed="0.5">
            <div className="overflow-hidden mb-2">
              <span className="text-[10px] md:text-xs tracking-[0.2em] uppercase opacity-40 contact-reveal block">Socials</span>
            </div>
            {[
              { name: 'LinkedIn', url: 'https://www.linkedin.com/in/jovan-richaldy/' },
              { name: 'Instagram', url: 'https://www.instagram.com/jovanrichaldy/?hl=en' },
              { name: 'GitHub', url: 'https://github.com/urboiflex' }
            ].map((social, i) => (
              <div key={social.name} className="overflow-hidden">
                <a href={social.url} target="_blank" rel="noopener noreferrer" className="contact-reveal block font-light tracking-widest text-sm md:text-base hover:text-[#E8383D] transition-colors duration-500 project-link w-max">
                  {social.name}
                </a>
              </div>
            ))}
          </div>

          {/* Huge Interactive Email (Span 5) */}
          <div className="md:col-span-5 flex flex-col md:items-end justify-end mt-8 md:mt-0 will-change-transform" data-speed="0.7">
            <div className="overflow-hidden w-full md:w-auto">
              <div className="contact-reveal flex flex-col gap-4 w-full md:items-end">
                <span className="text-[10px] md:text-xs tracking-[0.2em] uppercase opacity-40 text-left md:text-right w-full">Drop an Email</span>
                
                <a href="mailto:jovan.rc1212@gmail.com" className="group flex flex-col items-start md:items-end gap-2 project-link w-full md:w-max">
                  <div className="relative overflow-hidden pb-2">
                    <span className="block text-2xl md:text-4xl lg:text-5xl font-thin tracking-wider text-white transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[120%]">
                      jovan.rc1212@gmail.com
                    </span>
                    <span className="absolute top-0 left-0 block text-2xl md:text-4xl lg:text-5xl font-thin tracking-wider text-[#E8383D] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] translate-y-[120%] group-hover:translate-y-0">
                      jovan.rc1212@gmail.com
                    </span>
                  </div>
                  {/* Magnetic underline effect */}
                  <div className="w-full h-[1px] bg-white/20 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[#E8383D] -translate-x-[101%] group-hover:translate-x-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"></div>
                  </div>
                </a>

              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
};

// --- Interactive Works Gallery Component ---
const WorksView = ({ isLoaded, onProjectClick }) => {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useLayoutEffect(() => {
    if (!isLoaded || !window.gsap || !window.ScrollTrigger) return;

    const ctx = window.gsap.context(() => {
      initFluidParallax(); 
      
      // Header Animation
      window.gsap.fromTo('.works-header-anim', 
        { y: 40, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.1, ease: "power4.out", delay: 0.1 }
      );

      // ScrollTrigger for tracking which image is currently in the viewport
      PROJECTS_DATA.forEach((_, i) => {
        window.ScrollTrigger.create({
          trigger: `.project-img-container-${i}`,
          start: "top 50%", 
          end: "bottom 50%",
          onToggle: (self) => {
            if (self.isActive) setActiveIndex(i);
          }
        });
        
        // Image Parallax Entrance
        window.gsap.fromTo(`.project-img-container-${i} .project-card`,
          { opacity: 0, y: 100, scale: 0.95 },
          { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            duration: 1.5, 
            ease: "power4.out",
            scrollTrigger: {
              trigger: `.project-img-container-${i}`,
              start: "top 85%",
            }
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isLoaded]);

  return (
    <div ref={containerRef} className="w-full text-white pt-24 md:pt-32 min-h-screen flex flex-col z-10 relative">
      <div className="flex flex-col lg:flex-row w-full relative items-start gap-12 lg:gap-24 pb-32">
        
        {/* Left Side: Scrollable Images */}
        <div className="w-full lg:w-7/12 flex flex-col">
          {PROJECTS_DATA.map((project, idx) => (
            <div
              key={`img-${project.id}`}
              className={`project-img-container-${idx} w-full min-h-[60vh] md:min-h-[80vh] lg:min-h-screen flex items-center justify-center py-12 lg:py-24`}
            >
              <div 
                className="w-full aspect-[4/3] lg:aspect-[16/10] overflow-hidden relative project-card view-project-cursor border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] group rounded-sm will-change-transform"
                onClick={() => onProjectClick(project.id)}
                data-speed="0.4"
              >
                <div className="absolute inset-0 bg-[#E8383D]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 mix-blend-overlay pointer-events-none"></div>
                <img 
                  src={project.img} 
                  alt={project.title} 
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Sticky Dynamic Text Wrapper */}
        <div className="w-full lg:w-5/12 lg:sticky lg:top-[25vh] h-auto lg:h-[50vh] flex flex-col justify-start pointer-events-none pt-12 lg:pt-0">
          
          <div className="border-b border-white/20 pb-6 mb-12 flex justify-between items-end overflow-hidden shrink-0 pointer-events-auto works-header-anim">
            <h2 className="text-3xl md:text-4xl font-light tracking-widest uppercase">Works</h2>
            <span className="font-extralight tracking-wider opacity-50 text-sm md:text-base">/jovanchandra</span>
          </div>

          {/* Animated Number Sequence Tape (Slot Machine Effect) */}
          <div className="mb-6 flex items-center font-light tracking-widest text-sm opacity-60 pointer-events-auto works-header-anim">
            <span>[ 0</span>
            <div className="overflow-hidden h-[20px] relative w-[12px]">
              <div className="absolute top-0 left-0 w-full flex flex-col transition-transform duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ transform: `translateY(-${activeIndex * 20}px)` }}>
                {PROJECTS_DATA.map((p, i) => (
                  <span key={i} className="h-[20px] flex items-center justify-center shrink-0 w-full">{i + 1}</span>
                ))}
              </div>
            </div>
            <span>&nbsp;/ 0{PROJECTS_DATA.length} ]</span>
          </div>

          {/* Absolute Stacked Text Containers */}
          <div className="relative flex-1 w-full min-h-[30vh] works-header-anim">
            {PROJECTS_DATA.map((project, idx) => (
              <div
                key={`desc-${project.id}`}
                className={`absolute inset-0 flex flex-col transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] 
                  ${activeIndex === idx 
                    ? 'opacity-100 translate-y-0 pointer-events-auto delay-100' 
                    : activeIndex > idx 
                      ? 'opacity-0 -translate-y-16 pointer-events-none' 
                      : 'opacity-0 translate-y-16 pointer-events-none'}`}
              >
                <h3 
                  className="text-4xl md:text-5xl lg:text-6xl font-thin tracking-wide mb-4 leading-tight font-['Zen_Old_Mincho',_serif] text-white hover:text-[#E8383D] transition-colors duration-500 view-project-cursor"
                  onClick={() => onProjectClick(project.id)}
                >
                  {project.title}
                </h3>
                <p className="text-[#E8383D] font-light tracking-wide text-sm md:text-base uppercase mb-6">
                  {project.category}
                </p>
                <p className="text-base md:text-lg font-extralight opacity-70 leading-relaxed max-w-lg">
                  {project.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

// --- Project Detail Template Component ---
const ProjectDetailView = ({ project, nextProject, onBack, onNext, isLoaded }) => {
  const containerRef = useRef(null);
  
  // Decide what images to map through based on if the project has a gallery
  const galleryImages = project.gallery && project.gallery.length > 0 ? project.gallery : [project.img];

  useLayoutEffect(() => {
    if (!isLoaded || !window.gsap) return;

    const ctx = window.gsap.context(() => {
      initFluidParallax(); 
      
      window.gsap.fromTo('.proj-detail-anim', 
        { y: 40, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: "power4.out", delay: 0.2 }
      );
      
      // Multi-image gallery entry animation (triggers independently as they scroll into view)
      window.gsap.utils.toArray('.proj-img-anim').forEach((img, i) => {
        window.gsap.fromTo(img,
          { scale: 0.95, opacity: 0, y: 100 },
          { 
            scale: 1, opacity: 1, y: 0, 
            duration: 1.5, 
            ease: "power4.out",
            scrollTrigger: {
              trigger: img,
              start: "top 85%",
            }
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isLoaded, project]);

  if (!project) return null;

  return (
    <div ref={containerRef} className="w-full text-white min-h-screen flex flex-col relative">
      
      {/* Sticky Detail Header Layer (Z-40: Stays fixed, Tools slide UNDER it) */}
      <div className="sticky top-0 z-[40] bg-[#111111]/95 backdrop-blur-xl pt-12 md:pt-16 pb-6 border-b border-white/20 -mx-8 px-8 md:-mx-16 md:px-16 lg:-mx-24 lg:px-24">
        <div className="flex flex-col gap-6 md:gap-8 max-w-6xl mx-auto w-full">
          <div className="proj-detail-anim">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-sm font-light tracking-widest uppercase opacity-60 hover:opacity-100 hover:text-[#E8383D] transition-all duration-300 w-max project-link"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              BACK
            </button>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 proj-detail-anim">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-thin tracking-wide font-['Zen_Old_Mincho',_serif] uppercase">
              {project.title}
            </h1>
            <div className="flex gap-6 font-light tracking-widest text-sm opacity-80 shrink-0">
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#E8383D] transition-colors duration-300 flex items-center gap-1 project-link">
                GitHub <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Foreground Image Gallery Layer (Z-50: Glides OVER the sticky header) */}
      <div className="relative z-[50] w-full flex flex-col items-center gap-16 md:gap-32 mt-12 mb-[20vh] md:mb-[30vh] lg:mb-[40vh] pointer-events-none">
        {galleryImages.map((src, idx) => (
          <div 
            key={idx} 
            className="proj-img-anim w-full max-w-4xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] rounded-sm border border-white/10 pointer-events-auto will-change-transform" 
            data-speed="0.4"
          >
            {/* Using h-auto so uncropped dashboard screenshots display perfectly */}
            <img src={src} alt={`${project.title} screenshot ${idx + 1}`} className="w-full h-auto object-cover" />
          </div>
        ))}
      </div>

      {/* Background Content Layer (Z-30: Scrolls normally and ends naturally) */}
      <div className="relative z-[30] w-full pt-8 md:pt-12 pb-32">
        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 w-full proj-detail-anim">
          
          {/* Left Column: Specs */}
          <div className="lg:col-span-5 flex flex-col gap-12">
            <div className="will-change-transform" data-speed="0.2">
              <h3 className="text-xl md:text-2xl font-light tracking-widest uppercase mb-6 text-white/90">TOOLS</h3>
              <div className="flex flex-wrap gap-3">
                {project.tools.map((tool) => (
                  <span key={tool} className="border border-white/20 rounded-full px-5 py-2 text-sm font-extralight text-white/80">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8 will-change-transform" data-speed="0.4">
              <div>
                <h3 className="text-xl md:text-2xl font-light tracking-widest uppercase mb-4 text-white/90">DURATION</h3>
                <p className="font-extralight opacity-70 text-base md:text-lg">{project.duration}</p>
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-light tracking-widest uppercase mb-4 text-white/90">ROLES</h3>
                <p className="font-extralight opacity-70 text-base md:text-lg">{project.roles}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Summary */}
          <div className="lg:col-span-7 will-change-transform" data-speed="0.6">
            <h3 className="text-xl md:text-2xl font-light tracking-widest uppercase mb-6 text-white/90">SUMMARY</h3>
            <p className="text-base md:text-lg lg:text-xl font-extralight opacity-70 leading-relaxed">
              {project.summary}
            </p>
          </div>
        </div>

        {/* Next Project Footer */}
        {nextProject && (
          <div className="flex justify-end mt-24 md:mt-32 proj-detail-anim will-change-transform" data-speed="0.8">
            <button 
              onClick={() => onNext(nextProject.id)}
              className="group flex items-center gap-4 text-2xl md:text-3xl lg:text-4xl font-thin tracking-widest uppercase hover:text-[#E8383D] transition-colors duration-500 project-link"
            >
              {nextProject.title}
              <svg className="w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-2 transition-transform duration-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

// --- Main Application ---
export default function App() {
  const mainRef = useRef(null);
  const loaderRef = useRef(null);
  const counterRef = useRef(null);
  const loaderLineRef = useRef(null);
  const transitionCurtainRef = useRef(null);
  const inkCurtainRef = useRef(null); 
  
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'works' | 'project'
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const lenisRef = useRef(null);

  useEffect(() => {
    const loadScripts = async () => {
      const loadScript = (src) => new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        document.head.appendChild(script);
      });

      await Promise.all([
        loadScript('https://cdn.jsdelivr.net/gh/studio-freight/lenis@1.0.19/bundled/lenis.min.js'),
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js')
      ]);
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js');

      lenisRef.current = new window.Lenis({
        duration: 1.8, 
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 0.7, 
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
      });

      lenisRef.current.stop();

      function raf(time) {
        if(lenisRef.current) lenisRef.current.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      window.gsap.registerPlugin(window.ScrollTrigger);
      setScriptsLoaded(true);
      
      lenisRef.current.on('scroll', (e) => {
        if (window.gsap) {
          window.gsap.set('.scroll-progress-indicator', { scaleY: e.progress || 0 });
        }
      });
    };
    loadScripts();

    return () => {
      if (lenisRef.current) lenisRef.current.destroy();
      if (window.ScrollTrigger) window.ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  useEffect(() => {
    if (!scriptsLoaded) return;

    const masterTl = window.gsap.timeline({
      onComplete: () => {
        if(loaderRef.current) loaderRef.current.style.display = 'none';
        if(lenisRef.current) lenisRef.current.start();
      }
    });

    masterTl.to(counterRef.current, { innerHTML: 100, duration: 2.5, snap: { innerHTML: 1 }, ease: "power2.inOut" })
    .to(loaderLineRef.current, { scaleY: 1, duration: 0.8, ease: "power4.inOut" }, "-=1.0")
    .to(loaderRef.current, { yPercent: 100, duration: 1.6, ease: "power4.inOut" });

  }, [scriptsLoaded]);

  const handleNavigation = (view, projectId = null) => {
    if ((view === currentView && projectId === selectedProjectId) || isNavigating || !window.gsap) return;
    setIsNavigating(true);

    const tl = window.gsap.timeline({
      onComplete: () => {
        setIsNavigating(false);
        setTimeout(() => {
          if (window.ScrollTrigger) window.ScrollTrigger.refresh();
        }, 100);
      }
    });

    tl.to(inkCurtainRef.current, { scaleY: 1, duration: 0.8, ease: "expo.inOut", transformOrigin: "top" })
      .call(() => {
        setCurrentView(view);
        setSelectedProjectId(projectId);
        lenisRef.current.scrollTo(0, { immediate: true });
      })
      .to(inkCurtainRef.current, { scaleY: 0, duration: 0.8, ease: "expo.inOut", transformOrigin: "bottom" }, "+=0.1");
  };

  // Helper variables for Project Detail View
  const selectedProject = selectedProjectId ? PROJECTS_DATA.find(p => p.id === selectedProjectId) : null;
  const selectedProjectIndex = selectedProjectId ? PROJECTS_DATA.findIndex(p => p.id === selectedProjectId) : -1;
  const nextProject = selectedProjectIndex >= 0 && selectedProjectIndex < PROJECTS_DATA.length - 1 ? PROJECTS_DATA[selectedProjectIndex + 1] : null;

  return (
    <div ref={mainRef} className="min-h-screen w-full relative overflow-x-clip cursor-none selection:bg-[#E8383D] selection:text-white bg-[#111111] text-[#e0e0e0] font-['Montserrat',_sans-serif]">
      <CustomCursor />
      <TraceTrailBackground />
      <ComingSoonOverlay isOpen={isGalleryOpen} onClose={() => setIsGalleryOpen(false)} />

      {/* --- Fullscreen Page Transition Curtain --- */}
      <div ref={inkCurtainRef} className="fixed inset-0 bg-[#070707] z-[75] scale-y-0 origin-top pointer-events-none"></div>

      {/* --- Global Scroll Progress Indicator --- */}
      <div className={`fixed right-6 md:right-10 top-1/4 h-1/2 w-[1px] bg-white/10 z-[60] mix-blend-difference hidden md:block transition-opacity duration-500 ${currentView === 'project' ? 'opacity-0' : 'opacity-100'}`}>
        <div className="scroll-progress-indicator w-full bg-[#E8383D] origin-top scale-y-0 h-full shadow-[0_0_10px_rgba(232,56,61,0.8)]"></div>
      </div>

      {/* --- Japanese Cinematic Loader Overlay --- */}
      <div ref={loaderRef} className="fixed inset-0 z-[100] bg-[#0a0a0a] flex items-center justify-center overflow-hidden pointer-events-auto">
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <div className="w-[40vw] h-[40vw] border border-[#E8383D] rounded-full animate-ping" style={{animationDuration: '4s'}}></div>
        </div>
        <div className="relative z-10 flex gap-8 md:gap-12 items-center">
          <div className="text-[#E8383D] text-6xl md:text-8xl font-thin tracking-tighter w-24 md:w-32 text-right">
            <span ref={counterRef}>0</span><span className="text-white/50 text-4xl md:text-6xl">%</span>
          </div>
          <div ref={loaderLineRef} className="w-[1px] h-32 md:h-48 bg-[#E8383D] scale-y-0 origin-top"></div>
          <div className="flex gap-4 font-['Zen_Old_Mincho',_serif] text-lg md:text-2xl tracking-[0.5em] text-white opacity-80" style={{ writingMode: 'vertical-rl' }}>
            <span>創造の領域へ</span>
            <span className="text-[#E8383D] tracking-[0.3em] opacity-80">ケント・カワゾエ</span>
          </div>
        </div>
      </div>

      {/* --- Sidebar Navigation (Visible on Home) --- */}
      <nav 
        className={`fixed left-0 top-0 h-full w-24 md:w-48 flex flex-col justify-between p-8 md:p-12 z-[60] bg-[#111111]/10 text-white transition-all duration-[1000ms] progressive-blur-left
        ${currentView === 'home' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="flex flex-col gap-6 text-sm tracking-widest uppercase">
          <button onClick={() => handleNavigation('home')} className="relative group w-max text-left project-link">
            <span className={`transition-opacity font-light ${currentView === 'home' ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'}`}>Home</span>
            <span className={`absolute -bottom-2 left-0 h-[1px] transform origin-left transition-all duration-500 ${currentView === 'home' ? 'w-full bg-[#E8383D]' : 'w-0 group-hover:w-full bg-white'}`}></span>
          </button>
          <button onClick={() => handleNavigation('works')} className="relative group w-max text-left project-link">
            <span className={`transition-opacity font-light ${currentView === 'works' ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'}`}>Works</span>
            <span className={`absolute -bottom-2 left-0 h-[1px] transform origin-left transition-all duration-500 ${currentView === 'works' ? 'w-full bg-[#E8383D]' : 'w-0 group-hover:w-full bg-white'}`}></span>
          </button>
          <button onClick={() => setIsGalleryOpen(true)} className="relative group w-max text-left opacity-50 hover:opacity-100 transition-opacity duration-500 project-link">
            <span className="font-light">Gallery</span>
            <span className="absolute -bottom-2 left-0 w-0 group-hover:w-full h-[1px] bg-white transition-all duration-500"></span>
          </button>
        </div>

        <div className="flex flex-col gap-8 items-start">
          <a href="https://www.linkedin.com/in/jovan-richaldy/" target="_blank" rel="noopener noreferrer" className="relative p-2 -m-2 opacity-50 hover:opacity-100 hover:scale-125 hover:text-[#E8383D] hover:drop-shadow-[0_0_10px_rgba(232,56,61,0.8)] transition-all duration-500 project-link"><LinkedinIcon size={20} strokeWidth={1.5} /></a>
          <a href="https://www.instagram.com/jovanrichaldy/?hl=en" target="_blank" rel="noopener noreferrer" className="relative p-2 -m-2 opacity-50 hover:opacity-100 hover:scale-125 hover:text-[#E8383D] hover:drop-shadow-[0_0_10px_rgba(232,56,61,0.8)] transition-all duration-500 project-link"><InstagramIcon size={20} strokeWidth={1.5} /></a>
          <a href="https://github.com/urboiflex" target="_blank" rel="noopener noreferrer" className="relative p-2 -m-2 opacity-50 hover:opacity-100 hover:scale-125 hover:text-[#E8383D] hover:drop-shadow-[0_0_10px_rgba(232,56,61,0.8)] transition-all duration-500 project-link"><GithubIcon size={20} strokeWidth={1.5} /></a>
          <a href="mailto:jovan.rc1212@gmail.com" className="relative p-2 -m-2 opacity-50 hover:opacity-100 hover:scale-125 hover:text-[#E8383D] hover:drop-shadow-[0_0_10px_rgba(232,56,61,0.8)] transition-all duration-500 project-link"><MailIcon size={20} strokeWidth={1.5} /></a>
        </div>

        <div className="text-xs opacity-40 whitespace-nowrap tracking-widest uppercase mt-4 font-light">
          &copy; Jovan Chandra
        </div>
      </nav>

      {/* --- Top Header Navigation (Visible on Works ONLY - hides on Project Detail) --- */}
      <nav 
        className={`fixed left-0 top-0 w-full h-20 md:h-24 flex justify-between items-center px-8 md:px-16 lg:px-24 z-[60] bg-[#111111]/10 text-white transition-all duration-[1000ms] progressive-blur-top
        ${currentView === 'works' ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-16'}`}
      >
        <div className="flex gap-8 md:gap-12 text-sm tracking-widest uppercase">
          <button onClick={() => handleNavigation('home')} className="relative group w-max text-left project-link">
            <span className={`transition-opacity font-light ${currentView === 'home' ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'}`}>Home</span>
            <span className={`absolute -bottom-2 left-0 h-[1px] transform origin-left transition-all duration-500 ${currentView === 'home' ? 'w-full bg-[#E8383D]' : 'w-0 group-hover:w-full bg-white'}`}></span>
          </button>
          <button onClick={() => handleNavigation('works')} className="relative group w-max text-left project-link">
            <span className={`transition-opacity font-light ${currentView === 'works' ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'}`}>Works</span>
            <span className={`absolute -bottom-2 left-0 h-[1px] transform origin-left transition-all duration-500 ${currentView === 'works' ? 'w-full bg-[#E8383D]' : 'w-0 group-hover:w-full bg-white'}`}></span>
          </button>
          <button onClick={() => setIsGalleryOpen(true)} className="relative group w-max text-left opacity-50 hover:opacity-100 transition-opacity duration-500 project-link">
            <span className="font-light">Gallery</span>
            <span className="absolute -bottom-2 left-0 w-0 group-hover:w-full h-[1px] bg-white transition-all duration-500"></span>
          </button>
        </div>

        <div className="flex gap-6 items-center">
          <a href="https://www.linkedin.com/in/jovan-richaldy/" target="_blank" rel="noopener noreferrer" className="relative p-2 -m-2 opacity-50 hover:opacity-100 hover:-translate-y-1 hover:text-[#E8383D] hover:drop-shadow-[0_0_10px_rgba(232,56,61,0.8)] transition-all duration-500 project-link"><LinkedinIcon size={20} strokeWidth={1.5} /></a>
          <a href="https://www.instagram.com/jovanrichaldy/?hl=en" target="_blank" rel="noopener noreferrer" className="relative p-2 -m-2 opacity-50 hover:opacity-100 hover:-translate-y-1 hover:text-[#E8383D] hover:drop-shadow-[0_0_10px_rgba(232,56,61,0.8)] transition-all duration-500 project-link"><InstagramIcon size={20} strokeWidth={1.5} /></a>
          <a href="https://github.com/urboiflex" target="_blank" rel="noopener noreferrer" className="relative p-2 -m-2 opacity-50 hover:opacity-100 hover:-translate-y-1 hover:text-[#E8383D] hover:drop-shadow-[0_0_10px_rgba(232,56,61,0.8)] transition-all duration-500 project-link"><GithubIcon size={20} strokeWidth={1.5} /></a>
          <a href="mailto:jovan.rc1212@gmail.com" className="relative p-2 -m-2 opacity-50 hover:opacity-100 hover:-translate-y-1 hover:text-[#E8383D] hover:drop-shadow-[0_0_10px_rgba(232,56,61,0.8)] transition-all duration-500 project-link"><MailIcon size={20} strokeWidth={1.5} /></a>
        </div>
      </nav>

      {/* --- Main Content Container --- */}
      <main className={`relative z-50 transition-all duration-0 px-8 md:px-16 lg:px-24
        ${currentView === 'home' ? 'ml-24 md:ml-48 pt-0 pb-32' : 'ml-0 pt-0'}
        ${currentView === 'works' ? 'pb-32' : ''}
        ${currentView === 'project' ? 'pb-0' : ''}
      `}>
        <div ref={transitionCurtainRef} className="w-full max-w-6xl mx-auto">
          {currentView === 'home' && <HomeView isLoaded={scriptsLoaded} />}
          {currentView === 'works' && <WorksView isLoaded={scriptsLoaded} onProjectClick={(id) => handleNavigation('project', id)} />}
          {currentView === 'project' && selectedProject && (
            <ProjectDetailView 
              isLoaded={scriptsLoaded}
              project={selectedProject}
              nextProject={nextProject}
              onBack={() => handleNavigation('works')}
              onNext={(id) => handleNavigation('project', id)}
            />
          )}
        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500&family=Zen+Old+Mincho:wght@400;500;700&display=swap');
        
        * {
          cursor: none !important;
        }

        .progressive-blur-left {
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          -webkit-mask-image: linear-gradient(to right, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%);
          mask-image: linear-gradient(to right, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%);
        }
        
        .progressive-blur-top {
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%);
          mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%);
        }
        
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 10px;}
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(232,56,61,0.5); border-radius: 10px; }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes customFadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-custom-fade {
          animation: customFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        ::-webkit-scrollbar { width: 0px; background: transparent; }
        html.lenis { height: auto; }
        .lenis.lenis-smooth { scroll-behavior: auto; }
        .lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }
        .lenis.lenis-stopped { overflow: hidden; }
      `}} />
    </div>
  );
}