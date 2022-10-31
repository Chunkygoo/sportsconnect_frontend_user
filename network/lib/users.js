import myAxiosPrivate from '../myAxiosPrivate';

export async function getCurrentUser(controller) {
  try {
    let myAxios = await myAxiosPrivate();
    let res = await myAxios
      .get(`/users/me`, { signal: controller.signal })
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

export async function updateUser(updateObject) {
  try {
    let myAxios = await myAxiosPrivate();
    let res = await myAxios.put(`/users`, updateObject).catch((e) => {
      throw new Error(e);
    });
    return res;
  } catch (error) {
    if (error.message !== 'CanceledError: canceled') {
      throw new Error(error); // instead of redirecting, we want to rollback our optimistic updates
    }
  }
}

export async function uploadProfilePhoto(formData) {
  try {
    let myAxios = await myAxiosPrivate();
    let res = await myAxios
      .post('/users/profile_photoz', formData)
      .catch((e) => {
        throw new Error(e);
      });
    return res;
  } catch (error) {
    if (error.message !== 'CanceledError: canceled') {
      throw new Error(error); // instead of redirecting, we want to rollback our optimistic updates
    }
  }
}

export async function expressInterestInUni(uniId) {
  try {
    let myAxios = await myAxiosPrivate();
    let res = await myAxios.post(`/users/interest/${uniId}`).catch((e) => {
      throw new Error(e);
    });
    return res;
  } catch (error) {
    if (error.message !== 'CanceledError: canceled') {
      throw new Error(error);
    }
  }
}

export async function removeInterestInUni(uniId) {
  try {
    let myAxios = await myAxiosPrivate();
    let res = await myAxios.delete(`/users/interest/${uniId}`).catch((e) => {
      throw new Error(e);
    });
    return res;
  } catch (error) {
    if (error.message !== 'CanceledError: canceled') {
      throw new Error(error);
    }
  }
}

export async function getUser(controller, userId) {
  try {
    let myAxios = await myAxiosPrivate();
    let res = await myAxios
      .get(`/users/public/${userId}`, { signal: controller?.signal })
      .catch((e) => {
        throw new Error(e);
      });
    return res;
  } catch (error) {
    if (error.message !== 'CanceledError: canceled') {
      throw new Error(error); // ssr has no window
    }
  }
}
