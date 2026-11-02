const fs=require('fs'),vm=require('vm'),assert=require('assert');
const noop=()=>{},elements={};const context2d=new Proxy({},{get:()=>noop,set:()=>true});
function element(){return {style:{},children:[],append(...items){this.children.push(...items);},replaceChildren(...items){this.children=items;},addEventListener:noop,getContext:()=>context2d,showModal:noop,close:noop};}
const env={document:{getElementById:id=>elements[id]||(elements[id]=element()),createElement:element,addEventListener:noop},window:{addEventListener:noop},Image:class{constructor(){this.complete=true;this.naturalWidth=100;}},requestAnimationFrame:noop,Math};
vm.createContext(env);vm.runInContext(fs.readFileSync('lore.js','utf8')+fs.readFileSync('adventure.js','utf8'),env);
const run=code=>vm.runInContext(code,env);
function use(id,choice=0){run(`near=rooms[room].objects.find(o=>o[0]===${JSON.stringify(id)});interact();`);if(run('mode')==='dialog'){const overlay=elements.overlay;overlay.children[2+choice].onclick();}}
run('start();held.d=true;const startX=joe.x;update(.1);if(joe.x<=startX)throw Error("Movement failed");held={};');
use('next');assert.equal(run('room'),0,'badge gates assembly');
use('guard');use('pile');use('next');assert.equal(run('room'),1);
use('cabinet');assert.equal(run('!!flags.part'),false,'stock tip gates key');
use('oldtimer');use('cabinet');use('next');assert.equal(run('room'),2);
use('next');assert.equal(run('room'),2,'medical detour gates boss');
use('phone');use('date');use('next');assert.equal(run('room'),3);
use('plaque');assert.equal(run('!!flags.plaque'),false,'boss gates plaque');
use('boss');assert.equal(run('mode'),'word');run('wordGood=false;wordPress();');assert.equal(run('wordWins'),0);
run('wordGood=true;wordPress();wordPress();wordPress();');assert.equal(run('flags.boss'),true);
use('plaque');run('near=rooms[room].objects.find(o=>o[0]==="exit");interact();');assert.equal(run('quests.every(([key])=>flags[key])'),true,'full adventure completable');
run('start();flags.badge=true;worry=100;update(.01);');assert.equal(run('worry'),30);assert.equal(run('flags.badge'),true,'worry recovery preserves progress');
run('close();pause();const oldElapsed=elapsed;update(2);if(elapsed!==oldElapsed)throw Error("Pause advanced time");');
for(let i=0;i<4;i++)run(`enter(${i});draw();`);
assert(fs.existsSync('assets/joe-head.png'));assert(fs.readFileSync('index.html','utf8').includes('src="adventure.js"'));
console.log('PASS: movement, quest gates, full nine-objective adventure, word challenge, worry recovery, pause, all room draw paths and head asset.');
