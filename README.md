# Jacqueline Asher Medico-Legal Consulting

Static site published at **https://jacqueline-asher.com.au/** (once DNS is configured).

Repository: [github.com/jacqasher/home](https://github.com/jacqasher/home)

## Custom domain DNS

Point `jacqueline-asher.com.au` at GitHub Pages with these records at your registrar:

| Type | Host | Value |
|------|------|-------|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |

Optional — if you also want `www`:

| Type | Host | Value |
|------|------|-------|
| CNAME | `www` | `jacqasher.github.io` |

Then in GitHub repo **Settings → Pages**, set the custom domain to `jacqueline-asher.com.au` and enable **Enforce HTTPS** once the certificate is issued.

## Structure

- `index.html` — main page
- `css/asher.css` — styles
- `js/site.js` — mobile navigation
- `img/` — section illustrations

## Local preview

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000
