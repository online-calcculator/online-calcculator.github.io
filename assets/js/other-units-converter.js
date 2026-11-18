(() => {
  const categories = {
    length: [
      { label: 'Meter', factor: 1 },
      { label: 'Kilometer', factor: 1000 },
      { label: 'Centimeter', factor: 0.01 },
      { label: 'Millimeter', factor: 0.001 },
      { label: 'Micrometer', factor: 0.000001 },
      { label: 'Mile', factor: 1609.344 },
      { label: 'Yard', factor: 0.9144 },
      { label: 'Foot', factor: 0.3048 },
      { label: 'Inch', factor: 0.0254 }
    ],
    temperature: [
      { label: 'Celsius', toBase: value => value + 273.15, fromBase: value => value - 273.15 },
      { label: 'Fahrenheit', toBase: value => (value + 459.67) * 5 / 9, fromBase: value => value * 9 / 5 - 459.67 },
      { label: 'Kelvin', toBase: value => value, fromBase: value => value },
      { label: 'Rankine', toBase: value => value * 5 / 9, fromBase: value => value * 9 / 5 }
    ],
    area: [
      { label: 'Square Meter', factor: 1 },
      { label: 'Square Kilometer', factor: 1000000 },
      { label: 'Square Centimeter', factor: 0.0001 },
      { label: 'Square Millimeter', factor: 0.000001 },
      { label: 'Hectare', factor: 10000 },
      { label: 'Square Mile', factor: 2589988.110336 },
      { label: 'Square Yard', factor: 0.83612736 },
      { label: 'Square Foot', factor: 0.09290304 },
      { label: 'Square Inch', factor: 0.00064516 },
      { label: 'Acre', factor: 4046.8564224 }
    ],
    volume: [
      { label: 'Cubic Meter', factor: 1000 },
      { label: 'Liter', factor: 1 },
      { label: 'Milliliter', factor: 0.001 },
      { label: 'US Gallon', factor: 3.785411784 },
      { label: 'US Quart', factor: 0.946352946 },
      { label: 'US Pint', factor: 0.473176473 },
      { label: 'US Cup', factor: 0.2365882365 },
      { label: 'US Fluid Ounce', factor: 0.0295735295625 },
      { label: 'Imperial Gallon', factor: 4.54609 },
      { label: 'Cubic Foot', factor: 28.316846592 },
      { label: 'Cubic Inch', factor: 0.016387064 }
    ],
    weight: [
      { label: 'Kilogram', factor: 1 },
      { label: 'Gram', factor: 0.001 },
      { label: 'Milligram', factor: 0.000001 },
      { label: 'Metric Ton', factor: 1000 },
      { label: 'Pound', factor: 0.45359237 },
      { label: 'Ounce', factor: 0.028349523125 },
      { label: 'Stone', factor: 6.35029318 },
      { label: 'Short Ton', factor: 907.18474 },
      { label: 'Long Ton', factor: 1016.0469088 },
      { label: 'Carat', factor: 0.0002 }
    ]
  };
  const categoryNames = {
    length: 'Length',
    temperature: 'Temperature',
    area: 'Area',
    volume: 'Volume',
    weight: 'Weight'
  };
  const carbohydrateUnitCodes = {
    length: { Centimeter: 'cm', Meter: 'm', Inch: 'in', Foot: 'ft' },
    weight: { Kilogram: 'kg', Pound: 'lb', Stone: 'st' }
  };
  const tdeeUnitNames = {
    length: {
      Meter: 'Meter',
      Kilometer: 'Kilometer',
      Centimeter: 'Centimeter',
      Millimeter: 'Millimeter',
      Mile: 'Mile',
      Yard: 'Yard',
      Foot: 'Foot',
      Inch: 'Inch'
    },
    weight: {
      Kilogram: 'Kilogram',
      Gram: 'Gram',
      Milligram: 'Milligram',
      'Metric Ton': 'Metric ton',
      Pound: 'Pound',
      Ounce: 'Ounce',
      Stone: 'Stone'
    }
  };
  const panels = new Map();
  const hostPanels = new Map();
  let nextId = 0;

  function isOtherUnitsButton(element) {
    return element && element.matches('button,[role="tab"]') &&
      element.textContent.trim().toLowerCase() === 'other units';
  }

  function createPanel(host) {
    const id = `calcpro-shared-units-${++nextId}`;
    const panel = document.createElement('section');
    panel.className = 'calcpro-shared-units';
    panel.id = id;
    panel.hidden = true;
    panel.setAttribute('aria-label', 'Other units converter');
    panel.innerHTML = `
      <div class="calcpro-shared-units__tabs" role="tablist" aria-label="Conversion type"></div>
      <div class="calcpro-shared-units__fields" id="${id}-fields" role="tabpanel">
        <div class="calcpro-shared-units__field">
          <label for="${id}-from-value">From</label>
          <input type="text" inputmode="decimal" data-value id="${id}-from-value" aria-label="Value to convert">
          <label for="${id}-from-unit">From unit</label>
          <select size="5" data-from id="${id}-from-unit" aria-label="From unit"></select>
        </div>
        <div class="calcpro-shared-units__field">
          <label for="${id}-to-value">To</label>
          <input type="text" readonly data-output id="${id}-to-value" aria-label="Converted value">
          <label for="${id}-to-unit">To unit</label>
          <select size="5" data-to id="${id}-to-unit" aria-label="To unit"></select>
        </div>
      </div>
      <p class="calcpro-shared-units__result" data-result role="status" aria-live="polite"></p>
      <p class="calcpro-shared-units__error" data-error role="alert" hidden></p>`;
    host.insertBefore(panel, host.firstElementChild);

    const tabs = panel.querySelector('.calcpro-shared-units__tabs');
    Object.keys(categories).forEach((key, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.id = `${id}-tab-${key}`;
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-controls', `${id}-fields`);
      button.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
      button.tabIndex = index === 0 ? 0 : -1;
      button.textContent = categoryNames[key];
      button.dataset.category = key;
      tabs.appendChild(button);
    });

    const from = panel.querySelector('[data-from]');
    const to = panel.querySelector('[data-to]');
    const fields = panel.querySelector('.calcpro-shared-units__fields');
    const value = panel.querySelector('[data-value]');
    const output = panel.querySelector('[data-output]');
    const result = panel.querySelector('[data-result]');
    let activeCategory = 'length';
    const error = panel.querySelector('[data-error]');
    const carbohydrateApply = document.getElementById('calcpro-carb-convert-apply');
    const tdeeApply = document.getElementById('calcpro-tdee-use-conversion');
    let applyToCarbohydrate;
    let applyToTdee;

    if (carbohydrateApply) {
      applyToCarbohydrate = document.createElement('button');
      applyToCarbohydrate.type = 'button';
      applyToCarbohydrate.className = 'calcpro-shared-units__apply';
      applyToCarbohydrate.textContent = 'Apply conversion to calculator';
      applyToCarbohydrate.setAttribute('aria-label', 'Apply converted height or weight to the calculator');
      applyToCarbohydrate.disabled = true;
      panel.appendChild(applyToCarbohydrate);
      applyToCarbohydrate.addEventListener('click', () => {
        const codes = carbohydrateUnitCodes[activeCategory];
        const fromCode = codes && codes[from.options[from.selectedIndex].textContent];
        const toCode = codes && codes[to.options[to.selectedIndex].textContent];
        if (!fromCode || !toCode) return;
        const valueField = document.getElementById('calcpro-carb-convert-value');
        const fromField = document.getElementById('calcpro-carb-convert-from');
        const toField = document.getElementById('calcpro-carb-convert-to');
        valueField.value = value.value;
        fromField.value = fromCode;
        toField.value = toCode;
        valueField.dispatchEvent(new Event('input', { bubbles: true }));
        fromField.dispatchEvent(new Event('change', { bubbles: true }));
        toField.dispatchEvent(new Event('change', { bubbles: true }));
        const metricUnits = ['cm', 'm', 'kg'];
        const targetTab = document.getElementById(metricUnits.includes(toCode)
          ? 'calcpro-carb-tab-metric'
          : 'calcpro-carb-tab-us');
        if (targetTab) targetTab.click();
        carbohydrateApply.click();
      });
    }
    if (tdeeApply) {
      applyToTdee = document.createElement('button');
      applyToTdee.type = 'button';
      applyToTdee.className = 'calcpro-shared-units__apply';
      applyToTdee.textContent = 'Apply conversion to calculator';
      applyToTdee.setAttribute('aria-label', 'Apply converted height or weight to the calculator');
      applyToTdee.disabled = true;
      panel.appendChild(applyToTdee);
      applyToTdee.addEventListener('click', () => {
        const unitNames = tdeeUnitNames[activeCategory];
        const fromName = unitNames && unitNames[from.options[from.selectedIndex].textContent];
        const toName = unitNames && unitNames[to.options[to.selectedIndex].textContent];
        if (!fromName || !toName) return;
        const oldInput = document.getElementById('calcpro-tdee-converter-input');
        const oldFrom = document.getElementById('calcpro-tdee-converter-from');
        const oldTo = document.getElementById('calcpro-tdee-converter-to');
        const selectByName = (select, name) => {
          const optionIndex = Array.from(select.options).findIndex(option => option.textContent === name);
          if (optionIndex < 0) return false;
          select.selectedIndex = optionIndex;
          select.dispatchEvent(new Event('change', { bubbles: true }));
          return true;
        };
        if (!selectByName(oldFrom, fromName) || !selectByName(oldTo, toName)) return;
        oldInput.value = value.value;
        oldInput.dispatchEvent(new Event('input', { bubbles: true }));
        tdeeApply.click();
        const oldMessage = document.getElementById('calcpro-tdee-converter-message');
        if (oldMessage) result.textContent = oldMessage.textContent;
      });
    }

    function disableApplyButtons() {
      if (applyToCarbohydrate) applyToCarbohydrate.disabled = true;
      if (applyToTdee) applyToTdee.disabled = true;
    }

    function convert(amount, source, target) {
      if (activeCategory === 'temperature') {
        const baseValue = source.toBase(amount);
        if (baseValue < -1e-10) return { error: 'Temperature cannot be below absolute zero.' };
        return { value: target.fromBase(Math.max(0, baseValue)) };
      }
      return { value: amount * source.factor / target.factor };
    }

    function refresh() {
      const units = categories[activeCategory];
      const source = units[from.selectedIndex];
      const target = units[to.selectedIndex];
      const amountText = value.value.trim();
      output.value = '';
      error.hidden = true;
      error.textContent = '';
      disableApplyButtons();
      if (amountText === '') {
        result.textContent = '';
        return;
      }
      const amount = Number(amountText);
      if (!Number.isFinite(amount)) {
        error.textContent = 'Enter a valid number to convert.';
        error.hidden = false;
        result.textContent = error.textContent;
        return;
      }

      const converted = convert(amount, source, target);
      if (converted.error) {
        error.textContent = converted.error;
        error.hidden = false;
        result.textContent = converted.error;
        return;
      }
      if (!Number.isFinite(converted.value)) {
        error.textContent = 'The converted value is too large to display.';
        error.hidden = false;
        result.textContent = error.textContent;
        return;
      }
      output.value = String(Number(converted.value.toPrecision(10)));
      result.textContent = `${value.value} ${source.label} = ${output.value} ${target.label}`;
      if (applyToCarbohydrate) {
        const codes = carbohydrateUnitCodes[activeCategory];
        applyToCarbohydrate.disabled = !(amount > 0 && codes &&
          codes[source.label] && codes[target.label]);
      }
      if (applyToTdee) {
        const names = tdeeUnitNames[activeCategory];
        applyToTdee.disabled = !(amount > 0 && names &&
          names[source.label] && names[target.label]);
      }
    }

    function setCategory(category) {
      activeCategory = category;
      panel.querySelectorAll('[data-category]').forEach(button => {
        const selected = button.dataset.category === category;
        button.setAttribute('aria-selected', String(selected));
        button.tabIndex = selected ? 0 : -1;
        if (selected) fields.setAttribute('aria-labelledby', button.id);
      });
      from.replaceChildren();
      to.replaceChildren();
      categories[category].forEach((unit, index) => {
        const fromOption = document.createElement('option');
        fromOption.textContent = unit.label;
        const toOption = fromOption.cloneNode(true);
        from.appendChild(fromOption);
        to.appendChild(toOption);
        if (index === 0) fromOption.selected = true;
        if (index === 1) toOption.selected = true;
      });
      refresh();
    }

    tabs.addEventListener('click', event => {
      const button = event.target.closest('[data-category]');
      if (button) setCategory(button.dataset.category);
    });
    tabs.addEventListener('keydown', event => {
      const current = event.target.closest('[data-category]');
      if (!current) return;
      const tabButtons = Array.from(tabs.querySelectorAll('[data-category]'));
      const currentIndex = tabButtons.indexOf(current);
      let nextIndex = currentIndex;
      if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabButtons.length;
      else if (event.key === 'ArrowLeft') nextIndex = (currentIndex + tabButtons.length - 1) % tabButtons.length;
      else return;
      event.preventDefault();
      tabButtons[nextIndex].focus();
      setCategory(tabButtons[nextIndex].dataset.category);
    });
    value.addEventListener('input', () => {
      refresh();
    });
    [from, to].forEach(control => control.addEventListener('change', refresh));

    setCategory(activeCategory);
    return panel;
  }

  document.querySelectorAll('button,[role="tab"]').forEach(button => {
    if (!isOtherUnitsButton(button)) return;
    const tabList = button.closest('[role="tablist"],[role="group"]');
    if (!tabList) return;
    const host = button.closest('.cp-tool-area') || tabList.parentElement;
    let panel = hostPanels.get(host);
    if (!panel) {
      panel = createPanel(host);
      hostPanels.set(host, panel);
    }
    if (['calcpro-bodyfat-converter', 'calcpro-ideal-converter',
      'calcpro-protein-converter', 'calcpro-tdee-converter'].includes(button.getAttribute('aria-controls'))) {
      button.setAttribute('aria-controls', panel.id);
    }
    panels.set(button, panel);
  });

  document.addEventListener('click', event => {
    const button = event.target.closest && event.target.closest('button,[role="tab"]');
    if (!isOtherUnitsButton(button)) return;
    const panel = panels.get(button);
    if (panel) {
      panel.hidden = false;
      if (button.hasAttribute('aria-expanded')) button.setAttribute('aria-expanded', 'true');
    }
  }, true);

  document.addEventListener('click', event => {
    const button = event.target.closest && event.target.closest('button,[role="tab"]');
    if (isOtherUnitsButton(button)) {
      const legacyPanel = document.getElementById('calcpro-carb-otherpanel');
      if (legacyPanel) legacyPanel.hidden = true;
      ['calcpro-bodyfat-converter', 'calcpro-ideal-converter',
        'calcpro-protein-converter', 'calcpro-tdee-converter'].forEach(id => {
        const converter = document.getElementById(id);
        if (converter) converter.hidden = true;
      });
      return;
    }
    if (!button || !/^(us|metric) units$/i.test(button.textContent.trim())) return;
    const tabList = button.closest('[role="tablist"],[role="group"]');
    const relatedPanel = Array.from(panels.entries()).find(([trigger]) =>
      trigger.closest('[role="tablist"],[role="group"]') === tabList);
    if (relatedPanel) {
      relatedPanel[1].hidden = true;
      const otherButton = relatedPanel[0];
      if (otherButton.hasAttribute('aria-expanded')) otherButton.setAttribute('aria-expanded', 'false');
    }
  });
})();
