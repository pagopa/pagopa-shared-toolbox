import { useFormik } from "formik";
import { Http_methodEnum, MockResource } from "../../../api/generated/MockResource";
import { Paper, Grid, Typography, Divider, Select, MenuItem, Switch, FormControl, Stack, Button, FormControlLabel, TextField, InputLabel, } from "@mui/material";
import React from "react";
import { MockResponse } from "../../../api/generated/MockResponse";

type Props = {
  redirectToPreviousPage: () => void,
  onSubmitShowModal: () => void,
  operation: string,
  setMockResource: (resource: MockResource) => void,
  mockResource?: MockResource
};


export const MockResourceHandlingForm = ({redirectToPreviousPage, onSubmitShowModal, operation, setMockResource, mockResource}: Props) => {
  
  const isStringInvalid = (value: string | undefined) => !value || value === "";

  const isHttpStatusInvalid = (value: number | undefined) => !value || value < 200 || value > 599

  const validateFormData = (values: Partial<MockResource & MockResponse>) =>
    Object.fromEntries(
      Object.entries({
        ...{
          name: isStringInvalid(values.name) ? "Required field" : undefined,
          subsystem: isStringInvalid(values.subsystem) ? "Required field" : undefined,
          status: isHttpStatusInvalid(values.status) ? "Invalid status code" : undefined
        },
      }
    ).filter(([_key, value]) => value)
  );

  const enableSubmit = (values: Partial<MockResource & MockResponse>) => {
    if (operation === "EDIT") {
      return !isStringInvalid(values.name);
    } else {
      return !isStringInvalid(values.name) && !isStringInvalid(values.subsystem) && !isHttpStatusInvalid(values.status);
    }
  }

  const initialFormData = (mockResource?: MockResource): MockResource & MockResponse => {
    if (operation === 'EDIT' && mockResource) {
      return {
        name: mockResource!.name,
        subsystem: mockResource!.subsystem,
        resource_url: mockResource!.resource_url,
        http_method: mockResource!.http_method,
        soap_action: mockResource!.soap_action,
        is_active: mockResource!.is_active,
        rules: mockResource!.rules,
        tags: mockResource!.tags,
        status: 0,
        headers: [],
        injected_parameters: [],    
      };
    } else {
      return {
        name: "",
        http_method: Http_methodEnum.GET,
        is_active: true,
        subsystem: "",
        rules: [
          {
            name: "Parachute Rule",
            conditions: [],
            order: 10000,
            tags: ["Parachute"],
            is_active: true,
            response: {
              status: 200,
              headers: [],
              injected_parameters: []            
            }
          }
        ],
        tags: [],
        status: 200,
        headers: [],
        injected_parameters: [],      
      };
    }
  };  

  const submit = () => {
    formik.handleSubmit(); 
    
    let mockResource = formik.values;
    mockResource.subsystem = `/${mockResource.subsystem}/`.replace(/\/\//g, "/");
    mockResource.resource_url = `/${mockResource.resource_url}/`.replace(/\/\//g, "/");
    console.log("urls:", mockResource.subsystem, mockResource.resource_url);

    // set tags
    if (mockResource.tags.length > 0 && typeof mockResource.tags === 'string') {
      mockResource.tags = (mockResource.tags as unknown as string).split(",").map(tag => tag.trim());  
    }

    if (operation === "CREATE") {

      mockResource.rules[0].response.status = mockResource.status;

      // set parachute body
      let body = mockResource.body;
      mockResource.rules[0].response.body = btoa(body ? body : '');

      // set parachute response headers
      if (mockResource.headers.length > 0 && typeof mockResource.headers === 'string') {
        let rawHeaders = (mockResource.headers as unknown as string).split(",").map(tag => tag.trim());
        let headers = rawHeaders.map(header => {
          let split = header.split(":");
          return {name: split[0], value: split[1]};
        });
        mockResource.rules[0].response.headers = headers;
      }

      // set parachute response headers
      if (mockResource.injected_parameters.length > 0 && typeof mockResource.injected_parameters === 'string') {
        mockResource.rules[0].response.injected_parameters = (mockResource.injected_parameters as unknown as string).split(",").map(tag => tag.trim());
      }
    }

    setMockResource(mockResource);

    onSubmitShowModal();
  }

  const formik = useFormik<MockResource & MockResponse>({
    initialValues: initialFormData(mockResource),
    validate: validateFormData,
    onSubmit: () => {},
    enableReinitialize: true,
    validateOnMount: true,
  });
  


  return (
    <>
      <Paper elevation={8} sx={{ marginBottom: 2, borderRadius: 4, p: 4 }}>
        <Grid container alignItems={"center"} spacing={1} mb={2}>
          <Grid item xs={11}>
            <Typography variant="h5">General info</Typography>
          </Grid>
        </Grid>
        <Divider style={{ marginBottom: 20 }} />
        <Grid container alignItems={"center"} spacing={1} mb={2}>
          <Grid item xs={12}>
            <TextField id="name" label="Resource name" placeholder="Resource name" required={true} value={formik.values.name} onChange={formik.handleChange} error={formik.touched.name && Boolean(formik.errors.name)} InputLabelProps={{ shrink: true }} sx={{ width: "100%" }} />
          </Grid>
        </Grid>
        <Grid container alignItems={"center"} spacing={1} mb={2}>
          <Grid item xs={4}>
            <TextField id="subsystem" label="Resource subsystem" placeholder="/subsystem/path" disabled={operation === "EDIT"} required={true} value={formik.values.subsystem} onChange={formik.handleChange} error={formik.touched.subsystem && Boolean(formik.errors.subsystem)} InputLabelProps={{ shrink: true }} sx={{ width: "100%" }}/>
          </Grid>
          <Grid item xs={3}>
            <TextField id="resource_url" label="Resource URL" placeholder="/path/to/resource?params" disabled={operation === "EDIT"} value={formik.values.resource_url} onChange={formik.handleChange} error={formik.touched.resource_url && Boolean(formik.errors.resource_url)} InputLabelProps={{ shrink: true }} sx={{ width: "100%" }}/>
          </Grid>
          <Grid item xs={2}>
            <FormControl fullWidth key={`http_method`}>
              <InputLabel>HTTP Method</InputLabel>
              <Select id="http_method" disabled={operation === "EDIT"} required={true} value={formik.values.http_method} onChange={(e) => {formik.setFieldValue('http_method', e.target.value); console.log("-dff.ds", formik.values.http_method)}} error={formik.touched.http_method && Boolean(formik.errors.http_method)}>
                {Object.keys(Http_methodEnum).map((method) => (
                  <MenuItem key={method} value={method}>
                    {method}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <TextField id="soap_action" label="SOAP action" placeholder="SOAPAction" disabled={operation === "EDIT"} value={formik.values.soap_action} onChange={formik.handleChange} error={formik.touched.soap_action && Boolean(formik.errors.soap_action)} InputLabelProps={{ shrink: true }} sx={{ width: "100%" }}/>
          </Grid>
        </Grid>
        <Grid container alignItems={"center"} spacing={1} mb={2}>
          <Grid item xs={9}>
            <TextField id="tags" label="Tags (split by comma)" placeholder="tag1, tag2, ..." value={formik.values.tags} onChange={formik.handleChange} error={formik.touched.tags && Boolean(formik.errors.tags)} InputLabelProps={{ shrink: true }} sx={{ width: "100%" }}/>
          </Grid>
          <Grid item xs={3}>
            <FormControlLabel label="Is active?" control={<Switch id="is_active" value={formik.values.is_active} onChange={formik.handleChange} checked={formik.values.is_active}/>} sx={{ ml: 10 }}/>
          </Grid>
        </Grid>
      </Paper>
      {
        operation === "CREATE" &&
        <Paper elevation={8} sx={{ marginBottom: 2, borderRadius: 4, p: 4 }}>
          <Grid container alignItems={"center"} spacing={1} mb={2}>
            <Grid item xs={11}>
              <Typography variant="h5">Parachute rule response</Typography>
            </Grid>
          </Grid>
          <Divider style={{ marginBottom: 20 }} />
          <Grid container alignItems={"center"} spacing={1} mb={2}>
            <Grid item xs={2}>
              <TextField id="status" label="Status code" type="number" placeholder="200" value={formik.values.status} onChange={formik.handleChange} error={formik.touched.status && Boolean(formik.errors.status)} InputLabelProps={{ shrink: true }} sx={{ width: "100%" }}/>
            </Grid>
            <Grid item xs={10}>
              <TextField id="injected_parameters" label="Injected parameters (split by comma)" placeholder="req.param1.value1, req.param2.value2, ..." value={formik.values.injected_parameters} onChange={formik.handleChange} error={formik.touched.injected_parameters && Boolean(formik.errors.injected_parameters)} InputLabelProps={{ shrink: true }} sx={{ width: "100%" }}/>
            </Grid>
          </Grid>
          <Grid container alignItems={"center"} spacing={1} mb={2}>
            <Grid item xs={12}>
              <TextField id="headers" label="Headers (split by comma)" placeholder="header1:value, header2:value, ..." value={formik.values.headers} onChange={formik.handleChange} error={formik.touched.headers && Boolean(formik.errors.headers)} InputLabelProps={{ shrink: true }} sx={{ width: "100%" }}/>
            </Grid>
          </Grid>
          <Grid container alignItems={"center"} spacing={1} mb={2}>
            <Grid item xs={12}>
              <TextField id="body" multiline label="Parachute body response (in string, XML or JSON)" rows={20} value={formik.values.body} onChange={formik.handleChange} InputLabelProps={{ shrink: true }} sx={{ width: '100%', fontSize: '8px', typography: 'caption' }} />
            </Grid>
          </Grid>
        </Paper>
      }

      <Stack direction="row" justifyContent="space-between" mt={5} mb={5}>
        <Stack display="flex" justifyContent="flex-start" mr={2}>
          <Button color="primary" variant="outlined" onClick={redirectToPreviousPage}>
            Back
          </Button>
        </Stack>
        <Stack display="flex" justifyContent="flex-end">
          <Button onClick={submit} disabled={!enableSubmit(formik.values)} color="primary" variant="contained">
            Submit
          </Button>
        </Stack>
      </Stack>
    </>
  );
};
