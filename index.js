const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken')
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(cors({
  origin:[
    'https://international-blogs.web.app',
    'http://localhost:5173'
  ],
  credentials: true
}));
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.brerg1p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: false,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });


    const itemCollection = client.db('internationalBlogs').collection('blog');
    const commentCollection = client.db('internationalBlogs').collection('comments');
    const wishlistCollection = client.db('internationalBlogs').collection('wishlist');
    itemCollection.createIndex( { title: "text", description: "text" } )

    app.get('/blogs', async (req, res) => {
      const cursor = itemCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get(`/blogs/searched/:title`, async (req, res) => {
      const query = req.params.title
      const result = await itemCollection.find( { $text: { $search: query } } ).toArray();
      res.send(result);
    })

    app.get('/blogs/featured', async (req, res) => {
      const data = await itemCollection.find().toArray();
      data.sort((a,b)=>b.detailed_description - a.detailed_description)
      const result = data.slice(0,10);
      res.send(result);
    })

    app.get('/blogs/dateSorted', async (req, res) => {
      const data = await itemCollection.find().toArray();
      data.sort((a,b)=>b.time - a.time)
      const result = data.slice(0,6);
      res.send(result);
    })

    app.post('/blogs', async (req, res) => {
      const newBlog = req.body;
      const result = await itemCollection.insertOne(newBlog);
      res.send(result)
    })
    app.post('/jwt', async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'})
      res.cookie('token', token,{
        httpOnly:true,
        secure:true,
        sameSite: 'none'
      })
      .send({success:true})
    })

    app.post('/logout', async(req, res)=>{
      const user = req.body
      res.clearCookie('token', {maxAge:0}).send({success:true})
    })

    app.get('/comments', async (req, res) => {
      const cursor = commentCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/comments', async (req, res) => {
      const newComment = req.body;
      const result = await commentCollection.insertOne(newComment);
      res.send(result)
    })

    app.get('/comments/:id', async (req, res) => {
      const id = req.params.id;
      const query = { blogId: id }
      const result = await commentCollection.find(query).toArray();
      res.send(result)
    })


    app.get('/wishlist', async (req, res) => {
      const cursor = wishlistCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/wishlist', async (req, res) => {
      const newWishlist = req.body;
      const result = await wishlistCollection.insertOne(newWishlist);
      res.send(result)
    })

    app.delete('/wishlist/id/:id', async (req, res) => {
      let id = req.params.id;
      id = id.replace(/"/g, '')
      console.log(id);
      const query = { _id: id }
      console.log(query);
      const result = await wishlistCollection.deleteOne(query);
      res.send(result)
    })

    app.get('/wishlist/:email', async (req, res) => {
      let email = req.params.email;
      email = email.replace(/"/g, '')
      const query = { wishReq: email }
      const result = await wishlistCollection.find(query).toArray();
      res.send(result)
    })


    app.get('/blogs/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await itemCollection.findOne(query);
      res.send(result)
    })
    app.delete('/blogs/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await itemCollection.deleteOne(query);
      res.send(result)
    })
    app.patch('/blogs/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const updatedBlog = req.body;
      const updateDoc = {
        $set: {
          name: updatedBlog.name,
          title: updatedBlog.title,
          image: updatedBlog.image,
          email: updatedBlog.email,
          short_description: updatedBlog.short_description,
          detailed_description: updatedBlog.detailed_description,
          category: updatedBlog.category,
          userEmail: updatedBlog.userEmail,
          userImg: updatedBlog.userImg,
          time: updatedBlog.time,
        }
      }
      const result = await itemCollection.updateOne(filter, updateDoc)
      res.send(result)
    })


    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('server is running')
})

app.listen(port, () => {
  console.log(`International blogs running on port ${port}`);
})