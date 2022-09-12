Vue.config.productionTip = false;
window.vm = new Vue({
  el: '#app',
  data() {
    return {
      // 横幅的数据
      bannerInfo: '',
      allData: [],
      isEn: true,
      // 是否关闭横幅
      isCloseMsg: false
    };
  },
  created() {
    this.getBannerInfo();
    let link = document.querySelector('.link');
    if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
      link.href = './css/advantage_750.css';
      document.documentElement.style.fontSize = '1.5625vw'
    }
    this.init();
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
    init() {
      // 获取数据
      axios(`/renren-fast/app/coreAdvantage/queryList`).then(
        ({ data }) => {
          if (data.code === 0) {
            this.allData = data.coreAdvantageStatic;
            console.log(data);
          }
        },
        e => {
          console.log(e);
        }
      );
    }
  },
  watch: {
  }
});
window.onload = function () {
  localStorage.setItem('navId', 2);
};
