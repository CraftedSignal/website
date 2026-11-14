"""Offline checks against the production Hugo output (run after `hugo --minify`)."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import unittest
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1] / "public"
ORIGIN = "craftedsignal.io"


class Document(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.tags = []
        self.feed(path.read_text(encoding="utf-8"))

    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))


def resolve(page, url):
    path = unquote(urlsplit(url).path)
    target = ROOT / path.lstrip("/") if path.startswith("/") else page.parent / path
    return target if target.is_file() else target / "index.html"


class SiteSmokeTests(unittest.TestCase):
    def test_homepage_and_docs_are_published_with_metadata(self):
        for route in ("index.html", "docs/index.html"):
            with self.subTest(route=route):
                page = ROOT / route
                self.assertTrue(page.is_file(), "build the production site first")
                tags = Document(page).tags
                self.assertTrue(any(t == "h1" for t, _ in tags))
                self.assertTrue(any(t == "title" for t, _ in tags))
                self.assertTrue(any(t == "meta" and a.get("name") == "description"
                                    and a.get("content") for t, a in tags))
                canonical = [a.get("href", "") for t, a in tags
                             if t == "link" and a.get("rel") == "canonical"]
                self.assertEqual(len(canonical), 1)
                self.assertEqual(urlsplit(canonical[0]).netloc, ORIGIN)

    def test_every_local_link_and_asset_exists(self):
        pages = list(ROOT.rglob("*.html"))
        self.assertTrue(pages, "build the production site first")
        for page in pages:
            for tag, attrs in Document(page).tags:
                for key in ("href", "src"):
                    url = attrs.get(key, "")
                    parsed = urlsplit(url)
                    if not parsed.path or parsed.scheme or parsed.netloc:
                        continue
                    with self.subTest(page=str(page.relative_to(ROOT)), tag=tag, url=url):
                        self.assertTrue(resolve(page, url).is_file(), "missing local link or asset")

    def test_sitemap_and_robots_reference_published_pages(self):
        sitemap = ROOT / "sitemap.xml"
        urls = ET.parse(sitemap).findall(".//{*}loc")
        self.assertTrue(urls)
        for loc in urls:
            with self.subTest(url=loc.text):
                self.assertEqual(urlsplit(loc.text).netloc, ORIGIN)
                self.assertTrue(resolve(ROOT / "index.html", loc.text).is_file())
        self.assertIn("https://craftedsignal.io/sitemap.xml", (ROOT / "robots.txt").read_text())


if __name__ == "__main__":
    unittest.main()
