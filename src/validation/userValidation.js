import Joi from 'joi'

 const userValidation = Joi.object().keys({
    surname: Joi.string().trim()
    .min(3).message('Surnane must be atleast 3 letters.')
    .max(30).message('Surnane must not exceed 30 letters.')
    .required().lowercase()
    .regex(/^[A-Za-z]{2,15}$/)
    .message('Surnane Name must consist of only alphabets and 3 to 15 characters'),

    firstName : Joi.string().trim()
    .min(3).message('First Name must be atleast 3 letters.')
    .max(30).message('First Name must not exceed 30 letters.')
    .required().lowercase()
    .regex(/^[A-Za-z]{2,15}$/)
    .message('First Name must consist of only alphabets and 3 to 15 characters'),

    middleName : Joi.string().trim()
    .min(3).message('First Name must be atleast 3 letters.')
    .max(30).message('First Name must not exceed 30 letters.')
    .required().lowercase()
    .regex(/^[A-Za-z]{2,15}$/)
    .message('Middle Name must consist of only alphabets and 3 to 15 characters'),

    primaryEmail: Joi.string().trim().lowercase()
    .trim().email()
    .message('Please provide a valid email!'),

    phoneNumber: Joi.string().trim()
    .regex(/^0[7-9][10][0-9]{8}$/)
    .message('Please provide a valid phone number!'),

    gender: Joi.string().trim()
    .lowercase()
    .regex(/^male|female$/)
    .message('Gender must be male or female'),

    password: Joi.string().trim()
    .min(8).message('Password must be up to 8 characters long')
    .max(16).message('Password must not be more than 16 characters long'),

    confirmPassword: Joi.ref('password')


});


const options ={
    abortEarly: false,
    errors: {
        wrap: {
            lebel: "",
        }
    }
}

export {userValidation,options}