import { Box, Chip, IconButton, Tooltip, Typography } from "@mui/material";
import {
  GridColDef,
  GridColumnHeaderParams,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import React, { CSSProperties, ReactNode } from "react";
import { Delete, Info, Visibility } from "@mui/icons-material";
import { stringfyList } from "../../../util/utilities";
import { Http_methodEnum } from "../../../api/generated/mocker-config/MockResource";
import { SpecialRequestHeader } from "../../../api/generated/mocker-config/SpecialRequestHeader";

export function buildColumnDefs(
  onClickDetail: (row: any) => void,
  onClickDelete: (row: any) => void
) {
  return [
    {
      field: "name",
      cellClassName: "justifyContentNormal",
      headerName: "Name",
      align: "left",
      headerAlign: "left",
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params: any) => showName(params, 60),
      sortable: false,
      flex: 5,
    },
    {
      field: "http_method",
      cellClassName: "justifyContentNormal",
      headerName: "Method",
      align: "left",
      headerAlign: "left",
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) => showHTTPMethod(params),
      sortable: false,
      flex: 1,
    },
    {
      field: "complete_url",
      cellClassName: "justifyContentItalic",
      headerName: "URL",
      align: "left",
      headerAlign: "left",
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) => showCompleteURL(params, 60),
      sortable: false,
      flex: 5,
    },
    {
      field: "special_headers",
      cellClassName: "justifyContentNormal",
      headerName: "Headers",
      align: "center",
      headerAlign: "left",
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) => showSpecialHeaders(params),
      sortable: false,
      flex: 2,
    },
    {
      field: "tags",
      cellClassName: "justifyContentNormal",
      headerName: "Tags",
      align: "left",
      headerAlign: "left",
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) => showLabels(params),
      sortable: false,
      flex: 3,
    },
    {
      field: "actions",
      cellClassName: "justifyContentNormal",
      type: "actions",
      headerName: "",
      align: "center",
      hideSortIcons: true,
      disableColumnMenu: true,
      editable: false,
      getActions: (params: any) => {
        const resourceDetail = (
          <IconButton onClick={() => onClickDetail(params)}>
            <Visibility sx={{ color: "#212529", fontSize: "24px" }} />
          </IconButton>
        );
        const resourceDelete = (
          <IconButton onClick={() => onClickDelete(params)}>
            <Delete sx={{ color: "error.dark", fontSize: "20px" }} />
          </IconButton>
        );
        return [resourceDetail, resourceDelete];
      },
      sortable: false,
      flex: 2,
    },
  ] as ReadonlyArray<GridColDef>;
}

export function renderCell(
  params: GridRenderCellParams,
  value: ReactNode = params.value,
  overrideStyle: CSSProperties = {}
) {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        paddingTop: "8px",
        paddingBottom: "8px",
        WebkitBoxOrient: "vertical" as const,
        ...overrideStyle,
      }}
    >
      <Box
        sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical" as const,
          width: "100%",
          fontSize: "14px",
        }}
      >
        {value}
      </Box>
    </Box>
  );
}

export function showCustomHeader(params: GridColumnHeaderParams) {
  return (
    <React.Fragment>
      <Typography
        color="colorTextPrimary"
        variant="caption"
        sx={{ fontWeight: "fontWeightBold", outline: "none" }}
      >
        {params.colDef.headerName}
      </Typography>
    </React.Fragment>
  );
}

export function showName(params: GridRenderCellParams, maxSize: number) {
  params.row.name =
    params.row.name.length > maxSize
      ? `${params.row.name.substring(0, maxSize - 3)}...`
      : params.row.name;
  let content;
  if (params.row.is_active === false) {
    content = (
      <Tooltip
        title={
          "This mock resource is disabled: if invoked, it will responds with a standard error message."
        }
      >
        <label style={{ color: "red" }}>{params.row.name}</label>
      </Tooltip>
    );
  }
  return renderCell(params, content);
}

export function showCompleteURL(params: GridRenderCellParams, maxSize: number) {
  params.row.complete_url = `${params.row.subsystem}/${
    params.row.resource_url ? params.row.resource_url : ""
  }`.replace(/\/\//gm, "");
  params.row.complete_url =
    params.row.complete_url.length > maxSize
      ? `${params.row.complete_url.substring(0, maxSize - 3)}...`
      : params.row.complete_url;
  return renderCell(params, undefined);
}

export function showHTTPMethod(params: GridRenderCellParams) {
  const httpMethod = params.row.http_method;
  const id = params.row.id;
  let backgroundColor = "grey";
  switch (httpMethod) {
    case Http_methodEnum.GET:
      backgroundColor = "#61affe";
      break;
    case Http_methodEnum.POST:
      backgroundColor = "#49cc90";
      break;
    case Http_methodEnum.PUT:
      backgroundColor = "#fca130";
      break;
    case Http_methodEnum.DELETE:
      backgroundColor = "#f93e3e";
      break;
  }
  return renderCell(
    params,
    <Chip
      label={httpMethod}
      id={`${id}-httpmethod-chip`}
      sx={{
        color: "white",
        backgroundColor: { backgroundColor },
        borderRadius: "3px",
        fontWeight: 700,
        textAlign: "center",
        width: "100%",
      }}
    ></Chip>
  );
}

export function showLabels(params: GridRenderCellParams) {
  if (typeof params.row.tags === "object") {
    params.row.tags = stringfyList(params.row.tags);
  }
  return renderCell(params, undefined);
}

export function showSpecialHeaders(params: GridRenderCellParams) {
  const specialHeaders = params.row.special_headers as ReadonlyArray<
    SpecialRequestHeader
  >;
  const id = params.row.id;
  if (specialHeaders.length > 0) {
    return renderCell(
      params,
      <Tooltip
        title={
          <div id={`${id}-headers`}>
            {specialHeaders.map((header) => (
              <div id={`${id}-${header.name}-header`}>
                {header.name}: {header.value}
                <br />
              </div>
            ))}
          </div>
        }
      >
        <Info sx={{ color: "#61affe" }}></Info>
      </Tooltip>
    );
  } else {
    return renderCell(params, undefined);
  }
}
