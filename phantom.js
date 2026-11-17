(function(){
  var themeColors = {
    light: '#2563eb',
    black: '#ffffff',
    pink:  '#ff4da6',
    blue:  '#38bdf8'
  };

  function getCurrentAccent(){
    var theme = document.body.className.match(/theme-(\w+)/);
    return themeColors[theme ? theme[1] : 'pink'] || '#ff4da6';
  }

  function buildSkeletonSVG(color){
    return '<svg viewBox="0 0 200 400" xmlns="http://www.w3.org/2000/svg">' +
      '<line class="skel-line" x1="70" y1="80" x2="130" y2="80" stroke="' + color + '" stroke-width="3"/>' +
      '<line class="skel-line" x1="100" y1="80" x2="100" y2="200" stroke="' + color + '" stroke-width="3"/>' +
      '<line class="skel-line" x1="70" y1="80" x2="55" y2="140" stroke="' + color + '" stroke-width="3"/>' +
      '<line class="skel-line" x1="55" y1="140" x2="50" y2="195" stroke="' + color + '" stroke-width="3"/>' +
      '<line class="skel-line" x1="130" y1="80" x2="145" y2="140" stroke="' + color + '" stroke-width="3"/>' +
      '<line class="skel-line" x1="145" y1="140" x2="150" y2="195" stroke="' + color + '" stroke-width="3"/>' +
      '<line class="skel-line" x1="80" y1="200" x2="120" y2="200" stroke="' + color + '" stroke-width="3"/>' +
      '<line class="skel-line" x1="85" y1="200" x2="75" y2="290" stroke="' + color + '" stroke-width="3"/>' +
      '<line class="skel-line" x1="75" y1="290" x2="70" y2="380" stroke="' + color + '" stroke-width="3"/>' +
      '<line class="skel-line" x1="115" y1="200" x2="125" y2="290" stroke="' + color + '" stroke-width="3"/>' +
      '<line class="skel-line" x1="125" y1="290" x2="130" y2="380" stroke="' + color + '" stroke-width="3"/>' +
      '<circle class="skel-joint" cx="70" cy="80" r="3" fill="' + color + '"/>' +
      '<circle class="skel-joint" cx="130" cy="80" r="3" fill="' + color + '"/>' +
      '<circle class="skel-joint" cx="55" cy="140" r="3" fill="' + color + '"/>' +
      '<circle class="skel-joint" cx="145" cy="140" r="3" fill="' + color + '"/>' +
      '<circle class="skel-joint" cx="85" cy="200" r="3" fill="' + color + '"/>' +
      '<circle class="skel-joint" cx="115" cy="200" r="3" fill="' + color + '"/>' +
      '<circle class="skel-joint" cx="75" cy="290" r="3" fill="' + color + '"/>' +
      '<circle class="skel-joint" cx="125" cy="290" r="3" fill="' + color + '"/>' +
    '</svg>';
  }

  document.querySelectorAll('.topbar-item').forEach(function(item){
    item.addEventListener('click', function(){
      document.querySelectorAll('.topbar-item').forEach(function(i){i.classList.remove('active')});
      document.querySelectorAll('.section').forEach(function(s){s.classList.remove('active')});
      item.classList.add('active');
      var section = document.getElementById(item.dataset.section);
      if(section) section.classList.add('active');
      updatePreview(item.dataset.section);
      updatePanelWidth(item.dataset.section);
    });
  });

  document.querySelectorAll('.subtab').forEach(function(tab){
    tab.addEventListener('click', function(){
      document.querySelectorAll('.subtab').forEach(function(t){t.classList.remove('active')});
      document.querySelectorAll('.aim-sub').forEach(function(s){s.classList.remove('active')});
      tab.classList.add('active');
      var sub = document.getElementById('aim-' + tab.dataset.aim);
      if(sub) sub.classList.add('active');
    });
  });

  document.getElementById('settingsBtn').addEventListener('click', function(){
    document.getElementById('settingsModal').classList.add('open');
    document.getElementById('modalOverlay').classList.add('open');
  });
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalOverlay').addEventListener('click', closeModal);

  function closeModal(){
    document.getElementById('settingsModal').classList.remove('open');
    document.getElementById('modalOverlay').classList.remove('open');
  }

  window.setTheme = function(theme){
    document.body.className = 'theme-' + theme;
    document.querySelectorAll('.theme-btn').forEach(function(b){b.classList.remove('active')});
    var btn = document.querySelector('.theme-btn[data-theme="' + theme + '"]');
    if(btn) btn.classList.add('active');
    try{localStorage.setItem('phantomTheme', theme)}catch(e){}
    var active = document.querySelector('.section.active');
    if(active && active.id === 'visuals-section') renderSkeleton();
  };

  var binds = {safe:false, obs:false, nvidia:false, steam:false};
  window.toggleBind = function(name){
    binds[name] = !binds[name];
    var sw = document.getElementById('bind-' + name);
    var st = document.getElementById('bind-' + name + '-status');
    if(binds[name]){sw.classList.add('on');st.textContent='ON';st.classList.add('on')}
    else{sw.classList.remove('on');st.textContent='OFF';st.classList.remove('on')}
  };

  function renderSkeleton(){
    var con = document.getElementById('skeletonContainer');
    if(!con) return;
    var color = getCurrentAccent();
    con.innerHTML = buildSkeletonSVG(color);
    applySkeletonThickness();
  }

  function applySkeletonThickness(){
    var thickness = parseFloat(document.getElementById('skeletonThickness').value) || 3;
    var lines = document.querySelectorAll('.skel-line');
    var ratio = thickness / 3;
    lines.forEach(function(line){
      var base = parseFloat(line.getAttribute('data-base-width')) || 3;
      line.setAttribute('stroke-width', (base * ratio).toFixed(2));
    });
  }

  function storeBaseWidths(){
    document.querySelectorAll('.skel-line').forEach(function(line){
      if(!line.getAttribute('data-base-width')){
        line.setAttribute('data-base-width', line.getAttribute('stroke-width'));
      }
    });
  }

  window.updateSkeletonThickness = function(val){
    document.getElementById('thicknessValue').textContent = parseFloat(val).toFixed(1);
    storeBaseWidths();
    applySkeletonThickness();
  };

  function updatePreview(sectionId){
    var con = document.getElementById('skeletonContainer');
    var emp = document.getElementById('previewEmpty');
    if(sectionId === 'visuals-section'){
      con.classList.remove('hidden-skeleton');
      emp.classList.remove('visible');
      renderSkeleton();
    } else {
      con.classList.add('hidden-skeleton');
      emp.classList.add('visible');
    }
  }

  function updatePanelWidth(sectionId){
    var panel = document.getElementById('settingsPanel');
    if(sectionId === 'visuals-section'){
      panel.classList.remove('expanded');
    } else {
      panel.classList.add('expanded');
    }
  }

  window.toggleESP = function(){
    var sw = document.getElementById('espSwitch');
    sw.classList.toggle('on');
    var container = document.getElementById('skeletonContainer');
    container.style.opacity = sw.classList.contains('on') ? '1' : '0.2';
  };

  window.toggleSkeleton = function(){
    var sw = document.getElementById('skeletonSwitch');
    sw.classList.toggle('on');
    var container = document.getElementById('skeletonContainer');
    container.style.display = sw.classList.contains('on') ? 'block' : 'none';
  };

  window.updateBox = function(){
    var type = document.getElementById('boxType').value;
    var box = document.getElementById('boxOverlay');
    if(type === 'none'){
      box.classList.remove('visible','corner');
    } else {
      box.classList.add('visible');
      if(type === 'corner'){
        box.classList.add('corner');
      } else {
        box.classList.remove('corner');
      }
      box.style.width = '200px';
      box.style.height = '380px';
    }
  };

  window.toggleHP = function(){
    var sw = document.getElementById('hpSwitch');
    sw.classList.toggle('on');
    var hpBar = document.getElementById('hpBarContainer');
    hpBar.classList.toggle('visible', sw.classList.contains('on'));
  };

  window.updateHP = function(val){
    document.getElementById('hpValueText').textContent = val + '%';
    document.getElementById('hpBar').style.height = val + '%';
  };

  window.toggleInfo = function(type){
    var sw = document.getElementById('show' + type);
    sw.classList.toggle('on');
    var el = document.getElementById('info' + type);
    el.style.display = sw.classList.contains('on') ? 'inline-block' : 'none';
  };

  // ===== Фокусировка и Drag & Drop с точными хитбоксами =====
  var draggables = document.querySelectorAll('.draggable-element');
  var currentDrag = null;
  var focusedElement = null;
  var offsetX = 0, offsetY = 0;

  // Клик для фокусировки
  draggables.forEach(function(el){
    el.addEventListener('click', function(e){
      // Убираем фокус с предыдущего элемента
      if(focusedElement){
        focusedElement.classList.remove('focused');
      }
      // Добавляем фокус на текущий
      el.classList.add('focused');
      focusedElement = el;
      e.stopPropagation();
    });
  });

  // Убрать фокус при клике на пустое место
  document.getElementById('previewPanel').addEventListener('click', function(e){
    if(!e.target.classList.contains('draggable-element')){
      if(focusedElement){
        focusedElement.classList.remove('focused');
        focusedElement = null;
      }
    }
  });

  // Drag с точными хитбоксами
  draggables.forEach(function(el){
    el.addEventListener('mousedown', function(e){
      // Проверяем, что клик именно по элементу, а не по дочерним
      if(e.target !== el && !el.contains(e.target)) return;
      
      currentDrag = el;
      var rect = el.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      el.classList.add('dragging');
      e.stopPropagation();
      e.preventDefault();
    });
  });

  document.addEventListener('mousemove', function(e){
    if(!currentDrag) return;
    var previewPanel = document.getElementById('previewPanel');
    var panelRect = previewPanel.getBoundingClientRect();
    var x = e.clientX - panelRect.left - offsetX;
    var y = e.clientY - panelRect.top - offsetY;
    currentDrag.style.position = 'absolute';
    currentDrag.style.left = x + 'px';
    currentDrag.style.top = y + 'px';
    currentDrag.style.margin = '0';
  });

  document.addEventListener('mouseup', function(){
    if(currentDrag){
      currentDrag.classList.remove('dragging');
      currentDrag = null;
    }
  });

  var subEnd = new Date();
  subEnd.setDate(subEnd.getDate() + 27);
  subEnd.setHours(subEnd.getHours() + 14);
  subEnd.setMinutes(subEnd.getMinutes() + 32);

  function updateTimer(){
    var diff = subEnd - new Date();
    var el = document.getElementById('subTime');
    if(!el) return;
    if(diff <= 0){el.textContent = 'EXPIRED'; return}
    var d = Math.floor(diff/86400000);
    var h = Math.floor((diff%86400000)/3600000);
    var m = Math.floor((diff%3600000)/60000);
    var s = Math.floor((diff%60000)/1000);
    el.textContent = d + 'д ' + String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
  }
  setInterval(updateTimer, 1000);
  updateTimer();

  document.addEventListener('keydown', function(e){
    if(e.key === 'End'){
      e.preventDefault();
      document.getElementById('menu').classList.toggle('hidden');
    }
    if(e.key === 'Insert'){
      e.preventDefault();
      document.getElementById('menu').classList.add('hidden');
      closeModal();
    }
    if(e.key === 'Escape') closeModal();
  });

  var saved = null;
  try{saved = localStorage.getItem('phantomTheme')}catch(e){}
  setTheme(saved || 'pink');
  updatePreview('visuals-section');
})();

