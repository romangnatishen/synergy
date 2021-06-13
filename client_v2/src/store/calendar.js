import requestDataHandler from '../plugins/requestDataHandler';
import axios from 'axios';
// import generalFunctions from '../plugins/generalFunctions';
import hostSettings from '../plugins/hostSettings';

export default {
  state: {},
  mutations: {},
  actions: {
    createEvent(payload, params) {
      const data = requestDataHandler(
        'POST',
        `${hostSettings.DB_HOST}/event`,
        params
      );

      const resEvent = axios(data).catch((err) => {
        console.log(err);
      });

      return resEvent;
      // return axios.post("http://localhost:3000/users", payload);
    },

    async updateEvent({ commit }, payload) {
      const data = requestDataHandler(
        'PUT',
        `${hostSettings.DB_HOST}/event/${payload.params.id}`,
        payload.body
      );
      const resEvent = axios(data).catch((err) => {
        console.log(err);
      });
      return resEvent;
    },

    deleteEvent({ commit }, payload) {
      const data = requestDataHandler(
        'DELETE',
        `${hostSettings.DB_HOST}/event`,
        payload
      );
      const resDelete = axios(data).catch((err) => {
        console.log(err);
      });
      return true;
      // return axios.post("http://localhost:3000/users", payload);
    },

    // 	const allowedProjectMembers = [];
    // 	const allProjects = await dispatch('findAll');
    // 	allProjects.forEach(el => {
    // 	const projectMembers = await dispatch('projectMembers', {id:el.id});
    // 	for  (const project of projectMembers) {
    // 		let curMemberships = project.memberships;
    // 		if (curMemberships) {
    // 			// console.log(curMemberships);
    // 			curMemberships.forEach(cur_member => {
    // 				const curValue = JSON.stringify(cur_member.user);
    // 				let roleClient = false;
    // 				cur_member.roles.forEach(cur_role => {
    // 					if (cur_role.id === 3) {
    // 						roleClient = true;
    // 					}
    // 				})
    // 				if (!roleClient) {
    // 					if (allowedProjectMembers.includes(curValue) === false) {
    // 						allowedProjectMembers.push(curValue);
    // 					}
    // 				}
    // 			})
    // 		}
    // 	}
    // })

    // 		async projectMembers(payload,params) {

    // 			const redmineParams = redmineConnection(this.getters,params);

    // 			const data = requestDataHandler("GET",
    // 			`${hostSettings.DB_HOST}/project_members`,
    // 			redmineParams, redmineParams);
    // 			const response = await axios(data).catch(err => {
    // 				console.log(err);
    // 				return []
    // 			});
    // 			if (typeof response === "object" && response.status === 200) {
    // //			commit("SET_ALL", parsedResponse);
    // 			return response;
    // 			}
    // 			return [];
    // 		},

    // async findAll() {
    // 	let redmineParams = redmineConnection(this.getters);
    // 	const filterProjectsByCountry = generalFunctions.filterProjectsByCountry;

    // 	const data = requestDataHandler("GET",
    // 	`${hostSettings.DB_HOST}/projects`,
    // 	undefined, redmineParams);

    // 	const response = await axios(data);
    // 	if (response.status === 200) {
    // 		let params = {status:1};
    // 		let respArray = [];
    // 		// console.log(response.data.projects);
    // 		respArray.push(filterProjectsByCountry(response.data.projects));
    // 		let iterationsNumber = response.data.total_count / response.data.limit;
    // 		iterationsNumber = Math.ceil(iterationsNumber) - 1;
    // 		for (let i = 1; i <= iterationsNumber; i++) {
    // 			params.offset = i*response.data.limit;
    // 			redmineParams = redmineConnection(this.getters,params);
    // 			let nextData = requestDataHandler("GET",`${hostSettings.DB_HOST}/projects`, undefined, redmineParams);
    // 			const nextResponse = await axios(nextData);
    // 			if (nextResponse.status === 200) {
    // 				respArray.push(filterProjectsByCountry(nextResponse.data.projects));
    // 			}
    // 		}
    // 		return respArray;
    // 	}
    // 	else {
    // 		return []
    // 	}
    // },
  },
  getters: {
    getFilterProject(state) {
      return state.filterProject;
    },
  },
  namespaced: true,
};
