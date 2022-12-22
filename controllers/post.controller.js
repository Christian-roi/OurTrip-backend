const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');
const db = require('../models');
const Post = db.posts;

// const getPagination = (page, size) => {
//     const limit = size ? +size : 3;
//     const offset = page ? page * limit : 0;
  
//     return { limit, offset };
// };

// const getPagingData = (data, page, limit) => {
//     const { count: totalItems, rows: tutorials } = data;
//     const currentPage = page ? +page : 0;
//     const totalPages = Math.ceil(totalItems / limit);
  
//     return { totalItems, tutorials, totalPages, currentPage };
// };

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
            imageUrl = "/uploads/posts/"+filename+'.'+mimeType;            
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
                let oldFile = existsPost.image.split('posts/')[1];
                // console.log(oldFile);
                let buff = new Buffer(image.split('base64,')[1], 'base64');
                let filename = user_id.toString()+Date.now();
                const baseImage = {profilepic:image};
                let mimeType = baseImage.profilepic.match(/[^:/]\w+(?=;|,)/)[0];
                let dir = path.join(__dirname,"../assets/uploads/posts/"+filename+'.'+mimeType);
                fs.writeFileSync(dir, buff);
                existsPost.image = "/uploads/posts/"+filename+'.'+mimeType;  
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
                let oldFile = existsPost.image.split('posts/')[1];
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
        const { page,size } = req.query;
        const searchQuery = req.query.search;
        const limit = size ? +size : 5;
        const offset = page ? page * limit : 0;
        // const { limit, offset } = getPagination(page, size)
        if (searchQuery) {
            const searchData = await Post.findAll({
                order: [['createdAt', 'DESC']],
                where: {
                    [Op.or]: [
                        { title: { [Op.like]: `%${searchQuery}%` } },
                        { place: { [Op.like]: `%${searchQuery}%` } },
                        { content: { [Op.like]: `%${searchQuery}%` } },
                    ]
                },
                limit: limit,
                offset: offset,
                include: ['user']
            });    
            return res.status(200).json({
                data: searchData.map(p => ({
                    id: p.id,
                    title: p.title,
                    place: p.place,
                    image: p.image,
                    user_id: p.user_id,
                    user_first_name: p.user.first_name,
                    user_last_name: p.user.user_last_name,
                    createdAt: p.createdAt.toString(),
                    updatedAt: p.updatedAt.toString(),
                }))
            });
        }
        const posts = await Post.findAll({
            order: [['createdAt', 'DESC']],
            include: ['user'],
            limit: limit,
            offset: offset,
        });

        return res.status(200).json({
            data: posts.map(p => ({
                id: p.id,
                title: p.title,
                place: p.place,
                image: p.image,
                content: p.content,
                user_id: p.user_id,
                user_first_name: p.user.first_name,
                user_last_name: p.user.last_name,
                createdAt: p.createdAt.toString(),
                updatedAt: p.updatedAt.toString(),
            }))
        });
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
        const data = await Post.findByPk(id,{
            include: ['user', 'comments'],
        });

        if (data) {
            return res.status(200).json({
                data : {
                    id: data.id,
                    title: data.title,
                    place: data.place,
                    image: data.image,
                    content: data.content,
                    user_id: data.user_id,
                    user_first_name: data.user.first_name,
                    user_last_name: data.user.last_name,
                    createdAt: data.createdAt.toString(),
                    updatedAt: data.updatedAt.toString(),
                    comments: data.comments
                }
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

exports.getUserPosts = async (req, res) => {
    try {
        const { user_id } = req.params;
        const searchQuery = req.query.search;
        if (searchQuery) {
            const searchData = await Post.findAll({
                order: [['createdAt', 'DESC']],
                where: {
                    user_id : user_id,
                    [Op.or]: [
                        { title: { [Op.like]: `%${searchQuery}%` } },
                        { place: { [Op.like]: `%${searchQuery}%` } },
                        { content: { [Op.like]: `%${searchQuery}%` } },
                    ]
                },
                include: ['user']
            });    
            return res.status(200).json({
                data: searchData.map(p => ({
                    id: p.id,
                    title: p.title,
                    place: p.place,
                    image: p.image,
                    user_id: p.user_id,
                    user_first_name: p.user.first_name,
                    user_last_name: p.user.last_name,
                    createdAt: p.createdAt.toString(),
                    updatedAt: p.updatedAt.toString(),
                }))
            });
        }
        const posts = await Post.findAll({
            order: [['createdAt', 'DESC']],
            where: {
                user_id
            },
            include: ['user']
        });

        return res.status(200).json({
            data: posts.map(p => ({
                id: p.id,
                title: p.title,
                place: p.place,
                image: p.image,
                content: p.content,
                user_id: p.user_id,
                user_first_name: p.user.first_name,
                user_last_name: p.user.last_name,
                createdAt: p.createdAt.toString(),
                updatedAt: p.updatedAt.toString(),
            }))
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error
        });
    }
};