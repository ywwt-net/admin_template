import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/css/global.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'


import dayjs from 'dayjs';

function stdDate(row, column, cellValue) {
   let format = 'YYYY-MM-DD HH:mm:ss'
    return dayjs(cellValue).format(format);
}

function fmtText(row, column, cellValue) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = cellValue;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';
    return plainText.length > 50 ? plainText.slice(0, 50) + '...' : plainText;
  }

const app = createApp(App)

app.use(ElementPlus, { locale: zhCn })

app.use(router)
app.use(createPinia())
app.use(ElementPlus)

app.config.globalProperties.$stdDate = stdDate;
app.config.globalProperties.$fmtText = fmtText;


app.mount('#app')

