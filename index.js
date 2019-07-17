/*


HPHPHPHPHPHPHPHPHPHPHPHPHPHHPHPH

HP    H      H    P P P       HP
HP    H      H    P     P     HP
HP    H      H    P      P    HP
HP    H      H    P     P     HP
HP    HHHHHHHH    P P P       HP
HP    H      H    P           HP
HP    H      H    P           HP
HP    H      H    P           HP
HP    H      H    P           HP
HP                            HP
	 HAPPY CASH 2019 v 2.7
HPHPHPHPHPHPHPHPHPHPHPHPHPHHPHPH


PRODUCT: HAPPYCASH
TYPE: TELEGRAM_BOT
TG_USER: @happycash_bot

DEV | @jesusgvn - Edward Shumkov

OWNER-ID - 239823355 | @jesusgvn 

*/
const TelegramBot = require('node-telegram-bot-api');

const express     = require('express');
const mysql       = require('mysql');
const os          = require('os');
const fs          = require('fs');
var   md5         = require('js-md5');

var cfg  = require('./cfg.json');

const token = cfg.TELEGRAM.token; // Токен Бота
const bot = new TelegramBot(token, {polling: true, parse_mode: 'Markdown'}); // Подключаем Бота
const app = express();

const BOT_USER_NAME = 'happycash_bot';
var MSG_TO_ALL = '';
var CUT_GAMES_BOOL = false;
var COMP_COUNT_CLEAR = false;
var COMP_REPL_TIMER = false;

var date = new Date();
var now;

var a_ID   = cfg.admins.a_1;
var a_ID_2 = cfg.admins.a_2;
var a_ID_3 = cfg.admins.a_3;


var PRODUCT_START_TEXT = 
`

HPHPHPHPHPHPHPHPHPHPHPHPHPHHPHPH

HP    H      H    P P P       HP
HP    H      H    P     P     HP
HP    H      H    P      P    HP
HP    H      H    P     P     HP
HP    HHHHHHHH    P P P       HP
HP    H      H    P           HP
HP    H      H    P           HP
HP    H      H    P           HP
HP    H      H    P           HP
HP                            HP
     HAPPY CASH 2019 v 2.5
HPHPHPHPHPHPHPHPHPHPHPHPHPHHPHPH


PRODUCT: HAPPYCASH
TYPE: TELEGRAM_BOT
TG_USER: @happycash_bot

DEV | @jesusgvn - Edward Shumkov

`;


setInterval(function(){
  date = new Date();
  now  = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();   // Узнаем текущую дату.
},1000);


setInterval(function(){
  var today = date.getDay();

  if(today == 1 && COMP_COUNT_CLEAR == true){ // 1 = Понедельник
    COMP_COUNT_CLEAR = false;

    // connection.query('SELECT * FROM users WHERE COMP > 0', function(err,res){
    //   if(err) throw err;
    //   else{
    //     if(res.length > 0){
    //       for(var i = 0; i <= res.length - 1; i++){
    //         connection.query('UPDATE users SET ? WHERE TG_ID = ?', [{COMP: 0}, res[i].TG_ID], function(err,res){
    //           if(err) throw err;
    //         });
    //       }
    //     }
    //   }
    // });
    connection.query('DELETE FROM comp_repl', function(err,res){ // Каждый понедельник удаляем все записи
    	if(err) throw err;
    });
  }
  


  if(date.getHours() == 0 && COMP_REPL_TIMER == true)
  {
  	connection.query('SELECT * FROM comp_repl', function(err,res){
  		if(err) throw err;
  		else{
  			if(res.length > 0){
  				var sort = dynamicSort(res,'SUM');
  				var percent = 5; // максимальный процент

  				if(sort){
  					for(var i = 0; i <= sort.length - 1; i++){
  						if(i <= 9){
  							giveEverydayCompBonus(sort[i],percent); // Вызываем функцию выдачи Бонуса, 
  						}											// обходим асинхронность

  						percent = percent - 0.5;
  					}
  				}
  			}
  		}
  	});

  	COMP_REPL_TIMER = false;
  }

  if(date.getHours() != 0) COMP_REPL_TIMER = true;

  if(today != 1) COMP_COUNT_CLEAR = true;

},1000);


var CRASH_TIMER = 35000;
var CRASH_TIMEOUT = 3500;

setInterval(function() {
  CUT_GAMES_BOOL = !CUT_GAMES_BOOL;
  setTimeout(function(){
    CUT_GAMES_BOOL = !CUT_GAMES_BOOL;
  },CRASH_TIMEOUT);

      if(CRASH_TIMER == 35000){      // 1 Этап
        CRASH_TIMER = 45000;
        CRASH_TIMEOUT = 3200;
      }
      else if(CRASH_TIMER == 45000){ // 2 Этап
        CRASH_TIMER = 55000;
        CRASH_TIMEOUT = 4200;
      }
      else if(CRASH_TIMER == 55000){ // 3 Этап
        CRASH_TIMER = 65000;
        CRASH_TIMEOUT = 5500;
      }
      else if(CRASH_TIMER == 65000){ // 4 Этап
        CRASH_TIMER = 75000;
        CRASH_TIMEOUT = 6000;
      }
      else if(CRASH_TIMER == 75000){ // 5 Этап
        CRASH_TIMER = 35000;
        CRASH_TIMEOUT = 5000;
      }
}, CRASH_TIMER);


class User{
  setMode(mode, msg){
    var id = msg.id;
    if(msg){
      connection.query('UPDATE users SET ? WHERE TG_ID = ?', [{MODE: mode, USER_NAME: msg.username, USER_FIRST_NAME: msg.first_name}, Number(msg.id)], function(err,res){
        if(err) throw err;
        else{
        }
      });
    }
  }

  getMode(mode, msg){
    var id = msg.id;
    if(msg){
      connection.query('SELECT * FROM users WHERE TG_ID = ?',Number(id),function(err,res){
        if(err) throw err;
        else{
          if(res.length > 0){
            console.log(res[0].MODE);
            return res[0].MODE;
          }
        }
      });
    }
  }

}


var SESSION = new User(); // Создаем Объект Пользовательских Сессий


//Создаем подключение к Базе Данных

  var connection;

  function handleDisconnect() {

    connection = mysql.createConnection(cfg.DATA_BASE); // Пересоздание соединения
                                                    // так как прошлое соединение использовать невозможно
    connection.connect(function(err) {              // Сервер либо не работает
      if(err) {                                     // либо перезагружается(может занять некоторое время)
        // console.log('\x1b[41m \x1b[30mОшибка при подключении к Базе Данных: \x1b[0m',err);

        setTimeout(handleDisconnect, 2000); // Мы делаем небольшую задержку перед попыткой переподключения
      }                                     // чтобы избежать перемешанной петли и чтобы наш скрипт обрабатывал
    });                                     // Асинхронные запросы
    connection.on('error', function(err) {
      // console.log('\x1b[41m \x1b[37mОшибка Базы Данных: \x1b[33m ПРЕВЫШЕННО ВРЕМЯ ПРОСТОЯ\x1b[0m');

      if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Cоединение с сервером MySQL обычно
        handleDisconnect();                         // теряется из-за перезапуска или из-за
      } else {                                      // тайм-аута простоя соединения
        throw err;                                  // (переменная сервера wait_timeout настраивает это).
      }
    });
  }

  handleDisconnect();


  // Проврка Проццесов
for(var i = 0; i <= 10; i++){
  switch(i){
    case 0:
      if(bot){
      	console.log(PRODUCT_START_TEXT);
        statusLog('Бот создан:', 'ДА', '\x1b[32m');
      }else{
        statusLog('Бот создан:', 'НЕТ', '\x1b[31m');
      }
      break;
    case 1:
      if(connection){
        statusLog('Подключение к Базе Данных:', 'ПОДКЛЮЧЕНО', '\x1b[32m');
        break;
      }else{
        statusLog('Подключение к Базе Данных:', 'НЕ УДАЛОСЬ УСТАНОВИТЬ СВЯЗЬ', '\x1b[31m');
      }
    case 2:
      statusLog('Инициализация Бота прошла:', 'УСПЕШНО', '\x1b[32m');
      break;
  }
}


////////// Обработчики Событий в Telegram

bot.onText(/\/start (.+)/, (msg, match) => {
  if(msg.from.username == null || msg.from.username.length == 0 || msg.from.username == 'undefined'){
    bot.sendMessage(msg.from.id, '<b>❌Чтобы продолжить Установите UserName в настройках Аккаунта</b>', {parse_mode: 'html'});
    console.log('ID: ' + msg.from.id + ' U_NAME: ' + msg.from.username + ' text:' + msg.text);
  }else{
    regUser(msg);
  }
});


bot.onText(/\/setbalance (.+)/, (msg, match) =>{ // ИЗМЕНЯЕТ БАЛАНС | РАБОТАЕТ ТОЛЬКО У АДМИНА
  if(msg.from.id == 239823355 || msg.from.id == 336765139){
    var mtc = Number(match[1]);
    if(!isNaN(mtc)){     
      connection.query('UPDATE users SET ? WHERE TG_ID = ?', [{USER_BALANCE: Number(match[1])}, msg.chat.id], function(err, res){
          if(err) throw err;
          else{
            bot.sendMessage(msg.chat.id, 'Ваш Баланс изменен на: ' + match[1] + ' руб.');
          }
      });
    }
  }
});


bot.onText(/\/search (.+)/, (msg, match) =>{ 
  if(msg.from.id == 239823355 || msg.from.id == 336765139){
    connection.query('SELECT * FROM users WHERE USER_NAME = ? or TG_ID = ?', [match[1], match[1]], function(err,res){
      if(err) throw err;
      else{
        if(res.length > 0){
          bot.sendMessage(msg.from.id,`
🔸<b>ID в Системе:</b> `+ res[0].ID+ `
🔹<b>ID в TG:</b> `+ res[0].TG_ID +`
🙍🏻‍♂️<b>UserName:</b> @`+res[0].USER_NAME+`
💰<b>Баланс:</b> `+ res[0].USER_BALANCE+`

💲<b>Сумма по умолчанию:</b> `+res[0].USER_DEFAULT_SUM+`
✖️<b>Шанс Выигрыша по умолчанию:</b> `+res[0].USER_DEFAULT_CHANCE+`

💳<b>Сумма пополнений:</b> ` + res[0].USER_TOTAL_RECHARGE + `
💁🏻‍♂️<b>Реферал:</b> `+ res[0].USER_REF +`
❌<b>БАН: </b> `+ res[0].IS_BAN + `

            `, {parse_mode: 'html', reply_markup:{
	            	inline_keyboard: [
	            		[{text: '🚫Забанить пользователя', callback_data: 'BAN_USER-'+res[0].TG_ID}],
	            		[{text: '✅Разблокировать пользователя', callback_data: 'UNBAN_USER-'+res[0].TG_ID}]
	            	]
            	}
            });
        }
        else{
          bot.answerCallbackQuery(msg.from.id,'Ничего не найдено');
        }
      }
    });
  }
});


