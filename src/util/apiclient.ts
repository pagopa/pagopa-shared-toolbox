import { MockResource } from "../api/generated/MockResource";
import { MockResourceList } from "../api/generated/MockResourceList";
import { WithDefaultsT, createClient } from "../api/generated/client";
import { extractResponse } from "./client-utils";
import { ENV as env } from "./env";


const withEmptyApiKey: WithDefaultsT<'ApiKey'> = (operation) => (params: any) => {
    return operation({
        ...params,
        ApiKey: "",
    });
};

function fetchWithHeader(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const defaultHeaders = {};
    const headers = {
        ...defaultHeaders,
        ...(init?.headers || {})
    };
    return fetch(input, {...init, headers});
}

const mockConfigHost = env.MOCKCONFIG.HOST;
const mockConfigBasePath = env.MOCKCONFIG.BASEPATH;

export const apiClient = createClient({
    baseUrl: mockConfigHost as string,
    basePath: mockConfigBasePath as string,
    fetchApi: fetchWithHeader,
    withDefaults: withEmptyApiKey
});

const setJWTToken = (token: string): string => {
    return `Bearer ${token}`;
}

const onRedirectToLogin = () => {
    window.sessionStorage.removeItem("secret");
    // todo redirect
}

export const MockConfigApi = {

    getMockResources: async (token: string, limit: number, page: number): Promise<MockResourceList> => {
        const result = await apiClient.getMockResources({
            Authorization: setJWTToken(token),
            limit, 
            page
        });
        return extractResponse(result, 200, onRedirectToLogin);
    },

    getMockResource: async (token: string, resourceId: string): Promise<MockResource> => {
        const result = await apiClient.getMockResource({
            Authorization: setJWTToken(token),
            resourceId, 
        });
        return extractResponse(result, 200, onRedirectToLogin);
    },

    deleteMockResource: async (token: string, resourceId: string): Promise<any> => {
        const result = await apiClient.deleteMockResource({
            Authorization: setJWTToken(token),
            resourceId, 
        });
        return extractResponse(result, 204, onRedirectToLogin);
    }
};
