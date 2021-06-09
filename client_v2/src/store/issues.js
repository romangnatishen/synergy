import requestDataHandler from '../plugins/requestDataHandler';
import axios from 'axios';
import redmineConnection from './redmineConnection';
import hostSettings from '../plugins/hostSettings';

export default {
	state: {
		filterStatus:null,
		filterExecutor:null
	},

	actions: {
		async findAll( payload, params) {
			
			let redmineParams = redmineConnection(this.getters,params);
			const data = requestDataHandler("GET", 
			`${hostSettings.DB_HOST}/issues`,			
			redmineParams, redmineParams);
			
			const response = await axios(data);
			if (response.status === 200) {
				let respArray = [];
				respArray.push(response.data.issues);
				let iterationsNumber = response.data.total_count / response.data.limit;
				iterationsNumber = Math.ceil(iterationsNumber) - 1;
				for (let i = 1; i <= iterationsNumber; i++) {
					redmineParams.offset = i*response.data.limit;
					let nextData = requestDataHandler("GET",
					`${hostSettings.DB_HOST}/issues`,			
					redmineParams, redmineParams);
					const nextResponse = await axios(nextData);
					if (nextResponse.status === 200) {
						respArray.push(nextResponse.data.issues);
					}
				}			
				return respArray;
			} 
			else {
				return []
			}
		},

		async getIssue( payload, params) {
			const redmineParams = redmineConnection(this.getters,params);
			const data = requestDataHandler("GET",
			`${hostSettings.DB_HOST}/get_issue_by_id`,			
			redmineParams, redmineParams);
			const response = await axios(data).catch(err => {
				console.log(err);
				return []
			});

			if (typeof response === "object" && response.status === 200) {
				return response;
			}
			return [];
		},

		async updateIssue( payload, params) {
			const redmineParams = redmineConnection(this.getters,params);
			const data = requestDataHandler("PUT",
			`${hostSettings.DB_HOST}/update_issue`,			
			redmineParams, redmineParams);
			const response = await axios(data).catch(err => {
				console.log(err);
				return []
			});

			if (typeof response === "object" && response.status === 200) {
				return response;
			}
			return [];
		},

		async getKanbanIssueByProject( payload, params) {
			const data = requestDataHandler("GET",
			`${hostSettings.DB_HOST}/kanban_issues_by_project`,			
			params, params);
			const response = await axios(data).catch(err => {
				console.log(err);
				return []
			});
			// console.log(response);

			if (typeof response === "object" && response.status === 200) {
//			commit("SET_ALL", parsedResponse);
			return response;
			}
			return [];
		},

		async addTaskComment( payload, params) {
			const data = requestDataHandler("POST",
			`${hostSettings.DB_HOST}/add_task_comment`,			
			params, params);
			const response = await axios(data).catch(err => {
				console.log(err);
				return []
			});
			// console.log(response);

			if (typeof response === "object" && response.status === 200) {
//			commit("SET_ALL", parsedResponse);
			return response;
			}
			return [];
		},

		async addKanbanComment( payload, params) {
			const data = requestDataHandler("POST",
			`${hostSettings.DB_HOST}/kanban_comment`,						
			params, params);
			const response = await axios(data).catch(err => {
				console.log(err);
				return []
			});
			// console.log(response);

			if (typeof response === "object" && response.status === 200) {
//			commit("SET_ALL", parsedResponse);
			return response;
			}
			return [];
		},

		async findKanbanCommentsByIssueId( payload, params) {
			const data = requestDataHandler("GET", 
			`${hostSettings.DB_HOST}/kanban_comments`,			
			params, params);
			const response = await axios(data).catch(err => {
				console.log(err);
				return []
			});
			// console.log(response);

			if (typeof response === "object" && response.status === 200) {
//			commit("SET_ALL", parsedResponse);
			return response;
			}
			return [];
		},
		
		async addToKanban( payload, params) {
			const data = requestDataHandler("POST",
			`${hostSettings.DB_HOST}/add_to_kanban`,
			params, params);
			const response = await axios(data).catch(err => {
				console.log(err);
				return []
			});
			// console.log(response);

			if (typeof response === "object" && response.status === 200) {
//			commit("SET_ALL", parsedResponse);
			return response;
			}
			return [];
		},

		async deleteKanbanIssue( payload, params) {

			const data = requestDataHandler("POST",
			`${hostSettings.DB_HOST}/delete_from_kanban`,			
			params, params);
			const response = await axios(data).catch(err => {
				console.log(err);
				return []
			});
			// console.log(response);

			if (typeof response === "object" && response.status === 200) {
//			commit("SET_ALL", parsedResponse);
			return response;
			}
			return [];
		},

		async updateKanbanIssue( payload, params) {
			const data = requestDataHandler("POST",
			`${hostSettings.DB_HOST}/update_kanban`,						
			params, params);
			const response = await axios(data).catch(err => {
				console.log(err);
				return []
			});
			// console.log(response);

			if (typeof response === "object" && response.status === 200) {
//			commit("SET_ALL", parsedResponse);
			return response;
			}
			return [];
		},

		async findIssueStatuses( payload) {
			const redmineParams = redmineConnection(this.getters);
			const data = requestDataHandler("GET",
			`${hostSettings.DB_HOST}/issue_statuses`,									
			redmineParams, payload.query);
			const response = await axios(data).catch(err => {
				console.log(err);
				return []
			});
			if (typeof response === "object" && response.status === 200) {
//			commit("SET_ALL", parsedResponse);
			return response;
			}
			return [];
		},

	},
	getters: {
	},
	namespaced: true
}