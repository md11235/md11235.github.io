---
layout: default
title: "Sam 的知识库 · Sam / Knowledge Lab"
description: "操作系统、Linux 自动化、网络技术与地图数据的个人知识档案"
permalink: /
---

<section class="hero" aria-labelledby="hero-title">
  <span class="eyebrow">PERSONAL RESEARCH &amp; ENGINEERING ARCHIVE</span>
  <h1 id="hero-title">探索技术边界。<br><span class="gradient">记录每一次发现。</span></h1>
  <p>欢迎来到 Sam 的知识库。一座持续生长的技术档案馆：从 Linux 命令行、系统工具与编程实践，到地图数据结构、空间网络和工程实验。</p>
  <div class="hero-actions">
    <a class="action-btn" href="#featured">浏览精选文章 <span aria-hidden="true">↗</span></a>
    <a class="action-btn secondary" href="#archive">探索技术归档</a>
  </div>
</section>

<section id="featured" aria-labelledby="featured-title">
  <div class="section-heading">
    <div><span class="eyebrow">FEATURED / 探索精选</span><h2 id="featured-title">近期专题与技术笔记</h2></div>
    <small>01 — 04</small>
  </div>
  <div class="feature-grid">
    <a class="feature-card wide" href="{{ '/protomaps/' | relative_url }}">
      <span class="card-tag">01 / GEO DATA · FEATURED</span>
      <h3>Protomaps：重新思考地图的存储与分发</h3>
      <p>从 OSM、MapLibre 和 Mapbox 的技术分工入手，解析 PMTiles 的单文件结构、HTTP Range 访问、CDN 部署及其与 MBTiles 的关键区别。附四幅架构示意图。</p>
      <svg class="data-lines" viewBox="0 0 230 130" fill="none" aria-hidden="true"><g stroke="#64e3ea" stroke-width="1.5"><path d="M0 115 50 74 96 91 148 28 210 52M0 85 45 108 100 48 140 65 225 8M10 25 60 44 101 10 159 88 215 97"/><circle cx="50" cy="74" r="5"/><circle cx="148" cy="28" r="5"/><circle cx="100" cy="48" r="5"/><circle cx="159" cy="88" r="5"/></g></svg>
      <span class="card-link">阅读专题 <span aria-hidden="true">→</span></span>
    </a>
    <a class="feature-card" href="{{ '/bash-process-substitution.html' | relative_url }}">
      <span class="card-tag">02 / LINUX · BASH</span>
      <h3>Bash 进程替换</h3>
      <p>理解命令行中的数据流组合与进程替换机制。</p>
      <span class="card-link">打开笔记 →</span>
    </a>
    <a class="feature-card" href="{{ '/git解决冲突简短入门教程.html' | relative_url }}">
      <span class="card-tag">03 / VERSION CONTROL</span>
      <h3>Git 冲突解决入门</h3>
      <p>结合具体操作理解协作开发中的合并与冲突。</p>
      <span class="card-link">打开笔记 →</span>
    </a>
    <a class="feature-card" href="{{ '/Ways-to-handle-filenames-with-special-characters-in-batch.html' | relative_url }}">
      <span class="card-tag">04 / CLI · AUTOMATION</span>
      <h3>批量处理特殊文件名</h3>
      <p>让 Shell 脚本正确处理空格及特殊字符。</p>
      <span class="card-link">打开笔记 →</span>
    </a>
  </div>
</section>

<section id="archive" aria-labelledby="archive-title">
  <div class="section-heading">
    <div><span class="eyebrow">LIBRARY / 技术索引</span><h2 id="archive-title">按主题继续探索</h2></div>
    <small>CURATED NOTES</small>
  </div>
  <div class="archive-box">
    <h3>操作系统、网络与工具</h3>
    <ul class="archive-links">
      <li><a href="{{ '/ctrl-d在Bash里的不同功能.html' | relative_url }}">Ctrl-D 在 Bash 里的不同功能</a></li>
      <li><a href="{{ '/如何在PowerShell里解压缩zip文件.html' | relative_url }}">PowerShell 解压缩 ZIP</a></li>
      <li><a href="{{ '/how-to-check-host-identity-when-first-connecting-to-it-with-ssh.html' | relative_url }}">首次 SSH 连接时校验主机身份</a></li>
      <li><a href="{{ '/testing-network-throughput-using-iperf3.html' | relative_url }}">使用 iperf3 测试网络吞吐量</a></li>
      <li><a href="{{ '/docker-simple-startup.html' | relative_url }}">Docker 快速入门</a></li>
      <li><a href="{{ '/blog_index.html' | relative_url }}">历史文章完整归档</a></li>
    </ul>
  </div>
</section>

<section class="contact-strip" aria-label="联系信息">
  <div><strong>保持好奇，持续构建。</strong><p>欢迎交流计算机系统、开源工具与数据工程。</p></div>
  <a href="mailto:md11235@gmail.com">md11235@gmail.com ↗</a>
</section>
