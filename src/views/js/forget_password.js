Vue.config.productionTip = false
new Vue({
  el: '#app',
  created() {
    let title = document.querySelector('title')
    title.innerHTML = this.isEn ? 'WhatsMiner' : '比特微'
    let link = document.querySelector('.link')
    if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
      link.href = './css/forget_password_750.css'
      document.documentElement.style.fontSize = '1.5625vw'
    }
    localStorage.setItem('navId', 0)
    // this.isEn = JSON.parse(localStorage.getItem('isEn'))
    JSON.parse(localStorage.getItem('isEn')) == null ? this.isEn = true : this.isEn = JSON.parse(localStorage.getItem('isEn'));
    window.onstorage = e => {
      if (e.key == 'isEn') {
        this.isEn = JSON.parse(e.newValue)
      }
      if (e.key == 'isActive') {
        this.isActive = JSON.parse(e.newValue)
      }
    }
  },
  data() {
    return {
      // 邮箱
      email: '',
      // 手机号码
      phone: '',
      // 验证码
      code: '',
      // 新密码
      newPassword: '',
      // 再次输入的密码
      repeatPassword: '',
      // 是否是英文状态
      isEn: true,
      // 找回密码的类型
      type: 'email',
      // 手机号码前缀
      phoneCode: '86',
      // 定时器
      timer: '',
      disabledTime: undefined,
      // TODO
      duration: 60
    }
  },
  methods: {
    // 点击获取验证码的回调
    getCode() {
      // 发送邮箱验证码
      if (this.type == 'email') {
        // 校验
        // 邮箱为空
        if (!this.email.trim()) {
          if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
            alert(this.isEn ? `Mailbox cannot be empty` : `邮箱不能为空`)
            return
          }
          alertMessage(this.isEn ? `Mailbox cannot be empty` : `邮箱不能为空`, 'error')
          return
        } else if (!/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(this.email)) {
          // 邮箱格式不正确
          if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
            alert(this.isEn ? `Please enter the correct email format` : `请输入正确的邮箱格式`)
            return
          }
          alertMessage(this.isEn ? `Please enter the correct email format` : `请输入正确的邮箱格式`, 'error')
          return
        }
        this.disabledTime = this.duration
        // 发请求
        axios({
          url: `/renren-fast/app/user/registrationEmail`,
          params: {
            email: this.email
          }
        }).then(({ data }) => {
          if (data.code == 0) {
            if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
              alert(data.msg)
            } else {
              alertMessage(this.isEn ? `Successfully sent verification code` : `成功发送验证码`, 'success')
            }
            this.timer = setInterval(() => {
              this.disabledTime = this.duration
              this.duration--
              if (this.disabledTime <= 0) {
                clearInterval(this.timer)
                this.disabledTime = undefined
                // TODO
                this.duration = 60
              }
            }, 1000)
          } else {
            if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
              alert(data.msg)
            } else {
              alertMessage(data.msg, 'error')
              clearInterval(this.timer)
              this.disabledTime = undefined
              // TODO
              this.duration = 60
            }
          }
        })
      }
      // 发送手机号验证码
      if (this.type == 'phone') {
        // 手机号码为空
        if (!this.phone.trim()) {
          if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
            alert(this.isEn ? `Mobile phone number cannot be empty` : `手机号码不能为空`)
            return
          }
          alertMessage(this.isEn ? `Mobile phone number cannot be empty` : `手机号码不能为空`, 'error')
          return
        } else if (!/^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/.test(this.phone)) {
          // 手机号码格式不正确
          if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
            alert(this.isEn ? `Please enter the correct mobile number format` : `请输入正确的手机号码格式`)
            return
          }
          alertMessage(this.isEn ? `Please enter the correct mobile number format` : `请输入正确的手机号码格式`, 'error')
          return
        }
        this.disabledTime = this.duration
        axios({
          method: 'POST',
          url: `/renren-fast/app/user/sendmobilecode`,
          data: {
            phoneCode: this.phoneCode,
            phone: this.phone
          }
        }).then(({ data }) => {
          if (data.code == 0) {
            if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
              alert(data.msg)
            } else {
              alertMessage(this.isEn ? `Successfully sent verification code` : `成功发送验证码`, 'success')
            }
            this.timer = setInterval(() => {
              this.disabledTime = this.duration
              this.duration--
              if (this.disabledTime <= 0) {
                clearInterval(this.timer)
                this.disabledTime = undefined
                // TODO
                this.duration = 60
              }
            }, 1000)
          } else {
            if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
              alert(data.msg)
            } else {
              alertMessage(data.msg, 'error')
              clearInterval(this.timer)
              this.disabledTime = undefined
              // TODO
              this.duration = 60
            }
          }
        })
      }
    },
    handleSignUpNow() {
      if (sessionStorage.getItem('isActive')) {
        sessionStorage.setItem('isShowLogin', 'true')
        sessionStorage.removeItem('isActive')
        location.href = './activity.html'
      } else {
        location.href = './login.html'
      }
    },
    // 点击提交的回调
    handleSubmit() {
      let isPersonal = JSON.parse(sessionStorage.getItem('isPersonal'))
      let reg = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[._~!@#$^&*])[A-Za-z0-9._~!@#$^&*]{8,20}$/
      // 邮箱找回
      if (this.type == 'email') {
        // 邮箱为空
        if (!this.email.trim()) {
          if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
            alert(this.isEn ? `Mailbox cannot be empty` : `邮箱不能为空`)
            return
          }
          alertMessage(this.isEn ? `Mailbox cannot be empty` : `邮箱不能为空`, 'error')
          return
        } else if (!/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(this.email)) {
          // 邮箱格式不正确
          if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
            alert(this.isEn ? `Please enter the correct email format` : `请输入正确的邮箱格式`)
            return
          }
          alertMessage(this.isEn ? `Please enter the correct email format` : `请输入正确的邮箱格式`, 'error')
          return
        }
      }
      // 手机号码找回
      if (this.type == 'phone') {
        // 手机号码为空
        if (!this.phone.trim()) {
          if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
            alert(this.isEn ? `Mobile phone number cannot be empty` : `手机号码不能为空`)
            return
          }
          alertMessage(this.isEn ? `Mobile phone number cannot be empty` : `手机号码不能为空`, 'error')
          return
        } else if (!/^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/.test(this.phone)) {
          // 手机号码格式不正确
          if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
            alert(this.isEn ? `Please enter the correct mobile number format` : `请输入正确的手机号码格式`)
            return
          }
          alertMessage(this.isEn ? `Please enter the correct mobile number format` : `请输入正确的手机号码格式`, 'error')
          return
        }
      }
      // 新密码为空
      if (!this.newPassword.trim()) {
        if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
          alert(this.isEn ? `Password cannot be Wei` : `密码不能为空`)
          return
        }
        alertMessage(this.isEn ? `Password cannot be Wei` : `密码不能为空`, 'error')
        return
      } else if (!reg.test(this.newPassword)) {
        // 密码强度不对
        if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
          alert(this.isEn ? `The password must contain letters, numbers and special characters, and the length should be between 8 and 20 digits` : `密码必须包含字母、数字、特殊字符，并且长度要在8到20位`)
          return
        }
        alertMessage(this.isEn ? `The password must contain letters, numbers and special characters, and the length should be between 8 and 20 digits` : `密码必须包含字母、数字、特殊字符，并且长度要在8到20位`, 'error')
        return
      } else if (this.newPassword != this.repeatPassword) {
        // 两次密码不一致
        if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
          alert(this.isEn ? `The two passwords are inconsistent` : `两次密码不一致`)
          return
        }
        alertMessage(this.isEn ? `The two passwords are inconsistent` : `两次密码不一致`, 'error')
        return
      }
      if (isPersonal) {
        axios({
          method: 'POST',
          // 校验token
          url: `/renren-fast/app/user/retrievepassword`,
          data: {
            email: this.email,
            newPassword: this.newPassword,
            code: this.code,
            phone: this.phone
          }
        }).then(({ data }) => {
          if (data.code == 0) {
            console.log(data.msg)
            alert(this.isEn ? `Password retrieved successfully` : `找回密码成功`)
            location.href = './login.html'
          } else {
            if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
              alert(data.msg || data.message)
            } else {
              alertMessage(data.msg || data.message, 'error')
            }
          }
        })
        sessionStorage.removeItem('isPersonal')
      } else {
        axios({
          method: 'POST',
          // 不校验token
          url: `/renren-fast/app/user/retrievepasswordloginpage`,
          data: {
            email: this.email,
            newPassword: this.newPassword,
            code: this.code,
            phone: this.phone
          }
        }).then(({ data }) => {
          if (data.code == 0) {
            console.log(data.msg)
            alert(this.isEn ? `Password retrieved successfully` : `找回密码成功`)
            if (sessionStorage.getItem('isActive')) {
              location.href = './activity.html'
              sessionStorage.removeItem('isActive')
            } else {
              location.href = './login.html'
            }
          } else {
            if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
              alert(data.msg || data.message)
            } else {
              alertMessage(data.msg || data.message, 'error')
            }
          }
        })
      }
    }
  },
  watch: {
    'bannerInfo.status'(newVal) {
      console.log(newVal)
      this.bannerInfo.status = 0
    },
    type(newVal) {
      clearInterval(this.timer)
      this.email = ''
      this.newPassword = ''
      this.repeatPassword = ''
      this.code = ''
      this.phone = ''
      this.disabledTime = null
      // TODO
      this.duration = 60
    },
    disabledTime(newVal) {
      console.log(newVal)
    }
  }
})