// ===== Цвета баров =====
var hpColor = '#10b981';
var armorColor = '#38bdf8';

window.updateHPColor = function(color){
  hpColor = color;
  document.getElementById('hpSwatch').style.background = color;
  document.getElementById('hpBar').style.background = color;
};

window.updateArmorColor = function(color){
  armorColor = color;
  document.getElementById('armorSwatch').style.background = color;
  document.getElementById('armorBar').style.background = color;
};

window.toggleArmor = function(){
  var sw = document.getElementById('armorSwitch');
  sw.classList.toggle('on');
  var el = document.getElementById('armorBarContainer');
  el.style.display = sw.classList.contains('on') ? 'flex' : 'none';
};

window.updateArmor = function(val){
  document.getElementById('armorValueText').textContent = val + '%';
  document.getElementById('armorBar').style.height = val + '%';
};

// ===== Drag & Drop с коллизиями =====
var draggables = document.querySelectorAll('.draggable-element');
var currentDrag = null;
var focusedElement = null;
var offsetX = 0, offsetY = 0;
var ghost = document.getElementById('dragGhost');
var skeletonBox = null;

// Вычисление bounding box скелета
function updateSkeletonBox(){
  var skel = document.getElementById('skeletonContainer');
  if(!skel || skel.classList.contains('hidden-skeleton')){
    skeletonBox = null;
    return;
  }
  var rect = skel.getBoundingClientRect();
  // Небольшой отступ чтобы элементы не прилипали вплотную
  skeletonBox = {
    left: rect.left + 10,
    right: rect.right - 10,
    top: rect.top + 10,
    bottom: rect.bottom - 10
  };
}

