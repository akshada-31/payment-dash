import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('decimal')
    amount: number;

    @Column()
    receiver: string;

    @Column()
    method: string;

    @Column()
    status: string;

    @CreateDateColumn()
    createdAt: Date;
}
