---
title:  'Project 2 (Karaoke) - 420-423-DW Internet Applications II'
date: 2018-03-03
author:
- Maja Frydrychowicz
keywords:
-
abstract: |

---

# Project 2 WikiChart

__This is a graded assignment.__

--------------
Due Monday, May 14th (midnight) (12.5%)
--------------

## Overview

The goal of this project is to use the [Wikimedia REST API](https://www.mediawiki.org/wiki/REST_API) to highlight particularly
popular Wikipedia articles and display some interesting data about them.

When deciding what to build and how to build it, consider the audience's possible
demographics: age, sex, language, abilities/disabilities (e.g. eyesight), background knowledge, etc.

__Read the whole spec and grading scheme before you start and ask questions about it. This spec is not a step-by-step guide, it only describes requirements. It's up to you to choose the right tools
and algorithms.__

## git repository

Work in the git repository created for you by your teacher. (You have been added as a
team member to something like `https://gitlab.com/JS423-2018-Project2/yourname`.)

Add a `submission` branch -- this is the branch you will create a Merge Request with.

## Views, Presentation

The website should have 4 views:

1. Top Articles: this is the first thing visitors should see
2. Saved Articles
3. Activity Chart
4. About: description of the project and references to libraries and APIs used.

Feel free to use any CSS techniques you like as long as:

* The design adapts well to both narrow and wide screens,
* All pages display correctly across major browsers, including IE < 9. (Specific requirements
  for IE < 9 are included below.)

Keep it simple. :) The JS part of the project is significant, so use your time wisely.

### Cross-Browser Tabbed Layout

All three views should be shown in __one__ HTML document. The default/first view should be
"Top Articles".

In __all__ browsers, including IE 8, the layout should simulate a "tabbed menu" at the top or
side of the page, where each view corresponds to one "tab content", and only one "tab content"
is visible at a time. The user switches tabs by clicking on a tab title.
_The tab switching needs to be implemented using JavaScript._

If JavaScript is disabled, the tab menu is still visible, but all three views are visible
at the same time and clicking on a tab simply jumps to that part of the page with an internal
anchor.

Each view should have a heading, but that heading should only be visible if JavaScript
is disabled. (Otherwise, the tab title serves as the heading.)

In addition, there should be a fixed-position link in the bottom-right corner of the
screen that allows the user to jump to the top of the document. Make sure this link
never obscures any other content and that it's always visible, even when the user scrolls
to different parts of the page.

## Cross-Browser Behaviour, Graceful Degradation, Design

Test on the latest versions of the following browsers:

* Chrome
* Opera
* Firefox
* Edge
* IE

Also test the following:

* IE < 9 (As emulated by Document Mode 8 in the latest version of IE)
* Basic functionality is intact when JavaScript is disabled

See the __Resources__ section for cross-browser quality tools.

