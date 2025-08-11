import Vue from 'vue'

export default () => {
  const requireComponent = require.context('./packages', true, /index.vue$/)

  requireComponent.keys().forEach(file => {
    const componentConfig = requireComponent(file)

    const components = componentConfig.default || componentConfig

    // 通过组件name确定组件标签名称
    Vue.component(components.name, components)
  })
}
