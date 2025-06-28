import { configureStore } from '@reduxjs/toolkit';
import CustomizerReducer from './customizer/CustomizerSlice';
import ChatsReducer from './apps/chat/ChatSlice';
import NotesReducer from './apps/notes/NotesSlice';
import EmailReducer from './apps/email/EmailSlice';
import TicketReducer from './apps/tickets/TicketSlice';
import ContactsReducer from './apps/contacts/ContactSlice';
import EcommerceReducer from './apps/eCommerce/EcommerceSlice';
import UserProfileReducer from './apps/userProfile/UserProfileSlice';
import BlogReducer from './apps/blog/BlogSlice';
import orderReducer from './apps/orders/orderSlice';
import inventoryReducer from './apps/inventory/inventorySlice';
import customersReducer from "./apps/customers/customersSlice";

export const store = configureStore({
  reducer: {
    customizer: CustomizerReducer,
    chatReducer: ChatsReducer,
    emailReducer: EmailReducer,
    notesReducer: NotesReducer,
    contactsReducer: ContactsReducer,
    ticketReducer: TicketReducer,
    ecommerceReducer: EcommerceReducer,
    userpostsReducer: UserProfileReducer,
    blogReducer: BlogReducer,
     orders: orderReducer,
     inventory: inventoryReducer,
     customers: customersReducer,
  },
});

export default store;
