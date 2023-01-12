<template>
  <div class="container">
    <Breadcrumb :items="['menu.services', 'menu.services.list']" />
    <a-card class="general-card" :title="$t('menu.services.list')">
      <a-row>
        <a-col :flex="1">
          <a-form
            :model="formModel"
            :label-col-props="{ span: 5 }"
            :wrapper-col-props="{ span: 16 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="search" :label="$t('serviceList.form.search') + '：'">
                  <a-input
                      v-model="formModel.search"
                      :placeholder="$t('serviceList.form.search.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="protocol"
                  :label="$t('serviceList.form.protocol') + '：'"
                >
                  <a-select
                    v-model="formModel.protocol"
                    :options="protocolOptions"
                    :placeholder="$t('serviceList.form.protocol.all')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="enable"
                  :label="$t('serviceList.form.enable') + '：'"
                >
                  <a-select
                    v-model="formModel.enable"
                    :options="enableOptions"
                    :placeholder="$t('serviceList.form.enable.all')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                    field="release"
                    :label="$t('serviceList.form.release') + '：'"
                >
                  <a-select
                      v-model="formModel.release"
                      :options="releaseOptions"
                      :placeholder="$t('serviceList.form.release.all')"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 84px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
          <a-space direction="vertical" :size="18">
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              {{ $t('serviceList.form.searchBtn') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('serviceList.form.resetBtn') }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0" />
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button type="primary">
              <template #icon>
                <icon-plus />
              </template>
              {{ $t('serviceList.operation.createBtn') }}
            </a-button>
          </a-space>
        </a-col>
        <a-col
          :span="12"
          style="display: flex; align-items: center; justify-content: end"
        >
          <a-tooltip :content="$t('serviceList.actions.refresh')">
            <div class="action-icon" @click="search"
              ><icon-refresh size="18"
            /></div>
          </a-tooltip>
          <a-dropdown @select="handleSelectDensity">
            <a-tooltip :content="$t('serviceList.actions.density')">
              <div class="action-icon"><icon-line-height size="18" /></div>
            </a-tooltip>
            <template #content>
              <a-doption
                v-for="item in densityList"
                :key="item.value"
                :value="item.value"
                :class="{ active: item.value === size }"
              >
                <span>{{ item.name }}</span>
              </a-doption>
            </template>
          </a-dropdown>
        </a-col>
      </a-row>
      <a-table
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        :columns="(cloneColumns as TableColumnData[])"
        :data="renderData"
        :bordered="false"
        :size="size"
        @page-change="onPageChange"
      >
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.page - 1) * pagination.page_size }}
        </template>

      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import { queryServiceList, ServiceRecord, ServiceParams } from '@/api/services';
  import { Pagination } from '@/types/global';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import { forEach } from "lodash";

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const generateFormModel = () => {
    return {
      protocol: 0,
      enable: 0,
      release: 0,
      search: '',
    };
  };
  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<ServiceRecord[]>([]);
  const formModel = ref(generateFormModel());
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);

  const size = ref<SizeProps>('medium');

  const basePagination: Pagination = {
    page: 1,
    page_size: 20,
  };
  const pagination = reactive({
    ...basePagination,
  });
  const densityList = computed(() => [
    {
      name: t('serviceList.size.mini'),
      value: 'mini',
    },
    {
      name: t('serviceList.size.small'),
      value: 'small',
    },
    {
      name: t('serviceList.size.medium'),
      value: 'medium',
    },
    {
      name: t('serviceList.size.large'),
      value: 'large',
    },
  ]);
  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('serviceList.columns.resId'),
      dataIndex: 'res_id',
    },
    {
      title: t('serviceList.columns.name'),
      dataIndex: 'name',
    },
    {
      title: t('serviceList.columns.hosts'),
      dataIndex: 'service_domains',
    },
    {
      title: t('serviceList.columns.protocol'),
      dataIndex: 'protocol',
    },
    {
      title: t('serviceList.columns.plugin'),
      dataIndex: 'plugin_list',
    },
    {
      title: t('serviceList.columns.release'),
      dataIndex: 'release',
    },
    {
      title: t('serviceList.columns.enable'),
      dataIndex: 'enableCn',
    },
    {
      title: t('serviceList.columns.operations'),
      dataIndex: 'operations',
    },
  ]);
  const protocolOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('serviceList.form.protocol.all'),
      value: 0,
    },
    {
      label: t('serviceList.form.protocol.http'),
      value: 1,
    },
    {
      label: t('serviceList.form.protocol.https'),
      value: 2,
    },
    {
      label: t('serviceList.form.protocol.httpAndHttps'),
      value: 3,
    },
  ]);
  const enableOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('serviceList.form.enable.all'),
      value: 0,
    },
    {
      label: t('serviceList.form.enable.yes'),
      value: 1,
    },
    {
      label: t('serviceList.form.enable.no'),
      value: 2,
    },
  ]);
  const releaseOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('serviceList.form.release.all'),
      value: 0,
    },
    {
      label: t('serviceList.form.release.no'),
      value: 1,
    },
    {
      label: t('serviceList.form.release.wait'),
      value: 2,
    },
    {
      label: t('serviceList.form.release.yes'),
      value: 3,
    },
  ]);
  const fetchData = async (
    params: ServiceParams = { page: 1, page_size: 20 }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryServiceList(params);

      data.data.forEach((item, index) => {

        protocolOptions.value.indexOf(item.enable)
        if (item.enable === 2) {
           item.enableCn = "开启"
        }
      })
      renderData.value = data.data;
      pagination.page = params.page;
      pagination.total = data.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const search = () => {
    fetchData({
      ...basePagination,
      ...formModel.value,
    } as unknown as ServiceParams);
  };
  const onPageChange = (page: number) => {
    fetchData({ ...basePagination, page });
  };

  fetchData();
  const reset = () => {
    formModel.value = generateFormModel();
  };

  const handleSelectDensity = (
    val: string | number | Record<string, any> | undefined,
    e: Event
  ) => {
    size.value = val as SizeProps;
  };

  watch(
    () => columns.value,
    (val) => {
      cloneColumns.value = cloneDeep(val);
      cloneColumns.value.forEach((item, index) => {
        item.checked = true;
      });
      showColumns.value = cloneDeep(cloneColumns.value);
    },
    { deep: true, immediate: true }
  );

</script>

<script lang="ts">
  export default {
    name: 'ServiceList',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }
  :deep(.arco-table-th) {
    &:last-child {
      .arco-table-th-item-title {
        margin-left: 16px;
      }
    }
  }
  .action-icon {
    margin-left: 12px;
    cursor: pointer;
  }
  .active {
    color: #0960bd;
    background-color: #e3f4fc;
  }
  .setting {
    display: flex;
    align-items: center;
    width: 200px;
    .title {
      margin-left: 12px;
      cursor: pointer;
    }
  }
</style>
