// src/components/Plants/PlantCard.tsx
import React from "react";
import {
  Box,
  Image,
  Heading,
  Text,
  Button,
  Flex,
  Spacer,
  Switch,
  useToast,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import type { Plant } from "../../models/types";
import { useChangePlantaStatusMutation } from "../../services/plantApi";

interface Props {
  plant: Plant & {
    imagenes: {
      id: number;
      plantaId: number;
      url: string;
      miniatura: boolean;
    }[];
  };
}

const PlantCard: React.FC<Props> = ({ plant }) => {
  const toast = useToast();
  const [toggleStatus] = useChangePlantaStatusMutation();

  const onToggle = async () => {
    try {
      await toggleStatus({
        id: plant.id,
        estado: plant.estado === "ACTIVA" ? "INACTIVA" : "ACTIVA",
      }).unwrap();
      toast({ status: "success", title: "Estado actualizado" });
    } catch {
      toast({ status: "error", title: "No se pudo actualizar estado" });
    }
  };

  // URL base de tu API (sin slash final)
  const baseUrl = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");

  // Extraigo la URL de la primera imagen (si existe)
  const firstImage = plant.imagenes.length > 0 ? plant.imagenes[0].url : "";

  // Calculo la URL definitiva
  let imageUrl: string | undefined;
  if (firstImage) {
    // si viene con http:// o https:// la dejamos
    if (firstImage.startsWith("http://") || firstImage.startsWith("https://")) {
      imageUrl = firstImage;
    } else {
      // si es ruta relativa, la plego sobre la base
      imageUrl = new URL(firstImage, baseUrl).toString();
    }
  }

  return (
    <Box borderWidth="1px" borderRadius="md" overflow="hidden" p={4}>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={plant.nombreCientifico}
          objectFit="cover"
          w="100%"
          h="150px"
          mb={4}
        />
      ) : (
        <Box
          w="100%"
          h="150px"
          mb={4}
          bg="gray.100"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text color="gray.500">Sin imagen</Text>
        </Box>
      )}

      <Heading size="md" mb={2}>
        {plant.nombreCientifico}
      </Heading>
      {plant.nombresComunes.length > 0 && (
        <Text fontSize="sm" color="gray.700" mb={2}>
          <strong>Común:</strong> {plant.nombresComunes.join(", ")}
        </Text>
      )}

      <Text fontSize="sm" color="gray.600">
        <strong>Género:</strong> {plant.taxonomia.genero}
      </Text>
      <Text fontSize="sm" color="gray.600">
        <strong>Orden:</strong> {plant.taxonomia.orden}
      </Text>
      <Text fontSize="sm" color="gray.600" mb={4}>
        <strong>Familia:</strong> {plant.taxonomia.familia.nombre}
      </Text>

      <Flex align="center">
        <Link to={`/plants/${plant.id}`}>
          <Button size="sm" mr={2}>
            Editar
          </Button>
        </Link>
        <Spacer />
        <Switch
          isChecked={plant.estado === "ACTIVA"}
          onChange={onToggle}
          size="sm"
          colorScheme="green"
        />
      </Flex>
    </Box>
  );
};

export default PlantCard;