bot.on('callback_query', function(msg){

  if(msg.from.username == null || msg.from.username.length == 0 || msg.from.username == 'undefined'){
    bot.sendMessage(msg.from.id, '<b>❌Чтобы продолжить Установите UserName в настройках Аккаунта</b>', {parse_mode: 'html'});
    console.log('ID: ' + msg.from.id + ' U_NAME: ' + msg.from.username + ' text:' + msg.text);
  }else{
      console.log('ID: ' + msg.from.id + ' U_NAME: ' + msg.from.username + ' text:' + msg.data);
      connection.query('SELECT * FROM users WHERE TG_ID = ?',msg.from.id,function(err,res){
        if(err) throw err;
        else{
          if(res.length > 0){
          if(res[0].IS_BAN == 'true'){
            bot.sendMessage(msg.from.id,
`<b>⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
Вы не можете пользоваться Ботом, так как ваш аккаунт Заблокирован Администрацией Проекта
⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
      </b>`, {parse_mode: 'html'});
          }else{

        var QUERY   = msg.data;
            QUERY   = QUERY.split('-');

        connection.query('SELECT * FROM users WHERE TG_ID = ?', Number(msg.message.chat.id), function(err,res){
          if(err) throw err;
          else{
            if(res.length > 0){
                var MODE = res[0].MODE;
		        if(QUERY[0] == "Игровое Меню"){
		          SESSION.setMode('PLAY_MODE',  msg.message.chat);
		          bot.sendMessage(msg.message.chat.id, '<b>🕹Игровое Меню</b>', {
		            "reply_markup": {
		              "keyboard": [["❇️Последние 10 Игр"],["📉Изменить Ставку","📈Изменить Шанс Выигрыша"],["💰Баланс", "❔Как играть"],["Меню"]]
		            },
		            "parse_mode": 'html'
		          });
		        }

		        else if(msg.data == 'Больше' || msg.data == 'Меньше'){
		          SESSION.setMode('PLAY_MODE', msg.message.chat);
		          connection.query('SELECT * FROM users WHERE TG_ID = ?', Number(msg.message.chat.id), function(error,result,field){
		            if(result != undefined || result != null || result != [] || result.length != 0){
		              if(Number(result[0].USER_BALANCE) < Number(result[0].USER_DEFAULT_SUM) || result[0].USER_BALANCE == 0){
		                // bot.sendMessage(msg.message.chat.id,'Недостаточно Средств');
		                bot.answerCallbackQuery(msg.id,'Недостаточно Средств', true); // Показывает Уведомление,                                                                          
		              }else{
		                if('PLAY_MODE' == MODE) Play(msg,result);
		              }
		            }
		          });
		        }

		        else if(QUERY[0] == 'CONC_SUCCES'){
		          connection.query('UPDATE conclusion SET ? WHERE ID = ?', [{SUCCESS: 1}, Number(QUERY[1])], function(err,res){
		            if(err) throw err;
		            else{
		              console.log(res);
		              connection.query('SELECT * FROM conclusion WHERE ID = ?', Number(QUERY[1]), function(err,res){
		                if(err) throw err;
		                else{
		                  if(res.length > 0){
		                    bot.sendMessage(Number(res[0].USER_ID),
		`✅<b>Ваша заявка на Вывод средств Успешно Обработана

		🔶Деньги переведены на ваш Кошелек</b>`,
		                       {parse_mode: 'html'});
		                    bot.editMessageText('✅<b>Вывод успешно совершен</b>',
		                    {
		                      chat_id: msg.message.chat.id, message_id: msg.message.message_id, parse_mode: "html"
		                    });
		                  }
		                }
		              });
		            }
		          });
		        }

		        else if(QUERY[0] == 'BAN_USER'){
		        	if(!isNaN(QUERY[1])){     		
			          connection.query('UPDATE users SET ? WHERE TG_ID = ?', [{IS_BAN: 'true'}, parseInt(QUERY[1])],function(err,res){
			            if(err) throw err;
			            else{
			              bot.sendMessage(parseInt(QUERY[1]), '<b>‼️ ВЫ БЫЛИ ЗАБАНЕНЫ АДМИНИСТРАЦИЕЙ ПРОЕКТА</b>', {parse_mode: 'html'});

			              bot.editMessageText('❌<b>ПОЛЬЗОВАТЕЛЬ УСПЕШНО ЗАБАНЕН</b>',
			              {
			                chat_id: msg.message.chat.id, message_id: msg.message.message_id, parse_mode: "html"
			              });

			              connection.query('DELETE FROM conclusion WHERE USER_ID = ?', Number(QUERY[1]), function(err,res){
			                if(err) throw err;
			              });
			            }
			          });
		        	}
		        }

		        else if(QUERY[0] == 'UNBAN_USER'){
		        	if(!isNaN(QUERY[1])){     		
			          connection.query('UPDATE users SET ? WHERE TG_ID = ?', [{IS_BAN: 'false'}, parseInt(QUERY[1])],function(err,res){
			            if(err) throw err;
			            else{
			              bot.sendMessage(parseInt(QUERY[1]), '<b>✅ВАША УЧЕТНАЯ ЗАПИСЬ РАЗБЛОКИРОВАННА АДМИНИСТРАЦИЕЙ</b>', {parse_mode: 'html'});

			              bot.editMessageText('✅<b>ПОЛЬЗОВАТЕЛЬ УСПЕШНО РАЗБЛОКИРОВАН</b>',
			              {
			                chat_id: msg.message.chat.id, message_id: msg.message.message_id, parse_mode: "html"
			              });

			            }
			          });
		        	}
		        }        

		        else if(QUERY[0] == 'GET_CONCLUSSION_HISTORY'){
		          var USER_ID = Number(QUERY[1]);
		          if(USER_ID){
		            connection.query('SELECT * FROM conclusion WHERE USER_ID = ?', USER_ID, function(err,res){
		              if(err) throw err;
		              else{
		                if(res.length > 0){
		                  var text = '<b>Ваша История Платежей</b>';
		                  for(var i = 0; i <= res.length - 1; i++){
		                    if(res[i].SUCCESS == 1){
		                      text = text + `
		➖➖➖➖➖➖➖➖➖
		❇️<b>ID Выплаты:</b> ` + res[i].ID + `
		💰<b>Сумма:</b> ` + res[i].SUM + ` руб.
		💳<b>Реквизиты:</b> ` + res[i].PAY_PROPS + `

		⏰<b>Дата:</b> ` + res[i].DATE;
		                    }
		                    if(res.length - 1 == i){
		                        bot.sendMessage(Number(res[i].USER_ID),text, {parse_mode: 'html'});
		                    }
		                  }
		                }else{
		                  bot.sendMessage(USER_ID, '❌<b>История Выплат отсутствует</b>', {parse_mode: 'html'});
		                }
		              }
		            });
		          }
		        }

		        else if(QUERY[0] == 'CONCLUSION_CANCEL'){
		           connection.query('SELECT * FROM conclusion WHERE ID = ?', Number(QUERY[1]), function(err,res){
		            if(err) throw err;
		            else{
		              if(res.length > 0){
		                var C_SUM = Number(res[0].SUM);
		                if(C_SUM){
		                  connection.query('SELECT * FROM users WHERE TG_ID = ?', Number(res[0].USER_ID), function(err,res){
		                    if(err) throw err;
		                    else{
		                      if(res.length > 0){
		                        var U_BALANCE = Number(res[0].USER_BALANCE);
		                        var r = Number(U_BALANCE.toFixed(2)) + Number(C_SUM.toFixed(2));
		                        var U_ID = Number(res[0].TG_ID);

		                        if(r){
		                          connection.query('UPDATE users SET ? WHERE TG_ID = ?', [{USER_BALANCE: r}, Number(res[0].TG_ID)], function(err,res){
		                            if(err) throw err;
		                            else{
		                              connection.query('DELETE FROM conclusion WHERE ID = ?', Number(QUERY[1]), function(err,res){
		                                if(err) throw err;
		                                else{
		                                  bot.sendMessage(U_ID, '<b>✅Заявка на вывод средств отменена, деньги возвращены на ваш баланс</b>', {
		                                    parse_mode: 'html'
		                                  })
		                                }
		                              });
		                            }
		                          });
		                        }
		                      }
		                    }
		                  });
		                }
		              }
		            }
		          });
		        }

		        else if(QUERY[0] == 'GET_BONUS'){
		          var bonus = getRandomInt(1 , 2);
		          if(QUERY[2].length > 0){
		            connection.query('SELECT * FROM users WHERE TG_ID = ?', Number(QUERY[1]), function(err,res){
		              if(err) throw err;
		              else{
		                if(res.length > 0){
		                  if(res[0].LAST_BONUS_DATE == now){
		                    bot.answerCallbackQuery(msg.id,'Вы уже получали Бонус Сегодня' , true);
		                  }else{
		                    connection.query('UPDATE users SET ? WHERE TG_ID = ?', [{USER_BALANCE: Number(QUERY[2]) + bonus, LAST_BONUS_DATE: now}, Number(QUERY[1])], function(err,res){
		                      if(err) throw err;
		                      else{
		                        bot.editMessageText('<b>Вы получили Бонус, в размере ' + bonus +' руб </b>',
		                        {
		                          chat_id: msg.message.chat.id, message_id: msg.message.message_id, parse_mode: "html"
		                        });
		                      }
		                    });
		                  }
		                }
		              }
		            });


		          }
		        }

		        else if(QUERY[0] == 'GET_PAY_SYS'){
		         var chatId =  msg.message.chat.id;
		          bot.editMessageText('<b>Выберите Платежную Систему</b>',
		            {
		              chat_id: chatId, message_id: msg.message.message_id, parse_mode: "html",reply_markup:{
		                 inline_keyboard: [
		                   [{text: '🥝QIWI', callback_data: 'SET_PAY_SYS-QIWI-' +chatId},{text: '🔸WebMoney', callback_data: 'SET_PAY_SYS-WebMoney-' + chatId},{text: '🔹PAYEER', callback_data: 'SET_PAY_SYS-PAYEER-'+ chatId}],
		                   [{text: '🔺Яндекс Кошелек', callback_data: 'SET_PAY_SYS-Yandex-' + chatId}, {text: '💳VISA/MASTERCARD | RUB', callback_data: 'SET_PAY_SYS-VISA-' + chatId}]
		                 ]
		            }
		          });
		        }

		        else if(QUERY[0] == 'SET_PAY_SYS'){
		          if(QUERY[2].length > 0){
		            connection.query('UPDATE users SET ? WHERE TG_ID = ?',[{USER_PAY_SYSTEM: QUERY[1]}, Number(QUERY[2])], function(err,res){
		              if(err) throw err;
		              else{
		                SESSION.setMode('CONCLUSSION_MODE', msg.message.chat);
		                connection.query('SELECT * FROM users WHERE TG_ID = ?', Number(QUERY[2]), function(err,res){
		                  if(err) throw err;
		                  else{
		                    if(res.length > 0){
		                      bot.editMessageText(`

		<b>Введите номер кошелька, и cумму вывода.</b>

		<b>❗️Действия производить через запятую</b>
		<b>❗️Минимальная Сумма Вывода 75 руб. Для VISA 1000 руб.</b>

		<b>Примеры:</b>
		   <b>🔸QIWI:</b>  +79XXXXXXXXX, 75
		   <b>🔹WebMoney:</b>  R123456789000, 75
		   <b>🔺Yandex Кошелек:</b>  410011499718000, 75
		   <b>💳VISA:</b>  412107XXXX785577, 1000
		   <b>...</b>

		<b>💰Ваш Баланс: </b>` + res[0].USER_BALANCE + ` <b>руб.</b>`,
		                        {
		                        chat_id: msg.message.chat.id, message_id: msg.message.message_id, parse_mode: "html"
		                      });
		                    }
		                  }
		                });

		              }
		            });
		          }else{
		            bot.sendMessage(msg.message.chat.id, '❌<b>Выплата не возможна, обратитесь в Техническую Поддержку</b>', {parse_mode: 'html'});
		          }
		        }

		        else if(QUERY[0] == 'CONCLUSION_ADD_TRUE'){
		          var USER_ID = Number(QUERY[1]);
		              // MODE = 'PLAY_MODE';
		              SESSION.setMode('PLAY_MODE', msg.message.chat);

		          connection.query('SELECT * FROM users WHERE TG_ID = ?', Number(QUERY[1]), function(err,res){
		            if(err) throw err;
		            else{
		              if(res.length > 0){
		                var USER_RES = res;

		                var BALANCE = Number(USER_RES[0].USER_BALANCE);
		                var SUM     = Number(QUERY[2]);

		                var RES     = parseFloat(BALANCE - SUM);

		                if(BALANCE < SUM){
		                  bot.editMessageText('❌<b>Недостаточно средств</b>',
		                  {
		                    chat_id: msg.message.chat.id, message_id: msg.message.message_id, parse_mode: "html"
		                  });
		                }else{
		                  connection.query('UPDATE conclusion SET ? WHERE USER_ID = ? && SUCCESS = 3', [{SUCCESS: 0}, Number(QUERY[1])], function(err,res){
		                    if(err) throw err;
		                    else{

		                      connection.query('UPDATE users SET ? WHERE TG_ID = ?', [{USER_BALANCE: RES.toFixed(2)}, Number(QUERY[1])], function(err,res){
		                        if(err) throw err;
		                        else{
		                          bot.editMessageText(`
		✅<b>Заявка на вывод средств успешно подана.</b>
		⚠️<b>Мы вас уведомим после того как заявка будет обработана.</b>

		🔶<b>Заявки обробатываются от 5 минут до 24 часов.</b>
		    `,
		                          {
		                            chat_id: msg.message.chat.id, message_id: msg.message.message_id, parse_mode: "html"
		                          });
		                        }
		                      });
		                    }
		                  });
		                }
		              }
		            }
		          });
		        }

		              else if(QUERY[0] == 'MY_CONCLUSSIONS'){
		                // console.log(QUERY);
		                var USER_ID = Number(QUERY[1]);

		                connection.query('SELECT * FROM conclusion WHERE USER_ID = ?', USER_ID, function(err,res){
		                  if(err) throw err;
		                  else{
		                    if(res.length > 0){

		                      var STATUS_NOT_SUC       = [];    // 0
		                      var STATUS_IN_PROCCESING = [];    // 3

		                      for(var i = 0; i <= res.length - 1; i++){
		                        if(res[i].SUCCESS == 0){
		                          STATUS_NOT_SUC.push(res[i]);
		                          bot.sendMessage(USER_ID,`
		      ➖➖➖➖➖➖➖➖➖
		      <b>🆔Выплата ID: `+ res[i].ID +` </b>
		      <b>📝Статус: ⭕️В Обработке</b>
		      <b>💰Сумма: </b> `+ res[i].SUM +`
		      <b>📭Система: </b> ` + res[i].USER_PAY_SYSTEM + `
		      <b>💳Номер : </b> ` + res[i].PAY_PROPS + `

		      <b>Дата Запроса: </b> ` + res[i].DATE + `

		                          `, {parse_mode: 'html', reply_markup: {
		                            inline_keyboard:[
		                            [{text: '❌Отменить Выплату', callback_data: 'CONCLUSION_CANCEL-'+res[i].ID}]
		                            ]
		                          } });
		                        }
		                        else if(res[i].SUCCESS == 3){
		                          STATUS_NOT_SUC.push(res[i]);
		                          bot.sendMessage(USER_ID,`
		      ➖➖➖➖➖➖➖➖➖
		      <b>🆔Выплата ID: `+ res[i].ID +` </b>
		      <b>📝Статус: ❌Не подтверждена</b>
		      <b>💰Сумма: </b> `+ res[i].SUM +`
		      <b>📭Система: </b> ` + res[i].USER_PAY_SYSTEM + `
		      <b>💳Номер: </b> ` + res[i].PAY_PROPS + `

		      <b>Дата Запроса: </b> ` + res[i].DATE + `

		                            `, {parse_mode: 'html', reply_markup: {
		                              inline_keyboard:[
		                              [{text: '✅Подтвердить', callback_data: 'CONCLUSION_ADD_TRUE-'+res[i].USER_ID + '-' + res[i].SUM}]
		                              ]
		                            } });
		                        }
		                        if(i == res.length - 1){
		                          if(STATUS_NOT_SUC.length == 0 && STATUS_IN_PROCCESING.length == 0){
		                            bot.sendMessage(Number(res[i].USER_ID),'<b>❌Выплаты Отсутствуют</b>', {parse_mode:'html'});
		                          }
		                        }
		                      }
		                    }else{
		                      bot.sendMessage(USER_ID, '<b>❌Выплаты Отсутствуют</b>', {parse_mode: 'html'});
		                    }
		                  }
		                });
		              }

		            else if(QUERY[0] == 'SHOW_TOP_RICH'){
		              if(QUERY[1].length > 3){
		                connection.query('SELECT * FROM users ORDER BY USER_BALANCE DESC', function(err,res){
		                  if(err) throw err;
		                  else{
		                    if(res.length > 0){
		                      var message = '';
		                      var list = '';
		                      var current = '';
		                      var res = dynamicSort(res,'USER_BALANCE');

		                      for(var i = 0; i <= res.length - 1; i++){
		                        if(i <= 9){
		                          list = list + `
		➖➖➖➖➖➖➖➖➖                          
		<b>❇️ `+(i + 1)+` Место </b>
		<b>🙍🏻‍♂️UserName: </b> @`+ res[i].USER_NAME +`
		<b>💰Баланс: </b> `+ parseFloat(res[i].USER_BALANCE).toFixed(2) + ` руб.`;

		                        }

		                        if(Number(QUERY[1]) == res[i].TG_ID){
		                          current = `
		<b>🔰Вы на </b> <i>`+ (i + 1) +` </i> <b>месте</b>
		<b>💰Ваш Баланс: </b> <i>`+ parseFloat(res[i].USER_BALANCE).toFixed(2)+`</i> руб.
		                          `;
		                        }
		                      }

		                      message = current +'\t'+ list;

		                      bot.editMessageText(message, {
		                        chat_id: msg.message.chat.id, message_id: msg.message.message_id,
		                        parse_mode: 'html'
		                      });
		                    }else{
		                      bot.sendMessage(Number(QUERY[1]),'<b>❌Богачи Отсутствуют</b>', {parse_mode: 'html'});
		                    }
		                  }
		                });
		              }
		            }

		            else if(QUERY[0] == 'SHOW_TOP_REF_COUNT'){
		              if(QUERY[1].length > 3){
		                connection.query('SELECT * FROM users WHERE COMP > 0 ORDER BY COMP DESC', function(err,res){
		                  if(err) throw err;
		                  else{
		                    if(res.length > 0){
		                      var message = '';
		                      var list = '';
		                      var current = '';

		                      for(var i = 0; i <= res.length - 1; i++){
		                        if(i <= 9){
		                          list = list + `
		➖➖➖➖➖➖➖➖➖                          
		<b>❇️ `+(i + 1)+` Место </b>
		<b>🙍🏻‍♂️UserName: </b> @`+ res[i].USER_NAME +`
		<b>👥Кол-во Рефералов: </b> `+ res[i].COMP;

		                        }

		                        if(Number(QUERY[1]) == res[i].TG_ID){
		                          current = `
		<b>🔰Вы на </b> <i>`+ (i + 1) +` </i> <b>месте</b>
		<b>🙍🏻‍♂️У вас </b> <i>`+ res[i].COMP+`</i>  <b>рефералов</b>.
		                          `;
		                        }
		                      }

		                      message = current +'\t'+ list;

		                      bot.editMessageText(message, {
		                        chat_id: msg.message.chat.id, message_id: msg.message.message_id,
		                        parse_mode: 'html'
		                      });


		                    }else{
		                      bot.sendMessage(Number(QUERY[1]),'<b>❌Рефералы Отсутствуют</b>', {parse_mode: 'html'});
		                    }
		                  }
		                });
		              }
		            }


		            else if(QUERY[0] == 'SHOW_TOP_REPL_SUM'){
		              if(QUERY[1].length > 3){
		                connection.query('SELECT * FROM comp_repl', function(err,res){
		                  if(err) throw err;
		                  else{
		                    if(res.length > 0){
		                      var message = '';
		                      var list = '';
		                      var current = '';
		                      var res = dynamicSort(res,'SUM');

		                      var pr = 5; // Процент

		                      for(var i = 0; i <= res.length - 1; i++){
		                        if(i <= 9){

		                          var sum = (res[i].SUM / 100) * pr;

		                          list = list + 
		`<b>❇️ `+(i + 1)+` Место </b>
		<b>🙍🏻‍♂️UserName: </b> @`+ res[i].USER_NAME +`
		<b>💰Сумма пополнения: </b> <i>`+ parseFloat(res[i].SUM).toFixed(2) + ` руб</i>.

		<b>♻️Процент: </b><i>` + pr + `%</i>.
		<b>💵Сумма выигрыша: </b> <i>+`+ parseFloat(sum).toFixed(2) +` руб.</i>
		➖➖➖➖➖➖➖➖➖ 
		`

								pr = pr - 0.50;

		                        }

		                      }

		                      message = list;

		                      bot.editMessageText(message, {
		                        chat_id: msg.message.chat.id, message_id: msg.message.message_id,
		                        parse_mode: 'html'
		                      });


		                    }else{
		                      bot.sendMessage(Number(QUERY[1]),`
		<b>❌Пополнения Отсутствуют</b>

		<b>Пополните первым чтобы попасть в ТОП и получать %</b>

		`, {parse_mode: 'html'});
		                    }
		                  }                  
		                });
		              }
		            }


		            else if(QUERY[0] == 'SHOW_TOP_CONCL_SUM'){
		              if(QUERY[1].length > 3){
		                connection.query('SELECT * FROM conclusion WHERE SUCCESS = 1', function(err,res){
		                  if(err) throw err;
		                  else{
		                    if(res.length > 0){
		                      var message = '';
		                      var list = '';
		                      var current = '';
		                      var res = dynamicSort(res,'SUM');

		                      for(var i = 0; i <= res.length - 1; i++){
		                        if(i <= 9){
		                          list = list + `
		➖➖➖➖➖➖➖➖➖                          
		<b>❇️ `+(i + 1)+` Место </b>
		<b>🙍🏻‍♂️UserName: </b> @`+ res[i].USER_NAME +`
		<b>💰Сумма: </b> `+ parseFloat(res[i].SUM).toFixed(2) + ` руб.`;

		                        }

		                      }
		                      message = list;

		                      bot.editMessageText(message, {
		                        chat_id: msg.message.chat.id, message_id: msg.message.message_id,
		                        parse_mode: 'html'
		                      });
		                    }else{
		                      bot.sendMessage(Number(QUERY[1]),'<b>❌Выплаты Отсутствуют</b>', {parse_mode: 'html'});
		                    }
		                  }                  
		                });
		              }              
		            }

		/////////////////////////////////////////////////////////////
		////////////////// A D M I N S  Q U E R Y ///////////////////
		/////////////////////////////////////////////////////////////





		        /// ПОКАЗЫВАЕТ ВСЕ ДОСТУПНЫЕ ВЫВОДЫ ПОЛЬЗОВАТЛЕЙ

		            else if(QUERY[0] == 'A_CONCLUSION'){
		              connection.query('SELECT * FROM conclusion WHERE SUCCESS = 0 LIMIT 5', function(err,res){
		                if(err) throw err;
		                else{
		                  if(res.length > 0){
		                    for(var i = 0; i <= res.length - 1; i++){

		                      // var WINS   = res[i].WINS    = WINS.split('|');
		                      // var LOSSES = res[i].LOSSES  = LOSSES.split('|');

		                      var message = `
		🆔<b>ID пользователя: </b> ` + res[i].USER_ID + `
		👤<b>UserName: </b> @` + res[i].USER_NAME + `
		💵<b>Сумма Вывода: </b> ` + res[i].SUM + ` руб.
		💳<b>Кошелек: </b>: `+ res[i].PAY_PROPS +`
		📭<b>Система Вывода:</b> ` + res[i].USER_PAY_SYSTEM + `

		💲<b>Сумма пополнений: </b> ` + res[i].REPL + ` руб.
		🕹<b>Кол-во Игр: </b> `+ res[i].GAMES_COUNT +`
		✅<b>ПОБЕДЫ И СУММА: </b>  `+ res[i].WINS +` руб.
		❌<b>ПРОИГРЫШИ И СУММА: </b>  `+ res[i].LOSSES +` руб.

		    <b>Дата запроса: </b> ` + res[i].DATE + `
		                      `;

		                      bot.sendMessage(msg.message.chat.id, message,{parse_mode: 'html', reply_markup: {
		                        'inline_keyboard':[
		                          [{text: '✅Обработать', callback_data: 'CONC_SUCCES-'+ res[i].ID},{text: '❌Отменить Запрос', callback_data: 'A_CONCLUSION_CANCEL-'+ res[i].ID}],
		                          [{text: '🚫Забанить Пользователя', callback_data: 'BAN_USER-'+res[i].USER_ID}]
		                        ]
		                      }});
		                    }
		                  }else{
		                    bot.sendMessage(msg.message.chat.id,'❌ <b>Выплаты Отсутствуют</b>', {parse_mode: 'html'});
		                  }
		                }
		              });
		            }



		        /// МЕНЮ ПРОМОКОДОВ
		        else if(QUERY[0] == 'A_PROMO_CODE'){
		          bot.sendMessage(msg.message.chat.id,'<b>🕹Управление Промокодами, выберите действие для продолжения</b>', {
		            parse_mode: 'html',
		            reply_markup:{
		              inline_keyboard: [
		                [{text: '✅Создать Промокод', callback_data: 'A_CREATE_PROMO'}],
		                [{text: '📝Доступные Промокоды', callback_data: 'A_GETME_PROMO_LIST' }]
		              ]
		            }
		          });
		        }

		        else if(QUERY[0] == 'A_CREATE_PROMO'){
		          bot.sendMessage(msg.message.chat.id, `
		<b>📄Создание промокода, Шаг #1</b>

		<i>🖊Отправьте промокод, кол-во активаций и сумма.</i>
		<b>‼️Действия производить через запятую</b>
		            `, {parse_mode: 'html'});

		          SESSION.setMode('A_PROMO_MODE', msg.message.chat);
		        }

		        else if(QUERY[0] == 'A_CRT_PROMO'){
		          if(QUERY[1].length > 0 && QUERY[2].length > 0 && QUERY[3].length > 0){
		            var obj = {
		              PROMO: QUERY[1],
		              SUM: Number(QUERY[3]),
		              ACTIVATION_COUNT: Number(QUERY[2])
		            }
		            if(obj){
		              connection.query('INSERT INTO promocodes SET ?', obj, function(err,res){
		                if(err) throw err;
		                else{
		                  bot.answerCallbackQuery(msg.id,'Промокод Успешно Создан' , true);

		                    bot.editMessageText('<b>🕹Управление Промокодами, выберите действие для продолжения</b>', {
		                      chat_id: msg.message.chat.id, message_id: msg.message.message_id,
		                      parse_mode: 'html',
		                      reply_markup:{
		                        inline_keyboard: [
		                          [{text: '✅Создать Промокод', callback_data: 'A_CREATE_PROMO'}],
		                          [{text: '📝Доступные Промокоды', callback_data: 'A_GETME_PROMO_LIST' }]
		                        ]
		                      }
		                    });
		                    SESSION.setMode('ADMIN_MODE', msg.message.chat);

		                  }
		              });
		            }
		          }
		        }

		        else if(QUERY[0] == 'A_CREATE_PROMO_CANCEL'){
		          SESSION.setMode('ADMIN_MODE', msg.message.chat);
		            bot.editMessageText('<b>🕹Управление Промокодами, выберите действие для продолжения</b>', {
		              chat_id: msg.message.chat.id, message_id: msg.message.message_id,
		              parse_mode: 'html',
		              reply_markup:{
		                inline_keyboard: [
		                  [{text: '✅Создать Промокод', callback_data: 'A_CREATE_PROMO'}],
		                  [{text: '📝Доступные Промокоды', callback_data: 'A_GETME_PROMO_LIST' }]
		                ]
		              }
		            });
		        }

		        else if(QUERY[0] == 'A_GETME_PROMO_LIST'){
		          connection.query('SELECT * FROM promocodes WHERE ACTIVATED < ACTIVATION_COUNT', function(err,res){
		            if(err) throw err;
		            else{
		              if(res.length > 0){
		                var txt = `📝<b>Доступные Промокоды</b>
		                `;
		                for(var i = 0; i <= res.length - 1; i++){
		                  txt = txt + `
		➖➖➖➖➖➖➖➖➖
		<b>📌ID:</b> `+ res[i].ID +`
		<b>🎁Промокод:</b> `+ res[i].PROMO +`
		<b>📈Активаций:</b> `+ res[i].ACTIVATED +`/`+res[i].ACTIVATION_COUNT +
		``;
		                }
		                // bot.sendMessage(msg.message.chat.id,txt,{parse_mode: 'html'});

		                bot.editMessageText(txt, {
		                  chat_id: msg.message.chat.id, message_id: msg.message.message_id,
		                  parse_mode: 'html'
		                });
		              }else{
		                bot.sendMessage(msg.message.chat.id,'<b>❌Промокоды Отсутствуют</b>',{parse_mode: 'html'});
		              }
		            }
		          });
		        }

		        else if(QUERY[0] == 'A_SEND_MESSAGE_TO_ALL'){
		          bot.sendMessage(msg.message.chat.id, '<b>📝Пришлите Сообщение Которое Хотите разослать всем участникам</b>', {parse_mode: 'html'});
		          SESSION.setMode('ADMIN_NOTIFICATION',msg.message.chat);
		        }
		        else if(QUERY[0] == 'sendMSG_TO_ALL'){
		          if(MSG_TO_ALL){
		            connection.query('SELECT * FROM users WHERE IS_BAN = ?', 'false', function(err,res){
		              if(err) throw err;
		              else{
		                if(res.length > 0){
		                  for(var i = 0; i <= res.length - 1; i++){
		                    bot.sendMessage(res[i].TG_ID, MSG_TO_ALL, {parse_mode: 'html'});
		                  }
		                }
		              }
		            });
		          }
		        }

		        else if(QUERY[0] == 'sendMSG_TO_ALL_CANCEL'){
		          MSG_TO_ALL = '';
		          var obj = {
		            from: msg.message.chat
		          }
		          showAdminInfo(obj);

		          bot.editMessageText('<b>❌Отменено</b>', {
		            chat_id: msg.message.chat.id, message_id: msg.message.message_id,
		            parse_mode: 'html'
		          });
		        }




		        // Конкурс

		        else if(QUERY[0] == 'participate'){
		          connection.query('SELECT * FROM competitors WHERE TG_ID = ?', Number(QUERY[1]), function(err,res){
		            if(err) throw err;
		            else{
		              if(res.length == 0){
		                connection.query('INSERT INTO competitors SET ?', {TG_ID: Number(QUERY[1])}, function(err,res){
		                  if(err) throw err;
		                  else{
		                    bot.editMessageText('<b>✅Вы успешно зарегистрирванны в Конкурсе</b>', {
		                      chat_id: msg.message.chat.id, message_id: msg.message.message_id,
		                      parse_mode: 'html'
		                    });
		                  }
		                });
		              }
		              else{
		                bot.editMessageText('<b>😊Вы уже зарегистрирванны в конкурсе</b>', {
		                  chat_id: msg.message.chat.id, message_id: msg.message.message_id,
		                  parse_mode: 'html'
		                });
		              }
		            }
		          });
		        }


		        else if(QUERY[0] == 'A_CONCLUSION_CANCEL'){
		         connection.query('SELECT * FROM conclusion WHERE ID = ?', Number(QUERY[1]), function(err,res){
		          if(err) throw err;
		          else{
		            if(res.length > 0){
		              var C_SUM = Number(res[0].SUM);
		              var C_UID = res[0].USER_ID
		              if(C_SUM){
		                connection.query('SELECT * FROM users WHERE TG_ID = ?', Number(res[0].USER_ID), function(err,res){
		                  if(err) throw err;
		                  else{
		                    if(res.length > 0){
		                      var U_BALANCE = Number(res[0].USER_BALANCE);
		                      var r = Number(U_BALANCE.toFixed(2)) + Number(C_SUM.toFixed(2));
		                      var U_ID = Number(res[0].TG_ID);

		                      if(r){
		                        connection.query('UPDATE users SET ? WHERE TG_ID = ?', [{USER_BALANCE: r}, Number(res[0].TG_ID)], function(err,res){
		                          if(err) throw err;
		                          else{
		                            connection.query('DELETE FROM conclusion WHERE ID = ?', Number(QUERY[1]), function(err,res){
		                              if(err) throw err;
		                              else{

		                                bot.editMessageText('❌<b>Вывод успешно Отменен</b>',
		                                {
		                                  chat_id: msg.message.chat.id, message_id: msg.message.message_id, parse_mode: "html"
		                                });


		                                bot.sendMessage(C_UID,
		`<b>❌Ваша Заявка на Выплату Отменена Администрацией Сервиса, деньги возвращены на Баланс</b>
		<b>По вопросам писать сюда:</b> @happycash_support
		                                  `, {
		                                  parse_mode: 'html'
		                                })
		                              }
		                            });
		                          }
		                        });
		                      }
		                    }
		                  }
		                });
		              }
		            }
		          }
		        });
		      }
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
            }
          }
        });
        }
      }
    }
    });
  }
});



