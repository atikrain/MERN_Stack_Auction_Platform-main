import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { getAuctionDetail } from "./auctionSlice";

const bidSlice = createSlice({
  name: "bid",
  initialState: {
    loading: false,
  },
  reducers: {
    bidRequest(state) {
      state.loading = true;
    },
    bidSuccess(state) {
      state.loading = false;
    },
    bidFailed(state) {
      state.loading = false;
    },
    resetBid(state) {
      state.loading = false;
    },
  },
});

// ===== Thunk for placing bid =====
export const placeBid = (id, data) => async (dispatch) => {
  dispatch(bidSlice.actions.bidRequest());
  try {
    const { data: res } = await axios.post(
      `http://localhost:5000/api/v1/bid/place/${id}`,
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );

    dispatch(bidSlice.actions.bidSuccess());
    toast.success(res.message);

    // Refresh auction details after placing bid
    dispatch(getAuctionDetail(id));
  } catch (error) {
    dispatch(bidSlice.actions.bidFailed());
    toast.error(error.response?.data?.message || "Something went wrong");
    console.error(error);
  } finally {
    // Always reset loading
    dispatch(bidSlice.actions.resetBid());
  }
};

export default bidSlice.reducer;
