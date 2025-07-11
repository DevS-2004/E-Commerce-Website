import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import productModel from "../models/productModel.js"

// function for add products
const addProduct = async(req,res) => {
    try {
        
        const {name,description,price,category,subCategory,sizes,bestSeller} = req.body;
        

        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1,image2,image3,image4].filter((item)=> item !== undefined)

        
        const imageUrl = await Promise.all(
            images.map(async (img) => {
            const result = await cloudinary.uploader.upload(img.path, {
                resource_type: "image"
            });
            fs.unlinkSync(img.path);
            return result.secure_url;
        })
    );

        const productData = {
            name,
            description,
            category,
            price:Number(price),
            subCategory,
            bestSeller: bestSeller === "true" ? true : false,
            sizes: JSON.parse(sizes),
            image: imageUrl,
            date: Date.now()
        }

        console.log(productData);

        const product = new productModel(productData);
        await product.save()

        res.json({success:true,message:"Product added !!"})

        // console.log({ name, description, price, category, subCategory, sizes, bestSeller });
        // console.log("Uploaded URLs:", imageUrl);
        // res.json({message:"Getting Succesfull Images !!"})
        

    } catch (error) {
        res.json({success:false,message:error.message})
    }

}

// function for list product
const listProduct = async(req,res) => {
    try {
        const products = await productModel.find({});
        res.json({success:true,products})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

// function for removing products
const removeProduct = async(req,res) => {
    try {
        await  productModel.findByIdAndDelete(req.body.id)
        res.json({success:true,message:"Product has been successfully removed !!"})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

// function for single product info
const singleProduct = async(req,res) => {
    try {
        
        const {productId} = req.body
        const product = await productModel.findById(productId)
        res.json({success:true,product})
    
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

export {addProduct,removeProduct,listProduct,singleProduct}


