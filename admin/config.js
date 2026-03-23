const CONFIG = {
  // Change this to false in production
  isDevelopment: false,

  get BASE_URL() {
    return this.isDevelopment
      ? "https://localhost:61711/api/OPUKsa" // dev URL
      : "https://pxibh983vh.execute-api.ap-south-1.amazonaws.com/Prod/api/OPUKsa"; // production URL
  },
};
