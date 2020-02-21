import Sequelize from 'sequelize';

import Recipient from '../app/models/Recipient';
import User from '../app/models/User';
import Deliveryman from '../app/models/Deliveryman';
import Order from '../app/models/Order';
import File from '../app/models/File';
import Signature from '../app/models/Signature';
import DeliveryProblem from '../app/models/DeliveryProblem';

import databaseConfig from '../config/database';

const models = [
  Recipient,
  File,
  User,
  Deliveryman,
  Signature,
  Order,
  DeliveryProblem,
];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
