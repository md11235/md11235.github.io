# Linux Extreme × Limitless — 系列实施规范
版本：1.0 · 2026-11-16。仓库：md11235/md11235.github.io；路径：linux-extreme/。

## 项目定位
Extreme：探索 Linux 的资源、规模、性能、并发、时间与空间极限。Limitless：利用 Linux 的接口和机制突破常规用法。计划 12 条路线、48 个挑战；面向初学者到系统内核学习者。

## 12 条路线
1. 命令参数：ARG_MAX、E2BIG、execve、环境变量
2. 文件系统：稀疏文件、inode、链接和路径
3. 进程：fork、僵尸进程、PID、调度
4. 内存：虚拟内存、overcommit、COW、OOM
5. Shell：FD、管道、tee、进程替换
6. 网络：namespace、veth、bridge、NAT、DNS
7. 时间：单调时钟、time namespace、定时器
8. CPU：亲和性、上下文切换、缓存与 false sharing
9. 程序执行：ELF、libc、动态链接、memfd
10. 隔离安全：namespace、cgroup、seccomp
11. 内核观察：strace、perf、ftrace、eBPF
12. 自制系统：QEMU、KVM、BusyBox、initramfs

## 每篇文章六段式
The Challenge → The Experiment → The Breaking Point → Under the Hood → Beyond the Limit → The Next Question。每篇要提出可验证问题、完整实验过程、临界现象、内核解释、超限策略和下一篇的问题。

## 必须交付
- chapters/NNN-slug.html：文章与可视化
- scripts/epNNN.sh（或等价代码）：可复现、带安全边界、自动清理
- artifacts/epNNN/output.txt：真实 stdout/stderr 与退出码
- artifacts/epNNN/result-summary.txt：实际运行环境、观测和解释
- artifacts/epNNN/terminal.svg、terminal.png：终端模拟器截图
- tools/render-terminal-shot.py：程序化截图生成器
- 可选动画 demo.gif、结构示意图和可交互页面

## 真实性
必须先真实执行并存日志，再由代码渲染终端截图。不得凭空造实验结果。区分“截图是程序化渲染”与“输出来自实测”。记录内核版本、ARG_MAX 等系统限制、输入参数、退出码与测试条件。说明不同发行版/内核的差异，不泄露凭证或不必要的个人信息。

## 安全
耗尽 PID、磁盘、inode、内存、网络等极限实验必须优先在专用虚拟机中进行；设置超时、cgroup、资源配额、快照和自动清理。不要默认在生产机运行破坏性命令。

## 网站与发布
使用独立 linux-extreme/ 子目录，深色科幻统一风格、移动端适配、章节导航、可下载的原始结果、截图与脚本。所有更新增量提交 master，不覆盖已有项目与 README。提交后验证 GitHub 仓库内容及 GitHub Pages 的首页、章节、图片和资源 URL；验证失败要明确说明，不能误报上线。

## EP001 验收
12,000 个 180 字符的文件名导致 glob + grep 的 execve 失败，出现 Argument list too long；find -exec ... + 分批绕开 E2BIG，grep 返回 1 代表没有匹配。保留原始 log，截图由 log 自动生成。下一篇 EP002：稀疏文件。
