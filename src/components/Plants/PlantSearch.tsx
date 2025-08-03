import React, { useState, useEffect, type ChangeEvent } from "react";
import { HStack, Input, Select, Button } from "@chakra-ui/react";
import {
  useGetFamiliasQuery,
  useGetTaxonomiasQuery,
} from "../../services/plantApi";
import type { Familia, Taxonomia } from "../../models/types";

interface Props {
  onSearch: (q: string, familiaId?: number, genero?: string) => void;
}

const PlantSearch: React.FC<Props> = ({ onSearch }) => {
  const [q, setQ] = useState("");
  const [familiaId, setFamiliaId] = useState<number>();
  const [genero, setGenero] = useState("");
  const { data: familiasResponse } = useGetFamiliasQuery({ page: 1, q: "" });
  const familias: Familia[] = familiasResponse?.items ?? [];

  const { data: taxonomiasResponse } = useGetTaxonomiasQuery(familiaId);
  const taxonomias: Taxonomia[] = taxonomiasResponse ?? [];

  useEffect(() => {
    onSearch(q.trim(), familiaId, genero);
  }, [q, familiaId, genero]);

  const handleQ = (e: ChangeEvent<HTMLInputElement>) => {
    setQ(e.target.value);
  };

  const handleFamilia = (e: ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    setFamiliaId(isNaN(id) ? undefined : id);
    setGenero("");
  };

  const handleGenero = (e: ChangeEvent<HTMLSelectElement>) => {
    setGenero(e.target.value);
  };

  return (
    <HStack w="100%" spacing={4} mb={4}>
      <Input
        flex="1"
        placeholder="Buscar por nombre…"
        value={q}
        onChange={handleQ}
      />

      <Select
        w="200px"
        placeholder="Familia"
        value={familiaId ?? ""}
        onChange={handleFamilia}
      >
        {familias.map((f: Familia) => (
          <option key={f.id} value={f.id}>
            {f.nombre}
          </option>
        ))}
      </Select>

      <Select
        w="200px"
        placeholder="Género"
        value={genero}
        onChange={handleGenero}
        isDisabled={taxonomias.length === 0}
      >
        {taxonomias.map((t: Taxonomia) => (
          <option key={t.id} value={t.genero}>
            {t.genero}
          </option>
        ))}
      </Select>

      <Button
        colorScheme="green"
        onClick={() => onSearch(q.trim(), familiaId, genero)}
      >
        Buscar
      </Button>
    </HStack>
  );
};

export default PlantSearch;
