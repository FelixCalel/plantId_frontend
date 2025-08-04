import { configureStore } from '@reduxjs/toolkit';
import { plantApi } from './services/plantApi';
import { chatApi } from './services/chatApi';
import { usageApi } from './services/usageApi';

export const store = configureStore({
    reducer: {
        [plantApi.reducerPath]: plantApi.reducer,
        [chatApi.reducerPath]: chatApi.reducer,
        [usageApi.reducerPath]: usageApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(plantApi.middleware)
            .concat(chatApi.middleware)
            .concat(usageApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