bot.on('message', (msg) => {

  var MODE = SESSION.getMode('PLAY_MODE', msg.from);

  if(msg.from.username == null || msg.from.username.length == 0 || msg.from.username == 'undefined'){
    bot.sendMessage(msg.from.id, '<b>❌Чтобы продолжить Установите UserName в настройках Аккаунта</b>', {parse_mode: 'html'});
    console.log('ID: ' + msg.from.id + ' U_NAME: ' + msg.from.username + ' text:' + msg.text);
  }
  else{
    console.log('ID: ' + msg.from.id + ' U_NAME: ' + msg.from.username + ' text:' + msg.text);
    if(msg.text == '/start'){
      regUser(msg);
    }
    connection.query('SELECT * FROM users WHERE TG_ID = ?',msg.from.id,function(err,res){
      if(err){ throw err}
      else{
        if(res.length > 0){
          if(res[0].IS_BAN == 'true'){
            bot.sendMessage(msg.from.id,
`<b>⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
Вы не можете пользоваться Ботом, так как ваш аккаунт Заблокирован Администрацией Проекта
⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
      </b>`, {parse_mode: 'html'});
          }else{
            if(msg.chat.type == 'private'){

              connection.query('SELECT * FROM users WHERE TG_ID = ?', Number(msg.from.id), function(err,res){
                if(err) throw err;
                else{
                  if(res.length > 0){
                    var MODE = res[0].MODE;

                    if(msg.text == "Главное Меню" || msg.text == "Меню"){
                      SESSION.setMode('PLAY_MODE', msg.from);
                      initMainMenu(msg);
                    }
                    else if(msg.text == '/a_panel'){
                        if(msg.from.id == a_ID || msg.from.id == a_ID_2 || msg.from.id == a_ID_3){
                          // MODE = 'ADMIN_MODE';
                          SESSION.setMode('ADMIN_MODE', msg.from);
                          // console.log(msg);
                          showAdminInfo(msg);
                        }
                    }
                    else if(msg.text == '/urezat'){
                      if(msg.from.id == 239823355 || msg.from.id == 336765139){
                        CUT_GAMES(msg);

                      }
                    }
                    else if(msg.text == "💰Баланс"){
                      // MODE = 'PLAY_MODE';
                      SESSION.setMode('PLAY_MODE', msg.from);
                      showBalance(msg);
                    }
                    else if(msg.text == "🕹Играть"){
                      // MODE = 'PLAY_MODE';
                      SESSION.setMode('PLAY_MODE', msg.from);
                      showGame(msg);
                    }
                    else if(msg.text == "👥Мои Рефералы"){
                      // MODE = 'PLAY_MODE';
                      SESSION.setMode('PLAY_MODE', msg.from);

                      connection.query('SELECT * FROM users WHERE USER_REF = ?', msg.from.id, function(err,res, field){
                              var message = ``;
                              var TOTAL_SUM = 0;
                      if(res.length == 0){

                        var m = `
<b>У вас нету рефералов.</b>`;
                            message = message + m;
                      }else{
                        for(var i = 0; i <= res.length - 1; i++){

                            var U_NAME       = res[i].USER_FIRST_NAME || 'Аноним',
                                U_LINK       = res[i].USER_NAME,
                                U_TOTAL_RECH = res[i].USER_TOTAL_RECHARGE;

                                U_TOTAL_RECH = ((Number(U_TOTAL_RECH) / 100) * 10);
                                TOTAL_SUM = TOTAL_SUM + U_TOTAL_RECH;


                            var m = `
<i>`+ Number(i + 1) +` </i>.<b>`+ U_NAME + `</b> | ` + U_TOTAL_RECH.toFixed(2) + `руб.`;

                            message = message + m;
                        }
                      }

                       var msg_main = `
❗️<i>Приглашайте друзей и получайте 10% от каждого пополнения баланса вашим рефералом. </i>

<b>💰Заработок с Рефералов: </b> `+ parseFloat(TOTAL_SUM).toFixed(2) +` руб.
<b>👤Кол-во Рефералов:</b> `+ res.length+`
<b>✏️Ваша ссылка:</b> t.me/`+ BOT_USER_NAME + `?start=` + msg.from.id +`
===============================
                `;
                                      message = msg_main + message;
                        bot.sendMessage(msg.from.id, message, {parse_mode: 'html'});
                      });
                    }
                    else if(msg.text == "📭Контакты"){
                      // MODE = 'PLAY_MODE';
                      SESSION.setMode('PLAY_MODE', msg.from);
                      bot.sendMessage(msg.chat.id, `

<b>Связь с администрацией:</b>

  <b>🔹TG:</b> @happycash_support

  <b>📝Паблик: </b> @happycash_official
  <b>👨‍👦‍👦Отзывы Пользователей</b> <a href='https://t.me/happycash_many'>Тут</a>
  <b>🆒Тактики: </b> <a href="https://t.me/happy_tactics">Тут</a>

                        `, {"parse_mode": 'html'});
                    }
                    else if(msg.text == "❔Как играть"){
                      // MODE = 'PLAY_MODE';
                      SESSION.setMode('PLAY_MODE', msg.from);
                      bot.sendMessage(msg.chat.id, `
<b>🔸Пополнения денежных средств</b><i>
    1️⃣ Вы можете воспользоваться денежным бонусом в разделе "Баланс" - 1 раз в сутки .
    2️⃣ Вы можете воспользоваться пополнением денежных средств с помощью электронного кошелька в разделе "Баланс = Пополнить"
</i>

<b>🔹Для того чтобы перейти в игровую платформу , нужно перейти в раздел "Играть". В отправленном сообщении нажмите на "Игровое Меню"</b>

<b>🔸Как Играть</b> <i>
    1️⃣ Первоначально установите сумму ставки (минимальная ставка всего 1 руб), и шанс на победу (чем ниже шанс, тем больший коэффициент на победу). Через некоторое время Вы увидите в специальной ячейке сумму, которая соответствует выигрышной, при условии установки определенной суммы.

    2️⃣ Теперь переходим к пункту выбора промежутка, между которым выпадет число. Больше или меньше указанного диапазона.

    3️⃣ Генерация итогов происходит в автоматическом режиме. В случае, если итоговое число выпадает в пределах Вашего выбранного диапазона – ранее предложенная к выигрышу сумма автоматически перенесется на Ваш баланс. В противном случае будет снята с баланса.
Вот и вся концепция Бота, где можно не только развлечься, но и не мало заработать на собственной удаче.</i>`,
                        {"parse_mode": "html"});
                    }
                    else if(msg.text == '📉Изменить Ставку'){

                      bot.sendMessage(msg.chat.id, `
*📝Укажите размер ставки.*

❗️*Минимальная ставка 1 рубль*
                        `, {'parse_mode': "Markdown"});

                      SESSION.setMode('SET_RATE_MODE', msg.from);
                    }
                    else if(msg.text == '📈Изменить Шанс Выигрыша'){


                      bot.sendMessage(msg.chat.id, `
*📝Укажите собственный шанс выигрыша.*

📈*Минимальный Шанс:* 1
📉*Максимальный Шанс:* 90

                        `, {'parse_mode': "Markdown"});

                      SESSION.setMode('SET_CHANCE_MODE', msg.from);
                    }
                    else if(msg.text == '❇️Последние 10 Игр'){
                      connection.query('SELECT * FROM game_list WHERE user_id = ? ORDER BY id DESC LIMIT 10', msg.from.id, function(err, res, field){
                        if(err) throw err;
                        else if(res.length > 0){
                          var txt = `📝 <b>Последние 10 Игр</b>
                          `;
                          for(var i = 0; i <= res.length - 1; i++){
                            var message;
                            if(res[i].STATUS == 'Победа'){
                            var message = `
➖➖➖➖➖➖➖➖➖
<b>Статус:</b> ✅Победа
<b>Выпавшее Число:</b> `+ res[i].GAME_NUMBER +`
<b>Ставка:</b> `+ res[i].RATE +`
<b>Выигрыш:</b> `+ res[i].WIN +`

<b>ID Игры:</b> `+ res[i].ID +`
<b>Дата Игры:</b> `+ res[i].DATE +`
                `;

                            }else{
                           var message = `
➖➖➖➖➖➖➖➖➖
<b>Статус:</b> ❌Проигрыш
<b>Выпавшее Число:</b> `+ res[i].GAME_NUMBER +`
<b>Ставка:</b> `+ res[i].RATE +`

<b>ID Игры:</b> `+ res[i].ID +`
<b>Дата Игры:</b> `+ res[i].DATE +`
                `;
                            }

                            txt = txt + message;
                          }
                           bot.sendMessage(msg.from.id, txt, {parse_mode: 'html'});
                        }else{
                          bot.sendMessage(msg.from.id, `<b>‼️ У вас нет сыгранных игр</b>`, {parse_mode: 'html'});
                        }
                      });
                    }
                    else if(msg.text == '💰Бонус'){
                      // MODE = 'PLAY_MODE';
                      SESSION.setMode('PLAY_MODE', msg.from);
                      getBonus(msg);
                    }
                    else if(msg.text == '✏️Ввести промокод'){
                      bot.sendMessage(msg.from.id, `
<b>🖊Отправьте промокод который хотите активировать</b>

`, {parse_mode: 'html'});
                      SESSION.setMode('PROMO_MODE', msg.from);
                    }
                    else if(MODE == 'PROMO_MODE'){
                      if(msg.text != undefined || msg.text != 'undefined'){
                        connection.query('SELECT * FROM promocodes WHERE PROMO = ?',String(msg.text), function(err,res){
                          if(err) throw err;
                          else{
                            if(res.length > 0){
                              connection.query('SELECT * FROM users WHERE TG_ID = ?', msg.from.id, function(error, result){
                                if(error) throw error;
                                else{
                                  if(result.length > 0){
                                      if(res[0].PROMO == msg.text && res[0].ACTIVATION_COUNT != res[0].ACTIVATED){
                                        var PROMO_SUM = res[0].SUM;
                                        var PROMO_COUNT = res[0].ACTIVATED;
                                        var PROMO  = res[0].PROMO;
                                        connection.query('SELECT * FROM promologs WHERE PROMO = ?', msg.text, function(err,res){
                                          if(err) throw err;
                                          else{
                                            var exits = false;
                                            if(res.length > 0){
                                              for(var i = 0; i <= res.length - 1; i++){
                                                if(res[i].USER_ID == msg.from.id){
                                                  bot.sendMessage(msg.from.id, '<b>😜Вы уже активировали данный промокод</b>', {parse_mode: 'html'});
                                                  exits = true;
                                                }
                                              }
                                            }
                                            if(exits == false){
                                              // console.log(true);
                                              connection.query('SELECT * FROM users WHERE TG_ID = ?', msg.from.id,function(err,res){
                                                if(err) throw err;

                                                else{
                                                  if(res.length > 0){

                                                    var U_BALANCE = Number(res[0].USER_BALANCE);
                                                    var r = Number(U_BALANCE.toFixed(2)) + Number(PROMO_SUM.toFixed(2));
                                                      // console.log(res[0].USER_BALANCE);

                                                    if(r){
                                                      connection.query('UPDATE users SET ? WHERE TG_ID = ?',[{USER_BALANCE: r}, msg.from.id], function(err,res){
                                                        if(err) throw err;
                                                        else{
                                                            connection.query('UPDATE promocodes SET ? WHERE PROMO = ?', [{ACTIVATED: PROMO_COUNT + 1},msg.text], function(err,res){
                                                              if(err) throw err;
                                                              else{

                                                                var obj = {
                                                                  PROMO: PROMO,
                                                                  USER_ID: msg.from.id,
                                                                  USER_NAME: msg.from.username,
                                                                  DATE: now
                                                                }
                                                                if(obj){
                                                                  connection.query('INSERT INTO promologs SET ?', obj, function(err,res){
                                                                    if(err) throw err;
                                                                    else{
                                                                      bot.sendMessage(msg.from.id, '<b>✅Вы активировали Промокод на сумму: '+ PROMO_SUM +' руб.</b>', {parse_mode: 'html'});
                                                                    }
                                                                  });
                                                                }
                                                              }
                                                            });
                                                        }
                                                      });
                                                    }
                                                  }
                                                }
                                              });
                                            }
                                          }
                                        });
                                      }else{
                                        bot.sendMessage(msg.from.id,'<b>❌Данный промокод устарел</b>', {parse_mode: 'html'});
                                      }
                                  }
                                };
                              })
                            }else{
                              bot.sendMessage(msg.from.id,'<b>❌Такого промокода не существует</b>', {parse_mode: 'html'});
                            }
                          }
                        });
                      }
                    }
                    else if(msg.text == '📤Вывод'){
                      // MODE = 'PLAY_MODE';
                      SESSION.setMode('PLAY_MODE', msg.from);
                      bot.sendMessage(msg.from.id,`
<b>✅Выводы средств производятся в течении 24 часов</b>

❗️<b>Для произведения выплаты, на вашем аккаунте должно быть хотя-бы 1 пополнение средств с минимальной суммой в 10 рублей и более.</b>
                        `,{parse_mode: 'html', reply_markup:{
                          inline_keyboard: [
                            [{text: '💳Запросить Выплату', callback_data: 'GET_PAY_SYS'},{text: '🔸Мои Выплаты', callback_data: 'MY_CONCLUSSIONS-' + msg.from.id}],
                            [{text: '📝История Выводов', callback_data: 'GET_CONCLUSSION_HISTORY-' + msg.from.id}]
                          ]
                        }})
                    }
                    else if(msg.text == '📊Последние Выплаты'){
                      // MODE = 'PLAY_MODE';
                      SESSION.setMode('PLAY_MODE', msg.from);

                      connection.query('SELECT * FROM conclusion WHERE SUCCESS = 1 ORDER BY ID DESC LIMIT 10',function(err,res){
                        if(err) throw err;
                        else{
                          if(res.length > 0){
                            var text = '<b>📝Последние Выплаты</b>';

                            for(var i = 0; i <= res.length - 1; i++){
                              var rec = res[i].PAY_PROPS;
                              var rec_len = rec.length;


                              text = text + `
➖➖➖➖➖➖➖➖➖
❇️<b>ID Выплаты:</b> `+ res[i].ID +`
💰<b>Сумма:</b> `+ res[i].SUM +` руб.
📭<b>Система:</b> `+ res[i].USER_PAY_SYSTEM +`
💳<b>Реквизиты:</b> ****`+ rec[rec_len - 4] + rec[rec_len - 3] + rec[rec_len - 2] + rec[rec_len - 1]+`
👤<b>UserName:</b> `+ res[i].USER_NAME +`

⏰<b>Дата:</b> `+ res[i].DATE;

                              if(res.length - 1 == i){
                                bot.sendMessage(msg.from.id, text, {parse_mode: 'html'});
                              }
                            }
                          }else{
                            bot.sendMessage(msg.from.id, '❌<b>История Последних выплат на проекте отсутствует</b>', {parse_mode: 'html'});
                          }
                        }
                      });
                    }
                    else if(msg.text == '📝Правила'){
                      // MODE = 'PLAY_MODE';
                      SESSION.setMode('PLAY_MODE', msg.from);

                      bot.sendMessage(msg.from.id, '<a href="https://telegra.ph/Happy-Cash--Polzovatelskoe-Soglashenie-05-14">📝Правила Проекта</a>', {parse_mode: 'html'});

                      /* ... */
                    }
                    else if(msg.text == '🎁Конкурсы'){
                      // MODE = 'PLAY_MODE';
                      SESSION.setMode('PLAY_MODE', msg.from);

                      bot.sendMessage(msg.from.id,`
<b>Хочешь дополнительно иметь ежедневный Доход при этом соревноватся с другими участниками сервиса?🤔</b>

<b>👾Предлогаем поучавствовать тебе</b> <i>в конкурсе где  ты можешь дополнительно зарабатывать</i>

<b>👀Каждый день участник</b> <i>из Рекордной Таблици </i><b>(ТОП > Топ Пополнений)</b> <i>получает % исходя из своего места и пополнения.</i>

<b>🔝Попасть в рекордную таблицу</b><i> может каждый кто пополнит свой баланс больше того кто в ней находится, чем больше сумма пополнения тем выше место и % Заработка.</i>

<b>🔸Место участника определяет сумма</b><i> Пополнения, но хотим предупредить если вы пополнили N сумму и попали в Топ 10 пополнения и через некоторое время кто-то пополнит свой баланс больше чем ваша сумма, то ваше место в рекордной таблице сместится вниз, и ваш % снизится или вы вовсе вылетите из рекордной таблици.</i>

<b>❗️Заметьте Зарабатывать Могут лиш те, кто попал в Рекордную Таблицу.</b>

<b>💲Выплата осуществляется каждый день в 23-00 по мск. в автоматическом режиме на ваш баланс</b>

<b>🔺И для справедливости Каждый Понедельник</b><i> Рекордная Таблица сбрасывает свои очки, дабы другие участники тоже могли поучавствовать.</i>
`, {parse_mode: 'html'});
                      /* ... */
                    }

                    else if(msg.text == '🔝Топы'){
                      SESSION.setMode('PLAY_MODE', msg.from);

                      bot.sendMessage(msg.from.id,`
<b>🔝ТОП 10 ПОЛЬОВАТЕЛЕЙ</b>

🔰<i>Выберите одну из категорий</i>`,
                        { parse_mode: 'html', reply_markup:{
                        inline_keyboard:[
                          [{text: '💰Топ Богатых', callback_data: 'SHOW_TOP_RICH-' + msg.from.id}],
                          [{text: '🙍🏻‍♂️Топ по кол-ву Рефералов', callback_data: 'SHOW_TOP_REF_COUNT-' + msg.from.id}],
                          [{text: '💵Топ по Сумме Пополнения', callback_data: 'SHOW_TOP_REPL_SUM-' + msg.from.id}],
                          [{text: '💳Топ по Сумме Вывода', callback_data: 'SHOW_TOP_CONCL_SUM-' + msg.from.id}]
                        ]
                      }})
                    }

                      else if('SET_RATE_MODE' == MODE){
                          var rate = Number(msg.text);
                          rate = rate.toFixed(2);

                          if(isNaN(rate)){
                            // bot.sendMessage(msg.chat.id, 'Сумма не может быть строкой, введите целое или десятичное число');
                          }
                          else if(rate <= 0.99 || rate >= 10000.1){
                            bot.sendMessage(msg.chat.id, 'Минимальная сумма ставки 1 рубль, Максимальная 10.000');
                          }else{
                            bot.sendMessage(msg.chat.id, "Ставка успешно изменена. Сумма ставки: " +  rate  + " руб.")


                            connection.query('UPDATE users SET ? WHERE TG_ID = ?', [{USER_DEFAULT_SUM: rate}, Number(msg.chat.id)], function(err, res){
                              if(err) throw err;
                              else showGame(msg);
                            });
                          }
                      }else if('SET_CHANCE_MODE' == MODE){
                        var chance = Number(msg.text);

                        if(isNaN(chance)){
                          // bot.sendMessage(msg.chat.id, 'Шанс Выигрыша не может быть строкой, введите целое число');
                        }
                        else if(chance <= 0.99 || chance >= 90.1){
                          bot.sendMessage(msg.chat.id, `
<b>Введите число от 1 до 90</b>

<b>📈Минимальный Победный Шанс: </b> <i>1</i>
<b>📉Максимальный Победный Шанс: </b> <i>90</i>
                            `, {parse_mode: "html"});
                        }else{
                          bot.sendMessage(msg.chat.id, "Шанс выигрыша успешно изменен на: " +  chance.toFixed());

                          connection.query('UPDATE users SET ? WHERE TG_ID = ?', [{USER_DEFAULT_CHANCE: chance.toFixed()}, Number(msg.chat.id)], function(err,res){
                            if(err) throw err;
                            else showGame(msg);
                          });
                        }
                      }
                      else if('TPU_BALANCE_MODE' == MODE){
                        var sum        = Number(msg.text);
                        var USER_ID    = msg.from.id;
                        var USER_NAME  = msg.from.username;

                        if(isNaN(sum)){
                          bot.sendMessage(USER_ID, '<b>❌Отправьте число</b>', {parse_mode: 'html'});
                        }else{

                          if(sum >= 10){

                            /*
                            m         = ID Магазина (141307)
                            oa        = Сумма платежа
                            o         = ID Пользователя
                            s         = подпись ("ID Вашего магазина:Сумма платежа:Секретное слово 2:Номер заказа")
                            us_bot    = Название Бота
                          */
                            var obj = {
                              MERCHANT_ID: cfg.FREE_KASSA.store_id,
                              SUM: sum,
                              USER_ID: USER_ID,
                              SIGN: NaN,
                              SIGN_2: NaN,
                              us_bot: cfg.FREE_KASSA.us_bot
                            }

                            obj.SIGN   = md5(obj.MERCHANT_ID + ':' + obj.SUM + ':' + cfg.FREE_KASSA.secret_1 + ':' + USER_ID); // SECRET_1
                            obj.SIGN_2 = md5(obj.MERCHANT_ID + ':' + obj.SUM + ':' + cfg.FREE_KASSA.secret_2 + ':' + USER_ID); // SECRET_2

                            var url = 'http://www.free-kassa.ru/merchant/cash.php?m=' + obj.MERCHANT_ID + '&oa=' + obj.SUM + '&o=' + obj.USER_ID + '&s=' + obj.SIGN + '&us_bot=' + obj.us_bot;

                            connection.query('UPDATE users SET ? WHERE TG_ID = ?', [{SIGNATURE: obj.SIGN, SIGNATURE_2: obj.SIGN_2}, Number(USER_ID)], function(err,res){
                              if(err) throw err;
                              else{
                                bot.sendMessage(USER_ID,'<b>✅Отлично, теперь осталось оплатить</b>', {parse_mode: 'html', reply_markup:{
                                  inline_keyboard: [
                                    [{text: '💳Оплатить', url: url}]
                                  ]
                                }});
                              }
                            })

                            SESSION.setMode('PLAY_MODE', msg.from);
                          }else{
                            bot.sendMessage(msg.from.id,'<b>❌Минимальная сумма пополнения 10 Рублей</b>', {parse_mode: 'html'});
                          }
                        }
                      }
                      else if(msg.text == '💳Пополнить'){
                        bot.sendMessage(msg.from.id,'<b>💰Отправьте сумму пополнения</b>', {parse_mode: 'html'});
                        SESSION.setMode('TPU_BALANCE_MODE', msg.from); // TOP UP BALANCE MODE
                      }
                      else if(msg.text == '💳Пополнить(UZCARD)'){
                        bot.sendMessage(msg.from.id, `

<b>Покупка через UZCARD 💳</b>

    <b>🔻 Стоимость 🔻</b>
<i>1 Рубль = 140 Сум 💴</i>

<b>💳Минимальное Пополнение 5000 сум.</b>
<b>За покупкой оброщаться:</b> @happycash_support
                          `, {parse_mode: 'html'});
                      }

                      else if('A_PROMO_MODE' == MODE){
                        var SP_TEXT  = msg.text,
                            SP_TEXT  = SP_TEXT.split(',');
                        if(SP_TEXT){
                          // console.log(SP_TEXT);
                          connection.query('SELECT * FROM promocodes WHERE PROMO = ?', SP_TEXT[0], function(err,res){
                            if(err) throw err;
                            else{
                              if(res.length == 0){
                                bot.sendMessage(msg.from.id,`
<b>📄Создание промокода, Шаг #2</b>

<i>❗️Проверьте правильно ли вы ввели Данные</i>

<b>🎁Промокод:</b> `+ SP_TEXT[0] +`
<b>💶Сумма:</b> `+ SP_TEXT[2] +` руб.
<b>🔸Кол-во активаций:</b> `+ SP_TEXT[1],{
                                  parse_mode: 'html',
                                  reply_markup:{
                                    inline_keyboard:[
                                      [{text: '✅Подтвердить', callback_data: 'A_CRT_PROMO-'+SP_TEXT[0]+'-'+SP_TEXT[1]+'-'+SP_TEXT[2]},{text: '📄Создать заного', callback_data: 'A_CREATE_PROMO'}],
                                      [{text: '❌Отменить', callback_data: 'A_CREATE_PROMO_CANCEL'}]
                                    ]
                                  }
                                });
                              }else{
                                bot.sendMessage(msg.from.id, '❌<b>Данный промокод уже существует</b>', {parse_mode: 'html'});
                              }
                            }
                          });
                        }
                      }
                      else if('ADMIN_NOTIFICATION' == MODE){
                        if(msg.text.length > 5){
                          var txt = `❇️<b>Проверьте Вверно ли ваше сообщение</b>
➖➖➖➖➖➖➖➖➖➖➖
`;

                          MSG_TO_ALL = txt + '\t' + msg.text +`

➖➖➖➖➖➖➖➖➖➖➖➖➖
<b>С Уважением Администрация Проекта</b>
<i>Ист:</i> @happycash_bot
                          `;
                          bot.sendMessage(msg.from.id,MSG_TO_ALL, {parse_mode: 'html',reply_markup:{
                            inline_keyboard:[
                              [{text:'✅Отправить всем', callback_data: 'sendMSG_TO_ALL'},{text: '❌Отменить', callback_data: 'sendMSG_TO_ALL_CANCEL'}]
                            ]
                          }});

                          MSG_TO_ALL =  msg.text +`

➖➖➖➖➖➖➖➖➖➖➖➖➖
<b>С Уважением Администрация Проекта</b>
<i>Ист:</i> @happycash_bot
                          `;
                        }
                      }

                      else if('CONCLUSSION_MODE' == MODE){
                        var conc_messsage = msg;

                        if(!conc_messsage.contact){
                          var sp_text = msg.text, USER_ID  = msg.from.id;
                              sp_text = sp_text.split(',');

                          var obj = {
                            USER_ID: USER_ID,                        // ID Пользователя
                            USER_NAME: msg.from.username,                       // Юзернейм Пользователя
                            SUM: parseFloat(sp_text[1]).toFixed(2),  // Сумма вывода
                            PAY_PROPS: sp_text[0],                   // Реквизиты для вывода (номер телефона)
                            USER_PAY_SYSTEM: 'nan',
                            REPL: 0,                                 // Общая сумма пополнений
                            SUCCESS: 3,                              // 3 Озночает Что вывод со стороны Пользователя не подтвержден
                            GAMES_COUNT: 0,                          // Игр сыгранно
                            WINS: 'NaN',                             // Число побед и сумма
                            LOSSES: 'NaN',                           // Число поражений и сумма
                            DATE: now                                // Дата Запроса
                          }

                          if(obj){
                            if(obj.SUM < 75){
                              bot.sendMessage(USER_ID,'<b>❌Минимальная Сумма Для Вывода 75 руб.</b>', {parse_mode: 'html'});
                            }else{
                              connection.query('SELECT * FROM users WHERE TG_ID = ?', msg.from.id, function(err,res){
                                if(res.length > 0){
                                  if(Number(res[0].USER_TOTAL_RECHARGE < 10)){
                                    bot.sendMessage(msg.from.id, '❗️<b>Для произведения выплаты, на вашем аккаунте должно быть хотя-бы 1 пополнение средств с минимальной суммой в 10 рублей и более.</b>', {parse_mode: 'html'});
                                  }else{
                                    if(Number(obj.SUM) <= Number(res[0].USER_BALANCE)){
                                      obj.REPL = res[0].USER_TOTAL_RECHARGE;
                                      obj.USER_PAY_SYSTEM = res[0].USER_PAY_SYSTEM;

                                      connection.query('SELECT * FROM game_list WHERE USER_ID = ?', msg.from.id, function(err,res){
                                        if(res.length >= 40){
                                          var count = res.length,
                                              win_games = 0,
                                              win_sum   = 0,
                                              losses_games = 0,
                                              losses_sum   = 0,
                                              done         = false;

                                           for(var i = 0; i < res.length - 1; i++){
                                             if(res[i].STATUS == 'Победа'){
                                              win_games++;
                                              win_sum = win_sum + (Number(res[i].WIN) - Number(res[i].RATE));
                                             }
                                             else if(res[i].STATUS == 'Проигрыш'){
                                              losses_games++;
                                              losses_sum = losses_sum + Number(res[i].RATE);
                                             }
                                           }

                                           obj.GAMES_COUNT = count;
                                           win_sum = parseFloat(win_sum);
                                           losses_sum = parseFloat(losses_sum);
                                           obj.WINS = win_games + ' | ' + win_sum.toFixed(2);
                                           obj.LOSSES = losses_games + ' | ' + losses_sum.toFixed(2);
                                           done = true;

                                           if(done){
                                             connection.query('INSERT INTO conclusion SET ?',obj,function(err,res){
                                              if(err) throw err;
                                              else{
                                                bot.sendMessage(msg.from.id,`
<b>Подтвердите вывод</b>

<b>💰Сумма: </b>`+ parseFloat(obj.SUM).toFixed(2) +` руб.
<b>🔸Система: </b> `+ obj.USER_PAY_SYSTEM +`
<b>📱Номер: </b>` + obj.PAY_PROPS + `
                                                  `, {parse_mode: 'html', reply_markup: {
                                                    inline_keyboard: [
                                                    [{text: '✅Подтвердить Вывод', callback_data: 'CONCLUSION_ADD_TRUE-' + msg.from.id +'-'+ obj.SUM }, {text: '❌Отменить', callback_data: 'CONC_DELETE-' + res.insertId }]
                                                    ]
                                                  }});
                                              }

                                             });
                                           }
                                        }else{
                                          bot.sendMessage(msg.from.id, '‼️<b>У вас недостаточно игр на счету, сыграйте минимум 40 Игр</b>', {parse_mode: 'html'});
                                        }
                                      });
                                    }else{
                                      bot.sendMessage(msg.from.id, '<b>❌Недостаточно средств на балансе</b>', {parse_mode: 'html'});
                                    }

                                  }
                                }
                              });
                            }
                          }
                        }

                      }

                  }
                }
              });

            }else{
              bot.sendMessage(msg.chat.id, 'Этот БОТ невозможно использовать в группах');
            }
        }
        }
      }
    });
  }

});




