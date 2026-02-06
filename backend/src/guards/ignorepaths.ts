enum Method {
  Post = 'POST',
  Put = 'PUT',
  Get = 'GET',
  Delete = 'DELETE',
}
export const ignorePath: { [key: string]: { methods: Method[] } } = {
  // status check
  '/': { methods: [Method.Get] },
  // clinitian paths
  '/clinician': { methods: [Method.Put, Method.Post] },
  '/clinician/login': { methods: [Method.Post] },

  // patient paths
  '/patient': { methods: [Method.Put, Method.Post] },
  '/patient/login': { methods: [Method.Post] },
};
