Page({
  data: {
    goods: [],
    food: [],
    toView: '0',
    scrollTop: 100,
    foodCounts: 0,
    totalPrice: 0,// 总价格c
    totalCount: 0, // 总商品数
    carArray: [],
    items: [],
    minPrice: 20,//起送價格
    payDesc: '',
    deliveryPrice: 4,//配送費
    fold: true,
    cartShow: 'none',
    cartDis:'none',
  },
  onShow: function () {
    // 页面显示
    var that = this;
    wx.request({
      url: 'http://localhost:8080/book/bookList',
      method: 'GET',
      data: {},
      success: function (res) {
        var goods = res.data.goods;
        console.log(goods);
        //var categoryList = res.data.categoryList;
        if (goods == null) {
          var toastText = "网络不好？再试试";
          wx.showToast({
            title: toastText,
            icon: '',
            duration: 2000
          });
        } else {
          that.setData({
            goods: goods
          });
        }
      }
    });
  },
  selectFoods: function (event) {
    var that = this;
    var book = event.currentTarget.dataset.food;
    that.setData({
      food: book
    })
    wx.navigateTo({
      url: '/pages/content/content?book=' + JSON.stringify(book),
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  onLoad: function (options) {
    this.setData({
      title: options.title,
    });
  },
  selectMenu: function (e) {
    var index = e.currentTarget.dataset.itemIndex;
    this.setData({
      toView: 'order' + index.toString()
    })
    console.log(this.data.toView);
  },
  //移除商品
  decreaseCart: function (e) {

    var index = e.currentTarget.dataset.itemIndex;
    var parentIndex = e.currentTarget.dataset.parentindex;
    this.data.goods.forEach((good) => {
      good.foods.forEach((food) => {
        var num = this.data.goods[parentIndex].foods[index].count;
        var mark = 'a' + index + 'b' + parentIndex
        if (food.count > 0) {
          this.data.goods[parentIndex].foods[index].count--;
          num--;
          var price = this.data.goods[parentIndex].foods[index].price;
          var name = this.data.goods[parentIndex].foods[index].name;
          var obj = {
            price: price,
            num: num,
            mark: mark,
            name: name,
            index: index,
            parentIndex: parentIndex
          };
          var carArray1 = this.data.carArray.filter(item => item.mark != mark);
          this.setData({
            carArray: carArray1,
            goods: this.data.goods
          })
          this.calTotalPrice()
          this.setData({
            payDesc: this.payDesc()
          })
        }
        if (num > 0) {
          var carArray1 = this.data.carArray.filter(item => item.num > 0)
          this.setData({
            carArray: carArray1,
          })
        }
      })
    })
  },
  decreaseShopCart: function (e) {
    this.decreaseCart(e);
  },
  //添加到购物车
  //items添加错误
  addCart(e) {
    var index = e.currentTarget.dataset.itemIndex;
    var parentIndex = e.currentTarget.dataset.parentindex;
    this.data.goods[parentIndex].foods[index].count++;
    var mark = 'a' + index + 'b' + parentIndex
    var price = this.data.goods[parentIndex].foods[index].bookPrice;
    console.log("1:   " + this.data.goods[parentIndex].foods[index].bookPrice);
    var num = this.data.goods[parentIndex].foods[index].count;
    console.log("2:   " + num);
    var name = this.data.goods[parentIndex].foods[index].bookTitle;
    console.log("3:   " + name);
    var id = this.data.goods[parentIndex].foods[index].bookId;
    console.log("4:   " + id);
    var obj = { price: price, num: num, mark: mark, name: name, index: index, parentIndex: parentIndex, id: id };
    var obj1 = { productId: id, productQuantity: num, mark: mark, index: index, parentIndex: parentIndex };
    var carArray1 = this.data.carArray.filter(item => item.mark != mark)
    var carArray2 = this.data.items.filter(item => item.mark != mark)
    carArray1.push(obj)
    carArray2.push(obj1)
    console.log("aa"+ carArray1);
    this.setData({
      carArray: carArray1,
      items: carArray2,
      goods: this.data.goods,
      cartDis:'flex',
    })
    this.calTotalPrice();
    console.log("购物车id  " + obj.id);
    console.log(carArray1.filter);
    console.log(e);
    this.setData({
      payDesc: this.payDesc()
    })
  },
  addShopCart: function (e) {
    this.addCart(e);
  },
  //计算总价
  calTotalPrice: function () {
    var carArray = this.data.carArray;
    var totalPrice = 0;
    var totalCount = 0;
    for (var i = 0; i < carArray.length; i++) {
      totalPrice += carArray[i].price * carArray[i].num;
      totalCount += carArray[i].num
    }
    this.setData({
      totalPrice: totalPrice,
      totalCount: totalCount,
      // payDesc: this.payDesc()
    });
  },
  //差几元起送
  payDesc() {
    
      return '去结算';
    
  },
  //結算
  pay() {
    if (this.data.totalPrice < this.data.minPrice) {
      return;
    }
    // window.alert('支付' + this.totalPrice + '元');
    //确认支付逻辑
    var resultType = "success";
    // console.log("购物车1" + carArray1);
    //console.log("购物车1" + carArray);
    // console.log("购物车2" + JSON.stringify(this.data.carArray));
    // console.log("购物车2" + JSON.stringify(this.data.items));
    wx.navigateTo({
      url: '../checkout/checkout?carArray=' + JSON.stringify(this.data.carArray) + '&totalPrice=' + this.data.totalPrice + '&items=' + JSON.stringify(this.data.items),
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    // wx.redirectTo({
    //   url: '../pay/pay?resultType=' + resultType
    // })
  },
  //彈起購物車
  toggleList: function () {
    if (!this.data.totalCount) {
      return;
    }
    this.setData({
      fold: !this.data.fold,
    })
    var fold = this.data.fold
    //console.log(this.data.fold);
    this.cartShow(fold)
  },
  cartShow: function (fold) {
    console.log(fold);
    if (fold == false) {
      this.setData({
        cartShow: 'block',
      })
    } else {
      this.setData({
        cartShow: 'none',
      })
    }
    // console.log(this.data.cartShow);
  },
  listShow() {
    if (!this.data.totalCount) {
      this.data.fold = true;
      return false;
    }
    let show = !this.fold;
    if (show) {
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.listContent, {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      });
    }
    return show;
  },
  empty: function () {
    var that = this;
    wx.request({
      url: 'http://127.0.0.1:8080/sell/buyer/product/list',
      method: 'GET',
      data: {},
      success: function (res) {
        var goods = res.data.goods;
        console.log(goods);
        console.log("afafewaefws");
        //var categoryList = res.data.categoryList;
        if (goods == null) {
          var toastText = "获取菜品详细信息失败";
          wx.showToast({
            title: toastText,
            icon: '',
            duration: 2000
          });
        } else {
          that.setData({
            goods: goods
          });
        }
      }
    });
    that.setData({
      carArray: [],
      totalPrice: 0,
      totalCount: 0,
    });
  },


  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      payDesc: this.payDesc()
    });
  },
  onReady: function () {
    // 页面渲染完成
  },

  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})

