import validator from 'validator';

export function IsRealMobilePhone(phone) {
  //console.log(phone && typeof phone === "string" && validator.isMobilePhone(phone, ["ru-RU"]))

  return (
    phone &&
    typeof phone === 'string' &&
    validator.isMobilePhone(phone, ['ru-RU'])
  );
}

export function checkIsNotNull(...args) {
  for (const arg of args) {
    if (!arg) {
      return false;
    }
  }
  return true;
}

export function validateGroupChatUsersData(adminId, chatInfo, users) {
  if (!checkIsNotNull(adminId, chatInfo, users) || !Array.isArray(users)) {
    throw { status: 400, message: 'Неверные данные' };
  }
  // for (let i = 0; i < users.length; ++i) {
  //     if (!IsRealMobilePhone(users[i].phone)) {
  //         throw ApiError.invalidData()
  //     }
  // }
}
