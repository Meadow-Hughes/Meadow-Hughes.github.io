const LASTFM_API_KEY = '4dcf196922253144fa4d2429d9d17ba3';
const LASTFM_USER = 'mondlichtbat';

async function fetchLastFm() {
  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USER}&api_key=${LASTFM_API_KEY}&limit=1&format=json`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const track = data.recenttracks.track[0];

    const isNowPlaying = track['@attr'] && track['@attr']['nowplaying'] === 'true';
    const title = track.name;
    const artist = track.artist['#text'];
    const album = track.album['#text'];
    const image = track.image[2]['#text'] || '';
    const url_track = track.url;

    const dot = document.getElementById('lfm-dot');
    const status = document.getElementById('lfm-status');
    const art = document.getElementById('lfm-art');
    const trackEl = document.getElementById('lfm-track');
    const artistEl = document.getElementById('lfm-artist');
    const albumEl = document.getElementById('lfm-album');
    const link = document.getElementById('lfm-link');

    if (isNowPlaying) {
      dot.classList.add('now-playing');
      status.textContent = 'listening now';
    } else {
      dot.classList.remove('now-playing');
      status.textContent = 'last played';
    }

    if (image) {
      art.src = image;
      art.style.display = 'block';
    }

    trackEl.textContent = title;
    artistEl.textContent = artist;
    albumEl.textContent = album;
    link.href = url_track;

  } catch (e) {
    document.getElementById('lfm-widget').innerHTML = '<p class="lfm-error">couldn\'t load music data</p>';
  }
}

fetchLastFm();
// refresh every 30 seconds
setInterval(fetchLastFm, 30000);
