'use strict'

const { test } = require('tap')
const { BerReader, BerWriter } = require('asn1')
const { DeleteResponse } = require('../../lib')

test('new no args', function (t) {
  t.ok(new DeleteResponse())
  t.end()
})

test('new with args', function (t) {
  const res = new DeleteResponse({
    messageID: 123,
    status: 0
  })
  t.ok(res)
  t.equal(res.messageID, 123)
  t.equal(res.status, 0)
  t.end()
})

test('parse', function (t) {
  const ber = new BerWriter()
  ber.writeEnumeration(0)
  ber.writeString('cn=root')
  ber.writeString('foo')

  const res = new DeleteResponse()
  t.ok(res._parse(new BerReader(ber.buffer)))
  t.equal(res.status, 0)
  t.equal(res.matchedDN, 'cn=root')
  t.equal(res.errorMessage, 'foo')
  t.end()
})

test('toBer', function (t) {
  const res = new DeleteResponse({
    messageID: 123,
    status: 3,
    matchedDN: 'cn=root',
    errorMessage: 'foo'
  })
  t.ok(res)

  const ber = new BerReader(res.toBer())
  t.ok(ber)
  t.equal(ber.readSequence(), 0x30)
  t.equal(ber.readInt(), 123)
  t.equal(ber.readSequence(), 0x6b)
  t.equal(ber.readEnumeration(), 3)
  t.equal(ber.readString(), 'cn=root')
  t.equal(ber.readString(), 'foo')

  t.end()
})