// Проверка коллизии с скелетом
function checkCollision(x, y, w, h){
  if(!skeletonBox) return false;
  return !(x + w < skeletonBox.left || 
           x > skeletonBox.right || 
           y + h < skeletonBox.top || 
           y > skeletonBox.bottom);
}

// Клик для фокусировки
draggables.forEach(function(el){
  el.addEventListener('click', function(e){
    if(focusedElement) focusedElement.classList.remove('focused');
    el.classList.add('focused');
    focusedElement = el;
    e.stopPropagation();
  });

  el.addEventListener('mousedown', function(e){
    if(e.target.tagName === 'INPUT') return;
    
    currentDrag = el;
    var rect = el.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    
    // Показываем ghost
    ghost.style.width = rect.width + 'px';
    ghost.style.height = rect.height + 'px';
    ghost.classList.add('visible');
    ghost.classList.remove('collision');
    
    el.classList.add('dragging');
    el.style.opacity = '0.3';
    e.stopPropagation();
    e.preventDefault();
    
    updateSkeletonBox();
  });
});

document.addEventListener('mousemove', function(e){
  if(!currentDrag) return;
  
  var previewPanel = document.getElementById('previewPanel');
  var panelRect = previewPanel.getBoundingClientRect();
  var x = e.clientX - panelRect.left - offsetX;
  var y = e.clientY - panelRect.top - offsetY;
  
  // Двигаем ghost
  ghost.style.left = e.clientX + 'px';
  ghost.style.top = e.clientY + 'px';
  
  // Проверяем коллизию
  var rect = currentDrag.getBoundingClientRect();
  var hasCollision = checkCollision(e.clientX, e.clientY, rect.width, rect.height);
  
  if(hasCollision){
    ghost.classList.add('collision');
    currentDrag.classList.add('collision');
  } else {
    ghost.classList.remove('collision');
    currentDrag.classList.remove('collision');
  }
});

