import userRouter from "./users.js";


export const configRoutes = app => {
    app.use('/users', userRouter);
    app.use('*', (req, res) => {
        console.log(`${req.originalUrl} not found.`);
        res.status(404).json({error: 'Not found.'});
    });
};