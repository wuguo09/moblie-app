<template>
	<article class="lazy-query-list">
		<query-form v-if="queryConfig" ref="queryRef" v-bind="queryConfig" @search="query" @reset="query"></query-form>
		<LazyList ref="list" v-bind="props" :queryParams="myQueryParams">
			<template v-for="item in Object.keys($slots)" :key="item" #[item]="data">
				<slot v-bind="data" :name="item"></slot>
			</template>
		</LazyList>
	</article>
</template>
<script lang="ts" setup>
	import LazyList from "./lazy-list.vue"
	import QueryForm from "../query-form/query-form.vue"
	import { lazyQueryListProps } from "./interface"
	import { computed, ref, nextTick } from "vue"
	const props = defineProps(lazyQueryListProps)
	const myQueryParams = ref({})
	const height = computed(() => (props.queryConfig ? "100px" : "5px"))
	const list = ref<InstanceType<typeof LazyList>>()
	const queryRef = ref<InstanceType<typeof QueryForm>>()
	function query(formData : any) {
		myQueryParams.value = formData
		nextTick(() => {
			list.value && list.value.search()
		})
	}
	function reset() {
		queryRef.value?.resetAll()
	}
	defineExpose({
		reset
	})
</script>
<style lang="scss" scoped>

	.lazy-query-list {
		height: 100%;
	}

	.lazy-list {
		height: calc(100% - v-bind("height"));
	}

	.list {
		height: 100%;
		overflow-y: auto;
		padding: 8px;
	}

	.search-hearch {
		width: 100%;
		height: 50px;
		background: #f5f6f8;
		box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.05);
		padding: 9px 16px;
	}

	.null {
		margin-top: 100px;
	}

	.refresh-wrapper {
		overflow-y: auto;
	}
</style>