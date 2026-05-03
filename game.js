/* ===== 通用工具 ===== */
function ri(a,b){return Math.floor(Math.random()*(b-a+1))+a}
function shuffle(a){for(var i=a.length-1;i>0;i--){var j=ri(0,i);var t=a[i];a[i]=a[j];a[j]=t}return a}
function dk(h){var r=parseInt(h.slice(1,3),16),g=parseInt(h.slice(3,5),16),b=parseInt(h.slice(5,7),16);r=Math.max(0,r-35);g=Math.max(0,g-35);b=Math.max(0,b-35);return '#'+r.toString(16).padStart(2,'0')+g.toString(16).padStart(2,'0')+b.toString(16).padStart(2,'0')}

/* ===== 音效 ===== */
var AC=window.AudioContext||window.webkitAudioContext,ax;
var soundMuted=false;
var soundBtn=document.getElementById('soundToggle');

function gA(){if(!ax)ax=new AC();return ax}

function pS(t){
  if(soundMuted)return;
  try{
    var c=gA();
    if(t==='ok'){[523,659,784].forEach(function(f,i){var o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.type='sine';o.frequency.setValueAtTime(f,c.currentTime+i*.1);g.gain.setValueAtTime(.22,c.currentTime+i*.1);g.gain.exponentialRampToValueAtTime(.01,c.currentTime+i*.1+.15);o.start(c.currentTime+i*.1);o.stop(c.currentTime+i*.1+.15)})}
    else if(t==='no'){var o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.type='sawtooth';o.frequency.setValueAtTime(200,c.currentTime);o.frequency.setValueAtTime(150,c.currentTime+.15);g.gain.setValueAtTime(.12,c.currentTime);g.gain.exponentialRampToValueAtTime(.01,c.currentTime+.3);o.start(c.currentTime);o.stop(c.currentTime+.3)}
    else if(t==='lu'){[523,587,659,698,784,880,988,1047].forEach(function(f,i){var o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.type='sine';o.frequency.setValueAtTime(f,c.currentTime+i*.08);g.gain.setValueAtTime(.18,c.currentTime+i*.08);g.gain.exponentialRampToValueAtTime(.01,c.currentTime+i*.08+.12);o.start(c.currentTime+i*.08);o.stop(c.currentTime+i*.08+.12)})}
    else if(t==='click'){var o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.type='sine';o.frequency.setValueAtTime(800,c.currentTime);g.gain.setValueAtTime(.06,c.currentTime);g.gain.exponentialRampToValueAtTime(.01,c.currentTime+.05);o.start(c.currentTime);o.stop(c.currentTime+.05)}
    else if(t==='pop'){var o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.type='sine';o.frequency.setValueAtTime(600+Math.random()*400,c.currentTime);g.gain.setValueAtTime(.1,c.currentTime);g.gain.exponentialRampToValueAtTime(.01,c.currentTime+.12);o.start(c.currentTime);o.stop(c.currentTime+.12)}
  }catch(e){}
}

var bgMusicNode=null;
var sceneMusicNodes=[];
function playBgMusic(){
  if(soundMuted||bgMusicNode)return;
  try{
    var c=gA();
    var notes=[262,294,330,349,392,349,330,294,262,330,392,523,392,330,294,262];
    var noteLen=0.5;
    function playNote(i){
      if(soundMuted||i>=notes.length){bgMusicNode=null;return}
      var o=c.createOscillator(),g=c.createGain();
      o.connect(g);g.connect(c.destination);
      o.type='sine';o.frequency.setValueAtTime(notes[i],c.currentTime);
      g.gain.setValueAtTime(.06,c.currentTime);g.gain.exponentialRampToValueAtTime(.01,c.currentTime+noteLen*.9);
      o.start(c.currentTime);o.stop(c.currentTime+noteLen);
      bgMusicNode=setTimeout(function(){playNote(i+1)},noteLen*1000);
    }
    playNote(0);
  }catch(e){}
}

function stopBgMusic(){
  if(bgMusicNode){clearTimeout(bgMusicNode);bgMusicNode=null}
}

function playSceneSound(scene){
  if(soundMuted)return;
  stopSceneSounds();
  try{
    var c=gA();
    if(scene==='emergency'){
      var notes=[440,440,440,466];
      var durations=[0.15,0.15,0.15,0.3];
      notes.forEach(function(f,i){
        var o=c.createOscillator(),g=c.createGain();
        o.connect(g);g.connect(c.destination);
        o.type='square';o.frequency.setValueAtTime(f,c.currentTime);
        g.gain.setValueAtTime(.08,c.currentTime);g.gain.exponentialRampToValueAtTime(.01,c.currentTime+durations[i]);
        o.start(c.currentTime);o.stop(c.currentTime+durations[i]);
      });
    }else if(scene==='area'){
      var notes=[523,659,784];
      notes.forEach(function(f,i){
        var o=c.createOscillator(),g=c.createGain();
        o.connect(g);g.connect(c.destination);
        o.type='sine';o.frequency.setValueAtTime(f,c.currentTime+i*0.1);
        g.gain.setValueAtTime(.08,c.currentTime+i*0.1);g.gain.exponentialRampToValueAtTime(.01,c.currentTime+i*0.1+0.15);
        o.start(c.currentTime+i*0.1);o.stop(c.currentTime+i*0.1+0.15);
      });
    }
  }catch(e){}
}

