import React, { useState, useRef, useEffect } from "react";
import { Wand2, Download, RefreshCw, Map } from "lucide-react";

/* ══════════════════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════════════════ */
const CW = 600;
const CH = 400;
const WT = 8;          // wall thickness

/* ══════════════════════════════════════════════════════
   ROOM CATALOGUE & HELPERS
══════════════════════════════════════════════════════ */
const ROOM_DEFS = [
  { key: "bedroom", label: "BEDROOM", minW: 100, minH: 90 },
  { key: "bath", label: "BATH", minW: 50, minH: 60 },
  { key: "kitchen", label: "KITCHEN", minW: 80, minH: 80 },
  { key: "living", label: "LOUNGE", minW: 130, minH: 120 },
  { key: "gate", label: "MAIN GATE", minW: 40, minH: 10 },
];

function fmtDim(px) { return `${Math.round(px / 10)} ft`; }

/* ══════════════════════════════════════════════════════
   DETERMINISTIC FALLBACK
══════════════════════════════════════════════════════ */
function generateFallback(marlas, bedrooms, bathrooms, kitchens) {
  const rooms = [];
  const W_FT = 25;
  const L_FT = 22;
  const totalArea = marlas * W_FT * L_FT;

  // Logic to fill space roughly
  let curX = 20, curY = 20;
  const PAD = WT;

  // Main Gate first
  rooms.push({ room: "MAIN GATE", key: "gate", x: 20, y: 360, w: 60, h: 10 });

  // Add Rooms
  for (let i = 1; i <= bedrooms; i++) {
    rooms.push({ room: `BEDROOM ${i}`, key: "bedroom", x: curX, y: curY, w: 120, h: 100 });
    curX += 130;
    if (curX > CW - 150) { curX = 20; curY += 110; }
  }
  for (let i = 1; i <= bathrooms; i++) {
    rooms.push({ room: `BATH ${i}`, key: "bath", x: curX, y: curY, w: 60, h: 70 });
    curX += 70;
    if (curX > CW - 80) { curX = 20; curY += 80; }
  }
  for (let i = 1; i <= kitchens; i++) {
    rooms.push({ room: `KITCHEN ${i}`, key: "kitchen", x: curX, y: curY, w: 90, h: 90 });
    curX += 100;
  }

  return rooms.slice(0, 15); // limit
}

/* ══════════════════════════════════════════════════════
   DRAWING ENGINE
══════════════════════════════════════════════════════ */
function drawFloorPlan(canvas, rooms, title) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, CW, CH);

  // Background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, CW, CH);

  if (!rooms.length) return;

  // Outer Boundary
  const minX = Math.min(...rooms.map(r => r.x));
  const minY = Math.min(...rooms.map(r => r.y));
  const maxX = Math.max(...rooms.map(r => r.x + r.w));
  const maxY = Math.max(...rooms.map(r => r.y + r.h));
  const BP = 10;

  ctx.strokeStyle = "#000";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 5]);
  ctx.strokeRect(minX - BP, minY - BP, maxX - minX + BP * 2, maxY - minY + BP * 2);
  ctx.setLineDash([]);

  // Draw Rooms
  rooms.forEach(r => {
    const { x, y, w, h, room, key } = r;

    if (key === "gate") {
      drawGate(ctx, x, y, w, h, room);
      return;
    }

    // Walls
    ctx.fillStyle = "#fff";
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = WT;
    ctx.strokeRect(x, y, w, h);

    // Wall Detail
    ctx.strokeStyle = "#666";
    ctx.lineWidth = 0.5;
    ctx.strokeRect(x + WT / 2, y + WT / 2, w - WT, h - WT);

    // Labels & Dims
    ctx.fillStyle = "#000";
    ctx.font = "bold 9px 'Courier New', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(room, x + w / 2, y + h / 2 - 6);
    ctx.font = "8px 'Courier New', monospace";
    ctx.fillText(`${Math.round(w / 10)}'x${Math.round(h / 10)}'`, x + w / 2, y + h / 2 + 6);

    // Symbol
    drawSymbol(ctx, x, y, w, h, key);
  });

  // Footer Title
  ctx.fillStyle = "#000";
  ctx.font = "bold 10px 'Courier New', monospace";
  ctx.textAlign = "center";
  ctx.fillText(title, CW / 2, CH - 10);

  // North arrow
  drawNorth(ctx, CW - 25, 25);
}

