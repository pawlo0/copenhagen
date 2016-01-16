/*global Images*/
Images = new Mongo.Collection("images");

Images.allow({
  insert: function(userId, doc){
    if (Meteor.user() && userId == doc.createdBy){
      return true;
    } else {
      return false;
    }
  },
  remove: function(){
    if (Meteor.user()){
      return true;
    }
  }
})