# 梦记 (DreamJournal)

一个记录梦境的 Android APP，由万里为老大开发。

## 功能特性

- 📝 快速记录梦境（标题、内容、标签、心情、清醒梦标记）
- 📅 日历视图，查看哪天做了梦
- 🔍 搜索历史梦境
- 💾 本地存储，数据安全在你手机上
- 🎨 深色主题，适合晚上记录

## 如何生成 APK

### 前置要求

1. 安装 Node.js (推荐 v18 或更高)
2. 安装 npm 或 yarn
3. 注册 Expo 账号 (https://expo.dev)

### 步骤

1. 安装依赖：
```bash
cd dream-journal
npm install
```

2. 登录 Expo：
```bash
npx eas login
```

3. 配置项目 (第一次需要)：
```bash
npx eas init
```

4. 构建 APK：
```bash
npm run build:apk
```

构建完成后，Expo 会给你一个下载链接，下载安装即可。

## 本地开发预览

如果你想先在手机上预览效果：

1. 安装 Expo Go APP (Android/iOS)
2. 运行：
```bash
npm start
```
3. 用 Expo Go 扫描二维码即可预览

## 技术栈

- React Native
- Expo
- React Navigation
- AsyncStorage (本地存储)
- React Native Calendars

---

祝老大好梦！🌙
