// fdtree — 工作区文件树 + 实时红绿 Diff（宿主端）
// Static DSH plugin host half. Exposes an HTTP JSON-RPC route at /fdtree/rpc
// consumed by the client bundle (browser fetch, same origin).
export const name = 'fdtree'
export const inject = ['fs', 'sandboxPolicy', 'shell', 'sessions', 'webServer']

function normAbs(p) {
  p = String(p).replace(/\\/g, '/')
  while (p.length > 3 && p.endsWith('/')) p = p.slice(0, -1)
  return p
}
function normRel(p) {
  p = String(p).replace(/\\/g, '/').replace(/^\/+/, '')
  const parts = []
  for (const seg of p.split('/')) {
    if (seg === '' || seg === '.') continue
    if (seg === '..') { parts.pop(); continue }
    parts.push(seg)
  }
  return parts.join('/')
}
function parentDir(p) {
  if (p === '') return ''
  const i = p.lastIndexOf('/')
  if (i < 0) return ''
  if (i === 0) return '/'
  const head = p.slice(0, i)
  if (head.length === 2 && head.charAt(1) === ':') return head
  return head
}
function relBetween(baseAbs, childAbs) {
  const b = normAbs(baseAbs)
  const c = normAbs(childAbs)
  if (b === c) return ''
  if (c.indexOf(b + '/') === 0) return c.slice(b.length + 1)
  return null
}
function mkErr(code, message) {
  const e = new Error(message)
  e.code = code
  return e
}
function splitLines(text) {
  return String(text).replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n')
}
function parseUnifiedDiff(text) {
  const raw = String(text).replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n')
  let startIdx = -1
  for (let i = 0; i < raw.length; i++) { if (raw[i].indexOf('@@ ') === 0) { startIdx = i; break } }
  if (startIdx === -1) return { lines: [], adds: 0, dels: 0, changed: false }
  const lines = []
  let oldNo = 0
  let newNo = 0
  let adds = 0
  let dels = 0
  for (let i = startIdx; i < raw.length; i++) {
    const line = raw[i]
    if (line.indexOf('@@ ') === 0) {
      const m = /-(\d+)(?:,\d+)? \+(\d+)(?:,\d+)?/.exec(line)
      oldNo = m ? parseInt(m[1], 10) - 1 : oldNo
      newNo = m ? parseInt(m[2], 10) - 1 : newNo
      lines.push({ t: 'hunk', text: line, a: m ? parseInt(m[1], 10) : null, b: m ? parseInt(m[2], 10) : null })
    } else if (line.charAt(0) === '+') {
      newNo++; adds++
      lines.push({ t: 'add', text: line.slice(1), a: null, b: newNo })
    } else if (line.charAt(0) === '-') {
      oldNo++; dels++
      lines.push({ t: 'del', text: line.slice(1), a: oldNo, b: null })
    } else if (line.charAt(0) === '\\') {
    } else if (line.charAt(0) === ' ') {
      oldNo++; newNo++
      lines.push({ t: 'same', text: line.slice(1), a: oldNo, b: newNo })
    }
  }
  return { lines: lines, adds: adds, dels: dels, changed: adds + dels > 0 }
}
function diffMiddle(a, b) {
  const ops = []
  if (a.length === 0) { for (const t of b) ops.push({ t: 'add', text: t }); return ops }
  if (b.length === 0) { for (const t of a) ops.push({ t: 'del', text: t }); return ops }
  if (a.length * b.length > 250000) {
    for (const t of a) ops.push({ t: 'del', text: t })
    for (const t of b) ops.push({ t: 'add', text: t })
    return ops
  }
  const n = a.length
  const m = b.length
  const dp = new Array(n + 1)
  for (let i = 0; i <= n; i++) { dp[i] = new Array(m + 1).fill(0) }
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1])
    }
  }
  let i = 0
  let j = 0
  while (i < n && j < m) {
    if (a[i] === b[j]) { ops.push({ t: 'same', text: a[i] }); i++; j++ }
    else if (dp[i + 1][j] >= dp[i][j + 1]) { ops.push({ t: 'del', text: a[i] }); i++ }
    else { ops.push({ t: 'add', text: b[j] }); j++ }
  }
  while (i < n) { ops.push({ t: 'del', text: a[i] }); i++ }
  while (j < m) { ops.push({ t: 'add', text: b[j] }); j++ }
  return ops
}
function buildDiffLines(aText, bText) {
  const a = splitLines(aText)
  const b = splitLines(bText)
  let start = 0
  while (start < a.length && start < b.length && a[start] === b[start]) start++
  let endA = a.length
  let endB = b.length
  while (endA > start && endB > start && a[endA - 1] === b[endB - 1]) { endA--; endB-- }
  const ops = []
  for (let i = 0; i < start; i++) ops.push({ t: 'same', text: a[i] })
  for (const op of diffMiddle(a.slice(start, endA), b.slice(start, endB))) ops.push(op)
  for (let i = endA; i < a.length; i++) ops.push({ t: 'same', text: a[i] })
  const lines = []
  let oldNo = 0
  let newNo = 0
  let adds = 0
  let dels = 0
  let prev = 'none'
  for (const op of ops) {
    if (op.t === 'same') {
      if (prev === 'add' || prev === 'del') lines.push({ t: 'sep', text: '' })
      oldNo++; newNo++
      lines.push({ t: 'same', text: op.text, a: oldNo, b: newNo })
      prev = 'same'
    } else if (op.t === 'add') {
      newNo++; adds++
      lines.push({ t: 'add', text: op.text, a: null, b: newNo })
      prev = 'add'
    } else {
      oldNo++; dels++
      lines.push({ t: 'del', text: op.text, a: oldNo, b: null })
      prev = 'del'
    }
  }
  return { lines: lines, adds: adds, dels: dels, changed: adds + dels > 0 }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (c) => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}
