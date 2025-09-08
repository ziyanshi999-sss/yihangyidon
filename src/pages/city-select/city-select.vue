<template>
  <view class="city-select-page">
    <!-- 搜索栏 -->
    <view class="search-section">
      <view class="search-bar">
        <text class="search-icon">🔍</text>
        <input
          class="search-input"
          placeholder="请输入城市名或首字母查询，如：北京/B/b"
          v-model="searchKeyword"
          @input="handleSearch"
        />
      </view>
    </view>

    <!-- 当前定位 -->
    <view class="location-section">
      <view class="location-item" @tap="selectCurrentLocation">
        <view class="location-icon">📍</view>
        <text class="location-text">保定市</text>
        <text class="current-tag">当前定位</text>
      </view>
    </view>

    <!-- 热门城市 -->
    <view class="hot-cities-section" v-if="!searchKeyword">
      <view class="hot-cities-grid">
        <view
          class="hot-city-item"
          v-for="city in hotCities"
          :key="city"
          @tap="selectCity(city)"
        >
          <text class="hot-city-text">{{ city }}</text>
        </view>
      </view>
    </view>

    <!-- 城市列表 -->
    <view class="city-list-section">
      <!-- 字母索引侧边栏 -->
      <view
        class="alphabet-sidebar"
        v-if="!searchKeyword"
        :style="{ top: dynamicSidebarTop + 'rpx' }"
      >
        <view
          class="sidebar-container"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
        >
          <view
            class="alphabet-item"
            v-for="letter in availableLetters"
            :key="letter"
            :class="{ active: currentLetter === letter }"
            :data-letter="letter"
            @tap="scrollToLetter(letter)"
            @touchstart="handleTouchStart(letter)"
          >
            <text class="alphabet-text">{{ letter }}</text>
          </view>
        </view>
        <!-- 字母提示框 -->
        <view
          class="letter-tip"
          v-if="showLetterTip"
          :class="{ show: showLetterTip }"
        >
          <text class="tip-text">{{ currentLetter }}</text>
        </view>

        <!-- 滚动进度指示器 -->
        <view class="scroll-progress" v-if="!searchKeyword">
          <view
            class="progress-bar"
            :style="{ height: scrollProgress + '%' }"
          ></view>
        </view>
      </view>

      <!-- 城市列表内容 -->
      <view class="city-content">
        <!-- 搜索结果 -->
        <view v-if="searchKeyword && filteredCities.length > 0">
          <view class="section-divider">
            <text class="divider-text">搜索结果</text>
            <text class="result-count">({{ filteredCities.length }})</text>
          </view>
          <view
            class="city-item"
            v-for="city in filteredCities"
            :key="city"
            @tap="selectCity(city)"
          >
            <view class="city-name">
              <template v-if="!searchKeyword">
                <text>{{ city }}</text>
              </template>
              <template v-else>
                <text
                  v-for="(part, index) in getHighlightedParts(city)"
                  :key="index"
                  :class="{ highlight: part.isHighlight }"
                  >{{ part.text }}</text
                >
              </template>
            </view>
            <text class="city-pinyin">{{ getCityPinyin(city) }}</text>
          </view>
        </view>

        <!-- 无搜索结果 -->
        <view
          v-else-if="searchKeyword && filteredCities.length === 0"
          class="no-result"
        >
          <text class="no-result-text">未找到相关城市</text>
        </view>

        <!-- 按字母分组的城市列表 -->
        <view v-else>
          <view
            v-for="(cities, letter) in groupedCities"
            :key="letter"
            :id="`letter-${letter}`"
            class="letter-group"
          >
            <view
              class="section-divider sticky-header"
              :class="{ 'highlight-flash': highlightedLetter === letter }"
              :data-letter="letter"
            >
              <text class="divider-text">{{ letter }}</text>
              <text class="city-count">({{ cities.length }})</text>
            </view>
            <view
              class="city-item"
              v-for="city in cities"
              :key="city"
              @tap="selectCity(city)"
            >
              <text class="city-name">{{ city }}</text>
              <text class="city-first-letter">{{
                getCityFirstLetter(city)
              }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "CitySelectPage",
  data() {
    return {
      searchKeyword: "",
      currentCity: "保定市",
      currentLetter: "",
      showLetterTip: false,
      touchTimer: null,
      searchTimer: null,
      isTouching: false,
      highlightedLetter: "",
      dynamicSidebarTop: 550, // 动态计算的侧边栏位置，大幅增加默认值确保绝对不遮挡

      // 热门城市
      hotCities: [
        "北京",
        "重庆",
        "广州市",
        "杭州市",
        "上海",
        "深圳",
        "苏州市",
        "天津",
      ],

      // 所有城市数据
      allCities: [
        // A
        "阿坝藏族羌族自治州",
        "阿克苏地区",
        "阿拉尔市",
        "阿里地区",
        "阿勒泰地区",
        "阿坝市",
        "安康市",
        "安庆市",
        "安顺市",
        "安阳市",
        // B
        "北京",
        "保定市",
        // C
        "重庆",
        "成都市",
        "长沙市",
        "长春市",
        "常州市",
        "沧州市",
        // D
        "大连市",
        "东莞市",
        "大庆市",
        "丹东市",
        "德州市",
        "德阳市",
        // E
        "鄂尔多斯市",
        "恩施土家族苗族自治州",
        // F
        "福州市",
        "佛山市",
        "抚顺市",
        "阜阳市",
        // G
        "广州市",
        "贵阳市",
        "桂林市",
        "赣州市",
        "广安市",
        // H
        "杭州市",
        "哈尔滨市",
        "合肥市",
        "海口市",
        "呼和浩特市",
        "惠州市",
        // J
        "济南市",
        "江门市",
        "嘉兴市",
        "金华市",
        "荆州市",
        "九江市",
        // K
        "昆明市",
        "开封市",
        // L
        "兰州市",
        "洛阳市",
        "连云港市",
        "临沂市",
        "柳州市",
        // M
        "绵阳市",
        "马鞍山市",
        // N
        "南京市",
        "宁波市",
        "南昌市",
        "南宁市",
        "南通市",
        // P
        "平顶山市",
        // Q
        "青岛市",
        "泉州市",
        "秦皇岛市",
        // R
        "日照市",
        // S
        "上海",
        "深圳",
        "苏州市",
        "石家庄市",
        "沈阳市",
        "绍兴市",
        // T
        "天津",
        "太原市",
        "台州市",
        "唐山市",
        "泰安市",
        // W
        "武汉市",
        "无锡市",
        "温州市",
        "乌鲁木齐市",
        "潍坊市",
        "芜湖市",
        // X
        "西安市",
        "厦门市",
        "徐州市",
        "襄阳市",
        "湘潭市",
        "新乡市",
        // Y
        "银川市",
        "扬州市",
        "烟台市",
        "宜昌市",
        "岳阳市",
        // Z
        "郑州市",
        "珠海市",
        "中山市",
        "株洲市",
        "淄博市",
        "遵义市",
      ],

      // 字母索引
      alphabetList: [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        "M",
        "N",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "W",
        "X",
        "Y",
        "Z",
      ],
    };
  },

  computed: {
    // 搜索过滤的城市 - 增强版
    filteredCities() {
      if (!this.searchKeyword) return [];

      const keyword = this.searchKeyword.toLowerCase().trim();
      const results = [];

      this.allCities.forEach((city) => {
        let matchScore = 0;

        // 1. 中文名称完全匹配 (最高优先级)
        if (city.toLowerCase() === keyword) {
          matchScore = 100;
        }
        // 2. 中文名称开头匹配
        else if (city.toLowerCase().startsWith(keyword)) {
          matchScore = 90;
        }
        // 3. 中文名称包含匹配
        else if (city.toLowerCase().includes(keyword)) {
          matchScore = 80;
        }
        // 4. 拼音首字母匹配
        else {
          const firstLetter = this.getCityFirstLetter(city).toLowerCase();
          const fullPinyin = this.getCityPinyin(city).toLowerCase();

          if (firstLetter === keyword) {
            matchScore = 70;
          } else if (fullPinyin.includes(keyword)) {
            matchScore = 60;
          } else if (firstLetter.includes(keyword)) {
            matchScore = 50;
          }
        }

        if (matchScore > 0) {
          results.push({ city, score: matchScore });
        }
      });

      // 按匹配度排序
      return results.sort((a, b) => b.score - a.score).map((item) => item.city);
    },

    // 按字母分组的城市 - 增强版
    groupedCities() {
      const grouped = {};

      this.allCities.forEach((city) => {
        const letter = this.getCityFirstLetter(city);
        if (!grouped[letter]) {
          grouped[letter] = [];
        }
        grouped[letter].push(city);
      });

      // 按字母顺序排序，并对每组内的城市排序
      const sortedGrouped = {};
      this.alphabetList.forEach((letter) => {
        if (grouped[letter]) {
          sortedGrouped[letter] = grouped[letter].sort((a, b) => {
            // 中文排序
            return a.localeCompare(b, "zh-CN");
          });
        }
      });

      return sortedGrouped;
    },

    // 可用的字母列表 (只显示有城市的字母)
    availableLetters() {
      return this.alphabetList.filter(
        (letter) =>
          this.groupedCities[letter] && this.groupedCities[letter].length > 0
      );
    },

    // 滚动进度百分比
    scrollProgress() {
      if (!this.currentLetter || this.availableLetters.length === 0) return 0;

      const currentIndex = this.availableLetters.indexOf(this.currentLetter);
      if (currentIndex === -1) return 0;

      return ((currentIndex + 1) / this.availableLetters.length) * 100;
    },
  },

  methods: {
    // 处理搜索 - 添加防抖
    handleSearch() {
      // 清除之前的定时器
      if (this.searchTimer) {
        clearTimeout(this.searchTimer);
      }

      // 设置防抖
      this.searchTimer = setTimeout(() => {
        // 搜索逻辑已在computed中处理
        console.log("搜索关键词:", this.searchKeyword);
      }, 300);
    },

    // 滚动到指定字母 - 增强版
    scrollToLetter(letter) {
      console.log("=== 开始滚动到字母:", letter, "===");
      this.currentLetter = letter;

      // 添加视觉反馈
      this.showScrollingIndicator(letter);

      // 先获取页面当前滚动位置
      uni
        .createSelectorQuery()
        .selectViewport()
        .scrollOffset()
        .exec((res) => {
          const scrollOffset = res[0];
          console.log("当前页面滚动位置:", scrollOffset);

          // 使用更精确的选择器和查询方式
          const query = uni.createSelectorQuery().in(this);

          // 同时查询目标元素和头部区域
          query.select(`#letter-${letter}`).boundingClientRect();
          query.select(".search-section").boundingClientRect();
          query.select(".location-section").boundingClientRect();
          query.select(".hot-cities-section").boundingClientRect();

          query.exec((results) => {
            const [targetRect, searchRect, locationRect, hotCitiesRect] =
              results;

            console.log("查询结果:", {
              target: targetRect,
              search: searchRect,
              location: locationRect,
              hotCities: hotCitiesRect,
            });

            if (targetRect) {
              // 计算实际的头部高度
              let actualHeaderHeight = 0;
              if (searchRect) actualHeaderHeight += searchRect.height;
              if (locationRect) actualHeaderHeight += locationRect.height;
              if (hotCitiesRect) actualHeaderHeight += hotCitiesRect.height;

              console.log(`实际头部高度: ${actualHeaderHeight}rpx`);

              // 计算目标滚动位置 - 需要加上当前滚动位置
              const targetScrollTop =
                targetRect.top +
                scrollOffset.scrollTop -
                actualHeaderHeight -
                20;

              console.log(
                `目标滚动位置: ${targetScrollTop}, 元素绝对位置: ${
                  targetRect.top + scrollOffset.scrollTop
                }`
              );

              uni.pageScrollTo({
                scrollTop: Math.max(0, targetScrollTop),
                duration: 300,
                success: () => {
                  console.log(`✅ 成功滚动到字母 ${letter}`);
                  setTimeout(() => {
                    this.highlightTargetSection(letter);
                  }, 100);
                },
                fail: (err) => {
                  console.error("❌ 滚动失败:", err);
                  // 失败时尝试重试
                  this.retryScrollToLetter(letter);
                },
              });
            } else {
              console.warn(`❌ 未找到字母 ${letter} 对应的元素，尝试重新查询`);
              setTimeout(() => {
                this.retryScrollToLetter(letter);
              }, 200);
            }
          });
        });
    },

    // 重试滚动到指定字母
    retryScrollToLetter(letter) {
      console.log(`🔄 重试滚动到字母 ${letter}`);

      // 获取当前滚动位置
      uni
        .createSelectorQuery()
        .selectViewport()
        .scrollOffset()
        .exec((res) => {
          const scrollOffset = res[0];

          // 尝试通过不同的方式查找元素
          const query = uni.createSelectorQuery().in(this);

          // 先尝试查找所有字母组
          query.selectAll(".letter-group").boundingClientRect();
          query.select(".search-section").boundingClientRect();
          query.select(".location-section").boundingClientRect();
          query.select(".hot-cities-section").boundingClientRect();

          query.exec((results) => {
            const [rects, searchRect, locationRect, hotCitiesRect] = results;

            console.log("重试查询结果:", {
              letterGroups: rects ? rects.length : 0,
              search: searchRect,
              location: locationRect,
              hotCities: hotCitiesRect,
            });

            if (!rects || rects.length === 0) {
              console.warn("❌ 重试仍未找到任何字母组，尝试最近字母");
              this.scrollToNearestLetter(letter);
              return;
            }

            // 查找对应字母的索引
            const letterIndex = this.availableLetters.indexOf(letter);
            console.log(
              `字母 ${letter} 在可用字母中的索引: ${letterIndex}, 总共 ${rects.length} 个组`
            );
            console.log("可用字母列表:", this.availableLetters);

            if (
              letterIndex >= 0 &&
              letterIndex < rects.length &&
              rects[letterIndex]
            ) {
              const rect = rects[letterIndex];
              console.log(`字母 ${letter} 的位置信息:`, rect);

              // 计算实际的头部高度
              let actualHeaderHeight = 0;
              if (searchRect) actualHeaderHeight += searchRect.height;
              if (locationRect) actualHeaderHeight += locationRect.height;
              if (hotCitiesRect) actualHeaderHeight += hotCitiesRect.height;

              console.log(`重试计算的头部高度: ${actualHeaderHeight}rpx`);

              // 计算目标滚动位置
              const targetScrollTop =
                rect.top + scrollOffset.scrollTop - actualHeaderHeight - 30;

              console.log(`重试最终滚动位置: ${targetScrollTop}`);

              uni.pageScrollTo({
                scrollTop: Math.max(0, targetScrollTop),
                duration: 300,
                success: () => {
                  console.log(`✅ 重试成功滚动到字母 ${letter}`);
                  this.highlightTargetSection(letter);
                },
                fail: (err) => {
                  console.error(`❌ 重试滚动失败:`, err);
                  // 最后的备选方案：滚动到最近的字母
                  this.scrollToNearestLetter(letter);
                },
              });
            } else {
              console.warn(`❌ 重试也未找到字母 ${letter}，滚动到最近的字母`);
              this.scrollToNearestLetter(letter);
            }
          });
        });
    },

    // 显示滚动指示器
    showScrollingIndicator(letter) {
      // 在侧边栏显示当前选中的字母
      this.showLetterTip = true;

      // 添加触觉反馈
      if (uni.vibrateShort) {
        uni.vibrateShort({
          type: "light",
        });
      }
    },

    // 高亮目标区域
    highlightTargetSection(letter) {
      // 使用uni-app的方式添加临时高亮效果
      this.highlightedLetter = letter;

      // 1秒后移除高亮
      setTimeout(() => {
        this.highlightedLetter = "";
      }, 1000);
    },

    // 滚动到最近的字母
    scrollToNearestLetter(targetLetter) {
      const targetIndex = this.alphabetList.indexOf(targetLetter);
      if (targetIndex === -1) return;

      // 找到最近的可用字母
      let nearestLetter = null;
      let minDistance = Infinity;

      this.availableLetters.forEach((letter) => {
        const letterIndex = this.alphabetList.indexOf(letter);
        const distance = Math.abs(letterIndex - targetIndex);
        if (distance < minDistance) {
          minDistance = distance;
          nearestLetter = letter;
        }
      });

      if (nearestLetter) {
        console.log(
          `字母 ${targetLetter} 不存在，滚动到最近的字母 ${nearestLetter}`
        );
        this.scrollToLetter(nearestLetter);
      }
    },

    // 触摸开始
    handleTouchStart(letter) {
      this.currentLetter = letter;
      this.showLetterTip = true;
      this.isTouching = true;

      // 触摸反馈
      uni.vibrateShort({
        type: "light",
      });

      // 立即滚动到对应字母
      this.scrollToLetter(letter);
    },

    // 触摸移动 - 支持滑动选择
    handleTouchMove(event) {
      if (!this.isTouching) return;

      // 获取触摸位置相对于侧边栏的位置
      const touch = event.touches[0];
      const sidebarRect = event.currentTarget.getBoundingClientRect();

      // 计算触摸点在侧边栏中的相对位置
      const relativeY = touch.clientY - sidebarRect.top;
      const itemHeight = sidebarRect.height / this.availableLetters.length;
      const index = Math.floor(relativeY / itemHeight);

      if (index >= 0 && index < this.availableLetters.length) {
        const letter = this.availableLetters[index];

        if (letter && letter !== this.currentLetter) {
          this.currentLetter = letter;

          // 轻微的触觉反馈
          uni.vibrateShort({
            type: "light",
          });

          // 滚动到新字母
          this.scrollToLetter(letter);
        }
      }
    },

    // 触摸结束
    handleTouchEnd() {
      this.isTouching = false;

      // 延迟隐藏提示
      setTimeout(() => {
        this.showLetterTip = false;
        this.currentLetter = "";
      }, 800);
    },

    // 监听页面滚动，更新当前字母
    handlePageScroll() {
      if (this.isTouching || this.searchKeyword) return; // 触摸时或搜索时不更新

      // 获取当前可见的字母区域
      const query = uni.createSelectorQuery().in(this);

      this.availableLetters.forEach((letter) => {
        query.select(`#letter-${letter}`).boundingClientRect();
      });

      query.exec((rects) => {
        const viewportHeight = uni.getSystemInfoSync().windowHeight;
        const scrollTop = uni.getSystemInfoSync().scrollTop || 0;

        // 找到当前屏幕中央对应的字母
        const centerY = scrollTop + viewportHeight / 2;

        let currentVisibleLetter = "";
        let minDistance = Infinity;

        rects.forEach((rect, index) => {
          if (rect) {
            const letterCenterY = rect.top + rect.height / 2;
            const distance = Math.abs(letterCenterY - centerY);

            if (distance < minDistance) {
              minDistance = distance;
              currentVisibleLetter = this.availableLetters[index];
            }
          }
        });

        // 更新侧边栏的激活状态（不显示提示框）
        if (
          currentVisibleLetter &&
          currentVisibleLetter !== this.currentLetter
        ) {
          this.currentLetter = currentVisibleLetter;
        }
      });
    },

    // 获取高亮部分 - 安全的文本分割方式
    getHighlightedParts(city) {
      if (!this.searchKeyword) return [{ text: city, isHighlight: false }];

      const keyword = this.searchKeyword;
      const regex = new RegExp(`(${keyword})`, "gi");
      const parts = city.split(regex);

      return parts
        .map((part) => ({
          text: part,
          isHighlight: part.toLowerCase() === keyword.toLowerCase(),
        }))
        .filter((part) => part.text); // 过滤空字符串
    },

    // 获取城市拼音
    getCityPinyin(city) {
      // 简化版拼音映射 (实际项目中可以使用完整的拼音库)
      const pinyinMap = {
        北京: "Beijing",
        上海: "Shanghai",
        广州: "Guangzhou",
        深圳: "Shenzhen",
        天津: "Tianjin",
        重庆: "Chongqing",
        杭州市: "Hangzhou",
        南京市: "Nanjing",
        苏州市: "Suzhou",
        成都市: "Chengdu",
        武汉市: "Wuhan",
        西安市: "Xian",
        长沙市: "Changsha",
        沈阳市: "Shenyang",
        青岛市: "Qingdao",
        大连市: "Dalian",
        厦门市: "Xiamen",
        宁波市: "Ningbo",
        保定市: "Baoding",
        石家庄市: "Shijiazhuang",
        唐山市: "Tangshan",
      };

      return pinyinMap[city] || this.getCityFirstLetter(city);
    },

    // 选择当前定位城市
    selectCurrentLocation() {
      this.selectCity(this.currentCity);
    },

    // 选择城市
    selectCity(city) {
      console.log("选择城市:", city);

      // 保存选择的城市到本地存储
      uni.setStorageSync("selectedCity", city);

      // 显示选择结果
      uni.showToast({
        title: `已选择${city}`,
        icon: "success",
        duration: 1500,
      });

      // 延迟返回上一页，让用户看到选择结果
      setTimeout(() => {
        uni.navigateBack({
          success: () => {
            // 通知上一页更新城市信息
            uni.$emit("citySelected", city);
            console.log(`城市选择完成，返回上一页: ${city}`);
          },
          fail: (err) => {
            console.error("返回上一页失败:", err);
            // 如果返回失败，尝试跳转到生活缴费页面
            uni.navigateTo({
              url: "/pages/payment/payment",
              fail: () => {
                // 最后的备选方案，跳转到首页
                uni.switchTab({
                  url: "/pages/index/index",
                });
              },
            });
          },
        });
      }, 1500);
    },

    // 获取城市首字母
    getCityFirstLetter(city) {
      // 简化的拼音首字母映射
      const pinyinMap = {
        阿: "A",
        安: "A",
        北: "B",
        保: "B",
        包: "B",
        本: "B",
        蚌: "B",
        毕: "B",
        滨: "B",
        亳: "B",
        重: "C",
        成: "C",
        长: "C",
        常: "C",
        沧: "C",
        承: "C",
        朝: "C",
        潮: "C",
        郴: "C",
        池: "C",
        赤: "C",
        崇: "C",
        楚: "C",
        滁: "C",
        大: "D",
        丹: "D",
        德: "D",
        东: "D",
        定: "D",
        儋: "D",
        达: "D",
        迪: "D",
        鄂: "E",
        恩: "E",
        福: "F",
        佛: "F",
        抚: "F",
        阜: "F",
        防: "F",
        房: "F",
        广: "G",
        贵: "G",
        桂: "G",
        赣: "G",
        甘: "G",
        固: "G",
        果: "G",
        杭: "H",
        哈: "H",
        合: "H",
        海: "H",
        呼: "H",
        惠: "H",
        黄: "H",
        怀: "H",
        湖: "H",
        葫: "H",
        鹤: "H",
        河: "H",
        衡: "H",
        红: "H",
        淮: "H",
        济: "J",
        江: "J",
        嘉: "J",
        金: "J",
        荆: "J",
        九: "J",
        佳: "J",
        吉: "J",
        鸡: "J",
        揭: "J",
        晋: "J",
        锦: "J",
        焦: "J",
        酒: "J",
        昆: "K",
        开: "K",
        克: "K",
        喀: "K",
        兰: "L",
        洛: "L",
        连: "L",
        临: "L",
        柳: "L",
        六: "L",
        辽: "L",
        丽: "L",
        丽: "L",
        龙: "L",
        娄: "L",
        泸: "L",
        吕: "L",
        来: "L",
        莱: "L",
        廊: "L",
        拉: "L",
        乐: "L",
        绵: "M",
        马: "M",
        牡: "M",
        茂: "M",
        梅: "M",
        眉: "M",
        密: "M",
        南: "N",
        宁: "N",
        内: "N",
        怒: "N",
        那: "N",
        平: "P",
        濮: "P",
        盘: "P",
        萍: "P",
        攀: "P",
        青: "Q",
        泉: "Q",
        秦: "Q",
        齐: "Q",
        七: "Q",
        清: "Q",
        钦: "Q",
        黔: "Q",
        曲: "Q",
        衢: "Q",
        日: "R",
        瑞: "R",
        上: "S",
        深: "S",
        苏: "S",
        石: "S",
        沈: "S",
        绍: "S",
        三: "S",
        汕: "S",
        韶: "S",
        十: "S",
        双: "S",
        四: "S",
        松: "S",
        随: "S",
        商: "S",
        宿: "S",
        邵: "S",
        朔: "S",
        山: "S",
        汉: "S",
        天: "T",
        太: "T",
        台: "T",
        唐: "T",
        泰: "T",
        通: "T",
        铜: "T",
        图: "T",
        吐: "T",
        塔: "T",
        天: "T",
        武: "W",
        无: "W",
        温: "W",
        乌: "W",
        潍: "W",
        芜: "W",
        渭: "W",
        文: "W",
        梧: "W",
        五: "W",
        威: "W",
        乌: "W",
        西: "X",
        厦: "X",
        徐: "X",
        襄: "X",
        湘: "X",
        新: "X",
        信: "X",
        许: "X",
        咸: "X",
        孝: "X",
        忻: "X",
        邢: "X",
        兴: "X",
        宣: "X",
        雅: "X",
        银: "Y",
        扬: "Y",
        烟: "Y",
        宜: "Y",
        岳: "Y",
        玉: "Y",
        榆: "Y",
        运: "Y",
        营: "Y",
        益: "Y",
        永: "Y",
        伊: "Y",
        延: "Y",
        盐: "Y",
        郑: "Z",
        珠: "Z",
        中: "Z",
        株: "Z",
        淄: "Z",
        遵: "Z",
        张: "Z",
        湛: "Z",
        肇: "Z",
        镇: "Z",
        舟: "Z",
        周: "Z",
        驻: "Z",
        自: "Z",
        资: "Z",
      };

      const firstChar = city.charAt(0);
      return pinyinMap[firstChar] || "Z";
    },

    // 动态调整侧边栏位置，确保不遮挡热门城市
    adjustSidebarPosition() {
      setTimeout(() => {
        const query = uni.createSelectorQuery().in(this);
        query.select(".search-section").boundingClientRect();
        query.select(".location-section").boundingClientRect();
        query.select(".hot-cities-section").boundingClientRect();

        query.exec((results) => {
          const [searchRect, locationRect, hotCitiesRect] = results;

          let totalHeight = 0;
          if (searchRect) totalHeight += searchRect.height;
          if (locationRect) totalHeight += locationRect.height;
          if (hotCitiesRect) totalHeight += hotCitiesRect.height;

          // 添加大量额外间距，确保完全不遮挡（考虑margin/padding等）
          const sidebarTop = totalHeight + 120;

          console.log(`📐 动态计算侧边栏位置: ${sidebarTop}rpx`);

          // 在uni-app中，我们通过CSS变量或者动态类来实现
          // 这里我们记录计算出的值，可以在模板中使用
          this.dynamicSidebarTop = sidebarTop;
          console.log(`✅ 侧边栏位置已动态调整为: ${sidebarTop}rpx`);
          console.log(`📊 各区域高度详情:`, {
            搜索栏: searchRect?.height || 0,
            定位区域: locationRect?.height || 0,
            热门城市: hotCitiesRect?.height || 0,
            总高度: totalHeight,
            额外间距: 120,
            最终位置: sidebarTop,
          });

          // 如果计算出的位置太低，给出警告
          if (sidebarTop > 600) {
            console.warn(
              `⚠️ 侧边栏位置可能过低: ${sidebarTop}rpx，请检查页面布局`
            );
          }
        });
      }, 500);
    },

    // 调试方法：检查字母组是否正确渲染
    debugLetterGroups() {
      console.log("=== 🔍 调试字母组信息 ===");
      console.log("可用字母:", this.availableLetters);
      console.log("分组城市:", Object.keys(this.groupedCities));
      console.log("全部字母表:", this.alphabetList);

      // 检查所有字母组的DOM元素
      const query = uni.createSelectorQuery().in(this);
      query.selectAll(".letter-group").boundingClientRect();

      query.exec((results) => {
        const rects = results[0];
        console.log(`总共找到 ${rects ? rects.length : 0} 个字母组DOM元素`);

        if (rects) {
          rects.forEach((rect, index) => {
            const letter = this.availableLetters[index];
            console.log(
              `字母组 ${index}: ${letter} - 位置: ${rect.top}, 高度: ${rect.height}`
            );
          });
        }
      });

      // 单独检查每个字母的DOM元素
      this.availableLetters.forEach((letter, index) => {
        setTimeout(() => {
          const letterQuery = uni.createSelectorQuery().in(this);
          letterQuery
            .select(`#letter-${letter}`)
            .boundingClientRect()
            .exec((res) => {
              const rect = res[0];
              console.log(
                `🔍 字母 ${letter} (索引${index}) 元素:`,
                rect
                  ? `✅ 存在，位置: ${rect.top}, 高度: ${rect.height}`
                  : "❌ 不存在"
              );
            });
        }, index * 50); // 错开查询时间避免冲突
      });
    },
  },

  onLoad() {
    console.log("城市选择页面加载");
  },

  onReady() {
    // 监听城市选择事件
    uni.$on("citySelected", (city) => {
      console.log("接收到城市选择:", city);
    });

    // 监听页面滚动
    uni.onPageScroll((scrollInfo) => {
      this.handlePageScroll(scrollInfo);
    });

    // 动态调整侧边栏位置，确保不遮挡热门城市
    this.adjustSidebarPosition();

    // 调试：打印所有字母组的ID
    setTimeout(() => {
      this.debugLetterGroups();
    }, 1500);

    // 添加一个测试方法到全局，方便调试
    this.$nextTick(() => {
      // 将测试方法暴露到全局，方便在控制台调用
      if (typeof window !== "undefined") {
        window.testScrollToLetter = (letter) => {
          console.log(`🧪 测试滚动到字母: ${letter}`);
          this.scrollToLetter(letter);
        };
        console.log("✅ 测试方法已添加：window.testScrollToLetter('A')");

        // 添加调试侧边栏位置的方法
        window.showSidebarDebugInfo = () => {
          console.log(`🔍 当前侧边栏位置: ${this.dynamicSidebarTop}rpx`);
          console.log("🔍 重新计算位置...");
          this.adjustSidebarPosition();
        };
        console.log("✅ 调试方法已添加：window.showSidebarDebugInfo()");
      }
    });
  },

  onUnload() {
    // 移除事件监听
    uni.$off("citySelected");

    // 清理定时器
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }
    if (this.touchTimer) {
      clearTimeout(this.touchTimer);
    }
  },
};
</script>

