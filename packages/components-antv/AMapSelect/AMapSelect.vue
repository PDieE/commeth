<template>
  <Select
    v-bind="selectProps"
    class="w-full"
    :value="modelValue?.formattedAddress || modelValue?.address"
    :open="false"
    placeholder="从地图选择地址"
    @dropdownVisibleChange="handleDropdownVisibleChange"
  >
    <template #suffixIcon>
      <CeIconifyIcon icon="tdesign:location-1" />
    </template>
  </Select>

  <!-- 地址选择 -->
  <Modal
    v-model:open="open"
    title="地址选择"
    :width="width"
    destroyOnClose
    @cancel="mapClear()"
    @ok="confirm()"
  >
    <div class="w-full relative" :style="{ height: mapHeight }">
      <div ref="mapRef" class="size-full" />
      <InputGroup class="absolute top-2 left-2 w-80 flex" compact>
        <Cascader
          v-model:value="city"
          class="w-26"
          :options="districts"
          :fieldNames="{
            label: 'name',
            value: 'adcode',
            children: 'districts',
          }"
          :displayRender="({ labels }) => labels[labels.length - 1]"
          placeholder="选择城市"
          :allowClear="false"
          :status="undefined"
          @change="selectDistrict"
        />
        <AutoComplete
          class="flex-1"
          v-model:value="poiSearchKey"
          :options="poiList"
          :fieldNames="{ label: 'name', value: 'name' }"
          placeholder="搜索位置、地点"
          :status="undefined"
          @search="searchPoi"
          @select="selectPoi"
        />
      </InputGroup>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { useAsyncData } from "@commeth/hooks";
import { AMapService } from "@commeth/utils";
import {
  AutoComplete,
  Cascader,
  Form,
  InputGroup,
  message,
  Modal,
  Select,
} from "ant-design-vue";
import { LabeledValue } from "ant-design-vue/es/select";
import {
  DefaultOptionType,
  ValueType,
} from "ant-design-vue/es/vc-cascader/Cascader";
import { cloneDeep } from "es-toolkit";
import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  shallowRef,
  toValue,
  useTemplateRef,
} from "vue";

import { CeIconifyIcon } from "../index";
import { District, districts } from "./districts";
import MarkPng from "./mark.png";
import { AMapSelectProps, AMapValue } from "./types";

const formItemContext = Form.useInjectFormItemContext();

const modelValue = defineModel<AMapValue>("modelValue");
const {
  width = "90%",
  height = "calc(100vh - 320px)",
  selectProps,
  aMap,
  defaultAddress,
} = defineProps<AMapSelectProps>();
const emits = defineEmits<{
  change: [value: AMapValue];
}>();

onBeforeUnmount(() => {
  mapClear();
});

/**
 * ====================
 *       基本逻辑
 * ====================
 */
const mapHeight = computed(() => {
  if (typeof height === "number") return `${height}px`;
  return height;
});

const open = shallowRef(false);
/**
 * 处理选择器下拉框可见性变化
 * @param visible 下拉框是否可见
 */
function handleDropdownVisibleChange(visible: boolean) {
  if (!visible) return;
  selectedPoi.value = cloneDeep(modelValue.value);
  open.value = visible;
  nextTick(() => renderMap());
}
/** 确认选择 */
function confirm() {
  if (!selectedPoi.value) {
    message.warn("您还未选择任何位置");
    return;
  }
  modelValue.value = cloneDeep(selectedPoi.value);
  emits("change", cloneDeep(selectedPoi.value));
  open.value = false;
  mapClear();
  formItemContext.onFieldChange();
}
/** 地图清除 */
function mapClear() {
  if (marker) {
    map?.remove(marker);
    marker = undefined;
  }
  map?.destroy();
  map = undefined;
}

/**
 * ====================
 *       地图选点
 * ====================
 */
