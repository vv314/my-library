var Fish = {
  /**
   * 返回指定精度整型随机数
   * @param  {Number} min 左边距
   * @param  {Number} max 右边距
   * @return {Number}   指定范围随机数
   * random(1, 3)  // 1 | 2 | 3
   */
  random: function(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },

  /**
   * 选择器
   * @return {Element} 匹配元素
   * e.g.
   * q('.name')  // Element
   * q('.name', '.profile')  // Element
   */
  q: function() {
    return document.querySelector.apply(document, arguments);
  },

  /**
   * 获取 Cookie
   * @param  {String} name  cookie名称
   * @return {String} 
   * e.g.
   * // cookie: name=fish
   * getCookie('name')  // fish
   * getCookie('age')  // ''
   */
  getCookie: function(name) {
    var reg, value;
    reg = new RegExp(name + '=(.*?)($|;)');
    value = reg.exec(document.cookie);
    return value == null ? '' : decodeURI(value[1]);
  },

  /**
   * 设置 Cookie
   * @param {String} name  cookie名称
   */
  setCookie: function(name, value) {
    var Days = 15; // 有效期1天
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + '=' + encodeURIComponent(value) + ';expires=' + exp.toGMTString() + ';path=/';
  },

  /**
   * 删除 Cookie
   * @param {String} name  cookie名称
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
   * @param  {String} email  email地址
   * @return {Boolean}  验证结果
   * e.g.
   * vaildEmail('vv314@foxmail.com')  // true
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
   * @param  {String} selector  元素id
   * e.g.
   * // <div class="text">hello\nfish</div>
   * replaceToBr('div.text')  // hello<br>fish
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
   * e.g.
   * // http://www.vv314.com?type=1&id=1
   * getUrlParam('id')  // 1
   * getUrlParam('name')  // null
   */
  getUrlParam: function(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'),
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
   * @param  {Number} maxlength 长度
   * @return {String}        截取结果
   * e.g.
   * limitStr('abcdefg', 4) // abcd...
   */
  limitStr: function(str, maxlength) {
    return str.length > maxlength ? (str.substr(0, maxlength) + '...') : str;
  },

  /**
   * 获取服务器时间
   * @param  {Function} fn 回调函数
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
   * input 空值验证
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

  /**
   * 获取 UA 特征字符串，判断是否包含指定信息
   * @param  {String}  appStr 特征字符串
   * @return {Boolean}        
   */
  isApp: function (appStr) {
    var ua = navigator.userAgent.toLowerCase();
    return Debug ? true : (ua.indexOf(appStr) < 0 ? false : true);
  },

  /**
   * 封装console.log()
   * @return {[type]} [description]
   */
  log: function() {
    Debug && console.log.apply(console, arguments);
  },

  /**
   * 轮询
   * @param  {Function}  conditionFn  条件函数
   * @param  {Function}  callback    回调函数
   * @param  {Number}    spend    间隔时间
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
   * 设置/获取 localStorage
   * 当 value 缺省时为获取数据, value 为对象时执行序列化
   * @param  {String} name  数据名
   * @param  {String} value 数据项
   * e.g.
   * 
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

  /**
   * 设置/获取 sessionStorage
   * 当 value 缺省时为获取数据, value 为对象时执行序列化
   * @param  {String} name  数据名
   * @param  {String} value 数据项
   * e.g.
   * 同 localStorage
   */
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
   * e.g.
   * splitPrice(12)  // <span>12</span><span>.00</span>
   * splitPrice(12.99)  // <span>12</span><span>.99</span>
   */
  splitPrice: function(price) {
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

  /**
   * 判断是否为数组
   * @param  {Object}  a 数据
   * @return {Boolean}   判断结果
   * e.g.
   * isArray([1, 3])  // true
   */
  isArray: function(a) {
    return Array.isArray ? Array.isArray(a) : Object.prototype.toString.call(a) === '[object Array]';
  },

  /**
   * 重定向
   * @param  {String} url 目标url
   */
  redirect: function(url) {
    window.location.href = url;
  },

  /**
   * 数组分块
   * @param  {Array} arr  原数组
   * @param  {Number} size 分割大小
   * @return {Array}      分块结果以新数组返回
   * e.g.
   * chunk([1, 2, 3, 4, 5], 3)  // [[1, 2, 3], [4, 5]]
   */
  chunk: function(arr, size) {
    return (function slice(nArr, i) {
      return nArr.push(arr.slice(i, i += size)) && i >= arr.length ? nArr : slice(nArr, i);
    })([], 0);
  },

  /**
   * 判断字符串、数组、对象内容是否为空
   * @param  {String | Obejct}  obj  数据源
   * @return {Boolean}  判断结果
   * e.g.
   * isEmpty('')  // true
   * isEmpty([])  // true
   * isEmpty({})  // true
   * isEmpty({name: 'fish'})  // false
   */
  isEmpty: function(obj) {
    switch(typeof obj) {
      case 'undefined': return true;
      case 'string': return !obj.length;
      case 'object': return obj === null || !Object.keys(obj).length;
    }
  },

  /**
   * 应用状态管理，基于sesstionStorage
   * @param  {String} method  方法名
   * @return {Function}       操作方法
   * e.g.
   * eux('add')('login')  // eux: {login: 1}
   * eux('add')('login')('new')  // eux: {login: 1, new: 1}
   * eux('has')('login')  // true
   * eux('remove')('new')  // eux: {login: 1}
   * eux('clear')  // eux: {}
   */
  eux: function(method) {
    var self = this, 
        flag = 'eux',
        val = this.sessionStorage(flag) || {};
    return {
      add: function add(state) {
        val[state] = 1;
        self.sessionStorage(flag, val);
        return add;
      },
      has: function(state) {
        return state in val;
      },
      remove: function(state) {
        if (Object.keys(val).length) {
          delete val[state];
          self.sessionStorage(flag, val);
        }
      },
      clear: (function() {
        self.sessionStorage(flag, {});
      })()
    }[method];
  },

  /**
   * 设置 title，兼容微信
   * @param  {String} title 页面标题
   * @return {Context}       上下文
   */
  title: function(title) {
    if (this.isWechat()) {
      // hack 在微信等 webview 中无法修改 document.title 的情况
      document.title = title;
      var $iframe = $('<iframe src="/favicon.ico"></iframe>').on('load', function() {
        setTimeout(function() {
          $iframe.off('load').remove();
        }, 0);
      }).appendTo('body');
    } else {
      document.title = title;
    }
    return this;
  },

  /**
   * 获取当前时间
   * @param  {Number}  [addDayCount]  日期增量，支持负数
   * @return {String} yyyy-MM-dd
   * e.g.
   * getDate()  // 2016-10-08
   * getDate(1)  // 2016-10-09
   * getDate(-2)  // 2016-10-06
   */
  getDate: function(addDayCount) {
    var now = new Date(),
        fm = function(v) {return v<10?('0'+v):v};
    now.setDate(now.getDate() + (isNaN(Number(addDayCount))?0:+addDayCount));
    return [
      now.getFullYear(),
      fm(now.getMonth() + 1),
      fm(now.getDate())
    ].join('-');
  },

  /**
   * 比较版本号大小
   * @param  {String}  currVer   当前版本号
   * @param  {String}  targetVer 目标版本号
   * @return {Boolean}           结果
   * e.g.
   * isNewVer('1.2.0', '1.2.4')  // false
   * isNewVer('1.3.0', '1.2.4')  // true
   * isNewVer('1.2.4', '1.2.4')  // true
   */
  isNewVer: function (currVer, targetVer) {
    var cvArr = currVer.split('.'), 
        tvArr = targetVer.split('.');
    if(currVer === targetVer) return true;
    for(var i=0; i<3; i++) {
      if(cvArr[i] != tvArr[i]) return cvArr[i] > tvArr[i];
    }
    return true;
  }

  /**
   * 向 DOM 元素内追加 html 内容
   * @param  {DOM} ele  元素容器
   * @param  {String} html html字符串
   * e.g.
   * append(documnet.getElementById('main'), '<div>hello fish</div>')
   */
  append: function (ele, html) {
    if(typeof(ele) === 'object' && ele.nodeType === 1) {
      ele.insertAdjacentHTML('beforeend', html);
    } else {
      query(ele)[0].insertAdjacentHTML('beforeend', html);
    }
  },
  
  /**
   * 判断是否为数字或数字字符串
   * @param  {Number | String} 数据 
   * @return {Boolean}       判断结果
   * e.g.
   * likeNumber(5)  // true
   * likeNumber('8')  // true
   * likeNumber('2a')  // false
   */
  likeNumber: function(value) {
    return !isNaN(Number(value));
  }

};
