
// Load content from CMS JSON
fetch('./content.json?_=' + Date.now())
  .then(r => r.json())
  .then(c => {
    // Brand
    document.getElementById('brandName').textContent = c.brand || "TangoFusion";
    document.getElementById('brandName2').textContent = c.brand || "TangoFusion";

    // Images
    if (c.images){
      if (c.images.logo) document.getElementById('logoImg').src = c.images.logo;
      if (c.images.cover) document.getElementById('coverBg').style.backgroundImage =
        "linear-gradient(180deg,rgba(0,0,0,.10) 0%,rgba(0,0,0,.45) 60%,rgba(8,10,11,.85) 100%), url('" + c.images.cover + "')";
      if (c.images.couple) document.getElementById('coupleImg').src = c.images.couple;
    }

    // Hero texts
    document.getElementById('heroTitle').textContent = c.hero?.title || "TangoFusion";
    document.getElementById('heroSubtitle').textContent = c.hero?.subtitle || "";
    const chipsEl = document.getElementById('heroChips'); chipsEl.innerHTML='';
    (c.hero?.chips || []).forEach(t => {
      const s = document.createElement('span'); s.className='chip'; s.textContent=t; chipsEl.appendChild(s);
    });

    // Contact links
    const phone = c.cta?.phone || "";
    const phoneClean = phone.replace(/\s+/g,'');
    document.getElementById('phoneText').textContent = phone;
    document.getElementById('smsText').textContent = phone;
    document.getElementById('callBtn').href = 'tel:' + phoneClean;
    document.getElementById('phoneLink').href = 'tel:' + phoneClean;
    document.getElementById('smsLink').href = 'sms:' + phoneClean;
    document.getElementById('callBar').href = 'tel:' + phoneClean;
    document.getElementById('smsBar').href = 'sms:' + phoneClean;

    const email = c.cta?.email || "";
    document.getElementById('mailText').textContent = email;
    document.getElementById('mailLink').href = 'mailto:' + email;

    const addr = c.cta?.address || "";
    document.getElementById('addrText').textContent = addr;
    const mapQ = encodeURIComponent((c.brand||'') + ' ' + addr);
    document.getElementById('mapLink').href = 'https://maps.google.com/?q=' + mapQ;
    document.getElementById('mapBar').href = 'https://maps.google.com/?q=' + mapQ;

    // About
    document.getElementById('aboutTitle').textContent = c.about?.title || "";
    document.getElementById('aboutP1').textContent = c.about?.p1 || "";
    document.getElementById('aboutP2').textContent = c.about?.p2 || "";
    document.getElementById('aboutP3').textContent = c.about?.p3 || "";

    // Random tagline (no immediate repeat in this tab)
    const phrases = c.taglines || [];
    const el = document.getElementById('tagline');
    if (el && phrases.length){
      const last = parseInt(sessionStorage.getItem('lastTaglineIndex') || '-1', 10);
      let i;
      if (phrases.length === 1) i = 0;
      else { do { i = Math.floor(Math.random()*phrases.length); } while (i === last); }
      el.textContent = phrases[i];
      sessionStorage.setItem('lastTaglineIndex', String(i));
    }
  })
  .catch(console.error);
