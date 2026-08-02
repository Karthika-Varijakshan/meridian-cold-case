import React from 'react';
import { motion } from 'framer-motion';
import { Mail, ShieldCheck } from 'lucide-react';

// TODO: fill in your real links — these are currently empty placeholders
// since I don't have your actual GitHub/LinkedIn/email on file.
const GITHUB_URL = '';
const LINKEDIN_URL = '';
const EMAIL_ADDRESS = '';

// GitHub/LinkedIn marks as inline SVGs instead of lucide-react imports —
// newer lucide-react versions dropped brand/logo icons (trademark reasons),
// so importing "Github"/"Linkedin" from it throws at runtime. Inline SVGs
// have no dependency on the icon library's export list at all.
function GithubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 .5C5.73.5.98 5.24.98 11.52c0 5.02 3.26 9.28 7.78 10.79.57.1.78-.25.78-.55 0-.27-.01-1.16-.02-2.11-3.17.69-3.84-1.35-3.84-1.35-.52-1.31-1.26-1.66-1.26-1.66-1.03-.7.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.01 1.73 2.65 1.23 3.3.94.1-.73.4-1.23.72-1.51-2.53-.29-5.19-1.27-5.19-5.63 0-1.24.44-2.26 1.17-3.06-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.14 1.17a10.8 10.8 0 0 1 5.72 0c2.18-1.48 3.13-1.17 3.13-1.17.63 1.57.24 2.73.12 3.02.73.8 1.17 1.82 1.17 3.06 0 4.37-2.67 5.34-5.21 5.62.41.36.77 1.06.77 2.15 0 1.55-.01 2.79-.01 3.17 0 .3.2.66.79.55A11.03 11.03 0 0 0 23.02 11.5C23.02 5.24 18.27.5 12 .5Z" />
    </svg>
  );
}

function LinkedinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.62 0 4.28 2.38 4.28 5.48v6.26ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.75v20.5C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.75V1.75C24 .78 23.2 0 22.22 0Z" />
    </svg>
  );
}

export default function Contact() {
  const links = [
    { icon: GithubIcon, label: 'GitHub', href: GITHUB_URL },
    { icon: LinkedinIcon, label: 'LinkedIn', href: LINKEDIN_URL },
    { icon: Mail, label: 'Email', href: EMAIL_ADDRESS ? `mailto:${EMAIL_ADDRESS}` : '' },
  ];

  return (
    <section id="contact" className="relative py-28 px-6 lg:px-10">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#C9902E] to-[#996414] flex items-center justify-center mx-auto mb-6 shadow-goldGlow">
            <ShieldCheck className="w-7 h-7 text-black" />
          </div>
          <p className="text-xs font-mono tracking-[0.3em] text-gray-500 uppercase mb-2">Developed by</p>
          <h3 className="text-2xl font-bold text-white mb-1">Karthika Varijakshan</h3>
          <p className="text-sm text-[#3FA9A0] mb-8">Cybersecurity Engineer</p>

          <div className="flex items-center justify-center gap-4">
            {links.map((link) => {
              const Icon = link.icon;
              const disabled = !link.href;
              return (
                <a
                  key={link.label}
                  href={link.href || undefined}
                  target={link.href ? '_blank' : undefined}
                  rel="noreferrer"
                  aria-disabled={disabled}
                  title={disabled ? `Add your ${link.label} link` : link.label}
                  className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg border transition-all ${
                    disabled
                      ? 'border-[#232B36] text-gray-600 cursor-not-allowed'
                      : 'border-[#232B36] text-gray-300 hover:text-[#C9902E] hover:border-[#C9902E]/50'
                  }`}
                  onClick={(e) => disabled && e.preventDefault()}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{link.label}</span>
                </a>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
