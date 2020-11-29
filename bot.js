const Telegraf = require('telegraf');
const axios = require('axios');

//Insert Your Telegram bot token from BotFather
const bot = new Telegraf('1218931857:AAEFdowtm1lMg8N-nsEu--WYH-CpxUK_REk');

//Replace Your Crypto API Key (https://min-api.cryptocompare.com) or use this default
let apiKey = "89f3dea19eb949c8a94c90f84892124e3f4ff967af5dcfb12dea61daea1296e3";

bot.command('start', ctx => {
 sendStartMessage(ctx);
});

bot.action('start', ctx => {
  ctx.deleteMessage();
  sendStartMessage(ctx);
});

function sendStartMessage(ctx) { 
  let sendMessage= `WELCOME TO ***CRYPTO BOT*** WHICH GIVES YOU INFO ABOUT CRYPTO CURRENCIES 💰`;
  bot.telegram.sendMessage(ctx.chat.id, sendMessage, 
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Crypto Prices', callback_data: 'price' }
          ],
          [
            { text: 'Coin Market Cap', url: 'https://coinmarketcap.com/'}
          ],
          [
            { text: 'Bot Info', callback_data: 'info' }
          ],
        ]
      }
    }
  )
}

bot.action('price', ctx => {
  let priceMessage= `Get Price Information. Select one of the cyrpyocurrencies Below:`;
  ctx.deleteMessage();
  bot.telegram.sendMessage(ctx.chat.id, priceMessage,
  {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "BTC", callback_data: 'price-BTC' },
          { text: "ETH", callback_data: 'price-ETH' }
        ],
        [
          { text: "LINK", callback_data: 'price-LINK' },
          { text: "ONT", callback_data: 'price-ONT' }
        ],
        [
          { text: 'Back to Menu', callback_data: 'start'}
        ],
      ]
    }
  })
});

let priceActionLists = ['price-BTC', 'price-ETH', 'price-LINK', 'price-ONT'];
bot.action(priceActionLists, async ctx => {
  let symbol = ctx.match.split(`-`)[1]; //for second agrument ['price', 'symbol(BTC)']
  //console.log(symbol);

  try {
    let res = await axios.get(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${symbol}&tsyms=USD&api_key=${apiKey}`);
    let data = res.data.DISPLAY[symbol].USD;
    //console.log(data);
   let message =
    `SYMBOL: ${symbol}
     PRICE:  ${data.PRICE}
     High:   ${data.HIGHDAY}
     Low:    ${data.LOWDAY}
     Supply: ${data.SUPPLY}
     MarketCap: ${data.MKTCAP}
     `;

     ctx.deleteMessage();

     bot.telegram.sendMessage(ctx.chat.id, message, {
       reply_markup: {
         inline_keyboard: [
           [
           {text : 'Back to Menu', callback_data: 'price'}
           ]
         ]
       }
     })
  } catch(err) {
    console.log('Error Encountered');
  }
});

bot.action('info', ctx => {   
  ctx.answerCbQuery();
  bot.telegram.sendMessage(ctx.chat.id, 'Bot Info', {
    reply_markup: {
      keyboard: [
        [ 
          { text: 'Credits' },
          { text: 'API' },
        ],
        [
          { text: 'Remove Keyboard' },
        ]
      ],
      resize_keyboard: true,
      one_time_keyboard	: true 
    }
  })
})

bot.hears('Credits', ctx => {
  ctx.reply('This bot was Created By mOHITH998');
});

bot.hears('API', ctx => {
  //Official Page of Crypto-Currency
  let link = "https://www.cryptocompare.com/"
ctx.reply(`The API Courtesy is Crypto compact:\n${link}`);

})

bot.hears('Remove Keyboard', ctx => {
  bot.telegram.sendMessage(ctx.chat.id, 'Keyboard has been Removed!', 
  {
    reply_markup: {
      remove_keyboard: true
    }
  })
})

bot.launch();

