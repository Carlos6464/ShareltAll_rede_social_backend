const { body} = require("express-validator")

const userCreateValitaion = () => {
  return [
      body("name")
          .isString()
          .withMessage("O nome é obrigatório.")
          .isLength({min: 3})
          .withMessage("O nome precisa ter no minimo 3 caracteres."),
      body("email")
          .isString()
          .withMessage("O Email é obrigatório.")
          .isEmail()
          .withMessage("O email precisa ter formato de email."),
      body("password")
          .isString()
          .withMessage("A senha é obrigatória.")
          .isLength({min: 6})
          .withMessage("A senha precisa ter no minimo 6 caracteres."),
      body("confirmPassword")
          .isString()
          .withMessage("Confirmação de senha é obrigatória.")
          .custom((value, {req}) => {
                if(value != req.body.password){
                    throw new Error("As senhas não são iguais.")
                }
                return true;
          }),   
  ];
};


const loginValidation = () => {
    return [
        body("email")
        .isString()
        .withMessage("O Email é obrigatório.")
        .isEmail()
        .withMessage("O email precisa ter formato de email."),
    body("password")
        .isString()
        .withMessage("A senha é obrigatória.")
    ]

};

const userUpdateValidation = () => {
    return [
        body("name")
            .optional()
            .isLength({min: 3})
            .withMessage("O nome precisa ter no minimo 3 caracteres."),
        body("password")
            .optional()
            .isLength({min: 6})
            .withMessage("A senha precisa ter no minimo 6 caracteres."),
    ]

}

module.exports = {
  userCreateValitaion,
  loginValidation,
  userUpdateValidation
};