# 图案与字体资源包制作

## 概述

云北城建的告示牌编辑器支持在文本行里插入图案和字体，写法是三种数据组件命令：

- `-json <文本组件>`：自定义 JSON 格式文本
- `-rect <宽> <高>`：生成指定尺寸的矩形
- `-texture <路径>`：显示资源包内的纹理图片

通过制作资源包，可以为编辑器添加自定义图案与字体。注册完成后，它们会出现在编辑器的 **「图案列表」→「自定义资源包」** 或 **「字体列表」→「自定义资源包」** 下面，点一下就能把内容插入当前行。

图案和字体共用同一套注册方式：在命名空间下的 `ui_definitions/` 目录里放一份 JSON，模组读取后据此建立分类菜单。

## 一、加载机制

编辑器首次打开时加载这些分类数据，资源包重载时重新扫描一遍。加载过程会遍历资源管理器里的所有命名空间，在每个命名空间的 `ui_definitions/` 目录下查找接口文件：

```text
assets/<命名空间>/ui_definitions/
```

### 接口文件名

目录下的 JSON 文件很多，但模组**只认下面四个文件名**：

```text
cf_yunbeiuc.json
cf_ocelotsignmod.json
cf_ocelotsignyunbei.json
patterns.json
```

其余文件名一律忽略。因此自己的资源包也必须用其中之一，推荐使用 `cf_yunbeiuc.json`；`patterns.json` 是旧版兼容名，效果一样。

三个命名空间的接口和 JSON 结构完全一致，各自读自己那份文件。模组自带的数据就在 `assets/yunbeiuc/ui_definitions/cf_yunbeiuc.json`，可以拿来做参考。

### 两类内容

一份接口文件里可以同时包含两类数据：

- `sections`：图案或字体的分类区块，由本模组读取
- `presets`：告示牌文本预设，只含 `presets`、没有 `sections` 的文件会跳过分类注册

下面只讲图案与字体。

## 二、资源包基础框架

### 1. 创建根目录

新建文件夹，例如 `MyPatternPack`。

### 2. 编写 pack.mcmeta

```json
{
  "pack": {
    "pack_format": 15,
    "description": "自定义图案与字体资源包"
  }
}
```

`pack_format` 要与目标游戏版本对应，上面是 1.20.1 的取值。

### 3. 建立 assets 目录与命名空间

在根目录下创建 `assets`，再建命名空间子文件夹。命名空间只能用**小写字母、数字和下划线**，游戏内引用时以 `my_pack:` 为前缀。

```text
MyPatternPack/
 ├── pack.mcmeta
 └── assets/
     └── my_pack/
         └── ui_definitions/
             └── cf_yunbeiuc.json
```

## 三、注册图案

图案本身是 PNG 图片，放在资源包里任意位置；注册文件只负责说明「去哪个目录找图、怎么分类」。

### 1. 放置图片

在命名空间下建一个放图的目录，例如 `textures/patterns/`，把 PNG 放进去：

```text
MyPatternPack/
 └── assets/
     └── my_pack/
         ├── ui_definitions/
         │   └── cf_yunbeiuc.json
         └── textures/
             └── patterns/
                 ├── arrow_left.png
                 └── arrow_right.png
```

图片按原始宽高比等比缩放到缩略图框内，什么尺寸都能用，不必强制裁成正方形。只要图案本身清晰、边缘干净就行。

### 2. 编写注册文件

`assets/my_pack/ui_definitions/cf_yunbeiuc.json`：

```json
{
  "tab": "patterns",
  "category_name": "自定义路牌图案",
  "header_text": "此处显示在右侧内容区顶部的说明文字。",
  "header_text_enabled": true,
  "sections": [
    {
      "title": "箭头",
      "description": "显示在区块标题下方的灰色说明文字。",
      "basePath": "my_pack:textures/patterns/",
      "useSubfolders": false,
      "filterMode": "NONE",
      "filterList": []
    }
  ]
}
```

### 3. 顶层字段

| 字段 | 说明 |
|------|------|
| `tab` | 注册到哪个标签页，`"patterns"`（图案列表）或 `"fonts"`（字体列表），默认 `"patterns"` |
| `category_name` | 左侧边栏里显示的折叠菜单名称 |
| `header_text` | 右侧内容区顶部的说明横幅文字 |
| `header_text_enabled` | 设为 `false` 则不显示说明横幅，默认 `true` |
| `sections` | 区块列表，每个元素是一块可滚动的内容区 |

