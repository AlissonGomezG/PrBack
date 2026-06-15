import app from './src/app';
import env from './env';
//import created routes
import authRoutes from './src/routes/authRoutes';
import userProfileRoutes from './src/routes/userProfileRoutes';
import medicineRoutes from './src/routes/medicineRoutes';

//use routes

app.use('/api/auth', authRoutes);
app.use('/api/profile',userProfileRoutes);
app.use('/api/medicines', medicineRoutes);


app.use('/api', (req, res) =>{
    res.status(404).json({ message: 'Endpoint not found' });
});

app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
});