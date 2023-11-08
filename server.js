let express = require("express")
let {MongoClient, ObjectId} = require("mongodb")
let sanitizeHTML = require("sanitize-html")
let dotenv = require('dotenv')
dotenv.config()

let app = express()
let db;

app.use(express.static('public'))

const getConnect = async () => {
    let client = new MongoClient(process.env.CONNECTIONSTRING)
    await client.connect()
    db = client.db()
    app.listen(process.env.PORT)
  }
  
  getConnect()
  
  app.use(express.urlencoded({extended: false}))
  app.use(express.json())
  app.use(passwordProtected)
  
  function passwordProtected(req, res, next) {
      res.set('WWW-Authenticate', 'Basic realm="Kareem Todo App"')
      console.log(req.headers.authorization)
      if(req.headers.authorization == "Basic a2FyZWVtOmFkbWlu"){

        next()
      } else {
        res.status(401).send("Authen tication  required")
      }
    }

app.get("/",  async (req, res)=>{
  let items = await db.collection('items').find().toArray()
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Simple To-Do App</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
    </head>
    <body>
      <div class="container">
        <h1 class="display-4 text-center py-1"><span style="color:red">Oladega</span> To-Do App</h1>
         
        <div class="jumbotron p-3 shadow-sm">
          <form id="item-field" >
            <div class="d-flex align-items-center" >
              <input id = "create-field" name ="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
              <button class="btn btn-primary">Add New Item</button>
            </div>
          </form>
        </div>
        
        <ul id= "items-list" class="list-group pb-5">
        </ul>
        
      </div>

      <script>
          let items = ${JSON.stringify(items)}
      </script>
      <script src="https://unpkg.com/axios@1.1.2/dist/axios.min.js"></script>
        <script src="/browser.js"></script>
    </body>
    </html>`)
})


app.post("/create-item", async (req, res)=>{
  let safeHTML = sanitizeHTML(req.body.text, {allowedTags: [], allowedAttributes: []})
  const info =  await db.collection("items").insertOne({text:safeHTML})
  res.json({_id: info.insertedId, text:safeHTML})
})

app.post("/update-item", async (req, res) => {
  let safeHTML = sanitizeHTML(req.body.text, {allowedTags: [], allowedAttributes: []})
  const info = await db.collection('items').findOneAndUpdate({_id: new ObjectId(req.body.id)}, {$set:{text:safeHTML}})
  res.json({_id: info.insertedId, text:safeHTML})
  res.send("Success")
})

app.post("/delete-item", async (req, res) => {
  await db.collection("items").deleteOne({_id: new ObjectId(req.body.id)})
})

