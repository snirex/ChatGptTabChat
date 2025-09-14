(() => {
  let historyElement, menuHeaderButton, markerMenuElement;
  let markerSettings;

  // ===== Helper Functions =====

  // Save marker settings to localStorage
  function saveMarkerSettings() {
    localStorage.setItem('navMarkerSettings', JSON.stringify(markerSettings));
  }

  // Apply colors to navigation links based on markers
  function applyColorsToNavLinks() {
    const links = document.querySelectorAll('nav a');
    links.forEach(link => {
      const linkText = link.textContent.trim();
      link.style.backgroundColor = '';
      link.style.color = '';

      if (markerSettings.enableColors) {
        markerSettings.markers.forEach(marker => {
          // Check if link starts or ends with the marker symbol
          if (linkText.startsWith(marker.symbol) || linkText.endsWith(marker.symbol)) {
            link.style.backgroundColor = marker.bgColor || '';
            link.style.color = marker.color || '';
            console.log('Applying color', marker.symbol, linkText, marker.bgColor, marker.color);
          }
        });
      }

      // Bold active link
      link.style.fontWeight = link.hasAttribute('data-active') ? 'bold' : '';
    });
  }

  // Update toggle switch UI
  function updateToggleSwitchAppearance(enableColorsCheckbox, sliderBackground, sliderHandle) {
    if (enableColorsCheckbox.checked) {
      sliderBackground.style.backgroundColor = '#4CAF50';
      sliderHandle.style.transform = 'translateX(20px)';
    } else {
      sliderBackground.style.backgroundColor = '#ccc';
      sliderHandle.style.transform = 'translateX(0)';
    }
  }

  // Render the list of markers in the menu
  function renderMarkerList() {
    const markerListContainer = document.getElementById('markerList');
    if (!markerListContainer) return;
    markerListContainer.innerHTML = '';

    if (markerSettings.markers.length === 0) {
      markerListContainer.innerHTML = '<em>No markers defined.</em>';
    }

    markerSettings.markers.forEach((marker, index) => {
      const markerRow = document.createElement('div');
      markerRow.style.cssText = `
        margin-bottom:4px;
        background:#f0f0f0;
        padding:4px 30px 4px 4px;
        border-radius:4px;
        position:relative;
      `;
      markerRow.innerHTML = `${marker.symbol} BG:&nbsp;<span style="background: ${marker.bgColor};border:1px solid black;">&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;&nbsp;Text:&nbsp;<span style="background: ${marker.color};border:1px solid black;">&nbsp;&nbsp;&nbsp;&nbsp;</span>`;

      const deleteButton = document.createElement('button');
      deleteButton.textContent = '🗑️';
      deleteButton.style.cssText = `
        position:absolute;
        right:-25px;
        top:50%;
        transform:translateY(-50%);
        background:none;
        border:none;
        cursor:pointer;
      `;
      deleteButton.onclick = () => {
        markerSettings.markers.splice(index, 1);
        saveMarkerSettings();
        renderMarkerList();
        applyColorsToNavLinks();
      };

      markerRow.appendChild(deleteButton);
      markerListContainer.appendChild(markerRow);
    });
  }

  // Show the marker configuration menu
  function showMarkerMenu() {
    menuHeaderButton.style.color = '#fff';
    markerMenuElement.style.maxHeight = '800px';
    markerMenuElement.style.opacity = '1';
    document.addEventListener('click', handleOutsideClick);
  }

  // Hide the menu
  function hideMarkerMenu() {
    menuHeaderButton.style.color = '#000';
    markerMenuElement.style.maxHeight = '24px';
    markerMenuElement.style.opacity = '0';
    document.removeEventListener('click', handleOutsideClick);
  }

  // Close menu when clicking outside
  function handleOutsideClick(event) {
    if (!markerMenuElement.contains(event.target) && !menuHeaderButton.contains(event.target)) {
      hideMarkerMenu();
    }
  }

  // Toggle menu visibility and setup menu if not yet created
  function toggleMarkerMenu() {
    if (markerMenuElement) {
      if (markerMenuElement.style.display === 'block' && markerMenuElement.style.maxHeight !== '0px') {
        hideMarkerMenu();
      } else {
        showMarkerMenu();
      }
      return;
    }

    // Apply colors immediately
    applyColorsToNavLinks();

    const navElement = document.querySelector('nav');
    if (navElement) {
      // Observe changes in nav to reapply colors
      new MutationObserver(applyColorsToNavLinks)
        .observe(navElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-active'] });
    }

    // Create the menu HTML
    markerMenuElement = document.createElement('div');
    markerMenuElement.id = 'markerConfigMenu';
    markerMenuElement.style.cssText = `
      position: static;
      width: 220px;
      margin-top: -22px;
      background: #fefefe;
      border: 1px solid #333;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      font-family: sans-serif;
      z-index: 9999;
      overflow: hidden;
      max-height: 0px;
      opacity: 0;
      transition: max-height 0.4s ease, opacity 0.4s ease;
      color: #000;
    `;

    markerMenuElement.innerHTML = `
      <div id="menuContent">
        <div style="position:relative; display:inline-block; width:40px; height:20px;">
          <label for="enableColorsToggle" style="display:flex;align-items:right;cursor:pointer;user-select:none;direction:rtl;font-size:13px;margin-bottom:10px;">          
            <input type="checkbox" id="enableColorsToggle" style="opacity:0;width:0;height:0;"/>
            <span style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:#ccc; transition:.4s; border-radius:20px;"></span>
            <span style="position:absolute; left:3px; top:3px; bottom:3px; width:14px; height:14px; background:white; border-radius:50%; transition:.4s; box-shadow:0 0 2px rgba(0,0,0,0.2);"></span>
          </label>
        </div>
        <div style="cursor:default;margin-bottom:8px;font-size:14px;color:#333;text-align:right;direction:rtl;">
          <hr>Place symbols at the start or end of session names and set colors:
        </div>
        <div id="markerList" style="width:170px;"></div>
        <hr>
        <div style="margin-bottom:5px;">
          <input id="newSymbol" placeholder="Symbol" style="width:60px;height:30px;">
          <div style="float: right; margin-top: 3px;">
            <input id="newBg" type="color" value="#ffff00" title="Background">
            <input id="newColor" type="color" value="#000000" title="Text Color">
          </div>
        </div>
        <button id="addMarker" style="margin-right:5px;">➕ Add</button>
        <button id="resetMarkers">♻️ Reset</button>
      </div>
    `;

    menuHeaderButton.appendChild(markerMenuElement);

    const enableColorsCheckbox = document.getElementById('enableColorsToggle');
    const sliderBackground = enableColorsCheckbox.nextElementSibling;
    const sliderHandle = sliderBackground.nextElementSibling;

    enableColorsCheckbox.checked = markerSettings.enableColors;
    updateToggleSwitchAppearance(enableColorsCheckbox, sliderBackground, sliderHandle);

    enableColorsCheckbox.onchange = () => {
      markerSettings.enableColors = enableColorsCheckbox.checked;
      saveMarkerSettings();
      applyColorsToNavLinks();
      updateToggleSwitchAppearance(enableColorsCheckbox, sliderBackground, sliderHandle);
    };

    document.getElementById('addMarker').onclick = () => {
      const symbolInput = document.getElementById('newSymbol').value.trim();
      const bgInput = document.getElementById('newBg').value;
      const colorInput = document.getElementById('newColor').value;

      if (symbolInput) {
        markerSettings.markers.push({ symbol: symbolInput, bgColor: bgInput, color: colorInput });
        saveMarkerSettings();
        renderMarkerList();
        applyColorsToNavLinks();
      }
    };

    document.getElementById('resetMarkers').onclick = () => {
      if (confirm('Reset all markers?')) {
        localStorage.removeItem('navMarkerSettings');
        markerSettings = { markers: [], enableColors: true };
        renderMarkerList();
        applyColorsToNavLinks();
        enableColorsCheckbox.checked = true;
        updateToggleSwitchAppearance(enableColorsCheckbox, sliderBackground, sliderHandle);
      }
    };

    renderMarkerList();
    showMarkerMenu();
  }

  // ===== Initialization =====
  function init() {
    // Wait for #history element to appear
    const waitForHistory = setInterval(() => {
      historyElement = document.getElementById('history');
      if (historyElement) {
        clearInterval(waitForHistory);

        // Load settings or default
        markerSettings = JSON.parse(localStorage.getItem('navMarkerSettings')) || {
          markers: [{ symbol: '📌', bgColor: '#fff8b3', color: '#000' }],
          enableColors: true
        };

        // Inject styles for menu
        const injectedStyle = document.createElement('style');
        injectedStyle.textContent = `
          #menuContent { padding:10px; background:rgba(255,255,255,0.95); }
          #colorsMenuHeader {
            color: black; cursor: pointer; background: #fff; padding: 6px 12px;
            border: 1px solid #ccc; display: inline-block; position: relative;
            border-radius: 5px; margin-left: 7px; margin-top: 15px; font-size: 14px;
          }
        `;
        document.head.appendChild(injectedStyle);

        // Create menu header button
        menuHeaderButton = document.createElement('div');
        menuHeaderButton.id = 'colorsMenuHeader';
        menuHeaderButton.textContent = '☰ Session Colors';
        historyElement.parentElement.insertBefore(menuHeaderButton, historyElement);

        menuHeaderButton.addEventListener('click', event => {
          event.stopPropagation();
          toggleMarkerMenu();
        });

        // Apply colors immediately
        applyColorsToNavLinks();

        // Observe nav changes to reapply colors
        const navElement = document.querySelector('nav');
        if (navElement) {
          new MutationObserver(applyColorsToNavLinks)
            .observe(navElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-active'] });
        }
      }
    }, 100);
  }

  init();
})();
