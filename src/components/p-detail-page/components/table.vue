<template>
  <table class="mobile-table">
    <thead>
      <tr class="mobile-table-header">
        <th
          v-for="column in columns"
          :key="column.key"
          class="mobile-table-header-cell"
          :style="getCellStyle(column)"
        >
          {{ column.title }}
        </th>
      </tr>
    </thead>
    <tbody class="mobile-table-body">
      <template v-for="(row, rowIndex) in MyData" :key="rowIndex">
        <tr class="mobile-table-row">
          <template v-for="(column, colIndex) in columns">
            <td
              v-if="
                isShow(
                  rowIndex,
                  colIndex,
                  renderRowSpanData(column, row, rowIndex)
                )
              "
              class="mobile-table-cell"
              :rowspan="renderRowSpanData(column, row, rowIndex)"
              :style="getCellStyle(column)"
            >
              {{
                column.render ? column.render(row, rowIndex) : row[column.key]
              }}
            </td>
          </template>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import { isFunction, isNumber } from "lodash";
import { computed } from "vue";
const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
  filterData: {
    type: Function,
  },
});
const MyData = computed(() => {
  if (props.filterData && props.data) return props.filterData(props.data);
  return props.data;
});
//记录第一次跨行的路径
const oldSpanIndex = {};
for (let i = 0; i < props.columns.length; i++) {
  oldSpanIndex[i] = 0;
}
function isShow(rowIndex: number, colIndex: number, rowspan: number) {
  console.log(rowIndex, oldSpanIndex, rowspan);
  if (rowIndex === oldSpanIndex[colIndex]) {
    oldSpanIndex[colIndex] = oldSpanIndex[colIndex] + rowspan;
    return true;
  }
  return false;
}
function getCellStyle(column) {
  if (column.width) return { width: column.width };
  return { width: "100px" }; //{ flex: 1 }
}

function renderRowSpanData(column, rowData, rowIndex) {
  if (isFunction(column.rowSpan)) return column.rowSpan(rowData, rowIndex);
  if (isNumber(column.rowSpan)) return column.rowSpan;
  return 1;
}
</script>

<style scoped lang="scss">
.mobile-table {
  font-variant-numeric: tabular-nums;
  width: 100%;
  word-break: break-word;
  border-collapse: separate;
  border-spacing: 0;
}

// .mobile-table-header {
// 	display: flex;
// 	flex-direction: row;
// 	background: rgba(112, 168, 78, 0.03);
// }

// .mobile-table-body {
// 	display: flex;
// 	flex-direction: column;
// }

// .mobile-table-row {
// 	display: flex;
// 	flex-direction: row;
// }

.mobile-table-header-cell,
.mobile-table-cell {
  padding: 10px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

// .mobile-table-header-cell {
// 	white-space: nowrap;
// }
</style>
