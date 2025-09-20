fetch('./content.json?_=' + Date.now()).then(r=>r.json()).then(c=>{
 document.getElementById('brandName').textContent=c.brand;
 document.getElementById('brandName2').textContent=c.brand;
 document.getElementById('heroTitle').textContent=c.hero.title;
 document.getElementById('heroSubtitle').textContent=c.hero.subtitle;
 document.getElementById('aboutTitle').textContent=c.about.title;
 document.getElementById('aboutP1').textContent=c.about.p1;
 document.getElementById('aboutP2').textContent=c.about.p2;
 document.getElementById('aboutP3').textContent=c.about.p3;
 document.getElementById('phoneText').textContent=c.cta.phone;
 document.getElementById('phoneLink').href='tel:'+c.cta.phone.replace(/\s+/g,'');
 document.getElementById('mailText').textContent=c.cta.email;
 document.getElementById('mailLink').href='mailto:'+c.cta.email;
 document.getElementById('addressText').textContent=c.cta.address;
 const phrases=c.taglines; const i=Math.floor(Math.random()*phrases.length);
 document.getElementById('tagline').textContent=phrases[i];
});