/* ==========================================================================
   ALESSIA CANUTO — SITE JAVASCRIPT
   --------------------------------------------------------------------------
   Everything interactive on the site lives in this one file:

     1. Mobile navigation toggle
     2. Reveal-on-scroll animations
     3. Animated statistics (count-up numbers)
     4. Category filters (Work page)
     5. Year filters + map highlighting (Journey page)
     6. Contact form: pre-typed messages + mailto submission

   Each part checks whether its elements exist on the current page,
   so the same file can safely be loaded everywhere.
   ========================================================================== */

(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------
     1. MOBILE NAVIGATION
     ------------------------------------------------------------------ */
  var navToggle = document.querySelector(".nav-toggle");
  var navLinks = document.querySelector(".nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      navToggle.textContent = isOpen ? "Close" : "Menu";
    });
  }

  /* ------------------------------------------------------------------
     1b. HEADER HAIRLINE
     The header's bottom border only appears once the page is scrolled,
     so the top of each page starts perfectly clean.
     ------------------------------------------------------------------ */
  var header = document.querySelector(".site-header");
  if (header) {
    var headerTicking = false;
    var updateHeader = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
      headerTicking = false;
    };
    window.addEventListener("scroll", function () {
      if (!headerTicking) {
        headerTicking = true;
        requestAnimationFrame(updateHeader);
      }
    }, { passive: true });
    updateHeader();
  }

  /* ------------------------------------------------------------------
     1c. PRINTING
     Before printing, open every accordion so nothing is hidden on
     paper; afterwards, close the ones we opened.
     ------------------------------------------------------------------ */
  window.addEventListener("beforeprint", function () {
    document.querySelectorAll(".accordion details:not([open])").forEach(function (d) {
      d.setAttribute("data-print-opened", "");
      d.open = true;
    });
  });
  window.addEventListener("afterprint", function () {
    document.querySelectorAll("[data-print-opened]").forEach(function (d) {
      d.open = false;
      d.removeAttribute("data-print-opened");
    });
  });

  /* ------------------------------------------------------------------
     2. REVEAL ON SCROLL
     Elements with class "reveal" fade in when they enter the viewport.
     With reduced motion (or old browsers) everything is shown at once.
     ------------------------------------------------------------------ */
  var revealEls = document.querySelectorAll(".reveal");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ------------------------------------------------------------------
     2b. WORD-BY-WORD HEADLINE REVEAL
     Headings with data-split have each word wrapped in a masked span,
     then the words rise into place with a slight stagger when the
     heading scrolls into view. Skipped entirely under reduced motion
     (the heading simply appears, fully readable).
     ------------------------------------------------------------------ */
  var splitEls = document.querySelectorAll("[data-split]");

  function wrapWord(contents) {
    var mask = document.createElement("span");
    mask.className = "split-mask";
    var word = document.createElement("span");
    word.className = "split-word";
    mask.appendChild(word);
    word.appendChild(contents);
    return mask;
  }

  function splitWords(el) {
    Array.prototype.slice.call(el.childNodes).forEach(function (node) {
      if (node.nodeType === 3) {
        // Text node: wrap each word, keep the spaces between them
        var frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part));
          } else {
            frag.appendChild(wrapWord(document.createTextNode(part)));
          }
        });
        el.replaceChild(frag, node);
      } else if (node.nodeType === 1 && node.tagName !== "BR") {
        // Element node (e.g. an <em> phrase): treat it as one unit
        var placeholder = document.createTextNode("");
        el.replaceChild(placeholder, node);
        el.replaceChild(wrapWord(node), placeholder);
      }
    });
    // Stagger the words, capped so long headings don't take forever
    var words = el.querySelectorAll(".split-word");
    for (var i = 0; i < words.length; i++) {
      words[i].style.transitionDelay = Math.min(i * 70, 600) + "ms";
    }
  }

  if (splitEls.length && !prefersReducedMotion && "IntersectionObserver" in window) {
    splitEls.forEach(splitWords);
    var splitObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("split-visible");
            splitObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0 }
    );
    splitEls.forEach(function (el) { splitObserver.observe(el); });
  } else {
    // No animation: make sure any drawn underlines still appear
    splitEls.forEach(function (el) { el.classList.add("split-visible"); });
  }

  /* ------------------------------------------------------------------
     3. ANIMATED STATISTICS
     Any element like <span data-count="42" data-suffix="K+">42K+</span>
     counts up from zero when scrolled into view.
     ------------------------------------------------------------------ */
  var counters = document.querySelectorAll("[data-count]");

  function runCounter(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var prefix = el.getAttribute("data-prefix") || "";
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1400; // ms
    var start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      // ease-out curve so the number slows down as it lands
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if (counters.length) {
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      // Leave the final numbers as written in the HTML.
    } else {
      var counterObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              runCounter(entry.target);
              counterObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );
      counters.forEach(function (el) { counterObserver.observe(el); });
    }
  }

  /* ------------------------------------------------------------------
     4. CATEGORY FILTERS (Work page)
     Buttons carry data-filter="esg" etc.; items carry
     data-categories="esg ai research". "all" shows everything.
     ------------------------------------------------------------------ */
  var filterBar = document.querySelector("[data-filter-bar]");

  if (filterBar) {
    var filterButtons = filterBar.querySelectorAll(".filter-btn");
    var filterItems = document.querySelectorAll("[data-categories]");

    filterButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var filter = btn.getAttribute("data-filter");

        filterButtons.forEach(function (b) {
          b.setAttribute("aria-pressed", b === btn ? "true" : "false");
        });

        filterItems.forEach(function (item) {
          var cats = item.getAttribute("data-categories").split(/\s+/);
          var show = filter === "all" || cats.indexOf(filter) !== -1;
          item.classList.toggle("is-filtered-out", !show);
        });
      });
    });
  }

  /* ------------------------------------------------------------------
     5. JOURNEY PAGE — year filters + map highlighting
     Year buttons carry data-year="2024". Cities on the SVG map carry
     data-city="rome". Panels carry data-year-panel="2024" and list
     their active cities in data-cities="rome brussels".
     ------------------------------------------------------------------ */
  var yearBar = document.querySelector("[data-year-bar]");

  if (yearBar) {
    var yearButtons = yearBar.querySelectorAll(".filter-btn");
    var yearPanels = document.querySelectorAll("[data-year-panel]");
    var mapCities = document.querySelectorAll(".journey-map .city");

    function activateYear(year) {
      yearButtons.forEach(function (b) {
        b.setAttribute("aria-pressed", b.getAttribute("data-year") === year ? "true" : "false");
      });

      var activeCities = [];
      yearPanels.forEach(function (panel) {
        var isActive = panel.getAttribute("data-year-panel") === year;
        panel.classList.toggle("is-active", isActive);
        if (isActive) {
          activeCities = (panel.getAttribute("data-cities") || "").split(/\s+/);
        }
      });

      mapCities.forEach(function (city) {
        var id = city.getAttribute("data-city");
        var highlight = year === "all" || activeCities.indexOf(id) !== -1;
        city.classList.toggle("is-active", year !== "all" && highlight);
        city.classList.toggle("is-dim", year !== "all" && !highlight);
      });
    }

    yearButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        activateYear(btn.getAttribute("data-year"));
      });
    });

    activateYear("all");
  }

  /* ------------------------------------------------------------------
     6. CONTACT FORM
     a) When a topic is chosen, a suggested opening is inserted into the
        message box — but only if the visitor hasn't already typed
        something of their own (so we never overwrite their words).
     b) On submit, the form composes an email in the visitor's own
        email app (mailto:). No server needed.
     ------------------------------------------------------------------ */
  var contactForm = document.querySelector("[data-contact-form]");

  if (contactForm) {
    var topicSelect = contactForm.querySelector("#topic");
    var messageBox = contactForm.querySelector("#message");
    var lastInserted = "";

    // EDIT THE PRE-TYPED MESSAGES HERE.
    // The keys must match the <option value="..."> values in contact.html.
    var starters = {
      policy:
        "Hi Alessia,\n\nI'm reaching out because I'd like to discuss a potential opportunity related to policy / public affairs...",
      esg:
        "Hi Alessia,\n\nI'm reaching out regarding a potential opportunity related to ESG / sustainability...",
      ai:
        "Hi Alessia,\n\nI'm reaching out because I'd like to discuss a potential opportunity related to AI governance / responsible technology...",
      research:
        "Hi Alessia,\n\nI'm reaching out to explore a potential research collaboration...",
      speaking:
        "Hi Alessia,\n\nI'm reaching out about a potential speaking or event opportunity...",
      collaboration:
        "Hi Alessia,\n\nI'm reaching out because I'd like to explore a potential collaboration...",
      other:
        "Hi Alessia,\n\n"
    };

    if (topicSelect && messageBox) {
      topicSelect.addEventListener("change", function () {
        var starter = starters[topicSelect.value];
        if (!starter) return;
        // Only replace the box if it is empty or still holds a previous
        // suggestion — never overwrite something the visitor typed.
        if (messageBox.value.trim() === "" || messageBox.value === lastInserted) {
          messageBox.value = starter;
          lastInserted = starter;
        }
      });
    }

    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      var name = (contactForm.querySelector("#name") || {}).value || "";
      var org = (contactForm.querySelector("#organisation") || {}).value || "";
      var email = (contactForm.querySelector("#email") || {}).value || "";
      var topicLabel = topicSelect
        ? topicSelect.options[topicSelect.selectedIndex].text
        : "";
      var message = messageBox ? messageBox.value : "";

      var subject = "Website enquiry — " + (topicLabel || "General");
      var bodyLines = [
        message,
        "",
        "—",
        "Name: " + name,
        org ? "Organisation: " + org : null,
        "Email: " + email
      ].filter(Boolean);

      window.location.href =
        "mailto:alessiacanuto@hotmail.com" +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(bodyLines.join("\n"));

      // Let the visitor know what just happened (the note is aria-live,
      // so screen readers announce it too).
      var statusNote = contactForm.querySelector("[data-form-status]");
      if (statusNote) {
        statusNote.textContent =
          "Your email app should now be open with the message ready — nothing is sent until you press send there.";
      }
    });
  }
})();
