"""
Content snapshot — www.newhomeagents.co.uk

Runs on a GitHub runner (see .github/workflows/nha-capture.yml). Writes a
dated snapshot of the public listing pages to ../../src/data/scrape/:

  index.json    every listing card seen on /latest-properties and /new-homes
  details.json  the detail page for every unique listing (features,
                description, photos, floorplans, room counts)
  pages.json    plain-text copy of the informational pages
  meta.json     when the snapshot was taken and from where

This is a snapshot, not a feed. See src/data/README.md in the app.
"""
import re, html, json, time, sys, os, datetime
import urllib.request

OUT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../src/data/scrape"))
os.makedirs(OUT, exist_ok=True)
BASE = "https://www.newhomeagents.co.uk"

def get(u):
    r = urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0 (compatible; NHA-preview-capture)"})
    return urllib.request.urlopen(r, timeout=60).read().decode("utf-8", "ignore")

def clean(t):
    t = re.sub(r"<br\s*/?>", "\n", t)
    t = re.sub(r"</(p|div|li|h\d|tr)>", "\n", t)
    t = re.sub(r"<[^>]+>", "", t)
    t = html.unescape(t)
    t = re.sub(r"[ \t\xa0]+", " ", t)
    t = re.sub(r"\n\s*\n+", "\n\n", t)
    return t.strip()

CARD = re.compile(r'<div class="span3 eapow-row\d eapow-overview-row" id="eapow-listing-(\d+)">(.*?)(?=<div class="span3 eapow-row\d eapow-overview-row"|<h2 class="eapow-property-header"|<div class="pagination|$)', re.S)

def parse_list(s, source, page):
    out = []
    for m in CARD.finditer(s):
        pid, card = m.group(1), m.group(2)
        link = re.search(r'href="(/properties-for-sale/property/[^"]+)"', card)
        thumb = re.search(r'eapow-overview-thumb" alt="([^"]*)" data-src="([^"]+)"', card)
        title = re.search(r"<h3>(.*?)</h3>", card, re.S)
        price = re.search(r'eapow-overview-price propPrice">(.*?)</span>', card, re.S)
        icons = re.findall(r'propertyIcon-(\w+)"></i><span class="IconNum">(\d+)', card)
        short = re.search(r'eapow-overview-short-desc"><p>(.*?)</p>', card, re.S)
        banners = re.findall(r"images/banner_(\w+)\.png", card)
        out.append(dict(id=pid, source=source, page=page, link=link.group(1) if link else None,
                        alt=thumb.group(1) if thumb else None, thumb=thumb.group(2) if thumb else None,
                        title=clean(title.group(1)) if title else None, price=clean(price.group(1)) if price else None,
                        icons=dict(icons), short=clean(short.group(1)) if short else None, banners=sorted(set(banners))))
    return out

