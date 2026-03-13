const uow = require('./uow');
uow.add({ type: 'update' });
uow.commit();