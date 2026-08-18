# `dsh-ui-background`

[English](README.md) | 中文

Web 界面背景图插件：一个双面包，其宿主侧为暴露该设置的部署注册 `ui-background` 用户设置命名空间，浏览器侧注册外观设置行，用于上传、更换或移除页面背景。浏览器侧把选择持久化在 `localStorage` 中，因此无需 api-proxy 设置白名单即可在未修改的 harness 上工作。持久化的图片是 `data:` URL；浏览器侧将其投影到主题覆盖 token `--dsw-alias-bg-image` 上，并注入插件自有的 `<style>` 标签，使 AppFrame、会话与详情表面将其作为背景图消费——图片上会叠加按配色方案的文字对比 scrim（浅色为白、深色为黑），使前景文字保持可读，其强度可通过外观设置中的滑块调节，壳层的 `--dsw-alias-bg-base` 仍作为其下方的兜底颜色。上传控件接受 PNG、JPEG、WebP、GIF，上限 4 MB，会把图片缩放到最长边 1920px 并重新编码为 JPEG，以使存储值保持小巧。

该插件以本目录中的独立组合包（bundle）形式交付。通过 `dsh plugin --profile <name> add ./ui-background` 将它加入 Web profile（bundle patch 会在 web-app 名单之后插入 `ui-background` 行）。在常规设置区块中：选择图片即可设置背景，再选一张即可更换，移除即可恢复默认背景。由于该值存放于 `localStorage` 中，因此刷新后仍然保留；主题覆盖层与注入的样式表都会在插件卸载时移除，从而恢复默认背景。

## 模型体验

无，因为该插件只改变浏览器页面背景，并把图片存储于 localStorage 中；其中没有任何内容会进入模型请求。

#### KV Cache 影响

无；该包既不组装也不发送提供方请求。

## 已知限制与延期工作

- **图片以缩图后的 JPEG `data:` URL 形式存储于 `localStorage` 中**：上传会重新编码为 1920px 的 JPEG（质量 0.85），因此存储值体积始终有界；需要原始字节的部署应改为文件存储加提供路由。
- **透明与动画会被压平**：背景始终重新编码为 JPEG，因此动图 GIF 只会保留首帧，PNG 的 alpha 会丢失；这类源图应在上传前先准备为静态 JPEG。
- **浅色／深色共用一张图**：同一张图片同时用于浅色与深色主题；按配色方案的背景需要按模式的设置字段。
