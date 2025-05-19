const SET_USER = "SET_USER";
const LOGIN_FAILURE = "LOGIN_FAILURE";
const LOGOUT = "LOGOUT";
const SET_TOKEN = "SET_TOKEN";

export { SET_USER, LOGIN_FAILURE, LOGOUT, SET_TOKEN };

const apiUrl = import.meta.env.VITE_API_URL;

export const fetchLogin = (username, password) => {
  return async (dispatch) => {
    try {
      const response = await fetch(apiUrl + "/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data?.token) {
        localStorage.setItem("token", data.token);
        dispatch({ type: SET_TOKEN, payload: data.token });
      } else {
        dispatch({ type: LOGIN_FAILURE, payload: { error: "Credenziali non valide" } });
      }
    } catch (error) {
      alert("Errore nel login:", error);
      dispatch({ type: LOGIN_FAILURE, payload: { error: "Errore di rete" } });
    }
  };
};

export const fetchUserDetails = (token) => {
  return async (dispatch) => {
    try {
      const response = await fetch(apiUrl + "/current-user-complete", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data) {
        dispatch({ type: SET_USER, payload: data });
      } else {
        localStorage.removeItem("token");
        dispatch({ type: LOGOUT });
      }
    } catch (error) {
      console.error("Errore nel recupero dell'utente:", error);
      localStorage.removeItem("token");
      dispatch({ type: LOGOUT });
    }
  };
};
