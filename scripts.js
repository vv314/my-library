var Fish = {
  /**
   * 返回指定精度整型随机数
   * @param  {[int]} min 左边距
   * @param  {[int]} max 右边距
   * @return {[int]}     
   */
  random: function(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },

  /**
   * 选择器
   * @return {Element}          匹配元素
   */
  q: function() {
    return document.querySelector.apply(document, arguments);
  },

  /**
   * 获取Cookie
   * @param  {String} name cookie名称
   * @return {String} 
   */
  getCookie: function(name) {
    var reg, value;
    reg = new RegExp(name + '=(.*?)($|;)');
    value = reg.exec(document.cookie);
    return value == null ? '' : decodeURI(value[1]);
  },

  /**
   * 设置Cookie
   * @param {String} name cookie名
   */
  setCookie: function(name, value) {
    var Days = 15; // 有效期1天
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + '=' + encodeURIComponent(value) + ';expires=' + exp.toGMTString() + ';path=/';
  },

  /**
   * 删除Cookie
   * @param {String} name cookie名
   */
  delCookie: function(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = this.getCookie(name);
    if (cval !== null) {
      document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString();
    }
  },

  /**
   * 邮箱验证
   * @param  {String} email email地址
   * @return {Boolean}
   */
  vaildEmail: function(email) {
    var emailRegex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return emailRegex.test(email);
  },

  /**
   * 改变地址栏历史状态
   * @param {String} url
   */
  pushUrlState: function(url) {
    if (history.pushState) {
      history.pushState({
        title: url
      }, url, url);
    }
  },

  /**
   * 改变地址栏当前状态
   * @param {String} url
   */
  replaceUrlState: function(url) {
    if (history.replaceState) {
      history.replaceState({
        title: url
      }, url, url);
    }
  },

  /**
   * 替换\n换行符
   * @param  {String} selector 元素id
   */
  replaceToBr: function(selector) {
    var ele = this.q(selector),
        text = ele.textContent;
    ele.innerHTML = text.replace(/\n/g, '<br>');
  },

  /**
   * 获取url参数
   * @param  {String} name 参数名
   * @return {String}      参数值
   */
  getUrlParam: function(name) {
    var reg, value;
    reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    value = window.location.search.substr(1).match(reg);
    return value === null ? null : decodeURI(value[2]);
  },

  /**
   * 判断是否为微信浏览器
   * @return {Boolean}
   */
  isWechat: function() {
    var ua = navigator.userAgent.toLowerCase();
    return ua.match(/MicroMessenger/i) === 'micromessenger';
  },

  /**
   * 字符串超出截取，以省略号结尾
   * @param  {String} str    待截取字符串
   * @param  {Number} length 长度
   * @return {String}        截取结果
   */
  limitStr: function(str, length) {
    return str.length > length ? (str.substr(0, length) + '...') : str;
  },

  /**
   * 获取服务器时间
   * @param  {Function} fn 回调函数
   * @return 
   */
  serverTime: function(fn) {
    var xhr = new XMLHttpRequest();
    if (!xhr) {
      /* global ActiveXObject */
      xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    xhr.open('HEAD', location.href, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
        fn(new Date(xhr.getResponseHeader('Date')));
      }
    };
    xhr.send(null);
  },

  /**
   * input空值验证
   * @param {jQuery Object} $inputs input对象
   */
  emptyValid: function ($inputs) {
    for (var item in $inputs) {
      if ($inputs[item].val() === '') {
        alert('请输入' + item);
        return true;
      }
    }
  },

  isApp: function (appStr) {
    var ua = navigator.userAgent.toLowerCase();
    return Debug ? true : (ua.indexOf(appStr) < 0 ? false : true);
  },

  log: function() {
    Debug && console.log.apply(console, arguments);
  },

  /**
   * 轮询
   * @param  {Function}   conditionFn  条件函数
   * @param  {Function} callback    回调函数
   * @param  {Number} spend    间隔时间
   */
  polling: function (conditionFn, callback, spend) {
    var t = spend || 200;
    if (conditionFn()) {
      console.log('polling done');
      callback();
    } else {
      setTimeout(function() {
        this.polling(conditionFn, callback);
      }.bind(this), t);
    }
  },

  /**
   * 设置/获取localStorage
   * 当value缺省时为获取数据, value为对象时执行序列化
   * @param  {String} name  数据名
   * @param  {String} value 数据项
   */
  storage: function(name, value) {
    var data = '';
    if (typeof(value) === 'undefined') {
      data = localStorage.getItem(name);
      try {
        return JSON.parse(data);
      } catch (e) {
        return data;
      }
    } else {
      localStorage.setItem(name, typeof(value) === 'object' ? JSON.stringify(value) : value);
    }
  },

  sessionStorage: function(name, value) {
    var data = '';
    if (typeof(value) === 'undefined') {
      data = sessionStorage.getItem(name);
      try {
        return JSON.parse(data);
      } catch (e) {
        return data;
      }
    } else {
      sessionStorage.setItem(name, typeof(value) === 'object' ? JSON.stringify(value) : value);
    }
  },

  /**
   * 触摸状态
   * @param  {Boolean} flag 状态标识
   * @param  {Object} ele  作用域元素
   */
  touchState: function(flag, ele) {
    var wheight = document.documentElement.clientHeight;
    if (ele) {
      if (flag) {
        $(ele).css({
          overflow: 'auto',
          height: 'auto'
        });
      } else {
        $(ele).css({
          overflow: 'hidden',
          height: wheight + 'px'
        });
      }
    } else {
      if (flag) {
        $('html').removeClass('html-unscrollable');
      } else {
        $('html').addClass('html-unscrollable');
      }
    }
  },

  /**
   * 分隔价格，生成小样式
   * @param  {Nunber} price 价格
   * @return {String}       结果
   */
  splitPrice: function(price, decimal) {
    var pArr = String(price).split('.');
    var res = '￥';
    if (pArr.length > 1) {
      res += '<span>' + pArr[0] + '</span>.' + pArr[1];
    } else {
      res += '<span>' + pArr[0] + '</span>.00';
    }
    return res;
  },

  /**
   * 初始化百度地图
   * @param  {Number} x 经度
   * @param  {Number} y 纬度
   * @param  {Number} zoom 放大倍数
   * @return 
   */
  initMap: function (option) {
    var zoom = option.zoom || 15;
    /* global BMap */
    var map = new BMap.Map(option.id);
    var point = new BMap.Point(option.y, option.x);
    map.centerAndZoom(point, zoom);
    var marker = new BMap.Marker(point); // 创建标注
    map.addOverlay(marker); // 将标注添加到地图中    
  },

  isArray: function(a) {
    return Array.isArray ? Array.isArray(a) : Object.prototype.toString.call(a) === '[object Array]';
  },

  /**
   * 普通跳转
   * @param  {String} url 页面url
   * @return {[type]}     [description]
   */
  redirect: function(url) {
    window.location.href = url;
  },

  /**
   * 数组分块
   * @param  {Array} arr  原数组
   * @param  {Number} size 分割大小
   * @return {Array}      分块新数组
   */
  chunk: function(arr, size) {
    return (function slice(nArr, i) {
      return nArr.push(arr.slice(i, i += size)) && i >= arr.length ? nArr : slice(nArr, i);
    })([], 0);
  },

  /**
   * 判断字符串、数组、对象是否为空
   * @param  {String | Obejct}  obj 数据源
   * @return {Boolean}     结果
   */
  isEmpty: function(obj) {
    switch(typeof obj) {
      case 'undefined': return true;
      case 'string': return !obj.length;
      case 'object': return function isEmptyObj(obj) {
        return obj === null || !(Array.isArray(obj)? obj.length : Object.getOwnPropertyNames(obj).length);
      }(obj);
    }
  }

};
