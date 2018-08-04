const Mocha = require('Mocha');
const mocha = new Mocha();
const assert = require('chai').assert;

const japyrus = require('.');

let ScriptName =
`Scriptname AAAMPChest        extends              ObjectReference`;

mocha.run(() => {
     describe('Japyrus', () => {
         it('should be HelloTamriel', () => {
             assert.equal(japyrus.helloTamriel(), 'HelloTamriel');
         });
         it('text parser', ()=> {
            assert.deepEqual(japyrus.txt("abc").exec("abc", 0), { res: "abc", end: 3 });
         });
         it('parse Scriptname', ()=> {
           //TODO: check if spaces empty
            let testScriptName = ScriptName;
            let result = japyrus.parseScriptname(testScriptName);
            assert.deepEqual(result, { scriptname: 'AAAMPChest', extends: 'extends' });
         });
     });
});
