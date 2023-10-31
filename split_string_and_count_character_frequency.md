# 拆分字符串为单个字符并统计每个字符的出现次数

```bash
a_str="The quick brown fox jumps over the lazy dog"
echo  $a_str |grep -o . |sort |uniq -c
```
