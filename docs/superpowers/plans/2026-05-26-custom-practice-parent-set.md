# 自定义出题 + 家长练习集 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 小朋友对话中自主选数出题 + 家长批量生成10以内练习集供孩子逐题完成

**Architecture:** 新增两个 screen（custom-screen、practice-set-screen），复用 q-screen 和操作区。genQ 增加自定义模式参数。家长门控用长按。练习集存 localStorage。

**Tech Stack:** HTML5 + CSS3 + JavaScript (ES5)，零依赖

---

### Task 1: HTML — 对话按钮 + 自定义出题页 + 练习集页

**Files:**
- Modify: `index.html:90-91` (dialog buttons)
- Modify: `index.html:42` (HUD settings button)
- Modify: `index.html:39-41` (HUD area, add practice set button)

- [ ] **Step 1: 对话弹窗加自定义出题按钮**

在 L90-91 的对话按钮之间插入:

```html
    <button class="btn dialog-btn custom-btn" id="dCustom" onclick="openCustom()" style="display:none">✏️ 我想自己出题</button>
```

放在 `<button id="dAction">` 之后、`<button class="btn dialog-close">` 之前。

修改 `talk()` 函数中显示 `#dCustom` 按钮（在 game.js 后续 task 处理）。

- [ ] **Step 2: 新增自定义出题屏 (custom-screen)**

在 `<!-- 故事任务 -->` 之前（L95前）插入:

```html
<!-- 自定义出题 -->
<div class="screen" id="custom-screen">
  <div class="q-header">
    <button class="q-back" onclick="show('island-screen')">✕ 返回</button>
    <span class="q-title">✏️ 自由出题</span>
    <span></span>
  </div>
  <div class="q-card">
    <div class="q-bubble">
      <div class="q-animal" id="cAnimal">🐱</div>
      <div class="q-speech" id="cSpeech">选好数字，我陪你做题！</div>
      <button class="q-speak-btn" id="cSpeakBtn" onclick="speak('选好数字，我陪你做题！')">🔊</button>
    </div>
    <div class="custom-section">
      <div class="custom-label">运算类型</div>
      <div class="custom-types" id="cTypes">
        <button class="ct-btn sel" data-t="add" onclick="pickType('add',this)">➕ 加法</button>
        <button class="ct-btn" data-t="sub" onclick="pickType('sub',this)">➖ 减法</button>
        <button class="ct-btn" data-t="mix" onclick="pickType('mix',this)">🎲 混合</button>
      </div>
    </div>
    <div class="custom-section">
      <div class="custom-label" id="cNum1Label">第一个数</div>
      <div class="custom-nums" id="cNums1"></div>
    </div>
    <div class="custom-section">
      <div class="custom-label" id="cNum2Label">第二个数</div>
      <div class="custom-nums" id="cNums2"></div>
    </div>
    <div class="custom-preview" id="cPreview">3 + 2 = ? 🐟</div>
    <button class="btn start-btn" id="cStart" onclick="startCustom()" disabled>🚀 开始做题</button>
  </div>
</div>
```

- [ ] **Step 3: 新增练习集设置屏 (practice-set-screen)**

在 `custom-screen` 之后插入:

```html
<!-- 练习集设置（家长） -->
<div class="screen" id="practice-set-screen">
  <div class="q-header">
    <button class="q-back" onclick="show('island-screen')">✕ 返回</button>
    <span class="q-title">📋 练习集</span>
    <span></span>
  </div>
  <div class="q-card">
    <div class="ps-section">
      <div class="ps-label">运算类型</div>
      <div class="ps-types" id="psTypes">
        <button class="pt-btn sel" data-t="add" onclick="pickPSType('add',this)">➕ 加法</button>
        <button class="pt-btn" data-t="sub" onclick="pickPSType('sub',this)">➖ 减法</button>
        <button class="pt-btn" data-t="mix" onclick="pickPSType('mix',this)">🎲 混合</button>
      </div>
    </div>
    <div class="ps-section">
      <div class="ps-label">第1个数字范围: <span id="psR1">1 ~ 10</span></div>
      <input type="range" class="ps-range" id="psMin1" min="1" max="10" value="1" oninput="updPSRange()">
      <input type="range" class="ps-range" id="psMax1" min="1" max="10" value="10" oninput="updPSRange()">
    </div>
    <div class="ps-section">
      <div class="ps-label">第2个数字范围: <span id="psR2">0 ~ 9</span></div>
      <input type="range" class="ps-range" id="psMin2" min="0" max="10" value="0" oninput="updPSRange()">
      <input type="range" class="ps-range" id="psMax2" min="0" max="10" value="9" oninput="updPSRange()">
    </div>
    <div class="ps-section">
      <div class="ps-label">题目数量</div>
      <div class="ps-counts" id="psCounts">
        <button class="pc-btn sel" data-n="5" onclick="pickPSCount(5,this)">5</button>
        <button class="pc-btn" data-n="10" onclick="pickPSCount(10,this)">10</button>
        <button class="pc-btn" data-n="15" onclick="pickPSCount(15,this)">15</button>
        <button class="pc-btn" data-n="20" onclick="pickPSCount(20,this)">20</button>
      </div>
    </div>
    <button class="btn start-btn" onclick="generatePraticeSet()">📋 生成练习集</button>
    <div class="ps-msg" id="psMsg"></div>
  </div>
</div>
```

