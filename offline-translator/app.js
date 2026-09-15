// Offline English → Persian translator (PWA)
//
// Runs the model on-device via transformers.js. First run downloads the ONNX
// weights from the HuggingFace CDN and caches them in the browser's Cache
// Storage; every subsequent run is fully offline.
//
// UI language: Persian (right-to-left). All user-visible strings live here.

// jsdelivr serves the package's ESM entry when you point at the package root.
const CDN = "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2";

// Ordered by preference. First one that loads wins.
// - opus-mt-en-fa: small (~75MB int8), single-purpose, best quality for our pair
// - nllb-200-distilled-600M: fallback multilingual (~150MB int8), slower but robust
const MODEL_CANDIDATES = [
  { id: "Xenova/opus-mt-en-fa", kind: "opus", size_mb: 75 },
  { id: "Xenova/nllb-200-distilled-600M", kind: "nllb", size_mb: 150, srcLang: "eng_Latn", tgtLang: "pes_Arab" },
];

const $ = (id) => document.getElementById(id);
const el = {
  src: $("src"),
  dst: $("dst"),
  translate: $("translate-btn"),
  clear: $("clear-btn"),
  paste: $("paste-btn"),
  camera: $("camera-btn"),
  cameraInput: $("camera-input"),
  mic: $("mic-btn"),
  copy: $("copy-btn"),
  share: $("share-btn"),
  status: $("status"),
  statusText: $("status").querySelector(".status-text"),
  progress: $("progress"),
  progressTitle: $("progress-title"),
  progressPercent: $("progress-percent"),
  progressFill: $("progress-fill"),
  toast: $("toast"),
  download: $("download-btn"),
  about: $("about-btn"),
  aboutDialog: $("about-dialog"),
  aboutClose: $("about-close"),
};

// ---------- UI helpers ----------

function setStatus(state, text) {
  el.status.dataset.state = state;
  el.statusText.textContent = text;
}

let toastTimer = null;
function toast(msg, kind = "info") {
  el.toast.textContent = msg;
  el.toast.classList.toggle("error", kind === "error");
  el.toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.toast.classList.remove("show"), 2600);
}

function showProgress(title) {
  el.progressTitle.textContent = title;
  el.progressPercent.textContent = "0%";
  el.progressFill.style.width = "0%";
  el.progress.classList.remove("hidden");
}
function updateProgress(pct) {
  const clamped = Math.max(0, Math.min(100, Math.round(pct)));
  el.progressPercent.textContent = clamped + "%";
  el.progressFill.style.width = clamped + "%";
}
function hideProgress() {
  el.progress.classList.add("hidden");
}

// ---------- Translation engine ----------

let translator = null;         // active pipeline
let activeModel = null;        // config entry for active model
let loadingPromise = null;     // dedup concurrent load calls

async function loadTransformers() {
  if (window.__transformers) return window.__transformers;
  const mod = await import(/* @vite-ignore */ CDN);
  // transformers.js exposes named exports; env config lets us tune caching
  mod.env.allowLocalModels = false;
  mod.env.useBrowserCache = true;
  window.__transformers = mod;
  return mod;
}

async function ensureModel({ force = false } = {}) {
  if (translator && !force) return translator;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    setStatus("loading", "در حال آماده‌سازی موتور ترجمه…");
    let mod;
    try {
      mod = await loadTransformers();
    } catch (err) {
      setStatus("error", "بارگذاری کتابخانه ناموفق بود");
      throw err;
    }

    let lastErr = null;
    for (const cand of MODEL_CANDIDATES) {
      try {
        showProgress(`در حال دانلود مدل (${cand.size_mb}MB)…`);
        setStatus("loading", `دانلود مدل ${cand.id.split("/")[1]}`);

        const progressCallback = (data) => {
          // transformers.js emits {status, name, file, progress, loaded, total}
          if (data.status === "progress" && data.progress != null) {
            updateProgress(data.progress);
          } else if (data.status === "download") {
            el.progressTitle.textContent = `دانلود: ${data.file || "…"}`;
          } else if (data.status === "ready") {
            updateProgress(100);
          }
        };

        const t = await mod.pipeline("translation", cand.id, {
          quantized: true,
          progress_callback: progressCallback,
        });

        translator = t;
        activeModel = cand;
        hideProgress();
        setStatus("ready", "آمادهٔ استفاده (آفلاین)");
        return t;
      } catch (err) {
        console.warn(`Model ${cand.id} failed to load`, err);
        lastErr = err;
        // try next candidate
      }
    }

    hideProgress();
    setStatus("error", "بارگذاری مدل ناموفق بود");
    throw lastErr || new Error("No model could be loaded");
  })();

  try {
    return await loadingPromise;
  } finally {
    loadingPromise = null;
  }
}

