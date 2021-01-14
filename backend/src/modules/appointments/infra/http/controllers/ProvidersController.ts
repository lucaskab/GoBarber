import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import ListProvidersService from '@modules/appointments/services/ListProvidersService';

export default class ProvidersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.query;

    const listProviders = container.resolve(ListProvidersService);

    const providers = await listProviders.execute({
      provider_id,
    });

    return response.json(classToClass(providers));
  }
}
