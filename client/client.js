window.__ModuleLoader__.load({
	id: "fdtree",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

		var React = require("react");

		// ---- RPC over the host HTTP route (same protocol as the dynamic build) ----
		const rpcState = { sid: null };
		let layout = null;
		let timer = null;
		async function rpc(method, args) {
			const res = await fetch('/fdtree/rpc', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ method: method, args: args || {}, sid: rpcState.sid || '' }),
			});
			if (!res.ok) throw new Error('fdtree rpc http ' + res.status);
			const body = await res.json();
			if (!body.ok) throw new Error(body.error || 'fdtree rpc failed');
			return body.data;
		}

		const CSS_TEXT = '.fdt-sidebar-btn{display:flex;align-items:center;gap:6px;cursor:pointer;background:transparent;border:none;color:var(--dsw-alias-label-secondary);padding:4px 8px;border-radius:8px;font-size:13px;line-height:1.2;}.fdt-sidebar-btn:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);}.fdt-sidebar-btn-on{color:var(--dsw-alias-brand-primary);}.fdt-sidebar-icon{font-size:14px;}.fdt-panel{width:100%;height:100%;display:flex;flex-direction:column;background:var(--dsw-alias-bg-layer-1);font-size:13px;color:var(--dsw-alias-label-primary);overflow:hidden;}.fdt-header{display:flex;align-items:center;gap:8px;padding:7px 10px;border-bottom:1px solid var(--dsw-alias-border-l1);user-select:none;background:var(--dsw-alias-bg-layer-2);flex:none;}.fdt-title{font-weight:600;white-space:nowrap;}.fdt-tag{font-size:11px;padding:1px 7px;border-radius:999px;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-secondary);white-space:nowrap;}.fdt-tag-git{color:var(--dsw-alias-brand-primary);border-color:var(--dsw-alias-brand-primary);}.fdt-spacer{flex:1;}.fdt-btn{display:inline-flex;align-items:center;gap:4px;cursor:pointer;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-secondary);border-radius:7px;padding:3px 9px;font-size:12px;line-height:1.4;}.fdt-btn:hover{color:var(--dsw-alias-label-primary);border-color:var(--dsw-alias-border-l2);}.fdt-btn:disabled{opacity:.45;cursor:default;}.fdt-tabs{display:flex;gap:3px;padding:0 8px;overflow-x:auto;overflow-y:hidden;scrollbar-width:thin;max-height:0;opacity:0;border-bottom:1px solid transparent;transition:max-height .26s ease,opacity .2s ease,padding .26s ease;flex:none;background:var(--dsw-alias-bg-base);}.fdt-tabs-open{max-height:48px;opacity:1;padding:4px 8px 0;border-bottom-color:var(--dsw-alias-border-l1);}.fdt-tab{flex:1 1 auto;min-width:60px;max-width:220px;display:inline-flex;align-items:center;gap:6px;padding:3px 8px 4px;border:1px solid var(--dsw-alias-border-l1);border-bottom:none;border-radius:7px 7px 0 0;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);cursor:pointer;font-size:12px;position:relative;top:1px;overflow:hidden;}.fdt-tab:hover{color:var(--dsw-alias-label-primary);}.fdt-tab-on{background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);border-top:2px solid var(--dsw-alias-brand-primary);}.fdt-tab-name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.fdt-tab-dot{width:6px;height:6px;border-radius:50%;background:var(--dsw-alias-state-warn-primary);flex:none;}.fdt-tab-x{cursor:pointer;border:none;background:transparent;color:var(--dsw-alias-label-secondary);font-size:12px;padding:0 2px;border-radius:4px;line-height:1;flex:none;}.fdt-tab-x:hover{color:var(--dsw-alias-state-error-primary);background:var(--dsw-alias-bg-layer-2);}.fdt-body{display:flex;flex:1;min-height:0;}.fdt-tree{flex:0 1 auto;width:fit-content;min-width:150px;max-width:340px;overflow:auto;border-left:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-base);padding:4px 0;}.fdt-tnode{display:flex;align-items:center;gap:6px;padding:2px 6px;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:12.5px;color:var(--dsw-alias-label-secondary);}.fdt-tnode:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);}.fdt-tnode-active{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-brand-primary);}.fdt-tnode-icon{flex:none;font-size:12px;}.fdt-tnode-name{overflow:hidden;text-overflow:ellipsis;}.fdt-badge{flex:none;width:7px;height:7px;border-radius:50%;margin-left:auto;}.fdt-badge-mod,.fdt-badge-dirty{background:var(--dsw-alias-state-warn-primary);}.fdt-badge-untracked{background:var(--dsw-alias-state-success-primary);}.fdt-badge-deleted{background:var(--dsw-alias-state-error-primary);}.fdt-hint{color:var(--dsw-alias-label-secondary);font-size:11.5px;padding:2px 8px;opacity:.85;}.fdt-view{flex:1;display:flex;flex-direction:column;min-width:0;opacity:1;transform:none;transition:opacity .22s ease,transform .22s ease;}.fdt-view-anim{opacity:0;transform:translateX(24px);}.fdt-viewbar{display:flex;align-items:center;gap:8px;padding:5px 10px;border-bottom:1px solid var(--dsw-alias-border-l1);flex:none;background:var(--dsw-alias-bg-base);}.fdt-path{font-family:ui-monospace,Consolas,monospace;font-size:11.5px;color:var(--dsw-alias-label-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;}.fdt-scroll{flex:1;overflow:auto;background:var(--dsw-alias-bg-base);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12px;line-height:1.55;padding-bottom:8px;}.fdt-line{display:flex;white-space:pre;}.fdt-gutter{flex:none;width:52px;text-align:right;padding-right:10px;color:var(--dsw-alias-label-secondary);opacity:.75;user-select:none;}.fdt-code{flex:1;padding-right:14px;}.fdt-line-same:hover{background:var(--dsw-alias-bg-layer-2);}.fdt-line-add{background:rgba(46,160,67,0.16);background:color-mix(in srgb,var(--dsw-alias-state-success-primary) 15%,transparent);}.fdt-line-add .fdt-gutter{color:var(--dsw-alias-state-success-primary);opacity:1;}.fdt-line-del{background:rgba(248,81,73,0.16);background:color-mix(in srgb,var(--dsw-alias-state-error-primary) 15%,transparent);}.fdt-line-del .fdt-gutter{color:var(--dsw-alias-state-error-primary);opacity:1;}.fdt-line-sep{border-top:1px dashed var(--dsw-alias-border-l1);color:var(--dsw-alias-label-secondary);opacity:.6;}.fdt-ctxoverlay{position:fixed;inset:0;z-index:99998;background:transparent;}.fdt-ctxmenu{position:fixed;z-index:99999;min-width:210px;background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l2);border-radius:8px;box-shadow:0 6px 24px rgba(0,0,0,.28);padding:4px;font-size:12px;color:var(--dsw-alias-label-primary);user-select:none;}.fdt-ctxitem{display:flex;align-items:center;gap:6px;padding:6px 10px;border-radius:6px;cursor:pointer;white-space:nowrap;}.fdt-ctxitem:hover{background:var(--dsw-alias-bg-layer-1);}.fdt-loading{flex:1;display:flex;align-items:center;justify-content:center;color:var(--dsw-alias-label-secondary);font-size:12px;}.fdt-placeholder{flex:1;display:flex;align-items:center;justify-content:center;color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-base);}.fdt-err{flex:1;display:flex;align-items:center;justify-content:center;color:var(--dsw-alias-state-error-primary);background:var(--dsw-alias-bg-base);padding:20px;text-align:center;}.fdt-trunc{padding:8px 12px;color:var(--dsw-alias-state-warn-primary);font-size:12px;}.fdt-footer{flex:none;display:flex;align-items:center;gap:10px;padding:3px 10px;border-top:1px solid var(--dsw-alias-border-l1);font-size:11.5px;color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-2);}.fdt-add{color:var(--dsw-alias-state-success-primary);}.fdt-del{color:var(--dsw-alias-state-error-primary);}.fdt-banner{flex:none;padding:4px 10px;font-size:12px;color:var(--dsw-alias-state-warn-primary);background:var(--dsw-alias-bg-layer-2);border-bottom:1px solid var(--dsw-alias-border-l1);}.fdt-banner-ok{color:var(--dsw-alias-state-success-primary);}.fdt-tk-com{color:var(--dsw-alias-label-secondary);font-style:italic;}.fdt-tk-kw{color:var(--dsw-alias-brand-primary);}.fdt-tk-str{color:var(--dsw-alias-state-success-primary);}.fdt-tk-num{color:var(--dsw-alias-state-warn-primary);}.fdt-tk-fn{color:#8b5cf6;}.fdt-tk-mdh{font-weight:700;color:var(--dsw-alias-brand-primary);}.fdt-tk-mdb{font-weight:700;}.fdt-tk-mdi{font-style:italic;}.fdt-tk-mdc{background:var(--dsw-alias-bg-layer-2);border-radius:3px;padding:0 2px;}';

		function splitLines(t) { return String(t).replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n') }
		function fileIcon(name) {
			const n = String(name).toLowerCase()
			if (/\.(png|jpe?g|gif|webp|svg|ico)$/.test(n)) return '\ud83d\uddbc'
			if (/\.(md|markdown)$/.test(n)) return '\ud83d\udcdd'
			if (/\.json$/.test(n)) return '\ud83e\uddfe'
			if (/\.(js|mjs|cjs|jsx|ts|tsx)$/.test(n)) return '\ud83d\udfe8'
			if (/\.py$/.test(n)) return '\ud83d\udc0d'
			return '\ud83d\udcc4'
		}

		function detectLang(name) {
			const n = String(name).toLowerCase()
			if (/\.(js|mjs|cjs|jsx)$/.test(n)) return 'js'
			if (/\.(ts|tsx)$/.test(n)) return 'ts'
			if (/\.(py|pyw)$/.test(n)) return 'py'
			if (/\.json$/.test(n)) return 'json'
			if (/\.(md|markdown)$/.test(n)) return 'md'
			if (/\.(html?|xml|vue|svelte)$/.test(n)) return 'html'
			if (/\.css$/.test(n)) return 'css'
			if (/\.(yml|yaml|ini|toml|conf|cfg)$/.test(n)) return 'yaml'
			if (/\.(sh|bash|zsh|fish)$/.test(n)) return 'sh'
			if (/\.(c|h|cc|cpp|cxx|hpp|cs|java|m|mm)$/.test(n)) return 'c'
			if (/\.go$/.test(n)) return 'go'
			if (/\.rs$/.test(n)) return 'rust'
			if (/\.(php|php3|phtml)$/.test(n)) return 'php'
			if (/\.(rb|rake|gemspec)$/.test(n)) return 'ruby'
			if (/\.swift$/.test(n)) return 'swift'
			if (/\.(kt|kts)$/.test(n)) return 'kotlin'
			if (/\.sql$/.test(n)) return 'sql'
			if (/\.(ps1|psm1)$/.test(n)) return 'ps'
			if (/\.lua$/.test(n)) return 'lua'
			if (n === 'dockerfile') return 'docker'
			if (n === 'makefile' || n === 'gnumakefile') return 'make'
			if (n.indexOf('.env') === 0) return 'env'
			return null
		}

		const JS_KW = new Set(('const let var function return if else for while do switch case break continue new class extends import export from default try catch finally throw async await of in typeof instanceof this null undefined true false delete void yield static get set super type interface enum implements declare readonly namespace abstract').split(' '))
		const PY_KW = new Set(('def class return if elif else for while in not and or is import from as with try except finally raise pass break continue lambda yield global nonlocal del assert None True False self').split(' '))
		const SH_KW = new Set(('if then else elif fi for while do done echo export cd source set unset local return exit function case esac in').split(' '))
		const C_KW = new Set(('int char float double long short unsigned signed void struct union enum typedef const static extern inline register sizeof return if else for while do switch case break continue default goto auto bool true false nullptr new delete class namespace template typename public private protected virtual override using this try catch throw string object var internal sealed interface abstract final implements extends package import synchronized throws volatile').split(' '))
		const GO_KW = new Set(('func package import var const type struct interface map chan go select defer range return if else for switch case break continue fallthrough default goto').split(' '))
		const RUST_KW = new Set(('fn let mut pub use mod struct enum impl trait match if else for while loop return self Self crate super where dyn async await move ref type const static unsafe extern as in').split(' '))
		const PHP_KW = new Set(('echo print function class public private protected static var const new extends implements interface abstract final if else elseif while for foreach do return try catch throw include include_once require require_once namespace use global isset unset empty array list null true false as instanceof clone die exit').split(' '))
		const RUBY_KW = new Set(('def end class module if elsif else unless while until for in do begin rescue ensure raise return yield require puts print attr_accessor self nil true false and or not new lambda proc').split(' '))
		const SWIFT_KW = new Set(('func let var class struct enum protocol extension import if else guard for while repeat switch case return throw try catch do defer in as is nil true false self public private internal fileprivate open static override init').split(' '))
		const KOTLIN_KW = new Set(('fun val var class object interface data sealed enum when if else for while do return try catch finally throw import package as is in out lateinit init constructor companion override open abstract final suspend this super null true false private protected public internal').split(' '))
		const SQL_KW = new Set(('select from where insert update delete create table drop alter index view join left right inner outer full on group by order having limit union all distinct as and or not null primary key foreign references into values set between like exists case end count sum avg min max').split(' '))
		const PS_KW = new Set(('function param if else elseif foreach for while switch try catch finally throw return exit break continue new where-object select-object foreach-object begin process end').split(' '))
		const LUA_KW = new Set(('function local end if then else elseif for while do repeat until return break and or not nil true false require').split(' '))
		const DOCKER_KW = new Set(('FROM RUN COPY CMD ENTRYPOINT ENV WORKDIR EXPOSE USER ARG LABEL ADD VOLUME MAINTAINER ONBUILD STOPSIGNAL HEALTHCHECK SHELL AS').split(' '))

		function makeCLike(opts) {
			const kw = opts.kw || null
			const lineCom = opts.lineCom || /^\/\/[^\n]*/
			const extras = opts.extras || []
			const ci = !!opts.ci
			const strictSingle = !!opts.strictSingle
			return function (line, st) {
				const out = []
				let rest = line
				while (rest.length > 0) {
					if (st.inBlock) {
						const idx = rest.indexOf('*/')
						if (idx === -1) { out.push({ t: 'com', text: rest }); rest = ''; break }
						out.push({ t: 'com', text: rest.slice(0, idx + 2) }); rest = rest.slice(idx + 2); st.inBlock = false; continue
					}
					let m = lineCom.exec(rest)
					if (m) { out.push({ t: 'com', text: m[0] }); rest = rest.slice(m[0].length); continue }
					m = /^\/\*[\s\S]*?\*\//.exec(rest)
					if (m) { out.push({ t: 'com', text: m[0] }); rest = rest.slice(m[0].length); continue }
					m = /^\/\*/.exec(rest)
					if (m) { st.inBlock = true; continue }
					m = /^`(?:[^`\\]|\\.)*`?/.exec(rest)
					if (m) { out.push({ t: 'str', text: m[0] }); rest = rest.slice(m[0].length); continue }
					m = /^"(?:[^"\\\n]|\\.)*"?/.exec(rest)
					if (m) { out.push({ t: 'str', text: m[0] }); rest = rest.slice(m[0].length); continue }
					m = strictSingle ? /^'(?:[^'\\\n]|\\.)*'/.exec(rest) : /^'(?:[^'\\\n]|\\.)*'?/.exec(rest)
					if (m) { out.push({ t: 'str', text: m[0] }); rest = rest.slice(m[0].length); continue }
					m = /^\b\d[\w.]*/.exec(rest)
					if (m) { out.push({ t: 'num', text: m[0] }); rest = rest.slice(m[0].length); continue }
					let hit = false
					for (const ex of extras) {
						m = ex.re.exec(rest)
						if (m) { out.push({ t: ex.t, text: m[0] }); rest = rest.slice(m[0].length); hit = true; break }
					}
					if (hit) continue
					m = /^[A-Za-z_$][\w$]*/.exec(rest)
					if (m) {
						const w = m[0]
						const key = ci ? w.toLowerCase() : w
						let t = (kw && kw.has(key)) ? 'kw' : 'id'
						if (t === 'id') {
							const after = rest.slice(w.length)
							if (/^\s*\(/.test(after)) t = 'fn'
						}
						out.push({ t: t, text: w }); rest = rest.slice(w.length); continue
					}
					out.push({ t: '', text: rest.charAt(0) }); rest = rest.slice(1)
				}
				return out
			}
		}

		const JS_TK = makeCLike({ kw: JS_KW })
		const C_TK = makeCLike({ kw: C_KW })
		const GO_TK = makeCLike({ kw: GO_KW })
		const RUST_TK = makeCLike({ kw: RUST_KW, strictSingle: true, extras: [{ re: /^'[A-Za-z_]\w*/, t: 'num' }] })
		const PHP_TK = makeCLike({ kw: PHP_KW, extras: [{ re: /^\$[\w]+/, t: 'num' }, { re: /^#[^\n]*/, t: 'com' }] })
		const RUBY_TK = makeCLike({ kw: RUBY_KW, lineCom: /^#[^\n]*/, extras: [{ re: /^:[A-Za-z_]\w*[?!]?/, t: 'fn' }, { re: /^@@?[A-Za-z_]\w*/, t: 'num' }] })
		const SWIFT_TK = makeCLike({ kw: SWIFT_KW })
		const KOTLIN_TK = makeCLike({ kw: KOTLIN_KW })
		const SQL_TK = makeCLike({ kw: SQL_KW, ci: true, lineCom: /^--[^\n]*/ })
		const PS_TK = makeCLike({ kw: PS_KW, ci: true, lineCom: /^#[^\n]*/, extras: [{ re: /^\$[\w:]+/, t: 'num' }] })
		const LUA_TK = makeCLike({ kw: LUA_KW, lineCom: /^--[^\n]*/ })

		function tkPy(line, st) {
			const out = []
			let rest = line
			while (rest.length > 0) {
				if (st.inTrip) {
					const idx = rest.indexOf(st.inTrip)
					if (idx === -1) { out.push({ t: 'str', text: rest }); rest = ''; break }
					out.push({ t: 'str', text: rest.slice(0, idx + 3) }); rest = rest.slice(idx + 3); st.inTrip = null; continue
				}
				let m = /^#[^\n]*/.exec(rest)
				if (m) { out.push({ t: 'com', text: m[0] }); rest = rest.slice(m[0].length); continue }
				m = /^@[\w.]+/.exec(rest)
				if (m) { out.push({ t: 'fn', text: m[0] }); rest = rest.slice(m[0].length); continue }
				m = /^("""|''')/.exec(rest)
				if (m) {
					const q = m[1]
					const idx = rest.indexOf(q, 3)
					if (idx === -1) { st.inTrip = q; out.push({ t: 'str', text: rest }); rest = ''; break }
					out.push({ t: 'str', text: rest.slice(0, idx + 3) }); rest = rest.slice(idx + 3); continue
				}
				m = /^[rbfu]*(?:"[^"\n]*"?|'[^'\n]*'?)/.exec(rest)
				if (m) { out.push({ t: 'str', text: m[0] }); rest = rest.slice(m[0].length); continue }
				m = /^\b\d[\w.]*/.exec(rest)
				if (m) { out.push({ t: 'num', text: m[0] }); rest = rest.slice(m[0].length); continue }
				m = /^[A-Za-z_]\w*/.exec(rest)
				if (m) {
					const w = m[0]
					let t = PY_KW.has(w) ? 'kw' : 'id'
					if (t === 'id') {
						const after = rest.slice(w.length)
						if (/^\s*\(/.test(after)) t = 'fn'
					}
					out.push({ t: t, text: w }); rest = rest.slice(w.length); continue
				}
				out.push({ t: '', text: rest.charAt(0) }); rest = rest.slice(1)
			}
			return out
		}
		function tkJson(line) {
			const out = []
			let rest = line
			while (rest.length > 0) {
				let m = /^"(?:[^"\\]|\\.)*"(?=\s*:)/.exec(rest)
				if (m) { out.push({ t: 'fn', text: m[0] }); rest = rest.slice(m[0].length); continue }
				m = /^"(?:[^"\\]|\\.)*"?/.exec(rest)
				if (m) { out.push({ t: 'str', text: m[0] }); rest = rest.slice(m[0].length); continue }
				m = /^-?\d[\d.eE+-]*/.exec(rest)
				if (m) { out.push({ t: 'num', text: m[0] }); rest = rest.slice(m[0].length); continue }
				m = /^(true|false|null)/.exec(rest)
				if (m) { out.push({ t: 'kw', text: m[0] }); rest = rest.slice(m[0].length); continue }
				out.push({ t: '', text: rest.charAt(0) }); rest = rest.slice(1)
			}
			return out
		}
		function tkMd(line) {
			if (/^#{1,6}\s/.test(line)) return [{ t: 'mdh', text: line }]
			if (/^\s*>\s/.test(line)) return [{ t: 'com', text: line }]
			const out = []
			let rest = line
			while (rest.length > 0) {
				let m = /^`[^`\n]*`/.exec(rest)
				if (m) { out.push({ t: 'mdc', text: m[0] }); rest = rest.slice(m[0].length); continue }
				m = /^\*\*[^*\n]+\*\*/.exec(rest)
				if (m) { out.push({ t: 'mdb', text: m[0] }); rest = rest.slice(m[0].length); continue }
				m = /^\*[^*\n]+\*/.exec(rest)
				if (m) { out.push({ t: 'mdi', text: m[0] }); rest = rest.slice(m[0].length); continue }
				m = /^\[[^\]\n]*\]\([^)\n]*\)/.exec(rest)
				if (m) { out.push({ t: 'str', text: m[0] }); rest = rest.slice(m[0].length); continue }
				if (rest.indexOf('```') === 0) { out.push({ t: 'mdc', text: rest }); rest = ''; continue }
				out.push({ t: '', text: rest }); rest = ''
			}
			return out
		}
		function tkHtml(line) {
			const out = []
			let rest = line
			while (rest.length > 0) {
				let m = /^<!--[\s\S]*?-->/.exec(rest)
				if (m) { out.push({ t: 'com', text: m[0] }); rest = rest.slice(m[0].length); continue }
				m = /^<\/?[A-Za-z][\w-]*/.exec(rest)
				if (m) { out.push({ t: 'kw', text: m[0] }); rest = rest.slice(m[0].length); continue }
				m = /^[A-Za-z-]+(?==)/.exec(rest)
				if (m) { out.push({ t: 'fn', text: m[0] }); rest = rest.slice(m[0].length); continue }
				m = /^"[^"]*"?/.exec(rest)
				if (m) { out.push({ t: 'str', text: m[0] }); rest = rest.slice(m[0].length); continue }
				out.push({ t: '', text: rest.charAt(0) }); rest = rest.slice(1)
			}
			return out
		}
		function tkCss(line) {
			const out = []
			let rest = line
			while (rest.length > 0) {
				let m = /^\/\*[\s\S]*?\*\//.exec(rest)
				if (m) { out.push({ t: 'com', text: m[0] }); rest = rest.slice(m[0].length); continue }
				m = /^#[0-9a-fA-F]{3,8}\b/.exec(rest)
				if (m) { out.push({ t: 'num', text: m[0] }); rest = rest.slice(m[0].length); continue }
				m = /^[-"']?[\w-]+(?=\s*:)/.exec(rest)
				if (m) { out.push({ t: 'fn', text: m[0] }); rest = rest.slice(m[0].length); continue }
				m = /^"[^"]*"?/.exec(rest)
				if (m) { out.push({ t: 'str', text: m[0] }); rest = rest.slice(m[0].length); continue }
				m = /^-?[\d.]+(?:px|em|rem|%|vh|vw|vmin|vmax|s|ms|deg|fr)?/.exec(rest)
				if (m) { out.push({ t: 'num', text: m[0] }); rest = rest.slice(m[0].length); continue }
				m = /^!important/.exec(rest)
				if (m) { out.push({ t: 'kw', text: m[0] }); rest = rest.slice(m[0].length); continue }
				out.push({ t: '', text: rest.charAt(0) }); rest = rest.slice(1)
			}
			return out
		}
		function tkYaml(line) {
			const out = []
			let rest = line
			while (rest.length > 0) {
				let m = /^#[^\n]*/.exec(rest)
				if (m) { out.push({ t: 'com', text: m[0] }); rest = rest.slice(m[0].length); continue }
				m = /^[\w.-]+(?=\s*:)/.exec(rest)
				if (m) { out.push({ t: 'kw', text: m[0] }); rest = rest.slice(m[0].length); continue }
				m = /^"[^"]*"?|^'[^']*'?/.exec(rest)
				if (m) { out.push({ t: 'str', text: m[0] }); rest = rest.slice(m[0].length); continue }
				m = /^(true|false|null|yes|no|on|off)/.exec(rest)
				if (m) { out.push({ t: 'num', text: m[0] }); rest = rest.slice(m[0].length); continue }
				m = /^-?\d[\d.]*/.exec(rest)
				if (m) { out.push({ t: 'num', text: m[0] }); rest = rest.slice(m[0].length); continue }
				out.push({ t: '', text: rest.charAt(0) }); rest = rest.slice(1)
			}
			return out
		}
		function tkSh(line) {
			const out = []
			let rest = line
			while (rest.length > 0) {
				let m = /^#[^\n]*/.exec(rest)
				if (m) { out.push({ t: 'com', text: m[0] }); rest = rest.slice(m[0].length); continue }
				m = /^\$\{[^}]*\}|^\$[\w]+/.exec(rest)
				if (m) { out.push({ t: 'num', text: m[0] }); rest = rest.slice(m[0].length); continue }
				m = /^"[^"]*"?|^'[^']*'?/.exec(rest)
				if (m) { out.push({ t: 'str', text: m[0] }); rest = rest.slice(m[0].length); continue }
				m = /^[A-Za-z_][\w-]*/.exec(rest)
				if (m) {
					const w = m[0]
					out.push({ t: SH_KW.has(w) ? 'kw' : 'id', text: w }); rest = rest.slice(w.length); continue
				}
				out.push({ t: '', text: rest.charAt(0) }); rest = rest.slice(1)
			}
			return out
		}
		function tkDocker(line) {
			const out = []
			let rest = line
			while (rest.length > 0) {
				let m = /^#[^\n]*/.exec(rest)
				if (m) { out.push({ t: 'com', text: m[0] }); rest = rest.slice(m[0].length); continue }
				m = /^[A-Za-z_][\w-]*/.exec(rest)
				if (m) {
					const w = m[0]
					out.push({ t: DOCKER_KW.has(w) ? 'kw' : 'id', text: w }); rest = rest.slice(w.length); continue
				}
				out.push({ t: '', text: rest.charAt(0) }); rest = rest.slice(1)
			}
			return out
		}
		function tkMake(line) {
			const out = []
			let rest = line
			while (rest.length > 0) {
				let m = /^#[^\n]*/.exec(rest)
				if (m) { out.push({ t: 'com', text: m[0] }); rest = rest.slice(m[0].length); continue }
				m = /^\$\([^)]*\)|^\$\{[^}]*\}|^\$[\w]+/.exec(rest)
				if (m) { out.push({ t: 'num', text: m[0] }); rest = rest.slice(m[0].length); continue }
				m = /^[A-Za-z0-9_./-]+(?=:)/.exec(rest)
				if (m) { out.push({ t: 'fn', text: m[0] }); rest = rest.slice(m[0].length); continue }
				out.push({ t: '', text: rest.charAt(0) }); rest = rest.slice(1)
			}
			return out
		}
		function tkEnv(line) {
			const out = []
			let rest = line
			while (rest.length > 0) {
				let m = /^#[^\n]*/.exec(rest)
				if (m) { out.push({ t: 'com', text: m[0] }); rest = rest.slice(m[0].length); continue }
				m = /^[A-Za-z_][\w.]*(?==)/.exec(rest)
				if (m) { out.push({ t: 'fn', text: m[0] }); rest = rest.slice(m[0].length); continue }
				m = /^"[^"]*"?|^'[^']*'?/.exec(rest)
				if (m) { out.push({ t: 'str', text: m[0] }); rest = rest.slice(m[0].length); continue }
				out.push({ t: '', text: rest.charAt(0) }); rest = rest.slice(1)
			}
			return out
		}

		function makeTokenizer(lang) {
			if (lang === 'js' || lang === 'ts') return JS_TK
			if (lang === 'py') return tkPy
			if (lang === 'json') return tkJson
			if (lang === 'md') return tkMd
			if (lang === 'html') return tkHtml
			if (lang === 'css') return tkCss
			if (lang === 'yaml') return tkYaml
			if (lang === 'sh') return tkSh
			if (lang === 'c') return C_TK
			if (lang === 'go') return GO_TK
			if (lang === 'rust') return RUST_TK
			if (lang === 'php') return PHP_TK
			if (lang === 'ruby') return RUBY_TK
			if (lang === 'swift') return SWIFT_TK
			if (lang === 'kotlin') return KOTLIN_TK
			if (lang === 'sql') return SQL_TK
			if (lang === 'ps') return PS_TK
			if (lang === 'lua') return LUA_TK
			if (lang === 'docker') return tkDocker
			if (lang === 'make') return tkMake
			if (lang === 'env') return tkEnv
			return null
		}
		function tokenRow(text, lang, tkState) {
			if (!lang) return text
			const tk = makeTokenizer(lang)
			if (!tk) return text
			const segs = tk(text, tkState || {})
			if (segs.length === 1 && segs[0].t === '') return text
			return segs.map(function (sg, i) {
				return React.createElement('span', { key: i, className: sg.t ? 'fdt-tk-' + sg.t : undefined }, sg.text)
			})
		}

		function createStore(initial) {
			let state = initial
			const subs = new Set()
			return {
				get: function () { return state },
				set: function (patch) { state = Object.assign({}, state, patch); for (const f of subs) f() },
				update: function (fn) { state = fn(state); for (const f of subs) f() },
				subscribe: function (f) { subs.add(f); return function () { subs.delete(f) } },
			}
		}
		function useStore(store) {
			const [s, set] = React.useState(store.get())
			React.useEffect(function () { return store.subscribe(function () { set(store.get()) }) }, [store])
			return s
		}

		const store = createStore({
			visible: false,
			wide: true,
			treeCollapsed: false,
			contentOpen: false,
		})

		const latest = { active: null, expanded: {}, tabs: [], git: false, files: {}, diffs: {} }
		let pollBusy = false

		function Explorer(props) {
			const s = useStore(store)
			const sid = props && props.sid !== undefined && props.sid !== null ? String(props.sid) : null
			const [rootInfo, setRootInfo] = React.useState(null)
			const [tree, setTree] = React.useState(null)
			const [children, setChildren] = React.useState({})
			const [expanded, setExpanded] = React.useState({})
			const [status, setStatus] = React.useState({})
			const [tabs, setTabs] = React.useState([])
			const [active, setActive] = React.useState(null)
			const [files, setFiles] = React.useState({})
			const [diffs, setDiffs] = React.useState({})
			const [busy, setBusy] = React.useState(false)
			const [err, setErr] = React.useState(null)
			const [ready, setReady] = React.useState(false)
			const [ctxMenu, setCtxMenu] = React.useState(null)
			const [notice, setNotice] = React.useState(null)
			const [contentOpen, setContentOpen] = React.useState(false)
			const [viewAnimated, setViewAnimated] = React.useState(false)

			latest.active = active
			latest.expanded = expanded
			latest.tabs = tabs
			latest.files = files
			latest.diffs = diffs
			latest.git = !!(rootInfo && rootInfo.git && rootInfo.git.available)
			rpcState.sid = sid

			React.useEffect(function () {
				store.set({ visible: true, contentOpen: contentOpen })
			}, [])

			React.useEffect(function () {
				store.set({ contentOpen: contentOpen })
				if (layout === undefined) return
				if (s.visible) layout.openDetails()
				else layout.closeDetails()
			}, [contentOpen, s.visible])

			async function doRefresh(force) {
				if (pollBusy) return
				pollBusy = true
				if (force) setBusy(true)
				setErr(null)
				try {
					const ri = await rpc('getRoot')
					if (ri && ri.ok) { setReady(true); setRootInfo(ri) }
					const gitOn = ri && ri.ok && ri.git && ri.git.available
					if (gitOn) {
						const st = await rpc('gitStatus')
						if (st && st.ok && st.git) {
							const map = {}
							for (const e of st.entries) {
								const code = e.x + e.y
								map[e.rel] = code === '??' ? 'untracked' : (code.charAt(0) === 'D' || code.charAt(1) === 'D') ? 'deleted' : 'mod'
							}
							setStatus(map)
						}
					} else {
						const map = {}
						for (const t of latest.tabs) {
							const f = await rpc('readFile', { rel: t.rel })
							if (f && f.ok && f.changed) map[t.rel] = 'dirty'
						}
						setStatus(map)
					}
					const rootList = await rpc('listDir', { rel: '' })
					if (rootList && rootList.ok) setTree(rootList.entries)
					const dirs = Object.keys(latest.expanded).filter(function (k) { return latest.expanded[k] })
					if (dirs.length > 0) {
						const next = {}
						for (const d of dirs) {
							const res = await rpc('listDir', { rel: d })
							if (res && res.ok) next[d] = res.entries
						}
						setChildren(function (prev) { return Object.assign({}, prev, next) })
					}
					const act = latest.active
					if (act) {
						const f = await rpc('readFile', { rel: act })
						if (f) {
							const prevF = latest.files[act]
							const needDiff = !prevF || !f.ok || !prevF.ok || prevF.content !== f.content || !latest.diffs[act]
							setFiles(function (prev) { const n = Object.assign({}, prev); n[act] = f; return n })
							if (needDiff) {
								const d = await rpc('getDiff', { rel: act })
								if (d) setDiffs(function (prev) { const n = Object.assign({}, prev); n[act] = d; return n })
							}
						}
					}
				} catch (e) {
					setErr(String(e && e.message || e))
				} finally {
					pollBusy = false
					if (force) setBusy(false)
				}
			}

			React.useEffect(function () {
				if (!sid) return
				let cancelled = false
				let stop = null
				;(async function () {
					try {
						await rpc('setSession', { sid: sid })
						if (cancelled) return
						// 轮询先启动：即使会话注册稍有延迟，也会在后续轮询中完成绑定并解除加载态
						if (timer !== undefined) stop = timer.interval(function () { doRefresh(false) }, 3000)
						await doRefresh(true)
					} catch (e) {
						if (!cancelled) setErr(String(e && e.message || e))
					}
				})()
				return function () { if (stop) stop(); cancelled = true }
			}, [sid])

			React.useEffect(function () {
				if (!active) return
				let cancelled = false
				;(async function () {
					const f = await rpc('readFile', { rel: active })
					if (cancelled) return
					if (f) setFiles(function (prev) { const n = Object.assign({}, prev); n[active] = f; return n })
					if (f && f.ok && f.changed && !latest.git) {
						setStatus(function (prev) { const n = Object.assign({}, prev); n[active] = 'dirty'; return n })
					}
					const d = await rpc('getDiff', { rel: active })
					if (!cancelled && d) setDiffs(function (prev) { const n = Object.assign({}, prev); n[active] = d; return n })
				})()
				return function () { cancelled = true }
			}, [active])

			function openFile(rel, name) {
				setTabs(function (prev) {
					for (const t of prev) if (t.rel === rel) return prev
					return prev.concat([{ rel: rel, name: name }])
				})
				setActive(rel)
				setContentOpen(true)
				setViewAnimated(false)
				if (timer !== undefined) timer.timeout(function () { setViewAnimated(true) }, 30)
			}
			function closeTab(rel) {
				const rest = tabs.filter(function (t) { return t.rel !== rel })
				setTabs(rest)
				setFiles(function (prev) { const n = Object.assign({}, prev); delete n[rel]; return n })
				setDiffs(function (prev) { const n = Object.assign({}, prev); delete n[rel]; return n })
				if (latest.active === rel) setActive(rest.length > 0 ? rest[rest.length - 1].rel : null)
			}
			function toggleDir(rel) {
				if (expanded[rel]) {
					setExpanded(function (prev) { const n = Object.assign({}, prev); delete n[rel]; return n })
				} else {
					setExpanded(function (prev) { const n = Object.assign({}, prev); n[rel] = true; return n })
					if (children[rel] === undefined) {
						;(async function () {
							const res = await rpc('listDir', { rel: rel })
							if (res && res.ok) setChildren(function (prev) { const n = Object.assign({}, prev); n[rel] = res.entries; return n })
							else setChildren(function (prev) { const n = Object.assign({}, prev); n[rel] = []; return n })
						})()
					}
				}
			}
			async function setBaselineNow() {
				if (!active) return
				await rpc('setBaseline', { rel: active })
				const f = await rpc('readFile', { rel: active })
				if (f) setFiles(function (prev) { const n = Object.assign({}, prev); n[active] = f; return n })
				const d = await rpc('getDiff', { rel: active })
				if (d) setDiffs(function (prev) { const n = Object.assign({}, prev); n[active] = d; return n })
				setStatus(function (prev) { const n = Object.assign({}, prev); delete n[active]; return n })
			}

			async function doTerminal(target) {
				const m = ctxMenu
				setCtxMenu(null)
				if (m === null) return
				if (target === null) target = m.rel
				// 文件不可 cd，取其所在目录
				if (!m.isDir && target !== '') {
					const idx = target.lastIndexOf('/')
					target = idx === -1 ? '' : target.slice(0, idx)
				}
				try {
					const res = await rpc('openTerminal', { rel: target })
					if (!res || !res.ok) setErr((res && res.error) || '\u6253\u5f00\u7ec8\u7aef\u5931\u8d25')
					else {
						const cwd = res.cwd && typeof res.cwd === 'object' && res.cwd.displayPath ? res.cwd.displayPath : String(res.cwd || '')
						setNotice('\u2705 \u5df2\u6253\u5f00\u7ec8\u7aef\uff08' + (res.terminal || '') + '\uff09: ' + cwd)
						if (timer !== undefined) timer.timeout(function () { setNotice(null) }, 4000)
					}
				} catch (e) {
					setErr(String(e && e.message || e))
				}
			}

			function ctxMenuEl() {
				if (ctxMenu === null) return null
				const m = ctxMenu
				const items = []
				items.push(React.createElement('div', { className: 'fdt-ctxitem', key: 'root', onClick: function () { doTerminal('') } }, '\ud83d\udda5 \u6253\u5f00\u7ec8\u7aef\uff08\u5de5\u4f5c\u533a\u6839\uff09'))
				if (m.rel !== '') {
					items.push(React.createElement('div', { className: 'fdt-ctxitem', key: 'here', onClick: function () { doTerminal(null) } },
						m.isDir ? '\ud83d\udda5 \u6253\u5f00\u7ec8\u7aef\u5e76 cd \u5230 ' + m.name : '\ud83d\udda5 \u6253\u5f00\u7ec8\u7aef\uff08\u6587\u4ef6\u6240\u5728\u76ee\u5f55\uff09'))
				}
				return React.createElement('div', {
					className: 'fdt-ctxoverlay',
					onClick: function () { setCtxMenu(null) },
					onContextMenu: function (e) { e.preventDefault(); setCtxMenu(null) },
				},
					React.createElement('div', { className: 'fdt-ctxmenu', style: { left: Math.min(m.x, (window.innerWidth || 0) - 220) + 'px', top: Math.min(m.y, (window.innerHeight || 0) - 80) + 'px' } }, items),
				)
			}

			function TreeNode(props) {
				const entry = props.entry
				const depth = props.depth || 0
				const parent = props.parent || ''
				const rel = parent === '' ? entry.name : parent + '/' + entry.name
				const isDir = entry.type === 'directory'
				const isOpen = !!expanded[rel]
				const kids = children[rel]
				const st = status[rel]
				const icon = isDir ? (isOpen ? '\ud83d\udcc2' : '\ud83d\udcc1') : fileIcon(entry.name)
				const row = React.createElement('div', {
					className: 'fdt-tnode' + (active === rel ? ' fdt-tnode-active' : ''),
					style: { paddingLeft: (6 + depth * 14) + 'px' },
					title: entry.name,
					onClick: function () { if (isDir) toggleDir(rel); else openFile(rel, entry.name) },
					onContextMenu: function (e) { e.preventDefault(); e.stopPropagation(); setCtxMenu({ x: e.clientX, y: e.clientY, rel: rel, name: entry.name, isDir: isDir }) },
				},
					React.createElement('span', { className: 'fdt-tnode-icon' }, icon),
					React.createElement('span', { className: 'fdt-tnode-name' }, entry.name),
					st ? React.createElement('span', { className: 'fdt-badge fdt-badge-' + st, title: st === 'dirty' ? '相对基线已修改' : 'git: ' + st }) : null,
				)
				if (!isDir || !isOpen) return row
				const rows = [row]
				if (kids === undefined) {
					rows.push(React.createElement('div', { className: 'fdt-hint', style: { paddingLeft: (6 + (depth + 1) * 14) + 'px' } }, '加载中\u2026'))
				} else if (kids.length === 0) {
					rows.push(React.createElement('div', { className: 'fdt-hint', style: { paddingLeft: (6 + (depth + 1) * 14) + 'px' } }, '\uff08\u7a7a\uff09'))
				} else {
					for (const k of kids) rows.push(React.createElement(TreeNode, { key: rel + '/' + k.name, entry: k, depth: depth + 1, parent: rel }))
				}
				return React.createElement('div', null, rows)
			}

			function errBox(f) {
				return React.createElement('div', { className: 'fdt-err' }, (f.error || '\u8bfb\u53d6\u5931\u8d25') + (f.code ? ' [' + f.code + ']' : ''))
			}

			function renderDiffRows(d, lang, plain) {
				const tkState = {}
				const rows = []
				for (let i = 0; i < d.lines.length; i++) {
					const ln = d.lines[i]
					if (ln.t === 'sep') {
						rows.push(React.createElement('div', { className: 'fdt-line fdt-line-sep', key: i }))
						continue
					}
					const cls = ln.t === 'add' ? 'fdt-line-add' : ln.t === 'del' ? 'fdt-line-del' : 'fdt-line-same'
					const gutter = ln.t === 'add' ? '+' + (ln.b !== null ? ln.b : '') : ln.t === 'del' ? '-' + (ln.a !== null ? ln.a : '') : String(ln.b !== null ? ln.b : '')
					rows.push(React.createElement('div', { className: 'fdt-line ' + cls, key: i },
						React.createElement('span', { className: 'fdt-gutter' }, gutter),
						React.createElement('span', { className: 'fdt-code' }, ln.text === '' ? '\u00a0' : (plain ? ln.text : tokenRow(ln.text, lang, tkState))),
					))
				}
				return rows
			}

			function renderContent() {
				if (!active) {
					return React.createElement('div', { className: 'fdt-placeholder' }, rootInfo && tree ? '\ud83d\udc49 \u70b9\u51fb\u53f3\u4fa7\u6587\u4ef6\u67e5\u770b\u5185\u5bb9' : '\u52a0\u8f7d\u4e2d\u2026')
				}
				const f = files[active]
				const d = diffs[active]
				let lang = null
				for (const t of tabs) { if (t.rel === active) { lang = detectLang(t.name); break } }
				if (!f && !d) return React.createElement('div', { className: 'fdt-placeholder' }, '\u52a0\u8f7d\u4e2d\u2026')
				if (f && !f.ok) {
					if (d && d.ok && d.changed) {
						return React.createElement('div', { className: 'fdt-scroll' },
							React.createElement('div', { className: 'fdt-hint' }, '\u26a0 \u6587\u4ef6\u5df2\u88ab\u5220\u9664\uff0c\u4ee5\u4e0b\u4e3a\u76f8\u5bf9\u57fa\u7ebf\u7684\u5220\u9664\u5185\u5bb9'),
							renderDiffRows(d, lang, d.lines.length > 3000),
						)
					}
					return errBox(f)
				}
				if (d && d.ok && d.changed) {
					return React.createElement('div', { className: 'fdt-scroll' }, renderDiffRows(d, lang, d.lines.length > 3000))
				}
				if (f && f.ok) {
					const lines = splitLines(f.content)
					const many = lines.length > 3000
					const cap = many ? 8000 : 4000
					const shown = lines.slice(0, cap)
					const tkState = {}
					const rows = []
					for (let i = 0; i < shown.length; i++) {
						rows.push(React.createElement('div', { className: 'fdt-line fdt-line-same', key: i },
							React.createElement('span', { className: 'fdt-gutter' }, String(i + 1)),
							React.createElement('span', { className: 'fdt-code' }, shown[i] === '' ? '\u00a0' : (many ? shown[i] : tokenRow(shown[i], lang, tkState))),
						))
					}
					return React.createElement('div', { className: 'fdt-scroll' },
						rows.length > 0 ? rows : React.createElement('div', { className: 'fdt-hint' }, '\uff08\u7a7a\u6587\u4ef6\uff09'),
						many ? React.createElement('div', { className: 'fdt-trunc' }, '\u5927\u6587\u4ef6\uff1a\u5df2\u5173\u95ed\u8bed\u6cd5\u9ad8\u4eae\u4ee5\u63d0\u5347\u6027\u80fd') : null,
						lines.length > cap ? React.createElement('div', { className: 'fdt-trunc' }, '\u5df2\u663e\u793a\u524d ' + cap + ' \u884c / \u5171 ' + lines.length + ' \u884c') : null,
					)
				}
				return React.createElement('div', { className: 'fdt-placeholder' }, '\u52a0\u8f7d\u4e2d\u2026')
			}

			if (!s.visible) return null

			// 会话绑定并首次刷新成功前，不渲染任何路径/文件内容（避免闪出兜底根目录）
			if (!ready) {
				return React.createElement('div', { className: 'fdt-panel' },
					err ? React.createElement('div', { className: 'fdt-banner' }, '\u26a0 ' + err) : null,
					React.createElement('div', { className: 'fdt-loading' }, '\u52a0\u8f7d\u4e2d\u2026'))
			}

			const gitMode = latest.git
			const act = active ? files[active] : null
			const d = active ? diffs[active] : null
			const changed = act && act.ok ? act.changed : false

			return React.createElement('div', { className: 'fdt-panel' },
				React.createElement('div', { className: 'fdt-header' },
					React.createElement('span', { className: 'fdt-title' }, '\ud83d\uddc2 \u6587\u4ef6\u6811'),
					gitMode
						? React.createElement('span', { className: 'fdt-tag fdt-tag-git', title: 'git \u6a21\u5f0f\uff1a\u4e0e HEAD \u6bd4\u8f83' }, 'GIT ' + (rootInfo && rootInfo.git.branch ? rootInfo.git.branch : ''))
						: React.createElement('span', { className: 'fdt-tag', title: '\u57fa\u7ebf\u6a21\u5f0f\uff1a\u4e0e\u4f1a\u8bdd\u5feb\u7167\u6bd4\u8f83' }, '\u57fa\u7ebf'),
					React.createElement('span', { className: 'fdt-spacer' }),
					React.createElement('button', { className: 'fdt-btn', title: '\u5237\u65b0', onClick: function () { doRefresh(true) } }, busy ? '\u27f3\u2026' : '\u27f3'),
					React.createElement('button', { className: 'fdt-btn', title: s.treeCollapsed ? '\u5c55\u5f00\u6587\u4ef6\u6811' : '\u6536\u8d77\u6587\u4ef6\u6811', onClick: function () { store.set({ treeCollapsed: !s.treeCollapsed }) } }, s.treeCollapsed ? '\u25b8' : '\u25c2'),
					React.createElement('button', { className: 'fdt-btn', title: '\u5173\u95ed\u9762\u677f', onClick: function () { store.set({ visible: false }) } }, '\u2715'),
				),
				err ? React.createElement('div', { className: 'fdt-banner' }, '\u26a0 ' + err) : null,
				notice ? React.createElement('div', { className: 'fdt-banner fdt-banner-ok' }, notice) : null,
				!gitMode && rootInfo && rootInfo.git && rootInfo.git.error ? React.createElement('div', { className: 'fdt-banner' }, '\u26a0 git: ' + rootInfo.git.error) : null,
				React.createElement('div', { className: 'fdt-tabs' + (contentOpen ? ' fdt-tabs-open' : '') },
					tabs.map(function (t) {
						const tf = files[t.rel]
						const dot = tf && tf.ok && tf.changed
						return React.createElement('div', {
							key: t.rel,
							className: 'fdt-tab' + (active === t.rel ? ' fdt-tab-on' : ''),
							title: t.rel,
							onClick: function () { setActive(t.rel) },
						},
							React.createElement('span', { className: 'fdt-tab-name' }, t.name),
							dot ? React.createElement('span', { className: 'fdt-tab-dot', title: '\u5df2\u4fee\u6539' }) : null,
							React.createElement('button', { className: 'fdt-tab-x', title: '\u5173\u95ed', onClick: function (ev) { ev.stopPropagation(); closeTab(t.rel) } }, '\u2715'),
						)
					}),
				),
				React.createElement('div', { className: 'fdt-body' },
					contentOpen ? React.createElement('div', { className: 'fdt-view' + (viewAnimated ? '' : ' fdt-view-anim') },
						React.createElement('div', { className: 'fdt-viewbar' },
							React.createElement('span', { className: 'fdt-path', title: active || '' }, active || (rootInfo ? rootInfo.root : '')),
							gitMode ? null : React.createElement('button', { className: 'fdt-btn', title: '\u628a\u5f53\u524d\u5185\u5bb9\u8bbe\u4e3a\u57fa\u7ebf\uff0c\u7ea2\u7eff\u6807\u8bb0\u5f52\u96f6', disabled: !active, onClick: setBaselineNow }, '\ud83d\udccc \u8bbe\u57fa\u7ebf'),
							React.createElement('button', { className: 'fdt-btn', title: '\u5173\u95ed\u5185\u5bb9\u5217\uff08\u4ec5\u4fdd\u7559\u6587\u4ef6\u6811\uff09', onClick: function () { setContentOpen(false) } }, '\u2715'),
						),
						renderContent(),
					) : null,
					s.treeCollapsed ? null : React.createElement('div', { className: 'fdt-tree', onContextMenu: function (e) { e.preventDefault(); setCtxMenu({ x: e.clientX, y: e.clientY, rel: '', name: null, isDir: true }) } },
						rootInfo === null ? React.createElement('div', { className: 'fdt-hint' }, '\u52a0\u8f7d\u4e2d\u2026') :
						tree === null ? React.createElement('div', { className: 'fdt-hint' }, '\u52a0\u8f7d\u5931\u8d25\uff0c\u8bf7\u70b9\u5237\u65b0') :
						tree.length === 0 ? React.createElement('div', { className: 'fdt-hint' }, '\uff08\u5de5\u4f5c\u533a\u4e3a\u7a7a\uff09') :
						tree.map(function (e) { return React.createElement(TreeNode, { key: e.name, entry: e, depth: 0, parent: '' }) }),
					),
				),
				React.createElement('div', { className: 'fdt-footer' },
					React.createElement('span', null, rootInfo ? rootInfo.name : ''),
					React.createElement('span', null, gitMode ? 'git \u00b7 ' + (rootInfo && rootInfo.git.branch || 'HEAD') : '\u57fa\u7ebf\u6a21\u5f0f'),
					React.createElement('span', { className: 'fdt-spacer' }),
					d && d.ok && d.changed
						? React.createElement('span', null, React.createElement('span', { className: 'fdt-add' }, '+' + d.adds + ' '), React.createElement('span', { className: 'fdt-del' }, '\u2212' + d.dels))
						: null,
					changed ? React.createElement('span', null, '\u25cf \u5df2\u4fee\u6539') : null,
				),
				ctxMenuEl(),
			)
		}

		function apply(ctx) {
			const slots = ctx.get('slots')
			timer = ctx.get('timer')
			layout = ctx.get('layout')
			if (slots === undefined) return

			ctx.effect(() => {
				const tag = document.createElement('style')
				tag.textContent = CSS_TEXT
				document.head.appendChild(tag)
				return () => { tag.remove() }
			}, 'fdtree: styles')

			slots.inject('details', function () {
				return slots.register(
					{ name: 'details', priority: -1 },
					function (props) {
						const sid = props && props.sessionId !== undefined && props.sessionId !== null ? String(props.sessionId) : null
						return React.createElement(Explorer, { sid: sid })
					},
				)
			})

			slots.inject('sidebar.footer.action', function () {
				return slots.register(
					{ name: 'sidebar.footer.action', id: 'file-tree-toggle', order: 0, label: '\u6587\u4ef6\u6811' },
					function (props) {
						const s = useStore(store)
						React.useEffect(function () {
							const wide = !!(props && props.wide)
							store.update(function (st) { return Object.assign({}, st, { wide: wide }) })
						}, [props && props.wide])
						return React.createElement('button', {
							className: 'fdt-sidebar-btn' + (s.visible ? ' fdt-sidebar-btn-on' : ''),
							title: '\u6253\u5f00 / \u5173\u95ed\u6587\u4ef6\u6811\u9762\u677f',
							onClick: function () {
								store.set({ visible: !s.visible })
							},
						},
							React.createElement('span', { className: 'fdt-sidebar-icon' }, '\ud83d\uddc2'),
							s.wide ? React.createElement('span', null, '\u6587\u4ef6\u6811') : null,
						)
					},
				)
			})
		}

		const name = 'fdtree';
		const inject = ['slots', 'layout', 'timer'];
		exports.apply = apply;
		exports.inject = inject;
		exports.name = name;
		return module.exports;
	}
});
