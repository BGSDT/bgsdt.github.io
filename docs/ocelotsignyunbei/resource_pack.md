# 字体图案资源包开发文档

## 概述

在云北城建（YunbeiUC）生态的告示牌编辑器中，可通过以下三种数据组件命令进行内容排版：

- `-json <文本组件>`：自定义 JSON 格式文本
- `-rect <宽> <高>`：生成指定尺寸的矩形（受文本大小及缩放影响）
- `-texture <路径>`：显示资源包内的纹理图片

通过制作资源包，您可以为告示牌引入自定义字体或特定图案。在多人在线服务器中使用时，**所有玩家均需安装并启用该资源包**，否则将无法正确显示相关内容。

## 一、资源包基础框架构建

### 1. 创建根目录

新建文件夹并命名，例如 `MyCustomPack`。

### 2. 编写 pack.mcmeta 描述文件

在根目录下创建 `pack.mcmeta` 文件，内容如下：

```json
{
  "pack": {
    "pack_format": 15,
    "description": "告示牌自定义字体与图案资源包"
  }
}
```

### 3. 建立 Assets 目录结构与命名空间

在根目录下创建 `assets` 文件夹，并在其中创建代表您**命名空间（Namespace）**的子文件夹（如 `my_pack`）。

> 命名空间仅限小写字母、数字及下划线，游戏内调用时将以 `my_pack:` 为前缀。

#### 目录结构示例

```text
MyCustomPack/
 ├── pack.mcmeta
 └── assets/
     └── my_pack/
```

## 二、自定义字体配置

### 1. 放置字体文件

在 `assets/my_pack/` 下创建 `font` 文件夹，将 `.ttf` 格式的 TrueType 字体文件重命名为仅含小写字母、数字、下划线的名称（如 `custom_font.ttf`），放入该文件夹。

### 2. 编写字体定义 JSON 文件

在同一目录下创建字体定义文件，例如 `title_style.json`：

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

#### 参数说明

| 参数 | 说明 |
|------|------|
| `type: "ttf"` | 声明使用 TTF 自定义字体 |
| `file` | 字体文件路径，格式为 `命名空间:文件名` |
| `size` | 字体基础渲染大小 |
| `oversample` | 超采样倍率，数值越高边缘越清晰，但显存占用也越大 |
| `legacy_unicode` | 作为备用字体，填补自定义字库缺失的字符，防止乱码 |

### 3. 游戏中调用字体

在告示牌编辑器中输入：

```text
-json {"text":"这是一段测试文字","color":"gold","font":"my_pack:title_style"}
```

