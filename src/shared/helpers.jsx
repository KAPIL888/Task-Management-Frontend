export function saveToken(authInfo) {
  return localStorage.setItem("auth", authInfo);
}

export function getToken() {
  return localStorage.getItem("auth");
}
