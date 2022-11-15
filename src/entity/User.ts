import { IsEmail, IsNotEmpty } from "class-validator"
import {
    Entity, PrimaryGeneratedColumn,
    Column, Unique, CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany
} from "typeorm";
import * as bcrypt from 'bcryptjs';
import { Photo } from "./Photo";

@Entity()
@Unique(['username'])
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @IsNotEmpty()
    @IsEmail()
    username: string

    @Column()
    @IsNotEmpty()
    password: string

    @Column()
    @IsNotEmpty()
    role: string

    @Column()
    @CreateDateColumn()
    createdAt: Date

    @Column()
    @UpdateDateColumn()
    updateAt: Date

    @OneToMany(()=>Photo,(photo)=>photo.user,{
        cascade:true,
        onDelete:"CASCADE"
    })
    photos:Photo[]
    user: Photo;
    
    hashPassword(): void {
        const salt = bcrypt.genSaltSync(12);
        this.password=bcrypt.hashSync(this.password,salt)
    }
    checkPassword(password:string):boolean{
        return bcrypt.compareSync(password,this.password);
    }

}
