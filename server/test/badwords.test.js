const expect = require('chai').expect
// const Filter = require('../src/badwords')
// const filter = new Filter({ regex: /\*|\.|$/gi })
const filter = require('../src/badwords/leo-profanity')

describe('badwords.js', () => {
  describe('clean', () => {
    it('should replace a bad word within a sentence asterisks (*)', () => {
      expect(filter.clean('ควย Kuy หี Hee แตด เสี่ยโอ')).to.eq(
        '*** *** ** *** *** *******',
      )
    })
  })
})
