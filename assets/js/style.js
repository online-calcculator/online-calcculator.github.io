(function () {
  'use strict';

  var groups = {
    'Financial': [
      '401k-calculator.html', 'apr-calculator.html', 'average-return-calculator.html',
      'bond-calculator.html', 'commission-calculator.html', 'currency-calculator.html',
      'down-payment-calculator.html', 'gdp-calculator.html', 'heloc-calculator.html',
      'home-equity-loan.html', 'house-affordability.html', 'inflation-calculator.html',
      'irr-calculator.html', 'loan-calculator.html', 'margin-calculator.html',
      'mortgage-payoff-calculator.html', 'payback-period-calculator.html',
      'pension-calculator.html', 'present-value.html', 'real-estate-calculator.html',
      'real-estate-calculator-standalone.html', 'retirement-calculator.html',
      'resistor-calculator.html', 'social-security-calculator.html', 'student-loan.html'
    ],
    'Fitness & Health': [
      'bra-size-calculator.html', 'calorie-calculator.html', 'calories-burned.html',
      'gfr-calculator.html', 'golf-handicap-calculator.html', 'healthy-weight-calculator.html',
      'pace-calculator.html', 'pace-calculator-standalone.html', 'sleep-calculator.html',
      'weight-watcher-points.html'
    ],
    'Math': [
      'area-calculator.html', 'binary-calculator.html', 'dice-roller.html',
      'dice-roller-standalone.html', 'fraction-calculator.html', 'gpa-calculator.html',
      'grade-calculator.html', 'half-life-calculator.html', 'hex-calculator.html',
      'number-sequence.html', 'percentage-calculator.html', 'probability-calculator.html',
      'random-number-generator.html', 'ratio-calculator.html', 'root-calculator.html',
      'sample-size-calculator.html', 'slope-calculator.html', 'distance-calculator.html',
      'volume-calculator.html',
      'z-score-calculator.html'
    ],
    'Other': [
      'bandwidth-calculator.html', 'base64-encode-decode.html', 'btu-calculator.html',
      'concrete-calculator.html', 'date-calculator.html', 'day-counter.html',
      'engine-horsepower-calculator.html',
      'height-calculator.html', 'hours-calculator.html', 'horsepower-calculator.html',
      'ip-subnet-calculator.html', 'roman-numeral-converter.html', 'roofing-calculator.html',
      'speed-calculator.html', 'square-footage-calculator.html',
      'stair-calculator.html', 'surface-area-calculator.html', 'time-calculator.html',
      'time-duration-calculator.html', 'tip-calculator.html', 'url-encode-decode.html'
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

  var toolRoutes = {
    'annuity-payout': 'annuity-payout-calculator',
    'cash-back-or-low-interest': 'cash-back-or-low-interest-calculator',
    'credit-cards-payoff': 'credit-card-payoff-calculator',
    'debt-consolidation': 'debt-consolidation-calculator',
    'debt-to-income-ratio': 'debt-ratio-calculator',
    'income-tax-calculator': 'tax-calculator',
    'marriage-tax-calculator': 'marriage-calculator',
    'mortgage-amortization': 'mortgage-amortization-calculator',
    'present-value': 'present-value-calculator',
    'rent-vs-buy': 'rent-vs-buy-calculator',
    'take-home-paycheck': 'take-home-pay-calculator',
    'weight-watcher-points': 'weight-watchers-points-calculator',
    'greatest-common-factor-calculator': 'gcf-calculator',
    'least-common-multiple-calculator': 'lcm-calculator',
    'percentage-calculator': 'percent-calculator',
    'random-password-generator': 'password-generator',
    'mortgage-calculator-uk': 'mortgage-calculator-uk',
    'dice-roller': 'dice-roller',
    'random-number-generator': 'random-number-generator',
    'base64-encode-decode': 'base64-encode-decode',
    'day-counter': 'day-counter',
    'roman-numeral-converter': 'roman-numeral-converter',
    'shoe-size-conversion': 'shoe-size-conversion',
    'url-encode-decode': 'url-encode-decode'
  };

  function toolHref(tool) {
    var folder = toolRoutes[tool.slug] ||
      (/-calculator$/i.test(tool.slug) ? tool.slug : tool.slug + '-calculator');
    var pathParts = decodeURIComponent(window.location.pathname).split('/').filter(Boolean);
    if (pathParts[pathParts.length - 1] && /^index\.html$/i.test(pathParts[pathParts.length - 1])) {
      pathParts.pop();
    }
    return '../'.repeat(pathParts.length) + folder + '/';
  }

  function linkFor(tool) {
    var link = make('a', '', tool.title);
    link.href = toolHref(tool);
    link.setAttribute('data-category', tool.category);
    return link;
  }

  function currentTool() {
    var pathParts = decodeURIComponent(window.location.pathname).split('/').filter(Boolean);
    var file = (pathParts[pathParts.length - 1] || '').toLowerCase();
    if (file === 'index.html' && pathParts.length > 1) {
      file = pathParts[pathParts.length - 2].toLowerCase();
    }
    var base = file.replace(/\.html$/i, '').replace(/\s+\(\d+\)$/i, '');
    return tools.find(function (tool) { return tool.file.toLowerCase() === file; }) ||
      tools.find(function (tool) {
        return tool.slug.toLowerCase() === base.replace(/-(?:calpro|standalone)$/i, '') ||
          (toolRoutes[tool.slug] || '').toLowerCase() === base;
      });
  }

  function enhanceSaveRestoreButtons() {
    Array.prototype.forEach.call(document.querySelectorAll('button'), function (button) {
      if (button.classList.contains('cp-universal-save') || button.classList.contains('cp-file-action') || button.id === 'calcpro-amort-save' ||
          button.id === 'calcpro-age-save' || button.id === 'calcpro-annuity-save' ||
          button.id === 'calcpro-anorexic-save' ||
          button.classList.contains('calcpro-annuity-save') ||
          button.closest('.calcpro-apr')) return;

      var text = button.textContent.replace(/\s+/g, ' ').trim();
      var details = [
        text,
        button.getAttribute('title') || '',
        button.getAttribute('aria-label') || ''
      ].join(' ');
      var action = button.hasAttribute('data-restore') || /\brestore\b/i.test(details)
        ? 'restore'
        : button.hasAttribute('data-save') || /\bsave\b/i.test(details) ? 'save' : '';

      if (!action) return;

      var labelText = action === 'restore' ? 'Restore' : /\bprint\b/i.test(text) ? text : 'Save';
      var icon = make('img');
      icon.src = action === 'restore' ? 'restore-page.svg' : '/assets/images/save-save-file.svg';
      icon.alt = '';
      icon.setAttribute('aria-hidden', 'true');

      var label = make('span', '', labelText);
      button.textContent = '';
      button.classList.add('cp-file-action', 'cp-file-action-' + action);
      button.setAttribute('data-cp-file-action', action);
      button.appendChild(icon);
      button.appendChild(label);

      if (!button.hasAttribute('aria-label')) {
        button.setAttribute('aria-label', labelText);
      }
    });
  }

  function init() {
    enhanceSaveRestoreButtons();

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

    var categoryBoxes = [];
    var categories = Object.keys(categoryUrls);
    if (categories.indexOf(current.category) !== -1) {
      categories.splice(categories.indexOf(current.category), 1);
      categories.unshift(current.category);
    }

    categories.forEach(function (category) {
      var categoryTools = tools.filter(function (tool) { return tool.category === category; });
      if (!categoryTools.length) return;

      var categoryBox = make('details', 'cp-tool-discovery-category');
      categoryBox.open = category === current.category;
      var categoryTitle = make('summary', '', category + ' Calculators');
      categoryBox.appendChild(categoryTitle);
      var categoryLinks = make('ul', 'cp-tool-discovery-list cp-tool-discovery-category-links');
      categoryTools.slice(0, 12).forEach(function (tool) {
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
      var more = make('a', 'cp-tool-discovery-more', 'View all ' + category + ' calculators');
      more.href = categoryUrls[category];
      categoryBox.appendChild(more);
      panel.appendChild(categoryBox);
      categoryBoxes.push(categoryBox);
    });

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
      categoryBoxes.forEach(function (categoryBox) {
        categoryBox.hidden = Boolean(term);
      });
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

(function () {
  'use strict';

  var resultSelector = [
    '[id*="result" i]', '[class*="result" i]',
    '[id*="output" i]', '[class*="output" i]',
    '[id*="answer" i]', '[class*="answer" i]',
    '[id*="summary" i]', '[class*="summary" i]',
    '[data-result]', '[aria-live="polite"]', '[role="status"]'
  ].join(',');
  var dialog;
  var activeResult;
  var saveTargets = new WeakMap();

  function isVisible(element) {
    if (element.hidden || element.closest('[hidden]')) return false;
    var style = window.getComputedStyle(element);
    return style.display !== 'none' && style.visibility !== 'hidden' && element.getClientRects().length > 0;
  }

  function isResult(element) {
    if (!isVisible(element) || element.closest('.info-bar, .cp-tool-discovery')) return false;
    if (/^(TABLE|TBODY|THEAD|TFOOT|TR|TD|TH)$/.test(element.tagName)) return false;
    if (element.matches('[class*="error" i],[class*="placeholder" i],[class*="empty" i]')) return false;
    if (element.querySelector('form')) return false;
    var text = (element.innerText || element.textContent).replace(/\s+/g, ' ').trim();
    if (!text || /^(?:result|results|answer|output|summary)(?:\s+(?:save|print|download|copy|restore))*$/i.test(text)) return false;
    return !/^(?:enter\b|customize\b|select\b|calculate\b|your results?\b.*(?:appear|show)|results?\s+(?:will|appear)|no calculation\b)/i.test(text);
  }

  function makeSaveIcon() {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M5 3h12l4 4v14H3V3h2zm1 2v5h10V5H6zm6 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z');
    svg.appendChild(path);
    return svg;
  }

  function isSaveAction(button) {
    var details = [
      button.textContent || '',
      button.value || '',
      button.id || '',
      typeof button.className === 'string' ? button.className : '',
      button.getAttribute('aria-label') || '',
      button.getAttribute('title') || ''
    ].join(' ');
    return !/\brestore\b/i.test(details) &&
      (button.hasAttribute('data-save') || /\b(save|print)\b/i.test(details));
  }

  function prepareSaveButton(button) {
    button.type = 'button';
    button.className = 'cp-universal-save';
    button.disabled = false;
    button.removeAttribute('data-cp-file-action');
    button.setAttribute('aria-label', 'Save or export results');
    button.title = 'Save or export these results';
    button.textContent = '';
    button.appendChild(makeSaveIcon());
    var label = document.createElement('span');
    label.textContent = 'Save';
    button.appendChild(label);
  }

  function addSaveButton(result) {
    if (!result.hasAttribute('data-cp-save-root')) result.setAttribute('data-cp-save-root', 'true');
    if (result.querySelector('.cp-universal-save')) return;

    var headingSelector = 'h2,h3,[class*="result"][class*="head"],[class*="result"][class*="heading"],[class*="result"][class*="title"],[class*="result"][class*="bar"],[class*="result"][class*="banner"],[class*="summary"][class*="heading"],[class*="headline"]';
    var heading = result.querySelector(headingSelector);
    if (!heading && result.previousElementSibling && result.previousElementSibling.matches(headingSelector)) {
      heading = result.previousElementSibling;
    }
    if (heading) {
      var headingSave = heading.querySelector('.cp-universal-save');
      if (headingSave) {
        saveTargets.set(headingSave, result);
        return;
      }
    }

    var existing = Array.prototype.find.call(
      result.querySelectorAll('button,input[type="button"],input[type="submit"]'),
      isSaveAction
    );
    if (!existing && heading) {
      existing = Array.prototype.find.call(
        heading.querySelectorAll('button,input[type="button"],input[type="submit"]'),
        isSaveAction
      );
    }
    if (existing && existing.tagName === 'BUTTON') {
      prepareSaveButton(existing);
      saveTargets.set(existing, result);
      return;
    }

    var button = document.createElement('button');
    prepareSaveButton(button);
    saveTargets.set(button, result);
    if (existing) {
      existing.replaceWith(button);
      return;
    }

    if (heading) {
      heading.appendChild(button);
      return;
    }

    var toolbar = document.createElement('div');
    toolbar.className = 'cp-save-toolbar';
    toolbar.appendChild(button);
    result.insertBefore(toolbar, result.firstChild);
  }

  function enhanceResults(scope) {
    var candidates = Array.prototype.filter.call(scope.querySelectorAll(resultSelector), isResult);
    candidates.filter(function (candidate) {
      return !candidates.some(function (other) {
        return other !== candidate && other.contains(candidate);
      });
    }).forEach(addSaveButton);
  }

  function createDialog() {
    dialog = document.createElement('dialog');
    dialog.className = 'cp-save-dialog';
    dialog.setAttribute('aria-labelledby', 'cp-save-dialog-title');

    var heading = document.createElement('h2');
    heading.id = 'cp-save-dialog-title';
    heading.textContent = 'Save your results';
    dialog.appendChild(heading);

    var close = document.createElement('button');
    close.type = 'button';
    close.className = 'cp-save-dialog-close';
    close.setAttribute('aria-label', 'Close save options');
    close.textContent = '×';
    close.addEventListener('click', function () { dialog.close(); });
    dialog.appendChild(close);

    var options = document.createElement('div');
    options.className = 'cp-save-dialog-options';
    [
      ['print', 'Print'],
      ['text', 'Download .txt'],
      ['pdf', 'Save as PDF']
    ].forEach(function (option) {
      var button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('data-cp-export', option[0]);
      button.textContent = option[1];
      options.appendChild(button);
    });
    dialog.appendChild(options);

    var note = document.createElement('p');
    note.className = 'cp-save-dialog-note';
    note.textContent = 'In the print dialog, choose Save as PDF to download the page-style result.';
    dialog.appendChild(note);

    var status = document.createElement('p');
    status.className = 'cp-save-dialog-status';
    status.setAttribute('aria-live', 'polite');
    dialog.appendChild(status);

    dialog.addEventListener('click', function (event) {
      var action = event.target.closest('[data-cp-export]');
      if (!action) return;
      var type = action.getAttribute('data-cp-export');
      if (type === 'text') downloadText();
      else if (type === 'pdf' || type === 'print') printResults();
    });
    dialog.addEventListener('click', function (event) {
      if (event.target === dialog) dialog.close();
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && dialog.open) dialog.close();
    });
    document.body.appendChild(dialog);
  }

  function exportClone() {
    if (!activeResult) return null;
    var clone = activeResult.cloneNode(true);
    Array.prototype.forEach.call(
      clone.querySelectorAll('.cp-universal-save,.cp-save-toolbar,button,input,select,textarea,.info-bar,[hidden],[aria-hidden="true"],[data-cp-exclude-export]'),
      function (element) { element.remove(); }
    );
    return clone;
  }

  function resultText() {
    var clone = exportClone();
    if (!clone) return '';
    var blockTags = /^(ADDRESS|ARTICLE|ASIDE|BLOCKQUOTE|DD|DIV|DL|DT|FIELDSET|FIGCAPTION|FIGURE|FOOTER|H[1-6]|HEADER|HR|LI|MAIN|NAV|OL|P|SECTION|SUMMARY|UL)$/;

    function ignored(element) {
      return element.hidden || element.hasAttribute('hidden') ||
        element.getAttribute('aria-hidden') === 'true' ||
        /^(BUTTON|INPUT|SELECT|SCRIPT|STYLE|TEXTAREA)$/.test(element.tagName) ||
        element.matches('.cp-universal-save,.cp-save-toolbar,[data-cp-exclude-export]');
    }

    function inlineText(node) {
      if (node.nodeType === 3) return node.nodeValue || '';
      if (node.nodeType !== 1 || ignored(node)) return '';
      if (node.tagName === 'BR') return ' ';
      if (node.tagName === 'SVG') {
        var description = node.getAttribute('aria-label');
        return description ? 'Chart: ' + description : '';
      }
      return Array.prototype.map.call(node.childNodes, inlineText).join('');
    }

    function tableRows(node, rows) {
      Array.prototype.forEach.call(node.children, function (child) {
        if (child.tagName === 'TR') rows.push(child);
        else if (child.tagName !== 'TABLE') tableRows(child, rows);
      });
    }

    function blockText(node) {
      if (node.nodeType === 3) return node.nodeValue || '';
      if (node.nodeType !== 1 || ignored(node)) return '';
      if (node.tagName === 'SVG') {
        var description = node.getAttribute('aria-label');
        return description ? '\nChart: ' + description + '\n' : '';
      }
      if (node.tagName === 'TABLE') {
        var rows = [];
        tableRows(node, rows);
        return '\n' + rows.map(function (row) {
          var cells = Array.prototype.filter.call(row.children, function (child) {
            return child.tagName === 'TH' || child.tagName === 'TD';
          });
          return cells.map(function (cell) { return inlineText(cell).replace(/\s+/g, ' ').trim(); })
            .filter(Boolean).join(' | ');
        }).filter(Boolean).join('\n') + '\n';
      }
      if (node.tagName === 'DETAILS' && !node.open) {
        var summary = node.querySelector('summary');
        return summary ? '\n' + inlineText(summary).replace(/\s+/g, ' ').trim() + '\n' : '';
      }

      var content = Array.prototype.map.call(node.childNodes, blockText).join('');
      if (node.tagName === 'LI') content = '- ' + content;
      return blockTags.test(node.tagName) ? '\n' + content + '\n' : content;
    }

    return blockText(clone).replace(/\u00a0/g, ' ').split('\n')
      .map(function (line) { return line.replace(/[ \t]+/g, ' ').trim(); })
      .join('\n').replace(/\n{3,}/g, '\n\n').trim();
  }

  function fileName(extension) {
    var name = (document.title || 'calculator-results')
      .replace(/\s*\|\s*.*$/, '')
      .replace(/[<>:"/\\|?*\x00-\x1f]/g, '-')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'calculator-results';
    return name + '-results.' + extension;
  }

  function downloadText() {
    var text = resultText();
    if (!text) {
      dialog.querySelector('.cp-save-dialog-status').textContent = 'There are no results to save yet.';
      return;
    }
    var blob = new Blob([text + '\r\n'], { type: 'text/plain;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName('txt');
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    dialog.close();
  }

  function printResults() {
    var clone = exportClone();
    var status = dialog.querySelector('.cp-save-dialog-status');
    if (!clone) {
      status.textContent = 'There are no results to save yet.';
      return;
    }

    var toolArea = activeResult.closest('.cp-tool-area');
    var styleRoot = activeResult.closest('.cp-site') || activeResult.closest('.cp-layout') || toolArea;
    var ancestors = [];
    for (var current = activeResult.parentElement; current && current !== styleRoot; current = current.parentElement) {
      ancestors.unshift(current);
    }
    var wrapper = styleRoot ? styleRoot.cloneNode(false) : document.createElement('div');
    var parent = wrapper;
    ancestors.forEach(function (ancestor) {
      var copy = ancestor.cloneNode(false);
      parent.appendChild(copy);
      parent = copy;
    });
    clone.classList.add('cp-print-export');
    parent.appendChild(clone);

    var host = document.createElement('div');
    host.className = 'cp-print-export-host';
    host.appendChild(wrapper);
    document.body.appendChild(host);
    document.body.classList.add('cp-printing-results');

    var cleaned = false;
    function cleanup() {
      if (cleaned) return;
      cleaned = true;
      document.body.classList.remove('cp-printing-results');
      host.remove();
      window.removeEventListener('afterprint', cleanup);
    }
    window.addEventListener('afterprint', cleanup, { once: true });
    dialog.close();
    window.print();
    window.setTimeout(cleanup, 30000);
  }

  function initializeSaveOptions() {
    Array.prototype.forEach.call(document.querySelectorAll('.cp-tool-area'), function (toolArea) {
      enhanceResults(toolArea);
      var observer = new MutationObserver(function () { enhanceResults(toolArea); });
      observer.observe(toolArea, {
        attributes: true,
        attributeFilter: ['class', 'hidden', 'style', 'aria-hidden'],
        childList: true,
        subtree: true
      });
    });
    createDialog();

    document.addEventListener('click', function (event) {
      var button = event.target.closest('.cp-universal-save');
      if (!button) return;
      var result = saveTargets.get(button) || button.closest('[data-cp-save-root]');
      if (!result) return;
      activeResult = result;
      dialog.querySelector('.cp-save-dialog-status').textContent = '';
      dialog.showModal();
      if (!(button.hasAttribute('data-save') && button.closest('.calcpro-apr'))) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSaveOptions);
  } else {
    initializeSaveOptions();
  }
}());

(function () {
  'use strict';

  var resultSelector = [
    '[id*="result" i]', '[class*="result" i]',
    '[id*="output" i]', '[class*="output" i]',
    '[id*="answer" i]', '[class*="answer" i]',
    '[id*="summary" i]', '[class*="summary" i]',
    '[data-result]'
  ].join(',');
  var liveResultSelector = resultSelector + ',[aria-live="polite"],[role="status"]';
  var scrollTimer;
  var infoBarDisplays = new WeakMap();
  var infoBarStates = new WeakMap();

  function isVisible(element) {
    if (element.hidden || !element.textContent.trim()) return false;
    var style = window.getComputedStyle(element);
    return style.display !== 'none' && style.visibility !== 'hidden' && element.getClientRects().length > 0;
  }

  function scrollToResult(source) {
    var scope = source.closest('.cp-tool-area') || source.closest('form') || document;
    var candidates = Array.prototype.filter.call(scope.querySelectorAll(resultSelector), isVisible);
    if (!candidates.length) {
      candidates = Array.prototype.filter.call(scope.querySelectorAll(liveResultSelector), isVisible);
    }

    var topLevel = candidates.filter(function (candidate) {
      return !candidates.some(function (other) {
        return other !== candidate && other.contains(candidate);
      });
    });
    if (!topLevel.length) return;

    topLevel.sort(function (a, b) {
      return a.getBoundingClientRect().top - b.getBoundingClientRect().top;
    });
    var target = topLevel[0];
    var behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    target.scrollIntoView({ behavior: behavior, block: 'start' });
  }

  function hasCalculationError(scope) {
    return Array.prototype.some.call(
      scope.querySelectorAll('[id*="error" i],[class*="error" i],[role="alert"]'),
      isVisible
    );
  }

  function isActualResult(element) {
      if (!isVisible(element) || element.closest('.info-bar')) return false;
      if (/(?:placeholder|empty-state)/i.test(element.getAttribute('class') || '')) return false;

      var text = (element.innerText || element.textContent).replace(/\s+/g, ' ').trim();
      if (!text || /^(?:result|results|answer|output|summary)(?:\s+(?:save|print|download|copy))*$/i.test(text)) {
        return false;
      }
      if (/^(?:enter\b|customize\b|select\b|calculate\b|your results?\b.*(?:appear|show)|results?\s+(?:will|appear)|no calculation\b)/i.test(text)) {
        return false;
      }
      return !Array.prototype.some.call(
        element.querySelectorAll('.placeholder,[class*="placeholder" i],[data-placeholder]'),
        isVisible
      );
  }

  function hasActualResult(scope) {
    if (hasCalculationError(scope)) return false;
    return Array.prototype.some.call(scope.querySelectorAll(liveResultSelector), isActualResult);
  }

  function updateInfoBars(scope) {
    var state = infoBarStates.get(scope);
    if (!state || !state.pending) return;
    if (hasCalculationError(scope)) {
      state.pending = false;
      setInfoBarsHidden(scope, false);
    } else if (hasActualResult(scope)) {
      state.pending = false;
      setInfoBarsHidden(scope, true);
    }
  }

  function setInfoBarsHidden(scope, hidden) {
    Array.prototype.forEach.call(scope.querySelectorAll('.info-bar'), function (infoBar) {
      if (!infoBarDisplays.has(infoBar)) infoBarDisplays.set(infoBar, infoBar.style.display);
      if (infoBar.hidden !== hidden) infoBar.hidden = hidden;
      var display = hidden ? 'none' : infoBarDisplays.get(infoBar);
      if (infoBar.style.display !== display) infoBar.style.display = display;
    });
  }

  function beginInfoBarCalculation(scope) {
    var state = infoBarStates.get(scope);
    if (!state) return;
    state.pending = true;
    window.setTimeout(function () {
      updateInfoBars(scope);
    }, 100);
  }

  function resetInfoBar(scope) {
    var state = infoBarStates.get(scope);
    if (state) state.pending = false;
    setInfoBarsHidden(scope, false);
  }

  function getActionDetails(button) {
    return [
      button.textContent || '',
      button.value || '',
      button.id || '',
      typeof button.className === 'string' ? button.className : '',
      button.getAttribute('aria-label') || '',
      button.getAttribute('title') || ''
    ].join(' ');
  }

  function infoBarScope(infoBar, toolArea) {
    for (var current = infoBar.parentElement; current && toolArea.contains(current); current = current.parentElement) {
      if (current.querySelectorAll('form').length > 0) return current;
      if (current === toolArea) break;
    }
    return toolArea.querySelectorAll('form').length > 0 ? toolArea : null;
  }

  function initializeInfoBars() {
    Array.prototype.forEach.call(document.querySelectorAll('.cp-tool-area'), function (toolArea) {
      var scopes = [];
      Array.prototype.forEach.call(toolArea.querySelectorAll('.info-bar'), function (infoBar) {
        var scope = infoBarScope(infoBar, toolArea);
        if (!scope) return;
        if (scopes.indexOf(scope) === -1) scopes.push(scope);
      });

      scopes.forEach(function (scope) {
        infoBarStates.set(scope, { pending: false });
        setInfoBarsHidden(scope, false);
        scope.addEventListener('submit', function () {
          beginInfoBarCalculation(scope);
        }, true);
        scope.addEventListener('click', function (event) {
          var button = event.target.closest('button,input[type="submit"],input[type="button"]');
          if (!button || !scope.contains(button)) return;
          var details = getActionDetails(button);
          if (/\b(reset|clear)\b/i.test(details)) {
            resetInfoBar(scope);
          } else if (button.matches('button[type="submit"],input[type="submit"]') ||
                     /\b(calculate|compute|convert|generate|solve|estimate|find|check|run|count|roll)\b/i.test(details)) {
            beginInfoBarCalculation(scope);
          }
        }, true);

        var observer = new MutationObserver(function () {
          updateInfoBars(scope);
        });
        observer.observe(scope, {
          attributes: true,
          attributeFilter: ['class', 'hidden', 'style', 'aria-hidden'],
          characterData: true,
          childList: true,
          subtree: true
        });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeInfoBars);
  } else {
    initializeInfoBars();
  }

  function scheduleResultScroll(source) {
    window.clearTimeout(scrollTimer);
    scrollTimer = window.setTimeout(function () {
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
          scrollToResult(source);
        });
      });
    }, 60);
  }

  document.addEventListener('submit', function (event) {
    var form = event.target;
    if (form.matches('form') && form.closest('.cp-tool-area')) {
      scheduleResultScroll(form);
    }
  }, true);

  document.addEventListener('click', function (event) {
    var button = event.target.closest('button,input[type="submit"],input[type="button"]');
    if (!button || !button.closest('.cp-tool-area')) return;

    var details = getActionDetails(button);
    if (/\b(save|restore|reset|clear|print|download|search|close|cancel)\b/i.test(details)) return;
    if (!button.matches('button[type="submit"],input[type="submit"]') &&
        !/\b(calculate|compute|convert|generate|solve|estimate|find|check|run|count|roll)\b/i.test(details)) return;

    scheduleResultScroll(button);
  }, true);
}());

(function () {
  'use strict';
  var sections = document.querySelectorAll('.cp-article .cp-accordion-section');
  if (!sections.length) return;

  function updateItem(item, open) {
    var button = item.querySelector('.cp-accordion-trigger');
    var panel = item.querySelector('.cp-accordion-panel');
    if (!button || !panel) return;
    item.dataset.open = open ? 'true' : 'false';
    button.setAttribute('aria-expanded', String(open));
    panel.setAttribute('aria-hidden', String(!open));
    panel.inert = !open;
  }

  sections.forEach(function (section) {
    var items = Array.from(section.querySelectorAll('.cp-accordion-item'));
    items.forEach(function (item) {
      updateItem(item, false);
      var button = item.querySelector('.cp-accordion-trigger');
      button.addEventListener('click', function () {
        var open = item.dataset.open === 'true';
        if (!open && section.classList.contains('cp-accordion-faq')) {
          items.forEach(function (other) { if (other !== item) updateItem(other, false); });
        }
        updateItem(item, !open);
      });
    });
  });
})();