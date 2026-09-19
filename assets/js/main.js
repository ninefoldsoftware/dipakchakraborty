/* =========================================================
   Dipak Chakraborty — coaching site
   All behaviour lives here. No inline scripts in the HTML.
   ========================================================= */
(function () {
  "use strict";

  /* -------------------------------------------------------
     0. Config — your WhatsApp number lives in ONE place.
     ------------------------------------------------------- */
  var WHATSAPP_NUMBER = "918420361178"; // [EDIT] country code + number, no + or spaces
  var DEFAULT_MESSAGE = "Hi! I found your website and I'd like to know more about your coaching classes.";

  function waLink(message) {
    var text = encodeURIComponent(message || DEFAULT_MESSAGE);
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + text;
  }

  /* -------------------------------------------------------
     0b. COURSES — this is the list to edit.
     Add one object per course you teach. Only "icon" and "name" are
     required to show a card; everything else can start blank and be
     filled in whenever you're ready — the card will still work, it
     will just show "Coming soon" in the modal until you fill it in.

     icon        - a path to an image under assets/img/ (e.g. "assets/img/course-excel.svg"),
                   OR an emoji if you prefer
     name        - the course title shown on the card and in the modal
     duration    - e.g. "3 months" / "12 weeks"
     fee         - e.g. "₹4,999" or "₹4,999 / month"
     description - a short paragraph about what the course covers
     formLink    - your Google Form link for this course's enrolment
     ------------------------------------------------------- */
  var COURSES = [
    // [EDIT] Replace these with your real courses — duplicate the
    // block for each additional course.
    {
      icon: "assets/img/course-excel.svg",
      name: "Excel + Power BI",
      duration: "8 weeks · 2 live online sessions per week",
      description: "Learn Excel and Power BI together — go from spreadsheets and formulas to interactive dashboards and reports. Live online classes, plus practice datasets and weekly assignments. Ideal for analysts, students and professionals who want data skills they can use on projects and at work.",
      formLink: "https://docs.google.com/forms/d/e/1FAIpQLSc-rM3LUY51y9bx7H8z7UJD2ttCij0ZNLzUzCD9Ce1YjmMyDg/viewform"
    },
    {
      icon: "assets/img/course-ml.svg",
      name: "Machine Learning with Python",
      duration: "10 weeks · 2 live online sessions per week",
      description: "Build practical machine learning skills from scratch in Python — Python for data analysis, then core ML models like regression, classification and clustering, and end with a final project. Live online classes, Jupyter notebooks and weekly coding assignments.",
      formLink: "https://docs.google.com/forms/d/e/1FAIpQLSeSBc2AfJjEIG23x5DhOstSBD_vKupJA90i624Q4LRMCKWN6Q/viewform"
    }
  ];

  function escapeHTML(str) {
    var div = document.createElement("div");
    div.textContent = str == null ? "" : str;
    return div.innerHTML;
  }

  /* -------------------------------------------------------
     1. Wire up every generic WhatsApp CTA on the page
     ------------------------------------------------------- */
  function wireWhatsAppButtons() {
    var generic = [
      document.getElementById("waHeaderBtn"),
      document.getElementById("waFinalBtn"),
      document.getElementById("waFloat"),
      document.getElementById("waFooterBtn")
    ];
    generic.forEach(function (el) {
      if (el) el.setAttribute("href", waLink());
    });

    // Keep footer phone number display in sync with the config above
    var footerPhone = document.getElementById("footerPhone");
    if (footerPhone) {
      var n = WHATSAPP_NUMBER.replace(/^91/, "");
      footerPhone.textContent = "+91 " + n.slice(0, 5) + " " + n.slice(5);
    }
  }

  /* -------------------------------------------------------
     2. Mobile nav toggle
     ------------------------------------------------------- */
  function setupNav() {
    var toggle = document.getElementById("navToggle");
    var nav = document.getElementById("mainNav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* -------------------------------------------------------
     3. Enquiry form — collects name / phone / course / message
        and opens WhatsApp with everything pre-filled
     ------------------------------------------------------- */
  function setupEnquiryForm() {
    var form = document.getElementById("enquiryForm");
    var select = document.getElementById("enquiryCourse");
    if (!form) return;

    var nameInput = form.querySelector('input[name="name"]');
    var phoneInput = form.querySelector('input[name="phone"]');
    var msgInput = form.querySelector('textarea[name="message"]');

    if (select) {
      var allOptions = [{ name: "General enquiry" }].concat(COURSES);
      select.innerHTML = allOptions
        .map(function (c) {
          return '<option value="' + escapeHTML(c.name) + '">' + escapeHTML(c.name) + "</option>";
        })
        .join("");
    }

    function markInvalid(field, bad) {
      var wrap = field.closest(".form-field");
      if (wrap) wrap.classList.toggle("is-invalid", bad);
      return bad;
    }

    function clearInputError(field) {
      if (!field) return;
      field.addEventListener("input", function () {
        markInvalid(field, !field.value.trim());
      });
    }
    clearInputError(nameInput);
    clearInputError(phoneInput);

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var nameVal = (nameInput && nameInput.value || "").trim();
      var phoneVal = (phoneInput && phoneInput.value || "").trim();
      var msgVal = msgInput ? msgInput.value.trim() : "";
      var courseVal = select ? select.options[select.selectedIndex].value : "General enquiry";

      var nameOk = !nameInput || nameVal ? true : markInvalid(nameInput, true);
      var phoneOk = !phoneInput || phoneVal ? true : markInvalid(phoneInput, true);
      if (!nameOk || !phoneOk) {
        if (nameInput && !nameVal) nameInput.focus();
        else if (phoneInput) phoneInput.focus();
        return;
      }

      var text =
        "New enquiry from your website\n\n" +
        "Name: " + nameVal + "\n" +
        "WhatsApp number: " + phoneVal + "\n" +
        "Course: " + courseVal +
        (msgVal ? "\nMessage: " + msgVal : "");

      window.open(waLink(text), "_blank", "noopener");
      form.reset();
    });
  }

  /* -------------------------------------------------------
     4. Video modal — click a video card to play it inline
     ------------------------------------------------------- */
  function setupVideoModal() {
    var modal = document.getElementById("videoModal");
    var frame = document.getElementById("videoModalFrame");
    var backdrop = document.getElementById("videoModalBackdrop");
    var closeBtn = document.getElementById("videoModalClose");
    var cards = document.querySelectorAll(".video-card[data-video]");
    if (!modal || !frame || !cards.length) return;

    function openModal(videoId) {
      // The pop-up player is built from the video ID automatically.
      // The card's data-video="<ID>" (in index.html) flows in as `videoId`
      // and is dropped into the standard YouTube embed URL:
      //
      //   https://www.youtube.com/embed/<VIDEO ID>?autoplay=1&rel=0&playsinline=1
      //
      // So you never touch this file to add a video — just paste your ID
      // into data-video on the card in index.html and both the thumbnail and
      // the player pick it up.
      //
      // ⚠ ERROR 153 ("Video player configuration error") — before changing
      // anything, know this is almost always YouTube-side, NOT your video link:
      //   1. YouTube now requires the browser to send an HTTP Referer header
      //      for embeds. That works automatically once the site is ONLINE.
      //   2. If you preview this page by double-clicking index.html (file://),
      //      no Referer is sent → every embed shows error 153. Published on
      //      GitHub Pages (or any host), the same videos play fine.
      //   3. Also verify each video is Public on YouTube and embedding is
      //      allowed (YouTube Studio → Content → Video → Embedding → Allow).
      //      Private/age-restricted videos show 153 too.
      // The referrerpolicy attribute below is what YouTube's own embed code
      // includes — it tells the browser "send the page address as Referer" so
      // YouTube accepts the player. Keep it.

      // Extra URL options you could append (after ?autoplay=1, with &):
      //   &rel=0             don't show related videos when a video ends
      //   &playsinline=1     keep playback inside the page on phones (no fullscreen takeover)
      //   &start=30          start the video at 30 seconds
      frame.innerHTML =
        '<iframe src="https://www.youtube.com/embed/' + videoId +
        '?autoplay=1&rel=0&playsinline=1" title="YouTube video" ' +
        'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ' +
        'referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
      modal.hidden = false;
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    }

    function closeModal() {
      modal.hidden = true;
      frame.innerHTML = ""; // stops playback
      document.body.style.overflow = "";
    }

    cards.forEach(function (card) {
      card.addEventListener("click", function () {
        openModal(card.getAttribute("data-video"));
      });
    });

    backdrop.addEventListener("click", closeModal);
    closeBtn.addEventListener("click", closeModal);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !modal.hidden) closeModal();
    });
  }

  /* -------------------------------------------------------
     5. Courses — render cards from COURSES, open a detail modal
     ------------------------------------------------------- */
  function isImagePath(icon) {
    return /\.(png|jpe?g|svg|webp|gif)$/i.test(icon || "");
  }

  function renderCourses() {
    var grid = document.getElementById("courseGrid");
    if (!grid) return;

    grid.innerHTML = COURSES.map(function (course, i) {
      var iconHTML = isImagePath(course.icon)
        ? '<img src="' + escapeHTML(course.icon) + '" alt="">'
        : escapeHTML(course.icon || "🎓");

      return (
        '<button class="course-card" data-index="' + i + '">' +
          '<span class="course-card-icon">' + iconHTML + "</span>" +
          '<span class="course-card-name">' + escapeHTML(course.name || "Untitled course") + "</span>" +
          '<span class="course-card-hint">View details →</span>' +
        "</button>"
      );
    }).join("");
  }

  function setupCourseModal() {
    var modal = document.getElementById("courseModal");
    var backdrop = document.getElementById("courseModalBackdrop");
    var closeBtn = document.getElementById("courseModalClose");
    var iconEl = document.getElementById("courseModalIcon");
    var nameEl = document.getElementById("courseModalName");
    var fieldsEl = document.getElementById("courseModalFields");
    var enrolBtn = document.getElementById("courseModalEnroll");
    var waBtn = document.getElementById("courseModalWhatsapp");
    if (!modal) return;

    function fieldRow(label, value) {
      var shown = value && String(value).trim()
        ? escapeHTML(value)
        : '<span class="field-empty">Coming soon</span>';
      return (
        '<div class="field-row">' +
          "<dt>" + escapeHTML(label) + "</dt>" +
          "<dd>" + shown + "</dd>" +
        "</div>"
      );
    }

    function openModal(course) {
      iconEl.innerHTML = isImagePath(course.icon)
        ? '<img src="' + escapeHTML(course.icon) + '" alt="">'
        : escapeHTML(course.icon || "🎓");
      nameEl.textContent = course.name || "Untitled course";

      fieldsEl.innerHTML =
        fieldRow("About this course", course.description);

      enrolBtn.setAttribute("href", course.formLink || "#");
      waBtn.setAttribute(
        "href",
        waLink('Hi! I\'m interested in "' + (course.name || "your course") + '". Could you share more details?')
      );

      modal.hidden = false;
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    }

    function closeModal() {
      modal.hidden = true;
      document.body.style.overflow = "";
    }

    document.addEventListener("click", function (e) {
      var card = e.target.closest(".course-card");
      if (!card) return;
      var index = parseInt(card.getAttribute("data-index"), 10);
      if (!isNaN(index) && COURSES[index]) openModal(COURSES[index]);
    });

    backdrop.addEventListener("click", closeModal);
    closeBtn.addEventListener("click", closeModal);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !modal.hidden) closeModal();
    });
  }

  /* -------------------------------------------------------
     6. Misc: footer year
     ------------------------------------------------------- */
  function setupYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* -------------------------------------------------------
     Init
     ------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    wireWhatsAppButtons();
    setupNav();
    setupEnquiryForm();
    setupVideoModal();
    renderCourses();
    setupCourseModal();
    setupYear();
  });
})();
