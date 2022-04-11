const queryComposer = (url, params) => {
  return url && params && Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));
};

export default queryComposer;
