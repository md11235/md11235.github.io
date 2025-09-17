---  
title: 批量处理文件名带有特殊字符的文件
layout: post  
date: 2025-09-17
categories:  
- technology  
- os
- Linux
- Bash
---
# 场景：带有特殊字符的文件名

对于电脑用户来说，要做到在文件名里不包含空格、英文引号等所谓特殊字符，需要极强的戒律。因此对于普通人来说，文件系统里有一部分文件的名字会带有空格、英文引号等特殊字符。

为了说明这个问题，有一个目录叫做 my_dir，其中包含三个文件：

``` bash
$ ls -1 my_dir/
'a b c.txt'
'd e f.txt'
'g h\'\'' i.txt'
```

# 任务：同时处理文件名包含特殊字符的多个文件

需要将上述三个txt文件合并为同一个。cat能用来做这个事情：

``` bash
cat file1.txt file2.txt file3.txt -- out.pdf
```

现在问题转变为如何把my_dir目录里的三个文件名传给 cat、从而替换file1.txt file2.txt file3.txt。

有人可能会想到手动把上面`ls`命令输出的三个文件名复制粘贴给 cat 就行。但这就落了下乘，这是因为操作系统自动化需要尽量避免人工干预操作。

# 尝试：用find命令列出所有文件名

``` bash
$ cat $(find my_dir/ -type f -name "*.txt") > /tmp/merged_file.txt
cat: my_dir/a: No such file or directory
cat: b: No such file or directory
cat: c.txt: No such file or directory
cat: my_dir/g: No such file or directory
cat: 'h\'\''': No such file or directory
cat: i.txt: No such file or directory
cat: my_dir/d: No such file or directory
cat: e: No such file or directory
cat: f.txt: No such file or directory
```

从上面的错误消息来看，cat接受的参数似乎足足有9个，跟实际的txt文件的数量也即是3个相差很大。拆解上面的 one-liner ，只执行 `find` 看输出结果：

``` bash
$ find my_dir/ -type f -name "*.txt"
my_dir/a b c.txt
my_dir/g h\' i.txt
my_dir/d e f.txt
```

`find` 确实只列出了3个文件名。因此猜测在 `find` 找到正确的文件名列表后，由 Bash执行命令替换时，发生了奇怪的事情。Bash提供了xtrace选项，用于跟踪执行复杂些的命令，比如上述组合了 `cat` 和 `find` 的 one-liner。现在在Bash里执行下面的代码开启这个选项：

``` bash
set -o xtrace
```

此时继续尝试合并txt文件的任务：

``` bash
$ cat $(find my_dir/ -type f -name "*.txt") > /tmp/merged_file.txt
++ find my_dir/ -type f -name '*.txt'
+ cat my_dir/a b c.txt my_dir/g 'h\'\''' i.txt my_dir/d e f.txt
cat: my_dir/a: No such file or directory
cat: b: No such file or directory
cat: c.txt: No such file or directory
cat: my_dir/g: No such file or directory
cat: 'h\'\''': No such file or directory
cat: i.txt: No such file or directory
cat: my_dir/d: No such file or directory
cat: e: No such file or directory
cat: f.txt: No such file or directory
```

由此可见，cat接收到find给出的文件名列表时，'my_dir/a b c.txt' 被拆分为了'my_dir/a', 'b', 'c.txt' 3个参数，分别代表了实际不存在的文件。

# 方法：避开Bash的word splitting

## 方法1

``` bash
find my_dir/ -name "*.txt" -print0 |xargs -0 -t cat
```
## 方法2

`xargs` 只会把从 stdin 获取的内容（依据空格或者空字符或其它字符）切分成若干行、然后把这些行分批次作为目标命令的最后参数。如果文件名列表并非目标命令的最后一个参数呢？比如当用 `qpdf` 命令合并多个pdf文件时，常用的调用方法是：

``` bash
qpdf --empty --pages infile1.pdf infile2.pdf infile3.pdf -- /tmp/outfile.pdf
```
这种情况又当如何处理？

``` bash
find . -type f -name '*.pdf' -printf "%p\0" | xargs -0 bash -c 'qpdf --empty --pages "$@" -- /tmp/outfile.pdf'
```
