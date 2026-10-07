# Nine Minutes — صالون 9 دقايق للحلاقة / Nine Minutes Barber Shop

Spec build: a website made for a real Jeddah business that has no site of its own, on Mamar's initiative. **Not commissioned.** Built to show the owner, not published as theirs.

**Live:** https://ahmedps520-svg.github.io/Nine-Minutes-Barber/

| | |
|---|---|
| Business | Men's barbershop |
| District | السلامة — قريش، جدة |
| Google | 4.9★ · 606 reviews (checked 7 Oct 2026) |
| Phone | 053 368 1529 |
| Web presence before this | none |
| Hours | Daily 1pm–3am |
| Maps | https://www.google.com/maps/place/?q=place_id:ChIJ-2IFbQDbwxUR68wJ2w9jPlQ |

## The idea

A Swiss station clock on Jeddah time — red 9, red second hand with the real stop-to-go pause — and a 24-hour strip with their hours in red. Nothing claims a haircut takes nine minutes; that's just the name.

**Palette:** Black, white, signal red · **Type:** Lalezar · Mada · Big Shoulders Display

## Where the content came from

Everything on the page comes from the business's own Google Maps listing — the owner's description, the hours, the listed attributes, and the reviews. Nothing is invented: no prices, no staff names, no history, no claims they haven't made.

**Reviews:** 2 quoted. The rest thank a barber by name. Reviews are 5-star only, verbatim, and never ones that praise an individual employee — staff move on.

## Before it goes live for them

- **Photos.** The page is deliberately image-free — no stock, and no AI pictures pretending to be their shop. Five real photos from the owner and it's done.
- **Owner check.** Confirm hours, services and the WhatsApp number.
- **Remove** `<meta name="robots" content="noindex, nofollow">` once they adopt it. Until then it stays, so this page never competes with their own listing in search.

## Tech

Plain HTML, CSS and JavaScript — no framework, no build step. Arabic is the default and ships in the markup; English is a toggle remembered in `localStorage`. Opening hours and "open now" are computed in Jeddah time (UTC+3), wherever the visitor is.

---
Developed by [Mamar](https://mamar.site)
