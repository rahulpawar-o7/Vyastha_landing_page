# Vyastha website

Static site with client-side routes: `/`, `/about`, `/features`, `/pricing`, `/founders`, `/security`, `/contact`.
All routes are served by `index.html`. `vercel.json` holds the rewrites, so it deploys on Vercel as-is. On Netlify add `/* /index.html 200` to `_redirects`. Opening `index.html` directly from disk shows the home page only; use a local server (e.g. `npx serve -s .`) to test routes.
Opening animation: rocket holds on the launch pad for ~2s, lifts off, and the title "Get ready to start your business journey with Vyastha" animates in. Plays once per browser session on `/`, skippable (click / any key), disabled for reduced-motion users.

## Edit links, prices, trial
Open `index.html`, search for `const CFG=` near the bottom:
- START_FREE_URL, LOGIN_URL: your registration / login URLs
- SHASHANK_LINKEDIN_URL, RAHUL_LINKEDIN_URL, INSTAGRAM_URL, YOUTUBE_URL, LINKEDIN_URL, SUPPORT_EMAIL, WHATSAPP_NUMBER
- PRICE_LITE, TRIAL_LITE, PRICE_PRO, TRIAL_PRO

Empty values leave that button inactive.

## Other
- Images: `assets/` (logo, founder photos, favicon). Replace files with the same names.
- Language: the site is English. The site-wide language selector was removed because most content was not translated. Ask Vyastha demo keeps its own language pills (fully translated; have Marathi/Sindhi reviewed).
- Ask Vyastha and all charts use sample data.
- Domain: set to https://vyastha-web-eight.vercel.app. To change it, run `./set-domain.sh <new-url>` after replacing the old URL.
- Unset Start Free / Login buttons scroll to Pricing; unset social/contact links are hidden (console warns). 
- privacy.html, terms.html, refund.html are noindex draft placeholders. Replace with real text.
- OG image currently uses logo.png; add a 1200x630 image and update og:image/twitter:image.

## Contact (direct Email + WhatsApp)
The Help & Contact page has two buttons, no form and no verification:
- Email opens a new email to CFG.SUPPORT_EMAIL (Gmail compose on desktop, the phone's mail app on mobile).
- WhatsApp opens a chat with CFG.WHATSAPP_NUMBER (country code included, e.g. 919826880544).
Change both in `const CFG=` in `index.html`. Nothing needs to be set up in Vercel for contact.

## Struck-through prices
CFG.MRP_LITE (149) and CFG.MRP_PRO (249) are the crossed-out prices shown above PRICE_LITE (49) and PRICE_PRO (99) on the pricing cards.
