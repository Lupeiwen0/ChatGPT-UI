# ChatGPT-UI
仿照 New Bing等样式，为ChatGPT API提供了一个轻快好用的Web图形界面

[预览地址](https://lupeiwen0.github.io/ChatGPT-UI/)

## 使用技巧

- 使用System Prompt可以很有效地设定前提条件。
- 使用Prompt模板功能时，从下拉菜单中选择想要的prompt。
- 输入框支持换行，按shift + Enter即可。

## 配置

填写API密钥

- 可以再代码文件 `.env.development` 和 `.env.production` 文件中 配置 `VITE_API_KEY`,
  - `.env.development` 为开发环境
  - `.env.production` 为生产环境

```
VITE_API_KEY = ""

# 修改为：
VITE_API_KEY = sk-xxxxxxxxxxxxxxxxx
```

- 不配置`API-KEY`,启动项目后，在页面中配置也可以

## 运行方式

安装依赖
```bash
npm install
```

运行
```bash
npm run dev
```

## 部署

运行
```bash
npm run build
```