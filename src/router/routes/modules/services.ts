import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const SERVICES: AppRouteRecordRaw = {
  path: '/services',
  name: 'services',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.services',
    requiresAuth: true,
    icon: 'icon-list',
    order: 1,

  },
  children: [
    {
      path: '/list', // The midline path complies with SEO specifications
      name: 'ServiceList',
      component: () => import('@/views/services/list/index.vue'),
      meta: {
        locale: 'menu.services.list',
        requiresAuth: true,
        roles: ['*'],
        hideInMenu: false,
      },
    },
  ],
};

export default SERVICES;
