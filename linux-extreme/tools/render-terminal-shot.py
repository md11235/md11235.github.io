#!/usr/bin/env python3
"""Render captured output into terminal-like SVG/PNG. Requires Pillow for PNG."""
import argparse, html
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
def render(logfile,png,svg):
    lines=Path(logfile).read_text(encoding="utf-8").splitlines()
    fonts=["/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf","/usr/share/fonts/truetype/liberation2/LiberationMono-Regular.ttf"]
    fp=next((p for p in fonts if Path(p).exists()),None)
    if not fp: raise RuntimeError("Need a monospace TTF font")
    font=ImageFont.truetype(fp,18);w=1180;h=140+29*len(lines)
    im=Image.new("RGB",(w,h),"#0b1320");d=ImageDraw.Draw(im)
    d.rounded_rectangle((10,10,w-10,h-10),radius=17,fill="#111b2d",outline="#354860",width=2)
    d.rounded_rectangle((10,10,w-10,62),radius=17,fill="#202c3f")
    d.rectangle((10,44,w-10,62),fill="#202c3f")
    for x,c in [(37,"#fd635d"),(63,"#ffbd4c"),(89,"#2aca65")]:d.ellipse((x-8,23,x+8,39),fill=c)
    d.text((138,22),"Linux Extreme · EP001 · Captured output",font=font,fill="#b9c7d9")
    parts=[f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}">',f'<rect width="{w}" height="{h}" rx="18" fill="#0b1320"/>',f'<rect x="10" y="10" width="{w-20}" height="{h-20}" rx="17" fill="#111b2d" stroke="#354860" stroke-width="2"/>',f'<path d="M27 10 H{w-27} Q{w-10} 10 {w-10} 27 V62 H10 V27 Q10 10 27 10" fill="#202c3f"/>']
    for x,c in [(37,"#fd635d"),(63,"#ffbd4c"),(89,"#2aca65")]:parts.append(f'<circle cx="{x}" cy="31" r="8" fill="{c}"/>')
    parts.append('<text x="138" y="37" font-family="monospace" font-size="18" fill="#b9c7d9">Linux Extreme · EP001 · Captured output</text>')
    for i,s in enumerate(lines):
        c="#f07879" if "Argument list too long" in s or s=="exit status: 126" else ("#68e6c5" if s.startswith("$") else "#e3e9f4")
        d.text((38,85+i*29),s,font=font,fill=c)
        parts.append(f'<text x="38" y="{103+i*29}" font-family="monospace" font-size="17" fill="{c}">{html.escape(s)}</text>')
    im.save(png,optimize=True);Path(svg).write_text("\n".join(parts+["</svg>"])+"\n",encoding="utf-8")
if __name__=="__main__":
    p=argparse.ArgumentParser();p.add_argument("log");p.add_argument("png");p.add_argument("svg");a=p.parse_args();render(a.log,a.png,a.svg)