function drawGate(ctx, x, y, w, h, name) {
  ctx.fillStyle = "#fff";
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x, y + h / 2); ctx.lineTo(x + w, y + h / 2);
  ctx.stroke();

  // Pillars
  ctx.fillRect(x - 4, y, 8, h);
  ctx.fillRect(x + w - 4, y, 8, h);
  ctx.strokeRect(x - 4, y, 8, h);
  ctx.strokeRect(x + w - 4, y, 8, h);

  ctx.fillStyle = "#000";
  ctx.font = "bold 8px 'Courier New', monospace";
  ctx.textAlign = "center";
  ctx.fillText(name, x + w / 2, y - 6);
  ctx.fillText(`${Math.round(w / 10)}' wide`, x + w / 2, y + h + 10);
}

function drawSymbol(ctx, x, y, w, h, key) {
  ctx.strokeStyle = "#444";
  ctx.lineWidth = 0.6;
  const cx = x + w / 2, cy = y + h / 2;

  if (key === "bedroom") {
    ctx.strokeRect(cx - 20, cy + 15, 40, 10); // pillow
  } else if (key === "bath") {
    ctx.beginPath(); ctx.arc(cx, cy + 20, 6, 0, Math.PI * 2); ctx.stroke(); // sink
  } else if (key === "kitchen") {
    ctx.strokeRect(x + 5, y + 5, w - 10, 10); // shelf
  }
}

