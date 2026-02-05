import { styled } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

export const StyledDataGrid = styled(DataGrid)({
  border: "none !important",
  "& .MuiDataGrid-main": {
    background: `white`,
    padding: "0 0 0 0",
    marginTop: "12px",
  },
  "&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus-within, &.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
    outline: "none",
  },
  "&.MuiDataGrid-root .MuiDataGrid-cell": {
    whiteSpace: "normal !important",
    wordWrap: "break-word !important",
  },
  "& .MuiDataGrid-columnHeader .MuiTypography-root": {
    fontSize: "15px",
    alignItems: "left",
  },
  ".justifyContentBold": {
    fontSize: "16px",
    fontWeight: "600",
    "&>div": {
      display: "flex !important",
      alignItems: "center",
    },
  },
  ".MuiDataGrid-columnSeparator": { display: "none" },
  ".MuiDataGrid-cell ": { borderBottom: "2px" },
  ".MuiDataGrid-columnHeaders": { borderBottom: "2px" },
  "& .MuiDataGrid-row": {
    borderTop: "1px solid lightgray",
    backgroundColor: "white",
    "&.Mui-selected": {
      backgroundColor: "#e3e4e6",
      "&:hover": { backgroundColor: "#e3e4e6" },
    },
    "&:hover": {
      backgroundColor: "#e3e4e6",
    },
  },
  ".justifyContentNormal": {
    fontSize: "16px",
    fontWeight: "normal",
    "&>div": {
      display: "flex !important",
      alignItems: "center",
    },
  },
  ".justifyContentNormalRight": {
    fontSize: "16px",
    fontWeight: "normal",
    "&>div": {
      display: "flex !important",
      alignItems: "center",
      justifyContent: "right",
    },
  },
  ".justifyContentItalic": {
    fontSize: "16px",
    fontWeight: "normal",
    fontStyle: "italic",
    "&>div": {
      display: "flex !important",
      alignItems: "center",
    },
  },
});
