import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Photo } from "../entity/Photo";

export class PhotoController {
   static async new(req: Request, res: Response) {
        const { url } = req.body;
        const newPhoto = new Photo();
        newPhoto.url = url;
        const photoRepository = AppDataSource.getRepository(Photo);
        try {
            await photoRepository.save(newPhoto);
        } catch (error) {
            return res.status(400).json({
                message: 'photo no existe',
                error
            })
        }
        res.json({ message: 'Photo created' });
    }
   static async getAll(req: Request, res: Response) {
        const photoRepository = AppDataSource.getRepository(Photo);
        let photos: Photo[];
        try {
            photos = await photoRepository.find({
                relations: ['user']
            });
        } catch (error) {
            return res.status(400).json({
                message: 'photo no existe',
                error
            })
        }
        if (photos.length == 0) {
            return res.status(404).json({
                message: 'no hay fotos'
            })
        }
        res.json(photos);
    }


}
export default PhotoController;