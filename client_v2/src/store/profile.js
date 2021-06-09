import requestDataHandler from '../plugins/requestDataHandler';
import axios from "@/plugins/axios";
import hostSettings from '../plugins/hostSettings';

export default {
	state: {
		profile: {
			id: 0,
			name: "",
			redmine_api_key: "",
			email: "",
			role: 0,
			user_status: 0,
				}
	},
	mutations: {
		SET_PROFILE(state, params) {
			state.profile = params;
		},
	},
	actions: {
		async findByPk({ commit }, payload) {
			const data = requestDataHandler(
			"GET",
			`${hostSettings.DB_HOST}/users/${payload.params.id}`,
			undefined,
			payload.query
			);
			const response = await axios(data).catch(err => {
				console.log(err);
			return false;
			});
			if (typeof response === "object" && response.status === 200) {
				return response.data;
			}
			return [];
		},

		addUser(state, payload) {
			state.user.push(payload);
		},

		async update({ commit }, payload) {
			const data = requestDataHandler(
			"PUT",
			`${hostSettings.DB_HOST}/users/${payload.params.id}`,
			payload.body
			);

			const response = await axios(data).catch(err => {
			return false;
			});

			if (typeof response === "object" && response.status === 200) {
			return true;
			}
			return false;
		},

		async login({ commit }, payload) {
			const data = requestDataHandler(
			"POST",
			`${hostSettings.DB_HOST}/auth`,
			payload
			);
			// console.log(`${hostSettings.DB_HOST}/auth`);
			const resLogin =await axios(data)
			.catch(err => {
				console.log(err);
			return false;
			});
			return resLogin;
		},

		registration({ commit }, payload) {
			const data = requestDataHandler(
			"POST",
			`${hostSettings.DB_HOST}/users`,
			payload
			);
			const resOfRegistration = axios(data)
			.catch(err => {
				console.log(err);
			})
			return true;
			// return axios.post("http://localhost:3000/users", payload);
		},

		async findAll({ commit }, payload) {
			const data = requestDataHandler("GET", `${hostSettings.DB_HOST}/users`, undefined, payload.query);
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

		async fetchProfile({commit}, payload) {					
			const data = requestDataHandler(
			"GET",
			`${hostSettings.DB_HOST}/profile`,
			payload
			);
			
			const resProfile = await axios(data)
			.then(res => {
				if (res && res.status === 200) {
					commit("SET_PROFILE", res.data);
					return res.data;
				}			
			})
			.catch(err => {
				commit("SET_PROFILE", {});
				console.log(err);
			});		
		},
		
		cleanProfile({commit}) {					
			commit("SET_PROFILE", {});
		}
	},
	getters: {
		getProfile(state) {
			return state.profile;
		}
	},
	namespaced: true
};