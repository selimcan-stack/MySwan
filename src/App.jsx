import { useState, useEffect, useRef } from "react";

// ── Google Fonts & Font Presets ─────────────────────────────
const FONT_PRESETS = [
  { id: "modern", name: "Modern", sample: "Aa", import: "Montserrat:wght@400;500;600;700;800", display: "'Playfair Display', Georgia, serif", heading: "'Montserrat', sans-serif", body: "'Montserrat', sans-serif" },
  { id: "elegant", name: "Zarif", sample: "Aa", import: "Cormorant+Garamond:wght@400;500;600;700&family=Lato:wght@400;700", display: "'Cormorant Garamond', Georgia, serif", heading: "'Cormorant Garamond', serif", body: "'Lato', sans-serif" },
  { id: "playful", name: "Eğlenceli", sample: "Aa", import: "Quicksand:wght@400;500;600;700&family=Pacifico", display: "'Pacifico', cursive", heading: "'Quicksand', sans-serif", body: "'Quicksand', sans-serif" },
  { id: "minimal", name: "Minimal", sample: "Aa", import: "DM+Sans:wght@400;500;600;700&family=DM+Serif+Display", display: "'DM Serif Display', Georgia, serif", heading: "'DM Sans', sans-serif", body: "'DM Sans', sans-serif" },
  { id: "classic", name: "Klasik", sample: "Aa", import: "Merriweather:wght@400;700;900&family=Source+Sans+3:wght@400;600;700", display: "'Merriweather', Georgia, serif", heading: "'Source Sans 3', sans-serif", body: "'Source Sans 3', sans-serif" },
  { id: "soft", name: "Yumuşak", sample: "Aa", import: "Nunito:wght@400;500;600;700;800&family=Abril+Fatface", display: "'Abril Fatface', Georgia, serif", heading: "'Nunito', sans-serif", body: "'Nunito', sans-serif" },
];

// Mutable font ref — updated by App on each render
const F = {
  display: "'Playfair Display', Georgia, serif",
  heading: "'Montserrat', sans-serif",
  body: "'Montserrat', sans-serif",
};

