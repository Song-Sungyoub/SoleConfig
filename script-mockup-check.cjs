const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const html=fs.readFileSync(__dirname+'/SCRIPT-MOCKUP.html','utf8');
const items={};function el(){return {value:'',textContent:'',disabled:false,children:[],style:{},classList:{add(){},remove(){},toggle(){return true}},setAttribute(){},append(...x){this.children.push(...x)},replaceChildren(){this.children=[]},focus(){},select(){},showModal(){},close(){}}}
for(const [,id] of html.matchAll(/id="([^"]+)"/g))items[id]=el();items.input.value='236.44.46.45';
const document={getElementById:id=>items[id],createElement:el,body:el()};const cache={};const context=vm.createContext({document,localStorage:{getItem:k=>cache[k]||null,setItem:(k,v)=>cache[k]=v},window:{confirm:()=>true},setTimeout:()=>0,clearTimeout(){},console,navigator:{}});
vm.runInContext(html.match(/<script>([\s\S]*?)<\/script>/)[1],context);
items.run.onclick();assert.equal(items.result.value,'192.0.2.1');assert.equal(items.apply.disabled,false);
items.code.value+='\n# edited';items.code.oninput();assert.equal(items.apply.disabled,true);items.run.onclick();assert.match(items.state.textContent,/실행할 수 없습니다/);
vm.runInContext("load('ip')",context);items.input.value='not an IP';items.run.onclick();assert.match(items.state.textContent,/ValueError/);assert.equal(items.apply.disabled,true);
items.input.value='236.44.46.45';items.run.onclick();items.apply.onclick();items.confirmApply.onclick();assert.equal(items.input.value,'192.0.2.1');assert.equal(items.apply.disabled,true);
vm.runInContext("load('trim')",context);items.input.value='  hello  ';items.run.onclick();assert.equal(items.result.value,'hello');
vm.runInContext("load('upper')",context);items.input.value='hello';items.run.onclick();assert.equal(items.result.value,'HELLO');
items.new.onclick();items.name.value='내 변환';items.save.onclick();assert.match(cache['soleconfig-script-mockup-v1'],/내 변환/);
items.search.value='없는 이름';items.search.oninput();assert.equal(items.scripts.children[0].textContent,'일치하는 스크립트가 없습니다.');
console.log('PASS: example conversions, invalid code/input, stale result, apply, save and search. DOM stub checks; browser layout not tested.');
