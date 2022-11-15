import { IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { Product } from "./Product";

@Entity()
@Unique(['name'])
export class Category{

    @PrimaryGeneratedColumn()
    id:number

    @Column()
    @IsNotEmpty()
    name:string

    @Column()
    @CreateDateColumn()
    createDateAt:Date
    
    @Column()
    @UpdateDateColumn()
    updateDateAt:Date

    //relation category by product
    @ManyToMany(()=>Product,(product)=>product.id)
    products:Product[]
}