---
layout: default
title: "全部文章 · 按更新时间"
description: "基于 Git 提交记录自动生成的技术文章时间线"
permalink: /archive/
---

<section class="hero archive-hero">
  <span class="eyebrow">AUTOMATIC INDEX / 文章档案</span>
  <h1>技术文章<span class="gradient">时间线。</span></h1>
  <p>自动扫描项目中可发布的 HTML 与 Markdown 页面，并按每个文件最近一次 Git 提交时间倒序组织。每次提交新文章后自动刷新索引。</p>
  <div class="hero-actions"><a class="action-btn secondary" href="{{ '/' | relative_url }}">← 返回首页</a></div>
</section>

<section class="archive-box" aria-label="文章搜索">
  <label for="archive-search" class="eyebrow">SEARCH / 查找文章</label>
  <input id="archive-search" type="search" placeholder="搜索标题、路径或主题（如 Git、Linux、地图）" autocomplete="off">
  <p id="catalog-status" class="catalog-note" role="status">正在加载最新索引…</p>
  <div id="auto-archive"></div>
</section>

<script src="{{ '/assets/js/page-catalog.js' | relative_url }}" defer></script>
