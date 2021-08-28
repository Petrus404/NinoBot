"use strict"
let {
    WAConnection: _WAConnection,
    Browser
} = require("@adiwajshing/baileys");
const fs = require("fs-extra")
const figlet = require('figlet')

const simple = require('./lib/simple')
const nino = require("./message/nino");
const {
    color
} = require("./lib/color");

const WAConnection = simple.WAConnection(_WAConnection)
let conn = new WAConnection()
global.conn = conn
global.prefix = '#'
global.session = './nino.json'
global.thumb = fs.readFileSync('./media/Nakano.jpg')

global.ownerNumber = ["62813828362494@s.whatsapp.net","16146548867@s.whatsapp.net","6288286421519@s.whatsapp.net"]

const start = async (session) => {
	conn.logger.level = 'warn'
	console.log(color(figlet.textSync('NinoBot', {
		font: 'Standard',
		horizontalLayout: 'default',
		vertivalLayout: 'default',
		width: 80,
		whitespaceBreak: false
	}), 'cyan'))
	console.log(color('[ CREATED BY NINO ]'))
	conn.browserDescription = ["NINO - BOT", "Firefox", "3.0.0"];

	conn.on('qr', () => {
		console.log(color('[', 'white'), color('!', 'red'), color(']', 'white'), color('Please scan qr code'))
	})
	fs.existsSync(session) && conn.loadAuthInfo(session)
	conn.on('connecting', () => {
		console.log(color('[ SYSTEM ]', 'cyan'), color(' ⏳ Connecting...'));
	})
	conn.on('open', () => {
		console.log(color('[ SYSTEM ]', 'cyan'), color('Bot is now online!'));
	})
	await conn.connect({
		timeoutMs: 30 * 1000
	})
	fs.writeFileSync(session, JSON.stringify(conn.base64EncodedAuthInfo(), null, '\t'))
	
	conn.on('chat-update', async (m) => {
		nino.chatUpdate(conn, m)
	})
}

start(session).catch(console.log)
module.exports = { conn }