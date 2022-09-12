Vue.use(VueI18n) 
var i18n=new VueI18n({
  locale:JSON.parse(localStorage.getItem('isEn'))?'En':'Cn',
  messages:{
    En:{
      name:"Name",
      company:"Company Name",
      email:"Email",
      contactPrefix:"",
      contact:"Contact",
      model:"Product Model", 
      destination:"Final Destination",
      deliveryDate:"Scheduled Delivery Date",
      remark:"Remark",
      required:"{code} is required",
      cancel:"Cancel",
      
      delivery_date:"Delivery Date",
      flashbuy_date:"Flash Buy Date",
      onshelf_date:"Coming Date",

      futures:"Pre Order",
      rushbuy:"Flash Sale",
      soldout:"Sold Out",
      spots:"Spot Order",
      somesoon:"Coming Soon",

      title:"WhatsMiner",
      product:"Product",
      prodcutDetail:"Product Detail",
      productConsulation:"Product consultation",
      viewVideo:"View video",
      hashRate:"HashRate",
      powerratio:"Power Ratio",
      quantity:"Quantity",
      pleaseSelect:"Please Select",
      price:"Price",
      addToCart:"Add To Cart",
      buyNow:"Buy Now",
      parameter:"Technical",
      payment:"Procedure",
      postSale:"Service",
      parameterPC:"Specification",
      paymentPC:"Payment Method",
      postSalePC:"After-sales Policy",
      productName:"Product Name",
      powerSpecification:"Power Specification",
      workTemp:"Working Temperature",
      size:"Size",
      weight:"Weight",
      net:"Networking Connection",
      powerLine:"Power Line",
      more:"Learn More",
      tags:"Tags",
      productMainTitle:"High Computing Power And Low Power Consumption",
      productSubTitle:"We are the pioneer of the full-ctomized methodology in the indtry and design the advanced chip based on 8nm technology. Stronger compute power, lower power consumption and incomparable stability.",
      allProduct:"All Products",
      productCnt:"{cnt} Models In Total",
      powerwaste:"Power Waste",
      moneyUnit:"$",
      spotOrder:"Spot Order",
      preSale:"Pre Order",
      releaseTime:"Releasing time",    
      flashBuyStart:"Rush Buy At",  
      soldOut:"Sold Out",
      flashSale:"Flash Sale",
      countDown:"Count Down", 
      deliverTime:"Delivery time",
      flashBuyEnded:"Flash Sale Overdue",
      powerOnWall:"Power On Wall",
      not_login_yes:"You are not logged in ,please login first",
      pls_login:"Login Prompt",
      add_cart_info:"{cnt} items have been successfully added to the shopping cart!",
      submit:"Submit",
      realaseTime:"Releasing time",
      countdowntitle:"Countdown to the end",
      PleaseFll:"Please fill",
      "el.select.placeholder":"go to hell",
      remarkDesc:"We will reply to you as soon as we can and keep your information in private",
      compuPower:"Hashrate",     
      powerConsum:"Power Ratio",
      powerEff:"Power On Wall",
      StrongApplicability:"Strong Applicability",
      LowFailureRate:"Low Failure Rate",
      HighPerformance:"High Performance",
      GoodReputation:"Good Reputation",
      LongLifeSpan:"Long Life Span",
      Trustworthy:"Trustworthy",
      Introduce:"Introduce",
      Parameter:"Parameter",
      Download:"Download",

      All:'All',
      OrderCenter:'Order Center',
      AllOrders:'All Orders',
      Unpaid:'Unpaid',
      Paid:'Paid',
      Completed:'Completed',
      Cancelled:'Cancelled',
      CheckMoreDetails:'Check More Details',
      ModifyDetails:'Modify Details',
      PayItNow:'Pay It Now',
      CancelOrdercountdown:'Cancel order countdown',
      Shipped:'Shipped',
      PaymentToBeXonfirmed:'Payment to be confirmed',
      Unshipped:'Unshipped',
      Refunded:'Refunded',

    },
    Cn:{
      compuPower:"算力",
      powerConsum:"功耗比",
      powerEff:"功耗",
      name:"姓名",
      company:"公司名称",
      email:"邮箱",
      contactPrefix:"",
      contact:"联系电话",
      model:"产品型号", 
      destination:"最终目的地国家",
      deliveryDate:"预期交货时间",
      remark:"详情",
      required:"{code}必填",
      cancel:"取消",
      
      delivery_date:"交付日期",
      flashbuy_date:"抢购日期",
      onshelf_date:"上架日期",

      futures:"期货",
      rushbuy:"抢购",
      soldout:"售罄",
      spots:"现货",
      somesoon:"即将上架",

      title:"比特微",
      product:"产品",
      prodcutDetail:"产品详情",
      productConsulation:"产品咨询",
      viewVideo:"观看视频",
      hashRate:"算力",
      powerratio:"功耗比",
      quantity:"数量",
      pleaseSelect:"请选择",
      
      price:"价格",
      addToCart:"添加到购物车",
      buyNow:"现在购买",
      parameter:"技术参数",
      payment:"付款程序",
      postSale:"售后服务政策",
      parameterPC:"技术参数",
      paymentPC:"付款程序",
      postSalePC:"售后服务政策",
      productName:"产品名称",
      powerSpecification:"电源规格",
      workTemp:"工作温度",
      size:"尺寸",
      weight:"重量",
      net:"网络连接",
      powerLine:"电源线",
      more:"了解更多",
      tags:"标签",
      productMainTitle:"高计算能力和低功耗",
      productSubTitle:"我们是业界全定制方法的先驱，基于 8nm技术。更强的计算能力、更低的功耗和无与伦比的稳定性。",
      allProduct:"所有产品",
      productCnt:"共{cnt}款",
      powerwaste:"功耗",
      moneyUnit:"￥",

      spotOrder:"现货",
      preSale:"预购",
      releaseTime:"发布日期",
      flashBuyStart:"钱够开始时间",  
      deliverTime:"发货日期",
      soldOut:"售罄",
      flashSale:"抢购",
      countDown:"倒计时", 
      flashBuyEnded:"抢购已结束",
      powerOnWall:"功耗",
      not_login_yes:"您尚未登录，是否立即登录",
      pls_login:"登录提示",
      add_cart_info:"{cnt}件物品已成功添加到购物车！",
      submit:"提交",
      realaseTime:"上架时间",
      countdowntitle:"抢购结束倒计时",
      PleaseFll:"请输入",
      remarkDesc:"我们将尽快回复您，并对您的信息保密", 
      StrongApplicability:"适用好",
      LowFailureRate:"故障低",
      HighPerformance:"性能强",
      GoodReputation:"口碑好",
      LongLifeSpan:"寿命长",
      Trustworthy:"值得信赖",
      Introduce:"介绍",
      Parameter:"参数",
      Download:"下载",

      All:'全部',
      OrderCenter:'订单中心',
      AllOrders:'所有订单',
      Unpaid:'未付款',
      Paid:'已付款',
      Completed:'已完成',
      Cancelled:'已取消',
      CheckMoreDetails:'查看更多',
      ModifyDetails:'修改订单',
      PayItNow:'现在付款',
      CancelOrdercountdown:'取消倒计时',
      Shipped:'已发货',
      HomePage:'首页',
      PaymentToBeXonfirmed:'付款待确认',
      Unshipped:'未发货',
      Refunded:'退款',
    }
  }
})