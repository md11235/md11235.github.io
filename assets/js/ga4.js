---
layout: null
---
/* GA4 loader. Configure ga4_measurement_id in _config.yml.
 * Disabled when no measurement ID is configured.
 * Shared by Jekyll layouts and standalone HTML pages.
 */
(function () {
  "use strict";
  var measurementId = {{ site.ga4_measurement_id | default: '' | jsonify }};
  if (typeof measurementId !== "string" || !/^G-[A-Z0-9]+$/.test(measurementId)) return;
  if (window.__samGa4Initialized) return;
  window.__samGa4Initialized = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", measurementId, { anonymize_ip: true });

  var script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(measurementId);
  document.head.appendChild(script);
})();
