const express = require('express');
const { MongoClient, ServerApiVersion , ObjectId} = require('mongodb');
require('dotenv').config()
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ncq0h0t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    app.post('/addtouristSports', async (req, res) => {
        const tourist = req.body;
        const result = await client.db("TouristDB").collection("tourist").insertOne(tourist);
        res.send(result)
        console.log(result)
    })

    app.post('/addCountry', async (req, res) => {
        const country = req.body;
        const result = await client.db("TouristDB").collection("country").insertOne(country);
        res.send(result)
        console.log(result)
    })

    app.get('/countryyy', async (req, res) => {
        const cursor = client.db("TouristDB").collection("country").find();
        const result = await cursor.toArray();
        res.send(result)
    })

    app.get('/touristSports', async (req, res) => {
        const cursor = client.db("TouristDB").collection("tourist").find();
        const result = await cursor.toArray();
        res.send(result)
       
    })

    app.get("/touristSports/:email", async (req, res) => {
      console.log(req.params.email)
      const productCollection = client.db("TouristDB").collection("tourist");
      const result = await productCollection.find({ email: req.params.email }).toArray();
      res.send(result)
    })

    app.get("/tourist/:id" , async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await client.db("TouristDB").collection("tourist").findOne(query);
      res.send(result)

    })

    app.put("/touristsss/:id" , async (req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const updateDoc = { $set: req.body }
      const result = await client.db("TouristDB").collection("tourist").updateOne(filter, updateDoc);
      res.send(result)
    })

    app.delete("/delete/:id" , async (req, res) => {

      const result = await client.db("TouristDB").collection("tourist").deleteOne({_id: new ObjectId(req.params.id)})

      res.send(result)
      
    })

    app.get('/sortTourist', async (req, res) => {
      try {
          // Fetch tourist data from the database and sort by average cost
          const result = await client.db("TouristDB").collection("tourist").find().sort({ averageCost: 1 }).toArray();
          res.send(result);
      } catch (error) {
          console.error("Error fetching and sorting tourist data:", error);
          res.status(500).send("Internal Server Error");
      }
  });
  

  app.get('/countryyyy/:countryName', async (req, res) => {
    try {
        const countryName = req.params.countryName;
        const result = await client.db("TouristDB").collection("tourist").find({ country_Name: countryName }).toArray();
        res.send(result);
        console.log(result)
    } catch (error) {
        console.error("Error fetching country data:", error);
        res.status(500).send("Internal Server Error");
    }

   
});



    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World! i am rahe')
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})