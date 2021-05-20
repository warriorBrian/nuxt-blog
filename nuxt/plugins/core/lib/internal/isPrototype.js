import typeOf from "./../typeOf";
/**
 * 检查value值是否为原型对象
 * 如果函数或者方法调用之前带有关键字new，它就构成构造函数调用 <JavaScript权威指南 8.2.3>
 * 构造函数调用创建一个新的空对象，这个对象集成自构造函数的prototype属性
 * 如果传入的值为false, 现在的isPrototype函数得到的proto也为false,最终结果会返回true
 * 这明显不符合预期，因此这里用Object.prototype来做守卫，把控临界值。
 * @param {*} value The value to check
 * */

function isPrototype (value) {
  const ctor = value && value.constructor;
  const proto = (typeOf(value) === 'function' && ctor.prototype) || Object.prototype;
  return Object.is(value, proto);
}

export default isPrototype;
