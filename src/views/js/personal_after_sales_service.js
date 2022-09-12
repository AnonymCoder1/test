
Vue.config.productionTip = false;
new Vue({
    el: '#app',
    created() {


        this.getBannerInfo();
        let link = document.querySelector('.link');
        if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
            link.href = './css/personal_repairOrder_750.css';
            document.documentElement.style.fontSize = '1.5625vw'
        }
        localStorage.setItem('nav-bar-id', 4);
        localStorage.setItem('navId', 999);
        JSON.parse(localStorage.getItem('isEn')) == null ? this.isEn = true : this.isEn = JSON.parse(localStorage.getItem('isEn'));
        window.onstorage = e => {
            if (e.key == 'isEn') {
                this.isEn = JSON.parse(e.newValue);
            }
            if (e.key == 'isActive') {
                this.isActive = JSON.parse(e.newValue);
            }
        };
        this.init();
        this.isCloseMsg = (sessionStorage.getItem('isCloseMsg') && sessionStorage.getItem('isCloseMsg').length) || false;
    },
    data() {
        return {
            bannerInfo: '',
            // 是否是英文状态
            isEn: true,
            // 是否显示取消的弹窗
            isShowCancel: false,
            // 售后服务申请的数据
            serviceApplicationData: [],
            // 当前取消的id
            currentCancelId: '',
            // 是否关闭横幅
            isCloseMsg: false
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
                            let messageBox = document.querySelectorAll('.message-wrap .animate_set .message')
                            messageBox.forEach(element => {
                                if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
                                    element.offsetWidth > 414 ? (element.style.animation = 'example 75s linear infinite') : (element.style.animation = 'example 40s linear infinite')
                                    return
                                }
                                element.offsetWidth > 1920 ? (element.style.animation = 'example 75s linear infinite') : (element.style.animation = 'example 40s linear infinite')
                            })
                        })
                    }
                })
        },
        // 关闭横幅消息
        close() {
            this.$refs.imgClose.style.display = 'none';
            sessionStorage.setItem('isCloseMsg', 'true');
        },
        async init() {
            // 校验是否登录
            let userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {};
            let userId = userInfo.userId || '';
            !userId && (location.href = 'login.html');
            let { data } = await axios(`/renren-fast/app/serviceapply/getUserApply`);
            let list = data.list || [];
            list.forEach(result => {
                // 处理类型
                switch (result.type) {
                    case 0:
                        result.typeEn = "Batch deployment of new machines is supported";
                        result.typeZh = "批量新机部署上门支持";
                        break;
                    case 1:
                        result.typeEn = "Machine batch abnormal door support";
                        result.typeZh = "机器批量异常上门支持";
                        break;
                    case 2:
                        result.typeEn = "On site maintenance";
                        result.typeZh = "驻场维修";
                        break;
                    case 3:
                        result.typeEn = "Maintenance training";
                        result.typeZh = "维修培训";
                        break;
                    case 4:
                        result.typeEn = "Network Planning and Design";
                        result.typeZh = "网络规划设计";
                        break;
                }
                // 处理状态
                switch (result.status) {
                    case -1:
                        result.statesEn = `Rejected`;
                        result.statesZh = `已拒绝`;
                        break;
                    case 0:
                        result.statesEn = `To be confirmed`;
                        result.statesZh = `待确认`;
                        break;
                    case 1:
                        result.statesEn = `Pending`;
                        result.statesZh = `待处理`;
                        break;
                    case 2:
                        result.statesEn = `Processing`;
                        result.statesZh = `处理中`;
                        break;
                    case 3:
                        result.statesEn = `Finished`;
                        result.statesZh = `已完成`;
                        break;
                }
            });
            this.serviceApplicationData = list
            console.log('售后服务申请的数据', this.serviceApplicationData);
        },
        // 点击修改或查看的回调
        handleCheck(item) {
            location.href = `personal_after_sales_service_detail.html?id=${item.id}`;
        },
        // 点击工单cancel的回调
        handleCancel(id) {
            this.currentCancelId = id;
            this.isShowCancel = true;
        },
        // 点击确认删除的回调
        async handleDelete() {
            console.log(this.currentCancelId);
            let res = await axios({
                url: `/renren-fast/app/personalCenterRepairWorkOrder/delete`,
                params: {
                    id: this.currentCancelId
                }
            });
            this.init();
            this.isShowCancel = false;
        },
        // 格式化时间的函数
        formatDate(date) {
            // 时分秒
            let hms = new Date(date).toLocaleTimeString();
            let time = new Date(date);
            let y = time.getFullYear();
            let m = time.getMonth() + 1;
            let d = time.getDate();
            return `${y}.${m}.${d} ${hms}`;
        }
    },
    filters: {
        timeFormat(value) {
            if (!value) return '-'
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
    }
});
