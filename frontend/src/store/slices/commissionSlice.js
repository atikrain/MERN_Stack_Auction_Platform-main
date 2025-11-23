import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const commissionSlice = createSlice({
  name: "commission",
  initialState: {
    loading: false,
  },
  reducers: {
    postCommissionProofRequest(state) {
      state.loading = true;
    },
    postCommissionProofSuccess(state) {
      state.loading = false;
    },
    postCommissionProofFailed(state) {
      state.loading = false;
    },
    resetCommissionState(state) {
      state.loading = false;
    },
  },
});

// ===== Thunk to upload commission proof =====
export const postCommissionProof = (data) => async (dispatch) => {
  dispatch(commissionSlice.actions.postCommissionProofRequest());
  try {
    const { data: res } = await axios.post(
      "http://localhost:5000/api/v1/commission/proof",
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    dispatch(commissionSlice.actions.postCommissionProofSuccess());
    toast.success(res.message);
  } catch (error) {
    dispatch(commissionSlice.actions.postCommissionProofFailed());
    toast.error(error.response?.data?.message || "Something went wrong");
    console.error(error);
  } finally {
    // always reset loading
    dispatch(commissionSlice.actions.resetCommissionState());
  }
};

export default commissionSlice.reducer;
