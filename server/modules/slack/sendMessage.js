const Slack = require('slack')
  
module.exports = async (params) => {

    const token = process.env.SLACK_BOT_TOKEN;
    // channel = 'droma_erp';
    // channel = '@U025G55AMT4';
    channel = params.channel;    
    // slackMessage = '<@U025G55AMT4> '+'Task: <https://tasks.axioma.pl/issues/14555|This message *is* a link> '+req.body.description;
    
    slackMessage = params.author +' '+'<'+params.link+'|*'+params.linkMessage+'*> '+params.message;

    const bot = new Slack();
    const result = await bot.chat.postMessage({token, channel, text:slackMessage});
    
    return result;

};