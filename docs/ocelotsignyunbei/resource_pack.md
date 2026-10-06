# 制作字体图案资源包

## 概述

在「云北城建：豹猫指示牌」的告示牌编辑器中，可通过以下三种数据组件命令进行内容排版：

- `-json <文本组件>`：自定义 JSON 格式文本（宽容模式，键与值可省略引号）
- `-rect <宽> <高>`：生成指定尺寸的矩形（受文本大小及缩放影响）
- `-texture <路径>`：显示资源包内的纹理图片

通过制作资源包，可以为告示牌引入自定义字体或特定图案。

> 这些图案与字体文件都存放在资源包里。如果在多人服务器使用，必须让所有玩家都装上同一个资源包，否则别人看你的告示牌只会看到错误方框或空白。

## 一、构建资源包的基础框架

### 1. 创建根目录

新建一个空白文件夹并命名，例如本教程命名为 `MyCustomPack`。

### 2. 编写 pack.mcmeta 描述文件

在 `MyCustomPack` 文件夹内新建文本文档，将名字和后缀改为 `pack.mcmeta`，用记事本或代码编辑器打开，输入以下内容并保存：

```json
{
  "pack": {
    "pack_format": 15,
    "description": "告示牌自定义字体与图案资源包"
  }
}
```

> `pack_format` 代表适用的游戏版本。本模组目前适配 Minecraft 1.20.1，对应取值为 `15`。其他版本的取值不同（1.20.2 为 18，1.20.4 为 26，1.21 为 34，1.21.2 为 45，1.21.4 为 61 等），请按实际游玩的版本填写。

### 3. 建立 assets 文件夹与命名空间

在 `MyCustomPack` 文件夹内新建 `assets` 文件夹。进入 `assets`，再新建一个代表你**命名空间（Namespace）**的文件夹，例如本教程命名为 `my_pack`。

> 命名空间只能使用小写字母、数字、下划线，不允许出现其他字符。后续在游戏中调用资源时，都会带有 `my_pack:` 前缀。

目录结构：

```text
MyCustomPack/
 ├── pack.mcmeta
 └── assets/
     └── my_pack/
```

## 二、引入并配置自定义字体

字体走的是 Minecraft 原版的字体系统，先准备一个字体定义 JSON，再在编辑器里调用。

### 1. 放置字体文件

在 `assets/my_pack/` 下新建 `font` 文件夹，将 `.ttf` 格式的 TrueType 字体文件重命名为只含小写字母、数字、下划线的名称（如 `custom_font.ttf`），放进该文件夹。

### 2. 编写字体 JSON 配置文件

在同一目录下新建 JSON 文档，例如 `title_style.json`（这个名字就是游戏中调用的字体 ID）：

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

| 参数 | 说明 |
|------|------|
| `"type": "ttf"` | 声明使用 TTF 自定义字体 |
| `"file": "my_pack:custom_font.ttf"` | 字体文件路径，`my_pack` 为命名空间，对应上一步的文件夹名 |
| `"size": 12.0` | 字体在游戏内的基础渲染大小 |
| `"oversample": 8.0` | 超采样倍率（清晰度）。数值越大，字体放大或高分辨率下越清晰，但占用显存也越多 |
| `legacy_unicode` | 兜底字体。自定义字库缺字（生僻字、特殊符号）时用原版字符补齐，避免显示成方框 |

### 3. 在游戏中调用字体

加载资源包后，在告示牌编辑界面新建一行文本，输入：

```text
-json {text:"这是一段测试文字", color:gold, font:"my_pack:title_style"}
```

