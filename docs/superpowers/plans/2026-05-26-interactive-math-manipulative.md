# 交互式数学操作物 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 Lv.1-6 题目的自动展示 emoji 图标替换为互动式点击放置系统，小朋友自己动手摆放/移除物品理解加减法。

**Architecture:** 纯前端 UI 变更，修改三个文件（HTML/CSS/JS）。在现有 `nextQ()` 流程中插入新渲染路径，操作区状态独立于答题逻辑。Lv.7 分解树枝图保持不变。

**Tech Stack:** HTML5 + CSS3 + JavaScript (ES5)，零依赖

---

### Task 1: HTML — 替换操作区 DOM 结构

**Files:**
- Modify: `index.html:143`

- [ ] **Step 1: 替换 `#qVis` 为新的操作区结构**

将第 143 行的:
```html
<div class="q-visual" id="qVis"></div>
```
替换为:
```html
<div class="q-manipulative" id="qManip">
  <div class="qm-hint" id="qmHint"></div>
  <div class="qm-source" id="qmSource"></div>
  <div class="qm-rows" id="qmRows"></div>
</div>
```

- [ ] **Step 2: 提交**

```bash
git add index.html
git commit -m "feat: 替换题目可视化区为操作区 DOM 结构"
```

---

### Task 2: CSS — 新操作区样式 + 清理旧样式

**Files:**
- Modify: `style.css:178-181, 314-329`

- [ ] **Step 1: 删除旧的 q-visual 子元素样式**

删除 L178-181:
```css
.q-visual{display:flex;align-items:center;justify-content:center;gap:5px;flex-wrap:wrap;margin:10px 0;min-height:50px}
.q-visual .vi{font-size:38px;animation:popIn .4s ease both}
@keyframes popIn{from{transform:scale(0);opacity:0}to{transform:scale(1);opacity:1}}
.q-visual .vop{font-size:26px;color:#FF5722;font-weight:bold;margin:0 3px}
```

删除 L314-329（答题动画相关）:
```css
/* ===== 答题动画 ===== */
#qVis.vis-merging .vi-gb{...}
@keyframes qMerge{...}
#qVis.vis-subtracting .vi-sub{...}
@keyframes qSubtract{...}
```

- [ ] **Step 2: 新增操作区样式**

在原 `/* ===== 答题动画 ===== */` 位置替换为:

```css
/* ===== 交互式操作区 ===== */
.q-manipulative{display:flex;flex-direction:column;align-items:center;gap:8px;margin:8px 0}
.qm-hint{font-size:14px;color:#888;text-align:center;min-height:20px}
.qm-source{display:flex;justify-content:center;gap:3px;padding:6px 8px;background:#FFF8E1;border-radius:12px;flex-wrap:wrap;min-height:40px}
.qm-source .si{font-size:32px;cursor:pointer;transition:transform .1s, opacity .15s;user-select:none;-webkit-user-select:none}
.qm-source .si:active{transform:scale(.85)}
.qm-source .si.used{opacity:.18;pointer-events:none}
.qm-rows{display:flex;flex-direction:column;gap:6px;width:100%}
.qm-row{display:flex;align-items:center;justify-content:center;gap:4px;min-height:48px;padding:6px 8px;border:2px dashed #BDBDBD;border-radius:12px;flex-wrap:wrap;transition:border-color .25s, background .25s}
.qm-row.active{border-color:#42A5F5;background:#E3F2FD;box-shadow:0 0 8px rgba(66,165,245,.25)}
.qm-row.subtract-mode{border-color:#EF5350;background:#FFEBEE}
.qm-row.complete{border-color:#66BB6A;background:#E8F5E9}
.qm-row .ri{font-size:32px;transition:transform .1s, opacity .2s;cursor:pointer;user-select:none;-webkit-user-select:none}
.qm-row .ri:active{transform:scale(.85)}
.qm-row .ri.removed{opacity:.2;transform:scale(.6)}
.qm-row-label{font-size:12px;font-weight:bold;color:#666;text-align:center}
```

