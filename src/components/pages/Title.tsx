import { Typography } from "@mui/material";
import { Grid } from "@mui/material";
import { Variant } from "@mui/material/styles/createTypography";
import React from "react";

interface Props {
  readonly title: string;
  readonly subTitle?: string;
  readonly mtTitle?: number;
  readonly mbTitle?: number;
  readonly mbSubTitle?: number;
  readonly variantTitle?: Variant;
  readonly variantSubTitle?: Variant;
  readonly titleFontSize?: string;
  readonly subTitleFontSize?: string;
  readonly titleFontColor?: string;
  readonly subTitleFontColor?: string;
}

export default function Title({
  title,
  subTitle,
  mbTitle = 2,
  mtTitle,
  mbSubTitle,
  variantTitle = "h1",
  variantSubTitle = "h5",
  titleFontSize,
  subTitleFontSize = "18px",
  titleFontColor = "212529",
  subTitleFontColor = "212529",
}: Props) {
  return (
    <Grid container mt={mtTitle}>
      <Grid item xs={12} mb={mbTitle}>
        <Typography
          variant={variantTitle}
          sx={{ fontSize: titleFontSize, color: titleFontColor }}
        >
          {title}
        </Typography>
      </Grid>
      {subTitle && (
        <Grid item xs={12} mb={mbSubTitle}>
          <Typography
            variant={variantSubTitle}
            sx={{ fontSize: subTitleFontSize, color: subTitleFontColor }}
          >
            {subTitle}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
}
