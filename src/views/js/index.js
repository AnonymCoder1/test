Vue.config.productionTip = false
window.vm = new Vue({
  el: '#app',
  components: {
    // headBox,
  },
  data() {
    return {
      isMobi: true, //true代表移动端，false代表pc端
      // 英文banner的数据
      bannerEnData: [],
      // 中文banner的数据
      bannerZhData: [],
      // 下面的数据
      data: [],
      // 底部三条新闻的数据
      newsData: [],
      // 是否是英文状态
      isEn: true,
      // 横幅消息
      bannerInfo: '',
      // 移动端图片
      coreAdvantageStatic_phone: [],
      // 是否展示活动模块
      isShowActive: true,
      // 是否隐藏全站通知
      isCloseMsg: false,
      mobileType: 1,
      // 是否禁用更多支持
      isDisabledMoreSupport: false
    }
  },
  created() {
    // let title = document.querySelector('title')
    // title.innerHTML = this.isEn ? 'WhatsMiner' : '比特微'
    let link = document.querySelector('.link')
    if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
      link.href = './src/views/css/index_750.css'
      document.documentElement.style.fontSize = '1.5625vw'
    }
    if (localStorage.getItem('isEn')) {
      this.isEn = JSON.parse(localStorage.getItem('isEn'))
    } else {
      localStorage.setItem('isEn', 'true')
    }
    localStorage.setItem('prevNav', location.href)
    localStorage.setItem('navId', 0)
    this.getData()
    this.isCloseMsg = (sessionStorage.getItem('isCloseMsg') && sessionStorage.getItem('isCloseMsg').length) || false
  },
  methods: {
    toProduct(){
      let url =  localStorage.getItem("productType")=="sample"? "./src/views/product.html":"./src/views/products.html"
      location.href = url;
    },
    // 关闭横幅消息
    close() {
      this.$refs.imgClose1.style.display = 'none'
      sessionStorage.setItem('isCloseMsg', 'true')
    },
    // 关闭横幅消息
    close2() {
      this.$refs.imgClose2.style.display = 'none'
      sessionStorage.setItem('isCloseMsg', 'true')
    },
    getData() {
      // 获取banner的数据
      axios({
        url: `/renren-fast/app/banner/list`,
        params: {
          locationType: 1
        }
      }).then(({ data }) => {
        // 处理linkUrl没有带http的情况
        data.data.forEach(item => {
          item.linkUrl = item.linkUrl.startsWith('http') ? item.linkUrl : `http://${item.linkUrl}`
        })
        console.log('banner文字数据', data)
        this.bannerZhData = data.data.filter(item => item.langType == 1).sort((a, b) => a.showOrder - b.showOrder)
        this.bannerEnData = data.data.filter(item => item.langType == 2).sort((a, b) => a.showOrder - b.showOrder)
        if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
          document.documentElement.style.fontSize = '1.5625vw'
          this.mobileType = 2
        }
        console.log('中文banner的数据：', this.bannerZhData)
        console.log('英文banner的数据：', this.bannerEnData)
      })
      // 获取移动端的数据
      axios({
        url: `/renren-fast/app/home/queryMoveList`,
        params: {
          locationType: 1
        }
      }).then(({ data }) => {
        this.coreAdvantageStatic_phone = data.showPicEntities || []
        console.log(this.coreAdvantageStatic_phone, '首页移动端图片')
      })
      // 判断展不展示活动模块
      axios({ url: `/renren-fast/app/RepairWorkOrder/saleAfter` }).then(({ data }) => {
        if (data.saleAfterList.filter(item => item.id == 7)[0]) {
          this.isShowActive = !!+data.saleAfterList.filter(item => item.id == 7)[0].paramValue
        }
        console.log('是否显示活动模块', this.isShowActive)
      })
      // 获取其他数据
      axios(`/renren-fast/app/home/queryList`).then(({ data }) => {
        this.data = data.homeStatic || []
        console.log(data)
        console.log('其他数据', data.homeStatic)
      })
      // 获取底部前三条动态的数据
      axios(`/renren-fast/app/news/querynewsfirst1`).then(({ data }) => {
        data.newsEntities.forEach(item => {
          item.releaseTime = this.formatDate(item.releaseTime)
        })
        this.newsData = data.newsEntities
        console.log('底部前三条新闻的数据', this.newsData)
      })
      // 获取全站消息的数据
      axios({
        url: `/renren-fast/app/notification/streamer`
      }).then(({ data }) => {
        if (data.code == 0 && data.data != null) {
          this.bannerInfo = data.data
          this.isShowMsg = data.data.status == 1
          setTimeout(() => {
            let messageBox = document.querySelectorAll('.message-wrap .animate_set .message')
            messageBox.forEach(element => {
              console.log(element.offsetWidth)
              if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
                element.offsetWidth > 414 ? (element.style.animation = 'example 75s linear infinite') : (element.style.animation = 'example 40s linear infinite')
                document.documentElement.style.fontSize = '1.5625vw'
                return
              }
              element.offsetWidth > 1920 ? (element.style.animation = 'example 75s linear infinite') : (element.style.animation = 'example 40s linear infinite')
            })
            console.log(messageBox)
          })
          console.log('横幅消息', this.bannerInfo)
        }
      })
      // 获取是否禁用更多支持的数据
      axios({ url: `/renren-fast/app/RepairWorkOrder/saleAfter` }).then(({ data }) => {
        if (data.code == 0) {
          this.isDisabledMoreSupport = !+data.saleAfterList[1].paramValue
          // console.log('是否禁用更多支持', this.isDisabledMoreSupport);
          console.log('是否禁用更多支持', !+data.saleAfterList[1].paramValue);
        }
      })

    },
    // 格式化时间函数
    formatDate(date) {
      let time = new Date(date)
      let y = time.getFullYear()
      let m = time.getMonth() + 1
      let d = time.getDate()
      return `${y}.${m}.${d}`
    },
    toDynamic_detail(item) {
      let title = (item.titleEn.split(" ")).join("-");
      window.location.href = `./src/views/dynamic_detail.html?id=${item.id}&type=1&title=${title}`
    },
    videoOk() {
      let cover = document.querySelectorAll('.video-cover'),
        video = document.querySelectorAll('.video')
      cover.forEach(item => {
        item.style.display = 'none'
      })
      video.forEach(item => {
        item.style.display = 'block'
      })
    },
    bannerHover(e, type) {
      if (type == 'left') {
        e.currentTarget.className = 'banner-item active'
        if (e.currentTarget.nextElementSibling) {
          e.currentTarget.nextElementSibling.className = 'banner-item'
        }
      } else if (type == 'right') {
        e.currentTarget.className = 'banner-item active'
        if (e.currentTarget.previousElementSibling) {
          e.currentTarget.previousElementSibling.className = 'banner-item'
        }
      }
    },
    location() {
      location.href = './src/views/dynamic.html'
    },
    toCurrent() {
      location.href = './index.html'
    }
  },
  mounted() {
    window.onstorage = e => {
      if (e.key == 'isEn') {
        this.isEn = JSON.parse(e.newValue)
      }
    }
    window.onload = function () {
      let video = document.querySelector('video')
      video.play()
    }
    document.ontouchstart = function () {
      let video = document.querySelector('video')
      video.play()
      document.ontouchstart = null
    }
  },
  watch: {
    isEn() {
      // 获取底部前三条动态的数据
      axios(`/renren-fast/app/news/querynewsfirst?count=3&type=1`).then(({ data }) => {
        data.newsEntities.forEach(item => {
          item.releaseTime = this.formatDate(item.releaseTime)
        })
        this.newsData = data.newsEntities
        console.log('底部前三条新闻的数据', this.newsData)
      })
      setTimeout(() => {
        let messageBox = document.querySelectorAll('.message-wrap .animate_set .message')
        messageBox.forEach(element => {
          console.log(element.offsetWidth)
          if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
            element.offsetWidth > 414 ? (element.style.animation = 'example 75s linear infinite') : (element.style.animation = 'example 40s linear infinite')
            document.documentElement.style.fontSize = '1.5625vw'
            return
          }
          element.offsetWidth > 1920 ? (element.style.animation = 'example 75s linear infinite') : (element.style.animation = 'example 40s linear infinite')
        })
        console.log(messageBox)
      })
    }
  }
})
