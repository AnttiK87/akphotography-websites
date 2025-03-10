export const getUserId = () => {
  let userId = localStorage.getItem("userId");
  if (!userId) {
    userId = crypto.randomUUID(); // Luo uniikki tunniste
    localStorage.setItem("userId", userId);
  }
  return userId;
};
