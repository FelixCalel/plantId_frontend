import { configureStore } from '@reduxjs/toolkit';
import { plantApi } from './services/plantApi';


export const store = configureStore({
    reducer: {
        [plantApi.reducerPath]: plantApi.reducer,
    },
    middleware: (gdm) =>
        gdm().concat(plantApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;