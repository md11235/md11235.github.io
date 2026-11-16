/* Browser renderer for the Git-built chronological page catalog. No GitHub API calls. */
(() => {
  "use strict";
  const dataURL = "/page-index.json";
  const fallback = document.querySelector("#recent-fallback");
  const featureGrid = document.querySelector("#auto-feature-grid");
  const archive = document.querySelector("#auto-archive");
  const searchInput = document.querySelector("#archive-search");
  const status = document.querySelector("#catalog-status");
  const maxHome = 8;
  const safePath = path => {
    if (typeof path !== "string" || !path.startsWith("/") || path.startsWith("//")) return "#";
    return encodeURI(path).replace(/#/g, "%23").replace(/\?/g, "%3F");
  };
  const formatDate = date => {
    const d = new Date(date);
    return Number.isNaN(d.getTime()) ? "" : new Intl.DateTimeFormat("zh-CN", {
      year:"numeric",month:"2-digit",day:"2-digit",timeZone:"UTC"
    }).format(d);
  };
  function element(tag, cls, content) {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (content !== undefined) el.textContent = content;
    return el;
  }
  function card(page, i) {
    const a = element("a", "feature-card" + (i === 0 ? " wide" : ""));
    a.href = safePath(page.url);
    const label = element("span", "card-tag", (i+1).toString().padStart(2,"0") + " / " + (page.category || "Technical Notes").toUpperCase());
    const h = element("h3", "", page.title);
    const desc = element("p", "", "最近更新 · " + formatDate(page.updated_at) + " · " + page.path);
    const link = element("span", "card-link", "阅读文章 →");
    a.append(label, h, desc, link);
    return a;
  }
  function renderHome(pages) {
    if (!featureGrid) return;
    const filtered = pages.filter(p => p.url && p.title && p.updated_at);
    featureGrid.replaceChildren(...filtered.slice(0, maxHome).map(card));
    if (fallback && filtered.length) fallback.hidden = true;
    const count = document.querySelector("#featured-count");
    if (count) count.textContent = filtered.length + " ARTICLES · NEWEST FIRST";
  }
  function archiveRow(page) {
    const li = element("li", "catalog-item");
    const a = element("a", "", page.title);
    a.href = safePath(page.url);
    const details = element("span", "catalog-meta", (page.category || "Notes") + " · " + formatDate(page.updated_at));
    li.append(a,details);
    return li;
  }
  function renderArchive(pages, query) {
    if (!archive) return;
    const needle = (query || "").trim().toLocaleLowerCase();
    const filtered = pages.filter(p => (p.title + " " + p.path + " " + p.category).toLocaleLowerCase().includes(needle));
    const groups = new Map();
    for (const page of filtered) {
      const year = (page.updated_at || "").slice(0,4) || "未知";
      if (!groups.has(year)) groups.set(year,[]);
      groups.get(year).push(page);
    }
    const fragment = document.createDocumentFragment();
    for (const [year,items] of groups) {
      const sec = element("section", "catalog-year");
      sec.append(element("h2", "", year + " · " + items.length + " 篇"));
      const ul = element("ul","catalog-list");
      ul.append(...items.map(archiveRow));
      sec.append(ul);
      fragment.append(sec);
    }
    archive.replaceChildren(fragment);
    if (status) status.textContent = "共收录 " + pages.length + " 个页面 · 当前显示 " + filtered.length + " 个 · 依据文件最近一次 Git 提交时间排序";
  }
  async function load() {
    try {
      const response = await fetch(dataURL, {cache:"no-cache"});
      if (!response.ok) throw new Error("HTTP " + response.status);
      const data = await response.json();
      if (!data || !Array.isArray(data.pages) || data.schema !== 1) throw new Error("无效索引");
      const pages = data.pages.slice().sort((a,b)=>String(b.updated_at).localeCompare(String(a.updated_at)));
      renderHome(pages);
      renderArchive(pages, "");
      if (searchInput) searchInput.addEventListener("input", () => renderArchive(pages,searchInput.value));
    } catch (e) {
      if (status) status.textContent = "索引暂不可用，请稍后刷新。可以从首页的手动推荐入口访问 Git 动画和 Protomaps。";
      if (featureGrid) featureGrid.hidden = true;
      if (fallback) fallback.hidden = false;
    }
  }
  load();
})();
