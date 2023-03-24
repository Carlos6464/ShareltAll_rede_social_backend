require("dotenv").config();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Types } = require("mongoose");
  const jwtSecret = process.env.JWT_SECRET;

//gerador de token para login
const generateToken = (id) => {
  return jwt.sign({id}, jwtSecret, {
    expiresIn: "7d",
  });
 
};
//função de registro e login do usuario
const Register = async (req, res) => {
  const {name, email, password} = req.body;

  //verificar se o usuario já esta cadastardo no sistema.
  const user = await User.findOne({email});
  if(user){
    res.status(422).json({errors: ["Por favor, utilize outro e-mail."]});
    return;
  } 

  //gerar hash da senha
  const salt = await bcrypt.genSalt()
  const passwordHash = await bcrypt.hash(password, salt)

  //criar usuario no banco
  const newUser = await User.create({
    name,
    email,
    password: passwordHash
  });

  if(!newUser){
    res.status(422).json({errors:["Houve um error, por favor tente mais tarde."]});
    return
  }

  return  res.status(201).json({
    _id: newUser._id,
    token: generateToken(newUser._id),
  });
};

const Login = async (req, res) => {
     const {email, password} = req.body;

     const user = await User.findOne({email})

     if(!user){
      res.status(422).json({errors: ["Usuário não encontrado."]});
      return;
    } 

    if(!(await bcrypt.compare(password, user.password))){
      res.status(404).json({errors: ["Senha inválida."]});
      return;
    }

    res.status(201).json({
      _id: user._id,
      nome: user.name,
      profileImage: user.profileImage,
      token: generateToken(user._id),
    });

};

//pagina do usuario
const getCurrentUser = async (req, res) => {
  const user = req.user;
  res.status(200).json(user);
}

const Update = async (req, res) => {
  const {name, password, bio} = req.body;
  let profileImage = null;

  if (req.file){
    profileImage = req.file.filename;
  }

  const reqUser = req.user;
  const objectId = new Types.ObjectId(reqUser._id)
  const user = await User.findById(objectId).select("-password");

 

 if(name){
    user.name = name;
  }

  if(password){
    //gerar hash da senha
    const salt = await bcrypt.genSalt()
    const passwordHash = await bcrypt.hash(password, salt)
    user.password = passwordHash
  }

  if(profileImage){
    user.profileImage = profileImage
  }

  if(bio) {
    user.bio = bio;
  }

  await user.save();

  res.status(200).json(user);

}

//encontrar o usuario pelo id
const getByUserId = async (req, res) => {
  const {id} = req.params;


  try {
    const objectId = new Types.ObjectId(id)
    const user = await User.findById(objectId).select("-password");
    if(!user){
      res.status(404).json({errors: ["Usuário não encontrado"]});
      return;
    }
  
    res.status(200).json(user)
  } catch (error) {
    res.status(422).json({errors: ["Id invalido."]});
    return;
  }
}

  

module.exports = {
  Register,
  Login,
  getCurrentUser,
  Update,
  getByUserId
}