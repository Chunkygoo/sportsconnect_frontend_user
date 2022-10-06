import axios from 'axios';

export default function useCsrfToken() {
  let getCsrfToken = async () => {
    let res = await axios
      .get(`${process.env.NEXT_PUBLIC_API_DATA_URL}/auth/csrf_token`, {
        withCredentials: true,
      })
      .catch((e) => {
        return e.response;
      });
    return res.data?.csrf_token;
  };
  return getCsrfToken;
}
