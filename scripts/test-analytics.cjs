const fs = require('fs'), vm = require('vm'), assert = require('assert');
const source = fs.readFileSync('js/analytics.js','utf8');
function setup(saved) {
  const storage = new Map(saved ? [['gamehub:analytics-consent', saved]] : []), handlers = {}, nodes = [];
  const createElement = tag => ({tag, dataset:{}, setAttribute(){}, addEventListener(name,cb){this[name]=cb}, appendChild(n){nodes.push(n)}, set innerHTML(v){this.html=v}, get innerHTML(){return this.html}});
  const document = {head:{appendChild(n){nodes.push(n)}},body:{append(...n){nodes.push(...n)}},createElement,addEventListener(n,cb){handlers[n]=cb},cookie:'',title:'Test'};
  const localStorage = {getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)};
  const location = {pathname:'/games/snake.html',origin:'https://gamehubjogos.com.br',hostname:'gamehubjogos.com.br',protocol:'https:',reload(){this.reloaded=true}};
  const context = {document,localStorage,location,navigator:{},URLSearchParams,Date,Set,console}; context.window=context;
  vm.runInNewContext(source,context); return {context,nodes,storage,handlers, panel:nodes.find(n=>n.className==='gh-privacy-panel')};
}
let a=setup(); assert(!a.nodes.some(n=>n.tag==='script')); a.context.gamehubTrack('game_start'); assert(!a.context.dataLayer);
const choose=(test,choice)=>test.panel.click({target:{closest:()=>({dataset:{choice}})}});
choose(a,'denied'); assert(!a.nodes.some(n=>n.tag==='script')); assert.equal(a.storage.get('gamehub:analytics-consent'),'denied');
choose(a,'accepted'); assert(a.nodes.some(n=>n.tag==='script'&&n.src.includes('G-LNXXZDQ333'))); assert.equal(a.storage.get('gamehub:analytics-consent'),'accepted');
a.context.gamehubTrack('search_game',{query:'email@example.com',hasQuery:true}); const event=Array.from(a.context.dataLayer).find(x=>x[0]==='event'&&x[1]==='search_game'); assert(event); assert(!JSON.stringify(event).includes('email@example.com'));
choose(a,'denied'); assert(a.context.location.reloaded); assert.equal(a.storage.get('gamehub:analytics-consent'),'denied');
let b=setup('denied'); assert(!b.nodes.some(n=>n.tag==='script')); let c=setup('accepted'); assert(c.nodes.some(n=>n.tag==='script')); console.log('Consentimento, revogação e filtragem de eventos: OK');
