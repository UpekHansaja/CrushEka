package controller;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import entity.Chat;
import entity.User;
import entity.User_Status;
import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.HibernateUtil;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "LoadHomeData", urlPatterns = {"/LoadHomeData"})
public class LoadHomeData extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Gson gson = new Gson();
        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("status", false);
        jsonObject.addProperty("message", "Unable to process your request");

        try {

            String userId = request.getParameter("id");

            Session session = HibernateUtil.getSessionFactory().openSession();

            User user = (User) session.get(User.class, Integer.parseInt(userId));

            User_Status user_Status = (User_Status) session.get(User_Status.class, 1);

            user.setUser_status_id(user_Status);
            session.update(user);

            Criteria criteria1 = session.createCriteria(User.class);
            criteria1.add(Restrictions.ne("id", user.getId()));
            List<User> userList = criteria1.list();

            JsonArray jsonChatArray = new JsonArray();

            for (User otherUser : userList) {

                Criteria criteria2 = session.createCriteria(Chat.class);
                criteria2.add(Restrictions.or(
                        Restrictions.and(
                                Restrictions.eq("from_user", user),
                                Restrictions.eq("to_user", otherUser)
                        ),
                        Restrictions.and(
                                Restrictions.eq("from_user", otherUser),
                                Restrictions.eq("to_user", user)
                        )
                ));

                criteria2.addOrder(Order.desc("id"));
                criteria2.setMaxResults(1);
                List<Chat> chatList = criteria2.list();

                JsonObject chatItem = new JsonObject();
                chatItem.addProperty("other_user_id", otherUser.getId());
                chatItem.addProperty("other_user_name", otherUser.getFirst_name() + " " + otherUser.getLast_name());
                chatItem.addProperty("other_user_status", otherUser.getUser_status_id().getId());

                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy, MMM dd hh:ss a");

                //check avatar image
                String serverPath = request.getServletContext().getRealPath("");
                String otherUserAvatarImagePath = serverPath + "\\" + "AvatarImages" + "\\" + otherUser.getMobile() + ".png";
                File otherUserAvatarImageFile = new File(otherUserAvatarImagePath);

                if (otherUserAvatarImageFile.exists()) {
                    chatItem.addProperty("avatar_image_found", true);
                } else {
                    chatItem.addProperty("avatar_image_found", false);
                    chatItem.addProperty("other_user_avatar", otherUser.getFirst_name().charAt(0) + "" + otherUser.getLast_name().charAt(0));
                }

                if (criteria2.list().isEmpty()) {
                    //no chat
                    chatItem.addProperty("message", "Say Hi👋,");
                    chatItem.addProperty("dateTime", dateFormat.format(user.getRegistered_date_time()));
                    chatItem.addProperty("chat_status_id", 1);
                } else {
                    //found last chat
                    chatItem.addProperty("message", chatList.get(0).getMessage());
                    chatItem.addProperty("dateTime", dateFormat.format(chatList.get(0).getDate_time()));
                    chatItem.addProperty("chat_status_id", chatList.get(0).getChat_status_id().getId());
                }

                jsonChatArray.add(chatItem);
            };

            jsonObject.addProperty("success", true);
            jsonObject.addProperty("message", "success");
            jsonObject.add("jsonChatArray", gson.toJsonTree(jsonChatArray));

            session.beginTransaction().commit();
            session.close();

        } catch (Exception e) {
            e.printStackTrace();
        }

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(jsonObject));

    }

}