const selectedPoi = ref<AMapValue>();
/** 获取高德地图实例 */
function getAMap() {
  if (aMap) return toValue(aMap);

  return AMapService.AMap();
}
const mapRef = useTemplateRef("mapRef");
let map: AMap.Map | undefined;
/** 渲染地图 */
async function renderMap() {
  if (!mapRef.value) return;
  const aMap = getAMap();

  map = new aMap.Map(mapRef.value, { zoom: 11, pitch: 0, viewMode: "3D" });
  map.on("click", mapClick);

  if (
    selectedPoi.value &&
    selectedPoi.value.latitude &&
    selectedPoi.value.longitude
  ) {
    // 如果存在坐标则设置地图中心和缩放级别
    setMarkerBySelectedPoi();
  } else if (defaultAddress) {
    // 不存在坐标则通过默认地址获取定位
    setMarkerByDefaultAddress();
  }

  // 城市初始化
  if (selectedPoi.value && selectedPoi.value.adcode && selectedPoi.value.city) {
    // 存在 adcode 和 city 则直接使用
    city.value = computeCityCode(selectedPoi.value.adcode);
    cityName.value = computeCityName(
      selectedPoi.value.city,
      selectedPoi.value.province,
    );
  } else if (
    selectedPoi.value &&
    selectedPoi.value.latitude &&
    selectedPoi.value.longitude
  ) {
    // 不存在 存在 adcode 和 city 则通过逆地理编码获取
    if (!aMap.Geocoder) {
      await AMapService.plugin("AMap.Geocoder");
    }
    const geocoder = new aMap.Geocoder({
      extensions: "all",
    });
    geocoder.getAddress(
      new aMap.LngLat(selectedPoi.value.longitude, selectedPoi.value.latitude),
      (status, result) => {
        if (status !== "complete" || typeof result === "string") {
          message.error(`初始化获取位置信息失败：${result}（${status}）`);
          console.warn("初始化获取位置信息失败", status, result);
          return;
        }

        const {
          adcode,
          province,
          city: addressCity,
        } = result.regeocode.addressComponent;

        city.value = computeCityCode(adcode);
        cityName.value = computeCityName(addressCity, province);
      },
    );
  } else {
    // 什么都没有则通过城市搜索获取当前所在城市
    if (!aMap.CitySearch) {
      await AMapService.plugin("AMap.CitySearch");
    }

    const citySearch = new aMap.CitySearch();
    citySearch.getLocalCity(function (status, result) {
      if (status !== "complete" || typeof result === "string") {
        message.error(`获取当前所在城市失败：${result}（${status}）`);
        console.warn("获取当前所在城市失败", status, result);
        return;
      }
      city.value = computeCityCode(result.adcode);
      cityName.value = computeCityName(result.city, result.province);
    });
  }
}
/** 通过已选中的位置设置标记 */
function setMarkerBySelectedPoi() {
  if (
    !selectedPoi.value ||
    !selectedPoi.value.longitude ||
    !selectedPoi.value.latitude
  ) {
    return;
  }
  const aMap = getAMap();

  map!.setZoom(14);
  map!.setCenter([selectedPoi.value.longitude, selectedPoi.value.latitude]);

  setTimeout(() => {
    setMarker({
      position: new aMap.LngLat(
        selectedPoi.value!.longitude!,
        selectedPoi.value!.latitude!,
      ),
      label: {
        content:
          selectedPoi.value!.address || selectedPoi.value!.formattedAddress,
      },
    });
  }, 1000);
}
/** 通过默认地址设置标记 */
async function setMarkerByDefaultAddress() {
  if (!defaultAddress) {
    return;
  }
  const aMap = getAMap();

  if (!aMap.Geocoder) {
    await AMapService.plugin("AMap.Geocoder");
  }
  const geocoder = new aMap.Geocoder({ extensions: "all" });
  geocoder.getLocation(defaultAddress, (status, result) => {
    if (
      status !== "complete" ||
      typeof result === "string" ||
      !result.geocodes.length
    ) {
      console.warn("默认地址定位失败", status, result);
      return;
    }

    const geocode = result.geocodes[0];
    geocoder.getAddress(geocode.location, (status, result) => {
      if (status !== "complete" || typeof result === "string") {
        console.warn("默认地址定位, 获取位置信息失败", status, result);
        return;
      }

      const { formattedAddress } = result.regeocode;
      const {
        adcode,
        province,
        city: addressCity,
        district,
        township,
      } = result.regeocode.addressComponent;
      const address = formattedAddress
        .replace(
          new RegExp(
            [province, addressCity, district, township]
              .filter(Boolean)
              .join("|"),
            "g",
          ),
          "",
        )
        .trim();

      setMarker({
        position: geocode.location,
        label: { content: address },
      });

      map!.setCenter(geocode.location);
      map!.setZoom(Math.max(map!.getZoom(), 14));

      selectedPoi.value = {
        adcode,
        province,
        city: addressCity,
        district,
        township,
        address,
        formattedAddress,
        longitude: geocode.location.getLng(),
        latitude: geocode.location.getLat(),
      };

      city.value = computeCityCode(adcode);
      cityName.value = computeCityName(addressCity, province);
    });
  });
}
/**
 * 地图点击事件
 * @param e 事件数据
 */