function stopSceneSounds(){sceneMusicNodes.forEach(function(n){clearTimeout(n)});sceneMusicNodes=[]}

function toggleSound(){
  pS('click');
  soundMuted=!soundMuted;
  soundBtn.textContent=soundMuted?'🔇':'🔊';
  soundBtn.classList.toggle('muted',soundMuted);
  if(soundMuted){stopBgMusic();stopSceneSounds()}
  else{setTimeout(playBgMusic,500)}
}

/* ===== 语音朗读 ===== */
function speak(text){
  if(!text||soundMuted)return;
  window.speechSynthesis && window.speechSynthesis.cancel();
  var u=new SpeechSynthesisUtterance(text);
  u.lang='zh-CN';u.rate=0.7;u.pitch=1.05;
  try{var voices=window.speechSynthesis.getVoices();var cv=voices.find(function(v){return v.lang.indexOf('zh')>=0});if(cv)u.voice=cv}catch(e){}
  window.speechSynthesis.speak(u);
}

/* ===== 烟花 ===== */
function fw(n){
  n=n||3;
  var cs=['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#ff6f00','#ab47bc'];
  for(var f=0;f<n;f++){
    (function(ff){
      setTimeout(function(){
        var cx=Math.random()*innerWidth,cy=Math.random()*innerHeight*.5;
        for(var i=0;i<14;i++){
          var p=document.createElement('div');
          p.className='fp';
          p.style.cssText='left:'+cx+'px;top:'+cy+'px;width:7px;height:7px;background:'+cs[ri(0,cs.length-1)];
          var a=Math.PI*2/14*i,d=50+Math.random()*50;
          p.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:'translate('+Math.cos(a)*d+'px,'+Math.sin(a)*d+'px) scale(0)',opacity:0}],{duration:800,easing:'ease-out',fill:'forwards'});
          document.getElementById('fw').appendChild(p);
          setTimeout(function(){p.remove()},900)
        }
      },ff)
    })(f*280)
  }
}

/* ===== 角色外观 ===== */
function getAccessory(level){
  var acc=ACCESSORIES[0];
  for(var i=0;i<ACCESSORIES.length;i++){
    if(level>=ACCESSORIES[i].level)acc=ACCESSORIES[i];
  }
  return acc;
}

function renderPlayerAccessories(){
  var pc=document.getElementById('playerChar');
  if(!pc)return;
  pc.querySelectorAll('.player-accessory').forEach(function(e){e.remove()});
  var acc=getAccessory(S.level);
  if(acc.hat){
    var hat=document.createElement('span');
    hat.className='player-accessory player-hat';
    hat.textContent=acc.hat;
    pc.appendChild(hat);
  }
  if(acc.cape){
    var cape=document.createElement('span');
    cape.className='player-accessory player-cape';
    cape.textContent=acc.cape;
    pc.appendChild(cape);
  }
  if(acc.shoes){
    var shoes=document.createElement('span');
    shoes.className='player-accessory player-shoes';
    shoes.textContent=acc.shoes;
    pc.appendChild(shoes);
  }
}

/* ===== 存档 ===== */
function defState(){
  return{
    name:'小宝',avatar:'boy',xp:0,level:1,totalXp:0,coins:0,combo:0,mc:0,
    pets:[],companion:null,
    adventures:{},stories:{},decos:[],placedDecos:[],areas:['home']
  }
}

var S=defState();

function loadS(){
  try{
    var d=localStorage.getItem('mi2');
    var saved=d?JSON.parse(d):null;
    if(saved&&saved.name)return saved;
    return null;
  }catch(e){return null}
}

function saveS(){
  try{localStorage.setItem('mi2',JSON.stringify(S))}catch(e){}
}

