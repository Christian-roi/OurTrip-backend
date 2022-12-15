const fs = require('fs');
const path = require('path');
const db = require('../models');
const Post = db.posts;

exports.create = async (req, res) => {
    try {
        const { user_id, title, place, image, content } = req.body;
        let imageUrl;

        if (image) {            
            let buff = new Buffer(image.split('base64,')[1], 'base64');
            let filename = user_id.toString()+Date.now();
            // console.log(filename)
            const baseImage = {profilepic:image};
            let mimeType = baseImage.profilepic.match(/[^:/]\w+(?=;|,)/)[0];
            // console.log(mimeType)
            let dir = path.join(__dirname,"../assets/uploads/posts/"+filename+'.'+mimeType);
            fs.writeFileSync(dir, buff)
            imageUrl = dir;            
        }

        await Post.create({
            user_id,
            title,
            place,
            image: imageUrl,
            content
        });

        return res.status(201).json({
            message: "Your post have successfully created"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error
        })
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id, title, place, image, content } = req.body;
  
        const existsPost = await Post.findOne({
            where: {
                id,
                user_id,
            },
        });

        if (existsPost) {
            existsPost.title = title;
            existsPost.place = place;
            existsPost.content = content;
            if (image) {            
                let oldFile = existsPost.image.split('posts\\')[1];
                // console.log(oldFile);
                let buff = new Buffer(image.split('base64,')[1], 'base64');
                let filename = user_id.toString()+Date.now();
                const baseImage = {profilepic:image};
                let mimeType = baseImage.profilepic.match(/[^:/]\w+(?=;|,)/)[0];
                let dir = path.join(__dirname,"../assets/uploads/posts/"+filename+'.'+mimeType);
                fs.writeFileSync(dir, buff);
                existsPost.image = dir;  
                fs.unlink(path.join(__dirname,"../assets/uploads/posts/")+oldFile, (err) => {
                    if (err) {
                      res.status(500).send({
                        message: "Could not delete the file. " + err,
                      });
                    }
                    console.log("Old file is deleted")
                  });      
            }
            await existsPost.save();
            return res.status(200).json({
                message: "Your post has been edited.",
            });
        } else {
            return res.status(404).json({
                message: "Post not found or this is not your post",
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error
        })
    }
};

exports.destroy = async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id } = req.body;
  
        const existsPost = await Post.findOne({
            where: {
                id,
                user_id,
            },
        });

        if (existsPost) {
            if (existsPost) {
                let oldFile = existsPost.image.split('posts\\')[1];
                fs.unlink(path.join(__dirname,"../assets/uploads/posts/")+oldFile, (err) => {
                    if (err) {
                      res.status(500).send({
                        message: "Could not delete the file. " + err,
                      });
                    }
                    console.log("Old file is deleted")
                  });
            }
            await existsPost.destroy();
            return res.status(200).json({
                message: "Your post has been deleted.",
            });
        } else {
            return res.status(404).json({
                message: "Post not found or this is not your post",
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error
        });
    }
};

exports.getAll = async (req, res) => {
    try {
        const posts = await Post.findAll({
            order: [['createdAt', 'DESC']]
        });

        return res.status(200).json({
            data: posts
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error
        });
    }
};

exports.getById = async (req, res) => {
    try {
        const { id } = req.params; 
        const data = await Post.findByPk(id);

        if (data) {
            return res.status(200).json({
                data
            });
        } else {
            return res.status(404).json({
                message: "Post not found",
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error
        });
    }
};