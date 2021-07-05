const RedmineActiveProjects = require('./activeProjectsInRedmine');
const RedmineIssues = require('./redmineIssues');
const IssueUsersModel = require('../issue_users/model');
const KanbanIssuesModel = require('../kanban_issue/model');

const deleteIssuesFromKanban = async (issue) => {
  const deleteFilter = {
      where: {
          issue_id: issue.id,
      }
  };
  await KanbanIssuesModel.destroy(deleteFilter)
}

const checkIssueStatusInKanban = async (issue) => {

  const kanban_statuses =  [
      {id:1, redmine_status_id:8, title: "Zaplanowane"},
      {id:7, redmine_status_id:9, title: "Potwierdzone"},
      {id:2, redmine_status_id:2, title:"Na wykonaniu"},
      {id:4, redmine_status_id:7, title:"Zawieszone"},
      {id:3, redmine_status_id:3, title:"Sprawdzenie"},
      {id:6, redmine_status_id:6, title:"Klient"},
      {id:5, redmine_status_id:5, title:"Do poprawy"}
    ]
    
  const issue_kanban_status = kanban_statuses.find(status => status.redmine_status_id === issue.status.id);

  const issueUsersFilter = {
    where: {
      issue_id:issue.id,
      user_type: 3,
    }
  };
  const issue_users = await IssueUsersModel.findAll(issueUsersFilter);
  if (issue_users.length > 0) {
    for await (let issue_user of issue_users) {    

      const kanbanIssuesFilter = {
        where: {
          issue_id: issue.id,
          executor_id: issue_user.user_id,
        }
      };

      const kanban_issues = await KanbanIssuesModel.findAll(kanbanIssuesFilter);
      if (kanban_issues.length > 0) {
        for await (let kanban_issue of kanban_issues) {      
          if (kanban_issue.kanban_status_id != issue_kanban_status.id) {
            const updateContent = {
              kanban_status_id: issue_kanban_status.id
            };
            await kanban_issue.update(updateContent).catch((err) =>{
                console.log(err);
                res.status(400).send('Kanban issue is not updated');
            });
          }
        }
      } else {
        const addData = {
          project_id: issue.project.id,
          project_name: issue.project.name,
          kanban_status_id: issue_kanban_status.id,
          executor_id: issue_user.user_id,
          executor_name: issue_user.user_name,
          issue_id: issue.id,
          issue_name: issue.subject,
        };
        const newKanbanIssue = await KanbanIssuesModel.create(addData);
      }
    }
  } else {
    if (issue.assigned_to) {
      const IssueUsersAddData = {
        issue_id: issue.id,
        user_id: issue.assigned_to.id,
        user_name: issue.assigned_to.name,
        user_type: 3
      };
      const newIssueUser = await IssueUsersModel.create(IssueUsersAddData);
      if (issue_kanban_status.id!=1) {
        const KanbanAddData = {
          project_id: issue.project.id,
          project_name: issue.project.name,
          kanban_status_id: issue_kanban_status.id,
          executor_id: issue.assigned_to.id,
          executor_name: issue.assigned_to.name,
          issue_id: issue.id,
          issue_name: issue.subject,
        };
        const newKanbanIssue = await KanbanIssuesModel.create(KanbanAddData);
      }
    }
  }
};

const isActiveProject = (project) => {
  let isActiveRes = false;
  const findRes = project.custom_fields.find((element) => {
    if (element.id === 21 && element.value === 'PL') {
      isActiveRes = true;
    } 
  });
  return isActiveRes;
};

module.exports = async () => {

    const redmineQueryParams = {
    };

    let projectsArray = [];

    const response = await RedmineActiveProjects(redmineQueryParams);
    projectsArray.push(response.projects);

    let iterationsNumber = response.total_count / response.limit;
    iterationsNumber = Math.ceil(iterationsNumber) - 1;
    for (let i = 1; i <= iterationsNumber; i++) {
      const nextParams = {
        offset: i * response.limit,
      };
      const nextResponse = await RedmineActiveProjects(nextParams);
      projectsArray.push(nextResponse.projects);
    }
  
  const activeProjectsArray = [];
  projectsArray.forEach(iterationRecord => {
    iterationRecord.forEach(project => {
      if (isActiveProject(project)===true) {
        activeProjectsArray.push(project);
      }
    })    
  })

  if (activeProjectsArray) {
    for await (let project of activeProjectsArray) {
      const redmineQueryParams = {
        project_id: project.id,
        include: 'journals',
        status_id: 'open',
      };

      let tasksArray = [];
      const response = await RedmineIssues(redmineQueryParams);
      tasksArray.push(response.issues);

      let iterationsNumber = response.total_count / response.limit;
      iterationsNumber = Math.ceil(iterationsNumber) - 1;
      for (let i = 1; i <= iterationsNumber; i++) {
        const nextParams = {
          project_id: project.id,
          offset: i * response.limit,
          include: 'journals',
          status_id: 'open',
        };
        const nextResponse = await RedmineIssues(nextParams);
        tasksArray.push(nextResponse.issues);
      }
   
      if (tasksArray.length>0) {
        for await (let arrayItem of tasksArray) {
          for await (let issue of arrayItem) {
            if (issue.status) {
              if (issue.status.id != 1) {
                await checkIssueStatusInKanban(issue);
              } else {
                await deleteIssuesFromKanban(issue);
              }
            }  
          }
        }
      }

    }
  }

  console.log('Data collection is finnished');

}