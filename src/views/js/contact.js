Vue.config.productionTip = false;
window.vm = new Vue({
  el: '#app',
  data() {
    return {
      bannerInfo: '',
      isEn: true,
      // 上面部分的数据
      contactInfoData: [],
      isCloseMsg: false,
      // 上面的下拉按钮
      options: [
        {
          value: 1,
          label: 'Sales'
        },
        {
          value: 2,
          label: 'After-Sales'
        },
        {
          value: 3,
          label: 'Business Cooperation'
        },
        {
          value: 4,
          label: 'Complaints and Suggestions'
        }
      ],
      // 下面的下拉按钮数据
      internationalDistrictNum: [],
      // 输入框部分
      // 下面表单的数据
      dataForm: {
        type: 3,
        // 联系人名
        name: '',
        // 公司名
        corporateName: '',
        email: '',
        // 手机号
        contactNumber: '',
        // 合作需求
        cooperationNeed: '',
        // 国际区号
        internationalDistrictNum: '',
        // 想咨询的产品号
        inquryProductModel: '',
        // 需求
        requirement: '',
        // 收货国家地址
        finalDestinationCountry: '',
        // 期望送到时间
        expectedDeliveryTime: ''
      }
    };
  },
  created() {

    if (this.getQuery().from == 'support') {
      this.dataForm.type = 2
    }


    this.getBannerInfo();
    let link = document.querySelector('.link');
    if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
      link.href = './css/contact_750.css';
      document.documentElement.style.fontSize = '1.5625vw'
    }
    this.init();
    localStorage.setItem('navId', 5);
    // this.isEn = JSON.parse(localStorage.getItem('isEn'));
    JSON.parse(localStorage.getItem('isEn')) == null ? this.isEn = true : this.isEn = JSON.parse(localStorage.getItem('isEn'));
    window.onstorage = e => {
      if (e.key == 'isEn') {
        this.isEn = JSON.parse(e.newValue);
      }
      if (e.key == 'isActive') {
        this.isActive = JSON.parse(e.newValue);
      }
    };
    this.isCloseMsg = (sessionStorage.getItem('isCloseMsg') && sessionStorage.getItem('isCloseMsg').length) || false;
  },
  methods: {
    // 横幅消息
    getBannerInfo() {
      axios(`/renren-fast/app/notification/streamer`)
        .then(({ data }) => {
          if (data.code == 0) {
            console.log('横幅消息', data.data);
            this.bannerInfo = data.data;
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
        })
        .catch(e => {
          console.log(e);
        });
    },
    // 关闭横幅消息
    close() {
      this.$refs.imgClose.style.display = 'none';
      sessionStorage.setItem('isCloseMsg', 'true');
    },
    init() {
      try {
        // 获取上面展示的数据
        axios(`/renren-fast/app/contactInfo/findAll`).then(({ data }) => {
          if (data.code === 0) {
            this.contactInfoData = data.All;
            console.log('上面展示部分的数据', this.contactInfoData);
          }
        });
        // 获取国家手机号前缀的数据
        axios(`/renren-fast/app/personalCenterRepairWorkOrder/queryphonecode`).then(({ data }) => {
          this.internationalDistrictNum = data.newCountriesEntityList;

          console.log('所有国家手机号前缀的数据', this.internationalDistrictNum);
          setTimeout(() => {
            this.componentInit();
            let item = document.querySelector('.select-wrap2 [data-value="+86"]');
            item.onclick();
          });
        });
      } catch (e) {
        console.log(e);
      }
    },
    // 点击提交的回调
    async submitForm() {
      // 校验是否必填
      let inputs = document.querySelectorAll('.required >input');
      inputs.forEach(item => item.onblur());
      let error = document.querySelector('.error_warp');
      if (error) return;
      // 校验是否登录
      if (localStorage.token && localStorage.userInfo) {
        let { data } = await axios({ url: `/renren-fast/app/userInfo` });
        if (data.code == 0) {
          console.log(data.user);
        } else {
          alert(this.isEn ? `Login failure` : '登录失效');
          localStorage.setItem('concatInfo', JSON.stringify(this.dataForm));
          localStorage.setItem('prevNav', 'index.html');
          window.location.href = './login.html';
          return;
        }
      } else {
        alert(this.isEn ? `not logged on` : '没有登录');
        localStorage.setItem('concatInfo', JSON.stringify(this.dataForm));
        sessionStorage.setItem('prevNav', 'contact.html');

        window.location.href = './login.html';
        return;
      }
      // 提交数据
      axios({
        url: `/renren-fast/app/contact/save`,
        method: 'POST',
        data: {
          ...this.dataForm,
          userId: JSON.parse(localStorage.getItem('userInfo')).userId
        }
      })
        .then(({ data }) => {
          console.log('提交的数据：', data);
          alert(this.isEn ? `Submitted successfully` : `提交成功`);
          window.location.href = '../../index.html';
        })
        .catch(e => {
          alert(e);
        });
    },
    componentInit() {
      // 选择器的js
      //   获取所有选项元素
      let items = document.querySelectorAll('.select-item-wrap .select-item');
      //   获取所有兄弟元素的方法
      function siblings(elm) {
        let a = [];
        let p = elm.parentNode.children;
        for (let i = 0; i < p.length; i++) {
          if (p[i].nodeType == 1 && p[i] != elm) {
            a.push(p[i]);
          }
        }
        return a;
      }
      items.forEach(selectItem => {
        if (selectItem.dataset.value == selectItem.parentElement.previousElementSibling.previousElementSibling.value) {
          selectItem.className += ' active';
          selectItem.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.value = selectItem.children[0].innerHTML;
        }
        // 给item添加点击事件
        selectItem.onclick = function (e) {
          // 获取选项
          let select = this.parentNode.previousElementSibling.previousElementSibling;
          // 清空兄弟的类名
          let sibling = siblings(this);
          sibling.forEach(item => {
            item.className = 'select-item';
          });
          //   给自己加类名
          this.className += ' active';
          //   给输入框赋值
          select.value = this.getAttribute('data-value');
          //  给显示的输入框赋值
          select.previousElementSibling.value = this.innerText;
          select.dispatchEvent(new Event('input'));
        };
      });
    },
    getQuery() {
      let queryArr = window.location.search.slice(1).split('&');
      let queryObj = {};
      queryArr.forEach(item => {
        queryObj[item.split('=')[0]] = item.split('=')[1];
      });
      return queryObj;
    }
  },
  async mounted() {
    // 校验是否登录
    // if (localStorage.token && localStorage.userInfo) {
    //   let { data } = await axios({ url: `/renren-fast/app/userInfo` });
    //   if (data.code == 0) {
    //     console.log(data.user);
    //   } else {
    //     alert(this.isEn ? `Login failure` : '登录失效');
    //     localStorage.setItem('prevNav', location.href);
    //     location.href = './login.html';
    //     return;
    //   }
    // } else {
    //   alert(this.isEn ? `not logged on` : '没有登录');
    //   sessionStorage.setItem('prevNav', location.href);
    //   location.href = './login.html';
    //   return;
    // }
    let inputs = document.querySelectorAll('.required input');
    let email = document.querySelector('.email');
    inputs.forEach(item => {
      item.onblur = check2(item, [
        {
          rule: 'empty',
          errorMsg: this.isEn ? `Cannot be empty` : `不能为空`
        }
      ]);
    });
    email.onblur = check2(email, [
      {
        rule: 'empty',
        errorMsg: this.isEn ? `Cannot be empty` : `不能为空`
      },
      {
        rule: 'email',
        errorMsg: this.isEn ? `The mailbox format is incorrect` : '邮箱格式不对'
      }
    ]);
  },
  watch: {
    isEn(newVal) {
      let inputs = document.querySelectorAll('.required input');
      let email = document.querySelector('.email');
      let error = document.querySelectorAll('.error_warp');
      error.forEach(item => {
        item.innerText = newVal ? `Cannot be empty` : '不能为空';
      });
      if (!newVal) {
        // 中文
        let show = document.querySelector('.show');
        inputs.forEach(item => {
          item.onblur = check2(item, [
            {
              rule: 'empty',
              errorMsg: '不能为空'
            }
          ]);
        });
        email.onblur = check2(email, [
          {
            rule: 'empty',
            errorMsg: this.isEn ? `Cannot be empty` : `不能为空`
          },
          {
            rule: 'email',
            errorMsg: '邮箱格式不对'
          }
        ]);
        this.options = [
          {
            value: '1',
            label: '售前'
          },
          {
            value: '2',
            label: '售后'
          },
          {
            value: '3',
            label: '商业合作'
          },
          {
            value: '4',
            label: '投诉与建议'
          }
        ];
        // TODO有问题循环选项
        this.options.forEach(item => {
          // 如果选项的value == 当前的类型，则赋值
          if (item.value == this.dataForm.type) {
            show.value = item.label;
          }
        });
      } else {
        let show = document.querySelector('.show');
        // 英文
        inputs.forEach(item => {
          item.onblur = check2(item, [
            {
              rule: 'empty',
              errorMsg: 'Cannot be empty'
            }
          ]);
        });
        email.onblur = check2(email, [
          {
            rule: 'empty',
            errorMsg: this.isEn ? `Cannot be empty` : `不能为空`
          },
          {
            rule: 'email',
            errorMsg: 'The mailbox format is incorrect'
          }
        ]);
        this.options = [
          {
            value: '1',
            label: 'Sales'
          },
          {
            value: '2',
            label: 'After-Sales'
          },
          {
            value: '3',
            label: 'Business Cooperation'
          },
          {
            value: '4',
            label: 'Complaints and Suggestions'
          }
        ];
        // TODO有问题循环选项
        this.options.forEach(item => {
          // 如果选项的value == 当前的类型，则赋值
          if (item.value == this.dataForm.type) {
            show.value = item.label;
          }
        });
      }
    },
    'dataForm.type'(newVal) {
      if (newVal == 1) {
        setTimeout(() => {
          let inputs = document.querySelectorAll('.sales-wrap input');
          inputs.forEach(item => {
            item.onblur = check2(item, [
              {
                rule: 'empty',
                errorMsg: this.isEn ? `Cannot be empty` : `不能为空`
              }
            ]);
          });
        });
      }
    }
  }
});
