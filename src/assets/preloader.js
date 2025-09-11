// Lightweight asset preloader (images, videos, generic fetch)
// Usage:
//   const cancel = preloadAssets({ images: ["/a.png"], videos: ["/b.mp4"] });
//   // call cancel() on unmount if needed

const inflightUrls = new Set();

export function preloadAssets(manifest = {}) {
  const imageUrls = Array.isArray(manifest.images) ? manifest.images : [];
  const videoUrls = Array.isArray(manifest.videos) ? manifest.videos : [];
  const otherUrls = Array.isArray(manifest.other) ? manifest.other : [];

  const disposers = [];

  // Images
  imageUrls.forEach((src) => {
    if (!src || inflightUrls.has(src)) return;
    inflightUrls.add(src);
    const img = new Image();
    img.decoding = "async";
    img.loading = "eager";
    img.src = src;
    const onDone = () => inflightUrls.delete(src);
    img.onload = onDone;
    img.onerror = onDone;
    disposers.push(() => {
      img.onload = null;
      img.onerror = null;
      // Prevent holding memory
      try { img.src = ""; } catch {}
    });
  });

  // Videos (metadata fetch to warm cache)
  videoUrls.forEach((src) => {
    if (!src || inflightUrls.has(src)) return;
    inflightUrls.add(src);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.src = src;
    const onDone = () => inflightUrls.delete(src);
    video.onloadedmetadata = onDone;
    video.onerror = onDone;
    // Kick off load
    try { video.load(); } catch {}
    disposers.push(() => {
      video.onloadedmetadata = null;
      video.onerror = null;
      // Detach src to release
      try { video.src = ""; video.removeAttribute("src"); video.load(); } catch {}
    });
  });

  // Generic fetch for other assets (CSS/JSON/etc.)
  otherUrls.forEach((url) => {
    if (!url || inflightUrls.has(url)) return;
    inflightUrls.add(url);
    const controller = new AbortController();
    fetch(url, { signal: controller.signal }).finally(() => {
      inflightUrls.delete(url);
    });
    disposers.push(() => controller.abort());
  });

  return () => {
    disposers.forEach((d) => {
      try { d(); } catch {}
    });
  };
}

export function preloadLinkHints(urls = []) {
  // Insert <link rel="preload" as="image|video|fetch"> hints into head
  const head = document.head || document.getElementsByTagName("head")[0];
  const nodes = [];
  urls.forEach((u) => {
    if (!u) return;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = guessAs(u);
    link.href = u;
    head.appendChild(link);
    nodes.push(link);
  });
  return () => nodes.forEach((n) => n && n.parentNode && n.parentNode.removeChild(n));
}

function guessAs(url) {
  const lower = String(url).toLowerCase();
  if (/(\.png|\.jpg|\.jpeg|\.gif|\.webp|\.svg)(\?|$)/.test(lower)) return "image";
  if (/(\.mp4|\.webm|\.ogg)(\?|$)/.test(lower)) return "video";
  if (/(\.css)(\?|$)/.test(lower)) return "style";
  if (/(\.js)(\?|$)/.test(lower)) return "script";
  return "fetch";
}

export function buildPreloadManifestForSlide(slideIndex, manifestBySlide) {
  if (!manifestBySlide || typeof manifestBySlide !== "object") return {};
  return manifestBySlide[slideIndex] || {};
}


