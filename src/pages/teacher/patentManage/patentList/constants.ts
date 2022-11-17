export const LIST_COLUMNS = [
  { colKey: "row-select", type: "multiple", width: 40, fixed: "left" },
  {
    align: "center",
    title: "序号",
    width: 60,
    colKey: "index"
  },
  {
    title: "专利名称",
    colKey: "zlmc",
    ellipsis: true
  },
  {
    title: "专利号",
    colKey: "zlh",
    width: 200,
    ellipsis: true
  },
  {
    align: "left",
    fixed: "right",
    colKey: "settings",
    title: "操作"
  }
];
