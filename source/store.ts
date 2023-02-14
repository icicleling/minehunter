import reduxToolkit from "@reduxjs/toolkit";
const { configureStore, createSlice } = reduxToolkit;

const gameStore = createSlice({
  name: "game",
  initialState: {
    value: 0,
  },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
  },
});

export const gameActions = gameStore.actions;

const store = configureStore({
  reducer: { game: gameStore.reducer },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
