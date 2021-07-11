const kanbanData = () => {
  return [
    {
      id: 1,
      redmine_status_id: 8,
      color: '#FDD835',
      title: 'Zaplanowane',
      tasks: [],
    },
    {
      id: 7,
      redmine_status_id: 9,
      color: '#FFE082',
      title: 'Potwierdzone',
      tasks: [],
    },
    {
      id: 2,
      redmine_status_id: 2,
      color: '#00BCD4',
      title: 'Na wykonaniu',
      tasks: [],
    },
    {
      id: 4,
      redmine_status_id: 7,
      color: '#9E9E9E',
      title: 'Zawieszone',
      tasks: [],
    },
    {
      id: 3,
      redmine_status_id: 3,
      color: '#AED581',
      title: 'Sprawdzenie',
      tasks: [],
    },
    {
      id: 6,
      redmine_status_id: 6,
      color: '#8BC34A',
      title: 'Klient',
      tasks: [],
    },
    {
      id: 5,
      redmine_status_id: 5,
      color: '#FFAB91',
      title: 'Do poprawy',
      tasks: [],
    },
  ];
};

const filterProjectsByCountry = (projectsArray) => {
  const val = projectsArray.filter((project) => {
    const findRes = project.custom_fields.find((element) => {
      if (element.id === 21 && element.value === 'PL') {
        return true;
      } else return false;
    });
    if (findRes) {
      return true;
    } else return false;
  });
  return val;
};

const redmineExecutorsList = async (_store) => {
  const executorsDataObject = await _store.dispatch(
    'projects/findRedmineUsers'
  );
  if (executorsDataObject) {
    let executorsData = [];
    executorsDataObject.forEach((str) => {
      str.forEach((el) => {
        const custom_fields = el.custom_fields;
        let isKanbanUser = false;
        custom_fields.forEach((item) => {
          if (
            item.id === 22 &&
            (item.value === 'Programmer' || item.value === 'Consultant')
          ) {
            isKanbanUser = true;
          }
        });
        if (isKanbanUser === true) {
          const userName = el.firstname.concat(' ', el.lastname);
          executorsData.push({
            value: el.id,
            label: userName,
          });
        }
      });
    });
    return executorsData;
  } else {
    return [];
  }
};

export default {
  kanbanData: kanbanData,
  filterProjectsByCountry: filterProjectsByCountry,
  redmineExecutorsList: redmineExecutorsList,
};