- [ ] **Step 4: 新增练习集总结弹窗**

在 q-screen 之后插入:

```html
<!-- 练习集完成总结 -->
<div class="ps-summary-overlay" id="psSummaryOv">
  <div class="ps-summary-card">
    <div class="ps-summary-icon" id="psSumIcon">🌟</div>
    <div class="ps-summary-title" id="psSumTitle">太棒了！</div>
    <div class="ps-summary-score" id="psSumScore">10 / 10</div>
    <div class="ps-summary-stars" id="psSumStars">⭐⭐⭐</div>
    <button class="btn start-btn" onclick="retryPracticeSet()">🔄 再来一次</button>
    <button class="btn dialog-close" onclick="closePSSummary()">🏝️ 返回岛屿</button>
  </div>
</div>
```

- [ ] **Step 5: HUD 加练习集入口按钮**

在 L40 (📖 故事按钮) 之前插入:

```html
    <button class="hud-task-btn" id="hudPSBtn" onclick="startPracticeSet()" style="font-size:18px;background:none;border:none;cursor:pointer;display:none">📝</button>
```

- [ ] **Step 6: 提交**

```bash
git add index.html
git commit -m "feat: 自定义出题+练习集 — HTML 结构"
```

---

### Task 2: CSS — 新页面样式

**Files:**
- Modify: `style.css` (末尾追加)

- [ ] **Step 1: 追加全部新样式**

在 `style.css` 末尾追加:

```css
/* ===== 自定义出题 ===== */
.custom-section{margin:6px 0;width:100%}
.custom-label{font-size:14px;font-weight:bold;color:#666;margin-bottom:6px;text-align:center}
.custom-types{display:flex;gap:8px;justify-content:center}
.ct-btn{padding:10px 18px;border:2px solid #E0E0E0;border-radius:14px;background:#fff;font-size:18px;cursor:pointer;transition:all .2s}
.ct-btn.sel{border-color:#42A5F5;background:#E3F2FD;color:#1565C0;font-weight:bold;box-shadow:0 0 0 3px rgba(66,165,245,.2)}
.custom-nums{display:flex;flex-wrap:wrap;gap:6px;justify-content:center}
.cn-btn{width:44px;height:44px;border:2px solid #E0E0E0;border-radius:12px;background:#fff;font-size:20px;font-weight:bold;color:#555;cursor:pointer;transition:all .15s}
.cn-btn.sel{border-color:#42A5F5;background:#1565C0;color:#fff;box-shadow:0 2px 8px rgba(21,101,192,.3)}
.cn-btn.dis{opacity:.25;pointer-events:none}
.custom-preview{text-align:center;font-size:28px;font-weight:bold;color:#333;margin:12px 0;padding:10px;background:#F5F5F5;border-radius:12px}
.custom-btn{background:linear-gradient(135deg,#42A5F5,#1E88E5)!important;margin-top:4px}

/* ===== 练习集设置（家长） ===== */
.ps-section{margin:6px 0;width:100%}
.ps-label{font-size:14px;font-weight:bold;color:#666;margin-bottom:6px;text-align:center}
.ps-types{display:flex;gap:8px;justify-content:center}
.pt-btn{padding:10px 18px;border:2px solid #E0E0E0;border-radius:14px;background:#fff;font-size:18px;cursor:pointer;transition:all .2s}
.pt-btn.sel{border-color:#AB47BC;background:#F3E5F5;color:#7B1FA2;font-weight:bold;box-shadow:0 0 0 3px rgba(171,71,188,.2)}
.ps-range{width:100%;margin:4px 0;-webkit-appearance:none;height:6px;border-radius:3px;background:#E0E0E0;outline:none}
.ps-range::-webkit-slider-thumb{-webkit-appearance:none;width:24px;height:24px;border-radius:50%;background:#AB47BC;cursor:pointer}
.ps-counts{display:flex;gap:8px;justify-content:center}
.pc-btn{width:48px;height:48px;border:2px solid #E0E0E0;border-radius:12px;background:#fff;font-size:20px;font-weight:bold;color:#555;cursor:pointer;transition:all .15s}
.pc-btn.sel{border-color:#AB47BC;background:#7B1FA2;color:#fff}
.ps-msg{text-align:center;font-size:14px;color:#4CAF50;margin-top:8px;min-height:20px}

/* ===== 练习集总结弹窗 ===== */
.ps-summary-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.6);z-index:100;display:none;justify-content:center;align-items:center}
.ps-summary-overlay.show{display:flex}
.ps-summary-card{background:white;border-radius:28px;padding:32px 24px;text-align:center;max-width:280px;box-shadow:0 20px 60px rgba(0,0,0,.3);animation:luPop .6s ease}
.ps-summary-icon{font-size:60px;margin-bottom:8px}
.ps-summary-title{font-size:22px;font-weight:bold;color:#333;margin-bottom:12px}
.ps-summary-score{font-size:36px;font-weight:bold;color:#1565C0;margin-bottom:8px}
.ps-summary-stars{font-size:32px;margin-bottom:20px}
.ps-summary-card .btn{margin:6px 0;width:100%}
```

