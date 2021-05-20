import { debounce } from '@/plugins/core/lib';
export default {
  data () {
    return {
      $_resizeHandler: null
    }
  },
  mounted () {
    this.$_resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize();
      }
    }, 100);
    this.$_initResizeHandle();
  },
  activated () {
    this.$_initResizeHandle();
  },
  deactivated () {
    this.$_destoryResizeHandle();
  },
  methods: {
    $_initResizeHandle () {
      window.addEventListener('resize', this.$_resizeHandler);
    },
    $_destoryResizeHandle () {
      window.removeEventListener('resize', this.$_resizeHandler);
    }
  },
  beforeDestroy () {
    this.$_destoryResizeHandle();
  }
}
