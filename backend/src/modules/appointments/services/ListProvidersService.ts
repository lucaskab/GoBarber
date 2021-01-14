import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import User from '@modules/users/infra/typeorm/entities/User';
import { classToClass } from 'class-transformer';

interface IRequest {
  user_id: string;
  provider_id: string;
}

@injectable()
class ListProvidersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    user_id,
    provider_id,
  }: IRequest): Promise<User | null | undefined> {
    // let user = await this.cacheProvider.recover<User | null | undefined>(
    //   `providers-list: ${user_id}`,
    // );
    let user;

    if (!user) {
      user = await this.usersRepository.findById(provider_id);
      console.log(user);
      await this.cacheProvider.save(
        `providers-list: ${provider_id}`,
        classToClass(user),
      );
    }

    return user;
  }
}
export default ListProvidersService;
