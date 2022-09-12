// axios.defaults.baseURL = "192.168.0.51";
// 海石
// axios.defaults.baseURL = "http://127.0.0.1:6001";
// 昌富
// axios.defaults.baseURL = "http://192.168.1.23:6001";
// axios.defaults.baseURL = "http://120.55.91.37:8086";
// 泽滔
// axios.defaults.baseURL = 'http://192.168.1.24:6001';
// 嘉怡
// axios.defaults.baseURL = 'http://192.168.1.17:6001';
// 熊慧
//axios.defaults.baseURL = 'http://localhost:6001';
//测试环境
//axios.defaults.baseURL = 'http://52.12.129.230/';
//正式环境
axios.defaults.baseURL = 'https://www.whatsminer.com';


// 请求拦截
axios.interceptors.request.use(
  function (config) {
    let token = localStorage.getItem('token');
    var lang;
    if (JSON.parse(localStorage.getItem('isEn')) == null) {
      lang = `en_US`;
    } else {
      lang = JSON.parse(localStorage.getItem('isEn')) ? `en_US` : `zh_CN`;
    }
    config.headers.token = token;
    if (config.params) {
      config.params.lang = lang;
    } else if (config.url.indexOf('?') == -1) {
      config.url += `?lang=${lang}`;
    } else {
      config.url += `&lang=${lang}`;
    }
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);
let title = document.querySelector('title');
// 设置图标
window.addEventListener('load', function () {
  title.innerHTML = JSON.parse(localStorage.getItem('isEn')) && JSON.parse(localStorage.getItem('isEn')) ? 'WhatsMiner' : '比特微';
  // let link = document.createElement('link');
  let head = document.querySelector('head');
  let link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/png';
  link.sizes = '32x32';
  link.href = '../../static/favicon.ico';
  head.appendChild(link);
});
// 设置标题
window.addEventListener('storage', e => e.key == 'isEn' && (title.innerHTML = JSON.parse(localStorage.getItem('isEn')) ? 'WhatsMiner' : '比特微'));

function throttle(fn, delay = 1000) {
  let flag = true;
  return function () {
    if (flag) {
      setTimeout(() => {
        fn.apply(this, arguments);
        flag = true;
      }, delay);
    }
    flag = false;
  };
}
// window.addEventListener('load', function () {
//   let title = document.querySelector('title')
//   title.innerHTML = JSON.parse(localStorage.getItem('isEn')) ? `WhatsMiner` : `比特微`
//   document.body.style.width = window.screen.width + 'px'
// })

window.addEventListener('load', function () {
  let title = document.querySelector('title');
  title.innerHTML = JSON.parse(localStorage.getItem('isEn')) ? `WhatsMiner` : `比特微`;
});

let scrollTop = 0;
let currentTop = 0;
// 设置导航栏
window.onscroll = throttle(function (e) {
  // TODO如果把这个获取dom放到函数外面会出现灵异事件
  let header = document.querySelector('iframe');
  currentTop = document.documentElement.scrollTop;
  currentTop >= (header && header.offsetHeight) && currentTop >= scrollTop ? header.classList.add('nav_hide') : header.classList.remove('nav_hide');
  scrollTop = currentTop;
}, 300);
