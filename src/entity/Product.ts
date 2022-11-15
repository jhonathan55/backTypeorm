import { isNotEmpty, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, Entity, 
    JoinTable, 
    ManyToMany, 
    PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { Category } from "./Category";

@Entity()
@Unique(['name'])
export class Product{

    @PrimaryGeneratedColumn()
    id:number

    @Column()
    @IsNotEmpty()
    name:string

    @Column()
    @IsNotEmpty()
    description:string

    @Column()
    @CreateDateColumn()
    createDateAt:Date

    @Column()
    @UpdateDateColumn()
    updateDateAt:Date

    //create relation many to many product by categorys
    @ManyToMany(()=> Category,(category)=>category.id)
    @JoinTable()
    categories:Category[];

}