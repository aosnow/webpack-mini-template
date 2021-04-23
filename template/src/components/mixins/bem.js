// ------------------------------------------------------------------------------
// name: bem
// author: mudas( mschool.tech )
// created: 2020/11/24 19:44
// ------------------------------------------------------------------------------

/**
 * BEM 规范组件名和类名辅助
 * @param namespace
 * @return {{methods:{bem:Function}, name:String}}
 */
export default function(namespace) {
  const bem = namespace;

  return {
    name: bem(),
    methods: {
      bem
    }
  };
}
