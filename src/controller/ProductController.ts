import { validate } from "class-validator";
import { Request, Response } from "express";
import { In } from "typeorm";
import { AppDataSource } from "../data-source";
import { Category } from "../entity/Category";
import { Product } from "../entity/Product";

export class ProductController {
    //ok
    static new = async (req: Request, res: Response) => {
        const { name, description, categories } = req.body;
        const product = new Product();
        const cateregoryRepository = AppDataSource.getRepository(Category);
        try {
            const categoriesId = await cateregoryRepository.findBy({ id: In(categories) });
            console.log(categoriesId.length);
            if (categoriesId.length == 0) {
                return res.status(400).json({ message: 'categories not found' })
            }
            product.name = name;
            product.description = description;
            product.categories = categoriesId;
        } catch (error) {
            return res.status(400).json({
                message: 'Category no existe'
            })
        }
        const validationOpt = {
            validationError: {
                target: false,
                value: false
            }
        }
        const errors = await validate(product, validationOpt);
        if (errors.length > 0) {
            return res.status(401).json({
                message: 'input empty'
            })
        }

        const productRepo = AppDataSource.getRepository(Product);
        try {
            await productRepo.save(product)
        } catch (error) {
            return res.status(409).json({
                message: 'product ya existe',
                error
            })
        }
        return res.status(201).json({
            message: 'product create'
        })
    }
    //ok
    static getAll = async (req: Request, res: Response) => {
        const productRepo = AppDataSource.getRepository(Product);
        let products:Product[];
        try {
            products = await productRepo.find({
                relations: ['categories']
            });
        } catch (error) {
            return res.status(400).json({
                message: 'product not found'
            })
        }
        if (products.length == 0) {
            return res.status(400).json({
                message: 'product not found'
            })
        }
        return res.status(200).json(products);
    }
    //ok
    static getOne = async (req: Request, res: Response) => {
        const { id } = req.params;
        const productRepo = AppDataSource.getRepository(Product);
        let product;
        try {
            product = await productRepo.createQueryBuilder('product')
                .leftJoinAndSelect('product.categories', 'categories')
                .where('product.id = :id', { id: parseInt(id) })
                .getOne();
            if (product == null) {
                return res.status(404).json({ message: 'product not found' })
            }
        } catch (error) {
            return res.status(400).json({
                message: 'product not found'
            })
        }
        return res.status(200).json(product);

    }
    //ok
    static update = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { name, description, categories } = req.body;
        const productRepo = AppDataSource.getRepository(Product);
        const cateregoryRepository = AppDataSource.getRepository(Category);
        let product;

        try {
            product = await productRepo.createQueryBuilder('product')
                .leftJoinAndSelect('product.categories', 'categories')
                .where('product.id = :id', { id: parseInt(id) })
                .getOne();

            if (product == null) {
                return res.status(404).json({ message: 'product not found' })
            }
        } catch (error) {
            return res.status(400).json({
                message: 'product not found'
            })
        }
        try {

            const categoriesId = await cateregoryRepository.findBy({ id: In(categories) });
            console.log(categoriesId.length);
            if (categoriesId.length == 0) {
                return res.status(400).json({ message: 'categories not found' })
            }
            product.name = name;
            product.description = description;
            product.categories = categoriesId;
            console.log(product);

        } catch (error) {
            return res.status(400).json({
                message: 'Category no existe'
            })
        }
        const validationOpt = {
            validationError: {
                target: false,
                value: false
            }
        }
        const errors = await validate(product, validationOpt);
        if (errors.length > 0) {
            return res.status(401).json({
                message: 'input empty'
            })
        }
        try {
            await productRepo.save(product)
        } catch (error) {
            return res.status(409).json({
                message: 'product ya existe',
                error
            })
        }
        return res.status(200).json({
            message: 'product update'
        })
    }
    //ok
    static delete = async (req: Request, res: Response) => {
        const { id } = req.params;
        const productRepo = AppDataSource.getRepository(Product);
        let product;
        try {
            product = await productRepo.createQueryBuilder('product')
                .leftJoinAndSelect('product.categories', 'categories')
                .where('product.id = :id', { id: parseInt(id) })
                .getOne();
            if (product == null) {
                return res.status(404).json({ message: 'product not found' })
            }
        } catch (error) {
            return res.status(400).json({
                message: 'product not found'
            })
        }
        try {
            await productRepo.remove(product)
        } catch (error) {
            return res.status(409).json({
                message: 'problem deleting product',
                error
            })
        }
        return res.status(200).json({
            message: 'product delete'
        })
    }


}

export default ProductController;