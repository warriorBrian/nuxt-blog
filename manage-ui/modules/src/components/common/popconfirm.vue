<script>
import { Popconfirm } from 'element-ui'

export default {
  extends: Popconfirm,
  methods: {
    confirm () {
      this.visible = false;
      this.$emit('onConfirm');
    },
    cancel () {
      this.visible = false;
      this.$emit('onCancel')
    }
  },
  mounted () {

  }
}
</script>

<style scoped>

</style>
