module.exports.handler = async (event, context, callback) => {
  return callback(null, {
    statusCode: 200,
    statusDescription: '200 OK',
    headers: {'Set-cookie': 'cookies', 'Content-Type': 'application/json'},
    body: JSON.stringify({
      message: 'Successfully called the API with authentication',
      event: event,
    }),
  });
};
