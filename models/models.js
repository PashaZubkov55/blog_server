const sequelize = require('../db')
const {DataTypes} = require ('sequelize')

const User = sequelize.define('User',{
    id:{type: DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
    name:{type: DataTypes.STRING, },
    email:{type: DataTypes.STRING, unique: true},
    password:{type: DataTypes.STRING},
    role:{type: DataTypes.STRING, defaultValue: 'GUEST'},
    img: {type: DataTypes.STRING, allowNull: false},
 

})

const Post = sequelize.define('Post',{
    id:{type: DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
    title:{type: DataTypes.STRING, },
    description:{type: DataTypes.STRING},
    img: {type: DataTypes.STRING, allowNull: false},
    autor:{type:DataTypes.STRING},
    userId: {type: DataTypes.INTEGER,references: {model: 'Users',key: 'id'}}

})

User.hasMany(Post, { foreignKey: 'userId' });
Post.belongsTo(User, { foreignKey: 'userId' });


module.exports={
    User,
    Post,
}