/* ===== 题目生成 ===== */
function genQ(mode,level,aid){
  var an=AN[aid]||AN.cat;
  var tk=mode||an.teach;
  var tp=TPL[tk];
  if(!tp)tp=TPL.add;
  var sc;
  var ms=Math.min(tp.maxSum||10,10);
  var nums=[],ans=0,op='+';

  if(tp.mode==='add'||tp.mode==='ac'){
    var a=ri(1,Math.min(9,ms-1));
    var b=ri(1,ms-a);
    nums=[a,b];ans=a+b;op='+';
  }else if(tp.mode==='sub'||tp.mode==='sc'){
    var a=ri(1,ms);
    var b=ri(0,a);
    nums=[a,b];ans=a-b;op='-';
  }else if(tp.mode==='mix'){
    if(Math.random()<0.5){
      var a=ri(1,Math.min(9,ms-1));
      var b=ri(1,ms-a);
      nums=[a,b];ans=a+b;op='+';
    }else{
      var a=ri(1,ms);
      var b=ri(0,a);
      nums=[a,b];ans=a-b;op='-';
    }
  }else{
    var a=ri(1,Math.min(9,ms-1));
    var b=ri(1,ms-a);
    nums=[a,b];ans=a+b;op='+';
  }

  // 选场景：优先用动物专属，再回退到 TPL
  var opKey=op==='+'?'add':'sub';
  var scenes=an.scenes&&an.scenes[opKey]&&an.scenes[opKey].length
    ? an.scenes[opKey].map(function(s){return {s:s}})
    : tp.scenes;
  // mix 模式按 op 过滤 TPL
  if(scenes[0]&&scenes[0].op!==undefined)scenes=scenes.filter(function(s){return s.op===op});
  sc=scenes.length?scenes[ri(0,scenes.length-1)]:tp.scenes[0];

  var opts=new Set([ans]);
  for(var t=0;opts.size<4&&t<50;t++){var d=ans+ri(-5,5);if(d>=0&&d<=ms)opts.add(d)}
  opts=shuffle([...opts]);

  var emoji=(an.items&&an.items.length)?an.items[ri(0,an.items.length-1)]:'🍎';
  var story=sc.s.replace(/{n}/g,an.name).replace(/{a}/g,nums[0]).replace(/{b}/g,nums[1]);
  if(sc.s.indexOf('{e}')>=0)story=story.replace(/{e}/g,emoji);

  return{mode:tp.mode,an:an,sc:sc,story:story,emoji:emoji,nums:nums,answer:ans,options:opts,op:op};
}

/* ===== 屏幕切换 ===== */
function show(id){
  pS('click');
  document.querySelectorAll('.screen').forEach(function(s){s.classList.remove('active')});
  document.getElementById(id).classList.add('active');
  if(id==='island-screen'){updIsland()}
}

/* ===== 角色创建 ===== */
var pickA='boy';

function pickAvatar(el){
  pS('pop');
  document.querySelectorAll('.avatar-opt').forEach(function(a){a.classList.remove('selected')});
  el.classList.add('selected');
  pickA=el.dataset.a
}

function startGame(){
  var n=document.getElementById('nameInput').value.trim();
  if(!n)n='小宝';
  S.name=n;S.avatar=pickA;S.areas=['home'];saveS();
  pS('click');show('island-screen');fw(2);
}

/* ===== 岛屿更新 ===== */
var aEmojis={boy:'👦',girl:'👧',bear:'🐻',cat:'🐱'};

function updIsland(){
  document.getElementById('hudName').textContent=S.name;
  document.getElementById('hudLevel').textContent='Lv.'+S.level;
  var cl=LV[S.level-1]||LV[0],nl=LV[S.level]||LV[LV.length-1];
  var needed=nl.xp-cl.xp;
  document.getElementById('hudXp').style.width=Math.min(100,S.xp/needed*100)+'%';
  document.getElementById('hudCoins').textContent='💰'+S.coins;
  document.getElementById('playerChar').textContent=aEmojis[S.avatar]||'👦';
  renderPlayerAccessories();
  if(S.companion){var p=PT.find(function(x){return x.id===S.companion});document.getElementById('hudPet').textContent=p?p.emoji:''}else{document.getElementById('hudPet').textContent=''}
  // 区域锁定
  ['orchard','beach','park','castle'].forEach(function(a){
    var el=document.getElementById('area-'+a);if(!el)return;
    if(S.areas.indexOf(a)>=0)el.classList.remove('locked');else el.classList.add('locked');
  });
  // 动物徽章 — 始终显示需要帮助
  Object.keys(AN).forEach(function(k){
    var b=document.getElementById('badge-'+k);if(!b)return;
    b.textContent='❗';
  });
  // 故事按钮
  var storyBtn=document.getElementById('hudStoryBtn');
  var avail=getAvailableStories();
  if(storyBtn){
    if(avail.length>0){storyBtn.style.display='';storyBtn.textContent='📖 ('+avail.length+')'}
    else{storyBtn.style.display='none'}
  }
}

/* ===== 对话 ===== */
var curAnimal=null;
var dlgData={};

function talk(aid){
  pS('pop');var an=AN[aid];if(!an)return;curAnimal=aid;
  document.getElementById('dAvatar').textContent=an.emoji;
  document.getElementById('dName').textContent=an.name+' ('+an.personality+')';
  var greeting=an.greetings?an.greetings[Math.floor(Math.random()*an.greetings.length)]:'';
  var story=an.stories?an.stories[Math.floor(Math.random()*an.stories.length)]:'';
  document.getElementById('dText').textContent=greeting+(story?'\n'+story:'');
  document.getElementById('dEmoji').textContent=an.emoji+' ❓';
  document.getElementById('dAction').style.display='';
  dlgData={aid:aid,teach:an.teach};
  document.getElementById('dialogOv').classList.add('show');
}

function closeDlg(){pS('click');document.getElementById('dialogOv').classList.remove('show');curAnimal=null}
function doTask(){pS('click');closeDlg();if(dlgData.aid)startQ('',dlgData.aid,dlgData.teach,1)}

/* ===== 题目系统 ===== */
var QS={mode:'',aid:'',teach:'',total:1,cur:0,correct:0,answered:false,curQ:null,advId:'',advNode:0};