- [ ] **Step 2: 提交**

```bash
git add style.css
git commit -m "style: 自定义出题+练习集 — 新页面样式"
```

---

### Task 3: JS — 自定义出题屏逻辑 + genQ 自定义模式

**Files:**
- Modify: `game.js` — add custom screen functions, modify genQ, modify talk()

- [ ] **Step 1: 修改 genQ 支持自定义模式**

在 `function genQ(mode,level,aid)` 签名后、`var an=...` 之前，加入自定义模式分支:

```javascript
function genQ(mode,level,aid,custom){
  var an=AN[aid]||AN.cat;
  var tk=mode||an.teach;
  var tp=TPL[tk];
  if(!tp)tp=TPL.add;
  var sc;
  var ms=Math.min(tp.maxSum||10,10);
  var nums=[],ans=0,op='+';

  if(custom){
    nums=custom.nums.slice();op=custom.op;
    if(op==='mix'){op=Math.random()<0.5?'+':'-';}
    ans=op==='+'?nums[0]+nums[1]:nums[0]-nums[1];
  }else{
```

然后将原来 if/else 的随机生成代码用 `}` 闭合（在随机生成逻辑结束后、`// 选场景` 之前加 `}`）。

完整替换: 在 `var nums=[],ans=0,op='';` 之后插入自定义分支，在 L265 的 `}` 之后、`// 选场景` 之前不额外加闭合（原有的 else 链最后一个 `}` 已经闭合）。

实际操作: 在 `var nums=[],ans=0,op='';` 下一行插入:

```javascript
  if(custom){
    nums=custom.nums.slice();op=custom.op;
    if(op==='mix'){op=Math.random()<0.5?'+':'-';}
    ans=op==='+'?nums[0]+nums[1]:nums[0]-nums[1];
  }else{
```

在原有随机生成代码的最后一个 `}`（L265）之后加一个 `}`:

```javascript
  }
```

即将原有的:
```
  }else{...默认随机...}
```
改为:
```
  }else{...默认随机...}
  }
```

注意: 这里需要在原有代码的 else 链结构上精确插入。原有结构是 if...else if...else if...else。我们在 `var nums=[],ans=0,op='';` 后插入 `if(custom){...}else{`，并在原有 else 链结束的 `}` 后加 `}`。

简化方案: 直接在最前面加 early return 模式，最小化改动:

