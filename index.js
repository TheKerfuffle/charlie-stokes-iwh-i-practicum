require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();

app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const practicum_token = process.env.PRIVATE_APP_TOKEN;

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get("/", async (req, res) => {
  const getFerries = {
    url: `https://api.hubspot.com/crm/v3/objects/2-33015884?properties=name,ext_ferry_id,port,water_body_type`,
    method: "get",
    headers: {
      Authorization: `Bearer ${practicum_token}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const resp = await axios(getFerries);
    const data = resp.data.results;
    for (let i=0;i<data.length; i++) {
        data[i].properties.water_body_type = data[i].properties.water_body_type.replace("10020","Lake").replace("10021","Strait").replace("10022","Sea").replace("10023","River").replace("10024","Bayou").replace(";",",")
    }
    res.render("homepage", { title: "Ferries", data });
} catch (error) {
    console.error("error in GET /", error);
}
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get("/update-cobj", async (req, res) => {
    res.render("updates", { title: "Update Custom Object Form | Integrating With HubSpot I Practicum." });
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post("/update-cobj", async (req, res) => {
  const newFerry = {
    properties: {
      name: req.body.name,
    },
  };

  const createFerry = {
    url: `https://api.hubspot.com/crm/v3/objects/2-33015884`,
    method: "post",
    headers: {
      Authorization: `Bearer ${practicum_token}`,
      "Content-Type": "application/json",
    },
    data: newFerry,
  };

  try {
    await axios(createFerry);
    res.redirect("/");
  } catch (error) {
    console.error("error in POST /update-cobj", error);
  }
});

/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/

// * Localhost
app.listen(3000, () => console.log("Listening on http://localhost:3000"));
