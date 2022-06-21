import Vue from 'vue'
import VueRouter from 'vue-router'
import goTo from 'vuetify/lib/services/goto'
import store from '../store'
import errorHandling from '../store/Services/errorHandling'

Vue.use(VueRouter)


const routes = [
  {
    path: "/",
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/login.vue'),
  },
  {
    path: "/basket",
    name: 'basket',
    component: () => import(/* webpackChunkName: "basket" */ '../views/basket.vue'),
  },
  {
    path: '/layout',
    name: 'layout',
    component: () => import(/* webpackChunkName: "layout" */ '../views/layout.vue'),
    children: [
      {
        path: '/orders',
        name: 'orders',
        component: () => import(/* webpackChunkName: "orders" */ '../views/orders.vue')
      },
      {
        path: '/positions',
        name: 'positions',
        component: () => import(/* webpackChunkName: "positions" */ '../views/positions.vue')
      },
      {
        path: '/holdings',
        component: () => import(/* webpackChunkName: "holdings" */ '../views/holdings.vue'),
      },
      {
        path: '/funds',
        component: () => import(/* webpackChunkName: "funds" */ '../views/funds.vue'),
      },
      {
        path: '/settings',
        component: () => import(/* webpackChunkName: "settings" */ '../views/settings.vue'),
      },
      {
        path: '/apps',
        component: () => import(/* webpackChunkName: "apps" */ '../views/apps.vue'),
      },
      {
        path: '/home',
        redirect: localStorage.getItem('basketOrder') ? localStorage.getItem('basketOrder') == 'true' ? '/basket' : null : null,
        component: () => import(/* webpackChunkName: "home" */ '../views/home.vue'),
      },
      {
        path: '/marketwatch',
        component: () => import(/* webpackChunkName: "marketwatch" */ '../views/marketWatch.vue'),
      },
      {
        path: '/chart',
        component: () => import(/* webpackChunkName: "chart" */ '../views/tradingviewChart.vue'),
      },
    ]
  },
  {
    path: '/authorizecdslmobile',
    component: () => import(/* webpackChunkName: "cdsl" */ '../components/authorizecdsl.vue'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach((to, from, next) => {
  next()
  var userSession = JSON.parse(window.localStorage.getItem('userSession'))
  var userId = JSON.parse(window.localStorage.getItem('currentUser'))
  var userSessionDto = JSON.parse(window.localStorage.getItem('userSessionDto'))
  var initialStep = JSON.parse(window.localStorage.getItem('whichStep'))
  var isvaild = !!userSession && userSession != "undefined" && !!userSessionDto && userSessionDto != "undefined" ? true : false;
  var isUser = !!userId && userId != "undefined" ? true : false;
  var checkWebSession = JSON.parse(localStorage.getItem('isValidSession'))
  var checkIsConnect = JSON.parse(localStorage.getItem('isConnect'))

  var isVaildStep = !!initialStep ? false : true

  checkWebSession ? store.commit('wsConnection/setIsValidSession', checkWebSession) : ''
  checkIsConnect ? store.commit('wsConnection/setIsConnect', checkIsConnect) : ''

  isUser ? store.commit("authtication/setUserId", userId) : '';
  isvaild ? store.commit("authtication/setUserDto", userSessionDto) : ''
  isvaild ? store.commit("authtication/setUserSessionId", userSession) : ''
  
  if ((to.path === '/' && to.query.appcode === undefined) || to.path !== '/') {
    store.commit('setSsoQuery', '')

    if(isUser && !isvaild){
      let userfetch = {
        userId: userId
      }
      !!userId ? store.dispatch('authtication/getUserId', userfetch) : ''
    }
    else if(to.path !== '/authorizecdslmobile'){
      if (isvaild && isUser && to.path === '/') {
        store.dispatch("marketWatch/getMwlistNames");
      } else if ((!isvaild && !isUser && to.path !== '/') || (!isvaild && isUser && to.path !== '/')) {
        router.push('/').catch(() => { });
        errorHandling.localClear()
      } else if (!isvaild && isUser && to.path === '/' && isVaildStep) {
        store.commit('authtication/setWhichStep', 'userId')
        let userfetch = {
          userId: userId
        }
        store.dispatch('authtication/getUserId', userfetch)
      } else if (to.path !== '/' && isvaild && isUser) {
        next()
      }
    } else {
      next()
    }

  }
  if (to.path === '/' && to.query.appcode) {
    store.commit('setSsoQuery', to.query)
    store.dispatch("authtication/validateVendor")
    // if (isUser && isvaild) {
    //   store.dispatch("marketWatch/getMwlistNames");
    // } else 
    // if (isVaildStep) {
      store.commit('authtication/setWhichStep', 'userId')
      let userfetch = {
        userId: userId
      }
      !!userId ? store.dispatch('authtication/getUserId', userfetch) : ''
    // }
  }
})

export default router
