/* ===== 动物 ===== */
var AN={
  cat:{name:'小橘',emoji:'🐱',area:'home',teach:'add',personality:'活泼',items:['🐟'],
    greetings:['嗨嗨！你来啦！','今天天气真好！','我有个问题想问你~','快来帮我！'],
    stories:['我买了3条小鱼🐟🐟🐟，妈妈又给了我2条🐟🐟，现在有几条呀？','我把5条鱼放在桶里，小猫偷吃了1条🐟，还剩几条？','我有2条红鱼🐠🐠，3条蓝鱼🐟🐟🐟，一共有几条鱼？'],
    done:['谢谢你！你太棒了！','哇，你好聪明！','我请你吃鱼！🐟'],
    fail:['没关系，再想想~','差一点点！','加油，你可以的！']
  },
  dog:{name:'旺财',emoji:'🐶',area:'home',teach:'sub',personality:'忠诚',items:['🦴'],
    greetings:['汪汪！你好！','我的骨头不见了...','你能帮我吗？','呜呜...'],
    stories:['我有5根骨头🦴🦴🦴🦴🦴，丢了2根🦴🦴，还剩几根？','我埋了6根骨头，挖出了3根🦴🦴🦴，地里还有几根？','我有8根骨头，分给小猫2根🦴🦴，自己还剩几根？'],
    done:['谢谢你帮我找到骨头！🦴','你真是好朋友！','汪汪！太感谢了！'],
    fail:['别难过，再试试~','旺财相信你！','差一点就对了！']
  },
  rabbit:{name:'跳跳',emoji:'🐰',area:'orchard',teach:'addChain',personality:'胆小',items:['🥕'],
    greetings:['咿...你好...','你、你能帮我吗？','我有点害怕...','拜托拜托~'],
    stories:['我种了2排胡萝卜🥕🥕🥕，每排3个，又种了2个🥕🥕，一共几个？','我有4个胡萝卜🥕🥕🥕🥕，朋友给了2个🥕🥕，又给了3个🥕🥕🥕，现在几个？','我摘了5个胡萝卜🥕🥕🥕🥕🥕，吃了1个🥕，又吃了2个🥕🥕，还剩几个？'],
    done:['谢谢你！我不害怕了~','你真好...','胡萝卜分你一半！🥕'],
    fail:['没、没关系...','再试一次就好...','我相信你！']
  },
  bear:{name:'团团',emoji:'🐻',area:'orchard',teach:'subChain',personality:'贪吃',items:['🍯'],
    greetings:['嗯嗯...你好...','我饿了...','帮我算算还有多少吃的？','zzz...醒醒！'],
    stories:['我有10罐蜂蜜🍯🍯🍯🍯🍯🍯🍯🍯🍯🍯，吃了3罐🍯🍯🍯，还剩几罐？','我摘了7个苹果🍎🍎🍎🍎🍎🍎🍎，吃了2个🍎🍎，又吃了1个🍎，还剩几个？','我有9块蛋糕🍰🍰🍰🍰🍰🍰🍰🍰🍰，分给朋友3块🍰🍰🍰，自己吃了2块🍰🍰，还剩几块？'],
    done:['好吃！谢谢你！🍯','你真是好帮手！','请你吃蜂蜜！'],
    fail:['吃饱了再想~','没关系，慢慢来~','团团等你！']
  },
  fox:{name:'聪聪',emoji:'🦊',area:'park',teach:'mix',personality:'聪明',items:['🍇'],
    greetings:['嘿嘿，你来啦！','我有个难题考考你~','敢挑战吗？','聪明人来了！'],
    stories:['我有5个苹果🍎🍎🍎🍎🍎，买了3个🍎🍎🍎，吃了2个🍎🍎，现在几个？','树上有8只鸟🐦🐦🐦🐦🐦🐦🐦🐦，飞走了3只🐦🐦🐦，又来了2只🐦🐦，现在几只？','我有6颗糖🍬🍬🍬🍬🍬🍬，给了朋友2颗🍬🍬，妈妈又给了3颗🍬🍬🍬，现在几颗？'],
    done:['厉害！你答对了！','聪明人配聪明题！','佩服佩服！'],
    fail:['差一点！再想想~','聪明人也会出错~','加油！']
  },
  panda:{name:'圆圆',emoji:'🐼',area:'castle',teach:'bigNum',personality:'慢吞吞',items:['🎋'],
    greetings:['嗯...你好...','我...有...问...题...','你...能...帮...我...吗...','慢...慢...来...'],
    stories:['我有15根竹子🎋🎋🎋🎋🎋🎋🎋🎋🎋🎋🎋🎋🎋🎋🎋，吃了5根🎋🎋🎋🎋🎋，还剩几根？','我种了12棵树🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳，死了2棵🌳🌳，又种了3棵🌳🌳🌳，现在几棵？','我有18个苹果🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎，给了朋友6个🍎🍎🍎🍎🍎🍎，自己吃了4个🍎🍎🍎🍎，还剩几个？'],
    done:['谢...谢...你...','你...真...棒...','请...你...吃...竹...子...'],
    fail:['没...关...系...','慢...慢...想...','我...等...你...']
  },
  dolphin:{name:'蓝蓝',emoji:'🐬',area:'beach',teach:'mix',personality:'活泼',items:['🐚'],
    greetings:['嘿！来玩水呀！','海浪带来了好多宝贝！','我捡到了漂亮的贝壳！','快来数一数！'],
    stories:['我捡了3个贝壳🐚🐚🐚，海浪又冲上来2个🐚🐚，现在有几个？','海星有5只脚⭐，被冲走了2只⭐，还剩几只脚？','我有4条小鱼🐟🐟🐟🐟，又游来了3条🐟🐟🐟，现在有几条？'],
    done:['蓝蓝好开心！和你一起玩真好！🐬','哗啦！蓝蓝溅起水花庆祝！🌊','下次还要来找我玩哟！'],
    fail:['唔...再想一想～','没关系，蓝蓝等你！','加油呀！你可以的！']
  }
};