<style scoped>
.city-select-page {
  min-height: 100vh;
  background: #f5f7fa;
  position: relative;
}

/* 搜索栏 */
.search-section {
  background: #fff;
  padding: 60rpx 30rpx 20rpx;
  border-bottom: 1rpx solid #eee;
}

.search-bar {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 24rpx;
  padding: 20rpx 24rpx;
  gap: 16rpx;
}

.search-icon {
  font-size: 28rpx;
  color: #999;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: #333;
  background: transparent;
  border: none;
  outline: none;
}

.search-input::placeholder {
  color: #999;
  font-size: 26rpx;
}

/* 当前定位 */
.location-section {
  background: #fff;
  border-bottom: 1rpx solid #eee;
}

.location-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
  gap: 20rpx;
  transition: all 0.3s ease;
}

.location-item:active {
  background: #f8f9fa;
}

.location-icon {
  font-size: 32rpx;
  color: #1890ff;
}

.location-text {
  flex: 1;
  font-size: 30rpx;
  color: #333;
}

.current-tag {
  font-size: 24rpx;
  color: #1890ff;
  background: #e6f7ff;
  padding: 8rpx 16rpx;
  border-radius: 12rpx;
}

/* 热门城市 */
.hot-cities-section {
  background: #fff;
  padding: 30rpx;
  border-bottom: 1rpx solid #eee;
}