### 4. 区块字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `title` | string | 区块标题 |
| `description` | string | 区块标题下方的灰色说明文字 |
| `basePath` | string | 图片所在目录，格式为 `命名空间:路径/`，**末尾的斜杠不能省** |
| `useSubfolders` | boolean | 是否按子文件夹分标签页显示 |
| `subFolders` | array | 子文件夹定义，每项为 `{"dirName": "实际文件夹名", "displayName": "界面显示名"}` |
| `filterMode` | string | 过滤模式，见下表 |
| `filterList` | array | 配合过滤模式使用的文件名列表（含 `.png`） |

### 5. 过滤模式

`filterMode` 的可选值与含义：

| 取值 | 含义 |
|------|------|
| `NONE` | 不过滤，目录下的图片全部显示（默认） |
| `WHITELIST` | 只显示 `filterList` 里列出的文件 |
| `BLACKLIST` | 隐藏 `filterList` 里列出的文件 |
| `PREFIX` | 只显示文件名以 `filterList` 中某项开头的图片 |
| `PREFIX_EXCLUDE` | 隐藏文件名以 `filterList` 中某项开头的图片 |

比如只想显示两张箭头图：

```json
{
  "title": "箭头",
  "basePath": "my_pack:textures/patterns/",
  "useSubfolders": false,
  "filterMode": "WHITELIST",
  "filterList": ["arrow_left.png", "arrow_right.png"]
}
```

### 6. 按子文件夹分类

`useSubfolders` 设为 `true` 时，区块会按 `subFolders` 定义生成标签页，每个标签页对应一个子文件夹：

```json
{
  "title": "箭头",
  "basePath": "my_pack:textures/patterns/",
  "useSubfolders": true,
  "subFolders": [
    {"dirName": "black", "displayName": "黑色箭头"},
    {"dirName": "white", "displayName": "白色箭头"}
  ]
}
```

对应的目录结构：

```text
textures/patterns/
 ├── black/
 │   └── arrow_left.png
 └── white/
     └── arrow_left.png
```

需要注意扫描深度：

- 开启子文件夹后，只收录**子文件夹里那一层**的图片，目录根部的图片会被忽略。
- 关闭子文件夹时，只收录**目录根部**的图片，放进子文件夹的会被忽略。

两种模式都不递归往下找，层级放深了读不到。

### 7. 插入结果

在图案列表里点击一张图，编辑器会往当前行插入：

```text
-texture my_pack:textures/patterns/arrow_left.png
```

路径就是图片的完整资源路径（`命名空间:目录/文件名`）。

## 四、注册字体

字体走的是原版 Minecraft 的字体系统。先准备一个字体定义 JSON，再把字体 ID 注册进界面。

### 1. 放置字体文件与定义

在命名空间下创建 `font` 目录，放入 `.ttf` 字体文件（名称只用小写字母、数字、下划线），再写一个字体定义 JSON：

```text
MyPatternPack/
 └── assets/
     └── my_pack/
         └── font/
             ├── custom_font.ttf
             └── title_style.json
```

`title_style.json`：

```json
{
  "providers": [
    {
      "type": "ttf",
      "file": "my_pack:custom_font.ttf",
      "size": 12.0,
      "oversample": 8.0
    },
    {
      "type": "legacy_unicode",
      "sizes": "minecraft:font/glyph_sizes.bin",
      "template": "minecraft:font/unicode_page_%s.png"
    }
  ]
}
```

| 字段 | 说明 |
|------|------|
| `type: "ttf"` | 声明使用 TTF 字体 |
| `file` | 字体文件路径，格式为 `命名空间:文件名` |
| `size` | 基础渲染大小 |
| `oversample` | 超采样倍率，越大边缘越清晰，显存占用也越高 |
| `legacy_unicode` | 作为兜底，填补自定义字库缺失的字符，防止乱码 |

### 2. 注册到界面

在注册文件里把 `tab` 设为 `"fonts"`，区块加 `isFontMode` 和 `fontList`：

```json
{
  "tab": "fonts",
  "category_name": "我的字体库",
  "header_text": "字体分类说明文字。",
  "sections": [
    {
      "title": "自定义字体",
      "description": "点击即可插入当前行。",
      "isFontMode": true,
      "insertTemplate": "-json {\"font\":\"%s\",\"text\":\"XXX\"}",
      "fontList": [
        {"fontId": "my_pack:title_style", "displayName": "标题字体"},
        {"fontId": "my_pack:body_style", "displayName": "正文字体"}
      ]
    }
  ]
}
```

