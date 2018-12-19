// pages/next/next.js
const app = getApp()
var a = app.globalData.b;
function formatTime(seconds) {
  return [parseInt(seconds / 60 / 60), // 时
  parseInt(seconds / 60 % 60),
  // 分 

  parseInt(seconds % 60) // 秒 
  ].join(":").replace(/\b(\d)\b/g, "0$1");
}

var timer;
Page({
  switch1Change: function (e) {
    console.log('switch1 发生 change 事件，携带值为', e.detail.value)
  },
  onReady: function (e) {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createAudioContext('myAudio')
  },
  data: {
  },
  onLoad: function () {

  },
  sj: function () {
    var that = this;
    wx.request({
      url: 'https://api.heclouds.com/devices/502985759/datapoints?datastream_id=Temperature,Humidity&limit=1',
      header: {
        'content-type': 'application/json',
        'api-key': 'd1B354a5=Zmm9W1kQ1zfoD2E7=c='
      },
      success: function (res) {
        console.log(res)      //打印返回的数据
        if (res.data.data.datastreams[0].datapoints[0].value < 30) {
          wx.playBackgroundAudio({
            dataUrl: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46',
            title: 'tt',
            coverImgUrl: '/pages/image/warning.png'
          })
          wx.showModal({
            title: '提示',
            content: '设备已经从孩子身上脱落！！',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }//温度监测报警，防止检测器被取下或者脱落
        else {
          if (res.data.data.datastreams[0].datapoints[0].value == a) {
            
            wx.playBackgroundAudio({
              dataUrl: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46',
              title: 'tt',
              coverImgUrl: '/pages/image/warning.png'
            })
            wx.showModal({
              title: '提示',
              content: '孩子已经远离您的视线范围！！！', 
             
              success: function (res) {         
                if (res.confirm) {
                  console.log('用户点击确定')
                  wx.pauseBackgroundAudio();
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })

          }
        }//时间监测报警，通过是否连续两次获取的数据相同来判断数据是否还在更新，来确定WiFi是否还在连接，从而判断小孩是否远离
        a = res.data.data.datastreams[0].datapoints[0].value
      }
    })
  },
  Countdown: function () {
    var that = this;
    timer = setTimeout(function () {
      that.sj();
      clearTimeout(a, timer);
      that.Countdown();
    }, 10000)
  },//利用定时器以自动获取实时数据
  startBtn: function () {
    console.log("开始按钮");
    this.Countdown();
  },
  pauseBtn: function () {
    console.log("暂停按钮")
    clearTimeout(timer);
  },
  startBtn: function () {
    console.log("开始按钮");
    this.Countdown();
  },
  pauseBtn: function () {
    console.log("暂停按钮")
    clearTimeout(timer);
  },
})
