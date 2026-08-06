/* FinCalc Hub — shared chrome (header, footer, helpers)
   Keeps every page consistent without a build step. */

(function () {
  "use strict";

  // ---- Site config -------------------------------------------------------
  // NOTE: The Google AdSense loader lives directly in each page's <head>
  // (AdSense requires that). This ID is only used for the JS-rendered
  // <ins> ad units below. Keep both in sync when you get approved.
  var SITE = {
    name: "FinCalc Hub",
    tagline: "Free Loan & Finance Calculators",
    // TODO: after AdSense approval, replace with your real publisher ID
    // (looks like ca-pub-1234567890123456). Also update it in each page's
    // <head> loader script and in /ads.txt.
    adsenseClient: "ca-pub-XXXXXXXXXXXXXXXX"
  };

  var NAV = [
    { href: "loan-calculator.html", label: "Loan" },
    { href: "mortgage-calculator.html", label: "Mortgage" },
    { href: "auto-loan-calculator.html", label: "Auto Loan" },
    { href: "compound-interest-calculator.html", label: "Compound Interest" },
    { href: "percentage-calculator.html", label: "Percentage" }
  ];

  // depth-aware base path so it works from / and from any subfolder
  function base() {
    return document.body.getAttribute("data-base") || "";
  }

  function renderHeader() {
    var host = document.getElementById("site-header");
    if (!host) return;
    var b = base();
    var links = NAV.map(function (n) {
      return '<a href="' + b + n.href + '">' + n.label + "</a>";
    }).join("");
    host.innerHTML =
      '<div class="container nav">' +
        '<a class="brand" href="' + b + 'index.html" aria-label="' + SITE.name + ' home">' +
          '<span class="logo">₵</span><span>' + SITE.name + "</span>" +
        "</a>" +
        '<button class="nav-toggle" aria-label="Toggle menu" aria-expanded="false">☰</button>' +
        '<nav class="nav-links" id="nav-links">' + links + "</nav>" +
      "</div>";

    var toggle = host.querySelector(".nav-toggle");
    var menu = host.querySelector("#nav-links");
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function renderFooter() {
    var host = document.getElementById("site-footer");
    if (!host) return;
    var b = base();
    var year = new Date().getFullYear();
    host.innerHTML =
      '<div class="container">' +
        '<div class="footer-grid">' +
          "<div style='max-width:280px'>" +
            "<h4>" + SITE.name + "</h4>" +
            "<p style='color:#94a3b8;font-size:.9rem;margin:0'>" +
              "Fast, free and accurate calculators for loans, mortgages, savings and everyday math. No sign-up required." +
            "</p>" +
          "</div>" +
          "<div><h4>Calculators</h4><ul>" +
            NAV.map(function (n) {
              return "<li><a href='" + b + n.href + "'>" + n.label + " Calculator</a></li>";
            }).join("") +
          "</ul></div>" +
          "<div><h4>Site</h4><ul>" +
            "<li><a href='" + b + "index.html'>Home</a></li>" +
            "<li><a href='" + b + "about.html'>About</a></li>" +
            "<li><a href='" + b + "privacy.html'>Privacy Policy</a></li>" +
            "<li><a href='" + b + "contact.html'>Contact</a></li>" +
          "</ul></div>" +
        "</div>" +
        "<div class='fine'>" +
          "© " + year + " " + SITE.name + ". For general information only — not financial advice. " +
          "Results are estimates; verify important figures with a professional." +
        "</div>" +
      "</div>";
  }

  // ---- Formatting helpers (exposed for page scripts) --------------------
  window.FC = {
    money: function (n, dp) {
      if (!isFinite(n)) return "—";
      return "$" + Number(n).toLocaleString("en-US", {
        minimumFractionDigits: dp === undefined ? 2 : dp,
        maximumFractionDigits: dp === undefined ? 2 : dp
      });
    },
    num: function (n, dp) {
      if (!isFinite(n)) return "—";
      return Number(n).toLocaleString("en-US", {
        minimumFractionDigits: dp || 0,
        maximumFractionDigits: dp === undefined ? 2 : dp
      });
    },
    // Standard amortized payment: P * r / (1 - (1+r)^-n)
    payment: function (principal, annualRatePct, months) {
      var r = (annualRatePct / 100) / 12;
      if (months <= 0) return NaN;
      if (r === 0) return principal / months;
      return (principal * r) / (1 - Math.pow(1 + r, -months));
    },
    config: SITE
  };

  document.addEventListener("DOMContentLoaded", function () {
    renderHeader();
    renderFooter();
  });
})();
