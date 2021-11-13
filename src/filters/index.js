/**
 * 协议类型
 * @param val
 * @returns {string}
 */
exports.protocolName = (val) => {
  let protocolName = "";
  switch (val) {
    case 1: {
      protocolName = "HTTP";
      break;
    }
    case 2: {
      protocolName = "HTTPS";
      break;
    }
    case 3: {
      protocolName = "HTTP&HTTPS";
      break;
    }
  }
  return protocolName;
};

/**
 * 负载均衡类型
 */
exports.loadBalanceName = (val) => {
  let loadBalanceName = "";
  switch (val) {
    case 1: {
      loadBalanceName = "加权轮询";
      break;
    }
    case 2: {
      loadBalanceName = "ip_hash";
      break;
    }
  }
  return loadBalanceName;
};

/**
 * 时间戳处理
 */
exports.formatTime = (timestamp) => {
  let date = new Date(timestamp * 1000);
  return formatDate(date, "yyyy-MM-dd hh:mm:ss");
};

function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  let o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + "";
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : padLeftZero(str)
      );
    }
  }
  return fmt;
}

function padLeftZero(str) {
  return ("00" + str).substr(str.length);
}
