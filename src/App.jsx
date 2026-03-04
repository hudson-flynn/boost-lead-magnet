import { useState, useRef } from "react";

// ─── Sheet endpoint — paste your Apps Script Web App URL here ────────────────
const SHEET_ENDPOINT = "YOUR_APPS_SCRIPT_URL_HERE";

// ─── Data (Fully Anonymized) ─────────────────────────────────────────────────

const GIVING_BUCKETS = [
  { title: "Greatest Need", description: "By supporting the Area of Greatest Need, you are investing in the experience for our students. This fund provides flexible resources where they matter most.", image: null },
  { title: "Financial Aid", description: "Help ensure that a quality education remains accessible to deserving students regardless of their family's financial circumstances.", image: null },
  { title: "Athletics", description: "Support our athletic programs and help student-athletes develop teamwork, discipline, and leadership skills both on and off the field.", image: null },
  { title: "Arts & Music", description: "Nurture creativity and self-expression through visual arts, theater, and music programs that enrich our students' educational experience.", image: null },
  { title: "Faculty Development", description: "Invest in our exceptional teachers through professional development opportunities that enhance their skills and keep them at the forefront of education.", image: null },
  { title: "Technology", description: "Ensure our students have access to cutting-edge technology and digital resources that prepare them for success in a rapidly changing world.", image: null },
];

const FAQ_ITEMS = [
  { q: "How do I make a gift?", a: "Click on any giving bucket above or use the \"Give or Pledge Today\" button. You can give by credit card, ACH bank transfer, or set up a recurring pledge." },
  { q: "Is my gift tax-deductible?", a: "Yes. Our school is a 501(c)(3) nonprofit organization. You will receive a tax receipt via email immediately after your gift is processed." },
  { q: "Can I make a recurring gift?", a: "Absolutely. During checkout you can choose monthly, quarterly, or annual recurring gifts to provide sustained support." },
  { q: "Can I give to more than one fund?", a: "Yes. You can split your gift across multiple giving buckets during checkout. Many donors support both Greatest Need and a specific program." },
  { q: "Who do I contact with questions?", a: "Please reach out to our advancement office directly. Contact information is available in the footer of this page." },
];

const MOCK_LEADERBOARD = [
  { affiliation: "Current Parent", donors: 238 },
  { affiliation: "Faculty/Staff", donors: 122 },
  { affiliation: "Alumni", donors: 113 },
  { affiliation: "Past Parent", donors: 71 },
  { affiliation: "Grandparent", donors: 34 },
  { affiliation: "Friend of School", donors: 12 },
];

// Class year participation leaderboard
const CLASS_PARTICIPATION = [
  { year: "2027", supported: 24, total: 57, pct: 42 },
  { year: "2031", supported: 2, total: 5, pct: 40 },
  { year: "2029", supported: 17, total: 43, pct: 40 },
  { year: "2026", supported: 18, total: 47, pct: 38 },
  { year: "2028", supported: 15, total: 42, pct: 36 },
  { year: "2030", supported: 12, total: 38, pct: 32 },
];

const ACTIVE_CHALLENGE = {
  title: "Family Participation Challenge",
  label: "FAMILIES",
  description: "Join other families in supporting what makes our school great! Every gift counts toward our participation goal, no matter the size.",
  hashtags: "#AllIn #SchoolPride",
  currentGifts: 289,
  toGo: 272,
  pct: 52
};

const COMPLETED_CHALLENGES = [
  { title: "Alumni Giving Challenge", label: "ALUMNI", description: "A generous donor gave $500 because 100 alumni made a gift. Challenge complete!", amount: "$500", count: 100, labelText: "alumni gifts" },
  { title: "Class Participation Challenge (Complete!)", label: "CLASS", description: "A $1,000 gift was unlocked when families reached 70% class participation!", thanks: "Thank you to our matching gift donors!", amount: "$1,000", count: 26, labelText: "family gifts" },
];

const MOCK_SUPPORTERS = [
  { name: "The Martinez Family", affiliations: ["Current Parent", "Volunteer"], quote: "We're proud to support the teachers and staff who make such a difference in our children's lives every day." },
  { name: "Sarah & David K.", affiliations: ["Alumni '98", "Current Parent"], quote: null },
  { name: "The Thompson Family", affiliations: ["Current Parent"], quote: null },
  { name: "Jennifer L.", affiliations: ["Past Parent", "Grandparent"], quote: "This school gave our children an incredible foundation. We're happy to give back." },
  { name: "Michael & Lisa R.", affiliations: ["Current Parent", "Volunteer"], quote: null },
  { name: "Anonymous", affiliations: ["Alumni '05"], quote: null },
  { name: "The Patel Family", affiliations: ["Current Parent"], quote: "Grateful for the community and education our kids receive here." },
  { name: "Robert & Ann W.", affiliations: ["Grandparent"], quote: "For our grandchildren and all the students who benefit from this wonderful school." },
  { name: "Christine M.", affiliations: ["Faculty/Staff"], quote: "It's a privilege to work here. Thank you to all the families who make this possible." },
  { name: "James & Emily H.", affiliations: ["Past Parent"], quote: null },
  { name: "The Garcia Family", affiliations: ["Current Parent"], quote: null },
  { name: "Anonymous", affiliations: ["Alumni '12"], quote: "This school changed my life. Happy to support the next generation." },
  { name: "Linda S.", affiliations: ["Trustee"], quote: null },
  { name: "The Williams Family", affiliations: ["Current Parent", "Alumni '95"], quote: "Two generations of our family have benefited from this school." },
  { name: "Mark & Susan B.", affiliations: ["Past Parent"], quote: "Even though our kids have graduated, this community will always be part of our family." },
  { name: "Anonymous", affiliations: ["Friend of School"], quote: null },
];

