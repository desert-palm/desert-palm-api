import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  // TODO: Uncomment when ready to implement refresh tokens
  // @ManyToOne(() => User, (user) => user.refreshTokens, { onDelete: "CASCADE" })
  // user: User;

  @Column({ default: false })
  revoked: boolean;

  @Column()
  expires: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