//        Gson gson = new Gson();
//        
//        JsonObject responseJson = new JsonObject();
//        responseJson.addProperty("status", false);
//        responseJson.addProperty("message", "success");
//        
//        try {
//            Session session = HibernateUtil.getSessionFactory().openSession();
//
//            //get user id from requesy parameter
//            String userId = request.getParameter("id");
//
//            //get user object
//            User user = (User) session.get(User.class, Integer.parseInt(userId));
//
//            //get user status = 1 (online)
//            User_Status user_Status = (User_Status) session.get(User_Status.class, 1);
//
//            //update user status
//            user.setUser_status_id(user_Status);
//            session.update(user);
//
//            //get other users
//            Criteria criteria1 = session.createCriteria(User.class);
//            criteria1.add(Restrictions.ne("id", user.getId()));
//            
//            List<User> otherUserList = criteria1.list();
//
//            //get other user one by one
//            
//            JsonArray jsonChatArray = new JsonArray();
//            for (User otherUser : otherUserList) {
//                Criteria criteria2 = session.createCriteria(Chat.class);
//                criteria1.add(
//                        Restrictions.or(
//                                Restrictions.and(
//                                        Restrictions.eq("from_user", user),
//                                        Restrictions.eq("to_user", otherUser)
//                                ),
//                                Restrictions.and(
//                                        Restrictions.eq("from_user", otherUser),
//                                        Restrictions.eq("to_user", user)
//                                )
//                        )
//                );
//                criteria2.addOrder(Order.desc("id"));
//                criteria2.setMaxResults(1);
//
//                //create chat item to send frontend data
//                JsonObject JsonChatItem = new JsonObject();
//                JsonChatItem.addProperty("other_user_id", otherUser.getId());
//                JsonChatItem.addProperty("other_user_mobile", otherUser.getMobile());
//                JsonChatItem.addProperty("name", otherUser.getFirst_name() + " " + otherUser.getLast_name());
//                JsonChatItem.addProperty("other_user_status", otherUser.getUser_status_id().getId());//1-online 2-oflone
//
//                //check avatar image
//                String serverPath = request.getServletContext().getRealPath("");
//                String OtherUserAvatarImagePath = serverPath + File.separator + "AvaterImages" + File.pathSeparator + otherUser.getMobile() + ".png";
//                File otherUserAvatarImageFile = new File(OtherUserAvatarImagePath);
//                
//                if (otherUserAvatarImageFile.exists()) {
//                    //avatar Image Found
//                    JsonChatItem.addProperty("avater_image_found", true);
//                } else {
//                    //avatar Image not Found
//                    JsonChatItem.addProperty("avater_image_found", false);
//                    JsonChatItem.addProperty("other_user_avater_letters", otherUser.getFirst_name().charAt(0) + "" + otherUser.getLast_name().charAt(0));
//                }
//
//                //get chat list
//                List<Chat> dbChatList = criteria2.list();
//                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy, MM ,dd hh:ss a");
//                
//                if (dbChatList.isEmpty()) {
//                    //no chat
//                    JsonChatItem.addProperty("message", "Let's start new convercation");
//                    JsonChatItem.addProperty("dateTime", dateFormat.format(user.getRegistered_date_time()));
//                    JsonChatItem.addProperty("chat_status_id", 1); // 1=seen 2=unseen
//
//                } else {
//
//                    //found last chat
//                    JsonChatItem.addProperty("message", dbChatList.get(0).getMessage());
//                    JsonChatItem.addProperty("dateTime", dateFormat.format(dbChatList.get(0).getDate_time()));
//                    JsonChatItem.addProperty("chat_status_id", dbChatList.get(0).getChat_status_id().getId()); // 1=seen 2=unseen
//
//                }
//
//                //get last covercation
//                jsonChatArray.add(JsonChatItem);
//                
//                //otherUser.setPassword(null);
//            }
//
//            //send users
//            responseJson.addProperty("success", true);
//            responseJson.addProperty("Message", "success");
//            //responseJson.addProperty("user", gson.toJson(user));
//            //responseJson.addProperty("jsonChatArray", gson.toJsonTree(jsonChatArray));
//            responseJson.add("jsonChatArray", gson.toJsonTree(jsonChatArray));
//            
//            session.beginTransaction().commit();
//            session.close();
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//        
//        response.setContentType("application/json");
//        response.getWriter().write(gson.toJson(responseJson));
