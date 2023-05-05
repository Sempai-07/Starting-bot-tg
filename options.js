const { Button } = require('telegramsjs');
const gameOptions = JSON.stringify({
    inline_keyboard: [
      [new Button({ text: '1', action: '1' }).toJSON(), new Button({ text: '2', action: '2' }).toJSON(), new Button({ text: '3', action: '3' }).toJSON()],
      [new Button({ text: '4', action: '4' }).toJSON(), new Button({ text: '5', action: '5' }).toJSON(), new Button({ text: '6', action: '6' }).toJSON()],
      [new Button({ text: '7', action: '7' }).toJSON(), new Button({ text: '8', action: '8' }).toJSON(), new Button({ text: '9', action: '9' }).toJSON()],
      [new Button({ text: '0', action: '0' }).toJSON()],
    ]
  })

const againOptions = JSON.stringify({inline_keyboard: [
      [new Button({ text: 'Играть еще раз', action: '/again' }).toJSON()]
      ]})

module.exports = {
  gameOptions,
  againOptions,
  Button,
};
