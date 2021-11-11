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
    const id = event.queryStringParameters && event.queryStringParameters.id;

    const rawData = await peopleTable
      .query('id')
      .eq(+id)
      .exec();
    if (rawData[0]) {
      await peopleTable.delete(+id);
      status = 200;
      data = 'Successfully deleted an item';
    } else {
      data = 'Enter valid id to delete';
    }
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