async function mapClick(e: { lnglat: AMap.LngLat }) {
  if (!map) return;

  const aMap = getAMap();
  setMarker({
    position: e.lnglat,
    label: { content: "正在获取位置信息" },
  });

  map.setCenter(e.lnglat);
  map.setZoom(Math.max(map.getZoom(), 14));

  if (!aMap.Geocoder) {
    await AMapService.plugin("AMap.Geocoder");
  }
  const geocoder = new aMap.Geocoder({
    extensions: "all",
  });
  geocoder.getAddress(e.lnglat, (status, result) => {
    if (status !== "complete" || typeof result === "string") {
      setMarker({
        label: { content: "获取位置信息失败" },
      });

      message.error(`获取位置信息失败：${result}（${status}）`);
      console.warn("获取位置信息失败", status, result);
      return;
    }

    const { formattedAddress } = result.regeocode;
    const {
      adcode,
      province,
      city: addressCity,
      district,
      township,
    } = result.regeocode.addressComponent;
    const address = formattedAddress
      .replace(
        new RegExp(
          [province, addressCity, district, township].filter(Boolean).join("|"),
          "g",
        ),
        "",
      )
      .trim();

    setMarker({
      label: { content: address },
    });

    selectedPoi.value = {
      adcode,
      province,
      city: addressCity,
      district,
      township,
      address,
      formattedAddress,
      longitude: e.lnglat.getLng(),
      latitude: e.lnglat.getLat(),
    };

    city.value = computeCityCode(adcode);
    cityName.value = computeCityName(addressCity, province);
  });
}

/**
 * ====================
 *       地图搜索
 * ====================
 */
const city = shallowRef<string[]>();
const cityName = shallowRef<string>();
/**
 * 选择城市
 * @param v 选择的值
 * @param options 选项数据
 */
function selectDistrict(
  v: ValueType,
  options: DefaultOptionType[] | DefaultOptionType[][],
) {
  const option = options[options.length - 1] as District;
  cityName.value = computeCityName(option.name);
  searchPoi(cloneDeep(poiSearchKey.value));

  if (!map) return;
  map.setCenter(option.center.split(",").map(Number) as [number, number]);
  map.setZoom(Math.min(map.getZoom(), 11));
}
const poiSearchKey = shallowRef("");
const { data: poiList, execute: searchPoiList } = useAsyncData(
  async () => {
    const aMap = getAMap();
    if (!aMap.PlaceSearch) {
      await AMapService.plugin("AMap.PlaceSearch");
    }
    const placeSearch = new aMap.PlaceSearch({
      city: cityName.value,
      extensions: "all",
    });

    if (!poiSearchKey.value) return Promise.resolve([]);
    return new Promise<AMap.PlaceSearch.Poi[]>((resolve, reject) => {
      placeSearch.search(poiSearchKey.value, (status, result) => {
        // 空数据不算报错
        if (status === "no_data") return resolve([]);

        if (status !== "complete" || typeof result === "string") {
          message.error(`搜索地点失败：${result}（${status}）`);
          console.warn("搜索地点失败", status, result);
          return reject(new Error(result.toString()));
        }

        resolve(result.poiList.pois);
      });
    });
  },
  {
    immediate: false,
    debounce: { ms: 500 },
  },
);
/**
 * 搜索 POI
 * @param v 搜索关键词
 */
