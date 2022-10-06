import myAxiosPrivate from '../myAxiosPrivate';

export async function createEducation(createObject) {
  try {
    let myAxios = await myAxiosPrivate();
    let res = await myAxios.post(`/educations`, createObject).catch((e) => {
      return e.response;
    });
    return res;
  } catch (error) {
    console.log(error);
  }
}

export async function getEducations(controller) {
  try {
    let myAxios = await myAxiosPrivate();
    let res = await myAxios
      .get(`/educations`, { signal: controller.signal })
      .catch((e) => {
        return e.response;
      });
    return res;
  } catch (error) {
    console.log(error);
  }
}

export async function updateEducation(id, updateObject) {
  try {
    let myAxios = await myAxiosPrivate();
    let res = await myAxios
      .put(`/educations/${id}`, updateObject)
      .catch((e) => {
        return e.response;
      });
    return res;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteEducation(id) {
  try {
    let myAxios = await myAxiosPrivate();
    let res = await myAxios.delete(`/educations/${id}`).catch((e) => {
      return e.response;
    });
    return res;
  } catch (error) {
    console.log(error);
  }
}

export async function getEducationsForUser(controller, userId) {
  try {
    let myAxios = await myAxiosPrivate();
    let res = await myAxios
      .get(`/educations/user/${userId}`, { signal: controller.signal })
      .catch((e) => {
        return e.response;
      });
    return res;
  } catch (error) {
    console.log(error);
  }
}
