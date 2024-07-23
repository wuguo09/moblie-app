<template>
	<div class="tag-radio">
		<div class="tag" :class="{active:isActive(item.value)}" v-for="item in options" @click="select(item.value)"
			:key="item.value">{{item.label}}</div>
	</div>
</template>

<script lang="ts" setup>
	import { cloneDeep, isArray } from 'lodash';
	import { tagRadioProps } from './interface';
	const props = defineProps(tagRadioProps)
	const emits = defineEmits(['update:modelValue', 'change'])

	const isActive = (val : string | number) => {
		if(props.modelValue){
				if (props.multiple) return props.modelValue.includes(val)
				return props.modelValue === val
		}
		return false
		
	}
	function select(val : string | number) {
		if (props.multiple) {
			if (isArray(props.modelValue)) {
				const newVal = cloneDeep(props.modelValue)
				//存在删除
				if (newVal.includes(val)) {
					emits('update:modelValue', newVal.filter(item => item !== val))
				} else {//不存在加入
					newVal.push(val)
					emits('update:modelValue', newVal)
				}
			} else if (props.modelValue) {
				if (val === props.modelValue) {
					emits('update:modelValue', [])
				} else {
					emits('update:modelValue', [val])
				}

			} else {
				emits('update:modelValue', [val])
			}
		} else {
			if (props.modelValue === val) {
				emits('update:modelValue', '')
			} else {
				emits('update:modelValue', val)
			}

		}
	}
</script>

<style lang="scss" scoped>
	.tag-radio {
		display: flex;
		align-items: center;
		gap: 8px;
		flex-wrap: wrap;
		justify-content:flex-start;
	}

	.tag {
		width: 100px;
		height: 30px;
		border-radius: 610px;
		opacity: 1;
		line-height: 30px;
		box-sizing: border-box;
		color: rgba(0, 0, 0, 0.85);
		border: 1px solid rgba(0, 0, 0, 0.3);

		&.active {
			color: #2FA586;
			background: rgba(47, 165, 134, 0.1);
			border: 1px solid rgba(47, 165, 134, 0.5);
		}
	}
</style>