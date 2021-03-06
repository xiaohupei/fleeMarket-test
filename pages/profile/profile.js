// pages/profile/profile.js
const app = getApp();
const apiClient = require('../../utils/apiClient.js');
const AV = require('../../utils/av-weapp.min.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(666666, "onLoad Profile.js")
    let page = this;
    //console.log("this", this);
    // const user_id = wx.getStorageSync('userInfo').userId

    // Get user data from server (to show in form)
    apiClient.get({
      path: 'profile',
      success(res) {
        console.log(333333, res.data)
        var _profile = res.data.profile;
        var _active_items = res.data.active_items;
        var _expired_items = res.data.expired_items;
        // var storage = wx.getStorageSync(key)
        // save profile at this.data.profile
        page.setData({
          profile: _profile,
          active_items: _active_items,
          expired_items: _expired_items
        });
      }
    })

  },

  showItem: function (e) {
    const id = e.currentTarget.dataset.id

    wx.navigateTo({
      url: `/pages/show/show?id=${id}`,
    })
  },

   openConfirm: function (e) {
    wx.showModal({
      title: 'Please Confirm',
      content: 'Are you really want to delete this item?',
      confirmText: "confirm",
      cancelText: "cancel",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          console.log("waht",e);
          const id = e.currentTarget.dataset.id
          apiClient.delete({
            path: `items/${id}`,
            success(res) {
              wx.reLaunch({
                url: '/pages/profile/profile',
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) { },
              });
            }
          });
        } else {
          console.log('canceled')
        }
      }
    });
  },
  

  editProfile: function(){
    wx.navigateTo({
      url: `/pages/edit-profile/edit-profile`,
    })

  },

  uploadImages: function () {
    let that = this

    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log("res", res)
        let tempFilePath = res.tempFilePaths[0];
        that.setData({ imagePath: tempFilePath })
        console.log("tempFilePath", tempFilePath)
        new AV.File('file-name', {
          blob: {
            uri: tempFilePath,
          },
        }).save().then(
          file => {
            console.log("file.url", file.url())
            that.setData({
              imagePath: file.url()
            });
            console.log("imagePath", that.data.imagePath)
            //  console.log("liveurl", that.data.imagePath)
          },

          ).catch(console.error);
        // console.log("liveurl", that.data.imagePath )
        // let imagePath = file.url()
        // that.setData({ imagePath: file.url() })
        wx.showToast({
          title: 'UPLOADED',
          icon: 'success',
          duration: 1000
        })
      }
    });
  },

  submitImage: function () {
    let that = this;
    let userContact = { qr_code: that.data.imagePath };
    apiClient.put({
      path: 'profile',
      data: {
        userContact: userContact
      },
      success(res) {
        // res.data = profile;
        console.log("response information", res.data)
        wx.reLaunch({
          url: '/pages/profile/profile'
        });
      }
    })
  },

  goToEditPage: function (e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/edit/edit?id=${id}`
    })
  },

  reactivate: function (e) {
    let page = this;
    const id = e.currentTarget.dataset.id;
    apiClient.put({
      path: `reactivate/${id}`,
      success(res) {
        wx.reLaunch({
          url: '/pages/profile/profile',
        })
      }
    })
  },
  //* Navabar Function*//

  goHome: function (e) {
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },
  goAdd: function (e) {
    wx.reLaunch({
      url: '/pages/add/add'
    })
  },
  goProfile: function (e) {
    wx.reLaunch({
      url: '/pages/profile/profile'
    })
  },
  onShow: function() {
    this.onLoad()
  }

  //* Navabar Function*//

      
})
