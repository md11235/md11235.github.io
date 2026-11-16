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
    <a class="action-btn secondary" href="{{ '/archive/' | relative_url }}">全部文章 · 按时间</a>
  </div>
</section>

<section id="featured" aria-labelledby="featured-title">
  <div class="section-heading">
    <div><span class="eyebrow">FEATURED / 探索精选</span><h2 id="featured-title">近期专题与技术笔记</h2></div>
    <small id="featured-count">LATEST UPDATES</small>
  </div>
  <div id="auto-feature-grid" class="feature-grid" hidden></div>
  <div id="recent-fallback" class="feature-grid">
    <a class="feature-card wide" href="{{ '/animated_cs/git/' | relative_url }}">
      <span class="card-tag">01 / GIT · INTERACTIVE</span>
      <h3>Git 基本操作 · 3D 动画实验室</h3>
      <p>通过三维动画探索 Untracked、Working Directory、Staging Area 和 Local Repository 之间的状态转换，以及 git add、commit、reset、restore 等操作。</p>
      <span class="card-link">打开交互动画 →</span>
    </a>
    <a class="feature-card" href="{{ '/protomaps/' | relative_url }}">
      <span class="card-tag">02 / GEO DATA</span>
      <h3>Protomaps：地图分发的新架构</h3>
      <p>PMTiles、HTTP Range 和 MapLibre 的技术分工与实践。</p>
      <span class="card-link">阅读专题 →</span>
    </a>
  </div>
  <p class="catalog-note">按文件最近一次 Git 提交时间排列。<a href="{{ '/archive/' | relative_url }}">查看全部页面与搜索 →</a></p>
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

<script src="{{ '/assets/js/page-catalog.js' | relative_url }}" defer></script>
