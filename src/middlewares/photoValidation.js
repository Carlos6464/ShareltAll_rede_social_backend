const { body } = require("express-validator");

const photoInsertValiadtion = () => {
  return [
    body('title')
        .not()
        .equals(undefined)
        .withMessage("O titulo é obrigatório.")
        .isString()
        .withMessage("O titulo é obrigatório.")
        .isLength({min:3})
        .withMessage("O titulo precisa ter no minimo 3 caracteres."),
    body("image")
        .custom((value, {req}) => {
          if(!req.file){
            throw new Error("A imagem é obrigatória.")
          }
          return true;
        }),
  ];
};

const updatePhotoValidation = () => {
  return [
    body("title")
        .isString()
        .withMessage("O titulo é obrigatório.")
        .isLength({min:3})
        .withMessage("O titulo precisa ter no minimo 3 caracteres."),
  ];
}

const commentPhotoValidation = () => {
  return[
    body("comment")
      .isString()
      .withMessage("O comentário é obrigatório.")
      .isLength({min:3})
      .withMessage("O comentário precisa ter no minimo 3 caracteres."),
  ];
 
};



module.exports = {
  photoInsertValiadtion,
  updatePhotoValidation,
  commentPhotoValidation
}