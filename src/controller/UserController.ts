
import { validate } from "class-validator";
import { Request, Response } from "express"
import { AppDataSource } from "../data-source";
import { Photo } from "../entity/Photo";
import { User } from "../entity/User"

export class UserController {

    static newUser = async (req: Request, res: Response) => {
        const { username, password, role, photos } = req.body;
        const photoRepo = AppDataSource.getRepository(Photo);
        console.log("photos", photos.length);
        const photosToSave: Photo[] = [];
        for (let i = 0; i < photos.length; i++) {
            const photoi = new Photo();
            photoi.url = photos[i];
            try {
                await photoRepo.save(photoi);
            } catch (error) {
                return res.status(400).json({
                    message: 'photo no existe',
                    error
                })
            }
            photosToSave.push(photoi);
        }
        const user = new User();
        user.username = username;
        user.password = password;
        user.role = role;
        user.photos = photosToSave;
        //console.log("foto", photosToSave)
        //valida que los campos no esten vacios
        const validationOpt = {
            validationError: {
                target: false,
                value: false
            }
        }
        //import class validate pasamos el user y la validación
        const errors = await validate(user, validationOpt)
        if (errors.length > 0) {
            return res.status(401).json({
                message: 'error en la validación de los campos'
            })
        }
        const userRepository = AppDataSource.getRepository(User)
        try {
            user.hashPassword();
            await userRepository.save(user);
        } catch (error) {
            return res.status(400).json({
                message: 'user ya existe'
            })
        }
        res.status(200).send('user created')
    }
    static registerEmail = async (req: Request, res: Response) => {
        const { username , password} = req.body;
        const userRepository = AppDataSource.getRepository(User);
        let user: User;
        const saveUser = new User();
        saveUser.username = username;
        saveUser.password = password;
        try {
            user = await userRepository.findOneOrFail({ where: { username: username } });
            return res.status(410).json({
                message: 'user ya existe'
            })
            
        } catch (error) {
            userRepository.save(saveUser);
           return res.status(200).json({
                message: 'user creado'
            })
       
        }
      

    }

    static getUsers = async (req: Request, res: Response) => {
        const userRepository = AppDataSource.getRepository(User);
        let users;
        try {
            users = await userRepository.find({
                relations: ['photos']
            });

        } catch (error) {
            res.status(404).json({ message: 'algo no salio mal' });
        }

        if (users.length > 0) {
            res.send(users);
        } else {
            res.status(404).json({ message: 'user no encontrado' });
        }
    }
    static delete = async (req: Request, res: Response) => {
        const { id } = req.params;
        const userRepository = AppDataSource.getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneByOrFail({
                id: parseInt(id)
            });

        } catch (error) {
            return res.status(404).json({ message: 'user no encontrado' });

        }
        userRepository.delete(id);
        res.status(201).json({ message: 'user delete' })
    }
    static update = async (req: Request, res: Response) => {
        let user;
        const { id } = req.params;
        const { username, role } = req.body;

        const userRepository = AppDataSource.getRepository(User);
        try {
            user = await userRepository.findOneByOrFail({
                id: parseInt(id)
            })
            user.username = username;
            user.role = role;

        } catch (error) {
            return res.status(404).json({ message: 'user not found' })
        }
        //valid que los campos no esten vacios
        const validationOpt = {
            validationError: {
                target: false,
                value: false
            }
        }
        const errors = await validate(user, validationOpt);
        //valid si existen errors
        if (errors.length > 0) {
            return res.status(400).json(errors);
        }
        //try save user
        try {
            await userRepository.save(user)
        } catch (error) {
            return res.status(409).json({
                message: 'User ya existe'
            })
        }
        res.status(204).json({
            message: 'user update'
        })


    }
    static getById = async (req: Request, res: Response) => {
        const { id } = req.params;
        const userRepository = AppDataSource.getRepository(User);
        try {
            const user = await userRepository.findOneByOrFail({ id: parseInt(id) })
            res.send({ id: user.id, username: user.username });
        } catch (error) {
            res.status(404).json({ message: 'user not found' })
        }
    }
}
export default UserController;