import { FastifyInstance } from 'fastify';
import { userController } from './controllers/users';
import { addressController } from './controllers/address';
import { typeRoomController } from './controllers/typeRoom';


export async function appRoutes(app: FastifyInstance) {
    app.post('/user', userController.register);
    app.post('/address', addressController.register);
    app.post('/typeRoom', typeRoomController.create);

}