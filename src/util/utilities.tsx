import React from "react";
import { toast } from "react-toastify";

export const toastError = (message: string) => {
    toast.error(() => <div className={"toast-width"}>{message}</div>, {
      theme: "colored",
    });
}