const Model = require('../model');
const sendSlackMessage = require('../../slack/sendMessage');

module.exports = async (params) => {
  
    const comment_data = {
        issue_id: params.issue_id,
        user_id: params.user_id,
        user_name: params.user_name,
        description: params.description,
    };
    
    await Model.create(comment_data).catch((err) =>{
        console.log(err);
    });

    const messageParams = {
        author: params.author,
        link: params.link,
        linkMessage: params.linkMessage,
        message: params.message,
        channel: params.channel,
    };
    await sendSlackMessage(messageParams);
};