```javascript
function genQ(mode,level,aid,custom){
  var an=AN[aid]||AN.cat;
  var tk=mode||an.teach;
  var tp=TPL[tk];
  if(!tp)tp=TPL.add;
  var sc;
  var ms=Math.min(tp.maxSum||10,10);
  var nums=[],ans=0,op='+';

  if(custom){
    nums=custom.nums.slice();op=custom.op;
    if(op==='mix'){op=Math.random()<0.5?'+':'-';}
    ans=op==='+'?nums[0]+nums[1]:nums[0]-nums[1];
    ms=Math.max(ms,ans);
  }else{
    // === 原有的 if/else if/else 随机生成代码，用 { } 包裹 ===
    if(tp.mode==='add'||tp.mode==='ac'){
      // ... 不变 ...
    }else if(tp.mode==='sub'||tp.mode==='sc'){
      // ... 不变 ...
    }else if(tp.mode==='mix'){
      // ... 不变 ...
    }else{
      // ... 不变 ...
    }
  }
  // 选场景、生成选项、构造返回值 - 全部不变
```

- [ ] **Step 2: 添加自定义出题屏变量和函数**

在 game.js 的 `/* ===== 题目系统 ===== */` 区块后添加:

```javascript
/* ===== 自定义出题 ===== */
var CS={type:'add',num1:3,num2:2,aid:'cat'};

function openCustom(aid){
  CS.aid=aid||curAnimal||'cat';CS.type='add';CS.num1=3;CS.num2=2;
  var an=AN[CS.aid];
  document.getElementById('cAnimal').textContent=an.emoji;
  document.getElementById('cSpeech').textContent='选好数字，我陪你做题！';
  closeDlg();
  renderCNums();
  document.querySelectorAll('#cTypes .ct-btn').forEach(function(b){b.classList.remove('sel')});
  document.querySelector('#cTypes .ct-btn[data-t="add"]').classList.add('sel');
  show('custom-screen');
}
function pickType(t,el){
  CS.type=t;CS.num2=Math.min(CS.num2,CS.num1);
  document.querySelectorAll('#cTypes .ct-btn').forEach(function(b){b.classList.remove('sel')});
  el.classList.add('sel');
  renderCNums();updateCPreview();
}
function renderCNums(){
  var ct1=document.getElementById('cNums1');ct1.innerHTML='';
  for(var i=1;i<=10;i++){
    var b=document.createElement('button');b.className='cn-btn'+(i===CS.num1?' sel':'');
    b.textContent=i;b.onclick=(function(n){return function(){CS.num1=n;if(CS.type==='sub')CS.num2=Math.min(CS.num2,CS.num1);renderCNums();updateCPreview()}})(i);
    ct1.appendChild(b);
  }
  var ct2=document.getElementById('cNums2');ct2.innerHTML='';
  for(var i=0;i<=10;i++){
    var b=document.createElement('button');b.className='cn-btn'+(i===CS.num2?' sel':'');
    if(CS.type==='sub'&&i>CS.num1)b.className+=' dis';
    b.textContent=i;
    if(CS.type!=='sub'||i<=CS.num1)b.onclick=(function(n){return function(){CS.num2=n;renderCNums();updateCPreview()}})(i);
    ct2.appendChild(b);
  }
  document.getElementById('cNum1Label').textContent='第一个数 ('+CS.num1+')';
  document.getElementById('cNum2Label').textContent='第二个数 ('+CS.num2+')';
}
function updateCPreview(){
  var op=CS.type==='sub'?'−':'+';if(CS.type==='mix')op='?';
  var an=AN[CS.aid];var em=(an.items&&an.items.length)?an.items[0]:'🍎';
  document.getElementById('cPreview').textContent=CS.num1+' '+op+' '+CS.num2+' = ? '+em;
  var start=document.getElementById('cStart');
  start.disabled=false;
}
function startCustom(){
  var teach=CS.type==='sub'?'sub':(CS.type==='mix'?'mix':'add');
  var mode=(CS.type==='mix')?'mix':teach;
  startQ('custom',CS.aid,teach,999);
  // 把自定义参数存到 QS 上供 genQ 使用
  QS.customNums=[CS.num1,CS.num2];QS.customType=CS.type;
}
```

- [ ] **Step 3: 修改 talk() 显示自定义按钮**

在 `talk()` 函数中（L349附近），`document.getElementById('dAction').style.display=''` 之后加:

```javascript
  document.getElementById('dCustom').style.display='';
```

- [ ] **Step 4: 修改 startQ/nextQ 传 custom 参数给 genQ**

在 `nextQ()` 的 `genQ` 调用处（L469），改为:

