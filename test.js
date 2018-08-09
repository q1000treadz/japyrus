//TODO: delete console.log()
//TODO: tests with wrong data

const Mocha = require('Mocha');
const mocha = new Mocha();
const assert = require('chai').assert;

const japyrus = require('.');

let ScriptName =
`Scriptname AAAMPChest        extends              ObjectReference`;
let _Event =
`Event OnActivate(ObjectReference akActionRef)
   Debug.MessageBox("Hello, World!", true)
endEvent`;
let call = `Debug.MessageBox("Hello, World!")`;
mocha.run(() => {
     describe('Japyrus', () => {
         it('should be HelloTamriel', () => {
             assert.equal(japyrus.helloTamriel(), 'HelloTamriel');
         });
         it('text parser', ()=> {
            assert.deepEqual(japyrus.txt("abc").exec("abc", 0), { res: "abc", end: 3 });
         });
         it('parse Scriptname', ()=> {
            let testScriptName = ScriptName;
            let result = japyrus.parseScriptname(testScriptName);
            assert.deepEqual(result, { scriptname: 'AAAMPChest', extends: 'extends' });
         });
         it('parse arguments 1', ()=> {
            let testArguments = "ObjectReference akActionRef";
            let result = japyrus.parseArguments(testArguments);
            console.log(result);
            assert.deepEqual(result,  [ { type: 'ObjectReference', name: 'akActionRef' }]);
         });
         it('parse arguments 2', ()=> {
            let testArguments = "ObjectReference akActionRef, ObjectReference akActionRef2";
            let result = japyrus.parseArguments(testArguments);
            console.log(result);
            assert.deepEqual(result,  [ { type: 'ObjectReference', name: 'akActionRef' },  { type: 'ObjectReference', name: 'akActionRef2' } ]);
         });
         it('parse certain arguments 1', ()=> {
            let testArguments = `233, "krab", "krab2"`;
            let result = japyrus.parseCertainArguments(testArguments);
            console.log(result);
            assert.deepEqual(result,  [ '233', '"krab"', '"krab2"' ]);
         });
         it('parseCallOfFunction', ()=> {
            let testCall = call;
            let result = japyrus.parseCallOfFunction(testCall);
            console.log(result);
            assert.deepEqual(result,  { object: 'Debug',  method: 'MessageBox', args: [ '"Hello, World!"' ] });
         });
         it('parse Event', ()=> {
            let testEvent = _Event;
            let result = japyrus.parseEvent(testEvent);
            console.log(result);
            assert.deepEqual(result,  { blocktype: 'Event',  name: 'OnActivate',args: [ { type: 'ObjectReference', name: 'akActionRef' } ],body: [{ object: 'Debug',method: 'MessageBox',args: [ '"Hello, World!"', 'true' ] }]});
         });
         it('parse variable 1', ()=> {
            let testVar = `int count = 432`;
            let result = japyrus.parseVar(testVar);
            assert.deepEqual(result,  { type: 'int', name: 'count', value: '432' });
         });
         it('parse variable 2', ()=> {
            let testVar = `Float angleX`;
            let result = japyrus.parseVar(testVar);
            assert.deepEqual(result,  { type: 'float', name: 'angleX', value: undefined });
         });
         it('parse variable 3', ()=> {
            let testVar = `Float angleX = 10.5`;
            let result = japyrus.parseVar(testVar);
            assert.deepEqual(result,  { type: 'float', name: 'angleX', value: '10.5' });
         });
         it('parse variable 4', ()=> {
            let testVar = `sTRiNg _name2 = "clubnika"`;
            let result = japyrus.parseVar(testVar);
            assert.deepEqual(result,  { type: 'string', name: '_name2', value: '"clubnika"' });
         });
         it('parse wrong variable', ()=> {
            let testVar = `!type! !name!`;
            let result = japyrus.parseVar(testVar);
            assert.deepEqual(result,  undefined);
         });
         it('parse wrong data', ()=> {
            let result = japyrus.parseEvent(`Scriptname uncorrect 23 24`);
            console.log(result);
            assert.deepEqual(result, undefined);
         });
         it('get variable', ()=> {
           japyrus.varlist.push({ type: 'int', name: 'count', value: '432' });
           japyrus.varlist.push({ type: 'float', name: 'angleX', value: '10.5' });
           japyrus.varlist.push({ type: 'string', name: '_name2', value: '"clubnika"' });
           console.log(japyrus.varlist);
           let result = japyrus.varlist.getVariable('count');
           assert.deepEqual(result, { type: 'int', name: 'count', value: '432' });
         });

     });
});
