"use strict";
const { MessageType, Mimetype, GroupSettingChange } = require("@adiwajshing/baileys")
const simple = require("../lib/simple.js")
/* Isinya Hasil Copas Semua */
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Jakarta").locale("id");
const { exec } = require("child_process");
const ffmpeg = require('fluent-ffmpeg')
const fetch = require('node-fetch');
const ms = require('parse-ms')
const axios = require("axios")
const fs = require("fs-extra")
const yts = require("yt-search")
const { util } = require('util')

const { getBuffer, getGroupAdmins, getRandom, runtime, pickRandom, clockString, sleep } = require('../lib/simple')
const { color } = require('../lib/color')
let fitur = fs.readJsonSync('./fitur.json')

let a = '```'
let banChats = true
global.playing = {}


module.exports = {
	async chatUpdate(conn, m) {
		try {
		if (!m.hasNewMessage) return conn.setStatus(`Runtime ${clockString(process.uptime())} | Mode: ${banChats ? 'Self Mode' : 'Public Mode'} | ${conn.user.name}`)
		let msg = JSON.parse(JSON.stringify(m)).messages[0]
		if (!msg.message || msg.key && msg.key.remoteJid == 'status@broadcast') return
		msg.message = (Object.keys(msg.message)[0] === 'ephemeralMessage') ? msg.message.ephemeralMessage.message : msg.message
		await simple.smsg(conn, msg)
		const { isBaileys, mentionedJid, chat, fromMe, isGroup, sender, body, quoted, reply, copy, forward, copyNForward, cMod, getQuotedObj } = msg
		if (isBaileys) return
		const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType
		const tanggal = moment.tz('Asia/Jakarta').format('dddd') + ', ' + moment.tz('Asia/Jakarta').format('LL')
		const waktu = moment.tz('Asia/Jakarta').format('a')
		const time = moment.tz('Asia/Jakarta').format('HH:mm:ss z')
		
		const from = msg.key.remoteJid
		const type = Object.keys(msg.message)[0]        
		const command = body.startsWith(prefix) ? body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase() : body
		let budy = msg.message.conversation || msg.message[type].text
		const args = body.trim().split(/ +/).slice(1)
		const q = args.join(' ')
		const isCmd = body.startsWith(prefix) 
        const botNumber = conn.user.jid
		const totalchat = await conn.chats.all()
		const groupMetadata = isGroup ? await conn.groupMetadata(from) : ''
		const groupName = isGroup ? groupMetadata.subject : ''
		const conts = msg.key.fromMe ? conn.user.jid : conn.contacts[sender] || { notify: jid.replace(/@.+/, '') }
        const pushname = msg.key.fromMe ? conn.user.name : conts.notify || conts.vname || conts.name || '-'
            
        const isOwner = ownerNumber.includes(sender)
        const print = function(teks) {
				if (typeof teks !== 'string') teks = require('util').inspect(teks)
				teks = require('util').format(teks)
				return conn.reply(chat, teks, msg)
			}
			let Print = print
			
            if (!isOwner && banChats === true) return
           
			if (msg.message) {
				console.log('>', color('[ MSG ]', 'yellow'), color(time), body, color('dari', 'yellow'), pushname, color('di'), isGroup ? groupName : 'Private Chat')
			}
			
             function monospace(string) {
                 return '```' + string + '```'
        }   
            
           if (body.startsWith('> ')) {
           if (!isOwner) return
				try {
					let evaled = eval(`(async () => { ${q} })()`)
					if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
					conn.reply(chat, evaled, msg)
				} catch (e) {
					console.log(e)
					let err = String(e)
					let js = JSON.stringify(e, null, 2)
					if (js == '{}') js = { err }
					js = JSON.stringify(js, null, 2)
					js = '```' + js + '```'
					conn.reply(chat, '_' + err + '_\n\n' + js, msg)
				}
		    } else if (body.startsWith('$ ')) {
				reply('Executing...')
				let cp = require('child_process')
				let exec = require('util').promisify(cp.exec).bind(cp)
				let o
				try {
					o = await exec(q)
				} catch (e) {
					o = e
				} finally {
					let { stdout, stderr } = o
					if (stdout) reply(stdout)
					if (stderr) reply(stderr)
			   }
			} else if (body.startsWith('>> ')) {
				try {
					let evaled = await eval(q)
					if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
					reply(String(evaled))
				} catch (e) {
					console.log(e)
					reply(String(e))
				}
			}
	       if (isGroup && type == 'viewOnceMessage'){
				let message = { ...msg }
				message.message = msg.message.viewOnceMessage.message
				message.message[Object.keys(message.message)[0]].viewOnce = false
				conn.reply(chat, 'ViewOnce detected!', msg).then(() => conn.forwardMessage(chat, message))
			}
            if ((sender in playing) && quoted && quoted.fromMe && quoted.isBaileys && budy && /reply chat ini/i.test(quoted.text)) {
				let { videos } = await yts(budy)
				let res = await axios.get('https://api.zeks.xyz/api/ytplaymp3/2?apikey=Nyarlathotep&q=' + budy)
				reply('Playing ' + res.data.result.title + '...')
				let thumbnail = await simple.getBuffer(res.data.result.thumb)
				conn.sendMessage(chat, { degreesLatitude: '', degreesLongitude: '', name: res.data.result.title, address: 'Duration ' + res.data.result.duration + '\nSize ' + res.data.result.size, url: res.data.result.link, jpegThumbnail: thumbnail }, 'locationMessage', { quoted: msg })
				conn.sendMessage(chat, { url: res.data.result.link }, 'audioMessage', { mimetype: 'audio/mp4', quoted: msg, contextInfo: { externalAdReply: { title: res.data.result.title, body: videos[0].description, mediaType: 2, thumbnailUrl: res.data.result.thumb, mediaUrl: res.data.result.source }}})
				delete playing[sender]
			 }
		    
                  switch(command){

//------------------< Fitur >-------------------
           case 'addfitur': case 'addmenu': {
			   if (!isOwner || !q) return
			   if (fitur.includes(q)) return conn.reply('Fitur tersebut sudah ada di menu', msg)
			   fitur.push(q.toLowerCase())
				   fs.writeFileSync('./fitur.json', JSON.stringify(fitur))
				   conn.reply(chat, `Sukses, fitur ${q} telah ditambahkan ke *menu*\nTotal Fitur : ${fitur.length}`, msg)
			   }
			   break
		   case 'delfitur': case 'delmenu': {
			   if (!isOwner || !q) return
			   if (fitur.includes(q.toLowerCase())) {
		           try {
			           fitur.splice(fitur.indexOf(q), 1)
					   fs.writeFileSync('./fitur.json', JSON.stringify(fitur))
					   conn.reply(chat, `Succes delete fitur ${q}`, msg)
				} catch (err) {
					   conn.reply(chat, `Gagal delete fitur ${q}`, msg)
					}
					} else {
					   conn.reply(chat, `Fitur dgn nama ${q} tidak ada dalam menu`, msg) 
					}
				}
				break
			case 'help': case 'menu': { 
				 let teks = `Yo @${sender.split('@')[0]} 👋\n\n*Tanggal:* ${tanggal}\n*Waktu:* ${waktu.charAt(0).toUpperCase() + waktu.slice(1)} || ${time}\n*Runtime Bot:* ${clockString(process.uptime())}\n\n`
				 for (let fiture of fitur) {
					teks += (monospace(`• ${prefix+fiture}\n`))
			    }
			        let tod = fs.readFileSync('./media/Nakano.jpg')
                    conn.sendMessage(chat, { contentText: `${teks}`, footerText: 'NinoBot', buttons: [{ buttonId: `${prefix}creator`, buttonText: { displayText: 'CREATOR' }, type: 1 },{ buttonId: `${prefix}scbot`, buttonText: { displayText: 'SCRIPT BOT' }, type: 1 }], headerType: 'LOCATION', locationMessage: { degreesLatitude: '', degreesLongitude: '', jpegThumbnail: tod, contextInfo: {mentionedJid: [sender]}}}, 'buttonsMessage')
			   }
			   break
//------------------< Public/Self >-------------------
          case 'public': {
        	  if (!isOwner) return 
              if (banChats === false) return 
                   banChats = false
                   reply(`Success Activated Mode Public`)
              }
              break
	      case 'self': {
              if (!isOwner) return 
              if (banChats === true) return
             	  banChats = true
                   reply(`Success Activated Mode Self`)
              }
              break
//------------------< Search >-------------------
          case 'nhentai': case 'nhentaipdf': case 'nhdl': {
              if (!q) return reply('kodenya?')
              reply('*_Tunggu permintaan anda sedang diproses_*')
              let get_result = await fetchJson(`https://api.lolhuman.xyz/api/nhentai/${q}?apikey=HafzzYourBaka`)
              let ini_image = await getBuffer(get_result.result.image[0])
              let data = await fetchJson(`https://api.lolhuman.xyz/api/nhentaipdf/${q}?apikey=HafzzYourBaka`)
              let pdf = await getBuffer(data.result)
              conn.sendMessage(from, pdf, document, { quoted: msg, mimetype: Mimetype.pdf, filename: `${get_result.result.title_romaji}.pdf`, thumbnail: ini_image })
             }
              break
           case 'nhsearch': case 'nhentaisearch': {
               if (!q) return reply(`Example: ${prefix}nhentaisearch Nakano Nino`)
               reply('*_Tunggu permintaan anda sedang diproses_*')
               let rowsdata = [];
               let res = await axios.get(`https://api.lolhuman.xyz/api/nhentaisearch?apikey=HafzzYourBaka&query=${budy}`)
               for (let i = 0; i < res.data.result.length; i++) {
                  rowsdata.push({ title: res.data.result[i].title_english, rowId: "", description: res.data.result[i].id })
}
                  let listM = conn.prepareMessageFromContent(from, { listMessage: { title: "NHENTAI BOT\n", description: "nHentai search", buttonText: "Click Here", listType: 1, sections: [{ rows: rowsdata }] }}, { quoted: msg })
                  conn.relayWAMessage(listM, { waitForAck: true })
           }
               break
          case 'hentai': {
          	reply('*_Tunggu permintaan anda sedang diproses_*')
              getBuffer(`https://api.lolhuman.xyz/api/random/nsfw/hentai?apikey=HafzzYourBaka`).then((gambar) => {
                 conn.sendMessage(from, gambar, image, { quoted: msg })})
              }
              break
          case 'yts': case 'ytsearch': {
			  if (!q) return reply(`Penggunaan ${command} query`)
			  reply('*_Tunggu permintaan anda sedang diproses_*')
              let { videos } = await yts(q)
			  let length = videos.length < 10 ? videos.length : 10
			  let capt = ``
			  for (let i = 0; i < length; i++) {
					capt += `*${videos[i].title}* (${videos[i].url})\n`
					capt += `*By:* ${videos[i].author.name}\n`
					capt += `*Duration:* ${videos[i].timestamp}\n`
					capt += `*Uploaded:* ${videos[i].ago}\n`
					capt += `=`.repeat(24) + `\n`
				}
			  conn.sendMessage(from, capt.trim(), text, { contextInfo: { externalAdReply: { title: videos[0].title, body: videos[0].description, mediaType: 2, thumbnailUrl: videos[0].image, mediaUrl: videos[0].url }}})
	          }
			  break
          case 'play': {
			   playing[sender] = time
			   if (!q) return reply(`Penggunan: ${prefix + command} judul / link yt / reply chat ini dgn judul`)
			   reply('*_Tunggu permintaan anda sedang diproses_*')
			   let { videos } = await yts(q)
			   axios.get('https://api.zeks.xyz/api/ytplaymp3/2?apikey=Nyarlathotep&q=' + q)
				 .then(async(res) => {
					reply('Playing ' + res.data.result.title + '...')
					let thumbnail = await simple.getBuffer(res.data.result.thumb)
					conn.sendMessage(chat, { degreesLatitude: '', degreesLongitude: '', name: res.data.result.title, address: 'Duration ' + res.data.result.duration + '\nSize ' + res.data.result.size, url: res.data.result.link, jpegThumbnail: thumbnail }, 'locationMessage', { quoted: msg })
					conn.sendMessage(chat, { url: res.data.result.link }, 'audioMessage', { filename: res.data.result.title + '.mp3', mimetype: 'audio/mp4', quoted: msg, contextInfo: { externalAdReply: { title: res.data.result.title, body: videos[0].description, mediaType: 2, thumbnailUrl: res.data.result.thumb, mediaUrl: res.data.result.source }}})
					delete playing[sender]
				  })
				.catch(err => {
				  reply(require('util').format(err))
				})
			}
			   break
		   case 'tiktokdl': case 'tiktok': {
                if (!q) return reply('Linknya?')
                if (!q.includes('tiktok')) return reply('pastikan link nya sudah benar!')
                reply('*_Tunggu permintaan anda sedang diproses_*')
                let data = await fetchJson(`https://api.lolhuman.xyz/api/tiktok?apikey=HafzzYourBaka&url=${args[0]}`)
                let teks = `⚜️ *Nickname*: ${data.result.author.nickname}\n❤️ *Like*: ${data.result.statistic.diggCount}\n💬 *Komentar*: ${data.result.statistic.commentCount}\n🔁 *Share*: ${data.result.statistic.shareCount}\n🎞️ *Views*: ${data.result.statistic.playCount}\n📑 *Desc*: ${data.result.title}`
                let ini_video = await getBuffer(data.result.link)
                conn.sendMessage(from, ini_video, video, { quoted: msg, caption: teks })
              }
                break
		   case 'igdl': case 'instagram': {
               try {
                   if (!q) return reply(`Penggunan: ${prefix + command} link ig`)
                   reply('*_Tunggu permintaan anda sedang diproses_*')
                   let res = await axios.get(`https://api.lolhuman.xyz/api/instagram2?apikey=HafzzYourBaka&url=${args[0]}`)
                   let data = res.data.result
                   for (let i = 0; i < data.media.length; i++) {
                       conn.sendFile(chat, data.media[i], data.caption, '', msg )
}
                } catch (e) {
                   console.log(e)
                   reply(String(e))
                 }
              }
               break
//------------------< NULIS >---------------------
            case 'nulis':
                reply(`*Pilihan*\n${prefix}nuliskiri\n${prefix}nuliskanan\n${prefix}foliokiri\n${prefix}foliokanan`)
                break
            case 'nuliskiri': {
           	 reply('Sabar, Bot sedang Nulis\nBuku kiri')
                let nulis = encodeURIComponent(q)
                let buff = await getBuffer(`http://zekais-api.herokuapp.com/bukukiri?text=${nulis}&apikey=Dg8sQKKG`)
                conn.sendMessage(from, buff, image, { quoted: msg, caption: 'Oke Sudah Selesai ~' })
            }
                break
            case 'nuliskanan': {
           	 reply('Sabar, Bot sedang Nulis\nBuku kanan')
                let nulis = encodeURIComponent(q)
                let buff = await getBuffer(`http://zekais-api.herokuapp.com/bukukanan?text=${nulis}&apikey=Dg8sQKKG`)
                conn.sendMessage(from, buff, image, { quoted: msg, caption: 'Oke Sudah Selesai ~' })
            }
                break
            case 'foliokiri': {
                reply('Sabar, Bot sedang Nulis\nBuku: folio kiri')
            	let nulis = encodeURIComponent(q)
                let buff = await getBuffer(`http://zekais-api.herokuapp.com/foliokiri?text=${nulis}&apikey=Dg8sQKKG`)
                conn.sendMessage(from, buff, image, { quoted: msg, caption: 'Oke Sudah Selesai ~' })
            }
                break
            case 'foliokanan': {
                reply('Sabar, Bot sedang Nulis\nBuku: folio kanan')
                let nulis = encodeURIComponent(q)
                let buff = await getBuffer(`http://zekais-api.herokuapp.com/foliokanan?text=${nulis}&apikey=Dg8sQKKG`)
                conn.sendMessage(from, buff, image, { quoted: msg, caption: 'Oke Sudah Selesai ~' })
            }
                break
//------------------< INFO >-------------------
           case 'owner': case 'creator': {
               conn.sendContact(from, '6288286421519@whatsapp.net', 'Nino', msg)
               .then((res) => conn.sendMessage(from, 'Nih kontak ownerku', text, {quoted: res}))
              }
               break
           case 'setprefix': {
               if (!isOwner) return
               prefix = q
			   reply(`Prefix berhasil diubah menjadi : ${prefix}`)
		      }
               break
          case 'tes': case 'test': {
		       reply('auto upt')
		     }
		       break
		   case 'scbot': {
		       conn.reply(chat, ` *Free Script Bot Wa* :\n\nhttps://github.com/Hexagonz/SELF-HX\n\nhttps://github.com/MhankBarBar/termux-wabot\n\nhttps://github.com/Nino-chan02/NinoBot`, msg)
		       }
		       break
           case 'rvo': case 'readviewonce':
               if (msg.message[Object.keys(msg.message)[0]].contextInfo.quotedMessage.viewOnceMessage) {
	           let message = { ...msg }
	           message.message = message.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessage.message
	           message.message[Object.keys(message.message)[0]].viewOnce = false
	           conn.forwardMessage(from, message)
           } else {
	           reply('Reply chat viewOnce!')
              }
              break
		      default:
		}
		} catch (e) {
            e = String(e)
               if (!e.includes("this.isZero")) {
	           console.log('Message : %s', color(e, 'green'))
			}
         }
      }
   }
/* End */
