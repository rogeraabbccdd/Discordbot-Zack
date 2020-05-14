require('dotenv').config()

const Discord = require('discord.js')
const rp = require('request-promise')

const client = new Discord.Client()

const rand = async () => {
  let result = {}
  try {
    const data = await rp({ uri: 'https://api.kento520.tw/zack/?rand', json: true })
    result = { success: true, data }
  } catch (error) {
    result = { success: false, data: '發生錯誤' }
  }
  return result
}

const genText = async (text) => {
  let result = ''
  try {
    const data = await rp({ uri: encodeURI('https://asia-northeast1-zack-essay.cloudfunctions.net/convert?q=' + text), json: true })
    result = data.result
  } catch (error) {
    console.log(error.message)
    result = '發生錯誤'
  }
  return result
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', async (msg) => {
  try {
    if (msg.content && !msg.author.bot) {
      if (msg.content === '!zackhelp') {
        msg.react(process.env.LOADING_EMOJI.toString())
        const reply = '• `!zack rand` - 隨機一則財哥語錄\n' +
        '• `!zack randimg` - 隨機一張財哥語錄\n' +
        '• `!zack 句子` - 將輸入的文字轉成財哥體\n' +
        '• 機器人原始碼 https://github.com/rogeraabbccdd/Discordbot-Zack'
        msg.channel.send(reply)
        await msg.reactions.removeAll()
        await msg.react('✅')
      } else if (msg.content === '!zack randimg') {
        msg.react(process.env.LOADING_EMOJI.toString())
        const result = await rand()
        if (result.success) {
          const attachment = new Discord.MessageAttachment(result.data.image)
          msg.channel.send(attachment)
          await msg.reactions.removeAll()
          await msg.react('✅')
        } else {
          msg.channel.send(result.data)
          await msg.reactions.removeAll()
          await msg.react('❌')
        }
      } else if (msg.content === '!zack rand') {
        msg.react(process.env.LOADING_EMOJI.toString())
        const result = await rand()
        msg.channel.send(result.data.link)
        const attachment = new Discord.MessageAttachment(result.data.image)
        msg.channel.send(attachment)
        await msg.reactions.removeAll()
        await msg.react('✅')
      } else if (msg.content.substring(0, 6) === '!zack ') {
        msg.react(process.env.LOADING_EMOJI.toString())
        const text = msg.content.split('!zack ')[1]
        const data = await genText(text)
        msg.channel.send(data)
        await msg.reactions.removeAll()
        await msg.react('✅')
      }
    }
  } catch (error) {
    console.log(error.message)
    await msg.reactions.removeAll()
    await msg.react('❌')
  }
})

client.login(process.env.DISCORD_TOKEN)
