---
tags: 
  - linux
---

# Linux开发51单片机

## 参考链接

[怎么用 linux 操作系统开发 51 单片机程序 - 鸿则的业余实验室](https://www.bilibili.com/video/BV1bp411d7Mg?from=search&seid=8032133120414251956)

[sdcc](http://sdcc.sourceforge.net/)

[stcflash](https://github.com/laborer/stcflash)

[stcgal](https://github.com/grigorig/stcgal)

## 准备工具

单片机，USB转TTL, 个人电脑

## 烧写环境搭建

**测试背景：** Linux-Debian

安装SDCC

```shell
sudo apt install sdcc
```

**方法一** 下载stcflash, 这是个用python写的向单片机烧写的软件

```shell
git clone https://github.com/laborer/stcflash ~/Downloads/stcflash  
unzip stcflash.zip
cd stcflash-master
mv stcflash.py stcflash #删除后缀名
#移动stcflash文件到/usr/local/bin
vim ~/.zshrc #修改环境变量，此处我用的zsh
PATH=$PATH:/usr/bin/local
```

**注意：** stcflash只支持STC89C5xRC, STC89C5xRD+, STC90C5xRC, STC10Fxx, STC11Fxx, STC12Cx052x, STC12C52xx, STC12C56xx, STC12C5Axx系列单片机，因此一定要先看清楚单片机型号。

安装串口支持

```shell
sudo apt install python-serial
```

打开写好的工程，开始进行编译

```shell
sdcc main.c -o mian.ihx #注意此处生成为ihx文件，所以需要转换
packihx main.ihx > main.hex #packihx会在安装sdcc的时候一并安装上
```

调用stcflash进行烧写

```shell
#一般来讲，串口好会自动检测
#如果有多个串口，需要手动指定
#sudo stcflash main.hex --port /dev/ttyUSB0 --lowbaud 9600 #指定串口和波特率下载
sudo stcflash main.hex
```

**方法二** 下载stcgal，这个支持stc8的程序烧写

```shell
pip install stcgal #安装stcgal
sudo stcgal -P stc8 text1.ihx  #烧写text1.ihx这个程序给stc8芯片
sudo stcgal -P stc8 #查看单片机信息
```

**关于stcgal的bug**：下载安装stcgal后，实际上可能由于我之前配置了anaconda的原因，所以无法正常使用stcgal这个程序，无法调用/dev/ttyUSB0。没有权限。所以要添加语句`sudo`，但是对于sudo而言，它出于安全考虑，所以会启用它自己的环境变量，从而出现**sudo：stcgal：command not found**这个结果

**解决方案**：

```shell
whereis stcgal #查找stcgal的执行文件位置
#--> /home/youli/anaconda3/bin/stcgal
sudo cp /home/youli/anaconda3/bin/stcgal /usr/local/bin #复制到系统变量文件夹下
vim ~/.zshrc #修改环境变量，此处我用的zsh
PATH=$PATH:/usr/bin/local
```

现在再调用sudo后，就可以正常编译了。网上很多教程是修改sudo的默认文件，有一定风险。

## SDCC编译期简明使用教程

安装后把SDCC的bin目录添加到path环境 变量使得你能在任何目录下使用SDCC,使用archlinux和debian系统的没有这一步,安装时已经自动配置好了!

对于已经习惯使用Keil C的用户需要注意一下,SDCC的源代码和Keil C有所不同,需要做一点调整才能编译通过.SDCC比较多的使用像8051.h这样的头文件(include/mcs51目录下也有reg51.h这样的头文件).

对于一些非ANSI  C的关键字,SDCC均采用双下滑线开头的方式定义,如__code,__idata,__sbit…对于单片机引脚的定义SDCC采用了  __at关键字和十六进制地址(用户对底层地址信息要弄清楚,不过我觉得__at关键字是一个比较有特色的改进),如下:

| SDCC                     | Keil           |
| ------------------------ | -------------- |
| __sbit   _ _at 0x80 P1_1 | sbit in1=P1^0; |
| __sbit   _ _at 0x80 P1_1 | sbit in2=P1^1; |
| __sbit   _ _at 0x80 P1_1 | sbit in3=P1^2; |

所以，在使用STC其他的单片机的时候，一定要先修改一下头文件里面的内容格式。然后再把这个头文件放在SDCC库文件的文件夹里，我这里是/usr/share/sdcc/include/mcs51/。

使用sdcc编译后生成的文件路径是你当前命令行的输入路径。编译好后的文件如下

- sourcefile.asm - 程序的汇编文件
- sourcefile.lst - 程序的列表文件 
- sourcefile.rst - 被链接器更新的列表文件
- sourcefile.sym - 由链接器生成的符号清单
- sourcefile.rel - 由汇编器生成的对象文件，提供给链接器使用
- sourcefile.map - 被链接器更新的最终存储器映射
- sourcefile.mem - 内存的使用情况摘要
- sourcefile.ihx - 用于生成Intel Hex格式文件模块

程序也需要做一定的修改，如下所示

```C
#include <reg52.h>       	//52系列单片机头文件

sbit LSA = P1^5;  			//LED位选译码地址引脚A
sbit LSB = P1^6;  			//LED位选译码地址引脚B
sbit LSC = P1^7;  			//LED位选译码地址引脚C
int  main(void)			
{
	while(1)				//主程序中设置死循环程序，保证周而复始运行
	{				
		//使LED灯的总开关三极管Q6导通，+5V加到LED灯组
		LSA = 0;
		LSB = 0;
		LSC = 0;
		P0 = 0xfe;         	//点亮一个发光二极管
	}
}
```

在sdcc下修改为

```C
#include <8052.h>       	

#define LSA P1_5  			
#define LSB P1_6  			
#define LSC P1_7 
 			
int  main(void)			
{
	while(1)				
	{
		LSA = 0;
		LSB = 0;
		LSC = 0;
		P0 = 0xfe;
	}
}
```

### 多文件项目

SDCC并不支持同时编译多个源代码文件,所以多文件项目的编译需要分步进行.假如你的项目包含foo1.c foo2.c main.c三个文件,那么编译过程如下:

```shell
sdcc -c foo1.c
sdcc -c foo2.c
sdcc main.c foo1.rel foo2.rel
```

最后处理一下ihx文件就可以了.对于多文件项目最好是写一个makefile文件用make维护或者写一个批处理文件。

**追更**

之前提到了可以通过写makefile的方法来维护工程文件夹，所以去简单的了解了一下使用方法。

**测试环境**：创建的工程文件有：main.c  delay.c  delay.h

在工程目录下创建一个名为makefile的文件，点开进行编辑，输入如下内容

```makefile
CC	=sdcc #定义变量CC，变量值为sdcc

main.ihx:main.rel delay.rel 
	$(CC) main.rel delay.rel #$(CC)算是一种引用，等价于替换为sdcc，整个语句就是sdcc main.rel delay.rel
							 #整个语句含义为将main.rel, delay.rel链接在一起
main.rel:main.c delay.h		 #编译main.c文件，对了，delay.h这种头文件也要加进去，不然到时候修改了.h文件，再编译的时候，就不会读进修改内容
	$(CC) -c main.c

delay.rel:delay.c			 #编译delay.c文件
	$(CC) -c delay.c

.PHONY:clean				 #创建伪目标，可以防止在Makefile中定义的只执行命令的目标和工作目录下的实际文件出现名字冲突
clean:						 #可以通过make clean来调用此指令，清除过多的生成文件
	-rm main.asm main.ihx main.lk main.lst main.map main.mem main.rel main.rst main.sym
	-rm delay.asm delay.lst delay.rel delay.rst delay.sym
```

如果对以上内容不理解，可以了解一些关于gcc的指令。我们这里再介绍一下makefile的文件格式。

```makefile
target ... : prerequisites ... #目标：参数
                   
        command				   #指令
              
        ...
       
           
        ...
       
```

通过对照观察，我们对整个文件的理解就更进一步了。

然后这里再介绍一下关于makefile中，`all`这个参数的用法。

比如我们要把一个 hello.cpp 文件编译成 hello

```makefile
all : hello another

hello : hello.cpp
	g++ -o $@ $<

another : another.cpp
	g++ -o $@ $<


```

直接 make 或 make all 的话会执行 `hello:hello.cpp` 和 `another:another.cpp` 的编译命令 

这是因为在`make`指令后面不加参数的话，会把第一个读到的目标作为默认的执行对象。所以此处make和make all就一样了。

如果没有`all`这个指令，那么就会编译`hello:hello.cpp` 

  make hello 的话只编译 hello.cpp 

  make another 的话只编译 another.cpp

更多的有关makefile的东西呀，我们之后再聊聊，see you！

**再次追更**

因为我觉得rm后面跟上一大堆文件太傻了，一点都不好玩，所以换个简便方法。

```shell
ls -l /bin/sh #查看当前的shell
```

如果你是debian, 那么你就会见到它指向dash这个东西，那么下面这个方法就无效了（噗）

如果你是bash作为shell，那么进行以下操作就好了

```shell
#首先查看通配符情况
shopt extglob
#开启扩展通配符
shopt -s extglob
#关闭扩展通配符
#shopt -u extglob
#排除多个文件，删除剩余文件
rm -rf !(example1.txt|example2.txt)
```

