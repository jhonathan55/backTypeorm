import { validate } from "class-validator";
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Category } from "../entity/Category";



export class CategoryController {

    static new = async (req: Request, res: Response) => {
        const { name } = req.body;
        const category = new Category();
        category.name = name;
        //valit 
        const validationOpt = {
            validationError: {
                target: false,
                value: false
            }
        }
        const errors = await validate(category, validationOpt)
        if (errors.length > 0) {
            return res.status(400).json({
                message: 'input empty'
            })
        }
        const categoryRepository = AppDataSource.getRepository(Category)
        try {
            await categoryRepository.save(category);
        } catch (error) {
            return res.status(400).json({
                message: 'Category ya existe'
            })
        }
        return res.status(201).json({
            message: 'category create'
        })
    }
    static getAll = async (rep: Request, res: Response) => {

        const categoryRepo = AppDataSource.getRepository(Category);
        let categories;
        try {
            categories = await categoryRepo.find()
        } catch (error) {
            return res.status(401).json({
                message: 'error are find'
            })
        }
        if (categories.length == 0) {
            return res.status(404).json({
                message: 'no category'
            })
        }
        console.log(categories);
        return res.status(200).json({
            message: 'category find',
            categories
        })
    }



}
export default CategoryController;