| 字段 | 说明 |
|------|------|
| `isFontMode` | 设为 `true` 启用字体区块 |
| `insertTemplate` | 插入模板，`%s` 会被替换为 `fontId`。省略时使用默认模板 `-json {"font":"%s","text":"XXX"}` |
| `fontList` | 字体列表，每项为 `{"fontId": "字体 ID", "displayName": "显示名称"}` |

`fontId` 的格式是 `命名空间:字体定义文件名`，**不带 `.json` 后缀**。上例中 `title_style` 对应的是 `assets/my_pack/font/title_style.json`。

### 3. 插入结果

在字体列表里点一项，编辑器会插入：

```text
-json {"font":"my_pack:title_style","text":"XXX"}
```

文本组件语法可参考 [Minecraft Wiki - 文本组件](https://zh.minecraft.wiki/w/%E6%96%87%E6%9C%AC%E7%BB%84%E4%BB%B6)。

## 五、图案与字体同时注册

`tab` 是文件级字段，一份文件只能归到图案或字体其中一个标签页。如果两者都要注册，就用两个不同的接口文件名各写一份，放在同一个 `ui_definitions/` 目录下：

```text
MyPatternPack/
 └── assets/
     └── my_pack/
         ├── ui_definitions/
         │   ├── cf_yunbeiuc.json   ← 图案
         │   └── patterns.json      ← 字体
         ├── textures/
         │   └── patterns/
         │       └── arrow_left.png
         └── font/
             ├── custom_font.ttf
             └── title_style.json
```

`cf_yunbeiuc.json`（图案）：

```json
{
  "tab": "patterns",
  "category_name": "自定义图案",
  "header_text": "示例资源包提供的图案。",
  "sections": [
    {
      "title": "箭头",
      "description": "示例箭头图案。",
      "basePath": "my_pack:textures/patterns/",
      "useSubfolders": false,
      "filterMode": "NONE",
      "filterList": []
    }
  ]
}
```

`patterns.json`（字体）：

```json
{
  "tab": "fonts",
  "category_name": "我的字体库",
  "header_text": "示例资源包提供的字体。",
  "sections": [
    {
      "title": "标题字体",
      "isFontMode": true,
      "fontList": [
        {"fontId": "my_pack:title_style", "displayName": "标题字体"}
      ]
    }
  ]
}
```

两份文件互不影响，各自在对应的标签页下生成一个分类。如果只需要其中一种，写一份就够了。

## 六、打包与安装

1. 进入 `MyPatternPack` 文件夹。
2. 同时选中 `assets` 文件夹和 `pack.mcmeta` 文件。
3. 右键「压缩为 ZIP 文件」。
4. 把生成的压缩包改名为 `MyPatternPack.zip`（后缀必须是 `.zip`，压缩包里不能再套一层文件夹）。

打开游戏，进入「选项」→「资源包」→「打开资源包文件夹」，放入并启用。回到游戏打开告示牌编辑器，新增的分类就会出现在 **「图案列表」→「自定义资源包」** 或 **「字体列表」→「自定义资源包」** 下面。

## 七、常见问题

**分类没出现**
先确认注册文件位于 `assets/<命名空间>/ui_definitions/`，且文件名是那四个之一（推荐 `cf_yunbeiuc.json`）。文件名不对会被直接忽略。

**区块显示「暂无图片」**
`basePath` 写错，或者图片不在该目录下。注意 `basePath` 末尾要带斜杠，且命名空间部分必须和图片所在的命名空间一致。

**图片不显示**
检查 `useSubfolders` 与图片的实际层级是否匹配：开启时图片必须在 `subFolders` 定义的子文件夹里，关闭时图片必须在 `basePath` 目录根部。

**字体插入后显示为默认字体**
`fontId` 拼错了，或者对应的 `assets/<命名空间>/font/<名字>.json` 不存在。`fontId` 不带 `.json` 后缀，且字体定义 JSON 本身要是合法的原版字体结构。

**整个文件没生效**
`filterMode` 的值必须是 `NONE`、`WHITELIST`、`BLACKLIST`、`PREFIX`、`PREFIX_EXCLUDE` 之一，写错会导致该区块解析失败。控制台会打印错误信息，可以据此定位。