.hot-cities-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.hot-city-item {
  flex: 0 0 calc(25% - 15rpx);
  background: #f8f9fa;
  border: 1rpx solid #e9ecef;
  border-radius: 12rpx;
  padding: 20rpx 0;
  text-align: center;
  transition: all 0.3s ease;
}

.hot-city-item:active {
  background: #e9ecef;
  transform: scale(0.98);
}

.hot-city-text {
  font-size: 26rpx;
  color: #333;
}

/* 城市列表 */
.city-list-section {
  flex: 1;
  display: flex;
  position: relative;
}

.city-content {
  flex: 1;
  background: #fff;
  padding-right: 60rpx; /* 为侧边栏留出空间 */
}

/* 字母索引侧边栏 */
.alphabet-sidebar {
  position: fixed;
  right: 20rpx;
  /* top值将通过动态计算设置，这里保留备用值 */
  top: 550rpx; /* 备用值：大幅增加高度确保绝对不遮挡热门城市 */
  bottom: 100rpx; /* 距离底部留出空间 */
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; /* 顶部对齐，避免侧边栏过长时遮挡 */
  transition: top 0.3s ease; /* 添加平滑过渡动画 */
}

.sidebar-container {
  background: rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10rpx);
  border-radius: 30rpx;
  padding: 16rpx 8rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.alphabet-item {
  width: 44rpx;
  height: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 22rpx;
  margin: 2rpx 0;
  transition: all 0.2s ease;
  position: relative;
}

