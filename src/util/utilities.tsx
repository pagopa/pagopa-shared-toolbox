import React from "react";
import { toast } from "react-toastify";
import { Condition_typeEnum, MockCondition } from "../api/generated/mocker-config/MockCondition";
import { ComplexContentTypeEnum } from "./constants";
import { Http_methodEnum, MockResource } from "../api/generated/mocker-config/MockResource";
import { Box, Divider, Typography } from "@mui/material";
import { MockResponse } from "../api/generated/mocker-config/MockResponse";
import { getInjectedParameterTooltip } from "./tooltips";
import xmlFormat from "xml-formatter";

export const appendInList = (list: readonly any[], value: any): any[] => {
  var newList = [];
  list.forEach(valueFromList => {
    newList.push(valueFromList);
  })
  newList.push(value);
  return newList;
}


export const stringfyList = (list: readonly any[], mapValue?: (value: any) => string): string => {
  if (typeof list === 'string') {
    let stringList = [list];
    return stringList.join(", ");
  }
  if (mapValue) {
    return list.map((value) => mapValue(value)).join(", ");
  } 
  return list.join(", ");
}


export const generateCURLRequest = (url: string, mockResource?: MockResource, serialize?: boolean): string => {
  let curl = `curl -X ${mockResource?.http_method} \\\n--location '${url}'`;
  if (mockResource?.special_headers) {
    mockResource?.special_headers.forEach((header) => {
      curl += ` \\\n--header '${header.name}: ${header.value}'`;
    });
  }
  let contentType = "text/plain";
  let content = "write-here-your-body";
  let defaultRule = mockResource?.rules[mockResource.rules.length - 1];
  if (defaultRule !== undefined && defaultRule.response.body !== undefined) {
    let decodedBody = atob(defaultRule.response.body);
    if (decodedBody.startsWith("{")) {
      contentType = "application/json";
      content = '{\n\t"content": "..."\n}';
    } else if (decodedBody.startsWith("<")) {
      contentType = "text/xml";
      content = '<?xml version="1.0" encoding="utf-8"?>\n<Envelope>\n\t<Body>\n\t\t<Content>...</Content>\n\t</Body>\n</Envelope>';
      if (serialize) {
        content = btoa(content);
      }
    }
  }
  curl += ` \\\n--header 'content-type: ${contentType}'`;
  if (mockResource?.http_method !== Http_methodEnum.GET && mockResource?.http_method !== Http_methodEnum.DELETE) {
    curl += ` \\\n--data '${content}'`;
  }
  return curl;
}





export const getFormattedResponseInfo = (response: MockResponse) => {
  let headers = response.headers.map(header => 
    <Typography variant="body2" sx={{ fontSize: '14px'}}>
      <b>{header.name}:</b> <Typography variant="caption" sx={{ fontSize: '14px'}}>{header.value}</Typography>
    </Typography>
  );
  let injected_parameters = response.injected_parameters && response.injected_parameters.length > 0 ? stringfyList(response.injected_parameters) : 'none'
  return (
    <Box>
      <Typography variant="body2" sx={{ fontSize: '14px'}}>
        <b>Status:</b> <Typography variant="caption" sx={{ fontSize: '14px'}}>{response.status}</Typography>
      </Typography>
      <Typography variant="body2" sx={{ fontSize: '14px', marginBottom: 1 }}>
        <b>Injectable parameters: </b> 
        <Typography variant="caption" sx={{ fontSize: '14px'}}>
          {injected_parameters}
          {getInjectedParameterTooltip()}
        </Typography>
      </Typography>
      <Divider/>
      {headers}
    </Box>
  );
}


export const getFormattedBody = (body: string | undefined, isEncoded?: boolean) => {
  let analyzedBody = body;
  if (analyzedBody === undefined) {
    return 'No body';
  }
  if (isEncoded) {
    analyzedBody = atob(analyzedBody);
  }
  if (analyzedBody.startsWith("{")) {
    return JSON.stringify(JSON.parse(analyzedBody), null, 2);
  } else if (analyzedBody.startsWith("<")) {
    return xmlFormat(analyzedBody, {collapseContent: true});
  }
  return analyzedBody;
}


