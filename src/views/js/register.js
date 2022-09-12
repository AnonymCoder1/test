Vue.config.productionTip = false;
window.vm = new Vue({
  el: '#app',
  data() {
    return {
      // 是否展示注册注册成功的弹框
      isShowbox: false,
      // 是否展示用户协议
      isShowUserAgreement: false,
      isEn: true,
      // 表单数据
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
      // 是否禁用
      isDisabled: false,
      // 用户协议的数据
      userAgrementData: {}
    };
  },
  methods: {
    // 点击注册按钮的回调
    submit() {
      let { username, mobile, email, emailCode, password } = this.dataForm;
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
          }
        ]
      );
      // 校验密码强度
      let reg = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[._~!@#$^&*])[A-Za-z0-9._~!@#$^&*]{8,20}$/
      if (!reg.test(password)) {
        this.error = this.isEn ? `The password must contain letters, numbers and special characters, and the length should be between 8 and 20 digits` : `密码必须包含字母、数字、特殊字符，并且长度要在8到20位`
      }
      if (this.dataForm.password != this.passwordAgain) {
        this.error = this.isEn ? `The passwords entered twice are inconsistent` : '两次输入的密码不一致';
      }
      if (this.error) {
        alertMessage(this.error, 'error');
        return;
      }
      // 判断是否勾选框框
      if (!this.checkbox) {
        alertMessage(this.isEn ? `Please select user protocol` : '需勾选用户协议', 'error');
        return;
      }
      axios({
        url: `/renren-fast/app/register`,
        method: 'POST',
        data: {
          username: this.dataForm.username,
          email: this.dataForm.email,
          emailCode: this.dataForm.emailCode,
          mobile: this.dataForm.mobile,
          password: this.dataForm.password
        }
      }).then(({ data }) => {
        console.log(data);
        if (data.code == 0) {
          alertMessage(this.isEn ? 'login was successful' : '注册成功');
          axios({
            url: `/renren-fast/app/login`,
            method: 'POST',
            data: {
              email: this.dataForm.email,
              password: this.dataForm.password
            }
          }).then(({ data }) => {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userInfo', JSON.stringify(data.user));
            if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
              // this.isShowbox = true;
              window.location.href = 'personal.html';
              return
            }
            // window.location.href = 'registration_gift.html';
            window.location.href = 'personal.html';
          });
        } else {
          alertMessage(data.msg, 'error');
        }
      });
    },
    // 输入框失去焦点时的回调
    verification(e) {
      let dom = e.path[0];
      let error = check(dom.value, [
        {
          rule: 'empty',
          errorMsg: this.isEn ? `User name cannot be empty` : this.isEn ? `User name cannot be empty` : this.isEn ? `User name cannot be empty` : '不能为空'
        }
      ]);
      dom.style.borderColor = error ? 'red' : '#d2d2d2';
    },
    // 点击发送按钮的回调
    sendVerificationCode() {
      this.isDisabled = true;
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
      ]);
      // 校验密码长度
      // if (this.dataForm.password.length > 11) {
      //   alertMessage(this.isEn ? `The password length cannot exceed 11 digits` : `密码长度不能超过11位数`);
      //   return;
      // }
      // 如果有错误
      if (this.error) {
        this.isDisabled = false;
        alertMessage(this.error, 'error');
        return;
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
                // console.log(this.time);
                --this.time;
                this.time == 0 ? (clearInterval(timer), (this.time = ''), (this.isDisabled = false)) : '';
              }, 1000);
              alertMessage(this.isEn ? `Verification code sent` : '验证码已发送', 'success');
              this.time = 59;
            } else {
              alertMessage(data.msg, 'error');
              this.isDisabled = false;
            }
          })
          .catch(e => {
            console.log(e);
          });
      }
    },
    location() {
      location.href = './personal.html';
    },
    // 获取用户协议的数据
    getUserAgrementData() {
      axios({ url: `/renren-fast/app/policy/queryActivityPolicy` }).then(({ data }) => {
        this.userAgrementData = data.policyEntity
        console.log('用户协议的数据', data.policyEntity);
      })
    },
    // 手动初始化 腾讯防水墙
    initTencentWaterproofWall() {
      new TencentCaptcha(this.$refs.TencentWater, '2065634367', (res) => {
        // ret为0时，代表验证成功
        if (res.ret == 0) {
          // console.log(res);
          // 调用后台接口
          // axios({
          //   url: `/renren-fast/sys/TCaptchaVerify/verifyTicket`, params: {
          //     rand: res.randstr,
          //     ticket: res.ticket
          //   }
          // }).then(({ data }) => {
          //   if (data.code == 0) {
          //     this.sendVerificationCode()
          //   } else {
          //     alertMessage(data.msg, 'error')
          //   }
          // })
          this.sendVerificationCode()
        } else {
          alertMessage(this.isEn ? `Please complete the verification process correctly` : '请正确完成验证过程', 'error')
        }
      },
        {
          userLanguage: JSON.parse(localStorage.getItem('isEn')) ? 'en' : `zh-cn`
        })
    }
  },
  created() {


    let link = document.querySelector('.link');
    if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
      document.documentElement.style.fontSize = '1.5625vw'
      link.href = './css/register_750.css';
    }
    localStorage.setItem('navId', 0);
    // this.isEn = JSON.parse(localStorage.getItem('isEn'));
    JSON.parse(localStorage.getItem('isEn')) == null ? this.isEn = true : this.isEn = JSON.parse(localStorage.getItem('isEn'));
    window.onstorage = e => {
      if (e.key == 'isEn') {
        this.isEn = JSON.parse(e.newValue);
      }
    };
    this.getUserAgrementData()
  },
  mounted() {
    this.initTencentWaterproofWall()
  },
  watch: {
    isEn(newVal) {
      localStorage.setItem('isEn', JSON.stringify(newVal));
    }
  }
});
