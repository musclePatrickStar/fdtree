# fdtree — 工作区文件树 + 实时红绿 Diff（DSH web 插件）

DeepSeek Harness（dsh web）静态插件：在界面右侧提供**工作区文件目录树**，点开文件后以**真嵌入布局**展示内容与**实时红绿 Diff**（git 模式对比 HEAD，无 git 时对比会话基线），并带 22 种语言的语法高亮。

## 功能

- 文件树（默认只显示紧凑树列，点文件展开内容区）
- 多标签打开文件，内容/Diff 整合为单一视图：🟥 删除行、🟩 新增行、行号、`+N −N` 统计
- **git 模式**：与 `HEAD` 对比（git 原生 xdiff），目录树徽标实时显示改动/未跟踪/删除；`git commit` 后差异自动归零
- **基线模式**（无 git 仓库）：与打开时快照对比，支持「📌 设基线」
- 语法高亮：JS/TS、Python、JSON、Markdown、HTML、CSS、YAML、Shell、C/C++/C#/Java、Go、Rust、PHP、Ruby、Swift、Kotlin、SQL、PowerShell、Lua、Dockerfile、Makefile、.env
- 大文件优化：`FsVersion` 变更检测免重复读盘、大文件自动降载渲染

## 安装（被他人 harness 装载）

**方式一：本地/私有仓库（git URL 或 file 路径）**

```bash
# 在目标机器的 DSH web profile 中安装（自动 pnpm 安装 + 注册）
dsh plugin --profile web add "https://github.com/<owner>/<repo>.git"

# 或本地路径
dsh plugin --profile web add "file:/path/to/fdtree"
```

**方式二：手动编辑**

1. 在 `$DSH_HOME/profiles/web/package.json` 的 `dependencies` 加一行：`"fdtree": "<git-url-or-version>"`；
2. 在 `dsh.profile.bundles` 数组末尾追加 `"fdtree"`；
3. 在 `$DSH_HOME/profiles/web` 下执行 `pnpm install`；
4. 重启 dsh web（`dsh web`）。左侧栏底部出现「🗂 文件树」按钮，右侧自动显示文件树面板。

> 插件包结构遵循 DSH 插件规范：`package.json` 的 `dsh.bundle.patch` + `dsh.client`、`cordis.patch.yml` 补丁插入、`lib/index.js` 宿主端、`client/client.js` 客户端 bundle（`__ModuleLoader__` 格式）。

## 卸载

```bash
dsh plugin --profile web remove fdtree
```

## 开发说明

- 宿主端：`lib/index.js`（ESM，Cordis 插件，经 `webServer` 注册 `/fdtree/rpc` HTTP JSON-RPC）
- 客户端：`client/client.js`（手写 `__ModuleLoader__` bundle，同源 `fetch` 调用宿主 RPC）
- 本仓库根目录同时是插件包根目录；`src/`、`data/`、`Dockerfile` 等为演示文件。

## License

MIT
