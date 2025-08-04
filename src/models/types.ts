export interface Paginated<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
}

export interface IdentifyApiImage {
    url: string;
    file_name: string;
}

export interface PlantDetails {
    url: string;
    language: string;
    taxonomy: {
        kingdom?: string;
        phylum?: string;
        class?: string;
        order?: string;
        family?: string;
        genus?: string;
        species?: string;
        rank?: string;
    };
    common_names?: string[];
    scientific_name?: string;
    structured_name?: {
        genus?: string;
        species?: string;
    };
    wiki_description?: {
        value: string;
        citation?: string;
        license_url?: string;
        license_name?: string;
    };
}

export interface IdentifyApiSuggestion {
    id: number;
    confirmed: boolean;
    plant_name: string;
    probability: number;
    plant_details?: PlantDetails;
    similar_images?: Array<{
        id: string;
        url: string;
        similarity: number;
        citation?: string;
        url_small?: string;
        license_url?: string;
        license_name?: string;
    }>;
}

export interface IdentifyApiResponse {
    id: string;
    images: IdentifyApiImage[];
    is_plant: boolean;
    suggestions: IdentifyApiSuggestion[];
}

export interface IdentMinimal {
    id: number;
    confianza: number;
}

export interface IdentFull {
    id: number;
    imagenBase64: string;
    confianza: number;
    respuestaApi: IdentifyApiResponse;
    secret?: string;
    creadaEn: string;
    planta: Plant;
    taxonomia: Taxonomia;
    familia: Familia;
}

export type IdentResult = IdentFull;

export interface ImagenPlanta {
    id: number;
    url: string;
    miniatura: boolean;
}

export interface Taxonomia {
    id: number;
    reino?: string;
    filo?: string;
    clase?: string;
    orden?: string;
    genero?: string;
    especie?: string;
    rango?: string;
    familiaId: number;
}

export interface Familia {
    id: number;
    nombre: string;
    descripcion?: string;
    estado: boolean;
    creadoEn: string;
    actualizadoEn: string;
}

export interface Plant {
    id: number;
    nombreCientifico: string;
    nombresComunes: string[];
    estado: 'ACTIVA' | 'INACTIVA';
    taxonomiaId: number;
    familiaId?: number;
    creadoEn: string;
    actualizadoEn: string;
    imagenes: string[];
    taxonomia: Taxonomia & {
        familia: Pick<Familia, 'nombre' | 'descripcion'>;
    };
}

export interface PlantCreateDto {
    nombreCientifico: string;
    nombresComunes: string[];
    taxonomiaId: number;
    familiaId?: number;
}

export interface PlantUpdateDto extends PlantCreateDto {
    id: number;
}

export interface FamiliaCreateDto {
    nombre: string;
    descripcion?: string;
}

export interface FamiliaUpdateDto extends FamiliaCreateDto {
    id: number;
}

export interface TaxonomiaCreateDto {
    familiaId: number;
    reino?: string;
    filo?: string;
    clase?: string;
    orden?: string;
    genero?: string;
    especie?: string;
    rango?: string;
}

export interface TaxonomiaUpdateDto extends TaxonomiaCreateDto {
    id: number;
}

export type IdentifyResponse = IdentifyApiResponse;
export type PlantIdSuggestion = IdentifyApiSuggestion;