<!--
  Sync Impact Report
  ==================
  Version change: 0.0.0 (template) → 1.0.0 (initial ratification)
  Modified principles: N/A (first real constitution)
  Added sections:
    - Core Principles (5 principles)
    - 项目约束 (Project Constraints)
    - 开发工作流 (Development Workflow)
    - Governance
  Removed sections: N/A
  Templates requiring updates:
    - .specify/templates/plan-template.md ✅ no changes needed (Constitution Check gates are dynamically filled)
    - .specify/templates/spec-template.md ✅ no changes needed (no constitution-specific references)
    - .specify/templates/tasks-template.md ✅ no changes needed (no constitution-specific references)
    - .specify/templates/checklist-template.md ✅ no changes needed (no constitution-specific references)
  Follow-up TODOs: none
-->

# 动物数学岛 (Animal Math Island) 项目宪章

## 核心原则

### I. 零依赖优先 (Zero-Dependency First)

本游戏 MUST 通过在浏览器中直接打开 `index.html` 运行，不依赖任何构建工具、框架、包管理器或外部 CDN 资源。

**规则**:
- 禁止引入 npm 包、webpack、vite 等构建工具
- 禁止引用外部 CDN 的 CSS/JS/字体资源
- 所有代码 MUST 为纯 HTML + CSS + JavaScript (ES5/ES6)
- Web Audio API 和 localStorage 是唯一允许的浏览器 API 依赖

**理由**: 目标用户是 4-6 岁儿童的家长，项目 MUST 做到"下载即用"，零配置门槛。

### II. 儿童优先设计 (Child-First Design)

所有 UI 和交互设计 MUST 以幼儿园中大班儿童（4-6 岁）为核心用户。

**规则**:
- 触摸目标 MUST 不小于 44x44px（小手可操作）
- 按钮和文字 MUST 大而清晰，颜色鲜艳但不刺眼
- 界面文字 MUST 使用学龄前儿童能识别的简单汉字
- 反馈 MUST 即时且积极：答对立即播放音效+动画，答错温和鼓励
- 禁止出现惩罚性、负面或吓人的视觉/音效元素

**理由**: 4-6 岁儿童的认知和精细运动能力有限，设计须以此为前提。

### III. 离线完整 (Full Offline Capability)

游戏 MUST 在首次加载后完全离线运行，所有数据存储于用户本地。

**规则**:
- 所有游戏状态 MUST 仅通过 localStorage 持久化
- 禁止向任何外部服务器发送数据（无埋点、无分析、无遥测）
- 游玩过程中 MUST 不依赖任何网络请求
- 家长设置入口可存在，但不强制网络

**理由**: 保护儿童隐私，确保在任何网络环境下均可游玩。

### IV. 渐进增强 (Progressive Enhancement)

核心玩法 MUST 在基础浏览器上正常工作，高级特性优雅降级。

**规则**:
- 题目生成、答题判断、积分系统 MUST 在不支持 Web Audio API 的浏览器上正常工作
- CSS 动画/特效丢失时不影响功能完整性
- 语音朗读功能降级时 MUST 静默回退（不弹错误提示）
- 兼容目标：Chrome、Firefox、Safari 近两个大版本，Android WebView

**理由**: 目标用户设备多样（旧手机、平板、非 Chrome 浏览器），不能因技术特性丢失核心体验。

### V. 代码简洁 (Simplicity & YAGNI)

项目结构 MUST 保持扁平简单，拒绝过度工程。

**规则**:
- 代码文件数量 SHOULD 保持在个位数（当前: index.html, style.css, game-data.js, game.js, pet.js）
- 函数 SHOULD 短小专注（单个职责）
- 禁止为"将来可能需要"添加抽象层、工具函数或配置项
- 三行重复代码优于一个过早抽象
- 禁止添加半成品实现或功能开关
- 代码注释仅在 WHY 非显而易见时添加；禁止描述 WHAT（好的命名已经做了）

**理由**: 这是一个单人维护的家庭项目，复杂性是最主要的维护成本。

## 项目约束

### 技术栈

- **语言**: HTML5 + CSS3 + JavaScript (ES5/ES6)
- **存储**: localStorage（浏览器本地存储）
- **音频**: Web Audio API（合成音效，无外部音频文件）
- **渲染**: DOM-based（无 Canvas/WebGL 依赖）
- **字体**: 系统默认中文字体（无 Web Font 依赖）
- **服务器**: 无（纯静态文件）

### 文件结构

```
kid-math-game/
├── index.html          # HTML 骨架 + DOM 结构
├── style.css           # 全部样式 + CSS 动画 + 响应式适配
├── game-data.js        # 纯数据定义（常量、配置、动物档案等）
├── game.js             # 游戏引擎（音效、存档、题目、UI 逻辑）
├── pet.js              # 宠物子系统（可选模块）
├── README.md           # 项目说明
└── TODO.md             # 开发进度跟踪
```

新增文件须评估是否真的必要：能否合并到现有文件？是否是独立关注点？

## 开发工作流

### 提交规范

- 提交信息 MUST 使用中文 + emoji 前缀（与现有历史保持一致）
- 格式: `<emoji> <type>: <简短描述>`
- 示例: `✨ feat: Canvas 宠物绘制系统` / `🐛 fix: 安卓非 Chrome 浏览器兼容性`

### 代码审查要点

1. 是否引入外部依赖？（原则 I 禁止）
2. UI 元素是否对 4-6 岁儿童可用？（原则 II）
3. 是否有网络请求或数据外传？（原则 III 禁止）
4. 是否在不支持的浏览器上会崩溃？（原则 IV）
5. 是否添加了不必要的抽象？（原则 V 禁止）

### 测试方法

- 由于项目零依赖、纯浏览器运行，测试方式为：在浏览器中打开 `index.html`，手动验证功能
- 可用 Node.js `new Function()` 语法检查 JS 文件无语法错误
- 题目生成算法可通过脚本批量验证（见 `findings.md` 中的测试记录）

## Governance

本宪章是项目的最高指导文件。所有代码变更 MUST 符合上述五项核心原则。

**修订流程**:
1. 提出修订建议并说明理由
2. 在 PR 中标注宪章影响
3. 更新本文件版本号和修订日期
4. 同步更新受影响的模板和文档

**版本策略**:
- MAJOR: 删除或重新定义核心原则
- MINOR: 新增原则或实质性扩展指导
- PATCH: 措辞澄清、错字修正、非语义性调整

**合规审查**: 每次代码审查 MUST 验证变更是否违反任何原则。复杂度的引入 MUST 有充分理由。

**Version**: 1.0.0 | **Ratified**: 2026-05-26 | **Last Amended**: 2026-05-26
