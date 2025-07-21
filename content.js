(() => {
  const history = document.getElementById('history');
  if (!history) {
    console.log('לא נמצא אלמנט עם id="history"');
    return;
  }

  const row = document.createElement('div');
  row.id='colorsMenuHeader';
  row.textContent = '☰ צביעת סשנים';
  row.style.cursor = 'pointer';
  row.style.background = '#fff';
  row.style.padding = '6px 12px';
  row.style.border = '1px solid #ccc';
  row.style.display = 'inline-block';
  row.style.position = 'relative';
  row.style.borderRadius = '5px';
  row.style.marginLeft = '7px';
  row.style.marginTop = '15px';

  history.parentElement.insertBefore(row, history);

  let m = null;

  function toggleMenu() {
    if (m) {
      if (m.style.display === 'block' && m.style.maxHeight !== '0px') {
        //hideMenu();
      } else {
        showMenu();
      }
      return;
    }

    let s = JSON.parse(localStorage.getItem('navMarkerSettings')) || {
      markers: [{symbol:'📌',bgColor:'#fff8b3',color:''}],
      enableColors: true
    };

    function save() {
      localStorage.setItem('navMarkerSettings', JSON.stringify(s));
    }

    function h() {
      document.querySelectorAll('nav a').forEach(c=>{
        let t=c.textContent.trim();
        c.style.backgroundColor='';
        c.style.color='';
        if(s.enableColors) {
          s.markers.forEach(m=>{
            if(t.startsWith(m.symbol)||t.endsWith(m.symbol)){
              c.style.backgroundColor=m.bgColor||'';
              c.style.color=m.color||'';
            }
          });
        }
        c.style.fontWeight='';
        if(c.hasAttribute('data-active')){
          c.style.fontWeight='bold';
        }
      });
    }

    h();
    const n=document.querySelector('nav');
    if(n){
      new MutationObserver(h).observe(n,{childList:true,subtree:true,attributes:true,attributeFilter:['data-active']});
    }

    m = document.createElement('div');
    m.id = 'markerConfigMenu';
    m.style.position = 'static';
    m.style.width = '220px';
	m.style.marginTop = '-22px';
    m.style.background = '#fefefe';
    m.style.border = '1px solid #333';
    m.style.borderRadius = '8px';
    m.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    m.style.fontFamily = 'sans-serif';
    m.style.zIndex = '9999';
    m.style.overflow = 'hidden';
    m.style.maxHeight = '0px';
    m.style.opacity = '0';
    m.style.transition = 'max-height 0.4s ease, opacity 0.4s ease';
	m.style.color = '#000';
    m.innerHTML = `
      <div id="menuContent" style="padding:10px;background:rgba(255,255,255,0.95);">
        <label for="enableColorsToggle" style="display:flex;align-items:center;cursor:pointer;user-select:none;direction:rtl;font-size:13px;margin-bottom:10px;">
          <span style="margin-left:8px;">הפעל צבעים</span>
          <div style="position:relative; display:inline-block; width:40px; height:20px;">
            <input type="checkbox" id="enableColorsToggle" style="opacity:0;width:0;height:0;"/>
            <span style="
              position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; 
              background-color:#ccc; transition:.4s; border-radius:20px;">
            </span>
            <span style="
              position:absolute; left:3px; top:3px; bottom:3px; width:14px; height:14px; 
              background:white; border-radius:50%; transition:.4s;
              box-shadow:0 0 2px rgba(0,0,0,0.2);
            "></span>
          </div>
        </label>
        <div style="cursor:default;margin-bottom:8px;font-size:14px;color:#333;text-align:right;direction:rtl;">
          <hr>מקם סימנים בתחילת <br>או בסוף שם של שיחה,<br> והגדר צבעים:
        </div>
        <div id="markerList" style="width:170px;"></div>
        <hr>
        <div style="margin-bottom:5px;">
          <input id="newSymbol" placeholder="סימן" style="width:40px;">
          <input id="newBg" type="color" value="#ffff00" title="רקע">
          <input id="newColor" type="color" value="#000000" title="צבע טקסט">
        </div>
        <button id="addMarker" style="margin-right:5px;">➕ הוסף</button>
        <button id="resetMarkers">♻️ איפוס</button>
      </div>
    `;

    row.appendChild(m);

    const toggleInput = document.getElementById('enableColorsToggle');
    const sliderBg = toggleInput.nextElementSibling;
    const sliderCircle = sliderBg.nextElementSibling;

    function updateToggleStyle() {debugger;
      if(toggleInput.checked){
        sliderBg.style.backgroundColor = '#4CAF50';
        sliderCircle.style.transform = 'translateX(20px)';
      } else {
        sliderBg.style.backgroundColor = '#ccc';
        sliderCircle.style.transform = 'translateX(0)';
      }
    }

    toggleInput.checked = s.enableColors;
    updateToggleStyle();

    toggleInput.onchange = () => {
      s.enableColors = toggleInput.checked;
      save();
      h();
      updateToggleStyle();
    };

    function r(){
      const l=document.getElementById('markerList');
      l.innerHTML='';
      if(s.markers.length===0){
        l.innerHTML='<em>אין סימנים מוגדרים.</em>';
      }
      s.markers.forEach((m,i)=>{
        const d=document.createElement('div');
        d.style.marginBottom='4px';
        d.style.background='#f0f0f0';
        d.style.padding='4px 30px 4px 4px';
        d.style.borderRadius='4px';
        d.style.position='relative';
        d.innerHTML=`${m.symbol} BG:&nbsp;<span style="background: ${m.bgColor};border:1px solid black;">&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;&nbsp;Text:&nbsp;<span style="background: ${m.color};border:1px solid black;">&nbsp;&nbsp;&nbsp;&nbsp;</span>`;
        const b=document.createElement('button');
        b.textContent='🗑️';
        b.style.position='absolute';
        b.style.right='-25px';
        b.style.top='50%';
        b.style.transform='translateY(-50%)';
        b.style.background='none';
        b.style.border='none';
        b.style.cursor='pointer';
        b.onclick=()=>{
          s.markers.splice(i,1);
          save();
          r();
          h();
        };
        d.appendChild(b);
        l.appendChild(d);
      });
    }
    r();

    document.getElementById('addMarker').onclick=()=>{
      const sy=document.getElementById('newSymbol').value.trim(),
            bg=document.getElementById('newBg').value,
            co=document.getElementById('newColor').value;
      if(sy){
        s.markers.push({symbol:sy,bgColor:bg,color:co});
        save();
        r();
        h();
      }
    };

    document.getElementById('resetMarkers').onclick=()=>{
      if(confirm('לאפס הכל?')){
        localStorage.removeItem('navMarkerSettings');
        s={markers:[], enableColors: true};
        r();
        h();
        toggleInput.checked = true;
        updateToggleStyle();
      }
    };

    function showMenu() {
	  row.style.color = '#fff';
      //m.style.display = 'block';
      //requestAnimationFrame(() => {
        m.style.maxHeight = '800px';
        m.style.opacity = '1';
      //});
      document.addEventListener('click', outsideClick);
    }

    function hideMenu() {
	  row.style.color = '#000';
      m.style.maxHeight = '24px';
      m.style.opacity = '0';
      //setTimeout(() => {
      //  m.style.display = 'none';
      //}, 400);
      document.removeEventListener('click', outsideClick);
    }

    function outsideClick(e) {
      if (!m.contains(e.target) && !row.contains(e.target)) {
        hideMenu();
      }
    }

    showMenu();
  }

  row.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });
})();
