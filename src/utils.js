function isArray(val) {
  return toString.call(val) === '[object Array]';
}

function sleep (time) {
  return new Promise(resolve => {
    console.log(`sleep: ${time}`)
    setTimeout(() => {
      resolve()
    }, time)
  })
}

function mergeOptions(options1, options2) {
  return deepMerge(options1, options2)
}

function deepMerge(...args) {
  const result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = deepMerge(result[key], val);
    } else if (typeof val === 'object') {
      result[key] = deepMerge({}, val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = args.length; i < l; i++) {
    forEach(args[i], assignValue);
  }
  return result;
}

function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

module.exports = {
  sleep,
  mergeOptions
}