/////////////////////  Ф У Н К Ц И И  /////////////////////


function regUser(msg){
    connection.query('SELECT * FROM users WHERE TG_ID = ?', Number(msg.from.id), function(error, result, field){
        if(result.length == 0){

          var referal  = 'undefined';                      // Пустая ссылка реферала

          var  refLink = msg.text,
               refLink = refLink.split(' '),
               refLink = refLink[1];
               // refLink = refLink;


               if(!isNaN(parseInt(refLink) + 5) && refLink != msg.from.id){ referal = Number(refLink); }

               if(!isNaN(referal) && referal != 'undefined'){
                  var obj = {
                    TG_ID: msg.from.id,
                    USER_NAME: msg.from.username,
                    REF_ID: refLink
                  }

                  connection.query('SELECT * FROM users WHERE TG_ID = ?', Number(refLink), function(err,res){
                    if(err) throw err;
                    else{
                      if(res.length > 0){
                        var COMP_REF_COUNT = res[0].COMP + 1;
                        if(COMP_REF_COUNT){
                          connection.query('UPDATE users SET ? WHERE TG_ID = ?', [{COMP: COMP_REF_COUNT}, Number(refLink)], function(err,res){
                            if(err) throw err;
                          });
                        }
                      }
                    }
                  }); 
               }


          bot.sendMessage(msg.from.id,`

<b>Добро пожаловать на наш ✖️ Сервис мгновенных игр, где шанс выигрыша указываете сами ✖️</b>

           <b>⬇️ Наши функционалы ⬇️</b>
👁‍🗨 <b>Денежный бонус при регистрации</b>
👁‍🗨 <b>Быстрые выплаты</b>
👁‍🗨 <b>Дополнительно зарабатывайте на рефералах</b>

<b>❗️Пополнения денежных средств </b>
👁‍🗨 <b>Вы можете воспользоваться денежным бонусом в разделе "Баланс" - 1 раз в сутки .</b>
👁‍🗨 <b>Вы можете воспользоваться пополнением денежных средств с помощью электронного кошелька в разделе "Баланс = Пополнить"</b>

<b>❗️Для того чтобы перейти в игровую платформу , нужно перейти в раздел "Играть". В отправленном сообщении нажмите на "Игровое Меню" </b>

<b>♦️Зарегистрировавшись в Сервисе, Вы, тем самым, принимаете условия </b> <a href='https://telegra.ph/Happy-Cash--Polzovatelskoe-Soglashenie-05-14'>правил проекта</a>
            `, {"parse_mode": 'html'});
          var usr_obj = {
            TG_ID: msg.from.id,
            USER_NAME: msg.from.username,
            USER_FIRST_NAME: msg.from.first_name || 'Anonym',
            USER_REF: parseInt(referal) || 0,
            USER_REG_DATE: date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
          }

          if(usr_obj){
            if(usr_obj.USER_NAME == null || usr_obj.USER_NAME.length == 0 || usr_obj.USER_NAME == 'undefined'){
              bot.sendMessage(usr_obj.TG_ID, '<b>❌Чтобы зарегистрироваться Установите UserName в настройках Аккаунта</b>', {parse_mode: 'html'});
            }else{
              connection.query('INSERT INTO users SET ?', usr_obj, function(err,res){
                if(err) throw err;
                bot.sendMessage(msg.from.id,`
✅<b>Вы успешно Зарегистрированы.</b>

<b>‼️Внимание Для Активации Бонуса перейдите в раздел баланс > Бонус, и активируйте его.</b>

<b>Наши Ресурсы:</b>
<b>🔰Оффициальный Паблик - </b> <a href="https://t.me/happycash_official">Тут</a>  
<b>📝Лента Отзывов и Выводов Пользователей</b> - <a href="https://t.me/happycash_many">Тут</a>
<b>👨‍👨‍👦‍👦Группа для Общения</b> - <a href="https://t.me/happycash_group">Тут</a> 


                `, {parse_mode: "html"}); // Оповещание о Регистрации
                var nowTime = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + ' | ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
                let fileContent = fs.readFileSync("logs/users_reg.txt", "utf8");

                console.log('\x1b[42m'+ nowTime +' \x1b[0m' +' '+ '\x1b[43m \x1b[30mПользователь ' + msg.from.username + '(' + msg.from.id + ')' + ' Успешно Зарегистрирован | Реферал: ' + (referal | 'Отсутствует')  + '\x1b[0m');
                fs.writeFileSync("logs/users_reg.txt", fileContent + '\n' + nowTime + ' ' + 'Пользователь ' + msg.from.username + '(' + msg.from.id + ')' + 'Успешно Зарегистрирован' + (referal | 'Отсутствует'));

                initMainMenu(msg);// Выводим Главное Меню
              });
            }
          }

        }else{
          initMainMenu(msg);
        }
      });
}

