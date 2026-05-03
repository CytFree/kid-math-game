/* ===== 宠物系统 ===== */
/* 独立模块，通过全局函数与 game.js 交互 */

/* ===== 宠物数据 ===== */
var PETS = [
  {id:'cat',    name:'小喵',    emojis:['🥚','🐱','🐱','🐱'], desc:'温暖陪伴的伙伴', personality:'温顺'},
  {id:'dragon', name:'小龙',    emojis:['🥚','🐲','🐲','🐲'], desc:'威猛强大的伙伴', personality:'勇敢'},
  {id:'rabbit', name:'小兔',    emojis:['🥚','🐇','🐇','🐇'], desc:'活泼可爱的伙伴', personality:'活泼'},
  {id:'spirit', name:'小精灵',  emojis:['💎','✨','🌟','⭐'], desc:'神秘闪耀的伙伴', personality:'神秘'}
];

var PET_STAGES = [
  {name:'蛋',     bonus:0, needAff:0},
  {name:'幼年',   bonus:2, needAff:0},
  {name:'成长期', bonus:4, needAff:30},
  {name:'完全体', bonus:6, needAff:70}
];

var PET_HATCH_NEED = 10;

/* ===== 初始化 ===== */

function petInit(){
  if(S.pet===undefined)S.pet=null;
}

/* ===== Lv.2 宠物选择 ===== */

function petShowChoice(){
  pS('lu');
  var ov=document.getElementById('petChoiceOv');
  if(!ov)return;
  renderPetChoice();
  ov.classList.add('show');
}

function renderPetChoice(){
  var g=document.getElementById('petChoiceGrid');
  if(!g)return;
  g.innerHTML='';
  PETS.forEach(function(p){
    var c=document.createElement('div');
    c.className='pc-card';
    c.innerHTML='<div class="pc-emoji">'+p.emojis[0]+'</div><div class="pc-name">'+p.name+'</div><div class="pc-desc">'+p.desc+'</div>';
    c.onclick=function(){selectPetChoice(p.id)};
    c.dataset.petId=p.id;
    g.appendChild(c);
  });
}

var _selectedPetId=null;

function selectPetChoice(id){
  _selectedPetId=id;
  var cards=document.querySelectorAll('.pc-card');
  cards.forEach(function(c){c.classList.toggle('selected',c.dataset.petId===id)});
  var pet=PETS.find(function(p){return p.id===id});
  if(!pet)return;
  var input=document.getElementById('petNameInput');
  if(input){
    input.value=S.name+'的'+pet.name;
    input.focus();
  }
  document.getElementById('petChoiceConfirm').style.display='';
}

function petConfirmChoice(){
  var id=_selectedPetId;
  if(!id)return;
  var input=document.getElementById('petNameInput');
  var name=input?input.value.trim():'';
  if(!name)name='小宝的伙伴';
  var pet=PETS.find(function(p){return p.id===id});
  if(!pet)return;

  S.pet={
    id:id,
    name:name,
    stage:0,
    hatched:false,
    hatchProg:0,
    affection:0,
    fullness:80,
    feedTime:0,
    petTimes:0,
    petDate:'',
    playTimes:0,
    playDate:'',
    lastActive:Date.now()
  };
  saveS();
  pS('ok');
  document.getElementById('petChoiceOv').classList.remove('show');
  document.getElementById('petChoiceConfirm').style.display='none';
  _selectedPetId=null;
  updIsland();
}

/* ===== 核心逻辑 ===== */

function petOnCorrect(){
  if(!S.pet)return;
  S.pet.lastActive=Date.now();
  var p=S.pet;

  if(!p.hatched){
    p.hatchProg++;
    if(S.combo>0)p.hatchProg++;
    if(p.hatchProg>=PET_HATCH_NEED)p.readyToHatch=true;
    return;
  }

  p.fullness=Math.max(0,p.fullness-2);
  p.affection=Math.min(100,p.affection+1);
  petCheckStageUp();
}

function petOnWrong(){
  // 答错不惩罚
}

function petGetBonus(){
  if(!S.pet||!S.pet.hatched||S.pet.fullness<=0)return 0;
  return PET_STAGES[S.pet.stage].bonus;
}

/* ===== 成长阶段 ===== */

function petCheckStageUp(){
  var p=S.pet;
  if(!p||!p.hatched)return;
  for(var s=p.stage+1;s<PET_STAGES.length;s++){
    if(p.affection>=PET_STAGES[s].needAff){
      p.stage=s;
      pS('lu');
      petShowStageUp(s);
      petSpawnEffect('sparkle');
    }
  }
}

function petShowStageUp(stage){
  var st=PET_STAGES[stage];
  var pet=PETS.find(function(p){return p.id===S.pet.id});
  if(!pet||!st)return;
  var msg=S.pet.name+' 成长了！现在是 '+st.name+'！';
  var el=document.getElementById('petNotify');
  if(el){
    el.innerHTML=pet.emojis[stage]+' '+msg;
    el.classList.add('show','notify-stageup');
    setTimeout(function(){el.classList.remove('show','notify-stageup')},3500);
  }
}

/* ===== 孵化 ===== */

function petDoHatch(){
  if(!S.pet||S.pet.hatched)return;
  S.pet.hatched=true;
  S.pet.stage=1;
  S.pet.fullness=80;
  S.pet.readyToHatch=false;
  saveS();
  pS('lu');
  var ov=document.getElementById('petHatchOv');
  var pet=PETS.find(function(p){return p.id===S.pet.id});
  if(ov&&pet){
    document.getElementById('hatchEmoji').textContent=pet.emojis[0];
    document.getElementById('hatchResultEmoji').textContent=pet.emojis[1];
    document.getElementById('hatchName').textContent=S.pet.name;
    document.getElementById('hatchPetName').textContent=pet.name;
    ov.classList.add('show');
  }else{
    petNotify('🎉 '+S.pet.name+' 孵化成功了！');
  }
  updIsland();
}

