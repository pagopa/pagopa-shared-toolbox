import React from "react";
import { toast } from "react-toastify";
import { Condition_typeEnum, MockCondition } from "../api/generated/mocker-config/MockCondition";
import { ComplexContentTypeEnum } from "./constants";
import { Http_methodEnum, MockResource } from "../api/generated/mocker-config/MockResource";

export const appendInList = (list: readonly any[], value: any): any[] => {
  var newList = [];
  list.forEach(valueFromList => {
    newList.push(valueFromList);
  })
  newList.push(value);
  return newList;
}

export const stringfyList = (list: readonly any[], mapValue?: (value: any) => string): string => {
  if (mapValue) {
    return list.map((value) => mapValue(value)).join(", ");
  }
  return list.join(", ");
}

export const generateCURLRequest = (url: string, request?: MockResource): string => {
  let curl = `curl -X ${request?.http_method} \\\n--location '${url}'`;
  if (request?.special_headers) {
    request?.special_headers.forEach((header) => {
      curl += ` \\\n--header '${header.name}: ${header.value}'`;
    });
  }
  if (request?.http_method !== Http_methodEnum.GET && request?.http_method !== Http_methodEnum.DELETE) {
    curl += ` \\\n--header 'content-type: text'`;
    curl += ` \\\n--data 'write-here-your-body'`;
  }
  return curl;
}

export const toastError = (message: string) => {
    toast.error(() => <div className={"toast-width"}>{message}</div>, {
      theme: "colored",
    });
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
      value = "as parameter in request URL";
      break;
  }
  return value;
}