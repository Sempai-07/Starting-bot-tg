const { Markup } = require('telegramsjs');
const gameOptions = JSON.stringify({
    inline_keyboard: [
      [new Markup({ text: '1', action: '1' }).toJSON(), new Markup({ text: '2', action: '2' }).toJSON(), new Markup({ text: '3', action: '3' }).toJSON()],
      [new Markup({ text: '4', action: '4' }).toJSON(), new Markup({ text: '5', action: '5' }).toJSON(), new Markup({ text: '6', action: '6' }).toJSON()],
      [new Markup({ text: '7', action: '7' }).toJSON(), new Markup({ text: '8', action: '8' }).toJSON(), new Markup({ text: '9', action: '9' }).toJSON()],
      [new Markup({ text: '0', action: '0' }).toJSON()],
    ]
  })

const againOptions = JSON.stringify({inline_keyboard: [
      [new Markup({ text: 'Грати ще раз', action: '/again' }).toJSON()]
      ]})

module.exports = {
  gameOptions,
  againOptions,
  Markup,
};
