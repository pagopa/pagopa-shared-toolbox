import {Box, Button, Grid, Typography} from '@mui/material';
import {GridColDef, GridColumnHeaderParams, GridRenderCellParams} from '@mui/x-data-grid';
import React, {CSSProperties, ReactNode} from 'react';
import { CheckCircleOutline, HighlightOff, RemoveCircle, RemoveRedEye } from '@mui/icons-material';



export function buildColumnDefs(onClickDetail: (row: any) => void, onClickDelete: (row: any) => void) {
  return [
    {
      field: 'name',
      cellClassName: 'justifyContentBold',
      headerName: 'Name',
      align: 'left',
      headerAlign: 'center',
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params: any) => renderCell(params, undefined),
      sortable: false,
      flex: 3,
    },
    {
      field: 'complete_url',
      cellClassName: 'justifyContentNormal',
      headerName: 'URL',
      align: 'left',
      headerAlign: 'center',
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) => showCompleteURL(params),
      sortable: false,
      flex: 3,
    },
    {
      field: 'http_method',
      cellClassName: 'justifyContentNormal',
      headerName: 'Method',
      align: 'center',
      headerAlign: 'center',
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) => renderCell(params, undefined),
      sortable: false,
      flex: 1,
    },
    {
      field: 'soap_action',
      cellClassName: 'justifyContentNormal',
      headerName: 'SOAP Action',
      align: 'center',
      headerAlign: 'center',
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) => renderCell(params, undefined),
      sortable: false,
      flex: 2,
    },
    {
      field: 'tags',
      cellClassName: 'justifyContentNormal',
      headerName: 'Tags',
      align: 'center',
      headerAlign: 'center',
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) => renderCell(params, undefined),
      sortable: false,
      flex: 2,
    },
    {
      field: 'is_active',
      cellClassName: 'justifyContentNormal',
      headerName: 'Active',
      align: 'center',
      hideSortIcons: true,
      disableColumnMenu: true,
      editable: false,
      renderHeader: showCustomHeader,
      renderCell: (params) => showStatus(params),
      sortable: false,
      flex: 0,
    },
    {
      field: 'actions',
      cellClassName: 'justifyContentNormal',
      type: 'actions',
      headerName: '',
      align: 'center',
      hideSortIcons: true,
      disableColumnMenu: true,
      editable: false,
      getActions: (params: any) => {
        const resourceDetail = (<Button variant='naked' startIcon={<RemoveRedEye/>} onClick={() => onClickDetail(params)}></Button>);
        const resourceDelete = (<Button variant='naked' startIcon={<RemoveCircle/>} onClick={() => onClickDelete(params)}></Button>);
        return [resourceDetail, resourceDelete];
      },
      sortable: false,
      flex: 1,
    },
  ] as Array<GridColDef>;
}


export function renderCell(params: GridRenderCellParams, value: ReactNode = params.value, overrideStyle: CSSProperties = {}) {
    return (
      <Box sx={{
          width: '100%',
          height: '100%',
          paddingTop: '8px',
          paddingBottom: '8px',
          WebkitBoxOrient: 'vertical' as const,
          ...overrideStyle,
        }}
      >
        <Box
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical' as const,
            width: '100%',
            fontSize: '14px',
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
        <Typography color="colorTextPrimary" variant="caption" sx={{ fontWeight: 'fontWeightBold', outline: 'none', paddingLeft: 1 }}>
          {params.colDef.headerName}
        </Typography>
      </React.Fragment>
    );
  }
  
  export function showCompleteURL(params: GridRenderCellParams) {
    let completeURL = `${params.row.subsystem}/${params.row.resource_url ? params.row.resource_url : ''}`.replace("//", "/");
    return (
      <React.Fragment>
        {renderCell(
          params,
          <>
            <Grid container sx={{ width: '100%' }}>
              <Grid item xs={12} sx={{ width: '100%' }}>
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{
                    fontWeight: 'fontWeightMedium',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical' as const,
                  }}
                >
                  {completeURL}
                </Typography>
              </Grid>
            </Grid>
          </>
        )}
      </React.Fragment>
    );
  }
  
  export function showStatus(params: GridRenderCellParams) {
    return renderCell(params,        
      <Box>
        { params.row.is_active && <CheckCircleOutline color="success" /> }
        { !params.row.is_active && <HighlightOff color="error"/> }
      </Box>
    );
  }
  