.alphabet-item.active {
  background: #1890ff;
  transform: scale(1.3);
  box-shadow: 0 4rpx 16rpx rgba(24, 144, 255, 0.4);
  z-index: 10;
  border: 2rpx solid #fff;
}

.alphabet-text {
  font-size: 20rpx;
  font-weight: 600;
  color: #666;
  transition: color 0.2s ease;
}

.alphabet-item.active .alphabet-text {
  color: #fff;
}

/* 字母提示框 */
.letter-tip {
  position: fixed;
  right: 140rpx;
  top: 50%;
  transform: translateY(-50%) scale(0);
  background: #1890ff;
  color: #fff;
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 56rpx;
  font-weight: bold;
  box-shadow: 0 12rpx 40rpx rgba(24, 144, 255, 0.5);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 1000;
}

.letter-tip.show {
  transform: translateY(-50%) scale(1);
}

.letter-tip::after {
  content: "";
  position: absolute;
  right: -12rpx;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 12rpx solid #1890ff;
  border-top: 10rpx solid transparent;
  border-bottom: 10rpx solid transparent;
}

/* 滚动进度指示器 */
.scroll-progress {
  position: absolute;
  left: -8rpx;
  top: 0;
  width: 4rpx;
  height: 100%;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2rpx;
  overflow: hidden;
}

