---
tags:
  - "#kb/PowerShell"
title: 如何在PowerShell里解压缩zip文件
---
说起来很简单，PowerShell内置了cmdlet Expand-Archive。使用起来也很简单，打开PowerShell，进入目标目录，运行如下命令：

``` Powershell
Expand-Archive -DestinationPath . <the_zip_file>
```

如果目标目录下有多个zip文件，怎么批量解压缩呢？用cmdlet Get-ChildItem结合通配符，获得zip文件列表，然后用管道将这些zip文件的信息传给Expand-Archive：

``` powershell
Get-ChildItem *.zip |Expand-Archive -DestinationPath . -Force
```