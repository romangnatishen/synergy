import requestDataHandler from '../plugins/requestDataHandler';
import axios from 'axios';
import redmineConnection from './redmineConnection';
import generalFunctions from '../plugins/generalFunctions';
import hostSettings from '../plugins/hostSettings';

export default {
	state: {
		filterProject:null
	},
	mutations: {
		SET_FILTER_PROJECT(state, filterProject) {
			state.filterProject = filterProject;
		},
	},
	actions: {

		setFilterProject({commit},filterProject) {					
			commit("SET_FILTER_PROJECT", filterProject);
		},

		async findRedmineUsers() {

			let redmineParams = redmineConnection(this.getters);
			const data = requestDataHandler("GET",
			`${hostSettings.DB_HOST}/redmine_users`,						
			undefined, redmineParams);
			
			const response = await axios(data);
			if (response.status === 200) {
				let params = {};
				let respArray = [];				
				// console.log(response.data.projects);
				respArray.push(response.data.users);
				let iterationsNumber = response.data.total_count / response.data.limit;
				iterationsNumber = Math.ceil(iterationsNumber) - 1;
				for (let i = 1; i <= iterationsNumber; i++) {
					params.offset = i*response.data.limit;
					redmineParams = redmineConnection(this.getters,params);
					let nextData = requestDataHandler("GET",
					`${hostSettings.DB_HOST}/redmine_users`,											
					undefined, redmineParams);
					const nextResponse = await axios(nextData);
					if (nextResponse.status === 200) {
						respArray.push(nextResponse.data.users);
					}
				}										
				return respArray;
			} 
			else {
				return []
			}
		},
	
		async projectMembers(payload,params) {
			
			let redmineParams = redmineConnection(this.getters,params);
			redmineParams.offset = 0;
			const data = requestDataHandler("GET",
			`${hostSettings.DB_HOST}/project_members`,														
			redmineParams, redmineParams);

			const response = await axios(data);
			if (response.status === 200) {
				let respArray = [];				
				respArray.push(response.data.memberships);
				let iterationsNumber = response.data.total_count / response.data.limit;
				iterationsNumber = Math.ceil(iterationsNumber) - 1;
				for (let i = 1; i <= iterationsNumber; i++) {
					redmineParams.offset = i*response.data.limit;
					let nextData = requestDataHandler("GET",
					`${hostSettings.DB_HOST}/project_members`,														
					redmineParams, redmineParams);					
					const nextResponse = await axios(nextData);
					if (nextResponse.status === 200) {
						respArray.push(nextResponse.data.memberships);
					}
				}										
				return respArray;
			} 
			else {
				return []
			}

// 			const response = await axios(data).catch(err => {
// 				console.log(err);
// 				return []
// 			});
// 			if (typeof response === "object" && response.status === 200) {
// //			commit("SET_ALL", parsedResponse);
// 			return response;
// 			}
// 			return [];
		},

		async findAll() {

			let redmineParams = redmineConnection(this.getters);
			const filterProjectsByCountry = generalFunctions.filterProjectsByCountry;

			const data = requestDataHandler("GET",
			`${hostSettings.DB_HOST}/projects`,																	
			undefined, redmineParams);
			
			const response = await axios(data);
			
			if (response.status === 200) {
				let params = {status:1};
				let respArray = [];				
				// console.log(response.data.projects);
				respArray.push(filterProjectsByCountry(response.data.projects));
				let iterationsNumber = response.data.total_count / response.data.limit;
				iterationsNumber = Math.ceil(iterationsNumber) - 1;
				for (let i = 1; i <= iterationsNumber; i++) {
					params.offset = i*response.data.limit;
					redmineParams = redmineConnection(this.getters,params);
					let nextData = requestDataHandler("GET",
					`${hostSettings.DB_HOST}/projects`,																					
					undefined, redmineParams);
					const nextResponse = await axios(nextData);
					if (nextResponse.status === 200) {
						respArray.push(filterProjectsByCountry(nextResponse.data.projects));
					}
				}										
				return respArray;
			} 
			else {
				return []
			}
		},
	},
	getters: {
		getFilterProject(state) {
			return state.filterProject;
		}
	},
	namespaced: true
}
