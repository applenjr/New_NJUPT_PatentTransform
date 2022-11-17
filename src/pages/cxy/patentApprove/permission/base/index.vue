<template>
  <div>
    <t-card class="list-card-container">
      <t-row justify="space-between">
        <div class="left-operation-container">
          <p v-if="!!selectedRowKeys.length" class="selected-count">已选{{ selectedRowKeys.length }}项</p>
        </div>
        <div class="search-input">
          <t-input v-model="searchRequestData.zlmc" class="searchInputStyle" placeholder="专利名称" clearable />
          <t-input v-model="searchRequestData.zlh" class="searchInputStyle" placeholder="专利号" clearable />
          <t-button class="searchBtnStyle" @click="searchPatent" style="width: 100px">
            <t-icon name="search"></t-icon>
            查询
          </t-button>
          <t-button class="searchBtnStyle" theme="success" @click="copy_site">
            <t-icon name="link"></t-icon>
            导出引用
          </t-button>
          <t-button v-show="selectedRowKeys.length != 0" class="searchBtnStyle" style="width: 180px">
            <t-icon name="edit"></t-icon>
            批量填写价格意向
          </t-button>
        </div>
      </t-row>
      <t-table
        :data="tableData"
        :columns="LIST_COLUMNS"
        :row-key="rowKey"
        cell-empty-content="-"
        hover
        table-layout="fixed"
        :pagination="pagination"
        :selected-row-keys="selectedRowKeys"
        :loading="dataLoading"
        :expand-on-row-click="true"
        :expanded-row-keys="expandedRowKeys"
        :expanded-row="expandedRow"
        :expand-icon="false"
        :header-affixed-top="{ offsetTop, container: getContainer }"
        :horizontal-scroll-affixed-bottom="{ offsetBottom: '64', container: getContainer }"
        :pagination-affixed-bottom="{ offsetBottom: '0', container: getContainer }"
        @page-change="rehandlePageChange"
        @select-change="rehandleSelectChange"
        @expand-change="rehandleExpandChange"
      >
        <template #settings="scope">
          <div class="settings_buttons">
            <t-button
              v-if="scope.row.zlzsxzdz != '' || scope.row.certificateId != null"
              theme="primary"
              @click="handleExam(scope.row)"
            >
              <t-icon name="edit"></t-icon>
              填写审批
            </t-button>
            <t-button
              v-if="!['', null].includes(scope.row.zlzsxzdz) || !['', null].includes(scope.row.certificateId)"
              variant="outline"
              theme="primary"
              @click="downloadCertificate(scope.row)"
            >
              <t-icon name="download"></t-icon>
              下载专利证书
            </t-button>
            <t-button v-if="!scope.row.price_filled" variant="outline" theme="primary" @click="FillingPrice(scope.row)">
              <t-icon name="money-circle"></t-icon>
              价格意向
            </t-button>
            <el-upload
              v-if="['', null].includes(scope.row.zlzsxzdz) && ['', null].includes(scope.row.certificateId)"
              ref="upload"
              class="upload-demo"
              action="/pdf/upload"
              :show-file-list="false"
              :http-request="Upload"
            >
              <t-button variant="outline" theme="primary" @click="upload(scope.row, 'certificate')">
                <t-icon name="cloud-upload"></t-icon>
                上传专利证书
              </t-button>
            </el-upload>
          </div>
        </template>
      </t-table>
    </t-card>
  </div>
</template>

<script setup lang="jsx">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { MessagePlugin } from "tdesign-vue-next";
import { useSettingStore, useUserStore } from "@/store";
import { prefix } from "@/config/global";

import { LIST_COLUMNS } from "./constants";

import { request } from "@/utils/request";
import { setObjToUrlParams, TimeDiffer } from "@/utils/request/utils";

const settingStore = useSettingStore();
const router = useRouter();
const userStore = useUserStore();


/**
 * 数据区
 * 表格相关 data
 */
// 用户数据
const userInfo = userStore.userInfo;
// 表格数据
const tableData = ref([]);
// 表格分页
const pagination = ref({
  pageSize: 20,
  total: 0,
  current: 1,
  showJumper: true,
  showFirstAndLastPageBtn: true,
  maxPageBtn: 5
});
// 行key
const rowKey = "index";
// 被选中的行
const selectedRowKeys = ref([]);
// 展开的行rowkey
const expandedRowKeys = ref([]);
// 表格拓展部分
const expandedRow = (h, { row }) => (
  <div>
    <b style="color:#99a9bf">成员名单</b>
    <span style="margin-left:10px;">{row.cymd}</span>
    <br />
    <br />
    <b style="color:#99a9bf">成员工号</b>
    <span style="margin-left:10px;">{row.cygh}</span>
    <br />
    <br />
    <b style="color:#99a9bf">专利第一作者姓名</b>
    <span style="margin-left:10px;">{row.zldyzzxm}</span>
    <br />
    <br />
    <b style="color:#99a9bf">专利第一作者工号</b>
    <span style="margin-left:10px;">{row.zldyzzgh}</span>
    <br />
    <br />
    <b style="color:#99a9bf">授权日期</b>
    <span style="margin-left:10px;">{row.sqrq}</span>
    <br />
    <br />
    <b style="color:#99a9bf">归属单位</b>
    <span style="margin-left:10px;">{row.gsdw}</span>
    <br />
    <br />
    <b style="color:#99a9bf">所有权人</b>
    <span style="margin-left:10px;">{row.zlqr}</span>
    <br />
    <br />
    <b style="color:#99a9bf">专利代理人</b>
    <span style="margin-left:10px;">{row.zldlr}</span>
    <br />
    <br />
    <b style="color:#99a9bf">转让价格</b>
    <span style="margin-left:10px;">{row.priceIntention == null ? "暂无" : `${row.priceIntention} 万元`}</span>
    <br />
    <br />
    <b style="color:#99a9bf">许可价格</b>
    <span style="margin-left:10px;">
      {row.licencePriceIntention == null ? "暂无" : `${row.licencePriceIntention} 万元`}
    </span>
    <br />
    <br />
    <b style="color:#99a9bf">开放许可价格</b>
    <span style="margin-left:10px;">
      {row.openLicencePriceIntention == null ? "暂无" : `${row.openLicencePriceIntention} 万元`}
    </span>
    <br />
    <br />
    <b style="color:#99a9bf">最后更新时间</b>
    <span style="margin-left:10px;">{row.gmtUpdate}</span>
  </div>
);
// 表格loading
const dataLoading = ref(false);
// 获取专利列表请求数据
const tableRequestData = ref({
  currPage: pagination.value.current,
  size: pagination.value.pageSize
});
// 查询专利请求数据
const searchRequestData = ref({
  currPage: pagination.value.current,
  size: pagination.value.pageSize,
  userGh: userInfo.userGh,
  userName: userInfo.userName,
  zlmc: "",
  zlh: ""
});

