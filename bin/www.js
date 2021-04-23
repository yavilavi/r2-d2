#!/usr/bin/env node

/**
 * Module dependencies.
 */
require('dotenv').config();

const http = require('http');
http.createServer(function (req, res) {
    res.write('Hello there!'); //write a response to the client
    res.end(); //end the response
}).listen(process.env.PORT || 3000);


const debug = require('debug')('r2-d2:brain');
const Discord = require('discord.js');
const bot = new Discord.Client();
const BOT_TOKEN = process.env.BOT_TOKEN;

const AWS = require("aws-sdk");
AWS.config.update({region: "us-east-1"});

const translate = new AWS.Translate();

bot.on('ready', () => {
    debug(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
    let Text = msg.content;
    if (msg.author.id !== '835049925104369684') {
        if (msg.content === 'ping') {
            msg.reply('pong');
        }else {
            let params = {
                SourceLanguageCode: 'auto',
                TargetLanguageCode: 'en',
                Text
            };
            translate.translateText(params, function (err, data) {
                if (err) console.log(err, err.stack);
                else {
                    if(data.SourceLanguageCode !== 'en'){
                        // console.log(data);
                        msg.channel.send(data.TranslatedText);
                    }
                }
            });
        }
    }
});

bot.login(BOT_TOKEN)
