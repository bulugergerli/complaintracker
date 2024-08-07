import { Box, Container } from "@mui/material";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoginForm from "../components/LoginForm";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");
  const locationId = searchParams.get("locationId");

  const handleLogin = () => {
    // Perform login logic here
    if (redirect && locationId) {
      navigate(`/${redirect}/${locationId}`);
    } else {
      navigate("/home");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 8,
        }}
      >
        <LoginForm />
      </Box>
    </Container>
  );
};

export default LoginPage;