> `font` 的值是 **命名空间:JSON 文件名**，不要带 `.json` 后缀。
>
> 文本组件详细语法请参阅 [Minecraft Wiki - 文本组件](https://zh.minecraft.wiki/w/%E6%96%87%E6%9C%AC%E7%BB%84%E4%BB%B6)。

## 三、引入并调用自定义图案

### 1. 放置图片文件

在 `assets/my_pack/` 下新建一个文件夹，例如 `icon`，将 `.png` 图片重命名为只含小写字母、数字、下划线的名称（如 `logo.png`），放进该文件夹。

### 2. 在游戏中调用图案

在告示牌编辑界面新建一行文本，输入：

```text
-texture my_pack:icon/logo.png
```

图片会渲染到告示牌上，可以像调整文字一样，用界面按钮调整它的 X/Y 偏移与缩放大小。

> 只支持资源包内的本地路径，不支持网络链接。

## 四、将自定义图案和字体注册到编辑器列表

编辑器的「图案列表」与「字体列表」下各有一个「玩家自定义资源包」分类。把自己的图案与字体挂进去有两种方式。

> **注意**：第 1 节的旧注册方式目前存在较严重的缺陷，不推荐使用。请优先使用第 2 节的高级自定义 UI，它更稳定，功能也更完整。如果你已经用旧方式注册过，建议改为第 2 节的做法。

### 1. 旧方式：custom_patterns.json 与 custom_fonts.json

注册文件必须放在模组支持的命名空间下。可用命名空间为 `ocelotsignyunbei`、`yunbeiuc`、`ocelotsignmod`，以及任意 `cf_` 开头的命名空间。贴图与字体本体仍可放在自己的命名空间（如 `my_pack`）里。

**图案注册**：`assets/<命名空间>/patterns/custom_patterns.json`

```text
MyCustomPack/
 └── assets/
     ├── my_pack/
     │   └── icon/
     │       └── logo.png
     └── ocelotsignyunbei/
         └── patterns/
             └── custom_patterns.json
```

```json
[
  {
    "name": "图案显示名称",
    "texture": "my_pack:icon/logo.png",
    "insert": ""
  }
]
```

| 字段 | 说明 |
|------|------|
| `"name"` | 图案在列表里显示的名称 |
| `"texture"` | 图案贴图的资源路径，可正常引用你自己的命名空间 |
| `"insert"` | 可选。点击时插入告示牌的内容；留空 `""` 时自动生成 `-texture <贴图路径>` |

**字体注册**：`assets/<命名空间>/fonts/custom_fonts.json`

```json
[
  {
    "font_id": "my_pack:title_style",
    "name": "标题字体"
  }
]
```

| 字段 | 说明 |
|------|------|
| `"font_id"` | 字体 ID，格式为 **命名空间:字体 JSON 文件名**（不含 `.json` 后缀） |
| `"name"` | 字体在列表里显示的名称 |

### 2. 推荐方式：高级自定义 UI 定义

除了往默认分类里塞内容，还可以通过编写 JSON，在左侧边栏创建一个全新的独立分类菜单，支持多级文件夹、图片白名单过滤、字体区块等。

文件放在 `assets/<你的命名空间>/ui_definitions/` 下，文件名任意，例如 `road_signs_ui.json`：

```text
MyCustomPack/
 └── assets/
     └── my_pack/
         └── ui_definitions/
             └── road_signs_ui.json
```

```json
{
  "tab": "patterns",
  "category_name": "我的自定义路牌",
  "header_text": "显示在右侧界面最顶部的说明文字。",
  "sections": [
    {
      "title": "箭头标识",
      "description": "显示在区块标题下方的灰色小字。",
      "basePath": "my_pack:textures/signs/",
      "useSubfolders": true,
      "subFolders": [
        {"dirName": "black", "displayName": "黑色箭头"},
        {"dirName": "white", "displayName": "白色箭头"}
      ],
      "filterMode": "NONE",
      "filterList": []
    },
    {
      "title": "特殊图案",
      "description": "这里演示白名单过滤。",
      "basePath": "my_pack:textures/special/",
      "useSubfolders": false,
      "filterMode": "WHITELIST",
      "filterList": ["logo.png", "banner.png"]
    }
  ]
}
```

**全局配置**

| 字段 | 说明 |
|------|------|
| `"tab"` | 顶部标签，决定菜单归属。可选 `"patterns"`（图案列表）或 `"fonts"`（字体列表） |
| `"category_name"` | 左侧边栏的折叠菜单名称 |
| `"header_text"` | 顶部说明横幅的文字；不填则显示默认说明 |
| `"sections"` | 内容区块数组，每个元素是一块可滚动的内容区 |

**区块配置（Sections）**

| 字段 | 类型 | 说明 |
|------|------|------|
| `"title"` | String | 区块标题 |
| `"description"` | String | 标题下方的灰色说明文本 |
| `"basePath"` | String | 资源读取路径，模组在该路径下扫描图片。格式为 **命名空间:文件夹路径/**，末尾斜杠不能省 |
| `"useSubfolders"` | Boolean | 是否启用子文件夹。设为 `true` 时区块下方生成一行可点击的标签按钮，用于切换不同子文件夹内的图片 |
| `"subFolders"` | Array | 启用 `useSubfolders` 时定义标签页。每项包含 `dirName`（实际子文件夹名）与 `displayName`（界面上显示的文字） |
| `"filterMode"` | String | 自动扫描图片时的过滤模式，见下表 |
| `"filterList"` | Array | 配合过滤模式使用的文件名数组，例如 `["test.png", "error.png"]` |
| `"isFontMode"` | Boolean | `tab` 为 `"fonts"` 时设为 `true`，区块将渲染字体列表而非图片网格 |
| `"fontList"` | Array | 启用 `isFontMode` 时定义字体列表，格式为 `[{"fontId": "ns:font", "displayName": "..."}]` |
| `"insertTemplate"` | String | 可选。字体区块的插入模板，`%s` 会被替换为 `fontId`。默认为 `-json {"font":"%s","text":"XXX"}` |

**过滤模式取值**

| 取值 | 含义 |
|------|------|
| `NONE` | 不过滤，显示文件夹内所有图片（默认） |
| `WHITELIST` | 白名单，仅显示 `filterList` 中列出的图片 |
| `BLACKLIST` | 黑名单，隐藏 `filterList` 中列出的图片，显示其余 |

**扫描深度**

- 启用子文件夹时，只收录**子文件夹里那一层**的图片，目录根部的图片会被忽略。
- 不启用子文件夹时，只收录**目录根部**的图片，放进子文件夹的会被忽略。

两种模式都不递归往下找，层级放深了读不到。

**字体区块示例**

```json
{
  "tab": "fonts",
  "category_name": "我的字体库",
  "header_text": "字体分类说明。",
  "sections": [
    {
      "title": "自定义字体",
      "description": "点击即可插入当前行。",
      "isFontMode": true,
      "insertTemplate": "-json {\"font\":\"%s\",\"text\":\"XXX\"}",
      "fontList": [
        {"fontId": "my_pack:title_style", "displayName": "标题字体"}
      ]
    }
  ]
}
```

## 五、同时适配「迷上城建：豹猫指示牌」与「云北城建」

同一份资源包可以通过命名空间的选择，同时被「迷上城建：豹猫指示牌」「云北城建：豹猫指示牌」以及「云北城建」本体读取。三端各自识别的命名空间与文件名如下：

| 生态 | 识别的命名空间 | UI 定义文件名 |
|------|----------------|----------------|
| 迷上城建：豹猫指示牌 | `ocelotsignmod` | 任意 |
| 云北城建：豹猫指示牌 | `ocelotsignyunbei`、`yunbeiuc`、`ocelotsignmod`、任意 `cf_` 开头 | 任意 |
| 云北城建（本体编辑器） | 任意命名空间 | 仅 `cf_yunbeiuc.json`、`cf_ocelotsignmod.json`、`cf_ocelotsignyunbei.json`、`patterns.json` |

要让一份资源包在三处都能被识别，可以按下面的方式组织：

- 注册文件统一放在 `ocelotsignmod` 命名空间下，三端都能读到；
- 图案用 `patterns/custom_patterns.json`，字体用 `fonts/custom_fonts.json`；
- UI 定义放在 `ui_definitions/` 下，并命名为 `cf_ocelotsignmod.json`——云北城建本体只认约定的那几个文件名，用这个名字才能被它读到。

```text
MyCustomPack/
 └── assets/
     ├── my_pack/                    ← 贴图与字体本体，放哪个命名空间都可以
     │   ├── icon/logo.png
     │   └── font/title_style.json
     └── ocelotsignmod/              ← 注册文件统一放这里
         ├── patterns/custom_patterns.json
         ├── fonts/custom_fonts.json
         └── ui_definitions/cf_ocelotsignmod.json
```

如果只针对其中某一个生态，按上表选对应的命名空间即可，不必三套都写。

## 六、打包与安装

1. 双击进入 `MyCustomPack` 文件夹。
2. 同时选中 `assets` 文件夹与 `pack.mcmeta` 文件。
3. 右键选择「压缩为 ZIP 文件」（或「添加到压缩文件…」）。
4. 将生成的压缩包重命名为你喜欢的名字（例如 `MyServerPack.zip`）。后缀必须是 `.zip`，压缩包里不能再套一层文件夹。

启动 Minecraft，进入「选项」→「资源包」→「打开资源包文件夹」，把 `.zip` 文件放进去并启用即可。回到游戏打开告示牌编辑器，新增的分类会出现在「图案列表」或「字体列表」下的「玩家自定义资源包」中。
