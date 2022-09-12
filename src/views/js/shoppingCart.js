Vue.config.productionTip = false;
let cartList = new Vue({
    el: '#app',
    i18n,
    mixins: [LoginCheckMixin],
    created() {
        // document.querySelector('title').innerHTML = this.$t("title")
        let link = document.querySelector('.links');
        if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
            link.href = './css/shoppingCart_750.css?v=1.2';
            document.documentElement.style.fontSize = '1.5625vw'
        }
        this.isCloseMsg = (sessionStorage.getItem('isCloseMsg') && sessionStorage.getItem('isCloseMsg').length) || false;
        this.init();
    },
    beforeUpdate() {
        this.$i18n.locale = JSON.parse(localStorage.getItem('isEn')) ? 'En' : 'Cn',
            this.isLogin = JSON.parse(localStorage.getItem('userInfo'))

    },
    data() {
        return {
            needLogin: true,
            bannerInfo: '',
            isEn: true,
            // 购买数量
            count: 1,
            // 是否关闭横幅
            isCloseMsg: false,
            carts: [],
            products: [],
            cartDetails: [],
            addressVisible: false,
            baseUrl: axios.defaults.baseURL + "/renren-fast/",
            addressList: [],
            selectedAddressId: '',
            modeTransport: "2",
            upsTotalCost: null,
            merchantInfo: {},
            termVisible: false,
            agreeTerm: false,
            contractVisible: false,
            contract: {
                buyer: "",
                contact: "",
                phone: "",
                email: ""
            },
            isChangeNum:false,
            contractRules:{
                buyer: [
                         { required: true, message: "buyer is required", trigger: ['blur','change'] },
                        ],
                contact: [
                         { required: true, message: "contact is required", trigger: ['blur','change'] },
                        ],
                phone: [
                         { required: true, message: "phone is required", trigger: ['blur','change'] },
                         {pattern:/^\+?[1-9][0-9]+$/ ,message: "phone format is incorrect", trigger: ['blur','change']}
                        ],
                email: [
                         { required: true, message: "email is required", trigger: ['blur','change'] },
                         {type:"email", message: "email format is incorrect", trigger: ['blur','change']}
                        ],
            },
        };
    },
    methods: {
        gotoOrderPage(){
            let data=this.selectedCart.map(t=>{
                let d= {
                    product:t.product,
                    cnt:t.cnt,
                    specid:t.spec.id
                } 
                return d;
            })
            localStorage.setItem("curProduct",JSON.stringify(data));
            location.href="order.html"
        },
        updateCart(o){
            if(this.isChangeNum){
                return
            }
            this.isChangeNum=true;
            axios.post("/renren-fast/app/userorder/updateCart",{id:o.id,cnt:o.cnt,"delete":false}).then(res => {
                if (res.data.code != 0) {
                    this.$alert(res.data.msg)
                } else {
//                    this.init();
                }
            }).finally(()=>{
                this.isChangeNum=false
            })
        },
        deleteCart(o){
            this.$confirm("Remove From Cart?").then(()=>{
                axios.post("/renren-fast/app/userorder/updateCart",{id:o.id,cnt:o.cnt,"delete":true}).then(res => {
                                if (res.data.code != 0) {
                                    this.$alert(res.data.msg)
                                } else {
                                   this.init();
                                }
                            });

            }).catch(()=>{})

        },
        confirmAddress() {
            this.addressVisible = false;
            this.termVisible = true;
        },
        termAgreed() {
            this.termVisible = false;
            this.contractVisible = true;
        },
        // 获取商户信息
        getMerchantInfo() {
            axios.get("/renren-fast/app/userorder/getMerchantInfo").then(res => {
                if (res.data.code != 0) {
                    this.$alert(res.data.msg)
                } else {
                    this.merchantInfo = res.data.mercharts.length > 0 ? res.data.mercharts[0] : {}
                }
            });
        },
        getAddresses() {
            axios.post("/renren-fast/app/useraddress/list").then(res => {
                if (res.data.code == 0) {
                    this.addressList = res.data.addresses.filter(x => x.isDelete == 0)
                }
            });
        },
        init() {
            this.getBannerInfo();
            Promise.all([this.getCartList(), this.getAllProduct()]).then(() => {
                this.cartDetails = this.carts.map(t => {
                    let product = this.products.find(x => x.id == t.goodsId)
                    let spec = product.specifications.find(x => x.id == t.specId)
                    if(!spec||spec.status==0){
                        return null;
                    }
                    return { spec, product, cnt: t.cnt, checked: false,...t }
                }).filter(Boolean)
                if (this.carts.length > 0) {
                    this.getAddresses();
                    this.getMerchantInfo();
                }
            });

        },
        getCartList() {
            return axios.get("/renren-fast/app/userorder/listCart").then(res => {
                if (res.status == 200 && res.data.code == 0) {
                    this.carts = res.data.carts
                }
            })
        },
        getAllProduct() {
            return axios.get("/renren-fast/app/getProducts").then(res => {
                if (res.status == 200 && res.data.code == 0) {
                    this.products = res.data.page.list
                }
            })
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
        // 点击加减号的回调
        changeCount(state) {
            if (state == 'add') {
                this.count++;
            } else {
                this.count--;
            }
        },
        To(href) {
            location.href = href;
        },
        submitOrder() {
            this.$refs.contractForm.validate(result=>{
                if(result){
                    this.contractVisible = false;
                    this.createOrder().then((order) => {
                        localStorage.setItem("orderdetail", JSON.stringify(order))
                        location.href = "./order-submit-success.html"
                    })
                }
            })

        },
        createOrder() {
            let order = {
                fullPrice: this.totalFee,
                discount: this.vipDiscount,
                note: this.remark,
                finalPrice: this.finalFee,
                currency: 1,
                addressId: this.selectedAddressId,
                paymentState: 0,
                deliveryState: 0,
                invoiceState: 0,
                shipmentFee: this.freightCost,
                couponDiscount: 0,
                deliveryType: this.modeTransport,
                orderGoodsType:0,//购物车购物一定非抢购
                orderContractEntity: this.contract,
                goodsList: this.selectedCart.map(t => ({ goodsId: t.product.id, specId: t.spec.id, cnt: t.cnt })),
                fromCart: 1
            }
            debugger;
            return new Promise((resolve, reject) => {
                axios.post("/renren-fast/app/userorder/save", order).then(res => {
                    if (res.status == 200 && res.data.code == 0) {
                        resolve(res.data.order)
                    } else {
                        this.$alert("提交失败");
                        reject()
                    }
                })
            });
        }
    },
    computed: {
        contractOK() {
            return this.contract.buyer && this.contract.contact && this.contract.phone && this.contract.email
        },
        selectedCart() {
            return this.cartDetails.filter(x => x.checked)
        },
        totalFee() {
            return this.selectedCart.map(t => t.spec.priceEn * t.cnt).reduce((a, b) => a + b, 0)
        },
        vipDiscount() {
            return parseFloat(((1 - (this.memberShip.discount || 1)) * this.totalFee).toFixed(2))
        },
        finalFee() {
            return this.totalFee - this.vipDiscount + this.freightCost;
        },
        freightCost() {
            return this.modeTransport == 1 ? (this.upsTotalCost && parseFloat(this.upsTotalCost.MonetaryValue)) : (this.merchantInfo.fixDeliveryFee*this.cartDetails.filter(t=>t.checked).map(x=>x.cnt).reduce((a,b)=>a+b,0))
        },
    },
    watch: {
        modeTransport(v) {
            if (v == "1") {
                let data = {
                    from: { country: "US", zipCode: "30067" },
                    to: { country: "US", zipCode: "95113" },
                    size: "20x30x40",
                    totalWeight: "20",
                    sizeUnit: "cm",
                    weightUnit: "kgs"
                }
                axios.post("/renren-fast/app/userorder/ups", data).then(res => {
                    if (res.data.code == 0) {
                        let result = JSON.parse(res.data.result.body)
                        this.upsTotalCost = result.RateResponse.RatedShipment.TotalCharges;
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            }
        }
    }
});