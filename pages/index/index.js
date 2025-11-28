// pages/index/index.js
Page({
  data: {
    // 顶部日期
    dateText: '',
    // 三个模块进度
    qaProgress: '0 / 4',
    gameProgress: '0 / 1',
    fingerProgress: '0 / 1',
    // 已坚持天数
    streakDays: 0,
    // 今日题库（从云端获取）
    dailyQuestions: []
  },

  // -----------------------------
  // 生命周期
  // -----------------------------
  onLoad() {
    this.initDate();
    this.fetchPersistDays();
    this.fetchDailyQuestions();
  },

  onShow() {
    // 回到首页时再刷新一次坚持天数
    this.fetchPersistDays();
  },

  // -----------------------------
  // 顶部日期：2025年11月26日 · 星期三
  // -----------------------------
  initDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const weekdayMap = ['日', '一', '二', '三', '四', '五', '六'];
    const weekday = weekdayMap[now.getDay()];

    const dateText = `${year}年${month}月${day}日 · 星期${weekday}`;
    this.setData({ dateText });
  },

  // 今天的日期字符串：2025-11-26
  getTodayStr() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const mm = month < 10 ? '0' + month : '' + month;
    const dd = day < 10 ? '0' + day : '' + day;
    return `${year}-${mm}-${dd}`;
  },

  // -----------------------------
  // 从云函数获取：已坚持打卡天数
  // 云函数名称：getpersistDays
  // -----------------------------
  fetchPersistDays() {
    wx.cloud.callFunction({
      name: 'getpersistDays',
      success: res => {
        console.log('getpersistDays 返回：', res);
        if (res.result && res.result.success) {
          this.setData({
            streakDays: res.result.persistDays || 0
          });
        }
      },
      fail: err => {
        console.error('获取坚持天数失败', err);
      }
    });
  },

  // -----------------------------
  // 从云函数获取今日题库
  // 云函数名称：getDailyQuestions
  // 返回格式示例：
  // { success: true, list: [ { title, options, answerIndex, ... }, ... ] }
  // -----------------------------
  fetchDailyQuestions() {
    wx.cloud.callFunction({
      name: 'getDailyQuestions',
      data: {
        count: 4     // 要多少题，这里先写死 4 题
      },
      success: res => {
        console.log('getDailyQuestions 返回：', res);
        const result = res.result || {};
        const list = result.list || [];

        // 更新题库 + 进度显示
        this.setData({
          dailyQuestions: list,
          qaProgress: `0 / ${list.length || 4}`
        });
      },
      fail: err => {
        console.error('获取每日题库失败', err);
        wx.showToast({
          title: '题库获取失败',
          icon: 'none'
        });
      }
    });
  },

  // -----------------------------
  // 点击「开始训练」按钮
  // 先进入趣味问答页，并把题目 list 传过去
  // -----------------------------
  onStartTraining() {
    const list = this.data.dailyQuestions || [];

    if (!list.length) {
      wx.showToast({
        title: '题目准备中，请稍后再试',
        icon: 'none'
      });
      return;
    }

    console.log('开始训练，传递题库：', list);

    wx.navigateTo({
      url: '/pages/qa/index',
      success: res => {
        // 通过 eventChannel 把题目列表发给 QA 页面
        res.eventChannel.emit('questions', {
          list: list
        });
      }
    });
  },

  // 如果你在「趣味问答」那一行也绑定了点击事件，可以直接复用
  goQA() {
    this.onStartTraining();
  },

  // 占位：益智小游戏
  goGame() {
    wx.navigateTo({
      url: '/pages/game/index'
    });
  },

  // 占位：每日手指操
  goFinger() {
    wx.navigateTo({
      url: '/pages/finger/index'
    });
  }
});
