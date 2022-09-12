Avail_product = {
    data: {
        baseUrl: axios.defaults.baseURL + "/renren-fast/",

        productType: ""
    },
    methods: {
        getProductType() {
            return axios.get("/renren-fast/app/getProductType").then(res => {
                if (res.status == 200 && res.data.code == 0) {
                    this.productType = res.data.productType;
                    localStorage.setItem("productType", this.productType)
                }
            });
        },
        getProducts() {
            return axios.get("/renren-fast/app/getProducts").then(data => {
                let products = data.data.page.list;
                products.forEach(t => {
                    // 已下架型号去掉
                    t.specifications = t.specifications.filter(x => x.status != 0);
                    //非抢购商品或正在抢购的商品
                    t.specifications = t.specifications.filter(x => x.goodsType != 2 || (x.goodsType == 2 && x.launchAt < Date.now() && x.launchAtEnd > Date.now()))
                })
                return products.filter(t => t.specifications.length > 0)
            })
        },
        getSamples() {
            return axios.get("/renren-fast/app/getSamples").then(data => {
                return data.data.samples;
            })
        },
        getSample(id) {
            return axios.get("/renren-fast/app/getSampleById/" + id).then(data => {
                let sample= data.data.sample;
                sample.specs=JSON.parse(sample.specs||'[]')
                sample.specs.forEach(t=>{
                    (t.values||[]).forEach(k=>{
                        k.value=k.value.replace(/\n/g,"<br/>")
                    })
                })
                return sample;
            })
        },
        getParam(paramName){
            let checkResult=new RegExp(`${paramName}=([^?#&=]+)`).exec(location.search)
            if(!checkResult||checkResult.length==0){
                return null;
            }else{
                return checkResult[1]
            }
        }
    }
}