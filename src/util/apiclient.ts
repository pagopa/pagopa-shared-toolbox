import { MockResource } from "../api/generated/MockResource";
import { MockResourceGeneralInfo } from "../api/generated/MockResourceGeneralInfo";
import { MockResourceList } from "../api/generated/MockResourceList";
import { MockRule } from "../api/generated/MockRule";
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

    createMockResource: async (token: string, mockResource: MockResource): Promise<MockResource> => {
        const result = await apiClient.createMockResource({
            Authorization: setJWTToken(token),
            body: mockResource, 
        });
        return extractResponse(result, 201, onRedirectToLogin);
    },

    createMockRule: async (token: string, resourceId: string, mockRule: MockRule): Promise<MockResource> => {
        const result = await apiClient.createMockRule({
            Authorization: setJWTToken(token),
            resourceId,
            body: mockRule, 
        });
        return extractResponse(result, 201, onRedirectToLogin);
    },

    updateMockResource: async (token: string, resourceId: string, mockResource: MockResource): Promise<MockResource> => {
        const result = await apiClient.updateMockResource({
            Authorization: setJWTToken(token),
            resourceId,
            body: mockResource, 
        });
        return extractResponse(result, 200, onRedirectToLogin);
    },

    updateMockResourceGeneralInfo: async (token: string, resourceId: string, mockResource: MockResourceGeneralInfo): Promise<MockResource> => {
        const result = await apiClient.updateMockResourceGeneralInfo({
            Authorization: setJWTToken(token),
            resourceId,
            body: mockResource, 
        });
        return extractResponse(result, 200, onRedirectToLogin);
    },

    updateMockRule: async (token: string, resourceId: string, ruleId: string, mockRule: MockRule): Promise<MockResource> => {
        const result = await apiClient.updateMockRule({
            Authorization: setJWTToken(token),
            resourceId,
            ruleId,
            body: mockRule, 
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
