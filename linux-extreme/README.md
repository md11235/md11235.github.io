# Linux Extreme × Limitless

Linux 操作系统极限实验专题。

- [专题首页](index.html)
- [EP001：一条命令究竟能有多长？](chapters/001-argument-extreme.html)

实验请在专用虚拟机运行；避免在生产环境执行资源极限实验。

## EP001 实测与截图（2026-11-16）

- [系列编写规范](REQUIREMENTS.md)
- [终端模拟器截图（SVG）](artifacts/ep001/terminal.svg)
- [原始输出](artifacts/ep001/output.txt) / [结果摘要](artifacts/ep001/result-summary.txt)
- [截图生成器](tools/render-terminal-shot.py)：用真实日志生成 PNG/SVG，需要 Python 3 和 Pillow。

在隔离 Linux 环境运行 `bash scripts/ep001.sh 12000 180`，保存输出后执行：

```bash
python3 tools/render-terminal-shot.py artifacts/ep001/output.txt artifacts/ep001/terminal.png artifacts/ep001/terminal.svg
```

本次实测：Linux 6.18.57、ARG_MAX=2097152；12,000 个 180 字符文件名触发 grep 的 E2BIG（Shell 状态 126）；find 分批执行时 grep 无匹配返回 1。截图为日志可视化排版而非直接屏幕捕获。

## EP002 稀疏文件（2026-11-17）

- [文章：1 TiB 文件为什么只占 8 KiB？](chapters/002-sparse-file.html)
- [脚本](scripts/ep002.sh)
- [真实运行输出](artifacts/ep002/output.txt)、[结果摘要](artifacts/ep002/result-summary.txt)
- [终端模拟器 SVG 截图](artifacts/ep002/terminal.svg)

在 Linux 测试环境运行：

```sh
bash scripts/ep002.sh 2>&1 | tee ep002-output.txt
```

实测环境 Linux 6.18.57 / overlayfs：truncate 创建逻辑长度 1 TiB 的文件，初始 st_blocks 为 0；首尾各写入 4 KiB 后，stat 报告 8192 字节已分配空间；读回 A、零和 Z；脚本自动清理临时目录。SVG 为真实日志的程序化排版，不是直接终端屏幕截图。PNG 图片随本地实验材料包提供。

## EP002 网页交互实验室（2026-11-18）

- [EP002 页面](chapters/002-sparse-file.html) 现内嵌 [v86 Linux Lab](labs/ep002-v86.html)。
- 在浏览器中按需启动真实精简 Linux（Buildroot / BusyBox），可自行输入命令，并可触发 64 MiB 稀疏文件实验。浏览器 VM 的结果与原 Linux 1 TiB 实测数据独立。
- 首次启动下载来自 v86 项目的外部 WebAssembly、BIOS 和 Linux 镜像文件；部署在静态 GitHub Pages，无须维护后端。外部资源可用性、CORS、浏览器与移动设备性能可能影响启动。
- 已删除文章正文中的截图制作过程介绍。实施规范仍保留证据溯源与不可伪造的要求。
- 当前实验室属于 beta，需要在真实用户浏览器中完成交互端到端验证；不能仅凭 GitHub 文件存在判断运行成功。

## EP002 五阶段交互实验（2026-11-18）

网页内嵌 v86 Linux Lab，交互流程为：

1. 点击启动并下载 v86 / Buildroot 资源。
2. 识别串口 shell 提示符，向真实 Linux 发送探测命令；只有收到就绪标记才启用实验按钮。
3. 一键执行 64 MiB 稀疏文件实验，在专用 `/tmp/lx_ep002` 目录中自动清理。
4. 使用独立开始/结束标记从串口输出提取实验结果，支持超时和错误提示。
5. 验证逻辑长度、初始块分配、首字节、空洞字节、末字节及写后块分配趋势，展示 Linux 返回值、预期值和逐项判断；可保存结果文本。

