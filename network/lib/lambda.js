import myAxiosPrivate from '../myAxiosPrivate';

export async function keepLambdaWarm() {
  try {
    let myAxios = await myAxiosPrivate();
    let res = await myAxios.get(`/healthdata`).catch((e) => {
      throw new Error(e);
    });
    return res;
  } catch (error) {
    throw new Error(error);
  }
}
