const sequelize = require('../db')
const {DataTypes} = require ('sequelize')

const User = sequelize.define('User',{
    id:{type: DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
    email:{type: DataTypes.STRING, unique: true},
    password:{type: DataTypes.STRING},
    role:{type: DataTypes.STRING, defaultValue: 'GUEST'},

})
const UserInfo = sequelize.define('UserInfo',{
    id:{type:DataTypes.INTEGER,  primaryKey: true, autoIncrement:true},
    name:{type:DataTypes.STRING,  allowNull: false},
    img: {type: DataTypes.STRING, allowNull: false},
    userId: {type: DataTypes.INTEGER,references: {model: User ,key: 'id'}}

})

const Post = sequelize.define('Post', {
    id: {type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true},
    title: {type: DataTypes.STRING,allowNull: false},
    description: {type: DataTypes.TEXT},
    userId: {type: DataTypes.INTEGER,references: {model: User,  key: 'id'}}
  });

User.hasOne(UserInfo, {foreignKey: 'userId', onDelete: 'CASCADE' })
UserInfo.belongsTo(User, {foreignKey: 'userId',});

User.hasMany(Post, {foreignKey: 'userId', onDelete: 'CASCADE'})
Post.belongsTo(User, {foreignKey: 'userId',});


module.exports={
    User,
    Post,
    UserInfo
}