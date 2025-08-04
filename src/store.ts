import { configureStore } from '@reduxjs/toolkit';
import { plantApi } from './services/plantApi';
import { chatApi } from './services/chatApi';

export const store = configureStore({
    reducer: {
        [plantApi.reducerPath]: plantApi.reducer,
        [chatApi.reducerPath]: chatApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(plantApi.middleware)
            .concat(chatApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
