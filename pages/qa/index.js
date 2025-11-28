// pages/qa/index.js
Page({
  data: {
    list: [],          // 题目列表
    current: 0,        // 当前题索引
    curQuestion: {},   // 当前题对象
    selected: -1,      // 当前选中的选项索引，-1 表示未选
    isCorrect: false,  // 当前这题是否回答正确
    showNext: false    // 是否允许点击“下一题/完成”按钮
  },

  // 接收首页传来的题目列表
  onLoad() {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('questions', data => {
      console.log('QA 页收到题库 =', data);
      const list = data.list || [];
      this.setData({
        list,
        curQuestion: list[0] || {}
      });
    });
  },

  // 点击选项
  onSelect(e) {
    // 已经选过了就不允许再选（防止乱点）
    if (this.data.selected !== -1) return;

    const idx = e.currentTarget.dataset.index;
    const correct = idx === this.data.curQuestion.answerIndex;

    this.setData({
      selected: idx,
      isCorrect: correct,
      showNext: true
    });


    // 也可以弹个 toast
    wx.showToast({
      title: correct ? '答对啦' : '再想想，下次加油',
      icon: 'none'
    });
  },

  // 点击 “下一题 / 完成并进入下一环”
  goNext() {
    const next = this.data.current + 1;

    // 已经是最后一题
    if (next >= this.data.list.length) {
      wx.showToast({
        title: '答题完成，进入下一环节',
        icon: 'success'
      });

      // TODO：这里进入益智小游戏环节
      wx.navigateTo({
        url: '/pages/game/index'
      });

      return;
    }

    // 进入下一题，重置状态
    this.setData({
      current: next,
      curQuestion: this.data.list[next],
      selected: -1,
      isCorrect: false,
      showNext: false
    });
  }
});
