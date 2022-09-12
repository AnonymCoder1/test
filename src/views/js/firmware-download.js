new Vue({
  el: '#app',
  filters: {
    formatDate(date) {
      let time = new Date(date);
      let y = time.getFullYear();
      let m = time.getMonth() + 1;
      let d = time.getDate();
      return `${y}.${m}.${d}`;
    },
  },
  data() {
    return {
      bannerInfo: '',
      isEn: true,
      // 当前的tabs状态
      currentState: 1,
      // 顶部tabs的数据
      tabs: [],
      isSelectDialog: false,
      isSelectDialog2: false,
      // 第一个tab下的左侧导航栏的父级数据
      tabBar1: [],
      // 当前选中的固件id
      currentFirmwareId: '',
      // 右边展示的数据
      fileDate: '',
      // 第二个tab下的数据
      toolsDownloadsData: [],
      // 第三个tab下的左侧导航栏数据
      productDocumentationNav: [],
      // 第三个tab下的右侧数据
      fileDate2: [],
      // 当前选中的固件id2
      currentFirmwareId2: '',
      // 当前打开的用法说明
      currentId: '',
      no_active: {
        en: 'Open',
        ch: '打开'
      },
      active: {
        en: 'Put Away',
        ch: '收起'
      },
      // 是否关闭横幅
      isCloseMsg: false,
    };
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
              let messageBox = document.querySelectorAll('.message-wrap .animate_set .message');
              messageBox.forEach(element => {
                console.log(element.offsetWidth);
                if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
                  element.offsetWidth > 414 ? (element.style.animation = 'example 75s linear infinite') : (element.style.animation = 'example 40s linear infinite');
                  document.documentElement.style.fontSize = '1.5625vw'
                  return;
                }
                element.offsetWidth > 1920 ? (element.style.animation = 'example 75s linear infinite') : (element.style.animation = 'example 40s linear infinite');
              });
              console.log(messageBox);
            });
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
      axios({
        url: `/renren-fast/app/supportfilesmenu/list`
      }).then(({ data }) => {
        let result = this.treeDataTranslate(data);
        // result.sort((a, b) => a.orderNum - b.orderNum)
        this.tabs = result;
        console.log('顶部的tab数据', this.tabs);
        let tabBar1 = [];
        result.forEach(item => {
          tabBar1.push(item.children);
        });
        // 排序
        tabBar1.forEach(item => item.sort((a, b) => a.orderNum - b.orderNum))
        tabBar1[0].forEach(item => {
          item.children.sort((a, b) => a.orderNum - b.orderNum)
        })
        console.log('第一个tab下的左侧导航栏的父级数据', tabBar1[0]);
        this.tabBar1 = tabBar1[0];
        // tabBar1[1].forEach(item => (item.gmtModified = this.formatDate(item.gmtModified)));
        this.toolsDownloadsData = tabBar1[1].sort((a, b) => a.orderNum - b.orderNum);
        console.log('第二个tab下的数据', this.toolsDownloadsData);
        this.productDocumentationNav = tabBar1[2].sort((a, b) => a.orderNum - b.orderNum);
        console.log('第三个tab下的左侧导航数据', this.productDocumentationNav);
        // 默认选中第一个
        for (let i = 0; i < this.tabBar1.length && !this.currentFirmwareId; i++) {
          this.tabBar1[i].children && (this.currentFirmwareId = this.tabBar1[i].children[0].id);
        }
        this.handleCheck(this.currentFirmwareId);
        // 处理从产品详情跳转的情况
        this.getQuery().type == "document" && this.changeState(3)
      });
    },
    // 点击tabs的回调
    changeState(state) {
      this.currentState = state;
      if (state == 1) {
        this.currentId = this.fileDate[0].id;
      }
      if (state == 2) {
        this.currentId = this.toolsDownloadsData[0].id;
      }

      if (state == 3) {
        this.currentFirmwareId2 = this.productDocumentationNav[0].id;
        this.handleCheck2(this.currentFirmwareId2);
        this.currentId = this.fileDate2[0].id;
      }
    },
    // 点击左侧下拉按钮的回调
    handleSelect(e) {
      e.target.parentNode.classList.toggle('active');
    },
    // 点击左侧导航栏的回调
    handleCheck(id) {
      this.currentFirmwareId = id;
      // console.log('左侧导航栏的的id', this.currentFirmwareId);
      let childArr = [];
      // this.tabBar1.forEach(item => item.children && (item.gmtModified = this.formatDate(item.gmtModified)) && childArr.push(...item.children) );
      this.tabBar1.forEach(item => {
        if (item.children) {
          childArr.push(...item.children);
        }
      });
      this.fileDate = childArr.filter(item => item.id == id)[0].children;
      console.log(this.fileDate);
      // this.fileDate && this.fileDate.forEach(item => (item.gmtModified = this.formatDate(item.gmtModified)));
      // 排序
      this.fileDate && this.fileDate.sort((a, b) => a.orderNum - b.orderNum);
      // console.log('右边展示的数据', this.fileDate);
      this.currentId = this.fileDate && this.fileDate[0].id;
      this.isSelectDialog = false;
    },
    // 点击第三个tab下固件的回调
    handleCheck2(id) {
      this.currentFirmwareId2 = id;
      this.fileDate2 = this.productDocumentationNav.filter(item => item.id == id)[0].children.sort((a, b) => (a.orderNum = b.orderNum));
      // this.fileDate2.forEach(item => (item.gmtModified = this.formatDate(item.gmtModified)));
      // console.log(this.fileDate2, '---------------------')
      this.isSelectDialog2 = false;
    },
    // 转换为树形结构的函数
    treeDataTranslate(data, id = 'id', pid = 'parentId') {
      var res = [];
      var temp = {};
      for (var i = 0; i < data.length; i++) {
        temp[data[i][id]] = data[i];
      }
      for (var k = 0; k < data.length; k++) {
        if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
          if (!temp[data[k][pid]]['children']) {
            temp[data[k][pid]]['children'] = [];
          }
          if (!temp[data[k][pid]]['_level']) {
            temp[data[k][pid]]['_level'] = 1;
          }
          data[k]['_level'] = temp[data[k][pid]]._level + 1;
          temp[data[k][pid]]['children'].push(data[k]);
        } else {
          res.push(data[k]);
        }
      }
      return res;
    },

    // 点击open的回调
    handleOpen(id, e) {
      if (id == this.currentId) {
        this.currentId = '';
        // e.target.innerHTML = this.isEn ? `open` : `打开`
        return;
      }
      // debugger
      this.currentId = id;
      // 三元表达式嵌套使用
      // e.target.innerHTML = this.isEn ? `Put Away` : `收起`
      // console.dir(e.currentTarget.previousElementSibling)
    },
    // 点击下载的回调
    download(href, id) {
      if (id == 93) {
        axios('/renren-fast/app/supportfilesmenu/download').then(res => {
          location.href = href;
        })
        return
      }
      open(href)
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
  watch: {
    currentId(newVal) {
      // console.log(newVal);
    }
  },
  created() {


    this.getBannerInfo();
    let link = document.querySelector('.link');
    if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
      link.href = './css/firmware-download_750.css';
      document.documentElement.style.fontSize = '1.5625vw'
    }
    this.init();
    localStorage.setItem('navId', 0);
    JSON.parse(localStorage.getItem('isEn')) == null ? (this.isEn = true) : (this.isEn = JSON.parse(localStorage.getItem('isEn')));
    window.onstorage = e => {
      if (e.key == 'isEn') {
        this.isEn = JSON.parse(e.newValue);
      }
    };
    this.isCloseMsg = (sessionStorage.getItem('isCloseMsg') && sessionStorage.getItem('isCloseMsg').length) || false;


  }
});