```javascript
  var custom=QS.mode==='custom'?{nums:QS.customNums,op:QS.customType}:null;
  var q=genQ(QS.teach,S.level,QS.aid,custom);QS.curQ=q;
```

- [ ] **Step 5: 提交**

```bash
git add game.js
git commit -m "feat: 自定义出题屏 — 选类型+数字+genQ适配"
```

---

### Task 4: JS — 家长门控 + 练习集生成

**Files:**
- Modify: `game.js` — add long press handler, practice set screen functions

- [ ] **Step 1: 替换 ⚙️ 按钮为长按门控**

修改 `index.html` L42 的 ⚙️ onclick:

```html
<button class="hud-task-btn" id="hudSettingsBtn" style="font-size:14px;background:none;border:none;cursor:pointer;opacity:.5" title="设置">⚙️</button>
```

在 game.js 的初始化部分添加长按逻辑:

```javascript
/* ===== 家长门控 ===== */
var settingsPressTimer=null;
function initSettingsLongPress(){
  var btn=document.getElementById('hudSettingsBtn');
  if(!btn)return;
  btn.addEventListener('mousedown',function(e){e.preventDefault();startSettingsPress()});
  btn.addEventListener('touchstart',function(e){e.preventDefault();startSettingsPress()},{passive:false});
  btn.addEventListener('mouseup',cancelSettingsPress);
  btn.addEventListener('touchend',cancelSettingsPress);
  btn.addEventListener('mouseleave',cancelSettingsPress);
  btn.addEventListener('touchcancel',cancelSettingsPress);
}
function startSettingsPress(){
  cancelSettingsPress();
  settingsPressTimer=setTimeout(function(){openPracticeSetScreen()},3000);
}
function cancelSettingsPress(){if(settingsPressTimer){clearTimeout(settingsPressTimer);settingsPressTimer=null}}
function openPracticeSetScreen(){pS('click');show('practice-set-screen')}
```

在 `initGame()` 或初始化代码末尾调用 `initSettingsLongPress()`。

- [ ] **Step 2: 练习集设置屏逻辑**

添加变量和函数:

```javascript
/* ===== 练习集 ===== */
var PS={type:'add',min1:1,max1:10,min2:0,max2:9,count:10};

function pickPSType(t,el){
  PS.type=t;
  document.querySelectorAll('#psTypes .pt-btn').forEach(function(b){b.classList.remove('sel')});
  el.classList.add('sel');
}
function updPSRange(){
  PS.min1=parseInt(document.getElementById('psMin1').value);
  PS.max1=parseInt(document.getElementById('psMax1').value);
  PS.min2=parseInt(document.getElementById('psMin2').value);
  PS.max2=parseInt(document.getElementById('psMax2').value);
  // 保证 min ≤ max
  if(PS.min1>PS.max1)PS.min1=PS.max1;if(PS.min2>PS.max2)PS.min2=PS.max2;
  document.getElementById('psMin1').value=PS.min1;document.getElementById('psMax1').value=PS.max1;
  document.getElementById('psMin2').value=PS.min2;document.getElementById('psMax2').value=PS.max2;
  document.getElementById('psR1').textContent=PS.min1+' ~ '+PS.max1;
  document.getElementById('psR2').textContent=PS.min2+' ~ '+PS.max2;
}
function pickPSCount(n,el){
  PS.count=n;
  document.querySelectorAll('#psCounts .pc-btn').forEach(function(b){b.classList.remove('sel')});
  el.classList.add('sel');
}
```

- [ ] **Step 3: 生成练习集函数**

```javascript
function generatePraticeSet(){
  var questions=[];var fails=0;
  // 临时 aid 用于 genQ
  var tmpAid=PS.type==='sub'?'dog':'cat';
  var teach=PS.type==='sub'?'sub':(PS.type==='mix'?'mix':'add');
  while(questions.length<PS.count&&fails<200){
    var a=ri(PS.min1,PS.max1);
    var b=ri(PS.min2,PS.max2);
    if(PS.type==='sub'&&b>a){var t=a;a=b;b=t;}
    if(PS.type==='mix'){
      var isAdd=Math.random()<0.5;
      if(isAdd&&a+b>10)continue;
      if(!isAdd&&b>a){var t=a;a=b;b=t;}
      if(!isAdd&&a-b<0)continue;
    }
    if(PS.type==='add'&&a+b>10)continue;
    if(PS.type==='sub'&&a-b<0)continue;
    var custom={nums:[a,b],op:PS.type==='mix'?(Math.random()<0.5?'+':'-'):(PS.type==='sub'?'-':'+')};
    var q=genQ(teach,1,tmpAid,custom);
    questions.push(q);fails=0;
    fails++;
  }
  if(questions.length===0){document.getElementById('psMsg').textContent='无法生成题目，请调整范围';return}
  var set={type:PS.type,questions:questions,progress:{done:0,correct:0},createdAt:Date.now()};
  localStorage.setItem('mi2_practice_set',JSON.stringify(set));
  document.getElementById('psMsg').textContent='✅ 已生成 '+questions.length+' 道题！';
  // 更新 HUD 按钮
  var hudBtn=document.getElementById('hudPSBtn');if(hudBtn)hudBtn.style.display='';
}
```

