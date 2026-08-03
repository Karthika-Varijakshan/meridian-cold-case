import React from 'react';
import { motion } from 'framer-motion';
import { Mail, ShieldCheck } from 'lucide-react';
import { GITHUB_URL, LINKEDIN_URL, EMAIL_ADDRESS, DEVELOPER_NAME, DEVELOPER_ROLE } from '../../config/social';
import { GithubIcon, LinkedinIcon } from '../shared/SocialIcons';

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
          <h3 className="text-2xl font-bold text-white mb-1">{DEVELOPER_NAME}</h3>
          <p className="text-sm text-[#3FA9A0] mb-8">{DEVELOPER_ROLE}</p>

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
