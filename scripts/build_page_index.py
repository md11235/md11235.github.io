#!/usr/bin/env python3
"""Build a chronological page index from tracked Git files; stdlib only."""
import datetime as dt
import html
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
EXCLUDE_DIRS = {".git", ".github", "_layouts", "_includes", "_sass", "assets", "images",
                "styles", "css", "js", "node_modules", "vendor", "tmp", "org-files"}
EXCLUDE_NAMES = {"README.md", "index.md", "index.html", "blog_index.html",
                 "index-mine.html", "index2.html", "sitemap.html", "google33b31d461d94478d.html"}
EXTENSIONS = {".md", ".markdown", ".html", ".htm"}

class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_title = False
        self.title = ""
    def handle_starttag(self, tag, attrs):
        if tag == "title":
            self.in_title = True
    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False
    def handle_data(self, value):
        if self.in_title:
            self.title += value

def git(*args):
    return subprocess.check_output(["git", *args], cwd=ROOT, text=True, errors="replace").strip()

def parse_title(content, path):
    content = content[:35000]
    if content.startswith("---"):
        m = re.match(r"\A---\s*\n(.*?)\n---", content, re.S)
        if m:
            t = re.search(r"^title:\s*(.+)$", m.group(1), re.M)
            if t:
                return t.group(1).strip().strip("\"'")
    if path.suffix.lower() in (".html", ".htm"):
        p = PageParser()
        try:
            p.feed(content[:14000])
            if p.title.strip():
                return html.unescape(p.title.strip())
        except Exception:
            pass
    m = re.search(r"^#\s+(.+)$", content, re.M)
    if m:
        return m.group(1).strip()
    return path.stem.replace("-", " ").replace("_", " ")

def uri_for(path):
    parts = list(path.parts)
    if path.name in ("index.md", "index.markdown", "index.html"):
        return "/" + "/".join(parts[:-1]) + "/"
    if path.suffix.lower() in (".md", ".markdown"):
        return "/" + path.with_suffix(".html").as_posix()
    return "/" + path.as_posix()

def classify(path, title):
    hay = (str(path) + " " + title).lower()
    if "git" in hay: return "Git / Version Control"
    if any(s in hay for s in ("map", "geo", "traffic", "road", "protomaps")): return "Maps / Spatial"
    if any(s in hay for s in ("bash", "linux", "shell", "ssh", "tmux", "cygwin", "ubuntu", "centos", "docker")): return "Linux / Systems"
    if any(s in hay for s in ("python", "java", "vim", "emacs", "powershell", "program")): return "Programming / Tools"
    return "Technical Notes"

def main():
    names = git("ls-files", "-z").split("\0")
    pages = []
    for name in names:
        if not name: continue
        path = Path(name)
        if path.suffix.lower() not in EXTENSIONS: continue
        if any(p.startswith(".") or p in EXCLUDE_DIRS or p.startswith("_") for p in path.parts[:-1]): continue
        if path.name in EXCLUDE_NAMES and len(path.parts) == 1: continue
        if path.name.lower() in ("readme.md", "404.html"): continue
        full = ROOT / path
        if not full.exists(): continue
        try:
            data = full.read_text(encoding="utf-8", errors="replace")
            timestamp = git("log", "-1", "--format=%cI", "--", name)
            if not timestamp: continue
            title = parse_title(data, path)
            if title.lower() in ("", "untitled"): continue
            pages.append({"title": title, "url": uri_for(path), "path": name,
                          "updated_at": timestamp, "category": classify(path, title)})
        except Exception as exc:
            print(f"Skipped {name}: {exc}")
    pages.sort(key=lambda x: (x["updated_at"], x["path"]), reverse=True)
    output = {"schema": 1, "source": "git-last-commit", "generated_at": dt.datetime.now(dt.timezone.utc).isoformat(),
              "count": len(pages), "pages": pages}
    (ROOT / "page-index.json").write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote index for {len(pages)} pages")

if __name__ == "__main__":
    main()
