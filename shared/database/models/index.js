import { sequelize } from '../sequelize/sequelize.js';
import { Attachment } from './attachment.js';
import { Contact } from './contact.js';
import { Encrypt } from './encrypt.js';
import { File } from './file.js';
import { GroupChat } from './group_chat.js';
import { GroupMessage } from './group_message.js';
import { PersonalMessage } from './personal_message.js';
import { Preference } from './preference.js';
import { User } from './user.js';
import { UserCase } from './user_case.js';
import { UserGroupsMtm } from './user_groups_mtm.js';
import { UserLoadFile } from './user_load_file.js';
import { UserMessage } from './user_message.js';
import { UserReadMessageMtm } from './user_read_message_mtm.js';
import { Version } from './version.js';


import { RegisterSharedSecret } from './registerSharedSecret.js';
import { Pack } from './pack.js';
import { Sticker } from './sticker.js';

async function relationsStart() {
  User.belongsToMany(GroupChat, {
    through: UserGroupsMtm,
    foreignKey: 'user_id',
  });
  GroupChat.belongsToMany(User, {
    through: UserGroupsMtm,
    foreignKey: 'chat_id',
  });
  GroupChat.belongsTo(User, { foreignKey: 'admin' });
  User.hasMany(Contact, { foreignKey: 'user_id', as: 'Contacts' });

  Preference.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });

  Encrypt.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });
  User.hasOne(Encrypt, { foreignKey: 'user_id' });

  UserCase.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });

  GroupMessage.belongsTo(UserMessage, {
    foreignKey: 'message_id',
    targetKey: 'id',
  });
  GroupMessage.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });
  GroupMessage.belongsTo(GroupChat, {
    foreignKey: 'group_id',
    targetKey: 'id',
  });
  Attachment.belongsTo(UserMessage, {
    foreignKey: 'message_id',
    targetKey: 'id',
  });
  UserMessage.hasMany(Attachment, { foreignKey: 'message_id' });
  Attachment.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });
  Attachment.belongsTo(File, { foreignKey: 'file_id', targetKey: 'id' });
  UserMessage.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });
  UserReadMessageMtm.belongsTo(UserMessage, {
    foreignKey: 'message_id',
    targetKey: 'id',
  });
  UserMessage.hasMany(UserReadMessageMtm, { foreignKey: 'message_id' });
  UserReadMessageMtm.belongsTo(User, {
    foreignKey: 'author_id',
    targetKey: 'id',
  });
  UserReadMessageMtm.belongsTo(User, {
    foreignKey: 'reader_id',
    targetKey: 'id',
  });
  UserLoadFile.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });
  UserLoadFile.belongsTo(File, { foreignKey: 'file_id', targetKey: 'id' });
  PersonalMessage.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  PersonalMessage.belongsTo(User, { foreignKey: 'contact_id', as: 'contact' });
  PersonalMessage.belongsTo(UserMessage, {
    foreignKey: 'message_id',
    as: 'userMessage',
  });

  UserMessage.belongsTo(UserMessage, {
    foreignKey: 'forwardMessage',
    targetKey: 'id',
  });
  UserMessage.belongsTo(UserMessage, {
    foreignKey: 'answerMessage',
    targetKey: 'id',
  });

  Sticker.belongsTo(Pack, {
    foreignKey: 'pack_id',
    targetKey: 'id',
  });
  Pack.hasMany(Sticker, { foreignKey: 'pack_id' });

  Sticker.belongsTo(File, { foreignKey: 'file_id', targetKey: 'id' });
}
async function startDbConnection() {
  try {
    await sequelize.authenticate();
    await relationsStart();
    console.log('Соединение с базой данных установлено');
  } catch (error) {
    console.error('Ошибка в подключении базы данных:', error);
  }
}
export {
  GroupChat,
  GroupMessage,
  PersonalMessage,
  Preference,
  Contact,
  Sticker,
  Pack,
  User,
  UserCase,
  UserMessage,
  UserGroupsMtm,
  UserReadMessageMtm,
  UserLoadFile,
  File,
  Attachment,
  RegisterSharedSecret,
  Version,
  relationsStart,
  startDbConnection,
};
