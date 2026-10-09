import React from "react";
import { Alert, Grid } from "@mui/material";
import Title from "../../components/pages/Title";

interface Props {
  readonly title: string;
  readonly description: string;
  readonly severity: "success" | "info" | "error" | "warning";
}

const PaymentOutcomePage: React.FC<Props> = ({
  title,
  description,
  severity,
}) => (
  <Grid container spacing={3} sx={{ mt: 1 }}>
    <Grid item xs={12}>
      <Title title={title} />
    </Grid>
    <Grid item xs={12}>
      <Alert severity={severity}>{description}</Alert>
    </Grid>
  </Grid>
);

export default PaymentOutcomePage;
