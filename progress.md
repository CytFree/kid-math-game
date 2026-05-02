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

## 测试结果
| 测试 | 输入 | 预期结果 | 实际结果 | 状态 |
|------|------|---------|---------|------|
| genQ 1260题 | 6动物×7级×30次 | 2个数、≤10、正确op | 1260/1260通过 | ✅ |
| game-data.js模板 | 检查所有TPL | 无{c}、无parts | 全部通过 | ✅ |
| 语法验证 | game-data.js+game.js | 无语法错误 | 通过 | ✅ |
