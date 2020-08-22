import {getMultiData , getGoodsData} from '../../service/home'
const TOP_DISTANCE = 1000
const types = ['pop', 'new', 'sell']
Page({
  data: {
    banners: [],
    recommends: [],
    titles: ['流行', '新款', '精选'],
    goods: {
      'pop': {page: 0, list: []},
      'new': {page: 0, list: []},
      'sell': {page: 0, list: []}
    },
    currentType: 'pop',
    showBackTop: false,
    isTabFixed: false,
    tabScrollTop: 0
  },
  onLoad: function (options) {
    //请求轮播图以及推荐数据
    this._getMultiData()
    this._getGoodsData('pop')
    this._getGoodsData('new')
    this._getGoodsData('sell')
  },
  onShow() {

  },
  // ---------------------网络请求函数------------------------
  _getMultiData() {
        //请求轮播图以及推荐数据
        getMultiData().then(res => {
          // 取出轮播图和推荐数据
          const banners = res.data.data.banner.list
          const recommends = res.data.data.recommend.list
          // 将轮播图和推荐数据放入data中
          
          this.setData({
            banners,
            recommends
          })
            })
  },
  _getGoodsData(type) {
         //获取页码
         const page = this.data.goods[type].page + 1;
         //发送网络请求
         getGoodsData(type, page).then(res => {
           //取出数据
           const list = res.data.data.list;
           //将数据设置到对应type的list中
           const oldList = this.data.goods[type].list
           oldList.push(...list)
           // 将数据设置到data中的goods中
           const typeKey = `goods.${type}.list`
           const pageKey = `goods.${type}.page`
           this.setData({
                [typeKey]: oldList,
                [pageKey]: page
           })
         })
  },

  // -----------------事件监听函数
  handleTabClick (event){
    //取出index
      const index = event.detail.index
    
      //设置currentType
      this.setData({
        currentType: types[index]
      })
  },
  handleImageLoad() {
    wx.createSelectorQuery().select('#tab-control').boundingClientRect(rect => {
      console.log(rect)
      this.data.tabScrollTop = rect.top
    }).exec()
  }, 
  onReachBottom() {
    //  console.log('页面滚动到底部')
    this._getGoodsData(this.data.currentType)
  },
  onPageScroll(options) {
    // console.log(options)
    const scrollTop = options.scrollTop
        //修改showBackTop属性
      const flag1 = scrollTop >= TOP_DISTANCE
      if(this.data.showBackTop != flag1) {
        console.log(scrollTop)
        this.setData({
          showBackTop: flag1
        })
      }
      // 修改isTbafixed属性
      const flag2 = scrollTop >= this.data.tabScrollTop
      if(flag2 != this.data.isTabFixed) {
          this.setData({
            isTabFixed: flag2
          })
      }
  }
})