
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.2' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const MODE_RECT = 'rectangle';
    const MODE_POINTER = 'pointer';
    const MODE_SELECT = 'select';
    const MODE_CHAR = 'char';
    const SPACE = '&nbsp;';
    const ALIGN_START = 'start';
    const ALIGN_CENTER = 'center';
    const ALIGN_END = 'end';
    const ALIGN_JUSTIFY = 'justify';

    const INPUT_ELEMENTS = ['textarea','number','text'];

    // use this:

    // https://www.w3.org/TR/xml-entity-names/025.html

    const MODES = {
    	[MODE_POINTER]: {},
    	[MODE_SELECT]: {},
    	[MODE_CHAR]: {},
    	[MODE_RECT]: {}
    };

    const CIRCLES = [ '⃝', '⃠', '↺', '↻', '⇴', '⌼', '⌽', '⌾', '⍉', '⍜', '⍟', '⍥', '⎋', '⏀', '⏁', '⏂', '⏣', '○', '◌', '◍', '●', '◐', '◑', '◒', '◓', '◔', '◕', '◖', '◗', '◙', '◚', '◛', '◠', '◡', '◯', '◴', '◵', '◶', '◷', '⚆', '⚇', '⚈', '⚉','⚬', '❍', '⟟', '⟲', '⟳', '⥀', '⥁', '⥈', '⥉', '⦲', '⦵', '⦺', '⦻', '⦽', '⧂', '⧃', '⧇', '⧬', '⧭', '⧲', '⧳', '⨢', '⨭', '⨮', '⨴', '⨵', '⨷', '⩹', '⩺', '⫯', '⫰', '⫱', '⬤', '⬰','￮', '𐩑', '𐩒', '𑗘', '𑗙', '𑗚', '𛲅', '𛲕'];
    const INPUT_KEYS = [ 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Backslash', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash' ];

    const SQUARE_CORNERS = {
    	tl: ['╭','┌','┍','┎','┏','╭','╔','╒','╓'],
    	tr: ['╮','┐','┑','┒','┓','╮','╗','╕','╖'],
    	bl: ['╰','└','┕','┖','┗','╰','╚','╘','╙'],
    	br: ['╯','┘','┙','┚','┛','╯','╝','╛','╜'],
    };

    const DIAGONAL = ['╲','╱','╳'];

    const LINES = {
    	v: ['│','┃','┆','┇','┊','┋','╎','╏','╽','╿','╵','╷','╹','╻'],
    	h: ['─','━','┄','┅','┈','┉','╌','╍','╼','╾','╴','╶','╸','╺']
    };
    const ARROWS = ['←','↑','→','↓','↔','↕','↖','↗','↘','↙','↚','↛','↜','↝','↞','↟','↠','↡','↢','↣','↤','↥','↦','↧','↨','↩','↪','↫','↬','↭','↮','↯','↰','↱','↲','↳','↴','↵','↶','↷','↸','↹','↺','↻','⇄','⇅','⇆','⇇','⇈','⇉','⇊','⇍','⇎','⇏','⇐','⇑','⇒','⇓','⇔','⇕','⇖','⇗','⇘','⇙','⇚','⇛','⇜','⇝','⇞','⇟','⇠','⇡','⇢','⇣','⇤','⇥','⇦','⇧','⇨','⇩','⇪'
    ];
    const BLOCKS = ['▀','▁','▂','▃','▄','▅','▆','▇','█','▉','▊','▋','▌','▍','▎','▏','▐','░','▒','▓','▔','▕','▖','▗','▘','▙','▚','▛','▜','▝','▞','▟'];


    const KEYS = [ 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Backslash', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash' ];
    const KEYS_ICONS = [ 'Q','W','E','R','T','Y','U','I','O','P','[',']','A','S','D','F','G','H','J','K','L',';','\'','\\','Z','X','C','V','B','N','M',',','.','/'];


    const LOREM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi id sagittis orci, non rhoncus velit. Nam sed tellus cursus, interdum nulla ac, iaculis libero. Nam ullamcorper nulla sem, id gravida dui posuere vitae. Morbi finibus ultrices ligula id varius. Ut lobortis ornare nisl in efficitur. Mauris viverra est malesuada, feugiat tellus in, faucibus risus. Vivamus sed lacinia diam. Cras in ullamcorper lacus, ac euismod ex.';

    const BOARDS = [
    	[...KEYS_ICONS],
    	[...BLOCKS],
    	[...LINES.h,...LINES.v,...DIAGONAL],
    	[...SQUARE_CORNERS.tl,...SQUARE_CORNERS.tr,...SQUARE_CORNERS.bl,...SQUARE_CORNERS.br],
    	[...CIRCLES]
    ];

    const BOARD_NAMES = ['Default', 'Blocks', 'Lines', 'Corners', 'Circles'];

    const w$1 = window;


    const SAY$1 = m => console.log(`[Chars] ${m}`);

    function setRectChars() {

    	if (!w$1.ACTIVE || w$1?.ACTIVE?.type != MODE_RECT) return

    	let { start, end } = w$1.ACTIVE;
    	SAY$1(`🟦 set`);

    	for (let y = 0; y < height; y++) {
    		for (let x = 0; x < width; x++) {

    			if (!w$1.ACTIVE.chars[y]) w$1.ACTIVE.chars[y] = [];

    			const topBottom = (y == start.y || y == end.y);
    			const leftRight = (x == start.x || x == end.x);

    			const withinX = (x >= start.x && x <= end.x);
    			const withinY = (y >= start.y && y <= end.y);

    			const tl = (y == start.y && x == start.x );
    			const tr = (y == start.y && x == end.x );
    			const br = (y == end.y && x == end.x );
    			const bl = (y == end.y && x == start.x );

    			let sel = true;
    			const _BLOCK = BLOCKS[w$1.ACTIVE.fill];

    			if (tl) {
    				w$1.ACTIVE.chars[y][x] = SQUARE_CORNERS.tl[w$1.ACTIVE.corner] || _BLOCK;
    			} else if (tr) {
    				w$1.ACTIVE.chars[y][x] = SQUARE_CORNERS.tr[w$1.ACTIVE.corner] || _BLOCK;
    			} else if (br) {
    				w$1.ACTIVE.chars[y][x] = SQUARE_CORNERS.br[w$1.ACTIVE.corner] || _BLOCK;
    			} else if (bl) {
    				w$1.ACTIVE.chars[y][x] = SQUARE_CORNERS.bl[w$1.ACTIVE.corner] || _BLOCK;
    			} else if ( topBottom && withinX ) {
    				w$1.ACTIVE.chars[y][x] = LINES.h[w$1.ACTIVE.sides] || _BLOCK;
    			} else if ( leftRight && withinY ) {
    				w$1.ACTIVE.chars[y][x] = LINES.v[w$1.ACTIVE.sides] || _BLOCK; 
    			} else if ( withinX && withinY && typeof w$1.ACTIVE.fill == 'number' ) {
    				w$1.ACTIVE.chars[y][x] = _BLOCK;
    			} else {
    				w$1.ACTIVE.chars[y][x] = null;
    				sel = false;
    			}

    			if (sel) {
    				if (!w$1.HIGH[y]) w$1.HIGH[y] = [];
    				w$1.HIGH[y][x] = true;
    			}
    		}
    	}
    }


    function setTextChars() {

    	if (!w$1.ACTIVE) return
    	if (w$1?.ACTIVE?.type != MODE_RECT) return
    	SAY$1(`🔠 set`);

    	let { start, end } = w$1.ACTIVE;
    	const alignX = w$1.ACTIVE?.alignX || ALIGN_CENTER;
    	const alignY = w$1.ACTIVE?.alignY || ALIGN_CENTER;

    	console.log(`[App] setting textbox with x "${alignX}" and y "${alignY}"` );

    	const blockWidth = end.x - start.x;
    	const blockHeight = end.y - start.y;


    	// create lines

    	w$1.ACTIVE.text = w$1.ACTIVE.text || '';
    	w$1.ACTIVE.lines = [];
    	let currentLine = '';

    	for (const paragraph of w$1.ACTIVE.text.split('\n')) {

    		for (const word of paragraph.split(' ')) {

    			if (currentLine.length + word.length + 1 < blockWidth) {
    				const space = currentLine != '' ? ' ' : '';
    				currentLine += space + word;
    			} else {
    				w$1.ACTIVE.lines.push( currentLine );
    				currentLine = word;
    			}
    		}

    		w$1.ACTIVE.lines.push(currentLine);
    		currentLine = '';

    	}

    	// w.ACTIVE.chars.length = 0

    	// return 
    	const { lines } = w$1.ACTIVE;
    	const yDiff = blockHeight - w$1.ACTIVE.lines.length;
    	const aYCenter = alignY == ALIGN_CENTER && blockHeight > lines.length;
    	const aXCenter = alignX == ALIGN_CENTER;
    	const aYEnd = alignY == ALIGN_END && blockHeight > lines.length;
    	const aXEnd = alignX == ALIGN_END;


    	for (let y = start.y; y <= end.y; y++) {
    		for (let x = start.x; x <= end.x; x++) {

    			if (!w$1.ACTIVE.chars[y]) w$1.ACTIVE.chars[y] = [];

    			let yy = y - start.y;
    			let xx = x - start.x;

    			// [Y]

    			if ( aYCenter ) yy -= (yDiff / 2) + 0.5;
    			if ( aYEnd ) yy -= yDiff + 1;

    			yy = Math.round(yy);

    			const line = lines?.[yy];

    			// [X]

    			const xDiff = blockWidth - line?.length;
    			if ( aXCenter && line ) xx -= Math.round(xDiff / 2);
    			if ( aXEnd && line ) xx -= Math.round(xDiff) + 1;

    			xx = Math.round(xx);

    			const char = line?.[xx];
    			// w.ACTIVE.chars[y][x] = (!char || char == ' ') ? SPACE : char

    			if (char) w$1.ACTIVE.chars[y][x] = char;
    			if (!w$1.HIGH[y]) w$1.HIGH[y] = [];
    			w$1.HIGH[y][x] = true;
    		}
    	}
    }


    function setCharChars() {

    	if (!w$1.ACTIVE || w$1?.ACTIVE?.type != MODE_CHAR) return
    	SAY$1(`🅰️ set`);

    	let { start, end, inputs } = w$1.ACTIVE;

    	end.x - start.x;
    	end.y - start.y;

    	const { x, y } = w$1.ACTIVE.origin;

    	console.log(`[App] setting chars from origin ${x}/${y}` );

    	// create lines

    	for (let y = 0; y <= w$1.height; y++) {
    		for (let x = 0; x <= w$1.width; x++) {
    			if (!w$1.ACTIVE.chars[y]) w$1.ACTIVE.chars[y] = [];
    			w$1.ACTIVE.chars[y][x] = inputs?.[y]?.[x] || null;
    		}
    	}
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const _keys = writable({});
    const _keyboardIdx = writable(0);
    const _showKeyboard = writable(false);
    const _activeElement = writable(null);
    const _mode = writable(MODE_RECT);

    navigator.keyboard.getLayoutMap().then(keyboardLayoutMap => {
    	w.keyboardLayoutMap = keyboardLayoutMap;

    	const input = document.getElementById('capture');
    	console.log(input);
    	input.addEventListener('keydown', e => {
    		// console.log('Layout keydown', e.key, e)
    	});
    	input.dispatchEvent(new Event('focus'));
    	input.dispatchEvent(new KeyboardEvent('keydown',{'code':'KeyQ'}));
    	console.log(`[Keys] keyboardLayoutMap`, Object.keys(keyboardLayoutMap), Object.values(keyboardLayoutMap));
    });

    const w = window;

    const META = 'MetaLeft';
    const ARROWKEYS = ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'];

    const getStores = e => {

    	const keyboardIdx = get_store_value(_keyboardIdx);
    	const board = BOARDS[keyboardIdx];
    	const char = board[KEYS.indexOf(e.code)];

    	return {
    		keys: get_store_value(_keys),
    		keyboardIdx,
    		board,
    		char,
    		mode: get_store_value(_mode),
    		modes: Object.keys(MODES),
    		activeElement: get_store_value(_activeElement),
    		number: e.keyCode - 49
    	}
    };

    let keyboardWasTabbed = false;

    const SAY = m => console.log(`[Keys] ${m}`);

    async function onKeyup( e ) {

    	let { 
    		mode, 
    		modes, 
    		keys, 
    		keyboardIdx, 
    		activeElement, 
    		number, 
    		board, 
    		char } = getStores(e);

    	if (INPUT_ELEMENTS.indexOf(activeElement?.type) != -1) {

    		if (e.code == 'Tab' && !keyboardWasTabbed) {
    			keyboardIdx += 1;
    			if (keyboardIdx >= BOARDS.length) keyboardIdx = 0;
    			SAY(`⌨️ tab to keyboard ${keyboardIdx}`);
    			_keyboardIdx.set(keyboardIdx);
    			e.preventDefault();
    		}
    	}
    }

    async function onKeydown( e ) {

    	keyboardLayoutMap.get(e.code);

    	let { 
    		mode, 
    		modes, 
    		keys, 
    		keyboardIdx, 
    		activeElement, 
    		number, 
    		board, 
    		char } = getStores(e);

    	if (e.code == 'Tab') e.preventDefault();


    	if (INPUT_ELEMENTS.indexOf(activeElement.type) != -1) {

    		// Input or Textarea is selected

    		SAY(`🔡 using ${INPUT_ELEMENTS.join(', ')}`);

    		if (e.code == 'Escape') {

    			SAY(`🚪 blurring ${activeElement.type}`);
    			activeElement.blur();
    		}

    		if (keys['Tab']) {
    			if (number >= 0 && number < BOARDS.length) {
    				SAY(`⌨️ tabbed keyboard to index ${number}`);
    				keyboardIdx = number;
    				_keyboardIdx.set(keyboardIdx);
    				keyboardWasTabbed = true;
    			} else {
    				keyboardWasTabbed = false;
    			}
    			e.preventDefault();
    		}

    	} else if (number >= 0 && number < modes.length) {

    		// Tab = change tool

    		SAY(`🛠 tabbed mode to index ${number}`);
    		mode = modes[number];
    		_mode.set(mode);


    	} else if (e.code == 'Escape') {

    		// Escape = deactivate things

    		w.ACTIVE = null;

    	} else if ( e.code == 'KeyC' && keys[META] && w.ACTIVE ) {

    		const { start, end } = w.ACTIVE;

    		console.log(`[Keys] copying from`, start, end );

    		let _CLIP = '';
    		for (let y = start.y; y <= end.y; y++) {
    			for (let x = start.x; x <= end.x; x++) {
    				_CLIP += w.OUT?.[y]?.[x] || SPACE;
    			}
    			if (y != end.y) _CLIP += '\n';
    		}
    		_CLIP = _CLIP.replaceAll(SPACE,' ');

    		if (!navigator.clipboard) return alert('no clipboard api!')
    	    await navigator.clipboard.writeText(_CLIP);
    		console.log(`[Keys] text copied\n`, _CLIP);

    	} else if ( ARROWKEYS.indexOf(e.code) != -1 && w.ACTIVE ) {
    		console.log(`[Keys] move ${e.code}`,);

    		const _UNIT = keys['ShiftLeft'] ? 4 : 1;

    		if (e.code == 'ArrowLeft') {
    			w.ACTIVE.start.x -= _UNIT;
    			w.ACTIVE.end.x -= _UNIT;
    		} else if (e.code == 'ArrowRight') {
    			w.ACTIVE.start.x += _UNIT;
    			w.ACTIVE.end.x += _UNIT;
    		} else if (e.code == 'ArrowUp') {
    			w.ACTIVE.start.y -= _UNIT;
    			w.ACTIVE.end.y -= _UNIT;
    		} else if (e.code == 'ArrowDown') {
    			w.ACTIVE.start.y += _UNIT;
    			w.ACTIVE.end.y += _UNIT;
    		}

    	} else if (INPUT_KEYS.indexOf(e.code) != -1 && w.MODE == MODE_CHAR && w.ACTIVE?.type == MODE_CHAR) {
    		console.log(`[Keys] fill chars with ${e.code}`, w.ACTIVE);

    		const { start, end } = w.ACTIVE;
    		for (let y = start.y; y <= end.y; y++) {
    			for (let x = start.x; x <= end.x; x++) {
    				if (!w.ACTIVE.inputs[y]) w.ACTIVE.inputs[y] = {};
    				w.ACTIVE.inputs[y][x] = char;
    			}
    		}


    	} else if ( e.key == 'Backspace' && w.ACTIVE ) {



    		console.log('[Keys] deleting layer');
    		let cp = w.DATA;
    		let idx = w.DATA.indexOf( w.DATA.find( l => l.ref == w.ACTIVE.ref ) );
    		if (idx == -1) {
    			return console.log(`[Keys] error finding index of selected`)
    		}
    		cp.splice( idx, 1 );
    		w.DATA = cp;
    		w.ACTIVE = null;

    	}
    }

    /* src/Keyboard.svelte generated by Svelte v3.44.2 */
    const file$1 = "src/Keyboard.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	child_ctx[12] = i;
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	child_ctx[15] = i;
    	return child_ctx;
    }

    function get_each_context_2$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	child_ctx[12] = i;
    	return child_ctx;
    }

    // (27:2) {#each BOARD_NAMES as name,idx }
    function create_each_block_2$1(ctx) {
    	let div1;
    	let div0;
    	let t0_value = /*name*/ ctx[16] + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[6](/*idx*/ ctx[12], ...args);
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(div0, "class", "flex bg row-center-center ptb0-5 plr1");
    			toggle_class(div0, "filled", /*$_keyboardIdx*/ ctx[0] == /*idx*/ ctx[12]);
    			add_location(div0, file$1, 28, 4, 817);
    			attr_dev(div1, "class", "b1-solid pointer");
    			add_location(div1, file$1, 27, 3, 782);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, t0);
    			append_dev(div1, t1);

    			if (!mounted) {
    				dispose = listen_dev(div0, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*$_keyboardIdx*/ 1) {
    				toggle_class(div0, "filled", /*$_keyboardIdx*/ ctx[0] == /*idx*/ ctx[12]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$1.name,
    		type: "each",
    		source: "(27:2) {#each BOARD_NAMES as name,idx }",
    		ctx
    	});

    	return block;
    }

    // (46:4) {#each new Array(count) as num, i}
    function create_each_block_1$1(ctx) {
    	let div;
    	let span0;
    	let t0_value = KEYS_ICONS[/*i*/ ctx[15] + /*idx*/ ctx[12] * 12].toLowerCase() + "";
    	let t0;
    	let t1;
    	let span1;
    	let t2_value = (/*current*/ ctx[1]?.[/*i*/ ctx[15] + /*idx*/ ctx[12] * 12] || '') + "";
    	let t2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span0 = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			span1 = element("span");
    			t2 = text(t2_value);
    			attr_dev(span0, "class", "pb0-4");
    			add_location(span0, file$1, 52, 6, 1462);
    			attr_dev(span1, "class", "pop f2");
    			add_location(span1, file$1, 55, 6, 1550);
    			attr_dev(div, "class", "grow ptb0-5 pointer flex column-center-center br1-solid bb1-solid no-basis bg");
    			toggle_class(div, "fade", !/*$_showKeyboard*/ ctx[2]);
    			toggle_class(div, "filled", /*$_showKeyboard*/ ctx[2] && /*$_keys*/ ctx[3][KEYS[/*i*/ ctx[15] + /*idx*/ ctx[12] * 12]]);
    			toggle_class(div, "none", !/*current*/ ctx[1][/*i*/ ctx[15] + /*idx*/ ctx[12] * 12]);
    			add_location(div, file$1, 47, 5, 1218);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span0);
    			append_dev(span0, t0);
    			append_dev(div, t1);
    			append_dev(div, span1);
    			append_dev(span1, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*current*/ 2 && t2_value !== (t2_value = (/*current*/ ctx[1]?.[/*i*/ ctx[15] + /*idx*/ ctx[12] * 12] || '') + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*$_showKeyboard*/ 4) {
    				toggle_class(div, "fade", !/*$_showKeyboard*/ ctx[2]);
    			}

    			if (dirty & /*$_showKeyboard, $_keys, KEYS*/ 12) {
    				toggle_class(div, "filled", /*$_showKeyboard*/ ctx[2] && /*$_keys*/ ctx[3][KEYS[/*i*/ ctx[15] + /*idx*/ ctx[12] * 12]]);
    			}

    			if (dirty & /*current*/ 2) {
    				toggle_class(div, "none", !/*current*/ ctx[1][/*i*/ ctx[15] + /*idx*/ ctx[12] * 12]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(46:4) {#each new Array(count) as num, i}",
    		ctx
    	});

    	return block;
    }

    // (59:4) {#if count == 10}
    function create_if_block$1(ctx) {
    	let span0;
    	let t;
    	let span1;

    	const block = {
    		c: function create() {
    			span0 = element("span");
    			t = space();
    			span1 = element("span");
    			attr_dev(span0, "class", "grow");
    			add_location(span0, file$1, 59, 5, 1659);
    			attr_dev(span1, "class", "grow");
    			add_location(span1, file$1, 60, 5, 1686);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span0, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, span1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span0);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(span1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(59:4) {#if count == 10}",
    		ctx
    	});

    	return block;
    }

    // (42:2) {#each pattern as count, idx}
    function create_each_block$1(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let each_value_1 = new Array(/*count*/ ctx[10]);
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	let if_block = /*count*/ ctx[10] == 10 && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();
    			attr_dev(div, "class", "flex row");
    			add_location(div, file$1, 42, 3, 1144);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			append_dev(div, t0);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$_showKeyboard, $_keys, KEYS, current, KEYS_ICONS*/ 14) {
    				each_value_1 = new Array(/*count*/ ctx[10]);
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, t0);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(42:2) {#each pattern as count, idx}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div2;
    	let div0;
    	let t;
    	let div1;
    	let each_value_2 = BOARD_NAMES;
    	validate_each_argument(each_value_2);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_1[i] = create_each_block_2$1(get_each_context_2$1(ctx, each_value_2, i));
    	}

    	let each_value = /*pattern*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "flex row pb1");
    			add_location(div0, file$1, 25, 1, 717);
    			attr_dev(div1, "id", "keyboard");
    			attr_dev(div1, "class", "flex column w100pc bl1-solid bt1-solid");
    			toggle_class(div1, "fade", !/*$_showKeyboard*/ ctx[2]);
    			add_location(div1, file$1, 37, 1, 1005);
    			attr_dev(div2, "class", "flex column w100pc");
    			add_location(div2, file$1, 24, 0, 683);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div0, null);
    			}

    			append_dev(div2, t);
    			append_dev(div2, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$_keyboardIdx, onSetIndex, BOARD_NAMES*/ 33) {
    				each_value_2 = BOARD_NAMES;
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$1(ctx, each_value_2, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_2$1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_2.length;
    			}

    			if (dirty & /*pattern, Array, $_showKeyboard, $_keys, KEYS, current, KEYS_ICONS*/ 30) {
    				each_value = /*pattern*/ ctx[4];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*$_showKeyboard*/ 4) {
    				toggle_class(div1, "fade", !/*$_showKeyboard*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let current;
    	let $_keyboardIdx;
    	let $_activeElement;
    	let $_showKeyboard;
    	let $_keys;
    	validate_store(_keyboardIdx, '_keyboardIdx');
    	component_subscribe($$self, _keyboardIdx, $$value => $$invalidate(0, $_keyboardIdx = $$value));
    	validate_store(_activeElement, '_activeElement');
    	component_subscribe($$self, _activeElement, $$value => $$invalidate(7, $_activeElement = $$value));
    	validate_store(_showKeyboard, '_showKeyboard');
    	component_subscribe($$self, _showKeyboard, $$value => $$invalidate(2, $_showKeyboard = $$value));
    	validate_store(_keys, '_keys');
    	component_subscribe($$self, _keys, $$value => $$invalidate(3, $_keys = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Keyboard', slots, []);
    	const pattern = [12, 12, 10];
    	const w = window;

    	function setActiveElement(event) {
    		set_store_value(_activeElement, $_activeElement = document.activeElement, $_activeElement);
    		set_store_value(_showKeyboard, $_showKeyboard = INPUT_ELEMENTS.indexOf($_activeElement?.type) != -1 || w.MODE == MODE_CHAR, $_showKeyboard);
    	}

    	document.addEventListener('focus', setActiveElement, true);
    	document.addEventListener('blur', setActiveElement, true);

    	function onSetIndex(idx) {
    		set_store_value(_keyboardIdx, $_keyboardIdx = idx, $_keyboardIdx);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Keyboard> was created with unknown prop '${key}'`);
    	});

    	const click_handler = (idx, e) => onSetIndex(idx);

    	$$self.$capture_state = () => ({
    		MODE_CHAR,
    		KEYS,
    		KEYS_ICONS,
    		BLOCKS,
    		SQUARE_CORNERS,
    		LINES,
    		DIAGONAL,
    		ARROWS,
    		BOARDS,
    		BOARD_NAMES,
    		INPUT_ELEMENTS,
    		_keys,
    		_showKeyboard,
    		_keyboardIdx,
    		_activeElement,
    		pattern,
    		w,
    		setActiveElement,
    		onSetIndex,
    		current,
    		$_keyboardIdx,
    		$_activeElement,
    		$_showKeyboard,
    		$_keys
    	});

    	$$self.$inject_state = $$props => {
    		if ('current' in $$props) $$invalidate(1, current = $$props.current);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$_keyboardIdx*/ 1) {
    			$$invalidate(1, current = BOARDS[$_keyboardIdx]);
    		}
    	};

    	return [
    		$_keyboardIdx,
    		current,
    		$_showKeyboard,
    		$_keys,
    		pattern,
    		onSetIndex,
    		click_handler
    	];
    }

    class Keyboard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Keyboard",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.44.2 */

    const { Object: Object_1, console: console_1, window: window_1 } = globals;
    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[40] = list[i];
    	child_ctx[42] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[43] = list[i];
    	child_ctx[45] = i;
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[46] = list[i];
    	child_ctx[48] = i;
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[49] = list[i];
    	child_ctx[42] = i;
    	return child_ctx;
    }

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[51] = list[i];
    	return child_ctx;
    }

    function get_each_context_5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[51] = list[i];
    	return child_ctx;
    }

    // (410:3) {:else}
    function create_else_block(ctx) {
    	let span0;
    	let t1;
    	let input0;
    	let t2;
    	let span1;
    	let t4;
    	let input1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			span0 = element("span");
    			span0.textContent = "width";
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			span1 = element("span");
    			span1.textContent = "height";
    			t4 = space();
    			input1 = element("input");
    			add_location(span0, file, 411, 4, 9024);
    			attr_dev(input0, "type", "number");
    			add_location(input0, file, 412, 4, 9047);
    			add_location(span1, file, 416, 4, 9109);
    			attr_dev(input1, "type", "number");
    			add_location(input1, file, 417, 4, 9133);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, input0, anchor);
    			set_input_value(input0, /*w*/ ctx[0].width);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, span1, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, input1, anchor);
    			set_input_value(input1, /*w*/ ctx[0].height);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler_1*/ ctx[20]),
    					listen_dev(input1, "input", /*input1_input_handler_1*/ ctx[21])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*w*/ 1 && to_number(input0.value) !== /*w*/ ctx[0].width) {
    				set_input_value(input0, /*w*/ ctx[0].width);
    			}

    			if (dirty[0] & /*w*/ 1 && to_number(input1.value) !== /*w*/ ctx[0].height) {
    				set_input_value(input1, /*w*/ ctx[0].height);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(input0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(span1);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(input1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(410:3) {:else}",
    		ctx
    	});

    	return block;
    }

    // (375:3) {#if w.ACTIVE}
    function create_if_block_3(ctx) {
    	let if_block_anchor;
    	let if_block = /*w*/ ctx[0].ACTIVE.type == MODE_RECT && create_if_block_4(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*w*/ ctx[0].ACTIVE.type == MODE_RECT) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_4(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(375:3) {#if w.ACTIVE}",
    		ctx
    	});

    	return block;
    }

    // (377:4) {#if w.ACTIVE.type == MODE_RECT}
    function create_if_block_4(ctx) {
    	let span0;
    	let t1;
    	let input0;
    	let t2;
    	let span1;
    	let t4;
    	let input1;
    	let t5;
    	let span2;
    	let t7;
    	let input2;
    	let t8;
    	let span3;
    	let t10;
    	let select0;
    	let t11;
    	let span4;
    	let t13;
    	let select1;
    	let mounted;
    	let dispose;
    	let each_value_5 = [ALIGN_START, ALIGN_CENTER, ALIGN_END, ALIGN_JUSTIFY];
    	validate_each_argument(each_value_5);
    	let each_blocks_1 = [];

    	for (let i = 0; i < 4; i += 1) {
    		each_blocks_1[i] = create_each_block_5(get_each_context_5(ctx, each_value_5, i));
    	}

    	let each_value_4 = [ALIGN_START, ALIGN_CENTER, ALIGN_END];
    	validate_each_argument(each_value_4);
    	let each_blocks = [];

    	for (let i = 0; i < 3; i += 1) {
    		each_blocks[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
    	}

    	const block = {
    		c: function create() {
    			span0 = element("span");
    			span0.textContent = "fill";
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			span1 = element("span");
    			span1.textContent = "corner";
    			t4 = space();
    			input1 = element("input");
    			t5 = space();
    			span2 = element("span");
    			span2.textContent = "sides";
    			t7 = space();
    			input2 = element("input");
    			t8 = space();
    			span3 = element("span");
    			span3.textContent = "x";
    			t10 = space();
    			select0 = element("select");

    			for (let i = 0; i < 4; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t11 = space();
    			span4 = element("span");
    			span4.textContent = "y";
    			t13 = space();
    			select1 = element("select");

    			for (let i = 0; i < 3; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(span0, file, 377, 5, 8190);
    			attr_dev(input0, "type", "number");
    			add_location(input0, file, 378, 5, 8213);
    			add_location(span1, file, 382, 5, 8306);
    			attr_dev(input1, "type", "number");
    			add_location(input1, file, 383, 5, 8331);
    			add_location(span2, file, 387, 5, 8426);
    			attr_dev(input2, "type", "number");
    			add_location(input2, file, 388, 5, 8450);
    			add_location(span3, file, 392, 5, 8544);
    			if (/*w*/ ctx[0].ACTIVE.alignX === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[18].call(select0));
    			add_location(select0, file, 393, 5, 8564);
    			add_location(span4, file, 400, 5, 8781);
    			if (/*w*/ ctx[0].ACTIVE.alignY === void 0) add_render_callback(() => /*select1_change_handler*/ ctx[19].call(select1));
    			add_location(select1, file, 401, 5, 8801);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, input0, anchor);
    			set_input_value(input0, /*w*/ ctx[0].ACTIVE.fill);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, span1, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, input1, anchor);
    			set_input_value(input1, /*w*/ ctx[0].ACTIVE.corner);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, span2, anchor);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, input2, anchor);
    			set_input_value(input2, /*w*/ ctx[0].ACTIVE.sides);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, span3, anchor);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, select0, anchor);

    			for (let i = 0; i < 4; i += 1) {
    				each_blocks_1[i].m(select0, null);
    			}

    			select_option(select0, /*w*/ ctx[0].ACTIVE.alignX);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, span4, anchor);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, select1, anchor);

    			for (let i = 0; i < 3; i += 1) {
    				each_blocks[i].m(select1, null);
    			}

    			select_option(select1, /*w*/ ctx[0].ACTIVE.alignY);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "change", /*draw*/ ctx[8], false, false, false),
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[15]),
    					listen_dev(input1, "change", /*draw*/ ctx[8], false, false, false),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[16]),
    					listen_dev(input2, "change", /*draw*/ ctx[8], false, false, false),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[17]),
    					listen_dev(select0, "change", /*draw*/ ctx[8], false, false, false),
    					listen_dev(select0, "change", /*select0_change_handler*/ ctx[18]),
    					listen_dev(select1, "change", /*draw*/ ctx[8], false, false, false),
    					listen_dev(select1, "change", /*select1_change_handler*/ ctx[19])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*w*/ 1 && to_number(input0.value) !== /*w*/ ctx[0].ACTIVE.fill) {
    				set_input_value(input0, /*w*/ ctx[0].ACTIVE.fill);
    			}

    			if (dirty[0] & /*w*/ 1 && to_number(input1.value) !== /*w*/ ctx[0].ACTIVE.corner) {
    				set_input_value(input1, /*w*/ ctx[0].ACTIVE.corner);
    			}

    			if (dirty[0] & /*w*/ 1 && to_number(input2.value) !== /*w*/ ctx[0].ACTIVE.sides) {
    				set_input_value(input2, /*w*/ ctx[0].ACTIVE.sides);
    			}

    			if (dirty & /*ALIGN_START, ALIGN_CENTER, ALIGN_END, ALIGN_JUSTIFY*/ 0) {
    				each_value_5 = [ALIGN_START, ALIGN_CENTER, ALIGN_END, ALIGN_JUSTIFY];
    				validate_each_argument(each_value_5);
    				let i;

    				for (i = 0; i < 4; i += 1) {
    					const child_ctx = get_each_context_5(ctx, each_value_5, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_5(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(select0, null);
    					}
    				}

    				for (; i < 4; i += 1) {
    					each_blocks_1[i].d(1);
    				}
    			}

    			if (dirty[0] & /*w*/ 1) {
    				select_option(select0, /*w*/ ctx[0].ACTIVE.alignX);
    			}

    			if (dirty & /*ALIGN_START, ALIGN_CENTER, ALIGN_END*/ 0) {
    				each_value_4 = [ALIGN_START, ALIGN_CENTER, ALIGN_END];
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < 3; i += 1) {
    					const child_ctx = get_each_context_4(ctx, each_value_4, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select1, null);
    					}
    				}

    				for (; i < 3; i += 1) {
    					each_blocks[i].d(1);
    				}
    			}

    			if (dirty[0] & /*w*/ 1) {
    				select_option(select1, /*w*/ ctx[0].ACTIVE.alignY);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(input0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(span1);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(input1);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(span2);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(input2);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(span3);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(select0);
    			destroy_each(each_blocks_1, detaching);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(span4);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(select1);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(377:4) {#if w.ACTIVE.type == MODE_RECT}",
    		ctx
    	});

    	return block;
    }

    // (397:6) {#each [ALIGN_START,ALIGN_CENTER,ALIGN_END, ALIGN_JUSTIFY] as opt}
    function create_each_block_5(ctx) {
    	let option;
    	let t_value = /*opt*/ ctx[51] + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*opt*/ ctx[51];
    			option.value = option.__value;
    			add_location(option, file, 397, 7, 8712);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_5.name,
    		type: "each",
    		source: "(397:6) {#each [ALIGN_START,ALIGN_CENTER,ALIGN_END, ALIGN_JUSTIFY] as opt}",
    		ctx
    	});

    	return block;
    }

    // (405:6) {#each [ALIGN_START,ALIGN_CENTER,ALIGN_END] as opt}
    function create_each_block_4(ctx) {
    	let option;
    	let t_value = /*opt*/ ctx[51] + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*opt*/ ctx[51];
    			option.value = option.__value;
    			add_location(option, file, 405, 7, 8934);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4.name,
    		type: "each",
    		source: "(405:6) {#each [ALIGN_START,ALIGN_CENTER,ALIGN_END] as opt}",
    		ctx
    	});

    	return block;
    }

    // (429:3) {#each Object.keys(MODES) as tool, idx}
    function create_each_block_3(ctx) {
    	let button;
    	let t0;
    	let t1_value = /*idx*/ ctx[42] + 1 + "";
    	let t1;
    	let t2;
    	let t3_value = /*tool*/ ctx[49] + "";
    	let t3;
    	let t4;
    	let mounted;
    	let dispose;

    	function mousedown_handler(...args) {
    		return /*mousedown_handler*/ ctx[22](/*tool*/ ctx[49], ...args);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t0 = text("[");
    			t1 = text(t1_value);
    			t2 = text("] ");
    			t3 = text(t3_value);
    			t4 = space();
    			attr_dev(button, "class", "b0-solid text-left");
    			toggle_class(button, "filled", /*$_mode*/ ctx[3] == /*tool*/ ctx[49]);
    			add_location(button, file, 429, 4, 9477);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t0);
    			append_dev(button, t1);
    			append_dev(button, t2);
    			append_dev(button, t3);
    			append_dev(button, t4);

    			if (!mounted) {
    				dispose = listen_dev(button, "mousedown", mousedown_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*$_mode*/ 8) {
    				toggle_class(button, "filled", /*$_mode*/ ctx[3] == /*tool*/ ctx[49]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(429:3) {#each Object.keys(MODES) as tool, idx}",
    		ctx
    	});

    	return block;
    }

    // (449:6) {#each line as char, x}
    function create_each_block_2(ctx) {
    	let span;
    	let raw_value = (/*char*/ ctx[46] || SPACE) + "";
    	let mounted;
    	let dispose;

    	function mousemove_handler(...args) {
    		return /*mousemove_handler*/ ctx[23](/*y*/ ctx[45], /*x*/ ctx[48], ...args);
    	}

    	function mouseup_handler_1(...args) {
    		return /*mouseup_handler_1*/ ctx[24](/*y*/ ctx[45], /*x*/ ctx[48], ...args);
    	}

    	function mousedown_handler_1(...args) {
    		return /*mousedown_handler_1*/ ctx[25](/*y*/ ctx[45], /*x*/ ctx[48], ...args);
    	}

    	function mouseover_handler(...args) {
    		return /*mouseover_handler*/ ctx[26](/*y*/ ctx[45], /*x*/ ctx[48], ...args);
    	}

    	const block = {
    		c: function create() {
    			span = element("span");
    			attr_dev(span, "style", /*fontStyle*/ ctx[2]);
    			attr_dev(span, "class", "char rel");
    			toggle_class(span, "b1-solid", /*w*/ ctx[0].HOVER?.y == /*y*/ ctx[45] && /*w*/ ctx[0].HOVER?.x == /*x*/ ctx[48]);
    			toggle_class(span, "filled", /*w*/ ctx[0].HIGH?.[/*y*/ ctx[45]]?.[/*x*/ ctx[48]]);
    			add_location(span, file, 449, 7, 10052);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			span.innerHTML = raw_value;

    			if (!mounted) {
    				dispose = [
    					listen_dev(span, "mousemove", mousemove_handler, false, false, false),
    					listen_dev(span, "mouseup", mouseup_handler_1, false, false, false),
    					listen_dev(span, "mousedown", mousedown_handler_1, false, false, false),
    					listen_dev(span, "mouseover", mouseover_handler, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*w*/ 1 && raw_value !== (raw_value = (/*char*/ ctx[46] || SPACE) + "")) span.innerHTML = raw_value;
    			if (dirty[0] & /*fontStyle*/ 4) {
    				attr_dev(span, "style", /*fontStyle*/ ctx[2]);
    			}

    			if (dirty[0] & /*w*/ 1) {
    				toggle_class(span, "b1-solid", /*w*/ ctx[0].HOVER?.y == /*y*/ ctx[45] && /*w*/ ctx[0].HOVER?.x == /*x*/ ctx[48]);
    			}

    			if (dirty[0] & /*w*/ 1) {
    				toggle_class(span, "filled", /*w*/ ctx[0].HIGH?.[/*y*/ ctx[45]]?.[/*x*/ ctx[48]]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(449:6) {#each line as char, x}",
    		ctx
    	});

    	return block;
    }

    // (447:4) {#each w.OUT as line, y}
    function create_each_block_1(ctx) {
    	let div;
    	let t;
    	let each_value_2 = /*line*/ ctx[43];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			attr_dev(div, "class", "no-grow");
    			add_location(div, file, 447, 5, 9993);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*fontStyle, w, onMousemove, onMouseup, onMousedown*/ 229) {
    				each_value_2 = /*line*/ ctx[43];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, t);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(447:4) {#each w.OUT as line, y}",
    		ctx
    	});

    	return block;
    }

    // (486:5) {#if layer.inited}
    function create_if_block_2(ctx) {
    	let div1;
    	let header;
    	let div0;
    	let t0_value = /*layer*/ ctx[40].type + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[27](/*layer*/ ctx[40], ...args);
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			header = element("header");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			add_location(div0, file, 492, 8, 11422);
    			attr_dev(header, "class", "pointer plr1 ptb0-5 w100pc flex row-space-between-center");
    			toggle_class(header, "filled", /*layer*/ ctx[40]?.ref == /*w*/ ctx[0].ACTIVE?.ref);
    			add_location(header, file, 489, 7, 11278);
    			attr_dev(div1, "class", "bb1-solid w100pc flex column");
    			add_location(div1, file, 486, 6, 11178);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, header);
    			append_dev(header, div0);
    			append_dev(div0, t0);
    			append_dev(div1, t1);

    			if (!mounted) {
    				dispose = listen_dev(div1, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*w*/ 1 && t0_value !== (t0_value = /*layer*/ ctx[40].type + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*w*/ 1) {
    				toggle_class(header, "filled", /*layer*/ ctx[40]?.ref == /*w*/ ctx[0].ACTIVE?.ref);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(486:5) {#if layer.inited}",
    		ctx
    	});

    	return block;
    }

    // (485:4) {#each w.DATA as layer, idx}
    function create_each_block(ctx) {
    	let if_block_anchor;
    	let if_block = /*layer*/ ctx[40].inited && create_if_block_2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*layer*/ ctx[40].inited) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(485:4) {#each w.DATA as layer, idx}",
    		ctx
    	});

    	return block;
    }

    // (504:3) {#if w.ACTIVE}
    function create_if_block(ctx) {
    	let if_block_anchor;
    	let if_block = /*w*/ ctx[0].ACTIVE.type == MODE_RECT && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*w*/ ctx[0].ACTIVE.type == MODE_RECT) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(504:3) {#if w.ACTIVE}",
    		ctx
    	});

    	return block;
    }

    // (505:4) {#if w.ACTIVE.type == MODE_RECT }
    function create_if_block_1(ctx) {
    	let div1;
    	let div0;
    	let t1;
    	let textarea;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "INSPECTOR";
    			t1 = space();
    			textarea = element("textarea");
    			attr_dev(div0, "class", "p1");
    			add_location(div0, file, 506, 6, 11788);
    			attr_dev(textarea, "class", "flex grow b0-solid bt1-solid w100pc");
    			add_location(textarea, file, 508, 6, 11827);
    			attr_dev(div1, "id", "editor");
    			attr_dev(div1, "class", "flex column grow bt1-solid");
    			add_location(div1, file, 505, 5, 11729);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t1);
    			append_dev(div1, textarea);
    			set_input_value(textarea, /*w*/ ctx[0].ACTIVE.text);

    			if (!mounted) {
    				dispose = [
    					listen_dev(textarea, "keydown", /*draw*/ ctx[8], false, false, false),
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[28])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*w*/ 1) {
    				set_input_value(textarea, /*w*/ ctx[0].ACTIVE.text);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(505:4) {#if w.ACTIVE.type == MODE_RECT }",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let input;
    	let t0;
    	let main;
    	let nav0;
    	let div0;
    	let h1;
    	let t2;
    	let t3;
    	let div5;
    	let nav1;
    	let t4;
    	let div3;
    	let div1;
    	let t5;
    	let div2;
    	let t6;
    	let keyboard;
    	let t7;
    	let section;
    	let div4;
    	let t8;
    	let t9;
    	let textarea;
    	let div5_class_value;
    	let current;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*w*/ ctx[0].ACTIVE) return create_if_block_3;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let each_value_3 = Object.keys(MODES);
    	validate_each_argument(each_value_3);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks_2[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	let each_value_1 = /*w*/ ctx[0].OUT;
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	keyboard = new Keyboard({ $$inline: true });
    	let each_value = /*w*/ ctx[0].DATA;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	let if_block1 = /*w*/ ctx[0].ACTIVE && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			input = element("input");
    			t0 = space();
    			main = element("main");
    			nav0 = element("nav");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "ascii";
    			t2 = space();
    			if_block0.c();
    			t3 = space();
    			div5 = element("div");
    			nav1 = element("nav");

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t4 = space();
    			div3 = element("div");
    			div1 = element("div");
    			t5 = space();
    			div2 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t6 = space();
    			create_component(keyboard.$$.fragment);
    			t7 = space();
    			section = element("section");
    			div4 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t8 = space();
    			if (if_block1) if_block1.c();
    			t9 = text("\n\t\t\tTEST\n\t\t\t\t\t\t");
    			textarea = element("textarea");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "id", "capture");
    			attr_dev(input, "class", "invisible hidden fixed");
    			add_location(input, file, 369, 0, 7836);
    			attr_dev(h1, "class", "pointer f2 filled h100pc flex p1");
    			add_location(h1, file, 373, 3, 8073);
    			attr_dev(div0, "class", "flex row-flex-start-center cmr1 w100pc");
    			add_location(div0, file, 372, 2, 8017);
    			attr_dev(nav0, "class", "bb1-solid flex row-space-between-center ");
    			add_location(nav0, file, 371, 1, 7960);
    			attr_dev(nav1, "id", "toolbar");
    			attr_dev(nav1, "class", "column flex bb1-solid br1-solid h100pc ");
    			add_location(nav1, file, 427, 2, 9363);
    			attr_dev(div1, "class", "fill");
    			add_location(div1, file, 440, 3, 9774);
    			attr_dev(div2, "id", "canvas");
    			attr_dev(div2, "class", "flex column-center-flex-start rel monospace user-select-none bg overflow-auto b1-solid");
    			add_location(div2, file, 443, 3, 9836);
    			attr_dev(div3, "id", "workspace");
    			attr_dev(div3, "class", "grow flex column-center-space-between rel block h100pc p1 overflow-hidden bg sink");
    			add_location(div3, file, 437, 2, 9653);
    			attr_dev(div4, "id", "layers");
    			attr_dev(div4, "class", "flex overflow-auto column grow");
    			add_location(div4, file, 483, 3, 11058);
    			attr_dev(textarea, "class", "flex grow b0-solid bt1-solid w100pc");
    			add_location(textarea, file, 516, 6, 11995);
    			attr_dev(section, "id", "panel");
    			attr_dev(section, "class", "column flex column-space-between-flex-start bb1-solid bl1-solid h100pc grow w16em maxw16em minw16em");
    			add_location(section, file, 482, 2, 10926);
    			attr_dev(div5, "class", div5_class_value = "grow mode-" + /*$_mode*/ ctx[3] + " w100vw overflow-hidden flex row-flex-start-flex-start");
    			add_location(div5, file, 425, 1, 9271);
    			attr_dev(main, "class", "sassis bg fill flex flex column monospace");
    			add_location(main, file, 370, 0, 7902);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, nav0);
    			append_dev(nav0, div0);
    			append_dev(div0, h1);
    			append_dev(div0, t2);
    			if_block0.m(div0, null);
    			append_dev(main, t3);
    			append_dev(main, div5);
    			append_dev(div5, nav1);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(nav1, null);
    			}

    			append_dev(div5, t4);
    			append_dev(div5, div3);
    			append_dev(div3, div1);
    			append_dev(div3, t5);
    			append_dev(div3, div2);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div2, null);
    			}

    			append_dev(div3, t6);
    			mount_component(keyboard, div3, null);
    			append_dev(div5, t7);
    			append_dev(div5, section);
    			append_dev(section, div4);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div4, null);
    			}

    			append_dev(section, t8);
    			if (if_block1) if_block1.m(section, null);
    			append_dev(section, t9);
    			append_dev(section, textarea);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window_1, "keydown", /*onKeydownPre*/ ctx[9], false, false, false),
    					listen_dev(window_1, "keyup", /*onKeyupPre*/ ctx[10], false, false, false),
    					listen_dev(window_1, "mouseup", /*mouseup_handler*/ ctx[14], false, false, false),
    					listen_dev(div1, "mousedown", /*deselectAll*/ ctx[11], false, false, false),
    					listen_dev(textarea, "keydown", /*draw*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div0, null);
    				}
    			}

    			if (dirty[0] & /*$_mode*/ 8) {
    				each_value_3 = Object.keys(MODES);
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_3(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(nav1, null);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_3.length;
    			}

    			if (dirty[0] & /*w, fontStyle, onMousemove, onMouseup, onMousedown*/ 229) {
    				each_value_1 = /*w*/ ctx[0].OUT;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div2, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty[0] & /*setSelected, w*/ 17) {
    				each_value = /*w*/ ctx[0].DATA;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div4, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (/*w*/ ctx[0].ACTIVE) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					if_block1.m(section, t9);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (!current || dirty[0] & /*$_mode*/ 8 && div5_class_value !== (div5_class_value = "grow mode-" + /*$_mode*/ ctx[3] + " w100vw overflow-hidden flex row-flex-start-flex-start")) {
    				attr_dev(div5, "class", div5_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(keyboard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(keyboard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			if_block0.d();
    			destroy_each(each_blocks_2, detaching);
    			destroy_each(each_blocks_1, detaching);
    			destroy_component(keyboard);
    			destroy_each(each_blocks, detaching);
    			if (if_block1) if_block1.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function createReference() {
    	return { date: new Date() };
    }

    function onMouseover(y, x) {
    	
    } // w.HOVER = { y, x }

    function instance($$self, $$props, $$invalidate) {
    	let fontStyle;
    	let outlineStyle;
    	let $_keys;
    	let $_mode;
    	validate_store(_keys, '_keys');
    	component_subscribe($$self, _keys, $$value => $$invalidate(35, $_keys = $$value));
    	validate_store(_mode, '_mode');
    	component_subscribe($$self, _mode, $$value => $$invalidate(3, $_mode = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let STATES = {};
    	let cursor = { start: {}, end: {} };
    	let CURSOR = null;
    	const w = window;
    	w.DATA = [];
    	w.OUT = [];
    	w.FONTSIZE = 13;
    	w.HOVER = null;
    	w.HIGH = [];
    	w.ACTIVE = null;
    	w.width = 40;
    	w.height = 20;
    	w.KEYCODES = {};

    	function setSelected(layer) {
    		const { start, end } = layer;
    		console.log(`[App] set selected:`, start, end);

    		if (layer) {
    			$$invalidate(0, w.ACTIVE = layer, w);
    			$$invalidate(0, w.ACTIVE.origin = { ...cursor.start }, w);
    			$$invalidate(0, w.ACTIVE.startOrigin = { ...layer.start }, w);
    			$$invalidate(0, w.ACTIVE.endOrigin = { ...layer.end }, w);
    		}

    		draw();
    	}

    	let IS_MOVING = false;
    	let IS_RESIZING = false;

    	function onMousedown(y, x) {
    		$$invalidate(1, STATES.pressed = true, STATES);
    		$$invalidate(0, w.ACTIVE = false, w);
    		cursor.start = { y, x };
    		cursor.end = { y, x };

    		if ($_mode == MODE_RECT) {
    			console.log('[App] create rect');
    			$$invalidate(1, STATES[MODE_RECT] = true, STATES);

    			$$invalidate(
    				0,
    				w.ACTIVE = {
    					type: MODE_RECT,
    					ref: createReference(),
    					chars: [], // OUT
    					...cursor,
    					text: 'Hello world', // PRE
    					fill: 17,
    					corner: 0,
    					sides: 0,
    					inited: false,
    					alignX: ALIGN_START,
    					alignY: ALIGN_CENTER
    				},
    				w
    			);

    			$$invalidate(0, w.DATA = [w.ACTIVE, ...w.DATA], w);
    		} else if ($_mode == MODE_CHAR) {
    			console.log('[App] create chars');
    			$$invalidate(1, STATES[MODE_CHAR] = true, STATES);

    			$$invalidate(
    				0,
    				w.ACTIVE = {
    					type: MODE_CHAR,
    					ref: createReference(),
    					chars: [], // OUT
    					...cursor,
    					origin: { ...cursor.start },
    					inputs: {}, // PRE
    					inited: false
    				},
    				w
    			);

    			$$invalidate(0, w.DATA = [w.ACTIVE, ...w.DATA], w);
    		} else if ($_mode == MODE_SELECT) {
    			console.log('[App] create select');
    			$$invalidate(1, STATES[MODE_SELECT] = true, STATES);

    			$$invalidate(
    				0,
    				w.ACTIVE = {
    					type: MODE_SELECT,
    					ref: createReference(),
    					...cursor,
    					inited: false
    				},
    				w
    			);

    			draw();
    		} else if ($_mode == MODE_POINTER) {
    			console.log('[App] create pointer');
    			let layer = getLayer(y, x);

    			if (!layer) {
    				$$invalidate(0, w.HIGH = [], w);
    				draw();
    				return console.log('[App] no item clicked');
    			}

    			if (y == layer.end.y && x == layer.end.x) {
    				IS_RESIZING = true;
    			} else {
    				IS_MOVING = true;
    			}

    			console.log(`[App] selected layer:`, layer);
    			$$invalidate(0, w.ACTIVE = layer, w);
    			$$invalidate(0, w.ACTIVE.origin = { ...cursor.start }, w);
    			$$invalidate(0, w.ACTIVE.startOrigin = { ...w.ACTIVE.start }, w);
    			$$invalidate(0, w.ACTIVE.endOrigin = { ...w.ACTIVE.end }, w);
    			setRectChars();
    			setTextChars();
    			draw();
    		}
    	}

    	let lastMouseMove = {};

    	function onMousemove(y, x) {
    		if (!STATES.pressed) return; // create dragging only
    		if (lastMouseMove.x == x && lastMouseMove.y == y) return;

    		// set w.HIGH area
    		lastMouseMove = cursor.end = { y, x };

    		let start = { ...cursor.start };
    		let end = { ...cursor.end };

    		// flip start and end (drag backwards)
    		if (cursor.start.x > cursor.end.x) {
    			start.x = cursor.end.x;
    			end.x = cursor.start.x;
    		}

    		if (cursor.start.y > cursor.end.y) {
    			start.y = cursor.end.y;
    			end.y = cursor.start.y;
    		}

    		if (IS_MOVING && w.ACTIVE) {
    			console.log(`[App] drag move`);
    			const { origin, startOrigin, endOrigin, type } = w.ACTIVE;
    			$$invalidate(0, w.ACTIVE.start.x = startOrigin.x + (x - origin.x), w);
    			$$invalidate(0, w.ACTIVE.end.x = endOrigin.x + (x - origin.x), w);
    			$$invalidate(0, w.ACTIVE.start.y = startOrigin.y + (y - origin.y), w);
    			$$invalidate(0, w.ACTIVE.end.y = endOrigin.y + (y - origin.y), w);
    			$$invalidate(0, w.HIGH = [], w);
    			draw();
    		} else // resize
    		if (IS_RESIZING && w.ACTIVE) {
    			console.log(`[App] drag resizing`);
    			const { origin, startOrigin, endOrigin, type } = w.ACTIVE;
    			$$invalidate(0, w.ACTIVE.end.x = endOrigin.x + (x - origin.x), w);
    			$$invalidate(0, w.ACTIVE.end.y = endOrigin.y + (y - origin.y), w);
    			$$invalidate(0, w.HIGH = [], w);
    			draw();
    		} else // rectangle
    		if (STATES[MODE_RECT]) {
    			console.log(`[App] drag rectangle`);
    			$$invalidate(0, w.ACTIVE.start = start, w);
    			$$invalidate(0, w.ACTIVE.end = end, w);
    			draw();
    		} else // textbox
    		if (STATES[MODE_SELECT]) {
    			console.log(`[App] drag select`);
    			$$invalidate(0, w.ACTIVE.start = start, w);
    			$$invalidate(0, w.ACTIVE.end = end, w);
    			draw();
    		} else // char
    		if (STATES[MODE_CHAR]) {
    			console.log(`[App] drag chars`);
    			$$invalidate(0, w.ACTIVE.start = start, w);
    			$$invalidate(0, w.ACTIVE.end = end, w);
    			draw();
    		}
    	}

    	function onMouseup(y, x) {
    		$$invalidate(1, STATES.pressed = false, STATES);

    		if (STATES[MODE_SELECT]) {
    			$$invalidate(1, STATES[MODE_SELECT] = false, STATES);
    			$$invalidate(0, w.ACTIVE.start = cursor.start, w);
    			$$invalidate(0, w.ACTIVE.end = { y, x }, w);
    		}

    		if (STATES[MODE_RECT]) $$invalidate(1, STATES[MODE_RECT] = false, STATES);
    		if (STATES[MODE_CHAR]) $$invalidate(1, STATES[MODE_CHAR] = false, STATES);
    		IS_RESIZING = false;
    		IS_MOVING = false;

    		if (w.ACTIVE?.type == MODE_RECT) {
    			if (w.ACTIVE.start.x == w.ACTIVE.end.x || w.ACTIVE.start.y == w.ACTIVE.end.y) {
    				console.log('[App] deleting tiny rectangle');
    				let cp = w.DATA;
    				cp.shift();
    				$$invalidate(0, w.DATA = cp, w);
    				let layer = getLayer(y, x);

    				if (layer && $_mode == layer?.type) {
    					console.log(`[App] selected with same tool type:`, layer);
    					$$invalidate(0, w.ACTIVE = layer, w);
    				}
    			} else {
    				const { start, end } = w.DATA[0];
    				console.log('[App] inited new rectangle:', start, end);
    				$$invalidate(0, w.DATA[0].inited = true, w);
    			}
    		}

    		draw();
    	}

    	function setHighChars(y, x) {
    		if (!w.ACTIVE) return;

    		if (w.ACTIVE.type == MODE_RECT || w.ACTIVE.type == MODE_SELECT) {
    			return x >= w.ACTIVE.start.x && x <= w.ACTIVE.end.x && (y >= w.ACTIVE.start.y && y <= w.ACTIVE.end.y);
    		}
    	}

    	let lastWidth, lastHeight;

    	function draw() {
    		console.log(`[App] draw`);
    		setRectChars();
    		setTextChars();
    		setCharChars();
    		$$invalidate(0, w.HIGH = [], w);
    		const { start, end } = w.ACTIVE || {};

    		w.ACTIVE
    		? w.ACTIVE.type == MODE_RECT || w.ACTIVE.type == MODE_SELECT
    		: false;

    		for (let y = 0; y < w.height; y++) {
    			for (let x = 0; x < w.width; x++) {
    				if (!w.OUT[y]) $$invalidate(0, w.OUT[y] = [], w);
    				const char = getChar(y, x);
    				if (w.OUT[y][x] != char || w.OUT[y][x] == undefined) $$invalidate(0, w.OUT[y][x] = char, w);

    				// if (spans[i]) spans[i].innerText = w.OUT[y][x] || SPACE
    				const withinX = x >= start?.x && x <= end?.x;

    				const withinY = y >= start?.y && y <= end?.y;
    				if (!w.HIGH[y]) $$invalidate(0, w.HIGH[y] = [], w);
    				$$invalidate(0, w.HIGH[y][x] = withinX && withinY, w);
    			}
    		}
    	}

    	function getChar(y, x) {
    		for (let layer of w.DATA) if (layer?.chars?.[y]?.[x]) return layer.chars[y][x];
    		return null;
    	}

    	function getLayer(y, x) {
    		for (let layer of w.DATA) if (layer?.chars?.[y]?.[x]) return layer;
    		return null;
    	}

    	let metaKeys = [];

    	const onKeydownPre = e => {
    		// console.log('[App] keydown ', e.code)
    		set_store_value(_keys, $_keys[e.code] = true, $_keys);

    		if (e.metaKey) metaKeys.push(e.code);
    		onKeydown(e);
    		draw();
    	};

    	const onKeyupPre = e => {
    		// console.log('[App] keyup ', e.code)
    		set_store_value(_keys, $_keys[e.code] = false, $_keys);

    		if (metaKeys.length > 0) {
    			for (const key of metaKeys) set_store_value(_keys, $_keys[key] = false, $_keys);
    			metaKeys = [];
    		}

    		onKeyup(e);
    		draw();
    	};

    	function deselectAll() {
    		$$invalidate(0, w.ACTIVE = null, w);
    		$$invalidate(0, w.HIGH = [], w);
    		draw();
    	}

    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const mouseup_handler = e => $$invalidate(1, STATES.pressed = false, STATES);

    	function input0_input_handler() {
    		w.ACTIVE.fill = to_number(this.value);
    		$$invalidate(0, w);
    	}

    	function input1_input_handler() {
    		w.ACTIVE.corner = to_number(this.value);
    		$$invalidate(0, w);
    	}

    	function input2_input_handler() {
    		w.ACTIVE.sides = to_number(this.value);
    		$$invalidate(0, w);
    	}

    	function select0_change_handler() {
    		w.ACTIVE.alignX = select_value(this);
    		$$invalidate(0, w);
    	}

    	function select1_change_handler() {
    		w.ACTIVE.alignY = select_value(this);
    		$$invalidate(0, w);
    	}

    	function input0_input_handler_1() {
    		w.width = to_number(this.value);
    		$$invalidate(0, w);
    	}

    	function input1_input_handler_1() {
    		w.height = to_number(this.value);
    		$$invalidate(0, w);
    	}

    	const mousedown_handler = (tool, e) => set_store_value(_mode, $_mode = tool, $_mode);
    	const mousemove_handler = (y, x, e) => onMousemove(y, x);
    	const mouseup_handler_1 = (y, x, e) => onMouseup(y, x);
    	const mousedown_handler_1 = (y, x, e) => onMousedown(y, x);
    	const mouseover_handler = (y, x, e) => onMouseover();
    	const click_handler = (layer, e) => setSelected(layer);

    	function textarea_input_handler() {
    		w.ACTIVE.text = this.value;
    		$$invalidate(0, w);
    	}

    	$$self.$capture_state = () => ({
    		SQUARE_CORNERS,
    		LINES,
    		ARROWS,
    		BLOCKS,
    		KEYS,
    		LOREM,
    		MODE_RECT,
    		MODE_POINTER,
    		MODE_SELECT,
    		MODE_CHAR,
    		SPACE,
    		MODES,
    		ALIGN_CENTER,
    		ALIGN_END,
    		ALIGN_START,
    		ALIGN_JUSTIFY,
    		INPUT_KEYS,
    		setTextChars,
    		setRectChars,
    		setCharChars,
    		onKeyup,
    		onKeydown,
    		_keys,
    		_mode,
    		Keyboard,
    		STATES,
    		cursor,
    		CURSOR,
    		w,
    		createReference,
    		setSelected,
    		IS_MOVING,
    		IS_RESIZING,
    		onMouseover,
    		onMousedown,
    		lastMouseMove,
    		onMousemove,
    		onMouseup,
    		setHighChars,
    		lastWidth,
    		lastHeight,
    		draw,
    		getChar,
    		getLayer,
    		metaKeys,
    		onKeydownPre,
    		onKeyupPre,
    		deselectAll,
    		outlineStyle,
    		fontStyle,
    		$_keys,
    		$_mode
    	});

    	$$self.$inject_state = $$props => {
    		if ('STATES' in $$props) $$invalidate(1, STATES = $$props.STATES);
    		if ('cursor' in $$props) cursor = $$props.cursor;
    		if ('CURSOR' in $$props) CURSOR = $$props.CURSOR;
    		if ('IS_MOVING' in $$props) IS_MOVING = $$props.IS_MOVING;
    		if ('IS_RESIZING' in $$props) IS_RESIZING = $$props.IS_RESIZING;
    		if ('lastMouseMove' in $$props) lastMouseMove = $$props.lastMouseMove;
    		if ('lastWidth' in $$props) $$invalidate(12, lastWidth = $$props.lastWidth);
    		if ('lastHeight' in $$props) $$invalidate(13, lastHeight = $$props.lastHeight);
    		if ('metaKeys' in $$props) metaKeys = $$props.metaKeys;
    		if ('outlineStyle' in $$props) outlineStyle = $$props.outlineStyle;
    		if ('fontStyle' in $$props) $$invalidate(2, fontStyle = $$props.fontStyle);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*lastWidth, lastHeight, w*/ 12289) {
    			((w, h) => {
    				if (w != lastWidth || h != lastHeight) {
    					draw();
    					$$invalidate(12, lastWidth = w);
    					$$invalidate(13, lastHeight = h);
    				}
    			})(w.width, w.height);
    		}

    		if ($$self.$$.dirty[0] & /*w*/ 1) {
    			$$invalidate(2, fontStyle = `
		font-size: ${w.FONTSIZE}px;
		width: ${Math.round(w.FONTSIZE * 0.6)}px;
		max-width: ${Math.round(w.FONTSIZE * 0.6)}px;
		min-width: ${Math.round(w.FONTSIZE * 0.6)}px;
	`);
    		}

    		if ($$self.$$.dirty[0] & /*w*/ 1) {
    			outlineStyle = !w.ACTIVE
    			? ''
    			: `
		transform: 
		translate(${w.ACTIVE?.start?.x * 8}px, ${w.ACTIVE?.start?.y}em);
		width: ${(w.ACTIVE?.end?.x - w.ACTIVE?.start?.x) * 8}px;
		height: ${w.ACTIVE?.end?.y - w.ACTIVE?.start?.y}em;
	`;
    		}
    	};

    	return [
    		w,
    		STATES,
    		fontStyle,
    		$_mode,
    		setSelected,
    		onMousedown,
    		onMousemove,
    		onMouseup,
    		draw,
    		onKeydownPre,
    		onKeyupPre,
    		deselectAll,
    		lastWidth,
    		lastHeight,
    		mouseup_handler,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		select0_change_handler,
    		select1_change_handler,
    		input0_input_handler_1,
    		input1_input_handler_1,
    		mousedown_handler,
    		mousemove_handler,
    		mouseup_handler_1,
    		mousedown_handler_1,
    		mouseover_handler,
    		click_handler,
    		textarea_input_handler
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
