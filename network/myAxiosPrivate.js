import axios from 'axios';
import Session from 'supertokens-auth-react/recipe/session';

const getCsrfToken = async () => {
  try {
    let res = await axios
      .get(`${process.env.NEXT_PUBLIC_API_DATA_URL}/auth/csrf_token`, {
        withCredentials: true,
      })
      .catch((e) => {
        throw new Error(e);
      });
    return res.data.csrf_token;
  } catch (error) {
    throw new Error(error);
  }
};

export const myAxiosPrivateServerSide = () => {
  const myAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_RAW_URL,
  });
  Session.addAxiosInterceptors(myAxios);
  return myAxios;
};

export default async function myAxiosPrivate() {
  try {
    const csrfToken = await getCsrfToken();
    const myAxios = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_DATA_URL,
      headers: { 'x-csrf-token': csrfToken },
      withCredentials: true,
    });
    Session.addAxiosInterceptors(myAxios);
    return myAxios;
  } catch (error) {
    throw new Error(error);
  }
}
