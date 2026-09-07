const endpoint = process.argv[2] || 'http://127.0.0.1:9223';
const targetUrl = process.argv[3] || 'http://127.0.0.1:8765/';
const version = await fetch(`${endpoint}/json/version`).then(r => r.json());
const socket = new WebSocket(version.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();
socket.onmessage = event => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    message.error ? reject(message.error) : resolve(message.result);
  }
};
await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
  const messageId = ++id;
  pending.set(messageId, { resolve, reject });
  socket.send(JSON.stringify({ id: messageId, method, params, ...(sessionId ? { sessionId } : {}) }));
});
const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
await send('Emulation.setDeviceMetricsOverride', { width: 360, height: 800, deviceScaleFactor: 1, mobile: true }, sessionId);
await send('Page.enable', {}, sessionId);
await send('Page.navigate', { url: targetUrl }, sessionId);
await new Promise(resolve => setTimeout(resolve, 2500));
const expression = `JSON.stringify({innerWidth,clientWidth:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth,overflowers:[...document.querySelectorAll('*')].map(el=>{const r=el.getBoundingClientRect();return {tag:el.tagName,cls:el.className,left:r.left,right:r.right,width:r.width,scrollWidth:el.scrollWidth}}).filter(x=>x.left < -0.5 || x.right > document.documentElement.clientWidth + 0.5).slice(0,30)})`;
const result = await send('Runtime.evaluate', { expression, returnByValue: true }, sessionId);
console.log(JSON.stringify(JSON.parse(result.result.value), null, 2));
await send('Target.closeTarget', { targetId });
socket.close();
