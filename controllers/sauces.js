const Sauce = require('../models/sauce');

exports.getAllSauces = (req, res, next) => {
    // console.log(req);
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

exports.modifySauce = (req, res, next) => {
    // console.log(req.params);
    // console.log(req.body);
    // console.log(req.params._id);
    let sauce = new Sauce({ _id: req.params._id });
    if (req.file) {
      const url = req.protocol + '://' + req.get('host');
      req.body.sauce = JSON.parse(req.body.sauce);
      // console.log(req.file.filename);
      sauce = {
        _id: req.params.id,
        name: req.body.sauce.name,
        manufacturer: req.body.sauce.manufacturer,
        description: req.body.sauce.description,
        mainPepper: req.body.sauce.mainPepper,
        imageUrl: url + '/images/' + req.file.filename,
        heat: req.body.sauce.heat,
        // likes: 0,
        // dislikes: 0,
        // usersLiked: [],
        // usersDisliked: [],
        userId: req.body.sauce.userId,
      };
    } else {
      sauce = {
        _id: req.params.id,
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        description: req.body.description,
        mainPepper: req.body.mainPepper,
        // imageUrl: req.body.imageUrl,
        heat: req.body.heat,
        userId: req.body.userId,
      };
    }
    console.log('SAUCE:')
    console.log(sauce);
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

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then(
    (sauce) => {
      if (!sauce) {
        return res.status(404).json({
          error: new Error(' Not Found!')
        });
      }
      if (sauce.userId !== req.auth.userId) {
        return res.status(401).json({
          error: new Error('Request not authorized!')
        });
      }
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
};

exports.createSauce = (req, res, next) => {
    // console.log(req.body);
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

exports.like = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
      }).then((sauce) => {
        userId = req.body.userId;
        if (req.body.like === 1)
        {   
            console.log('1111111111');
            sauce.likes ++;
            sauce.usersLiked.push(userId);
            // sauce.save();
            console.log(sauce.usersLiked);
        } else if (req.body.like === -1) {
            console.log('-1-1-1-1-1-1');
            sauce.dislikes ++;
            sauce.usersDisliked.push(userId);
            // sauce.save();
        } else {
            console.log('00000000000');
            userIdLike = sauce.usersLiked.find((el) => el === userId);
            userIdDislike = sauce.usersDisliked.find((el) => el === userId)
            console.log(userIdLike);
            if (userIdLike) {
            let index = sauce.usersLiked.indexOf(userIdLike);
            sauce.usersLiked.splice(index, 1);
            console.log(sauce.usersLiked + 'post rimozione');
            sauce.likes --;
            // sauce.save();
            } else if (userIdDislike) {
              let index = sauce.usersDisliked.indexOf(userIdDislike);
              sauce.usersDisliked.splice(index, 1);
              console.log(sauce.usersDisliked + 'post rimozione');
              sauce.dislikes --;
              // sauce.save();
            } else {
              console.log('non succede nulla')
            }
          } 
          sauce.save();
        console.log('like rimosso')
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
