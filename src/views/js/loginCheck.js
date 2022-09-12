LoginCheckMixin = {
    data: {
        isLogin: JSON.parse(localStorage.getItem('userInfo')) != null,
        needLogin: false,
        memberShips: [],
        userInfo:{}
    },
    created() {
        
        if (this.needLogin) {
            let curUrl = location.href;
            if (!this.isLogin) {
                localStorage.setItem("prevUrl", curUrl)
                location = "login.html"
            }else{
                this.getMemberShips();
                this.getUserInfo();
            }
        }
    },
    methods: {
        getMemberShips() {
            axios.get("/renren-fast/app/userorder/membershipLevel").then(res => {
                if (res.status == 200 && res.data.code == 0) {
                    this.memberShips = res.data.list;
                }
            })
        },
        getUserInfo(){
            
            axios.get("/renren-fast/app/user/userinfo").then(res => {
                if (res.status == 200 && res.data.code == 0) {
                    this.userInfo = res.data.data;
                }
            })
        }
    },
    computed:{
        memberShip(){
            if(this.needLogin&&this.isLogin){
                return this.memberShips.find(x=>x.pointBegin<=this.userInfo.point&&x.pointEnd>=this.userInfo.point)||{}
            }else{
                return {};
            }
        }
    }
}