const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware:
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hvuwn.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("ServicesData");
    const servicesCollection = database.collection("Services");
    const addCollection = database.collection("AddData");
    // create a document to insert

    // Post Services  API
    app.post("/Services", async (req, res) => {
      const newService = req.body;
      const result = await servicesCollection.insertOne(newService);
      res.json(result);
    });

    // Get sevices API
    app.get("/Services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const Services = await cursor.toArray();
      res.send(Services);
    });

    // Post AddData  API
    app.post("/AddData", async (req, res) => {
      const newService = req.body;
      const result = await addCollection.insertOne(newService);
      res.json(result);
    });

    // Get sevices API
    app.get("/AddData", async (req, res) => {
      const cursor = addCollection.find({});
      const AddData = await cursor.toArray();
      res.send(AddData);
    });

    app.delete("/AddData/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await addCollection.deleteOne(query);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is on port ${port}`);
});
