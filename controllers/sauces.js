const Sauce = require('../models/sauce');
const fs = require('fs');

//Return an array with all the sauce from the database
exports.getAllSauces = (req, res, next) => {
    Sauce.find().then( 
      (sauces) => {
        res.status(200).json(sauces);
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
};

//Return just one sauce object
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
      _id: req.params.id
    }).then(
      (sauce) => {
        res.status(200).json(sauce);
      }
    ).catch(
      (error) => {
        res.status(404).json({
          error: error
        });
      }
    );
};

//Updating an existing sauce
exports.modifySauce = (req, res, next) => {

    let sauce = new Sauce({ _id: req.params._id });
    //If the photo is changed
    if (req.file) {
      const url = req.protocol + '://' + req.get('host');
      req.body.sauce = JSON.parse(req.body.sauce);
      sauce = {
        _id: req.params.id,
        name: req.body.sauce.name,
        manufacturer: req.body.sauce.manufacturer,
        description: req.body.sauce.description,
        mainPepper: req.body.sauce.mainPepper,
        imageUrl: url + '/images/' + req.file.filename,
        heat: req.body.sauce.heat,
        userId: req.body.sauce.userId,
      };
    //If no photo is loaded
    } else {
      sauce = {
        _id: req.params.id,
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        description: req.body.description,
        mainPepper: req.body.mainPepper,
        heat: req.body.heat,
        userId: req.body.userId,
      };
    }
    Sauce.updateOne({_id: req.params.id}, sauce).then(
      () => {
        res.status(201).json({
          message: 'Thing updated successfully!'
        });
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
};

//Deleting a sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then(
    (sauce) => {
      if (!sauce) {
        return res.status(404).json({
          error: new Error(' Not Found!')
        });
      }
      //Checking the userID is the same of the sauce to not allow not authoized account to delete it
      if (sauce.userId !== req.auth.userId) {
        return res.status(401).json({
          error: new Error('Request not authorized!')
        });
      }
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink('images/' + filename, () => {
      Sauce.deleteOne({_id: req.params.id}).then(
        () => {
          res.status(200).json({
            message: 'Deleted!'
          });
        }
      ).catch(
        (error) => {
          res.status(400).json({
            error: error
          });
        }
      );

    }
  );
});
};

//Creating a new sauce
exports.createSauce = (req, res, next) => {
    req.body.sauce = JSON.parse(req.body.sauce);
    console.log(req.body.sauce);
    console.log(req.file.filename);
    const url = req.protocol + '://' + req.get('host');
    const sauce = new Sauce({
      name: req.body.sauce.name,
      manufacturer: req.body.sauce.manufacturer,
      description: req.body.sauce.description,
      mainPepper: req.body.sauce.mainPepper,
      imageUrl: url + '/images/' + req.file.filename,
      heat: req.body.sauce.heat,
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: [],
      userId: req.body.sauce.userId,
    });
    sauce.save().then(
      () => {
        res.status(201).json({
          message: 'Post saved successfully!'
        });
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
  });
};

//Like and Dislike menaging
exports.like = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
      }).then((sauce) => {
        userId = req.body.userId;
        //If the sauce is liked
        if (req.body.like === 1)
        {   
            sauce.likes ++;
            sauce.usersLiked.push(userId);
        //If the sauce is disliked
        } else if (req.body.like === -1) {
            sauce.dislikes ++;
            sauce.usersDisliked.push(userId);
        //If the like/dislike is canceled
        } else {
            userIdLike = sauce.usersLiked.find((el) => el === userId);
            userIdDislike = sauce.usersDisliked.find((el) => el === userId)
            //If the user is canceling his like
            if (userIdLike) {
            let index = sauce.usersLiked.indexOf(userIdLike);
            sauce.usersLiked.splice(index, 1);
            sauce.likes --;
            console.log('like removed')
            //If the user is canceling his dislike
            } if (userIdDislike) {
              let index = sauce.usersDisliked.indexOf(userIdDislike);
              sauce.usersDisliked.splice(index, 1);
              sauce.dislikes --;
              console.log('dislike removed')
            }
          } 
          sauce.save();
      }).then(
        () => {
          res.status(201).json({
            message: 'Thing updated successfully!'
          });
        }
      ).catch(
        (error) => {
          res.status(400).json({
            error: error
          });
        });
}
