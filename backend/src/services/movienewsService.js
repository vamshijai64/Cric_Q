const MovieNewsModel= require('../models/movienewsModel');

// exports.addMovieNews = async ({ title, description, imageUrl }) => {
       
//         try {
//             // let imageUrl = null;
    
//             let finalImageUrl=imageUrl;
        
          
//             if (!finalImageUrl) {
//                 return res.status(400).json({ error: "Image file or URL is required" });
//             }
//             const news = new MovieNewsModel({
//             title,
//             description,
//             imageUrl:finalImageUrl,
//             });
        
//             return await news.save(); 
//         } catch (error) {
//             throw new Error("Error saving movie news: " + error.message);
//         }
//  };


exports.addMovieNews = async ({ title, description, imageUrl }) => {
    try {
       
        // Create a new instance of the MovieNews model
        const news = new MovieNewsModel({
            title,
            description,
            imageUrl,  // Save the validated imageUrl array
        });

        // Save the news item to the database
        return await news.save();
    } catch (error) {
        // If error occurs, throw a custom error message
        throw new Error("Error saving movie news: " + error.message);
    }
};

// exports.getMovieNews = async () => {

//     //Return  latest new first
//     return await MovieNewsModel.find().sort({ createdAt: -1 });
// }
exports.getMovieNews = async () => {
    const newsList = await MovieNewsModel.find().sort({ createdAt: -1 });

    
    return newsList.map(news => ({
        ...news._doc,
        createdAt: new Date(news.createdAt).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
    }));
};

exports.getMovieNewsById = async (id) => {
    const news = await MovieNewsModel.findById(id);
    if (!news) return null;
    
    return {
        ...news._doc,
        createdAt: new Date(news.createdAt).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
    };
};

exports.updateMovieNewsById=async(movienewsId, title, description, imageUrl) => {
    try{
    const news= await MovieNewsModel.findById(movienewsId);
    if (!news) throw new Error("Movie news not found");

    if (title) {
        news.title = title;
      }
       if (imageUrl) {
        // If the category already has an image in S3, delete it before updating
       
        news.imageUrl = {
            ...news.imageUrl,
            ...imageUrl
        }
    }
    if (description) {
        news.description = description;
    }
    //    if (title || imageUrl || description) {
         
    //     } else {
        //       throw new Error('No valid fields provided for update');
        //     }
               return await news.save();
    }catch(error){
        throw new Error(error.message);
    }
  

}

exports.getLatestMovieNews = async ({ page, limit, search }) => {
    const query = {};
    if (search) query.title = { $regex: search, $options: "i" }; 
    const news = await MovieNewsModel.find(query)
        .sort({ createdAt: -1 })  
        .skip((page - 1) * limit) 
        .limit(limit);

    const totalNews = await MovieNewsModel.countDocuments(query);

    return {
        news,
        totalNews,
        currentPage: page,
        totalPages: Math.ceil(totalNews / limit)
    };
};




