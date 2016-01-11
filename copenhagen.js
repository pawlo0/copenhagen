Images = new Mongo.Collection("images");


if (Meteor.isClient) {

  Template.body.helpers({
    username: function(){
      if (Meteor.user()){
        return Meteor.user().emails[0].address;  
      }
    }  
  });
  
  Template.images.helpers({
    images: function () {
        var all = Images.find({}, {sort:{createdOn: -1, rating:-1}}).fetch();
        var chunks = [];
        var size = 4;

        while (all.length > size) {
            chunks.push({ row: all.slice(0, size)});
            all = all.slice(size);
        }
        chunks.push({row: all});
        
        return chunks;
    }
  });
  
  Template.images.events({
    "click .js-image": function(event){
      var image_src = $(event.currentTarget).attr("src");
      $('#image_modal').attr("src", image_src);
      $('#imageModal').modal('show');
    },
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
    }
  });
  
  Template.image_add_form.events({
    'submit .js-add-image':function(event){

      Images.insert({
        img_src: event.target.img_src.value,
        img_alt: event.target.label.value,
        label: event.target.label.value,
        description: event.target.description.value,
        createdOn: new Date()
      });
      $("#image_add_form").modal('hide');
      return false;
    },
    'click .js-close-form':function(event){
      $("#image_add_form").modal('hide');
    }
  });
  
}