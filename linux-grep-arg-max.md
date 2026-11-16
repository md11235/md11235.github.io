---
layout: default
title: "Linux 命令行实验：grep 的参数为什么会超长"
description: "用长文件名复现 Argument list too long，理解通配符展开和 execve 的参数限制，再用 find 分批搜索。"
---

# Linux 命令行实验：grep 的参数为什么会超长

一条很短的命令 `grep -l -- demo-match ./*`，为什么会报 `Argument list too long`？这个实验从通配符展开开始，追踪这一错误是在哪一步发生的。

## 复现实验

[下载 grep-argmax-demo.sh]({{ '/assets/downloads/grep-argmax-demo.sh' | relative_url }})，在 Linux 终端运行：

```sh
sh grep-argmax-demo.sh
```

脚本在 `/tmp` 下创建一个独立的临时目录，读取 `getconf ARG_MAX`，按上限计算需要创建多少个文件。每个文件的名字长 240 字节，内容只有一行 `demo-match`。在一台 Linux 测试机上，输出的关键部分如下：

```text
ARG_MAX: 2097152 bytes
Files: 8631
File arguments alone: 2097333 bytes (including NUL terminators)
Running: grep -l -- demo-match ./*
```

随后 shell 报告 `grep: Argument list too long`，脚本以非零状态退出。文件数量随本机的 `ARG_MAX` 变化。

## 参数在哪里变长

Shell 展开 `./*` 后，每个路径独占一个参数。每个参数占 243 字节，包括 `./` 的 2 字节、文件名的 240 字节和字符串末尾的 NUL 字节。上例中，仅文件参数就需要 `8631 × 243 = 2097333` 字节，已经超过 `ARG_MAX`。启动外部程序时，传入的环境也会占用空间。

Shell 尝试通过 `execve(2)` 启动 `grep`，内核返回 `E2BIG`。此时 `grep` 尚未开始读取任何文件。要观察这一点，可以先对其中一个文件运行同样的搜索，确认单个长文件名可以正常传入。

## 用 find 分批搜索

进入脚本输出的 `Demo directory`，再运行：

```sh
find . -maxdepth 1 -type f -exec grep -l -- demo-match {} +
```

`find` 自己遍历目录，并按参数容量分批调用 `grep`。每批中的文件名仍各占一个参数，因此名字中的空格也不会被拆开。实验结束后，执行脚本输出的 `Cleanup:` 后面的命令即可删除临时目录。

参考 [Linux execve(2) 手册](https://man7.org/linux/man-pages/man2/execve.2.html)。