/* ===== 等级 ===== */
var LV=[
  {l:1,t:'数学小宝宝',xp:0,areas:['home']},
  {l:2,t:'小小计算器',xp:80,areas:['home','orchard']},
  {l:3,t:'加法小能手',xp:180,areas:['home','orchard','beach']},
  {l:4,t:'数学小达人',xp:320,areas:['home','orchard','beach','park']},
  {l:5,t:'运算小天才',xp:500,areas:['home','orchard','beach','park']},
  {l:6,t:'数学大师',xp:700,areas:['home','orchard','beach','park','castle']},
  {l:7,t:'终极数学大师',xp:920,areas:['home','orchard','beach','park','castle']}
];

/* ===== 角色外观 ===== */
var ACCESSORIES=[
  {level:1,hat:'',cape:'',shoes:'',name:'初始'},
  {level:2,hat:'🎀',cape:'',shoes:'',name:'蝴蝶结'},
  {level:3,hat:'🎩',cape:'',shoes:'',name:'礼帽'},
  {level:4,hat:'👒',cape:'🧣',shoes:'',name:'遮阳帽+围巾'},
  {level:5,hat:'🎓',cape:'🧣',shoes:'👟',name:'学士帽+围巾+运动鞋'},
  {level:6,hat:'👑',cape:'🎽',shoes:'👟',name:'王冠+披风+运动鞋'},
  {level:7,hat:'👑',cape:'🔥',shoes:'✨',name:'王冠+火焰披风+闪光鞋'}
];

/* ===== 宠物 ===== */
var PT=[
  {id:'chick',name:'小黄',emoji:'🐥',bonus:'首次通关'},
  {id:'bunny',name:'雪球',emoji:'🐇',bonus:'连击+1XP'},
  {id:'foxp',name:'小火',emoji:'🦊',bonus:'难题+2XP'},
  {id:'pandap',name:'团团宝',emoji:'🐼',bonus:'学习+1XP'},
  {id:'lionp',name:'小狮',emoji:'🦁',bonus:'所有+2XP'},
  {id:'dragp',name:'闪闪宝',emoji:'🐲',bonus:'所有+3XP'},
  {id:'butterfly',name:'花花',emoji:'🦋',bonus:'收集花朵'},
  {id:'fishp',name:'泡泡',emoji:'🐠',bonus:'收集珍珠'},
  {id:'parrot',name:'小鹦',emoji:'🦜',bonus:'游乐场解锁'}
];

