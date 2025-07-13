import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// users/user.entity.ts
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column({ default: 'admin' })
    role: string;
}
