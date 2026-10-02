// Inline SVG icons recovered from the bundle (Lucide-style paths). Names are the original minified bindings.
import * as sl from "react";
import * as h0 from "react";
var p0 = {
    color: void 0,
    size: void 0,
    className: void 0,
    style: void 0,
    attr: void 0,
  },
  g0 = h0.default.createContext && h0.default.createContext(p0);
var _8 = ["attr", "size", "title"];
function T8(t, e) {
  if (t == null) return {};
  var a,
    r,
    n = W8(t, e);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(t);
    for (r = 0; r < i.length; r++)
      ((a = i[r]),
        e.indexOf(a) === -1 &&
          {}.propertyIsEnumerable.call(t, a) &&
          (n[a] = t[a]));
  }
  return n;
}
function W8(t, e) {
  if (t == null) return {};
  var a = {};
  for (var r in t)
    if ({}.hasOwnProperty.call(t, r)) {
      if (e.indexOf(r) !== -1) continue;
      a[r] = t[r];
    }
  return a;
}
function Xs() {
  return (
    (Xs = Object.assign
      ? Object.assign.bind()
      : function (t) {
          for (var e = 1; e < arguments.length; e++) {
            var a = arguments[e];
            for (var r in a) ({}).hasOwnProperty.call(a, r) && (t[r] = a[r]);
          }
          return t;
        }),
    Xs.apply(null, arguments)
  );
}
function Fv(t, e) {
  var a = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(t);
    (e &&
      (r = r.filter(function (n) {
        return Object.getOwnPropertyDescriptor(t, n).enumerable;
      })),
      a.push.apply(a, r));
  }
  return a;
}
function Qs(t) {
  for (var e = 1; e < arguments.length; e++) {
    var a = arguments[e] != null ? arguments[e] : {};
    e % 2
      ? Fv(Object(a), !0).forEach(function (r) {
          O8(t, r, a[r]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(a))
        : Fv(Object(a)).forEach(function (r) {
            Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(a, r));
          });
  }
  return t;
}
function O8(t, e, a) {
  return (
    (e = E8(e)) in t
      ? Object.defineProperty(t, e, {
          value: a,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        })
      : (t[e] = a),
    t
  );
}
function E8(t) {
  var e = H8(t, "string");
  return typeof e == "symbol" ? e : e + "";
}
function H8(t, e) {
  if (typeof t != "object" || !t) return t;
  var a = t[Symbol.toPrimitive];
  if (a !== void 0) {
    var r = a.call(t, e || "default");
    if (typeof r != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
function Zv(t) {
  return (
    t &&
    t.map((e, a) =>
      sl.default.createElement(
        e.tag,
        Qs(
          {
            key: a,
          },
          e.attr,
        ),
        Zv(e.child),
      ),
    )
  );
}
function ft(t) {
  return (e) =>
    sl.default.createElement(
      R8,
      Xs(
        {
          attr: Qs({}, t.attr),
        },
        e,
      ),
      Zv(t.child),
    );
}
function R8(t) {
  var e = (a) => {
    var r = t.attr,
      n = t.size,
      i = t.title,
      o = T8(t, _8),
      l = n || a.size || "1em",
      d;
    return (
      a.className && (d = a.className),
      t.className && (d = (d ? d + " " : "") + t.className),
      sl.default.createElement(
        "svg",
        Xs(
          {
            stroke: "currentColor",
            fill: "currentColor",
            strokeWidth: "0",
          },
          a.attr,
          r,
          o,
          {
            className: d,
            style: Qs(
              Qs(
                {
                  color: t.color || a.color,
                },
                a.style,
              ),
              t.style,
            ),
            height: l,
            width: l,
            xmlns: "http://www.w3.org/2000/svg",
          },
        ),
        i && sl.default.createElement("title", null, i),
        t.children,
      )
    );
  };
  return g0 !== void 0
    ? sl.default.createElement(g0.Consumer, null, (a) => e(a))
    : e(p0);
}
function Vd(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "M18 6 6 18",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "m6 6 12 12",
        },
        child: [],
      },
    ],
  })(t);
}
function qv(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
        },
        child: [],
      },
    ],
  })(t);
}
function Js(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8",
        },
        child: [],
      },
    ],
  })(t);
}
function t2(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
        },
        child: [],
      },
      {
        tag: "circle",
        attr: {
          cx: "9",
          cy: "7",
          r: "4",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M22 21v-2a4 4 0 0 0-3-3.87",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M16 3.13a4 4 0 0 1 0 7.75",
        },
        child: [],
      },
    ],
  })(t);
}
function Gv(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
        },
        child: [],
      },
      {
        tag: "circle",
        attr: {
          cx: "9",
          cy: "7",
          r: "4",
        },
        child: [],
      },
      {
        tag: "line",
        attr: {
          x1: "19",
          x2: "19",
          y1: "8",
          y2: "14",
        },
        child: [],
      },
      {
        tag: "line",
        attr: {
          x1: "22",
          x2: "16",
          y1: "11",
          y2: "11",
        },
        child: [],
      },
    ],
  })(t);
}
function Kv(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
        },
        child: [],
      },
      {
        tag: "circle",
        attr: {
          cx: "9",
          cy: "7",
          r: "4",
        },
        child: [],
      },
      {
        tag: "polyline",
        attr: {
          points: "16 11 18 13 22 9",
        },
        child: [],
      },
    ],
  })(t);
}
function Yv(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M15 18H9",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14",
        },
        child: [],
      },
      {
        tag: "circle",
        attr: {
          cx: "17",
          cy: "18",
          r: "2",
        },
        child: [],
      },
      {
        tag: "circle",
        attr: {
          cx: "7",
          cy: "18",
          r: "2",
        },
        child: [],
      },
    ],
  })(t);
}
function ul(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M12 9v4",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M12 17h.01",
        },
        child: [],
      },
    ],
  })(t);
}
function e2(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "M3 6h18",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",
        },
        child: [],
      },
      {
        tag: "line",
        attr: {
          x1: "10",
          x2: "10",
          y1: "11",
          y2: "17",
        },
        child: [],
      },
      {
        tag: "line",
        attr: {
          x1: "14",
          x2: "14",
          y1: "11",
          y2: "17",
        },
        child: [],
      },
    ],
  })(t);
}
function a2(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "line",
        attr: {
          x1: "10",
          x2: "14",
          y1: "2",
          y2: "2",
        },
        child: [],
      },
      {
        tag: "line",
        attr: {
          x1: "12",
          x2: "15",
          y1: "14",
          y2: "11",
        },
        child: [],
      },
      {
        tag: "circle",
        attr: {
          cx: "12",
          cy: "14",
          r: "8",
        },
        child: [],
      },
    ],
  })(t);
}
function Xv(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "M10 2h4",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M12 14v-4",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M4 13a8 8 0 0 1 8-7 8 8 0 1 1-5.3 14L4 17.6",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M9 17H4v5",
        },
        child: [],
      },
    ],
  })(t);
}
function Qv(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "circle",
        attr: {
          cx: "12",
          cy: "12",
          r: "4",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M12 2v2",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M12 20v2",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "m4.93 4.93 1.41 1.41",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "m17.66 17.66 1.41 1.41",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M2 12h2",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M20 12h2",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "m6.34 17.66-1.41 1.41",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "m19.07 4.93-1.41 1.41",
        },
        child: [],
      },
    ],
  })(t);
}
function r2(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M20 3v4",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M22 5h-4",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M4 17v2",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M5 18H3",
        },
        child: [],
      },
    ],
  })(t);
}
function Jv(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "M7 18v-6a5 5 0 1 1 10 0v6",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M5 21a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2z",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M21 12h1",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M18.5 4.5 18 5",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M2 12h1",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M12 2v1",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "m4.929 4.929.707.707",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M12 12v6",
        },
        child: [],
      },
    ],
  })(t);
}
function tk(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "m9 12 2 2 4-4",
        },
        child: [],
      },
    ],
  })(t);
}
function n2(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M12 8v4",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M12 16h.01",
        },
        child: [],
      },
    ],
  })(t);
}
function ek(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",
        },
        child: [],
      },
      {
        tag: "circle",
        attr: {
          cx: "12",
          cy: "12",
          r: "3",
        },
        child: [],
      },
    ],
  })(t);
}
function Pd(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "m21.854 2.147-10.94 10.939",
        },
        child: [],
      },
    ],
  })(t);
}
function i2(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "circle",
        attr: {
          cx: "11",
          cy: "11",
          r: "8",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "m21 21-4.3-4.3",
        },
        child: [],
      },
    ],
  })(t);
}
function ak(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "M15 12h-5",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M15 8h-5",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M19 17V5a2 2 0 0 0-2-2H4",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3",
        },
        child: [],
      },
    ],
  })(t);
}
function rk(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M7 21h10",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M12 3v18",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2",
        },
        child: [],
      },
    ],
  })(t);
}
function nk(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5",
        },
        child: [],
      },
    ],
  })(t);
}
function ik(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M21 3v5h-5",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M8 16H3v5",
        },
        child: [],
      },
    ],
  })(t);
}
function ok(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M12 17.5v-11",
        },
        child: [],
      },
    ],
  })(t);
}
function hl(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "M19.07 4.93A10 10 0 0 0 6.99 3.34",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M4 6h.01",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M2.29 9.62A10 10 0 1 0 21.31 8.35",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M16.24 7.76A6 6 0 1 0 8.23 16.67",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M12 18h.01",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M17.99 11.66A6 6 0 0 1 15.77 16.67",
        },
        child: [],
      },
      {
        tag: "circle",
        attr: {
          cx: "12",
          cy: "12",
          r: "2",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "m13.41 10.59 5.66-5.66",
        },
        child: [],
      },
    ],
  })(t);
}
function Fr(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "M5 12h14",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M12 5v14",
        },
        child: [],
      },
    ],
  })(t);
}
function lk(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "M12 22v-5",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M9 8V2",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M15 8V2",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z",
        },
        child: [],
      },
    ],
  })(t);
}
function o2(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "polygon",
        attr: {
          points: "6 3 20 12 6 21 6 3",
        },
        child: [],
      },
    ],
  })(t);
}
function dk(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
        },
        child: [],
      },
    ],
  })(t);
}
function ck(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "rect",
        attr: {
          x: "14",
          y: "4",
          width: "4",
          height: "16",
          rx: "1",
        },
        child: [],
      },
      {
        tag: "rect",
        attr: {
          x: "6",
          y: "4",
          width: "4",
          height: "16",
          rx: "1",
        },
        child: [],
      },
    ],
  })(t);
}
function l2(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "m16 16 2 2 4-4",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "m7.5 4.27 9 5.15",
        },
        child: [],
      },
      {
        tag: "polyline",
        attr: {
          points: "3.29 7 12 12 20.71 7",
        },
        child: [],
      },
      {
        tag: "line",
        attr: {
          x1: "12",
          x2: "12",
          y1: "22",
          y2: "12",
        },
        child: [],
      },
    ],
  })(t);
}
function sk(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",
        },
        child: [],
      },
    ],
  })(t);
}
function uk(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "M5 12h14",
        },
        child: [],
      },
    ],
  })(t);
}
function hk(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "line",
        attr: {
          x1: "4",
          x2: "20",
          y1: "12",
          y2: "12",
        },
        child: [],
      },
      {
        tag: "line",
        attr: {
          x1: "4",
          x2: "20",
          y1: "6",
          y2: "6",
        },
        child: [],
      },
      {
        tag: "line",
        attr: {
          x1: "4",
          x2: "20",
          y1: "18",
          y2: "18",
        },
        child: [],
      },
    ],
  })(t);
}
function pk(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "m3 11 18-5v12L3 14v-3z",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M11.6 16.8a3 3 0 1 1-5.8-1.6",
        },
        child: [],
      },
    ],
  })(t);
}
function gk(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",
        },
        child: [],
      },
      {
        tag: "polyline",
        attr: {
          points: "16 17 21 12 16 7",
        },
        child: [],
      },
      {
        tag: "line",
        attr: {
          x1: "21",
          x2: "9",
          y1: "12",
          y2: "12",
        },
        child: [],
      },
    ],
  })(t);
}
function fk(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "m3 17 2 2 4-4",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "m3 7 2 2 4-4",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M13 6h8",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M13 12h8",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M13 18h8",
        },
        child: [],
      },
    ],
  })(t);
}
function mk(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "circle",
        attr: {
          cx: "12",
          cy: "12",
          r: "10",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "m4.93 4.93 4.24 4.24",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "m14.83 9.17 4.24-4.24",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "m14.83 14.83 4.24 4.24",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "m9.17 14.83-4.24 4.24",
        },
        child: [],
      },
      {
        tag: "circle",
        attr: {
          cx: "12",
          cy: "12",
          r: "4",
        },
        child: [],
      },
    ],
  })(t);
}
function vk(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "rect",
        attr: {
          width: "7",
          height: "9",
          x: "3",
          y: "3",
          rx: "1",
        },
        child: [],
      },
      {
        tag: "rect",
        attr: {
          width: "7",
          height: "5",
          x: "14",
          y: "3",
          rx: "1",
        },
        child: [],
      },
      {
        tag: "rect",
        attr: {
          width: "7",
          height: "9",
          x: "14",
          y: "12",
          rx: "1",
        },
        child: [],
      },
      {
        tag: "rect",
        attr: {
          width: "7",
          height: "5",
          x: "3",
          y: "16",
          rx: "1",
        },
        child: [],
      },
    ],
  })(t);
}
function kk(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "m5 8 6 6",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "m4 14 6-6 2-3",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M2 5h12",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M7 2h1",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "m22 22-5-10-5 10",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M14 18h6",
        },
        child: [],
      },
    ],
  })(t);
}
function f0(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "circle",
        attr: {
          cx: "12",
          cy: "12",
          r: "10",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M12 16v-4",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M12 8h.01",
        },
        child: [],
      },
    ],
  })(t);
}
function xk(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
        },
        child: [],
      },
    ],
  })(t);
}
function yk(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "m11 17 2 2a1 1 0 1 0 3-3",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "m21 3 1 11h-2",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M3 4h8",
        },
        child: [],
      },
    ],
  })(t);
}
function Lk(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "rect",
        attr: {
          width: "18",
          height: "18",
          x: "3",
          y: "3",
          rx: "2",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M3 9h18",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M3 15h18",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M9 3v18",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M15 3v18",
        },
        child: [],
      },
    ],
  })(t);
}
function Mk(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "line",
        attr: {
          x1: "6",
          x2: "6",
          y1: "3",
          y2: "15",
        },
        child: [],
      },
      {
        tag: "circle",
        attr: {
          cx: "18",
          cy: "6",
          r: "3",
        },
        child: [],
      },
      {
        tag: "circle",
        attr: {
          cx: "6",
          cy: "18",
          r: "3",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M18 9a9 9 0 0 1-9 9",
        },
        child: [],
      },
    ],
  })(t);
}
function d2(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "m12 14 4-4",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M3.34 19a10 10 0 1 1 17.32 0",
        },
        child: [],
      },
    ],
  })(t);
}
function pl(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M14 2v4a2 2 0 0 0 2 2h4",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M10 9H8",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M16 13H8",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M16 17H8",
        },
        child: [],
      },
    ],
  })(t);
}
function bk(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v2",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M14 2v4a2 2 0 0 0 2 2h4",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M10.29 10.7a2.43 2.43 0 0 0-2.66-.52c-.29.12-.56.3-.78.53l-.35.34-.35-.34a2.43 2.43 0 0 0-2.65-.53c-.3.12-.56.3-.79.53-.95.94-1 2.53.2 3.74L6.5 18l3.6-3.55c1.2-1.21 1.14-2.8.19-3.74Z",
        },
        child: [],
      },
    ],
  })(t);
}
function c2(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M14 2v4a2 2 0 0 0 2 2h4",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M12 18v-6",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "m9 15 3 3 3-3",
        },
        child: [],
      },
    ],
  })(t);
}
function wk(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "M4 10h12",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M4 14h9",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2",
        },
        child: [],
      },
    ],
  })(t);
}
function xr(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",
        },
        child: [],
      },
      {
        tag: "polyline",
        attr: {
          points: "7 10 12 15 17 10",
        },
        child: [],
      },
      {
        tag: "line",
        attr: {
          x1: "12",
          x2: "12",
          y1: "15",
          y2: "3",
        },
        child: [],
      },
    ],
  })(t);
}
function gl(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "rect",
        attr: {
          width: "14",
          height: "14",
          x: "8",
          y: "8",
          rx: "2",
          ry: "2",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",
        },
        child: [],
      },
    ],
  })(t);
}
function Ck(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "circle",
        attr: {
          cx: "12",
          cy: "12",
          r: "10",
        },
        child: [],
      },
      {
        tag: "polyline",
        attr: {
          points: "12 6 12 12 16.5 12",
        },
        child: [],
      },
    ],
  })(t);
}
function s2(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "rect",
        attr: {
          width: "8",
          height: "4",
          x: "8",
          y: "2",
          rx: "1",
          ry: "1",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "m9 14 2 2 4-4",
        },
        child: [],
      },
    ],
  })(t);
}
function Sk(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "circle",
        attr: {
          cx: "12",
          cy: "12",
          r: "10",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "m15 9-6 6",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "m9 9 6 6",
        },
        child: [],
      },
    ],
  })(t);
}
function Bk(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "circle",
        attr: {
          cx: "12",
          cy: "12",
          r: "10",
        },
        child: [],
      },
      {
        tag: "rect",
        attr: {
          x: "9",
          y: "9",
          width: "6",
          height: "6",
          rx: "1",
        },
        child: [],
      },
    ],
  })(t);
}
function Zr(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "circle",
        attr: {
          cx: "12",
          cy: "12",
          r: "10",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "m9 12 2 2 4-4",
        },
        child: [],
      },
    ],
  })(t);
}
function u2(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "circle",
        attr: {
          cx: "12",
          cy: "12",
          r: "10",
        },
        child: [],
      },
      {
        tag: "line",
        attr: {
          x1: "12",
          x2: "12",
          y1: "8",
          y2: "12",
        },
        child: [],
      },
      {
        tag: "line",
        attr: {
          x1: "12",
          x2: "12.01",
          y1: "16",
          y2: "16",
        },
        child: [],
      },
    ],
  })(t);
}
function Nk(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "M3 3v16a2 2 0 0 0 2 2h16",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M7 16h8",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M7 11h12",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M7 6h3",
        },
        child: [],
      },
    ],
  })(t);
}
function Ak(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M16 2v4",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M8 2v4",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M3 10h5",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M17.5 17.5 16 16.3V14",
        },
        child: [],
      },
      {
        tag: "circle",
        attr: {
          cx: "16",
          cy: "16",
          r: "6",
        },
        child: [],
      },
    ],
  })(t);
}
function jk(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M10 6h4",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M10 10h4",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M10 14h4",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M10 18h4",
        },
        child: [],
      },
    ],
  })(t);
}
function fl(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "M12 8V4H8",
        },
        child: [],
      },
      {
        tag: "rect",
        attr: {
          width: "16",
          height: "12",
          x: "4",
          y: "8",
          rx: "2",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M2 14h2",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M20 14h2",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M15 13v2",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M9 13v2",
        },
        child: [],
      },
    ],
  })(t);
}
function _k(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "circle",
        attr: {
          cx: "18.5",
          cy: "17.5",
          r: "3.5",
        },
        child: [],
      },
      {
        tag: "circle",
        attr: {
          cx: "5.5",
          cy: "17.5",
          r: "3.5",
        },
        child: [],
      },
      {
        tag: "circle",
        attr: {
          cx: "15",
          cy: "5",
          r: "1",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M12 17.5V14l-3-3 4-3 2 3h2",
        },
        child: [],
      },
    ],
  })(t);
}
function Tk(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M10.3 21a1.94 1.94 0 0 0 3.4 0",
        },
        child: [],
      },
    ],
  })(t);
}
function h2(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "rect",
        attr: {
          width: "20",
          height: "12",
          x: "2",
          y: "6",
          rx: "2",
        },
        child: [],
      },
      {
        tag: "circle",
        attr: {
          cx: "12",
          cy: "12",
          r: "2",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M6 12h.01M18 12h.01",
        },
        child: [],
      },
    ],
  })(t);
}
function Wk(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "m5 12 7-7 7 7",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M12 19V5",
        },
        child: [],
      },
    ],
  })(t);
}
function p2(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "M5 12h14",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "m12 5 7 7-7 7",
        },
        child: [],
      },
    ],
  })(t);
}
function Ok(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "m12 19-7-7 7-7",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M19 12H5",
        },
        child: [],
      },
    ],
  })(t);
}
function Ek(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "M12 5v14",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "m19 12-7 7-7-7",
        },
        child: [],
      },
    ],
  })(t);
}
function hi(t) {
  return ft({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
        },
        child: [],
      },
    ],
  })(t);
}
export {
  Ak,
  Bk,
  Ck,
  Ek,
  Fr,
  Gv,
  Js,
  Jv,
  Kv,
  Lk,
  Mk,
  Nk,
  Ok,
  Pd,
  Qv,
  Sk,
  Tk,
  Vd,
  Wk,
  Xv,
  Yv,
  Zr,
  _k,
  a2,
  ak,
  bk,
  c2,
  ck,
  d2,
  dk,
  e2,
  ek,
  f0,
  fk,
  fl,
  gk,
  gl,
  h2,
  hi,
  hk,
  hl,
  i2,
  ik,
  jk,
  kk,
  l2,
  lk,
  mk,
  n2,
  nk,
  o2,
  ok,
  p2,
  pk,
  pl,
  qv,
  r2,
  rk,
  s2,
  sk,
  t2,
  tk,
  u2,
  uk,
  ul,
  vk,
  wk,
  xk,
  xr,
  yk,
};
