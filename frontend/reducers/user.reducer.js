export default function user(user = {}, action) {
   switch (action.type) {
      case 'USER_LOGIN':
         return action.user
      case 'USER_LOGOUT':
         return {};
      default:
         return user
   }
}