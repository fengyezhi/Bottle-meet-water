// pages/logs/introduction.js
Page({

  /**
   * 页面的初始数据
   */
  
  data: {
    
  },
  heshui1:function(event){
    console.log(event)
    wx.navigateTo({

      url:'../logs/heshui1'})
  },
  heshui2:function(event){
    console.log(event)
    wx.navigateTo({

      url:'../logs/heshui2'})
  },
  heshui3:function(event){
    console.log(event)
    wx.navigateTo({

      url:'../logs/heshui3'})
  },
  heshui4:function(event){
    console.log(event)
    wx.navigateTo({

      url:'../logs/heshui4'})
  },
  heshui5:function(event){
    console.log(event)
    wx.navigateTo({

      url:'../logs/heshui5'})
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },


  onReachBottom: function () {

  },

 
  onShareAppMessage: function () {

  }
})