function initMainMenu(msg){
  // MODE = 'PLAY_MODE';
  SESSION.setMode('PLAY_MODE', msg.from);

  bot.sendMessage(msg.chat.id, " *Главное Меню* ",{
    "reply_markup":{
      "keyboard": [["🕹Играть"],["💰Баланс","📝Правила"],["❔Как играть","🎁Конкурсы"], ["🔝Топы","📭Контакты"]]
    },
    "parse_mode": 'Markdown'
  });
}

function showBalance(msg){

  // Проверка балланса
  connection.query('SELECT * FROM users WHERE TG_ID = ?', Number(msg.chat.id), function(error, result, field){
    if(error) throw error;
    else{
      if(result.length > 0){
        if(result[0]){
          var balance = Number(result[0].USER_BALANCE);
          bot.sendMessage(msg.chat.id, "💰<b>Ваш Баланс: </b> "+ balance.toFixed(2) +" руб.", {
            "reply_markup": {
              "keyboard": [["💳Пополнить","💳Пополнить(UZCARD)"], ["✏️Ввести промокод"], ["📤Вывод", "📊Последние Выплаты"], ["👥Мои Рефералы", "💰Бонус"], ["Меню"]]
            },
            "parse_mode": 'html'
          })

        }
      }
    }

  });
}

