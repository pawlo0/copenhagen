/*global Images*/

Meteor.startup(function(){
    if (Images.find().count() == 0) {
        for (var i=0; i<3; i++){
            var time = new Date();
            Images.insert(
                {
                    img_src: "nyhavn.jpg",
                    img_alt: "Nyhavn",
                    label: "Nyhavn",
                    description: "The port in the Danish capital Copenhagen.",
                    createdOn: time
                }
                );
            Images.insert(
                {
                    img_src: "little_mermaid.jpg",
                    img_alt: "The Little Mermaid",
                    label: "The Littler Mermaid",
                    description: " A bronze statue by Edvard Eriksen, depicting a mermaid.",
                    createdOn: time    
                }
                );
            Images.insert(
                {
                    img_src: "wind_mill.jpg",
                    img_alt: "Wind Mill",
                    label: "Wind Mill",
                    description: "A beautiful wind mill in the outskirts of Copenhagen.",
                    createdOn: time
                }
                );
            Images.insert(
                {
                    img_src: "viking_boat.jpg",
                    img_alt: "Viking Boat",
                    label: "Viking Boat",
                    description: "A boat used by Vikings.",
                    createdOn: time
                }                 
                );                
        } // end for
    
        console.log("startup.js says: "+Images.find().count());
    } // end if no images
});