The appearance and behaviour does not have to be _exactly_ the same in old browser versions or
when JavaScript is disabled (that's impossible), but core functionality should be present:

*   All essential content is displayed clearly, the layout can be different but it shouldn't be
    broken or ugly.
*   Features that absolutely depend on JavaScript should be replaced with informative messages
    indicating that JavaScript is required. (More details below.)

In addition, your app should:

*   Provide instructions on how to use website features (i.e. explain how to interact with
    your app and explain what your app is showing)
*   Be accessible to an audience with different abilities (e.g. low/impaired vision)
    *   Use semantic tags for logical structure not appearance (e.g. don't use tables to design a
        layout).
    *   Use alt text for all media elements
    *   Label all form fields
    *   Use headings (h1-h6) for logical structure, not for text size.
    *   More tips on the above are available at <https://www.marcozehe.de/2015/12/14/the-web-accessibility-basics/>
*   Look good in both narrow screens (e.g. 412 x 732 Nexus 6) and wide screens (desktop monitor)
    *   Use browser developer tools to emulate different resolutions.
    *   Test how your app adapts when you resize the browser window.

### IE 8 and 9

Your Ajax requests won't work in IE <= 9 because they are cross-domain. You will see an
"Access Denied" error in the console when you run code that makes requests to the Mediawiki API.
Therefore, you should disable
certain features of your web app accordingly (basically anything that depends on wiki data) and display a message to the user.

* The simplest way to detect IE 8 (and other very old browsers) in JavaScript is to check
  whether `addEventListener` is present.
* The simplest way to detect IE 9 in JavaScript is check whether the "range" type of input is
  supported. See `U.supportsInput("range")` in `utilities.js`.

Aside from not supporting newer JavaScript features, old browsers don't render HTML5 elements
correctly or at all! We can use some CSS and JavaScript workarounds to compensate, but if the user
also disables JavaScript in their settings, then your web app will look very broken. There's
nothing you can do about this, it's okay. In summary: __if JavaScript is disabled on IE < 9, a large
part of your website won't work and your HTML/CSS won't look right, which is fine as long as the
core information is still legible__.

However, when JavaScript is enabled, any feature that doesn't depend on the Mediawiki API, even on
IE 9. You should use the provided `utilities.js` to achieve this. In addition, for HTML5 support
you need to take the following steps:

1.  Ensure that this function is called __before__ the DOM is loaded, but __only__ on old browsers:

    ```JavaScript
    /** Teaches IE < 9 to recognize HTML5 elements. */
    function createDummyElements() {
      var semanticElements = [
        "article", "aside", "details", "figcaption", "figure",
        "footer", "header", "hgroup", "menu", "nav", "section"
      ];
      for (var i = 0; i < semanticElements.length; i++) {
        document.createElement(semanticElements[i]);
      }
    }
    ```

2.  Add this rule to your CSS to make HTML5 elements display correctly:

    ```CSS
    article,aside,details,figcaption,figure,
    footer,header,hgroup,menu,nav,section {
       display:block;
    }
    ```

If you're curious, the basis for these workarounds is explained very well in
[Dive Into HTML5](http://diveinto.html5doctor.com/semantics.html#unknown-elements).

### When JavaScript is Disabled

You should prominently display a __brief__, informative message to the user when JavaScript is
disabled. The message should simply explain in your own words that:

* JavaScript is disabled.
* Some features won't work unless JavaScript is enabled.
* The document uses HTML5 so on very old browsers like IE < 9, some parts won't be displayed
  correctly unless JavaScript is enabled.

### Tips: Progressive Enhancement

Use the _progressive enhancement_ approach: start by implementing the core, minimal look and
functionality first and test that in old and new browsers at various screen resolutions.

The minimal feature set is to display the essential text (and images, if any) clearly and to
indicate whenever something is disabled because it requires JavaScript or a particular browser
feature.

Once that works well, gradually add on more advanced features while regularly checking that
the core features are not broken in older browsers.

## Functional Requirements

This section describes requirements. For information about the Wikimedia REST API, go to the next
section.

### Top Articles

By default, display the 10 articles from `en.wikipedia.org` that have the most page views in the
previous day. The list should show:

* Article summary/extract
* Article title, linked to article URL
* Relevant picture (thumbnail), if available
* Number of views

You can display the above information in whatever way you think is best.

_Don't include articles like `Main_Page` or anything whose title starts with `Special:`_ since
those articles aren't very interesting to show.

The user should be able to interact with the Top Articles list in the following ways:

* Choose a date to look up for top articles. The most recent date may be yesterday. The oldest date
  may be July 2015.
* Choose how many articles to show (5, 10, or 20). Use a dropdown menu.
* Choose which language of wiki to search in (English, French). Use a dropdown menu.
* Allow user to save the above preferences. Provide a Save button.

In addition the user should be able to star articles for reading later. (See Saved Articles, below)

### Saved Articles

A user should be able to accumulate a list of saved articles. The list should be available to
them next time they visit the web app. This list should show:

* Article summary
* Article title, linked to article URL

In the "Top Articles" view, show an empty star next to each article by default. (A star image of
your choice will represent whether an article is "saved" or not.

When the user clicks on the star, the star should be filled to indicate that the article is saved.

In the "Saved Articles" view, load the list of saved articles.
Display some helpful message if no articles have been saved yet. Each article should have a
filled star next to it by default (since it's saved), and clicking on the filled star should mark
the article as read, i.e. delete it.

### Frequent Visitor

Use a cookie to track how many times a user has visited the app. If they have visited
more than ten times in the past week, display delightful thank-you message in a prominent place
in the document for 10 seconds. The appearance/disappearance of the message should not
disrupt the layout of the page (should not cause other elements to move).

### Activity Chart

(chart.js is only supported IE 10 and above. Display an informative message to the user if you
the necessary features are not available.)

The user should be able to search for an article title in English Wikipedia or French Wikipedia.
If the article is found, display a bar chart of the monthly views for the past 12 months (not
including the current month).

There's an example further down of a mediawiki API request that provides a time series of article
views.

The chart should show:

* labels like 2017-01, 2017-02 for each month on the x-axis.
* a title for the data set like "Number of Views"

Your task is to figure out how to transform the mediawiki API data into a format that chart.js
will understand and create Chart object with the right options.

More information about chart.js is provided in the section below.

## Wikimedia REST API

The [Wikimedia REST API](https://www.mediawiki.org/wiki/REST_API) gives you JSON data about
Wikimedia _projects_ (like English Wikipedia). The projects of interest to you are:

*   Language-specific Wikipedia: e.g. English is at <https://en.wikipedia.org/api/rest_v1/>, French is
    at <https://fr.wikipedia.org/api/rest_v1/>, etc.
*   Cross-project information like page views: <https://wikimedia.org/api/rest_v1/>

You can visit the above links to experiment with the API, make requests, see responses and error
information, etc.

### Respect the API etiquette guidelines

Wikimedia expects you to do a couple of things:

*   Set the `Api-User-Agent` header in all your requests to be your email address.
*   Don't make requests unless necessary:
    *   Cache API requests in your implementation (see General Constraints, below)
    *   When testing/developing, save the JSON data from an example request to a local file or
        string and do as much work as you can with just that saved JSON data.


### Some relevant examples

These examples should allow you to accomplish everything in the Functional Requirements.

*   Given title and project, get an article extract, url, and thumbnail image
    *   [Documentation](https://en.wikipedia.org/api/rest_v1/#!/Page_content/get_page_summary_title)
    *   [Example](https://en.wikipedia.org/api/rest_v1/page/summary/Pluto?redirect=false)
*   Given project, title, dates, get top 1000 most viewed articles for specific day/month
    *   [Documentation](https://wikimedia.org/api/rest_v1/#!/Pageviews_data/get_metrics_pageviews_top_project_access_year_month_day)
    *  [Example](https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia.org/all-access/2018/04/17)
*   Given project, title. get daily/monthly time series of page views
    * [Documentation](https://wikimedia.org/api/rest_v1/#!/Pageviews_data/get_metrics_pageviews_per_article_project_access_agent_article_granularity_start_end)
    * [Example](https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia.org/all-access/all-agents/Africa/monthly/20170101/20180101)


## chart.js

To include chart.js in your code:

1.  Go to the [installation](http://www.chartjs.org/docs/latest/getting-started/installation.html)
    page and obtain a CDN link to a _minified_ and _bundled_ build of chart.js -- latest version.
2.  Include this link in your HTML.

If you are debugging, change the CDN link in your HTML to a _non-minified_ version so that it's
easier to trace to the source of your issue.

chart.js works by talking to a [canvas](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas)
element in your DOM and drawing/animating a chart in that element. You don't need to know any
details about the canvas element to be able to use it for a chart.

To use chart.js:

1.  Add an empty canvas element to your HTML.
2.  In your JavaScript, create a `Chart` object and pass your canvas element and options to its
    constructor function.

Follow the [basic usage example](http://www.chartjs.org/docs/latest/getting-started/usage.html)
from the chart.js documentation -- it is quite similar to what your need to do.


## General Constraints

*   Cache API requests for __one day__: e.g. if user asks for most-visited articles for 20180401,
    and then asks for the same thing a few minutes later, don't hit the API a second time in that
    case.
*   Organize your JavaScript into separate files.
*   Do not make any synchronous Ajax requests.
*   Isolate your app's global variables from the window object and other scripts
    by either using an object-literal
    namespace or an iife. Don't make data global unless necessary.
*   Don't use onevent handlers anywhere, use addEventListener instead.
*   Use the provided `utilities.js` to make cross-browser functionality easier to achieve.
*   Only use standard Web API calls. Don't use any external libraries except for the ones required
    by the spec. If you'd like to use a particular polyfill, check with your teacher first.
    See note about _Modernizr_ in the Resources section below.
*   `<script>` tags must be in `<head>`
*   Only use external JS and CSS (no inline or internal).
*   Your code should work without raising any errors in the web console -- use appropriate
    validation and conditionals to prevent error conditions.
*   Your final submission should not include any calls that create dialogs (like `alert`) and
    should not print any debug messages in the console.

## Resources

*   Use the `utilities.js` script provided in our course repo.
*   __(Optional)__ You may use <https://modernizr.com/> or <https://polyfill.io> if you like,
    but I don't have time to help you with them. :)
*   In addition to your own CSS, you can link the `normalize.css` style sheet to make it easier
    to develop for different browsers: download the CSS file from <http://necolas.github.io/normalize.css/> -- this is __optional__, your choice.
*   Check whether Web API features you want to use are supported in old browser versions at <https://caniuse.com/>
*   The `tidy`, `eslint`, and `stylelint` Atom plugins should help you write valid HTML/CSS/JS but
    you can also use:
    *   <https://jigsaw.w3.org/css-validator/> to validate your CSS.
    *   <https://html5.validator.nu/> to validate your HTML.
*   You can see how your website renders on a variety of browsers and devices by
    generating screenshots with this tool: <https://developer.microsoft.com/en-us/microsoft-edge/tools/screenshots/>

## Code Style

Your JavaScript must respect the code style enforced by eslint in the Atom
editor configured in our labs. Most importantly, use consistent indentation
and avoid long lines (>100 cols) in HTML/CSS/JS.

All top-level, named functions must be documented in [JSDoc](http://usejsdoc.org/tags-param.html) style, as in the following examples:

```
/**
 * @param {number} color1
 * @param {number} color2
 * @returns {string} The blended color <--- omit if the function
 *                                            returns nothing
 */
function example(color1, color2) {...}

/**
 * Summary of what the function does.
 */
var anotherExample = function () {...}
```

Some points will be allocated to overall readability, code style, code structure, respect of
HTML5/CSS/JS best practices. See __Grading__ section below.

## Publication

What's the point of building a web app if you don't release it to the world?

### On sonic

* Upload your website to sonic so that it's available at the URL `sonic.dawsoncollege.qc.ca/~username/js423-project-2`

### On GitLab

Add the following code in a file called `.gitlab-ci.yml` in the root directory of your `submission`
branch:

```yml
pages:
  stage: deploy
  script:
  - mkdir .public
  - cp -r * .public
  - mv .public public
  artifacts:
    paths:
    - public
  only:
  - submission
```

This will cause GitLab to publish your website to `http://js423-2018-project2.gitlab.io/projectname/`
using a free service called [GitLab Pages](https://about.gitlab.com/features/pages/). (By the way,
GitHub has a similar free service. It's common for developers to host their blog/portfolio at
`username.github.io` this way with [GitHub Pages](https://pages.github.com/).)

## Grading

A summary of requirements is provided in a separate document alongside this one in our course
git repository. Read it carefully!

## Submission

Open a Merge Request of your `submission` branch against `master` and assign it to your teacher.

Include a `README.md` file in the main directory that provides links to your page URLs on sonic
and GitLab. Here's an example:

```
# <Your Name> Project 2: WikiChart

* Sonic URL: <http://blah.blah>
* GitLab URL: <http://blah.blah>

## Known Issues

Describe any problems you encountered or bugs you're aware of.
```
