import { FastifyInstance } from 'fastify';
import { userController } from './controllers/users';
import { addressController } from './controllers/address';
import { typeRoomController } from './controllers/typeRoom';


export async function appRoutes(app: FastifyInstance) {
    app.post('/user', userController.register);
    app.get('/user', userController.findAll);
    app.get('/user/:id', userController.findById);
    app.patch('/user/:id', userController.update);
    app.delete('/user/:id', userController.delete);


    app.post('/address', addressController.register);
    app.get('/address', addressController.findAll);
    app.get('/address/:id', addressController.findById);
    app.patch('/address/:id', addressController.update);
    app.delete('/address/:id', addressController.delete);

    app.post('/typeRoom', typeRoomController.create);
    app.get('/typeRoom', typeRoomController.findAll);
    app.get('/typeRoom/:id', typeRoomController.findById);
    app.patch('/typeRoom/:id', typeRoomController.update);
    app.delete('/typeRoom/:id', typeRoomController.delete);

}