const User = require('../modules/user/model');
const Kanban_issues = require('../modules/kanban_issue/model');
const Kanban_statistics = require('../modules/kanban_statistics/model');

const Kanban_comments = require('../modules/kanban_comment/model');
const Calendar_events = require('../modules/calendar_events/model');
const Calendar_participants = require('../modules/calendar_participants/model');
const Issue_users = require('../modules/issue_users/model');
const Projects = require('../modules/projects/model');

const Redmine_stat = require('../modules/redmine_stat/model');

const Leads = require('../modules/slack/model');

// const Contract = require('../modules/contract/model');

module.exports = async () => {
    
    //  await User.sync({force: true});
    //  await Kanban_issues.sync({force: true});
    // await Kanban_comments.sync({force: true});

    //  await Calendar_events.sync({force: true});
    //  await Calendar_participants.sync({force: true});
    //  await Redmine_stat.sync({force: true});
    //   await Issue_users.sync({force: true});
    // await Projects.sync({force: true});
    // await Kanban_statistics.sync({force: true});

    // await Awizo.sync({force: true});
    // await Client.sync({force: true});
    // await Item.sync({force: true});
    // await Terminal.sync({force: true});
    // await Leads.sync({force: true});

};
