const sequrityCheck = async (self) => {
    
    const access_token = localStorage.getItem('access_token');
    setTimeout(500);
    if (access_token) {      
      await self.$store.dispatch("profile/fetchProfile").catch((err)=>{
        localStorage.clear();
        self.$store.dispatch("profile/cleanProfile");        
        if (self.$route.name!="Login") {
          self.$router.push({ name: "Login" });
        }
      })
      .then(
        (res)=>{
        const currentProfile = self.$store.getters['profile/getProfile'];
        if (currentProfile&&currentProfile.id) {
            if (self.$route.name==="Login") {
              self.$router.push({ name: "Dashboard" });
            }
          } else {
            localStorage.clear();
            self.$store.dispatch("profile/cleanProfile");        
            if (self.$route.name!="Login") {
              self.$router.push({ name: "Login" });
            }
          }
        }
      );
    } else {
      localStorage.clear();
      self.$store.dispatch("profile/cleanProfile");        
      if (self.$route.name!="Login") {
        self.$router.push({ name: "Login" });
      }
    }
}

export default sequrityCheck;