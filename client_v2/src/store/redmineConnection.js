const getConfigParams = (getters, params) => {
  let redmineParams = {};
  if (params) {
    redmineParams = params;
  }
  const currentProfile = getters['profile/getProfile'];
  if (currentProfile) {
    const redmineConfig = {
      apiKey: currentProfile['redmine_api_key'],
    };
    redmineParams.redmineConfig = redmineConfig;
  }
  return redmineParams;
};

export default getConfigParams;