/**
 * methods
 */
/* 生命周期 */
// 组件挂载完成后执行
onMounted(() => {
  // 获取表格数据
  const requestUrl = setObjToUrlParams("/teacher/getMyPatentPage", tableRequestData.value);
  getPatentsListData(requestUrl);
});
/* 计算属性 */
const offsetTop = computed(() => {
  return settingStore.isUseTabsRouter ? 48 : 0;
});
// 获取当前容器
const getContainer = () => {
  return document.querySelector(`.${prefix}-layout`);
};
// 获取专利列表数据
const getPatentsListData = (requestUrl) => {
  dataLoading.value = true;
  tableData.value = [];
  request.get({
    url: requestUrl
  }).then((res) => {
    console.log(res);
    tableData.value = res.records;
    for (let i = 0; i < tableData.value.length; i++) {
      tableData.value[i].index = (pagination.value.current - 1) * pagination.value.pageSize + i + 1;
    }
    pagination.value = {
      ...pagination.value,
      total: res.total
    };
  }).catch((err) => {
    console.log(err);
    MessagePlugin.error(err.message);
  }).finally(() => {
    dataLoading.value = false;
  });
};

// 查询专利
const searchPatent = async () => {
  let requestUrl = "";
  pagination.value = {
    ...pagination.value,
    current: 1
  };
  if (searchRequestData.value.zlmc == "" && searchRequestData.value.zlh == "") {
    tableRequestData.value = {
      ...tableRequestData.value,
      currPage: 1
    };
    requestUrl = setObjToUrlParams("/teacher/getMyPatentPage", tableRequestData.value);
  } else {
    searchRequestData.value = {
      ...searchRequestData.value,
      currPage: 1
    };
    if (searchRequestData.value.zlmc == "") {
      // 专利号不空
      requestUrl = setObjToUrlParams("/teacher/getPatentPageByZLH", searchRequestData.value);
    } else {
      // 专利名称不空
      requestUrl = setObjToUrlParams("/teacher/getPatentPageByZLMC", searchRequestData.value);
    }
  }
  getPatentsListData(requestUrl);
};


/**
 * 表格操作钩子
 * @param val
 */
// 展开行钩子
const rehandleExpandChange = (val) => {
  expandedRowKeys.value = val;
};
// 选中行钩子
const rehandleSelectChange = (val) => {
  selectedRowKeys.value = val;
};
// 分页变化钩子
const rehandlePageChange = (curr) => {
  console.log("分页变化", curr);
  pagination.value = {
    ...pagination.value,
    current: curr.current,
    pageSize: curr.pageSize
  };
  tableRequestData.value = {
    currPage: curr.current,
    size: curr.pageSize
  };
  searchRequestData.value = {
    ...searchRequestData.value,
    currPage: curr.current,
    size: curr.pageSize
  };
  console.log(pagination.value);
  console.log(tableRequestData.value);
  let requestUrl = "";
  if (searchRequestData.value.zlmc == "" && searchRequestData.value.zlh == "") {
    requestUrl = setObjToUrlParams("/teacher/getMyPatentPage", tableRequestData.value);
  } else {
    if (searchRequestData.value.zlmc == "") {
      // 专利号不空
      requestUrl = setObjToUrlParams("/teacher/getPatentPageByZLH", searchRequestData.value);
    } else {
      // 专利名称不空
      requestUrl = setObjToUrlParams("/teacher/getPatentPageByZLMC", searchRequestData.value);
    }
  }
  getPatentsListData(requestUrl);
};
</script>

<style lang="less" scoped>
.list-card-container {
  min-width: 1250px;

  .left-operation-container {
    padding-top: 6px;

    .selected-count {
      display: inline-block;
      margin-left: 8px;
      color: var(--td-text-color-secondary);
    }
  }

  .search-input {
    //border: 1px solid red;
    display: flex;

    .searchInputStyle,
    .searchBtnStyle {
      margin-left: 10px;
    }

    .searchInputStyle {
      width: 240px;
    }

    .searchBtnStyle {
      width: 120px;
    }
  }

  .settings_buttons {

    .t-button {
      margin: 0 10px 0 0;
    }
  }
}
</style>
