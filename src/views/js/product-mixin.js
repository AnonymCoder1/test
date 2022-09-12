productMixin = {
    data: {
        baseUrl: axios.defaults.baseURL + "/renren-fast",
        isLogin: false,
        isEn: false,
        needIconProps: [
            "name",
            "hashrate",
            "powerratio",
            "specificationPowerSpecifications",
            "specificationWorkingTemperature",
            "specificationSize",
            "netWeight",
            "specificationNetworkingConnection",
            "specificationPowerLine",
        ],
        orderClass: ["", "ups-btn-unpaid", "ups-btn-payment", "ups-btn-payment", "ups-btn-payment", ""]
    },
    beforeUpdate() {
        this.$i18n.locale = JSON.parse(localStorage.getItem('isEn')) ? 'En' : 'Cn',
            this.isLogin = JSON.parse(localStorage.getItem('userInfo'))

    },

    computed: {
        realExtraPros() {
            return this.extraProps.filter(t => !this.needIconProps.includes(t.title))
        },

    },
    watch: {
        curSpecificationId() {
            this.buyNum = 1;
        },
        isEn(v) {
            console.log("current lang " + v)
            this.$i18n.locale = JSON.parse(localStorage.getItem('isEn')) ? 'En' : 'Cn'
        }
    },
    methods: {
        getReleaseTitle(spec) {
            let release_date_title = "";
            switch (spec.goodsType) {
                //期货
                case 1:
                    release_date_title = "realaseTime";
                    break;
                //抢购
                case 2:
                    release_date_title = "flashbuy_date";
                    break;
                // 即将上架
                case 3:
                    release_date_title = "realaseTime";
                    break;
            }
            return this.$t(release_date_title)
        },
        getStatus(product, translate = true) {
            let statusText = "";
            if ((product.goodsType==2&&product.flashBuyStocks==0)||(product.goodsType!=2&&product.stocks == 0)) {
                statusText = "soldout"
            } else {
                switch (product.goodsType) {
                    case 0:
                        statusText = "spots"
                        break;
                    case 1:
                        statusText = "futures";
                        break;
                    case 2:
                        statusText = "rushbuy";
                        break;
                    case 3:
                        statusText = "somesoon"
                    default:
                        break;
                }
            }
            return translate ? this.$t(statusText) : statusText;
        },
        getProductStatusClass(curSpecification) {
            return {
                'flash-sale': this.getStatus(curSpecification, false) == "rushbuy",
                'spot-order': this.getStatus(curSpecification, false) == 'spots',
                'pre-order': this.getStatus(curSpecification, false) == 'futures',
                'coming-soon': this.getStatus(curSpecification, false) == 'comingSoon'
            }
        },
        promptLogin() {
            this.$confirm(this.$t("not_login_yes"), this.$t("pls_login")).then(() => {
                location = "login.html"
            })
        },
        orderNo(order) {
            if (order.createdAt && order.id) {
                return dayjs(order.createdAt).format("YYMMDDHHmmss") + "" + this.padNum(order.id, "0", 4)
            } else {
                return "";
            }
        },
        padNum(value, pad = "0", len = 2) {
            value = value + "";
            return pad.repeat(len - value.length) + value;
        },
        getProIcon(name) {
            let prop = this.extraProps.find(x => x.title == name)
            if (prop) {
                return prop.picture
            } else {
                return ""
            }
        },

        tt(obj, name) {
            return obj && obj[name + this.$i18n.locale]
        },
        fmtDate(day, fmt = "YYYY-MM-DD HH:mm:ss") {

            return dayjs(day).format(fmt)
        },
        countdown(day) {

            let seconds = parseInt((new Date(day).getTime() - new Date().getTime()) / 1000);
            if (seconds < 0) {
                return "";
            }
            let days = 3600 * 24;
            let hours = 3600;
            let minutes = 60;
            let part = [];
            if (seconds > days) {
                part.unshift(Math.floor(seconds / days))
                seconds %= days;
            } else {
                part.unshift(0)
            }
            if (seconds > hours) {
                part.unshift(Math.floor(seconds / hours))
                seconds %= hours;
            } else {
                part.unshift(0)
            }
            if (seconds > minutes) {
                part.unshift(Math.floor(seconds / minutes))
                seconds %= minutes;
            } else {
                part.unshift(0)
            }
            part.unshift(seconds)
            part.reverse();
            let str = "";
            if (part.length == 4 && part[0] > 0) {
                str += part[0] + "d,"
            }
            str += part.slice(1).map(t => this.padNum(t)).join(":")
            return str;
        },

    }
}