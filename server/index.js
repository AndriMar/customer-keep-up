const createApp = require('./app');

const PORT = +(process.env.PORT || '4000');
const app = createApp();

app.listen(PORT, () => {
  console.log(`Server starting on port: ${PORT}`);
  console.log(`Server running in mode: ${process.env.NODE_ENV}`);
});
