# 发现与决策

## 需求
- 代码拆分完成 ✅ — index.html 从 1799 行减至 249 行
- 所有核心功能已完成（TODO.md 100%）

## 研究发现
- 原 index.html 包含 3 个 bug：fireworks setTimeout 语法错误、ADS 数组未闭合、重复代码
- 所有 JS 已通过 Node.js `new Function()` 语法验证
- 游戏零外部依赖，纯 HTML+CSS+JS + Web Audio API

## 技术决策
| 决策 | 理由 |
|------|------|
| 不引入构建工具 | 保持可直接在浏览器打开 |
| game-data.js 用 var 全局变量 | 保持原有作用域，减少改动 |

## 遇到的问题
| 问题 | 解决方案 |
|------|---------|
| GitHub push 网络问题 | 本地已提交，需要时重试 |
| finishQ() task 模式未切回岛屿 | 添加 show('island-screen') |
| genQ() mix 模式运算符显示 + + 应为 + - | 添加 op 字段返回 |
| genQ() sc 模式数字可达 14（超10） | 硬上限为 10 |
| genQ() mix 模式结果可超 10 | 限 maxSum ≤ 10 |
| genQ() addChain/subChain/mix 用3个数 | 改为2个数 |
| XP 每题仅10，6只动物做完仅60 XP | 提高到20+combo*3，调整经验曲线 |
| finishQ() task 模式缺 saveS() | 添加 saveS() |

## 资源
- 项目结构：index.html / style.css / game-data.js / game.js
- 游戏引擎：Web Audio API / localStorage / DOM-based rendering