- [ ] **Step 4: 提交**

```bash
git add index.html game.js
git commit -m "feat: 家长门控长按 + 练习集批量生成"
```

---

### Task 5: JS — 练习集练习流程 + 总结

**Files:**
- Modify: `game.js` — add practice set practice flow

- [ ] **Step 1: 练习集练习入口**

```javascript
function startPracticeSet(){
  var raw=localStorage.getItem('mi2_practice_set');
  if(!raw)return;
  var set=JSON.parse(raw);
  set.progress={done:0,correct:0}; // 每次重新开始重置进度
  localStorage.setItem('mi2_practice_set',JSON.stringify(set));
  startQ('practice','cat',set.type,set.questions.length);
}
```

- [ ] **Step 2: 修改 nextQ 支持练习集模式**

在 `nextQ()` 的 `genQ` 调用处（L469），补充练习集模式:

```javascript
  var custom=QS.mode==='custom'?{nums:QS.customNums,op:QS.customType}:null;
  if(QS.mode==='practice'){
    var raw=localStorage.getItem('mi2_practice_set');
    var set=JSON.parse(raw);
    if(set&&set.questions[QS.cur]){
      QS.practiceSet=set;
      var pq=set.questions[QS.cur];
      // 复用题目数据进行渲染
      custom={nums:pq.nums,op:pq.op,_q:pq};
    }
  }
  var q;if(custom&&custom._q){q=custom._q;q.an=AN[QS.aid]||AN.cat}
  else{q=genQ(QS.teach,S.level,QS.aid,custom)}
  QS.curQ=q;
```

实际上有更简洁的做法：练习集模式下直接取预设的 question 对象:

```javascript
  var q;
  if(QS.mode==='practice'){
    var raw=localStorage.getItem('mi2_practice_set');
    var set=JSON.parse(raw);
    q=set.questions[QS.cur];QS.curQ=q;
  }else{
    var custom=QS.mode==='custom'?{nums:QS.customNums,op:QS.customType}:null;
    q=genQ(QS.teach,S.level,QS.aid,custom);QS.curQ=q;
  }
```

简化实现：分别在 custom 和 practice 分支处理，互不干扰。

最终 nextQ 中 genQ 调用区域改为:

```javascript
  var q;
  if(QS.mode==='practice'){
    var psRaw=localStorage.getItem('mi2_practice_set');
    var psSet=JSON.parse(psRaw);
    q=psSet.questions[QS.cur];QS.curQ=q;
  }else if(QS.mode==='custom'){
    var custom={nums:QS.customNums,op:QS.customType};
    q=genQ(QS.teach,S.level,QS.aid,custom);QS.curQ=q;
  }else{
    q=genQ(QS.teach,S.level,QS.aid);QS.curQ=q;
  }
```

- [ ] **Step 3: 修改 finishQ 处理练习集完成**

在 `finishQ()` 中:

```javascript
function finishQ(){
  if(QS.mode==='practice'){
    showPSSummary();
  }else if(QS.mode==='story'){
    // ... existing ...
  }else if(QS.mode==='adv'){
    // ... existing ...
  }else{
    show('island-screen');
  }
}
```

- [ ] **Step 4: 修改 chk 中记录练习集正确数**

在 `chk()` 答对分支中（L553附近，`QS.correct++` 之后）:

```javascript
    if(QS.mode==='practice'){
      var psRaw=localStorage.getItem('mi2_practice_set');
      var psSet=JSON.parse(psRaw);
      psSet.progress.correct++;
      psSet.progress.done=QS.cur;
      localStorage.setItem('mi2_practice_set',JSON.stringify(psSet));
    }
```

