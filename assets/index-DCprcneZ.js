function getDefaultExportFromCjs(x2) {
  return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
}
var react = { exports: {} };
var react_production_min = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var l$1 = Symbol.for("react.element"), n$1 = Symbol.for("react.portal"), p$2 = Symbol.for("react.fragment"), q$1 = Symbol.for("react.strict_mode"), r = Symbol.for("react.profiler"), t = Symbol.for("react.provider"), u = Symbol.for("react.context"), v$1 = Symbol.for("react.forward_ref"), w = Symbol.for("react.suspense"), x = Symbol.for("react.memo"), y = Symbol.for("react.lazy"), z$1 = Symbol.iterator;
function A$1(a) {
  if (null === a || "object" !== typeof a) return null;
  a = z$1 && a[z$1] || a["@@iterator"];
  return "function" === typeof a ? a : null;
}
var B$1 = { isMounted: function() {
  return false;
}, enqueueForceUpdate: function() {
}, enqueueReplaceState: function() {
}, enqueueSetState: function() {
} }, C$1 = Object.assign, D$1 = {};
function E$1(a, b, e) {
  this.props = a;
  this.context = b;
  this.refs = D$1;
  this.updater = e || B$1;
}
E$1.prototype.isReactComponent = {};
E$1.prototype.setState = function(a, b) {
  if ("object" !== typeof a && "function" !== typeof a && null != a) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
  this.updater.enqueueSetState(this, a, b, "setState");
};
E$1.prototype.forceUpdate = function(a) {
  this.updater.enqueueForceUpdate(this, a, "forceUpdate");
};
function F() {
}
F.prototype = E$1.prototype;
function G$1(a, b, e) {
  this.props = a;
  this.context = b;
  this.refs = D$1;
  this.updater = e || B$1;
}
var H$1 = G$1.prototype = new F();
H$1.constructor = G$1;
C$1(H$1, E$1.prototype);
H$1.isPureReactComponent = true;
var I$1 = Array.isArray, J = Object.prototype.hasOwnProperty, K$1 = { current: null }, L$1 = { key: true, ref: true, __self: true, __source: true };
function M$1(a, b, e) {
  var d, c = {}, k2 = null, h = null;
  if (null != b) for (d in void 0 !== b.ref && (h = b.ref), void 0 !== b.key && (k2 = "" + b.key), b) J.call(b, d) && !L$1.hasOwnProperty(d) && (c[d] = b[d]);
  var g = arguments.length - 2;
  if (1 === g) c.children = e;
  else if (1 < g) {
    for (var f2 = Array(g), m2 = 0; m2 < g; m2++) f2[m2] = arguments[m2 + 2];
    c.children = f2;
  }
  if (a && a.defaultProps) for (d in g = a.defaultProps, g) void 0 === c[d] && (c[d] = g[d]);
  return { $$typeof: l$1, type: a, key: k2, ref: h, props: c, _owner: K$1.current };
}
function N$1(a, b) {
  return { $$typeof: l$1, type: a.type, key: b, ref: a.ref, props: a.props, _owner: a._owner };
}
function O$1(a) {
  return "object" === typeof a && null !== a && a.$$typeof === l$1;
}
function escape(a) {
  var b = { "=": "=0", ":": "=2" };
  return "$" + a.replace(/[=:]/g, function(a2) {
    return b[a2];
  });
}
var P$1 = /\/+/g;
function Q$1(a, b) {
  return "object" === typeof a && null !== a && null != a.key ? escape("" + a.key) : b.toString(36);
}
function R$1(a, b, e, d, c) {
  var k2 = typeof a;
  if ("undefined" === k2 || "boolean" === k2) a = null;
  var h = false;
  if (null === a) h = true;
  else switch (k2) {
    case "string":
    case "number":
      h = true;
      break;
    case "object":
      switch (a.$$typeof) {
        case l$1:
        case n$1:
          h = true;
      }
  }
  if (h) return h = a, c = c(h), a = "" === d ? "." + Q$1(h, 0) : d, I$1(c) ? (e = "", null != a && (e = a.replace(P$1, "$&/") + "/"), R$1(c, b, e, "", function(a2) {
    return a2;
  })) : null != c && (O$1(c) && (c = N$1(c, e + (!c.key || h && h.key === c.key ? "" : ("" + c.key).replace(P$1, "$&/") + "/") + a)), b.push(c)), 1;
  h = 0;
  d = "" === d ? "." : d + ":";
  if (I$1(a)) for (var g = 0; g < a.length; g++) {
    k2 = a[g];
    var f2 = d + Q$1(k2, g);
    h += R$1(k2, b, e, f2, c);
  }
  else if (f2 = A$1(a), "function" === typeof f2) for (a = f2.call(a), g = 0; !(k2 = a.next()).done; ) k2 = k2.value, f2 = d + Q$1(k2, g++), h += R$1(k2, b, e, f2, c);
  else if ("object" === k2) throw b = String(a), Error("Objects are not valid as a React child (found: " + ("[object Object]" === b ? "object with keys {" + Object.keys(a).join(", ") + "}" : b) + "). If you meant to render a collection of children, use an array instead.");
  return h;
}
function S$1(a, b, e) {
  if (null == a) return a;
  var d = [], c = 0;
  R$1(a, d, "", "", function(a2) {
    return b.call(e, a2, c++);
  });
  return d;
}
function T$1(a) {
  if (-1 === a._status) {
    var b = a._result;
    b = b();
    b.then(function(b2) {
      if (0 === a._status || -1 === a._status) a._status = 1, a._result = b2;
    }, function(b2) {
      if (0 === a._status || -1 === a._status) a._status = 2, a._result = b2;
    });
    -1 === a._status && (a._status = 0, a._result = b);
  }
  if (1 === a._status) return a._result.default;
  throw a._result;
}
var U$1 = { current: null }, V$1 = { transition: null }, W$1 = { ReactCurrentDispatcher: U$1, ReactCurrentBatchConfig: V$1, ReactCurrentOwner: K$1 };
function X$1() {
  throw Error("act(...) is not supported in production builds of React.");
}
react_production_min.Children = { map: S$1, forEach: function(a, b, e) {
  S$1(a, function() {
    b.apply(this, arguments);
  }, e);
}, count: function(a) {
  var b = 0;
  S$1(a, function() {
    b++;
  });
  return b;
}, toArray: function(a) {
  return S$1(a, function(a2) {
    return a2;
  }) || [];
}, only: function(a) {
  if (!O$1(a)) throw Error("React.Children.only expected to receive a single React element child.");
  return a;
} };
react_production_min.Component = E$1;
react_production_min.Fragment = p$2;
react_production_min.Profiler = r;
react_production_min.PureComponent = G$1;
react_production_min.StrictMode = q$1;
react_production_min.Suspense = w;
react_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W$1;
react_production_min.act = X$1;
react_production_min.cloneElement = function(a, b, e) {
  if (null === a || void 0 === a) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a + ".");
  var d = C$1({}, a.props), c = a.key, k2 = a.ref, h = a._owner;
  if (null != b) {
    void 0 !== b.ref && (k2 = b.ref, h = K$1.current);
    void 0 !== b.key && (c = "" + b.key);
    if (a.type && a.type.defaultProps) var g = a.type.defaultProps;
    for (f2 in b) J.call(b, f2) && !L$1.hasOwnProperty(f2) && (d[f2] = void 0 === b[f2] && void 0 !== g ? g[f2] : b[f2]);
  }
  var f2 = arguments.length - 2;
  if (1 === f2) d.children = e;
  else if (1 < f2) {
    g = Array(f2);
    for (var m2 = 0; m2 < f2; m2++) g[m2] = arguments[m2 + 2];
    d.children = g;
  }
  return { $$typeof: l$1, type: a.type, key: c, ref: k2, props: d, _owner: h };
};
react_production_min.createContext = function(a) {
  a = { $$typeof: u, _currentValue: a, _currentValue2: a, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null };
  a.Provider = { $$typeof: t, _context: a };
  return a.Consumer = a;
};
react_production_min.createElement = M$1;
react_production_min.createFactory = function(a) {
  var b = M$1.bind(null, a);
  b.type = a;
  return b;
};
react_production_min.createRef = function() {
  return { current: null };
};
react_production_min.forwardRef = function(a) {
  return { $$typeof: v$1, render: a };
};
react_production_min.isValidElement = O$1;
react_production_min.lazy = function(a) {
  return { $$typeof: y, _payload: { _status: -1, _result: a }, _init: T$1 };
};
react_production_min.memo = function(a, b) {
  return { $$typeof: x, type: a, compare: void 0 === b ? null : b };
};
react_production_min.startTransition = function(a) {
  var b = V$1.transition;
  V$1.transition = {};
  try {
    a();
  } finally {
    V$1.transition = b;
  }
};
react_production_min.unstable_act = X$1;
react_production_min.useCallback = function(a, b) {
  return U$1.current.useCallback(a, b);
};
react_production_min.useContext = function(a) {
  return U$1.current.useContext(a);
};
react_production_min.useDebugValue = function() {
};
react_production_min.useDeferredValue = function(a) {
  return U$1.current.useDeferredValue(a);
};
react_production_min.useEffect = function(a, b) {
  return U$1.current.useEffect(a, b);
};
react_production_min.useId = function() {
  return U$1.current.useId();
};
react_production_min.useImperativeHandle = function(a, b, e) {
  return U$1.current.useImperativeHandle(a, b, e);
};
react_production_min.useInsertionEffect = function(a, b) {
  return U$1.current.useInsertionEffect(a, b);
};
react_production_min.useLayoutEffect = function(a, b) {
  return U$1.current.useLayoutEffect(a, b);
};
react_production_min.useMemo = function(a, b) {
  return U$1.current.useMemo(a, b);
};
react_production_min.useReducer = function(a, b, e) {
  return U$1.current.useReducer(a, b, e);
};
react_production_min.useRef = function(a) {
  return U$1.current.useRef(a);
};
react_production_min.useState = function(a) {
  return U$1.current.useState(a);
};
react_production_min.useSyncExternalStore = function(a, b, e) {
  return U$1.current.useSyncExternalStore(a, b, e);
};
react_production_min.useTransition = function() {
  return U$1.current.useTransition();
};
react_production_min.version = "18.3.1";
{
  react.exports = react_production_min;
}
var reactExports = react.exports;
const React = /* @__PURE__ */ getDefaultExportFromCjs(reactExports);
var client = {};
var reactDom = { exports: {} };
var reactDom_production_min = {};
var scheduler = { exports: {} };
var scheduler_production_min = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(function(exports) {
  function f2(a, b) {
    var c = a.length;
    a.push(b);
    a: for (; 0 < c; ) {
      var d = c - 1 >>> 1, e = a[d];
      if (0 < g(e, b)) a[d] = b, a[c] = e, c = d;
      else break a;
    }
  }
  function h(a) {
    return 0 === a.length ? null : a[0];
  }
  function k2(a) {
    if (0 === a.length) return null;
    var b = a[0], c = a.pop();
    if (c !== b) {
      a[0] = c;
      a: for (var d = 0, e = a.length, w2 = e >>> 1; d < w2; ) {
        var m2 = 2 * (d + 1) - 1, C2 = a[m2], n2 = m2 + 1, x2 = a[n2];
        if (0 > g(C2, c)) n2 < e && 0 > g(x2, C2) ? (a[d] = x2, a[n2] = c, d = n2) : (a[d] = C2, a[m2] = c, d = m2);
        else if (n2 < e && 0 > g(x2, c)) a[d] = x2, a[n2] = c, d = n2;
        else break a;
      }
    }
    return b;
  }
  function g(a, b) {
    var c = a.sortIndex - b.sortIndex;
    return 0 !== c ? c : a.id - b.id;
  }
  if ("object" === typeof performance && "function" === typeof performance.now) {
    var l2 = performance;
    exports.unstable_now = function() {
      return l2.now();
    };
  } else {
    var p2 = Date, q2 = p2.now();
    exports.unstable_now = function() {
      return p2.now() - q2;
    };
  }
  var r2 = [], t2 = [], u2 = 1, v2 = null, y2 = 3, z2 = false, A2 = false, B2 = false, D2 = "function" === typeof setTimeout ? setTimeout : null, E2 = "function" === typeof clearTimeout ? clearTimeout : null, F2 = "undefined" !== typeof setImmediate ? setImmediate : null;
  "undefined" !== typeof navigator && void 0 !== navigator.scheduling && void 0 !== navigator.scheduling.isInputPending && navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function G2(a) {
    for (var b = h(t2); null !== b; ) {
      if (null === b.callback) k2(t2);
      else if (b.startTime <= a) k2(t2), b.sortIndex = b.expirationTime, f2(r2, b);
      else break;
      b = h(t2);
    }
  }
  function H2(a) {
    B2 = false;
    G2(a);
    if (!A2) if (null !== h(r2)) A2 = true, I2(J2);
    else {
      var b = h(t2);
      null !== b && K2(H2, b.startTime - a);
    }
  }
  function J2(a, b) {
    A2 = false;
    B2 && (B2 = false, E2(L2), L2 = -1);
    z2 = true;
    var c = y2;
    try {
      G2(b);
      for (v2 = h(r2); null !== v2 && (!(v2.expirationTime > b) || a && !M2()); ) {
        var d = v2.callback;
        if ("function" === typeof d) {
          v2.callback = null;
          y2 = v2.priorityLevel;
          var e = d(v2.expirationTime <= b);
          b = exports.unstable_now();
          "function" === typeof e ? v2.callback = e : v2 === h(r2) && k2(r2);
          G2(b);
        } else k2(r2);
        v2 = h(r2);
      }
      if (null !== v2) var w2 = true;
      else {
        var m2 = h(t2);
        null !== m2 && K2(H2, m2.startTime - b);
        w2 = false;
      }
      return w2;
    } finally {
      v2 = null, y2 = c, z2 = false;
    }
  }
  var N2 = false, O2 = null, L2 = -1, P2 = 5, Q2 = -1;
  function M2() {
    return exports.unstable_now() - Q2 < P2 ? false : true;
  }
  function R2() {
    if (null !== O2) {
      var a = exports.unstable_now();
      Q2 = a;
      var b = true;
      try {
        b = O2(true, a);
      } finally {
        b ? S2() : (N2 = false, O2 = null);
      }
    } else N2 = false;
  }
  var S2;
  if ("function" === typeof F2) S2 = function() {
    F2(R2);
  };
  else if ("undefined" !== typeof MessageChannel) {
    var T2 = new MessageChannel(), U2 = T2.port2;
    T2.port1.onmessage = R2;
    S2 = function() {
      U2.postMessage(null);
    };
  } else S2 = function() {
    D2(R2, 0);
  };
  function I2(a) {
    O2 = a;
    N2 || (N2 = true, S2());
  }
  function K2(a, b) {
    L2 = D2(function() {
      a(exports.unstable_now());
    }, b);
  }
  exports.unstable_IdlePriority = 5;
  exports.unstable_ImmediatePriority = 1;
  exports.unstable_LowPriority = 4;
  exports.unstable_NormalPriority = 3;
  exports.unstable_Profiling = null;
  exports.unstable_UserBlockingPriority = 2;
  exports.unstable_cancelCallback = function(a) {
    a.callback = null;
  };
  exports.unstable_continueExecution = function() {
    A2 || z2 || (A2 = true, I2(J2));
  };
  exports.unstable_forceFrameRate = function(a) {
    0 > a || 125 < a ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : P2 = 0 < a ? Math.floor(1e3 / a) : 5;
  };
  exports.unstable_getCurrentPriorityLevel = function() {
    return y2;
  };
  exports.unstable_getFirstCallbackNode = function() {
    return h(r2);
  };
  exports.unstable_next = function(a) {
    switch (y2) {
      case 1:
      case 2:
      case 3:
        var b = 3;
        break;
      default:
        b = y2;
    }
    var c = y2;
    y2 = b;
    try {
      return a();
    } finally {
      y2 = c;
    }
  };
  exports.unstable_pauseExecution = function() {
  };
  exports.unstable_requestPaint = function() {
  };
  exports.unstable_runWithPriority = function(a, b) {
    switch (a) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        break;
      default:
        a = 3;
    }
    var c = y2;
    y2 = a;
    try {
      return b();
    } finally {
      y2 = c;
    }
  };
  exports.unstable_scheduleCallback = function(a, b, c) {
    var d = exports.unstable_now();
    "object" === typeof c && null !== c ? (c = c.delay, c = "number" === typeof c && 0 < c ? d + c : d) : c = d;
    switch (a) {
      case 1:
        var e = -1;
        break;
      case 2:
        e = 250;
        break;
      case 5:
        e = 1073741823;
        break;
      case 4:
        e = 1e4;
        break;
      default:
        e = 5e3;
    }
    e = c + e;
    a = { id: u2++, callback: b, priorityLevel: a, startTime: c, expirationTime: e, sortIndex: -1 };
    c > d ? (a.sortIndex = c, f2(t2, a), null === h(r2) && a === h(t2) && (B2 ? (E2(L2), L2 = -1) : B2 = true, K2(H2, c - d))) : (a.sortIndex = e, f2(r2, a), A2 || z2 || (A2 = true, I2(J2)));
    return a;
  };
  exports.unstable_shouldYield = M2;
  exports.unstable_wrapCallback = function(a) {
    var b = y2;
    return function() {
      var c = y2;
      y2 = b;
      try {
        return a.apply(this, arguments);
      } finally {
        y2 = c;
      }
    };
  };
})(scheduler_production_min);
{
  scheduler.exports = scheduler_production_min;
}
var schedulerExports = scheduler.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var aa = reactExports, ca = schedulerExports;
function p$1(a) {
  for (var b = "https://reactjs.org/docs/error-decoder.html?invariant=" + a, c = 1; c < arguments.length; c++) b += "&args[]=" + encodeURIComponent(arguments[c]);
  return "Minified React error #" + a + "; visit " + b + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
var da = /* @__PURE__ */ new Set(), ea = {};
function fa(a, b) {
  ha(a, b);
  ha(a + "Capture", b);
}
function ha(a, b) {
  ea[a] = b;
  for (a = 0; a < b.length; a++) da.add(b[a]);
}
var ia = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement), ja = Object.prototype.hasOwnProperty, ka = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, la = {}, ma = {};
function oa(a) {
  if (ja.call(ma, a)) return true;
  if (ja.call(la, a)) return false;
  if (ka.test(a)) return ma[a] = true;
  la[a] = true;
  return false;
}
function pa(a, b, c, d) {
  if (null !== c && 0 === c.type) return false;
  switch (typeof b) {
    case "function":
    case "symbol":
      return true;
    case "boolean":
      if (d) return false;
      if (null !== c) return !c.acceptsBooleans;
      a = a.toLowerCase().slice(0, 5);
      return "data-" !== a && "aria-" !== a;
    default:
      return false;
  }
}
function qa(a, b, c, d) {
  if (null === b || "undefined" === typeof b || pa(a, b, c, d)) return true;
  if (d) return false;
  if (null !== c) switch (c.type) {
    case 3:
      return !b;
    case 4:
      return false === b;
    case 5:
      return isNaN(b);
    case 6:
      return isNaN(b) || 1 > b;
  }
  return false;
}
function v(a, b, c, d, e, f2, g) {
  this.acceptsBooleans = 2 === b || 3 === b || 4 === b;
  this.attributeName = d;
  this.attributeNamespace = e;
  this.mustUseProperty = c;
  this.propertyName = a;
  this.type = b;
  this.sanitizeURL = f2;
  this.removeEmptyString = g;
}
var z = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a) {
  z[a] = new v(a, 0, false, a, null, false, false);
});
[["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(a) {
  var b = a[0];
  z[b] = new v(b, 1, false, a[1], null, false, false);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function(a) {
  z[a] = new v(a, 2, false, a.toLowerCase(), null, false, false);
});
["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(a) {
  z[a] = new v(a, 2, false, a, null, false, false);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a) {
  z[a] = new v(a, 3, false, a.toLowerCase(), null, false, false);
});
["checked", "multiple", "muted", "selected"].forEach(function(a) {
  z[a] = new v(a, 3, true, a, null, false, false);
});
["capture", "download"].forEach(function(a) {
  z[a] = new v(a, 4, false, a, null, false, false);
});
["cols", "rows", "size", "span"].forEach(function(a) {
  z[a] = new v(a, 6, false, a, null, false, false);
});
["rowSpan", "start"].forEach(function(a) {
  z[a] = new v(a, 5, false, a.toLowerCase(), null, false, false);
});
var ra = /[\-:]([a-z])/g;
function sa(a) {
  return a[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a) {
  var b = a.replace(
    ra,
    sa
  );
  z[b] = new v(b, 1, false, a, null, false, false);
});
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a) {
  var b = a.replace(ra, sa);
  z[b] = new v(b, 1, false, a, "http://www.w3.org/1999/xlink", false, false);
});
["xml:base", "xml:lang", "xml:space"].forEach(function(a) {
  var b = a.replace(ra, sa);
  z[b] = new v(b, 1, false, a, "http://www.w3.org/XML/1998/namespace", false, false);
});
["tabIndex", "crossOrigin"].forEach(function(a) {
  z[a] = new v(a, 1, false, a.toLowerCase(), null, false, false);
});
z.xlinkHref = new v("xlinkHref", 1, false, "xlink:href", "http://www.w3.org/1999/xlink", true, false);
["src", "href", "action", "formAction"].forEach(function(a) {
  z[a] = new v(a, 1, false, a.toLowerCase(), null, true, true);
});
function ta(a, b, c, d) {
  var e = z.hasOwnProperty(b) ? z[b] : null;
  if (null !== e ? 0 !== e.type : d || !(2 < b.length) || "o" !== b[0] && "O" !== b[0] || "n" !== b[1] && "N" !== b[1]) qa(b, c, e, d) && (c = null), d || null === e ? oa(b) && (null === c ? a.removeAttribute(b) : a.setAttribute(b, "" + c)) : e.mustUseProperty ? a[e.propertyName] = null === c ? 3 === e.type ? false : "" : c : (b = e.attributeName, d = e.attributeNamespace, null === c ? a.removeAttribute(b) : (e = e.type, c = 3 === e || 4 === e && true === c ? "" : "" + c, d ? a.setAttributeNS(d, b, c) : a.setAttribute(b, c)));
}
var ua = aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, va = Symbol.for("react.element"), wa = Symbol.for("react.portal"), ya = Symbol.for("react.fragment"), za = Symbol.for("react.strict_mode"), Aa = Symbol.for("react.profiler"), Ba = Symbol.for("react.provider"), Ca = Symbol.for("react.context"), Da = Symbol.for("react.forward_ref"), Ea = Symbol.for("react.suspense"), Fa = Symbol.for("react.suspense_list"), Ga = Symbol.for("react.memo"), Ha = Symbol.for("react.lazy");
var Ia = Symbol.for("react.offscreen");
var Ja = Symbol.iterator;
function Ka(a) {
  if (null === a || "object" !== typeof a) return null;
  a = Ja && a[Ja] || a["@@iterator"];
  return "function" === typeof a ? a : null;
}
var A = Object.assign, La;
function Ma(a) {
  if (void 0 === La) try {
    throw Error();
  } catch (c) {
    var b = c.stack.trim().match(/\n( *(at )?)/);
    La = b && b[1] || "";
  }
  return "\n" + La + a;
}
var Na = false;
function Oa(a, b) {
  if (!a || Na) return "";
  Na = true;
  var c = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (b) if (b = function() {
      throw Error();
    }, Object.defineProperty(b.prototype, "props", { set: function() {
      throw Error();
    } }), "object" === typeof Reflect && Reflect.construct) {
      try {
        Reflect.construct(b, []);
      } catch (l2) {
        var d = l2;
      }
      Reflect.construct(a, [], b);
    } else {
      try {
        b.call();
      } catch (l2) {
        d = l2;
      }
      a.call(b.prototype);
    }
    else {
      try {
        throw Error();
      } catch (l2) {
        d = l2;
      }
      a();
    }
  } catch (l2) {
    if (l2 && d && "string" === typeof l2.stack) {
      for (var e = l2.stack.split("\n"), f2 = d.stack.split("\n"), g = e.length - 1, h = f2.length - 1; 1 <= g && 0 <= h && e[g] !== f2[h]; ) h--;
      for (; 1 <= g && 0 <= h; g--, h--) if (e[g] !== f2[h]) {
        if (1 !== g || 1 !== h) {
          do
            if (g--, h--, 0 > h || e[g] !== f2[h]) {
              var k2 = "\n" + e[g].replace(" at new ", " at ");
              a.displayName && k2.includes("<anonymous>") && (k2 = k2.replace("<anonymous>", a.displayName));
              return k2;
            }
          while (1 <= g && 0 <= h);
        }
        break;
      }
    }
  } finally {
    Na = false, Error.prepareStackTrace = c;
  }
  return (a = a ? a.displayName || a.name : "") ? Ma(a) : "";
}
function Pa(a) {
  switch (a.tag) {
    case 5:
      return Ma(a.type);
    case 16:
      return Ma("Lazy");
    case 13:
      return Ma("Suspense");
    case 19:
      return Ma("SuspenseList");
    case 0:
    case 2:
    case 15:
      return a = Oa(a.type, false), a;
    case 11:
      return a = Oa(a.type.render, false), a;
    case 1:
      return a = Oa(a.type, true), a;
    default:
      return "";
  }
}
function Qa(a) {
  if (null == a) return null;
  if ("function" === typeof a) return a.displayName || a.name || null;
  if ("string" === typeof a) return a;
  switch (a) {
    case ya:
      return "Fragment";
    case wa:
      return "Portal";
    case Aa:
      return "Profiler";
    case za:
      return "StrictMode";
    case Ea:
      return "Suspense";
    case Fa:
      return "SuspenseList";
  }
  if ("object" === typeof a) switch (a.$$typeof) {
    case Ca:
      return (a.displayName || "Context") + ".Consumer";
    case Ba:
      return (a._context.displayName || "Context") + ".Provider";
    case Da:
      var b = a.render;
      a = a.displayName;
      a || (a = b.displayName || b.name || "", a = "" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
      return a;
    case Ga:
      return b = a.displayName || null, null !== b ? b : Qa(a.type) || "Memo";
    case Ha:
      b = a._payload;
      a = a._init;
      try {
        return Qa(a(b));
      } catch (c) {
      }
  }
  return null;
}
function Ra(a) {
  var b = a.type;
  switch (a.tag) {
    case 24:
      return "Cache";
    case 9:
      return (b.displayName || "Context") + ".Consumer";
    case 10:
      return (b._context.displayName || "Context") + ".Provider";
    case 18:
      return "DehydratedFragment";
    case 11:
      return a = b.render, a = a.displayName || a.name || "", b.displayName || ("" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
    case 7:
      return "Fragment";
    case 5:
      return b;
    case 4:
      return "Portal";
    case 3:
      return "Root";
    case 6:
      return "Text";
    case 16:
      return Qa(b);
    case 8:
      return b === za ? "StrictMode" : "Mode";
    case 22:
      return "Offscreen";
    case 12:
      return "Profiler";
    case 21:
      return "Scope";
    case 13:
      return "Suspense";
    case 19:
      return "SuspenseList";
    case 25:
      return "TracingMarker";
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if ("function" === typeof b) return b.displayName || b.name || null;
      if ("string" === typeof b) return b;
  }
  return null;
}
function Sa(a) {
  switch (typeof a) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return a;
    case "object":
      return a;
    default:
      return "";
  }
}
function Ta(a) {
  var b = a.type;
  return (a = a.nodeName) && "input" === a.toLowerCase() && ("checkbox" === b || "radio" === b);
}
function Ua(a) {
  var b = Ta(a) ? "checked" : "value", c = Object.getOwnPropertyDescriptor(a.constructor.prototype, b), d = "" + a[b];
  if (!a.hasOwnProperty(b) && "undefined" !== typeof c && "function" === typeof c.get && "function" === typeof c.set) {
    var e = c.get, f2 = c.set;
    Object.defineProperty(a, b, { configurable: true, get: function() {
      return e.call(this);
    }, set: function(a2) {
      d = "" + a2;
      f2.call(this, a2);
    } });
    Object.defineProperty(a, b, { enumerable: c.enumerable });
    return { getValue: function() {
      return d;
    }, setValue: function(a2) {
      d = "" + a2;
    }, stopTracking: function() {
      a._valueTracker = null;
      delete a[b];
    } };
  }
}
function Va(a) {
  a._valueTracker || (a._valueTracker = Ua(a));
}
function Wa(a) {
  if (!a) return false;
  var b = a._valueTracker;
  if (!b) return true;
  var c = b.getValue();
  var d = "";
  a && (d = Ta(a) ? a.checked ? "true" : "false" : a.value);
  a = d;
  return a !== c ? (b.setValue(a), true) : false;
}
function Xa(a) {
  a = a || ("undefined" !== typeof document ? document : void 0);
  if ("undefined" === typeof a) return null;
  try {
    return a.activeElement || a.body;
  } catch (b) {
    return a.body;
  }
}
function Ya(a, b) {
  var c = b.checked;
  return A({}, b, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: null != c ? c : a._wrapperState.initialChecked });
}
function Za(a, b) {
  var c = null == b.defaultValue ? "" : b.defaultValue, d = null != b.checked ? b.checked : b.defaultChecked;
  c = Sa(null != b.value ? b.value : c);
  a._wrapperState = { initialChecked: d, initialValue: c, controlled: "checkbox" === b.type || "radio" === b.type ? null != b.checked : null != b.value };
}
function ab(a, b) {
  b = b.checked;
  null != b && ta(a, "checked", b, false);
}
function bb(a, b) {
  ab(a, b);
  var c = Sa(b.value), d = b.type;
  if (null != c) if ("number" === d) {
    if (0 === c && "" === a.value || a.value != c) a.value = "" + c;
  } else a.value !== "" + c && (a.value = "" + c);
  else if ("submit" === d || "reset" === d) {
    a.removeAttribute("value");
    return;
  }
  b.hasOwnProperty("value") ? cb(a, b.type, c) : b.hasOwnProperty("defaultValue") && cb(a, b.type, Sa(b.defaultValue));
  null == b.checked && null != b.defaultChecked && (a.defaultChecked = !!b.defaultChecked);
}
function db(a, b, c) {
  if (b.hasOwnProperty("value") || b.hasOwnProperty("defaultValue")) {
    var d = b.type;
    if (!("submit" !== d && "reset" !== d || void 0 !== b.value && null !== b.value)) return;
    b = "" + a._wrapperState.initialValue;
    c || b === a.value || (a.value = b);
    a.defaultValue = b;
  }
  c = a.name;
  "" !== c && (a.name = "");
  a.defaultChecked = !!a._wrapperState.initialChecked;
  "" !== c && (a.name = c);
}
function cb(a, b, c) {
  if ("number" !== b || Xa(a.ownerDocument) !== a) null == c ? a.defaultValue = "" + a._wrapperState.initialValue : a.defaultValue !== "" + c && (a.defaultValue = "" + c);
}
var eb = Array.isArray;
function fb(a, b, c, d) {
  a = a.options;
  if (b) {
    b = {};
    for (var e = 0; e < c.length; e++) b["$" + c[e]] = true;
    for (c = 0; c < a.length; c++) e = b.hasOwnProperty("$" + a[c].value), a[c].selected !== e && (a[c].selected = e), e && d && (a[c].defaultSelected = true);
  } else {
    c = "" + Sa(c);
    b = null;
    for (e = 0; e < a.length; e++) {
      if (a[e].value === c) {
        a[e].selected = true;
        d && (a[e].defaultSelected = true);
        return;
      }
      null !== b || a[e].disabled || (b = a[e]);
    }
    null !== b && (b.selected = true);
  }
}
function gb(a, b) {
  if (null != b.dangerouslySetInnerHTML) throw Error(p$1(91));
  return A({}, b, { value: void 0, defaultValue: void 0, children: "" + a._wrapperState.initialValue });
}
function hb(a, b) {
  var c = b.value;
  if (null == c) {
    c = b.children;
    b = b.defaultValue;
    if (null != c) {
      if (null != b) throw Error(p$1(92));
      if (eb(c)) {
        if (1 < c.length) throw Error(p$1(93));
        c = c[0];
      }
      b = c;
    }
    null == b && (b = "");
    c = b;
  }
  a._wrapperState = { initialValue: Sa(c) };
}
function ib(a, b) {
  var c = Sa(b.value), d = Sa(b.defaultValue);
  null != c && (c = "" + c, c !== a.value && (a.value = c), null == b.defaultValue && a.defaultValue !== c && (a.defaultValue = c));
  null != d && (a.defaultValue = "" + d);
}
function jb(a) {
  var b = a.textContent;
  b === a._wrapperState.initialValue && "" !== b && null !== b && (a.value = b);
}
function kb(a) {
  switch (a) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function lb(a, b) {
  return null == a || "http://www.w3.org/1999/xhtml" === a ? kb(b) : "http://www.w3.org/2000/svg" === a && "foreignObject" === b ? "http://www.w3.org/1999/xhtml" : a;
}
var mb, nb = function(a) {
  return "undefined" !== typeof MSApp && MSApp.execUnsafeLocalFunction ? function(b, c, d, e) {
    MSApp.execUnsafeLocalFunction(function() {
      return a(b, c, d, e);
    });
  } : a;
}(function(a, b) {
  if ("http://www.w3.org/2000/svg" !== a.namespaceURI || "innerHTML" in a) a.innerHTML = b;
  else {
    mb = mb || document.createElement("div");
    mb.innerHTML = "<svg>" + b.valueOf().toString() + "</svg>";
    for (b = mb.firstChild; a.firstChild; ) a.removeChild(a.firstChild);
    for (; b.firstChild; ) a.appendChild(b.firstChild);
  }
});
function ob(a, b) {
  if (b) {
    var c = a.firstChild;
    if (c && c === a.lastChild && 3 === c.nodeType) {
      c.nodeValue = b;
      return;
    }
  }
  a.textContent = b;
}
var pb = {
  animationIterationCount: true,
  aspectRatio: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridArea: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true
}, qb = ["Webkit", "ms", "Moz", "O"];
Object.keys(pb).forEach(function(a) {
  qb.forEach(function(b) {
    b = b + a.charAt(0).toUpperCase() + a.substring(1);
    pb[b] = pb[a];
  });
});
function rb(a, b, c) {
  return null == b || "boolean" === typeof b || "" === b ? "" : c || "number" !== typeof b || 0 === b || pb.hasOwnProperty(a) && pb[a] ? ("" + b).trim() : b + "px";
}
function sb(a, b) {
  a = a.style;
  for (var c in b) if (b.hasOwnProperty(c)) {
    var d = 0 === c.indexOf("--"), e = rb(c, b[c], d);
    "float" === c && (c = "cssFloat");
    d ? a.setProperty(c, e) : a[c] = e;
  }
}
var tb = A({ menuitem: true }, { area: true, base: true, br: true, col: true, embed: true, hr: true, img: true, input: true, keygen: true, link: true, meta: true, param: true, source: true, track: true, wbr: true });
function ub(a, b) {
  if (b) {
    if (tb[a] && (null != b.children || null != b.dangerouslySetInnerHTML)) throw Error(p$1(137, a));
    if (null != b.dangerouslySetInnerHTML) {
      if (null != b.children) throw Error(p$1(60));
      if ("object" !== typeof b.dangerouslySetInnerHTML || !("__html" in b.dangerouslySetInnerHTML)) throw Error(p$1(61));
    }
    if (null != b.style && "object" !== typeof b.style) throw Error(p$1(62));
  }
}
function vb(a, b) {
  if (-1 === a.indexOf("-")) return "string" === typeof b.is;
  switch (a) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return false;
    default:
      return true;
  }
}
var wb = null;
function xb(a) {
  a = a.target || a.srcElement || window;
  a.correspondingUseElement && (a = a.correspondingUseElement);
  return 3 === a.nodeType ? a.parentNode : a;
}
var yb = null, zb = null, Ab = null;
function Bb(a) {
  if (a = Cb(a)) {
    if ("function" !== typeof yb) throw Error(p$1(280));
    var b = a.stateNode;
    b && (b = Db(b), yb(a.stateNode, a.type, b));
  }
}
function Eb(a) {
  zb ? Ab ? Ab.push(a) : Ab = [a] : zb = a;
}
function Fb() {
  if (zb) {
    var a = zb, b = Ab;
    Ab = zb = null;
    Bb(a);
    if (b) for (a = 0; a < b.length; a++) Bb(b[a]);
  }
}
function Gb(a, b) {
  return a(b);
}
function Hb() {
}
var Ib = false;
function Jb(a, b, c) {
  if (Ib) return a(b, c);
  Ib = true;
  try {
    return Gb(a, b, c);
  } finally {
    if (Ib = false, null !== zb || null !== Ab) Hb(), Fb();
  }
}
function Kb(a, b) {
  var c = a.stateNode;
  if (null === c) return null;
  var d = Db(c);
  if (null === d) return null;
  c = d[b];
  a: switch (b) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      (d = !d.disabled) || (a = a.type, d = !("button" === a || "input" === a || "select" === a || "textarea" === a));
      a = !d;
      break a;
    default:
      a = false;
  }
  if (a) return null;
  if (c && "function" !== typeof c) throw Error(p$1(231, b, typeof c));
  return c;
}
var Lb = false;
if (ia) try {
  var Mb = {};
  Object.defineProperty(Mb, "passive", { get: function() {
    Lb = true;
  } });
  window.addEventListener("test", Mb, Mb);
  window.removeEventListener("test", Mb, Mb);
} catch (a) {
  Lb = false;
}
function Nb(a, b, c, d, e, f2, g, h, k2) {
  var l2 = Array.prototype.slice.call(arguments, 3);
  try {
    b.apply(c, l2);
  } catch (m2) {
    this.onError(m2);
  }
}
var Ob = false, Pb = null, Qb = false, Rb = null, Sb = { onError: function(a) {
  Ob = true;
  Pb = a;
} };
function Tb(a, b, c, d, e, f2, g, h, k2) {
  Ob = false;
  Pb = null;
  Nb.apply(Sb, arguments);
}
function Ub(a, b, c, d, e, f2, g, h, k2) {
  Tb.apply(this, arguments);
  if (Ob) {
    if (Ob) {
      var l2 = Pb;
      Ob = false;
      Pb = null;
    } else throw Error(p$1(198));
    Qb || (Qb = true, Rb = l2);
  }
}
function Vb(a) {
  var b = a, c = a;
  if (a.alternate) for (; b.return; ) b = b.return;
  else {
    a = b;
    do
      b = a, 0 !== (b.flags & 4098) && (c = b.return), a = b.return;
    while (a);
  }
  return 3 === b.tag ? c : null;
}
function Wb(a) {
  if (13 === a.tag) {
    var b = a.memoizedState;
    null === b && (a = a.alternate, null !== a && (b = a.memoizedState));
    if (null !== b) return b.dehydrated;
  }
  return null;
}
function Xb(a) {
  if (Vb(a) !== a) throw Error(p$1(188));
}
function Yb(a) {
  var b = a.alternate;
  if (!b) {
    b = Vb(a);
    if (null === b) throw Error(p$1(188));
    return b !== a ? null : a;
  }
  for (var c = a, d = b; ; ) {
    var e = c.return;
    if (null === e) break;
    var f2 = e.alternate;
    if (null === f2) {
      d = e.return;
      if (null !== d) {
        c = d;
        continue;
      }
      break;
    }
    if (e.child === f2.child) {
      for (f2 = e.child; f2; ) {
        if (f2 === c) return Xb(e), a;
        if (f2 === d) return Xb(e), b;
        f2 = f2.sibling;
      }
      throw Error(p$1(188));
    }
    if (c.return !== d.return) c = e, d = f2;
    else {
      for (var g = false, h = e.child; h; ) {
        if (h === c) {
          g = true;
          c = e;
          d = f2;
          break;
        }
        if (h === d) {
          g = true;
          d = e;
          c = f2;
          break;
        }
        h = h.sibling;
      }
      if (!g) {
        for (h = f2.child; h; ) {
          if (h === c) {
            g = true;
            c = f2;
            d = e;
            break;
          }
          if (h === d) {
            g = true;
            d = f2;
            c = e;
            break;
          }
          h = h.sibling;
        }
        if (!g) throw Error(p$1(189));
      }
    }
    if (c.alternate !== d) throw Error(p$1(190));
  }
  if (3 !== c.tag) throw Error(p$1(188));
  return c.stateNode.current === c ? a : b;
}
function Zb(a) {
  a = Yb(a);
  return null !== a ? $b(a) : null;
}
function $b(a) {
  if (5 === a.tag || 6 === a.tag) return a;
  for (a = a.child; null !== a; ) {
    var b = $b(a);
    if (null !== b) return b;
    a = a.sibling;
  }
  return null;
}
var ac = ca.unstable_scheduleCallback, bc = ca.unstable_cancelCallback, cc = ca.unstable_shouldYield, dc = ca.unstable_requestPaint, B = ca.unstable_now, ec = ca.unstable_getCurrentPriorityLevel, fc = ca.unstable_ImmediatePriority, gc = ca.unstable_UserBlockingPriority, hc = ca.unstable_NormalPriority, ic = ca.unstable_LowPriority, jc = ca.unstable_IdlePriority, kc = null, lc = null;
function mc(a) {
  if (lc && "function" === typeof lc.onCommitFiberRoot) try {
    lc.onCommitFiberRoot(kc, a, void 0, 128 === (a.current.flags & 128));
  } catch (b) {
  }
}
var oc = Math.clz32 ? Math.clz32 : nc, pc = Math.log, qc = Math.LN2;
function nc(a) {
  a >>>= 0;
  return 0 === a ? 32 : 31 - (pc(a) / qc | 0) | 0;
}
var rc = 64, sc = 4194304;
function tc(a) {
  switch (a & -a) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return a & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return a & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return a;
  }
}
function uc(a, b) {
  var c = a.pendingLanes;
  if (0 === c) return 0;
  var d = 0, e = a.suspendedLanes, f2 = a.pingedLanes, g = c & 268435455;
  if (0 !== g) {
    var h = g & ~e;
    0 !== h ? d = tc(h) : (f2 &= g, 0 !== f2 && (d = tc(f2)));
  } else g = c & ~e, 0 !== g ? d = tc(g) : 0 !== f2 && (d = tc(f2));
  if (0 === d) return 0;
  if (0 !== b && b !== d && 0 === (b & e) && (e = d & -d, f2 = b & -b, e >= f2 || 16 === e && 0 !== (f2 & 4194240))) return b;
  0 !== (d & 4) && (d |= c & 16);
  b = a.entangledLanes;
  if (0 !== b) for (a = a.entanglements, b &= d; 0 < b; ) c = 31 - oc(b), e = 1 << c, d |= a[c], b &= ~e;
  return d;
}
function vc(a, b) {
  switch (a) {
    case 1:
    case 2:
    case 4:
      return b + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return b + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function wc(a, b) {
  for (var c = a.suspendedLanes, d = a.pingedLanes, e = a.expirationTimes, f2 = a.pendingLanes; 0 < f2; ) {
    var g = 31 - oc(f2), h = 1 << g, k2 = e[g];
    if (-1 === k2) {
      if (0 === (h & c) || 0 !== (h & d)) e[g] = vc(h, b);
    } else k2 <= b && (a.expiredLanes |= h);
    f2 &= ~h;
  }
}
function xc(a) {
  a = a.pendingLanes & -1073741825;
  return 0 !== a ? a : a & 1073741824 ? 1073741824 : 0;
}
function yc() {
  var a = rc;
  rc <<= 1;
  0 === (rc & 4194240) && (rc = 64);
  return a;
}
function zc(a) {
  for (var b = [], c = 0; 31 > c; c++) b.push(a);
  return b;
}
function Ac(a, b, c) {
  a.pendingLanes |= b;
  536870912 !== b && (a.suspendedLanes = 0, a.pingedLanes = 0);
  a = a.eventTimes;
  b = 31 - oc(b);
  a[b] = c;
}
function Bc(a, b) {
  var c = a.pendingLanes & ~b;
  a.pendingLanes = b;
  a.suspendedLanes = 0;
  a.pingedLanes = 0;
  a.expiredLanes &= b;
  a.mutableReadLanes &= b;
  a.entangledLanes &= b;
  b = a.entanglements;
  var d = a.eventTimes;
  for (a = a.expirationTimes; 0 < c; ) {
    var e = 31 - oc(c), f2 = 1 << e;
    b[e] = 0;
    d[e] = -1;
    a[e] = -1;
    c &= ~f2;
  }
}
function Cc(a, b) {
  var c = a.entangledLanes |= b;
  for (a = a.entanglements; c; ) {
    var d = 31 - oc(c), e = 1 << d;
    e & b | a[d] & b && (a[d] |= b);
    c &= ~e;
  }
}
var C = 0;
function Dc(a) {
  a &= -a;
  return 1 < a ? 4 < a ? 0 !== (a & 268435455) ? 16 : 536870912 : 4 : 1;
}
var Ec, Fc, Gc, Hc, Ic, Jc = false, Kc = [], Lc = null, Mc = null, Nc = null, Oc = /* @__PURE__ */ new Map(), Pc = /* @__PURE__ */ new Map(), Qc = [], Rc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
function Sc(a, b) {
  switch (a) {
    case "focusin":
    case "focusout":
      Lc = null;
      break;
    case "dragenter":
    case "dragleave":
      Mc = null;
      break;
    case "mouseover":
    case "mouseout":
      Nc = null;
      break;
    case "pointerover":
    case "pointerout":
      Oc.delete(b.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      Pc.delete(b.pointerId);
  }
}
function Tc(a, b, c, d, e, f2) {
  if (null === a || a.nativeEvent !== f2) return a = { blockedOn: b, domEventName: c, eventSystemFlags: d, nativeEvent: f2, targetContainers: [e] }, null !== b && (b = Cb(b), null !== b && Fc(b)), a;
  a.eventSystemFlags |= d;
  b = a.targetContainers;
  null !== e && -1 === b.indexOf(e) && b.push(e);
  return a;
}
function Uc(a, b, c, d, e) {
  switch (b) {
    case "focusin":
      return Lc = Tc(Lc, a, b, c, d, e), true;
    case "dragenter":
      return Mc = Tc(Mc, a, b, c, d, e), true;
    case "mouseover":
      return Nc = Tc(Nc, a, b, c, d, e), true;
    case "pointerover":
      var f2 = e.pointerId;
      Oc.set(f2, Tc(Oc.get(f2) || null, a, b, c, d, e));
      return true;
    case "gotpointercapture":
      return f2 = e.pointerId, Pc.set(f2, Tc(Pc.get(f2) || null, a, b, c, d, e)), true;
  }
  return false;
}
function Vc(a) {
  var b = Wc(a.target);
  if (null !== b) {
    var c = Vb(b);
    if (null !== c) {
      if (b = c.tag, 13 === b) {
        if (b = Wb(c), null !== b) {
          a.blockedOn = b;
          Ic(a.priority, function() {
            Gc(c);
          });
          return;
        }
      } else if (3 === b && c.stateNode.current.memoizedState.isDehydrated) {
        a.blockedOn = 3 === c.tag ? c.stateNode.containerInfo : null;
        return;
      }
    }
  }
  a.blockedOn = null;
}
function Xc(a) {
  if (null !== a.blockedOn) return false;
  for (var b = a.targetContainers; 0 < b.length; ) {
    var c = Yc(a.domEventName, a.eventSystemFlags, b[0], a.nativeEvent);
    if (null === c) {
      c = a.nativeEvent;
      var d = new c.constructor(c.type, c);
      wb = d;
      c.target.dispatchEvent(d);
      wb = null;
    } else return b = Cb(c), null !== b && Fc(b), a.blockedOn = c, false;
    b.shift();
  }
  return true;
}
function Zc(a, b, c) {
  Xc(a) && c.delete(b);
}
function $c() {
  Jc = false;
  null !== Lc && Xc(Lc) && (Lc = null);
  null !== Mc && Xc(Mc) && (Mc = null);
  null !== Nc && Xc(Nc) && (Nc = null);
  Oc.forEach(Zc);
  Pc.forEach(Zc);
}
function ad(a, b) {
  a.blockedOn === b && (a.blockedOn = null, Jc || (Jc = true, ca.unstable_scheduleCallback(ca.unstable_NormalPriority, $c)));
}
function bd(a) {
  function b(b2) {
    return ad(b2, a);
  }
  if (0 < Kc.length) {
    ad(Kc[0], a);
    for (var c = 1; c < Kc.length; c++) {
      var d = Kc[c];
      d.blockedOn === a && (d.blockedOn = null);
    }
  }
  null !== Lc && ad(Lc, a);
  null !== Mc && ad(Mc, a);
  null !== Nc && ad(Nc, a);
  Oc.forEach(b);
  Pc.forEach(b);
  for (c = 0; c < Qc.length; c++) d = Qc[c], d.blockedOn === a && (d.blockedOn = null);
  for (; 0 < Qc.length && (c = Qc[0], null === c.blockedOn); ) Vc(c), null === c.blockedOn && Qc.shift();
}
var cd = ua.ReactCurrentBatchConfig, dd = true;
function ed(a, b, c, d) {
  var e = C, f2 = cd.transition;
  cd.transition = null;
  try {
    C = 1, fd(a, b, c, d);
  } finally {
    C = e, cd.transition = f2;
  }
}
function gd(a, b, c, d) {
  var e = C, f2 = cd.transition;
  cd.transition = null;
  try {
    C = 4, fd(a, b, c, d);
  } finally {
    C = e, cd.transition = f2;
  }
}
function fd(a, b, c, d) {
  if (dd) {
    var e = Yc(a, b, c, d);
    if (null === e) hd(a, b, d, id, c), Sc(a, d);
    else if (Uc(e, a, b, c, d)) d.stopPropagation();
    else if (Sc(a, d), b & 4 && -1 < Rc.indexOf(a)) {
      for (; null !== e; ) {
        var f2 = Cb(e);
        null !== f2 && Ec(f2);
        f2 = Yc(a, b, c, d);
        null === f2 && hd(a, b, d, id, c);
        if (f2 === e) break;
        e = f2;
      }
      null !== e && d.stopPropagation();
    } else hd(a, b, d, null, c);
  }
}
var id = null;
function Yc(a, b, c, d) {
  id = null;
  a = xb(d);
  a = Wc(a);
  if (null !== a) if (b = Vb(a), null === b) a = null;
  else if (c = b.tag, 13 === c) {
    a = Wb(b);
    if (null !== a) return a;
    a = null;
  } else if (3 === c) {
    if (b.stateNode.current.memoizedState.isDehydrated) return 3 === b.tag ? b.stateNode.containerInfo : null;
    a = null;
  } else b !== a && (a = null);
  id = a;
  return null;
}
function jd(a) {
  switch (a) {
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return 1;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "toggle":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return 4;
    case "message":
      switch (ec()) {
        case fc:
          return 1;
        case gc:
          return 4;
        case hc:
        case ic:
          return 16;
        case jc:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var kd = null, ld = null, md = null;
function nd() {
  if (md) return md;
  var a, b = ld, c = b.length, d, e = "value" in kd ? kd.value : kd.textContent, f2 = e.length;
  for (a = 0; a < c && b[a] === e[a]; a++) ;
  var g = c - a;
  for (d = 1; d <= g && b[c - d] === e[f2 - d]; d++) ;
  return md = e.slice(a, 1 < d ? 1 - d : void 0);
}
function od(a) {
  var b = a.keyCode;
  "charCode" in a ? (a = a.charCode, 0 === a && 13 === b && (a = 13)) : a = b;
  10 === a && (a = 13);
  return 32 <= a || 13 === a ? a : 0;
}
function pd() {
  return true;
}
function qd() {
  return false;
}
function rd(a) {
  function b(b2, d, e, f2, g) {
    this._reactName = b2;
    this._targetInst = e;
    this.type = d;
    this.nativeEvent = f2;
    this.target = g;
    this.currentTarget = null;
    for (var c in a) a.hasOwnProperty(c) && (b2 = a[c], this[c] = b2 ? b2(f2) : f2[c]);
    this.isDefaultPrevented = (null != f2.defaultPrevented ? f2.defaultPrevented : false === f2.returnValue) ? pd : qd;
    this.isPropagationStopped = qd;
    return this;
  }
  A(b.prototype, { preventDefault: function() {
    this.defaultPrevented = true;
    var a2 = this.nativeEvent;
    a2 && (a2.preventDefault ? a2.preventDefault() : "unknown" !== typeof a2.returnValue && (a2.returnValue = false), this.isDefaultPrevented = pd);
  }, stopPropagation: function() {
    var a2 = this.nativeEvent;
    a2 && (a2.stopPropagation ? a2.stopPropagation() : "unknown" !== typeof a2.cancelBubble && (a2.cancelBubble = true), this.isPropagationStopped = pd);
  }, persist: function() {
  }, isPersistent: pd });
  return b;
}
var sd = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(a) {
  return a.timeStamp || Date.now();
}, defaultPrevented: 0, isTrusted: 0 }, td = rd(sd), ud = A({}, sd, { view: 0, detail: 0 }), vd = rd(ud), wd, xd, yd, Ad = A({}, ud, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: zd, button: 0, buttons: 0, relatedTarget: function(a) {
  return void 0 === a.relatedTarget ? a.fromElement === a.srcElement ? a.toElement : a.fromElement : a.relatedTarget;
}, movementX: function(a) {
  if ("movementX" in a) return a.movementX;
  a !== yd && (yd && "mousemove" === a.type ? (wd = a.screenX - yd.screenX, xd = a.screenY - yd.screenY) : xd = wd = 0, yd = a);
  return wd;
}, movementY: function(a) {
  return "movementY" in a ? a.movementY : xd;
} }), Bd = rd(Ad), Cd = A({}, Ad, { dataTransfer: 0 }), Dd = rd(Cd), Ed = A({}, ud, { relatedTarget: 0 }), Fd = rd(Ed), Gd = A({}, sd, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Hd = rd(Gd), Id = A({}, sd, { clipboardData: function(a) {
  return "clipboardData" in a ? a.clipboardData : window.clipboardData;
} }), Jd = rd(Id), Kd = A({}, sd, { data: 0 }), Ld = rd(Kd), Md = {
  Esc: "Escape",
  Spacebar: " ",
  Left: "ArrowLeft",
  Up: "ArrowUp",
  Right: "ArrowRight",
  Down: "ArrowDown",
  Del: "Delete",
  Win: "OS",
  Menu: "ContextMenu",
  Apps: "ContextMenu",
  Scroll: "ScrollLock",
  MozPrintableKey: "Unidentified"
}, Nd = {
  8: "Backspace",
  9: "Tab",
  12: "Clear",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  19: "Pause",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  45: "Insert",
  46: "Delete",
  112: "F1",
  113: "F2",
  114: "F3",
  115: "F4",
  116: "F5",
  117: "F6",
  118: "F7",
  119: "F8",
  120: "F9",
  121: "F10",
  122: "F11",
  123: "F12",
  144: "NumLock",
  145: "ScrollLock",
  224: "Meta"
}, Od = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
function Pd(a) {
  var b = this.nativeEvent;
  return b.getModifierState ? b.getModifierState(a) : (a = Od[a]) ? !!b[a] : false;
}
function zd() {
  return Pd;
}
var Qd = A({}, ud, { key: function(a) {
  if (a.key) {
    var b = Md[a.key] || a.key;
    if ("Unidentified" !== b) return b;
  }
  return "keypress" === a.type ? (a = od(a), 13 === a ? "Enter" : String.fromCharCode(a)) : "keydown" === a.type || "keyup" === a.type ? Nd[a.keyCode] || "Unidentified" : "";
}, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: zd, charCode: function(a) {
  return "keypress" === a.type ? od(a) : 0;
}, keyCode: function(a) {
  return "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
}, which: function(a) {
  return "keypress" === a.type ? od(a) : "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
} }), Rd = rd(Qd), Sd = A({}, Ad, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Td = rd(Sd), Ud = A({}, ud, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: zd }), Vd = rd(Ud), Wd = A({}, sd, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Xd = rd(Wd), Yd = A({}, Ad, {
  deltaX: function(a) {
    return "deltaX" in a ? a.deltaX : "wheelDeltaX" in a ? -a.wheelDeltaX : 0;
  },
  deltaY: function(a) {
    return "deltaY" in a ? a.deltaY : "wheelDeltaY" in a ? -a.wheelDeltaY : "wheelDelta" in a ? -a.wheelDelta : 0;
  },
  deltaZ: 0,
  deltaMode: 0
}), Zd = rd(Yd), $d = [9, 13, 27, 32], ae = ia && "CompositionEvent" in window, be = null;
ia && "documentMode" in document && (be = document.documentMode);
var ce = ia && "TextEvent" in window && !be, de = ia && (!ae || be && 8 < be && 11 >= be), ee = String.fromCharCode(32), fe = false;
function ge(a, b) {
  switch (a) {
    case "keyup":
      return -1 !== $d.indexOf(b.keyCode);
    case "keydown":
      return 229 !== b.keyCode;
    case "keypress":
    case "mousedown":
    case "focusout":
      return true;
    default:
      return false;
  }
}
function he(a) {
  a = a.detail;
  return "object" === typeof a && "data" in a ? a.data : null;
}
var ie = false;
function je(a, b) {
  switch (a) {
    case "compositionend":
      return he(b);
    case "keypress":
      if (32 !== b.which) return null;
      fe = true;
      return ee;
    case "textInput":
      return a = b.data, a === ee && fe ? null : a;
    default:
      return null;
  }
}
function ke(a, b) {
  if (ie) return "compositionend" === a || !ae && ge(a, b) ? (a = nd(), md = ld = kd = null, ie = false, a) : null;
  switch (a) {
    case "paste":
      return null;
    case "keypress":
      if (!(b.ctrlKey || b.altKey || b.metaKey) || b.ctrlKey && b.altKey) {
        if (b.char && 1 < b.char.length) return b.char;
        if (b.which) return String.fromCharCode(b.which);
      }
      return null;
    case "compositionend":
      return de && "ko" !== b.locale ? null : b.data;
    default:
      return null;
  }
}
var le = { color: true, date: true, datetime: true, "datetime-local": true, email: true, month: true, number: true, password: true, range: true, search: true, tel: true, text: true, time: true, url: true, week: true };
function me(a) {
  var b = a && a.nodeName && a.nodeName.toLowerCase();
  return "input" === b ? !!le[a.type] : "textarea" === b ? true : false;
}
function ne(a, b, c, d) {
  Eb(d);
  b = oe(b, "onChange");
  0 < b.length && (c = new td("onChange", "change", null, c, d), a.push({ event: c, listeners: b }));
}
var pe = null, qe = null;
function re(a) {
  se(a, 0);
}
function te(a) {
  var b = ue(a);
  if (Wa(b)) return a;
}
function ve(a, b) {
  if ("change" === a) return b;
}
var we = false;
if (ia) {
  var xe;
  if (ia) {
    var ye = "oninput" in document;
    if (!ye) {
      var ze = document.createElement("div");
      ze.setAttribute("oninput", "return;");
      ye = "function" === typeof ze.oninput;
    }
    xe = ye;
  } else xe = false;
  we = xe && (!document.documentMode || 9 < document.documentMode);
}
function Ae() {
  pe && (pe.detachEvent("onpropertychange", Be), qe = pe = null);
}
function Be(a) {
  if ("value" === a.propertyName && te(qe)) {
    var b = [];
    ne(b, qe, a, xb(a));
    Jb(re, b);
  }
}
function Ce(a, b, c) {
  "focusin" === a ? (Ae(), pe = b, qe = c, pe.attachEvent("onpropertychange", Be)) : "focusout" === a && Ae();
}
function De(a) {
  if ("selectionchange" === a || "keyup" === a || "keydown" === a) return te(qe);
}
function Ee(a, b) {
  if ("click" === a) return te(b);
}
function Fe(a, b) {
  if ("input" === a || "change" === a) return te(b);
}
function Ge(a, b) {
  return a === b && (0 !== a || 1 / a === 1 / b) || a !== a && b !== b;
}
var He = "function" === typeof Object.is ? Object.is : Ge;
function Ie(a, b) {
  if (He(a, b)) return true;
  if ("object" !== typeof a || null === a || "object" !== typeof b || null === b) return false;
  var c = Object.keys(a), d = Object.keys(b);
  if (c.length !== d.length) return false;
  for (d = 0; d < c.length; d++) {
    var e = c[d];
    if (!ja.call(b, e) || !He(a[e], b[e])) return false;
  }
  return true;
}
function Je(a) {
  for (; a && a.firstChild; ) a = a.firstChild;
  return a;
}
function Ke(a, b) {
  var c = Je(a);
  a = 0;
  for (var d; c; ) {
    if (3 === c.nodeType) {
      d = a + c.textContent.length;
      if (a <= b && d >= b) return { node: c, offset: b - a };
      a = d;
    }
    a: {
      for (; c; ) {
        if (c.nextSibling) {
          c = c.nextSibling;
          break a;
        }
        c = c.parentNode;
      }
      c = void 0;
    }
    c = Je(c);
  }
}
function Le(a, b) {
  return a && b ? a === b ? true : a && 3 === a.nodeType ? false : b && 3 === b.nodeType ? Le(a, b.parentNode) : "contains" in a ? a.contains(b) : a.compareDocumentPosition ? !!(a.compareDocumentPosition(b) & 16) : false : false;
}
function Me() {
  for (var a = window, b = Xa(); b instanceof a.HTMLIFrameElement; ) {
    try {
      var c = "string" === typeof b.contentWindow.location.href;
    } catch (d) {
      c = false;
    }
    if (c) a = b.contentWindow;
    else break;
    b = Xa(a.document);
  }
  return b;
}
function Ne(a) {
  var b = a && a.nodeName && a.nodeName.toLowerCase();
  return b && ("input" === b && ("text" === a.type || "search" === a.type || "tel" === a.type || "url" === a.type || "password" === a.type) || "textarea" === b || "true" === a.contentEditable);
}
function Oe(a) {
  var b = Me(), c = a.focusedElem, d = a.selectionRange;
  if (b !== c && c && c.ownerDocument && Le(c.ownerDocument.documentElement, c)) {
    if (null !== d && Ne(c)) {
      if (b = d.start, a = d.end, void 0 === a && (a = b), "selectionStart" in c) c.selectionStart = b, c.selectionEnd = Math.min(a, c.value.length);
      else if (a = (b = c.ownerDocument || document) && b.defaultView || window, a.getSelection) {
        a = a.getSelection();
        var e = c.textContent.length, f2 = Math.min(d.start, e);
        d = void 0 === d.end ? f2 : Math.min(d.end, e);
        !a.extend && f2 > d && (e = d, d = f2, f2 = e);
        e = Ke(c, f2);
        var g = Ke(
          c,
          d
        );
        e && g && (1 !== a.rangeCount || a.anchorNode !== e.node || a.anchorOffset !== e.offset || a.focusNode !== g.node || a.focusOffset !== g.offset) && (b = b.createRange(), b.setStart(e.node, e.offset), a.removeAllRanges(), f2 > d ? (a.addRange(b), a.extend(g.node, g.offset)) : (b.setEnd(g.node, g.offset), a.addRange(b)));
      }
    }
    b = [];
    for (a = c; a = a.parentNode; ) 1 === a.nodeType && b.push({ element: a, left: a.scrollLeft, top: a.scrollTop });
    "function" === typeof c.focus && c.focus();
    for (c = 0; c < b.length; c++) a = b[c], a.element.scrollLeft = a.left, a.element.scrollTop = a.top;
  }
}
var Pe = ia && "documentMode" in document && 11 >= document.documentMode, Qe = null, Re = null, Se = null, Te = false;
function Ue(a, b, c) {
  var d = c.window === c ? c.document : 9 === c.nodeType ? c : c.ownerDocument;
  Te || null == Qe || Qe !== Xa(d) || (d = Qe, "selectionStart" in d && Ne(d) ? d = { start: d.selectionStart, end: d.selectionEnd } : (d = (d.ownerDocument && d.ownerDocument.defaultView || window).getSelection(), d = { anchorNode: d.anchorNode, anchorOffset: d.anchorOffset, focusNode: d.focusNode, focusOffset: d.focusOffset }), Se && Ie(Se, d) || (Se = d, d = oe(Re, "onSelect"), 0 < d.length && (b = new td("onSelect", "select", null, b, c), a.push({ event: b, listeners: d }), b.target = Qe)));
}
function Ve(a, b) {
  var c = {};
  c[a.toLowerCase()] = b.toLowerCase();
  c["Webkit" + a] = "webkit" + b;
  c["Moz" + a] = "moz" + b;
  return c;
}
var We = { animationend: Ve("Animation", "AnimationEnd"), animationiteration: Ve("Animation", "AnimationIteration"), animationstart: Ve("Animation", "AnimationStart"), transitionend: Ve("Transition", "TransitionEnd") }, Xe = {}, Ye = {};
ia && (Ye = document.createElement("div").style, "AnimationEvent" in window || (delete We.animationend.animation, delete We.animationiteration.animation, delete We.animationstart.animation), "TransitionEvent" in window || delete We.transitionend.transition);
function Ze(a) {
  if (Xe[a]) return Xe[a];
  if (!We[a]) return a;
  var b = We[a], c;
  for (c in b) if (b.hasOwnProperty(c) && c in Ye) return Xe[a] = b[c];
  return a;
}
var $e = Ze("animationend"), af = Ze("animationiteration"), bf = Ze("animationstart"), cf = Ze("transitionend"), df = /* @__PURE__ */ new Map(), ef = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
function ff(a, b) {
  df.set(a, b);
  fa(b, [a]);
}
for (var gf = 0; gf < ef.length; gf++) {
  var hf = ef[gf], jf = hf.toLowerCase(), kf = hf[0].toUpperCase() + hf.slice(1);
  ff(jf, "on" + kf);
}
ff($e, "onAnimationEnd");
ff(af, "onAnimationIteration");
ff(bf, "onAnimationStart");
ff("dblclick", "onDoubleClick");
ff("focusin", "onFocus");
ff("focusout", "onBlur");
ff(cf, "onTransitionEnd");
ha("onMouseEnter", ["mouseout", "mouseover"]);
ha("onMouseLeave", ["mouseout", "mouseover"]);
ha("onPointerEnter", ["pointerout", "pointerover"]);
ha("onPointerLeave", ["pointerout", "pointerover"]);
fa("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
fa("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
fa("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
fa("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
var lf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), mf = new Set("cancel close invalid load scroll toggle".split(" ").concat(lf));
function nf(a, b, c) {
  var d = a.type || "unknown-event";
  a.currentTarget = c;
  Ub(d, b, void 0, a);
  a.currentTarget = null;
}
function se(a, b) {
  b = 0 !== (b & 4);
  for (var c = 0; c < a.length; c++) {
    var d = a[c], e = d.event;
    d = d.listeners;
    a: {
      var f2 = void 0;
      if (b) for (var g = d.length - 1; 0 <= g; g--) {
        var h = d[g], k2 = h.instance, l2 = h.currentTarget;
        h = h.listener;
        if (k2 !== f2 && e.isPropagationStopped()) break a;
        nf(e, h, l2);
        f2 = k2;
      }
      else for (g = 0; g < d.length; g++) {
        h = d[g];
        k2 = h.instance;
        l2 = h.currentTarget;
        h = h.listener;
        if (k2 !== f2 && e.isPropagationStopped()) break a;
        nf(e, h, l2);
        f2 = k2;
      }
    }
  }
  if (Qb) throw a = Rb, Qb = false, Rb = null, a;
}
function D(a, b) {
  var c = b[of];
  void 0 === c && (c = b[of] = /* @__PURE__ */ new Set());
  var d = a + "__bubble";
  c.has(d) || (pf(b, a, 2, false), c.add(d));
}
function qf(a, b, c) {
  var d = 0;
  b && (d |= 4);
  pf(c, a, d, b);
}
var rf = "_reactListening" + Math.random().toString(36).slice(2);
function sf(a) {
  if (!a[rf]) {
    a[rf] = true;
    da.forEach(function(b2) {
      "selectionchange" !== b2 && (mf.has(b2) || qf(b2, false, a), qf(b2, true, a));
    });
    var b = 9 === a.nodeType ? a : a.ownerDocument;
    null === b || b[rf] || (b[rf] = true, qf("selectionchange", false, b));
  }
}
function pf(a, b, c, d) {
  switch (jd(b)) {
    case 1:
      var e = ed;
      break;
    case 4:
      e = gd;
      break;
    default:
      e = fd;
  }
  c = e.bind(null, b, c, a);
  e = void 0;
  !Lb || "touchstart" !== b && "touchmove" !== b && "wheel" !== b || (e = true);
  d ? void 0 !== e ? a.addEventListener(b, c, { capture: true, passive: e }) : a.addEventListener(b, c, true) : void 0 !== e ? a.addEventListener(b, c, { passive: e }) : a.addEventListener(b, c, false);
}
function hd(a, b, c, d, e) {
  var f2 = d;
  if (0 === (b & 1) && 0 === (b & 2) && null !== d) a: for (; ; ) {
    if (null === d) return;
    var g = d.tag;
    if (3 === g || 4 === g) {
      var h = d.stateNode.containerInfo;
      if (h === e || 8 === h.nodeType && h.parentNode === e) break;
      if (4 === g) for (g = d.return; null !== g; ) {
        var k2 = g.tag;
        if (3 === k2 || 4 === k2) {
          if (k2 = g.stateNode.containerInfo, k2 === e || 8 === k2.nodeType && k2.parentNode === e) return;
        }
        g = g.return;
      }
      for (; null !== h; ) {
        g = Wc(h);
        if (null === g) return;
        k2 = g.tag;
        if (5 === k2 || 6 === k2) {
          d = f2 = g;
          continue a;
        }
        h = h.parentNode;
      }
    }
    d = d.return;
  }
  Jb(function() {
    var d2 = f2, e2 = xb(c), g2 = [];
    a: {
      var h2 = df.get(a);
      if (void 0 !== h2) {
        var k3 = td, n2 = a;
        switch (a) {
          case "keypress":
            if (0 === od(c)) break a;
          case "keydown":
          case "keyup":
            k3 = Rd;
            break;
          case "focusin":
            n2 = "focus";
            k3 = Fd;
            break;
          case "focusout":
            n2 = "blur";
            k3 = Fd;
            break;
          case "beforeblur":
          case "afterblur":
            k3 = Fd;
            break;
          case "click":
            if (2 === c.button) break a;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            k3 = Bd;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            k3 = Dd;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            k3 = Vd;
            break;
          case $e:
          case af:
          case bf:
            k3 = Hd;
            break;
          case cf:
            k3 = Xd;
            break;
          case "scroll":
            k3 = vd;
            break;
          case "wheel":
            k3 = Zd;
            break;
          case "copy":
          case "cut":
          case "paste":
            k3 = Jd;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            k3 = Td;
        }
        var t2 = 0 !== (b & 4), J2 = !t2 && "scroll" === a, x2 = t2 ? null !== h2 ? h2 + "Capture" : null : h2;
        t2 = [];
        for (var w2 = d2, u2; null !== w2; ) {
          u2 = w2;
          var F2 = u2.stateNode;
          5 === u2.tag && null !== F2 && (u2 = F2, null !== x2 && (F2 = Kb(w2, x2), null != F2 && t2.push(tf(w2, F2, u2))));
          if (J2) break;
          w2 = w2.return;
        }
        0 < t2.length && (h2 = new k3(h2, n2, null, c, e2), g2.push({ event: h2, listeners: t2 }));
      }
    }
    if (0 === (b & 7)) {
      a: {
        h2 = "mouseover" === a || "pointerover" === a;
        k3 = "mouseout" === a || "pointerout" === a;
        if (h2 && c !== wb && (n2 = c.relatedTarget || c.fromElement) && (Wc(n2) || n2[uf])) break a;
        if (k3 || h2) {
          h2 = e2.window === e2 ? e2 : (h2 = e2.ownerDocument) ? h2.defaultView || h2.parentWindow : window;
          if (k3) {
            if (n2 = c.relatedTarget || c.toElement, k3 = d2, n2 = n2 ? Wc(n2) : null, null !== n2 && (J2 = Vb(n2), n2 !== J2 || 5 !== n2.tag && 6 !== n2.tag)) n2 = null;
          } else k3 = null, n2 = d2;
          if (k3 !== n2) {
            t2 = Bd;
            F2 = "onMouseLeave";
            x2 = "onMouseEnter";
            w2 = "mouse";
            if ("pointerout" === a || "pointerover" === a) t2 = Td, F2 = "onPointerLeave", x2 = "onPointerEnter", w2 = "pointer";
            J2 = null == k3 ? h2 : ue(k3);
            u2 = null == n2 ? h2 : ue(n2);
            h2 = new t2(F2, w2 + "leave", k3, c, e2);
            h2.target = J2;
            h2.relatedTarget = u2;
            F2 = null;
            Wc(e2) === d2 && (t2 = new t2(x2, w2 + "enter", n2, c, e2), t2.target = u2, t2.relatedTarget = J2, F2 = t2);
            J2 = F2;
            if (k3 && n2) b: {
              t2 = k3;
              x2 = n2;
              w2 = 0;
              for (u2 = t2; u2; u2 = vf(u2)) w2++;
              u2 = 0;
              for (F2 = x2; F2; F2 = vf(F2)) u2++;
              for (; 0 < w2 - u2; ) t2 = vf(t2), w2--;
              for (; 0 < u2 - w2; ) x2 = vf(x2), u2--;
              for (; w2--; ) {
                if (t2 === x2 || null !== x2 && t2 === x2.alternate) break b;
                t2 = vf(t2);
                x2 = vf(x2);
              }
              t2 = null;
            }
            else t2 = null;
            null !== k3 && wf(g2, h2, k3, t2, false);
            null !== n2 && null !== J2 && wf(g2, J2, n2, t2, true);
          }
        }
      }
      a: {
        h2 = d2 ? ue(d2) : window;
        k3 = h2.nodeName && h2.nodeName.toLowerCase();
        if ("select" === k3 || "input" === k3 && "file" === h2.type) var na = ve;
        else if (me(h2)) if (we) na = Fe;
        else {
          na = De;
          var xa = Ce;
        }
        else (k3 = h2.nodeName) && "input" === k3.toLowerCase() && ("checkbox" === h2.type || "radio" === h2.type) && (na = Ee);
        if (na && (na = na(a, d2))) {
          ne(g2, na, c, e2);
          break a;
        }
        xa && xa(a, h2, d2);
        "focusout" === a && (xa = h2._wrapperState) && xa.controlled && "number" === h2.type && cb(h2, "number", h2.value);
      }
      xa = d2 ? ue(d2) : window;
      switch (a) {
        case "focusin":
          if (me(xa) || "true" === xa.contentEditable) Qe = xa, Re = d2, Se = null;
          break;
        case "focusout":
          Se = Re = Qe = null;
          break;
        case "mousedown":
          Te = true;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          Te = false;
          Ue(g2, c, e2);
          break;
        case "selectionchange":
          if (Pe) break;
        case "keydown":
        case "keyup":
          Ue(g2, c, e2);
      }
      var $a;
      if (ae) b: {
        switch (a) {
          case "compositionstart":
            var ba = "onCompositionStart";
            break b;
          case "compositionend":
            ba = "onCompositionEnd";
            break b;
          case "compositionupdate":
            ba = "onCompositionUpdate";
            break b;
        }
        ba = void 0;
      }
      else ie ? ge(a, c) && (ba = "onCompositionEnd") : "keydown" === a && 229 === c.keyCode && (ba = "onCompositionStart");
      ba && (de && "ko" !== c.locale && (ie || "onCompositionStart" !== ba ? "onCompositionEnd" === ba && ie && ($a = nd()) : (kd = e2, ld = "value" in kd ? kd.value : kd.textContent, ie = true)), xa = oe(d2, ba), 0 < xa.length && (ba = new Ld(ba, a, null, c, e2), g2.push({ event: ba, listeners: xa }), $a ? ba.data = $a : ($a = he(c), null !== $a && (ba.data = $a))));
      if ($a = ce ? je(a, c) : ke(a, c)) d2 = oe(d2, "onBeforeInput"), 0 < d2.length && (e2 = new Ld("onBeforeInput", "beforeinput", null, c, e2), g2.push({ event: e2, listeners: d2 }), e2.data = $a);
    }
    se(g2, b);
  });
}
function tf(a, b, c) {
  return { instance: a, listener: b, currentTarget: c };
}
function oe(a, b) {
  for (var c = b + "Capture", d = []; null !== a; ) {
    var e = a, f2 = e.stateNode;
    5 === e.tag && null !== f2 && (e = f2, f2 = Kb(a, c), null != f2 && d.unshift(tf(a, f2, e)), f2 = Kb(a, b), null != f2 && d.push(tf(a, f2, e)));
    a = a.return;
  }
  return d;
}
function vf(a) {
  if (null === a) return null;
  do
    a = a.return;
  while (a && 5 !== a.tag);
  return a ? a : null;
}
function wf(a, b, c, d, e) {
  for (var f2 = b._reactName, g = []; null !== c && c !== d; ) {
    var h = c, k2 = h.alternate, l2 = h.stateNode;
    if (null !== k2 && k2 === d) break;
    5 === h.tag && null !== l2 && (h = l2, e ? (k2 = Kb(c, f2), null != k2 && g.unshift(tf(c, k2, h))) : e || (k2 = Kb(c, f2), null != k2 && g.push(tf(c, k2, h))));
    c = c.return;
  }
  0 !== g.length && a.push({ event: b, listeners: g });
}
var xf = /\r\n?/g, yf = /\u0000|\uFFFD/g;
function zf(a) {
  return ("string" === typeof a ? a : "" + a).replace(xf, "\n").replace(yf, "");
}
function Af(a, b, c) {
  b = zf(b);
  if (zf(a) !== b && c) throw Error(p$1(425));
}
function Bf() {
}
var Cf = null, Df = null;
function Ef(a, b) {
  return "textarea" === a || "noscript" === a || "string" === typeof b.children || "number" === typeof b.children || "object" === typeof b.dangerouslySetInnerHTML && null !== b.dangerouslySetInnerHTML && null != b.dangerouslySetInnerHTML.__html;
}
var Ff = "function" === typeof setTimeout ? setTimeout : void 0, Gf = "function" === typeof clearTimeout ? clearTimeout : void 0, Hf = "function" === typeof Promise ? Promise : void 0, Jf = "function" === typeof queueMicrotask ? queueMicrotask : "undefined" !== typeof Hf ? function(a) {
  return Hf.resolve(null).then(a).catch(If);
} : Ff;
function If(a) {
  setTimeout(function() {
    throw a;
  });
}
function Kf(a, b) {
  var c = b, d = 0;
  do {
    var e = c.nextSibling;
    a.removeChild(c);
    if (e && 8 === e.nodeType) if (c = e.data, "/$" === c) {
      if (0 === d) {
        a.removeChild(e);
        bd(b);
        return;
      }
      d--;
    } else "$" !== c && "$?" !== c && "$!" !== c || d++;
    c = e;
  } while (c);
  bd(b);
}
function Lf(a) {
  for (; null != a; a = a.nextSibling) {
    var b = a.nodeType;
    if (1 === b || 3 === b) break;
    if (8 === b) {
      b = a.data;
      if ("$" === b || "$!" === b || "$?" === b) break;
      if ("/$" === b) return null;
    }
  }
  return a;
}
function Mf(a) {
  a = a.previousSibling;
  for (var b = 0; a; ) {
    if (8 === a.nodeType) {
      var c = a.data;
      if ("$" === c || "$!" === c || "$?" === c) {
        if (0 === b) return a;
        b--;
      } else "/$" === c && b++;
    }
    a = a.previousSibling;
  }
  return null;
}
var Nf = Math.random().toString(36).slice(2), Of = "__reactFiber$" + Nf, Pf = "__reactProps$" + Nf, uf = "__reactContainer$" + Nf, of = "__reactEvents$" + Nf, Qf = "__reactListeners$" + Nf, Rf = "__reactHandles$" + Nf;
function Wc(a) {
  var b = a[Of];
  if (b) return b;
  for (var c = a.parentNode; c; ) {
    if (b = c[uf] || c[Of]) {
      c = b.alternate;
      if (null !== b.child || null !== c && null !== c.child) for (a = Mf(a); null !== a; ) {
        if (c = a[Of]) return c;
        a = Mf(a);
      }
      return b;
    }
    a = c;
    c = a.parentNode;
  }
  return null;
}
function Cb(a) {
  a = a[Of] || a[uf];
  return !a || 5 !== a.tag && 6 !== a.tag && 13 !== a.tag && 3 !== a.tag ? null : a;
}
function ue(a) {
  if (5 === a.tag || 6 === a.tag) return a.stateNode;
  throw Error(p$1(33));
}
function Db(a) {
  return a[Pf] || null;
}
var Sf = [], Tf = -1;
function Uf(a) {
  return { current: a };
}
function E(a) {
  0 > Tf || (a.current = Sf[Tf], Sf[Tf] = null, Tf--);
}
function G(a, b) {
  Tf++;
  Sf[Tf] = a.current;
  a.current = b;
}
var Vf = {}, H = Uf(Vf), Wf = Uf(false), Xf = Vf;
function Yf(a, b) {
  var c = a.type.contextTypes;
  if (!c) return Vf;
  var d = a.stateNode;
  if (d && d.__reactInternalMemoizedUnmaskedChildContext === b) return d.__reactInternalMemoizedMaskedChildContext;
  var e = {}, f2;
  for (f2 in c) e[f2] = b[f2];
  d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = b, a.__reactInternalMemoizedMaskedChildContext = e);
  return e;
}
function Zf(a) {
  a = a.childContextTypes;
  return null !== a && void 0 !== a;
}
function $f() {
  E(Wf);
  E(H);
}
function ag(a, b, c) {
  if (H.current !== Vf) throw Error(p$1(168));
  G(H, b);
  G(Wf, c);
}
function bg(a, b, c) {
  var d = a.stateNode;
  b = b.childContextTypes;
  if ("function" !== typeof d.getChildContext) return c;
  d = d.getChildContext();
  for (var e in d) if (!(e in b)) throw Error(p$1(108, Ra(a) || "Unknown", e));
  return A({}, c, d);
}
function cg(a) {
  a = (a = a.stateNode) && a.__reactInternalMemoizedMergedChildContext || Vf;
  Xf = H.current;
  G(H, a);
  G(Wf, Wf.current);
  return true;
}
function dg(a, b, c) {
  var d = a.stateNode;
  if (!d) throw Error(p$1(169));
  c ? (a = bg(a, b, Xf), d.__reactInternalMemoizedMergedChildContext = a, E(Wf), E(H), G(H, a)) : E(Wf);
  G(Wf, c);
}
var eg = null, fg = false, gg = false;
function hg(a) {
  null === eg ? eg = [a] : eg.push(a);
}
function ig(a) {
  fg = true;
  hg(a);
}
function jg() {
  if (!gg && null !== eg) {
    gg = true;
    var a = 0, b = C;
    try {
      var c = eg;
      for (C = 1; a < c.length; a++) {
        var d = c[a];
        do
          d = d(true);
        while (null !== d);
      }
      eg = null;
      fg = false;
    } catch (e) {
      throw null !== eg && (eg = eg.slice(a + 1)), ac(fc, jg), e;
    } finally {
      C = b, gg = false;
    }
  }
  return null;
}
var kg = [], lg = 0, mg = null, ng = 0, og = [], pg = 0, qg = null, rg = 1, sg = "";
function tg(a, b) {
  kg[lg++] = ng;
  kg[lg++] = mg;
  mg = a;
  ng = b;
}
function ug(a, b, c) {
  og[pg++] = rg;
  og[pg++] = sg;
  og[pg++] = qg;
  qg = a;
  var d = rg;
  a = sg;
  var e = 32 - oc(d) - 1;
  d &= ~(1 << e);
  c += 1;
  var f2 = 32 - oc(b) + e;
  if (30 < f2) {
    var g = e - e % 5;
    f2 = (d & (1 << g) - 1).toString(32);
    d >>= g;
    e -= g;
    rg = 1 << 32 - oc(b) + e | c << e | d;
    sg = f2 + a;
  } else rg = 1 << f2 | c << e | d, sg = a;
}
function vg(a) {
  null !== a.return && (tg(a, 1), ug(a, 1, 0));
}
function wg(a) {
  for (; a === mg; ) mg = kg[--lg], kg[lg] = null, ng = kg[--lg], kg[lg] = null;
  for (; a === qg; ) qg = og[--pg], og[pg] = null, sg = og[--pg], og[pg] = null, rg = og[--pg], og[pg] = null;
}
var xg = null, yg = null, I = false, zg = null;
function Ag(a, b) {
  var c = Bg(5, null, null, 0);
  c.elementType = "DELETED";
  c.stateNode = b;
  c.return = a;
  b = a.deletions;
  null === b ? (a.deletions = [c], a.flags |= 16) : b.push(c);
}
function Cg(a, b) {
  switch (a.tag) {
    case 5:
      var c = a.type;
      b = 1 !== b.nodeType || c.toLowerCase() !== b.nodeName.toLowerCase() ? null : b;
      return null !== b ? (a.stateNode = b, xg = a, yg = Lf(b.firstChild), true) : false;
    case 6:
      return b = "" === a.pendingProps || 3 !== b.nodeType ? null : b, null !== b ? (a.stateNode = b, xg = a, yg = null, true) : false;
    case 13:
      return b = 8 !== b.nodeType ? null : b, null !== b ? (c = null !== qg ? { id: rg, overflow: sg } : null, a.memoizedState = { dehydrated: b, treeContext: c, retryLane: 1073741824 }, c = Bg(18, null, null, 0), c.stateNode = b, c.return = a, a.child = c, xg = a, yg = null, true) : false;
    default:
      return false;
  }
}
function Dg(a) {
  return 0 !== (a.mode & 1) && 0 === (a.flags & 128);
}
function Eg(a) {
  if (I) {
    var b = yg;
    if (b) {
      var c = b;
      if (!Cg(a, b)) {
        if (Dg(a)) throw Error(p$1(418));
        b = Lf(c.nextSibling);
        var d = xg;
        b && Cg(a, b) ? Ag(d, c) : (a.flags = a.flags & -4097 | 2, I = false, xg = a);
      }
    } else {
      if (Dg(a)) throw Error(p$1(418));
      a.flags = a.flags & -4097 | 2;
      I = false;
      xg = a;
    }
  }
}
function Fg(a) {
  for (a = a.return; null !== a && 5 !== a.tag && 3 !== a.tag && 13 !== a.tag; ) a = a.return;
  xg = a;
}
function Gg(a) {
  if (a !== xg) return false;
  if (!I) return Fg(a), I = true, false;
  var b;
  (b = 3 !== a.tag) && !(b = 5 !== a.tag) && (b = a.type, b = "head" !== b && "body" !== b && !Ef(a.type, a.memoizedProps));
  if (b && (b = yg)) {
    if (Dg(a)) throw Hg(), Error(p$1(418));
    for (; b; ) Ag(a, b), b = Lf(b.nextSibling);
  }
  Fg(a);
  if (13 === a.tag) {
    a = a.memoizedState;
    a = null !== a ? a.dehydrated : null;
    if (!a) throw Error(p$1(317));
    a: {
      a = a.nextSibling;
      for (b = 0; a; ) {
        if (8 === a.nodeType) {
          var c = a.data;
          if ("/$" === c) {
            if (0 === b) {
              yg = Lf(a.nextSibling);
              break a;
            }
            b--;
          } else "$" !== c && "$!" !== c && "$?" !== c || b++;
        }
        a = a.nextSibling;
      }
      yg = null;
    }
  } else yg = xg ? Lf(a.stateNode.nextSibling) : null;
  return true;
}
function Hg() {
  for (var a = yg; a; ) a = Lf(a.nextSibling);
}
function Ig() {
  yg = xg = null;
  I = false;
}
function Jg(a) {
  null === zg ? zg = [a] : zg.push(a);
}
var Kg = ua.ReactCurrentBatchConfig;
function Lg(a, b, c) {
  a = c.ref;
  if (null !== a && "function" !== typeof a && "object" !== typeof a) {
    if (c._owner) {
      c = c._owner;
      if (c) {
        if (1 !== c.tag) throw Error(p$1(309));
        var d = c.stateNode;
      }
      if (!d) throw Error(p$1(147, a));
      var e = d, f2 = "" + a;
      if (null !== b && null !== b.ref && "function" === typeof b.ref && b.ref._stringRef === f2) return b.ref;
      b = function(a2) {
        var b2 = e.refs;
        null === a2 ? delete b2[f2] : b2[f2] = a2;
      };
      b._stringRef = f2;
      return b;
    }
    if ("string" !== typeof a) throw Error(p$1(284));
    if (!c._owner) throw Error(p$1(290, a));
  }
  return a;
}
function Mg(a, b) {
  a = Object.prototype.toString.call(b);
  throw Error(p$1(31, "[object Object]" === a ? "object with keys {" + Object.keys(b).join(", ") + "}" : a));
}
function Ng(a) {
  var b = a._init;
  return b(a._payload);
}
function Og(a) {
  function b(b2, c2) {
    if (a) {
      var d2 = b2.deletions;
      null === d2 ? (b2.deletions = [c2], b2.flags |= 16) : d2.push(c2);
    }
  }
  function c(c2, d2) {
    if (!a) return null;
    for (; null !== d2; ) b(c2, d2), d2 = d2.sibling;
    return null;
  }
  function d(a2, b2) {
    for (a2 = /* @__PURE__ */ new Map(); null !== b2; ) null !== b2.key ? a2.set(b2.key, b2) : a2.set(b2.index, b2), b2 = b2.sibling;
    return a2;
  }
  function e(a2, b2) {
    a2 = Pg(a2, b2);
    a2.index = 0;
    a2.sibling = null;
    return a2;
  }
  function f2(b2, c2, d2) {
    b2.index = d2;
    if (!a) return b2.flags |= 1048576, c2;
    d2 = b2.alternate;
    if (null !== d2) return d2 = d2.index, d2 < c2 ? (b2.flags |= 2, c2) : d2;
    b2.flags |= 2;
    return c2;
  }
  function g(b2) {
    a && null === b2.alternate && (b2.flags |= 2);
    return b2;
  }
  function h(a2, b2, c2, d2) {
    if (null === b2 || 6 !== b2.tag) return b2 = Qg(c2, a2.mode, d2), b2.return = a2, b2;
    b2 = e(b2, c2);
    b2.return = a2;
    return b2;
  }
  function k2(a2, b2, c2, d2) {
    var f3 = c2.type;
    if (f3 === ya) return m2(a2, b2, c2.props.children, d2, c2.key);
    if (null !== b2 && (b2.elementType === f3 || "object" === typeof f3 && null !== f3 && f3.$$typeof === Ha && Ng(f3) === b2.type)) return d2 = e(b2, c2.props), d2.ref = Lg(a2, b2, c2), d2.return = a2, d2;
    d2 = Rg(c2.type, c2.key, c2.props, null, a2.mode, d2);
    d2.ref = Lg(a2, b2, c2);
    d2.return = a2;
    return d2;
  }
  function l2(a2, b2, c2, d2) {
    if (null === b2 || 4 !== b2.tag || b2.stateNode.containerInfo !== c2.containerInfo || b2.stateNode.implementation !== c2.implementation) return b2 = Sg(c2, a2.mode, d2), b2.return = a2, b2;
    b2 = e(b2, c2.children || []);
    b2.return = a2;
    return b2;
  }
  function m2(a2, b2, c2, d2, f3) {
    if (null === b2 || 7 !== b2.tag) return b2 = Tg(c2, a2.mode, d2, f3), b2.return = a2, b2;
    b2 = e(b2, c2);
    b2.return = a2;
    return b2;
  }
  function q2(a2, b2, c2) {
    if ("string" === typeof b2 && "" !== b2 || "number" === typeof b2) return b2 = Qg("" + b2, a2.mode, c2), b2.return = a2, b2;
    if ("object" === typeof b2 && null !== b2) {
      switch (b2.$$typeof) {
        case va:
          return c2 = Rg(b2.type, b2.key, b2.props, null, a2.mode, c2), c2.ref = Lg(a2, null, b2), c2.return = a2, c2;
        case wa:
          return b2 = Sg(b2, a2.mode, c2), b2.return = a2, b2;
        case Ha:
          var d2 = b2._init;
          return q2(a2, d2(b2._payload), c2);
      }
      if (eb(b2) || Ka(b2)) return b2 = Tg(b2, a2.mode, c2, null), b2.return = a2, b2;
      Mg(a2, b2);
    }
    return null;
  }
  function r2(a2, b2, c2, d2) {
    var e2 = null !== b2 ? b2.key : null;
    if ("string" === typeof c2 && "" !== c2 || "number" === typeof c2) return null !== e2 ? null : h(a2, b2, "" + c2, d2);
    if ("object" === typeof c2 && null !== c2) {
      switch (c2.$$typeof) {
        case va:
          return c2.key === e2 ? k2(a2, b2, c2, d2) : null;
        case wa:
          return c2.key === e2 ? l2(a2, b2, c2, d2) : null;
        case Ha:
          return e2 = c2._init, r2(
            a2,
            b2,
            e2(c2._payload),
            d2
          );
      }
      if (eb(c2) || Ka(c2)) return null !== e2 ? null : m2(a2, b2, c2, d2, null);
      Mg(a2, c2);
    }
    return null;
  }
  function y2(a2, b2, c2, d2, e2) {
    if ("string" === typeof d2 && "" !== d2 || "number" === typeof d2) return a2 = a2.get(c2) || null, h(b2, a2, "" + d2, e2);
    if ("object" === typeof d2 && null !== d2) {
      switch (d2.$$typeof) {
        case va:
          return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, k2(b2, a2, d2, e2);
        case wa:
          return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, l2(b2, a2, d2, e2);
        case Ha:
          var f3 = d2._init;
          return y2(a2, b2, c2, f3(d2._payload), e2);
      }
      if (eb(d2) || Ka(d2)) return a2 = a2.get(c2) || null, m2(b2, a2, d2, e2, null);
      Mg(b2, d2);
    }
    return null;
  }
  function n2(e2, g2, h2, k3) {
    for (var l3 = null, m3 = null, u2 = g2, w2 = g2 = 0, x2 = null; null !== u2 && w2 < h2.length; w2++) {
      u2.index > w2 ? (x2 = u2, u2 = null) : x2 = u2.sibling;
      var n3 = r2(e2, u2, h2[w2], k3);
      if (null === n3) {
        null === u2 && (u2 = x2);
        break;
      }
      a && u2 && null === n3.alternate && b(e2, u2);
      g2 = f2(n3, g2, w2);
      null === m3 ? l3 = n3 : m3.sibling = n3;
      m3 = n3;
      u2 = x2;
    }
    if (w2 === h2.length) return c(e2, u2), I && tg(e2, w2), l3;
    if (null === u2) {
      for (; w2 < h2.length; w2++) u2 = q2(e2, h2[w2], k3), null !== u2 && (g2 = f2(u2, g2, w2), null === m3 ? l3 = u2 : m3.sibling = u2, m3 = u2);
      I && tg(e2, w2);
      return l3;
    }
    for (u2 = d(e2, u2); w2 < h2.length; w2++) x2 = y2(u2, e2, w2, h2[w2], k3), null !== x2 && (a && null !== x2.alternate && u2.delete(null === x2.key ? w2 : x2.key), g2 = f2(x2, g2, w2), null === m3 ? l3 = x2 : m3.sibling = x2, m3 = x2);
    a && u2.forEach(function(a2) {
      return b(e2, a2);
    });
    I && tg(e2, w2);
    return l3;
  }
  function t2(e2, g2, h2, k3) {
    var l3 = Ka(h2);
    if ("function" !== typeof l3) throw Error(p$1(150));
    h2 = l3.call(h2);
    if (null == h2) throw Error(p$1(151));
    for (var u2 = l3 = null, m3 = g2, w2 = g2 = 0, x2 = null, n3 = h2.next(); null !== m3 && !n3.done; w2++, n3 = h2.next()) {
      m3.index > w2 ? (x2 = m3, m3 = null) : x2 = m3.sibling;
      var t3 = r2(e2, m3, n3.value, k3);
      if (null === t3) {
        null === m3 && (m3 = x2);
        break;
      }
      a && m3 && null === t3.alternate && b(e2, m3);
      g2 = f2(t3, g2, w2);
      null === u2 ? l3 = t3 : u2.sibling = t3;
      u2 = t3;
      m3 = x2;
    }
    if (n3.done) return c(
      e2,
      m3
    ), I && tg(e2, w2), l3;
    if (null === m3) {
      for (; !n3.done; w2++, n3 = h2.next()) n3 = q2(e2, n3.value, k3), null !== n3 && (g2 = f2(n3, g2, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
      I && tg(e2, w2);
      return l3;
    }
    for (m3 = d(e2, m3); !n3.done; w2++, n3 = h2.next()) n3 = y2(m3, e2, w2, n3.value, k3), null !== n3 && (a && null !== n3.alternate && m3.delete(null === n3.key ? w2 : n3.key), g2 = f2(n3, g2, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
    a && m3.forEach(function(a2) {
      return b(e2, a2);
    });
    I && tg(e2, w2);
    return l3;
  }
  function J2(a2, d2, f3, h2) {
    "object" === typeof f3 && null !== f3 && f3.type === ya && null === f3.key && (f3 = f3.props.children);
    if ("object" === typeof f3 && null !== f3) {
      switch (f3.$$typeof) {
        case va:
          a: {
            for (var k3 = f3.key, l3 = d2; null !== l3; ) {
              if (l3.key === k3) {
                k3 = f3.type;
                if (k3 === ya) {
                  if (7 === l3.tag) {
                    c(a2, l3.sibling);
                    d2 = e(l3, f3.props.children);
                    d2.return = a2;
                    a2 = d2;
                    break a;
                  }
                } else if (l3.elementType === k3 || "object" === typeof k3 && null !== k3 && k3.$$typeof === Ha && Ng(k3) === l3.type) {
                  c(a2, l3.sibling);
                  d2 = e(l3, f3.props);
                  d2.ref = Lg(a2, l3, f3);
                  d2.return = a2;
                  a2 = d2;
                  break a;
                }
                c(a2, l3);
                break;
              } else b(a2, l3);
              l3 = l3.sibling;
            }
            f3.type === ya ? (d2 = Tg(f3.props.children, a2.mode, h2, f3.key), d2.return = a2, a2 = d2) : (h2 = Rg(f3.type, f3.key, f3.props, null, a2.mode, h2), h2.ref = Lg(a2, d2, f3), h2.return = a2, a2 = h2);
          }
          return g(a2);
        case wa:
          a: {
            for (l3 = f3.key; null !== d2; ) {
              if (d2.key === l3) if (4 === d2.tag && d2.stateNode.containerInfo === f3.containerInfo && d2.stateNode.implementation === f3.implementation) {
                c(a2, d2.sibling);
                d2 = e(d2, f3.children || []);
                d2.return = a2;
                a2 = d2;
                break a;
              } else {
                c(a2, d2);
                break;
              }
              else b(a2, d2);
              d2 = d2.sibling;
            }
            d2 = Sg(f3, a2.mode, h2);
            d2.return = a2;
            a2 = d2;
          }
          return g(a2);
        case Ha:
          return l3 = f3._init, J2(a2, d2, l3(f3._payload), h2);
      }
      if (eb(f3)) return n2(a2, d2, f3, h2);
      if (Ka(f3)) return t2(a2, d2, f3, h2);
      Mg(a2, f3);
    }
    return "string" === typeof f3 && "" !== f3 || "number" === typeof f3 ? (f3 = "" + f3, null !== d2 && 6 === d2.tag ? (c(a2, d2.sibling), d2 = e(d2, f3), d2.return = a2, a2 = d2) : (c(a2, d2), d2 = Qg(f3, a2.mode, h2), d2.return = a2, a2 = d2), g(a2)) : c(a2, d2);
  }
  return J2;
}
var Ug = Og(true), Vg = Og(false), Wg = Uf(null), Xg = null, Yg = null, Zg = null;
function $g() {
  Zg = Yg = Xg = null;
}
function ah(a) {
  var b = Wg.current;
  E(Wg);
  a._currentValue = b;
}
function bh(a, b, c) {
  for (; null !== a; ) {
    var d = a.alternate;
    (a.childLanes & b) !== b ? (a.childLanes |= b, null !== d && (d.childLanes |= b)) : null !== d && (d.childLanes & b) !== b && (d.childLanes |= b);
    if (a === c) break;
    a = a.return;
  }
}
function ch(a, b) {
  Xg = a;
  Zg = Yg = null;
  a = a.dependencies;
  null !== a && null !== a.firstContext && (0 !== (a.lanes & b) && (dh = true), a.firstContext = null);
}
function eh(a) {
  var b = a._currentValue;
  if (Zg !== a) if (a = { context: a, memoizedValue: b, next: null }, null === Yg) {
    if (null === Xg) throw Error(p$1(308));
    Yg = a;
    Xg.dependencies = { lanes: 0, firstContext: a };
  } else Yg = Yg.next = a;
  return b;
}
var fh = null;
function gh(a) {
  null === fh ? fh = [a] : fh.push(a);
}
function hh(a, b, c, d) {
  var e = b.interleaved;
  null === e ? (c.next = c, gh(b)) : (c.next = e.next, e.next = c);
  b.interleaved = c;
  return ih(a, d);
}
function ih(a, b) {
  a.lanes |= b;
  var c = a.alternate;
  null !== c && (c.lanes |= b);
  c = a;
  for (a = a.return; null !== a; ) a.childLanes |= b, c = a.alternate, null !== c && (c.childLanes |= b), c = a, a = a.return;
  return 3 === c.tag ? c.stateNode : null;
}
var jh = false;
function kh(a) {
  a.updateQueue = { baseState: a.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
}
function lh(a, b) {
  a = a.updateQueue;
  b.updateQueue === a && (b.updateQueue = { baseState: a.baseState, firstBaseUpdate: a.firstBaseUpdate, lastBaseUpdate: a.lastBaseUpdate, shared: a.shared, effects: a.effects });
}
function mh(a, b) {
  return { eventTime: a, lane: b, tag: 0, payload: null, callback: null, next: null };
}
function nh(a, b, c) {
  var d = a.updateQueue;
  if (null === d) return null;
  d = d.shared;
  if (0 !== (K & 2)) {
    var e = d.pending;
    null === e ? b.next = b : (b.next = e.next, e.next = b);
    d.pending = b;
    return ih(a, c);
  }
  e = d.interleaved;
  null === e ? (b.next = b, gh(d)) : (b.next = e.next, e.next = b);
  d.interleaved = b;
  return ih(a, c);
}
function oh(a, b, c) {
  b = b.updateQueue;
  if (null !== b && (b = b.shared, 0 !== (c & 4194240))) {
    var d = b.lanes;
    d &= a.pendingLanes;
    c |= d;
    b.lanes = c;
    Cc(a, c);
  }
}
function ph(a, b) {
  var c = a.updateQueue, d = a.alternate;
  if (null !== d && (d = d.updateQueue, c === d)) {
    var e = null, f2 = null;
    c = c.firstBaseUpdate;
    if (null !== c) {
      do {
        var g = { eventTime: c.eventTime, lane: c.lane, tag: c.tag, payload: c.payload, callback: c.callback, next: null };
        null === f2 ? e = f2 = g : f2 = f2.next = g;
        c = c.next;
      } while (null !== c);
      null === f2 ? e = f2 = b : f2 = f2.next = b;
    } else e = f2 = b;
    c = { baseState: d.baseState, firstBaseUpdate: e, lastBaseUpdate: f2, shared: d.shared, effects: d.effects };
    a.updateQueue = c;
    return;
  }
  a = c.lastBaseUpdate;
  null === a ? c.firstBaseUpdate = b : a.next = b;
  c.lastBaseUpdate = b;
}
function qh(a, b, c, d) {
  var e = a.updateQueue;
  jh = false;
  var f2 = e.firstBaseUpdate, g = e.lastBaseUpdate, h = e.shared.pending;
  if (null !== h) {
    e.shared.pending = null;
    var k2 = h, l2 = k2.next;
    k2.next = null;
    null === g ? f2 = l2 : g.next = l2;
    g = k2;
    var m2 = a.alternate;
    null !== m2 && (m2 = m2.updateQueue, h = m2.lastBaseUpdate, h !== g && (null === h ? m2.firstBaseUpdate = l2 : h.next = l2, m2.lastBaseUpdate = k2));
  }
  if (null !== f2) {
    var q2 = e.baseState;
    g = 0;
    m2 = l2 = k2 = null;
    h = f2;
    do {
      var r2 = h.lane, y2 = h.eventTime;
      if ((d & r2) === r2) {
        null !== m2 && (m2 = m2.next = {
          eventTime: y2,
          lane: 0,
          tag: h.tag,
          payload: h.payload,
          callback: h.callback,
          next: null
        });
        a: {
          var n2 = a, t2 = h;
          r2 = b;
          y2 = c;
          switch (t2.tag) {
            case 1:
              n2 = t2.payload;
              if ("function" === typeof n2) {
                q2 = n2.call(y2, q2, r2);
                break a;
              }
              q2 = n2;
              break a;
            case 3:
              n2.flags = n2.flags & -65537 | 128;
            case 0:
              n2 = t2.payload;
              r2 = "function" === typeof n2 ? n2.call(y2, q2, r2) : n2;
              if (null === r2 || void 0 === r2) break a;
              q2 = A({}, q2, r2);
              break a;
            case 2:
              jh = true;
          }
        }
        null !== h.callback && 0 !== h.lane && (a.flags |= 64, r2 = e.effects, null === r2 ? e.effects = [h] : r2.push(h));
      } else y2 = { eventTime: y2, lane: r2, tag: h.tag, payload: h.payload, callback: h.callback, next: null }, null === m2 ? (l2 = m2 = y2, k2 = q2) : m2 = m2.next = y2, g |= r2;
      h = h.next;
      if (null === h) if (h = e.shared.pending, null === h) break;
      else r2 = h, h = r2.next, r2.next = null, e.lastBaseUpdate = r2, e.shared.pending = null;
    } while (1);
    null === m2 && (k2 = q2);
    e.baseState = k2;
    e.firstBaseUpdate = l2;
    e.lastBaseUpdate = m2;
    b = e.shared.interleaved;
    if (null !== b) {
      e = b;
      do
        g |= e.lane, e = e.next;
      while (e !== b);
    } else null === f2 && (e.shared.lanes = 0);
    rh |= g;
    a.lanes = g;
    a.memoizedState = q2;
  }
}
function sh(a, b, c) {
  a = b.effects;
  b.effects = null;
  if (null !== a) for (b = 0; b < a.length; b++) {
    var d = a[b], e = d.callback;
    if (null !== e) {
      d.callback = null;
      d = c;
      if ("function" !== typeof e) throw Error(p$1(191, e));
      e.call(d);
    }
  }
}
var th = {}, uh = Uf(th), vh = Uf(th), wh = Uf(th);
function xh(a) {
  if (a === th) throw Error(p$1(174));
  return a;
}
function yh(a, b) {
  G(wh, b);
  G(vh, a);
  G(uh, th);
  a = b.nodeType;
  switch (a) {
    case 9:
    case 11:
      b = (b = b.documentElement) ? b.namespaceURI : lb(null, "");
      break;
    default:
      a = 8 === a ? b.parentNode : b, b = a.namespaceURI || null, a = a.tagName, b = lb(b, a);
  }
  E(uh);
  G(uh, b);
}
function zh() {
  E(uh);
  E(vh);
  E(wh);
}
function Ah(a) {
  xh(wh.current);
  var b = xh(uh.current);
  var c = lb(b, a.type);
  b !== c && (G(vh, a), G(uh, c));
}
function Bh(a) {
  vh.current === a && (E(uh), E(vh));
}
var L = Uf(0);
function Ch(a) {
  for (var b = a; null !== b; ) {
    if (13 === b.tag) {
      var c = b.memoizedState;
      if (null !== c && (c = c.dehydrated, null === c || "$?" === c.data || "$!" === c.data)) return b;
    } else if (19 === b.tag && void 0 !== b.memoizedProps.revealOrder) {
      if (0 !== (b.flags & 128)) return b;
    } else if (null !== b.child) {
      b.child.return = b;
      b = b.child;
      continue;
    }
    if (b === a) break;
    for (; null === b.sibling; ) {
      if (null === b.return || b.return === a) return null;
      b = b.return;
    }
    b.sibling.return = b.return;
    b = b.sibling;
  }
  return null;
}
var Dh = [];
function Eh() {
  for (var a = 0; a < Dh.length; a++) Dh[a]._workInProgressVersionPrimary = null;
  Dh.length = 0;
}
var Fh = ua.ReactCurrentDispatcher, Gh = ua.ReactCurrentBatchConfig, Hh = 0, M = null, N = null, O = null, Ih = false, Jh = false, Kh = 0, Lh = 0;
function P() {
  throw Error(p$1(321));
}
function Mh(a, b) {
  if (null === b) return false;
  for (var c = 0; c < b.length && c < a.length; c++) if (!He(a[c], b[c])) return false;
  return true;
}
function Nh(a, b, c, d, e, f2) {
  Hh = f2;
  M = b;
  b.memoizedState = null;
  b.updateQueue = null;
  b.lanes = 0;
  Fh.current = null === a || null === a.memoizedState ? Oh : Ph;
  a = c(d, e);
  if (Jh) {
    f2 = 0;
    do {
      Jh = false;
      Kh = 0;
      if (25 <= f2) throw Error(p$1(301));
      f2 += 1;
      O = N = null;
      b.updateQueue = null;
      Fh.current = Qh;
      a = c(d, e);
    } while (Jh);
  }
  Fh.current = Rh;
  b = null !== N && null !== N.next;
  Hh = 0;
  O = N = M = null;
  Ih = false;
  if (b) throw Error(p$1(300));
  return a;
}
function Sh() {
  var a = 0 !== Kh;
  Kh = 0;
  return a;
}
function Th() {
  var a = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
  null === O ? M.memoizedState = O = a : O = O.next = a;
  return O;
}
function Uh() {
  if (null === N) {
    var a = M.alternate;
    a = null !== a ? a.memoizedState : null;
  } else a = N.next;
  var b = null === O ? M.memoizedState : O.next;
  if (null !== b) O = b, N = a;
  else {
    if (null === a) throw Error(p$1(310));
    N = a;
    a = { memoizedState: N.memoizedState, baseState: N.baseState, baseQueue: N.baseQueue, queue: N.queue, next: null };
    null === O ? M.memoizedState = O = a : O = O.next = a;
  }
  return O;
}
function Vh(a, b) {
  return "function" === typeof b ? b(a) : b;
}
function Wh(a) {
  var b = Uh(), c = b.queue;
  if (null === c) throw Error(p$1(311));
  c.lastRenderedReducer = a;
  var d = N, e = d.baseQueue, f2 = c.pending;
  if (null !== f2) {
    if (null !== e) {
      var g = e.next;
      e.next = f2.next;
      f2.next = g;
    }
    d.baseQueue = e = f2;
    c.pending = null;
  }
  if (null !== e) {
    f2 = e.next;
    d = d.baseState;
    var h = g = null, k2 = null, l2 = f2;
    do {
      var m2 = l2.lane;
      if ((Hh & m2) === m2) null !== k2 && (k2 = k2.next = { lane: 0, action: l2.action, hasEagerState: l2.hasEagerState, eagerState: l2.eagerState, next: null }), d = l2.hasEagerState ? l2.eagerState : a(d, l2.action);
      else {
        var q2 = {
          lane: m2,
          action: l2.action,
          hasEagerState: l2.hasEagerState,
          eagerState: l2.eagerState,
          next: null
        };
        null === k2 ? (h = k2 = q2, g = d) : k2 = k2.next = q2;
        M.lanes |= m2;
        rh |= m2;
      }
      l2 = l2.next;
    } while (null !== l2 && l2 !== f2);
    null === k2 ? g = d : k2.next = h;
    He(d, b.memoizedState) || (dh = true);
    b.memoizedState = d;
    b.baseState = g;
    b.baseQueue = k2;
    c.lastRenderedState = d;
  }
  a = c.interleaved;
  if (null !== a) {
    e = a;
    do
      f2 = e.lane, M.lanes |= f2, rh |= f2, e = e.next;
    while (e !== a);
  } else null === e && (c.lanes = 0);
  return [b.memoizedState, c.dispatch];
}
function Xh(a) {
  var b = Uh(), c = b.queue;
  if (null === c) throw Error(p$1(311));
  c.lastRenderedReducer = a;
  var d = c.dispatch, e = c.pending, f2 = b.memoizedState;
  if (null !== e) {
    c.pending = null;
    var g = e = e.next;
    do
      f2 = a(f2, g.action), g = g.next;
    while (g !== e);
    He(f2, b.memoizedState) || (dh = true);
    b.memoizedState = f2;
    null === b.baseQueue && (b.baseState = f2);
    c.lastRenderedState = f2;
  }
  return [f2, d];
}
function Yh() {
}
function Zh(a, b) {
  var c = M, d = Uh(), e = b(), f2 = !He(d.memoizedState, e);
  f2 && (d.memoizedState = e, dh = true);
  d = d.queue;
  $h(ai.bind(null, c, d, a), [a]);
  if (d.getSnapshot !== b || f2 || null !== O && O.memoizedState.tag & 1) {
    c.flags |= 2048;
    bi(9, ci.bind(null, c, d, e, b), void 0, null);
    if (null === Q) throw Error(p$1(349));
    0 !== (Hh & 30) || di(c, b, e);
  }
  return e;
}
function di(a, b, c) {
  a.flags |= 16384;
  a = { getSnapshot: b, value: c };
  b = M.updateQueue;
  null === b ? (b = { lastEffect: null, stores: null }, M.updateQueue = b, b.stores = [a]) : (c = b.stores, null === c ? b.stores = [a] : c.push(a));
}
function ci(a, b, c, d) {
  b.value = c;
  b.getSnapshot = d;
  ei(b) && fi(a);
}
function ai(a, b, c) {
  return c(function() {
    ei(b) && fi(a);
  });
}
function ei(a) {
  var b = a.getSnapshot;
  a = a.value;
  try {
    var c = b();
    return !He(a, c);
  } catch (d) {
    return true;
  }
}
function fi(a) {
  var b = ih(a, 1);
  null !== b && gi(b, a, 1, -1);
}
function hi(a) {
  var b = Th();
  "function" === typeof a && (a = a());
  b.memoizedState = b.baseState = a;
  a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Vh, lastRenderedState: a };
  b.queue = a;
  a = a.dispatch = ii.bind(null, M, a);
  return [b.memoizedState, a];
}
function bi(a, b, c, d) {
  a = { tag: a, create: b, destroy: c, deps: d, next: null };
  b = M.updateQueue;
  null === b ? (b = { lastEffect: null, stores: null }, M.updateQueue = b, b.lastEffect = a.next = a) : (c = b.lastEffect, null === c ? b.lastEffect = a.next = a : (d = c.next, c.next = a, a.next = d, b.lastEffect = a));
  return a;
}
function ji() {
  return Uh().memoizedState;
}
function ki(a, b, c, d) {
  var e = Th();
  M.flags |= a;
  e.memoizedState = bi(1 | b, c, void 0, void 0 === d ? null : d);
}
function li(a, b, c, d) {
  var e = Uh();
  d = void 0 === d ? null : d;
  var f2 = void 0;
  if (null !== N) {
    var g = N.memoizedState;
    f2 = g.destroy;
    if (null !== d && Mh(d, g.deps)) {
      e.memoizedState = bi(b, c, f2, d);
      return;
    }
  }
  M.flags |= a;
  e.memoizedState = bi(1 | b, c, f2, d);
}
function mi(a, b) {
  return ki(8390656, 8, a, b);
}
function $h(a, b) {
  return li(2048, 8, a, b);
}
function ni(a, b) {
  return li(4, 2, a, b);
}
function oi(a, b) {
  return li(4, 4, a, b);
}
function pi(a, b) {
  if ("function" === typeof b) return a = a(), b(a), function() {
    b(null);
  };
  if (null !== b && void 0 !== b) return a = a(), b.current = a, function() {
    b.current = null;
  };
}
function qi(a, b, c) {
  c = null !== c && void 0 !== c ? c.concat([a]) : null;
  return li(4, 4, pi.bind(null, b, a), c);
}
function ri() {
}
function si(a, b) {
  var c = Uh();
  b = void 0 === b ? null : b;
  var d = c.memoizedState;
  if (null !== d && null !== b && Mh(b, d[1])) return d[0];
  c.memoizedState = [a, b];
  return a;
}
function ti(a, b) {
  var c = Uh();
  b = void 0 === b ? null : b;
  var d = c.memoizedState;
  if (null !== d && null !== b && Mh(b, d[1])) return d[0];
  a = a();
  c.memoizedState = [a, b];
  return a;
}
function ui(a, b, c) {
  if (0 === (Hh & 21)) return a.baseState && (a.baseState = false, dh = true), a.memoizedState = c;
  He(c, b) || (c = yc(), M.lanes |= c, rh |= c, a.baseState = true);
  return b;
}
function vi(a, b) {
  var c = C;
  C = 0 !== c && 4 > c ? c : 4;
  a(true);
  var d = Gh.transition;
  Gh.transition = {};
  try {
    a(false), b();
  } finally {
    C = c, Gh.transition = d;
  }
}
function wi() {
  return Uh().memoizedState;
}
function xi(a, b, c) {
  var d = yi(a);
  c = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
  if (zi(a)) Ai(b, c);
  else if (c = hh(a, b, c, d), null !== c) {
    var e = R();
    gi(c, a, d, e);
    Bi(c, b, d);
  }
}
function ii(a, b, c) {
  var d = yi(a), e = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
  if (zi(a)) Ai(b, e);
  else {
    var f2 = a.alternate;
    if (0 === a.lanes && (null === f2 || 0 === f2.lanes) && (f2 = b.lastRenderedReducer, null !== f2)) try {
      var g = b.lastRenderedState, h = f2(g, c);
      e.hasEagerState = true;
      e.eagerState = h;
      if (He(h, g)) {
        var k2 = b.interleaved;
        null === k2 ? (e.next = e, gh(b)) : (e.next = k2.next, k2.next = e);
        b.interleaved = e;
        return;
      }
    } catch (l2) {
    } finally {
    }
    c = hh(a, b, e, d);
    null !== c && (e = R(), gi(c, a, d, e), Bi(c, b, d));
  }
}
function zi(a) {
  var b = a.alternate;
  return a === M || null !== b && b === M;
}
function Ai(a, b) {
  Jh = Ih = true;
  var c = a.pending;
  null === c ? b.next = b : (b.next = c.next, c.next = b);
  a.pending = b;
}
function Bi(a, b, c) {
  if (0 !== (c & 4194240)) {
    var d = b.lanes;
    d &= a.pendingLanes;
    c |= d;
    b.lanes = c;
    Cc(a, c);
  }
}
var Rh = { readContext: eh, useCallback: P, useContext: P, useEffect: P, useImperativeHandle: P, useInsertionEffect: P, useLayoutEffect: P, useMemo: P, useReducer: P, useRef: P, useState: P, useDebugValue: P, useDeferredValue: P, useTransition: P, useMutableSource: P, useSyncExternalStore: P, useId: P, unstable_isNewReconciler: false }, Oh = { readContext: eh, useCallback: function(a, b) {
  Th().memoizedState = [a, void 0 === b ? null : b];
  return a;
}, useContext: eh, useEffect: mi, useImperativeHandle: function(a, b, c) {
  c = null !== c && void 0 !== c ? c.concat([a]) : null;
  return ki(
    4194308,
    4,
    pi.bind(null, b, a),
    c
  );
}, useLayoutEffect: function(a, b) {
  return ki(4194308, 4, a, b);
}, useInsertionEffect: function(a, b) {
  return ki(4, 2, a, b);
}, useMemo: function(a, b) {
  var c = Th();
  b = void 0 === b ? null : b;
  a = a();
  c.memoizedState = [a, b];
  return a;
}, useReducer: function(a, b, c) {
  var d = Th();
  b = void 0 !== c ? c(b) : b;
  d.memoizedState = d.baseState = b;
  a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: a, lastRenderedState: b };
  d.queue = a;
  a = a.dispatch = xi.bind(null, M, a);
  return [d.memoizedState, a];
}, useRef: function(a) {
  var b = Th();
  a = { current: a };
  return b.memoizedState = a;
}, useState: hi, useDebugValue: ri, useDeferredValue: function(a) {
  return Th().memoizedState = a;
}, useTransition: function() {
  var a = hi(false), b = a[0];
  a = vi.bind(null, a[1]);
  Th().memoizedState = a;
  return [b, a];
}, useMutableSource: function() {
}, useSyncExternalStore: function(a, b, c) {
  var d = M, e = Th();
  if (I) {
    if (void 0 === c) throw Error(p$1(407));
    c = c();
  } else {
    c = b();
    if (null === Q) throw Error(p$1(349));
    0 !== (Hh & 30) || di(d, b, c);
  }
  e.memoizedState = c;
  var f2 = { value: c, getSnapshot: b };
  e.queue = f2;
  mi(ai.bind(
    null,
    d,
    f2,
    a
  ), [a]);
  d.flags |= 2048;
  bi(9, ci.bind(null, d, f2, c, b), void 0, null);
  return c;
}, useId: function() {
  var a = Th(), b = Q.identifierPrefix;
  if (I) {
    var c = sg;
    var d = rg;
    c = (d & ~(1 << 32 - oc(d) - 1)).toString(32) + c;
    b = ":" + b + "R" + c;
    c = Kh++;
    0 < c && (b += "H" + c.toString(32));
    b += ":";
  } else c = Lh++, b = ":" + b + "r" + c.toString(32) + ":";
  return a.memoizedState = b;
}, unstable_isNewReconciler: false }, Ph = {
  readContext: eh,
  useCallback: si,
  useContext: eh,
  useEffect: $h,
  useImperativeHandle: qi,
  useInsertionEffect: ni,
  useLayoutEffect: oi,
  useMemo: ti,
  useReducer: Wh,
  useRef: ji,
  useState: function() {
    return Wh(Vh);
  },
  useDebugValue: ri,
  useDeferredValue: function(a) {
    var b = Uh();
    return ui(b, N.memoizedState, a);
  },
  useTransition: function() {
    var a = Wh(Vh)[0], b = Uh().memoizedState;
    return [a, b];
  },
  useMutableSource: Yh,
  useSyncExternalStore: Zh,
  useId: wi,
  unstable_isNewReconciler: false
}, Qh = { readContext: eh, useCallback: si, useContext: eh, useEffect: $h, useImperativeHandle: qi, useInsertionEffect: ni, useLayoutEffect: oi, useMemo: ti, useReducer: Xh, useRef: ji, useState: function() {
  return Xh(Vh);
}, useDebugValue: ri, useDeferredValue: function(a) {
  var b = Uh();
  return null === N ? b.memoizedState = a : ui(b, N.memoizedState, a);
}, useTransition: function() {
  var a = Xh(Vh)[0], b = Uh().memoizedState;
  return [a, b];
}, useMutableSource: Yh, useSyncExternalStore: Zh, useId: wi, unstable_isNewReconciler: false };
function Ci(a, b) {
  if (a && a.defaultProps) {
    b = A({}, b);
    a = a.defaultProps;
    for (var c in a) void 0 === b[c] && (b[c] = a[c]);
    return b;
  }
  return b;
}
function Di(a, b, c, d) {
  b = a.memoizedState;
  c = c(d, b);
  c = null === c || void 0 === c ? b : A({}, b, c);
  a.memoizedState = c;
  0 === a.lanes && (a.updateQueue.baseState = c);
}
var Ei = { isMounted: function(a) {
  return (a = a._reactInternals) ? Vb(a) === a : false;
}, enqueueSetState: function(a, b, c) {
  a = a._reactInternals;
  var d = R(), e = yi(a), f2 = mh(d, e);
  f2.payload = b;
  void 0 !== c && null !== c && (f2.callback = c);
  b = nh(a, f2, e);
  null !== b && (gi(b, a, e, d), oh(b, a, e));
}, enqueueReplaceState: function(a, b, c) {
  a = a._reactInternals;
  var d = R(), e = yi(a), f2 = mh(d, e);
  f2.tag = 1;
  f2.payload = b;
  void 0 !== c && null !== c && (f2.callback = c);
  b = nh(a, f2, e);
  null !== b && (gi(b, a, e, d), oh(b, a, e));
}, enqueueForceUpdate: function(a, b) {
  a = a._reactInternals;
  var c = R(), d = yi(a), e = mh(c, d);
  e.tag = 2;
  void 0 !== b && null !== b && (e.callback = b);
  b = nh(a, e, d);
  null !== b && (gi(b, a, d, c), oh(b, a, d));
} };
function Fi(a, b, c, d, e, f2, g) {
  a = a.stateNode;
  return "function" === typeof a.shouldComponentUpdate ? a.shouldComponentUpdate(d, f2, g) : b.prototype && b.prototype.isPureReactComponent ? !Ie(c, d) || !Ie(e, f2) : true;
}
function Gi(a, b, c) {
  var d = false, e = Vf;
  var f2 = b.contextType;
  "object" === typeof f2 && null !== f2 ? f2 = eh(f2) : (e = Zf(b) ? Xf : H.current, d = b.contextTypes, f2 = (d = null !== d && void 0 !== d) ? Yf(a, e) : Vf);
  b = new b(c, f2);
  a.memoizedState = null !== b.state && void 0 !== b.state ? b.state : null;
  b.updater = Ei;
  a.stateNode = b;
  b._reactInternals = a;
  d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = e, a.__reactInternalMemoizedMaskedChildContext = f2);
  return b;
}
function Hi(a, b, c, d) {
  a = b.state;
  "function" === typeof b.componentWillReceiveProps && b.componentWillReceiveProps(c, d);
  "function" === typeof b.UNSAFE_componentWillReceiveProps && b.UNSAFE_componentWillReceiveProps(c, d);
  b.state !== a && Ei.enqueueReplaceState(b, b.state, null);
}
function Ii(a, b, c, d) {
  var e = a.stateNode;
  e.props = c;
  e.state = a.memoizedState;
  e.refs = {};
  kh(a);
  var f2 = b.contextType;
  "object" === typeof f2 && null !== f2 ? e.context = eh(f2) : (f2 = Zf(b) ? Xf : H.current, e.context = Yf(a, f2));
  e.state = a.memoizedState;
  f2 = b.getDerivedStateFromProps;
  "function" === typeof f2 && (Di(a, b, f2, c), e.state = a.memoizedState);
  "function" === typeof b.getDerivedStateFromProps || "function" === typeof e.getSnapshotBeforeUpdate || "function" !== typeof e.UNSAFE_componentWillMount && "function" !== typeof e.componentWillMount || (b = e.state, "function" === typeof e.componentWillMount && e.componentWillMount(), "function" === typeof e.UNSAFE_componentWillMount && e.UNSAFE_componentWillMount(), b !== e.state && Ei.enqueueReplaceState(e, e.state, null), qh(a, c, e, d), e.state = a.memoizedState);
  "function" === typeof e.componentDidMount && (a.flags |= 4194308);
}
function Ji(a, b) {
  try {
    var c = "", d = b;
    do
      c += Pa(d), d = d.return;
    while (d);
    var e = c;
  } catch (f2) {
    e = "\nError generating stack: " + f2.message + "\n" + f2.stack;
  }
  return { value: a, source: b, stack: e, digest: null };
}
function Ki(a, b, c) {
  return { value: a, source: null, stack: null != c ? c : null, digest: null != b ? b : null };
}
function Li(a, b) {
  try {
    console.error(b.value);
  } catch (c) {
    setTimeout(function() {
      throw c;
    });
  }
}
var Mi = "function" === typeof WeakMap ? WeakMap : Map;
function Ni(a, b, c) {
  c = mh(-1, c);
  c.tag = 3;
  c.payload = { element: null };
  var d = b.value;
  c.callback = function() {
    Oi || (Oi = true, Pi = d);
    Li(a, b);
  };
  return c;
}
function Qi(a, b, c) {
  c = mh(-1, c);
  c.tag = 3;
  var d = a.type.getDerivedStateFromError;
  if ("function" === typeof d) {
    var e = b.value;
    c.payload = function() {
      return d(e);
    };
    c.callback = function() {
      Li(a, b);
    };
  }
  var f2 = a.stateNode;
  null !== f2 && "function" === typeof f2.componentDidCatch && (c.callback = function() {
    Li(a, b);
    "function" !== typeof d && (null === Ri ? Ri = /* @__PURE__ */ new Set([this]) : Ri.add(this));
    var c2 = b.stack;
    this.componentDidCatch(b.value, { componentStack: null !== c2 ? c2 : "" });
  });
  return c;
}
function Si(a, b, c) {
  var d = a.pingCache;
  if (null === d) {
    d = a.pingCache = new Mi();
    var e = /* @__PURE__ */ new Set();
    d.set(b, e);
  } else e = d.get(b), void 0 === e && (e = /* @__PURE__ */ new Set(), d.set(b, e));
  e.has(c) || (e.add(c), a = Ti.bind(null, a, b, c), b.then(a, a));
}
function Ui(a) {
  do {
    var b;
    if (b = 13 === a.tag) b = a.memoizedState, b = null !== b ? null !== b.dehydrated ? true : false : true;
    if (b) return a;
    a = a.return;
  } while (null !== a);
  return null;
}
function Vi(a, b, c, d, e) {
  if (0 === (a.mode & 1)) return a === b ? a.flags |= 65536 : (a.flags |= 128, c.flags |= 131072, c.flags &= -52805, 1 === c.tag && (null === c.alternate ? c.tag = 17 : (b = mh(-1, 1), b.tag = 2, nh(c, b, 1))), c.lanes |= 1), a;
  a.flags |= 65536;
  a.lanes = e;
  return a;
}
var Wi = ua.ReactCurrentOwner, dh = false;
function Xi(a, b, c, d) {
  b.child = null === a ? Vg(b, null, c, d) : Ug(b, a.child, c, d);
}
function Yi(a, b, c, d, e) {
  c = c.render;
  var f2 = b.ref;
  ch(b, e);
  d = Nh(a, b, c, d, f2, e);
  c = Sh();
  if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
  I && c && vg(b);
  b.flags |= 1;
  Xi(a, b, d, e);
  return b.child;
}
function $i(a, b, c, d, e) {
  if (null === a) {
    var f2 = c.type;
    if ("function" === typeof f2 && !aj(f2) && void 0 === f2.defaultProps && null === c.compare && void 0 === c.defaultProps) return b.tag = 15, b.type = f2, bj(a, b, f2, d, e);
    a = Rg(c.type, null, d, b, b.mode, e);
    a.ref = b.ref;
    a.return = b;
    return b.child = a;
  }
  f2 = a.child;
  if (0 === (a.lanes & e)) {
    var g = f2.memoizedProps;
    c = c.compare;
    c = null !== c ? c : Ie;
    if (c(g, d) && a.ref === b.ref) return Zi(a, b, e);
  }
  b.flags |= 1;
  a = Pg(f2, d);
  a.ref = b.ref;
  a.return = b;
  return b.child = a;
}
function bj(a, b, c, d, e) {
  if (null !== a) {
    var f2 = a.memoizedProps;
    if (Ie(f2, d) && a.ref === b.ref) if (dh = false, b.pendingProps = d = f2, 0 !== (a.lanes & e)) 0 !== (a.flags & 131072) && (dh = true);
    else return b.lanes = a.lanes, Zi(a, b, e);
  }
  return cj(a, b, c, d, e);
}
function dj(a, b, c) {
  var d = b.pendingProps, e = d.children, f2 = null !== a ? a.memoizedState : null;
  if ("hidden" === d.mode) if (0 === (b.mode & 1)) b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, G(ej, fj), fj |= c;
  else {
    if (0 === (c & 1073741824)) return a = null !== f2 ? f2.baseLanes | c : c, b.lanes = b.childLanes = 1073741824, b.memoizedState = { baseLanes: a, cachePool: null, transitions: null }, b.updateQueue = null, G(ej, fj), fj |= a, null;
    b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null };
    d = null !== f2 ? f2.baseLanes : c;
    G(ej, fj);
    fj |= d;
  }
  else null !== f2 ? (d = f2.baseLanes | c, b.memoizedState = null) : d = c, G(ej, fj), fj |= d;
  Xi(a, b, e, c);
  return b.child;
}
function gj(a, b) {
  var c = b.ref;
  if (null === a && null !== c || null !== a && a.ref !== c) b.flags |= 512, b.flags |= 2097152;
}
function cj(a, b, c, d, e) {
  var f2 = Zf(c) ? Xf : H.current;
  f2 = Yf(b, f2);
  ch(b, e);
  c = Nh(a, b, c, d, f2, e);
  d = Sh();
  if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
  I && d && vg(b);
  b.flags |= 1;
  Xi(a, b, c, e);
  return b.child;
}
function hj(a, b, c, d, e) {
  if (Zf(c)) {
    var f2 = true;
    cg(b);
  } else f2 = false;
  ch(b, e);
  if (null === b.stateNode) ij(a, b), Gi(b, c, d), Ii(b, c, d, e), d = true;
  else if (null === a) {
    var g = b.stateNode, h = b.memoizedProps;
    g.props = h;
    var k2 = g.context, l2 = c.contextType;
    "object" === typeof l2 && null !== l2 ? l2 = eh(l2) : (l2 = Zf(c) ? Xf : H.current, l2 = Yf(b, l2));
    var m2 = c.getDerivedStateFromProps, q2 = "function" === typeof m2 || "function" === typeof g.getSnapshotBeforeUpdate;
    q2 || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== d || k2 !== l2) && Hi(b, g, d, l2);
    jh = false;
    var r2 = b.memoizedState;
    g.state = r2;
    qh(b, d, g, e);
    k2 = b.memoizedState;
    h !== d || r2 !== k2 || Wf.current || jh ? ("function" === typeof m2 && (Di(b, c, m2, d), k2 = b.memoizedState), (h = jh || Fi(b, c, h, d, r2, k2, l2)) ? (q2 || "function" !== typeof g.UNSAFE_componentWillMount && "function" !== typeof g.componentWillMount || ("function" === typeof g.componentWillMount && g.componentWillMount(), "function" === typeof g.UNSAFE_componentWillMount && g.UNSAFE_componentWillMount()), "function" === typeof g.componentDidMount && (b.flags |= 4194308)) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), b.memoizedProps = d, b.memoizedState = k2), g.props = d, g.state = k2, g.context = l2, d = h) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), d = false);
  } else {
    g = b.stateNode;
    lh(a, b);
    h = b.memoizedProps;
    l2 = b.type === b.elementType ? h : Ci(b.type, h);
    g.props = l2;
    q2 = b.pendingProps;
    r2 = g.context;
    k2 = c.contextType;
    "object" === typeof k2 && null !== k2 ? k2 = eh(k2) : (k2 = Zf(c) ? Xf : H.current, k2 = Yf(b, k2));
    var y2 = c.getDerivedStateFromProps;
    (m2 = "function" === typeof y2 || "function" === typeof g.getSnapshotBeforeUpdate) || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== q2 || r2 !== k2) && Hi(b, g, d, k2);
    jh = false;
    r2 = b.memoizedState;
    g.state = r2;
    qh(b, d, g, e);
    var n2 = b.memoizedState;
    h !== q2 || r2 !== n2 || Wf.current || jh ? ("function" === typeof y2 && (Di(b, c, y2, d), n2 = b.memoizedState), (l2 = jh || Fi(b, c, l2, d, r2, n2, k2) || false) ? (m2 || "function" !== typeof g.UNSAFE_componentWillUpdate && "function" !== typeof g.componentWillUpdate || ("function" === typeof g.componentWillUpdate && g.componentWillUpdate(d, n2, k2), "function" === typeof g.UNSAFE_componentWillUpdate && g.UNSAFE_componentWillUpdate(d, n2, k2)), "function" === typeof g.componentDidUpdate && (b.flags |= 4), "function" === typeof g.getSnapshotBeforeUpdate && (b.flags |= 1024)) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 1024), b.memoizedProps = d, b.memoizedState = n2), g.props = d, g.state = n2, g.context = k2, d = l2) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 1024), d = false);
  }
  return jj(a, b, c, d, f2, e);
}
function jj(a, b, c, d, e, f2) {
  gj(a, b);
  var g = 0 !== (b.flags & 128);
  if (!d && !g) return e && dg(b, c, false), Zi(a, b, f2);
  d = b.stateNode;
  Wi.current = b;
  var h = g && "function" !== typeof c.getDerivedStateFromError ? null : d.render();
  b.flags |= 1;
  null !== a && g ? (b.child = Ug(b, a.child, null, f2), b.child = Ug(b, null, h, f2)) : Xi(a, b, h, f2);
  b.memoizedState = d.state;
  e && dg(b, c, true);
  return b.child;
}
function kj(a) {
  var b = a.stateNode;
  b.pendingContext ? ag(a, b.pendingContext, b.pendingContext !== b.context) : b.context && ag(a, b.context, false);
  yh(a, b.containerInfo);
}
function lj(a, b, c, d, e) {
  Ig();
  Jg(e);
  b.flags |= 256;
  Xi(a, b, c, d);
  return b.child;
}
var mj = { dehydrated: null, treeContext: null, retryLane: 0 };
function nj(a) {
  return { baseLanes: a, cachePool: null, transitions: null };
}
function oj(a, b, c) {
  var d = b.pendingProps, e = L.current, f2 = false, g = 0 !== (b.flags & 128), h;
  (h = g) || (h = null !== a && null === a.memoizedState ? false : 0 !== (e & 2));
  if (h) f2 = true, b.flags &= -129;
  else if (null === a || null !== a.memoizedState) e |= 1;
  G(L, e & 1);
  if (null === a) {
    Eg(b);
    a = b.memoizedState;
    if (null !== a && (a = a.dehydrated, null !== a)) return 0 === (b.mode & 1) ? b.lanes = 1 : "$!" === a.data ? b.lanes = 8 : b.lanes = 1073741824, null;
    g = d.children;
    a = d.fallback;
    return f2 ? (d = b.mode, f2 = b.child, g = { mode: "hidden", children: g }, 0 === (d & 1) && null !== f2 ? (f2.childLanes = 0, f2.pendingProps = g) : f2 = pj(g, d, 0, null), a = Tg(a, d, c, null), f2.return = b, a.return = b, f2.sibling = a, b.child = f2, b.child.memoizedState = nj(c), b.memoizedState = mj, a) : qj(b, g);
  }
  e = a.memoizedState;
  if (null !== e && (h = e.dehydrated, null !== h)) return rj(a, b, g, d, h, e, c);
  if (f2) {
    f2 = d.fallback;
    g = b.mode;
    e = a.child;
    h = e.sibling;
    var k2 = { mode: "hidden", children: d.children };
    0 === (g & 1) && b.child !== e ? (d = b.child, d.childLanes = 0, d.pendingProps = k2, b.deletions = null) : (d = Pg(e, k2), d.subtreeFlags = e.subtreeFlags & 14680064);
    null !== h ? f2 = Pg(h, f2) : (f2 = Tg(f2, g, c, null), f2.flags |= 2);
    f2.return = b;
    d.return = b;
    d.sibling = f2;
    b.child = d;
    d = f2;
    f2 = b.child;
    g = a.child.memoizedState;
    g = null === g ? nj(c) : { baseLanes: g.baseLanes | c, cachePool: null, transitions: g.transitions };
    f2.memoizedState = g;
    f2.childLanes = a.childLanes & ~c;
    b.memoizedState = mj;
    return d;
  }
  f2 = a.child;
  a = f2.sibling;
  d = Pg(f2, { mode: "visible", children: d.children });
  0 === (b.mode & 1) && (d.lanes = c);
  d.return = b;
  d.sibling = null;
  null !== a && (c = b.deletions, null === c ? (b.deletions = [a], b.flags |= 16) : c.push(a));
  b.child = d;
  b.memoizedState = null;
  return d;
}
function qj(a, b) {
  b = pj({ mode: "visible", children: b }, a.mode, 0, null);
  b.return = a;
  return a.child = b;
}
function sj(a, b, c, d) {
  null !== d && Jg(d);
  Ug(b, a.child, null, c);
  a = qj(b, b.pendingProps.children);
  a.flags |= 2;
  b.memoizedState = null;
  return a;
}
function rj(a, b, c, d, e, f2, g) {
  if (c) {
    if (b.flags & 256) return b.flags &= -257, d = Ki(Error(p$1(422))), sj(a, b, g, d);
    if (null !== b.memoizedState) return b.child = a.child, b.flags |= 128, null;
    f2 = d.fallback;
    e = b.mode;
    d = pj({ mode: "visible", children: d.children }, e, 0, null);
    f2 = Tg(f2, e, g, null);
    f2.flags |= 2;
    d.return = b;
    f2.return = b;
    d.sibling = f2;
    b.child = d;
    0 !== (b.mode & 1) && Ug(b, a.child, null, g);
    b.child.memoizedState = nj(g);
    b.memoizedState = mj;
    return f2;
  }
  if (0 === (b.mode & 1)) return sj(a, b, g, null);
  if ("$!" === e.data) {
    d = e.nextSibling && e.nextSibling.dataset;
    if (d) var h = d.dgst;
    d = h;
    f2 = Error(p$1(419));
    d = Ki(f2, d, void 0);
    return sj(a, b, g, d);
  }
  h = 0 !== (g & a.childLanes);
  if (dh || h) {
    d = Q;
    if (null !== d) {
      switch (g & -g) {
        case 4:
          e = 2;
          break;
        case 16:
          e = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          e = 32;
          break;
        case 536870912:
          e = 268435456;
          break;
        default:
          e = 0;
      }
      e = 0 !== (e & (d.suspendedLanes | g)) ? 0 : e;
      0 !== e && e !== f2.retryLane && (f2.retryLane = e, ih(a, e), gi(d, a, e, -1));
    }
    tj();
    d = Ki(Error(p$1(421)));
    return sj(a, b, g, d);
  }
  if ("$?" === e.data) return b.flags |= 128, b.child = a.child, b = uj.bind(null, a), e._reactRetry = b, null;
  a = f2.treeContext;
  yg = Lf(e.nextSibling);
  xg = b;
  I = true;
  zg = null;
  null !== a && (og[pg++] = rg, og[pg++] = sg, og[pg++] = qg, rg = a.id, sg = a.overflow, qg = b);
  b = qj(b, d.children);
  b.flags |= 4096;
  return b;
}
function vj(a, b, c) {
  a.lanes |= b;
  var d = a.alternate;
  null !== d && (d.lanes |= b);
  bh(a.return, b, c);
}
function wj(a, b, c, d, e) {
  var f2 = a.memoizedState;
  null === f2 ? a.memoizedState = { isBackwards: b, rendering: null, renderingStartTime: 0, last: d, tail: c, tailMode: e } : (f2.isBackwards = b, f2.rendering = null, f2.renderingStartTime = 0, f2.last = d, f2.tail = c, f2.tailMode = e);
}
function xj(a, b, c) {
  var d = b.pendingProps, e = d.revealOrder, f2 = d.tail;
  Xi(a, b, d.children, c);
  d = L.current;
  if (0 !== (d & 2)) d = d & 1 | 2, b.flags |= 128;
  else {
    if (null !== a && 0 !== (a.flags & 128)) a: for (a = b.child; null !== a; ) {
      if (13 === a.tag) null !== a.memoizedState && vj(a, c, b);
      else if (19 === a.tag) vj(a, c, b);
      else if (null !== a.child) {
        a.child.return = a;
        a = a.child;
        continue;
      }
      if (a === b) break a;
      for (; null === a.sibling; ) {
        if (null === a.return || a.return === b) break a;
        a = a.return;
      }
      a.sibling.return = a.return;
      a = a.sibling;
    }
    d &= 1;
  }
  G(L, d);
  if (0 === (b.mode & 1)) b.memoizedState = null;
  else switch (e) {
    case "forwards":
      c = b.child;
      for (e = null; null !== c; ) a = c.alternate, null !== a && null === Ch(a) && (e = c), c = c.sibling;
      c = e;
      null === c ? (e = b.child, b.child = null) : (e = c.sibling, c.sibling = null);
      wj(b, false, e, c, f2);
      break;
    case "backwards":
      c = null;
      e = b.child;
      for (b.child = null; null !== e; ) {
        a = e.alternate;
        if (null !== a && null === Ch(a)) {
          b.child = e;
          break;
        }
        a = e.sibling;
        e.sibling = c;
        c = e;
        e = a;
      }
      wj(b, true, c, null, f2);
      break;
    case "together":
      wj(b, false, null, null, void 0);
      break;
    default:
      b.memoizedState = null;
  }
  return b.child;
}
function ij(a, b) {
  0 === (b.mode & 1) && null !== a && (a.alternate = null, b.alternate = null, b.flags |= 2);
}
function Zi(a, b, c) {
  null !== a && (b.dependencies = a.dependencies);
  rh |= b.lanes;
  if (0 === (c & b.childLanes)) return null;
  if (null !== a && b.child !== a.child) throw Error(p$1(153));
  if (null !== b.child) {
    a = b.child;
    c = Pg(a, a.pendingProps);
    b.child = c;
    for (c.return = b; null !== a.sibling; ) a = a.sibling, c = c.sibling = Pg(a, a.pendingProps), c.return = b;
    c.sibling = null;
  }
  return b.child;
}
function yj(a, b, c) {
  switch (b.tag) {
    case 3:
      kj(b);
      Ig();
      break;
    case 5:
      Ah(b);
      break;
    case 1:
      Zf(b.type) && cg(b);
      break;
    case 4:
      yh(b, b.stateNode.containerInfo);
      break;
    case 10:
      var d = b.type._context, e = b.memoizedProps.value;
      G(Wg, d._currentValue);
      d._currentValue = e;
      break;
    case 13:
      d = b.memoizedState;
      if (null !== d) {
        if (null !== d.dehydrated) return G(L, L.current & 1), b.flags |= 128, null;
        if (0 !== (c & b.child.childLanes)) return oj(a, b, c);
        G(L, L.current & 1);
        a = Zi(a, b, c);
        return null !== a ? a.sibling : null;
      }
      G(L, L.current & 1);
      break;
    case 19:
      d = 0 !== (c & b.childLanes);
      if (0 !== (a.flags & 128)) {
        if (d) return xj(a, b, c);
        b.flags |= 128;
      }
      e = b.memoizedState;
      null !== e && (e.rendering = null, e.tail = null, e.lastEffect = null);
      G(L, L.current);
      if (d) break;
      else return null;
    case 22:
    case 23:
      return b.lanes = 0, dj(a, b, c);
  }
  return Zi(a, b, c);
}
var zj, Aj, Bj, Cj;
zj = function(a, b) {
  for (var c = b.child; null !== c; ) {
    if (5 === c.tag || 6 === c.tag) a.appendChild(c.stateNode);
    else if (4 !== c.tag && null !== c.child) {
      c.child.return = c;
      c = c.child;
      continue;
    }
    if (c === b) break;
    for (; null === c.sibling; ) {
      if (null === c.return || c.return === b) return;
      c = c.return;
    }
    c.sibling.return = c.return;
    c = c.sibling;
  }
};
Aj = function() {
};
Bj = function(a, b, c, d) {
  var e = a.memoizedProps;
  if (e !== d) {
    a = b.stateNode;
    xh(uh.current);
    var f2 = null;
    switch (c) {
      case "input":
        e = Ya(a, e);
        d = Ya(a, d);
        f2 = [];
        break;
      case "select":
        e = A({}, e, { value: void 0 });
        d = A({}, d, { value: void 0 });
        f2 = [];
        break;
      case "textarea":
        e = gb(a, e);
        d = gb(a, d);
        f2 = [];
        break;
      default:
        "function" !== typeof e.onClick && "function" === typeof d.onClick && (a.onclick = Bf);
    }
    ub(c, d);
    var g;
    c = null;
    for (l2 in e) if (!d.hasOwnProperty(l2) && e.hasOwnProperty(l2) && null != e[l2]) if ("style" === l2) {
      var h = e[l2];
      for (g in h) h.hasOwnProperty(g) && (c || (c = {}), c[g] = "");
    } else "dangerouslySetInnerHTML" !== l2 && "children" !== l2 && "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && "autoFocus" !== l2 && (ea.hasOwnProperty(l2) ? f2 || (f2 = []) : (f2 = f2 || []).push(l2, null));
    for (l2 in d) {
      var k2 = d[l2];
      h = null != e ? e[l2] : void 0;
      if (d.hasOwnProperty(l2) && k2 !== h && (null != k2 || null != h)) if ("style" === l2) if (h) {
        for (g in h) !h.hasOwnProperty(g) || k2 && k2.hasOwnProperty(g) || (c || (c = {}), c[g] = "");
        for (g in k2) k2.hasOwnProperty(g) && h[g] !== k2[g] && (c || (c = {}), c[g] = k2[g]);
      } else c || (f2 || (f2 = []), f2.push(
        l2,
        c
      )), c = k2;
      else "dangerouslySetInnerHTML" === l2 ? (k2 = k2 ? k2.__html : void 0, h = h ? h.__html : void 0, null != k2 && h !== k2 && (f2 = f2 || []).push(l2, k2)) : "children" === l2 ? "string" !== typeof k2 && "number" !== typeof k2 || (f2 = f2 || []).push(l2, "" + k2) : "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && (ea.hasOwnProperty(l2) ? (null != k2 && "onScroll" === l2 && D("scroll", a), f2 || h === k2 || (f2 = [])) : (f2 = f2 || []).push(l2, k2));
    }
    c && (f2 = f2 || []).push("style", c);
    var l2 = f2;
    if (b.updateQueue = l2) b.flags |= 4;
  }
};
Cj = function(a, b, c, d) {
  c !== d && (b.flags |= 4);
};
function Dj(a, b) {
  if (!I) switch (a.tailMode) {
    case "hidden":
      b = a.tail;
      for (var c = null; null !== b; ) null !== b.alternate && (c = b), b = b.sibling;
      null === c ? a.tail = null : c.sibling = null;
      break;
    case "collapsed":
      c = a.tail;
      for (var d = null; null !== c; ) null !== c.alternate && (d = c), c = c.sibling;
      null === d ? b || null === a.tail ? a.tail = null : a.tail.sibling = null : d.sibling = null;
  }
}
function S(a) {
  var b = null !== a.alternate && a.alternate.child === a.child, c = 0, d = 0;
  if (b) for (var e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags & 14680064, d |= e.flags & 14680064, e.return = a, e = e.sibling;
  else for (e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags, d |= e.flags, e.return = a, e = e.sibling;
  a.subtreeFlags |= d;
  a.childLanes = c;
  return b;
}
function Ej(a, b, c) {
  var d = b.pendingProps;
  wg(b);
  switch (b.tag) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return S(b), null;
    case 1:
      return Zf(b.type) && $f(), S(b), null;
    case 3:
      d = b.stateNode;
      zh();
      E(Wf);
      E(H);
      Eh();
      d.pendingContext && (d.context = d.pendingContext, d.pendingContext = null);
      if (null === a || null === a.child) Gg(b) ? b.flags |= 4 : null === a || a.memoizedState.isDehydrated && 0 === (b.flags & 256) || (b.flags |= 1024, null !== zg && (Fj(zg), zg = null));
      Aj(a, b);
      S(b);
      return null;
    case 5:
      Bh(b);
      var e = xh(wh.current);
      c = b.type;
      if (null !== a && null != b.stateNode) Bj(a, b, c, d, e), a.ref !== b.ref && (b.flags |= 512, b.flags |= 2097152);
      else {
        if (!d) {
          if (null === b.stateNode) throw Error(p$1(166));
          S(b);
          return null;
        }
        a = xh(uh.current);
        if (Gg(b)) {
          d = b.stateNode;
          c = b.type;
          var f2 = b.memoizedProps;
          d[Of] = b;
          d[Pf] = f2;
          a = 0 !== (b.mode & 1);
          switch (c) {
            case "dialog":
              D("cancel", d);
              D("close", d);
              break;
            case "iframe":
            case "object":
            case "embed":
              D("load", d);
              break;
            case "video":
            case "audio":
              for (e = 0; e < lf.length; e++) D(lf[e], d);
              break;
            case "source":
              D("error", d);
              break;
            case "img":
            case "image":
            case "link":
              D(
                "error",
                d
              );
              D("load", d);
              break;
            case "details":
              D("toggle", d);
              break;
            case "input":
              Za(d, f2);
              D("invalid", d);
              break;
            case "select":
              d._wrapperState = { wasMultiple: !!f2.multiple };
              D("invalid", d);
              break;
            case "textarea":
              hb(d, f2), D("invalid", d);
          }
          ub(c, f2);
          e = null;
          for (var g in f2) if (f2.hasOwnProperty(g)) {
            var h = f2[g];
            "children" === g ? "string" === typeof h ? d.textContent !== h && (true !== f2.suppressHydrationWarning && Af(d.textContent, h, a), e = ["children", h]) : "number" === typeof h && d.textContent !== "" + h && (true !== f2.suppressHydrationWarning && Af(
              d.textContent,
              h,
              a
            ), e = ["children", "" + h]) : ea.hasOwnProperty(g) && null != h && "onScroll" === g && D("scroll", d);
          }
          switch (c) {
            case "input":
              Va(d);
              db(d, f2, true);
              break;
            case "textarea":
              Va(d);
              jb(d);
              break;
            case "select":
            case "option":
              break;
            default:
              "function" === typeof f2.onClick && (d.onclick = Bf);
          }
          d = e;
          b.updateQueue = d;
          null !== d && (b.flags |= 4);
        } else {
          g = 9 === e.nodeType ? e : e.ownerDocument;
          "http://www.w3.org/1999/xhtml" === a && (a = kb(c));
          "http://www.w3.org/1999/xhtml" === a ? "script" === c ? (a = g.createElement("div"), a.innerHTML = "<script><\/script>", a = a.removeChild(a.firstChild)) : "string" === typeof d.is ? a = g.createElement(c, { is: d.is }) : (a = g.createElement(c), "select" === c && (g = a, d.multiple ? g.multiple = true : d.size && (g.size = d.size))) : a = g.createElementNS(a, c);
          a[Of] = b;
          a[Pf] = d;
          zj(a, b, false, false);
          b.stateNode = a;
          a: {
            g = vb(c, d);
            switch (c) {
              case "dialog":
                D("cancel", a);
                D("close", a);
                e = d;
                break;
              case "iframe":
              case "object":
              case "embed":
                D("load", a);
                e = d;
                break;
              case "video":
              case "audio":
                for (e = 0; e < lf.length; e++) D(lf[e], a);
                e = d;
                break;
              case "source":
                D("error", a);
                e = d;
                break;
              case "img":
              case "image":
              case "link":
                D(
                  "error",
                  a
                );
                D("load", a);
                e = d;
                break;
              case "details":
                D("toggle", a);
                e = d;
                break;
              case "input":
                Za(a, d);
                e = Ya(a, d);
                D("invalid", a);
                break;
              case "option":
                e = d;
                break;
              case "select":
                a._wrapperState = { wasMultiple: !!d.multiple };
                e = A({}, d, { value: void 0 });
                D("invalid", a);
                break;
              case "textarea":
                hb(a, d);
                e = gb(a, d);
                D("invalid", a);
                break;
              default:
                e = d;
            }
            ub(c, e);
            h = e;
            for (f2 in h) if (h.hasOwnProperty(f2)) {
              var k2 = h[f2];
              "style" === f2 ? sb(a, k2) : "dangerouslySetInnerHTML" === f2 ? (k2 = k2 ? k2.__html : void 0, null != k2 && nb(a, k2)) : "children" === f2 ? "string" === typeof k2 ? ("textarea" !== c || "" !== k2) && ob(a, k2) : "number" === typeof k2 && ob(a, "" + k2) : "suppressContentEditableWarning" !== f2 && "suppressHydrationWarning" !== f2 && "autoFocus" !== f2 && (ea.hasOwnProperty(f2) ? null != k2 && "onScroll" === f2 && D("scroll", a) : null != k2 && ta(a, f2, k2, g));
            }
            switch (c) {
              case "input":
                Va(a);
                db(a, d, false);
                break;
              case "textarea":
                Va(a);
                jb(a);
                break;
              case "option":
                null != d.value && a.setAttribute("value", "" + Sa(d.value));
                break;
              case "select":
                a.multiple = !!d.multiple;
                f2 = d.value;
                null != f2 ? fb(a, !!d.multiple, f2, false) : null != d.defaultValue && fb(
                  a,
                  !!d.multiple,
                  d.defaultValue,
                  true
                );
                break;
              default:
                "function" === typeof e.onClick && (a.onclick = Bf);
            }
            switch (c) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                d = !!d.autoFocus;
                break a;
              case "img":
                d = true;
                break a;
              default:
                d = false;
            }
          }
          d && (b.flags |= 4);
        }
        null !== b.ref && (b.flags |= 512, b.flags |= 2097152);
      }
      S(b);
      return null;
    case 6:
      if (a && null != b.stateNode) Cj(a, b, a.memoizedProps, d);
      else {
        if ("string" !== typeof d && null === b.stateNode) throw Error(p$1(166));
        c = xh(wh.current);
        xh(uh.current);
        if (Gg(b)) {
          d = b.stateNode;
          c = b.memoizedProps;
          d[Of] = b;
          if (f2 = d.nodeValue !== c) {
            if (a = xg, null !== a) switch (a.tag) {
              case 3:
                Af(d.nodeValue, c, 0 !== (a.mode & 1));
                break;
              case 5:
                true !== a.memoizedProps.suppressHydrationWarning && Af(d.nodeValue, c, 0 !== (a.mode & 1));
            }
          }
          f2 && (b.flags |= 4);
        } else d = (9 === c.nodeType ? c : c.ownerDocument).createTextNode(d), d[Of] = b, b.stateNode = d;
      }
      S(b);
      return null;
    case 13:
      E(L);
      d = b.memoizedState;
      if (null === a || null !== a.memoizedState && null !== a.memoizedState.dehydrated) {
        if (I && null !== yg && 0 !== (b.mode & 1) && 0 === (b.flags & 128)) Hg(), Ig(), b.flags |= 98560, f2 = false;
        else if (f2 = Gg(b), null !== d && null !== d.dehydrated) {
          if (null === a) {
            if (!f2) throw Error(p$1(318));
            f2 = b.memoizedState;
            f2 = null !== f2 ? f2.dehydrated : null;
            if (!f2) throw Error(p$1(317));
            f2[Of] = b;
          } else Ig(), 0 === (b.flags & 128) && (b.memoizedState = null), b.flags |= 4;
          S(b);
          f2 = false;
        } else null !== zg && (Fj(zg), zg = null), f2 = true;
        if (!f2) return b.flags & 65536 ? b : null;
      }
      if (0 !== (b.flags & 128)) return b.lanes = c, b;
      d = null !== d;
      d !== (null !== a && null !== a.memoizedState) && d && (b.child.flags |= 8192, 0 !== (b.mode & 1) && (null === a || 0 !== (L.current & 1) ? 0 === T && (T = 3) : tj()));
      null !== b.updateQueue && (b.flags |= 4);
      S(b);
      return null;
    case 4:
      return zh(), Aj(a, b), null === a && sf(b.stateNode.containerInfo), S(b), null;
    case 10:
      return ah(b.type._context), S(b), null;
    case 17:
      return Zf(b.type) && $f(), S(b), null;
    case 19:
      E(L);
      f2 = b.memoizedState;
      if (null === f2) return S(b), null;
      d = 0 !== (b.flags & 128);
      g = f2.rendering;
      if (null === g) if (d) Dj(f2, false);
      else {
        if (0 !== T || null !== a && 0 !== (a.flags & 128)) for (a = b.child; null !== a; ) {
          g = Ch(a);
          if (null !== g) {
            b.flags |= 128;
            Dj(f2, false);
            d = g.updateQueue;
            null !== d && (b.updateQueue = d, b.flags |= 4);
            b.subtreeFlags = 0;
            d = c;
            for (c = b.child; null !== c; ) f2 = c, a = d, f2.flags &= 14680066, g = f2.alternate, null === g ? (f2.childLanes = 0, f2.lanes = a, f2.child = null, f2.subtreeFlags = 0, f2.memoizedProps = null, f2.memoizedState = null, f2.updateQueue = null, f2.dependencies = null, f2.stateNode = null) : (f2.childLanes = g.childLanes, f2.lanes = g.lanes, f2.child = g.child, f2.subtreeFlags = 0, f2.deletions = null, f2.memoizedProps = g.memoizedProps, f2.memoizedState = g.memoizedState, f2.updateQueue = g.updateQueue, f2.type = g.type, a = g.dependencies, f2.dependencies = null === a ? null : { lanes: a.lanes, firstContext: a.firstContext }), c = c.sibling;
            G(L, L.current & 1 | 2);
            return b.child;
          }
          a = a.sibling;
        }
        null !== f2.tail && B() > Gj && (b.flags |= 128, d = true, Dj(f2, false), b.lanes = 4194304);
      }
      else {
        if (!d) if (a = Ch(g), null !== a) {
          if (b.flags |= 128, d = true, c = a.updateQueue, null !== c && (b.updateQueue = c, b.flags |= 4), Dj(f2, true), null === f2.tail && "hidden" === f2.tailMode && !g.alternate && !I) return S(b), null;
        } else 2 * B() - f2.renderingStartTime > Gj && 1073741824 !== c && (b.flags |= 128, d = true, Dj(f2, false), b.lanes = 4194304);
        f2.isBackwards ? (g.sibling = b.child, b.child = g) : (c = f2.last, null !== c ? c.sibling = g : b.child = g, f2.last = g);
      }
      if (null !== f2.tail) return b = f2.tail, f2.rendering = b, f2.tail = b.sibling, f2.renderingStartTime = B(), b.sibling = null, c = L.current, G(L, d ? c & 1 | 2 : c & 1), b;
      S(b);
      return null;
    case 22:
    case 23:
      return Hj(), d = null !== b.memoizedState, null !== a && null !== a.memoizedState !== d && (b.flags |= 8192), d && 0 !== (b.mode & 1) ? 0 !== (fj & 1073741824) && (S(b), b.subtreeFlags & 6 && (b.flags |= 8192)) : S(b), null;
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(p$1(156, b.tag));
}
function Ij(a, b) {
  wg(b);
  switch (b.tag) {
    case 1:
      return Zf(b.type) && $f(), a = b.flags, a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
    case 3:
      return zh(), E(Wf), E(H), Eh(), a = b.flags, 0 !== (a & 65536) && 0 === (a & 128) ? (b.flags = a & -65537 | 128, b) : null;
    case 5:
      return Bh(b), null;
    case 13:
      E(L);
      a = b.memoizedState;
      if (null !== a && null !== a.dehydrated) {
        if (null === b.alternate) throw Error(p$1(340));
        Ig();
      }
      a = b.flags;
      return a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
    case 19:
      return E(L), null;
    case 4:
      return zh(), null;
    case 10:
      return ah(b.type._context), null;
    case 22:
    case 23:
      return Hj(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
var Jj = false, U = false, Kj = "function" === typeof WeakSet ? WeakSet : Set, V = null;
function Lj(a, b) {
  var c = a.ref;
  if (null !== c) if ("function" === typeof c) try {
    c(null);
  } catch (d) {
    W(a, b, d);
  }
  else c.current = null;
}
function Mj(a, b, c) {
  try {
    c();
  } catch (d) {
    W(a, b, d);
  }
}
var Nj = false;
function Oj(a, b) {
  Cf = dd;
  a = Me();
  if (Ne(a)) {
    if ("selectionStart" in a) var c = { start: a.selectionStart, end: a.selectionEnd };
    else a: {
      c = (c = a.ownerDocument) && c.defaultView || window;
      var d = c.getSelection && c.getSelection();
      if (d && 0 !== d.rangeCount) {
        c = d.anchorNode;
        var e = d.anchorOffset, f2 = d.focusNode;
        d = d.focusOffset;
        try {
          c.nodeType, f2.nodeType;
        } catch (F2) {
          c = null;
          break a;
        }
        var g = 0, h = -1, k2 = -1, l2 = 0, m2 = 0, q2 = a, r2 = null;
        b: for (; ; ) {
          for (var y2; ; ) {
            q2 !== c || 0 !== e && 3 !== q2.nodeType || (h = g + e);
            q2 !== f2 || 0 !== d && 3 !== q2.nodeType || (k2 = g + d);
            3 === q2.nodeType && (g += q2.nodeValue.length);
            if (null === (y2 = q2.firstChild)) break;
            r2 = q2;
            q2 = y2;
          }
          for (; ; ) {
            if (q2 === a) break b;
            r2 === c && ++l2 === e && (h = g);
            r2 === f2 && ++m2 === d && (k2 = g);
            if (null !== (y2 = q2.nextSibling)) break;
            q2 = r2;
            r2 = q2.parentNode;
          }
          q2 = y2;
        }
        c = -1 === h || -1 === k2 ? null : { start: h, end: k2 };
      } else c = null;
    }
    c = c || { start: 0, end: 0 };
  } else c = null;
  Df = { focusedElem: a, selectionRange: c };
  dd = false;
  for (V = b; null !== V; ) if (b = V, a = b.child, 0 !== (b.subtreeFlags & 1028) && null !== a) a.return = b, V = a;
  else for (; null !== V; ) {
    b = V;
    try {
      var n2 = b.alternate;
      if (0 !== (b.flags & 1024)) switch (b.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if (null !== n2) {
            var t2 = n2.memoizedProps, J2 = n2.memoizedState, x2 = b.stateNode, w2 = x2.getSnapshotBeforeUpdate(b.elementType === b.type ? t2 : Ci(b.type, t2), J2);
            x2.__reactInternalSnapshotBeforeUpdate = w2;
          }
          break;
        case 3:
          var u2 = b.stateNode.containerInfo;
          1 === u2.nodeType ? u2.textContent = "" : 9 === u2.nodeType && u2.documentElement && u2.removeChild(u2.documentElement);
          break;
        case 5:
        case 6:
        case 4:
        case 17:
          break;
        default:
          throw Error(p$1(163));
      }
    } catch (F2) {
      W(b, b.return, F2);
    }
    a = b.sibling;
    if (null !== a) {
      a.return = b.return;
      V = a;
      break;
    }
    V = b.return;
  }
  n2 = Nj;
  Nj = false;
  return n2;
}
function Pj(a, b, c) {
  var d = b.updateQueue;
  d = null !== d ? d.lastEffect : null;
  if (null !== d) {
    var e = d = d.next;
    do {
      if ((e.tag & a) === a) {
        var f2 = e.destroy;
        e.destroy = void 0;
        void 0 !== f2 && Mj(b, c, f2);
      }
      e = e.next;
    } while (e !== d);
  }
}
function Qj(a, b) {
  b = b.updateQueue;
  b = null !== b ? b.lastEffect : null;
  if (null !== b) {
    var c = b = b.next;
    do {
      if ((c.tag & a) === a) {
        var d = c.create;
        c.destroy = d();
      }
      c = c.next;
    } while (c !== b);
  }
}
function Rj(a) {
  var b = a.ref;
  if (null !== b) {
    var c = a.stateNode;
    switch (a.tag) {
      case 5:
        a = c;
        break;
      default:
        a = c;
    }
    "function" === typeof b ? b(a) : b.current = a;
  }
}
function Sj(a) {
  var b = a.alternate;
  null !== b && (a.alternate = null, Sj(b));
  a.child = null;
  a.deletions = null;
  a.sibling = null;
  5 === a.tag && (b = a.stateNode, null !== b && (delete b[Of], delete b[Pf], delete b[of], delete b[Qf], delete b[Rf]));
  a.stateNode = null;
  a.return = null;
  a.dependencies = null;
  a.memoizedProps = null;
  a.memoizedState = null;
  a.pendingProps = null;
  a.stateNode = null;
  a.updateQueue = null;
}
function Tj(a) {
  return 5 === a.tag || 3 === a.tag || 4 === a.tag;
}
function Uj(a) {
  a: for (; ; ) {
    for (; null === a.sibling; ) {
      if (null === a.return || Tj(a.return)) return null;
      a = a.return;
    }
    a.sibling.return = a.return;
    for (a = a.sibling; 5 !== a.tag && 6 !== a.tag && 18 !== a.tag; ) {
      if (a.flags & 2) continue a;
      if (null === a.child || 4 === a.tag) continue a;
      else a.child.return = a, a = a.child;
    }
    if (!(a.flags & 2)) return a.stateNode;
  }
}
function Vj(a, b, c) {
  var d = a.tag;
  if (5 === d || 6 === d) a = a.stateNode, b ? 8 === c.nodeType ? c.parentNode.insertBefore(a, b) : c.insertBefore(a, b) : (8 === c.nodeType ? (b = c.parentNode, b.insertBefore(a, c)) : (b = c, b.appendChild(a)), c = c._reactRootContainer, null !== c && void 0 !== c || null !== b.onclick || (b.onclick = Bf));
  else if (4 !== d && (a = a.child, null !== a)) for (Vj(a, b, c), a = a.sibling; null !== a; ) Vj(a, b, c), a = a.sibling;
}
function Wj(a, b, c) {
  var d = a.tag;
  if (5 === d || 6 === d) a = a.stateNode, b ? c.insertBefore(a, b) : c.appendChild(a);
  else if (4 !== d && (a = a.child, null !== a)) for (Wj(a, b, c), a = a.sibling; null !== a; ) Wj(a, b, c), a = a.sibling;
}
var X = null, Xj = false;
function Yj(a, b, c) {
  for (c = c.child; null !== c; ) Zj(a, b, c), c = c.sibling;
}
function Zj(a, b, c) {
  if (lc && "function" === typeof lc.onCommitFiberUnmount) try {
    lc.onCommitFiberUnmount(kc, c);
  } catch (h) {
  }
  switch (c.tag) {
    case 5:
      U || Lj(c, b);
    case 6:
      var d = X, e = Xj;
      X = null;
      Yj(a, b, c);
      X = d;
      Xj = e;
      null !== X && (Xj ? (a = X, c = c.stateNode, 8 === a.nodeType ? a.parentNode.removeChild(c) : a.removeChild(c)) : X.removeChild(c.stateNode));
      break;
    case 18:
      null !== X && (Xj ? (a = X, c = c.stateNode, 8 === a.nodeType ? Kf(a.parentNode, c) : 1 === a.nodeType && Kf(a, c), bd(a)) : Kf(X, c.stateNode));
      break;
    case 4:
      d = X;
      e = Xj;
      X = c.stateNode.containerInfo;
      Xj = true;
      Yj(a, b, c);
      X = d;
      Xj = e;
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (!U && (d = c.updateQueue, null !== d && (d = d.lastEffect, null !== d))) {
        e = d = d.next;
        do {
          var f2 = e, g = f2.destroy;
          f2 = f2.tag;
          void 0 !== g && (0 !== (f2 & 2) ? Mj(c, b, g) : 0 !== (f2 & 4) && Mj(c, b, g));
          e = e.next;
        } while (e !== d);
      }
      Yj(a, b, c);
      break;
    case 1:
      if (!U && (Lj(c, b), d = c.stateNode, "function" === typeof d.componentWillUnmount)) try {
        d.props = c.memoizedProps, d.state = c.memoizedState, d.componentWillUnmount();
      } catch (h) {
        W(c, b, h);
      }
      Yj(a, b, c);
      break;
    case 21:
      Yj(a, b, c);
      break;
    case 22:
      c.mode & 1 ? (U = (d = U) || null !== c.memoizedState, Yj(a, b, c), U = d) : Yj(a, b, c);
      break;
    default:
      Yj(a, b, c);
  }
}
function ak(a) {
  var b = a.updateQueue;
  if (null !== b) {
    a.updateQueue = null;
    var c = a.stateNode;
    null === c && (c = a.stateNode = new Kj());
    b.forEach(function(b2) {
      var d = bk.bind(null, a, b2);
      c.has(b2) || (c.add(b2), b2.then(d, d));
    });
  }
}
function ck(a, b) {
  var c = b.deletions;
  if (null !== c) for (var d = 0; d < c.length; d++) {
    var e = c[d];
    try {
      var f2 = a, g = b, h = g;
      a: for (; null !== h; ) {
        switch (h.tag) {
          case 5:
            X = h.stateNode;
            Xj = false;
            break a;
          case 3:
            X = h.stateNode.containerInfo;
            Xj = true;
            break a;
          case 4:
            X = h.stateNode.containerInfo;
            Xj = true;
            break a;
        }
        h = h.return;
      }
      if (null === X) throw Error(p$1(160));
      Zj(f2, g, e);
      X = null;
      Xj = false;
      var k2 = e.alternate;
      null !== k2 && (k2.return = null);
      e.return = null;
    } catch (l2) {
      W(e, b, l2);
    }
  }
  if (b.subtreeFlags & 12854) for (b = b.child; null !== b; ) dk(b, a), b = b.sibling;
}
function dk(a, b) {
  var c = a.alternate, d = a.flags;
  switch (a.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      ck(b, a);
      ek(a);
      if (d & 4) {
        try {
          Pj(3, a, a.return), Qj(3, a);
        } catch (t2) {
          W(a, a.return, t2);
        }
        try {
          Pj(5, a, a.return);
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 1:
      ck(b, a);
      ek(a);
      d & 512 && null !== c && Lj(c, c.return);
      break;
    case 5:
      ck(b, a);
      ek(a);
      d & 512 && null !== c && Lj(c, c.return);
      if (a.flags & 32) {
        var e = a.stateNode;
        try {
          ob(e, "");
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      if (d & 4 && (e = a.stateNode, null != e)) {
        var f2 = a.memoizedProps, g = null !== c ? c.memoizedProps : f2, h = a.type, k2 = a.updateQueue;
        a.updateQueue = null;
        if (null !== k2) try {
          "input" === h && "radio" === f2.type && null != f2.name && ab(e, f2);
          vb(h, g);
          var l2 = vb(h, f2);
          for (g = 0; g < k2.length; g += 2) {
            var m2 = k2[g], q2 = k2[g + 1];
            "style" === m2 ? sb(e, q2) : "dangerouslySetInnerHTML" === m2 ? nb(e, q2) : "children" === m2 ? ob(e, q2) : ta(e, m2, q2, l2);
          }
          switch (h) {
            case "input":
              bb(e, f2);
              break;
            case "textarea":
              ib(e, f2);
              break;
            case "select":
              var r2 = e._wrapperState.wasMultiple;
              e._wrapperState.wasMultiple = !!f2.multiple;
              var y2 = f2.value;
              null != y2 ? fb(e, !!f2.multiple, y2, false) : r2 !== !!f2.multiple && (null != f2.defaultValue ? fb(
                e,
                !!f2.multiple,
                f2.defaultValue,
                true
              ) : fb(e, !!f2.multiple, f2.multiple ? [] : "", false));
          }
          e[Pf] = f2;
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 6:
      ck(b, a);
      ek(a);
      if (d & 4) {
        if (null === a.stateNode) throw Error(p$1(162));
        e = a.stateNode;
        f2 = a.memoizedProps;
        try {
          e.nodeValue = f2;
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 3:
      ck(b, a);
      ek(a);
      if (d & 4 && null !== c && c.memoizedState.isDehydrated) try {
        bd(b.containerInfo);
      } catch (t2) {
        W(a, a.return, t2);
      }
      break;
    case 4:
      ck(b, a);
      ek(a);
      break;
    case 13:
      ck(b, a);
      ek(a);
      e = a.child;
      e.flags & 8192 && (f2 = null !== e.memoizedState, e.stateNode.isHidden = f2, !f2 || null !== e.alternate && null !== e.alternate.memoizedState || (fk = B()));
      d & 4 && ak(a);
      break;
    case 22:
      m2 = null !== c && null !== c.memoizedState;
      a.mode & 1 ? (U = (l2 = U) || m2, ck(b, a), U = l2) : ck(b, a);
      ek(a);
      if (d & 8192) {
        l2 = null !== a.memoizedState;
        if ((a.stateNode.isHidden = l2) && !m2 && 0 !== (a.mode & 1)) for (V = a, m2 = a.child; null !== m2; ) {
          for (q2 = V = m2; null !== V; ) {
            r2 = V;
            y2 = r2.child;
            switch (r2.tag) {
              case 0:
              case 11:
              case 14:
              case 15:
                Pj(4, r2, r2.return);
                break;
              case 1:
                Lj(r2, r2.return);
                var n2 = r2.stateNode;
                if ("function" === typeof n2.componentWillUnmount) {
                  d = r2;
                  c = r2.return;
                  try {
                    b = d, n2.props = b.memoizedProps, n2.state = b.memoizedState, n2.componentWillUnmount();
                  } catch (t2) {
                    W(d, c, t2);
                  }
                }
                break;
              case 5:
                Lj(r2, r2.return);
                break;
              case 22:
                if (null !== r2.memoizedState) {
                  gk(q2);
                  continue;
                }
            }
            null !== y2 ? (y2.return = r2, V = y2) : gk(q2);
          }
          m2 = m2.sibling;
        }
        a: for (m2 = null, q2 = a; ; ) {
          if (5 === q2.tag) {
            if (null === m2) {
              m2 = q2;
              try {
                e = q2.stateNode, l2 ? (f2 = e.style, "function" === typeof f2.setProperty ? f2.setProperty("display", "none", "important") : f2.display = "none") : (h = q2.stateNode, k2 = q2.memoizedProps.style, g = void 0 !== k2 && null !== k2 && k2.hasOwnProperty("display") ? k2.display : null, h.style.display = rb("display", g));
              } catch (t2) {
                W(a, a.return, t2);
              }
            }
          } else if (6 === q2.tag) {
            if (null === m2) try {
              q2.stateNode.nodeValue = l2 ? "" : q2.memoizedProps;
            } catch (t2) {
              W(a, a.return, t2);
            }
          } else if ((22 !== q2.tag && 23 !== q2.tag || null === q2.memoizedState || q2 === a) && null !== q2.child) {
            q2.child.return = q2;
            q2 = q2.child;
            continue;
          }
          if (q2 === a) break a;
          for (; null === q2.sibling; ) {
            if (null === q2.return || q2.return === a) break a;
            m2 === q2 && (m2 = null);
            q2 = q2.return;
          }
          m2 === q2 && (m2 = null);
          q2.sibling.return = q2.return;
          q2 = q2.sibling;
        }
      }
      break;
    case 19:
      ck(b, a);
      ek(a);
      d & 4 && ak(a);
      break;
    case 21:
      break;
    default:
      ck(
        b,
        a
      ), ek(a);
  }
}
function ek(a) {
  var b = a.flags;
  if (b & 2) {
    try {
      a: {
        for (var c = a.return; null !== c; ) {
          if (Tj(c)) {
            var d = c;
            break a;
          }
          c = c.return;
        }
        throw Error(p$1(160));
      }
      switch (d.tag) {
        case 5:
          var e = d.stateNode;
          d.flags & 32 && (ob(e, ""), d.flags &= -33);
          var f2 = Uj(a);
          Wj(a, f2, e);
          break;
        case 3:
        case 4:
          var g = d.stateNode.containerInfo, h = Uj(a);
          Vj(a, h, g);
          break;
        default:
          throw Error(p$1(161));
      }
    } catch (k2) {
      W(a, a.return, k2);
    }
    a.flags &= -3;
  }
  b & 4096 && (a.flags &= -4097);
}
function hk(a, b, c) {
  V = a;
  ik(a);
}
function ik(a, b, c) {
  for (var d = 0 !== (a.mode & 1); null !== V; ) {
    var e = V, f2 = e.child;
    if (22 === e.tag && d) {
      var g = null !== e.memoizedState || Jj;
      if (!g) {
        var h = e.alternate, k2 = null !== h && null !== h.memoizedState || U;
        h = Jj;
        var l2 = U;
        Jj = g;
        if ((U = k2) && !l2) for (V = e; null !== V; ) g = V, k2 = g.child, 22 === g.tag && null !== g.memoizedState ? jk(e) : null !== k2 ? (k2.return = g, V = k2) : jk(e);
        for (; null !== f2; ) V = f2, ik(f2), f2 = f2.sibling;
        V = e;
        Jj = h;
        U = l2;
      }
      kk(a);
    } else 0 !== (e.subtreeFlags & 8772) && null !== f2 ? (f2.return = e, V = f2) : kk(a);
  }
}
function kk(a) {
  for (; null !== V; ) {
    var b = V;
    if (0 !== (b.flags & 8772)) {
      var c = b.alternate;
      try {
        if (0 !== (b.flags & 8772)) switch (b.tag) {
          case 0:
          case 11:
          case 15:
            U || Qj(5, b);
            break;
          case 1:
            var d = b.stateNode;
            if (b.flags & 4 && !U) if (null === c) d.componentDidMount();
            else {
              var e = b.elementType === b.type ? c.memoizedProps : Ci(b.type, c.memoizedProps);
              d.componentDidUpdate(e, c.memoizedState, d.__reactInternalSnapshotBeforeUpdate);
            }
            var f2 = b.updateQueue;
            null !== f2 && sh(b, f2, d);
            break;
          case 3:
            var g = b.updateQueue;
            if (null !== g) {
              c = null;
              if (null !== b.child) switch (b.child.tag) {
                case 5:
                  c = b.child.stateNode;
                  break;
                case 1:
                  c = b.child.stateNode;
              }
              sh(b, g, c);
            }
            break;
          case 5:
            var h = b.stateNode;
            if (null === c && b.flags & 4) {
              c = h;
              var k2 = b.memoizedProps;
              switch (b.type) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  k2.autoFocus && c.focus();
                  break;
                case "img":
                  k2.src && (c.src = k2.src);
              }
            }
            break;
          case 6:
            break;
          case 4:
            break;
          case 12:
            break;
          case 13:
            if (null === b.memoizedState) {
              var l2 = b.alternate;
              if (null !== l2) {
                var m2 = l2.memoizedState;
                if (null !== m2) {
                  var q2 = m2.dehydrated;
                  null !== q2 && bd(q2);
                }
              }
            }
            break;
          case 19:
          case 17:
          case 21:
          case 22:
          case 23:
          case 25:
            break;
          default:
            throw Error(p$1(163));
        }
        U || b.flags & 512 && Rj(b);
      } catch (r2) {
        W(b, b.return, r2);
      }
    }
    if (b === a) {
      V = null;
      break;
    }
    c = b.sibling;
    if (null !== c) {
      c.return = b.return;
      V = c;
      break;
    }
    V = b.return;
  }
}
function gk(a) {
  for (; null !== V; ) {
    var b = V;
    if (b === a) {
      V = null;
      break;
    }
    var c = b.sibling;
    if (null !== c) {
      c.return = b.return;
      V = c;
      break;
    }
    V = b.return;
  }
}
function jk(a) {
  for (; null !== V; ) {
    var b = V;
    try {
      switch (b.tag) {
        case 0:
        case 11:
        case 15:
          var c = b.return;
          try {
            Qj(4, b);
          } catch (k2) {
            W(b, c, k2);
          }
          break;
        case 1:
          var d = b.stateNode;
          if ("function" === typeof d.componentDidMount) {
            var e = b.return;
            try {
              d.componentDidMount();
            } catch (k2) {
              W(b, e, k2);
            }
          }
          var f2 = b.return;
          try {
            Rj(b);
          } catch (k2) {
            W(b, f2, k2);
          }
          break;
        case 5:
          var g = b.return;
          try {
            Rj(b);
          } catch (k2) {
            W(b, g, k2);
          }
      }
    } catch (k2) {
      W(b, b.return, k2);
    }
    if (b === a) {
      V = null;
      break;
    }
    var h = b.sibling;
    if (null !== h) {
      h.return = b.return;
      V = h;
      break;
    }
    V = b.return;
  }
}
var lk = Math.ceil, mk = ua.ReactCurrentDispatcher, nk = ua.ReactCurrentOwner, ok = ua.ReactCurrentBatchConfig, K = 0, Q = null, Y = null, Z = 0, fj = 0, ej = Uf(0), T = 0, pk = null, rh = 0, qk = 0, rk = 0, sk = null, tk = null, fk = 0, Gj = Infinity, uk = null, Oi = false, Pi = null, Ri = null, vk = false, wk = null, xk = 0, yk = 0, zk = null, Ak = -1, Bk = 0;
function R() {
  return 0 !== (K & 6) ? B() : -1 !== Ak ? Ak : Ak = B();
}
function yi(a) {
  if (0 === (a.mode & 1)) return 1;
  if (0 !== (K & 2) && 0 !== Z) return Z & -Z;
  if (null !== Kg.transition) return 0 === Bk && (Bk = yc()), Bk;
  a = C;
  if (0 !== a) return a;
  a = window.event;
  a = void 0 === a ? 16 : jd(a.type);
  return a;
}
function gi(a, b, c, d) {
  if (50 < yk) throw yk = 0, zk = null, Error(p$1(185));
  Ac(a, c, d);
  if (0 === (K & 2) || a !== Q) a === Q && (0 === (K & 2) && (qk |= c), 4 === T && Ck(a, Z)), Dk(a, d), 1 === c && 0 === K && 0 === (b.mode & 1) && (Gj = B() + 500, fg && jg());
}
function Dk(a, b) {
  var c = a.callbackNode;
  wc(a, b);
  var d = uc(a, a === Q ? Z : 0);
  if (0 === d) null !== c && bc(c), a.callbackNode = null, a.callbackPriority = 0;
  else if (b = d & -d, a.callbackPriority !== b) {
    null != c && bc(c);
    if (1 === b) 0 === a.tag ? ig(Ek.bind(null, a)) : hg(Ek.bind(null, a)), Jf(function() {
      0 === (K & 6) && jg();
    }), c = null;
    else {
      switch (Dc(d)) {
        case 1:
          c = fc;
          break;
        case 4:
          c = gc;
          break;
        case 16:
          c = hc;
          break;
        case 536870912:
          c = jc;
          break;
        default:
          c = hc;
      }
      c = Fk(c, Gk.bind(null, a));
    }
    a.callbackPriority = b;
    a.callbackNode = c;
  }
}
function Gk(a, b) {
  Ak = -1;
  Bk = 0;
  if (0 !== (K & 6)) throw Error(p$1(327));
  var c = a.callbackNode;
  if (Hk() && a.callbackNode !== c) return null;
  var d = uc(a, a === Q ? Z : 0);
  if (0 === d) return null;
  if (0 !== (d & 30) || 0 !== (d & a.expiredLanes) || b) b = Ik(a, d);
  else {
    b = d;
    var e = K;
    K |= 2;
    var f2 = Jk();
    if (Q !== a || Z !== b) uk = null, Gj = B() + 500, Kk(a, b);
    do
      try {
        Lk();
        break;
      } catch (h) {
        Mk(a, h);
      }
    while (1);
    $g();
    mk.current = f2;
    K = e;
    null !== Y ? b = 0 : (Q = null, Z = 0, b = T);
  }
  if (0 !== b) {
    2 === b && (e = xc(a), 0 !== e && (d = e, b = Nk(a, e)));
    if (1 === b) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B()), c;
    if (6 === b) Ck(a, d);
    else {
      e = a.current.alternate;
      if (0 === (d & 30) && !Ok(e) && (b = Ik(a, d), 2 === b && (f2 = xc(a), 0 !== f2 && (d = f2, b = Nk(a, f2))), 1 === b)) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B()), c;
      a.finishedWork = e;
      a.finishedLanes = d;
      switch (b) {
        case 0:
        case 1:
          throw Error(p$1(345));
        case 2:
          Pk(a, tk, uk);
          break;
        case 3:
          Ck(a, d);
          if ((d & 130023424) === d && (b = fk + 500 - B(), 10 < b)) {
            if (0 !== uc(a, 0)) break;
            e = a.suspendedLanes;
            if ((e & d) !== d) {
              R();
              a.pingedLanes |= a.suspendedLanes & e;
              break;
            }
            a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), b);
            break;
          }
          Pk(a, tk, uk);
          break;
        case 4:
          Ck(a, d);
          if ((d & 4194240) === d) break;
          b = a.eventTimes;
          for (e = -1; 0 < d; ) {
            var g = 31 - oc(d);
            f2 = 1 << g;
            g = b[g];
            g > e && (e = g);
            d &= ~f2;
          }
          d = e;
          d = B() - d;
          d = (120 > d ? 120 : 480 > d ? 480 : 1080 > d ? 1080 : 1920 > d ? 1920 : 3e3 > d ? 3e3 : 4320 > d ? 4320 : 1960 * lk(d / 1960)) - d;
          if (10 < d) {
            a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), d);
            break;
          }
          Pk(a, tk, uk);
          break;
        case 5:
          Pk(a, tk, uk);
          break;
        default:
          throw Error(p$1(329));
      }
    }
  }
  Dk(a, B());
  return a.callbackNode === c ? Gk.bind(null, a) : null;
}
function Nk(a, b) {
  var c = sk;
  a.current.memoizedState.isDehydrated && (Kk(a, b).flags |= 256);
  a = Ik(a, b);
  2 !== a && (b = tk, tk = c, null !== b && Fj(b));
  return a;
}
function Fj(a) {
  null === tk ? tk = a : tk.push.apply(tk, a);
}
function Ok(a) {
  for (var b = a; ; ) {
    if (b.flags & 16384) {
      var c = b.updateQueue;
      if (null !== c && (c = c.stores, null !== c)) for (var d = 0; d < c.length; d++) {
        var e = c[d], f2 = e.getSnapshot;
        e = e.value;
        try {
          if (!He(f2(), e)) return false;
        } catch (g) {
          return false;
        }
      }
    }
    c = b.child;
    if (b.subtreeFlags & 16384 && null !== c) c.return = b, b = c;
    else {
      if (b === a) break;
      for (; null === b.sibling; ) {
        if (null === b.return || b.return === a) return true;
        b = b.return;
      }
      b.sibling.return = b.return;
      b = b.sibling;
    }
  }
  return true;
}
function Ck(a, b) {
  b &= ~rk;
  b &= ~qk;
  a.suspendedLanes |= b;
  a.pingedLanes &= ~b;
  for (a = a.expirationTimes; 0 < b; ) {
    var c = 31 - oc(b), d = 1 << c;
    a[c] = -1;
    b &= ~d;
  }
}
function Ek(a) {
  if (0 !== (K & 6)) throw Error(p$1(327));
  Hk();
  var b = uc(a, 0);
  if (0 === (b & 1)) return Dk(a, B()), null;
  var c = Ik(a, b);
  if (0 !== a.tag && 2 === c) {
    var d = xc(a);
    0 !== d && (b = d, c = Nk(a, d));
  }
  if (1 === c) throw c = pk, Kk(a, 0), Ck(a, b), Dk(a, B()), c;
  if (6 === c) throw Error(p$1(345));
  a.finishedWork = a.current.alternate;
  a.finishedLanes = b;
  Pk(a, tk, uk);
  Dk(a, B());
  return null;
}
function Qk(a, b) {
  var c = K;
  K |= 1;
  try {
    return a(b);
  } finally {
    K = c, 0 === K && (Gj = B() + 500, fg && jg());
  }
}
function Rk(a) {
  null !== wk && 0 === wk.tag && 0 === (K & 6) && Hk();
  var b = K;
  K |= 1;
  var c = ok.transition, d = C;
  try {
    if (ok.transition = null, C = 1, a) return a();
  } finally {
    C = d, ok.transition = c, K = b, 0 === (K & 6) && jg();
  }
}
function Hj() {
  fj = ej.current;
  E(ej);
}
function Kk(a, b) {
  a.finishedWork = null;
  a.finishedLanes = 0;
  var c = a.timeoutHandle;
  -1 !== c && (a.timeoutHandle = -1, Gf(c));
  if (null !== Y) for (c = Y.return; null !== c; ) {
    var d = c;
    wg(d);
    switch (d.tag) {
      case 1:
        d = d.type.childContextTypes;
        null !== d && void 0 !== d && $f();
        break;
      case 3:
        zh();
        E(Wf);
        E(H);
        Eh();
        break;
      case 5:
        Bh(d);
        break;
      case 4:
        zh();
        break;
      case 13:
        E(L);
        break;
      case 19:
        E(L);
        break;
      case 10:
        ah(d.type._context);
        break;
      case 22:
      case 23:
        Hj();
    }
    c = c.return;
  }
  Q = a;
  Y = a = Pg(a.current, null);
  Z = fj = b;
  T = 0;
  pk = null;
  rk = qk = rh = 0;
  tk = sk = null;
  if (null !== fh) {
    for (b = 0; b < fh.length; b++) if (c = fh[b], d = c.interleaved, null !== d) {
      c.interleaved = null;
      var e = d.next, f2 = c.pending;
      if (null !== f2) {
        var g = f2.next;
        f2.next = e;
        d.next = g;
      }
      c.pending = d;
    }
    fh = null;
  }
  return a;
}
function Mk(a, b) {
  do {
    var c = Y;
    try {
      $g();
      Fh.current = Rh;
      if (Ih) {
        for (var d = M.memoizedState; null !== d; ) {
          var e = d.queue;
          null !== e && (e.pending = null);
          d = d.next;
        }
        Ih = false;
      }
      Hh = 0;
      O = N = M = null;
      Jh = false;
      Kh = 0;
      nk.current = null;
      if (null === c || null === c.return) {
        T = 1;
        pk = b;
        Y = null;
        break;
      }
      a: {
        var f2 = a, g = c.return, h = c, k2 = b;
        b = Z;
        h.flags |= 32768;
        if (null !== k2 && "object" === typeof k2 && "function" === typeof k2.then) {
          var l2 = k2, m2 = h, q2 = m2.tag;
          if (0 === (m2.mode & 1) && (0 === q2 || 11 === q2 || 15 === q2)) {
            var r2 = m2.alternate;
            r2 ? (m2.updateQueue = r2.updateQueue, m2.memoizedState = r2.memoizedState, m2.lanes = r2.lanes) : (m2.updateQueue = null, m2.memoizedState = null);
          }
          var y2 = Ui(g);
          if (null !== y2) {
            y2.flags &= -257;
            Vi(y2, g, h, f2, b);
            y2.mode & 1 && Si(f2, l2, b);
            b = y2;
            k2 = l2;
            var n2 = b.updateQueue;
            if (null === n2) {
              var t2 = /* @__PURE__ */ new Set();
              t2.add(k2);
              b.updateQueue = t2;
            } else n2.add(k2);
            break a;
          } else {
            if (0 === (b & 1)) {
              Si(f2, l2, b);
              tj();
              break a;
            }
            k2 = Error(p$1(426));
          }
        } else if (I && h.mode & 1) {
          var J2 = Ui(g);
          if (null !== J2) {
            0 === (J2.flags & 65536) && (J2.flags |= 256);
            Vi(J2, g, h, f2, b);
            Jg(Ji(k2, h));
            break a;
          }
        }
        f2 = k2 = Ji(k2, h);
        4 !== T && (T = 2);
        null === sk ? sk = [f2] : sk.push(f2);
        f2 = g;
        do {
          switch (f2.tag) {
            case 3:
              f2.flags |= 65536;
              b &= -b;
              f2.lanes |= b;
              var x2 = Ni(f2, k2, b);
              ph(f2, x2);
              break a;
            case 1:
              h = k2;
              var w2 = f2.type, u2 = f2.stateNode;
              if (0 === (f2.flags & 128) && ("function" === typeof w2.getDerivedStateFromError || null !== u2 && "function" === typeof u2.componentDidCatch && (null === Ri || !Ri.has(u2)))) {
                f2.flags |= 65536;
                b &= -b;
                f2.lanes |= b;
                var F2 = Qi(f2, h, b);
                ph(f2, F2);
                break a;
              }
          }
          f2 = f2.return;
        } while (null !== f2);
      }
      Sk(c);
    } catch (na) {
      b = na;
      Y === c && null !== c && (Y = c = c.return);
      continue;
    }
    break;
  } while (1);
}
function Jk() {
  var a = mk.current;
  mk.current = Rh;
  return null === a ? Rh : a;
}
function tj() {
  if (0 === T || 3 === T || 2 === T) T = 4;
  null === Q || 0 === (rh & 268435455) && 0 === (qk & 268435455) || Ck(Q, Z);
}
function Ik(a, b) {
  var c = K;
  K |= 2;
  var d = Jk();
  if (Q !== a || Z !== b) uk = null, Kk(a, b);
  do
    try {
      Tk();
      break;
    } catch (e) {
      Mk(a, e);
    }
  while (1);
  $g();
  K = c;
  mk.current = d;
  if (null !== Y) throw Error(p$1(261));
  Q = null;
  Z = 0;
  return T;
}
function Tk() {
  for (; null !== Y; ) Uk(Y);
}
function Lk() {
  for (; null !== Y && !cc(); ) Uk(Y);
}
function Uk(a) {
  var b = Vk(a.alternate, a, fj);
  a.memoizedProps = a.pendingProps;
  null === b ? Sk(a) : Y = b;
  nk.current = null;
}
function Sk(a) {
  var b = a;
  do {
    var c = b.alternate;
    a = b.return;
    if (0 === (b.flags & 32768)) {
      if (c = Ej(c, b, fj), null !== c) {
        Y = c;
        return;
      }
    } else {
      c = Ij(c, b);
      if (null !== c) {
        c.flags &= 32767;
        Y = c;
        return;
      }
      if (null !== a) a.flags |= 32768, a.subtreeFlags = 0, a.deletions = null;
      else {
        T = 6;
        Y = null;
        return;
      }
    }
    b = b.sibling;
    if (null !== b) {
      Y = b;
      return;
    }
    Y = b = a;
  } while (null !== b);
  0 === T && (T = 5);
}
function Pk(a, b, c) {
  var d = C, e = ok.transition;
  try {
    ok.transition = null, C = 1, Wk(a, b, c, d);
  } finally {
    ok.transition = e, C = d;
  }
  return null;
}
function Wk(a, b, c, d) {
  do
    Hk();
  while (null !== wk);
  if (0 !== (K & 6)) throw Error(p$1(327));
  c = a.finishedWork;
  var e = a.finishedLanes;
  if (null === c) return null;
  a.finishedWork = null;
  a.finishedLanes = 0;
  if (c === a.current) throw Error(p$1(177));
  a.callbackNode = null;
  a.callbackPriority = 0;
  var f2 = c.lanes | c.childLanes;
  Bc(a, f2);
  a === Q && (Y = Q = null, Z = 0);
  0 === (c.subtreeFlags & 2064) && 0 === (c.flags & 2064) || vk || (vk = true, Fk(hc, function() {
    Hk();
    return null;
  }));
  f2 = 0 !== (c.flags & 15990);
  if (0 !== (c.subtreeFlags & 15990) || f2) {
    f2 = ok.transition;
    ok.transition = null;
    var g = C;
    C = 1;
    var h = K;
    K |= 4;
    nk.current = null;
    Oj(a, c);
    dk(c, a);
    Oe(Df);
    dd = !!Cf;
    Df = Cf = null;
    a.current = c;
    hk(c);
    dc();
    K = h;
    C = g;
    ok.transition = f2;
  } else a.current = c;
  vk && (vk = false, wk = a, xk = e);
  f2 = a.pendingLanes;
  0 === f2 && (Ri = null);
  mc(c.stateNode);
  Dk(a, B());
  if (null !== b) for (d = a.onRecoverableError, c = 0; c < b.length; c++) e = b[c], d(e.value, { componentStack: e.stack, digest: e.digest });
  if (Oi) throw Oi = false, a = Pi, Pi = null, a;
  0 !== (xk & 1) && 0 !== a.tag && Hk();
  f2 = a.pendingLanes;
  0 !== (f2 & 1) ? a === zk ? yk++ : (yk = 0, zk = a) : yk = 0;
  jg();
  return null;
}
function Hk() {
  if (null !== wk) {
    var a = Dc(xk), b = ok.transition, c = C;
    try {
      ok.transition = null;
      C = 16 > a ? 16 : a;
      if (null === wk) var d = false;
      else {
        a = wk;
        wk = null;
        xk = 0;
        if (0 !== (K & 6)) throw Error(p$1(331));
        var e = K;
        K |= 4;
        for (V = a.current; null !== V; ) {
          var f2 = V, g = f2.child;
          if (0 !== (V.flags & 16)) {
            var h = f2.deletions;
            if (null !== h) {
              for (var k2 = 0; k2 < h.length; k2++) {
                var l2 = h[k2];
                for (V = l2; null !== V; ) {
                  var m2 = V;
                  switch (m2.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Pj(8, m2, f2);
                  }
                  var q2 = m2.child;
                  if (null !== q2) q2.return = m2, V = q2;
                  else for (; null !== V; ) {
                    m2 = V;
                    var r2 = m2.sibling, y2 = m2.return;
                    Sj(m2);
                    if (m2 === l2) {
                      V = null;
                      break;
                    }
                    if (null !== r2) {
                      r2.return = y2;
                      V = r2;
                      break;
                    }
                    V = y2;
                  }
                }
              }
              var n2 = f2.alternate;
              if (null !== n2) {
                var t2 = n2.child;
                if (null !== t2) {
                  n2.child = null;
                  do {
                    var J2 = t2.sibling;
                    t2.sibling = null;
                    t2 = J2;
                  } while (null !== t2);
                }
              }
              V = f2;
            }
          }
          if (0 !== (f2.subtreeFlags & 2064) && null !== g) g.return = f2, V = g;
          else b: for (; null !== V; ) {
            f2 = V;
            if (0 !== (f2.flags & 2048)) switch (f2.tag) {
              case 0:
              case 11:
              case 15:
                Pj(9, f2, f2.return);
            }
            var x2 = f2.sibling;
            if (null !== x2) {
              x2.return = f2.return;
              V = x2;
              break b;
            }
            V = f2.return;
          }
        }
        var w2 = a.current;
        for (V = w2; null !== V; ) {
          g = V;
          var u2 = g.child;
          if (0 !== (g.subtreeFlags & 2064) && null !== u2) u2.return = g, V = u2;
          else b: for (g = w2; null !== V; ) {
            h = V;
            if (0 !== (h.flags & 2048)) try {
              switch (h.tag) {
                case 0:
                case 11:
                case 15:
                  Qj(9, h);
              }
            } catch (na) {
              W(h, h.return, na);
            }
            if (h === g) {
              V = null;
              break b;
            }
            var F2 = h.sibling;
            if (null !== F2) {
              F2.return = h.return;
              V = F2;
              break b;
            }
            V = h.return;
          }
        }
        K = e;
        jg();
        if (lc && "function" === typeof lc.onPostCommitFiberRoot) try {
          lc.onPostCommitFiberRoot(kc, a);
        } catch (na) {
        }
        d = true;
      }
      return d;
    } finally {
      C = c, ok.transition = b;
    }
  }
  return false;
}
function Xk(a, b, c) {
  b = Ji(c, b);
  b = Ni(a, b, 1);
  a = nh(a, b, 1);
  b = R();
  null !== a && (Ac(a, 1, b), Dk(a, b));
}
function W(a, b, c) {
  if (3 === a.tag) Xk(a, a, c);
  else for (; null !== b; ) {
    if (3 === b.tag) {
      Xk(b, a, c);
      break;
    } else if (1 === b.tag) {
      var d = b.stateNode;
      if ("function" === typeof b.type.getDerivedStateFromError || "function" === typeof d.componentDidCatch && (null === Ri || !Ri.has(d))) {
        a = Ji(c, a);
        a = Qi(b, a, 1);
        b = nh(b, a, 1);
        a = R();
        null !== b && (Ac(b, 1, a), Dk(b, a));
        break;
      }
    }
    b = b.return;
  }
}
function Ti(a, b, c) {
  var d = a.pingCache;
  null !== d && d.delete(b);
  b = R();
  a.pingedLanes |= a.suspendedLanes & c;
  Q === a && (Z & c) === c && (4 === T || 3 === T && (Z & 130023424) === Z && 500 > B() - fk ? Kk(a, 0) : rk |= c);
  Dk(a, b);
}
function Yk(a, b) {
  0 === b && (0 === (a.mode & 1) ? b = 1 : (b = sc, sc <<= 1, 0 === (sc & 130023424) && (sc = 4194304)));
  var c = R();
  a = ih(a, b);
  null !== a && (Ac(a, b, c), Dk(a, c));
}
function uj(a) {
  var b = a.memoizedState, c = 0;
  null !== b && (c = b.retryLane);
  Yk(a, c);
}
function bk(a, b) {
  var c = 0;
  switch (a.tag) {
    case 13:
      var d = a.stateNode;
      var e = a.memoizedState;
      null !== e && (c = e.retryLane);
      break;
    case 19:
      d = a.stateNode;
      break;
    default:
      throw Error(p$1(314));
  }
  null !== d && d.delete(b);
  Yk(a, c);
}
var Vk;
Vk = function(a, b, c) {
  if (null !== a) if (a.memoizedProps !== b.pendingProps || Wf.current) dh = true;
  else {
    if (0 === (a.lanes & c) && 0 === (b.flags & 128)) return dh = false, yj(a, b, c);
    dh = 0 !== (a.flags & 131072) ? true : false;
  }
  else dh = false, I && 0 !== (b.flags & 1048576) && ug(b, ng, b.index);
  b.lanes = 0;
  switch (b.tag) {
    case 2:
      var d = b.type;
      ij(a, b);
      a = b.pendingProps;
      var e = Yf(b, H.current);
      ch(b, c);
      e = Nh(null, b, d, a, e, c);
      var f2 = Sh();
      b.flags |= 1;
      "object" === typeof e && null !== e && "function" === typeof e.render && void 0 === e.$$typeof ? (b.tag = 1, b.memoizedState = null, b.updateQueue = null, Zf(d) ? (f2 = true, cg(b)) : f2 = false, b.memoizedState = null !== e.state && void 0 !== e.state ? e.state : null, kh(b), e.updater = Ei, b.stateNode = e, e._reactInternals = b, Ii(b, d, a, c), b = jj(null, b, d, true, f2, c)) : (b.tag = 0, I && f2 && vg(b), Xi(null, b, e, c), b = b.child);
      return b;
    case 16:
      d = b.elementType;
      a: {
        ij(a, b);
        a = b.pendingProps;
        e = d._init;
        d = e(d._payload);
        b.type = d;
        e = b.tag = Zk(d);
        a = Ci(d, a);
        switch (e) {
          case 0:
            b = cj(null, b, d, a, c);
            break a;
          case 1:
            b = hj(null, b, d, a, c);
            break a;
          case 11:
            b = Yi(null, b, d, a, c);
            break a;
          case 14:
            b = $i(null, b, d, Ci(d.type, a), c);
            break a;
        }
        throw Error(p$1(
          306,
          d,
          ""
        ));
      }
      return b;
    case 0:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), cj(a, b, d, e, c);
    case 1:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), hj(a, b, d, e, c);
    case 3:
      a: {
        kj(b);
        if (null === a) throw Error(p$1(387));
        d = b.pendingProps;
        f2 = b.memoizedState;
        e = f2.element;
        lh(a, b);
        qh(b, d, null, c);
        var g = b.memoizedState;
        d = g.element;
        if (f2.isDehydrated) if (f2 = { element: d, isDehydrated: false, cache: g.cache, pendingSuspenseBoundaries: g.pendingSuspenseBoundaries, transitions: g.transitions }, b.updateQueue.baseState = f2, b.memoizedState = f2, b.flags & 256) {
          e = Ji(Error(p$1(423)), b);
          b = lj(a, b, d, c, e);
          break a;
        } else if (d !== e) {
          e = Ji(Error(p$1(424)), b);
          b = lj(a, b, d, c, e);
          break a;
        } else for (yg = Lf(b.stateNode.containerInfo.firstChild), xg = b, I = true, zg = null, c = Vg(b, null, d, c), b.child = c; c; ) c.flags = c.flags & -3 | 4096, c = c.sibling;
        else {
          Ig();
          if (d === e) {
            b = Zi(a, b, c);
            break a;
          }
          Xi(a, b, d, c);
        }
        b = b.child;
      }
      return b;
    case 5:
      return Ah(b), null === a && Eg(b), d = b.type, e = b.pendingProps, f2 = null !== a ? a.memoizedProps : null, g = e.children, Ef(d, e) ? g = null : null !== f2 && Ef(d, f2) && (b.flags |= 32), gj(a, b), Xi(a, b, g, c), b.child;
    case 6:
      return null === a && Eg(b), null;
    case 13:
      return oj(a, b, c);
    case 4:
      return yh(b, b.stateNode.containerInfo), d = b.pendingProps, null === a ? b.child = Ug(b, null, d, c) : Xi(a, b, d, c), b.child;
    case 11:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), Yi(a, b, d, e, c);
    case 7:
      return Xi(a, b, b.pendingProps, c), b.child;
    case 8:
      return Xi(a, b, b.pendingProps.children, c), b.child;
    case 12:
      return Xi(a, b, b.pendingProps.children, c), b.child;
    case 10:
      a: {
        d = b.type._context;
        e = b.pendingProps;
        f2 = b.memoizedProps;
        g = e.value;
        G(Wg, d._currentValue);
        d._currentValue = g;
        if (null !== f2) if (He(f2.value, g)) {
          if (f2.children === e.children && !Wf.current) {
            b = Zi(a, b, c);
            break a;
          }
        } else for (f2 = b.child, null !== f2 && (f2.return = b); null !== f2; ) {
          var h = f2.dependencies;
          if (null !== h) {
            g = f2.child;
            for (var k2 = h.firstContext; null !== k2; ) {
              if (k2.context === d) {
                if (1 === f2.tag) {
                  k2 = mh(-1, c & -c);
                  k2.tag = 2;
                  var l2 = f2.updateQueue;
                  if (null !== l2) {
                    l2 = l2.shared;
                    var m2 = l2.pending;
                    null === m2 ? k2.next = k2 : (k2.next = m2.next, m2.next = k2);
                    l2.pending = k2;
                  }
                }
                f2.lanes |= c;
                k2 = f2.alternate;
                null !== k2 && (k2.lanes |= c);
                bh(
                  f2.return,
                  c,
                  b
                );
                h.lanes |= c;
                break;
              }
              k2 = k2.next;
            }
          } else if (10 === f2.tag) g = f2.type === b.type ? null : f2.child;
          else if (18 === f2.tag) {
            g = f2.return;
            if (null === g) throw Error(p$1(341));
            g.lanes |= c;
            h = g.alternate;
            null !== h && (h.lanes |= c);
            bh(g, c, b);
            g = f2.sibling;
          } else g = f2.child;
          if (null !== g) g.return = f2;
          else for (g = f2; null !== g; ) {
            if (g === b) {
              g = null;
              break;
            }
            f2 = g.sibling;
            if (null !== f2) {
              f2.return = g.return;
              g = f2;
              break;
            }
            g = g.return;
          }
          f2 = g;
        }
        Xi(a, b, e.children, c);
        b = b.child;
      }
      return b;
    case 9:
      return e = b.type, d = b.pendingProps.children, ch(b, c), e = eh(e), d = d(e), b.flags |= 1, Xi(a, b, d, c), b.child;
    case 14:
      return d = b.type, e = Ci(d, b.pendingProps), e = Ci(d.type, e), $i(a, b, d, e, c);
    case 15:
      return bj(a, b, b.type, b.pendingProps, c);
    case 17:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), ij(a, b), b.tag = 1, Zf(d) ? (a = true, cg(b)) : a = false, ch(b, c), Gi(b, d, e), Ii(b, d, e, c), jj(null, b, d, true, a, c);
    case 19:
      return xj(a, b, c);
    case 22:
      return dj(a, b, c);
  }
  throw Error(p$1(156, b.tag));
};
function Fk(a, b) {
  return ac(a, b);
}
function $k(a, b, c, d) {
  this.tag = a;
  this.key = c;
  this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
  this.index = 0;
  this.ref = null;
  this.pendingProps = b;
  this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
  this.mode = d;
  this.subtreeFlags = this.flags = 0;
  this.deletions = null;
  this.childLanes = this.lanes = 0;
  this.alternate = null;
}
function Bg(a, b, c, d) {
  return new $k(a, b, c, d);
}
function aj(a) {
  a = a.prototype;
  return !(!a || !a.isReactComponent);
}
function Zk(a) {
  if ("function" === typeof a) return aj(a) ? 1 : 0;
  if (void 0 !== a && null !== a) {
    a = a.$$typeof;
    if (a === Da) return 11;
    if (a === Ga) return 14;
  }
  return 2;
}
function Pg(a, b) {
  var c = a.alternate;
  null === c ? (c = Bg(a.tag, b, a.key, a.mode), c.elementType = a.elementType, c.type = a.type, c.stateNode = a.stateNode, c.alternate = a, a.alternate = c) : (c.pendingProps = b, c.type = a.type, c.flags = 0, c.subtreeFlags = 0, c.deletions = null);
  c.flags = a.flags & 14680064;
  c.childLanes = a.childLanes;
  c.lanes = a.lanes;
  c.child = a.child;
  c.memoizedProps = a.memoizedProps;
  c.memoizedState = a.memoizedState;
  c.updateQueue = a.updateQueue;
  b = a.dependencies;
  c.dependencies = null === b ? null : { lanes: b.lanes, firstContext: b.firstContext };
  c.sibling = a.sibling;
  c.index = a.index;
  c.ref = a.ref;
  return c;
}
function Rg(a, b, c, d, e, f2) {
  var g = 2;
  d = a;
  if ("function" === typeof a) aj(a) && (g = 1);
  else if ("string" === typeof a) g = 5;
  else a: switch (a) {
    case ya:
      return Tg(c.children, e, f2, b);
    case za:
      g = 8;
      e |= 8;
      break;
    case Aa:
      return a = Bg(12, c, b, e | 2), a.elementType = Aa, a.lanes = f2, a;
    case Ea:
      return a = Bg(13, c, b, e), a.elementType = Ea, a.lanes = f2, a;
    case Fa:
      return a = Bg(19, c, b, e), a.elementType = Fa, a.lanes = f2, a;
    case Ia:
      return pj(c, e, f2, b);
    default:
      if ("object" === typeof a && null !== a) switch (a.$$typeof) {
        case Ba:
          g = 10;
          break a;
        case Ca:
          g = 9;
          break a;
        case Da:
          g = 11;
          break a;
        case Ga:
          g = 14;
          break a;
        case Ha:
          g = 16;
          d = null;
          break a;
      }
      throw Error(p$1(130, null == a ? a : typeof a, ""));
  }
  b = Bg(g, c, b, e);
  b.elementType = a;
  b.type = d;
  b.lanes = f2;
  return b;
}
function Tg(a, b, c, d) {
  a = Bg(7, a, d, b);
  a.lanes = c;
  return a;
}
function pj(a, b, c, d) {
  a = Bg(22, a, d, b);
  a.elementType = Ia;
  a.lanes = c;
  a.stateNode = { isHidden: false };
  return a;
}
function Qg(a, b, c) {
  a = Bg(6, a, null, b);
  a.lanes = c;
  return a;
}
function Sg(a, b, c) {
  b = Bg(4, null !== a.children ? a.children : [], a.key, b);
  b.lanes = c;
  b.stateNode = { containerInfo: a.containerInfo, pendingChildren: null, implementation: a.implementation };
  return b;
}
function al(a, b, c, d, e) {
  this.tag = b;
  this.containerInfo = a;
  this.finishedWork = this.pingCache = this.current = this.pendingChildren = null;
  this.timeoutHandle = -1;
  this.callbackNode = this.pendingContext = this.context = null;
  this.callbackPriority = 0;
  this.eventTimes = zc(0);
  this.expirationTimes = zc(-1);
  this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
  this.entanglements = zc(0);
  this.identifierPrefix = d;
  this.onRecoverableError = e;
  this.mutableSourceEagerHydrationData = null;
}
function bl(a, b, c, d, e, f2, g, h, k2) {
  a = new al(a, b, c, h, k2);
  1 === b ? (b = 1, true === f2 && (b |= 8)) : b = 0;
  f2 = Bg(3, null, null, b);
  a.current = f2;
  f2.stateNode = a;
  f2.memoizedState = { element: d, isDehydrated: c, cache: null, transitions: null, pendingSuspenseBoundaries: null };
  kh(f2);
  return a;
}
function cl(a, b, c) {
  var d = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
  return { $$typeof: wa, key: null == d ? null : "" + d, children: a, containerInfo: b, implementation: c };
}
function dl(a) {
  if (!a) return Vf;
  a = a._reactInternals;
  a: {
    if (Vb(a) !== a || 1 !== a.tag) throw Error(p$1(170));
    var b = a;
    do {
      switch (b.tag) {
        case 3:
          b = b.stateNode.context;
          break a;
        case 1:
          if (Zf(b.type)) {
            b = b.stateNode.__reactInternalMemoizedMergedChildContext;
            break a;
          }
      }
      b = b.return;
    } while (null !== b);
    throw Error(p$1(171));
  }
  if (1 === a.tag) {
    var c = a.type;
    if (Zf(c)) return bg(a, c, b);
  }
  return b;
}
function el(a, b, c, d, e, f2, g, h, k2) {
  a = bl(c, d, true, a, e, f2, g, h, k2);
  a.context = dl(null);
  c = a.current;
  d = R();
  e = yi(c);
  f2 = mh(d, e);
  f2.callback = void 0 !== b && null !== b ? b : null;
  nh(c, f2, e);
  a.current.lanes = e;
  Ac(a, e, d);
  Dk(a, d);
  return a;
}
function fl(a, b, c, d) {
  var e = b.current, f2 = R(), g = yi(e);
  c = dl(c);
  null === b.context ? b.context = c : b.pendingContext = c;
  b = mh(f2, g);
  b.payload = { element: a };
  d = void 0 === d ? null : d;
  null !== d && (b.callback = d);
  a = nh(e, b, g);
  null !== a && (gi(a, e, g, f2), oh(a, e, g));
  return g;
}
function gl(a) {
  a = a.current;
  if (!a.child) return null;
  switch (a.child.tag) {
    case 5:
      return a.child.stateNode;
    default:
      return a.child.stateNode;
  }
}
function hl(a, b) {
  a = a.memoizedState;
  if (null !== a && null !== a.dehydrated) {
    var c = a.retryLane;
    a.retryLane = 0 !== c && c < b ? c : b;
  }
}
function il(a, b) {
  hl(a, b);
  (a = a.alternate) && hl(a, b);
}
function jl() {
  return null;
}
var kl = "function" === typeof reportError ? reportError : function(a) {
  console.error(a);
};
function ll(a) {
  this._internalRoot = a;
}
ml.prototype.render = ll.prototype.render = function(a) {
  var b = this._internalRoot;
  if (null === b) throw Error(p$1(409));
  fl(a, b, null, null);
};
ml.prototype.unmount = ll.prototype.unmount = function() {
  var a = this._internalRoot;
  if (null !== a) {
    this._internalRoot = null;
    var b = a.containerInfo;
    Rk(function() {
      fl(null, a, null, null);
    });
    b[uf] = null;
  }
};
function ml(a) {
  this._internalRoot = a;
}
ml.prototype.unstable_scheduleHydration = function(a) {
  if (a) {
    var b = Hc();
    a = { blockedOn: null, target: a, priority: b };
    for (var c = 0; c < Qc.length && 0 !== b && b < Qc[c].priority; c++) ;
    Qc.splice(c, 0, a);
    0 === c && Vc(a);
  }
};
function nl(a) {
  return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType);
}
function ol(a) {
  return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType && (8 !== a.nodeType || " react-mount-point-unstable " !== a.nodeValue));
}
function pl() {
}
function ql(a, b, c, d, e) {
  if (e) {
    if ("function" === typeof d) {
      var f2 = d;
      d = function() {
        var a2 = gl(g);
        f2.call(a2);
      };
    }
    var g = el(b, d, a, 0, null, false, false, "", pl);
    a._reactRootContainer = g;
    a[uf] = g.current;
    sf(8 === a.nodeType ? a.parentNode : a);
    Rk();
    return g;
  }
  for (; e = a.lastChild; ) a.removeChild(e);
  if ("function" === typeof d) {
    var h = d;
    d = function() {
      var a2 = gl(k2);
      h.call(a2);
    };
  }
  var k2 = bl(a, 0, false, null, null, false, false, "", pl);
  a._reactRootContainer = k2;
  a[uf] = k2.current;
  sf(8 === a.nodeType ? a.parentNode : a);
  Rk(function() {
    fl(b, k2, c, d);
  });
  return k2;
}
function rl(a, b, c, d, e) {
  var f2 = c._reactRootContainer;
  if (f2) {
    var g = f2;
    if ("function" === typeof e) {
      var h = e;
      e = function() {
        var a2 = gl(g);
        h.call(a2);
      };
    }
    fl(b, g, a, e);
  } else g = ql(c, b, a, e, d);
  return gl(g);
}
Ec = function(a) {
  switch (a.tag) {
    case 3:
      var b = a.stateNode;
      if (b.current.memoizedState.isDehydrated) {
        var c = tc(b.pendingLanes);
        0 !== c && (Cc(b, c | 1), Dk(b, B()), 0 === (K & 6) && (Gj = B() + 500, jg()));
      }
      break;
    case 13:
      Rk(function() {
        var b2 = ih(a, 1);
        if (null !== b2) {
          var c2 = R();
          gi(b2, a, 1, c2);
        }
      }), il(a, 1);
  }
};
Fc = function(a) {
  if (13 === a.tag) {
    var b = ih(a, 134217728);
    if (null !== b) {
      var c = R();
      gi(b, a, 134217728, c);
    }
    il(a, 134217728);
  }
};
Gc = function(a) {
  if (13 === a.tag) {
    var b = yi(a), c = ih(a, b);
    if (null !== c) {
      var d = R();
      gi(c, a, b, d);
    }
    il(a, b);
  }
};
Hc = function() {
  return C;
};
Ic = function(a, b) {
  var c = C;
  try {
    return C = a, b();
  } finally {
    C = c;
  }
};
yb = function(a, b, c) {
  switch (b) {
    case "input":
      bb(a, c);
      b = c.name;
      if ("radio" === c.type && null != b) {
        for (c = a; c.parentNode; ) c = c.parentNode;
        c = c.querySelectorAll("input[name=" + JSON.stringify("" + b) + '][type="radio"]');
        for (b = 0; b < c.length; b++) {
          var d = c[b];
          if (d !== a && d.form === a.form) {
            var e = Db(d);
            if (!e) throw Error(p$1(90));
            Wa(d);
            bb(d, e);
          }
        }
      }
      break;
    case "textarea":
      ib(a, c);
      break;
    case "select":
      b = c.value, null != b && fb(a, !!c.multiple, b, false);
  }
};
Gb = Qk;
Hb = Rk;
var sl = { usingClientEntryPoint: false, Events: [Cb, ue, Db, Eb, Fb, Qk] }, tl = { findFiberByHostInstance: Wc, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" };
var ul = { bundleType: tl.bundleType, version: tl.version, rendererPackageName: tl.rendererPackageName, rendererConfig: tl.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ua.ReactCurrentDispatcher, findHostInstanceByFiber: function(a) {
  a = Zb(a);
  return null === a ? null : a.stateNode;
}, findFiberByHostInstance: tl.findFiberByHostInstance || jl, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
  var vl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!vl.isDisabled && vl.supportsFiber) try {
    kc = vl.inject(ul), lc = vl;
  } catch (a) {
  }
}
reactDom_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = sl;
reactDom_production_min.createPortal = function(a, b) {
  var c = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
  if (!nl(b)) throw Error(p$1(200));
  return cl(a, b, null, c);
};
reactDom_production_min.createRoot = function(a, b) {
  if (!nl(a)) throw Error(p$1(299));
  var c = false, d = "", e = kl;
  null !== b && void 0 !== b && (true === b.unstable_strictMode && (c = true), void 0 !== b.identifierPrefix && (d = b.identifierPrefix), void 0 !== b.onRecoverableError && (e = b.onRecoverableError));
  b = bl(a, 1, false, null, null, c, false, d, e);
  a[uf] = b.current;
  sf(8 === a.nodeType ? a.parentNode : a);
  return new ll(b);
};
reactDom_production_min.findDOMNode = function(a) {
  if (null == a) return null;
  if (1 === a.nodeType) return a;
  var b = a._reactInternals;
  if (void 0 === b) {
    if ("function" === typeof a.render) throw Error(p$1(188));
    a = Object.keys(a).join(",");
    throw Error(p$1(268, a));
  }
  a = Zb(b);
  a = null === a ? null : a.stateNode;
  return a;
};
reactDom_production_min.flushSync = function(a) {
  return Rk(a);
};
reactDom_production_min.hydrate = function(a, b, c) {
  if (!ol(b)) throw Error(p$1(200));
  return rl(null, a, b, true, c);
};
reactDom_production_min.hydrateRoot = function(a, b, c) {
  if (!nl(a)) throw Error(p$1(405));
  var d = null != c && c.hydratedSources || null, e = false, f2 = "", g = kl;
  null !== c && void 0 !== c && (true === c.unstable_strictMode && (e = true), void 0 !== c.identifierPrefix && (f2 = c.identifierPrefix), void 0 !== c.onRecoverableError && (g = c.onRecoverableError));
  b = el(b, null, a, 1, null != c ? c : null, e, false, f2, g);
  a[uf] = b.current;
  sf(a);
  if (d) for (a = 0; a < d.length; a++) c = d[a], e = c._getVersion, e = e(c._source), null == b.mutableSourceEagerHydrationData ? b.mutableSourceEagerHydrationData = [c, e] : b.mutableSourceEagerHydrationData.push(
    c,
    e
  );
  return new ml(b);
};
reactDom_production_min.render = function(a, b, c) {
  if (!ol(b)) throw Error(p$1(200));
  return rl(null, a, b, false, c);
};
reactDom_production_min.unmountComponentAtNode = function(a) {
  if (!ol(a)) throw Error(p$1(40));
  return a._reactRootContainer ? (Rk(function() {
    rl(null, null, a, false, function() {
      a._reactRootContainer = null;
      a[uf] = null;
    });
  }), true) : false;
};
reactDom_production_min.unstable_batchedUpdates = Qk;
reactDom_production_min.unstable_renderSubtreeIntoContainer = function(a, b, c, d) {
  if (!ol(c)) throw Error(p$1(200));
  if (null == a || void 0 === a._reactInternals) throw Error(p$1(38));
  return rl(a, b, c, false, d);
};
reactDom_production_min.version = "18.3.1-next-f1338f8080-20240426";
function checkDCE() {
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
    return;
  }
  try {
    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
  } catch (err) {
    console.error(err);
  }
}
{
  checkDCE();
  reactDom.exports = reactDom_production_min;
}
var reactDomExports = reactDom.exports;
var m$1 = reactDomExports;
{
  client.createRoot = m$1.createRoot;
  client.hydrateRoot = m$1.hydrateRoot;
}
var jsxRuntime = { exports: {} };
var reactJsxRuntime_production_min = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f = reactExports, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p = { key: true, ref: true, __self: true, __source: true };
function q(c, a, g) {
  var b, d = {}, e = null, h = null;
  void 0 !== g && (e = "" + g);
  void 0 !== a.key && (e = "" + a.key);
  void 0 !== a.ref && (h = a.ref);
  for (b in a) m.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
  if (c && c.defaultProps) for (b in a = c.defaultProps, a) void 0 === d[b] && (d[b] = a[b]);
  return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
}
reactJsxRuntime_production_min.Fragment = l;
reactJsxRuntime_production_min.jsx = q;
reactJsxRuntime_production_min.jsxs = q;
{
  jsxRuntime.exports = reactJsxRuntime_production_min;
}
var jsxRuntimeExports = jsxRuntime.exports;
const BASE = "https://kouvadeiros-api.jboikos.workers.dev";
function token() {
  return localStorage.getItem("kouv_token") || "";
}
async function call(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token()}` },
    body: body ? JSON.stringify(body) : void 0
  });
  if (res.status === 401) {
    localStorage.removeItem("kouv_token");
    localStorage.removeItem("kouv_user");
    window.location.reload();
    throw new Error("Session expired");
  }
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}`);
  return res.json();
}
const api = {
  getSlStandings: () => call("GET", "/sl-standings"),
  setLive: (matchId, h, a, min, final) => call("POST", "/set-live", { matchId, h, a, min, final }),
  getSlFixtures: () => call("GET", "/sl-fixtures"),
  login: (email, password) => call("POST", "/login", { email, password }),
  logout: () => call("POST", "/logout"),
  getState: () => call("GET", "/state"),
  savePred: (matchId, h, a, qual, predOT, otH, otA, predPen, penH, penA) => call("PATCH", "/prediction", { matchId, h, a, qual, predOT, otH, otA, predPen, penH, penA }),
  saveResult: (matchId, h, a, ot, otH, otA, pen, penH, penA) => call("PATCH", "/result", { matchId, h, a, overtime: ot, otH, otA, penalties: pen, penH, penA }),
  fetchScores: (matchId) => call("POST", "/fetch-scores", { matchId }),
  sendChat: (text) => call("PATCH", "/chat", { text }),
  savePhone: (phone) => call("PATCH", "/save-phone", { phone }),
  addPlayer: (data) => call("POST", "/add-player", data)
};
function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("kouv_user") || "null");
  } catch {
    return null;
  }
}
function storeUser(u2) {
  localStorage.setItem("kouv_user", JSON.stringify(u2));
}
function storeToken(t2) {
  localStorage.setItem("kouv_token", t2);
}
function clearAuth() {
  localStorage.removeItem("kouv_token");
  localStorage.removeItem("kouv_user");
}
const PLAYERS = ["boikos", "mavromichalis", "chousiadas"];
const PLAYER_NAMES = { boikos: "Boikos", mavromichalis: "Mavromichalis", chousiadas: "Chousiadas" };
const TEAMS = {
  PAO: { name: "Παναθηναϊκός", abbr: "PAOK", color: "#1a7c2a" },
  KIF: { name: "Kifisia", abbr: "KIF", color: "#1a3c6a" },
  KAL: { name: "Καλαμάτα", abbr: "KAL", color: "#6a1a1a" },
  ARI: { name: "Άρης", abbr: "ARI", color: "#b8960c" },
  OLY: { name: "Ολυμπιακός", abbr: "OLY", color: "#c41e1e" },
  ATR: { name: "Ατρόμητος", abbr: "ATR", color: "#1a3a6a" },
  PAOK: { name: "ΠΑΟΚ", abbr: "PAOK", color: "#2c2c2c" },
  LEV: { name: "Λεβαδειακός", abbr: "LEV", color: "#1a4a2a" },
  PNE: { name: "Παναιτωλικός", abbr: "PNE", color: "#5a1a6a" },
  AST: { name: "Asteras", abbr: "AST", color: "#b87c0c" },
  AEK: { name: "ΑΕΚ", abbr: "AEK", color: "#c49a0c" },
  IRA: { name: "Ηρακλής", abbr: "IRA", color: "#1a2a7c" },
  OFI: { name: "ΟΦΗ", abbr: "OFI", color: "#6a2c1a" },
  VOL: { name: "Βόλος", abbr: "VOL", color: "#1a5a2a" },
  DYN: { name: "Dynamo Kyiv", abbr: "DYN", color: "#003594" },
  NEC: { name: "NEC Nijmegen", abbr: "NEC", color: "#c00000" },
  PKS: { name: "Paksi SE", abbr: "PKS", color: "#006400" },
  TBD: { name: "TBD", abbr: "TBD", color: "#444444" }
};
const SUPER_LEAGUE = [
  // ── 1η Αγωνιστική ──
  { id: "sl-1-1", t: "SL", md: 1, home: "AEK", away: "IRA", kickoff: "2026-08-22T17:00:00Z", round: "Αγωνιστική 1" },
  { id: "sl-1-2", t: "SL", md: 1, home: "KAL", away: "ARI", kickoff: "2026-08-22T17:00:00Z", round: "Αγωνιστική 1" },
  { id: "sl-1-3", t: "SL", md: 1, home: "OLY", away: "ATR", kickoff: "2026-08-22T17:00:00Z", round: "Αγωνιστική 1" },
  { id: "sl-1-4", t: "SL", md: 1, home: "OFI", away: "VOL", kickoff: "2026-08-22T17:00:00Z", round: "Αγωνιστική 1" },
  { id: "sl-1-5", t: "SL", md: 1, home: "PAO", away: "KIF", kickoff: "2026-08-22T17:00:00Z", round: "Αγωνιστική 1" },
  { id: "sl-1-6", t: "SL", md: 1, home: "PNE", away: "AST", kickoff: "2026-08-22T17:00:00Z", round: "Αγωνιστική 1" },
  { id: "sl-1-7", t: "SL", md: 1, home: "PAOK", away: "LEV", kickoff: "2026-08-22T17:00:00Z", round: "Αγωνιστική 1" },
  // ── 2η Αγωνιστική ──
  { id: "sl-2-1", t: "SL", md: 2, home: "AST", away: "OLY", kickoff: "2026-08-29T17:00:00Z", round: "Αγωνιστική 2" },
  { id: "sl-2-2", t: "SL", md: 2, home: "ARI", away: "OFI", kickoff: "2026-08-29T17:00:00Z", round: "Αγωνιστική 2" },
  { id: "sl-2-3", t: "SL", md: 2, home: "ATR", away: "PAOK", kickoff: "2026-08-29T17:00:00Z", round: "Αγωνιστική 2" },
  { id: "sl-2-4", t: "SL", md: 2, home: "VOL", away: "IRA", kickoff: "2026-08-29T17:00:00Z", round: "Αγωνιστική 2" },
  { id: "sl-2-5", t: "SL", md: 2, home: "KIF", away: "AEK", kickoff: "2026-08-29T17:00:00Z", round: "Αγωνιστική 2" },
  { id: "sl-2-6", t: "SL", md: 2, home: "LEV", away: "PAO", kickoff: "2026-08-29T17:00:00Z", round: "Αγωνιστική 2" },
  { id: "sl-2-7", t: "SL", md: 2, home: "PNE", away: "KAL", kickoff: "2026-08-29T17:00:00Z", round: "Αγωνιστική 2" },
  // ── 3η Αγωνιστική ──
  { id: "sl-3-1", t: "SL", md: 3, home: "AEK", away: "ARI", kickoff: "2026-09-05T17:00:00Z", round: "Αγωνιστική 3" },
  { id: "sl-3-2", t: "SL", md: 3, home: "ATR", away: "KAL", kickoff: "2026-09-05T17:00:00Z", round: "Αγωνιστική 3" },
  { id: "sl-3-3", t: "SL", md: 3, home: "VOL", away: "OLY", kickoff: "2026-09-05T17:00:00Z", round: "Αγωνιστική 3" },
  { id: "sl-3-4", t: "SL", md: 3, home: "LEV", away: "PNE", kickoff: "2026-09-05T17:00:00Z", round: "Αγωνιστική 3" },
  { id: "sl-3-5", t: "SL", md: 3, home: "OFI", away: "KIF", kickoff: "2026-09-05T17:00:00Z", round: "Αγωνιστική 3" },
  { id: "sl-3-6", t: "SL", md: 3, home: "PAO", away: "PAOK", kickoff: "2026-09-05T17:00:00Z", round: "Αγωνιστική 3" },
  { id: "sl-3-7", t: "SL", md: 3, home: "IRA", away: "AST", kickoff: "2026-09-05T17:00:00Z", round: "Αγωνιστική 3" },
  // ── 4η Αγωνιστική ──
  { id: "sl-4-1", t: "SL", md: 4, home: "AST", away: "AEK", kickoff: "2026-09-12T17:00:00Z", round: "Αγωνιστική 4" },
  { id: "sl-4-2", t: "SL", md: 4, home: "KAL", away: "VOL", kickoff: "2026-09-12T17:00:00Z", round: "Αγωνιστική 4" },
  { id: "sl-4-3", t: "SL", md: 4, home: "KIF", away: "LEV", kickoff: "2026-09-12T17:00:00Z", round: "Αγωνιστική 4" },
  { id: "sl-4-4", t: "SL", md: 4, home: "OLY", away: "OFI", kickoff: "2026-09-12T17:00:00Z", round: "Αγωνιστική 4" },
  { id: "sl-4-5", t: "SL", md: 4, home: "PAO", away: "PNE", kickoff: "2026-09-12T17:00:00Z", round: "Αγωνιστική 4" },
  { id: "sl-4-6", t: "SL", md: 4, home: "PAOK", away: "ARI", kickoff: "2026-09-12T17:00:00Z", round: "Αγωνιστική 4" },
  { id: "sl-4-7", t: "SL", md: 4, home: "IRA", away: "ATR", kickoff: "2026-09-12T17:00:00Z", round: "Αγωνιστική 4" },
  // ── 5η Αγωνιστική ──
  { id: "sl-5-1", t: "SL", md: 5, home: "ARI", away: "IRA", kickoff: "2026-09-19T17:00:00Z", round: "Αγωνιστική 5" },
  { id: "sl-5-2", t: "SL", md: 5, home: "ATR", away: "KIF", kickoff: "2026-09-19T17:00:00Z", round: "Αγωνιστική 5" },
  { id: "sl-5-3", t: "SL", md: 5, home: "VOL", away: "AEK", kickoff: "2026-09-19T17:00:00Z", round: "Αγωνιστική 5" },
  { id: "sl-5-4", t: "SL", md: 5, home: "KAL", away: "PAO", kickoff: "2026-09-19T17:00:00Z", round: "Αγωνιστική 5" },
  { id: "sl-5-5", t: "SL", md: 5, home: "LEV", away: "OLY", kickoff: "2026-09-19T17:00:00Z", round: "Αγωνιστική 5" },
  { id: "sl-5-6", t: "SL", md: 5, home: "OFI", away: "AST", kickoff: "2026-09-19T17:00:00Z", round: "Αγωνιστική 5" },
  { id: "sl-5-7", t: "SL", md: 5, home: "PNE", away: "PAOK", kickoff: "2026-09-19T17:00:00Z", round: "Αγωνιστική 5" },
  // ── 6η Αγωνιστική ──
  { id: "sl-6-1", t: "SL", md: 6, home: "AEK", away: "OFI", kickoff: "2026-10-10T17:00:00Z", round: "Αγωνιστική 6" },
  { id: "sl-6-2", t: "SL", md: 6, home: "AST", away: "ATR", kickoff: "2026-10-10T17:00:00Z", round: "Αγωνιστική 6" },
  { id: "sl-6-3", t: "SL", md: 6, home: "ARI", away: "VOL", kickoff: "2026-10-10T17:00:00Z", round: "Αγωνιστική 6" },
  { id: "sl-6-4", t: "SL", md: 6, home: "KIF", away: "PNE", kickoff: "2026-10-10T17:00:00Z", round: "Αγωνιστική 6" },
  { id: "sl-6-5", t: "SL", md: 6, home: "OLY", away: "PAO", kickoff: "2026-10-10T17:00:00Z", round: "Αγωνιστική 6" },
  { id: "sl-6-6", t: "SL", md: 6, home: "PAOK", away: "KAL", kickoff: "2026-10-10T17:00:00Z", round: "Αγωνιστική 6" },
  { id: "sl-6-7", t: "SL", md: 6, home: "IRA", away: "LEV", kickoff: "2026-10-10T17:00:00Z", round: "Αγωνιστική 6" },
  // ── 7η Αγωνιστική ──
  { id: "sl-7-1", t: "SL", md: 7, home: "ATR", away: "AEK", kickoff: "2026-10-17T17:00:00Z", round: "Αγωνιστική 7" },
  { id: "sl-7-2", t: "SL", md: 7, home: "KAL", away: "OFI", kickoff: "2026-10-17T17:00:00Z", round: "Αγωνιστική 7" },
  { id: "sl-7-3", t: "SL", md: 7, home: "KIF", away: "ARI", kickoff: "2026-10-17T17:00:00Z", round: "Αγωνιστική 7" },
  { id: "sl-7-4", t: "SL", md: 7, home: "LEV", away: "VOL", kickoff: "2026-10-17T17:00:00Z", round: "Αγωνιστική 7" },
  { id: "sl-7-5", t: "SL", md: 7, home: "PAO", away: "AST", kickoff: "2026-10-17T17:00:00Z", round: "Αγωνιστική 7" },
  { id: "sl-7-6", t: "SL", md: 7, home: "PNE", away: "OLY", kickoff: "2026-10-17T17:00:00Z", round: "Αγωνιστική 7" },
  { id: "sl-7-7", t: "SL", md: 7, home: "PAOK", away: "IRA", kickoff: "2026-10-17T17:00:00Z", round: "Αγωνιστική 7" },
  // ── 8η Αγωνιστική ──
  { id: "sl-8-1", t: "SL", md: 8, home: "AEK", away: "PNE", kickoff: "2026-10-24T17:00:00Z", round: "Αγωνιστική 8" },
  { id: "sl-8-2", t: "SL", md: 8, home: "AST", away: "LEV", kickoff: "2026-10-24T17:00:00Z", round: "Αγωνιστική 8" },
  { id: "sl-8-3", t: "SL", md: 8, home: "ARI", away: "ATR", kickoff: "2026-10-24T17:00:00Z", round: "Αγωνιστική 8" },
  { id: "sl-8-4", t: "SL", md: 8, home: "VOL", away: "PAO", kickoff: "2026-10-24T17:00:00Z", round: "Αγωνιστική 8" },
  { id: "sl-8-5", t: "SL", md: 8, home: "OLY", away: "KAL", kickoff: "2026-10-24T17:00:00Z", round: "Αγωνιστική 8" },
  { id: "sl-8-6", t: "SL", md: 8, home: "OFI", away: "PAOK", kickoff: "2026-10-24T17:00:00Z", round: "Αγωνιστική 8" },
  { id: "sl-8-7", t: "SL", md: 8, home: "IRA", away: "KIF", kickoff: "2026-10-24T17:00:00Z", round: "Αγωνιστική 8" },
  // ── 9η Αγωνιστική ──
  { id: "sl-9-1", t: "SL", md: 9, home: "ATR", away: "VOL", kickoff: "2026-10-31T17:00:00Z", round: "Αγωνιστική 9" },
  { id: "sl-9-2", t: "SL", md: 9, home: "KAL", away: "IRA", kickoff: "2026-10-31T17:00:00Z", round: "Αγωνιστική 9" },
  { id: "sl-9-3", t: "SL", md: 9, home: "KIF", away: "OLY", kickoff: "2026-10-31T17:00:00Z", round: "Αγωνιστική 9" },
  { id: "sl-9-4", t: "SL", md: 9, home: "LEV", away: "ARI", kickoff: "2026-10-31T17:00:00Z", round: "Αγωνιστική 9" },
  { id: "sl-9-5", t: "SL", md: 9, home: "PAO", away: "AEK", kickoff: "2026-10-31T17:00:00Z", round: "Αγωνιστική 9" },
  { id: "sl-9-6", t: "SL", md: 9, home: "PNE", away: "OFI", kickoff: "2026-10-31T17:00:00Z", round: "Αγωνιστική 9" },
  { id: "sl-9-7", t: "SL", md: 9, home: "PAOK", away: "AST", kickoff: "2026-10-31T17:00:00Z", round: "Αγωνιστική 9" },
  // ── 10η Αγωνιστική ──
  { id: "sl-10-1", t: "SL", md: 10, home: "AEK", away: "LEV", kickoff: "2026-11-07T17:00:00Z", round: "Αγωνιστική 10" },
  { id: "sl-10-2", t: "SL", md: 10, home: "AST", away: "KAL", kickoff: "2026-11-07T17:00:00Z", round: "Αγωνιστική 10" },
  { id: "sl-10-3", t: "SL", md: 10, home: "ARI", away: "PNE", kickoff: "2026-11-07T17:00:00Z", round: "Αγωνιστική 10" },
  { id: "sl-10-4", t: "SL", md: 10, home: "VOL", away: "KIF", kickoff: "2026-11-07T17:00:00Z", round: "Αγωνιστική 10" },
  { id: "sl-10-5", t: "SL", md: 10, home: "OLY", away: "PAOK", kickoff: "2026-11-07T17:00:00Z", round: "Αγωνιστική 10" },
  { id: "sl-10-6", t: "SL", md: 10, home: "OFI", away: "ATR", kickoff: "2026-11-07T17:00:00Z", round: "Αγωνιστική 10" },
  { id: "sl-10-7", t: "SL", md: 10, home: "IRA", away: "PAO", kickoff: "2026-11-07T17:00:00Z", round: "Αγωνιστική 10" },
  // ── 11η Αγωνιστική ──
  { id: "sl-11-1", t: "SL", md: 11, home: "AST", away: "ARI", kickoff: "2026-11-21T17:00:00Z", round: "Αγωνιστική 11" },
  { id: "sl-11-2", t: "SL", md: 11, home: "KAL", away: "AEK", kickoff: "2026-11-21T17:00:00Z", round: "Αγωνιστική 11" },
  { id: "sl-11-3", t: "SL", md: 11, home: "LEV", away: "ATR", kickoff: "2026-11-21T17:00:00Z", round: "Αγωνιστική 11" },
  { id: "sl-11-4", t: "SL", md: 11, home: "OLY", away: "IRA", kickoff: "2026-11-21T17:00:00Z", round: "Αγωνιστική 11" },
  { id: "sl-11-5", t: "SL", md: 11, home: "PAO", away: "OFI", kickoff: "2026-11-21T17:00:00Z", round: "Αγωνιστική 11" },
  { id: "sl-11-6", t: "SL", md: 11, home: "PNE", away: "VOL", kickoff: "2026-11-21T17:00:00Z", round: "Αγωνιστική 11" },
  { id: "sl-11-7", t: "SL", md: 11, home: "PAOK", away: "KIF", kickoff: "2026-11-21T17:00:00Z", round: "Αγωνιστική 11" },
  // ── 12η Αγωνιστική ──
  { id: "sl-12-1", t: "SL", md: 12, home: "AEK", away: "PAOK", kickoff: "2026-11-28T17:00:00Z", round: "Αγωνιστική 12" },
  { id: "sl-12-2", t: "SL", md: 12, home: "ARI", away: "OLY", kickoff: "2026-11-28T17:00:00Z", round: "Αγωνιστική 12" },
  { id: "sl-12-3", t: "SL", md: 12, home: "ATR", away: "PAO", kickoff: "2026-11-28T17:00:00Z", round: "Αγωνιστική 12" },
  { id: "sl-12-4", t: "SL", md: 12, home: "VOL", away: "AST", kickoff: "2026-11-28T17:00:00Z", round: "Αγωνιστική 12" },
  { id: "sl-12-5", t: "SL", md: 12, home: "KIF", away: "KAL", kickoff: "2026-11-28T17:00:00Z", round: "Αγωνιστική 12" },
  { id: "sl-12-6", t: "SL", md: 12, home: "OFI", away: "LEV", kickoff: "2026-11-28T17:00:00Z", round: "Αγωνιστική 12" },
  { id: "sl-12-7", t: "SL", md: 12, home: "IRA", away: "PNE", kickoff: "2026-11-28T17:00:00Z", round: "Αγωνιστική 12" },
  // ── 13η Αγωνιστική ──
  { id: "sl-13-1", t: "SL", md: 13, home: "AST", away: "KIF", kickoff: "2026-12-05T17:00:00Z", round: "Αγωνιστική 13" },
  { id: "sl-13-2", t: "SL", md: 13, home: "KAL", away: "LEV", kickoff: "2026-12-05T17:00:00Z", round: "Αγωνιστική 13" },
  { id: "sl-13-3", t: "SL", md: 13, home: "OLY", away: "AEK", kickoff: "2026-12-05T17:00:00Z", round: "Αγωνιστική 13" },
  { id: "sl-13-4", t: "SL", md: 13, home: "OFI", away: "IRA", kickoff: "2026-12-05T17:00:00Z", round: "Αγωνιστική 13" },
  { id: "sl-13-5", t: "SL", md: 13, home: "PAO", away: "ARI", kickoff: "2026-12-05T17:00:00Z", round: "Αγωνιστική 13" },
  { id: "sl-13-6", t: "SL", md: 13, home: "PNE", away: "ATR", kickoff: "2026-12-05T17:00:00Z", round: "Αγωνιστική 13" },
  { id: "sl-13-7", t: "SL", md: 13, home: "PAOK", away: "VOL", kickoff: "2026-12-05T17:00:00Z", round: "Αγωνιστική 13" },
  // ── 14η Αγωνιστική ──
  { id: "sl-14-1", t: "SL", md: 14, home: "AEK", away: "VOL", kickoff: "2026-12-12T17:00:00Z", round: "Αγωνιστική 14" },
  { id: "sl-14-2", t: "SL", md: 14, home: "ATR", away: "OLY", kickoff: "2026-12-12T17:00:00Z", round: "Αγωνιστική 14" },
  { id: "sl-14-3", t: "SL", md: 14, home: "KAL", away: "PNE", kickoff: "2026-12-12T17:00:00Z", round: "Αγωνιστική 14" },
  { id: "sl-14-4", t: "SL", md: 14, home: "KIF", away: "OFI", kickoff: "2026-12-12T17:00:00Z", round: "Αγωνιστική 14" },
  { id: "sl-14-5", t: "SL", md: 14, home: "LEV", away: "AST", kickoff: "2026-12-12T17:00:00Z", round: "Αγωνιστική 14" },
  { id: "sl-14-6", t: "SL", md: 14, home: "PAOK", away: "PAO", kickoff: "2026-12-12T17:00:00Z", round: "Αγωνιστική 14" },
  { id: "sl-14-7", t: "SL", md: 14, home: "IRA", away: "ARI", kickoff: "2026-12-12T17:00:00Z", round: "Αγωνιστική 14" },
  // ── 15η Αγωνιστική ──
  { id: "sl-15-1", t: "SL", md: 15, home: "AST", away: "PAOK", kickoff: "2026-12-19T17:00:00Z", round: "Αγωνιστική 15" },
  { id: "sl-15-2", t: "SL", md: 15, home: "ARI", away: "AEK", kickoff: "2026-12-19T17:00:00Z", round: "Αγωνιστική 15" },
  { id: "sl-15-3", t: "SL", md: 15, home: "VOL", away: "LEV", kickoff: "2026-12-19T17:00:00Z", round: "Αγωνιστική 15" },
  { id: "sl-15-4", t: "SL", md: 15, home: "KIF", away: "ATR", kickoff: "2026-12-19T17:00:00Z", round: "Αγωνιστική 15" },
  { id: "sl-15-5", t: "SL", md: 15, home: "OLY", away: "PNE", kickoff: "2026-12-19T17:00:00Z", round: "Αγωνιστική 15" },
  { id: "sl-15-6", t: "SL", md: 15, home: "OFI", away: "KAL", kickoff: "2026-12-19T17:00:00Z", round: "Αγωνιστική 15" },
  { id: "sl-15-7", t: "SL", md: 15, home: "PAO", away: "IRA", kickoff: "2026-12-19T17:00:00Z", round: "Αγωνιστική 15" },
  // ── 16η Αγωνιστική ──
  { id: "sl-16-1", t: "SL", md: 16, home: "AEK", away: "ATR", kickoff: "2027-01-09T17:00:00Z", round: "Αγωνιστική 16" },
  { id: "sl-16-2", t: "SL", md: 16, home: "AST", away: "PAO", kickoff: "2027-01-09T17:00:00Z", round: "Αγωνιστική 16" },
  { id: "sl-16-3", t: "SL", md: 16, home: "ARI", away: "PAOK", kickoff: "2027-01-09T17:00:00Z", round: "Αγωνιστική 16" },
  { id: "sl-16-4", t: "SL", md: 16, home: "KAL", away: "OLY", kickoff: "2027-01-09T17:00:00Z", round: "Αγωνιστική 16" },
  { id: "sl-16-5", t: "SL", md: 16, home: "LEV", away: "OFI", kickoff: "2027-01-09T17:00:00Z", round: "Αγωνιστική 16" },
  { id: "sl-16-6", t: "SL", md: 16, home: "PNE", away: "KIF", kickoff: "2027-01-09T17:00:00Z", round: "Αγωνιστική 16" },
  { id: "sl-16-7", t: "SL", md: 16, home: "IRA", away: "VOL", kickoff: "2027-01-09T17:00:00Z", round: "Αγωνιστική 16" },
  // ── 17η Αγωνιστική ──
  { id: "sl-17-1", t: "SL", md: 17, home: "AEK", away: "KAL", kickoff: "2027-01-16T17:00:00Z", round: "Αγωνιστική 17" },
  { id: "sl-17-2", t: "SL", md: 17, home: "ATR", away: "PNE", kickoff: "2027-01-16T17:00:00Z", round: "Αγωνιστική 17" },
  { id: "sl-17-3", t: "SL", md: 17, home: "VOL", away: "ARI", kickoff: "2027-01-16T17:00:00Z", round: "Αγωνιστική 17" },
  { id: "sl-17-4", t: "SL", md: 17, home: "KIF", away: "AST", kickoff: "2027-01-16T17:00:00Z", round: "Αγωνιστική 17" },
  { id: "sl-17-5", t: "SL", md: 17, home: "LEV", away: "IRA", kickoff: "2027-01-16T17:00:00Z", round: "Αγωνιστική 17" },
  { id: "sl-17-6", t: "SL", md: 17, home: "OFI", away: "PAO", kickoff: "2027-01-16T17:00:00Z", round: "Αγωνιστική 17" },
  { id: "sl-17-7", t: "SL", md: 17, home: "PAOK", away: "OLY", kickoff: "2027-01-16T17:00:00Z", round: "Αγωνιστική 17" },
  // ── 18η Αγωνιστική ──
  { id: "sl-18-1", t: "SL", md: 18, home: "ARI", away: "KIF", kickoff: "2027-01-23T17:00:00Z", round: "Αγωνιστική 18" },
  { id: "sl-18-2", t: "SL", md: 18, home: "VOL", away: "OFI", kickoff: "2027-01-23T17:00:00Z", round: "Αγωνιστική 18" },
  { id: "sl-18-3", t: "SL", md: 18, home: "KAL", away: "AST", kickoff: "2027-01-23T17:00:00Z", round: "Αγωνιστική 18" },
  { id: "sl-18-4", t: "SL", md: 18, home: "OLY", away: "LEV", kickoff: "2027-01-23T17:00:00Z", round: "Αγωνιστική 18" },
  { id: "sl-18-5", t: "SL", md: 18, home: "PAO", away: "ATR", kickoff: "2027-01-23T17:00:00Z", round: "Αγωνιστική 18" },
  { id: "sl-18-6", t: "SL", md: 18, home: "PNE", away: "AEK", kickoff: "2027-01-23T17:00:00Z", round: "Αγωνιστική 18" },
  { id: "sl-18-7", t: "SL", md: 18, home: "IRA", away: "PAOK", kickoff: "2027-01-23T17:00:00Z", round: "Αγωνιστική 18" },
  // ── 19η Αγωνιστική ──
  { id: "sl-19-1", t: "SL", md: 19, home: "AST", away: "IRA", kickoff: "2027-01-30T17:00:00Z", round: "Αγωνιστική 19" },
  { id: "sl-19-2", t: "SL", md: 19, home: "ATR", away: "ARI", kickoff: "2027-01-30T17:00:00Z", round: "Αγωνιστική 19" },
  { id: "sl-19-3", t: "SL", md: 19, home: "KIF", away: "VOL", kickoff: "2027-01-30T17:00:00Z", round: "Αγωνιστική 19" },
  { id: "sl-19-4", t: "SL", md: 19, home: "LEV", away: "KAL", kickoff: "2027-01-30T17:00:00Z", round: "Αγωνιστική 19" },
  { id: "sl-19-5", t: "SL", md: 19, home: "OFI", away: "AEK", kickoff: "2027-01-30T17:00:00Z", round: "Αγωνιστική 19" },
  { id: "sl-19-6", t: "SL", md: 19, home: "PAO", away: "OLY", kickoff: "2027-01-30T17:00:00Z", round: "Αγωνιστική 19" },
  { id: "sl-19-7", t: "SL", md: 19, home: "PAOK", away: "PNE", kickoff: "2027-01-30T17:00:00Z", round: "Αγωνιστική 19" },
  // ── 20η Αγωνιστική ──
  { id: "sl-20-1", t: "SL", md: 20, home: "AEK", away: "KIF", kickoff: "2027-02-06T17:00:00Z", round: "Αγωνιστική 20" },
  { id: "sl-20-2", t: "SL", md: 20, home: "ARI", away: "PAO", kickoff: "2027-02-06T17:00:00Z", round: "Αγωνιστική 20" },
  { id: "sl-20-3", t: "SL", md: 20, home: "VOL", away: "ATR", kickoff: "2027-02-06T17:00:00Z", round: "Αγωνιστική 20" },
  { id: "sl-20-4", t: "SL", md: 20, home: "KAL", away: "PAOK", kickoff: "2027-02-06T17:00:00Z", round: "Αγωνιστική 20" },
  { id: "sl-20-5", t: "SL", md: 20, home: "OLY", away: "AST", kickoff: "2027-02-06T17:00:00Z", round: "Αγωνιστική 20" },
  { id: "sl-20-6", t: "SL", md: 20, home: "PNE", away: "LEV", kickoff: "2027-02-06T17:00:00Z", round: "Αγωνιστική 20" },
  { id: "sl-20-7", t: "SL", md: 20, home: "IRA", away: "OFI", kickoff: "2027-02-06T17:00:00Z", round: "Αγωνιστική 20" },
  // ── 21η Αγωνιστική ──
  { id: "sl-21-1", t: "SL", md: 21, home: "AST", away: "PNE", kickoff: "2027-02-13T17:00:00Z", round: "Αγωνιστική 21" },
  { id: "sl-21-2", t: "SL", md: 21, home: "ATR", away: "IRA", kickoff: "2027-02-13T17:00:00Z", round: "Αγωνιστική 21" },
  { id: "sl-21-3", t: "SL", md: 21, home: "LEV", away: "KIF", kickoff: "2027-02-13T17:00:00Z", round: "Αγωνιστική 21" },
  { id: "sl-21-4", t: "SL", md: 21, home: "OLY", away: "VOL", kickoff: "2027-02-13T17:00:00Z", round: "Αγωνιστική 21" },
  { id: "sl-21-5", t: "SL", md: 21, home: "OFI", away: "ARI", kickoff: "2027-02-13T17:00:00Z", round: "Αγωνιστική 21" },
  { id: "sl-21-6", t: "SL", md: 21, home: "PAO", away: "KAL", kickoff: "2027-02-13T17:00:00Z", round: "Αγωνιστική 21" },
  { id: "sl-21-7", t: "SL", md: 21, home: "PAOK", away: "AEK", kickoff: "2027-02-13T17:00:00Z", round: "Αγωνιστική 21" },
  // ── 22η Αγωνιστική ──
  { id: "sl-22-1", t: "SL", md: 22, home: "AEK", away: "AST", kickoff: "2027-02-20T17:00:00Z", round: "Αγωνιστική 22" },
  { id: "sl-22-2", t: "SL", md: 22, home: "ARI", away: "LEV", kickoff: "2027-02-20T17:00:00Z", round: "Αγωνιστική 22" },
  { id: "sl-22-3", t: "SL", md: 22, home: "ATR", away: "OFI", kickoff: "2027-02-20T17:00:00Z", round: "Αγωνιστική 22" },
  { id: "sl-22-4", t: "SL", md: 22, home: "VOL", away: "KAL", kickoff: "2027-02-20T17:00:00Z", round: "Αγωνιστική 22" },
  { id: "sl-22-5", t: "SL", md: 22, home: "KIF", away: "PAOK", kickoff: "2027-02-20T17:00:00Z", round: "Αγωνιστική 22" },
  { id: "sl-22-6", t: "SL", md: 22, home: "PNE", away: "PAO", kickoff: "2027-02-20T17:00:00Z", round: "Αγωνιστική 22" },
  { id: "sl-22-7", t: "SL", md: 22, home: "IRA", away: "OLY", kickoff: "2027-02-20T17:00:00Z", round: "Αγωνιστική 22" },
  // ── 23η Αγωνιστική ──
  { id: "sl-23-1", t: "SL", md: 23, home: "AST", away: "OFI", kickoff: "2027-02-27T17:00:00Z", round: "Αγωνιστική 23" },
  { id: "sl-23-2", t: "SL", md: 23, home: "KAL", away: "KIF", kickoff: "2027-02-27T17:00:00Z", round: "Αγωνιστική 23" },
  { id: "sl-23-3", t: "SL", md: 23, home: "LEV", away: "AEK", kickoff: "2027-02-27T17:00:00Z", round: "Αγωνιστική 23" },
  { id: "sl-23-4", t: "SL", md: 23, home: "OLY", away: "ARI", kickoff: "2027-02-27T17:00:00Z", round: "Αγωνιστική 23" },
  { id: "sl-23-5", t: "SL", md: 23, home: "PAO", away: "VOL", kickoff: "2027-02-27T17:00:00Z", round: "Αγωνιστική 23" },
  { id: "sl-23-6", t: "SL", md: 23, home: "PNE", away: "IRA", kickoff: "2027-02-27T17:00:00Z", round: "Αγωνιστική 23" },
  { id: "sl-23-7", t: "SL", md: 23, home: "PAOK", away: "ATR", kickoff: "2027-02-27T17:00:00Z", round: "Αγωνιστική 23" },
  // ── 24η Αγωνιστική ──
  { id: "sl-24-1", t: "SL", md: 24, home: "AEK", away: "OLY", kickoff: "2027-03-06T17:00:00Z", round: "Αγωνιστική 24" },
  { id: "sl-24-2", t: "SL", md: 24, home: "ARI", away: "AST", kickoff: "2027-03-06T17:00:00Z", round: "Αγωνιστική 24" },
  { id: "sl-24-3", t: "SL", md: 24, home: "ATR", away: "LEV", kickoff: "2027-03-06T17:00:00Z", round: "Αγωνιστική 24" },
  { id: "sl-24-4", t: "SL", md: 24, home: "VOL", away: "PAOK", kickoff: "2027-03-06T17:00:00Z", round: "Αγωνιστική 24" },
  { id: "sl-24-5", t: "SL", md: 24, home: "KIF", away: "PAO", kickoff: "2027-03-06T17:00:00Z", round: "Αγωνιστική 24" },
  { id: "sl-24-6", t: "SL", md: 24, home: "OFI", away: "PNE", kickoff: "2027-03-06T17:00:00Z", round: "Αγωνιστική 24" },
  { id: "sl-24-7", t: "SL", md: 24, home: "IRA", away: "KAL", kickoff: "2027-03-06T17:00:00Z", round: "Αγωνιστική 24" },
  // ── 25η Αγωνιστική ──
  { id: "sl-25-1", t: "SL", md: 25, home: "AST", away: "VOL", kickoff: "2027-03-13T17:00:00Z", round: "Αγωνιστική 25" },
  { id: "sl-25-2", t: "SL", md: 25, home: "KAL", away: "ATR", kickoff: "2027-03-13T17:00:00Z", round: "Αγωνιστική 25" },
  { id: "sl-25-3", t: "SL", md: 25, home: "OLY", away: "KIF", kickoff: "2027-03-13T17:00:00Z", round: "Αγωνιστική 25" },
  { id: "sl-25-4", t: "SL", md: 25, home: "PAO", away: "LEV", kickoff: "2027-03-13T17:00:00Z", round: "Αγωνιστική 25" },
  { id: "sl-25-5", t: "SL", md: 25, home: "PNE", away: "ARI", kickoff: "2027-03-13T17:00:00Z", round: "Αγωνιστική 25" },
  { id: "sl-25-6", t: "SL", md: 25, home: "PAOK", away: "OFI", kickoff: "2027-03-13T17:00:00Z", round: "Αγωνιστική 25" },
  { id: "sl-25-7", t: "SL", md: 25, home: "IRA", away: "AEK", kickoff: "2027-03-13T17:00:00Z", round: "Αγωνιστική 25" },
  // ── 26η Αγωνιστική ──
  { id: "sl-26-1", t: "SL", md: 26, home: "AEK", away: "PAO", kickoff: "2027-03-20T17:00:00Z", round: "Αγωνιστική 26" },
  { id: "sl-26-2", t: "SL", md: 26, home: "ARI", away: "KAL", kickoff: "2027-03-20T17:00:00Z", round: "Αγωνιστική 26" },
  { id: "sl-26-3", t: "SL", md: 26, home: "ATR", away: "AST", kickoff: "2027-03-20T17:00:00Z", round: "Αγωνιστική 26" },
  { id: "sl-26-4", t: "SL", md: 26, home: "VOL", away: "PNE", kickoff: "2027-03-20T17:00:00Z", round: "Αγωνιστική 26" },
  { id: "sl-26-5", t: "SL", md: 26, home: "KIF", away: "IRA", kickoff: "2027-03-20T17:00:00Z", round: "Αγωνιστική 26" },
  { id: "sl-26-6", t: "SL", md: 26, home: "LEV", away: "PAOK", kickoff: "2027-03-20T17:00:00Z", round: "Αγωνιστική 26" },
  { id: "sl-26-7", t: "SL", md: 26, home: "OFI", away: "OLY", kickoff: "2027-03-20T17:00:00Z", round: "Αγωνιστική 26" }
];
const UEFA_FIXTURES = [
  { id: "uel-paok-1", t: "UEL", greek: "PAOK", home: "DYN", away: "PAOK", kickoff: "2026-07-23T17:00:00Z", round: "Q2 · Leg 1", leg: 1, tie: "uel-paok", venue: "Motor Lublin Arena, Πολωνία" },
  { id: "uel-paok-2", t: "UEL", greek: "PAOK", home: "PAOK", away: "DYN", kickoff: "2026-07-30T17:45:00Z", round: "Q2 · Leg 2", leg: 2, tie: "uel-paok", venue: "Toumba, Θεσσαλονίκη" },
  { id: "uecl-pao-1", t: "UECL", greek: "PAO", home: "PKS", away: "PAO", kickoff: "2026-07-23T18:00:00Z", round: "Q2 · Leg 1", leg: 1, tie: "uecl-pao", venue: "Fehérvári úti, Paks" },
  { id: "uecl-pao-2", t: "UECL", greek: "PAO", home: "PAO", away: "PKS", kickoff: "2026-07-30T17:45:00Z", round: "Q2 · Leg 2", leg: 2, tie: "uecl-pao", venue: "ΟΑΚΑ, Αθήνα" },
  { id: "uel-ofi-1", t: "UEL", greek: "OFI", home: "OFI", away: "TBD", kickoff: "2026-07-24T17:00:00Z", round: "Q2 · Leg 1", leg: 1, tie: "uel-ofi", venue: "Πανκρήτιο, Ηράκλειο" },
  { id: "uel-ofi-2", t: "UEL", greek: "OFI", home: "TBD", away: "OFI", kickoff: "2026-07-31T17:00:00Z", round: "Q2 · Leg 2", leg: 2, tie: "uel-ofi", venue: "Έδρα αντιπάλου" },
  { id: "ucl-oly-1", t: "UCL", greek: "OLY", home: "OLY", away: "NEC", kickoff: "2026-08-04T18:30:00Z", round: "Q3 · Leg 1", leg: 1, tie: "ucl-oly", venue: "Karaiskakis, Πειραιάς" },
  { id: "ucl-oly-2", t: "UCL", greek: "OLY", home: "NEC", away: "OLY", kickoff: "2026-08-11T18:00:00Z", round: "Q3 · Leg 2", leg: 2, tie: "ucl-oly", venue: "Goffert, Nijmegen" },
  { id: "ucl-aek-1", t: "UCL", greek: "AEK", home: "AEK", away: "TBD", kickoff: "2026-08-19T18:30:00Z", round: "PO · Leg 1", leg: 1, tie: "ucl-aek", venue: "OPAP Arena, Αθήνα" },
  { id: "ucl-aek-2", t: "UCL", greek: "AEK", home: "TBD", away: "AEK", kickoff: "2026-08-26T18:30:00Z", round: "PO · Leg 2", leg: 2, tie: "ucl-aek" }
];
const ALL_FIXTURES = [...SUPER_LEAGUE, ...UEFA_FIXTURES];
function matchResult(h, a) {
  return h > a ? "H" : h < a ? "A" : "D";
}
function scoreMatch(pred, actual) {
  if (!pred || actual == null) return null;
  const exact = pred.h === actual.h && pred.a === actual.a;
  const correct = matchResult(pred.h, pred.a) === matchResult(actual.h, actual.a);
  return { exact, correct, points: (exact ? 1 : 0) + (correct ? 1 : 0) };
}
function computeLeaderboard(fixtures, predictions, results) {
  const t2 = {};
  PLAYERS.forEach((p2) => {
    t2[p2] = { pts: 0, exact: 0, correct: 0, played: 0 };
  });
  fixtures.forEach((m2) => {
    const actual = results == null ? void 0 : results[m2.id];
    if (actual == null) return;
    PLAYERS.forEach((p2) => {
      var _a;
      const sc2 = scoreMatch((_a = predictions == null ? void 0 : predictions[m2.id]) == null ? void 0 : _a[p2], actual);
      if (!sc2) return;
      t2[p2].pts += sc2.points;
      t2[p2].played += 1;
      if (sc2.exact) t2[p2].exact++;
      if (sc2.correct) t2[p2].correct++;
    });
  });
  return PLAYERS.slice().sort((a, b) => t2[b].pts - t2[a].pts).map((p2, i) => ({ player: p2, rank: i + 1, ...t2[p2] }));
}
const TZ = "Europe/Athens";
const grTime = (iso) => new Date(iso).toLocaleTimeString("el-GR", { timeZone: TZ, hour: "2-digit", minute: "2-digit" });
const grDate = (iso) => new Date(iso).toLocaleDateString("el-GR", { timeZone: TZ, weekday: "short", day: "numeric", month: "short" });
const nowGR = () => (/* @__PURE__ */ new Date()).toLocaleTimeString("el-GR", { timeZone: TZ, hour: "2-digit", minute: "2-digit" });
const isToday = (iso) => {
  const f2 = (d) => d.toLocaleDateString("el-GR", { timeZone: TZ });
  return f2(/* @__PURE__ */ new Date()) === f2(new Date(iso));
};
const isLocked = (iso) => Date.now() >= new Date(iso).getTime() - 6e4;
const LOGOS = {
  OLY: "/logos/OLY.svg",
  AEK: "/logos/AEK.svg",
  PAOK: "/logos/PAOK.svg",
  PAO: "/logos/PAO.svg",
  ARI: "/logos/ARI.png",
  ATR: "/logos/ATR.svg",
  AST: "/logos/AST.png",
  KIF: "/logos/KIF.svg",
  LEV: "/logos/LEV.png",
  OFI: "/logos/OFI.svg",
  PNE: "/logos/PNE.png",
  VOL: "/logos/VOL.svg",
  KAL: "/logos/KAL.png",
  IRA: "/logos/IRA.png",
  DYN: null,
  NEC: null,
  PKS: null,
  TBD: null
};
const TEAM_COLORS = {
  OLY: "#CC0000",
  AEK: "#1a1a1a",
  PAOK: "#1a1a1a",
  PAO: "#006B2B",
  ARI: "#DAA520",
  ATR: "#003087",
  AST: "#FF6600",
  KIF: "#003F8A",
  LEV: "#006633",
  OFI: "#8B0000",
  PNE: "#6600AA",
  VOL: "#003366",
  IRA: "#0000CC",
  KAL: "#1a1a1a",
  DYN: "#003F87",
  NEC: "#CC0000",
  PKS: "#006400",
  TBD: "#444"
};
function ShieldFallback({ k: k2, size }) {
  const t2 = TEAMS[k2] || { abbr: k2 };
  const color = TEAM_COLORS[k2] || "#444";
  const abbr = (t2.abbr || k2).slice(0, 3);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: size, height: size, viewBox: "0 0 64 64", style: { flexShrink: 0 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "path",
      {
        d: "M32 4 L58 16 L58 36 Q58 54 32 62 Q6 54 6 36 L6 16 Z",
        fill: color,
        stroke: "rgba(255,255,255,0.2)",
        strokeWidth: "1.5"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "text",
      {
        x: "32",
        y: "39",
        textAnchor: "middle",
        fontFamily: "'Arial Black',Arial,sans-serif",
        fontSize: abbr.length > 2 ? 14 : 17,
        fontWeight: "900",
        fill: "#fff",
        letterSpacing: "-0.5",
        children: abbr
      }
    )
  ] });
}
function TeamLogo({ k: k2, size = 32 }) {
  const [failed, setFailed] = reactExports.useState(false);
  const url = LOGOS[k2];
  if (!url || failed) return /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldFallback, { k: k2, size });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "img",
    {
      src: url,
      alt: k2,
      width: size,
      height: size,
      onError: () => setFailed(true),
      style: {
        width: size,
        height: size,
        objectFit: "contain",
        flexShrink: 0,
        filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.5))"
      }
    }
  );
}
const T_STYLES = {
  SL: { bg: "#f0c04018", c: "#f0c040", border: "#f0c04040" },
  UCL: { bg: "#5ba3f518", c: "#5ba3f5", border: "#5ba3f540" },
  UEL: { bg: "#f5733a18", c: "#f5733a", border: "#f5733a40" },
  UECL: { bg: "#3fd68a18", c: "#3fd68a", border: "#3fd68a40" }
};
function TPill({ id: id2, size = "sm" }) {
  const s = T_STYLES[id2] || T_STYLES.SL;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
    fontSize: size === "lg" ? 11 : 9,
    fontWeight: 700,
    padding: size === "lg" ? "3px 9px" : "2px 7px",
    borderRadius: 6,
    background: s.bg,
    color: s.c,
    border: `1px solid ${s.border}`,
    letterSpacing: ".06em",
    textTransform: "uppercase"
  }, children: id2 });
}
function ScorePill({ h, a, pending }) {
  if (pending) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 3 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 18, fontWeight: 800, color: "#ffffff25" }, children: "?" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 13, color: "#ffffff15" }, children: ":" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 18, fontWeight: 800, color: "#ffffff25" }, children: "?" })
  ] });
  if (h == null) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 3 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 14, color: "#ffffff20" }, children: "–" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: "#ffffff12" }, children: ":" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 14, color: "#ffffff20" }, children: "–" })
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 2 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 22, fontWeight: 900, color: "#e8e9ef", fontVariantNumeric: "tabular-nums", lineHeight: 1 }, children: h }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 14, color: "#ffffff40", margin: "0 1px" }, children: ":" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 22, fontWeight: 900, color: "#e8e9ef", fontVariantNumeric: "tabular-nums", lineHeight: 1 }, children: a })
  ] });
}
function Spinner({ size = 20 }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
    width: size,
    height: size,
    border: `2px solid #ffffff12`,
    borderTopColor: "#ffffff60",
    borderRadius: "50%",
    animation: "spin .7s linear infinite"
  } });
}
function SLbl({ children, accent }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: ".1em",
    textTransform: "uppercase",
    color: accent || "#ffffff40",
    marginBottom: 10
  }, children });
}
const PC$1 = {
  boikos: { color: "#ff2244", glow: "#ff224460", area: "#ff224415", dash: "none" },
  mavromichalis: { color: "#4d9fff", glow: "#4d9fff60", area: "#4d9fff15", dash: "8,4" },
  chousiadas: { color: "#ff6b35", glow: "#ff6b3560", area: "#ff6b3515", dash: "4,4,1,4" }
};
const DRAW_ORDER = ["mavromichalis", "chousiadas", "boikos"];
function buildTimeline(predictions, results) {
  const played = ALL_FIXTURES.filter((m2) => (results == null ? void 0 : results[m2.id]) != null).sort((a, b) => new Date(a.kickoff) - new Date(b.kickoff));
  if (!played.length) return { events: [], maxPts: 0, final: null };
  let cum = { boikos: 0, mavromichalis: 0, chousiadas: 0 };
  const events = played.map((m2) => {
    const actual = results[m2.id];
    const label = (m2.home || "?").substring(0, 3) + " vs " + (m2.away || "?").substring(0, 3);
    PLAYERS.forEach((p2) => {
      var _a;
      const sc2 = scoreMatch((_a = predictions == null ? void 0 : predictions[m2.id]) == null ? void 0 : _a[p2], actual);
      cum[p2] += (sc2 == null ? void 0 : sc2.points) ?? 0;
    });
    return {
      id: m2.id,
      label,
      pts: { ...cum },
      scores: Object.fromEntries(PLAYERS.map((p2) => {
        var _a, _b;
        return [p2, {
          pred: (_a = predictions == null ? void 0 : predictions[m2.id]) == null ? void 0 : _a[p2],
          sc: scoreMatch((_b = predictions == null ? void 0 : predictions[m2.id]) == null ? void 0 : _b[p2], actual)
        }];
      })),
      actual
    };
  });
  const maxPts = Math.max(...PLAYERS.map((p2) => cum[p2]), 2);
  return { events, maxPts, final: { ...cum } };
}
function BurgerBg({ progress, W: W2, H: H2 }) {
  const cx = W2 * 0.72, cy = H2 * 0.5;
  const base = Math.max(36, Math.min(120, 36 + progress * 100));
  const bw = base * 1.4, bh2 = base;
  const op = 0.05 + progress * 0.09;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { opacity: op, style: { pointerEvents: "none" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx, cy: cy - bh2 * 0.35, rx: bw * 0.52, ry: bh2 * 0.28, fill: "#c8860a" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx, cy: cy - bh2 * 0.42, rx: bw * 0.44, ry: bh2 * 0.18, fill: "#e8a020" }),
    [[0, -0.5], [0.25, -0.45], [-0.2, -0.47], [0.1, -0.38], [-0.15, -0.35]].map(([dx, dy], i) => /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: cx + dx * bw * 0.55, cy: cy + dy * bh2, rx: bw * 0.03, ry: bw * 0.015, fill: "#fff", opacity: ".5" }, i)),
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: cx - bw * 0.52, y: cy - bh2 * 0.1, width: bw * 1.04, height: bh2 * 0.12, rx: 3, fill: "#f5c518" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: cx - bw * 0.5, y: cy + bh2 * 0.04, width: bw, height: bh2 * 0.18, rx: 5, fill: "#7a3a0a" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: cx - bw * 0.48, y: cy + bh2 * 0.05, width: bw * 0.96, height: bh2 * 0.08, rx: 3, fill: "#5a2a06" }),
    [-0.4, -0.2, 0, 0.2, 0.4].map((dx, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: cx + dx * bw * 0.45, cy: cy + bh2 * 0.24, rx: bw * 0.15, ry: bh2 * 0.07, fill: "#2d8a2d" }, i)),
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: cx - bw * 0.46, y: cy + bh2 * 0.32, width: bw * 0.92, height: bh2 * 0.1, rx: 4, fill: "#cc2200" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx, cy: cy + bh2 * 0.48, rx: bw * 0.52, ry: bh2 * 0.16, fill: "#c8860a" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx, cy: cy + bh2 * 0.52, rx: bw * 0.48, ry: bh2 * 0.09, fill: "#e8a020" })
  ] });
}
function H2HGraph({ predictions, results }) {
  var _a, _b;
  const { events, maxPts, final } = buildTimeline(predictions, results);
  const [hovIdx, setHovIdx] = reactExports.useState(null);
  const progress = events.length / Math.max(ALL_FIXTURES.length, 1);
  if (!events.length) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    background: "#111318",
    border: "1px solid #ffffff0e",
    borderRadius: 16,
    padding: "28px 20px",
    textAlign: "center",
    marginBottom: 12
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 44, marginBottom: 10 }, children: "🍔" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 13, fontWeight: 700, color: "#ffffff45", marginBottom: 4 }, children: "Αναμένουμε τους πρώτους αγώνες..." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "#ffffff25" }, children: "Το burger μεγαλώνει καθώς προχωρά η σεζόν" })
  ] });
  const W2 = 380, H2 = 210;
  const PAD = { top: 24, right: 18, bottom: 40, left: 32 };
  const gW = W2 - PAD.left - PAD.right, gH = H2 - PAD.top - PAD.bottom;
  const allPts = [{ pts: { boikos: 0, mavromichalis: 0, chousiadas: 0 } }, ...events];
  const N2 = allPts.length - 1;
  const xFor = (i) => PAD.left + i / Math.max(N2, 1) * gW;
  const yFor = (v2) => PAD.top + gH - v2 / maxPts * gH;
  const smoothPath = (p2) => {
    const pts = allPts.map((ev, i) => ({ x: xFor(i), y: yFor(ev.pts[p2] ?? 0) }));
    if (pts.length < 2) return `M${pts[0].x} ${pts[0].y}`;
    let d = `M${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1], curr = pts[i], cpx = (prev.x + curr.x) / 2;
      d += ` C${cpx} ${prev.y} ${cpx} ${curr.y} ${curr.x} ${curr.y}`;
    }
    return d;
  };
  const areaPath = (p2) => {
    const pts = allPts.map((ev, i) => ({ x: xFor(i), y: yFor(ev.pts[p2] ?? 0) }));
    const bot = PAD.top + gH;
    let d = `M${pts[0].x} ${bot} L${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1], curr = pts[i], cpx = (prev.x + curr.x) / 2;
      d += ` C${cpx} ${prev.y} ${cpx} ${curr.y} ${curr.x} ${curr.y}`;
    }
    d += ` L${pts[pts.length - 1].x} ${bot} Z`;
    return d;
  };
  const leader = final ? PLAYERS.reduce((a, b) => final[a] >= final[b] ? a : b) : null;
  const hovered = hovIdx !== null ? allPts[hovIdx + 1] : null;
  const gaps = final ? [...PLAYERS].sort((a, b) => final[b] - final[a]) : [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    background: "#111318",
    border: "1px solid #ffffff0e",
    borderRadius: 16,
    padding: "14px 14px 10px",
    marginBottom: 12,
    overflow: "hidden"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 13, fontWeight: 800, color: "#e8e9ef" }, children: [
          "Εξέλιξη Διαγωνισμού ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 16 }, children: "🍔" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 10, fontWeight: 600, color: "#ffffff40", marginTop: 1 }, children: [
          events.length,
          " αγώνες · σωρευτικοί πόντοι"
        ] })
      ] }),
      leader && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        background: `${PC$1[leader].area}`,
        border: `1px solid ${PC$1[leader].glow}`,
        borderRadius: 20
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: PC$1[leader].color,
          boxShadow: `0 0 6px ${PC$1[leader].color}`
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 11, fontWeight: 800, color: PC$1[leader].color }, children: [
          PLAYER_NAMES[leader],
          " leads"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 12, marginBottom: 10, flexWrap: "wrap" }, children: PLAYERS.map((p2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 6 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "28", height: "10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1: "0",
            y1: "5",
            x2: "28",
            y2: "5",
            stroke: PC$1[p2].color,
            strokeWidth: "2.5",
            strokeLinecap: "round",
            strokeDasharray: PC$1[p2].dash === "none" ? void 0 : PC$1[p2].dash
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "14", cy: "5", r: "3", fill: PC$1[p2].color })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, fontWeight: 700, color: PC$1[p2].color }, children: PLAYER_NAMES[p2] }),
      final && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: {
        fontSize: 12,
        fontWeight: 900,
        color: PC$1[p2].color,
        fontVariantNumeric: "tabular-nums"
      }, children: [
        final[p2],
        "p"
      ] })
    ] }, p2)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", cursor: "crosshair" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "svg",
        {
          viewBox: `0 0 ${W2} ${H2}`,
          style: { width: "100%", height: "auto", display: "block", overflow: "visible" },
          onMouseLeave: () => setHovIdx(null),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
              PLAYERS.map((p2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: `ag-${p2}`, x1: "0", y1: "0", x2: "0", y2: "1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: PC$1[p2].color, stopOpacity: "0.25" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: PC$1[p2].color, stopOpacity: "0.02" })
              ] }, p2)),
              PLAYERS.map((p2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("filter", { id: `gl-${p2}`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: "2", result: "b" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("feMerge", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "b" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "SourceGraphic" })
                ] })
              ] }, `gl-${p2}`))
            ] }),
            [0, 0.25, 0.5, 0.75, 1].map((f2) => {
              const y2 = PAD.top + gH * (1 - f2), val = Math.round(f2 * maxPts);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "line",
                  {
                    x1: PAD.left,
                    y1: y2,
                    x2: PAD.left + gW,
                    y2,
                    stroke: "#ffffff08",
                    strokeWidth: "1",
                    strokeDasharray: "3,4"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "text",
                  {
                    x: PAD.left - 5,
                    y: y2 + 4,
                    textAnchor: "end",
                    fontSize: "8",
                    fill: "#ffffff30",
                    fontFamily: "'Space Grotesk',sans-serif",
                    children: val
                  }
                )
              ] }, f2);
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(BurgerBg, { progress, W: W2, H: H2 }),
            DRAW_ORDER.map((p2) => /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: areaPath(p2), fill: `url(#ag-${p2})` }, p2)),
            DRAW_ORDER.map((p2) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "path",
              {
                d: smoothPath(p2),
                fill: "none",
                stroke: PC$1[p2].color,
                strokeWidth: p2 === "boikos" ? 3 : 2.5,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeDasharray: PC$1[p2].dash === "none" ? void 0 : PC$1[p2].dash,
                filter: `url(#gl-${p2})`
              },
              p2
            )),
            events.map((_, i) => {
              const x0 = i === 0 ? PAD.left : (xFor(i) + xFor(i === 0 ? 0 : i - 1)) / 2 + (i === 0 ? 0 : (xFor(i) - xFor(i - 1)) / 2);
              const x1 = i === N2 - 1 ? PAD.left + gW : (xFor(i) + xFor(i + 1)) / 2;
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  x: x0,
                  y: PAD.top,
                  width: Math.max(x1 - x0, 1),
                  height: gH,
                  fill: "transparent",
                  onMouseEnter: () => setHovIdx(i)
                },
                i
              );
            }),
            hovered && hovIdx !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "line",
                {
                  x1: xFor(hovIdx + 1),
                  y1: PAD.top,
                  x2: xFor(hovIdx + 1),
                  y2: PAD.top + gH,
                  stroke: "#ffffff20",
                  strokeWidth: "1",
                  strokeDasharray: "3,3"
                }
              ),
              PLAYERS.map((p2) => {
                const y2 = yFor(hovered.pts[p2] ?? 0);
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: xFor(hovIdx + 1), cy: y2, r: "5", fill: PC$1[p2].color, fillOpacity: "0.2" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "circle",
                    {
                      cx: xFor(hovIdx + 1),
                      cy: y2,
                      r: "3",
                      fill: PC$1[p2].color,
                      style: { filter: `drop-shadow(0 0 3px ${PC$1[p2].color})` }
                    }
                  )
                ] }, p2);
              })
            ] }),
            final && PLAYERS.map((p2) => {
              const x2 = xFor(N2), y2 = yFor(final[p2]);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: x2, cy: y2, r: "5", fill: PC$1[p2].color, fillOpacity: "0.2" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: x2, cy: y2, r: "3", fill: PC$1[p2].color })
              ] }, p2);
            }),
            events.map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "text",
              {
                x: xFor(i + 1),
                y: H2 - 8,
                textAnchor: "middle",
                fontSize: "8",
                fill: "#ffffff28",
                fontFamily: "'Space Grotesk',sans-serif",
                children: i + 1
              },
              i
            ))
          ]
        }
      ),
      hovered && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        position: "absolute",
        top: 4,
        left: "50%",
        transform: "translateX(-50%)",
        background: "#0d0f14",
        border: "1px solid #ffffff18",
        borderRadius: 10,
        padding: "8px 12px",
        minWidth: 180,
        pointerEvents: "none",
        zIndex: 10,
        boxShadow: "0 8px 24px rgba(0,0,0,.6)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          fontSize: 10,
          fontWeight: 700,
          color: "#ffffff45",
          marginBottom: 7,
          letterSpacing: ".06em",
          textTransform: "uppercase"
        }, children: [
          hovered.label,
          " · ",
          (_a = hovered.actual) == null ? void 0 : _a.h,
          "–",
          (_b = hovered.actual) == null ? void 0 : _b.a
        ] }),
        PLAYERS.map((p2) => {
          var _a2;
          const d = (_a2 = hovered.scores) == null ? void 0 : _a2[p2];
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 7, height: 7, borderRadius: "50%", background: PC$1[p2].color, flexShrink: 0 } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, fontWeight: 600, color: "#e8e9ef", flex: 1 }, children: PLAYER_NAMES[p2] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, color: "#ffffff40" }, children: (d == null ? void 0 : d.pred) ? `${d.pred.h}–${d.pred.a}` : "–" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: {
              fontSize: 11,
              fontWeight: 800,
              color: PC$1[p2].color,
              fontVariantNumeric: "tabular-nums"
            }, children: [
              hovered.pts[p2],
              "p"
            ] }),
            (d == null ? void 0 : d.sc) && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
              fontSize: 10,
              color: d.sc.points === 2 ? "#00ff88" : d.sc.points === 1 ? "#ffdd00" : "#ffffff30"
            }, children: d.sc.points === 2 ? "🎯" : d.sc.points === 1 ? "✓" : "✗" })
          ] }, p2);
        })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: 8, display: "flex", flexWrap: "wrap", gap: "3px 8px" }, children: events.map((ev, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: "2px 7px",
          background: hovIdx === i ? "#ffffff12" : "#ffffff06",
          borderRadius: 5,
          cursor: "pointer",
          border: `1px solid ${hovIdx === i ? "#ffffff22" : "transparent"}`,
          transition: "all .12s"
        },
        onMouseEnter: () => setHovIdx(i),
        onMouseLeave: () => setHovIdx(null),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 9, fontWeight: 800, color: "#ffffff35" }, children: i + 1 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 9, fontWeight: 600, color: "#ffffff55" }, children: ev.label })
        ]
      },
      i
    )) }),
    final && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      marginTop: 10,
      padding: "10px 12px",
      background: "#0d0f14",
      borderRadius: 10,
      border: "1px solid #ffffff08"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        fontSize: 9,
        fontWeight: 700,
        color: "#ffffff30",
        letterSpacing: ".08em",
        textTransform: "uppercase",
        marginBottom: 8
      }, children: "ΤΡΕΧΟΥΣΑ ΚΑΤΑΣΤΑΣΗ" }),
      gaps.map((p2, rank) => {
        const maxP = final[gaps[0]], pct = maxP > 0 ? final[p2] / maxP * 100 : 0;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
            fontSize: 11,
            fontWeight: 700,
            color: ["#ffdd00", "#aaa", "#cd7f32"][rank],
            width: 14,
            textAlign: "center"
          }, children: rank + 1 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, fontWeight: 700, color: PC$1[p2].color, width: 90, flexShrink: 0 }, children: PLAYER_NAMES[p2] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, height: 5, background: "#ffffff08", borderRadius: 3 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            height: "100%",
            width: `${pct}%`,
            background: PC$1[p2].color,
            borderRadius: 3,
            boxShadow: `0 0 6px ${PC$1[p2].glow}`,
            transition: "width 1s ease"
          } }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
            fontSize: 13,
            fontWeight: 900,
            color: PC$1[p2].color,
            width: 22,
            textAlign: "right",
            fontVariantNumeric: "tabular-nums"
          }, children: final[p2] }),
          rank > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: {
            fontSize: 10,
            color: "#ff4d6d",
            fontWeight: 700,
            width: 22,
            flexShrink: 0
          }, children: [
            "-",
            final[gaps[0]] - final[p2]
          ] })
        ] }, p2);
      }),
      (() => {
        const d01 = final[gaps[0]] - final[gaps[1]];
        if (d01 === 0) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          fontSize: 11,
          fontWeight: 700,
          color: "#ffdd00",
          textAlign: "center",
          marginTop: 6
        }, children: "🔥 ΙΣΟΒΑΘΜΟΙ ΣΤΗΝ ΚΟΡΥΦΗ!" });
        if (d01 === 1) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          fontSize: 11,
          fontWeight: 700,
          color: "#ff6b35",
          textAlign: "center",
          marginTop: 6
        }, children: "⚡ Μόνο 1 πόντος! To burger παίζει!" });
        if (progress > 0.5 && d01 <= 3) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          fontSize: 11,
          fontWeight: 700,
          color: "#4d9fff",
          textAlign: "center",
          marginTop: 6
        }, children: "🍔 Μέση σεζόν — ακόμα όλα ανοιχτά!" });
        return null;
      })()
    ] })
  ] });
}
const BG$2 = "#08090d", SURF$2 = "#111318", LINE$2 = "rgba(255,255,255,.1)";
const GREEN$2 = "#00ff88", GOLD$1 = "#ffdd00", BLUE$1 = "#4d9fff", RED$2 = "#ff2244", ORA = "#ff6b35";
const MUTED$2 = "rgba(255,255,255,.4)", TEXT$1 = "rgba(255,255,255,.92)";
const Section = ({ emoji, title, children, accent }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: SURF$2, border: `1px solid ${accent || LINE$2}`, borderRadius: 14, padding: "18px 16px", marginBottom: 12 }, children: [
  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 14, paddingBottom: 12, borderBottom: `1px solid ${LINE$2}` }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 24 }, children: emoji }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 15, fontWeight: 800, color: accent || TEXT$1, letterSpacing: "-.01em" }, children: title })
  ] }),
  children
] });
const Rule = ({ n: n2, text, sub }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 12, marginBottom: 10 }, children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 24, height: 24, borderRadius: "50%", background: GREEN$2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: "#08090d", flexShrink: 0, marginTop: 1 }, children: n2 }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 13, fontWeight: 600, color: TEXT$1, lineHeight: 1.4 }, children: text }),
    sub && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: MUTED$2, marginTop: 3, lineHeight: 1.4 }, children: sub })
  ] })
] });
function Guide({ onBack }) {
  const [tab, setTab] = reactExports.useState("rules");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: BG$2, minHeight: "100vh", fontFamily: "'Space Grotesk',system-ui,sans-serif", color: TEXT$1, maxWidth: 480, margin: "0 auto" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "#0a0b0f", padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, borderBottom: `1px solid ${LINE$2}`, position: "sticky", top: 0, zIndex: 10 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onBack, style: { background: "none", border: "none", cursor: "pointer", color: MUTED$2, fontSize: 20, display: "flex", alignItems: "center", padding: 4 }, children: "←" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 16, fontWeight: 800, color: TEXT$1 }, children: "Οδηγός & Κανόνες" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, color: MUTED$2, fontWeight: 600 }, children: "ΚΟΥΒΑΔΕΙΡΟΣ 2026/27" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 6, padding: "12px 16px 0", borderBottom: `1px solid ${LINE$2}` }, children: [{ id: "rules", l: "📋 Κανόνες" }, { id: "scoring", l: "🏆 Βαθμολογία" }, { id: "howto", l: "📱 Πώς παίζω" }, { id: "whatsapp", l: "💬 WhatsApp" }].map((t2) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setTab(t2.id), style: { fontSize: 11, fontWeight: 700, padding: "7px 12px", borderRadius: "8px 8px 0 0", border: `1px solid ${tab === t2.id ? LINE$2 : "transparent"}`, borderBottom: "none", background: tab === t2.id ? SURF$2 : "transparent", color: tab === t2.id ? TEXT$1 : MUTED$2, cursor: "pointer", whiteSpace: "nowrap" }, children: t2.l }, t2.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "16px 16px 80px" }, children: [
      tab === "rules" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { emoji: "⚽", title: "Τι είναι το Κουβαδέιρος;", accent: GREEN$2, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 13, color: MUTED$2, lineHeight: 1.7 }, children: [
          "Το ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { color: TEXT$1 }, children: "Κουβαδέιρος" }),
          " είναι ιδιωτικό πρωτάθλημα προβλέψεων μεταξύ των παικτών της CareDirect FC. Κάθε παίκτης προβλέπει το αποτέλεσμα των αγώνων των ελληνικών ομάδων σε Super League και UEFA, μαζεύει πόντους και ο καλύτερος προβλεψιολόγος της σεζόν κερδίζει αιώνια δόξα (και μάλλον ένα ποτό)."
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { emoji: "📅", title: "Ποιοι αγώνες βαθμολογούνται;", accent: GOLD$1, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Rule, { n: "1", text: "Super League Greece 2026/27", sub: "Όλοι οι αγώνες της κανονικής σεζόν — 7 ομάδες ανά αγωνιστική" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Rule, { n: "2", text: "UEFA — Ελληνικές ομάδες", sub: "AEK (UCL), Ολυμπιακός (UCL), ΠΑΟΚ (UEL), ΠΑΟ (UECL) — όλα τα ματς" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Rule, { n: "3", text: "Αγώνες δύο σκελών (Legs)", sub: "Κάθε σκέλος βαθμολογείται ξεχωριστά" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { emoji: "🔒", title: "Προθεσμία Πρόβλεψης", accent: RED$2, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(255,34,68,.08)", border: `1px solid rgba(255,34,68,.2)`, borderRadius: 10, padding: "12px 14px", marginBottom: 10 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 13, fontWeight: 700, color: RED$2, marginBottom: 6 }, children: "⚠️ Κλείδωμα 1 λεπτό πριν την εκκίνηση" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, color: MUTED$2, lineHeight: 1.6 }, children: "Μόλις ξεκινήσει ο αγώνας, δεν μπορείς να αλλάξεις ή να εισάγεις πρόβλεψη. Κάνε τις προβλέψεις σου εγκαίρως!" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 12, color: MUTED$2, lineHeight: 1.6 }, children: [
            "💡 ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { color: TEXT$1 }, children: "Tip:" }),
            " Θα λάβεις WhatsApp υπενθύμιση 10 λεπτά πριν κάθε αγώνα για τον οποίο δεν έχεις κάνει πρόβλεψη."
          ] })
        ] })
      ] }),
      tab === "scoring" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { emoji: "🎯", title: "Σύστημα Βαθμολόγησης", accent: GREEN$2, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(0,255,136,.06)", border: `1px solid rgba(0,255,136,.2)`, borderRadius: 10, padding: "12px 14px", marginBottom: 14 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${LINE$2}` }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 13, fontWeight: 700, color: TEXT$1 }, children: "🎯 Ακριβές σκορ" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: MUTED$2, marginTop: 2 }, children: "π.χ. προέβλεψες 2–1, έγινε 2–1" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 22, fontWeight: 900, color: GREEN$2 }, children: "+2p" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${LINE$2}` }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 13, fontWeight: 700, color: TEXT$1 }, children: "✓ Σωστό αποτέλεσμα" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: MUTED$2, marginTop: 2 }, children: "Νίκη/Ισοπαλία/Ήττα — χωρίς ακριβές σκορ" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 22, fontWeight: 900, color: GOLD$1 }, children: "+1p" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 13, fontWeight: 700, color: TEXT$1 }, children: "✗ Λάθος αποτέλεσμα" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: MUTED$2, marginTop: 2 }, children: "Δεν βρήκες ούτε το αποτέλεσμα" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 22, fontWeight: 900, color: MUTED$2 }, children: "0p" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, fontWeight: 700, color: MUTED$2, letterSpacing: ".07em", textTransform: "uppercase", marginBottom: 10 }, children: "BONUS UEFA — Αγώνες Ρήτρα" }),
          [
            { l: "🔑 Πρόκριση (ποιος προκρίνεται)", v: "+1p", c: BLUE$1 },
            { l: "⏱ Παρατάσεις — σωστό αποτέλεσμα AET", v: "+1p", c: GOLD$1 },
            { l: "⏱ Παρατάσεις — ακριβές σκορ AET", v: "+1p", c: GOLD$1 },
            { l: "⚽ Πέναλτι — σωστό αποτέλεσμα", v: "+1p", c: ORA },
            { l: "⚽ Πέναλτι — ακριβές σκορ (π.χ. 4–3)", v: "+1p", c: ORA }
          ].map((r2, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid rgba(255,255,255,.05)` }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12, color: MUTED$2 }, children: r2.l }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 13, fontWeight: 800, color: r2.c }, children: r2.v })
          ] }, i))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { emoji: "📊", title: "Παραδείγματα", accent: BLUE$1, children: [
          { match: "ΠΑΟΚ vs Dynamo", pred: "2–0", actual: "2–0", pts: 2, label: "Ακριβές σκορ! 🎯" },
          { match: "ΠΑΟ vs Paksi", pred: "0–1", actual: "1–2", pts: 1, label: "Σωστό αποτέλεσμα ✓" },
          { match: "ΟΛΥ vs NEC", pred: "3–0", actual: "0–1", pts: 0, label: "Λάθος ✗" }
        ].map((ex, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(255,255,255,.04)", borderRadius: 10, padding: "10px 12px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, fontWeight: 700, color: TEXT$1 }, children: ex.match }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 11, color: MUTED$2, marginTop: 2 }, children: [
              "Πρόβλεψη: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { color: TEXT$1 }, children: ex.pred }),
              " · Αποτ.: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { color: TEXT$1 }, children: ex.actual })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: MUTED$2, marginTop: 1 }, children: ex.label })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 22, fontWeight: 900, color: ex.pts === 2 ? GREEN$2 : ex.pts === 1 ? GOLD$1 : MUTED$2 }, children: [
            ex.pts,
            "p"
          ] })
        ] }, i)) })
      ] }),
      tab === "howto" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { emoji: "📱", title: "Πώς κάνω πρόβλεψη;", accent: GREEN$2, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Rule, { n: "1", text: 'Πήγαινε στην καρτέλα "Predict"', sub: "Βλέπεις όλους τους επερχόμενους αγώνες σε χρονολογική σειρά" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Rule, { n: "2", text: "Επίλεξε το σκορ που προβλέπεις", sub: "Χρησιμοποίησε τα +/– κουμπιά για γκολ Γηπεδούχου και Φιλοξενούμενου" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Rule, { n: "3", text: "UEFA: επίλεξε ποιος προκρίνεται", sub: "Εμφανίζεται μπλε κουτί με dropdown — +1 πόντος εάν βρεις σωστά" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Rule, { n: "4", text: "UEFA Leg 2: πρόβλεψη παράτασης/πέναλτι", sub: "Τσέκαρε τα κουτάκια ΑΕΤ & Pen αν πιστεύεις ότι θα χρειαστούν" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Rule, { n: "5", text: 'Πάτα "Αποθήκευσε πρόβλεψη"', sub: "Πράσινο κουμπί στο κάτω μέρος. Μπορείς να αλλάξεις μέχρι 1 λεπτό πριν τον αγώνα" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { emoji: "🏆", title: "Πώς βλέπω την κατάταξη;", accent: GOLD$1, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Rule, { n: "1", text: 'Καρτέλα "League" → "Standings"', sub: "Βλέπεις τη συνολική κατάταξη και τους πόντους ανά τουρνουά" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Rule, { n: "2", text: 'Καρτέλα "League" → "🌶️ Rivalry"', sub: "Συγκριτικά στατιστικά: H2H, Oracle, Maverick, Consensus, Free-for-all" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Rule, { n: "3", text: "Γράφημα Εξέλιξης", sub: "Στην καρτέλα Αγώνες — κύλα για να δεις πώς εξελίσσεται ο αγώνας" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { emoji: "⚙️", title: "Admin (Boikos only)", accent: RED$2, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Rule, { n: "1", text: "Update Score", sub: "Πάτα για αυτόματη ανανέωση σκορ από live πηγές" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Rule, { n: "2", text: "Push Result", sub: "Εισάγαι χειροκίνητα το αποτέλεσμα (συμπεριλαμβανομένων AET & Pen)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Rule, { n: "3", text: "Προσθήκη Παίκτη", sub: "Μπορείς να προσθέσεις νέους παίκτες από τις Ρυθμίσεις (εικονίδιο ⚙️)" })
        ] })
      ] }),
      tab === "whatsapp" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { emoji: "💬", title: "WhatsApp Υπενθυμίσεις", accent: GREEN$2, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(0,255,136,.06)", border: `1px solid rgba(0,255,136,.2)`, borderRadius: 10, padding: "14px", marginBottom: 14 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 13, fontWeight: 700, color: GREEN$2, marginBottom: 8 }, children: "Πότε στέλνουμε μήνυμα;" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 12, color: MUTED$2, lineHeight: 1.7 }, children: [
              "Αν ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { color: TEXT$1 }, children: "δεν έχεις κάνει πρόβλεψη" }),
              " για κάποιον αγώνα, λαμβάνεις αυτόματο WhatsApp μήνυμα ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { color: TEXT$1 }, children: "10 λεπτά πριν" }),
              " την εκκίνηση."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, fontWeight: 700, color: MUTED$2, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 10 }, children: "Μορφή μηνύματος" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "#0d0f14", borderRadius: 10, padding: "14px", fontFamily: "monospace", fontSize: 12, lineHeight: 1.8, color: TEXT$1, border: `1px solid ${LINE$2}`, marginBottom: 14 }, children: [
            "⚽ KOUVADEIROS — Υπενθύμιση",
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            "Δεν έχεις κάνει πρόβλεψη για:",
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { color: GREEN$2 }, children: "ΠΑΟΚ vs Dynamo Kyiv" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            "UEL Q2 Leg 2 · σε ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { color: RED$2 }, children: "8 λεπτά" }),
            " 🔒",
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            "Απάντα:",
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { color: GOLD$1 }, children: "PRED [match-id] [σκορ] [πρόκριση]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            "Παράδειγμα:",
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: BLUE$1 }, children: "PRED uel-paok-2 2-0 PAOK" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 12, color: MUTED$2, lineHeight: 1.7 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { color: TEXT$1 }, children: "Match ID" }),
            " = ο κωδικός στο μήνυμα",
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { color: TEXT$1 }, children: "Σκορ" }),
            " = Γκολ Γηπεδούχου–Φιλοξενούμενου",
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { color: TEXT$1 }, children: "Πρόκριση" }),
            " = μόνο για UEFA (π.χ. PAOK ή DYN)",
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {})
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { emoji: "📲", title: "Ενεργοποίηση WhatsApp", accent: BLUE$1, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Rule, { n: "1", text: "Αποθήκευσε τον αριθμό σου", sub: "Κατά τη σύνδεση ζητήθηκε ο αριθμός κινητού σου. Αν τον παρέλειψες, μπορείς να τον εισάγεις από τις Ρυθμίσεις." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Rule, { n: "2", text: "Αποδέξου το πρώτο μήνυμα", sub: "Πρέπει να στείλεις 'join kouv' στο Twilio sandbox αριθμό για να ενεργοποιηθείς (sandbox mode)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Rule, { n: "3", text: "Απαντήσεις μέσω WhatsApp", sub: "Μπορείς να κάνεις πρόβλεψη απαντώντας απευθείας στο μήνυμα — αποθηκεύεται αυτόματα στην εφαρμογή" })
        ] })
      ] })
    ] })
  ] });
}
const BG$1 = "#08090d", SURF$1 = "#111318", SURF2 = "#0d0f14", LINE$1 = "rgba(255,255,255,.08)";
const MUTED$1 = "rgba(255,255,255,.4)", DIM = "rgba(255,255,255,.22)", TEXT = "rgba(255,255,255,.92)";
const GREEN$1 = "#00ff88", GOLD = "#ffdd00", RED$1 = "#ff4d6d", BLUE = "#4d9fff";
const PC = {
  boikos: { p: "#ff2244", bg: "rgba(255,34,68,.15)", b: "rgba(255,34,68,.35)" },
  mavromichalis: { p: "#4d9fff", bg: "rgba(77,159,255,.12)", b: "rgba(77,159,255,.3)" },
  chousiadas: { p: "#ff6b35", bg: "rgba(255,107,53,.12)", b: "rgba(255,107,53,.3)" }
};
const ODDS = {
  "uel-paok-1": { h: 3.1, d: 3.3, a: 2.1 },
  "uel-paok-2": { h: 2, d: 3.4, a: 3.5 },
  "uecl-pao-1": { h: 4.2, d: 3.5, a: 1.7 },
  "uecl-pao-2": { h: 1.6, d: 3.6, a: 5 },
  "ucl-oly-1": { h: 1.9, d: 3.4, a: 3.8 },
  "ucl-oly-2": { h: 2.8, d: 3.3, a: 2.4 },
  "ucl-aek-1": { h: 2.1, d: 3.4, a: 3.2 },
  "ucl-aek-2": { h: 2.8, d: 3.3, a: 2.4 },
  "sl-1-1": { h: 1.7, d: 3.5, a: 5 },
  "sl-1-2": { h: 2.4, d: 3.2, a: 2.8 },
  "sl-1-3": { h: 1.4, d: 4.2, a: 7.5 },
  "sl-1-4": { h: 1.5, d: 3.8, a: 6.5 },
  "sl-1-5": { h: 2.2, d: 3.3, a: 3.1 },
  "sl-1-6": { h: 1.6, d: 3.5, a: 5.5 },
  "sl-1-7": { h: 2, d: 3.4, a: 3.6 }
};
const SEEDED_PREDS = {
  "uel-paok-1": { boikos: { h: 2, a: 1, qual: "DYN" }, mavromichalis: { h: 0, a: 0, qual: "DYN" }, chousiadas: { h: 2, a: 1, qual: "DYN" } },
  "uecl-pao-1": { boikos: { h: 0, a: 3, qual: "PAO" }, mavromichalis: { h: 0, a: 1, qual: "PAO" }, chousiadas: { h: 1, a: 2, qual: "PAO" } }
};
const SEEDED_RES = { "uel-paok-1": { h: 2, a: 3 }, "uecl-pao-1": { h: 1, a: 2 } };
function isUEFATie(id2) {
  return UEFA_FIXTURES.some((f2) => f2.id === id2);
}
function FetchBtn({ matchId, onFetched }) {
  const [st, setSt] = reactExports.useState("idle");
  async function go() {
    setSt("loading");
    try {
      const r2 = await api.fetchScores(matchId);
      if (r2.ok) {
        setSt(r2.final === false ? "live" : "done");
        onFetched == null ? void 0 : onFetched();
      } else setSt("pending");
    } catch {
      setSt("error");
    }
  }
  const cfg = {
    idle: { bg: "rgba(77,159,255,.12)", c: BLUE, b: "rgba(77,159,255,.3)", i: "ti-world-search", l: "Update Score" },
    loading: { bg: "rgba(255,255,255,.06)", c: MUTED$1, b: LINE$1, i: "ti-loader-2", l: "..." },
    done: { bg: "rgba(0,255,136,.12)", c: GREEN$1, b: "rgba(0,255,136,.3)", i: "ti-check", l: "Updated ✓" },
    pending: { bg: "rgba(255,221,0,.12)", c: GOLD, b: "rgba(255,221,0,.3)", i: "ti-clock", l: "Not yet" },
    live: { bg: "rgba(0,255,136,.08)", c: GREEN$1, b: "rgba(0,255,136,.25)", i: "ti-live-photo", l: "Live ✓" },
    error: { bg: "rgba(255,77,109,.12)", c: RED$1, b: "rgba(255,77,109,.3)", i: "ti-alert-circle", l: "Error" }
  }[st] || { bg: "rgba(255,255,255,.06)", c: MUTED$1, b: LINE$1, i: "ti-check", l: "OK" };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: go, disabled: st === "loading" || st === "done", style: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "8px 10px", borderRadius: 8, border: `1px solid ${cfg.b}`, background: cfg.bg, color: cfg.c, fontSize: 11, fontWeight: 700, cursor: "pointer", letterSpacing: ".02em" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: `ti ${cfg.i}`, style: { fontSize: 13, animation: st === "loading" ? "spin .7s linear infinite" : void 0 } }),
    cfg.l
  ] });
}
function PushPanel({ match, result, onSaved }) {
  const [lh2, setLh] = reactExports.useState(0), [la2, setLa] = reactExports.useState(0), [lmin, setLmin] = reactExports.useState(0);
  const [lsaving, setLsaving] = reactExports.useState(false), [lsaved, setLsaved] = reactExports.useState(false);
  const [h, setH] = reactExports.useState((result == null ? void 0 : result.h) ?? 0), [a, setA] = reactExports.useState((result == null ? void 0 : result.a) ?? 0);
  const [ot, setOt] = reactExports.useState(false), [otH, setOtH] = reactExports.useState(0), [otA, setOtA] = reactExports.useState(0);
  const [pen, setPen] = reactExports.useState(false), [penH, setPenH] = reactExports.useState(0), [penA, setPenA] = reactExports.useState(0);
  const [saving, setSaving] = reactExports.useState(false), [saved, setSaved] = reactExports.useState(false);
  const adj = (v2, set, d) => set(Math.max(0, Math.min(9, v2 + d)));
  const nb2 = { background: SURF2, border: `1px solid ${LINE$1}`, borderRadius: 9, width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, fontVariantNumeric: "tabular-nums" };
  const ab2 = (w2 = 30) => ({ width: w2, height: w2, borderRadius: 7, border: `1px solid ${LINE$1}`, background: "rgba(255,255,255,.06)", color: TEXT, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" });
  const NumRow = ({ label, hv, setHv, av, setAv }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 10 }, children: [
    label && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, fontWeight: 700, color: MUTED$1, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 6 }, children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 6 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 5, justifyContent: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: ab2(), onClick: () => adj(hv, setHv, -1), children: "–" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: nb2, children: hv }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: ab2(), onClick: () => adj(hv, setHv, 1), children: "+" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 16, color: DIM, textAlign: "center" }, children: "–" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 5, justifyContent: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: ab2(), onClick: () => adj(av, setAv, -1), children: "–" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: nb2, children: av }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: ab2(), onClick: () => adj(av, setAv, 1), children: "+" })
      ] })
    ] })
  ] });
  async function save() {
    setSaving(true);
    try {
      await api.saveResult(match.id, h, a, ot, otH, otA, pen, penH, penA);
      setSaved(true);
      setTimeout(() => setSaved(false), 2e3);
      onSaved == null ? void 0 : onSaved();
    } catch {
    } finally {
      setSaving(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: SURF2, borderRadius: 10, padding: "14px", marginTop: 8, border: `1px solid ${LINE$1}` }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: MUTED$1, marginBottom: 12 }, children: "Εισαγωγή Αποτελέσματος" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(NumRow, { label: "90'", hv: h, setHv: setH, av: a, setAv: setA }),
    match.leg === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { style: { display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", color: GOLD, marginBottom: ot ? 10 : 0, marginTop: 6 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: ot, onChange: (e) => setOt(e.target.checked), style: { width: 15, height: 15, accentColor: GOLD } }),
        "⏱ Παρατάσεις (AET)"
      ] }),
      ot && /* @__PURE__ */ jsxRuntimeExports.jsx(NumRow, { label: "Σκορ AET", hv: otH, setHv: setOtH, av: otA, setAv: setOtA }),
      ot && /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { style: { display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", color: GREEN$1, marginTop: 4, marginBottom: pen ? 10 : 0 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: pen, onChange: (e) => setPen(e.target.checked), style: { width: 15, height: 15, accentColor: GREEN$1 } }),
        "⚽ Πέναλτι"
      ] }),
      ot && pen && /* @__PURE__ */ jsxRuntimeExports.jsx(NumRow, { label: "Σκορ Pen", hv: penH, setHv: setPenH, av: penA, setAv: setPenA })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: save, disabled: saving || saved, style: { width: "100%", padding: "10px", borderRadius: 9, border: "none", background: saved ? GREEN$1 : "rgba(26,92,56,.9)", color: saved ? SURF$1 : "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, marginTop: 10, transition: "all .2s" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: `ti ${saved ? "ti-check" : saving ? "ti-loader-2" : "ti-send"}`, style: { fontSize: 15, animation: saving ? "spin .7s linear infinite" : void 0 } }),
      saved ? "Αποθηκεύτηκε!" : saving ? "Αποστολή…" : "Push Result"
    ] })
  ] });
}
function OddsRow({ matchId }) {
  const odds = ODDS[matchId];
  if (!odds) return null;
  const best = Math.max(odds.h, odds.d, odds.a);
  const pill = (label, val) => {
    const hot = val === best;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, textAlign: "center", background: hot ? "rgba(0,255,136,.1)" : "rgba(255,255,255,.04)", borderRadius: 8, padding: "6px 4px", border: `1px solid ${hot ? "rgba(0,255,136,.3)" : LINE$1}` }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 9, fontWeight: 700, color: MUTED$1, letterSpacing: ".05em", marginBottom: 3 }, children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 14, fontWeight: 800, color: hot ? GREEN$1 : TEXT, fontVariantNumeric: "tabular-nums" }, children: val.toFixed(2) })
    ] });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 8 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 9, fontWeight: 700, color: DIM, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 5 }, children: "Αποδόσεις" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 5 }, children: [
      pill("1 (Γηπεδ.)", odds.h),
      pill("X (Ισοπαλία)", odds.d),
      pill("2 (Φιλοξ.)", odds.a)
    ] })
  ] });
}
function RivalryStats({ predictions, results, thavmaStats }) {
  try {
    const played = ALL_FIXTURES.filter((m2) => (results == null ? void 0 : results[m2.id]) != null);
    if (!played.length) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: 24, background: SURF$1, borderRadius: 12, border: "1px solid " + LINE$1, textAlign: "center", color: MUTED$1, fontSize: 13 }, children: "Δεν υπάρχουν δεδομένα ακόμα — παίξτε μερικούς αγώνες! 🍔" });
    const oracle = { boikos: 0, mavromichalis: 0, chousiadas: 0 };
    const contrarian = { boikos: 0, mavromichalis: 0, chousiadas: 0 };
    const oneVsTwo = {
      boikos: { wins: 0, losses: 0, draws: 0, battles: 0 },
      mavromichalis: { wins: 0, losses: 0, draws: 0, battles: 0 },
      chousiadas: { wins: 0, losses: 0, draws: 0, battles: 0 }
    };
    let allSame = 0, allSameRight = 0, allDiff = 0;
    const allDiffWins = [0, 0, 0];
    const h2h = {};
    for (let i = 0; i < PLAYERS.length; i++) for (let j = i + 1; j < PLAYERS.length; j++)
      h2h[i + "_" + j] = { wins: [0, 0, 0], diff: 0, names: [PLAYER_NAMES[PLAYERS[i]], PLAYER_NAMES[PLAYERS[j]]], colors: [PC[PLAYERS[i]].p, PC[PLAYERS[j]].p] };
    played.forEach((m2) => {
      const actual = results[m2.id];
      const preds = PLAYERS.map((p2) => {
        var _a;
        return (_a = predictions == null ? void 0 : predictions[m2.id]) == null ? void 0 : _a[p2];
      });
      if (preds.some((p2) => !p2)) return;
      const scores = PLAYERS.map((p2, i) => scoreMatch(preds[i], actual));
      const pts = scores.map((s) => (s == null ? void 0 : s.points) ?? 0);
      const res3 = preds.map((pr) => pr.h > pr.a ? "H" : pr.h < pr.a ? "A" : "D");
      if (new Set(res3).size === 1) {
        allSame++;
        if (pts.some((p2) => p2 > 0)) allSameRight++;
      }
      if (new Set(res3).size === 3) {
        allDiff++;
        pts.forEach((p2, i) => {
          if (p2 > 0) allDiffWins[i]++;
        });
      }
      for (let i = 0; i < PLAYERS.length; i++) for (let j = i + 1; j < PLAYERS.length; j++) {
        const key = i + "_" + j;
        if (res3[i] !== res3[j]) {
          h2h[key].diff++;
          if (pts[i] > pts[j]) h2h[key].wins[0]++;
          else if (pts[j] > pts[i]) h2h[key].wins[1]++;
          else h2h[key].wins[2]++;
        }
      }
      const exactPs = PLAYERS.filter((_, i) => {
        var _a;
        return (_a = scores[i]) == null ? void 0 : _a.exact;
      });
      if (exactPs.length === 1) oracle[exactPs[0]]++;
      PLAYERS.forEach((p2, i) => {
        const others = PLAYERS.filter((_, j) => j !== i);
        const otherPreds = others.map((o) => {
          var _a;
          return (_a = predictions == null ? void 0 : predictions[m2.id]) == null ? void 0 : _a[o];
        });
        const otherRes = otherPreds.map((op) => op ? op.h > op.a ? "H" : op.h < op.a ? "A" : "D" : null);
        if (otherRes[0] && otherRes.every((r2) => r2 === otherRes[0]) && res3[i] !== otherRes[0]) {
          contrarian[p2]++;
          const myPts = pts[i];
          const theirPts = Math.max(...others.map((_, k2) => pts[PLAYERS.indexOf(others[k2])]));
          oneVsTwo[p2].battles++;
          if (myPts > theirPts) oneVsTwo[p2].wins++;
          else if (myPts < theirPts) oneVsTwo[p2].losses++;
          else oneVsTwo[p2].draws++;
        }
      });
    });
    const oLdr = PLAYERS.reduce((a, b) => oracle[a] >= oracle[b] ? a : b);
    const cLdr = PLAYERS.reduce((a, b) => contrarian[a] >= contrarian[b] ? a : b);
    const MiniBar = ({ val, max, color, label }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 8 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 600, marginBottom: 3 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: MUTED$1 }, children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color }, children: [
          max > 0 ? Math.round(val / max * 100) + "%" : "-",
          " (",
          val,
          "/",
          max,
          ")"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 5, background: "rgba(255,255,255,.08)", borderRadius: 3 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: "100%", width: max > 0 ? Math.round(val / max * 100) + "%" : "0%", background: color, borderRadius: 3 } }) })
    ] });
    const Block = ({ title, emoji, children, accent }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: SURF$1, border: "1px solid " + (accent || LINE$1), borderRadius: 12, padding: "14px 16px", marginBottom: 10 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 13, fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 7 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 18 }, children: emoji }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: TEXT }, children: title })
      ] }),
      children
    ] });
    const oneVsTwoConfig = [
      { player: "boikos", title: "Μπόικος vs. Συνεταιράκια", subtitle: "Όταν ο Μπόικος διαφωνεί με Μαυρομιχάλη & Χουσιάδα" },
      { player: "mavromichalis", title: "Μαύρος - Ενάντια στην Λογική", subtitle: "Όταν ο Μαυρομιχάλης διαφωνεί με Μπόικο & Χουσιάδα" },
      { player: "chousiadas", title: "Χουσιάδας vs. Μπαρμπάδες", subtitle: "Όταν ο Χουσιάδας διαφωνεί με Μπόικο & Μαυρομιχάλη" }
    ];
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Block, { title: "⚡ Θαύματα & Ωσάννα — Late Goal Drama", emoji: "🙏", accent: "rgba(255,221,0,.2)", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: MUTED$1, marginBottom: 12 }, children: "Πόντοι που χαρίστηκαν από γκολ μετά το 85'" }),
        PLAYERS.map((p2) => {
          const ts = thavmaStats && thavmaStats[p2] || { benefited: 0, pts_gained: 0, pts_lost: {} };
          const totalLost = Object.values(ts.pts_lost || {}).reduce((a, b) => a + b, 0);
          const pc2 = PC[p2];
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 8, background: "rgba(255,255,255,.03)", borderRadius: 10, padding: "10px 12px", border: "1px solid " + LINE$1 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 8, height: 8, borderRadius: "50%", background: pc2.p } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12, fontWeight: 700, color: TEXT, flex: 1 }, children: PLAYER_NAMES[p2] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 11, color: GREEN$1, fontWeight: 700 }, children: [
                "🍀 ",
                ts.benefited || 0,
                "x +",
                ts.pts_gained || 0,
                "p"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 11, color: RED$1, fontWeight: 700 }, children: [
                "😤 -",
                totalLost,
                "p"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 4, background: "rgba(255,255,255,.06)", borderRadius: 2 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: "100%", width: Math.min(100, (ts.pts_gained || 0) * 25) + "%", background: pc2.p, borderRadius: 2 } }) })
          ] }, p2);
        })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Block, { title: "1 vs 2 — Ο Μοναχικός Λύκος", emoji: "🐺", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: MUTED$1, marginBottom: 12 }, children: "Όταν ένας διαφωνεί με τους άλλους δύο που συμφωνούν μεταξύ τους — ποιος κερδίζει;" }),
        oneVsTwoConfig.map((cfg) => {
          const st = oneVsTwo[cfg.player];
          const pc2 = PC[cfg.player];
          const winPct = st.battles > 0 ? Math.round(st.wins / st.battles * 100) : 0;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(255,255,255,.04)", borderRadius: 12, padding: "12px 14px", marginBottom: 10, border: "1px solid " + pc2.b }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 32, height: 32, borderRadius: "50%", background: pc2.p, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, color: "#08090d" }, children: PLAYER_NAMES[cfg.player][0] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 13, fontWeight: 800, color: pc2.p }, children: cfg.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 9, color: MUTED$1, marginTop: 1 }, children: cfg.subtitle })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "right" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 22, fontWeight: 900, color: winPct >= 50 ? GREEN$1 : RED$1 }, children: [
                  winPct,
                  "%"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 9, color: MUTED$1 }, children: [
                  st.battles,
                  " battles"
                ] })
              ] })
            ] }),
            st.battles > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 8 }, children: [
                { lbl: "Νίκες", val: st.wins, color: GREEN$1 },
                { lbl: "Ισοπαλίες", val: st.draws, color: GOLD },
                { lbl: "Ήττες", val: st.losses, color: RED$1 }
              ].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(255,255,255,.04)", borderRadius: 8, padding: "6px", textAlign: "center" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 18, fontWeight: 900, color: s.color }, children: s.val }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 9, color: MUTED$1, marginTop: 1 }, children: s.lbl })
              ] }, s.lbl)) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 5, background: "rgba(255,255,255,.06)", borderRadius: 3, overflow: "hidden" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: "100%", width: winPct + "%", background: winPct >= 50 ? GREEN$1 : RED$1, borderRadius: 3, transition: "width 1s" } }) })
            ] }),
            st.battles === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: MUTED$1, textAlign: "center", padding: "8px 0" }, children: "Δεν υπάρχουν battles ακόμα" })
          ] }, cfg.player);
        })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Block, { title: "Head to Head — Όταν διαφωνούν", emoji: "⚔️", children: Object.entries(h2h).map(([key, data]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 14 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 10, fontWeight: 700, color: MUTED$1, marginBottom: 7, textTransform: "uppercase" }, children: [
          data.names[0],
          " vs ",
          data.names[1],
          " · ",
          data.diff,
          " battles"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MiniBar, { val: data.wins[0], max: data.diff, color: data.colors[0], label: data.names[0] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MiniBar, { val: data.wins[1], max: data.diff, color: data.colors[1], label: data.names[1] }),
        data.wins[2] > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 10, color: DIM, marginTop: 3 }, children: [
          "Ισόπαλα: ",
          data.wins[2]
        ] })
      ] }, key)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Block, { title: "Consensus — Και οι 3 ίδια", emoji: "🤝", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(255,255,255,.04)", borderRadius: 10, padding: "12px", textAlign: "center" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 28, fontWeight: 900, color: TEXT }, children: allSame }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: MUTED$1, marginTop: 2 }, children: "Φορές συμφώνησαν" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: allSame > 0 && allSameRight === 0 ? "rgba(255,77,109,.1)" : "rgba(0,255,136,.06)", borderRadius: 10, padding: "12px", textAlign: "center" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 28, fontWeight: 900, color: allSame > 0 && allSameRight === 0 ? RED$1 : GREEN$1 }, children: [
              allSame > 0 ? Math.round(allSameRight / allSame * 100) : 0,
              "%"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: MUTED$1, marginTop: 2 }, children: "Ακρίβεια" })
          ] })
        ] }),
        allSame > 0 && allSameRight === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, fontWeight: 700, color: RED$1, textAlign: "center", marginTop: 10 }, children: "💀 Όταν συμφωνούν... πάντα λάθος!" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Block, { title: "Free For All — Όλοι διαφωνούν", emoji: "🔀", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 12, color: MUTED$1, marginBottom: 10 }, children: [
          allDiff,
          " αγώνες · ποιος κερδίζει;"
        ] }),
        PLAYERS.map((p2, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(MiniBar, { val: allDiffWins[i], max: allDiff, color: PC[p2].p, label: PLAYER_NAMES[p2] }, p2))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Block, { title: "The Oracle — Μοναδικό exact score", emoji: "🔮", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 6 }, children: PLAYERS.map((p2) => {
        const isL = oracle[p2] > 0 && p2 === oLdr, pc2 = PC[p2];
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, background: isL ? pc2.bg : "rgba(255,255,255,.04)", border: "1px solid " + (isL ? pc2.b : LINE$1), borderRadius: 10, padding: "12px 8px", textAlign: "center" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, fontWeight: 700, color: isL ? pc2.p : MUTED$1, marginBottom: 4 }, children: PLAYER_NAMES[p2].substring(0, 4).toUpperCase() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 26, fontWeight: 900, color: isL ? pc2.p : MUTED$1 }, children: oracle[p2] }),
          isL && oracle[p2] > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, marginTop: 4 }, children: "🔮" })
        ] }, p2);
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Block, { title: "The Maverick — Διαφώνησε & είχε δίκιο", emoji: "🌶️", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 6 }, children: PLAYERS.map((p2) => {
        const isL = contrarian[p2] > 0 && p2 === cLdr, pc2 = PC[p2];
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, background: isL ? pc2.bg : "rgba(255,255,255,.04)", border: "1px solid " + (isL ? pc2.b : LINE$1), borderRadius: 10, padding: "12px 8px", textAlign: "center" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, fontWeight: 700, color: isL ? pc2.p : MUTED$1, marginBottom: 4 }, children: PLAYER_NAMES[p2].substring(0, 4).toUpperCase() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 26, fontWeight: 900, color: isL ? pc2.p : MUTED$1 }, children: contrarian[p2] }),
          isL && contrarian[p2] > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, marginTop: 4 }, children: "🌶️" })
        ] }, p2);
      }) }) })
    ] });
  } catch (e) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: 24, background: "rgba(255,77,109,.1)", border: "1px solid rgba(255,77,109,.3)", borderRadius: 12, color: RED$1, fontSize: 12, fontWeight: 600 }, children: [
      "❌ Σφάλμα: ",
      e.message
    ] });
  }
}
function HistoryPage({ predictions, results }) {
  const played = [...ALL_FIXTURES].filter((m2) => (results == null ? void 0 : results[m2.id]) != null).sort((a, b) => new Date(b.kickoff) - new Date(a.kickoff));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "16px 16px 80px" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SLbl, { children: [
      "Αποτελέσματα · ",
      played.length,
      " αγώνες"
    ] }),
    !played.length && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", padding: 40, color: MUTED$1, fontSize: 13 }, children: "Δεν υπάρχουν αποτελέσματα ακόμα" }),
    played.map((m2) => {
      var _a, _b;
      const actual = results[m2.id];
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: SURF$1, border: `1px solid ${LINE$1}`, borderRadius: 12, padding: "14px 16px", marginBottom: 10 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TPill, { id: m2.t }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, fontWeight: 600, color: MUTED$1 }, children: grDate(m2.kickoff) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", margin: "10px 0 12px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TeamLogo, { k: m2.home, size: 26 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12, fontWeight: 700 }, children: (_a = TEAMS[m2.home]) == null ? void 0 : _a.name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 20, fontWeight: 900, fontVariantNumeric: "tabular-nums" }, children: [
            actual.h,
            " – ",
            actual.a
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12, fontWeight: 700 }, children: (_b = TEAMS[m2.away]) == null ? void 0 : _b.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TeamLogo, { k: m2.away, size: 26 })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 5 }, children: PLAYERS.map((p2) => {
          var _a2;
          const pred = (_a2 = predictions == null ? void 0 : predictions[m2.id]) == null ? void 0 : _a2[p2], sc2 = pred ? scoreMatch(pred, actual) : null, pc2 = PC[p2];
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, background: (sc2 == null ? void 0 : sc2.exact) ? `${GREEN$1}12` : (sc2 == null ? void 0 : sc2.correct) ? `${GOLD}08` : "rgba(255,255,255,.04)", borderRadius: 9, padding: "8px", textAlign: "center", border: `1px solid ${(sc2 == null ? void 0 : sc2.exact) ? GREEN$1 + "35" : (sc2 == null ? void 0 : sc2.correct) ? GOLD + "20" : LINE$1}` }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, fontWeight: 800, color: pc2.p, marginBottom: 3, letterSpacing: ".04em" }, children: PLAYER_NAMES[p2].substring(0, 4).toUpperCase() }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 13, fontWeight: 800, color: TEXT, fontVariantNumeric: "tabular-nums" }, children: pred ? `${pred.h}–${pred.a}` : "–" }),
            sc2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 11, fontWeight: 700, color: sc2.points === 2 ? GREEN$1 : sc2.points === 1 ? GOLD : DIM, marginTop: 2 }, children: [
              sc2.points === 2 ? "🎯" : sc2.points === 1 ? "✓" : "✗",
              sc2.points,
              "p"
            ] })
          ] }, p2);
        }) })
      ] }, m2.id);
    })
  ] });
}
function BanterPage({ chat, onSend, onRead }) {
  const [txt, setTxt] = reactExports.useState("");
  const ref = reactExports.useRef();
  reactExports.useEffect(() => {
    var _a;
    (_a = ref.current) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
    onRead == null ? void 0 : onRead();
  }, [chat]);
  function send() {
    if (!txt.trim()) return;
    onSend(txt);
    setTxt("");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", height: "calc(100svh - 114px)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "10px 16px", borderBottom: `1px solid ${LINE$1}`, background: "#0a0b0f" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: MUTED$1 }, children: "Kouvadeiros FC · Ιερά Εξέταση" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, padding: "14px 16px", overflowY: "auto", background: BG$1 }, children: [
      (chat || []).map((m2, i) => {
        var _a, _b;
        const pc2 = PC[(_a = m2.p) == null ? void 0 : _a.toLowerCase()] || PC.boikos;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 16, animation: "slide-up .15s ease" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 26, height: 26, borderRadius: "50%", background: pc2.p, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: BG$1 }, children: (_b = m2.p) == null ? void 0 : _b.substring(0, 1).toUpperCase() }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12, fontWeight: 700, color: pc2.p }, children: m2.p }),
            m2.a && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 9, fontWeight: 700, background: `${GOLD}20`, color: GOLD, padding: "1px 6px", borderRadius: 4, letterSpacing: ".04em" }, children: "ADMIN" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, color: DIM, marginLeft: "auto", fontWeight: 600 }, children: m2.ts })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 13, color: TEXT, lineHeight: 1.5, paddingLeft: 34, fontWeight: 500 }, children: m2.t })
        ] }, i);
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "10px 16px", borderTop: `1px solid ${LINE$1}`, display: "flex", gap: 8, background: "#0a0b0f" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          value: txt,
          onChange: (e) => setTxt(e.target.value),
          onKeyDown: (e) => e.key === "Enter" && send(),
          placeholder: "Πες κάτι...",
          style: { flex: 1, background: SURF$1, border: `1px solid ${LINE$1}`, borderRadius: 9, padding: "10px 14px", color: TEXT, fontSize: 13, outline: "none", fontWeight: 500 }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: send, style: { width: 42, height: 42, borderRadius: 9, background: GREEN$1, border: "none", color: BG$1, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, fontWeight: 700 }, children: "↑" })
    ] })
  ] });
}
function AddPlayerModal({ onClose, onAdded }) {
  const [name, setName] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [pass, setPass] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("+30");
  const [saving, setSaving] = reactExports.useState(false);
  const [done, setDone] = reactExports.useState(false);
  const inp = {
    width: "100%",
    padding: "10px 12px",
    background: "#0d0f14",
    border: `1px solid ${LINE$1}`,
    borderRadius: 9,
    color: TEXT,
    fontSize: 13,
    outline: "none",
    fontFamily: "inherit",
    marginBottom: 10
  };
  async function save() {
    if (!name || !email || !pass) {
      return;
    }
    setSaving(true);
    try {
      await api.addPlayer({ name, email, password: pass, phone });
      setDone(true);
      setTimeout(() => {
        onAdded == null ? void 0 : onAdded();
        onClose();
      }, 1200);
    } catch (e) {
      alert("Error: " + e.message);
    } finally {
      setSaving(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,.8)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: SURF$1, border: `1px solid ${LINE$1}`, borderRadius: 16, padding: 24, width: "100%", maxWidth: 380 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 15, fontWeight: 800, color: TEXT }, children: "➕ Νέος Παίκτης" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, style: { background: "none", border: "none", cursor: "pointer", color: MUTED$1, fontSize: 20 }, children: "✕" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: name, onChange: (e) => setName(e.target.value), placeholder: "Όνομα (π.χ. Papadopoulos)", style: inp }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "Email", style: inp }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: pass, onChange: (e) => setPass(e.target.value), placeholder: "Password", style: inp }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: phone, onChange: (e) => setPhone(e.target.value), placeholder: "+30 694 000 0000", style: inp }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: save, disabled: saving || done, style: {
      width: "100%",
      padding: 12,
      borderRadius: 10,
      border: "none",
      background: done ? "#00ff88" : saving ? "#ffffff15" : "#1a5c38",
      color: done ? "#08090d" : "#fff",
      fontSize: 14,
      fontWeight: 700,
      cursor: "pointer",
      marginTop: 4
    }, children: done ? "✓ Προστέθηκε!" : saving ? "Αποθήκευση…" : "Προσθήκη Παίκτη" })
  ] }) });
}
function LeaderSidebar({ predictions, results, compact }) {
  const board = computeLeaderboard(ALL_FIXTURES, predictions, results);
  const maxPts = ALL_FIXTURES.filter((m2) => (results == null ? void 0 : results[m2.id]) != null).length * 2;
  if (compact) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 8, marginBottom: 8 }, children: board.map((row, i) => {
    const pc2 = PC[row.player];
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, background: SURF$1, border: `1px solid ${pc2.b}`, borderRadius: 10, padding: "8px 10px", display: "flex", alignItems: "center", gap: 8 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 13, fontWeight: 700 }, children: i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, fontWeight: 700, color: pc2.p, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: PLAYER_NAMES[row.player].substring(0, 5) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 11, fontWeight: 900, color: TEXT }, children: [
          row.pts,
          "p"
        ] })
      ] })
    ] }, row.player);
  }) });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: SURF$1, border: `1px solid ${LINE$1}`, borderRadius: 14, padding: "14px 16px", marginBottom: 16 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: MUTED$1, marginBottom: 12 }, children: "Κατάταξη" }),
      board.map((row, i) => {
        const p2 = PC[row.player];
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: i < board.length - 1 ? 10 : 0 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 18, width: 24, textAlign: "center" }, children: ["🥇", "🥈", "🥉"][i] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 32, height: 32, borderRadius: "50%", background: p2.p, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900, color: "#08090d" }, children: PLAYER_NAMES[row.player].substring(0, 1) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 13, fontWeight: 700, color: TEXT }, children: PLAYER_NAMES[row.player] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 10, color: MUTED$1 }, children: [
              row.exact,
              "🎯 ",
              row.correct,
              "✓"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "right" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 20, fontWeight: 900, color: p2.p, fontVariantNumeric: "tabular-nums" }, children: row.pts }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 9, color: MUTED$1 }, children: [
              "pts",
              maxPts > 0 ? `/${maxPts}` : ""
            ] })
          ] })
        ] }, row.player);
      })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(H2HGraph, { predictions, results })
  ] });
}
const NAV = [
  { id: "matchday", l: "ΠΡΟΒΛΕΨΕΙΣ", icon: "⚽" },
  { id: "schedule", l: "ΠΡΟΓΡΑΜΜΑ", icon: "📅" },
  { id: "league", l: "Διαγωνισμός", icon: "🏆" },
  { id: "history", l: "Ιστορικό", icon: "📋" },
  { id: "banter", l: "ΙΕΡΑ ΕΞΕΤΑΣΗ", icon: "🔥" }
];
function useBreakpoint() {
  const [bp, setBp] = reactExports.useState(() => {
    if (typeof window === "undefined") return "mobile";
    return window.innerWidth >= 1024 ? "desktop" : window.innerWidth >= 768 ? "tablet" : "mobile";
  });
  reactExports.useEffect(() => {
    const fn = () => setBp(window.innerWidth >= 1024 ? "desktop" : window.innerWidth >= 768 ? "tablet" : "mobile");
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return bp;
}
function App({ user, onLogout }) {
  const [screen, setScreen] = reactExports.useState("matchday");
  const [state, setState] = reactExports.useState({ predictions: { ...SEEDED_PREDS }, results: { ...SEEDED_RES }, chat: [], slStandings: [] });
  const [liveScores, setLiveScores] = reactExports.useState({});
  const [loading, setLoading] = reactExports.useState(true);
  const [syncing, setSyncing] = reactExports.useState(false);
  const [syncOk, setSyncOk] = reactExports.useState(true);
  const [showGuide, setShowGuide] = reactExports.useState(false);
  const [showAddPlayer, setShowAddPlayer] = reactExports.useState(false);
  const poll = reactExports.useRef();
  const bp = useBreakpoint();
  const isDesktop = bp === "desktop";
  const isTablet = bp === "tablet";
  const isMobile = bp === "mobile";
  const load = reactExports.useCallback(async () => {
    try {
      const s = await api.getState();
      const live = {};
      Object.entries(s).forEach(([k2, v2]) => {
        if (k2.startsWith("live_") && v2) live[k2.replace("live_", "")] = v2;
      });
      if (Object.keys(live).length > 0) setLiveScores(live);
      setState({
        ...s,
        predictions: {
          ...SEEDED_PREDS,
          ...s.predictions,
          ...Object.fromEntries(Object.keys({ ...SEEDED_PREDS, ...s.predictions }).map((mid) => [mid, { ...SEEDED_PREDS[mid] || {}, ...s.predictions[mid] || {} }]))
        },
        results: { ...SEEDED_RES, ...s.results }
      });
      setSyncOk(true);
      api.getSlStandings().then((d) => {
        var _a;
        if ((_a = d == null ? void 0 : d.teams) == null ? void 0 : _a.length) setState((prev) => ({ ...prev, slStandings: d.teams }));
      }).catch(() => {
      });
    } catch {
      setSyncOk(false);
    } finally {
      setLoading(false);
    }
  }, []);
  reactExports.useEffect(() => {
    load();
    poll.current = setInterval(() => {
      const now = Date.now();
      const anyLive = ALL_FIXTURES.some((m2) => {
        const ko = new Date(m2.kickoff).getTime();
        const minsAfter = (now - ko) / 6e4;
        return minsAfter >= 0 && minsAfter <= 120;
      });
      load();
      clearInterval(poll.current);
      poll.current = setInterval(load, anyLive ? 5e3 : 15e3);
    }, 15e3);
    return () => clearInterval(poll.current);
  }, [load]);
  async function savePrediction(matchId, h, a, qual, predOT, otH, otA, predPen, penH, penA) {
    setSyncing(true);
    try {
      await api.savePred(matchId, h, a, qual, predOT, otH, otA, predPen, penH, penA);
      setState((prev) => ({ ...prev, predictions: { ...prev.predictions, [matchId]: { ...prev.predictions[matchId] || {}, [user.id]: { h, a, qual, predOT, otH, otA, predPen, penH, penA } } } }));
      setSyncOk(true);
    } catch {
      setSyncOk(false);
      throw new Error("Save failed");
    } finally {
      setSyncing(false);
    }
  }
  async function sendChat(text) {
    const msg = { p: user.name, t: text, ts: nowGR(), a: user.id === "boikos" };
    setState((prev) => ({ ...prev, chat: [...prev.chat || [], msg] }));
    try {
      await api.sendChat(text);
    } catch {
    }
  }
  async function handleLogout() {
    await api.logout();
    clearAuth();
    onLogout();
  }
  if (showGuide) return /* @__PURE__ */ jsxRuntimeExports.jsx(Guide, { onBack: () => setShowGuide(false) });
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { minHeight: "100vh", background: BG$1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 24, fontWeight: 800, letterSpacing: ".06em", color: GREEN$1 }, children: "ΚΟΥΒΑΔΕΪΡΟΣ" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 28 })
  ] });
  const pc2 = PC[user.id] || PC.boikos;
  const pages = {
    matchday: /* @__PURE__ */ jsxRuntimeExports.jsx(MatchdayPage, { predictions: state.predictions, results: state.results, onRefresh: load, currentUser: user, revealed: state.revealed, onSave: savePrediction, liveScores, slStandings: state.slStandings }),
    league: /* @__PURE__ */ jsxRuntimeExports.jsx(LeaguePage, { predictions: state.predictions, results: state.results, thavmaStats: state.thavmaStats }),
    schedule: /* @__PURE__ */ jsxRuntimeExports.jsx(SchedulePage, { slStandings: state.slStandings }),
    history: /* @__PURE__ */ jsxRuntimeExports.jsx(HistoryPage, { predictions: state.predictions, results: state.results }),
    banter: /* @__PURE__ */ jsxRuntimeExports.jsx(BanterPage, { chat: state.chat, onSend: sendChat })
  };
  const Header = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    background: "#0a0b0f",
    borderBottom: `1px solid ${LINE$1}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: isDesktop ? "0 32px" : "0 16px",
    height: isDesktop ? 56 : 48,
    position: "sticky",
    top: 0,
    zIndex: 20,
    flexShrink: 0
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: isDesktop ? 18 : 15, fontWeight: 800, letterSpacing: "-.01em", color: TEXT }, children: "ΚΟΥΒΑΔΕΪΡΟΣ" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 9, fontWeight: 700, letterSpacing: ".08em", color: GREEN$1, background: `${GREEN$1}18`, border: `1px solid ${GREEN$1}35`, borderRadius: 4, padding: "2px 6px" }, children: "26/27" })
    ] }),
    isDesktop && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 4 }, children: NAV.map((navItem) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setScreen(navItem.id), style: {
      display: "flex",
      alignItems: "center",
      gap: 7,
      padding: "8px 14px",
      borderRadius: 8,
      border: "none",
      background: screen === navItem.id ? "rgba(255,255,255,.1)" : "transparent",
      color: screen === navItem.id ? TEXT : MUTED$1,
      cursor: "pointer",
      fontSize: 13,
      fontWeight: 600,
      borderBottom: screen === navItem.id ? `2px solid ${GREEN$1}` : "2px solid transparent",
      transition: "all .15s"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: navItem.icon }),
      navItem.l
    ] }, navItem.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: isDesktop ? 12 : 8 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 7, height: 7, borderRadius: "50%", background: syncOk ? GREEN$1 : RED$1, animation: syncing ? "pulse-d .7s infinite" : void 0 } }),
      (user == null ? void 0 : user.role) === "admin" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setShowAddPlayer(true),
          title: "Προσθήκη παίκτη",
          style: { background: "none", border: "none", cursor: "pointer", color: MUTED$1, display: "flex", alignItems: "center", padding: "4px 6px", borderRadius: 8, fontSize: isDesktop ? 16 : 14 },
          children: "➕"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setShowGuide(true),
          title: "Οδηγός & Κανόνες",
          style: { background: "none", border: "none", cursor: "pointer", color: MUTED$1, display: "flex", alignItems: "center", padding: "4px 6px", borderRadius: 8, fontSize: isDesktop ? 17 : 15 },
          children: "ℹ️"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 7 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          width: isDesktop ? 32 : 26,
          height: isDesktop ? 32 : 26,
          borderRadius: "50%",
          background: pc2.p,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: isDesktop ? 13 : 11,
          fontWeight: 900,
          color: "#08090d"
        }, children: user.name.substring(0, 1) }),
        isDesktop && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12, fontWeight: 700, color: pc2.p }, children: user.name })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleLogout, style: { background: "rgba(255,77,109,.12)", border: "1px solid rgba(255,77,109,.3)", cursor: "pointer", color: "#ff4d6d", display: "flex", alignItems: "center", padding: "5px 10px", borderRadius: 8, fontSize: 12, fontWeight: 700, gap: 4 }, children: [
        "🚪 ",
        isDesktop ? "Έξοδος" : ""
      ] })
    ] })
  ] });
  const BottomNav = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    background: "#0a0b0f",
    borderTop: `1px solid ${LINE$1}`,
    display: "flex",
    justifyContent: "space-around",
    padding: `6px 0 ${isMobile ? "max(8px,env(safe-area-inset-bottom))" : "8px"}`,
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 20
  }, children: [
    NAV.map((navItem) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => setScreen(navItem.id),
        style: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          padding: "3px 8px",
          background: "none",
          border: "none",
          cursor: "pointer",
          minWidth: 44,
          flex: 1
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: isTablet ? 22 : 19, filter: screen === navItem.id ? void 0 : "grayscale(.6) opacity(.5)" }, children: navItem.icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: isTablet ? 10 : 9, fontWeight: 700, letterSpacing: ".04em", color: screen === navItem.id ? GREEN$1 : MUTED$1, textTransform: "uppercase" }, children: navItem.l }),
          screen === navItem.id && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 16, height: 2, background: GREEN$1, borderRadius: 1 } })
        ]
      },
      navItem.id
    )),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: handleLogout,
        style: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          padding: "3px 8px",
          background: "none",
          border: "none",
          cursor: "pointer",
          minWidth: 44,
          flex: 1
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 19 }, children: "🚪" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 9, fontWeight: 700, color: "#ff4d6d", textTransform: "uppercase" }, children: "Έξοδος" })
        ]
      }
    )
  ] });
  if (isDesktop) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", minHeight: "100vh", background: BG$1, fontFamily: "'Space Grotesk',system-ui,sans-serif", color: TEXT }, children: [
      showAddPlayer && (user == null ? void 0 : user.role) === "admin" && /* @__PURE__ */ jsxRuntimeExports.jsx(AddPlayerModal, { onClose: () => setShowAddPlayer(false), onAdded: load }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, display: "grid", gridTemplateColumns: "300px 1fr", maxWidth: 1280, width: "100%", margin: "0 auto", padding: "24px 32px", gap: 24, alignItems: "start" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "sticky", top: 80 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(LeaderSidebar, { predictions: state.predictions, results: state.results }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { minWidth: 0 }, children: pages[screen] })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    background: BG$1,
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    maxWidth: isTablet ? 768 : "100%",
    margin: "0 auto",
    fontFamily: "'Space Grotesk',system-ui,sans-serif",
    color: TEXT
  }, children: [
    showAddPlayer && (user == null ? void 0 : user.role) === "admin" && /* @__PURE__ */ jsxRuntimeExports.jsx(AddPlayerModal, { onClose: () => setShowAddPlayer(false), onAdded: load }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "8px 16px 0" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LeaderSidebar, { predictions: state.predictions, results: state.results, compact: true }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(255,255,255,.03)", borderRadius: 12, padding: "10px 12px", marginTop: 6, border: "1px solid rgba(255,255,255,.08)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "rgba(255,255,255,.4)", marginBottom: 6 }, children: "📈 Εξέλιξη Διαγωνισμού" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(H2HGraph, { predictions: state.predictions, results: state.results })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, overflowY: "auto", paddingBottom: isTablet ? 72 : 64 }, children: pages[screen] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, {})
  ] });
}
function LeaguePage({ predictions, results, thavmaStats }) {
  const board = computeLeaderboard(ALL_FIXTURES, predictions, results);
  const [tab, setTab] = reactExports.useState("standings");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "16px 16px 80px" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 6, marginBottom: 16, overflowX: "auto", scrollbarWidth: "none", msOverflowStyle: "none" }, children: [{ id: "standings", l: "Συγκομιδή" }, { id: "rivalry", l: "🌶️ Διαγκωνισμοί" }, { id: "analytics", l: "Αναλυτικά" }, { id: "campaigns", l: "Ενεργές Διοργανώσεις" }].map((tabItem) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => setTab(tabItem.id),
        style: {
          fontSize: 11,
          fontWeight: 700,
          padding: "6px 13px",
          borderRadius: 7,
          whiteSpace: "nowrap",
          border: "1px solid " + (tab === tabItem.id ? "rgba(255,255,255,.3)" : LINE$1),
          background: tab === tabItem.id ? "rgba(255,255,255,.12)" : "transparent",
          color: tab === tabItem.id ? TEXT : MUTED$1,
          cursor: "pointer"
        },
        children: tabItem.l
      },
      tabItem.id
    )) }),
    tab === "standings" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(255,255,255,.4)", marginBottom: 10 }, children: "Ανάλυση ανά τουρνουά" }),
      board.map((row) => {
        const bd2 = {};
        ["SL", "UCL", "UEL", "UECL"].forEach((t2) => {
          let pts = 0, played = 0;
          ALL_FIXTURES.filter((m2) => m2.t === t2).forEach((m2) => {
            var _a;
            const ac2 = results == null ? void 0 : results[m2.id];
            if (!ac2) return;
            const sc2 = scoreMatch((_a = predictions == null ? void 0 : predictions[m2.id]) == null ? void 0 : _a[row.player], ac2);
            if (!sc2) return;
            pts += sc2.points;
            played++;
          });
          bd2[t2] = { pts, played };
        });
        const pcr = PC[row.player];
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: SURF$1, border: "1px solid " + LINE$1, borderRadius: 12, padding: "14px 16px", marginBottom: 8 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 36, height: 36, borderRadius: "50%", background: pcr.p, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 900, color: SURF$1 }, children: PLAYER_NAMES[row.player].substring(0, 1) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 14, fontWeight: 700, color: TEXT }, children: PLAYER_NAMES[row.player] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 10, color: MUTED$1, marginTop: 1 }, children: [
                row.exact,
                " exact · ",
                row.correct,
                " correct · ",
                row.played,
                " games"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 22, fontWeight: 900, color: pcr.p }, children: [
              row.pts,
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12, color: MUTED$1, fontWeight: 500 }, children: "p" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 5 }, children: Object.entries(bd2).map(([t2, d]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(255,255,255,.05)", borderRadius: 8, padding: "8px 5px", textAlign: "center" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TPill, { id: t2 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 15, fontWeight: 800, marginTop: 5, color: d.pts > 0 ? pcr.p : MUTED$1 }, children: d.pts }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 9, color: MUTED$1, marginTop: 1 }, children: [
              d.played,
              "αγ"
            ] })
          ] }, t2)) })
        ] }, row.player);
      })
    ] }),
    tab === "rivalry" && /* @__PURE__ */ jsxRuntimeExports.jsx(RivalryStats, { predictions, results, thavmaStats }),
    tab === "analytics" && (() => {
      const played = ALL_FIXTURES.filter((m2) => (results == null ? void 0 : results[m2.id]) != null);
      if (!played.length) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: 24, textAlign: "center", color: MUTED$1, fontSize: 13 }, children: "Δεν υπάρχουν δεδομένα ακόμα" });
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: PLAYERS.map((p2) => {
        const pc2 = PC[p2];
        let exact = 0, correct = 0, total = 0, maxStreak = 0, curStreak = 0, pts = 0;
        played.forEach((m2) => {
          var _a;
          const pred = (_a = predictions == null ? void 0 : predictions[m2.id]) == null ? void 0 : _a[p2];
          const res = results[m2.id];
          if (!pred) return;
          const sc2 = scoreMatch(pred, res);
          if (!sc2) return;
          total++;
          pts += sc2.points;
          if (sc2.exact) {
            exact++;
            correct++;
          } else if (sc2.correct) {
            correct++;
          }
          curStreak = sc2.points > 0 ? curStreak + 1 : 0;
          maxStreak = Math.max(maxStreak, curStreak);
        });
        const accPct = total ? Math.round(correct / total * 100) : 0;
        const exactPct = total ? Math.round(exact / total * 100) : 0;
        const avgPts = total ? (pts / total).toFixed(1) : 0;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: SURF$1, border: "1px solid " + LINE$1, borderRadius: 12, padding: "14px 16px", marginBottom: 10 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 38, height: 38, borderRadius: "50%", background: pc2.p, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 900, color: "#08090d" }, children: PLAYER_NAMES[p2][0] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 14, fontWeight: 700, color: TEXT }, children: PLAYER_NAMES[p2] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 10, color: MUTED$1 }, children: [
                total,
                " αγώνες · ",
                pts,
                " πόντοι"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 26, fontWeight: 900, color: pc2.p }, children: [
              avgPts,
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: MUTED$1 }, children: "p/αγ" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 10 }, children: [
            { lbl: "Ακρίβεια", val: accPct + "%", sub: correct + "/" + total + " σωστά", color: accPct >= 60 ? GREEN$1 : accPct >= 40 ? GOLD : RED$1 },
            { lbl: "Exact Score", val: exactPct + "%", sub: exact + "/" + total + " ακριβή", color: exactPct >= 30 ? GREEN$1 : exactPct >= 15 ? GOLD : RED$1 },
            { lbl: "Max Σερί", val: maxStreak, sub: "σερί πόντοι", color: maxStreak >= 3 ? GREEN$1 : maxStreak >= 2 ? GOLD : MUTED$1 }
          ].map((stat) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(255,255,255,.04)", borderRadius: 10, padding: "10px 8px", textAlign: "center" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 9, fontWeight: 700, color: MUTED$1, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 4 }, children: stat.lbl }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 22, fontWeight: 900, color: stat.color }, children: stat.val }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 9, color: MUTED$1, marginTop: 2 }, children: stat.sub })
          ] }, stat.lbl)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 4, background: "rgba(255,255,255,.06)", borderRadius: 2 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: "100%", width: accPct + "%", background: pc2.p, borderRadius: 2, transition: "width 1s ease" } }) })
        ] }, p2);
      }) });
    })(),
    tab === "campaigns" && (() => {
      const comps = [
        { id: "UEL", name: "UEFA Europa League", color: "#f5733a", teams: ["PAOK"], emoji: "🟠" },
        { id: "UECL", name: "UEFA Conference League", color: "#00c853", teams: ["PAO"], emoji: "🟢" },
        { id: "UCL", name: "UEFA Champions League", color: "#4d9fff", teams: ["OLY", "AEK"], emoji: "🔵" },
        { id: "SL", name: "Super League 2026/27", color: "#f0c040", teams: ["OLY", "AEK", "PAOK", "PAO", "ARI", "ATR", "AST", "KIF", "LEV", "OFI", "PNE", "VOL", "IRA", "KAL"], emoji: "🟡" }
      ];
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: comps.map((comp) => {
        var _a, _b;
        const compMatches = ALL_FIXTURES.filter((m2) => m2.t === comp.id);
        const played = compMatches.filter((m2) => (results == null ? void 0 : results[m2.id]) != null);
        const upcoming = compMatches.filter((m2) => !(results == null ? void 0 : results[m2.id]));
        const nextMatch = upcoming.sort((a, b) => new Date(a.kickoff) - new Date(b.kickoff))[0];
        const totalPts = PLAYERS.reduce((acc, p2) => {
          let pts = 0;
          played.forEach((m2) => {
            var _a2;
            const sc2 = scoreMatch((_a2 = predictions == null ? void 0 : predictions[m2.id]) == null ? void 0 : _a2[p2], results[m2.id]);
            if (sc2) pts += sc2.points;
          });
          acc[p2] = pts;
          return acc;
        }, {});
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: SURF$1, border: "1px solid " + LINE$1, borderRadius: 12, padding: "14px 16px", marginBottom: 10, borderLeft: "3px solid " + comp.color }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 18 }, children: comp.emoji }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 13, fontWeight: 700, color: TEXT }, children: comp.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 10, color: MUTED$1, marginTop: 1 }, children: [
                played.length,
                "/",
                compMatches.length,
                " αγώνες · ",
                upcoming.length,
                " εναπομένουν"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TPill, { id: comp.id })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 5, marginBottom: 10, flexWrap: "wrap" }, children: comp.teams.map((t2) => {
            var _a2;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,.05)", borderRadius: 8, padding: "4px 8px" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TeamLogo, { k: t2, size: 18 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, fontWeight: 600, color: TEXT }, children: ((_a2 = TEAMS[t2]) == null ? void 0 : _a2.name) || t2 })
            ] }, t2);
          }) }),
          nextMatch && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 10, color: MUTED$1, marginBottom: 10 }, children: [
            "⏭ Επόμενος: ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: GOLD, fontWeight: 700 }, children: [
              (_a = TEAMS[nextMatch.home]) == null ? void 0 : _a.abbr,
              " vs ",
              (_b = TEAMS[nextMatch.away]) == null ? void 0 : _b.abbr
            ] }),
            " · ",
            grDate(nextMatch.kickoff),
            " ",
            grTime(nextMatch.kickoff)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 6 }, children: PLAYERS.map((p2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, background: PC[p2].bg, border: "1px solid " + PC[p2].b, borderRadius: 8, padding: "6px", textAlign: "center" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 9, fontWeight: 700, color: PC[p2].p, marginBottom: 2 }, children: PLAYER_NAMES[p2].substring(0, 4).toUpperCase() }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 18, fontWeight: 900, color: PC[p2].p }, children: [
              totalPts[p2] || 0,
              "p"
            ] })
          ] }, p2)) })
        ] }, comp.id);
      }) });
    })()
  ] });
}
function MatchdayPage({ predictions, results, onRefresh, currentUser, revealed, onSave, liveScores, slStandings }) {
  const now = Date.now();
  const ONE_HOUR = 36e5;
  const sorted = [...ALL_FIXTURES].filter((m2) => {
    const ko = new Date(m2.kickoff).getTime();
    const res = results == null ? void 0 : results[m2.id];
    if (res && now > ko + ONE_HOUR) return false;
    return true;
  }).sort((a, b) => {
    const aRes = results == null ? void 0 : results[a.id], bRes = results == null ? void 0 : results[b.id];
    const aKo = new Date(a.kickoff).getTime(), bKo = new Date(b.kickoff).getTime();
    const aLive = now >= aKo && now < aKo + 72e5 && !aRes;
    const bLive = now >= bKo && now < bKo + 72e5 && !bRes;
    const aLocked = now >= aKo - 6e4, bLocked = now >= bKo - 6e4;
    if (aLive && !bLive) return -1;
    if (bLive && !aLive) return 1;
    if (aLocked !== bLocked) return aLocked ? 1 : -1;
    return aKo - bKo;
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "12px 16px 80px" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: MUTED$1, marginBottom: 14 }, children: "Ανοιχτές πρώτα · Ζωντανοί αγώνες επάνω" }),
    sorted.map((m2) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      MatchPredictCard,
      {
        match: m2,
        result: results == null ? void 0 : results[m2.id],
        predictions: predictions == null ? void 0 : predictions[m2.id],
        onRefresh,
        allResults: results,
        currentUser,
        revealed,
        onSave,
        liveScore: liveScores == null ? void 0 : liveScores[m2.id],
        slStandings
      },
      m2.id
    ))
  ] });
}
function FormStrip({ form }) {
  if (!form || !form.length) return null;
  const col = { W: GREEN$1, L: RED$1, D: GOLD };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 3, alignItems: "center" }, children: form.map((r2, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
    width: 18,
    height: 18,
    borderRadius: "50%",
    background: col[r2] || MUTED$1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 9,
    fontWeight: 800,
    color: "#08090d"
  }, children: r2 }, i)) });
}
function MatchPredictCard({ match, result, predictions, onRefresh, allResults, currentUser, revealed, onSave, liveScore, slStandings }) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i;
  const [showPush, setShowPush] = reactExports.useState(false);
  const myPred = currentUser ? predictions == null ? void 0 : predictions[currentUser.id] : null;
  const [h, setH] = reactExports.useState((myPred == null ? void 0 : myPred.h) ?? 0), [a, setA] = reactExports.useState((myPred == null ? void 0 : myPred.a) ?? 0);
  const [qual, setQual] = reactExports.useState((myPred == null ? void 0 : myPred.qual) ?? match.home);
  const [predOT, setPredOT] = reactExports.useState((myPred == null ? void 0 : myPred.predOT) ?? false);
  const [otH, setOtH] = reactExports.useState((myPred == null ? void 0 : myPred.otH) ?? 0), [otA, setOtA] = reactExports.useState((myPred == null ? void 0 : myPred.otA) ?? 0);
  const [predPen, setPredPen] = reactExports.useState((myPred == null ? void 0 : myPred.predPen) ?? false);
  const [penH, setPenH] = reactExports.useState((myPred == null ? void 0 : myPred.penH) ?? 0), [penA, setPenA] = reactExports.useState((myPred == null ? void 0 : myPred.penA) ?? 0);
  const [saving, setSaving] = reactExports.useState(false), [saved, setSaved] = reactExports.useState(false), [error, setError] = reactExports.useState("");
  reactExports.useEffect(() => {
    if (myPred) {
      setH(myPred.h ?? 0);
      setA(myPred.a ?? 0);
      setQual(myPred.qual ?? match.home);
      setPredOT(myPred.predOT ?? false);
      setOtH(myPred.otH ?? 0);
      setOtA(myPred.otA ?? 0);
    }
  }, [myPred == null ? void 0 : myPred.h, myPred == null ? void 0 : myPred.a, myPred == null ? void 0 : myPred.qual]);
  const hasRes = result != null;
  const locked = isLocked(match.kickoff);
  const isUEFA = isUEFATie(match.id);
  const isRevealed = (revealed == null ? void 0 : revealed[match.id]) || false;
  const minsUntil = (new Date(match.kickoff).getTime() - Date.now()) / 6e4;
  const isPreKickoff = minsUntil >= -1 && minsUntil <= 1;
  const showAllPreds = hasRes || (isRevealed || isPreKickoff);
  const today = isToday(match.kickoff);
  const isSL = match.t === "SL";
  const findSLTeam = (key) => {
    var _a2, _b2;
    if (!key || (slStandings || []).length === 0) return null;
    const name = (((_a2 = TEAMS[key]) == null ? void 0 : _a2.name) || key).toLowerCase();
    const abbr = (((_b2 = TEAMS[key]) == null ? void 0 : _b2.abbr) || key).toLowerCase();
    return (slStandings || []).find(
      (t2) => {
        var _a3, _b3, _c2, _d2;
        return ((_a3 = t2.team) == null ? void 0 : _a3.toLowerCase()) === abbr || ((_b3 = t2.team) == null ? void 0 : _b3.toLowerCase()) === key.toLowerCase() || ((_c2 = t2.name) == null ? void 0 : _c2.toLowerCase().includes(name)) || name.includes(((_d2 = t2.name) == null ? void 0 : _d2.toLowerCase()) || "__");
      }
    ) || null;
  };
  const slHome = isSL ? findSLTeam(match.home) : null;
  const slAway = isSL ? findSLTeam(match.away) : null;
  const hn = ((_a = TEAMS[match.home]) == null ? void 0 : _a.name) || match.home;
  const an = ((_b = TEAMS[match.away]) == null ? void 0 : _b.name) || match.away;
  const tC = { SL: "#f0c040", UCL: BLUE, UEL: "#f5733a", UECL: GREEN$1 }[match.t] || GOLD;
  const leg1Res = match.leg === 2 && match.tie && allResults ? allResults[match.tie + "-1"] : null;
  const leg1Fix = match.leg === 2 && match.tie ? UEFA_FIXTURES.find((f2) => f2.id === match.tie + "-1") : null;
  const leg1Agg = leg1Res && leg1Fix ? (() => {
    const greek = match.greek;
    const wasHome = leg1Fix.home === greek;
    const gG = wasHome ? leg1Res.h : leg1Res.a;
    const oG = wasHome ? leg1Res.a : leg1Res.h;
    const diff = gG - oG;
    return {
      h1: leg1Res.h,
      a1: leg1Res.a,
      diff,
      leg1Fix,
      situation: diff > 0 ? "+" + diff + " προβάδισμα" : diff < 0 ? diff + " πίσω" : "Ισόπαλη · Παρ/Πέν αν ισόπαλη"
    };
  })() : null;
  const adj = (v2, set, d) => {
    if (!locked) {
      set(Math.max(0, Math.min(9, v2 + d)));
      setSaved(false);
    }
  };
  const nb2 = {
    width: 50,
    height: 50,
    background: SURF2,
    border: `1px solid ${locked ? LINE$1 : tC + "55"}`,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 24,
    fontWeight: 800,
    color: locked ? MUTED$1 : TEXT,
    fontVariantNumeric: "tabular-nums"
  };
  const ab2 = {
    width: 34,
    height: 34,
    borderRadius: 8,
    border: `1px solid ${LINE$1}`,
    background: "rgba(255,255,255,.06)",
    color: TEXT,
    cursor: locked ? "not-allowed" : "pointer",
    fontSize: 17,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  };
  const ScoreRow = ({ lbl, hv, setHv, av, setAv, sm }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: sm ? 6 : 0 }, children: [
    lbl && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, fontWeight: 700, color: tC, letterSpacing: ".05em", marginBottom: 5, textTransform: "uppercase", textAlign: "center" }, children: lbl }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 8 }, children: [["h", hv, setHv], ["a", av, setAv]].map(([side, v2, set], i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      i === 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: sm ? 16 : 20, color: DIM, textAlign: "center" }, children: "–" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: sm ? 4 : 7, justifyContent: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: sm ? { ...ab2, width: 26, height: 26, fontSize: 14 } : ab2, onClick: () => adj(v2, set, -1), children: "–" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: sm ? { ...nb2, width: 38, height: 38, fontSize: 18 } : nb2, children: v2 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: sm ? { ...ab2, width: 26, height: 26, fontSize: 14 } : ab2, onClick: () => adj(v2, set, 1), children: "+" })
      ] })
    ] })) })
  ] });
  async function save() {
    if (locked) return;
    setSaving(true);
    setError("");
    try {
      await onSave(match.id, h, a, qual, predOT, otH, otA, predPen, penH, penA);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError("❌ " + ((e == null ? void 0 : e.message) || "Σφάλμα") + " — έλεγξε σύνδεση & ξανά");
    } finally {
      setSaving(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    background: SURF$1,
    border: `1px solid ${today ? GREEN$1 + "55" : LINE$1}`,
    borderRadius: 14,
    marginBottom: 10,
    overflow: "hidden",
    boxShadow: today ? `0 0 20px ${GREEN$1}12` : void 0
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 2, background: `linear-gradient(90deg,${tC}cc,transparent)` } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "9px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${LINE$1}` }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 7 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TPill, { id: match.t }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, fontWeight: 600, color: MUTED$1 }, children: match.round || "" }),
        today && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { display: "flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700, color: GREEN$1 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: 6, height: 6, borderRadius: "50%", background: GREEN$1, animation: "pulse-dot 1.2s infinite", display: "inline-block" } }),
          "ΣΗΜΕΡΑ"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "right" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, fontWeight: 700, color: locked ? RED$1 : GREEN$1 }, children: locked ? "🔒 Κλειδωμένο" : `Κλείνει ${grTime(match.kickoff)}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, color: MUTED$1 }, children: grDate(match.kickoff) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "14px 14px 12px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 10, marginBottom: 8 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TeamLogo, { k: match.home, size: 36 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, fontWeight: 600, textAlign: "right", color: TEXT, lineHeight: 1.2 }, children: hn }),
          slHome && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 9, fontWeight: 700, color: GOLD, background: GOLD + "18", borderRadius: 4, padding: "1px 5px" }, children: [
            "#",
            slHome.rank
          ] }),
          ((_c = slHome == null ? void 0 : slHome.form) == null ? void 0 : _c.length) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", justifyContent: "flex-end" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(FormStrip, { form: slHome.form.slice(-5) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ScorePill, { h: liveScore ? liveScore.h : result == null ? void 0 : result.h, a: liveScore ? liveScore.a : result == null ? void 0 : result.a, pending: today && !hasRes && !liveScore }),
          liveScore && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 9, fontWeight: 700, color: GREEN$1, letterSpacing: ".06em", display: "flex", alignItems: "center", gap: 3 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: 5, height: 5, borderRadius: "50%", background: GREEN$1, animation: "pulse-dot 1s infinite", display: "inline-block" } }),
            liveScore.min,
            "'"
          ] }),
          (result == null ? void 0 : result.overtime) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 9, fontWeight: 700, color: GOLD, letterSpacing: ".03em", textAlign: "center" }, children: result.penalties ? `Μπενάλντιζ ${result.penH}–${result.penA}` : `ΠΑΡΑΤΑΣΗ ${result.otH}–${result.otA}` }),
          !hasRes && !today && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, color: DIM, fontWeight: 600 }, children: "vs" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TeamLogo, { k: match.away, size: 36 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, fontWeight: 600, color: TEXT, lineHeight: 1.2 }, children: an }),
          slAway && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 9, fontWeight: 700, color: GOLD, background: GOLD + "18", borderRadius: 4, padding: "1px 5px" }, children: [
            "#",
            slAway.rank
          ] }),
          ((_d = slAway == null ? void 0 : slAway.form) == null ? void 0 : _d.length) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(FormStrip, { form: slAway.form.slice(-5) })
        ] })
      ] }),
      leg1Agg && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        background: "rgba(255,255,255,.04)",
        border: `1px solid ${LINE$1}`,
        borderRadius: 9,
        padding: "8px 12px",
        marginBottom: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 6
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 6 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 9, fontWeight: 700, color: MUTED$1, letterSpacing: ".06em", textTransform: "uppercase" }, children: "Leg 1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 13, fontWeight: 900, color: TEXT, fontVariantNumeric: "tabular-nums" }, children: [
            (_e = TEAMS[leg1Agg.leg1Fix.home]) == null ? void 0 : _e.abbr,
            " ",
            leg1Agg.h1,
            "–",
            leg1Agg.a1,
            " ",
            (_f = TEAMS[leg1Agg.leg1Fix.away]) == null ? void 0 : _f.abbr
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, fontWeight: 800, color: leg1Agg.diff > 0 ? GREEN$1 : leg1Agg.diff < 0 ? RED$1 : GOLD }, children: leg1Agg.situation })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(OddsRow, { matchId: match.id }),
      !hasRes && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 12, borderTop: `1px solid ${LINE$1}`, paddingTop: 12 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ScoreRow, { hv: h, setHv: setH, av: a, setAv: setA }),
        isUEFA && !locked && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 10 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, fontWeight: 700, color: tC, letterSpacing: ".05em", marginBottom: 6, textTransform: "uppercase" }, children: "Πρόκριση" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 6 }, children: [match.home, match.away].map((tm) => {
            var _a2;
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => {
                  if (!locked) {
                    setQual(tm);
                    setSaved(false);
                  }
                },
                style: {
                  flex: 1,
                  padding: "7px 5px",
                  borderRadius: 8,
                  border: `1px solid ${qual === tm ? tC + "88" : LINE$1}`,
                  background: qual === tm ? `${tC}18` : "transparent",
                  color: qual === tm ? tC : MUTED$1,
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: locked ? "not-allowed" : "pointer"
                },
                children: ((_a2 = TEAMS[tm]) == null ? void 0 : _a2.name) || tm
              },
              tm
            );
          }) })
        ] }),
        isUEFA && !locked && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 8, display: "flex", gap: 6 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => {
                if (!locked) {
                  setPredOT((v2) => !v2);
                  setSaved(false);
                }
              },
              style: {
                flex: 1,
                padding: "6px",
                borderRadius: 8,
                border: `1px solid ${predOT ? GOLD + "66" : LINE$1}`,
                background: predOT ? `${GOLD}15` : "transparent",
                color: predOT ? GOLD : MUTED$1,
                fontSize: 10,
                fontWeight: 700,
                cursor: locked ? "not-allowed" : "pointer"
              },
              children: [
                predOT ? "✓ " : "",
                " ΠΑΡΑΤΑΣΗ"
              ]
            }
          ),
          predOT && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => {
                if (!locked) {
                  setPredPen((v2) => !v2);
                  setSaved(false);
                }
              },
              style: {
                flex: 1,
                padding: "6px",
                borderRadius: 8,
                border: `1px solid ${predPen ? RED$1 + "66" : LINE$1}`,
                background: predPen ? `${RED$1}15` : "transparent",
                color: predPen ? RED$1 : MUTED$1,
                fontSize: 10,
                fontWeight: 700,
                cursor: locked ? "not-allowed" : "pointer"
              },
              children: [
                predPen ? "✓ " : "",
                " Μπενάλντιζ"
              ]
            }
          )
        ] }),
        predOT && !locked && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: 8 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScoreRow, { lbl: predPen ? "Μπενάλντιζ" : "ΠΑΡΑΤΑΣΗ", hv: otH, setHv: setOtH, av: otA, setAv: setOtA, sm: true }) }),
        error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          fontSize: 11,
          color: RED$1,
          background: "rgba(255,77,109,.08)",
          border: "1px solid rgba(255,77,109,.2)",
          borderRadius: 8,
          padding: "7px 10px",
          marginTop: 8,
          textAlign: "center",
          fontWeight: 600
        }, children: error }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: save,
            disabled: locked || saving || saved,
            style: {
              width: "100%",
              marginTop: 10,
              padding: "11px",
              borderRadius: 10,
              background: saved ? `${GREEN$1}22` : locked ? "rgba(255,255,255,.06)" : `${tC}22`,
              color: saved ? GREEN$1 : locked ? MUTED$1 : tC,
              fontSize: 13,
              fontWeight: 800,
              cursor: locked ? "not-allowed" : "pointer",
              border: `1px solid ${saved ? GREEN$1 + "44" : locked ? LINE$1 : tC + "44"}`
            },
            children: saved ? "✓ Αποθηκεύτηκε!" : locked ? "🔒 Κλειδωμένο" : saving ? "Αποθήκευση…" : myPred ? "Άλλαξε Πρόβλεψη ✏️" : "Κάνε την πρόβλεψή σου ⚽"
          }
        )
      ] }),
      !showAllPreds && locked && !hasRes && myPred && currentUser && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        marginTop: 10,
        background: "rgba(255,255,255,.04)",
        border: `1px solid ${((_g = PC[currentUser.id]) == null ? void 0 : _g.b) || LINE$1}`,
        borderRadius: 9,
        padding: "8px 10px",
        display: "flex",
        alignItems: "center",
        gap: 8
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 7, height: 7, borderRadius: "50%", background: ((_h = PC[currentUser.id]) == null ? void 0 : _h.p) || MUTED$1, flexShrink: 0 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, fontWeight: 600, color: MUTED$1 }, children: "Η πρόβλεψή μου:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 14, fontWeight: 900, color: ((_i = PC[currentUser.id]) == null ? void 0 : _i.p) || TEXT, fontVariantNumeric: "tabular-nums" }, children: [
          myPred.h,
          "–",
          myPred.a
        ] }),
        myPred.qual && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 10, color: MUTED$1 }, children: [
          "→ ",
          myPred.qual
        ] })
      ] }),
      showAllPreds && predictions && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 10 }, children: [
        (isPreKickoff || isRevealed) && !hasRes && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, fontWeight: 700, color: GOLD, textAlign: "center", marginBottom: 6, letterSpacing: ".06em" }, children: "🔒 ΑΠΟΚΑΛΥΨΗ ΠΡΟΒΛΕΨΕΩΝ" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 5 }, children: PLAYERS.map((playerKey) => {
          const pred = predictions[playerKey];
          const sc2 = pred ? scoreMatch(pred, result) : null;
          const pc2 = PC[playerKey];
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
            flex: 1,
            background: (sc2 == null ? void 0 : sc2.exact) ? `${GREEN$1}15` : (sc2 == null ? void 0 : sc2.correct) ? `${GOLD}0a` : "rgba(255,255,255,.04)",
            border: `1px solid ${(sc2 == null ? void 0 : sc2.exact) ? GREEN$1 + "44" : (sc2 == null ? void 0 : sc2.correct) ? GOLD + "22" : LINE$1}`,
            borderRadius: 9,
            padding: "7px 6px",
            textAlign: "center"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 9, fontWeight: 700, color: pc2.p, marginBottom: 3, letterSpacing: ".04em" }, children: PLAYER_NAMES[playerKey].substring(0, 4).toUpperCase() }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 13, fontWeight: 800, color: TEXT, fontVariantNumeric: "tabular-nums" }, children: pred ? `${pred.h}–${pred.a}` : "–" }),
            (pred == null ? void 0 : pred.qual) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 9, color: MUTED$1, marginTop: 1 }, children: [
              "→",
              pred.qual
            ] }),
            sc2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 10, fontWeight: 700, color: sc2.points === 2 ? GREEN$1 : sc2.points === 1 ? GOLD : DIM, marginTop: 2 }, children: [
              sc2.points === 2 ? "🎯" : sc2.points === 1 ? "✓" : "✗",
              sc2.points,
              "p"
            ] })
          ] }, playerKey);
        }) })
      ] }),
      (currentUser == null ? void 0 : currentUser.role) === "admin" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8, marginTop: 12 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FetchBtn, { matchId: match.id, onFetched: onRefresh }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setShowPush((v2) => !v2),
            style: {
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              padding: "8px 10px",
              borderRadius: 8,
              border: `1px solid ${showPush ? GOLD + "55" : GOLD + "25"}`,
              background: showPush ? `${GOLD}20` : `${GOLD}08`,
              color: GOLD,
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "ti ti-cloud-upload", style: { fontSize: 13 } }),
              "Push"
            ]
          }
        )
      ] }),
      showPush && (currentUser == null ? void 0 : currentUser.role) === "admin" && /* @__PURE__ */ jsxRuntimeExports.jsx(PushPanel, { match, result, onSaved: () => {
        setShowPush(false);
        onRefresh();
      } })
    ] })
  ] });
}
function FixtureList({ fixtures, rankMap, formMap, setView, setH2hMatch }) {
  if (!fixtures.length) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: 32, textAlign: "center", color: MUTED$1, fontSize: 13 }, children: "Δεν βρέθηκαν αγώνες" });
  const now = Date.now();
  const groups = {};
  fixtures.forEach((m2) => {
    const key = m2.round || m2.t || "Αγώνες";
    if (!groups[key]) groups[key] = [];
    groups[key].push(m2);
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: Object.entries(groups).map(([round, gMatches]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: ".08em",
      textTransform: "uppercase",
      color: MUTED$1,
      marginBottom: 8,
      marginTop: 16,
      display: "flex",
      alignItems: "center",
      gap: 8
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, height: 1, background: LINE$1 } }),
      round,
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, height: 1, background: LINE$1 } })
    ] }),
    gMatches.map((m2) => {
      var _a, _b, _c, _d, _e, _f;
      const ko = new Date(m2.kickoff).getTime();
      const isPast = ko < now;
      const isSL = m2.t === "SL";
      const homeRank = (rankMap == null ? void 0 : rankMap[m2.home]) || (rankMap == null ? void 0 : rankMap[(_a = TEAMS[m2.home]) == null ? void 0 : _a.name]);
      const awayRank = (rankMap == null ? void 0 : rankMap[m2.away]) || (rankMap == null ? void 0 : rankMap[(_b = TEAMS[m2.away]) == null ? void 0 : _b.name]);
      const homeForm = (formMap == null ? void 0 : formMap[m2.home]) || (formMap == null ? void 0 : formMap[(_c = TEAMS[m2.home]) == null ? void 0 : _c.name]) || [];
      const awayForm = (formMap == null ? void 0 : formMap[m2.away]) || (formMap == null ? void 0 : formMap[(_d = TEAMS[m2.away]) == null ? void 0 : _d.name]) || [];
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        background: SURF$1,
        border: "1px solid " + LINE$1,
        borderRadius: 12,
        padding: "10px 14px",
        marginBottom: 6,
        opacity: isPast ? 0.65 : 1
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TPill, { id: m2.t }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 10, color: MUTED$1, fontWeight: 600 }, children: [
            grDate(m2.kickoff),
            " · ",
            grTime(m2.kickoff)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 8 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 5 }, children: [
              homeRank && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 9, fontWeight: 700, color: GOLD, background: GOLD + "18", borderRadius: 4, padding: "1px 4px" }, children: [
                "#",
                homeRank
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12, fontWeight: 700, color: TEXT }, children: ((_e = TEAMS[m2.home]) == null ? void 0 : _e.name) || m2.home }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TeamLogo, { k: m2.home, size: 22 })
            ] }),
            isSL && homeForm.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", justifyContent: "flex-end" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(FormStrip, { form: homeForm.slice(-5) }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12, color: DIM, fontWeight: 700 }, children: "vs" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 3 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 5 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TeamLogo, { k: m2.away, size: 22 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12, fontWeight: 700, color: TEXT }, children: ((_f = TEAMS[m2.away]) == null ? void 0 : _f.name) || m2.away }),
              awayRank && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 9, fontWeight: 700, color: GOLD, background: GOLD + "18", borderRadius: 4, padding: "1px 4px" }, children: [
                "#",
                awayRank
              ] })
            ] }),
            isSL && awayForm.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(FormStrip, { form: awayForm.slice(-5) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => {
              setView("h2h");
              setH2hMatch(m2.id);
            },
            style: {
              marginTop: 8,
              width: "100%",
              padding: "5px",
              borderRadius: 7,
              border: "1px solid " + LINE$1,
              background: "rgba(255,255,255,.04)",
              color: MUTED$1,
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer"
            },
            children: "⚔️ H2H"
          }
        )
      ] }, m2.id);
    })
  ] }, round)) });
}
function SchedulePage({ slStandings }) {
  const [filter, setFilter] = reactExports.useState("all");
  const [view, setView] = reactExports.useState("list");
  const [h2hMatch, setH2hMatch] = reactExports.useState(null);
  const [nFilter, setNFilter] = reactExports.useState("all");
  const [espnFixtures, setEspnFixtures] = reactExports.useState([]);
  const [loadingFix, setLoadingFix] = reactExports.useState(true);
  reactExports.useEffect(() => {
    api.getSlFixtures().then((d) => {
      var _a;
      if ((_a = d == null ? void 0 : d.events) == null ? void 0 : _a.length) setEspnFixtures(d.events);
    }).catch(() => {
    }).finally(() => setLoadingFix(false));
  }, []);
  const now = Date.now();
  const formMap = {};
  (slStandings || []).forEach((t2) => {
    formMap[t2.team] = t2.form || [];
    formMap[t2.name] = t2.form || [];
  });
  const rankMap = {};
  (slStandings || []).forEach((t2) => {
    rankMap[t2.team] = t2.rank;
    rankMap[t2.name] = t2.rank;
  });
  let fixtures = [...ALL_FIXTURES];
  if (filter !== "all") {
    if (["SL", "UCL", "UEL", "UECL"].includes(filter)) {
      fixtures = fixtures.filter((m2) => m2.t === filter);
    } else {
      fixtures = fixtures.filter((m2) => m2.home === filter || m2.away === filter);
    }
  }
  if (nFilter === "next5") {
    fixtures = fixtures.filter((m2) => new Date(m2.kickoff).getTime() > now).slice(0, 5);
  } else if (nFilter === "next3") {
    fixtures = fixtures.filter((m2) => new Date(m2.kickoff).getTime() > now).slice(0, 3);
  } else if (nFilter === "last5") {
    fixtures = fixtures.filter((m2) => new Date(m2.kickoff).getTime() < now).slice(-5);
  }
  fixtures.sort((a, b) => new Date(a.kickoff) - new Date(b.kickoff));
  const h2hData = h2hMatch ? ALL_FIXTURES.find((m2) => m2.id === h2hMatch) : null;
  const allTeams = [...new Set(ALL_FIXTURES.flatMap((m2) => [m2.home, m2.away]))].sort();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "12px 16px 80px" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "select",
        {
          value: filter,
          onChange: (e) => setFilter(e.target.value),
          style: {
            flex: 1,
            minWidth: 120,
            padding: "8px 10px",
            borderRadius: 9,
            background: SURF$1,
            border: "1px solid " + LINE$1,
            color: TEXT,
            fontSize: 12,
            fontWeight: 600
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "🌍 Όλες οι διοργανώσεις" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("optgroup", { label: "Διοργανώσεις", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "SL", children: "🟡 Super League" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "UCL", children: "🔵 Champions League" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "UEL", children: "🟠 Europa League" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "UECL", children: "🟢 Conference League" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("optgroup", { label: "Ομάδες", children: allTeams.map((t2) => {
              var _a;
              return /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: t2, children: ((_a = TEAMS[t2]) == null ? void 0 : _a.name) || t2 }, t2);
            }) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "select",
        {
          value: nFilter,
          onChange: (e) => setNFilter(e.target.value),
          style: {
            flex: 1,
            minWidth: 110,
            padding: "8px 10px",
            borderRadius: 9,
            background: SURF$1,
            border: "1px solid " + LINE$1,
            color: TEXT,
            fontSize: 12,
            fontWeight: 600
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "Όλοι" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "next3", children: "Επόμενοι 3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "next5", children: "Επόμενοι 5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "last5", children: "Τελευταίοι 5" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 4 }, children: [{ id: "list", l: "📋" }, { id: "h2h", l: "⚔️ H2H" }].map((v2) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setView(v2.id),
          style: {
            padding: "7px 12px",
            borderRadius: 8,
            border: "1px solid " + (view === v2.id ? GREEN$1 + "66" : LINE$1),
            background: view === v2.id ? GREEN$1 + "18" : "transparent",
            color: view === v2.id ? GREEN$1 : MUTED$1,
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer"
          },
          children: v2.l
        },
        v2.id
      )) })
    ] }),
    view === "list" && /* @__PURE__ */ jsxRuntimeExports.jsx(FixtureList, { fixtures, rankMap, formMap, setView, setH2hMatch }),
    view === "h2h" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "select",
        {
          value: h2hMatch || "",
          onChange: (e) => setH2hMatch(e.target.value),
          style: {
            width: "100%",
            padding: "10px 12px",
            borderRadius: 10,
            background: SURF$1,
            border: "1px solid " + LINE$1,
            color: TEXT,
            fontSize: 12,
            fontWeight: 600,
            marginBottom: 14
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Επίλεξε αγώνα..." }),
            ALL_FIXTURES.map((m2) => {
              var _a, _b;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: m2.id, children: [
                ((_a = TEAMS[m2.home]) == null ? void 0 : _a.abbr) || m2.home,
                " vs ",
                ((_b = TEAMS[m2.away]) == null ? void 0 : _b.abbr) || m2.away,
                " · ",
                grDate(m2.kickoff)
              ] }, m2.id);
            })
          ]
        }
      ),
      h2hData && (() => {
        var _a, _b;
        const homeTeam = h2hData.home, awayTeam = h2hData.away;
        const homeLast = ALL_FIXTURES.filter(
          (m2) => (m2.home === homeTeam || m2.away === homeTeam) && new Date(m2.kickoff).getTime() < now
        ).slice(-3);
        const awayLast = ALL_FIXTURES.filter(
          (m2) => (m2.home === awayTeam || m2.away === awayTeam) && new Date(m2.kickoff).getTime() < now
        ).slice(-3);
        const homeNext = ALL_FIXTURES.filter(
          (m2) => (m2.home === homeTeam || m2.away === homeTeam) && new Date(m2.kickoff).getTime() > now
        ).slice(0, 3);
        const awayNext = ALL_FIXTURES.filter(
          (m2) => (m2.home === awayTeam || m2.away === awayTeam) && new Date(m2.kickoff).getTime() > now
        ).slice(0, 3);
        const TeamCol = ({ team, last, next, rank, form }) => {
          var _a2;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TeamLogo, { k: team, size: 28 }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, fontWeight: 700, color: TEXT }, children: ((_a2 = TEAMS[team]) == null ? void 0 : _a2.name) || team }),
                rank && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 10, color: GOLD, fontWeight: 700 }, children: [
                  "#",
                  rank,
                  " SL"
                ] })
              ] })
            ] }),
            (form == null ? void 0 : form.length) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginBottom: 10 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(FormStrip, { form }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, fontWeight: 700, color: MUTED$1, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 6 }, children: "Τελευταίοι 3" }),
            last.map((m2) => {
              var _a3;
              const isHome = m2.home === team;
              const opp = isHome ? m2.away : m2.home;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(255,255,255,.04)", borderRadius: 8, padding: "6px 8px", marginBottom: 4, fontSize: 11 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: MUTED$1 }, children: [
                  isHome ? "Εντός" : "Εκτός",
                  " vs "
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: TEXT, fontWeight: 600 }, children: ((_a3 = TEAMS[opp]) == null ? void 0 : _a3.abbr) || opp }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: MUTED$1 }, children: [
                  " · ",
                  grDate(m2.kickoff)
                ] })
              ] }, m2.id);
            }),
            last.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: MUTED$1, padding: "8px 0" }, children: "Δεν υπάρχουν" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, fontWeight: 700, color: MUTED$1, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 6, marginTop: 10 }, children: "Επόμενοι 3" }),
            next.map((m2) => {
              var _a3;
              const isHome = m2.home === team;
              const opp = isHome ? m2.away : m2.home;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(255,255,255,.04)", borderRadius: 8, padding: "6px 8px", marginBottom: 4, fontSize: 11 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: MUTED$1 }, children: [
                  isHome ? "Εντός" : "Εκτός",
                  " vs "
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: TEXT, fontWeight: 600 }, children: ((_a3 = TEAMS[opp]) == null ? void 0 : _a3.abbr) || opp }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: MUTED$1 }, children: [
                  " · ",
                  grDate(m2.kickoff)
                ] })
              ] }, m2.id);
            }),
            next.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: MUTED$1, padding: "8px 0" }, children: "Δεν υπάρχουν" })
          ] });
        };
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: SURF$1, border: "1px solid " + LINE$1, borderRadius: 12, padding: "14px", marginBottom: 10 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", marginBottom: 14 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TPill, { id: h2hData.t }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 13, fontWeight: 700, color: TEXT, marginTop: 8 }, children: [
              ((_a = TEAMS[homeTeam]) == null ? void 0 : _a.name) || homeTeam,
              " vs ",
              ((_b = TEAMS[awayTeam]) == null ? void 0 : _b.name) || awayTeam
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 11, color: MUTED$1, marginTop: 2 }, children: [
              grDate(h2hData.kickoff),
              " · ",
              grTime(h2hData.kickoff)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 12 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TeamCol,
              {
                team: homeTeam,
                last: homeLast,
                next: homeNext,
                rank: rankMap[homeTeam],
                form: formMap[homeTeam]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 1, background: LINE$1, flexShrink: 0 } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TeamCol,
              {
                team: awayTeam,
                last: awayLast,
                next: awayNext,
                rank: rankMap[awayTeam],
                form: formMap[awayTeam]
              }
            )
          ] })
        ] }) });
      })(),
      !h2hData && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: 32, textAlign: "center", color: MUTED$1, fontSize: 13 }, children: "Επίλεξε αγώνα για να δεις το H2H" })
    ] })
  ] });
}
const BG = "#08090d", SURF = "#111318", LINE = "rgba(255,255,255,.1)";
const GREEN = "#00ff88", RED = "#ff2244", MUTED = "rgba(255,255,255,.4)";
function Login({ onLogin }) {
  const [email, setEmail] = reactExports.useState("");
  const [pass, setPass] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("+30");
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const [needsPhone, setNeedsPhone] = reactExports.useState(false);
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const user = await api.login(email.trim().toLowerCase(), pass);
      if (!user.phone && !needsPhone) {
        setNeedsPhone(true);
        setLoading(false);
        return;
      }
      if (needsPhone) {
        try {
          await api.savePhone(phone);
        } catch {
        }
      }
      storeToken(user.token);
      storeUser({ ...user, phone: user.phone || phone });
      onLogin({ ...user, phone: user.phone || phone });
    } catch {
      setError("Λάθος email ή κωδικός");
    } finally {
      setLoading(false);
    }
  }
  const inp = {
    width: "100%",
    padding: "12px 14px",
    background: "#0d0f14",
    border: `1px solid ${LINE}`,
    borderRadius: 10,
    color: "#e8e9ef",
    fontSize: 15,
    outline: "none",
    fontFamily: "inherit"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    minHeight: "100vh",
    background: BG,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    fontFamily: "'Space Grotesk',system-ui,sans-serif"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      position: "fixed",
      inset: 0,
      backgroundImage: "linear-gradient(#ffffff06 1px,transparent 1px),linear-gradient(90deg,#ffffff06 1px,transparent 1px)",
      backgroundSize: "40px 40px",
      pointerEvents: "none"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: "100%", maxWidth: 380, position: "relative", zIndex: 1 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", marginBottom: 36 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, fontWeight: 700, letterSpacing: ".2em", color: "rgba(255,255,255,.3)", marginBottom: 8 }, children: "CAREDIRECT FC" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 38, fontWeight: 800, color: "#fff", letterSpacing: "-.02em", lineHeight: 1, marginBottom: 10 }, children: "ΚΟΥΒΑΔΕΪΡΟΣ" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 1, width: 40, background: "linear-gradient(90deg,transparent,#00ff8866)" } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, fontWeight: 700, color: GREEN, letterSpacing: ".1em" }, children: "2026/27 SEASON" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 1, width: 40, background: "linear-gradient(90deg,#00ff8866,transparent)" } })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { background: SURF, border: `1px solid ${LINE}`, borderRadius: 16, padding: 28 }, children: !needsPhone ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, fontWeight: 700, color: MUTED, marginBottom: 18, letterSpacing: ".08em", textTransform: "uppercase" }, children: "Είσοδος" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 14 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, fontWeight: 700, color: MUTED, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 7 }, children: "Email" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "email",
                value: email,
                onChange: (e) => setEmail(e.target.value),
                placeholder: "name@caredirect.com",
                required: true,
                style: inp
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 22 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, fontWeight: 700, color: MUTED, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 7 }, children: "Password" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "password",
                value: pass,
                onChange: (e) => setPass(e.target.value),
                placeholder: "••••",
                required: true,
                style: inp
              }
            )
          ] }),
          error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, color: RED, background: "rgba(255,34,68,.1)", border: `1px solid rgba(255,34,68,.25)`, borderRadius: 8, padding: "9px 12px", marginBottom: 14, textAlign: "center", fontWeight: 600 }, children: error }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: loading, style: { width: "100%", padding: 14, borderRadius: 10, border: "none", background: loading ? "#ffffff12" : GREEN, color: loading ? MUTED : "#08090d", fontSize: 14, fontWeight: 800, cursor: "pointer", letterSpacing: ".03em" }, children: loading ? "Σύνδεση…" : "Είσοδος →" })
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, fontWeight: 700, color: GREEN, marginBottom: 6, letterSpacing: ".06em", textTransform: "uppercase" }, children: "📱 Αριθμός Κινητού" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 13, color: MUTED, marginBottom: 20, lineHeight: 1.5 }, children: "Εισάγετε τον αριθμό κινητού σας για να λαμβάνετε υπενθυμίσεις WhatsApp πριν κάθε αγώνα." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 22 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, fontWeight: 700, color: MUTED, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 7 }, children: "Κινητό (με πρόθεμα)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "tel",
                value: phone,
                onChange: (e) => setPhone(e.target.value),
                placeholder: "+30 694 000 0000",
                required: true,
                style: inp
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: MUTED, marginTop: 6 }, children: "Μορφή: +30XXXXXXXXXX" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: loading, style: { width: "100%", padding: 14, borderRadius: 10, border: "none", background: loading ? "#ffffff12" : GREEN, color: "#08090d", fontSize: 14, fontWeight: 800, cursor: "pointer" }, children: loading ? "Αποθήκευση…" : "Αποθήκευση & Είσοδος →" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
            storeToken("");
            setNeedsPhone(false);
          }, style: { width: "100%", padding: 10, borderRadius: 10, border: `1px solid ${LINE}`, background: "transparent", color: MUTED, fontSize: 13, cursor: "pointer", marginTop: 10 }, children: "Παράλειψη προς το παρόν" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", marginTop: 18, fontSize: 11, color: "rgba(255,255,255,.2)" }, children: "Private · Invitation only · CareDirect FC" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `@keyframes spin{to{transform:rotate(360deg);}}` })
  ] });
}
function showError(msg) {
  var el2 = document.getElementById("root");
  if (!el2) return;
  var d = document.createElement("div");
  d.style.cssText = "min-height:100vh;background:#08090d;color:#ff4d6d;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;gap:16px;font-family:monospace";
  var icon = document.createElement("div");
  icon.textContent = "❌";
  icon.style.fontSize = "32px";
  var title = document.createElement("div");
  title.textContent = "ΚΟΥΒΑΔΕΪΡΟΣ — Error";
  title.style.cssText = "font-size:16px;font-weight:700;color:#fff";
  var err = document.createElement("div");
  err.textContent = String(msg);
  err.style.cssText = "font-size:11px;color:#ff8fa3;max-width:460px;word-break:break-all;padding:12px;background:rgba(255,77,109,.1);border-radius:8px;line-height:1.5";
  var btn = document.createElement("button");
  btn.textContent = "Ανανέωση";
  btn.style.cssText = "background:#ff4d6d;color:#fff;border:none;border-radius:8px;padding:10px 24px;font-size:14px;font-weight:700;cursor:pointer";
  btn.onclick = function() {
    window.location.reload();
  };
  d.appendChild(icon);
  d.appendChild(title);
  d.appendChild(err);
  d.appendChild(btn);
  el2.innerHTML = "";
  el2.appendChild(d);
}
class ErrorBoundary extends reactExports.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(e) {
    return { error: e };
  }
  componentDidCatch(e) {
    showError("React: " + e.message);
  }
  render() {
    if (this.state.error) {
      showError("React: " + this.state.error.message);
      return null;
    }
    return this.props.children;
  }
}
function Root() {
  var user = getStoredUser();
  var [u2, setU] = reactExports.useState(user);
  function handleLogin(u22) {
    storeUser(u22);
    setU(u22);
  }
  function handleLogout() {
    setU(null);
  }
  if (!u2) return React.createElement(Login, { onLogin: handleLogin });
  return React.createElement(App, { user: u2, onLogout: handleLogout });
}
console.log("KOUVADEIROS v7 2026-07-30");
try {
  client.createRoot(document.getElementById("root")).render(
    React.createElement(ErrorBoundary, null, React.createElement(Root))
  );
} catch (e) {
  showError("Boot: " + e.message + "\n" + (e.stack || "").split("\n").slice(0, 3).join("\n"));
}