// Break text into ~sentence-sized chunks so opus-mt (max 512 tokens) never
// truncates the output. Keeps paragraph breaks intact.
function chunkText(text, maxLen = 400) {
  const paragraphs = text.split(/\n{2,}/);
  const chunks = [];
  for (const p of paragraphs) {
    const sentences = p.replace(/\s+/g, " ").trim().split(/(?<=[.!?])\s+(?=[A-Z"'(\[])/);
    let buf = "";
    for (const s of sentences) {
      if ((buf + " " + s).length > maxLen && buf) {
        chunks.push(buf.trim());
        buf = s;
      } else {
        buf = (buf ? buf + " " : "") + s;
      }
    }
    if (buf) chunks.push(buf.trim());
    chunks.push("\n\n");
  }
  return chunks;
}

async function translate(text) {
  const t = await ensureModel();
  const chunks = chunkText(text);
  const out = [];
  for (const c of chunks) {
    if (c === "\n\n") { out.push("\n\n"); continue; }
    if (!c.trim()) continue;
    const opts = activeModel.kind === "nllb"
      ? { src_lang: activeModel.srcLang, tgt_lang: activeModel.tgtLang }
      : {};
    const res = await t(c, opts);
    const piece = Array.isArray(res) ? res[0]?.translation_text : res?.translation_text;
    out.push(piece || "");
  }
  return out.join(" ").replace(/\s*\n\n\s*/g, "\n\n").trim();
}

// ---------- Event wiring ----------

el.translate.addEventListener("click", async () => {
  const text = el.src.value.trim();
  if (!text) { toast("متنی برای ترجمه نداری"); return; }
  el.translate.dataset.loading = "true";
  el.translate.disabled = true;
  setStatus("translating", "در حال ترجمه…");
  el.dst.textContent = "";
  try {
    const result = await translate(text);
    el.dst.textContent = result;
    setStatus("ready", "آمادهٔ استفاده (آفلاین)");
  } catch (err) {
    console.error(err);
    toast("ترجمه ناموفق بود: " + (err.message || err), "error");
    setStatus("error", "خطا در ترجمه");
  } finally {
    el.translate.dataset.loading = "false";
    el.translate.disabled = false;
  }
});

el.clear.addEventListener("click", () => {
  el.src.value = "";
  el.dst.textContent = "";
  el.src.focus();
});

el.paste.addEventListener("click", async () => {
  try {
    const text = await navigator.clipboard.readText();
    if (text) {
      el.src.value = text;
      toast("چسبانده شد");
    } else {
      toast("کلیپ‌بورد خالی است");
    }
  } catch (err) {
    toast("اجازهٔ خواندن کلیپ‌بورد داده نشد", "error");
  }
});

el.copy.addEventListener("click", async () => {
  const text = el.dst.textContent.trim();
  if (!text) { toast("چیزی برای کپی نیست"); return; }
  try {
    await navigator.clipboard.writeText(text);
    toast("کپی شد");
  } catch {
    // fallback for older iOS
    const ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    document.execCommand("copy"); ta.remove();
    toast("کپی شد");
  }
});

el.share.addEventListener("click", async () => {
  const text = el.dst.textContent.trim();
  if (!text) { toast("چیزی برای اشتراک نیست"); return; }
  if (navigator.share) {
    try { await navigator.share({ text }); } catch {}
  } else {
    el.copy.click();
  }
});

// ---------- Camera / OCR ----------

el.camera.addEventListener("click", () => el.cameraInput.click());

el.cameraInput.addEventListener("change", async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  el.cameraInput.value = ""; // allow re-picking same file next time

  try {
    setStatus("loading", "در حال آماده‌سازی OCR…");
    showProgress("در حال بارگذاری موتور OCR (فقط بار اول)…");
    const Tesseract = await loadTesseract();
    setStatus("loading", "در حال خواندن متن از عکس…");
    el.progressTitle.textContent = "در حال تشخیص متن…";
    const { data: { text } } = await Tesseract.recognize(file, "eng", {
      logger: (m) => {
        if (m.status === "recognizing text" && m.progress != null) {
          updateProgress(m.progress * 100);
        } else if (m.status && m.progress != null) {
          el.progressTitle.textContent = m.status;
          updateProgress(m.progress * 100);
        }
      },
    });
    hideProgress();
    const clean = (text || "").replace(/\s+\n/g, "\n").trim();
    if (!clean) {
      toast("متنی پیدا نشد", "error");
      setStatus("ready", "آماده");
      return;
    }
    el.src.value = clean;
    setStatus("ready", "آماده");
    toast("متن استخراج شد — روی «ترجمه» بزن");
  } catch (err) {
    console.error(err);
    hideProgress();
    setStatus("error", "خطا در OCR");
    toast("خواندن عکس ناموفق بود", "error");
  }
});

let __tesseract = null;
async function loadTesseract() {
  if (__tesseract) return __tesseract;
  // Load Tesseract.js UMD via a script tag (module import from jsdelivr for
  // Tesseract has quirks around worker/wasm paths; UMD is more reliable).
  await new Promise((resolve, reject) => {
    if (window.Tesseract) return resolve();
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js";
    s.onload = resolve;
    s.onerror = () => reject(new Error("Failed to load Tesseract"));
    document.head.appendChild(s);
  });
  __tesseract = window.Tesseract;
  return __tesseract;
}

// ---------- Voice input (Web Speech API) ----------

let recognizer = null;
let listening = false;

function setupRecognizer() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return null;
  const r = new SR();
  r.lang = "en-US";
  r.continuous = false;
  r.interimResults = true;
  r.maxAlternatives = 1;
  return r;
}

el.mic.addEventListener("click", () => {
  if (!recognizer) recognizer = setupRecognizer();
  if (!recognizer) {
    toast("این مرورگر از تشخیص گفتار پشتیبانی نمی‌کند", "error");
    return;
  }
  if (listening) {
    try { recognizer.stop(); } catch {}
    return;
  }

  el.mic.classList.add("recording");
  listening = true;
  let final = "";

  recognizer.onresult = (event) => {
    let interim = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const res = event.results[i];
      if (res.isFinal) final += res[0].transcript + " ";
      else interim += res[0].transcript;
    }
    el.src.value = (final + interim).trim();
  };
  recognizer.onerror = (e) => {
    listening = false;
    el.mic.classList.remove("recording");
    if (e.error === "not-allowed" || e.error === "service-not-allowed") {
      toast("اجازهٔ دسترسی به میکروفون داده نشد", "error");
    } else if (e.error === "network") {
      toast("تشخیص گفتار به اینترنت نیاز دارد (روی iOS)", "error");
    } else {
      toast("خطای تشخیص گفتار: " + e.error, "error");
    }
  };
  recognizer.onend = () => {
    listening = false;
    el.mic.classList.remove("recording");
  };

  try {
    recognizer.start();
    toast("در حال شنیدن… (به انگلیسی حرف بزن)");
  } catch (err) {
    listening = false;
    el.mic.classList.remove("recording");
    toast("شروع تشخیص گفتار ناموفق بود", "error");
  }
});