答错分支（L563附近）也记录 done:

```javascript
  }else{
    // ... existing ...
    if(QS.mode==='practice'){
      var psRaw=localStorage.getItem('mi2_practice_set');
      var psSet=JSON.parse(psRaw);
      psSet.progress.done=QS.cur;
      localStorage.setItem('mi2_practice_set',JSON.stringify(psSet));
    }
  }
```

- [ ] **Step 5: 总结弹窗 + 重试/关闭**

```javascript
function showPSSummary(){
  var raw=localStorage.getItem('mi2_practice_set');
  var set=JSON.parse(raw);
  var correct=set.progress.correct||0;
  var total=set.questions.length;
  var pct=total>0?correct/total:0;
  var stars=pct>=1?'⭐⭐⭐':(pct>=0.8?'⭐⭐':'⭐');
  var icon=pct>=1?'🎉':(pct>=0.8?'😊':'💪');
  var title=pct>=1?'完美！全对！':(pct>=0.8?'很棒！':'加油！');
  document.getElementById('psSumIcon').textContent=icon;
  document.getElementById('psSumTitle').textContent=title;
  document.getElementById('psSumScore').textContent=correct+' / '+total;
  document.getElementById('psSumStars').textContent=stars;
  document.getElementById('psSummaryOv').classList.add('show');
}
function closePSSummary(){
  document.getElementById('psSummaryOv').classList.remove('show');
  show('island-screen');
}
function retryPracticeSet(){
  document.getElementById('psSummaryOv').classList.remove('show');
  startPracticeSet();
}
```

- [ ] **Step 6: 岛屿初始化时恢复 HUD 📝 按钮**

在 `updIsland()` 或初始化中:

```javascript
  var psBtn=document.getElementById('hudPSBtn');
  if(psBtn){
    var psRaw=localStorage.getItem('mi2_practice_set');
    psBtn.style.display=psRaw?'':'none';
  }
```

- [ ] **Step 7: 提交**

```bash
git add game.js
git commit -m "feat: 练习集练习流程 — 逐题作答+总结评价"
```

---

### Task 6: 手动验证

- [ ] **Step 1: 自定义出题验证**

1. 浏览器打开 index.html，创建角色
2. 点击岛屿上任意动物 → 对话弹窗出现
3. 确认: 弹窗有"✏️ 我想自己出题"按钮
4. 点击 → 进入自定义出题页
5. 选择"减法"→ 确认第2个数大于第1个数的按钮置灰
6. 选好类型和数字 → 预览算式正确
7. 点击"开始做题"→ 进入题目页，操作区正常
8. Lv.7 时确认显示分解树

- [ ] **Step 2: 家长练习集验证**

1. 长按 ⚙️ 3秒 → 进入练习集设置页
2. 选加法，数字范围 1-5 + 0-3，5题
3. 点击"生成练习集"→ 确认成功提示
4. 返回岛屿 → 确认 HUD 出现 📝 按钮
5. 点击 📝 → 逐题完成
6. 做完后 → 确认总结弹窗显示正确分数和星级
7. 点击"再来一次"→ 重新开始
8. 点击"返回岛屿"→ 回到岛屿

- [ ] **Step 3: 边界验证**

1. 减法练习集：确认不出现 b > a 的题
2. 加法练习集：确认 a + b ≤ 10
3. 混合练习集：确认加法和减法各有出现
4. 中断练习（做到一半退出）：确认可从 📝 重新开始

- [ ] **Step 4: 提交（如有修复）**

```bash
git add -A && git commit -m "fix: 自定义出题+练习集细节修复"
```

---

### 文件变更总览

| 文件 | 操作 | 内容 |
|------|------|------|
| `index.html` | +4 处修改 | 对话按钮、custom-screen、practice-set-screen、总结弹窗、HUD 📝 |
| `style.css` | +~55行 | 自定义出题、练习集设置、总结弹窗样式 |
| `game.js:232-285` | 修改 genQ | 增加 custom 参数 |
| `game.js:349+` | 修改 talk() | 显示自定义按钮 |
| `game.js:461-476` | 修改 nextQ | custom/practice 分支 |
| `game.js:548-563` | 修改 chk | practice progress 记录 |
| `game.js:577-586` | 修改 finishQ | practice 完成处理 |
| `game.js:309+` | 新增 ~120行 | CS/PS 逻辑、长按门控、总结弹窗 |
