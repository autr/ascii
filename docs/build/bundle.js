var app=function(){"use strict";function e(){}function t(e){return e()}function n(){return Object.create(null)}function o(e){e.forEach(t)}function l(e){return"function"==typeof e}function r(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}function c(t,...n){if(null==t)return e;const o=t.subscribe(...n);return o.unsubscribe?()=>o.unsubscribe():o}function s(e,t,n){e.$$.on_destroy.push(c(t,n))}function i(e,t,n){return e.set(n),t}function a(e,t){e.appendChild(t)}function u(e,t,n){e.insertBefore(t,n||null)}function d(e){e.parentNode.removeChild(e)}function f(e,t){for(let n=0;n<e.length;n+=1)e[n]&&e[n].d(t)}function p(e){return document.createElement(e)}function A(e){return document.createTextNode(e)}function g(){return A(" ")}function h(){return A("")}function y(e,t,n,o){return e.addEventListener(t,n,o),()=>e.removeEventListener(t,n,o)}function E(e,t,n){null==n?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function T(e){return""===e?null:+e}function I(e,t){t=""+t,e.wholeText!==t&&(e.data=t)}function C(e,t){e.value=null==t?"":t}function V(e,t){for(let n=0;n<e.options.length;n+=1){const o=e.options[n];if(o.__value===t)return void(o.selected=!0)}e.selectedIndex=-1}function x(e){const t=e.querySelector(":checked")||e.options[0];return t&&t.__value}function m(e,t,n){e.classList[n?"add":"remove"](t)}let b;function w(e){b=e}const v=[],$=[],K=[],O=[],D=Promise.resolve();let H=!1;function k(e){K.push(e)}let M=!1;const _=new Set;function L(){if(!M){M=!0;do{for(let e=0;e<v.length;e+=1){const t=v[e];w(t),S(t.$$)}for(w(null),v.length=0;$.length;)$.pop()();for(let e=0;e<K.length;e+=1){const t=K[e];_.has(t)||(_.add(t),t())}K.length=0}while(v.length);for(;O.length;)O.pop()();H=!1,M=!1,_.clear()}}function S(e){if(null!==e.fragment){e.update(),o(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(k)}}const G=new Set;function N(e,t){e&&e.i&&(G.delete(e),e.i(t))}const U="undefined"!=typeof window?window:"undefined"!=typeof globalThis?globalThis:global;function R(e,n,r,c){const{fragment:s,on_mount:i,on_destroy:a,after_update:u}=e.$$;s&&s.m(n,r),c||k((()=>{const n=i.map(t).filter(l);a?a.push(...n):o(n),e.$$.on_mount=[]})),u.forEach(k)}function B(e,t){const n=e.$$;null!==n.fragment&&(o(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function Y(e,t){-1===e.$$.dirty[0]&&(v.push(e),H||(H=!0,D.then(L)),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function j(t,l,r,c,s,i,a,u=[-1]){const f=b;w(t);const p=t.$$={fragment:null,ctx:null,props:i,update:e,not_equal:s,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(l.context||(f?f.$$.context:[])),callbacks:n(),dirty:u,skip_bound:!1,root:l.target||f.$$.root};a&&a(p.root);let A=!1;if(p.ctx=r?r(t,l.props||{},((e,n,...o)=>{const l=o.length?o[0]:n;return p.ctx&&s(p.ctx[e],p.ctx[e]=l)&&(!p.skip_bound&&p.bound[e]&&p.bound[e](l),A&&Y(t,e)),n})):[],p.update(),A=!0,o(p.before_update),p.fragment=!!c&&c(p.ctx),l.target){if(l.hydrate){const e=function(e){return Array.from(e.childNodes)}(l.target);p.fragment&&p.fragment.l(e),e.forEach(d)}else p.fragment&&p.fragment.c();l.intro&&N(t.$$.fragment),R(t,l.target,l.anchor,l.customElement),L()}w(f)}class X{$destroy(){B(this,1),this.$destroy=e}$on(e,t){const n=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return n.push(t),()=>{const e=n.indexOf(t);-1!==e&&n.splice(e,1)}}$set(e){var t;this.$$set&&(t=e,0!==Object.keys(t).length)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}const F="rectangle",Z="text",P="pointer",Q="select",z="char",W="&nbsp;",q="start",J="center",ee="end",te="justify",ne=["Digit1","Digit2","Digit3","Digit4","Digit5","Digit6","Digit7","Digit8","Digit9","Digit0","Minus","Equal","KeyQ","KeyW","KeyE","KeyR","KeyT","KeyY","KeyU","KeyI","KeyO","KeyP","BracketLeft","BracketRight","KeyA","KeyS","KeyD","KeyF","KeyG","KeyH","KeyJ","KeyK","KeyL","Semicolon","Quote","Backslash","KeyZ","KeyX","KeyC","KeyV","KeyB","KeyN","KeyM","Comma","Period","Slash"],oe={tl:["╭","┌","┍","┎","┏","╭","╔","╒","╓"],tr:["╮","┐","┑","┒","┓","╮","╗","╕","╖"],bl:["╰","└","┕","┖","┗","╰","╚","╘","╙"],br:["╯","┘","┙","┚","┛","╯","╝","╛","╜"]},le={v:["│","┃","┆","┇","┊","┋","╎","╏","╽","╿","╵","╷","╹","╻"],h:["─","━","┄","┅","┈","┉","╌","╍","╼","╾","╴","╶","╸","╺"]},re=["▀","▁","▂","▃","▄","▅","▆","▇","█","▉","▊","▋","▌","▍","▎","▏","▐","░","▒","▓","▔","▕","▖","▗","▘","▙","▚","▛","▜","▝","▞","▟"],ce=["KeyQ","KeyW","KeyE","KeyR","KeyT","KeyY","KeyU","KeyI","KeyO","KeyP","BracketLeft","BracketRight","KeyA","KeyS","KeyD","KeyF","KeyG","KeyH","KeyJ","KeyK","KeyL","Semicolon","Quote","Backslash","KeyZ","KeyX","KeyC","KeyV","KeyB","KeyN","KeyM","Comma","Period","Slash"],se=["Q","W","E","R","T","Y","U","I","O","P","[","]","A","S","D","F","G","H","J","K","L",";","'","\\","Z","X","C","V","B","N","M",",",".","/"],ie=[[...re],[...le.h,...le.v,"╲","╱","╳"],[...oe.tl,...oe.tr,...oe.bl,...oe.br]],ae=window;function ue(){if(!ae.ACTIVE||ae?.ACTIVE?.type!=F)return;let{start:e,end:t}=ae.ACTIVE;console.log("[App] setting rectangle:",e,t);for(let n=0;n<height;n++)for(let o=0;o<width;o++){ae.ACTIVE.chars[n]||(ae.ACTIVE.chars[n]=[]);const l=n==e.y||n==t.y,r=o==e.x||o==t.x,c=o>=e.x&&o<=t.x,s=n>=e.y&&n<=t.y,i=n==e.y&&o==e.x,a=n==e.y&&o==t.x,u=n==t.y&&o==t.x,d=n==t.y&&o==e.x;let f=!0;const p=re[ae.ACTIVE.fill];i?ae.ACTIVE.chars[n][o]=oe.tl[ae.ACTIVE.corner]||p:a?ae.ACTIVE.chars[n][o]=oe.tr[ae.ACTIVE.corner]||p:u?ae.ACTIVE.chars[n][o]=oe.br[ae.ACTIVE.corner]||p:d?ae.ACTIVE.chars[n][o]=oe.bl[ae.ACTIVE.corner]||p:l&&c?ae.ACTIVE.chars[n][o]=le.h[ae.ACTIVE.sides]||p:r&&s?ae.ACTIVE.chars[n][o]=le.v[ae.ACTIVE.sides]||p:c&&s&&"number"==typeof ae.ACTIVE.fill?ae.ACTIVE.chars[n][o]=p:(ae.ACTIVE.chars[n][o]=null,f=!1),f&&(ae.HIGH[n]||(ae.HIGH[n]=[]),ae.HIGH[n][o]=!0)}}function de(){if(!ae.ACTIVE||ae?.ACTIVE?.type!=Z)return;let{start:e,end:t}=ae.ACTIVE;const n=ae.ACTIVE?.alignX||J,o=ae.ACTIVE?.alignY||J;console.log(`[App] setting textbox with x "${n}" and y "${o}"`);const l=t.x-e.x,r=t.y-e.y;ae.ACTIVE.text=ae.ACTIVE.text||"",ae.ACTIVE.lines=[];let c="";for(const e of ae.ACTIVE.text.split("\n")){for(const t of e.split(" "))if(c.length+t.length+1<l){c+=(""!=c?" ":"")+t}else ae.ACTIVE.lines.push(c),c=t;ae.ACTIVE.lines.push(c),c=""}ae.ACTIVE.chars.length=0;const{lines:s}=ae.ACTIVE,i=r-ae.ACTIVE.lines.length,a=o==J&&r>s.length,u=n==J,d=o==ee&&r>s.length,f=n==ee;for(let n=e.y;n<=t.y;n++)for(let o=e.x;o<=t.x;o++){ae.ACTIVE.chars[n]||(ae.ACTIVE.chars[n]=[]);let t=n-e.y,r=o-e.x;a&&(t-=i/2+.5),d&&(t-=i+1),t=Math.round(t);const c=s?.[t],p=l-c?.length;u&&c&&(r-=Math.round(p/2)),f&&c&&(r-=Math.round(p)+1),r=Math.round(r);const A=c?.[r];ae.ACTIVE.chars[n][o]=A&&" "!=A?A:W,ae.HIGH[n]||(ae.HIGH[n]=[]),ae.HIGH[n][o]=!0}}const fe=[];function pe(t,n=e){let o;const l=new Set;function c(e){if(r(t,e)&&(t=e,o)){const e=!fe.length;for(const e of l)e[1](),fe.push(e,t);if(e){for(let e=0;e<fe.length;e+=2)fe[e][0](fe[e+1]);fe.length=0}}}return{set:c,update:function(e){c(e(t))},subscribe:function(r,s=e){const i=[r,s];return l.add(i),1===l.size&&(o=n(c)||e),r(t),()=>{l.delete(i),0===l.size&&(o(),o=null)}}}}const Ae=pe({}),ge=pe(0),he=pe(!1);navigator.keyboard.getLayoutMap().then((e=>{ye.keyboardLayoutMap=e;const t=document.getElementById("capture");console.log(t),t.addEventListener("keydown",(e=>{console.log("KEYDOWN",e.key,e)})),t.dispatchEvent(new Event("focus")),t.dispatchEvent(new KeyboardEvent("keydown",{code:"KeyQ"})),console.log("[Keys] keyboardLayoutMap",Object.keys(e),Object.values(e))}));const ye=window,Ee=["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"];async function Te(e,t){const n=keyboardLayoutMap.get(e.code);console.log(`[Keys] universal code "${e.code}" = ${n} // ${e.key}`);let{keyCode:o}=e;o-=49;const l=Object.keys(ye.TOOLS),r=ie[function(e){let t;return c(e,(e=>t=e))(),t}(ge)][ce.indexOf(e.code)];if("Escape"==e.code)ye.ACTIVE=null;else if("KeyC"==e.code&&t.MetaLeft&&ye.ACTIVE){const{start:e,end:t}=ye.ACTIVE;console.log("[Keys] copying from",e,t);let n="";for(let o=e.y;o<=t.y;o++){for(let l=e.x;l<=t.x;l++)n+=ye.OUT?.[o]?.[l]||W;o!=t.y&&(n+="\n")}if(n=n.replaceAll(W," "),!navigator.clipboard)return alert("no clipboard api!");await navigator.clipboard.writeText(n),console.log("[Keys] text copied\n",n)}else if(-1!=Ee.indexOf(e.code)&&ye.ACTIVE){console.log(`[Keys] move ${e.code}`);const n=t.ShiftLeft?4:1;"ArrowLeft"==e.code?(ye.ACTIVE.start.x-=n,ye.ACTIVE.end.x-=n):"ArrowRight"==e.code?(ye.ACTIVE.start.x+=n,ye.ACTIVE.end.x+=n):"ArrowUp"==e.code?(ye.ACTIVE.start.y-=n,ye.ACTIVE.end.y-=n):"ArrowDown"==e.code&&(ye.ACTIVE.start.y+=n,ye.ACTIVE.end.y+=n)}else if(o>=0&&o<l.length)ye.MODE=l[o];else if(-1!=ne.indexOf(e.code)&&ye.MODE==z&&ye.ACTIVE?.type==z){console.log(`[Keys] fill chars with ${e.code}`,ye.ACTIVE);const{start:t,end:n}=ye.ACTIVE;for(let e=t.y;e<=n.y;e++)for(let o=t.x;o<=n.x;o++)ye.ACTIVE.inputs[e]||(ye.ACTIVE.inputs[e]={}),ye.ACTIVE.inputs[e][o]=r}else if("Backspace"==e.key&&ye.ACTIVE){console.log("[Keys] deleting layer");let e=ye.DATA,t=ye.DATA.indexOf(ye.DATA.find((e=>e.ref==ye.ACTIVE.ref)));if(-1==t)return console.log("[Keys] error finding index of selected");e.splice(t,1),ye.DATA=e,ye.ACTIVE=null}}function Ie(e,t,n){const o=e.slice();return o[8]=t[n],o[10]=n,o}function Ce(e,t,n){const o=e.slice();return o[11]=t[n],o[13]=n,o}function Ve(e){let t,n,o,l,r,c,s=se[e[13]+12*e[10]]+"",i=e[0][e[13]+12*e[10]]+"";return{c(){t=p("div"),n=p("span"),o=A(s),l=g(),r=p("span"),c=A(i),E(n,"class","pb0-4"),E(t,"class","grow ptb0-5 pointer flex column-center-center br1-solid bb1-solid no-basis bg"),m(t,"fade",!e[1]),m(t,"filled",e[1]&&e[2][ce[e[13]+12*e[10]]]),m(t,"none",!e[0][e[13]+12*e[10]])},m(e,s){u(e,t,s),a(t,n),a(n,o),a(t,l),a(t,r),a(r,c)},p(e,n){1&n&&i!==(i=e[0][e[13]+12*e[10]]+"")&&I(c,i),2&n&&m(t,"fade",!e[1]),6&n&&m(t,"filled",e[1]&&e[2][ce[e[13]+12*e[10]]]),1&n&&m(t,"none",!e[0][e[13]+12*e[10]])},d(e){e&&d(t)}}}function xe(e){let t,n,o,l=new Array(e[8]),r=[];for(let t=0;t<l.length;t+=1)r[t]=Ve(Ce(e,l,t));let c=10==e[8]&&function(e){let t,n,o;return{c(){t=p("span"),n=g(),o=p("span"),E(t,"class","grow"),E(o,"class","grow")},m(e,l){u(e,t,l),u(e,n,l),u(e,o,l)},d(e){e&&d(t),e&&d(n),e&&d(o)}}}();return{c(){t=p("div");for(let e=0;e<r.length;e+=1)r[e].c();n=g(),c&&c.c(),o=g(),E(t,"class","flex row")},m(e,l){u(e,t,l);for(let e=0;e<r.length;e+=1)r[e].m(t,null);a(t,n),c&&c.m(t,null),a(t,o)},p(e,o){if(7&o){let c;for(l=new Array(e[8]),c=0;c<l.length;c+=1){const s=Ce(e,l,c);r[c]?r[c].p(s,o):(r[c]=Ve(s),r[c].c(),r[c].m(t,n))}for(;c<r.length;c+=1)r[c].d(1);r.length=l.length}},d(e){e&&d(t),f(r,e),c&&c.d()}}}function me(t){let n,o=t[3],l=[];for(let e=0;e<o.length;e+=1)l[e]=xe(Ie(t,o,e));return{c(){n=p("aside");for(let e=0;e<l.length;e+=1)l[e].c();E(n,"id","keyboard"),E(n,"class","flex column w100pc bl1-solid bt1-solid"),m(n,"fade",!t[1])},m(e,t){u(e,n,t);for(let e=0;e<l.length;e+=1)l[e].m(n,null)},p(e,[t]){if(15&t){let r;for(o=e[3],r=0;r<o.length;r+=1){const c=Ie(e,o,r);l[r]?l[r].p(c,t):(l[r]=xe(c),l[r].c(),l[r].m(n,null))}for(;r<l.length;r+=1)l[r].d(1);l.length=o.length}2&t&&m(n,"fade",!e[1])},i:e,o:e,d(e){e&&d(n),f(l,e)}}}function be(e,t,n){let o,l,r,c;s(e,he,(e=>n(1,l=e))),s(e,ge,(e=>n(4,r=e))),s(e,Ae,(e=>n(2,c=e)));const a=window;let u;function d(e){u=document.activeElement;i(he,l=-1!=["textarea","number","text"].indexOf(u.type)||a.MODE==z,l)}return document.addEventListener("focus",d,!0),document.addEventListener("blur",d,!0),e.$$.update=()=>{16&e.$$.dirty&&n(0,o=ie[r])},[o,l,c,[12,12,10],r]}class we extends X{constructor(e){super(),j(this,e,be,me,r,{})}}const{window:ve}=U;function $e(e,t,n){const o=e.slice();return o[37]=t[n],o[39]=n,o}function Ke(e,t,n){const o=e.slice();return o[40]=t[n],o[42]=n,o}function Oe(e,t,n){const o=e.slice();return o[43]=t[n],o[45]=n,o}function De(e,t,n){const o=e.slice();return o[46]=t[n],o[39]=n,o}function He(e,t,n){const o=e.slice();return o[48]=t[n],o}function ke(e,t,n){const o=e.slice();return o[48]=t[n],o}function Me(e,t,n){const o=e.slice();return o[37]=t[n],o[39]=n,o}function _e(e){let t,n,o,l,r=e[39]+1+"",c=e[37].type+"";return{c(){t=p("span"),n=A(r),o=g(),l=A(c)},m(e,r){u(e,t,r),a(t,n),a(t,o),a(t,l)},p(e,t){1&t[0]&&c!==(c=e[37].type+"")&&I(l,c)},d(e){e&&d(t)}}}function Le(e){let t,n,l,r,c,s,i,a,f;return{c(){t=p("span"),t.textContent="width",n=g(),l=p("input"),r=g(),c=p("span"),c.textContent="height",s=g(),i=p("input"),E(l,"type","number"),E(i,"type","number")},m(o,d){u(o,t,d),u(o,n,d),u(o,l,d),C(l,e[0].width),u(o,r,d),u(o,c,d),u(o,s,d),u(o,i,d),C(i,e[0].height),a||(f=[y(l,"input",e[19]),y(i,"input",e[20])],a=!0)},p(e,t){1&t[0]&&T(l.value)!==e[0].width&&C(l,e[0].width),1&t[0]&&T(i.value)!==e[0].height&&C(i,e[0].height)},d(e){e&&d(t),e&&d(n),e&&d(l),e&&d(r),e&&d(c),e&&d(s),e&&d(i),a=!1,o(f)}}}function Se(e){let t;function n(e,t){return e[0].ACTIVE.type==F?Ne:e[0].ACTIVE.type==Z?Ge:void 0}let o=n(e),l=o&&o(e);return{c(){l&&l.c(),t=h()},m(e,n){l&&l.m(e,n),u(e,t,n)},p(e,r){o===(o=n(e))&&l?l.p(e,r):(l&&l.d(1),l=o&&o(e),l&&(l.c(),l.m(t.parentNode,t)))},d(e){l&&l.d(e),e&&d(t)}}}function Ge(e){let t,n,l,r,c,s,i,a,A,h=[q,J,ee,te],E=[];for(let t=0;t<4;t+=1)E[t]=Ue(ke(e,h,t));let T=[q,J,ee],I=[];for(let t=0;t<3;t+=1)I[t]=Re(He(e,T,t));return{c(){t=p("span"),t.textContent="x",n=g(),l=p("select");for(let e=0;e<4;e+=1)E[e].c();r=g(),c=p("span"),c.textContent="y",s=g(),i=p("select");for(let e=0;e<3;e+=1)I[e].c();void 0===e[0].ACTIVE.alignX&&k((()=>e[17].call(l))),void 0===e[0].ACTIVE.alignY&&k((()=>e[18].call(i)))},m(o,d){u(o,t,d),u(o,n,d),u(o,l,d);for(let e=0;e<4;e+=1)E[e].m(l,null);V(l,e[0].ACTIVE.alignX),u(o,r,d),u(o,c,d),u(o,s,d),u(o,i,d);for(let e=0;e<3;e+=1)I[e].m(i,null);V(i,e[0].ACTIVE.alignY),a||(A=[y(l,"change",e[8]),y(l,"change",e[17]),y(i,"change",e[8]),y(i,"change",e[18])],a=!0)},p(e,t){if(0&t){let n;for(h=[q,J,ee,te],n=0;n<4;n+=1){const o=ke(e,h,n);E[n]?E[n].p(o,t):(E[n]=Ue(o),E[n].c(),E[n].m(l,null))}for(;n<4;n+=1)E[n].d(1)}if(1&t[0]&&V(l,e[0].ACTIVE.alignX),0&t){let n;for(T=[q,J,ee],n=0;n<3;n+=1){const o=He(e,T,n);I[n]?I[n].p(o,t):(I[n]=Re(o),I[n].c(),I[n].m(i,null))}for(;n<3;n+=1)I[n].d(1)}1&t[0]&&V(i,e[0].ACTIVE.alignY)},d(e){e&&d(t),e&&d(n),e&&d(l),f(E,e),e&&d(r),e&&d(c),e&&d(s),e&&d(i),f(I,e),a=!1,o(A)}}}function Ne(e){let t,n,l,r,c,s,i,a,f,A,h,I,V;return{c(){t=p("span"),t.textContent="fill",n=g(),l=p("input"),r=g(),c=p("span"),c.textContent="corner",s=g(),i=p("input"),a=g(),f=p("span"),f.textContent="sides",A=g(),h=p("input"),E(l,"type","number"),E(i,"type","number"),E(h,"type","number")},m(o,d){u(o,t,d),u(o,n,d),u(o,l,d),C(l,e[0].ACTIVE.fill),u(o,r,d),u(o,c,d),u(o,s,d),u(o,i,d),C(i,e[0].ACTIVE.corner),u(o,a,d),u(o,f,d),u(o,A,d),u(o,h,d),C(h,e[0].ACTIVE.sides),I||(V=[y(l,"change",e[8]),y(l,"input",e[14]),y(i,"change",e[8]),y(i,"input",e[15]),y(h,"change",e[8]),y(h,"input",e[16])],I=!0)},p(e,t){1&t[0]&&T(l.value)!==e[0].ACTIVE.fill&&C(l,e[0].ACTIVE.fill),1&t[0]&&T(i.value)!==e[0].ACTIVE.corner&&C(i,e[0].ACTIVE.corner),1&t[0]&&T(h.value)!==e[0].ACTIVE.sides&&C(h,e[0].ACTIVE.sides)},d(e){e&&d(t),e&&d(n),e&&d(l),e&&d(r),e&&d(c),e&&d(s),e&&d(i),e&&d(a),e&&d(f),e&&d(A),e&&d(h),I=!1,o(V)}}}function Ue(t){let n,o,l,r=t[48]+"";return{c(){n=p("option"),o=A(r),n.__value=l=t[48],n.value=n.__value},m(e,t){u(e,n,t),a(n,o)},p:e,d(e){e&&d(n)}}}function Re(t){let n,o,l,r=t[48]+"";return{c(){n=p("option"),o=A(r),n.__value=l=t[48],n.value=n.__value},m(e,t){u(e,n,t),a(n,o)},p:e,d(e){e&&d(n)}}}function Be(e){let t,n,o,l,r,c,s,i,f=e[39]+1+"",h=e[46]+"";function T(...t){return e[21](e[46],...t)}return{c(){t=p("button"),n=A("["),o=A(f),l=A("] "),r=A(h),c=g(),E(t,"class","b0-solid text-left"),m(t,"filled",e[0].MODE==e[46])},m(e,d){u(e,t,d),a(t,n),a(t,o),a(t,l),a(t,r),a(t,c),s||(i=y(t,"mousedown",T),s=!0)},p(n,o){e=n,1&o[0]&&h!==(h=e[46]+"")&&I(r,h),1&o[0]&&m(t,"filled",e[0].MODE==e[46])},d(e){e&&d(t),s=!1,i()}}}function Ye(e){let t,n,l,r=(e[43]||W)+"";function c(...t){return e[22](e[42],e[45],...t)}function s(...t){return e[23](e[42],e[45],...t)}function i(...t){return e[24](e[42],e[45],...t)}function a(...t){return e[25](e[42],e[45],...t)}return{c(){t=p("span"),E(t,"style",e[3]),E(t,"class","char rel"),m(t,"b1-solid",e[0].HOVER?.y==e[42]&&e[0].HOVER?.x==e[45]),m(t,"pop",e[0].HIGH?.[e[42]]?.[e[45]])},m(e,o){u(e,t,o),t.innerHTML=r,n||(l=[y(t,"mousemove",c),y(t,"mouseup",s),y(t,"mousedown",i),y(t,"mouseover",a)],n=!0)},p(n,o){e=n,1&o[0]&&r!==(r=(e[43]||W)+"")&&(t.innerHTML=r),8&o[0]&&E(t,"style",e[3]),1&o[0]&&m(t,"b1-solid",e[0].HOVER?.y==e[42]&&e[0].HOVER?.x==e[45]),1&o[0]&&m(t,"pop",e[0].HIGH?.[e[42]]?.[e[45]])},d(e){e&&d(t),n=!1,o(l)}}}function je(e){let t,n,o=e[40],l=[];for(let t=0;t<o.length;t+=1)l[t]=Ye(Oe(e,o,t));return{c(){t=p("div");for(let e=0;e<l.length;e+=1)l[e].c();n=g(),E(t,"class","no-grow")},m(e,o){u(e,t,o);for(let e=0;e<l.length;e+=1)l[e].m(t,null);a(t,n)},p(e,r){if(233&r[0]){let c;for(o=e[40],c=0;c<o.length;c+=1){const s=Oe(e,o,c);l[c]?l[c].p(s,r):(l[c]=Ye(s),l[c].c(),l[c].m(t,n))}for(;c<l.length;c+=1)l[c].d(1);l.length=o.length}},d(e){e&&d(t),f(l,e)}}}function Xe(e){let t,n,o,l,r,c,s,i,f,h=e[37].type+"";function T(...t){return e[26](e[37],...t)}return{c(){t=p("div"),n=p("header"),o=p("div"),l=A(h),r=g(),c=p("div"),c.innerHTML='<div class="bl1-solid">S</div> \n\t\t\t\t\t\t\t\t\t<div class="bl1-solid">M</div>',s=g(),E(c,"class","flex row-stretch-stretch h100pc cp0-5 cbl1-solid"),E(n,"class","pointer plr1 w100pc flex row-space-between-center"),m(n,"filled",e[37]?.ref==e[0].ACTIVE?.ref),E(t,"class","bb1-solid w100pc flex column")},m(e,d){u(e,t,d),a(t,n),a(n,o),a(o,l),a(n,r),a(n,c),a(t,s),i||(f=y(t,"click",T),i=!0)},p(t,o){e=t,1&o[0]&&h!==(h=e[37].type+"")&&I(l,h),1&o[0]&&m(n,"filled",e[37]?.ref==e[0].ACTIVE?.ref)},d(e){e&&d(t),i=!1,f()}}}function Fe(e){let t,n=e[37].inited&&Xe(e);return{c(){n&&n.c(),t=h()},m(e,o){n&&n.m(e,o),u(e,t,o)},p(e,o){e[37].inited?n?n.p(e,o):(n=Xe(e),n.c(),n.m(t.parentNode,t)):n&&(n.d(1),n=null)},d(e){n&&n.d(e),e&&d(t)}}}function Ze(e){let t,n=(e[0].ACTIVE.type==Z||e[0].ACTIVE.type==F)&&Pe(e);return{c(){n&&n.c(),t=h()},m(e,o){n&&n.m(e,o),u(e,t,o)},p(e,o){e[0].ACTIVE.type==Z||e[0].ACTIVE.type==F?n?n.p(e,o):(n=Pe(e),n.c(),n.m(t.parentNode,t)):n&&(n.d(1),n=null)},d(e){n&&n.d(e),e&&d(t)}}}function Pe(e){let t,n,l,r,c,s;return{c(){t=p("div"),n=p("div"),n.textContent="INSPECTOR",l=g(),r=p("textarea"),E(n,"class","p1"),E(r,"class","flex grow b0-solid bt1-solid w100pc"),E(t,"id","editor"),E(t,"class","flex column grow bt1-solid")},m(o,i){u(o,t,i),a(t,n),a(t,l),a(t,r),C(r,e[0].ACTIVE.text),c||(s=[y(r,"keydown",e[8]),y(r,"input",e[27])],c=!0)},p(e,t){1&t[0]&&C(r,e[0].ACTIVE.text)},d(e){e&&d(t),c=!1,o(s)}}}function Qe(e){let t,n,l,r,c,s,i,h,T,C,V,x,m,b,w,v,$,K,O,D,H,k,M,_,L,S,U,Y,j,X,F,Z,P,Q,z,W,q,J=(e[0].ACTIVE?.type||"none")+"",ee=(e[1]?.pressed||"none")+"",te=e[0].DATA,ne=[];for(let t=0;t<te.length;t+=1)ne[t]=_e(Me(e,te,t));function oe(e,t){return e[0].ACTIVE?Se:Le}let le=oe(e),re=le(e),ce=Object.keys(e[0].TOOLS),se=[];for(let t=0;t<ce.length;t+=1)se[t]=Be(De(e,ce,t));let ie=e[0].OUT,ae=[];for(let t=0;t<ie.length;t+=1)ae[t]=je(Ke(e,ie,t));X=new we({});let ue=e[0].DATA,de=[];for(let t=0;t<ue.length;t+=1)de[t]=Fe($e(e,ue,t));let fe=e[0].ACTIVE&&Ze(e);return{c(){t=p("input"),n=g(),l=p("aside"),r=p("div"),r.textContent=`1\n\t\tmode: ${MODE}`,c=g(),s=p("div"),i=A("selected: "),h=A(J),T=g(),C=A(e[2]),V=g(),x=p("div"),m=A("pressed: "),b=A(ee),w=g(),v=p("div"),$=p("span"),$.textContent="layers:",K=g();for(let e=0;e<ne.length;e+=1)ne[e].c();O=g(),D=p("main"),H=p("nav"),k=p("div"),re.c(),M=g(),_=p("div"),L=p("nav");for(let e=0;e<se.length;e+=1)se[e].c();S=g(),U=p("div"),Y=p("div");for(let e=0;e<ae.length;e+=1)ae[e].c();var o;j=g(),(o=X.$$.fragment)&&o.c(),F=g(),Z=p("section"),P=p("div");for(let e=0;e<de.length;e+=1)de[e].c();Q=g(),fe&&fe.c(),E(t,"type","text"),E(t,"id","capture"),E(t,"class","invisible hidden fixed"),E(v,"class","flex column"),E(l,"class","sassis fixed l0 b0 p1 maxw24em filled z-index99 flex column cmb0-2 none"),E(k,"class","flex row-flex-start-center cmr1 w100pc"),E(H,"class","bb1-solid p1 h3em flex row-space-between-center "),E(L,"id","toolbar"),E(L,"class","column flex bb1-solid br1-solid h100pc "),E(Y,"id","canvas"),E(Y,"class","flex column-center-flex-start rel monospace user-select-none bg overflow-auto b1-solid"),E(U,"id","workspace"),E(U,"class","grow flex column-center-space-between rel block h100pc p1 overflow-hidden bg sink"),E(P,"id","layers"),E(P,"class","flex overflow-auto column grow"),E(Z,"id","panel"),E(Z,"class","column flex column-space-between-flex-start bb1-solid bl1-solid h100pc grow w16em maxw16em minw16em"),E(_,"class","grow mode-"+MODE+" w100vw overflow-hidden flex row-flex-start-flex-start"),E(D,"class","sassis bg fill flex flex column monospace")},m(o,d){u(o,t,d),u(o,n,d),u(o,l,d),a(l,r),a(l,c),a(l,s),a(s,i),a(s,h),a(s,T),a(s,C),a(l,V),a(l,x),a(x,m),a(x,b),a(l,w),a(l,v),a(v,$),a(v,K);for(let e=0;e<ne.length;e+=1)ne[e].m(v,null);u(o,O,d),u(o,D,d),a(D,H),a(H,k),re.m(k,null),a(D,M),a(D,_),a(_,L);for(let e=0;e<se.length;e+=1)se[e].m(L,null);a(_,S),a(_,U),a(U,Y);for(let e=0;e<ae.length;e+=1)ae[e].m(Y,null);a(U,j),R(X,U,null),a(_,F),a(_,Z),a(Z,P);for(let e=0;e<de.length;e+=1)de[e].m(P,null);a(Z,Q),fe&&fe.m(Z,null),z=!0,W||(q=[y(ve,"keydown",e[9]),y(ve,"keyup",e[10]),y(ve,"mouseup",e[13])],W=!0)},p(e,t){if((!z||1&t[0])&&J!==(J=(e[0].ACTIVE?.type||"none")+"")&&I(h,J),(!z||4&t[0])&&I(C,e[2]),(!z||2&t[0])&&ee!==(ee=(e[1]?.pressed||"none")+"")&&I(b,ee),1&t[0]){let n;for(te=e[0].DATA,n=0;n<te.length;n+=1){const o=Me(e,te,n);ne[n]?ne[n].p(o,t):(ne[n]=_e(o),ne[n].c(),ne[n].m(v,null))}for(;n<ne.length;n+=1)ne[n].d(1);ne.length=te.length}if(le===(le=oe(e))&&re?re.p(e,t):(re.d(1),re=le(e),re&&(re.c(),re.m(k,null))),1&t[0]){let n;for(ce=Object.keys(e[0].TOOLS),n=0;n<ce.length;n+=1){const o=De(e,ce,n);se[n]?se[n].p(o,t):(se[n]=Be(o),se[n].c(),se[n].m(L,null))}for(;n<se.length;n+=1)se[n].d(1);se.length=ce.length}if(233&t[0]){let n;for(ie=e[0].OUT,n=0;n<ie.length;n+=1){const o=Ke(e,ie,n);ae[n]?ae[n].p(o,t):(ae[n]=je(o),ae[n].c(),ae[n].m(Y,null))}for(;n<ae.length;n+=1)ae[n].d(1);ae.length=ie.length}if(17&t[0]){let n;for(ue=e[0].DATA,n=0;n<ue.length;n+=1){const o=$e(e,ue,n);de[n]?de[n].p(o,t):(de[n]=Fe(o),de[n].c(),de[n].m(P,null))}for(;n<de.length;n+=1)de[n].d(1);de.length=ue.length}e[0].ACTIVE?fe?fe.p(e,t):(fe=Ze(e),fe.c(),fe.m(Z,null)):fe&&(fe.d(1),fe=null)},i(e){z||(N(X.$$.fragment,e),z=!0)},o(e){!function(e,t,n,o){if(e&&e.o){if(G.has(e))return;G.add(e),(void 0).c.push((()=>{G.delete(e),o&&(n&&e.d(1),o())})),e.o(t)}}(X.$$.fragment,e),z=!1},d(e){e&&d(t),e&&d(n),e&&d(l),f(ne,e),e&&d(O),e&&d(D),re.d(),f(se,e),f(ae,e),B(X),f(de,e),fe&&fe.d(),W=!1,o(q)}}}function ze(){return{date:new Date}}function We(e,t,n){let o,l,r;s(e,Ae,(e=>n(33,r=e)));let c={},a={start:{},end:{}};const u=window;function d(e){const{start:t,end:o}=e;console.log("[App] set selected:",t,o),e?(n(0,u.ACTIVE=e,u),n(0,u.ACTIVE.origin={...a.start},u),n(0,u.ACTIVE.startOrigin={...e.start},u),n(0,u.ACTIVE.endOrigin={...e.end},u),setHighlight(u.ACTIVE)):(n(0,u.HIGH=[],u),C())}u.DATA=[],u.OUT=[],u.FONTSIZE=13,u.MODE=F,u.HOVER=null,u.HIGH=[],u.ACTIVE=null,u.width=40,u.height=20,u.TOOLS={[P]:{},[Q]:{},[F]:{},[Z]:{},[z]:{}},u.KEYCODES={};let f=!1,p=!1;function A(e,t){if(n(1,c.pressed=!0,c),n(0,u.ACTIVE=!1,u),a.start={y:e,x:t},a.end={y:e,x:t},u.MODE==F)console.log("[App] create rect"),n(1,c.rectangle=!0,c),n(0,u.ACTIVE={type:F,ref:ze(),chars:[],...a,fill:17,text:"",corner:0,sides:0,inited:!1},u),n(0,u.DATA=[u.ACTIVE,...u.DATA],u);else if(u.MODE==Z)console.log("[App] create text"),n(1,c.text=!0,c),n(0,u.ACTIVE={type:Z,ref:ze(),chars:[],...a,text:"Hello world",inited:!1,alignX:J,alignY:J},u),n(0,u.DATA=[u.ACTIVE,...u.DATA],u);else if(u.MODE==z)console.log("[App] create chars"),n(1,c.char=!0,c),n(0,u.ACTIVE={type:z,ref:ze(),chars:[],...a,origin:{...a.start},inputs:{},inited:!1},u),n(0,u.DATA=[u.ACTIVE,...u.DATA],u);else if(u.MODE==Q)console.log("[App] create select"),n(1,c.select=!0,c),n(0,u.ACTIVE={type:Q,ref:ze(),...a,inited:!1},u),C();else if(u.MODE==P){console.log("[App] create pointer");let o=m(e,t);if(!o)return n(0,u.HIGH=[],u),C(),console.log("[App] no item clicked");e==o.end.y&&t==o.end.x?p=!0:f=!0,console.log("[App] selected layer:",o),n(0,u.ACTIVE=o,u),o.origin={...a.start},o.startOrigin={...o.start},o.endOrigin={...o.end},o.type==F&&ue(),o.type==Z&&de(),C()}}let g,h,y={};function E(e,t){if(!c.pressed)return;if(y.x==t&&y.y==e)return;y=a.end={y:e,x:t};let o={...a.start},l={...a.end};if(a.start.x>a.end.x&&(o.x=a.end.x,l.x=a.start.x),a.start.y>a.end.y&&(o.y=a.end.y,l.y=a.start.y),f&&u.ACTIVE){console.log("[App] drag move");const{origin:o,startOrigin:l,endOrigin:r,type:c}=u.ACTIVE;n(0,u.ACTIVE.start.x=l.x+(t-o.x),u),n(0,u.ACTIVE.end.x=r.x+(t-o.x),u),n(0,u.ACTIVE.start.y=l.y+(e-o.y),u),n(0,u.ACTIVE.end.y=r.y+(e-o.y),u),n(0,u.HIGH=[],u),C()}else if(p&&u.ACTIVE){console.log("[App] drag resizing");const{origin:o,startOrigin:l,endOrigin:r,type:c}=u.ACTIVE;n(0,u.ACTIVE.end.x=r.x+(t-o.x),u),n(0,u.ACTIVE.end.y=r.y+(e-o.y),u),n(0,u.HIGH=[],u),C()}else c.rectangle?(console.log("[App] drag rectangle"),n(0,u.ACTIVE.start=o,u),n(0,u.ACTIVE.end=l,u),C()):c.text?(console.log("[App] drag textbox"),n(0,u.ACTIVE.start=o,u),n(0,u.ACTIVE.end=l,u),C()):c.select?(console.log("[App] drag select"),n(0,u.ACTIVE.start=o,u),n(0,u.ACTIVE.end=l,u),C()):c.char&&(console.log("[App] drag chars"),n(0,u.ACTIVE.start=o,u),n(0,u.ACTIVE.end=l,u),C())}function I(e,t){if(n(1,c.pressed=!1,c),c.select&&(n(1,c.select=!1,c),n(0,u.ACTIVE.start=a.start,u),n(0,u.ACTIVE.end={y:e,x:t},u)),c.rectangle&&n(1,c.rectangle=!1,c),c.text&&n(1,c.text=!1,c),c.char&&n(1,c.char=!1,c),p=!1,f=!1,u.ACTIVE?.type==F||u.ACTIVE?.type==Z)if(u.ACTIVE.start.x==u.ACTIVE.end.x||u.ACTIVE.start.y==u.ACTIVE.end.y){console.log("[App] deleting tiny rectangle");let o=u.DATA;o.shift(),n(0,u.DATA=o,u);let l=m(e,t);l&&u.MODE==l?.type&&(console.log("[App] selected with same tool type:",l),n(0,u.ACTIVE=l,u))}else{const{start:e,end:t}=u.DATA[0];console.log("[App] inited new rectangle:",e,t),n(0,u.DATA[0].inited=!0,u)}C()}function C(){console.log("[App] draw"),ue(),de(),function(){if(!ae.ACTIVE||ae?.ACTIVE?.type!=z)return;let{start:e,end:t,inputs:n}=ae.ACTIVE;t.x,e.x,t.y,e.y;const{x:o,y:l}=ae.ACTIVE.origin;console.log(`[App] setting chars from origin ${o}/${l}`);for(let e=0;e<=ae.height;e++)for(let t=0;t<=ae.width;t++)ae.ACTIVE.chars[e]||(ae.ACTIVE.chars[e]=[]),ae.ACTIVE.chars[e][t]=n?.[e]?.[t]||null}(),n(0,u.HIGH=[],u);const{start:e,end:t}=u.ACTIVE||{};u.ACTIVE&&(u.ACTIVE.type==F||u.ACTIVE.type==Z||u.ACTIVE.type);for(let o=0;o<u.height;o++)for(let l=0;l<u.width;l++){u.OUT[o]||n(0,u.OUT[o]=[],u);const r=V(o,l);u.OUT[o][l]==r&&null!=u.OUT[o][l]||n(0,u.OUT[o][l]=r,u);const c=l>=e?.x&&l<=t?.x,s=o>=e?.y&&o<=t?.y;u.HIGH[o]||n(0,u.HIGH[o]=[],u),n(0,u.HIGH[o][l]=c&&s,u)}}function V(e,t){for(let n of u.DATA)if(n?.chars?.[e]?.[t])return n.chars[e][t];return null}function m(e,t){for(let n of u.DATA)if(n?.chars?.[e]?.[t])return n;return null}let b=[];return e.$$.update=()=>{6145&e.$$.dirty[0]&&((e,t)=>{e==g&&t==h||(C(),n(11,g=e),n(12,h=t))})(u.width,u.height),1&e.$$.dirty[0]&&n(3,o=`\n\t\tfont-size: ${u.FONTSIZE}px;\n\t\twidth: ${Math.round(.6*u.FONTSIZE)}px;\n\t\tmax-width: ${Math.round(.6*u.FONTSIZE)}px;\n\t\tmin-width: ${Math.round(.6*u.FONTSIZE)}px;\n\t`),1&e.$$.dirty[0]&&n(2,l=u.ACTIVE?`\n\t\ttransform: \n\t\ttranslate(${8*u.ACTIVE?.start?.x}px, ${u.ACTIVE?.start?.y}em);\n\t\twidth: ${8*(u.ACTIVE?.end?.x-u.ACTIVE?.start?.x)}px;\n\t\theight: ${u.ACTIVE?.end?.y-u.ACTIVE?.start?.y}em;\n\t`:"")},[u,c,l,o,d,A,E,I,C,e=>{console.log("[App] keydown ",e.code),i(Ae,r[e.code]=!0,r),e.metaKey&&b.push(e.code),Te(e,r),C()},e=>{if(console.log("[App] keyup ",e.code),i(Ae,r[e.code]=!1,r),b.length>0){for(const e of b)i(Ae,r[e]=!1,r);b=[]}!async function(e,t){}(),C()},g,h,e=>n(1,c.pressed=!1,c),function(){u.ACTIVE.fill=T(this.value),n(0,u)},function(){u.ACTIVE.corner=T(this.value),n(0,u)},function(){u.ACTIVE.sides=T(this.value),n(0,u)},function(){u.ACTIVE.alignX=x(this),n(0,u)},function(){u.ACTIVE.alignY=x(this),n(0,u)},function(){u.width=T(this.value),n(0,u)},function(){u.height=T(this.value),n(0,u)},(e,t)=>n(0,u.MODE=e,u),(e,t,n)=>E(e,t),(e,t,n)=>I(e,t),(e,t,n)=>A(e,t),(e,t,n)=>{},(e,t)=>d(e),function(){u.ACTIVE.text=this.value,n(0,u)}]}return new class extends X{constructor(e){super(),j(this,e,We,Qe,r,{},null,[-1,-1])}}({target:document.body,props:{}})}();
//# sourceMappingURL=bundle.js.map
