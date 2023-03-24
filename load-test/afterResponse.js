function verifyValue(requestParams, response, context, ee, next) {
  const statusCode = parseInt(response.statusCode);
  if (response.statusCode === 200) {
    let responseBody = response.body;
    if (!response.body) {
      return next(
        new Error(
          `${requestParams.url} StatusCode: ${statusCode} responseBody: ${responseBody}`
        )
      );
    }
    responseBody = JSON.parse(responseBody);
    if (responseBody.value === context.vars.value) {
      return next();
    } else {
      return next(new Error(`${requestParams.url} StatusCode: ${statusCode}`));
    }
  }
  return next(new Error(`${requestParams.url} StatusCode: ${statusCode}`));
}

module.exports = {
  verifyValue,
};
