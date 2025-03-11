import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserData {
  id?: string;
  name?: string;
  email?: string;
  totalAverageWeightRatings?: number;
  numberOfRents?: number;
  recentlyActive?: number;
  createdAt?: number;
  updatedAt?: number;
}

interface UserState {
  userData: UserData | null;
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: UserState = {
  userData: null,
  loading: false,
  success: false,
  error: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    fetchUserStart: (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    },
    fetchUserSuccess: (state, action: PayloadAction<UserData>) => {
      state.userData = action.payload;
      state.loading = false;
      state.success = true;
      state.error = null;
    },
    fetchUserFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    },
    updateUserStart: (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    },
    updateUserSuccess: (state, action: PayloadAction<UserData>) => {
      state.userData = action.payload;
      state.loading = false;
      state.success = true;
      state.error = null;
    },
    updateUserFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    },
    resetUserState: (state) => {
      state.success = false;
      state.error = null;
    }
  }
});

export const {
  fetchUserStart,
  fetchUserSuccess,
  fetchUserFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  resetUserState
} = userSlice.actions;

export default userSlice.reducer;