> **注意**：`font` 值为 `命名空间:JSON文件名`（不含 `.json` 后缀）。
>
> 文本组件详细语法请参阅：[Minecraft Wiki - 文本组件](https://zh.minecraft.wiki/w/%E6%96%87%E6%9C%AC%E7%BB%84%E4%BB%B6)

## 三、自定义图案配置（云北城建原生支持）

通过 `-texture` 命令可在告示牌上显示自定义图片。

### 1. 放置图片文件

在 `assets/my_pack/` 下创建文件夹（如 `icon`），将 `.png` 格式图片重命名为仅含小写字母、数字、下划线的名称（如 `logo.png`），放入该文件夹。

> 图片长宽比须为 **1:1**。

### 2. 游戏中调用图案

在告示牌中输入：

```text
-texture my_pack:icon/logo.png
```

图片将渲染于告示牌上，可通过界面按钮调整 X/Y 偏移、缩放等参数。

> 仅支持资源包内本地路径，不支持网络链接。

## 四、自定义内容注册至 UI 界面

本模组支持通过 JSON 配置将自定义字体和图案注册至 UI 界面，方便玩家直接点击插入。

> **核心要点**：注册配置文件**必须放置于 `ocelotsignyunbei` 命名空间下**，但字体和图片本体仍可存放于自定义命名空间（如 `my_pack`）。

### 1. 自定义字体注册

在 `assets/ocelotsignyunbei/fonts/` 目录下创建 `custom_fonts.json`：

#### 目录结构

```text
MyCustomPack/
 ├── pack.mcmeta
 └── assets/
     ├── my_pack/
     │   └── font/
     │       ├── custom_font.ttf
     │       └── title_style.json
     └── ocelotsignyunbei/
         └── fonts/
             └── custom_fonts.json
```

#### JSON 格式

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
| `font_id` | 字体 ID，格式为 `命名空间:字体定义文件名` |
| `name` | UI 列表中显示的友好名称 |

保存后，该字体将出现在告示牌编辑器 **「字体列表」→「自定义资源包」→「自定义字体」** 分区中。点击「插入」按钮，编辑器将自动生成：

```text
-json {"font":"my_pack:title_style","text":"XXX"}
```

### 2. 自定义图案注册（目录扫描方式）

模组在游戏启动时会自动扫描 `ocelotsignyunbei` 命名空间下的 `patterns/` 目录，将其中所有 `.png` 文件注册至 UI。

将图片（`.png`，1:1）放入 `assets/ocelotsignyunbei/patterns/` 目录：

```text
MyCustomPack/
 └── assets/
     └── ocelotsignyunbei/
         └── patterns/
             ├── my_logo.png
             └── arrow_1.png
```

启动游戏后，这些图片将出现在 **「图案列表」→「自定义资源包」→「自定义图案」** 分区中。点击「插入」按钮，编辑器将自动生成：

```text
-texture ocelotsignyunbei:patterns/my_logo.png
```

> 采用目录扫描方式，**无需编写 JSON 注册文件**。如需将图案存放于自定义命名空间，请参考下方「高级自定义 UI 定义」章节。
>

### 3. 高级自定义 UI 定义

您可以通过编写 JSON 文件，在 UI 左侧边栏创建独立的专属分类菜单，支持多级文件夹结构、图片过滤、字体区块等高级功能。

> 该配置文件支持放置于自定义命名空间下。

#### 文件路径

在 `assets/<命名空间>/ui_definitions/` 下创建 JSON 文件（如 `road_signs_ui.json`）：

```text
MyCustomPack/
 └── assets/
     └── my_pack/
         └── ui_definitions/
             └── road_signs_ui.json
```

#### JSON 结构示例

```json
{
  "tab": "patterns",
  "category_name": "自定义路牌",
  "header_text": "此处显示于右侧界面顶部的说明文字。",
  "sections": [
    {
      "title": "箭头标识",
      "description": "显示于区块标题下方的灰色描述文字。",
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
      "description": "本区块演示白名单过滤功能。",
      "basePath": "my_pack:textures/special/",
      "useSubfolders": false,
      "filterMode": "WHITELIST",
      "filterList": ["logo.png", "banner.png"]
    }
  ]
}
```

#### 字段详细说明

**全局配置（左侧边栏）**

| 字段 | 说明 |
|------|------|
| `tab` | 所属标签页，可选 `"patterns"`（图案列表）或 `"fonts"`（字体列表） |
| `category_name` | 左侧边栏显示的折叠菜单名称 |

**右侧主内容区**

| 字段 | 说明 |
|------|------|
| `header_text` | 右侧顶部浅蓝色背景框中显示的说明文字 |
| `sections` | 右侧内容区块列表，每个元素代表一个可滚动区块 |

**区块配置（Sections）**

| 字段 | 类型 | 说明 |
|------|------|------|
| `title` | string | 区块标题（橙色字体） |
| `description` | string | 区块下方的灰色说明文本 |
| `basePath` | string | 资源路径，格式为 `命名空间:文件夹路径/` |
| `useSubfolders` | boolean | 是否启用子文件夹标签页切换 |
| `subFolders` | array | 子文件夹定义，每项包含 `dirName`（实际文件夹名）和 `displayName`（界面显示名称） |
| `filterMode` | string | 过滤模式：`"NONE"`（显示全部）、`"WHITELIST"`（仅显示列表内）、`"BLACKLIST"`（隐藏列表内） |
| `filterList` | array | 配合过滤模式使用的文件名列表，如 `["test.png", "error.png"]` |

**字体区块专用配置**

当 `tab` 设为 `"fonts"` 时，区块需包含以下字段：

| 字段 | 说明 |
|------|------|
| `isFontMode` | 设为 `true` 启用字体渲染模式 |
| `insertTemplate` | 可选，自定义插入模板，`%s` 会被替换为 `fontId`。默认模板为 `-json {"font":"%s","text":"XXX"}` |
| `fontList` | 字体列表，每项包含 `fontId`（字体 ID）和 `displayName`（显示名称） |

#### 字体区块示例

```json
{
  "tab": "fonts",
  "category_name": "我的字体库",
  "header_text": "字体分类说明文字。",
  "sections": [
    {
      "title": "自定义字体",
      "description": "点击「插入」即可使用。",
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

## 五、资源包打包与安装

1. 进入 `MyCustomPack` 文件夹
2. 同时选中 `assets` 文件夹和 `pack.mcmeta` 文件
3. 右键选择「压缩为 ZIP 文件」
4. 将生成的 `.zip` 文件重命名为所需名称（如 `MyServerPack.zip`）

启动 Minecraft，进入 **「选项」→「资源包」→「打开资源包文件夹」**，将 `.zip` 文件放入后启用即可。