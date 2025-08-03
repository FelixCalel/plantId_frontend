import React from "react";
import { HStack, Button } from "@chakra-ui/react";

interface PaginationProps {
  page: number;
  total: number;
  limit: number;
  onPageChange: (newPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  total,
  limit,
  onPageChange,
}) => {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <HStack spacing={2} justify="center">
      {pages.map((p) => (
        <Button
          key={p}
          size="sm"
          colorScheme={p === page ? "green" : "gray"}
          onClick={() => onPageChange(p)}
        >
          {p}
        </Button>
      ))}
    </HStack>
  );
};

export default Pagination;