const MOCK_COMMENTS = [
  { name: "The Martinez Family", affiliation: "Current Parent", time: "a month ago", text: "Go Eagles! So proud to support our school community." },
  { name: "Jennifer L.", affiliation: "Past Parent", time: "a month ago", text: "This school gave our children an incredible foundation. We're happy to give back." },
  { name: "Christine M.", affiliation: "Faculty/Staff", time: "a month ago", text: "Thank you to all the families who make this school so special." },
  { name: "Anonymous", affiliation: "Alumni '05", time: "2 months ago", text: "Honored to support the school that shaped who I am today." },
  { name: "Robert & Ann W.", affiliation: "Grandparent", time: "2 months ago", text: "For our grandchildren and all the students who benefit from this wonderful school." },
  { name: "The Patel Family", affiliation: "Current Parent", time: "2 months ago", text: "Grateful for this amazing community." },
  { name: "Mark & Susan B.", affiliation: "Past Parent", time: "2 months ago", text: "Proud to support the next generation of leaders." },
  { name: "Sarah & David K.", affiliation: "Alumni '98", time: "3 months ago", text: "This school has given our family so much. We are happy to give back." },
  { name: "Anonymous", affiliation: "Alumni '12", time: "3 months ago", text: "The best investment we can make is in education. Thank you for everything." },
  { name: "The Williams Family", affiliation: "Current Parent", time: "3 months ago", text: "Two generations strong and counting!" },
  { name: "Linda S.", affiliation: "Trustee", time: "4 months ago", text: "It is an honor to serve this community." },
  { name: "Anonymous", affiliation: "Friend of School", time: "4 months ago", text: "Supporting great education for all students." },
  { name: "James & Emily H.", affiliation: "Past Parent", time: "4 months ago", text: "Even though our kids have graduated, this community will always be part of our family." },
];

const ABOUT_UPDATES = [
  { title: "Update #3", timeAgo: "1 month ago", date: "Friday, January 15th, 2026, 4:30 pm", text: "We did it! Thanks to our generous community, we have reached our matching gift goal! Thank you to everyone who contributed." },
  { title: "Update #2", timeAgo: "2 months ago", date: "Tuesday, December 10th, 2025, 2:15 pm", text: "We're making great progress! Over 400 families have already contributed to this year's fund. Can we reach 500 by year end?" },
  { title: "Update #1", timeAgo: "3 months ago", date: "Monday, November 1st, 2025, 9:00 am", text: "Our annual fund campaign is officially underway! Every gift makes a difference, no matter the size." },
];

const RECENT_ACTIVITY = [
  { name: "The Anderson Family", affiliations: ["Current Parent"], time: "Supported 2 days ago" },
  { name: "Michelle T.", affiliations: ["Alumni '08", "Faculty/Staff"], time: "Supported 3 days ago" },
  { name: "Anonymous", affiliations: ["Grandparent"], time: "Supported a week ago" },
  { name: "The Chen Family", affiliations: ["Current Parent"], time: "Supported a week ago" },
  { name: "David R.", affiliations: ["Alumni '15"], time: "Supported 2 weeks ago" },
];

const PLATFORM_OPTIONS = ["Raiser's Edge / RE NXT", "GiveCampus", "Blackbaud (other)", "Veracross", "GiveSmart", "Custom / In-house", "Other", "Not sure"];
const CRM_OPTIONS = ["Raiser's Edge / RE NXT", "Veracross", "Blackbaud (other)", "Salesforce", "HubSpot", "Other", "Not sure"];

const DEFAULT_HERO_IMAGE = "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1600&q=80";

const fmtD = (n) => "$" + n.toLocaleString();
const fmtC = (n) => n.toLocaleString();

// ─── Shared Components ───────────────────────────────────────────────────────

const labelStyle = { display: "block", fontSize: "0.85em", fontWeight: 600, color: "#535353", marginBottom: "0.35rem" };
const inputStyle = { width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #e9e9e9", borderRadius: 4, fontSize: "0.95em", color: "#333", background: "#fff", outline: "none", boxSizing: "border-box", fontFamily: "'Open Sans', Arial, Helvetica, sans-serif" };

function FormField({ label, required, type = "text", value, onChange, placeholder, options, style: ws }) {
  return (
    <div style={ws}>
      <label style={labelStyle}>{label}{required && <span style={{ color: "#ea0043", marginLeft: 3 }}>*</span>}</label>
      {type === "select" ? (
        <select value={value} onChange={(e) => onChange(e.target.value)} style={{ ...inputStyle, cursor: "pointer", appearance: "auto" }}>
          <option value="">{placeholder}</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={inputStyle} />
      )}
    </div>
  );
}

function ToggleSwitch({ label, checked, onChange, color }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.85em", color: "#535353", fontWeight: 600 }}>
      <div onClick={(e) => { e.preventDefault(); onChange(!checked); }} style={{ width: 38, height: 22, borderRadius: 11, background: checked ? color : "#c9c9c9", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
        <div style={{ position: "absolute", top: 2, left: checked ? 18 : 2, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 2px rgba(0,0,0,.2)" }} />
      </div>
      {label}
    </label>
  );
}

// Shield crest icon
function CrestIcon({ color, size = 44, logoUrl }) {
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt="School logo"
        style={{
          width: size,
          height: size,
          objectFit: "contain",
          flexShrink: 0
        }}
      />
    );
  }
  return (
    <div style={{
      width: size,
      height: size,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0
    }}>
      <svg width={size * 0.9} height={size * 0.9} viewBox="0 0 40 48" fill="none">
        <path
          d="M20 2 L38 10 L38 28 C38 38 28 46 20 48 C12 46 2 38 2 28 L2 10 Z"
          fill="white"
          stroke={color}
          strokeWidth="2"
        />
        <path
          d="M20 6 L34 12 L34 27 C34 35 26 42 20 44 C14 42 6 35 6 27 L6 12 Z"
          fill={color}
        />
        <path
          d="M12 18 L28 34"
          stroke="white"
          strokeWidth="4"
        />
        <circle cx="14" cy="20" r="2" fill="white" />
        <circle cx="26" cy="32" r="2" fill="white" />
      </svg>
    </div>
  );
}

// Quote icon SVG
function QuoteIcon({ color, size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0 }}>
      <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
    </svg>
  );
}

// Challenge card image with label
function ChallengeImage({ label, color, logoUrl }) {
  return (
    <div style={{
      width: 100,
      height: 100,
      background: "#fff",
      border: "1px solid #e0e0e0",
      borderRadius: 4,
      flexShrink: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "8px"
    }}>
      <div style={{
        background: "#fff",
        color: color,
        fontSize: "0.7rem",
        fontWeight: 700,
        letterSpacing: "0.03em",
        marginBottom: "4px"
      }}>
        {label}
      </div>
      <CrestIcon color={color} size={56} logoUrl={logoUrl} />
    </div>
  );
}