状态机、串口采集和 6 项比对逻辑已通过模拟串口事件的 JS 测试。**这不等于实际浏览器内 Linux 已成功启动**；仍须使用真实浏览器与外部镜像完成端到端测试。网页脚本、镜像、WASM 与 BIOS 目前由 v86 项目外站提供，可能受到跨域与网络可用性影响。不同文件系统的分配块数可不同，比较只要求增长，不应硬编码为 8 KiB。

## EP002 更正与 v86 资源加载修复（2026-11-18）

- 在 `artifacts/ep002/output.txt` 和 `terminal.svg` 中，将操作说明性的 `$ read/write/check ...` 改为 `# ...`，避免把自然语言冒充为 Shell 命令。
- 文章增加实际可运行的 `dd if=one-tib.bin bs=1 skip=1073741824 count=16 status=none | od -An -tx1` 命令及参数解释。
- 浏览器实验室将 JS 与 WASM 固定为 npm v86 `0.5.472`，改由 jsDelivr 加载；先使用浏览器 `fetch` 获取 WASM，检查 HTTP 状态/基本尺寸并编译，再通过 v86 的 `wasm_fn` 接口交给模拟器。这样可展示更准确的资源加载错误，而不依赖 copy.sh 对跨源 WASM 请求的支持。
- 实验室采用 `tail -c 1` 读取末字节，用块单位读取空洞，避免 64 MiB 的逐字节 `dd skip` 导致执行时间过长。
- **验证范围**：GitHub 仓库写入和 JS 语法可检查；v86 在用户浏览器的完整启动、远程 BIOS/镜像跨域行为仍需真实浏览器验证。若网络阻止 jsDelivr，仍会报错，不宣称完全离线。

## EP002 v86 完全同源依赖（2026-11-18）

为了避开浏览器跨源加载 BIOS 的 CORS 限制，已使用 GitHub Actions 下载并将运行需要的 5 个文件提交到 `linux-extreme/vendor/v86/`：

- `libv86.js`、`v86.wasm`：v86 npm 包 `0.5.472`
- `seabios.bin`、`vgabios.bin`：上游 v86 项目 BIOS 文件
- `buildroot-bzimage68.bin`：上游 v86 Buildroot Linux 镜像
- `SHA256SUMS`：上传时生成的内容散列校验清单

[自动下载工作流](../.github/workflows/vendor-v86.yml) 含文件大小和 WASM/Linux bzImage 签名检查；上传成功对应提交 `e0aa30ce`。实验室现在使用相对路径 `../vendor/v86/`，不再向 jsDelivr、copy.sh 或 i.copy.sh 请求这些运行依赖。GitHub Pages 静态资源均与实验室同源。

**注意**：GitHub 仓库已验证所有文件被提交；目前线上站点和真实浏览器内的 Linux 启动仍需验证。文件格式完整不等于镜像一定可成功启动，也不能保证所有浏览器支持。

## EP002：修复 BusyBox 缺少命令造成的 0/6（2026-11-18）

用户的 v86 Linux 已成功启动，但原浏览器脚本将 `truncate/stat/od/dd/head/tail` 全部作为前置条件，部分精简 BusyBox 镜像不包含 `truncate` 或 `stat`，导致 `required BusyBox commands missing` 并跳过全部验证。

修复后：
- 使用 `dd if=/dev/zero of=sparse.bin bs=4096 count=0 seek=16384` 安全创建逻辑 64 MiB 的稀疏文件，不进行 64 MiB 实际写入。
- 使用 `wc -c` 获取文件逻辑长度，并以 `du -k` 取得分配量（KiB），不再依赖 `stat`。
- 用 `dd | od -An -tx1` 验证首字节、空洞以及文件末字节；相应跳过操作只依赖 `dd` 的 seek/skip。
- 自动输出 `LX_GUEST_TOOLS` 检测明细，便于诊断缺失的程序；若缺少 `du`，标记 `NA` 而不是直接取消其他检查。
- 本地使用 BusyBox ash 验证核心命令，参考输出为：`67108864, 0 KiB, 8 KiB, 41, 00, 5a`。

仍需在实际网页中验证 Buildroot 运行与结果采集；不同文件系统可能报告不同的 `du` 分配量。
