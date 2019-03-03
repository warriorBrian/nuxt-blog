const click = require('./../geet/click');
let geet = async (ctx) => {
    try {
        let result = await click.register(null)
        if (!result.success) {
            ctx.session.fallback = true;    // 检查服务器是否可以访问
            ctx.body = data
        } else {
            ctx.session.fallback = false;
            ctx.body = result
        }
    } catch (e) {
        ctx.body = e
    }
}

module.exports = {
    geet
}
