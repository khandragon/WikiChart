---
title:  '420-423-DW JavaScript'
date: 2018-03-04-16
author:
- Maja Frydrychowicz
---

<table style="font-weight:bold;">
<tr style="height:32px;">
<td style="width:220px;">ID</td>
<td style="width:380px">Last Name</td>
</tr>
<tr style="height:32px;">
<td style="width:220px;">DD/MM/YY</td>
<td style="width:380px">First Name</td>
</tr>
</table>

# Project 2: WikiChart (Draft)

<div style="height:140px; width:140px; border:solid 1px; float:right;">Total grade (/20)</div>

Any use of libraries or external code beyond what is explicitly authorized in the spec will result
in a max grade of 10/20.

Additional feedback may be provided in comments on your GitLab Merge Request.

### Cross-Browser Behaviour, Graceful Degradation (2 points)

*   Chrome, Edge, Firefox, Opera
*   IE 11
*   IE < 9 (As emulated by Document Mode 8 in IE 11) (Tabbed Layout)
*   Basic functionality intact when JavaScript is disabled (except IE < 9).
    Tabbed layout falls back to anchored sections.
*   Specific IE < 9 workaround for display of HTML5 elements.

### Overall Code Style, Comments, Structure (3 points)

* Consistency, eslint rules as enforced by Atom in labs. Descriptive identifiers.
* Modular code; avoid giant do-everything functions, isolation of your app's data from window
  object and other scripts, avoid unnecessary globals.
* Using appropriate validation and conditionals to prevent error conditions.
* Clear directory structure, file names, presence of `index.html` in root, separate JS files.
* Appropriate use of JSDoc comments for functions.
* All JavaScript is external.
* No event handler properties or attributes (onevent)
* Comments appear _above_ the code they refer to. Comments describe programmer's intent, not code.
* No use of `alert`, `console.log` in final submission.
* All Ajax requests are asynchronous

### Correctness of HTML/CSS (2 points)

* Valid HTML and CSS, doctype. HTML5 best-practices: meta, semantic elements, logical structure
* Separation of document style and content
* Consistent code style, descriptive identifiers, avoid long lines (<100 cols)
* No redundant CSS rules, dead code

<div style="height:25px"></div>

### Visual Presentation, Tabbed Layout (3 points)

* Cross-browser (IE <9) tabbed layout and "Back to Top" fixed anchor.
* Required views are present: top articles, saved articles, activity chart.
* Consistent design (colour, font, navigation) that is clear, easy to follow
* Accessible to audience with different abilities (e.g. low/impaired vision)
* Looks good in both narrow screens (e.g. 412 x 732 Nexus 6) and wide screens (desktop monitor)
* User experience: clear instructions are provided for every feature.

<div style="height:25px"></div>

### Top Articles (3 points)

API requests based on a form, encoding, validation
Save prefs button (localStorage)
Caching API requests for one day, not caching unnecessary data
Sending api user agent in header
Showing url, title, summary, views

### Saved Articles (2 points)

Checkbox/star in top-articles and saved-articles
Local storage
Encoding/decoding/validating the data

### Frequent Visitor (2 point)

Cookie expires after one week
Disappearing message

### Activity Chart (1 point)

API requests and Chart.js

### Publication (2 points)

* Landing page can be accessed at `sonic.dawsoncollege.qc.ca/~username/js423-project-2`
* Landing page can be accessed at `js423-2018-project2.gitlab.io/yourprojectname`
* git: brief, consistent commit messages that start with an imperative
  verb: e.g. "Add main page navigation."
* README.md

<div style="height:20px"></div>
