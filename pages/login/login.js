// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    registersrc:"/images/registerSelected.png",
    loginsrc:"/images/login.png",
    phoneCode:"",
    phoneRegisterInfo:"",
    register:"flex",
    registerInfo:"none",
    loginInfo:"none",
    nextStep:"flex",
    getCode:"flex",
    identity:[
      {name:'buyer',value:'买家',checked:'true'},
      {name:'seller',value:'卖家'}
    ],
    //传给后台的数据
    phone: "",
    password:"",
    identityChoose:"",
    nickName:"",
    wechat:"",
    showModal1:"true",
    showModal2: "true",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页d面初次渲染完成
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
  registerSelected:function(){
    this.setData({
      registersrc:"/images/registerSelected.png",
      loginsrc: "/images/login.png", 
      register: "flex",
      loginInfo:"none"
    })
  },
  loginSelected:function(){
    this.setData({
      loginsrc:"/images/loginSelected.png",
      registersrc: "/images/register.png",
      register:"none",
      loginInfo: "column",
      registerInfo:"none"
    })
   
  },
  getPhoneCode:function(e){
      var that = this;
      wx.request({
        url: 'http://localhost:8080/sms',
        method:'GET',
        data:{
          'phone': e.detail.value.phone
        },
        success:function(res){
          var result = JSON.parse(res.data.success) ;
          that.setData({
            phoneRegisterInfo:res.data.success
          });

          if(result.respCode == "00000"){
            var toastText = '获取验证码成功';
            wx.showToast({
              title: toastText,
              icon: '',
              duration: 2000
            });
          
          }else{
            var toastText = '获取验证码失败';
            wx.showModal({
              title: '',
              content: toastText,
              showCancel: false, //不显示取消按钮
              confirmText: '确定'
            })
          }
        
        }
      })
  },
  validatePhoneCode:function(e){

    //进行验证
    var that = this;
    that.setData({
      phone: e.detail.value.phone,
      phoneCode: e.detail.value.phoneCode
    });
    wx.request({
      url: 'http://localhost:8080/validate',
      method:'GET',
      data:{
        'phone':e.detail.value.phone,
        'code':e.detail.value.phoneCode
      },
      success:function(res){
        var success = res.data.success;
        if(success == 1){
            //验证码验证成功后跳转到用户注册页面
          that.setData({
            registerInfo: "row",
            nextStep: "none",
            getCode: "none"
          })
        } else{
          wx.showModal({
            title: '',
            content: "验证码输入有误",
            showCancel: false, //不显示取消按钮
            confirmText: '确定'
          })
        }     
      }
    })
  },
registerInfo:function(e){
  var that = this;
  that.setData({
    password: e.detail.value.password1,
    identityChoose: e.detail.value.choose,
    nickName: e.detail.value.nickName,
    wechat: e.detail.value.wechat
  });
  if(that.data.password != e.detail.value.password2){
    var toastText = "两次密码输入不正确";

    wx.showModal({
      title: '',
      content: toastText,
    })
  }
  if (e.detail.value.choose == "buyer"){
    var uri = 'http://localhost:8080/buyer/insertBuyer'
  }else{
    var uri = 'http://localhost:8080/seller/insertSeller'
  }
  wx.request({
    url: uri,
    method:'GET',
    data:{
      'phone':that.data.phone,
      'password':that.data.password,
      'identity': that.data.identityChoose,
      'name':that.data.nickName,
      'wechat':that.data.wechat
    },
    success:function(res){
      if(res.data.message == 1){
        wx.showModal({
          title: '',
          content: '注册成功',
        })
      }else{
        wx.showModal({
          title: '',
          content: '注册失败',
        })
      }
    }

  })
},
nickName:function(){
  var toastText = "如果你选择不填，我们将会为你随机生成一个名称";
  if(this.data.showModal1 == "true"){
    this.setData({
      showModal1:"false",
    })
    wx.showModal({
      title: '',
      content: toastText,
    })
  }
},
  wechat: function () {
    var toastText = "如果你选择不填，我们将会选择你的电话号码作为微信号";
    if (this.data.showModal2 == "true") {
      this.setData({
        showModal2: "false",
      })
      wx.showModal({
        title: '',
        content: toastText,
      })
    }
  },

  /*
    登录
   */

  loginInfo: function (e) {
    var that = this;
    that.setData({
      password: e.detail.value.password,
      identityChoose: e.detail.value.choose,
      phone:e.detail.value.phone
    });
    wx.request({
      url: 'http://localhost:8080/common/selectByPhoneAndPassword',
      method:'GET',
      data:{
        'phone':that.data.phone,
        'identity':that.data.identityChoose,
        'password':that.data.password
      },
      success:function(res){
        if(res.data.message == "登录成功"){
          let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
          let prevPage = pages[pages.length - 2];
          //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
          prevPage.setData({  // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
            people: res.data.people,
            login:"none",
            identityDis:"flex"
          })

          wx.navigateBack({           
            delta: 1,         
          })
        }else{
          wx.showModal({
            title: '',
            content: '登录失败',
            
          })
        }
        
      }
    })
  }
})