function drawNorth(ctx, cx, cy) {
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(cx, cy - 12); ctx.lineTo(cx, cy + 12); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx - 4, cy - 12); ctx.lineTo(cx + 4, cy - 12); ctx.stroke();
  ctx.fillStyle = "#000";
  ctx.font = "bold 8px 'Courier New', monospace";
  ctx.fillText("N", cx, cy - 15);
}

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════ */
export const FloorPlanGenerator = () => {
  const [form, setForm] = useState({ plotInMarla: "5", bedrooms: 2, bathrooms: 2, kitchens: 1 });
  const [rooms, setRooms] = useState([]);
  const [jsonText, setJsonText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const canvasRef = useRef(null);
  const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  useEffect(() => {
    if (rooms.length) {
      const title = `FLOOR PLAN: ${form.plotInMarla} MARLA | ${form.bedrooms} BR | ${form.bathrooms} BA`;
      drawFloorPlan(canvasRef.current, rooms, title);
    }
  }, [rooms, form]);

  const buildPrompt = () => `Generate a realistic 2D house floor plan JSON for a ${form.plotInMarla} Marla plot.
Rules:
- 1 Marla = 25 ft width x 22 ft length.
- Scale coordinates (x, y, w, h) for a ${CW}x${CH} canvas.
- Include: ${form.bedrooms} Bedrooms, ${form.bathrooms} Bathrooms, ${form.kitchens} Kitchens, Living Room, and ONE "MAIN GATE" (key: "gate").
- Main Gate must be at boundary (e.g. y near ${CH - 40}) and ~10-15ft wide.
- All rooms must have realistic sizes (e.g. Master Bedroom 12x14ft, Bath 5x7ft).
- NO OVERLAPPING. Must be a usable architectural layout.
- Returns JSON array: [{"room":"BEDROOM 1","key":"bedroom","x":val,"y":val,"w":val,"h":val},...]
- Room keys: bedroom, bath, kitchen, living, gate, porch, lobby, laundry.`;

  const generate = async () => {
    if (!form.plotInMarla) { setError("Enter Marla size"); return; }
    setError(""); setLoading(true);
    try {
      let parsed;
      if (GEMINI_KEY) {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: buildPrompt() }] }] })
        });
        if (!res.ok) throw new Error("API " + res.status);
        const data = await res.json();
        const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
        const m = raw.match(/\[[\s\S]*\]/);
        if (!m) throw new Error("No JSON in response");
        parsed = JSON.parse(m[0]);
      } else {
        parsed = generateFallback(Number(form.plotInMarla), form.bedrooms, form.bathrooms, form.kitchens);
      }
      setRooms(parsed);
      setJsonText(JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.warn("Generation failed", e);
      setRooms(generateFallback(Number(form.plotInMarla), form.bedrooms, form.bathrooms, form.kitchens));
      setError("AI generation failed. Showing fallback layout.");
    } finally { setLoading(false); }
  };

  const download = () => {
    const a = document.createElement("a");
    a.download = `floor-plan-${form.plotInMarla}-marla.png`;
    a.href = canvasRef.current.toDataURL("image/png");
    a.click();
  };

  return (
    <div style={{ padding: "24px", background: "#f9fafb", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <div style={{ width: 40, height: 40, background: "#111", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Map size={20} color="#fff" />
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Architectural Plan AI</h2>
          <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>1 Marla = 25'x22' · Realistic layouts with Main Gate</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "flex-start" }}>

        {/* Controls */}
        <div style={{ width: 280, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <Label>PLOT SIZE (MARLA)</Label>
            <input type="number" value={form.plotInMarla} onChange={e => setForm({ ...form, plotInMarla: e.target.value })} style={inputStyle} />

            <div style={{ marginTop: 16 }}>
              <Label>BEDROOMS</Label>
              <Chips vals={[1, 2, 3, 4, 5]} active={form.bedrooms} pick={n => setForm({ ...form, bedrooms: n })} />
            </div>

            <div style={{ marginTop: 16 }}>
              <Label>BATHROOMS</Label>
              <Chips vals={[1, 2, 3, 4]} active={form.bathrooms} pick={n => setForm({ ...form, bathrooms: n })} />
            </div>

            <div style={{ marginTop: 16 }}>
              <Label>KITCHENS</Label>
              <Chips vals={[1, 2]} active={form.kitchens} pick={n => setForm({ ...form, kitchens: n })} />
            </div>
          </div>

          <button onClick={generate} disabled={loading} style={{
            background: "#111", color: "#fff", border: "none", padding: "14px", borderRadius: 10,
            fontWeight: 700, cursor: loading ? "wait" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8
          }}>
            {loading ? <RefreshCw size={16} className="spin" /> : <Wand2 size={16} />}
            {rooms.length ? "Regenerate Layout" : "Generate Plan"}
          </button>

          {rooms.length > 0 && (
            <button onClick={download} style={{
              background: "#fff", border: "1px solid #111", padding: "12px", borderRadius: 10, fontWeight: 700, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8
            }}>
              <Download size={16} /> Export as Image
            </button>
          )}

          {error && <p style={{ fontSize: 11, color: "#ef4444", textAlign: "center", margin: 0 }}>{error}</p>}
        </div>

        {/* Viewport */}
        <div style={{ flex: 1, minWidth: 320 }}>
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
            <div style={{ padding: "10px 16px", background: "#f3f4f6", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "monospace", color: "#4b5563" }}>2D_BLUEPRINT_CAD_ENGINE</span>
              {rooms.length > 0 && <span style={{ fontSize: 10, color: "#9ca3af" }}>{form.plotInMarla} Marla Plan</span>}
            </div>
            <div style={{ display: "flex", justifyContent: "center", padding: "20px", background: "#fff" }}>
              <canvas ref={canvasRef} width={CW} height={CH} style={{ border: "1px solid #f3f4f6", maxWidth: "100%", height: "auto" }} />
              {rooms.length === 0 && !loading && (
                <div style={{ position: "absolute", top: "50%", color: "#9ca3af", textAlign: "center" }}>
                  <Map size={48} style={{ opacity: 0.2, marginBottom: 8 }} />
                  <p style={{ margin: 0, fontSize: 14 }}>Enter details and click Generate</p>
                </div>
              )}
            </div>
          </div>

          {rooms.length > 0 && (
            <div style={{ marginTop: 16, background: "#111", borderRadius: 12, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ color: "#9ca3af", fontSize: 10, fontFamily: "monospace" }}>BLUEPRINT_DATA_JSON</span>
                <button
                  onClick={() => { navigator.clipboard.writeText(jsonText); }}
                  style={{ background: "#222", border: "none", color: "#f9fafb", fontSize: 10, padding: "4px 10px", borderRadius: 4, cursor: "pointer" }}
                >
                  COPY JSON
                </button>
              </div>
              <pre style={{ margin: 0, color: "#10b981", fontSize: 10, overflow: "auto", maxHeight: 150, fontFamily: "'Courier New', monospace" }}>{jsonText}</pre>
            </div>
          )}
        </div>
      </div>
      <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

const Label = ({ children }) => (
  <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 700, color: "#374151", fontFamily: "'Courier New', monospace" }}>{children}</p>
);

const inputStyle = {
  width: "100%", padding: "10px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 14, color: "#111", outline: "none"
};

const Chips = ({ vals, active, pick }) => (
  <div style={{ display: "flex", gap: 6 }}>
    {vals.map(v => (
      <button key={v} onClick={() => pick(v)} style={{
        flex: 1, padding: "8px", borderRadius: 8, border: active === v ? "2px solid #111" : "1px solid #e5e7eb",
        background: active === v ? "#111" : "#fff", color: active === v ? "#fff" : "#111", fontSize: 13, fontWeight: 600, cursor: "pointer"
      }}>{v}</button>
    ))}
  </div>
);
