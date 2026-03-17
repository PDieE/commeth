# 0.2.0

## 2025-12-31

### 🚀 Features

- feat: 新增`ListBottom`组件
- feat: `JumpLink`组件新增`type`字段，用于指定跳转类型，默认值为`default`

# 0.2.0

## 2025-12-31

### 🚀 Features

- `AMapSelect`添加`change`事件
- `AMapSelect`添加`defaultAddress`属性，如果传入，则当选择器未选中任何位置时，使用默认地址获取定位
- 新增`FilterForm`组件，用于统一筛选表单展示

### 🐞 Bug Fixes

- 修正由于直接从根目录导入组件，导致每多打一次包就会多产生一级dist的问题

### 🚀 Features

# 0.1.0

## 2025-12-23

### 🚀 Features

- 初始版本，目前包含以下组件
  - `IconifyIcon`，图标组件，基于`@iconify/vue`的二次封装
  - `EnhancedUpload`，上传组件
  - `AMapSelect`，高德地图选点
  - `JumpLink`，带有醒目图标的，跳转链接
  - `SimpleWrap`，简易包裹组件，可以处理：加载中、空数据、错误等情况
