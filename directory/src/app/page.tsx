"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Store,
  Zap,
  ArrowUpToLine,
  Wind,
  Sparkles,
  Flame,
  Shield,
  Sun,
  Plug2,
  Droplets,
  Car,
  ChevronRight,
  Play,
  ScanLine,
  FileText,
  CheckCircle2,
  Clock,
  MapPin,
  Users,
  BarChart3,
  Workflow,
  FileSearch,
  Brain,
  Building2,
  Hotel,
  Factory,
  Briefcase,
  XCircle,
} from "lucide-react";
import { categories as categoriesData, citySlugMap } from "@/data/categories";
import { HeroSearch } from "@/components/HeroSearch";

const iconMap: Record<string, React.ReactNode> = {
  "vending-and-automated-retail": <Store size={22} />,
  "ev-charger-maintenance": <Zap size={22} />,
  "lift-and-escalator": <ArrowUpToLine size={22} />,
  "hvac-refrigeration": <Wind size={22} />,
  "commercial-cleaning": <Sparkles size={22} />,
  "fire-safety-systems": <Flame size={22} />,
  "security-and-access": <Shield size={22} />,
  "solar-and-energy": <Sun size={22} />,
  "electrical-services": <Plug2 size={22} />,
  "plumbing-and-water": <Droplets size={22} />,
  "car-repair-services": <Car size={22} />,
};

const categories = categoriesData.map((cat) => ({
  ...cat,
  icon: iconMap[cat.slug] || <Store size={22} />,
}));

type CurrencyCode = "GBP" | "INR" | "USD" | "EUR" | "AED" | "SGD" | "AUD";

const currencyConfig: Record<
  CurrencyCode,
  { symbol: string; locale: string; defaultLoss: number; label: string }
> = {
  GBP: { symbol: "£", locale: "en-GB", defaultLoss: 40, label: "£" },
  INR: { symbol: "₹", locale: "en-IN", defaultLoss: 2000, label: "₹" },
  USD: { symbol: "$", locale: "en-US", defaultLoss: 50, label: "$" },
  EUR: { symbol: "€", locale: "de-DE", defaultLoss: 45, label: "€" },
  AED: { symbol: "د.إ", locale: "en-AE", defaultLoss: 180, label: "AED" },
  SGD: { symbol: "S$", locale: "en-SG", defaultLoss: 65, label: "S$" },
  AUD: { symbol: "A$", locale: "en-AU", defaultLoss: 75, label: "A$" },
};

