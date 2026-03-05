import { useState, useRef, useEffect } from "react";

// ─── Sheet endpoint ───────────────────────────────────────────────────────────
const SHEET_ENDPOINT = "https://script.google.com/macros/s/AKfycbwOyjIFKC7OWmvm_qFojRcKEpVePXA_X6O1GEYcXVgWqFyclYlFTXrIEMgCIt9xmCh7/exec";

// ─── Data ─────────────────────────────────────────────────────────────────────

const GIVING_BUCKETS = [
  { title: "Greatest Need", description: "Not sure where your gift does the most good? This is it. The Greatest Need fund goes wherever the school needs it most, right now.", image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&q=80" },
  { title: "Financial Aid", description: "A lot of families stretch to be here. Your support helps the school say yes to students who belong here, no matter what.", image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80" },
  { title: "Athletics", description: "Sports here are about more than winning. Your gift keeps programs running so every student who wants to compete gets the chance.", image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=80" },
  { title: "Arts & Music", description: "Art and music are where a lot of kids find themselves. Gifts here keep those programs funded and the doors open to every student.", image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&q=80" },
  { title: "Faculty Development", description: "The best teachers never stop learning. Gifts here fund workshops, conferences, and real time for our faculty to grow.", image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80" },
  { title: "Technology", description: "From design tools to research platforms, this fund keeps classrooms equipped with what students actually need to do their best work.", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80" },
];

const FAQ_ITEMS = [
  { q: "How do I make a gift?", a: "Click any giving bucket or the button at the top. You can pay by card, Venmo, Apple Pay, PayPal, ACH bank transfer, or donor advised fund. Employer matching is supported too." },
  { q: "Is my gift tax-deductible?", a: "Yes. The school is a registered 501(c)(3). Your tax receipt will hit your inbox right after your gift goes through." },
  { q: "Can I make a recurring gift?", a: "Yes. You can set up monthly, quarterly, or annual giving at checkout. A lot of donors find it easier to give a smaller amount on a recurring basis than one big gift." },
  { q: "Can I give to more than one fund?", a: "Yes. You can split your gift between buckets at checkout. A lot of donors give to Greatest Need plus one area they care about most." },
  { q: "Who do I contact with questions?", a: "Reach out to the advancement office directly. You'll find contact info in the footer of this page." },
];

const MOCK_LEADERBOARD = [
  { affiliation: "Current Parent", donors: 238 },
  { affiliation: "Faculty/Staff", donors: 122 },
  { affiliation: "Alumni", donors: 113 },
  { affiliation: "Past Parent", donors: 71 },
  { affiliation: "Grandparent", donors: 34 },
  { affiliation: "Friend of School", donors: 12 },
];

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
  image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&q=80",
  description: "Join other families in supporting what makes our school great! Every gift counts toward our participation goal, no matter the size.",
  hashtags: "#AllIn #SchoolPride",
  currentGifts: 289,
  toGo: 272,
  pct: 52
};

const COMPLETED_CHALLENGES = [
  {
    title: "Alumni Giving Challenge", label: "ALUMNI",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=300&q=80",
    description: "A generous donor gave $500 because 100 alumni made a gift. Challenge complete!",
    amount: "$500", count: 100, labelText: "alumni gifts"
  },
  {
    title: "Class Participation Challenge (Complete!)", label: "CLASS",
    image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=300&q=80",
    description: "A $1,000 gift was unlocked when families reached 70% class participation!",
    thanks: "Thank you to our matching gift donors!", amount: "$1,000", count: 26, labelText: "family gifts"
  },
];

const MOCK_SUPPORTERS = [
  { name: "The Martinez Family", affiliations: ["Parent '31", "Parent '33"], type: "Current Parent", quote: "Our daughter came home last year and told us her teacher had stayed after school for two hours just to help her through one concept. That kind of dedication is what we're supporting." },
  { name: "Sarah & David K.", affiliations: ["Alumni '98", "Parent '28"], type: "Current Parent", quote: null },
  { name: "The Thompson Family", affiliations: ["Parent '30"], type: "Current Parent", quote: null },
  { name: "Jennifer L.", affiliations: ["Past Parent '22", "Grandparent '33, '36"], type: "Past Parent", quote: "Three kids through this school. I've watched each of them become more confident, more curious, more kind. I don't know how much was this place and how much was just them. But I know this place had everything to do with it." },
  { name: "Michael & Lisa R.", affiliations: ["Parent '29"], type: "Current Parent", quote: null },
  { name: "Anonymous", affiliations: ["Alumni '05"], type: "Alumni", quote: null },
  { name: "The Patel Family", affiliations: ["Parent '32"], type: "Current Parent", quote: "Our son talks about his teachers the way I used to talk about my best friends. That tells you everything you need to know about this place." },
  { name: "Robert & Ann W.", affiliations: ["Grandparent '29, '32"], type: "Grandparent", quote: "Our grandchildren come home excited to tell us what they learned. At their age, we couldn't wait to leave school. Something special is happening here." },
  { name: "Christine M.", affiliations: ["Faculty/Staff"], type: "Faculty/Staff", quote: "I have the best job in the world. I get to watch kids figure out who they are. The generosity of this community is what makes that possible." },
  { name: "James & Emily H.", affiliations: ["Past Parent '20"], type: "Past Parent", quote: null },
  { name: "The Garcia Family", affiliations: ["Parent '31", "Parent '34"], type: "Current Parent", quote: null },
  { name: "Anonymous", affiliations: ["Alumni '12"], type: "Alumni", quote: "A teacher here saw something in me I didn't see in myself. I got into my dream school because of her. My gift is a very small thank-you for that." },
  { name: "Linda S.", affiliations: ["Trustee"], type: "Trustee", quote: null },
  { name: "The Williams Family", affiliations: ["Parent '27", "Alumni '95"], type: "Current Parent", quote: "Two generations of our family have come through this school. The values it instilled in us are ones we try to live by every day." },
  { name: "Mark & Susan B.", affiliations: ["Past Parent '24"], type: "Past Parent", quote: "Our kids graduated last year and we still feel like part of this community. We always will." },
  { name: "Anonymous", affiliations: ["Friend of School"], type: "Friend of School", quote: null },
];

const SUPPORTER_FILTER_OPTIONS = ["Current Parent", "Past Parent", "Alumni", "Faculty/Staff", "Grandparent", "Trustee", "Friend of School"];

const MOCK_COMMENTS = [
  { name: "Rachel T.", affiliation: "Parent '30", time: "3 weeks ago", text: "I didn't expect to get emotional filling out a donation form. Then I thought about my son's face when his teacher tracked down a book he'd mentioned once in passing, just because she was paying attention. We give because teachers here pay attention.", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=700&q=80" },
  { name: "Thomas B.", affiliation: "Alumni '03", time: "3 weeks ago", text: "I graduated 22 years ago and I still use what I learned here. Not the facts. The way I think through a hard problem. The way I don't give up. You can't put a dollar amount on that kind of education.", image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=700&q=80" },
  { name: "Diane & Paul F.", affiliation: "Parent '28", time: "a month ago", text: "Our kid said school is her favorite place. She's 13. Let that sink in.", image: "https://images.unsplash.com/photo-1601933470096-0e34634ffcde?w=700&q=80" },
  { name: "Chris A.", affiliation: "Alumni '09", time: "a month ago", text: "I came back for alumni weekend last fall and walked into my old English classroom. My teacher is still there. Same room, same energy, different kids who have no idea how lucky they are. Really glad to still be giving.", image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=700&q=80" },
  { name: "The Martinez Family", affiliation: "Parent '31", time: "a month ago", text: "Our daughter came home and told us her teacher had stayed after school for two hours just to help her understand one concept. That's what we're supporting. Teachers who show up like that." },
  { name: "Jennifer L.", affiliation: "Past Parent '22", time: "a month ago", text: "Three kids through this school. I've watched each of them become more confident, more curious, more kind. I don't know how much was this place and how much was just them. But I know this place had everything to do with it." },
  { name: "Christine M.", affiliation: "Faculty/Staff", time: "a month ago", text: "I've been teaching for 22 years. This is the only place I've worked where the parents and the school are genuinely on the same team. Your support means more to us than you know." },
  { name: "Anonymous", affiliation: "Alumni '05", time: "2 months ago", text: "A teacher here told me I was a writer when I was pretty sure I was nothing. I've been a journalist for 12 years. I give back every year because of her." },
  { name: "Robert & Ann W.", affiliation: "Grandparent '29, '32", time: "2 months ago", text: "Our grandson called just to tell us about a history project he's working on. He was so excited he could barely get the words out. This school is doing something right." },
  { name: "The Patel Family", affiliation: "Parent '32", time: "2 months ago", text: "Our son talks about his teachers the way I used to talk about my best friends. That tells you everything." },
  { name: "Mark & Susan B.", affiliation: "Past Parent '24", time: "2 months ago", text: "Our daughter graduated last year and still comes back to visit her teachers. She said, 'Mom, they actually care what happens to me.' That's not nothing. That's everything." },
  { name: "Sarah & David K.", affiliation: "Alumni '98", time: "3 months ago", text: "I moved across the country and built a career I never expected. I think about the teachers who believed in me before I believed in myself, and I give back because someone needs to do that for the next kid." },
  { name: "Anonymous", affiliation: "Alumni '12", time: "3 months ago", text: "A teacher here saw something in me I didn't see in myself. Got into my dream school because of her. My annual gift is a very small thank-you for that." },
  { name: "The Williams Family", affiliation: "Parent '27", time: "3 months ago", text: "Both my husband and I are alumni. Watching our own kids walk these same halls has been one of the most meaningful things in our lives." },
  { name: "Linda S.", affiliation: "Trustee", time: "4 months ago", text: "I've served on a lot of boards. I've never seen a school community that rallies together like this one. The culture of generosity here starts with the families." },
  { name: "Anonymous", affiliation: "Friend of School", time: "4 months ago", text: "My best friend's kids go here and I've watched the school show up for their family through some genuinely hard times. That kind of community is worth supporting." },
  { name: "James & Emily H.", affiliation: "Past Parent '20", time: "4 months ago", text: "Our kids have been out for a few years now and we're still giving. Some things you just don't walk away from." },
];

const ABOUT_UPDATES = [
  { title: "Update #3", timeAgo: "1 month ago", date: "Friday, January 15th, 2026, 4:30 pm", text: "We did it! Thanks to our generous community, we have reached our matching gift goal! Thank you to everyone who contributed." },
  { title: "Update #2", timeAgo: "2 months ago", date: "Tuesday, December 10th, 2025, 2:15 pm", text: "We're making great progress! Over 400 families have already contributed to this year's fund. Can we reach 500 by year end?" },
  { title: "Update #1", timeAgo: "3 months ago", date: "Monday, November 1st, 2025, 9:00 am", text: "Our annual fund campaign is officially underway! Every gift makes a difference, no matter the size." },
];

const RECENT_ACTIVITY = [
  { name: "The Anderson Family", affiliations: ["Parent '30"], time: "Supported 2 days ago" },
  { name: "Michelle T.", affiliations: ["Alumni '08", "Faculty/Staff"], time: "Supported 3 days ago" },
  { name: "Anonymous", affiliations: ["Grandparent '31, '34"], time: "Supported a week ago" },
  { name: "The Chen Family", affiliations: ["Parent '29"], time: "Supported a week ago" },
  { name: "David R.", affiliations: ["Alumni '15"], time: "Supported 2 weeks ago" },
];

const PLATFORM_OPTIONS = ["Raiser's Edge / RE NXT", "GiveCampus", "Blackbaud (other)", "Veracross", "GiveSmart", "Custom / In-house", "Other", "Not sure"];
const CRM_OPTIONS = ["Raiser's Edge / RE NXT", "Veracross", "Blackbaud (other)", "Salesforce", "HubSpot", "Other", "Not sure"];

// ─── URL hash encoding / decoding ─────────────────────────────────────────────

function encodePreviewHash(form, logo = null) {
  const data = {
    sn: form.schoolName,
    fn: form.fundName,
    goal: form.fundraisingGoal,
    sup: form.supporterGoal,
    pc: form.primaryColor,
    sc: form.secondaryColor,
    plat: form.currentPlatform,
    crm: form.currentCrm,
    email: form.email,
    ch: form.showChallenges ? 1 : 0,
    lb: form.showLeaderboards ? 1 : 0,
    ...(logo ? { logo } : {}),
  };
  // btoa doesn't handle non-ASCII; encodeURIComponent covers school names with accents etc.
  return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
}

function decodePreviewHash(hash) {
  try {
    const data = JSON.parse(decodeURIComponent(escape(atob(hash))));
    return {
      schoolName: data.sn || "",
      fundName: data.fn || "",
      fundraisingGoal: data.goal || "",
      supporterGoal: data.sup || "",
      primaryColor: data.pc || "#1b603a",
      secondaryColor: data.sc || "#76bd22",
      currentPlatform: data.plat || "",
      currentCrm: data.crm || "",
      email: data.email || "",
      showChallenges: data.ch !== 0,
      showLeaderboards: data.lb !== 0,
      logo: null,
      logoData: data.logo || null,
    };
  } catch {
    return null;
  }
}

const DEFAULT_HERO_IMAGE = "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1600&q=80";

const fmtD = (n) => "$" + n.toLocaleString();
const fmtC = (n) => n.toLocaleString();

// ─── Shared Components ────────────────────────────────────────────────────────

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

function CrestIcon({ color, size = 44, logoUrl }) {
  if (logoUrl) {
    return <img src={logoUrl} alt="School logo" style={{ width: size, height: size, objectFit: "contain", flexShrink: 0 }} />;
  }
  return (
    <div style={{ width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg width={size * 0.9} height={size * 0.9} viewBox="0 0 40 48" fill="none">
        <path d="M20 2 L38 10 L38 28 C38 38 28 46 20 48 C12 46 2 38 2 28 L2 10 Z" fill="white" stroke={color} strokeWidth="2" />
        <path d="M20 6 L34 12 L34 27 C34 35 26 42 20 44 C14 42 6 35 6 27 L6 12 Z" fill={color} />
        <path d="M12 18 L28 34" stroke="white" strokeWidth="4" />
        <circle cx="14" cy="20" r="2" fill="white" />
        <circle cx="26" cy="32" r="2" fill="white" />
      </svg>
    </div>
  );
}

function QuoteIcon({ color, size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0 }}>
      <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
    </svg>
  );
}

// Challenge thumbnail: stock photo + label overlay
function ChallengeImage({ label, image }) {
  return (
    <div style={{ width: 110, height: 110, borderRadius: 4, flexShrink: 0, overflow: "hidden", border: "1px solid #e0e0e0", position: "relative" }}>
      <img src={image} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background: "rgba(0,0,0,.5)",
        color: "#fff", fontSize: "0.65rem", fontWeight: 700,
        letterSpacing: "0.06em", textAlign: "center",
        padding: "3px 4px"
      }}>
        {label}
      </div>
    </div>
  );
}

// Progress bar WITH arrow (hero + challenge cards only)
function ProgressBarWithArrow({ pct, color, height = 24 }) {
  const cappedPct = Math.min(pct, 100);
  const fillWidth = Math.max(cappedPct, 3);
  const arrowW = Math.round(height * 0.65);

  return (
    <div style={{ position: "relative", height }}>
      {/* Gray track */}
      <div style={{ position: "absolute", inset: 0, background: "#e0e0e0", borderRadius: 4 }} />
      {/* Fill — extends 1px past arrow base to eliminate subpixel gap */}
      <div style={{
        position: "absolute", top: 0, left: 0, bottom: 0,
        width: `calc(${fillWidth}% + 1px)`,
        background: color,
        borderRadius: fillWidth >= 99 ? 4 : "4px 0 0 4px",
        display: "flex", alignItems: "center", justifyContent: "flex-end",
        paddingRight: arrowW + 8,
        boxSizing: "border-box",
        minWidth: arrowW + 32,
      }}>
        <span style={{ color: "#fff", fontSize: height > 20 ? "0.8rem" : "0.72rem", fontWeight: 700 }}>
          {pct}%
        </span>
      </div>
      {/* Arrow tip at fill endpoint, protrudes into gray track */}
      <div style={{
        position: "absolute", top: 0,
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

// Plain progress bar — no arrow (class participation leaderboard)
function ProgressBarPlain({ pct, color, height = 26 }) {
  const fillWidth = Math.max(Math.min(pct, 100), 3);
  return (
    <div style={{ background: "#e0e0e0", borderRadius: 4, height, overflow: "hidden" }}>
      <div style={{
        background: color, height: "100%", width: fillWidth + "%",
        borderRadius: 4,
        display: "flex", alignItems: "center", justifyContent: "flex-end",
        paddingRight: 10, boxSizing: "border-box", minWidth: 36,
      }}>
        <span style={{ color: "#fff", fontSize: "0.78rem", fontWeight: 700 }}>{pct}%</span>
      </div>
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

// Give CTA Modal
function GiveModal({ sn, sc, pc, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.55)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 8, padding: "2.5rem 2rem", maxWidth: 460, width: "100%", textAlign: "center", position: "relative", boxShadow: "0 8px 32px rgba(0,0,0,.2)" }} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", fontSize: "1.3rem", color: "#aaa", cursor: "pointer", lineHeight: 1 }}>✕</button>
        <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🎓</div>
        <h2 style={{ fontSize: "1.35rem", fontWeight: 700, color: "#333", margin: "0 0 0.75rem", lineHeight: 1.3 }}>
          Want to see what making a gift looks like?
        </h2>
        <p style={{ fontSize: "0.95rem", color: "#666", lineHeight: 1.7, margin: "0 0 1.75rem" }}>
          On a real Boost page, donors can give by card, Venmo, Apple Pay, PayPal, ACH bank transfer, or donor advised fund. Employer matching is built right in. Receipts hit their inbox in seconds. Book a demo to see the full giving experience for {sn}.
        </p>
        <a
          href={`https://www.boostmyschool.com/demo?utm_source=lead-magnet&utm_medium=modal&utm_campaign=${encodeURIComponent(sn)}`}
          target="_blank"
          rel="noreferrer"
          style={{ display: "inline-block", padding: "0.9rem 2.5rem", background: sc, color: "#fff", borderRadius: 4, fontSize: "0.95rem", fontWeight: 700, textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.05em" }}
        >
          Book a Demo
        </a>
        <div style={{ marginTop: "1rem", fontSize: "0.8rem", color: "#aaa" }}>Takes about 20 minutes</div>
      </div>
    </div>
  );
}

// Copy shareable link button
function CopyLinkButton({ pc }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={handleCopy}
      style={{ padding: "0.4rem 1rem", background: "transparent", color: "#888", border: "1px solid #ddd", borderRadius: 4, fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}
    >
      {copied ? "Copied!" : "Copy link"}
    </button>
  );
}

// Logo card — used in hero and footer
function LogoCard({ logoPreview, fn, sn, pc }) {
  return (
    <div style={{ background: "#fff", borderRadius: 4, padding: "0.75rem 1.25rem", display: "flex", alignItems: "center", gap: "0.75rem", boxShadow: "0 2px 8px rgba(0,0,0,.15)" }}>
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
  );
}

function resizeLogoForHash(dataUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const maxW = 400;
      const scale = Math.min(1, maxW / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.65));
    };
    img.onerror = () => resolve(null);
    img.src = dataUrl;
  });
}

function useIsMobile(bp = 768) {
  const [m, setM] = useState(() => window.innerWidth < bp);
  useEffect(() => {
    const h = () => setM(window.innerWidth < bp);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, [bp]);
  return m;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function BoostLeadMagnet() {
  const [step, setStep] = useState("form");
  const [activeTab, setActiveTab] = useState("about");
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [logoPreview, setLogoPreview] = useState(() => {
    try { return localStorage.getItem("boost_logo") || null; } catch { return null; }
  });
  const isMobile = useIsMobile();
  const [showGiveModal, setShowGiveModal] = useState(false);
  const [supporterFilter, setSupporterFilter] = useState("");
  const [commentFilter, setCommentFilter] = useState("");
  const [logoForHash, setLogoForHash] = useState(null);
  const [form, setForm] = useState({
    schoolName: "", fundName: "", fundraisingGoal: "", supporterGoal: "",
    primaryColor: "#1b603a", secondaryColor: "#76bd22", logo: null,
    currentPlatform: "", currentCrm: "", email: "",
    showChallenges: true, showLeaderboards: true,
  });
  const previewRef = useRef(null);
  const updateForm = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  // On mount: if a preview hash is in the URL, decode it and skip straight to preview
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const decoded = decodePreviewHash(hash);
    if (decoded) {
      setForm(decoded);
      setStep("preview");
      if (decoded.logoData) {
        setLogoPreview(decoded.logoData);
        setLogoForHash(decoded.logoData);
      } else {
        try { const logo = localStorage.getItem("boost_logo"); if (logo) setLogoPreview(logo); } catch {}
      }
    }
  }, []);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) { updateForm("logo", file); const r = new FileReader(); r.onload = (ev) => { setLogoPreview(ev.target.result); try { localStorage.setItem("boost_logo", ev.target.result); } catch {} resizeLogoForHash(ev.target.result).then((resized) => { if (resized) setLogoForHash(resized); }); }; r.readAsDataURL(file); }
  };

  const canSubmit = form.schoolName.trim() && form.fundName.trim() && form.fundraisingGoal && form.supporterGoal && form.email.trim();

  const handleSubmit = () => {
    if (!canSubmit) return;
    // Build the shareable URL first so we can include it in the sheet row
    const previewHash = encodePreviewHash(form, logoForHash);
    const previewUrl = `${window.location.origin}${window.location.pathname}#${previewHash}`;
    if (SHEET_ENDPOINT && SHEET_ENDPOINT !== "YOUR_APPS_SCRIPT_URL_HERE") {
      fetch(SHEET_ENDPOINT, {
        method: "POST", mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schoolName: form.schoolName, fundName: form.fundName, email: form.email,
          fundraisingGoal: form.fundraisingGoal, supporterGoal: form.supporterGoal,
          primaryColor: form.primaryColor, secondaryColor: form.secondaryColor,
          currentPlatform: form.currentPlatform, currentCrm: form.currentCrm,
          showChallenges: form.showChallenges, showLeaderboards: form.showLeaderboards,
          previewUrl,
        }),
      }).catch(() => {});
    }
    window.location.hash = previewHash;
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

  const filteredSupporters = supporterFilter
    ? MOCK_SUPPORTERS.filter((s) => s.type === supporterFilter)
    : MOCK_SUPPORTERS;

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
        onClick={() => setShowGiveModal(true)}
        style={{ width: "100%", padding: "1rem 1.5rem", background: hovered ? scHover : sc, color: "#fff", border: "none", fontWeight: 700, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em", cursor: "pointer", borderRadius: 4, fontFamily: "'Open Sans', Arial, Helvetica, sans-serif", transition: "background 0.2s", ...s }}
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      >
        Give (or Pledge) Today
      </button>
    );
  };

  // ═══ FORM VIEW ═══════════════════════════════════════════════════════════════
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
            <div style={{ display: "flex", gap: "1rem", flexDirection: isMobile ? "column" : "row" }}>
              <FormField label="Fundraising Goal ($)" required type="number" value={form.fundraisingGoal} onChange={(v) => updateForm("fundraisingGoal", v)} placeholder="e.g., 1000000" style={{ flex: 1 }} />
              <FormField label="Supporter Goal (#)" required type="number" value={form.supporterGoal} onChange={(v) => updateForm("supporterGoal", v)} placeholder="e.g., 500" style={{ flex: 1 }} />
            </div>
            <div style={{ display: "flex", gap: "1rem", flexDirection: isMobile ? "column" : "row" }}>
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
            <button onClick={handleSubmit} disabled={!canSubmit} style={{ width: "100%", padding: "0.9rem", background: canSubmit ? sc : "#c9c9c9", color: "#fff", border: "none", borderRadius: 4, fontSize: "1em", fontWeight: 700, cursor: canSubmit ? "pointer" : "not-allowed", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "0.5rem" }}>
              Generate My Page Preview
            </button>
          </div>
        </div>
        <p style={{ color: "#949494", fontSize: "0.78em", marginTop: "1.5rem" }}>Powered by Boost My School</p>
      </div>
    );
  }

  const ChallengeGiftButton = () => {
    const [hovered, setHovered] = useState(false);
    return (
      <button
        onClick={() => setShowGiveModal(true)}
        style={{ padding: "0.75rem 2rem", border: "2px solid " + sc, background: hovered ? sc : "#fff", color: hovered ? "#fff" : sc, fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.04em", borderRadius: 4, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      >
        Create Your Challenge Gift
      </button>
    );
  };

  const GiveBucketButton = () => {
    const [hovered, setHovered] = useState(false);
    return (
      <button
        onClick={() => setShowGiveModal(true)}
        style={{ width: "100%", padding: "0.6rem", border: "2px solid " + sc, background: hovered ? sc : "#fff", color: hovered ? "#fff" : sc, fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", borderRadius: 4, cursor: "pointer", fontFamily: "inherit", marginBottom: "0.85rem", transition: "all 0.2s" }}
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      >
        Give Now
      </button>
    );
  };

  // ═══ PREVIEW VIEW ════════════════════════════════════════════════════════════
  return (
    <div ref={previewRef} style={{ fontFamily: "'Open Sans', Arial, Helvetica, sans-serif", fontSize: 16, lineHeight: 1.625, color: "#535353", background: "#fff", minHeight: "100vh" }}>

      {showGiveModal && <GiveModal sn={sn} sc={sc} pc={pc} onClose={() => setShowGiveModal(false)} />}

      {/* Sticky Demo Bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, background: "#fff", borderBottom: "2px solid " + sc, padding: "0.5rem 1rem", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,.08)" }}>
        {!isMobile && <div style={{ fontSize: "0.82rem", color: "#535353" }}>Preview of <strong>{sn}</strong> on Boost</div>}
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginLeft: isMobile ? "auto" : 0 }}>
          {!isMobile && <CopyLinkButton pc={pc} />}
          <button onClick={() => { window.location.hash = ""; setStep("form"); }} style={{ padding: "0.4rem 1rem", background: "transparent", color: pc, border: "1px solid " + pc, borderRadius: 4, fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{isMobile ? "Edit" : "Edit Details"}</button>
          <a href={`https://www.boostmyschool.com/demo?utm_source=lead-magnet&utm_medium=preview&utm_campaign=${encodeURIComponent(sn)}`} target="_blank" rel="noreferrer" style={{ display: "inline-block", padding: "0.4rem 1.25rem", background: sc, color: "#fff", borderRadius: 4, fontSize: "0.78rem", fontWeight: 700, textDecoration: "none", textTransform: "uppercase" }}>{isMobile ? "Book a Demo" : `Book a Demo for ${sn}`}</a>
        </div>
      </div>

      {/* ── HERO ── */}
      {isMobile ? (
        <div style={{ marginTop: 48 }}>
          <div style={{ position: "relative", height: 220, backgroundImage: `url(${DEFAULT_HERO_IMAGE})`, backgroundSize: "cover", backgroundPosition: "center top" }}>
            <div style={{ position: "absolute", top: "1rem", left: "1rem" }}>
              <div style={{ background: "#fff", borderRadius: 4, padding: "0.5rem 0.85rem", display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: "0 2px 8px rgba(0,0,0,.15)" }}>
                {logoPreview ? (
                  <img src={logoPreview} alt={sn} style={{ height: 36, maxWidth: 120, objectFit: "contain" }} />
                ) : (
                  <>
                    <CrestIcon color={pc} size={28} />
                    <div style={{ fontSize: "0.8rem", fontWeight: 700, color: pc, lineHeight: 1.2 }}>{fn}</div>
                  </>
                )}
              </div>
            </div>
            <div style={{ position: "absolute", top: "1rem", right: "1rem", cursor: "pointer", display: "flex", flexDirection: "column", gap: "5px", padding: "0.6rem", background: "rgba(0,0,0,.25)", borderRadius: 4 }}>
              <div style={{ width: 26, height: 3, background: "#fff", borderRadius: 2 }} />
              <div style={{ width: 26, height: 3, background: "#fff", borderRadius: 2 }} />
              <div style={{ width: 26, height: 3, background: "#fff", borderRadius: 2 }} />
            </div>
          </div>
          <div style={{ background: pc + "ee", borderTop: `4px solid ${sc}`, padding: "1.25rem 1rem" }}>
            <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#fff", margin: "0 0 0.75rem", lineHeight: 1.2 }}>{fn}</h1>
            <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,.93)", lineHeight: 1.7, margin: "0 0 1rem" }}>
              Every gift to {sn} goes directly to the programs, teachers, and experiences that define this place. The {fn} covers what tuition doesn't, and it touches every corner of school life.
            </p>
            <div style={{ marginBottom: "0.85rem" }}>
              <ProgressBarWithArrow pct={pctFunded} color={sc} height={24} />
            </div>
            <div style={{ display: "flex", gap: "2rem", alignItems: "baseline", marginBottom: "1rem" }}>
              <div>
                <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "#fff" }}>{fmtD(amtRaised)}</span>
                <div style={{ color: "rgba(255,255,255,.75)", fontSize: "0.82rem" }}>raised of {fmtD(goalNum)} goal</div>
              </div>
              <div>
                <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "#fff" }}>{fmtC(suppCount)}</span>
                <div style={{ color: "rgba(255,255,255,.75)", fontSize: "0.82rem", textDecoration: "underline", cursor: "pointer" }} onClick={() => { setActiveTab("supporters"); setTimeout(() => document.getElementById("preview-tabs")?.scrollIntoView({ behavior: "smooth" }), 50); }}>supporters</div>
              </div>
            </div>
            {form.showChallenges && (
              <div onClick={() => setActiveTab("challenges")} style={{ background: "#fff", border: `1px solid ${sc}`, borderRadius: 4, padding: "0.7rem 1rem", marginBottom: "1rem", fontSize: "0.88rem", color: "#333", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ color: sc }}>⚡</span> There is 1 active challenge!
              </div>
            )}
            <CTAButton />
          </div>
        </div>
      ) : (
        <div style={{ marginTop: 48, position: "relative", height: "calc(100vh - 48px)", overflow: "hidden" }}>
          {/* Full-bleed background image */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${DEFAULT_HERO_IMAGE})`, backgroundSize: "cover", backgroundPosition: "center top" }} />

          {/* Logo + hamburger over the image */}
          <div style={{ position: "absolute", top: "1.5rem", left: 0, right: 0, display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "0 2rem", zIndex: 10 }}>
            <LogoCard logoPreview={logoPreview} fn={fn} sn={sn} pc={pc} />
            <div style={{ cursor: "pointer", display: "flex", flexDirection: "column", gap: "5px", padding: "0.6rem", background: "rgba(0,0,0,.25)", borderRadius: 4 }}>
              <div style={{ width: 26, height: 3, background: "#fff", borderRadius: 2 }} />
              <div style={{ width: 26, height: 3, background: "#fff", borderRadius: 2 }} />
              <div style={{ width: 26, height: 3, background: "#fff", borderRadius: 2 }} />
            </div>
          </div>

          {/* Primary color overlay — bottom 50% */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "50%", background: pc + "ee", borderTop: `4px solid ${sc}` }}>
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2.25rem 2rem 2.5rem", display: "flex", gap: "2.5rem", alignItems: "flex-start", height: "100%", boxSizing: "border-box" }}>
              <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: "2.1rem", fontWeight: 700, color: "#fff", margin: "0 0 1rem", lineHeight: 1.2 }}>{fn}</h1>
                <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,.93)", lineHeight: 1.75, margin: "0 0 1.25rem", maxWidth: 560 }}>
                  Every gift to {sn} goes directly to the programs, teachers, and experiences that define this place. The {fn} covers what tuition doesn't, and it touches every corner of school life.
                </p>
                <div style={{ marginBottom: "1rem", maxWidth: 540 }}>
                  <ProgressBarWithArrow pct={pctFunded} color={sc} height={28} />
                </div>
                <div style={{ display: "flex", gap: "3rem", alignItems: "baseline" }}>
                  <div>
                    <span style={{ fontSize: "1.9rem", fontWeight: 700, color: "#fff" }}>{fmtD(amtRaised)}</span>
                    <div style={{ color: "rgba(255,255,255,.75)", fontSize: "0.88rem" }}>raised of {fmtD(goalNum)} goal</div>
                  </div>
                  <div>
                    <span style={{ fontSize: "1.9rem", fontWeight: 700, color: "#fff" }}>{fmtC(suppCount)}</span>
                    <div style={{ color: "rgba(255,255,255,.75)", fontSize: "0.88rem", textDecoration: "underline", cursor: "pointer" }} onClick={() => { setActiveTab("supporters"); setTimeout(() => document.getElementById("preview-tabs")?.scrollIntoView({ behavior: "smooth" }), 50); }}>supporters</div>
                  </div>
                </div>
              </div>
              <div style={{ flex: "0 0 280px", paddingTop: "0.25rem" }}>
                {form.showChallenges && (
                  <div onClick={() => setActiveTab("challenges")} style={{ background: "#fff", border: `1px solid ${sc}`, borderRadius: 4, padding: "0.7rem 1rem", marginBottom: "1rem", fontSize: "0.88rem", color: "#333", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ color: sc }}>⚡</span> There is 1 active challenge!
                  </div>
                )}
                <CTAButton />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── GIVING BUCKETS ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem 1rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "1.25rem" }}>
          {GIVING_BUCKETS.map((b, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 4, boxShadow: "0 1px 4px rgba(0,0,0,.08)", overflow: "hidden", display: "flex", flexDirection: "column", border: "1px solid #f0f0f0" }}>
              <div style={{ height: 200, overflow: "hidden" }}>
                <img src={b.image} alt={b.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
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
      <div id="preview-tabs" style={{ background: pc, marginTop: "1rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem", display: "flex", justifyContent: "center", gap: "0.25rem", flexWrap: "wrap" }}>
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} style={{ padding: "0.9rem 1rem", background: "transparent", border: "none", cursor: "pointer", fontSize: "0.9rem", fontWeight: 600, fontFamily: "inherit", color: "#fff", borderBottom: activeTab === t.key ? "3px solid rgba(255,255,255,.85)" : "3px solid transparent", display: "flex", alignItems: "center", gap: "0.5rem", transition: "border-color 0.2s" }}>
              {t.label}
              <span style={{ background: "#fff", color: pc, fontSize: "0.7rem", padding: "0.15rem 0.5rem", borderRadius: 3, fontWeight: 700 }}>
                {typeof t.count === "number" && t.count > 99 ? fmtC(t.count) : t.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── TAB CONTENT + SIDEBAR ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "1.5rem 1rem" : "2rem 1.5rem", display: "flex", flexDirection: isMobile ? "column" : "row", gap: "3rem" }}>
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* ── ABOUT ── */}
          {activeTab === "about" && (
            <div>
              {form.showChallenges && (
                <ChallengeCardShell title="Active challenge" pc={pc}>
                  <div style={{ padding: "1.25rem", display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
                    <ChallengeImage label={ACTIVE_CHALLENGE.label} image={ACTIVE_CHALLENGE.image} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "#333", margin: "0 0 0.5rem" }}>{ACTIVE_CHALLENGE.title}</h4>
                      <p style={{ fontSize: "0.9rem", color: "#555", margin: "0 0 0.75rem", lineHeight: 1.6 }}>{ACTIVE_CHALLENGE.description}</p>
                      <p style={{ fontSize: "0.88rem", color: sc, margin: 0, fontWeight: 500 }}>{ACTIVE_CHALLENGE.hashtags}</p>
                    </div>
                  </div>
                  <div style={{ padding: "0 1.25rem 1rem" }}>
                    <span onClick={() => setActiveTab("challenges")} style={{ color: sc, fontSize: "0.9rem", fontWeight: 500, cursor: "pointer", textDecoration: "underline" }}>View progress towards challenges</span>
                  </div>
                </ChallengeCardShell>
              )}

              {form.showLeaderboards && (
                <ChallengeCardShell title="Leaderboards" pc={pc}>
                  <div style={{ padding: "1.25rem" }}>
                    <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "#333", margin: "0 0 1rem" }}>{sn} Community Leaderboard</h4>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.5rem 0", borderBottom: "1px solid #e9e9e9", marginBottom: "0" }}>
                      <span style={{ color: sc, fontWeight: 600, fontSize: "0.88rem", minWidth: 130, textDecoration: "underline", cursor: "pointer" }}>Affiliation</span>
                      <span style={{ color: sc, fontWeight: 600, fontSize: "0.88rem", textDecoration: "underline", cursor: "pointer" }}># Donors ↓</span>
                    </div>
                    {MOCK_LEADERBOARD.slice(0, 2).map((r, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.75rem 0", borderBottom: "1px solid #e9e9e9" }}>
                        <span style={{ color: sc, fontWeight: 500, fontSize: "0.9rem", minWidth: 130, cursor: "pointer", textDecoration: "underline" }}>{r.affiliation}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ background: pc, borderRadius: 4, height: 28, width: Math.round((r.donors / maxLB) * 100) + "%", minWidth: 40, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 8, boxSizing: "border-box" }}>
                            <span style={{ color: "#fff", fontSize: "0.82rem", fontWeight: 700 }}>{r.donors}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div style={{ marginTop: "0.75rem" }}>
                      <span onClick={() => setActiveTab("leaderboards")} style={{ color: sc, fontSize: "0.9rem", fontWeight: 500, cursor: "pointer", textDecoration: "underline" }}>Show more</span>
                    </div>
                  </div>
                </ChallengeCardShell>
              )}

              <div style={{ marginTop: "1.5rem" }}>
                <p style={{ fontSize: "0.95rem", lineHeight: 1.8, color: "#555" }}>Your gift to the {fn} keeps this school running at its best. Tuition covers the basics. Your support covers everything else.</p>
                <p style={{ fontSize: "0.9rem", lineHeight: 1.8, color: "#777", fontStyle: "italic", marginTop: "1rem" }}>The fiscal year runs July 1 through June 30. You can give by card, ACH bank transfer, check, or stock transfer. For planned giving questions, reach out to the advancement office directly.</p>
                <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "#333", marginTop: "1rem" }}>Thank you for being part of this.</p>
              </div>
              <div style={{ marginTop: "2rem" }}>
                {ABOUT_UPDATES.map((u, i) => (
                  <div key={i} style={{ borderRadius: 4, overflow: "hidden", border: "1px solid #e9e9e9", marginBottom: "1rem" }}>
                    <div style={{ background: pc, color: "#fff", padding: "0.65rem 1rem", fontWeight: 700, fontSize: "0.88rem", display: "flex", justifyContent: "space-between" }}>
                      <span>{u.title}</span><span style={{ fontWeight: 400, opacity: 0.8 }}>{u.timeAgo}</span>
                    </div>
                    <div style={{ padding: "1rem", background: "#fff" }}>
                      <div style={{ fontSize: "0.78rem", color: "#999", marginBottom: "0.5rem" }}>{u.date}</div>
                      <p style={{ fontSize: "0.9rem", color: "#555", margin: 0, lineHeight: 1.7 }}>{u.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── FAQ ── */}
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

          {/* ── CHALLENGES ── */}
          {activeTab === "challenges" && form.showChallenges && (
            <div>
              <div style={{ marginBottom: "2rem" }}>
                <p style={{ fontSize: "1.1rem", fontWeight: 600, color: "#333", margin: "0 0 1rem" }}>Want to challenge other members of the community?</p>
                <ChallengeGiftButton />
              </div>

              <ChallengeCardShell title={ACTIVE_CHALLENGE.title} pc={pc}>
                <div style={{ padding: "1.5rem", display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
                  <ChallengeImage label={ACTIVE_CHALLENGE.label} image={ACTIVE_CHALLENGE.image} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "0.95rem", color: "#555", margin: "0 0 0.5rem", lineHeight: 1.7 }}>{ACTIVE_CHALLENGE.description}</p>
                    <p style={{ fontSize: "0.9rem", color: sc, margin: "0 0 1rem", fontWeight: 500 }}>{ACTIVE_CHALLENGE.hashtags}</p>
                    <ProgressBarWithArrow pct={ACTIVE_CHALLENGE.pct} color={pc} height={24} />
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
                    <ChallengeImage label={ch.label} image={ch.image} />
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

          {/* ── LEADERBOARDS ── */}
          {activeTab === "leaderboards" && form.showLeaderboards && (
            <div>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 700, color: "#333", margin: "0 0 1.5rem" }}>{sn} Community Leaderboard</h2>
              <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", padding: "0.75rem 0", borderBottom: "1px solid #e9e9e9" }}>
                <span style={{ color: sc, fontWeight: 600, fontSize: "0.95rem", minWidth: 150, textDecoration: "underline", cursor: "pointer" }}>Affiliation</span>
                <span style={{ color: sc, fontWeight: 600, fontSize: "0.95rem", textDecoration: "underline", cursor: "pointer" }}># Donors ↓</span>
              </div>
              {MOCK_LEADERBOARD.map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "1.5rem", padding: "0.85rem 0", borderBottom: "1px solid #e9e9e9" }}>
                  <span style={{ color: sc, fontWeight: 500, fontSize: "0.95rem", minWidth: 150, cursor: "pointer", textDecoration: "underline" }}>{r.affiliation}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ background: pc, borderRadius: 4, height: 32, width: Math.round((r.donors / maxLB) * 100) + "%", minWidth: 40, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 10, boxSizing: "border-box" }}>
                      <span style={{ color: "#fff", fontSize: "0.88rem", fontWeight: 700 }}>{r.donors}</span>
                    </div>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: "1rem" }}>
                <span style={{ color: sc, fontSize: "0.95rem", fontWeight: 500, cursor: "pointer", textDecoration: "underline" }}>Show more</span>
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
                    <ProgressBarPlain pct={c.pct} color={pc} height={26} />
                  </div>
                </div>
              ))}
              <div style={{ marginTop: "1rem" }}>
                <span style={{ color: sc, fontSize: "0.95rem", fontWeight: 500, cursor: "pointer", textDecoration: "underline" }}>Show more</span>
              </div>
            </div>
          )}

          {/* ── SUPPORTERS ── */}
          {activeTab === "supporters" && (
            <div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#333", margin: "0 0 1rem" }}>Supporters ({fmtC(suppCount)})</h3>
              <div style={{ marginBottom: "1.5rem" }}>
                <select value={supporterFilter} onChange={(e) => setSupporterFilter(e.target.value)} style={{ width: "100%", padding: "0.65rem 0.85rem", border: "1px solid #e0e0e0", borderRadius: 4, fontSize: "0.9rem", color: "#555", fontFamily: "inherit", background: "#fff" }}>
                  <option value="">All ({fmtC(suppCount)})</option>
                  {SUPPORTER_FILTER_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "1.25rem" }}>
                {filteredSupporters.map((s, i) => (
                  <div key={i} style={{ background: "#fff", border: "1px solid #e9e9e9", borderRadius: 4, padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    <div style={{ fontWeight: 700, color: "#333", fontSize: "1rem" }}>{s.name}</div>
                    {s.affiliations.map((a, j) => (
                      <span key={j} style={{ color: sc, fontSize: "0.88rem", cursor: "pointer", textDecoration: "underline" }}>{a}</span>
                    ))}
                    {s.quote && (
                      <div style={{ marginTop: "0.75rem", borderLeft: `4px solid ${pc}`, background: `${pc}12`, borderRadius: "0 4px 4px 0", padding: "0.75rem 1rem", display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                        <QuoteIcon color={pc} size={20} />
                        <p style={{ fontSize: "0.9rem", color: "#444", margin: 0, lineHeight: 1.6 }}>{s.quote}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── COMMENTS ── */}
          {activeTab === "comments" && (
            <div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#555", margin: "0 0 1.5rem", lineHeight: 1.4 }}>
                What do you love about {sn} and why do you support the {fn}?
              </h2>
              <div style={{ marginBottom: "0.75rem" }}>
                <label style={{ fontSize: "0.85rem", color: "#888", display: "block", marginBottom: "0.35rem" }}>Show comments by affiliation</label>
                <select value={commentFilter} onChange={(e) => setCommentFilter(e.target.value)} style={{ width: "100%", padding: "0.65rem 0.85rem", border: "1px solid #e0e0e0", borderRadius: 4, fontSize: "0.9rem", color: "#555", fontFamily: "inherit", background: "#fff" }}>
                  <option value="">Select affiliation(s)...</option>
                  {SUPPORTER_FILTER_OPTIONS.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: "1.75rem" }}>
                <label style={{ fontSize: "0.85rem", color: "#888", display: "block", marginBottom: "0.35rem" }}>Search by supporter name or message</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#999", fontSize: "0.95rem" }}>🔍</span>
                  <input type="text" placeholder="" style={{ width: "100%", padding: "0.65rem 0.85rem 0.65rem 2.25rem", border: "1px solid #e0e0e0", borderRadius: 4, fontSize: "0.9rem", fontFamily: "inherit", boxSizing: "border-box" }} />
                </div>
              </div>
              {(() => {
                const matchFilter = (aff) => {
                  if (!commentFilter) return true;
                  if (commentFilter === "Current Parent") return /^Parent/.test(aff);
                  if (commentFilter === "Past Parent") return /^Past Parent/.test(aff);
                  if (commentFilter === "Alumni") return /^Alumni/.test(aff);
                  return aff === commentFilter;
                };
                const sorted = [...MOCK_COMMENTS]
                  .sort((a, b) => (b.image ? 1 : 0) - (a.image ? 1 : 0))
                  .filter((c) => matchFilter(c.affiliation));
                const renderCard = (c, i) => (
                  <div key={i} style={{ background: "#fff", border: "1px solid #e9e9e9", borderRadius: 4, overflow: "hidden", marginBottom: "1.25rem" }}>
                    <div style={{ display: "flex", gap: "0.85rem", alignItems: "flex-start", padding: "1.25rem 1.25rem 0" }}>
                      <CrestIcon color={pc} size={42} logoUrl={logoPreview} />
                      <div>
                        <div style={{ fontWeight: 700, color: "#333", fontSize: "0.92rem" }}>{c.name} <span style={{ fontWeight: 400, color: "#777" }}>({c.affiliation})</span></div>
                        <div style={{ fontSize: "0.8rem", color: "#999" }}>{c.time}</div>
                      </div>
                    </div>
                    {c.image && (
                      <div style={{ marginTop: "1rem" }}>
                        <img src={c.image} alt="" style={{ width: "100%", display: "block", maxHeight: 280, objectFit: "cover" }} />
                      </div>
                    )}
                    <p style={{ fontSize: "0.92rem", color: "#555", margin: 0, padding: "0.85rem 1.25rem 1.25rem", lineHeight: 1.65 }}>{c.text}</p>
                  </div>
                );
                if (isMobile) {
                  return <div>{sorted.map(renderCard)}</div>;
                }
                const left = sorted.filter((_, i) => i % 2 === 0);
                const right = sorted.filter((_, i) => i % 2 === 1);
                return (
                  <div style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>{left.map(renderCard)}</div>
                    <div style={{ flex: 1 }}>{right.map(renderCard)}</div>
                  </div>
                );
              })()}
            </div>
          )}

          <div style={{ marginTop: "2.5rem" }}>
            <CTAButton />
          </div>
        </div>

        {/* ── SIDEBAR ── */}
        {showSidebar && !isMobile && (
          <div style={{ flex: "0 0 280px" }}>
            <RecentActivitySidebar pc={pc} />
          </div>
        )}
      </div>

      {/* ── FOOTER ── */}
      <div style={{ background: pc, marginTop: "3rem", padding: "3rem 1.5rem" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "center" }}>
            <LogoCard logoPreview={logoPreview} fn={fn} sn={sn} pc={pc} />
          </div>
          <div style={{ background: "#fff", borderRadius: 4, padding: "2rem 2.5rem", boxShadow: "0 4px 16px rgba(0,0,0,.15)" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#333", margin: "0 0 0.75rem" }}>Want this for {sn}?</h3>
            <p style={{ fontSize: "0.95rem", color: "#666", margin: "0 0 1.5rem", lineHeight: 1.6 }}>
              You just saw what your school's giving page could look like. We can have it live in days. Book a 20-minute demo to see the full donor experience.
            </p>
            <a href={`https://www.boostmyschool.com/demo?utm_source=lead-magnet&utm_medium=footer&utm_campaign=${encodeURIComponent(sn)}`} target="_blank" rel="noreferrer" style={{ display: "inline-block", padding: "0.9rem 2.5rem", background: sc, color: "#fff", borderRadius: 4, fontSize: "0.95rem", fontWeight: 700, textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Book a Demo for {sn}
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
