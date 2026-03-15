const userSchema = new mongoose.Schema({
   name: {
       type: String,
       required: true,
       trim: true
   },
   email: {
       type: String,
       required: true,
       unique: true,
       lowercase: true
   },
   password: {
       type: String,
       required: true
   },
   refreshToken: {
       type: String
   }
}, {
   timestamps: true
});
