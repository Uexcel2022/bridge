import Joi from 'joi'

export const userValidation = Joi.object().keys({
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

    phoneNumber: Joi.string().trim().required()
    .regex(/^0[7-9][10][0-9]{8}$/)
    .message('Please provide a valid phone number!'),

    gender: Joi.string().trim()
    .lowercase().required()
    .regex(/^male|female$/)
    .message('Gender must be male or female'),

    password: Joi.string().trim().required()
    .min(8).message('Password must be up to 8 characters long')
    .max(16).message('Password must not be more than 16 characters long'),

    comfirmPassword: Joi.ref('password')

});


export const userNameValidation = Joi.object().keys({
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

    gender: Joi.string().trim()
    .lowercase().required()
    .regex(/^male|female$/)
    .message('Gender must be male or female')
})



export const PhoneValidation = Joi.object().keys({
    phoneNumber: Joi.string().trim().required()
    .regex(/^0[7-9][10][0-9]{8}$/)
    .message('Please provide a valid phone number!')
})


export const emailValidation = Joi.object().keys({
    email: Joi.string().required()
    .lowercase().trim().email()
    .message('Please provide a valid email!'),
})

export const recruiterValidation = Joi.object().keys({
    email: Joi.string().required()
    .lowercase().trim().email()
    .message('Please provide a valid email!'),

    phone: Joi.string().trim().required()
    .regex(/^0[7-9][10][0-9]{8}$/)
    .message('Please provide a valid phone number!'),

    password: Joi.string().trim().required()
    .min(8).message('Password must be up to 8 characters long')
    .max(16).message('Password must not be more than 16 characters long'),

    comfirmPassword: Joi.ref('password')
})

export const options ={
    abortEarly: false,
    errors: {
        wrap: {
            lebel: "",
        }
    }
}
