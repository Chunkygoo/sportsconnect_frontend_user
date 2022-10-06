export default function updateLoggedInStatus(setIsLoggedIn) {
  if (sessionStorage.getItem("token")) {
    setIsLoggedIn(true);
  } else {
    setIsLoggedIn(false);
  }
  return;
}
