import axios from 'axios';
import FormData from 'formdata-node';

const apiKey = process.env.MAILGUN_API_KEY || '';
export const sendMail = (options: any) => {
  const data = jsonToFormData(options);
  if (!data) return;
  return axios
    .post(`https://api.mailgun.net/v3/planapi.aidbox.io/messages`, data.stream, {
      headers: data.headers,
      auth: {
        username: 'api',
        password: apiKey,
      },
    })
    .then(console.log)
    .catch((err) => {
      console.log(err.response);
    });
};

const jsonToFormData = (json: any) => {
  let formData = new FormData();
  if (typeof json === 'object') {
    for (const key in json) {
      formData.set(key, json[key]);
    }
    return formData;
  } else {
    return false;
  }
};
