import { DataTypes } from "sequelize";
import { sequelize } from "../sequelize/sequelize.js";
import { GroupChat } from "./group_chat.js";
import { UserMessage } from "./user_message.js";
import { User } from "./user.js";

export const GroupMessage = sequelize.define("group_message", {
    message_id: {
        type: DataTypes.INTEGER,

        references: {
            model: UserMessage,
            key: 'id'
        }
    },

    user_id: {
        type: DataTypes.UUID,

        references: {
            model: User,
            key: 'id'
        }
    },

    group_id: {
        type: DataTypes.UUID,

        references: {
            model: GroupChat,
            key: 'id'
        }
    },
    status: {
        type: DataTypes.SMALLINT,
        allowNull: false,

        defaultValue: 0
    }
});

