import React from "react";
import { Flex, Box, Spacer } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

const NavBar: React.FC = () => (
  <Flex as="nav" bg="teal.500" px={4} py={2} align="center">
    <NavLink to="/identify">
      {({ isActive }) => (
        <Box
          px={3}
          py={2}
          rounded="md"
          bg={isActive ? "teal.700" : "teal.500"}
          color="white"
          _hover={{ textDecoration: "none", bg: "teal.600" }}
          mr={4}
        >
          Identificar
        </Box>
      )}
    </NavLink>

    <NavLink to="/plants">
      {({ isActive }) => (
        <Box
          px={3}
          py={2}
          rounded="md"
          bg={isActive ? "teal.700" : "teal.500"}
          color="white"
          _hover={{ textDecoration: "none", bg: "teal.600" }}
          mr={4}
        >
          Plantas
        </Box>
      )}
    </NavLink>

    <NavLink to="/families">
      {({ isActive }) => (
        <Box
          px={3}
          py={2}
          rounded="md"
          bg={isActive ? "teal.700" : "teal.500"}
          color="white"
          _hover={{ textDecoration: "none", bg: "teal.600" }}
        >
          Familias
        </Box>
      )}
    </NavLink>

    <Spacer />
  </Flex>
);

export default NavBar;
