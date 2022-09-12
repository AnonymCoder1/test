Vue.config.productionTip = false
// 请求拦截
axios.interceptors.request.use(
  data => {
    let token = localStorage.getItem('token')
    // console.log(token); // 该处可以将config打印出来看一下，该部分将发送给后端（server端）
    data.headers.token = token
    return data // 对config处理完后返回，下一步将向后端发送请求
  },
  error => {
    // 当发生错误时，执行该部分代码
    console.log(error) //调试用
    return Promise.reject(error)
  }
)
new Vue({
  el: '#app',
  data() {
    return {
      bannerInfo: '',
      productType: '',
      avatarimageUrl: '',
      privacyPolicy: {},
      isShowPrivacyPolicy: false,
      // 会员等级数据
      vipTableData: [],
      // successNext: false,
      errorMsg: '',
      // 图片上传成功为true反正false
      successPhoto: false,
      islanguage: false,
      // 登录状态1为登录0为未登录
      loginType: 1,
      // 会员规则数据
      vipRuleData: {},
      realData: {},
      isEn: true,
      userInfo: {},
      // 进度条的长度
      progressBar: 0,
      // 是否显示实名认证
      realName: false,
      // 是否显示用户规则的好处
      isShowUserRule: false,
      // 是否显示修改邮箱的弹窗
      isShowChangeEmail: false,
      // 是否显示修改手机号的弹窗
      isShowChangePhone: false,
      // // 是否显示修改密码的弹窗
      isShowChangePassword: false,
      // 实名认证当前的进度
      currentStep: 1,
      // 实名认证步骤三的选择框
      options: [
        {
          value: '0',
          label: `中国`
        },
        {
          value: '1',
          label: `外国`
        }
      ],
      isLogin: false,
      // 实名认证要提交的数据
      // 实名认证的类型,0是个人，1是企业
      accountType: 0,
      address: '',
      // 选择框的值  国籍 0中国1外国
      nationality: '',
      name: '',
      gender: '0',
      // 营业执照号
      taxid: '',
      // 审核状态:0未审核1通过2未通过
      state: '0',
      imageUrl: '',
      imgUrl: '',
      // 用于文件上传的路径
      baseUrl: '',
      // 更改手机号弹窗的原手机号（替换成*之后的数据）
      phone: '',
      // 当前修改邮箱的步骤
      currentChangeEmailStep: 0,
      // 当前更改手机号的步骤
      currentChangePhoneStep: 0,
      // 当前修改密码的步骤
      currentChangePasswordStep: 0,
      // 所有国家的手机号前缀
      internationalDistrictNum: [],
      // 用户选择的国家区号前缀
      countryCode: 86,
      // 新的手机号
      newPhone: '',
      // 新的邮箱
      newEmail: '',
      // 验证码
      verificationCode: '',
      vip: {
        nameEn: '',
        nameCn: '',
        pointEnd: ''
      },
      // 用户经验值
      point: 0,
      // 发送验证码的倒计时
      disabledTime: null,
      // TODO
      duration: 60,
      // 会员权益弹框
      isDialog_box1: false,
      // 退出登录弹框
      isloginout_box: false,
      // 修改密码的旧密码
      oldPassword: '',
      newPassword: '',
      // 再次输入的密码
      repeatPassword: '',
      // 是否关闭横幅
      isCloseMsg: false
    }
  },
  created() {
    let title = document.querySelector('title')
    title.innerHTML = this.isEn ? 'WhatsMiner' : '比特微'
    let link = document.querySelector('.link')
    if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
      document.documentElement.style.fontSize = '1.5625vw'
      link.href = './css/personal_750.css'
    }
    localStorage.setItem('nav-bar-id', 1)
    this.baseUrl = axios.defaults.baseURL
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    this.userInfo ? (this.isLogin = true) : (this.isLogin = false)
    this.getUserInfo()
    // this.isEn = JSON.parse(localStorage.getItem('isEn'));
    JSON.parse(localStorage.getItem('isEn')) == null ? (this.isEn = true) : (this.isEn = JSON.parse(localStorage.getItem('isEn')))
    window.onstorage = e => {
      if (e.key == 'isEn') {
        this.isEn = JSON.parse(e.newValue)
        this.options[0].label = this.isEn ? `China` : `中国`
        this.options[1].label = this.isEn ? `foreign country` : `外国`
        document.querySelector('title').innerHTML = this.isEn ? 'WhatsMiner' : '比特微'
      }
      if (e.key == 'isActive') {
        this.isActive = JSON.parse(e.newValue)
      }
    }
    axios.get("/renren-fast/app/getProductType").then(res => {
        if (res.status == 200 && res.data.code == 0) {
            this.productType = res.data.productType;
            localStorage.setItem("productType", this.productType)
        }
    });
    this.options[0].label = this.isEn ? `China` : `中国`
    this.options[1].label = this.isEn ? `foreign country` : `外国`
    this.nationality = this.options[0].value
    document.querySelector('title').innerHTML = this.isEn ? 'WhatsMiner' : '比特微'
    this.getPrivacy()
    this.getVip1()
    this.getBannerInfo()
    this.isCloseMsg = (sessionStorage.getItem('isCloseMsg') && sessionStorage.getItem('isCloseMsg').length) || false
    console.log(this.vip.pointEnd)
  },
  methods: {
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
            })
          }
        })
        .catch(e => {
          console.log(e)
        })
    },
    // 关闭横幅消息
    closeMsg() {
      this.$refs.imgClose.style.display = 'none'
      sessionStorage.setItem('isCloseMsg', 'true')
    },
    getVip1() {
      axios(`/renren-fast/app/policy/queryMembershipRules`).then(({ data }) => {
        // console.log(data)
        this.vipRuleData = data.policyEntity
      })
    },
    async init(speed = 16) {
      let totalLength = this.point / (this.vip.pointEnd / 100)
      let timer = setInterval(() => {
        this.progressBar < totalLength ? this.progressBar++ : clearInterval(timer)
      }, speed)

      // 获取国家手机号前缀的数据
      axios(`/renren-fast/app/country/list`).then(({ data }) => {
        // console.log(data.data);
        this.internationalDistrictNum = data.data
      })
    },
    //获取认证信息
    // showRealName(){
    //   axios({ url: `/renren-fast/app/policy/queryMembershipRules` }).then(({data})=>{
    //     console.log(data,'111')
    //   })
    // },
    async getUserInfo() {
      // 获取用户信息数据
      await axios({ url: `/renren-fast/app/user/userinfo` }).then(({ data }) => {
        console.log('用户信息', data.data)
        if (data.code == 0) {
          data.data.state = data.data.state || 0
          this.userInfo = data.data
        }
        if (data.code == 401) {
          alert(this.isEn ? `Login failed, please login again` : '登录失效,请重新登录')
          location.href = 'login.html'
        }
        this.point = data && data.data && data.data.point
        this.getVipDate()
        console.log(this.vip.pointEnd)
      })
    },
    //上传头像
    UploadImage(params) {
      const formData = new FormData()
      formData.append('file', params.file)
      formData.append('userId', JSON.parse(localStorage.getItem('userInfo')).userId)
      axios({
        method: 'POST',
        url: `/renren-fast/app/user/updateAvatar`,
        data: formData
      }).then(res => {
        this.avatarimageUrl = res.data.url
        this.getUserInfo()
      })
    },
    getVipDate() {
      // 获取会员等级数据
      axios({ url: `/renren-fast/app/membership/list` }).then(({ data }) => {
        data.all[length - 1].pointEnd = '~'
        console.table(data.all)
        this.vipTableData = data.all
        var x = data.all.find(x => {
          return this.point >= x.pointBegin && this.point <= x.pointEnd
        })
        if (x) {
          this.vip.nameEn = x.nameEn || ''
          this.vip.nameCn = x.nameCn || ''
          this.vip.pointEnd = x.pointEnd || ''
        }
        console.log(this.vip.pointEnd)

        // 参数是进度条的速度
        this.init(16)
      })
    },
    // 点击实名验证的回调
    showRealName() {
      axios(`/renren-fast/app/policy/queryCertification`).then(({ data }) => {
        if (data.code == 0) {
          this.realData = data.policyEntity
          console.log(this.realData)
          scrollTo(0, 0)
          document.body.style = 'overflow: hidden'
          this.realName = true
          console.log('会员规则的数据：', this.vipRuleData)
        }
      })
    },
    // 点击订阅按钮的回调
    handleSubscribed() {
      console.log(this.userInfo)
      // 未订阅
      if (!this.userInfo.subscribe) {
        console.log('开始订阅')
        axios({ method: 'POST', url: `/renren-fast/app/user/subscribe` }).then(({ data }) => {
          if (data.code == 0) {
            if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
              alert(this.isEn ? `Subscription succeeded` : `订阅成功`)
            } else {
              alertMessage(this.isEn ? `Subscription succeeded` : `订阅成功`, 'success')
            }
            this.userInfo.subscribe = 1
            localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
          } else {
            alertMessage(data.msg, 'error')
          }
        })
        // 已订阅
      } else if (this.userInfo.subscribe == 1) {
        console.log('取消订阅')
        axios({
          url: `/renren-fast/app/user/CancelSubscribe`,
          method: 'POST'
        }).then(({ data }) => {
          if (data.code == 0) {
            if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
              alert(this.isEn ? `Unsubscribed` : `已取消订阅`, 'success')
            } else {
              alertMessage(this.isEn ? `Unsubscribed` : `已取消订阅`, 'success')
            }
            this.userInfo.subscribe = 0
            localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
          } else {
            alertMessage(data.msg, 'error')
          }
        })
      }
    },
    // 点击实名认证关闭按钮的回调
    closeRealName() {
      this.currentStep = 1
      this.realName = false
      document.body.style = 'overflow: auto'
      this.accountType = '0'
      this.nationality = ''
      this.name = ''
      this.gender = '0'
      this.address = ''
      this.taxid = ''
      this.state = '0'
      this.imageUrl = ''
    },
    // 点击更改手机号码的回调
    handleChangePhone() {
      let start = this.userInfo.mobile.split('').splice(0, 3).join(''),
        end = this.userInfo.mobile
          .split('')
          .splice(this.userInfo.mobile.length - 4, this.userInfo.mobile.length)
          .join('')
      this.phone = start + '****' + end
      this.isShowChangePhone = true
    },
    // 点击更改邮箱的回调
    handleChangeEmail() {
      this.isShowChangeEmail = true
    },
    // 点击更改密码的回调
    handleChangePassword() {
      this.isShowChangePassword = true
    },
    // 点击更改手机号关闭按钮的回调
    handleChangeClose(type) {
      try {
        if (type == 'phone') {
          this.isShowChangePhone = false
          this.verificationCode = ''
          this.newPhone = ''
          this.currentChangePhoneStep = 0
          this.disabledTime = null
          this.duration = 60
        }
        if (type == 'email') {
          this.isShowChangeEmail = false
          this.currentChangeEmailStep = 0
          this.disabledTime = null
          this.duration = 60
        }
        if (type == 'password') {
          this.isShowChangePassword = false
          this.currentChangePasswordStep = 0
          this.oldPassword = ''
          this.newPassword = ''
          this.repeatPassword = ''
        }
        clearInterval(this.time)
        let error = document.querySelectorAll('.error_warp')
        error.forEach(item => {
          item.innerHTML = ''
        })
      } catch (error) {
        console.log(error)
      }
    },
    // 点击下一步的按钮
    nextStep() {
      // 提交数据
      if (this.currentStep == 3) {
        let inputs = document.querySelectorAll('.requireds')
        inputs.forEach(function (item) {
          item.onblur()
        })
        let error_wrap = document.querySelectorAll('.error_warp')
        if (error_wrap.length) return
        if (!this.successPhoto) {
          alertMessage(this.isEn ? `Image must be uploaded` : `必须上传图片`, 'error')
          // alert(this.isEn ? `Image must be uploaded` : `必须上传图片`)
          return
        }
        if (this.accountType == 0) {
          // 个人
          axios({
            url: `/renren-fast/app/userverifications/save`,
            data: {
              accountType: this.accountType,
              nationality: this.nationality,
              name: this.name,
              gender: this.gender,
              taxid: this.taxid,
              imgs: this.imageUrl
            },
            method: 'POST'
          })
            .then(({ data }) => {
              if (data.code !== 0) {
                alertMessage(data.msg, 'error')
                return
              } else {
                alertMessage(this.isEn ? `Submitted successfully` : `提交成功`, 'success')
              }
            })
            .catch(e => {
              console.log(e)
            })
        } else if (this.accountType == 1) {
          // 企业
          axios({
            url: `/renren-fast/app/userverifications/save`,
            data: {
              accountType: this.accountType,
              nationality: this.nationality,
              name: this.name,
              address: this.address,
              taxid: this.taxid,
              imgs: this.imageUrl
            },
            method: 'POST'
          })
            .then(({ data }) => {
              if (data.code !== 0) {
                alertMessage(data.msg, 'error')
                return
              } else {
                alertMessage(this.isEn ? `Submitted successfully` : `提交成功`, 'success')
              }
            })
            .catch(e => {
              console.log(e)
            })
        }
      }
      let steps = document.querySelectorAll('.step-info span')
      this.currentStep++
      // 修改按钮文字
      if (this.currentStep == 3) {
        let nextBtn = document.querySelector('.next-step')
        nextBtn.innerHTML = this.isEn ? 'Submit' : '提交'
      }
      // 修改步骤条的类名
      steps.forEach((item, index) => {
        item.className = 'step-item'
        if (index < this.currentStep - 1) {
          item.className += ' done'
        }
      })
      steps[this.currentStep - 1].className += ' current'
    },
    // 点击上一步的回调
    prevStep() {
      let steps = document.querySelectorAll('.step-info span')
      this.currentStep--
      if (this.currentStep < 3) {
        let nextBtn = document.querySelector('.next-step')
        nextBtn.innerHTML = this.isEn ? 'Next Step' : '下一步'
      }
      steps.forEach((item, index) => {
        item.className = 'step-item'
        if (index < this.currentStep - 1) {
          item.className += ' done'
        }
      })
      steps[this.currentStep - 1].className += ' current'
    },
    // 上传图片相关
    handleAvatarSuccess(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw);
      this.imageUrl = res.url
      // this.imageUrl = res.id
      this.imgUrl = res.url
      console.log(this.imageUrl);
      this.successPhoto = true
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG && !isPNG) {
        this.$message.error(this.isEn ? 'The uploaded avatar image can only be in JPG and PNG format!' : '上传头像图片只能是 JPG或者PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error(this.isEn ? 'Upload avatar images that cannot exceed 2MB in size!' : '上传头像图片大小不能超过 2MB!')
      }
      return (isJPG || isPNG) && isLt2M
      // return isLt2M;
    },
    // 点击获取验证码的回调
    async getCode(type) {
      //手机 步骤一
      if (type == 'phone' && this.currentChangePhoneStep == 0) {
        this.disabledTime = this.duration
        let { data } = await axios({
          method: 'POST',
          url: `/renren-fast/app/user/sendmobilecode`,
          data: {
            phone: this.userInfo.mobile,
            phoneCode: this.countryCode
          }
        })
        if (data.code == 0) {
          alertMessage(this.isEn ? 'The verification code was sent successfully' : '验证码发送成功', 'success')
          this.time = setInterval(() => {
            this.disabledTime = this.duration
            if (this.duration > 0) {
              this.duration--
            } else {
              this.disabledTime = undefined
              clearInterval(this.time)
              this.duration = 60
              let error = document.querySelectorAll('.error_warp')
              error.forEach(item => {
                item.innerHTML = ''
              })
            }
          }, 1000)
        } else {
          this.disabledTime = undefined
          clearInterval(this.time)
          this.duration = 60
          let error = document.querySelectorAll('.error_warp')
          error.forEach(item => {
            item.innerHTML = ''
          })
        }
      } else if (type == 'email' && this.currentChangeEmailStep == 0) {
        this.disabledTime = this.duration
        // 邮箱 步骤一
        // console.log('第一次获取邮箱验证码');
        let { data } = await axios({
          url: `/renren-fast/app/user/registrationEmail`,
          params: {
            email: this.userInfo.email
          }
        })
        if (data.code == 0) {
          alertMessage(this.isEn ? 'The verification code was sent successfully' : '验证码发送成功', 'success')
          this.time = setInterval(() => {
            this.disabledTime = this.duration
            if (this.duration > 0) {
              this.duration--
            } else {
              this.disabledTime = undefined
              clearInterval(this.time)
              this.duration = 60
              let error = document.querySelectorAll('.error_warp')
              error.forEach(item => {
                item.innerHTML = ''
              })
            }
          }, 1000)
        } else {
          alertMessage(data.msg, 'error')
          this.disabledTime = undefined
          this.duration = 60
        }
      }

      // 手机 步骤二
      if (type == 'phone' && this.currentChangePhoneStep == 1) {
        // 校验有没有问题
        let item = document.querySelector('.phone-wrap .newPhone')
        item.onblur = check2(item, [
          {
            rule: 'empty',
            errorMsg: this.isEn ? 'Mobile phone number cannot be empty' : '手机号不能为空'
          },
          {
            rule: `phone`,
            errorMsg: this.isEn ? 'Incorrect format' : '格式不正确'
          }
        ])
        item.onblur()
        if (document.querySelector('.error_warp')) return
        // 没有问题，发请求
        this.disabledTime = this.duration
        let { data } = await axios({
          method: 'POST',
          url: `/renren-fast/app/user/sendmobilecodes`,
          data: {
            phone: this.newPhone,
            phoneCode: this.countryCode
          }
        })
        if (data.code == 0) {
          alertMessage(this.isEn ? 'The verification code was sent successfully' : '验证码发送成功', 'success')
          this.time = setInterval(() => {
            this.disabledTime = this.duration
            if (this.duration > 0) {
              this.duration--
            } else {
              this.disabledTime = undefined
              clearInterval(this.time)
              this.duration = 60
              let error = document.querySelectorAll('.error_warp')
              error.forEach(item => {
                item.innerHTML = ''
              })
            }
          }, 1000)
        } else {
          alertMessage(data.msg, 'error')
          this.disabledTime = undefined
          clearInterval(this.time)
          this.duration = 60
        }
      } else if (type == 'email' && this.currentChangeEmailStep == 1) {
        console.log('第二次发送邮箱验证码')
        // 邮箱 步骤二
        // 校验邮箱输入框
        if (!this.newEmail) {
          // alert('请输入邮箱');
          alertMessage(this.isEn ? `Please enter email address` : `请输入邮箱`, 'error')
          return
        }
        // 发请求
        this.disabledTime = this.duration
        let { data } = await axios({
          url: `/renren-fast/app/user/registrationEmails`,
          params: {
            email: this.newEmail
          }
        })
        if (data.code == 0) {
          alertMessage(this.isEn ? 'The verification code was sent successfully' : '验证码发送成功', 'success')
          this.time = setInterval(() => {
            this.disabledTime = this.duration
            if (this.duration > 0) {
              this.duration--
            } else {
              this.disabledTime = undefined
              clearInterval(this.time)
              this.duration = 60
              let error = document.querySelectorAll('.error_warp')
              error.forEach(item => {
                item.innerHTML = ''
              })
            }
          }, 1000)
        } else {
          alertMessage(data.msg, 'error')
          this.disabledTime = undefined
          this.duration = 60
        }
      }
    },
    // 更换邮箱点击确定的回调
    handleEmailComfirm() {
      if (document.querySelector('.error_warp')) return
      // 第一步
      if (this.currentChangeEmailStep == 0) {
        let item = document.querySelector('.verification-code-wrap input')
        item.onblur = check2(item, [
          {
            rule: 'empty',
            errorMsg: this.isEn ? 'Verification code cannot be empty' : '验证码不能为空'
          }
        ])
        item.onblur()
        if (document.querySelector('.error_warp')) return
        // 校验验证码
        axios({
          method: 'POST',
          url: `/renren-fast/app/user/verifyemailcode`,
          data: {
            code: this.verificationCode,
            email: this.userInfo.email
          }
        }).then(({ data }) => {
          if (data.code == 0) {
            // clearInterval(this.time);
            // 清空验证码
            this.verificationCode = ''
            this.duration = 60
            this.disabledTime = null
            clearInterval(this.time)
            console.log(this.disabledTime, this.duration)
            this.currentChangeEmailStep++
          } else {
            alertMessage(this.isEn ? 'Verification code error' : `验证码错误`, 'error')
          }
        })
      }
      // 第二步
      if (this.currentChangeEmailStep == 1) {
        console.log('第二次点击确定')
        let item = document.querySelector('.change-email-wrap .phone-wrap .newPhone')
        item.onblur = check2(item, [
          {
            rule: 'empty',
            errorMsg: this.isEn ? 'Mailbox cannot be empty' : '邮箱不能为空'
          },
          {
            rule: `email`,
            errorMsg: this.isEn ? 'Incorrect format' : '格式不正确'
          }
        ])
        item.onblur()
        if (document.querySelector('.error_warp')) return

        // 校验验证码
        axios({
          method: 'POST',
          url: `/renren-fast/app/user/verifyemailcode`,
          data: {
            code: this.verificationCode,
            email: this.newEmail
          }
        }).then(({ data }) => {
          console.log(data)
          // 验证码没问题，修改邮箱
          if (data.code == 0) {
            console.log('修改邮箱')
            axios({
              url: `/renren-fast/app/user/changeemail`,
              data: {
                code: this.verificationCode,
                email: this.newEmail
              },
              method: 'POST'
            }).then(({ data }) => {
              console.log(data)
              if (data.code == 0) {
                this.verificationCode = ''
                this.currentChangeEmailStep++
                this.userInfo.email = this.newEmail
                localStorage.clear('userInfo')
                localStorage.clear('token')
                location.href = 'login.html'
              } else {
                alertMessage(data.msg, 'error')
              }
            })
          } else {
            alert(this.isEn ? 'Verification code error' : `验证码错误`)
          }
        })
      }
      if (this.currentChangeEmailStep == 2) {
        this.handleChangeClose('email')
      }
    },
    // 更换手机号码点击确定的回调
    handlePhoneComfirm() {
      if (document.querySelector('.error_warp')) return
      // 第一步
      if (this.currentChangePhoneStep == 0) {
        let item = document.querySelector('.verification-code-wrap input')
        item.onblur = check2(item, [
          {
            rule: 'empty',
            errorMsg: this.isEn ? 'Verification code cannot be empty' : '验证码不能为空'
          }
        ])
        item.onblur()
        if (document.querySelector('.error_warp')) return
        // 校验验证码
        axios({
          method: 'POST',
          url: `/renren-fast/app/user/verifymobilecode`,
          data: {
            code: this.verificationCode,
            phone: this.userInfo.mobile,
            phoneCode: this.countryCode
          }
        }).then(({ data }) => {
          console.log(data)
          if (data.code == 0) {
            this.verificationCode = ''
            this.currentChangePhoneStep++
          } else {
            alertMessage(this.isEn ? 'Verification code error' : `验证码错误`, 'error')
          }
        })
      }
      // 第二步
      if (this.currentChangePhoneStep == 1) {
        // 校验验证码
        axios({
          method: 'POST',
          url: `/renren-fast/app/user/verifymobilecode`,
          data: {
            code: this.verificationCode,
            phone: this.newPhone,
            phoneCode: this.countryCode
          }
        }).then(({ data }) => {
          console.log(data)
          if (data.code == 0) {
            axios({
              url: `/renren-fast/app/user/changemobile`,
              data: {
                code: this.verificationCode,
                phone: this.newPhone
              },
              method: 'POST'
            }).then(({ data }) => {
              console.log(data)
              if (data.code == 0) {
                this.verificationCode = ''
                this.currentChangePhoneStep++
                this.userInfo.mobile = this.newPhone
                localStorage.clear('userInfo')
                localStorage.clear('token')
                location.href = 'login.html'
                // localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
              }
            })
          } else {
            alert(this.isEn ? 'Verification code error' : `验证码错误`)
          }
        })
      }
    },
    // 更换密码点击确定的回调
    handlePasswordComfirm() {
      // 校验密码强度
      let reg = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[._~!@#$^&*])[A-Za-z0-9._~!@#$^&*]{8,20}$/
      // 看有没有错误
      let inputs = document.querySelectorAll('.change-password-wrap input')
      if (!inputs[0].value.trim()) {
        alertMessage(this.isEn ? `Login password cannot be empty` : `登录密码不能为空`, `error`)
        return
      }
      if (!inputs[1].value.trim()) {
        alertMessage(this.isEn ? `Password cannot be empty` : `密码不能为空`, `error`)
        return
      }
      if (!inputs[2].value.trim()) {
        alertMessage(this.isEn ? `Please enter the password again` : `请再次输入密码`, `error`)
        return
      } else if (!reg.test(inputs[2].value)) {
        alertMessage(this.isEn ? `The password must contain letters, numbers and special characters, and the length should be between 8 and 20 digits` : `密码必须包含字母、数字、特殊字符，并且长度要在8到20位`, `error`)
        return
      } else if (inputs[1].value != this.repeatPassword) {
        alertMessage(this.isEn ? `The passwords entered twice are inconsistent` : `两次输入的密码不一致`, `error`)
        return
      }
      axios({
        method: `POST`,
        url: `/renren-fast/app/user/changepassword`,
        data: {
          newPassword: this.newPassword,
          oldPassword: this.oldPassword
        }
      }).then(({ data }) => {
        if (data.code == 0) {
          console.log(data)
          this.isShowChangePassword = false
          alertMessage(this.isEn ? `Password modified successfully` : `密码修改成功`, 'success')
          this.oldPassword = ''
          this.newPassword = ''
          this.repeatPassword = ''
          localStorage.clear('userInfo')
          localStorage.clear('token')
          location.href = 'login.html'
        } else {
          alertMessage(data.msg, 'error')
        }
      })
    },
    close() {
      this.isShowChangePhone = false
      this.currentChangePhoneStep = 0
      this.isShowChangeEmail = false
      this.currentChangeEmailStep = 0
    },
    // 组件的初始化
    componentInit() {
      // 选择器的js
      //   获取所有选项元素
      let items = document.querySelectorAll('.select-item-wrap .select-item')
      //   获取所有兄弟元素的方法
      function siblings(elm) {
        let a = []
        let p = elm.parentNode.children
        for (let i = 0; i < p.length; i++) {
          if (p[i].nodeType == 1 && p[i] != elm) {
            a.push(p[i])
          }
        }
        return a
      }
      items.forEach(selectItem => {
        // 如果选项的data-value == 隐的input的值
        if (selectItem.dataset.value == selectItem.parentElement.previousElementSibling.previousElementSibling.value) {
          selectItem.className += ' active'
          selectItem.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.value = selectItem.children[0].innerHTML
        }

        // 给item添加点击事件
        selectItem.onclick = function (e) {
          // 获取选项
          let select = this.parentNode.previousElementSibling.previousElementSibling
          // 清空兄弟的类名
          let sibling = siblings(this)
          sibling.forEach(item => {
            item.className = 'select-item'
          })
          //   给自己加类名
          this.className += ' active'
          //   给输入框赋值
          select.value = this.getAttribute('data-value')
          //  给显示的输入框赋值
          select.previousElementSibling.value = this.innerText
          select.dispatchEvent(new Event('input'))
        }
      })
    },
    // 点击退出的回调
    signOut() {
      console.log('退出')
      localStorage.removeItem('userInfo')
      localStorage.removeItem('token')
      location.href = '../../index.html'
    },
    to(href) {
      if (href == `./forget_password.html`) {
        sessionStorage.setItem('isPersonal', 'true')
      }
      location.href = href
    },
    // 移动端退出登录
    loginout() {
      let isDelete = confirm('是否确定退出?')
      if (isDelete) {
        this.loginType = 0
        localStorage.removeItem('userInfo')
        localStorage.removeItem('token')
      } else {
        console.log('取消退出')
      }
    },
    // 获取隐私政策的数据
    getPrivacy() {
      axios({ url: `/renren-fast/app/policy/queryActivityPolicy` }).then(({ data }) => {
        if (data.code == 0) {
          // this.privacyPolicy = data?.policyEntities.filter(item => item.type == 3)[0];
          this.privacyPolicy = data.policyEntity
          console.log('隐私政策的数据', this.privacyPolicy)
        } else {
          console.log('隐私政策的数据', data)
        }
      })
    }
  },
  watch: {
    currentStep(newVal) {
      if (newVal == 2) {
        document.querySelectorAll('.error_warp').forEach(item => {
          item.innerHTML = ''
        })
      }
      if (newVal != 3) return
      this.$nextTick(_ => {
        let inputs = document.querySelectorAll('.requireds')
        this.errorMsg = this.isEn ? `Cannot be empty` : `不能为空`
        inputs.forEach(item => {
          item.onblur = check2(item, [
            {
              rule: 'empty',
              errorMsg: this.errorMsg
            }
          ])
        })
      })
    },
    accountType() {
      this.name = ''
      this.gender = '0'
      this.address = ''
      this.taxid = ''
      this.state = '0'
      this.imageUrl = ''
    },
    isEn(newVal) {
      localStorage.setItem('isEn', newVal)
      this.islanguage = false
      let error = document.querySelectorAll('.error_warp')
      error.forEach(item => {
        item.innerText = newVal ? `Cannot be empty` : '不能为空'
      })
    },
    currentChangePhoneStep(newVal) {
      if (newVal == 1) {
        clearInterval(this.time)
        this.disabledTime = null
        this.duration = 60
      }
      setTimeout(() => {
        this.componentInit()
      })
    }
  },
  filters: {
    stateFilter(value, isEn) {
      switch (value) {
        case 0:
          return isEn ? `Not certified` : `未认证`
        case 1:
          return isEn ? `Certified` : `已认证`
        case 2:
          return isEn ? `reject` : `驳回`
        case 3:
          return isEn ? `Under review` : `审核中`
        default:
          return ''
      }
    }
  },
  mounted() {
    setTimeout(() => {
      this.componentInit()
    }, 1000)
  }
})
window.onload = function () {
  localStorage.setItem('navId', 0)
  localStorage.setItem('nav-bar-id', 1)
  if (!localStorage.token) {
    location.href = 'login.html'
  }
}
