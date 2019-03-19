import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from '../views/layout/Layout'

const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/** note: submenu only apppear when children.length>=1
 *   detail see  https://panjiachen.github.io/vue-element-admin-site/#/router-and-nav?id=sidebar
 **/

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if fasle ,the page will no be cached(default is false)
  }
 **/
export const constantRouterMap = [{
  path: '/login',
  component: _import('login/index'),
  hidden: true
},
{
  path: '/register',
  component: _import('register/index'),
  hidden: false
},
{
  path: '/authredirect',
  component: _import('login/authredirect'),
  hidden: true
},
{
  path: '/404',
  component: _import('errorPage/404'),
  hidden: true
},
{
  path: '/401',
  component: _import('errorPage/401'),
  hidden: true
},
/* {
  path: '/collection/detail',
  name: 'dataCollectionDetail',
  component: _import('dataExchange/detail'),
  hidden: false
}, */
{
  path: '',
  component: Layout,
  redirect: '/home',
  children: [{
    path: 'home',
    component: _import('dashboard/index'),
    name: 'dashboard',
    meta: {
      title: 'dashboard',
      icon: 'dashboard',
      noCache: true
    }
  },
  {
    path: '/collection/detail',
    name: 'dataCollectionDetail',
    component: _import('dataExchange/detail'),
    meta: {
      title: '数据采集详情'
    }
  },
  {
    path: '/flowManage/visualization',
    component: _import('dataLake/vQuery'),
    name: '可视化查询',
    hidden: true
  },
  {
    path: '/dataSource/detailPage',
    component: _import('dataSource/detailPage'),
    name: '元数据详情',
    hidden: true
  },
  {
    path: '/flowManage/feedDetails',
    component: _import('dataLake/FeedDetails'),
    name: '流程详情',
    hidden: true
  },
  {
    path: '/definedFeed',
    component: _import('dataLake/DefinedFeed'),
    name: '定义流程',
    hidden: true
  },
  {
    path: '/flowManage/editFeed',
    component: _import('dataLake/EditFeed'),
    name: '编辑流程',
    hidden: true
  },
  {
    path: '/templateManage/taskVersion',
    component: _import('dataLake/TaskVersion'),
    name: '治理流程',
    hidden: true
  },
  {
    path: '/dataQuality',
    component: _import('dataLake/dataQuality/index'),
    name: '数据质量',
    hidden: true
  }
  ]
}
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  // 主页
  {
    path: '/home',
    component: Layout,
    name: '主页',
    authority: 'home',
    icon: 'setting',
    meta: {
      title: '主页'
    },
    children: [{
      path: 'home',
      component: _import('dashboard/index'),
      name: '首页',
      authority: 'home',
      meta: {
        title: '首页'
      }
    }]
  },
  {
    path: '/dataexchange',
    name: '数据交换',
    component: Layout,
    icon: 'exchange',
    authority: 'dataexchange',
    children: [
      {
        path: 'collection',
        component: _import('dataExchange/index'),
        authority: 'collection',
        icon: 'hourglass-2',
        meta: {
          title: '数据集采集平台'
        }
      }
    ]
  },
  // 治理工具
  {
    path: '/templateManage',
    component: Layout,
    name: '治理工具',
    icon: 'setting',
    authority: 'templateManage',
    meta: {
      title: '治理工具'
    },
    children: [
      // 源端数据
      {
        path: 'dataSource',
        component: _import('dataLake/dataSource/index'),
        name: '源端数据',
        icon: 'setting',
        authority: 'dataSource',
        meta: {
          title: '源端数据'
        }
      },
      // 治理对象
      {
        path: 'object',
        component: _import('baseDataManager/object'),
        name: '资源目录',
        icon: 'setting',
        authority: 'object',
        meta: {
          title: '资源目录'
        }
      },
      // 标准治理
      {
        path: 'standard',
        component: _import('baseDataManager/standard'),
        name: '标准治理',
        icon: 'setting',
        authority: 'standard',
        meta: {
          title: '标准治理'
        }
      },
      // 标准模型
      {
        path: 'object',
        component: _import('baseDataManager/object'),
        name: '治理对象',
        icon: 'setting',
        authority: 'object',
        meta: {
          title: '治理对象'
        }
      },
      { // 分类管理
        path: 'categoryManage',
        component: _import('baseDataManager/categoryManage/index'),
        name: '任务管理',
        icon: 'setting',
        authority: 'categoryManage',
        meta: {
          title: '任务管理'
        }
      }
    ]
  },

  // 治理引擎

  {
    path: '/flowManage',
    component: Layout,
    name: '治理引擎',
    icon: 'setting',
    authority: 'flowManage',
    meta: {
      title: '治理引擎'
    },
    children: [{
      path: 'index',
      component: _import('dataLake/template/index'),
      name: '模板管理',
      authority: 'index',
      icon: 'setting',
      meta: {
        title: '模板管理'
      }
    },
    {
      path: 'feedsList',
      // component: _import('dataLake/FeedsList'),
      component: _import('curd/feed/index'),
      name: '任务管理',
      authority: 'feedsList',
      icon: 'setting',
      meta: {
        title: '任务管理'
      }
    }
    ]
  },

  // 治理监控


  {
    path: '/runDetails',
    component: Layout,
    name: '治理监控',
    icon: 'setting',
    authority: 'runDetails',
    meta: {
      title: '治理监控'
    },
    children: [{
      path: 'blood',
      component: _import('sug/blood'),
      name: '血缘分析',
      authority: 'blood',
      meta: {
        title: '血缘分析'
      }
    },
    {
      path: 'service',
      component: _import('dataLake/Service'),
      name: '服务监控',
      authority: 'service',
      icon: 'setting',
      meta: {
        title: '服务监控'
      }
    },
    {
      path: 'homeWork',
      component: _import('dataLake/homeWork/index'),
      name: '作业监控管理',
      authority: 'homeWork',
      icon: 'setting',
      meta: {
        title: '作业监控管理'
      }
    }
    ]
  },

  // 结果应用
  {
    path: '/application',
    component: Layout,
    name: '结果应用',
    icon: 'setting',
    authority: 'application',
    meta: {
      title: '结果应用'
    },
    children: [{
      path: 'ruleEngine', // 规则模型
      component: _import('monitor/rule/index'),
      name: '规则引擎',
      icon: 'setting',
      authority: 'ruleEngine',
      meta: {
        title: '规则引擎'
      }
    }, {
      path: 'ruleLink', // 规则关联
      component: _import('monitor/ruleLink/index'),
      name: '规则引擎',
      icon: 'setting',
      authority: 'ruleLink',
      meta: {
        title: '规则关联'
      }
    }]
  },
  // 系统管理用户能见部分
  {
    path: '/adminSys',
    component: Layout,
    name: '基础配置',
    icon: 'setting',
    authority: 'adminSys',
    redirect: 'noredirect',
    meta: {
      title: '基础配置'
    },
    children: [{
      path: 'departManager',
      component: _import('org/depart/index'),
      name: '部门管理', // 服务权限管理
      authority: 'departManager',
      meta: {
        title: 'departManager'
      }
    },
    {
      path: 'userManager',
      icon: 'fa-user',
      component: _import('admin/user/index'),
      name: '用户管理',
      authority: 'userManager',
      meta: {
        title: 'userManager'
      }
    },
    {
      path: 'menuManager',
      icon: 'category',
      component: _import('admin/menu/index'),
      name: '菜单管理',
      authority: 'menuManager',
      meta: {
        title: 'menuManager'
      }
    },
    {
      path: 'groupTypeManager',
      icon: 'fa-users',
      component: _import('admin/groupType/index'),
      name: '角色类型',
      authority: 'groupTypeManager',
      meta: {
        title: '角色类型'
      }
    },
    {
      path: 'groupManager',
      icon: 'group_fill',
      component: _import('admin/group/index'),
      name: '角色权限',
      authority: 'groupManager',
      meta: {
        title: '角色权限'
      }
    },
    {
      path: 'dictManager',
      icon: 'viewlist',
      component: _import('dict/index'),
      name: '数据字典',
      authority: 'dictManager',
      meta: {
        title: 'dictManager'
      }
    },
    {
      path: 'gateLogManager',
      icon: 'viewlist',
      component: _import('admin/gateLog/index'),
      name: '操作日志',
      authority: 'gateLogManager',
      meta: {
        title: 'gateLogManager'
      }
    },
    // 定时任务
    {
      path: 'jobMgr',
      component: _import('workflow/config/job'),
      name: '定时计划',
      authority: 'jobMgr',
      meta: {
        title: 'jobMgr'
      }
    }
    ]
  },



  // 未使用的路由
  // {
  //   path: 'jobManager',
  //   icon: 'tenant',
  //   component: _import('admin/job/index'),
  //   name: '定时任务管理',
  //   authority: 'jobManager',
  //   meta: {
  //     title: '定时任务管理'
  //   }
  // }

  // 流程管理
  //  {
  //   path: '/flowManager',
  //   component: Layout,
  //   name: '流程管理',
  //   icon: 'setting',
  //   authority: 'flowManager',
  //   redirect: 'flowManager',
  //   meta: {
  //     title: 'flowManager'
  //   },
  //   children: [{
  //     path: 'taskList',
  //     component: _import('workflow/flow/task'),
  //     name: '任务列表',
  //     authority: 'taskList',
  //     meta: {
  //       title: 'taskList'
  //     }
  //   }, {
  //     path: 'flowList',
  //     component: _import('workflow/flow/list'),
  //     name: '流程列表',
  //     authority: 'flowList',
  //     meta: {
  //       title: 'flowList'
  //     }
  //   }, {
  //     path: 'instanceList',
  //     component: _import('workflow/flow/instance'),
  //     name: '流程实例',
  //     authority: 'instanceList',
  //     meta: {
  //       title: 'instanceList'
  //     }
  //   }]
  // },





  // 系统配置模块
  {
    path: '/baseManager',
    component: Layout,
    name: '系统配置',
    icon: 'setting',
    authority: 'baseManager',
    redirect: 'noredirect',
    meta: {
      title: '系统配置'
    },
    children: [{
      path: 'tenantManager',
      icon: 'tenant',
      component: _import('admin/tenant/index'),
      name: '租户管理',
      authority: 'tenantManager',
      meta: {
        title: 'tenantManager'
      }
    },
    {
      path: 'serviceManager',
      component: _import('auth/service/index'),
      name: '服务权限管理',
      authority: 'serviceManager',
      meta: {
        title: 'serviceManager'
      }
    }, {
      path: 'apiManager',
      component: _import('auth/api/index'),
      name: '服务接口管理',
      authority: 'apiManager',
      meta: {
        title: 'apiManager'
      }
    }, {
      path: 'gatewayManager',
      component: _import('auth/gatewayRoute/index'),
      name: '网关路由管理',
      authority: 'gatewayManager',
      meta: {
        title: 'gatewayManager'
      }
    }, {
      path: 'oauthClientDetailsManager',
      component: _import('auth/oauthClientDetails/index'),
      name: 'OAuth客户端管理',
      authority: 'oauthClientDetailsManager',
      meta: {
        title: 'oauthClientDetailsManager'
      }
    }, {
      path: 'selfClientDetailsManager',
      component: _import('auth/selfClientDetails/index'),
      name: '系统服务接入',
      authority: 'selfClientDetailsManager',
      meta: {
        title: 'selfClientDetailsManager'
      }
    },
    {
      path: 'serviceEurekaManager',
      component: _import('monitor/eureka/index'),
      name: 'Eureka注册中心',
      authority: 'serviceEurekaManager',
      meta: {
        title: 'serviceEurekaManager'
      }
    }, {
      path: 'serviceMonitorManager',
      component: _import('monitor/service/index'),
      name: '服务状态监控',
      authority: 'serviceMonitorManager',
      meta: {
        title: 'serviceMonitorManager'
      }
    }, {
      path: 'serviceZipkinManager',
      component: _import('monitor/zipkin/index'),
      name: '服务链路监控',
      authority: 'serviceZipkinManager',
      meta: {
        title: 'serviceZipkinManager'
      }
    }, {
      path: 'serviceSwManager',
      component: _import('monitor/sw/index'),
      name: '服务链路监控sw',
      authority: 'serviceSwManager',
      meta: {
        title: 'serviceSwManager'
      }
    }
    ]
  },

  // {
  //   path: '/authManager',
  //   component: Layout,
  //   name: '服务管理',
  //   icon: 'setting',
  //   authority: 'authManager',
  //   redirect: 'noredirect',
  //   meta: {
  //     title: 'authManager'
  //   },
  //   children: []
  // },
  // {
  //   path: '/monitorManager',
  //   component: Layout,
  //   name: '监控模块管理',
  //   icon: 'setting',
  //   authority: 'monitorManager',
  //   redirect: 'noredirect',
  //   meta: {
  //     title: 'monitorManager'
  //   },
  //   children: []
  // },

  {
    path: '/appManager',
    component: Layout,
    name: '会员管理模块',
    icon: 'setting',
    authority: 'appManager',
    redirect: 'noredirect',
    meta: {
      title: 'appManager'
    },
    children: [{
      path: 'appUserManager',
      component: _import('app/appUser/index'),
      name: '会员账户管理',
      authority: 'appUserManager',
      meta: {
        title: 'appUserManager'
      }
    }]
  },
  {
    path: '/news',
    component: Layout,
    name: '用户消息管理',
    icon: 'setting',
    authority: 'news',
    redirect: 'noredirect',
    meta: {
      title: 'news'
    },
    children: [{
      path: 'newsAdmin',
      component: _import('news/news/index'),
      name: '消息管理',
      authority: 'newsAdmin',
      meta: {
        title: 'newsAdmin'
      }
    }, {
      path: 'workflowAdmin',
      component: _import('news/work/index'),
      name: '工作流',
      authority: 'workflowAdmin',
      meta: {
        title: 'workflowAdmin'
      }
    }]
  },
  {
    path: '/dataCenter',
    component: Layout,
    name: '数据治理中心',
    icon: 'setting',
    authority: 'dataCenter',
    redirect: 'noredirect',
    meta: {
      title: 'dataCenter'
    },
    children: [{
      path: 'dataGatherList',
      component: _import('auth/api/list'),
      name: '数据采集列表',
      authority: 'dataGatherList',
      meta: {
        title: 'dataGatherList'
      }
    }, {
      path: 'dataStandardList',
      component: _import('auth/api/stander'),
      name: '数据标准列表',
      authority: 'dataStandardList',
      meta: {
        title: 'dataStandardList'
      }
    }, {
      path: 'standardStatList',
      component: _import('auth/api/standerStat'),
      name: '标准信息统计',
      authority: 'standardStatList',
      meta: {
        title: 'standardStatList'
      }
    }]
  },
  {
    path: '/eventManager',
    component: Layout,
    name: '事项管理',
    icon: 'setting',
    authority: 'eventManager',
    redirect: 'noredirect',
    meta: {
      title: 'eventManager'
    },
    children: [{
      path: 'todo',
      component: _import('workflow/event/todo'),
      name: '代办事项',
      authority: 'todo',
      meta: {
        title: 'todo'
      }
    }, {
      path: 'handledEvent',
      component: _import('workflow/event/handleEvent'),
      name: '办理历史',
      authority: 'handledEvent',
      meta: {
        title: 'handledEvent'
      }
    }, {
      path: 'startFlow',
      component: _import('workflow/event/startFlow'),
      name: '发起申请',
      authority: 'startFlow',
      meta: {
        title: 'startFlow'
      }
    }, {
      path: 'draft',
      component: _import('workflow/event/draft'),
      name: '我的草稿',
      authority: 'draft',
      meta: {
        title: 'draft'
      }
    }, {
      path: 'request',
      component: _import('workflow/event/request'),
      name: '申请历史',
      authority: 'request',
      meta: {
        title: 'request'
      }
    }]
  },
  {
    path: '/scheduleManager',
    component: Layout,
    name: '日程管理',
    icon: 'setting',
    authority: 'scheduleManager',
    redirect: 'scheduleManager',
    meta: {
      title: 'scheduleManager'
    },
    children: [{
      path: 'myAgenda',
      component: _import('workflow/event/myAgenda'),
      name: '我的日程',
      authority: 'myAgenda',
      meta: {
        title: 'myAgenda'
      }
    }, {
      path: 'agendaManager',
      component: _import('workflow/event/agendaManager'),
      name: '日程管理',
      authority: 'agendaManager',
      meta: {
        title: 'agendaManager'
      }
    }]
  },
  {
    path: '/formManager',
    component: Layout,
    name: '表单管理',
    icon: 'setting',
    authority: 'formManager',
    redirect: 'formManager',
    meta: {
      title: 'formManager'
    },
    children: [{
      path: 'businessTableList',
      component: _import('workflow/form/businessTable'),
      name: '业务实体',
      authority: 'businessTableList',
      meta: {
        title: 'businessTableList'
      }
    }, {
      path: 'businessObjectList',
      component: _import('workflow/form/businessObject'),
      name: '业务对象',
      authority: 'businessObjectList',
      meta: {
        title: 'businessObjectList'
      }
    }, {
      path: 'boForm',
      component: _import('workflow/form/formDef'),
      name: '业务表单',
      authority: 'boForm',
      meta: {
        title: 'boForm'
      }
    }, {
      path: 'formTemplate',
      component: _import('workflow/form/formTemplate'),
      name: '表单模板',
      authority: 'formTemplate',
      meta: {
        title: 'formTemplate'
      }
    }]
  },

  {
    path: '/assistSetting',
    component: Layout,
    name: '业务辅助配置',
    icon: 'setting',
    authority: 'assistSetting',
    redirect: 'assistSetting',
    meta: {
      title: 'assistSetting'
    },
    children: [{
      path: 'jobMgr',
      component: _import('workflow/config/job'),
      name: '定时计划',
      authority: 'jobMgr',
      meta: {
        title: 'jobMgr'
      }
    },
    {
      path: 'scriptMgr',
      component: _import('workflow/config/script'),
      name: '常用脚本',
      authority: 'scriptMgr',
      meta: {
        title: 'scriptMgr'
      }
    }
    ]

  },

  {
    path: '/dataSource',
    component: Layout,
    name: '元数据管理',
    icon: 'setting',
    authority: 'dataSource',
    redirect: 'noredirect',
    meta: {
      title: '元数据管理'
    },
    children: [{
      path: 'table',
      component: _import('dataSource/Table'),
      name: '元数据管理',
      icon: 'setting',
      authority: 'table',
      meta: {
        title: '元数据管理'
      }
    },
    {
      path: 'tag',
      component: _import('dataSource/tag'),
      name: '标签管理',
      icon: 'setting',
      authority: 'tag',
      meta: {
        title: '标签管理'
      }
    },
    {
      path: 'term',
      component: _import('dataSource/term'),
      name: '业务管理',
      icon: 'setting',
      authority: 'term',
      meta: {
        title: '业务管理'
      }
    }

    ]
  },

  {
    path: '/baseData',
    component: Layout,
    name: '基础数据管理',
    icon: 'setting',
    authority: 'baseData',
    redirect: 'noredirect',
    meta: {
      title: '基础数据管理'
    },
    children: [{
      path: 'dataDictionary',
      component: _import('baseDataManager/dataDictionary'),
      name: '数据字典',
      icon: 'setting',
      authority: 'dataDictionary',
      meta: {
        title: '数据字典'
      }
    },


    { // dataSourceManage
      path: 'codingManage',
      component: _import('baseDataManager/codingManage'),
      name: '编码管理',
      icon: 'setting',
      authority: 'codingManage',
      meta: {
        title: '编码管理'
      }
    }

    ]
  }





]
