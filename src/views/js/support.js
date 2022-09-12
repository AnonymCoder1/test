window.vm = new Vue({
  el: '#app',
  data() {
    return {
      // 配件购买的弹窗信息
      accessoriesPurchase: {},
      是否显示购买配件弹窗: false,
      bannerInfo: '',
      isEn: true,
      // 是否显示维修指南弹框
      isShowRepairGuide: false,
      // 维修指南的数据
      repairGuide: '',
      // 底部四个的状态数据
      saleAfterList: [],
      msg: null,
      // 是否显示搜索内容
      isShowSelect: false,
      date: '',
      searchValue: '',
      dataState: '',
      // 是否关闭横幅
      isCloseMsg: false
    }
  },
  methods: {
    toProduct() {
      let url = localStorage.getItem("productType") == "sample" ? "./product.html" : "./products.html"
      location.href = url;
    },
    // 横幅消息
    getBannerInfo() {
      axios(`/renren-fast/app/notification/streamer`)
        .then(({ data }) => {
          if (data.code == 0) {
            console.log('横幅消息', data.data)
            this.bannerInfo = data.data
            setTimeout(() => {
              let messageBox = document.querySelectorAll('.message-wrap .animate_set .message')
              messageBox.forEach(element => {
                console.log(element.offsetWidth)
                if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
                  element.offsetWidth > 414 ? (element.style.animation = 'example 75s linear infinite') : (element.style.animation = 'example 40s linear infinite')
                  return
                }
                element.offsetWidth > 1920 ? (element.style.animation = 'example 75s linear infinite') : (element.style.animation = 'example 40s linear infinite')
              })
              console.log(messageBox)
            })
          }
        })
        .catch(e => {
          console.log(e)
        })
    },
    // 关闭横幅消息
    close() {
      this.$refs.imgClose.style.display = 'none'
      sessionStorage.setItem('isCloseMsg', 'true')
    },
    // 点击维修指南的关闭按钮
    closeRepairGuide() {
      this.isShowRepairGuide = false
      document.body.style.overflow = 'auto'
    },
    // 输入框输入的回调
    // query(e) {
    //   // 如果输入框为空
    //   if (!e.target.value.trim()) {
    //     this.isShowSelect = false;
    //     this.msg = '';
    //     return;
    //   }
    // },
    searchDate() {
      if (!this.searchValue) return
      axios({
        url: `/renren-fast/app/RepairWorkOrder/warranty`,
        params: {
          str: this.searchValue
        }
      })
        .then(({ data }) => {
          console.log(data)
          this.isShowSelect = true
          if (data.code == 0) {
            this.dataState = data.code
            // this.date = this.formatDate(data.dateList[1])
            this.date = data.dateList[1].slice(0, 10)
            this.msg = this.isEn ? `The warranty period is up to ${this.date}, If you have any questions, please contact customer service!` : `保修期至${this.date}，如果您有任何疑问，请联系客服！`
          } else {
            this.dataState = data.code
            this.msg = data.msg
            console.log(data.code)
          }
        })
        .catch(e => {
          console.log(e)
        })
    },
    // 点击查询日期的回调
    close_select() {
      this.isShowSelect = false
      this.msg = ''
    },
    // 点击维修指南的回调
    ShowRepairGuide() {
      this.isShowRepairGuide = true
      document.body.style.overflow = 'hidden'
      document.body.scrollIntoView({
        behavior: 'smooth'
      })
    },
    To2(isDisabled, href) {
      isDisabled = !+isDisabled
      if (!isDisabled && href == './parts.html') {
        this.是否显示购买配件弹窗 = true
        return
      }
      !isDisabled && (location.href = href)
    },
    To(href) {
      location.href = href
    },
    init() {
      // 维修指南
      axios(`/renren-fast/app/policy/queryMaintenanceManual`).then(({ data }) => {
        // console.log('维修指南数据', data.policyEntity)
        this.repairGuide = data.policyEntity
      })
      // 底部四个的状态数据
      axios({ url: `/renren-fast/app/RepairWorkOrder/saleAfter` }).then(({ data }) => {
        // console.log('底部四个的状态数据', data && data.saleAfterList)
        if (data.code == 0) {
          this.saleAfterList = data ? data.saleAfterList : ''
        }
      })
      // 配件购买的弹窗信息
      axios('/renren-fast/app/policy/accessoriesPurchase').then(res => {
        // console.log('配件购买弹窗数据', res.data.policyEntity);
        this.accessoriesPurchase = res.data.policyEntity
      })
    },
    formatDate(date) {
      let time = new Date(date)
      let y = time.getFullYear()
      let m = time.getMonth() + 1
      let d = time.getDate()
      return `${y}-${m}-${d}`
    }
  },
  created() {
    // let title = document.querySelector('title')
    // title.innerHTML = this.isEn ? 'WhatsMiner' : '比特微'
    this.getBannerInfo()
    let link = document.querySelector('.link')
    if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
      link.href = './css/support_750.css'
      document.documentElement.style.fontSize = '1.5625vw'
    }
    localStorage.setItem('navId', 3)
    // this.isEn = JSON.parse(localStorage.getItem('isEn'));
    JSON.parse(localStorage.getItem('isEn')) == null ? (this.isEn = true) : (this.isEn = JSON.parse(localStorage.getItem('isEn')))
    window.onstorage = e => {
      if (e.key == 'isEn') {
        this.isEn = JSON.parse(e.newValue)
      }
      if (e.key == 'isActive') {
        this.isActive = JSON.parse(e.newValue)
      }
    }
    this.init()
    this.isCloseMsg = (sessionStorage.getItem('isCloseMsg') && sessionStorage.getItem('isCloseMsg').length) || false
  },
  watch: {
    isEn(newVal) {
      localStorage.setItem('isEn', JSON.stringify(newVal))
      if (this.dataState == 0) {
        this.msg = newVal ? `The warranty period is up to ${this.date}, If you have any questions, please contact customer service!` : `保修期至${this.date}，如果您有任何疑问，请联系客服！`
      } else {
        this.msg = newVal ? `If you can't find the result, please check carefully and then enter` : `查询不到结果请仔细查询后再输入!`
      }
    }
  }
})
