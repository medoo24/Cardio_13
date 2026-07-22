/* RhythmLab content and presentation helpers. No build step is required. */
window.ArrhythmiaContent = (() => { 
  "use strict";

  const routes = [
    { id: "overview", icon: "01", title: "Overview", subtitle: "Map, priorities, core rules" },
    { id: "foundations", icon: "02", title: "Electrical foundations", subtitle: "Conduction, mechanisms, ECG language" },
    { id: "approach", icon: "03", title: "Diagnostic approach", subtitle: "Stable? Fast? Wide? Regular?" },
    { id: "narrow", icon: "04", title: "Narrow tachycardias", subtitle: "Sinus, AVNRT, AVRT, focal AT" },
    { id: "af-flutter", icon: "05", title: "AF & atrial flutter", subtitle: "AF-CARE, stroke, cardioversion" },
    { id: "wide", icon: "06", title: "Wide tachycardias", subtitle: "VT, torsades, VF, PVCs" },
    { id: "brady", icon: "07", title: "Bradycardia & block", subtitle: "SND, AV block, pacing" },
    { id: "wpw", icon: "08", title: "Pre-excitation & WPW", subtitle: "AVRT and pre-excited AF" },
    { id: "treatment", icon: "09", title: "Treatment toolbox", subtitle: "Drugs, shocks, devices, ablation" },
    { id: "arrest", icon: "10", title: "Cardiac arrest & BLS", subtitle: "Recognition, CPR, AED, Hs & Ts" },
    { id: "als", icon: "11", title: "Advanced life support", subtitle: "Shockable and non-shockable paths" },
    { id: "post-arrest", icon: "12", title: "Post-arrest care", subtitle: "Oxygen, pressure, brain, cause" },
    { id: "revision", icon: "↺", title: "Revision lab", subtitle: "ECG gallery, flashcards, traps", tool: true },
    { id: "cases", icon: "?", title: "Clinical cases", subtitle: "Exam-style decision practice", tool: true },
    { id: "sources", icon: "§", title: "Sources & notes", subtitle: "Guidelines, PDF, limitations", tool: true }
  ];

  const routeById = Object.fromEntries(routes.map((route) => [route.id, route]));

  function esc(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function hero({ eyebrow, title, intro, chips = [], visual = "sinus" }) {
    return `
      <section class="hero tts-unit" data-bookmark-title="${esc(title)}" data-tts-label="${esc(title)}">
        <div class="hero-grid">
          <div>
            <p class="eyebrow">${eyebrow}</p>
            <h1>${title}</h1>
            <p class="lead">${intro}</p>
            <div class="hero-chips">${chips.map((chip) => `<span class="hero-chip">${chip}</span>`).join("")}</div>
          </div>
          <div class="hero-visual" aria-label="Schematic electrocardiogram illustration">
            ${heroEcg(visual)}
          </div>
        </div>
      </section>`;
  }

  function heroEcg(type) {
    const paths = {
      sinus: "M0 105 L25 105 L33 96 L41 105 L61 105 L68 101 L75 105 L88 105 L94 45 L101 139 L108 92 L116 105 L141 105 L149 87 L158 105 L187 105 L212 105 L220 96 L228 105 L247 105 L255 101 L262 105 L275 105 L281 45 L288 139 L295 92 L303 105 L328 105 L336 87 L345 105 L380 105",
      af: "M0 105 C12 93,18 118,30 103 S46 114,56 101 L67 105 L76 55 L85 140 L93 93 L104 108 C114 94,122 119,135 102 S151 115,163 99 L175 105 L185 47 L196 138 L204 88 L214 110 C226 92,236 118,250 102 S268 115,281 96 L292 105 L303 61 L314 137 L322 93 L334 107 C346 94,356 117,370 103",
      vt: "M0 108 L15 108 L28 42 L47 143 L65 61 L82 126 L98 108 L117 108 L130 42 L149 143 L167 61 L184 126 L200 108 L219 108 L232 42 L251 143 L269 61 L286 126 L302 108 L321 108 L334 42 L353 143 L371 61 L388 126",
      arrest: "M0 105 L35 105 L42 80 L49 130 L57 92 L66 105 L92 105 L103 62 L116 142 L128 89 L140 105 L164 105 L176 39 L190 149 L204 79 L219 105 L242 105 L254 57 L267 143 L280 83 L294 105 L320 105 L333 73 L342 132 L353 91 L366 105 L390 105"
    };
    return `<svg viewBox="0 0 390 190" role="img" aria-hidden="true">
      <defs><linearGradient id="heroLine" x1="0" x2="1"><stop offset="0" stop-color="#7ce2df"/><stop offset="1" stop-color="#ff858f"/></linearGradient></defs>
      <g opacity=".15" stroke="#fff"><path d="M0 35H390M0 70H390M0 105H390M0 140H390M0 175H390"/><path d="M35 0V190M70 0V190M105 0V190M140 0V190M175 0V190M210 0V190M245 0V190M280 0V190M315 0V190M350 0V190"/></g>
      <path class="ecg-glow" d="${paths[type] || paths.sinus}" fill="none" stroke="url(#heroLine)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  }

  function sectionHeading(title, subtitle, tag = "") {
    return `<div class="section-heading"><div><h2>${title}</h2><p>${subtitle}</p></div>${tag ? `<span class="mini-tag">${tag}</span>` : ""}</div>`;
  }

  function card(title, body, accent = "accent-blue", icon = "", extra = "") {
    return `<article class="card ${accent} tts-unit ${extra}" data-bookmark-title="${esc(title)}" data-tts-label="${esc(title)}">
      ${icon ? `<div class="card-icon" aria-hidden="true">${icon}</div>` : ""}
      <h3>${title}</h3>${body}
    </article>`;
  }

  function table(headers, rows, caption = "") {
    return `<div class="table-wrap tts-unit" data-bookmark-title="${esc(caption || headers.join(" / "))}" data-tts-label="${esc(caption || headers.join(" / "))}">
      <table>${caption ? `<caption>${caption}</caption>` : ""}<thead><tr>${headers.map((header) => `<th>${header}</th>`).join("")}</tr></thead>
      <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody></table>
    </div>`;
  }

  function tabSet(id, tabs) {
    return `<section class="tabset" data-tabset="${id}">
      <div class="tab-buttons" role="tablist">${tabs.map((tab, index) => `<button class="tab-button ${index === 0 ? "is-active" : ""}" type="button" role="tab" aria-selected="${index === 0}" data-tab-target="${id}-${index}">${tab.label}</button>`).join("")}</div>
      ${tabs.map((tab, index) => `<div class="tab-panel" id="${id}-${index}" role="tabpanel" ${index === 0 ? "" : "hidden"}>${tab.content}</div>`).join("")}
    </section>`;
  }

  function callout(kind, title, body) {
    return `<div class="callout ${kind} tts-unit" data-bookmark-title="${esc(title)}" data-tts-label="${esc(title)}"><strong>${title}</strong> ${body}</div>`;
  }

  const ecgPaths = {
    sinus: "M0 80 L18 80 L25 73 L33 80 L49 80 L56 77 L63 80 L74 80 L80 28 L87 116 L94 66 L102 80 L123 80 L131 65 L140 80 L165 80 L184 80 L191 73 L199 80 L215 80 L222 77 L229 80 L240 80 L246 28 L253 116 L260 66 L268 80 L289 80 L297 65 L306 80 L330 80 L348 80 L355 73 L363 80 L379 80 L386 77 L393 80 L404 80 L410 28 L417 116 L424 66 L432 80 L453 80 L461 65 L470 80 L495 80",
    svt: "M0 80 L10 80 L15 69 L21 80 L31 80 L36 75 L41 80 L48 80 L52 36 L58 113 L64 65 L70 80 L80 80 L84 70 L90 80 L100 80 L105 75 L110 80 L117 80 L121 36 L127 113 L133 65 L139 80 L149 80 L153 70 L159 80 L169 80 L174 75 L179 80 L186 80 L190 36 L196 113 L202 65 L208 80 L218 80 L222 70 L228 80 L238 80 L243 75 L248 80 L255 80 L259 36 L265 113 L271 65 L277 80 L287 80 L291 70 L297 80 L307 80 L312 75 L317 80 L324 80 L328 36 L334 113 L340 65 L346 80 L356 80 L360 70 L366 80 L376 80 L381 75 L386 80 L393 80 L397 36 L403 113 L409 65 L415 80 L425 80 L429 70 L435 80 L445 80 L450 75 L455 80 L462 80 L466 36 L472 113 L478 65 L484 80 L495 80",
    flutter: "M0 80 L10 70 L20 80 L30 70 L40 80 L50 70 L60 80 L70 70 L80 80 L90 38 L99 113 L108 64 L117 80 L128 70 L138 80 L148 70 L158 80 L168 70 L178 80 L188 70 L198 80 L208 38 L217 113 L226 64 L235 80 L246 70 L256 80 L266 70 L276 80 L286 70 L296 80 L306 70 L316 80 L326 38 L335 113 L344 64 L353 80 L364 70 L374 80 L384 70 L394 80 L404 70 L414 80 L424 70 L434 80 L444 38 L453 113 L462 64 L471 80 L482 70 L492 80",
    af: "M0 80 C9 69,16 92,25 77 S39 89,48 75 L58 80 L66 35 L75 116 L83 65 L94 83 C104 67,115 91,126 76 S144 90,157 73 L168 80 L177 29 L188 114 L197 61 L207 85 C220 65,232 92,247 76 S266 88,280 71 L291 80 L301 43 L312 113 L321 64 L333 84 C344 67,356 91,371 77 S389 89,404 72 L414 80 L424 31 L436 115 L445 60 L457 84 C470 68,482 91,495 78",
    vt: "M0 82 L15 82 L27 27 L45 119 L61 45 L78 102 L95 82 L112 82 L124 27 L142 119 L158 45 L175 102 L192 82 L209 82 L221 27 L239 119 L255 45 L272 102 L289 82 L306 82 L318 27 L336 119 L352 45 L369 102 L386 82 L403 82 L415 27 L433 119 L449 45 L466 102 L483 82 L495 82",
    torsades: "M0 80 C12 64,22 45,35 53 C48 61,52 98,66 108 C80 118,91 87,104 80 C117 73,126 36,141 41 C156 46,164 96,178 111 C192 126,207 95,220 80 C233 65,244 35,258 43 C272 51,281 99,295 111 C309 123,322 91,336 80 C350 69,361 45,375 53 C389 61,397 95,410 106 C423 117,437 92,450 80 C463 68,476 51,495 60",
    vf: "M0 81 C12 33,23 119,34 69 S55 112,66 43 S89 116,102 74 S124 35,139 95 S161 123,174 52 S198 31,210 105 S233 121,246 60 S268 33,281 93 S305 126,319 56 S344 31,357 101 S380 117,394 48 S421 37,435 92 S461 114,475 56 S488 75,495 82",
    block: "M0 78 L18 78 L25 70 L32 78 L52 78 L82 78 L88 31 L95 114 L102 65 L110 78 L145 78 L163 78 L170 70 L177 78 L205 78 L235 78 L241 31 L248 114 L255 65 L263 78 L298 78 L316 78 L323 70 L330 78 L360 78 L390 78 L396 31 L403 114 L410 65 L418 78 L452 78 L470 78 L477 70 L484 78 L495 78"
  };

  function ecgCard(title, type, caption, accent = "") {
    return `<article class="card ecg-card tts-unit" data-bookmark-title="ECG: ${esc(title)}" data-tts-label="ECG pattern: ${esc(title)}">
      <div class="ecg-card-head"><h3>${title}</h3><span class="mini-tag">Schematic strip</span></div>
      <div class="ecg-canvas"><svg viewBox="0 0 495 150" preserveAspectRatio="none" aria-hidden="true"><path class="ecg-line ${accent}" d="${ecgPaths[type]}"></path></svg><span class="ecg-label">Not for measurement</span></div>
      <div class="ecg-caption">${caption}</div>
    </article>`;
  }

  function moduleNav(currentId) {
    const index = routes.findIndex((route) => route.id === currentId);
    const prev = routes[index - 1];
    const next = routes[index + 1];
    return `<nav class="module-nav" aria-label="Module navigation">
      ${prev ? `<button class="module-link prev" type="button" data-route="${prev.id}"><span>Previous</span><strong>‹ ${prev.title}</strong></button>` : ""}
      ${next ? `<button class="module-link next" type="button" data-route="${next.id}"><div><span>Next</span><strong>${next.title} ›</strong></div></button>` : ""}
    </nav>`;
  }

  function page(id, body) {
    return `<div class="page-enter" data-page="${id}">${body}${moduleNav(id)}</div>`;
  }

  function overviewPage() {
    return page("overview", `
      ${hero({
        eyebrow: "Chapter 13 · Interactive cardiology",
        title: "Recognize the rhythm. Treat instability first.",
        intro: "A structured, clinically oriented guide to rhythm recognition, acute stabilization, long-term prevention, pacing, defibrillation, and post-cardiac-arrest care.",
        chips: ["Fast or slow", "Regular or irregular", "Narrow or wide", "Pulse and stability first", "Mechanism after safety"],
        visual: "arrest"
      })}

      ${sectionHeading("The four questions that organize the whole chapter", "Use the same sequence at the bedside, in an ECG station, or in an exam case.", "Core framework")}
      <section class="grid four">
        ${card("1. Is there a pulse and is the patient stable?", `<p>Look for hypotension, shock, ongoing ischemic chest discomfort, acute heart failure, syncope, or altered consciousness. Instability changes the treatment priority immediately.</p>`, "accent-red", "!")}
        ${card("2. Is the rhythm fast or slow?", `<p>Tachycardia narrows the differential toward sinus, supraventricular, or ventricular mechanisms. Bradycardia raises sinus-node dysfunction, AV block, drug effects, ischemia, and metabolic causes.</p>`, "accent-blue", "↕")}
        ${card("3. Is it regular or irregular?", `<p>Regularity is a rapid discriminator. Irregularly irregular rhythm strongly suggests AF; regular wide-complex tachycardia is VT until proved otherwise in a high-risk adult.</p>`, "accent-teal", "≈")}
        ${card("4. Is the QRS narrow or wide?", `<p>A narrow QRS usually means ventricular activation through the normal His–Purkinje system. A wide QRS may reflect ventricular origin, aberrancy, pacing, or pre-excitation.</p>`, "accent-violet", "Q")}
      </section>

      ${callout("danger", "Safety rule:", "A regular wide-complex tachycardia in an adult with structural heart disease should be managed as ventricular tachycardia unless a safer alternative diagnosis is firmly established.")}

      ${sectionHeading("Course map", "Every module links the ECG pattern to mechanism, acute action, and recurrence prevention.", "15 connected modules")}
      <section class="grid three">
        ${routes.slice(1, 12).map((route, index) => `<button class="card route-card" type="button" data-route="${route.id}" style="text-align:left;cursor:pointer"><span class="card-number">${String(index + 2).padStart(2, "0")}</span><h3>${route.title}</h3><p>${route.subtitle}</p><span class="mini-tag">Open module →</span></button>`).join("")}
      </section>

      ${sectionHeading("Rapid rhythm triage", "Use the interactive tool to organize an unknown rhythm before naming it.", "Interactive")}
      <section class="tool-card interactive-only" id="rhythm-triage-tool">
        <h3>Rhythm triage engine</h3>
        <p class="tool-intro">This produces a study-oriented category and safety priority, not a patient-specific diagnosis.</p>
        <div class="form-grid">
          <div class="field"><label for="triage-pulse">Pulse</label><select id="triage-pulse"><option value="present">Present</option><option value="absent">Absent</option></select></div>
          <div class="field"><label for="triage-stability">Clinical state</label><select id="triage-stability"><option value="stable">Stable</option><option value="unstable">Unstable / adverse features</option></select></div>
          <div class="field"><label for="triage-rate">Rate</label><select id="triage-rate"><option value="fast">Fast</option><option value="slow">Slow</option><option value="normal">Near normal</option></select></div>
          <div class="field"><label for="triage-qrs">QRS</label><select id="triage-qrs"><option value="narrow">Narrow (≤120 ms)</option><option value="wide">Wide (&gt;120 ms)</option><option value="unknown">Unknown</option></select></div>
          <div class="field"><label for="triage-regularity">Regularity</label><select id="triage-regularity"><option value="regular">Regular</option><option value="irregular">Irregular</option><option value="unknown">Unknown</option></select></div>
          <div class="field"><label for="triage-atrial">Atrial activity</label><select id="triage-atrial"><option value="p">Consistent P waves</option><option value="none">No repetitive P waves</option><option value="flutter">Flutter-like activity</option><option value="dissociation">P–QRS dissociation</option><option value="unknown">Unclear</option></select></div>
        </div>
        <div class="tool-actions"><button class="primary-button" id="run-triage" type="button">Interpret pattern</button><button class="secondary-button" id="reset-triage" type="button">Reset</button></div>
        <div class="tool-result" id="triage-result" aria-live="polite"></div>
      </section>

      ${sectionHeading("Never-miss emergency patterns", "These patterns should trigger immediate safety thinking before detailed morphology analysis.", "High yield")}
      ${table(
        ["Pattern", "Critical interpretation", "Immediate priority"],
        [
          ["VF or pulseless VT", "Shockable cardiac arrest.", "Defibrillate promptly and resume high-quality CPR."],
          ["PEA or asystole", "Non-shockable cardiac arrest.", "CPR, early epinephrine, and search for reversible causes."],
          ["Unstable tachyarrhythmia with a pulse", "The rhythm is causing shock, ischemia, pulmonary edema, or altered consciousness.", "Synchronized cardioversion; do not delay for prolonged diagnostic analysis."],
          ["Irregular, very rapid, wide-complex tachycardia", "Consider pre-excited AF or polymorphic VT.", "Avoid reflex AV-nodal blockade; urgent expert rhythm management."],
          ["Symptomatic high-grade bradycardia", "High-grade AV block or severe sinus-node dysfunction may deteriorate.", "Support, treat reversible causes, and prepare pacing."],
          ["Syncope with conduction disease", "Intermittent high-grade block or malignant ventricular arrhythmia is possible.", "Risk-stratified monitoring and expert evaluation."]
        ],
        "Emergency patterns and their first priorities"
      )}
    `);
  }

  function foundationsPage() {
    return page("foundations", `
      ${hero({
        eyebrow: "Module 02 · Electrical foundations",
        title: "Arrhythmia begins with impulse formation, conduction, or both",
        intro: "Normal activation moves from the sinoatrial node through the atria, AV node, His bundle, bundle branches, and Purkinje network. Rhythm disorders arise when automaticity, triggered activity, re-entry, or conduction failure disrupts that sequence.",
        chips: ["SA node", "AV delay", "His–Purkinje", "Automaticity", "Re-entry", "Block"],
        visual: "sinus"
      })}

      ${sectionHeading("Normal activation sequence", "The site and speed of activation explain P waves, PR interval, QRS width, and many rhythm mechanisms.", "From atrium to ventricle")}
      <div class="flow-chain">
        <div class="flow-node tts-unit" data-bookmark-title="SA node" data-tts-label="SA node">SA node<br><small>Primary pacemaker</small></div>
        <div class="flow-node tts-unit" data-bookmark-title="AV node" data-tts-label="AV node">AV node<br><small>Delay and rate filter</small></div>
        <div class="flow-node tts-unit" data-bookmark-title="His bundle" data-tts-label="His bundle">His bundle<br><small>Connection to ventricles</small></div>
        <div class="flow-node tts-unit" data-bookmark-title="Bundle branches" data-tts-label="Bundle branches">Bundle branches<br><small>Right and left activation</small></div>
        <div class="flow-node tts-unit" data-bookmark-title="Purkinje network" data-tts-label="Purkinje network">Purkinje network<br><small>Rapid coordinated spread</small></div>
      </div>

      ${sectionHeading("Four electrophysiological mechanisms", "Do not memorize rhythm names without connecting them to the mechanism.", "Mechanism → pattern")}
      ${table(
        ["Mechanism", "What happens", "Typical examples", "Clinical clue"],
        [
          ["Enhanced or abnormal automaticity", "A focus fires faster than expected or outside the sinus node.", "Sinus tachycardia, focal atrial tachycardia, accelerated idioventricular rhythm.", "Often gradual warm-up and cool-down; linked to physiological or metabolic drive."],
          ["Triggered activity", "Afterdepolarizations initiate extra impulses, often promoted by drugs, ischemia, or electrolyte disturbance.", "Torsades de pointes, digoxin-related arrhythmias.", "Think QT prolongation, pauses, drug toxicity, hypokalemia, or hypomagnesemia."],
          ["Re-entry", "An impulse repeatedly circulates around pathways with different conduction and refractory properties.", "AVNRT, AVRT, atrial flutter, scar-related monomorphic VT.", "Abrupt onset and offset are characteristic."],
          ["Conduction failure", "Impulse transmission is delayed, intermittently blocked, or completely interrupted.", "AV block, bundle-branch block, sinus exit block.", "PR changes, dropped QRS complexes, escape rhythms, or dissociation."],
        ],
        "Mechanisms of arrhythmia"
      )}

      ${sectionHeading("ECG language", "Describe first; diagnose second. A disciplined description reduces premature closure.", "Six descriptors")}
      <section class="grid three">
        ${card("Rate", `<p>Estimate atrial and ventricular rates separately when they differ. A ventricular rate near 150/min should make you actively search for atrial flutter with 2:1 conduction.</p>`, "accent-blue", "R")}
        ${card("Regularity", `<p>Look for exact regularity, patterned irregularity, or irregularly irregular RR intervals. Also check whether atrial activity is regular even when ventricular response is not.</p>`, "accent-teal", "≈")}
        ${card("P waves", `<p>Ask whether P waves are present, sinus in morphology, related 1:1 to QRS complexes, hidden in QRS, retrograde, flutter-like, or absent.</p>`, "accent-violet", "P")}
        ${card("PR relationship", `<p>A fixed PR suggests consistent AV conduction. Progressive PR lengthening suggests Wenckebach. Constant PR with dropped beats suggests Mobitz II.</p>`, "accent-amber", "PR")}
        ${card("QRS width", `<p>Narrow QRS suggests activation through the normal conduction system. Wide QRS requires ventricular origin, aberrancy, pacing, or pre-excitation to be considered.</p>`, "accent-red", "QRS")}
        ${card("QT / QTc", `<p>QT prolongation changes the differential and drug safety. In polymorphic VT, a prolonged QT supports torsades de pointes.</p>`, "accent-blue", "QT")}
      </section>

      ${sectionHeading("Schematic rhythm examples", "These strips are conceptual teaching diagrams and are not intended for interval measurement.", "Visual comparison")}
      <section class="grid two">
        ${ecgCard("Sinus rhythm", "sinus", "A P wave precedes each narrow QRS, the rhythm is regular, and atrial–ventricular activation is coordinated.")}
        ${ecgCard("Regular narrow SVT", "svt", "A rapid, regular narrow-complex rhythm; P waves may be hidden in or immediately after the QRS in AVNRT or orthodromic AVRT.")}
      </section>

      ${callout("info", "Why autonomic tone matters:", "Sympathetic and parasympathetic activity modify automaticity, AV-nodal conduction, and refractoriness. They can facilitate or suppress arrhythmias, but the underlying circuit or focus still defines the rhythm mechanism.")}
    `);
  }

  function approachPage() {
    return page("approach", `
      ${hero({
        eyebrow: "Module 03 · Practical diagnostic approach",
        title: "Stability before morphology; morphology before mechanism",
        intro: "Start with the patient, then the monitor, then the 12-lead ECG. A perfect rhythm label is less urgent than recognizing shock, pulmonary edema, ischemia, or loss of consciousness.",
        chips: ["Patient first", "12-lead ECG", "Reversible causes", "Monitoring choice", "Structural disease"],
        visual: "af"
      })}

      ${sectionHeading("Bedside-to-ECG sequence", "Use the same order every time until it becomes automatic.", "Five steps")}
      <div class="flow-chain">
        <div class="flow-node red tts-unit" data-bookmark-title="Assess stability" data-tts-label="Assess stability">Stability<br><small>Shock, BP, ischemia, edema, consciousness</small></div>
        <div class="flow-node tts-unit" data-bookmark-title="Assess rate and regularity" data-tts-label="Assess rate and regularity">Rate + regularity<br><small>Fast/slow; regular/irregular</small></div>
        <div class="flow-node tts-unit" data-bookmark-title="Assess QRS width" data-tts-label="Assess QRS width">QRS width<br><small>≤120 ms or &gt;120 ms</small></div>
        <div class="flow-node tts-unit" data-bookmark-title="Assess atrial activity" data-tts-label="Assess atrial activity">Atrial activity<br><small>P, flutter, fibrillation, AV relation</small></div>
        <div class="flow-node green tts-unit" data-bookmark-title="Assess cause and risk" data-tts-label="Assess cause and risk">Cause + risk<br><small>Drugs, electrolytes, ischemia, stroke, SCD</small></div>
      </div>

      ${sectionHeading("History, examination, and tests", "Choose investigations to answer a clinical question, not as an unstructured panel.", "Assessment matrix")}
      ${table(
        ["Assessment", "What to establish", "Why it matters"],
        [
          ["History", "Sudden or gradual onset/offset; duration; triggers; syncope; chest pain; dyspnea; neurologic symptoms; stimulant, alcohol, and medication exposure; family history of sudden death.", "Abrupt onset supports re-entry; syncope and family history raise malignant rhythm risk."],
          ["Examination", "Pulse rate and regularity, perfusion, blood pressure, heart failure, murmurs, thyroid signs, fever, volume status, embolic signs.", "Separates compensated rhythm from hemodynamic emergency and may reveal the cause."],
          ["12-lead ECG", "Rhythm, PR, QRS, QT/QTc, axis, ischemia, pre-excitation, conduction disease, prior infarction.", "The diagnostic anchor; capture before treatment when it is safe to do so."],
          ["Ambulatory monitoring", "Telemetry, Holter, patch, event recorder, or implantable loop recorder according to symptom frequency and risk.", "Match recording duration to how often symptoms occur."],
          ["Laboratory tests", "Potassium, magnesium, renal function, thyroid function, blood count, glucose; troponin when ischemia is suspected; selected drug levels.", "Correctable biochemical and toxic causes can be decisive."],
          ["Imaging / advanced tests", "Echocardiography, CMR, exercise testing, coronary assessment, or electrophysiology study when indicated.", "Defines structural substrate, scar, inflammation, ischemia, and ablation targets."],
        ],
        "Practical arrhythmia assessment"
      )}

      ${callout("danger", "Unstable tachyarrhythmia:", "When the rhythm is causing hemodynamic instability, synchronized cardioversion takes priority over prolonged diagnostic analysis. Sedation is desirable when feasible, but it must not delay life-saving treatment.")}

      ${sectionHeading("First ECG description → major possibilities", "This table is designed to be used before you commit to a named diagnosis.", "Pattern differential")}
      ${table(
        ["First description", "Major possibilities", "Critical trap"],
        [
          ["Regular narrow-complex tachycardia", "Sinus tachycardia, AVNRT, orthodromic AVRT, focal atrial tachycardia, flutter with fixed conduction.", "A ventricular rate around 150/min can hide 2:1 atrial flutter."],
          ["Irregular narrow-complex tachycardia", "AF, flutter with variable block, multifocal atrial tachycardia.", "Do not call every irregular rhythm AF; inspect atrial activity."],
          ["Regular wide-complex tachycardia", "VT until proved otherwise; SVT with aberrancy or pre-excitation are alternatives.", "Verapamil or other reflex AV-nodal blockade can cause severe deterioration if this is VT."],
          ["Irregular wide-complex tachycardia", "AF with bundle-branch block, pre-excited AF, polymorphic VT, frequent ventricular ectopy.", "Pre-excited AF is a high-risk emergency; avoid AV-nodal blockers."],
          ["Regular bradycardia", "Sinus bradycardia, junctional escape, fixed high-grade AV block, ventricular escape.", "Count atrial and ventricular rates separately."],
          ["Irregular bradycardia", "Sinus pauses, AF with slow ventricular response, Wenckebach, variable high-grade block.", "A slow rate can still be unstable and require pacing."],
        ],
        "Pattern-based differential diagnosis"
      )}

      ${sectionHeading("Monitoring selector", "Match the device to symptom frequency and danger.", "Interactive")}
      <section class="tool-card interactive-only" id="monitor-tool">
        <h3>Choose a rhythm monitor</h3>
        <p class="tool-intro">This is a simplified educational guide; local pathways and patient risk determine the actual choice.</p>
        <div class="form-grid">
          <div class="field"><label for="monitor-frequency">Symptom frequency</label><select id="monitor-frequency"><option value="continuous">Currently symptomatic / inpatient</option><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="rare">Rare and unexplained</option></select></div>
          <div class="field"><label for="monitor-risk">Clinical risk</label><select id="monitor-risk"><option value="low">Low risk</option><option value="high">Syncope, structural disease, or high-risk features</option></select></div>
        </div>
        <div class="tool-actions"><button class="primary-button" id="run-monitor" type="button">Suggest modality</button></div>
        <div class="tool-result" id="monitor-result" aria-live="polite"></div>
      </section>
    `);
  }

  function narrowPage() {
    return page("narrow", `
      ${hero({
        eyebrow: "Module 04 · Regular narrow-complex tachycardia",
        title: "Abrupt onset suggests re-entry; gradual onset suggests physiological drive",
        intro: "The key narrow-complex differential is sinus tachycardia versus AVNRT, orthodromic AVRT, focal atrial tachycardia, and atrial flutter with fixed conduction.",
        chips: ["Usually supraventricular", "Modified Valsalva", "Adenosine only when appropriate", "Record during treatment"],
        visual: "sinus"
      })}

      ${sectionHeading("Compare the major regular narrow rhythms", "Onset, P-wave timing, and response to AV-nodal slowing are often more useful than the absolute rate.", "Core comparison")}
      ${table(
        ["Feature", "Sinus tachycardia", "AVNRT / orthodromic AVRT", "Focal atrial tachycardia"],
        [
          ["Onset and offset", "Usually gradual and linked to a cause.", "Usually abrupt because a re-entry circuit starts and stops suddenly.", "May be abrupt or show warm-up and cool-down."],
          ["Typical rate", "Often 100–160/min, but context dependent.", "Frequently 150–250/min.", "Often 100–250/min."],
          ["P waves", "Normal sinus morphology before each QRS.", "Often hidden in the QRS or retrograde immediately after it.", "Abnormal P morphology; a long RP interval is common."],
          ["Effect of adenosine", "Transient slowing reveals persistent sinus activity.", "Often terminates an AV-node-dependent circuit.", "May expose atrial activity; occasionally terminates triggered focal AT."],
          ["Definitive strategy", "Treat the cause.", "Catheter ablation is highly effective for recurrent symptomatic AVNRT/AVRT.", "Treat cause, drugs or ablation according to focus, symptoms, and burden."],
        ],
        "Sinus tachycardia versus common paroxysmal SVTs"
      )}

      ${sectionHeading("Acute stable SVT pathway", "Confirm that the rhythm is regular and narrow before using this pathway.", "Stepwise")}
      <div class="algorithm-board">
        <div class="algorithm-row"><div class="algorithm-label">1 · Confirm</div><div class="algorithm-content tts-unit" data-bookmark-title="Confirm regular narrow SVT" data-tts-label="Confirm regular narrow SVT">Monitor, obtain a 12-lead ECG when possible, assess stability, and look for a physiological cause of sinus tachycardia.</div></div>
        <div class="algorithm-row"><div class="algorithm-label">2 · Vagal manoeuvre</div><div class="algorithm-content tts-unit" data-bookmark-title="Modified Valsalva" data-tts-label="Modified Valsalva">Use a safe vagal manoeuvre; modified Valsalva is preferred when appropriate. Avoid routine unsafe carotid massage.</div></div>
        <div class="algorithm-row"><div class="algorithm-label">3 · Adenosine</div><div class="algorithm-content tts-unit" data-bookmark-title="Adenosine for regular SVT" data-tts-label="Adenosine for regular SVT">A rapid IV bolus may terminate AV-node-dependent re-entry. Record the rhythm during administration because transient AV block can reveal flutter or atrial tachycardia.</div></div>
        <div class="algorithm-row"><div class="algorithm-label">4 · Persistent rhythm</div><div class="algorithm-content tts-unit" data-bookmark-title="Persistent stable SVT" data-tts-label="Persistent stable SVT">Selected patients may receive a beta-blocker or diltiazem/verapamil, depending on ventricular function, blood pressure, pre-excitation risk, and local protocol.</div></div>
        <div class="algorithm-row success"><div class="algorithm-label">5 · Recurrence prevention</div><div class="algorithm-content tts-unit" data-bookmark-title="Recurrent SVT" data-tts-label="Recurrent SVT">Electrophysiology assessment and catheter ablation are often preferred for recurrent symptomatic AVNRT or AVRT.</div></div>
      </div>

      ${callout("warning", "Adenosine precautions:", "Use adenosine for a regular rhythm in which AV-node-dependent SVT is likely. Do not use it reflexively in an undifferentiated irregular wide-complex tachycardia. It can cause transient flushing or chest pressure and may provoke bronchospasm in severe reactive airway disease.")}

      ${sectionHeading("Sinus tachycardia and sinus-node dysfunction", "A sinus rhythm can be normal physiology, a marker of systemic illness, or a primary rhythm disorder.", "Do not suppress compensation")}
      ${table(
        ["Rhythm", "ECG pattern", "Common context", "Management principle"],
        [
          ["Sinus tachycardia", "Normal P before every QRS; regular; gradual onset/offset; rate &gt;100/min.", "Exercise, pain, fever, anemia, hypovolemia, hypoxemia, sepsis, hyperthyroidism, HF, stimulants.", "Treat the cause. Do not reflexively suppress an appropriate compensatory response."],
          ["Inappropriate sinus tachycardia", "Persistent or exaggerated sinus rate without an adequate secondary cause.", "Often younger adults; diagnosis of exclusion.", "Education, trigger and risk-factor treatment; selected beta-blocker or ivabradine under specialist care."],
          ["Sinus bradycardia", "Normal P before each QRS with rate &lt;60/min.", "Sleep, athletes, drugs, hypothyroidism, hypothermia, ischemia, vagal states.", "No treatment when physiological and asymptomatic; correct reversible causes if symptomatic."],
          ["Sinus-node dysfunction", "Pauses/arrest, chronotropic incompetence, or tachy-brady syndrome.", "Age-related fibrosis, atrial disease, drugs, surgery, infiltrative disease.", "Correlate symptoms with bradycardia; pace symptomatic non-reversible disease."],
        ],
        "Sinus rhythm disorders"
      )}

      ${sectionHeading("ECG comparison", "Use the baseline, P-wave relationship, and regularity rather than rate alone.", "Schematic")}
      <section class="grid two">
        ${ecgCard("Sinus tachycardia", "sinus", "The sequence remains sinus: P before every QRS. The main diagnostic task is to find the physiological or pathological driver.")}
        ${ecgCard("AVNRT / orthodromic AVRT", "svt", "Rapid, highly regular and narrow. P waves may be invisible or retrograde, and onset is typically abrupt.", "red")}
      </section>
    `);
  }

  function afFlutterPage() {
    return page("af-flutter", `
      ${hero({
        eyebrow: "Module 05 · Atrial fibrillation and flutter",
        title: "Control symptoms, prevent stroke, and treat the substrate",
        intro: "AF management is broader than rate control. The AF-CARE model integrates comorbidities, thromboembolism prevention, rate or rhythm control, and repeated reassessment.",
        chips: ["Irregularly irregular", "AF-CARE", "CHA₂DS₂-VA", "DOAC usually preferred", "Flutter ≠ AF"],
        visual: "af"
      })}

      ${sectionHeading("Atrial fibrillation", "AF is chaotic atrial activation with ineffective atrial contraction and no repetitive P waves on clinician-confirmed ECG.", "Definition and pattern")}
      <section class="grid two">
        ${ecgCard("Atrial fibrillation", "af", "Irregular RR intervals with no consistent repeating P waves. QRS complexes are usually narrow unless there is aberrancy, pre-excitation, or another conduction abnormality.", "red")}
        ${card("Clinical classification", `<ul class="mini-list"><li><strong>First diagnosed:</strong> not previously diagnosed, regardless of duration or symptoms.</li><li><strong>Paroxysmal:</strong> terminates spontaneously or with intervention within 7 days.</li><li><strong>Persistent:</strong> continuously sustained beyond 7 days.</li><li><strong>Long-standing persistent:</strong> continuous for at least 12 months when rhythm control is still pursued.</li><li><strong>Permanent:</strong> patient and clinician accept AF and stop pursuing sinus restoration.</li></ul>`, "accent-violet", "AF")}
      </section>

      ${sectionHeading("AF-CARE", "The sequence deliberately begins with the conditions that drive AF and worsen outcomes.", "2024 ESC framework")}
      <section class="grid four">
        ${card("C · Comorbidity and risk-factor management", `<p>Treat hypertension, HF, diabetes, obesity, sleep apnea, alcohol excess, inactivity, triggers, and structural heart disease.</p>`, "accent-teal", "C")}
        ${card("A · Avoid stroke and thromboembolism", `<p>Assess thromboembolic risk, address modifiable bleeding risks, and prescribe oral anticoagulation when indicated.</p>`, "accent-blue", "A")}
        ${card("R · Reduce symptoms", `<p>Use rate control, cardioversion, antiarrhythmic drugs, and/or catheter ablation according to symptoms, burden, substrate, and preference.</p>`, "accent-red", "R")}
        ${card("E · Evaluation and dynamic reassessment", `<p>Recheck symptoms, rhythm, anticoagulation, adherence, risk factors, and treatment complications over time.</p>`, "accent-violet", "E")}
      </section>

      ${sectionHeading("CHA₂DS₂-VA stroke-risk calculator", "This reflects the 2024 ESC approach, which removes sex category from the score.", "Interactive")}
      <section class="tool-card interactive-only" id="af-score-tool">
        <h3>CHA₂DS₂-VA</h3>
        <p class="tool-intro">Use as an educational summary. Anticoagulation decisions still require clinical review, contraindications, renal function, bleeding factors, and patient preference.</p>
        <div class="check-grid">
          <label class="check-item"><input type="checkbox" data-af-points="1"><span><strong>Heart failure</strong><small>1 point</small></span></label>
          <label class="check-item"><input type="checkbox" data-af-points="1"><span><strong>Hypertension</strong><small>1 point</small></span></label>
          <label class="check-item"><input type="checkbox" data-af-points="2" data-age-group="older"><span><strong>Age ≥75</strong><small>2 points; excludes age 65–74</small></span></label>
          <label class="check-item"><input type="checkbox" data-af-points="1"><span><strong>Diabetes mellitus</strong><small>1 point</small></span></label>
          <label class="check-item"><input type="checkbox" data-af-points="2"><span><strong>Prior stroke / TIA / systemic embolism</strong><small>2 points</small></span></label>
          <label class="check-item"><input type="checkbox" data-af-points="1"><span><strong>Vascular disease</strong><small>1 point</small></span></label>
          <label class="check-item"><input type="checkbox" data-af-points="1" data-age-group="younger"><span><strong>Age 65–74</strong><small>1 point; excludes age ≥75</small></span></label>
        </div>
        <div class="score-display"><div class="score-number" id="af-score-number">0</div><div><strong id="af-score-title">Low score</strong><p id="af-score-text">At score 0, oral anticoagulation is generally not indicated solely for AF stroke prevention. Reassess as risk factors change.</p></div></div>
      </section>

      ${sectionHeading("Management principles", "Separate the acute question from the long-term prevention plan.", "Rate, rhythm, stroke")}
      ${table(
        ["Decision", "Current principle", "Important caution"],
        [
          ["Oral anticoagulation", "Recommended at CHA₂DS₂-VA ≥2 and should be considered at score 1 after individualized assessment.", "Bleeding scores identify modifiable risk and follow-up intensity; they should not automatically deny indicated therapy."],
          ["Agent", "A DOAC is generally preferred to warfarin.", "Mechanical heart valves and moderate-to-severe mitral stenosis remain important exceptions."],
          ["Rate control", "Beta-blocker, diltiazem/verapamil, or digoxin according to LV function, symptoms, and setting.", "Avoid non-dihydropyridine calcium-channel blockers in decompensated HFrEF."],
          ["Rhythm control", "Electrical or pharmacological cardioversion, antiarrhythmic therapy, and catheter ablation are individualized.", "Safety depends on AF duration, structural disease, QT, ischemia, and anticoagulation."],
          ["Ablation", "Effective for symptomatic AF when drugs are ineffective, not tolerated, or not preferred; first-line in selected patients.", "AF risk-factor management remains necessary after ablation."],
        ],
        "AF management decisions"
      )}

      ${callout("warning", "Cardioversion and anticoagulation:", "Hemodynamic instability requires immediate synchronized cardioversion. For stable AF lasting more than 24 hours or of uncertain duration, elective cardioversion generally requires at least 3 weeks of effective anticoagulation or an imaging-guided strategy to exclude atrial thrombus, followed by at least 4 weeks. Long-term anticoagulation follows stroke risk, not apparent sinus rhythm.")}

      ${sectionHeading("Atrial flutter", "Flutter is a distinct macro-re-entrant rhythm, commonly around the tricuspid annulus.", "Often 300 atrial/min")}
      <section class="grid two">
        ${ecgCard("Typical atrial flutter", "flutter", "Continuous flutter activity; 2:1 AV conduction often produces a regular ventricular rate close to 150/min. Vagal manoeuvres or adenosine may reveal the waves without terminating the atrial circuit.")}
        ${card("Flutter essentials", `<ul class="mini-list"><li><strong>Unstable:</strong> synchronized cardioversion.</li><li><strong>Stable:</strong> assess rate control, rhythm control, and anticoagulation.</li><li><strong>Definitive treatment:</strong> cavotricuspid-isthmus ablation is highly effective for typical flutter.</li><li><strong>Stroke prevention:</strong> apply the same thromboembolic-risk principles used for AF.</li></ul>`, "accent-amber", "↻")}
      </section>

      ${callout("danger", "Pre-excited AF is an emergency:", "An irregular, very rapid, wide-complex rhythm may be AF conducting over an accessory pathway. Avoid AV-nodal blockers such as beta-blockers, diltiazem/verapamil, digoxin, and IV amiodarone. Urgent cardioversion is preferred when unstable; stable treatment should be specialist directed.")}
    `);
  }

  function widePage() {
    return page("wide", `
      ${hero({
        eyebrow: "Module 06 · Wide-complex and ventricular arrhythmias",
        title: "Wide-complex tachycardia is ventricular tachycardia until safety is established",
        intro: "The major tasks are to identify instability or pulselessness, distinguish monomorphic from polymorphic patterns, search for structural or ischemic substrate, and prevent sudden death.",
        chips: ["Assume VT", "Pulse determines shock type", "QT changes torsades pathway", "Defibrillator ready"],
        visual: "vt"
      })}

      ${sectionHeading("Ventricular rhythm spectrum", "The significance of ventricular ectopy depends on symptoms, burden, ventricular function, ischemia, scar, and inherited disease.", "From PVC to VF")}
      ${table(
        ["Rhythm", "Pattern", "Management principle"],
        [
          ["Premature ventricular complex", "Early wide QRS not preceded by a normal P wave, usually with discordant repolarization and a compensatory pause.", "Reassure when isolated and low risk; quantify burden and assess LV function when frequent, complex, or symptomatic."],
          ["Non-sustained VT", "At least 3 ventricular beats, lasting &lt;30 seconds and terminating spontaneously.", "Risk depends on symptoms, ventricular function, ischemia, scar, and inherited disease."],
          ["Sustained monomorphic VT", "Regular wide-complex tachycardia lasting ≥30 seconds or requiring earlier intervention.", "Synchronized cardioversion if unstable with a pulse; expert drug therapy if stable; evaluate ICD and ablation need."],
          ["Polymorphic VT", "Beat-to-beat variation in QRS morphology.", "Defibrillate if unstable or pulseless; distinguish prolonged-QT torsades from ischemic polymorphic VT."],
          ["Ventricular fibrillation", "Chaotic ventricular electrical activity with no effective output.", "Immediate defibrillation and high-quality CPR."],
        ],
        "Premature beats and ventricular arrhythmias"
      )}

      ${sectionHeading("Stable wide-complex tachycardia", "Stable does not mean low risk. Prepare for deterioration while refining the diagnosis.", "Safety bundle")}
      <section class="grid two">
        ${card("Initial assumption", `<p>Treat as VT when the diagnosis is uncertain, especially in an adult with structural heart disease or prior infarction.</p>`, "accent-red", "VT")}
        ${card("Immediate work", `<p>Continuous monitoring, IV access, 12-lead ECG, electrolyte and ischemia assessment, and defibrillator readiness.</p>`, "accent-blue", "+")}
        ${card("Drug strategy", `<p>Procainamide, amiodarone, or sotalol may be considered according to rhythm, QT, ventricular function, blood pressure, and local protocol. Do not combine antiarrhythmics indiscriminately.</p>`, "accent-violet", "Rx")}
        ${card("Avoid verapamil", `<p>Do not give AV-nodal calcium-channel blockade to an undifferentiated wide-complex tachycardia; severe deterioration can occur if the rhythm is VT.</p>`, "accent-amber", "×")}
      </section>

      ${sectionHeading("ECG morphology comparison", "Monomorphic VT has a consistent ventricular morphology; torsades changes axis and amplitude around the baseline.", "Schematic")}
      <section class="grid three">
        ${ecgCard("Monomorphic VT", "vt", "A regular wide-complex rhythm with repeated similar QRS morphology. AV dissociation, capture beats, fusion beats, and structural disease support VT.", "red")}
        ${ecgCard("Torsades de pointes", "torsades", "Polymorphic VT with a prolonged QT and apparent twisting of QRS axis and amplitude around the baseline.", "red")}
        ${ecgCard("Ventricular fibrillation", "vf", "Chaotic activity without organized QRS complexes or effective cardiac output. This is a shockable cardiac arrest rhythm.", "red")}
      </section>

      ${sectionHeading("Torsades de pointes", "The QT context changes treatment and recurrence prevention.", "Prolonged QT")}
      ${table(
        ["Task", "Action", "Reason"],
        [
          ["Recognize", "Identify polymorphic VT with prolonged QT and twisting morphology.", "Not every polymorphic VT is torsades; ischemic polymorphic VT can occur with normal QT."],
          ["Correct causes", "Stop QT-prolonging drugs and correct hypokalemia, hypomagnesemia, and other precipitants.", "Triggered activity is promoted by repolarization delay and pauses."],
          ["Acute therapy", "Give IV magnesium; defibrillate when unstable or pulseless.", "Magnesium is rhythm-specific here, not a routine arrest drug for normal-QT polymorphic VT."],
          ["Increase rate", "Pacing or isoproterenol may be used in selected acquired pause-dependent cases.", "Reducing pauses can suppress early afterdepolarizations."],
          ["Prevent recurrence", "Review congenital long-QT syndrome, family history, interactions, and future device or specialist strategy.", "The acute episode may reveal an inherited or persistent substrate."],
        ],
        "Torsades recognition and management"
      )}

      ${callout("danger", "Pulse and synchronization rule:", "Unstable monomorphic VT with a pulse is treated with synchronized cardioversion. Pulseless VT and VF are treated with unsynchronized defibrillation and immediate CPR. Unstable polymorphic VT may be impossible to synchronize and is treated as a defibrillation rhythm.")}
    `);
  }

  function bradyPage() {
    return page("brady", `
      ${hero({
        eyebrow: "Module 07 · Bradyarrhythmias and AV block",
        title: "A slow rhythm becomes an emergency when perfusion fails",
        intro: "Bradycardia management depends on symptoms, the level of conduction disease, the escape rhythm, reversible causes, and whether pacing is required.",
        chips: ["Symptoms drive urgency", "Count P and QRS separately", "Mobitz II is high risk", "Prepare pacing"],
        visual: "sinus"
      })}

      ${sectionHeading("Symptomatic bradycardia", "Treat the patient and reversible cause while preparing definitive support.", "Immediate pathway")}
      <div class="algorithm-board">
        <div class="algorithm-row danger"><div class="algorithm-label">Adverse features</div><div class="algorithm-content tts-unit" data-bookmark-title="Bradycardia adverse features" data-tts-label="Bradycardia adverse features">Hypotension, acute altered mental status, shock, ischemic chest discomfort, syncope, or acute heart failure indicate clinically significant bradycardia.</div></div>
        <div class="algorithm-row"><div class="algorithm-label">Initial support</div><div class="algorithm-content tts-unit" data-bookmark-title="Initial bradycardia support" data-tts-label="Initial bradycardia support">Support airway and oxygenation as needed, monitor, obtain IV access and a 12-lead ECG, and treat reversible causes such as ischemia, hypoxia, electrolyte disturbance, hypothermia, or drug effect.</div></div>
        <div class="algorithm-row"><div class="algorithm-label">Medication</div><div class="algorithm-content tts-unit" data-bookmark-title="Atropine in bradycardia" data-tts-label="Atropine in bradycardia">Atropine may be used for persistent clinically significant bradycardia, but it may be ineffective in distal high-grade block.</div></div>
        <div class="algorithm-row"><div class="algorithm-label">If ineffective</div><div class="algorithm-content tts-unit" data-bookmark-title="Pacing and infusions" data-tts-label="Pacing and infusions">Use transcutaneous pacing and/or epinephrine or dopamine infusion while arranging expert and definitive therapy according to local protocol.</div></div>
        <div class="algorithm-row success"><div class="algorithm-label">Definitive plan</div><div class="algorithm-content tts-unit" data-bookmark-title="Definitive pacing plan" data-tts-label="Definitive pacing plan">Persistent non-reversible Mobitz II, high-grade, or complete AV block usually requires pacing assessment; symptomatic sinus-node dysfunction also requires symptom–rhythm correlation.</div></div>
      </div>

      ${sectionHeading("AV block patterns", "The ECG definition predicts the likely anatomical level and risk of sudden progression.", "Conduction ladder")}
      ${table(
        ["Disorder", "ECG definition", "Clinical significance"],
        [
          ["First-degree AV block", "PR &gt;200 ms with every P wave conducted.", "Usually observation and cause review; marked PR prolongation may produce symptoms in selected patients."],
          ["Mobitz I (Wenckebach)", "Progressive PR prolongation before a non-conducted P wave.", "Often AV-nodal and lower risk, but symptoms and context matter."],
          ["Mobitz II", "Constant PR intervals with intermittent non-conducted P waves.", "Usually infranodal; may progress abruptly to complete block and generally warrants pacing evaluation."],
          ["High-grade AV block", "At least 2 consecutive non-conducted P waves or advanced conduction failure.", "Potentially unstable; pacing is commonly indicated when not reversible."],
          ["Complete AV block", "No fixed relationship between atrial and ventricular activity.", "Escape may be junctional or ventricular; urgent pacing if unstable and permanent pacing for persistent acquired disease."],
          ["Bundle-branch block", "Delayed conduction in the right or left bundle.", "May signal structural or conduction-system disease; new LBBB alone is not diagnostic of acute MI."],
        ],
        "Bradyarrhythmias and atrioventricular block"
      )}

      ${sectionHeading("Complete heart block", "Atria and ventricles may each be regular while remaining dissociated.", "Schematic ECG")}
      <section class="grid two">
        ${ecgCard("Complete AV block", "block", "P waves and QRS complexes have no fixed relationship. The ventricular escape may be narrow if junctional or wide if ventricular.", "red")}
        ${card("How to read the strip", `<ol class="number-list"><li>Mark every P wave, including those hidden in T waves.</li><li>Mark every QRS complex and calculate the ventricular rate.</li><li>Compare PR intervals: complete block has no stable P–QRS relationship.</li><li>Assess QRS width to infer the escape focus.</li><li>Relate the rhythm to symptoms, blood pressure, ischemia, and reversible causes.</li></ol>`, "accent-blue", "ECG")}
      </section>

      ${sectionHeading("Pacing principles", "The indication is not simply a low number on the monitor.", "Long-term treatment")}
      <section class="grid three">
        ${card("Sinus-node dysfunction", `<p>Permanent pacing is indicated when symptoms are clearly attributable to sinus-node dysfunction and the cause is not reversible.</p>`, "accent-blue", "SND")}
        ${card("High-grade conduction disease", `<p>Persistent or paroxysmal Mobitz II, high-grade, or complete AV block generally requires pacing when not due to a reversible or physiological cause.</p>`, "accent-red", "AV")}
        ${card("Device choice", `<p>Consider ventricular function, expected pacing burden, atrial rhythm, and potential benefit from conduction-system pacing or cardiac resynchronization.</p>`, "accent-teal", "PM")}
      </section>

      ${callout("warning", "Atropine limitation:", "Do not rely on atropine when the escape rhythm is distal, wide, or unstable. In high-grade or complete AV block, pacing readiness and expert evaluation are often more important than repeated medication attempts.")}
    `);
  }

  function wpwPage() {
    return page("wpw", `
      ${hero({
        eyebrow: "Module 08 · Pre-excitation and WPW",
        title: "An accessory pathway can bypass the AV node and create dangerous shortcuts",
        intro: "Ventricular pre-excitation occurs when an accessory atrioventricular pathway activates part of the ventricle early. WPW syndrome means pre-excitation plus a symptomatic tachyarrhythmia.",
        chips: ["Short PR", "Delta wave", "Widened QRS", "AVRT", "Pre-excited AF"],
        visual: "sinus"
      })}

      ${sectionHeading("Resting ECG and terminology", "Pre-excitation is an ECG finding; WPW syndrome requires clinical arrhythmia.", "Key distinction")}
      <section class="grid three">
        ${card("Short PR interval", `<p>The accessory pathway begins ventricular activation before normal AV nodal and His–Purkinje conduction would complete.</p>`, "accent-blue", "PR")}
        ${card("Delta wave", `<p>A slurred initial upstroke of the QRS reflects slow myocardial activation from the accessory pathway insertion site.</p>`, "accent-violet", "Δ")}
        ${card("Widened QRS", `<p>Fusion between early accessory-pathway activation and later normal conduction broadens the QRS.</p>`, "accent-teal", "Q")}
      </section>

      ${sectionHeading("Accessory-pathway tachycardias", "The direction of conduction determines whether the QRS is usually narrow or wide.", "Circuit direction")}
      ${table(
        ["Scenario", "Circuit", "Typical ECG", "Clinical point"],
        [
          ["Orthodromic AVRT", "Antegrade through the AV node; retrograde back to atrium through the accessory pathway.", "Usually regular narrow-complex tachycardia.", "AV-node-dependent re-entry; adenosine may terminate in an appropriate stable regular rhythm."],
          ["Antidromic AVRT", "Antegrade through the accessory pathway; retrograde through the AV node or another pathway.", "Regular wide-complex tachycardia.", "Can resemble VT; manage with expert wide-complex tachycardia principles."],
          ["Pre-excited AF", "Chaotic atrial impulses reach the ventricles rapidly through an accessory pathway.", "Irregular, very rapid, wide-complex tachycardia.", "Risk of degeneration to VF; avoid AV-nodal blockers."],
          ["Asymptomatic pre-excitation", "Accessory pathway present without symptomatic tachyarrhythmia.", "Short PR, delta wave, widened QRS may be present.", "Risk stratification is individualized by pathway properties, occupation, sport, age, and testing."],
        ],
        "WPW and accessory-pathway scenarios"
      )}

      ${callout("danger", "Do not block only the AV node in pre-excited AF:", "Beta-blockers, diltiazem/verapamil, digoxin, and IV amiodarone may favor conduction over the accessory pathway and can be dangerous. Unstable patients require urgent cardioversion; stable treatment is specialist directed with pathway-safe therapy.")}

      ${sectionHeading("Definitive treatment", "The pathway can often be eliminated rather than chronically suppressed.", "Catheter ablation")}
      <section class="grid two">
        ${card("Symptomatic pathway-mediated tachycardia", `<p>Catheter ablation is recommended for symptomatic AVRT and for pathways with high-risk properties.</p><p>Ablation removes the substrate and prevents recurrence without long-term rhythm drug dependence in many patients.</p>`, "accent-teal", "A")}
        ${card("Asymptomatic pre-excitation", `<p>Evaluation may include non-invasive testing and/or electrophysiology study. Decision-making considers pathway conduction speed, occupation, competitive sport, age, patient preference, and procedural risk.</p>`, "accent-blue", "R")}
      </section>

      ${sectionHeading("Emergency pattern recognition", "Practice separating the dangerous irregular pattern from a regular AVRT.", "Interactive")}
      <section class="tool-card interactive-only" id="wpw-tool">
        <h3>Accessory pathway pattern check</h3>
        <p class="tool-intro">Select the observed pattern to reveal the safest conceptual interpretation.</p>
        <div class="pathway-selector">
          <button class="pathway-button" type="button" data-wpw="regular-narrow"><strong>Regular + narrow</strong><span>Possible orthodromic AVRT</span></button>
          <button class="pathway-button" type="button" data-wpw="regular-wide"><strong>Regular + wide</strong><span>Antidromic AVRT or VT</span></button>
          <button class="pathway-button shockable" type="button" data-wpw="irregular-wide"><strong>Irregular + very rapid + wide</strong><span>Pre-excited AF until proved otherwise</span></button>
          <button class="pathway-button" type="button" data-wpw="resting"><strong>Short PR + delta wave</strong><span>Resting ventricular pre-excitation</span></button>
        </div>
        <div class="tool-result" id="wpw-result" aria-live="polite"></div>
      </section>
    `);
  }

  function treatmentPage() {
    return page("treatment", `
      ${hero({
        eyebrow: "Module 09 · Treatment toolbox",
        title: "Choose the intervention by rhythm mechanism, stability, and substrate",
        intro: "Drugs, cardioversion, defibrillation, ablation, pacemakers, and ICDs solve different problems. The same intervention can be helpful in one rhythm and dangerous in another.",
        chips: ["Mechanism-specific", "Check ventricular function", "QT and pre-excitation matter", "Devices prevent recurrence"],
        visual: "arrest"
      })}

      ${sectionHeading("Interventions and cautions", "Use this as a comparison map rather than a prescribing protocol.", "Clinical toolbox")}
      ${table(
        ["Intervention", "Best use", "Important cautions"],
        [
          ["Vagal manoeuvres", "Stable regular narrow-complex SVT.", "Modified Valsalva is preferred when feasible; avoid unsafe routine carotid massage."],
          ["Adenosine", "Acute termination or diagnosis of regular AV-node-dependent SVT.", "Very short acting; avoid in irregular wide-complex tachycardia and use caution in severe reactive airway disease."],
          ["Beta-blocker", "Rate control, selected SVT, ventricular ectopy, long-QT and catecholaminergic arrhythmias.", "Bradycardia, AV block, bronchospasm; caution in acute decompensated HF."],
          ["Diltiazem / verapamil", "Rate control and selected SVT without pre-excitation.", "Avoid in HFrEF/decompensated HF and undifferentiated wide-complex tachycardia."],
          ["Flecainide / propafenone", "Rhythm control in selected patients without significant structural or ischemic heart disease.", "Proarrhythmia; often combine with AV-nodal blockade to prevent 1:1 flutter when appropriate."],
          ["Amiodarone", "Selected atrial and ventricular arrhythmias; refractory VF/pVT during arrest.", "Pulmonary, thyroid, hepatic, ocular, neurologic, skin, and interaction toxicity; not a benign default."],
          ["Synchronized cardioversion", "Unstable tachyarrhythmia with a pulse.", "Synchronize to the QRS; select and escalate energy according to rhythm, device, and protocol; sedate if feasible."],
          ["Defibrillation", "VF, pulseless VT, or unstable polymorphic VT when synchronization is impossible.", "Unsynchronized shock followed by immediate CPR in arrest."],
          ["Catheter ablation", "Definitive therapy for many recurrent SVTs, typical flutter, selected AF, idiopathic VT/PVCs, and scar VT.", "Requires mechanism-specific electrophysiology assessment."],
          ["Pacemaker / ICD", "Pacemaker for clinically important bradycardia; ICD for prevention or termination of life-threatening ventricular arrhythmia in selected patients.", "ICDs do not treat the underlying disease; optimize medical therapy and programming."],
        ],
        "Arrhythmia treatment toolbox"
      )}

      ${sectionHeading("Vaughan Williams classification", "Useful for mechanism, but it does not fully capture every drug or clinical effect.", "Drug framework")}
      ${table(
        ["Class", "Representative drugs", "Main electrophysiological action", "Exam caution"],
        [
          ["Class I", "IA procainamide; IB lidocaine; IC flecainide, propafenone.", "Sodium-channel blockade; effect differs by subclass and tissue state.", "Class IC is avoided in significant structural or ischemic heart disease."],
          ["Class II", "Beta-blockers.", "Reduce sympathetic effects, automaticity, and AV-nodal conduction.", "Can worsen bradycardia, block, bronchospasm, or acute decompensated HF."],
          ["Class III", "Amiodarone, sotalol, dofetilide, ibutilide.", "Predominantly potassium-channel blockade and repolarization prolongation.", "Torsades risk varies; amiodarone has extensive extracardiac toxicity."],
          ["Class IV", "Verapamil, diltiazem.", "Non-dihydropyridine calcium-channel blockade, particularly at the AV node.", "Avoid in pre-excited AF, undifferentiated WCT, and decompensated HFrEF."],
          ["Other", "Adenosine, digoxin, magnesium.", "Mechanism-specific effects outside the four-class model.", "Each has a narrow context; magnesium is specifically important in torsades."],
        ],
        "Vaughan Williams antiarrhythmic drug classes"
      )}

      ${sectionHeading("Shock, pace, ablate, or implant?", "The device or procedure should match the physiological problem.", "Decision comparison")}
      <section class="grid four">
        ${card("Cardioversion", `<p>Resets an unstable organized tachyarrhythmia with a pulse using QRS-synchronized energy.</p>`, "accent-red", "CV")}
        ${card("Defibrillation", `<p>Uses an unsynchronized shock for VF, pulseless VT, or polymorphic VT when synchronization is not possible.</p>`, "accent-red", "DF")}
        ${card("Pacemaker", `<p>Prevents clinically important bradycardia by supplying electrical activation when intrinsic impulse formation or conduction fails.</p>`, "accent-blue", "PM")}
        ${card("ICD", `<p>Detects and treats life-threatening ventricular tachyarrhythmias in selected patients at high sudden-death risk.</p>`, "accent-violet", "ICD")}
        ${card("Catheter ablation", `<p>Eliminates a focus, pathway, or critical re-entry tissue to prevent recurrent arrhythmia.</p>`, "accent-teal", "ABL")}
        ${card("CRT", `<p>Coordinates ventricular activation in selected patients with HF and electrical dyssynchrony or high pacing burden.</p>`, "accent-blue", "CRT")}
        ${card("Temporary pacing", `<p>Bridges unstable or reversible bradycardia while definitive treatment is arranged.</p>`, "accent-amber", "TP")}
        ${card("Risk-factor therapy", `<p>Treating ischemia, HF, sleep apnea, obesity, alcohol excess, electrolytes, and drugs reduces recurrence and improves outcomes.</p>`, "accent-teal", "RF")}
      </section>

      ${callout("info", "Local protocol controls exact doses and energies:", "This website deliberately emphasizes indications, contraindications, and sequencing. Exact dose, route, shock energy, anticoagulant selection, and device criteria must follow the patient context, the latest institutional guideline, and trained clinical oversight.")}
    `);
  }

  function arrestPage() {
    return page("arrest", `
      ${hero({
        eyebrow: "Module 10 · Cardiac arrest and adult BLS",
        title: "Recognition, compressions, and early defibrillation save time-sensitive myocardium and brain",
        intro: "Cardiac arrest is the abrupt loss of effective circulation. Recognize unresponsiveness with absent or abnormal breathing, activate the response system, begin high-quality CPR, and use an AED or defibrillator early.",
        chips: ["Agonal gasps are abnormal", "Pulse check ≤10 seconds", "30:2", "100–120/min", "AED early"],
        visual: "arrest"
      })}

      ${sectionHeading("Recognize arrest", "Do not let an uncertain pulse or agonal breathing delay compressions.", "First link")}
      <section class="grid three">
        ${card("Unresponsive", `<p>The person does not respond to voice or stimulation. Call for help and activate the emergency response system.</p>`, "accent-red", "1")}
        ${card("Absent or abnormal breathing", `<p>No normal breathing or only gasping should be treated as cardiac arrest. Agonal gasps are not effective ventilation.</p>`, "accent-red", "2")}
        ${card("No definite pulse within 10 seconds", `<p>Health professionals should begin compressions if a pulse is not definitely felt within 10 seconds.</p>`, "accent-red", "3")}
      </section>

      ${sectionHeading("BLS sequence", "Minimize pauses and continue until return of spontaneous circulation or handover.", "Adult sequence")}
      <div class="flow-chain">
        <div class="flow-node red tts-unit" data-bookmark-title="Recognize cardiac arrest" data-tts-label="Recognize cardiac arrest">Recognize arrest<br><small>Unresponsive + abnormal breathing</small></div>
        <div class="flow-node tts-unit" data-bookmark-title="Activate emergency response" data-tts-label="Activate emergency response">Activate response<br><small>Call emergency system; get AED</small></div>
        <div class="flow-node tts-unit" data-bookmark-title="Start CPR" data-tts-label="Start CPR">Start CPR<br><small>Compressions first; 30:2</small></div>
        <div class="flow-node red tts-unit" data-bookmark-title="Use AED early" data-tts-label="Use AED early">Use AED early<br><small>Analyze and shock when advised</small></div>
        <div class="flow-node green tts-unit" data-bookmark-title="Continue resuscitation cycles" data-tts-label="Continue resuscitation cycles">Continue cycles<br><small>Minimize pauses</small></div>
      </div>

      ${sectionHeading("High-quality adult CPR", "Quality is not a background detail; it is a treatment.", "Performance targets")}
      ${table(
        ["Element", "Adult target", "Why it matters"],
        [
          ["Compression rate", "100–120/min.", "Too slow reduces perfusion; excessive rate can reduce depth and recoil."],
          ["Compression depth", "At least 5 cm; avoid excessive depth greater than 6 cm in the average adult.", "Adequate depth is required to generate coronary and cerebral perfusion."],
          ["Hand position", "Lower half of the sternum on a firm surface when feasible without delaying compressions.", "Optimizes force transmission while reducing avoidable injury."],
          ["Recoil", "Allow complete chest recoil and avoid leaning.", "Recoil supports venous return and refilling of the heart."],
          ["Interruptions", "Minimize pauses and maintain a high chest-compression fraction.", "Perfusion pressure falls rapidly when compressions stop."],
          ["Without advanced airway", "30 compressions to 2 breaths; each breath over about 1 second with visible chest rise.", "Provides ventilation without excessive interruption or hyperventilation."],
          ["With advanced airway", "Continuous compressions with 1 breath every 6 seconds.", "Separates ventilation from compressions while avoiding hyperventilation."],
          ["Compressor rotation", "Change approximately every 2 minutes when possible.", "Fatigue reduces depth even before the rescuer notices it."],
        ],
        "High-quality CPR elements"
      )}

      ${sectionHeading("CPR metronome", "Use the visual and optional sound cue to feel the recommended compression cadence.", "Interactive")}
      <section class="tool-card interactive-only" id="cpr-tool">
        <h3>Compression cadence trainer</h3>
        <p class="tool-intro">The default is 110 compressions/min, midway within the recommended 100–120/min range.</p>
        <div class="cpr-console">
          <div class="metronome" id="metronome"><div><strong id="cpr-rate-label">110</strong><span>compressions/min</span></div></div>
          <div>
            <div class="field"><label for="cpr-rate">Rate</label><input id="cpr-rate" type="range" min="100" max="120" value="110" step="1"></div>
            <div class="tool-actions"><button class="primary-button" id="start-metronome" type="button">Start</button><button class="secondary-button" id="stop-metronome" type="button">Stop</button><label class="option-chip"><input id="metronome-sound" type="checkbox"><span>Sound cue</span></label></div>
            <p class="tool-intro">Practice full recoil and consistent depth; cadence alone does not guarantee good compressions.</p>
          </div>
        </div>
      </section>

      ${sectionHeading("Shockable versus non-shockable arrest", "The pulse is absent in both; the electrical rhythm determines whether a shock is indicated.", "Rhythm categories")}
      ${table(
        ["Category", "Rhythms", "Immediate priority"],
        [
          ["Shockable", "Ventricular fibrillation and pulseless ventricular tachycardia.", "Immediate defibrillation with high-quality CPR between rhythm checks."],
          ["Non-shockable", "Asystole and pulseless electrical activity.", "Immediate CPR, epinephrine as soon as feasible, and aggressive search for reversible causes; do not shock unless the rhythm becomes shockable."],
        ],
        "Adult cardiac arrest rhythm categories"
      )}

      ${sectionHeading("Reversible causes: the 5 Hs and 5 Ts", "Use the list actively; it is not merely a mnemonic.", "Cause search")}
      <section class="grid two">
        ${card("5 Hs", `<ul class="mini-list"><li><strong>Hypovolemia</strong></li><li><strong>Hypoxia</strong></li><li><strong>Hydrogen ion excess</strong> (acidosis)</li><li><strong>Hypokalemia or hyperkalemia</strong></li><li><strong>Hypothermia</strong></li></ul>`, "accent-blue", "H")}
        ${card("5 Ts", `<ul class="mini-list"><li><strong>Tension pneumothorax</strong></li><li><strong>Cardiac tamponade</strong></li><li><strong>Toxins</strong></li><li><strong>Pulmonary thrombosis</strong></li><li><strong>Coronary thrombosis</strong></li></ul>`, "accent-red", "T")}
      </section>

      ${callout("danger", "Major correction:", "Adult CPR without an advanced airway uses a 30:2 compression-to-ventilation ratio, not 15:2. A precordial thump is not a routine substitute for CPR or defibrillation.")}
    `);
  }

  function alsPage() {
    return page("als", `
      ${hero({
        eyebrow: "Module 11 · Adult advanced life support",
        title: "Shockable and non-shockable pathways share one foundation: uninterrupted high-quality CPR",
        intro: "Defibrillation is prioritized for VF and pulseless VT. Epinephrine is given early in non-shockable arrest and after initial shocks in shockable arrest, while reversible causes are treated throughout.",
        chips: ["2-minute cycles", "Defibrillate VF/pVT", "Early epinephrine in PEA/asystole", "Capnography", "Hs and Ts"],
        visual: "arrest"
      })}

      ${sectionHeading("Choose the arrest pathway", "Select a rhythm category to build the sequence step by step.", "Interactive")}
      <section class="tool-card interactive-only" id="arrest-pathway-tool">
        <h3>Adult arrest pathway explorer</h3>
        <p class="tool-intro">This summarizes the sequence conceptually; exact timing, energy, access, and medication delivery follow the current local protocol.</p>
        <div class="pathway-selector">
          <button class="pathway-button shockable" type="button" data-arrest-pathway="shockable"><strong>VF / pulseless VT</strong><span>Shockable arrest</span></button>
          <button class="pathway-button" type="button" data-arrest-pathway="nonshockable"><strong>PEA / asystole</strong><span>Non-shockable arrest</span></button>
        </div>
        <div class="pathway-output" id="arrest-pathway-output"></div>
      </section>

      ${sectionHeading("Parallel algorithm", "Notice what differs and what remains the same.", "Side-by-side")}
      ${table(
        ["Shockable: VF / pulseless VT", "Non-shockable: PEA / asystole"],
        [
          ["Defibrillate promptly, then resume CPR for 2 minutes without pausing to check a pulse.", "Start CPR immediately and give epinephrine as soon as feasible."],
          ["Use biphasic energy according to the manufacturer; if unknown, use the maximum available setting. Monophasic defibrillation uses 360 J.", "Recheck the rhythm every 2 minutes and shock only if the rhythm becomes VF/pVT."],
          ["After initial defibrillation attempts fail, give epinephrine every 3–5 minutes.", "Continue epinephrine every 3–5 minutes and treat reversible causes."],
          ["For refractory VF/pVT, amiodarone or lidocaine may be considered.", "Do not use atropine routinely for asystole or PEA."],
          ["Maintain CPR quality, secure IV/IO access, consider advanced airway and capnography, and correct Hs and Ts.", "Maintain CPR quality, secure IV/IO access, consider advanced airway and capnography, and correct Hs and Ts."],
        ],
        "Adult advanced life support pathways"
      )}

      ${sectionHeading("Arrest medications and monitoring", "Many traditional interventions are not routine; use them only for the correct indication.", "Current principles")}
      ${table(
        ["Intervention", "Current point", "Common trap"],
        [
          ["Epinephrine", "Standard dose is 1 mg IV/IO every 3–5 minutes. Prioritize rapid defibrillation first in shockable arrest; administer early in non-shockable arrest.", "Do not delay the first shock in VF/pVT to obtain drug access."],
          ["Amiodarone or lidocaine", "Either may be considered for VF/pVT unresponsive to defibrillation.", "These drugs do not replace shocks and CPR."],
          ["Magnesium", "Use for torsades de pointes.", "Not routine for polymorphic VT with a normal QT interval."],
          ["Calcium", "Use for specific indications such as severe hyperkalemia, hypocalcemia, or calcium-channel-blocker toxicity.", "Not a routine cardiac-arrest drug."],
          ["Sodium bicarbonate", "Consider in selected toxicologic or metabolic situations such as sodium-channel-blocker poisoning or severe hyperkalemia.", "Not routine in undifferentiated arrest."],
          ["Vasopressin", "Offers no advantage over epinephrine and is not a routine substitute.", "Do not add routinely to the adult arrest sequence."],
          ["Waveform capnography", "Confirms and monitors an advanced airway, helps assess CPR quality, and may detect ROSC through an abrupt rise in ETCO₂.", "Do not use a single value in isolation to terminate resuscitation."],
        ],
        "ALS interventions"
      )}

      ${callout("info", "Pulse checks are rhythm-triggered, not routine pauses:", "After a shock, resume CPR immediately. Check for a pulse only when a rhythm check shows an organized rhythm and do so rapidly, minimizing interruption.")}
    `);
  }

  function postArrestPage() {
    return page("post-arrest", `
      ${hero({
        eyebrow: "Module 12 · Post-cardiac-arrest care",
        title: "ROSC is the start of a second resuscitation",
        intro: "After return of spontaneous circulation, stabilize oxygenation, ventilation, circulation, temperature, neurologic care, and the underlying cause while avoiding premature prognostication.",
        chips: ["Avoid hypoxemia and hyperoxemia", "Normocapnia", "MAP ≥65 mmHg", "Temperature control", "Multimodal prognosis"],
        visual: "sinus"
      })}

      ${sectionHeading("Integrated post-ROSC pathway", "Work in parallel: physiology, cause, brain protection, and recovery planning.", "Five domains")}
      <div class="flow-chain">
        <div class="flow-node red tts-unit" data-bookmark-title="Stabilize ABC after ROSC" data-tts-label="Stabilize ABC after ROSC">Stabilize ABC<br><small>Airway, ventilation, hypotension</small></div>
        <div class="flow-node tts-unit" data-bookmark-title="Oxygen and carbon dioxide after ROSC" data-tts-label="Oxygen and carbon dioxide after ROSC">O₂ + CO₂<br><small>Avoid extremes; normocapnia</small></div>
        <div class="flow-node tts-unit" data-bookmark-title="Find the cause of arrest" data-tts-label="Find the cause of arrest">Find cause<br><small>ECG, imaging, labs, coronary review</small></div>
        <div class="flow-node tts-unit" data-bookmark-title="Protect the brain after arrest" data-tts-label="Protect the brain after arrest">Protect brain<br><small>Temperature, seizures, sedation</small></div>
        <div class="flow-node green tts-unit" data-bookmark-title="Plan recovery after cardiac arrest" data-tts-label="Plan recovery after cardiac arrest">Plan recovery<br><small>ICU, rehab, prevention, family support</small></div>
      </div>

      ${sectionHeading("Physiological targets and principles", "Avoid both under-treatment and iatrogenic extremes.", "2025 post-arrest care")}
      ${table(
        ["Domain", "Current target / principle", "Reasoning"],
        [
          ["Oxygenation", "Use 100% oxygen until reliable measurement is available, then titrate to SpO₂ 90–98% and avoid hypoxemia and hyperoxemia.", "Both inadequate oxygen and excessive oxygen exposure can be harmful."],
          ["Ventilation", "Target physiological carbon dioxide levels and avoid routine hyperventilation.", "Hypocapnia can reduce cerebral blood flow; severe hypercapnia can worsen acidosis and intracranial physiology."],
          ["Blood pressure", "Avoid hypotension; maintain MAP at least 65 mmHg, individualized upward when clinically required.", "Cerebral and coronary perfusion remain vulnerable after ROSC."],
          ["Temperature control", "For patients unresponsive to verbal commands, use a deliberate protocol maintaining 32–37.5°C for at least 36 hours and prevent fever.", "Temperature control is an active neuroprotective strategy; fever is harmful."],
          ["Coronary reperfusion", "Urgent angiography is indicated for persistent ST elevation or strong suspicion of acute coronary occlusion.", "Routine immediate angiography is not required for every comatose patient without ST elevation."],
          ["Neurologic care", "Treat seizures and use delayed multimodal prognostication after confounders clear.", "No single early sign should determine prognosis."],
          ["Secondary prevention", "Identify inherited or structural disease, optimize ischemic and HF therapy, assess ICD indication, and support rehabilitation and survivors/families.", "Survival includes functional recovery and prevention of recurrence."],
        ],
        "Post-cardiac-arrest care"
      )}

      ${sectionHeading("Post-ROSC timeline", "The order is conceptual; many actions occur simultaneously in ICU care.", "Recovery pathway")}
      <div class="timeline">
        <div class="timeline-item tts-unit" data-step="1" data-bookmark-title="Immediate post-ROSC stabilization" data-tts-label="Immediate post-ROSC stabilization"><strong>Immediate stabilization</strong><p>Confirm airway and ventilation, titrate oxygen once measurable, treat hypotension, obtain a 12-lead ECG, and identify recurrent arrhythmia.</p></div>
        <div class="timeline-item tts-unit" data-step="2" data-bookmark-title="Identify cardiac arrest cause" data-tts-label="Identify cardiac arrest cause"><strong>Find the cause</strong><p>Use history, ECG, laboratory tests, bedside imaging, coronary evaluation, and the Hs and Ts. Treat time-critical coronary, pulmonary, toxic, electrolyte, or mechanical causes.</p></div>
        <div class="timeline-item tts-unit" data-step="3" data-bookmark-title="Brain protection and temperature control" data-tts-label="Brain protection and temperature control"><strong>Protect the brain</strong><p>Use protocolized temperature control, prevent fever, assess seizures, avoid hypoxemia, hyperoxemia, hypotension, and unnecessary hyperventilation.</p></div>
        <div class="timeline-item tts-unit" data-step="4" data-bookmark-title="Delayed multimodal prognostication" data-tts-label="Delayed multimodal prognostication"><strong>Prognosticate carefully</strong><p>Wait for sedation, temperature, metabolic, and other confounders to clear. Combine clinical examination, electrophysiology, biomarkers, and imaging as appropriate.</p></div>
        <div class="timeline-item tts-unit" data-step="5" data-bookmark-title="Cardiac arrest survivorship" data-tts-label="Cardiac arrest survivorship"><strong>Recovery and prevention</strong><p>Plan rehabilitation, cognitive and psychological support, family communication, ICD or ablation assessment, and treatment of the underlying disease.</p></div>
      </div>

      ${callout("warning", "Avoid premature neurologic prediction:", "Early myoclonus, an isolated examination finding, or a single test should not be used alone to predict poor outcome. Prognostication must be delayed, multimodal, and free of major confounders.")}
    `);
  }

  const flashcards = [
    ["Regular wide-complex tachycardia", "Treat as VT until proved otherwise, especially with structural heart disease."],
    ["Irregular, very rapid, wide-complex tachycardia", "Consider pre-excited AF; avoid AV-nodal blockers."],
    ["Atrial flutter with 2:1 block", "Ventricular rate is often close to 150/min; adenosine may reveal flutter waves but usually does not terminate flutter."],
    ["Unstable tachyarrhythmia with a pulse", "Synchronized cardioversion takes priority over prolonged diagnostic analysis."],
    ["VF or pulseless VT", "Immediate defibrillation, then resume high-quality CPR."],
    ["PEA or asystole", "CPR, early epinephrine, and search for reversible causes; no routine shock."],
    ["Torsades de pointes", "Polymorphic VT with prolonged QT; magnesium and correction of causes, with defibrillation if unstable/pulseless."],
    ["Mobitz II", "Constant PR intervals with dropped QRS complexes; usually infranodal and warrants pacing evaluation."],
    ["Complete AV block", "No fixed P–QRS relationship; urgent pacing if unstable."],
    ["AF stroke prevention", "Use CHA₂DS₂-VA in the 2024 ESC framework; DOAC usually preferred except mechanical valve or moderate-to-severe mitral stenosis."],
    ["Adult CPR ratio", "30 compressions to 2 breaths without an advanced airway."],
    ["Post-ROSC oxygen", "Use 100% until reliable measurement, then titrate to SpO₂ 90–98%."],
  ];

  function revisionPage() {
    return page("revision", `
      ${hero({
        eyebrow: "Revision lab",
        title: "Compare patterns, flip cards, and expose the dangerous traps",
        intro: "Use active recall rather than rereading. Describe each strip, state the unstable action, identify what must be avoided, and explain the mechanism.",
        chips: ["Pattern recognition", "Flashcards", "Never-miss traps", "Active recall"],
        visual: "af"
      })}

      ${sectionHeading("ECG rhythm gallery", "The strips are schematic and designed for pattern comparison, not interval measurement.", "Visual revision")}
      <section class="grid two">
        ${ecgCard("Sinus rhythm", "sinus", "Regular rhythm with a P wave before every narrow QRS.")}
        ${ecgCard("Regular narrow SVT", "svt", "Very regular narrow tachycardia; P waves may be hidden or retrograde.", "red")}
        ${ecgCard("Atrial flutter", "flutter", "Continuous atrial activity; fixed 2:1 conduction often produces a ventricular rate around 150/min.")}
        ${ecgCard("Atrial fibrillation", "af", "No repetitive P waves and irregular RR intervals.", "red")}
        ${ecgCard("Monomorphic VT", "vt", "Regular wide-complex tachycardia with repeated morphology.", "red")}
        ${ecgCard("Torsades de pointes", "torsades", "Polymorphic VT with prolonged QT and twisting morphology.", "red")}
        ${ecgCard("Ventricular fibrillation", "vf", "Chaotic electrical activity without organized output.", "red")}
        ${ecgCard("Complete AV block", "block", "Independent atrial and ventricular activity with no fixed relationship.", "red")}
      </section>

      ${sectionHeading("High-yield comparison", "State the unstable treatment before discussing long-term therapy.", "Exam table")}
      ${table(
        ["Rhythm", "Regularity", "QRS", "Key clue", "Immediate unstable treatment"],
        [
          ["AVNRT / orthodromic AVRT", "Regular", "Narrow", "Abrupt onset/offset; P often hidden or retrograde.", "Synchronized cardioversion."],
          ["Atrial flutter", "Often regular with fixed block", "Usually narrow", "Flutter waves; rate often near 150 with 2:1 block.", "Synchronized cardioversion."],
          ["Atrial fibrillation", "Irregularly irregular", "Usually narrow", "No repetitive P waves; variable RR.", "Synchronized cardioversion."],
          ["Monomorphic VT", "Regular", "Wide", "AV dissociation, capture/fusion beats, structural disease.", "Synchronized cardioversion if pulse; defibrillation if pulseless."],
          ["Torsades / polymorphic VT", "Irregular", "Wide", "Twisting morphology; torsades has prolonged QT.", "Defibrillation if unstable/pulseless; magnesium for torsades."],
          ["Complete AV block", "Atria and ventricles regular but dissociated", "Narrow or wide escape", "No fixed P–QRS relation; severe bradycardia.", "Pacing and resuscitative support."],
        ],
        "High-yield rhythm recognition"
      )}

      ${sectionHeading("Flashcards", "Click a card or focus it and press Enter/Space to reveal the answer.", `${flashcards.length} cards`)}
      <div class="flashcard-toolbar interactive-only" aria-label="Flashcard controls">
        <button class="secondary-button" id="flip-all-flashcards" type="button">Flip all</button>
        <button class="secondary-button" id="reset-flashcards" type="button">Reset cards</button>
      </div>
      <section class="flashcard-grid interactive-only" id="flashcard-grid" aria-label="Arrhythmia revision flashcards">
        ${flashcards.map(([front, back], index) => `<button class="flashcard" type="button" aria-pressed="false" aria-label="Flashcard ${index + 1}: ${esc(front)}. Press Enter or Space to reveal the answer."><span class="flashcard-inner"><span class="flashcard-face flashcard-front"><strong>${front}</strong><small>Card ${index + 1} · Reveal answer</small></span><span class="flashcard-face flashcard-back" aria-hidden="true"><strong>${back}</strong><small>Press again to return</small></span></span></button>`).join("")}
      </section>

      ${sectionHeading("Classic traps and corrections", "Many errors come from outdated sequences or applying a correct drug to the wrong rhythm.", "Never miss")}
      ${table(
        ["Outdated or unsafe framing", "Updated interpretation"],
        [
          ["The AV node permits no retrograde conduction.", "Retrograde AV-nodal or accessory-pathway conduction is central to many re-entrant tachycardias."],
          ["Carotid massage is a general diagnostic test for every tachycardia.", "Use safe vagal manoeuvres only in selected stable regular narrow-complex tachycardia; avoid carotid massage when carotid or neurologic risk exists."],
          ["Routine digoxin or amiodarone is the acute PSVT sequence.", "Vagal manoeuvres and adenosine are first steps for suitable regular narrow SVT; ablation is preferred for recurrent symptomatic AVNRT/AVRT."],
          ["Flutter is simply a transitional stage of AF.", "Flutter is a distinct macro-re-entrant rhythm with its own mechanism and highly effective ablation strategy."],
          ["Two weeks of anticoagulation is enough before cardioversion.", "For AF &gt;24 hours or uncertain duration, use at least 3 weeks of effective anticoagulation or imaging guidance, then at least 4 weeks after cardioversion."],
          ["Beta-blocker or IV amiodarone is safe in pre-excited AF.", "AV-nodal blockers can be dangerous in pre-excited AF; use cardioversion when unstable and specialist-directed pathway-safe therapy when stable."],
          ["Adult CPR uses 15:2.", "Adult CPR without an advanced airway uses 30:2."],
          ["Atropine and vasopressin are routine for asystole/PEA.", "Neither is routine; use CPR, early epinephrine, and correction of reversible causes."],
        ],
        "Corrections to common outdated statements"
      )}
    `);
  }

  const quizQuestions = [
    {
      q: "A patient has a regular wide-complex tachycardia at 180/min and a previous myocardial infarction. Blood pressure is currently preserved. What is the safest initial diagnostic assumption?",
      options: ["Sinus tachycardia", "Ventricular tachycardia", "Atrial fibrillation", "Mobitz II block"],
      answer: 1,
      explanation: "A regular wide-complex tachycardia in an adult with structural heart disease should be treated as VT until a safer alternative is firmly established. Stability allows structured evaluation but does not make the rhythm low risk."
    },
    {
      q: "A patient with a pulse has tachycardia causing hypotension, pulmonary edema, and altered consciousness. What takes priority?",
      options: ["A long rhythm-strip analysis", "Oral beta-blocker", "Synchronized cardioversion", "Observation"],
      answer: 2,
      explanation: "When tachyarrhythmia is causing hemodynamic instability, synchronized electrical cardioversion takes priority. Sedation is desirable when feasible but must not delay treatment."
    },
    {
      q: "A regular narrow tachycardia stops abruptly after adenosine. Which mechanism is most likely?",
      options: ["AV-node-dependent re-entry", "Sinus tachycardia from fever", "Ventricular fibrillation", "Complete AV block"],
      answer: 0,
      explanation: "Adenosine can terminate AVNRT or orthodromic AVRT because the AV node is a required part of the re-entry circuit."
    },
    {
      q: "A regular narrow tachycardia has a ventricular rate near 150/min. Which diagnosis should be actively sought?",
      options: ["Typical atrial flutter with 2:1 conduction", "Complete heart block", "Torsades de pointes", "Sinus arrest"],
      answer: 0,
      explanation: "Typical flutter has an atrial rate commonly near 300/min, so 2:1 AV conduction often yields a ventricular rate close to 150/min."
    },
    {
      q: "Which ECG pattern best describes atrial fibrillation?",
      options: ["Progressive PR prolongation", "Irregular RR intervals without repetitive P waves", "Regular wide QRS with AV dissociation", "Short PR with delta wave only"],
      answer: 1,
      explanation: "AF is diagnosed by clinician-confirmed ECG showing irregular RR intervals and no repetitive P waves, unless AV conduction is absent."
    },
    {
      q: "In the 2024 ESC CHA₂DS₂-VA framework, when is oral anticoagulation recommended?",
      options: ["Only at score 4", "At score 0", "At score ≥2; consider at score 1", "For every patient regardless of risk"],
      answer: 2,
      explanation: "Oral anticoagulation is recommended at CHA₂DS₂-VA ≥2 and should be considered at score 1 after individualized assessment."
    },
    {
      q: "An unstable patient has an irregular, extremely rapid, wide-complex rhythm and known pre-excitation. Which drug category should be avoided?",
      options: ["AV-nodal blockers", "Magnesium in torsades", "Epinephrine in arrest", "Oxygen when hypoxemic"],
      answer: 0,
      explanation: "In pre-excited AF, AV-nodal blockers can favor rapid accessory-pathway conduction and precipitate VF. Urgent cardioversion is preferred when unstable."
    },
    {
      q: "Polymorphic VT occurs with a prolonged QT and twisting morphology. Which treatment is specifically important?",
      options: ["IV magnesium", "Verapamil", "Digoxin", "Routine calcium"],
      answer: 0,
      explanation: "This is torsades de pointes. Correct precipitating factors and give IV magnesium; defibrillate if unstable or pulseless."
    },
    {
      q: "Which AV block pattern is characterized by constant PR intervals with intermittent non-conducted P waves?",
      options: ["Mobitz I", "Mobitz II", "First-degree block", "Sinus arrhythmia"],
      answer: 1,
      explanation: "Mobitz II has constant PR intervals before dropped QRS complexes, is usually infranodal, and can progress abruptly to complete block."
    },
    {
      q: "A patient with complete AV block is hypotensive with a wide slow escape rhythm. Which principle is most important?",
      options: ["Rely on repeated atropine only", "Prepare urgent pacing and resuscitative support", "Give verapamil", "Discharge if the atrial rate is normal"],
      answer: 1,
      explanation: "Atropine may be ineffective in distal block. Unstable high-grade or complete block requires pacing readiness and expert definitive care."
    },
    {
      q: "Which rhythms are shockable in cardiac arrest?",
      options: ["Asystole and PEA", "VF and pulseless VT", "AF and flutter", "Sinus bradycardia and junctional rhythm"],
      answer: 1,
      explanation: "VF and pulseless VT are shockable. PEA and asystole require CPR, early epinephrine, and correction of reversible causes."
    },
    {
      q: "What is the adult compression-to-ventilation ratio without an advanced airway?",
      options: ["15:2", "5:1", "30:2", "Continuous compressions with no breaths in all settings"],
      answer: 2,
      explanation: "Adult CPR without an advanced airway uses 30 compressions to 2 breaths."
    },
    {
      q: "What is the recommended adult chest-compression rate?",
      options: ["60–80/min", "80–90/min", "100–120/min", "140–160/min"],
      answer: 2,
      explanation: "High-quality adult CPR targets 100–120 compressions per minute."
    },
    {
      q: "After defibrillating VF during cardiac arrest, what should happen next?",
      options: ["Pause for a long pulse check", "Resume CPR immediately for 2 minutes", "Give atropine", "Wait for a 12-lead ECG"],
      answer: 1,
      explanation: "After a shock, resume CPR immediately. Rhythm and pulse assessment occur at the next planned check with minimal interruption."
    },
    {
      q: "After ROSC, once oxygen saturation can be measured reliably, what SpO₂ range is targeted in the source chapter?",
      options: ["70–80%", "80–88%", "90–98%", "Always 100%"],
      answer: 2,
      explanation: "Use 100% oxygen until reliable measurement is available, then titrate to avoid both hypoxemia and hyperoxemia, targeting SpO₂ 90–98%."
    }
  ];

  function casesPage() {
    return page("cases", `
      ${hero({
        eyebrow: "Clinical cases",
        title: "Make the next decision before reading the explanation",
        intro: "Each case tests the sequence: assess stability, describe the ECG, choose the immediate action, then address recurrence and risk.",
        chips: ["15 questions", "Immediate feedback", "Exam traps", "Clinical reasoning"],
        visual: "vt"
      })}

      ${sectionHeading("Case-based quiz", "Select one answer. The explanation appears immediately, and your score is saved only for this session.", "Interactive")}
      <section class="quiz-shell interactive-only" id="quiz-shell">
        <div class="quiz-progress"><span id="quiz-position">Question 1 of ${quizQuestions.length}</span><span id="quiz-score">Score: 0</span></div>
        <div id="quiz-container"></div>
        <div class="tool-actions"><button class="secondary-button" id="quiz-prev" type="button">Previous</button><button class="primary-button" id="quiz-next" type="button">Next</button><button class="secondary-button" id="quiz-restart" type="button">Restart quiz</button></div>
      </section>

      ${sectionHeading("Case debrief framework", "Use these prompts after every question, even when you chose the correct option.", "Reasoning template")}
      <section class="grid three">
        ${card("1 · Safety", `<p>Was there a pulse? Which adverse features made the rhythm unstable? Was synchronized or unsynchronized energy required?</p>`, "accent-red", "!")}
        ${card("2 · Description", `<p>Fast or slow? Regular or irregular? Narrow or wide? What atrial activity and P–QRS relationship were present?</p>`, "accent-blue", "ECG")}
        ${card("3 · Mechanism", `<p>Automaticity, triggered activity, re-entry, or conduction failure? Is there a structural, ischemic, toxic, or inherited substrate?</p>`, "accent-violet", "M")}
        ${card("4 · Immediate action", `<p>What must be done now? What drug or intervention is dangerous in this pattern?</p>`, "accent-amber", "NOW")}
        ${card("5 · Reversible cause", `<p>Check oxygenation, ischemia, electrolytes, thyroid status, medications, toxins, infection, and volume state.</p>`, "accent-teal", "R")}
        ${card("6 · Prevention", `<p>Does the patient need anticoagulation, ablation, pacing, an ICD, structural assessment, or risk-factor management?</p>`, "accent-blue", "P")}
      </section>
    `);
  }

  function sourcesPage() {
    return page("sources", `
      ${hero({
        eyebrow: "Sources, scope, and limitations",
        title: "Built from the supplied chapter and cross-checked against current major guidelines",
        intro: "The site preserves the chapter's structured teaching while turning tables and algorithms into connected interactive modules. It is designed for study, not unsupervised emergency treatment or prescribing.",
        chips: ["Source PDF included", "ESC AF 2024", "ESC VA 2022", "ESC pacing 2021", "AHA CPR/ECC 2025"],
        visual: "sinus"
      })}

      ${sectionHeading("Included source chapter", "Open the original reconstructed study chapter from the website folder.", "Local PDF")}
      <div class="source-list">
        <article class="source-card"><div class="source-icon">PDF</div><div><h3>Arrhythmias and Cardiac Arrest — reconstructed study chapter</h3><p>Thirteen-page supplied source covering rhythm recognition, acute stabilization, long-term management, pacing, defibrillation, BLS/ALS, post-arrest care, corrections, and revision tables.</p><a href="assets/arrhythmias-and-cardiac-arrest-source.pdf" target="_blank" rel="noopener">Open the supplied PDF</a></div></article>
      </div>

      ${sectionHeading("Guideline references", "These links provide the full authoritative context behind the concise educational statements.", "Official sources")}
      <div class="source-list">
        <article class="source-card"><div class="source-icon">ESC</div><div><h3>2024 ESC Guidelines for the management of atrial fibrillation</h3><p>AF-CARE, CHA₂DS₂-VA, anticoagulation, rate/rhythm control, cardioversion, and ablation.</p><a href="https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/atrial-fibrillation/" target="_blank" rel="noopener">Open official ESC guideline page</a></div></article>
        <article class="source-card"><div class="source-icon">ESC</div><div><h3>2022 ESC Guidelines for ventricular arrhythmias and sudden cardiac death</h3><p>Ventricular ectopy, VT, inherited syndromes, ablation, and ICD risk prevention.</p><a href="https://esc365.escardio.org/journal/511" target="_blank" rel="noopener">Open official ESC publication page</a></div></article>
        <article class="source-card"><div class="source-icon">ESC</div><div><h3>2021 ESC Guidelines on cardiac pacing and CRT</h3><p>Sinus-node dysfunction, AV block, pacing indications, conduction-system pacing, and CRT.</p><a href="https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/cardiac-pacing-and-cardiac-resynchronization-therapy/" target="_blank" rel="noopener">Open official ESC guideline page</a></div></article>
        <article class="source-card"><div class="source-icon">AHA</div><div><h3>2025 AHA Guidelines for CPR and Emergency Cardiovascular Care</h3><p>Adult BLS, advanced life support, electrical therapy, arrest algorithms, and post-cardiac-arrest care.</p><a href="https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/algorithms/" target="_blank" rel="noopener">Open official AHA algorithms</a></div></article>
        <article class="source-card"><div class="source-icon">AHA</div><div><h3>2025 Adult post-cardiac-arrest care</h3><p>Oxygenation, ventilation, blood pressure, temperature control, coronary evaluation, neurologic care, and survivorship.</p><a href="https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/post-cardiac-arrest-care" target="_blank" rel="noopener">Open official AHA guideline page</a></div></article>
      </div>

      ${sectionHeading("Text-to-speech", "Every compact learning block receives its own Listen button after the page renders.", "Browser feature")}
      ${card("Voice selection", `<p>The site uses the browser Web Speech API. It first looks for <strong>Google UK English Female</strong>, then another British-English female voice when available, then the closest English voice.</p><p>Voice availability depends on the operating system and browser. Chrome and Edge typically provide the broadest support. The speed selector changes narration rate, and the square button stops speech immediately.</p>`, "accent-blue", "TTS")}

      ${sectionHeading("Educational limitations", "Use the site to organize knowledge, then verify patient-specific details in full protocols.", "Important")}
      ${callout("warning", "Not a prescribing or resuscitation protocol:", "Exact drug dose, infusion rate, shock energy, anticoagulant selection, contraindication, device indication, and sequence must follow the patient's context, the latest institutional policy, and trained clinical leadership.")}
      ${callout("info", "Schematic ECGs:", "The rhythm strips are intentionally simplified to teach pattern relationships. They are not calibrated diagnostic ECGs and should not be used to measure intervals or make a clinical diagnosis.")}
      ${callout("success", "Offline-first website:", "The chapter, search, quiz, calculators, bookmarks, progress, and TTS logic work without an internet connection. External guideline links require internet access.")}
    `);
  }

  const pages = {
    overview: overviewPage,
    foundations: foundationsPage,
    approach: approachPage,
    narrow: narrowPage,
    "af-flutter": afFlutterPage,
    wide: widePage,
    brady: bradyPage,
    wpw: wpwPage,
    treatment: treatmentPage,
    arrest: arrestPage,
    als: alsPage,
    "post-arrest": postArrestPage,
    revision: revisionPage,
    cases: casesPage,
    sources: sourcesPage
  };

  return { routes, routeById, pages, quizQuestions, flashcards, esc };
})();