export default function HomePage() {
  const router = useRouter();
  const [city, setCity] = useState("all");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const revealRefs = useRef<HTMLElement[]>([]);

  // ── Calculator state ──
  const [currency, setCurrency] = useState<CurrencyCode>("INR");
  const [calcAssets, setCalcAssets] = useState(100);
  const [calcFaults, setCalcFaults] = useState(1.5);
  const [calcDowntime, setCalcDowntime] = useState(3);
  const [calcLoss, setCalcLoss] = useState(currencyConfig.INR.defaultLoss);

  const monthlyCost = useMemo(() => {
    const total = calcAssets * calcFaults * calcDowntime * calcLoss;
    return new Intl.NumberFormat(currencyConfig[currency].locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(total);
  }, [calcAssets, calcFaults, calcDowntime, calcLoss, currency]);

  const handleCurrencyChange = (c: CurrencyCode) => {
    setCurrency(c);
    setCalcLoss(currencyConfig[c].defaultLoss);
  };

  // ── Lead form state ──
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadSummary, setLeadSummary] = useState("");
  const handleLeadSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const get = (k: string) => (fd.get(k)?.toString().trim() || "");
    const summary =
`New Relay demo request

Name: ${get("name")}
Email: ${get("email")}
Company: ${get("company")}
Phone / WhatsApp: ${get("phone") || "Not provided"}
Role: ${get("role") || "Not provided"}
Industry: ${get("industry")}
Approx. assets / service points: ${get("assets")}
Timeline: ${get("timeline") || "Not provided"}
Current process: ${get("current_process") || "Not provided"}
Biggest pain: ${get("pain") || "Not provided"}

Demo focus:
${get("message") || "Not provided"}`;
    setLeadSummary(summary);
    setLeadSubmitted(true);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    revealRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const addReveal = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  const handleCatClick = (slug: string) => {
    const citySlug = city === "all" ? "india" : (citySlugMap[city] || "india");
    router.push(`/${slug}/${citySlug}`);
  };

  const closeMobileMenu = () => {
    setMenuOpen(false);
    document.body.style.overflow = "";
  };

  // ── Reusable styles (theme-bound) ──
  const cardStyle: React.CSSProperties = {
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: 16,
    padding: 24,
  };
  const eyebrowStyle: React.CSSProperties = {
    display: "inline-block",
    fontSize: "0.75rem",
    color: "var(--accent)",
    background: "var(--accent-glow)",
    padding: "6px 12px",
    borderRadius: 6,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontWeight: 600,
    marginBottom: 16,
  };
  const kickerStyle: React.CSSProperties = {
    display: "inline-block",
    fontSize: "0.7rem",
    color: "var(--text-secondary)",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    fontWeight: 600,
    marginBottom: 8,
  };
  const sectionWrap: React.CSSProperties = { maxWidth: 1200, margin: "0 auto", padding: "0 24px" };

  return (
    <>
      {/* NAV */}
      <nav id="main-nav" className={scrolled ? "scrolled" : ""}>
        <a href="#top" className="nav-logo">
          <div className="nav-logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="#0a0f0d" strokeWidth="2.5" strokeLinecap="round">
              <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="16" y="16" width="3" height="3" rx="0.5" />
            </svg>
          </div>
          <span className="nav-logo-text">QResolve</span>
        </a>
        <ul className="nav-links">
          <li><a href="#how">How It Works</a></li>
          <li><a href="#solutions">Solutions</a></li>
          <li><a href="#categories">Categories</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#embedded-demo">Demo</a></li>
          <li><a href="https://relay.qresolve.com/login">Login</a></li>
          <li><a href="#lead-capture" className="nav-cta">Book Demo</a></li>
        </ul>
        <button
          className={`nav-hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => { setMenuOpen(!menuOpen); document.body.style.overflow = menuOpen ? "" : "hidden"; }}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <a href="#how" onClick={closeMobileMenu}>How It Works</a>
        <a href="#solutions" onClick={closeMobileMenu}>Solutions</a>
        <a href="#calculator" onClick={closeMobileMenu}>ROI Calculator</a>
        <a href="#features" onClick={closeMobileMenu}>Features</a>
        <a href="#categories" onClick={closeMobileMenu}>Categories</a>
        <a href="#pricing" onClick={closeMobileMenu}>Pricing</a>
        <a href="#embedded-demo" onClick={closeMobileMenu}>Demo</a>
        <a href="#directory" onClick={closeMobileMenu}>Directory</a>
        <a href="#about" onClick={closeMobileMenu}>About</a>
        <a href="https://relay.qresolve.com/login" onClick={closeMobileMenu}>Login</a>
        <a href="#lead-capture" className="mobile-cta" onClick={closeMobileMenu}>Book Demo</a>
      </div>

      {/* HERO */}
      <div className="hero" id="top">
        {/* Top: copy (left) + dashboard preview (right) */}
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="hero-badge"><span />Relay by QResolve</div>
            <h1>Every Physical Asset Needs a QR Code.</h1>
            <p className="hero-sub">
              Relay by QResolve transforms machines, buildings, facilities and service points into intelligent reporting systems. Users scan, faults get logged instantly, teams get notified, and managers get live operational visibility.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 32, position: "relative", zIndex: 1 }}>
              <a href="#lead-capture" className="btn btn-accent" style={{ padding: "14px 28px" }}>Book Demo</a>
              <a href="#embedded-demo" className="btn btn-outline" style={{ padding: "14px 28px" }}>
                <Play size={16} style={{ marginRight: 8 }} /> See Demo
              </a>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 24, position: "relative", zIndex: 1 }}>
              {["No app downloads", "Asset-level reporting", "Operational visibility"].map((p) => (
                <div key={p} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 999, fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }} />
                  {p}
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard preview */}
          <div className="hero-dashboard-shell" style={{ ...cardStyle, padding: 0, overflow: "hidden", position: "relative", zIndex: 1, animation: "fadeUp 0.6s ease 0.35s both" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", borderBottom: "1px solid var(--border)", background: "var(--bg-secondary)" }}>
              <div style={{ display: "flex", gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }} />
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--warning)" }} />
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--accent)" }} />
              </div>
              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginLeft: 8 }}>Relay Operations Console</span>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                {[
                  { label: "Asset", tag: "Live", value: "Vending Machine VM-042", color: "var(--text-primary)" },
                  { label: "Issue", tag: "Priority", value: "Cooling fault reported", color: "var(--warning)" },
                  { label: "Status", tag: "Assigned", value: "Technician assigned", color: "var(--accent)" },
                  { label: "SLA", tag: "Remaining", value: "2h 14m remaining", color: "var(--text-primary)" },
                ].map((s) => (
                  <div key={s.label} style={{ padding: 12, background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 10, textAlign: "left" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", color: "var(--text-secondary)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      <span>{s.label}</span><span style={{ color: "var(--accent)" }}>{s.tag}</span>
                    </div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600, color: s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: 14, background: "var(--accent-glow)", border: "1px solid var(--accent)", borderRadius: 10, textAlign: "left", marginBottom: 16 }}>
                <strong style={{ color: "var(--accent)", fontSize: "0.75rem", letterSpacing: "0.05em" }}>AI INSIGHT</strong>
                <p style={{ marginTop: 6, fontSize: "0.85rem", color: "var(--text-primary)", lineHeight: 1.5 }}>
                  Repeat cooling fault detected 5 times in 30 days. Prioritise refrigeration technician.
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                {[
                  { stat: "42", label: "Open tickets" },
                  { stat: "91%", label: "SLA compliance" },
                  { stat: "18", label: "Assets flagged" },
                ].map((m) => (
                  <div key={m.label} style={{ padding: 12, background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 10, textAlign: "center" }}>
                    <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--accent)" }}>{m.stat}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginTop: 4 }}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Search row */}
        <div style={{ marginTop: 56, position: "relative", zIndex: 1 }}>
          <HeroSearch />
        </div>

        <div className="audience-split">
          <a href="#categories" className="audience-card" style={{ position: "relative" }}>
            <div style={{ position: "absolute", top: 18, right: 18, fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, opacity: 0.75 }}>QResolve Directory</div>
            <div className="audience-label">I need a repair</div>
            <h3>Find a verified provider</h3>
            <p>Search by asset type and location. Compare providers on actual response times, resolution rates, and verified reviews.</p>
            <span className="audience-action">Browse categories <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg></span>
          </a>
          <a href="https://relay.qresolve.com/signup" className="audience-card" style={{ position: "relative" }}>
            <div style={{ position: "absolute", top: 18, right: 18, fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, opacity: 0.75 }}>QResolve Relay</div>
            <div className="audience-label">I&apos;m a service provider</div>
            <h3>Grow with Relay</h3>
            <p>Get a free directory listing. Upgrade to Relay for QR-based fault reporting, job tracking, and the verified badge that wins contracts.</p>
            <span className="audience-action">Explore Relay <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg></span>
          </a>
        </div>
      </div>

      <div className="divider"><div className="divider-line" /></div>

      {/* PROBLEM */}
      <section className="reveal" id="problem" ref={addReveal} style={{ ...sectionWrap, padding: "80px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span style={eyebrowStyle}>The operational gap</span>
          <h2 className="section-title" style={{ margin: "0 auto" }}>Maintenance still runs on WhatsApp, calls and guesswork.</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          {[
            { num: "01", title: "Lost fault reports", desc: "Issues get buried in chats, missed calls, inboxes and informal handovers." },
            { num: "02", title: "No asset-level history", desc: "Teams cannot see which machine, room, charger or service point keeps failing." },
            { num: "03", title: "Slow technician dispatch", desc: "Incomplete issue details delay diagnosis, assignment and resolution." },
            { num: "04", title: "No visibility for managers", desc: "Leadership lacks live status, SLA performance and failure-pattern intelligence." },
          ].map((p) => (
            <article key={p.num} style={{ ...cardStyle }}>
              <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--accent)", marginBottom: 12 }}>{p.num}</div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 600, marginBottom: 8 }}>{p.title}</h3>
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>{p.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="divider"><div className="divider-line" /></div>

      {/* HOW IT WORKS */}
      <section className="reveal" id="how" ref={addReveal} style={{ ...sectionWrap, padding: "80px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span style={eyebrowStyle}>How Relay works</span>
          <h2 className="section-title" style={{ margin: "0 auto" }}>From scan to resolution in three steps.</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {([
            { num: "01", icon: <ScanLine size={28} />, kicker: "Asset detected instantly", title: "Scan", desc: "The user scans the asset-specific QR code. Relay loads the correct asset, location, category and reporting flow — no app download and no manual asset entry.", mini: { label: "Asset", value: "Vending Machine VM-042", warn: false, success: false } },
            { num: "02", icon: <FileText size={28} />, kicker: "Structured ticket created", title: "Report", desc: "The user selects the issue, adds optional context or photo evidence, and submits the fault. Relay starts the SLA clock and notifies the right team.", mini: { label: "Issue", value: "Cooling fault reported", warn: true, success: false } },
            { num: "03", icon: <CheckCircle2 size={28} />, kicker: "Resolution intelligence captured", title: "Resolve", desc: "The technician updates the ticket through resolution. Managers get live visibility, asset-level history, SLA performance and analytics that reveal repeat issues.", mini: { label: "Status", value: "Technician assigned · SLA active", warn: false, success: true } },
          ]).map((step) => (
            <article key={step.num} style={{ ...cardStyle, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--accent)" }}>{step.num}</div>
                <div style={{ color: "var(--accent)" }}>{step.icon}</div>
              </div>
              <span style={kickerStyle}>{step.kicker}</span>
              <h3 style={{ fontSize: "1.4rem", fontWeight: 600, marginBottom: 12 }}>{step.title}</h3>
              <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.6, flex: 1 }}>{step.desc}</p>
              <div
                style={{
                  marginTop: 20,
                  padding: "12px 16px",
                  background: step.mini.warn ? "rgba(251, 191, 36, 0.08)" : step.mini.success ? "var(--accent-glow)" : "var(--bg-secondary)",
                  border: `1px solid ${step.mini.warn ? "var(--warning)" : step.mini.success ? "var(--accent)" : "var(--border)"}`,
                  borderRadius: 10,
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{step.mini.label}</span>
                <strong style={{ fontSize: "0.9rem", color: step.mini.warn ? "var(--warning)" : step.mini.success ? "var(--accent)" : "var(--text-primary)" }}>{step.mini.value}</strong>
              </div>
            </article>
          ))}
        </div>

        <div style={{
          marginTop: 48,
          padding: 32,
          background: "var(--bg-card)",
          border: "1px solid var(--accent)",
          borderRadius: 16,
          display: "flex",
          flexWrap: "wrap",
          gap: 24,
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div style={{ flex: "1 1 320px" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: 8 }}>No app downloads. No manual asset entry. No WhatsApp chaos.</h3>
            <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)" }}>
              See how Relay turns scans into structured reports and resolution workflows across different industries.
            </p>
          </div>
          <a href="/demo" className="btn btn-accent" style={{ padding: "12px 24px" }}>
            <Play size={16} style={{ marginRight: 8 }} /> See the Demo
          </a>
        </div>
      </section>

      <div className="divider"><div className="divider-line" /></div>

      {/* EMBEDDED DEMO */}
      <section className="reveal" id="embedded-demo" ref={addReveal} style={{ ...sectionWrap, padding: "80px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 32, alignItems: "end", marginBottom: 40 }}>
          <div>
            <span style={eyebrowStyle}>Interactive Demo</span>
            <h2 className="section-title" style={{ margin: 0 }}>See the Relay flow without leaving the page.</h2>
          </div>
          <p style={{ fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            The demo runs inline below. If your browser blocks the embed, open it in a new tab for the full experience.
          </p>
        </div>

        <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px", borderBottom: "1px solid var(--border)", background: "var(--bg-secondary)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ display: "flex", gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }} />
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--warning)" }} />
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--accent)" }} />
              </div>
              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginLeft: 8 }}>qresolve.com/demo · embedded preview</span>
            </div>
            <a href="/demo" target="_blank" rel="noopener" style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none" }}>
              Open full demo ↗
            </a>
          </div>
          <div style={{ position: "relative", aspectRatio: "16 / 10", background: "var(--bg-primary)" }}>
            <iframe
              src="/demo"
              title="QResolve Relay Demo"
              loading="lazy"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
              referrerPolicy="strict-origin-when-cross-origin"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
            />
          </div>
        </div>
      </section>

      <div className="divider"><div className="divider-line" /></div>

      {/* SOLUTIONS / INDUSTRIES */}
      <section className="reveal" id="solutions" ref={addReveal} style={{ ...sectionWrap, padding: "80px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span style={eyebrowStyle}>Solutions</span>
          <h2 className="section-title" style={{ margin: "0 auto" }}>Built for asset-heavy operations.</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {[
            { icon: <Store size={28} />, badge: "Best first wedge", title: "Vending Machines", desc: "Capture cooling failures, stock issues, payment faults and machine outages instantly, with every report tied to a specific machine and location.", useCase: "QR reporting on each vending machine to reduce lost revenue from unreported downtime." },
            { icon: <Zap size={28} />, badge: "Network uptime", title: "EV Chargers", desc: "Let drivers report charging errors, connector damage or payment issues directly at the charging point.", useCase: "Asset-specific fault logs for every charger across a multi-site charging network." },
            { icon: <Building2 size={28} />, badge: "Tenant experience", title: "Commercial Buildings", desc: "Turn lifts, washrooms, HVAC units, access points and shared facilities into reportable endpoints.", useCase: "Facility teams get location-specific tickets instead of vague tenant complaints." },
            { icon: <Hotel size={28} />, badge: "Guest operations", title: "Hotels", desc: "Enable guests and staff to report room, equipment and service-point issues in seconds.", useCase: "QR codes in rooms and shared areas route issues to housekeeping or maintenance." },
            { icon: <Factory size={28} />, badge: "Shop-floor visibility", title: "Manufacturing", desc: "Connect production assets, safety points and machines to structured fault workflows.", useCase: "Operators report machine faults without leaving the production environment." },
            { icon: <Briefcase size={28} />, badge: "Multi-site control", title: "Facility Management", desc: "Manage issue intake, technician assignment, escalation and SLA reporting across client sites from one operating layer.", useCase: "Standardised fault reporting across sites, vendors and maintenance teams." },
          ].map((s) => (
            <article key={s.title} style={{ ...cardStyle, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ color: "var(--accent)" }}>{s.icon}</div>
                <span style={{ fontSize: "0.7rem", color: "var(--accent)", background: "var(--accent-glow)", padding: "4px 10px", borderRadius: 999, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{s.badge}</span>
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: 8 }}>{s.title}</h3>
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.55, marginBottom: 16, flex: 1 }}>{s.desc}</p>
              <div style={{ padding: "12px 14px", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 10, fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                <span style={{ display: "block", fontSize: "0.7rem", color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4, fontWeight: 600 }}>Use case</span>
                {s.useCase}
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="divider"><div className="divider-line" /></div>

      {/* DOWNTIME CALCULATOR */}
      <section className="reveal" id="calculator" ref={addReveal} style={{ ...sectionWrap, padding: "80px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <span style={eyebrowStyle}>Downtime calculator</span>
          <h2 className="section-title" style={{ margin: "0 auto" }}>See how much downtime Relay could help you recover.</h2>
          <p className="section-desc" style={{ margin: "16px auto 24px", maxWidth: 720 }}>
            Estimate the monthly operational cost created by faults, delays and downtime across your asset base.
          </p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Currency</span>
            <div style={{ display: "inline-flex", gap: 6, padding: 4, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 999, flexWrap: "wrap" }}>
              {(Object.keys(currencyConfig) as CurrencyCode[]).map((c) => (
                <button
                  key={c}
                  onClick={() => handleCurrencyChange(c)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 999,
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    border: "none",
                    background: currency === c ? "var(--accent)" : "transparent",
                    color: currency === c ? "var(--bg-primary)" : "var(--text-secondary)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {c} {currencyConfig[c].symbol}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
          <div style={{ ...cardStyle, padding: 28 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { label: "Number of assets", value: calcAssets, set: setCalcAssets, step: 1, min: 0 },
                { label: "Avg. faults per asset / month", value: calcFaults, set: setCalcFaults, step: 0.1, min: 0 },
                { label: "Avg. downtime hours per fault", value: calcDowntime, set: setCalcDowntime, step: 0.1, min: 0 },
                { label: `Loss per downtime hour (${currencyConfig[currency].label})`, value: calcLoss, set: setCalcLoss, step: 1, min: 0 },
              ].map((f) => (
                <div key={f.label} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{f.label}</label>
                  <input
                    type="number"
                    className="no-spinner"
                    min={f.min}
                    step={f.step}
                    value={f.value}
                    onChange={(e) => f.set(Number(e.target.value) || 0)}
                    style={{
                      padding: "10px 12px",
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      color: "var(--text-primary)",
                      fontSize: "0.95rem",
                      outline: "none",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div style={{ ...cardStyle, padding: 28, background: "var(--accent-glow)", border: "1px solid var(--accent)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 24 }}>
            <div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>
                Estimated monthly downtime cost
              </div>
              <div style={{ fontSize: "3rem", fontWeight: 700, color: "var(--accent)", lineHeight: 1.1, marginBottom: 16 }}>
                {monthlyCost}
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                Formula: assets × faults per asset × downtime hours × loss per hour.
              </p>
            </div>
            <a href="#lead-capture" className="btn btn-accent" style={{ justifyContent: "center" }}>
              See how much Relay could help you recover
            </a>
          </div>
        </div>
      </section>

      <div className="divider"><div className="divider-line" /></div>

      {/* OPERATOR PROOF ROW */}
      <section style={{ ...sectionWrap, padding: "40px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          {[
            { who: "For operators", what: "Less chaos, faster resolution, cleaner accountability." },
            { who: "For service providers", what: "Better proof, better trust, better lead conversion." },
            { who: "For management", what: "Live asset intelligence instead of fragmented conversations." },
          ].map((r) => (
            <div key={r.who} style={{ ...cardStyle, padding: 20 }}>
              <span style={{ display: "block", fontSize: "0.75rem", color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8, fontWeight: 600 }}>{r.who}</span>
              <strong style={{ fontSize: "1rem", color: "var(--text-primary)", lineHeight: 1.4 }}>{r.what}</strong>
            </div>
          ))}
        </div>
      </section>

      <div className="divider"><div className="divider-line" /></div>

      {/* FEATURES */}
      <section className="reveal" id="features" ref={addReveal} style={{ ...sectionWrap, padding: "80px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span style={eyebrowStyle}>Enterprise features</span>
          <h2 className="section-title" style={{ margin: "0 auto" }}>Designed for operational control.</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          {[
            { icon: <ScanLine size={24} />, kicker: "Core workflow", title: "QR-based reporting", desc: "Every physical asset gets a dedicated reporting endpoint. Users scan, Relay identifies the asset, and the fault is logged without manual asset entry.", highlight: true },
            { icon: <Clock size={24} />, kicker: "Accountability", title: "SLA tracking", desc: "Monitor response windows, overdue tickets and high-priority issues before they become complaints." },
            { icon: <MapPin size={24} />, kicker: "Scale", title: "Multi-location management", desc: "Manage sites, regions, asset groups and teams from one operational layer." },
            { icon: <Users size={24} />, kicker: "Dispatch", title: "Technician assignment", desc: "Assign each fault to the right internal team, contractor or service partner." },
            { icon: <FileSearch size={24} />, kicker: "Asset memory", title: "Fault history", desc: "Build a searchable record of failures by asset, location, category and issue type." },
            { icon: <BarChart3 size={24} />, kicker: "Visibility", title: "Analytics dashboard", desc: "Track issue volume, resolution trends, SLA risk and recurring operational patterns." },
            { icon: <Shield size={24} />, kicker: "Control", title: "Role-based access", desc: "Control who can view, assign, resolve, escalate and analyse operational data." },
            { icon: <Workflow size={24} />, kicker: "Escalation", title: "Smart workflows", desc: "Route critical, recurring or overdue issues to the right decision-maker automatically." },
            { icon: <FileText size={24} />, kicker: "Evidence", title: "Audit trails", desc: "Preserve timestamps, status changes and accountability from report to resolution." },
            { icon: <Brain size={24} />, kicker: "Intelligence", title: "AI-powered insights", desc: "Surface repeat faults, likely causes, SLA risks and asset patterns before they become expensive.", highlight: true },
          ].map((f) => (
            <article
              key={f.title}
              style={{
                ...cardStyle,
                background: f.highlight ? "var(--accent-glow)" : "var(--bg-card)",
                border: f.highlight ? "1px solid var(--accent)" : "1px solid var(--border)",
              }}
            >
              <div style={{ color: "var(--accent)", marginBottom: 14 }}>{f.icon}</div>
              <span style={kickerStyle}>{f.kicker}</span>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 600, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>{f.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="divider"><div className="divider-line" /></div>

      {/* DIRECTORY PREVIEW */}
      <section className="reveal" id="directory" ref={addReveal} style={{ ...sectionWrap, padding: "80px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 32, alignItems: "end", marginBottom: 40 }}>
          <div>
            <span style={eyebrowStyle}>QResolve Directory</span>
            <h2 className="section-title" style={{ margin: 0 }}>A live directory layer for finding maintenance partners.</h2>
          </div>
          <p style={{ fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            The QResolve Directory gives asset operators a discovery layer for relevant service providers. Relay then gives those providers and operators the operational system to manage fault reports, SLAs and maintenance evidence.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1fr)", gap: 24 }}>
          <div style={{ ...cardStyle, padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <div>
                <span style={kickerStyle}>Directory preview</span>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600 }}>Discover providers by industry, asset type and location.</h3>
              </div>
              <span style={{ fontSize: "0.75rem", color: "var(--accent)", background: "var(--accent-glow)", padding: "6px 12px", borderRadius: 999, fontWeight: 600 }}>Verified only</span>
            </div>

            <div style={{ padding: "12px 16px", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 10, marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Search</span>
              <strong style={{ fontSize: "0.9rem" }}>Vending maintenance · Bangalore · SLA support</strong>
            </div>

            <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
              <a href="#categories" className="btn btn-accent" style={{ padding: "10px 18px", fontSize: "0.9rem" }}>Open QResolve Directory</a>
              <a href="https://relay.qresolve.com/login" className="btn btn-outline" style={{ padding: "10px 18px", fontSize: "0.9rem" }}>Launch Relay App</a>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { avatar: "VM", title: "Vending Maintenance Partner", badge: "Verified", featured: true, desc: "QR fault reporting enabled · SLA history available · Multi-site support", tags: ["Cooling faults", "Payment issues", "Restocking"] },
                { avatar: "FM", title: "Facilities Response Team", badge: "Relay-ready", featured: false, desc: "Commercial building maintenance with structured ticketing and escalation workflows.", tags: ["HVAC", "Washrooms", "Common areas"] },
                { avatar: "EV", title: "EV Charger Support Operator", badge: "Listed", featured: false, desc: "Connector faults, payment failures and charger status workflows across locations.", tags: ["Charging faults", "Connector damage", "Network support"] },
              ].map((p) => (
                <article key={p.avatar} style={{ padding: 16, background: p.featured ? "var(--accent-glow)" : "var(--bg-secondary)", border: `1px solid ${p.featured ? "var(--accent)" : "var(--border)"}`, borderRadius: 12, display: "flex", gap: 16 }}>
                  <div style={{ flexShrink: 0, width: 44, height: 44, borderRadius: 10, background: "var(--accent)", color: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.9rem" }}>
                    {p.avatar}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                      <h4 style={{ fontSize: "0.95rem", fontWeight: 600 }}>{p.title}</h4>
                      <span style={{ fontSize: "0.65rem", color: p.featured ? "var(--accent)" : "var(--text-secondary)", border: `1px solid ${p.featured ? "var(--accent)" : "var(--border)"}`, padding: "2px 8px", borderRadius: 999, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{p.badge}</span>
                    </div>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: 8, lineHeight: 1.4 }}>{p.desc}</p>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {p.tags.map((t) => (
                        <span key={t} style={{ fontSize: "0.7rem", padding: "2px 8px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 999, color: "var(--text-secondary)" }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
            {[
              { icon: <Users size={22} />, title: "For asset operators", desc: "Find providers who understand your asset class, geography and operational requirements." },
              { icon: <Shield size={22} />, title: "Verified provider profiles", desc: "Relay usage supports richer profiles, trust markers and performance-based verification." },
              { icon: <BarChart3 size={22} />, title: "Lead generation engine", desc: "Programmatic industry and location pages capture search demand and route qualified leads." },
              { icon: <Workflow size={22} />, title: "Directory feeds Relay", desc: "Leads create provider demand. Providers adopt Relay. Relay usage creates verification. Verification improves directory trust.", dark: true },
            ].map((v) => (
              <article key={v.title} style={{ ...cardStyle, padding: 22, background: v.dark ? "var(--bg-secondary)" : "var(--bg-card)" }}>
                <div style={{ color: "var(--accent)", marginBottom: 12 }}>{v.icon}</div>
                <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 6 }}>{v.title}</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>{v.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="divider"><div className="divider-line" /></div>

      {/* CATEGORIES (functional, preserved) */}
      <section className="categories reveal" id="categories" ref={addReveal} style={{ ...sectionWrap, padding: "80px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span style={eyebrowStyle}>Service Categories</span>
          <h2 className="section-title" style={{ margin: "0 auto" }}>Find a specialist for every asset</h2>
        </div>

        <div style={{ maxWidth: 900, margin: "0 auto 48px", display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
          {["all", "delhi", "mumbai", "bangalore", "hyderabad", "pune", "kolkata", "chennai", "ahmedabad"].map((c) => (
            <button
              key={c}
              onClick={() => setCity(c)}
              style={{
                padding: "8px 16px",
                border: city === c ? "1px solid var(--accent)" : "1px solid var(--border)",
                borderRadius: 999,
                background: city === c ? "var(--accent-glow)" : "transparent",
                color: city === c ? "var(--accent)" : "var(--text-primary)",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: 500,
              }}
            >
              {c === "all" ? "All India" : c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 20 }}>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => handleCatClick(cat.slug)}
              style={{
                padding: 24,
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                cursor: "pointer",
                textAlign: "center",
                color: "inherit",
                fontSize: "inherit",
                fontFamily: "inherit",
              }}
            >
              <div style={{ marginBottom: 12, display: "flex", justifyContent: "center", color: "var(--accent)" }}>
                {cat.icon}
              </div>
              <h4 style={{ fontSize: "0.95rem", fontWeight: 500 }}>{cat.title}</h4>
            </button>
          ))}
        </div>
      </section>

      <div className="divider"><div className="divider-line" /></div>

      {/* ECOSYSTEM / FLYWHEEL */}
      <section className="reveal" id="ecosystem" ref={addReveal} style={{ ...sectionWrap, padding: "80px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 32, alignItems: "end", marginBottom: 48 }}>
          <div>
            <span style={eyebrowStyle}>Strategic moat</span>
            <h2 className="section-title" style={{ margin: 0 }}>From reporting tool to verified maintenance ecosystem.</h2>
          </div>
          <p style={{ fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            The live Directory captures market demand, while Relay captures operational proof. Together, they create a loop where discovery, trust and workflow data reinforce each other.
          </p>
        </div>

        <div style={{ ...cardStyle, padding: 32, marginBottom: 32 }}>
          <span style={kickerStyle}>The compounding advantage</span>
          <h3 style={{ fontSize: "1.4rem", fontWeight: 600, marginBottom: 12, color: "var(--accent)" }}>
            Usage becomes proof. Proof becomes trust. Trust becomes distribution.
          </h3>
          <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Every fault report, asset record, SLA update and resolution event strengthens QResolve&apos;s ability to identify reliable operators and service providers. That operational evidence becomes the foundation for verified profiles, better rankings and higher-quality inbound leads.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginTop: 24 }}>
            {[
              { title: "Directory", sub: "Demand capture" },
              { title: "Relay", sub: "Operational data" },
              { title: "Verified", sub: "Trust layer" },
            ].map((m) => (
              <div key={m.title} style={{ padding: 14, background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 10, textAlign: "center" }}>
                <strong style={{ display: "block", color: "var(--accent)", fontSize: "1rem", marginBottom: 4 }}>{m.title}</strong>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{m.sub}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
          {[
            { num: "01", title: "Directory generates leads", desc: "Operators discover maintenance providers through QResolve's directory and industry pages." },
            { num: "02", title: "Providers adopt Relay", desc: "Providers use Relay to manage live fault workflows, QR reporting, SLA tracking and asset history." },
            { num: "03", title: "Performance creates verification", desc: "Verified status is powered by response speed, resolution consistency and SLA performance." },
            { num: "04", title: "Verification improves distribution", desc: "Verified providers rank better, receive more leads and have a stronger reason to keep using Relay." },
          ].map((step) => (
            <div key={step.num} style={{ ...cardStyle, padding: 20 }}>
              <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "var(--accent)", marginBottom: 10 }}>{step.num}</div>
              <h4 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 8 }}>{step.title}</h4>
              <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>{step.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 32, fontSize: "0.9rem", color: "var(--text-secondary)" }}>
          ↻ Cycle repeats — each revolution makes both products more valuable
        </div>
      </section>

      <div className="divider"><div className="divider-line" /></div>

      {/* AI INSIGHTS */}
      <section className="reveal" id="ai" ref={addReveal} style={{ ...sectionWrap, padding: "80px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span style={eyebrowStyle}>Operational AI</span>
          <h2 className="section-title" style={{ margin: "0 auto" }}>AI that explains what is breaking before it becomes expensive.</h2>
          <p className="section-desc" style={{ margin: "16px auto 0", maxWidth: 720 }}>
            Relay avoids generic AI noise. It focuses on specific patterns that help operations teams act faster.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {[
            { tag: "Repeat fault", title: "“Machine 42 has reported cooling faults 5 times in 30 days.”", desc: "Detect recurring asset-level issues before they become chronic revenue leaks." },
            { tag: "Likely cause", title: "“Likely compressor issue. Prioritise refrigeration technician.”", desc: "Route tickets with better context so the right person is assigned first." },
            { tag: "Location pattern", title: "“Repeat issue detected across 3 assets in the same location.”", desc: "Move from isolated tickets to site-level operational diagnosis." },
          ].map((i) => (
            <article key={i.tag} style={{ ...cardStyle }}>
              <span style={{ display: "inline-block", fontSize: "0.7rem", color: "var(--accent)", background: "var(--accent-glow)", padding: "4px 10px", borderRadius: 999, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{i.tag}</span>
              <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 12, lineHeight: 1.4, color: "var(--text-primary)" }}>{i.title}</h3>
              <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>{i.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="divider"><div className="divider-line" /></div>

      {/* BEFORE / AFTER COMPARISON */}
      <section className="reveal" id="comparison" ref={addReveal} style={{ ...sectionWrap, padding: "80px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span style={eyebrowStyle}>Operational shift</span>
          <h2 className="section-title" style={{ margin: "0 auto" }}>Before Relay vs After Relay.</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          <article style={{ ...cardStyle, padding: 32 }}>
            <h3 style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "1.3rem", fontWeight: 600, marginBottom: 20, color: "var(--text-primary)" }}>
              <XCircle size={22} style={{ color: "#ef4444" }} />
              Before Relay
            </h3>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {["Faults buried in WhatsApp", "No ticket history", "Delayed dispatch", "No SLA visibility"].map((item) => (
                <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: "0.95rem", color: "var(--text-secondary)" }}>
                  <XCircle size={16} style={{ color: "#ef4444", flexShrink: 0, marginTop: 3 }} />
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article style={{ ...cardStyle, padding: 32, background: "var(--accent-glow)", border: "1px solid var(--accent)" }}>
            <h3 style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "1.3rem", fontWeight: 600, marginBottom: 20, color: "var(--accent)" }}>
              <CheckCircle2 size={22} />
              After Relay
            </h3>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {["Every issue tied to an asset", "Live status tracking", "Faster assignment", "Analytics by asset, location and fault type"].map((item) => (
                <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: "0.95rem", color: "var(--text-primary)" }}>
                  <CheckCircle2 size={16} style={{ color: "var(--accent)", flexShrink: 0, marginTop: 3 }} />
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <div className="divider"><div className="divider-line" /></div>

      {/* LEAD CAPTURE */}
      <section className="reveal" id="lead-capture" ref={addReveal} style={{ ...sectionWrap, padding: "80px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 32 }}>
          {/* Left: copy + mini-dashboard */}
          <div style={{ ...cardStyle, padding: 32 }}>
            <span style={eyebrowStyle}>Demo funnel</span>
            <h2 className="section-title" style={{ margin: "0 0 16px 0", textAlign: "left", fontSize: "2rem" }}>Book your pilot demo.</h2>
            <p style={{ fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 24 }}>
              Relay is an operational system, so the lead form qualifies asset count, industry, urgency, current reporting process and the buyer&apos;s maintenance pain before the first conversation.
            </p>

            <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, marginBottom: 24 }}>
              {[
                { label: "Buyer type", value: "Facility / Operations / Asset Owner" },
                { label: "Pilot path", value: "One site → one asset class → scale" },
                { label: "Primary trigger", value: "Downtime, SLA leakage, repeat faults" },
              ].map((r, idx, arr) => (
                <div key={r.label} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: idx < arr.length - 1 ? "1px solid var(--border)" : "none", fontSize: "0.88rem", flexWrap: "wrap" }}>
                  <strong style={{ color: "var(--text-primary)" }}>{r.label}</strong>
                  <span style={{ color: "var(--text-secondary)", textAlign: "right" }}>{r.value}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              {[
                { b: "Better sales calls", p: "Every submitted lead arrives with operational context, making follow-up sharper and more consultative." },
                { b: "Cleaner pilot qualification", p: "Asset count, industry and urgency help separate serious B2B prospects from low-intent enquiries." },
                { b: "Structured maintenance signal", p: "Captures the operational pain so the first conversation moves straight to pilot scoping." },
              ].map((x) => (
                <div key={x.b} style={{ padding: 14, background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 10 }}>
                  <strong style={{ fontSize: "0.9rem", color: "var(--accent)" }}>{x.b}</strong>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: 4, lineHeight: 1.45 }}>{x.p}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div style={{ ...cardStyle, padding: 32 }}>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 600, marginBottom: 8 }}>Send a qualified Relay enquiry</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: 20, lineHeight: 1.5 }}>
              Share your asset environment and maintenance workflow.
            </p>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
              <a href="#embedded-demo" style={{ fontSize: "0.78rem", padding: "6px 12px", background: "var(--accent-glow)", color: "var(--accent)", borderRadius: 999, textDecoration: "none", fontWeight: 600 }}>
                Prefer the direct route? See the demo flow →
              </a>
            </div>

            {leadSubmitted ? (
              <div style={{ padding: 24, background: "var(--accent-glow)", border: "1px solid var(--accent)", borderRadius: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <CheckCircle2 size={20} style={{ color: "var(--accent)" }} />
                  <strong style={{ color: "var(--accent)" }}>Enquiry captured</strong>
                </div>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: 16 }}>
                  Thanks — the QResolve team will reach out to scope your pilot. Summary below:
                </p>
                <pre style={{ whiteSpace: "pre-wrap", fontSize: "0.78rem", color: "var(--text-secondary)", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 8, padding: 14, fontFamily: "monospace", overflow: "auto", maxHeight: 320 }}>
                  {leadSummary}
                </pre>
                <button
                  onClick={() => { setLeadSubmitted(false); setLeadSummary(""); }}
                  className="btn btn-outline"
                  style={{ marginTop: 16, padding: "10px 18px", fontSize: "0.88rem" }}
                >
                  Submit another
                </button>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                {/* Group 1: Contact */}
                <div className="lf-fieldset">
                  <div className="lf-fieldset-title">Contact</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
                    <LeadField label="Full name" name="name" required placeholder="Your name" autoComplete="name" />
                    <LeadField label="Work email" name="email" type="email" required placeholder="name@company.com" autoComplete="email" />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
                    <LeadField label="Company" name="company" required placeholder="Company name" autoComplete="organization" />
                    <LeadField label="Phone / WhatsApp" name="phone" type="tel" placeholder="+91 / +44..." autoComplete="tel" />
                  </div>
                  <LeadSelect label="Your role" name="role" placeholder="What's your role?" options={["Founder / Owner", "Operations Head", "Facility Manager", "Maintenance Manager", "Property Manager", "Franchise / Network Manager", "Other"]} />
                </div>

                {/* Group 2: Operations */}
                <div className="lf-fieldset">
                  <div className="lf-fieldset-title">Operations</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
                    <LeadSelect label="Industry" name="industry" required placeholder="Pick your industry" options={["Vending Machines", "EV Charging", "Commercial Property", "Hotels / Hospitality", "Manufacturing / Industrial", "Facility Management", "Franchise / Multi-site Operations", "Other"]} />
                    <LeadSelect label="Approx. assets" name="assets" required placeholder="How many assets?" options={["1–25", "26–100", "101–500", "501–1,000", "1,000+"]} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
                    <LeadSelect label="Timeline" name="timeline" placeholder="When do you need it?" options={["Exploring now", "Need a pilot this month", "Need a solution this quarter", "Planning for later"]} />
                    <LeadSelect label="Current reporting process" name="current_process" placeholder="How are faults tracked?" options={["WhatsApp / phone calls", "Email inbox", "Spreadsheet / manual tracker", "Existing ticketing system", "No structured process", "Other"]} />
                  </div>
                  <LeadSelect label="Biggest operational pain" name="pain" placeholder="What hurts most right now?" options={["Lost fault reports", "Slow technician dispatch", "No asset-level history", "No SLA visibility", "Repeat faults", "Multi-location chaos"]} />
                </div>

                {/* Group 3: Focus */}
                <div className="lf-fieldset">
                  <div className="lf-fieldset-title">Demo focus</div>
                  <div className="lf-group">
                    <label htmlFor="lf-message" className="lf-label">What should the demo focus on?</label>
                    <textarea
                      id="lf-message"
                      name="message"
                      rows={4}
                      placeholder="Example: We operate 200 vending machines and need QR-based issue intake, technician assignment, SLA tracking and repeat cooling fault visibility."
                      className="lf-control lf-textarea"
                    />
                  </div>
                </div>

                {/* Consent */}
                <label className="lf-checkbox-wrap">
                  <input type="checkbox" required className="lf-checkbox" />
                  <span className="lf-checkbox-text">
                    I agree to be contacted by QResolve about Relay and related operational maintenance workflows.
                    <small>No spam. This is for demo follow-up and pilot discussion only.</small>
                  </span>
                </label>

                <div className="lf-submit-row">
                  <button type="submit" className="lf-submit">
                    Request Pilot Demo
                    <ChevronRight size={18} />
                  </button>
                  <a href="#embedded-demo" className="lf-link">See demo flow →</a>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      <div className="divider"><div className="divider-line" /></div>

      {/* PRICING (preserved) */}
      <section className="pricing reveal" id="pricing" ref={addReveal} style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <h2 className="section-title" style={{ margin: "0 auto" }}>Simple plans. No hidden costs.</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {[
            {
              name: "Free Listing",
              price: "₹0",
              subtext: "/forever",
              description: "Get found by facility managers, coworking spaces, and asset owners actively searching for maintenance providers in your city.",
              features: ["Category & city placement", "Company profile with service details", "Direct repair requests from asset owners", "Customer reviews & ratings", "\"Claim Your Profile\" badge"],
              cta: "Claim Your Free Profile",
              href: "https://relay.qresolve.com/signup"
            },
            {
              name: "Relay Starter",
              price: "₹4,999",
              subtext: "/month",
              description: "One missed message = one lost client. Relay gives every fault report a ticket, every ticket a technician, and every resolution a timestamp your clients can verify.",
              features: ["QR-based fault reporting (no app, no login — anyone can report)", "Operations dashboard with triage & prioritisation", "One-tap technician dispatch", "Immutable audit trail (tamper-proof resolution history)", "\"Verified by Relay\" trust badge on QResolve listing", "Up to 100 managed assets"],
              cta: "Start 14-Day Free Trial",
              href: "https://relay.qresolve.com/signup"
            },
            {
              name: "Relay Pro",
              price: "₹12,999",
              subtext: "/month",
              description: "Pro turns your fault data into the competitive advantage that wins renewals and new contracts. Built for providers managing across multiple clients, cities, and verticals.",
              features: ["Everything in Starter", "Unlimited assets & multi-city operations", "Procurement Intelligence reports (predict part failures before they happen)", "Vendor Reliability scoring (prove SLA performance, not just promise it)", "Priority lead placement on QResolve directory", "Dedicated onboarding support"],
              cta: "Start 14-Day Free Trial",
              href: "https://relay.qresolve.com/signup",
              featured: true
            },
          ].map((plan, i) => (
            <div
              key={i}
              className={plan.featured ? "pricing-featured-scale" : ""}
              style={{
                padding: 32,
                background: "var(--bg-card)",
                border: plan.featured ? "2px solid var(--accent)" : "1px solid var(--border)",
                borderRadius: 16,
                display: "flex",
                flexDirection: "column",
                position: "relative",
                transform: plan.featured ? "scale(1.05)" : "scale(1)",
              }}
            >
              {plan.featured && (
                <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "var(--accent)", color: "#000", padding: "4px 12px", borderRadius: 4, fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", whiteSpace: "nowrap" }}>Recommended</div>
              )}
              <h3 style={{ fontSize: "1.3rem", fontWeight: 600, marginBottom: 8 }}>{plan.name}</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: 16 }}>{plan.description}</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 24 }}>
                <span style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--text-primary)" }}>{plan.price}</span>
                {plan.subtext && <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{plan.subtext}</span>}
              </div>
              <ul style={{ listStyle: "none", marginBottom: 28, flex: 1 }}>
                {plan.features.map((f, j) => (
                  <li key={j} style={{ marginBottom: 12, display: "flex", gap: 8, fontSize: "0.9rem", color: "var(--text-primary)" }}>
                    <ChevronRight size={16} style={{ color: "var(--accent)", flexShrink: 0, marginTop: 2 }} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a href={plan.href} className="btn btn-accent" style={{ width: "100%", justifyContent: "center" }}>
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      <div className="divider"><div className="divider-line" /></div>

      {/* DECISION SECTION */}
      <section style={{ ...sectionWrap, padding: "60px 24px" }}>
        <div style={{ ...cardStyle, padding: 48, textAlign: "center" }}>
          <span style={eyebrowStyle}>Why now</span>
          <h2 className="section-title" style={{ margin: "0 auto 16px" }}>Every unreported fault is a hidden operating cost.</h2>
          <p style={{ fontSize: "1rem", color: "var(--text-secondary)", maxWidth: 700, margin: "0 auto 32px", lineHeight: 1.6 }}>
            WhatsApp, phone calls and spreadsheets are not maintenance systems. Relay gives your asset network a reporting layer that is fast enough for users, structured enough for teams, and intelligent enough for management.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 32, textAlign: "left" }}>
            {[
              { num: "01", title: "Start with one site or asset class", desc: "Deploy QR reporting where downtime hurts most." },
              { num: "02", title: "Prove the workflow quickly", desc: "Track fault volume, response time and repeat issues." },
              { num: "03", title: "Scale into the operating layer", desc: "Expand across locations, providers and asset groups." },
            ].map((d) => (
              <div key={d.num} style={{ padding: 20, background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 12 }}>
                <span style={{ fontSize: "0.85rem", color: "var(--accent)", fontWeight: 700 }}>{d.num}</span>
                <strong style={{ display: "block", fontSize: "1rem", margin: "6px 0 8px" }}>{d.title}</strong>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>{d.desc}</p>
              </div>
            ))}
          </div>
          <a href="#lead-capture" className="btn btn-accent" style={{ padding: "14px 32px" }}>Book Demo</a>
        </div>
      </section>

      <div className="divider"><div className="divider-line" /></div>

      {/* ABOUT (preserved) */}
      <section className="about reveal" id="about" ref={addReveal} style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px" }}>
        <div className="about-grid">
          <div>
            <h2 className="section-title" style={{ margin: "0 0 24px 0", textAlign: "left" }}>Built for India&apos;s maintenance ecosystem</h2>
            <p style={{ fontSize: "1rem", lineHeight: 1.6, color: "var(--text-secondary)", marginBottom: 16 }}>
              QResolve was founded with a simple observation: India&apos;s ₹4 lakh crore maintenance market operates almost entirely on WhatsApp, spreadsheets, and trust. No data. No accountability. No way to prove who&apos;s actually good at their job.
            </p>
            <p style={{ fontSize: "1rem", lineHeight: 1.6, color: "var(--text-secondary)" }}>
              We&apos;re building the infrastructure layer that turns maintenance from a mystery into a data-backed science. Every scan creates a timestamp. Every dispatch creates a log. Every resolution creates proof.
            </p>
          </div>
          <div className="about-stats-grid">
            {[
              { stat: "11", label: "Service categories" },
              { stat: "2", label: "Products, 1 flywheel" },
              { stat: "Phase 3", label: "AI — Live" },
            ].map((item, i) => (
              <div key={i} style={{ padding: 20, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, textAlign: "center" }}>
                <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "var(--accent)", marginBottom: 8 }}>{item.stat}</div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider"><div className="divider-line" /></div>

      {/* FINAL CTA */}
      <section style={{ ...sectionWrap, padding: "80px 24px", textAlign: "center" }}>
        <span style={eyebrowStyle}>Start with one workflow</span>
        <h2 className="section-title" style={{ margin: "0 auto 16px" }}>Turn every asset into a reporting endpoint.</h2>
        <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", maxWidth: 680, margin: "0 auto 32px", lineHeight: 1.6 }}>
          Start with one site, one asset group, or one maintenance workflow. Scale into a full operational intelligence layer.
        </p>
        <a href="#lead-capture" className="btn btn-accent" style={{ padding: "14px 32px" }}>Book Demo</a>
      </section>

      {/* FOOTER */}
      <footer className="footer" style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px 40px" }}>
          <div className="footer-grid">
            <div className="footer-brand">
              <span className="footer-brand-name">QResolve</span>
              <p className="footer-brand-desc">
                India&apos;s first maintenance provider directory ranked by verified performance data. QR-powered fault reporting that keeps buildings running.
              </p>
            </div>

            <div>
              <h4 className="footer-col-title">Product</h4>
              <ul className="footer-links">
                <li><a href="#directory">Directory</a></li>
                <li><a href="#how">Relay OS</a></li>
                <li><a href="#ai">AI Insights</a></li>
                <li><a href="#features">Features</a></li>
              </ul>
            </div>

            <div>
              <h4 className="footer-col-title">Solutions</h4>
              <ul className="footer-links">
                <li><a href="#solutions">Industries</a></li>
                <li><a href="#calculator">ROI Calculator</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#lead-capture">Book Demo</a></li>
              </ul>
            </div>

            <div>
              <h4 className="footer-col-title">Company</h4>
              <ul className="footer-links">
                <li><a href="#about">Our Story</a></li>
                <li><a href="mailto:team@qresolve.com">Contact</a></li>
                <li><a href="https://www.linkedin.com/company/112680946/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                <li><a href="#privacy">Privacy Policy</a></li>
                <li><a href="#terms">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 24, textAlign: "center", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            © 2026 QResolve — Q-Resolve Analytics Private Limited
          </div>
        </div>
      </footer>
    </>
  );
}

// ── Form helpers ──
function LeadField({ label, name, type = "text", required, placeholder, autoComplete }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string; autoComplete?: string }) {
  const cleanLabel = label.replace(/\s*\*$/, "");
  return (
    <div className="lf-group">
      <label htmlFor={`lf-${name}`} className="lf-label">
        {cleanLabel}{required && <span className="req">*</span>}
      </label>
      <input
        id={`lf-${name}`}
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="lf-control"
      />
    </div>
  );
}

function LeadSelect({ label, name, options, required, placeholder = "Select…" }: { label: string; name: string; options: string[]; required?: boolean; placeholder?: string }) {
  const cleanLabel = label.replace(/\s*\*$/, "");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [activeIdx, setActiveIdx] = useState(-1);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, options.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)); }
      if (e.key === "Enter" && activeIdx >= 0) { e.preventDefault(); setValue(options[activeIdx]); setOpen(false); }
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, activeIdx, options]);

  const toggle = () => {
    setOpen((o) => !o);
    if (!open) setActiveIdx(options.findIndex((o) => o === value));
  };

  return (
    <div className="lf-group">
      <span className="lf-label">
        {cleanLabel}{required && <span className="req">*</span>}
      </span>
      <div ref={wrapRef} className="lf-dd" data-open={open}>
        <button
          type="button"
          className="lf-dd-trigger"
          onClick={toggle}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown" || e.key === " " || e.key === "Enter") {
              e.preventDefault();
              if (!open) toggle();
            }
          }}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className={value ? "" : "lf-dd-placeholder"}>
            {value || placeholder}
          </span>
          <svg className="lf-dd-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        <ul className="lf-dd-list" role="listbox" tabIndex={-1}>
          {options.map((opt, i) => (
            <li
              key={opt}
              role="option"
              aria-selected={value === opt}
              data-selected={value === opt}
              data-active={activeIdx === i}
              className="lf-dd-option"
              onMouseEnter={() => setActiveIdx(i)}
              onClick={() => { setValue(opt); setOpen(false); }}
            >
              {opt}
            </li>
          ))}
        </ul>

        {/* Hidden input keeps native form submission + required validation working */}
        <input type="hidden" name={name} value={value} required={required} />
      </div>
    </div>
  );
}
