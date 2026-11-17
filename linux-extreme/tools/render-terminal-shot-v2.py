#!/usr/bin/env python3
"""Render real saved terminal output as SVG + PNG. Requires Pillow for PNG."""
import argparse
import html
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


def main():
    ap = argparse.ArgumentParser(description="Render captured output as terminal-style SVG and PNG")
    ap.add_argument("log", type=Path, help="real recorded output.txt")
    ap.add_argument("png", type=Path)
    ap.add_argument("svg", type=Path)
    ap.add_argument("--title", default="Linux Extreme / Verified transcript")
    a = ap.parse_args()
    lines = a.log.read_text(encoding="utf-8").splitlines()
    candidates = (
        "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
        "/usr/share/fonts/truetype/liberation2/LiberationMono-Regular.ttf",
    )
    font_file = next((p for p in candidates if Path(p).exists()), None)
    if font_file is None:
        raise SystemExit("A monospace font such as DejaVu Sans Mono is required")
    font = ImageFont.truetype(font_file, 21)
    small = ImageFont.truetype(font_file, 18)
    width, height, step = 1410, 118 + 36 * len(lines) + 38, 36
    img = Image.new("RGB", (width, height), "#090d18")
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle((7, 7, width-8, height-8), 22, fill="#121d30", outline="#354862", width=2)
    draw.rounded_rectangle((7, 7, width-8, 71), 22, fill="#223149")
    draw.rectangle((7, 48, width-8, 71), fill="#223149")
    circles = ((40, "#ff6965"), (73, "#ffbf51"), (106, "#2ad57e"))
    for x, color in circles:
        draw.ellipse((x-9, 22, x+9, 40), fill=color)
    draw.text((155, 21), a.title, fill="#d6e4f5", font=small)
    svg = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">',
        '<rect width="100%" height="100%" fill="#090d18"/>',
        f'<rect x="7" y="7" width="{width-15}" height="{height-15}" rx="22" fill="#121d30" stroke="#354862" stroke-width="2"/>',
        f'<path d="M29 7 H{width-29} Q{width-8} 7 {width-8} 29 V71 H7 V29 Q7 7 29 7" fill="#223149"/>',
    ]
    for x, color in circles:
        svg.append(f'<circle cx="{x}" cy="31" r="9" fill="{color}"/>')
    svg.append(f'<text x="155" y="43" font-family="monospace" font-size="19" fill="#d6e4f5">{html.escape(a.title)}</text>')
    for i, line in enumerate(lines):
        color = "#80efd1" if line.startswith("$") else ("#ffd38c" if any(x in line for x in ("1.0T", "8.0K", "8192 bytes", "1099511627776 bytes")) else "#e4eaf4")
        draw.text((37, 92 + i*step), line, fill=color, font=font)
        svg.append(f'<text x="37" y="{114 + i*step}" font-family="DejaVu Sans Mono,monospace" font-size="21" fill="{color}">{html.escape(line)}</text>')
    svg.append("</svg>")
    a.png.parent.mkdir(parents=True, exist_ok=True)
    a.svg.parent.mkdir(parents=True, exist_ok=True)
    img.save(a.png, optimize=True)
    a.svg.write_text("\n".join(svg) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
