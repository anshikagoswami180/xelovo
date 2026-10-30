import React from 'react';
import { ShieldCheck, User, Code2, Cpu, Eye, FileText, CheckCircle2, AlertTriangle, Database, Zap, Lock, HelpCircle, Target, Compass, BookOpen, ShieldAlert, Award } from 'lucide-react';

export default function AboutPage() {
  const capabilities = [
    { title: 'Web Security Analysis', desc: 'Scan domains, HTTP headers, TLS/SSL configurations, CORS policies, and security headers for misconfigurations.', icon: ShieldCheck },
    { title: 'Intelligence & OSINT', desc: 'Gather observable public threat intelligence, domain registration signals, WHOIS metadata, and DNS infrastructure data.', icon: Eye },
    { title: 'Network Analysis', desc: 'Perform safe non-destructive probes, port discovery, IP exposure mapping, and SSL certificate chain verification.', icon: Database },
    { title: 'Privacy Footprint Analysis', desc: 'Assess tracker presence, data leak footprints, third-party script integrations, and privacy compliance signals.', icon: Lock },
    { title: 'Forensic & Cryptographic Utilities', desc: 'Cryptographic hashing (SHA-256, MD5), base64/URL encoding/decoding, JWT decoding, and file checksum tools.', icon: Cpu },
    { title: 'Digital Investigation', desc: 'Analyze suspicious text messages, raw email headers, phishing URL indicators, and image EXIF metadata.', icon: Zap },
    { title: 'Evidence-Based Reporting', desc: 'Export print-ready A4 PDF, JSON, Markdown, and HTML reports with SHA-256 integrity digests and provenance timestamps.', icon: FileText },
    { title: 'Defensive Security Remediation', desc: 'Context-grounded defensive recommendations and hardened configuration directives to remediate raw exposure.', icon: ShieldCheck }
  ];

  const evidenceLevels = [
    { label: 'Verified Evidence', badge: 'VERIFIED', color: '#10B981', desc: 'Empirical data directly retrieved from authoritative live network probes or user-provided raw payload inputs.' },
    { label: 'Observed Telemetry', badge: 'OBSERVED', color: '#1688FF', desc: 'Raw HTTP headers, network socket responses, DNS records, and cryptographic certificate payloads collected during scans.' },
    { label: 'Derived Heuristics', badge: 'DERIVED', color: '#19D7E8', desc: 'Deterministically calculated risk scores, pattern matches, compliance evaluations, and rule-based threat classifications.' },
    { label: 'Unverified Signals', badge: 'UNVERIFIED', color: '#F59E0B', desc: 'Aspects that could not be independently queried due to missing third-party keys, rate-limits, or offline target probes.' },
    { label: 'Unavailable / Blocked', badge: 'NOT_PERFORMED', color: '#EF4444', desc: 'Operations explicitly restricted by SSRF safety boundaries, loopback protections, or unconfigured APIs.' }
  ];

  const principles = [
    'Evidence over arbitrary scoring',
    'Transparent analysis provenance',
    'User-controlled input parameters',
    'Hardened SSRF security architecture',
    'Explicit limitations and confidence scores',
    'Zero fabricated network telemetry',
    'Responsible defensive research focus'
  ];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      
      {/* PAGE HEADER */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#19D7E8', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            PLATFORM IDENTIFICATION & GOVERNANCE
          </span>
        </div>
        <h1 style={{ fontSize: '2.4rem', color: '#F2F5F9', fontFamily: 'var(--font-display)', fontWeight: 800 }}>
          About XELOVO
        </h1>
        <p style={{ fontSize: '1.05rem', color: '#B5C0D0', marginTop: '0.4rem', fontWeight: 500 }}>
          Empirical Threat Telemetry, Forensic Analysis & Security Intelligence Platform
        </p>
      </div>

      {/* 1. INTRODUCTION & OVERVIEW */}
      <div className="xelavo-card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.35rem', color: '#F2F5F9', marginBottom: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <ShieldCheck color="#1688FF" size={24} /> 1. Platform Overview
        </h2>
        <p style={{ fontSize: '0.98rem', color: '#B5C0D0', lineHeight: 1.75 }}>
          XELOVO is a production-grade security analysis and digital investigation platform designed to help security analysts, developers, and researchers inspect digital assets, evaluate network security postures, investigate security indicators, and generate verifiable forensic reports. Built around empirical evidence and strict execution standards, XELOVO delivers honest actionable security intelligence without relying on fabricated metrics or arbitrary scorecards.
        </p>
      </div>

      {/* 2. MISSION STATEMENT */}
      <div className="xelavo-card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.35rem', color: '#F2F5F9', marginBottom: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Target color="#19D7E8" size={24} /> 2. Platform Mission
        </h2>
        <p style={{ fontSize: '0.98rem', color: '#B5C0D0', lineHeight: 1.75 }}>
          To provide accessible, evidence-driven security analysis tools that prioritize empirical verification over speculation. XELOVO equips defenders with exact network telemetry, cryptographic proofs, and structured reports so technical teams can remediate real exposure swiftly and with total technical confidence.
        </p>
      </div>

      {/* 3. VISION */}
      <div className="xelavo-card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.35rem', color: '#F2F5F9', marginBottom: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Compass color="#1688FF" size={24} /> 3. Strategic Vision
        </h2>
        <p style={{ fontSize: '0.98rem', color: '#B5C0D0', lineHeight: 1.75 }}>
          Establish a transparent digital investigation standard where every security indicator is backed by explicit source attribution, raw output inspection, and SHA-256 cryptographic verification. XELOVO envisions a defensive ecosystem where automated tools deliver direct truth rather than black-box security estimates.
        </p>
      </div>

      {/* 4. SECURITY PHILOSOPHY */}
      <div className="xelavo-card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.35rem', color: '#F2F5F9', marginBottom: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Lock color="#10B981" size={24} /> 4. Security Philosophy
        </h2>
        <p style={{ fontSize: '0.98rem', color: '#B5C0D0', lineHeight: 1.75, marginBottom: '1rem' }}>
          XELOVO follows a strict zero-trust analysis workflow. Security analysis must be non-destructive, ethically bounded, and technically reproducible. We enforce multi-layer Server-Side Request Forgery (SSRF) controls to protect internal network infrastructure while executing safe, public security diagnostics.
        </p>
      </div>

      {/* 5. EVIDENCE-FIRST METHODOLOGY */}
      <div className="xelavo-card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.35rem', color: '#F2F5F9', marginBottom: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <CheckCircle2 color="#10B981" size={24} /> 5. Evidence-First Methodology
        </h2>
        <p style={{ fontSize: '0.95rem', color: '#B5C0D0', marginBottom: '1.25rem', lineHeight: 1.6 }}>
          XELOVO enforces absolute transparency. The platform operates on a strict non-fabricated policy: verified empirical data is clearly demarcated from unverified estimates or unavailable probes. Every report explicitly lists what was verified and what was not.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {evidenceLevels.map((lvl, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'rgba(3, 11, 28, 0.7)',
              padding: '0.85rem 1.25rem',
              borderRadius: '8px',
              borderLeft: `4px solid ${lvl.color}`,
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}>
              <div>
                <span style={{ fontSize: '0.92rem', color: '#F2F5F9', fontWeight: 700 }}>{lvl.label}</span>
                <p style={{ fontSize: '0.82rem', color: '#8494AB', margin: '0.2rem 0 0 0' }}>{lvl.desc}</p>
              </div>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                color: lvl.color,
                backgroundColor: `${lvl.color}1E`,
                padding: '0.25rem 0.65rem',
                borderRadius: '6px',
                border: `1px solid ${lvl.color}40`,
                fontFamily: 'var(--font-mono)'
              }}>
                {lvl.badge}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 6. PLATFORM CAPABILITIES */}
      <div className="xelavo-card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.35rem', color: '#F2F5F9', marginBottom: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Zap color="#19D7E8" size={24} /> 6. Platform Capabilities
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          {capabilities.map((cap, idx) => {
            const IconComp = cap.icon;
            return (
              <div key={idx} style={{
                backgroundColor: 'rgba(6, 20, 43, 0.6)',
                padding: '1.25rem',
                borderRadius: '10px',
                border: '1px solid rgba(45, 125, 255, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#19D7E8' }}>
                  <IconComp size={20} />
                  <h3 style={{ fontSize: '0.95rem', color: '#F2F5F9', margin: 0, fontWeight: 700 }}>{cap.title}</h3>
                </div>
                <p style={{ fontSize: '0.84rem', color: '#8494AB', margin: 0, lineHeight: 1.5 }}>{cap.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7. PLATFORM LEADERSHIP */}
      <div className="xelavo-card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.35rem', color: '#F2F5F9', marginBottom: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <User color="#1688FF" size={24} /> 7. Platform Leadership
        </h2>
        <div style={{
          backgroundColor: 'rgba(6, 20, 43, 0.7)',
          padding: '1.75rem',
          borderRadius: '12px',
          border: '1px solid rgba(25, 215, 232, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(25, 215, 232, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#19D7E8',
              border: '2px solid rgba(25, 215, 232, 0.5)'
            }}>
              <User size={34} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '1.3rem', color: '#F2F5F9', margin: 0, fontWeight: 800 }}>Anshika Goswami</h3>
                <span style={{ fontSize: '0.72rem', backgroundColor: 'rgba(25, 215, 232, 0.2)', color: '#19D7E8', padding: '0.2rem 0.6rem', borderRadius: '4px', border: '1px solid rgba(25, 215, 232, 0.4)', fontWeight: 700 }}>
                  FOUNDER & LEAD ARCHITECT
                </span>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#19D7E8', margin: '0.35rem 0 0 0', fontWeight: 600 }}>
                Founder & Lead Platform Architect
              </p>
              <p style={{ fontSize: '0.84rem', color: '#8494AB', margin: '0.2rem 0 0 0', fontFamily: 'var(--font-mono)' }}>
                Education: Diploma in Information Technology — 5th Semester
              </p>
            </div>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#B5C0D0', lineHeight: 1.6, margin: 0 }}>
            Anshika Goswami leads XELOVO's architectural vision, threat intelligence models, evidence-driven core design, and security engineering strategy. Under her leadership, XELOVO was created as an uncompromising defensive intelligence engine built on empirical validation.
          </p>
        </div>
      </div>

      {/* 8. ENGINEERING TEAM */}
      <div className="xelavo-card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.35rem', color: '#F2F5F9', marginBottom: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Code2 color="#1688FF" size={24} /> 8. Engineering & Technical Development
        </h2>
        <div style={{
          backgroundColor: 'rgba(6, 20, 43, 0.7)',
          padding: '1.75rem',
          borderRadius: '12px',
          border: '1px solid rgba(22, 136, 255, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(22, 136, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1688FF',
              border: '2px solid rgba(22, 136, 255, 0.5)'
            }}>
              <Code2 size={34} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '1.3rem', color: '#F2F5F9', margin: 0, fontWeight: 800 }}>Dhruvi Solanki</h3>
                <span style={{ fontSize: '0.72rem', backgroundColor: 'rgba(22, 136, 255, 0.2)', color: '#1688FF', padding: '0.2rem 0.6rem', borderRadius: '4px', border: '1px solid rgba(22, 136, 255, 0.4)', fontWeight: 700 }}>
                  TECHNICAL LEAD
                </span>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#1688FF', margin: '0.35rem 0 0 0', fontWeight: 600 }}>
                Technical Lead & Frontend Developer
              </p>
              <p style={{ fontSize: '0.84rem', color: '#8494AB', margin: '0.2rem 0 0 0', fontFamily: 'var(--font-mono)' }}>
                Education: Diploma in Information Technology — 5th Semester
              </p>
            </div>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#B5C0D0', lineHeight: 1.6, margin: 0 }}>
            Dhruvi Solanki directs frontend engineering, real-time telemetry rendering, tool interactive workflows, evidence presentation, multi-format report exports, and client-side integration of analytical pipelines across XELOVO.
          </p>
        </div>
      </div>

      {/* 9. PROJECT IDENTITY & PXT SEC26 */}
      <div className="xelavo-card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.35rem', color: '#F2F5F9', marginBottom: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Award color="#F97316" size={24} /> 9. Project Identity & PXT sec26
        </h2>
        <div style={{ backgroundColor: 'rgba(3, 11, 28, 0.6)', padding: '1.25rem', borderRadius: '10px', border: '1px solid rgba(249, 115, 22, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#F97316', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>INTERNAL CODE: PXT sec26</span>
          </div>
          <p style={{ fontSize: '0.92rem', color: '#B5C0D0', lineHeight: 1.6, margin: 0 }}>
            <strong>PXT sec26</strong> represents the internal development codename and engineering designation assigned to the XELOVO platform by Founder Anshika Goswami and Technical Lead Dhruvi Solanki during academic development in Diploma in IT (5th Semester).
          </p>
        </div>
      </div>

      {/* 10. TRANSPARENCY & DATA GOVERNANCE */}
      <div className="xelavo-card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.35rem', color: '#F2F5F9', marginBottom: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <BookOpen color="#19D7E8" size={24} /> 10. Transparency & Data Governance Principles
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          {principles.map((pr, idx) => (
            <div key={idx} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              backgroundColor: 'rgba(3, 11, 28, 0.6)',
              padding: '0.85rem 1rem',
              borderRadius: '8px',
              border: '1px solid rgba(45, 125, 255, 0.2)'
            }}>
              <CheckCircle2 size={18} color="#10B981" />
              <span style={{ fontSize: '0.9rem', color: '#F2F5F9', fontWeight: 600 }}>{pr}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 11. RESPONSIBLE SECURITY & DEFENSIVE USE */}
      <div className="xelavo-card" style={{ padding: '2rem', borderLeft: '4px solid #F97316' }}>
        <h2 style={{ fontSize: '1.35rem', color: '#F2F5F9', marginBottom: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <ShieldAlert color="#F97316" size={24} /> 11. Responsible Security & Defensive Guidelines
        </h2>
        <p style={{ fontSize: '0.92rem', color: '#B5C0D0', lineHeight: 1.6, margin: 0 }}>
          XELOVO is strictly designed for defensive threat assessment, authorized digital investigations, public OSINT gathering, security research, and educational analysis. The platform must never be used for unauthorized penetration testing, malicious probing, or denial-of-service activities. All users are expected to adhere to applicable cyber laws and ethical disclosure guidelines.
        </p>
      </div>

    </div>
  );
}

