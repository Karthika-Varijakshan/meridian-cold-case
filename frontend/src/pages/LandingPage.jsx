import React, { useEffect } from 'react';

import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import PoweredBy from '../components/landing/PoweredBy';
import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import DashboardPreview from '../components/landing/DashboardPreview';
import Architecture from '../components/landing/Architecture';
import TechStack from '../components/landing/TechStack';
import AgentCards from '../components/landing/AgentCards';
import Metrics from '../components/landing/Metrics';
import About from '../components/landing/About';
import Contact from '../components/landing/Contact';
import Footer from '../components/landing/Footer';

const SEO_TITLE = 'MERIDIAN | Cold Case Intelligence Platform';
const SEO_DESCRIPTION =
  'Agentic AI for criminal investigations — MERIDIAN uses a 9-agent LangGraph pipeline to reconstruct timelines, correlate evidence, and surface hidden patterns across decades of cold cases.';

export default function LandingPage() {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = SEO_TITLE;

    let meta = document.querySelector('meta[name="description"]');
    const createdMeta = !meta;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    const prevContent = meta.getAttribute('content');
    meta.setAttribute('content', SEO_DESCRIPTION);

    return () => {
      document.title = prevTitle;
      if (createdMeta) {
        meta.remove();
      } else if (prevContent !== null) {
        meta.setAttribute('content', prevContent);
      }
    };
  }, []);

  return (
    <div className="bg-[#0D1016] text-gray-100 font-sans antialiased overflow-x-hidden">
      <Navbar />
      <Hero />
      <PoweredBy />
      <Features />
      <HowItWorks />
      <DashboardPreview />
      <Architecture />
      <TechStack />
      <AgentCards />
      <Metrics />
      <About />
      <Contact />
      <Footer />
    </div>
  );
}
