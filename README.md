# MethodA website

Updated from the supplied new.methodA.zip using HTML, CSS, JavaScript and jQuery. The existing visual style and logo are retained, with new product illustrations and application-specific content.

## Preview with working demo APIs

From this folder run:

    python3 server.py --port 8765

Open http://127.0.0.1:8765/ in a browser. Python 3 needs no additional packages. Opening index.html directly will display the static content, but the form and dynamic blog listing require the server.

## Included

- 18 responsive HTML pages, including all original pages.
- Preserved legacy early-access.html and legal.html, including #privacy and #terms.
- Current application login, registration, Premium Account and Store links.
- Product benefits, discipline routines, platform comparison, target-linked refund guidance, store guide and company-reported community figures.
- Dated SEBI statistics with primary-source links.
- Four complete static blog articles, plus a server-loaded listing and category filters.
- Working demo contact POST, server validation, loading/success/failure handling and retained form input after failure.
- Unique titles/descriptions, keyword metadata, canonical URLs, Open Graph metadata, JSON-LD, sitemap and robots.txt.
- AOS scroll animations, reduced-motion support, labelled form fields, keyboard navigation and skip link.

## Demo API contract

GET /api/blogs returns the array in data/blogs.json. Each item has id, title, category, date, readTime, excerpt, imageUrl and url.

POST /api/contact accepts JSON with name, email, phone (optional), subject and message. The demo returns:

    {"ok": true, "demo": true, "message": "Demo enquiry received successfully. No message was stored or sent to MethodA. Thank you for testing the form."}

Invalid requests return 400, unsupported media types return 415 and oversize requests return 413. No enquiry is stored, emailed or transmitted to MethodA. The server is bound to localhost and is a preview utility, not a production service.

## Production integration

1. Upload HTML, assets, data, robots.txt and sitemap.xml to the website root. Preserve filenames to keep existing inbound links working.
2. Implement the two API endpoints on your production backend, or update site.blogDataUrl and site.contactUrl in assets/js/config.js. The frontend is framework-free; the production backend may use any language.
3. Production contact handling should include persistence or email delivery, spam protection, suitable rate limits, server validation and an appropriate privacy policy. Remove the demo explanation only after real delivery is connected.
4. Blog article files are static and indexable. When publishing new posts, provide both an article URL and an API listing entry; update the sitemap.
5. Canonicals and sitemap assume the final public site is https://methoda.in/. Keep a staging deployment out of search indexing and update the domain if the final domain changes.
6. Bootstrap, jQuery, Font Awesome, AOS and Google Fonts are currently loaded from their established CDNs. Vendor these locally if your hosting/content security policy requires it.
7. Reconfirm application routes before launch. Verified current routes are documented in CONTENT-NOTES.md. Legacy app /login is broken and must not be reused.
8. Review the inherited legal policy drafts against your actual business practices before publication. No live site has been deployed or modified by this delivery.

## Editing

- assets/css/style.css: existing design plus responsive refinements.
- assets/js/config.js: application routes and API endpoints.
- assets/js/main.js: shared interactions, jQuery events, form submission and blog loading.
- data/blogs.json: demo blog listing.
- assets/img/: original logo and lightweight local SVG product illustrations.

The sample dashboard graphic is explicitly illustrative. No private account data or supplied credentials are included.
