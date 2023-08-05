import { Typography } from "@mui/material";

const Copyright = () => {
  return (
    <Typography variant="body1" align="center" sx={{ marginTop: "auto"}}>
      {"Copyright © "} Ying Tu {new Date().getFullYear()}.
    </Typography>
  );
};

export default Copyright;
