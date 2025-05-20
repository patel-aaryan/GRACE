import { configureStore, createSlice } from "@reduxjs/toolkit";

// Create a placeholder slice to avoid empty reducer object
const placeholderSlice = createSlice({
  name: "placeholder",
  initialState: {},
  reducers: {},
});

export const makeStore = () => {
  return configureStore({
    reducer: {
      placeholder: placeholderSlice.reducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