// Default FontLoader (will be overridden per-render in App)
let _currentFontImport = "Montserrat:wght@400;500;600;700;800";
function FontLoader() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=${_currentFontImport}&display=swap');
      input:focus { border-color: #e91e8c !important; box-shadow: 0 4px 20px rgba(233,30,140,0.15) !important; }
      input::placeholder { color: #bbb; opacity: 1; }
    `}</style>
  );
}

// ── Theme ──────────────────────────────────────────────────
const PALETTES = [
  { id: "rose", name: "Gül", emoji: "🌹", accent: "#e91e8c", accent2: "#ff6b9d", soft: "#fce7f3", softer: "#fff0f5", label: "#c06080" },
  { id: "lavender", name: "Lavanta", emoji: "💜", accent: "#7c3aed", accent2: "#a78bfa", soft: "#ede9fe", softer: "#f5f3ff", label: "#6d28d9" },
  { id: "ocean", name: "Okyanus", emoji: "🌊", accent: "#0891b2", accent2: "#22d3ee", soft: "#cffafe", softer: "#ecfeff", label: "#0e7490" },
  { id: "sunset", name: "Gün Batımı", emoji: "🌅", accent: "#ea580c", accent2: "#fb923c", soft: "#ffedd5", softer: "#fff7ed", label: "#c2410c" },
  { id: "forest", name: "Orman", emoji: "🌿", accent: "#059669", accent2: "#34d399", soft: "#d1fae5", softer: "#ecfdf5", label: "#047857" },
  { id: "cherry", name: "Kiraz", emoji: "🍒", accent: "#dc2626", accent2: "#f87171", soft: "#fee2e2", softer: "#fef2f2", label: "#b91c1c" },
];

function makeLight(p) {
  return {
    bg: `linear-gradient(135deg, ${p.softer} 0%, ${p.soft} 50%, ${p.softer} 100%)`,
    onboardBg: `linear-gradient(160deg, ${p.softer} 0%, ${p.soft} 60%, ${p.softer} 100%)`,
    card: "white", cardBorder: `${p.accent}20`, cardShadow: `0 2px 12px ${p.accent}10`,
    text: "#333", textSec: "#888", textMuted: "#aaa", textPlaceholder: "#ccc",
    accent: p.accent, accentGrad: `linear-gradient(135deg, ${p.accent}, ${p.accent2})`,
    softBg: `linear-gradient(135deg, ${p.soft}, ${p.soft}cc)`,
    softBg2: `linear-gradient(135deg, ${p.softer}, ${p.soft})`,
    inputBg: p.softer, inputBorder: p.soft,
    navBg: "rgba(255,255,255,0.72)", navBorder: `${p.accent}20`, navShadow: `0 -6px 28px ${p.accent}10`,
    modalBg: "white", modalOverlay: "rgba(0,0,0,0.4)",
    bubble1: `${p.accent}18`, bubble2: `${p.accent2}15`,
    labelColor: p.label, dayColor: "#555",
    checkDone: "#d4edda", checkDoneText: "#2d6a4f",
  };
}

function makeDark(p) {
  return {
    bg: "linear-gradient(135deg, #121218 0%, #1c1c2e 50%, #121218 100%)",
    onboardBg: "linear-gradient(160deg, #121218 0%, #1c1c2e 60%, #121218 100%)",
    card: "#1e1e2d", cardBorder: `${p.accent}15`, cardShadow: "0 2px 12px rgba(0,0,0,0.25)",
    text: "#f4f0fa", textSec: "#c8c0d8", textMuted: "#908898", textPlaceholder: "#605870",
    accent: p.accent2, accentGrad: `linear-gradient(135deg, ${p.accent2}, ${p.accent})`,
    softBg: "linear-gradient(135deg, #282840, #322850)",
    softBg2: "linear-gradient(135deg, #1c1c2e, #282840)",
    inputBg: "#1e1e2d", inputBorder: "#3a3855",
    navBg: "rgba(18,18,24,0.85)", navBorder: `${p.accent}12`, navShadow: "0 -6px 28px rgba(0,0,0,0.35)",
    modalBg: "#1e1e2d", modalOverlay: "rgba(0,0,0,0.6)",
    bubble1: `${p.accent2}08`, bubble2: `${p.accent}06`,
    labelColor: "#e0b8d4", dayColor: "#d0c8e0",
    checkDone: "#1a3328", checkDoneText: "#6ee7a0",
  };
}

const DEFAULT_CARDS = [
  { id: 1, icon: "🌸", label: "EN SEVDİĞİ ÇİÇEK", value: "", prompt: "En sevdiği çiçeği biliyor musun?", toast: "Harika! Bir sonraki sürprizin ipucu cebinde. 🌸" },
  { id: 2, icon: "☕", label: "KAHVE TERCİHİ", value: "", prompt: "Kahvesini nasıl içer?", toast: "Artık kahve siparişlerinde hata payı sıfır! ☕" },
  { id: 3, icon: "💍", label: "YÜZÜK ÖLÇÜSÜ", value: "", prompt: "Yüzük ölçüsünü not et!", toast: "Bu bilgi çok kritik... Sırrın benimle güvende! 💍" },
  { id: 4, icon: "⚠️", label: "ÖNEMLİ NOT", value: "", prompt: "Unutmaması gereken bir şey?", toast: "Not edildi! Artık hiçbir detayı kaçırmayacaksın. ⚠️" },
  { id: 5, icon: "🍮", label: "TATLI", value: "", prompt: "Hangi tatlıya bayılır?", toast: "Tatlı krizlerinde artık hazırsın! 🍮" },
  { id: 6, icon: "🩸", label: "KAN GRUBU", value: "", prompt: "Kan grubunu biliyor musun?", toast: "Bunu kaydettim, umarım hiç ihtiyacımız olmaz! ❤️" },
  { id: 7, icon: "🥗", label: "YEMEK", value: "", prompt: "En sevdiği yemeği biliyor musun?", toast: "Acıktığınızda ne sipariş edeceğimizi biliyorum. 🍕" },
  { id: 8, icon: "🎵", label: "SANATÇI", value: "", prompt: "En çok kimi dinler?", toast: "Playlist'iniz artık daha anlamlı olacak. 🎵" },
];

const MONTHS = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];
const DAYS_TR = ["Pt","Sa","Ça","Pe","Cu","Ct","Pz"];

function getDaysDiff(dateStr) {
  if (!dateStr) return 0;
  return Math.max(0, Math.floor((new Date() - new Date(dateStr)) / 864e5));
}
function getDaysLeft(dateStr) {
  const now = new Date(); now.setHours(0,0,0,0);
  const t = new Date(dateStr); t.setFullYear(now.getFullYear());
  if (t < now) t.setFullYear(now.getFullYear() + 1);
  return Math.ceil((t - now) / 864e5);
}
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

const mkInput = (T) => ({
  width: "100%", padding: "16px 20px", borderRadius: 14,
  border: `1.5px solid ${T.inputBorder}`, fontSize: 15,
  fontFamily: F.body, outline: "none", boxSizing: "border-box",
  background: T.inputBg, color: T.text,
  boxShadow: `0 2px 12px ${T.accent}08`,
  transition: "border-color 0.25s, box-shadow 0.25s",
});
const mkBtn = (T) => ({
  background: T.accentGrad, color: "white", border: "none", borderRadius: 14,
  padding: "14px", fontSize: 15, fontWeight: 600, cursor: "pointer",
  fontFamily: F.body, boxShadow: `0 4px 16px ${T.accent}50`,
});

// ── Custom DatePicker ──────────────────────────────────────
function CustomDatePicker({ value, onChange, T }) {
  const [isOpen, setIsOpen] = useState(false);
  const [textValue, setTextValue] = useState("");
  const ref = useRef(null);
  const today = new Date();
  const parsed = value ? new Date(value) : null;
  const [viewYear, setViewYear] = useState(parsed ? parsed.getFullYear() : today.getFullYear());
  const [viewMonth, setViewMonth] = useState(parsed ? parsed.getMonth() : today.getMonth());

  useEffect(() => {
    if (parsed) setTextValue(`${String(parsed.getDate()).padStart(2,"0")}.${String(parsed.getMonth()+1).padStart(2,"0")}.${parsed.getFullYear()}`);
    else setTextValue("");
  }, [value]);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isSel = (d) => parsed && parsed.getFullYear() === viewYear && parsed.getMonth() === viewMonth && parsed.getDate() === d;
  const isTod = (d) => d && today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === d;

  const selectDay = (d) => {
    onChange(`${viewYear}-${String(viewMonth+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`);
    setIsOpen(false);
  };
  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y-1); } else setViewMonth(m => m-1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y+1); } else setViewMonth(m => m+1); };

  const handleTextChange = (e) => {
    let digits = e.target.value.replace(/[^0-9.]/g, "").replace(/\./g, "");
    if (digits.length > 8) digits = digits.slice(0, 8);
    let f = "";
    for (let i = 0; i < digits.length; i++) { if (i === 2 || i === 4) f += "."; f += digits[i]; }
    setTextValue(f);
    if (digits.length === 8) {
      const day = +digits.slice(0,2), month = +digits.slice(2,4), year = +digits.slice(4,8);
      if (month >= 1 && month <= 12 && day >= 1 && year >= 1900 && year <= 2100) {
        const mx = new Date(year, month, 0).getDate();
        if (day <= mx) { onChange(`${year}-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}`); setViewYear(year); setViewMonth(month-1); }
      }
    }
  };

  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      {/* Modern rounded input */}
      <div style={{
        display: "flex", alignItems: "stretch",
        border: `2px solid ${isOpen ? T.accent : T.inputBorder}`,
        borderRadius: 16, background: T.inputBg, transition: "all 0.3s",
        boxShadow: isOpen ? `0 4px 20px ${T.accent}20` : `0 2px 12px ${T.accent}08`,
      }}>
        <input type="text" inputMode="numeric" value={textValue} onChange={handleTextChange}
          placeholder="gg.aa.yyyy"
          onFocus={() => {}}
          style={{ flex: 1, padding: "16px 18px", border: "none", outline: "none", background: "transparent",
            fontSize: 16, fontFamily: F.body, fontWeight: 500, color: T.text, textAlign: "left", boxSizing: "border-box",
            letterSpacing: "0.5px", minWidth: 0 }} />
        <button onClick={() => { setIsOpen(o => !o); if (parsed) { setViewYear(parsed.getFullYear()); setViewMonth(parsed.getMonth()); } }}
          style={{ width: 52, border: "none", cursor: "pointer", flexShrink: 0,
            background: isOpen ? T.accentGrad : T.softBg, display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.3s", borderRadius: "0 14px 14px 0", borderLeft: `1px solid ${T.inputBorder}` }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4" width="18" height="18" rx="4" stroke={isOpen ? "white" : T.accent} strokeWidth="1.8" fill="none"/>
            <path d="M3 10h18" stroke={isOpen ? "white" : T.accent} strokeWidth="1.8"/>
            <circle cx="8" cy="15" r="1.2" fill={isOpen ? "white" : T.accent}/><circle cx="12" cy="15" r="1.2" fill={isOpen ? "white" : T.accent} opacity="0.4"/><circle cx="16" cy="15" r="1.2" fill={isOpen ? "white" : T.accent} opacity="0.4"/>
            <path d="M8 2v4M16 2v4" stroke={isOpen ? "white" : T.accent} strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Bottom sheet calendar overlay */}
      {isOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 250, display: "flex", alignItems: "flex-end", justifyContent: "center", backdropFilter: "blur(4px)" }}
          onClick={() => setIsOpen(false)}>
          <div style={{
            position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
            background: T.card, borderRadius: "28px 28px 0 0", width: "100%", maxWidth: 430,
            boxShadow: `0 -12px 48px rgba(0,0,0,0.15)`,
            animation: "dateSheetUp 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
            paddingBottom: 24, maxHeight: "75vh", overflowY: "auto", WebkitOverflowScrolling: "touch"
          }} onClick={e => e.stopPropagation()}>
            <style>{`@keyframes dateSheetUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>

            {/* Handle bar */}
            <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 8px" }}>
              <div style={{ width: 40, height: 4, borderRadius: 2, background: T.inputBorder }} />
            </div>

            {/* Month/Year header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 24px 12px" }}>
              <button onClick={prevMonth} style={{ width: 40, height: 40, borderRadius: 12, border: "none", cursor: "pointer", background: T.softBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: T.accent, fontWeight: 700 }}>‹</button>
              <div>
                <span style={{ fontSize: 18, fontWeight: 800, fontFamily: F.heading, color: T.accent }}>{MONTHS[viewMonth]}</span>
                <span style={{ fontSize: 16, fontWeight: 600, color: T.labelColor, marginLeft: 8 }}>{viewYear}</span>
              </div>
              <button onClick={nextMonth} style={{ width: 40, height: 40, borderRadius: 12, border: "none", cursor: "pointer", background: T.softBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: T.accent, fontWeight: 700 }}>›</button>
            </div>

            {/* Day names */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", padding: "4px 20px 2px" }}>
              {DAYS_TR.map(d => <div key={d} style={{ textAlign: "center", fontSize: 12, fontWeight: 700, fontFamily: F.body, color: T.accent, padding: "6px 0", opacity: 0.5 }}>{d}</div>)}
            </div>

            {/* Day grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", padding: "4px 16px 16px", gap: 4 }}>
              {cells.map((d, i) => (
                <button key={i} disabled={!d} onClick={() => d && selectDay(d)} style={{
                  width: "100%", aspectRatio: "1", border: "none", cursor: d ? "pointer" : "default", borderRadius: 14,
                  fontSize: 15, fontWeight: isSel(d) ? 800 : isTod(d) ? 700 : 500, fontFamily: F.body,
                  background: isSel(d) ? T.accentGrad : isTod(d) ? T.softBg : "transparent",
                  color: isSel(d) ? "white" : isTod(d) ? T.accent : d ? T.dayColor : "transparent",
                  boxShadow: isSel(d) ? `0 4px 14px ${T.accent}40` : "none",
                  transition: "all 0.15s", display: "flex", alignItems: "center", justifyContent: "center"
                }}>{d || ""}</button>
              ))}
            </div>

            {/* Today shortcut */}
            <div style={{ padding: "0 20px 4px", display: "flex", justifyContent: "center" }}>
              <button onClick={() => { setViewYear(today.getFullYear()); setViewMonth(today.getMonth()); selectDay(today.getDate()); }}
                style={{ background: T.softBg, border: "none", borderRadius: 12, padding: "10px 28px", fontSize: 13, color: T.accent, fontWeight: 700, cursor: "pointer", fontFamily: F.body }}>Bugün</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Onboarding ─────────────────────────────────────────────
function OnboardingScreen({ onFinish, T }) {
  const [step, setStep] = useState(0);
  const [gender, setGender] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const isMale = gender === "male";
  const IS = mkInput(T); const BS = mkBtn(T);

  const steps = [
    { emoji: "💕", title: "Hoş Geldiniz!", subtitle: "Sevgilinizle birlikte geçirdiğiniz her anı burada saklayın.",
      content: <p style={{ color: T.textSec, fontSize: 14, lineHeight: 1.5, textAlign: "center", margin: 0 }}>Başlamadan önce sevgilinizle ilgili birkaç bilgi alalım; sadece birkaç adımda hazırsınız!</p>, canNext: true },
    { emoji: "💑", title: "Seni Tanıyalım", subtitle: "Her şeyi senin için özelleştirelim.",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%" }}>
          {[{ value: "female", gradient: "linear-gradient(135deg, #f093fb, #e91e8c)", label: "Kadın", accent: "#e91e8c",
              icon: (active) => (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" stroke={active ? "white" : "#e91e8c"}>
                  <circle cx="12" cy="8" r="5"/><path d="M12 13v7M9 18h6"/>
                </svg>
              )},
            { value: "male", gradient: "linear-gradient(135deg, #667eea, #764ba2)", label: "Erkek", accent: "#7c3aed",
              icon: (active) => (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" stroke={active ? "white" : "#7c3aed"}>
                  <circle cx="10" cy="14" r="5"/><path d="M14.5 9.5L19 5M19 5h-4.5M19 5v4.5"/>
                </svg>
              )}
          ].map(opt => {
            const active = gender === opt.value;
            return (
            <button key={opt.value} onClick={() => setGender(opt.value)} style={{
              width: "100%", padding: "20px 22px", borderRadius: 22, cursor: "pointer",
              border: active ? `2px solid ${opt.accent}` : "2px solid transparent",
              fontFamily: F.body, textAlign: "left", boxSizing: "border-box",
              background: active ? `${opt.accent}0A` : T.card,
              boxShadow: active
                ? `0 8px 32px ${opt.accent}20, 0 2px 8px ${opt.accent}10`
                : "0 4px 24px rgba(0,0,0,0.04), 0 1px 6px rgba(0,0,0,0.02)",
              transition: "all 0.3s ease", display: "flex", alignItems: "center", gap: 16,
              transform: active ? "scale(1.02)" : "scale(1)"
            }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, flexShrink: 0, background: active ? opt.gradient : T.softBg, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s" }}>{opt.icon(active)}</div>
              <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 18, fontFamily: F.heading, color: active ? opt.accent : T.text, transition: "color 0.3s" }}>{opt.label}</div></div>
              {active && <div style={{ width: 26, height: 26, borderRadius: "50%", background: opt.accent, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 13, fontWeight: 800 }}>✓</div>}
            </button>
            );
          })}
        </div>
      ), canNext: gender !== "" },
    { emoji: isMale ? "🌸" : "💙", title: "Sevgilinizin Adı", subtitle: "Ona nasıl hitap ediyorsunuz?",
      content: <input placeholder={isMale ? "Örn: Ayşe Yıldız" : "Örn: Ahmet Yıldız"} value={partnerName} onChange={e => setPartnerName(e.target.value)} style={{ ...IS, textAlign: "center", fontSize: 18, padding: "18px 20px", fontWeight: 500 }} />, canNext: partnerName.trim().length > 0 },
    { emoji: "📅", title: "Mutluluğunuz Ne Zaman Başladı?", subtitle: "Bu tarihten itibaren birlikte geçen günler sayılacak.",
      content: <CustomDatePicker value={startDate} onChange={v => setStartDate(v)} T={T} />, canNext: startDate.length > 0 },
    { emoji: "🎂", title: "En Özel Günü Unutmayalım", subtitle: "Yaklaşan günler listesine otomatik eklenecek.",
      content: <CustomDatePicker value={birthDate} onChange={v => setBirthDate(v)} T={T} />, canNext: true },
  ];
  const cur = steps[step];
  const [slideDir, setSlideDir] = useState("right"); // "right" = forward, "left" = back
  const [animKey, setAnimKey] = useState(0);

  const goNext = () => {
    if (!cur.canNext) return;
    if (step < steps.length - 1) { setSlideDir("right"); setAnimKey(k => k + 1); setTimeout(() => setStep(s => s + 1), 10); }
    else { onFinish({ partnerName: partnerName.trim(), startDate, gender, birthDate }); }
  };
  const goBack = () => {
    if (step > 0) { setSlideDir("left"); setAnimKey(k => k + 1); setTimeout(() => setStep(s => s - 1), 10); }
  };

  return (
    <div style={{ minHeight: "100vh", background: T.onboardBg, display: "flex", flexDirection: "column", alignItems: "center", fontFamily: F.body, position: "relative", overflow: "hidden" }}>
      <FontLoader />
      <style>{`
        @keyframes emojiGlow {
          0%, 100% { filter: drop-shadow(0 6px 20px rgba(233,30,140,0.2)); transform: scale(1); }
          50% { filter: drop-shadow(0 8px 28px rgba(233,30,140,0.35)); transform: scale(1.05); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(60px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-60px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
      {/* Decorative blurred circles */}
      <div style={{ position: "fixed", top: -80, right: -80, width: 280, height: 280, borderRadius: "50%", background: "rgba(233,30,140,0.07)", filter: "blur(60px)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: -100, left: -100, width: 320, height: 320, borderRadius: "50%", background: "rgba(255,107,157,0.06)", filter: "blur(70px)", pointerEvents: "none" }} />

      {/* Top content with slide animation */}
      <div key={`step-${step}-${animKey}`} style={{
        flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
        paddingTop: 60, paddingLeft: 32, paddingRight: 32, paddingBottom: 120,
        width: "100%", boxSizing: "border-box",
        animation: `${slideDir === "right" ? "slideInRight" : "slideInLeft"} 0.4s cubic-bezier(0.22, 1, 0.36, 1) both`
      }}>
        <div style={{ fontSize: 80, marginBottom: 24, animation: "emojiGlow 3s ease-in-out infinite" }}>{cur.emoji}</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 44, alignItems: "center" }}>
          {steps.map((_, i) => <div key={i} style={{
            width: i === step ? 28 : 10,
            height: 10,
            borderRadius: 99,
            background: i === step ? T.accentGrad : T.accent,
            opacity: i === step ? 1 : 0.3,
            transition: "all 0.35s ease",
            boxShadow: i === step ? `0 2px 8px ${T.accent}50` : "none"
          }} />)}
        </div>
        <h1 style={{ fontSize: 30, fontWeight: 800, fontFamily: F.heading, color: T.text, textAlign: "center", margin: "0 0 12px", letterSpacing: "-0.5px" }}>{cur.title}</h1>
        <p style={{ color: T.textSec, textAlign: "center", fontSize: 16, marginBottom: 24, lineHeight: 1.5 }}>{cur.subtitle}</p>
        <div style={{ width: "100%", maxWidth: 320 }}>{cur.content}</div>
      </div>

      {/* Bottom sticky button area */}
      <div style={{
        position: "sticky", bottom: 0, width: "100%", boxSizing: "border-box",
        padding: "16px 32px 32px",
        background: `linear-gradient(to top, ${T.onboardBg.includes("#1a1020") ? "#1a1020" : "#fff0f5"} 60%, transparent)`,
        display: "flex", flexDirection: "column", alignItems: "center", zIndex: 10
      }}>
        <button disabled={!cur.canNext} onClick={goNext} style={{
          background: cur.canNext
            ? (step === steps.length - 1
              ? "linear-gradient(135deg, #d6006e, #e91e8c, #ff6b9d, #ff8fab)"
              : T.accentGrad)
            : T.inputBorder,
          backgroundSize: (step === steps.length - 1 && cur.canNext) ? "200% auto" : "auto",
          animation: (step === steps.length - 1 && cur.canNext) ? "shimmer 2.5s linear infinite" : "none",
          color: cur.canNext ? "white" : T.textMuted,
          border: "none", borderRadius: 16,
          padding: "16px 0", fontSize: 18, fontWeight: 600, fontFamily: F.body,
          cursor: cur.canNext ? "pointer" : "not-allowed",
          width: "80%", maxWidth: 320,
          boxShadow: cur.canNext ? "0 10px 24px rgba(233, 30, 140, 0.35)" : "none",
          opacity: 1,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          transition: "all 0.4s ease",
          transform: cur.canNext ? "scale(1)" : "scale(0.97)"
        }}>
          <span>{step === steps.length - 1 ? "Başla" : "Devam"}</span>
          <span style={{ fontSize: step === steps.length - 1 ? 20 : 14, transition: "font-size 0.3s" }}>{step === steps.length - 1 ? "💕" : "→"}</span>
        </button>
        {step > 0 && <button onClick={goBack} style={{ marginTop: 20, background: "none", border: "none", color: T.textSec, fontSize: 15, fontWeight: 500, cursor: "pointer", fontFamily: F.body, letterSpacing: "0.2px" }}>← Geri</button>}
      </div>
    </div>
  );
}

// ── EmojiPicker ────────────────────────────────────────────
const EMOJI_CATEGORIES = [
  { label: "Sevgi 💕", emojis: ["❤️","🧡","💛","💚","💙","💜","🖤","🤍","💗","💓","💞","💕","💘","💝","💖","💟","♥️","❣️","😍","🥰","😘","💏","💑","👫","🌹","💐","🌸","🌺","🌻","🌼","🌷","💒","🎀","🎁","🎊","🎉","🥂","🍾","✨","🌟","⭐","💫","🌙"] },
  { label: "Kutlama 🎉", emojis: ["🎂","🎁","🎊","🎉","🎈","🎀","🥳","🍰","🧁","🥂","🍾","🎆","🎇","🎃","🎄","🎭","🎨","🎬","🎤","🎧","🎹","🎸","🎯","🎮","🎲"] },
  { label: "Seyahat ✈️", emojis: ["✈️","🚀","🚗","🏖️","🏔️","🌍","🗺️","🏕️","🏝️","🏛️","🗼","🗽","⛩️","🌅","🌄","🌇","🌆","🌃","🌉","🎢","🎡","🚢","🛳️","🚂","🚁"] },
  { label: "Yemek 🍕", emojis: ["🍕","🍔","🌮","🍳","🥘","🍲","🥗","🍱","🍜","🍝","🍣","🍦","🍩","🍪","🎂","🍰","🧁","🍫","🍬","🍭","🍮","☕","🍵","🍷","🥂","🥤","🧋"] },
  { label: "Doğa 🌿", emojis: ["🌿","🍀","🌱","🌲","🌳","🌴","🍃","🍂","🍁","💐","🌹","🌸","🌼","🌻","🌈","☀️","🌙","⭐","❄️","🌊","🔥","🦋","🐦","🌺","🍄"] },
  { label: "Semboller ⭐", emojis: ["⭐","🌟","💫","✨","🔥","💥","❄️","🌈","☀️","🌙","⚡","🎵","🎶","💡","🔔","💎","🎯","🏹","🧿","♾️","✅","❤️‍🔥","🫶","🤞","🤙"] },
];

function EmojiPicker({ selected, onSelect, T }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openCat, setOpenCat] = useState(null);

  return (
    <div>
      <button onClick={() => setIsOpen(o => !o)} style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: `1.5px solid ${isOpen ? T.accent : T.inputBorder}`, background: T.inputBg, cursor: "pointer", fontFamily: F.body, display: "flex", alignItems: "center", gap: 12, boxSizing: "border-box", transition: "all 0.2s" }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: T.softBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{selected}</div>
        <span style={{ flex: 1, textAlign: "left", fontSize: 14, color: T.labelColor, fontWeight: 600 }}>Emoji Seç</span>
        <span style={{ fontSize: 12, color: T.textPlaceholder, transition: "transform 0.2s", display: "inline-block", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
      </button>
      {isOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 250, display: "flex", alignItems: "flex-end", justifyContent: "center", backdropFilter: "blur(4px)" }}
          onClick={() => setIsOpen(false)}>
          <div style={{
            position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
            background: T.card, borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 430,
            boxShadow: `0 -12px 48px rgba(0,0,0,0.15)`,
            maxHeight: "60vh", display: "flex", flexDirection: "column",
            animation: "emojiUp 0.3s cubic-bezier(0.22, 1, 0.36, 1)"
          }} onClick={e => e.stopPropagation()}>
            <style>{`@keyframes emojiUp{from{transform:translateX(-50%) translateY(100%)}to{transform:translateX(-50%) translateY(0)}}`}</style>
            {/* Handle bar + header */}
            <div style={{ flexShrink: 0 }}>
              <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
                <div style={{ width: 40, height: 4, borderRadius: 2, background: T.inputBorder }} />
              </div>
              <div style={{ padding: "8px 16px 10px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${T.inputBorder}` }}>
                <span style={{ fontSize: 15, fontWeight: 700, fontFamily: F.heading, color: T.accent }}>Emoji Seç</span>
                <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: T.textMuted, padding: 4 }}>✕</button>
              </div>
            </div>
            {/* Scrollable emoji list */}
            <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
              {EMOJI_CATEGORIES.map((cat, i) => (
                <div key={i}>
                  <button onClick={() => setOpenCat(openCat === i ? null : i)} style={{ width: "100%", padding: "12px 16px", border: "none", cursor: "pointer", background: openCat === i ? T.softBg : T.card, display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: F.body, fontSize: 14, fontWeight: 700, color: openCat === i ? T.accent : T.textSec, borderBottom: `1px solid ${T.inputBorder}` }}>
                    <span>{cat.label}</span><span style={{ fontSize: 11, transform: openCat === i ? "rotate(180deg)" : "rotate(0deg)", display: "inline-block", transition: "transform 0.2s" }}>▼</span>
                  </button>
                  {openCat === i && <div style={{ display: "flex", flexWrap: "wrap", gap: 4, padding: 12, background: T.inputBg, borderBottom: `1px solid ${T.inputBorder}` }}>
                    {cat.emojis.map((em, j) => <button key={j} onClick={() => { onSelect(em); setIsOpen(false); }} style={{ width: 42, height: 42, border: "none", cursor: "pointer", borderRadius: 10, background: selected === em ? T.softBg : "transparent", fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center", outline: selected === em ? `2px solid ${T.accent}` : "none" }}>{em}</button>)}
                  </div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Modal ──────────────────────────────────────────────────
function Modal({ onClose, title, children, T }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: T.modalOverlay, display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 200, backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div style={{ background: T.modalBg, borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 430, maxHeight: "85dvh", boxShadow: "0 -8px 40px rgba(0,0,0,0.15)", overflow: "hidden", display: "flex", flexDirection: "column" }} onClick={e => e.stopPropagation()}>
        {/* Fixed header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 24px 12px", flexShrink: 0, borderBottom: `1px solid ${T.inputBorder}` }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, fontFamily: F.heading, color: T.text }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: T.textMuted, padding: 4 }}>✕</button>
        </div>
        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch", padding: "16px 24px 36px", display: "flex", flexDirection: "column", gap: 12 }}>{children}</div>
      </div>
    </div>
  );
}

// ── HomeTab ────────────────────────────────────────────────
function HomeTab({ partnerName, days, events, showAll, setShowAll, heartAnim, onSettings, T, isFirstVisit, plans, setPlans }) {
  const [displayDays, setDisplayDays] = useState(0);
  const [glowPunch, setGlowPunch] = useState(false);
  const hasAnimated = useRef(false);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [planTitle, setPlanTitle] = useState("");
  const [planDate, setPlanDate] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    if (hasAnimated.current && !isFirstVisit) { setDisplayDays(days); return; }
    hasAnimated.current = true;
    const target = days;
    const duration = 2000;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const p = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplayDays(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(tick);
      else {
        setDisplayDays(target);
        setGlowPunch(true);
        setTimeout(() => setGlowPunch(false), 600);
      }
    };
    requestAnimationFrame(tick);
  }, [days]);

  return (
    <div style={{ padding: "0 16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 0 12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 22, transition: "transform 0.3s", transform: heartAnim ? "scale(1.2)" : "scale(1)" }}>❤️</span>
          <span style={{ fontSize: 17, fontWeight: 600, fontFamily: F.heading, color: T.text }}>{partnerName}</span>
        </div>
        <button onClick={onSettings} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer" }}>⚙️</button>
      </div>
      <div style={{ background: T.softBg2, borderRadius: 24, padding: "28px 24px", textAlign: "center", boxShadow: T.cardShadow, border: `1px solid ${T.cardBorder}`, marginBottom: 24, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -20, right: -20, fontSize: 80, opacity: 0.06 }}>💕</div>
        <p style={{ color: T.labelColor, fontSize: 11, letterSpacing: 3, fontWeight: 600, marginBottom: 8 }}>BİRLİKTE GEÇEN GÜNLER</p>
        <div style={{
          fontSize: 80, fontWeight: 700, fontFamily: F.display, color: T.accent, lineHeight: 1, letterSpacing: -3,
          textShadow: glowPunch ? `0 0 40px ${T.accent}, 0 0 80px ${T.accent}60` : `0 2px 24px ${T.accent}25`,
          transform: glowPunch ? "scale(1.08)" : "scale(1)",
          transition: "all 0.3s ease-out"
        }}>{displayDays.toLocaleString("tr-TR")}</div>
        <p style={{ color: T.labelColor, fontSize: 13, marginTop: 8 }}>Gün boyunca her anı seninle ✨</p>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h2 style={{ fontSize: 17, fontWeight: 600, fontFamily: F.heading, color: T.text, margin: 0 }}>Yaklaşan Günler</h2>
        <button onClick={() => setShowAll(s => !s)} style={{ background: "none", border: "none", color: T.accent, fontSize: 13, cursor: "pointer", fontFamily: F.body }}>{showAll ? "Daha Az" : "Tümünü Gör"}</button>
      </div>
      {events.length === 0 && <div style={{ textAlign: "center", padding: "32px 0", color: T.textPlaceholder }}><div style={{ fontSize: 36 }}>🗓️</div><p style={{ fontSize: 13, marginTop: 8 }}>Henüz özel gün eklenmedi.</p></div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {events.map(ev => (
          <div key={ev.id} style={{ background: T.card, borderRadius: 16, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14, boxShadow: T.cardShadow, border: `1px solid ${T.cardBorder}` }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: T.softBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{ev.icon}</div>
            <div style={{ flex: 1 }}><p style={{ margin: 0, fontWeight: 700, color: T.text, fontSize: 15 }}>{ev.title}</p><p style={{ margin: 0, color: T.textMuted, fontSize: 12, marginTop: 2 }}>{formatDate(ev.date)}</p></div>
            <div style={{ background: T.softBg, color: T.accent, borderRadius: 10, padding: "4px 10px", fontSize: 12, fontWeight: 700 }}>{getDaysLeft(ev.date)} KALDI</div>
          </div>
        ))}
      </div>

      {/* ── Ortak Takvim ── */}
      <div style={{ marginTop: 28 }}>
        <button onClick={() => setCalendarOpen(o => !o)} style={{
          width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: calendarOpen ? 12 : 0, padding: "12px 16px",
          background: T.card, border: `1px solid ${T.cardBorder}`, borderRadius: 16,
          cursor: "pointer", boxShadow: T.cardShadow, fontFamily: F.body, transition: "all 0.3s"
        }}>
          <span style={{ fontSize: 15, fontWeight: 600, fontFamily: F.heading, color: T.text }}>📅 Ortak Takvim</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {plans.length > 0 && <span style={{ fontSize: 11, fontWeight: 600, color: T.accent, background: `${T.accent}15`, padding: "2px 8px", borderRadius: 8 }}>{plans.length} plan</span>}
            <span style={{ fontSize: 12, color: T.textMuted, transition: "transform 0.3s", display: "inline-block", transform: calendarOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
          </div>
        </button>

        {calendarOpen && (<div style={{ animation: "calSlide 0.25s ease-out" }}>

        {/* Mini month view */}
        {(() => {
          const now = new Date();
          const y = now.getFullYear(), m = now.getMonth();
          const dim = new Date(y, m + 1, 0).getDate();
          const fd = (new Date(y, m, 1).getDay() + 6) % 7;
          const todayDate = now.getDate();
          // Collect event dates and plan dates for this month
          const eventDays = new Set();
          events.forEach(ev => { const d = new Date(ev.date); if (d.getMonth() === m) eventDays.add(d.getDate()); });
          const planDays = {};
          plans.forEach(p => { const d = new Date(p.date); if (d.getMonth() === m && d.getFullYear() === y) planDays[d.getDate()] = p; });

          const cells = [];
          for (let i = 0; i < fd; i++) cells.push(null);
          for (let d = 1; d <= dim; d++) cells.push(d);

          return (
            <div style={{ background: T.card, borderRadius: 20, padding: "16px 12px", border: `1px solid ${T.cardBorder}`, boxShadow: T.cardShadow }}>
              <p style={{ textAlign: "center", fontSize: 15, fontWeight: 700, fontFamily: F.heading, color: T.accent, marginBottom: 10 }}>{MONTHS[m]} {y}</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 1, marginBottom: 4 }}>
                {DAYS_TR.map(d => <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 700, color: T.accent, padding: "3px 0", opacity: 0.5 }}>{d}</div>)}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
                {cells.map((d, i) => {
                  const hasEvent = d && eventDays.has(d);
                  const hasPlan = d && planDays[d];
                  const isToday = d === todayDate;
                  return (
                    <div key={i} style={{
                      aspectRatio: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                      borderRadius: 10, fontSize: 12, fontWeight: isToday ? 800 : 500, fontFamily: F.body,
                      background: isToday ? T.accentGrad : "transparent",
                      color: isToday ? "white" : d ? T.dayColor : "transparent",
                      position: "relative"
                    }}>
                      {d || ""}
                      {(hasEvent || hasPlan) && d && (
                        <div style={{ display: "flex", gap: 2, marginTop: 1 }}>
                          {hasEvent && <div style={{ width: 4, height: 4, borderRadius: "50%", background: T.accent }} />}
                          {hasPlan && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#60a5fa" }} />}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {/* Legend */}
              <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: T.accent }} /><span style={{ fontSize: 10, color: T.textMuted }}>Özel Gün</span></div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: "#60a5fa" }} /><span style={{ fontSize: 10, color: T.textMuted }}>Plan</span></div>
              </div>
            </div>
          );
        })()}

        {/* Plans list */}
        <div style={{ marginTop: 14 }}>
          {plans.filter(p => { const d = new Date(p.date); return d >= new Date(new Date().setHours(0,0,0,0)); }).sort((a,b) => new Date(a.date) - new Date(b.date)).slice(0, 3).map(plan => (
            <div key={plan.id} style={{
              background: T.card, borderRadius: 14, padding: "12px 14px", marginBottom: 8,
              display: "flex", alignItems: "center", gap: 12,
              border: `1px solid ${T.cardBorder}`, boxShadow: T.cardShadow
            }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#60a5fa", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{plan.title}</span>
                <span style={{ fontSize: 11, color: T.textMuted, marginLeft: 8 }}>{formatDate(plan.date)}</span>
              </div>
              <button onClick={() => setPlans(ps => ps.filter(x => x.id !== plan.id))} style={{ background: "none", border: "none", fontSize: 14, cursor: "pointer", color: T.textMuted, opacity: 0.4 }}>✕</button>
            </div>
          ))}
        </div>

        {/* Add plan inline */}
        {!showPlanForm ? (
          <button onClick={() => setShowPlanForm(true)} style={{
            width: "100%", padding: "12px", borderRadius: 14, border: `1.5px dashed ${T.inputBorder}`,
            background: "transparent", color: T.textMuted, fontSize: 13, fontWeight: 500,
            cursor: "pointer", fontFamily: F.body, marginTop: 4
          }}>+ Plan Ekle</button>
        ) : (
          <div style={{ background: T.card, borderRadius: 18, padding: 14, border: `1px solid ${T.cardBorder}`, marginTop: 4, boxShadow: T.cardShadow }}>
            <input value={planTitle} onChange={e => setPlanTitle(e.target.value)} placeholder="Plan başlığı" style={{ ...mkInput(T), marginBottom: 8 }} />
            <CustomDatePicker value={planDate} onChange={v => setPlanDate(v)} T={T} />
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button onClick={() => setShowPlanForm(false)} style={{ flex: 1, padding: "10px", borderRadius: 12, border: `1px solid ${T.inputBorder}`, background: "transparent", color: T.textSec, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: F.body }}>İptal</button>
              <button onClick={() => {
                if (planTitle.trim() && planDate) {
                  setPlans(ps => [...ps, { id: Date.now(), title: planTitle.trim(), date: planDate }]);
                  setPlanTitle(""); setPlanDate(""); setShowPlanForm(false);
                }
              }} style={{ ...mkBtn(T), flex: 1, padding: "10px", borderRadius: 12, fontSize: 13 }}>Ekle</button>
            </div>
          </div>
        )}
        </div>)}
      </div>
    </div>
  );
}

// ── TimelineTab ────────────────────────────────────────────
function TimelineTab({ memories, setMemories, onEdit, onDelete, T }) {
  const fileRef = useRef(null);
  const [activeId, setActiveId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const sorted = [...memories].sort((a, b) => new Date(b.date) - new Date(a.date));
  const handlePick = (id) => { setActiveId(id); fileRef.current.click(); };
  const handleFile = (e) => { const f = e.target.files[0]; if (!f || !activeId) return; const r = new FileReader(); r.onload = (ev) => setMemories(p => p.map(m => m.id === activeId ? { ...m, image: ev.target.result } : m)); r.readAsDataURL(f); e.target.value = ""; };

  return (
    <div style={{ padding: "20px 0" }}>
      <style>{`
        @keyframes nodeGlow{0%,100%{box-shadow:0 0 0 3px ${T.accent}22, 0 0 6px ${T.accent}15;}50%{box-shadow:0 0 0 5px ${T.accent}33, 0 0 12px ${T.accent}25;}}
        .tl-node { transition: all 0.3s ease; }
        .tl-card:hover .tl-node { background: ${T.accent} !important; }
        .tl-card-inner { transition: box-shadow 0.3s ease, transform 0.3s ease; }
        .tl-card:hover .tl-card-inner { box-shadow: 0 12px 40px ${T.accent}12, 0 4px 12px rgba(0,0,0,0.06); transform: translateY(-1px); }
      `}</style>
      <h1 style={{ textAlign: "center", fontSize: 22, fontWeight: 800, fontFamily: F.heading, color: T.text, marginBottom: 6, letterSpacing: "-0.3px" }}>Zaman Tüneli</h1>
      <p style={{ textAlign: "center", fontSize: 13, color: T.textMuted, marginBottom: 28, fontFamily: F.body }}>Birlikte yazdığınız hikaye</p>
      <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />

      {sorted.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 32px", color: T.textPlaceholder }}>
          <div style={{ width: 90, height: 90, borderRadius: "50%", background: T.softBg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: `0 8px 32px ${T.accent}10` }}>
            <span style={{ fontSize: 42 }}>📷</span>
          </div>
          <p style={{ fontSize: 15, fontWeight: 600, fontFamily: F.heading, color: T.textSec }}>Henüz anı eklenmedi</p>
          <p style={{ fontSize: 12, color: T.textMuted }}>+ butonuna basarak ilk anınızı kaydedin</p>
        </div>
      )}

      {/* Delete confirmation */}
      {confirmDelete && (
        <div style={{ position: "fixed", inset: 0, background: T.modalOverlay, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 250, backdropFilter: "blur(4px)" }} onClick={() => setConfirmDelete(null)}>
          <div style={{ background: T.card, borderRadius: 24, padding: "28px 24px", maxWidth: 300, textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🗑️</div>
            <h3 style={{ fontSize: 17, fontWeight: 700, fontFamily: F.heading, color: T.text, margin: "0 0 8px" }}>Anıyı Sil</h3>
            <p style={{ fontSize: 13, color: T.textMuted, margin: "0 0 24px", lineHeight: 1.5 }}>Bu anıyı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setConfirmDelete(null)} style={{ flex: 1, padding: "12px", borderRadius: 14, border: `1.5px solid ${T.inputBorder}`, background: "transparent", color: T.textSec, fontSize: 14, fontWeight: 600, fontFamily: F.body, cursor: "pointer" }}>Vazgeç</button>
              <button onClick={() => { onDelete(confirmDelete); setConfirmDelete(null); }} style={{ flex: 1, padding: "12px", borderRadius: 14, border: "none", background: "linear-gradient(135deg, #ef4444, #dc2626)", color: "white", fontSize: 14, fontWeight: 600, fontFamily: F.body, cursor: "pointer", boxShadow: "0 4px 12px rgba(239,68,68,0.3)" }}>Sil</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ position: "relative" }}>
        {/* Thin translucent line */}
        {sorted.length > 0 && <div style={{ position: "absolute", left: 76, top: 8, bottom: 8, width: 1.5, background: `linear-gradient(to bottom, ${T.accent}20, ${T.inputBorder}40, transparent)`, zIndex: 0, borderRadius: 1 }} />}
        {sorted.map((item, idx) => {
          const d = new Date(item.date);
          return (
            <div className="tl-card" key={item.id} style={{ display: "flex", alignItems: "flex-start", marginBottom: 28, paddingLeft: 16, paddingRight: 16, position: "relative" }}>
              {/* Date column */}
              <div style={{ width: 56, flexShrink: 0, textAlign: "center", paddingTop: 6, zIndex: 1 }}>
                <div style={{ fontSize: 30, fontWeight: 900, fontFamily: F.display, color: T.accent, lineHeight: 1 }}>{d.getDate()}</div>
                <div style={{ fontSize: 12, color: T.accent, fontWeight: 700, fontFamily: F.body, marginTop: 3 }}>{MONTHS[d.getMonth()]}</div>
                <div style={{ fontSize: 12, color: T.text, fontWeight: 600, fontFamily: F.body, marginTop: 2, opacity: 0.7 }}>{d.getFullYear()}</div>
              </div>

              {/* Timeline node — hollow with border, fills on hover */}
              <div className="tl-node" style={{
                width: 14, height: 14, borderRadius: "50%", flexShrink: 0,
                background: idx === 0 ? T.accent : "transparent",
                border: `2.5px solid ${T.accent}`,
                animation: idx === 0 ? "nodeGlow 2.5s ease-in-out infinite" : "none",
                marginTop: 12, marginLeft: 0, marginRight: 12, zIndex: 1,
                position: "relative", left: 0
              }} />

              {/* Card — extra rounded with soft wide shadow */}
              <div className="tl-card-inner" style={{
                flex: 1, background: T.card, borderRadius: 24,
                boxShadow: `0 8px 36px ${T.accent}06, 0 2px 10px rgba(0,0,0,0.03)`,
                border: `1px solid ${T.cardBorder}`, overflow: "hidden"
              }}>
                {item.type === "memory" && (
                  <div onClick={() => handlePick(item.id)} style={{
                    width: "100%", cursor: "pointer",
                    background: item.image ? "transparent" : T.softBg,
                    minHeight: item.image ? 0 : 140,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexDirection: "column", gap: 6, position: "relative", overflow: "hidden"
                  }}>
                    {item.image ? (
                      <>
                        <img src={item.image} alt="" style={{ width: "100%", maxHeight: 240, objectFit: "cover", display: "block" }} />
                        <div onClick={(e) => { e.stopPropagation(); handlePick(item.id); }} style={{
                          position: "absolute", top: 10, right: 10,
                          width: 30, height: 30, borderRadius: 10,
                          background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                        }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                            <path d="m15 5 4 4"/>
                          </svg>
                        </div>
                      </>
                    ) : (
                      <>
                        <span style={{ fontSize: 36, opacity: 0.4 }}>📷</span>
                        <span style={{ fontSize: 12, color: T.accent, fontWeight: 600, opacity: 0.6 }}>Fotoğraf Ekle</span>
                      </>
                    )}
                  </div>
                )}
                <div style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 16 }}>{item.icon}</span>
                    <span style={{ fontWeight: 700, fontSize: 15, fontFamily: F.heading, color: T.text, flex: 1 }}>{item.title}</span>
                  </div>
                  {item.desc && <p style={{ margin: "0 0 6px", color: T.textSec, fontSize: 13, paddingLeft: 24, lineHeight: 1.5 }}>{item.desc}</p>}
                  {item.location && (
                    <div style={{ display: "flex", alignItems: "center", gap: 5, paddingLeft: 24, marginBottom: 8 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="2" strokeLinecap="round" opacity="0.6">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                      </svg>
                      <span style={{ fontSize: 12, color: T.textMuted, fontWeight: 500 }}>{item.location}</span>
                    </div>
                  )}
                  {/* Edit & Delete actions */}
                  <div style={{ display: "flex", gap: 8, paddingTop: 8, borderTop: `1px solid ${T.inputBorder}` }}>
                    <button onClick={() => onEdit(item)} style={{
                      flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      padding: "8px", borderRadius: 12, border: "none", cursor: "pointer",
                      background: T.softBg, color: T.accent, fontSize: 12, fontWeight: 600, fontFamily: F.body,
                      transition: "all 0.2s"
                    }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                      Düzenle
                    </button>
                    <button onClick={() => setConfirmDelete(item.id)} style={{
                      flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      padding: "8px", borderRadius: 12, border: "none", cursor: "pointer",
                      background: "linear-gradient(135deg, #fff1f2, #ffe4e6)", color: "#e11d48", fontSize: 12, fontWeight: 600, fontFamily: F.body,
                      transition: "all 0.2s"
                    }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── MicroBurst (mini confetti/heart burst) ─────────────────
function MicroBurst({ type, T }) {
  const canvasRef = useRef(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = 430, H = 500;
    const colors = type === "heart"
      ? ["#e91e8c","#f472b6","#fb7185","#fda4af","#ff6b9d","#fecdd3"]
      : ["#e91e8c","#ff6b9d","#fbbf24","#34d399","#60a5fa","#a78bfa","#f472b6","#fb923c","#fecdd3"];

    const ps = [];
    // More particles, spread from center
    for (let i = 0; i < 55; i++) {
      const angle = (Math.random() * Math.PI * 2);
      const speed = 1.5 + Math.random() * 6;
      ps.push({
        x: W / 2 + (Math.random() - 0.5) * 40,
        y: H * 0.4 + (Math.random() - 0.5) * 30,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: type === "heart" ? 8 + Math.random() * 12 : 4 + Math.random() * 7,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 1,
        gravity: 0.06 + Math.random() * 0.04,
        type: type === "heart" ? "heart" : (Math.random() > 0.6 ? "star" : Math.random() > 0.3 ? "circle" : "rect"),
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 6,
        delay: Math.random() * 8, // stagger start
        frame: 0,
      });
    }

    let running = true;
    const animate = () => {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      let allGone = true;
      ps.forEach(p => {
        p.frame++;
        if (p.frame < p.delay) { allGone = false; return; }
        p.x += p.vx;
        p.vy += p.gravity;
        p.y += p.vy;
        p.vx *= 0.985;
        p.rotation += p.rotSpeed;
        // Much slower fade
        p.opacity -= 0.006;
        if (p.opacity <= 0) return;
        allGone = false;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);
        ctx.fillStyle = p.color;
        if (p.type === "heart") {
          ctx.beginPath();
          const s = p.size / 2;
          ctx.moveTo(0, s * 0.4);
          ctx.bezierCurveTo(-s, -s * 0.5, -s * 1.8, s * 0.3, 0, s * 1.4);
          ctx.bezierCurveTo(s * 1.8, s * 0.3, s, -s * 0.5, 0, s * 0.4);
          ctx.fill();
        } else if (p.type === "star") {
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            const a = (i * 4 * Math.PI) / 5 - Math.PI / 2;
            const r = p.size / 2;
            if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
            else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
          }
          ctx.closePath();
          ctx.fill();
        } else if (p.type === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        }
        ctx.restore();
      });
      if (allGone) { setVisible(false); return; }
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
    return () => { running = false; };
  }, []);

  if (!visible) return null;
  return (
    <canvas ref={canvasRef} width={430} height={500} style={{
      position: "fixed", top: "15%", left: "50%", transform: "translateX(-50%)",
      width: 430, maxWidth: "100%", height: 500, pointerEvents: "none", zIndex: 500
    }} />
  );
}

// ── Toast Message ──────────────────────────────────────────
function Toast({ message, icon, visible, T }) {
  return (
    <div style={{
      position: "fixed", bottom: 100, left: "50%", transform: `translateX(-50%) translateY(${visible ? "0" : "20px"})`,
      zIndex: 500, pointerEvents: "none",
      opacity: visible ? 1 : 0,
      transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
      maxWidth: 360, width: "85%"
    }}>
      <div style={{
        background: "rgba(255,255,255,0.75)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderRadius: 20, padding: "14px 20px",
        display: "flex", alignItems: "center", gap: 12,
        border: `1px solid ${T.accent}20`,
        boxShadow: `0 8px 32px ${T.accent}15, 0 2px 8px rgba(0,0,0,0.06)`
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: T.softBg, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, flexShrink: 0
        }}>{icon}</div>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 500, fontFamily: F.body, color: T.text, lineHeight: 1.5 }}>{message}</p>
      </div>
    </div>
  );
}

// ── GiftItem (inline editable) ─────────────────────────────
function GiftItem({ gift, setGifts, T }) {
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(gift.name);
  const [editLink, setEditLink] = useState(gift.link || "");
  const IS = mkInput(T);

  useEffect(() => { setEditName(gift.name); setEditLink(gift.link || ""); }, [gift.name, gift.link]);

  const saveEdit = () => {
    if (editName.trim()) {
      setGifts(g => g.map(x => x.id === gift.id ? { ...x, name: editName.trim(), link: editLink.trim() } : x));
    }
    setEditing(false);
  };

  return (
    <div style={{
      background: gift.bought ? T.checkDone : T.card, borderRadius: 18, padding: "14px 16px",
      border: `1px solid ${editing ? T.accent : gift.bought ? "transparent" : T.cardBorder}`,
      boxShadow: editing ? `0 4px 20px ${T.accent}15` : T.cardShadow, transition: "all 0.3s"
    }}>
      {editing ? (
        <div>
          <input value={editName} onChange={e => setEditName(e.target.value)} placeholder="Hediye adı"
            onKeyDown={e => e.key === "Enter" && saveEdit()} autoFocus
            style={{ ...IS, marginBottom: 8, fontSize: 14 }} />
          <input value={editLink} onChange={e => setEditLink(e.target.value)} placeholder="Link (opsiyonel)"
            onKeyDown={e => e.key === "Enter" && saveEdit()}
            style={{ ...IS, marginBottom: 10, fontSize: 13 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => { setEditName(gift.name); setEditLink(gift.link || ""); setEditing(false); }}
              style={{ flex: 1, padding: "8px", borderRadius: 10, border: `1px solid ${T.inputBorder}`, background: "transparent", color: T.textSec, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: F.body }}>İptal</button>
            <button onClick={saveEdit}
              style={{ flex: 1, padding: "8px", borderRadius: 10, border: "none", background: T.accentGrad, color: "white", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: F.body }}>Kaydet</button>
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setGifts(g => g.map(x => x.id === gift.id ? { ...x, bought: !x.bought } : x))} style={{
              width: 28, height: 28, borderRadius: 10, border: `2px solid ${gift.bought ? T.checkDoneText : T.accent}`,
              background: gift.bought ? T.checkDoneText : "transparent", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              color: "white", fontSize: 14, fontWeight: 800, transition: "all 0.2s"
            }}>{gift.bought ? "✓" : ""}</button>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: gift.bought ? T.checkDoneText : T.text, textDecoration: gift.bought ? "line-through" : "none" }}>{gift.name}</span>
            </div>
            <button onClick={() => setEditing(true)} style={{ background: "none", border: "none", cursor: "pointer", color: T.textMuted, opacity: 0.5, marginRight: 4, padding: 4 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
            </button>
            <button onClick={() => setGifts(g => g.filter(x => x.id !== gift.id))} style={{ background: "none", border: "none", fontSize: 16, cursor: "pointer", color: T.textMuted, opacity: 0.5 }}>✕</button>
          </div>
          {gift.link && (
            <a href={gift.link.startsWith("http") ? gift.link : `https://${gift.link}`} target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 8, marginLeft: 40, fontSize: 12, color: T.accent, fontWeight: 500, textDecoration: "none" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
              Linke git →
            </a>
          )}
        </>
      )}
    </div>
  );
}

// ── CardsTab ───────────────────────────────────────────────
const QUICK_TAGS = ["🌍 Seyahat", "🎬 Film", "🎵 Konser", "🍽️ Restoran", "🏕️ Kamp", "📚 Kitap"];

function InlineCard({ card, onSave, T, showToast }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(card.value);
  const inputRef = useRef(null);
  const filled = !!card.value;

  useEffect(() => { setVal(card.value); }, [card.value]);
  useEffect(() => { if (editing && inputRef.current) inputRef.current.focus(); }, [editing]);

  const save = () => {
    setEditing(false);
    if (val.trim() !== card.value) {
      onSave(card.id, val.trim());
    }
  };

  return (
    <div onClick={() => !editing && setEditing(true)} style={{
      background: filled ? `${T.accent}06` : `${T.card}`,
      border: editing ? `2px solid ${T.accent}` : filled ? `1px solid ${T.accent}12` : `1px solid ${T.cardBorder}`,
      borderRadius: 22, padding: "20px 14px", textAlign: "center",
      cursor: editing ? "default" : "pointer",
      boxShadow: editing
        ? `0 4px 24px ${T.accent}18`
        : filled ? `0 2px 16px ${T.accent}06` : "0 2px 12px rgba(0,0,0,0.02)",
      fontFamily: F.body, transition: "all 0.3s",
    }}>
      <div style={{
        fontSize: filled ? 32 : 26, marginBottom: 8,
        filter: filled ? `drop-shadow(0 2px 6px ${T.accent}20)` : "none",
        transition: "all 0.3s"
      }}>{card.icon}</div>
      <p style={{ fontSize: 10, color: T.labelColor, letterSpacing: 1.5, fontWeight: 700, margin: "0 0 8px" }}>{card.label}</p>

      {editing ? (
        <input ref={inputRef} value={val} onChange={e => setVal(e.target.value)}
          onBlur={save}
          onKeyDown={e => { if (e.key === "Enter") save(); if (e.key === "Escape") { setVal(card.value); setEditing(false); } }}
          placeholder="Yazın..."
          style={{
            width: "100%", border: "none", outline: "none",
            background: "transparent", textAlign: "center",
            fontSize: 13, fontWeight: 600, fontFamily: F.body,
            color: T.text, padding: "4px 0",
            borderBottom: `1.5px solid ${T.accent}40`,
          }}
        />
      ) : (
        <p style={{
          fontSize: filled ? 13 : 11, margin: 0, lineHeight: 1.4,
          color: filled ? T.text : T.textMuted,
          fontWeight: filled ? 600 : 400,
          fontStyle: filled ? "normal" : "italic",
          minHeight: 18
        }}>
          {filled ? (card.value.length > 22 ? card.value.slice(0, 22) + "..." : card.value) : card.prompt}
        </p>
      )}
    </div>
  );
}

function CardsTab({ partner, setPartner, bucketList, setBucketList, gifts, setGifts, T, showToast }) {
  const [newItem, setNewItem] = useState("");
  const [newGift, setNewGift] = useState({ name: "", link: "" });
  const [showGiftForm, setShowGiftForm] = useState(false);
  const IS = mkInput(T); const BS = mkBtn(T);
  const done = bucketList.filter(b => b.done).length;
  const total = bucketList.length;

  const saveCard = (id, value) => {
    setPartner(p => ({ ...p, cards: p.cards.map(c => c.id === id ? { ...c, value } : c) }));
  };

  const addItem = (text) => {
    const t = (text || newItem).trim();
    if (!t) return;
    setBucketList(p => [...p, { id: Date.now(), text: t, done: false }]);
    setNewItem("");
    if (showToast) showToast("🎯", "Harika bir plan! Sabırsızlıkla bekliyorum ✨");
  };
  const toggle = (id) => setBucketList(p => p.map(b => b.id === id ? { ...b, done: !b.done } : b));
  const remove = (id) => setBucketList(p => p.filter(b => b.id !== id));

  return (
    <div style={{ padding: "20px 16px" }}>
      <h1 style={{ textAlign: "center", fontSize: 20, fontWeight: 800, fontFamily: F.heading, color: T.text, margin: "0 0 8px", letterSpacing: "-0.3px" }}>Anılar</h1>
      <p style={{ textAlign: "center", fontSize: 13, color: T.textMuted, margin: "0 0 20px" }}>Küçük detaylar büyük farklar yaratır 💕</p>

      {/* Kartlar — inline editing */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 32 }}>
        {partner.cards.map(card => (
          <InlineCard key={card.id} card={card} onSave={saveCard} T={T} showToast={showToast} />
        ))}
      </div>

      {/* Bucket List */}
      <h2 style={{ fontSize: 16, color: T.text, fontWeight: 700, fontFamily: F.heading, marginBottom: 6 }}>🎯 Birlikte Yapılacaklar</h2>
      <p style={{ fontSize: 12, color: T.textMuted, marginBottom: 14 }}>Hayallerinizi listeleyin, gerçekleştirdikçe işaretleyin</p>

      {total > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: T.labelColor }}>{done}/{total} tamamlandı</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: T.accent }}>{Math.round(done / total * 100)}%</span>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: T.inputBorder, overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 3, background: T.accentGrad, width: `${done / total * 100}%`, transition: "width 0.5s ease" }} />
          </div>
        </div>
      )}

      {/* Oval input */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input value={newItem} onChange={e => setNewItem(e.target.value)} placeholder="Birlikte ne yapmak istersiniz?"
          onKeyDown={e => e.key === "Enter" && addItem()}
          style={{ ...IS, flex: 1, borderRadius: 24, padding: "14px 22px" }} />
        <button onClick={() => addItem()} style={{ ...BS, padding: "14px 20px", borderRadius: 24, fontSize: 18, lineHeight: 1 }}>+</button>
      </div>

      {/* Empty state */}
      {total === 0 && (
        <div style={{ textAlign: "center", padding: "40px 20px", color: T.textPlaceholder }}>
          {/* Decorative illustration */}
          <div style={{ position: "relative", display: "inline-block", marginBottom: 16 }}>
            <div style={{
              width: 100, height: 100, borderRadius: "50%",
              background: T.softBg, display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto",
              boxShadow: `0 8px 32px ${T.accent}15`
            }}>
              <span style={{ fontSize: 48 }}>🗺️</span>
            </div>
            <div style={{ position: "absolute", top: -4, right: -4, fontSize: 22, animation: "emojiGlow 3s ease-in-out infinite" }}>✨</div>
            <div style={{ position: "absolute", bottom: 2, left: -2, fontSize: 18 }}>💕</div>
          </div>
          <p style={{ fontSize: 15, fontWeight: 600, fontFamily: F.heading, color: T.textSec, margin: "0 0 4px" }}>
            Hayallerinizi listelemeye başlayın!
          </p>
          <p style={{ fontSize: 12, color: T.textMuted, margin: 0 }}>
            Yukarıdan ekleyin veya etiketlere dokunun ✨
          </p>
        </div>
      )}

      {/* Items */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {bucketList.map(item => (
          <div key={item.id} style={{
            background: item.done ? T.checkDone : T.card, borderRadius: 16, padding: "14px 16px",
            display: "flex", alignItems: "center", gap: 12, boxShadow: T.cardShadow,
            border: `1px solid ${item.done ? "transparent" : T.cardBorder}`, transition: "all 0.3s"
          }}>
            <button onClick={() => toggle(item.id)} style={{
              width: 28, height: 28, borderRadius: 10, border: `2px solid ${item.done ? T.checkDoneText : T.accent}`,
              background: item.done ? T.checkDoneText : "transparent", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              color: "white", fontSize: 14, fontWeight: 800, transition: "all 0.2s"
            }}>{item.done ? "✓" : ""}</button>
            <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: item.done ? T.checkDoneText : T.text,
              textDecoration: item.done ? "line-through" : "none", opacity: item.done ? 0.8 : 1, transition: "all 0.3s"
            }}>{item.text}</span>
            <button onClick={() => remove(item.id)} style={{ background: "none", border: "none", fontSize: 16, cursor: "pointer", color: T.textMuted, opacity: 0.5 }}>✕</button>
          </div>
        ))}
      </div>

      {/* ── Hediye Listesi ── */}
      <div style={{ marginTop: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h2 style={{ fontSize: 16, color: T.text, fontWeight: 700, fontFamily: F.heading, margin: 0 }}>🎁 Hediye Fikirleri</h2>
          <button onClick={() => setShowGiftForm(f => !f)} style={{
            background: T.softBg, border: "none", borderRadius: 10, padding: "6px 14px",
            fontSize: 12, fontWeight: 600, color: T.accent, cursor: "pointer", fontFamily: F.body
          }}>{showGiftForm ? "Kapat" : "+ Ekle"}</button>
        </div>

        {showGiftForm && (
          <div style={{ background: T.card, borderRadius: 20, padding: 16, border: `1px solid ${T.cardBorder}`, marginBottom: 14, boxShadow: T.cardShadow }}>
            <input value={newGift.name} onChange={e => setNewGift(p => ({ ...p, name: e.target.value }))} placeholder="Hediye adı" style={{ ...IS, marginBottom: 8 }} />
            <input value={newGift.link} onChange={e => setNewGift(p => ({ ...p, link: e.target.value }))} placeholder="Link (opsiyonel)" style={{ ...IS, marginBottom: 10 }} />
            <button onClick={() => {
              if (newGift.name.trim()) {
                setGifts(g => [...g, { ...newGift, id: Date.now(), bought: false }]);
                setNewGift({ name: "", link: "" });
                setShowGiftForm(false);
              }
            }} style={{ ...BS, width: "100%", borderRadius: 14 }}>Ekle</button>
          </div>
        )}

        {gifts.length === 0 && !showGiftForm && (
          <div style={{ textAlign: "center", padding: "28px 0", color: T.textPlaceholder }}>
            <span style={{ fontSize: 32 }}>🎁</span>
            <p style={{ fontSize: 12, marginTop: 6 }}>Hediye fikirleri ekleyin, özel günlerde hazırlıksız kalmayın!</p>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {gifts.map(gift => (
            <GiftItem key={gift.id} gift={gift} setGifts={setGifts} T={T} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── EventsTab ──────────────────────────────────────────────
function EventsTab({ events, setShowAddEvent, T }) {
  const sorted = [...events].sort((a, b) => getDaysLeft(a.date) - getDaysLeft(b.date));
  const BS = mkBtn(T);
  return (
    <div style={{ padding: "20px 16px" }}>
      <h1 style={{ textAlign: "center", fontSize: 20, fontWeight: 600, fontFamily: F.heading, color: T.text, marginBottom: 24 }}>Özel Günler</h1>
      {sorted.length === 0 && <div style={{ textAlign: "center", padding: "48px 0", color: T.textPlaceholder }}><div style={{ fontSize: 40 }}>💌</div><p style={{ fontSize: 13, marginTop: 8 }}>Henüz özel gün eklenmedi.</p></div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {sorted.map(ev => (
          <div key={ev.id} style={{ background: T.card, borderRadius: 18, padding: "16px", display: "flex", alignItems: "center", gap: 14, boxShadow: T.cardShadow, border: `1px solid ${T.cardBorder}` }}>
            <div style={{ width: 50, height: 50, borderRadius: 16, background: T.softBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>{ev.icon}</div>
            <div style={{ flex: 1 }}><p style={{ margin: 0, fontWeight: 700, color: T.text, fontSize: 16 }}>{ev.title}</p><p style={{ margin: 0, color: T.textMuted, fontSize: 13, marginTop: 3 }}>{formatDate(ev.date)}</p></div>
            <div style={{ textAlign: "right" }}><div style={{ fontSize: 22, fontWeight: 900, fontFamily: F.display, color: T.accent }}>{getDaysLeft(ev.date)}</div><div style={{ fontSize: 10, color: T.textMuted }}>GÜN KALDI</div></div>
          </div>
        ))}
      </div>
      <button onClick={() => setShowAddEvent(true)} style={{ ...BS, marginTop: 20, width: "100%" }}>+ Özel Gün Ekle</button>
    </div>
  );
}

// ── BucketListTab ──────────────────────────────────────────
function BucketListTab({ bucketList, setBucketList, T }) {
  const [newItem, setNewItem] = useState("");
  const IS = mkInput(T); const BS = mkBtn(T);
  const done = bucketList.filter(b => b.done).length;
  const total = bucketList.length;

  const addItem = () => { if (!newItem.trim()) return; setBucketList(p => [...p, { id: Date.now(), text: newItem.trim(), done: false }]); setNewItem(""); };
  const toggle = (id) => setBucketList(p => p.map(b => b.id === id ? { ...b, done: !b.done } : b));
  const remove = (id) => setBucketList(p => p.filter(b => b.id !== id));

  return (
    <div style={{ padding: "20px 16px" }}>
      <h1 style={{ textAlign: "center", fontSize: 20, fontWeight: 600, fontFamily: F.heading, color: T.text, marginBottom: 6 }}>Birlikte Yapılacaklar</h1>
      <p style={{ textAlign: "center", fontSize: 13, color: T.textMuted, marginBottom: 20 }}>Hayallerinizi listeleyin, gerçekleştirdikçe işaretleyin 🎯</p>

      {total > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: T.labelColor }}>{done}/{total} tamamlandı</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: T.accent }}>{Math.round(done / total * 100)}%</span>
          </div>
          <div style={{ height: 8, borderRadius: 4, background: T.inputBorder, overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 4, background: T.accentGrad, width: `${done / total * 100}%`, transition: "width 0.5s ease" }} />
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <input value={newItem} onChange={e => setNewItem(e.target.value)} placeholder="Örn: Paris'e gitmek" onKeyDown={e => e.key === "Enter" && addItem()} style={{ ...IS, flex: 1 }} />
        <button onClick={addItem} style={{ ...BS, padding: "12px 18px", borderRadius: 12, fontSize: 20, lineHeight: 1 }}>+</button>
      </div>

      {total === 0 && <div style={{ textAlign: "center", padding: "48px 0", color: T.textPlaceholder }}><div style={{ fontSize: 40 }}>🎯</div><p style={{ fontSize: 13, marginTop: 8 }}>Henüz hedef eklenmedi.</p></div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {bucketList.map(item => (
          <div key={item.id} style={{
            background: item.done ? T.checkDone : T.card, borderRadius: 16, padding: "14px 16px",
            display: "flex", alignItems: "center", gap: 12, boxShadow: T.cardShadow,
            border: `1px solid ${item.done ? "transparent" : T.cardBorder}`, transition: "all 0.3s"
          }}>
            <button onClick={() => toggle(item.id)} style={{
              width: 28, height: 28, borderRadius: 10, border: `2px solid ${item.done ? T.checkDoneText : T.accent}`,
              background: item.done ? T.checkDoneText : "transparent", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              color: "white", fontSize: 14, fontWeight: 800, transition: "all 0.2s"
            }}>{item.done ? "✓" : ""}</button>
            <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: item.done ? T.checkDoneText : T.text,
              textDecoration: item.done ? "line-through" : "none", opacity: item.done ? 0.8 : 1, transition: "all 0.3s"
            }}>{item.text}</span>
            <button onClick={() => remove(item.id)} style={{ background: "none", border: "none", fontSize: 16, cursor: "pointer", color: T.textMuted, opacity: 0.5 }}>✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Celebration Overlay ────────────────────────────────────
function CelebrationOverlay({ type, title, emoji, message, onClose, T }) {
  const canvasRef = useRef(null);
  const [particles, setParticles] = useState([]);
  const animRef = useRef(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const count = 80;
    const ps = [];
    const isAnniversary = type === "anniversary";
    // birthday and generic events both get confetti

    // Confetti colors
    const confettiColors = ["#e91e8c", "#ff6b9d", "#fbbf24", "#34d399", "#60a5fa", "#a78bfa", "#f472b6", "#fb923c", "#f43f5e"];
    // Heart shades
    const heartColors = ["#e91e8c", "#ff6b9d", "#f472b6", "#fb7185", "#fda4af", "#fecdd3", "#ff1493", "#ff69b4"];

    for (let i = 0; i < count; i++) {
      if (isAnniversary) {
        ps.push({
          x: Math.random() * 430,
          y: -20 - Math.random() * 600,
          size: 10 + Math.random() * 18,
          speedY: 0.8 + Math.random() * 1.5,
          speedX: (Math.random() - 0.5) * 1.2,
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: 0.02 + Math.random() * 0.03,
          color: heartColors[Math.floor(Math.random() * heartColors.length)],
          opacity: 0.6 + Math.random() * 0.4,
          rotation: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 3,
          type: "heart"
        });
      } else {
        // birthday / generic event confetti
        const shapeType = Math.random();
        ps.push({
          x: Math.random() * 430,
          y: -20 - Math.random() * 600,
          size: shapeType > 0.7 ? 14 + Math.random() * 10 : 6 + Math.random() * 8,
          speedY: 1.2 + Math.random() * 2.5,
          speedX: (Math.random() - 0.5) * 2,
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: 0.03 + Math.random() * 0.04,
          color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
          opacity: 0.7 + Math.random() * 0.3,
          rotation: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 6,
          type: shapeType > 0.85 ? "star" : shapeType > 0.6 ? "circle" : "rect"
        });
      }
    }
    setParticles(ps);

    // Auto close after 6 seconds
    const t = setTimeout(() => setVisible(false), 6000);
    return () => clearTimeout(t);
  }, [type]);

  useEffect(() => {
    if (!canvasRef.current || particles.length === 0) return;
    const ctx = canvasRef.current.getContext("2d");
    const W = 430, H = canvasRef.current.height;
    let ps = [...particles];

    const drawHeart = (ctx, x, y, size, color, rotation, opacity) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation * Math.PI / 180);
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;
      ctx.beginPath();
      const s = size / 2;
      ctx.moveTo(0, s * 0.4);
      ctx.bezierCurveTo(-s, -s * 0.5, -s * 1.8, s * 0.3, 0, s * 1.4);
      ctx.bezierCurveTo(s * 1.8, s * 0.3, s, -s * 0.5, 0, s * 0.4);
      ctx.fill();
      ctx.restore();
    };

    const drawStar = (ctx, x, y, size, color, rotation, opacity) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation * Math.PI / 180);
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const r = size / 2;
        if (i === 0) ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
        else ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      let allDone = true;
      ps.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.wobble) * 0.5;
        p.wobble += p.wobbleSpeed;
        p.rotation += p.rotSpeed;
        if (p.y > H + 30) p.opacity = Math.max(0, p.opacity - 0.02);
        if (p.opacity > 0) allDone = false;

        if (p.type === "heart") {
          drawHeart(ctx, p.x, p.y, p.size, p.color, p.rotation, p.opacity);
        } else if (p.type === "star") {
          drawStar(ctx, p.x, p.y, p.size, p.color, p.rotation, p.opacity);
        } else if (p.type === "circle") {
          ctx.save();
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation * Math.PI / 180);
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
          ctx.restore();
        }
      });
      if (!allDone) animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [particles]);

  if (!visible) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300, pointerEvents: "auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }} onClick={() => setVisible(false)}>
      <canvas ref={canvasRef} width={430} height={window.innerHeight || 800} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />
      {/* Celebration card */}
      <div style={{
        background: T.card, borderRadius: 28, padding: "36px 28px", textAlign: "center",
        boxShadow: `0 20px 60px rgba(0,0,0,0.2), 0 0 80px ${T.accent}20`,
        border: `2px solid ${T.accent}40`, zIndex: 301, maxWidth: 320,
        animation: "celebPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)"
      }}>
        <style>{`@keyframes celebPop{from{opacity:0;transform:scale(0.5)}to{opacity:1;transform:scale(1)}}`}</style>
        <div style={{ fontSize: 56, marginBottom: 12 }}>{emoji}</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, fontFamily: F.heading, color: T.accent, margin: "0 0 8px" }}>
          {title}
        </h2>
        <p style={{ fontSize: 14, color: T.textSec, lineHeight: 1.6, margin: "0 0 16px", fontFamily: F.body }}>
          {message}
        </p>
        <div style={{ fontSize: 11, color: T.textMuted, fontFamily: F.body }}>Kapatmak için dokunun</div>
      </div>
    </div>
  );
}

// ── Welcome Particles (Rose Petals + Sparkle Hearts) ──────
function WelcomeParticles({ T }) {
  const canvasRef = useRef(null);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFading(true), 3500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;

    const petalColors = ["#fda4af","#f472b6","#fb7185","#fecdd3","#e91e8c","#ff6b9d","#fbb6ce"];
    const heartColors = ["#e91e8c","#ff6b9d","#f472b6","#fb7185"];
    const sparkleColor = "#ffd700";

    const particles = [];
    // Rose petals
    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * W,
        y: -20 - Math.random() * H * 0.8,
        size: 8 + Math.random() * 14,
        speedY: 0.6 + Math.random() * 1.2,
        speedX: (Math.random() - 0.5) * 0.8,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.015 + Math.random() * 0.025,
        wobbleAmp: 1 + Math.random() * 2,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 2,
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
        opacity: 0.5 + Math.random() * 0.5,
        type: "petal"
      });
    }
    // Sparkle hearts
    for (let i = 0; i < 20; i++) {
      particles.push({
        x: Math.random() * W,
        y: -10 - Math.random() * H * 0.6,
        size: 6 + Math.random() * 10,
        speedY: 0.5 + Math.random() * 1,
        speedX: (Math.random() - 0.5) * 0.6,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.02 + Math.random() * 0.03,
        wobbleAmp: 0.5 + Math.random(),
        rotation: 0,
        rotSpeed: 0,
        color: heartColors[Math.floor(Math.random() * heartColors.length)],
        opacity: 0.4 + Math.random() * 0.6,
        type: "heart",
        sparklePhase: Math.random() * Math.PI * 2
      });
    }
    // Sparkle dots
    for (let i = 0; i < 15; i++) {
      particles.push({
        x: Math.random() * W,
        y: -10 - Math.random() * H * 0.5,
        size: 2 + Math.random() * 3,
        speedY: 0.3 + Math.random() * 0.8,
        speedX: (Math.random() - 0.5) * 0.4,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.04 + Math.random() * 0.04,
        wobbleAmp: 0,
        rotation: 0, rotSpeed: 0,
        color: sparkleColor,
        opacity: 0.3 + Math.random() * 0.7,
        type: "sparkle",
        sparklePhase: Math.random() * Math.PI * 2
      });
    }

    const drawPetal = (ctx, p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation * Math.PI / 180);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      const s = p.size;
      ctx.ellipse(0, 0, s * 0.45, s, 0, 0, Math.PI * 2);
      ctx.fill();
      // vein
      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.6);
      ctx.quadraticCurveTo(s * 0.1, 0, 0, s * 0.6);
      ctx.stroke();
      ctx.restore();
    };

    const drawHeart = (ctx, p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.globalAlpha = p.opacity * (0.7 + 0.3 * Math.sin(p.sparklePhase));
      ctx.fillStyle = p.color;
      ctx.beginPath();
      const s = p.size / 2;
      ctx.moveTo(0, s * 0.4);
      ctx.bezierCurveTo(-s, -s * 0.5, -s * 1.8, s * 0.3, 0, s * 1.4);
      ctx.bezierCurveTo(s * 1.8, s * 0.3, s, -s * 0.5, 0, s * 0.4);
      ctx.fill();
      ctx.restore();
    };

    const drawSparkle = (ctx, p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      const pulse = 0.5 + 0.5 * Math.sin(p.sparklePhase);
      ctx.globalAlpha = p.opacity * pulse;
      ctx.fillStyle = p.color;
      // 4-point star
      const s = p.size * (0.8 + 0.4 * pulse);
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const r = i % 2 === 0 ? s : s * 0.3;
        if (i === 0) ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
        else ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
        const midAngle = angle + Math.PI / 4;
        const midR = s * 0.3;
        ctx.lineTo(Math.cos(midAngle) * midR, Math.sin(midAngle) * midR);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    let running = true;
    const animate = () => {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.wobble) * p.wobbleAmp;
        p.wobble += p.wobbleSpeed;
        p.rotation += p.rotSpeed;
        if (p.sparklePhase !== undefined) p.sparklePhase += 0.08;
        // Fade near bottom
        if (p.y > H * 0.75) p.opacity = Math.max(0, p.opacity - 0.008);
        if (p.type === "petal") drawPetal(ctx, p);
        else if (p.type === "heart") drawHeart(ctx, p);
        else drawSparkle(ctx, p);
      });
      requestAnimationFrame(animate);
    };
    animate();
    return () => { running = false; };
  }, []);

  return (
    <canvas ref={canvasRef} width={430} height={800}
      style={{
        position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430, height: "100vh",
        pointerEvents: "none", zIndex: 150,
        opacity: fading ? 0 : 1,
        transition: "opacity 1s ease-out"
      }}
    />
  );
}

// ── Logo Component ─────────────────────────────────────────
const LOGO_SRC = "data:image/png;base64,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";
function AppLogo({ size = 100 }) {
  return (
    <img src={LOGO_SRC} alt="MySwan" width={size} height={size} style={{ objectFit: "contain" }} />
  );
}

// ── Splash Screen ──────────────────────────────────────────
function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    setTimeout(() => setPhase(1), 100);
    setTimeout(() => setPhase(2), 2200);
    setTimeout(() => onDone(), 2800);
  }, []);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 600,
      background: "linear-gradient(160deg, #fff0f5 0%, #fce7f3 40%, #fbcfe8 70%, #f9a8d4 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      opacity: phase === 2 ? 0 : 1,
      transition: "opacity 0.6s ease-out"
    }}>
      <style>{`
        @keyframes splashLogoIn {
          from { opacity: 0; transform: scale(0.6) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes splashTextIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes splashPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
        @keyframes splashDots {
          0%, 80%, 100% { opacity: 0.2; }
          40% { opacity: 1; }
        }
      `}</style>

      {/* Decorative blurred circles */}
      <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(233,30,140,0.1)", filter: "blur(50px)" }} />
      <div style={{ position: "absolute", bottom: -80, left: -80, width: 250, height: 250, borderRadius: "50%", background: "rgba(244,114,182,0.12)", filter: "blur(60px)" }} />

      {/* Logo */}
      <div style={{
        animation: phase >= 1 ? "splashLogoIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) both" : "none",
        opacity: 0
      }}>
        <div style={{
          width: 110, height: 110, borderRadius: 32,
          background: "white",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 16px 48px rgba(233,30,140,0.25), 0 4px 16px rgba(233,30,140,0.15)",
          animation: phase >= 1 ? "splashPulse 2.5s ease-in-out infinite 0.8s" : "none"
        }}>
          <AppLogo size={80} />
        </div>
      </div>

      {/* App name */}
      <h1 style={{
        fontSize: 34, fontWeight: 800, fontFamily: "'Montserrat', sans-serif",
        color: "#e91e8c", letterSpacing: "-0.5px", margin: "28px 0 6px",
        animation: phase >= 1 ? "splashTextIn 0.6s ease-out 0.3s both" : "none",
        opacity: 0
      }}>MySwan</h1>

      {/* Slogan */}
      <p style={{
        fontSize: 14, fontWeight: 500, fontFamily: "'Montserrat', sans-serif",
        color: "#c06080", letterSpacing: "0.5px",
        animation: phase >= 1 ? "splashTextIn 0.6s ease-out 0.5s both" : "none",
        opacity: 0
      }}>Sevginizi dijitale taşıyın</p>

      {/* Loading dots */}
      <div style={{
        display: "flex", gap: 6, marginTop: 40,
        animation: phase >= 1 ? "splashTextIn 0.6s ease-out 0.7s both" : "none",
        opacity: 0
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: "50%", background: "#e91e8c",
            animation: `splashDots 1.2s ease-in-out ${i * 0.2}s infinite`
          }} />
        ))}
      </div>
    </div>
  );
}

