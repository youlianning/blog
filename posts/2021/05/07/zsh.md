# wsl + oh my zsh



## 安装zsh

查看自己有哪一些shell

```
cat /etc/shells #linux平台下
```

如果没有zsh，则需要安装

```
sudo apt-get update  #更新
sudo apt-get install zsh 
chsh -s /bin/zsh  #安装完成后设置当前用户使用zsh并重启wsl
omz update #更新oh-my-zsh
```

## 安装oh my zsh

下载[oh-my-zsh](https://github.com/ohmyzsh/ohmyzsh)

```
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

如果无法安装，遇到错误：`curl: (7) Failed to connect to raw.githubusercontent.com port 443: Connection refused` ，那是因为github 被墙了。因此可以挂全局VPN或者修改hosts。

当然，我们也有其他方法，[参考链接](https://zhuanlan.zhihu.com/p/199798102)

① 在浏览器输入网址(确保能进github)：[https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh](https://link.zhihu.com/?target=https%3A//raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)

② 进入后是一个文件，将该 `.zsh` 文件下载下来，保存为 `install.zsh`到一个目录。

③ 接下来在WSL进入该目录，执行命令：

```bash
chmod +x install.sh
./install.sh
```

✅ 完美解决！

## 切换主题

看项目 readme 还是写的非常详细的，安装好后重启 wsl 便是用的 oh my zsh

此时我们可以根据该项目 readme [切换主题](https://zhuanlan.zhihu.com/p/199798102) 

```
sudo apt-get install vim #debain默认命令是vi，这里安装vim
vim ~/.zshrc #进入zsh配置界面
#修改主题，找到ZSH_THEME
ZSH_THEME="random" #此处设置随机，使用者可以按照自己的兴趣来设置，切记没有空格
#保存退出即可
```
此处介绍安装powerlevel10k主题 [参考链接](https://www.jianshu.com/p/7162c4b7a438)
```
git clone https://github.com/romkatv/powerlevel10k.git $ZSH_CUSTOM/themes/powerlevel10k

# 然后设置 .zshrc 中的变量 ZSH_THEME
Set ZSH_THEME=powerlevel10k/powerlevel10k in your ~/.zshrc.
```

## wsl字符乱码问题

当主题安装上后，可能会发现部分是乱码，查看readme会发现

> *Note: many themes require installing the* [Powerline Fonts](https://link.zhihu.com/?target=https%3A//github.com/powerline/fonts) *in order to render properly.*

所以需要安装[Powerline Fonts](https://github.com/powerline/fonts) 这样才不会有乱码，因为字体格式(Fonts)是给Windows用的，所以我们不能在wsl里面安装，而是在Windows下安装。

打开power shell，输入下列命令

```
git clone https://github.com/powerline/fonts.git --depth=1 #注意：windos 下需先安装 (git)这个工具
```

克隆下来后打开对应文件夹，发现有一个名为ps1的power shell文件，双击这个文件打开安装即可，或者打开power shell，然后把这个文件拖入进去，按回车按键也可以。如果发现无法安装，则需要考虑是否power shell禁止安装。

打开power shell，输入下列命令

```
get-executionpolicy #查看系统设置
#如果出现了Restricted，则意味着系统限制了，输入下列指令
set-executionpolicy remotesigned
#然后选择Y即可
```

经过如上操作，power shell将会支持安装ps1文件，安装即可。

然后打开wsl，开始设置字体为Noto Mono for Powershell (此处只是举例)。

或者如果不想安装那么多字体，也可以参考这里的[方法](https://blog.csdn.net/qiphon3650/article/details/109165495) 。