function sendJson(res, code, payload) {
  res.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' })
  res.end(JSON.stringify(payload))
}

export function apply(ctx) {
  const fs = ctx.get('fs')
  const sandboxPolicy = ctx.get('sandboxPolicy')
  const shell = ctx.get('shell')
  const sessions = ctx.get('sessions')
  const webServer = ctx.get('webServer')
  if (fs === undefined || sandboxPolicy === undefined || webServer === undefined) return

  const MAX_FILE_BYTES = 1500000
  let root = normAbs(sandboxPolicy.workspaceRoot)
  const baselines = new Map()
  const fileCache = new Map()
  let scanSummary = { scanned: 0, skipped: 0 }
  let gitInfo = null
  let gitDetected = false
  let lastGitCheck = 0
  let sessionObj = null
  let statusCache = null
  let boundSid = null
  let rootTargetPromise = undefined

  async function rootTarget() {
    if (rootTargetPromise === undefined) rootTargetPromise = fs.resolve('.', { cwd: root })
    return rootTargetPromise
  }
  async function resolveInside(rel) {
    const rt = await rootTarget()
    const target = await fs.resolve(rel === '' ? '.' : rel, { cwd: root })
    if (!fs.contains(rt, target)) throw mkErr('FS_PERMISSION_DENIED', '路径超出工作区: ' + rel)
    return target
  }

  function shq(s) {
    return "'" + String(s).replace(/'/g, "'\\''") + "'"
  }
  async function runGit(args, workdir, timeoutMs) {
    if (shell === undefined) throw mkErr('ERR', 'shell 服务不可用')
    const req = {
      command: 'git ' + args.map(shq).join(' '),
      workdir: workdir,
      timeoutMs: timeoutMs || 10000,
      stdoutMaxBytes: 8388608,
      env: { GIT_PAGER: 'cat', GIT_OPTIONAL_LOCKS: '0', GIT_TERMINAL_PROMPT: '0', LC_ALL: 'C' },
    }
    if (sessionObj !== null) {
      try { req.sandboxPolicy = sandboxPolicy.resolve({ session: sessionObj }) } catch (err) {}
    }
    const spec = shell.resolve(req)
    const res = await shell.run(spec)
    if (res.sandbox && res.sandbox.denied) throw mkErr('FS_SANDBOX_DENIED', 'git 命令被沙箱拒绝，已回退到基线模式')
    return {
      code: res.exitCode,
      out: res.stdout && res.stdout.text !== undefined ? res.stdout.text : '',
      err: res.stderr && res.stderr.text !== undefined ? res.stderr.text : '',
    }
  }
  async function detectGit() {
    let dir = normAbs(root)
    for (let depth = 0; depth < 8; depth++) {
      let info = undefined
      try { info = await fs.stat(await fs.resolve(dir + '/.git')) } catch (err) { info = undefined }
      if (info !== undefined && (info.type === 'directory' || info.type === 'file')) {
        const prefix = relBetween(dir, root)
        if (prefix !== null) return { available: true, repoRoot: dir, prefix: prefix }
        return { available: false }
      }
      const parent = parentDir(dir)
      if (parent === '' || parent === dir) break
      dir = parent
    }
    return { available: false }
  }
  async function ensureGit() {
    const now = Date.now()
    if (!gitDetected || ((gitInfo === null || !gitInfo.available) && now - lastGitCheck > 15000)) {
      gitDetected = true
      lastGitCheck = now
      try { gitInfo = await detectGit() } catch (err) { gitInfo = { available: false } }
    }
    return gitInfo
  }
  function toRepoRel(rel) {
    const prefix = relBetween(gitInfo.repoRoot, root)
    if (prefix === null) return null
    return prefix === '' ? rel : prefix + '/' + rel
  }
  function fromRepoPath(path) {
    const prefix = relBetween(gitInfo.repoRoot, root)
    if (prefix === null) return null
    const p = String(path).replace(/\\/g, '/').replace(/^\/+/, '')
    if (prefix === '') return p
    if (p === prefix) return ''
    if (p.indexOf(prefix + '/') === 0) return p.slice(prefix.length + 1)
    return null
  }
  async function gitStatusNow() {
    const info = await ensureGit()
    if (!info.available) return { entries: [], branch: null }
    let entries = []
    try {
      const res = await runGit(['status', '--porcelain', '-z', '--untracked-files=normal'], info.repoRoot)
      if (res.code === 0) {
        for (const chunk of res.out.split('\u0000')) {
          if (chunk.length < 4) continue
          const rel = fromRepoPath(chunk.slice(3))
          if (rel === null || rel === '') continue
          entries.push({ rel: rel, x: chunk.charAt(0), y: chunk.charAt(1) })
        }
      }
    } catch (err) {
      gitInfo = { available: false, error: String(err && err.message || err) }
      return { entries: [], branch: null }
    }
    let branch = null
    try {
      const br = await runGit(['branch', '--show-current'], info.repoRoot, 5000)
      if (br.code === 0 && br.out.trim() !== '') branch = br.out.trim().split('\n')[0]
    } catch (err) {}
    return { entries: entries, branch: branch }
  }
  async function gitStatusCached(force) {
    const now = Date.now()
    if (!force && statusCache && now - statusCache.at < 2000) return statusCache
    const st = await gitStatusNow()
    statusCache = { at: now, entries: st.entries, branch: st.branch }
    return statusCache
  }
  function statusOf(rel, entries) {
    for (const e of entries) {
      if (e.rel === rel) {
        const s = e.x + e.y
        if (s === '??') return 'untracked'
        if (s.charAt(0) === 'D' || s.charAt(1) === 'D') return 'deleted'
        return 'mod'
      }
    }
    return null
  }

  async function scanBaselines() {
    const queue = ['']
    const skipDirs = new Set(['.git', 'node_modules', '.DS_Store'])
    let scanned = 0
    let skipped = 0
    while (queue.length > 0 && scanned + skipped < 3000) {
      const rel = queue.shift()
      let entries = []
      try {
        const target = await resolveInside(rel)
        const info = await fs.stat(target)
        if (info === undefined || info.type !== 'directory') continue
        entries = (await fs.listDir(target)).slice(0, 2000)
      } catch (err) { continue }
      for (const e of entries) {
        const childRel = rel === '' ? e.name : rel + '/' + e.name
        if (e.type === 'directory') {
          if (!skipDirs.has(e.name)) queue.push(childRel)
        } else if (e.type === 'file') {
          if (typeof e.size === 'number' && e.size > 256000) { skipped++; continue }
          try {
            const content = await fs.readText(e.target)
            if (!baselines.has(childRel)) baselines.set(childRel, content)
            scanned++
          } catch (err) { skipped++ }
        }
      }
    }
    scanSummary = { scanned: scanned, skipped: skipped }
  }

  async function ensureSession(sid) {
    if (!sid || sessions === undefined || typeof sessions.get !== 'function') return
    const session = sessions.get(String(sid))
    if (session === undefined) return
    try {
      const policy = sandboxPolicy.resolve({ session: session })
      sessionObj = session
      const nextRoot = normAbs(policy.workspaceRoot)
      if (nextRoot !== root) {
        root = nextRoot
        rootTargetPromise = undefined
        baselines.clear()
        fileCache.clear()
        gitDetected = false
        gitInfo = null
        statusCache = null
        boundSid = null
      }
      // 基线扫描只在会话真正绑定时进行（绝不扫描未绑定时的兜底根目录）
      if (boundSid !== String(sid)) {
        boundSid = String(sid)
        scanBaselines().catch(function () { scanSummary = { scanned: 0, skipped: 0, error: true } })
      }
    } catch (err) {}
  }

  function noSession() {
    return { ok: false, code: 'NO_SESSION', error: '会话未绑定，等待工作区就绪' }
  }

  // ---- RPC handlers (same protocol as the dynamic build) ----
  const handlers = {
    setSession: async () => {
      // 会话绑定已在路由层 ensureSession(sid) 完成；这里只是让客户端握手成功
      return { ok: true, bound: sessionObj !== null }
    },
    getRoot: async () => {
      if (sessionObj === null) return noSession()
      const info = await ensureGit()
      let branch = null
      if (info.available) {
        try {
          const st = await gitStatusCached(true)
          branch = st.branch
        } catch (err) {}
      }
      return {
        ok: true,
        root: root,
        name: root.split('/').pop() || root,
        git: info.available
          ? { available: true, branch: branch || null, error: null }
          : { available: false, error: gitInfo && gitInfo.error ? String(gitInfo.error) : null },
        scan: scanSummary,
      }
    },
    listDir: async (args) => {
      if (sessionObj === null) return noSession()
      const rel = normRel(args && args.rel ? args.rel : '')
      try {
        const target = await resolveInside(rel)
        const info = await fs.stat(target)
        if (info === undefined) return { ok: false, error: '目录不存在', code: 'FS_NOT_FOUND' }
        if (info.type !== 'directory') return { ok: false, error: '不是目录', code: 'FS_NOT_DIRECTORY' }
        const list = await fs.listDir(target)
        const entries = []
        for (const e of list) {
          entries.push({
            name: e.name,
            type: e.type === 'directory' ? 'directory' : e.type === 'file' ? 'file' : 'other',
            size: typeof e.size === 'number' ? e.size : null,
          })
        }
        entries.sort(function (x, y) {
          if (x.type === 'directory' && y.type !== 'directory') return -1
          if (x.type !== 'directory' && y.type === 'directory') return 1
          const a = x.name.toLowerCase()
          const b = y.name.toLowerCase()
          return a < b ? -1 : a > b ? 1 : 0
        })
        return { ok: true, rel: rel, entries: entries.slice(0, 2000), truncated: entries.length > 2000 }
      } catch (err) {
        return { ok: false, error: String(err && err.message || err), code: err && err.code ? err.code : 'FS_IO_ERROR' }
      }
    },
    readFile: async (args) => {
      if (sessionObj === null) return noSession()
      const rel = normRel(args && args.rel ? args.rel : '')
      try {
        const target = await resolveInside(rel)
        const info = await fs.stat(target)
        if (info === undefined) { fileCache.delete(rel); return { ok: false, error: '文件不存在（可能已被删除）', code: 'FS_NOT_FOUND' } }
        if (info.type !== 'file') return { ok: false, error: '不是普通文件', code: 'FS_NOT_REGULAR_FILE' }
        if (typeof info.size === 'number' && info.size > MAX_FILE_BYTES) return { ok: false, error: '文件过大（>1.5MB）', code: 'FS_TOO_LARGE' }
        let content
        const cached = fileCache.get(rel)
        if (cached && cached.version === info.version && cached.size === info.size) {
          content = cached.content
        } else {
          content = await fs.readText(target)
          if (fileCache.size > 200) fileCache.clear()
          fileCache.set(rel, { version: info.version, size: info.size, content: content })
        }
        const git = await ensureGit()
        if (git.available) {
          const st = await gitStatusCached(false)
          const s = statusOf(rel, st.entries)
          return { ok: true, content: content, changed: s !== null, status: s }
        }
        let baseline = baselines.get(rel)
        if (baseline === undefined) {
          baseline = content
          baselines.set(rel, content)
        }
        return { ok: true, content: content, changed: baseline !== content, status: null }
      } catch (err) {
        return { ok: false, error: String(err && err.message || err), code: err && err.code ? err.code : 'FS_IO_ERROR' }
      }
    },
    setBaseline: async (args) => {
      if (sessionObj === null) return noSession()
      const rel = normRel(args && args.rel ? args.rel : '')
      try {
        const content = await fs.readText(await resolveInside(rel))
        baselines.set(rel, content)
        return { ok: true }
      } catch (err) {
        return { ok: false, error: String(err && err.message || err), code: err && err.code ? err.code : 'FS_IO_ERROR' }
      }
    },
    gitStatus: async () => {
      if (sessionObj === null) return noSession()
      try {
        const info = await ensureGit()
        if (!info.available) return { ok: true, git: false, entries: [], branch: null }
        const st = await gitStatusCached(false)
        const entries = []
        for (const e of st.entries) entries.push({ rel: e.rel, x: e.x, y: e.y })
        return { ok: true, git: true, entries: entries, branch: st.branch }
      } catch (err) {
        return { ok: false, error: String(err && err.message || err) }
      }
    },
    getDiff: async (args) => {
      if (sessionObj === null) return noSession()
      const rel = normRel(args && args.rel ? args.rel : '')
      try {
        const git = await ensureGit()
        if (git.available) {
          const st = await gitStatusCached(false)
          const s = statusOf(rel, st.entries)
          const repoRel = toRepoRel(rel)
          if (repoRel === null) return { ok: false, error: '工作区不在 git 仓库内' }
          if (s === 'untracked') {
            const content = await fs.readText(await resolveInside(rel))
            const ls = splitLines(content)
            const lines = []
            for (let i = 0; i < ls.length; i++) lines.push({ t: 'add', text: ls[i], a: null, b: i + 1 })
            return { ok: true, git: true, changed: true, status: s, lines: lines, adds: ls.length, dels: 0, binary: false }
          }
          const res = await runGit(['--no-pager', 'diff', '--no-color', '--no-ext-diff', '--unified=999999', 'HEAD', '--', repoRel], gitInfo.repoRoot)
          if (res.code !== 0) return { ok: false, error: 'git diff 执行失败', code: 'GIT_ERR', detail: res.err }
          const trimmed = res.out.trim()
          if (trimmed === '') return { ok: true, git: true, changed: false, status: s, lines: [], adds: 0, dels: 0, binary: false }
          if (trimmed.indexOf('Binary files ') === 0) return { ok: true, git: true, changed: true, status: s, lines: [], adds: 0, dels: 0, binary: true }
          const parsed = parseUnifiedDiff(res.out)
          return { ok: true, git: true, changed: parsed.changed, status: s, lines: parsed.lines, adds: parsed.adds, dels: parsed.dels, binary: false }
        }
        const content = await fs.readText(await resolveInside(rel))
        let baseline = baselines.get(rel)
        if (baseline === undefined) {
          baseline = content
          baselines.set(rel, content)
        }
        const d = buildDiffLines(baseline, content)
        return { ok: true, git: false, changed: d.changed, lines: d.lines, adds: d.adds, dels: d.dels, binary: false }
      } catch (err) {
        return { ok: false, error: String(err && err.message || err), code: err && err.code ? err.code : 'FS_IO_ERROR' }
      }
    },
    openTerminal: async (args) => {
      if (sessionObj === null) return noSession()
      const rel = normRel(args && args.rel ? args.rel : '')
      let abs
      try {
        const resolved = await resolveInside(rel)
        // fs.resolve 返回 {targetKey, displayPath} 对象，取真实路径字符串
        abs = typeof resolved === 'string' ? resolved : (resolved.targetKey || resolved.displayPath || String(resolved))
      } catch (err) {
        return { ok: false, error: String(err && err.message || err), code: err && err.code ? err.code : 'FS_IO_ERROR' }
      }
      try {
        const { spawn } = await import('node:child_process')
        const plat = process.platform
        const tries = []
        if (plat === 'win32') {
          // 直接 spawn powershell/cmd 在本环境会瞬间退出；必须经 cmd /c start（ShellExecute）创建可见窗口
          tries.push(
            { name: 'PowerShell', run: () => spawn('cmd.exe', ['/c', 'start', '', 'powershell', '-NoExit', '-Command', "Set-Location -LiteralPath '" + abs + "'"], { detached: true, stdio: 'ignore' }) },
            { name: 'cmd', run: () => spawn('cmd.exe', ['/c', 'start', '', 'cmd', '/k', 'cd /d "' + abs + '"'], { detached: true, stdio: 'ignore' }) },
          )
        } else if (plat === 'darwin') {
          tries.push({ name: 'Terminal.app', run: () => spawn('open', ['-a', 'Terminal', abs], { detached: true, stdio: 'ignore' }) })
        } else {
          if (!process.env.DISPLAY && !process.env.WAYLAND_DISPLAY) {
            return { ok: false, error: '服务器无图形环境（DISPLAY 未设置），无法打开终端', code: 'NO_DISPLAY' }
          }
          tries.push(
            { name: 'gnome-terminal', run: () => spawn('gnome-terminal', ['--working-directory', abs], { detached: true, stdio: 'ignore' }) },
            { name: 'konsole', run: () => spawn('konsole', ['--workdir', abs], { detached: true, stdio: 'ignore' }) },
            { name: 'xfce4-terminal', run: () => spawn('xfce4-terminal', ['--working-directory', abs], { detached: true, stdio: 'ignore' }) },
            { name: 'x-terminal-emulator', run: () => spawn('x-terminal-emulator', ['-e', 'bash', '-lc', 'cd "' + abs + '" && exec bash'], { detached: true, stdio: 'ignore' }) },
            { name: 'xterm', run: () => spawn('xterm', ['-e', 'bash', '-lc', 'cd "' + abs + '" && exec bash'], { detached: true, stdio: 'ignore' }) },
          )
        }
        for (const t of tries) {
          const ok = await new Promise((resolve) => {
            let settled = false
            let child
            try { child = t.run() } catch (err) { resolve(false); return }
            child.once('error', function () { if (!settled) { settled = true; resolve(false) } })
            child.once('spawn', function () { if (!settled) { settled = true; resolve(true) } })
            setTimeout(function () { if (!settled) { settled = true; resolve(false) } }, 2000)
          })
          if (ok) return { ok: true, terminal: t.name, cwd: abs }
        }
        return { ok: false, error: '未找到可用的终端程序', code: 'NO_TERMINAL' }
      } catch (err) {
        return { ok: false, error: String(err && err.message || err), code: 'TERMINAL_ERR' }
      }
    },
  }

  ctx.effect(() => webServer.register({
    kind: 'prefix',
    path: '/fdtree',
    handler: async (req, res) => {
      try {
        const url = new URL(req.url || '/', 'http://localhost')
        if (req.method === 'GET' && url.pathname === '/fdtree/health') {
          sendJson(res, 200, { ok: true, name: 'fdtree' })
          return
        }
        if (req.method !== 'POST' || url.pathname !== '/fdtree/rpc') {
          sendJson(res, 404, { ok: false, error: 'not found' })
          return
        }
        let body
        try {
          body = JSON.parse(await readBody(req) || '{}')
        } catch (err) {
          sendJson(res, 400, { ok: false, error: 'bad json' })
          return
        }
        const method = body && typeof body.method === 'string' ? body.method : ''
        const args = body && body.args !== undefined ? body.args : {}
        const sid = body && typeof body.sid === 'string' ? body.sid : ''
        await ensureSession(sid)
        const handler = handlers[method]
        if (handler === undefined) {
          sendJson(res, 404, { ok: false, error: 'unknown method: ' + method })
          return
        }
        const data = await handler(args)
        sendJson(res, 200, { ok: true, data: data })
      } catch (err) {
        sendJson(res, 500, { ok: false, error: String(err && err.message || err) })
      }
    },
  }), 'fdtree: http rpc route')
}
