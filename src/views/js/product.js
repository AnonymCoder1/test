"use strict";

Vue.config.productionTip = false;
var app = new Vue({
    el: '#app',
    i18n,
    mixins: [productMixin, Avail_product],
    created() {
        let showSample = localStorage.getItem("productType")
        if ((showSample == "sample" && location.href.includes("products.html")) || (showSample == "normal" && location.href.includes("product.html"))) {
            location.href = "404.html"
            return;
        }
        // let title = document.querySelector('title');
        // title.innerHTML = this.isEn ? 'WhatsMiner' : '比特微';
        this.getBannerInfo();
        let link = document.querySelector('.links');
        if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
            link.href = './css/product_750.css?v=2.020220805';
            document.documentElement.style.fontSize = '1.5625vw'
        }
        localStorage.setItem('navId', '1');
        // this.isEn = JSON.parse(localStorage.getItem('isEn'));
        JSON.parse(localStorage.getItem('isEn')) == null ? this.isEn = true : this.isEn = JSON.parse(localStorage.getItem('isEn'));
        window.onstorage = e => {
            if (e.key == 'isEn') {
                this.isEn = JSON.parse(e.newValue);
            }
        };
        this.isCloseMsg = (sessionStorage.getItem('isCloseMsg') && sessionStorage.getItem('isCloseMsg').length) || false;

        let prodType = localStorage.getItem("productType") || "sample"
        if (prodType == "sample") {
            this.getSamples().then(data => {
                this.samples = data.filter(t => t.isPublished == 1)
                this.classificationList = this.samples.map(t => t.type).filter((a, b, c) => c.indexOf(a) == b)
                    .map(t => {
                        let obj = { name: t }
                        let part = t.split("|")
                        obj.partCn = part[0]
                        obj.partEn = part[part.length - 1]
                        return obj;
                    });
                this.classificationList.forEach(t => {
                    this.grppedSamples.push({ type: t.name, samples: this.samples.filter(x => x.type == t.name) })
                })
            })
        } else {
            this.getProducts();
        }

        // 获取手机号前缀数据
        this.getInternationalDistrictNum()
        this.getCountries();
        this.getBannerData()
        Object.keys(this.inquery).forEach(t => {
            this.inqueryRule[t] = [{ required: true, message: this.$t("required", { code: this.$t(t) }), trigger: ["change", "blur"] }]
        })
        this.getModules();
    },
    data() {
        return {
            bannerData: [],
            samples: [],
            grppedSamples: [],
            // 是否显示产品咨询弹框
            isShowProductConsultation: false,
            bannerInfo: {},
            // 是否是英文状态
            isEn: true,
            // 是否关闭横幅
            isCloseMsg: false,
            productInfo: [],
            flashBuyProducts: [],
            otherProducts: [],
            ins: -1,
            inquery: {
                name: "",
                company: "",
                email: "",
                contactPrefix: "",
                contact: "",
                model: "",
                quantity: "",
                destination: "",
                deliveryDate: "",
                remark: ""
            },
            inqueryRule: {},
            // 手机号码前缀的数据
            internationalDistrictNum: [],
            countries: [],
            ModelData: [],
            baseUrl: axios.defaults.baseURL + "/renren-fast/",
            classificationList: []
        };
    },
    computed: {
        visibleProds() {
            if (this.ins == -1) {
                return this.samples
            } else {
                return this.grppedSamples.find(x => x.type == this.classificationList[this.ins].name).samples
            }
        }
    },
    methods: {
        getBannerData() {
            axios('/renren-fast/app/banner/list?locationType=2').then(({ data }) => {
                console.log('banner的数据', data);
                this.bannerData = data.data
            })
        },
        showAll() {
            this.ins = -1;
        },
        submitInquery() {
            this.$refs.form.validate((result) => {
                if (result) {
                    axios.post("/renren-fast/app/userorder/saveOrderInquery", this.inquery).then(res => {
                        if (res.status == 200 && res.data.code == 0) {
                            this.$message.success(this.$t("save_success"))
                            this.isShowProductConsultation = false;
                        } else {
                            this.$message.error(res.data.msg)
                        }
                    })
                }
            })

        },
        classificationChange(item, index) {
            this.ins = index;
        },
        // 获取产品图片地址
        getPictureFullpath(img) {
            if (!img) {
                return "";
            } else {
                if (img.startsWith("http")) {
                    return img;
                } else {
                    return this.baseUrl + img;
                }
            }
        },
        getRelaseDate(spec) {
            return spec.goodsType > 0 ? spec.launchAt : ""
        },

        fmt(day) {
            return dayjs(day).format("YYYY-MM-DD HH:mm:ss")
        },
        gotoDetail(product) {
            sessionStorage.setItem("product_id", JSON.stringify({ id: product.id }))
            location = "product_detail.html?id=" + product.id + "&name=" + product.nameEn
        },
        gotoDetails(product) {
            sessionStorage.setItem("product_id", JSON.stringify({ id: product.id }))
            location = "product_details.html?id=" + product.id + "&name=" + product.nameEn
        },
        getProducts() {
            axios.get("/renren-fast/app/getProducts").then(data => {
                let products = data.data.page.list;
                products.forEach(t => {
                    // 已下架型号去掉
                    t.specifications = t.specifications.filter(x => x.status != 0);
                    //非抢购商品或正在抢购的商品
                    t.specifications = t.specifications.filter(x => x.goodsType != 2 || (x.goodsType == 2 && x.launchAt < Date.now() && x.launchAtEnd > Date.now()))
                })
                products = products.filter(t => t.specifications.length > 0)

                this.productInfo = products
                this.flashBuyProducts = products.filter(x => x.specifications[0].goodsType == 2)
                this.otherProducts = products.filter(x => x.specifications[0].goodsType != 2)
                this.countdownFlashBuy()
            })
        },
        countdownFlashBuy() {
            this.productInfo.forEach(t => {
                if (t.specifications[0].goodsType == 2) {
                    this.$set(t.specifications[0], "countdown", this.countdown(t.specifications[0].launchAtEnd))
                }
            })
            setTimeout(this.countdownFlashBuy, 1000)
        },
        // 横幅消息
        getBannerInfo() {
            axios(`/renren-fast/app/notification/streamer`).then(({ data }) => {
                if (data.code == 0 && data.data) {
                    //   console.log('横幅消息', data.data);
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
            });
        },
        // 关闭横幅消息
        close() {
            this.$refs.imgClose.style.display = 'none';
            sessionStorage.setItem('isCloseMsg', 'true');
        },
        shoppingCart() {
            location.href = './shoppingCart.html';
        },
        getModules() {
            axios.get("/renren-fast/app/goodsmodel").then(res => {
                let ret = res.data;
                if (ret.code == 0) {
                    this.ModelData = ret.page.list;
                } else {
                    this.ModelData = []
                }
            })
        },
        // 获取手机号前缀数据
        getInternationalDistrictNum() {
            // 获取手机号前缀数据
            axios({ url: `/renren-fast/app/personalCenterRepairWorkOrder/queryphonecode` })
                .then(({ data }) => {
                    this.internationalDistrictNum = data.newCountriesEntityList

                })
        },
        getCountries() {
            axios.get("/renren-fast/app/repairmaininsert/querycountries").then(res => {
                if (res.status == 200 && res.data.code == 0) {
                    this.countries = res.data.countriesEntityList
                }
            })
        },
    }
});
