# Dynamic content via Netlify Functions
- Content lives under `/content/*.json` and is editable from `/admin`.
- Frontend fetches `/.netlify/functions/content` which merges all JSONs at runtime and disables caching.
- Deploy to Netlify with functions enabled (no build command required).