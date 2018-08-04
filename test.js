const Mocha = require('Mocha');
const mocha = new Mocha();
const assert = require('chai').assert;

const japyrus = require('.');

mocha.run(() => {
     describe('Japyrus', () => {
         it('should be HelloTamriel', () => {
             assert.equal(japyrus.helloTamriel(), 'HelloTamriel');
         });
     });
});
