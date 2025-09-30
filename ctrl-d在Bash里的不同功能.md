---
tags:
  - "#kb/Bash"
title: "`ctrl-d`在Bash里的不同功能"
---
在 Bash 里，**ctrl-d** 并不是只有一个用途——它的行为完全取决于你**在什么时候、什么位置**按下它。  
可以把它当成 *“文件结束”（EOF）字符*，shell（或任何从标准输入读取的程序）会根据当前上下文做出不同反应。

1. 空命令行 ➜ **关闭 shell**  
   如果光标所在行没有任何内容，ctrl-d 会把 EOF 发给登录 Bash，Bash 视其为“注销”并直接退出。  
   效果等同于输入 `exit` 或 `logout`。

2. 非空命令行 ➜ **删除光标下的字符**  
   当你正在编辑命令时，ctrl-d 相当于 *“Delete”* 键：删掉光标所在位置的字符。  
   （如果光标已在行尾，则什么都不发生。）

3. 在读取标准输入的程序里 ➜ **表示输入结束**  
   - `cat > file` ➜ ctrl-d 告诉 `cat` 输入结束，文件被关闭。  
   - `python3` 交互环境 ➜ ctrl-d 退出解释器。  
   - `mail`、`bc`、`ftp` 等 ➜ ctrl-d 结束交互会话。  
   这些程序收到“EOF”后，会按各自逻辑终止、关闭文件或返回上层调用者。

4. 在 `read` 或 here-document 中 ➜ **终止数据流**  
   ```bash
   while read line; do echo $line; done
   ```
   逐行输入后，按 ctrl-d 即可结束；循环随之终止。  
   here-doc 同理：
```bash
   cat <<EOF
   ...
   EOF   # 也可以直接按 ctrl-d 代替手动输入“EOF”
```

5. 在子 shell 或脚本里 ➜ **只退出当前环境**  
   如果你处在 `bash -l` 子 shell、`su - user` 会话，或被 `bash` 执行的脚本中，ctrl-d 仅退出**这一层**，回到父 shell。

6. 不小心连按两下 ➜ **立刻注销**  
   因为空行状态下一次 ctrl-d 就会注销，新手常因着急再按一下，结果 SSH 会话瞬间断开——著名的“新手惊喜”。

记住：ctrl-d **不是**像 ctrl-c（SIGINT）或 ctrl-z（SIGTSTP）那样的信号；它只是 ASCII 的 EOF 字符（0x04），由当前读取者解释为“没有更多数据”。