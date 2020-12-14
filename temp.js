var myCharts = require("../../utils/util.js")

const devicesId = "642905620" 

const api_key = "vd0At4RIccV74uS1dLJ9=2mmdtg=" 

Page({
  data: {
    temp:"",
    amount:"",
    shuiwenfankui1:"",
    shuiwenfankui2:"",
    shuiwenfankui3:"",
    },
  xiaozhishi1:function(res){
    if(this.data.temp>=45)
    {
      wx.showModal({
        title:"Warn",
        confirmText: 'Okk',
        content:"  Oooooo,dear,the water in this bottle is too hot to drink!!! Just wait a little while,please.",
      })
     
    }else if(this.data.temp<45&&this.data.temp>=30)
     {  wx.showModal({
      title:"推荐饮用",
      confirmText: 'Great！',
      content:"  You can drink it! It is the best time that you can enjoy it(*￣︶￣).",

    })
    }else{
      wx.showModal({
        title:"再..加点热水？",
        confirmText: 'Emmm，ok',
        content:"  The temperature is too low to drink it enjoyably. If you want to have a better experience,please put hotter water in this bottle.",

      })
    }
  },

  xiaozhishi2:function(){
    if(this.data.amount){
      wx.showModal({
        title:"喝水提醒",
        confirmText: 'Okk',
        cancelText:"Noooo!",
        content:"您已经超过两小时未喝水。学习工作之余也不要忘了喝水鸭~"
      })
    }else{
      this.setData({
        shuiliangfankui:"一天喝对水，身体健康棒！(๑•̀ㅂ•́)و✧今天的你喝水情况棒棒哒，为你鼓掌~明天也要继续坚持噢"
      })
    }
  },
  

  /**
   * @description 页面下拉刷新事件
   */
  onPullDownRefresh: function () {
    wx.showLoading({
      title: "正在获取"
    })
    this.getDatapoints().then(datapoints => {
      this.update(datapoints)
      wx.hideLoading()
    }).catch((error) => {
      wx.hideLoading()
      console.error(error)
    })
  },
  onLoad: function () {
    console.log(`your deviceId: ${devicesId}, apiKey: ${api_key}`)
    const timer = setInterval(() => {
      this.getDatapoints().then(datapoints => {
        this.update(datapoints)
      })
    }, 5000)

    wx.showLoading({
      title: '加载中'
    })

    this.getDatapoints().then((datapoints) => {
      wx.hideLoading()
      this.firstDraw(datapoints)
    }).catch((err) => {
      wx.hideLoading()
      clearInterval(timer) 
    })
  },

  getDatapoints: function () {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `https://api.heclouds.com/devices/${devicesId}/datapoints?datastream_id=Temperature,Amount&limit=20`,
        header: {
          'content-type': 'application/json',
          'api-key': api_key
        },
        success: (res) => {
          const status = res.statusCode
          const response = res.data
          console.log(response.data.datastreams[0].datapoints[0].value)
          console.log(response.data.datastreams[1])
          this.setData({
            temp:response.data.datastreams[0].datapoints[0].value,
            amount:response.data.datastreams[1].datapoints[0].value
          })
          if (status !== 200) { 
            reject(res.data)
            return ;
          }
          if (response.errno !== 0) {
            reject(response.error)
            return ;
          }

          if (response.data.datastreams.length === 0) {
            reject("当前设备无数据, 请先运行硬件实验")
          }
          resolve({
            temperature: response.data.datastreams[0].datapoints.reverse(),
            amount: response.data.datastreams[1].datapoints.reverse()
          })
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  },

  update: function (datapoints) {
    const temperatureData = this.convert(datapoints);

    this.lineChart_amo.updateData({
      categories: temperatureData.categories,
      series: [{
        name: 'amount',
        data: temperatureData.amount,
        format: (val, name) => val.toFixed(2)
      }],
    })

    this.lineChart_tempe.updateData({
      categories: temperatureData.categories,
      series: [{
        name: 'tempe',
        data: temperatureData.tempe,
        format: (val, name) => val.toFixed(2)
      }],
    })

  },

  convert: function (datapoints) {
    var categories = [];
    var amount = [];
    var tempe = [];

    var length = datapoints.temperature.length
    for (var i = 0; i < length; i++) {
      categories.push(datapoints.amount[i].at.slice(5, 19));
      amount.push(datapoints.amount[i].value);
      tempe.push(datapoints.temperature[i].value);
    }
    return {
      categories: categories,
      amount: amount,
      tempe: tempe
    }
  },

  firstDraw: function (datapoints) {

    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    var temperatureData = this.convert(datapoints);

    this.lineChart_amo = new myCharts({
      canvasId: 'amount',
      type: 'line',
      categories: temperatureData.categories,
      animation: false,
      background: '#f5f5f5',
      series: [{
        name: 'amount',
        data: temperatureData.amount,
        format: function (val, name) {
          return val.toFixed(2);
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: 'amount(mL)',
        format: function (val) {
          return val.toFixed(2);
        }
      },
      width: windowWidth,
      height: 200,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });

    this.lineChart_tempe = new myCharts({
      canvasId: 'tempe',
      type: 'line',
      categories: temperatureData.categories,
      animation: false,
      background: '#f5f5f5',
      series: [{
        name: 'temperature',
        data: temperatureData.tempe,
        format: function (val, name) {
          return val.toFixed(2);
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: 'temperature (摄氏度)',
        format: function (val) {
          return val.toFixed(2);
        }
      },
      width: windowWidth,
      height: 200,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });
  },
  
})
