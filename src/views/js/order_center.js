Vue.config.productionTip = false
    // 请求拦截
axios.interceptors.request.use(
    data => {
        let token = localStorage.getItem('token')
            // console.log(token); // 该处可以将config打印出来看一下，该部分将发送给后端（server端）
        data.headers.token = token
        return data // 对config处理完后返回，下一步将向后端发送请求
    },
    error => {
        // 当发生错误时，执行该部分代码
        console.log(error) //调试用
        return Promise.reject(error)
    }
)
let app = new Vue({
    el: '#app',
    i18n,
    mixins: [productMixin],
    data() {
        return {
            orders: [],
            productInfo: [],
            combinedOrders: [],
            orderType: "100",
            activeName: "100",
            baseUrl: axios.defaults.baseURL + "/renren-fast",
        }
    },
    computed: {
        curTypeOrders() {
            let typedOrders = []
            if (this.orderType == 100) {
                typedOrders = this.combinedOrders;
            } else {
                typedOrders = this.combinedOrders.filter(x => x.paymentState == this.orderType)
            }
            typedOrders.sort((a, b) => b.createdAt - a.createdAt)
            console.log("curtype orders", this.orderType, typedOrders.map(t => t.paymentState))
            return typedOrders
        }
    },
    created() {
        localStorage.setItem('nav-bar-id', 2);
        JSON.parse(localStorage.getItem('isEn')) == null ? (this.isEn = true) : (this.isEn = JSON.parse(localStorage.getItem('isEn')))
        let link = document.querySelector('.links');
        if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
            link.href = './css/order_center_750.css';
            document.documentElement.style.fontSize = '1.5625vw'
        }
    },
    methods: {
        toPay(order) {
            location.href = "./order-payment.html#" + order.id
        },
        modifyOrder(order) {
            location.href = "./order.html#" + order.id
        },
        updateUnpaidOrder() {
            this.combinedOrders.filter(x => x.paymentState == 0).forEach(t => {
                this.$set(t, "countdown", this.countdown(t.createdAt + 24 * 3600 * 1000))
            })
            setTimeout(this.updateUnpaidOrder, 1000);
        },
        tt(obj, name) {
            return obj && obj[name + this.$i18n.locale]
        },
        fmtDate(date) {
            return dayjs(date).format("YYYY-MM-DD HH:mm:ss")
        },

        powerOnWall(curSpecification, curProduct) {
            return curSpecification && curSpecification.powerratio ? ((parseInt(/(\d+)/.exec(curSpecification.powerratio)[1]) * parseInt(curSpecification.hashrate)) + "W+10%@" + curProduct.specificationWorkingTemperature + "℃") : ""
        },
        reservationChange() {

        },
        unpaidChange() {

        },
        payItNowChange() {

        },
        checkMoreChange(order) {
            localStorage.setItem("orderCenter", JSON.stringify(order))
            location = "order-detail.html"
        },
        modifyDetailsChange() {

        },
        getAllProducts() {
            return axios.get("/renren-fast/app/getProducts").then(data => {
                this.productInfo = data.data.page.list
            })
        },
        getAllOrders() {
            return axios.get("/renren-fast/app/userorder/list").then(res => {
                this.orders = res.data.orders
            })
        },
        buildPageData() {
            Promise.all([this.getAllProducts(), this.getAllOrders()]).then(result => {
                this.combinedOrders = this.orders.map(t => {
                    let newOrder = {...t }
                    newOrder.goodsDetailList = newOrder.goodsList.map(t => {
                        let { goodsId, specId, cnt ,price} = t;
                        let product = this.productInfo.find(x => x.id == goodsId)
                        let spec = product.specifications.find(x => x.id == specId)
                        return { product, spec, cnt ,price}
                    })
                    console.log(newOrder.id, newOrder.paymentState)
                    return newOrder
                })
                console.log(this.combinedOrders.map(t => t.paymentState))
                this.updateUnpaidOrder();
            })
        }
    },
    mounted() {
        this.buildPageData();
    }
})
window.onload = function() {
    localStorage.setItem('navId', 0)
    localStorage.setItem('nav-bar-id', 1)
    if (!localStorage.token) {
        location.href = 'login.html'
    }
}