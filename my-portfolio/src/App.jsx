import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';

import EditorialHero from './EditorialHero.jsx';
import ProfileStorySection from './ProfileStorySection.jsx';
import FeaturedProjectsSection from './FeaturedProjectsSection.jsx';
import ProjectShowcaseModal from './ProjectShowcaseModal.jsx';
import SkillsAccordion from './SkillsAccordion.jsx';
import SignatureMarqueeSection from './SignatureMarqueeSection.jsx';
import CinematicContactSection from './CinematicContactSection.jsx';
import ScrollProgressRail from './ScrollProgressRail.jsx';
import SplitHoverText from './SplitHoverText.jsx';
import InfoView from './InfoView.jsx';
import ContactView from './ContactView.jsx';
import WorksArchiveView from './WorksArchiveView.jsx';
import ProjectCaseStudyView from './ProjectCaseStudyView.jsx';
import {
  createAnimationFrameLoop,
  getSmoothScrollOptions,
  loadScriptOnce,
  resumeSmoothScroll,
} from './smoothScroll.js';
import {
  createInfoTransitionPlan,
  getDetailArrivalReleaseTime,
  getDetailNavigationMode,
  getFlyingLabelHandoffTiming,
  getInfoTransitionSwapDelayMs,
  getPortfolioViewFromPath,
} from './infoTransition.js';
import { getProjectIdFromPath, getProjectPath } from './worksArchive.js';
import { restoreCaseStudyScroll } from './caseStudyMotion.js';

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
import featuredBgVouch from './assets/featured-bg-vouch.jpg';
import featuredBgKicks from './assets/featured-bg-kicks.jpg';
import KNCShop from './assets/KNCShop.png';
import KNCShop2 from './assets/KNCShop2.png';
import KNCShop3 from './assets/KNCShop3.png';
import KNCShop4 from './assets/KNCShop4.png';
import KNCShop5 from './assets/KNCShop5.png';

// --- Global Project Data ---
const PROJECTS_DATA = [
  {
    id: "01",
    title: "Vouch AI-Assistant Dashboard",
    category: "Hackathon Project / Full Stack",
    desc: "User Friendly dashboard that displays revenue streams for Grab Merchants. Also it has personal AI Assistant where it helps to generate analytics.",
    img: vouch,
    bgImg: featuredBgVouch,
    gallery: [vouch, vouch1, vouch2, vouch3, vouch4],
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
    bgImg: featuredBgKicks,
    gallery: [KNCLogin, KNCHome, KNCHome2, KNCHome3, KNCShop, KNCShop2, KNCShop3, KNCShop4, KNCShop5, KNCPayment],
    tools: ["HTML", "CSS", "Tailwind", "Javascript", "GSAP", "ASP.NET", "C#", "MySQL", "XML"],
    duration: "3 weeks",
    roles: "Developer",
    summary: "Kicks & Co. is a fully functional e-commerce platform designed to emulate a real-life virtual sneaker store. Targeted at young adults and sneaker enthusiasts, the platform delivers an elegant, high-end shopping experience featuring sophisticated front-end animations, smooth scrolling, and parallax effects. The project successfully bridges the gap between customer-facing usability and advanced, dynamic data management.",
    githubUrl: "https://github.com/urboiflex/Kicks-Co-E-Commerce-Website"
  }
];

const GALLERY_CATEGORIES = ['All', 'UI / UX', 'Web Design'];

// Gallery data — add your Vercel-hosted image URLs here when ready
// Format: { id, title, category ('UI / UX' | 'Web Design'), url: 'https://...', wide: true/false }
const GALLERY_DATA = [];

