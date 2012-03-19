YUI.add('lib-cipherserializable-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'SerializableCipher',

        setUp: function () {
            this.data = {
                message: C.lib.WordArray.create([0x00010203, 0x04050607, 0x08090a0b, 0x0c0d0e0f]),
                key: C.lib.WordArray.create([0x10111213, 0x14151617, 0x18191a1b, 0x1c1d1e1f]),
                iv: C.lib.WordArray.create([0x20212223, 0x24252627, 0x28292a2b, 0x2c2d2e2f])
            };
        },

        testEncrypt: function () {
            // Compute expected
            var aes = C.algo.AES.createEncryptor(this.data.key, { iv: this.data.iv });
            var ciphertext = aes.finalize(this.data.message);
            var expected = C.lib.Cipher.Params.create({
                ciphertext: ciphertext,
                key: this.data.key,
                iv: aes.cfg.iv,
                algorithm: C.algo.AES,
                mode: aes.cfg.mode,
                padding: aes.cfg.padding,
                blockSize: aes.blockSize,
                formatter: C.format.OpenSSL
            });

            // Compute actual
            var actual = C.lib.Cipher.Serializable.encrypt(C.algo.AES, this.data.message, this.data.key, { iv: this.data.iv });

            // Test
            Y.Assert.areEqual(expected.toString(), actual);
            Y.Assert.areEqual(expected.ciphertext.toString(), actual.ciphertext);
            Y.Assert.areEqual(expected.key.toString(), actual.key);
            Y.Assert.areEqual(expected.iv.toString(), actual.iv);
            Y.Assert.areEqual(expected.algorithm.toString(), actual.algorithm);
            Y.Assert.areEqual(expected.mode.toString(), actual.mode);
            Y.Assert.areEqual(expected.padding.toString(), actual.padding);
            Y.Assert.areEqual(expected.blockSize.toString(), actual.blockSize);
        },

        testDecrypt: function () {
            var encrypted = C.lib.Cipher.Serializable.encrypt(C.algo.AES, this.data.message, this.data.key, { iv: this.data.iv }) + '';
            var decrypted = C.lib.Cipher.Serializable.decrypt(C.algo.AES, encrypted, this.data.key, { iv: this.data.iv });

            Y.Assert.areEqual(this.data.message.toString(), decrypted);
        }
    }));
}, '$Rev$');
