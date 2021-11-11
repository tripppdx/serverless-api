const dynamoose = require('dynamoose');

exports.handler = async event => {
  const jsonBody = JSON.parse(event.body);

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
    let id = Math.floor(Math.random() * 100);
    let people = new peopleTable({ id, ...jsonBody });
    data = await people.save();
    status = 200;
  } catch (e) {
    status = 400;
    data = new Error(e);
  }

  const response = {
    statusCode: status,
    body: JSON.stringify(data),
  };
  return response;
};
