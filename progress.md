# 进度日志

## 会话：2026-05-02

### 阶段 1：代码拆分重构
- **状态：** complete
- **执行的操作：**
  - 分析了原 index.html 结构（110KB/2030行）
  - 将 CSS 迁移到 style.css（377行）
  - 将数据常量迁移到 game-data.js（229行）
  - 将游戏逻辑迁移到 game.js（1036行）
  - 修复 fireworks setTimeout 语法错误
  - 修复 ADS 数组未闭合问题
  - 删除重复的 DECOS + 装饰函数代码
  - 更新 TODO.md 和 README.md
  - 本地提交 `860b5fd`
- **创建/修改的文件：**
  - index.html（1799→249行）
  - style.css（新建，377行）
  - game-data.js（新建，229行）
  - game.js（新建，1036行）
  - TODO.md（更新）
  - README.md（更新）

### 阶段 2：Bug 修复
- **状态：** complete
- **执行的操作：**
  - Bug 1: finishQ() task 模式卡死 — 添加 saveS()+show('island-screen')+updIsland()
  - Bug 2: genQ() 数字超限和3个数 — 重写所有模式为2个数、≤10、正确运算符
    - addChain: 3个数相加 → 2个数相加
    - subChain: 3个数连减 → 2个数减法
    - mix: 混合3数 → 随机2数加减法
    - bigNum: maxSum=20 → maxSum=10
    - 修复 mix 模式可视化显示 `+ +` 错误（改为 `+` 或 `-`）
    - 修复除法!选项生成死循环（改为最多50次尝试 + 范围±5）
    - 选项从6个改为4个，grid改为2列布局
  - Bug 3: XP不合理 — 每题XP从10→20，combo加成2→3，金币3→5
  - Bug 4: 调整LV曲线 — 累积XP从[200,400,700,1100,1600,2200]改为[80,180,320,500,700,920]
- **创建/修改的文件：**
  - game-data.js（LV曲线、TPL模板全部更新）
  - game.js（genQ/finishQ/chk/nextQ 重写）
  - style.css（q-options grid 3列→2列）

### 阶段 3：自审发现 Bug  修复
- **状态：** complete
- **执行的操作：**
  - Bug 5: 装饰位置随机跳动 — renderIslandDecos 用 Math.random() 定位，改为网格布局+存储位置
  - Bug 6: 装饰tab切换崩溃 — switchDecoTab 引用不存在的元素ID，改用 class 遍历+toggle
  - Bug 7: 区域进入无效 — orchard-screen/beach-screen/park-screen/castle-screen 从未在HTML中存在，添加4个区域屏幕及样式
  - Bug 8: 课程计数翻倍 — startPrac() 和 finishQ() 都做了 S.lessons[k]++
  - Bug 9: 升级强制改伴侣 — Lv.2 无条件 S.companion='chick'，改为仅无伴侣时设置
  - 额外: placedDecos 改对象格式后渲染中的 indexOf/some 不兼容，修复 renderDecoGrid 两处调用

## 会话：2026-05-03 — 趣味性增强

### 阶段 4：答题动画 + Lv.7 分解树枝图
- **状态：** complete
- **执行的操作：**
  - 在 nextQ() 中给图标添加组标记（vi-ga/vi-gb/vi-sub），为动画做准备
  - 新增 animateQ(q) 函数：答对时加法图标合并动画、减法图标消失动画
  - 新增 renderDecompTree(q) 函数：Lv.7 满级时用分解树枝图替代图标展示
  - 新增 CSS keyframes 动画（qMerge 800ms / qSubtract 700ms）
  - 新增分解树枝图样式（圆形节点、SVG连接线、答案徽章）
  - 延时从 1100ms 增加到 2000ms，让动画有足够时间展示
- **修改的文件：**
  - game.js（nextQ/chk/animateQ/renderDecompTree）
  - style.css（动画 keyframes + 分解树样式）

## 测试结果
| 测试 | 输入 | 预期结果 | 实际结果 | 状态 |
|------|------|---------|---------|------|
| genQ 1470题 | 7动物×7级×30次 | 2个数、≤10、正确op | 1470/1470通过 | ✅ |
| game-data.js+game.js语法 | Node.js new Function | 无语法错误 | 通过 | ✅ |
| 动画+分解树 | 浏览器验证 | 动画流畅、树图正确 | - | 🔲 |

## 会话：2026-05-03 — 宠物系统重做 + 减法0概率修复

### 阶段 5：宠物系统
- **状态：** complete
- **执行的操作：**
  - 移除旧版宠物系统所有代码（PT数据、pets/companion状态、获取逻辑、宠物小屋UI）
  - 创建独立 `pet.js` 模块，通过全局函数与 game.js 解耦
  - 全新宠物系统：Lv.2解锁 → 4选1宠物 + 取名 → 孵化 → 养成
  - 孵化系统：答对10题孵化，连击额外加成，带回岛屿时触发孵化动画
  - 养成系统：喂食(金币)、抚摸(每日3次)、玩耍(每日3次)、亲密度、饱腹度
  - 4阶段成长：蛋→幼年(+2XP)→成长期(+4XP)→完全体(+6XP,+1金币)
  - 岛屿宠物区：宠物小窝 + 心情指示器(😊🍽️💤❤️)
  - 答题宠物反馈：答对🎉答错💪动画
  - 特效系统：喂食🌟、抚摸❤️、玩耍🎾、升级✨粒子效果
  - 修复减法b=0概率过高（20.8%→9.6%）
- **创建/修改的文件：**
  - pet.js（新建，包含所有宠物逻辑和数据）
  - game-data.js（删除旧PT数据）
  - game.js（5处集成调用 + 减法概率修复）
  - index.html（宠物选择、孵化动画、互动弹窗、宠物区、通知）
  - style.css（宠物所有新样式 + HUD增强）
