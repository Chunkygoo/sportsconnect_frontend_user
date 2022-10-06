import myAxiosPrivate from '../myAxiosPrivate';

export async function createExperience(createObject) {
  try {
    let myAxios = await myAxiosPrivate();
    let res = await myAxios.post(`/experiences`, createObject).catch((e) => {
      return e.response;
    });
    return res;
  } catch (error) {
    console.log(error);
  }
}

export async function getExperiences(controller) {
  try {
    let myAxios = await myAxiosPrivate();
    let res = await myAxios
      .get(`/experiences`, { signal: controller.signal })
      .catch((e) => {
        return e.response;
      });
    return res;
  } catch (error) {
    console.log(error);
  }
}

export async function updateExperience(id, updateObject) {
  try {
    let myAxios = await myAxiosPrivate();
    let res = await myAxios
      .put(`/experiences/${id}`, updateObject)
      .catch((e) => {
        return e.response;
      });
    return res;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteExperience(id) {
  try {
    let myAxios = await myAxiosPrivate();
    let res = await myAxios.delete(`/experiences/${id}`).catch((e) => {
      return e.response;
    });
    return res;
  } catch (error) {
    console.log(error);
  }
}

export async function getExperiencesForUser(controller, userId) {
  try {
    let myAxios = await myAxiosPrivate();
    let res = await myAxios
      .get(`/experiences/user/${userId}`, { signal: controller.signal })
      .catch((e) => {
        return e.response;
      });
    return res;
  } catch (error) {
    console.log(error);
  }
}