export const getFormattedCondition = (condition: MockCondition) => {
  let conditionValue = <></>;
  switch (condition.condition_type) {
    case Condition_typeEnum.ANY:
      conditionValue = <>can be <b>any non-null value</b></>;
      break;
    case Condition_typeEnum.REGEX:
      conditionValue = <>must follows the regular expression <b>{condition.condition_value}</b></>;
      break;
    case Condition_typeEnum.NULL:
      conditionValue = <>must be <b>null</b></>;
      break;
    case Condition_typeEnum.EQ:
      conditionValue = <>must be <b>equals</b> to <b>{condition.condition_value}</b></>;
      break;
    case Condition_typeEnum.NEQ:
      conditionValue = <>must be <b>not equals</b> to <b>{condition.condition_value}</b></>;
      break;
    case Condition_typeEnum.GE:
      conditionValue = <>must be <b>greater</b> than or <b>equals</b> to <b>{condition.condition_value}</b></>;
      break;
    case Condition_typeEnum.GT:
      conditionValue = <>must be <b>greater</b> than <b>{condition.condition_value}</b></>;
      break;
    case Condition_typeEnum.LE:
      conditionValue = <>must be <b>lower</b> than or <b>equals</b> to <b>{condition.condition_value}</b></>;
      break;
    case Condition_typeEnum.LT:
      conditionValue = <>must be <b>lower</b> than <b>{condition.condition_value}</b></>;
      break;
  }    
  return (<>Field <b>{condition.field_name}</b> in <b>{condition.analyzed_content_type}</b> <b>{condition.field_position}</b> {conditionValue}.</>);
}


export const getFormattedConditionByType = (condition_type: Condition_typeEnum | string) => {
  let conditionValue = "";
  switch (condition_type) {
    case Condition_typeEnum.ANY:
      conditionValue = "can be any non-null value";
      break;
    case Condition_typeEnum.REGEX:
      conditionValue = "must follows the regular expression";
      break;
    case Condition_typeEnum.NULL:
      conditionValue = "must be null";
      break;
    case Condition_typeEnum.EQ:
      conditionValue = "must be equals to";
      break;
    case Condition_typeEnum.NEQ:
      conditionValue = "must be not equals to";
      break;
    case Condition_typeEnum.GE:
      conditionValue = "must be greater than or equals to";
      break;
    case Condition_typeEnum.GT:
      conditionValue = "must be greater than";
      break;
    case Condition_typeEnum.LE:
      conditionValue = "must be lower than or equals to";
      break;
    case Condition_typeEnum.LT:
      conditionValue = "must be lower than";
      break;
  }    
  return conditionValue;
}


export const getFormattedComplexContentType = (type: ComplexContentTypeEnum | string) => {
  let value = "";
  switch (type) {
    case ComplexContentTypeEnum.BODY_JSON:
      value = "as field in JSON body";
      break;
    case ComplexContentTypeEnum.BODY_XML:
      value = "as field in XML body";
      break;
    case ComplexContentTypeEnum.BODY_STRING:
      value = "in stringfied body";
      break;
    case ComplexContentTypeEnum.HEADER_STRING:
      value = "as header in request";
      break;
    case ComplexContentTypeEnum.URL_STRING:
      value = "as query parameter in request URL";
      break;
  }
  return value;
}


export const getFirstAvailableOrder = (mockResource?: MockResource) => {
  const rulesWithoutDefault = mockResource?.rules.slice(0, length - 1) || [];
  if (rulesWithoutDefault.length == 0) {
    return 1;
  } else {
    return rulesWithoutDefault[rulesWithoutDefault.length - 1].order + 1;
  }
}



export const toastOK = (message: string) => {
  toast.success(() => <div className={"toast-width"}>{message}</div>, {
    theme: "colored", autoClose: 2000
  });
}


export const toastError = (message: string) => {
    toast.error(() => <div className={"toast-width"}>{message}</div>, {
      theme: "colored", autoClose: 2000
    });
}