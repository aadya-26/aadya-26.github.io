// Build-time restructuring of project markdown into a scroll story.
// Runs at build, so the page is complete without JavaScript.
// - first image becomes the hero figure
// - images become <figure> with real width/height (no layout shift) and lazy loading
// - runs of consecutive images become a .gallery
// - h2 sections become numbered .chapter sections
// - third-party video iframes become click-to-load (no request until asked)
import fs from 'node:fs';
import path from 'node:path';

function jpegSize(file) {
  try {
    const b = fs.readFileSync(file);
    if (b[0] === 0x89 && b[1] === 0x50) return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) }; // png
    let i = 2;
    while (i < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const m = b[i + 1];
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) {
        return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
      }
      i += 2 + b.readUInt16BE(i + 2);
    }
  } catch {}
  return null;
}

const el = (tagName, properties, children = []) => ({ type: 'element', tagName, properties, children });
const text = (value) => ({ type: 'text', value });
const isWs = (n) => n.type === 'text' && !n.value.trim();
const isTag = (n, t) => n.type === 'element' && n.tagName === t;

function soleImage(p) {
  if (!isTag(p, 'p')) return null;
  const kids = p.children.filter((c) => !isWs(c));
  return kids.length === 1 && isTag(kids[0], 'img') ? kids[0] : null;
}

const esc = (v) => String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function facadeHtml(src, title) {
  const id = (src.match(/embed\/([\w-]+)/) || [])[1];
  const watch = id ? `https://www.youtube.com/watch?v=${id}` : src;
  return (
    `<div class="embed-facade" data-src="${esc(src)}" data-title="${esc(title)}">` +
    `<p class="embed-title">${esc(title)}</p>` +
    `<button type="button" class="embed-load" hidden>Load video</button>` +
    `<a class="embed-link" href="${esc(watch)}" rel="noopener">Watch on YouTube</a>` +
    `<p class="embed-note">Loading the video connects to YouTube.</p></div>`
  );
}

// Raw HTML in markdown arrives as raw nodes. Swap third-party video iframes for a facade.
function facadeIframes(node) {
  if (!node.children) return;
  for (const c of node.children) {
    if (c.type === 'raw' && /<iframe/i.test(c.value)) {
      c.value = c.value.replace(/<iframe\b([^>]*)>\s*<\/iframe>/gi, (m, attrs) => {
        const src = (attrs.match(/src="([^"]+)"/) || [])[1] || '';
        if (!/youtube|youtu\.be|vimeo/.test(src)) return m;
        const title = (attrs.match(/title="([^"]+)"/) || [])[1] || 'Video';
        return facadeHtml(src, title);
      });
    } else facadeIframes(c);
  }
}

export default function rehypeStory() {
  return (tree) => {
    facadeIframes(tree);

    // 1. images -> figures
    let figN = 0;
    let first = true;
    const flat = [];
    for (const node of tree.children) {
      const img = soleImage(node);
      if (!img) { flat.push(node); if (!isWs(node)) first = false; continue; }
      const src = String(img.properties.src || '');
      const size = src.startsWith('/') ? jpegSize(path.join(process.cwd(), 'public', src)) : null;
      const cls = ['fig'];
      if (size) {
        img.properties.width = size.w;
        img.properties.height = size.h;
        const r = size.w / size.h;
        if (r >= 2.6) cls.push('strip');
        else if (r < 0.9) cls.push('portrait');
        if (size.w < 900) cls.push('small');
      }
      img.properties.decoding = 'async';
      const style = size ? `--w:${size.w};--r:${(size.w / size.h).toFixed(4)}` : undefined;
      if (first) {
        first = false;
        img.properties.fetchpriority = 'high';
        flat.push(el('figure', { className: [...cls, 'hero'], style }, [el('div', { className: ['fig-frame'] }, [img])]));
        continue;
      }
      img.properties.loading = 'lazy';
      figN++;
      const frameProps = { className: ['fig-frame'] };
      if (cls.includes('strip')) {
        // wide process strips scroll sideways on small screens; keyboard reachable
        frameProps.tabIndex = 0;
        frameProps.role = 'group';
        frameProps['aria-label'] = 'Wide image, scroll sideways to see all of it';
      }
      flat.push(
        el('figure', { className: cls, style }, [
          el('div', frameProps, [img]),
          el('figcaption', { 'aria-hidden': 'true' }, [
            el('span', { className: ['fig-n'] }, [text('Fig. ' + String(figN).padStart(2, '0'))]),
            text(' ' + String(img.properties.alt || '')),
          ]),
        ])
      );
    }

    // 2. consecutive figures -> gallery
    const isFig = (n) => isTag(n, 'figure') && !n.properties.className.includes('hero');
    const grouped = [];
    for (let i = 0; i < flat.length; i++) {
      if (!isFig(flat[i])) { grouped.push(flat[i]); continue; }
      const run = [flat[i]];
      let j = i + 1;
      while (j < flat.length && (isWs(flat[j]) || isFig(flat[j]))) { if (isFig(flat[j])) run.push(flat[j]); j++; }
      if (run.length > 1) {
        grouped.push(el('div', { className: ['gallery'], 'data-count': run.length, style: `--count:${run.length}` }, run));
        i = j - 1;
      } else grouped.push(flat[i]);
    }

    // 3. h2 sections -> chapters
    const out = [];
    let intro = el('div', { className: ['intro'] }, []);
    let chapter = null;
    let n = 0;
    for (const node of grouped) {
      if (isTag(node, 'figure') && node.properties.className.includes('hero')) { out.push(node); continue; }
      if (isTag(node, 'h2')) {
        if (chapter) out.push(chapter);
        else if (intro.children.some((c) => !isWs(c))) out.push(intro);
        n++;
        chapter = el('section', { className: ['chapter'] }, [
          el('header', { className: ['chapter-head'] }, [
            el('span', { className: ['chapter-n'], 'aria-hidden': 'true' }, [text(String(n).padStart(2, '0'))]),
            node,
          ]),
          el('div', { className: ['chapter-body'] }, []),
        ]);
        continue;
      }
      (chapter ? chapter.children[1] : intro).children.push(node);
    }
    if (chapter) out.push(chapter);
    else if (intro.children.some((c) => !isWs(c))) out.push(intro);
    tree.children = out;
  };
}
