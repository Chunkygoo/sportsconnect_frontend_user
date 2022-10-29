import myAxiosPrivate, { myAxiosPrivateServerSide } from '../myAxiosPrivate';

export async function getPublicUniversities(limit) {
  try {
    let myAxios = await myAxiosPrivateServerSide();
    let res = await myAxios
      .get(`/universities/public?limit=${limit}`)
      .catch((e) => {
        throw new Error(e);
      });
    return res;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getUniversities(limit, controller) {
  try {
    let myAxios = await myAxiosPrivate();
    let res = await myAxios
      .get(`/universities?limit=${limit}`, { signal: controller.signal })
      .catch((e) => {
        throw new Error(e);
      });
    return res;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getInterestedUniversities(limit, controller) {
  try {
    let myAxios = await myAxiosPrivate();
    let res = await myAxios
      .get(`/universities/interested_only?limit=${limit}`, {
        signal: controller.signal,
      })
      .catch((e) => {
        throw new Error(e);
      });
    return res;
  } catch (error) {
    throw new Error(error);
  }
}
