export const initialState = {
  notifications: [],
  unreadCount: 0,
};

export function notificationReducer(state, action) {
  switch (action.type) {
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [action.payload, ...state.notifications].slice(0, 50),
        unreadCount: state.unreadCount + 1,
      };

    case "MARK_READ":
      if (!state.notifications.some((notification) =>
        notification.id === action.payload && !notification.isRead
      )) {
        return state;
      }
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification.id === action.payload
            ? { ...notification, isRead: true }
            : notification
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };

    case "MARK_ALL_READ":
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification.isRead ? notification : { ...notification, isRead: true }
        ),
        unreadCount: 0,
      };

    case "LOAD_NOTIFICATIONS":
      return {
        ...state,
        notifications: action.payload,
        unreadCount: action.payload.filter((notification) => !notification.isRead).length,
      };

    case "RESTORE_NOTIFICATION":
      if (action.payload.isRead) return state;
      if (!state.notifications.some((notification) =>
        notification.id === action.payload.id && notification.isRead
      )) {
        return state;
      }
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification.id === action.payload.id
            ? { ...notification, isRead: false }
            : notification
        ),
        unreadCount: state.unreadCount + 1,
      };

    default:
      return state;
  }
}
