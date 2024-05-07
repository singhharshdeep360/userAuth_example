//import mongo collections, bcrypt and implement the following data functions
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import { users } from "../config/mongoCollections.js";


function isEmailValid(email)
{
    if(!email)
    {
        return false;
    }
    if (typeof email != 'string' || email.trim().length === 0)
    {
        return false;
    }
    if(!(/^[a-zA-Z0-9.!#$%&‘*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email)))
    {
        return false;
    } // https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address
    return true;
}

export const createUser = async (
  firstName,
  lastName,
  emailAddress,
  password,
  role
) => 
{
  if(!firstName || !lastName || !emailAddress || !password || !role)
  {
    throw `Error: missing parameters`;
  }
  if(typeof firstName != 'string' || typeof lastName != 'string' || firstName.trim().length === 0 || lastName.trim().length === 0)
  {
    throw `Error: firstName and lastName must be non empty strings.`
  }
  if(/[0-9]/.test(firstName) || /[0-9]/.test(lastName)) //https://codingbeautydev.com/blog/javascript-check-if-string-contains-numbers/
  {
    throw `firstName and lastName must not have any numbers.`
  }
  firstName = firstName.trim();
  lastName = lastName.trim();
  if(firstName.length < 2 || lastName.length < 2 || firstName.length > 25 || lastName.length > 25 )
  {
    throw `Error: firstName and lastName must be at least 2 charcters long with max of 25 characters. `
  }
  
  if(!isEmailValid(emailAddress))
  {
    throw `invalid Email.`
  }
  emailAddress = emailAddress.toLowerCase();
  let userCollection = await users()
  let user = await userCollection.findOne({emailAddress: emailAddress});
  if(user)
  {
    throw `there is already a user with that email address`;
  }
  
  if(typeof password != 'string' || password.trim().length === 0 || password.trim().length < 8)
  {
    throw `Error: password must be a non empty string with minimum 8 characters`;
  }
  if(!(/[A-Z]/.test(password)) ||!(/[0-9]/.test(password)) || !(/[\W_]/.test(password)) || (/\s/g.test(password)) ) //https://stackoverflow.com/questions/1731190/check-if-a-string-has-white-space
  {
    throw `Password must contain at least 1 uppercase letter, a number, a special character and must not contain any spaces `
  }
  password = password.trim()
  if(typeof role != 'string' || role.trim().length === 0)
  {
    throw `role must not be a empty string`;
  }
  role = role.trim()
  role = role.toLowerCase()
  if(role != 'admin' && role != 'user')
  {
    throw `role must be either admin or user.`
  }
  // All validation is done above
  let hash =  await bcrypt.hash(password, 15)
  // at this point we are sure this is a new user and all the fields are valid.
  let newUser = 
  {
    firstName: firstName,
    lastName: lastName,
    emailAddress: emailAddress,
    password: hash,
    role: role
  };
  let insertInfo = await userCollection.insertOne(newUser)
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
  {
    return {insertedUser: false}
  }
  else
  {
    return newUser;
  }
};

function emailValidation (email)
{
    if(!email)
    {
        return false;
    }
    if (typeof email != 'string' || email.trim().length === 0)
    {
        return false;
    }
    if(!(/^[a-zA-Z0-9.!#$%&‘*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email)))
    {
        return false;
    } // https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address
    return true;
}

export const checkUser = async (emailAddress, password) => 
{
  if(!emailAddress || !password)
  {
    throw `Error: missing fields`
  }
  if(typeof password != 'string' || password.trim().length === 0 || password.trim().length < 8)
  {
    throw `Error: password must be a non empty string with minimum 8 characters`;
  }
  if(!(/[A-Z]/.test(password)) ||!(/[0-9]/.test(password)) || !(/[\W_]/.test(password)) || (/\s/g.test(password)) ) //https://stackoverflow.com/questions/1731190/check-if-a-string-has-white-space
  {
    throw `Email must contain at least 1 uppercase letter, a number, a special character and must not contain any spaces `
  }
  password = password.trim()
  // if(typeof emailAddress != 'string' || emailAddress.trim().length === 0)
  // {
  //   throw `Error: email must be a non empty string`;
  // }
  // emailAddress = emailAddress.trim()
  // emailAddress = emailAddress.toLowerCase()

  // if(!(/[@]/.test(emailAddress)) || !(/[.]/.test(emailAddress)) )
  // {
  //   throw `invalid email`
  // }
  //****************************NEED MORE EMAIL VALIDATION *******************************
  // @ comes before . 
  // john.doe@gmail.com
  //atleast one char beofore the @ like: a@gmail.com
  //domain names can have - 
  //https://knowledge.validity.com/hc/en-us/articles/220560587-What-are-the-rules-for-email-address-syntax-
  if(!emailValidation(emailAddress))
  {
    throw `not a valid email.`
  }
  emailAddress = emailAddress.trim()
  emailAddress = emailAddress.toLowerCase()
  console.log("Inside data function email: "+emailAddress)
  console.log("Inside data function password: "+password)
  let userCollection = await users();
  const user = await userCollection.findOne({emailAddress: emailAddress});
  if (user === null) 
  {
    throw 'Either the email address or password is invalid';
  }
  let match = await bcrypt.compare(password, user.password)
  if(match)
  {
    return {firstName: user.firstName, lastName: user.lastName, emailAddress: user.emailAddress, role: user.role}
  }
  else
  {
    throw 'Either the email address or password is invalid';
  }


};

// try
// {
//   console.log(await createUser(" Harshdeep  ", "aujla", "Harshdeep@singh.com", "Password123$", "  ADMIn "));
// }
// catch (e)
// {
//   console.log(e)
// }

// try
// {
//   console.log(await checkUser("Harshdeep@singh.com", "Password123$"));
// }
// catch (e)
// {
//   console.log(e)
// }
//export {createUser }

