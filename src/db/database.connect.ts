import mongoose from 'mongoose';

export const dbConnect = () => {
  const user = process.env.DB_USER;
  const pswrd = process.env.DB_PSWRD;
  const dbName = 'Nexus_Library';
  const uri = `mongodb+srv://${user}:${pswrd}@cluster0.dtab9ut.mongodb.net/${dbName}?retryWrites=true&w=majority`;
  return mongoose.connect(uri);
};