function showGame(msg){

  // MODE = 'PLAY_MODE'; // Изменяем событие на игровое.
  SESSION.setMode('PLAY_MODE', msg.from);


  // Делаем Запрос в Базу Данных
  connection.query('SELECT * FROM users WHERE TG_ID = ?', Number(msg.chat.id),function(error, result, field){
    if(error) throw error;
    else{
      if(result.length > 0){
        if(result[0]){


          var result = result[0];


          var sum    = result.USER_DEFAULT_SUM || 1;  // Сумма ставки и сумма по умолчанию
          var chance = result.USER_DEFAULT_CHANCE || 80; // Размер шанса и шанс  по умолчанию

          var calc = sum * (100 / chance);

          var message = `
👤<b>Ник:</b>  `+ msg.chat.first_name +` (@`+ msg.chat.username+`)
💰<b>Балланс:</b> `+ parseFloat(result.USER_BALANCE).toFixed(2) +` руб.

=====================
💶 <b>Ставка:</b> `+ parseFloat(sum).toFixed(2) +` руб.
📈 <b>Шанс выигрыша:</b> `+ chance +`

💷 <b>Возможный Выигрыш:</b> `+ calc.toFixed(2) +` руб

🔸<b>М:</b> 0 - ` + Number(chance * 10000 - 1) + `
🔹<b>Б:</b>  ` + Number(1000000 - (chance * 10000)) + ` - 999999
          `;

          bot.sendMessage(msg.chat.id, message,{
            reply_markup: JSON.stringify({
              "inline_keyboard": [
                [{text: "🔸Меньше", callback_data: 'Меньше'},{text: "🔹Больше", callback_data: 'Больше'}],
                [{text: "🕹Игровое Меню", callback_data: 'Игровое Меню'}]
              ]
            }),
            parse_mode: 'html'
          });
        }

      }
    }
  });
}