// Progress bar with arrow - arrow protrudes into gray track at fill endpoint
function ProgressBarWithArrow({ pct, color, height = 24 }) {
  const cappedPct = Math.min(pct, 100);
  const fillWidth = Math.max(cappedPct, 3);
  const arrowW = Math.round(height * 0.65);

  return (
    <div style={{ position: "relative", height }}>
      {/* Gray track */}
      <div style={{
        position: "absolute", inset: 0,
        background: "#e0e0e0",
        borderRadius: 4,
      }} />
      {/* Filled portion */}
      <div style={{
        position: "absolute", top: 0, left: 0, bottom: 0,
        width: `${fillWidth}%`,
        background: color,
        borderRadius: fillWidth >= 99 ? 4 : "4px 0 0 4px",
        display: "flex", alignItems: "center", justifyContent: "flex-end",
        paddingRight: arrowW + 6,
        boxSizing: "border-box",
        minWidth: arrowW + 28,
      }}>
        <span style={{ color: "#fff", fontSize: height > 20 ? "0.8rem" : "0.72rem", fontWeight: 700 }}>
          {pct}%
        </span>
      </div>
      {/* Arrow — left base at fill end, tip protrudes into gray track */}
      <div style={{
        position: "absolute",
        top: 0,
        left: `${fillWidth}%`,
        width: 0, height: 0,
        borderTop: `${height / 2}px solid transparent`,
        borderBottom: `${height / 2}px solid transparent`,
        borderLeft: `${arrowW}px solid ${color}`,
        zIndex: 2,
      }} />
    </div>
  );
}