function startQ(mode,aid,teach,total){
  QS.mode=mode;QS.aid=aid||'cat';QS.teach=teach||'add';QS.cur=0;QS.correct=0;QS.answered=false;QS.total=total||1;QS.advId='';QS.advNode=0;
  show('q-screen');nextQ();
}

function nextQ(){
  if(QS.cur>=QS.total){finishQ();return}
  QS.answered=false;
  var q=genQ(QS.teach,S.level,QS.aid);QS.curQ=q;

  document.getElementById('qAnimal').textContent=q.an.emoji;
  document.getElementById('qTitle').textContent='帮'+q.an.name+'解题';
  document.getElementById('qStory').textContent=q.story;

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

  // 算式
  var eq=document.getElementById('qEq');
  eq.innerHTML='<div class="q-num">'+q.nums[0]+'</div><div class="q-op">'+q.op+'</div><div class="q-num">'+q.nums[1]+'</div><div class="q-op">=</div><div class="q-ab" id="ab">?</div>';

  // 选项
  var oc=document.getElementById('qOpts');oc.innerHTML='';
  var colors=['#FF6B6B','#FFA726','#FFD54F','#66BB6A','#42A5F5','#AB47BC'];
  q.options.forEach(function(o,i){
    var b=document.createElement('button');b.className='q-opt';b.textContent=o;
    b.style.background='linear-gradient(135deg,'+colors[i%colors.length]+','+dk(colors[i%colors.length])+')';
    b.onclick=(function(n,btn){return function(){chk(n,btn)}})(o,b);
    oc.appendChild(b);
  });

  document.getElementById('qFb').textContent='';document.getElementById('qFb').className='q-fb';
  updProg();
  speak(q.story);
}

function renderDecompTree(q){
  var vis=document.getElementById('qVis');
  var topV,lV,rV,isAns=false;
  if(q.op==='+'){topV='?';lV=q.nums[0];rV=q.nums[1]}
  else{topV=q.nums[0];lV='?';rV=q.nums[1];isAns=true}
  var el=document.createElement('div');el.className='decomp-tree';
  el.innerHTML='<div class="dt-node dt-root" data-ans="'+(q.op==='+'?q.answer:'')+'">'+topV+'</div>'+
    '<svg class="dt-lines" width="130" height="25" viewBox="0 0 130 25">'+
    '<line x1="65" y1="0" x2="65" y2="8" stroke="#bbb" stroke-width="2.5" stroke-linecap="round"/>'+
    '<line x1="65" y1="8" x2="28" y2="22" stroke="#bbb" stroke-width="2.5" stroke-linecap="round"/>'+
    '<line x1="65" y1="8" x2="102" y2="22" stroke="#bbb" stroke-width="2.5" stroke-linecap="round"/>'+
    '</svg>'+
    '<div class="dt-children">'+
    '<div class="dt-node dt-child" data-ans="'+(isAns?q.answer:'')+'">'+lV+'</div>'+
    '<div class="dt-node dt-child">'+rV+'</div>'+
    '</div>';
  vis.appendChild(el);
}

function animateQ(q){
  var vis=document.getElementById('qVis');
  var dt=vis.querySelector('.decomp-tree');
  if(dt){
    dt.querySelectorAll('[data-ans]').forEach(function(el){
      if(el.dataset.ans){el.textContent=el.dataset.ans;el.classList.add('dt-reveal');if(!el.classList.contains('dt-root'))el.classList.add('dt-answer')}
    });
    return;
  }
  if(q.op==='+'){
    var ga=vis.querySelectorAll('.vi-ga'),gb=vis.querySelectorAll('.vi-gb');
    if(!ga.length||!gb.length)return;
    var tr=ga[ga.length-1].getBoundingClientRect();
    gb.forEach(function(el){
      var r=el.getBoundingClientRect();
      el.style.setProperty('--tx',(tr.left-r.left+(tr.width-r.width)/2)+'px');
      el.style.setProperty('--ty',(tr.top-r.top+(tr.height-r.height)/2)+'px');
    });
    vis.classList.add('vis-merging');
  }else if(q.op==='-'){
    vis.classList.add('vis-subtracting');
  }
}

function updProg(){
  var c=document.getElementById('qProg');c.innerHTML='';
  for(var i=0;i<QS.total;i++){var d=document.createElement('div');d.className='q-dot';if(i<QS.cur)d.classList.add('done');if(i===QS.cur)d.classList.add('current');c.appendChild(d)}
}

function chk(num,btn){
  if(QS.answered)return;
  window.speechSynthesis && window.speechSynthesis.cancel();
  var q=QS.curQ,box=document.getElementById('ab');

  if(num===q.answer){
    QS.answered=true;
    document.querySelectorAll('.q-opt').forEach(function(b){b.disabled=true});
    pS('ok');box.textContent=num;box.classList.add('ok');btn.classList.add('ok-opt');QS.correct++;
    var ps=['太棒了！🎉','你真聪明！🌟','答对了！💪','好厉害！👏','完美！✨','真棒！🏆'];
    document.getElementById('qFb').textContent=ps[ri(0,ps.length-1)];document.getElementById('qFb').className='q-fb ok-fb';
                    animateQ(q);
    var xg=20+S.mc*3;S.xp+=xg;S.totalXp+=xg;S.coins+=5;S.combo++;if(S.combo>S.mc)S.mc=S.combo;
    chkLU();QS.cur++;saveS();setTimeout(nextQ,2000);
  }else{
    pS('no');box.textContent=num;box.classList.add('no');btn.classList.add('no-opt');btn.disabled=true;S.combo=0;
    document.getElementById('qFb').textContent='再想想哦，你可以的！💪';document.getElementById('qFb').className='q-fb no-fb';
  }
}

