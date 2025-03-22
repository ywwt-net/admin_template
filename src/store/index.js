// src/store/index.js
import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => ({
    userInfo: {
      config:{
        config_image_size:"",
        config_video_size:""
      }
    }, // 用户信息
    menus: [],      // 菜单数据，初始化为空数组
  }),
  actions: {
    setUserInfo(info) {
      this.userInfo = info
    },
    setMenus(menus) {
      this.menus = menus || [] // 如果服务端返回 null 或 undefined，使用空数组
    },
    resetData() {
      this.userInfo = null
      this.menus = []
    },

    getImageSize() {
      const size = parseInt(this.userInfo.config.config_image_size); 
      return size * 1024 * 1024; 
  },
  
  getVideoSize() {
      const size = parseInt(this.userInfo.config.config_video_size);
      return size * 1024 * 1024; 

  }
  }}
)