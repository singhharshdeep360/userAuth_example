import {Router} from 'express';

const router = Router();
import {checkUser, createUser} from '../data/users.js';

router.post('/createuser', async (req, res) => 
{
    try
    {
        const {firstName, lastName, emailAddress, password, role} = req.body;
        const user = await createUser(firstName, lastName, emailAddress, password, role);
        res.json(user);
    }
    catch(e)
    {
        res.status(400).json({error: e});
    }

});

router.post('/authuser', async (req, res) =>
{
    console.log(req.body);

    try
    {
         const {emailAddress, password} = req.body.params;
         console.log(emailAddress);
            console.log(password);
        // emailAddress = "new@email.com";
        // password = "Password123$";
        const user = await checkUser(emailAddress, password);
        res.json(user);
    }
    catch(e)
    {
        res.status(404).json({error: e});
    }

});

export default router;