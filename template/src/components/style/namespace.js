// ------------------------------------------------------------------------------
// name: bem
// author: mudas( mschool.tech )
// created: 2020/11/24 17:08
// ------------------------------------------------------------------------------

const NAME_SPACE = 's-';

/**
 * 生成修改器类名列表
 * @param {string} name 目标元素名称
 * @param {string|string[]|object} mods 修改器或者列表
 * @returns {string[]}
 */
function gen(name, mods) {
  if (!mods) {
    return [];
  }

  // 单个修改器
  if (typeof mods === 'string') {
    return [`${name}--${mods}`];
  }

  // 以 item 列表来包含指定修改器列表
  if (Array.isArray(mods)) {
    return mods.reduce((ret, item) => [...ret, ...gen(name, item)], []);
  }

  // 以 key 做为类名，根据 mods[key] 是否为 true，来运行时包含修改器
  return Object.keys(mods).reduce(
    (ret, key) => [...ret, ...(mods[key] ? gen(name, key) : [])], []
  );
}

export function createBEM(name) {
  /**
   * 按需生成 BEM 规范的 class 列表
   * @param [string|string[]] el 子级 element 名称
   * @param [string|string[]|Object] 修改器列表
   * @example
   *
   * const bem = createBEM('s-root');
   *
   * // 仅父元素本身类名
   * bem()
   * // => 's-root'
   *
   * // 设置子元素类名
   * bem('child')
   * // => 's-root__child'
   *
   * // 设置子元素，并且携带修改器
   * bem('child', 'actived')
   * // => 's-root__child s-root__child--actived'
   *
   * // 设置子元素，并且携带修改器（数组结构多个修改器）
   * bem('child', ['actived', 'hot'])
   * // => 's-root__child s-root__child--actived s-root__child--hot'
   *
   * // 设置父元素和修改器
   * bem(['actived', 'hot'])
   * // => 's-root s-root--actived s-root--hot'
   */
  return function(el, mods) {
    if (el && typeof el !== 'string') {
      mods = el;
      el = '';
    }

    const parent = el ? `${name}__${el}` : name;
    const list = [parent];
    list.push(...gen(parent, mods));

    return list.join(' ');
  };
}

/**
 * 统一组件 BEM 规范类名及组件 name 属性
 * @param {string} name 组件名称
 * @param {string} [prefix='s-'] 自定义命名空间前缀
 * @example
 *
 * const bem = namespace('grid');
 *
 * // 仅父元素本身类名
 * bem()
 * // => 's-grid'
 *
 * // 设置子元素类名
 * bem('child')
 * // => 's-grid__child'
 *
 * // 设置子元素，并且携带修改器
 * bem('child', 'actived')
 * // => 's-grid__child s-grid__child--actived'
 *
 * // 设置子元素，并且携带修改器（数组结构多个修改器）
 * bem('child', ['actived', 'hot'])
 * // => 's-grid__child s-grid__child--actived s-grid__child--hot'
 *
 * // 设置父元素修改器
 * bem(['actived', 'hot'])
 * // => 's-grid s-grid--actived s-grid--hot'
 */
export function namespace(name, prefix = NAME_SPACE) {
  name = `${prefix}${name}`;
  return createBEM(name);
}
