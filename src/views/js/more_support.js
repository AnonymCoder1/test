Vue.config.productionTip = false
new Vue({
  el: '#app',
  created() {
    let title = document.querySelector('title')
    title.innerHTML = this.isEn ? 'WhatsMiner' : '比特微'
    this.getBannerInfo()
    this.baseUrl = axios.defaults.baseURL
    let link = document.querySelector('.link')
    if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
      link.href = './css/more_support_750.css'
      document.documentElement.style.fontSize = '1.5625vw'
    }
    localStorage.setItem('navId', 0)
    // this.isEn = JSON.parse(localStorage.getItem('isEn'));
    JSON.parse(localStorage.getItem('isEn')) == null ? (this.isEn = true) : (this.isEn = JSON.parse(localStorage.getItem('isEn')))
    window.onstorage = e => {
      if (e.key == 'isEn') {
        this.isEn = JSON.parse(e.newValue)
      }
      if (e.key == 'isActive') {
        this.isActive = JSON.parse(e.newValue)
      }
    }
    if (this.isEn) {
      this.errorMsg = 'Cannot be empty'
      this.placeholder = 'Please fill'
    } else {
      this.errorMsg = '不能为空'
      this.placeholder = '请填写'
    }
    this.init()
    this.dataform.custom.time = this.formatDate(+new Date() + 1000 * 60 * 60 * 24 * 7)
    this.isCloseMsg = (sessionStorage.getItem('isCloseMsg') && sessionStorage.getItem('isCloseMsg').length) || false
  },
  data() {
    return {
      pickeroptions: {
        disabledDate: time => {
          let seven = 7 * 24 * 60 * 60 * 1000
          return time.getTime() < Date.now() + seven
        }
      },
      bannerInfo: '',
      isUploadSuccess: false,
      baseUrl: '',
      // 右上角的下拉菜单是否显示
      isActive: false,
      // 当前时间
      nowTime: '',
      // 是否是英文状态
      isEn: true,
      // 输入框的值
      input: '',
      dataform: {
        // 类型
        type: '',
        // 联系人姓名
        contactName: '',
        //联系人电话
        contactPhone: '',
        custom: {
          // 矿机总数量
          sum: '',
          // 矿工地址
          Address: '',
          // Miner模型及其对应量
          modelAmount: '',
          // 预计到达时间
          time: '',
          //交换机和路由器型号及对应数量
          Router: '',
          //  故障机型号及其描述
          malfunction: ''
        },
        //  厂房图片
        designChartArr: []
      },
      // 输入框为空的错误提示信息
      errorMsg: '',
      // 提示文字
      placeholder: '',
      // 售后服务政策的数据
      requirementsData: {},
      // 申请类型的数据
      applicationType: [],
      fileList: [],
      // 是否关闭横幅
      isCloseMsg: false
    }
  },
  methods: {
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
    // 图片给加载中的回调
    handleProgress(file) {
      this.loading = this.$loading({
        lock: true,
        text: '正在加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      if (!isJPG && !isPNG) {
        alert(this.isEn ? 'Only upload images in jpg or png format!' : '只能上传jpg或png格式的图片!')
      }
      return isJPG || isPNG
    },
    // 图片上传成功的回调
    handleSuccess(file, fileList) {
      this.loading.close()
      this.isUploadSuccess = true
      const picInfo = { pis: file.url, name: fileList.name }
      // const picInfo = { pis: file.id, name: fileList.name }
      this.fileList.push(picInfo)
      this.dataform.designChartArr = Array.from(this.fileList, ({ pis }) => pis)
      console.log(this.dataform.designChartArr)
    },
    // 删除图片的回调
    handleRemove(file) {
      if (file && file.status === 'success') {
        const i = this.fileList.findIndex(x => x.uid == file.uid)
        this.fileList.splice(i, 1)
        this.dataform.designChartArr = Array.from(this.fileList, ({ pis }) => pis)
        console.log(this.dataform.designChartArr)
      }
    },
    // 图片上传失败的回调
    handleError(file) {
      this.loading.close()
      alert(this.isEn ? 'Failed to upload image' : '上传图片失败')
    },
    async init() {
      // 申请类型的 数据
      axios({ url: `/renren-fast/app/serviceapply/list` }).then(({ data }) => {
        this.applicationType = data.list || []
        console.log('申请类型的数据', data.list)
        setTimeout(() => {
          this.componentInit()
          this.dataform.type = data.list[0].type
          let item = document.querySelector('.select-wrap .select-item-wrap .select-item:nth-child(1)')
          item.onclick()
          let input = document.querySelector('.select-wrap .select_inner')
          input.value = this.isEn ? data.list[0] && data.list[0].applicationTypeEn : data.list[0] && data.list[0].applicationType
        })
      })
      // 检测是否登陆
      if (localStorage.token && localStorage.userInfo) {
        let { data } = await axios({ url: `/renren-fast/app/userInfo` })
        if (data.code == 0) {
          console.log('登陆成功', data.user);

        } else {
          // alert(this.isEn ? `Login failure` : '登录失效')
          localStorage.setItem('repairInfo', JSON.stringify(this.dataForm))
          localStorage.setItem('prevNav', location.href)
          location.href = './login.html'
          return
        }
      } else {
        // alert(this.isEn ? `not logged on` : '没有登录')
        localStorage.setItem('repairInfo', JSON.stringify(this.dataForm))
        sessionStorage.setItem('prevNav', location.href)
        location.href = './login.html'
        return
      }

    },
    // 点击提交的回调
    handleSubmit() {
      // 判断是否有错误
      console.log(this.dataform.designChartArr)
      let inputs = document.querySelectorAll('.required input')
      let textareas = document.querySelectorAll('.required textarea')
      try {
        inputs.forEach(item => {
          item.onblur()
        })
        textareas.forEach(item => {
          item.onblur()
        })
      } catch (error) {
        console.log(error)
      }
      let error = document.querySelectorAll('.error_warp')
      if (error.length) return
      // alert('ok')
      // this.dataform.custom.time = this.$refs.pickDate
      let { contactName, contactPhone, type, designChartArr } = this.dataform
      let data = JSON.stringify(this.dataform.custom)

      if (this.dataform.type == 4 && !this.isUploadSuccess) {
        alert(this.isEn ? 'Image must be uploaded' : '必须上传图片')
        return
      }
      console.log('提交的数据', {
        contactName,
        contactPhone,
        custom: data,
        type,
        designChartArr
      })
      axios({
        method: 'POST',
        url: `/renren-fast/app/serviceapply/save`,
        data: {
          contactName,
          contactPhone,
          custom: data,
          type,
          designChartArr
        }
      }).then(res => {
        alert(this.isEn ? 'Submitted successfully' : '提交成功')
        sessionStorage.setItem('sus', '1111')
        location.href = `successful_repair.html`
      })
    },
    componentInit() {
      // 选择器的js
      //   获取所有选项元素
      let items = document.querySelectorAll('.select-item-wrap .select-item')
      //   获取所有兄弟元素的方法
      function siblings(elm) {
        let a = []
        let p = elm.parentNode.children
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
      items[0].onclick()
      // 选择器的校验
      let inputs = document.querySelectorAll('.required input')
      inputs.forEach(item => {
        // console.log(item)
        item.onblur = check2(item, [
          {
            rule: 'empty',
            errorMsg: this.errorMsg
          }
        ])
      })
    },

    to() {
      open('afterSalesPointInquiry.html', '_top')
    },
    // 5. 简单的格式时间函数
    formatDate(date) {
      let time = new Date(date)
      let y = time.getFullYear()
      let m = time.getMonth() + 1
      let d = time.getDate()
      return `${y}-${m}-${d}`
    }
  },
  mounted() {
    let inputs = document.querySelectorAll('input')
    inputs.forEach(item => {
      item.onblur = check2(item, [{ rule: `empty`, errorMsg: this.errorMsg }])
    })
    // console.log(inputs)
  },
  watch: {
    isEn(newVal) {
      if (newVal) {
        this.errorMsg = 'Cannot be empty'
        this.placeholder = 'Please fill'
        let inputs = document.querySelectorAll('input')
        let textareas = document.querySelectorAll('.required textarea')
        textareas.forEach(item => {
          item.onblur = check2(item, [
            {
              rule: `empty`,
              errorMsg: 'Cannot be empty'
            }
          ])
        })
        inputs.forEach(item => {
          item.onblur = check2(item, [{ rule: `empty`, errorMsg: this.errorMsg }])
        })
      } else {
        this.errorMsg = '不能为空'
        this.placeholder = '请填写'
        let inputs = document.querySelectorAll('input')
        let textareas = document.querySelectorAll('.required textarea')
        textareas.forEach(item => {
          item.onblur = check2(item, [
            {
              rule: `empty`,
              errorMsg: '不能为空'
            }
          ])
        })
        inputs.forEach(item => {
          item.onblur = check2(item, [{ rule: `empty`, errorMsg: this.errorMsg }])
        })
      }
      let item = this.applicationType.find(item => item.type == this.dataform.type)
      let select = document.querySelector('.left-wrap .select-wrap input:nth-child(1)')
      let error = document.querySelectorAll('.error_warp')
      error.forEach(item => {
        item.innerText = newVal ? (item.innerText != '' ? `Cannot be empty` : ``) : item.innerText != '' ? `不能为空` : ``
      })
      select.value = newVal ? item && item.applicationTypeEn : item && item.applicationType
    },
    'dataform.type'(newVal) {
      let error_warps = document.querySelectorAll('.error_warp')
      setTimeout(() => {
        let inputs = document.querySelectorAll('.required input')
        let textareas = document.querySelectorAll('.required textarea')
        inputs.forEach(item => {
          item.onblur = check2(item, [
            {
              rule: 'empty',
              errorMsg: this.errorMsg
            }
          ])
        })
        textareas.forEach(item => {
          item.onblur = check2(item, [
            {
              rule: 'empty',
              errorMsg: this.errorMsg
            }
          ])
        })
      })
      error_warps.forEach(item => {
        item.innerHTML = ''
      })
      this.requirementsData = this.applicationType.find(item => item.type == newVal)
    }
  }
})