document.addEventListener('mouseup', function(e){
  if(!currentDrag) return;
  
  var rect = currentDrag.getBoundingClientRect();
  var hasCollision = checkCollision(e.clientX, e.clientY, rect.width, rect.height);
  
  if(hasCollision){
    // Возвращаем на предыдущую позицию — отменяем перемещение
    currentDrag.style.position = '';
    currentDrag.style.left = '';
    currentDrag.style.top = '';
    currentDrag.style.margin = '';
  } else {
    // Применяем новую позицию
    var previewPanel = document.getElementById('previewPanel');
    var panelRect = previewPanel.getBoundingClientRect();
    var x = e.clientX - panelRect.left - offsetX;
    var y = e.clientY - panelRect.top - offsetY;
    currentDrag.style.position = 'absolute';
    currentDrag.style.left = x + 'px';
    currentDrag.style.top = y + 'px';
    currentDrag.style.margin = '0';
  }
  
  currentDrag.classList.remove('dragging','collision');
  currentDrag.style.opacity = '1';
  ghost.classList.remove('visible','collision');
  currentDrag = null;
});

// Убрать фокус при клике на пустое место
document.getElementById('previewPanel').addEventListener('click', function(e){
  if(!e.target.classList.contains('draggable-element')){
    if(focusedElement){
      focusedElement.classList.remove('focused');
      focusedElement = null;
    }
  }
});

// Пересчитываем box скелета при смене вкладки
var origUpdatePreview = updatePreview;
updatePreview = function(sectionId){
  origUpdatePreview(sectionId);
  setTimeout(updateSkeletonBox, 100);
};