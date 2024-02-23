import { useFormik } from "formik";
import { MockResource } from "../../../api/generated/mocker-config/MockResource";
import { Paper, Grid, Typography, Stack, Button, Divider, TextField, FormControlLabel, Switch, FormControl, InputLabel, Select, MenuItem, Box, } from "@mui/material";
import React from "react";
import { MockRule } from "../../../api/generated/mocker-config/MockRule";
import { appendInList, getFirstAvailableOrder, getFormattedComplexContentType, getFormattedCondition, getFormattedConditionByType, stringfyList } from "../../../util/utilities";
import { Analyzed_content_typeEnum, Condition_typeEnum, Field_positionEnum, MockCondition } from "../../../api/generated/mocker-config/MockCondition";
import { ComplexContentTypeEnum } from "../../../util/constants";
import { Add, CheckCircleOutline, Delete, HighlightOff } from "@mui/icons-material";
import { ButtonNaked } from "@pagopa/mui-italia";
import { MockResponse } from "../../../api/generated/mocker-config/MockResponse";
import { getInjectedParameterTooltip, getRuleConditionTooltip } from "../../../util/tooltips";

type Props = {
  redirectToPreviousPage: () => void,
  onSubmitShowModal: () => void,
  onSubmitNewRuleShowRecord: () => void,
  operation: string,
  mockResource?: MockResource,
  setMockRule: (rule: MockRule) => void,
  mockRule?: MockRule
};

type FormikSupportData = {
  complex_content_type: string,
  field_position: Field_positionEnum | undefined,
  analyzed_content_type: Analyzed_content_typeEnum | undefined,
  field_name: string | undefined,
  condition_type: Condition_typeEnum | undefined,
  condition_value: string | undefined,
  status: number,
  headers: any,
  injected_parameters: any,
  body: string | undefined
}


