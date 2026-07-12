const LASTFM_API_KEY = '4dcf196922253144fa4d2429d9d17ba3';
const LASTFM_USER = 'mondlichtbat';
const LETTERBOXD_USER = 'mondlichtbat';

// ── CURRENT BOOK (edit this manually) ──────────────────────
const CURRENT_BOOK = {
  title: 'Madame Bovary',
  author: 'Gustave Flaubert',
  cover: 'https://cdn.thestorygraph.com/0d7tijj7z3c778pxfk5odnh01r48',
  link: 'https://app.thestorygraph.com/books/140dd356-e00e-4b79-85a3-fb8a6b4de1e2',
  status: 'currently reading' // or 'last read'
};

// ── LAST.FM ─────────────────────────────────────────────────
async function fetchLastFm() {
  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USER}&api_key=${LASTFM_API_KEY}&limit=1&format=json`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    const track = data.recenttracks.track[0];
    const isNowPlaying = track['@attr'] && track['@attr']['nowplaying'] === 'true';

    document.getElementById('lfm-dot').classList.toggle('now-playing', isNowPlaying);
    document.getElementById('lfm-status').textContent = isNowPlaying ? 'listening now' : 'last played';

    const img = document.getElementById('lfm-art');
    const src = track.image[2]['#text'];
    if (src) { img.src = src; img.style.display = 'block'; }

    document.getElementById('lfm-track').textContent = track.name;
    document.getElementById('lfm-artist').textContent = track.artist['#text'];
    document.getElementById('lfm-album').textContent = track.album['#text'];
    document.getElementById('lfm-link').href = track.url;
  } catch (e) {
    document.getElementById('lfm-widget').innerHTML = '<p class="media-error">couldn\'t load music data</p>';
  }
}

// ── LETTERBOXD RSS ──────────────────────────────────────────
async function fetchLetterboxd() {
  const rss = `https://api.rss2json.com/v1/api.json?rss_url=https://letterboxd.com/${LETTERBOXD_USER}/rss/`;
  try {
    const res = await fetch(rss);
    const data = await res.json();
    const item = data.items[0];

    // extract poster from description HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(item.description, 'text/html');
    const imgEl = doc.querySelector('img');
    const poster = imgEl ? imgEl.src : '';

    // extract star rating from title e.g. "The Substance - ★★★★"
    const titleRaw = item.title;
    const starMatch = titleRaw.match(/★+/);
    const stars = starMatch ? starMatch[0] : '';
    const filmTitle = titleRaw.replace(/\s*-\s*★+/, '').replace(/\s*-\s*½/, '').trim();

    const art = document.getElementById('lb-art');
    if (poster) { art.src = poster; art.style.display = 'block'; }

    document.getElementById('lb-title').textContent = filmTitle;
    document.getElementById('lb-stars').textContent = stars;
    document.getElementById('lb-link').href = item.link;

    // try to get year from description
    const yearMatch = item.description.match(/\b(19|20)\d{2}\b/);
    if (yearMatch) document.getElementById('lb-year').textContent = yearMatch[0];

  } catch (e) {
    document.getElementById('lb-widget').innerHTML = '<p class="media-error">couldn\'t load film data</p>';
  }
}

// ── READING (static) ────────────────────────────────────────
function renderBook() {
  document.getElementById('book-status').textContent = CURRENT_BOOK.status;
  document.getElementById('book-title').textContent = CURRENT_BOOK.title;
  document.getElementById('book-author').textContent = CURRENT_BOOK.author;

  const art = document.getElementById('book-art');
  if (CURRENT_BOOK.cover) { art.src = CURRENT_BOOK.cover; art.style.display = 'block'; }

  const link = document.getElementById('book-link');
  if (CURRENT_BOOK.link) { link.href = CURRENT_BOOK.link; }
  else { link.style.pointerEvents = 'none'; }
}

// ── INIT ─────────────────────────────────────────────────────
fetchLastFm();
fetchLetterboxd();
renderBook();
setInterval(fetchLastFm, 30000);
