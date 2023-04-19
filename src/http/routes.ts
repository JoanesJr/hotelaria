import { FastifyInstance } from 'fastify';
import { userController } from './controllers/users';
import { addressController } from './controllers/address';
import { typeRoomController } from './controllers/typeRoom';
import { roomController } from './controllers/room';
import { itemController } from './controllers/items';


export async function appRoutes(app: FastifyInstance) {
    // users
    app.post('/user', userController.register);
    app.get('/user', userController.findAll);
    app.get('/user/:id', userController.findById);
    app.get('/user/cpf/:cpf', userController.findByCpf);
    app.get('/user/email/:email', userController.findByEmail);
    app.patch('/user/:id', userController.update);
    app.delete('/user/:id', userController.delete);


    // address
    app.post('/address', addressController.register);
    app.get('/address', addressController.findAll);
    app.get('/address/:id', addressController.findById);
    app.patch('/address/:id', addressController.update);
    app.delete('/address/:id', addressController.delete);

    // typeRoom
    app.post('/typeRoom', typeRoomController.register);
    app.get('/typeRoom', typeRoomController.findAll);
    app.get('/typeRoom/:id', typeRoomController.findById);
    app.patch('/typeRoom/:id', typeRoomController.update);
    app.delete('/typeRoom/:id', typeRoomController.delete);

    // room
    app.post('/room', roomController.register);
    app.get('/room', roomController.findAll);
    app.get('/room/:id', roomController.findById);
    app.patch('/room/:id', roomController.update);
    app.delete('/room/:id', roomController.delete);

    // item
    app.post('/item', itemController.register);
    app.get('/item', itemController.findAll);
    app.get('/item/:id', itemController.findById);
    app.patch('/item/:id', itemController.update);
    app.delete('/item/:id', itemController.delete);
}