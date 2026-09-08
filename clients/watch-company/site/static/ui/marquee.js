var Pu = { exports: {} }, El = {};
var Dp;
function G1() {
  if (Dp) return El;
  Dp = 1;
  var i = /* @__PURE__ */ Symbol.for("react.transitional.element"), l = /* @__PURE__ */ Symbol.for("react.fragment");
  function s(o, c, d) {
    var f = null;
    if (d !== void 0 && (f = "" + d), c.key !== void 0 && (f = "" + c.key), "key" in c) {
      d = {};
      for (var m in c)
        m !== "key" && (d[m] = c[m]);
    } else d = c;
    return c = d.ref, {
      $$typeof: i,
      type: o,
      key: f,
      ref: c !== void 0 ? c : null,
      props: d
    };
  }
  return El.Fragment = l, El.jsx = s, El.jsxs = s, El;
}
var zp;
function Y1() {
  return zp || (zp = 1, Pu.exports = G1()), Pu.exports;
}
var _e = Y1(), Wu = { exports: {} }, ft = {};
var Cp;
function q1() {
  if (Cp) return ft;
  Cp = 1;
  var i = /* @__PURE__ */ Symbol.for("react.transitional.element"), l = /* @__PURE__ */ Symbol.for("react.portal"), s = /* @__PURE__ */ Symbol.for("react.fragment"), o = /* @__PURE__ */ Symbol.for("react.strict_mode"), c = /* @__PURE__ */ Symbol.for("react.profiler"), d = /* @__PURE__ */ Symbol.for("react.consumer"), f = /* @__PURE__ */ Symbol.for("react.context"), m = /* @__PURE__ */ Symbol.for("react.forward_ref"), y = /* @__PURE__ */ Symbol.for("react.suspense"), p = /* @__PURE__ */ Symbol.for("react.memo"), v = /* @__PURE__ */ Symbol.for("react.lazy"), b = /* @__PURE__ */ Symbol.for("react.activity"), T = Symbol.iterator;
  function O(A) {
    return A === null || typeof A != "object" ? null : (A = T && A[T] || A["@@iterator"], typeof A == "function" ? A : null);
  }
  var M = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, V = Object.assign, j = {};
  function _(A, N, K) {
    this.props = A, this.context = N, this.refs = j, this.updater = K || M;
  }
  _.prototype.isReactComponent = {}, _.prototype.setState = function(A, N) {
    if (typeof A != "object" && typeof A != "function" && A != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, A, N, "setState");
  }, _.prototype.forceUpdate = function(A) {
    this.updater.enqueueForceUpdate(this, A, "forceUpdate");
  };
  function G() {
  }
  G.prototype = _.prototype;
  function Y(A, N, K) {
    this.props = A, this.context = N, this.refs = j, this.updater = K || M;
  }
  var q = Y.prototype = new G();
  q.constructor = Y, V(q, _.prototype), q.isPureReactComponent = !0;
  var F = Array.isArray;
  function st() {
  }
  var Q = { H: null, A: null, T: null, S: null }, U = Object.prototype.hasOwnProperty;
  function $(A, N, K) {
    var J = K.ref;
    return {
      $$typeof: i,
      type: A,
      key: N,
      ref: J !== void 0 ? J : null,
      props: K
    };
  }
  function I(A, N) {
    return $(A.type, N, A.props);
  }
  function ct(A) {
    return typeof A == "object" && A !== null && A.$$typeof === i;
  }
  function gt(A) {
    var N = { "=": "=0", ":": "=2" };
    return "$" + A.replace(/[=:]/g, function(K) {
      return N[K];
    });
  }
  var jt = /\/+/g;
  function Rt(A, N) {
    return typeof A == "object" && A !== null && A.key != null ? gt("" + A.key) : N.toString(36);
  }
  function Mt(A) {
    switch (A.status) {
      case "fulfilled":
        return A.value;
      case "rejected":
        throw A.reason;
      default:
        switch (typeof A.status == "string" ? A.then(st, st) : (A.status = "pending", A.then(
          function(N) {
            A.status === "pending" && (A.status = "fulfilled", A.value = N);
          },
          function(N) {
            A.status === "pending" && (A.status = "rejected", A.reason = N);
          }
        )), A.status) {
          case "fulfilled":
            return A.value;
          case "rejected":
            throw A.reason;
        }
    }
    throw A;
  }
  function R(A, N, K, J, tt) {
    var lt = typeof A;
    (lt === "undefined" || lt === "boolean") && (A = null);
    var pt = !1;
    if (A === null) pt = !0;
    else
      switch (lt) {
        case "bigint":
        case "string":
        case "number":
          pt = !0;
          break;
        case "object":
          switch (A.$$typeof) {
            case i:
            case l:
              pt = !0;
              break;
            case v:
              return pt = A._init, R(
                pt(A._payload),
                N,
                K,
                J,
                tt
              );
          }
      }
    if (pt)
      return tt = tt(A), pt = J === "" ? "." + Rt(A, 0) : J, F(tt) ? (K = "", pt != null && (K = pt.replace(jt, "$&/") + "/"), R(tt, N, K, "", function(Ke) {
        return Ke;
      })) : tt != null && (ct(tt) && (tt = I(
        tt,
        K + (tt.key == null || A && A.key === tt.key ? "" : ("" + tt.key).replace(
          jt,
          "$&/"
        ) + "/") + pt
      )), N.push(tt)), 1;
    pt = 0;
    var Ht = J === "" ? "." : J + ":";
    if (F(A))
      for (var ht = 0; ht < A.length; ht++)
        J = A[ht], lt = Ht + Rt(J, ht), pt += R(
          J,
          N,
          K,
          lt,
          tt
        );
    else if (ht = O(A), typeof ht == "function")
      for (A = ht.call(A), ht = 0; !(J = A.next()).done; )
        J = J.value, lt = Ht + Rt(J, ht++), pt += R(
          J,
          N,
          K,
          lt,
          tt
        );
    else if (lt === "object") {
      if (typeof A.then == "function")
        return R(
          Mt(A),
          N,
          K,
          J,
          tt
        );
      throw N = String(A), Error(
        "Objects are not valid as a React child (found: " + (N === "[object Object]" ? "object with keys {" + Object.keys(A).join(", ") + "}" : N) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return pt;
  }
  function X(A, N, K) {
    if (A == null) return A;
    var J = [], tt = 0;
    return R(A, J, "", "", function(lt) {
      return N.call(K, lt, tt++);
    }), J;
  }
  function Z(A) {
    if (A._status === -1) {
      var N = A._result;
      N = N(), N.then(
        function(K) {
          (A._status === 0 || A._status === -1) && (A._status = 1, A._result = K);
        },
        function(K) {
          (A._status === 0 || A._status === -1) && (A._status = 2, A._result = K);
        }
      ), A._status === -1 && (A._status = 0, A._result = N);
    }
    if (A._status === 1) return A._result.default;
    throw A._result;
  }
  var ut = typeof reportError == "function" ? reportError : function(A) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var N = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof A == "object" && A !== null && typeof A.message == "string" ? String(A.message) : String(A),
        error: A
      });
      if (!window.dispatchEvent(N)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", A);
      return;
    }
    console.error(A);
  }, k = {
    map: X,
    forEach: function(A, N, K) {
      X(
        A,
        function() {
          N.apply(this, arguments);
        },
        K
      );
    },
    count: function(A) {
      var N = 0;
      return X(A, function() {
        N++;
      }), N;
    },
    toArray: function(A) {
      return X(A, function(N) {
        return N;
      }) || [];
    },
    only: function(A) {
      if (!ct(A))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return A;
    }
  };
  return ft.Activity = b, ft.Children = k, ft.Component = _, ft.Fragment = s, ft.Profiler = c, ft.PureComponent = Y, ft.StrictMode = o, ft.Suspense = y, ft.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = Q, ft.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(A) {
      return Q.H.useMemoCache(A);
    }
  }, ft.cache = function(A) {
    return function() {
      return A.apply(null, arguments);
    };
  }, ft.cacheSignal = function() {
    return null;
  }, ft.cloneElement = function(A, N, K) {
    if (A == null)
      throw Error(
        "The argument must be a React element, but you passed " + A + "."
      );
    var J = V({}, A.props), tt = A.key;
    if (N != null)
      for (lt in N.key !== void 0 && (tt = "" + N.key), N)
        !U.call(N, lt) || lt === "key" || lt === "__self" || lt === "__source" || lt === "ref" && N.ref === void 0 || (J[lt] = N[lt]);
    var lt = arguments.length - 2;
    if (lt === 1) J.children = K;
    else if (1 < lt) {
      for (var pt = Array(lt), Ht = 0; Ht < lt; Ht++)
        pt[Ht] = arguments[Ht + 2];
      J.children = pt;
    }
    return $(A.type, tt, J);
  }, ft.createContext = function(A) {
    return A = {
      $$typeof: f,
      _currentValue: A,
      _currentValue2: A,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, A.Provider = A, A.Consumer = {
      $$typeof: d,
      _context: A
    }, A;
  }, ft.createElement = function(A, N, K) {
    var J, tt = {}, lt = null;
    if (N != null)
      for (J in N.key !== void 0 && (lt = "" + N.key), N)
        U.call(N, J) && J !== "key" && J !== "__self" && J !== "__source" && (tt[J] = N[J]);
    var pt = arguments.length - 2;
    if (pt === 1) tt.children = K;
    else if (1 < pt) {
      for (var Ht = Array(pt), ht = 0; ht < pt; ht++)
        Ht[ht] = arguments[ht + 2];
      tt.children = Ht;
    }
    if (A && A.defaultProps)
      for (J in pt = A.defaultProps, pt)
        tt[J] === void 0 && (tt[J] = pt[J]);
    return $(A, lt, tt);
  }, ft.createRef = function() {
    return { current: null };
  }, ft.forwardRef = function(A) {
    return { $$typeof: m, render: A };
  }, ft.isValidElement = ct, ft.lazy = function(A) {
    return {
      $$typeof: v,
      _payload: { _status: -1, _result: A },
      _init: Z
    };
  }, ft.memo = function(A, N) {
    return {
      $$typeof: p,
      type: A,
      compare: N === void 0 ? null : N
    };
  }, ft.startTransition = function(A) {
    var N = Q.T, K = {};
    Q.T = K;
    try {
      var J = A(), tt = Q.S;
      tt !== null && tt(K, J), typeof J == "object" && J !== null && typeof J.then == "function" && J.then(st, ut);
    } catch (lt) {
      ut(lt);
    } finally {
      N !== null && K.types !== null && (N.types = K.types), Q.T = N;
    }
  }, ft.unstable_useCacheRefresh = function() {
    return Q.H.useCacheRefresh();
  }, ft.use = function(A) {
    return Q.H.use(A);
  }, ft.useActionState = function(A, N, K) {
    return Q.H.useActionState(A, N, K);
  }, ft.useCallback = function(A, N) {
    return Q.H.useCallback(A, N);
  }, ft.useContext = function(A) {
    return Q.H.useContext(A);
  }, ft.useDebugValue = function() {
  }, ft.useDeferredValue = function(A, N) {
    return Q.H.useDeferredValue(A, N);
  }, ft.useEffect = function(A, N) {
    return Q.H.useEffect(A, N);
  }, ft.useEffectEvent = function(A) {
    return Q.H.useEffectEvent(A);
  }, ft.useId = function() {
    return Q.H.useId();
  }, ft.useImperativeHandle = function(A, N, K) {
    return Q.H.useImperativeHandle(A, N, K);
  }, ft.useInsertionEffect = function(A, N) {
    return Q.H.useInsertionEffect(A, N);
  }, ft.useLayoutEffect = function(A, N) {
    return Q.H.useLayoutEffect(A, N);
  }, ft.useMemo = function(A, N) {
    return Q.H.useMemo(A, N);
  }, ft.useOptimistic = function(A, N) {
    return Q.H.useOptimistic(A, N);
  }, ft.useReducer = function(A, N, K) {
    return Q.H.useReducer(A, N, K);
  }, ft.useRef = function(A) {
    return Q.H.useRef(A);
  }, ft.useState = function(A) {
    return Q.H.useState(A);
  }, ft.useSyncExternalStore = function(A, N, K) {
    return Q.H.useSyncExternalStore(
      A,
      N,
      K
    );
  }, ft.useTransition = function() {
    return Q.H.useTransition();
  }, ft.version = "19.2.8", ft;
}
var Rp;
function Qc() {
  return Rp || (Rp = 1, Wu.exports = q1()), Wu.exports;
}
var it = Qc(), $u = { exports: {} }, Ml = {}, Iu = { exports: {} }, tc = {};
var Op;
function X1() {
  return Op || (Op = 1, (function(i) {
    function l(R, X) {
      var Z = R.length;
      R.push(X);
      t: for (; 0 < Z; ) {
        var ut = Z - 1 >>> 1, k = R[ut];
        if (0 < c(k, X))
          R[ut] = X, R[Z] = k, Z = ut;
        else break t;
      }
    }
    function s(R) {
      return R.length === 0 ? null : R[0];
    }
    function o(R) {
      if (R.length === 0) return null;
      var X = R[0], Z = R.pop();
      if (Z !== X) {
        R[0] = Z;
        t: for (var ut = 0, k = R.length, A = k >>> 1; ut < A; ) {
          var N = 2 * (ut + 1) - 1, K = R[N], J = N + 1, tt = R[J];
          if (0 > c(K, Z))
            J < k && 0 > c(tt, K) ? (R[ut] = tt, R[J] = Z, ut = J) : (R[ut] = K, R[N] = Z, ut = N);
          else if (J < k && 0 > c(tt, Z))
            R[ut] = tt, R[J] = Z, ut = J;
          else break t;
        }
      }
      return X;
    }
    function c(R, X) {
      var Z = R.sortIndex - X.sortIndex;
      return Z !== 0 ? Z : R.id - X.id;
    }
    if (i.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var d = performance;
      i.unstable_now = function() {
        return d.now();
      };
    } else {
      var f = Date, m = f.now();
      i.unstable_now = function() {
        return f.now() - m;
      };
    }
    var y = [], p = [], v = 1, b = null, T = 3, O = !1, M = !1, V = !1, j = !1, _ = typeof setTimeout == "function" ? setTimeout : null, G = typeof clearTimeout == "function" ? clearTimeout : null, Y = typeof setImmediate < "u" ? setImmediate : null;
    function q(R) {
      for (var X = s(p); X !== null; ) {
        if (X.callback === null) o(p);
        else if (X.startTime <= R)
          o(p), X.sortIndex = X.expirationTime, l(y, X);
        else break;
        X = s(p);
      }
    }
    function F(R) {
      if (V = !1, q(R), !M)
        if (s(y) !== null)
          M = !0, st || (st = !0, gt());
        else {
          var X = s(p);
          X !== null && Mt(F, X.startTime - R);
        }
    }
    var st = !1, Q = -1, U = 5, $ = -1;
    function I() {
      return j ? !0 : !(i.unstable_now() - $ < U);
    }
    function ct() {
      if (j = !1, st) {
        var R = i.unstable_now();
        $ = R;
        var X = !0;
        try {
          t: {
            M = !1, V && (V = !1, G(Q), Q = -1), O = !0;
            var Z = T;
            try {
              e: {
                for (q(R), b = s(y); b !== null && !(b.expirationTime > R && I()); ) {
                  var ut = b.callback;
                  if (typeof ut == "function") {
                    b.callback = null, T = b.priorityLevel;
                    var k = ut(
                      b.expirationTime <= R
                    );
                    if (R = i.unstable_now(), typeof k == "function") {
                      b.callback = k, q(R), X = !0;
                      break e;
                    }
                    b === s(y) && o(y), q(R);
                  } else o(y);
                  b = s(y);
                }
                if (b !== null) X = !0;
                else {
                  var A = s(p);
                  A !== null && Mt(
                    F,
                    A.startTime - R
                  ), X = !1;
                }
              }
              break t;
            } finally {
              b = null, T = Z, O = !1;
            }
            X = void 0;
          }
        } finally {
          X ? gt() : st = !1;
        }
      }
    }
    var gt;
    if (typeof Y == "function")
      gt = function() {
        Y(ct);
      };
    else if (typeof MessageChannel < "u") {
      var jt = new MessageChannel(), Rt = jt.port2;
      jt.port1.onmessage = ct, gt = function() {
        Rt.postMessage(null);
      };
    } else
      gt = function() {
        _(ct, 0);
      };
    function Mt(R, X) {
      Q = _(function() {
        R(i.unstable_now());
      }, X);
    }
    i.unstable_IdlePriority = 5, i.unstable_ImmediatePriority = 1, i.unstable_LowPriority = 4, i.unstable_NormalPriority = 3, i.unstable_Profiling = null, i.unstable_UserBlockingPriority = 2, i.unstable_cancelCallback = function(R) {
      R.callback = null;
    }, i.unstable_forceFrameRate = function(R) {
      0 > R || 125 < R ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : U = 0 < R ? Math.floor(1e3 / R) : 5;
    }, i.unstable_getCurrentPriorityLevel = function() {
      return T;
    }, i.unstable_next = function(R) {
      switch (T) {
        case 1:
        case 2:
        case 3:
          var X = 3;
          break;
        default:
          X = T;
      }
      var Z = T;
      T = X;
      try {
        return R();
      } finally {
        T = Z;
      }
    }, i.unstable_requestPaint = function() {
      j = !0;
    }, i.unstable_runWithPriority = function(R, X) {
      switch (R) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          R = 3;
      }
      var Z = T;
      T = R;
      try {
        return X();
      } finally {
        T = Z;
      }
    }, i.unstable_scheduleCallback = function(R, X, Z) {
      var ut = i.unstable_now();
      switch (typeof Z == "object" && Z !== null ? (Z = Z.delay, Z = typeof Z == "number" && 0 < Z ? ut + Z : ut) : Z = ut, R) {
        case 1:
          var k = -1;
          break;
        case 2:
          k = 250;
          break;
        case 5:
          k = 1073741823;
          break;
        case 4:
          k = 1e4;
          break;
        default:
          k = 5e3;
      }
      return k = Z + k, R = {
        id: v++,
        callback: X,
        priorityLevel: R,
        startTime: Z,
        expirationTime: k,
        sortIndex: -1
      }, Z > ut ? (R.sortIndex = Z, l(p, R), s(y) === null && R === s(p) && (V ? (G(Q), Q = -1) : V = !0, Mt(F, Z - ut))) : (R.sortIndex = k, l(y, R), M || O || (M = !0, st || (st = !0, gt()))), R;
    }, i.unstable_shouldYield = I, i.unstable_wrapCallback = function(R) {
      var X = T;
      return function() {
        var Z = T;
        T = X;
        try {
          return R.apply(this, arguments);
        } finally {
          T = Z;
        }
      };
    };
  })(tc)), tc;
}
var wp;
function k1() {
  return wp || (wp = 1, Iu.exports = X1()), Iu.exports;
}
var ec = { exports: {} }, ce = {};
var Vp;
function Q1() {
  if (Vp) return ce;
  Vp = 1;
  var i = Qc();
  function l(y) {
    var p = "https://react.dev/errors/" + y;
    if (1 < arguments.length) {
      p += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var v = 2; v < arguments.length; v++)
        p += "&args[]=" + encodeURIComponent(arguments[v]);
    }
    return "Minified React error #" + y + "; visit " + p + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function s() {
  }
  var o = {
    d: {
      f: s,
      r: function() {
        throw Error(l(522));
      },
      D: s,
      C: s,
      L: s,
      m: s,
      X: s,
      S: s,
      M: s
    },
    p: 0,
    findDOMNode: null
  }, c = /* @__PURE__ */ Symbol.for("react.portal");
  function d(y, p, v) {
    var b = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: c,
      key: b == null ? null : "" + b,
      children: y,
      containerInfo: p,
      implementation: v
    };
  }
  var f = i.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function m(y, p) {
    if (y === "font") return "";
    if (typeof p == "string")
      return p === "use-credentials" ? p : "";
  }
  return ce.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = o, ce.createPortal = function(y, p) {
    var v = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!p || p.nodeType !== 1 && p.nodeType !== 9 && p.nodeType !== 11)
      throw Error(l(299));
    return d(y, p, null, v);
  }, ce.flushSync = function(y) {
    var p = f.T, v = o.p;
    try {
      if (f.T = null, o.p = 2, y) return y();
    } finally {
      f.T = p, o.p = v, o.d.f();
    }
  }, ce.preconnect = function(y, p) {
    typeof y == "string" && (p ? (p = p.crossOrigin, p = typeof p == "string" ? p === "use-credentials" ? p : "" : void 0) : p = null, o.d.C(y, p));
  }, ce.prefetchDNS = function(y) {
    typeof y == "string" && o.d.D(y);
  }, ce.preinit = function(y, p) {
    if (typeof y == "string" && p && typeof p.as == "string") {
      var v = p.as, b = m(v, p.crossOrigin), T = typeof p.integrity == "string" ? p.integrity : void 0, O = typeof p.fetchPriority == "string" ? p.fetchPriority : void 0;
      v === "style" ? o.d.S(
        y,
        typeof p.precedence == "string" ? p.precedence : void 0,
        {
          crossOrigin: b,
          integrity: T,
          fetchPriority: O
        }
      ) : v === "script" && o.d.X(y, {
        crossOrigin: b,
        integrity: T,
        fetchPriority: O,
        nonce: typeof p.nonce == "string" ? p.nonce : void 0
      });
    }
  }, ce.preinitModule = function(y, p) {
    if (typeof y == "string")
      if (typeof p == "object" && p !== null) {
        if (p.as == null || p.as === "script") {
          var v = m(
            p.as,
            p.crossOrigin
          );
          o.d.M(y, {
            crossOrigin: v,
            integrity: typeof p.integrity == "string" ? p.integrity : void 0,
            nonce: typeof p.nonce == "string" ? p.nonce : void 0
          });
        }
      } else p == null && o.d.M(y);
  }, ce.preload = function(y, p) {
    if (typeof y == "string" && typeof p == "object" && p !== null && typeof p.as == "string") {
      var v = p.as, b = m(v, p.crossOrigin);
      o.d.L(y, v, {
        crossOrigin: b,
        integrity: typeof p.integrity == "string" ? p.integrity : void 0,
        nonce: typeof p.nonce == "string" ? p.nonce : void 0,
        type: typeof p.type == "string" ? p.type : void 0,
        fetchPriority: typeof p.fetchPriority == "string" ? p.fetchPriority : void 0,
        referrerPolicy: typeof p.referrerPolicy == "string" ? p.referrerPolicy : void 0,
        imageSrcSet: typeof p.imageSrcSet == "string" ? p.imageSrcSet : void 0,
        imageSizes: typeof p.imageSizes == "string" ? p.imageSizes : void 0,
        media: typeof p.media == "string" ? p.media : void 0
      });
    }
  }, ce.preloadModule = function(y, p) {
    if (typeof y == "string")
      if (p) {
        var v = m(p.as, p.crossOrigin);
        o.d.m(y, {
          as: typeof p.as == "string" && p.as !== "script" ? p.as : void 0,
          crossOrigin: v,
          integrity: typeof p.integrity == "string" ? p.integrity : void 0
        });
      } else o.d.m(y);
  }, ce.requestFormReset = function(y) {
    o.d.r(y);
  }, ce.unstable_batchedUpdates = function(y, p) {
    return y(p);
  }, ce.useFormState = function(y, p, v) {
    return f.H.useFormState(y, p, v);
  }, ce.useFormStatus = function() {
    return f.H.useHostTransitionStatus();
  }, ce.version = "19.2.8", ce;
}
var _p;
function Z1() {
  if (_p) return ec.exports;
  _p = 1;
  function i() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(i);
      } catch (l) {
        console.error(l);
      }
  }
  return i(), ec.exports = Q1(), ec.exports;
}
var Bp;
function K1() {
  if (Bp) return Ml;
  Bp = 1;
  var i = k1(), l = Qc(), s = Z1();
  function o(t) {
    var e = "https://react.dev/errors/" + t;
    if (1 < arguments.length) {
      e += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var n = 2; n < arguments.length; n++)
        e += "&args[]=" + encodeURIComponent(arguments[n]);
    }
    return "Minified React error #" + t + "; visit " + e + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function c(t) {
    return !(!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11);
  }
  function d(t) {
    var e = t, n = t;
    if (t.alternate) for (; e.return; ) e = e.return;
    else {
      t = e;
      do
        e = t, (e.flags & 4098) !== 0 && (n = e.return), t = e.return;
      while (t);
    }
    return e.tag === 3 ? n : null;
  }
  function f(t) {
    if (t.tag === 13) {
      var e = t.memoizedState;
      if (e === null && (t = t.alternate, t !== null && (e = t.memoizedState)), e !== null) return e.dehydrated;
    }
    return null;
  }
  function m(t) {
    if (t.tag === 31) {
      var e = t.memoizedState;
      if (e === null && (t = t.alternate, t !== null && (e = t.memoizedState)), e !== null) return e.dehydrated;
    }
    return null;
  }
  function y(t) {
    if (d(t) !== t)
      throw Error(o(188));
  }
  function p(t) {
    var e = t.alternate;
    if (!e) {
      if (e = d(t), e === null) throw Error(o(188));
      return e !== t ? null : t;
    }
    for (var n = t, a = e; ; ) {
      var r = n.return;
      if (r === null) break;
      var u = r.alternate;
      if (u === null) {
        if (a = r.return, a !== null) {
          n = a;
          continue;
        }
        break;
      }
      if (r.child === u.child) {
        for (u = r.child; u; ) {
          if (u === n) return y(r), t;
          if (u === a) return y(r), e;
          u = u.sibling;
        }
        throw Error(o(188));
      }
      if (n.return !== a.return) n = r, a = u;
      else {
        for (var h = !1, g = r.child; g; ) {
          if (g === n) {
            h = !0, n = r, a = u;
            break;
          }
          if (g === a) {
            h = !0, a = r, n = u;
            break;
          }
          g = g.sibling;
        }
        if (!h) {
          for (g = u.child; g; ) {
            if (g === n) {
              h = !0, n = u, a = r;
              break;
            }
            if (g === a) {
              h = !0, a = u, n = r;
              break;
            }
            g = g.sibling;
          }
          if (!h) throw Error(o(189));
        }
      }
      if (n.alternate !== a) throw Error(o(190));
    }
    if (n.tag !== 3) throw Error(o(188));
    return n.stateNode.current === n ? t : e;
  }
  function v(t) {
    var e = t.tag;
    if (e === 5 || e === 26 || e === 27 || e === 6) return t;
    for (t = t.child; t !== null; ) {
      if (e = v(t), e !== null) return e;
      t = t.sibling;
    }
    return null;
  }
  var b = Object.assign, T = /* @__PURE__ */ Symbol.for("react.element"), O = /* @__PURE__ */ Symbol.for("react.transitional.element"), M = /* @__PURE__ */ Symbol.for("react.portal"), V = /* @__PURE__ */ Symbol.for("react.fragment"), j = /* @__PURE__ */ Symbol.for("react.strict_mode"), _ = /* @__PURE__ */ Symbol.for("react.profiler"), G = /* @__PURE__ */ Symbol.for("react.consumer"), Y = /* @__PURE__ */ Symbol.for("react.context"), q = /* @__PURE__ */ Symbol.for("react.forward_ref"), F = /* @__PURE__ */ Symbol.for("react.suspense"), st = /* @__PURE__ */ Symbol.for("react.suspense_list"), Q = /* @__PURE__ */ Symbol.for("react.memo"), U = /* @__PURE__ */ Symbol.for("react.lazy"), $ = /* @__PURE__ */ Symbol.for("react.activity"), I = /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel"), ct = Symbol.iterator;
  function gt(t) {
    return t === null || typeof t != "object" ? null : (t = ct && t[ct] || t["@@iterator"], typeof t == "function" ? t : null);
  }
  var jt = /* @__PURE__ */ Symbol.for("react.client.reference");
  function Rt(t) {
    if (t == null) return null;
    if (typeof t == "function")
      return t.$$typeof === jt ? null : t.displayName || t.name || null;
    if (typeof t == "string") return t;
    switch (t) {
      case V:
        return "Fragment";
      case _:
        return "Profiler";
      case j:
        return "StrictMode";
      case F:
        return "Suspense";
      case st:
        return "SuspenseList";
      case $:
        return "Activity";
    }
    if (typeof t == "object")
      switch (t.$$typeof) {
        case M:
          return "Portal";
        case Y:
          return t.displayName || "Context";
        case G:
          return (t._context.displayName || "Context") + ".Consumer";
        case q:
          var e = t.render;
          return t = t.displayName, t || (t = e.displayName || e.name || "", t = t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef"), t;
        case Q:
          return e = t.displayName || null, e !== null ? e : Rt(t.type) || "Memo";
        case U:
          e = t._payload, t = t._init;
          try {
            return Rt(t(e));
          } catch {
          }
      }
    return null;
  }
  var Mt = Array.isArray, R = l.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, X = s.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Z = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, ut = [], k = -1;
  function A(t) {
    return { current: t };
  }
  function N(t) {
    0 > k || (t.current = ut[k], ut[k] = null, k--);
  }
  function K(t, e) {
    k++, ut[k] = t.current, t.current = e;
  }
  var J = A(null), tt = A(null), lt = A(null), pt = A(null);
  function Ht(t, e) {
    switch (K(lt, e), K(tt, t), K(J, null), e.nodeType) {
      case 9:
      case 11:
        t = (t = e.documentElement) && (t = t.namespaceURI) ? Fm(t) : 0;
        break;
      default:
        if (t = e.tagName, e = e.namespaceURI)
          e = Fm(e), t = Pm(e, t);
        else
          switch (t) {
            case "svg":
              t = 1;
              break;
            case "math":
              t = 2;
              break;
            default:
              t = 0;
          }
    }
    N(J), K(J, t);
  }
  function ht() {
    N(J), N(tt), N(lt);
  }
  function Ke(t) {
    t.memoizedState !== null && K(pt, t);
    var e = J.current, n = Pm(e, t.type);
    e !== n && (K(tt, t), K(J, n));
  }
  function Be(t) {
    tt.current === t && (N(J), N(tt)), pt.current === t && (N(pt), Sl._currentValue = Z);
  }
  var ie, cn;
  function fe(t) {
    if (ie === void 0)
      try {
        throw Error();
      } catch (n) {
        var e = n.stack.trim().match(/\n( *(at )?)/);
        ie = e && e[1] || "", cn = -1 < n.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < n.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + ie + t + cn;
  }
  var wa = !1;
  function Ni(t, e) {
    if (!t || wa) return "";
    wa = !0;
    var n = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var a = {
        DetermineComponentFrameRoot: function() {
          try {
            if (e) {
              var H = function() {
                throw Error();
              };
              if (Object.defineProperty(H.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(H, []);
                } catch (w) {
                  var C = w;
                }
                Reflect.construct(t, [], H);
              } else {
                try {
                  H.call();
                } catch (w) {
                  C = w;
                }
                t.call(H.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (w) {
                C = w;
              }
              (H = t()) && typeof H.catch == "function" && H.catch(function() {
              });
            }
          } catch (w) {
            if (w && C && typeof w.stack == "string")
              return [w.stack, C.stack];
          }
          return [null, null];
        }
      };
      a.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var r = Object.getOwnPropertyDescriptor(
        a.DetermineComponentFrameRoot,
        "name"
      );
      r && r.configurable && Object.defineProperty(
        a.DetermineComponentFrameRoot,
        "name",
        { value: "DetermineComponentFrameRoot" }
      );
      var u = a.DetermineComponentFrameRoot(), h = u[0], g = u[1];
      if (h && g) {
        var S = h.split(`
`), z = g.split(`
`);
        for (r = a = 0; a < S.length && !S[a].includes("DetermineComponentFrameRoot"); )
          a++;
        for (; r < z.length && !z[r].includes(
          "DetermineComponentFrameRoot"
        ); )
          r++;
        if (a === S.length || r === z.length)
          for (a = S.length - 1, r = z.length - 1; 1 <= a && 0 <= r && S[a] !== z[r]; )
            r--;
        for (; 1 <= a && 0 <= r; a--, r--)
          if (S[a] !== z[r]) {
            if (a !== 1 || r !== 1)
              do
                if (a--, r--, 0 > r || S[a] !== z[r]) {
                  var B = `
` + S[a].replace(" at new ", " at ");
                  return t.displayName && B.includes("<anonymous>") && (B = B.replace("<anonymous>", t.displayName)), B;
                }
              while (1 <= a && 0 <= r);
            break;
          }
      }
    } finally {
      wa = !1, Error.prepareStackTrace = n;
    }
    return (n = t ? t.displayName || t.name : "") ? fe(n) : "";
  }
  function ui(t, e) {
    switch (t.tag) {
      case 26:
      case 27:
      case 5:
        return fe(t.type);
      case 16:
        return fe("Lazy");
      case 13:
        return t.child !== e && e !== null ? fe("Suspense Fallback") : fe("Suspense");
      case 19:
        return fe("SuspenseList");
      case 0:
      case 15:
        return Ni(t.type, !1);
      case 11:
        return Ni(t.type.render, !1);
      case 1:
        return Ni(t.type, !0);
      case 31:
        return fe("Activity");
      default:
        return "";
    }
  }
  function Df(t) {
    try {
      var e = "", n = null;
      do
        e += ui(t, n), n = t, t = t.return;
      while (t);
      return e;
    } catch (a) {
      return `
Error generating stack: ` + a.message + `
` + a.stack;
    }
  }
  var Uo = Object.prototype.hasOwnProperty, No = i.unstable_scheduleCallback, Lo = i.unstable_cancelCallback, v0 = i.unstable_shouldYield, b0 = i.unstable_requestPaint, xe = i.unstable_now, S0 = i.unstable_getCurrentPriorityLevel, zf = i.unstable_ImmediatePriority, Cf = i.unstable_UserBlockingPriority, ql = i.unstable_NormalPriority, T0 = i.unstable_LowPriority, Rf = i.unstable_IdlePriority, A0 = i.log, x0 = i.unstable_setDisableYieldValue, Va = null, Ee = null;
  function wn(t) {
    if (typeof A0 == "function" && x0(t), Ee && typeof Ee.setStrictMode == "function")
      try {
        Ee.setStrictMode(Va, t);
      } catch {
      }
  }
  var Me = Math.clz32 ? Math.clz32 : D0, E0 = Math.log, M0 = Math.LN2;
  function D0(t) {
    return t >>>= 0, t === 0 ? 32 : 31 - (E0(t) / M0 | 0) | 0;
  }
  var Xl = 256, kl = 262144, Ql = 4194304;
  function ci(t) {
    var e = t & 42;
    if (e !== 0) return e;
    switch (t & -t) {
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
        return 64;
      case 128:
        return 128;
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
        return t & 261888;
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t & 3932160;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return t & 62914560;
      case 67108864:
        return 67108864;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 0;
      default:
        return t;
    }
  }
  function Zl(t, e, n) {
    var a = t.pendingLanes;
    if (a === 0) return 0;
    var r = 0, u = t.suspendedLanes, h = t.pingedLanes;
    t = t.warmLanes;
    var g = a & 134217727;
    return g !== 0 ? (a = g & ~u, a !== 0 ? r = ci(a) : (h &= g, h !== 0 ? r = ci(h) : n || (n = g & ~t, n !== 0 && (r = ci(n))))) : (g = a & ~u, g !== 0 ? r = ci(g) : h !== 0 ? r = ci(h) : n || (n = a & ~t, n !== 0 && (r = ci(n)))), r === 0 ? 0 : e !== 0 && e !== r && (e & u) === 0 && (u = r & -r, n = e & -e, u >= n || u === 32 && (n & 4194048) !== 0) ? e : r;
  }
  function _a(t, e) {
    return (t.pendingLanes & ~(t.suspendedLanes & ~t.pingedLanes) & e) === 0;
  }
  function z0(t, e) {
    switch (t) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return e + 250;
      case 16:
      case 32:
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
        return e + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return -1;
      case 67108864:
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function Of() {
    var t = Ql;
    return Ql <<= 1, (Ql & 62914560) === 0 && (Ql = 4194304), t;
  }
  function jo(t) {
    for (var e = [], n = 0; 31 > n; n++) e.push(t);
    return e;
  }
  function Ba(t, e) {
    t.pendingLanes |= e, e !== 268435456 && (t.suspendedLanes = 0, t.pingedLanes = 0, t.warmLanes = 0);
  }
  function C0(t, e, n, a, r, u) {
    var h = t.pendingLanes;
    t.pendingLanes = n, t.suspendedLanes = 0, t.pingedLanes = 0, t.warmLanes = 0, t.expiredLanes &= n, t.entangledLanes &= n, t.errorRecoveryDisabledLanes &= n, t.shellSuspendCounter = 0;
    var g = t.entanglements, S = t.expirationTimes, z = t.hiddenUpdates;
    for (n = h & ~n; 0 < n; ) {
      var B = 31 - Me(n), H = 1 << B;
      g[B] = 0, S[B] = -1;
      var C = z[B];
      if (C !== null)
        for (z[B] = null, B = 0; B < C.length; B++) {
          var w = C[B];
          w !== null && (w.lane &= -536870913);
        }
      n &= ~H;
    }
    a !== 0 && wf(t, a, 0), u !== 0 && r === 0 && t.tag !== 0 && (t.suspendedLanes |= u & ~(h & ~e));
  }
  function wf(t, e, n) {
    t.pendingLanes |= e, t.suspendedLanes &= ~e;
    var a = 31 - Me(e);
    t.entangledLanes |= e, t.entanglements[a] = t.entanglements[a] | 1073741824 | n & 261930;
  }
  function Vf(t, e) {
    var n = t.entangledLanes |= e;
    for (t = t.entanglements; n; ) {
      var a = 31 - Me(n), r = 1 << a;
      r & e | t[a] & e && (t[a] |= e), n &= ~r;
    }
  }
  function _f(t, e) {
    var n = e & -e;
    return n = (n & 42) !== 0 ? 1 : Ho(n), (n & (t.suspendedLanes | e)) !== 0 ? 0 : n;
  }
  function Ho(t) {
    switch (t) {
      case 2:
        t = 1;
        break;
      case 8:
        t = 4;
        break;
      case 32:
        t = 16;
        break;
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
        t = 128;
        break;
      case 268435456:
        t = 134217728;
        break;
      default:
        t = 0;
    }
    return t;
  }
  function Go(t) {
    return t &= -t, 2 < t ? 8 < t ? (t & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function Bf() {
    var t = X.p;
    return t !== 0 ? t : (t = window.event, t === void 0 ? 32 : bp(t.type));
  }
  function Uf(t, e) {
    var n = X.p;
    try {
      return X.p = t, e();
    } finally {
      X.p = n;
    }
  }
  var Vn = Math.random().toString(36).slice(2), ae = "__reactFiber$" + Vn, pe = "__reactProps$" + Vn, Li = "__reactContainer$" + Vn, Yo = "__reactEvents$" + Vn, R0 = "__reactListeners$" + Vn, O0 = "__reactHandles$" + Vn, Nf = "__reactResources$" + Vn, Ua = "__reactMarker$" + Vn;
  function qo(t) {
    delete t[ae], delete t[pe], delete t[Yo], delete t[R0], delete t[O0];
  }
  function ji(t) {
    var e = t[ae];
    if (e) return e;
    for (var n = t.parentNode; n; ) {
      if (e = n[Li] || n[ae]) {
        if (n = e.alternate, e.child !== null || n !== null && n.child !== null)
          for (t = ip(t); t !== null; ) {
            if (n = t[ae]) return n;
            t = ip(t);
          }
        return e;
      }
      t = n, n = t.parentNode;
    }
    return null;
  }
  function Hi(t) {
    if (t = t[ae] || t[Li]) {
      var e = t.tag;
      if (e === 5 || e === 6 || e === 13 || e === 31 || e === 26 || e === 27 || e === 3)
        return t;
    }
    return null;
  }
  function Na(t) {
    var e = t.tag;
    if (e === 5 || e === 26 || e === 27 || e === 6) return t.stateNode;
    throw Error(o(33));
  }
  function Gi(t) {
    var e = t[Nf];
    return e || (e = t[Nf] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), e;
  }
  function ee(t) {
    t[Ua] = !0;
  }
  var Lf = /* @__PURE__ */ new Set(), jf = {};
  function fi(t, e) {
    Yi(t, e), Yi(t + "Capture", e);
  }
  function Yi(t, e) {
    for (jf[t] = e, t = 0; t < e.length; t++)
      Lf.add(e[t]);
  }
  var w0 = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), Hf = {}, Gf = {};
  function V0(t) {
    return Uo.call(Gf, t) ? !0 : Uo.call(Hf, t) ? !1 : w0.test(t) ? Gf[t] = !0 : (Hf[t] = !0, !1);
  }
  function Kl(t, e, n) {
    if (V0(e))
      if (n === null) t.removeAttribute(e);
      else {
        switch (typeof n) {
          case "undefined":
          case "function":
          case "symbol":
            t.removeAttribute(e);
            return;
          case "boolean":
            var a = e.toLowerCase().slice(0, 5);
            if (a !== "data-" && a !== "aria-") {
              t.removeAttribute(e);
              return;
            }
        }
        t.setAttribute(e, "" + n);
      }
  }
  function Jl(t, e, n) {
    if (n === null) t.removeAttribute(e);
    else {
      switch (typeof n) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          t.removeAttribute(e);
          return;
      }
      t.setAttribute(e, "" + n);
    }
  }
  function fn(t, e, n, a) {
    if (a === null) t.removeAttribute(n);
    else {
      switch (typeof a) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          t.removeAttribute(n);
          return;
      }
      t.setAttributeNS(e, n, "" + a);
    }
  }
  function Ue(t) {
    switch (typeof t) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return t;
      case "object":
        return t;
      default:
        return "";
    }
  }
  function Yf(t) {
    var e = t.type;
    return (t = t.nodeName) && t.toLowerCase() === "input" && (e === "checkbox" || e === "radio");
  }
  function _0(t, e, n) {
    var a = Object.getOwnPropertyDescriptor(
      t.constructor.prototype,
      e
    );
    if (!t.hasOwnProperty(e) && typeof a < "u" && typeof a.get == "function" && typeof a.set == "function") {
      var r = a.get, u = a.set;
      return Object.defineProperty(t, e, {
        configurable: !0,
        get: function() {
          return r.call(this);
        },
        set: function(h) {
          n = "" + h, u.call(this, h);
        }
      }), Object.defineProperty(t, e, {
        enumerable: a.enumerable
      }), {
        getValue: function() {
          return n;
        },
        setValue: function(h) {
          n = "" + h;
        },
        stopTracking: function() {
          t._valueTracker = null, delete t[e];
        }
      };
    }
  }
  function Xo(t) {
    if (!t._valueTracker) {
      var e = Yf(t) ? "checked" : "value";
      t._valueTracker = _0(
        t,
        e,
        "" + t[e]
      );
    }
  }
  function qf(t) {
    if (!t) return !1;
    var e = t._valueTracker;
    if (!e) return !0;
    var n = e.getValue(), a = "";
    return t && (a = Yf(t) ? t.checked ? "true" : "false" : t.value), t = a, t !== n ? (e.setValue(t), !0) : !1;
  }
  function Fl(t) {
    if (t = t || (typeof document < "u" ? document : void 0), typeof t > "u") return null;
    try {
      return t.activeElement || t.body;
    } catch {
      return t.body;
    }
  }
  var B0 = /[\n"\\]/g;
  function Ne(t) {
    return t.replace(
      B0,
      function(e) {
        return "\\" + e.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function ko(t, e, n, a, r, u, h, g) {
    t.name = "", h != null && typeof h != "function" && typeof h != "symbol" && typeof h != "boolean" ? t.type = h : t.removeAttribute("type"), e != null ? h === "number" ? (e === 0 && t.value === "" || t.value != e) && (t.value = "" + Ue(e)) : t.value !== "" + Ue(e) && (t.value = "" + Ue(e)) : h !== "submit" && h !== "reset" || t.removeAttribute("value"), e != null ? Qo(t, h, Ue(e)) : n != null ? Qo(t, h, Ue(n)) : a != null && t.removeAttribute("value"), r == null && u != null && (t.defaultChecked = !!u), r != null && (t.checked = r && typeof r != "function" && typeof r != "symbol"), g != null && typeof g != "function" && typeof g != "symbol" && typeof g != "boolean" ? t.name = "" + Ue(g) : t.removeAttribute("name");
  }
  function Xf(t, e, n, a, r, u, h, g) {
    if (u != null && typeof u != "function" && typeof u != "symbol" && typeof u != "boolean" && (t.type = u), e != null || n != null) {
      if (!(u !== "submit" && u !== "reset" || e != null)) {
        Xo(t);
        return;
      }
      n = n != null ? "" + Ue(n) : "", e = e != null ? "" + Ue(e) : n, g || e === t.value || (t.value = e), t.defaultValue = e;
    }
    a = a ?? r, a = typeof a != "function" && typeof a != "symbol" && !!a, t.checked = g ? t.checked : !!a, t.defaultChecked = !!a, h != null && typeof h != "function" && typeof h != "symbol" && typeof h != "boolean" && (t.name = h), Xo(t);
  }
  function Qo(t, e, n) {
    e === "number" && Fl(t.ownerDocument) === t || t.defaultValue === "" + n || (t.defaultValue = "" + n);
  }
  function qi(t, e, n, a) {
    if (t = t.options, e) {
      e = {};
      for (var r = 0; r < n.length; r++)
        e["$" + n[r]] = !0;
      for (n = 0; n < t.length; n++)
        r = e.hasOwnProperty("$" + t[n].value), t[n].selected !== r && (t[n].selected = r), r && a && (t[n].defaultSelected = !0);
    } else {
      for (n = "" + Ue(n), e = null, r = 0; r < t.length; r++) {
        if (t[r].value === n) {
          t[r].selected = !0, a && (t[r].defaultSelected = !0);
          return;
        }
        e !== null || t[r].disabled || (e = t[r]);
      }
      e !== null && (e.selected = !0);
    }
  }
  function kf(t, e, n) {
    if (e != null && (e = "" + Ue(e), e !== t.value && (t.value = e), n == null)) {
      t.defaultValue !== e && (t.defaultValue = e);
      return;
    }
    t.defaultValue = n != null ? "" + Ue(n) : "";
  }
  function Qf(t, e, n, a) {
    if (e == null) {
      if (a != null) {
        if (n != null) throw Error(o(92));
        if (Mt(a)) {
          if (1 < a.length) throw Error(o(93));
          a = a[0];
        }
        n = a;
      }
      n == null && (n = ""), e = n;
    }
    n = Ue(e), t.defaultValue = n, a = t.textContent, a === n && a !== "" && a !== null && (t.value = a), Xo(t);
  }
  function Xi(t, e) {
    if (e) {
      var n = t.firstChild;
      if (n && n === t.lastChild && n.nodeType === 3) {
        n.nodeValue = e;
        return;
      }
    }
    t.textContent = e;
  }
  var U0 = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function Zf(t, e, n) {
    var a = e.indexOf("--") === 0;
    n == null || typeof n == "boolean" || n === "" ? a ? t.setProperty(e, "") : e === "float" ? t.cssFloat = "" : t[e] = "" : a ? t.setProperty(e, n) : typeof n != "number" || n === 0 || U0.has(e) ? e === "float" ? t.cssFloat = n : t[e] = ("" + n).trim() : t[e] = n + "px";
  }
  function Kf(t, e, n) {
    if (e != null && typeof e != "object")
      throw Error(o(62));
    if (t = t.style, n != null) {
      for (var a in n)
        !n.hasOwnProperty(a) || e != null && e.hasOwnProperty(a) || (a.indexOf("--") === 0 ? t.setProperty(a, "") : a === "float" ? t.cssFloat = "" : t[a] = "");
      for (var r in e)
        a = e[r], e.hasOwnProperty(r) && n[r] !== a && Zf(t, r, a);
    } else
      for (var u in e)
        e.hasOwnProperty(u) && Zf(t, u, e[u]);
  }
  function Zo(t) {
    if (t.indexOf("-") === -1) return !1;
    switch (t) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var N0 = /* @__PURE__ */ new Map([
    ["acceptCharset", "accept-charset"],
    ["htmlFor", "for"],
    ["httpEquiv", "http-equiv"],
    ["crossOrigin", "crossorigin"],
    ["accentHeight", "accent-height"],
    ["alignmentBaseline", "alignment-baseline"],
    ["arabicForm", "arabic-form"],
    ["baselineShift", "baseline-shift"],
    ["capHeight", "cap-height"],
    ["clipPath", "clip-path"],
    ["clipRule", "clip-rule"],
    ["colorInterpolation", "color-interpolation"],
    ["colorInterpolationFilters", "color-interpolation-filters"],
    ["colorProfile", "color-profile"],
    ["colorRendering", "color-rendering"],
    ["dominantBaseline", "dominant-baseline"],
    ["enableBackground", "enable-background"],
    ["fillOpacity", "fill-opacity"],
    ["fillRule", "fill-rule"],
    ["floodColor", "flood-color"],
    ["floodOpacity", "flood-opacity"],
    ["fontFamily", "font-family"],
    ["fontSize", "font-size"],
    ["fontSizeAdjust", "font-size-adjust"],
    ["fontStretch", "font-stretch"],
    ["fontStyle", "font-style"],
    ["fontVariant", "font-variant"],
    ["fontWeight", "font-weight"],
    ["glyphName", "glyph-name"],
    ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
    ["glyphOrientationVertical", "glyph-orientation-vertical"],
    ["horizAdvX", "horiz-adv-x"],
    ["horizOriginX", "horiz-origin-x"],
    ["imageRendering", "image-rendering"],
    ["letterSpacing", "letter-spacing"],
    ["lightingColor", "lighting-color"],
    ["markerEnd", "marker-end"],
    ["markerMid", "marker-mid"],
    ["markerStart", "marker-start"],
    ["overlinePosition", "overline-position"],
    ["overlineThickness", "overline-thickness"],
    ["paintOrder", "paint-order"],
    ["panose-1", "panose-1"],
    ["pointerEvents", "pointer-events"],
    ["renderingIntent", "rendering-intent"],
    ["shapeRendering", "shape-rendering"],
    ["stopColor", "stop-color"],
    ["stopOpacity", "stop-opacity"],
    ["strikethroughPosition", "strikethrough-position"],
    ["strikethroughThickness", "strikethrough-thickness"],
    ["strokeDasharray", "stroke-dasharray"],
    ["strokeDashoffset", "stroke-dashoffset"],
    ["strokeLinecap", "stroke-linecap"],
    ["strokeLinejoin", "stroke-linejoin"],
    ["strokeMiterlimit", "stroke-miterlimit"],
    ["strokeOpacity", "stroke-opacity"],
    ["strokeWidth", "stroke-width"],
    ["textAnchor", "text-anchor"],
    ["textDecoration", "text-decoration"],
    ["textRendering", "text-rendering"],
    ["transformOrigin", "transform-origin"],
    ["underlinePosition", "underline-position"],
    ["underlineThickness", "underline-thickness"],
    ["unicodeBidi", "unicode-bidi"],
    ["unicodeRange", "unicode-range"],
    ["unitsPerEm", "units-per-em"],
    ["vAlphabetic", "v-alphabetic"],
    ["vHanging", "v-hanging"],
    ["vIdeographic", "v-ideographic"],
    ["vMathematical", "v-mathematical"],
    ["vectorEffect", "vector-effect"],
    ["vertAdvY", "vert-adv-y"],
    ["vertOriginX", "vert-origin-x"],
    ["vertOriginY", "vert-origin-y"],
    ["wordSpacing", "word-spacing"],
    ["writingMode", "writing-mode"],
    ["xmlnsXlink", "xmlns:xlink"],
    ["xHeight", "x-height"]
  ]), L0 = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Pl(t) {
    return L0.test("" + t) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : t;
  }
  function hn() {
  }
  var Ko = null;
  function Jo(t) {
    return t = t.target || t.srcElement || window, t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === 3 ? t.parentNode : t;
  }
  var ki = null, Qi = null;
  function Jf(t) {
    var e = Hi(t);
    if (e && (t = e.stateNode)) {
      var n = t[pe] || null;
      t: switch (t = e.stateNode, e.type) {
        case "input":
          if (ko(
            t,
            n.value,
            n.defaultValue,
            n.defaultValue,
            n.checked,
            n.defaultChecked,
            n.type,
            n.name
          ), e = n.name, n.type === "radio" && e != null) {
            for (n = t; n.parentNode; ) n = n.parentNode;
            for (n = n.querySelectorAll(
              'input[name="' + Ne(
                "" + e
              ) + '"][type="radio"]'
            ), e = 0; e < n.length; e++) {
              var a = n[e];
              if (a !== t && a.form === t.form) {
                var r = a[pe] || null;
                if (!r) throw Error(o(90));
                ko(
                  a,
                  r.value,
                  r.defaultValue,
                  r.defaultValue,
                  r.checked,
                  r.defaultChecked,
                  r.type,
                  r.name
                );
              }
            }
            for (e = 0; e < n.length; e++)
              a = n[e], a.form === t.form && qf(a);
          }
          break t;
        case "textarea":
          kf(t, n.value, n.defaultValue);
          break t;
        case "select":
          e = n.value, e != null && qi(t, !!n.multiple, e, !1);
      }
    }
  }
  var Fo = !1;
  function Ff(t, e, n) {
    if (Fo) return t(e, n);
    Fo = !0;
    try {
      var a = t(e);
      return a;
    } finally {
      if (Fo = !1, (ki !== null || Qi !== null) && (Ls(), ki && (e = ki, t = Qi, Qi = ki = null, Jf(e), t)))
        for (e = 0; e < t.length; e++) Jf(t[e]);
    }
  }
  function La(t, e) {
    var n = t.stateNode;
    if (n === null) return null;
    var a = n[pe] || null;
    if (a === null) return null;
    n = a[e];
    t: switch (e) {
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
        (a = !a.disabled) || (t = t.type, a = !(t === "button" || t === "input" || t === "select" || t === "textarea")), t = !a;
        break t;
      default:
        t = !1;
    }
    if (t) return null;
    if (n && typeof n != "function")
      throw Error(
        o(231, e, typeof n)
      );
    return n;
  }
  var dn = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), Po = !1;
  if (dn)
    try {
      var ja = {};
      Object.defineProperty(ja, "passive", {
        get: function() {
          Po = !0;
        }
      }), window.addEventListener("test", ja, ja), window.removeEventListener("test", ja, ja);
    } catch {
      Po = !1;
    }
  var _n = null, Wo = null, Wl = null;
  function Pf() {
    if (Wl) return Wl;
    var t, e = Wo, n = e.length, a, r = "value" in _n ? _n.value : _n.textContent, u = r.length;
    for (t = 0; t < n && e[t] === r[t]; t++) ;
    var h = n - t;
    for (a = 1; a <= h && e[n - a] === r[u - a]; a++) ;
    return Wl = r.slice(t, 1 < a ? 1 - a : void 0);
  }
  function $l(t) {
    var e = t.keyCode;
    return "charCode" in t ? (t = t.charCode, t === 0 && e === 13 && (t = 13)) : t = e, t === 10 && (t = 13), 32 <= t || t === 13 ? t : 0;
  }
  function Il() {
    return !0;
  }
  function Wf() {
    return !1;
  }
  function ye(t) {
    function e(n, a, r, u, h) {
      this._reactName = n, this._targetInst = r, this.type = a, this.nativeEvent = u, this.target = h, this.currentTarget = null;
      for (var g in t)
        t.hasOwnProperty(g) && (n = t[g], this[g] = n ? n(u) : u[g]);
      return this.isDefaultPrevented = (u.defaultPrevented != null ? u.defaultPrevented : u.returnValue === !1) ? Il : Wf, this.isPropagationStopped = Wf, this;
    }
    return b(e.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var n = this.nativeEvent;
        n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = Il);
      },
      stopPropagation: function() {
        var n = this.nativeEvent;
        n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = Il);
      },
      persist: function() {
      },
      isPersistent: Il
    }), e;
  }
  var hi = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(t) {
      return t.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, ts = ye(hi), Ha = b({}, hi, { view: 0, detail: 0 }), j0 = ye(Ha), $o, Io, Ga, es = b({}, Ha, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: er,
    button: 0,
    buttons: 0,
    relatedTarget: function(t) {
      return t.relatedTarget === void 0 ? t.fromElement === t.srcElement ? t.toElement : t.fromElement : t.relatedTarget;
    },
    movementX: function(t) {
      return "movementX" in t ? t.movementX : (t !== Ga && (Ga && t.type === "mousemove" ? ($o = t.screenX - Ga.screenX, Io = t.screenY - Ga.screenY) : Io = $o = 0, Ga = t), $o);
    },
    movementY: function(t) {
      return "movementY" in t ? t.movementY : Io;
    }
  }), $f = ye(es), H0 = b({}, es, { dataTransfer: 0 }), G0 = ye(H0), Y0 = b({}, Ha, { relatedTarget: 0 }), tr = ye(Y0), q0 = b({}, hi, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), X0 = ye(q0), k0 = b({}, hi, {
    clipboardData: function(t) {
      return "clipboardData" in t ? t.clipboardData : window.clipboardData;
    }
  }), Q0 = ye(k0), Z0 = b({}, hi, { data: 0 }), If = ye(Z0), K0 = {
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
  }, J0 = {
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
  }, F0 = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function P0(t) {
    var e = this.nativeEvent;
    return e.getModifierState ? e.getModifierState(t) : (t = F0[t]) ? !!e[t] : !1;
  }
  function er() {
    return P0;
  }
  var W0 = b({}, Ha, {
    key: function(t) {
      if (t.key) {
        var e = K0[t.key] || t.key;
        if (e !== "Unidentified") return e;
      }
      return t.type === "keypress" ? (t = $l(t), t === 13 ? "Enter" : String.fromCharCode(t)) : t.type === "keydown" || t.type === "keyup" ? J0[t.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: er,
    charCode: function(t) {
      return t.type === "keypress" ? $l(t) : 0;
    },
    keyCode: function(t) {
      return t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
    },
    which: function(t) {
      return t.type === "keypress" ? $l(t) : t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
    }
  }), $0 = ye(W0), I0 = b({}, es, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0
  }), th = ye(I0), tb = b({}, Ha, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: er
  }), eb = ye(tb), nb = b({}, hi, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), ib = ye(nb), ab = b({}, es, {
    deltaX: function(t) {
      return "deltaX" in t ? t.deltaX : "wheelDeltaX" in t ? -t.wheelDeltaX : 0;
    },
    deltaY: function(t) {
      return "deltaY" in t ? t.deltaY : "wheelDeltaY" in t ? -t.wheelDeltaY : "wheelDelta" in t ? -t.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), lb = ye(ab), sb = b({}, hi, {
    newState: 0,
    oldState: 0
  }), ob = ye(sb), rb = [9, 13, 27, 32], nr = dn && "CompositionEvent" in window, Ya = null;
  dn && "documentMode" in document && (Ya = document.documentMode);
  var ub = dn && "TextEvent" in window && !Ya, eh = dn && (!nr || Ya && 8 < Ya && 11 >= Ya), nh = " ", ih = !1;
  function ah(t, e) {
    switch (t) {
      case "keyup":
        return rb.indexOf(e.keyCode) !== -1;
      case "keydown":
        return e.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function lh(t) {
    return t = t.detail, typeof t == "object" && "data" in t ? t.data : null;
  }
  var Zi = !1;
  function cb(t, e) {
    switch (t) {
      case "compositionend":
        return lh(e);
      case "keypress":
        return e.which !== 32 ? null : (ih = !0, nh);
      case "textInput":
        return t = e.data, t === nh && ih ? null : t;
      default:
        return null;
    }
  }
  function fb(t, e) {
    if (Zi)
      return t === "compositionend" || !nr && ah(t, e) ? (t = Pf(), Wl = Wo = _n = null, Zi = !1, t) : null;
    switch (t) {
      case "paste":
        return null;
      case "keypress":
        if (!(e.ctrlKey || e.altKey || e.metaKey) || e.ctrlKey && e.altKey) {
          if (e.char && 1 < e.char.length)
            return e.char;
          if (e.which) return String.fromCharCode(e.which);
        }
        return null;
      case "compositionend":
        return eh && e.locale !== "ko" ? null : e.data;
      default:
        return null;
    }
  }
  var hb = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0
  };
  function sh(t) {
    var e = t && t.nodeName && t.nodeName.toLowerCase();
    return e === "input" ? !!hb[t.type] : e === "textarea";
  }
  function oh(t, e, n, a) {
    ki ? Qi ? Qi.push(a) : Qi = [a] : ki = a, e = ks(e, "onChange"), 0 < e.length && (n = new ts(
      "onChange",
      "change",
      null,
      n,
      a
    ), t.push({ event: n, listeners: e }));
  }
  var qa = null, Xa = null;
  function db(t) {
    Xm(t, 0);
  }
  function ns(t) {
    var e = Na(t);
    if (qf(e)) return t;
  }
  function rh(t, e) {
    if (t === "change") return e;
  }
  var uh = !1;
  if (dn) {
    var ir;
    if (dn) {
      var ar = "oninput" in document;
      if (!ar) {
        var ch = document.createElement("div");
        ch.setAttribute("oninput", "return;"), ar = typeof ch.oninput == "function";
      }
      ir = ar;
    } else ir = !1;
    uh = ir && (!document.documentMode || 9 < document.documentMode);
  }
  function fh() {
    qa && (qa.detachEvent("onpropertychange", hh), Xa = qa = null);
  }
  function hh(t) {
    if (t.propertyName === "value" && ns(Xa)) {
      var e = [];
      oh(
        e,
        Xa,
        t,
        Jo(t)
      ), Ff(db, e);
    }
  }
  function mb(t, e, n) {
    t === "focusin" ? (fh(), qa = e, Xa = n, qa.attachEvent("onpropertychange", hh)) : t === "focusout" && fh();
  }
  function pb(t) {
    if (t === "selectionchange" || t === "keyup" || t === "keydown")
      return ns(Xa);
  }
  function yb(t, e) {
    if (t === "click") return ns(e);
  }
  function gb(t, e) {
    if (t === "input" || t === "change")
      return ns(e);
  }
  function vb(t, e) {
    return t === e && (t !== 0 || 1 / t === 1 / e) || t !== t && e !== e;
  }
  var De = typeof Object.is == "function" ? Object.is : vb;
  function ka(t, e) {
    if (De(t, e)) return !0;
    if (typeof t != "object" || t === null || typeof e != "object" || e === null)
      return !1;
    var n = Object.keys(t), a = Object.keys(e);
    if (n.length !== a.length) return !1;
    for (a = 0; a < n.length; a++) {
      var r = n[a];
      if (!Uo.call(e, r) || !De(t[r], e[r]))
        return !1;
    }
    return !0;
  }
  function dh(t) {
    for (; t && t.firstChild; ) t = t.firstChild;
    return t;
  }
  function mh(t, e) {
    var n = dh(t);
    t = 0;
    for (var a; n; ) {
      if (n.nodeType === 3) {
        if (a = t + n.textContent.length, t <= e && a >= e)
          return { node: n, offset: e - t };
        t = a;
      }
      t: {
        for (; n; ) {
          if (n.nextSibling) {
            n = n.nextSibling;
            break t;
          }
          n = n.parentNode;
        }
        n = void 0;
      }
      n = dh(n);
    }
  }
  function ph(t, e) {
    return t && e ? t === e ? !0 : t && t.nodeType === 3 ? !1 : e && e.nodeType === 3 ? ph(t, e.parentNode) : "contains" in t ? t.contains(e) : t.compareDocumentPosition ? !!(t.compareDocumentPosition(e) & 16) : !1 : !1;
  }
  function yh(t) {
    t = t != null && t.ownerDocument != null && t.ownerDocument.defaultView != null ? t.ownerDocument.defaultView : window;
    for (var e = Fl(t.document); e instanceof t.HTMLIFrameElement; ) {
      try {
        var n = typeof e.contentWindow.location.href == "string";
      } catch {
        n = !1;
      }
      if (n) t = e.contentWindow;
      else break;
      e = Fl(t.document);
    }
    return e;
  }
  function lr(t) {
    var e = t && t.nodeName && t.nodeName.toLowerCase();
    return e && (e === "input" && (t.type === "text" || t.type === "search" || t.type === "tel" || t.type === "url" || t.type === "password") || e === "textarea" || t.contentEditable === "true");
  }
  var bb = dn && "documentMode" in document && 11 >= document.documentMode, Ki = null, sr = null, Qa = null, or = !1;
  function gh(t, e, n) {
    var a = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    or || Ki == null || Ki !== Fl(a) || (a = Ki, "selectionStart" in a && lr(a) ? a = { start: a.selectionStart, end: a.selectionEnd } : (a = (a.ownerDocument && a.ownerDocument.defaultView || window).getSelection(), a = {
      anchorNode: a.anchorNode,
      anchorOffset: a.anchorOffset,
      focusNode: a.focusNode,
      focusOffset: a.focusOffset
    }), Qa && ka(Qa, a) || (Qa = a, a = ks(sr, "onSelect"), 0 < a.length && (e = new ts(
      "onSelect",
      "select",
      null,
      e,
      n
    ), t.push({ event: e, listeners: a }), e.target = Ki)));
  }
  function di(t, e) {
    var n = {};
    return n[t.toLowerCase()] = e.toLowerCase(), n["Webkit" + t] = "webkit" + e, n["Moz" + t] = "moz" + e, n;
  }
  var Ji = {
    animationend: di("Animation", "AnimationEnd"),
    animationiteration: di("Animation", "AnimationIteration"),
    animationstart: di("Animation", "AnimationStart"),
    transitionrun: di("Transition", "TransitionRun"),
    transitionstart: di("Transition", "TransitionStart"),
    transitioncancel: di("Transition", "TransitionCancel"),
    transitionend: di("Transition", "TransitionEnd")
  }, rr = {}, vh = {};
  dn && (vh = document.createElement("div").style, "AnimationEvent" in window || (delete Ji.animationend.animation, delete Ji.animationiteration.animation, delete Ji.animationstart.animation), "TransitionEvent" in window || delete Ji.transitionend.transition);
  function mi(t) {
    if (rr[t]) return rr[t];
    if (!Ji[t]) return t;
    var e = Ji[t], n;
    for (n in e)
      if (e.hasOwnProperty(n) && n in vh)
        return rr[t] = e[n];
    return t;
  }
  var bh = mi("animationend"), Sh = mi("animationiteration"), Th = mi("animationstart"), Sb = mi("transitionrun"), Tb = mi("transitionstart"), Ab = mi("transitioncancel"), Ah = mi("transitionend"), xh = /* @__PURE__ */ new Map(), ur = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  ur.push("scrollEnd");
  function Je(t, e) {
    xh.set(t, e), fi(e, [t]);
  }
  var is = typeof reportError == "function" ? reportError : function(t) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var e = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof t == "object" && t !== null && typeof t.message == "string" ? String(t.message) : String(t),
        error: t
      });
      if (!window.dispatchEvent(e)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", t);
      return;
    }
    console.error(t);
  }, Le = [], Fi = 0, cr = 0;
  function as() {
    for (var t = Fi, e = cr = Fi = 0; e < t; ) {
      var n = Le[e];
      Le[e++] = null;
      var a = Le[e];
      Le[e++] = null;
      var r = Le[e];
      Le[e++] = null;
      var u = Le[e];
      if (Le[e++] = null, a !== null && r !== null) {
        var h = a.pending;
        h === null ? r.next = r : (r.next = h.next, h.next = r), a.pending = r;
      }
      u !== 0 && Eh(n, r, u);
    }
  }
  function ls(t, e, n, a) {
    Le[Fi++] = t, Le[Fi++] = e, Le[Fi++] = n, Le[Fi++] = a, cr |= a, t.lanes |= a, t = t.alternate, t !== null && (t.lanes |= a);
  }
  function fr(t, e, n, a) {
    return ls(t, e, n, a), ss(t);
  }
  function pi(t, e) {
    return ls(t, null, null, e), ss(t);
  }
  function Eh(t, e, n) {
    t.lanes |= n;
    var a = t.alternate;
    a !== null && (a.lanes |= n);
    for (var r = !1, u = t.return; u !== null; )
      u.childLanes |= n, a = u.alternate, a !== null && (a.childLanes |= n), u.tag === 22 && (t = u.stateNode, t === null || t._visibility & 1 || (r = !0)), t = u, u = u.return;
    return t.tag === 3 ? (u = t.stateNode, r && e !== null && (r = 31 - Me(n), t = u.hiddenUpdates, a = t[r], a === null ? t[r] = [e] : a.push(e), e.lane = n | 536870912), u) : null;
  }
  function ss(t) {
    if (50 < dl)
      throw dl = 0, Su = null, Error(o(185));
    for (var e = t.return; e !== null; )
      t = e, e = t.return;
    return t.tag === 3 ? t.stateNode : null;
  }
  var Pi = {};
  function xb(t, e, n, a) {
    this.tag = t, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = e, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = a, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function ze(t, e, n, a) {
    return new xb(t, e, n, a);
  }
  function hr(t) {
    return t = t.prototype, !(!t || !t.isReactComponent);
  }
  function mn(t, e) {
    var n = t.alternate;
    return n === null ? (n = ze(
      t.tag,
      e,
      t.key,
      t.mode
    ), n.elementType = t.elementType, n.type = t.type, n.stateNode = t.stateNode, n.alternate = t, t.alternate = n) : (n.pendingProps = e, n.type = t.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = t.flags & 65011712, n.childLanes = t.childLanes, n.lanes = t.lanes, n.child = t.child, n.memoizedProps = t.memoizedProps, n.memoizedState = t.memoizedState, n.updateQueue = t.updateQueue, e = t.dependencies, n.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }, n.sibling = t.sibling, n.index = t.index, n.ref = t.ref, n.refCleanup = t.refCleanup, n;
  }
  function Mh(t, e) {
    t.flags &= 65011714;
    var n = t.alternate;
    return n === null ? (t.childLanes = 0, t.lanes = e, t.child = null, t.subtreeFlags = 0, t.memoizedProps = null, t.memoizedState = null, t.updateQueue = null, t.dependencies = null, t.stateNode = null) : (t.childLanes = n.childLanes, t.lanes = n.lanes, t.child = n.child, t.subtreeFlags = 0, t.deletions = null, t.memoizedProps = n.memoizedProps, t.memoizedState = n.memoizedState, t.updateQueue = n.updateQueue, t.type = n.type, e = n.dependencies, t.dependencies = e === null ? null : {
      lanes: e.lanes,
      firstContext: e.firstContext
    }), t;
  }
  function os(t, e, n, a, r, u) {
    var h = 0;
    if (a = t, typeof t == "function") hr(t) && (h = 1);
    else if (typeof t == "string")
      h = C1(
        t,
        n,
        J.current
      ) ? 26 : t === "html" || t === "head" || t === "body" ? 27 : 5;
    else
      t: switch (t) {
        case $:
          return t = ze(31, n, e, r), t.elementType = $, t.lanes = u, t;
        case V:
          return yi(n.children, r, u, e);
        case j:
          h = 8, r |= 24;
          break;
        case _:
          return t = ze(12, n, e, r | 2), t.elementType = _, t.lanes = u, t;
        case F:
          return t = ze(13, n, e, r), t.elementType = F, t.lanes = u, t;
        case st:
          return t = ze(19, n, e, r), t.elementType = st, t.lanes = u, t;
        default:
          if (typeof t == "object" && t !== null)
            switch (t.$$typeof) {
              case Y:
                h = 10;
                break t;
              case G:
                h = 9;
                break t;
              case q:
                h = 11;
                break t;
              case Q:
                h = 14;
                break t;
              case U:
                h = 16, a = null;
                break t;
            }
          h = 29, n = Error(
            o(130, t === null ? "null" : typeof t, "")
          ), a = null;
      }
    return e = ze(h, n, e, r), e.elementType = t, e.type = a, e.lanes = u, e;
  }
  function yi(t, e, n, a) {
    return t = ze(7, t, a, e), t.lanes = n, t;
  }
  function dr(t, e, n) {
    return t = ze(6, t, null, e), t.lanes = n, t;
  }
  function Dh(t) {
    var e = ze(18, null, null, 0);
    return e.stateNode = t, e;
  }
  function mr(t, e, n) {
    return e = ze(
      4,
      t.children !== null ? t.children : [],
      t.key,
      e
    ), e.lanes = n, e.stateNode = {
      containerInfo: t.containerInfo,
      pendingChildren: null,
      implementation: t.implementation
    }, e;
  }
  var zh = /* @__PURE__ */ new WeakMap();
  function je(t, e) {
    if (typeof t == "object" && t !== null) {
      var n = zh.get(t);
      return n !== void 0 ? n : (e = {
        value: t,
        source: e,
        stack: Df(e)
      }, zh.set(t, e), e);
    }
    return {
      value: t,
      source: e,
      stack: Df(e)
    };
  }
  var Wi = [], $i = 0, rs = null, Za = 0, He = [], Ge = 0, Bn = null, tn = 1, en = "";
  function pn(t, e) {
    Wi[$i++] = Za, Wi[$i++] = rs, rs = t, Za = e;
  }
  function Ch(t, e, n) {
    He[Ge++] = tn, He[Ge++] = en, He[Ge++] = Bn, Bn = t;
    var a = tn;
    t = en;
    var r = 32 - Me(a) - 1;
    a &= ~(1 << r), n += 1;
    var u = 32 - Me(e) + r;
    if (30 < u) {
      var h = r - r % 5;
      u = (a & (1 << h) - 1).toString(32), a >>= h, r -= h, tn = 1 << 32 - Me(e) + r | n << r | a, en = u + t;
    } else
      tn = 1 << u | n << r | a, en = t;
  }
  function pr(t) {
    t.return !== null && (pn(t, 1), Ch(t, 1, 0));
  }
  function yr(t) {
    for (; t === rs; )
      rs = Wi[--$i], Wi[$i] = null, Za = Wi[--$i], Wi[$i] = null;
    for (; t === Bn; )
      Bn = He[--Ge], He[Ge] = null, en = He[--Ge], He[Ge] = null, tn = He[--Ge], He[Ge] = null;
  }
  function Rh(t, e) {
    He[Ge++] = tn, He[Ge++] = en, He[Ge++] = Bn, tn = e.id, en = e.overflow, Bn = t;
  }
  var le = null, Nt = null, At = !1, Un = null, Ye = !1, gr = Error(o(519));
  function Nn(t) {
    var e = Error(
      o(
        418,
        1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML",
        ""
      )
    );
    throw Ka(je(e, t)), gr;
  }
  function Oh(t) {
    var e = t.stateNode, n = t.type, a = t.memoizedProps;
    switch (e[ae] = t, e[pe] = a, n) {
      case "dialog":
        bt("cancel", e), bt("close", e);
        break;
      case "iframe":
      case "object":
      case "embed":
        bt("load", e);
        break;
      case "video":
      case "audio":
        for (n = 0; n < pl.length; n++)
          bt(pl[n], e);
        break;
      case "source":
        bt("error", e);
        break;
      case "img":
      case "image":
      case "link":
        bt("error", e), bt("load", e);
        break;
      case "details":
        bt("toggle", e);
        break;
      case "input":
        bt("invalid", e), Xf(
          e,
          a.value,
          a.defaultValue,
          a.checked,
          a.defaultChecked,
          a.type,
          a.name,
          !0
        );
        break;
      case "select":
        bt("invalid", e);
        break;
      case "textarea":
        bt("invalid", e), Qf(e, a.value, a.defaultValue, a.children);
    }
    n = a.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || e.textContent === "" + n || a.suppressHydrationWarning === !0 || Km(e.textContent, n) ? (a.popover != null && (bt("beforetoggle", e), bt("toggle", e)), a.onScroll != null && bt("scroll", e), a.onScrollEnd != null && bt("scrollend", e), a.onClick != null && (e.onclick = hn), e = !0) : e = !1, e || Nn(t, !0);
  }
  function wh(t) {
    for (le = t.return; le; )
      switch (le.tag) {
        case 5:
        case 31:
        case 13:
          Ye = !1;
          return;
        case 27:
        case 3:
          Ye = !0;
          return;
        default:
          le = le.return;
      }
  }
  function Ii(t) {
    if (t !== le) return !1;
    if (!At) return wh(t), At = !0, !1;
    var e = t.tag, n;
    if ((n = e !== 3 && e !== 27) && ((n = e === 5) && (n = t.type, n = !(n !== "form" && n !== "button") || Uu(t.type, t.memoizedProps)), n = !n), n && Nt && Nn(t), wh(t), e === 13) {
      if (t = t.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(o(317));
      Nt = np(t);
    } else if (e === 31) {
      if (t = t.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(o(317));
      Nt = np(t);
    } else
      e === 27 ? (e = Nt, Pn(t.type) ? (t = Gu, Gu = null, Nt = t) : Nt = e) : Nt = le ? Xe(t.stateNode.nextSibling) : null;
    return !0;
  }
  function gi() {
    Nt = le = null, At = !1;
  }
  function vr() {
    var t = Un;
    return t !== null && (Se === null ? Se = t : Se.push.apply(
      Se,
      t
    ), Un = null), t;
  }
  function Ka(t) {
    Un === null ? Un = [t] : Un.push(t);
  }
  var br = A(null), vi = null, yn = null;
  function Ln(t, e, n) {
    K(br, e._currentValue), e._currentValue = n;
  }
  function gn(t) {
    t._currentValue = br.current, N(br);
  }
  function Sr(t, e, n) {
    for (; t !== null; ) {
      var a = t.alternate;
      if ((t.childLanes & e) !== e ? (t.childLanes |= e, a !== null && (a.childLanes |= e)) : a !== null && (a.childLanes & e) !== e && (a.childLanes |= e), t === n) break;
      t = t.return;
    }
  }
  function Tr(t, e, n, a) {
    var r = t.child;
    for (r !== null && (r.return = t); r !== null; ) {
      var u = r.dependencies;
      if (u !== null) {
        var h = r.child;
        u = u.firstContext;
        t: for (; u !== null; ) {
          var g = u;
          u = r;
          for (var S = 0; S < e.length; S++)
            if (g.context === e[S]) {
              u.lanes |= n, g = u.alternate, g !== null && (g.lanes |= n), Sr(
                u.return,
                n,
                t
              ), a || (h = null);
              break t;
            }
          u = g.next;
        }
      } else if (r.tag === 18) {
        if (h = r.return, h === null) throw Error(o(341));
        h.lanes |= n, u = h.alternate, u !== null && (u.lanes |= n), Sr(h, n, t), h = null;
      } else h = r.child;
      if (h !== null) h.return = r;
      else
        for (h = r; h !== null; ) {
          if (h === t) {
            h = null;
            break;
          }
          if (r = h.sibling, r !== null) {
            r.return = h.return, h = r;
            break;
          }
          h = h.return;
        }
      r = h;
    }
  }
  function ta(t, e, n, a) {
    t = null;
    for (var r = e, u = !1; r !== null; ) {
      if (!u) {
        if ((r.flags & 524288) !== 0) u = !0;
        else if ((r.flags & 262144) !== 0) break;
      }
      if (r.tag === 10) {
        var h = r.alternate;
        if (h === null) throw Error(o(387));
        if (h = h.memoizedProps, h !== null) {
          var g = r.type;
          De(r.pendingProps.value, h.value) || (t !== null ? t.push(g) : t = [g]);
        }
      } else if (r === pt.current) {
        if (h = r.alternate, h === null) throw Error(o(387));
        h.memoizedState.memoizedState !== r.memoizedState.memoizedState && (t !== null ? t.push(Sl) : t = [Sl]);
      }
      r = r.return;
    }
    t !== null && Tr(
      e,
      t,
      n,
      a
    ), e.flags |= 262144;
  }
  function us(t) {
    for (t = t.firstContext; t !== null; ) {
      if (!De(
        t.context._currentValue,
        t.memoizedValue
      ))
        return !0;
      t = t.next;
    }
    return !1;
  }
  function bi(t) {
    vi = t, yn = null, t = t.dependencies, t !== null && (t.firstContext = null);
  }
  function se(t) {
    return Vh(vi, t);
  }
  function cs(t, e) {
    return vi === null && bi(t), Vh(t, e);
  }
  function Vh(t, e) {
    var n = e._currentValue;
    if (e = { context: e, memoizedValue: n, next: null }, yn === null) {
      if (t === null) throw Error(o(308));
      yn = e, t.dependencies = { lanes: 0, firstContext: e }, t.flags |= 524288;
    } else yn = yn.next = e;
    return n;
  }
  var Eb = typeof AbortController < "u" ? AbortController : function() {
    var t = [], e = this.signal = {
      aborted: !1,
      addEventListener: function(n, a) {
        t.push(a);
      }
    };
    this.abort = function() {
      e.aborted = !0, t.forEach(function(n) {
        return n();
      });
    };
  }, Mb = i.unstable_scheduleCallback, Db = i.unstable_NormalPriority, Zt = {
    $$typeof: Y,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function Ar() {
    return {
      controller: new Eb(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function Ja(t) {
    t.refCount--, t.refCount === 0 && Mb(Db, function() {
      t.controller.abort();
    });
  }
  var Fa = null, xr = 0, ea = 0, na = null;
  function zb(t, e) {
    if (Fa === null) {
      var n = Fa = [];
      xr = 0, ea = Du(), na = {
        status: "pending",
        value: void 0,
        then: function(a) {
          n.push(a);
        }
      };
    }
    return xr++, e.then(_h, _h), e;
  }
  function _h() {
    if (--xr === 0 && Fa !== null) {
      na !== null && (na.status = "fulfilled");
      var t = Fa;
      Fa = null, ea = 0, na = null;
      for (var e = 0; e < t.length; e++) (0, t[e])();
    }
  }
  function Cb(t, e) {
    var n = [], a = {
      status: "pending",
      value: null,
      reason: null,
      then: function(r) {
        n.push(r);
      }
    };
    return t.then(
      function() {
        a.status = "fulfilled", a.value = e;
        for (var r = 0; r < n.length; r++) (0, n[r])(e);
      },
      function(r) {
        for (a.status = "rejected", a.reason = r, r = 0; r < n.length; r++)
          (0, n[r])(void 0);
      }
    ), a;
  }
  var Bh = R.S;
  R.S = function(t, e) {
    gm = xe(), typeof e == "object" && e !== null && typeof e.then == "function" && zb(t, e), Bh !== null && Bh(t, e);
  };
  var Si = A(null);
  function Er() {
    var t = Si.current;
    return t !== null ? t : Bt.pooledCache;
  }
  function fs(t, e) {
    e === null ? K(Si, Si.current) : K(Si, e.pool);
  }
  function Uh() {
    var t = Er();
    return t === null ? null : { parent: Zt._currentValue, pool: t };
  }
  var ia = Error(o(460)), Mr = Error(o(474)), hs = Error(o(542)), ds = { then: function() {
  } };
  function Nh(t) {
    return t = t.status, t === "fulfilled" || t === "rejected";
  }
  function Lh(t, e, n) {
    switch (n = t[n], n === void 0 ? t.push(e) : n !== e && (e.then(hn, hn), e = n), e.status) {
      case "fulfilled":
        return e.value;
      case "rejected":
        throw t = e.reason, Hh(t), t;
      default:
        if (typeof e.status == "string") e.then(hn, hn);
        else {
          if (t = Bt, t !== null && 100 < t.shellSuspendCounter)
            throw Error(o(482));
          t = e, t.status = "pending", t.then(
            function(a) {
              if (e.status === "pending") {
                var r = e;
                r.status = "fulfilled", r.value = a;
              }
            },
            function(a) {
              if (e.status === "pending") {
                var r = e;
                r.status = "rejected", r.reason = a;
              }
            }
          );
        }
        switch (e.status) {
          case "fulfilled":
            return e.value;
          case "rejected":
            throw t = e.reason, Hh(t), t;
        }
        throw Ai = e, ia;
    }
  }
  function Ti(t) {
    try {
      var e = t._init;
      return e(t._payload);
    } catch (n) {
      throw n !== null && typeof n == "object" && typeof n.then == "function" ? (Ai = n, ia) : n;
    }
  }
  var Ai = null;
  function jh() {
    if (Ai === null) throw Error(o(459));
    var t = Ai;
    return Ai = null, t;
  }
  function Hh(t) {
    if (t === ia || t === hs)
      throw Error(o(483));
  }
  var aa = null, Pa = 0;
  function ms(t) {
    var e = Pa;
    return Pa += 1, aa === null && (aa = []), Lh(aa, t, e);
  }
  function Wa(t, e) {
    e = e.props.ref, t.ref = e !== void 0 ? e : null;
  }
  function ps(t, e) {
    throw e.$$typeof === T ? Error(o(525)) : (t = Object.prototype.toString.call(e), Error(
      o(
        31,
        t === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : t
      )
    ));
  }
  function Gh(t) {
    function e(E, x) {
      if (t) {
        var D = E.deletions;
        D === null ? (E.deletions = [x], E.flags |= 16) : D.push(x);
      }
    }
    function n(E, x) {
      if (!t) return null;
      for (; x !== null; )
        e(E, x), x = x.sibling;
      return null;
    }
    function a(E) {
      for (var x = /* @__PURE__ */ new Map(); E !== null; )
        E.key !== null ? x.set(E.key, E) : x.set(E.index, E), E = E.sibling;
      return x;
    }
    function r(E, x) {
      return E = mn(E, x), E.index = 0, E.sibling = null, E;
    }
    function u(E, x, D) {
      return E.index = D, t ? (D = E.alternate, D !== null ? (D = D.index, D < x ? (E.flags |= 67108866, x) : D) : (E.flags |= 67108866, x)) : (E.flags |= 1048576, x);
    }
    function h(E) {
      return t && E.alternate === null && (E.flags |= 67108866), E;
    }
    function g(E, x, D, L) {
      return x === null || x.tag !== 6 ? (x = dr(D, E.mode, L), x.return = E, x) : (x = r(x, D), x.return = E, x);
    }
    function S(E, x, D, L) {
      var ot = D.type;
      return ot === V ? B(
        E,
        x,
        D.props.children,
        L,
        D.key
      ) : x !== null && (x.elementType === ot || typeof ot == "object" && ot !== null && ot.$$typeof === U && Ti(ot) === x.type) ? (x = r(x, D.props), Wa(x, D), x.return = E, x) : (x = os(
        D.type,
        D.key,
        D.props,
        null,
        E.mode,
        L
      ), Wa(x, D), x.return = E, x);
    }
    function z(E, x, D, L) {
      return x === null || x.tag !== 4 || x.stateNode.containerInfo !== D.containerInfo || x.stateNode.implementation !== D.implementation ? (x = mr(D, E.mode, L), x.return = E, x) : (x = r(x, D.children || []), x.return = E, x);
    }
    function B(E, x, D, L, ot) {
      return x === null || x.tag !== 7 ? (x = yi(
        D,
        E.mode,
        L,
        ot
      ), x.return = E, x) : (x = r(x, D), x.return = E, x);
    }
    function H(E, x, D) {
      if (typeof x == "string" && x !== "" || typeof x == "number" || typeof x == "bigint")
        return x = dr(
          "" + x,
          E.mode,
          D
        ), x.return = E, x;
      if (typeof x == "object" && x !== null) {
        switch (x.$$typeof) {
          case O:
            return D = os(
              x.type,
              x.key,
              x.props,
              null,
              E.mode,
              D
            ), Wa(D, x), D.return = E, D;
          case M:
            return x = mr(
              x,
              E.mode,
              D
            ), x.return = E, x;
          case U:
            return x = Ti(x), H(E, x, D);
        }
        if (Mt(x) || gt(x))
          return x = yi(
            x,
            E.mode,
            D,
            null
          ), x.return = E, x;
        if (typeof x.then == "function")
          return H(E, ms(x), D);
        if (x.$$typeof === Y)
          return H(
            E,
            cs(E, x),
            D
          );
        ps(E, x);
      }
      return null;
    }
    function C(E, x, D, L) {
      var ot = x !== null ? x.key : null;
      if (typeof D == "string" && D !== "" || typeof D == "number" || typeof D == "bigint")
        return ot !== null ? null : g(E, x, "" + D, L);
      if (typeof D == "object" && D !== null) {
        switch (D.$$typeof) {
          case O:
            return D.key === ot ? S(E, x, D, L) : null;
          case M:
            return D.key === ot ? z(E, x, D, L) : null;
          case U:
            return D = Ti(D), C(E, x, D, L);
        }
        if (Mt(D) || gt(D))
          return ot !== null ? null : B(E, x, D, L, null);
        if (typeof D.then == "function")
          return C(
            E,
            x,
            ms(D),
            L
          );
        if (D.$$typeof === Y)
          return C(
            E,
            x,
            cs(E, D),
            L
          );
        ps(E, D);
      }
      return null;
    }
    function w(E, x, D, L, ot) {
      if (typeof L == "string" && L !== "" || typeof L == "number" || typeof L == "bigint")
        return E = E.get(D) || null, g(x, E, "" + L, ot);
      if (typeof L == "object" && L !== null) {
        switch (L.$$typeof) {
          case O:
            return E = E.get(
              L.key === null ? D : L.key
            ) || null, S(x, E, L, ot);
          case M:
            return E = E.get(
              L.key === null ? D : L.key
            ) || null, z(x, E, L, ot);
          case U:
            return L = Ti(L), w(
              E,
              x,
              D,
              L,
              ot
            );
        }
        if (Mt(L) || gt(L))
          return E = E.get(D) || null, B(x, E, L, ot, null);
        if (typeof L.then == "function")
          return w(
            E,
            x,
            D,
            ms(L),
            ot
          );
        if (L.$$typeof === Y)
          return w(
            E,
            x,
            D,
            cs(x, L),
            ot
          );
        ps(x, L);
      }
      return null;
    }
    function et(E, x, D, L) {
      for (var ot = null, xt = null, at = x, mt = x = 0, Tt = null; at !== null && mt < D.length; mt++) {
        at.index > mt ? (Tt = at, at = null) : Tt = at.sibling;
        var Et = C(
          E,
          at,
          D[mt],
          L
        );
        if (Et === null) {
          at === null && (at = Tt);
          break;
        }
        t && at && Et.alternate === null && e(E, at), x = u(Et, x, mt), xt === null ? ot = Et : xt.sibling = Et, xt = Et, at = Tt;
      }
      if (mt === D.length)
        return n(E, at), At && pn(E, mt), ot;
      if (at === null) {
        for (; mt < D.length; mt++)
          at = H(E, D[mt], L), at !== null && (x = u(
            at,
            x,
            mt
          ), xt === null ? ot = at : xt.sibling = at, xt = at);
        return At && pn(E, mt), ot;
      }
      for (at = a(at); mt < D.length; mt++)
        Tt = w(
          at,
          E,
          mt,
          D[mt],
          L
        ), Tt !== null && (t && Tt.alternate !== null && at.delete(
          Tt.key === null ? mt : Tt.key
        ), x = u(
          Tt,
          x,
          mt
        ), xt === null ? ot = Tt : xt.sibling = Tt, xt = Tt);
      return t && at.forEach(function(ei) {
        return e(E, ei);
      }), At && pn(E, mt), ot;
    }
    function rt(E, x, D, L) {
      if (D == null) throw Error(o(151));
      for (var ot = null, xt = null, at = x, mt = x = 0, Tt = null, Et = D.next(); at !== null && !Et.done; mt++, Et = D.next()) {
        at.index > mt ? (Tt = at, at = null) : Tt = at.sibling;
        var ei = C(E, at, Et.value, L);
        if (ei === null) {
          at === null && (at = Tt);
          break;
        }
        t && at && ei.alternate === null && e(E, at), x = u(ei, x, mt), xt === null ? ot = ei : xt.sibling = ei, xt = ei, at = Tt;
      }
      if (Et.done)
        return n(E, at), At && pn(E, mt), ot;
      if (at === null) {
        for (; !Et.done; mt++, Et = D.next())
          Et = H(E, Et.value, L), Et !== null && (x = u(Et, x, mt), xt === null ? ot = Et : xt.sibling = Et, xt = Et);
        return At && pn(E, mt), ot;
      }
      for (at = a(at); !Et.done; mt++, Et = D.next())
        Et = w(at, E, mt, Et.value, L), Et !== null && (t && Et.alternate !== null && at.delete(Et.key === null ? mt : Et.key), x = u(Et, x, mt), xt === null ? ot = Et : xt.sibling = Et, xt = Et);
      return t && at.forEach(function(H1) {
        return e(E, H1);
      }), At && pn(E, mt), ot;
    }
    function Vt(E, x, D, L) {
      if (typeof D == "object" && D !== null && D.type === V && D.key === null && (D = D.props.children), typeof D == "object" && D !== null) {
        switch (D.$$typeof) {
          case O:
            t: {
              for (var ot = D.key; x !== null; ) {
                if (x.key === ot) {
                  if (ot = D.type, ot === V) {
                    if (x.tag === 7) {
                      n(
                        E,
                        x.sibling
                      ), L = r(
                        x,
                        D.props.children
                      ), L.return = E, E = L;
                      break t;
                    }
                  } else if (x.elementType === ot || typeof ot == "object" && ot !== null && ot.$$typeof === U && Ti(ot) === x.type) {
                    n(
                      E,
                      x.sibling
                    ), L = r(x, D.props), Wa(L, D), L.return = E, E = L;
                    break t;
                  }
                  n(E, x);
                  break;
                } else e(E, x);
                x = x.sibling;
              }
              D.type === V ? (L = yi(
                D.props.children,
                E.mode,
                L,
                D.key
              ), L.return = E, E = L) : (L = os(
                D.type,
                D.key,
                D.props,
                null,
                E.mode,
                L
              ), Wa(L, D), L.return = E, E = L);
            }
            return h(E);
          case M:
            t: {
              for (ot = D.key; x !== null; ) {
                if (x.key === ot)
                  if (x.tag === 4 && x.stateNode.containerInfo === D.containerInfo && x.stateNode.implementation === D.implementation) {
                    n(
                      E,
                      x.sibling
                    ), L = r(x, D.children || []), L.return = E, E = L;
                    break t;
                  } else {
                    n(E, x);
                    break;
                  }
                else e(E, x);
                x = x.sibling;
              }
              L = mr(D, E.mode, L), L.return = E, E = L;
            }
            return h(E);
          case U:
            return D = Ti(D), Vt(
              E,
              x,
              D,
              L
            );
        }
        if (Mt(D))
          return et(
            E,
            x,
            D,
            L
          );
        if (gt(D)) {
          if (ot = gt(D), typeof ot != "function") throw Error(o(150));
          return D = ot.call(D), rt(
            E,
            x,
            D,
            L
          );
        }
        if (typeof D.then == "function")
          return Vt(
            E,
            x,
            ms(D),
            L
          );
        if (D.$$typeof === Y)
          return Vt(
            E,
            x,
            cs(E, D),
            L
          );
        ps(E, D);
      }
      return typeof D == "string" && D !== "" || typeof D == "number" || typeof D == "bigint" ? (D = "" + D, x !== null && x.tag === 6 ? (n(E, x.sibling), L = r(x, D), L.return = E, E = L) : (n(E, x), L = dr(D, E.mode, L), L.return = E, E = L), h(E)) : n(E, x);
    }
    return function(E, x, D, L) {
      try {
        Pa = 0;
        var ot = Vt(
          E,
          x,
          D,
          L
        );
        return aa = null, ot;
      } catch (at) {
        if (at === ia || at === hs) throw at;
        var xt = ze(29, at, null, E.mode);
        return xt.lanes = L, xt.return = E, xt;
      }
    };
  }
  var xi = Gh(!0), Yh = Gh(!1), jn = !1;
  function Dr(t) {
    t.updateQueue = {
      baseState: t.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function zr(t, e) {
    t = t.updateQueue, e.updateQueue === t && (e.updateQueue = {
      baseState: t.baseState,
      firstBaseUpdate: t.firstBaseUpdate,
      lastBaseUpdate: t.lastBaseUpdate,
      shared: t.shared,
      callbacks: null
    });
  }
  function Hn(t) {
    return { lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function Gn(t, e, n) {
    var a = t.updateQueue;
    if (a === null) return null;
    if (a = a.shared, (Dt & 2) !== 0) {
      var r = a.pending;
      return r === null ? e.next = e : (e.next = r.next, r.next = e), a.pending = e, e = ss(t), Eh(t, null, n), e;
    }
    return ls(t, a, e, n), ss(t);
  }
  function $a(t, e, n) {
    if (e = e.updateQueue, e !== null && (e = e.shared, (n & 4194048) !== 0)) {
      var a = e.lanes;
      a &= t.pendingLanes, n |= a, e.lanes = n, Vf(t, n);
    }
  }
  function Cr(t, e) {
    var n = t.updateQueue, a = t.alternate;
    if (a !== null && (a = a.updateQueue, n === a)) {
      var r = null, u = null;
      if (n = n.firstBaseUpdate, n !== null) {
        do {
          var h = {
            lane: n.lane,
            tag: n.tag,
            payload: n.payload,
            callback: null,
            next: null
          };
          u === null ? r = u = h : u = u.next = h, n = n.next;
        } while (n !== null);
        u === null ? r = u = e : u = u.next = e;
      } else r = u = e;
      n = {
        baseState: a.baseState,
        firstBaseUpdate: r,
        lastBaseUpdate: u,
        shared: a.shared,
        callbacks: a.callbacks
      }, t.updateQueue = n;
      return;
    }
    t = n.lastBaseUpdate, t === null ? n.firstBaseUpdate = e : t.next = e, n.lastBaseUpdate = e;
  }
  var Rr = !1;
  function Ia() {
    if (Rr) {
      var t = na;
      if (t !== null) throw t;
    }
  }
  function tl(t, e, n, a) {
    Rr = !1;
    var r = t.updateQueue;
    jn = !1;
    var u = r.firstBaseUpdate, h = r.lastBaseUpdate, g = r.shared.pending;
    if (g !== null) {
      r.shared.pending = null;
      var S = g, z = S.next;
      S.next = null, h === null ? u = z : h.next = z, h = S;
      var B = t.alternate;
      B !== null && (B = B.updateQueue, g = B.lastBaseUpdate, g !== h && (g === null ? B.firstBaseUpdate = z : g.next = z, B.lastBaseUpdate = S));
    }
    if (u !== null) {
      var H = r.baseState;
      h = 0, B = z = S = null, g = u;
      do {
        var C = g.lane & -536870913, w = C !== g.lane;
        if (w ? (St & C) === C : (a & C) === C) {
          C !== 0 && C === ea && (Rr = !0), B !== null && (B = B.next = {
            lane: 0,
            tag: g.tag,
            payload: g.payload,
            callback: null,
            next: null
          });
          t: {
            var et = t, rt = g;
            C = e;
            var Vt = n;
            switch (rt.tag) {
              case 1:
                if (et = rt.payload, typeof et == "function") {
                  H = et.call(Vt, H, C);
                  break t;
                }
                H = et;
                break t;
              case 3:
                et.flags = et.flags & -65537 | 128;
              case 0:
                if (et = rt.payload, C = typeof et == "function" ? et.call(Vt, H, C) : et, C == null) break t;
                H = b({}, H, C);
                break t;
              case 2:
                jn = !0;
            }
          }
          C = g.callback, C !== null && (t.flags |= 64, w && (t.flags |= 8192), w = r.callbacks, w === null ? r.callbacks = [C] : w.push(C));
        } else
          w = {
            lane: C,
            tag: g.tag,
            payload: g.payload,
            callback: g.callback,
            next: null
          }, B === null ? (z = B = w, S = H) : B = B.next = w, h |= C;
        if (g = g.next, g === null) {
          if (g = r.shared.pending, g === null)
            break;
          w = g, g = w.next, w.next = null, r.lastBaseUpdate = w, r.shared.pending = null;
        }
      } while (!0);
      B === null && (S = H), r.baseState = S, r.firstBaseUpdate = z, r.lastBaseUpdate = B, u === null && (r.shared.lanes = 0), Qn |= h, t.lanes = h, t.memoizedState = H;
    }
  }
  function qh(t, e) {
    if (typeof t != "function")
      throw Error(o(191, t));
    t.call(e);
  }
  function Xh(t, e) {
    var n = t.callbacks;
    if (n !== null)
      for (t.callbacks = null, t = 0; t < n.length; t++)
        qh(n[t], e);
  }
  var la = A(null), ys = A(0);
  function kh(t, e) {
    t = Dn, K(ys, t), K(la, e), Dn = t | e.baseLanes;
  }
  function Or() {
    K(ys, Dn), K(la, la.current);
  }
  function wr() {
    Dn = ys.current, N(la), N(ys);
  }
  var Ce = A(null), qe = null;
  function Yn(t) {
    var e = t.alternate;
    K(kt, kt.current & 1), K(Ce, t), qe === null && (e === null || la.current !== null || e.memoizedState !== null) && (qe = t);
  }
  function Vr(t) {
    K(kt, kt.current), K(Ce, t), qe === null && (qe = t);
  }
  function Qh(t) {
    t.tag === 22 ? (K(kt, kt.current), K(Ce, t), qe === null && (qe = t)) : qn();
  }
  function qn() {
    K(kt, kt.current), K(Ce, Ce.current);
  }
  function Re(t) {
    N(Ce), qe === t && (qe = null), N(kt);
  }
  var kt = A(0);
  function gs(t) {
    for (var e = t; e !== null; ) {
      if (e.tag === 13) {
        var n = e.memoizedState;
        if (n !== null && (n = n.dehydrated, n === null || ju(n) || Hu(n)))
          return e;
      } else if (e.tag === 19 && (e.memoizedProps.revealOrder === "forwards" || e.memoizedProps.revealOrder === "backwards" || e.memoizedProps.revealOrder === "unstable_legacy-backwards" || e.memoizedProps.revealOrder === "together")) {
        if ((e.flags & 128) !== 0) return e;
      } else if (e.child !== null) {
        e.child.return = e, e = e.child;
        continue;
      }
      if (e === t) break;
      for (; e.sibling === null; ) {
        if (e.return === null || e.return === t) return null;
        e = e.return;
      }
      e.sibling.return = e.return, e = e.sibling;
    }
    return null;
  }
  var vn = 0, dt = null, Ot = null, Kt = null, vs = !1, sa = !1, Ei = !1, bs = 0, el = 0, oa = null, Rb = 0;
  function Yt() {
    throw Error(o(321));
  }
  function _r(t, e) {
    if (e === null) return !1;
    for (var n = 0; n < e.length && n < t.length; n++)
      if (!De(t[n], e[n])) return !1;
    return !0;
  }
  function Br(t, e, n, a, r, u) {
    return vn = u, dt = e, e.memoizedState = null, e.updateQueue = null, e.lanes = 0, R.H = t === null || t.memoizedState === null ? Cd : Fr, Ei = !1, u = n(a, r), Ei = !1, sa && (u = Kh(
      e,
      n,
      a,
      r
    )), Zh(t), u;
  }
  function Zh(t) {
    R.H = al;
    var e = Ot !== null && Ot.next !== null;
    if (vn = 0, Kt = Ot = dt = null, vs = !1, el = 0, oa = null, e) throw Error(o(300));
    t === null || Jt || (t = t.dependencies, t !== null && us(t) && (Jt = !0));
  }
  function Kh(t, e, n, a) {
    dt = t;
    var r = 0;
    do {
      if (sa && (oa = null), el = 0, sa = !1, 25 <= r) throw Error(o(301));
      if (r += 1, Kt = Ot = null, t.updateQueue != null) {
        var u = t.updateQueue;
        u.lastEffect = null, u.events = null, u.stores = null, u.memoCache != null && (u.memoCache.index = 0);
      }
      R.H = Rd, u = e(n, a);
    } while (sa);
    return u;
  }
  function Ob() {
    var t = R.H, e = t.useState()[0];
    return e = typeof e.then == "function" ? nl(e) : e, t = t.useState()[0], (Ot !== null ? Ot.memoizedState : null) !== t && (dt.flags |= 1024), e;
  }
  function Ur() {
    var t = bs !== 0;
    return bs = 0, t;
  }
  function Nr(t, e, n) {
    e.updateQueue = t.updateQueue, e.flags &= -2053, t.lanes &= ~n;
  }
  function Lr(t) {
    if (vs) {
      for (t = t.memoizedState; t !== null; ) {
        var e = t.queue;
        e !== null && (e.pending = null), t = t.next;
      }
      vs = !1;
    }
    vn = 0, Kt = Ot = dt = null, sa = !1, el = bs = 0, oa = null;
  }
  function he() {
    var t = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return Kt === null ? dt.memoizedState = Kt = t : Kt = Kt.next = t, Kt;
  }
  function Qt() {
    if (Ot === null) {
      var t = dt.alternate;
      t = t !== null ? t.memoizedState : null;
    } else t = Ot.next;
    var e = Kt === null ? dt.memoizedState : Kt.next;
    if (e !== null)
      Kt = e, Ot = t;
    else {
      if (t === null)
        throw dt.alternate === null ? Error(o(467)) : Error(o(310));
      Ot = t, t = {
        memoizedState: Ot.memoizedState,
        baseState: Ot.baseState,
        baseQueue: Ot.baseQueue,
        queue: Ot.queue,
        next: null
      }, Kt === null ? dt.memoizedState = Kt = t : Kt = Kt.next = t;
    }
    return Kt;
  }
  function Ss() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function nl(t) {
    var e = el;
    return el += 1, oa === null && (oa = []), t = Lh(oa, t, e), e = dt, (Kt === null ? e.memoizedState : Kt.next) === null && (e = e.alternate, R.H = e === null || e.memoizedState === null ? Cd : Fr), t;
  }
  function Ts(t) {
    if (t !== null && typeof t == "object") {
      if (typeof t.then == "function") return nl(t);
      if (t.$$typeof === Y) return se(t);
    }
    throw Error(o(438, String(t)));
  }
  function jr(t) {
    var e = null, n = dt.updateQueue;
    if (n !== null && (e = n.memoCache), e == null) {
      var a = dt.alternate;
      a !== null && (a = a.updateQueue, a !== null && (a = a.memoCache, a != null && (e = {
        data: a.data.map(function(r) {
          return r.slice();
        }),
        index: 0
      })));
    }
    if (e == null && (e = { data: [], index: 0 }), n === null && (n = Ss(), dt.updateQueue = n), n.memoCache = e, n = e.data[e.index], n === void 0)
      for (n = e.data[e.index] = Array(t), a = 0; a < t; a++)
        n[a] = I;
    return e.index++, n;
  }
  function bn(t, e) {
    return typeof e == "function" ? e(t) : e;
  }
  function As(t) {
    var e = Qt();
    return Hr(e, Ot, t);
  }
  function Hr(t, e, n) {
    var a = t.queue;
    if (a === null) throw Error(o(311));
    a.lastRenderedReducer = n;
    var r = t.baseQueue, u = a.pending;
    if (u !== null) {
      if (r !== null) {
        var h = r.next;
        r.next = u.next, u.next = h;
      }
      e.baseQueue = r = u, a.pending = null;
    }
    if (u = t.baseState, r === null) t.memoizedState = u;
    else {
      e = r.next;
      var g = h = null, S = null, z = e, B = !1;
      do {
        var H = z.lane & -536870913;
        if (H !== z.lane ? (St & H) === H : (vn & H) === H) {
          var C = z.revertLane;
          if (C === 0)
            S !== null && (S = S.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: z.action,
              hasEagerState: z.hasEagerState,
              eagerState: z.eagerState,
              next: null
            }), H === ea && (B = !0);
          else if ((vn & C) === C) {
            z = z.next, C === ea && (B = !0);
            continue;
          } else
            H = {
              lane: 0,
              revertLane: z.revertLane,
              gesture: null,
              action: z.action,
              hasEagerState: z.hasEagerState,
              eagerState: z.eagerState,
              next: null
            }, S === null ? (g = S = H, h = u) : S = S.next = H, dt.lanes |= C, Qn |= C;
          H = z.action, Ei && n(u, H), u = z.hasEagerState ? z.eagerState : n(u, H);
        } else
          C = {
            lane: H,
            revertLane: z.revertLane,
            gesture: z.gesture,
            action: z.action,
            hasEagerState: z.hasEagerState,
            eagerState: z.eagerState,
            next: null
          }, S === null ? (g = S = C, h = u) : S = S.next = C, dt.lanes |= H, Qn |= H;
        z = z.next;
      } while (z !== null && z !== e);
      if (S === null ? h = u : S.next = g, !De(u, t.memoizedState) && (Jt = !0, B && (n = na, n !== null)))
        throw n;
      t.memoizedState = u, t.baseState = h, t.baseQueue = S, a.lastRenderedState = u;
    }
    return r === null && (a.lanes = 0), [t.memoizedState, a.dispatch];
  }
  function Gr(t) {
    var e = Qt(), n = e.queue;
    if (n === null) throw Error(o(311));
    n.lastRenderedReducer = t;
    var a = n.dispatch, r = n.pending, u = e.memoizedState;
    if (r !== null) {
      n.pending = null;
      var h = r = r.next;
      do
        u = t(u, h.action), h = h.next;
      while (h !== r);
      De(u, e.memoizedState) || (Jt = !0), e.memoizedState = u, e.baseQueue === null && (e.baseState = u), n.lastRenderedState = u;
    }
    return [u, a];
  }
  function Jh(t, e, n) {
    var a = dt, r = Qt(), u = At;
    if (u) {
      if (n === void 0) throw Error(o(407));
      n = n();
    } else n = e();
    var h = !De(
      (Ot || r).memoizedState,
      n
    );
    if (h && (r.memoizedState = n, Jt = !0), r = r.queue, Xr(Wh.bind(null, a, r, t), [
      t
    ]), r.getSnapshot !== e || h || Kt !== null && Kt.memoizedState.tag & 1) {
      if (a.flags |= 2048, ra(
        9,
        { destroy: void 0 },
        Ph.bind(
          null,
          a,
          r,
          n,
          e
        ),
        null
      ), Bt === null) throw Error(o(349));
      u || (vn & 127) !== 0 || Fh(a, e, n);
    }
    return n;
  }
  function Fh(t, e, n) {
    t.flags |= 16384, t = { getSnapshot: e, value: n }, e = dt.updateQueue, e === null ? (e = Ss(), dt.updateQueue = e, e.stores = [t]) : (n = e.stores, n === null ? e.stores = [t] : n.push(t));
  }
  function Ph(t, e, n, a) {
    e.value = n, e.getSnapshot = a, $h(e) && Ih(t);
  }
  function Wh(t, e, n) {
    return n(function() {
      $h(e) && Ih(t);
    });
  }
  function $h(t) {
    var e = t.getSnapshot;
    t = t.value;
    try {
      var n = e();
      return !De(t, n);
    } catch {
      return !0;
    }
  }
  function Ih(t) {
    var e = pi(t, 2);
    e !== null && Te(e, t, 2);
  }
  function Yr(t) {
    var e = he();
    if (typeof t == "function") {
      var n = t;
      if (t = n(), Ei) {
        wn(!0);
        try {
          n();
        } finally {
          wn(!1);
        }
      }
    }
    return e.memoizedState = e.baseState = t, e.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: bn,
      lastRenderedState: t
    }, e;
  }
  function td(t, e, n, a) {
    return t.baseState = n, Hr(
      t,
      Ot,
      typeof a == "function" ? a : bn
    );
  }
  function wb(t, e, n, a, r) {
    if (Ms(t)) throw Error(o(485));
    if (t = e.action, t !== null) {
      var u = {
        payload: r,
        action: t,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function(h) {
          u.listeners.push(h);
        }
      };
      R.T !== null ? n(!0) : u.isTransition = !1, a(u), n = e.pending, n === null ? (u.next = e.pending = u, ed(e, u)) : (u.next = n.next, e.pending = n.next = u);
    }
  }
  function ed(t, e) {
    var n = e.action, a = e.payload, r = t.state;
    if (e.isTransition) {
      var u = R.T, h = {};
      R.T = h;
      try {
        var g = n(r, a), S = R.S;
        S !== null && S(h, g), nd(t, e, g);
      } catch (z) {
        qr(t, e, z);
      } finally {
        u !== null && h.types !== null && (u.types = h.types), R.T = u;
      }
    } else
      try {
        u = n(r, a), nd(t, e, u);
      } catch (z) {
        qr(t, e, z);
      }
  }
  function nd(t, e, n) {
    n !== null && typeof n == "object" && typeof n.then == "function" ? n.then(
      function(a) {
        id(t, e, a);
      },
      function(a) {
        return qr(t, e, a);
      }
    ) : id(t, e, n);
  }
  function id(t, e, n) {
    e.status = "fulfilled", e.value = n, ad(e), t.state = n, e = t.pending, e !== null && (n = e.next, n === e ? t.pending = null : (n = n.next, e.next = n, ed(t, n)));
  }
  function qr(t, e, n) {
    var a = t.pending;
    if (t.pending = null, a !== null) {
      a = a.next;
      do
        e.status = "rejected", e.reason = n, ad(e), e = e.next;
      while (e !== a);
    }
    t.action = null;
  }
  function ad(t) {
    t = t.listeners;
    for (var e = 0; e < t.length; e++) (0, t[e])();
  }
  function ld(t, e) {
    return e;
  }
  function sd(t, e) {
    if (At) {
      var n = Bt.formState;
      if (n !== null) {
        t: {
          var a = dt;
          if (At) {
            if (Nt) {
              e: {
                for (var r = Nt, u = Ye; r.nodeType !== 8; ) {
                  if (!u) {
                    r = null;
                    break e;
                  }
                  if (r = Xe(
                    r.nextSibling
                  ), r === null) {
                    r = null;
                    break e;
                  }
                }
                u = r.data, r = u === "F!" || u === "F" ? r : null;
              }
              if (r) {
                Nt = Xe(
                  r.nextSibling
                ), a = r.data === "F!";
                break t;
              }
            }
            Nn(a);
          }
          a = !1;
        }
        a && (e = n[0]);
      }
    }
    return n = he(), n.memoizedState = n.baseState = e, a = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: ld,
      lastRenderedState: e
    }, n.queue = a, n = Md.bind(
      null,
      dt,
      a
    ), a.dispatch = n, a = Yr(!1), u = Jr.bind(
      null,
      dt,
      !1,
      a.queue
    ), a = he(), r = {
      state: e,
      dispatch: null,
      action: t,
      pending: null
    }, a.queue = r, n = wb.bind(
      null,
      dt,
      r,
      u,
      n
    ), r.dispatch = n, a.memoizedState = t, [e, n, !1];
  }
  function od(t) {
    var e = Qt();
    return rd(e, Ot, t);
  }
  function rd(t, e, n) {
    if (e = Hr(
      t,
      e,
      ld
    )[0], t = As(bn)[0], typeof e == "object" && e !== null && typeof e.then == "function")
      try {
        var a = nl(e);
      } catch (h) {
        throw h === ia ? hs : h;
      }
    else a = e;
    e = Qt();
    var r = e.queue, u = r.dispatch;
    return n !== e.memoizedState && (dt.flags |= 2048, ra(
      9,
      { destroy: void 0 },
      Vb.bind(null, r, n),
      null
    )), [a, u, t];
  }
  function Vb(t, e) {
    t.action = e;
  }
  function ud(t) {
    var e = Qt(), n = Ot;
    if (n !== null)
      return rd(e, n, t);
    Qt(), e = e.memoizedState, n = Qt();
    var a = n.queue.dispatch;
    return n.memoizedState = t, [e, a, !1];
  }
  function ra(t, e, n, a) {
    return t = { tag: t, create: n, deps: a, inst: e, next: null }, e = dt.updateQueue, e === null && (e = Ss(), dt.updateQueue = e), n = e.lastEffect, n === null ? e.lastEffect = t.next = t : (a = n.next, n.next = t, t.next = a, e.lastEffect = t), t;
  }
  function cd() {
    return Qt().memoizedState;
  }
  function xs(t, e, n, a) {
    var r = he();
    dt.flags |= t, r.memoizedState = ra(
      1 | e,
      { destroy: void 0 },
      n,
      a === void 0 ? null : a
    );
  }
  function Es(t, e, n, a) {
    var r = Qt();
    a = a === void 0 ? null : a;
    var u = r.memoizedState.inst;
    Ot !== null && a !== null && _r(a, Ot.memoizedState.deps) ? r.memoizedState = ra(e, u, n, a) : (dt.flags |= t, r.memoizedState = ra(
      1 | e,
      u,
      n,
      a
    ));
  }
  function fd(t, e) {
    xs(8390656, 8, t, e);
  }
  function Xr(t, e) {
    Es(2048, 8, t, e);
  }
  function _b(t) {
    dt.flags |= 4;
    var e = dt.updateQueue;
    if (e === null)
      e = Ss(), dt.updateQueue = e, e.events = [t];
    else {
      var n = e.events;
      n === null ? e.events = [t] : n.push(t);
    }
  }
  function hd(t) {
    var e = Qt().memoizedState;
    return _b({ ref: e, nextImpl: t }), function() {
      if ((Dt & 2) !== 0) throw Error(o(440));
      return e.impl.apply(void 0, arguments);
    };
  }
  function dd(t, e) {
    return Es(4, 2, t, e);
  }
  function md(t, e) {
    return Es(4, 4, t, e);
  }
  function pd(t, e) {
    if (typeof e == "function") {
      t = t();
      var n = e(t);
      return function() {
        typeof n == "function" ? n() : e(null);
      };
    }
    if (e != null)
      return t = t(), e.current = t, function() {
        e.current = null;
      };
  }
  function yd(t, e, n) {
    n = n != null ? n.concat([t]) : null, Es(4, 4, pd.bind(null, e, t), n);
  }
  function kr() {
  }
  function gd(t, e) {
    var n = Qt();
    e = e === void 0 ? null : e;
    var a = n.memoizedState;
    return e !== null && _r(e, a[1]) ? a[0] : (n.memoizedState = [t, e], t);
  }
  function vd(t, e) {
    var n = Qt();
    e = e === void 0 ? null : e;
    var a = n.memoizedState;
    if (e !== null && _r(e, a[1]))
      return a[0];
    if (a = t(), Ei) {
      wn(!0);
      try {
        t();
      } finally {
        wn(!1);
      }
    }
    return n.memoizedState = [a, e], a;
  }
  function Qr(t, e, n) {
    return n === void 0 || (vn & 1073741824) !== 0 && (St & 261930) === 0 ? t.memoizedState = e : (t.memoizedState = n, t = bm(), dt.lanes |= t, Qn |= t, n);
  }
  function bd(t, e, n, a) {
    return De(n, e) ? n : la.current !== null ? (t = Qr(t, n, a), De(t, e) || (Jt = !0), t) : (vn & 42) === 0 || (vn & 1073741824) !== 0 && (St & 261930) === 0 ? (Jt = !0, t.memoizedState = n) : (t = bm(), dt.lanes |= t, Qn |= t, e);
  }
  function Sd(t, e, n, a, r) {
    var u = X.p;
    X.p = u !== 0 && 8 > u ? u : 8;
    var h = R.T, g = {};
    R.T = g, Jr(t, !1, e, n);
    try {
      var S = r(), z = R.S;
      if (z !== null && z(g, S), S !== null && typeof S == "object" && typeof S.then == "function") {
        var B = Cb(
          S,
          a
        );
        il(
          t,
          e,
          B,
          Ve(t)
        );
      } else
        il(
          t,
          e,
          a,
          Ve(t)
        );
    } catch (H) {
      il(
        t,
        e,
        { then: function() {
        }, status: "rejected", reason: H },
        Ve()
      );
    } finally {
      X.p = u, h !== null && g.types !== null && (h.types = g.types), R.T = h;
    }
  }
  function Bb() {
  }
  function Zr(t, e, n, a) {
    if (t.tag !== 5) throw Error(o(476));
    var r = Td(t).queue;
    Sd(
      t,
      r,
      e,
      Z,
      n === null ? Bb : function() {
        return Ad(t), n(a);
      }
    );
  }
  function Td(t) {
    var e = t.memoizedState;
    if (e !== null) return e;
    e = {
      memoizedState: Z,
      baseState: Z,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: bn,
        lastRenderedState: Z
      },
      next: null
    };
    var n = {};
    return e.next = {
      memoizedState: n,
      baseState: n,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: bn,
        lastRenderedState: n
      },
      next: null
    }, t.memoizedState = e, t = t.alternate, t !== null && (t.memoizedState = e), e;
  }
  function Ad(t) {
    var e = Td(t);
    e.next === null && (e = t.alternate.memoizedState), il(
      t,
      e.next.queue,
      {},
      Ve()
    );
  }
  function Kr() {
    return se(Sl);
  }
  function xd() {
    return Qt().memoizedState;
  }
  function Ed() {
    return Qt().memoizedState;
  }
  function Ub(t) {
    for (var e = t.return; e !== null; ) {
      switch (e.tag) {
        case 24:
        case 3:
          var n = Ve();
          t = Hn(n);
          var a = Gn(e, t, n);
          a !== null && (Te(a, e, n), $a(a, e, n)), e = { cache: Ar() }, t.payload = e;
          return;
      }
      e = e.return;
    }
  }
  function Nb(t, e, n) {
    var a = Ve();
    n = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, Ms(t) ? Dd(e, n) : (n = fr(t, e, n, a), n !== null && (Te(n, t, a), zd(n, e, a)));
  }
  function Md(t, e, n) {
    var a = Ve();
    il(t, e, n, a);
  }
  function il(t, e, n, a) {
    var r = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (Ms(t)) Dd(e, r);
    else {
      var u = t.alternate;
      if (t.lanes === 0 && (u === null || u.lanes === 0) && (u = e.lastRenderedReducer, u !== null))
        try {
          var h = e.lastRenderedState, g = u(h, n);
          if (r.hasEagerState = !0, r.eagerState = g, De(g, h))
            return ls(t, e, r, 0), Bt === null && as(), !1;
        } catch {
        }
      if (n = fr(t, e, r, a), n !== null)
        return Te(n, t, a), zd(n, e, a), !0;
    }
    return !1;
  }
  function Jr(t, e, n, a) {
    if (a = {
      lane: 2,
      revertLane: Du(),
      gesture: null,
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, Ms(t)) {
      if (e) throw Error(o(479));
    } else
      e = fr(
        t,
        n,
        a,
        2
      ), e !== null && Te(e, t, 2);
  }
  function Ms(t) {
    var e = t.alternate;
    return t === dt || e !== null && e === dt;
  }
  function Dd(t, e) {
    sa = vs = !0;
    var n = t.pending;
    n === null ? e.next = e : (e.next = n.next, n.next = e), t.pending = e;
  }
  function zd(t, e, n) {
    if ((n & 4194048) !== 0) {
      var a = e.lanes;
      a &= t.pendingLanes, n |= a, e.lanes = n, Vf(t, n);
    }
  }
  var al = {
    readContext: se,
    use: Ts,
    useCallback: Yt,
    useContext: Yt,
    useEffect: Yt,
    useImperativeHandle: Yt,
    useLayoutEffect: Yt,
    useInsertionEffect: Yt,
    useMemo: Yt,
    useReducer: Yt,
    useRef: Yt,
    useState: Yt,
    useDebugValue: Yt,
    useDeferredValue: Yt,
    useTransition: Yt,
    useSyncExternalStore: Yt,
    useId: Yt,
    useHostTransitionStatus: Yt,
    useFormState: Yt,
    useActionState: Yt,
    useOptimistic: Yt,
    useMemoCache: Yt,
    useCacheRefresh: Yt
  };
  al.useEffectEvent = Yt;
  var Cd = {
    readContext: se,
    use: Ts,
    useCallback: function(t, e) {
      return he().memoizedState = [
        t,
        e === void 0 ? null : e
      ], t;
    },
    useContext: se,
    useEffect: fd,
    useImperativeHandle: function(t, e, n) {
      n = n != null ? n.concat([t]) : null, xs(
        4194308,
        4,
        pd.bind(null, e, t),
        n
      );
    },
    useLayoutEffect: function(t, e) {
      return xs(4194308, 4, t, e);
    },
    useInsertionEffect: function(t, e) {
      xs(4, 2, t, e);
    },
    useMemo: function(t, e) {
      var n = he();
      e = e === void 0 ? null : e;
      var a = t();
      if (Ei) {
        wn(!0);
        try {
          t();
        } finally {
          wn(!1);
        }
      }
      return n.memoizedState = [a, e], a;
    },
    useReducer: function(t, e, n) {
      var a = he();
      if (n !== void 0) {
        var r = n(e);
        if (Ei) {
          wn(!0);
          try {
            n(e);
          } finally {
            wn(!1);
          }
        }
      } else r = e;
      return a.memoizedState = a.baseState = r, t = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: t,
        lastRenderedState: r
      }, a.queue = t, t = t.dispatch = Nb.bind(
        null,
        dt,
        t
      ), [a.memoizedState, t];
    },
    useRef: function(t) {
      var e = he();
      return t = { current: t }, e.memoizedState = t;
    },
    useState: function(t) {
      t = Yr(t);
      var e = t.queue, n = Md.bind(null, dt, e);
      return e.dispatch = n, [t.memoizedState, n];
    },
    useDebugValue: kr,
    useDeferredValue: function(t, e) {
      var n = he();
      return Qr(n, t, e);
    },
    useTransition: function() {
      var t = Yr(!1);
      return t = Sd.bind(
        null,
        dt,
        t.queue,
        !0,
        !1
      ), he().memoizedState = t, [!1, t];
    },
    useSyncExternalStore: function(t, e, n) {
      var a = dt, r = he();
      if (At) {
        if (n === void 0)
          throw Error(o(407));
        n = n();
      } else {
        if (n = e(), Bt === null)
          throw Error(o(349));
        (St & 127) !== 0 || Fh(a, e, n);
      }
      r.memoizedState = n;
      var u = { value: n, getSnapshot: e };
      return r.queue = u, fd(Wh.bind(null, a, u, t), [
        t
      ]), a.flags |= 2048, ra(
        9,
        { destroy: void 0 },
        Ph.bind(
          null,
          a,
          u,
          n,
          e
        ),
        null
      ), n;
    },
    useId: function() {
      var t = he(), e = Bt.identifierPrefix;
      if (At) {
        var n = en, a = tn;
        n = (a & ~(1 << 32 - Me(a) - 1)).toString(32) + n, e = "_" + e + "R_" + n, n = bs++, 0 < n && (e += "H" + n.toString(32)), e += "_";
      } else
        n = Rb++, e = "_" + e + "r_" + n.toString(32) + "_";
      return t.memoizedState = e;
    },
    useHostTransitionStatus: Kr,
    useFormState: sd,
    useActionState: sd,
    useOptimistic: function(t) {
      var e = he();
      e.memoizedState = e.baseState = t;
      var n = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return e.queue = n, e = Jr.bind(
        null,
        dt,
        !0,
        n
      ), n.dispatch = e, [t, e];
    },
    useMemoCache: jr,
    useCacheRefresh: function() {
      return he().memoizedState = Ub.bind(
        null,
        dt
      );
    },
    useEffectEvent: function(t) {
      var e = he(), n = { impl: t };
      return e.memoizedState = n, function() {
        if ((Dt & 2) !== 0)
          throw Error(o(440));
        return n.impl.apply(void 0, arguments);
      };
    }
  }, Fr = {
    readContext: se,
    use: Ts,
    useCallback: gd,
    useContext: se,
    useEffect: Xr,
    useImperativeHandle: yd,
    useInsertionEffect: dd,
    useLayoutEffect: md,
    useMemo: vd,
    useReducer: As,
    useRef: cd,
    useState: function() {
      return As(bn);
    },
    useDebugValue: kr,
    useDeferredValue: function(t, e) {
      var n = Qt();
      return bd(
        n,
        Ot.memoizedState,
        t,
        e
      );
    },
    useTransition: function() {
      var t = As(bn)[0], e = Qt().memoizedState;
      return [
        typeof t == "boolean" ? t : nl(t),
        e
      ];
    },
    useSyncExternalStore: Jh,
    useId: xd,
    useHostTransitionStatus: Kr,
    useFormState: od,
    useActionState: od,
    useOptimistic: function(t, e) {
      var n = Qt();
      return td(n, Ot, t, e);
    },
    useMemoCache: jr,
    useCacheRefresh: Ed
  };
  Fr.useEffectEvent = hd;
  var Rd = {
    readContext: se,
    use: Ts,
    useCallback: gd,
    useContext: se,
    useEffect: Xr,
    useImperativeHandle: yd,
    useInsertionEffect: dd,
    useLayoutEffect: md,
    useMemo: vd,
    useReducer: Gr,
    useRef: cd,
    useState: function() {
      return Gr(bn);
    },
    useDebugValue: kr,
    useDeferredValue: function(t, e) {
      var n = Qt();
      return Ot === null ? Qr(n, t, e) : bd(
        n,
        Ot.memoizedState,
        t,
        e
      );
    },
    useTransition: function() {
      var t = Gr(bn)[0], e = Qt().memoizedState;
      return [
        typeof t == "boolean" ? t : nl(t),
        e
      ];
    },
    useSyncExternalStore: Jh,
    useId: xd,
    useHostTransitionStatus: Kr,
    useFormState: ud,
    useActionState: ud,
    useOptimistic: function(t, e) {
      var n = Qt();
      return Ot !== null ? td(n, Ot, t, e) : (n.baseState = t, [t, n.queue.dispatch]);
    },
    useMemoCache: jr,
    useCacheRefresh: Ed
  };
  Rd.useEffectEvent = hd;
  function Pr(t, e, n, a) {
    e = t.memoizedState, n = n(a, e), n = n == null ? e : b({}, e, n), t.memoizedState = n, t.lanes === 0 && (t.updateQueue.baseState = n);
  }
  var Wr = {
    enqueueSetState: function(t, e, n) {
      t = t._reactInternals;
      var a = Ve(), r = Hn(a);
      r.payload = e, n != null && (r.callback = n), e = Gn(t, r, a), e !== null && (Te(e, t, a), $a(e, t, a));
    },
    enqueueReplaceState: function(t, e, n) {
      t = t._reactInternals;
      var a = Ve(), r = Hn(a);
      r.tag = 1, r.payload = e, n != null && (r.callback = n), e = Gn(t, r, a), e !== null && (Te(e, t, a), $a(e, t, a));
    },
    enqueueForceUpdate: function(t, e) {
      t = t._reactInternals;
      var n = Ve(), a = Hn(n);
      a.tag = 2, e != null && (a.callback = e), e = Gn(t, a, n), e !== null && (Te(e, t, n), $a(e, t, n));
    }
  };
  function Od(t, e, n, a, r, u, h) {
    return t = t.stateNode, typeof t.shouldComponentUpdate == "function" ? t.shouldComponentUpdate(a, u, h) : e.prototype && e.prototype.isPureReactComponent ? !ka(n, a) || !ka(r, u) : !0;
  }
  function wd(t, e, n, a) {
    t = e.state, typeof e.componentWillReceiveProps == "function" && e.componentWillReceiveProps(n, a), typeof e.UNSAFE_componentWillReceiveProps == "function" && e.UNSAFE_componentWillReceiveProps(n, a), e.state !== t && Wr.enqueueReplaceState(e, e.state, null);
  }
  function Mi(t, e) {
    var n = e;
    if ("ref" in e) {
      n = {};
      for (var a in e)
        a !== "ref" && (n[a] = e[a]);
    }
    if (t = t.defaultProps) {
      n === e && (n = b({}, n));
      for (var r in t)
        n[r] === void 0 && (n[r] = t[r]);
    }
    return n;
  }
  function Vd(t) {
    is(t);
  }
  function _d(t) {
    console.error(t);
  }
  function Bd(t) {
    is(t);
  }
  function Ds(t, e) {
    try {
      var n = t.onUncaughtError;
      n(e.value, { componentStack: e.stack });
    } catch (a) {
      setTimeout(function() {
        throw a;
      });
    }
  }
  function Ud(t, e, n) {
    try {
      var a = t.onCaughtError;
      a(n.value, {
        componentStack: n.stack,
        errorBoundary: e.tag === 1 ? e.stateNode : null
      });
    } catch (r) {
      setTimeout(function() {
        throw r;
      });
    }
  }
  function $r(t, e, n) {
    return n = Hn(n), n.tag = 3, n.payload = { element: null }, n.callback = function() {
      Ds(t, e);
    }, n;
  }
  function Nd(t) {
    return t = Hn(t), t.tag = 3, t;
  }
  function Ld(t, e, n, a) {
    var r = n.type.getDerivedStateFromError;
    if (typeof r == "function") {
      var u = a.value;
      t.payload = function() {
        return r(u);
      }, t.callback = function() {
        Ud(e, n, a);
      };
    }
    var h = n.stateNode;
    h !== null && typeof h.componentDidCatch == "function" && (t.callback = function() {
      Ud(e, n, a), typeof r != "function" && (Zn === null ? Zn = /* @__PURE__ */ new Set([this]) : Zn.add(this));
      var g = a.stack;
      this.componentDidCatch(a.value, {
        componentStack: g !== null ? g : ""
      });
    });
  }
  function Lb(t, e, n, a, r) {
    if (n.flags |= 32768, a !== null && typeof a == "object" && typeof a.then == "function") {
      if (e = n.alternate, e !== null && ta(
        e,
        n,
        r,
        !0
      ), n = Ce.current, n !== null) {
        switch (n.tag) {
          case 31:
          case 13:
            return qe === null ? js() : n.alternate === null && qt === 0 && (qt = 3), n.flags &= -257, n.flags |= 65536, n.lanes = r, a === ds ? n.flags |= 16384 : (e = n.updateQueue, e === null ? n.updateQueue = /* @__PURE__ */ new Set([a]) : e.add(a), xu(t, a, r)), !1;
          case 22:
            return n.flags |= 65536, a === ds ? n.flags |= 16384 : (e = n.updateQueue, e === null ? (e = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([a])
            }, n.updateQueue = e) : (n = e.retryQueue, n === null ? e.retryQueue = /* @__PURE__ */ new Set([a]) : n.add(a)), xu(t, a, r)), !1;
        }
        throw Error(o(435, n.tag));
      }
      return xu(t, a, r), js(), !1;
    }
    if (At)
      return e = Ce.current, e !== null ? ((e.flags & 65536) === 0 && (e.flags |= 256), e.flags |= 65536, e.lanes = r, a !== gr && (t = Error(o(422), { cause: a }), Ka(je(t, n)))) : (a !== gr && (e = Error(o(423), {
        cause: a
      }), Ka(
        je(e, n)
      )), t = t.current.alternate, t.flags |= 65536, r &= -r, t.lanes |= r, a = je(a, n), r = $r(
        t.stateNode,
        a,
        r
      ), Cr(t, r), qt !== 4 && (qt = 2)), !1;
    var u = Error(o(520), { cause: a });
    if (u = je(u, n), hl === null ? hl = [u] : hl.push(u), qt !== 4 && (qt = 2), e === null) return !0;
    a = je(a, n), n = e;
    do {
      switch (n.tag) {
        case 3:
          return n.flags |= 65536, t = r & -r, n.lanes |= t, t = $r(n.stateNode, a, t), Cr(n, t), !1;
        case 1:
          if (e = n.type, u = n.stateNode, (n.flags & 128) === 0 && (typeof e.getDerivedStateFromError == "function" || u !== null && typeof u.componentDidCatch == "function" && (Zn === null || !Zn.has(u))))
            return n.flags |= 65536, r &= -r, n.lanes |= r, r = Nd(r), Ld(
              r,
              t,
              n,
              a
            ), Cr(n, r), !1;
      }
      n = n.return;
    } while (n !== null);
    return !1;
  }
  var Ir = Error(o(461)), Jt = !1;
  function oe(t, e, n, a) {
    e.child = t === null ? Yh(e, null, n, a) : xi(
      e,
      t.child,
      n,
      a
    );
  }
  function jd(t, e, n, a, r) {
    n = n.render;
    var u = e.ref;
    if ("ref" in a) {
      var h = {};
      for (var g in a)
        g !== "ref" && (h[g] = a[g]);
    } else h = a;
    return bi(e), a = Br(
      t,
      e,
      n,
      h,
      u,
      r
    ), g = Ur(), t !== null && !Jt ? (Nr(t, e, r), Sn(t, e, r)) : (At && g && pr(e), e.flags |= 1, oe(t, e, a, r), e.child);
  }
  function Hd(t, e, n, a, r) {
    if (t === null) {
      var u = n.type;
      return typeof u == "function" && !hr(u) && u.defaultProps === void 0 && n.compare === null ? (e.tag = 15, e.type = u, Gd(
        t,
        e,
        u,
        a,
        r
      )) : (t = os(
        n.type,
        null,
        a,
        e,
        e.mode,
        r
      ), t.ref = e.ref, t.return = e, e.child = t);
    }
    if (u = t.child, !ou(t, r)) {
      var h = u.memoizedProps;
      if (n = n.compare, n = n !== null ? n : ka, n(h, a) && t.ref === e.ref)
        return Sn(t, e, r);
    }
    return e.flags |= 1, t = mn(u, a), t.ref = e.ref, t.return = e, e.child = t;
  }
  function Gd(t, e, n, a, r) {
    if (t !== null) {
      var u = t.memoizedProps;
      if (ka(u, a) && t.ref === e.ref)
        if (Jt = !1, e.pendingProps = a = u, ou(t, r))
          (t.flags & 131072) !== 0 && (Jt = !0);
        else
          return e.lanes = t.lanes, Sn(t, e, r);
    }
    return tu(
      t,
      e,
      n,
      a,
      r
    );
  }
  function Yd(t, e, n, a) {
    var r = a.children, u = t !== null ? t.memoizedState : null;
    if (t === null && e.stateNode === null && (e.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), a.mode === "hidden") {
      if ((e.flags & 128) !== 0) {
        if (u = u !== null ? u.baseLanes | n : n, t !== null) {
          for (a = e.child = t.child, r = 0; a !== null; )
            r = r | a.lanes | a.childLanes, a = a.sibling;
          a = r & ~u;
        } else a = 0, e.child = null;
        return qd(
          t,
          e,
          u,
          n,
          a
        );
      }
      if ((n & 536870912) !== 0)
        e.memoizedState = { baseLanes: 0, cachePool: null }, t !== null && fs(
          e,
          u !== null ? u.cachePool : null
        ), u !== null ? kh(e, u) : Or(), Qh(e);
      else
        return a = e.lanes = 536870912, qd(
          t,
          e,
          u !== null ? u.baseLanes | n : n,
          n,
          a
        );
    } else
      u !== null ? (fs(e, u.cachePool), kh(e, u), qn(), e.memoizedState = null) : (t !== null && fs(e, null), Or(), qn());
    return oe(t, e, r, n), e.child;
  }
  function ll(t, e) {
    return t !== null && t.tag === 22 || e.stateNode !== null || (e.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), e.sibling;
  }
  function qd(t, e, n, a, r) {
    var u = Er();
    return u = u === null ? null : { parent: Zt._currentValue, pool: u }, e.memoizedState = {
      baseLanes: n,
      cachePool: u
    }, t !== null && fs(e, null), Or(), Qh(e), t !== null && ta(t, e, a, !0), e.childLanes = r, null;
  }
  function zs(t, e) {
    return e = Rs(
      { mode: e.mode, children: e.children },
      t.mode
    ), e.ref = t.ref, t.child = e, e.return = t, e;
  }
  function Xd(t, e, n) {
    return xi(e, t.child, null, n), t = zs(e, e.pendingProps), t.flags |= 2, Re(e), e.memoizedState = null, t;
  }
  function jb(t, e, n) {
    var a = e.pendingProps, r = (e.flags & 128) !== 0;
    if (e.flags &= -129, t === null) {
      if (At) {
        if (a.mode === "hidden")
          return t = zs(e, a), e.lanes = 536870912, ll(null, t);
        if (Vr(e), (t = Nt) ? (t = ep(
          t,
          Ye
        ), t = t !== null && t.data === "&" ? t : null, t !== null && (e.memoizedState = {
          dehydrated: t,
          treeContext: Bn !== null ? { id: tn, overflow: en } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, n = Dh(t), n.return = e, e.child = n, le = e, Nt = null)) : t = null, t === null) throw Nn(e);
        return e.lanes = 536870912, null;
      }
      return zs(e, a);
    }
    var u = t.memoizedState;
    if (u !== null) {
      var h = u.dehydrated;
      if (Vr(e), r)
        if (e.flags & 256)
          e.flags &= -257, e = Xd(
            t,
            e,
            n
          );
        else if (e.memoizedState !== null)
          e.child = t.child, e.flags |= 128, e = null;
        else throw Error(o(558));
      else if (Jt || ta(t, e, n, !1), r = (n & t.childLanes) !== 0, Jt || r) {
        if (a = Bt, a !== null && (h = _f(a, n), h !== 0 && h !== u.retryLane))
          throw u.retryLane = h, pi(t, h), Te(a, t, h), Ir;
        js(), e = Xd(
          t,
          e,
          n
        );
      } else
        t = u.treeContext, Nt = Xe(h.nextSibling), le = e, At = !0, Un = null, Ye = !1, t !== null && Rh(e, t), e = zs(e, a), e.flags |= 4096;
      return e;
    }
    return t = mn(t.child, {
      mode: a.mode,
      children: a.children
    }), t.ref = e.ref, e.child = t, t.return = e, t;
  }
  function Cs(t, e) {
    var n = e.ref;
    if (n === null)
      t !== null && t.ref !== null && (e.flags |= 4194816);
    else {
      if (typeof n != "function" && typeof n != "object")
        throw Error(o(284));
      (t === null || t.ref !== n) && (e.flags |= 4194816);
    }
  }
  function tu(t, e, n, a, r) {
    return bi(e), n = Br(
      t,
      e,
      n,
      a,
      void 0,
      r
    ), a = Ur(), t !== null && !Jt ? (Nr(t, e, r), Sn(t, e, r)) : (At && a && pr(e), e.flags |= 1, oe(t, e, n, r), e.child);
  }
  function kd(t, e, n, a, r, u) {
    return bi(e), e.updateQueue = null, n = Kh(
      e,
      a,
      n,
      r
    ), Zh(t), a = Ur(), t !== null && !Jt ? (Nr(t, e, u), Sn(t, e, u)) : (At && a && pr(e), e.flags |= 1, oe(t, e, n, u), e.child);
  }
  function Qd(t, e, n, a, r) {
    if (bi(e), e.stateNode === null) {
      var u = Pi, h = n.contextType;
      typeof h == "object" && h !== null && (u = se(h)), u = new n(a, u), e.memoizedState = u.state !== null && u.state !== void 0 ? u.state : null, u.updater = Wr, e.stateNode = u, u._reactInternals = e, u = e.stateNode, u.props = a, u.state = e.memoizedState, u.refs = {}, Dr(e), h = n.contextType, u.context = typeof h == "object" && h !== null ? se(h) : Pi, u.state = e.memoizedState, h = n.getDerivedStateFromProps, typeof h == "function" && (Pr(
        e,
        n,
        h,
        a
      ), u.state = e.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof u.getSnapshotBeforeUpdate == "function" || typeof u.UNSAFE_componentWillMount != "function" && typeof u.componentWillMount != "function" || (h = u.state, typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount(), h !== u.state && Wr.enqueueReplaceState(u, u.state, null), tl(e, a, u, r), Ia(), u.state = e.memoizedState), typeof u.componentDidMount == "function" && (e.flags |= 4194308), a = !0;
    } else if (t === null) {
      u = e.stateNode;
      var g = e.memoizedProps, S = Mi(n, g);
      u.props = S;
      var z = u.context, B = n.contextType;
      h = Pi, typeof B == "object" && B !== null && (h = se(B));
      var H = n.getDerivedStateFromProps;
      B = typeof H == "function" || typeof u.getSnapshotBeforeUpdate == "function", g = e.pendingProps !== g, B || typeof u.UNSAFE_componentWillReceiveProps != "function" && typeof u.componentWillReceiveProps != "function" || (g || z !== h) && wd(
        e,
        u,
        a,
        h
      ), jn = !1;
      var C = e.memoizedState;
      u.state = C, tl(e, a, u, r), Ia(), z = e.memoizedState, g || C !== z || jn ? (typeof H == "function" && (Pr(
        e,
        n,
        H,
        a
      ), z = e.memoizedState), (S = jn || Od(
        e,
        n,
        S,
        a,
        C,
        z,
        h
      )) ? (B || typeof u.UNSAFE_componentWillMount != "function" && typeof u.componentWillMount != "function" || (typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount()), typeof u.componentDidMount == "function" && (e.flags |= 4194308)) : (typeof u.componentDidMount == "function" && (e.flags |= 4194308), e.memoizedProps = a, e.memoizedState = z), u.props = a, u.state = z, u.context = h, a = S) : (typeof u.componentDidMount == "function" && (e.flags |= 4194308), a = !1);
    } else {
      u = e.stateNode, zr(t, e), h = e.memoizedProps, B = Mi(n, h), u.props = B, H = e.pendingProps, C = u.context, z = n.contextType, S = Pi, typeof z == "object" && z !== null && (S = se(z)), g = n.getDerivedStateFromProps, (z = typeof g == "function" || typeof u.getSnapshotBeforeUpdate == "function") || typeof u.UNSAFE_componentWillReceiveProps != "function" && typeof u.componentWillReceiveProps != "function" || (h !== H || C !== S) && wd(
        e,
        u,
        a,
        S
      ), jn = !1, C = e.memoizedState, u.state = C, tl(e, a, u, r), Ia();
      var w = e.memoizedState;
      h !== H || C !== w || jn || t !== null && t.dependencies !== null && us(t.dependencies) ? (typeof g == "function" && (Pr(
        e,
        n,
        g,
        a
      ), w = e.memoizedState), (B = jn || Od(
        e,
        n,
        B,
        a,
        C,
        w,
        S
      ) || t !== null && t.dependencies !== null && us(t.dependencies)) ? (z || typeof u.UNSAFE_componentWillUpdate != "function" && typeof u.componentWillUpdate != "function" || (typeof u.componentWillUpdate == "function" && u.componentWillUpdate(a, w, S), typeof u.UNSAFE_componentWillUpdate == "function" && u.UNSAFE_componentWillUpdate(
        a,
        w,
        S
      )), typeof u.componentDidUpdate == "function" && (e.flags |= 4), typeof u.getSnapshotBeforeUpdate == "function" && (e.flags |= 1024)) : (typeof u.componentDidUpdate != "function" || h === t.memoizedProps && C === t.memoizedState || (e.flags |= 4), typeof u.getSnapshotBeforeUpdate != "function" || h === t.memoizedProps && C === t.memoizedState || (e.flags |= 1024), e.memoizedProps = a, e.memoizedState = w), u.props = a, u.state = w, u.context = S, a = B) : (typeof u.componentDidUpdate != "function" || h === t.memoizedProps && C === t.memoizedState || (e.flags |= 4), typeof u.getSnapshotBeforeUpdate != "function" || h === t.memoizedProps && C === t.memoizedState || (e.flags |= 1024), a = !1);
    }
    return u = a, Cs(t, e), a = (e.flags & 128) !== 0, u || a ? (u = e.stateNode, n = a && typeof n.getDerivedStateFromError != "function" ? null : u.render(), e.flags |= 1, t !== null && a ? (e.child = xi(
      e,
      t.child,
      null,
      r
    ), e.child = xi(
      e,
      null,
      n,
      r
    )) : oe(t, e, n, r), e.memoizedState = u.state, t = e.child) : t = Sn(
      t,
      e,
      r
    ), t;
  }
  function Zd(t, e, n, a) {
    return gi(), e.flags |= 256, oe(t, e, n, a), e.child;
  }
  var eu = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function nu(t) {
    return { baseLanes: t, cachePool: Uh() };
  }
  function iu(t, e, n) {
    return t = t !== null ? t.childLanes & ~n : 0, e && (t |= we), t;
  }
  function Kd(t, e, n) {
    var a = e.pendingProps, r = !1, u = (e.flags & 128) !== 0, h;
    if ((h = u) || (h = t !== null && t.memoizedState === null ? !1 : (kt.current & 2) !== 0), h && (r = !0, e.flags &= -129), h = (e.flags & 32) !== 0, e.flags &= -33, t === null) {
      if (At) {
        if (r ? Yn(e) : qn(), (t = Nt) ? (t = ep(
          t,
          Ye
        ), t = t !== null && t.data !== "&" ? t : null, t !== null && (e.memoizedState = {
          dehydrated: t,
          treeContext: Bn !== null ? { id: tn, overflow: en } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, n = Dh(t), n.return = e, e.child = n, le = e, Nt = null)) : t = null, t === null) throw Nn(e);
        return Hu(t) ? e.lanes = 32 : e.lanes = 536870912, null;
      }
      var g = a.children;
      return a = a.fallback, r ? (qn(), r = e.mode, g = Rs(
        { mode: "hidden", children: g },
        r
      ), a = yi(
        a,
        r,
        n,
        null
      ), g.return = e, a.return = e, g.sibling = a, e.child = g, a = e.child, a.memoizedState = nu(n), a.childLanes = iu(
        t,
        h,
        n
      ), e.memoizedState = eu, ll(null, a)) : (Yn(e), au(e, g));
    }
    var S = t.memoizedState;
    if (S !== null && (g = S.dehydrated, g !== null)) {
      if (u)
        e.flags & 256 ? (Yn(e), e.flags &= -257, e = lu(
          t,
          e,
          n
        )) : e.memoizedState !== null ? (qn(), e.child = t.child, e.flags |= 128, e = null) : (qn(), g = a.fallback, r = e.mode, a = Rs(
          { mode: "visible", children: a.children },
          r
        ), g = yi(
          g,
          r,
          n,
          null
        ), g.flags |= 2, a.return = e, g.return = e, a.sibling = g, e.child = a, xi(
          e,
          t.child,
          null,
          n
        ), a = e.child, a.memoizedState = nu(n), a.childLanes = iu(
          t,
          h,
          n
        ), e.memoizedState = eu, e = ll(null, a));
      else if (Yn(e), Hu(g)) {
        if (h = g.nextSibling && g.nextSibling.dataset, h) var z = h.dgst;
        h = z, a = Error(o(419)), a.stack = "", a.digest = h, Ka({ value: a, source: null, stack: null }), e = lu(
          t,
          e,
          n
        );
      } else if (Jt || ta(t, e, n, !1), h = (n & t.childLanes) !== 0, Jt || h) {
        if (h = Bt, h !== null && (a = _f(h, n), a !== 0 && a !== S.retryLane))
          throw S.retryLane = a, pi(t, a), Te(h, t, a), Ir;
        ju(g) || js(), e = lu(
          t,
          e,
          n
        );
      } else
        ju(g) ? (e.flags |= 192, e.child = t.child, e = null) : (t = S.treeContext, Nt = Xe(
          g.nextSibling
        ), le = e, At = !0, Un = null, Ye = !1, t !== null && Rh(e, t), e = au(
          e,
          a.children
        ), e.flags |= 4096);
      return e;
    }
    return r ? (qn(), g = a.fallback, r = e.mode, S = t.child, z = S.sibling, a = mn(S, {
      mode: "hidden",
      children: a.children
    }), a.subtreeFlags = S.subtreeFlags & 65011712, z !== null ? g = mn(
      z,
      g
    ) : (g = yi(
      g,
      r,
      n,
      null
    ), g.flags |= 2), g.return = e, a.return = e, a.sibling = g, e.child = a, ll(null, a), a = e.child, g = t.child.memoizedState, g === null ? g = nu(n) : (r = g.cachePool, r !== null ? (S = Zt._currentValue, r = r.parent !== S ? { parent: S, pool: S } : r) : r = Uh(), g = {
      baseLanes: g.baseLanes | n,
      cachePool: r
    }), a.memoizedState = g, a.childLanes = iu(
      t,
      h,
      n
    ), e.memoizedState = eu, ll(t.child, a)) : (Yn(e), n = t.child, t = n.sibling, n = mn(n, {
      mode: "visible",
      children: a.children
    }), n.return = e, n.sibling = null, t !== null && (h = e.deletions, h === null ? (e.deletions = [t], e.flags |= 16) : h.push(t)), e.child = n, e.memoizedState = null, n);
  }
  function au(t, e) {
    return e = Rs(
      { mode: "visible", children: e },
      t.mode
    ), e.return = t, t.child = e;
  }
  function Rs(t, e) {
    return t = ze(22, t, null, e), t.lanes = 0, t;
  }
  function lu(t, e, n) {
    return xi(e, t.child, null, n), t = au(
      e,
      e.pendingProps.children
    ), t.flags |= 2, e.memoizedState = null, t;
  }
  function Jd(t, e, n) {
    t.lanes |= e;
    var a = t.alternate;
    a !== null && (a.lanes |= e), Sr(t.return, e, n);
  }
  function su(t, e, n, a, r, u) {
    var h = t.memoizedState;
    h === null ? t.memoizedState = {
      isBackwards: e,
      rendering: null,
      renderingStartTime: 0,
      last: a,
      tail: n,
      tailMode: r,
      treeForkCount: u
    } : (h.isBackwards = e, h.rendering = null, h.renderingStartTime = 0, h.last = a, h.tail = n, h.tailMode = r, h.treeForkCount = u);
  }
  function Fd(t, e, n) {
    var a = e.pendingProps, r = a.revealOrder, u = a.tail;
    a = a.children;
    var h = kt.current, g = (h & 2) !== 0;
    if (g ? (h = h & 1 | 2, e.flags |= 128) : h &= 1, K(kt, h), oe(t, e, a, n), a = At ? Za : 0, !g && t !== null && (t.flags & 128) !== 0)
      t: for (t = e.child; t !== null; ) {
        if (t.tag === 13)
          t.memoizedState !== null && Jd(t, n, e);
        else if (t.tag === 19)
          Jd(t, n, e);
        else if (t.child !== null) {
          t.child.return = t, t = t.child;
          continue;
        }
        if (t === e) break t;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e)
            break t;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
    switch (r) {
      case "forwards":
        for (n = e.child, r = null; n !== null; )
          t = n.alternate, t !== null && gs(t) === null && (r = n), n = n.sibling;
        n = r, n === null ? (r = e.child, e.child = null) : (r = n.sibling, n.sibling = null), su(
          e,
          !1,
          r,
          n,
          u,
          a
        );
        break;
      case "backwards":
      case "unstable_legacy-backwards":
        for (n = null, r = e.child, e.child = null; r !== null; ) {
          if (t = r.alternate, t !== null && gs(t) === null) {
            e.child = r;
            break;
          }
          t = r.sibling, r.sibling = n, n = r, r = t;
        }
        su(
          e,
          !0,
          n,
          null,
          u,
          a
        );
        break;
      case "together":
        su(
          e,
          !1,
          null,
          null,
          void 0,
          a
        );
        break;
      default:
        e.memoizedState = null;
    }
    return e.child;
  }
  function Sn(t, e, n) {
    if (t !== null && (e.dependencies = t.dependencies), Qn |= e.lanes, (n & e.childLanes) === 0)
      if (t !== null) {
        if (ta(
          t,
          e,
          n,
          !1
        ), (n & e.childLanes) === 0)
          return null;
      } else return null;
    if (t !== null && e.child !== t.child)
      throw Error(o(153));
    if (e.child !== null) {
      for (t = e.child, n = mn(t, t.pendingProps), e.child = n, n.return = e; t.sibling !== null; )
        t = t.sibling, n = n.sibling = mn(t, t.pendingProps), n.return = e;
      n.sibling = null;
    }
    return e.child;
  }
  function ou(t, e) {
    return (t.lanes & e) !== 0 ? !0 : (t = t.dependencies, !!(t !== null && us(t)));
  }
  function Hb(t, e, n) {
    switch (e.tag) {
      case 3:
        Ht(e, e.stateNode.containerInfo), Ln(e, Zt, t.memoizedState.cache), gi();
        break;
      case 27:
      case 5:
        Ke(e);
        break;
      case 4:
        Ht(e, e.stateNode.containerInfo);
        break;
      case 10:
        Ln(
          e,
          e.type,
          e.memoizedProps.value
        );
        break;
      case 31:
        if (e.memoizedState !== null)
          return e.flags |= 128, Vr(e), null;
        break;
      case 13:
        var a = e.memoizedState;
        if (a !== null)
          return a.dehydrated !== null ? (Yn(e), e.flags |= 128, null) : (n & e.child.childLanes) !== 0 ? Kd(t, e, n) : (Yn(e), t = Sn(
            t,
            e,
            n
          ), t !== null ? t.sibling : null);
        Yn(e);
        break;
      case 19:
        var r = (t.flags & 128) !== 0;
        if (a = (n & e.childLanes) !== 0, a || (ta(
          t,
          e,
          n,
          !1
        ), a = (n & e.childLanes) !== 0), r) {
          if (a)
            return Fd(
              t,
              e,
              n
            );
          e.flags |= 128;
        }
        if (r = e.memoizedState, r !== null && (r.rendering = null, r.tail = null, r.lastEffect = null), K(kt, kt.current), a) break;
        return null;
      case 22:
        return e.lanes = 0, Yd(
          t,
          e,
          n,
          e.pendingProps
        );
      case 24:
        Ln(e, Zt, t.memoizedState.cache);
    }
    return Sn(t, e, n);
  }
  function Pd(t, e, n) {
    if (t !== null)
      if (t.memoizedProps !== e.pendingProps)
        Jt = !0;
      else {
        if (!ou(t, n) && (e.flags & 128) === 0)
          return Jt = !1, Hb(
            t,
            e,
            n
          );
        Jt = (t.flags & 131072) !== 0;
      }
    else
      Jt = !1, At && (e.flags & 1048576) !== 0 && Ch(e, Za, e.index);
    switch (e.lanes = 0, e.tag) {
      case 16:
        t: {
          var a = e.pendingProps;
          if (t = Ti(e.elementType), e.type = t, typeof t == "function")
            hr(t) ? (a = Mi(t, a), e.tag = 1, e = Qd(
              null,
              e,
              t,
              a,
              n
            )) : (e.tag = 0, e = tu(
              null,
              e,
              t,
              a,
              n
            ));
          else {
            if (t != null) {
              var r = t.$$typeof;
              if (r === q) {
                e.tag = 11, e = jd(
                  null,
                  e,
                  t,
                  a,
                  n
                );
                break t;
              } else if (r === Q) {
                e.tag = 14, e = Hd(
                  null,
                  e,
                  t,
                  a,
                  n
                );
                break t;
              }
            }
            throw e = Rt(t) || t, Error(o(306, e, ""));
          }
        }
        return e;
      case 0:
        return tu(
          t,
          e,
          e.type,
          e.pendingProps,
          n
        );
      case 1:
        return a = e.type, r = Mi(
          a,
          e.pendingProps
        ), Qd(
          t,
          e,
          a,
          r,
          n
        );
      case 3:
        t: {
          if (Ht(
            e,
            e.stateNode.containerInfo
          ), t === null) throw Error(o(387));
          a = e.pendingProps;
          var u = e.memoizedState;
          r = u.element, zr(t, e), tl(e, a, null, n);
          var h = e.memoizedState;
          if (a = h.cache, Ln(e, Zt, a), a !== u.cache && Tr(
            e,
            [Zt],
            n,
            !0
          ), Ia(), a = h.element, u.isDehydrated)
            if (u = {
              element: a,
              isDehydrated: !1,
              cache: h.cache
            }, e.updateQueue.baseState = u, e.memoizedState = u, e.flags & 256) {
              e = Zd(
                t,
                e,
                a,
                n
              );
              break t;
            } else if (a !== r) {
              r = je(
                Error(o(424)),
                e
              ), Ka(r), e = Zd(
                t,
                e,
                a,
                n
              );
              break t;
            } else
              for (t = e.stateNode.containerInfo, t.nodeType === 9 ? t = t.body : t = t.nodeName === "HTML" ? t.ownerDocument.body : t, Nt = Xe(t.firstChild), le = e, At = !0, Un = null, Ye = !0, n = Yh(
                e,
                null,
                a,
                n
              ), e.child = n; n; )
                n.flags = n.flags & -3 | 4096, n = n.sibling;
          else {
            if (gi(), a === r) {
              e = Sn(
                t,
                e,
                n
              );
              break t;
            }
            oe(t, e, a, n);
          }
          e = e.child;
        }
        return e;
      case 26:
        return Cs(t, e), t === null ? (n = op(
          e.type,
          null,
          e.pendingProps,
          null
        )) ? e.memoizedState = n : At || (n = e.type, t = e.pendingProps, a = Qs(
          lt.current
        ).createElement(n), a[ae] = e, a[pe] = t, re(a, n, t), ee(a), e.stateNode = a) : e.memoizedState = op(
          e.type,
          t.memoizedProps,
          e.pendingProps,
          t.memoizedState
        ), null;
      case 27:
        return Ke(e), t === null && At && (a = e.stateNode = ap(
          e.type,
          e.pendingProps,
          lt.current
        ), le = e, Ye = !0, r = Nt, Pn(e.type) ? (Gu = r, Nt = Xe(a.firstChild)) : Nt = r), oe(
          t,
          e,
          e.pendingProps.children,
          n
        ), Cs(t, e), t === null && (e.flags |= 4194304), e.child;
      case 5:
        return t === null && At && ((r = a = Nt) && (a = p1(
          a,
          e.type,
          e.pendingProps,
          Ye
        ), a !== null ? (e.stateNode = a, le = e, Nt = Xe(a.firstChild), Ye = !1, r = !0) : r = !1), r || Nn(e)), Ke(e), r = e.type, u = e.pendingProps, h = t !== null ? t.memoizedProps : null, a = u.children, Uu(r, u) ? a = null : h !== null && Uu(r, h) && (e.flags |= 32), e.memoizedState !== null && (r = Br(
          t,
          e,
          Ob,
          null,
          null,
          n
        ), Sl._currentValue = r), Cs(t, e), oe(t, e, a, n), e.child;
      case 6:
        return t === null && At && ((t = n = Nt) && (n = y1(
          n,
          e.pendingProps,
          Ye
        ), n !== null ? (e.stateNode = n, le = e, Nt = null, t = !0) : t = !1), t || Nn(e)), null;
      case 13:
        return Kd(t, e, n);
      case 4:
        return Ht(
          e,
          e.stateNode.containerInfo
        ), a = e.pendingProps, t === null ? e.child = xi(
          e,
          null,
          a,
          n
        ) : oe(t, e, a, n), e.child;
      case 11:
        return jd(
          t,
          e,
          e.type,
          e.pendingProps,
          n
        );
      case 7:
        return oe(
          t,
          e,
          e.pendingProps,
          n
        ), e.child;
      case 8:
        return oe(
          t,
          e,
          e.pendingProps.children,
          n
        ), e.child;
      case 12:
        return oe(
          t,
          e,
          e.pendingProps.children,
          n
        ), e.child;
      case 10:
        return a = e.pendingProps, Ln(e, e.type, a.value), oe(t, e, a.children, n), e.child;
      case 9:
        return r = e.type._context, a = e.pendingProps.children, bi(e), r = se(r), a = a(r), e.flags |= 1, oe(t, e, a, n), e.child;
      case 14:
        return Hd(
          t,
          e,
          e.type,
          e.pendingProps,
          n
        );
      case 15:
        return Gd(
          t,
          e,
          e.type,
          e.pendingProps,
          n
        );
      case 19:
        return Fd(t, e, n);
      case 31:
        return jb(t, e, n);
      case 22:
        return Yd(
          t,
          e,
          n,
          e.pendingProps
        );
      case 24:
        return bi(e), a = se(Zt), t === null ? (r = Er(), r === null && (r = Bt, u = Ar(), r.pooledCache = u, u.refCount++, u !== null && (r.pooledCacheLanes |= n), r = u), e.memoizedState = { parent: a, cache: r }, Dr(e), Ln(e, Zt, r)) : ((t.lanes & n) !== 0 && (zr(t, e), tl(e, null, null, n), Ia()), r = t.memoizedState, u = e.memoizedState, r.parent !== a ? (r = { parent: a, cache: a }, e.memoizedState = r, e.lanes === 0 && (e.memoizedState = e.updateQueue.baseState = r), Ln(e, Zt, a)) : (a = u.cache, Ln(e, Zt, a), a !== r.cache && Tr(
          e,
          [Zt],
          n,
          !0
        ))), oe(
          t,
          e,
          e.pendingProps.children,
          n
        ), e.child;
      case 29:
        throw e.pendingProps;
    }
    throw Error(o(156, e.tag));
  }
  function Tn(t) {
    t.flags |= 4;
  }
  function ru(t, e, n, a, r) {
    if ((e = (t.mode & 32) !== 0) && (e = !1), e) {
      if (t.flags |= 16777216, (r & 335544128) === r)
        if (t.stateNode.complete) t.flags |= 8192;
        else if (xm()) t.flags |= 8192;
        else
          throw Ai = ds, Mr;
    } else t.flags &= -16777217;
  }
  function Wd(t, e) {
    if (e.type !== "stylesheet" || (e.state.loading & 4) !== 0)
      t.flags &= -16777217;
    else if (t.flags |= 16777216, !hp(e))
      if (xm()) t.flags |= 8192;
      else
        throw Ai = ds, Mr;
  }
  function Os(t, e) {
    e !== null && (t.flags |= 4), t.flags & 16384 && (e = t.tag !== 22 ? Of() : 536870912, t.lanes |= e, ha |= e);
  }
  function sl(t, e) {
    if (!At)
      switch (t.tailMode) {
        case "hidden":
          e = t.tail;
          for (var n = null; e !== null; )
            e.alternate !== null && (n = e), e = e.sibling;
          n === null ? t.tail = null : n.sibling = null;
          break;
        case "collapsed":
          n = t.tail;
          for (var a = null; n !== null; )
            n.alternate !== null && (a = n), n = n.sibling;
          a === null ? e || t.tail === null ? t.tail = null : t.tail.sibling = null : a.sibling = null;
      }
  }
  function Lt(t) {
    var e = t.alternate !== null && t.alternate.child === t.child, n = 0, a = 0;
    if (e)
      for (var r = t.child; r !== null; )
        n |= r.lanes | r.childLanes, a |= r.subtreeFlags & 65011712, a |= r.flags & 65011712, r.return = t, r = r.sibling;
    else
      for (r = t.child; r !== null; )
        n |= r.lanes | r.childLanes, a |= r.subtreeFlags, a |= r.flags, r.return = t, r = r.sibling;
    return t.subtreeFlags |= a, t.childLanes = n, e;
  }
  function Gb(t, e, n) {
    var a = e.pendingProps;
    switch (yr(e), e.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return Lt(e), null;
      case 1:
        return Lt(e), null;
      case 3:
        return n = e.stateNode, a = null, t !== null && (a = t.memoizedState.cache), e.memoizedState.cache !== a && (e.flags |= 2048), gn(Zt), ht(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (t === null || t.child === null) && (Ii(e) ? Tn(e) : t === null || t.memoizedState.isDehydrated && (e.flags & 256) === 0 || (e.flags |= 1024, vr())), Lt(e), null;
      case 26:
        var r = e.type, u = e.memoizedState;
        return t === null ? (Tn(e), u !== null ? (Lt(e), Wd(e, u)) : (Lt(e), ru(
          e,
          r,
          null,
          a,
          n
        ))) : u ? u !== t.memoizedState ? (Tn(e), Lt(e), Wd(e, u)) : (Lt(e), e.flags &= -16777217) : (t = t.memoizedProps, t !== a && Tn(e), Lt(e), ru(
          e,
          r,
          t,
          a,
          n
        )), null;
      case 27:
        if (Be(e), n = lt.current, r = e.type, t !== null && e.stateNode != null)
          t.memoizedProps !== a && Tn(e);
        else {
          if (!a) {
            if (e.stateNode === null)
              throw Error(o(166));
            return Lt(e), null;
          }
          t = J.current, Ii(e) ? Oh(e) : (t = ap(r, a, n), e.stateNode = t, Tn(e));
        }
        return Lt(e), null;
      case 5:
        if (Be(e), r = e.type, t !== null && e.stateNode != null)
          t.memoizedProps !== a && Tn(e);
        else {
          if (!a) {
            if (e.stateNode === null)
              throw Error(o(166));
            return Lt(e), null;
          }
          if (u = J.current, Ii(e))
            Oh(e);
          else {
            var h = Qs(
              lt.current
            );
            switch (u) {
              case 1:
                u = h.createElementNS(
                  "http://www.w3.org/2000/svg",
                  r
                );
                break;
              case 2:
                u = h.createElementNS(
                  "http://www.w3.org/1998/Math/MathML",
                  r
                );
                break;
              default:
                switch (r) {
                  case "svg":
                    u = h.createElementNS(
                      "http://www.w3.org/2000/svg",
                      r
                    );
                    break;
                  case "math":
                    u = h.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      r
                    );
                    break;
                  case "script":
                    u = h.createElement("div"), u.innerHTML = "<script><\/script>", u = u.removeChild(
                      u.firstChild
                    );
                    break;
                  case "select":
                    u = typeof a.is == "string" ? h.createElement("select", {
                      is: a.is
                    }) : h.createElement("select"), a.multiple ? u.multiple = !0 : a.size && (u.size = a.size);
                    break;
                  default:
                    u = typeof a.is == "string" ? h.createElement(r, { is: a.is }) : h.createElement(r);
                }
            }
            u[ae] = e, u[pe] = a;
            t: for (h = e.child; h !== null; ) {
              if (h.tag === 5 || h.tag === 6)
                u.appendChild(h.stateNode);
              else if (h.tag !== 4 && h.tag !== 27 && h.child !== null) {
                h.child.return = h, h = h.child;
                continue;
              }
              if (h === e) break t;
              for (; h.sibling === null; ) {
                if (h.return === null || h.return === e)
                  break t;
                h = h.return;
              }
              h.sibling.return = h.return, h = h.sibling;
            }
            e.stateNode = u;
            t: switch (re(u, r, a), r) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                a = !!a.autoFocus;
                break t;
              case "img":
                a = !0;
                break t;
              default:
                a = !1;
            }
            a && Tn(e);
          }
        }
        return Lt(e), ru(
          e,
          e.type,
          t === null ? null : t.memoizedProps,
          e.pendingProps,
          n
        ), null;
      case 6:
        if (t && e.stateNode != null)
          t.memoizedProps !== a && Tn(e);
        else {
          if (typeof a != "string" && e.stateNode === null)
            throw Error(o(166));
          if (t = lt.current, Ii(e)) {
            if (t = e.stateNode, n = e.memoizedProps, a = null, r = le, r !== null)
              switch (r.tag) {
                case 27:
                case 5:
                  a = r.memoizedProps;
              }
            t[ae] = e, t = !!(t.nodeValue === n || a !== null && a.suppressHydrationWarning === !0 || Km(t.nodeValue, n)), t || Nn(e, !0);
          } else
            t = Qs(t).createTextNode(
              a
            ), t[ae] = e, e.stateNode = t;
        }
        return Lt(e), null;
      case 31:
        if (n = e.memoizedState, t === null || t.memoizedState !== null) {
          if (a = Ii(e), n !== null) {
            if (t === null) {
              if (!a) throw Error(o(318));
              if (t = e.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(o(557));
              t[ae] = e;
            } else
              gi(), (e.flags & 128) === 0 && (e.memoizedState = null), e.flags |= 4;
            Lt(e), t = !1;
          } else
            n = vr(), t !== null && t.memoizedState !== null && (t.memoizedState.hydrationErrors = n), t = !0;
          if (!t)
            return e.flags & 256 ? (Re(e), e) : (Re(e), null);
          if ((e.flags & 128) !== 0)
            throw Error(o(558));
        }
        return Lt(e), null;
      case 13:
        if (a = e.memoizedState, t === null || t.memoizedState !== null && t.memoizedState.dehydrated !== null) {
          if (r = Ii(e), a !== null && a.dehydrated !== null) {
            if (t === null) {
              if (!r) throw Error(o(318));
              if (r = e.memoizedState, r = r !== null ? r.dehydrated : null, !r) throw Error(o(317));
              r[ae] = e;
            } else
              gi(), (e.flags & 128) === 0 && (e.memoizedState = null), e.flags |= 4;
            Lt(e), r = !1;
          } else
            r = vr(), t !== null && t.memoizedState !== null && (t.memoizedState.hydrationErrors = r), r = !0;
          if (!r)
            return e.flags & 256 ? (Re(e), e) : (Re(e), null);
        }
        return Re(e), (e.flags & 128) !== 0 ? (e.lanes = n, e) : (n = a !== null, t = t !== null && t.memoizedState !== null, n && (a = e.child, r = null, a.alternate !== null && a.alternate.memoizedState !== null && a.alternate.memoizedState.cachePool !== null && (r = a.alternate.memoizedState.cachePool.pool), u = null, a.memoizedState !== null && a.memoizedState.cachePool !== null && (u = a.memoizedState.cachePool.pool), u !== r && (a.flags |= 2048)), n !== t && n && (e.child.flags |= 8192), Os(e, e.updateQueue), Lt(e), null);
      case 4:
        return ht(), t === null && Ou(e.stateNode.containerInfo), Lt(e), null;
      case 10:
        return gn(e.type), Lt(e), null;
      case 19:
        if (N(kt), a = e.memoizedState, a === null) return Lt(e), null;
        if (r = (e.flags & 128) !== 0, u = a.rendering, u === null)
          if (r) sl(a, !1);
          else {
            if (qt !== 0 || t !== null && (t.flags & 128) !== 0)
              for (t = e.child; t !== null; ) {
                if (u = gs(t), u !== null) {
                  for (e.flags |= 128, sl(a, !1), t = u.updateQueue, e.updateQueue = t, Os(e, t), e.subtreeFlags = 0, t = n, n = e.child; n !== null; )
                    Mh(n, t), n = n.sibling;
                  return K(
                    kt,
                    kt.current & 1 | 2
                  ), At && pn(e, a.treeForkCount), e.child;
                }
                t = t.sibling;
              }
            a.tail !== null && xe() > Us && (e.flags |= 128, r = !0, sl(a, !1), e.lanes = 4194304);
          }
        else {
          if (!r)
            if (t = gs(u), t !== null) {
              if (e.flags |= 128, r = !0, t = t.updateQueue, e.updateQueue = t, Os(e, t), sl(a, !0), a.tail === null && a.tailMode === "hidden" && !u.alternate && !At)
                return Lt(e), null;
            } else
              2 * xe() - a.renderingStartTime > Us && n !== 536870912 && (e.flags |= 128, r = !0, sl(a, !1), e.lanes = 4194304);
          a.isBackwards ? (u.sibling = e.child, e.child = u) : (t = a.last, t !== null ? t.sibling = u : e.child = u, a.last = u);
        }
        return a.tail !== null ? (t = a.tail, a.rendering = t, a.tail = t.sibling, a.renderingStartTime = xe(), t.sibling = null, n = kt.current, K(
          kt,
          r ? n & 1 | 2 : n & 1
        ), At && pn(e, a.treeForkCount), t) : (Lt(e), null);
      case 22:
      case 23:
        return Re(e), wr(), a = e.memoizedState !== null, t !== null ? t.memoizedState !== null !== a && (e.flags |= 8192) : a && (e.flags |= 8192), a ? (n & 536870912) !== 0 && (e.flags & 128) === 0 && (Lt(e), e.subtreeFlags & 6 && (e.flags |= 8192)) : Lt(e), n = e.updateQueue, n !== null && Os(e, n.retryQueue), n = null, t !== null && t.memoizedState !== null && t.memoizedState.cachePool !== null && (n = t.memoizedState.cachePool.pool), a = null, e.memoizedState !== null && e.memoizedState.cachePool !== null && (a = e.memoizedState.cachePool.pool), a !== n && (e.flags |= 2048), t !== null && N(Si), null;
      case 24:
        return n = null, t !== null && (n = t.memoizedState.cache), e.memoizedState.cache !== n && (e.flags |= 2048), gn(Zt), Lt(e), null;
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(o(156, e.tag));
  }
  function Yb(t, e) {
    switch (yr(e), e.tag) {
      case 1:
        return t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 3:
        return gn(Zt), ht(), t = e.flags, (t & 65536) !== 0 && (t & 128) === 0 ? (e.flags = t & -65537 | 128, e) : null;
      case 26:
      case 27:
      case 5:
        return Be(e), null;
      case 31:
        if (e.memoizedState !== null) {
          if (Re(e), e.alternate === null)
            throw Error(o(340));
          gi();
        }
        return t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 13:
        if (Re(e), t = e.memoizedState, t !== null && t.dehydrated !== null) {
          if (e.alternate === null)
            throw Error(o(340));
          gi();
        }
        return t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 19:
        return N(kt), null;
      case 4:
        return ht(), null;
      case 10:
        return gn(e.type), null;
      case 22:
      case 23:
        return Re(e), wr(), t !== null && N(Si), t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 24:
        return gn(Zt), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function $d(t, e) {
    switch (yr(e), e.tag) {
      case 3:
        gn(Zt), ht();
        break;
      case 26:
      case 27:
      case 5:
        Be(e);
        break;
      case 4:
        ht();
        break;
      case 31:
        e.memoizedState !== null && Re(e);
        break;
      case 13:
        Re(e);
        break;
      case 19:
        N(kt);
        break;
      case 10:
        gn(e.type);
        break;
      case 22:
      case 23:
        Re(e), wr(), t !== null && N(Si);
        break;
      case 24:
        gn(Zt);
    }
  }
  function ol(t, e) {
    try {
      var n = e.updateQueue, a = n !== null ? n.lastEffect : null;
      if (a !== null) {
        var r = a.next;
        n = r;
        do {
          if ((n.tag & t) === t) {
            a = void 0;
            var u = n.create, h = n.inst;
            a = u(), h.destroy = a;
          }
          n = n.next;
        } while (n !== r);
      }
    } catch (g) {
      Ct(e, e.return, g);
    }
  }
  function Xn(t, e, n) {
    try {
      var a = e.updateQueue, r = a !== null ? a.lastEffect : null;
      if (r !== null) {
        var u = r.next;
        a = u;
        do {
          if ((a.tag & t) === t) {
            var h = a.inst, g = h.destroy;
            if (g !== void 0) {
              h.destroy = void 0, r = e;
              var S = n, z = g;
              try {
                z();
              } catch (B) {
                Ct(
                  r,
                  S,
                  B
                );
              }
            }
          }
          a = a.next;
        } while (a !== u);
      }
    } catch (B) {
      Ct(e, e.return, B);
    }
  }
  function Id(t) {
    var e = t.updateQueue;
    if (e !== null) {
      var n = t.stateNode;
      try {
        Xh(e, n);
      } catch (a) {
        Ct(t, t.return, a);
      }
    }
  }
  function tm(t, e, n) {
    n.props = Mi(
      t.type,
      t.memoizedProps
    ), n.state = t.memoizedState;
    try {
      n.componentWillUnmount();
    } catch (a) {
      Ct(t, e, a);
    }
  }
  function rl(t, e) {
    try {
      var n = t.ref;
      if (n !== null) {
        switch (t.tag) {
          case 26:
          case 27:
          case 5:
            var a = t.stateNode;
            break;
          case 30:
            a = t.stateNode;
            break;
          default:
            a = t.stateNode;
        }
        typeof n == "function" ? t.refCleanup = n(a) : n.current = a;
      }
    } catch (r) {
      Ct(t, e, r);
    }
  }
  function nn(t, e) {
    var n = t.ref, a = t.refCleanup;
    if (n !== null)
      if (typeof a == "function")
        try {
          a();
        } catch (r) {
          Ct(t, e, r);
        } finally {
          t.refCleanup = null, t = t.alternate, t != null && (t.refCleanup = null);
        }
      else if (typeof n == "function")
        try {
          n(null);
        } catch (r) {
          Ct(t, e, r);
        }
      else n.current = null;
  }
  function em(t) {
    var e = t.type, n = t.memoizedProps, a = t.stateNode;
    try {
      t: switch (e) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          n.autoFocus && a.focus();
          break t;
        case "img":
          n.src ? a.src = n.src : n.srcSet && (a.srcset = n.srcSet);
      }
    } catch (r) {
      Ct(t, t.return, r);
    }
  }
  function uu(t, e, n) {
    try {
      var a = t.stateNode;
      u1(a, t.type, n, e), a[pe] = e;
    } catch (r) {
      Ct(t, t.return, r);
    }
  }
  function nm(t) {
    return t.tag === 5 || t.tag === 3 || t.tag === 26 || t.tag === 27 && Pn(t.type) || t.tag === 4;
  }
  function cu(t) {
    t: for (; ; ) {
      for (; t.sibling === null; ) {
        if (t.return === null || nm(t.return)) return null;
        t = t.return;
      }
      for (t.sibling.return = t.return, t = t.sibling; t.tag !== 5 && t.tag !== 6 && t.tag !== 18; ) {
        if (t.tag === 27 && Pn(t.type) || t.flags & 2 || t.child === null || t.tag === 4) continue t;
        t.child.return = t, t = t.child;
      }
      if (!(t.flags & 2)) return t.stateNode;
    }
  }
  function fu(t, e, n) {
    var a = t.tag;
    if (a === 5 || a === 6)
      t = t.stateNode, e ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(t, e) : (e = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, e.appendChild(t), n = n._reactRootContainer, n != null || e.onclick !== null || (e.onclick = hn));
    else if (a !== 4 && (a === 27 && Pn(t.type) && (n = t.stateNode, e = null), t = t.child, t !== null))
      for (fu(t, e, n), t = t.sibling; t !== null; )
        fu(t, e, n), t = t.sibling;
  }
  function ws(t, e, n) {
    var a = t.tag;
    if (a === 5 || a === 6)
      t = t.stateNode, e ? n.insertBefore(t, e) : n.appendChild(t);
    else if (a !== 4 && (a === 27 && Pn(t.type) && (n = t.stateNode), t = t.child, t !== null))
      for (ws(t, e, n), t = t.sibling; t !== null; )
        ws(t, e, n), t = t.sibling;
  }
  function im(t) {
    var e = t.stateNode, n = t.memoizedProps;
    try {
      for (var a = t.type, r = e.attributes; r.length; )
        e.removeAttributeNode(r[0]);
      re(e, a, n), e[ae] = t, e[pe] = n;
    } catch (u) {
      Ct(t, t.return, u);
    }
  }
  var An = !1, Ft = !1, hu = !1, am = typeof WeakSet == "function" ? WeakSet : Set, ne = null;
  function qb(t, e) {
    if (t = t.containerInfo, _u = $s, t = yh(t), lr(t)) {
      if ("selectionStart" in t)
        var n = {
          start: t.selectionStart,
          end: t.selectionEnd
        };
      else
        t: {
          n = (n = t.ownerDocument) && n.defaultView || window;
          var a = n.getSelection && n.getSelection();
          if (a && a.rangeCount !== 0) {
            n = a.anchorNode;
            var r = a.anchorOffset, u = a.focusNode;
            a = a.focusOffset;
            try {
              n.nodeType, u.nodeType;
            } catch {
              n = null;
              break t;
            }
            var h = 0, g = -1, S = -1, z = 0, B = 0, H = t, C = null;
            e: for (; ; ) {
              for (var w; H !== n || r !== 0 && H.nodeType !== 3 || (g = h + r), H !== u || a !== 0 && H.nodeType !== 3 || (S = h + a), H.nodeType === 3 && (h += H.nodeValue.length), (w = H.firstChild) !== null; )
                C = H, H = w;
              for (; ; ) {
                if (H === t) break e;
                if (C === n && ++z === r && (g = h), C === u && ++B === a && (S = h), (w = H.nextSibling) !== null) break;
                H = C, C = H.parentNode;
              }
              H = w;
            }
            n = g === -1 || S === -1 ? null : { start: g, end: S };
          } else n = null;
        }
      n = n || { start: 0, end: 0 };
    } else n = null;
    for (Bu = { focusedElem: t, selectionRange: n }, $s = !1, ne = e; ne !== null; )
      if (e = ne, t = e.child, (e.subtreeFlags & 1028) !== 0 && t !== null)
        t.return = e, ne = t;
      else
        for (; ne !== null; ) {
          switch (e = ne, u = e.alternate, t = e.flags, e.tag) {
            case 0:
              if ((t & 4) !== 0 && (t = e.updateQueue, t = t !== null ? t.events : null, t !== null))
                for (n = 0; n < t.length; n++)
                  r = t[n], r.ref.impl = r.nextImpl;
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((t & 1024) !== 0 && u !== null) {
                t = void 0, n = e, r = u.memoizedProps, u = u.memoizedState, a = n.stateNode;
                try {
                  var et = Mi(
                    n.type,
                    r
                  );
                  t = a.getSnapshotBeforeUpdate(
                    et,
                    u
                  ), a.__reactInternalSnapshotBeforeUpdate = t;
                } catch (rt) {
                  Ct(
                    n,
                    n.return,
                    rt
                  );
                }
              }
              break;
            case 3:
              if ((t & 1024) !== 0) {
                if (t = e.stateNode.containerInfo, n = t.nodeType, n === 9)
                  Lu(t);
                else if (n === 1)
                  switch (t.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      Lu(t);
                      break;
                    default:
                      t.textContent = "";
                  }
              }
              break;
            case 5:
            case 26:
            case 27:
            case 6:
            case 4:
            case 17:
              break;
            default:
              if ((t & 1024) !== 0) throw Error(o(163));
          }
          if (t = e.sibling, t !== null) {
            t.return = e.return, ne = t;
            break;
          }
          ne = e.return;
        }
  }
  function lm(t, e, n) {
    var a = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 15:
        En(t, n), a & 4 && ol(5, n);
        break;
      case 1:
        if (En(t, n), a & 4)
          if (t = n.stateNode, e === null)
            try {
              t.componentDidMount();
            } catch (h) {
              Ct(n, n.return, h);
            }
          else {
            var r = Mi(
              n.type,
              e.memoizedProps
            );
            e = e.memoizedState;
            try {
              t.componentDidUpdate(
                r,
                e,
                t.__reactInternalSnapshotBeforeUpdate
              );
            } catch (h) {
              Ct(
                n,
                n.return,
                h
              );
            }
          }
        a & 64 && Id(n), a & 512 && rl(n, n.return);
        break;
      case 3:
        if (En(t, n), a & 64 && (t = n.updateQueue, t !== null)) {
          if (e = null, n.child !== null)
            switch (n.child.tag) {
              case 27:
              case 5:
                e = n.child.stateNode;
                break;
              case 1:
                e = n.child.stateNode;
            }
          try {
            Xh(t, e);
          } catch (h) {
            Ct(n, n.return, h);
          }
        }
        break;
      case 27:
        e === null && a & 4 && im(n);
      case 26:
      case 5:
        En(t, n), e === null && a & 4 && em(n), a & 512 && rl(n, n.return);
        break;
      case 12:
        En(t, n);
        break;
      case 31:
        En(t, n), a & 4 && rm(t, n);
        break;
      case 13:
        En(t, n), a & 4 && um(t, n), a & 64 && (t = n.memoizedState, t !== null && (t = t.dehydrated, t !== null && (n = Wb.bind(
          null,
          n
        ), g1(t, n))));
        break;
      case 22:
        if (a = n.memoizedState !== null || An, !a) {
          e = e !== null && e.memoizedState !== null || Ft, r = An;
          var u = Ft;
          An = a, (Ft = e) && !u ? Mn(
            t,
            n,
            (n.subtreeFlags & 8772) !== 0
          ) : En(t, n), An = r, Ft = u;
        }
        break;
      case 30:
        break;
      default:
        En(t, n);
    }
  }
  function sm(t) {
    var e = t.alternate;
    e !== null && (t.alternate = null, sm(e)), t.child = null, t.deletions = null, t.sibling = null, t.tag === 5 && (e = t.stateNode, e !== null && qo(e)), t.stateNode = null, t.return = null, t.dependencies = null, t.memoizedProps = null, t.memoizedState = null, t.pendingProps = null, t.stateNode = null, t.updateQueue = null;
  }
  var Gt = null, ge = !1;
  function xn(t, e, n) {
    for (n = n.child; n !== null; )
      om(t, e, n), n = n.sibling;
  }
  function om(t, e, n) {
    if (Ee && typeof Ee.onCommitFiberUnmount == "function")
      try {
        Ee.onCommitFiberUnmount(Va, n);
      } catch {
      }
    switch (n.tag) {
      case 26:
        Ft || nn(n, e), xn(
          t,
          e,
          n
        ), n.memoizedState ? n.memoizedState.count-- : n.stateNode && (n = n.stateNode, n.parentNode.removeChild(n));
        break;
      case 27:
        Ft || nn(n, e);
        var a = Gt, r = ge;
        Pn(n.type) && (Gt = n.stateNode, ge = !1), xn(
          t,
          e,
          n
        ), gl(n.stateNode), Gt = a, ge = r;
        break;
      case 5:
        Ft || nn(n, e);
      case 6:
        if (a = Gt, r = ge, Gt = null, xn(
          t,
          e,
          n
        ), Gt = a, ge = r, Gt !== null)
          if (ge)
            try {
              (Gt.nodeType === 9 ? Gt.body : Gt.nodeName === "HTML" ? Gt.ownerDocument.body : Gt).removeChild(n.stateNode);
            } catch (u) {
              Ct(
                n,
                e,
                u
              );
            }
          else
            try {
              Gt.removeChild(n.stateNode);
            } catch (u) {
              Ct(
                n,
                e,
                u
              );
            }
        break;
      case 18:
        Gt !== null && (ge ? (t = Gt, Im(
          t.nodeType === 9 ? t.body : t.nodeName === "HTML" ? t.ownerDocument.body : t,
          n.stateNode
        ), Sa(t)) : Im(Gt, n.stateNode));
        break;
      case 4:
        a = Gt, r = ge, Gt = n.stateNode.containerInfo, ge = !0, xn(
          t,
          e,
          n
        ), Gt = a, ge = r;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        Xn(2, n, e), Ft || Xn(4, n, e), xn(
          t,
          e,
          n
        );
        break;
      case 1:
        Ft || (nn(n, e), a = n.stateNode, typeof a.componentWillUnmount == "function" && tm(
          n,
          e,
          a
        )), xn(
          t,
          e,
          n
        );
        break;
      case 21:
        xn(
          t,
          e,
          n
        );
        break;
      case 22:
        Ft = (a = Ft) || n.memoizedState !== null, xn(
          t,
          e,
          n
        ), Ft = a;
        break;
      default:
        xn(
          t,
          e,
          n
        );
    }
  }
  function rm(t, e) {
    if (e.memoizedState === null && (t = e.alternate, t !== null && (t = t.memoizedState, t !== null))) {
      t = t.dehydrated;
      try {
        Sa(t);
      } catch (n) {
        Ct(e, e.return, n);
      }
    }
  }
  function um(t, e) {
    if (e.memoizedState === null && (t = e.alternate, t !== null && (t = t.memoizedState, t !== null && (t = t.dehydrated, t !== null))))
      try {
        Sa(t);
      } catch (n) {
        Ct(e, e.return, n);
      }
  }
  function Xb(t) {
    switch (t.tag) {
      case 31:
      case 13:
      case 19:
        var e = t.stateNode;
        return e === null && (e = t.stateNode = new am()), e;
      case 22:
        return t = t.stateNode, e = t._retryCache, e === null && (e = t._retryCache = new am()), e;
      default:
        throw Error(o(435, t.tag));
    }
  }
  function Vs(t, e) {
    var n = Xb(t);
    e.forEach(function(a) {
      if (!n.has(a)) {
        n.add(a);
        var r = $b.bind(null, t, a);
        a.then(r, r);
      }
    });
  }
  function ve(t, e) {
    var n = e.deletions;
    if (n !== null)
      for (var a = 0; a < n.length; a++) {
        var r = n[a], u = t, h = e, g = h;
        t: for (; g !== null; ) {
          switch (g.tag) {
            case 27:
              if (Pn(g.type)) {
                Gt = g.stateNode, ge = !1;
                break t;
              }
              break;
            case 5:
              Gt = g.stateNode, ge = !1;
              break t;
            case 3:
            case 4:
              Gt = g.stateNode.containerInfo, ge = !0;
              break t;
          }
          g = g.return;
        }
        if (Gt === null) throw Error(o(160));
        om(u, h, r), Gt = null, ge = !1, u = r.alternate, u !== null && (u.return = null), r.return = null;
      }
    if (e.subtreeFlags & 13886)
      for (e = e.child; e !== null; )
        cm(e, t), e = e.sibling;
  }
  var Fe = null;
  function cm(t, e) {
    var n = t.alternate, a = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        ve(e, t), be(t), a & 4 && (Xn(3, t, t.return), ol(3, t), Xn(5, t, t.return));
        break;
      case 1:
        ve(e, t), be(t), a & 512 && (Ft || n === null || nn(n, n.return)), a & 64 && An && (t = t.updateQueue, t !== null && (a = t.callbacks, a !== null && (n = t.shared.hiddenCallbacks, t.shared.hiddenCallbacks = n === null ? a : n.concat(a))));
        break;
      case 26:
        var r = Fe;
        if (ve(e, t), be(t), a & 512 && (Ft || n === null || nn(n, n.return)), a & 4) {
          var u = n !== null ? n.memoizedState : null;
          if (a = t.memoizedState, n === null)
            if (a === null)
              if (t.stateNode === null) {
                t: {
                  a = t.type, n = t.memoizedProps, r = r.ownerDocument || r;
                  e: switch (a) {
                    case "title":
                      u = r.getElementsByTagName("title")[0], (!u || u[Ua] || u[ae] || u.namespaceURI === "http://www.w3.org/2000/svg" || u.hasAttribute("itemprop")) && (u = r.createElement(a), r.head.insertBefore(
                        u,
                        r.querySelector("head > title")
                      )), re(u, a, n), u[ae] = t, ee(u), a = u;
                      break t;
                    case "link":
                      var h = cp(
                        "link",
                        "href",
                        r
                      ).get(a + (n.href || ""));
                      if (h) {
                        for (var g = 0; g < h.length; g++)
                          if (u = h[g], u.getAttribute("href") === (n.href == null || n.href === "" ? null : n.href) && u.getAttribute("rel") === (n.rel == null ? null : n.rel) && u.getAttribute("title") === (n.title == null ? null : n.title) && u.getAttribute("crossorigin") === (n.crossOrigin == null ? null : n.crossOrigin)) {
                            h.splice(g, 1);
                            break e;
                          }
                      }
                      u = r.createElement(a), re(u, a, n), r.head.appendChild(u);
                      break;
                    case "meta":
                      if (h = cp(
                        "meta",
                        "content",
                        r
                      ).get(a + (n.content || ""))) {
                        for (g = 0; g < h.length; g++)
                          if (u = h[g], u.getAttribute("content") === (n.content == null ? null : "" + n.content) && u.getAttribute("name") === (n.name == null ? null : n.name) && u.getAttribute("property") === (n.property == null ? null : n.property) && u.getAttribute("http-equiv") === (n.httpEquiv == null ? null : n.httpEquiv) && u.getAttribute("charset") === (n.charSet == null ? null : n.charSet)) {
                            h.splice(g, 1);
                            break e;
                          }
                      }
                      u = r.createElement(a), re(u, a, n), r.head.appendChild(u);
                      break;
                    default:
                      throw Error(o(468, a));
                  }
                  u[ae] = t, ee(u), a = u;
                }
                t.stateNode = a;
              } else
                fp(
                  r,
                  t.type,
                  t.stateNode
                );
            else
              t.stateNode = up(
                r,
                a,
                t.memoizedProps
              );
          else
            u !== a ? (u === null ? n.stateNode !== null && (n = n.stateNode, n.parentNode.removeChild(n)) : u.count--, a === null ? fp(
              r,
              t.type,
              t.stateNode
            ) : up(
              r,
              a,
              t.memoizedProps
            )) : a === null && t.stateNode !== null && uu(
              t,
              t.memoizedProps,
              n.memoizedProps
            );
        }
        break;
      case 27:
        ve(e, t), be(t), a & 512 && (Ft || n === null || nn(n, n.return)), n !== null && a & 4 && uu(
          t,
          t.memoizedProps,
          n.memoizedProps
        );
        break;
      case 5:
        if (ve(e, t), be(t), a & 512 && (Ft || n === null || nn(n, n.return)), t.flags & 32) {
          r = t.stateNode;
          try {
            Xi(r, "");
          } catch (et) {
            Ct(t, t.return, et);
          }
        }
        a & 4 && t.stateNode != null && (r = t.memoizedProps, uu(
          t,
          r,
          n !== null ? n.memoizedProps : r
        )), a & 1024 && (hu = !0);
        break;
      case 6:
        if (ve(e, t), be(t), a & 4) {
          if (t.stateNode === null)
            throw Error(o(162));
          a = t.memoizedProps, n = t.stateNode;
          try {
            n.nodeValue = a;
          } catch (et) {
            Ct(t, t.return, et);
          }
        }
        break;
      case 3:
        if (Js = null, r = Fe, Fe = Zs(e.containerInfo), ve(e, t), Fe = r, be(t), a & 4 && n !== null && n.memoizedState.isDehydrated)
          try {
            Sa(e.containerInfo);
          } catch (et) {
            Ct(t, t.return, et);
          }
        hu && (hu = !1, fm(t));
        break;
      case 4:
        a = Fe, Fe = Zs(
          t.stateNode.containerInfo
        ), ve(e, t), be(t), Fe = a;
        break;
      case 12:
        ve(e, t), be(t);
        break;
      case 31:
        ve(e, t), be(t), a & 4 && (a = t.updateQueue, a !== null && (t.updateQueue = null, Vs(t, a)));
        break;
      case 13:
        ve(e, t), be(t), t.child.flags & 8192 && t.memoizedState !== null != (n !== null && n.memoizedState !== null) && (Bs = xe()), a & 4 && (a = t.updateQueue, a !== null && (t.updateQueue = null, Vs(t, a)));
        break;
      case 22:
        r = t.memoizedState !== null;
        var S = n !== null && n.memoizedState !== null, z = An, B = Ft;
        if (An = z || r, Ft = B || S, ve(e, t), Ft = B, An = z, be(t), a & 8192)
          t: for (e = t.stateNode, e._visibility = r ? e._visibility & -2 : e._visibility | 1, r && (n === null || S || An || Ft || Di(t)), n = null, e = t; ; ) {
            if (e.tag === 5 || e.tag === 26) {
              if (n === null) {
                S = n = e;
                try {
                  if (u = S.stateNode, r)
                    h = u.style, typeof h.setProperty == "function" ? h.setProperty("display", "none", "important") : h.display = "none";
                  else {
                    g = S.stateNode;
                    var H = S.memoizedProps.style, C = H != null && H.hasOwnProperty("display") ? H.display : null;
                    g.style.display = C == null || typeof C == "boolean" ? "" : ("" + C).trim();
                  }
                } catch (et) {
                  Ct(S, S.return, et);
                }
              }
            } else if (e.tag === 6) {
              if (n === null) {
                S = e;
                try {
                  S.stateNode.nodeValue = r ? "" : S.memoizedProps;
                } catch (et) {
                  Ct(S, S.return, et);
                }
              }
            } else if (e.tag === 18) {
              if (n === null) {
                S = e;
                try {
                  var w = S.stateNode;
                  r ? tp(w, !0) : tp(S.stateNode, !1);
                } catch (et) {
                  Ct(S, S.return, et);
                }
              }
            } else if ((e.tag !== 22 && e.tag !== 23 || e.memoizedState === null || e === t) && e.child !== null) {
              e.child.return = e, e = e.child;
              continue;
            }
            if (e === t) break t;
            for (; e.sibling === null; ) {
              if (e.return === null || e.return === t) break t;
              n === e && (n = null), e = e.return;
            }
            n === e && (n = null), e.sibling.return = e.return, e = e.sibling;
          }
        a & 4 && (a = t.updateQueue, a !== null && (n = a.retryQueue, n !== null && (a.retryQueue = null, Vs(t, n))));
        break;
      case 19:
        ve(e, t), be(t), a & 4 && (a = t.updateQueue, a !== null && (t.updateQueue = null, Vs(t, a)));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        ve(e, t), be(t);
    }
  }
  function be(t) {
    var e = t.flags;
    if (e & 2) {
      try {
        for (var n, a = t.return; a !== null; ) {
          if (nm(a)) {
            n = a;
            break;
          }
          a = a.return;
        }
        if (n == null) throw Error(o(160));
        switch (n.tag) {
          case 27:
            var r = n.stateNode, u = cu(t);
            ws(t, u, r);
            break;
          case 5:
            var h = n.stateNode;
            n.flags & 32 && (Xi(h, ""), n.flags &= -33);
            var g = cu(t);
            ws(t, g, h);
            break;
          case 3:
          case 4:
            var S = n.stateNode.containerInfo, z = cu(t);
            fu(
              t,
              z,
              S
            );
            break;
          default:
            throw Error(o(161));
        }
      } catch (B) {
        Ct(t, t.return, B);
      }
      t.flags &= -3;
    }
    e & 4096 && (t.flags &= -4097);
  }
  function fm(t) {
    if (t.subtreeFlags & 1024)
      for (t = t.child; t !== null; ) {
        var e = t;
        fm(e), e.tag === 5 && e.flags & 1024 && e.stateNode.reset(), t = t.sibling;
      }
  }
  function En(t, e) {
    if (e.subtreeFlags & 8772)
      for (e = e.child; e !== null; )
        lm(t, e.alternate, e), e = e.sibling;
  }
  function Di(t) {
    for (t = t.child; t !== null; ) {
      var e = t;
      switch (e.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          Xn(4, e, e.return), Di(e);
          break;
        case 1:
          nn(e, e.return);
          var n = e.stateNode;
          typeof n.componentWillUnmount == "function" && tm(
            e,
            e.return,
            n
          ), Di(e);
          break;
        case 27:
          gl(e.stateNode);
        case 26:
        case 5:
          nn(e, e.return), Di(e);
          break;
        case 22:
          e.memoizedState === null && Di(e);
          break;
        case 30:
          Di(e);
          break;
        default:
          Di(e);
      }
      t = t.sibling;
    }
  }
  function Mn(t, e, n) {
    for (n = n && (e.subtreeFlags & 8772) !== 0, e = e.child; e !== null; ) {
      var a = e.alternate, r = t, u = e, h = u.flags;
      switch (u.tag) {
        case 0:
        case 11:
        case 15:
          Mn(
            r,
            u,
            n
          ), ol(4, u);
          break;
        case 1:
          if (Mn(
            r,
            u,
            n
          ), a = u, r = a.stateNode, typeof r.componentDidMount == "function")
            try {
              r.componentDidMount();
            } catch (z) {
              Ct(a, a.return, z);
            }
          if (a = u, r = a.updateQueue, r !== null) {
            var g = a.stateNode;
            try {
              var S = r.shared.hiddenCallbacks;
              if (S !== null)
                for (r.shared.hiddenCallbacks = null, r = 0; r < S.length; r++)
                  qh(S[r], g);
            } catch (z) {
              Ct(a, a.return, z);
            }
          }
          n && h & 64 && Id(u), rl(u, u.return);
          break;
        case 27:
          im(u);
        case 26:
        case 5:
          Mn(
            r,
            u,
            n
          ), n && a === null && h & 4 && em(u), rl(u, u.return);
          break;
        case 12:
          Mn(
            r,
            u,
            n
          );
          break;
        case 31:
          Mn(
            r,
            u,
            n
          ), n && h & 4 && rm(r, u);
          break;
        case 13:
          Mn(
            r,
            u,
            n
          ), n && h & 4 && um(r, u);
          break;
        case 22:
          u.memoizedState === null && Mn(
            r,
            u,
            n
          ), rl(u, u.return);
          break;
        case 30:
          break;
        default:
          Mn(
            r,
            u,
            n
          );
      }
      e = e.sibling;
    }
  }
  function du(t, e) {
    var n = null;
    t !== null && t.memoizedState !== null && t.memoizedState.cachePool !== null && (n = t.memoizedState.cachePool.pool), t = null, e.memoizedState !== null && e.memoizedState.cachePool !== null && (t = e.memoizedState.cachePool.pool), t !== n && (t != null && t.refCount++, n != null && Ja(n));
  }
  function mu(t, e) {
    t = null, e.alternate !== null && (t = e.alternate.memoizedState.cache), e = e.memoizedState.cache, e !== t && (e.refCount++, t != null && Ja(t));
  }
  function Pe(t, e, n, a) {
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; )
        hm(
          t,
          e,
          n,
          a
        ), e = e.sibling;
  }
  function hm(t, e, n, a) {
    var r = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        Pe(
          t,
          e,
          n,
          a
        ), r & 2048 && ol(9, e);
        break;
      case 1:
        Pe(
          t,
          e,
          n,
          a
        );
        break;
      case 3:
        Pe(
          t,
          e,
          n,
          a
        ), r & 2048 && (t = null, e.alternate !== null && (t = e.alternate.memoizedState.cache), e = e.memoizedState.cache, e !== t && (e.refCount++, t != null && Ja(t)));
        break;
      case 12:
        if (r & 2048) {
          Pe(
            t,
            e,
            n,
            a
          ), t = e.stateNode;
          try {
            var u = e.memoizedProps, h = u.id, g = u.onPostCommit;
            typeof g == "function" && g(
              h,
              e.alternate === null ? "mount" : "update",
              t.passiveEffectDuration,
              -0
            );
          } catch (S) {
            Ct(e, e.return, S);
          }
        } else
          Pe(
            t,
            e,
            n,
            a
          );
        break;
      case 31:
        Pe(
          t,
          e,
          n,
          a
        );
        break;
      case 13:
        Pe(
          t,
          e,
          n,
          a
        );
        break;
      case 23:
        break;
      case 22:
        u = e.stateNode, h = e.alternate, e.memoizedState !== null ? u._visibility & 2 ? Pe(
          t,
          e,
          n,
          a
        ) : ul(t, e) : u._visibility & 2 ? Pe(
          t,
          e,
          n,
          a
        ) : (u._visibility |= 2, ua(
          t,
          e,
          n,
          a,
          (e.subtreeFlags & 10256) !== 0 || !1
        )), r & 2048 && du(h, e);
        break;
      case 24:
        Pe(
          t,
          e,
          n,
          a
        ), r & 2048 && mu(e.alternate, e);
        break;
      default:
        Pe(
          t,
          e,
          n,
          a
        );
    }
  }
  function ua(t, e, n, a, r) {
    for (r = r && ((e.subtreeFlags & 10256) !== 0 || !1), e = e.child; e !== null; ) {
      var u = t, h = e, g = n, S = a, z = h.flags;
      switch (h.tag) {
        case 0:
        case 11:
        case 15:
          ua(
            u,
            h,
            g,
            S,
            r
          ), ol(8, h);
          break;
        case 23:
          break;
        case 22:
          var B = h.stateNode;
          h.memoizedState !== null ? B._visibility & 2 ? ua(
            u,
            h,
            g,
            S,
            r
          ) : ul(
            u,
            h
          ) : (B._visibility |= 2, ua(
            u,
            h,
            g,
            S,
            r
          )), r && z & 2048 && du(
            h.alternate,
            h
          );
          break;
        case 24:
          ua(
            u,
            h,
            g,
            S,
            r
          ), r && z & 2048 && mu(h.alternate, h);
          break;
        default:
          ua(
            u,
            h,
            g,
            S,
            r
          );
      }
      e = e.sibling;
    }
  }
  function ul(t, e) {
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; ) {
        var n = t, a = e, r = a.flags;
        switch (a.tag) {
          case 22:
            ul(n, a), r & 2048 && du(
              a.alternate,
              a
            );
            break;
          case 24:
            ul(n, a), r & 2048 && mu(a.alternate, a);
            break;
          default:
            ul(n, a);
        }
        e = e.sibling;
      }
  }
  var cl = 8192;
  function ca(t, e, n) {
    if (t.subtreeFlags & cl)
      for (t = t.child; t !== null; )
        dm(
          t,
          e,
          n
        ), t = t.sibling;
  }
  function dm(t, e, n) {
    switch (t.tag) {
      case 26:
        ca(
          t,
          e,
          n
        ), t.flags & cl && t.memoizedState !== null && R1(
          n,
          Fe,
          t.memoizedState,
          t.memoizedProps
        );
        break;
      case 5:
        ca(
          t,
          e,
          n
        );
        break;
      case 3:
      case 4:
        var a = Fe;
        Fe = Zs(t.stateNode.containerInfo), ca(
          t,
          e,
          n
        ), Fe = a;
        break;
      case 22:
        t.memoizedState === null && (a = t.alternate, a !== null && a.memoizedState !== null ? (a = cl, cl = 16777216, ca(
          t,
          e,
          n
        ), cl = a) : ca(
          t,
          e,
          n
        ));
        break;
      default:
        ca(
          t,
          e,
          n
        );
    }
  }
  function mm(t) {
    var e = t.alternate;
    if (e !== null && (t = e.child, t !== null)) {
      e.child = null;
      do
        e = t.sibling, t.sibling = null, t = e;
      while (t !== null);
    }
  }
  function fl(t) {
    var e = t.deletions;
    if ((t.flags & 16) !== 0) {
      if (e !== null)
        for (var n = 0; n < e.length; n++) {
          var a = e[n];
          ne = a, ym(
            a,
            t
          );
        }
      mm(t);
    }
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        pm(t), t = t.sibling;
  }
  function pm(t) {
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        fl(t), t.flags & 2048 && Xn(9, t, t.return);
        break;
      case 3:
        fl(t);
        break;
      case 12:
        fl(t);
        break;
      case 22:
        var e = t.stateNode;
        t.memoizedState !== null && e._visibility & 2 && (t.return === null || t.return.tag !== 13) ? (e._visibility &= -3, _s(t)) : fl(t);
        break;
      default:
        fl(t);
    }
  }
  function _s(t) {
    var e = t.deletions;
    if ((t.flags & 16) !== 0) {
      if (e !== null)
        for (var n = 0; n < e.length; n++) {
          var a = e[n];
          ne = a, ym(
            a,
            t
          );
        }
      mm(t);
    }
    for (t = t.child; t !== null; ) {
      switch (e = t, e.tag) {
        case 0:
        case 11:
        case 15:
          Xn(8, e, e.return), _s(e);
          break;
        case 22:
          n = e.stateNode, n._visibility & 2 && (n._visibility &= -3, _s(e));
          break;
        default:
          _s(e);
      }
      t = t.sibling;
    }
  }
  function ym(t, e) {
    for (; ne !== null; ) {
      var n = ne;
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          Xn(8, n, e);
          break;
        case 23:
        case 22:
          if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
            var a = n.memoizedState.cachePool.pool;
            a != null && a.refCount++;
          }
          break;
        case 24:
          Ja(n.memoizedState.cache);
      }
      if (a = n.child, a !== null) a.return = n, ne = a;
      else
        t: for (n = t; ne !== null; ) {
          a = ne;
          var r = a.sibling, u = a.return;
          if (sm(a), a === n) {
            ne = null;
            break t;
          }
          if (r !== null) {
            r.return = u, ne = r;
            break t;
          }
          ne = u;
        }
    }
  }
  var kb = {
    getCacheForType: function(t) {
      var e = se(Zt), n = e.data.get(t);
      return n === void 0 && (n = t(), e.data.set(t, n)), n;
    },
    cacheSignal: function() {
      return se(Zt).controller.signal;
    }
  }, Qb = typeof WeakMap == "function" ? WeakMap : Map, Dt = 0, Bt = null, vt = null, St = 0, zt = 0, Oe = null, kn = !1, fa = !1, pu = !1, Dn = 0, qt = 0, Qn = 0, zi = 0, yu = 0, we = 0, ha = 0, hl = null, Se = null, gu = !1, Bs = 0, gm = 0, Us = 1 / 0, Ns = null, Zn = null, $t = 0, Kn = null, da = null, zn = 0, vu = 0, bu = null, vm = null, dl = 0, Su = null;
  function Ve() {
    return (Dt & 2) !== 0 && St !== 0 ? St & -St : R.T !== null ? Du() : Bf();
  }
  function bm() {
    if (we === 0)
      if ((St & 536870912) === 0 || At) {
        var t = kl;
        kl <<= 1, (kl & 3932160) === 0 && (kl = 262144), we = t;
      } else we = 536870912;
    return t = Ce.current, t !== null && (t.flags |= 32), we;
  }
  function Te(t, e, n) {
    (t === Bt && (zt === 2 || zt === 9) || t.cancelPendingCommit !== null) && (ma(t, 0), Jn(
      t,
      St,
      we,
      !1
    )), Ba(t, n), ((Dt & 2) === 0 || t !== Bt) && (t === Bt && ((Dt & 2) === 0 && (zi |= n), qt === 4 && Jn(
      t,
      St,
      we,
      !1
    )), an(t));
  }
  function Sm(t, e, n) {
    if ((Dt & 6) !== 0) throw Error(o(327));
    var a = !n && (e & 127) === 0 && (e & t.expiredLanes) === 0 || _a(t, e), r = a ? Jb(t, e) : Au(t, e, !0), u = a;
    do {
      if (r === 0) {
        fa && !a && Jn(t, e, 0, !1);
        break;
      } else {
        if (n = t.current.alternate, u && !Zb(n)) {
          r = Au(t, e, !1), u = !1;
          continue;
        }
        if (r === 2) {
          if (u = e, t.errorRecoveryDisabledLanes & u)
            var h = 0;
          else
            h = t.pendingLanes & -536870913, h = h !== 0 ? h : h & 536870912 ? 536870912 : 0;
          if (h !== 0) {
            e = h;
            t: {
              var g = t;
              r = hl;
              var S = g.current.memoizedState.isDehydrated;
              if (S && (ma(g, h).flags |= 256), h = Au(
                g,
                h,
                !1
              ), h !== 2) {
                if (pu && !S) {
                  g.errorRecoveryDisabledLanes |= u, zi |= u, r = 4;
                  break t;
                }
                u = Se, Se = r, u !== null && (Se === null ? Se = u : Se.push.apply(
                  Se,
                  u
                ));
              }
              r = h;
            }
            if (u = !1, r !== 2) continue;
          }
        }
        if (r === 1) {
          ma(t, 0), Jn(t, e, 0, !0);
          break;
        }
        t: {
          switch (a = t, u = r, u) {
            case 0:
            case 1:
              throw Error(o(345));
            case 4:
              if ((e & 4194048) !== e) break;
            case 6:
              Jn(
                a,
                e,
                we,
                !kn
              );
              break t;
            case 2:
              Se = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(o(329));
          }
          if ((e & 62914560) === e && (r = Bs + 300 - xe(), 10 < r)) {
            if (Jn(
              a,
              e,
              we,
              !kn
            ), Zl(a, 0, !0) !== 0) break t;
            zn = e, a.timeoutHandle = Wm(
              Tm.bind(
                null,
                a,
                n,
                Se,
                Ns,
                gu,
                e,
                we,
                zi,
                ha,
                kn,
                u,
                "Throttled",
                -0,
                0
              ),
              r
            );
            break t;
          }
          Tm(
            a,
            n,
            Se,
            Ns,
            gu,
            e,
            we,
            zi,
            ha,
            kn,
            u,
            null,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    an(t);
  }
  function Tm(t, e, n, a, r, u, h, g, S, z, B, H, C, w) {
    if (t.timeoutHandle = -1, H = e.subtreeFlags, H & 8192 || (H & 16785408) === 16785408) {
      H = {
        stylesheets: null,
        count: 0,
        imgCount: 0,
        imgBytes: 0,
        suspenseyImages: [],
        waitingForImages: !0,
        waitingForViewTransition: !1,
        unsuspend: hn
      }, dm(
        e,
        u,
        H
      );
      var et = (u & 62914560) === u ? Bs - xe() : (u & 4194048) === u ? gm - xe() : 0;
      if (et = O1(
        H,
        et
      ), et !== null) {
        zn = u, t.cancelPendingCommit = et(
          Rm.bind(
            null,
            t,
            e,
            u,
            n,
            a,
            r,
            h,
            g,
            S,
            B,
            H,
            null,
            C,
            w
          )
        ), Jn(t, u, h, !z);
        return;
      }
    }
    Rm(
      t,
      e,
      u,
      n,
      a,
      r,
      h,
      g,
      S
    );
  }
  function Zb(t) {
    for (var e = t; ; ) {
      var n = e.tag;
      if ((n === 0 || n === 11 || n === 15) && e.flags & 16384 && (n = e.updateQueue, n !== null && (n = n.stores, n !== null)))
        for (var a = 0; a < n.length; a++) {
          var r = n[a], u = r.getSnapshot;
          r = r.value;
          try {
            if (!De(u(), r)) return !1;
          } catch {
            return !1;
          }
        }
      if (n = e.child, e.subtreeFlags & 16384 && n !== null)
        n.return = e, e = n;
      else {
        if (e === t) break;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t) return !0;
          e = e.return;
        }
        e.sibling.return = e.return, e = e.sibling;
      }
    }
    return !0;
  }
  function Jn(t, e, n, a) {
    e &= ~yu, e &= ~zi, t.suspendedLanes |= e, t.pingedLanes &= ~e, a && (t.warmLanes |= e), a = t.expirationTimes;
    for (var r = e; 0 < r; ) {
      var u = 31 - Me(r), h = 1 << u;
      a[u] = -1, r &= ~h;
    }
    n !== 0 && wf(t, n, e);
  }
  function Ls() {
    return (Dt & 6) === 0 ? (ml(0), !1) : !0;
  }
  function Tu() {
    if (vt !== null) {
      if (zt === 0)
        var t = vt.return;
      else
        t = vt, yn = vi = null, Lr(t), aa = null, Pa = 0, t = vt;
      for (; t !== null; )
        $d(t.alternate, t), t = t.return;
      vt = null;
    }
  }
  function ma(t, e) {
    var n = t.timeoutHandle;
    n !== -1 && (t.timeoutHandle = -1, h1(n)), n = t.cancelPendingCommit, n !== null && (t.cancelPendingCommit = null, n()), zn = 0, Tu(), Bt = t, vt = n = mn(t.current, null), St = e, zt = 0, Oe = null, kn = !1, fa = _a(t, e), pu = !1, ha = we = yu = zi = Qn = qt = 0, Se = hl = null, gu = !1, (e & 8) !== 0 && (e |= e & 32);
    var a = t.entangledLanes;
    if (a !== 0)
      for (t = t.entanglements, a &= e; 0 < a; ) {
        var r = 31 - Me(a), u = 1 << r;
        e |= t[r], a &= ~u;
      }
    return Dn = e, as(), n;
  }
  function Am(t, e) {
    dt = null, R.H = al, e === ia || e === hs ? (e = jh(), zt = 3) : e === Mr ? (e = jh(), zt = 4) : zt = e === Ir ? 8 : e !== null && typeof e == "object" && typeof e.then == "function" ? 6 : 1, Oe = e, vt === null && (qt = 1, Ds(
      t,
      je(e, t.current)
    ));
  }
  function xm() {
    var t = Ce.current;
    return t === null ? !0 : (St & 4194048) === St ? qe === null : (St & 62914560) === St || (St & 536870912) !== 0 ? t === qe : !1;
  }
  function Em() {
    var t = R.H;
    return R.H = al, t === null ? al : t;
  }
  function Mm() {
    var t = R.A;
    return R.A = kb, t;
  }
  function js() {
    qt = 4, kn || (St & 4194048) !== St && Ce.current !== null || (fa = !0), (Qn & 134217727) === 0 && (zi & 134217727) === 0 || Bt === null || Jn(
      Bt,
      St,
      we,
      !1
    );
  }
  function Au(t, e, n) {
    var a = Dt;
    Dt |= 2;
    var r = Em(), u = Mm();
    (Bt !== t || St !== e) && (Ns = null, ma(t, e)), e = !1;
    var h = qt;
    t: do
      try {
        if (zt !== 0 && vt !== null) {
          var g = vt, S = Oe;
          switch (zt) {
            case 8:
              Tu(), h = 6;
              break t;
            case 3:
            case 2:
            case 9:
            case 6:
              Ce.current === null && (e = !0);
              var z = zt;
              if (zt = 0, Oe = null, pa(t, g, S, z), n && fa) {
                h = 0;
                break t;
              }
              break;
            default:
              z = zt, zt = 0, Oe = null, pa(t, g, S, z);
          }
        }
        Kb(), h = qt;
        break;
      } catch (B) {
        Am(t, B);
      }
    while (!0);
    return e && t.shellSuspendCounter++, yn = vi = null, Dt = a, R.H = r, R.A = u, vt === null && (Bt = null, St = 0, as()), h;
  }
  function Kb() {
    for (; vt !== null; ) Dm(vt);
  }
  function Jb(t, e) {
    var n = Dt;
    Dt |= 2;
    var a = Em(), r = Mm();
    Bt !== t || St !== e ? (Ns = null, Us = xe() + 500, ma(t, e)) : fa = _a(
      t,
      e
    );
    t: do
      try {
        if (zt !== 0 && vt !== null) {
          e = vt;
          var u = Oe;
          e: switch (zt) {
            case 1:
              zt = 0, Oe = null, pa(t, e, u, 1);
              break;
            case 2:
            case 9:
              if (Nh(u)) {
                zt = 0, Oe = null, zm(e);
                break;
              }
              e = function() {
                zt !== 2 && zt !== 9 || Bt !== t || (zt = 7), an(t);
              }, u.then(e, e);
              break t;
            case 3:
              zt = 7;
              break t;
            case 4:
              zt = 5;
              break t;
            case 7:
              Nh(u) ? (zt = 0, Oe = null, zm(e)) : (zt = 0, Oe = null, pa(t, e, u, 7));
              break;
            case 5:
              var h = null;
              switch (vt.tag) {
                case 26:
                  h = vt.memoizedState;
                case 5:
                case 27:
                  var g = vt;
                  if (h ? hp(h) : g.stateNode.complete) {
                    zt = 0, Oe = null;
                    var S = g.sibling;
                    if (S !== null) vt = S;
                    else {
                      var z = g.return;
                      z !== null ? (vt = z, Hs(z)) : vt = null;
                    }
                    break e;
                  }
              }
              zt = 0, Oe = null, pa(t, e, u, 5);
              break;
            case 6:
              zt = 0, Oe = null, pa(t, e, u, 6);
              break;
            case 8:
              Tu(), qt = 6;
              break t;
            default:
              throw Error(o(462));
          }
        }
        Fb();
        break;
      } catch (B) {
        Am(t, B);
      }
    while (!0);
    return yn = vi = null, R.H = a, R.A = r, Dt = n, vt !== null ? 0 : (Bt = null, St = 0, as(), qt);
  }
  function Fb() {
    for (; vt !== null && !v0(); )
      Dm(vt);
  }
  function Dm(t) {
    var e = Pd(t.alternate, t, Dn);
    t.memoizedProps = t.pendingProps, e === null ? Hs(t) : vt = e;
  }
  function zm(t) {
    var e = t, n = e.alternate;
    switch (e.tag) {
      case 15:
      case 0:
        e = kd(
          n,
          e,
          e.pendingProps,
          e.type,
          void 0,
          St
        );
        break;
      case 11:
        e = kd(
          n,
          e,
          e.pendingProps,
          e.type.render,
          e.ref,
          St
        );
        break;
      case 5:
        Lr(e);
      default:
        $d(n, e), e = vt = Mh(e, Dn), e = Pd(n, e, Dn);
    }
    t.memoizedProps = t.pendingProps, e === null ? Hs(t) : vt = e;
  }
  function pa(t, e, n, a) {
    yn = vi = null, Lr(e), aa = null, Pa = 0;
    var r = e.return;
    try {
      if (Lb(
        t,
        r,
        e,
        n,
        St
      )) {
        qt = 1, Ds(
          t,
          je(n, t.current)
        ), vt = null;
        return;
      }
    } catch (u) {
      if (r !== null) throw vt = r, u;
      qt = 1, Ds(
        t,
        je(n, t.current)
      ), vt = null;
      return;
    }
    e.flags & 32768 ? (At || a === 1 ? t = !0 : fa || (St & 536870912) !== 0 ? t = !1 : (kn = t = !0, (a === 2 || a === 9 || a === 3 || a === 6) && (a = Ce.current, a !== null && a.tag === 13 && (a.flags |= 16384))), Cm(e, t)) : Hs(e);
  }
  function Hs(t) {
    var e = t;
    do {
      if ((e.flags & 32768) !== 0) {
        Cm(
          e,
          kn
        );
        return;
      }
      t = e.return;
      var n = Gb(
        e.alternate,
        e,
        Dn
      );
      if (n !== null) {
        vt = n;
        return;
      }
      if (e = e.sibling, e !== null) {
        vt = e;
        return;
      }
      vt = e = t;
    } while (e !== null);
    qt === 0 && (qt = 5);
  }
  function Cm(t, e) {
    do {
      var n = Yb(t.alternate, t);
      if (n !== null) {
        n.flags &= 32767, vt = n;
        return;
      }
      if (n = t.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !e && (t = t.sibling, t !== null)) {
        vt = t;
        return;
      }
      vt = t = n;
    } while (t !== null);
    qt = 6, vt = null;
  }
  function Rm(t, e, n, a, r, u, h, g, S) {
    t.cancelPendingCommit = null;
    do
      Gs();
    while ($t !== 0);
    if ((Dt & 6) !== 0) throw Error(o(327));
    if (e !== null) {
      if (e === t.current) throw Error(o(177));
      if (u = e.lanes | e.childLanes, u |= cr, C0(
        t,
        n,
        u,
        h,
        g,
        S
      ), t === Bt && (vt = Bt = null, St = 0), da = e, Kn = t, zn = n, vu = u, bu = r, vm = a, (e.subtreeFlags & 10256) !== 0 || (e.flags & 10256) !== 0 ? (t.callbackNode = null, t.callbackPriority = 0, Ib(ql, function() {
        return Bm(), null;
      })) : (t.callbackNode = null, t.callbackPriority = 0), a = (e.flags & 13878) !== 0, (e.subtreeFlags & 13878) !== 0 || a) {
        a = R.T, R.T = null, r = X.p, X.p = 2, h = Dt, Dt |= 4;
        try {
          qb(t, e, n);
        } finally {
          Dt = h, X.p = r, R.T = a;
        }
      }
      $t = 1, Om(), wm(), Vm();
    }
  }
  function Om() {
    if ($t === 1) {
      $t = 0;
      var t = Kn, e = da, n = (e.flags & 13878) !== 0;
      if ((e.subtreeFlags & 13878) !== 0 || n) {
        n = R.T, R.T = null;
        var a = X.p;
        X.p = 2;
        var r = Dt;
        Dt |= 4;
        try {
          cm(e, t);
          var u = Bu, h = yh(t.containerInfo), g = u.focusedElem, S = u.selectionRange;
          if (h !== g && g && g.ownerDocument && ph(
            g.ownerDocument.documentElement,
            g
          )) {
            if (S !== null && lr(g)) {
              var z = S.start, B = S.end;
              if (B === void 0 && (B = z), "selectionStart" in g)
                g.selectionStart = z, g.selectionEnd = Math.min(
                  B,
                  g.value.length
                );
              else {
                var H = g.ownerDocument || document, C = H && H.defaultView || window;
                if (C.getSelection) {
                  var w = C.getSelection(), et = g.textContent.length, rt = Math.min(S.start, et), Vt = S.end === void 0 ? rt : Math.min(S.end, et);
                  !w.extend && rt > Vt && (h = Vt, Vt = rt, rt = h);
                  var E = mh(
                    g,
                    rt
                  ), x = mh(
                    g,
                    Vt
                  );
                  if (E && x && (w.rangeCount !== 1 || w.anchorNode !== E.node || w.anchorOffset !== E.offset || w.focusNode !== x.node || w.focusOffset !== x.offset)) {
                    var D = H.createRange();
                    D.setStart(E.node, E.offset), w.removeAllRanges(), rt > Vt ? (w.addRange(D), w.extend(x.node, x.offset)) : (D.setEnd(x.node, x.offset), w.addRange(D));
                  }
                }
              }
            }
            for (H = [], w = g; w = w.parentNode; )
              w.nodeType === 1 && H.push({
                element: w,
                left: w.scrollLeft,
                top: w.scrollTop
              });
            for (typeof g.focus == "function" && g.focus(), g = 0; g < H.length; g++) {
              var L = H[g];
              L.element.scrollLeft = L.left, L.element.scrollTop = L.top;
            }
          }
          $s = !!_u, Bu = _u = null;
        } finally {
          Dt = r, X.p = a, R.T = n;
        }
      }
      t.current = e, $t = 2;
    }
  }
  function wm() {
    if ($t === 2) {
      $t = 0;
      var t = Kn, e = da, n = (e.flags & 8772) !== 0;
      if ((e.subtreeFlags & 8772) !== 0 || n) {
        n = R.T, R.T = null;
        var a = X.p;
        X.p = 2;
        var r = Dt;
        Dt |= 4;
        try {
          lm(t, e.alternate, e);
        } finally {
          Dt = r, X.p = a, R.T = n;
        }
      }
      $t = 3;
    }
  }
  function Vm() {
    if ($t === 4 || $t === 3) {
      $t = 0, b0();
      var t = Kn, e = da, n = zn, a = vm;
      (e.subtreeFlags & 10256) !== 0 || (e.flags & 10256) !== 0 ? $t = 5 : ($t = 0, da = Kn = null, _m(t, t.pendingLanes));
      var r = t.pendingLanes;
      if (r === 0 && (Zn = null), Go(n), e = e.stateNode, Ee && typeof Ee.onCommitFiberRoot == "function")
        try {
          Ee.onCommitFiberRoot(
            Va,
            e,
            void 0,
            (e.current.flags & 128) === 128
          );
        } catch {
        }
      if (a !== null) {
        e = R.T, r = X.p, X.p = 2, R.T = null;
        try {
          for (var u = t.onRecoverableError, h = 0; h < a.length; h++) {
            var g = a[h];
            u(g.value, {
              componentStack: g.stack
            });
          }
        } finally {
          R.T = e, X.p = r;
        }
      }
      (zn & 3) !== 0 && Gs(), an(t), r = t.pendingLanes, (n & 261930) !== 0 && (r & 42) !== 0 ? t === Su ? dl++ : (dl = 0, Su = t) : dl = 0, ml(0);
    }
  }
  function _m(t, e) {
    (t.pooledCacheLanes &= e) === 0 && (e = t.pooledCache, e != null && (t.pooledCache = null, Ja(e)));
  }
  function Gs() {
    return Om(), wm(), Vm(), Bm();
  }
  function Bm() {
    if ($t !== 5) return !1;
    var t = Kn, e = vu;
    vu = 0;
    var n = Go(zn), a = R.T, r = X.p;
    try {
      X.p = 32 > n ? 32 : n, R.T = null, n = bu, bu = null;
      var u = Kn, h = zn;
      if ($t = 0, da = Kn = null, zn = 0, (Dt & 6) !== 0) throw Error(o(331));
      var g = Dt;
      if (Dt |= 4, pm(u.current), hm(
        u,
        u.current,
        h,
        n
      ), Dt = g, ml(0, !1), Ee && typeof Ee.onPostCommitFiberRoot == "function")
        try {
          Ee.onPostCommitFiberRoot(Va, u);
        } catch {
        }
      return !0;
    } finally {
      X.p = r, R.T = a, _m(t, e);
    }
  }
  function Um(t, e, n) {
    e = je(n, e), e = $r(t.stateNode, e, 2), t = Gn(t, e, 2), t !== null && (Ba(t, 2), an(t));
  }
  function Ct(t, e, n) {
    if (t.tag === 3)
      Um(t, t, n);
    else
      for (; e !== null; ) {
        if (e.tag === 3) {
          Um(
            e,
            t,
            n
          );
          break;
        } else if (e.tag === 1) {
          var a = e.stateNode;
          if (typeof e.type.getDerivedStateFromError == "function" || typeof a.componentDidCatch == "function" && (Zn === null || !Zn.has(a))) {
            t = je(n, t), n = Nd(2), a = Gn(e, n, 2), a !== null && (Ld(
              n,
              a,
              e,
              t
            ), Ba(a, 2), an(a));
            break;
          }
        }
        e = e.return;
      }
  }
  function xu(t, e, n) {
    var a = t.pingCache;
    if (a === null) {
      a = t.pingCache = new Qb();
      var r = /* @__PURE__ */ new Set();
      a.set(e, r);
    } else
      r = a.get(e), r === void 0 && (r = /* @__PURE__ */ new Set(), a.set(e, r));
    r.has(n) || (pu = !0, r.add(n), t = Pb.bind(null, t, e, n), e.then(t, t));
  }
  function Pb(t, e, n) {
    var a = t.pingCache;
    a !== null && a.delete(e), t.pingedLanes |= t.suspendedLanes & n, t.warmLanes &= ~n, Bt === t && (St & n) === n && (qt === 4 || qt === 3 && (St & 62914560) === St && 300 > xe() - Bs ? (Dt & 2) === 0 && ma(t, 0) : yu |= n, ha === St && (ha = 0)), an(t);
  }
  function Nm(t, e) {
    e === 0 && (e = Of()), t = pi(t, e), t !== null && (Ba(t, e), an(t));
  }
  function Wb(t) {
    var e = t.memoizedState, n = 0;
    e !== null && (n = e.retryLane), Nm(t, n);
  }
  function $b(t, e) {
    var n = 0;
    switch (t.tag) {
      case 31:
      case 13:
        var a = t.stateNode, r = t.memoizedState;
        r !== null && (n = r.retryLane);
        break;
      case 19:
        a = t.stateNode;
        break;
      case 22:
        a = t.stateNode._retryCache;
        break;
      default:
        throw Error(o(314));
    }
    a !== null && a.delete(e), Nm(t, n);
  }
  function Ib(t, e) {
    return No(t, e);
  }
  var Ys = null, ya = null, Eu = !1, qs = !1, Mu = !1, Fn = 0;
  function an(t) {
    t !== ya && t.next === null && (ya === null ? Ys = ya = t : ya = ya.next = t), qs = !0, Eu || (Eu = !0, e1());
  }
  function ml(t, e) {
    if (!Mu && qs) {
      Mu = !0;
      do
        for (var n = !1, a = Ys; a !== null; ) {
          if (t !== 0) {
            var r = a.pendingLanes;
            if (r === 0) var u = 0;
            else {
              var h = a.suspendedLanes, g = a.pingedLanes;
              u = (1 << 31 - Me(42 | t) + 1) - 1, u &= r & ~(h & ~g), u = u & 201326741 ? u & 201326741 | 1 : u ? u | 2 : 0;
            }
            u !== 0 && (n = !0, Gm(a, u));
          } else
            u = St, u = Zl(
              a,
              a === Bt ? u : 0,
              a.cancelPendingCommit !== null || a.timeoutHandle !== -1
            ), (u & 3) === 0 || _a(a, u) || (n = !0, Gm(a, u));
          a = a.next;
        }
      while (n);
      Mu = !1;
    }
  }
  function t1() {
    Lm();
  }
  function Lm() {
    qs = Eu = !1;
    var t = 0;
    Fn !== 0 && f1() && (t = Fn);
    for (var e = xe(), n = null, a = Ys; a !== null; ) {
      var r = a.next, u = jm(a, e);
      u === 0 ? (a.next = null, n === null ? Ys = r : n.next = r, r === null && (ya = n)) : (n = a, (t !== 0 || (u & 3) !== 0) && (qs = !0)), a = r;
    }
    $t !== 0 && $t !== 5 || ml(t), Fn !== 0 && (Fn = 0);
  }
  function jm(t, e) {
    for (var n = t.suspendedLanes, a = t.pingedLanes, r = t.expirationTimes, u = t.pendingLanes & -62914561; 0 < u; ) {
      var h = 31 - Me(u), g = 1 << h, S = r[h];
      S === -1 ? ((g & n) === 0 || (g & a) !== 0) && (r[h] = z0(g, e)) : S <= e && (t.expiredLanes |= g), u &= ~g;
    }
    if (e = Bt, n = St, n = Zl(
      t,
      t === e ? n : 0,
      t.cancelPendingCommit !== null || t.timeoutHandle !== -1
    ), a = t.callbackNode, n === 0 || t === e && (zt === 2 || zt === 9) || t.cancelPendingCommit !== null)
      return a !== null && a !== null && Lo(a), t.callbackNode = null, t.callbackPriority = 0;
    if ((n & 3) === 0 || _a(t, n)) {
      if (e = n & -n, e === t.callbackPriority) return e;
      switch (a !== null && Lo(a), Go(n)) {
        case 2:
        case 8:
          n = Cf;
          break;
        case 32:
          n = ql;
          break;
        case 268435456:
          n = Rf;
          break;
        default:
          n = ql;
      }
      return a = Hm.bind(null, t), n = No(n, a), t.callbackPriority = e, t.callbackNode = n, e;
    }
    return a !== null && a !== null && Lo(a), t.callbackPriority = 2, t.callbackNode = null, 2;
  }
  function Hm(t, e) {
    if ($t !== 0 && $t !== 5)
      return t.callbackNode = null, t.callbackPriority = 0, null;
    var n = t.callbackNode;
    if (Gs() && t.callbackNode !== n)
      return null;
    var a = St;
    return a = Zl(
      t,
      t === Bt ? a : 0,
      t.cancelPendingCommit !== null || t.timeoutHandle !== -1
    ), a === 0 ? null : (Sm(t, a, e), jm(t, xe()), t.callbackNode != null && t.callbackNode === n ? Hm.bind(null, t) : null);
  }
  function Gm(t, e) {
    if (Gs()) return null;
    Sm(t, e, !0);
  }
  function e1() {
    d1(function() {
      (Dt & 6) !== 0 ? No(
        zf,
        t1
      ) : Lm();
    });
  }
  function Du() {
    if (Fn === 0) {
      var t = ea;
      t === 0 && (t = Xl, Xl <<= 1, (Xl & 261888) === 0 && (Xl = 256)), Fn = t;
    }
    return Fn;
  }
  function Ym(t) {
    return t == null || typeof t == "symbol" || typeof t == "boolean" ? null : typeof t == "function" ? t : Pl("" + t);
  }
  function qm(t, e) {
    var n = e.ownerDocument.createElement("input");
    return n.name = e.name, n.value = e.value, t.id && n.setAttribute("form", t.id), e.parentNode.insertBefore(n, e), t = new FormData(t), n.parentNode.removeChild(n), t;
  }
  function n1(t, e, n, a, r) {
    if (e === "submit" && n && n.stateNode === r) {
      var u = Ym(
        (r[pe] || null).action
      ), h = a.submitter;
      h && (e = (e = h[pe] || null) ? Ym(e.formAction) : h.getAttribute("formAction"), e !== null && (u = e, h = null));
      var g = new ts(
        "action",
        "action",
        null,
        a,
        r
      );
      t.push({
        event: g,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (a.defaultPrevented) {
                if (Fn !== 0) {
                  var S = h ? qm(r, h) : new FormData(r);
                  Zr(
                    n,
                    {
                      pending: !0,
                      data: S,
                      method: r.method,
                      action: u
                    },
                    null,
                    S
                  );
                }
              } else
                typeof u == "function" && (g.preventDefault(), S = h ? qm(r, h) : new FormData(r), Zr(
                  n,
                  {
                    pending: !0,
                    data: S,
                    method: r.method,
                    action: u
                  },
                  u,
                  S
                ));
            },
            currentTarget: r
          }
        ]
      });
    }
  }
  for (var zu = 0; zu < ur.length; zu++) {
    var Cu = ur[zu], i1 = Cu.toLowerCase(), a1 = Cu[0].toUpperCase() + Cu.slice(1);
    Je(
      i1,
      "on" + a1
    );
  }
  Je(bh, "onAnimationEnd"), Je(Sh, "onAnimationIteration"), Je(Th, "onAnimationStart"), Je("dblclick", "onDoubleClick"), Je("focusin", "onFocus"), Je("focusout", "onBlur"), Je(Sb, "onTransitionRun"), Je(Tb, "onTransitionStart"), Je(Ab, "onTransitionCancel"), Je(Ah, "onTransitionEnd"), Yi("onMouseEnter", ["mouseout", "mouseover"]), Yi("onMouseLeave", ["mouseout", "mouseover"]), Yi("onPointerEnter", ["pointerout", "pointerover"]), Yi("onPointerLeave", ["pointerout", "pointerover"]), fi(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), fi(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), fi("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), fi(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), fi(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), fi(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var pl = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), l1 = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(pl)
  );
  function Xm(t, e) {
    e = (e & 4) !== 0;
    for (var n = 0; n < t.length; n++) {
      var a = t[n], r = a.event;
      a = a.listeners;
      t: {
        var u = void 0;
        if (e)
          for (var h = a.length - 1; 0 <= h; h--) {
            var g = a[h], S = g.instance, z = g.currentTarget;
            if (g = g.listener, S !== u && r.isPropagationStopped())
              break t;
            u = g, r.currentTarget = z;
            try {
              u(r);
            } catch (B) {
              is(B);
            }
            r.currentTarget = null, u = S;
          }
        else
          for (h = 0; h < a.length; h++) {
            if (g = a[h], S = g.instance, z = g.currentTarget, g = g.listener, S !== u && r.isPropagationStopped())
              break t;
            u = g, r.currentTarget = z;
            try {
              u(r);
            } catch (B) {
              is(B);
            }
            r.currentTarget = null, u = S;
          }
      }
    }
  }
  function bt(t, e) {
    var n = e[Yo];
    n === void 0 && (n = e[Yo] = /* @__PURE__ */ new Set());
    var a = t + "__bubble";
    n.has(a) || (km(e, t, 2, !1), n.add(a));
  }
  function Ru(t, e, n) {
    var a = 0;
    e && (a |= 4), km(
      n,
      t,
      a,
      e
    );
  }
  var Xs = "_reactListening" + Math.random().toString(36).slice(2);
  function Ou(t) {
    if (!t[Xs]) {
      t[Xs] = !0, Lf.forEach(function(n) {
        n !== "selectionchange" && (l1.has(n) || Ru(n, !1, t), Ru(n, !0, t));
      });
      var e = t.nodeType === 9 ? t : t.ownerDocument;
      e === null || e[Xs] || (e[Xs] = !0, Ru("selectionchange", !1, e));
    }
  }
  function km(t, e, n, a) {
    switch (bp(e)) {
      case 2:
        var r = _1;
        break;
      case 8:
        r = B1;
        break;
      default:
        r = Qu;
    }
    n = r.bind(
      null,
      e,
      n,
      t
    ), r = void 0, !Po || e !== "touchstart" && e !== "touchmove" && e !== "wheel" || (r = !0), a ? r !== void 0 ? t.addEventListener(e, n, {
      capture: !0,
      passive: r
    }) : t.addEventListener(e, n, !0) : r !== void 0 ? t.addEventListener(e, n, {
      passive: r
    }) : t.addEventListener(e, n, !1);
  }
  function wu(t, e, n, a, r) {
    var u = a;
    if ((e & 1) === 0 && (e & 2) === 0 && a !== null)
      t: for (; ; ) {
        if (a === null) return;
        var h = a.tag;
        if (h === 3 || h === 4) {
          var g = a.stateNode.containerInfo;
          if (g === r) break;
          if (h === 4)
            for (h = a.return; h !== null; ) {
              var S = h.tag;
              if ((S === 3 || S === 4) && h.stateNode.containerInfo === r)
                return;
              h = h.return;
            }
          for (; g !== null; ) {
            if (h = ji(g), h === null) return;
            if (S = h.tag, S === 5 || S === 6 || S === 26 || S === 27) {
              a = u = h;
              continue t;
            }
            g = g.parentNode;
          }
        }
        a = a.return;
      }
    Ff(function() {
      var z = u, B = Jo(n), H = [];
      t: {
        var C = xh.get(t);
        if (C !== void 0) {
          var w = ts, et = t;
          switch (t) {
            case "keypress":
              if ($l(n) === 0) break t;
            case "keydown":
            case "keyup":
              w = $0;
              break;
            case "focusin":
              et = "focus", w = tr;
              break;
            case "focusout":
              et = "blur", w = tr;
              break;
            case "beforeblur":
            case "afterblur":
              w = tr;
              break;
            case "click":
              if (n.button === 2) break t;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              w = $f;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              w = G0;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              w = eb;
              break;
            case bh:
            case Sh:
            case Th:
              w = X0;
              break;
            case Ah:
              w = ib;
              break;
            case "scroll":
            case "scrollend":
              w = j0;
              break;
            case "wheel":
              w = lb;
              break;
            case "copy":
            case "cut":
            case "paste":
              w = Q0;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              w = th;
              break;
            case "toggle":
            case "beforetoggle":
              w = ob;
          }
          var rt = (e & 4) !== 0, Vt = !rt && (t === "scroll" || t === "scrollend"), E = rt ? C !== null ? C + "Capture" : null : C;
          rt = [];
          for (var x = z, D; x !== null; ) {
            var L = x;
            if (D = L.stateNode, L = L.tag, L !== 5 && L !== 26 && L !== 27 || D === null || E === null || (L = La(x, E), L != null && rt.push(
              yl(x, L, D)
            )), Vt) break;
            x = x.return;
          }
          0 < rt.length && (C = new w(
            C,
            et,
            null,
            n,
            B
          ), H.push({ event: C, listeners: rt }));
        }
      }
      if ((e & 7) === 0) {
        t: {
          if (C = t === "mouseover" || t === "pointerover", w = t === "mouseout" || t === "pointerout", C && n !== Ko && (et = n.relatedTarget || n.fromElement) && (ji(et) || et[Li]))
            break t;
          if ((w || C) && (C = B.window === B ? B : (C = B.ownerDocument) ? C.defaultView || C.parentWindow : window, w ? (et = n.relatedTarget || n.toElement, w = z, et = et ? ji(et) : null, et !== null && (Vt = d(et), rt = et.tag, et !== Vt || rt !== 5 && rt !== 27 && rt !== 6) && (et = null)) : (w = null, et = z), w !== et)) {
            if (rt = $f, L = "onMouseLeave", E = "onMouseEnter", x = "mouse", (t === "pointerout" || t === "pointerover") && (rt = th, L = "onPointerLeave", E = "onPointerEnter", x = "pointer"), Vt = w == null ? C : Na(w), D = et == null ? C : Na(et), C = new rt(
              L,
              x + "leave",
              w,
              n,
              B
            ), C.target = Vt, C.relatedTarget = D, L = null, ji(B) === z && (rt = new rt(
              E,
              x + "enter",
              et,
              n,
              B
            ), rt.target = D, rt.relatedTarget = Vt, L = rt), Vt = L, w && et)
              e: {
                for (rt = s1, E = w, x = et, D = 0, L = E; L; L = rt(L))
                  D++;
                L = 0;
                for (var ot = x; ot; ot = rt(ot))
                  L++;
                for (; 0 < D - L; )
                  E = rt(E), D--;
                for (; 0 < L - D; )
                  x = rt(x), L--;
                for (; D--; ) {
                  if (E === x || x !== null && E === x.alternate) {
                    rt = E;
                    break e;
                  }
                  E = rt(E), x = rt(x);
                }
                rt = null;
              }
            else rt = null;
            w !== null && Qm(
              H,
              C,
              w,
              rt,
              !1
            ), et !== null && Vt !== null && Qm(
              H,
              Vt,
              et,
              rt,
              !0
            );
          }
        }
        t: {
          if (C = z ? Na(z) : window, w = C.nodeName && C.nodeName.toLowerCase(), w === "select" || w === "input" && C.type === "file")
            var xt = rh;
          else if (sh(C))
            if (uh)
              xt = gb;
            else {
              xt = pb;
              var at = mb;
            }
          else
            w = C.nodeName, !w || w.toLowerCase() !== "input" || C.type !== "checkbox" && C.type !== "radio" ? z && Zo(z.elementType) && (xt = rh) : xt = yb;
          if (xt && (xt = xt(t, z))) {
            oh(
              H,
              xt,
              n,
              B
            );
            break t;
          }
          at && at(t, C, z), t === "focusout" && z && C.type === "number" && z.memoizedProps.value != null && Qo(C, "number", C.value);
        }
        switch (at = z ? Na(z) : window, t) {
          case "focusin":
            (sh(at) || at.contentEditable === "true") && (Ki = at, sr = z, Qa = null);
            break;
          case "focusout":
            Qa = sr = Ki = null;
            break;
          case "mousedown":
            or = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            or = !1, gh(H, n, B);
            break;
          case "selectionchange":
            if (bb) break;
          case "keydown":
          case "keyup":
            gh(H, n, B);
        }
        var mt;
        if (nr)
          t: {
            switch (t) {
              case "compositionstart":
                var Tt = "onCompositionStart";
                break t;
              case "compositionend":
                Tt = "onCompositionEnd";
                break t;
              case "compositionupdate":
                Tt = "onCompositionUpdate";
                break t;
            }
            Tt = void 0;
          }
        else
          Zi ? ah(t, n) && (Tt = "onCompositionEnd") : t === "keydown" && n.keyCode === 229 && (Tt = "onCompositionStart");
        Tt && (eh && n.locale !== "ko" && (Zi || Tt !== "onCompositionStart" ? Tt === "onCompositionEnd" && Zi && (mt = Pf()) : (_n = B, Wo = "value" in _n ? _n.value : _n.textContent, Zi = !0)), at = ks(z, Tt), 0 < at.length && (Tt = new If(
          Tt,
          t,
          null,
          n,
          B
        ), H.push({ event: Tt, listeners: at }), mt ? Tt.data = mt : (mt = lh(n), mt !== null && (Tt.data = mt)))), (mt = ub ? cb(t, n) : fb(t, n)) && (Tt = ks(z, "onBeforeInput"), 0 < Tt.length && (at = new If(
          "onBeforeInput",
          "beforeinput",
          null,
          n,
          B
        ), H.push({
          event: at,
          listeners: Tt
        }), at.data = mt)), n1(
          H,
          t,
          z,
          n,
          B
        );
      }
      Xm(H, e);
    });
  }
  function yl(t, e, n) {
    return {
      instance: t,
      listener: e,
      currentTarget: n
    };
  }
  function ks(t, e) {
    for (var n = e + "Capture", a = []; t !== null; ) {
      var r = t, u = r.stateNode;
      if (r = r.tag, r !== 5 && r !== 26 && r !== 27 || u === null || (r = La(t, n), r != null && a.unshift(
        yl(t, r, u)
      ), r = La(t, e), r != null && a.push(
        yl(t, r, u)
      )), t.tag === 3) return a;
      t = t.return;
    }
    return [];
  }
  function s1(t) {
    if (t === null) return null;
    do
      t = t.return;
    while (t && t.tag !== 5 && t.tag !== 27);
    return t || null;
  }
  function Qm(t, e, n, a, r) {
    for (var u = e._reactName, h = []; n !== null && n !== a; ) {
      var g = n, S = g.alternate, z = g.stateNode;
      if (g = g.tag, S !== null && S === a) break;
      g !== 5 && g !== 26 && g !== 27 || z === null || (S = z, r ? (z = La(n, u), z != null && h.unshift(
        yl(n, z, S)
      )) : r || (z = La(n, u), z != null && h.push(
        yl(n, z, S)
      ))), n = n.return;
    }
    h.length !== 0 && t.push({ event: e, listeners: h });
  }
  var o1 = /\r\n?/g, r1 = /\u0000|\uFFFD/g;
  function Zm(t) {
    return (typeof t == "string" ? t : "" + t).replace(o1, `
`).replace(r1, "");
  }
  function Km(t, e) {
    return e = Zm(e), Zm(t) === e;
  }
  function wt(t, e, n, a, r, u) {
    switch (n) {
      case "children":
        typeof a == "string" ? e === "body" || e === "textarea" && a === "" || Xi(t, a) : (typeof a == "number" || typeof a == "bigint") && e !== "body" && Xi(t, "" + a);
        break;
      case "className":
        Jl(t, "class", a);
        break;
      case "tabIndex":
        Jl(t, "tabindex", a);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        Jl(t, n, a);
        break;
      case "style":
        Kf(t, a, u);
        break;
      case "data":
        if (e !== "object") {
          Jl(t, "data", a);
          break;
        }
      case "src":
      case "href":
        if (a === "" && (e !== "a" || n !== "href")) {
          t.removeAttribute(n);
          break;
        }
        if (a == null || typeof a == "function" || typeof a == "symbol" || typeof a == "boolean") {
          t.removeAttribute(n);
          break;
        }
        a = Pl("" + a), t.setAttribute(n, a);
        break;
      case "action":
      case "formAction":
        if (typeof a == "function") {
          t.setAttribute(
            n,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          typeof u == "function" && (n === "formAction" ? (e !== "input" && wt(t, e, "name", r.name, r, null), wt(
            t,
            e,
            "formEncType",
            r.formEncType,
            r,
            null
          ), wt(
            t,
            e,
            "formMethod",
            r.formMethod,
            r,
            null
          ), wt(
            t,
            e,
            "formTarget",
            r.formTarget,
            r,
            null
          )) : (wt(t, e, "encType", r.encType, r, null), wt(t, e, "method", r.method, r, null), wt(t, e, "target", r.target, r, null)));
        if (a == null || typeof a == "symbol" || typeof a == "boolean") {
          t.removeAttribute(n);
          break;
        }
        a = Pl("" + a), t.setAttribute(n, a);
        break;
      case "onClick":
        a != null && (t.onclick = hn);
        break;
      case "onScroll":
        a != null && bt("scroll", t);
        break;
      case "onScrollEnd":
        a != null && bt("scrollend", t);
        break;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(o(61));
          if (n = a.__html, n != null) {
            if (r.children != null) throw Error(o(60));
            t.innerHTML = n;
          }
        }
        break;
      case "multiple":
        t.multiple = a && typeof a != "function" && typeof a != "symbol";
        break;
      case "muted":
        t.muted = a && typeof a != "function" && typeof a != "symbol";
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "ref":
        break;
      case "autoFocus":
        break;
      case "xlinkHref":
        if (a == null || typeof a == "function" || typeof a == "boolean" || typeof a == "symbol") {
          t.removeAttribute("xlink:href");
          break;
        }
        n = Pl("" + a), t.setAttributeNS(
          "http://www.w3.org/1999/xlink",
          "xlink:href",
          n
        );
        break;
      case "contentEditable":
      case "spellCheck":
      case "draggable":
      case "value":
      case "autoReverse":
      case "externalResourcesRequired":
      case "focusable":
      case "preserveAlpha":
        a != null && typeof a != "function" && typeof a != "symbol" ? t.setAttribute(n, "" + a) : t.removeAttribute(n);
        break;
      case "inert":
      case "allowFullScreen":
      case "async":
      case "autoPlay":
      case "controls":
      case "default":
      case "defer":
      case "disabled":
      case "disablePictureInPicture":
      case "disableRemotePlayback":
      case "formNoValidate":
      case "hidden":
      case "loop":
      case "noModule":
      case "noValidate":
      case "open":
      case "playsInline":
      case "readOnly":
      case "required":
      case "reversed":
      case "scoped":
      case "seamless":
      case "itemScope":
        a && typeof a != "function" && typeof a != "symbol" ? t.setAttribute(n, "") : t.removeAttribute(n);
        break;
      case "capture":
      case "download":
        a === !0 ? t.setAttribute(n, "") : a !== !1 && a != null && typeof a != "function" && typeof a != "symbol" ? t.setAttribute(n, a) : t.removeAttribute(n);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        a != null && typeof a != "function" && typeof a != "symbol" && !isNaN(a) && 1 <= a ? t.setAttribute(n, a) : t.removeAttribute(n);
        break;
      case "rowSpan":
      case "start":
        a == null || typeof a == "function" || typeof a == "symbol" || isNaN(a) ? t.removeAttribute(n) : t.setAttribute(n, a);
        break;
      case "popover":
        bt("beforetoggle", t), bt("toggle", t), Kl(t, "popover", a);
        break;
      case "xlinkActuate":
        fn(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          a
        );
        break;
      case "xlinkArcrole":
        fn(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          a
        );
        break;
      case "xlinkRole":
        fn(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          a
        );
        break;
      case "xlinkShow":
        fn(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          a
        );
        break;
      case "xlinkTitle":
        fn(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          a
        );
        break;
      case "xlinkType":
        fn(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          a
        );
        break;
      case "xmlBase":
        fn(
          t,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          a
        );
        break;
      case "xmlLang":
        fn(
          t,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          a
        );
        break;
      case "xmlSpace":
        fn(
          t,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          a
        );
        break;
      case "is":
        Kl(t, "is", a);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") && (n = N0.get(n) || n, Kl(t, n, a));
    }
  }
  function Vu(t, e, n, a, r, u) {
    switch (n) {
      case "style":
        Kf(t, a, u);
        break;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(o(61));
          if (n = a.__html, n != null) {
            if (r.children != null) throw Error(o(60));
            t.innerHTML = n;
          }
        }
        break;
      case "children":
        typeof a == "string" ? Xi(t, a) : (typeof a == "number" || typeof a == "bigint") && Xi(t, "" + a);
        break;
      case "onScroll":
        a != null && bt("scroll", t);
        break;
      case "onScrollEnd":
        a != null && bt("scrollend", t);
        break;
      case "onClick":
        a != null && (t.onclick = hn);
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "innerHTML":
      case "ref":
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        if (!jf.hasOwnProperty(n))
          t: {
            if (n[0] === "o" && n[1] === "n" && (r = n.endsWith("Capture"), e = n.slice(2, r ? n.length - 7 : void 0), u = t[pe] || null, u = u != null ? u[n] : null, typeof u == "function" && t.removeEventListener(e, u, r), typeof a == "function")) {
              typeof u != "function" && u !== null && (n in t ? t[n] = null : t.hasAttribute(n) && t.removeAttribute(n)), t.addEventListener(e, a, r);
              break t;
            }
            n in t ? t[n] = a : a === !0 ? t.setAttribute(n, "") : Kl(t, n, a);
          }
    }
  }
  function re(t, e, n) {
    switch (e) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "img":
        bt("error", t), bt("load", t);
        var a = !1, r = !1, u;
        for (u in n)
          if (n.hasOwnProperty(u)) {
            var h = n[u];
            if (h != null)
              switch (u) {
                case "src":
                  a = !0;
                  break;
                case "srcSet":
                  r = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(o(137, e));
                default:
                  wt(t, e, u, h, n, null);
              }
          }
        r && wt(t, e, "srcSet", n.srcSet, n, null), a && wt(t, e, "src", n.src, n, null);
        return;
      case "input":
        bt("invalid", t);
        var g = u = h = r = null, S = null, z = null;
        for (a in n)
          if (n.hasOwnProperty(a)) {
            var B = n[a];
            if (B != null)
              switch (a) {
                case "name":
                  r = B;
                  break;
                case "type":
                  h = B;
                  break;
                case "checked":
                  S = B;
                  break;
                case "defaultChecked":
                  z = B;
                  break;
                case "value":
                  u = B;
                  break;
                case "defaultValue":
                  g = B;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (B != null)
                    throw Error(o(137, e));
                  break;
                default:
                  wt(t, e, a, B, n, null);
              }
          }
        Xf(
          t,
          u,
          g,
          S,
          z,
          h,
          r,
          !1
        );
        return;
      case "select":
        bt("invalid", t), a = h = u = null;
        for (r in n)
          if (n.hasOwnProperty(r) && (g = n[r], g != null))
            switch (r) {
              case "value":
                u = g;
                break;
              case "defaultValue":
                h = g;
                break;
              case "multiple":
                a = g;
              default:
                wt(t, e, r, g, n, null);
            }
        e = u, n = h, t.multiple = !!a, e != null ? qi(t, !!a, e, !1) : n != null && qi(t, !!a, n, !0);
        return;
      case "textarea":
        bt("invalid", t), u = r = a = null;
        for (h in n)
          if (n.hasOwnProperty(h) && (g = n[h], g != null))
            switch (h) {
              case "value":
                a = g;
                break;
              case "defaultValue":
                r = g;
                break;
              case "children":
                u = g;
                break;
              case "dangerouslySetInnerHTML":
                if (g != null) throw Error(o(91));
                break;
              default:
                wt(t, e, h, g, n, null);
            }
        Qf(t, a, r, u);
        return;
      case "option":
        for (S in n)
          n.hasOwnProperty(S) && (a = n[S], a != null) && (S === "selected" ? t.selected = a && typeof a != "function" && typeof a != "symbol" : wt(t, e, S, a, n, null));
        return;
      case "dialog":
        bt("beforetoggle", t), bt("toggle", t), bt("cancel", t), bt("close", t);
        break;
      case "iframe":
      case "object":
        bt("load", t);
        break;
      case "video":
      case "audio":
        for (a = 0; a < pl.length; a++)
          bt(pl[a], t);
        break;
      case "image":
        bt("error", t), bt("load", t);
        break;
      case "details":
        bt("toggle", t);
        break;
      case "embed":
      case "source":
      case "link":
        bt("error", t), bt("load", t);
      case "area":
      case "base":
      case "br":
      case "col":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "track":
      case "wbr":
      case "menuitem":
        for (z in n)
          if (n.hasOwnProperty(z) && (a = n[z], a != null))
            switch (z) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(o(137, e));
              default:
                wt(t, e, z, a, n, null);
            }
        return;
      default:
        if (Zo(e)) {
          for (B in n)
            n.hasOwnProperty(B) && (a = n[B], a !== void 0 && Vu(
              t,
              e,
              B,
              a,
              n,
              void 0
            ));
          return;
        }
    }
    for (g in n)
      n.hasOwnProperty(g) && (a = n[g], a != null && wt(t, e, g, a, n, null));
  }
  function u1(t, e, n, a) {
    switch (e) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "input":
        var r = null, u = null, h = null, g = null, S = null, z = null, B = null;
        for (w in n) {
          var H = n[w];
          if (n.hasOwnProperty(w) && H != null)
            switch (w) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                S = H;
              default:
                a.hasOwnProperty(w) || wt(t, e, w, null, a, H);
            }
        }
        for (var C in a) {
          var w = a[C];
          if (H = n[C], a.hasOwnProperty(C) && (w != null || H != null))
            switch (C) {
              case "type":
                u = w;
                break;
              case "name":
                r = w;
                break;
              case "checked":
                z = w;
                break;
              case "defaultChecked":
                B = w;
                break;
              case "value":
                h = w;
                break;
              case "defaultValue":
                g = w;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (w != null)
                  throw Error(o(137, e));
                break;
              default:
                w !== H && wt(
                  t,
                  e,
                  C,
                  w,
                  a,
                  H
                );
            }
        }
        ko(
          t,
          h,
          g,
          S,
          z,
          B,
          u,
          r
        );
        return;
      case "select":
        w = h = g = C = null;
        for (u in n)
          if (S = n[u], n.hasOwnProperty(u) && S != null)
            switch (u) {
              case "value":
                break;
              case "multiple":
                w = S;
              default:
                a.hasOwnProperty(u) || wt(
                  t,
                  e,
                  u,
                  null,
                  a,
                  S
                );
            }
        for (r in a)
          if (u = a[r], S = n[r], a.hasOwnProperty(r) && (u != null || S != null))
            switch (r) {
              case "value":
                C = u;
                break;
              case "defaultValue":
                g = u;
                break;
              case "multiple":
                h = u;
              default:
                u !== S && wt(
                  t,
                  e,
                  r,
                  u,
                  a,
                  S
                );
            }
        e = g, n = h, a = w, C != null ? qi(t, !!n, C, !1) : !!a != !!n && (e != null ? qi(t, !!n, e, !0) : qi(t, !!n, n ? [] : "", !1));
        return;
      case "textarea":
        w = C = null;
        for (g in n)
          if (r = n[g], n.hasOwnProperty(g) && r != null && !a.hasOwnProperty(g))
            switch (g) {
              case "value":
                break;
              case "children":
                break;
              default:
                wt(t, e, g, null, a, r);
            }
        for (h in a)
          if (r = a[h], u = n[h], a.hasOwnProperty(h) && (r != null || u != null))
            switch (h) {
              case "value":
                C = r;
                break;
              case "defaultValue":
                w = r;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (r != null) throw Error(o(91));
                break;
              default:
                r !== u && wt(t, e, h, r, a, u);
            }
        kf(t, C, w);
        return;
      case "option":
        for (var et in n)
          C = n[et], n.hasOwnProperty(et) && C != null && !a.hasOwnProperty(et) && (et === "selected" ? t.selected = !1 : wt(
            t,
            e,
            et,
            null,
            a,
            C
          ));
        for (S in a)
          C = a[S], w = n[S], a.hasOwnProperty(S) && C !== w && (C != null || w != null) && (S === "selected" ? t.selected = C && typeof C != "function" && typeof C != "symbol" : wt(
            t,
            e,
            S,
            C,
            a,
            w
          ));
        return;
      case "img":
      case "link":
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr":
      case "menuitem":
        for (var rt in n)
          C = n[rt], n.hasOwnProperty(rt) && C != null && !a.hasOwnProperty(rt) && wt(t, e, rt, null, a, C);
        for (z in a)
          if (C = a[z], w = n[z], a.hasOwnProperty(z) && C !== w && (C != null || w != null))
            switch (z) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (C != null)
                  throw Error(o(137, e));
                break;
              default:
                wt(
                  t,
                  e,
                  z,
                  C,
                  a,
                  w
                );
            }
        return;
      default:
        if (Zo(e)) {
          for (var Vt in n)
            C = n[Vt], n.hasOwnProperty(Vt) && C !== void 0 && !a.hasOwnProperty(Vt) && Vu(
              t,
              e,
              Vt,
              void 0,
              a,
              C
            );
          for (B in a)
            C = a[B], w = n[B], !a.hasOwnProperty(B) || C === w || C === void 0 && w === void 0 || Vu(
              t,
              e,
              B,
              C,
              a,
              w
            );
          return;
        }
    }
    for (var E in n)
      C = n[E], n.hasOwnProperty(E) && C != null && !a.hasOwnProperty(E) && wt(t, e, E, null, a, C);
    for (H in a)
      C = a[H], w = n[H], !a.hasOwnProperty(H) || C === w || C == null && w == null || wt(t, e, H, C, a, w);
  }
  function Jm(t) {
    switch (t) {
      case "css":
      case "script":
      case "font":
      case "img":
      case "image":
      case "input":
      case "link":
        return !0;
      default:
        return !1;
    }
  }
  function c1() {
    if (typeof performance.getEntriesByType == "function") {
      for (var t = 0, e = 0, n = performance.getEntriesByType("resource"), a = 0; a < n.length; a++) {
        var r = n[a], u = r.transferSize, h = r.initiatorType, g = r.duration;
        if (u && g && Jm(h)) {
          for (h = 0, g = r.responseEnd, a += 1; a < n.length; a++) {
            var S = n[a], z = S.startTime;
            if (z > g) break;
            var B = S.transferSize, H = S.initiatorType;
            B && Jm(H) && (S = S.responseEnd, h += B * (S < g ? 1 : (g - z) / (S - z)));
          }
          if (--a, e += 8 * (u + h) / (r.duration / 1e3), t++, 10 < t) break;
        }
      }
      if (0 < t) return e / t / 1e6;
    }
    return navigator.connection && (t = navigator.connection.downlink, typeof t == "number") ? t : 5;
  }
  var _u = null, Bu = null;
  function Qs(t) {
    return t.nodeType === 9 ? t : t.ownerDocument;
  }
  function Fm(t) {
    switch (t) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function Pm(t, e) {
    if (t === 0)
      switch (e) {
        case "svg":
          return 1;
        case "math":
          return 2;
        default:
          return 0;
      }
    return t === 1 && e === "foreignObject" ? 0 : t;
  }
  function Uu(t, e) {
    return t === "textarea" || t === "noscript" || typeof e.children == "string" || typeof e.children == "number" || typeof e.children == "bigint" || typeof e.dangerouslySetInnerHTML == "object" && e.dangerouslySetInnerHTML !== null && e.dangerouslySetInnerHTML.__html != null;
  }
  var Nu = null;
  function f1() {
    var t = window.event;
    return t && t.type === "popstate" ? t === Nu ? !1 : (Nu = t, !0) : (Nu = null, !1);
  }
  var Wm = typeof setTimeout == "function" ? setTimeout : void 0, h1 = typeof clearTimeout == "function" ? clearTimeout : void 0, $m = typeof Promise == "function" ? Promise : void 0, d1 = typeof queueMicrotask == "function" ? queueMicrotask : typeof $m < "u" ? function(t) {
    return $m.resolve(null).then(t).catch(m1);
  } : Wm;
  function m1(t) {
    setTimeout(function() {
      throw t;
    });
  }
  function Pn(t) {
    return t === "head";
  }
  function Im(t, e) {
    var n = e, a = 0;
    do {
      var r = n.nextSibling;
      if (t.removeChild(n), r && r.nodeType === 8)
        if (n = r.data, n === "/$" || n === "/&") {
          if (a === 0) {
            t.removeChild(r), Sa(e);
            return;
          }
          a--;
        } else if (n === "$" || n === "$?" || n === "$~" || n === "$!" || n === "&")
          a++;
        else if (n === "html")
          gl(t.ownerDocument.documentElement);
        else if (n === "head") {
          n = t.ownerDocument.head, gl(n);
          for (var u = n.firstChild; u; ) {
            var h = u.nextSibling, g = u.nodeName;
            u[Ua] || g === "SCRIPT" || g === "STYLE" || g === "LINK" && u.rel.toLowerCase() === "stylesheet" || n.removeChild(u), u = h;
          }
        } else
          n === "body" && gl(t.ownerDocument.body);
      n = r;
    } while (n);
    Sa(e);
  }
  function tp(t, e) {
    var n = t;
    t = 0;
    do {
      var a = n.nextSibling;
      if (n.nodeType === 1 ? e ? (n._stashedDisplay = n.style.display, n.style.display = "none") : (n.style.display = n._stashedDisplay || "", n.getAttribute("style") === "" && n.removeAttribute("style")) : n.nodeType === 3 && (e ? (n._stashedText = n.nodeValue, n.nodeValue = "") : n.nodeValue = n._stashedText || ""), a && a.nodeType === 8)
        if (n = a.data, n === "/$") {
          if (t === 0) break;
          t--;
        } else
          n !== "$" && n !== "$?" && n !== "$~" && n !== "$!" || t++;
      n = a;
    } while (n);
  }
  function Lu(t) {
    var e = t.firstChild;
    for (e && e.nodeType === 10 && (e = e.nextSibling); e; ) {
      var n = e;
      switch (e = e.nextSibling, n.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          Lu(n), qo(n);
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (n.rel.toLowerCase() === "stylesheet") continue;
      }
      t.removeChild(n);
    }
  }
  function p1(t, e, n, a) {
    for (; t.nodeType === 1; ) {
      var r = n;
      if (t.nodeName.toLowerCase() !== e.toLowerCase()) {
        if (!a && (t.nodeName !== "INPUT" || t.type !== "hidden"))
          break;
      } else if (a) {
        if (!t[Ua])
          switch (e) {
            case "meta":
              if (!t.hasAttribute("itemprop")) break;
              return t;
            case "link":
              if (u = t.getAttribute("rel"), u === "stylesheet" && t.hasAttribute("data-precedence"))
                break;
              if (u !== r.rel || t.getAttribute("href") !== (r.href == null || r.href === "" ? null : r.href) || t.getAttribute("crossorigin") !== (r.crossOrigin == null ? null : r.crossOrigin) || t.getAttribute("title") !== (r.title == null ? null : r.title))
                break;
              return t;
            case "style":
              if (t.hasAttribute("data-precedence")) break;
              return t;
            case "script":
              if (u = t.getAttribute("src"), (u !== (r.src == null ? null : r.src) || t.getAttribute("type") !== (r.type == null ? null : r.type) || t.getAttribute("crossorigin") !== (r.crossOrigin == null ? null : r.crossOrigin)) && u && t.hasAttribute("async") && !t.hasAttribute("itemprop"))
                break;
              return t;
            default:
              return t;
          }
      } else if (e === "input" && t.type === "hidden") {
        var u = r.name == null ? null : "" + r.name;
        if (r.type === "hidden" && t.getAttribute("name") === u)
          return t;
      } else return t;
      if (t = Xe(t.nextSibling), t === null) break;
    }
    return null;
  }
  function y1(t, e, n) {
    if (e === "") return null;
    for (; t.nodeType !== 3; )
      if ((t.nodeType !== 1 || t.nodeName !== "INPUT" || t.type !== "hidden") && !n || (t = Xe(t.nextSibling), t === null)) return null;
    return t;
  }
  function ep(t, e) {
    for (; t.nodeType !== 8; )
      if ((t.nodeType !== 1 || t.nodeName !== "INPUT" || t.type !== "hidden") && !e || (t = Xe(t.nextSibling), t === null)) return null;
    return t;
  }
  function ju(t) {
    return t.data === "$?" || t.data === "$~";
  }
  function Hu(t) {
    return t.data === "$!" || t.data === "$?" && t.ownerDocument.readyState !== "loading";
  }
  function g1(t, e) {
    var n = t.ownerDocument;
    if (t.data === "$~") t._reactRetry = e;
    else if (t.data !== "$?" || n.readyState !== "loading")
      e();
    else {
      var a = function() {
        e(), n.removeEventListener("DOMContentLoaded", a);
      };
      n.addEventListener("DOMContentLoaded", a), t._reactRetry = a;
    }
  }
  function Xe(t) {
    for (; t != null; t = t.nextSibling) {
      var e = t.nodeType;
      if (e === 1 || e === 3) break;
      if (e === 8) {
        if (e = t.data, e === "$" || e === "$!" || e === "$?" || e === "$~" || e === "&" || e === "F!" || e === "F")
          break;
        if (e === "/$" || e === "/&") return null;
      }
    }
    return t;
  }
  var Gu = null;
  function np(t) {
    t = t.nextSibling;
    for (var e = 0; t; ) {
      if (t.nodeType === 8) {
        var n = t.data;
        if (n === "/$" || n === "/&") {
          if (e === 0)
            return Xe(t.nextSibling);
          e--;
        } else
          n !== "$" && n !== "$!" && n !== "$?" && n !== "$~" && n !== "&" || e++;
      }
      t = t.nextSibling;
    }
    return null;
  }
  function ip(t) {
    t = t.previousSibling;
    for (var e = 0; t; ) {
      if (t.nodeType === 8) {
        var n = t.data;
        if (n === "$" || n === "$!" || n === "$?" || n === "$~" || n === "&") {
          if (e === 0) return t;
          e--;
        } else n !== "/$" && n !== "/&" || e++;
      }
      t = t.previousSibling;
    }
    return null;
  }
  function ap(t, e, n) {
    switch (e = Qs(n), t) {
      case "html":
        if (t = e.documentElement, !t) throw Error(o(452));
        return t;
      case "head":
        if (t = e.head, !t) throw Error(o(453));
        return t;
      case "body":
        if (t = e.body, !t) throw Error(o(454));
        return t;
      default:
        throw Error(o(451));
    }
  }
  function gl(t) {
    for (var e = t.attributes; e.length; )
      t.removeAttributeNode(e[0]);
    qo(t);
  }
  var ke = /* @__PURE__ */ new Map(), lp = /* @__PURE__ */ new Set();
  function Zs(t) {
    return typeof t.getRootNode == "function" ? t.getRootNode() : t.nodeType === 9 ? t : t.ownerDocument;
  }
  var Cn = X.d;
  X.d = {
    f: v1,
    r: b1,
    D: S1,
    C: T1,
    L: A1,
    m: x1,
    X: M1,
    S: E1,
    M: D1
  };
  function v1() {
    var t = Cn.f(), e = Ls();
    return t || e;
  }
  function b1(t) {
    var e = Hi(t);
    e !== null && e.tag === 5 && e.type === "form" ? Ad(e) : Cn.r(t);
  }
  var ga = typeof document > "u" ? null : document;
  function sp(t, e, n) {
    var a = ga;
    if (a && typeof e == "string" && e) {
      var r = Ne(e);
      r = 'link[rel="' + t + '"][href="' + r + '"]', typeof n == "string" && (r += '[crossorigin="' + n + '"]'), lp.has(r) || (lp.add(r), t = { rel: t, crossOrigin: n, href: e }, a.querySelector(r) === null && (e = a.createElement("link"), re(e, "link", t), ee(e), a.head.appendChild(e)));
    }
  }
  function S1(t) {
    Cn.D(t), sp("dns-prefetch", t, null);
  }
  function T1(t, e) {
    Cn.C(t, e), sp("preconnect", t, e);
  }
  function A1(t, e, n) {
    Cn.L(t, e, n);
    var a = ga;
    if (a && t && e) {
      var r = 'link[rel="preload"][as="' + Ne(e) + '"]';
      e === "image" && n && n.imageSrcSet ? (r += '[imagesrcset="' + Ne(
        n.imageSrcSet
      ) + '"]', typeof n.imageSizes == "string" && (r += '[imagesizes="' + Ne(
        n.imageSizes
      ) + '"]')) : r += '[href="' + Ne(t) + '"]';
      var u = r;
      switch (e) {
        case "style":
          u = va(t);
          break;
        case "script":
          u = ba(t);
      }
      ke.has(u) || (t = b(
        {
          rel: "preload",
          href: e === "image" && n && n.imageSrcSet ? void 0 : t,
          as: e
        },
        n
      ), ke.set(u, t), a.querySelector(r) !== null || e === "style" && a.querySelector(vl(u)) || e === "script" && a.querySelector(bl(u)) || (e = a.createElement("link"), re(e, "link", t), ee(e), a.head.appendChild(e)));
    }
  }
  function x1(t, e) {
    Cn.m(t, e);
    var n = ga;
    if (n && t) {
      var a = e && typeof e.as == "string" ? e.as : "script", r = 'link[rel="modulepreload"][as="' + Ne(a) + '"][href="' + Ne(t) + '"]', u = r;
      switch (a) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          u = ba(t);
      }
      if (!ke.has(u) && (t = b({ rel: "modulepreload", href: t }, e), ke.set(u, t), n.querySelector(r) === null)) {
        switch (a) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (n.querySelector(bl(u)))
              return;
        }
        a = n.createElement("link"), re(a, "link", t), ee(a), n.head.appendChild(a);
      }
    }
  }
  function E1(t, e, n) {
    Cn.S(t, e, n);
    var a = ga;
    if (a && t) {
      var r = Gi(a).hoistableStyles, u = va(t);
      e = e || "default";
      var h = r.get(u);
      if (!h) {
        var g = { loading: 0, preload: null };
        if (h = a.querySelector(
          vl(u)
        ))
          g.loading = 5;
        else {
          t = b(
            { rel: "stylesheet", href: t, "data-precedence": e },
            n
          ), (n = ke.get(u)) && Yu(t, n);
          var S = h = a.createElement("link");
          ee(S), re(S, "link", t), S._p = new Promise(function(z, B) {
            S.onload = z, S.onerror = B;
          }), S.addEventListener("load", function() {
            g.loading |= 1;
          }), S.addEventListener("error", function() {
            g.loading |= 2;
          }), g.loading |= 4, Ks(h, e, a);
        }
        h = {
          type: "stylesheet",
          instance: h,
          count: 1,
          state: g
        }, r.set(u, h);
      }
    }
  }
  function M1(t, e) {
    Cn.X(t, e);
    var n = ga;
    if (n && t) {
      var a = Gi(n).hoistableScripts, r = ba(t), u = a.get(r);
      u || (u = n.querySelector(bl(r)), u || (t = b({ src: t, async: !0 }, e), (e = ke.get(r)) && qu(t, e), u = n.createElement("script"), ee(u), re(u, "link", t), n.head.appendChild(u)), u = {
        type: "script",
        instance: u,
        count: 1,
        state: null
      }, a.set(r, u));
    }
  }
  function D1(t, e) {
    Cn.M(t, e);
    var n = ga;
    if (n && t) {
      var a = Gi(n).hoistableScripts, r = ba(t), u = a.get(r);
      u || (u = n.querySelector(bl(r)), u || (t = b({ src: t, async: !0, type: "module" }, e), (e = ke.get(r)) && qu(t, e), u = n.createElement("script"), ee(u), re(u, "link", t), n.head.appendChild(u)), u = {
        type: "script",
        instance: u,
        count: 1,
        state: null
      }, a.set(r, u));
    }
  }
  function op(t, e, n, a) {
    var r = (r = lt.current) ? Zs(r) : null;
    if (!r) throw Error(o(446));
    switch (t) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof n.precedence == "string" && typeof n.href == "string" ? (e = va(n.href), n = Gi(
          r
        ).hoistableStyles, a = n.get(e), a || (a = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, n.set(e, a)), a) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (n.rel === "stylesheet" && typeof n.href == "string" && typeof n.precedence == "string") {
          t = va(n.href);
          var u = Gi(
            r
          ).hoistableStyles, h = u.get(t);
          if (h || (r = r.ownerDocument || r, h = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, u.set(t, h), (u = r.querySelector(
            vl(t)
          )) && !u._p && (h.instance = u, h.state.loading = 5), ke.has(t) || (n = {
            rel: "preload",
            as: "style",
            href: n.href,
            crossOrigin: n.crossOrigin,
            integrity: n.integrity,
            media: n.media,
            hrefLang: n.hrefLang,
            referrerPolicy: n.referrerPolicy
          }, ke.set(t, n), u || z1(
            r,
            t,
            n,
            h.state
          ))), e && a === null)
            throw Error(o(528, ""));
          return h;
        }
        if (e && a !== null)
          throw Error(o(529, ""));
        return null;
      case "script":
        return e = n.async, n = n.src, typeof n == "string" && e && typeof e != "function" && typeof e != "symbol" ? (e = ba(n), n = Gi(
          r
        ).hoistableScripts, a = n.get(e), a || (a = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, n.set(e, a)), a) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(o(444, t));
    }
  }
  function va(t) {
    return 'href="' + Ne(t) + '"';
  }
  function vl(t) {
    return 'link[rel="stylesheet"][' + t + "]";
  }
  function rp(t) {
    return b({}, t, {
      "data-precedence": t.precedence,
      precedence: null
    });
  }
  function z1(t, e, n, a) {
    t.querySelector('link[rel="preload"][as="style"][' + e + "]") ? a.loading = 1 : (e = t.createElement("link"), a.preload = e, e.addEventListener("load", function() {
      return a.loading |= 1;
    }), e.addEventListener("error", function() {
      return a.loading |= 2;
    }), re(e, "link", n), ee(e), t.head.appendChild(e));
  }
  function ba(t) {
    return '[src="' + Ne(t) + '"]';
  }
  function bl(t) {
    return "script[async]" + t;
  }
  function up(t, e, n) {
    if (e.count++, e.instance === null)
      switch (e.type) {
        case "style":
          var a = t.querySelector(
            'style[data-href~="' + Ne(n.href) + '"]'
          );
          if (a)
            return e.instance = a, ee(a), a;
          var r = b({}, n, {
            "data-href": n.href,
            "data-precedence": n.precedence,
            href: null,
            precedence: null
          });
          return a = (t.ownerDocument || t).createElement(
            "style"
          ), ee(a), re(a, "style", r), Ks(a, n.precedence, t), e.instance = a;
        case "stylesheet":
          r = va(n.href);
          var u = t.querySelector(
            vl(r)
          );
          if (u)
            return e.state.loading |= 4, e.instance = u, ee(u), u;
          a = rp(n), (r = ke.get(r)) && Yu(a, r), u = (t.ownerDocument || t).createElement("link"), ee(u);
          var h = u;
          return h._p = new Promise(function(g, S) {
            h.onload = g, h.onerror = S;
          }), re(u, "link", a), e.state.loading |= 4, Ks(u, n.precedence, t), e.instance = u;
        case "script":
          return u = ba(n.src), (r = t.querySelector(
            bl(u)
          )) ? (e.instance = r, ee(r), r) : (a = n, (r = ke.get(u)) && (a = b({}, n), qu(a, r)), t = t.ownerDocument || t, r = t.createElement("script"), ee(r), re(r, "link", a), t.head.appendChild(r), e.instance = r);
        case "void":
          return null;
        default:
          throw Error(o(443, e.type));
      }
    else
      e.type === "stylesheet" && (e.state.loading & 4) === 0 && (a = e.instance, e.state.loading |= 4, Ks(a, n.precedence, t));
    return e.instance;
  }
  function Ks(t, e, n) {
    for (var a = n.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), r = a.length ? a[a.length - 1] : null, u = r, h = 0; h < a.length; h++) {
      var g = a[h];
      if (g.dataset.precedence === e) u = g;
      else if (u !== r) break;
    }
    u ? u.parentNode.insertBefore(t, u.nextSibling) : (e = n.nodeType === 9 ? n.head : n, e.insertBefore(t, e.firstChild));
  }
  function Yu(t, e) {
    t.crossOrigin == null && (t.crossOrigin = e.crossOrigin), t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy), t.title == null && (t.title = e.title);
  }
  function qu(t, e) {
    t.crossOrigin == null && (t.crossOrigin = e.crossOrigin), t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy), t.integrity == null && (t.integrity = e.integrity);
  }
  var Js = null;
  function cp(t, e, n) {
    if (Js === null) {
      var a = /* @__PURE__ */ new Map(), r = Js = /* @__PURE__ */ new Map();
      r.set(n, a);
    } else
      r = Js, a = r.get(n), a || (a = /* @__PURE__ */ new Map(), r.set(n, a));
    if (a.has(t)) return a;
    for (a.set(t, null), n = n.getElementsByTagName(t), r = 0; r < n.length; r++) {
      var u = n[r];
      if (!(u[Ua] || u[ae] || t === "link" && u.getAttribute("rel") === "stylesheet") && u.namespaceURI !== "http://www.w3.org/2000/svg") {
        var h = u.getAttribute(e) || "";
        h = t + h;
        var g = a.get(h);
        g ? g.push(u) : a.set(h, [u]);
      }
    }
    return a;
  }
  function fp(t, e, n) {
    t = t.ownerDocument || t, t.head.insertBefore(
      n,
      e === "title" ? t.querySelector("head > title") : null
    );
  }
  function C1(t, e, n) {
    if (n === 1 || e.itemProp != null) return !1;
    switch (t) {
      case "meta":
      case "title":
        return !0;
      case "style":
        if (typeof e.precedence != "string" || typeof e.href != "string" || e.href === "")
          break;
        return !0;
      case "link":
        if (typeof e.rel != "string" || typeof e.href != "string" || e.href === "" || e.onLoad || e.onError)
          break;
        return e.rel === "stylesheet" ? (t = e.disabled, typeof e.precedence == "string" && t == null) : !0;
      case "script":
        if (e.async && typeof e.async != "function" && typeof e.async != "symbol" && !e.onLoad && !e.onError && e.src && typeof e.src == "string")
          return !0;
    }
    return !1;
  }
  function hp(t) {
    return !(t.type === "stylesheet" && (t.state.loading & 3) === 0);
  }
  function R1(t, e, n, a) {
    if (n.type === "stylesheet" && (typeof a.media != "string" || matchMedia(a.media).matches !== !1) && (n.state.loading & 4) === 0) {
      if (n.instance === null) {
        var r = va(a.href), u = e.querySelector(
          vl(r)
        );
        if (u) {
          e = u._p, e !== null && typeof e == "object" && typeof e.then == "function" && (t.count++, t = Fs.bind(t), e.then(t, t)), n.state.loading |= 4, n.instance = u, ee(u);
          return;
        }
        u = e.ownerDocument || e, a = rp(a), (r = ke.get(r)) && Yu(a, r), u = u.createElement("link"), ee(u);
        var h = u;
        h._p = new Promise(function(g, S) {
          h.onload = g, h.onerror = S;
        }), re(u, "link", a), n.instance = u;
      }
      t.stylesheets === null && (t.stylesheets = /* @__PURE__ */ new Map()), t.stylesheets.set(n, e), (e = n.state.preload) && (n.state.loading & 3) === 0 && (t.count++, n = Fs.bind(t), e.addEventListener("load", n), e.addEventListener("error", n));
    }
  }
  var Xu = 0;
  function O1(t, e) {
    return t.stylesheets && t.count === 0 && Ws(t, t.stylesheets), 0 < t.count || 0 < t.imgCount ? function(n) {
      var a = setTimeout(function() {
        if (t.stylesheets && Ws(t, t.stylesheets), t.unsuspend) {
          var u = t.unsuspend;
          t.unsuspend = null, u();
        }
      }, 6e4 + e);
      0 < t.imgBytes && Xu === 0 && (Xu = 62500 * c1());
      var r = setTimeout(
        function() {
          if (t.waitingForImages = !1, t.count === 0 && (t.stylesheets && Ws(t, t.stylesheets), t.unsuspend)) {
            var u = t.unsuspend;
            t.unsuspend = null, u();
          }
        },
        (t.imgBytes > Xu ? 50 : 800) + e
      );
      return t.unsuspend = n, function() {
        t.unsuspend = null, clearTimeout(a), clearTimeout(r);
      };
    } : null;
  }
  function Fs() {
    if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
      if (this.stylesheets) Ws(this, this.stylesheets);
      else if (this.unsuspend) {
        var t = this.unsuspend;
        this.unsuspend = null, t();
      }
    }
  }
  var Ps = null;
  function Ws(t, e) {
    t.stylesheets = null, t.unsuspend !== null && (t.count++, Ps = /* @__PURE__ */ new Map(), e.forEach(w1, t), Ps = null, Fs.call(t));
  }
  function w1(t, e) {
    if (!(e.state.loading & 4)) {
      var n = Ps.get(t);
      if (n) var a = n.get(null);
      else {
        n = /* @__PURE__ */ new Map(), Ps.set(t, n);
        for (var r = t.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), u = 0; u < r.length; u++) {
          var h = r[u];
          (h.nodeName === "LINK" || h.getAttribute("media") !== "not all") && (n.set(h.dataset.precedence, h), a = h);
        }
        a && n.set(null, a);
      }
      r = e.instance, h = r.getAttribute("data-precedence"), u = n.get(h) || a, u === a && n.set(null, r), n.set(h, r), this.count++, a = Fs.bind(this), r.addEventListener("load", a), r.addEventListener("error", a), u ? u.parentNode.insertBefore(r, u.nextSibling) : (t = t.nodeType === 9 ? t.head : t, t.insertBefore(r, t.firstChild)), e.state.loading |= 4;
    }
  }
  var Sl = {
    $$typeof: Y,
    Provider: null,
    Consumer: null,
    _currentValue: Z,
    _currentValue2: Z,
    _threadCount: 0
  };
  function V1(t, e, n, a, r, u, h, g, S) {
    this.tag = 1, this.containerInfo = t, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = jo(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = jo(0), this.hiddenUpdates = jo(null), this.identifierPrefix = a, this.onUncaughtError = r, this.onCaughtError = u, this.onRecoverableError = h, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = S, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function dp(t, e, n, a, r, u, h, g, S, z, B, H) {
    return t = new V1(
      t,
      e,
      n,
      h,
      S,
      z,
      B,
      H,
      g
    ), e = 1, u === !0 && (e |= 24), u = ze(3, null, null, e), t.current = u, u.stateNode = t, e = Ar(), e.refCount++, t.pooledCache = e, e.refCount++, u.memoizedState = {
      element: a,
      isDehydrated: n,
      cache: e
    }, Dr(u), t;
  }
  function mp(t) {
    return t ? (t = Pi, t) : Pi;
  }
  function pp(t, e, n, a, r, u) {
    r = mp(r), a.context === null ? a.context = r : a.pendingContext = r, a = Hn(e), a.payload = { element: n }, u = u === void 0 ? null : u, u !== null && (a.callback = u), n = Gn(t, a, e), n !== null && (Te(n, t, e), $a(n, t, e));
  }
  function yp(t, e) {
    if (t = t.memoizedState, t !== null && t.dehydrated !== null) {
      var n = t.retryLane;
      t.retryLane = n !== 0 && n < e ? n : e;
    }
  }
  function ku(t, e) {
    yp(t, e), (t = t.alternate) && yp(t, e);
  }
  function gp(t) {
    if (t.tag === 13 || t.tag === 31) {
      var e = pi(t, 67108864);
      e !== null && Te(e, t, 67108864), ku(t, 67108864);
    }
  }
  function vp(t) {
    if (t.tag === 13 || t.tag === 31) {
      var e = Ve();
      e = Ho(e);
      var n = pi(t, e);
      n !== null && Te(n, t, e), ku(t, e);
    }
  }
  var $s = !0;
  function _1(t, e, n, a) {
    var r = R.T;
    R.T = null;
    var u = X.p;
    try {
      X.p = 2, Qu(t, e, n, a);
    } finally {
      X.p = u, R.T = r;
    }
  }
  function B1(t, e, n, a) {
    var r = R.T;
    R.T = null;
    var u = X.p;
    try {
      X.p = 8, Qu(t, e, n, a);
    } finally {
      X.p = u, R.T = r;
    }
  }
  function Qu(t, e, n, a) {
    if ($s) {
      var r = Zu(a);
      if (r === null)
        wu(
          t,
          e,
          a,
          Is,
          n
        ), Sp(t, a);
      else if (N1(
        r,
        t,
        e,
        n,
        a
      ))
        a.stopPropagation();
      else if (Sp(t, a), e & 4 && -1 < U1.indexOf(t)) {
        for (; r !== null; ) {
          var u = Hi(r);
          if (u !== null)
            switch (u.tag) {
              case 3:
                if (u = u.stateNode, u.current.memoizedState.isDehydrated) {
                  var h = ci(u.pendingLanes);
                  if (h !== 0) {
                    var g = u;
                    for (g.pendingLanes |= 2, g.entangledLanes |= 2; h; ) {
                      var S = 1 << 31 - Me(h);
                      g.entanglements[1] |= S, h &= ~S;
                    }
                    an(u), (Dt & 6) === 0 && (Us = xe() + 500, ml(0));
                  }
                }
                break;
              case 31:
              case 13:
                g = pi(u, 2), g !== null && Te(g, u, 2), Ls(), ku(u, 2);
            }
          if (u = Zu(a), u === null && wu(
            t,
            e,
            a,
            Is,
            n
          ), u === r) break;
          r = u;
        }
        r !== null && a.stopPropagation();
      } else
        wu(
          t,
          e,
          a,
          null,
          n
        );
    }
  }
  function Zu(t) {
    return t = Jo(t), Ku(t);
  }
  var Is = null;
  function Ku(t) {
    if (Is = null, t = ji(t), t !== null) {
      var e = d(t);
      if (e === null) t = null;
      else {
        var n = e.tag;
        if (n === 13) {
          if (t = f(e), t !== null) return t;
          t = null;
        } else if (n === 31) {
          if (t = m(e), t !== null) return t;
          t = null;
        } else if (n === 3) {
          if (e.stateNode.current.memoizedState.isDehydrated)
            return e.tag === 3 ? e.stateNode.containerInfo : null;
          t = null;
        } else e !== t && (t = null);
      }
    }
    return Is = t, null;
  }
  function bp(t) {
    switch (t) {
      case "beforetoggle":
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
      case "toggle":
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
        return 2;
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
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 8;
      case "message":
        switch (S0()) {
          case zf:
            return 2;
          case Cf:
            return 8;
          case ql:
          case T0:
            return 32;
          case Rf:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var Ju = !1, Wn = null, $n = null, In = null, Tl = /* @__PURE__ */ new Map(), Al = /* @__PURE__ */ new Map(), ti = [], U1 = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function Sp(t, e) {
    switch (t) {
      case "focusin":
      case "focusout":
        Wn = null;
        break;
      case "dragenter":
      case "dragleave":
        $n = null;
        break;
      case "mouseover":
      case "mouseout":
        In = null;
        break;
      case "pointerover":
      case "pointerout":
        Tl.delete(e.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Al.delete(e.pointerId);
    }
  }
  function xl(t, e, n, a, r, u) {
    return t === null || t.nativeEvent !== u ? (t = {
      blockedOn: e,
      domEventName: n,
      eventSystemFlags: a,
      nativeEvent: u,
      targetContainers: [r]
    }, e !== null && (e = Hi(e), e !== null && gp(e)), t) : (t.eventSystemFlags |= a, e = t.targetContainers, r !== null && e.indexOf(r) === -1 && e.push(r), t);
  }
  function N1(t, e, n, a, r) {
    switch (e) {
      case "focusin":
        return Wn = xl(
          Wn,
          t,
          e,
          n,
          a,
          r
        ), !0;
      case "dragenter":
        return $n = xl(
          $n,
          t,
          e,
          n,
          a,
          r
        ), !0;
      case "mouseover":
        return In = xl(
          In,
          t,
          e,
          n,
          a,
          r
        ), !0;
      case "pointerover":
        var u = r.pointerId;
        return Tl.set(
          u,
          xl(
            Tl.get(u) || null,
            t,
            e,
            n,
            a,
            r
          )
        ), !0;
      case "gotpointercapture":
        return u = r.pointerId, Al.set(
          u,
          xl(
            Al.get(u) || null,
            t,
            e,
            n,
            a,
            r
          )
        ), !0;
    }
    return !1;
  }
  function Tp(t) {
    var e = ji(t.target);
    if (e !== null) {
      var n = d(e);
      if (n !== null) {
        if (e = n.tag, e === 13) {
          if (e = f(n), e !== null) {
            t.blockedOn = e, Uf(t.priority, function() {
              vp(n);
            });
            return;
          }
        } else if (e === 31) {
          if (e = m(n), e !== null) {
            t.blockedOn = e, Uf(t.priority, function() {
              vp(n);
            });
            return;
          }
        } else if (e === 3 && n.stateNode.current.memoizedState.isDehydrated) {
          t.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
          return;
        }
      }
    }
    t.blockedOn = null;
  }
  function to(t) {
    if (t.blockedOn !== null) return !1;
    for (var e = t.targetContainers; 0 < e.length; ) {
      var n = Zu(t.nativeEvent);
      if (n === null) {
        n = t.nativeEvent;
        var a = new n.constructor(
          n.type,
          n
        );
        Ko = a, n.target.dispatchEvent(a), Ko = null;
      } else
        return e = Hi(n), e !== null && gp(e), t.blockedOn = n, !1;
      e.shift();
    }
    return !0;
  }
  function Ap(t, e, n) {
    to(t) && n.delete(e);
  }
  function L1() {
    Ju = !1, Wn !== null && to(Wn) && (Wn = null), $n !== null && to($n) && ($n = null), In !== null && to(In) && (In = null), Tl.forEach(Ap), Al.forEach(Ap);
  }
  function eo(t, e) {
    t.blockedOn === e && (t.blockedOn = null, Ju || (Ju = !0, i.unstable_scheduleCallback(
      i.unstable_NormalPriority,
      L1
    )));
  }
  var no = null;
  function xp(t) {
    no !== t && (no = t, i.unstable_scheduleCallback(
      i.unstable_NormalPriority,
      function() {
        no === t && (no = null);
        for (var e = 0; e < t.length; e += 3) {
          var n = t[e], a = t[e + 1], r = t[e + 2];
          if (typeof a != "function") {
            if (Ku(a || n) === null)
              continue;
            break;
          }
          var u = Hi(n);
          u !== null && (t.splice(e, 3), e -= 3, Zr(
            u,
            {
              pending: !0,
              data: r,
              method: n.method,
              action: a
            },
            a,
            r
          ));
        }
      }
    ));
  }
  function Sa(t) {
    function e(S) {
      return eo(S, t);
    }
    Wn !== null && eo(Wn, t), $n !== null && eo($n, t), In !== null && eo(In, t), Tl.forEach(e), Al.forEach(e);
    for (var n = 0; n < ti.length; n++) {
      var a = ti[n];
      a.blockedOn === t && (a.blockedOn = null);
    }
    for (; 0 < ti.length && (n = ti[0], n.blockedOn === null); )
      Tp(n), n.blockedOn === null && ti.shift();
    if (n = (t.ownerDocument || t).$$reactFormReplay, n != null)
      for (a = 0; a < n.length; a += 3) {
        var r = n[a], u = n[a + 1], h = r[pe] || null;
        if (typeof u == "function")
          h || xp(n);
        else if (h) {
          var g = null;
          if (u && u.hasAttribute("formAction")) {
            if (r = u, h = u[pe] || null)
              g = h.formAction;
            else if (Ku(r) !== null) continue;
          } else g = h.action;
          typeof g == "function" ? n[a + 1] = g : (n.splice(a, 3), a -= 3), xp(n);
        }
      }
  }
  function Ep() {
    function t(u) {
      u.canIntercept && u.info === "react-transition" && u.intercept({
        handler: function() {
          return new Promise(function(h) {
            return r = h;
          });
        },
        focusReset: "manual",
        scroll: "manual"
      });
    }
    function e() {
      r !== null && (r(), r = null), a || setTimeout(n, 20);
    }
    function n() {
      if (!a && !navigation.transition) {
        var u = navigation.currentEntry;
        u && u.url != null && navigation.navigate(u.url, {
          state: u.getState(),
          info: "react-transition",
          history: "replace"
        });
      }
    }
    if (typeof navigation == "object") {
      var a = !1, r = null;
      return navigation.addEventListener("navigate", t), navigation.addEventListener("navigatesuccess", e), navigation.addEventListener("navigateerror", e), setTimeout(n, 100), function() {
        a = !0, navigation.removeEventListener("navigate", t), navigation.removeEventListener("navigatesuccess", e), navigation.removeEventListener("navigateerror", e), r !== null && (r(), r = null);
      };
    }
  }
  function Fu(t) {
    this._internalRoot = t;
  }
  io.prototype.render = Fu.prototype.render = function(t) {
    var e = this._internalRoot;
    if (e === null) throw Error(o(409));
    var n = e.current, a = Ve();
    pp(n, a, t, e, null, null);
  }, io.prototype.unmount = Fu.prototype.unmount = function() {
    var t = this._internalRoot;
    if (t !== null) {
      this._internalRoot = null;
      var e = t.containerInfo;
      pp(t.current, 2, null, t, null, null), Ls(), e[Li] = null;
    }
  };
  function io(t) {
    this._internalRoot = t;
  }
  io.prototype.unstable_scheduleHydration = function(t) {
    if (t) {
      var e = Bf();
      t = { blockedOn: null, target: t, priority: e };
      for (var n = 0; n < ti.length && e !== 0 && e < ti[n].priority; n++) ;
      ti.splice(n, 0, t), n === 0 && Tp(t);
    }
  };
  var Mp = l.version;
  if (Mp !== "19.2.8")
    throw Error(
      o(
        527,
        Mp,
        "19.2.8"
      )
    );
  X.findDOMNode = function(t) {
    var e = t._reactInternals;
    if (e === void 0)
      throw typeof t.render == "function" ? Error(o(188)) : (t = Object.keys(t).join(","), Error(o(268, t)));
    return t = p(e), t = t !== null ? v(t) : null, t = t === null ? null : t.stateNode, t;
  };
  var j1 = {
    bundleType: 0,
    version: "19.2.8",
    rendererPackageName: "react-dom",
    currentDispatcherRef: R,
    reconcilerVersion: "19.2.8"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var ao = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!ao.isDisabled && ao.supportsFiber)
      try {
        Va = ao.inject(
          j1
        ), Ee = ao;
      } catch {
      }
  }
  return Ml.createRoot = function(t, e) {
    if (!c(t)) throw Error(o(299));
    var n = !1, a = "", r = Vd, u = _d, h = Bd;
    return e != null && (e.unstable_strictMode === !0 && (n = !0), e.identifierPrefix !== void 0 && (a = e.identifierPrefix), e.onUncaughtError !== void 0 && (r = e.onUncaughtError), e.onCaughtError !== void 0 && (u = e.onCaughtError), e.onRecoverableError !== void 0 && (h = e.onRecoverableError)), e = dp(
      t,
      1,
      !1,
      null,
      null,
      n,
      a,
      null,
      r,
      u,
      h,
      Ep
    ), t[Li] = e.current, Ou(t), new Fu(e);
  }, Ml.hydrateRoot = function(t, e, n) {
    if (!c(t)) throw Error(o(299));
    var a = !1, r = "", u = Vd, h = _d, g = Bd, S = null;
    return n != null && (n.unstable_strictMode === !0 && (a = !0), n.identifierPrefix !== void 0 && (r = n.identifierPrefix), n.onUncaughtError !== void 0 && (u = n.onUncaughtError), n.onCaughtError !== void 0 && (h = n.onCaughtError), n.onRecoverableError !== void 0 && (g = n.onRecoverableError), n.formState !== void 0 && (S = n.formState)), e = dp(
      t,
      1,
      !0,
      e,
      n ?? null,
      a,
      r,
      S,
      u,
      h,
      g,
      Ep
    ), e.context = mp(null), n = e.current, a = Ve(), a = Ho(a), r = Hn(a), r.callback = null, Gn(n, r, a), n = a, e.current.lanes = n, Ba(e, n), an(e), t[Li] = e.current, Ou(t), new io(e);
  }, Ml.version = "19.2.8", Ml;
}
var Up;
function J1() {
  if (Up) return $u.exports;
  Up = 1;
  function i() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(i);
      } catch (l) {
        console.error(l);
      }
  }
  return i(), $u.exports = K1(), $u.exports;
}
var F1 = J1();
function cg(i) {
  var l, s, o = "";
  if (typeof i == "string" || typeof i == "number") o += i;
  else if (typeof i == "object") if (Array.isArray(i)) {
    var c = i.length;
    for (l = 0; l < c; l++) i[l] && (s = cg(i[l])) && (o && (o += " "), o += s);
  } else for (s in i) i[s] && (o && (o += " "), o += s);
  return o;
}
function P1() {
  for (var i, l, s = 0, o = "", c = arguments.length; s < c; s++) (i = arguments[s]) && (l = cg(i)) && (o && (o += " "), o += l);
  return o;
}
const W1 = (i, l) => {
  const s = new Array(i.length + l.length);
  for (let o = 0; o < i.length; o++)
    s[o] = i[o];
  for (let o = 0; o < l.length; o++)
    s[i.length + o] = l[o];
  return s;
}, $1 = (i, l) => ({
  classGroupId: i,
  validator: l
}), fg = (i = /* @__PURE__ */ new Map(), l = null, s) => ({
  nextPart: i,
  validators: l,
  classGroupId: s
}), So = "-", Np = [], I1 = "arbitrary..", tS = (i) => {
  const l = nS(i), {
    conflictingClassGroups: s,
    conflictingClassGroupModifiers: o
  } = i;
  return {
    getClassGroupId: (f) => {
      if (f.startsWith("[") && f.endsWith("]"))
        return eS(f);
      const m = f.split(So), y = m[0] === "" && m.length > 1 ? 1 : 0;
      return hg(m, y, l);
    },
    getConflictingClassGroupIds: (f, m) => {
      if (m) {
        const y = o[f], p = s[f];
        return y ? p ? W1(p, y) : y : p || Np;
      }
      return s[f] || Np;
    }
  };
}, hg = (i, l, s) => {
  if (i.length - l === 0)
    return s.classGroupId;
  const c = i[l], d = s.nextPart.get(c);
  if (d) {
    const p = hg(i, l + 1, d);
    if (p) return p;
  }
  const f = s.validators;
  if (f === null)
    return;
  const m = l === 0 ? i.join(So) : i.slice(l).join(So), y = f.length;
  for (let p = 0; p < y; p++) {
    const v = f[p];
    if (v.validator(m))
      return v.classGroupId;
  }
}, eS = (i) => i.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
  const l = i.slice(1, -1), s = l.indexOf(":"), o = l.slice(0, s);
  return o ? I1 + o : void 0;
})(), nS = (i) => {
  const {
    theme: l,
    classGroups: s
  } = i;
  return iS(s, l);
}, iS = (i, l) => {
  const s = fg();
  for (const o in i) {
    const c = i[o];
    Zc(c, s, o, l);
  }
  return s;
}, Zc = (i, l, s, o) => {
  const c = i.length;
  for (let d = 0; d < c; d++) {
    const f = i[d];
    aS(f, l, s, o);
  }
}, aS = (i, l, s, o) => {
  if (typeof i == "string") {
    lS(i, l, s);
    return;
  }
  if (typeof i == "function") {
    sS(i, l, s, o);
    return;
  }
  oS(i, l, s, o);
}, lS = (i, l, s) => {
  const o = i === "" ? l : dg(l, i);
  o.classGroupId = s;
}, sS = (i, l, s, o) => {
  if (rS(i)) {
    Zc(i(o), l, s, o);
    return;
  }
  l.validators === null && (l.validators = []), l.validators.push($1(s, i));
}, oS = (i, l, s, o) => {
  const c = Object.entries(i), d = c.length;
  for (let f = 0; f < d; f++) {
    const [m, y] = c[f];
    Zc(y, dg(l, m), s, o);
  }
}, dg = (i, l) => {
  let s = i;
  const o = l.split(So), c = o.length;
  for (let d = 0; d < c; d++) {
    const f = o[d];
    let m = s.nextPart.get(f);
    m || (m = fg(), s.nextPart.set(f, m)), s = m;
  }
  return s;
}, rS = (i) => "isThemeGetter" in i && i.isThemeGetter === !0, uS = (i) => {
  if (i < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let l = 0, s = /* @__PURE__ */ Object.create(null), o = /* @__PURE__ */ Object.create(null);
  const c = (d, f) => {
    s[d] = f, l++, l > i && (l = 0, o = s, s = /* @__PURE__ */ Object.create(null));
  };
  return {
    get(d) {
      let f = s[d];
      if (f !== void 0)
        return f;
      if ((f = o[d]) !== void 0)
        return c(d, f), f;
    },
    set(d, f) {
      d in s ? s[d] = f : c(d, f);
    }
  };
}, bc = "!", Lp = ":", cS = [], jp = (i, l, s, o, c) => ({
  modifiers: i,
  hasImportantModifier: l,
  baseClassName: s,
  maybePostfixModifierPosition: o,
  isExternal: c
}), fS = (i) => {
  const {
    prefix: l,
    experimentalParseClassName: s
  } = i;
  let o = (c) => {
    const d = [];
    let f = 0, m = 0, y = 0, p;
    const v = c.length;
    for (let V = 0; V < v; V++) {
      const j = c[V];
      if (f === 0 && m === 0) {
        if (j === Lp) {
          d.push(c.slice(y, V)), y = V + 1;
          continue;
        }
        if (j === "/") {
          p = V;
          continue;
        }
      }
      j === "[" ? f++ : j === "]" ? f-- : j === "(" ? m++ : j === ")" && m--;
    }
    const b = d.length === 0 ? c : c.slice(y);
    let T = b, O = !1;
    b.endsWith(bc) ? (T = b.slice(0, -1), O = !0) : (
      /**
       * In Tailwind CSS v3 the important modifier was at the start of the base class name. This is still supported for legacy reasons.
       * @see https://github.com/dcastil/tailwind-merge/issues/513#issuecomment-2614029864
       */
      b.startsWith(bc) && (T = b.slice(1), O = !0)
    );
    const M = p && p > y ? p - y : void 0;
    return jp(d, O, T, M);
  };
  if (l) {
    const c = l + Lp, d = o;
    o = (f) => f.startsWith(c) ? d(f.slice(c.length)) : jp(cS, !1, f, void 0, !0);
  }
  if (s) {
    const c = o;
    o = (d) => s({
      className: d,
      parseClassName: c
    });
  }
  return o;
}, hS = (i) => {
  const l = /* @__PURE__ */ new Map();
  return i.orderSensitiveModifiers.forEach((s, o) => {
    l.set(s, 1e6 + o);
  }), (s) => {
    const o = [];
    let c = [];
    for (let d = 0; d < s.length; d++) {
      const f = s[d], m = f[0] === "[", y = l.has(f);
      m || y ? (c.length > 0 && (c.sort(), o.push(...c), c = []), o.push(f)) : c.push(f);
    }
    return c.length > 0 && (c.sort(), o.push(...c)), o;
  };
}, dS = (i) => ({
  cache: uS(i.cacheSize),
  parseClassName: fS(i),
  sortModifiers: hS(i),
  postfixLookupClassGroupIds: mS(i),
  ...tS(i)
}), mS = (i) => {
  const l = /* @__PURE__ */ Object.create(null), s = i.postfixLookupClassGroups;
  if (s)
    for (let o = 0; o < s.length; o++)
      l[s[o]] = !0;
  return l;
}, pS = /\s+/, yS = (i, l) => {
  const {
    parseClassName: s,
    getClassGroupId: o,
    getConflictingClassGroupIds: c,
    sortModifiers: d,
    postfixLookupClassGroupIds: f
  } = l, m = [], y = i.trim().split(pS);
  let p = "";
  for (let v = y.length - 1; v >= 0; v -= 1) {
    const b = y[v], {
      isExternal: T,
      modifiers: O,
      hasImportantModifier: M,
      baseClassName: V,
      maybePostfixModifierPosition: j
    } = s(b);
    if (T) {
      p = b + (p.length > 0 ? " " + p : p);
      continue;
    }
    let _ = !!j, G;
    if (_) {
      const Q = V.substring(0, j);
      G = o(Q);
      const U = G && f[G] ? o(V) : void 0;
      U && U !== G && (G = U, _ = !1);
    } else
      G = o(V);
    if (!G) {
      if (!_) {
        p = b + (p.length > 0 ? " " + p : p);
        continue;
      }
      if (G = o(V), !G) {
        p = b + (p.length > 0 ? " " + p : p);
        continue;
      }
      _ = !1;
    }
    const Y = O.length === 0 ? "" : O.length === 1 ? O[0] : d(O).join(":"), q = M ? Y + bc : Y, F = q + G;
    if (m.indexOf(F) > -1)
      continue;
    m.push(F);
    const st = c(G, _);
    for (let Q = 0; Q < st.length; ++Q) {
      const U = st[Q];
      m.push(q + U);
    }
    p = b + (p.length > 0 ? " " + p : p);
  }
  return p;
}, gS = (...i) => {
  let l = 0, s, o, c = "";
  for (; l < i.length; )
    (s = i[l++]) && (o = mg(s)) && (c && (c += " "), c += o);
  return c;
}, mg = (i) => {
  if (typeof i == "string")
    return i;
  let l, s = "";
  for (let o = 0; o < i.length; o++)
    i[o] && (l = mg(i[o])) && (s && (s += " "), s += l);
  return s;
}, vS = (i, ...l) => {
  let s, o, c, d;
  const f = (y) => {
    const p = l.reduce((v, b) => b(v), i());
    return s = dS(p), o = s.cache.get, c = s.cache.set, d = m, m(y);
  }, m = (y) => {
    const p = o(y);
    if (p)
      return p;
    const v = yS(y, s);
    return c(y, v), v;
  };
  return d = f, (...y) => d(gS(...y));
}, bS = [], It = (i) => {
  const l = (s) => s[i] || bS;
  return l.isThemeGetter = !0, l;
}, pg = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, yg = /^\((?:(\w[\w-]*):)?(.+)\)$/i, SS = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/, TS = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, AS = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, xS = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, ES = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, MS = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, ni = (i) => SS.test(i), yt = (i) => !!i && !Number.isNaN(Number(i)), ln = (i) => !!i && Number.isInteger(Number(i)), nc = (i) => i.endsWith("%") && yt(i.slice(0, -1)), Rn = (i) => TS.test(i), gg = () => !0, DS = (i) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  AS.test(i) && !xS.test(i)
), Kc = () => !1, zS = (i) => ES.test(i), CS = (i) => MS.test(i), RS = (i) => !P(i) && !W(i), OS = (i) => i.startsWith("@container") && (i[10] === "/" && i[11] !== void 0 || i[11] === "s" && i[16] !== void 0 && i.startsWith("-size/", 10) || i[11] === "n" && i[18] !== void 0 && i.startsWith("-normal/", 10)), wS = (i) => oi(i, Sg, Kc), P = (i) => pg.test(i), Ci = (i) => oi(i, Tg, DS), Hp = (i) => oi(i, HS, yt), VS = (i) => oi(i, xg, gg), _S = (i) => oi(i, Ag, Kc), Gp = (i) => oi(i, vg, Kc), BS = (i) => oi(i, bg, CS), lo = (i) => oi(i, Eg, zS), W = (i) => yg.test(i), Dl = (i) => Ui(i, Tg), US = (i) => Ui(i, Ag), Yp = (i) => Ui(i, vg), NS = (i) => Ui(i, Sg), LS = (i) => Ui(i, bg), so = (i) => Ui(i, Eg, !0), jS = (i) => Ui(i, xg, !0), oi = (i, l, s) => {
  const o = pg.exec(i);
  return o ? o[1] ? l(o[1]) : s(o[2]) : !1;
}, Ui = (i, l, s = !1) => {
  const o = yg.exec(i);
  return o ? o[1] ? l(o[1]) : s : !1;
}, vg = (i) => i === "position" || i === "percentage", bg = (i) => i === "image" || i === "url", Sg = (i) => i === "length" || i === "size" || i === "bg-size", Tg = (i) => i === "length", HS = (i) => i === "number", Ag = (i) => i === "family-name", xg = (i) => i === "number" || i === "weight", Eg = (i) => i === "shadow", GS = () => {
  const i = It("color"), l = It("font"), s = It("text"), o = It("font-weight"), c = It("tracking"), d = It("leading"), f = It("breakpoint"), m = It("container"), y = It("spacing"), p = It("radius"), v = It("shadow"), b = It("inset-shadow"), T = It("text-shadow"), O = It("drop-shadow"), M = It("blur"), V = It("perspective"), j = It("aspect"), _ = It("ease"), G = It("animate"), Y = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], q = () => [
    "center",
    "top",
    "bottom",
    "left",
    "right",
    "top-left",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "left-top",
    "top-right",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "right-top",
    "bottom-right",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "right-bottom",
    "bottom-left",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "left-bottom"
  ], F = () => [...q(), W, P], st = () => ["auto", "hidden", "clip", "visible", "scroll"], Q = () => ["auto", "contain", "none"], U = () => [W, P, y], $ = () => [ni, "full", "auto", ...U()], I = () => [ln, "none", "subgrid", W, P], ct = () => ["auto", {
    span: ["full", ln, W, P]
  }, ln, W, P], gt = () => [ln, "auto", W, P], jt = () => ["auto", "min", "max", "fr", W, P], Rt = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline", "center-safe", "end-safe"], Mt = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"], R = () => ["auto", ...U()], X = () => [ni, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...U()], Z = () => [ni, "screen", "full", "dvw", "lvw", "svw", "min", "max", "fit", ...U()], ut = () => [ni, "screen", "full", "lh", "dvh", "lvh", "svh", "min", "max", "fit", ...U()], k = () => [i, W, P], A = () => [...q(), Yp, Gp, {
    position: [W, P]
  }], N = () => ["no-repeat", {
    repeat: ["", "x", "y", "space", "round"]
  }], K = () => ["auto", "cover", "contain", NS, wS, {
    size: [W, P]
  }], J = () => [nc, Dl, Ci], tt = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    "full",
    p,
    W,
    P
  ], lt = () => ["", yt, Dl, Ci], pt = () => ["solid", "dashed", "dotted", "double"], Ht = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], ht = () => [yt, nc, Yp, Gp], Ke = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    M,
    W,
    P
  ], Be = () => ["none", yt, W, P], ie = () => ["none", yt, W, P], cn = () => [yt, W, P], fe = () => [ni, "full", ...U()];
  return {
    cacheSize: 500,
    theme: {
      animate: ["spin", "ping", "pulse", "bounce"],
      aspect: ["video"],
      blur: [Rn],
      breakpoint: [Rn],
      color: [gg],
      container: [Rn],
      "drop-shadow": [Rn],
      ease: ["in", "out", "in-out"],
      font: [RS],
      "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"],
      "inset-shadow": [Rn],
      leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
      perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
      radius: [Rn],
      shadow: [Rn],
      spacing: ["px", yt],
      text: [Rn],
      "text-shadow": [Rn],
      tracking: ["tighter", "tight", "normal", "wide", "wider", "widest"]
    },
    classGroups: {
      // --------------
      // --- Layout ---
      // --------------
      /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */
      aspect: [{
        aspect: ["auto", "square", ni, P, W, j]
      }],
      /**
       * Container
       * @see https://tailwindcss.com/docs/container
       * @deprecated since Tailwind CSS v4.0.0
       */
      container: ["container"],
      /**
       * Container Type
       * @see https://tailwindcss.com/docs/responsive-design#container-queries
       */
      "container-type": [{
        "@container": ["", "normal", "size", W, P]
      }],
      /**
       * Container Name
       * @see https://tailwindcss.com/docs/responsive-design#named-containers
       */
      "container-named": [OS],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [yt, P, W, m]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": Y()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": Y()
      }],
      /**
       * Break Inside
       * @see https://tailwindcss.com/docs/break-inside
       */
      "break-inside": [{
        "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"]
      }],
      /**
       * Box Decoration Break
       * @see https://tailwindcss.com/docs/box-decoration-break
       */
      "box-decoration": [{
        "box-decoration": ["slice", "clone"]
      }],
      /**
       * Box Sizing
       * @see https://tailwindcss.com/docs/box-sizing
       */
      box: [{
        box: ["border", "content"]
      }],
      /**
       * Display
       * @see https://tailwindcss.com/docs/display
       */
      display: ["block", "inline-block", "inline", "flex", "inline-flex", "table", "inline-table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row-group", "table-row", "flow-root", "grid", "inline-grid", "contents", "list-item", "hidden"],
      /**
       * Screen Reader Only
       * @see https://tailwindcss.com/docs/display#screen-reader-only
       */
      sr: ["sr-only", "not-sr-only"],
      /**
       * Floats
       * @see https://tailwindcss.com/docs/float
       */
      float: [{
        float: ["right", "left", "none", "start", "end"]
      }],
      /**
       * Clear
       * @see https://tailwindcss.com/docs/clear
       */
      clear: [{
        clear: ["left", "right", "both", "none", "start", "end"]
      }],
      /**
       * Isolation
       * @see https://tailwindcss.com/docs/isolation
       */
      isolation: ["isolate", "isolation-auto"],
      /**
       * Object Fit
       * @see https://tailwindcss.com/docs/object-fit
       */
      "object-fit": [{
        object: ["contain", "cover", "fill", "none", "scale-down"]
      }],
      /**
       * Object Position
       * @see https://tailwindcss.com/docs/object-position
       */
      "object-position": [{
        object: F()
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: st()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": st()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": st()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: Q()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": Q()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": Q()
      }],
      /**
       * Position
       * @see https://tailwindcss.com/docs/position
       */
      position: ["static", "fixed", "absolute", "relative", "sticky"],
      /**
       * Inset
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      inset: [{
        inset: $()
      }],
      /**
       * Inset Inline
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": $()
      }],
      /**
       * Inset Block
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": $()
      }],
      /**
       * Inset Inline Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       * @todo class group will be renamed to `inset-s` in next major release
       */
      start: [{
        "inset-s": $(),
        /**
         * @deprecated since Tailwind CSS v4.2.0 in favor of `inset-s-*` utilities.
         * @see https://github.com/tailwindlabs/tailwindcss/pull/19613
         */
        start: $()
      }],
      /**
       * Inset Inline End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       * @todo class group will be renamed to `inset-e` in next major release
       */
      end: [{
        "inset-e": $(),
        /**
         * @deprecated since Tailwind CSS v4.2.0 in favor of `inset-e-*` utilities.
         * @see https://github.com/tailwindlabs/tailwindcss/pull/19613
         */
        end: $()
      }],
      /**
       * Inset Block Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-bs": [{
        "inset-bs": $()
      }],
      /**
       * Inset Block End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-be": [{
        "inset-be": $()
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: $()
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: $()
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: $()
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: $()
      }],
      /**
       * Visibility
       * @see https://tailwindcss.com/docs/visibility
       */
      visibility: ["visible", "invisible", "collapse"],
      /**
       * Z-Index
       * @see https://tailwindcss.com/docs/z-index
       */
      z: [{
        z: [ln, "auto", W, P]
      }],
      // ------------------------
      // --- Flexbox and Grid ---
      // ------------------------
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: [ni, "full", "auto", m, ...U()]
      }],
      /**
       * Flex Direction
       * @see https://tailwindcss.com/docs/flex-direction
       */
      "flex-direction": [{
        flex: ["row", "row-reverse", "col", "col-reverse"]
      }],
      /**
       * Flex Wrap
       * @see https://tailwindcss.com/docs/flex-wrap
       */
      "flex-wrap": [{
        flex: ["nowrap", "wrap", "wrap-reverse"]
      }],
      /**
       * Flex
       * @see https://tailwindcss.com/docs/flex
       */
      flex: [{
        flex: [yt, ni, "auto", "initial", "none", P]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: ["", yt, W, P]
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: ["", yt, W, P]
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: [ln, "first", "last", "none", W, P]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": I()
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: ct()
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": gt()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": gt()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": I()
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: ct()
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": gt()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": gt()
      }],
      /**
       * Grid Auto Flow
       * @see https://tailwindcss.com/docs/grid-auto-flow
       */
      "grid-flow": [{
        "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"]
      }],
      /**
       * Grid Auto Columns
       * @see https://tailwindcss.com/docs/grid-auto-columns
       */
      "auto-cols": [{
        "auto-cols": jt()
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": jt()
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: U()
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": U()
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": U()
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: [...Rt(), "normal"]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": [...Mt(), "normal"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", ...Mt()]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...Rt()]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: [...Mt(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", ...Mt(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": Rt()
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": [...Mt(), "baseline"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", ...Mt()]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: U()
      }],
      /**
       * Padding Inline
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: U()
      }],
      /**
       * Padding Block
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: U()
      }],
      /**
       * Padding Inline Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: U()
      }],
      /**
       * Padding Inline End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: U()
      }],
      /**
       * Padding Block Start
       * @see https://tailwindcss.com/docs/padding
       */
      pbs: [{
        pbs: U()
      }],
      /**
       * Padding Block End
       * @see https://tailwindcss.com/docs/padding
       */
      pbe: [{
        pbe: U()
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: U()
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: U()
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: U()
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: U()
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: R()
      }],
      /**
       * Margin Inline
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: R()
      }],
      /**
       * Margin Block
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: R()
      }],
      /**
       * Margin Inline Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: R()
      }],
      /**
       * Margin Inline End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: R()
      }],
      /**
       * Margin Block Start
       * @see https://tailwindcss.com/docs/margin
       */
      mbs: [{
        mbs: R()
      }],
      /**
       * Margin Block End
       * @see https://tailwindcss.com/docs/margin
       */
      mbe: [{
        mbe: R()
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: R()
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: R()
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: R()
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: R()
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x": [{
        "space-x": U()
      }],
      /**
       * Space Between X Reverse
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x-reverse": ["space-x-reverse"],
      /**
       * Space Between Y
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-y": [{
        "space-y": U()
      }],
      /**
       * Space Between Y Reverse
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-y-reverse": ["space-y-reverse"],
      // --------------
      // --- Sizing ---
      // --------------
      /**
       * Size
       * @see https://tailwindcss.com/docs/width#setting-both-width-and-height
       */
      size: [{
        size: X()
      }],
      /**
       * Inline Size
       * @see https://tailwindcss.com/docs/width
       */
      "inline-size": [{
        inline: ["auto", ...Z()]
      }],
      /**
       * Min-Inline Size
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-inline-size": [{
        "min-inline": ["auto", ...Z()]
      }],
      /**
       * Max-Inline Size
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-inline-size": [{
        "max-inline": ["none", ...Z()]
      }],
      /**
       * Block Size
       * @see https://tailwindcss.com/docs/height
       */
      "block-size": [{
        block: ["auto", ...ut()]
      }],
      /**
       * Min-Block Size
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-block-size": [{
        "min-block": ["auto", ...ut()]
      }],
      /**
       * Max-Block Size
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-block-size": [{
        "max-block": ["none", ...ut()]
      }],
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: [m, "screen", ...X()]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [
          m,
          "screen",
          /** Deprecated. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "none",
          ...X()
        ]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [
          m,
          "screen",
          "none",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "prose",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          {
            screen: [f]
          },
          ...X()
        ]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: ["screen", "lh", ...X()]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": ["screen", "lh", "none", ...X()]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": ["screen", "lh", ...X()]
      }],
      // ------------------
      // --- Typography ---
      // ------------------
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", s, Dl, Ci]
      }],
      /**
       * Font Smoothing
       * @see https://tailwindcss.com/docs/font-smoothing
       */
      "font-smoothing": ["antialiased", "subpixel-antialiased"],
      /**
       * Font Style
       * @see https://tailwindcss.com/docs/font-style
       */
      "font-style": ["italic", "not-italic"],
      /**
       * Font Weight
       * @see https://tailwindcss.com/docs/font-weight
       */
      "font-weight": [{
        font: [o, jS, VS]
      }],
      /**
       * Font Stretch
       * @see https://tailwindcss.com/docs/font-stretch
       */
      "font-stretch": [{
        "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", nc, P]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [US, _S, l]
      }],
      /**
       * Font Feature Settings
       * @see https://tailwindcss.com/docs/font-feature-settings
       */
      "font-features": [{
        "font-features": [P]
      }],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-normal": ["normal-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-ordinal": ["ordinal"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-slashed-zero": ["slashed-zero"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-figure": ["lining-nums", "oldstyle-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-spacing": ["proportional-nums", "tabular-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
      /**
       * Letter Spacing
       * @see https://tailwindcss.com/docs/letter-spacing
       */
      tracking: [{
        tracking: [c, W, P]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": [yt, "none", W, Hp]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: [
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          d,
          ...U()
        ]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", W, P]
      }],
      /**
       * List Style Position
       * @see https://tailwindcss.com/docs/list-style-position
       */
      "list-style-position": [{
        list: ["inside", "outside"]
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      "list-style-type": [{
        list: ["disc", "decimal", "none", W, P]
      }],
      /**
       * Text Alignment
       * @see https://tailwindcss.com/docs/text-align
       */
      "text-alignment": [{
        text: ["left", "center", "right", "justify", "start", "end"]
      }],
      /**
       * Placeholder Color
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://v3.tailwindcss.com/docs/placeholder-color
       */
      "placeholder-color": [{
        placeholder: k()
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: k()
      }],
      /**
       * Text Decoration
       * @see https://tailwindcss.com/docs/text-decoration
       */
      "text-decoration": ["underline", "overline", "line-through", "no-underline"],
      /**
       * Text Decoration Style
       * @see https://tailwindcss.com/docs/text-decoration-style
       */
      "text-decoration-style": [{
        decoration: [...pt(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: [yt, "from-font", "auto", W, Ci]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: k()
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": [yt, "auto", W, P]
      }],
      /**
       * Text Transform
       * @see https://tailwindcss.com/docs/text-transform
       */
      "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
      /**
       * Text Overflow
       * @see https://tailwindcss.com/docs/text-overflow
       */
      "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
      /**
       * Text Wrap
       * @see https://tailwindcss.com/docs/text-wrap
       */
      "text-wrap": [{
        text: ["wrap", "nowrap", "balance", "pretty"]
      }],
      /**
       * Text Indent
       * @see https://tailwindcss.com/docs/text-indent
       */
      indent: [{
        indent: U()
      }],
      /**
       * Tab Size
       * @see https://tailwindcss.com/docs/tab-size
       */
      "tab-size": [{
        tab: [ln, W, P]
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", W, P]
      }],
      /**
       * Whitespace
       * @see https://tailwindcss.com/docs/whitespace
       */
      whitespace: [{
        whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"]
      }],
      /**
       * Word Break
       * @see https://tailwindcss.com/docs/word-break
       */
      break: [{
        break: ["normal", "words", "all", "keep"]
      }],
      /**
       * Overflow Wrap
       * @see https://tailwindcss.com/docs/overflow-wrap
       */
      wrap: [{
        wrap: ["break-word", "anywhere", "normal"]
      }],
      /**
       * Hyphens
       * @see https://tailwindcss.com/docs/hyphens
       */
      hyphens: [{
        hyphens: ["none", "manual", "auto"]
      }],
      /**
       * Content
       * @see https://tailwindcss.com/docs/content
       */
      content: [{
        content: ["none", W, P]
      }],
      // -------------------
      // --- Backgrounds ---
      // -------------------
      /**
       * Background Attachment
       * @see https://tailwindcss.com/docs/background-attachment
       */
      "bg-attachment": [{
        bg: ["fixed", "local", "scroll"]
      }],
      /**
       * Background Clip
       * @see https://tailwindcss.com/docs/background-clip
       */
      "bg-clip": [{
        "bg-clip": ["border", "padding", "content", "text"]
      }],
      /**
       * Background Origin
       * @see https://tailwindcss.com/docs/background-origin
       */
      "bg-origin": [{
        "bg-origin": ["border", "padding", "content"]
      }],
      /**
       * Background Position
       * @see https://tailwindcss.com/docs/background-position
       */
      "bg-position": [{
        bg: A()
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: N()
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      "bg-size": [{
        bg: K()
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          linear: [{
            to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
          }, ln, W, P],
          radial: ["", W, P],
          conic: [ln, W, P]
        }, LS, BS]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: k()
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: J()
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: J()
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: J()
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: k()
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: k()
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: k()
      }],
      // ---------------
      // --- Borders ---
      // ---------------
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: tt()
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": tt()
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": tt()
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": tt()
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": tt()
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": tt()
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": tt()
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": tt()
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": tt()
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": tt()
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": tt()
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": tt()
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": tt()
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": tt()
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": tt()
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: lt()
      }],
      /**
       * Border Width Inline
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": lt()
      }],
      /**
       * Border Width Block
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": lt()
      }],
      /**
       * Border Width Inline Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": lt()
      }],
      /**
       * Border Width Inline End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": lt()
      }],
      /**
       * Border Width Block Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-bs": [{
        "border-bs": lt()
      }],
      /**
       * Border Width Block End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-be": [{
        "border-be": lt()
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": lt()
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": lt()
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": lt()
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": lt()
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x": [{
        "divide-x": lt()
      }],
      /**
       * Divide Width X Reverse
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x-reverse": ["divide-x-reverse"],
      /**
       * Divide Width Y
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-y": [{
        "divide-y": lt()
      }],
      /**
       * Divide Width Y Reverse
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-y-reverse": ["divide-y-reverse"],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [...pt(), "hidden", "none"]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
       */
      "divide-style": [{
        divide: [...pt(), "hidden", "none"]
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: k()
      }],
      /**
       * Border Color Inline
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": k()
      }],
      /**
       * Border Color Block
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": k()
      }],
      /**
       * Border Color Inline Start
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": k()
      }],
      /**
       * Border Color Inline End
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": k()
      }],
      /**
       * Border Color Block Start
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-bs": [{
        "border-bs": k()
      }],
      /**
       * Border Color Block End
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-be": [{
        "border-be": k()
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": k()
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": k()
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": k()
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": k()
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: k()
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: [...pt(), "none", "hidden"]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [yt, W, P]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: ["", yt, Dl, Ci]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: k()
      }],
      // ---------------
      // --- Effects ---
      // ---------------
      /**
       * Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow
       */
      shadow: [{
        shadow: [
          // Deprecated since Tailwind CSS v4.0.0
          "",
          "none",
          v,
          so,
          lo
        ]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-shadow-color
       */
      "shadow-color": [{
        shadow: k()
      }],
      /**
       * Inset Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-shadow
       */
      "inset-shadow": [{
        "inset-shadow": ["none", b, so, lo]
      }],
      /**
       * Inset Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color
       */
      "inset-shadow-color": [{
        "inset-shadow": k()
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-a-ring
       */
      "ring-w": [{
        ring: lt()
      }],
      /**
       * Ring Width Inset
       * @see https://v3.tailwindcss.com/docs/ring-width#inset-rings
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-w-inset": ["ring-inset"],
      /**
       * Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-ring-color
       */
      "ring-color": [{
        ring: k()
      }],
      /**
       * Ring Offset Width
       * @see https://v3.tailwindcss.com/docs/ring-offset-width
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-w": [{
        "ring-offset": [yt, Ci]
      }],
      /**
       * Ring Offset Color
       * @see https://v3.tailwindcss.com/docs/ring-offset-color
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-color": [{
        "ring-offset": k()
      }],
      /**
       * Inset Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-ring
       */
      "inset-ring-w": [{
        "inset-ring": lt()
      }],
      /**
       * Inset Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-ring-color
       */
      "inset-ring-color": [{
        "inset-ring": k()
      }],
      /**
       * Text Shadow
       * @see https://tailwindcss.com/docs/text-shadow
       */
      "text-shadow": [{
        "text-shadow": ["none", T, so, lo]
      }],
      /**
       * Text Shadow Color
       * @see https://tailwindcss.com/docs/text-shadow#setting-the-shadow-color
       */
      "text-shadow-color": [{
        "text-shadow": k()
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [yt, W, P]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...Ht(), "plus-darker", "plus-lighter"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": Ht()
      }],
      /**
       * Mask Clip
       * @see https://tailwindcss.com/docs/mask-clip
       */
      "mask-clip": [{
        "mask-clip": ["border", "padding", "content", "fill", "stroke", "view"]
      }, "mask-no-clip"],
      /**
       * Mask Composite
       * @see https://tailwindcss.com/docs/mask-composite
       */
      "mask-composite": [{
        mask: ["add", "subtract", "intersect", "exclude"]
      }],
      /**
       * Mask Image
       * @see https://tailwindcss.com/docs/mask-image
       */
      "mask-image-linear-pos": [{
        "mask-linear": [yt]
      }],
      "mask-image-linear-from-pos": [{
        "mask-linear-from": ht()
      }],
      "mask-image-linear-to-pos": [{
        "mask-linear-to": ht()
      }],
      "mask-image-linear-from-color": [{
        "mask-linear-from": k()
      }],
      "mask-image-linear-to-color": [{
        "mask-linear-to": k()
      }],
      "mask-image-t-from-pos": [{
        "mask-t-from": ht()
      }],
      "mask-image-t-to-pos": [{
        "mask-t-to": ht()
      }],
      "mask-image-t-from-color": [{
        "mask-t-from": k()
      }],
      "mask-image-t-to-color": [{
        "mask-t-to": k()
      }],
      "mask-image-r-from-pos": [{
        "mask-r-from": ht()
      }],
      "mask-image-r-to-pos": [{
        "mask-r-to": ht()
      }],
      "mask-image-r-from-color": [{
        "mask-r-from": k()
      }],
      "mask-image-r-to-color": [{
        "mask-r-to": k()
      }],
      "mask-image-b-from-pos": [{
        "mask-b-from": ht()
      }],
      "mask-image-b-to-pos": [{
        "mask-b-to": ht()
      }],
      "mask-image-b-from-color": [{
        "mask-b-from": k()
      }],
      "mask-image-b-to-color": [{
        "mask-b-to": k()
      }],
      "mask-image-l-from-pos": [{
        "mask-l-from": ht()
      }],
      "mask-image-l-to-pos": [{
        "mask-l-to": ht()
      }],
      "mask-image-l-from-color": [{
        "mask-l-from": k()
      }],
      "mask-image-l-to-color": [{
        "mask-l-to": k()
      }],
      "mask-image-x-from-pos": [{
        "mask-x-from": ht()
      }],
      "mask-image-x-to-pos": [{
        "mask-x-to": ht()
      }],
      "mask-image-x-from-color": [{
        "mask-x-from": k()
      }],
      "mask-image-x-to-color": [{
        "mask-x-to": k()
      }],
      "mask-image-y-from-pos": [{
        "mask-y-from": ht()
      }],
      "mask-image-y-to-pos": [{
        "mask-y-to": ht()
      }],
      "mask-image-y-from-color": [{
        "mask-y-from": k()
      }],
      "mask-image-y-to-color": [{
        "mask-y-to": k()
      }],
      "mask-image-radial": [{
        "mask-radial": [W, P]
      }],
      "mask-image-radial-from-pos": [{
        "mask-radial-from": ht()
      }],
      "mask-image-radial-to-pos": [{
        "mask-radial-to": ht()
      }],
      "mask-image-radial-from-color": [{
        "mask-radial-from": k()
      }],
      "mask-image-radial-to-color": [{
        "mask-radial-to": k()
      }],
      "mask-image-radial-shape": [{
        "mask-radial": ["circle", "ellipse"]
      }],
      "mask-image-radial-size": [{
        "mask-radial": [{
          closest: ["side", "corner"],
          farthest: ["side", "corner"]
        }]
      }],
      "mask-image-radial-pos": [{
        "mask-radial-at": q()
      }],
      "mask-image-conic-pos": [{
        "mask-conic": [yt]
      }],
      "mask-image-conic-from-pos": [{
        "mask-conic-from": ht()
      }],
      "mask-image-conic-to-pos": [{
        "mask-conic-to": ht()
      }],
      "mask-image-conic-from-color": [{
        "mask-conic-from": k()
      }],
      "mask-image-conic-to-color": [{
        "mask-conic-to": k()
      }],
      /**
       * Mask Mode
       * @see https://tailwindcss.com/docs/mask-mode
       */
      "mask-mode": [{
        mask: ["alpha", "luminance", "match"]
      }],
      /**
       * Mask Origin
       * @see https://tailwindcss.com/docs/mask-origin
       */
      "mask-origin": [{
        "mask-origin": ["border", "padding", "content", "fill", "stroke", "view"]
      }],
      /**
       * Mask Position
       * @see https://tailwindcss.com/docs/mask-position
       */
      "mask-position": [{
        mask: A()
      }],
      /**
       * Mask Repeat
       * @see https://tailwindcss.com/docs/mask-repeat
       */
      "mask-repeat": [{
        mask: N()
      }],
      /**
       * Mask Size
       * @see https://tailwindcss.com/docs/mask-size
       */
      "mask-size": [{
        mask: K()
      }],
      /**
       * Mask Type
       * @see https://tailwindcss.com/docs/mask-type
       */
      "mask-type": [{
        "mask-type": ["alpha", "luminance"]
      }],
      /**
       * Mask Image
       * @see https://tailwindcss.com/docs/mask-image
       */
      "mask-image": [{
        mask: ["none", W, P]
      }],
      // ---------------
      // --- Filters ---
      // ---------------
      /**
       * Filter
       * @see https://tailwindcss.com/docs/filter
       */
      filter: [{
        filter: [
          // Deprecated since Tailwind CSS v3.0.0
          "",
          "none",
          W,
          P
        ]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: Ke()
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [yt, W, P]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [yt, W, P]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      "drop-shadow": [{
        "drop-shadow": [
          // Deprecated since Tailwind CSS v4.0.0
          "",
          "none",
          O,
          so,
          lo
        ]
      }],
      /**
       * Drop Shadow Color
       * @see https://tailwindcss.com/docs/filter-drop-shadow#setting-the-shadow-color
       */
      "drop-shadow-color": [{
        "drop-shadow": k()
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: ["", yt, W, P]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [yt, W, P]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: ["", yt, W, P]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [yt, W, P]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: ["", yt, W, P]
      }],
      /**
       * Backdrop Filter
       * @see https://tailwindcss.com/docs/backdrop-filter
       */
      "backdrop-filter": [{
        "backdrop-filter": [
          // Deprecated since Tailwind CSS v3.0.0
          "",
          "none",
          W,
          P
        ]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": Ke()
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [yt, W, P]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [yt, W, P]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": ["", yt, W, P]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [yt, W, P]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": ["", yt, W, P]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [yt, W, P]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [yt, W, P]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": ["", yt, W, P]
      }],
      // --------------
      // --- Tables ---
      // --------------
      /**
       * Border Collapse
       * @see https://tailwindcss.com/docs/border-collapse
       */
      "border-collapse": [{
        border: ["collapse", "separate"]
      }],
      /**
       * Border Spacing
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing": [{
        "border-spacing": U()
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": U()
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": U()
      }],
      /**
       * Table Layout
       * @see https://tailwindcss.com/docs/table-layout
       */
      "table-layout": [{
        table: ["auto", "fixed"]
      }],
      /**
       * Caption Side
       * @see https://tailwindcss.com/docs/caption-side
       */
      caption: [{
        caption: ["top", "bottom"]
      }],
      // ---------------------------------
      // --- Transitions and Animation ---
      // ---------------------------------
      /**
       * Transition Property
       * @see https://tailwindcss.com/docs/transition-property
       */
      transition: [{
        transition: ["", "all", "colors", "opacity", "shadow", "transform", "none", W, P]
      }],
      /**
       * Transition Behavior
       * @see https://tailwindcss.com/docs/transition-behavior
       */
      "transition-behavior": [{
        transition: ["normal", "discrete"]
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: [yt, "initial", W, P]
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "initial", _, W, P]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: [yt, W, P]
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", G, W, P]
      }],
      // ------------------
      // --- Transforms ---
      // ------------------
      /**
       * Backface Visibility
       * @see https://tailwindcss.com/docs/backface-visibility
       */
      backface: [{
        backface: ["hidden", "visible"]
      }],
      /**
       * Perspective
       * @see https://tailwindcss.com/docs/perspective
       */
      perspective: [{
        perspective: [V, W, P]
      }],
      /**
       * Perspective Origin
       * @see https://tailwindcss.com/docs/perspective-origin
       */
      "perspective-origin": [{
        "perspective-origin": F()
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: Be()
      }],
      /**
       * Rotate X
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-x": [{
        "rotate-x": Be()
      }],
      /**
       * Rotate Y
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-y": [{
        "rotate-y": Be()
      }],
      /**
       * Rotate Z
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-z": [{
        "rotate-z": Be()
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: ie()
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": ie()
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": ie()
      }],
      /**
       * Scale Z
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-z": [{
        "scale-z": ie()
      }],
      /**
       * Scale 3D
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-3d": ["scale-3d"],
      /**
       * Skew
       * @see https://tailwindcss.com/docs/skew
       */
      skew: [{
        skew: cn()
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": cn()
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": cn()
      }],
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: [W, P, "", "none", "gpu", "cpu"]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: F()
      }],
      /**
       * Transform Style
       * @see https://tailwindcss.com/docs/transform-style
       */
      "transform-style": [{
        transform: ["3d", "flat"]
      }],
      /**
       * Translate
       * @see https://tailwindcss.com/docs/translate
       */
      translate: [{
        translate: fe()
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": fe()
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": fe()
      }],
      /**
       * Translate Z
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-z": [{
        "translate-z": fe()
      }],
      /**
       * Translate None
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-none": ["translate-none"],
      /**
       * Zoom
       * @see https://tailwindcss.com/docs/zoom
       */
      zoom: [{
        zoom: [ln, W, P]
      }],
      // ---------------------
      // --- Interactivity ---
      // ---------------------
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [{
        accent: k()
      }],
      /**
       * Appearance
       * @see https://tailwindcss.com/docs/appearance
       */
      appearance: [{
        appearance: ["none", "auto"]
      }],
      /**
       * Caret Color
       * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
       */
      "caret-color": [{
        caret: k()
      }],
      /**
       * Color Scheme
       * @see https://tailwindcss.com/docs/color-scheme
       */
      "color-scheme": [{
        scheme: ["normal", "dark", "light", "light-dark", "only-dark", "only-light"]
      }],
      /**
       * Cursor
       * @see https://tailwindcss.com/docs/cursor
       */
      cursor: [{
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", W, P]
      }],
      /**
       * Field Sizing
       * @see https://tailwindcss.com/docs/field-sizing
       */
      "field-sizing": [{
        "field-sizing": ["fixed", "content"]
      }],
      /**
       * Pointer Events
       * @see https://tailwindcss.com/docs/pointer-events
       */
      "pointer-events": [{
        "pointer-events": ["auto", "none"]
      }],
      /**
       * Resize
       * @see https://tailwindcss.com/docs/resize
       */
      resize: [{
        resize: ["none", "", "y", "x"]
      }],
      /**
       * Scroll Behavior
       * @see https://tailwindcss.com/docs/scroll-behavior
       */
      "scroll-behavior": [{
        scroll: ["auto", "smooth"]
      }],
      /**
       * Scrollbar Thumb Color
       * @see https://tailwindcss.com/docs/scrollbar-color
       */
      "scrollbar-thumb-color": [{
        "scrollbar-thumb": k()
      }],
      /**
       * Scrollbar Track Color
       * @see https://tailwindcss.com/docs/scrollbar-color
       */
      "scrollbar-track-color": [{
        "scrollbar-track": k()
      }],
      /**
       * Scrollbar Gutter
       * @see https://tailwindcss.com/docs/scrollbar-gutter
       */
      "scrollbar-gutter": [{
        "scrollbar-gutter": ["auto", "stable", "both"]
      }],
      /**
       * Scrollbar Width
       * @see https://tailwindcss.com/docs/scrollbar-width
       */
      "scrollbar-w": [{
        scrollbar: ["auto", "thin", "none"]
      }],
      /**
       * Scroll Margin
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-m": [{
        "scroll-m": U()
      }],
      /**
       * Scroll Margin Inline
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": U()
      }],
      /**
       * Scroll Margin Block
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": U()
      }],
      /**
       * Scroll Margin Inline Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": U()
      }],
      /**
       * Scroll Margin Inline End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": U()
      }],
      /**
       * Scroll Margin Block Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mbs": [{
        "scroll-mbs": U()
      }],
      /**
       * Scroll Margin Block End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mbe": [{
        "scroll-mbe": U()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": U()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": U()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": U()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": U()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": U()
      }],
      /**
       * Scroll Padding Inline
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": U()
      }],
      /**
       * Scroll Padding Block
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": U()
      }],
      /**
       * Scroll Padding Inline Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": U()
      }],
      /**
       * Scroll Padding Inline End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": U()
      }],
      /**
       * Scroll Padding Block Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pbs": [{
        "scroll-pbs": U()
      }],
      /**
       * Scroll Padding Block End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pbe": [{
        "scroll-pbe": U()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": U()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": U()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": U()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": U()
      }],
      /**
       * Scroll Snap Align
       * @see https://tailwindcss.com/docs/scroll-snap-align
       */
      "snap-align": [{
        snap: ["start", "end", "center", "align-none"]
      }],
      /**
       * Scroll Snap Stop
       * @see https://tailwindcss.com/docs/scroll-snap-stop
       */
      "snap-stop": [{
        snap: ["normal", "always"]
      }],
      /**
       * Scroll Snap Type
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-type": [{
        snap: ["none", "x", "y", "both"]
      }],
      /**
       * Scroll Snap Type Strictness
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-strictness": [{
        snap: ["mandatory", "proximity"]
      }],
      /**
       * Touch Action
       * @see https://tailwindcss.com/docs/touch-action
       */
      touch: [{
        touch: ["auto", "none", "manipulation"]
      }],
      /**
       * Touch Action X
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-x": [{
        "touch-pan": ["x", "left", "right"]
      }],
      /**
       * Touch Action Y
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-y": [{
        "touch-pan": ["y", "up", "down"]
      }],
      /**
       * Touch Action Pinch Zoom
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-pz": ["touch-pinch-zoom"],
      /**
       * User Select
       * @see https://tailwindcss.com/docs/user-select
       */
      select: [{
        select: ["none", "text", "all", "auto"]
      }],
      /**
       * Will Change
       * @see https://tailwindcss.com/docs/will-change
       */
      "will-change": [{
        "will-change": ["auto", "scroll", "contents", "transform", W, P]
      }],
      // -----------
      // --- SVG ---
      // -----------
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: ["none", ...k()]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [yt, Dl, Ci, Hp]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: ["none", ...k()]
      }],
      // ---------------------
      // --- Accessibility ---
      // ---------------------
      /**
       * Forced Color Adjust
       * @see https://tailwindcss.com/docs/forced-color-adjust
       */
      "forced-color-adjust": [{
        "forced-color-adjust": ["auto", "none"]
      }]
    },
    conflictingClassGroups: {
      "container-named": ["container-type"],
      overflow: ["overflow-x", "overflow-y"],
      overscroll: ["overscroll-x", "overscroll-y"],
      inset: ["inset-x", "inset-y", "inset-bs", "inset-be", "start", "end", "top", "right", "bottom", "left"],
      "inset-x": ["right", "left"],
      "inset-y": ["top", "bottom"],
      flex: ["basis", "grow", "shrink"],
      gap: ["gap-x", "gap-y"],
      p: ["px", "py", "ps", "pe", "pbs", "pbe", "pt", "pr", "pb", "pl"],
      px: ["pr", "pl"],
      py: ["pt", "pb"],
      m: ["mx", "my", "ms", "me", "mbs", "mbe", "mt", "mr", "mb", "ml"],
      mx: ["mr", "ml"],
      my: ["mt", "mb"],
      size: ["w", "h"],
      "font-size": ["leading"],
      "fvn-normal": ["fvn-ordinal", "fvn-slashed-zero", "fvn-figure", "fvn-spacing", "fvn-fraction"],
      "fvn-ordinal": ["fvn-normal"],
      "fvn-slashed-zero": ["fvn-normal"],
      "fvn-figure": ["fvn-normal"],
      "fvn-spacing": ["fvn-normal"],
      "fvn-fraction": ["fvn-normal"],
      "line-clamp": ["display", "overflow"],
      rounded: ["rounded-s", "rounded-e", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-ss", "rounded-se", "rounded-ee", "rounded-es", "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl"],
      "rounded-s": ["rounded-ss", "rounded-es"],
      "rounded-e": ["rounded-se", "rounded-ee"],
      "rounded-t": ["rounded-tl", "rounded-tr"],
      "rounded-r": ["rounded-tr", "rounded-br"],
      "rounded-b": ["rounded-br", "rounded-bl"],
      "rounded-l": ["rounded-tl", "rounded-bl"],
      "border-spacing": ["border-spacing-x", "border-spacing-y"],
      "border-w": ["border-w-x", "border-w-y", "border-w-s", "border-w-e", "border-w-bs", "border-w-be", "border-w-t", "border-w-r", "border-w-b", "border-w-l"],
      "border-w-x": ["border-w-r", "border-w-l"],
      "border-w-y": ["border-w-t", "border-w-b"],
      "border-color": ["border-color-x", "border-color-y", "border-color-s", "border-color-e", "border-color-bs", "border-color-be", "border-color-t", "border-color-r", "border-color-b", "border-color-l"],
      "border-color-x": ["border-color-r", "border-color-l"],
      "border-color-y": ["border-color-t", "border-color-b"],
      translate: ["translate-x", "translate-y", "translate-none"],
      "translate-none": ["translate", "translate-x", "translate-y", "translate-z"],
      "scroll-m": ["scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mbs", "scroll-mbe", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml"],
      "scroll-mx": ["scroll-mr", "scroll-ml"],
      "scroll-my": ["scroll-mt", "scroll-mb"],
      "scroll-p": ["scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pbs", "scroll-pbe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl"],
      "scroll-px": ["scroll-pr", "scroll-pl"],
      "scroll-py": ["scroll-pt", "scroll-pb"],
      touch: ["touch-x", "touch-y", "touch-pz"],
      "touch-x": ["touch"],
      "touch-y": ["touch"],
      "touch-pz": ["touch"]
    },
    conflictingClassGroupModifiers: {
      "font-size": ["leading"]
    },
    postfixLookupClassGroups: ["container-type"],
    orderSensitiveModifiers: ["*", "**", "after", "backdrop", "before", "details-content", "file", "first-letter", "first-line", "marker", "placeholder", "selection"]
  };
}, YS = /* @__PURE__ */ vS(GS);
function qS(...i) {
  return YS(P1(i));
}
const Mg = it.createContext({});
function Dg(i) {
  const l = it.useRef(null);
  return l.current === null && (l.current = i()), l.current;
}
const XS = typeof window < "u", kS = XS ? it.useLayoutEffect : it.useEffect, Jc = /* @__PURE__ */ it.createContext(null);
function Fc(i, l) {
  i.indexOf(l) === -1 && i.push(l);
}
function Ma(i, l) {
  const s = i.indexOf(l);
  s > -1 && i.splice(s, 1);
}
const un = (i, l, s) => s > l ? l : s < i ? i : s;
let Ro = () => {
};
const ai = {}, zg = (i) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(i), Cg = (i) => typeof i == "object" && i !== null, Rg = (i) => /^0[^.\s]+$/u.test(i);
// @__NO_SIDE_EFFECTS__
function Og(i) {
  let l;
  return () => (l === void 0 && (l = i()), l);
}
const Ze = /* @__NO_SIDE_EFFECTS__ */ (i) => i, jl = (...i) => i.reduce((l, s) => (o) => s(l(o))), Da = /* @__NO_SIDE_EFFECTS__ */ (i, l, s) => {
  const o = l - i;
  return o ? (s - i) / o : 1;
};
class Pc {
  constructor() {
    this.subscriptions = [];
  }
  add(l) {
    return Fc(this.subscriptions, l), () => Ma(this.subscriptions, l);
  }
  notify(l, s, o) {
    const c = this.subscriptions.length;
    if (c)
      if (c === 1)
        this.subscriptions[0](l, s, o);
      else
        for (let d = 0; d < c; d++) {
          const f = this.subscriptions[d];
          f && f(l, s, o);
        }
  }
  getSize() {
    return this.subscriptions.length;
  }
  clear() {
    this.subscriptions.length = 0;
  }
}
const Ae = /* @__NO_SIDE_EFFECTS__ */ (i) => i * 1e3, Qe = /* @__NO_SIDE_EFFECTS__ */ (i) => i / 1e3, wg = /* @__NO_SIDE_EFFECTS__ */ (i, l) => l ? i * (1e3 / l) : 0, QS = (i, l, s) => {
  const o = l - i;
  return ((s - i) % o + o) % o + i;
}, Vg = (i, l, s) => (((1 - 3 * s + 3 * l) * i + (3 * s - 6 * l)) * i + 3 * l) * i, ZS = 1e-7, KS = 12;
function JS(i, l, s, o, c) {
  let d, f, m = 0;
  do
    f = l + (s - l) / 2, d = Vg(f, o, c) - i, d > 0 ? s = f : l = f;
  while (Math.abs(d) > ZS && ++m < KS);
  return f;
}
// @__NO_SIDE_EFFECTS__
function Hl(i, l, s, o) {
  if (i === l && s === o)
    return Ze;
  const c = (d) => JS(d, 0, 1, i, s);
  return (d) => d === 0 || d === 1 ? d : Vg(c(d), l, o);
}
const _g = /* @__NO_SIDE_EFFECTS__ */ (i) => (l) => l <= 0.5 ? i(2 * l) / 2 : (2 - i(2 * (1 - l))) / 2, Wc = /* @__NO_SIDE_EFFECTS__ */ (i) => (l) => 1 - i(1 - l), Bg = /* @__PURE__ */ Hl(0.33, 1.53, 0.69, 0.99), $c = /* @__PURE__ */ Wc(Bg), Ug = /* @__PURE__ */ _g($c), Ng = (i) => i >= 1 ? 1 : (i *= 2) < 1 ? 0.5 * $c(i) : 0.5 * (2 - Math.pow(2, -10 * (i - 1))), Ic = (i) => 1 - Math.sin(Math.acos(i)), Lg = /* @__PURE__ */ Wc(Ic), jg = /* @__PURE__ */ _g(Ic), FS = /* @__PURE__ */ Hl(0.42, 0, 1, 1), PS = /* @__PURE__ */ Hl(0, 0, 0.58, 1), Hg = /* @__PURE__ */ Hl(0.42, 0, 0.58, 1), Gg = /* @__NO_SIDE_EFFECTS__ */ (i) => Array.isArray(i) && typeof i[0] != "number";
// @__NO_SIDE_EFFECTS__
function Yg(i, l) {
  return /* @__PURE__ */ Gg(i) ? i[QS(0, i.length, l)] : i;
}
const qg = /* @__NO_SIDE_EFFECTS__ */ (i) => Array.isArray(i) && typeof i[0] == "number", WS = {
  linear: Ze,
  easeIn: FS,
  easeInOut: Hg,
  easeOut: PS,
  circIn: Ic,
  circInOut: jg,
  circOut: Lg,
  backIn: $c,
  backInOut: Ug,
  backOut: Bg,
  anticipate: Ng
}, $S = (i) => typeof i == "string", qp = (i) => {
  if (/* @__PURE__ */ qg(i)) {
    Ro(i.length === 4);
    const [l, s, o, c] = i;
    return /* @__PURE__ */ Hl(l, s, o, c);
  } else if ($S(i))
    return WS[i];
  return i;
}, oo = [
  "setup",
  // Compute
  "read",
  // Read
  "resolveKeyframes",
  // Write/Read/Write/Read
  "preUpdate",
  // Compute
  "update",
  // Compute
  "preRender",
  // Compute
  "render",
  // Write
  "postRender"
  // Compute
];
function IS(i) {
  let l = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Set(), o = !1, c = !1;
  const d = /* @__PURE__ */ new WeakSet();
  let f = {
    delta: 0,
    timestamp: 0,
    isProcessing: !1
  };
  function m(p) {
    d.has(p) && (y.schedule(p), i()), p(f);
  }
  const y = {
    /**
     * Schedule a process to run on the next frame.
     */
    schedule: (p, v = !1, b = !1) => {
      const O = b && o ? l : s;
      return v && d.add(p), O.add(p), p;
    },
    /**
     * Cancel the provided callback from running on the next frame.
     */
    cancel: (p) => {
      s.delete(p), d.delete(p);
    },
    /**
     * Execute all schedule callbacks.
     */
    process: (p) => {
      if (f = p, o) {
        c = !0;
        return;
      }
      o = !0;
      const v = l;
      l = s, s = v, l.forEach(m), l.clear(), o = !1, c && (c = !1, y.process(p));
    }
  };
  return y;
}
const tT = 40;
function Xg(i, l) {
  let s = !1, o = !0;
  const c = {
    delta: 0,
    timestamp: 0,
    isProcessing: !1
  }, d = () => s = !0, f = oo.reduce((Y, q) => (Y[q] = IS(d), Y), {}), { setup: m, read: y, resolveKeyframes: p, preUpdate: v, update: b, preRender: T, render: O, postRender: M } = f, V = () => {
    const Y = ai.useManualTiming, q = Y ? c.timestamp : performance.now();
    s = !1, Y || (c.delta = o ? 1e3 / 60 : Math.max(Math.min(q - c.timestamp, tT), 1)), c.timestamp = q, c.isProcessing = !0, m.process(c), y.process(c), p.process(c), v.process(c), b.process(c), T.process(c), O.process(c), M.process(c), c.isProcessing = !1, s && l && (o = !1, i(V));
  }, j = () => {
    s = !0, o = !0, c.isProcessing || i(V);
  };
  return { schedule: oo.reduce((Y, q) => {
    const F = f[q];
    return Y[q] = (st, Q = !1, U = !1) => (s || j(), F.schedule(st, Q, U)), Y;
  }, {}), cancel: (Y) => {
    for (let q = 0; q < oo.length; q++)
      f[oo[q]].cancel(Y);
  }, state: c, steps: f };
}
const { schedule: Ut, cancel: li, state: ue, steps: ic } = /* @__PURE__ */ Xg(typeof requestAnimationFrame < "u" ? requestAnimationFrame : Ze, !0);
let fo;
function eT() {
  fo = void 0;
}
const de = {
  now: () => (fo === void 0 && de.set(ue.isProcessing || ai.useManualTiming ? ue.timestamp : performance.now()), fo),
  set: (i) => {
    fo = i, queueMicrotask(eT);
  }
}, kg = (i) => (l) => typeof l == "string" && l.startsWith(i), Qg = /* @__PURE__ */ kg("--"), nT = /* @__PURE__ */ kg("var(--"), tf = (i) => nT(i) ? iT.test(i.split("/*")[0].trim()) : !1, iT = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;
function Xp(i) {
  return typeof i != "string" ? !1 : i.split("/*")[0].includes("var(--");
}
const Ca = {
  test: (i) => typeof i == "number",
  parse: parseFloat,
  transform: (i) => i
}, _l = {
  ...Ca,
  transform: (i) => un(0, 1, i)
}, ro = {
  ...Ca,
  default: 1
}, Rl = (i) => Math.round(i * 1e5) / 1e5, ef = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
function aT(i) {
  return i == null;
}
const lT = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu, nf = (i, l) => (s) => !!(typeof s == "string" && lT.test(s) && s.startsWith(i) || l && !aT(s) && Object.prototype.hasOwnProperty.call(s, l)), Zg = (i, l, s) => (o) => {
  if (typeof o != "string")
    return o;
  const [c, d, f, m] = o.match(ef);
  return {
    [i]: parseFloat(c),
    [l]: parseFloat(d),
    [s]: parseFloat(f),
    alpha: m !== void 0 ? parseFloat(m) : 1
  };
}, sT = (i) => un(0, 255, i), ac = {
  ...Ca,
  transform: (i) => Math.round(sT(i))
}, wi = {
  test: /* @__PURE__ */ nf("rgb", "red"),
  parse: /* @__PURE__ */ Zg("red", "green", "blue"),
  transform: ({ red: i, green: l, blue: s, alpha: o = 1 }) => "rgba(" + ac.transform(i) + ", " + ac.transform(l) + ", " + ac.transform(s) + ", " + Rl(_l.transform(o)) + ")"
};
function oT(i) {
  let l = "", s = "", o = "", c = "";
  return i.length > 5 ? (l = i.substring(1, 3), s = i.substring(3, 5), o = i.substring(5, 7), c = i.substring(7, 9)) : (l = i.substring(1, 2), s = i.substring(2, 3), o = i.substring(3, 4), c = i.substring(4, 5), l += l, s += s, o += o, c += c), {
    red: parseInt(l, 16),
    green: parseInt(s, 16),
    blue: parseInt(o, 16),
    alpha: c ? parseInt(c, 16) / 255 : 1
  };
}
const Sc = {
  test: /* @__PURE__ */ nf("#"),
  parse: oT,
  transform: wi.transform
}, Gl = /* @__NO_SIDE_EFFECTS__ */ (i) => ({
  test: (l) => typeof l == "string" && l.endsWith(i) && l.split(" ").length === 1,
  parse: parseFloat,
  transform: (l) => `${l}${i}`
}), On = /* @__PURE__ */ Gl("deg"), rn = /* @__PURE__ */ Gl("%"), nt = /* @__PURE__ */ Gl("px"), rT = /* @__PURE__ */ Gl("vh"), uT = /* @__PURE__ */ Gl("vw"), kp = {
  ...rn,
  parse: (i) => rn.parse(i) / 100,
  transform: (i) => rn.transform(i * 100)
}, Aa = {
  test: /* @__PURE__ */ nf("hsl", "hue"),
  parse: /* @__PURE__ */ Zg("hue", "saturation", "lightness"),
  transform: ({ hue: i, saturation: l, lightness: s, alpha: o = 1 }) => "hsla(" + Math.round(i) + ", " + rn.transform(Rl(l)) + ", " + rn.transform(Rl(s)) + ", " + Rl(_l.transform(o)) + ")"
}, Wt = {
  test: (i) => wi.test(i) || Sc.test(i) || Aa.test(i),
  parse: (i) => wi.test(i) ? wi.parse(i) : Aa.test(i) ? Aa.parse(i) : Sc.parse(i),
  transform: (i) => typeof i == "string" ? i : i.hasOwnProperty("red") ? wi.transform(i) : Aa.transform(i),
  getAnimatableNone: (i) => {
    const l = Wt.parse(i);
    return l.alpha = 0, Wt.transform(l);
  }
}, cT = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
function fT(i) {
  return isNaN(i) && typeof i == "string" && (i.match(ef)?.length || 0) + (i.match(cT)?.length || 0) > 0;
}
const Kg = "number", Jg = "color", hT = "var", dT = "var(", Qp = "${}", mT = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function za(i) {
  const l = i.toString(), s = [], o = {
    color: [],
    number: [],
    var: []
  }, c = [];
  let d = 0;
  const m = l.replace(mT, (y) => (Wt.test(y) ? (o.color.push(d), c.push(Jg), s.push(Wt.parse(y))) : y.startsWith(dT) ? (o.var.push(d), c.push(hT), s.push(y)) : (o.number.push(d), c.push(Kg), s.push(parseFloat(y))), ++d, Qp)).split(Qp);
  return { values: s, split: m, indexes: o, types: c };
}
function pT(i) {
  return za(i).values;
}
function Fg({ split: i, types: l }) {
  const s = i.length;
  return (o) => {
    let c = "";
    for (let d = 0; d < s; d++)
      if (c += i[d], o[d] !== void 0) {
        const f = l[d];
        f === Kg ? c += Rl(o[d]) : f === Jg ? c += Wt.transform(o[d]) : c += o[d];
      }
    return c;
  };
}
function yT(i) {
  return Fg(za(i));
}
const gT = (i) => typeof i == "number" ? 0 : Wt.test(i) ? Wt.getAnimatableNone(i) : i, vT = (i, l) => typeof i == "number" ? l?.trim().endsWith("/") ? i : 0 : gT(i);
function bT(i) {
  const l = za(i);
  return Fg(l)(l.values.map((o, c) => vT(o, l.split[c])));
}
const Ie = {
  test: fT,
  parse: pT,
  createTransformer: yT,
  getAnimatableNone: bT
};
function lc(i, l, s) {
  return s < 0 && (s += 1), s > 1 && (s -= 1), s < 1 / 6 ? i + (l - i) * 6 * s : s < 1 / 2 ? l : s < 2 / 3 ? i + (l - i) * (2 / 3 - s) * 6 : i;
}
function ST({ hue: i, saturation: l, lightness: s, alpha: o }) {
  i /= 360, l /= 100, s /= 100;
  let c = 0, d = 0, f = 0;
  if (!l)
    c = d = f = s;
  else {
    const m = s < 0.5 ? s * (1 + l) : s + l - s * l, y = 2 * s - m;
    c = lc(y, m, i + 1 / 3), d = lc(y, m, i), f = lc(y, m, i - 1 / 3);
  }
  return {
    red: Math.round(c * 255),
    green: Math.round(d * 255),
    blue: Math.round(f * 255),
    alpha: o
  };
}
function To(i, l) {
  return (s) => s > 0 ? l : i;
}
const _t = (i, l, s) => i + (l - i) * s, sc = (i, l, s) => {
  const o = i * i, c = s * (l * l - o) + o;
  return c < 0 ? 0 : Math.sqrt(c);
}, TT = [Sc, wi, Aa], AT = (i) => TT.find((l) => l.test(i));
function Zp(i) {
  const l = AT(i);
  if (!l)
    return !1;
  let s = l.parse(i);
  return l === Aa && (s = ST(s)), s;
}
const Kp = (i, l) => {
  const s = Zp(i), o = Zp(l);
  if (!s || !o)
    return To(i, l);
  const c = { ...s };
  return (d) => (c.red = sc(s.red, o.red, d), c.green = sc(s.green, o.green, d), c.blue = sc(s.blue, o.blue, d), c.alpha = _t(s.alpha, o.alpha, d), wi.transform(c));
}, Tc = /* @__PURE__ */ new Set(["none", "hidden"]);
function xT(i, l) {
  return Tc.has(i) ? (s) => s <= 0 ? i : l : (s) => s >= 1 ? l : i;
}
function ET(i, l) {
  return (s) => _t(i, l, s);
}
function af(i) {
  return typeof i == "number" ? ET : typeof i == "string" ? tf(i) ? To : Wt.test(i) ? Kp : zT : Array.isArray(i) ? Pg : typeof i == "object" ? Wt.test(i) ? Kp : MT : To;
}
function Pg(i, l) {
  const s = [...i], o = s.length, c = i.map((d, f) => af(d)(d, l[f]));
  return (d) => {
    for (let f = 0; f < o; f++)
      s[f] = c[f](d);
    return s;
  };
}
function MT(i, l) {
  const s = { ...i, ...l }, o = {};
  for (const c in s)
    i[c] !== void 0 && l[c] !== void 0 && (o[c] = af(i[c])(i[c], l[c]));
  return (c) => {
    for (const d in o)
      s[d] = o[d](c);
    return s;
  };
}
function DT(i, l) {
  const s = [], o = { color: 0, var: 0, number: 0 };
  for (let c = 0; c < l.values.length; c++) {
    const d = l.types[c], f = i.indexes[d][o[d]], m = i.values[f] ?? 0;
    s[c] = m, o[d]++;
  }
  return s;
}
const zT = (i, l) => {
  const s = Ie.createTransformer(l), o = za(i), c = za(l);
  return o.indexes.var.length === c.indexes.var.length && o.indexes.color.length === c.indexes.color.length && o.indexes.number.length >= c.indexes.number.length ? Tc.has(i) && !c.values.length || Tc.has(l) && !o.values.length ? xT(i, l) : jl(Pg(DT(o, c), c.values), s) : To(i, l);
};
function Wg(i, l, s) {
  return typeof i == "number" && typeof l == "number" && typeof s == "number" ? _t(i, l, s) : af(i)(i, l);
}
const CT = (i) => {
  const l = ({ timestamp: s }) => i(s);
  return {
    start: (s = !0) => Ut.update(l, s),
    stop: () => li(l),
    /**
     * If we're processing this frame we can use the
     * framelocked timestamp to keep things in sync.
     */
    now: () => ue.isProcessing ? ue.timestamp : de.now()
  };
}, $g = (i, l, s = 10) => {
  let o = "";
  const c = Math.max(Math.round(l / s), 2);
  for (let d = 0; d < c; d++)
    o += Math.round(i(d / (c - 1)) * 1e4) / 1e4 + ", ";
  return `linear(${o.substring(0, o.length - 2)})`;
}, Ao = 2e4;
function lf(i) {
  let l = 0;
  const s = 50;
  let o = i.next(l);
  for (; !o.done && l < Ao; )
    l += s, o = i.next(l);
  return l >= Ao ? 1 / 0 : l;
}
function Ig(i, l = 100, s) {
  const o = s({ ...i, keyframes: [0, l] }), c = Math.min(lf(o), Ao);
  return {
    type: "keyframes",
    ease: (d) => o.next(c * d).value / l,
    duration: /* @__PURE__ */ Qe(c)
  };
}
const Xt = {
  // Default spring physics
  stiffness: 100,
  damping: 10,
  mass: 1,
  velocity: 0,
  // Default duration/bounce-based options
  duration: 800,
  // in ms
  bounce: 0.3,
  visualDuration: 0.3,
  // in seconds
  // Rest thresholds
  restSpeed: {
    granular: 0.01,
    default: 2
  },
  restDelta: {
    granular: 5e-3,
    default: 0.5
  },
  // Limits
  minDuration: 0.01,
  // in seconds
  maxDuration: 10,
  // in seconds
  minDamping: 0.05,
  maxDamping: 1
};
function Ac(i, l) {
  return i * Math.sqrt(1 - l * l);
}
const RT = 12;
function OT(i, l, s) {
  let o = s;
  for (let c = 1; c < RT; c++)
    o = o - i(o) / l(o);
  return o;
}
const oc = 1e-3;
function wT({ duration: i = Xt.duration, bounce: l = Xt.bounce, velocity: s = Xt.velocity, mass: o = Xt.mass }) {
  let c, d, f = 1 - l;
  f = un(Xt.minDamping, Xt.maxDamping, f), i = un(Xt.minDuration, Xt.maxDuration, /* @__PURE__ */ Qe(i)), f < 1 ? (c = (p) => {
    const v = p * f, b = v * i, T = v - s, O = Ac(p, f), M = Math.exp(-b);
    return oc - T / O * M;
  }, d = (p) => {
    const b = p * f * i, T = b * s + s, O = Math.pow(f, 2) * Math.pow(p, 2) * i, M = Math.exp(-b), V = Ac(Math.pow(p, 2), f);
    return (-c(p) + oc > 0 ? -1 : 1) * ((T - O) * M) / V;
  }) : (c = (p) => {
    const v = Math.exp(-p * i), b = (p - s) * i + 1;
    return -oc + v * b;
  }, d = (p) => {
    const v = Math.exp(-p * i), b = (s - p) * (i * i);
    return v * b;
  });
  const m = 5 / i, y = OT(c, d, m);
  if (i = /* @__PURE__ */ Ae(i), isNaN(y))
    return {
      stiffness: Xt.stiffness,
      damping: Xt.damping,
      duration: i
    };
  {
    const p = Math.pow(y, 2) * o;
    return {
      stiffness: p,
      damping: f * 2 * Math.sqrt(o * p),
      duration: i
    };
  }
}
const VT = ["duration", "bounce"], _T = ["stiffness", "damping", "mass"];
function Jp(i, l) {
  return l.some((s) => i[s] !== void 0);
}
function BT(i) {
  let l = {
    velocity: Xt.velocity,
    stiffness: Xt.stiffness,
    damping: Xt.damping,
    mass: Xt.mass,
    isResolvedFromDuration: !1,
    ...i
  };
  if (!Jp(i, _T) && Jp(i, VT))
    if (l.velocity = 0, i.visualDuration) {
      const s = i.visualDuration, o = 2 * Math.PI / (s * 1.2), c = o * o, d = 2 * un(0.05, 1, 1 - (i.bounce || 0)) * Math.sqrt(c);
      l = {
        ...l,
        mass: Xt.mass,
        stiffness: c,
        damping: d
      };
    } else {
      const s = wT({ ...i, velocity: 0 });
      l = {
        ...l,
        ...s,
        mass: Xt.mass
      }, l.isResolvedFromDuration = !0;
    }
  return l;
}
function Bl(i = Xt.visualDuration, l = Xt.bounce) {
  const s = typeof i != "object" ? {
    visualDuration: i,
    keyframes: [0, 1],
    bounce: l
  } : i;
  let { restSpeed: o, restDelta: c } = s;
  const d = s.keyframes[0], f = s.keyframes[s.keyframes.length - 1], m = { done: !1, value: d }, { stiffness: y, damping: p, mass: v, duration: b, velocity: T, isResolvedFromDuration: O } = BT({
    ...s,
    velocity: -/* @__PURE__ */ Qe(s.velocity || 0)
  }), M = T || 0, V = p / (2 * Math.sqrt(y * v)), j = f - d, _ = /* @__PURE__ */ Qe(Math.sqrt(y / v)), G = Math.abs(j) < 5;
  o || (o = G ? Xt.restSpeed.granular : Xt.restSpeed.default), c || (c = G ? Xt.restDelta.granular : Xt.restDelta.default);
  let Y, q, F, st, Q, U;
  if (V < 1)
    F = Ac(_, V), st = (M + V * _ * j) / F, Y = (I) => {
      const ct = Math.exp(-V * _ * I);
      return f - ct * (st * Math.sin(F * I) + j * Math.cos(F * I));
    }, Q = V * _ * st + j * F, U = V * _ * j - st * F, q = (I) => Math.exp(-V * _ * I) * (Q * Math.sin(F * I) + U * Math.cos(F * I));
  else if (V === 1) {
    Y = (ct) => f - Math.exp(-_ * ct) * (j + (M + _ * j) * ct);
    const I = M + _ * j;
    q = (ct) => Math.exp(-_ * ct) * (_ * I * ct - M);
  } else {
    const I = _ * Math.sqrt(V * V - 1);
    Y = (Rt) => {
      const Mt = Math.exp(-V * _ * Rt), R = Math.min(I * Rt, 300);
      return f - Mt * ((M + V * _ * j) * Math.sinh(R) + I * j * Math.cosh(R)) / I;
    };
    const ct = (M + V * _ * j) / I, gt = V * _ * ct - j * I, jt = V * _ * j - ct * I;
    q = (Rt) => {
      const Mt = Math.exp(-V * _ * Rt), R = Math.min(I * Rt, 300);
      return Mt * (gt * Math.sinh(R) + jt * Math.cosh(R));
    };
  }
  const $ = {
    calculatedDuration: O && b || null,
    velocity: (I) => /* @__PURE__ */ Ae(q(I)),
    next: (I) => {
      if (!O && V < 1) {
        const gt = Math.exp(-V * _ * I), jt = Math.sin(F * I), Rt = Math.cos(F * I), Mt = f - gt * (st * jt + j * Rt), R = /* @__PURE__ */ Ae(gt * (Q * jt + U * Rt));
        return m.done = Math.abs(R) <= o && Math.abs(f - Mt) <= c, m.value = m.done ? f : Mt, m;
      }
      const ct = Y(I);
      if (O)
        m.done = I >= b;
      else {
        const gt = /* @__PURE__ */ Ae(q(I));
        m.done = Math.abs(gt) <= o && Math.abs(f - ct) <= c;
      }
      return m.value = m.done ? f : ct, m;
    },
    toString: () => {
      const I = Math.min(lf($), Ao), ct = $g((gt) => $.next(I * gt).value, I, 30);
      return I + "ms " + ct;
    },
    toTransition: () => {
    }
  };
  return $;
}
Bl.applyToOptions = (i) => {
  const l = Ig(i, 100, Bl);
  return i.ease = l.ease, i.duration = /* @__PURE__ */ Ae(l.duration), i.type = "keyframes", i;
};
const UT = 5;
function tv(i, l, s) {
  const o = Math.max(l - UT, 0);
  return /* @__PURE__ */ wg(s - i(o), l - o);
}
function xc({ keyframes: i, velocity: l = 0, power: s = 0.8, timeConstant: o = 325, bounceDamping: c = 10, bounceStiffness: d = 500, modifyTarget: f, min: m, max: y, restDelta: p = 0.5, restSpeed: v }) {
  const b = i[0], T = {
    done: !1,
    value: b
  }, O = (U) => m !== void 0 && U < m || y !== void 0 && U > y, M = (U) => m === void 0 ? y : y === void 0 || Math.abs(m - U) < Math.abs(y - U) ? m : y;
  let V = s * l;
  const j = b + V, _ = f === void 0 ? j : f(j);
  _ !== j && (V = _ - b);
  const G = (U) => -V * Math.exp(-U / o), Y = (U) => _ + G(U), q = (U) => {
    const $ = G(U), I = Y(U);
    T.done = Math.abs($) <= p, T.value = T.done ? _ : I;
  };
  let F, st;
  const Q = (U) => {
    O(T.value) && (F = U, st = Bl({
      keyframes: [T.value, M(T.value)],
      velocity: tv(Y, U, T.value),
      // TODO: This should be passing * 1000
      damping: c,
      stiffness: d,
      restDelta: p,
      restSpeed: v
    }));
  };
  return Q(0), {
    calculatedDuration: null,
    next: (U) => {
      let $ = !1;
      return !st && F === void 0 && ($ = !0, q(U), Q(U)), F !== void 0 && U >= F ? st.next(U - F) : (!$ && q(U), T);
    }
  };
}
function NT(i, l, s) {
  const o = [], c = s || ai.mix || Wg, d = i.length - 1;
  for (let f = 0; f < d; f++) {
    let m = c(i[f], i[f + 1]);
    if (l) {
      const y = Array.isArray(l) ? l[f] || Ze : l;
      m = jl(y, m);
    }
    o.push(m);
  }
  return o;
}
function LT(i, l, { clamp: s = !0, ease: o, mixer: c } = {}) {
  const d = i.length;
  if (Ro(d === l.length), d === 1)
    return () => l[0];
  if (d === 2 && l[0] === l[1])
    return () => l[1];
  const f = i[0] === i[1];
  i[0] > i[d - 1] && (i = [...i].reverse(), l = [...l].reverse());
  const m = NT(l, o, c), y = m.length, p = (v) => {
    if (f && v < i[0])
      return l[0];
    let b = 0;
    if (y > 1)
      for (; b < i.length - 2 && !(v < i[b + 1]); b++)
        ;
    const T = /* @__PURE__ */ Da(i[b], i[b + 1], v);
    return m[b](T);
  };
  return s ? (v) => p(un(i[0], i[d - 1], v)) : p;
}
function ev(i, l) {
  const s = i[i.length - 1];
  for (let o = 1; o <= l; o++) {
    const c = /* @__PURE__ */ Da(0, l, o);
    i.push(_t(s, 1, c));
  }
}
function nv(i) {
  const l = [0];
  return ev(l, i.length - 1), l;
}
function jT(i, l) {
  return i.map((s) => s * l);
}
function HT(i, l) {
  return i.map(() => l || Hg).splice(0, i.length - 1);
}
function Ol({ duration: i = 300, keyframes: l, times: s, ease: o = "easeInOut" }) {
  const c = /* @__PURE__ */ Gg(o) ? o.map(qp) : qp(o), d = {
    done: !1,
    value: l[0]
  }, f = jT(
    // Only use the provided offsets if they're the correct length
    // TODO Maybe we should warn here if there's a length mismatch
    s && s.length === l.length ? s : nv(l),
    i
  ), m = LT(f, l, {
    ease: Array.isArray(c) ? c : HT(l, c)
  });
  return {
    calculatedDuration: i,
    next: (y) => (d.value = m(y), d.done = y >= i, d)
  };
}
const GT = (i) => i !== null;
function Oo(i, { repeat: l, repeatType: s = "loop" }, o, c = 1) {
  const d = i.filter(GT), m = c < 0 || l && s !== "loop" && l % 2 === 1 ? 0 : d.length - 1;
  return !m || o === void 0 ? d[m] : o;
}
const YT = {
  decay: xc,
  inertia: xc,
  tween: Ol,
  keyframes: Ol,
  spring: Bl
};
function iv(i) {
  typeof i.type == "string" && (i.type = YT[i.type]);
}
class sf {
  constructor() {
    this.updateFinished();
  }
  get finished() {
    return this._finished;
  }
  updateFinished() {
    this._finished = new Promise((l) => {
      this.resolve = l;
    });
  }
  notifyFinished() {
    this.resolve();
  }
  /**
   * Allows the animation to be awaited.
   *
   * @deprecated Use `finished` instead.
   */
  then(l, s) {
    return this.finished.then(l, s);
  }
}
const qT = (i) => i / 100;
class xo extends sf {
  constructor(l) {
    super(), this.state = "idle", this.startTime = null, this.isStopped = !1, this.currentTime = 0, this.holdTime = null, this.playbackSpeed = 1, this.delayState = {
      done: !1,
      value: void 0
    }, this.stop = () => {
      const { motionValue: s } = this.options;
      s && s.updatedAt !== de.now() && this.tick(de.now()), this.isStopped = !0, this.state !== "idle" && (this.teardown(), this.options.onStop?.());
    }, this.options = l, this.initAnimation(), this.play(), l.autoplay === !1 && this.pause();
  }
  initAnimation() {
    const { options: l } = this;
    iv(l);
    const { type: s = Ol, repeat: o = 0, repeatDelay: c = 0, repeatType: d, velocity: f = 0 } = l;
    let { keyframes: m } = l;
    const y = s || Ol;
    y !== Ol && typeof m[0] != "number" && (this.mixKeyframes = jl(qT, Wg(m[0], m[1])), m = [0, 100]);
    const p = y({ ...l, keyframes: m });
    d === "mirror" && (this.mirroredGenerator = y({
      ...l,
      keyframes: [...m].reverse(),
      velocity: -f
    })), p.calculatedDuration === null && (p.calculatedDuration = lf(p));
    const { calculatedDuration: v } = p;
    this.calculatedDuration = v, this.resolvedDuration = v + c, this.totalDuration = this.resolvedDuration * (o + 1) - c, this.generator = p;
  }
  updateTime(l) {
    const s = Math.round(l - this.startTime) * this.playbackSpeed;
    this.holdTime !== null ? this.currentTime = this.holdTime : this.currentTime = s;
  }
  tick(l, s = !1) {
    const { generator: o, totalDuration: c, mixKeyframes: d, mirroredGenerator: f, resolvedDuration: m, calculatedDuration: y } = this;
    if (this.startTime === null)
      return o.next(0);
    const { delay: p = 0, keyframes: v, repeat: b, repeatType: T, repeatDelay: O, type: M, onUpdate: V, finalKeyframe: j } = this.options;
    this.speed > 0 ? this.startTime = Math.min(this.startTime, l) : this.speed < 0 && (this.startTime = Math.min(l - c / this.speed, this.startTime)), s ? this.currentTime = l : this.updateTime(l);
    const _ = this.currentTime - p * (this.playbackSpeed >= 0 ? 1 : -1), G = this.playbackSpeed >= 0 ? _ < 0 : _ > c;
    this.currentTime = Math.max(_, 0), this.state === "finished" && this.holdTime === null && (this.currentTime = c);
    let Y = this.currentTime, q = o;
    if (b) {
      const U = Math.min(this.currentTime, c) / m;
      let $ = Math.floor(U), I = U % 1;
      !I && U >= 1 && (I = 1), I === 1 && $--, $ = Math.min($, b + 1), $ % 2 && (T === "reverse" ? (I = 1 - I, O && (I -= O / m)) : T === "mirror" && (q = f)), Y = un(0, 1, I) * m;
    }
    let F;
    G ? (this.delayState.value = v[0], F = this.delayState) : F = q.next(Y), d && !G && (F.value = d(F.value));
    let { done: st } = F;
    !G && y !== null && (st = this.playbackSpeed >= 0 ? this.currentTime >= c : this.currentTime <= 0);
    const Q = this.holdTime === null && (this.state === "finished" || this.state === "running" && st);
    return Q && M !== xc && (F.value = Oo(v, this.options, j, this.speed)), V && V(F.value), Q && this.finish(), F;
  }
  /**
   * Allows the returned animation to be awaited or promise-chained. Currently
   * resolves when the animation finishes at all but in a future update could/should
   * reject if its cancels.
   */
  then(l, s) {
    return this.finished.then(l, s);
  }
  get duration() {
    return /* @__PURE__ */ Qe(this.calculatedDuration);
  }
  get iterationDuration() {
    const { delay: l = 0 } = this.options || {};
    return this.duration + /* @__PURE__ */ Qe(l);
  }
  get time() {
    return /* @__PURE__ */ Qe(this.currentTime);
  }
  set time(l) {
    l = /* @__PURE__ */ Ae(l), this.currentTime = l, this.startTime === null || this.holdTime !== null || this.playbackSpeed === 0 ? this.holdTime = l : this.driver && (this.startTime = this.driver.now() - l / this.playbackSpeed), this.driver ? this.driver.start(!1) : (this.startTime = 0, this.state = "paused", this.holdTime = l, this.tick(l));
  }
  /**
   * Returns the generator's velocity at the current time in units/second.
   * Uses the analytical derivative when available (springs), avoiding
   * the MotionValue's frame-dependent velocity estimation.
   */
  getGeneratorVelocity() {
    const l = this.currentTime;
    if (l <= 0)
      return this.options.velocity || 0;
    if (this.generator.velocity)
      return this.generator.velocity(l);
    const s = this.generator.next(l).value;
    return tv((o) => this.generator.next(o).value, l, s);
  }
  get speed() {
    return this.playbackSpeed;
  }
  set speed(l) {
    const s = this.playbackSpeed !== l;
    s && this.driver && this.updateTime(de.now()), this.playbackSpeed = l, s && this.driver && (this.time = /* @__PURE__ */ Qe(this.currentTime));
  }
  play() {
    if (this.isStopped)
      return;
    const { driver: l = CT, startTime: s } = this.options;
    this.driver || (this.driver = l((c) => this.tick(c))), this.options.onPlay?.();
    const o = this.driver.now();
    this.state === "finished" ? (this.updateFinished(), this.startTime = o) : this.holdTime !== null ? this.startTime = o - this.holdTime : this.startTime || (this.startTime = s ?? o), this.state === "finished" && this.speed < 0 && (this.startTime += this.calculatedDuration), this.holdTime = null, this.state = "running", this.driver.start();
  }
  pause() {
    this.state = "paused", this.updateTime(de.now()), this.holdTime = this.currentTime;
  }
  complete() {
    this.state !== "running" && this.play(), this.state = "finished", this.holdTime = null;
  }
  finish() {
    this.notifyFinished(), this.teardown(), this.state = "finished", this.options.onComplete?.();
  }
  cancel() {
    this.holdTime = null, this.startTime = 0, this.tick(0), this.teardown(), this.options.onCancel?.();
  }
  teardown() {
    this.state = "idle", this.stopDriver(), this.startTime = this.holdTime = null;
  }
  stopDriver() {
    this.driver && (this.driver.stop(), this.driver = void 0);
  }
  sample(l) {
    return this.startTime = 0, this.tick(l, !0);
  }
  attachTimeline(l) {
    return this.options.allowFlatten && (this.options.type = "keyframes", this.options.ease = "linear", this.initAnimation()), this.driver?.stop(), l.observe(this);
  }
}
function XT(i) {
  for (let l = 1; l < i.length; l++)
    i[l] ?? (i[l] = i[l - 1]);
}
const Vi = (i) => i * 180 / Math.PI, Ec = (i) => {
  const l = Vi(Math.atan2(i[1], i[0]));
  return Mc(l);
}, kT = {
  x: 4,
  y: 5,
  translateX: 4,
  translateY: 5,
  scaleX: 0,
  scaleY: 3,
  scale: (i) => (Math.abs(i[0]) + Math.abs(i[3])) / 2,
  rotate: Ec,
  rotateZ: Ec,
  skewX: (i) => Vi(Math.atan(i[1])),
  skewY: (i) => Vi(Math.atan(i[2])),
  skew: (i) => (Math.abs(i[1]) + Math.abs(i[2])) / 2
}, Mc = (i) => (i = i % 360, i < 0 && (i += 360), i), Fp = Ec, Pp = (i) => Math.sqrt(i[0] * i[0] + i[1] * i[1]), Wp = (i) => Math.sqrt(i[4] * i[4] + i[5] * i[5]), QT = {
  x: 12,
  y: 13,
  z: 14,
  translateX: 12,
  translateY: 13,
  translateZ: 14,
  scaleX: Pp,
  scaleY: Wp,
  scale: (i) => (Pp(i) + Wp(i)) / 2,
  rotateX: (i) => Mc(Vi(Math.atan2(i[6], i[5]))),
  rotateY: (i) => Mc(Vi(Math.atan2(-i[2], i[0]))),
  rotateZ: Fp,
  rotate: Fp,
  skewX: (i) => Vi(Math.atan(i[4])),
  skewY: (i) => Vi(Math.atan(i[1])),
  skew: (i) => (Math.abs(i[1]) + Math.abs(i[4])) / 2
};
function Dc(i) {
  return i.includes("scale") ? 1 : 0;
}
function zc(i, l) {
  if (!i || i === "none")
    return Dc(l);
  const s = i.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);
  let o, c;
  if (s)
    o = QT, c = s;
  else {
    const m = i.match(/^matrix\(([-\d.e\s,]+)\)$/u);
    o = kT, c = m;
  }
  if (!c)
    return Dc(l);
  const d = o[l], f = c[1].split(",").map(KT);
  return typeof d == "function" ? d(f) : f[d];
}
const ZT = (i, l) => {
  const { transform: s = "none" } = getComputedStyle(i);
  return zc(s, l);
};
function KT(i) {
  return parseFloat(i.trim());
}
const Ra = [
  "transformPerspective",
  "x",
  "y",
  "z",
  "translateX",
  "translateY",
  "translateZ",
  "scale",
  "scaleX",
  "scaleY",
  "rotate",
  "rotateX",
  "rotateY",
  "rotateZ",
  "skew",
  "skewX",
  "skewY"
], Oa = /* @__PURE__ */ new Set([...Ra, "pathRotation"]), $p = (i) => i === Ca || i === nt, JT = /* @__PURE__ */ new Set(["x", "y", "z"]), FT = Ra.filter((i) => !JT.has(i));
function PT(i) {
  const l = [];
  return FT.forEach((s) => {
    const o = i.getValue(s);
    o !== void 0 && (l.push([s, o.get()]), o.set(s.startsWith("scale") ? 1 : 0));
  }), l;
}
const ii = {
  // Dimensions
  width: ({ x: i }, { paddingLeft: l = "0", paddingRight: s = "0", boxSizing: o }) => {
    const c = i.max - i.min;
    return o === "border-box" ? c : c - parseFloat(l) - parseFloat(s);
  },
  height: ({ y: i }, { paddingTop: l = "0", paddingBottom: s = "0", boxSizing: o }) => {
    const c = i.max - i.min;
    return o === "border-box" ? c : c - parseFloat(l) - parseFloat(s);
  },
  top: (i, { top: l }) => parseFloat(l),
  left: (i, { left: l }) => parseFloat(l),
  bottom: ({ y: i }, { top: l }) => parseFloat(l) + (i.max - i.min),
  right: ({ x: i }, { left: l }) => parseFloat(l) + (i.max - i.min),
  // Transform
  x: (i, { transform: l }) => zc(l, "x"),
  y: (i, { transform: l }) => zc(l, "y")
};
ii.translateX = ii.x;
ii.translateY = ii.y;
const _i = /* @__PURE__ */ new Set();
let Cc = !1, Rc = !1, Oc = !1;
function av() {
  if (Rc) {
    const i = Array.from(_i).filter((o) => o.needsMeasurement), l = new Set(i.map((o) => o.element)), s = /* @__PURE__ */ new Map();
    l.forEach((o) => {
      const c = PT(o);
      c.length && (s.set(o, c), o.render());
    }), i.forEach((o) => o.measureInitialState()), l.forEach((o) => {
      o.render();
      const c = s.get(o);
      c && c.forEach(([d, f]) => {
        o.getValue(d)?.set(f);
      });
    }), i.forEach((o) => o.measureEndState()), i.forEach((o) => {
      o.suspendedScrollY !== void 0 && window.scrollTo(0, o.suspendedScrollY);
    });
  }
  Rc = !1, Cc = !1, _i.forEach((i) => i.complete(Oc)), _i.clear();
}
function lv() {
  _i.forEach((i) => {
    i.readKeyframes(), i.needsMeasurement && (Rc = !0);
  });
}
function WT() {
  Oc = !0, lv(), av(), Oc = !1;
}
class of {
  constructor(l, s, o, c, d, f = !1) {
    this.state = "pending", this.isAsync = !1, this.needsMeasurement = !1, this.unresolvedKeyframes = [...l], this.onComplete = s, this.name = o, this.motionValue = c, this.element = d, this.isAsync = f;
  }
  scheduleResolve() {
    this.state = "scheduled", this.isAsync ? (_i.add(this), Cc || (Cc = !0, Ut.read(lv), Ut.resolveKeyframes(av))) : (this.readKeyframes(), this.complete());
  }
  readKeyframes() {
    const { unresolvedKeyframes: l, name: s, element: o, motionValue: c } = this;
    if (l[0] === null) {
      const d = c?.get(), f = l[l.length - 1];
      if (d !== void 0)
        l[0] = d;
      else if (o && s) {
        const m = o.readValue(s, f);
        m != null && (l[0] = m);
      }
      l[0] === void 0 && (l[0] = f), c && d === void 0 && c.set(l[0]);
    }
    XT(l);
  }
  setFinalKeyframe() {
  }
  measureInitialState() {
  }
  renderEndStyles() {
  }
  measureEndState() {
  }
  complete(l = !1) {
    this.state = "complete", this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, l), _i.delete(this);
  }
  cancel() {
    this.state === "scheduled" && (_i.delete(this), this.state = "pending");
  }
  resume() {
    this.state === "pending" && this.scheduleResolve();
  }
}
const $T = (i) => i.startsWith("--");
function sv(i, l, s) {
  $T(l) ? i.style.setProperty(l, s) : i.style[l] = s;
}
const IT = {};
function ov(i, l) {
  const s = /* @__PURE__ */ Og(i);
  return () => IT[l] ?? s();
}
const tA = /* @__PURE__ */ ov(() => window.ScrollTimeline !== void 0, "scrollTimeline"), rv = /* @__PURE__ */ ov(() => {
  try {
    document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
  } catch {
    return !1;
  }
  return !0;
}, "linearEasing"), Cl = ([i, l, s, o]) => `cubic-bezier(${i}, ${l}, ${s}, ${o})`, Ip = {
  linear: "linear",
  ease: "ease",
  easeIn: "ease-in",
  easeOut: "ease-out",
  easeInOut: "ease-in-out",
  circIn: /* @__PURE__ */ Cl([0, 0.65, 0.55, 1]),
  circOut: /* @__PURE__ */ Cl([0.55, 0, 1, 0.45]),
  backIn: /* @__PURE__ */ Cl([0.31, 0.01, 0.66, -0.59]),
  backOut: /* @__PURE__ */ Cl([0.33, 1.53, 0.69, 0.99])
};
function uv(i, l) {
  if (i)
    return typeof i == "function" ? rv() ? $g(i, l) : "ease-out" : /* @__PURE__ */ qg(i) ? Cl(i) : Array.isArray(i) ? i.map((s) => uv(s, l) || Ip.easeOut) : Ip[i];
}
function eA(i, l, s, { delay: o = 0, duration: c = 300, repeat: d = 0, repeatType: f = "loop", ease: m = "easeOut", times: y } = {}, p = void 0) {
  const v = {
    [l]: s
  };
  y && (v.offset = y);
  const b = uv(m, c);
  Array.isArray(b) && (v.easing = b);
  const T = {
    delay: o,
    duration: c,
    easing: Array.isArray(b) ? "linear" : b,
    fill: "both",
    iterations: d + 1,
    direction: f === "reverse" ? "alternate" : "normal"
  };
  return p && (T.pseudoElement = p), i.animate(v, T);
}
function rf(i) {
  return typeof i == "function" && "applyToOptions" in i;
}
function nA({ type: i, ...l }) {
  return rf(i) && rv() ? i.applyToOptions(l) : (l.duration ?? (l.duration = 300), l.ease ?? (l.ease = "easeOut"), l);
}
class cv extends sf {
  constructor(l) {
    if (super(), this.finishedTime = null, this.isStopped = !1, this.manualStartTime = null, !l)
      return;
    const { element: s, name: o, keyframes: c, pseudoElement: d, allowFlatten: f = !1, finalKeyframe: m, onComplete: y } = l;
    this.isPseudoElement = !!d, this.allowFlatten = f, this.options = l, Ro(typeof l.type != "string");
    const p = nA(l);
    this.animation = eA(s, o, c, p, d), p.autoplay === !1 && this.animation.pause(), this.animation.onfinish = () => {
      if (this.finishedTime = this.time, !d) {
        const v = Oo(c, this.options, m, this.speed);
        this.updateMotionValue && this.updateMotionValue(v), sv(s, o, v), this.animation.cancel();
      }
      y?.(), this.notifyFinished();
    };
  }
  play() {
    this.isStopped || (this.manualStartTime = null, this.animation.play(), this.state === "finished" && this.updateFinished());
  }
  pause() {
    this.animation.pause();
  }
  complete() {
    this.animation.finish?.();
  }
  cancel() {
    try {
      this.animation.cancel();
    } catch {
    }
  }
  stop() {
    if (this.isStopped)
      return;
    this.isStopped = !0;
    const { state: l } = this;
    l === "idle" || l === "finished" || (this.updateMotionValue ? this.updateMotionValue() : this.commitStyles(), this.isPseudoElement || this.cancel());
  }
  /**
   * WAAPI doesn't natively have any interruption capabilities.
   *
   * In this method, we commit styles back to the DOM before cancelling
   * the animation.
   *
   * This is designed to be overridden by NativeAnimationExtended, which
   * will create a renderless JS animation and sample it twice to calculate
   * its current value, "previous" value, and therefore allow
   * Motion to also correctly calculate velocity for any subsequent animation
   * while deferring the commit until the next animation frame.
   */
  commitStyles() {
    const l = this.options?.element;
    !this.isPseudoElement && l?.isConnected && this.animation.commitStyles?.();
  }
  get duration() {
    const l = this.animation.effect?.getComputedTiming?.().duration || 0;
    return /* @__PURE__ */ Qe(Number(l));
  }
  get iterationDuration() {
    const { delay: l = 0 } = this.options || {};
    return this.duration + /* @__PURE__ */ Qe(l);
  }
  get time() {
    return /* @__PURE__ */ Qe(Number(this.animation.currentTime) || 0);
  }
  set time(l) {
    const s = this.finishedTime !== null;
    this.manualStartTime = null, this.finishedTime = null, this.animation.currentTime = /* @__PURE__ */ Ae(l), s && this.animation.pause();
  }
  /**
   * The playback speed of the animation.
   * 1 = normal speed, 2 = double speed, 0.5 = half speed.
   */
  get speed() {
    return this.animation.playbackRate;
  }
  set speed(l) {
    l < 0 && (this.finishedTime = null), this.animation.playbackRate = l;
  }
  get state() {
    return this.finishedTime !== null ? "finished" : this.animation.playState;
  }
  get startTime() {
    return this.manualStartTime ?? Number(this.animation.startTime);
  }
  set startTime(l) {
    this.manualStartTime = this.animation.startTime = l;
  }
  /**
   * Attaches a timeline to the animation, for instance the `ScrollTimeline`.
   */
  attachTimeline({ timeline: l, rangeStart: s, rangeEnd: o, observe: c }) {
    return this.allowFlatten && this.animation.effect?.updateTiming({ easing: "linear" }), this.animation.onfinish = null, l && tA() ? (this.animation.timeline = l, s && (this.animation.rangeStart = s), o && (this.animation.rangeEnd = o), Ze) : c(this);
  }
}
const fv = {
  anticipate: Ng,
  backInOut: Ug,
  circInOut: jg
};
function iA(i) {
  return i in fv;
}
function aA(i) {
  typeof i.ease == "string" && iA(i.ease) && (i.ease = fv[i.ease]);
}
const rc = 10;
class lA extends cv {
  constructor(l) {
    aA(l), iv(l), super(l), l.startTime !== void 0 && l.autoplay !== !1 && (this.startTime = l.startTime), this.options = l;
  }
  /**
   * WAAPI doesn't natively have any interruption capabilities.
   *
   * Rather than read committed styles back out of the DOM, we can
   * create a renderless JS animation and sample it twice to calculate
   * its current value, "previous" value, and therefore allow
   * Motion to calculate velocity for any subsequent animation.
   */
  updateMotionValue(l) {
    const { motionValue: s, onUpdate: o, onComplete: c, element: d, ...f } = this.options;
    if (!s)
      return;
    if (l !== void 0) {
      s.set(l);
      return;
    }
    const m = new xo({
      ...f,
      autoplay: !1
    }), y = Math.max(rc, de.now() - this.startTime), p = un(0, rc, y - rc), v = m.sample(y).value, { name: b } = this.options;
    d && b && sv(d, b, v), s.setWithVelocity(m.sample(Math.max(0, y - p)).value, v, p), m.stop();
  }
}
const ty = (i, l) => l === "zIndex" ? !1 : !!(typeof i == "number" || Array.isArray(i) || typeof i == "string" && // It's animatable if we have a string
(Ie.test(i) || i === "0") && // And it contains numbers and/or colors
!i.startsWith("url("));
function sA(i) {
  const l = i[0];
  if (i.length === 1)
    return !0;
  for (let s = 0; s < i.length; s++)
    if (i[s] !== l)
      return !0;
}
function oA(i, l, s, o) {
  const c = i[0];
  if (c === null)
    return !1;
  if (l === "display" || l === "visibility")
    return !0;
  const d = i[i.length - 1], f = ty(c, l), m = ty(d, l);
  return !f || !m ? !1 : sA(i) || (s === "spring" || rf(s)) && o;
}
function wc(i) {
  i.duration = 0, i.type = "keyframes";
}
const hv = /* @__PURE__ */ new Set([
  "opacity",
  "clipPath",
  "filter",
  "transform",
  "backgroundColor"
]), rA = /^(?:oklch|oklab|lab|lch|color|color-mix|light-dark)\(/;
function uA(i) {
  for (let l = 0; l < i.length; l++)
    if (typeof i[l] == "string" && rA.test(i[l]))
      return !0;
  return !1;
}
const cA = /* @__PURE__ */ new Set([
  "color",
  "backgroundColor",
  "outlineColor",
  "fill",
  "stroke",
  "borderColor",
  "borderTopColor",
  "borderRightColor",
  "borderBottomColor",
  "borderLeftColor"
]), fA = /* @__PURE__ */ Og(() => Object.hasOwnProperty.call(Element.prototype, "animate"));
function hA(i) {
  const { motionValue: l, name: s, repeatDelay: o, repeatType: c, damping: d, type: f, keyframes: m } = i, y = l?.owner?.current;
  if (!(y instanceof HTMLElement) && !(y instanceof SVGElement))
    return !1;
  const { onUpdate: p, transformTemplate: v } = l.owner.getProps();
  return fA() && s && /**
   * Force WAAPI for color properties with browser-only color formats
   * (oklch, oklab, lab, lch, etc.) that the JS animation path can't parse.
   */
  (hv.has(s) || cA.has(s) && uA(m)) && (s !== "transform" || !v) && /**
   * If we're outputting values to onUpdate then we can't use WAAPI as there's
   * no way to read the value from WAAPI every frame.
   */
  !p && !o && c !== "mirror" && d !== 0 && f !== "inertia";
}
const dA = 40;
class mA extends sf {
  constructor({ autoplay: l = !0, delay: s = 0, type: o = "keyframes", repeat: c = 0, repeatDelay: d = 0, repeatType: f = "loop", keyframes: m, name: y, motionValue: p, element: v, ...b }) {
    super(), this.stop = () => {
      this._animation && (this._animation.stop(), this.stopTimeline?.()), this.keyframeResolver?.cancel();
    }, this.createdAt = de.now();
    const T = {
      autoplay: l,
      delay: s,
      type: o,
      repeat: c,
      repeatDelay: d,
      repeatType: f,
      name: y,
      motionValue: p,
      element: v,
      ...b
    }, O = v?.KeyframeResolver || of;
    this.keyframeResolver = new O(m, (M, V, j) => this.onKeyframesResolved(M, V, T, !j), y, p, v), this.keyframeResolver?.scheduleResolve();
  }
  onKeyframesResolved(l, s, o, c) {
    this.keyframeResolver = void 0;
    const { name: d, type: f, velocity: m, delay: y, isHandoff: p, onUpdate: v } = o;
    this.resolvedAt = de.now();
    let b = !0;
    oA(l, d, f, m) || (b = !1, (ai.instantAnimations || !y) && v?.(Oo(l, o, s)), l[0] = l[l.length - 1], wc(o), o.repeat = 0);
    const O = {
      startTime: c ? this.resolvedAt ? this.resolvedAt - this.createdAt > dA ? this.resolvedAt : this.createdAt : this.createdAt : void 0,
      finalKeyframe: s,
      ...o,
      keyframes: l
    }, M = b && !p && hA(O), V = O.motionValue?.owner?.current;
    let j;
    if (M)
      try {
        j = new lA({
          ...O,
          element: V
        });
      } catch {
        j = new xo(O);
      }
    else
      j = new xo(O);
    j.finished.then(() => {
      this.notifyFinished();
    }).catch(Ze), this.pendingTimeline && (this.stopTimeline = j.attachTimeline(this.pendingTimeline), this.pendingTimeline = void 0), this._animation = j;
  }
  get finished() {
    return this._animation ? this.animation.finished : this._finished;
  }
  then(l, s) {
    return this.finished.finally(l).then(() => {
    });
  }
  get animation() {
    return this._animation || (this.keyframeResolver?.resume(), WT()), this._animation;
  }
  get duration() {
    return this.animation.duration;
  }
  get iterationDuration() {
    return this.animation.iterationDuration;
  }
  get time() {
    return this.animation.time;
  }
  set time(l) {
    this.animation.time = l;
  }
  get speed() {
    return this.animation.speed;
  }
  get state() {
    return this.animation.state;
  }
  set speed(l) {
    this.animation.speed = l;
  }
  get startTime() {
    return this.animation.startTime;
  }
  attachTimeline(l) {
    return this._animation ? this.stopTimeline = this.animation.attachTimeline(l) : this.pendingTimeline = l, () => this.stop();
  }
  play() {
    this.animation.play();
  }
  pause() {
    this.animation.pause();
  }
  complete() {
    this.animation.complete();
  }
  cancel() {
    this._animation && this.animation.cancel(), this.keyframeResolver?.cancel();
  }
}
class pA {
  constructor(l) {
    this.stop = () => this.runAll("stop"), this.animations = l.filter(Boolean);
  }
  get finished() {
    return Promise.all(this.animations.map((l) => l.finished));
  }
  /**
   * TODO: Filter out cancelled or stopped animations before returning
   */
  getAll(l) {
    return this.animations[0][l];
  }
  setAll(l, s) {
    for (let o = 0; o < this.animations.length; o++)
      this.animations[o][l] = s;
  }
  attachTimeline(l) {
    const s = this.animations.map((o) => o.attachTimeline(l));
    return () => {
      s.forEach((o, c) => {
        o && o(), this.animations[c].stop();
      });
    };
  }
  get time() {
    return this.getAll("time");
  }
  set time(l) {
    this.setAll("time", l);
  }
  get speed() {
    return this.getAll("speed");
  }
  set speed(l) {
    this.setAll("speed", l);
  }
  get state() {
    return this.getAll("state");
  }
  get startTime() {
    return this.getAll("startTime");
  }
  get duration() {
    return ey(this.animations, "duration");
  }
  get iterationDuration() {
    return ey(this.animations, "iterationDuration");
  }
  runAll(l) {
    this.animations.forEach((s) => s[l]());
  }
  play() {
    this.runAll("play");
  }
  pause() {
    this.runAll("pause");
  }
  cancel() {
    this.runAll("cancel");
  }
  complete() {
    this.runAll("complete");
  }
}
function ey(i, l) {
  let s = 0;
  for (let o = 0; o < i.length; o++) {
    const c = i[o][l];
    c !== null && c > s && (s = c);
  }
  return s;
}
class yA extends pA {
  then(l, s) {
    return this.finished.finally(l).then(() => {
    });
  }
}
function dv(i, l, s, o = 0, c = 1) {
  const d = Array.from(i).sort((p, v) => p.sortNodePosition(v)).indexOf(l), f = i.size, m = (f - 1) * o;
  return typeof s == "function" ? s(d, f) : c === 1 ? d * o : m - d * o;
}
const ny = 30, gA = (i) => !isNaN(parseFloat(i));
class vA {
  /**
   * @param init - The initiating value
   * @param config - Optional configuration options
   *
   * -  `transformer`: A function to transform incoming values with.
   */
  constructor(l, s = {}) {
    this.canTrackVelocity = null, this.events = {}, this.updateAndNotify = (o) => {
      const c = de.now();
      if (this.updatedAt !== c && this.setPrevFrameValue(), this.prev = this.current, this.setCurrent(o), this.current !== this.prev && (this.events.change?.notify(this.current), this.dependents))
        for (const d of this.dependents)
          d.dirty();
    }, this.hasAnimated = !1, this.setCurrent(l), this.owner = s.owner;
  }
  setCurrent(l) {
    this.current = l, this.updatedAt = de.now(), this.canTrackVelocity === null && l !== void 0 && (this.canTrackVelocity = gA(this.current));
  }
  setPrevFrameValue(l = this.current) {
    this.prevFrameValue = l, this.prevUpdatedAt = this.updatedAt;
  }
  /**
   * Adds a function that will be notified when the `MotionValue` is updated.
   *
   * It returns a function that, when called, will cancel the subscription.
   *
   * When calling `onChange` inside a React component, it should be wrapped with the
   * `useEffect` hook. As it returns an unsubscribe function, this should be returned
   * from the `useEffect` function to ensure you don't add duplicate subscribers..
   *
   * ```jsx
   * export const MyComponent = () => {
   *   const x = useMotionValue(0)
   *   const y = useMotionValue(0)
   *   const opacity = useMotionValue(1)
   *
   *   useEffect(() => {
   *     function updateOpacity() {
   *       const maxXY = Math.max(x.get(), y.get())
   *       const newOpacity = transform(maxXY, [0, 100], [1, 0])
   *       opacity.set(newOpacity)
   *     }
   *
   *     const unsubscribeX = x.on("change", updateOpacity)
   *     const unsubscribeY = y.on("change", updateOpacity)
   *
   *     return () => {
   *       unsubscribeX()
   *       unsubscribeY()
   *     }
   *   }, [])
   *
   *   return <motion.div style={{ x }} />
   * }
   * ```
   *
   * @param subscriber - A function that receives the latest value.
   * @returns A function that, when called, will cancel this subscription.
   *
   * @deprecated
   */
  onChange(l) {
    return this.on("change", l);
  }
  on(l, s) {
    this.events[l] || (this.events[l] = new Pc());
    const o = this.events[l].add(s);
    return l === "change" ? () => {
      o(), Ut.read(() => {
        this.events.change.getSize() || this.stop();
      });
    } : o;
  }
  clearListeners() {
    for (const l in this.events)
      this.events[l].clear();
  }
  /**
   * Attaches a passive effect to the `MotionValue`.
   */
  attach(l, s) {
    this.passiveEffect = l, this.stopPassiveEffect = s;
  }
  /**
   * Sets the state of the `MotionValue`.
   *
   * @remarks
   *
   * ```jsx
   * const x = useMotionValue(0)
   * x.set(10)
   * ```
   *
   * @param latest - Latest value to set.
   * @param render - Whether to notify render subscribers. Defaults to `true`
   *
   * @public
   */
  set(l) {
    this.passiveEffect ? this.passiveEffect(l, this.updateAndNotify) : this.updateAndNotify(l);
  }
  setWithVelocity(l, s, o) {
    this.set(s), this.prev = void 0, this.prevFrameValue = l, this.prevUpdatedAt = this.updatedAt - o;
  }
  /**
   * Set the state of the `MotionValue`, stopping any active animations,
   * effects, and resets velocity to `0`.
   */
  jump(l, s = !0) {
    this.updateAndNotify(l), this.prev = l, this.prevUpdatedAt = this.prevFrameValue = void 0, s && this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
  }
  dirty() {
    this.events.change?.notify(this.current);
  }
  addDependent(l) {
    this.dependents || (this.dependents = /* @__PURE__ */ new Set()), this.dependents.add(l);
  }
  removeDependent(l) {
    this.dependents && this.dependents.delete(l);
  }
  /**
   * Returns the latest state of `MotionValue`
   *
   * @returns - The latest state of `MotionValue`
   *
   * @public
   */
  get() {
    return this.current;
  }
  /**
   * @public
   */
  getPrevious() {
    return this.prev;
  }
  /**
   * Returns the latest velocity of `MotionValue`
   *
   * @returns - The latest velocity of `MotionValue`. Returns `0` if the state is non-numerical.
   *
   * @public
   */
  getVelocity() {
    const l = de.now();
    if (!this.canTrackVelocity || this.prevFrameValue === void 0 || l - this.updatedAt > ny)
      return 0;
    const s = Math.min(this.updatedAt - this.prevUpdatedAt, ny);
    return /* @__PURE__ */ wg(parseFloat(this.current) - parseFloat(this.prevFrameValue), s);
  }
  /**
   * Registers a new animation to control this `MotionValue`. Only one
   * animation can drive a `MotionValue` at one time.
   *
   * ```jsx
   * value.start()
   * ```
   *
   * @param animation - A function that starts the provided animation
   */
  start(l) {
    return this.stop(), new Promise((s) => {
      this.hasAnimated = !0, this.animation = l(s), this.events.animationStart && this.events.animationStart.notify();
    }).then(() => {
      this.events.animationComplete && this.events.animationComplete.notify(), this.clearAnimation();
    });
  }
  /**
   * Stop the currently active animation.
   *
   * @public
   */
  stop() {
    this.animation && (this.animation.stop(), this.events.animationCancel && this.events.animationCancel.notify()), this.clearAnimation();
  }
  /**
   * Returns `true` if this value is currently animating.
   *
   * @public
   */
  isAnimating() {
    return !!this.animation;
  }
  clearAnimation() {
    delete this.animation;
  }
  /**
   * Destroy and clean up subscribers to this `MotionValue`.
   *
   * The `MotionValue` hooks like `useMotionValue` and `useTransform` automatically
   * handle the lifecycle of the returned `MotionValue`, so this method is only necessary if you've manually
   * created a `MotionValue` via the `motionValue` function.
   *
   * @public
   */
  destroy() {
    this.dependents?.clear(), this.events.destroy?.notify(), this.clearListeners(), this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
  }
}
function si(i, l) {
  return new vA(i, l);
}
function mv(i, l) {
  if (i?.inherit && l) {
    const { inherit: s, ...o } = i;
    return { ...l, ...o };
  }
  return i;
}
function uf(i, l) {
  const s = i?.[l] ?? i?.default ?? i;
  return s !== i ? mv(s, i) : s;
}
const bA = {
  type: "spring",
  stiffness: 500,
  damping: 25,
  restSpeed: 10
}, SA = (i) => ({
  type: "spring",
  stiffness: 550,
  damping: i === 0 ? 2 * Math.sqrt(550) : 30,
  restSpeed: 10
}), TA = {
  type: "keyframes",
  duration: 0.8
}, AA = {
  type: "keyframes",
  ease: [0.25, 0.1, 0.35, 1],
  duration: 0.3
}, xA = (i, { keyframes: l }) => l.length > 2 ? TA : Oa.has(i) ? i.startsWith("scale") ? SA(l[1]) : bA : AA, EA = /* @__PURE__ */ new Set([
  "when",
  "delay",
  "delayChildren",
  "staggerChildren",
  "staggerDirection",
  "repeat",
  "repeatType",
  "repeatDelay",
  "from",
  "elapsed"
]);
function MA(i) {
  for (const l in i)
    if (!EA.has(l))
      return !0;
  return !1;
}
const cf = (i, l, s, o = {}, c, d) => (f) => {
  const m = uf(o, i) || {}, y = m.delay || o.delay || 0;
  let { elapsed: p = 0 } = o;
  p = p - /* @__PURE__ */ Ae(y);
  const v = {
    keyframes: Array.isArray(s) ? s : [null, s],
    ease: "easeOut",
    velocity: l.getVelocity(),
    ...m,
    delay: -p,
    onUpdate: (T) => {
      l.set(T), m.onUpdate && m.onUpdate(T);
    },
    onComplete: () => {
      f(), m.onComplete && m.onComplete();
    },
    name: i,
    motionValue: l,
    element: d ? void 0 : c
  };
  MA(m) || Object.assign(v, xA(i, v)), v.duration && (v.duration = /* @__PURE__ */ Ae(v.duration)), v.repeatDelay && (v.repeatDelay = /* @__PURE__ */ Ae(v.repeatDelay)), v.from !== void 0 && (v.keyframes[0] = v.from);
  let b = !1;
  if ((v.type === !1 || v.duration === 0 && !v.repeatDelay) && (wc(v), v.delay === 0 && (b = !0)), (ai.instantAnimations || ai.skipAnimations || c?.shouldSkipAnimations || m.skipAnimations) && (b = !0, wc(v), v.delay = 0), v.allowFlatten = !m.type && !m.ease, b && !d && l.get() !== void 0) {
    const T = Oo(v.keyframes, m);
    if (T !== void 0) {
      Ut.update(() => {
        v.onUpdate(T), v.onComplete();
      });
      return;
    }
  }
  return m.isSync ? new xo(v) : new mA(v);
}, DA = (
  // eslint-disable-next-line redos-detector/no-unsafe-regex -- false positive, as it can match a lot of words
  /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u
);
function zA(i) {
  const l = DA.exec(i);
  if (!l)
    return [,];
  const [, s, o, c] = l;
  return [`--${s ?? o}`, c];
}
function pv(i, l, s = 1) {
  const [o, c] = zA(i);
  if (!o)
    return;
  const d = window.getComputedStyle(l).getPropertyValue(o);
  if (d) {
    const f = d.trim();
    return zg(f) ? parseFloat(f) : f;
  }
  return tf(c) ? pv(c, l, s + 1) : c;
}
function iy(i) {
  const l = [{}, {}];
  return i?.values.forEach((s, o) => {
    l[0][o] = s.get(), l[1][o] = s.getVelocity();
  }), l;
}
function ff(i, l, s, o) {
  if (typeof l == "function") {
    const [c, d] = iy(o);
    l = l(s !== void 0 ? s : i.custom, c, d);
  }
  if (typeof l == "string" && (l = i.variants && i.variants[l]), typeof l == "function") {
    const [c, d] = iy(o);
    l = l(s !== void 0 ? s : i.custom, c, d);
  }
  return l;
}
function Bi(i, l, s) {
  const o = i.getProps();
  return ff(o, l, s !== void 0 ? s : o.custom, i);
}
const yv = /* @__PURE__ */ new Set([
  "width",
  "height",
  "top",
  "left",
  "right",
  "bottom",
  ...Ra
]), Vc = (i) => Array.isArray(i);
function CA(i, l, s) {
  i.hasValue(l) ? i.getValue(l).set(s) : i.addValue(l, si(s));
}
function RA(i) {
  return Vc(i) ? i[i.length - 1] || 0 : i;
}
function OA(i, l) {
  const s = Bi(i, l);
  let { transitionEnd: o = {}, transition: c = {}, ...d } = s || {};
  d = { ...d, ...o };
  for (const f in d) {
    const m = RA(d[f]);
    CA(i, f, m);
  }
}
const te = (i) => !!(i && i.getVelocity);
function wA(i) {
  return !!(te(i) && i.add);
}
function _c(i, l) {
  const s = i.getValue("willChange");
  if (wA(s))
    return s.add(l);
  if (!s && ai.WillChange) {
    const o = new ai.WillChange("auto");
    i.addValue("willChange", o), o.add(l);
  }
}
function hf(i) {
  return i.replace(/([A-Z])/g, (l) => `-${l.toLowerCase()}`);
}
const VA = "framerAppearId", gv = "data-" + hf(VA);
function vv(i) {
  return i.props[gv];
}
function _A({ protectedKeys: i, needsAnimating: l }, s) {
  const o = i.hasOwnProperty(s) && l[s] !== !0;
  return l[s] = !1, o;
}
function df(i, l, { delay: s = 0, transitionOverride: o, type: c } = {}) {
  let { transition: d, transitionEnd: f, ...m } = l;
  const y = i.getDefaultTransition();
  d = d ? mv(d, y) : y;
  const p = d?.reduceMotion, v = d?.skipAnimations;
  o && (d = o);
  const b = [], T = c && i.animationState && i.animationState.getState()[c], O = d?.path;
  O && O.animateVisualElement(i, m, d, s, b);
  for (const M in m) {
    const V = i.getValue(M, i.latestValues[M] ?? null), j = m[M];
    if (j === void 0 || T && _A(T, M))
      continue;
    const _ = {
      delay: s,
      ...uf(d || {}, M)
    };
    v && (_.skipAnimations = !0);
    const G = V.get();
    if (G !== void 0 && !V.isAnimating() && !Array.isArray(j) && j === G && !_.velocity) {
      Ut.update(() => V.set(j));
      continue;
    }
    let Y = !1;
    if (window.MotionHandoffAnimation) {
      const st = vv(i);
      if (st) {
        const Q = window.MotionHandoffAnimation(st, M, Ut);
        Q !== null && (_.startTime = Q, Y = !0);
      }
    }
    _c(i, M);
    const q = p ?? i.shouldReduceMotion;
    V.start(cf(M, V, j, q && yv.has(M) ? { type: !1 } : _, i, Y));
    const F = V.animation;
    F && b.push(F);
  }
  if (f) {
    const M = () => Ut.update(() => {
      f && OA(i, f);
    });
    b.length ? Promise.all(b).then(M) : M();
  }
  return b;
}
function Bc(i, l, s = {}) {
  const o = Bi(i, l, s.type === "exit" ? i.presenceContext?.custom : void 0);
  let { transition: c = i.getDefaultTransition() || {} } = o || {};
  s.transitionOverride && (c = s.transitionOverride);
  const d = o ? () => Promise.all(df(i, o, s)) : () => Promise.resolve(), f = i.variantChildren && i.variantChildren.size ? (y = 0) => {
    const { delayChildren: p = 0, staggerChildren: v, staggerDirection: b } = c;
    return BA(i, l, y, p, v, b, s);
  } : () => Promise.resolve(), { when: m } = c;
  if (m) {
    const [y, p] = m === "beforeChildren" ? [d, f] : [f, d];
    return y().then(() => p());
  } else
    return Promise.all([d(), f(s.delay)]);
}
function BA(i, l, s = 0, o = 0, c = 0, d = 1, f) {
  const m = [];
  for (const y of i.variantChildren)
    y.notify("AnimationStart", l), m.push(Bc(y, l, {
      ...f,
      delay: s + (typeof o == "function" ? 0 : o) + dv(i.variantChildren, y, o, c, d)
    }).then(() => y.notify("AnimationComplete", l)));
  return Promise.all(m);
}
function UA(i, l, s = {}) {
  i.notify("AnimationStart", l);
  let o;
  if (Array.isArray(l)) {
    const c = l.map((d) => Bc(i, d, s));
    o = Promise.all(c);
  } else if (typeof l == "string")
    o = Bc(i, l, s);
  else {
    const c = typeof l == "function" ? Bi(i, l, s.custom) : l;
    o = Promise.all(df(i, c, s));
  }
  return o.then(() => {
    i.notify("AnimationComplete", l);
  });
}
const NA = {
  test: (i) => i === "auto",
  parse: (i) => i
}, bv = (i) => (l) => l.test(i), Sv = [Ca, nt, rn, On, uT, rT, NA], ay = (i) => Sv.find(bv(i));
function LA(i) {
  return typeof i == "number" ? i === 0 : i !== null ? i === "none" || i === "0" || Rg(i) : !0;
}
const jA = /* @__PURE__ */ new Set(["brightness", "contrast", "saturate", "opacity"]);
function HA(i) {
  const [l, s] = i.slice(0, -1).split("(");
  if (l === "drop-shadow")
    return i;
  const [o] = s.match(ef) || [];
  if (!o)
    return i;
  const c = s.replace(o, "");
  let d = jA.has(l) ? 1 : 0;
  return o !== s && (d *= 100), l + "(" + d + c + ")";
}
const GA = /\b([a-z-]*)\(.*?\)/gu, Uc = {
  ...Ie,
  getAnimatableNone: (i) => {
    const l = i.match(GA);
    return l ? l.map(HA).join(" ") : i;
  }
}, Nc = {
  ...Ie,
  getAnimatableNone: (i) => {
    const l = Ie.parse(i);
    return Ie.createTransformer(i)(l.map((o) => typeof o == "number" ? 0 : typeof o == "object" ? { ...o, alpha: 1 } : o));
  }
}, ly = {
  ...Ca,
  transform: Math.round
}, YA = {
  rotate: On,
  /**
   * Internal channel for `transition.path` orientToPath. Composed onto
   * `rotate` at the transform-build sites so the user's `rotate` is
   * never read or overwritten. Not part of `transformPropOrder`.
   */
  pathRotation: On,
  rotateX: On,
  rotateY: On,
  rotateZ: On,
  scale: ro,
  scaleX: ro,
  scaleY: ro,
  scaleZ: ro,
  skew: On,
  skewX: On,
  skewY: On,
  distance: nt,
  translateX: nt,
  translateY: nt,
  translateZ: nt,
  x: nt,
  y: nt,
  z: nt,
  perspective: nt,
  transformPerspective: nt,
  opacity: _l,
  originX: kp,
  originY: kp,
  originZ: nt
}, Eo = {
  // Border props
  borderWidth: nt,
  borderTopWidth: nt,
  borderRightWidth: nt,
  borderBottomWidth: nt,
  borderLeftWidth: nt,
  borderRadius: nt,
  borderTopLeftRadius: nt,
  borderTopRightRadius: nt,
  borderBottomRightRadius: nt,
  borderBottomLeftRadius: nt,
  // Positioning props
  width: nt,
  maxWidth: nt,
  height: nt,
  maxHeight: nt,
  top: nt,
  right: nt,
  bottom: nt,
  left: nt,
  inset: nt,
  insetBlock: nt,
  insetBlockStart: nt,
  insetBlockEnd: nt,
  insetInline: nt,
  insetInlineStart: nt,
  insetInlineEnd: nt,
  // Spacing props
  padding: nt,
  paddingTop: nt,
  paddingRight: nt,
  paddingBottom: nt,
  paddingLeft: nt,
  paddingBlock: nt,
  paddingBlockStart: nt,
  paddingBlockEnd: nt,
  paddingInline: nt,
  paddingInlineStart: nt,
  paddingInlineEnd: nt,
  margin: nt,
  marginTop: nt,
  marginRight: nt,
  marginBottom: nt,
  marginLeft: nt,
  marginBlock: nt,
  marginBlockStart: nt,
  marginBlockEnd: nt,
  marginInline: nt,
  marginInlineStart: nt,
  marginInlineEnd: nt,
  // Typography
  fontSize: nt,
  // Misc
  backgroundPositionX: nt,
  backgroundPositionY: nt,
  ...YA,
  zIndex: ly,
  // SVG
  fillOpacity: _l,
  strokeOpacity: _l,
  numOctaves: ly
}, qA = {
  ...Eo,
  // Color props
  color: Wt,
  backgroundColor: Wt,
  outlineColor: Wt,
  fill: Wt,
  stroke: Wt,
  // Border props
  borderColor: Wt,
  borderTopColor: Wt,
  borderRightColor: Wt,
  borderBottomColor: Wt,
  borderLeftColor: Wt,
  filter: Uc,
  WebkitFilter: Uc,
  mask: Nc,
  WebkitMask: Nc
}, Tv = (i) => qA[i], XA = /* @__PURE__ */ new Set([Uc, Nc]);
function Av(i, l) {
  let s = Tv(i);
  return XA.has(s) || (s = Ie), s.getAnimatableNone ? s.getAnimatableNone(l) : void 0;
}
const kA = /* @__PURE__ */ new Set(["auto", "none", "0"]);
function QA(i, l, s) {
  let o = 0, c;
  for (; o < i.length && !c; ) {
    const d = i[o];
    typeof d == "string" && !kA.has(d) && za(d).values.length && (c = i[o]), o++;
  }
  if (c && s)
    for (const d of l)
      i[d] = Av(s, c);
}
class ZA extends of {
  constructor(l, s, o, c, d) {
    super(l, s, o, c, d, !0);
  }
  readKeyframes() {
    const { unresolvedKeyframes: l, element: s, name: o } = this;
    if (!s || !s.current)
      return;
    super.readKeyframes();
    for (let v = 0; v < l.length; v++) {
      let b = l[v];
      if (typeof b == "string" && (b = b.trim(), tf(b))) {
        const T = pv(b, s.current);
        T !== void 0 && (l[v] = T), v === l.length - 1 && (this.finalKeyframe = b);
      }
    }
    if (this.resolveNoneKeyframes(), !yv.has(o) || l.length !== 2)
      return;
    const [c, d] = l, f = ay(c), m = ay(d), y = Xp(c), p = Xp(d);
    if (y !== p && ii[o]) {
      this.needsMeasurement = !0;
      return;
    }
    if (f !== m)
      if ($p(f) && $p(m))
        for (let v = 0; v < l.length; v++) {
          const b = l[v];
          typeof b == "string" && (l[v] = parseFloat(b));
        }
      else ii[o] && (this.needsMeasurement = !0);
  }
  resolveNoneKeyframes() {
    const { unresolvedKeyframes: l, name: s } = this, o = [];
    for (let c = 0; c < l.length; c++)
      (l[c] === null || LA(l[c])) && o.push(c);
    o.length && QA(l, o, s);
  }
  measureInitialState() {
    const { element: l, unresolvedKeyframes: s, name: o } = this;
    if (!l || !l.current)
      return;
    o === "height" && (this.suspendedScrollY = window.pageYOffset), this.measuredOrigin = ii[o](l.measureViewportBox(), window.getComputedStyle(l.current)), s[0] = this.measuredOrigin;
    const c = s[s.length - 1];
    c !== void 0 && l.getValue(o, c).jump(c, !1);
  }
  measureEndState() {
    const { element: l, name: s, unresolvedKeyframes: o } = this;
    if (!l || !l.current)
      return;
    const c = l.getValue(s);
    c && c.jump(this.measuredOrigin, !1);
    const d = o.length - 1, f = o[d];
    o[d] = ii[s](l.measureViewportBox(), window.getComputedStyle(l.current)), f !== null && this.finalKeyframe === void 0 && (this.finalKeyframe = f), this.removedTransforms?.length && this.removedTransforms.forEach(([m, y]) => {
      l.getValue(m).set(y);
    }), this.resolveNoneKeyframes();
  }
}
const mf = [
  "borderTopLeftRadius",
  "borderTopRightRadius",
  "borderBottomRightRadius",
  "borderBottomLeftRadius"
];
function pf(i, l, s) {
  if (i == null)
    return [];
  if (i instanceof EventTarget)
    return [i];
  if (typeof i == "string") {
    let o = document;
    l && (o = l.current);
    const c = s?.[i] ?? o.querySelectorAll(i);
    return c ? Array.from(c) : [];
  }
  return Array.from(i).filter((o) => o != null);
}
const Lc = (i, l) => l && typeof i == "number" ? l.transform(i) : i;
function KA(i) {
  return Cg(i) && "offsetHeight" in i && !("ownerSVGElement" in i);
}
const { schedule: yf } = /* @__PURE__ */ Xg(queueMicrotask, !1), $e = {
  x: !1,
  y: !1
};
function xv() {
  return $e.x || $e.y;
}
function JA(i) {
  return i === "x" || i === "y" ? $e[i] ? null : ($e[i] = !0, () => {
    $e[i] = !1;
  }) : $e.x || $e.y ? null : ($e.x = $e.y = !0, () => {
    $e.x = $e.y = !1;
  });
}
function Ev(i, l) {
  const s = pf(i), o = new AbortController(), c = {
    passive: !0,
    ...l,
    signal: o.signal
  };
  return [s, c, () => o.abort()];
}
function FA(i) {
  return !(i.pointerType === "touch" || xv());
}
function PA(i, l, s = {}) {
  const [o, c, d] = Ev(i, s);
  return o.forEach((f) => {
    let m = !1, y = !1, p;
    const v = () => {
      f.removeEventListener("pointerleave", M);
    }, b = (j) => {
      p && (p(j), p = void 0), v();
    }, T = (j) => {
      m = !1, window.removeEventListener("pointerup", T), window.removeEventListener("pointercancel", T), y && (y = !1, b(j));
    }, O = () => {
      m = !0, window.addEventListener("pointerup", T, c), window.addEventListener("pointercancel", T, c);
    }, M = (j) => {
      if (j.pointerType !== "touch") {
        if (m) {
          y = !0;
          return;
        }
        b(j);
      }
    }, V = (j) => {
      if (!FA(j))
        return;
      y = !1;
      const _ = l(f, j);
      typeof _ == "function" && (p = _, f.addEventListener("pointerleave", M, c));
    };
    f.addEventListener("pointerenter", V, c), f.addEventListener("pointerdown", O, c);
  }), d;
}
const Mv = (i, l) => l ? i === l ? !0 : Mv(i, l.parentElement) : !1, gf = (i) => i.pointerType === "mouse" ? typeof i.button != "number" || i.button <= 0 : i.isPrimary !== !1, WA = /* @__PURE__ */ new Set([
  "BUTTON",
  "INPUT",
  "SELECT",
  "TEXTAREA",
  "A"
]);
function $A(i) {
  return WA.has(i.tagName) || i.isContentEditable === !0;
}
const IA = /* @__PURE__ */ new Set(["INPUT", "SELECT", "TEXTAREA"]);
function tx(i) {
  return IA.has(i.tagName) || i.isContentEditable === !0;
}
const ho = /* @__PURE__ */ new WeakSet();
function sy(i) {
  return (l) => {
    l.key === "Enter" && i(l);
  };
}
function uc(i, l) {
  i.dispatchEvent(new PointerEvent("pointer" + l, { isPrimary: !0, bubbles: !0 }));
}
const ex = (i, l) => {
  const s = i.currentTarget;
  if (!s)
    return;
  const o = sy(() => {
    if (ho.has(s))
      return;
    uc(s, "down");
    const c = sy(() => {
      uc(s, "up");
    }), d = () => uc(s, "cancel");
    s.addEventListener("keyup", c, l), s.addEventListener("blur", d, l);
  });
  s.addEventListener("keydown", o, l), s.addEventListener("blur", () => s.removeEventListener("keydown", o), l);
};
function oy(i) {
  return gf(i) && !xv();
}
const ry = /* @__PURE__ */ new WeakSet();
function nx(i, l, s = {}) {
  const [o, c, d] = Ev(i, s), f = (m) => {
    const y = m.currentTarget;
    if (!oy(m) || ry.has(m))
      return;
    ho.add(y), s.stopPropagation && ry.add(m);
    const p = l(y, m), v = { ...c, capture: !0 }, b = (M, V) => {
      window.removeEventListener("pointerup", T, v), window.removeEventListener("pointercancel", O, v), ho.has(y) && ho.delete(y), oy(M) && typeof p == "function" && p(M, { success: V });
    }, T = (M) => {
      b(M, y === window || y === document || s.useGlobalTarget || Mv(y, M.target));
    }, O = (M) => {
      b(M, !1);
    };
    window.addEventListener("pointerup", T, v), window.addEventListener("pointercancel", O, v);
  };
  return o.forEach((m) => {
    (s.useGlobalTarget ? window : m).addEventListener("pointerdown", f, c), KA(m) && (m.addEventListener("focus", (p) => ex(p, c)), !$A(m) && !m.hasAttribute("tabindex") && (m.tabIndex = 0));
  }), d;
}
function wo(i) {
  return Cg(i) && "ownerSVGElement" in i;
}
const mo = /* @__PURE__ */ new WeakMap();
let po;
const Dv = (i, l, s) => (o, c) => c && c[0] ? c[0][i + "Size"] : wo(o) && "getBBox" in o ? o.getBBox()[l] : o[s], ix = /* @__PURE__ */ Dv("inline", "width", "offsetWidth"), ax = /* @__PURE__ */ Dv("block", "height", "offsetHeight");
function lx({ target: i, borderBoxSize: l }) {
  mo.get(i)?.forEach((s) => {
    s(i, {
      get width() {
        return ix(i, l);
      },
      get height() {
        return ax(i, l);
      }
    });
  });
}
function sx(i) {
  i.forEach(lx);
}
function ox() {
  typeof ResizeObserver > "u" || (po = new ResizeObserver(sx));
}
function rx(i, l) {
  po || ox();
  const s = pf(i);
  return s.forEach((o) => {
    let c = mo.get(o);
    c || (c = /* @__PURE__ */ new Set(), mo.set(o, c)), c.add(l), po?.observe(o);
  }), () => {
    s.forEach((o) => {
      const c = mo.get(o);
      c?.delete(l), c?.size || po?.unobserve(o);
    });
  };
}
const yo = /* @__PURE__ */ new Set();
let xa;
function ux() {
  xa = () => {
    const i = {
      get width() {
        return window.innerWidth;
      },
      get height() {
        return window.innerHeight;
      }
    };
    yo.forEach((l) => l(i));
  }, window.addEventListener("resize", xa);
}
function cx(i) {
  return yo.add(i), xa || ux(), () => {
    yo.delete(i), !yo.size && typeof xa == "function" && (window.removeEventListener("resize", xa), xa = void 0);
  };
}
function uy(i, l) {
  return typeof i == "function" ? cx(i) : rx(i, l);
}
function zv(i) {
  return wo(i) && i.tagName === "svg";
}
const fx = [...Sv, Wt, Ie], hx = (i) => fx.find(bv(i)), cy = () => ({
  translate: 0,
  scale: 1,
  origin: 0,
  originPoint: 0
}), Ea = () => ({
  x: cy(),
  y: cy()
}), fy = () => ({ min: 0, max: 0 }), Pt = () => ({
  x: fy(),
  y: fy()
}), Ul = /* @__PURE__ */ new WeakMap();
function Vo(i) {
  return i !== null && typeof i == "object" && typeof i.start == "function";
}
function Nl(i) {
  return typeof i == "string" || Array.isArray(i);
}
const vf = [
  "animate",
  "whileInView",
  "whileFocus",
  "whileHover",
  "whileTap",
  "whileDrag",
  "exit"
], bf = ["initial", ...vf];
function _o(i) {
  return Vo(i.animate) || bf.some((l) => Nl(i[l]));
}
function Cv(i) {
  return !!(_o(i) || i.variants);
}
function dx(i, l, s) {
  for (const o in l) {
    const c = l[o], d = s[o];
    if (te(c))
      i.addValue(o, c);
    else if (te(d))
      i.addValue(o, si(c, { owner: i }));
    else if (d !== c)
      if (i.hasValue(o)) {
        const f = i.getValue(o);
        f.liveStyle === !0 ? f.jump(c) : f.hasAnimated || f.set(c);
      } else {
        const f = i.getStaticValue(o);
        i.addValue(o, si(f !== void 0 ? f : c, { owner: i }));
      }
  }
  for (const o in s)
    l[o] === void 0 && i.removeValue(o);
  return l;
}
const jc = { current: null }, Rv = { current: !1 }, mx = typeof window < "u";
function px() {
  if (Rv.current = !0, !!mx)
    if (window.matchMedia) {
      const i = window.matchMedia("(prefers-reduced-motion)"), l = () => jc.current = i.matches;
      i.addEventListener("change", l), l();
    } else
      jc.current = !1;
}
const hy = [
  "AnimationStart",
  "AnimationComplete",
  "Update",
  "BeforeLayoutMeasure",
  "LayoutMeasure",
  "LayoutAnimationStart",
  "LayoutAnimationComplete"
];
let Mo = {};
function Ov(i) {
  Mo = i;
}
function yx() {
  return Mo;
}
class wv {
  /**
   * This method takes React props and returns found MotionValues. For example, HTML
   * MotionValues will be found within the style prop, whereas for Three.js within attribute arrays.
   *
   * This isn't an abstract method as it needs calling in the constructor, but it is
   * intended to be one.
   */
  scrapeMotionValuesFromProps(l, s, o) {
    return {};
  }
  constructor({ parent: l, props: s, presenceContext: o, reducedMotionConfig: c, skipAnimations: d, blockInitialAnimation: f, visualState: m }, y = {}) {
    this.current = null, this.children = /* @__PURE__ */ new Set(), this.isVariantNode = !1, this.isControllingVariants = !1, this.shouldReduceMotion = null, this.shouldSkipAnimations = !1, this.values = /* @__PURE__ */ new Map(), this.KeyframeResolver = of, this.features = {}, this.valueSubscriptions = /* @__PURE__ */ new Map(), this.prevMotionValues = {}, this.hasBeenMounted = !1, this.events = {}, this.propEventSubscriptions = {}, this.notifyUpdate = () => this.notify("Update", this.latestValues), this.render = () => {
      this.current && (this.triggerBuild(), this.renderInstance(this.current, this.renderState, this.props.style, this.projection));
    }, this.renderScheduledAt = 0, this.scheduleRender = () => {
      const O = de.now();
      this.renderScheduledAt < O && (this.renderScheduledAt = O, Ut.render(this.render, !1, !0));
    };
    const { latestValues: p, renderState: v } = m;
    this.latestValues = p, this.baseTarget = { ...p }, this.initialValues = s.initial ? { ...p } : {}, this.renderState = v, this.parent = l, this.props = s, this.presenceContext = o, this.depth = l ? l.depth + 1 : 0, this.reducedMotionConfig = c, this.skipAnimationsConfig = d, this.options = y, this.blockInitialAnimation = !!f, this.isControllingVariants = _o(s), this.isVariantNode = Cv(s), this.isVariantNode && (this.variantChildren = /* @__PURE__ */ new Set()), this.manuallyAnimateOnMount = !!(l && l.current);
    const { willChange: b, ...T } = this.scrapeMotionValuesFromProps(s, {}, this);
    for (const O in T) {
      const M = T[O];
      p[O] !== void 0 && te(M) && M.set(p[O]);
    }
  }
  mount(l) {
    if (this.hasBeenMounted)
      for (const s in this.initialValues)
        this.values.get(s)?.jump(this.initialValues[s]), this.latestValues[s] = this.initialValues[s];
    this.current = l, Ul.set(l, this), this.projection && !this.projection.instance && this.projection.mount(l), this.parent && this.isVariantNode && !this.isControllingVariants && (this.removeFromVariantTree = this.parent.addVariantChild(this)), this.values.forEach((s, o) => this.bindToMotionValue(o, s)), this.reducedMotionConfig === "never" ? this.shouldReduceMotion = !1 : this.reducedMotionConfig === "always" ? this.shouldReduceMotion = !0 : (Rv.current || px(), this.shouldReduceMotion = jc.current), this.shouldSkipAnimations = this.skipAnimationsConfig ?? !1, this.parent?.addChild(this), this.update(this.props, this.presenceContext), this.hasBeenMounted = !0;
  }
  unmount() {
    this.projection && this.projection.unmount(), li(this.notifyUpdate), li(this.render), this.valueSubscriptions.forEach((l) => l()), this.valueSubscriptions.clear(), this.removeFromVariantTree && this.removeFromVariantTree(), this.parent?.removeChild(this);
    for (const l in this.events)
      this.events[l].clear();
    for (const l in this.features) {
      const s = this.features[l];
      s && (s.unmount(), s.isMounted = !1);
    }
    this.current = null;
  }
  addChild(l) {
    this.children.add(l), this.enteringChildren ?? (this.enteringChildren = /* @__PURE__ */ new Set()), this.enteringChildren.add(l);
  }
  removeChild(l) {
    this.children.delete(l), this.enteringChildren && this.enteringChildren.delete(l);
  }
  bindToMotionValue(l, s) {
    if (this.valueSubscriptions.has(l) && this.valueSubscriptions.get(l)(), s.accelerate && hv.has(l) && this.current instanceof HTMLElement) {
      const { factory: f, keyframes: m, times: y, ease: p, duration: v } = s.accelerate, b = new cv({
        element: this.current,
        name: l,
        keyframes: m,
        times: y,
        ease: p,
        duration: /* @__PURE__ */ Ae(v)
      }), T = f(b);
      this.valueSubscriptions.set(l, () => {
        T(), b.cancel();
      });
      return;
    }
    const o = Oa.has(l);
    o && this.onBindTransform && this.onBindTransform();
    const c = s.on("change", (f) => {
      this.latestValues[l] = f, this.props.onUpdate && Ut.preRender(this.notifyUpdate), o && this.projection && (this.projection.isTransformDirty = !0), this.scheduleRender();
    });
    let d;
    typeof window < "u" && window.MotionCheckAppearSync && (d = window.MotionCheckAppearSync(this, l, s)), this.valueSubscriptions.set(l, () => {
      c(), d && d();
    });
  }
  sortNodePosition(l) {
    return !this.current || !this.sortInstanceNodePosition || this.type !== l.type ? 0 : this.sortInstanceNodePosition(this.current, l.current);
  }
  updateFeatures() {
    let l = "animation";
    for (l in Mo) {
      const s = Mo[l];
      if (!s)
        continue;
      const { isEnabled: o, Feature: c } = s;
      if (!this.features[l] && c && o(this.props) && (this.features[l] = new c(this)), this.features[l]) {
        const d = this.features[l];
        d.isMounted ? d.update() : (d.mount(), d.isMounted = !0);
      }
    }
  }
  triggerBuild() {
    this.build(this.renderState, this.latestValues, this.props);
  }
  /**
   * Measure the current viewport box with or without transforms.
   * Only measures axis-aligned boxes, rotate and skew must be manually
   * removed with a re-render to work.
   */
  measureViewportBox() {
    return this.current ? this.measureInstanceViewportBox(this.current, this.props) : Pt();
  }
  getStaticValue(l) {
    return this.latestValues[l];
  }
  setStaticValue(l, s) {
    this.latestValues[l] = s;
  }
  /**
   * Update the provided props. Ensure any newly-added motion values are
   * added to our map, old ones removed, and listeners updated.
   */
  update(l, s) {
    (l.transformTemplate || this.props.transformTemplate) && this.scheduleRender(), this.prevProps = this.props, this.props = l, this.prevPresenceContext = this.presenceContext, this.presenceContext = s;
    for (let o = 0; o < hy.length; o++) {
      const c = hy[o];
      this.propEventSubscriptions[c] && (this.propEventSubscriptions[c](), delete this.propEventSubscriptions[c]);
      const d = "on" + c, f = l[d];
      f && (this.propEventSubscriptions[c] = this.on(c, f));
    }
    this.prevMotionValues = dx(this, this.scrapeMotionValuesFromProps(l, this.prevProps || {}, this), this.prevMotionValues), this.handleChildMotionValue && this.handleChildMotionValue();
  }
  getProps() {
    return this.props;
  }
  /**
   * Returns the variant definition with a given name.
   */
  getVariant(l) {
    return this.props.variants ? this.props.variants[l] : void 0;
  }
  /**
   * Returns the defined default transition on this component.
   */
  getDefaultTransition() {
    return this.props.transition;
  }
  getTransformPagePoint() {
    return this.props.transformPagePoint;
  }
  getClosestVariantNode() {
    return this.isVariantNode ? this : this.parent ? this.parent.getClosestVariantNode() : void 0;
  }
  /**
   * Add a child visual element to our set of children.
   */
  addVariantChild(l) {
    const s = this.getClosestVariantNode();
    if (s)
      return s.variantChildren && s.variantChildren.add(l), () => s.variantChildren.delete(l);
  }
  /**
   * Add a motion value and bind it to this visual element.
   */
  addValue(l, s) {
    const o = this.values.get(l);
    s !== o && (o && this.removeValue(l), this.bindToMotionValue(l, s), this.values.set(l, s), this.latestValues[l] = s.get());
  }
  /**
   * Remove a motion value and unbind any active subscriptions.
   */
  removeValue(l) {
    this.values.delete(l);
    const s = this.valueSubscriptions.get(l);
    s && (s(), this.valueSubscriptions.delete(l)), delete this.latestValues[l], this.removeValueFromRenderState(l, this.renderState);
  }
  /**
   * Check whether we have a motion value for this key
   */
  hasValue(l) {
    return this.values.has(l);
  }
  getValue(l, s) {
    if (this.props.values && this.props.values[l])
      return this.props.values[l];
    let o = this.values.get(l);
    return o === void 0 && s !== void 0 && (o = si(s === null ? void 0 : s, { owner: this }), this.addValue(l, o)), o;
  }
  /**
   * If we're trying to animate to a previously unencountered value,
   * we need to check for it in our state and as a last resort read it
   * directly from the instance (which might have performance implications).
   */
  readValue(l, s) {
    let o = this.latestValues[l] !== void 0 || !this.current ? this.latestValues[l] : this.getBaseTargetFromProps(this.props, l) ?? this.readValueFromInstance(this.current, l, this.options);
    return o != null && (typeof o == "string" && (zg(o) || Rg(o)) ? o = parseFloat(o) : !hx(o) && Ie.test(s) && (o = Av(l, s)), this.setBaseTarget(l, te(o) ? o.get() : o)), te(o) ? o.get() : o;
  }
  /**
   * Set the base target to later animate back to. This is currently
   * only hydrated on creation and when we first read a value.
   */
  setBaseTarget(l, s) {
    this.baseTarget[l] = s;
  }
  /**
   * Find the base target for a value thats been removed from all animation
   * props.
   */
  getBaseTarget(l) {
    const { initial: s } = this.props;
    let o;
    if (typeof s == "string" || typeof s == "object") {
      const d = ff(this.props, s, this.presenceContext?.custom);
      d && (o = d[l]);
    }
    if (s && o !== void 0)
      return o;
    const c = this.getBaseTargetFromProps(this.props, l);
    return c !== void 0 && !te(c) ? c : this.initialValues[l] !== void 0 && o === void 0 ? void 0 : this.baseTarget[l];
  }
  on(l, s) {
    return this.events[l] || (this.events[l] = new Pc()), this.events[l].add(s);
  }
  notify(l, ...s) {
    this.events[l] && this.events[l].notify(...s);
  }
  scheduleRenderMicrotask() {
    yf.render(this.render);
  }
}
class Vv extends wv {
  constructor() {
    super(...arguments), this.KeyframeResolver = ZA;
  }
  sortInstanceNodePosition(l, s) {
    return l.compareDocumentPosition(s) & 2 ? 1 : -1;
  }
  getBaseTargetFromProps(l, s) {
    const o = l.style;
    return o ? o[s] : void 0;
  }
  removeValueFromRenderState(l, { vars: s, style: o }) {
    delete s[l], delete o[l];
  }
  handleChildMotionValue() {
    this.childSubscription && (this.childSubscription(), delete this.childSubscription);
    const { children: l } = this.props;
    te(l) && (this.childSubscription = l.on("change", (s) => {
      this.current && (this.current.textContent = `${s}`);
    }));
  }
}
class ri {
  constructor(l) {
    this.isMounted = !1, this.node = l;
  }
  update() {
  }
}
function _v({ top: i, left: l, right: s, bottom: o }) {
  return {
    x: { min: l, max: s },
    y: { min: i, max: o }
  };
}
function gx({ x: i, y: l }) {
  return { top: l.min, right: i.max, bottom: l.max, left: i.min };
}
function vx(i, l) {
  if (!l)
    return i;
  const s = l({ x: i.left, y: i.top }), o = l({ x: i.right, y: i.bottom });
  return {
    top: s.y,
    left: s.x,
    bottom: o.y,
    right: o.x
  };
}
function cc(i) {
  return i === void 0 || i === 1;
}
function Hc({ scale: i, scaleX: l, scaleY: s }) {
  return !cc(i) || !cc(l) || !cc(s);
}
function Oi(i) {
  return Hc(i) || Bv(i) || i.z || i.rotate || i.rotateX || i.rotateY || i.skewX || i.skewY;
}
function Bv(i) {
  return dy(i.x) || dy(i.y);
}
function dy(i) {
  return i && i !== "0%";
}
function Do(i, l, s) {
  const o = i - s, c = l * o;
  return s + c;
}
function my(i, l, s, o, c) {
  return c !== void 0 && (i = Do(i, c, o)), Do(i, s, o) + l;
}
function Gc(i, l = 0, s = 1, o, c) {
  i.min = my(i.min, l, s, o, c), i.max = my(i.max, l, s, o, c);
}
function Uv(i, { x: l, y: s }) {
  Gc(i.x, l.translate, l.scale, l.originPoint), Gc(i.y, s.translate, s.scale, s.originPoint);
}
const py = 0.999999999999, yy = 1.0000000000001;
function bx(i, l, s, o = !1) {
  const c = s.length;
  if (!c)
    return;
  l.x = l.y = 1;
  let d, f;
  for (let m = 0; m < c; m++) {
    d = s[m], f = d.projectionDelta;
    const { visualElement: y } = d.options;
    y && y.props.style && y.props.style.display === "contents" || (o && d.options.layoutScroll && d.scroll && d !== d.root && (on(i.x, -d.scroll.offset.x), on(i.y, -d.scroll.offset.y)), f && (l.x *= f.x.scale, l.y *= f.y.scale, Uv(i, f)), o && Oi(d.latestValues) && go(i, d.latestValues, d.layout?.layoutBox));
  }
  l.x < yy && l.x > py && (l.x = 1), l.y < yy && l.y > py && (l.y = 1);
}
function on(i, l) {
  i.min += l, i.max += l;
}
function gy(i, l, s, o, c = 0.5) {
  const d = _t(i.min, i.max, c);
  Gc(i, l, s, d, o);
}
function vy(i, l) {
  return typeof i == "string" ? parseFloat(i) / 100 * (l.max - l.min) : i;
}
function go(i, l, s) {
  const o = s ?? i;
  gy(i.x, vy(l.x, o.x), l.scaleX, l.scale, l.originX), gy(i.y, vy(l.y, o.y), l.scaleY, l.scale, l.originY);
}
function Nv(i, l) {
  return _v(vx(i.getBoundingClientRect(), l));
}
function Sx(i, l, s) {
  const o = Nv(i, s), { scroll: c } = l;
  return c && (on(o.x, c.offset.x), on(o.y, c.offset.y)), o;
}
const Tx = {
  x: "translateX",
  y: "translateY",
  z: "translateZ",
  transformPerspective: "perspective"
}, Ax = Ra.length;
function xx(i, l, s) {
  let o = "", c = !0;
  for (let f = 0; f < Ax; f++) {
    const m = Ra[f], y = i[m];
    if (y === void 0)
      continue;
    let p = !0;
    if (typeof y == "number")
      p = y === (m.startsWith("scale") ? 1 : 0);
    else {
      const v = parseFloat(y);
      p = m.startsWith("scale") ? v === 1 : v === 0;
    }
    if (!p || s) {
      const v = Lc(y, Eo[m]);
      if (!p) {
        c = !1;
        const b = Tx[m] || m;
        o += `${b}(${v}) `;
      }
      s && (l[m] = v);
    }
  }
  const d = i.pathRotation;
  return d && (c = !1, o += `rotate(${Lc(d, Eo.pathRotation)}) `), o = o.trim(), s ? o = s(l, c ? "" : o) : c && (o = "none"), o;
}
function Sf(i, l, s) {
  const { style: o, vars: c, transformOrigin: d } = i;
  let f = !1, m = !1;
  for (const y in l) {
    const p = l[y];
    if (Oa.has(y)) {
      f = !0;
      continue;
    } else if (Qg(y)) {
      c[y] = p;
      continue;
    } else {
      const v = Lc(p, Eo[y]);
      y.startsWith("origin") ? (m = !0, d[y] = v) : o[y] = v;
    }
  }
  if (l.transform || (f || s ? o.transform = xx(l, i.transform, s) : o.transform && (o.transform = "none")), m) {
    const { originX: y = "50%", originY: p = "50%", originZ: v = 0 } = d;
    o.transformOrigin = `${y} ${p} ${v}`;
  }
}
function Lv(i, { style: l, vars: s }, o, c) {
  const d = i.style;
  let f;
  for (f in l)
    d[f] = l[f];
  c?.applyProjectionStyles(d, o);
  for (f in s)
    d.setProperty(f, s[f]);
}
function by(i, l) {
  return l.max === l.min ? 0 : i / (l.max - l.min) * 100;
}
const zl = {
  correct: (i, l) => {
    if (!l.target)
      return i;
    if (typeof i == "string")
      if (nt.test(i))
        i = parseFloat(i);
      else
        return i;
    const s = by(i, l.target.x), o = by(i, l.target.y);
    return `${s}% ${o}%`;
  }
}, Ex = {
  correct: (i, { treeScale: l, projectionDelta: s }) => {
    const o = i, c = Ie.parse(i);
    if (c.length > 5)
      return o;
    const d = Ie.createTransformer(i), f = typeof c[0] != "number" ? 1 : 0, m = s.x.scale * l.x, y = s.y.scale * l.y;
    c[0 + f] /= m, c[1 + f] /= y;
    const p = _t(m, y, 0.5);
    return typeof c[2 + f] == "number" && (c[2 + f] /= p), typeof c[3 + f] == "number" && (c[3 + f] /= p), d(c);
  }
}, Yc = {
  borderRadius: {
    ...zl,
    applyTo: [...mf]
  },
  borderTopLeftRadius: zl,
  borderTopRightRadius: zl,
  borderBottomLeftRadius: zl,
  borderBottomRightRadius: zl,
  boxShadow: Ex
};
function jv(i, { layout: l, layoutId: s }) {
  return Oa.has(i) || i.startsWith("origin") || (l || s !== void 0) && (!!Yc[i] || i === "opacity");
}
function Tf(i, l, s) {
  const o = i.style, c = l?.style, d = {};
  if (!o)
    return d;
  for (const f in o)
    (te(o[f]) || c && te(c[f]) || jv(f, i) || s?.getValue(f)?.liveStyle !== void 0) && (d[f] = o[f]);
  return d;
}
function Mx(i) {
  return window.getComputedStyle(i);
}
class Hv extends Vv {
  constructor() {
    super(...arguments), this.type = "html", this.renderInstance = Lv;
  }
  mount(l) {
    Ro(!!l.style), super.mount(l);
  }
  readValueFromInstance(l, s) {
    if (Oa.has(s))
      return this.projection?.isProjecting ? Dc(s) : ZT(l, s);
    {
      const o = Mx(l), c = (Qg(s) ? o.getPropertyValue(s) : o[s]) || 0;
      return typeof c == "string" ? c.trim() : c;
    }
  }
  measureInstanceViewportBox(l, { transformPagePoint: s }) {
    return Nv(l, s);
  }
  build(l, s, o) {
    Sf(l, s, o.transformTemplate);
  }
  scrapeMotionValuesFromProps(l, s, o) {
    return Tf(l, s, o);
  }
}
function Dx(i, l) {
  return i in l;
}
class zx extends wv {
  constructor() {
    super(...arguments), this.type = "object";
  }
  readValueFromInstance(l, s) {
    if (Dx(s, l)) {
      const o = l[s];
      if (typeof o == "string" || typeof o == "number")
        return o;
    }
  }
  getBaseTargetFromProps() {
  }
  removeValueFromRenderState(l, s) {
    delete s.output[l];
  }
  measureInstanceViewportBox() {
    return Pt();
  }
  build(l, s) {
    Object.assign(l.output, s);
  }
  renderInstance(l, { output: s }) {
    Object.assign(l, s);
  }
  sortInstanceNodePosition() {
    return 0;
  }
}
const Cx = {
  offset: "stroke-dashoffset",
  array: "stroke-dasharray"
}, Rx = {
  offset: "strokeDashoffset",
  array: "strokeDasharray"
};
function Ox(i, l, s = 1, o = 0, c = !0) {
  i.pathLength = 1;
  const d = c ? Cx : Rx;
  i[d.offset] = `${-o}`, i[d.array] = `${l} ${s}`;
}
const wx = [
  "offsetDistance",
  "offsetPath",
  "offsetRotate",
  "offsetAnchor"
];
function Gv(i, {
  attrX: l,
  attrY: s,
  attrScale: o,
  pathLength: c,
  pathSpacing: d = 1,
  pathOffset: f = 0,
  // This is object creation, which we try to avoid per-frame.
  ...m
}, y, p, v) {
  if (Sf(i, m, p), y) {
    i.style.viewBox && (i.attrs.viewBox = i.style.viewBox);
    return;
  }
  i.attrs = i.style, i.style = {};
  const { attrs: b, style: T } = i;
  b.transform && (T.transform = b.transform, delete b.transform), (T.transform || b.transformOrigin) && (T.transformOrigin = b.transformOrigin ?? "50% 50%", delete b.transformOrigin), T.transform && (T.transformBox = v?.transformBox ?? "fill-box", delete b.transformBox);
  for (const O of wx)
    b[O] !== void 0 && (T[O] = b[O], delete b[O]);
  l !== void 0 && (b.x = l), s !== void 0 && (b.y = s), o !== void 0 && (b.scale = o), c !== void 0 && Ox(b, c, d, f, !1);
}
const Yv = /* @__PURE__ */ new Set([
  "baseFrequency",
  "diffuseConstant",
  "kernelMatrix",
  "kernelUnitLength",
  "keySplines",
  "keyTimes",
  "limitingConeAngle",
  "markerHeight",
  "markerWidth",
  "numOctaves",
  "targetX",
  "targetY",
  "surfaceScale",
  "specularConstant",
  "specularExponent",
  "stdDeviation",
  "tableValues",
  "viewBox",
  "gradientTransform",
  "pathLength",
  "startOffset",
  "textLength",
  "lengthAdjust"
]), qv = (i) => typeof i == "string" && i.toLowerCase() === "svg";
function Vx(i, l, s, o) {
  Lv(i, l, void 0, o);
  for (const c in l.attrs)
    i.setAttribute(Yv.has(c) ? c : hf(c), l.attrs[c]);
}
function Xv(i, l, s) {
  const o = Tf(i, l, s);
  for (const c in i)
    if (te(i[c]) || te(l[c])) {
      const d = Ra.indexOf(c) !== -1 ? "attr" + c.charAt(0).toUpperCase() + c.substring(1) : c;
      o[d] = i[c];
    }
  return o;
}
class kv extends Vv {
  constructor() {
    super(...arguments), this.type = "svg", this.isSVGTag = !1, this.measureInstanceViewportBox = Pt;
  }
  getBaseTargetFromProps(l, s) {
    return l[s];
  }
  readValueFromInstance(l, s) {
    if (Oa.has(s)) {
      const o = Tv(s);
      return o && o.default || 0;
    }
    return s = Yv.has(s) ? s : hf(s), l.getAttribute(s);
  }
  scrapeMotionValuesFromProps(l, s, o) {
    return Xv(l, s, o);
  }
  build(l, s, o) {
    Gv(l, s, this.isSVGTag, o.transformTemplate, o.style);
  }
  renderInstance(l, s, o, c) {
    Vx(l, s, o, c);
  }
  mount(l) {
    this.isSVGTag = qv(l.tagName), super.mount(l);
  }
}
const _x = bf.length;
function Qv(i) {
  if (!i)
    return;
  if (!i.isControllingVariants) {
    const s = i.parent ? Qv(i.parent) || {} : {};
    return i.props.initial !== void 0 && (s.initial = i.props.initial), s;
  }
  const l = {};
  for (let s = 0; s < _x; s++) {
    const o = bf[s], c = i.props[o];
    (Nl(c) || c === !1) && (l[o] = c);
  }
  return l;
}
function Zv(i, l) {
  if (!Array.isArray(l))
    return !1;
  const s = l.length;
  if (s !== i.length)
    return !1;
  for (let o = 0; o < s; o++)
    if (l[o] !== i[o])
      return !1;
  return !0;
}
const Bx = [...vf].reverse(), Ux = vf.length;
function Nx(i) {
  return (l) => Promise.all(l.map(({ animation: s, options: o }) => UA(i, s, o)));
}
function Lx(i) {
  let l = Nx(i), s = Sy(), o = !0, c = !1;
  const d = (p) => (v, b) => {
    const T = Bi(i, b, p === "exit" ? i.presenceContext?.custom : void 0);
    if (T) {
      const { transition: O, transitionEnd: M, ...V } = T;
      v = { ...v, ...V, ...M };
    }
    return v;
  };
  function f(p) {
    l = p(i);
  }
  function m(p) {
    const { props: v } = i, b = Qv(i.parent) || {}, T = [], O = /* @__PURE__ */ new Set();
    let M = {}, V = 1 / 0;
    for (let _ = 0; _ < Ux; _++) {
      const G = Bx[_], Y = s[G], q = v[G] !== void 0 ? v[G] : b[G], F = Nl(q), st = G === p ? Y.isActive : null;
      st === !1 && (V = _);
      let Q = q === b[G] && q !== v[G] && F;
      if (Q && (o || c) && i.manuallyAnimateOnMount && (Q = !1), Y.protectedKeys = { ...M }, // If it isn't active and hasn't *just* been set as inactive
      !Y.isActive && st === null || // If we didn't and don't have any defined prop for this animation type
      !q && !Y.prevProp || // Or if the prop doesn't define an animation
      Vo(q) || typeof q == "boolean")
        continue;
      if (G === "exit" && Y.isActive && st !== !0) {
        Y.prevResolvedValues && (M = {
          ...M,
          ...Y.prevResolvedValues
        });
        continue;
      }
      const U = jx(Y.prevProp, q);
      let $ = U || // If we're making this variant active, we want to always make it active
      G === p && Y.isActive && !Q && F || // If we removed a higher-priority variant (i is in reverse order)
      _ > V && F, I = !1;
      const ct = Array.isArray(q) ? q : [q];
      let gt = ct.reduce(d(G), {});
      st === !1 && (gt = {});
      const { prevResolvedValues: jt = {} } = Y, Rt = {
        ...jt,
        ...gt
      }, Mt = (Z) => {
        $ = !0, O.has(Z) && (I = !0, O.delete(Z)), Y.needsAnimating[Z] = !0;
        const ut = i.getValue(Z);
        ut && (ut.liveStyle = !1);
      };
      for (const Z in Rt) {
        const ut = gt[Z], k = jt[Z];
        if (M.hasOwnProperty(Z))
          continue;
        let A = !1;
        Vc(ut) && Vc(k) ? A = !Zv(ut, k) || U : A = ut !== k, A ? ut != null ? Mt(Z) : O.add(Z) : ut !== void 0 && O.has(Z) ? Mt(Z) : Y.protectedKeys[Z] = !0;
      }
      Y.prevProp = q, Y.prevResolvedValues = gt, Y.isActive && (M = { ...M, ...gt }), (o || c) && i.blockInitialAnimation && ($ = !1);
      const R = Q && U;
      $ && (!R || I) && T.push(...ct.map((Z) => {
        const ut = { type: G };
        if (typeof Z == "string" && (o || c) && !R && i.manuallyAnimateOnMount && i.parent) {
          const { parent: k } = i, A = Bi(k, Z);
          if (k.enteringChildren && A) {
            const { delayChildren: N } = A.transition || {};
            ut.delay = dv(k.enteringChildren, i, N);
          }
        }
        return {
          animation: Z,
          options: ut
        };
      }));
    }
    if (O.size) {
      const _ = {};
      if (typeof v.initial != "boolean") {
        const G = Bi(i, Array.isArray(v.initial) ? v.initial[0] : v.initial);
        G && G.transition && (_.transition = G.transition);
      }
      O.forEach((G) => {
        const Y = i.getBaseTarget(G), q = i.getValue(G);
        q && (q.liveStyle = !0), _[G] = Y ?? null;
      }), T.push({ animation: _ });
    }
    let j = !!T.length;
    return o && (v.initial === !1 || v.initial === v.animate) && !i.manuallyAnimateOnMount && (j = !1), o = !1, c = !1, j ? l(T) : Promise.resolve();
  }
  function y(p, v) {
    if (s[p].isActive === v)
      return Promise.resolve();
    i.variantChildren?.forEach((T) => T.animationState?.setActive(p, v)), s[p].isActive = v;
    const b = m(p);
    for (const T in s)
      s[T].protectedKeys = {};
    return b;
  }
  return {
    animateChanges: m,
    setActive: y,
    setAnimateFunction: f,
    getState: () => s,
    reset: () => {
      s = Sy(), c = !0;
    }
  };
}
function jx(i, l) {
  return typeof l == "string" ? l !== i : Array.isArray(l) ? !Zv(l, i) : !1;
}
function Ri(i = !1) {
  return {
    isActive: i,
    protectedKeys: {},
    needsAnimating: {},
    prevResolvedValues: {}
  };
}
function Sy() {
  return {
    animate: Ri(!0),
    whileInView: Ri(),
    whileHover: Ri(),
    whileTap: Ri(),
    whileDrag: Ri(),
    whileFocus: Ri(),
    exit: Ri()
  };
}
function qc(i, l) {
  i.min = l.min, i.max = l.max;
}
function We(i, l) {
  qc(i.x, l.x), qc(i.y, l.y);
}
function Ty(i, l) {
  i.translate = l.translate, i.scale = l.scale, i.originPoint = l.originPoint, i.origin = l.origin;
}
const Kv = 1e-4, Hx = 1 - Kv, Gx = 1 + Kv, Jv = 0.01, Yx = 0 - Jv, qx = 0 + Jv;
function me(i) {
  return i.max - i.min;
}
function Xx(i, l, s) {
  return Math.abs(i - l) <= s;
}
function Ay(i, l, s, o = 0.5) {
  i.origin = o, i.originPoint = _t(l.min, l.max, i.origin), i.scale = me(s) / me(l), i.translate = _t(s.min, s.max, i.origin) - i.originPoint, (i.scale >= Hx && i.scale <= Gx || isNaN(i.scale)) && (i.scale = 1), (i.translate >= Yx && i.translate <= qx || isNaN(i.translate)) && (i.translate = 0);
}
function wl(i, l, s, o) {
  Ay(i.x, l.x, s.x, o ? o.originX : void 0), Ay(i.y, l.y, s.y, o ? o.originY : void 0);
}
function xy(i, l, s, o = 0) {
  const c = o ? _t(s.min, s.max, o) : s.min;
  i.min = c + l.min, i.max = i.min + me(l);
}
function kx(i, l, s, o) {
  xy(i.x, l.x, s.x, o?.x), xy(i.y, l.y, s.y, o?.y);
}
function Ey(i, l, s, o = 0) {
  const c = o ? _t(s.min, s.max, o) : s.min;
  i.min = l.min - c, i.max = i.min + me(l);
}
function zo(i, l, s, o) {
  Ey(i.x, l.x, s.x, o?.x), Ey(i.y, l.y, s.y, o?.y);
}
function My(i, l, s, o, c) {
  return i -= l, i = Do(i, 1 / s, o), c !== void 0 && (i = Do(i, 1 / c, o)), i;
}
function Qx(i, l = 0, s = 1, o = 0.5, c, d = i, f = i) {
  if (rn.test(l) && (l = parseFloat(l), l = _t(f.min, f.max, l / 100) - f.min), typeof l != "number")
    return;
  let m = _t(d.min, d.max, o);
  i === d && (m -= l), i.min = My(i.min, l, s, m, c), i.max = My(i.max, l, s, m, c);
}
function Dy(i, l, [s, o, c], d, f) {
  Qx(i, l[s], l[o], l[c], l.scale, d, f);
}
const Zx = ["x", "scaleX", "originX"], Kx = ["y", "scaleY", "originY"];
function zy(i, l, s, o) {
  Dy(i.x, l, Zx, s ? s.x : void 0, o ? o.x : void 0), Dy(i.y, l, Kx, s ? s.y : void 0, o ? o.y : void 0);
}
function Cy(i) {
  return i.translate === 0 && i.scale === 1;
}
function Fv(i) {
  return Cy(i.x) && Cy(i.y);
}
function Ry(i, l) {
  return i.min === l.min && i.max === l.max;
}
function Jx(i, l) {
  return Ry(i.x, l.x) && Ry(i.y, l.y);
}
function Oy(i, l) {
  return Math.round(i.min) === Math.round(l.min) && Math.round(i.max) === Math.round(l.max);
}
function Pv(i, l) {
  return Oy(i.x, l.x) && Oy(i.y, l.y);
}
function wy(i) {
  return me(i.x) / me(i.y);
}
function Vy(i, l) {
  return i.translate === l.translate && i.scale === l.scale && i.originPoint === l.originPoint;
}
function sn(i) {
  return [i("x"), i("y")];
}
function Fx(i, l, s) {
  let o = "";
  const c = i.x.translate / l.x, d = i.y.translate / l.y, f = s?.z || 0;
  if ((c || d || f) && (o = `translate3d(${c}px, ${d}px, ${f}px) `), (l.x !== 1 || l.y !== 1) && (o += `scale(${1 / l.x}, ${1 / l.y}) `), s) {
    const { transformPerspective: p, rotate: v, pathRotation: b, rotateX: T, rotateY: O, skewX: M, skewY: V } = s;
    p && (o = `perspective(${p}px) ${o}`), v && (o += `rotate(${v}deg) `), b && (o += `rotate(${b}deg) `), T && (o += `rotateX(${T}deg) `), O && (o += `rotateY(${O}deg) `), M && (o += `skewX(${M}deg) `), V && (o += `skewY(${V}deg) `);
  }
  const m = i.x.scale * l.x, y = i.y.scale * l.y;
  return (m !== 1 || y !== 1) && (o += `scale(${m}, ${y})`), o || "none";
}
const Px = mf.length, _y = (i) => typeof i == "string" ? parseFloat(i) : i, By = (i) => typeof i == "number" || nt.test(i);
function Wx(i, l, s, o, c, d) {
  c ? (i.opacity = _t(0, s.opacity ?? 1, $x(o)), i.opacityExit = _t(l.opacity ?? 1, 0, Ix(o))) : d && (i.opacity = _t(l.opacity ?? 1, s.opacity ?? 1, o));
  for (let f = 0; f < Px; f++) {
    const m = mf[f];
    let y = Uy(l, m), p = Uy(s, m);
    if (y === void 0 && p === void 0)
      continue;
    y || (y = 0), p || (p = 0), y === 0 || p === 0 || By(y) === By(p) ? (i[m] = Math.max(_t(_y(y), _y(p), o), 0), (rn.test(p) || rn.test(y)) && (i[m] += "%")) : i[m] = p;
  }
  (l.rotate || s.rotate) && (i.rotate = _t(l.rotate || 0, s.rotate || 0, o));
}
function Uy(i, l) {
  return i[l] !== void 0 ? i[l] : i.borderRadius;
}
const $x = /* @__PURE__ */ Wv(0, 0.5, Lg), Ix = /* @__PURE__ */ Wv(0.5, 0.95, Ze);
function Wv(i, l, s) {
  return (o) => o < i ? 0 : o > l ? 1 : s(/* @__PURE__ */ Da(i, l, o));
}
function $v(i, l, s) {
  const o = te(i) ? i : si(i);
  return o.start(cf("", o, l, s)), o.animation;
}
function Ll(i, l, s, o = { passive: !0 }) {
  return i.addEventListener(l, s, o), () => i.removeEventListener(l, s, o);
}
const tE = (i, l) => i.depth - l.depth;
class eE {
  constructor() {
    this.children = [], this.isDirty = !1;
  }
  add(l) {
    Fc(this.children, l), this.isDirty = !0;
  }
  remove(l) {
    Ma(this.children, l), this.isDirty = !0;
  }
  forEach(l) {
    this.isDirty && this.children.sort(tE), this.isDirty = !1, this.children.forEach(l);
  }
}
function nE(i, l) {
  const s = de.now(), o = ({ timestamp: c }) => {
    const d = c - s;
    d >= l && (li(o), i(d - l));
  };
  return Ut.setup(o, !0), () => li(o);
}
function vo(i) {
  return te(i) ? i.get() : i;
}
class iE {
  constructor() {
    this.members = [];
  }
  add(l) {
    Fc(this.members, l);
    for (let s = this.members.length - 1; s >= 0; s--) {
      const o = this.members[s];
      if (o === l || o === this.lead || o === this.prevLead)
        continue;
      const c = o.instance;
      (!c || c.isConnected === !1) && !o.snapshot && (Ma(this.members, o), o.unmount());
    }
    l.scheduleRender();
  }
  remove(l) {
    if (Ma(this.members, l), l === this.prevLead && (this.prevLead = void 0), l === this.lead) {
      const s = this.members[this.members.length - 1];
      s && this.promote(s);
    }
  }
  relegate(l) {
    for (let s = this.members.indexOf(l) - 1; s >= 0; s--) {
      const o = this.members[s];
      if (o.isPresent !== !1 && o.instance?.isConnected !== !1)
        return this.promote(o), !0;
    }
    return !1;
  }
  promote(l, s) {
    const o = this.lead;
    if (l !== o && (this.prevLead = o, this.lead = l, l.show(), o)) {
      o.updateSnapshot(), l.scheduleRender();
      const { layoutDependency: c } = o.options, { layoutDependency: d } = l.options;
      (c === void 0 || c !== d) && (l.resumeFrom = o, s && (o.preserveOpacity = !0), o.snapshot && (l.snapshot = o.snapshot, l.snapshot.latestValues = o.animationValues || o.latestValues), l.root?.isUpdating && (l.isLayoutDirty = !0)), l.options.crossfade === !1 && o.hide();
    }
  }
  exitAnimationComplete() {
    this.members.forEach((l) => {
      l.options.onExitComplete?.(), l.resumingFrom?.options.onExitComplete?.();
    });
  }
  scheduleRender() {
    this.members.forEach((l) => l.instance && l.scheduleRender(!1));
  }
  removeLeadSnapshot() {
    this.lead?.snapshot && (this.lead.snapshot = void 0);
  }
}
const bo = {
  /**
   * Global flag as to whether the tree has animated since the last time
   * we resized the window
   */
  hasAnimatedSinceResize: !0,
  /**
   * We set this to true once, on the first update. Any nodes added to the tree beyond that
   * update will be given a `data-projection-id` attribute.
   */
  hasEverUpdated: !1
}, fc = ["", "X", "Y", "Z"], aE = 1e3;
let lE = 0;
function hc(i, l, s, o) {
  const { latestValues: c } = l;
  c[i] && (s[i] = c[i], l.setStaticValue(i, 0), o && (o[i] = 0));
}
function Iv(i) {
  if (i.hasCheckedOptimisedAppear = !0, i.root === i)
    return;
  const { visualElement: l } = i.options;
  if (!l)
    return;
  const s = vv(l);
  if (window.MotionHasOptimisedAnimation(s, "transform")) {
    const { layout: c, layoutId: d } = i.options;
    window.MotionCancelOptimisedAnimation(s, "transform", Ut, !(c || d));
  }
  const { parent: o } = i;
  o && !o.hasCheckedOptimisedAppear && Iv(o);
}
function t0({ attachResizeListener: i, defaultParent: l, measureScroll: s, checkIsScrollRoot: o, resetTransform: c }) {
  return class {
    constructor(f = {}, m = l?.()) {
      this.id = lE++, this.animationId = 0, this.animationCommitId = 0, this.children = /* @__PURE__ */ new Set(), this.options = {}, this.isTreeAnimating = !1, this.isAnimationBlocked = !1, this.isLayoutDirty = !1, this.isProjectionDirty = !1, this.isSharedProjectionDirty = !1, this.isTransformDirty = !1, this.updateManuallyBlocked = !1, this.updateBlockedByResize = !1, this.isUpdating = !1, this.isSVG = !1, this.needsReset = !1, this.shouldResetTransform = !1, this.hasCheckedOptimisedAppear = !1, this.treeScale = { x: 1, y: 1 }, this.eventHandlers = /* @__PURE__ */ new Map(), this.hasTreeAnimated = !1, this.layoutVersion = 0, this.updateScheduled = !1, this.scheduleUpdate = () => this.update(), this.projectionUpdateScheduled = !1, this.checkUpdateFailed = () => {
        this.isUpdating && (this.isUpdating = !1, this.clearAllSnapshots());
      }, this.updateProjection = () => {
        this.projectionUpdateScheduled = !1, this.nodes.forEach(rE), this.nodes.forEach(mE), this.nodes.forEach(pE), this.nodes.forEach(uE);
      }, this.resolvedRelativeTargetAt = 0, this.linkedParentVersion = 0, this.hasProjected = !1, this.isVisible = !0, this.animationProgress = 0, this.sharedNodes = /* @__PURE__ */ new Map(), this.latestValues = f, this.root = m ? m.root || m : this, this.path = m ? [...m.path, m] : [], this.parent = m, this.depth = m ? m.depth + 1 : 0;
      for (let y = 0; y < this.path.length; y++)
        this.path[y].shouldResetTransform = !0;
      this.root === this && (this.nodes = new eE());
    }
    addEventListener(f, m) {
      return this.eventHandlers.has(f) || this.eventHandlers.set(f, new Pc()), this.eventHandlers.get(f).add(m);
    }
    notifyListeners(f, ...m) {
      const y = this.eventHandlers.get(f);
      y && y.notify(...m);
    }
    hasListeners(f) {
      return this.eventHandlers.has(f);
    }
    /**
     * Lifecycles
     */
    mount(f) {
      if (this.instance)
        return;
      this.isSVG = wo(f) && !zv(f), this.instance = f;
      const { layoutId: m, layout: y, visualElement: p } = this.options;
      if (p && !p.current && p.mount(f), this.root.nodes.add(this), this.parent && this.parent.children.add(this), this.root.hasTreeAnimated && (y || m) && (this.isLayoutDirty = !0), i) {
        let v, b = 0;
        const T = () => this.root.updateBlockedByResize = !1;
        Ut.read(() => {
          b = window.innerWidth;
        }), i(f, () => {
          const O = window.innerWidth;
          O !== b && (b = O, this.root.updateBlockedByResize = !0, v && v(), v = nE(T, 250), bo.hasAnimatedSinceResize && (bo.hasAnimatedSinceResize = !1, this.nodes.forEach(jy)));
        });
      }
      m && this.root.registerSharedNode(m, this), this.options.animate !== !1 && p && (m || y) && this.addEventListener("didUpdate", ({ delta: v, hasLayoutChanged: b, hasRelativeLayoutChanged: T, layout: O }) => {
        if (this.isTreeAnimationBlocked()) {
          this.target = void 0, this.relativeTarget = void 0;
          return;
        }
        const M = this.options.transition || p.getDefaultTransition() || SE, { onLayoutAnimationStart: V, onLayoutAnimationComplete: j } = p.getProps(), _ = !this.targetLayout || !Pv(this.targetLayout, O), G = !b && T;
        if (this.options.layoutRoot || this.resumeFrom || G || b && (_ || !this.currentAnimation)) {
          this.resumeFrom && (this.resumingFrom = this.resumeFrom, this.resumingFrom.resumingFrom = void 0);
          const Y = {
            ...uf(M, "layout"),
            onPlay: V,
            onComplete: j
          };
          (p.shouldReduceMotion || this.options.layoutRoot) && (Y.delay = 0, Y.type = !1), this.startAnimation(Y), this.setAnimationOrigin(v, G, Y.path);
        } else
          b || jy(this), this.isLead() && this.options.onExitComplete && this.options.onExitComplete();
        this.targetLayout = O;
      });
    }
    unmount() {
      this.options.layoutId && this.willUpdate(), this.root.nodes.remove(this);
      const f = this.getStack();
      f && f.remove(this), this.parent && this.parent.children.delete(this), this.instance = void 0, this.eventHandlers.clear(), li(this.updateProjection);
    }
    // only on the root
    blockUpdate() {
      this.updateManuallyBlocked = !0;
    }
    unblockUpdate() {
      this.updateManuallyBlocked = !1;
    }
    isUpdateBlocked() {
      return this.updateManuallyBlocked || this.updateBlockedByResize;
    }
    isTreeAnimationBlocked() {
      return this.isAnimationBlocked || this.parent && this.parent.isTreeAnimationBlocked() || !1;
    }
    // Note: currently only running on root node
    startUpdate() {
      this.isUpdateBlocked() || (this.isUpdating = !0, this.nodes && this.nodes.forEach(yE), this.animationId++);
    }
    getTransformTemplate() {
      const { visualElement: f } = this.options;
      return f && f.getProps().transformTemplate;
    }
    willUpdate(f = !0) {
      if (this.root.hasTreeAnimated = !0, this.root.isUpdateBlocked()) {
        this.options.onExitComplete && this.options.onExitComplete();
        return;
      }
      if (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear && Iv(this), !this.root.isUpdating && this.root.startUpdate(), this.isLayoutDirty)
        return;
      this.isLayoutDirty = !0;
      for (let v = 0; v < this.path.length; v++) {
        const b = this.path[v];
        b.shouldResetTransform = !0, (typeof b.latestValues.x == "string" || typeof b.latestValues.y == "string") && (b.isLayoutDirty = !0), b.updateScroll("snapshot"), b.options.layoutRoot && b.willUpdate(!1);
      }
      const { layoutId: m, layout: y } = this.options;
      if (m === void 0 && !y)
        return;
      const p = this.getTransformTemplate();
      this.prevTransformTemplateValue = p ? p(this.latestValues, "") : void 0, this.updateSnapshot(), f && this.notifyListeners("willUpdate");
    }
    update() {
      if (this.updateScheduled = !1, this.isUpdateBlocked()) {
        const y = this.updateBlockedByResize;
        this.unblockUpdate(), this.updateBlockedByResize = !1, this.clearAllSnapshots(), y && this.nodes.forEach(fE), this.nodes.forEach(Ny);
        return;
      }
      if (this.animationId <= this.animationCommitId) {
        this.nodes.forEach(Ly);
        return;
      }
      this.animationCommitId = this.animationId, this.isUpdating ? (this.isUpdating = !1, this.nodes.forEach(hE), this.nodes.forEach(dE), this.nodes.forEach(sE), this.nodes.forEach(oE)) : this.nodes.forEach(Ly), this.clearAllSnapshots();
      const m = de.now();
      ue.delta = un(0, 1e3 / 60, m - ue.timestamp), ue.timestamp = m, ue.isProcessing = !0, ic.update.process(ue), ic.preRender.process(ue), ic.render.process(ue), ue.isProcessing = !1;
    }
    didUpdate() {
      this.updateScheduled || (this.updateScheduled = !0, yf.read(this.scheduleUpdate));
    }
    clearAllSnapshots() {
      this.nodes.forEach(cE), this.sharedNodes.forEach(gE);
    }
    scheduleUpdateProjection() {
      this.projectionUpdateScheduled || (this.projectionUpdateScheduled = !0, Ut.preRender(this.updateProjection, !1, !0));
    }
    scheduleCheckAfterUnmount() {
      Ut.postRender(() => {
        this.isLayoutDirty ? this.root.didUpdate() : this.root.checkUpdateFailed();
      });
    }
    /**
     * Update measurements
     */
    updateSnapshot() {
      this.snapshot || !this.instance || (this.snapshot = this.measure(), this.snapshot && !me(this.snapshot.measuredBox.x) && !me(this.snapshot.measuredBox.y) && (this.snapshot = void 0));
    }
    updateLayout() {
      if (!this.instance || (this.updateScroll(), !(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty))
        return;
      if (this.resumeFrom && !this.resumeFrom.instance)
        for (let y = 0; y < this.path.length; y++)
          this.path[y].updateScroll();
      const f = this.layout;
      this.layout = this.measure(!1), this.layoutVersion++, this.layoutCorrected || (this.layoutCorrected = Pt()), this.isLayoutDirty = !1, this.projectionDelta = void 0, this.notifyListeners("measure", this.layout.layoutBox);
      const { visualElement: m } = this.options;
      m && m.notify("LayoutMeasure", this.layout.layoutBox, f ? f.layoutBox : void 0);
    }
    updateScroll(f = "measure") {
      let m = !!(this.options.layoutScroll && this.instance);
      if (this.scroll && this.scroll.animationId === this.root.animationId && this.scroll.phase === f && (m = !1), m && this.instance) {
        const y = o(this.instance);
        this.scroll = {
          animationId: this.root.animationId,
          phase: f,
          isRoot: y,
          offset: s(this.instance),
          wasRoot: this.scroll ? this.scroll.isRoot : y
        };
      }
    }
    resetTransform() {
      if (!c)
        return;
      const f = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout, m = this.projectionDelta && !Fv(this.projectionDelta), y = this.getTransformTemplate(), p = y ? y(this.latestValues, "") : void 0, v = p !== this.prevTransformTemplateValue;
      f && this.instance && (m || Oi(this.latestValues) || v) && (c(this.instance, p), this.shouldResetTransform = !1, this.scheduleRender());
    }
    measure(f = !0) {
      const m = this.measurePageBox();
      let y = this.removeElementScroll(m);
      return f && (y = this.removeTransform(y)), TE(y), {
        animationId: this.root.animationId,
        measuredBox: m,
        layoutBox: y,
        latestValues: {},
        source: this.id
      };
    }
    measurePageBox() {
      const { visualElement: f } = this.options;
      if (!f)
        return Pt();
      const m = f.measureViewportBox();
      if (!(this.scroll?.wasRoot || this.path.some(AE))) {
        const { scroll: p } = this.root;
        p && (on(m.x, p.offset.x), on(m.y, p.offset.y));
      }
      return m;
    }
    removeElementScroll(f) {
      const m = Pt();
      if (We(m, f), this.scroll?.wasRoot)
        return m;
      for (let y = 0; y < this.path.length; y++) {
        const p = this.path[y], { scroll: v, options: b } = p;
        p !== this.root && v && b.layoutScroll && (v.wasRoot && We(m, f), on(m.x, v.offset.x), on(m.y, v.offset.y));
      }
      return m;
    }
    applyTransform(f, m = !1, y) {
      const p = y || Pt();
      We(p, f);
      for (let v = 0; v < this.path.length; v++) {
        const b = this.path[v];
        !m && b.options.layoutScroll && b.scroll && b !== b.root && (on(p.x, -b.scroll.offset.x), on(p.y, -b.scroll.offset.y)), Oi(b.latestValues) && go(p, b.latestValues, b.layout?.layoutBox);
      }
      return Oi(this.latestValues) && go(p, this.latestValues, this.layout?.layoutBox), p;
    }
    removeTransform(f) {
      const m = Pt();
      We(m, f);
      for (let y = 0; y < this.path.length; y++) {
        const p = this.path[y];
        if (!Oi(p.latestValues))
          continue;
        let v;
        p.instance && (Hc(p.latestValues) && p.updateSnapshot(), v = Pt(), We(v, p.measurePageBox())), zy(m, p.latestValues, p.snapshot?.layoutBox, v);
      }
      return Oi(this.latestValues) && zy(m, this.latestValues), m;
    }
    setTargetDelta(f) {
      this.targetDelta = f, this.root.scheduleUpdateProjection(), this.isProjectionDirty = !0;
    }
    setOptions(f) {
      this.options = {
        ...this.options,
        ...f,
        crossfade: f.crossfade !== void 0 ? f.crossfade : !0
      };
    }
    clearMeasurements() {
      this.scroll = void 0, this.layout = void 0, this.snapshot = void 0, this.prevTransformTemplateValue = void 0, this.targetDelta = void 0, this.target = void 0, this.isLayoutDirty = !1;
    }
    forceRelativeParentToResolveTarget() {
      this.relativeParent && this.relativeParent.resolvedRelativeTargetAt !== ue.timestamp && this.relativeParent.resolveTargetDelta(!0);
    }
    resolveTargetDelta(f = !1) {
      const m = this.getLead();
      this.isProjectionDirty || (this.isProjectionDirty = m.isProjectionDirty), this.isTransformDirty || (this.isTransformDirty = m.isTransformDirty), this.isSharedProjectionDirty || (this.isSharedProjectionDirty = m.isSharedProjectionDirty);
      const y = !!this.resumingFrom || this !== m;
      if (!(f || y && this.isSharedProjectionDirty || this.isProjectionDirty || this.parent?.isProjectionDirty || this.attemptToResolveRelativeTarget || this.root.updateBlockedByResize))
        return;
      const { layout: v, layoutId: b } = this.options;
      if (!this.layout || !(v || b))
        return;
      this.resolvedRelativeTargetAt = ue.timestamp;
      const T = this.getClosestProjectingParent();
      T && this.linkedParentVersion !== T.layoutVersion && !T.options.layoutRoot && this.removeRelativeTarget(), !this.targetDelta && !this.relativeTarget && (this.options.layoutAnchor !== !1 && T && T.layout ? this.createRelativeTarget(T, this.layout.layoutBox, T.layout.layoutBox) : this.removeRelativeTarget()), !(!this.relativeTarget && !this.targetDelta) && (this.target || (this.target = Pt(), this.targetWithTransforms = Pt()), this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target ? (this.forceRelativeParentToResolveTarget(), kx(this.target, this.relativeTarget, this.relativeParent.target, this.options.layoutAnchor || void 0)) : this.targetDelta ? (this.resumingFrom ? this.applyTransform(this.layout.layoutBox, !1, this.target) : We(this.target, this.layout.layoutBox), Uv(this.target, this.targetDelta)) : We(this.target, this.layout.layoutBox), this.attemptToResolveRelativeTarget && (this.attemptToResolveRelativeTarget = !1, this.options.layoutAnchor !== !1 && T && !!T.resumingFrom == !!this.resumingFrom && !T.options.layoutScroll && T.target && this.animationProgress !== 1 ? this.createRelativeTarget(T, this.target, T.target) : this.relativeParent = this.relativeTarget = void 0));
    }
    getClosestProjectingParent() {
      if (!(!this.parent || Hc(this.parent.latestValues) || Bv(this.parent.latestValues)))
        return this.parent.isProjecting() ? this.parent : this.parent.getClosestProjectingParent();
    }
    isProjecting() {
      return !!((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout);
    }
    createRelativeTarget(f, m, y) {
      this.relativeParent = f, this.linkedParentVersion = f.layoutVersion, this.forceRelativeParentToResolveTarget(), this.relativeTarget = Pt(), this.relativeTargetOrigin = Pt(), zo(this.relativeTargetOrigin, m, y, this.options.layoutAnchor || void 0), We(this.relativeTarget, this.relativeTargetOrigin);
    }
    removeRelativeTarget() {
      this.relativeParent = this.relativeTarget = void 0;
    }
    calcProjection() {
      const f = this.getLead(), m = !!this.resumingFrom || this !== f;
      let y = !0;
      if ((this.isProjectionDirty || this.parent?.isProjectionDirty) && (y = !1), m && (this.isSharedProjectionDirty || this.isTransformDirty) && (y = !1), this.resolvedRelativeTargetAt === ue.timestamp && (y = !1), y)
        return;
      const { layout: p, layoutId: v } = this.options;
      if (this.isTreeAnimating = !!(this.parent && this.parent.isTreeAnimating || this.currentAnimation || this.pendingAnimation), this.isTreeAnimating || (this.targetDelta = this.relativeTarget = void 0), !this.layout || !(p || v))
        return;
      We(this.layoutCorrected, this.layout.layoutBox);
      const b = this.treeScale.x, T = this.treeScale.y;
      bx(this.layoutCorrected, this.treeScale, this.path, m), f.layout && !f.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1) && (f.target = f.layout.layoutBox, f.targetWithTransforms = Pt());
      const { target: O } = f;
      if (!O) {
        this.prevProjectionDelta && (this.createProjectionDeltas(), this.scheduleRender());
        return;
      }
      !this.projectionDelta || !this.prevProjectionDelta ? this.createProjectionDeltas() : (Ty(this.prevProjectionDelta.x, this.projectionDelta.x), Ty(this.prevProjectionDelta.y, this.projectionDelta.y)), wl(this.projectionDelta, this.layoutCorrected, O, this.latestValues), (this.treeScale.x !== b || this.treeScale.y !== T || !Vy(this.projectionDelta.x, this.prevProjectionDelta.x) || !Vy(this.projectionDelta.y, this.prevProjectionDelta.y)) && (this.hasProjected = !0, this.scheduleRender(), this.notifyListeners("projectionUpdate", O));
    }
    hide() {
      this.isVisible = !1;
    }
    show() {
      this.isVisible = !0;
    }
    scheduleRender(f = !0) {
      if (this.options.visualElement?.scheduleRender(), f) {
        const m = this.getStack();
        m && m.scheduleRender();
      }
      this.resumingFrom && !this.resumingFrom.instance && (this.resumingFrom = void 0);
    }
    createProjectionDeltas() {
      this.prevProjectionDelta = Ea(), this.projectionDelta = Ea(), this.projectionDeltaWithTransform = Ea();
    }
    setAnimationOrigin(f, m = !1, y) {
      const p = this.snapshot, v = p ? p.latestValues : {}, b = { ...this.latestValues }, T = Ea();
      (!this.relativeParent || !this.relativeParent.options.layoutRoot) && (this.relativeTarget = this.relativeTargetOrigin = void 0), this.attemptToResolveRelativeTarget = !m;
      const O = Pt(), M = p ? p.source : void 0, V = this.layout ? this.layout.source : void 0, j = M !== V, _ = this.getStack(), G = !_ || _.members.length <= 1, Y = !!(j && !G && this.options.crossfade === !0 && !this.path.some(bE));
      this.animationProgress = 0;
      let q;
      const F = y?.interpolateProjection(f);
      this.mixTargetDelta = (st) => {
        const Q = st / 1e3, U = F?.(Q);
        U ? (T.x.translate = U.x, T.x.scale = _t(f.x.scale, 1, Q), T.x.origin = f.x.origin, T.x.originPoint = f.x.originPoint, T.y.translate = U.y, T.y.scale = _t(f.y.scale, 1, Q), T.y.origin = f.y.origin, T.y.originPoint = f.y.originPoint) : (Hy(T.x, f.x, Q), Hy(T.y, f.y, Q)), this.setTargetDelta(T), this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout && (zo(O, this.layout.layoutBox, this.relativeParent.layout.layoutBox, this.options.layoutAnchor || void 0), vE(this.relativeTarget, this.relativeTargetOrigin, O, Q), q && Jx(this.relativeTarget, q) && (this.isProjectionDirty = !1), q || (q = Pt()), We(q, this.relativeTarget)), j && (this.animationValues = b, Wx(b, v, this.latestValues, Q, Y, G)), U && U.rotate !== void 0 && (this.animationValues || (this.animationValues = b), this.animationValues.pathRotation = U.rotate), this.root.scheduleUpdateProjection(), this.scheduleRender(), this.animationProgress = Q;
      }, this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0);
    }
    startAnimation(f) {
      this.notifyListeners("animationStart"), this.currentAnimation?.stop(), this.resumingFrom?.currentAnimation?.stop(), this.pendingAnimation && (li(this.pendingAnimation), this.pendingAnimation = void 0), this.pendingAnimation = Ut.update(() => {
        bo.hasAnimatedSinceResize = !0, this.motionValue || (this.motionValue = si(0)), this.motionValue.jump(0, !1), this.currentAnimation = $v(this.motionValue, [0, 1e3], {
          ...f,
          velocity: 0,
          isSync: !0,
          onUpdate: (m) => {
            this.mixTargetDelta(m), f.onUpdate && f.onUpdate(m);
          },
          onComplete: () => {
            f.onComplete && f.onComplete(), this.completeAnimation();
          }
        }), this.resumingFrom && (this.resumingFrom.currentAnimation = this.currentAnimation), this.pendingAnimation = void 0;
      });
    }
    completeAnimation() {
      this.resumingFrom && (this.resumingFrom.currentAnimation = void 0, this.resumingFrom.preserveOpacity = void 0);
      const f = this.getStack();
      f && f.exitAnimationComplete(), this.resumingFrom = this.currentAnimation = this.animationValues = void 0, this.notifyListeners("animationComplete");
    }
    finishAnimation() {
      this.currentAnimation && (this.mixTargetDelta && this.mixTargetDelta(aE), this.currentAnimation.stop()), this.completeAnimation();
    }
    applyTransformsToTarget() {
      const f = this.getLead();
      let { targetWithTransforms: m, target: y, layout: p, latestValues: v } = f;
      if (!(!m || !y || !p)) {
        if (this !== f && this.layout && p && e0(this.options.animationType, this.layout.layoutBox, p.layoutBox)) {
          y = this.target || Pt();
          const b = me(this.layout.layoutBox.x);
          y.x.min = f.target.x.min, y.x.max = y.x.min + b;
          const T = me(this.layout.layoutBox.y);
          y.y.min = f.target.y.min, y.y.max = y.y.min + T;
        }
        We(m, y), go(m, v), wl(this.projectionDeltaWithTransform, this.layoutCorrected, m, v);
      }
    }
    registerSharedNode(f, m) {
      this.sharedNodes.has(f) || this.sharedNodes.set(f, new iE()), this.sharedNodes.get(f).add(m);
      const p = m.options.initialPromotionConfig;
      m.promote({
        transition: p ? p.transition : void 0,
        preserveFollowOpacity: p && p.shouldPreserveFollowOpacity ? p.shouldPreserveFollowOpacity(m) : void 0
      });
    }
    isLead() {
      const f = this.getStack();
      return f ? f.lead === this : !0;
    }
    getLead() {
      const { layoutId: f } = this.options;
      return f ? this.getStack()?.lead || this : this;
    }
    getPrevLead() {
      const { layoutId: f } = this.options;
      return f ? this.getStack()?.prevLead : void 0;
    }
    getStack() {
      const { layoutId: f } = this.options;
      if (f)
        return this.root.sharedNodes.get(f);
    }
    promote({ needsReset: f, transition: m, preserveFollowOpacity: y } = {}) {
      const p = this.getStack();
      p && p.promote(this, y), f && (this.projectionDelta = void 0, this.needsReset = !0), m && this.setOptions({ transition: m });
    }
    relegate() {
      const f = this.getStack();
      return f ? f.relegate(this) : !1;
    }
    resetSkewAndRotation() {
      const { visualElement: f } = this.options;
      if (!f)
        return;
      let m = !1;
      const { latestValues: y } = f;
      if ((y.z || y.rotate || y.rotateX || y.rotateY || y.rotateZ || y.skewX || y.skewY) && (m = !0), !m)
        return;
      const p = {};
      y.z && hc("z", f, p, this.animationValues);
      for (let v = 0; v < fc.length; v++)
        hc(`rotate${fc[v]}`, f, p, this.animationValues), hc(`skew${fc[v]}`, f, p, this.animationValues);
      f.render();
      for (const v in p)
        f.setStaticValue(v, p[v]), this.animationValues && (this.animationValues[v] = p[v]);
      f.scheduleRender();
    }
    applyProjectionStyles(f, m) {
      if (!this.instance || this.isSVG)
        return;
      if (!this.isVisible) {
        f.visibility = "hidden";
        return;
      }
      const y = this.getTransformTemplate();
      if (this.needsReset) {
        this.needsReset = !1, f.visibility = "", f.opacity = "", f.pointerEvents = vo(m?.pointerEvents) || "", f.transform = y ? y(this.latestValues, "") : "none";
        return;
      }
      const p = this.getLead();
      if (!this.projectionDelta || !this.layout || !p.target) {
        this.options.layoutId && (f.opacity = this.latestValues.opacity !== void 0 ? this.latestValues.opacity : 1, f.pointerEvents = vo(m?.pointerEvents) || ""), this.hasProjected && !Oi(this.latestValues) && (f.transform = y ? y({}, "") : "none", this.hasProjected = !1);
        return;
      }
      f.visibility = "";
      const v = p.animationValues || p.latestValues;
      this.applyTransformsToTarget();
      let b = Fx(this.projectionDeltaWithTransform, this.treeScale, v);
      y && (b = y(v, b)), f.transform = b;
      const { x: T, y: O } = this.projectionDelta;
      f.transformOrigin = `${T.origin * 100}% ${O.origin * 100}% 0`, p.animationValues ? f.opacity = p === this ? v.opacity ?? this.latestValues.opacity ?? 1 : this.preserveOpacity ? this.latestValues.opacity : v.opacityExit : f.opacity = p === this ? v.opacity !== void 0 ? v.opacity : "" : v.opacityExit !== void 0 ? v.opacityExit : 0;
      for (const M in Yc) {
        if (v[M] === void 0)
          continue;
        const { correct: V, applyTo: j, isCSSVariable: _ } = Yc[M], G = b === "none" ? v[M] : V(v[M], p);
        if (j) {
          const Y = j.length;
          for (let q = 0; q < Y; q++)
            f[j[q]] = G;
        } else
          _ ? this.options.visualElement.renderState.vars[M] = G : f[M] = G;
      }
      this.options.layoutId && (f.pointerEvents = p === this ? vo(m?.pointerEvents) || "" : "none");
    }
    clearSnapshot() {
      this.resumeFrom = this.snapshot = void 0;
    }
    // Only run on root
    resetTree() {
      this.root.nodes.forEach((f) => f.currentAnimation?.stop()), this.root.nodes.forEach(Ny), this.root.sharedNodes.clear();
    }
  };
}
function sE(i) {
  i.updateLayout();
}
function oE(i) {
  const l = i.resumeFrom?.snapshot || i.snapshot;
  if (i.isLead() && i.layout && l && i.hasListeners("didUpdate")) {
    const { layoutBox: s, measuredBox: o } = i.layout, { animationType: c } = i.options, d = l.source !== i.layout.source;
    if (c === "size")
      sn((v) => {
        const b = d ? l.measuredBox[v] : l.layoutBox[v], T = me(b);
        b.min = s[v].min, b.max = b.min + T;
      });
    else if (c === "x" || c === "y") {
      const v = c === "x" ? "y" : "x";
      qc(d ? l.measuredBox[v] : l.layoutBox[v], s[v]);
    } else e0(c, l.layoutBox, s) && sn((v) => {
      const b = d ? l.measuredBox[v] : l.layoutBox[v], T = me(s[v]);
      b.max = b.min + T, i.relativeTarget && !i.currentAnimation && (i.isProjectionDirty = !0, i.relativeTarget[v].max = i.relativeTarget[v].min + T);
    });
    const f = Ea();
    wl(f, s, l.layoutBox);
    const m = Ea();
    d ? wl(m, i.applyTransform(o, !0), l.measuredBox) : wl(m, s, l.layoutBox);
    const y = !Fv(f);
    let p = !1;
    if (!i.resumeFrom) {
      const v = i.getClosestProjectingParent();
      if (v && !v.resumeFrom) {
        const { snapshot: b, layout: T } = v;
        if (b && T) {
          const O = i.options.layoutAnchor || void 0, M = Pt();
          zo(M, l.layoutBox, b.layoutBox, O);
          const V = Pt();
          zo(V, s, T.layoutBox, O), Pv(M, V) || (p = !0), v.options.layoutRoot && (i.relativeTarget = V, i.relativeTargetOrigin = M, i.relativeParent = v);
        }
      }
    }
    i.notifyListeners("didUpdate", {
      layout: s,
      snapshot: l,
      delta: m,
      layoutDelta: f,
      hasLayoutChanged: y,
      hasRelativeLayoutChanged: p
    });
  } else if (i.isLead()) {
    const { onExitComplete: s } = i.options;
    s && s();
  }
  i.options.transition = void 0;
}
function rE(i) {
  i.parent && (i.isProjecting() || (i.isProjectionDirty = i.parent.isProjectionDirty), i.isSharedProjectionDirty || (i.isSharedProjectionDirty = !!(i.isProjectionDirty || i.parent.isProjectionDirty || i.parent.isSharedProjectionDirty)), i.isTransformDirty || (i.isTransformDirty = i.parent.isTransformDirty));
}
function uE(i) {
  i.isProjectionDirty = i.isSharedProjectionDirty = i.isTransformDirty = !1;
}
function cE(i) {
  i.clearSnapshot();
}
function Ny(i) {
  i.clearMeasurements();
}
function fE(i) {
  i.isLayoutDirty = !0, i.updateLayout();
}
function Ly(i) {
  i.isLayoutDirty = !1;
}
function hE(i) {
  i.isAnimationBlocked && i.layout && !i.isLayoutDirty && (i.snapshot = i.layout, i.isLayoutDirty = !0);
}
function dE(i) {
  const { visualElement: l } = i.options;
  l && l.getProps().onBeforeLayoutMeasure && l.notify("BeforeLayoutMeasure"), i.resetTransform();
}
function jy(i) {
  i.finishAnimation(), i.targetDelta = i.relativeTarget = i.target = void 0, i.isProjectionDirty = !0;
}
function mE(i) {
  i.resolveTargetDelta();
}
function pE(i) {
  i.calcProjection();
}
function yE(i) {
  i.resetSkewAndRotation();
}
function gE(i) {
  i.removeLeadSnapshot();
}
function Hy(i, l, s) {
  i.translate = _t(l.translate, 0, s), i.scale = _t(l.scale, 1, s), i.origin = l.origin, i.originPoint = l.originPoint;
}
function Gy(i, l, s, o) {
  i.min = _t(l.min, s.min, o), i.max = _t(l.max, s.max, o);
}
function vE(i, l, s, o) {
  Gy(i.x, l.x, s.x, o), Gy(i.y, l.y, s.y, o);
}
function bE(i) {
  return i.animationValues && i.animationValues.opacityExit !== void 0;
}
const SE = {
  duration: 0.45,
  ease: [0.4, 0, 0.1, 1]
}, Yy = (i) => typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(i), qy = Yy("applewebkit/") && !Yy("chrome/") ? Math.round : Ze;
function Xy(i) {
  i.min = qy(i.min), i.max = qy(i.max);
}
function TE(i) {
  Xy(i.x), Xy(i.y);
}
function e0(i, l, s) {
  return i === "position" || i === "preserve-aspect" && !Xx(wy(l), wy(s), 0.2);
}
function AE(i) {
  return i !== i.root && i.scroll?.wasRoot;
}
const xE = t0({
  attachResizeListener: (i, l) => Ll(i, "resize", l),
  measureScroll: () => ({
    x: document.documentElement.scrollLeft || document.body?.scrollLeft || 0,
    y: document.documentElement.scrollTop || document.body?.scrollTop || 0
  }),
  checkIsScrollRoot: () => !0
}), dc = {
  current: void 0
}, n0 = t0({
  measureScroll: (i) => ({
    x: i.scrollLeft,
    y: i.scrollTop
  }),
  defaultParent: () => {
    if (!dc.current) {
      const i = new xE({});
      i.mount(window), i.setOptions({ layoutScroll: !0 }), dc.current = i;
    }
    return dc.current;
  },
  resetTransform: (i, l) => {
    i.style.transform = l !== void 0 ? l : "none";
  },
  checkIsScrollRoot: (i) => window.getComputedStyle(i).position === "fixed"
}), Af = it.createContext({
  transformPagePoint: (i) => i,
  isStatic: !1,
  reducedMotion: "never"
});
function EE(i = !0) {
  const l = it.useContext(Jc);
  if (l === null)
    return [!0, null];
  const { isPresent: s, onExitComplete: o, register: c } = l, d = it.useId();
  it.useEffect(() => {
    if (i)
      return c(d);
  }, [i]);
  const f = it.useCallback(() => i && o && o(d), [d, o, i]);
  return !s && o ? [!1, f] : [!0];
}
const i0 = it.createContext({ strict: !1 }), ky = {
  animation: [
    "animate",
    "variants",
    "whileHover",
    "whileTap",
    "exit",
    "whileInView",
    "whileFocus",
    "whileDrag"
  ],
  exit: ["exit"],
  drag: ["drag", "dragControls"],
  focus: ["whileFocus"],
  hover: ["whileHover", "onHoverStart", "onHoverEnd"],
  tap: ["whileTap", "onTap", "onTapStart", "onTapCancel"],
  pan: ["onPan", "onPanStart", "onPanSessionStart", "onPanEnd"],
  inView: ["whileInView", "onViewportEnter", "onViewportLeave"],
  layout: ["layout", "layoutId"]
};
let Qy = !1;
function ME() {
  if (Qy)
    return;
  const i = {};
  for (const l in ky)
    i[l] = {
      isEnabled: (s) => ky[l].some((o) => !!s[o])
    };
  Ov(i), Qy = !0;
}
function a0() {
  return ME(), yx();
}
function DE(i) {
  const l = a0();
  for (const s in i)
    l[s] = {
      ...l[s],
      ...i[s]
    };
  Ov(l);
}
const zE = /* @__PURE__ */ new Set([
  "animate",
  "exit",
  "variants",
  "initial",
  "style",
  "values",
  "variants",
  "transition",
  "transformTemplate",
  "custom",
  "inherit",
  "onBeforeLayoutMeasure",
  "onAnimationStart",
  "onAnimationComplete",
  "onUpdate",
  "onDragStart",
  "onDrag",
  "onDragEnd",
  "onMeasureDragConstraints",
  "onDirectionLock",
  "onDragTransitionEnd",
  "_dragX",
  "_dragY",
  "onHoverStart",
  "onHoverEnd",
  "onViewportEnter",
  "onViewportLeave",
  "globalTapTarget",
  "propagate",
  "ignoreStrict",
  "viewport"
]);
function Co(i) {
  return i.startsWith("while") || i.startsWith("drag") && i !== "draggable" || i.startsWith("layout") || i.startsWith("onTap") || i.startsWith("onPan") || i.startsWith("onLayout") || zE.has(i);
}
let l0 = (i) => !Co(i);
function CE(i) {
  typeof i == "function" && (l0 = (l) => l.startsWith("on") ? !Co(l) : i(l));
}
try {
  CE(require("@emotion/is-prop-valid").default);
} catch {
}
function RE(i, l, s) {
  const o = {};
  for (const c in i)
    c === "values" && typeof i.values == "object" || te(i[c]) || (l0(c) || s === !0 && Co(c) || !l && !Co(c) || // If trying to use native HTML drag events, forward drag listeners
    i.draggable && c.startsWith("onDrag")) && (o[c] = i[c]);
  return o;
}
const Bo = /* @__PURE__ */ it.createContext({});
function OE(i, l) {
  if (_o(i)) {
    const { initial: s, animate: o } = i;
    return {
      initial: s === !1 || Nl(s) ? s : void 0,
      animate: Nl(o) ? o : void 0
    };
  }
  return i.inherit !== !1 ? l : {};
}
function wE(i) {
  const { initial: l, animate: s } = OE(i, it.useContext(Bo));
  return it.useMemo(() => ({ initial: l, animate: s }), [Zy(l), Zy(s)]);
}
function Zy(i) {
  return Array.isArray(i) ? i.join(" ") : i;
}
const xf = () => ({
  style: {},
  transform: {},
  transformOrigin: {},
  vars: {}
});
function s0(i, l, s) {
  for (const o in l)
    !te(l[o]) && !jv(o, s) && (i[o] = l[o]);
}
function VE({ transformTemplate: i }, l) {
  return it.useMemo(() => {
    const s = xf();
    return Sf(s, l, i), Object.assign({}, s.vars, s.style);
  }, [l]);
}
function _E(i, l) {
  const s = i.style || {}, o = {};
  return s0(o, s, i), Object.assign(o, VE(i, l)), o;
}
function BE(i, l) {
  const s = {}, o = _E(i, l);
  return i.drag && i.dragListener !== !1 && (s.draggable = !1, o.userSelect = o.WebkitUserSelect = o.WebkitTouchCallout = "none", o.touchAction = i.drag === !0 ? "none" : `pan-${i.drag === "x" ? "y" : "x"}`), i.tabIndex === void 0 && (i.onTap || i.onTapStart || i.whileTap) && (s.tabIndex = 0), s.style = o, s;
}
const o0 = () => ({
  ...xf(),
  attrs: {}
});
function UE(i, l, s, o) {
  const c = it.useMemo(() => {
    const d = o0();
    return Gv(d, l, qv(o), i.transformTemplate, i.style), {
      ...d.attrs,
      style: { ...d.style }
    };
  }, [l]);
  if (i.style) {
    const d = {};
    s0(d, i.style, i), c.style = { ...d, ...c.style };
  }
  return c;
}
const NE = [
  "animate",
  "circle",
  "defs",
  "desc",
  "ellipse",
  "g",
  "image",
  "line",
  "filter",
  "marker",
  "mask",
  "metadata",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "rect",
  "stop",
  "switch",
  "symbol",
  "svg",
  "text",
  "tspan",
  "use",
  "view"
];
function Ef(i) {
  return (
    /**
     * If it's not a string, it's a custom React component. Currently we only support
     * HTML custom React components.
     */
    typeof i != "string" || /**
     * If it contains a dash, the element is a custom HTML webcomponent.
     */
    i.includes("-") ? !1 : (
      /**
       * If it's in our list of lowercase SVG tags, it's an SVG component
       */
      !!(NE.indexOf(i) > -1 || /**
       * If it contains a capital letter, it's an SVG component
       */
      /[A-Z]/u.test(i))
    )
  );
}
function LE(i, l, s, { latestValues: o }, c, d = !1, f) {
  const y = (f ?? Ef(i) ? UE : BE)(l, o, c, i), p = RE(l, typeof i == "string", d), v = i !== it.Fragment ? { ...p, ...y, ref: s } : {}, { children: b } = l, T = it.useMemo(() => te(b) ? b.get() : b, [b]);
  return it.createElement(i, {
    ...v,
    children: T
  });
}
function jE({ scrapeMotionValuesFromProps: i, createRenderState: l }, s, o, c) {
  return {
    latestValues: HE(s, o, c, i),
    renderState: l()
  };
}
function HE(i, l, s, o) {
  const c = {}, d = o(i, {});
  for (const T in d)
    c[T] = vo(d[T]);
  let { initial: f, animate: m } = i;
  const y = _o(i), p = Cv(i);
  l && p && !y && i.inherit !== !1 && (f === void 0 && (f = l.initial), m === void 0 && (m = l.animate));
  let v = s ? s.initial === !1 : !1;
  v = v || f === !1;
  const b = v ? m : f;
  if (b && typeof b != "boolean" && !Vo(b)) {
    const T = Array.isArray(b) ? b : [b];
    for (let O = 0; O < T.length; O++) {
      const M = ff(i, T[O]);
      if (M) {
        const { transitionEnd: V, transition: j, ..._ } = M;
        for (const G in _) {
          let Y = _[G];
          if (Array.isArray(Y)) {
            const q = v ? Y.length - 1 : 0;
            Y = Y[q];
          }
          Y !== null && (c[G] = Y);
        }
        for (const G in V)
          c[G] = V[G];
      }
    }
  }
  return c;
}
const r0 = (i) => (l, s) => {
  const o = it.useContext(Bo), c = it.useContext(Jc), d = () => jE(i, l, o, c);
  return s ? d() : Dg(d);
}, GE = /* @__PURE__ */ r0({
  scrapeMotionValuesFromProps: Tf,
  createRenderState: xf
}), YE = /* @__PURE__ */ r0({
  scrapeMotionValuesFromProps: Xv,
  createRenderState: o0
}), qE = /* @__PURE__ */ Symbol.for("motionComponentSymbol");
function XE(i, l, s) {
  const o = it.useRef(s);
  it.useInsertionEffect(() => {
    o.current = s;
  });
  const c = it.useRef(null);
  return it.useCallback((d) => {
    d && i.onMount?.(d), l && (d ? l.mount(d) : l.unmount());
    const f = o.current;
    if (typeof f == "function")
      if (d) {
        const m = f(d);
        typeof m == "function" && (c.current = m);
      } else c.current ? (c.current(), c.current = null) : f(d);
    else f && (f.current = d);
  }, [l]);
}
const u0 = it.createContext({});
function Ta(i) {
  return i && typeof i == "object" && Object.prototype.hasOwnProperty.call(i, "current");
}
function kE(i, l, s, o, c, d) {
  const { visualElement: f } = it.useContext(Bo), m = it.useContext(i0), y = it.useContext(Jc), p = it.useContext(Af), v = p.reducedMotion, b = p.skipAnimations, T = it.useRef(null), O = it.useRef(!1);
  o = o || m.renderer, !T.current && o && (T.current = o(i, {
    visualState: l,
    parent: f,
    props: s,
    presenceContext: y,
    blockInitialAnimation: y ? y.initial === !1 : !1,
    reducedMotionConfig: v,
    skipAnimations: b,
    isSVG: d
  }), O.current && T.current && (T.current.manuallyAnimateOnMount = !0));
  const M = T.current, V = it.useContext(u0);
  M && !M.projection && c && (M.type === "html" || M.type === "svg") && QE(T.current, s, c, V);
  const j = it.useRef(!1);
  it.useInsertionEffect(() => {
    M && j.current && M.update(s, y);
  });
  const _ = s[gv], G = it.useRef(!!_ && typeof window < "u" && !window.MotionHandoffIsComplete?.(_) && window.MotionHasOptimisedAnimation?.(_));
  return kS(() => {
    O.current = !0, M && (j.current = !0, window.MotionIsMounted = !0, M.updateFeatures(), M.scheduleRenderMicrotask(), G.current && M.animationState && M.animationState.animateChanges());
  }), it.useEffect(() => {
    M && (!G.current && M.animationState && M.animationState.animateChanges(), G.current && (queueMicrotask(() => {
      window.MotionHandoffMarkAsComplete?.(_);
    }), G.current = !1), M.enteringChildren = void 0);
  }), M;
}
function QE(i, l, s, o) {
  const { layoutId: c, layout: d, drag: f, dragConstraints: m, layoutScroll: y, layoutRoot: p, layoutAnchor: v, layoutCrossfade: b } = l;
  i.projection = new s(i.latestValues, l["data-framer-portal-id"] ? void 0 : c0(i.parent)), i.projection.setOptions({
    layoutId: c,
    layout: d,
    alwaysMeasureLayout: !!f || m && Ta(m),
    visualElement: i,
    /**
     * TODO: Update options in an effect. This could be tricky as it'll be too late
     * to update by the time layout animations run.
     * We also need to fix this safeToRemove by linking it up to the one returned by usePresence,
     * ensuring it gets called if there's no potential layout animations.
     *
     */
    animationType: typeof d == "string" ? d : "both",
    initialPromotionConfig: o,
    crossfade: b,
    layoutScroll: y,
    layoutRoot: p,
    layoutAnchor: v
  });
}
function c0(i) {
  if (i)
    return i.options.allowProjection !== !1 ? i.projection : c0(i.parent);
}
function mc(i, { forwardMotionProps: l = !1, type: s } = {}, o, c) {
  o && DE(o);
  const d = s ? s === "svg" : Ef(i), f = d ? YE : GE;
  function m(p, v) {
    let b;
    const T = {
      ...it.useContext(Af),
      ...p,
      layoutId: ZE(p)
    }, { isStatic: O } = T, M = wE(p), V = f(p, O);
    if (!O && typeof window < "u") {
      KE();
      const j = JE(T);
      b = j.MeasureLayout, M.visualElement = kE(i, V, T, c, j.ProjectionNode, d);
    }
    return _e.jsxs(Bo.Provider, { value: M, children: [b && M.visualElement ? _e.jsx(b, { visualElement: M.visualElement, ...T }) : null, LE(i, p, XE(V, M.visualElement, v), V, O, l, d)] });
  }
  m.displayName = `motion.${typeof i == "string" ? i : `create(${i.displayName ?? i.name ?? ""})`}`;
  const y = it.forwardRef(m);
  return y[qE] = i, y;
}
function ZE({ layoutId: i }) {
  const l = it.useContext(Mg).id;
  return l && i !== void 0 ? l + "-" + i : i;
}
function KE(i, l) {
  it.useContext(i0).strict;
}
function JE(i) {
  const l = a0(), { drag: s, layout: o } = l;
  if (!s && !o)
    return {};
  const c = { ...s, ...o };
  return {
    MeasureLayout: s?.isEnabled(i) || o?.isEnabled(i) ? c.MeasureLayout : void 0,
    ProjectionNode: c.ProjectionNode
  };
}
function FE(i, l) {
  if (typeof Proxy > "u")
    return mc;
  const s = /* @__PURE__ */ new Map(), o = (d, f) => mc(d, f, i, l), c = (d, f) => o(d, f);
  return new Proxy(c, {
    /**
     * Called when `motion` is referenced with a prop: `motion.div`, `motion.input` etc.
     * The prop name is passed through as `key` and we can use that to generate a `motion`
     * DOM component with that name.
     */
    get: (d, f) => f === "create" ? o : (s.has(f) || s.set(f, mc(f, void 0, i, l)), s.get(f))
  });
}
const PE = (i, l) => l.isSVG ?? Ef(i) ? new kv(l) : new Hv(l, {
  allowProjection: i !== it.Fragment
});
class WE extends ri {
  /**
   * We dynamically generate the AnimationState manager as it contains a reference
   * to the underlying animation library. We only want to load that if we load this,
   * so people can optionally code split it out using the `m` component.
   */
  constructor(l) {
    super(l), l.animationState || (l.animationState = Lx(l));
  }
  updateAnimationControlsSubscription() {
    const { animate: l } = this.node.getProps();
    Vo(l) && (this.unmountControls = l.subscribe(this.node));
  }
  /**
   * Subscribe any provided AnimationControls to the component's VisualElement
   */
  mount() {
    this.updateAnimationControlsSubscription();
  }
  update() {
    const { animate: l } = this.node.getProps(), { animate: s } = this.node.prevProps || {};
    l !== s && this.updateAnimationControlsSubscription();
  }
  unmount() {
    this.node.animationState.reset(), this.unmountControls?.();
  }
}
let $E = 0;
class IE extends ri {
  constructor() {
    super(...arguments), this.id = $E++, this.isExitComplete = !1;
  }
  update() {
    if (!this.node.presenceContext)
      return;
    const { isPresent: l, onExitComplete: s } = this.node.presenceContext, { isPresent: o } = this.node.prevPresenceContext || {};
    if (!this.node.animationState || l === o)
      return;
    if (l && o === !1) {
      if (this.isExitComplete) {
        const { initial: d, custom: f } = this.node.getProps();
        if (typeof d == "string" || typeof d == "object" && d !== null && !Array.isArray(d)) {
          const m = Bi(this.node, d, f);
          if (m) {
            const { transition: y, transitionEnd: p, ...v } = m;
            for (const b in v)
              this.node.getValue(b)?.jump(v[b]);
          }
        }
        this.node.animationState.reset(), this.node.animationState.animateChanges();
      } else
        this.node.animationState.setActive("exit", !1);
      this.isExitComplete = !1;
      return;
    }
    const c = this.node.animationState.setActive("exit", !l);
    s && !l && c.then(() => {
      this.isExitComplete = !0, s(this.id);
    });
  }
  mount() {
    const { register: l, onExitComplete: s } = this.node.presenceContext || {};
    s && s(this.id), l && (this.unmount = l(this.id));
  }
  unmount() {
  }
}
const t2 = {
  animation: {
    Feature: WE
  },
  exit: {
    Feature: IE
  }
};
function Yl(i) {
  return {
    point: {
      x: i.pageX,
      y: i.pageY
    }
  };
}
const e2 = (i) => (l) => gf(l) && i(l, Yl(l));
function Vl(i, l, s, o) {
  return Ll(i, l, e2(s), o);
}
const f0 = ({ current: i }) => i ? i.ownerDocument.defaultView : null, Ky = (i, l) => Math.abs(i - l);
function n2(i, l) {
  const s = Ky(i.x, l.x), o = Ky(i.y, l.y);
  return Math.sqrt(s ** 2 + o ** 2);
}
const Jy = /* @__PURE__ */ new Set(["auto", "scroll"]);
class h0 {
  constructor(l, s, { transformPagePoint: o, contextWindow: c = window, dragSnapToOrigin: d = !1, distanceThreshold: f = 3, element: m } = {}) {
    if (this.startEvent = null, this.lastMoveEvent = null, this.lastMoveEventInfo = null, this.lastRawMoveEventInfo = null, this.handlers = {}, this.contextWindow = window, this.scrollPositions = /* @__PURE__ */ new Map(), this.removeScrollListeners = null, this.onElementScroll = (M) => {
      this.handleScroll(M.target);
    }, this.onWindowScroll = () => {
      this.handleScroll(window);
    }, this.updatePoint = () => {
      if (!(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      this.lastRawMoveEventInfo && (this.lastMoveEventInfo = uo(this.lastRawMoveEventInfo, this.transformPagePoint));
      const M = pc(this.lastMoveEventInfo, this.history), V = this.startEvent !== null, j = n2(M.offset, { x: 0, y: 0 }) >= this.distanceThreshold;
      if (!V && !j)
        return;
      const { point: _ } = M, { timestamp: G } = ue;
      this.history.push({ ..._, timestamp: G });
      const { onStart: Y, onMove: q } = this.handlers;
      V || (Y && Y(this.lastMoveEvent, M), this.startEvent = this.lastMoveEvent), q && q(this.lastMoveEvent, M);
    }, this.handlePointerMove = (M, V) => {
      this.lastMoveEvent = M, this.lastRawMoveEventInfo = V, this.lastMoveEventInfo = uo(V, this.transformPagePoint), Ut.update(this.updatePoint, !0);
    }, this.handlePointerUp = (M, V) => {
      this.end();
      const { onEnd: j, onSessionEnd: _, resumeAnimation: G } = this.handlers;
      if ((this.dragSnapToOrigin || !this.startEvent) && G && G(), !(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const Y = pc(M.type === "pointercancel" ? this.lastMoveEventInfo : uo(V, this.transformPagePoint), this.history);
      this.startEvent && j && j(M, Y), _ && _(M, Y);
    }, !gf(l))
      return;
    this.dragSnapToOrigin = d, this.handlers = s, this.transformPagePoint = o, this.distanceThreshold = f, this.contextWindow = c || window;
    const y = Yl(l), p = uo(y, this.transformPagePoint), { point: v } = p, { timestamp: b } = ue;
    this.history = [{ ...v, timestamp: b }];
    const { onSessionStart: T } = s;
    T && T(l, pc(p, this.history));
    const O = { passive: !0, capture: !0 };
    this.removeListeners = jl(Vl(this.contextWindow, "pointermove", this.handlePointerMove, O), Vl(this.contextWindow, "pointerup", this.handlePointerUp, O), Vl(this.contextWindow, "pointercancel", this.handlePointerUp, O)), m && this.startScrollTracking(m);
  }
  /**
   * Start tracking scroll on ancestors and window.
   */
  startScrollTracking(l) {
    let s = l.parentElement;
    for (; s; ) {
      const o = getComputedStyle(s);
      (Jy.has(o.overflowX) || Jy.has(o.overflowY)) && this.scrollPositions.set(s, {
        x: s.scrollLeft,
        y: s.scrollTop
      }), s = s.parentElement;
    }
    this.scrollPositions.set(window, {
      x: window.scrollX,
      y: window.scrollY
    }), window.addEventListener("scroll", this.onElementScroll, {
      capture: !0
    }), window.addEventListener("scroll", this.onWindowScroll), this.removeScrollListeners = () => {
      window.removeEventListener("scroll", this.onElementScroll, {
        capture: !0
      }), window.removeEventListener("scroll", this.onWindowScroll);
    };
  }
  /**
   * Handle scroll compensation during drag.
   *
   * For element scroll: adjusts history origin since pageX/pageY doesn't change.
   * For window scroll: adjusts lastMoveEventInfo since pageX/pageY would change.
   */
  handleScroll(l) {
    const s = this.scrollPositions.get(l);
    if (!s)
      return;
    const o = l === window, c = o ? { x: window.scrollX, y: window.scrollY } : {
      x: l.scrollLeft,
      y: l.scrollTop
    }, d = { x: c.x - s.x, y: c.y - s.y };
    d.x === 0 && d.y === 0 || (o ? this.lastMoveEventInfo && (this.lastMoveEventInfo.point.x += d.x, this.lastMoveEventInfo.point.y += d.y) : this.history.length > 0 && (this.history[0].x -= d.x, this.history[0].y -= d.y), this.scrollPositions.set(l, c), Ut.update(this.updatePoint, !0));
  }
  updateHandlers(l) {
    this.handlers = l;
  }
  end() {
    this.removeListeners && this.removeListeners(), this.removeScrollListeners && this.removeScrollListeners(), this.scrollPositions.clear(), li(this.updatePoint);
  }
}
function uo(i, l) {
  return l ? { point: l(i.point) } : i;
}
function Fy(i, l) {
  return { x: i.x - l.x, y: i.y - l.y };
}
function pc({ point: i }, l) {
  return {
    point: i,
    delta: Fy(i, d0(l)),
    offset: Fy(i, i2(l)),
    velocity: a2(l, 0.1)
  };
}
function i2(i) {
  return i[0];
}
function d0(i) {
  return i[i.length - 1];
}
function a2(i, l) {
  if (i.length < 2)
    return { x: 0, y: 0 };
  let s = i.length - 1, o = null;
  const c = d0(i);
  for (; s >= 0 && (o = i[s], !(c.timestamp - o.timestamp > /* @__PURE__ */ Ae(l))); )
    s--;
  if (!o)
    return { x: 0, y: 0 };
  o === i[0] && i.length > 2 && c.timestamp - o.timestamp > /* @__PURE__ */ Ae(l) * 2 && (o = i[1]);
  const d = /* @__PURE__ */ Qe(c.timestamp - o.timestamp);
  if (d === 0)
    return { x: 0, y: 0 };
  const f = {
    x: (c.x - o.x) / d,
    y: (c.y - o.y) / d
  };
  return f.x === 1 / 0 && (f.x = 0), f.y === 1 / 0 && (f.y = 0), f;
}
function l2(i, { min: l, max: s }, o) {
  return l !== void 0 && i < l ? i = o ? _t(l, i, o.min) : Math.max(i, l) : s !== void 0 && i > s && (i = o ? _t(s, i, o.max) : Math.min(i, s)), i;
}
function Py(i, l, s) {
  return {
    min: l !== void 0 ? i.min + l : void 0,
    max: s !== void 0 ? i.max + s - (i.max - i.min) : void 0
  };
}
function s2(i, { top: l, left: s, bottom: o, right: c }) {
  return {
    x: Py(i.x, s, c),
    y: Py(i.y, l, o)
  };
}
function Wy(i, l) {
  let s = l.min - i.min, o = l.max - i.max;
  return l.max - l.min < i.max - i.min && ([s, o] = [o, s]), { min: s, max: o };
}
function o2(i, l) {
  return {
    x: Wy(i.x, l.x),
    y: Wy(i.y, l.y)
  };
}
function r2(i, l) {
  let s = 0.5;
  const o = me(i), c = me(l);
  return c > o ? s = /* @__PURE__ */ Da(l.min, l.max - o, i.min) : o > c && (s = /* @__PURE__ */ Da(i.min, i.max - c, l.min)), un(0, 1, s);
}
function u2(i, l) {
  const s = {};
  return l.min !== void 0 && (s.min = l.min - i.min), l.max !== void 0 && (s.max = l.max - i.min), s;
}
const Xc = 0.35;
function c2(i = Xc) {
  return i === !1 ? i = 0 : i === !0 && (i = Xc), {
    x: $y(i, "left", "right"),
    y: $y(i, "top", "bottom")
  };
}
function $y(i, l, s) {
  return {
    min: Iy(i, l),
    max: Iy(i, s)
  };
}
function Iy(i, l) {
  return typeof i == "number" ? i : i[l] || 0;
}
const f2 = /* @__PURE__ */ new WeakMap();
class h2 {
  constructor(l) {
    this.openDragLock = null, this.isDragging = !1, this.currentDirection = null, this.originPoint = { x: 0, y: 0 }, this.constraints = !1, this.hasMutatedConstraints = !1, this.elastic = Pt(), this.latestPointerEvent = null, this.latestPanInfo = null, this.visualElement = l;
  }
  start(l, { snapToCursor: s = !1, distanceThreshold: o } = {}) {
    const { presenceContext: c } = this.visualElement;
    if (c && c.isPresent === !1)
      return;
    const d = (b) => {
      s && this.snapToCursor(Yl(b).point), this.stopAnimation();
    }, f = (b, T) => {
      const { drag: O, dragPropagation: M, onDragStart: V } = this.getProps();
      if (O && !M && (this.openDragLock && this.openDragLock(), this.openDragLock = JA(O), !this.openDragLock))
        return;
      this.latestPointerEvent = b, this.latestPanInfo = T, this.isDragging = !0, this.currentDirection = null, this.resolveConstraints(), this.visualElement.projection && (this.visualElement.projection.isAnimationBlocked = !0, this.visualElement.projection.target = void 0), sn((_) => {
        let G = this.getAxisMotionValue(_).get() || 0;
        if (rn.test(G)) {
          const { projection: Y } = this.visualElement;
          if (Y && Y.layout) {
            const q = Y.layout.layoutBox[_];
            q && (G = me(q) * (parseFloat(G) / 100));
          }
        }
        this.originPoint[_] = G;
      }), V && Ut.update(() => V(b, T), !1, !0), _c(this.visualElement, "transform");
      const { animationState: j } = this.visualElement;
      j && j.setActive("whileDrag", !0);
    }, m = (b, T) => {
      this.latestPointerEvent = b, this.latestPanInfo = T;
      const { dragPropagation: O, dragDirectionLock: M, onDirectionLock: V, onDrag: j } = this.getProps();
      if (!O && !this.openDragLock)
        return;
      const { offset: _ } = T;
      if (M && this.currentDirection === null) {
        this.currentDirection = m2(_), this.currentDirection !== null && V && V(this.currentDirection);
        return;
      }
      this.updateAxis("x", T.point, _), this.updateAxis("y", T.point, _), this.visualElement.render(), j && Ut.update(() => j(b, T), !1, !0);
    }, y = (b, T) => {
      this.latestPointerEvent = b, this.latestPanInfo = T, this.stop(b, T), this.latestPointerEvent = null, this.latestPanInfo = null;
    }, p = () => {
      const { dragSnapToOrigin: b } = this.getProps();
      (b || this.constraints) && this.startAnimation({ x: 0, y: 0 });
    }, { dragSnapToOrigin: v } = this.getProps();
    this.panSession = new h0(l, {
      onSessionStart: d,
      onStart: f,
      onMove: m,
      onSessionEnd: y,
      resumeAnimation: p
    }, {
      transformPagePoint: this.visualElement.getTransformPagePoint(),
      dragSnapToOrigin: v,
      distanceThreshold: o,
      contextWindow: f0(this.visualElement),
      element: this.visualElement.current
    });
  }
  /**
   * @internal
   */
  stop(l, s) {
    const o = l || this.latestPointerEvent, c = s || this.latestPanInfo, d = this.isDragging;
    if (this.cancel(), !d || !c || !o)
      return;
    const { velocity: f } = c;
    this.startAnimation(f);
    const { onDragEnd: m } = this.getProps();
    m && Ut.postRender(() => m(o, c));
  }
  /**
   * @internal
   */
  cancel() {
    this.isDragging = !1;
    const { projection: l, animationState: s } = this.visualElement;
    l && (l.isAnimationBlocked = !1), this.endPanSession();
    const { dragPropagation: o } = this.getProps();
    !o && this.openDragLock && (this.openDragLock(), this.openDragLock = null), s && s.setActive("whileDrag", !1);
  }
  /**
   * Clean up the pan session without modifying other drag state.
   * This is used during unmount to ensure event listeners are removed
   * without affecting projection animations or drag locks.
   * @internal
   */
  endPanSession() {
    this.panSession && this.panSession.end(), this.panSession = void 0;
  }
  updateAxis(l, s, o) {
    const { drag: c } = this.getProps();
    if (!o || !co(l, c, this.currentDirection))
      return;
    const d = this.getAxisMotionValue(l);
    let f = this.originPoint[l] + o[l];
    this.constraints && this.constraints[l] && (f = l2(f, this.constraints[l], this.elastic[l])), d.set(f);
  }
  resolveConstraints() {
    const { dragConstraints: l, dragElastic: s } = this.getProps(), o = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(!1) : this.visualElement.projection?.layout, c = this.constraints;
    l && Ta(l) ? this.constraints || (this.constraints = this.resolveRefConstraints()) : l && o ? this.constraints = s2(o.layoutBox, l) : this.constraints = !1, this.elastic = c2(s), c !== this.constraints && !Ta(l) && o && this.constraints && !this.hasMutatedConstraints && sn((d) => {
      this.constraints !== !1 && this.getAxisMotionValue(d) && (this.constraints[d] = u2(o.layoutBox[d], this.constraints[d]));
    });
  }
  resolveRefConstraints() {
    const { dragConstraints: l, onMeasureDragConstraints: s } = this.getProps();
    if (!l || !Ta(l))
      return !1;
    const o = l.current, { projection: c } = this.visualElement;
    if (!c || !c.layout)
      return !1;
    c.root && (c.root.scroll = void 0, c.root.updateScroll());
    const d = Sx(o, c.root, this.visualElement.getTransformPagePoint());
    let f = o2(c.layout.layoutBox, d);
    if (s) {
      const m = s(gx(f));
      this.hasMutatedConstraints = !!m, m && (f = _v(m));
    }
    return f;
  }
  startAnimation(l) {
    const { drag: s, dragMomentum: o, dragElastic: c, dragTransition: d, dragSnapToOrigin: f, onDragTransitionEnd: m } = this.getProps(), y = this.constraints || {}, p = sn((v) => {
      if (!co(v, s, this.currentDirection))
        return;
      let b = y && y[v] || {};
      (f === !0 || f === v) && (b = { min: 0, max: 0 });
      const T = c ? 200 : 1e6, O = c ? 40 : 1e7, M = {
        type: "inertia",
        velocity: o ? l[v] : 0,
        bounceStiffness: T,
        bounceDamping: O,
        timeConstant: 750,
        restDelta: 1,
        restSpeed: 10,
        ...d,
        ...b
      };
      return this.startAxisValueAnimation(v, M);
    });
    return Promise.all(p).then(m);
  }
  startAxisValueAnimation(l, s) {
    const o = this.getAxisMotionValue(l);
    return _c(this.visualElement, l), o.start(cf(l, o, 0, s, this.visualElement, !1));
  }
  stopAnimation() {
    sn((l) => this.getAxisMotionValue(l).stop());
  }
  /**
   * Drag works differently depending on which props are provided.
   *
   * - If _dragX and _dragY are provided, we output the gesture delta directly to those motion values.
   * - Otherwise, we apply the delta to the x/y motion values.
   */
  getAxisMotionValue(l) {
    const s = `_drag${l.toUpperCase()}`, c = this.visualElement.getProps()[s];
    return c || this.visualElement.getValue(l, this.visualElement.latestValues[l] ?? 0);
  }
  snapToCursor(l) {
    sn((s) => {
      const { drag: o } = this.getProps();
      if (!co(s, o, this.currentDirection))
        return;
      const { projection: c } = this.visualElement, d = this.getAxisMotionValue(s);
      if (c && c.layout) {
        const { min: f, max: m } = c.layout.layoutBox[s], y = d.get() || 0;
        d.set(l[s] - _t(f, m, 0.5) + y);
      }
    });
  }
  /**
   * When the viewport resizes we want to check if the measured constraints
   * have changed and, if so, reposition the element within those new constraints
   * relative to where it was before the resize.
   */
  scalePositionWithinConstraints() {
    if (!this.visualElement.current)
      return;
    const { drag: l, dragConstraints: s } = this.getProps(), { projection: o } = this.visualElement;
    if (!Ta(s) || !o || !this.constraints)
      return;
    this.stopAnimation();
    const c = { x: 0, y: 0 };
    sn((f) => {
      const m = this.getAxisMotionValue(f);
      if (m && this.constraints !== !1) {
        const y = m.get();
        c[f] = r2({ min: y, max: y }, this.constraints[f]);
      }
    });
    const { transformTemplate: d } = this.visualElement.getProps();
    this.visualElement.current.style.transform = d ? d({}, "") : "none", o.root && o.root.updateScroll(), o.updateLayout(), this.constraints = !1, this.resolveConstraints(), sn((f) => {
      if (!co(f, l, null))
        return;
      const m = this.getAxisMotionValue(f), { min: y, max: p } = this.constraints[f];
      m.set(_t(y, p, c[f]));
    }), this.visualElement.render();
  }
  addListeners() {
    if (!this.visualElement.current)
      return;
    f2.set(this.visualElement, this);
    const l = this.visualElement.current, s = Vl(l, "pointerdown", (p) => {
      const { drag: v, dragListener: b = !0 } = this.getProps(), T = p.target, O = T !== l && tx(T);
      v && b && !O && this.start(p);
    });
    let o;
    const c = () => {
      const { dragConstraints: p } = this.getProps();
      Ta(p) && p.current && (this.constraints = this.resolveRefConstraints(), o || (o = d2(l, p.current, () => this.scalePositionWithinConstraints())));
    }, { projection: d } = this.visualElement, f = d.addEventListener("measure", c);
    d && !d.layout && (d.root && d.root.updateScroll(), d.updateLayout()), Ut.read(c);
    const m = Ll(window, "resize", () => this.scalePositionWithinConstraints()), y = d.addEventListener("didUpdate", (({ delta: p, hasLayoutChanged: v }) => {
      this.isDragging && v && (sn((b) => {
        const T = this.getAxisMotionValue(b);
        T && (this.originPoint[b] += p[b].translate, T.set(T.get() + p[b].translate));
      }), this.visualElement.render());
    }));
    return () => {
      m(), s(), f(), y && y(), o && o();
    };
  }
  getProps() {
    const l = this.visualElement.getProps(), { drag: s = !1, dragDirectionLock: o = !1, dragPropagation: c = !1, dragConstraints: d = !1, dragElastic: f = Xc, dragMomentum: m = !0 } = l;
    return {
      ...l,
      drag: s,
      dragDirectionLock: o,
      dragPropagation: c,
      dragConstraints: d,
      dragElastic: f,
      dragMomentum: m
    };
  }
}
function tg(i) {
  let l = !0;
  return () => {
    if (l) {
      l = !1;
      return;
    }
    i();
  };
}
function d2(i, l, s) {
  const o = uy(i, tg(s)), c = uy(l, tg(s));
  return () => {
    o(), c();
  };
}
function co(i, l, s) {
  return (l === !0 || l === i) && (s === null || s === i);
}
function m2(i, l = 10) {
  let s = null;
  return Math.abs(i.y) > l ? s = "y" : Math.abs(i.x) > l && (s = "x"), s;
}
class p2 extends ri {
  constructor(l) {
    super(l), this.removeGroupControls = Ze, this.removeListeners = Ze, this.controls = new h2(l);
  }
  mount() {
    const { dragControls: l } = this.node.getProps();
    l && (this.removeGroupControls = l.subscribe(this.controls)), this.removeListeners = this.controls.addListeners() || Ze;
  }
  update() {
    const { dragControls: l } = this.node.getProps(), { dragControls: s } = this.node.prevProps || {};
    l !== s && (this.removeGroupControls(), l && (this.removeGroupControls = l.subscribe(this.controls)));
  }
  unmount() {
    this.removeGroupControls(), this.removeListeners(), this.controls.isDragging || this.controls.endPanSession();
  }
}
const yc = (i) => (l, s) => {
  i && Ut.update(() => i(l, s), !1, !0);
};
class y2 extends ri {
  constructor() {
    super(...arguments), this.removePointerDownListener = Ze;
  }
  onPointerDown(l) {
    this.session = new h0(l, this.createPanHandlers(), {
      transformPagePoint: this.node.getTransformPagePoint(),
      contextWindow: f0(this.node)
    });
  }
  createPanHandlers() {
    const { onPanSessionStart: l, onPanStart: s, onPan: o, onPanEnd: c } = this.node.getProps();
    return {
      onSessionStart: yc(l),
      onStart: yc(s),
      onMove: yc(o),
      onEnd: (d, f) => {
        delete this.session, c && Ut.postRender(() => c(d, f));
      }
    };
  }
  mount() {
    this.removePointerDownListener = Vl(this.node.current, "pointerdown", (l) => this.onPointerDown(l));
  }
  update() {
    this.session && this.session.updateHandlers(this.createPanHandlers());
  }
  unmount() {
    this.removePointerDownListener(), this.session && this.session.end();
  }
}
let gc = !1;
class g2 extends it.Component {
  /**
   * This only mounts projection nodes for components that
   * need measuring, we might want to do it for all components
   * in order to incorporate transforms
   */
  componentDidMount() {
    const { visualElement: l, layoutGroup: s, switchLayoutGroup: o, layoutId: c } = this.props, { projection: d } = l;
    d && (s.group && s.group.add(d), o && o.register && c && o.register(d), gc && d.root.didUpdate(), d.addEventListener("animationComplete", () => {
      this.safeToRemove();
    }), d.setOptions({
      ...d.options,
      layoutDependency: this.props.layoutDependency,
      onExitComplete: () => this.safeToRemove()
    })), bo.hasEverUpdated = !0;
  }
  getSnapshotBeforeUpdate(l) {
    const { layoutDependency: s, visualElement: o, drag: c, isPresent: d } = this.props, { projection: f } = o;
    return f && (f.isPresent = d, l.layoutDependency !== s && f.setOptions({
      ...f.options,
      layoutDependency: s
    }), gc = !0, c || l.layoutDependency !== s || s === void 0 || l.isPresent !== d ? f.willUpdate() : this.safeToRemove(), l.isPresent !== d && (d ? f.promote() : f.relegate() || Ut.postRender(() => {
      const m = f.getStack();
      (!m || !m.members.length) && this.safeToRemove();
    }))), null;
  }
  componentDidUpdate() {
    const { visualElement: l, layoutAnchor: s } = this.props, { projection: o } = l;
    o && (o.options.layoutAnchor = s, o.root.didUpdate(), yf.postRender(() => {
      !o.currentAnimation && o.isLead() && this.safeToRemove();
    }));
  }
  componentWillUnmount() {
    const { visualElement: l, layoutGroup: s, switchLayoutGroup: o } = this.props, { projection: c } = l;
    gc = !0, c && (c.scheduleCheckAfterUnmount(), s && s.group && s.group.remove(c), o && o.deregister && o.deregister(c));
  }
  safeToRemove() {
    const { safeToRemove: l } = this.props;
    l && l();
  }
  render() {
    return null;
  }
}
function m0(i) {
  const [l, s] = EE(), o = it.useContext(Mg);
  return _e.jsx(g2, { ...i, layoutGroup: o, switchLayoutGroup: it.useContext(u0), isPresent: l, safeToRemove: s });
}
const v2 = {
  pan: {
    Feature: y2
  },
  drag: {
    Feature: p2,
    ProjectionNode: n0,
    MeasureLayout: m0
  }
};
function eg(i, l, s) {
  const { props: o } = i;
  i.animationState && o.whileHover && i.animationState.setActive("whileHover", s === "Start");
  const c = "onHover" + s, d = o[c];
  d && Ut.postRender(() => d(l, Yl(l)));
}
class b2 extends ri {
  mount() {
    const { current: l } = this.node;
    l && (this.unmount = PA(l, (s, o) => (eg(this.node, o, "Start"), (c) => eg(this.node, c, "End"))));
  }
  unmount() {
  }
}
class S2 extends ri {
  constructor() {
    super(...arguments), this.isActive = !1;
  }
  onFocus() {
    let l = !1;
    try {
      l = this.node.current.matches(":focus-visible");
    } catch {
      l = !0;
    }
    !l || !this.node.animationState || (this.node.animationState.setActive("whileFocus", !0), this.isActive = !0);
  }
  onBlur() {
    !this.isActive || !this.node.animationState || (this.node.animationState.setActive("whileFocus", !1), this.isActive = !1);
  }
  mount() {
    this.unmount = jl(Ll(this.node.current, "focus", () => this.onFocus()), Ll(this.node.current, "blur", () => this.onBlur()));
  }
  unmount() {
  }
}
function ng(i, l, s) {
  const { props: o } = i;
  if (i.current instanceof HTMLButtonElement && i.current.disabled)
    return;
  i.animationState && o.whileTap && i.animationState.setActive("whileTap", s === "Start");
  const c = "onTap" + (s === "End" ? "" : s), d = o[c];
  d && Ut.postRender(() => d(l, Yl(l)));
}
class T2 extends ri {
  mount() {
    const { current: l } = this.node;
    if (!l)
      return;
    const { globalTapTarget: s, propagate: o } = this.node.props;
    this.unmount = nx(l, (c, d) => (ng(this.node, d, "Start"), (f, { success: m }) => ng(this.node, f, m ? "End" : "Cancel")), {
      useGlobalTarget: s,
      stopPropagation: o?.tap === !1
    });
  }
  unmount() {
  }
}
const kc = /* @__PURE__ */ new WeakMap(), vc = /* @__PURE__ */ new WeakMap(), A2 = (i) => {
  const l = kc.get(i.target);
  l && l(i);
}, x2 = (i) => {
  i.forEach(A2);
};
function E2({ root: i, ...l }) {
  const s = i || document;
  vc.has(s) || vc.set(s, {});
  const o = vc.get(s), c = JSON.stringify(l);
  return o[c] || (o[c] = new IntersectionObserver(x2, { root: i, ...l })), o[c];
}
function M2(i, l, s) {
  const o = E2(l);
  return kc.set(i, s), o.observe(i), () => {
    kc.delete(i), o.unobserve(i);
  };
}
const D2 = {
  some: 0,
  all: 1
};
class z2 extends ri {
  constructor() {
    super(...arguments), this.hasEnteredView = !1, this.isInView = !1;
  }
  startObserver() {
    this.stopObserver?.();
    const { viewport: l = {} } = this.node.getProps(), { root: s, margin: o, amount: c = "some", once: d } = l, f = {
      root: s ? s.current : void 0,
      rootMargin: o,
      threshold: typeof c == "number" ? c : D2[c]
    }, m = (y) => {
      const { isIntersecting: p } = y;
      if (this.isInView === p || (this.isInView = p, d && !p && this.hasEnteredView))
        return;
      p && (this.hasEnteredView = !0), this.node.animationState && this.node.animationState.setActive("whileInView", p);
      const { onViewportEnter: v, onViewportLeave: b } = this.node.getProps(), T = p ? v : b;
      T && T(y);
    };
    this.stopObserver = M2(this.node.current, f, m);
  }
  mount() {
    this.startObserver();
  }
  update() {
    if (typeof IntersectionObserver > "u")
      return;
    const { props: l, prevProps: s } = this.node;
    ["amount", "margin", "root"].some(C2(l, s)) && this.startObserver();
  }
  unmount() {
    this.stopObserver?.(), this.hasEnteredView = !1, this.isInView = !1;
  }
}
function C2({ viewport: i = {} }, { viewport: l = {} } = {}) {
  return (s) => i[s] !== l[s];
}
const R2 = {
  inView: {
    Feature: z2
  },
  tap: {
    Feature: T2
  },
  focus: {
    Feature: S2
  },
  hover: {
    Feature: b2
  }
}, O2 = {
  layout: {
    ProjectionNode: n0,
    MeasureLayout: m0
  }
}, w2 = {
  ...t2,
  ...R2,
  ...v2,
  ...O2
}, V2 = /* @__PURE__ */ FE(w2, PE);
function _2(i) {
  const l = Dg(() => si(i)), { isStatic: s } = it.useContext(Af);
  if (s) {
    const [, o] = it.useState(i);
    it.useEffect(() => l.on("change", o), []);
  }
  return l;
}
function Mf(i) {
  return typeof i == "object" && !Array.isArray(i);
}
function p0(i, l, s, o) {
  return i == null ? [] : typeof i == "string" && Mf(l) ? pf(i, s, o) : i instanceof NodeList ? Array.from(i) : Array.isArray(i) ? i.filter((c) => c != null) : [i];
}
function B2(i, l, s) {
  return i * (l + 1) + s * l;
}
function ig(i, l, s, o) {
  return typeof l == "number" ? l : l.startsWith("-") || l.startsWith("+") ? Math.max(0, i + parseFloat(l)) : l === "<" ? s : l.startsWith("<") ? Math.max(0, s + parseFloat(l.slice(1))) : o.get(l) ?? i;
}
function U2(i, l, s) {
  for (let o = 0; o < i.length; o++) {
    const c = i[o];
    c.at > l && c.at < s && (Ma(i, c), o--);
  }
}
function N2(i, l, s, o, c, d) {
  U2(i, c, d);
  for (let f = 0; f < l.length; f++)
    i.push({
      value: l[f],
      at: _t(c, d, o[f]),
      easing: /* @__PURE__ */ Yg(s, f)
    });
}
function L2(i, l, s = 0) {
  const o = l + 1 + l * s;
  for (let c = 0; c < i.length; c++)
    i[c] = i[c] / o;
}
function j2(i, l) {
  return i.at === l.at ? i.value === null ? 1 : l.value === null ? -1 : 0 : i.at - l.at;
}
const H2 = "easeInOut", G2 = 20;
function Y2(i, { defaultTransition: l = {}, ...s } = {}, o, c) {
  const d = l.duration || 0.3, f = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map(), y = {}, p = /* @__PURE__ */ new Map();
  let v = 0, b = 0, T = 0;
  for (let O = 0; O < i.length; O++) {
    const M = i[O];
    if (typeof M == "string") {
      p.set(M, b);
      continue;
    } else if (!Array.isArray(M)) {
      p.set(M.name, ig(b, M.at, v, p));
      continue;
    }
    let [V, j, _ = {}] = M;
    _.at !== void 0 && (b = ig(b, _.at, v, p));
    let G = 0;
    const Y = (q, F, st, Q = 0, U = 0) => {
      const $ = q2(q), { delay: I = 0, times: ct = nv($), type: gt = l.type || "keyframes", repeat: jt, repeatType: Rt, repeatDelay: Mt = 0, ...R } = F;
      let { ease: X = l.ease || "easeOut", duration: Z } = F;
      const ut = typeof I == "function" ? I(Q, U) : I, k = $.length, A = rf(gt) ? gt : c?.[gt || "keyframes"];
      if (k <= 2 && A) {
        let tt = 100;
        if (k === 2 && Q2($)) {
          const Ht = $[1] - $[0];
          tt = Math.abs(Ht);
        }
        const lt = {
          ...l,
          ...R
        };
        Z !== void 0 && (lt.duration = /* @__PURE__ */ Ae(Z));
        const pt = Ig(lt, tt, A);
        X = pt.ease, Z = pt.duration;
      }
      Z ?? (Z = d);
      const N = b + ut;
      ct.length === 1 && ct[0] === 0 && (ct[1] = 1);
      const K = ct.length - $.length;
      if (K > 0 && ev(ct, K), $.length === 1 && $.unshift(null), jt && jt < G2) {
        const tt = Z > 0 ? Mt / Z : 0;
        Z = B2(Z, jt, Mt);
        const lt = [...$], pt = [...ct];
        X = Array.isArray(X) ? [...X] : [X];
        const Ht = [...X], ht = Rt === "reverse" || Rt === "mirror";
        let Ke = lt, Be = Ht;
        ht && (Ke = [...lt].reverse(), Rt === "reverse" && (Be = [...Ht].reverse().map((ie) => typeof ie == "function" ? /* @__PURE__ */ Wc(ie) : ie)));
        for (let ie = 0; ie < jt; ie++) {
          const cn = ht && ie % 2 === 0, fe = cn ? Ke : lt, wa = cn ? Be : Ht, Ni = (ie + 1) * (1 + tt);
          tt > 0 && ($.push($[$.length - 1]), ct.push(Ni), X.push("linear")), $.push(...fe);
          for (let ui = 0; ui < fe.length; ui++)
            ct.push(pt[ui] + Ni), X.push(ui === 0 ? "linear" : /* @__PURE__ */ Yg(wa, ui - 1));
        }
        L2(ct, jt, tt);
      }
      const J = N + Z;
      N2(st, $, X, ct, N, J), G = Math.max(ut + Z, G), T = Math.max(J, T);
    };
    if (te(V)) {
      const q = ag(V, m);
      Y(j, _, lg("default", q));
    } else {
      const q = p0(V, j, o, y), F = q.length;
      for (let st = 0; st < F; st++) {
        j = j, _ = _;
        const Q = q[st], U = ag(Q, m);
        for (const $ in j)
          Y(j[$], X2(_, $), lg($, U), st, F);
      }
    }
    v = b, b += G;
  }
  return m.forEach((O, M) => {
    for (const V in O) {
      const j = O[V];
      j.sort(j2);
      const _ = [], G = [], Y = [];
      for (let Q = 0; Q < j.length; Q++) {
        const { at: U, value: $, easing: I } = j[Q];
        _.push($), G.push(/* @__PURE__ */ Da(0, T, U)), Y.push(I || "easeOut");
      }
      G[0] !== 0 && (G.unshift(0), _.unshift(_[0]), Y.unshift(H2)), G[G.length - 1] !== 1 && (G.push(1), _.push(null)), f.has(M) || f.set(M, {
        keyframes: {},
        transition: {}
      });
      const q = f.get(M);
      q.keyframes[V] = _;
      const { type: F, ...st } = l;
      q.transition[V] = {
        ...st,
        duration: T,
        ease: Y,
        times: G,
        ...s
      };
    }
  }), f;
}
function ag(i, l) {
  return !l.has(i) && l.set(i, {}), l.get(i);
}
function lg(i, l) {
  return l[i] || (l[i] = []), l[i];
}
function q2(i) {
  return Array.isArray(i) ? i : [i];
}
function X2(i, l) {
  return i && i[l] ? {
    ...i,
    ...i[l]
  } : { ...i };
}
const k2 = (i) => typeof i == "number", Q2 = (i) => i.every(k2);
function Z2(i) {
  const l = {
    presenceContext: null,
    props: {},
    visualState: {
      renderState: {
        transform: {},
        transformOrigin: {},
        style: {},
        vars: {},
        attrs: {}
      },
      latestValues: {}
    }
  }, s = wo(i) && !zv(i) ? new kv(l) : new Hv(l);
  s.mount(i), Ul.set(i, s);
}
function K2(i) {
  const l = {
    presenceContext: null,
    props: {},
    visualState: {
      renderState: {
        output: {}
      },
      latestValues: {}
    }
  }, s = new zx(l);
  s.mount(i), Ul.set(i, s);
}
function J2(i, l) {
  return te(i) || typeof i == "number" || typeof i == "string" && !Mf(l);
}
function y0(i, l, s, o) {
  const c = [];
  if (J2(i, l))
    c.push($v(i, Mf(l) && l.default || l, s && (s.default || s)));
  else {
    if (i == null)
      return c;
    const d = p0(i, l, o), f = d.length;
    for (let m = 0; m < f; m++) {
      const y = d[m], p = y instanceof Element ? Z2 : K2;
      Ul.has(y) || p(y);
      const v = Ul.get(y), b = { ...s };
      "delay" in b && typeof b.delay == "function" && (b.delay = b.delay(m, f)), c.push(...df(v, { ...l, transition: b }, {}));
    }
  }
  return c;
}
function F2(i, l, s) {
  const o = [], c = i.map((f) => {
    if (Array.isArray(f) && typeof f[0] == "function") {
      const m = f[0], y = si(0);
      return y.on("change", m), f.length === 1 ? [y, [0, 1]] : f.length === 2 ? [y, [0, 1], f[1]] : [y, f[1], f[2]];
    }
    return f;
  });
  return Y2(c, l, s, { spring: Bl }).forEach(({ keyframes: f, transition: m }, y) => {
    o.push(...y0(y, f, m));
  }), o;
}
function P2(i) {
  return Array.isArray(i) && i.some(Array.isArray);
}
function W2(i = {}) {
  const { scope: l, reduceMotion: s, skipAnimations: o } = i;
  function c(d, f, m) {
    let y = [], p;
    const v = {};
    if (s !== void 0 && (v.reduceMotion = s), o !== void 0 && (v.skipAnimations = o), P2(d)) {
      const { onComplete: T, ...O } = f || {};
      typeof T == "function" && (p = T), y = F2(d, { ...v, ...O }, l);
    } else {
      const { onComplete: T, ...O } = m || {};
      typeof T == "function" && (p = T), y = y0(d, f, { ...v, ...O }, l);
    }
    const b = new yA(y);
    return p && b.finished.then(p), l && (l.animations.push(b), b.finished.then(() => {
      Ma(l.animations, b);
    })), b;
  }
  return c;
}
const sg = W2();
function og(i, l) {
  let s;
  return (...o) => {
    window.clearTimeout(s), s = window.setTimeout(() => i(...o), l);
  };
}
function $2({ debounce: i, scroll: l, polyfill: s, offsetSize: o } = { debounce: 0, scroll: !1, offsetSize: !1 }) {
  const c = s || (typeof window > "u" ? class {
  } : window.ResizeObserver);
  if (!c) throw new Error("This browser does not support ResizeObserver out of the box. See: https://github.com/react-spring/react-use-measure/#resize-observer-polyfills");
  const [d, f] = it.useState({ left: 0, top: 0, width: 0, height: 0, bottom: 0, right: 0, x: 0, y: 0 }), m = it.useRef({ element: null, scrollContainers: null, resizeObserver: null, lastBounds: d, orientationHandler: null }), y = i ? typeof i == "number" ? i : i.scroll : null, p = i ? typeof i == "number" ? i : i.resize : null, v = it.useRef(!1);
  it.useEffect(() => (v.current = !0, () => {
    v.current = !1;
  }));
  const [b, T, O] = it.useMemo(() => {
    const _ = () => {
      if (!m.current.element) return;
      const { left: G, top: Y, width: q, height: F, bottom: st, right: Q, x: U, y: $ } = m.current.element.getBoundingClientRect(), I = { left: G, top: Y, width: q, height: F, bottom: st, right: Q, x: U, y: $ };
      m.current.element instanceof HTMLElement && o && (I.height = m.current.element.offsetHeight, I.width = m.current.element.offsetWidth), Object.freeze(I), v.current && !nM(m.current.lastBounds, I) && f(m.current.lastBounds = I);
    };
    return [_, p ? og(_, p) : _, y ? og(_, y) : _];
  }, [f, o, y, p]);
  function M() {
    m.current.scrollContainers && (m.current.scrollContainers.forEach((_) => _.removeEventListener("scroll", O, !0)), m.current.scrollContainers = null), m.current.resizeObserver && (m.current.resizeObserver.disconnect(), m.current.resizeObserver = null), m.current.orientationHandler && ("orientation" in screen && "removeEventListener" in screen.orientation ? screen.orientation.removeEventListener("change", m.current.orientationHandler) : "onorientationchange" in window && window.removeEventListener("orientationchange", m.current.orientationHandler));
  }
  function V() {
    m.current.element && (m.current.resizeObserver = new c(O), m.current.resizeObserver.observe(m.current.element), l && m.current.scrollContainers && m.current.scrollContainers.forEach((_) => _.addEventListener("scroll", O, { capture: !0, passive: !0 })), m.current.orientationHandler = () => {
      O();
    }, "orientation" in screen && "addEventListener" in screen.orientation ? screen.orientation.addEventListener("change", m.current.orientationHandler) : "onorientationchange" in window && window.addEventListener("orientationchange", m.current.orientationHandler));
  }
  const j = (_) => {
    !_ || _ === m.current.element || (M(), m.current.element = _, m.current.scrollContainers = g0(_), V());
  };
  return tM(O, !!l), I2(T), it.useEffect(() => {
    M(), V();
  }, [l, O, T]), it.useEffect(() => M, []), [j, d, b];
}
function I2(i) {
  it.useEffect(() => {
    const l = i;
    return window.addEventListener("resize", l), () => {
      window.removeEventListener("resize", l);
    };
  }, [i]);
}
function tM(i, l) {
  it.useEffect(() => {
    if (l) {
      const s = i;
      return window.addEventListener("scroll", s, { capture: !0, passive: !0 }), () => {
        window.removeEventListener("scroll", s, !0);
      };
    }
  }, [i, l]);
}
function g0(i) {
  const l = [];
  if (!i || i === document.body) return l;
  const { overflow: s, overflowX: o, overflowY: c } = window.getComputedStyle(i);
  return [s, o, c].some((d) => d === "auto" || d === "scroll") && l.push(i), [...l, ...g0(i.parentElement)];
}
const eM = ["x", "y", "top", "bottom", "left", "right", "width", "height"], nM = (i, l) => eM.every((s) => i[s] === l[s]);
function iM({ children: i, gap: l = 16, duration: s = 25, durationOnHover: o, direction: c = "horizontal", reverse: d = !1, className: f }) {
  const [m, y] = it.useState(s), [p, { width: v, height: b }] = $2(), T = _2(0), [O, M] = it.useState(!1), [V, j] = it.useState(0);
  it.useEffect(() => {
    const G = c === "horizontal" ? v : b;
    if (!G) return;
    const Y = G + l, q = d ? -Y / 2 : 0, F = d ? 0 : -Y / 2, st = O ? sg(T, [T.get(), F], { ease: "linear", duration: m * Math.abs((T.get() - F) / (Y / 2)), onComplete: () => {
      M(!1), j((Q) => Q + 1);
    } }) : sg(T, [q, F], { ease: "linear", duration: m, repeat: 1 / 0, repeatType: "loop", repeatDelay: 0, onRepeat: () => T.set(q) });
    return () => st.stop();
  }, [V, T, m, v, b, l, O, c, d]);
  const _ = o ? { onHoverStart: () => {
    M(!0), y(o);
  }, onHoverEnd: () => {
    M(!0), y(s);
  } } : {};
  return /* @__PURE__ */ _e.jsx("div", { className: qS("overflow-hidden", f), children: /* @__PURE__ */ _e.jsxs(V2.div, { className: "flex w-max", ref: p, style: { ...c === "horizontal" ? { x: T } : { y: T }, gap: `${l}px`, flexDirection: c === "horizontal" ? "row" : "column" }, ..._, children: [
    i,
    i
  ] }) });
}
const rg = [{ name: "Rolex", src: "/assets/brands/rolex.svg" }, { name: "Patek Philippe", src: "/assets/brands/patek-philippe.svg" }, { name: "Audemars Piguet", src: "/assets/brands/audemars-piguet.svg" }, { name: "Blancpain", src: "/assets/brands/blancpain.svg" }, { name: "Breguet", src: "/assets/brands/breguet.svg" }, { name: "IWC", src: "/assets/brands/iwc.svg" }, { name: "Jaeger-LeCoultre", src: "/assets/brands/jaeger-lecoultre.svg" }, { name: "Longines", src: "/assets/brands/longines.svg" }, { name: "Omega", src: "/assets/brands/omega.svg" }, { name: "Panerai", src: "/assets/brands/panerai.png" }, { name: "Zenith", src: "/assets/brands/zenith.png" }];
function aM() {
  const [i, l] = it.useState(() => matchMedia("(prefers-reduced-motion: reduce)").matches);
  it.useEffect(() => {
    const o = matchMedia("(prefers-reduced-motion: reduce)"), c = () => l(o.matches);
    return o.addEventListener("change", c), () => o.removeEventListener("change", c);
  }, []);
  const s = rg.map((o) => /* @__PURE__ */ _e.jsx("span", { className: "brand-logo-cell", children: /* @__PURE__ */ _e.jsx("img", { src: o.src, "data-brand": o.name, alt: "", width: "150", height: "60" }) }, o.name));
  return /* @__PURE__ */ _e.jsxs("section", { className: "watch-brand-marquee", "aria-label": "Watch brands", children: [
    /* @__PURE__ */ _e.jsxs("p", { className: "sr-only", children: [
      rg.map((o) => o.name).join(", "),
      "."
    ] }),
    /* @__PURE__ */ _e.jsx("div", { "aria-hidden": "true", className: i ? "" : "brand-marquee-mask", children: i ? /* @__PURE__ */ _e.jsx("div", { className: "brand-marquee-static", children: s }) : /* @__PURE__ */ _e.jsx(iM, { gap: 50, duration: 55, durationOnHover: 100, reverse: !0, className: "w-full bg-white", children: s }) })
  ] });
}
const ug = document.getElementById("brand-marquee");
ug && F1.createRoot(ug).render(/* @__PURE__ */ _e.jsx(aM, {}));
