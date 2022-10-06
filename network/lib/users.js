import myAxiosPrivate from '../myAxiosPrivate';

export async function getCurrentUser(controller) {
  try {
    let myAxios = await myAxiosPrivate();
    let res = await myAxios
      .get(`/users/me`, { signal: controller.signal })
      .catch((e) => {
        return e.response;
      });
    return res;
  } catch (error) {
    console.log(error);
  }
}

export async function updateUser(updateObject) {
  try {
    let myAxios = await myAxiosPrivate();
    let res = await myAxios.put(`/users`, updateObject).catch((e) => {
      return e.response;
    });
    return res;
  } catch (error) {
    console.log(error);
  }
}

export async function uploadProfilePhoto(formData) {
  try {
    let myAxios = await myAxiosPrivate();
    let res = await myAxios
      .post('/users/profile_photo', formData)
      .catch((e) => {
        return e.response;
      });
    return res;
  } catch (error) {
    console.log(error);
  }
}

export async function expressInterestInUni(uniId) {
  try {
    let myAxios = await myAxiosPrivate();
    let res = await myAxios.post(`/users/interest/${uniId}`).catch((e) => {
      return e.response;
    });
    return res;
  } catch (error) {
    console.log(error);
  }
}

export async function removeInterestInUni(uniId) {
  try {
    let myAxios = await myAxiosPrivate();
    let res = await myAxios.delete(`/users/interest/${uniId}`).catch((e) => {
      return e.response;
    });
    return res;
  } catch (error) {
    console.log(error);
  }
}

export async function getUser(controller, userId) {
  try {
    let myAxios = await myAxiosPrivate();
    let res = await myAxios
      .get(`/users/public/${userId}`, { signal: controller?.signal })
      .catch((e) => {
        return e.response;
      });
    return res;
  } catch (error) {
    console.log(error);
  }
}