const AWARDS_DATA = [
  { id: 1, year: "2025", title: "APU Alphaton 3rd Place", issuer: "WorldQuant", img: alphatonCert },
  { id: 2, year: "2025", title: "APU Mega Career Fair Staff", issuer: "Asia Pacific University", img: apuCareerCert },
  { id: 3, year: "2024", title: "Sparkathon Finalist", issuer: "APU x BAT", img: sparkathonCert },
  { id: 4, year: "2025", title: "Gold Level Quant", issuer: "WorldQuant", img: goldlevel },
  { id: 5, year: "2025", title: "SQl Intermediate Test", issuer: "Hackerrank", img: SQLInter }
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
  // Apply only if the element does not exist in horizontal mobile containers
  window.gsap.utils.toArray('[data-speed]:not(.mobile-no-parallax)').forEach(el => {
    const speed = parseFloat(el.getAttribute('data-speed'));
    window.gsap.to(el, {
      y: -120 * speed, 
      ease: "none",
      scrollTrigger: {
        trigger: el.parentElement,
        start: "top bottom",
        end: "bottom top",
        scrub: 2 
      }
    });
  });
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
      // Reduce particle count on smaller screens for performance
      const pCount = window.innerWidth < 768 ? 20 : 60;
      for(let i = 0; i < pCount; i++) {
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
        const color = isHovering ? '11, 11, 11' : '94, 94, 90';
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
          this.color = '11, 11, 11';
        } else {
          this.baseVx = Math.random() * 0.5 + 0.1; 
          this.baseVy = Math.random() * 0.8 + 0.2; 
          this.size = Math.random() * 2.5 + 1.5;
          this.baseAlpha = Math.random() * 0.2 + 0.05;
          this.spin = (Math.random() - 0.5) * 0.03;
          this.color = Math.random() > 0.5 ? '11, 11, 11' : '94, 94, 90';
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
        this.color = Math.random() > 0.4 ? '94, 94, 90' : '11, 11, 11';
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

export const getNavigationVisibility = ({ currentY, previousY, visible }) => {
  if (currentY <= 48) return true;

  const delta = currentY - previousY;
  if (Math.abs(delta) < 6) return visible;
  return delta < 0;
};

export const getNavigationMotion = (isActive, reducedMotion, isNavigating = false) => ({
  autoAlpha: isActive ? 1 : 0,
  y: isActive ? 0 : -56,
  duration: reducedMotion ? 0 : (isNavigating ? 0.24 : (isActive ? 0.7 : 0.5)),
  ease: reducedMotion ? 'none' : (isNavigating ? 'power2.out' : (isActive ? 'power4.out' : 'power3.in')),
  overwrite: 'auto',
});

export const getFloatingNavigationActive = ({ currentView, isVisible, isNavigating }) =>
  currentView === 'home' && isVisible && !isNavigating;

const FloatingHomeNav = ({ currentView, onSection, isLoaded, isNavigating }) => {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);
  const frameRef = useRef(null);
  const motionRef = useRef(null);

  useEffect(() => {
    if (currentView !== 'home') return undefined;

    lastScrollYRef.current = window.scrollY;
    setIsVisible(true);

    const handleScroll = () => {
      if (frameRef.current !== null) return;

      frameRef.current = window.requestAnimationFrame(() => {
        const currentY = window.scrollY;
        setIsVisible((visible) => getNavigationVisibility({
          currentY,
          previousY: lastScrollYRef.current,
          visible,
        }));
        lastScrollYRef.current = currentY;
        frameRef.current = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    };
  }, [currentView]);

  const navItems = [
    { label: 'work', target: 'works' },
    { label: 'info', target: 'info' },
    { label: 'contact', target: 'contact' },
  ];

  const isActive = getFloatingNavigationActive({ currentView, isVisible, isNavigating });

  useLayoutEffect(() => {
    if (!isLoaded || !window.gsap || !motionRef.current) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tween = window.gsap.to(
      motionRef.current,
      getNavigationMotion(isActive, reducedMotion, isNavigating),
    );

    return () => tween.kill();
  }, [isActive, isLoaded, isNavigating]);

  return (
    <nav
      className={`floating-home-nav fixed left-1/2 top-6 z-[70] w-[min(78vw,27rem)] -translate-x-1/2 bg-transparent text-white mix-blend-difference md:top-8
        ${isActive ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-label="Portfolio navigation"
      aria-hidden={!isActive}
    >
      <div ref={motionRef} className="flex w-full items-center justify-between will-change-transform" data-nav-motion="true">
        {navItems.map((item) => (
          <a
            key={item.target}
            href={`/${item.target}/`}
            data-nav-target={item.target}
            onClick={(event) => {
              if (!window.gsap) return;
              event.preventDefault();
              onSection(item.target, event.currentTarget);
            }}
            tabIndex={isActive ? 0 : -1}
            className="group project-link bg-transparent p-0 text-[11px] font-medium leading-[14px] tracking-[0.04em] text-current focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-current md:text-[12px] md:leading-[15px]"
          >
            <SplitHoverText text={item.label} height="15px" distance="14px" />
          </a>
        ))}
      </div>
    </nav>
  );
};

// --- Gallery View ---
const EMPTY_CELLS = [
  { cat: 'UI / UX',    wide: true  },
  { cat: 'Web Design', wide: false },
  { cat: 'UI / UX',    wide: false },
  { cat: 'Web Design', wide: false },
  { cat: 'UI / UX',    wide: false },
  { cat: 'Web Design', wide: true  },
];

const GalleryView = ({ isLoaded }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightbox, setLightbox] = useState(null);
  const containerRef = useRef(null);
  const lightboxRef = useRef(null);
  const lineRef = useRef(null);

  const filtered = activeCategory === 'All'
    ? GALLERY_DATA
    : GALLERY_DATA.filter(item => item.category === activeCategory);

  const isEmpty = filtered.length === 0;

  useLayoutEffect(() => {
    if (!isLoaded || !window.gsap) return;
    const ctx = window.gsap.context(() => {
      window.gsap.fromTo('.gal-header',
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.4, stagger: 0.08, ease: 'power4.out', delay: 0.1 }
      );
      if (isEmpty) {
        window.gsap.fromTo('.gal-empty-cell',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.08, ease: 'power3.out', delay: 0.5 }
        );
        if (lineRef.current) {
          window.gsap.fromTo(lineRef.current,
            { scaleX: 0 },
            { scaleX: 1, duration: 1.6, ease: 'expo.inOut', delay: 0.3 }
          );
        }
      } else {
        window.gsap.fromTo('.gal-item',
          { opacity: 0, y: 30, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 0.9, stagger: 0.07, ease: 'power3.out', delay: 0.5 }
        );
      }
    }, containerRef);
    return () => ctx.revert();
  }, [isLoaded, activeCategory, isEmpty]);

  const openLightbox = (item) => {
    setLightbox(item);
    if (window.gsap && lightboxRef.current) {
      window.gsap.fromTo(lightboxRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power2.out' }
      );
    }
  };

  const closeLightbox = () => {
    if (window.gsap && lightboxRef.current) {
      window.gsap.to(lightboxRef.current, {
        opacity: 0, duration: 0.3, ease: 'power2.in',
        onComplete: () => setLightbox(null)
      });
    } else {
      setLightbox(null);
    }
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox]);

  return (
    <div ref={containerRef} className="w-full text-[#0b0b0b] pt-20 md:pt-32 min-h-screen flex flex-col z-10 relative">

      {/* Header */}
      <div className="mb-10 md:mb-16">
        <p className="gal-header text-[#5e5e5a] text-[10px] tracking-[0.5em] uppercase font-light mb-5">The Collection</p>
        <div className="overflow-hidden mb-6">
          <h1 className="gal-header text-[16vw] sm:text-[10vw] md:text-[8vw] font-thin tracking-[-0.04em] uppercase leading-none">
            Gallery
          </h1>
        </div>
        <div ref={lineRef} className="w-full h-px bg-black/15 origin-left" />
      </div>

      {isEmpty ? (
        /* ── Premium empty state ── */
        <div className="flex-1 flex flex-col">
          <div className="gallery-grid pb-12">
            {EMPTY_CELLS.map((cell, i) => (
              <div
                key={i}
                className={`gal-empty-cell gallery-cell relative overflow-hidden ${cell.wide ? 'gallery-cell--wide' : ''}`}
                style={{ '--delay': `${i * 0.12}s` }}
              >
                {/* Animated scan line */}
                <div className="gal-scan-line" />
                {/* Corner label */}
                <span className="absolute top-4 left-4 text-[9px] tracking-[0.3em] uppercase text-[#767672] font-light select-none">
                  {cell.cat}
                </span>
                {/* Number */}
                <span className="absolute bottom-4 right-5 text-[11px] tracking-widest text-[#767672] font-light select-none tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
            ))}
          </div>

          {/* Placeholder message */}
          <div className="flex items-center gap-6 mt-4 mb-28 opacity-0 animate-[fadeInUp_0.8s_1.2s_ease-out_forwards]">
            <div className="w-10 h-px bg-black/15" />
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#767672] font-light">
              Curated works — uploading soon
            </p>
            <div className="w-10 h-px bg-black/15" />
          </div>
        </div>
      ) : (
        /* ── Populated grid ── */
        <div className="gallery-grid pb-28">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`gal-item gallery-cell group relative overflow-hidden border border-black/10 cursor-pointer ${item.wide ? 'gallery-cell--wide' : ''}`}
              onClick={() => openLightbox(item)}
            >
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover grayscale opacity-75 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-[1.04] transition-all duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4 md:p-5">
                <p className="text-white/60 text-[9px] tracking-widest uppercase font-light mb-1">{item.category}</p>
                <h3 className="text-xs md:text-sm font-light tracking-wide text-white leading-snug">{item.title}</h3>
              </div>
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-50 transition-opacity duration-300">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          ref={lightboxRef}
          className="fixed inset-0 z-[200] bg-white/97 text-[#0b0b0b] backdrop-blur-xl flex items-center justify-center p-4 md:p-16"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-6 right-7 flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-[#767672] hover:text-[#0b0b0b] transition-colors duration-300 project-link z-10"
            onClick={closeLightbox}
          >
            Close
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <img
            src={lightbox.url}
            alt={lightbox.title}
            className="max-w-full max-h-[84vh] object-contain shadow-[0_0_100px_rgba(0,0,0,0.9)] rounded-sm"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-6 left-0 right-0 text-center">
            <p className="text-[#5e5e5a] text-[9px] tracking-[0.4em] uppercase font-light mb-1">{lightbox.category}</p>
            <h3 className="text-xs font-light text-[#5e5e5a] tracking-wide">{lightbox.title}</h3>
          </div>
        </div>
      )}
    </div>
  );
};

// --- 3D Scroll-Reactive Orrery ---
const ScrollOrrery = ({ isLoaded, triggerRef }) => {
  const ring1Ref = useRef(null);
  const ring2Ref = useRef(null);
  const ring3Ref = useRef(null);
  const dotRef2 = useRef(null);

  useLayoutEffect(() => {
    if (!isLoaded || !window.gsap || !window.ScrollTrigger) return;
    const st = { trigger: triggerRef.current, start: 'top bottom', end: 'bottom top', scrub: 2 };
    const ctx = window.gsap.context(() => {
      window.gsap.to(ring1Ref.current, { rotationZ: 360, ease: 'none', scrollTrigger: st });
      window.gsap.to(ring2Ref.current, { rotationY: 360, ease: 'none', scrollTrigger: { ...st, scrub: 2.8 } });
      window.gsap.to(ring3Ref.current, { rotationX: -360, ease: 'none', scrollTrigger: { ...st, scrub: 3.6 } });
    });
    return () => ctx.revert();
  }, [isLoaded, triggerRef]);

  const baseRing = {
    position: 'absolute',
    borderRadius: '50%',
    top: '50%',
    left: '50%',
    transformStyle: 'preserve-3d',
  };

  return (
    <div style={{ perspective: '700px', width: 260, height: 260, position: 'relative', margin: '0 auto' }}>
      <div style={{ transformStyle: 'preserve-3d', width: 260, height: 260, position: 'relative', transform: 'rotateX(18deg) rotateY(22deg)' }}>
        <div ref={ring1Ref} style={{ ...baseRing, width: 240, height: 240, marginTop: -120, marginLeft: -120, border: '1px solid rgba(11,11,11,0.32)', transform: 'rotateX(65deg)', transformStyle: 'preserve-3d' }} />
        <div ref={ring2Ref} style={{ ...baseRing, width: 170, height: 170, marginTop: -85, marginLeft: -85, border: '1px solid rgba(11,11,11,0.12)', transform: 'rotateY(38deg)', transformStyle: 'preserve-3d' }} />
        <div ref={ring3Ref} style={{ ...baseRing, width: 290, height: 290, marginTop: -145, marginLeft: -145, border: '1px solid rgba(11,11,11,0.05)', transform: 'rotateX(28deg) rotateZ(42deg)', transformStyle: 'preserve-3d' }} />
        <div ref={dotRef2} style={{ position: 'absolute', width: 5, height: 5, background: '#0b0b0b', borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', boxShadow: '0 0 14px rgba(11,11,11,0.5)' }} />
      </div>
    </div>
  );
};

// --- Page Components ---

const HomeView = ({ isLoaded, onProjectClick }) => {
  const skillsRef = useRef(null);

  return (
    <>
      <EditorialHero isLoaded={isLoaded} />
      <ProfileStorySection isLoaded={isLoaded} />

      <FeaturedProjectsSection
        isLoaded={isLoaded}
        projects={PROJECTS_DATA}
        onProjectClick={onProjectClick}
      />

      <SkillsAccordion sectionRef={skillsRef} isLoaded={isLoaded} />

      <SignatureMarqueeSection isLoaded={isLoaded} />

      <CinematicContactSection isLoaded={isLoaded} />
    </>
  );
};

// --- Interactive Works Gallery Component ---
const WorksView = ({ isLoaded, onProjectClick }) => {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useLayoutEffect(() => {
    if (!isLoaded || !window.gsap || !window.ScrollTrigger) return;

    let mm = window.gsap.matchMedia();

    const ctx = window.gsap.context(() => {
      // General Header entry
      window.gsap.fromTo('.works-header-anim', 
        { y: 40, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.1, ease: "power4.out", delay: 0.1 }
      );

      // Desktop Only - Vertical Parallax Scroll
      mm.add("(min-width: 1024px)", () => {
        initFluidParallax(); 

        PROJECTS_DATA.forEach((_, i) => {
          window.ScrollTrigger.create({
            trigger: `.desktop-img-container-${i}`,
            start: "top 50%", 
            end: "bottom 50%",
            onToggle: (self) => {
              if (self.isActive) setActiveIndex(i);
            }
          });
          
          window.gsap.fromTo(`.desktop-img-container-${i} .project-card`,
            { opacity: 0, y: 100, scale: 0.95 },
            { 
              opacity: 1, y: 0, scale: 1, duration: 1.5, ease: "power4.out",
              scrollTrigger: { trigger: `.desktop-img-container-${i}`, start: "top 85%" }
            }
          );
        });
      });

      // Mobile Only - Horizontal Swipe Fade
      mm.add("(max-width: 1023px)", () => {
        window.gsap.fromTo(".mobile-project-card",
          { opacity: 0, x: 30 },
          { 
            opacity: 1, x: 0, duration: 1, stagger: 0.15, ease: "power3.out",
            scrollTrigger: { trigger: ".mobile-slider-container", start: "top 90%" }
          }
        );
      });

    }, containerRef);

    return () => {
      ctx.revert();
      mm.revert();
    }
  }, [isLoaded]);

  return (
    <div ref={containerRef} className="w-full text-[#0b0b0b] pt-20 md:pt-32 min-h-screen flex flex-col z-10 relative">
      <div className="flex flex-col lg:flex-row w-full relative items-start gap-8 lg:gap-24 pb-20 md:pb-32">
        
        {/* Left Side Container (Handles Both Desktop Images & Mobile Slider) */}
        <div className="w-full lg:w-7/12 flex flex-col">
          
          {/* Mobile Header (Hidden on PC) */}
          <div className="flex lg:hidden justify-between items-end mb-4 border-b border-black/20 pb-4 works-header-anim">
            <h2 className="text-2xl font-light tracking-widest uppercase">Works</h2>
            <span className="font-extralight tracking-wider opacity-50 text-[10px] flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              SWIPE
            </span>
          </div>

          {/* Mobile Horizontal Snap Slider (Hidden on PC) - Added data-lenis-prevent and touch-pan-x */}
          <div 
            className="flex lg:hidden w-full overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-6 pb-6 -mx-6 px-6 relative mobile-slider-container touch-pan-x"
            data-lenis-prevent="true"
          >
            {PROJECTS_DATA.map((project, idx) => (
              <div key={`mobile-${project.id}`} className="min-w-[85vw] sm:min-w-[60vw] snap-center flex flex-col gap-4 mobile-project-card">
                  <div
                      className="w-full aspect-[4/3] rounded-md overflow-hidden relative project-card border border-black/10 shadow-[0_10px_20px_rgba(0,0,0,0.5)] group mobile-no-parallax cursor-pointer"
                      onClick={() => onProjectClick(project.id)}
                  >
                      <div className="absolute inset-0 bg-black/10 opacity-0 active:opacity-100 transition-opacity duration-300 z-10 mix-blend-overlay pointer-events-none"></div>
                      <img src={project.img} alt={project.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col px-1">
                      <h3 className="text-xl font-thin mb-1 text-[#0b0b0b] active:text-[#5e5e5a] transition-colors line-clamp-1 cursor-pointer" onClick={() => onProjectClick(project.id)}>
                          {project.title}
                      </h3>
                      <p className="text-[#5e5e5a] text-[10px] uppercase mb-2 font-light tracking-widest">{project.category}</p>
                      <p className="text-xs font-extralight opacity-70 leading-relaxed line-clamp-3">{project.desc}</p>
                  </div>
              </div>
            ))}
          </div>

          {/* Desktop Vertical Stacking Images (Hidden on Mobile) */}
          <div className="hidden lg:flex flex-col w-full">
            {PROJECTS_DATA.map((project, idx) => (
              <div
                key={`img-${project.id}`}
                className={`desktop-img-container-${idx} w-full min-h-screen flex items-center justify-center py-24`}
              >
                <div 
                  className="w-full aspect-[16/10] overflow-hidden relative project-card view-project-cursor border border-black/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] group rounded-sm will-change-transform"
                  onClick={() => onProjectClick(project.id)}
                  data-speed="0.4"
                >
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 mix-blend-overlay pointer-events-none"></div>
                  <img 
                    src={project.img} 
                    alt={project.title} 
                    className="w-full h-full object-cover grayscale opacity-80 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Desktop Sticky Text Wrapper (Hidden on Mobile) */}
        <div className="hidden lg:flex w-5/12 sticky top-24 h-[calc(100vh-6rem)] flex-col justify-start pointer-events-none pt-0">

          <div className="border-b border-black/20 pb-4 mb-8 flex justify-between items-end overflow-hidden shrink-0 pointer-events-auto works-header-anim">
            <h2 className="text-3xl md:text-4xl font-light tracking-widest uppercase">Works</h2>
            <span className="font-extralight tracking-wider opacity-50 text-sm md:text-base">/jovanchandra</span>
          </div>

          <div className="mb-4 flex items-center font-light tracking-widest text-sm opacity-60 pointer-events-auto works-header-anim shrink-0">
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

          <div className="relative flex-1 w-full min-h-0 works-header-anim overflow-hidden">
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
                  className="text-3xl md:text-4xl lg:text-5xl font-thin tracking-[-0.025em] mb-3 leading-tight text-[#0b0b0b] hover:text-[#5e5e5a] transition-colors duration-500 view-project-cursor cursor-pointer shrink-0"
                  onClick={() => onProjectClick(project.id)}
                >
                  {project.title}
                </h3>
                <p className="text-[#5e5e5a] font-light tracking-wide text-sm uppercase mb-4 shrink-0">
                  {project.category}
                </p>
                <p className="text-sm md:text-base font-extralight opacity-70 leading-relaxed max-w-lg mb-8 shrink-0">
                  {project.desc}
                </p>
                <button
                  onClick={() => onProjectClick(project.id)}
                  className="group flex items-center gap-4 text-[10px] tracking-[0.3em] uppercase font-light text-[#5e5e5a] hover:text-[#0b0b0b] transition-all duration-500 pointer-events-auto view-project-cursor shrink-0 w-max"
                >
                  <span className="w-6 h-px bg-[#0b0b0b]/30 group-hover:w-14 group-hover:bg-black transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"></span>
                  View Project
                </button>
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
  const galleryImages = project.gallery && project.gallery.length > 0 ? project.gallery : [project.img];

  useLayoutEffect(() => {
    if (!isLoaded || !window.gsap) return;

    const ctx = window.gsap.context(() => {
      initFluidParallax(); 
      
      window.gsap.fromTo('.proj-detail-anim', 
        { y: 40, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: "power4.out", delay: 0.2 }
      );
      
      window.gsap.utils.toArray('.proj-img-anim').forEach((img, i) => {
        window.gsap.fromTo(img,
          { scale: 0.95, opacity: 0, y: 50 },
          { 
            scale: 1, opacity: 1, y: 0, 
            duration: 1.2, 
            ease: "power3.out",
            scrollTrigger: {
              trigger: img,
              start: "top 90%",
            }
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isLoaded, project]);

  if (!project) return null;

  return (
    <div ref={containerRef} className="w-full text-[#0b0b0b] min-h-screen flex flex-col relative">
      
      <div className="sticky top-0 z-[40] bg-white/95 backdrop-blur-xl pt-6 md:pt-16 pb-4 md:pb-6 border-b border-black/20 -mx-6 px-6 md:-mx-16 md:px-16 lg:-mx-24 lg:px-24">
        <div className="flex flex-col gap-4 md:gap-8 max-w-6xl mx-auto w-full">
          <div className="proj-detail-anim">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-xs md:text-sm font-light tracking-widest uppercase opacity-60 hover:opacity-100 hover:text-[#0b0b0b] transition-all duration-300 w-max project-link"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              BACK
            </button>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 md:gap-6 proj-detail-anim">
            <h1 className="text-2xl md:text-5xl lg:text-6xl font-thin tracking-[-0.025em] uppercase">
              {project.title}
            </h1>
            <div className="flex gap-6 font-light tracking-widest text-xs md:text-sm opacity-80 shrink-0">
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#0b0b0b] transition-colors duration-300 flex items-center gap-1 project-link">
                GitHub <svg width="12" height="12" className="md:w-[14px] md:h-[14px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-[50] w-full flex flex-col items-center gap-8 md:gap-32 mt-8 md:mt-12 mb-[15vh] md:mb-[30vh] lg:mb-[40vh] pointer-events-none">
        {galleryImages.map((src, idx) => (
          <div 
            key={idx} 
            className="proj-img-anim w-full max-w-4xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.6)] md:shadow-[0_30px_60px_rgba(0,0,0,0.8)] rounded-sm border border-black/10 pointer-events-auto will-change-transform mobile-no-parallax" 
            data-speed="0.4"
          >
            <img src={src} alt={`${project.title} screenshot ${idx + 1}`} className="w-full h-auto object-cover" />
          </div>
        ))}
      </div>

      <div className="relative z-[30] w-full pt-4 md:pt-12 pb-24 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 w-full proj-detail-anim">
          
          <div className="lg:col-span-5 flex flex-col gap-8 md:gap-12">
            <div className="will-change-transform mobile-no-parallax" data-speed="0.2">
              <h3 className="text-base md:text-2xl font-light tracking-widest uppercase mb-4 md:mb-6 text-[#0b0b0b]">TOOLS</h3>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {project.tools.map((tool) => (
                  <span key={tool} className="border border-black/20 rounded-full px-4 md:px-5 py-1.5 md:py-2 text-[10px] md:text-sm font-extralight text-[#0b0b0b]">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 md:gap-8 will-change-transform mobile-no-parallax" data-speed="0.4">
              <div>
                <h3 className="text-base md:text-2xl font-light tracking-widest uppercase mb-2 md:mb-4 text-[#0b0b0b]">DURATION</h3>
                <p className="font-extralight opacity-70 text-sm md:text-lg">{project.duration}</p>
              </div>
              <div>
                <h3 className="text-base md:text-2xl font-light tracking-widest uppercase mb-2 md:mb-4 text-[#0b0b0b]">ROLES</h3>
                <p className="font-extralight opacity-70 text-sm md:text-lg">{project.roles}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 will-change-transform mobile-no-parallax" data-speed="0.6">
            <h3 className="text-base md:text-2xl font-light tracking-widest uppercase mb-4 md:mb-6 text-[#0b0b0b]">SUMMARY</h3>
            <p className="text-sm md:text-lg lg:text-xl font-extralight opacity-70 leading-relaxed">
              {project.summary}
            </p>
          </div>
        </div>

        {nextProject && (
          <div className="flex justify-end mt-16 md:mt-32 proj-detail-anim will-change-transform mobile-no-parallax" data-speed="0.8">
            <button 
              onClick={() => onNext(nextProject.id)}
              className="group flex items-center gap-2 md:gap-4 text-lg md:text-3xl lg:text-4xl font-thin tracking-widest uppercase hover:text-[#0b0b0b] transition-colors duration-500 project-link"
            >
              {nextProject.title}
              <svg className="w-5 h-5 md:w-8 md:h-8 md:group-hover:translate-x-2 transition-transform duration-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
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
  const introNameRef = useRef(null);
  const transitionCurtainRef = useRef(null);
  const inkCurtainRef = useRef(null);
  const detailCoverRef = useRef(null);
  const detailFlyingTextRef = useRef(null);
  const infoTitleRef = useRef(null);
  const contactTitleRef = useRef(null);
  const worksTitleRef = useRef(null);
  const detailSourceRef = useRef(null);
  const detailArrivalRef = useRef(false);
  const returningFromDetailRef = useRef(false);
  const currentViewRef = useRef('home');
  const detailSwapTimerRef = useRef(null);
  
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [isPageReady, setIsPageReady] = useState(false);
  const [currentView, setCurrentView] = useState(() => getPortfolioViewFromPath(
    typeof window === 'undefined' ? '/' : window.location.pathname,
  ));
  const [selectedProjectId, setSelectedProjectId] = useState(() => (
    typeof window === 'undefined' ? null : getProjectIdFromPath(window.location.pathname)
  ));
  const [isNavigating, setIsNavigating] = useState(false);
  const lenisRef = useRef(null);
  const projectTriggerRef = useRef(null);

  currentViewRef.current = currentView;

  useEffect(() => {
    const initialView = getPortfolioViewFromPath(window.location.pathname);
    window.history.replaceState({
      ...window.history.state,
      portfolioView: initialView,
      enteredFromHome: false,
    }, '', window.location.href);

    const handlePopState = () => {
      const nextView = getPortfolioViewFromPath(window.location.pathname);
      if (['info', 'contact', 'works'].includes(currentViewRef.current) && nextView === 'home') {
        returningFromDetailRef.current = true;
        window.gsap?.set(detailCoverRef.current, { opacity: 1, pointerEvents: 'auto' });
      }
      setSelectedProjectId(getProjectIdFromPath(window.location.pathname));
      setCurrentView(nextView);
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => () => {
    if (detailSwapTimerRef.current !== null) window.clearTimeout(detailSwapTimerRef.current);
  }, []);

  useEffect(() => {
    let disposed = false;
    let scrollLoop = null;
    let lenis = null;
    let onScroll = null;

    const releaseWithoutAnimations = () => {
      if (disposed) return;
      setIsPageReady(true);
      if (loaderRef.current) loaderRef.current.style.display = 'none';
    };

    const runtimeFallbackTimer = window.setTimeout(releaseWithoutAnimations, 5000);

    const loadScripts = async () => {
      try {
        await Promise.all([
          loadScriptOnce('https://cdn.jsdelivr.net/npm/lenis@1.3.23/dist/lenis.min.js'),
          loadScriptOnce('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js')
        ]);
        await loadScriptOnce('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js');
        await document.fonts?.ready;
        if (disposed) return;

        window.clearTimeout(runtimeFallbackTimer);
        window.gsap.registerPlugin(window.ScrollTrigger);
        const supportsSmoothScroll = window.innerWidth >= 1025
          && !('ontouchstart' in window)
          && navigator.maxTouchPoints === 0;

        if (supportsSmoothScroll) {
          lenis = new window.Lenis(getSmoothScrollOptions());
          lenisRef.current = lenis;
          window.portfolioLenis = lenis;
          lenis.stop();
          scrollLoop = createAnimationFrameLoop((time) => lenis.raf(time));
          scrollLoop.start();
        }
        setScriptsLoaded(true);

        onScroll = (event) => {
          window.ScrollTrigger.update();
          window.gsap.set('.scroll-progress-indicator', { scaleY: event.progress || 0 });
        };
        lenis?.on('scroll', onScroll);
      } catch {
        window.clearTimeout(runtimeFallbackTimer);
        releaseWithoutAnimations();
      }
    };
    loadScripts();

    return () => {
      disposed = true;
      window.clearTimeout(runtimeFallbackTimer);
      scrollLoop?.stop();
      if (onScroll) lenis?.off?.('scroll', onScroll);
      lenis?.destroy();
      if (lenisRef.current === lenis) lenisRef.current = null;
      if (window.portfolioLenis === lenis) delete window.portfolioLenis;
    };
  }, []);

  useEffect(() => {
    if (!scriptsLoaded) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const byRevealOrder = (first, second) => (
      Number(first.dataset.introOrder) - Number(second.dataset.introOrder)
    );
    const givenLetters = Array.from(
      introNameRef.current.querySelectorAll('.name-intro__letter--given'),
    ).sort(byRevealOrder);
    const surnameLetters = Array.from(
      introNameRef.current.querySelectorAll('.name-intro__letter--surname'),
    ).sort(byRevealOrder);
    let pageReleased = false;

    const releasePage = () => {
      if (pageReleased) return;
      pageReleased = true;
      setIsPageReady(true);
    };

    const masterTl = window.gsap.timeline({
      onComplete: () => {
        releasePage();
        if (loaderRef.current) loaderRef.current.style.display = 'none';
        if (lenisRef.current) lenisRef.current.start();
      }
    });

    if (reduceMotion) {
      masterTl
        .set(introNameRef.current, { opacity: 1, scale: 1 })
        .set([...givenLetters, ...surnameLetters], {
          opacity: 1,
          yPercent: 0,
          rotate: 0,
          scale: 1,
          filter: 'blur(0px)',
        })
        .to(introNameRef.current, { opacity: 0, duration: 0.2, delay: 0.3, ease: 'none' })
        .call(releasePage)
        .to(loaderRef.current, { autoAlpha: 0, duration: 0.2, ease: 'none' });
    } else {
      masterTl
        .set(introNameRef.current, { opacity: 1, scale: 0.96 }, 0.1)
        .fromTo(
          givenLetters,
          { opacity: 0, yPercent: 115, rotate: 7, scale: 0.82, filter: 'blur(8px)' },
          {
            opacity: 1,
            yPercent: 0,
            rotate: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.72,
            stagger: 0.075,
            ease: 'expo.out',
          },
          0.18,
        )
        .fromTo(
          surnameLetters,
          { opacity: 0, yPercent: 115, rotate: -7, scale: 0.82, filter: 'blur(8px)' },
          {
            opacity: 1,
            yPercent: 0,
            rotate: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.72,
            stagger: 0.075,
            ease: 'expo.out',
          },
          0.18,
        )
        .to(introNameRef.current, { scale: 1, duration: 0.9, ease: 'power3.out' }, 0.18)
        .to(
          introNameRef.current,
          { opacity: 0, scale: 1.2, filter: 'blur(4px)', duration: 0.72, ease: 'power3.in' },
          1.72,
        )
        .call(releasePage, null, 1.9)
        .to(loaderRef.current, { yPercent: -100, duration: 1.05, ease: 'expo.inOut' }, 1.9);
    }

    return () => masterTl.kill();
  }, [scriptsLoaded]);

  useLayoutEffect(() => {
    if (!scriptsLoaded || !window.gsap) return undefined;

    const gsap = window.gsap;
    const cover = detailCoverRef.current;
    const flyingText = detailFlyingTextRef.current;

    if (['info', 'contact', 'works'].includes(currentView)) {
      const title = currentView === 'contact'
        ? contactTitleRef.current
        : currentView === 'works'
          ? worksTitleRef.current
          : infoTitleRef.current;
      const main = document.querySelector('[data-detail-main]');
      const back = document.querySelector('[data-detail-back]');
      const footer = document.querySelector('[data-detail-footer]');
      const arrivedFromNavigation = detailArrivalRef.current;
      detailArrivalRef.current = false;

      gsap.killTweensOf([cover, flyingText, title, main, back, footer]);

      if (!arrivedFromNavigation) {
        gsap.set(cover, { opacity: 0, pointerEvents: 'none' });
        gsap.set(flyingText, { opacity: 0 });
        gsap.set([title, main, back, footer], { opacity: 1 });
        setIsNavigating(false);
        window.requestAnimationFrame(() => title?.focus({ preventScroll: true }));
        return undefined;
      }

      gsap.set(cover, { opacity: 1, pointerEvents: 'auto' });
      gsap.set(title, { opacity: 1 });
      gsap.set([main, back, footer], { opacity: 0 });

      const coverDelay = 0.1;
      const coverDuration = 0.9;
      const releaseTime = getDetailArrivalReleaseTime({ coverDelay, coverDuration });
      const releaseInteraction = () => {
        gsap.set(cover, { pointerEvents: 'none' });
        resumeSmoothScroll(lenisRef.current);
        setIsNavigating(false);
      };

      const timeline = gsap.timeline({
        onComplete: () => {
          title?.focus({ preventScroll: true });
        },
      });
      const labelHandoff = getFlyingLabelHandoffTiming();

      timeline
        .to(flyingText, {
          opacity: 0,
          duration: labelHandoff.duration,
          ease: 'power2.out',
        }, labelHandoff.delay)
        .to(cover, { opacity: 0, duration: coverDuration, ease: 'power2.out' }, coverDelay)
        .call(releaseInteraction, null, releaseTime)
        .to(main, { opacity: 1, duration: 1.1, ease: 'power2.out' }, 0.5)
        .to(back, { opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.7)
        .to(footer, { opacity: 1, duration: 0.7, ease: 'power2.out' }, 0.8);

      return () => timeline.kill();
    }

    if (returningFromDetailRef.current) {
      returningFromDetailRef.current = false;
      gsap.killTweensOf([cover, flyingText]);
      gsap.set(flyingText, { opacity: 0 });
      const tween = gsap.to(cover, {
        opacity: 0,
        duration: 0.65,
        ease: 'power2.out',
        onComplete: () => {
          gsap.set(cover, { pointerEvents: 'none' });
          setIsNavigating(false);
          if (detailSourceRef.current) {
            detailSourceRef.current.style.visibility = '';
            detailSourceRef.current = null;
          }
          if (lenisRef.current) lenisRef.current.start();
        },
      });
      return () => tween.kill();
    }

    return undefined;
  }, [currentView, scriptsLoaded]);

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
        if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true });
        else window.scrollTo(0, 0);
      })
      .to(inkCurtainRef.current, { scaleY: 0, duration: 0.8, ease: "expo.inOut", transformOrigin: "bottom" }, "+=0.1");
  };

  const handleDetailNavigation = (view, sourceElement) => {
    const navigationMode = getDetailNavigationMode({
      hasSourceElement: Boolean(sourceElement),
      isNavigating,
      hasAnimationRuntime: Boolean(window.gsap),
    });

    if (navigationMode === 'blocked') return;

    if (navigationMode === 'immediate') {
      if (loaderRef.current) loaderRef.current.style.display = 'none';
      setIsPageReady(true);
      window.history.pushState({ portfolioView: view, enteredFromHome: true }, '', `/${view}/`);
      setCurrentView(view);
      window.scrollTo(0, 0);
      return;
    }

    const gsap = window.gsap;
    const sourceRect = sourceElement.getBoundingClientRect();
    const sourceStyle = window.getComputedStyle(sourceElement);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const plan = createInfoTransitionPlan({
      destinationView: view,
      sourceRect,
      sourceFontSize: Number.parseFloat(sourceStyle.fontSize),
      viewportWidth: window.innerWidth,
      prefersReducedMotion,
    });
    const swapDelay = getInfoTransitionSwapDelayMs(plan.timing);

    setIsNavigating(true);
    detailArrivalRef.current = true;
    detailSourceRef.current = sourceElement;
    sourceElement.style.visibility = 'hidden';
    lenisRef.current?.stop();

    detailFlyingTextRef.current.textContent = view === 'contact'
      ? 'Contact'
      : view === 'works'
        ? 'Works'
        : 'Info';
    gsap.killTweensOf([detailCoverRef.current, detailFlyingTextRef.current]);
    gsap.set(detailCoverRef.current, { opacity: 0, pointerEvents: 'auto' });
    gsap.set(detailFlyingTextRef.current, {
      left: plan.start.left,
      top: plan.start.top,
      fontSize: plan.start.fontSize,
      fontWeight: sourceStyle.fontWeight,
      lineHeight: sourceStyle.lineHeight,
      letterSpacing: sourceStyle.letterSpacing,
      opacity: 1,
      x: 0,
      y: 0,
    });

    gsap.timeline()
      .to(detailCoverRef.current, {
        opacity: 1,
        duration: plan.timing.coverDuration,
        ease: 'power2.inOut',
      }, 0)
      .to(detailFlyingTextRef.current, {
        left: plan.end.left,
        top: plan.end.top,
        fontSize: plan.end.fontSize,
        fontWeight: 400,
        lineHeight: plan.end.lineHeight,
        letterSpacing: plan.end.letterSpacing,
        duration: plan.timing.labelDuration,
        ease: 'power3.inOut',
      }, plan.timing.labelDelay);

    detailSwapTimerRef.current = window.setTimeout(() => {
      detailSwapTimerRef.current = null;
      window.history.pushState({ portfolioView: view, enteredFromHome: true }, '', `/${view}/`);
      setCurrentView(view);
      window.scrollTo(0, 0);
    }, swapDelay);
  };

  const handleDetailBack = () => {
    if (isNavigating || !window.gsap) return;

    const gsap = window.gsap;
    const title = currentView === 'contact'
      ? contactTitleRef.current
      : currentView === 'works'
        ? worksTitleRef.current
        : infoTitleRef.current;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setIsNavigating(true);

    const timeline = gsap.timeline({
      onComplete: () => {
        returningFromDetailRef.current = true;
        if (window.history.state?.enteredFromHome) {
          window.history.back();
          return;
        }
        window.history.replaceState({ portfolioView: 'home', enteredFromHome: false }, '', '/');
        setCurrentView('home');
      },
    });

    timeline
      .to(title, {
        opacity: 0,
        duration: prefersReducedMotion ? 0 : 0.4,
        ease: 'power2.inOut',
      }, 0)
      .to(detailCoverRef.current, {
        opacity: 1,
        duration: prefersReducedMotion ? 0 : 0.5,
        ease: 'power2.inOut',
        onStart: () => gsap.set(detailCoverRef.current, { pointerEvents: 'auto' }),
      }, prefersReducedMotion ? 0 : 0.1);
  };

  const handleSectionNavigation = (sectionId, sourceElement) => {
    if (['info', 'contact', 'works'].includes(sectionId)) {
      handleDetailNavigation(sectionId, sourceElement);
      return;
    }

    const section = document.getElementById(sectionId);
    if (!section) return;

    const offset = sectionId === 'contact' ? -120 : -24;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(section, { offset, duration: 1.25 });
      return;
    }

    const top = section.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const handleProjectOpen = (id) => {
    projectTriggerRef.current = document.activeElement;
    setSelectedProjectId(id);
  };

  const handleCaseStudyNavigation = (view, id, path, historyMethod = 'pushState') => {
    if (isNavigating || !window.gsap) return;

    const gsap = window.gsap;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setIsNavigating(true);
    lenisRef.current?.stop();
    gsap.killTweensOf(inkCurtainRef.current);
    gsap.set(inkCurtainRef.current, {
      backgroundColor: '#f5f5f2',
      opacity: 1,
      scaleY: 0,
      transformOrigin: 'bottom',
      pointerEvents: 'auto',
    });

    gsap.timeline({
      onComplete: () => {
        gsap.set(inkCurtainRef.current, {
          backgroundColor: '#070707',
          opacity: 1,
          scaleY: 0,
          pointerEvents: 'none',
        });
        lenisRef.current?.start();
        window.ScrollTrigger?.refresh();
        setIsNavigating(false);
      },
    })
      .to(inkCurtainRef.current, {
        scaleY: 1,
        duration: reducedMotion ? 0 : 1.15,
        ease: 'expo.inOut',
      })
      .call(() => {
        window.history[historyMethod]({ portfolioView: view, projectId: id }, '', path);
        setSelectedProjectId(id);
        setCurrentView(view);
        restoreCaseStudyScroll(lenisRef.current, () => window.scrollTo(0, 0));
      })
      .to(inkCurtainRef.current, {
        opacity: 0,
        duration: reducedMotion ? 0 : 0.55,
        ease: 'power2.out',
      });
  };

  const handleWorkProjectOpen = (id) => {
    handleCaseStudyNavigation('project', id, getProjectPath(id));
  };

  const handleCaseStudyBack = () => {
    handleCaseStudyNavigation('works', null, '/works/', 'replaceState');
  };

  const handleNextCaseStudy = (id) => {
    handleCaseStudyNavigation('project', id, getProjectPath(id), 'replaceState');
  };

  const handleProjectClose = () => {
    setSelectedProjectId(null);
    window.requestAnimationFrame(() => projectTriggerRef.current?.focus?.({ preventScroll: true }));
  };

  const selectedProject = selectedProjectId ? PROJECTS_DATA.find(p => p.id === selectedProjectId) : null;
  const selectedProjectIndex = selectedProjectId ? PROJECTS_DATA.findIndex(p => p.id === selectedProjectId) : -1;
  const nextProject = selectedProjectIndex >= 0 && selectedProjectIndex < PROJECTS_DATA.length - 1 ? PROJECTS_DATA[selectedProjectIndex + 1] : null;

  return (
    <div ref={mainRef} className="min-h-screen w-full relative overflow-x-clip cursor-auto selection:bg-[#0b0b0b] selection:text-[#f5f5f2] bg-[#f5f5f2] text-[#0b0b0b]">
      {/* Grain noise overlay — premium tactile depth */}
      <div className="grain-overlay" aria-hidden="true" />

      <div ref={inkCurtainRef} className="fixed inset-0 bg-[#070707] z-[75] scale-y-0 origin-top pointer-events-none"></div>

      <div
        id="detail-transition-cover"
        ref={detailCoverRef}
        className="fixed inset-0 z-[10010] bg-[#f5f5f2] opacity-0 pointer-events-none"
        aria-hidden="true"
      />
      <div
        id="detail-transition-label"
        ref={detailFlyingTextRef}
        className="fixed z-[10011] whitespace-nowrap text-[#0b0b0b] opacity-0 pointer-events-none"
        style={{
          fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
          lineHeight: 1.2,
          willChange: 'left, top, font-size',
        }}
        aria-hidden="true"
      >
        Info
      </div>

      <ScrollProgressRail isLoaded={isPageReady} isVisible={currentView === 'home'} />

      <div
        ref={loaderRef}
        className="name-intro pointer-events-none fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      >
        <div ref={introNameRef} className="name-intro__name" aria-label="Jovan Chandra">
          <span className="name-intro__given" aria-hidden="true">
            {'Jovan'.split('').map((letter, index) => (
              <span
                key={`${letter}-${index}`}
                className="name-intro__letter name-intro__letter--given"
                data-intro-order={4 - index}
              >
                {letter}
              </span>
            ))}
          </span>
          <span className="name-intro__surname" aria-hidden="true">
            {'Chandra'.split('').map((letter, index) => (
              <span
                key={`${letter}-${index}`}
                className="name-intro__letter name-intro__letter--surname"
                data-intro-order={index}
              >
                {letter}
              </span>
            ))}
          </span>
        </div>
      </div>

      <FloatingHomeNav
        currentView={currentView}
        onSection={handleSectionNavigation}
        isLoaded={isPageReady}
        isNavigating={isNavigating}
      />

      {currentView === 'info' && (
        <InfoView ref={infoTitleRef} onBack={handleDetailBack} />
      )}

      {currentView === 'contact' && (
        <ContactView ref={contactTitleRef} onBack={handleDetailBack} />
      )}

      {currentView === 'works' && (
        <WorksArchiveView
          ref={worksTitleRef}
          isLoaded={isPageReady}
          projects={PROJECTS_DATA}
          onBack={handleDetailBack}
          onProjectClick={handleWorkProjectOpen}
        />
      )}

      {/* --- Works Navigation: Top Header --- */}
      <nav 
        className={`fixed left-0 top-0 w-full h-16 md:h-24 flex justify-between items-center px-6 md:px-16 lg:px-24 z-[60] bg-white/90 md:bg-white/80 backdrop-blur-xl border-b border-black/10 text-[#0b0b0b] transition-all duration-[1000ms]
        ${currentView === 'gallery' ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-16'}`}
      >
        <div className="flex gap-6 md:gap-12 text-[10px] md:text-sm tracking-widest uppercase w-full md:w-auto justify-around md:justify-start">
          <button onClick={() => handleNavigation('home')} className="relative group w-max text-left project-link">
            <span className={`transition-opacity font-light ${currentView === 'home' ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'}`}>Home</span>
            <span className={`absolute -bottom-2 left-0 h-[1px] transform origin-left transition-all duration-500 hidden md:block ${currentView === 'home' ? 'w-full bg-[#0b0b0b]' : 'w-0 group-hover:w-full bg-[#0b0b0b]'}`}></span>
          </button>
          <button onClick={() => handleNavigation('works')} className="relative group w-max text-left project-link">
            <span className={`transition-opacity font-light ${currentView === 'works' ? 'opacity-100 text-[#0b0b0b]' : 'opacity-50 group-hover:opacity-100'}`}>Works</span>
            <span className={`absolute -bottom-2 left-0 h-[1px] transform origin-left transition-all duration-500 hidden md:block ${currentView === 'works' ? 'w-full bg-[#0b0b0b]' : 'w-0 group-hover:w-full bg-[#0b0b0b]'}`}></span>
          </button>
          <button onClick={() => handleNavigation('gallery')} className="relative group w-max text-left project-link">
            <span className={`transition-opacity font-light ${currentView === 'gallery' ? 'opacity-100 text-[#0b0b0b]' : 'opacity-50 group-hover:opacity-100'}`}>Gallery</span>
            <span className={`absolute -bottom-2 left-0 h-[1px] transform origin-left transition-all duration-500 hidden md:block ${currentView === 'gallery' ? 'w-full bg-[#0b0b0b]' : 'w-0 group-hover:w-full bg-[#0b0b0b]'}`}></span>
          </button>
        </div>

        <div className="hidden md:flex gap-6 items-center">
          <a href="https://www.linkedin.com/in/jovan-richaldy/" target="_blank" rel="noopener noreferrer" className="relative p-2 -m-2 opacity-50 hover:opacity-100 hover:-translate-y-1 hover:text-[#0b0b0b] hover:drop-shadow-[0_0_10px_rgba(11,11,11,0.22)] transition-all duration-500 project-link"><LinkedinIcon size={20} strokeWidth={1.5} /></a>
          <a href="https://www.instagram.com/jovanrichaldy/?hl=en" target="_blank" rel="noopener noreferrer" className="relative p-2 -m-2 opacity-50 hover:opacity-100 hover:-translate-y-1 hover:text-[#0b0b0b] hover:drop-shadow-[0_0_10px_rgba(11,11,11,0.22)] transition-all duration-500 project-link"><InstagramIcon size={20} strokeWidth={1.5} /></a>
          <a href="https://github.com/urboiflex" target="_blank" rel="noopener noreferrer" className="relative p-2 -m-2 opacity-50 hover:opacity-100 hover:-translate-y-1 hover:text-[#0b0b0b] hover:drop-shadow-[0_0_10px_rgba(11,11,11,0.22)] transition-all duration-500 project-link"><GithubIcon size={20} strokeWidth={1.5} /></a>
          <a href="mailto:jovan.rc1212@gmail.com" className="relative p-2 -m-2 opacity-50 hover:opacity-100 hover:-translate-y-1 hover:text-[#0b0b0b] hover:drop-shadow-[0_0_10px_rgba(11,11,11,0.22)] transition-all duration-500 project-link"><MailIcon size={20} strokeWidth={1.5} /></a>
        </div>
      </nav>

      {/* --- Main Content Container --- */}
      <main className={`relative z-50 transition-all duration-0
        ${currentView === 'project' ? 'px-0' : 'px-6 md:px-16 lg:px-24'}
        ${currentView === 'home' ? 'pt-0 pb-28 md:pb-32' : 'ml-0 pt-0'}
        ${currentView === 'works' ? 'pb-24 md:pb-32' : ''}
        ${currentView === 'gallery' ? 'pb-24 md:pb-32' : ''}
        ${currentView === 'project' ? 'pb-0' : ''}
      `}>
        <div ref={transitionCurtainRef} className={currentView === 'project' ? 'w-full' : 'w-full max-w-6xl mx-auto'}>
          {currentView === 'home' && (
            <HomeView
              isLoaded={isPageReady}
              onProjectClick={handleProjectOpen}
            />
          )}
          {currentView === 'legacy-works' && <WorksView isLoaded={isPageReady} onProjectClick={handleProjectOpen} />}
          {currentView === 'gallery' && <GalleryView isLoaded={isPageReady} />}
          {currentView === 'project' && selectedProject && (
            <ProjectCaseStudyView
              isLoaded={isPageReady}
              project={selectedProject}
              nextProject={nextProject}
              currentProjectIndex={selectedProjectIndex}
              projectCount={PROJECTS_DATA.length}
              onBack={handleCaseStudyBack}
              onNext={handleNextCaseStudy}
            />
          )}
          {currentView === 'legacy-project' && selectedProject && (
            <ProjectDetailView
              isLoaded={isPageReady}
              project={selectedProject}
              nextProject={nextProject}
              onBack={() => handleNavigation('works')}
              onNext={(id) => handleNavigation('project', id)}
            />
          )}
        </div>
      </main>

      {selectedProject && currentView !== 'project' && (
        <ProjectShowcaseModal
          project={selectedProject}
          projects={PROJECTS_DATA}
          onClose={handleProjectClose}
          onSelectProject={setSelectedProjectId}
          scrollController={lenisRef.current}
        />
      )}

      <style dangerouslySetInnerHTML={{__html: `
        
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

        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        ::-webkit-scrollbar { width: 0px; background: transparent; }
        html.lenis { height: auto; }
        .lenis.lenis-smooth { scroll-behavior: auto; }
        .lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }
        .lenis.lenis-stopped { overflow: hidden; }

        /* Grain noise overlay */
        .grain-overlay {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 9999;
          opacity: 0.022;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 180px 180px;
        }
        @keyframes grain-shift {
          0%   { transform: translate(0, 0); }
          12%  { transform: translate(-4%, -7%); }
          25%  { transform: translate(5%, 3%); }
          37%  { transform: translate(-7%, 5%); }
          50%  { transform: translate(3%, -5%); }
          62%  { transform: translate(-5%, 7%); }
          75%  { transform: translate(7%, -3%); }
          87%  { transform: translate(-3%, 6%); }
          100% { transform: translate(0, 0); }
        }

        /* Marquee */
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marquee-scroll 22s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }

        /* Gallery masonry grid */
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-auto-rows: 220px;
          gap: 10px;
        }
        .gallery-cell {
          grid-row: span 1;
        }
        .gallery-cell--wide {
          grid-column: span 2;
        }

        /* Empty-state cells */
        .gal-empty-cell {
          border: 1px solid rgba(11,11,11,0.07);
          background: transparent;
          position: relative;
          overflow: hidden;
        }
        .gal-empty-cell::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(11,11,11,0.015) 0%, transparent 60%);
        }

        /* Scan-line per cell */
        .gal-scan-line {
          position: absolute;
          top: -2px;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(11,11,11,0.12) 35%, rgba(11,11,11,0.28) 50%, rgba(11,11,11,0.12) 65%, transparent 100%);
          animation: gallery-scan 3.5s ease-in-out infinite;
          animation-delay: var(--delay, 0s);
        }
        @keyframes gallery-scan {
          0%   { top: -2px; opacity: 0; }
          6%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }

        @media (max-width: 1023px) {
          .gallery-grid {
            grid-template-columns: repeat(2, 1fr);
            grid-auto-rows: 200px;
          }
          .gallery-cell--wide {
            grid-column: span 2;
          }
        }
        @media (max-width: 639px) {
          .gallery-grid {
            grid-template-columns: 1fr;
            grid-auto-rows: 220px;
          }
          .gallery-cell--wide {
            grid-column: span 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
          .grain-overlay { animation: none; }
          .gal-scan-line { animation: none; }
        }
      `}} />
    </div>
  );
}
