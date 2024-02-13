import {Box, IconButton, Typography} from '@mui/material';
import {GridColDef, GridColumnHeaderParams, GridRenderCellParams} from '@mui/x-data-grid';
import React, {CSSProperties, ReactNode} from 'react';
import { CheckCircleOutline, HighlightOff, RemoveCircle, RemoveRedEye } from '@mui/icons-material';
import { stringfyList } from '../../../util/utilities';



export function buildColumnDefs(onClickDetail: (row: any) => void, onClickDelete: (row: any) => void) {
  return [
    {
      field: 'is_active',
      cellClassName: 'justifyContentNormal',
      headerName: '',
      align: 'center',
      hideSortIcons: true,
      disableColumnMenu: true,
      editable: false,
      renderHeader: showCustomHeader,
      renderCell: (params) => showStatus(params),
      sortable: false,
      flex: 1,
    },
    {
      field: 'name',
      cellClassName: 'justifyContentNormal',
      headerName: 'Name',
      align: 'left',
      headerAlign: 'center',
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params: any) => showName(params, 40),
      sortable: false,
      flex: 4,
    },
    {
      field: 'complete_url',
      cellClassName: 'justifyContentItalic',
      headerName: 'URL',
      align: 'left',
      headerAlign: 'center',
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) => showCompleteURL(params, 60),
      sortable: false,
      flex: 5,
    },
    {
      field: 'http_method',
      cellClassName: 'justifyContentNormal',
      headerName: 'Method',
      align: 'left',
      headerAlign: 'left',
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
      align: 'left',
      headerAlign: 'left',
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) => renderCell(params, undefined),
      sortable: false,
      flex: 3,
    },
    {
      field: 'tags',
      cellClassName: 'justifyContentNormal',
      headerName: 'Tags',
      align: 'left',
      headerAlign: 'left',
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) => showLabels(params),
      sortable: false,
      flex: 2,
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
        const resourceDetail = (<IconButton onClick={() => onClickDetail(params)}><RemoveRedEye sx={{ color: 'seagreen', fontSize: '24px' }}/></IconButton>);
        const resourceDelete = (<IconButton onClick={() => onClickDelete(params)}><RemoveCircle sx={{ color: 'error.dark', fontSize: '20px' }}/></IconButton>);
        return [resourceDetail, resourceDelete];
      },
      sortable: false,
      flex: 2,
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

  export function showName(params: GridRenderCellParams, maxSize: number) {
    params.row.name = params.row.name.length > maxSize ? `${params.row.name.substring(0, maxSize - 3)}...` : params.row.name;
    return renderCell(params,  undefined);
  }
  
  export function showCompleteURL(params: GridRenderCellParams, maxSize: number) {
    params.row.complete_url = `${params.row.subsystem}/${params.row.resource_url ? params.row.resource_url : ''}`.replace('//', "");
    params.row.complete_url = params.row.complete_url.length > maxSize ? `${params.row.complete_url.substring(0, maxSize - 3)}...` : params.row.complete_url;
    return renderCell(params,  undefined);
  }
  
  export function showStatus(params: GridRenderCellParams) {
    return renderCell(params,        
      <>
        { params.row.is_active && <CheckCircleOutline color="success" sx={{marginLeft: '20px'}} /> }
        { !params.row.is_active && <HighlightOff color="error" sx={{marginLeft: '20px'}} /> }
      </>
    );
  }

  export function showLabels(params: GridRenderCellParams) {
    if(typeof params.row.tags === 'object') {
      params.row.tags = stringfyList(params.row.tags);
    }    
    return renderCell(params, undefined);
  }
  