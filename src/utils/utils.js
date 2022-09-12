/*
1.表单验证工具： 执行check函数，传入需要校验的值和校验的规则，可传入多个，不过需要按照顺序传入，如果出现错误会返回一个错误信息
使用示例：
let error = check(
  value1,[
  {rule:'empty',errorMsg:'value1内容不能为空'},
  {rule:'num' errorMsg:'value1必须为数字' }
],
value2,[
  {rule:'minLength',error:'value2的最小长度为3',minLength:3},
  {rule:'maxLength',error:'value2的最打长度为10',maxLength:10},
]
...
)
*/
// 规则对象
let Rules = {
  num: (value, config) => {
    if (isNaN(+value)) {
      window.ruleError = config.errorMsg || `必须为数字类型`;
    }
  },
  empty(value, config) {
    if (!value) {
      window.ruleError = config.errorMsg || `内容不能为空`;
    }
  },
  minLength(value, config) {
    if (value.length < config.minLength) {
      window.ruleError = config.errorMsg || `小于最短长度:${config.minLength}`;
    }
  },
  maxLength(value, config) {
    if (value.length > config.maxLength) {
      window.ruleError = config.errorMsg || `超出最大长度:${config.maxLength}`;
    }
  },
  phone(value, config) {
    if (!/^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/.test(value)) {
      window.ruleError = config.errorMsg || `手机号码格式不正确`;
    }
  },
  email(value, config) {
    if (!/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(value)) {
      window.ruleError = config.errorMsg || `邮箱格式不正确`;
    }
  }
};
// 校验函数
function check(...arg) {
  window.ruleError = null;
  let valueArr = arg.filter((item, index) => index % 2 == 0);
  let configArr = arg.filter((item, index) => index % 2 == 1);
  for (let i = 0; i < valueArr.length && !window.ruleError; i++) {
    try {
      configArr[i].forEach(item => {
        // item.rule 是规则的名字
        // valueArr[i] 是要校验的值
        // item 是配置项
        if (!Rules[item.rule]) {
          throw Error(`没有${item.rule}这个规则`);
        }
        Rules[item.rule](valueArr[i], item);
      });
    } catch (e) {
      alert(e.message);
    }
  }
  return window.ruleError;
}
// 规则对象2
let Rules2 = {
  num: (input, config) => {
    if (isNaN(+input.value)) {
      window.ruleError = config.errorMsg || `必须为数字类型`;
      return input;
    }
  },
  empty(input, config) {
    if (!input.value.trim()) {
      window.ruleError = config.errorMsg || `内容不能为空`;
      input.value = '';
      return input;
    }
  },
  minLength(input, config) {
    if (input.value.length < config.minLength) {
      window.ruleError = config.errorMsg || `小于最短长度:${config.minLength}`;
      return input;
    }
  },
  maxLength(input, config) {
    if (value.length > config.maxLength) {
      window.ruleError = config.errorMsg || `超出最大长度:${config.maxLength}`;
      return input;
    }
  },
  phone(input, config) {
    if (!/^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/.test(input.value)) {
      window.ruleError = config.errorMsg || `手机号码格式不正确`;
      return input;
    }
  },
  email(input, config) {
    if (!/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(input.value)) {
      window.ruleError = config.errorMsg || `邮箱格式不正确`;
      return input;
    }
  },
  // 特殊
  check(input, config) {
    // console.log(config.value.lastRepairDeliveryNo);
    axios({
      url: `/renren-fast/app/repairmaininsert/queryLastRepairDeliveryNo`,
      params: {
        deliveryNo: config.value.lastRepairDeliveryNo
      }
    }).then(({ data }) => {
      console.log(data);
      if (data.code != 0) {
        alertMessage(data.msg, 'error');
        window.ruleError = data.msg || `出错了`;
      }
    });
    return input;
  },
  zimushuzi(input, config) {
    if (!/^[a-zA-Z0-9]+$/.test(input.value.trim())) {
      window.ruleError = config.errorMsg || `请输入字母或数字`;
      return input;
    }
  }
};
// 校验函数2，需要传入的是要校验的dom和校验的配置项
function check2(dom, arg) {
  return function (config) {
    this.obj = 依赖的函数(this, config);
    // 如果有错误
    if (this.obj.errorDom) {
      // 获取出问题元素的定位父元素
      let parent = this.offsetParent;
      // 获取出问题元素的定位
      let offsetTop = this.obj.errorDom.offsetTop;
      let offsetLeft = this.obj.errorDom.offsetLeft;
      // 获取出问题元素的高度
      let height = this.obj.errorDom.offsetHeight;
      this.obj.errorDom.classList.add('errorDom');
      // 判断之前有没有错误元素
      if (this.errorInfo_wrap) {
        // 如果之前有错误元素
        this.errorInfo_wrap.innerHTML = this.obj.errorMsg;
      } else {
        // 没有的话创建一个
        this.errorInfo_wrap = document.createElement('span');
        // 给容器添加错误信息
        this.errorInfo_wrap.innerHTML = this.obj.errorMsg;
        // 给装错误信息的容器添加样式
        this.errorInfo_wrap.style.cssText = `
                position: absolute;
                top:${offsetTop + height}px;
                left:${offsetLeft}px;
                display: inline-block;
                color: red;
                `;
        this.errorInfo_wrap.className = 'error_warp';
        parent && parent.appendChild(this.errorInfo_wrap);
      }
    } else {
      // 没有错误
      dom.classList.remove('errorDom');
      // 如果之前有错误
      if (this.errorInfo_wrap) {
        // 删除错误信息元素
        // console.dir(this);
        if (this.errorInfo_wrap.parentNode) {
          this.errorInfo_wrap.parentNode.removeChild(this.errorInfo_wrap);
        }
        delete this.errorInfo_wrap;
      }
    }
  }.bind(dom, arg);
}
function 依赖的函数(...arg) {
  // 错误提示消息
  window.ruleError = null;
  // 出问题的dom元素
  window.errorDom = '';
  let domArr = arg.filter((item, index) => index % 2 == 0);
  let configArr = arg.filter((item, index) => index % 2 == 1);
  // 每一个元素
  for (let i = 0; i < domArr.length; i++) {
    // 当前元素
    let dom = domArr[i];
    // 遍历每一个校验
    for (let j = 0; j < configArr[i].length && !window.errorDom; j++) {
      // 每一个配置项
      let configItem = configArr[i][j];
      if (!Rules2[configItem.rule]) {
        throw Error(`没有${configItem.rule}这个规则`);
      }
      window.errorDom = Rules2[configItem.rule](dom, configItem);
    }
  }
  return {
    errorMsg: window.ruleError,
    errorDom: window.errorDom
  };
}
// 2.全局消息弹框
/*
调用alertMessage函数可以弹出一个全局弹窗, 第一个参数是提示的文字, 第二个参数是提示框的类型可选值: success warn info error 第三个参数是显示的时长 第四个参数是弹出框的类
 */
