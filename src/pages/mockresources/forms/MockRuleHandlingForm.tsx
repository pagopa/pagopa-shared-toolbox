import { useFormik } from "formik";
import { MockResource } from "../../../api/generated/MockResource";
import { Paper, Grid, Typography, Stack, Button, } from "@mui/material";
import React from "react";
import { MockResponse } from "../../../api/generated/MockResponse";
import { MockRule } from "../../../api/generated/MockRule";

type Props = {
  redirectToPreviousPage: () => void,
  onSubmitShowModal: () => void,
  operation: string,
  mockResource?: MockResource,
  setMockRule: (rule: MockRule) => void,
  mockRule?: MockRule
};


export const MockRuleHandlingForm = ({redirectToPreviousPage, onSubmitShowModal, operation, mockResource, setMockRule, mockRule}: Props) => {

  const isHttpStatusInvalid = (value: number | undefined) => !value || value < 200 || value > 599

  const validateFormData = (values: Partial<MockResource & MockResponse>) =>
    Object.fromEntries(
      Object.entries({
        ...{
          
          status: isHttpStatusInvalid(values.status) ? "Invalid status code" : undefined
        },
      }
    ).filter(([_key, value]) => value)
  );

  const enableSubmit = (values: Partial<MockResource & MockResponse>) => {
    return !isHttpStatusInvalid(values.status) /* ... */;
  }

  const initialFormData = (mockRule?: MockRule): MockRule => {
    if (operation === 'EDIT' && mockRule) {
      return {
        id: mockRule.id,
        name: mockRule.name,
        is_active: mockRule.is_active,
        order: mockRule.order,
        conditions: mockRule.conditions,
        response: mockRule.response,   
        tags: mockRule.tags, 
      };
    } else {
      return {
        name: "",
        order: -1,
        is_active: false,
        conditions: [],
        tags: [],
        response: {
          status: 200,
          headers: [],
          injected_parameters: []
        },    
      };
    }
  };  

  const formik = useFormik<MockRule>({
    initialValues: initialFormData(mockRule),
    validate: validateFormData,
    onSubmit: () => {
      onSubmitShowModal();

      // set tags
      let mockRule = formik.values;
      
      if (mockRule.tags.length > 0 && typeof mockRule.tags === 'string') {
        mockRule.tags = (mockRule.tags as unknown as string).split(",").map(tag => tag.trim());  
      }

      if (operation === "CREATE") {

        
      }

      setMockRule(mockRule);
    },
    enableReinitialize: true,
    validateOnMount: true,
  });
  

  console.log("mockResource needed for other rules checks", mockResource);

  return (
    <Paper elevation={8} sx={{ marginBottom: 2, borderRadius: 4, p: 4 }}>
      <Grid container alignItems={"center"} spacing={0} mb={2}>
        <Grid item xs={11}>
          <Typography variant="h5">...</Typography>
        </Grid>
      </Grid>


      <Stack direction="row" justifyContent="space-between" mt={5} mb={5}>
        <Stack display="flex" justifyContent="flex-start" mr={2}>
          <Button color="primary" variant="outlined" onClick={redirectToPreviousPage}>
            Back
          </Button>
        </Stack>
        <Stack display="flex" justifyContent="flex-end">
          <Button onClick={() => { onSubmitShowModal(); formik.handleSubmit(); }} disabled={!enableSubmit(formik.values)} color="primary" variant="contained">
            Submit
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};
