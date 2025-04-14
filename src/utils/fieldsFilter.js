
export const fieldFilter= async (user)=>{
  user.password = undefined,
  user.passwordChangeAt = undefined;
  user. createdAt = undefined;
  user.updatedAt = undefined;
  user.passwordChangeToken = undefined;
  user.passwordChangeTokenExpires = undefined
  user.role = undefined;
  return user;
}

export const authFieldFilter= async (user)=>{
  user.password = undefined,
  user.passwordChangeAt = undefined;
  user. createdAt = undefined;
  user.updatedAt = undefined;
  user.passwordChangeToken = undefined;
  user.passwordChangeTokenExpires = undefined
  return user;
}