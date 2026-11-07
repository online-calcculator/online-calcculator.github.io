(function () {
  'use strict';

  var groups = {
    'Financial': [
      '401k-calculator-calpro.html', 'apr-calculator-calpro.html', 'average-return-calculator-calpro.html',
      'bond-calculator-calpro.html', 'commission-calculator-calpro.html', 'currency-calculator-calpro.html',
      'down-payment-calculator-calpro.html', 'gdp-calculator-calpro.html', 'heloc-calculator-calpro.html',
      'home-equity-loan-calpro.html', 'house-affordability-calpro.html', 'inflation-calculator-calpro.html',
      'irr-calculator-calpro.html', 'loan-calculator-calpro.html', 'margin-calculator-calpro.html',
      'mortgage-payoff-calculator-calpro.html', 'payback-period-calculator-calpro.html',
      'pension-calculator-calpro.html', 'present-value-calpro.html', 'real-estate-calculator-calpro.html',
      'real-estate-calculator-standalone.html', 'retirement-calculator-calpro.html',
      'resistor-calculator-calpro.html', 'social-security-calculator-calpro.html', 'student-loan-calpro.html'
    ],
    'Fitness & Health': [
      'bra-size-calculator-calpro.html', 'calorie-calculator-calpro.html', 'calories-burned-calpro.html',
      'gfr-calculator-calpro.html', 'golf-handicap-calculator-calpro.html', 'healthy-weight-calculator-calpro.html',
      'pace-calculator-calpro.html', 'pace-calculator-standalone.html', 'sleep-calculator-calpro.html',
      'weight-watcher-points-calpro.html'
    ],
    'Math': [
      'area-calculator-calpro.html', 'binary-calculator-calpro.html', 'dice-roller-calpro.html',
      'dice-roller-standalone.html', 'fraction-calculator-calpro.html', 'gpa-calculator-calpro.html',
      'grade-calculator-calpro.html', 'half-life-calculator-calpro.html', 'hex-calculator-calpro.html',
      'number-sequence-calpro.html', 'percentage-calculator-calpro.html', 'probability-calculator-calpro.html',
      'random-number-generator-calpro.html', 'ratio-calculator-calpro.html', 'root-calculator-calpro.html',
      'sample-size-calculator-calpro.html', 'slope-calculator-calpro.html', 'distance-calculator-calpro.html',
      'volume-calculator-calpro.html',
      'z-score-calculator-calpro.html'
    ],
    'Other': [
      'bandwidth-calculator-calpro.html', 'base64-encode-decode-calpro.html', 'btu-calculator-calpro.html',
      'concrete-calculator-calpro.html', 'date-calculator-calpro.html', 'day-counter-calpro.html',
      'engine-horsepower-calculator-calpro.html',
      'height-calculator-calpro.html', 'hours-calculator-calpro.html', 'horsepower-calculator-calpro.html',
      'ip-subnet-calculator-calpro.html', 'roman-numeral-converter-calpro.html', 'roofing-calculator-calpro.html',
      'speed-calculator-calpro.html', 'square-footage-calculator-calpro.html',
      'stair-calculator-calpro.html', 'surface-area-calculator-calpro.html', 'time-calculator-calpro.html',
      'time-duration-calculator-calpro.html', 'tip-calculator-calpro.html', 'url-encode-decode-calpro.html'
    ]
  };
  var categoryUrls = {
    'Financial': 'https://calpro.com/financial-calculator/',
    'Fitness & Health': 'https://calpro.com/fitness-and-health-calculator/',
    'Math': 'https://calpro.com/math-calculator/',
    'Other': 'https://calpro.com/other-calculator/'
  };
  var specialNames = {
    '401k': '401(k)', 'apr': 'APR', 'btu': 'BTU', 'gdp': 'GDP', 'gfr': 'GFR',
    'gpa': 'GPA', 'ip': 'IP', 'url': 'URL', 'base64': 'Base64', 'z': 'Z'
  };
  var tools = Array.isArray(window.CALCPRO_TOOL_CATALOG) ? window.CALCPRO_TOOL_CATALOG.slice() : [];

  if (!tools.length) {
    Object.keys(groups).forEach(function (category) {
      groups[category].forEach(function (file) {
        var slug = file.replace(/\.html$/i, '').replace(/-(?:calpro|standalone)$/i, '');
        if (tools.some(function (tool) { return tool.slug === slug; })) return;
        var title = slug.split('-').map(function (part) {
          return specialNames[part.toLowerCase()] || (part.charAt(0).toUpperCase() + part.slice(1));
        }).join(' ').replace('Weight Watcher Points', 'Weight Watchers Points');
        tools.push({ file: file, slug: slug, title: title, category: category });
      });
    });
  }

  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function linkFor(tool) {
    var link = make('a', '', tool.title);
    link.href = tool.file;
    link.setAttribute('data-category', tool.category);
    return link;
  }

  function currentTool() {
    var file = decodeURIComponent(window.location.pathname.split('/').pop() || '').toLowerCase();
    var base = file.replace(/\.html$/i, '').replace(/\s+\(\d+\)$/i, '');
    return tools.find(function (tool) { return tool.file.toLowerCase() === file; }) ||
      tools.find(function (tool) { return tool.slug.toLowerCase() === base.replace(/-(?:calpro|standalone)$/i, ''); });
  }

  function init() {
    var aside = document.querySelector('.cp-sidebar, .calpro401-sidebar, .calcpro-dice-standalone-rail, .calpro-pace-demo-sidebar, aside');
    if (!aside || aside.querySelector('.cp-tool-discovery')) return;
    var current = currentTool();
    if (!current) return;

    Array.prototype.slice.call(aside.children).forEach(function (child) {
      if (!child.matches('.cp-ad-area, .calpro401-ad-area, .calcpro-dice-standalone-ad, .calpro-pace-demo-ad')) child.remove();
    });

    var panel = make('section', 'cp-tool-discovery');
    panel.setAttribute('aria-label', 'Search and browse calculators');
    panel.appendChild(make('h2', 'cp-tool-discovery-heading', 'All Calculators'));

    var form = make('form', 'cp-tool-discovery-search');
    form.setAttribute('role', 'search');
    var label = make('label', '', 'Search calculators');
    label.htmlFor = 'cp-tool-search';
    var input = make('input');
    input.type = 'search';
    input.id = 'cp-tool-search';
    input.name = 'q';
    input.placeholder = 'Try “loan” or “date”';
    input.autocomplete = 'off';
    input.setAttribute('aria-controls', 'cp-tool-search-results');
    var button = make('button', '', 'Search');
    button.type = 'submit';
    form.appendChild(label);
    form.appendChild(input);
    form.appendChild(button);
    panel.appendChild(form);

    var status = make('p', 'cp-tool-discovery-status', 'Search all calculators on this site.');
    status.setAttribute('aria-live', 'polite');
    status.hidden = true;
    panel.appendChild(status);
    var results = make('ul', 'cp-tool-discovery-list cp-tool-discovery-search-results');
    results.id = 'cp-tool-search-results';
    panel.appendChild(results);

    var categoryBox = make('details', 'cp-tool-discovery-category');
    categoryBox.open = true;
    var categoryTitle = make('summary', '', current.category + ' Calculators');
    categoryBox.appendChild(categoryTitle);
    var categoryLinks = make('ul', 'cp-tool-discovery-list cp-tool-discovery-category-links');
    tools.filter(function (tool) { return tool.category === current.category; })
      .forEach(function (tool) {
        var item = make('li');
        var link = linkFor(tool);
        if (tool.slug === current.slug) {
          link.setAttribute('aria-current', 'page');
          link.appendChild(make('small', '', 'Current tool'));
        }
        item.appendChild(link);
        categoryLinks.appendChild(item);
      });
    categoryBox.appendChild(categoryLinks);
    var more = make('a', 'cp-tool-discovery-more', 'View all ' + current.category + ' tools');
    more.href = categoryUrls[current.category];
    categoryBox.appendChild(more);
    panel.appendChild(categoryBox);

    var relatedBox = make('section', 'cp-tool-discovery-related');
    relatedBox.appendChild(make('h3', 'cp-tool-discovery-related-title', 'Related Tools'));
    var related = make('ul', 'cp-tool-discovery-list');
    tools.filter(function (tool) { return tool.category === current.category && tool.slug !== current.slug; })
      .slice(0, 6).forEach(function (tool) {
        var item = make('li');
        item.appendChild(linkFor(tool));
        related.appendChild(item);
      });
    relatedBox.appendChild(related);
    panel.appendChild(relatedBox);

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      renderResults(input.value);
    });
    input.addEventListener('input', function () { renderResults(input.value); });
    input.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        input.value = '';
        renderResults('');
      }
    });

    function renderResults(query) {
      var term = query.trim().toLowerCase();
      results.textContent = '';
      results.hidden = !term;
      categoryBox.hidden = Boolean(term);
      relatedBox.hidden = Boolean(term);
      status.hidden = !term;
      if (!term) {
        status.textContent = 'Search all calculators on this site.';
        return;
      }
      var matches = tools.filter(function (tool) {
        return (tool.title + ' ' + tool.slug + ' ' + tool.category).toLowerCase().indexOf(term) !== -1;
      });
      matches.forEach(function (tool) {
        var item = make('li');
        var link = linkFor(tool);
        link.appendChild(make('small', '', '  ·  ' + tool.category));
        item.appendChild(link);
        results.appendChild(item);
      });
      status.textContent = matches.length
        ? 'Found ' + matches.length + ' tool' + (matches.length === 1 ? '' : 's') + '. All matches are shown.'
        : 'No matching calculators found. Try a different keyword.';
    }

    var ad = aside.querySelector('.cp-ad-area, .calpro401-ad-area, .calcpro-dice-standalone-ad, .calpro-pace-demo-ad');
    if (ad && ad.parentElement === aside) ad.insertAdjacentElement('afterend', panel);
    else aside.insertBefore(panel, aside.firstChild);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}());
