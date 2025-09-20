
const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  try {
    const contentPath = path.join(process.cwd(), 'content');
    const out = {};
    const files = ['site.json','hero.json','about.json','gallery.json','videos.json','form.json'];
    for (const file of files) {
      const p = path.join(contentPath, file);
      if (fs.existsSync(p)) {
        const json = JSON.parse(fs.readFileSync(p, 'utf8'));
        // shallow merge top-level keys
        for (const [k,v] of Object.entries(json)) out[k] = v;
      }
    }
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      body: JSON.stringify(out)
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
}
