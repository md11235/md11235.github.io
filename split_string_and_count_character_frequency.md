# 拆分字符串为单个字符并统计每个字符的出现次数

## 找到每一个小写字母并排序

第一个字符是空格，所以用 `tail -n "+2"` 过滤掉。


```bash
a_str="the quick brown fox jumps over the lazy dog"; echo $a_str |\grep -o . | sort | uniq|tail -n "+2"
```

## 生成从a到z的对比数据

```bash
for ch in {a..z}; do echo $ch; done
```

## 用diff工具做对比

`<(cmd arg1 arg2 ...)` 是Bash的进程替换语法。

```bash
vim -d <(a_str="the quick brown fox jumps over the lazy dog"; echo $a_str |\grep -o . | sort | uniq|tail -n "+2") <(for ch in {a..z}; do echo $ch; done)
```

结果如下：
```
- a                                |- a
| b                                || b
| c                                || c
| d                                || d
| e                                || e
| f                                || f
| g                                || g
| h                                || h
| i                                || i
| j                                || j
| k                                || k
| l                                || l
| m                                || m
| n                                || n
| o                                || o
| p                                || p
| q                                || q
| r                                || r
| s                                || s
| t                                || t
| u                                || u
| v                                || v
| w                                || w
| x                                || x
| y                                || y
| z                                || z
```