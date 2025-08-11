<!-- eslint-disable vue/require-default-prop -->
<script>
export default {
  name: 'DRender',
  functional: true,
  props: {
    scope: Object,
    render: Function
  },
  render: (h, ctx) => {
    return ctx.props.render ? ctx.props.render(ctx.props.scope, h) : ''
  }
}
</script>