function resetGame(){
  if(confirm('确定要重置所有进度吗？')){
    localStorage.removeItem('mi2');
    location.reload();
  }
}

function finishQ(){
  if(QS.mode==='story'){
    storyNextChapter();
    show('island-screen');
    document.getElementById('storyOv').classList.add('show');
  }else if(QS.mode==='adv'){
    finishAdv();
  }else{
    show('island-screen');
  }
}

function exitQ(){pS('click');if(QS.mode==='adv')exitAdv();else show('island-screen')}

/* ===== 升级 ===== */
function chkLU(){
  var nl=LV[S.level];if(!nl||S.level>=7)return;
  var cl=LV[S.level-1],needed=nl.xp-cl.xp;
  if(S.xp>=needed){
    S.level++;S.xp=0;S.areas=nl.areas.slice();saveS();
    setTimeout(function(){showLU(nl)},400);
  }
}

function showLU(lv){
  pS('lu');fw(4);
  document.getElementById('luLv').textContent='Lv.'+lv.l+' '+lv.t;
  var msgs=[];
  var prevLv=LV[lv.l-2];
  var prevAreas=prevLv?prevLv.areas:[];
  var newAreas=lv.areas.filter(function(a){return prevAreas.indexOf(a)<0});
  if(newAreas.length){var an={home:'🏠 家',orchard:'🌳 果园',beach:'🏖️ 海滩',park:'🎪 游乐场',castle:'🏰 城堡'};msgs.push('解锁：'+newAreas.map(function(a){return an[a]||a}).join('、'))}
  if(lv.l===2&&S.pets.indexOf('chick')<0){S.pets.push('chick');if(!S.companion)S.companion='chick';msgs.push('🐥 获得宠物：小黄！')}
  if(lv.l===4&&S.pets.indexOf('parrot')<0){S.pets.push('parrot');msgs.push('🦜 获得宠物：小鹦！')}
  saveS();
  document.getElementById('luDetail').textContent=msgs.join('\n')||'继续加油！';
  document.getElementById('luOv').classList.add('show');
}

function closeLu(){pS('click');document.getElementById('luOv').classList.remove('show');updIsland()}

/* ===== 故事任务 ===== */
var storySt={id:'',chapter:0,active:false,answers:[]};

function showAvailableStory(){
  var avail=getAvailableStories();
  if(avail.length>0){showStory(avail[0].id)}
}

function showStory(stId){
  var st=STORIES.find(function(x){return x.id===stId});if(!st)return;
  if(S.level<st.ul)return;
  var key='story_'+stId;
  var saved=S.stories&&S.stories[key];
  if(saved&&saved.done)return;
  var startCh=saved&&saved.chapter!==undefined?saved.chapter:0;
  storySt={id:stId,chapter:startCh,active:true,answers:saved?saved.answers||[]:[]};
  renderStoryChapter(st);
  document.getElementById('storyOv').classList.add('show');
}

function renderStoryChapter(st){
  if(!st)st=STORIES.find(function(x){return x.id===storySt.id});
  if(!st||storySt.chapter>=st.chapters.length){finishStory(st);return;}
  var ch=st.chapters[storySt.chapter];
  document.getElementById('stIcon').textContent=st.ic;
  document.getElementById('stChapter').textContent=ch.t;
  document.getElementById('stTitle').textContent=st.n;
  document.getElementById('stText').textContent=ch.text;
  document.getElementById('stComplete').style.display='none';
  document.getElementById('stAction').style.display='';
  document.getElementById('stAction').textContent='开始挑战 💪';
  document.getElementById('stAction').onclick=doStoryTask;
  var prog=document.getElementById('stProg');prog.innerHTML='';
  for(var i=0;i<st.chapters.length;i++){
    var d=document.createElement('div');d.className='story-dot';
    if(i<storySt.chapter)d.classList.add('done');
    if(i===storySt.chapter)d.classList.add('current');
    prog.appendChild(d);
  }
}

function doStoryTask(){
  pS('click');var st=STORIES.find(function(x){return x.id===storySt.id});
  if(!st)return;
  var ch=st.chapters[storySt.chapter];
  var mode=ch.mode||st.tm;
  document.getElementById('storyOv').classList.remove('show');
  startQ('story',st.aid,mode,1);
  QS.storyId=st.id;
  QS.storyChapter=storySt.chapter;
}

function storyNextChapter(){
  storySt.chapter++;
  var st=STORIES.find(function(x){return x.id===storySt.id});
  if(!st||storySt.chapter>=st.chapters.length){finishStory(st)}
  else{
    var key='story_'+st.id;
    if(!S.stories)S.stories={};
    S.stories[key]={chapter:storySt.chapter,answers:storySt.answers.slice()};
    saveS();
    renderStoryChapter(st);
  }
}

