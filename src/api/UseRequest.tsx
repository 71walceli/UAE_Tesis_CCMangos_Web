// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AlertContext } from "../context/AlertContext";
import { useLoader } from "./../hooks/useLoader";
import axios, { AxiosError, AxiosResponse } from "axios";

import {
  ApiErrorResponse,
  AuthInterface,
  TokenResponse,
} from "../interfaces/modeld";
import { useAuth } from "./../context/AuthContext";
import { Endpoints } from "./routes";

export const useRequest = () => {
  const { showLoader, hideLoader } = useLoader();

  //#region AxiosConfig
  const {  login,  UserData, isAuthenticated } = useAuth();
  const ApiTokenRequest = axios.create({
    baseURL: Endpoints.BaseURL + Endpoints.Api + Endpoints.login,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });

  const ApiRequest = axios.create({
    baseURL: Endpoints.BaseURL + Endpoints.Api,
    headers: {
      "Content-Type": "application/json",
      ...(UserData?.access_token !== ""  && UserData?.access_token !==undefined? { Authorization: `Bearer ${UserData?.access_token}` } : {}),
    },
  });

  const ApiPostFileRequest = axios.create({
    baseURL: Endpoints.BaseURL + Endpoints.Api,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${UserData?.access_token}`,
    },
  });

  const getRequest = async <T extends unknown>(
    endpoint: string,
    params?: object,
  ): Promise<T> => {
    return await ApiRequest.get(endpoint, { params })
      .then(({ data }: AxiosResponse<T>) => data)
      .catch((error: AxiosError<ApiErrorResponse>) => {
        //ShowAlertApiError(error);
        throw error;
      })
  };

  const postRequest = async <T extends unknown>(
    endpoint: string,
    data?: object,
    params?: object
  ): Promise<T> => {
    console.log("post??");
    return await ApiRequest.post(endpoint, data, { params })
      .then(({ data }: AxiosResponse<T>) => data)
      .catch((error: AxiosError<ApiErrorResponse>) => {
        //ShowAlertApiError(error);
        throw error;
      })
  };

  const postRequestToken = async <T extends TokenResponse>(
    data: AuthInterface
  ): Promise<T> => {
    return await ApiTokenRequest.request({
      data,
    })
      .then(({ data }: AxiosResponse<T>) => {
        login(data);
        console.log(data);
        return data;
      })
      .catch((error: AxiosError<ApiErrorResponse>) => {
        console.log(JSON.stringify(error, null, 3));
        throw error;
      })
  };

  const postFileRequest = async <T extends unknown>(
    endpoint: string,
    data?: object,
    params?: object
  ): Promise<T> => {
    return await ApiPostFileRequest.post(endpoint, data, { params })
      .then(({ data }: AxiosResponse<T>) => data)
      .catch((error: AxiosError<ApiErrorResponse>) => {
        throw error;
      })
  };

  return { getRequest, postRequestToken, postRequest, postFileRequest };
};