- [ ] **Step 3: 提交**

```bash
git add style.css
git commit -m "style: 操作区样式 — 来源区+放置行+模式状态配色"
```

---

### Task 3: JS — 操作区状态管理 + 渲染函数

**Files:**
- Modify: `game.js` (在 L365 `var QS=...` 之后添加)

- [ ] **Step 1: 在 QS 定义后添加 MS 状态对象**

在 `var QS=...` (L366) 之后添加:

```javascript
var MS={op:'',emoji:'',nums:[],rows:[],sourceUsed:0,stage:'place',subtractTarget:0};
```

- [ ] **Step 2: 添加渲染函数 `initManip(q)`**

在 MS 定义之后、`function startQ` 之前添加:

```javascript
function initManip(q){
  MS.op=q.op;MS.emoji=q.emoji;MS.nums=q.nums;
  MS.rows=q.op==='+'?[[],[]]:[[]];
  MS.sourceUsed=0;MS.stage='place';
  MS.subtractTarget=q.op==='-'?q.nums[1]:0;
  renderManipSource();renderManipRows();updateManipHint();
}
function renderManipSource(){
  var src=document.getElementById('qmSource');src.innerHTML='';
  for(var i=0;i<10;i++){
    var sp=document.createElement('span');
    sp.className='si'+(i<MS.sourceUsed?' used':'');
    sp.textContent=MS.emoji;
    if(i>=MS.sourceUsed)sp.onclick=function(){manipPlace()};
    src.appendChild(sp);
  }
}
function renderManipRows(){
  var ct=document.getElementById('qmRows');ct.innerHTML='';
  for(var r=0;r<MS.rows.length;r++){
    var row=MS.rows[r];
    var isSub=MS.op==='-';
    var inSubtract=isSub&&MS.stage==='subtract';
    var rowEl=document.createElement('div');
    rowEl.className='qm-row';
    // 模式样式
    if(inSubtract)rowEl.className+=' subtract-mode';
    else if(!isSub&&MS.rows.length===2)rowEl.className+=(r===0&&MS.rows[0].length<MS.nums[0]||r===1&&MS.rows[0].length>=MS.nums[0]&&MS.rows[1].length<MS.nums[1]?' active':'');
    else if(isSub&&MS.stage==='place')rowEl.className+=' active';
    // 完成状态
    if(inSubtract&&MS.subtractTarget>0&&getSubtractRemaining()===0)rowEl.className=rowEl.className.replace('subtract-mode','complete');
    // 行标签
    if(MS.rows.length===2){
      var lb=document.createElement('div');lb.className='qm-row-label';
      lb.textContent='第'+(r+1)+'个数 → 放 '+MS.nums[r]+' 个';
      ct.appendChild(lb);
    }
    // 渲染 emoji
    for(var j=0;j<row.length;j++){
      var ri=document.createElement('span');
      ri.className='ri';
      if(inSubtract&&isSubtractRemoved(j))ri.className+=' removed';
      ri.textContent=MS.emoji;
      ri.onclick=(function(rr,jj){return function(){manipRemove(rr,jj)}})(r,j);
      rowEl.appendChild(ri);
    }
    ct.appendChild(rowEl);
  }
  // 减法行标签
  if(MS.op==='-'){
    var lb=document.createElement('div');lb.className='qm-row-label';
    if(MS.stage==='place')lb.textContent='放 '+MS.nums[0]+' 个';
    else lb.textContent='点掉 '+MS.subtractTarget+' 个（还剩 '+getSubtractRemaining()+' 个）';
    ct.insertBefore(lb,ct.firstChild);
  }
}
function updateManipHint(){
  var h=document.getElementById('qmHint');
  if(MS.op==='+'){
    h.textContent='从上方取 '+MS.emoji+'，先放第1行（'+MS.nums[0]+'个），再放第2行（'+MS.nums[1]+'个）';
  }else if(MS.stage==='place'){
    h.textContent='从上方取 '+MS.emoji+'，放 '+MS.nums[0]+' 个';
  }else{
    h.textContent='点掉 '+MS.subtractTarget+' 个 → 理解"减"就是拿走';
  }
}
var MS_REMOVED=[];
function isSubtractRemoved(idx){return MS_REMOVED.indexOf(idx)>=0}
function getSubtractRemaining(){return MS.subtractTarget-MS_REMOVED.length}
```

