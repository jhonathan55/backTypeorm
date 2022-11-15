import { IsNotEmpty } from "class-validator";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { User } from "./User";

@Entity()
@Unique(["url"])
export class Photo{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    @IsNotEmpty()
    url:string;

   
    @ManyToOne(()=>User,(user)=>user.photos,{
        onDelete:"CASCADE"
        })
    user:User;
}