function Play(msg, user){
  SESSION.setMode('PLAY_MODE', msg.from);
  if(msg){
    var rand = 0;                       // Генерируем случайное число
                                        // От 0 До Милиона

    if(CUT_GAMES_BOOL){
      if(msg.data == 'Меньше'){               // Генерируем случайное число
         rand = getRandomInt(899999,999999)   // От 0 До Милиона   
      }else{
         rand = getRandomInt(0,99999);
      }
    }else{
      rand = getRandomInt(0,1000000);
    }

    var user = user[0];                 // Переобразовываем Массив

    var calc = (user.USER_DEFAULT_SUM) * (100 / user.USER_DEFAULT_CHANCE);
    var DEF_BALANCE = Number(user.USER_DEFAULT_SUM);


    if(msg.data == 'Меньше' && (rand >= 0 && rand <= (Number(user.USER_DEFAULT_CHANCE) * 10000) - 1)){
       // MODE = 'PLAY_MODE';
       SESSION.setMode('PLAY_MODE', msg.from);
       insertGame(msg.message.chat.id, msg.message.chat.username,'Победа',DEF_BALANCE.toFixed(2),rand,calc.toFixed(2));

       bot.answerCallbackQuery(msg.id,'Победа, число: ' + rand , false);
       setBalance(calc.toFixed(2), user, true);


       bot.editMessageText(`
<b>Статус: </b> ✅Победа
<b>Выпавшее Число: </b>`+ rand +`
<b>Ставка: </b>`+ DEF_BALANCE.toFixed(2) +` руб.
<b>Выигрыш: </b>`+ calc.toFixed(2) +` руб.
`
          ,{chat_id: msg.message.chat.id, message_id: msg.message.message_id, parse_mode: "html" });

       statusLog('Пользователь ' + msg.message.chat.username + ' | ', 'Выиграл(а) | Сумма: ' + calc.toFixed(2), '\x1b[45m');
    }else if(msg.data == 'Больше' && (rand <= 999999 && rand >= (1000000 - (Number(user.USER_DEFAULT_CHANCE) * 10000) - 1))){
       // MODE = 'PLAY_MODE';
       SESSION.setMode('PLAY_MODE', msg.from);
       insertGame(msg.message.chat.id, msg.message.chat.username,'Победа',DEF_BALANCE.toFixed(2),rand,calc.toFixed(2));

       bot.answerCallbackQuery(msg.id,'Победа, число: ' + rand , false);

       setBalance(calc.toFixed(2), user, true);

       bot.editMessageText(`
<b>Статус: </b> ✅Победа
<b>Выпавшее Число: </b>`+ rand +`
<b>Ставка: </b>`+ DEF_BALANCE.toFixed(2) +` руб.
<b>Выигрыш: </b>`+ calc.toFixed(2) +` руб.
`
          ,{chat_id: msg.message.chat.id, message_id: msg.message.message_id, parse_mode: "html" });

       statusLog('Пользователь ' + msg.message.chat.username + ' | ', 'Выиграл(а) | Сумма: ' + calc.toFixed(2), '\x1b[45m');

    }else{
      insertGame(msg.message.chat.id,msg.message.chat.username,'Проигрыш',DEF_BALANCE.toFixed(2),rand);
      bot.answerCallbackQuery(msg.id, "Проигрыш, число: " + rand, false);
      setBalance(DEF_BALANCE.toFixed(2),user);

      bot.editMessageText(`
<b>Статус:</b> ❌Проигрыш
<b>Выпавшее Число: </b>`+ rand +`
<b>Ставка: </b>`+ DEF_BALANCE.toFixed(2) +` руб.
`
          ,{chat_id: msg.message.chat.id, message_id: msg.message.message_id, parse_mode: "html" });



      statusLog('Пользователь ' + msg.message.chat.username + ' | ', 'Проиграл(а) | Сумма: ' + DEF_BALANCE.toFixed(2), '\x1b[41m');
    }

    showGame(msg.message);


  }
}


function getRandomInt(min,max){
  var rand = min - 0.5 + Math.random() * (max - min + 1)
  rand = Math.round(rand);
  return rand;
}


function setBalance(summ,db_res, query){


  var summ = Number(summ);
  var USER_BALANCE = Number(db_res.USER_BALANCE);
  var USER_DEFAULT_SUM = Number(db_res.USER_DEFAULT_SUM);


  var WIN  = (USER_BALANCE.toFixed(2) - USER_DEFAULT_SUM.toFixed(2)) + summ;
  var LOST = USER_BALANCE.toFixed(2) - summ;


  // console.log(`
  // `+ summ +`, `+ USER_BALANCE +`, `+ USER_DEFAULT_SUM +`
  //   `);

  if(query == true){
    connection.query('UPDATE users SET ? WHERE TG_ID = ?', [{USER_BALANCE: WIN.toFixed(2)}, db_res.TG_ID], function(err, res){
      if(err) throw err;
    });
  }else{
    connection.query('UPDATE users SET ? WHERE TG_ID = ?', [{USER_BALANCE: LOST.toFixed(2)}, db_res.TG_ID], function(err, res){
      if(err) throw err;
    });
  }
}

function insertGame(UserID,UserName,GameStatus,Rate,GameNumber,Win){

  var obj = {
    USER_ID: UserID,
    USER_NAME: UserName,
    STATUS: GameStatus,
    RATE: Rate,
    GAME_NUMBER: GameNumber,
    WIN: Win || 0,
    DATE: date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
  }

  if(obj){
    connection.query('INSERT INTO game_list SET ?', obj, function(err,res){
      if(err) throw err;
    });
  }

}