// ── Loading Screen ─────────────────────────────────────────
function LoadingScreen({ onDone, T }) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const duration = 2000;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / duration, 1);
      // Ease-out curve
      setProgress(1 - Math.pow(1 - p, 3));
      if (p < 1) requestAnimationFrame(tick);
      else {
        setTimeout(() => setFadeOut(true), 200);
        setTimeout(() => onDone(), 700);
      }
    };
    requestAnimationFrame(tick);
  }, []);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 400,
      background: `radial-gradient(circle at 50% 40%, ${T.accent}15, transparent 70%), ${T.onboardBg}`,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: F.body,
      opacity: fadeOut ? 0 : 1,
      transition: "opacity 0.5s ease-out"
    }}>
      <style>{`
        @keyframes heartPulse {
          0%, 100% { transform: scale(1); }
          15% { transform: scale(1.15); }
          30% { transform: scale(1); }
          45% { transform: scale(1.1); }
          60% { transform: scale(1); }
        }
        @keyframes loadFadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Heart hands icon */}
      <div style={{
        fontSize: 72, marginBottom: 32,
        animation: "heartPulse 1.5s ease-in-out infinite",
        filter: `drop-shadow(0 8px 24px ${T.accent}30)`
      }}>🫶</div>

      {/* Text */}
      <p style={{
        fontSize: 17, fontWeight: 300, fontStyle: "italic", color: T.textSec,
        fontFamily: F.body, letterSpacing: "0.3px", marginBottom: 48,
        animation: "loadFadeIn 0.8s ease-out 0.3s both"
      }}>Anılarınız hazırlanıyor...</p>

      {/* Progress bar */}
      <div style={{
        width: "60%", maxWidth: 240, height: 4, borderRadius: 2,
        background: T.inputBorder, overflow: "hidden",
        animation: "loadFadeIn 0.8s ease-out 0.6s both"
      }}>
        <div style={{
          height: "100%", borderRadius: 2,
          background: T.accentGrad,
          width: `${progress * 100}%`,
          transition: "width 0.1s linear",
          boxShadow: `0 0 12px ${T.accent}40`
        }} />
      </div>
    </div>
  );
}

// ── App ────────────────────────────────────────────────────
// Storage helpers — localStorage for web, fallback for artifacts
const STORE_KEY = "myswan-app-data";
function loadData() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
function saveData(data) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch {}
}

export default function App() {
  const [dark, setDark] = useState(false);
  const [paletteId, setPaletteId] = useState("rose");
  const [fontId, setFontId] = useState("modern");
  const palette = PALETTES.find(p => p.id === paletteId) || PALETTES[0];
  const fontPreset = FONT_PRESETS.find(f => f.id === fontId) || FONT_PRESETS[0];
  F.display = fontPreset.display; F.heading = fontPreset.heading; F.body = fontPreset.body;
  _currentFontImport = fontPreset.import;
  const T = dark ? makeDark(palette) : makeLight(palette);

  const [setupDone, setSetupDone] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [pendingData, setPendingData] = useState(null);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [tab, setTab] = useState("home");
  const [partnerName, setPartnerName] = useState("Sevgilinizin Adı");
  const [startDate, setStartDate] = useState("");
  const [partner, setPartner] = useState({ cards: DEFAULT_CARDS });
  const [events, setEvents] = useState([]);
  const [memories, setMemories] = useState([]);
  const [bucketList, setBucketList] = useState([]);
  const [gifts, setGifts] = useState([]);
  const [plans, setPlans] = useState([]);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showAddMemory, setShowAddMemory] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", icon: "🎂" });
  const [newMemory, setNewMemory] = useState({ title: "", desc: "", date: "", location: "" });
  const [editMemory, setEditMemory] = useState(null);
  const [editCard, setEditCard] = useState(null);
  const [editCardValue, setEditCardValue] = useState("");
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [notifyEnabled, setNotifyEnabled] = useState(false);
  const [celebration, setCelebration] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: "", icon: "" });
  const [microBurst, setMicroBurst] = useState(null);
  const toastTimer = useRef(null);
  const showToast = (icon, message) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ visible: true, message, icon });
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000);
  };
  const triggerBurst = (type) => setMicroBurst({ type, key: Date.now() });

  // Load saved data on mount
  useEffect(() => {
    const d = loadData();
    if (d) {
      if (d.setupDone) setSetupDone(true);
      if (d.partnerName) setPartnerName(d.partnerName);
      if (d.startDate) setStartDate(d.startDate);
      if (d.partner) setPartner(d.partner);
      if (d.events) setEvents(d.events);
      if (d.memories) setMemories(d.memories);
      if (d.bucketList) setBucketList(d.bucketList);
      if (d.gifts) setGifts(d.gifts);
      if (d.plans) setPlans(d.plans);
      if (d.dark !== undefined) setDark(d.dark);
      if (d.paletteId) setPaletteId(d.paletteId);
      if (d.fontId) setFontId(d.fontId);
      if (d.setupDone) setShowSplash(false);
    }
    setDataLoaded(true);
  }, []);

  // Auto-save when data changes
  useEffect(() => {
    if (!dataLoaded) return;
    saveData({
      setupDone, partnerName, startDate, partner, events,
      memories: memories.map(m => ({ ...m, image: m.image ? "(saved)" : null })),
      bucketList, gifts, plans, dark, paletteId, fontId
    });
  }, [dataLoaded, setupDone, partnerName, startDate, partner, events, memories, bucketList, gifts, plans, dark, paletteId, fontId]);

  useEffect(() => { const t = setInterval(() => setHeartAnim(h => !h), 1200); return () => clearInterval(t); }, []);

  // Celebration detection — check if today matches any special date
  useEffect(() => {
    if (!setupDone) return;
    const now = new Date();
    const todayD = now.getDate(), todayM = now.getMonth();

    // Check anniversary (startDate)
    if (startDate) {
      const sd = new Date(startDate);
      if (sd.getDate() === todayD && sd.getMonth() === todayM && sd.getFullYear() !== now.getFullYear()) {
        const years = now.getFullYear() - sd.getFullYear();
        setCelebration({
          type: "anniversary",
          emoji: "💕",
          title: `${years}. Yıl Dönümünüz Kutlu Olsun!`,
          message: `Bugün ${partnerName} ile tam ${years} yıl oldu! Birlikte geçirdiğiniz her an çok değerli. Nice mutlu yıllara!`
        });
        return;
      }
    }

    // Check events (birthday, custom events etc.)
    for (const ev of events) {
      if (!ev.date) continue;
      const ed = new Date(ev.date);
      if (ed.getDate() === todayD && ed.getMonth() === todayM) {
        // Determine if it's a birthday or other event
        const isBirthday = ev.title.toLowerCase().includes("doğum");
        setCelebration({
          type: isBirthday ? "birthday" : "event",
          emoji: ev.icon || (isBirthday ? "🎂" : "🎉"),
          title: isBirthday
            ? `${partnerName} Doğum Günün Kutlu Olsun!`
            : `Bugün ${ev.title}!`,
          message: isBirthday
            ? `Bugün çok özel bir gün! ${partnerName} için bu günü unutulmaz kılın! 🎉`
            : `${partnerName} ile birlikte kutlayacağınız harika bir gün! ${ev.icon}`
        });
        return;
      }
    }
  }, [setupDone, startDate, events, partnerName]);

  useEffect(() => {
    if (!notifyEnabled || events.length === 0) return;
    const check = () => {
      events.forEach(ev => {
        const left = getDaysLeft(ev.date);
        if (left <= 7 && left > 0 && "Notification" in window && Notification.permission === "granted") {
          new Notification(`${ev.icon} ${ev.title}`, { body: `${left} gün kaldı!` });
        }
      });
    };
    check();
    const interval = setInterval(check, 3600000);
    return () => clearInterval(interval);
  }, [notifyEnabled, events]);

  const toggleNotify = async () => {
    if (!notifyEnabled) {
      if ("Notification" in window) { const p = await Notification.requestPermission(); if (p === "granted") setNotifyEnabled(true); }
    } else setNotifyEnabled(false);
  };

  const IS = mkInput(T); const BS = mkBtn(T);
  const days = getDaysDiff(startDate);
  const sortedEv = [...events].sort((a, b) => getDaysLeft(a.date) - getDaysLeft(b.date));
  const visibleEv = showAllEvents ? sortedEv : sortedEv.slice(0, 3);

  // Wait for data to load before showing anything
  if (!dataLoaded) return null;

  if (showSplash) return <SplashScreen onDone={() => setShowSplash(false)} />;

  if (!setupDone && !showLoading) return <OnboardingScreen onFinish={(data) => { setPendingData(data); setShowLoading(true); }} T={T} />;

  if (showLoading) return <LoadingScreen T={T} onDone={() => {
    if (pendingData) {
      setPartnerName(pendingData.partnerName || "Sevgilinizin Adı");
      setStartDate(pendingData.startDate);
      const evs = [];
      if (pendingData.birthDate) evs.push({ id: 1, title: "Doğum Günü", date: pendingData.birthDate, icon: "🎂", color: "#FF6B9D" });
      setEvents(evs);
    }
    setShowLoading(false);
    setSetupDone(true);
    setIsFirstVisit(true);
    setTimeout(() => setIsFirstVisit(false), 5000);
  }} />;

  // SVG Nav Icons — outline (inactive) and solid (active)
  const NavIcon = ({ id, active, accent }) => {
    const s = active ? accent : "currentColor";
    const sw = active ? "0" : "1.8";
    const fill = active ? accent : "none";
    if (id === "home") return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={fill} stroke={active ? "none" : s} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
        {!active && <path d="M9 22V12h6v10"/>}
      </svg>
    );
    if (id === "timeline") return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={fill} stroke={active ? "none" : s} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="3"/><path d="M16 2v4M8 2v4M3 10h18" stroke={active ? "white" : s} strokeWidth="1.8" fill="none"/>
      </svg>
    );
    if (id === "cards") return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={fill} stroke={active ? "none" : s} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="3"/>
        {!active && <><path d="M3 9h18M3 15h18M9 3v18"/></>}
        {active && <><path d="M3 9h18M3 15h18M9 3v18" stroke="white" strokeWidth="1.5" fill="none"/></>}
      </svg>
    );
    if (id === "events") return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={fill} stroke={active ? "none" : s} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h7"/>
        <path d={active ? "M16 3l5 5-9.5 9.5H7v-4.5L16 3z" : "M16 3l5 5-9.5 9.5H7v-4.5L16 3z"} stroke={active ? "white" : s} strokeWidth="1.8" fill="none"/>
      </svg>
    );
    return null;
  };

  const TABS = [
    { id: "home", label: "Bugün" },
    { id: "timeline", label: "Takvim" },
    null,
    { id: "cards", label: "Anılar" },
    { id: "events", label: "Özel Günler" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: F.body, maxWidth: 430, margin: "0 auto", position: "relative", overflow: "hidden" }}>
      <FontLoader />
      <style>{`
        @keyframes ripplePulse {
          0% { box-shadow: 0 0 0 0 rgba(233,30,140,0.4); }
          70% { box-shadow: 0 0 0 14px rgba(233,30,140,0); }
          100% { box-shadow: 0 0 0 0 rgba(233,30,140,0); }
        }
      `}</style>

      {/* Welcome particles on first visit */}
      {isFirstVisit && <WelcomeParticles T={T} />}

      {/* Celebration overlay */}
      {celebration && <CelebrationOverlay type={celebration.type} title={celebration.title} emoji={celebration.emoji} message={celebration.message} onClose={() => setCelebration(null)} T={T} />}
      {showSettings && (
        <div style={{ position: "fixed", inset: 0, background: T.modalOverlay, zIndex: 200, backdropFilter: "blur(4px)" }} onClick={() => setShowSettings(false)}>
          <div style={{
            position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
            width: "100%", maxWidth: 430, maxHeight: "88%",
            background: T.modalBg, borderRadius: "24px 24px 0 0",
            boxShadow: "0 -8px 40px rgba(0,0,0,0.15)",
            overflowY: "scroll", WebkitOverflowScrolling: "touch"
          }} onClick={e => e.stopPropagation()}>
            {/* Sticky header */}
            <div style={{ position: "sticky", top: 0, background: T.modalBg, zIndex: 10, padding: "24px 24px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${T.inputBorder}` }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, fontFamily: F.heading, color: T.text }}>⚙️ Ayarlar</h2>
              <button onClick={() => setShowSettings(false)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: T.textMuted, padding: 4 }}>✕</button>
            </div>
            {/* Content */}
            <div style={{ padding: "16px 24px 40px", display: "flex", flexDirection: "column", gap: 12 }}>
              <label style={{ fontSize: 12, color: T.labelColor, fontWeight: 700 }}>SEVGİLİNİZİN ADI</label>
              <input value={partnerName} onChange={e => setPartnerName(e.target.value)} style={IS} />
              <label style={{ fontSize: 12, color: T.labelColor, fontWeight: 700 }}>BİRLİKTELİK BAŞLANGIÇ TARİHİ</label>
              <CustomDatePicker value={startDate} onChange={v => setStartDate(v)} T={T} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0" }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>🌙 Karanlık Mod</span>
                <button onClick={() => setDark(d => !d)} style={{ width: 50, height: 28, borderRadius: 14, border: "none", cursor: "pointer", background: dark ? T.accentGrad : T.inputBorder, position: "relative", transition: "all 0.3s" }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: "white", position: "absolute", top: 3, left: dark ? 25 : 3, transition: "all 0.3s", boxShadow: "0 2px 6px rgba(0,0,0,0.15)" }} />
                </button>
              </div>

              {/* Theme Palette Selector */}
              <label style={{ fontSize: 12, color: T.labelColor, fontWeight: 700, marginTop: 4 }}>🎨 RENK TEMASI</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {PALETTES.map(p => {
                  const active = paletteId === p.id;
                  return (
                    <button key={p.id} onClick={() => setPaletteId(p.id)} style={{
                      padding: "12px 8px", borderRadius: 16, border: active ? `2px solid ${p.accent}` : `1.5px solid ${T.inputBorder}`,
                      background: active ? `${p.accent}10` : T.card,
                      cursor: "pointer", fontFamily: F.body, textAlign: "center",
                      boxShadow: active ? `0 4px 16px ${p.accent}20` : "none",
                      transition: "all 0.25s", transform: active ? "scale(1.03)" : "scale(1)"
                    }}>
                      <div style={{ fontSize: 22, marginBottom: 4 }}>{p.emoji}</div>
                      <div style={{ fontSize: 11, fontWeight: active ? 700 : 500, color: active ? p.accent : T.textSec }}>{p.name}</div>
                      <div style={{ display: "flex", gap: 3, justifyContent: "center", marginTop: 6 }}>
                        <div style={{ width: 12, height: 12, borderRadius: "50%", background: p.accent }} />
                        <div style={{ width: 12, height: 12, borderRadius: "50%", background: p.accent2 }} />
                        <div style={{ width: 12, height: 12, borderRadius: "50%", background: p.soft }} />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Font Selector */}
              <label style={{ fontSize: 12, color: T.labelColor, fontWeight: 700, marginTop: 4 }}>✍️ YAZI FONTU</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {FONT_PRESETS.map(fp => {
                  const active = fontId === fp.id;
                  return (
                    <button key={fp.id} onClick={() => setFontId(fp.id)} style={{
                      padding: "14px 8px", borderRadius: 16, border: active ? `2px solid ${T.accent}` : `1.5px solid ${T.inputBorder}`,
                      background: active ? `${T.accent}10` : T.card,
                      cursor: "pointer", fontFamily: F.body, textAlign: "center",
                      boxShadow: active ? `0 4px 16px ${T.accent}20` : "none",
                      transition: "all 0.25s", transform: active ? "scale(1.03)" : "scale(1)"
                    }}>
                      <div style={{ fontSize: 20, fontWeight: 700, fontFamily: fp.heading, color: active ? T.accent : T.text, marginBottom: 4, lineHeight: 1 }}>{fp.sample}</div>
                      <div style={{ fontSize: 10, fontWeight: active ? 700 : 500, color: active ? T.accent : T.textSec, fontFamily: fp.body }}>{fp.name}</div>
                    </button>
                  );
                })}
              </div>

              <button onClick={() => setShowSettings(false)} style={BS}>Kaydet ✓</button>
              <button onClick={() => { setShowSettings(false); setTimeout(() => setShowAbout(true), 150); }} style={{ background: "none", border: "none", padding: "10px 0", fontSize: 13, color: T.textMuted, cursor: "pointer", fontFamily: F.body, width: "100%", textAlign: "center" }}>ℹ️ Hakkında</button>
              <button onClick={() => { setShowSettings(false); setTimeout(() => setConfirmReset(true), 150); }} style={{ background: "none", border: `1.5px solid ${T.inputBorder}`, borderRadius: 14, padding: 14, fontSize: 14, color: T.accent, cursor: "pointer", fontFamily: F.body, width: "100%" }}>Kurulumu Sıfırla</button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation */}
      {confirmReset && (
        <div style={{ position: "fixed", inset: 0, background: T.modalOverlay, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300, backdropFilter: "blur(4px)" }} onClick={() => setConfirmReset(false)}>
          <div style={{ background: T.modalBg, borderRadius: 24, padding: "28px 24px", maxWidth: 300, textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
            <h3 style={{ fontSize: 17, fontWeight: 700, fontFamily: F.heading, color: T.text, margin: "0 0 8px" }}>Kurulumu Sıfırla</h3>
            <p style={{ fontSize: 13, color: T.textMuted, margin: "0 0 24px", lineHeight: 1.5 }}>Tüm verileriniz silinecek ve kurulum baştan başlayacak. Bu işlem geri alınamaz.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setConfirmReset(false)} style={{ flex: 1, padding: "12px", borderRadius: 14, border: `1.5px solid ${T.inputBorder}`, background: "transparent", color: T.textSec, fontSize: 14, fontWeight: 600, fontFamily: F.body, cursor: "pointer" }}>Vazgeç</button>
              <button onClick={() => {
                saveData({});
                setSetupDone(false); setConfirmReset(false);
                setPartnerName("Sevgilinizin Adı"); setStartDate(""); setPartner({ cards: DEFAULT_CARDS });
                setEvents([]); setMemories([]); setBucketList([]); setGifts([]); setPlans([]);
                setDark(false); setPaletteId("rose"); setFontId("modern");
                setShowSplash(true);
              }} style={{ flex: 1, padding: "12px", borderRadius: 14, border: "none", background: "linear-gradient(135deg, #ef4444, #dc2626)", color: "white", fontSize: 14, fontWeight: 600, fontFamily: F.body, cursor: "pointer", boxShadow: "0 4px 12px rgba(239,68,68,0.3)" }}>Sıfırla</button>
            </div>
          </div>
        </div>
      )}

      {/* About Modal */}
      {showAbout && (
        <Modal onClose={() => setShowAbout(false)} title="Hakkında" T={T}>
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <div style={{
              width: 80, height: 80, borderRadius: 24, margin: "0 auto 16px",
              background: T.card, display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 8px 28px ${T.accent}20`, border: `1px solid ${T.cardBorder}`
            }}>
              <AppLogo size={60} />
            </div>
            <h3 style={{ fontSize: 24, fontWeight: 800, fontFamily: F.heading, color: T.accent, margin: "0 0 4px" }}>MySwan</h3>
            <p style={{ fontSize: 12, color: T.textMuted, margin: "0 0 16px" }}>Versiyon 1.0.0</p>
            <p style={{ fontSize: 14, color: T.textSec, lineHeight: 1.6, margin: "0 0 20px" }}>
              Sevgilinizle birlikte geçirdiğiniz her anı, her detayı ve her hayali saklamak için tasarlandı. 💕
            </p>
            <div style={{ borderTop: `1px solid ${T.inputBorder}`, paddingTop: 16 }}>
              <p style={{ fontSize: 12, color: T.textMuted, margin: "0 0 4px" }}>Tasarım & Geliştirme</p>
              <p style={{ fontSize: 15, fontWeight: 700, fontFamily: F.heading, color: T.accent, margin: 0 }}>Canova Studio</p>
            </div>
          </div>
        </Modal>
      )}

      <div style={{ position: "fixed", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: T.bubble1, pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: 80, left: -40, width: 160, height: 160, borderRadius: "50%", background: T.bubble2, pointerEvents: "none" }} />

      <div style={{ paddingBottom: 90 }}>
        {tab === "home" && <HomeTab partnerName={partnerName} days={days} events={visibleEv} showAll={showAllEvents} setShowAll={setShowAllEvents} heartAnim={heartAnim} onSettings={() => setShowSettings(true)} T={T} isFirstVisit={isFirstVisit} plans={plans} setPlans={setPlans} />}
        {tab === "timeline" && <TimelineTab memories={memories} setMemories={setMemories} T={T}
          onEdit={(item) => setEditMemory({ ...item })}
          onDelete={(id) => setMemories(m => m.filter(x => x.id !== id))}
        />}
        {tab === "cards" && <CardsTab partner={partner} setPartner={setPartner} bucketList={bucketList} setBucketList={setBucketList} gifts={gifts} setGifts={setGifts} T={T} showToast={showToast} />}
        {tab === "events" && <EventsTab events={events} setShowAddEvent={setShowAddEvent} T={T} />}
      </div>

      {/* Bottom Nav */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: T.navBg, backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", borderTop: `1px solid ${T.navBorder}`, display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 20, paddingTop: 10, paddingLeft: 8, paddingRight: 8, zIndex: 100, boxShadow: T.navShadow }}>
        {TABS.map((t, i) => {
          if (!t) return (
            <div key="plus" style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
              <button onClick={() => { if (tab === "timeline") setShowAddMemory(true); else setShowAddEvent(true); }} style={{
                width: 56, height: 56, borderRadius: "50%", background: T.accentGrad,
                border: `4px solid ${T.card}`, cursor: "pointer", color: "white",
                fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 6px 24px ${T.accent}70`, marginTop: -18, lineHeight: 1,
                animation: isFirstVisit ? "ripplePulse 1.5s ease-out infinite" : "none"
              }}>+</button>
            </div>
          );
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flex: 1, color: tab === t.id ? T.accent : T.textMuted, fontFamily: F.body, fontSize: 9, transition: "all 0.2s", padding: "4px 0" }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: tab === t.id ? T.softBg : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.25s" }}>
                <NavIcon id={t.id} active={tab === t.id} accent={T.accent} />
              </div>
              <span style={{ fontWeight: tab === t.id ? 700 : 400, letterSpacing: "0.2px" }}>{t.label}</span>
            </button>
          );
        })}
      </div>

      {showAddEvent && (
        <Modal onClose={() => setShowAddEvent(false)} title="Özel Gün Ekle" T={T}>
          <input placeholder="Başlık" value={newEvent.title} onChange={e => setNewEvent(p => ({ ...p, title: e.target.value }))} style={IS} />
          <CustomDatePicker value={newEvent.date} onChange={v => setNewEvent(p => ({ ...p, date: v }))} T={T} />
          <EmojiPicker selected={newEvent.icon} onSelect={ic => setNewEvent(p => ({ ...p, icon: ic }))} T={T} />
          <button onClick={() => { if (newEvent.title && newEvent.date) { setEvents(ev => [...ev, { ...newEvent, id: Date.now(), color: "#FF6B9D" }]); setNewEvent({ title: "", date: "", icon: "🎂" }); setShowAddEvent(false); triggerBurst("confetti"); } }} style={BS}>Ekle</button>
        </Modal>
      )}

      {showAddMemory && (
        <Modal onClose={() => setShowAddMemory(false)} title="Anı Ekle" T={T}>
          <input placeholder="Başlık" value={newMemory.title} onChange={e => setNewMemory(p => ({ ...p, title: e.target.value }))} style={IS} />
          <input placeholder="Açıklama" value={newMemory.desc} onChange={e => setNewMemory(p => ({ ...p, desc: e.target.value }))} style={IS} />
          <input placeholder="📍 Konum (opsiyonel)" value={newMemory.location} onChange={e => setNewMemory(p => ({ ...p, location: e.target.value }))} style={IS} />
          <CustomDatePicker value={newMemory.date} onChange={v => setNewMemory(p => ({ ...p, date: v }))} T={T} />
          <button onClick={() => {
            if (newMemory.title && newMemory.date) {
              setMemories(m => [...m, { ...newMemory, id: Date.now(), type: "memory", icon: "📷", image: null }]);
              setNewMemory({ title: "", desc: "", date: "", location: "" });
              setShowAddMemory(false);
              triggerBurst("heart");
            }
          }} style={BS}>Ekle</button>
        </Modal>
      )}

      {/* Edit Memory Modal */}
      {editMemory && (
        <Modal onClose={() => setEditMemory(null)} title="Anıyı Düzenle" T={T}>
          <input placeholder="Başlık" value={editMemory.title} onChange={e => setEditMemory(p => ({ ...p, title: e.target.value }))} style={IS} />
          <input placeholder="Açıklama" value={editMemory.desc || ""} onChange={e => setEditMemory(p => ({ ...p, desc: e.target.value }))} style={IS} />
          <input placeholder="📍 Konum (opsiyonel)" value={editMemory.location || ""} onChange={e => setEditMemory(p => ({ ...p, location: e.target.value }))} style={IS} />
          <CustomDatePicker value={editMemory.date} onChange={v => setEditMemory(p => ({ ...p, date: v }))} T={T} />
          <button onClick={() => {
            if (editMemory.title && editMemory.date) {
              setMemories(m => m.map(x => x.id === editMemory.id ? { ...x, title: editMemory.title, desc: editMemory.desc, date: editMemory.date, location: editMemory.location } : x));
              setEditMemory(null);
              showToast("📷", "Anı güncellendi! ✨");
            }
          }} style={BS}>Kaydet</button>
        </Modal>
      )}

      {editCard !== null && (
        <Modal onClose={() => setEditCard(null)} title="Kartı Düzenle" T={T}>
          <div style={{ fontSize: 32, textAlign: "center", margin: "8px 0" }}>{partner.cards.find(c => c.id === editCard)?.icon}</div>
          <p style={{ color: T.textSec, fontSize: 12, textAlign: "center", marginBottom: 8 }}>{partner.cards.find(c => c.id === editCard)?.label}</p>
          <input value={editCardValue} onChange={e => setEditCardValue(e.target.value)} style={IS} />
          <button onClick={() => {
            setPartner(p => ({ ...p, cards: p.cards.map(c => c.id === editCard ? { ...c, value: editCardValue } : c) }));
            setEditCard(null);
          }} style={BS}>Kaydet</button>
        </Modal>
      )}

      {/* Toast message */}
      <Toast message={toast.message} icon={toast.icon} visible={toast.visible} T={T} />
      {/* Micro burst effect */}
      {microBurst && <MicroBurst key={microBurst.key} type={microBurst.type} T={T} />}
    </div>
  );
}
