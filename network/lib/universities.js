import myAxiosPrivate, { myAxiosPrivateServerSide } from '../myAxiosPrivate';

export async function getPublicUniversities(
  limit,
  controller,
  skip = 0,
  search = ''
) {
  try {
    let myAxios = myAxiosPrivateServerSide();
    let res = await myAxios
      .get(
        `/universities/public?limit=${limit}&skip=${skip}&search=${search}`,
        {
          signal: controller?.signal,
        }
      )
      .catch((e) => {
        throw new Error(e);
      });
    return res;
  } catch (error) {
    if (error.message !== 'CanceledError: canceled') {
      throw new Error(e);
    }
  }
}

export async function getUniversities(
  limit,
  controller,
  skip = 0,
  search = ''
) {
  try {
    let myAxios = await myAxiosPrivate();
    let res = await myAxios
      .get(`/universities?limit=${limit}&skip=${skip}&search=${search}`, {
        signal: controller.signal,
      })
      .catch((e) => {
        throw new Error(e);
      });
    return res;
  } catch (error) {
    if (error.message !== 'CanceledError: canceled') {
      throw new Error(e);
    }
  }
}

export async function getInterestedUniversities(
  limit,
  controller,
  skip = 0,
  search = ''
) {
  try {
    let myAxios = await myAxiosPrivate();
    let res = await myAxios
      .get(
        `/universities/interested_only?limit=${limit}&skip=${skip}&search=${search}`,
        {
          signal: controller.signal,
        }
      )
      .catch((e) => {
        throw new Error(e);
      });
    return res;
  } catch (error) {
    if (error.message !== 'CanceledError: canceled') {
      throw new Error(e);
    }
  }
}
