window.vm = new Vue({
  el: '#app',
  data() {
    return {
      bannerInfo: '',
      // 右上角的下拉菜单是否显示
      isActive: false,
      // 联系售后人员展示的内容
      contactAftersalesPerson: '',
      // 售后服务政策的内容
      afterSalesServicePolicy: '',
      // 常见问题的数据
      commonProblem: [],
      // 点击more之后显示的常见问题数据
      commonProblem2: [],
      isEn: true,
      // 是否显示联系售后的弹窗
      isShowContactAftersales: false,
      // 是否显示售后服务政策
      isAftersales: false,
      // 是否勾选
      isCheck: false,
      // 是否显示更多常见问题
      isShowCommonProblem2: false,
      // 是否关闭横幅
      isCloseMsg: false
    };
  },
  created() {


    this.getBannerInfo();
    let link = document.querySelector('.link');
    if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
      document.documentElement.style.fontSize = '1.5625vw'
      link.href = './css/repair_process_750.css';
    }
    this.init();
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
    // 点击退出登录的回调
    handleLogout() {
      // 移除用户信息
      localStorage.removeItem('userInfo');
      localStorage.removeItem('token');
      // 告诉顶部导航栏状态
      sessionStorage.setItem('isActive', false);
      // 隐藏下拉菜单
      this.isActive = false;
    },
    init() {
      // 联系售后人员展示要的数据
      axios({
        url: `/renren-fast/app/policy/queryContactAfterSale`
      }).then(({ data }) => {
        this.contactAftersalesPerson = data.policyEntity;
      });
      // 售后服务政策要展示的数据
      axios({
        url: `/renren-fast/app/policy/queryAfterSalesServicePolicy`
      }).then(({ data }) => {
        // console.log('售后服务政策', data.policyEntity);
        this.afterSalesServicePolicy = data.policyEntity;
      });
      // 常见问题部分的数据
      axios({ url: `/renren-fast/app/repaircommonproblem/findAll` }).then(({ data }) => {
        console.log('常见问题的数据', data.All);
        this.commonProblem = data.All.slice(0, 3);
        // console.log(this.commonProblem);
        this.commonProblem2 = data.All.slice(3);
      });
    },
    // 点击Start repair的回调
    handleContactAftersales() {
      this.isShowContactAftersales = true;
      document.body.scrollIntoView({ behavior: 'smooth' });
      document.body.style.overflow = 'hidden';
    },
    // 点击展示售后服务政策的回调
    handleAfterSales(isShow) {
      this.isAftersales = isShow;
    },
    // 点击提交按钮的回调
    handleConfirm() {
      if (this.isCheck) {
        window.location.href = 'repair_process2.html';
      } else {
        alert(this.isEn ? `Please select user protocol` : '需勾选用户协议');
      }
    },
    // 点击View progress的回调
    async goPersonal() {
      // 校验是否登录
      if (localStorage.token && localStorage.userInfo) {
        let { data } = await axios({ url: `/renren-fast/app/userInfo` });
        if (data.code == 0) {
          console.log(data.user);
          window.location.href = 'personal_repairOrder.html';
        } else {
          alert(this.isEn ? 'Login failure' : '登录失效');
          localStorage.setItem('prevNav', location.href);
          location.href = './login.html';
          return;
        }
      } else {
        alert(this.isEn ? `not logged on` : '没有登录');
        sessionStorage.setItem('prevNav', location.href);
        location.href = './login.html';
        return;
      }
    },
    // 点击关闭按钮的回调
    handleClose() {
      this.isShowContactAftersales = false;
      this.isAftersales = false;
      this.isCheck = false;
      document.body.style.overflow = 'auto';
    },
    // 点击常见问题标题的回调
    handleProblem(e) {
      let item;
      // 如果是点到了标题
      if (e.target.className == 'problem-title' || e.target.className == 'select-bottom') {
        item = e.target.parentNode.parentNode;
      } else {
        item = e.target.parentNode;
      }
      item.classList.toggle('active');
    }
  },
  mounted() {
    let items = document.querySelectorAll('.problem-title');
    console.log(items);
    items.forEach(item => {
      item.addEventListener('click', function () {
        // this.parentNode.className == "item-wrap" ? this.parentNode.className = "item-wrap active" : this.parentNode.className = "item-wrap";
        this.classList.toggle('active');
      });
    });
  },
  watch: {
  }
});
