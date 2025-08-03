// src/components/Plants/PlantForm.tsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  FormErrorMessage,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetFamiliasQuery,
  useGetTaxonomiasQuery,
  useCreatePlantaMutation,
  useGetPlantaByIdQuery,
  useUpdatePlantaMutation,
} from "../../services/plantApi";

const PlantForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const toast = useToast();
  const nav = useNavigate();
  const { data: existing, isLoading: loadingPlant } = useGetPlantaByIdQuery(
    Number(id!),
    { skip: !isEdit }
  );
  const { data: familias } = useGetFamiliasQuery({ page: 1, q: "" });
  const [nombreCientifico, setNombre] = useState("");
  const [nombresComunes, setComunes] = useState("");
  const [familiaId, setFamilia] = useState<number>();
  const [taxonomiaId, setTaxonomia] = useState<number>();
  const [file, setFile] = useState<File | null>(null);
  const [errors] = useState<Partial<Record<string, string>>>({});
  const [updatePlant, { isLoading: updating }] = useUpdatePlantaMutation();
  useEffect(() => {
    if (existing) {
      setNombre(existing.nombreCientifico);
      setComunes(existing.nombresComunes.join(", "));
      setFamilia(existing.familiaId);
      setTaxonomia(existing.taxonomiaId);
    }
  }, [existing]);

  const activeFamiliaId = familiaId ?? existing?.familiaId;

  const { data: taxonomias } = useGetTaxonomiasQuery(activeFamiliaId!, {
    skip: !activeFamiliaId,
  });
  const taxonomiasList = taxonomias ?? [];
  const [createPlant, { isLoading: creating }] = useCreatePlantaMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreCientifico.trim() || !familiaId || !taxonomiaId) {
      return;
    }

    if (isEdit) {
      await updatePlant({
        id: Number(id),
        body: {
          nombreCientifico: nombreCientifico.trim(),
          nombresComunes: nombresComunes
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          familiaId,
          taxonomiaId,
        },
      }).unwrap();
      toast({ status: "success", title: "Planta actualizada correctamente" });
    } else {
      const formData = new FormData();
      formData.append("nombreCientifico", nombreCientifico.trim());
      formData.append(
        "nombresComunes",
        JSON.stringify(
          nombresComunes
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        )
      );
      formData.append("familiaId", String(familiaId));
      formData.append("taxonomiaId", String(taxonomiaId));
      if (file) formData.append("imagen", file);

      await createPlant(formData).unwrap();
      toast({ status: "success", title: "Planta creada correctamente" });
    }

    nav("/plants");
  };

  if (loadingPlant) {
    return <Box p={4}>Cargando...</Box>;
  }

  return (
    <Box maxW="container.md" mx="auto" p={4}>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isInvalid={!!errors.nombreCientifico}>
            <FormLabel>Nombre Científico</FormLabel>
            <Input
              value={nombreCientifico}
              onChange={(e) => setNombre(e.target.value)}
            />
            <FormErrorMessage>{errors.nombreCientifico}</FormErrorMessage>
          </FormControl>
          <FormControl>
            <FormLabel>Nombres Comunes (coma separado)</FormLabel>
            <Input
              value={nombresComunes}
              onChange={(e) => setComunes(e.target.value)}
            />
          </FormControl>
          <FormControl isInvalid={!!errors.familiaId}>
            <FormLabel>Familia</FormLabel>
            <Select
              placeholder="Selecciona familia"
              value={familiaId ?? ""}
              onChange={(e) => {
                const v = Number(e.target.value);
                setFamilia(isNaN(v) ? undefined : v);
                setTaxonomia(undefined);
              }}
            >
              {(familias ?? []).map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nombre}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{errors.familiaId}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.taxonomiaId}>
            <FormLabel>Taxonomía</FormLabel>
            <Select
              placeholder="Selecciona taxonomía"
              value={taxonomiaId ?? ""}
              onChange={(e) => {
                const v = Number(e.target.value);
                setTaxonomia(isNaN(v) ? undefined : v);
              }}
            >
              {taxonomiasList.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.genero} {t.especie}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{errors.taxonomiaId}</FormErrorMessage>
          </FormControl>

          {!isEdit && (
            <FormControl>
              <FormLabel>Imagen</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </FormControl>
          )}

          <Button
            colorScheme="green"
            type="submit"
            isLoading={creating || updating}
          >
            {isEdit ? "Actualizar Planta" : "Crear Planta"}
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default PlantForm;
