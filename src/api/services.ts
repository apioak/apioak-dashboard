import axios from 'axios';
import qs from 'query-string';
import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';

export interface ServicePluginRecord {
  res_id: string;
  type: number;
  name: string;
  key: string;
  icon: string;
  enable: number;
}
export interface ServiceRecord {
  id: string;
  name: string;
  protocol: number;
  release: number;
  res_id: string;
  enable: number;
  enableCn: string;
}

export interface ServiceParams extends Partial<ServiceRecord> {
  page: number;
  page_size: number;
}

export interface ServiceListRes {
  data: ServiceRecord[];
  total: number;
}

export function queryServiceList(params: ServiceParams) {
  return axios.get<ServiceListRes>('/admin/service/list', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}
