Vue.config.productionTip = false;
window.vm = new Vue({
  el: '#app',
  created() {


    let link = document.querySelector('.link');
    if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
      link.href = './css/dynamic_750.css';
      document.documentElement.style.fontSize = '1.5625vw'
    }
    // this.isEn = JSON.parse(localStorage.getItem('isEn'));
    JSON.parse(localStorage.getItem('isEn')) == null ? this.isEn = true : this.isEn = JSON.parse(localStorage.getItem('isEn'));
    window.onstorage = e => {
      if (e.key == 'isEn') {
        this.isEn = JSON.parse(e.newValue);
        this.getData(this.count, this.current);
      }
    };
    this.getData(this.count, this.current);
    this.isCloseMsg = (sessionStorage.getItem('isCloseMsg') && sessionStorage.getItem('isCloseMsg').length) || false;
    this.getBannerInfo();
  },
  data() {
    return {
      bannerInfo: '',
      // 全部的新闻数据
      allNewsData: [],
      // 右上角的下拉菜单是否显示
      isActive: false,
      // 展示的新闻数据
      dynamicData: [],
      isEn: true,
      // 展示的新闻条数
      count: 7,
      // 当前是新闻还是评测 （1新闻2评测）
      current: 1,
      // 当前的新闻条数
      currentCount: 7,
      // 每次增加的新闻条数
      addNewsCount: 6,
      // 节流的间隔
      delay: 500,
      // 距离底部多少开始加载
      offsetBottom: 1000,
      // 是否关闭横幅
      isCloseMsg: false
    };
  },
  methods: {
    // 关闭横幅消息
    close() {
      this.$refs.imgClose.style.display = 'none';
      sessionStorage.setItem('isCloseMsg', 'true');
    },
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
                  document.documentElement.style.fontSize = '1.5625vw'
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
    // 获取数据
    getData(count, type = 1) {
      try {
        axios.get(`/renren-fast/app/news/querynewsfirst?count=999&type=${type}`).then(({ data }) => {
          // console.log(data);
          if (data.code === 0) {
            // console.log(data.newsEntities);
            data.newsEntities.forEach(item => {
              item.releaseTime = this.formatDate(item.releaseTime);
            });
            this.allNewsData = data.newsEntities;
            console.log('所有的数据', this.allNewsData);
            this.dynamicData = this.allNewsData.slice(0, this.count);
            console.log('展示的数据', this.dynamicData);
          }
        });
      } catch (e) {
        console.log(e);
      }
    },
    // 点击more的回调
    handleMore(item) {
      // localStorage.setItem('dynamicId', id)
      let title = (item.titleEn.split(" ")).join("-");
      window.location.href = `dynamic_detail.html?id=${item.id}&type=${this.current}&title=${title}`;
    },
    // 格式化时间函数
    formatDate(date) {
      let time = new Date(date);
      let y = time.getFullYear();
      let m = time.getMonth() + 1;
      let d = time.getDate();
      return `${y}.${m}.${d}`;
    }
  },
  watch: {
    current(newVal) {
      this.getData(this.count, newVal);
    }
  }
});
window.addEventListener('load', function () {
  localStorage.setItem('navId', 4);
})
// window.onload = function () {
//   localStorage.setItem('navId', 4);
// };
// 节流
function throttle(fn, delay = 1000) {
  let flag = true;
  //方式一
  let begin = 0;
  return function () {
    let cur = +new Date();
    if (cur - begin > delay) {
      fn.apply(this, arguments);
      begin = cur;
    }
  };
  // 方式二
  // return function () {
  //   if (flag) {
  //     setTimeout(() => {
  //       fn.apply(this, arguments)
  //       flag = true
  //     }, delay);
  //   }
  //   flag = false
  // }
}
// 懒加载
window.addEventListener('scroll', throttle(function (e) {
  let 整个页面的高度 = document.body.offsetHeight;
  let 滚动的高度 = window.scrollY;
  let 可视区域的高度 = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  let 距离底部的距离 = 整个页面的高度 - 滚动的高度 - 可视区域的高度;
  if (距离底部的距离 < this.vm.offsetBottom) {
    this.vm.dynamicData.push(...this.vm.allNewsData.splice(this.vm.currentCount, this.vm.addNewsCount));
  }
}, this.vm.delay))

// window.onscroll = throttle(function (e) {
//   let 整个页面的高度 = document.body.offsetHeight;
//   let 滚动的高度 = window.scrollY;
//   let 可视区域的高度 = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
//   let 距离底部的距离 = 整个页面的高度 - 滚动的高度 - 可视区域的高度;
//   if (距离底部的距离 < this.vm.offsetBottom) {
//     this.vm.dynamicData.push(...this.vm.allNewsData.splice(this.vm.currentCount, this.vm.addNewsCount));
//   }
// }, this.vm.delay);
