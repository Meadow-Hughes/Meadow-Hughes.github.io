// ── ARE.NA MOODBOARD ─────────────────────────
const ARENA_CHANNEL = 'my-website-l84irvo2sso';

async function fetchArena() {
  const grid = document.getElementById('arena-grid');
  try {
    const res = await fetch(`https://api.are.na/v2/channels/${ARENA_CHANNEL}/contents?per=24`);
    const data = await res.json();
    const blocks = data.contents;

    // filter to image blocks only
    const images = blocks.filter(b => b.class === 'Image' && b.image);

    if (!images.length) {
      grid.innerHTML = '<p class="moodboard-empty">no images yet — add some on are.na to see them here</p>';
      return;
    }

    grid.innerHTML = '';
    images.forEach(block => {
      const src = block.image.display?.url || block.image.original?.url;
      if (!src) return;

      const item = document.createElement('a');
      item.className = 'moodboard-item';
      item.href = `https://www.are.na/block/${block.id}`;
      item.target = '_blank';
      item.rel = 'noopener';

      const img = document.createElement('img');
      img.src = src;
      img.alt = block.title || '';
      img.loading = 'lazy';

      item.appendChild(img);
      grid.appendChild(item);
    });

  } catch (e) {
    grid.innerHTML = '<p class="moodboard-empty">couldn\'t load the moodboard right now</p>';
  }
}

fetchArena();
