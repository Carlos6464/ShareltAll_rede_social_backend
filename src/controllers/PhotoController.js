const Photo = require("../models/Photo");
const User = require("../models/User");

const {Types} = require("mongoose");

const insertPhoto = async (req, res) => {
  const {title} = req.body;
  const image = req.file.filename;

  const reqUser = req.user;
  const user = await User.findById(reqUser._id);


  const newPhoto = await Photo.create({
    image,
    title,
    userId: user._id,
    userName: user.name,
  });

  if(!newPhoto) {
    res.status(422).json({
      errors: ["Houve um problema, por favor tente mais tarde."]
    });
    return;
  };
  res.status(200).json(newPhoto);
}

const deletePhoto = async(req, res) => {
  const {id} = req.params;
  const reqUser = req.user;
 
  try {
    const objectId =  new Types.ObjectId(id);
    const photo = await Photo.findById(objectId);
    if(!photo){
      res.status(404).json({
        errors: ["Foto não encontrada."]
      })
      return;
    };
    if(!photo.userId.equals(reqUser._id)){
      res.status(422).json({
        errors: ["Houve um problema, por favor tente mais tarde."]
      })
      return;
    }
    await Photo.findByIdAndDelete(photo._id);
  
    res.status(200).json({
      id: photo._id,
      message: "Foto excluida com sucesso!"
    });
    
  } catch (error) {
    res.status(404).json({
      errors: ["Foto não encontrada."]
    })
    return;
  }
};

const getAllPhotos = async(req, res) => {
  const photos = await Photo.find({}).sort([["createdAt", -1]]).exec()

  res.status(200).json(photos);
};

const getUserPhotos = async (req, res) => {
  const {id} = req.params;
  try {
    const photos = await Photo.find({userId: id}).sort([['createdAt', -1]]).exec();
    res.status(200).json(photos) 
  } catch (error) {
    res.status(404).json({
      errors: ["Fotos não encontradas."]
    })
    return;
  }
};

const getPhotoById = async (req, res) => {
  const {id} = req.params;
  try {
    const objectId =  new Types.ObjectId(id);
    const photo = await Photo.findById(objectId);
    if(!photo){
      res.status(404).json({
        errors: ["Foto não encontrada."]
      })
      return;
    }
    res.status(200).json(photo);
  } catch (error) {
    res.status(404).json({
      errors: ["Foto não encontrada."]
    })
    return;
  }
};

const updatePhoto = async (req,res) => {
    const {id} = req.params;
    const {title} = req.body;
    const reqUser = req.user;

    try {
      const photo = await Photo.findById(id);
      if(!photo){
        res.status(404).json({
          errors: ["Foto não encontrada."]
        });
        return;
      };

      if(!photo.userId.equals(reqUser._id)){
        res.status(422).json({
          errors: ["Houve um problema, por favor tente mais tarde."]
        })
        return;
      }
      if(title){
        photo.title = title;
      };

      await photo.save()

      res.status(200).json({photo, message: "Foto atualizada com sucesso!"});
    } catch (error) {
      res.status(404).json({
        errors: ["Foto não encontrada."]
      });
      return;
    }
   
};

const likePhoto = async (req, res) => {
  const {id} = req.params;
  const reqUser = req.user;
  try {
    const photo = await Photo.findById(id);
    if(!photo){
      res.status(404).json({
        errors: ["Foto não encontrada."]
      });
      return;
    };
    if(photo.likes.includes(reqUser._id)){
      return res.status(422).json({
        errors: ["Você ja curtiu a foto"]
      })
    }
   
    //caso não tenha like do usúario, adicionar o like a foto
    photo.likes.push(reqUser._id);
    await photo.save();
    res.status(200).json({photoId: id, userId: reqUser._id, message: "A foto foi curtida."})

  } catch (error) {
    res.status(404).json({
      errors: ["Foto não encontrada."]
    });
    return;
  }
};

const disLikePhoto = async(req, res) => {
  const {id} = req.params;
  const reqUser = req.user;

  const photo = await Photo.findById(id);

  if(!photo){
    return res.status(404).json({
      errors: ["Foto não encontrada."]
    })
  };
   //verificar se a foto ja foi curtida pelo usuario, caso não retirar o like dele da foto 
   if(photo.likes.includes(reqUser._id)){
    photo.likes.splice(photo.likes.indexOf(reqUser._id), 1);
    await photo.save();
    res.status(200).json({photoId: id, userId: reqUser._id, message: "Você não goutou da foto."})
    return;
  }
  
}



const commentPhoto = async (req, res) => {
  const {id} = req.params;
  const {comment} = req.body;
  const reqUser = req.user;
  try {
    const user = await User.findById(reqUser._id);
    const photo = await Photo.findById(id);
    if(!photo){
      res.status(404).json({
        errors: ["Foto não encontrada."]
      });
      return;
    };

    const userComment = {
      comment,
      userName: user.name,
      userImage: user.profileImage,
      userId: user._id
    }
    photo.comments.push(userComment);
    await photo.save();
    res.status(200).json({
      comment: userComment,
      message: "O comentário foi adicionado com sucesso!"
    });

  } catch (error) {
      res.status(404).json({
        errors: ["Foto não encontrada."]
      });
      return;
  }
};

const searchPhotos = async (req,res) => {
  const {q} = req.query;
  const photos = await Photo.find({title: new RegExp(q, "i")}).exec();

  res.status(200).json(photos);
};

module.exports = {
  insertPhoto,
  deletePhoto,
  getAllPhotos,
  getUserPhotos,
  getPhotoById,
  updatePhoto,
  likePhoto,
  disLikePhoto,
  commentPhoto,
  searchPhotos
}