.progress-bar {
  width: 100%;
  background: linear-gradient(to bottom, #1890ff, #40a9ff);
  border-radius: 2rpx;
  transition: height 0.3s ease;
  box-shadow: 0 2rpx 4rpx rgba(24, 144, 255, 0.3);
}

.section-divider {
  background: #f5f5f5;
  color: #666;
  font-size: 26rpx;
  font-weight: 600;
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #eee;
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.divider-text {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.result-count,
.city-count {
  font-size: 22rpx;
  color: #999;
  font-weight: normal;
}

.sticky-header {
  backdrop-filter: blur(10rpx);
  background: rgba(255, 255, 255, 0.95);
}

/* 高亮闪烁效果 */
.section-divider.highlight-flash {
  background: linear-gradient(90deg, #1890ff, #40a9ff, #1890ff);
  color: #fff;
  animation: highlightPulse 1s ease-in-out;
}

@keyframes highlightPulse {
  0% {
    background: rgba(255, 255, 255, 0.95);
    color: #666;
  }
  50% {
    background: linear-gradient(90deg, #1890ff, #40a9ff, #1890ff);
    color: #fff;
    transform: scale(1.02);
  }
  100% {
    background: rgba(255, 255, 255, 0.95);
    color: #666;
  }
}

/* 字母组 */
.letter-group {
  position: relative;
}

.city-item {
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.city-item:active {
  background: #f8f9fa;
  transform: translateX(4rpx);
}

.city-item:last-child {
  border-bottom: none;
}

.city-name {
  font-size: 30rpx;
  color: #333;
  flex: 1;
}

.city-pinyin {
  font-size: 24rpx;
  color: #999;
  margin-left: 20rpx;
}

.city-first-letter {
  font-size: 22rpx;
  color: #ccc;
  font-weight: 600;
  width: 40rpx;
  text-align: center;
}

/* 搜索高亮 */
.city-name .highlight {
  background: #fff3cd;
  color: #856404;
  padding: 2rpx 4rpx;
  border-radius: 4rpx;
  font-weight: bold;
}

/* 无搜索结果 */
.no-result {
  padding: 100rpx 30rpx;
  text-align: center;
}

.no-result-text {
  font-size: 28rpx;
  color: #999;
}

/* 响应式适配 */
@media (max-width: 750rpx) {
  .hot-city-item {
    flex: 0 0 calc(25% - 15rpx);
  }
}

@media (max-width: 600rpx) {
  .hot-city-item {
    flex: 0 0 calc(33.333% - 14rpx);
  }
}

/* 页面加载动画 */
.city-select-page {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 0;
  background: transparent;
}

/* 增强的动画效果 */
.alphabet-item:hover {
  background: rgba(24, 144, 255, 0.1);
  transform: scale(1.1);
}

.city-item:hover {
  background: #f0f9ff;
  border-left: 4rpx solid #1890ff;
  padding-left: 26rpx;
}

/* 侧边栏滚动动画 */
.sidebar-container {
  animation: slideInRight 0.3s ease-out;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100rpx);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 字母组加载动画 */
.letter-group {
  animation: fadeInUp 0.4s ease-out;
}

.letter-group:nth-child(1) {
  animation-delay: 0.1s;
}
.letter-group:nth-child(2) {
  animation-delay: 0.15s;
}
.letter-group:nth-child(3) {
  animation-delay: 0.2s;
}
.letter-group:nth-child(4) {
  animation-delay: 0.25s;
}
.letter-group:nth-child(5) {
  animation-delay: 0.3s;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 搜索结果动画 */
.city-item {
  animation: slideInLeft 0.3s ease-out;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20rpx);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 点击反馈效果 */
.location-item:active,
.hot-city-item:active,
.city-item:active {
  opacity: 0.8;
}

/* 响应式适配 */
@media (max-width: 600rpx) {
  .city-content {
    padding-right: 50rpx;
  }

  .alphabet-sidebar {
    right: 10rpx;
    top: 530rpx; /* 小屏幕上也大幅增加高度确保绝对不遮挡热门城市 */
  }

  .sidebar-container {
    padding: 12rpx 6rpx;
  }

  .alphabet-item {
    width: 36rpx;
    height: 36rpx;
    margin: 1rpx 0;
  }

  .alphabet-text {
    font-size: 18rpx;
  }

  .letter-tip {
    width: 100rpx;
    height: 100rpx;
    font-size: 40rpx;
    right: 120rpx;
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .sidebar-container {
    background: rgba(255, 255, 255, 0.1);
  }

  .alphabet-text {
    color: #ccc;
  }

  .section-divider {
    background: #3a3a3a;
    color: #ccc;
  }

  .sticky-header {
    background: rgba(58, 58, 58, 0.95);
  }
}
</style>
