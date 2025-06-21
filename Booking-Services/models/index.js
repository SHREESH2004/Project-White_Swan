import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import process from 'process';
import { fileURLToPath } from 'url';

// ESM workaround for __dirname and __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

// ✅ Load JSON config file using fs (recommended)
const configPath = path.join(__dirname, '/../config/config.json');
const configRaw = fs.readFileSync(configPath, 'utf-8');
const config = JSON.parse(configRaw)[env];

const db = {};

let sequelize;

if (config.use_env_variable) {
  sequelize = new Sequelize.Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize.Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

// Read and import model files dynamically (as ES modules)
const files = fs.readdirSync(__dirname).filter(file =>
  file.indexOf('.') !== 0 &&
  file !== basename &&
  file.slice(-3) === '.js' &&
  !file.endsWith('.test.js')
);

for (const file of files) {
  const modelPath = path.join(__dirname, file);
  const { default: modelFactory } = await import(`file://${modelPath}`);
  const model = modelFactory(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
}

// Set up associations
for (const modelName of Object.keys(db)) {
  if (typeof db[modelName].associate === 'function') {
    db[modelName].associate(db);
  }
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
