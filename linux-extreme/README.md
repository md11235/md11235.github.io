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
