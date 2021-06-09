const filterProjectsByCountry = (projectsArray) => {

	const val = projectsArray.filter(
		(project) => {
		const findRes = project.custom_fields.find(
			(element) => {
				if (element.id === 21&&element.value==='PL') {
					return true
				} else return false;						
			}
		)
		if (findRes) {
			return true
		} else return false;
		}
	);
	return val;

}

const redmineExecutorsList = async (_store) => {

    const executorsDataObject = await _store.dispatch("projects/findRedmineUsers");
    if (executorsDataObject) {
      let executorsData = [];
      executorsDataObject.forEach(str => {
        str.forEach(el => {
          const custom_fields = el.custom_fields;
          let isKanbanUser = false;
          custom_fields.forEach(item => {
            if (item.id===22&&(item.value==="Programmer"||item.value==="Consultant")) {
              isKanbanUser = true;
            }
          })
          if (isKanbanUser===true) {
            const userName = el.firstname.concat(" ",el.lastname);
            executorsData.push(
              {              
                value: el.id,
                label: userName,
              },
            )
          }
        })
      });
      return executorsData;
    } else {
      return []
    }
} 

export default {
	filterProjectsByCountry:filterProjectsByCountry,
	redmineExecutorsList:redmineExecutorsList
}

