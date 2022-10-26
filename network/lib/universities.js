import myAxiosPrivate, { myAxiosPrivateServerSide } from '../myAxiosPrivate';

export async function getPublicUniversities(limit) {
  try {
    let myAxios = await myAxiosPrivateServerSide();
    let res = await myAxios
      .get(`/universities/public?limit=${limit}`)
      .catch((e) => {
        return e.response;
      });
    return res;
  } catch (error) {
    console.log(error);
  }
}

export async function getUniversities(limit, controller) {
  try {
    let myAxios = await myAxiosPrivate();
    let res = await myAxios
      .get(`/universities?limit=${limit}`, { signal: controller.signal })
      .catch((e) => {
        return e.response;
      });
    return res;
  } catch (error) {
    console.log(error);
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
        return e.response;
      });
    return res;
  } catch (error) {
    console.log(error);
  }
}
