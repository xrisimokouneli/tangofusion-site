
(function(){
// Simple sanitizer: allow only STRONG/B/EM/I/BR/A with href
      function sanitizeLimitedHTML(input){
        input = String(input || '');
        const allowed = new Set(['STRONG','B','EM','I','BR','A']);
        const wrap = document.createElement('div');
        wrap.innerHTML = input;

        function render(node){
          if(node.nodeType === Node.TEXT_NODE){
            return node.nodeValue;
          }
          if(node.nodeType === Node.ELEMENT_NODE){
            const tag = node.nodeName;
            const children = Array.from(node.childNodes).map(render).join('');
            if(!allowed.has(tag)){
              return children; // strip tag, keep children
            }
            if(tag === 'BR'){
              return '<br>';
            }
            if(tag === 'A'){
              const href = node.getAttribute('href') || '#';
              const safeHref = href.replace(/"/g,'&quot;');
              return '<a href="' + safeHref + '">' + children + '</a>';
            }
            const t = tag.toLowerCase();
            return '<' + t + '>' + children + '</' + t + '>';
          }
          return '';
        }
        return Array.from(wrap.childNodes).map(render).join('');
      }

  function qs(id){ return document.getElementById(id); }
  function esc(s){ return String(s||''); }

  fetch('content.json?_=' + Date.now())
    .then(r => r.json())
    .then(data => {

      // FORM labels/text from JSON
      const formCfg = data.form || {};
      const fields = (formCfg.fields || {});
      const EN = (sel, val) => { const el=document.querySelector(sel); if(el && val!=null){ el.textContent = val; } };
      EN('#form-title', formCfg.title);
      EN('#form-subtitle', formCfg.subtitle);
      EN('#label-name', fields.name_label);
      EN('#label-email', fields.email_label);
      EN('#label-phone', fields.phone_label);
      EN('#label-message', fields.message_label);
      EN('#label-consent', fields.consent_label);
      EN('#f-submit', fields.submit_label);
      EN('#form-success', formCfg.success);

      // Progressive enhancement: AJAX submit for Netlify Forms
      const form = document.getElementById('nf');
      if (form){
        function encodeForm(f){
          const fd = new FormData(f);
          return new URLSearchParams(fd).toString();
        }
        form.addEventListener('submit', function(e){
          e.preventDefault();
          const btn = document.getElementById('f-submit');
          const ok = document.getElementById('form-success');
          const err = document.getElementById('form-error');
          ok.style.display = 'none'; err.style.display = 'none';
          btn.disabled = true;
          fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'form-name=' + encodeURIComponent(form.getAttribute('name')) + '&' + encodeForm(form)
          }).then(()=>{
            ok.style.display = 'inline';
            form.reset();
          }).catch(()=>{
            err.style.display = 'inline';
          }).finally(()=>{
            btn.disabled = false;
          });
        });
      }

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
      var heroLead = (data.hero && data.hero.lead) || '';
      var hl = document.getElementById('hero-lead'); if(hl){ hl.innerHTML = sanitizeLimitedHTML(heroLead); }

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
      qs('about-p1').innerHTML = sanitizeLimitedHTML(data.about && data.about.p1 || '');
      qs('about-p2').innerHTML = sanitizeLimitedHTML(data.about && data.about.p2 || '');
      qs('about-p3').innerHTML = sanitizeLimitedHTML(data.about && data.about.p3 || '');

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


      // GALLERY
      const gwrap = document.getElementById('gallery-grid');
      if (gwrap){
        const gallery = Array.isArray(data.gallery) ? data.gallery : [];
        gwrap.innerHTML = '';
        gallery.forEach(item => {
          const img = document.createElement('img');
          img.loading = 'lazy';
          img.src = esc(item.src || '');
          img.alt = esc(item.alt || '');
          const a = document.createElement('a');
          a.href = img.src;
          a.target = '_blank';
          a.appendChild(img);
          gwrap.appendChild(a);
        });
      }

      // VIDEOS
      const vwrap = document.getElementById('video-grid');
      function youTubeId(u){
        if(!u) return '';
        try{
          const url = new URL(u);
          if(url.hostname.includes('youtu.be')) return url.pathname.slice(1);
          if(url.searchParams.get('v')) return url.searchParams.get('v');
          const parts = url.pathname.split('/');
          const i = parts.indexOf('embed');
          if(i >= 0 && parts[i+1]) return parts[i+1];
        }catch(e){
          // fallback: if looks like raw id
          if(/^[A-Za-z0-9_\-]{10,}$/.test(u)) return u;
        }
        return '';
      }
      if (vwrap){
        const vids = Array.isArray(data.videos) ? data.videos : [];
        vwrap.innerHTML = '';
        vids.forEach(v => {
          const id = youTubeId(v.url || '');
          if(!id) return;
          const card = document.createElement('div');
          const title = document.createElement('div');
          title.className = 'video-title';
          title.textContent = esc(v.title || '');
          const box = document.createElement('div');
          box.className = 'embed';
          const iframe = document.createElement('iframe');
          iframe.loading = 'lazy';
          iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
          iframe.referrerPolicy = 'strict-origin-when-cross-origin';
          iframe.src = 'https://www.youtube.com/embed/' + id;
          box.appendChild(iframe);
          card.appendChild(box);
          if(v.title) card.appendChild(title);
          vwrap.appendChild(card);
        });
      }

    })
    .catch(err => {
      console.error('content.json load error', err);
    });
})();