function showAdminInfo(msg){


  var TOTAL_USERS         = 0,   // Кол-во Пользователей в Базе Данных,
      REG_TODAY           = 0,   // Пользователи зарегистрированные сегодня,
      IS_BANNED           = 0,   // Пользователи которые были заблокированны,
      PROFIT_SL           = 0,   // Общаяя прибыль с момента запуска
      PROFIT_TODAY        = 0,   // Дневная Прибыль
      CONCLUSION          = 0,   // Деньги на выводе
      TODAY_CONCLUSION    = 0,   // Деньги на выводе которые поставленны сегодня
      TOTAL_CONCLUSSION   = 0,   // Общая сумма которая выведенна
      TOTAL_REPLANISHMENT = 0,   // Общая сумма которая пополнена кошельками,
      TOTAL_GAMES         = 0,   // Кол-во сыгранных игр за весь периуд, с момента запуска,
      TOTAL_TODAY_PLAYED  = 0,   // Кол-во сыгранных игр сегодня
      date                = new Date();


      connection.query('SELECT * FROM users', function(err,res){
        if(err) throw err;
        else{
          if(res.length > 0){
            TOTAL_USERS = res.length;
            for(var i = 0; i <= res.length - 1; i++){
              if(res[i].USER_REG_DATE == now){
                REG_TODAY++;
              }else if(res[i].IS_BAN == 'true'){
                IS_BANNED++;
              }
            }

            connection.query('SELECT * FROM conclusion', function(err,res){
              if(err) throw err;
              else{
                if(res.length > 0){
                  for(var i = 0; i <= res.length - 1; i++){
                    if(res[i].SUCCESS == 1){
                      TOTAL_CONCLUSSION = TOTAL_CONCLUSSION + Number(res[i].SUM);
                    }
                    else{
                      CONCLUSION = CONCLUSION + Number(res[i].SUM);
                    }


                    if(res[i].DATE == now){
                      TODAY_CONCLUSION = TODAY_CONCLUSION + Number(res[i].SUM)
                    }
                  }
                }

                connection.query('SELECT * FROM replenishment', function(err,res){
                  if(res.length >= 0){

                    var TODAY_REPL  = 0;

                    for(var i = 0; i <= res.length - 1; i++){
                      TOTAL_REPLANISHMENT = TOTAL_REPLANISHMENT + Number(res[i].SUM);
                      if(res[i].DATE == now){
                        TODAY_REPL = TODAY_REPL + Number(res[i].SUM);
                      }
                    }

                    PROFIT_TODAY = TODAY_REPL - TODAY_CONCLUSION;
                  }
                PROFIT_SL = TOTAL_REPLANISHMENT - TOTAL_CONCLUSSION - CONCLUSION.toFixed(2);




                  connection.query('SELECT * FROM game_list', function(err,res){
                    if(res.length >= 0){
                      TOTAL_GAMES = res.length;

                      for(var i = 0; i <= res.length - 1; i++){
                        if(res[i].DATE == now){
                          TOTAL_TODAY_PLAYED++
                        }
                      }

                      var message = `
🖐<b>Добро Пожаловать</b> `+ msg.from.username +`
❇️<b>Вы успешно авторизовались в Админ Панели</b>

🔺🔺🔺🔺 <b>S T A T I S T I C S</b>  🔺🔺🔺🔺

🔸<b>Всего Пользователей:</b> ` + TOTAL_USERS + `
🔹<b>Зарегистрированно Сегодня:</b> ` + REG_TODAY + `
🚫<b>Заблокированных:</b> ` + IS_BANNED + `

💎<b>Прибыль с Запуска:</b> `+ PROFIT_SL.toFixed(2) +` руб.
💶<b>Дневная Прибыль:</b> ` + PROFIT_TODAY.toFixed(2) + ` руб.
💳<b>На выводе:</b> ` + CONCLUSION.toFixed(2) + ` руб.

🕹<b>Всего сыгранно игр:</b> ` + TOTAL_GAMES + `
🔰<b>За сегодня:</b> ` + TOTAL_TODAY_PLAYED +  `

📟<b>RAM: </b> `+ parseInt( ((os.totalmem() / 1024) / 1024) - ((os.freemem() / 1024) / 1024) ).toFixed() +` / `+ parseInt((os.totalmem() / 1024) / 1024).toFixed() +`

🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺
                      `;

                      bot.sendMessage(msg.from.id, message, {parse_mode: 'html', reply_markup: {
                        "inline_keyboard": [
                          [{text: "🙍🏻‍♂️Пользователи", callback_data: 'A_USERS'},{text: "🚫Заблокированные", callback_data: 'A_USERS_BANNED'}],
                          [{text: "📝Выплаты", callback_data: 'A_CONCLUSION'},{text: "🔰Топ Богатых", callback_data: "A_TOP_RICH"}],
                          [{text: "✏️Написать Всем", callback_data: 'A_SEND_MESSAGE_TO_ALL'}, {text: '🎁Прококоды', callback_data: 'A_PROMO_CODE'}]
                        ]
                      }});
                    }
                  });
                });
              }
            });
          }
        }
      });
}


function giveEverydayCompBonus(data,percent){

	var x = (data.SUM / 100) * percent;
	console.log(x);
	if(x){
		connection.query('SELECT * FROM users WHERE TG_ID = ?', data.TG_ID, function(err,res){
			if(err) throw err;
			else{
				if(res.length > 0){
					var sort_2 = dynamicSort(res, 'USER_BALANCE');
					if(sort_2){

						var s = sort_2[0].USER_BALANCE + x;
						    s = parseFloat(Number(s)).toFixed(2);

					if(s){
						connection.query('UPDATE users SET ? WHERE TG_ID = ?', [{USER_BALANCE: s}, sort_2[0].TG_ID], function(err,res){
							if(err) throw err;
							else{
								bot.sendMessage(sort_2[0].TG_ID, '<b>✅Вы получили Бонус с участия в конкурсе, +'+parseFloat(x).toFixed(2)+' руб.</b>', {parse_mode: 'html'});

								console.log(sort_2[0].USER_NAME + ' | ' + x + ' | ' + percent);
							}
						});
					}
					}


				}
			}
		});	
	}
}

function getBonus(msg){
  connection.query('SELECT * FROM users WHERE TG_ID = ?', msg.from.id, function(err,res){
    if(err) throw err;
    else{
      if(res.length > 0){
        if(res[0].LAST_BONUS_DATE == now){
          bot.sendMessage(msg.from.id, '<b>Вы уже получали бонус сегодня</b>', {parse_mode: 'html'});
        }else{
          bot.sendMessage(msg.from.id, `
<b>‼️Бонус выдается 1 Раз в сутки.

💰Размер Бонуса: 1-2 руб.</b>
            `, { reply_markup: {
              inline_keyboard:[
              [{text: '💷Получить Бонус', callback_data: 'GET_BONUS-' + msg.from.id + '-' + res[0].USER_BALANCE}]
              ]
            }, parse_mode: 'html'});
        }
      }
    }
  });
}


function CUT_GAMES(msg){
  CUT_GAMES_BOOL = !CUT_GAMES_BOOL;
  if(CUT_GAMES_BOOL == false){
    bot.sendMessage(msg.from.id, 'Комманда Отключенна');
  }else{
    bot.sendMessage(msg.from.id, 'Комманда Включена');
  }
}


function dynamicSort(obj,prop){
  if(obj.length > 0){
    var newSortObject = [];
    for(var i = 0; i <= obj.length - 1; i++){
      obj[i][prop] = parseFloat(obj[i][prop]);

      if(i == obj.length - 1){
        obj.sort(function(a,b){
          return a[prop] - b[prop];
        });

        for(var i = obj.length - 1; i >= 0; i--){
          newSortObject.push(obj[i]);

          if(i == 0){
 
            return newSortObject; 
          }
        }
      }
    }
  }else{
    return console.log('ОШИБКА, МАССИВ ОБЪЕКТА ПУСТОЙ');
  }
}

function log(text){
  var nowTime = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + ' | ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  let fileContent = fs.readFileSync("logs/log.txt", "utf8");

  console.log('\x1b[42m'+ nowTime +' \x1b[0m' +' '+ text + '\x1b[0m');
  fs.writeFileSync("logs/log.txt", fileContent + '\n' + nowTime + ' ' +text);
}

function statusLog(content, status, color){
  var nowTime = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + ' | ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  let fileContent = fs.readFileSync("logs/log.txt", "utf8");

  console.log('\x1b[42m'+ nowTime +' \x1b[0m' +' '+ content + color + ' ' +status + '\x1b[0m');
  fs.writeFileSync("logs/log.txt", fileContent + '\n' + nowTime + ' ' + content + ' ' + status);
}



//////////////////  E N D - S C R I P T  ///////////////////



app.get('/happycash/bot/payments', function(req,res){
  var MERCHANT_ID       = req.query.MERCHANT_ID,          // ID Вашего магазина
      AMOUNT            = req.query.AMOUNT,               // Сумма заказа
      intid             = req.query.intid,                // Номер операции Free-Kassa
      MERCHANT_ORDER_ID = req.query.MERCHANT_ORDER_ID,    // Ваш номер заказа
      P_EMAIL           = req.query.P_EMAIL,              // Email плательщика
      SIGN              = req.query.SIGN,                 // Подпись
      us_bot            = req.query.us_bot;


    connection.query('SELECT * FROM users WHERE SIGNATURE_2 = ?', req.query.SIGN, function(err,result){
      if(err) throw err;
      else{
        if(result.length > 0){
          if(Number(result[0].TG_ID) == Number(MERCHANT_ORDER_ID) && MERCHANT_ID == cfg.FREE_KASSA.store_id && SIGN == result[0].SIGNATURE_2){

            var CURRENT_BALANCE = Number(result[0].USER_BALANCE)
            var SUMM            = Number(AMOUNT);
            var USER_TOTAL_RECHARGE = Number(result[0].USER_TOTAL_RECHARGE);

            var procent =  0; //(SUMM.toFixed(2) / 100) * 10;

            var r = parseFloat( Number(CURRENT_BALANCE.toFixed(2)) + Number(SUMM.toFixed(2)) + Number(procent.toFixed(2))).toFixed(2);
            var UTR = Number(USER_TOTAL_RECHARGE.toFixed(2)) + Number(SUMM.toFixed(2));

            if(r){
             connection.query('UPDATE users SET ? WHERE TG_ID = ?',[{USER_BALANCE: r, SIGNATURE: '', SIGNATURE_2: '', USER_TOTAL_RECHARGE: UTR}, Number(result[0].TG_ID)], function(err,res){
              if(err) throw err;
              else{


                var obj = {
                  USER_ID: result[0].TG_ID,
                  USER_NAME: result[0].USER_NAME,
                  USER_EMAIL: P_EMAIL,
                  SUM: parseFloat(AMOUNT).toFixed(2),
                  SUCCESS: 'true',
                  intid: intid,
                  DATE: now

                }

                connection.query('INSERT INTO replenishment SET ?', obj, function(err,res){
                  if(err) throw err;
                  else{
                    bot.sendMessage(Number(result[0].TG_ID), '<b>✅Ваш баланс пополнен на: ' + SUMM +' руб. </b>', {parse_mode: 'html'});
                    connection.query('SELECT * FROM comp_repl WHERE TG_ID = ?', Number(result[0].TG_ID), function(err,res){
                    	if(err) throw err;
                    	else{
                    		var obj = {
                    			TG_ID: result[0].TG_ID,
                    			USER_NAME: result[0].USER_NAME,
                    			SUM: parseFloat(AMOUNT).toFixed(2)
                    		}
                    		if(res.length > 0){
                    			// Если есть Обновить
                    			obj.SUM = Number(parseFloat(AMOUNT).toFixed(2)) + Number(parseFloat(res[0].SUM).toFixed(2));
                    			connection.query('UPDATE comp_repl SET ? WHERE TG_ID = ?', [obj,Number(result[0].TG_ID)], function(err,res){
                    				if(err) throw err;
                    				// Запись Обновленна..
                    			});
                    		}else{
                    			// Иначе просто Добавить

                    			connection.query('INSERT INTO comp_repl SET ?', obj, function(err,res){
                    				if(err) throw err;
                    				// Запись Добавлена
                    			});
                    		}
                    	}
                    });

                    if(result[0].USER_REF.length > 0){
                      connection.query('SELECT * FROM users WHERE TG_ID = ?', Number(result[0].USER_REF), function(err,res) {
                        if(res.length > 0){
                          var CURRENT_BALANCE = Number(res[0].USER_BALANCE);
                          var addition = Number(SUMM.toFixed(2)) + Number(CURRENT_BALANCE.toFixed(2));

                          if(addition){
                            connection.query('UPDATE users SET ? WHERE TG_ID = ?', [{USER_BALANCE: addition}, res[0].TG_ID], function(err,res){
                              if(err) throw err;
                              else{
                                /*  ...  */
                                // console.log('\x1b[42m'+ nowTime +' \x1b[0m' +' '+ '\x1b[44m \x1b[30mПользователь ' + msg.from.username + '(' + msg.from.id + ')' + ' Пополнил Баланс: +' + SUMM +'\x1b[0m');
                              }
                            });
                          }
                        }
                      });
                    }
                  }
                })
              }
             });

            }

            // localhost:3000/happycash/bot/payments?MERCHANT_ID=141307&AMOUNT=400&intid=239823355&MERCHANT_ORDER_ID=239823355&P_EMAIL=edwardshumkov@gmail.com&SIGN=c476e5364422b866d68c59b75badbbb5&us_bot=happycash_bot
          }else{
            console.log('Попытка мошшеничества');
          }
        }
      }
    });

});



app.listen(3000);



///////////////////////////////////////////////////////////



/*

SECRET_1: hes27zuk
SECRET_2: xw25s6bh


ПОДПИСЬ
"ID Вашего магазина:Сумма платежа:Секретное слово 2:Номер заказа"


MERCHANT_ID         - ID Вашего магазина
AMOUNT              - Сумма заказа
intid               - Номер операции Free-Kassa
MERCHANT_ORDER_ID   - Ваш номер заказа
P_EMAIL             - Email плательщика
P_PHONE             - Телефон плательщика (если указан)
CUR_ID              - ID электронной валюты, который был оплачен заказ (список валют)
SIGN                - Подпись (методика формирования подписи в данных оповещения)
us_key              - Дополнительные параметры с префиксом us_, переданные в форму оплаты


141307:1:hes27zuk:xw25s6bh:

*/
