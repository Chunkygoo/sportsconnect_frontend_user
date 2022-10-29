import myAxiosPrivate from '../myAxiosPrivate';

export async function sendEmail(payload) {
  try {
    let myAxios = await myAxiosPrivate();
    return await myAxios.post(`/emails/send_email`, payload).catch((e) => {
      throw new Error(e);
    });
  } catch (error) {
    throw new Error(error);
  }
}
