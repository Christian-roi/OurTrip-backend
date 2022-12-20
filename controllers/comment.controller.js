const db = require('../models');
const Comment = db.comments;

//membuat komentar
exports.buat = async (req, res) => {
       try {
              const {
                     postId,
                     userId,
                     content
              } = req.body;

              await Comment.create({
                     postId,
                     userId,
                     content
              });

              return res.status(201).json({
                     message: "Your comment has been submitted!"
              });
       } catch (error) {
               console.error(error);
              return res.status(500).json({
                     message: "Your comment failed to submit!"
              })
       }
};


//get comment
exports.getComment = async (req, res) => {
       try {
           const comments = await Comment.findAll({
               order: [['createdAt', 'DESC']]
           });
   
           return res.status(200).json({
               data: comments
           })
       } catch (error) {
           console.error(error);
           return res.status(500).json({
               message: error
           });
       }
   };

//update komentar
exports.updateComment = async (req, res) => {
       try {
           const { commentId } = req.params;
           const { postId, userId, content } = req.body;
     
           const existsComment = await Comment.findOne({
               where: {
                   commentId,              
                   postId,
                   userId,
               },
           });
   
           if (existsComment) {
               existsComment.content = content;
              
               await existsComment.save();
               return res.status(200).json({
                   message: "Your comment has been updated!",
               });
           } else {
               return res.status(404).json({
                   message: "Your comment failed to updated!",
               });
           }
       } catch (error) {
           console.error(error);
           return res.status(500).json({
               message: error
           })
       }
   };

// exports.update = async (req, res) => {
//        try {
//               const {
//                      commentId
//               } = req.params;
//               const {
//                      postId,
//                      userId,
//                      content
//               } = req.body;

//               const existsPost = await Post.findOne({
//                      where: {
//                             commentId,
//                             postId,
//                      },
//               });

//               if (existsPost) {
//                      existsPost.userId = userId;
//                      existsPost.content = content;
//                      if (err) {
//                             res.status(500).send({
//                                    message: "Could not delete the file. " + err,
//                             });
//                      }
//                      console.log("Old file is deleted")
//               };
// }
// catch {existsComment.save();
// return res.status(200).json({
//        message: "Your post has been edited.",
// });
// }

// { else {
//        return res.status(404).json({
//               message: "Post not found or this is not your post",
//        });
// }
// } catch (error) {
//        console.error(error);
//        return res.status(500).json({
//               message: error
//        })
// };


// exports.destroy = async (req, res) => {
//        try {
//               const {
//                      commentId
//               } = req.params;
//               const {
//                      postId
//               } = req.body;

//               const existsComment = await Comment.findOne({
//                      where: {
//                             commentid,
//                             postId,
//                      },
//               });

//               if (existsComment) {
//                      if (existsComment) {
                            
//                                    if (err) {
//                                           res.status(500).send({
//                                                  message: "Could not delete comment " + err,
//                                           });
//                                    }
//                                    console.log("comment succesfully deleted")
//                             });
//                      }
//                      await existsComment.destroy();
//                      return res.status(200).json({
//                             message: "Your post has been deleted.",
//                      });
//               } else {
//                      return res.status(404).json({
//                             message: "Post not found or this is not your post",
//                      });
//               }
//        } catch (error) {
//               console.error(error);
//               return res.status(500).json({
//                      message: error
//               });
//        }
// };

// exports.getAll = async (req, res) => {
//        try {
//               const posts = await Post.findAll({
//                      order: [
//                             ['createdAt', 'DESC']
//                      ]
//               });

//               return res.status(200).json({
//                      data: posts
//               })
//        } catch (error) {
//               console.error(error);
//               return res.status(500).json({
//                      message: error
//               });
//        }
// };

// exports.getById = async (req, res) => {
//        try {
//               const {
//                      id
//               } = req.params;
//               const data = await Post.findByPk(id);

//               if (data) {
//                      return res.status(200).json({
//                             data
//                      });
//               } else {
//                      return res.status(404).json({
//                             message: "Post not found",
//                      });
//               }
//        } catch (error) {
//               console.error(error);
//               return res.status(500).json({
//                      message: error
//               });
//        }
// };