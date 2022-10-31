import myAxiosPrivate from '../myAxiosPrivate';

export async function createEducation(createObject) {
  try {
    let myAxios = await myAxiosPrivate();
    let res = await myAxios.post(`/educations`, createObject).catch((e) => {
      throw new Error(e);
    });
    return res;
  } catch (error) {
    if (error.message !== 'CanceledError: canceled') {
      throw new Error(error);
    }
  }
}

export async function getEducations(controller) {
  try {
    let myAxios = await myAxiosPrivate();
    let res = await myAxios
      .get(`/educations`, { signal: controller.signal })
      .catch((e) => {
        throw new Error(e);
      });
    return res;
  } catch (error) {
    if (error.message !== 'CanceledError: canceled') {
      throw new Error(error);
    }
  }
}

export async function updateEducation(id, updateObject) {
  try {
    let myAxios = await myAxiosPrivate();
    let res = await myAxios
      .put(`/educations/${id}`, updateObject)
      .catch((e) => {
        throw new Error(e);
      });
    return res;
  } catch (error) {
    if (error.message !== 'CanceledError: canceled') {
      throw new Error(error);
    }
  }
}

export async function deleteEducation(id) {
  try {
    let myAxios = await myAxiosPrivate();
    let res = await myAxios.delete(`/educationsxxx/${id}`).catch((e) => {
      throw new Error(e);
    });
    return res;
  } catch (error) {
    if (error.message !== 'CanceledError: canceled') {
      throw new Error(error);
    }
  }
}

export async function getEducationsForUser(controller, userId) {
  try {
    let myAxios = await myAxiosPrivate();
    let res = await myAxios
      .get(`/educations/user/${userId}`, { signal: controller.signal })
      .catch((e) => {
        throw new Error(e);
      });
    return res;
  } catch (error) {
    if (error.message !== 'CanceledError: canceled') {
      throw new Error(error);
    }
  }
}
