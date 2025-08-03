import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
    IdentResult,
    Paginated,
    IdentMinimal,
    IdentFull,
    Plant,
    Familia,
    FamiliaCreateDto,
    FamiliaUpdateDto,
    Taxonomia,
    TaxonomiaCreateDto,
    TaxonomiaUpdateDto,
    PlantUpdateDto
} from '../models/types';


export const plantApi = createApi({
    reducerPath: 'plantApi',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
    tagTypes: ['Identificacion', 'Planta', 'Familia', 'Taxonomia'],
    endpoints: (build) => ({
        identifyImage: build.mutation<IdentResult, File>({
            query: (file) => {
                const form = new FormData();
                form.append('image', file);
                return { url: '/identificaciones', method: 'POST', body: form };
            },
            invalidatesTags: ['Identificacion', 'Planta', 'Familia', 'Taxonomia'],
        }),
        getIdentificaciones: build.query<Paginated<IdentMinimal>, { page: number; limit: number }>({
            query: ({ page, limit }) => `/identificaciones?page=${page}&limit=${limit}`,
            providesTags: ['Identificacion'],
        }),
        getIdentificacionById: build.query<IdentFull, number>({
            query: (id) => `/identificaciones/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'Identificacion', id }],
        }),

        getPlantas: build.query<{ items: Plant[]; total: number }, { q?: string; page: number; estado?: string }>({
            query: ({ q = '', page, estado }) =>
                `/plantas?q=${q}&page=${page}${estado ? `&estado=${estado}` : ''}`,
            transformResponse: (response: { items: Plant[]; total: number }) => ({
                items: response.items,
                total: response.total,
                limit: 25,
            }),
            providesTags: ['Planta'],
        }),

        createPlanta: build.mutation<Plant, FormData>({
            query: formData => ({
                url: '/plantas',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['Planta'],
        }),
        updatePlanta: build.mutation<Plant, { id: number; data: PlantUpdateDto }>({
            query: ({ id, data }) => ({
                url: `/plantas/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Planta' as const, id },
                { type: 'Planta' as const, id: 'LIST' },
            ],
        }),

        changePlantaStatus: build.mutation<void, { id: number; estado: string }>({
            query: ({ id, estado }) => ({
                url: `/plantas/${id}/estado`, method: 'PATCH', body: { estado }
            }),
            invalidatesTags: ['Planta'],
        }),
        getPlantaById: build.query<Plant, number>({
            query: (id) => `/plantas/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'Planta' as const, id }],
        }),

        getFamilias: build.query<Paginated<Familia>, { q?: string; page: number }>({
            query: ({ q = '', page }) => `/familias?q=${q}&page=${page}`,
            transformResponse: (response: Familia[]) => ({
                items: response,
                total: response.length,
                page: 1,
                limit: response.length,
            }),
            providesTags: ['Familia'],
        }),
        createFamilia: build.mutation<Familia, FamiliaCreateDto>({
            query: (body) => ({ url: '/familias', method: 'POST', body }),
            invalidatesTags: ['Familia'],
        }),
        updateFamilia: build.mutation<Familia, FamiliaUpdateDto>({
            query: (body) => ({ url: `/familias/${body.id}`, method: 'PUT', body }),
            invalidatesTags: ['Familia'],
        }),
        changeFamiliaStatus: build.mutation<void, { id: number; estado: boolean }>({
            query: ({ id, estado }) => ({
                url: `/familias/${id}/estado`, method: 'PATCH', body: { estado }
            }),
            invalidatesTags: ['Familia'],
        }),
        getTaxonomias: build.query<Taxonomia[], number | void>({
            query: (familiaId) =>
                `/taxonomias${familiaId ? `?familiaId=${familiaId}` : ''}`,
            providesTags: ['Taxonomia'],
        }),
        createTaxonomia: build.mutation<Taxonomia, TaxonomiaCreateDto>({
            query: (body) => ({ url: '/taxonomias', method: 'POST', body }),
            invalidatesTags: ['Taxonomia'],
        }),
        updateTaxonomia: build.mutation<Taxonomia, TaxonomiaUpdateDto>({
            query: (body) => ({ url: `/taxonomias/${body.id}`, method: 'PUT', body }),
            invalidatesTags: ['Taxonomia'],
        }),
    }),
});

export const {
    useIdentifyImageMutation,
    useGetIdentificacionesQuery,
    useGetIdentificacionByIdQuery,
    useGetPlantasQuery,
    useGetPlantaByIdQuery,
    useCreatePlantaMutation,
    useUpdatePlantaMutation,
    useChangePlantaStatusMutation,
    useGetFamiliasQuery,
    useCreateFamiliaMutation,
    useUpdateFamiliaMutation,
    useChangeFamiliaStatusMutation,
    useGetTaxonomiasQuery,
    useCreateTaxonomiaMutation,
    useUpdateTaxonomiaMutation,
} = plantApi;