const bcrypt = require("bcrypt");

const session = require("express-session");
const user = require("./user");

module.exports = function(sequelize,DataTypes){
    var events = sequelize.define('events',{
       time: DataTypes.TIME,
        event_category:DataTypes.STRING,
        event_name:DataTypes.STRING,
        event_location:DataTypes.STRING,
        meeting_spot:DataTypes.STRING,
        num_of_attendees:DataTypes.INTEGER,
        min_age:DataTypes.INTEGER,
        additional_info:DataTypes.STRING
    }
    );
    events.associate = function(models){
        events.belongsTo(models.users)
    };
    return events;
}