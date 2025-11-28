Page({
  data: {
    inFlow: false
  },

  onLoad(options) {
    this.setData({
      inFlow: options.flow === '1'
    })
  },

  onFinish() {
    if (this.data.inFlow) {
      wx.redirectTo({
        url: '/pages/finger/index?flow=1'
      })
    } else {
      wx.navigateBack()
    }
  }
})
