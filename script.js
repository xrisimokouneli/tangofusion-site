
(function(){
  function qs(id){ return document.getElementById(id); }
  function esc(s){ return String(s||''); }

  fetch('content.json?_=' + Date.now())
    .then(r => r.json())
    .then(data => {
      const brand = esc(data.brand);
      document.title = brand + ' — Tango';
      qs('brand-name').textContent = brand;
      qs('footer-brand').textContent = brand;
      qs('logo').src = esc(data.images && data.images.logo || 'assets/logo.png');

      // Cover background image
      const cover = qs('cover-bg');
      const coverUrl = esc(data.images && data.images.cover || 'assets/cover.jpg');
      cover.style.backgroundImage = 'linear-gradient(180deg,rgba(0,0,0,.10) 0%,rgba(0,0,0,.45) 60%,rgba(8,10,11,.85) 100%), url(\"' + coverUrl + '\")';

      // Hero texts
      qs('hero-title').textContent = esc(data.hero && data.hero.title || brand);
      qs('hero-sub').textContent = esc(data.hero && data.hero.subtitle || '');

      // Chips
      const chips = (data.hero && data.hero.chips) || [];
      const chipsWrap = qs('chips');
      chipsWrap.innerHTML = '';
      chips.forEach(txt => {
        const s = document.createElement('span');
        s.className = 'chip';
        s.textContent = esc(txt);
        chipsWrap.appendChild(s);
      });

      // Hero couple image
      qs('hero-couple').src = esc(data.images && data.images.couple || 'assets/couple.png');

      // About
      qs('about-title').textContent = esc(data.about && data.about.title || '');
      qs('about-p1').textContent = esc(data.about && data.about.p1 || '');
      qs('about-p2').textContent = esc(data.about && data.about.p2 || '');
      qs('about-p3').textContent = esc(data.about && data.about.p3 || '');

      // CTA links
      const phone = esc(data.cta && data.cta.phone || '');
      const email = esc(data.cta && data.cta.email || '');
      const address = esc(data.cta && data.cta.address || '');

      function telLink(p){ return 'tel:' + p.replace(/\s+/g,''); }
      function smsLink(p){ return 'sms:' + p.replace(/\s+/g,''); }
      function mailtoLink(e){ return 'mailto:' + e; }
      function mapLink(b, a){ return 'https://maps.google.com/?q=' + encodeURIComponent((b||'') + ' ' + (a||'')); }

      // Fill visible texts
      qs('phone-text').textContent = phone;
      qs('phone-text-2').textContent = phone;
      qs('email-text').textContent = email;

      // Anchor hrefs
      qs('btn-call-top').href = telLink(phone);
      qs('link-phone').href = telLink(phone);
      qs('link-sms').href = smsLink(phone);
      qs('link-email').href = mailtoLink(email);
      const maps = mapLink(brand, address);
      qs('link-maps').href = maps;
      qs('ab-maps').href = maps;
      qs('ab-call').href = telLink(phone);
      qs('ab-sms').href = smsLink(phone);

      // Random tagline (no immediate repeat in same tab)
      const phrases = Array.isArray(data.taglines) ? data.taglines.slice() : [];
      const el = qs('tagline');
      if (el && phrases.length) {
        const last = parseInt(sessionStorage.getItem('lastTaglineIndex') || '-1', 10);
        let i = 0;
        if (phrases.length > 1){
          do { i = Math.floor(Math.random()*phrases.length); } while(i === last);
        }
        el.textContent = phrases[i];
        sessionStorage.setItem('lastTaglineIndex', String(i));
      }
    })
    .catch(err => {
      console.error('content.json load error', err);
    });
})();
