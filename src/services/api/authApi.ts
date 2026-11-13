
import axios from 'axios';

const API_URL = 'https://dummyjson.com';

const client = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

export type AuthUser = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image?: string;
};

export type LoginResponse = AuthUser & {
  accessToken: string;
  refreshToken: string;
};

export const loginUser = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  console.log('========== LOGIN REQUEST ==========');
  console.log('METHOD: POST');
  console.log('SERVER:', API_URL);
  console.log('ENDPOINT: /auth/login');
  console.log('USERNAME:', username);
  console.log('PASSWORD: [HIDDEN]');

  const response = await client.post<LoginResponse>(
    '/auth/login',
    {
      username: username.trim(),
      password,
      expiresInMins: 30,
    }
  );

  console.log('========== LOGIN RESPONSE ==========');
  console.log('STATUS:', response.status);
  console.log('USER ID:', response.data.id);
  console.log('USERNAME:', response.data.username);
  console.log(
    'ACCESS TOKEN RECEIVED:',
    Boolean(response.data.accessToken)
  );
  console.log(
    'REFRESH TOKEN RECEIVED:',
    Boolean(response.data.refreshToken)
  );

  return response.data;
};

export const getAuthUser = async (
  accessToken: string
): Promise<AuthUser> => {
  console.log('========== AUTH REQUEST ==========');
  console.log('METHOD: GET');
  console.log('URL:', `${API_URL}/auth/me`);
  console.log('AUTHORIZATION: Bearer [HIDDEN]');

  const response = await client.get<AuthUser>(
    '/auth/me',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  console.log('AUTH STATUS:', response.status);
  console.log('AUTH USER:', response.data.username);

  return response.data;
};

export const refreshAuthToken = async (
  refreshToken: string
): Promise<{
  accessToken: string;
  refreshToken: string;
}> => {
  const response = await client.post('/auth/refresh', {
    refreshToken,
    expiresInMins: 30,
  });

  return response.data;
};

export const registerUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
) => {
  const response = await client.post('/users/add', {
    firstName,
    lastName,
    email,
    password,
  });

  return response.data;
};
