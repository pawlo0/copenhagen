/*global Images*/


// Routing ----------------------------------------------------------------------------------------------------------------------

Router.configure({
  layoutTemplate: 'applicationLayout'
});


Router.route('/', function () {
  this.render('welcome', {
    to: "main"
  });
});

Router.route('/images', function () {
  this.render('navbar', {
    to: "navbar"
  });
  this.render('images', {
    to: "main"
  });
});

Router.route('/image/:_id', function () {
  this.render('navbar', {
    to: "navbar"
  });
  this.render('singleImage', {
    to: "main",
    data: function(){
      return Images.findOne({_id: this.params._id})
    }
  });
});


// Infinte Scrolling ------------------------------------------------------------------------------------------------------------

Session.set("imageLimit", 8);
var lastScrollTop = 0;
$(window).scroll(function(){
  if($(window).scrollTop() + $(window).height() > $(document).height() - 100){
    var scrollTop = $(this).scrollTop();
    if (scrollTop > lastScrollTop) {
      Session.set("imageLimit", Session.get("imageLimit") + 4);
    }
    lastScrollTop = scrollTop;
  }
});


// Account config ---------------------------------------------------------------------------------------------------------------
Accounts.ui.config({
  passwordSignupFields: "USERNAME_AND_EMAIL"
});

Template.body.helpers({
  username: function(){
    if (Meteor.user()){
      return Meteor.user().username;  
    }
  }  
});




// Images helpers and events ----------------------------------------------------------------------------------------------------

Template.images.helpers({
  images: function () {
      if (Session.get("userFilter")){
        var all = Images.find({createdBy: Session.get("userFilter")}, {sort:{createdOn: -1, rating:-1}, limit: Session.get("imageLimit")}).fetch();
      } else {
        var all = Images.find({}, {sort:{createdOn: -1, rating:-1}, limit: Session.get("imageLimit")}).fetch();
      }
      var chunks = [];
      var size = 4;

      while (all.length > size) {
          chunks.push({ row: all.slice(0, size)});
          all = all.slice(size);
      }
      chunks.push({row: all});
      
      return chunks;
  },
  filtering_images: function(){
    if (Session.get("userFilter")){
      return true;
    } else {
      return false;
    }
  },
  getFilterUser: function () {
    if (Session.get("userFilter")){
      return Meteor.users.findOne({_id:Session.get("userFilter")}).username;
    } else {
      return false;
    }
  }
});


Template.images.events({
/*  
  "click .js-image": function(event){
    var image_src = $(event.currentTarget).attr("src");
    $('#image_modal').attr("src", image_src);
    $('#imageModal').modal('show');
  },
*/
  'click .js-del-image': function(event){
    var image_id = this._id;
    $("#"+image_id).hide('slow', function(){
      Images.remove({"_id": image_id});
    })
  },
  'click .js-rate-image': function(event){
    var image_id = this.id;
    var rating = $(event.currentTarget).data("userrating");
    console.log(image_id);
    console.log(rating);
    Images.update({_id:image_id}, {$set: {rating:rating}});
  },
  'click .js-image-add': function(event){
    $("#image_add_form").modal('show');
  },
  'click .js-set-image-filter': function(event){
    Session.set("userFilter", this.createdBy)
  },
  'click .js-unset-image-filter': function(event){
    Session.set("userFilter", undefined)
  }
});

// Individual image helper ------------------------------------------------------------------------------------------------------

Template.individualImage.helpers({
  getUser: function(userId) {
    if (userId) {
      return Meteor.users.findOne({_id: userId}).username
    } else {
      return "System"
    }
  }
});


// Add images form events ------------------------------------------------------------------------------------------------------- 
Template.image_add_form.events({
  'submit .js-add-image':function(event){
    if(Meteor.user()) {
      Images.insert({
        img_src: event.target.img_src.value,
        img_alt: event.target.label.value,
        label: event.target.label.value,
        description: event.target.description.value,
        createdOn: new Date(),
        createdBy: Meteor.user()._id
      });
    }
    
    $("#image_add_form").modal('hide');
    return false;
  },
  'click .js-close-form':function(event){
    $("#image_add_form").modal('hide');
  }
});