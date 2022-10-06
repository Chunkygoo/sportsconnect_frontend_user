import myAxiosPrivate from '../myAxiosPrivate';

export async function sendEmail(payload) {
  try {
    let myAxios = await myAxiosPrivate();
    return await myAxios.post(`/emails/send_email`, payload).catch((e) => {
      return e.response;
    });
  } catch (error) {
    console.log(error);
  }
}