function petCloseHatch(){
  pS('click');
  document.getElementById('petHatchOv').classList.remove('show');
}

/* ===== 宠物心情 ===== */

function petGetMood(){
  if(!S.pet||!S.pet.hatched)return '';
  var p=S.pet;
  var idle=Date.now()-p.lastActive;
  if(p.fullness<=0)return '🥺';
  if(p.fullness<=20&&idle>10000)return '🍽️';
  if(idle>120000)return '💤';
  if(p.affection>=70)return '❤️';
  if(Math.random()<0.2){
    var moods=['😊','✨','🎵','⭐'];
    return moods[Math.floor(Math.random()*moods.length)];
  }
  return '';
}

/* ===== 互动面板 ===== */

function petClickArea(){
  pS('pop');
  if(!S.pet){
    petNotify('🏡 Lv.2 解锁宠物系统！');
    return;
  }
  S.pet.lastActive=Date.now();
  renderPetDetail();
  document.getElementById('petDetailOv').classList.add('show');
}

function renderPetDetail(){
  var p=S.pet;
  var pet=PETS.find(function(x){return x.id===p.id});
  if(!pet)return;
  var st=PET_STAGES[p.stage];

  document.getElementById('pdEmoji').textContent=pet.emojis[p.stage];
  document.getElementById('pdName').textContent=p.name;
  document.getElementById('pdStage').textContent=p.hatched?st.name:'🥚 孵化中 ('+p.hatchProg+'/'+PET_HATCH_NEED+')';
  document.getElementById('pdDesc').textContent=pet.desc+' · '+pet.personality;

  setBar('pdAffBar', p.affection);
  setBar('pdFullBar', p.fullness);
  if(!p.hatched){
    document.getElementById('pdGrowthLabel').textContent='孵化进度';
    setBar('pdGrowthBar', Math.floor(p.hatchProg/PET_HATCH_NEED*100));
  }else{
    document.getElementById('pdGrowthLabel').textContent='成长值';
    setBar('pdGrowthBar', Math.min(100, Math.floor(p.affection/70*100)));
  }

  // 喂食
  var feedBtn=document.getElementById('pdFeedBtn');
  if(feedBtn){
    if(!p.hatched){feedBtn.disabled=true;feedBtn.textContent='🍗 孵化后才能喂食'}
    else if(S.coins<3){feedBtn.disabled=true;feedBtn.textContent='🍗 金币不足'}
    else if(Date.now()-p.feedTime<8000){feedBtn.disabled=true;feedBtn.textContent='🍗 稍后再喂'}
    else if(p.fullness>=100){feedBtn.disabled=true;feedBtn.textContent='🍗 已经饱了'}
    else{feedBtn.disabled=false;feedBtn.textContent='🍗 喂食 (+饱腹度+亲密度)'}
  }

  // 抚摸
  var petBtn=document.getElementById('pdPetBtn');
  if(petBtn){
    if(!p.hatched){petBtn.disabled=true;petBtn.textContent='🤗 孵化后才能抚摸'}
    else{
      var today=new Date().toDateString();
      var used=(p.petDate===today)?p.petTimes:0;
      petBtn.disabled=used>=3;
      petBtn.textContent='🤗 抚摸'+(used>=3?'（今日已满）':' ('+(3-used)+'/3)');
    }
  }

  // 玩耍
  var playBtn=document.getElementById('pdPlayBtn');
  if(playBtn){
    if(!p.hatched){playBtn.disabled=true;playBtn.textContent='🎾 孵化后才能玩耍'}
    else{
      var today=new Date().toDateString();
      var pUsed=(p.playDate===today)?p.playTimes:0;
      playBtn.disabled=pUsed>=3;
      playBtn.textContent='🎾 玩耍'+(pUsed>=3?'（今日已满）':' ('+(3-pUsed)+'/3)');
    }
  }

  // 加成说明
  var bonusEl=document.getElementById('pdBonus');
  if(bonusEl){
    if(!p.hatched){
      bonusEl.textContent='🐣 答对 '+(PET_HATCH_NEED-p.hatchProg)+' 题后孵化';
    }else if(p.fullness<=0){
      bonusEl.innerHTML='🥺 饿了，快喂食吧！（当前无加成）';
    }else{
      bonusEl.innerHTML='答对 <b>+'+st.bonus+' XP</b>'+(p.stage>=3?' +1💰':'')+' &nbsp;|&nbsp; 饱腹度 <b>'+p.fullness+'</b>/100';
    }
  }
}

function setBar(id, val){
  var el=document.getElementById(id);
  if(el)el.style.width=Math.min(100,Math.max(0,val))+'%';
}

/* ===== 喂食 ===== */

function petFeed(){
  var p=S.pet;
  if(!p||!p.hatched)return;
  if(S.coins<3){petNotify('金币不足！');return;}
  if(Date.now()-p.feedTime<8000){petNotify('不能连续喂食哦');return;}
  if(p.fullness>=100){petNotify('已经饱了！');return;}
  S.coins-=3;
  p.fullness=Math.min(100,p.fullness+20);
  p.affection=Math.min(100,p.affection+5);
  p.feedTime=Date.now();
  p.lastActive=Date.now();
  saveS();
  pS('ok');
  petSpawnEffect('feed');
  petNotify('🍗 喂食成功！饱腹度+20 亲密度+5');
  petCheckStageUp();
  renderPetDetail();
  updIsland();
  petTriggerHappy();
}

/* ===== 抚摸 ===== */

function petPet(){
  var p=S.pet;
  if(!p||!p.hatched)return;
  var today=new Date().toDateString();
  if(p.petDate!==today){p.petTimes=0;p.petDate=today;}
  if(p.petTimes>=3){petNotify('今天已抚摸3次，明天再来吧');return;}
  p.petTimes++;
  p.affection=Math.min(100,p.affection+3);
  p.lastActive=Date.now();
  saveS();
  pS('ok');
  petSpawnEffect('pet');
  petNotify('🤗 '+S.pet.name+' 好开心！亲密度+3');
  petCheckStageUp();
  renderPetDetail();
  petTriggerHappy();
}