/* ===== 题目生成引擎 ===== */
var TPL={
  add:{mode:'add',maxSum:10,scenes:[
    {e:'🐟',s:'{n}有{a}个{e}，妈妈又给了{b}个{e}'},
    {e:'🍎',s:'树上有{a}个{e}，又长了{b}个{e}'},
    {e:'🌸',s:'开了{a}朵{e}，又开了{b}朵{e}'},
    {e:'🍬',s:'有{a}颗{e}，又放了{b}颗{e}'},
    {e:'🐱',s:'来了{a}只{e}，又来了{b}只{e}'},
    {e:'🎈',s:'有{a}个{e}，又买了{b}个{e}'},
    {e:'🍪',s:'盘子里有{a}块{e}，又放了{b}块{e}'}
  ]},
  sub:{mode:'sub',maxTotal:10,scenes:[
    {e:'🦴',s:'{n}有{a}个{e}，吃了{b}个{e}'},
    {e:'🎈',s:'有{a}个{e}，飞走了{b}个{e}'},
    {e:'🍪',s:'盘子里有{a}块{e}，被吃掉了{b}块{e}'},
    {e:'🐟',s:'有{a}条{e}，游走了{b}条{e}'},
    {e:'🍎',s:'树上有{a}个{e}，摘走了{b}个{e}'},
    {e:'🍬',s:'有{a}颗{e}，分给了朋友{b}颗{e}'}
  ]},
  addChain:{mode:'ac',maxSum:10,scenes:[
    {e:'🥕',s:'{n}有{a}个{e}，朋友又给了{b}个{e}'},
    {e:'🍎',s:'树上有{a}个{e}，又长了{b}个{e}'},
    {e:'🐟',s:'池里有{a}条{e}，又游来了{b}条{e}'}
  ]},
  subChain:{mode:'sc',scenes:[
    {e:'🍯',s:'{n}有{a}罐{e}，吃了{b}罐{e}'},
    {e:'🍪',s:'有{a}块{e}，被吃了{b}块{e}'},
    {e:'🎈',s:'有{a}个{e}，飞走了{b}个{e}'}
  ]},
  mix:{mode:'mix',scenes:[
    {e:'🍬',s:'{n}有{a}颗{e}，又买了{b}颗{e}'},
    {e:'🍎',s:'树上有{a}个{e}，又长了{b}个{e}'},
    {e:'🍬',s:'{n}有{a}颗{e}，吃了{b}颗{e}'},
    {e:'🍎',s:'树上有{a}个{e}，摘走了{b}个{e}'}
  ]},
  bigNum:{mode:'add',maxSum:10,scenes:[
    {e:'🎋',s:'{n}有{a}根{e}，又找到了{b}根{e}'},
    {e:'🍎',s:'树上有{a}个{e}，又长了{b}个{e}'},
    {e:'🐟',s:'池里有{a}条{e}，又游来了{b}条{e}'}
  ]}
};

/* ===== 冒险 ===== */
var ADS=[
  {id:'fishing',n:'小橘的钓鱼日',ic:'🐟',d:'帮小橘钓到5条鱼',ul:1,aid:'cat',tm:'add',nodes:5,boss:5},
  {id:'bones',n:'旺财的骨头寻宝',ic:'🦴',d:'帮旺财找回丢失的骨头',ul:2,aid:'dog',tm:'sub',nodes:5,boss:5},
  {id:'carrots',n:'跳跳的胡萝卜田',ic:'🥕',d:'帮跳跳种胡萝卜',ul:3,aid:'rabbit',tm:'addChain',nodes:6,boss:6},
  {id:'honey',n:'团团的蜂蜜之旅',ic:'🍯',d:'帮团团找到蜂蜜',ul:4,aid:'bear',tm:'subChain',nodes:6,boss:6},
  {id:'maze',n:'聪聪的迷宫挑战',ic:'🧩',d:'帮聪聪走出迷宫',ul:5,aid:'fox',tm:'mix',nodes:7,boss:7},
  {id:'bamboo',n:'圆圆的竹林探险',ic:'🎋',d:'帮圆圆找到最大的竹子',ul:6,aid:'panda',tm:'bigNum',nodes:7,boss:7}
];

