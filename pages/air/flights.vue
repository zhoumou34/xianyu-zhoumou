<template>
  <section class="contianer">
    <el-row type="flex" justify="space-between">
      <!-- 顶部过滤列表 -->
      <div class="flights-content">
        <!-- 过滤条件 -->
        <FlightsFilters :data="flightsData" @setDataList="setDataList" />

        <!-- 航班头部布局 -->
        <FlightsLisHead />

        <!-- 航班信息 -->
        <div>
          <!-- flightsData.flights是后台返回的机票列表 -->
          <FlightsItem v-for="(item, index) in dataList" :key="index" :data="item" />

          <!-- 分页 -->
          <!-- @size-change：修改条数时候触发
                    @current-change：修改页数时候触发
                    current-page：当前页面
                    page-size：当前页面显示的条数
          total：总条数-->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageIndex"
            :page-sizes="[2, 4, 6, 8]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>

      <!-- 侧边栏 -->
      <div class="aside">
        <!-- 侧边栏组件 -->
      </div>
    </el-row>
  </section>
</template>

<script>
import FlightsLisHead from "@/components/air/flightsListHead.vue";
import FlightsItem from "@/components/air/flightsItem.vue";
import FlightsFilters from "@/components/air/flightsFilters.vue";

export default {
  data() {
    return {
      // 后台返回的大的数据列表
      flightsData: {
        // 航班总数据
        flights: [],
        info: {},
        options: {}
      },
      cacheFlightsData: {
        // 缓存一份数据，只会修改一次
        flights: [],
        info: {},
        options: {}
      },
      // 保存当前显示的列表数据
      dataList: [],

      // 当前页数
      pageIndex: 1,

      // 显示的条数
      pageSize: 2,
      // 总条数
      total: 0
    };
  },
  components: {
    FlightsLisHead,
    FlightsItem,
    FlightsFilters
  },
  methods: {
    // 修改分页数时候触发
    handleSizeChange(value) {
      // 修改分页条数
      this.pageSize = value;
      // 修改分页数据
      this.getDataList();
    },
    // 切换页数时触发
    handleCurrentChange(value) {
      // 修改页数
      this.pageIndex = value;
      // 修改分页的数据
      this.getDataList();
    },
    // 获取分页数据
    getDataList() {
      // 修改dataList的数据
      this.dataList = this.flightsData.flights.slice(
        (this.pageIndex - 1) * this.pageSize,
        (this.pageIndex - 1) * this.pageSize + this.pageSize
      );
    },
    // 获取航班总数据
    getData() {
      this.$axios({
        url: "airs",
        params: this.$route.query
      }).then(res => {
        this.flightsData = res.data;
        // 缓存一份新的列表数据,这个列表不会被修改
        // 而flightsData会被修改
        this.cacheFlightsData = { ...res.data };
        this.setDatalist();
      });
    },
    // 设置dataList数据
    // arr是展示的新数据,该方法将会传递给过滤组件使用
    setDatalist(arr) {
      // 如果有新数据从第一页开始显示
      if (arr) {
        this.pageIndex = 1;
        this.flightsData.flights = arr;
        this.flightsData.total = arr.length;
      }
      const start = (this.pageIndex - 1) * this.pageSize;
      const end = start + this.pageSize;
      this.dataList = this.flightsData.flights.slice(start, end);
    }
  },
  mounted() {
    // 请求列表数据
    this.$axios({
      url: "/airs",
      method: "GET",
      params: this.$route.query
    }).then(res => {
      // 保存总的大数据
      this.flightsData = res.data;
      //总条数
      this.total = this.flightsData.flights.length;
      // 切割出当前页面要显示的数据
      this.dataList = this.flightsData.flights.slice(0, 2);
    });
  }
};
</script>

<style scoped lang="less">
.contianer {
  width: 1000px;
  margin: 20px auto;
}

.flights-content {
  width: 745px;
  font-size: 14px;
}

.aside {
  width: 240px;
}
</style>