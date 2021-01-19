'use strict';
var hex_md5 = require("md5")
var TST_VALUE

module.exports={
  getValidatePart : function(str) {
    /** @type {string} */
    var tmp_buffer = "";
    if (str != null && str != "undefied" && str.length > 0) {
      /** @type {number} */
      var i = 0;
      for (; i < str.length; i++) {
        var c = str.charAt(i);
        if (c.match(/^[a-z0-9A-Z\u4e00-\u9fa5]+$/)) {
          /** @type {string} */
          tmp_buffer = tmp_buffer + c;
        }
      }
    }
    return tmp_buffer;
  },
  getValidateSignValue : function(preescape) {
    /** @type {string} */
    var newIntegralPart = "";
    /** @type {!RegExp} */
    var isDoubleOperatorChar = /^[\\/u4E00-\\/u9FA5]*$/;
    if (preescape != null && preescape != "undefied" && preescape.length > 0) {
      /** @type {number} */
      var i = 0;
      for (; i < preescape.length; i++) {
        var ch = preescape.charAt(i);
        if (ch >= "0" && ch <= "9" || ch >= "a" && ch <= "z" || ch >= "A" && ch <= "Z" || isDoubleOperatorChar.test(ch + "")) {
          /** @type {string} */
          newIntegralPart = newIntegralPart + ch;
        }
      }
    }
    return newIntegralPart;
  },
  getValidParams : function(data) {
    if (typeof data == "undefined" || data == null || typeof data != "object") {
      return "";
    }
    var someStoreStorage = {};
    var type;
    for (type in data) {
      var value = this.getValidatePart(data[type]);
      /** @type {string} */
      var key = type.toLocaleLowerCase();
      if (value && value.length > 0) {
        someStoreStorage[key] = value;
      }
    }
    return someStoreStorage;
  },
  objKeySort : function(data) {
    /** @type {!Array<string>} */
    var s = Object.keys(data).sort();
    var indexedRows = {};
    /** @type {number} */
    var i = 0;
    for (; i < s.length; i++) {
      indexedRows[s[i].toLocaleLowerCase()] = data[s[i]];
    }
    return indexedRows;
  },
  http_builder : function(data) {
    if (typeof data == "undefined" || data == null || typeof data != "object") {
      return "";
    }
    /** @type {string} */
    var order = "";
    var i;
    for (i in data) {
      /** @type {string} */
      order = order + ((order.indexOf("=") != -1 ? "&" : "") + i + "=" + data[i]);
    }
    return order;
  },
  getSign : function(key, data) {
    var tempKey = key.substring(8)
    var currentFilePath = tempKey.substring(tempKey.indexOf('/'))
    /** @type {string} */
    var filePath = "";
    var itemData = this.getValidParams(data);
    if (itemData) {
      var value = this.objKeySort(itemData);
      filePath = this.http_builder(value);
    }
    /** @type {number} */
    var operand = (new Date).getTime();
    /** @type {number} */
    TST_VALUE = operand;
    /** @type {string} */
    var expression = "service=" + currentFilePath + "&securitykey=" + hex_md5("e11adc3949ba59abbe56e057f20f883e") + "&butelTst=" + operand;
    if (filePath && filePath.length > 0) {
      /** @type {string} */
      var string = encodeURIComponent(filePath);
      expression = expression + "&param=" + hex_md5(string);
    }
    var sign = hex_md5(expression);
    return sign;
  },
  signBaseUrlAndParams : function(name, fn) {
    if (name && fn) {
      var handler = this.getSign(name, fn);
      fn["butelAppkey"] = "pcweb1";
      fn["butelTst"] = TST_VALUE;
      fn["butelSign"] = handler;
      return fn;
    } else {
      var invalidParams = {};
      return invalidParams;
    }
  },
  getQueryObject : function(version) {
    var miscProps = {};
    if (version == null) {
      return miscProps;
    }
    var check = version.substring(version.lastIndexOf("?") + 1);
    /** @type {!RegExp} */
    var whitespaceRegex = /([^?&=]+)=([^?&=]*)/g;
    check.replace(whitespaceRegex, function(canCreateDiscussions, part, $2) {
      /** @type {string} */
      var name = decodeURIComponent(part);
      /** @type {string} */
      var val = decodeURIComponent($2);
      /** @type {string} */
      val = String(val);
      /** @type {string} */
      miscProps[name] = val;
      return canCreateDiscussions;
    });
    return miscProps;
  },
  signUrlWithParams : function(level) {
    var host = level.substring(0, level.indexOf('?'))
    var container = this.getQueryObject(level);
    var url = this.signBaseUrlAndParams(host, container);
    return host + "?" + this.http_builder(url);
  }
}