function finishStory(st){
  if(!st)return;
  var key='story_'+st.id;
  if(!S.stories)S.stories={};
  S.stories[key]={done:true,answers:storySt.answers.slice()};
  S.coins+=15;S.xp+=20;S.totalXp+=20;saveS();
  document.getElementById('stAction').style.display='none';
  document.querySelector('.story-skip').style.display='none';
  var comp=document.getElementById('stComplete');comp.style.display='';
  comp.innerHTML='<div class="story-complete"><div class="sc-icon">🎉</div><div class="sc-title">故事完成！</div><div class="sc-reward">获得 💰15 金币 + ⭐20 经验</div></div>';
  fw(2);
  setTimeout(function(){closeStory();updIsland()},2500);
}

function closeStory(){
  pS('click');
  document.getElementById('storyOv').classList.remove('show');
  document.getElementById('stComplete').style.display='none';
  document.querySelector('.story-skip').style.display='';
  storySt.active=false;
}

function getAvailableStories(){
  return STORIES.filter(function(s){
    if(S.level<s.ul)return false;
    var key='story_'+s.id;
    if(S.stories&&S.stories[key]&&S.stories[key].done)return false;
    return true;
  });
}

/* ===== 冒险系统 ===== */
var advSt={id:'',node:0};

function showAdvList(){pS('click');show('adv-list-screen');renderAdvList()}

function renderAdvList(){
  var l=document.getElementById('alList');l.innerHTML='';
  ADS.forEach(function(a){
    var locked=S.level<a.ul;
    var pr=S.adventures[a.id]||{stars:0,done:false};
    var stars='';for(var i=0;i<3;i++)stars+=i<pr.stars?'⭐':'☆';
    var c=document.createElement('div');c.className='al-card'+(locked?' locked':'');
    c.innerHTML='<div class="al-icon">'+a.ic+'</div><div><div class="al-name">'+a.n+'</div><div class="al-desc">'+a.d+'</div><div class="al-stars">'+stars+'</div></div>'+(locked?'<span style="font-size:18px">🔒</span>':'<span style="font-size:18px">▶️</span>');
    if(!locked)c.onclick=(function(id){return function(){startAdv(id)}})(a.id);
    l.appendChild(c);
  });
}

function startAdv(id){
  pS('click');var a=ADS.find(function(x){return x.id===id});if(!a)return;
  advSt={id:id,node:0};
  show('adventure-screen');document.getElementById('avTitle').textContent=a.n;
  renderAdvMap(a);
}

function renderAdvMap(a){
  var m=document.getElementById('avMap');m.innerHTML='';
  var title=document.createElement('div');title.className='av-title';title.textContent=a.n;m.appendChild(title);
  var path=document.createElement('div');path.className='av-path';
  for(var i=1;i<=a.nodes;i++){
    if(i>1){var ln=document.createElement('div');ln.className='av-line';path.appendChild(ln)}
    var nd=document.createElement('div');
    var isBoss=i===a.boss;
    if(i<advSt.node+1){nd.className='av-node done-node';nd.textContent='✅'}
    else if(i===advSt.node+1){nd.className='av-node '+(isBoss?'boss-node now-node':'q-node now-node');nd.textContent=isBoss?'👑':'❓';nd.onclick=(function(n){return function(){playNode(n,a)}})(i)}
    else{nd.className='av-node lock-node';nd.textContent=isBoss?'👑':'❓'}
    path.appendChild(nd);
  }
  m.appendChild(path);
}

function playNode(n,a){
  pS('pop');advSt.node=n-1;
  if(n===a.boss){startQ('adv',a.aid,a.tm,5)}
  else{startQ('adv',a.aid,a.tm,1)}
}

function finishAdv(){
  var a=ADS.find(function(x){return x.id===advSt.id});if(!a){show('island-screen');return}
  var isBoss=advSt.node>=(a.nodes-1);
  if(isBoss&&QS.correct>=3){
    var pr=S.adventures[a.id]||{stars:0,done:false};
    pr.done=true;
    var stars=QS.correct>=5?3:(QS.correct>=4?2:1);
    if(stars>pr.stars)pr.stars=stars;
    S.adventures[a.id]=pr;
    var pm={fishing:'chick',carrots:'bunny',maze:'foxp',bamboo:'pandap'};
    if(pm[a.id]&&S.pets.indexOf(pm[a.id])<0)S.pets.push(pm[a.id]);
    S.coins+=20;saveS();
    var allDone=ADS.every(function(x){var p=S.adventures[x.id];return p&&p.done});
    if(allDone&&S.pets.indexOf('dragp')<0){S.pets.push('dragp');saveS()}
    fw(3);
  }
  if(isBoss&&QS.correct<3){
    advSt.node=Math.max(0,advSt.node-1);
    renderAdvMap(a);
    return;
  }
  if(advSt.node<a.nodes-1){renderAdvMap(a)}
  else{show('adv-list-screen')}
}

