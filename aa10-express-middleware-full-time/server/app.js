const express = require('express');
const app = express();
app.use(express.json())
require('express-async-errors');


const dogsRouter = require('./routes/dogs');
const foodsRouter = express.Router({ mergeParams: true });

// app.use((req, res, next) => {
//   const error = new Error();
//   error.statusCode = 500;
//   next(error);
// })
app.use('dogs/:dogid/foods', foodsRouter);

app.use('/dogs', dogsRouter);





const logger = (req, res, next) => {

  res.on('finish', () => {
    // read and log the status code of the response
    console.log(req.method, req.path, res.statusCode);
  });
  next();
}

app.use(logger);

// For testing purposes, GET /
app.get('/', (req, res) => {
  res.json("Express server running. No content provided at root level. Please use another route.");
});

// For testing express.json middleware
app.post('/test-json', (req, res, next) => {
  // send the body as JSON with a Content-Type header of "application/json"
  // finishes the response, res.end()
  res.json(req.body);
  next();
});



// For testing express-async-errors
app.get('/test-error', async (req, res) => {
  throw new Error("Hello World!")
});
app.use((req, res, next) => {
  const error = new Error("The requested resource couldn't be found.");
  error.statusCode = 500;
  next(error);
})

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.statusCode || 500)
  //console.log(process.env.NODE_ENV);
  if (process.env.NODE_ENV == 'production') {
    res.json({
      message: err.message,
      statusCode: err.statusCode
    });
  } else {
    res.json({
      message: err.message,
      statusCode: err.statusCode,
      stack: err.stack
    });
  }
})

const port = process.env.PORT;
app.listen(port, () => console.log('Server is listening on port', port));