function ChallengeCardShell({ title, pc, children }) {
  return (
    <div style={{ borderRadius: 4, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,.08)", marginBottom: "1.5rem", background: "#fff", border: "1px solid #e9e9e9" }}>
      <div style={{ background: pc, color: "#fff", padding: "0.75rem 1.25rem", fontWeight: 700, fontSize: "0.95rem" }}>{title}</div>
      {children}
    </div>
  );
}

function RecentActivitySidebar({ pc }) {
  return (
    <div>
      <h3 style={{ fontSize: "1.35rem", fontWeight: 700, color: "#333", margin: "0 0 1.5rem" }}>Recent activity</h3>
      {RECENT_ACTIVITY.map((s, i) => (
        <div key={i} style={{ paddingBottom: "1.25rem", marginBottom: "1.25rem", borderBottom: i < RECENT_ACTIVITY.length - 1 ? "1px solid #e9e9e9" : "none" }}>
          <div style={{ fontWeight: 700, color: "#333", fontSize: "0.95rem", marginBottom: "0.2rem" }}>{s.name}</div>
          {s.affiliations.map((a, j) => <div key={j} style={{ color: "#666", fontSize: "0.85rem", lineHeight: 1.5 }}>{a}</div>)}
          <div style={{ color: "#999", fontSize: "0.8rem", marginTop: "0.35rem" }}>{s.time}</div>
        </div>
      ))}
      <span style={{ color: pc, fontSize: "0.9rem", fontWeight: 600, cursor: "pointer" }}>Load more activity</span>
    </div>
  );
}

// Button with hover effect
function HoverButton({ children, style, hoverBg, ...props }) {
  const [isHovered, setIsHovered] = useState(false);
  const baseStyle = { ...style };
  if (isHovered && hoverBg) {
    baseStyle.background = hoverBg;
  }
  return (
    <button
      {...props}
      style={baseStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function BoostLeadMagnet() {
  const [step, setStep] = useState("form");
  const [activeTab, setActiveTab] = useState("about");
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [form, setForm] = useState({
    schoolName: "", fundName: "", fundraisingGoal: "", supporterGoal: "",
    primaryColor: "#1b603a", secondaryColor: "#76bd22", logo: null,
    currentPlatform: "", currentCrm: "", email: "",
    showChallenges: true, showLeaderboards: true,
  });
  const previewRef = useRef(null);
  const updateForm = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) { updateForm("logo", file); const r = new FileReader(); r.onload = (ev) => setLogoPreview(ev.target.result); r.readAsDataURL(file); }
  };
  const canSubmit = form.schoolName.trim() && form.fundName.trim() && form.fundraisingGoal && form.supporterGoal && form.email.trim();
  const handleSubmit = () => {
    if (!canSubmit) return;

    // Fire-and-forget — don't block the preview on network latency
    if (SHEET_ENDPOINT && SHEET_ENDPOINT !== "YOUR_APPS_SCRIPT_URL_HERE") {
      fetch(SHEET_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schoolName:      form.schoolName,
          fundName:        form.fundName,
          email:           form.email,
          fundraisingGoal: form.fundraisingGoal,
          supporterGoal:   form.supporterGoal,
          primaryColor:    form.primaryColor,
          secondaryColor:  form.secondaryColor,
          currentPlatform: form.currentPlatform,
          currentCrm:      form.currentCrm,
          showChallenges:  form.showChallenges,
          showLeaderboards: form.showLeaderboards,
        }),
      }).catch(() => {}); // silently ignore network errors
    }

    setStep("preview");
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
  };

  const goalNum = parseInt(form.fundraisingGoal) || 100000;
  const suppGoalNum = parseInt(form.supporterGoal) || 500;
  const amtRaised = Math.round(goalNum * 1.05);
  const suppCount = Math.round(suppGoalNum * 1.05);
  const pctFunded = Math.min(Math.round((amtRaised / goalNum) * 100), 100);
  const pc = form.primaryColor || "#1b603a";
  const sc = form.secondaryColor || "#76bd22";
  const sn = form.schoolName || "Your School";
  const fn = form.fundName || "Annual Fund";
  const maxLB = Math.max(...MOCK_LEADERBOARD.map((r) => r.donors));

  const darkenColor = (hex, amount = 20) => {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.max(0, (num >> 16) - amount);
    const g = Math.max(0, ((num >> 8) & 0x00FF) - amount);
    const b = Math.max(0, (num & 0x0000FF) - amount);
    return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
  };

  const scHover = darkenColor(sc, 30);

  const TABS = [
    { key: "about", label: "About", count: ABOUT_UPDATES.length },
    { key: "faq", label: "FAQ", count: FAQ_ITEMS.length },
    ...(form.showChallenges ? [{ key: "challenges", label: "Challenges", count: 3 }] : []),
    ...(form.showLeaderboards ? [{ key: "leaderboards", label: "Leaderboards", count: 1 }] : []),
    { key: "supporters", label: "Supporters", count: suppCount },
    { key: "comments", label: "Comments", count: MOCK_COMMENTS.length },
  ];
  const showSidebar = activeTab !== "supporters";

  const CTAButton = ({ style: s = {} }) => {
    const [hovered, setHovered] = useState(false);
    return (
      <button
        style={{
          width: "100%",
          padding: "1rem 1.5rem",
          background: hovered ? scHover : sc,
          color: "#fff",
          border: "none",
          fontWeight: 700,
          fontSize: "0.9rem",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          cursor: "pointer",
          borderRadius: 4,
          fontFamily: "'Open Sans', Arial, Helvetica, sans-serif",
          transition: "background 0.2s",
          ...s
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        Give (or Pledge) Today
      </button>
    );
  };

  // ═══ FORM VIEW ═════════════════════════════════════════════════════════════
  if (step === "form") {
    return (
      <div style={{ fontFamily: "'Open Sans', Arial, Helvetica, sans-serif", minHeight: "100vh", background: "#f5f5f5", display: "flex", flexDirection: "column", alignItems: "center", padding: "2rem 1rem" }}>
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: pc, color: "#fff", textAlign: "center", padding: "0.6rem 1rem", fontSize: "0.9em", fontWeight: 600 }}>
          See what your school looks like on Boost. Fill out the form below to preview your custom giving page.
        </div>
        <div style={{ maxWidth: 560, width: "100%", marginTop: "3rem", background: "#fff", borderRadius: 8, boxShadow: "0 2px 12px rgba(0,0,0,.08)", padding: "2.5rem 2rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: sc, margin: "0 auto 1rem", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "1.2em" }}>B</div>
            <h1 style={{ fontSize: "1.5em", fontWeight: 700, color: "#333", margin: "0 0 0.5rem" }}>Preview Your School on Boost</h1>
            <p style={{ color: "#797979", fontSize: "0.95em", margin: 0, lineHeight: 1.6 }}>Fill in a few details and see exactly what your annual fund giving page would look like. Takes about 60 seconds.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <FormField label="School Name" required value={form.schoolName} onChange={(v) => updateForm("schoolName", v)} placeholder="e.g., Greenfield Academy" />
            <FormField label="Annual Fund Name" required value={form.fundName} onChange={(v) => updateForm("fundName", v)} placeholder="e.g., The Greenfield Fund" />
            <div style={{ display: "flex", gap: "1rem" }}>
              <FormField label="Fundraising Goal ($)" required type="number" value={form.fundraisingGoal} onChange={(v) => updateForm("fundraisingGoal", v)} placeholder="e.g., 1000000" style={{ flex: 1 }} />
              <FormField label="Supporter Goal (#)" required type="number" value={form.supporterGoal} onChange={(v) => updateForm("supporterGoal", v)} placeholder="e.g., 500" style={{ flex: 1 }} />
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Primary Color</label>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <input type="color" value={form.primaryColor} onChange={(e) => updateForm("primaryColor", e.target.value)} style={{ width: 40, height: 36, border: "1px solid #e9e9e9", borderRadius: 4, cursor: "pointer", padding: 2 }} />
                  <input type="text" value={form.primaryColor} onChange={(e) => updateForm("primaryColor", e.target.value)} style={{ ...inputStyle, flex: 1, fontFamily: "monospace" }} />
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Secondary Color</label>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <input type="color" value={form.secondaryColor} onChange={(e) => updateForm("secondaryColor", e.target.value)} style={{ width: 40, height: 36, border: "1px solid #e9e9e9", borderRadius: 4, cursor: "pointer", padding: 2 }} />
                  <input type="text" value={form.secondaryColor} onChange={(e) => updateForm("secondaryColor", e.target.value)} style={{ ...inputStyle, flex: 1, fontFamily: "monospace" }} />
                </div>
              </div>
            </div>
            <p style={{ color: "#949494", fontSize: "0.8em", margin: "-0.5rem 0 0", lineHeight: 1.5 }}>
              Not sure of your hex codes? Upload your logo to <a href="https://htmlcolors.com/image-to-colors" target="_blank" rel="noreferrer" style={{ color: pc }}>htmlcolors.com</a> or use Canva's color palette tool.
            </p>
            <div>
              <label style={labelStyle}>School Logo (optional)</label>
              <div style={{ border: "2px dashed #e9e9e9", borderRadius: 4, padding: "1.25rem", textAlign: "center", cursor: "pointer", background: logoPreview ? "transparent" : "#fafafa" }} onClick={() => document.getElementById("logo-upload").click()}>
                {logoPreview ? <img src={logoPreview} alt="Logo" style={{ maxHeight: 60, maxWidth: "80%", objectFit: "contain" }} /> : <div style={{ color: "#949494", fontSize: "0.875em" }}>Click to upload your school logo</div>}
                <input id="logo-upload" type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: "none" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: "2rem" }}>
              <ToggleSwitch label="Challenges tab" checked={form.showChallenges} onChange={(v) => updateForm("showChallenges", v)} color={sc} />
              <ToggleSwitch label="Leaderboards tab" checked={form.showLeaderboards} onChange={(v) => updateForm("showLeaderboards", v)} color={sc} />
            </div>
            <div style={{ height: 1, background: "#e9e9e9", margin: "0.5rem 0" }} />
            <FormField label="Current Fundraising Platform" type="select" options={PLATFORM_OPTIONS} value={form.currentPlatform} onChange={(v) => updateForm("currentPlatform", v)} placeholder="Select your current platform" />
            <FormField label="Current CRM" type="select" options={CRM_OPTIONS} value={form.currentCrm} onChange={(v) => updateForm("currentCrm", v)} placeholder="Select your current CRM" />
            <FormField label="Email Address" required type="email" value={form.email} onChange={(v) => updateForm("email", v)} placeholder="you@yourschool.org" />
            <button onClick={handleSubmit} disabled={!canSubmit} style={{ width: "100%", padding: "0.9rem", background: canSubmit ? sc : "#c9c9c9", color: "#fff", border: "none", borderRadius: 4, fontSize: "1em", fontWeight: 700, cursor: canSubmit ? "pointer" : "not-allowed", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "0.5rem" }}>Generate My Page Preview</button>
          </div>
        </div>
        <p style={{ color: "#949494", fontSize: "0.78em", marginTop: "1.5rem" }}>Powered by Boost My School</p>
      </div>
    );
  }

  // Giving bucket button with hover
  const GiveBucketButton = () => {
    const [hovered, setHovered] = useState(false);
    return (
      <button
        style={{
          width: "100%",
          padding: "0.6rem",
          border: "2px solid " + sc,
          background: hovered ? sc : "#fff",
          color: hovered ? "#fff" : sc,
          fontWeight: 700,
          fontSize: "0.8rem",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          borderRadius: 4,
          cursor: "pointer",
          fontFamily: "inherit",
          marginBottom: "0.85rem",
          transition: "all 0.2s"
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        Give Now
      </button>
    );
  };

  // ═══ PREVIEW VIEW ══════════════════════════════════════════════════════════
  return (
    <div ref={previewRef} style={{ fontFamily: "'Open Sans', Arial, Helvetica, sans-serif", fontSize: 16, lineHeight: 1.625, color: "#535353", background: "#fff", minHeight: "100vh" }}>

      {/* Sticky Demo Bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, background: "#fff", borderBottom: "2px solid " + sc, padding: "0.5rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,.08)" }}>
        <div style={{ fontSize: "0.82rem", color: "#535353" }}>Preview of <strong>{sn}</strong> on Boost</div>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <button onClick={() => setStep("form")} style={{ padding: "0.4rem 1rem", background: "transparent", color: pc, border: "1px solid " + pc, borderRadius: 4, fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Edit Details</button>
          <a href="https://www.boostmyschool.com/demo" target="_blank" rel="noreferrer" style={{ display: "inline-block", padding: "0.4rem 1.25rem", background: sc, color: "#fff", borderRadius: 4, fontSize: "0.78rem", fontWeight: 700, textDecoration: "none", textTransform: "uppercase" }}>Book a Demo</a>
        </div>
      </div>

      {/* ── HERO - Full image with semi-transparent overlay ── */}
      <div style={{ marginTop: 48, position: "relative", minHeight: 580 }}>
        {/* Background image — full height */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${DEFAULT_HERO_IMAGE})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }} />

        {/* Logo box + hamburger — top of image */}
        <div style={{
          position: "absolute", top: "1.5rem", left: 0, right: 0,
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
          padding: "0 2rem",
          zIndex: 10,
        }}>
          <div style={{
            background: "#fff", borderRadius: 4,
            padding: "0.75rem 1.25rem",
            display: "flex", alignItems: "center", gap: "0.75rem",
            boxShadow: "0 2px 8px rgba(0,0,0,.2)",
          }}>
            {logoPreview ? (
              <img src={logoPreview} alt={sn} style={{ height: 50, maxWidth: 180, objectFit: "contain" }} />
            ) : (
              <>
                <CrestIcon color={pc} size={36} />
                <div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 700, color: pc, lineHeight: 1.2 }}>{fn}</div>
                  <div style={{ fontSize: "0.7rem", color: "#666", letterSpacing: "0.05em" }}>{sn.toUpperCase()}</div>
                </div>
              </>
            )}
          </div>
          <div style={{ cursor: "pointer", display: "flex", flexDirection: "column", gap: "5px", padding: "0.5rem" }}>
            <div style={{ width: 28, height: 3, background: "#fff", borderRadius: 2 }} />
            <div style={{ width: 28, height: 3, background: "#fff", borderRadius: 2 }} />
            <div style={{ width: 28, height: 3, background: "#fff", borderRadius: 2 }} />
          </div>
        </div>

        {/* Semi-transparent primary color overlay — bottom content area */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: pc + "ee",
          borderTop: `4px solid ${sc}`,
        }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2.5rem 2rem 3rem", display: "flex", gap: "2.5rem", alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: "2.25rem", fontWeight: 700, color: "#fff", margin: "0 0 1.25rem", lineHeight: 1.2 }}>{fn}</h1>
              <p style={{ fontSize: "1rem", color: "rgba(255,255,255,.95)", lineHeight: 1.8, margin: "0 0 1.75rem", maxWidth: 580 }}>
                When you make a gift to {sn}, you invest in our students and faculty. The {fn} is essential to our school, supporting current-year operating expenses not covered by tuition. We rely on our school community to contribute meaningfully to ensure we can provide an outstanding education for every student so that they may develop the skills to successfully navigate the future with confidence.
              </p>
              <div style={{ marginBottom: "1.25rem", maxWidth: 560 }}>
                <ProgressBarWithArrow pct={pctFunded} color={sc} height={28} />
              </div>
              <div style={{ display: "flex", gap: "3rem", alignItems: "baseline" }}>
                <div>
                  <span style={{ fontSize: "2rem", fontWeight: 700, color: "#fff" }}>{fmtD(amtRaised)}</span>
                  <div style={{ color: "rgba(255,255,255,.75)", fontSize: "0.88rem" }}>raised of {fmtD(goalNum)} goal</div>
                </div>
                <div>
                  <span style={{ fontSize: "2rem", fontWeight: 700, color: "#fff" }}>{fmtC(suppCount)}</span>
                  <div style={{ color: "rgba(255,255,255,.75)", fontSize: "0.88rem", textDecoration: "underline", cursor: "pointer" }} onClick={() => setActiveTab("supporters")}>supporters</div>
                </div>
              </div>
            </div>

            {/* Right: challenge banner + CTA */}
            <div style={{ flex: "0 0 300px", paddingTop: "0.5rem" }}>
              {form.showChallenges && (
                <div
                  onClick={() => setActiveTab("challenges")}
                  style={{
                    background: "#fff",
                    border: `1px solid ${sc}`,
                    borderRadius: 4,
                    padding: "0.75rem 1rem",
                    marginBottom: "1rem",
                    fontSize: "0.9rem",
                    color: "#333",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span style={{ color: sc }}>⚡</span> There is 1 active challenge!
                </div>
              )}
              <CTAButton />
            </div>
          </div>
        </div>

        {/* Spacer so the relative container is tall enough */}
        <div style={{ height: 580 }} />
      </div>

      {/* ── GIVING BUCKETS ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem 1rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }}>
          {GIVING_BUCKETS.map((b, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 4, boxShadow: "0 1px 4px rgba(0,0,0,.08)", overflow: "hidden", display: "flex", flexDirection: "column", border: "1px solid #f0f0f0" }}>
              <div style={{ height: 180, overflow: "hidden", background: pc + "22", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {b.image ? (
                  <img src={b.image} alt={b.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <CrestIcon color={pc} size={80} />
                )}
              </div>
              <div style={{ padding: "1.25rem 1rem 1.5rem", textAlign: "center", display: "flex", flexDirection: "column", flex: 1 }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#333", margin: "0 0 1rem" }}>{b.title}</h3>
                <GiveBucketButton />
                <p style={{ fontSize: "0.88rem", color: "#666", margin: 0, lineHeight: 1.6, flex: 1 }}>{b.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TAB NAVIGATION ── */}
      <div style={{ background: pc, marginTop: "1rem" }}>
        <div style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 1.5rem",
          display: "flex",
          justifyContent: "center",
          gap: "0.25rem",
          flexWrap: "wrap"
        }}>
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              style={{
                padding: "0.9rem 1rem",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: 600,
                fontFamily: "inherit",
                color: "#fff",
                borderBottom: activeTab === t.key ? "3px solid rgba(255,255,255,.85)" : "3px solid transparent",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                transition: "border-color 0.2s"
              }}
            >
              {t.label}
              <span style={{
                background: "#fff",
                color: pc,
                fontSize: "0.7rem",
                padding: "0.15rem 0.5rem",
                borderRadius: 3,
                fontWeight: 700
              }}>
                {typeof t.count === 'number' && t.count > 99 ? fmtC(t.count) : t.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── TAB CONTENT + SIDEBAR ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem", display: "flex", gap: "3rem" }}>
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* ── ABOUT TAB ── */}
          {activeTab === "about" && (
            <div>
              {form.showChallenges && (
                <ChallengeCardShell title="Active challenge" pc={pc}>
                  <div style={{ padding: "1.25rem", display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
                    <ChallengeImage label={ACTIVE_CHALLENGE.label} color={pc} logoUrl={logoPreview} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "#333", margin: "0 0 0.5rem" }}>{ACTIVE_CHALLENGE.title}</h4>
                      <p style={{ fontSize: "0.9rem", color: "#555", margin: "0 0 0.75rem", lineHeight: 1.6 }}>{ACTIVE_CHALLENGE.description}</p>
                      <p style={{ fontSize: "0.88rem", color: pc, margin: 0, fontWeight: 500 }}>{ACTIVE_CHALLENGE.hashtags}</p>
                    </div>
                  </div>
                  <div style={{ padding: "0 1.25rem 1rem" }}>
                    <span onClick={() => setActiveTab("challenges")} style={{ color: pc, fontSize: "0.9rem", fontWeight: 500, cursor: "pointer", textDecoration: "underline" }}>
                      View progress towards challenges
                    </span>
                  </div>
                </ChallengeCardShell>
              )}

              {form.showLeaderboards && (
                <ChallengeCardShell title="Leaderboards" pc={pc}>
                  <div style={{ padding: "1.25rem" }}>
                    <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "#333", margin: "0 0 1rem" }}>{sn} Community Leaderboard</h4>

                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.5rem 0", marginBottom: "0.5rem" }}>
                      <span style={{ color: pc, fontWeight: 600, fontSize: "0.88rem", minWidth: 130, textDecoration: "underline", cursor: "pointer" }}>Affiliation</span>
                      <span style={{ color: pc, fontWeight: 600, fontSize: "0.88rem", textDecoration: "underline", cursor: "pointer" }}># Donors ↓</span>
                    </div>

                    {MOCK_LEADERBOARD.slice(0, 2).map((r, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.75rem 0", borderBottom: "1px solid #e9e9e9" }}>
                        <span style={{ color: sc, fontWeight: 500, fontSize: "0.9rem", minWidth: 130, cursor: "pointer", textDecoration: "underline" }}>{r.affiliation}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{
                            background: pc,
                            borderRadius: 4,
                            height: 28,
                            width: Math.round((r.donors / maxLB) * 100) + "%",
                            minWidth: 40,
                            display: "flex", alignItems: "center", justifyContent: "flex-end",
                            paddingRight: 8, boxSizing: "border-box",
                          }}>
                            <span style={{ color: "#fff", fontSize: "0.82rem", fontWeight: 700 }}>{r.donors}</span>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div style={{ marginTop: "0.75rem" }}>
                      <span onClick={() => setActiveTab("leaderboards")} style={{ color: pc, fontSize: "0.9rem", fontWeight: 500, cursor: "pointer", textDecoration: "underline" }}>
                        Show more
                      </span>
                    </div>
                  </div>
                </ChallengeCardShell>
              )}

              <div style={{ marginTop: "1.5rem" }}>
                <p style={{ fontSize: "0.95rem", lineHeight: 1.8, color: "#555" }}>
                  Thank you for supporting the {fn}! Your generosity helps provide exceptional educational experiences for our students.
                </p>
                <p style={{ fontSize: "0.9rem", lineHeight: 1.8, color: "#777", fontStyle: "italic", marginTop: "1rem" }}>
                  The fiscal year runs from July 1 through June 30. Gifts can be made by credit card, ACH, or check. For stock transfers or planned giving, please contact the advancement office.
                </p>
                <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "#333", marginTop: "1rem" }}>Thank you for your support!</p>
              </div>

              <div style={{ marginTop: "2rem" }}>
                {ABOUT_UPDATES.map((u, i) => (
                  <div key={i} style={{ padding: "1.25rem 0", borderTop: "1px solid #e9e9e9" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.25rem" }}>
                      <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "#333", margin: 0 }}>{u.title}</h4>
                      <span style={{ fontSize: "0.8rem", color: "#999" }}>{u.timeAgo}</span>
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#999", marginBottom: "0.5rem" }}>{u.date}</div>
                    <p style={{ fontSize: "0.9rem", color: "#555", margin: 0, lineHeight: 1.7 }}>{u.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── FAQ TAB ── */}
          {activeTab === "faq" && (
            <div>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 700, color: "#333", margin: "0 0 1.25rem" }}>Frequently Asked Questions</h2>
              {FAQ_ITEMS.map((f, i) => (
                <div key={i} style={{ borderBottom: "1px solid #e9e9e9" }}>
                  <button onClick={() => setExpandedFaq(expandedFaq === i ? null : i)} style={{ width: "100%", padding: "1rem 0", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left", fontFamily: "inherit" }}>
                    <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "#333" }}>{f.q}</span>
                    <span style={{ fontSize: "1.1rem", color: "#949494", transform: expandedFaq === i ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</span>
                  </button>
                  {expandedFaq === i && <div style={{ padding: "0 0 1rem", fontSize: "0.9rem", color: "#535353", lineHeight: 1.7 }}>{f.a}</div>}
                </div>
              ))}
            </div>
          )}

          {/* ── CHALLENGES TAB ── */}
          {activeTab === "challenges" && form.showChallenges && (
            <div>
              <div style={{ marginBottom: "2rem" }}>
                <p style={{ fontSize: "1.1rem", fontWeight: 600, color: "#333", margin: "0 0 1rem" }}>Want to challenge other members of the community?</p>
                <HoverButton
                  style={{
                    padding: "0.75rem 2rem",
                    border: "2px solid " + sc,
                    background: "#fff",
                    color: sc,
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    borderRadius: 4,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all 0.2s"
                  }}
                  hoverBg={sc}
                  onMouseEnter={(e) => { e.target.style.background = sc; e.target.style.color = "#fff"; }}
                  onMouseLeave={(e) => { e.target.style.background = "#fff"; e.target.style.color = sc; }}
                >
                  Create Your Challenge Gift
                </HoverButton>
              </div>

              <ChallengeCardShell title={ACTIVE_CHALLENGE.title} pc={pc}>
                <div style={{ padding: "1.5rem", display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
                  <ChallengeImage label={ACTIVE_CHALLENGE.label} color={pc} logoUrl={logoPreview} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "0.95rem", color: "#555", margin: "0 0 0.5rem", lineHeight: 1.7 }}>{ACTIVE_CHALLENGE.description}</p>
                    <p style={{ fontSize: "0.9rem", color: pc, margin: "0 0 1rem", fontWeight: 500 }}>{ACTIVE_CHALLENGE.hashtags}</p>
                    <ProgressBarWithArrow pct={ACTIVE_CHALLENGE.pct} color={pc} height={22} />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#666", marginTop: "0.5rem" }}>
                      <span><strong>{ACTIVE_CHALLENGE.currentGifts}</strong> family gifts</span>
                      <span><strong>{ACTIVE_CHALLENGE.toGo}</strong> to go</span>
                    </div>
                  </div>
                </div>
              </ChallengeCardShell>

              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#333", margin: "2.5rem 0 1.25rem" }}>Completed Challenges</h3>
              {COMPLETED_CHALLENGES.map((ch, i) => (
                <ChallengeCardShell key={i} title={ch.title} pc={pc}>
                  <div style={{ padding: "1.5rem", display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
                    <ChallengeImage label={ch.label} color={pc} logoUrl={logoPreview} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "0.95rem", color: "#555", margin: "0 0 0.75rem", lineHeight: 1.7 }}>{ch.description}</p>
                      {ch.thanks && <p style={{ fontSize: "0.9rem", color: pc, fontWeight: 600, margin: "0 0 0.75rem" }}>{ch.thanks}</p>}
                      <ProgressBarWithArrow pct={100} color={pc} height={22} />
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#666", marginTop: "0.5rem" }}>
                        <span><strong>{ch.count}</strong> {ch.labelText}</span>
                        <span style={{ color: pc, fontWeight: 700 }}>{ch.amount} unlocked!</span>
                      </div>
                    </div>
                  </div>
                </ChallengeCardShell>
              ))}
            </div>
          )}

          {/* ── LEADERBOARDS TAB ── */}
          {activeTab === "leaderboards" && form.showLeaderboards && (
            <div>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 700, color: "#333", margin: "0 0 1.5rem" }}>{sn} Community Leaderboard</h2>

              <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", padding: "0.75rem 0", borderBottom: "1px solid #e9e9e9", marginBottom: "0" }}>
                <span style={{ color: sc, fontWeight: 600, fontSize: "0.95rem", minWidth: 150, textDecoration: "underline", cursor: "pointer" }}>Affiliation</span>
                <span style={{ color: sc, fontWeight: 600, fontSize: "0.95rem", textDecoration: "underline", cursor: "pointer" }}># Donors ↓</span>
              </div>

              {MOCK_LEADERBOARD.map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "1.5rem", padding: "0.85rem 0", borderBottom: "1px solid #e9e9e9" }}>
                  <span style={{ color: sc, fontWeight: 500, fontSize: "0.95rem", minWidth: 150, cursor: "pointer", textDecoration: "underline" }}>{r.affiliation}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      background: pc,
                      borderRadius: 4,
                      height: 32,
                      width: Math.round((r.donors / maxLB) * 100) + "%",
                      minWidth: 40,
                      display: "flex", alignItems: "center", justifyContent: "flex-end",
                      paddingRight: 10, boxSizing: "border-box",
                    }}>
                      <span style={{ color: "#fff", fontSize: "0.88rem", fontWeight: 700 }}>{r.donors}</span>
                    </div>
                  </div>
                </div>
              ))}

              <div style={{ marginTop: "1rem" }}>
                <span style={{ color: pc, fontSize: "0.95rem", fontWeight: 500, cursor: "pointer", textDecoration: "underline" }}>Show more</span>
              </div>

              <h2 style={{ fontSize: "1.35rem", fontWeight: 700, color: "#333", margin: "3rem 0 1.5rem" }}>Current Family Participation by Class</h2>

              <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", padding: "0.75rem 0", borderBottom: "1px solid #e9e9e9" }}>
                <span style={{ color: sc, fontWeight: 600, fontSize: "0.95rem", minWidth: 90, textDecoration: "underline", cursor: "pointer" }}>Class year</span>
                <span style={{ color: sc, fontWeight: 600, fontSize: "0.95rem", textDecoration: "underline", cursor: "pointer" }}>Participation ↓</span>
              </div>

              {CLASS_PARTICIPATION.map((c, i) => (
                <div key={i} style={{ padding: "0.85rem 0", borderBottom: "1px solid #e9e9e9" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "0.5rem" }}>
                    <span style={{ color: sc, fontWeight: 500, fontSize: "0.95rem", minWidth: 90, cursor: "pointer", textDecoration: "underline" }}>{c.year}</span>
                    <span style={{ fontSize: "0.85rem", color: "#666" }}>{c.supported} of {c.total} have supported</span>
                  </div>
                  <div style={{ marginLeft: 106 }}>
                    <ProgressBarWithArrow pct={c.pct} color={pc} height={26} />
                  </div>
                </div>
              ))}

              <div style={{ marginTop: "1rem" }}>
                <span style={{ color: pc, fontSize: "0.95rem", fontWeight: 500, cursor: "pointer", textDecoration: "underline" }}>Show more</span>
              </div>
            </div>
          )}

          {/* ── SUPPORTERS TAB ── */}
          {activeTab === "supporters" && (
            <div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#333", margin: "0 0 1rem" }}>Supporters ({fmtC(suppCount)})</h3>
              <div style={{ marginBottom: "1.5rem" }}>
                <select style={{ width: "100%", padding: "0.65rem 0.85rem", border: "1px solid #e0e0e0", borderRadius: 4, fontSize: "0.9rem", color: "#555", fontFamily: "inherit", background: "#fff" }}>
                  <option>All ({fmtC(suppCount)})</option>
                </select>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                {MOCK_SUPPORTERS.map((s, i) => (
                  <div key={i} style={{ background: "#fff", border: "1px solid #e9e9e9", borderRadius: 4, padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    <div style={{ fontWeight: 700, color: "#333", fontSize: "1rem" }}>{s.name}</div>
                    {s.affiliations.map((a, j) => (
                      <span key={j} style={{ color: pc, fontSize: "0.88rem", cursor: "pointer", textDecoration: "underline" }}>{a}</span>
                    ))}
                    {s.quote && (
                      <div style={{
                        marginTop: "0.75rem",
                        borderLeft: `4px solid ${pc}`,
                        background: `${pc}12`,
                        borderRadius: "0 4px 4px 0",
                        padding: "0.75rem 1rem",
                        display: "flex",
                        gap: "0.75rem",
                        alignItems: "flex-start"
                      }}>
                        <QuoteIcon color={pc} size={20} />
                        <p style={{ fontSize: "0.9rem", color: "#444", margin: 0, lineHeight: 1.6 }}>{s.quote}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── COMMENTS TAB ── */}
          {activeTab === "comments" && (
            <div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#555", margin: "0 0 1.5rem", lineHeight: 1.4 }}>
                What do you love about {sn} and why do you support the {fn}?
              </h2>
              <div style={{ marginBottom: "0.75rem" }}>
                <label style={{ fontSize: "0.85rem", color: "#888", display: "block", marginBottom: "0.35rem" }}>Show comments by affiliation</label>
                <select style={{ width: "100%", padding: "0.65rem 0.85rem", border: "1px solid #e0e0e0", borderRadius: 4, fontSize: "0.9rem", color: "#555", fontFamily: "inherit", background: "#fff" }}>
                  <option>Select affiliation(s)...</option>
                  {[...new Set(MOCK_COMMENTS.map(c => c.affiliation))].map((aff, i) => (
                    <option key={i} value={aff}>{aff}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: "1.75rem" }}>
                <label style={{ fontSize: "0.85rem", color: "#888", display: "block", marginBottom: "0.35rem" }}>Search by supporter name or message</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#999", fontSize: "0.95rem" }}>🔍</span>
                  <input type="text" placeholder="" style={{ width: "100%", padding: "0.65rem 0.85rem 0.65rem 2.25rem", border: "1px solid #e0e0e0", borderRadius: 4, fontSize: "0.9rem", fontFamily: "inherit", boxSizing: "border-box" }} />
                </div>
              </div>
              <div style={{ columnCount: 2, columnGap: "1.25rem" }}>
                {MOCK_COMMENTS.map((c, i) => (
                  <div key={i} style={{ breakInside: "avoid", background: "#fff", border: "1px solid #e9e9e9", borderRadius: 4, padding: "1.25rem", marginBottom: "1.25rem" }}>
                    <div style={{ display: "flex", gap: "0.85rem", alignItems: "flex-start" }}>
                      <CrestIcon color={pc} size={42} logoUrl={logoPreview} />
                      <div>
                        <div style={{ fontWeight: 700, color: "#333", fontSize: "0.92rem" }}>{c.name} <span style={{ fontWeight: 400, color: "#777" }}>({c.affiliation})</span></div>
                        <div style={{ fontSize: "0.8rem", color: "#999" }}>{c.time}</div>
                      </div>
                    </div>
                    <p style={{ fontSize: "0.92rem", color: "#555", margin: "0.85rem 0 0", lineHeight: 1.65 }}>{c.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom CTA */}
          <div style={{ marginTop: "2.5rem" }}>
            <CTAButton />
          </div>
        </div>

        {/* ── SIDEBAR ── */}
        {showSidebar && (
          <div style={{ flex: "0 0 280px" }}>
            <RecentActivitySidebar pc={pc} />
          </div>
        )}
      </div>

      {/* ── FOOTER ── */}
      <div style={{ background: pc, marginTop: "3rem", padding: "3rem 1.5rem" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <div style={{ marginBottom: "2rem" }}>
            {logoPreview ? (
              <img src={logoPreview} alt={sn} style={{ height: 60, objectFit: "contain" }} />
            ) : (
              <CrestIcon color="#fff" size={60} />
            )}
          </div>

          <div style={{
            background: "#fff",
            borderRadius: 4,
            padding: "2rem 2.5rem",
            boxShadow: "0 4px 16px rgba(0,0,0,.15)"
          }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#333", margin: "0 0 0.75rem" }}>
              Want this for {sn}?
            </h3>
            <p style={{ fontSize: "0.95rem", color: "#666", margin: "0 0 1.5rem", lineHeight: 1.6 }}>
              See how Boost can help your school raise more money from more supporters with beautiful giving pages like this one.
            </p>
            <a
              href="https://www.boostmyschool.com/demo"
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-block",
                padding: "0.9rem 2.5rem",
                background: sc,
                color: "#fff",
                borderRadius: 4,
                fontSize: "0.95rem",
                fontWeight: 700,
                textDecoration: "none",
                textTransform: "uppercase",
                letterSpacing: "0.05em"
              }}
            >
              Book a Demo
            </a>
          </div>

          <div style={{ marginTop: "2rem", fontSize: "0.8rem", color: "rgba(255,255,255,.6)" }}>
            Powered by <strong style={{ color: "rgba(255,255,255,.8)" }}>Boost My School</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
