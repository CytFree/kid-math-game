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
    lessons:{add:0,sub:0,addChain:0,subChain:0,mix:0,bigNum:0},
    adventures:{},daily:{date:'',done:[],streak:0,lastDate:''},
    stories:{},decos:[],placedDecos:[],areas:['home']
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
  var sc=tp.scenes[ri(0,tp.scenes.length-1)];
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

  var opts=new Set([ans]);
  for(var t=0;opts.size<4&&t<50;t++){var d=ans+ri(-5,5);if(d>=0&&d<=ms)opts.add(d)}
  opts=shuffle([...opts]);

  var story=sc.s.replace('{n}',an.name).replace('{a}',nums[0]).replace('{b}',nums[1]);

  return{mode:tp.mode,an:an,sc:sc,story:story,nums:nums,answer:ans,options:opts,op:op};
}

/* ===== 屏幕切换 ===== */
var activeNav=0;

function show(id){
  pS('click');
  document.querySelectorAll('.screen').forEach(function(s){s.classList.remove('active')});
  document.getElementById(id).classList.add('active');
  if(id==='island-screen'){updIsland();activeNav=0}
  updNav()
}

function navTo(n,id){
  pS('click');
  activeNav=n;
  updNav();
  if(!id)id='island-screen';
  show(id)
}

