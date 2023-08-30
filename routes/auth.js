const express = require('express');
const bcrypt = require('bcrypt');
const { uuid } = require('uuidv4');
const router = express.Router(); // Make sure you're using express.Router()
const User = require('../models/User');
const Store = require('../models/Store');
const jwt = require('jsonwebtoken');
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(422).json({ error: "Please fill your details" });
      }
      try {
          const userExist = await User.findOne({ email: email });
          if (userExist)
          {
               return res
            .status(422)
            .json({ error: "Email or Phone number already exists" });
          }
          // Hash the password before saving
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(password, saltRounds);
          const user = new User({ username, email, password: hashedPassword });
          
          const userRegister = await user.save();
          if (userRegister)
          {
               res.status(201).json({ message: "User registered successfully" });
              }
        
      } catch (err) {
          console.log(err);
          
    }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Create a JWT token
    const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '40h' }); // Change the secret key
    res.json({
      message: "Login Successful",
      email: user.email,
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
});
router.post('/create-store', async (req, res) => {
  const { email , password } = req.body;
  if (!password) {
    return res.status(422).json({ error: "Please fill your details" });
  }
  try {
    const store = await Store.findOne({ email });
    if(store){
      const token = jwt.sign({ storeId: store._id }, 'your-secret-key', { expiresIn: '1h' }); // Change the secret key
      res.status(201).json({
        message: "Store create successfully",
        name:store.name,
        token,
      });
    }
  }catch (error) {
  }
  try {
    const name = uuid()
    console.log(email)
    const emails = [email]
    // Hash the password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const store = new Store({ name,  password: hashedPassword });
    store.users = emails;
    const storeCreate = await store.save();
    if (storeCreate)
    {
      const token = jwt.sign({ storeId: store._id }, 'your-secret-key', { expiresIn: '1h' }); // Change the secret key
      res.status(201).json({
        message: "Store create successfully",
        name,
        token,
      });
    }
  }catch(err) {
    console.log(err);
  }
});
router.post('/link-store', async (req, res) => {
  const { name, password, email} = req.body;

  try {
    const store = await Store.findOne({ name });
    if (!store) {
      return res.status(401).json({ message: 'Store not found' });
    }
    store.users.push(email);
    store.save();
    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, store.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Create a JWT token
    const token = jwt.sign({ storeId: store._id }, 'your-secret-key', { expiresIn: '1h' }); // Change the secret key
    res.json({
      message: "Link Successful",
      token
    });
  }catch(err) {
    console.log(err);
  }
});
router.post('/createCamera', async (req, res) => {
  const { name,  ip , port , channel , username, password , StoreName , email} = req.body;

  if (!name || !ip || !port || !channel || !username || !StoreName || !email || !password )  {
    return res.status(422).json({ error: "Please fill your details" });
  }
  
  try {
    const store = await Store.findOne({ name:StoreName });
    
    if(!store.users.includes(email)){
      return res.status(422).json({ error: "no auth" });
    }
    if(store){
      store.cameras.push({
        name,
        ip,
        port,
        channel,
        username,
        password,
      })
      store.save()
      return res.status(201).json({
        message: "Camera create successfully",
      });
    }
  }catch (error) {
  }
});
router.post('/GetCameras', async (req, res) => {
  const { StoreName , email} = req.body;
  
  if (!email || !StoreName)  {
    return res.status(422).json({ error: "Please fill your details" });
  }
  
  try {
    const store = await Store.findOne({ name:StoreName });
    
    if(!store.users.includes(email)){
      return res.status(422).json({ error: "no auth" });
    }
    if(store){
      return res.send(store.cameras)
    }
  }catch (error) {
  }
});
router.post('/mCamera', async (req, res) => {
  const { camera, formData, StoreName , email , index} = req.body;
  console.log(index)
  if (!StoreName || !email || !camera || !formData)  {
    return res.status(422).json({ error: "Please fill your details" });
  }

  
  try {
    const store = await Store.findOne({ name:StoreName });
    if(store){
      if(!store.users.includes(email)){
        return res.status(422).json({ error: "no auth" });
      }
      store.cameras[index] = formData;
      store.save();
      return res.status(201).json({
        message: "Camera modify successfully",
      });
    }
  } catch(error){

  }
});


router.post('/rCamera', async (req, res) => {
  const { StoreName , email , index} = req.body;

  if (!StoreName || !email)  {
    return res.status(422).json({ error: "Please fill your details" });
  }
  console.log(req.body)
  
  try {
    const store = await Store.findOne({ name:StoreName });
    if(store){
      if(!store.users.includes(email)){
        return res.status(422).json({ error: "no auth" });
      }
      store.cameras = store.cameras.splice(index-1,1);
      store.save();
      return res.status(201).json({
        message: "Camera modify successfully",
      });
    }
  } catch(error){

  }
});
module.exports = router; // Export the router
