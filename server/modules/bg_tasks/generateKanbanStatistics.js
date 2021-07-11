const KanbanIssuesModel = require('../kanban_issue/model');
// const RedmineIssues = require('./redmineIssues');

const StatisticsModel = require('../kanban_statistics/model');

module.exports = async () => {
  const stat_date = Date.now();
  const kanban_issues = await KanbanIssuesModel.findAll();
  if (kanban_issues) {
    
    for await (let kanban_issue of kanban_issues) {
      const statisticsItem = {
        project_id: kanban_issue.project_id,
        project_name: kanban_issue.project_name,
        kanban_status_id: kanban_issue.kanban_status_id,
        executor_id:kanban_issue.executor_id,
        executor_name:kanban_issue.executor_name,	
        issue_id:kanban_issue.issue_id,
        issue_name: kanban_issue.issue_name,
        stat_date: stat_date,
      };

      await StatisticsModel.create(statisticsItem).catch((err) =>{
        console.log(err);
        }
      );
    }
    console.log('Data collection is finnished');
  }
}
  // if (foundProjects) {
  //   for await (let project of foundProjects) {
  //     const redmineQueryParams = {
  //       project_id: project.redmine_id,
  //       include: 'journals',
  //       status_id: 'open',
  //     };

  //     let respArray = [];

  //     const response = await RedmineIssues(redmineQueryParams);
  //     respArray.push(response.issues);

  //     let iterationsNumber = response.total_count / response.limit;
  //     iterationsNumber = Math.ceil(iterationsNumber) - 1;
  //     for (let i = 1; i <= iterationsNumber; i++) {
  //       const nextParams = {
  //         project_id: project.redmine_id,
  //         offset: i * response.limit,
  //         include: 'journals',
  //         status_id: 'open',
  //       };
  //       const nextResponse = await RedmineIssues(nextParams);
  //       respArray.push(nextResponse.issues);
  //     }
  //     if (respArray.length>0) {
  //       respArray.forEach(arrayItem=>{
  //         arrayItem.forEach(task=>{
          
  //         const stat_body = {
  //           issue_id: task.id,
  //           stat_date: stat_date,
  //           project: JSON.stringify(task.project),
  //           tracker: JSON.stringify(task.tracker),
  //           status: JSON.stringify(task.status),
  //           priority: JSON.stringify(task.priority),
  //           author: JSON.stringify(task.author),
  //           assigned_to: JSON.stringify(task.assigned_to),            
  //         };
  //         StatisticsModel.create(stat_body).catch((err) =>{
  //             console.log(err);
  //           });
  //         })
  //       })
  //     }
  //   }
  // }