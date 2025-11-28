// pages/finger/index.js
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
      const now = new Date()
      const y = now.getFullYear()
      const m = now.getMonth() + 1
      const d = now.getDate()
      const mm = m < 10 ? '0' + m : '' + m
      const dd = d < 10 ? '0' + d : '' + d
      const dateStr = `${y}-${mm}-${dd}`

      // 调用云函数记录“今日训练完成”
      wx.cloud.callFunction({
        name: 'submitTrainingResult',
        data: { date: dateStr },
        success: res => {
          wx.showToast({
            title: '今日训练完成 👏',
            icon: 'none'
          })

          // 使用 reLaunch 回到首页，确保栈被重置
          wx.reLaunch({
            url: '/pages/index/index'
          })
        },
        fail: err => {
          console.error('记录训练失败', err)
          wx.showToast({
            title: '记录失败，请稍后再试',
            icon: 'none'
          })
        }
      })
    } else {
      wx.navigateBack()
    }
  }
})
