const app = require('./app');
const port = process.env.PORT || 1534;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});