// ---------- Model download button ----------

el.download.addEventListener("click", async () => {
  if (translator) { toast("مدل از قبل دانلود شده"); return; }
  try {
    await ensureModel();
    toast("مدل دانلود و آماده شد");
  } catch {
    toast("دانلود مدل ناموفق بود", "error");
  }
});

// ---------- About dialog ----------

el.about.addEventListener("click", () => el.aboutDialog.showModal());
el.aboutClose.addEventListener("click", () => el.aboutDialog.close());

// ---------- Enable translate button once user has typed something ----------

const refreshButtonState = () => {
  el.translate.disabled = el.src.value.trim().length === 0;
};
el.src.addEventListener("input", refreshButtonState);
refreshButtonState();

// ---------- Online / offline indicator ----------

function updateNetStatus() {
  if (!translator) return; // status is already saying "loading model"
  if (navigator.onLine) {
    setStatus("ready", "آمادهٔ استفاده (آنلاین)");
  } else {
    setStatus("ready", "آمادهٔ استفاده (آفلاین)");
  }
}
window.addEventListener("online",  updateNetStatus);
window.addEventListener("offline", updateNetStatus);

// ---------- Service worker registration ----------

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((err) => {
      console.warn("SW registration failed", err);
    });
  });
}

// ---------- Kick things off ----------
// Don't auto-load the model on first paint (it's 75MB). Wait for either the
// user's first translate or their explicit "download for offline" tap. On
// return visits the model is in Cache Storage, so ensureModel is fast.

setStatus("idle", "آماده — روی «ترجمه» بزن");

(async function warmIfCached() {
  // If the model is already in Cache Storage from a previous visit, warm it
  // up in the background so the first translate is instant.
  try {
    const caches_ = await caches.keys();
    const hasTransformersCache = caches_.some(k => k.includes("transformers") || k.includes("huggingface"));
    if (hasTransformersCache) {
      ensureModel().catch(() => {});
    }
  } catch {}
})();
