process.env['NTBA_FIX_319'] = 1 as any;

import TelegramBot from 'node-telegram-bot-api';

import { config } from 'dotenv';
import { onText } from './on-text';
import { onDocument } from './on-document';
config();

const isProd = process.env.NODE_ENV === 'production';
let PORT = +process.env.PORT! || 3000;

const botToken = process.env.BOT_TOKEN!;
const herokuUrl = process.env.HEROKU_URL!;

let telegramBot: TelegramBot;
if (isProd) {
	telegramBot = new TelegramBot(botToken, { webHook: { port: PORT } });
	telegramBot.setWebHook(`${herokuUrl}/bot${botToken}`);
}
else {
	telegramBot = new TelegramBot(botToken, { polling: true });
}

telegramBot.on('text', async (msg) => {
	bot.messageRecieved(msg);
	await onText(msg);
});

telegramBot.on('document', async (doc) => {
	bot.messageRecieved(doc);
	await onDocument(doc);
});

class PreReqBot {

	// private userId: number | undefined;
	private chatId: number | undefined;
	private fileId: string | undefined;
	
	messageRecieved = (msg: TelegramBot.Message) => {
		// this.userId = msg.from?.id;
		this.chatId = msg.chat.id;
		this.fileId = msg.document?.file_id;
	}

	sendMessage = (text: string) => {
		if (!this.chatId) {
			throw Error('Chat id not set');
		}
		telegramBot.sendMessage(this.chatId, text);
	}

	getFile = () => {
		if (!this.fileId) {
			throw Error('File id not set');
		}
		return telegramBot.getFile(this.fileId);
	}

}

export const bot = new PreReqBot();

console.log('Prereq started running');