/* ===== 故事任务 ===== */
var STORIES=[
  {id:'cat_fish',n:'小橘的小鱼失踪案',ic:'🐟',ul:2,aid:'cat',tm:'add',chapters:[
    {t:'第一章：小鱼不见了',text:'小橘着急地说："我把3条小鱼放在桶里，回来发现少了！你能帮我算算还剩几条吗？"',nums:[3,1]},
    {t:'第二章：找到一条',text:'小橘在草丛里找到了一条小鱼！现在桶里有2条，又加了1条，一共有几条？',nums:[2,1]},
    {t:'第三章：妈妈帮忙',text:'鱼妈妈游来了，又带来了3条小鱼。现在有3条，加上妈妈带来的3条，一共几条？',nums:[3,3]},
    {t:'第四章：数数看',text:'小橘开心地说："让我数数！先有2条，来了2条，又来了1条，一共几条？"',nums:[2,2,1],mode:'ac'},
    {t:'第五章：庆祝',text:'小橘请客！有8条鱼，小猫吃了2条，狗吃了1条，还剩几条请大家吃？',nums:[8,2,1],mode:'sc'}
  ]},
  {id:'dog_bone',n:'旺财的骨头大冒险',ic:'🦴',ul:3,aid:'dog',tm:'sub',chapters:[
    {t:'第一章：骨头不见了',text:'旺财哭着说："我有5根骨头，不知被谁偷走了2根！还剩几根？"',nums:[5,2]},
    {t:'第二章：找到一根',text:'旺财在树下挖到了一根骨头！原来有3根，加上这根，现在有几根？',nums:[3,1]},
    {t:'第三章：分给朋友',text:'旺财有6根骨头，分给小猫2根，自己还剩几根？',nums:[6,2]},
    {t:'第四章：又丢了',text:'旺财有5根骨头，散步丢了1根，洗澡又丢了1根，还剩几根？',nums:[5,1,1],mode:'sc'},
    {t:'第五章：宝藏',text:'旺财发现了一个宝藏！有9根骨头，给了朋友3根，又买了2根，现在有几根？',nums:[9,3,2],mode:'mix'}
  ]},
  {id:'rabbit_carrot',n:'跳跳的胡萝卜大赛',ic:'🥕',ul:4,aid:'rabbit',tm:'addChain',chapters:[
    {t:'第一章：比赛开始',text:'跳跳说："我要种好多胡萝卜！先种了2排，每排3个，再种了2个，一共几个？"',nums:[3,3,2],mode:'ac'},
    {t:'第二章：朋友帮忙',text:'好朋友来帮忙！原来有4个，朋友给了2个，又给了3个，现在有几个？',nums:[4,2,3],mode:'ac'},
    {t:'第三章：被偷吃了',text:'跳跳有9个胡萝卜，被偷吃了2个，又被吃了3个，还剩几个？',nums:[9,2,3],mode:'sc'},
    {t:'第四章：重新种',text:'跳跳重新种了3个，又种了2个，被吃了1个，现在有几个？',nums:[3,2,1],mode:'mix'},
    {t:'第五章：大丰收',text:'大丰收！有5个，朋友给了3个，又给了2个，被吃了1个，一共几个？',nums:[5,3,2,1],mode:'mix'}
  ]},
  {id:'bear_honey',n:'团团的蜂蜜保卫战',ic:'🍯',ul:5,aid:'bear',tm:'subChain',chapters:[
    {t:'第一章：蜂蜜少了',text:'团团伤心地说："我有10罐蜂蜜，被偷吃了3罐，又被吃了2罐，还剩几罐？"',nums:[10,3,2],mode:'sc'},
    {t:'第二章：找到一些',text:'团团在树洞里找到了2罐蜂蜜！原来有5罐，加上这2罐，现在有几罐？',nums:[5,2]},
    {t:'第三章：分给朋友',text:'团团有7罐蜂蜜，分给小兔2罐，分给小猫1罐，自己还剩几罐？',nums:[7,2,1],mode:'sc'},
    {t:'第四章：蜜蜂来了',text:'蜜蜂送来了3罐蜂蜜！团团有4罐，加上3罐，被吃了1罐，现在有几罐？',nums:[4,3,1],mode:'mix'},
    {t:'第五章：蜂蜜派对',text:'团团办蜂蜜派对！有8罐，用了2罐做蛋糕，用了1罐做饼干，还剩几罐？',nums:[8,2,1],mode:'sc'}
  ]}
];

/* ===== 装饰 ===== */
var DECOS=[
  {id:'flower_red',name:'红花',ic:'🌹',price:5,area:'home'},
  {id:'flower_yellow',name:'黄花',ic:'🌻',price:5,area:'home'},
  {id:'tree_pine',name:'松树',ic:'🌲',price:8,area:'home'},
  {id:'tree_palm',name:'棕榈树',ic:'🌴',price:8,area:'home'},
  {id:'mushroom',name:'蘑菇',ic:'🍄',price:6,area:'home'},
  {id:'rock',name:'石头',ic:'🪨',price:4,area:'home'},
  {id:'lantern',name:'灯笼',ic:'🏮',price:12,area:'home'},
  {id:'fountain',name:'喷泉',ic:'⛲',price:20,area:'home'},
  {id:'windmill',name:'风车',ic:'🎐',price:15,area:'home'},
  {id:'campfire',name:'篝火',ic:'🔥',price:10,area:'home'},
  {id:'balloon',name:'气球',ic:'🎈',price:8,area:'home'},
  {id:'star',name:'星星',ic:'⭐',price:12,area:'home'},
  {id:'rainbow',name:'彩虹',ic:'🌈',price:25,area:'home'},
  {id:'moon',name:'月亮',ic:'🌙',price:18,area:'home'},
  {id:'sun_decor',name:'太阳',ic:'☀️',price:15,area:'home'},
  {id:'cloud_decor',name:'云朵',ic:'☁️',price:10,area:'home'},
  {id:'butterfly',name:'蝴蝶',ic:'🦋',price:7,area:'home'},
  {id:'bird',name:'小鸟',ic:'🐦',price:9,area:'home'},
  {id:'fish',name:'小鱼',ic:'🐠',price:6,area:'home'},
  {id:'crystal',name:'水晶',ic:'💎',price:30,area:'home'}
];

