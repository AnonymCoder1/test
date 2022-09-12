Vue.config.productionTip = false
let app =  new Vue({
  el: '#app',
  data() {
    return {
      isEn: true,

      // 表单数据
      dataForm: {
        // 邮箱
        email: '',
        // 密码
        password: ''
      }
    }
  },
  methods: {
    // 点击sign in 按钮的回调
    signIn() {
      // 可以发请求
      try {
        axios({
          url: `/renren-fast/app/login`,
          method: 'POST',
          data: {
            email: this.dataForm.email,
            password: this.dataForm.password
          }
        })
          .then(({ data }) => {
            let repairInfo = localStorage.getItem('repairInfo') !== 'undefined' ? JSON.parse(localStorage.getItem('repairInfo')) : undefined
            let concatInfo = localStorage.getItem('concatInfo') !== 'undefined' ? JSON.parse(localStorage.getItem('concatInfo')) : undefined
            let repairOrderCheckInfo = localStorage.getItem('repairOrderCheckInfo') !== 'undefined' ? JSON.parse(localStorage.getItem('repairOrderCheckInfo')) : undefined
            let isEn = localStorage.getItem('isEn') ? JSON.parse(localStorage.getItem('isEn')) : undefined
            // 来自维修工单的跳转
            if (repairInfo) {
              if (data.code === 0) {
                localStorage.setItem('token', data.token)
                localStorage.setItem('userInfo', JSON.stringify(data.user))
                repairInfo.userId = data.user.userId
              } else {
                alertMessage(data.msg, 'error')
              }
              axios({
                url: `/renren-fast/app/repairmaininsert/save`,
                method: `POST`,
                data: repairInfo
              })
              localStorage.removeItem('repairInfo')
              location.href = 'personal_repairOrder.html'
              return
            }
            // 来自个人中心的维修工单的跳转
            if (repairOrderCheckInfo) {
              if (data.code === 0) {
                localStorage.setItem('token', data.token)
                localStorage.setItem('userInfo', JSON.stringify(data.user))
                repairOrderCheckInfo.userId = data.user.userId
              } else {
                alertMessage(data.msg, 'error')
              }
              axios({
                url: `/renren-fast/app/personalCenterRepairWorkOrder/update`,
                method: `POST`,
                data: repairOrderCheckInfo
              })
              localStorage.removeItem('repairInfo')
              alert(isEn ? `Modified successfully` : `修改成功`)
              location.href = 'personal_repairOrder.html'
              return
            }
            // 来自联系我们的跳转
            if (concatInfo) {
              if (data.code === 0) {
                localStorage.setItem('token', data.token)
                localStorage.setItem('userInfo', JSON.stringify(data.user))
                axios({
                  url: `/renren-fast/app/contact/save`,
                  method: `POST`,
                  data: {
                    ...concatInfo
                    , userId: data.user.userId
                  }
                }).then(({ data }) => {
                  if (data.code == 0) {
                    localStorage.removeItem('concatInfo')
                    alert(isEn ? `Submitted successfully` : `提交成功`)
                    location.href = '../../index.html'
                    return
                  } else {
                    alert(data.msg)
                  }
                })
              } else {
                alertMessage(data.msg, 'error')
                return
              }
              return
            }

            if (data.code === 0) {
              console.log(data)
              localStorage.setItem('token', data.token)
              localStorage.setItem('userInfo', JSON.stringify(data.user))
              // 如果有上一个页面的href
              if (sessionStorage.getItem('prevNav')) {
                // console.log(sessionStorage.getItem('prevNav').indexOf('index'));
                if (sessionStorage.getItem('prevNav').indexOf('index') !== -1) {
                  sessionStorage.setItem('prevNav', 'personal.html')
                }
                location.href = sessionStorage.getItem('prevNav')
                sessionStorage.removeItem('prevNav')
              } else {
                // 没有上一个页面的href
                location.href = 'personal.html'
              }
            } else {
              alertMessage(data.msg, 'error')
            }
          })
          .catch(e => {
            console.log(e)
          })
      } catch (e) {
        console.log(e)
        alertMessage('登录失败', 'error')
      }
    },
    // 手动初始化 腾讯防水墙
    initTencentWaterproofWall() {
      // console.log('TencentCaptcha:', TencentCaptcha);
      new TencentCaptcha(this.$refs.TencentWater, '2065634367', (res) => {
        // console.log('调用了防水墙');
        // ret为0时，代表验证成功
        if (res.ret == 0) {
          // console.log(this);
          // 调用后台接口
          // axios({
          //   url: `/renren-fast/sys/TCaptchaVerify/verifyTicket`, params: {
          //     rand: res.randstr,
          //     ticket: res.ticket
          //   }
          // }).then(({ data }) => {
          //   // console.log(data);
          //   if (data.code == 0) {
          //     this.signIn()
          //   } else {
          //     alertMessage(data.msg, 'error')
          //   }
          // })
          console.log('登陆');
          this.signIn()
        } else {
          alertMessage(this.isEn ? `Please complete the verification process correctly` : '请正确完成验证过程', 'error')
        }
      },
        {
          userLanguage: JSON.parse(localStorage.getItem('isEn')) ? 'en' : `zh-cn`
        })
      // this.signIn()
    }
  },
  created() {
    let title = document.querySelector('title')
    title.innerHTML = this.isEn ? 'WhatsMiner' : '比特微'
    let link = document.querySelector('.link')
    if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
      link.href = './css/login_750.css'
      document.documentElement.style.fontSize = '1.5625vw'
    }
    // this.isEn = JSON.parse(localStorage.getItem('isEn'))
    JSON.parse(localStorage.getItem('isEn')) == null ? this.isEn = true : this.isEn = JSON.parse(localStorage.getItem('isEn'));
    window.onstorage = e => {
      if (e.key == 'isEn') {
        this.isEn = JSON.parse(e.newValue)
      }
    }
  },
  mounted() {
    this.initTencentWaterproofWall()
  },
  watch: {
    isEn(newVal) {
      localStorage.setItem('isEn', JSON.stringify(newVal));
    }
  }
})
