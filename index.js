const { TelegramBot }= require('telegramsjs');
const { gameOptions, againOptions } = require('./options');
const { CreateStorage } = require('database-sempai');
const test = require('telegramsjs');

const bot = new TelegramBot('');

const db = new CreateStorage({
  path: 'database',
  table: ['chatId']
});

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage({
      chatId: chatId,
      text: `Зараз я загадаю число від 0 до 9, а ти мусиш її вгадати!`
    });
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    console.log(chats);
    await bot.sendMessage({
      chatId: chatId,
      text: 'Вгадай загадане число',
      replyMarkup: gameOptions
    });
}

bot.on('ready', (client) => {
  client.setCommands({
    commands: JSON.stringify([
      {command: '/start', description: 'Початкове привітання'},
      {command: '/info', description: 'Отримати інформацію про користувача'},
      {command: '/game', description: 'Гра вгадай число'}
      ])
  })
  console.log(`Бот запустився @${client.username}`);
})

bot.on('message', async msg => {
  const text = msg.text;
  const chatId = msg.chat.id;
  const message_Id = msg.message_id;
  const username = msg.from.username ? `@${msg.from.username}` : msg.from.first_name;
  try {
    if (text === '/start') {
      await db.has('chatId', chatId) ? db.set('chatId', chatId, chatId) : undefined;
      await bot.sendSticker({
        chatId: chatId,
        sticker: 'https://tlgrm.ru/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/7.webp'
      })
      return await msg.reply(`
Ласкаво просимо до нашого телеграм-бота для гри у вгадування чисел! 🤖🎮

Тут ви зможете насолоджуватися захопливою грою, де ваше завдання - вгадати число від 0 до 9. Удачі! 🤞 `);
    }
    if (text === '/info') {
      const loss = db.get('chatId', `${chatId}_loss`) ?? 0;
      const win = db.get('chatId', `${chatId}_win`) ?? 0;
      return msg.reply(`Тебе звати ${username}, у грі у тебе правильних відповідей ${win}, неправильних ${loss}`);
    }
    if (text === '/game') {
      return startGame(chatId);
    }
    return msg.reply('Я тебе не розумію, спробуй ще раз!');
  } catch (e) {
    return msg.reply('Відбулася якась помилка!)');
  }
})

bot.on('callback_query', async msg => {
  console.log(msg);
  msg.deferUpdate();
  const data = msg.data;
  const chatId = msg.from.id;
  const username = msg.from?.username ? `@${msg.from.username}` : msg.from.first_name;
  if (data === '/again') {
    return startGame(chatId);
  }
  const loss = await db.get('chatId', `${chatId}_loss`) ?? 0;
  const win = await db.get('chatId', `${chatId}_win`) ?? 0;
  if (chats[chatId] == undefined) {
      msg.reply(`${username}, ви закінчили попередню гру, тому почніть нову`);
      setTimeout(async function() {
        await msg.deleted({});
      }, 1000);
      return;
    }
  if (data == chats[chatId]) {
    await db.set('chatId', `${chatId}_win`, win + 1)
    await msg.update(`Вітаю, ти відгадав число ${chats[chatId]}`, {
      replyMarkup: againOptions
    });
  } else {
    await db.set('chatId', `${chatId}_loss`, loss + 1);
    await msg.update(`На жаль, ти не вгадав, бот загадав число ${chats[chatId]}`, {
      replyMarkup: againOptions
    });
    await delete chats[chatId];
  }
});

bot.login();