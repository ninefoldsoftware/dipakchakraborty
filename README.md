# Coaching & YouTube site

A lightweight, mobile-friendly one-page site for your coaching classes and
YouTube videos, with a WhatsApp button that follows the visitor down the page.
No build tools — just HTML, CSS and JS.

## Files

```
index.html            the whole page
assets/css/style.css  all styling
assets/js/main.js     nav toggle, WhatsApp links, video pop-up, counters
assets/img/           your photo (webp + png fallback)
```

## What to personalise before you publish

Open `index.html` and search for the word `[EDIT]` — every spot that needs
your real details is marked, including:

- Your name and bio (`about` section)
- Your subject / what you coach (hero subtext)
- Your YouTube channel link and video IDs (`videos` section — the video ID is
  the part after `v=` in a normal YouTube URL, e.g.
  `youtube.com/watch?v=ABC123` → ID is `ABC123`)
- Testimonials

Your WhatsApp number is already set to **8420361178** (with India's `+91`) in
`assets/js/main.js` at the top, in one place:

```js
var WHATSAPP_NUMBER = "918420361178";
```

Every "Message me" / floating WhatsApp button / "Talk to Instructor" button
on the site pulls from that one line, so update it there if the number ever
changes.

## Adding your courses

Courses are the centrepiece of the page. You don't edit `index.html` for
these — everything lives in one list near the top of `assets/js/main.js`,
called `COURSES`:

```js
var COURSES = [
  {
    icon: "assets/img/course-excel.svg",  // icon image path (or an emoji)
    name: "Course Name 1",      // shown on the card and in the pop-up
    duration: "",               // e.g. "3 months"
    fee: "",                    // e.g. "₹4,999 / month"
    description: "",            // a short paragraph about the course
    formLink: "https://forms.google.com/your-form-link-1"
  },
  // add as many of these blocks as you have courses
];
```

How it works on the live site:

- Each course becomes a card in the **Courses** section automatically —
  nothing to do in the HTML.
- Clicking a card opens a floating window showing **Duration** and
  **About this course**. Any field you leave blank shows
  "Coming soon" until you fill it in, so it's safe to publish before every
  course is fully written up.
- Two buttons sit at the bottom of that window: **Enroll** opens the
  `formLink` you set (point this at your Google Form for that course), and
  **Talk to Instructor** opens WhatsApp with a message that already names
  the course.
- For the icon, either paste an emoji, or drop an image file into
  `assets/img/` (e.g. `assets/img/course-python.png`) and set `icon` to that
  path — the site detects image paths automatically.

To set up each course's Google Form, create one form per course in Google
Forms, click **Send**, choose the link icon, and paste that link in as the
course's `formLink`.

## Publishing on GitHub Pages

1. Create a new repository on GitHub (e.g. `my-coaching-site`).
2. Upload these files keeping the same folder structure (`index.html` must
   sit in the root of the repo, not inside a subfolder).
3. In the repo, go to **Settings → Pages**.
4. Under "Build and deployment", set **Source** to `Deploy from a branch`,
   pick the `main` branch and the `/ (root)` folder, then **Save**.
5. Wait a minute or two — GitHub will give you a link like
   `https://yourusername.github.io/my-coaching-site/`. That's your live site.

If you'd rather use the site at `yourusername.github.io` directly (no
sub-path), name the repository exactly `yourusername.github.io`.

## Notes

- The site is a single page with sections (`#videos`, `#courses`, etc.) — the
  nav links jump to them, so you don't need separate pages unless you want to
  grow the site later.
- Video thumbnails load from YouTube directly, so there's nothing to upload
  for those — just the video ID.
- Your photo is included as both `.webp` (small, used first) and `.png`
  (fallback for older browsers).
# dipakchakraborty
