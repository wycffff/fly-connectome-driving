// The 2:22 film on the home page. The YouTube player loads only after the viewer presses play
// (privacy-enhanced youtube-nocookie domain); until then a local poster is shown.
(function () {
  'use strict';
  const FILMS = {
    en: {id: '2fYEdznq5AE', poster: 'assets/film-en.jpg'},
    fi: {id: 'HIRzE9qd3pE', poster: 'assets/film-fi.jpg'},
  };
  const TEXT = {
    en: {length: 'Film · 2:22', open: 'Watch on YouTube', play: 'Play the film',
      note: 'The player loads from YouTube when you press play.'},
    fi: {length: 'Video · 2:22', open: 'Katso YouTubessa', play: 'Toista video',
      note: 'Soitin ladataan YouTubesta vasta, kun painat toistoa.'},
    zh: {length: '影片 · 2:22', open: '在 YouTube 观看', play: '播放影片',
      note: '英语旁白，播放时默认显示英文字幕。点击播放后才会从 YouTube 加载视频。'},
  };
  const page = window.STORY_LANGUAGE || 'en';
  const text = TEXT[page] || TEXT.en;
  let film = page === 'fi' ? 'fi' : 'en';

  const root = document.getElementById('film');
  if (!root) return;
  const frame = root.querySelector('.video-frame');
  const facade = document.getElementById('filmPlay');
  const poster = document.getElementById('filmPoster');
  const link = document.getElementById('filmLink');
  document.getElementById('filmLength').textContent = text.length;
  document.getElementById('filmNote').textContent = text.note;
  link.textContent = text.open;
  facade.setAttribute('aria-label', text.play);
  root.setAttribute('aria-label', text.length);

  function show(next) {
    film = next;
    poster.src = FILMS[film].poster;
    link.href = 'https://youtu.be/' + FILMS[film].id;
    root.querySelectorAll('[data-film]').forEach((b) => {
      b.classList.toggle('active', b.dataset.film === film);
      b.setAttribute('aria-pressed', String(b.dataset.film === film));
    });
    const player = frame.querySelector('iframe');
    if (player) { player.remove(); facade.hidden = false; }
  }

  function play() {
    const params = new URLSearchParams({autoplay: '1', rel: '0', playsinline: '1'});
    if (page === 'zh' && film === 'en') { params.set('cc_load_policy', '1'); params.set('cc_lang_pref', 'en'); }
    const player = document.createElement('iframe');
    player.src = 'https://www.youtube-nocookie.com/embed/' + FILMS[film].id + '?' + params;
    player.title = text.length;
    player.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    player.allowFullscreen = true;
    player.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.appendChild(player);
    facade.hidden = true;
  }

  facade.addEventListener('click', play);
  root.querySelectorAll('[data-film]').forEach((b) => b.addEventListener('click', () => show(b.dataset.film)));
  show(film);
})();