export const MockRuleHandlingForm = ({redirectToPreviousPage, onSubmitShowModal, onSubmitNewRuleShowRecord, operation, mockResource, setMockRule, mockRule}: Props) => {

  const isHttpStatusInvalid = (value: number | undefined) => !value || value < 200 || value > 599

  const isConditionAnyOrNull = (value: Condition_typeEnum | undefined) => value === Condition_typeEnum.ANY || value === Condition_typeEnum.NULL

  const isDefaultRule = () => operation === 'EDIT' && formik.values.tags.includes('Default')

  const validateFormData = (values: Partial<MockRule & FormikSupportData>) =>
    Object.fromEntries(
      Object.entries({
        ...{
          
          status: isHttpStatusInvalid(values.status) ? "Invalid status code" : undefined
        },
      }
    ).filter(([_key, value]) => value)
  );

  const enableSubmit = (values: Partial<MockRule & FormikSupportData>) => {
    return !isHttpStatusInvalid(values.status) /* ... */;
  }


  const checkIfRuleOrderIsAlreadyTaken = () => {
    let rules = mockResource?.rules;
    let ruleWithTakenOrder = rules?.find((rule) => (rule.order === formik.values.order && rule.id !== mockRule?.id));
    if (formik.values.order <= 0) {
      return (
        <Typography><HighlightOff color="error" sx={{marginRight: 1}}/>Invalid value: the order must be greater than 0.</Typography>
      );
    } else if (ruleWithTakenOrder === undefined) {
      return (
        <Typography><CheckCircleOutline color="success" sx={{marginRight: 1}}/>No existing rule has the same inserted order.</Typography>        
      );
      
    } else {
      return (
        <Typography><HighlightOff color="error" sx={{marginRight: 1}}/>Invalid value: the order is already used for rule "{ruleWithTakenOrder.name}".</Typography>
      );
    }
  }

  const addConditionInRule = () => {
    // check values
    const values = formik.values.complex_content_type.split("_");
    let newMockCondition: MockCondition = {
      order: formik.values.conditions.length + 1,
      field_name: formik.values.field_name!,
      field_position: values[0] as Field_positionEnum,
      analyzed_content_type: values[1] as Analyzed_content_typeEnum,
      condition_type: formik.values.condition_type!,
      condition_value: isConditionAnyOrNull(formik.values.condition_type) ? undefined : formik.values.condition_value,
    };
    // add condition as last element
    formik.values.conditions = appendInList(formik.values.conditions, newMockCondition);
    
    formik.values.complex_content_type = '',
    formik.values.field_position = Field_positionEnum.BODY,
    formik.values.analyzed_content_type = Analyzed_content_typeEnum.STRING,
    formik.values.field_name = '',
    formik.values.condition_type = Condition_typeEnum.ANY,

    onSubmitNewRuleShowRecord();
  }


  const onClickDeleteCondition = (index: number) => {

    var newlyOrderedConditions: MockCondition[] = [];
    formik.values.conditions.forEach(condition => {
      if (condition.order !== index) {
        newlyOrderedConditions.push(condition);
      }      
    })

    let orderCounter = 1;
    newlyOrderedConditions.forEach(condition => {
      condition.order = orderCounter;
      orderCounter++;
    });

    formik.values.conditions = newlyOrderedConditions;

    onSubmitNewRuleShowRecord();
  }

  const initialFormData = (mockRule?: MockRule): MockRule & FormikSupportData => {
    if (operation === 'EDIT' && mockRule) {
      return {
        id: mockRule.id,
        name: mockRule.name,
        is_active: mockRule.is_active,
        order: mockRule.order,
        conditions: mockRule.conditions,
        response: mockRule.response,   
        tags: mockRule.tags, 

        field_position: Field_positionEnum.BODY,
        analyzed_content_type: Analyzed_content_typeEnum.STRING,
        field_name: '',
        condition_type: Condition_typeEnum.ANY,
        condition_value: undefined,
        complex_content_type: ComplexContentTypeEnum.BODY_JSON,
        status: mockRule.response.status,
        headers: stringfyList(mockRule.response.headers, (header) => `${header.name}:${header.value}`),
        injected_parameters: stringfyList(mockRule.response.injected_parameters),
        body: mockRule.response.body ? atob(mockRule.response.body) : ''
      };
    } else {
      return {
        name: "",
        order: getFirstAvailableOrder(mockResource),
        is_active: true,
        conditions: [],
        tags: [],
        response: {
          status: 200,
          headers: [],
          injected_parameters: []
        },

        field_position: Field_positionEnum.BODY,
        analyzed_content_type: Analyzed_content_typeEnum.STRING,
        field_name: '',
        condition_type: Condition_typeEnum.ANY,
        condition_value: undefined,
        complex_content_type: ComplexContentTypeEnum.BODY_JSON,
        status: 200,
        headers: [],
        injected_parameters: [],
        body: undefined
      };
    }
  };  

  const submit = () => {
    formik.handleSubmit(); 

    // set tags
    let formikValues = formik.values;
    
    // set response headers
    let headers = formikValues.headers;
    if (headers.length === 0) {
      headers = [];
    } else if (headers.length > 0 && typeof headers === 'string') {
      let rawHeaders = (formikValues.headers as unknown as string).split(",").map(tag => tag.trim());
      let splitHeaders = rawHeaders.map(header => {
        let split = header.split(":");
        return {name: split[0], value: split[1]};
      });
      headers = splitHeaders;
    }

    // set default injected params
    let injected_parameters = formikValues.injected_parameters;
    if (injected_parameters.length === 0) {
      injected_parameters = [];
    } else if (injected_parameters.length > 0 && typeof injected_parameters === 'string') {
      injected_parameters = (injected_parameters as unknown as string).split(",").map(tag => tag.trim());
    }

    let response: MockResponse = {
      id: formikValues.response.id,
      status: formikValues.status,
      headers: headers,
      injected_parameters: injected_parameters,
      body: btoa(formikValues.body ? formikValues.body : ''),
    }

    let mockRule: MockRule = {
      id: formikValues.id,
      name: formikValues.name,
      is_active: formikValues.is_active,
      order: formikValues.order,
      tags: formikValues.tags,
      conditions: formikValues.conditions,
      response: response
    };

    if (formikValues.tags.length > 0 && typeof formikValues.tags === 'string') {
      mockRule.tags = (formikValues.tags as unknown as string).split(",").map(tag => tag.trim());  
    }

    setMockRule(mockRule);

    onSubmitShowModal();
  }

  const formik = useFormik<MockRule & FormikSupportData>({
    initialValues: initialFormData(mockRule),
    validate: validateFormData,
    onSubmit: () => {},
    enableReinitialize: true,
    validateOnMount: true,
  });

  return (
    <Box id={"box"}>
      <Paper elevation={8} sx={{ marginBottom: 2, borderRadius: 4, p: 4 }}>
        <Grid container alignItems={"center"} spacing={1} mb={2}>
          <Grid item xs={11}>
            <Typography variant="h5">Rule</Typography>
          </Grid>
        </Grid>
        <Divider style={{ marginBottom: 20 }} />
        <Grid container alignItems={"center"} spacing={1} mb={2}>
          <Grid item xs={12}>
            <TextField id="name" label="Rule name" placeholder="Rule name" disabled={isDefaultRule()} required={true} value={formik.values.name} onChange={formik.handleChange} error={formik.touched.name && Boolean(formik.errors.name)} InputLabelProps={{ shrink: true }} sx={{ width: "100%" }} />
          </Grid>
        </Grid>
        <Grid container alignItems={"center"} spacing={1} mb={2}>
          <Grid item xs={2}>
            <TextField id="order" label="Order" type="number" disabled={isDefaultRule()} value={formik.values.order} onChange={formik.handleChange} error={formik.touched.order && Boolean(formik.errors.order)} InputLabelProps={{ shrink: true }} inputProps={{ max: 9999, min: 1}} sx={{ width: "100%" }}/>
          </Grid>
          <Grid item xs={10}>
            <Typography variant="body2">{checkIfRuleOrderIsAlreadyTaken()}</Typography>
          </Grid>
        </Grid>
        <Grid container alignItems={"center"} spacing={1} mb={2}>
          <Grid item xs={9}>
            <TextField id="tags" label="Tags (split by comma)" placeholder="tag1, tag2, ..." disabled={isDefaultRule()} value={formik.values.tags} onChange={formik.handleChange} error={formik.touched.tags && Boolean(formik.errors.tags)} InputLabelProps={{ shrink: true }} sx={{ width: "100%" }}/>
          </Grid>
          <Grid item xs={3}>
            <FormControlLabel label="Is active?" control={<Switch id="is_active" disabled={isDefaultRule()} value={formik.values.is_active} onChange={formik.handleChange} checked={formik.values.is_active}/>} sx={{ ml: 10 }}/>
          </Grid>
        </Grid>
      </Paper>
      
      <Paper elevation={8} sx={{ marginBottom: 2, borderRadius: 4, p: 4 }}>
        <Grid container alignItems={"center"} spacing={1} mb={2}>
          <Grid item xs={11}>
            <Typography variant="h5">
              Conditions
              {getRuleConditionTooltip()}
            </Typography>
          </Grid>
        </Grid>
        <Divider style={{ marginBottom: 20 }} />
        <Grid container alignItems={"center"} spacing={1} mb={2}>
          <Grid item xs={3}>
            <TextField id="field_name" label="Field name" placeholder="Field name" value={formik.values.field_name} onChange={formik.handleChange} error={formik.touched.tags && Boolean(formik.errors.tags)} InputLabelProps={{ shrink: true }} sx={{ width: "100%" }}/>
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth key={`complex_content_type`}>
              <InputLabel>Content type</InputLabel>
              <Select id="analyzed_content_type" required={true} value={formik.values.complex_content_type} onChange={(e) => {formik.setFieldValue('complex_content_type', e.target.value)}} error={formik.touched.complex_content_type && Boolean(formik.errors.complex_content_type)}>
                {Object.keys(ComplexContentTypeEnum).map((type) => (
                  <MenuItem id={`complex_content_type-${type}-menuitem`} key={type} value={type}>
                    {getFormattedComplexContentType(type)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth key={`condition_type`}>
              <InputLabel>Condition type</InputLabel>
              <Select id="condition_type" required={true} value={formik.values.condition_type} onChange={(e) => {formik.setFieldValue('condition_type', e.target.value)}} error={formik.touched.condition_type && Boolean(formik.errors.condition_type)}>
                {Object.keys(Condition_typeEnum).map((type) => (
                    <MenuItem id={`condition_type-${type}-menuitem`} key={type} value={type}>
                      {getFormattedConditionByType(type)}
                    </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            <TextField id="condition_value" label="Condition value" placeholder="Value" disabled={isConditionAnyOrNull(formik.values.condition_type)} value={isConditionAnyOrNull(formik.values.condition_type) ? '' : formik.values.condition_value!} onChange={formik.handleChange} error={formik.touched.condition_value && Boolean(formik.errors.condition_value)} InputLabelProps={{ shrink: true }} sx={{ width: "100%" }}/>
          </Grid>
          <Grid item xs={1}>
            <ButtonNaked size="small" component="button" onClick={addConditionInRule} disabled={isDefaultRule()} startIcon={<Add/>} sx={{color: 'primary.main'}} weight="default"/>
          </Grid>
        </Grid>
        <Grid container alignItems={"center"} spacing={1} mt={3} mb={2}>
          { formik.values.conditions && formik.values.conditions.length > 0 && 
            <ol>
            {
              formik.values.conditions.map(condition => 
                <Grid container alignItems={"center"} id={`${condition.id}-condition`} spacing={1} mb={2}>
                  <Grid item xs={11}>
                    <Typography id={`${condition.order}-typography`} variant="body2">
                      <li id={`${condition.order}-li`} >{getFormattedCondition(condition)}</li>
                    </Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <ButtonNaked id={`${condition.id}-delete-btn`} size="small" component="button" onClick={() => onClickDeleteCondition(condition.order)} startIcon={<Delete/>} sx={{ color: 'error.main' }} weight="default" />
                  </Grid>
                </Grid>
              )
            }
            </ol>
          }
        </Grid>
      </Paper>

      <Paper elevation={8} sx={{ marginBottom: 2, borderRadius: 4, p: 4 }}>
        <Grid container alignItems={"center"} spacing={1} mb={2}>
          <Grid item xs={11}>
            <Typography variant="h5">Response</Typography>
          </Grid>
        </Grid>
        <Divider style={{ marginBottom: 20 }} />
        <Grid container alignItems={"center"} spacing={1} mb={2}>
          <Grid item xs={2}>
            <TextField id="status" label="Status code" type="number" placeholder="200" value={formik.values.status} onChange={formik.handleChange} error={formik.touched.status && Boolean(formik.errors.status)} InputLabelProps={{ shrink: true }} inputProps={{ max: 599, min: 200}} sx={{ width: "100%" }}/>
          </Grid>
          <Grid item xs={10}>
            <TextField id="injected_parameters" label={<>Injected parameters (split by comma) {getInjectedParameterTooltip()}</>} placeholder="req.param1.value1, req.param2.value2, ..." value={formik.values.injected_parameters} onChange={formik.handleChange} error={formik.touched.injected_parameters && Boolean(formik.errors.injected_parameters)} InputLabelProps={{ shrink: true }} sx={{ width: "100%" }}/>
          </Grid>
        </Grid>
        <Grid container alignItems={"center"} spacing={1} mb={2}>
          <Grid item xs={12}>
            <TextField id="headers" label="Headers (split by comma)" placeholder="header1:value, header2:value, ..." value={formik.values.headers} onChange={formik.handleChange} error={formik.touched.headers && Boolean(formik.errors.headers)} InputLabelProps={{ shrink: true }} sx={{ width: "100%" }}/>
          </Grid>
        </Grid>
        <Grid container alignItems={"center"} spacing={1} mb={2}>
          <Grid item xs={12}>
            <TextField id="body" multiline label="Body response (in string, XML or JSON)" rows={20} value={formik.values.body} onChange={formik.handleChange} InputProps={{ sx: {fontSize: '8px', typography: 'caption'} }} InputLabelProps={{ shrink: true }} sx={{ width: '100%', fontSize: '8px', typography: 'caption' }} />
          </Grid>
        </Grid>    

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
      </Paper>
    </Box>
  );
};
