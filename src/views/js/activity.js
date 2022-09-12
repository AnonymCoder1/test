Vue.config.productionTip = false
new Vue({
  el: '#app',
  created() {
    window.onscroll = null
    let link = document.querySelector('.link_phone')
    if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
      link.href = './css/activity_750.css'
      document.documentElement.style.fontSize = '1.5625vw'
    }
    localStorage.setItem('navId', 0)
    JSON.parse(localStorage.getItem('isEn')) == null ? (this.isEn = true) : (this.isEn = JSON.parse(localStorage.getItem('isEn')))
    window.onstorage = e => {
      if (e.key == 'isEn') {
        this.isEn = JSON.parse(e.newValue)
      }
    }
    this.init()
    this.getActivityImg()
    this.getBannerInfo()
    this.getUserAgrementData()
    let title = document.querySelector('title')
    title.innerHTML = this.isEn ? 'WhatsMiner' : '比特微'
    this.isCloseMsg = (sessionStorage.getItem('isCloseMsg') && sessionStorage.getItem('isCloseMsg').length) || false
    if (localStorage.getItem('token') && localStorage.getItem('userInfo')) {
      axios('/renren-fast/app/user/userinfo').then(({ data }) => {
        if (data.code != 0) {
          localStorage.removeItem('token')
          localStorage.removeItem('userInfo')
        }
      })
    }

  },
  data() {
    return {
      bannerInfo: '',
      // 是否是英文状态
      isEn: true,
      // 是否显示注册弹窗
      isShowRegister: false,
      // 是否显示登录弹窗
      isShowLogin: false,
      // 是否显示报名弹窗
      isShowRegistration: false,
      // 登录弹窗
      loginDataForm: {
        // 邮箱
        email: '',
        // 密码
        password: ''
      },
      // 注册弹窗
      dataForm: {
        // 用户名
        username: '',
        // 手机号码
        mobile: '',
        // 邮箱
        email: '',
        // 验证码
        emailCode: '',
        // 密码
        password: ''
      },
      //报名弹框的数据
      form: {
        // 姓名
        name: '',
        // 手机号前缀
        internationalDistrictNum: '+86',
        // 手机号码
        phone: '',
        // 邮箱
        email: ''
      },
      // User agreement前面的复选框
      checkbox: false,
      // 验证码倒计时的时间
      time: '',
      // 错误信息
      errorMsg: '',
      // 正确的验证码
      verificationCode: '',
      // 第二次输入的密码
      passwordAgain: '',
      // 是否禁用发送验证码按钮
      isDisabled: false,
      // 动态按钮的数据
      activity: [],
      // 需要动态渲染个人活动的数据
      formData: [],
      // 需要动态渲染供应商活动的数据
      formData2: [],
      // 手机号前缀的数据
      internationalDistrictNum: [],
      // 校验规则
      formRules: {},
      message: '不能为空',
      // 报名弹框的是否阅读条款
      isRead: false,
      // 是否点击了报名弹框的隐私政策
      isShowPrivacyPolicy: false,
      // 是否显示报名成功的弹窗
      isShowRegistrationSuccess: false,
      // 前面三个是否必填
      isRequired: [],
      // 隐私政策的数据
      privacyPolicy: {},
      // 活动是否过期
      isEnd: false,
      // 活动类型（0个人，1供应商）
      activeType: 0,
      // 是否是供应商活动
      isSupplier: false,
      // 是否没有活动
      isNoActive: false,
      // 没有活动时候的图片
      endImg: '',
      endImgPhone: {},
      // 是否关闭横幅
      isCloseMsg: false,
      // 是否显示用户协议
      isShowUserAgreement: false,
      // 用户协议的数据
      userAgrementData: {}
    }
  },
  methods: {
    change(val) {
      console.log(val);
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
    // 获取用户协议的数据
    getUserAgrementData() {
      axios({ url: `/renren-fast/app/policy/queryActivityPolicy` }).then(({ data }) => {
        this.userAgrementData = data.policyEntity
        console.log('用户协议的数据', data.policyEntity)
      })
    },
    getActivityImg() {
      axios(`/renren-fast/app/activity/getEnd`).then(({ data }) => {
        this.endImgPhone = data.picsEnd
        console.log(this.endImgPhone)
      })
    },
    init() {
      // 获取需要渲染的数据
      axios({ url: `/renren-fast/app/activity/get` }).then(({ data }) => {
        let _data = data.data
        console.log(!!_data.activity)
        // 判断活动是否过期
        if (_data.activity) {
          this.isEnd = +new Date() > _data.activity.endTime
        } else if (!_data.activity) {
          this.isNoActive = true
          console.log('没有活动')
        }
        console.log('是否过期：', this.isEnd)

        // 活动过期或者没有活动,获取活动结束的图片
        if (this.isEnd || this.isNoActive) {
          axios({ url: `/renren-fast/app/activity/getEnd` }).then(({ data }) => {
            console.log('活动结束的图片', data.picsEnd)
            this.endImg = data.picsEnd
          })
        }
        _data.activityCustomizeFields.forEach(item => {
          item.options = item.options.split(',')
          this.$set(this.form, item['fieldName'], item.fieldType == 7 ? [] : '')
        })
        try {
          if (_data.activity) {
            _data.activity.pics = _data.activity.pics.split(',')
            _data.activity.picsMove = _data.activity.picsMove.split(',')
          }
        } catch (error) {
          console.log(error)
        }
        // 个人活动的表单
        this.formData = _data.activityCustomizeFields.filter(item => item.must == 0 && (item.type == 0 || item.type == 2))
        console.log('所有表单', _data);

        console.log('个人活动的表单数据', this.formData)
        // 供应商活动的表单
        this.formData2 = _data.activityCustomizeFields.filter(item => item.must == 0 && (item.type == 1 || item.type == 2))
        console.log('供应商活动的表单数据', this.formData2)
        this.isRequired = _data.activityCustomizeFields.filter(item => item.must == 1)
        // 自定义手机号码校验规则
        let phoneValidate = (rule, value, cb) => {
          const reg = /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/
          return cb()
          // if (reg.test(value)) {
          //   return cb()
          // } else {
          //   return cb(new Error(this.isEn ? 'Format error' : '格式错误'))
          // }
        }
        let emailValidate = (rule, value, cb) => {
          const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
          if (reg.test(value)) {
            return cb()
          } else {
            return cb(new Error(this.isEn ? 'Format error' : '格式错误'))
          }
        }
        this.formRules = {
          name: this.isRequired[0] && this.isRequired[0].isRequired == 0 ? [] : [{ required: true, message: this.message, trigger: 'blur' }],
          phone:
            this.isRequired[1] && this.isRequired[1].isRequired == 0
              ? []
              : [
                { required: true, message: this.message, trigger: 'blur' },
                { validator: phoneValidate, trigger: 'blur' }
              ],
          email:
            this.isRequired[2] && this.isRequired[2].isRequired == 0
              ? []
              : [
                { required: true, message: this.message, trigger: 'blur' },
                { validator: emailValidate, trigger: 'blur' }
              ]
        }
        this.formData.forEach(item => {
          item.isRequired == 1 ? this.addRules(item.fieldName) : this.removeRules(item.fieldName)
        })
        this.activity = _data.activity || ''
        if (!!_data.activity) {
          this.isSupplier = _data.activity.type == 1
          console.log('是否是供应商活动', this.isSupplier)
          console.log('按钮和图片的数据', this.activity)
        }
        // axios({ url: `/renren-fast/app/activity/getEnd` }).then(({ data }) => {
        //   this.endImg = data.picsEnd.picsEnd
        //   console.log('没有活动的图片', this.endImg);
        // })
        // console.log('没有活动', this.isNoActive);
      })
      // 获取手机号前缀的数据
      axios({ url: `/renren-fast/app/personalCenterRepairWorkOrder/queryphonecode` }).then(({ data }) => {
        this.internationalDistrictNum = data.newCountriesEntityList
        console.log('手机号码前缀的数据', this.internationalDistrictNum)
      })
      // 获取隐私政策的数据
      axios({ url: `/renren-fast/app/policy/queryActivityPolicy` }).then(({ data }) => {
        if (data.code == 0) {
          // this.privacyPolicy = data.policyEntities.filter(item => item.type == 3)[0];
          this.privacyPolicy = data.policyEntity
        }
        console.log('隐私政策的数据', data)
      })
    },
    addRules(prop) {
      // 定义规则
      let rule = prop
      rule = [
        {
          required: true,
          trigger: 'blur',
          message: this.isEn ? `Cannot be empty` : '不能为空'
        }
      ]
      // 给rules对象添加规则
      this.formRules = { ...this.formRules, [prop]: rule }
    },
    removeRules(prop) {
      // 清除指定校验规则
      // this.$refs.form.clearValidate([prop]);
      // 这行必须
      this.formRules = { ...this.formRules, [prop]: [] }
    },
    // 报名弹窗点击提交的回调
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid && this.isRead) {
          let data = JSON.stringify(this.form)
          console.log('提交的数据：', data)
          axios({
            method: 'POST',
            url: `/renren-fast/app/activitysregister/save`,
            data: {
              registerContent: data,
              activityId: this.activity.id,
              userId: JSON.parse(localStorage.userInfo).userId
            }
          }).then(({ data }) => {
            console.log(data)
            if (data.code == 0) {
              this.handleClose()
              this.isShowRegistrationSuccess = true
            } else {
              alertMessage(data.msg, 'error')
              this.isShowRegistration = false
            }
          })
        } else {
          if (valid) alertMessage(this.isEn ? `Please read the privacy policy` : `请阅读隐私政策`, 'error')
          return false
        }
      })
    },
    // 报名弹窗的关闭按钮回调
    handleClose() {
      this.isShowRegistration = false
      this.isRead = false
      // 清除数据
      this.$refs['form'].resetFields()
      // 清除校验规则
      // this.formRules = {}
    },
    // 点击注册按钮的回调
    submit() {
      let { username, mobile, email, emailCode, password } = this.dataForm
      this.error = check(
        username,
        [
          {
            rule: 'empty',
            errorMsg: this.isEn ? `User name cannot be empty` : '用户名不能为空'
          }
        ],
        mobile,
        [
          {
            rule: 'phone',
            errorMsg: this.isEn ? `Incorrect mobile phone format` : '手机格式不正确'
          },
          {
            rule: 'empty',
            errorMsg: this.isEn ? `Mobile phone number cannot be empty` : '手机号不能为空'
          }
        ],
        email,
        [
          {
            rule: 'email',
            errorMsg: this.isEn ? `The mailbox format is incorrect` : '邮箱格式不正确'
          },
          {
            rule: 'empty',
            errorMsg: this.isEn ? `Mailbox cannot be empty` : '邮箱不能为空'
          }
        ],
        emailCode,
        [
          {
            rule: 'empty',
            errorMsg: this.isEn ? `Verification code cannot be empty` : '验证码不能为空'
          }
        ],
        password,
        [
          {
            rule: 'empty',
            errorMsg: this.isEn ? `Password cannot be empty` : '密码不能为空'
          },
          {
            rule: 'maxLength',
            maxLength: 11,
            errorMsg: this.isEn ? `The maximum length is 11 digits` : '最大长度是11位数'
          }
        ]
      )
      let reg = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[._~!@#$^&*])[A-Za-z0-9._~!@#$^&*]{8,20}$/
      if (!reg.test(password)) {
        ; (this.error = this.isEn ? `The password must contain letters, numbers and special characters, and the length should be between 8 and 20 digits` : `密码必须包含字母、数字、特殊字符，并且长度要在8到20位`), 'error'
      }
      if (this.dataForm.password != this.passwordAgain) {
        this.error = this.isEn ? `The passwords entered twice are inconsistent` : '两次输入的密码不一致'
      }
      if (this.error) {
        alertMessage(this.error, 'error')
        return
      }
      // 判断是否勾选框框
      if (!this.checkbox) {
        alertMessage(this.isEn ? `Please select user protocol` : '需勾选用户协议', 'error')
        return
      }
      axios({
        url: `/renren-fast/app/register`,
        method: 'POST',
        data: {
          username: username,
          email: email,
          emailCode: emailCode,
          mobile: mobile,
          password: password,
          activityId: this.activity.id
        }
      }).then(({ data }) => {
        console.log(data)
        if (data.code == 0) {
          alertMessage(this.isEn ? 'login was successful' : '注册成功', 'success')
          this.isShowRegister = false
          try {
            axios({
              url: `/renren-fast/app/login`,
              method: 'POST',
              data: {
                email: email,
                password: password
              }
            })
              .then(({ data }) => {
                if (data.code == 0) {
                  localStorage.setItem('token', data.token)
                  localStorage.setItem('userInfo', JSON.stringify(data.user))
                } else {
                  alertMessage(data.msg, 'error')
                }
                window.location.reload()
              })
              .catch(e => {
                console.log(e)
              })
          } catch (e) {
            console.log(e)
          }

        } else {
          alertMessage(data.msg, 'error')
        }
      })
    },
    handleForget() {
      sessionStorage.setItem('isActive', 'true')
      location.href = './forget_password.html'
    },
    // 输入框失去焦点时的回调
    verification(e) {
      let dom = e.path[0]
      let error = check(dom.value, [
        {
          rule: 'empty',
          errorMsg: this.isEn ? `User name cannot be empty` : '不能为空'
        }
      ])
      dom.style.borderColor = error ? 'red' : '#d2d2d2'
    },
    // 点击发送按钮的回调
    sendVerificationCode() {
      this.isDisabled = true
      // 校验邮箱
      this.error = check(this.dataForm.email, [
        {
          rule: 'email',
          errorMsg: this.isEn ? `The mailbox format is incorrect` : '邮箱格式不正确'
        },
        {
          rule: 'empty',
          errorMsg: this.isEn ? `Mailbox cannot be empty` : '邮箱不能为空'
        }
      ])
      // 如果有错误
      if (this.error) {
        this.isDisabled = false
        alertMessage(this.error, 'error')
        return
      } else {
        // 发送请求
        axios({
          url: `/renren-fast/app/emailverification`,
          params: {
            email: `${this.dataForm.email}`
          },
          method: 'GET'
        })
          .then(({ data }) => {
            // 判断是否已注册
            if (data.code == 0) {
              let timer = setInterval(() => {
                --this.time
                this.time == 0 ? (clearInterval(timer), (this.time = ''), (this.isDisabled = false)) : ''
              }, 1000)
              console.log(data)
              // alertMessage(data.msg, 'error')
              alertMessage(this.isEn ? `The verification code has been sent to your mailbox and is valid for 10 minutes.` : `验证码已发送到您的邮箱，有效期为10分钟。`, 'success')
              this.time = 59
            } else {
              alertMessage(data.msg, 'error')
              this.isDisabled = false
            }
          })
          .catch(e => {
            console.log(e)
          })
      }
    },
    // 点击sign in 按钮的回调
    signIn() {
      // 校验
      let error = check(
        this.loginDataForm.email,
        [
          // {
          //   rule: 'email',
          //   errorMsg: this.isEn ? 'The mailbox format is incorrect' : '邮箱格式不正确'
          // },
          {
            rule: 'empty',
            errorMsg: this.isEn ? 'Email or mobile number cannot be empty' : '邮箱或手机号不能为空'
          }
        ],
        this.loginDataForm.password,
        [
          {
            rule: 'empty',
            errorMsg: this.isEn ? 'Password cannot be empty' : '密码不能为空'
          }
        ]
      )
      if (error) {
        alertMessage(error, 'error')
        return
      }
      // 可以发请求
      try {
        axios({
          url: `/renren-fast/app/login`,
          method: 'POST',
          data: {
            email: this.loginDataForm.email,
            password: this.loginDataForm.password
          }
        })
          .then(({ data }) => {
            if (data.code == 0) {
              console.log(data)
              localStorage.setItem('token', data.token)
              localStorage.setItem('userInfo', JSON.stringify(data.user))
              this.isShowLogin = false
              this.isShowRegistration = true
            } else {
              alertMessage(data.msg, 'error')
            }
            window.location.reload()
          })
          .catch(e => {
            console.log(e)
          })
      } catch (e) {
        console.log(e)
      }
    },
    // 选择器初始化
    componentInit() {
      // 选择器的js
      //   获取所有选项元素
      let items = document.querySelectorAll('.select-item-wrap .select-item')
      //   获取所有兄弟元素的方法
      function siblings(elm) {
        let a = []
        let p = elm.parentNode.children || []
        for (let i = 0; i < p.length; i++) {
          if (p[i].nodeType == 1 && p[i] != elm) {
            a.push(p[i])
          }
        }
        return a
      }
      items.forEach(selectItem => {
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
    // 点击图片里面按钮的回调
    handleClickButton() {
      // 校验一下有没有登陆
      if (localStorage.token && localStorage.userInfo) {
        axios({ url: `/renren-fast/app/userInfo` }).then(({ data }) => {
          if (data.code == 0) {
            console.log(data.user)
            this.isShowRegistration = true
          } else {
            this.isShowLogin = true
          }
        })
      } else {
        this.isShowLogin = true
      }
    },
    // 点击登陆弹框中的马上注册的回调
    handleCreateAccount() {
      this.isShowLogin = false
      this.isShowRegister = true
    },
    // 点击注册弹框中的马上登陆的回调
    handleSignIn() {
      this.isShowLogin = true
      this.isShowRegister = false
    },
    // 点击退出登录的回调
    handleLogout() {
      // 移除用户信息
      localStorage.removeItem('userInfo')
      localStorage.removeItem('token')
      try {
        parent.location.reload()
      } catch (error) {
        console.log(error)
      }
    },
    // 手动初始化 腾讯防水墙
    initTencentWaterproofWall() {
      new TencentCaptcha(
        this.$refs.TencentWater,
        '2065634367',
        res => {
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
            console.log('登陆')
            this.signIn()
          } else {
            alertMessage(this.isEn ? `Please complete the verification process correctly` : '请正确完成验证过程', 'error')
            this.signIn()
          }
        },
        {
          userLanguage: JSON.parse(localStorage.getItem('isEn')) ? 'en' : `zh-cn`
        }
      ),
        new TencentCaptcha(
          this.$refs.TencentWater2,
          '2065634367',
          res => {
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
              console.log('注册')
              this.sendVerificationCode()
            } else {
              alertMessage(this.isEn ? `Please complete the verification process correctly` : '请正确完成验证过程', 'error')
            }
          },
          {
            userLanguage: JSON.parse(localStorage.getItem('isEn')) ? 'en' : `zh-cn`
          }
        )
    }
  },
  mounted() {
    sessionStorage.getItem('isShowLogin') && (this.isShowLogin = true) && sessionStorage.removeItem('isShowLogin')
    this.initTencentWaterproofWall()
    this.componentInit()
    let registration_button_wrap = document.querySelector('.registration_button_wrap')
    // window.onscroll = function () {
    //   if (document.documentElement.scrollTop >= window.screen.height * 0.6) {
    //     registration_button_wrap && registration_button_wrap.classList.add('active');
    //   } else {
    //     registration_button_wrap && registration_button_wrap.classList.remove('active');
    //   }
    // };
    window.addEventListener('scroll', function () {
      if (document.documentElement.scrollTop >= window.screen.height * 0.6) {
        registration_button_wrap && registration_button_wrap.classList.add('active')
      } else {
        registration_button_wrap && registration_button_wrap.classList.remove('active')
      }
    })
  },
  watch: {
    isEn: {
      immediate: true,
      handler(newVal) {
        // console.log(newVal);
        if (newVal) {
          this.message = 'Cannot be empty'
        } else {
          this.message = '不能为空'
        }

        let phoneValidate = (rule, value, cb) => {
          const reg = /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/
          if (reg.test(value)) {
            return cb()
          } else {
            return cb(new Error(this.isEn ? 'Format error' : '格式错误'))
          }
        }
        let emailValidate = (rule, value, cb) => {
          const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
          if (reg.test(value)) {
            return cb()
          } else {
            return cb(new Error(this.isEn ? 'Format error' : '格式错误'))
          }
        }

        this.formRules = {
          name: this.isRequired[0] && this.isRequired[0].isRequired == 0 ? [] : [{ required: true, message: this.message, trigger: 'blur' }],
          phone:
            this.isRequired[1] && this.isRequired[1].isRequired == 0
              ? []
              : [
                { required: true, message: this.message, trigger: 'blur' },
                { validator: phoneValidate, trigger: 'blur' }
              ],
          email:
            this.isRequired[2] && this.isRequired[2].isRequired == 0
              ? []
              : [
                { required: true, message: this.message, trigger: 'blur' },
                { validator: emailValidate, trigger: 'blur' }
              ]
        }
        this.formData.forEach(item => {
          item && item.isRequired == 1 ? this.addRules(item.fieldName) : this.removeRules(item.fieldName)
        })
      }
    }
  }
})
