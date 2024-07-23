import { isFunction } from "lodash";
import type { ComputedRef, InjectionKey, Ref } from "vue";

export function renderField(data: any, field: string | Function) {
  if (isFunction(field)) return field(data);
  return data[field as string] || "";
}

export const treeSelectKey = Symbol() as InjectionKey<{
  changeSelect(data: any): void;
  selectsKeys: ComputedRef<string[]>;
  expandKeys:Ref<string[]>
}>;

/**根据数组 */
export function searchTree(
  tree: any[],
  key: string | Function,
  childrenKey: string | Function,
  arr: string[]
) {
  const result = [];
  function traverse(node) {
    const value = renderField(node, key);
    if (value && arr.includes(value)) {
      result.push(node);
    }
    if (Array.isArray(renderField(node, childrenKey))) {
      renderField(node, childrenKey).forEach(traverse);
    }
  }
  tree.forEach(traverse);
  return result;
}

export function filterTree(
  tree: any[],
  key: string | Function,
  childrenKey: string | Function,
  keyword: string
) {
  if (!keyword) return tree;
  // function traverse(tree) {
  //   const result = [];
  //   tree.forEach(item=>{
  //     if(  )
  //   })
  //   const label = renderField(node, key);
  //   if (label && label.includes(keyword)) {
  //     result.push(node);
  //   }
  //   if (Array.isArray(renderField(node, childrenKey))) {
  //     renderField(node, childrenKey).forEach(traverse);
  //   }
  // }
  // return traverse(tree);
}
