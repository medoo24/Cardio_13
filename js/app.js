/* RhythmLab application controller. */
(() => {
  "use strict";

  const content = window.ArrhythmiaContent;
  if (!content) throw new Error("ArrhythmiaContent failed to load.");

  const els = {
    body: document.body,
    nav: document.getElementById("course-nav"),
    app: document.getElementById("app-content"),
    currentLabel: document.getElementById("current-section-label"),
    sidebar: document.getElementById("sidebar"),
    scrim: document.getElementById("sidebar-scrim"),
    menu: document.getElementById("menu-button"),
    closeSidebar: document.getElementById("sidebar-close"),
    progressLabel: document.getElementById("progress-label"),
    progressBar: document.getElementById("progress-bar"),
    resetProgress: document.getElementById("reset-progress"),
    clearBookmarks: document.getElementById("clear-bookmarks"),
    search: document.getElementById("site-search"),
    searchResults: document.getElementById("search-results"),
    voiceStatus: document.getElementById("voice-status"),
    speechRate: document.getElementById("speech-rate"),
    stopSpeech: document.getElementById("stop-speech"),
    print: document.getElementById("print-button"),
    toast: document.getElementById("toast"),
    bookmarkDialog: document.getElementById("bookmark-dialog"),
    bookmarkList: document.getElementById("bookmark-list"),
    bookmarksButton: document.getElementById("bookmarks-button"),
    closeBookmarks: document.getElementById("close-bookmarks")
  };

  const STORAGE = {
    visited: "rhythmlab.visited.v1",
    bookmarks: "rhythmlab.bookmarks.v1"
  };

  const state = {
    route: "overview",
    visited: readJson(STORAGE.visited, ["overview"]),
    bookmarks: readJson(STORAGE.bookmarks, []),
    voice: null,
    speakingButton: null,
    toastTimer: null,
    metronomeTimer: null,
    metronomeAudioContext: null,
    quiz: { index: 0, score: 0, answers: {} }
  };

  const searchIndex = buildSearchIndex();

  function readJson(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value ?? fallback;
    } catch {
      return fallback;
    }
  }

  function writeJson(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage can be blocked */ }
  }

  function showToast(message) {
    clearTimeout(state.toastTimer);
    els.toast.textContent = message;
    els.toast.hidden = false;
    state.toastTimer = setTimeout(() => { els.toast.hidden = true; }, 2800);
  }

  function buildNav() {
    const eyebrow = els.nav.querySelector(".nav-eyebrow");
    els.nav.innerHTML = "";
    if (eyebrow) els.nav.append(eyebrow);
    else {
      const p = document.createElement("p");
      p.className = "nav-eyebrow";
      p.textContent = "Connected study map";
      els.nav.append(p);
    }

    content.routes.forEach((route) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `nav-item${route.tool ? " nav-item-tool" : ""}`;
      button.dataset.route = route.id;
      button.innerHTML = `<span class="nav-icon">${route.icon}</span><span><strong>${route.title}</strong><small>${route.subtitle}</small></span>`;
      els.nav.append(button);
    });
  }

  function normalizedRoute() {
    const id = decodeURIComponent(location.hash.replace(/^#/, ""));
    return content.pages[id] ? id : "overview";
  }

  function navigate(route) {
    if (!content.pages[route]) route = "overview";
    if (location.hash === `#${route}`) render(route);
    else location.hash = route;
  }

  function render(route = normalizedRoute()) {
    stopSpeech();
    stopMetronome();
    state.route = route;
    const routeMeta = content.routeById[route];
    els.currentLabel.textContent = routeMeta.title;
    document.title = `${routeMeta.title} | RhythmLab`;
    els.app.innerHTML = content.pages[route]();

    if (!state.visited.includes(route)) {
      state.visited.push(route);
      writeJson(STORAGE.visited, state.visited);
    }

    updateNav();
    updateProgress();
    addBlockTools();
    setupTabs();
    setupPageInteractions();
    closeSidebar();
    window.scrollTo({ top: 0, behavior: "instant" });
    requestAnimationFrame(() => document.getElementById("main-content")?.focus({ preventScroll: true }));
  }

  function updateNav() {
    els.nav.querySelectorAll(".nav-item").forEach((item) => {
      const id = item.dataset.route;
      item.classList.toggle("is-active", id === state.route);
      item.classList.toggle("is-visited", state.visited.includes(id));
      if (id === state.route) item.setAttribute("aria-current", "page");
      else item.removeAttribute("aria-current");
    });
  }

  function updateProgress() {
    const unique = new Set(state.visited.filter((id) => content.pages[id]));
    const total = content.routes.length;
    els.progressLabel.textContent = `${unique.size} / ${total}`;
    els.progressBar.style.width = `${Math.min(100, (unique.size / total) * 100)}%`;
  }

  function openSidebar() {
    els.body.classList.add("sidebar-open");
    els.scrim.hidden = false;
    els.menu.setAttribute("aria-expanded", "true");
  }

  function closeSidebar() {
    els.body.classList.remove("sidebar-open");
    els.scrim.hidden = true;
    els.menu.setAttribute("aria-expanded", "false");
  }

  function addBlockTools() {
    const units = [...els.app.querySelectorAll(".tts-unit")];
    units.forEach((unit, index) => {
      if (unit.querySelector(":scope > .block-tools")) return;
      const title = unit.dataset.bookmarkTitle || unit.dataset.ttsLabel || unit.querySelector("h1,h2,h3,strong")?.textContent?.trim() || `Study block ${index + 1}`;
      const bookmarkId = `${state.route}::${title}`;
      const saved = state.bookmarks.some((item) => item.id === bookmarkId);
      const tools = document.createElement("div");
      tools.className = "block-tools";
      tools.dataset.noSpeak = "";
      tools.innerHTML = `<button class="listen-button" type="button" aria-label="Listen to ${content.esc(title)}">▶ Listen</button><button class="bookmark-button ${saved ? "is-saved" : ""}" type="button" aria-label="${saved ? "Remove" : "Save"} bookmark" data-bookmark-id="${content.esc(bookmarkId)}">${saved ? "★ Saved" : "☆ Save"}</button>`;
      unit.prepend(tools);
      tools.querySelector(".listen-button").addEventListener("click", (event) => speakUnit(unit, event.currentTarget));
      tools.querySelector(".bookmark-button").addEventListener("click", (event) => toggleBookmark(bookmarkId, title, event.currentTarget));
    });
  }

  function toggleBookmark(id, title, button) {
    const index = state.bookmarks.findIndex((item) => item.id === id);
    if (index >= 0) {
      state.bookmarks.splice(index, 1);
      button.classList.remove("is-saved");
      button.textContent = "☆ Save";
      button.setAttribute("aria-label", "Save bookmark");
      showToast("Bookmark removed");
    } else {
      state.bookmarks.push({ id, title, route: state.route, savedAt: Date.now() });
      button.classList.add("is-saved");
      button.textContent = "★ Saved";
      button.setAttribute("aria-label", "Remove bookmark");
      showToast("Saved for revision");
    }
    writeJson(STORAGE.bookmarks, state.bookmarks);
  }

  function showBookmarks() {
    if (!state.bookmarks.length) {
      els.bookmarkList.innerHTML = `<div class="empty-state"><strong>No saved blocks yet.</strong><p>Use the ☆ Save button on any learning block.</p></div>`;
    } else {
      els.bookmarkList.innerHTML = state.bookmarks
        .slice()
        .sort((a, b) => b.savedAt - a.savedAt)
        .map((item) => `<div class="bookmark-entry"><button type="button" data-bookmark-route="${item.route}" data-bookmark-title="${content.esc(item.title)}"><strong>${content.esc(item.title)}</strong><small>${content.routeById[item.route]?.title || item.route}</small></button><button class="icon-button" type="button" data-remove-bookmark="${content.esc(item.id)}" aria-label="Remove bookmark">×</button></div>`)
        .join("");
    }
    if (!els.bookmarkDialog.open) {
      if (typeof els.bookmarkDialog.showModal === "function") els.bookmarkDialog.showModal();
      else els.bookmarkDialog.setAttribute("open", "");
    }
  }

  function removeBookmark(id) {
    state.bookmarks = state.bookmarks.filter((item) => item.id !== id);
    writeJson(STORAGE.bookmarks, state.bookmarks);
    const pageButton = els.app.querySelector(`[data-bookmark-id="${CSS.escape(id)}"]`);
    if (pageButton) {
      pageButton.classList.remove("is-saved");
      pageButton.textContent = "☆ Save";
      pageButton.setAttribute("aria-label", "Save bookmark");
    }
    showBookmarks();
  }

  function setupTabs() {
    els.app.querySelectorAll("[data-tabset]").forEach((tabset) => {
      const buttons = [...tabset.querySelectorAll(".tab-button")];
      buttons.forEach((button) => {
        button.addEventListener("click", () => {
          buttons.forEach((item) => {
            const selected = item === button;
            item.classList.toggle("is-active", selected);
            item.setAttribute("aria-selected", String(selected));
            const panel = tabset.querySelector(`#${CSS.escape(item.dataset.tabTarget)}`);
            if (panel) panel.hidden = !selected;
          });
        });
      });
    });
  }

  function selectVoice() {
    if (!("speechSynthesis" in window)) {
      els.voiceStatus.textContent = "TTS unavailable";
      return;
    }
    const voices = speechSynthesis.getVoices();
    const exact = voices.find((voice) => /google uk english female/i.test(voice.name));
    const britishFemale = voices.find((voice) => voice.lang.toLowerCase().startsWith("en-gb") && /female|serena|susan|hazel|sonia|libby/i.test(voice.name));
    const british = voices.find((voice) => voice.lang.toLowerCase().startsWith("en-gb"));
    const english = voices.find((voice) => voice.lang.toLowerCase().startsWith("en"));
    state.voice = exact || britishFemale || british || english || voices[0] || null;
    els.voiceStatus.textContent = state.voice ? state.voice.name : "Default system voice";
  }

  function extractSpeechText(unit) {
    const clone = unit.cloneNode(true);
    clone.querySelectorAll(".block-tools, [data-no-speak], button, input, select, dialog, .ecg-label").forEach((node) => node.remove());
    return clone.textContent.replace(/\s+/g, " ").trim();
  }

  function speakUnit(unit, button) {
    if (!("speechSynthesis" in window)) {
      showToast("Text-to-speech is not available in this browser.");
      return;
    }
    if (state.speakingButton === button && speechSynthesis.speaking) {
      stopSpeech();
      return;
    }
    stopSpeech();
    const text = extractSpeechText(unit);
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    if (state.voice) utterance.voice = state.voice;
    utterance.lang = state.voice?.lang || "en-GB";
    utterance.rate = Number(els.speechRate.value) || 0.95;
    utterance.pitch = 1;
    utterance.onstart = () => {
      state.speakingButton = button;
      button.classList.add("is-speaking");
      button.textContent = "■ Stop";
    };
    utterance.onend = utterance.onerror = () => {
      button.classList.remove("is-speaking");
      button.textContent = "▶ Listen";
      if (state.speakingButton === button) state.speakingButton = null;
    };
    speechSynthesis.speak(utterance);
  }

  function stopSpeech() {
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    if (state.speakingButton) {
      state.speakingButton.classList.remove("is-speaking");
      state.speakingButton.textContent = "▶ Listen";
      state.speakingButton = null;
    }
  }

  function buildSearchIndex() {
    return content.routes.map((route) => {
      const temp = document.createElement("div");
      temp.innerHTML = content.pages[route.id]();
      temp.querySelectorAll(".module-nav, .interactive-only").forEach((node) => node.remove());
      return {
        id: route.id,
        title: route.title,
        subtitle: route.subtitle,
        text: temp.textContent.replace(/\s+/g, " ").trim()
      };
    });
  }

  function performSearch(query) {
    const q = query.trim().toLowerCase();
    if (!q) {
      els.searchResults.hidden = true;
      els.searchResults.innerHTML = "";
      return;
    }
    const terms = q.split(/\s+/).filter(Boolean);
    const results = searchIndex
      .map((item) => {
        const hay = `${item.title} ${item.subtitle} ${item.text}`.toLowerCase();
        const matched = terms.filter((term) => hay.includes(term));
        let score = matched.length;
        if (item.title.toLowerCase().includes(q)) score += 4;
        if (item.subtitle.toLowerCase().includes(q)) score += 2;
        const firstIndex = Math.max(0, hay.indexOf(terms[0] || q));
        const start = Math.max(0, firstIndex - 75);
        const snippet = item.text.slice(start, start + 190);
        return { ...item, score, snippet };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);

    els.searchResults.innerHTML = results.length
      ? results.map((item) => `<button class="search-result" type="button" data-route="${item.id}"><strong>${content.esc(item.title)}</strong><span>…${content.esc(item.snippet)}…</span></button>`).join("")
      : `<div class="empty-state">No matching module found.</div>`;
    els.searchResults.hidden = false;
  }

  function setupPageInteractions() {
    setupTriageTool();
    setupMonitorTool();
    setupAfScore();
    setupWpwTool();
    setupArrestPathway();
    setupCprMetronome();
    setupFlashcards();
    setupQuiz();
  }

  function setupTriageTool() {
    const run = document.getElementById("run-triage");
    if (!run) return;
    const result = document.getElementById("triage-result");
    run.addEventListener("click", () => {
      const pulse = document.getElementById("triage-pulse").value;
      const stability = document.getElementById("triage-stability").value;
      const rate = document.getElementById("triage-rate").value;
      const qrs = document.getElementById("triage-qrs").value;
      const regularity = document.getElementById("triage-regularity").value;
      const atrial = document.getElementById("triage-atrial").value;
      let category = "Undifferentiated rhythm";
      let action = "Obtain a 12-lead ECG, assess reversible causes, and correlate with symptoms.";
      let warning = "Do not treat the monitor alone; confirm the clinical state.";

      if (pulse === "absent") {
        category = "Cardiac arrest";
        action = "Start high-quality CPR immediately and identify whether the rhythm is shockable (VF/pulseless VT) or non-shockable (PEA/asystole).";
        warning = "Defibrillate VF/pVT; do not shock PEA/asystole unless the rhythm changes.";
      } else if (rate === "slow") {
        category = atrial === "dissociation" ? "High-grade or complete AV block is likely" : "Bradyarrhythmia";
        action = stability === "unstable" ? "Support ABCs, treat reversible causes, and prepare pacing; atropine may be attempted but can fail in distal block." : "Document the rhythm, review drugs and reversible causes, and correlate symptoms with bradycardia.";
        warning = atrial === "dissociation" ? "Do not rely on atropine alone in an unstable distal escape rhythm." : "Count atrial and ventricular rates separately.";
      } else if (stability === "unstable") {
        if (qrs === "wide" && regularity === "irregular") {
          category = "Unstable irregular wide-complex tachycardia";
          action = "Urgent electrical therapy is required; polymorphic rhythms may require unsynchronized defibrillation because reliable synchronization is impossible.";
          warning = "Consider pre-excited AF or polymorphic VT; avoid reflex AV-nodal blockade.";
        } else {
          category = "Unstable organized tachyarrhythmia with a pulse";
          action = "Perform synchronized cardioversion without delaying for prolonged diagnostic analysis.";
          warning = "Sedate if feasible, but do not delay treatment.";
        }
      } else if (rate === "fast" && qrs === "narrow" && regularity === "regular") {
        category = atrial === "p" ? "Sinus tachycardia or focal atrial tachycardia" : "Regular narrow-complex SVT";
        action = atrial === "p" ? "Search for a physiological cause and assess P-wave morphology and onset pattern." : "Obtain a 12-lead ECG; consider modified Valsalva and adenosine when AV-node-dependent SVT is likely and no contraindication exists.";
        warning = "A rate close to 150/min can represent atrial flutter with 2:1 conduction.";
      } else if (rate === "fast" && qrs === "narrow" && regularity === "irregular") {
        category = atrial === "flutter" ? "Atrial flutter with variable block" : "AF, flutter with variable block, or multifocal atrial tachycardia";
        action = "Confirm atrial activity, assess stroke risk and ventricular function, and choose rate/rhythm management according to the clinical context.";
        warning = "Hemodynamic deterioration changes the priority to synchronized cardioversion.";
      } else if (rate === "fast" && qrs === "wide" && regularity === "regular") {
        category = "Ventricular tachycardia until proved otherwise";
        action = "Monitor continuously, obtain IV access and a 12-lead ECG, correct causes, and keep the defibrillator ready; use expert stable-WCT therapy.";
        warning = "Avoid verapamil in undifferentiated wide-complex tachycardia.";
      } else if (rate === "fast" && qrs === "wide" && regularity === "irregular") {
        category = "Irregular wide-complex tachycardia";
        action = "Consider pre-excited AF, polymorphic VT, AF with aberrancy, or frequent ectopy; obtain urgent expert rhythm management.";
        warning = "Avoid AV-nodal blockers when pre-excited AF is possible.";
      } else if (atrial === "dissociation") {
        category = "AV dissociation";
        action = "Differentiate ventricular tachycardia from complete AV block using the rate, QRS morphology, and clinical state.";
        warning = "Independent P waves can be seen in both VT and complete heart block.";
      }

      result.innerHTML = `<h4 class="result-title">${category}</h4><p>${action}</p><div class="callout warning"><strong>Safety note:</strong> ${warning}</div><div class="result-grid"><div class="result-box"><span>Rate</span><strong>${rate}</strong></div><div class="result-box"><span>QRS</span><strong>${qrs}</strong></div><div class="result-box"><span>Regularity</span><strong>${regularity}</strong></div></div>`;
    });
    document.getElementById("reset-triage")?.addEventListener("click", () => {
      ["triage-pulse", "triage-stability", "triage-rate", "triage-qrs", "triage-regularity", "triage-atrial"].forEach((id) => document.getElementById(id).selectedIndex = 0);
      result.innerHTML = "";
    });
  }

  function setupMonitorTool() {
    const run = document.getElementById("run-monitor");
    if (!run) return;
    run.addEventListener("click", () => {
      const frequency = document.getElementById("monitor-frequency").value;
      const risk = document.getElementById("monitor-risk").value;
      const map = {
        continuous: ["Telemetry / monitored setting", "Best when symptoms or instability are occurring now, especially in an inpatient or emergency setting."],
        daily: ["24–48 hour Holter monitor", "Useful when symptoms occur most days and a continuous short recording is likely to capture them."],
        weekly: ["Extended patch monitor", "A 7–14 day patch increases capture for intermittent weekly symptoms."],
        monthly: ["External event recorder or mobile telemetry", "Longer monitoring allows patient-triggered or automatically detected rhythm capture."],
        rare: ["Implantable loop recorder may be considered", "Useful for rare unexplained events, especially syncope, when shorter monitoring is unlikely to capture an episode."]
      };
      const [title, body] = map[frequency];
      const add = risk === "high" ? " High-risk syncope or structural disease may justify faster specialist evaluation and a more intensive strategy than symptom frequency alone suggests." : "";
      document.getElementById("monitor-result").innerHTML = `<h4 class="result-title">${title}</h4><p>${body}${add}</p>`;
    });
  }

  function setupAfScore() {
    const checkboxes = [...document.querySelectorAll("[data-af-points]")];
    if (!checkboxes.length) return;
    const update = (changed) => {
      if (changed?.dataset.ageGroup === "older" && changed.checked) document.querySelector('[data-age-group="younger"]').checked = false;
      if (changed?.dataset.ageGroup === "younger" && changed.checked) document.querySelector('[data-age-group="older"]').checked = false;
      const score = checkboxes.reduce((sum, item) => sum + (item.checked ? Number(item.dataset.afPoints) : 0), 0);
      document.getElementById("af-score-number").textContent = score;
      let title;
      let text;
      if (score === 0) {
        title = "Low score";
        text = "Oral anticoagulation is generally not indicated solely for AF stroke prevention. Reassess dynamically as risk factors change.";
      } else if (score === 1) {
        title = "Anticoagulation should be considered";
        text = "The 2024 ESC framework recommends individualized assessment, shared decision-making, and review of modifiable bleeding factors.";
      } else {
        title = "Anticoagulation is recommended";
        text = "A DOAC is generally preferred, except with a mechanical heart valve, moderate-to-severe mitral stenosis, or another specific contraindication.";
      }
      document.getElementById("af-score-title").textContent = title;
      document.getElementById("af-score-text").textContent = text;
    };
    checkboxes.forEach((item) => item.addEventListener("change", () => update(item)));
  }

  function setupWpwTool() {
    const result = document.getElementById("wpw-result");
    if (!result) return;
    const map = {
      "regular-narrow": ["Possible orthodromic AVRT", "The circuit usually conducts antegrade through the AV node and returns through the accessory pathway. In a stable regular narrow rhythm, vagal manoeuvres and adenosine may be appropriate after assessment."],
      "regular-wide": ["Antidromic AVRT or VT", "Treat as an undifferentiated wide-complex tachycardia. VT must remain the safety assumption until expert evaluation establishes another diagnosis."],
      "irregular-wide": ["Pre-excited AF until proved otherwise", "This is a high-risk pattern. Avoid AV-nodal blockers; use urgent cardioversion if unstable and specialist-directed pathway-safe therapy if stable."],
      resting: ["Ventricular pre-excitation", "A short PR, delta wave, and widened QRS suggest an accessory pathway. WPW syndrome requires symptomatic tachyarrhythmia, not the ECG pattern alone."]
    };
    document.querySelectorAll("[data-wpw]").forEach((button) => button.addEventListener("click", () => {
      const [title, body] = map[button.dataset.wpw];
      result.innerHTML = `<h4 class="result-title">${title}</h4><p>${body}</p>`;
    }));
  }

  function setupArrestPathway() {
    const output = document.getElementById("arrest-pathway-output");
    if (!output) return;
    document.querySelectorAll("[data-arrest-pathway]").forEach((button) => button.addEventListener("click", () => {
      const shockable = button.dataset.arrestPathway === "shockable";
      const steps = shockable ? [
        ["Defibrillate", "Deliver a shock promptly using the device/manufacturer energy recommendation."],
        ["Resume CPR", "Immediately continue high-quality CPR for 2 minutes; do not pause for a routine pulse check."],
        ["Reassess rhythm", "If still VF/pVT, shock again and continue the cycle while obtaining IV/IO access."],
        ["Medication sequence", "Give epinephrine after initial shocks according to protocol; consider amiodarone or lidocaine for refractory VF/pVT."],
        ["Throughout", "Optimize CPR, use capnography when an advanced airway is placed, and treat the Hs and Ts."]
      ] : [
        ["Start CPR", "Begin high-quality CPR immediately."],
        ["Give epinephrine early", "Administer as soon as feasible and repeat every 3–5 minutes according to protocol."],
        ["Reassess rhythm", "Check every 2 minutes; shock only if the rhythm becomes VF/pVT."],
        ["Do not use routine atropine", "Atropine is not part of routine PEA/asystole treatment."],
        ["Find the cause", "Aggressively identify and treat the Hs and Ts while maintaining CPR quality."]
      ];
      output.innerHTML = `<div class="timeline">${steps.map(([title, text], index) => `<div class="timeline-item" data-step="${index + 1}"><strong>${title}</strong><p>${text}</p></div>`).join("")}</div>`;
    }));
  }

  function setupCprMetronome() {
    const start = document.getElementById("start-metronome");
    if (!start) return;
    const slider = document.getElementById("cpr-rate");
    const label = document.getElementById("cpr-rate-label");
    slider.addEventListener("input", () => {
      label.textContent = slider.value;
      if (state.metronomeTimer) startMetronome();
    });
    start.addEventListener("click", startMetronome);
    document.getElementById("stop-metronome")?.addEventListener("click", stopMetronome);
  }

  function startMetronome() {
    stopMetronome();
    const slider = document.getElementById("cpr-rate");
    const metro = document.getElementById("metronome");
    if (!slider || !metro) return;
    const rate = Number(slider.value) || 110;
    const interval = 60000 / rate;
    metro.style.setProperty("--beat-duration", `${interval / 1000}s`);
    metro.classList.add("is-running");
    tickMetronome();
    state.metronomeTimer = setInterval(tickMetronome, interval);
  }

  function tickMetronome() {
    const sound = document.getElementById("metronome-sound")?.checked;
    if (!sound) return;
    try {
      state.metronomeAudioContext ||= new (window.AudioContext || window.webkitAudioContext)();
      const ctx = state.metronomeAudioContext;
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.frequency.value = 760;
      gain.gain.setValueAtTime(0.07, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.055);
      oscillator.connect(gain).connect(ctx.destination);
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.06);
    } catch { /* Audio may be blocked */ }
  }

  function stopMetronome() {
    if (state.metronomeTimer) clearInterval(state.metronomeTimer);
    state.metronomeTimer = null;
    document.getElementById("metronome")?.classList.remove("is-running");
  }

  function setupFlashcards() {
    document.querySelectorAll(".flashcard").forEach((card) => card.addEventListener("click", () => {
      const flipped = card.classList.toggle("is-flipped");
      card.setAttribute("aria-pressed", String(flipped));
    }));
  }

  function setupQuiz() {
    if (!document.getElementById("quiz-container")) return;
    renderQuizQuestion();
    document.getElementById("quiz-next")?.addEventListener("click", () => {
      state.quiz.index = Math.min(content.quizQuestions.length - 1, state.quiz.index + 1);
      renderQuizQuestion();
    });
    document.getElementById("quiz-prev")?.addEventListener("click", () => {
      state.quiz.index = Math.max(0, state.quiz.index - 1);
      renderQuizQuestion();
    });
    document.getElementById("quiz-restart")?.addEventListener("click", () => {
      state.quiz = { index: 0, score: 0, answers: {} };
      renderQuizQuestion();
    });
  }

  function renderQuizQuestion() {
    const container = document.getElementById("quiz-container");
    if (!container) return;
    const question = content.quizQuestions[state.quiz.index];
    const chosen = state.quiz.answers[state.quiz.index];
    container.innerHTML = `<article class="quiz-question"><h3>${state.quiz.index + 1}. ${question.q}</h3><div class="quiz-options">${question.options.map((option, index) => {
      let cls = "quiz-option";
      if (chosen !== undefined) {
        if (index === question.answer) cls += " is-correct";
        else if (index === chosen) cls += " is-wrong";
      }
      return `<button class="${cls}" type="button" data-quiz-option="${index}" ${chosen !== undefined ? "disabled" : ""}>${String.fromCharCode(65 + index)}. ${option}</button>`;
    }).join("")}</div>${chosen !== undefined ? `<div class="quiz-explanation"><strong>${chosen === question.answer ? "Correct." : "Not quite."}</strong> ${question.explanation}</div>` : ""}</article>`;
    document.getElementById("quiz-position").textContent = `Question ${state.quiz.index + 1} of ${content.quizQuestions.length}`;
    document.getElementById("quiz-score").textContent = `Score: ${state.quiz.score}`;
    document.getElementById("quiz-prev").disabled = state.quiz.index === 0;
    document.getElementById("quiz-next").disabled = state.quiz.index === content.quizQuestions.length - 1;
    container.querySelectorAll("[data-quiz-option]").forEach((button) => button.addEventListener("click", () => {
      const choice = Number(button.dataset.quizOption);
      state.quiz.answers[state.quiz.index] = choice;
      if (choice === question.answer) state.quiz.score += 1;
      renderQuizQuestion();
    }));
  }

  document.addEventListener("click", (event) => {
    const routeTarget = event.target.closest("[data-route]");
    if (!routeTarget) return;
    event.preventDefault();
    if (routeTarget.matches(".search-result") || routeTarget.closest(".search-results")) {
      els.search.value = "";
      els.searchResults.hidden = true;
    }
    navigate(routeTarget.dataset.route);
  });

  els.menu.addEventListener("click", openSidebar);
  els.closeSidebar.addEventListener("click", closeSidebar);
  els.scrim.addEventListener("click", closeSidebar);
  window.addEventListener("hashchange", () => render(normalizedRoute()));
  window.addEventListener("resize", () => { if (window.innerWidth > 980) closeSidebar(); });

  els.resetProgress.addEventListener("click", () => {
    state.visited = [state.route];
    writeJson(STORAGE.visited, state.visited);
    updateProgress();
    updateNav();
    showToast("Progress reset");
  });
  els.clearBookmarks.addEventListener("click", () => {
    state.bookmarks = [];
    writeJson(STORAGE.bookmarks, []);
    render(state.route);
    showToast("Bookmarks cleared");
  });
  els.bookmarksButton.addEventListener("click", showBookmarks);
  els.closeBookmarks.addEventListener("click", () => els.bookmarkDialog.close());
  els.bookmarkList.addEventListener("click", (event) => {
    const remove = event.target.closest("[data-remove-bookmark]");
    if (remove) {
      removeBookmark(remove.dataset.removeBookmark);
      return;
    }
    const open = event.target.closest("[data-bookmark-route]");
    if (open) {
      els.bookmarkDialog.close();
      navigate(open.dataset.bookmarkRoute);
      showToast(`Opened ${open.dataset.bookmarkTitle}`);
    }
  });

  els.search.addEventListener("input", () => performSearch(els.search.value));
  els.search.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      els.search.value = "";
      els.searchResults.hidden = true;
      els.search.blur();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && !/input|textarea|select/i.test(document.activeElement?.tagName || "")) {
      event.preventDefault();
      els.search.focus();
    }
    if (event.key === "Escape") {
      closeSidebar();
      els.searchResults.hidden = true;
      if (els.bookmarkDialog.open) els.bookmarkDialog.close();
    }
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".search-box, .search-results")) els.searchResults.hidden = true;
  });

  els.stopSpeech.addEventListener("click", stopSpeech);
  els.print.addEventListener("click", () => window.print());

  buildNav();
  selectVoice();
  if ("speechSynthesis" in window) speechSynthesis.onvoiceschanged = selectVoice;
  render(normalizedRoute());
})();