function exitAdv(){pS('click');show('adv-list-screen')}

/* ===== 装饰系统 ===== */
var decoTab='shop';

function showDecoPanel(){
  pS('click');
  document.getElementById('decoCoins').textContent='💰'+S.coins;
  renderDecoGrid();
  document.getElementById('decoPanel').classList.add('show');
}

function closeDecoPanel(){
  pS('click');
  document.getElementById('decoPanel').classList.remove('show');
}

function switchDecoTab(tab){
  decoTab=tab;
  var tabs=['shop','owned','placed'];
  document.querySelectorAll('.deco-tab').forEach(function(t,i){t.classList.toggle('active',tabs[i]===tab)});
  renderDecoGrid();
}

function renderDecoGrid(){
  var grid=document.getElementById('decoGrid');grid.innerHTML='';
  var owned=S.decos||[];
  var placed=S.placedDecos||[];
  if(decoTab==='shop'){
    DECOS.forEach(function(d){
      var isOwned=owned.indexOf(d.id)>=0;
      var canBuy=S.coins>=d.price;
      var item=document.createElement('div');
      item.className='deco-item'+(isOwned?' owned':'');
      item.innerHTML='<div class="di-icon">'+d.ic+'</div><div class="di-name">'+d.name+'</div><div class="di-price">'+(isOwned?'✅ 已拥有':'💰'+d.price)+'</div>';
      if(!isOwned&&canBuy){item.onclick=function(){buyDeco(d.id)}}
      else if(!isOwned&&!canBuy){item.classList.add('locked')}
      grid.appendChild(item);
    });
  }else if(decoTab==='owned'){
    if(owned.length===0){grid.innerHTML='<div style="grid-column:1/-1;text-align:center;color:#888;padding:20px">还没有装饰，去商店看看吧 🛒</div>';return}
    owned.forEach(function(id){
      var d=DECOS.find(function(x){return x.id===id});if(!d)return;
      var isPlaced=placed.some(function(x){return x.id===id});
      var item=document.createElement('div');
      item.className='deco-item'+(isPlaced?' placed':' owned');
      item.innerHTML='<div class="di-icon">'+d.ic+'</div><div class="di-name">'+d.name+'</div><div class="di-status">'+(isPlaced?'📍 已放置':'📦 未放置')+'</div>';
      item.onclick=function(){toggleDeco(id)};
      grid.appendChild(item);
    });
  }else if(decoTab==='placed'){
    if(placed.length===0){grid.innerHTML='<div style="grid-column:1/-1;text-align:center;color:#888;padding:20px">还没有放置装饰，去已拥有里点击放置 📍</div>';return}
    placed.forEach(function(item){
      var d=DECOS.find(function(x){return x.id===item.id});if(!d)return;
      var itemEl=document.createElement('div');
      itemEl.className='deco-item placed';
      itemEl.innerHTML='<div class="di-icon">'+d.ic+'</div><div class="di-name">'+d.name+'</div><div class="di-status">🗑️ 点击移除</div>';
      itemEl.onclick=function(){removeDeco(item.id)};
      grid.appendChild(itemEl);
    });
  }
  document.getElementById('decoInfo').textContent='点击装饰放置到岛上，点击已放置的装饰可移除';
}

function buyDeco(id){
  var d=DECOS.find(function(x){return x.id===id});if(!d)return;
  if(S.coins<d.price)return;
  if(!S.decos)S.decos=[];
  if(S.decos.indexOf(id)>=0)return;
  S.coins-=d.price;S.decos.push(id);saveS();
  pS('pop');
  document.getElementById('decoCoins').textContent='💰'+S.coins;
  renderDecoGrid();updIsland();
}

function toggleDeco(id){
  if(!S.placedDecos)S.placedDecos=[];
  var idx=S.placedDecos.findIndex(function(x){return x.id===id});
  if(idx>=0){S.placedDecos.splice(idx,1)}else{S.placedDecos.push({id:id,l:15+(S.placedDecos.length%4)*20,b:10+Math.floor(S.placedDecos.length/4)*15})}
  saveS();pS('click');renderDecoGrid();renderIslandDecos();
}

function removeDeco(id){
  if(!S.placedDecos)S.placedDecos=[];
  S.placedDecos=S.placedDecos.filter(function(x){return x.id!==id});
  saveS();pS('click');renderDecoGrid();renderIslandDecos();
}

function renderIslandDecos(){
  document.querySelectorAll('.deco-on-island').forEach(function(e){e.remove()});
  if(!S.placedDecos)return;
  // 兼容旧格式——纯字符串ID数组
  if(typeof S.placedDecos[0]==='string'){
    S.placedDecos=S.placedDecos.map(function(id,i){return{id:id,l:15+(i%4)*20,b:10+Math.floor(i/4)*15}});
    saveS();
  }
  var scene=document.getElementById('islandScene');
  S.placedDecos.forEach(function(item){
    var d=DECOS.find(function(x){return x.id===item.id});if(!d)return;
    var deco=document.createElement('div');
    deco.className='deco-on-island';deco.dataset.id=item.id;
    deco.style.left=item.l+'%';deco.style.bottom=item.b+'%';
    deco.innerHTML='<span class="deco-emoji">'+d.ic+'</span>';
    deco.onclick=function(){
      if(!S.placedDecos)return;
      S.placedDecos=S.placedDecos.filter(function(x){return x.id!==item.id});
      saveS();renderIslandDecos();renderDecoGrid();
    };
    scene.appendChild(deco);
  });
}

