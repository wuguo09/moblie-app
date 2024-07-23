import type { PropType } from "vue";

export interface ITagRadioProps {
	modelValue : number | string | string[] | number[],
	options : {
		label : string,
		value : string | number
	}[],
	multiple : boolean
}
export const tagRadioProps = {
	modelValue: {
		type: [String, Array, Number] as PropType<ITagRadioProps['modelValue']>,
		default: ''
	},
	options: {
		type: Array as PropType<ITagRadioProps['options']>,
		default: () => []
	},
	multiple: {
		type: Boolean as PropType<ITagRadioProps['multiple']>,
		default:false
	}
}