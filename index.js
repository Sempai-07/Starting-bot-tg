const { TelegramBot }= require('telegramsjs');
const {gameOptions, againOptions} = require('./options');
const { CreateStorage } = require('database-sempai');

const token = ''

const bot = new TelegramBot(token);
const db = new CreateStorage({
  path: "database",
  table: ["chatId"]
})

const chats = {};

const startGame = async (chatId, messageId) => {
    await bot.sendMessage({
      chatId: chatId,
      text: `Сейчас я загадаю цифру от 0 до 9, а ты должен ее угадать!`
    });
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage({
      chatId: chatId,
      text: 'Отгадывай',
      replyMarkup: gameOptions
    });
}

const start = async () => {

    bot.setMyCommands({
      commands: JSON.stringify([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Получить информацию о пользователе'},
        {command: '/game', description: 'Игра угадай цифру'}
      ])
    })

    bot.on('privateMessageCreate', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        const message_Id = msg.message_id;
        try {
            if (text === '/start') {
                await db.has('chatId', chatId) ? db.set('chatId', chatId, chatId) : undefined;
                await bot.sendSticker({
                  chatId: chatId,
                  sticker: 'https://tlgrm.ru/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/7.webp'
                })
                return msg.reply(`Добро пожаловать в телеграм бота`);
            }
            if (text === '/info') {
                const loss = db.get('chatId', `${chatId}_loss`) ?? 0;
                const win = db.get('chatId', `${chatId}_win`) ?? 0;
                return msg.reply(`Тебя зовут ${msg.from?.username ?? msg.from.first_name}, в игре у тебя правильных ответов ${win}, неправильных ${loss}`);
            }
            if (text === '/game') {
                return startGame(chatId);
            }
            return msg.reply('Я тебя не понимаю, попробуй еще раз!)');
        } catch (e) {
            return msg.reply('Произошла какая то ошибочка!)');
        }

    })

    bot.on('interactionCreate', async msg => {
      msg.deferUpdate();
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);
        }
        const loss = await db.get('chatId', `${chatId}_loss`) ?? 0;
       const win = await db.get('chatId', `${chatId}_win`) ?? 0;
        if (data == chats[chatId]) {
            await db.set('chatId', `${chatId}_win`, win + 1)
            await msg.update(`Поздравляю, ты отгадал цифру ${chats[chatId]}`, {
              replyMarkup: againOptions
            });
        } else {
            await db.set('chatId', `${chatId}_loss`, loss + 1)
            await msg.update(`К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`, {
              replyMarkup: againOptions
            });
        }
    })
    await bot.login();
}

start()
