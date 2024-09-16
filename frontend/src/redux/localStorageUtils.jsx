export const saveStateToLocalStorage = (user) => {
  try {
    const serializedUser = JSON.stringify(user);
    localStorage.setItem("userData", serializedUser);
  } catch (err) {
    console.error("Error saving user:", err);
  }
};

export const loadStateFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem("userData");
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Error loading state", err);
    return undefined;
  }
};
