export const createUserValidationSchema = {
    name: {
        notEmpty: {
            errorMessage: {
                "Name cannot be empty": true
            }
        }
    },
    age:{
        notEmpty: {
            errorMessage: {
                "Age cannot be empty": true
            }
        }
    } ,
    nickname: {
        notEmpty: {
            errorMessage: {
                "Username cannot be empty": true
            }
        }
    },
    password:{
        isLength: {
            options: {
                min: 8,
            },
            errorMessage: {
                "Password must be between 3 and 20 characters": true
            }
        },
        notEmpty: {
            errorMessage: {
                "Password cannot be empty": true
            }
        }
    },
     
}

export const authValidationSchema = {
    nickname: {
        notEmpty: {
            errorMessage: {
                "Username cannot be empty": true
            }
        },
        isString: {
            errorMessage: {
                "Username must be a string": true
            }
        }
    },
    password:{
        notEmpty: {
            errorMessage: {
                "Password cannot be empty": true
            }
        },
        isString: {
            errorMessage: {
                "Password must be a string": true
            }
        }
    }
}

export const createProductValidationSchema = {
    name: {
        notEmpty: {
            errorMessage: {
                "Name cannot be empty": true
            }
        },
        isString: {
            errorMessage: {
                "Name must be a string": true
            }
        }
    },
    price: {
        notEmpty: {
            errorMessage: {
                "Price cannot be empty": true
            }
        }
    }
}