function searchPoi(v: string) {
  poiList.value = [];
  if (!v) return;
  searchPoiList();
}
/**
 * 选择 POI
 * @param v 选择的值
 * @param option 选项数据
 */
async function selectPoi(
  v: string | number | LabeledValue,
  option: DefaultOptionType,
) {
  const aMap = getAMap();
  const {
    adcode,
    pname: province,
    cityname: addressCity,
    adname: district,
    address,
    name,
    location,
  } = option;

  if (!aMap.Geocoder) {
    await AMapService.plugin("AMap.Geocoder");
  }
  const geocoder = new aMap.Geocoder({
    extensions: "all",
  });
  geocoder.getAddress(location, (status, result) => {
    if (status !== "complete" || typeof result === "string") {
      message.error(`获取位置信息失败：${result}（${status}）`);
      console.warn("获取位置信息失败", status, result);
      return;
    }

    setMarker({
      position: location,
      label: { content: `${address}${name}` },
    });
    map?.setCenter(location);
    map?.setZoom(Math.max(map.getZoom(), 14));

    const { township } = result.regeocode.addressComponent;
    selectedPoi.value = {
      adcode,
      province,
      city: addressCity,
      district,
      township,
      address: `${address}${name}`,
      formattedAddress: `${province}${addressCity}${district}${township}${address}${name}`,
      longitude: location.getLng(),
      latitude: location.getLat(),
    };

    city.value = computeCityCode(adcode);
    cityName.value = computeCityName(addressCity, province);
  });
}

/**
 * ====================
 *       地图标记
 * ====================
 */
let icon: AMap.Icon;
let marker: AMap.Marker | undefined;
function setMarker(
  opt: Omit<AMap.Marker.Options, "icon" | "label"> & {
    label?: Omit<AMap.Marker.Options["label"], "offset" | "direction">;
  },
) {
  const aMap = getAMap();
  if (!icon) {
    icon = new aMap.Icon({
      image: MarkPng,
      imageSize: new aMap.Size(19, 32),
    });
  }

  // 第一次的话直接创建
  if (!marker) {
    marker = new aMap.Marker({
      icon,
      ...opt,
      label: opt.label
        ? {
            content: "",
            ...opt.label,
            offset: new aMap.Pixel(0, -5),
            direction: "top",
          }
        : undefined,
    });

    map?.add(marker);
  }

  if (opt.label) {
    marker.setLabel({
      content: "",
      ...opt.label,
      offset: new aMap.Pixel(0, -5),
      direction: "top",
    });
  }

  if (opt.position) {
    let position: [number, number];
    if (Array.isArray(opt.position)) {
      position = opt.position;
    } else {
      position = [opt.position.getLng(), opt.position.getLat()];
    }
    marker.setPosition(position);
  }
}

/**
 * ====================
 *        工具
 * ====================
 */
/**
 * 处理城市名称
 * @param name 城市名称
 * @param downgrade 降级名称
 */
function computeCityName(name: string, downgrade?: string) {
  const res =
    {
      北京城区: "北京市",
      天津城区: "天津市",
      重庆城区: "重庆市",
      重庆郊县: "重庆市",
      上海城区: "上海市",
    }[name] || name;
  return res || downgrade;
}
/**
 * 处理城市代码
 * @param adcode 城市代码
 */
function computeCityCode(adcode: string) {
  // 海口市、三亚市、三沙市、儋州市是海南的地级市
  if (
    adcode.startsWith("4601") ||
    adcode.startsWith("4602") ||
    adcode.startsWith("4603") ||
    adcode.startsWith("4604")
  ) {
    return [`${adcode.slice(0, 2)}0000`, `${adcode.slice(0, 4)}00`];
  }
  // 海南的其他二级地区都不是地级市
  if (adcode.startsWith("46")) {
    return [`${adcode.slice(0, 2)}0000`, adcode];
  }
  return [`${adcode.slice(0, 2)}0000`, `${adcode.slice(0, 4)}00`];
}
</script>

<style scoped></style>
