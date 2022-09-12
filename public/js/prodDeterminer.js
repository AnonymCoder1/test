const productDeterminer = {
    data: {
        productType: ""
    },
    created() {
        axios.get("/renren-fast/app/getProductType").then(res => {
            if (res.status == 200 && res.data.code == 0) {
                this.productType = res.data.productType;
                localStorage.setItem("productType", this.productType)
            }
        });
    }
}