- [ ] **Step 3: 提交**

```bash
git add game.js
git commit -m "feat: 操作区核心 — MS状态+渲染函数"
```

---

### Task 4: JS — 交互处理函数

**Files:**
- Modify: `game.js` (在 Task 3 添加的代码之后)

- [ ] **Step 1: 添加放置和移除函数**

在 `updateManipHint` 之后、`function startQ` 之前添加:

```javascript
function manipPlace(){
  if(MS.sourceUsed>=10)return;
  if(MS.op==='-'&&MS.stage==='subtract')return;
  // 确定当前活跃行
  var targetRow=0;
  if(MS.op==='+'){
    targetRow=MS.rows[0].length<MS.nums[0]?0:1;
  }
  MS.rows[targetRow].push(MS.emoji);
  MS.sourceUsed++;
  renderManipSource();renderManipRows();updateManipHint();
  // 减法: 放够第一个数字后自动切换
  if(MS.op==='-'&&MS.stage==='place'&&MS.rows[0].length>=MS.nums[0]){
    MS.stage='subtract';MS_REMOVED=[];
    renderManipRows();updateManipHint();
  }
}
function manipRemove(rowIdx,itemIdx){
  if(MS.op==='-'&&MS.stage==='subtract'){
    // 减法模式: 切换移除状态
    var pos=MS_REMOVED.indexOf(itemIdx);
    if(pos>=0)MS_REMOVED.splice(pos,1);else MS_REMOVED.push(itemIdx);
    renderManipRows();updateManipHint();
    return;
  }
  // 正常模式: 放回来源区
  MS.rows[rowIdx].splice(itemIdx,1);
  MS.sourceUsed--;
  // 减法 place 阶段放多了: 回到 place
  if(MS.op==='-'&&MS.stage==='place'&&MS.rows[0].length<MS.nums[0]){
    // 保持 place 状态
  }
  renderManipSource();renderManipRows();updateManipHint();
}
```

- [ ] **Step 2: 提交**

```bash
git add game.js
git commit -m "feat: 操作区交互 — 点击放置和移除处理"
```

---

### Task 5: JS — 集成到现有流程

**Files:**
- Modify: `game.js:373-393` (nextQ), `game.js:432-454` (animateQ)

- [ ] **Step 1: 修改 `nextQ()` 替换可视化渲染**

将 L373-393 的 `nextQ()` 函数中可视化部分改为调用新函数。

将 L383-392:
```javascript
  // 可视化
  var vis=document.getElementById('qVis');vis.innerHTML='';vis.classList.remove('vis-merging','vis-subtracting');
  if(S.level>=7){renderDecompTree(q);}else{
    for(var i=0;i<q.nums[0];i++){var sp=document.createElement('span');sp.className='vi vi-ga';sp.textContent=q.emoji;sp.style.animationDelay=i*.12+'s';vis.appendChild(sp)}
    var opEl=document.createElement('span');opEl.className='vop';opEl.textContent=q.op;vis.appendChild(opEl);
    if(q.op==='+'){
      for(var i=0;i<q.nums[1];i++){var sp=document.createElement('span');sp.className='vi vi-gb';sp.textContent=q.emoji;sp.style.animationDelay=(q.nums[0]+i)*.12+'s';vis.appendChild(sp)}
    }else{
      for(var i=0;i<q.nums[1];i++){var sp=document.createElement('span');sp.className='vi vi-sub';sp.textContent=q.emoji;sp.style.opacity='.4';sp.style.animationDelay=(q.nums[0]+i)*.12+'s';vis.appendChild(sp)}
    }
  }
```