/* ===== 玩耍 ===== */

function petPlay(){
  var p=S.pet;
  if(!p||!p.hatched)return;
  var today=new Date().toDateString();
  if(p.playDate!==today){p.playTimes=0;p.playDate=today;}
  if(p.playTimes>=3){petNotify('今天已经玩够了，明天再来吧！');return;}
  p.playTimes++;
  p.affection=Math.min(100,p.affection+4);
  p.fullness=Math.max(0,p.fullness-5);
  p.lastActive=Date.now();
  saveS();
  pS('ok');
  petSpawnEffect('play');
  petNotify('🎾 和 '+S.pet.name+' 玩得好开心！亲密度+4');
  petCheckStageUp();
  renderPetDetail();
  petTriggerHappy();
}

function petCloseDetail(){
  pS('click');
  document.getElementById('petDetailOv').classList.remove('show');
}

/* ===== 特效 ===== */

function petSpawnEffect(type){
  var container=document.getElementById('petEffects');
  if(!container)return;
  var emojis={
    feed:['🌟','✨','❤️'],
    pet:['❤️','💕','🌸'],
    play:['🎾','⭐','🌈','🎉'],
    sparkle:['✨','🌟','🎉','💫']
  };
  var list=emojis[type]||['✨'];
  container.innerHTML='';
  for(var i=0;i<6;i++){
    var e=document.createElement('span');
    e.className='pet-effect';
    e.textContent=list[Math.floor(Math.random()*list.length)];
    e.style.left=(20+Math.random()*60)+'%';
    e.style.animationDelay=(Math.random()*0.5)+'s';
    container.appendChild(e);
    setTimeout(function(el){el.remove()},1500, e);
  }
}

/* ===== 通知 ===== */

function petNotify(msg){
  var el=document.getElementById('petNotify');
  if(!el)return;
  el.innerHTML=msg;
  el.classList.add('show');
  clearTimeout(el._timer);
  el._timer=setTimeout(function(){el.classList.remove('show')},2500);
}

/* ===== 岛屿显示 ===== */

function petRenderIsland(){
  var area=document.getElementById('area-pet');
  var icon=document.getElementById('petAreaIcon');
  var label=document.getElementById('petAreaLabel');
  var mood=document.getElementById('petAreaMood');
  var house=document.getElementById('petAreaHouse');
  if(!area||!icon)return;

  if(!S.pet){
    mood.textContent='';
    area.classList.add('locked');
    var canvas=document.getElementById('petCanvas');
    if(canvas)canvas.style.display='none';
    petStopAnim();
    return;
  }

  area.classList.remove('locked');
  var pet=PETS.find(function(p){return p.id===S.pet.id});
  if(!pet)return;

  if(S.pet.hatched){
    // Canvas 绘制
    icon.style.display='none';
    var canvas=document.getElementById('petCanvas');
    if(canvas){
      canvas.style.display='block';
      petStartAnim();
    }
    label.textContent=S.pet.name;
    house.style.display='block';
  }else{
    icon.style.display='';
    icon.textContent=pet.emojis[0];
    label.textContent=S.pet.name+' ('+S.pet.hatchProg+'/'+PET_HATCH_NEED+')';
    icon.className='area-icon pet-shake';
    var canvas=document.getElementById('petCanvas');
    if(canvas)canvas.style.display='none';
    petStopAnim();
    house.style.display='none';
  }

  // 心情指示
  mood.textContent=petGetMood();
}

function petUpdateHud(){
  var el=document.getElementById('hudPet');
  if(!el)return;

  if(!S.pet){el.textContent='';el.className='hud-pet';return;}

  if(S.pet.readyToHatch){petDoHatch();return;}

  var pet=PETS.find(function(p){return p.id===S.pet.id});
  if(!pet)return;

  if(S.pet.hatched){
    var st=PET_STAGES[S.pet.stage];
    var ps=['🥚','🐣','🌱','🌟'];
    el.textContent=pet.emojis[S.pet.stage]+' '+ps[S.pet.stage];
    el.className='hud-pet hud-pet-'+S.pet.stage;
  }else{
    el.textContent='🥚'+S.pet.hatchProg+'/'+PET_HATCH_NEED;
    el.className='hud-pet';
  }
}

/* ===== 答题反馈 ===== */

function petReaction(correct){
  var el=document.getElementById('petReaction');
  if(!el)return;
  if(!S.pet||!S.pet.hatched){el.textContent='';return;}
  var pet=PETS.find(function(p){return p.id===S.pet.id});
  if(!pet)return;
  var emoji=pet.emojis[S.pet.stage];
  el.textContent=correct?(emoji+' 🎉'):(emoji+' 💪');
  el.className='pet-reaction show';
  clearTimeout(el._reactTimer);
  el._reactTimer=setTimeout(function(){el.className='pet-reaction'},1500);
}

/* ==========================================
   Canvas 宠物绘制系统
   ========================================== */

/* 绘制配置 */
var PET_CFG = {
  cat:    { body:'#FFB74D', head:'#FFB74D', ear:'#FF8A65', belly:'#FFE0B2', dark:'#F57C00', tail:'#FFB74D', earType:'pointy', tailType:'curve', whiskers:true },
  dragon: { body:'#81C784', head:'#81C784', ear:'#4CAF50', belly:'#C8E6C9', dark:'#388E3C', tail:'#81C784', earType:'horn',   tailType:'spike', whiskers:false },
  rabbit: { body:'#FFCDD2', head:'#FFCDD2', ear:'#FFCDD2', belly:'#FFFFFF', dark:'#E91E63', tail:'#FFFFFF', earType:'long',   tailType:'puff',  whiskers:true },
  spirit: { body:'#CE93D8', head:'#CE93D8', ear:'#BA68C8', belly:'#E1BEE7', dark:'#7B1FA2', tail:'#CE93D8', earType:'horn',   tailType:'wisp',  whiskers:false }
};

