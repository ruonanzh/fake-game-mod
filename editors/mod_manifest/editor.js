/**
 * 示例编辑器 —— mod 的 `manifest.json`（Fake Game / JSON modType）。
 *
 * 只用契约里的 postMessage 桥（设计仓 desktop-gamer-agent-pi `docs/editor-tool.md` §5）：
 * 无网络、无宿主 API 之外的权限；校验镜像本 repo 的 `validate_mod`
 * （name = lower_snake_case / version = semver / description、author 非空）。
 */
const FIELDS = ["name", "version", "description", "author"];

let writable = false;
let revision = null;
/** 解析后的原始对象 —— 保留未知键，保存时原样带回去。 */
let model = {};
let dirty = false;
let seq = 0;
const pending = new Map();

const $ = (id) => document.getElementById(id);
const post = (message) => window.parent.postMessage(message, "*");

/** 发一条带 requestId 的请求，等宿主回的对应消息（fileContent / saved / error）。 */
function request(type, payload) {
  const requestId = `r${++seq}`;
  return new Promise((resolve) => {
    pending.set(requestId, resolve);
    post({ type, requestId, ...payload });
  });
}

function settle(requestId, value) {
  const resolve = pending.get(requestId);
  if (resolve) {
    pending.delete(requestId);
    resolve(value);
  }
}

/** 校验（与 validate_mod 一致），返回错误列表。 */
function validate(value) {
  const errors = [];
  if (!/^[a-z][a-z0-9_]*$/.test(value.name || "")) errors.push("name 必须是 lower_snake_case（小写字母开头）");
  if (!/^\d+\.\d+\.\d+$/.test(value.version || "")) errors.push("version 必须是 semver（x.y.z）");
  if (!String(value.description || "").trim()) errors.push("description 不能为空");
  if (!String(value.author || "").trim()) errors.push("author 不能为空");
  return errors;
}

function readForm() {
  const next = { ...model };
  for (const field of FIELDS) next[field] = $(`f-${field}`).value;
  return next;
}

function showError(message) {
  const box = $("error");
  box.hidden = !message;
  box.textContent = message;
}

function paint() {
  const errors = validate(readForm());
  const status = $("status");
  status.textContent = errors.length ? "有错误，无法保存" : dirty ? "未保存（Ctrl+S）" : "已保存";
  status.dataset.state = errors.length ? "error" : dirty ? "dirty" : "clean";
  $("save").disabled = !writable || errors.length > 0;
  if (!errors.length) showError("");
}

function setDirty(next) {
  dirty = next;
  paint();
}

function fill(value) {
  model = value && typeof value === "object" ? { ...value } : {};
  for (const field of FIELDS) {
    const current = model[field];
    $(`f-${field}`).value = current == null ? "" : String(current);
  }
  dirty = false;
  showError("");
  paint();
}

async function load() {
  const response = await request("editor:readFile", {});
  if (response.code) {
    showError(response.message || "读取失败");
    return;
  }
  revision = response.revision ?? null;
  try {
    fill(JSON.parse(response.data));
  } catch (error) {
    showError(`manifest.json 不是合法 JSON：${error.message}`);
  }
}

async function save() {
  if (!writable) return;
  if (validate(readForm()).length) {
    paint();
    return;
  }
  const next = readForm();
  const response = await request("editor:save", {
    data: `${JSON.stringify(next, null, 2)}\n`,
    baseRevision: revision ?? undefined,
  });
  if (response.code) {
    showError(
      response.code === "CONFLICT"
        ? "文件已被别处改动 —— 先「重新加载」，否则会覆盖别人的修改。"
        : response.message || "保存失败",
    );
    return;
  }
  revision = response.revision ?? revision;
  model = next;
  setDirty(false);
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme === "light" ? "light" : "dark";
}

window.addEventListener("message", (event) => {
  const data = event.data || {};
  switch (data.type) {
    case "editor:init":
      writable = data.mode === "edit" && Boolean(data.writable);
      $("file").textContent = (data.file && data.file.name) || "manifest.json";
      applyTheme(data.theme);
      post({ type: "editor:ready" });
      void load();
      break;
    case "editor:fileContent":
    case "editor:saved":
    case "editor:error":
      settle(data.requestId, data);
      break;
    case "editor:theme":
      applyTheme(data.theme);
      break;
    default:
      break;
  }
});

for (const field of FIELDS) $(`f-${field}`).addEventListener("input", () => setDirty(true));
$("reload").addEventListener("click", () => void load());
$("save").addEventListener("click", () => void save());
window.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
    event.preventDefault();
    void save();
  }
});