function initDecoSystem(){
  if(!S.decos)S.decos=[];
  if(!S.placedDecos)S.placedDecos=[];
  renderIslandDecos();
}

/* ===== 宠物 ===== */
function showPets(){pS('click');show('pet-screen');renderPets()}

function renderPets(){
  var g=document.getElementById('pGrid');g.innerHTML='';
  PT.forEach(function(p){
    var owned=S.pets.indexOf(p.id)>=0;
    var isCompanion=S.companion===p.id;
    var c=document.createElement('div');c.className='p-card'+(owned?(isCompanion?' companion':''):' empty');
    if(owned){
      c.innerHTML='<div class="p-icon">'+p.emoji+(isCompanion?'💕':'')+'</div><div class="p-name">'+p.name+'</div><div class="p-bonus">'+p.bonus+'</div>';
      c.onclick=(function(id){return function(){togComp(id)}})(p.id);
    }else{
      c.innerHTML='<div class="p-icon">❓</div><div class="p-name">???</div><div class="p-bonus">待解锁</div>';
    }
    g.appendChild(c);
  });
}

function togComp(id){
  pS('click');S.companion=S.companion===id?null:id;saveS();renderPets();updIsland();
}

/* ===== 玩家行走 ===== */
var playerTarget=null;

function initPlayerWalk(){
  var scene=document.getElementById('islandScene');
  scene.addEventListener('click',function(e){
    if(!document.getElementById('island-screen').classList.contains('active'))return;
    if(document.getElementById('dialogOv').classList.contains('show'))return;
    if(e.target.closest('.animal')||e.target.closest('.area')||e.target.closest('.player'))return;
    var rect=scene.getBoundingClientRect();
    var xPct=Math.max(5,Math.min(95,(e.clientX-rect.left)/rect.width*100));
    walkTo(xPct,e.clientX-rect.left,e.clientY-rect.top);
  });
}

function walkTo(xPct,tapX,tapY){
  var pc=document.getElementById('playerChar');
  var scene=document.getElementById('islandScene');
  pc.classList.remove('player-idle');
  pc.classList.add('player-walking');
  var curLeft=parseFloat(pc.style.left)||18;
  if(xPct<curLeft-1)pc.style.transform='scaleX(-1)';
  else if(xPct>curLeft+1)pc.style.transform='scaleX(1)';
  pc.style.left=xPct+'%';
  var steps=Math.max(3,Math.round(Math.abs(xPct-curLeft)*1.2));
  for(var i=1;i<=steps;i++)(function(step){
    var delay=i*180;
    var footPct=curLeft+(xPct-curLeft)*(step/(steps+1));
    setTimeout(function(){
      var fp=document.createElement('div');fp.className='footprint';
      fp.style.left=footPct+'%';fp.style.bottom='14%';
      scene.appendChild(fp);setTimeout(function(){fp.remove()},1100);
    },delay);
  })(i);
  if(tapX!==undefined){
    var ti=document.createElement('div');ti.className='tap-indicator';
    ti.style.left=(tapX-12)+'px';ti.style.top=(tapY-12)+'px';
    scene.appendChild(ti);setTimeout(function(){ti.remove()},700);
  }
  clearTimeout(playerTarget);
  playerTarget=setTimeout(function(){
    pc.classList.remove('player-walking');pc.classList.add('player-idle');
  },1600);
}

/* ===== 区域 ===== */
var currentArea=null;

function goArea(a){
  pS('pop');
  var pos={home:'12%',orchard:'30%',beach:'50%',park:'68%',castle:'84%'};
  walkTo(pos[a]||'20%');
  if(a!=='home')enterArea(a);
}

function enterArea(a){
  pS('pop');
  if(S.areas.indexOf(a)<0)return;
  currentArea=a;
  var screenId=a+'-screen';
  document.getElementById(screenId).classList.add('active');
  updateAreaBadges(a);
}

function exitArea(){
  pS('click');
  if(currentArea){document.getElementById(currentArea+'-screen').classList.remove('active')}
  currentArea=null;
}

function enterAreaTask(aid){
  pS('pop');
  talk(aid);
}

function updateAreaBadges(area){
  var animals={orchard:['rabbit','bear'],beach:['dolphin'],park:['fox'],castle:['panda']};
  var list=animals[area]||[];
  list.forEach(function(k){
    var b=document.getElementById('area-badge-'+k);
    if(b){b.textContent='❗'}
  });
}


/* ===== 初始化 ===== */
function init(){
  initPlayerWalk();
  var saved=loadS();
  if(saved&&saved.name){S=saved;show('island-screen');updIsland();initDecoSystem();renderPlayerAccessories()}
  else{show('create-screen')}
  // 背景音乐
  setTimeout(playBgMusic,1000);
}

init();
