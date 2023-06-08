import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Income {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  sum: number;

  @Column({ type: 'int' })
  date: number;

  @ManyToOne(() => User, (user: User) => user.id, { cascade: true })
  user: number;
}