function alertMessage(message = '这是默认的提示文字,如果想要设置提示文字,可以传入参数', type = 'none', duration = '3s', setClass = 'error_wrap') {
  let error_wrap = document.createElement('div');
  switch (type) {
    case 'success':
      error_wrap.style.background = 'rgb(240,249,235)';
      error_wrap.style.color = 'rgb(103,194,58)';
      break;
    case 'warn':
      error_wrap.style.background = 'rgb(253,246,236)';
      error_wrap.style.color = 'rgb(230,162,60)';
      break;
    case 'info':
      error_wrap.style.background = 'rgb(237,242,252)';
      error_wrap.style.color = 'rgb(144,147,153)';
      break;
    case 'error':
      error_wrap.style.background = 'rgb(254,240,240)';
      error_wrap.style.color = 'rgb(245,108,108)';
      break;
  }
  error_wrap.className = setClass;
  error_wrap.innerHTML = message;
  error_wrap.style.animation = `showError ${duration} forwards`;
  document.documentElement.appendChild(error_wrap);
}
/*
3.获取url的query参数
不需要传值,参数以对象的形式返回，需要接收一下
*/
function getQuery() {
  let queryArr = window.location.search.slice(1).split('&');
  let queryObj = {};
  queryArr.forEach(item => {
    queryObj[item.split('=')[0]] = item.split('=')[1];
  });
  return queryObj;
}
// 4.切换类名
// 需要传入元素，要切换的类名
function changeClassName(dom, className) {
  return function (className) {
    this.classList.toggle(className);
  }.bind(dom, className);
}

// 5. 简单的格式时间函数
function formatDate(date) {
  let time = new Date(date);
  let y = time.getFullYear();
  let m = time.getMonth() + 1;
  let d = time.getDate();
  return `${y}.${m}.${d}`;
}
function newDay(value, formate) {
  let dt = new Date(value);
  let y = dt.getFullYear();
  let m = dt.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  let d = dt.getDate();
  d = d < 10 ? '0' + d : d;
  let hh = dt.getHours();
  hh = hh < 10 ? '0' + hh : hh;
  let mm = dt.getMinutes();
  mm = mm < 10 ? '0' + mm : mm;
  let ss = dt.getSeconds();
  ss = ss < 10 ? '0' + ss : ss;
  return `${y}.${m}.${d} ${hh}:${mm}:${ss}`;
}
// 防抖
function debounce(fn, delay = 1000) {
  let t = null;
  return function () {
    t ? clearTimeout(t) : fn.apply(this, arguments);
    t = setTimeout(() => {
      t = null;
    }, delay);
  };
}
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
// 格式时间的函数
Date.prototype.formatDate = function (timeStamp = +new Date(), format = `YYYY-MM-DD hh:mm:ss`, isZeroFilling = true) {
  let date = new Date(timeStamp);
  let config = {
    YYYY: date.getFullYear(),
    MM: date.getMonth() + 1,
    DD: date.getDate(),
    hh: date.getHours(),
    mm: date.getMinutes(),
    ss: date.getSeconds()
  };
  let padZero = arg => arg.forEach(item => (config[item] = config[item] < 9 ? '0' + config[item] : config[item]));
  isZeroFilling && padZero(['MM', 'DD', 'hh', 'ss']);
  for (let key in config) format = format.replace(key, config[key]);
  return format;
};
window.$ = (el, isAll = false) => (isAll ? document.querySelectorAll(el) : document.querySelector(el));
Array.prototype.delete = function (item) {
  this.splice(this.indexOf(item), 1);
};
function test() {
  return '黄善活'
}