function updNav(){
  var btns=document.querySelectorAll('.nav-btn');
  btns.forEach(function(b,i){b.classList.toggle('active',i===activeNav)})
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
  // 每日任务状态
  var today=new Date().toISOString().slice(0,10);
  if(S.daily.date!==today){
    var yesterday=new Date(Date.now()-86400000).toISOString().slice(0,10);
    var streak=S.daily.streak||0;
    if(S.daily.lastDate===yesterday&&S.daily.done&&S.daily.done.length>0){streak++}
    else if(S.daily.lastDate!==today){streak=0}
    S.daily={date:today,done:[],streak:streak,lastDate:S.daily.date||''};
    saveS();
  }
  Object.keys(AN).forEach(function(k){
    var b=document.getElementById('badge-'+k);if(!b)return;
    b.textContent=S.daily.done.indexOf(k)>=0?'❤️':'❗';
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
  var done=S.daily.done&&S.daily.done.indexOf(aid)>=0;
  document.getElementById('dAvatar').textContent=an.emoji;
  document.getElementById('dName').textContent=an.name+' ('+an.personality+')';
  if(done){
    var doneMsgs=an.done||[an.name+'笑着说："谢谢你今天的帮助！你真棒！💕"'];
    document.getElementById('dText').textContent=doneMsgs[Math.floor(Math.random()*doneMsgs.length)];
    document.getElementById('dEmoji').textContent=an.emoji+' ❤️';
    document.getElementById('dAction').style.display='none';
    dlgData={done:true};
  }else{
    var greeting=an.greetings?an.greetings[Math.floor(Math.random()*an.greetings.length)]:'';
    var story=an.stories?an.stories[Math.floor(Math.random()*an.stories.length)]:'';
    document.getElementById('dText').textContent=greeting+(story?'\n'+story:'');
    document.getElementById('dEmoji').textContent=an.emoji+' ❓';
    document.getElementById('dAction').style.display='';
    dlgData={done:false,aid:aid,teach:an.teach};
  }
  document.getElementById('dialogOv').classList.add('show');
}

function closeDlg(){pS('click');document.getElementById('dialogOv').classList.remove('show');curAnimal=null}
function doTask(){pS('click');closeDlg();if(dlgData.aid)startQ('task',dlgData.aid,dlgData.teach,1)}

/* ===== 题目系统 ===== */
var QS={mode:'',aid:'',teach:'',total:1,cur:0,correct:0,answered:false,curQ:null,advId:'',advNode:0,pracCounted:false};

function startQ(mode,aid,teach,total){
  QS.mode=mode;QS.aid=aid||'cat';QS.teach=teach||'add';QS.cur=0;QS.correct=0;QS.answered=false;QS.total=total||1;QS.advId='';QS.advNode=0;QS.pracCounted=false;
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
  var vis=document.getElementById('qVis');vis.innerHTML='';
  for(var i=0;i<q.nums[0];i++){var sp=document.createElement('span');sp.className='vi';sp.textContent=q.sc.e;sp.style.animationDelay=i*.12+'s';vis.appendChild(sp)}
  var opEl=document.createElement('span');opEl.className='vop';opEl.textContent=q.op;vis.appendChild(opEl);
  if(q.op==='+'){
    for(var i=0;i<q.nums[1];i++){var sp=document.createElement('span');sp.className='vi';sp.textContent=q.sc.e;sp.style.animationDelay=(q.nums[0]+i)*.12+'s';vis.appendChild(sp)}
  }else{
    for(var i=0;i<q.nums[1];i++){var sp=document.createElement('span');sp.className='vi';sp.textContent=q.sc.e;sp.style.opacity='.4';sp.style.animationDelay=(q.nums[0]+i)*.12+'s';vis.appendChild(sp)}
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
}

function updProg(){
  var c=document.getElementById('qProg');c.innerHTML='';
  for(var i=0;i<QS.total;i++){var d=document.createElement('div');d.className='q-dot';if(i<QS.cur)d.classList.add('done');if(i===QS.cur)d.classList.add('current');c.appendChild(d)}
}

function chk(num,btn){
  if(QS.answered)return;QS.answered=true;
  var q=QS.curQ,box=document.getElementById('ab');
  document.querySelectorAll('.q-opt').forEach(function(b){b.disabled=true});

  if(num===q.answer){
    pS('ok');box.textContent=num;box.classList.add('ok');btn.classList.add('ok-opt');QS.correct++;
    var ps=['太棒了！🎉','你真聪明！🌟','答对了！💪','好厉害！👏','完美！✨','真棒！🏆'];
    document.getElementById('qFb').textContent=ps[ri(0,ps.length-1)];document.getElementById('qFb').className='q-fb ok-fb';
    var xg=20+S.mc*3;S.xp+=xg;S.totalXp+=xg;S.coins+=5;S.combo++;if(S.combo>S.mc)S.mc=S.combo;
    chkLU();QS.cur++;saveS();setTimeout(nextQ,1100);
  }else{
    pS('no');box.textContent=num;box.classList.add('no');btn.classList.add('no-opt');S.combo=0;
    document.getElementById('qFb').textContent='再想想～答案是 '+q.answer+' 💡';document.getElementById('qFb').className='q-fb no-fb';
    document.querySelectorAll('.q-opt').forEach(function(b){if(parseInt(b.textContent)===q.answer)b.classList.add('ok-opt')});
    QS.cur++;saveS();setTimeout(nextQ,1800);
  }
}

function finishQ(){
  if(QS.mode==='task'){
    if(!S.daily.done)S.daily.done=[];
    if(S.daily.done.indexOf(QS.aid)<0)S.daily.done.push(QS.aid);
    var streak=S.daily.streak||0;
    var bonus=streak>=7?3:streak>=3?2:streak>=1?1:0;
    S.coins+=bonus;S.xp+=bonus;S.totalXp+=bonus;
    saveS();show('island-screen');updIsland();
  }else if(QS.mode==='story'){
    storyNextChapter();
  }else if(QS.mode==='emergency'){
    finishEmergency();
    show('island-screen');
    updateStreak();saveS();updIsland();show('island-screen');
  }else if(QS.mode==='adv'){
    finishAdv();
  }else{
    if(!QS.pracCounted){
      if(S.lessons[QS.teach]===undefined)S.lessons[QS.teach]=0;
      S.lessons[QS.teach]++;QS.pracCounted=true;saveS();
    }
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
  if(lv.l===2&&S.pets.indexOf('chick')<0){S.pets.push('chick');S.companion='chick';msgs.push('🐥 获得宠物：小黄！')}
  if(lv.l===4&&S.pets.indexOf('parrot')<0){S.pets.push('parrot');msgs.push('🦜 获得宠物：小鹦！')}
  saveS();
  document.getElementById('luDetail').textContent=msgs.join('\n')||'继续加油！';
  document.getElementById('luOv').classList.add('show');
}

function closeLu(){pS('click');document.getElementById('luOv').classList.remove('show');updIsland()}

/* ===== 学习模式 ===== */
function showLessons(){pS('click');activeNav=1;updNav();show('learn-screen');renderLessons()}

function renderLessons(){
  var g=document.getElementById('lessonGrid');g.innerHTML='';
  var ls=[
    {k:'add',n:'加法',ic:'🐱',d:'把东西合在一起',ul:1},
    {k:'sub',n:'减法',ic:'🐶',d:'拿走一些还剩多少',ul:1},
    {k:'addChain',n:'连加',ic:'🐰',d:'三个数相加',ul:3},
    {k:'subChain',n:'连减',ic:'🐻',d:'连续减去几个数',ul:3},
    {k:'mix',n:'混合运算',ic:'🦊',d:'加法和减法一起',ul:5},
    {k:'bigNum',n:'大数运算',ic:'🐼',d:'更大的数字',ul:6}
  ];
  ls.forEach(function(l){
    var locked=S.level<l.ul;
    var done=S.lessons[l.k]&&S.lessons[l.k]>0;
    var c=document.createElement('div');c.className='lesson-card'+(locked?' locked':'');
    c.innerHTML='<div class="lc-icon">'+l.ic+'</div><div class="lc-name">'+l.n+'课</div><div class="lc-desc">'+l.d+'</div>'+(done?'<div class="lc-badge">✓ 已完成</div>':'')+(locked?'<div class="lc-badge" style="background:#BDBDBD">Lv.'+l.ul+'解锁</div>':'');
    if(!locked)c.onclick=(function(k){return function(){startCrs(k)}})(l.k);
    g.appendChild(c);
  });
}

var LS={k:'',si:0,aid:'',tm:''};

function startCrs(k){
  pS('click');var c=CRS[k];if(!c)return;
  LS={k:k,si:0,aid:c.aid,tm:c.tm};
  show('course-screen');document.getElementById('crsTitle').textContent=c.title;
  renderStep();
}

function renderStep(){
  var c=CRS[LS.k],step=c.steps[LS.si],card=document.getElementById('crsCard');
  if(step.t==='teach'){
    card.innerHTML='<div class="teacher">'+AN[LS.aid].emoji+'</div>'+
      '<div class="t-speech">'+step.text+'</div>'+
      '<div class="t-demo">'+step.emoji+'</div>'+
      '<div class="t-nav">'+
      (LS.si>0?'<button class="btn prev-btn" onclick="lsPrev()">← 上一步</button>':'')+
      (LS.si<c.steps.length-1?'<button class="btn next-btn" onclick="lsNext()">下一步 →</button>':'<button class="btn next-btn" onclick="startPrac()">开始练习 💪</button>')+
      '</div>';
  }
}

function startPrac(){
  pS('click');if(S.lessons[LS.k]===undefined)S.lessons[LS.k]=0;S.lessons[LS.k]++;saveS();
  startQ('learn',LS.aid,LS.tm,3);
}

function lsNext(){pS('click');LS.si++;renderStep()}
function lsPrev(){pS('click');LS.si--;renderStep()}

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
  if(S.stories&&S.stories[key]&&S.stories[key].done)return;
  storySt={id:stId,chapter:0,active:true,answers:[]};
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
  startQ('story',st.aid,mode,1);
  QS.storyId=st.id;
  QS.storyChapter=storySt.chapter;
}

function storyNextChapter(){
  storySt.chapter++;
  var st=STORIES.find(function(x){return x.id===storySt.id});
  if(!st||storySt.chapter>=st.chapters.length){finishStory(st)}
  else{renderStoryChapter(st)}
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

function showAdvList(){pS('click');activeNav=2;updNav();show('adv-list-screen');renderAdvList()}

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
  document.querySelectorAll('.deco-tab').forEach(function(t){t.classList.remove('active')});
  var tabId='decoTab'+tab.charAt(0).toUpperCase()+tab.slice(1);
  document.getElementById(tabId).classList.add('active');
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
      var isPlaced=placed.indexOf(id)>=0;
      var item=document.createElement('div');
      item.className='deco-item'+(isPlaced?' placed':' owned');
      item.innerHTML='<div class="di-icon">'+d.ic+'</div><div class="di-name">'+d.name+'</div><div class="di-status">'+(isPlaced?'📍 已放置':'📦 未放置')+'</div>';
      item.onclick=function(){toggleDeco(id)};
      grid.appendChild(item);
    });
  }else if(decoTab==='placed'){
    if(placed.length===0){grid.innerHTML='<div style="grid-column:1/-1;text-align:center;color:#888;padding:20px">还没有放置装饰，去已拥有里点击放置 📍</div>';return}
    placed.forEach(function(id){
      var d=DECOS.find(function(x){return x.id===id});if(!d)return;
      var item=document.createElement('div');
      item.className='deco-item placed';
      item.innerHTML='<div class="di-icon">'+d.ic+'</div><div class="di-name">'+d.name+'</div><div class="di-status">🗑️ 点击移除</div>';
      item.onclick=function(){removeDeco(id)};
      grid.appendChild(item);
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
  var idx=S.placedDecos.indexOf(id);
  if(idx>=0){S.placedDecos.splice(idx,1)}else{S.placedDecos.push(id)}
  saveS();pS('click');renderDecoGrid();renderIslandDecos();
}

function removeDeco(id){
  if(!S.placedDecos)S.placedDecos=[];
  var idx=S.placedDecos.indexOf(id);
  if(idx>=0)S.placedDecos.splice(idx,1);
  saveS();pS('click');renderDecoGrid();renderIslandDecos();
}

function renderIslandDecos(){
  document.querySelectorAll('.deco-on-island').forEach(function(e){e.remove()});
  if(!S.placedDecos)return;
  var scene=document.getElementById('islandScene');
  S.placedDecos.forEach(function(id){
    var d=DECOS.find(function(x){return x.id===id});if(!d)return;
    var deco=document.createElement('div');
    deco.className='deco-on-island';deco.dataset.id=id;
    var left=10+Math.random()*80;
    var bottom=8+Math.random()*30;
    deco.style.left=left+'%';deco.style.bottom=bottom+'%';
    deco.innerHTML='<span class="deco-emoji">'+d.ic+'</span>';
    deco.onclick=function(){
      if(!S.placedDecos)return;
      var idx=S.placedDecos.indexOf(id);
      if(idx>=0){S.placedDecos.splice(idx,1);saveS();renderIslandDecos();renderDecoGrid()}
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
function showPets(){pS('click');activeNav=3;updNav();show('pet-screen');renderPets()}

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
  var animals={orchard:['rabbit','bear'],park:['fox'],castle:['panda']};
  var list=animals[area]||[];
  list.forEach(function(k){
    var b=document.getElementById('area-badge-'+k);
    if(b){b.textContent=S.daily.done&&S.daily.done.indexOf(k)>=0?'❤️':'❗'}
  });
}

/* ===== 每日任务面板 ===== */
function showTaskPanel(){
  pS('click');
  renderTaskPanel();
  document.getElementById('taskPanel').classList.add('show');
}

function closeTaskPanel(){
  pS('click');
  document.getElementById('taskPanel').classList.remove('show');
}

function renderTaskPanel(){
  var today=new Date().toISOString().slice(0,10);
  if(!S.daily.streak)S.daily.streak=0;
  if(!S.daily.lastDate)S.daily.lastDate='';
  if(S.daily.date!==today){
    var yesterday=new Date(Date.now()-86400000).toISOString().slice(0,10);
    if(S.daily.lastDate===yesterday&&S.daily.done.length>0){S.daily.streak++}
    else if(S.daily.lastDate!==today){S.daily.streak=S.daily.lastDate===today?S.daily.streak:0}
    S.daily={date:today,done:[],streak:S.daily.streak,lastDate:S.daily.date||''};
    saveS();
  }
  var streak=S.daily.streak||0;
  var done=S.daily.done||[];
  var totalTasks=Object.keys(AN).length;
  var doneCount=done.length;
  var leftCount=totalTasks-doneCount;
  var baseReward=3;
  var streakBonus=streak>=7?3:streak>=3?2:streak>=1?1:0;
  var totalReward=leftCount*(baseReward+streakBonus);
  document.getElementById('streakCount').textContent=streak+' 天';
  var bonusText='';
  if(streak>=7)bonusText='🔥 全勤大师！每任务 +'+streakBonus+' 金币';
  else if(streak>=3)bonusText='🔥 连续达人！每任务 +'+streakBonus+' 金币';
  else if(streak>=1)bonusText='✨ 连续打卡！每任务 +'+streakBonus+' 金币';
  else bonusText='💪 开始今天的第一题！';
  document.getElementById('streakBonus').textContent=bonusText;
  var rewardEmoji=streak>=7?'🏆':streak>=3?'🥇':streak>=1?'🥈':'🎁';
  document.getElementById('streakReward').textContent=rewardEmoji;
  var list=document.getElementById('taskList');list.innerHTML='';
  var areaNames={home:'🏠 家',orchard:'🌳 果园',beach:'🏖️ 海滩',park:'🎪 游乐场',castle:'🏰 城堡'};
  Object.keys(AN).forEach(function(k){
    var an=AN[k];
    var isDone=done.indexOf(k)>=0;
    var isLocked=S.areas.indexOf(an.area)<0;
    var item=document.createElement('div');
    item.className='task-item'+(isDone?' done':'')+(isLocked?' locked':'');
    if(isLocked){
      item.innerHTML='<span class="t-emoji" style="opacity:.3">'+an.emoji+'</span>'+
        '<div class="t-info"><div class="t-name" style="opacity:.3">'+an.name+'</div>'+
        '<div class="t-desc">🔒 在'+(areaNames[an.area]||an.area)+'</div></div>'+
        '<span class="t-status pending-icon">🔒</span>';
    }else{
      var reward=(baseReward+streakBonus);
      item.innerHTML='<span class="t-emoji">'+an.emoji+'</span>'+
        '<div class="t-info"><div class="t-name">'+an.name+'</div>'+
        '<div class="t-desc">帮'+an.name+'解题</div>'+
        '<div class="t-reward">💰 +'+reward+' 金币'+(streakBonus>0?' (含连续奖励)':'')+'</div></div>'+
        '<span class="t-status '+(isDone?'done-icon':'pending-icon')+'">'+(isDone?'✅':'⏳')+'</span>';
    }
    list.appendChild(item);
  });
  document.getElementById('sDone').textContent=doneCount;
  document.getElementById('sLeft').textContent=leftCount;
  document.getElementById('sReward').textContent=totalReward;
}

function updateStreak(){
  var today=new Date().toISOString().slice(0,10);
  if(S.daily.lastDate!==today){S.daily.lastDate=today;saveS()}
}

/* ===== 紧急任务 ===== */
var emergencyTimer=null;
var emergencyTimeLeft=0;
var emergencyActive=false;
var emergencyData={};

function triggerEmergency(){
  if(emergencyActive)return;
  if(Math.random()>0.1)return;
  var em=EMERGENCY_TEXTS[Math.floor(Math.random()*EMERGENCY_TEXTS.length)];
  emergencyData=em;
  emergencyActive=true;
  emergencyTimeLeft=30;
  document.getElementById('emIcon').textContent=em.icon;
  document.getElementById('emTitle').textContent=em.title;
  document.getElementById('emText').textContent=em.text;
  document.getElementById('emTimer').textContent='⏰ '+emergencyTimeLeft;
  document.getElementById('emergencyOv').classList.add('show');
  emergencyTimer=setInterval(function(){
    emergencyTimeLeft--;
    document.getElementById('emTimer').textContent='⏰ '+emergencyTimeLeft;
    if(emergencyTimeLeft<=0){closeEmergency()}
  },1000);
}

function doEmergencyTask(){
  pS('click');
  clearInterval(emergencyTimer);
  emergencyActive=false;
  document.getElementById('emergencyOv').classList.remove('show');
  var animals=['cat','dog','rabbit','bear','fox','panda'];
  var aid=animals[Math.floor(Math.random()*animals.length)];
  var an=AN[aid];
  startQ('emergency',aid,an.teach,3);
  QS.emergency=true;
  QS.emergencyTime=emergencyTimeLeft;
}

function closeEmergency(){
  pS('click');
  clearInterval(emergencyTimer);
  emergencyActive=false;
  document.getElementById('emergencyOv').classList.remove('show');
}

function finishEmergency(){
  var bonus=QS.correct>=2?10:5;
  S.coins+=bonus;S.xp+=bonus;S.totalXp+=bonus;
  saveS();updIsland();
  pS('lu');
  fw(2);
}

/* ===== 初始化 ===== */
function init(){
  initPlayerWalk();
  var saved=loadS();
  if(saved&&saved.name){S=saved;show('island-screen');updIsland();initDecoSystem();renderPlayerAccessories()}
  else{show('create-screen')}
  // 紧急任务每30秒检查一次
  setInterval(function(){
    if(document.getElementById('island-screen').classList.contains('active')){triggerEmergency()}
  },30000);
  // 背景音乐
  setTimeout(playBgMusic,1000);
}

init();
