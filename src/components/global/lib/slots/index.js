const modules = {}
const requireComponent = require.context('../slots', true, /.vue$/)

requireComponent.keys().forEach(file => {
  const componentConfig = requireComponent(file)
  const components = componentConfig.default || componentConfig

  modules[components.name] = components
})

export default modules