/* 动画状态 */
var PA = {
  running:false, rafId:null, petCfg:null,
  x:65, y:57, targetX:65, targetY:57,
  isWalking:false, walkPhase:0, facingLeft:false,
  action:'idle', actionEnd:0,
  idleTimer:0, breathePhase:0, tailPhase:0,
  isBlinking:false, blinkCountdown:2, blinkDuration:0,
  lastTime:0
};

function petStartAnim(){
  if(PA.running)return;
  PA.running=true; PA.lastTime=0;
  var pet=S.pet?PETS.find(function(p){return p.id===S.pet.id}):null;
  PA.petCfg=pet?PET_CFG[pet.id]:null;
  if(!PA.petCfg){PA.running=false;return;}
  PA.rafId=requestAnimationFrame(petAnimLoop);
}

function petStopAnim(){
  PA.running=false;
  if(PA.rafId){cancelAnimationFrame(PA.rafId);PA.rafId=null}
  var c=document.getElementById('petCanvas');
  if(c){var ctx=c.getContext('2d');if(ctx)ctx.clearRect(0,0,130,100)}
}

function petAnimLoop(ts){
  if(!PA.running)return;
  if(!PA.lastTime)PA.lastTime=ts;
  var dt=Math.min((ts-PA.lastTime)/1000,0.1);
  PA.lastTime=ts;
  petUpdate(dt,ts);
  var c=document.getElementById('petCanvas');
  if(c&&c.style.display!=='none'&&c.parentNode&&c.offsetParent!==null){
    var ctx=c.getContext('2d');
    if(ctx)petDraw(ctx,ts);
  }
  PA.rafId=requestAnimationFrame(petAnimLoop);
}

function petUpdate(dt,ts){
  var p=PA;
  p.breathePhase+=dt*2.5;
  p.tailPhase+=dt*(p.action==='happy'?10:3);

  // 眨眼
  p.blinkCountdown-=dt;
  if(p.blinkCountdown<=0&&!p.isBlinking){p.isBlinking=true;p.blinkDuration=0}
  if(p.isBlinking){
    p.blinkDuration+=dt;
    if(p.blinkDuration>0.12){p.isBlinking=false;p.blinkDuration=0;p.blinkCountdown=2+Math.random()*3}
  }

  // 动作超时
  if(p.action==='happy'&&Date.now()>p.actionEnd)p.action='idle';

  // 漫游 AI
  if(p.isWalking){
    var dx=p.targetX-p.x;
    if(Math.abs(dx)<1.5){
      p.x=p.targetX;p.isWalking=false;
      p.action='idle';p.idleTimer=0;
    }else{
      var spd=38*dt;
      p.x+=Math.sign(dx)*Math.min(spd,Math.abs(dx));
      p.facingLeft=dx<0;
    }
    p.walkPhase+=dt*10;
  }else{
    p.idleTimer+=dt;
    if(p.idleTimer>2+Math.random()*3&&p.action==='idle'){
      p.targetX=25+Math.random()*80;
      p.isWalking=true;p.action='walk';
      p.walkPhase=0;p.idleTimer=0;
    }
  }
}

function petDraw(ctx,ts){
  var cfg=PA.petCfg;
  if(!cfg)return;

  ctx.clearRect(0,0,130,100);

  // 草地底部
  ctx.fillStyle='rgba(139,195,74,0.15)';
  ctx.fillRect(0,76,130,24);

  var p=PA;
  var breathe=Math.sin(p.breathePhase)*0.6;
  var wb=p.isWalking?Math.abs(Math.sin(p.walkPhase))*2.5:0;
  var hb=p.action==='happy'?Math.abs(Math.sin(Date.now()/70))*5:0;
  var by=p.y+breathe+wb-hb;

  // 方向翻转
  if(p.facingLeft){
    ctx.save();
    ctx.translate(130,0);
    ctx.scale(-1,1);
  }

  // 按物种绘制
  var sp=cfg.tailType; // curve=cat, spike=dragon, puff=rabbit, wisp=spirit
  if(sp==='wisp')      petDrawSpirit(ctx,cfg,p.x,by,ts,p);
  else if(sp==='puff') petDrawRabbit(ctx,cfg,p.x,by,ts,p);
  else if(sp==='spike')petDrawDragon(ctx,cfg,p.x,by,ts,p);
  else                  petDrawCat(ctx,cfg,p.x,by,ts,p);

  // 睡意
  if(p.action==='idle'&&p.idleTimer>8){
    ctx.fillStyle='rgba(255,255,255,0.7)';
    ctx.font='11px sans-serif';
    ctx.fillText('💤',p.x+12,by-38);
  }

  if(p.facingLeft)ctx.restore();
}

/* ===== 绘制辅助 ===== */

function petEllipse(ctx,x,y,rx,ry,fill,stroke){
  ctx.save();
  ctx.translate(x,y);
  ctx.scale(1,ry/rx);
  ctx.beginPath();
  ctx.arc(0,0,rx,0,Math.PI*2);
  ctx.closePath();
  if(fill){ctx.fillStyle=fill;ctx.fill()}
  if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1.5;ctx.stroke()}
  ctx.restore();
}

function petRoundRect(ctx,x,y,w,h,r){
  ctx.beginPath();
  ctx.moveTo(x+r,y);
  ctx.lineTo(x+w-r,y);
  ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r);
  ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h);
  ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r);
  ctx.quadraticCurveTo(x,y,x+r,y);
  ctx.closePath();
}