替换为:
```javascript
  // 可视化
  var manip=document.getElementById('qManip');manip.innerHTML='';
  if(S.level>=7){manip.style.display='';renderDecompTree(q);}
  else{manip.style.display='';initManip(q);}
```

注意: Lv.7 的 `renderDecompTree()` 原本渲染到 `#qVis`，现在需要改为渲染到 `#qManip` 或一个独立容器。检查 `renderDecompTree` 函数: 它用 `document.getElementById('qVis')` 获取容器。需要改为 `document.getElementById('qManip')`。

- [ ] **Step 2: 修改 `renderDecompTree()` 容器引用**

将 L413 的:
```javascript
var vis=document.getElementById('qVis');
```
改为:
```javascript
var vis=document.getElementById('qManip');
```
同时在该函数开头清空 manip 内容:
```javascript
vis.innerHTML='';vis.style.display='';
```

- [ ] **Step 3: 简化 `animateQ()` 移除旧操作区的动画**

将 L432-454 的 `animateQ()` 改为只处理 decomp-tree:

```javascript
function animateQ(q){
  var vis=document.getElementById('qManip');
  var dt=vis.querySelector('.decomp-tree');
  if(dt){
    dt.querySelectorAll('[data-ans]').forEach(function(el){
      if(el.dataset.ans){el.textContent=el.dataset.ans;el.classList.add('dt-reveal');if(!el.classList.contains('dt-root'))el.classList.add('dt-answer')}
    });
  }
  // Lv.1-6 操作区无需自动动画，小朋友已经自己操作了
}
```

- [ ] **Step 4: 提交**

```bash
git add game.js
git commit -m "feat: 集成操作区到答题流程 — 替换旧自动渲染"
```

---

### Task 6: 手动验证

- [ ] **Step 1: 加法题验证**

在浏览器打开 `index.html`:
1. 创建角色，进入岛屿
2. 点击小橘(🐱)，开始加法题
3. 确认: 来源区显示 10 个 🐟，两行放置区为空
4. 点击来源区 🐟: 逐个跳到第1行
5. 放够 3 个后: 确认新点击开始填充第2行
6. 放好两行后: 选答案
7. 答对后: 确认下一题正确重新初始化

- [ ] **Step 2: 减法题验证**

1. 点击旺财(🐶)，开始减法题
2. 确认: 单行，提示"放 X 根🦴"
3. 放够 5 根: 确认自动切换到减法模式（边框变红）
4. 点击已放置的 🦴: 确认变半透明
5. 点掉 2 根: 确认提示变绿"完成"
6. 点击已被"减掉"的: 确认可恢复

- [ ] **Step 3: 边界状态**

1. 来源区放满 10 个: 确认不能再放
2. 点击放置行的 emoji: 确认可收回来源区
3. 放少了/放多了: 确认仍可点击选项答题
4. Lv.7 题目: 确认仍显示分解树枝图

- [ ] **Step 4: 提交（如有修复）**

```bash
git add -A && git commit -m "fix: 操作区交互细节修复"
```

---

### 文件变更总览

| 文件 | 操作 | 内容 |
|------|------|------|
| `index.html:143` | 修改 1 行 | `#qVis` → `#qManip` + 子元素 |
| `style.css:178-181,314-329` | 删除 20 行 + 新增 25 行 | 旧 vi 样式 → 新操作区样式 |
| `game.js:366+` | 新增 ~100 行 | MS 状态 + 6 个函数 |
| `game.js:383-392` | 替换 10 行 | `nextQ()` 可视化分支 |
| `game.js:413` | 修改 1 行 | `renderDecompTree()` 容器引用 |
| `game.js:432-454` | 简化 20 行 | `animateQ()` 只保留 dt 分支 |
