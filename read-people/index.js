const dynamoose = require('dynamoose');

exports.handler = async event => {
  // define a schema for dynamoose / dynamo db
  const peopleSchema = new dynamoose.Schema({
    id: Number,
    firstName: String,
    lastName: String,
    pob: String,
    age: Number,
  });

  const peopleTable = dynamoose.model('people', peopleSchema);

  let data = null;
  let status = 500;

  try {
    // read from our DB
    // const id = event.pathParameters.id;
    const id = event.queryStringParameters && event.queryStringParameters.id;
    // const id = 96;
    console.log('--------->', typeof id, id);
    if (id) {
      const rawData = await peopleTable
        .query('id')
        .eq(+id)
        .exec();
      data = rawData[0];
    } else {
      data = await peopleTable.scan().exec();
    }
    status = 200;
  } catch (e) {
    data = new Error(e);
    status = 400;
  }

  const response = {
    statusCode: status,
    body: JSON.stringify(data),
  };
  return response;
};
