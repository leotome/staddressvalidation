const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended : true }));

require("./routes/routes")(app);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`The server is running on ${PORT}`);
})

app.use(express.static("public"));