idx = []
for start in range(0, 96, 12):
    try:
        s = get(f"{BASE}/latest-properties?start={start}")
        rows = parse_list(s, "latest", start // 12 + 1)
        if not rows: break
        idx += rows
    except Exception as e:
        print("latest", start, e, file=sys.stderr)
    time.sleep(0.4)
for start in range(0, 276, 12):
    try:
        s = get(f"{BASE}/new-homes?start={start}")
        rows = parse_list(s, "new-homes", start // 12 + 1)
        if not rows: break
        idx += rows
    except Exception as e:
        print("new-homes", start, e, file=sys.stderr)
    time.sleep(0.4)
json.dump(idx, open(f"{OUT}/index.json", "w"), indent=1)
print("index", len(idx))

def parse_detail(s):
    d = {}
    h1 = re.search(r'<h1 class="span8 pull-left">(.*?)<small class="eapow-detail-price">(.*?)</small>', s, re.S)
    d["title"] = clean(h1.group(1)) if h1 else None
    d["price"] = clean(h1.group(2)) if h1 else None
    d["breadcrumb"] = [html.unescape(x) for x in re.findall(r'itemprop="name">([^<]+)</span>', s)]
    t = re.search(r"<title>(.*?)</title>", s, re.S)
    d["meta_title"] = clean(t.group(1)) if t else None
    md = re.search(r'name="description" content="([^"]*)"', s)
    d["meta_desc"] = html.unescape(md.group(1)) if md else None
    a, b = s.find('id="slider"'), s.find('id="carousel"')
    slider = s[a:b] if a > -1 and b > a else ""
    d["images"] = [(html.unescape(t), u) for t, u in re.findall(r'<div class="imageTitle">([^<]*)</div>\s*<img class="lozad" data-src="([^"]+)"', slider)]
    if not d["images"]:
        d["images"] = [("", u) for u in re.findall(r'data-src="([^"]+/main/[^"]+)"', slider)]
    d["icons"] = dict(re.findall(r'propertyIcon-(\w+)"></i>\s*<span class="IconNum">(\d+)', s))
    feats = re.search(r'<ul id="starItem">(.*?)</ul>', s, re.S)
    d["features"] = [clean(x) for x in re.findall(r"<li>(.*?)</li>", feats.group(1), re.S)] if feats else []
    a = s.find('class="span12 eapow-desc-wrapper"')
    b = s.find('id="eapowgalleryplug"', a)
    dd = s[a:b] if a > -1 and b > a else ""
    dd = re.sub(r'<ul id="starItem">.*?</ul>', "", dd, flags=re.S)
    d["description"] = clean(dd)[:8000]
    d["floorplans"] = sorted(set(re.findall(r'(https?://[^"\']+/Floorplan[^"\']*\.(?:jpe?g|png|gif))', s)))
    d["epc_images"] = sorted(set(re.findall(r'(https?://[^"\']+(?:EPC|epc|Epc)[^"\']*\.(?:jpe?g|png|gif|pdf))', s)))
    d["brochure"] = sorted(set(re.findall(r'(https?://[^"\']+\.pdf)', s)))
    d["banners"] = sorted(set(re.findall(r"images/banner_(\w+)\.png", s)))
    d["tabs"] = re.findall(r'data-toggle=\\"tab\\">([^<]+)<', s)
    d["virtual"] = sorted(set(re.findall(r'(https?://(?:my\.matterport|youtu\.be|www\.youtube|vimeo)[^"\']+)', s)))
    rooms = re.search(r'<div id="eapowroomsplug"(.*?)</div>\s*</div>\s*</div>', s, re.S)
    d["rooms_text"] = clean(rooms.group(1))[:3000] if rooms else None
    m = re.search(r'EPC\s*(?:RATING|Rating|rating)?\s*[:\-]?\s*([A-G])\b', " ".join(d["features"]) + " " + d["description"])
    d["epc_rating"] = m.group(1) if m else None
    d["fetched_at"] = datetime.datetime.utcnow().isoformat() + "Z"
    return d

links, seen = [], set()
for it in idx:
    if it["link"] and it["link"] not in seen:
        seen.add(it["link"]); links.append(it["link"])
details = {}
for i, l in enumerate(links):
    try:
        details[l] = parse_detail(get(BASE + l))
    except Exception as e:
        details[l] = {"error": str(e)}
    if i % 10 == 0:
        json.dump(details, open(f"{OUT}/details.json", "w"), indent=1)
        print("details", i, file=sys.stderr)
    time.sleep(0.3)
json.dump(details, open(f"{OUT}/details.json", "w"), indent=1)
print("details", len(details))

pages = {}
for p in ["/", "/about-us", "/new-homes", "/mortgages", "/valuation", "/register-with-us", "/contact-us", "/cookie-policy", "/properties-for-sale-region", "/draw-search", "/latest-properties"]:
    try:
        s = get(BASE + p)
        body = re.sub(r"<script.*?</script>|<style.*?</style>|<!--.*?-->", "", s, flags=re.S)
        pages[p] = {
            "title": clean(re.search(r"<title>(.*?)</title>", s, re.S).group(1)) if re.search(r"<title>", s) else None,
            "description": html.unescape(re.search(r'name="description" content="([^"]*)"', s).group(1)) if re.search(r'name="description" content="', s) else None,
            "text": clean(body)[:20000],
            "links": sorted(set(re.findall(r'href="([^"]+)"', s))),
            "images": sorted(set(re.findall(r'(?:src|data-src)="([^"]+\.(?:jpe?g|png|svg|webp|gif)[^"]*)"', s))),
        }
        if p == "/":
            pages[p]["html_excerpt_testimonials"] = re.sub(r"\s+", " ", s[s.find("What Our Customers Say") - 200 : s.find("What Our Customers Say") + 6000])
            pages[p]["html_excerpt_services"] = re.sub(r"\s+", " ", s[s.find("Welcome to New Home Agents") - 3000 : s.find("Welcome to New Home Agents") + 3000])
    except Exception as e:
        pages[p] = {"error": str(e)}
    time.sleep(0.3)
json.dump(pages, open(f"{OUT}/pages.json", "w"), indent=1)
json.dump({"source": BASE, "captured_at": datetime.datetime.utcnow().isoformat() + "Z", "index_entries": len(idx), "unique_listings": len(links)}, open(f"{OUT}/meta.json", "w"), indent=1)
print("done")
