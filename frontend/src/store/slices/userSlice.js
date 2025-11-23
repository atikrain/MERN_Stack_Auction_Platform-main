import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    isAuthenticated: false,
    user: {},
    leaderboard: [],
    error: null,
    message: null,
  },
  reducers: {
    // REGISTER
    registerRequest(state) {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = {};
      state.error = null;
    },
    registerSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.message = action.payload.message;
    },
    registerFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
      state.error = action.payload;
    },

    // LOGIN
    loginRequest(state) {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = {};
      state.error = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.message = action.payload.message;
    },
    loginFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
      state.error = action.payload;
    },

    // FETCH USER
    fetchUserRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchUserSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    fetchUserFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
      state.error = action.payload;
    },

    // LOGOUT
    logoutSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
      state.message = action.payload;
    },
    logoutFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // LEADERBOARD
    fetchLeaderboardRequest(state) {
      state.loading = true;
      state.leaderboard = [];
      state.error = null;
    },
    fetchLeaderboardSuccess(state, action) {
      state.loading = false;
      state.leaderboard = action.payload;
    },
    fetchLeaderboardFailed(state, action) {
      state.loading = false;
      state.leaderboard = [];
      state.error = action.payload;
    },

    // CLEAR ERRORS / MESSAGES
    clearAllErrors(state) {
      state.error = null;
      state.message = null;
    },
  },
});

/* ------------------ EXPORT SLICE ACTIONS ------------------ */
export const {
  registerRequest,
  registerSuccess,
  registerFailed,
  loginRequest,
  loginSuccess,
  loginFailed,
  fetchUserRequest,
  fetchUserSuccess,
  fetchUserFailed,
  logoutSuccess,
  logoutFailed,
  fetchLeaderboardRequest,
  fetchLeaderboardSuccess,
  fetchLeaderboardFailed,
  clearAllErrors,
} = userSlice.actions;

/* ------------------ THUNKS (Async Actions) ------------------ */

// REGISTER
export const register = (data) => async (dispatch) => {
  dispatch(registerRequest());
  try {
    const response = await axios.post(
      "http://localhost:5000/api/v1/user/register",
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    dispatch(registerSuccess(response.data));
    toast.success(response.data.message);
    dispatch(clearAllErrors());
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Registration failed";
    dispatch(registerFailed(message));
    toast.error(message);
    dispatch(clearAllErrors());
  }
};

// LOGIN
export const login = (data) => async (dispatch) => {
  dispatch(loginRequest());
  try {
    const response = await axios.post(
      "http://localhost:5000/api/v1/user/login",
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    dispatch(loginSuccess(response.data));
    toast.success(response.data.message);
    dispatch(clearAllErrors());
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Login failed";
    dispatch(loginFailed(message));
    toast.error(message);
    dispatch(clearAllErrors());
  }
};

// LOGOUT
export const logout = () => async (dispatch) => {
  try {
    const response = await axios.get(
      "http://localhost:5000/api/v1/user/logout",
      { withCredentials: true }
    );
    dispatch(logoutSuccess(response.data.message));
    toast.success(response.data.message);
    dispatch(clearAllErrors());
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Logout failed";
    dispatch(logoutFailed(message));
    toast.error(message);
    dispatch(clearAllErrors());
  }
};

// FETCH USER
export const fetchUser = () => async (dispatch) => {
  dispatch(fetchUserRequest());
  try {
    const response = await axios.get("http://localhost:5000/api/v1/user/me", {
      withCredentials: true,
    });
    dispatch(fetchUserSuccess(response.data));
    dispatch(clearAllErrors());
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Fetching user failed";
    dispatch(fetchUserFailed(message));
    dispatch(clearAllErrors());
    console.error(error);
  }
};

// FETCH LEADERBOARD
export const fetchLeaderboard = () => async (dispatch) => {
  dispatch(fetchLeaderboardRequest());
  try {
    const response = await axios.get(
      "http://localhost:5000/api/v1/user/leaderboard",
      { withCredentials: true }
    );
    dispatch(fetchLeaderboardSuccess(response.data.leaderboard));
    dispatch(clearAllErrors());
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Fetching leaderboard failed";
    dispatch(fetchLeaderboardFailed(message));
    dispatch(clearAllErrors());
    console.error(error);
  }
};

/* ------------------ EXPORT REDUCER ------------------ */
export default userSlice.reducer;
