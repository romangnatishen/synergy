const Slack = require('slack')
const Model = require('../model');

module.exports = async (req, res) => {
    
    const data = {

        company:req.body.company,
        name:req.body.name,
        telephone:req.body.telephone,
        email:req.body.email,
        comment:req.body.comment,

    };
    
    const project = await Model.create(data).catch((err) =>{
        console.log(err);
        res.status(400).send('Lead is not created');
        });

    // C02Q3C99VUZ
    const token = process.env.SLACK_BOT_TOKEN;
    // channel = 'droma_erp';
    channel = 'C02Q3C99VUZ';
    // channel = params.channel;    
    // slackMessage = '<@U025G55AMT4> '+'Task: <https://tasks.axioma.pl/issues/14555|This message *is* a link> '+req.body.description;
    
    // slackMessage = params.author +' '+'<'+params.link+'|*'+params.linkMessage+'*> '+params.message;

    slackMessage = 'Nowe zgłoszenie ze strony oknoerp.pl Firma:'+data.company +' Imię: '+ data.name+' '+data.telephone+' '+data.email+' Komentarz '+data.comment;

    const bot = new Slack();
    const result = await bot.chat.postMessage({token, channel, text:slackMessage});

    res.status(200).send(project);
};