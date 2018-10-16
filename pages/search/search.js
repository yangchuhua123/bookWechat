// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //用来存放后台传输过来的数据
    books:[],

    //用来存放显示
    searchdisplay:"none",
    searchdispaly:'none',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      searchdisplay: 'none',
    })
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  searchSomething:function(e){
    var that = this;
 
    wx.request({
      url: 'http://localhost:8080/book/bookLike',
      method:'GET',
      data:{
        'x':e.detail.value.like,
      },
      success:function(res){
        
        var books = res.data.books;
        console.log(books.length)
        console.log(books)
        if(books.length == 0){
          that.setData({
            searchdisplay:'row',
            searchdispaly:'none',
          })         
        }else{
          that.setData({
            books: books,
            searchdispaly:'row',
            searchdisplay: 'none',
          })
        }
       
      }
       
    })
   
  },
  selectBook:function(e){
    console.log(e.detail.value.bookIcon)
  }
})