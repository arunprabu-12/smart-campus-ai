import { useState, useRef } from "react";
import { Search, ArrowRight, TriangleAlert, ChevronDown, ChevronUp, X } from "lucide-react";

const RAW_NOISE = [
  "47 reviews mention shipping delays",
  "reddit thread, 900 upvotes, mostly off-topic",
  "affiliate roundup #12",
  "spec sheet, page 4 of 9",
  "forum post from 2019",
  "\"best of\" listicle, sponsored",
  "comparison chart, missing half the fields",
  "youtube review, 22 minutes",
];

async function callClaude(payload) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("API request failed: " + res.status);
  return res.json();
}

function extractJson(text) {
  const cleaned = text.replace(/```json|```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON object found in response");
  return JSON.parse(cleaned.slice(start, end + 1));
}

export default function DecisionEngine() {
  const [stage, setStage] = useState("input"); // input | working | result | error
  const [question, setQuestion] = useState("");
  const [constraints, setConstraints] = useState("");
  const [noiseIdx, setNoiseIdx] = useState(0);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const noiseTimer = useRef(null);

  const startNoiseAnimation = () => {
    setNoiseIdx(0);
    noiseTimer.current = setInterval(() => {
      setNoiseIdx((i) => (i + 1) % (RAW_NOISE.length + 4));
    }, 480);
  };

  const stopNoiseAnimation = () => {
    if (noiseTimer.current) clearInterval(noiseTimer.current);
  };

  const runResearch = async () => {
    if (!question.trim()) return;
    setStage("working");
    setErrorMsg("");
    startNoiseAnimation();

    const system = `You are a decision-research engine. Someone is deciding between options and wants ONE clear recommendation, not a survey of possibilities.

Research the question using web search. Then respond with ONLY a JSON object (no markdown fences, no preamble, no trailing text) with this exact shape:

{
  "recommendation": "the single option you recommend, short",
  "why": ["2-4 short bullet reasons, only the factors that actually decided this"],
  "comparison": {
    "factors": ["factor 1", "factor 2", "..."],
    "options": [
      {"name": "option A", "values": ["value for factor 1", "value for factor 2", "..."]},
      {"name": "option B", "values": ["...", "..."]}
    ]
  },
  "uncertainties": ["things you could not verify, things that depend on info you don't have, or claims sources disagreed on - empty array if genuinely none"],
  "confidence": "high" | "medium" | "low",
  "sources": ["short source name or domain", "..."]
}

Rules:
- Only include comparison factors that actually differ between options and mattered to the decision. Cut anything that doesn't change the answer.
- Limit to the top 3-5 options max in the comparison, and only if the question is genuinely comparative. If it's a single yes/no or single-item question, comparison.factors and comparison.options can be empty arrays.
- Be honest in "uncertainties" - if you're inferring, guessing, or sources conflict, say so there rather than stating it as fact in the recommendation.
- No hedging in "recommendation" or "why" - save all hedging for "uncertainties".
- confidence should be "low" if you had to guess at anything material, "medium" if mostly solid with minor gaps, "high" if well-supported.`;

    const userMsg = constraints.trim()
      ? `Question: ${question}\n\nConstraints / must-haves: ${constraints}`
      : `Question: ${question}`;

    try {
      const data = await callClaude({
        model: "claude-sonnet-4-6",
        max_tokens: 2000,
        system,
        messages: [{ role: "user", content: userMsg }],
        tools: [{ type: "web_search_20250305", name: "web_search" }],
      });

      const textBlock = (data.content || [])
        .filter((b) => b.type === "text")
        .map((b) => b.text)
        .join("\n");

      if (!textBlock) throw new Error("Empty response from model");
      const parsed = extractJson(textBlock);
      setResult(parsed);
      stopNoiseAnimation();
      setStage("result");
    } catch (err) {
      stopNoiseAnimation();
      setErrorMsg(err.message || "Something went wrong");
      setStage("error");
    }
  };

  const reset = () => {
    setStage("input");
    setResult(null);
    setErrorMsg("");
    setSourcesOpen(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.grain} />
      <div style={styles.container}>
        <Header stage={stage} onReset={reset} />

        {stage === "input" && (
          <InputStage
            question={question}
            setQuestion={setQuestion}
            constraints={constraints}
            setConstraints={setConstraints}
            onSubmit={runResearch}
          />
        )}

        {stage === "working" && <WorkingStage noiseIdx={noiseIdx} question={question} />}

        {stage === "result" && result && (
          <ResultStage
            result={result}
            question={question}
            sourcesOpen={sourcesOpen}
            setSourcesOpen={setSourcesOpen}
            onReset={reset}
          />
        )}

        {stage === "error" && (
          <ErrorStage message={errorMsg} onRetry={runResearch} onReset={reset} />
        )}
      </div>
    </div>
  );
}

function Header({ stage, onReset }) {
  return (
    <div style={styles.header}>
      <div style={styles.headerLeft}>
        <div style={styles.logoMark} />
        <span style={styles.logoText}>SIGNAL</span>
      </div>
      {stage !== "input" && (
        <button onClick={onReset} style={styles.newButton}>
          <X size={13} strokeWidth={2.5} />
          New question
        </button>
      )}
    </div>
  );
}

function InputStage({ question, setQuestion, constraints, setConstraints, onSubmit }) {
  return (
    <div style={styles.inputStage}>
      <h1 style={styles.headline}>
        One question in.
        <br />
        One answer out.
      </h1>
      <p style={styles.subhead}>
        Everything researched, only what mattered kept, the rest thrown away.
      </p>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>WHAT ARE YOU DECIDING</label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. best noise-cancelling headphones under $250 for flights"
          style={styles.textarea}
          rows={3}
        />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>CONSTRAINTS <span style={styles.optional}>(optional)</span></label>
        <input
          value={constraints}
          onChange={(e) => setConstraints(e.target.value)}
          placeholder="must-haves, budget, dealbreakers"
          style={styles.input}
        />
      </div>

      <button
        onClick={onSubmit}
        disabled={!question.trim()}
        style={{
          ...styles.primaryButton,
          opacity: question.trim() ? 1 : 0.4,
          cursor: question.trim() ? "pointer" : "default",
        }}
      >
        Find the answer
        <ArrowRight size={16} strokeWidth={2.5} />
      </button>
    </div>
  );
}

function WorkingStage({ noiseIdx, question }) {
  const visible = RAW_NOISE.slice(0, Math.min(RAW_NOISE.length, noiseIdx + 1));
  return (
    <div style={styles.workingStage}>
      <div style={styles.workingQuestion}>{question}</div>
      <div style={styles.funnel}>
        <div style={styles.noiseCol}>
          <div style={styles.colLabel}>RAW</div>
          <div style={styles.noiseList}>
            {visible.map((n, i) => (
              <div
                key={n}
                style={{
                  ...styles.noiseItem,
                  opacity: i === visible.length - 1 ? 1 : 0.3,
                  textDecoration: i === visible.length - 1 ? "none" : "line-through",
                }}
              >
                {n}
              </div>
            ))}
          </div>
        </div>
        <div style={styles.funnelArrow}>
          <Search size={18} strokeWidth={2} style={styles.spinIcon} />
        </div>
        <div style={styles.signalCol}>
          <div style={styles.colLabel}>SIGNAL</div>
          <div style={styles.signalPulse} />
        </div>
      </div>
      <div style={styles.workingCaption}>researching, comparing, cutting the noise</div>
    </div>
  );
}

function ResultStage({ result, sourcesOpen, setSourcesOpen, onReset }) {
  const hasComparison =
    result.comparison &&
    result.comparison.factors &&
    result.comparison.factors.length > 0 &&
    result.comparison.options &&
    result.comparison.options.length > 0;

  const confColor =
    result.confidence === "high"
      ? "#4FD1C5"
      : result.confidence === "medium"
      ? "#E8B34C"
      : "#E86B4C";

  return (
    <div style={styles.resultStage}>
      <div style={styles.verdictCard}>
        <div style={styles.verdictEyebrow}>
          <span>RECOMMENDATION</span>
          <span style={{ ...styles.confBadge, color: confColor, borderColor: confColor }}>
            {result.confidence} confidence
          </span>
        </div>
        <div style={styles.verdictText}>{result.recommendation}</div>
        {result.why && result.why.length > 0 && (
          <ul style={styles.whyList}>
            {result.why.map((w, i) => (
              <li key={i} style={styles.whyItem}>
                {w}
              </li>
            ))}
          </ul>
        )}
      </div>

      {hasComparison && (
        <div style={styles.section}>
          <div style={styles.sectionLabel}>WHAT ACTUALLY DIFFERED</div>
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.thBlank}></th>
                  {result.comparison.options.map((o) => (
                    <th key={o.name} style={styles.th}>
                      {o.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.comparison.factors.map((factor, fi) => (
                  <tr key={factor}>
                    <td style={styles.tdFactor}>{factor}</td>
                    {result.comparison.options.map((o) => (
                      <td key={o.name} style={styles.td}>
                        {o.values[fi] ?? "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {result.uncertainties && result.uncertainties.length > 0 && (
        <div style={styles.uncertaintyBox}>
          <div style={styles.uncertaintyHeader}>
            <TriangleAlert size={14} strokeWidth={2.5} color="#E8B34C" />
            <span style={styles.uncertaintyLabel}>UNCERTAIN — NOT GUESSED</span>
          </div>
          <ul style={styles.uncertaintyList}>
            {result.uncertainties.map((u, i) => (
              <li key={i} style={styles.uncertaintyItem}>
                {u}
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.sources && result.sources.length > 0 && (
        <div style={styles.sourcesSection}>
          <button
            style={styles.sourcesToggle}
            onClick={() => setSourcesOpen((s) => !s)}
          >
            {sourcesOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            sources ({result.sources.length})
          </button>
          {sourcesOpen && (
            <div style={styles.sourcesList}>
              {result.sources.map((s, i) => (
                <span key={i} style={styles.sourceChip}>
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <button onClick={onReset} style={styles.secondaryButton}>
        Ask another question
      </button>
    </div>
  );
}

function ErrorStage({ message, onRetry, onReset }) {
  return (
    <div style={styles.errorStage}>
      <TriangleAlert size={22} strokeWidth={2} color="#E86B4C" />
      <div style={styles.errorTitle}>Couldn't get a clean answer</div>
      <div style={styles.errorMessage}>{message}</div>
      <div style={styles.errorButtons}>
        <button onClick={onRetry} style={styles.primaryButton}>
          Try again
        </button>
        <button onClick={onReset} style={styles.secondaryButton}>
          Start over
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#14161B",
    color: "#EDEEF0",
    fontFamily: "'Inter', -apple-system, sans-serif",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    padding: "0 16px",
  },
  grain: {
    position: "fixed",
    inset: 0,
    pointerEvents: "none",
    backgroundImage:
      "radial-gradient(circle at 20% 20%, rgba(79,209,197,0.06), transparent 40%), radial-gradient(circle at 80% 70%, rgba(232,179,76,0.05), transparent 40%)",
  },
  container: {
    width: "100%",
    maxWidth: 480,
    padding: "28px 0 60px",
    position: "relative",
    zIndex: 1,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 36,
  },
  headerLeft: { display: "flex", alignItems: "center", gap: 8 },
  logoMark: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#4FD1C5",
    boxShadow: "0 0 8px #4FD1C5",
  },
  logoText: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 13,
    letterSpacing: "0.18em",
    color: "#8A8F98",
    fontWeight: 600,
  },
  newButton: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    background: "transparent",
    border: "1px solid #2A2E37",
    borderRadius: 6,
    color: "#8A8F98",
    fontSize: 12,
    padding: "6px 10px",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  inputStage: {},
  headline: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 34,
    lineHeight: 1.08,
    fontWeight: 600,
    letterSpacing: "-0.01em",
    margin: "0 0 12px",
  },
  subhead: {
    color: "#8A8F98",
    fontSize: 15,
    lineHeight: 1.5,
    margin: "0 0 32px",
  },
  fieldGroup: { marginBottom: 20 },
  label: {
    display: "block",
    fontSize: 11,
    letterSpacing: "0.1em",
    color: "#6B7078",
    fontWeight: 600,
    marginBottom: 8,
  },
  optional: { color: "#4A4E56", fontWeight: 400, letterSpacing: "normal" },
  textarea: {
    width: "100%",
    background: "#1D2027",
    border: "1px solid #2A2E37",
    borderRadius: 10,
    color: "#EDEEF0",
    fontSize: 15,
    fontFamily: "inherit",
    padding: "13px 14px",
    resize: "none",
    outline: "none",
    boxSizing: "border-box",
    lineHeight: 1.45,
  },
  input: {
    width: "100%",
    background: "#1D2027",
    border: "1px solid #2A2E37",
    borderRadius: 10,
    color: "#EDEEF0",
    fontSize: 14,
    fontFamily: "inherit",
    padding: "12px 14px",
    outline: "none",
    boxSizing: "border-box",
  },
  primaryButton: {
    width: "100%",
    background: "#EDEEF0",
    color: "#14161B",
    border: "none",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    fontFamily: "'Space Grotesk', sans-serif",
    padding: "15px 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },
  secondaryButton: {
    width: "100%",
    background: "transparent",
    color: "#8A8F98",
    border: "1px solid #2A2E37",
    borderRadius: 10,
    fontSize: 14,
    fontFamily: "inherit",
    padding: "13px 0",
    marginTop: 20,
    cursor: "pointer",
  },
  workingStage: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 40,
  },
  workingQuestion: {
    color: "#8A8F98",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 36,
    maxWidth: 320,
    lineHeight: 1.4,
  },
  funnel: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    width: "100%",
  },
  noiseCol: { flex: 1, minWidth: 0 },
  colLabel: {
    fontSize: 10,
    letterSpacing: "0.12em",
    color: "#4A4E56",
    fontWeight: 700,
    marginBottom: 10,
  },
  noiseList: {
    display: "flex",
    flexDirection: "column",
    gap: 7,
    height: 130,
    justifyContent: "flex-end",
  },
  noiseItem: {
    fontSize: 11,
    color: "#6B7078",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    transition: "opacity 0.4s, text-decoration 0.4s",
  },
  funnelArrow: {
    color: "#4FD1C5",
    flexShrink: 0,
  },
  spinIcon: {
    animation: "spin 1.6s linear infinite",
  },
  signalCol: { width: 70, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" },
  signalPulse: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(79,209,197,0.4), rgba(79,209,197,0.05))",
    animation: "pulse 1.4s ease-in-out infinite",
  },
  workingCaption: {
    marginTop: 40,
    fontSize: 12,
    color: "#4A4E56",
    letterSpacing: "0.02em",
  },
  resultStage: {},
  verdictCard: {
    background: "linear-gradient(155deg, #1D2027, #191C22)",
    border: "1px solid #2A2E37",
    borderRadius: 16,
    padding: "22px 22px 20px",
    marginBottom: 22,
  },
  verdictEyebrow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  confBadge: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.06em",
    border: "1px solid",
    borderRadius: 20,
    padding: "3px 9px",
    textTransform: "uppercase",
  },
  verdictText: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 24,
    fontWeight: 600,
    lineHeight: 1.25,
    marginBottom: 16,
  },
  whyList: { margin: 0, padding: 0, listStyle: "none" },
  whyItem: {
    fontSize: 13.5,
    color: "#B0B4BB",
    lineHeight: 1.55,
    paddingLeft: 16,
    position: "relative",
    marginBottom: 6,
  },
  section: { marginBottom: 22 },
  sectionLabel: {
    fontSize: 11,
    letterSpacing: "0.1em",
    color: "#6B7078",
    fontWeight: 600,
    marginBottom: 10,
  },
  tableWrap: {
    border: "1px solid #2A2E37",
    borderRadius: 10,
    overflow: "hidden",
    overflowX: "auto",
  },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 12.5 },
  thBlank: { background: "#1D2027", padding: "9px 10px" },
  th: {
    background: "#1D2027",
    color: "#EDEEF0",
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 600,
    textAlign: "left",
    padding: "9px 10px",
    borderBottom: "1px solid #2A2E37",
    whiteSpace: "nowrap",
  },
  tdFactor: {
    color: "#8A8F98",
    padding: "9px 10px",
    borderBottom: "1px solid #23262D",
    borderRight: "1px solid #23262D",
    whiteSpace: "nowrap",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
  },
  td: {
    color: "#EDEEF0",
    padding: "9px 10px",
    borderBottom: "1px solid #23262D",
  },
  uncertaintyBox: {
    background: "rgba(232,179,76,0.06)",
    border: "1px solid rgba(232,179,76,0.25)",
    borderRadius: 10,
    padding: "14px 16px",
    marginBottom: 22,
  },
  uncertaintyHeader: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    marginBottom: 8,
  },
  uncertaintyLabel: {
    fontSize: 10.5,
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "#E8B34C",
  },
  uncertaintyList: { margin: 0, paddingLeft: 16 },
  uncertaintyItem: {
    fontSize: 12.5,
    color: "#C9AF7E",
    lineHeight: 1.55,
    marginBottom: 4,
  },
  sourcesSection: { marginBottom: 8 },
  sourcesToggle: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "transparent",
    border: "none",
    color: "#6B7078",
    fontSize: 12,
    padding: 0,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  sourcesList: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 10,
  },
  sourceChip: {
    fontSize: 11,
    color: "#8A8F98",
    background: "#1D2027",
    border: "1px solid #2A2E37",
    borderRadius: 6,
    padding: "4px 8px",
  },
  errorStage: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    paddingTop: 50,
  },
  errorTitle: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 18,
    fontWeight: 600,
    marginTop: 14,
    marginBottom: 6,
  },
  errorMessage: { color: "#8A8F98", fontSize: 13, marginBottom: 26, maxWidth: 300 },
  errorButtons: { display: "flex", gap: 10, width: "100%" },
};

if (typeof document !== "undefined" && !document.getElementById("decision-engine-keyframes")) {
  const style = document.createElement("style");
  style.id = "decision-engine-keyframes";
  style.textContent = `
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 0.7; } 50% { transform: scale(1.15); opacity: 1; } }
    textarea::placeholder, input::placeholder { color: #4A4E56; }
    textarea:focus, input:focus { border-color: #4FD1C5 !important; }
  `;
  document.head.appendChild(style);
}
