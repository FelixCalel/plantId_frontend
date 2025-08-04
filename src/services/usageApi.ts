import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface UsageResponse {
    active: boolean
    credit_limits: { day: number | null; week: number | null; month: number | null; total: number }
    used: { day: number | null; week: number | null; month: number | null; total: number }
    can_use_credits: { value: boolean; reason: string | null }
    remaining: { day: number | null; week: number | null; month: number | null; total: number }
}

export const usageApi = createApi({
    reducerPath: 'usageApi',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
    endpoints: (build) => ({
        getUsage: build.query<UsageResponse, void>({
            query: () => '/uso',
            keepUnusedDataFor: 60,
        }),
    }),
})

export const { useGetUsageQuery } = usageApi
