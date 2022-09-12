new Vue({
  el: '#app',
  data() {
    return {
      bannerInfo: '',
      checkId: '',
      deleteId: null,
      isSubmit: 2,
      delete_one: 1,
      isEn: true,
      messageData: [],
      isMessageClose: false,
      isPhone: false,
      // 是否关闭横幅
      isCloseMsg: false
    };
  },
  created() {


    this.getBannerInfo();
    let link = document.querySelector('.link');
    if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
      this.isPhone = true;
      link.href = './css/personal_message_750.css';
      document.documentElement.style.fontSize = '1.5625vw'
    }
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
    localStorage.setItem('navId', 0);
    localStorage.setItem('nav-bar-id', 7);
    this.init();
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
    openId(id) {
      console.log(id);
      if (this.checkId == id) {
        this.checkId = '';
        return;
      }
      this.checkId = id;
    },
    // 点击退出登录的回调
    handleLogout() {
      // 移除用户信息
      localStorage.removeItem('userInfo');
      localStorage.removeItem('token');
    },
    init() {
      axios({
        url: `/renren-fast/app/notification/message`,
        params: {
          userId: JSON.parse(localStorage.getItem('userInfo')).userId
        }
      })
        .then(({ data }) => {
          console.log(data);
          try {
            if (data.code == 0) {
              let list = data.data || [];
              list.forEach(item => {
                item.gmtCreate = this.formatDate(item.gmtCreate);
              });
              this.messageData = list;
              console.log('全部消息的数据', this.messageData);
            }
          } catch (error) {
            console.log(error);
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    // 点击删除图标和删除全部按钮的回调
    deleteMessage(item) {
      if (item.id) {
        console.log('删除id为：' + item.id);
        axios({
          url: `/renren-fast/app/notification/messagedelete?messageId=${item.id}`,
          method: 'POST'
        })
          .then(res => {
            if (res.data.code == 401) {
              // 登录失效
              alert(this.isEn ? `Login failed, please login again` : '登录失效，请重新登录');
              window.location.href = `login.html`;
              return;
            }
            alert(this.isEn ? 'successfully deleted' : '删除成功');
            this.messageData.splice(
              this.messageData.findIndex(message => message.id == item.id),
              1
            );
          })
          .catch(e => {
            console.log(e);
          });
      } else {
        let isDelete = confirm(this.isEn ? `Are you sure to delete all?` : '确定删除全部吗？');
        if (isDelete) {
          console.log('确认删除全部');
          axios({ url: `/renren-fast/app/notification/messagedelete`, method: 'POST' }).then(res => {
            if (res.data.code == 401) {
              alert(this.isEn ? `Login failed, please login again` : '登录失效，请重新登录');
              window.location.href = `login.html`;
            }
            this.messageData = [];
          });
        } else {
          console.log('取消删除');
        }
      }
    },
    // 格式化时间函数
    formatDate(date) {
      let time = new Date(date);
      let y = time.getFullYear();
      let m = time.getMonth() + 1;
      let d = time.getDate();
      return `${y}.${m}.${d}`;
    },

    deleteDialog(id) {
      console.log(id);
      if (!id == '') {
        this.deleteId = id;
        this.delete_one = 1;
      } else {
        this.deleteId = id;
        this.delete_one = 0;
      }
      this.isMessageClose = true;
    },
    close_button() {
      this.isMessageClose = false;
    },
    confirm_button() {
      if (this.deleteId != false) {
        axios({
          url: `/renren-fast/app/notification/messagedelete?messageId=${this.deleteId}`,
          method: 'POST'
        })
          .then(res => {
            if (res.data.code == 401) {
              // 登录失效
              alert(this.isEn ? `Login failed, please login again` : '登录失效，请重新登录');
              window.location.href = `login.html`;
              return;
            }
            // alert('删除成功')
            console.log('删除id为：' + this.deleteId);
            this.messageData.splice(
              this.messageData.findIndex(message => message.id == this.deleteId),
              1
            );
            this.deleteId = null;
            this.isMessageClose = false;
          })
          .catch(e => {
            console.log(e);
          });
      } else {
        console.log('确认删除全部');
        axios({ url: `/renren-fast/app/notification/messagedelete`, method: 'POST' }).then(res => {
          if (res.data.code == 401) {
            alert(this.isEn ? `Login failed, please login again` : '登录失效，请重新登录');
            window.location.href = `login.html`;
          }
          // TODO
          this.messageData = [];
          this.isMessageClose = false;
        });
      }
    }
  },
  watch: {
  }
});
