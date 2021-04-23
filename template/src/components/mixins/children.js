// ------------------------------------------------------------------------------
// name: children
// author: mudas( mschool.tech )
// created: 2020/12/14 16:40
// ------------------------------------------------------------------------------

export default {
  computed: {

    /**
     * 当前组件在父级容器中的自然顺序
     * <p>一般在设计子组件时使用该混合方法</p>
     * @return {number}
     */
    index() {
      const children = this.$parent.$children;
      return children.findIndex(vnode => this._uid === vnode._uid);
    }

  }
};