/* ===== 猫 ===== */
function petDrawCat(ctx,cfg,bx,by,ts,p){
  var wag=Math.sin(p.tailPhase)*3;
  var wf=p.action==='walk'?p.walkPhase:0;
  var fl=Math.sin(wf)*3,bl=Math.sin(wf+Math.PI)*3;

  // 阴影
  ctx.fillStyle='rgba(0,0,0,0.08)';
  ctx.beginPath();ctx.ellipse(bx,80,18,5,0,0,Math.PI*2);ctx.fill();

  // 尾巴
  ctx.strokeStyle=cfg.dark;ctx.lineWidth=4;ctx.lineCap='round';
  ctx.beginPath();
  ctx.moveTo(bx+16,by-3);
  ctx.quadraticCurveTo(bx+26,by-6+wag,bx+22,by-18+wag*1.5);
  ctx.stroke();
  ctx.strokeStyle=cfg.tail;ctx.lineWidth=3;
  ctx.beginPath();
  ctx.moveTo(bx+23,by-11+wag);
  ctx.quadraticCurveTo(bx+25,by-15+wag*1.5,bx+22,by-18+wag*1.5);
  ctx.stroke();

  // 后腿
  ctx.fillStyle=cfg.dark;
  petRoundRect(ctx,bx+8+bl*0.3,by+10+bl*0.3,6,11+Math.max(0,bl*0.3),2.5);ctx.fill();
  // 前腿
  petRoundRect(ctx,bx-8+fl*0.3,by+10+fl*0.3,6,11+Math.max(0,fl*0.3),2.5);ctx.fill();

  // 身体
  petEllipse(ctx,bx,by,17,13,cfg.body,cfg.dark);
  // 肚皮
  petEllipse(ctx,bx-1,by+1,9,7,cfg.belly);

  // 头部
  var hy=by-23;
  petEllipse(ctx,bx,hy,15,14,cfg.head,cfg.dark);

  // 猫耳 - 大三角
  ctx.fillStyle=cfg.ear;
  ctx.beginPath();ctx.moveTo(bx-11,hy-8);ctx.lineTo(bx-18,hy-26);ctx.lineTo(bx-4,hy-12);ctx.closePath();ctx.fill();
  ctx.strokeStyle=cfg.dark;ctx.lineWidth=1.2;ctx.stroke();
  ctx.beginPath();ctx.moveTo(bx+11,hy-8);ctx.lineTo(bx+18,hy-26);ctx.lineTo(bx+4,hy-12);ctx.closePath();ctx.fill();
  ctx.stroke();

  // 内耳
  ctx.fillStyle='rgba(255,220,220,0.5)';
  ctx.beginPath();ctx.moveTo(bx-10,hy-9);ctx.lineTo(bx-15,hy-23);ctx.lineTo(bx-6,hy-12);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(bx+10,hy-9);ctx.lineTo(bx+15,hy-23);ctx.lineTo(bx+6,hy-12);ctx.closePath();ctx.fill();

  // 眼睛
  var eyeY=hy+1;
  if(!p.isBlinking){
    // 眼白 - 椭圆
    ctx.fillStyle='white';
    ctx.beginPath();ctx.ellipse(bx-6,eyeY,5,6,0,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(bx+6,eyeY,5,6,0,0,Math.PI*2);ctx.fill();
    // 虹膜
    ctx.fillStyle='#F9A825';
    ctx.beginPath();ctx.arc(bx-5,eyeY+1,3,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(bx+7,eyeY+1,3,0,Math.PI*2);ctx.fill();
    // 竖瞳
    ctx.fillStyle='#333';
    ctx.beginPath();ctx.ellipse(bx-5.5,eyeY,1.2,4.5,0,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(bx+6.5,eyeY,1.2,4.5,0,0,Math.PI*2);ctx.fill();
    // 高光
    ctx.fillStyle='white';
    ctx.beginPath();ctx.arc(bx-4,eyeY-2,1.5,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(bx+8,eyeY-2,1.5,0,Math.PI*2);ctx.fill();
    // 小高光
    ctx.beginPath();ctx.arc(bx-6,eyeY+3,0.8,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(bx+6,eyeY+3,0.8,0,Math.PI*2);ctx.fill();
  }else{
    // 闭眼线
    ctx.strokeStyle=cfg.dark;ctx.lineWidth=2;ctx.lineCap='round';
    ctx.beginPath();ctx.arc(bx-6,eyeY+1,4.5,0.2,Math.PI-0.2);ctx.stroke();
    ctx.beginPath();ctx.arc(bx+6,eyeY+1,4.5,0.2,Math.PI-0.2);ctx.stroke();
  }

  // 鼻子 - 小三角
  ctx.fillStyle='#FF8A80';
  ctx.beginPath();ctx.moveTo(bx,hy+7);ctx.lineTo(bx-2.5,hy+9.5);ctx.lineTo(bx+2.5,hy+9.5);ctx.closePath();ctx.fill();

  // 嘴巴 - w形
  ctx.strokeStyle='rgba(0,0,0,0.2)';ctx.lineWidth=1.2;
  ctx.beginPath();ctx.arc(bx-2,hy+11,2.5,0,Math.PI*0.7);ctx.stroke();
  ctx.beginPath();ctx.arc(bx+2,hy+11,2.5,Math.PI*0.3,Math.PI);ctx.stroke();

  // 胡须 - 每侧3根
  ctx.strokeStyle='rgba(0,0,0,0.12)';ctx.lineWidth=1;
  for(var w=0;w<3;w++){
    ctx.beginPath();ctx.moveTo(bx-11,hy+3+w*3);ctx.lineTo(bx-20,hy+w*4-1);ctx.stroke();
    ctx.beginPath();ctx.moveTo(bx+11,hy+3+w*3);ctx.lineTo(bx+20,hy+w*4-1);ctx.stroke();
  }

  // 腮红
  ctx.fillStyle='rgba(255,100,100,0.18)';
  ctx.beginPath();ctx.ellipse(bx-12,hy+6,4,3,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(bx+12,hy+6,4,3,0,0,Math.PI*2);ctx.fill();
}

/* ===== 兔子 ===== */
function petDrawRabbit(ctx,cfg,bx,by,ts,p){
  var wag=Math.sin(p.tailPhase)*2;
  var wf=p.action==='walk'?p.walkPhase:0;
  var fl=Math.sin(wf)*3,bl=Math.sin(wf+Math.PI)*3;

  // 阴影
  ctx.fillStyle='rgba(0,0,0,0.08)';
  ctx.beginPath();ctx.ellipse(bx,80,18,5,0,0,Math.PI*2);ctx.fill();

  // 尾巴 - 小圆球
  ctx.fillStyle='#fff';
  ctx.beginPath();ctx.arc(bx+18,by+wag,6,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='rgba(0,0,0,0.1)';ctx.lineWidth=1;ctx.stroke();

  // 后腿
  ctx.fillStyle=cfg.dark;
  petRoundRect(ctx,bx+8+bl*0.3,by+10+bl*0.3,7,10+Math.max(0,bl*0.3),3);ctx.fill();
  // 前腿
  petRoundRect(ctx,bx-8+fl*0.3,by+10+fl*0.3,6,10+Math.max(0,fl*0.3),3);ctx.fill();

  // 身体 - 偏圆形
  petEllipse(ctx,bx,by,17,14,cfg.body,cfg.dark);
  // 肚皮
  petEllipse(ctx,bx-1,by+1,9,8,cfg.belly);

  // 头部
  var hy=by-23;
  petEllipse(ctx,bx,hy,15,14,cfg.head,cfg.dark);

  // 兔耳 - 超长椭圆形
  ctx.fillStyle=cfg.ear;
  ctx.strokeStyle=cfg.dark;ctx.lineWidth=1.2;
  petRoundRect(ctx,bx-12,hy-34,10,30,5);ctx.fill();ctx.stroke();
  petRoundRect(ctx,bx+2,hy-34,10,30,5);ctx.fill();ctx.stroke();
  // 内耳
  ctx.fillStyle='rgba(255,200,200,0.4)';
  petRoundRect(ctx,bx-10,hy-32,6,26,3);ctx.fill();
  petRoundRect(ctx,bx+4,hy-32,6,26,3);ctx.fill();

  // 眼睛 - 大眼睛
  var eyeY=hy;
  if(!p.isBlinking){
    ctx.fillStyle='white';
    ctx.beginPath();ctx.ellipse(bx-7,eyeY,6,7,0,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(bx+7,eyeY,6,7,0,0,Math.PI*2);ctx.fill();
    // 虹膜
    ctx.fillStyle='#E91E63';
    ctx.beginPath();ctx.arc(bx-6,eyeY+1,4.5,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(bx+8,eyeY+1,4.5,0,Math.PI*2);ctx.fill();
    // 瞳孔
    ctx.fillStyle='#333';
    ctx.beginPath();ctx.arc(bx-6,eyeY+1,2.5,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(bx+8,eyeY+1,2.5,0,Math.PI*2);ctx.fill();
    // 高光
    ctx.fillStyle='white';
    ctx.beginPath();ctx.arc(bx-5,eyeY-2,1.8,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(bx+9,eyeY-2,1.8,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(bx-8,eyeY+3,1,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(bx+6,eyeY+3,1,0,Math.PI*2);ctx.fill();
  }else{
    ctx.strokeStyle=cfg.dark;ctx.lineWidth=2;ctx.lineCap='round';
    ctx.beginPath();ctx.arc(bx-7,eyeY+1,5.5,0.2,Math.PI-0.2);ctx.stroke();
    ctx.beginPath();ctx.arc(bx+7,eyeY+1,5.5,0.2,Math.PI-0.2);ctx.stroke();
  }

  // 鼻子
  ctx.fillStyle='#FF8A80';
  ctx.beginPath();ctx.moveTo(bx,hy+6);ctx.lineTo(bx-2,hy+8);ctx.lineTo(bx+2,hy+8);ctx.closePath();ctx.fill();

  // 嘴巴 - Y形（兔唇）
  ctx.strokeStyle='rgba(0,0,0,0.2)';ctx.lineWidth=1.2;
  ctx.beginPath();ctx.moveTo(bx,hy+8);ctx.lineTo(bx,hy+11);ctx.stroke();
  ctx.beginPath();ctx.moveTo(bx,hy+11);ctx.lineTo(bx-3,hy+13);ctx.stroke();
  ctx.beginPath();ctx.moveTo(bx,hy+11);ctx.lineTo(bx+3,hy+13);ctx.stroke();

  // 胡须
  ctx.strokeStyle='rgba(0,0,0,0.1)';ctx.lineWidth=1;
  for(var w=0;w<2;w++){
    ctx.beginPath();ctx.moveTo(bx-10,hy+5+w*4);ctx.lineTo(bx-18,hy+4+w*5);ctx.stroke();
    ctx.beginPath();ctx.moveTo(bx+10,hy+5+w*4);ctx.lineTo(bx+18,hy+4+w*5);ctx.stroke();
  }

  // 腮红
  ctx.fillStyle='rgba(255,100,100,0.2)';
  ctx.beginPath();ctx.ellipse(bx-14,hy+7,5,3.5,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(bx+14,hy+7,5,3.5,0,0,Math.PI*2);ctx.fill();

  // 前牙
  ctx.fillStyle='white';
  ctx.strokeStyle='rgba(0,0,0,0.1)';ctx.lineWidth=0.8;
  ctx.beginPath();ctx.moveTo(bx-2,hy+11);ctx.lineTo(bx-2,hy+14);ctx.lineTo(bx+2,hy+14);ctx.lineTo(bx+2,hy+11);ctx.closePath();ctx.fill();ctx.stroke();
}

/* ===== 龙 ===== */
function petDrawDragon(ctx,cfg,bx,by,ts,p){
  var wag=Math.sin(p.tailPhase)*3;
  var wf=p.action==='walk'?p.walkPhase:0;
  var fl=Math.sin(wf)*3,bl=Math.sin(wf+Math.PI)*3;

  // 阴影
  ctx.fillStyle='rgba(0,0,0,0.08)';
  ctx.beginPath();ctx.ellipse(bx,80,18,5,0,0,Math.PI*2);ctx.fill();

  // 龙尾 - 粗棘尾
  ctx.fillStyle=cfg.body;
  ctx.beginPath();
  ctx.moveTo(bx+17,by-4);
  ctx.quadraticCurveTo(bx+26,by-3+wag,bx+24,by+4);
  ctx.closePath();ctx.fill();
  ctx.strokeStyle=cfg.dark;ctx.lineWidth=1;ctx.stroke();
  for(var i=0;i<4;i++){
    ctx.fillStyle='#FF8A65';
    ctx.beginPath();
    ctx.moveTo(bx+17+i*3,by-4-i*2);
    ctx.lineTo(bx+19+i*3,by-11-i*2);
    ctx.lineTo(bx+21+i*3,by-4-i*2);
    ctx.closePath();ctx.fill();
  }

  // 后腿
  ctx.fillStyle=cfg.dark;
  petRoundRect(ctx,bx+8+bl*0.3,by+10+bl*0.3,6,11+Math.max(0,bl*0.3),2.5);ctx.fill();
  // 前腿
  petRoundRect(ctx,bx-8+fl*0.3,by+10+fl*0.3,6,11+Math.max(0,fl*0.3),2.5);ctx.fill();

  // 身体
  petEllipse(ctx,bx,by,17,13,cfg.body,cfg.dark);
  petEllipse(ctx,bx-1,by+1,9,7,cfg.belly);

  // 翅膀
  ctx.fillStyle='#A5D6A7';ctx.globalAlpha=0.5;
  ctx.beginPath();
  ctx.moveTo(bx-9,by-4);ctx.quadraticCurveTo(bx-20,by-18,bx-14,by-20);
  ctx.quadraticCurveTo(bx-16,by-8,bx-9,by-4);ctx.closePath();ctx.fill();
  ctx.beginPath();
  ctx.moveTo(bx+9,by-4);ctx.quadraticCurveTo(bx+20,by-18,bx+14,by-20);
  ctx.quadraticCurveTo(bx+16,by-8,bx+9,by-4);ctx.closePath();ctx.fill();
  ctx.globalAlpha=1;

  // 头部
  var hy=by-23;
  petEllipse(ctx,bx,hy,15,14,cfg.head,cfg.dark);

  // 龙角
  ctx.fillStyle=cfg.ear;
  ctx.beginPath();
  ctx.moveTo(bx-11,hy-8);ctx.quadraticCurveTo(bx-16,hy-24,bx-10,hy-26);
  ctx.quadraticCurveTo(bx-12,hy-18,bx-7,hy-12);ctx.closePath();ctx.fill();
  ctx.strokeStyle=cfg.dark;ctx.lineWidth=1;ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(bx+11,hy-8);ctx.quadraticCurveTo(bx+16,hy-24,bx+10,hy-26);
  ctx.quadraticCurveTo(bx+12,hy-18,bx+7,hy-12);ctx.closePath();ctx.fill();
  ctx.stroke();

  // 眼睛 - 稍锐利
  var eyeY=hy+1;
  if(!p.isBlinking){
    ctx.fillStyle='white';
    ctx.beginPath();ctx.ellipse(bx-6,eyeY,5,5.5,0,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(bx+6,eyeY,5,5.5,0,0,Math.PI*2);ctx.fill();
    // 红色虹膜
    ctx.fillStyle='#EF5350';
    ctx.beginPath();ctx.arc(bx-5,eyeY+1,3.5,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(bx+7,eyeY+1,3.5,0,Math.PI*2);ctx.fill();
    // 竖瞳
    ctx.fillStyle='#333';
    ctx.beginPath();ctx.ellipse(bx-5.5,eyeY,1.2,5,0,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(bx+6.5,eyeY,1.2,5,0,0,Math.PI*2);ctx.fill();
    // 高光
    ctx.fillStyle='white';
    ctx.beginPath();ctx.arc(bx-4,eyeY-2,1.5,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(bx+8,eyeY-2,1.5,0,Math.PI*2);ctx.fill();
    // 眉骨
    ctx.strokeStyle=cfg.dark;ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(bx-10,eyeY-5);ctx.lineTo(bx-4,eyeY-6);ctx.stroke();
    ctx.beginPath();ctx.moveTo(bx+10,eyeY-5);ctx.lineTo(bx+4,eyeY-6);ctx.stroke();
  }else{
    ctx.strokeStyle=cfg.dark;ctx.lineWidth=2;
    ctx.beginPath();ctx.arc(bx-6,eyeY+1,4.5,0.1,Math.PI-0.1);ctx.stroke();
    ctx.beginPath();ctx.arc(bx+6,eyeY+1,4.5,0.1,Math.PI-0.1);ctx.stroke();
  }

  // 鼻子
  ctx.fillStyle='#FF8A80';
  ctx.beginPath();ctx.arc(bx-2,hy+8,1.5,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(bx+2,hy+8,1.5,0,Math.PI*2);ctx.fill();

  // 嘴巴
  ctx.strokeStyle=cfg.dark;ctx.lineWidth=1.2;
  ctx.beginPath();ctx.arc(bx,hy+12,5,0.1,Math.PI-0.1);ctx.stroke();
  // 小尖牙
  ctx.fillStyle='white';
  ctx.beginPath();ctx.moveTo(bx-4,hy+12);ctx.lineTo(bx-3,hy+15);ctx.lineTo(bx-1,hy+12);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(bx+4,hy+12);ctx.lineTo(bx+3,hy+15);ctx.lineTo(bx+1,hy+12);ctx.closePath();ctx.fill();

  // 腮红
  ctx.fillStyle='rgba(255,100,100,0.15)';
  ctx.beginPath();ctx.ellipse(bx-12,hy+7,4,3,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(bx+12,hy+7,4,3,0,0,Math.PI*2);ctx.fill();

  // 背棘
  ctx.fillStyle='#FF8A65';
  for(var s=0;s<3;s++){
    ctx.beginPath();
    ctx.moveTo(bx-12+s*4,by-14+s*2);
    ctx.lineTo(bx-11+s*4,by-19+s*2);
    ctx.lineTo(bx-9+s*4,by-14+s*2);
    ctx.closePath();ctx.fill();
  }
}

/* ===== 精灵 ===== */
function petDrawSpirit(ctx,cfg,bx,by,ts,p){
  var wag=Math.sin(p.tailPhase)*2;
  var glow=(0.5+Math.sin(ts/400)*0.2);
  var fb=p.action==='happy'?Math.abs(Math.sin(Date.now()/60))*8:0;
  var my=by+6-fb;

  // 发光
  ctx.save();
  ctx.shadowColor='rgba(206,147,216,'+(0.3*glow)+')';
  ctx.shadowBlur=18*glow;

  // 阴影
  ctx.shadowBlur=0;
  ctx.fillStyle='rgba(0,0,0,0.06)';
  ctx.beginPath();ctx.ellipse(bx,83,14,4,0,0,Math.PI*2);ctx.fill();

  // 精灵身体 - 水滴形
  ctx.shadowBlur=18*glow;
  ctx.fillStyle=cfg.body;
  ctx.beginPath();
  ctx.moveTo(bx,my-28);
  ctx.quadraticCurveTo(bx+16,my-22,bx+16,my-10);
  ctx.quadraticCurveTo(bx+16,my+6,bx,my+14);
  ctx.quadraticCurveTo(bx-16,my+6,bx-16,my-10);
  ctx.quadraticCurveTo(bx-16,my-22,bx,my-28);
  ctx.closePath();ctx.fill();
  ctx.strokeStyle=cfg.dark;ctx.lineWidth=1.2;ctx.globalAlpha=0.4;ctx.stroke();
  ctx.globalAlpha=1;
  ctx.restore();

  // 底部飘尾
  ctx.strokeStyle=cfg.dark;ctx.lineWidth=2;ctx.lineCap='round';
  ctx.globalAlpha=0.3+Math.sin(ts/600)*0.1;
  ctx.beginPath();ctx.moveTo(bx-6,my+14);ctx.quadraticCurveTo(bx-10,my+20+wag,bx-8,my+26+wag*1.5);ctx.stroke();
  ctx.beginPath();ctx.moveTo(bx+6,my+14);ctx.quadraticCurveTo(bx+10,my+20+wag,bx+8,my+26+wag*1.5);ctx.stroke();
  ctx.beginPath();ctx.moveTo(bx,my+14);ctx.quadraticCurveTo(bx,my+22+wag,bx,my+28+wag);ctx.stroke();
  ctx.globalAlpha=1;

  // 星星眼睛
  var eyeY=my-12;
  var starBright=0.7+Math.sin(ts/500)*0.3;
  ctx.fillStyle='rgba(255,255,255,'+starBright+')';
  ctx.shadowColor='rgba(255,255,255,0.5)';ctx.shadowBlur=8;
  // 左眼星星
  ctx.beginPath();
  for(var si=0;si<5;si++){
    var a=Math.PI*2/5*si-Math.PI/2;
    var px=bx-6+Math.cos(a)*5;
    var py=eyeY+Math.sin(a)*5;
    if(si===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
    a+=Math.PI*2/10;
    px=bx-6+Math.cos(a)*2.5;
    py=eyeY+Math.sin(a)*2.5;
    ctx.lineTo(px,py);
  }
  ctx.closePath();ctx.fill();
  // 右眼星星
  ctx.beginPath();
  for(var si=0;si<5;si++){
    var a=Math.PI*2/5*si-Math.PI/2;
    var px=bx+8+Math.cos(a)*5;
    var py=eyeY+Math.sin(a)*5;
    if(si===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
    a+=Math.PI*2/10;
    px=bx+8+Math.cos(a)*2.5;
    py=eyeY+Math.sin(a)*2.5;
    ctx.lineTo(px,py);
  }
  ctx.closePath();ctx.fill();
  ctx.shadowBlur=0;

  // 瞳孔（小亮点）
  ctx.fillStyle='#fff';
  ctx.beginPath();ctx.arc(bx-5,eyeY-1.5,1.5,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(bx+9,eyeY-1.5,1.5,0,Math.PI*2);ctx.fill();

  // 微笑
  ctx.strokeStyle=cfg.dark;ctx.lineWidth=1.2;ctx.globalAlpha=0.4;
  ctx.beginPath();ctx.arc(bx+1,my-3,4,0.2,Math.PI-0.2);ctx.stroke();
  ctx.globalAlpha=1;

  // 腮红
  ctx.fillStyle='rgba(255,200,255,0.25)';
  ctx.beginPath();ctx.ellipse(bx-11,my-5,3.5,2.5,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(bx+13,my-5,3.5,2.5,0,0,Math.PI*2);ctx.fill();

  // 小星星
  for(var i=0;i<4;i++){
    var angle=ts/1200+i*1.57;
    var dist=16+Math.sin(ts/900+i)*5;
    var px=bx+Math.cos(angle)*dist;
    var py=my-12+Math.sin(angle)*dist*0.35;
    var sa=0.2+Math.sin(ts/700+i*1.5)*0.15;
    ctx.fillStyle='rgba(255,255,255,'+sa+')';
    var s=1.5+Math.sin(ts/600+i*2)*0.8;
    ctx.beginPath();
    ctx.moveTo(px,py-s);ctx.lineTo(px+s*0.3,py-s*0.3);
    ctx.lineTo(px+s,py);ctx.lineTo(px+s*0.3,py+s*0.3);
    ctx.lineTo(px,py+s);ctx.lineTo(px-s*0.3,py+s*0.3);
    ctx.lineTo(px-s,py);ctx.lineTo(px-s*0.3,py-s*0.3);
    ctx.closePath();ctx.fill();
  }
}

/* 触发开心动画 */
function petTriggerHappy(){
  PA.action='happy';
  PA.actionEnd=Date.now()+2000;
  PA.idleTimer=0;
}
