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

/**
 *
 * @author upekhansaja
 */
@WebServlet(name = "LoadHomeData", urlPatterns = {"/LoadHomeData"})
public class LoadHomeData extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Gson gson = new Gson();
        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("success", false);
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

                criteria2.addOrder(Order.desc("date_time"));
                criteria2.setMaxResults(1);
                List<Chat> chatList = criteria2.list();

                JsonObject chatItem = new JsonObject();
                chatItem.addProperty("other_user_id", otherUser.getId());
                chatItem.addProperty("other_user_name", otherUser.getFirst_name() + " " + otherUser.getLast_name());
                chatItem.addProperty("other_user_status", otherUser.getUser_status_id().getId());

                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy, MMM dd hh:mm a");

                //check avatar image
                String serverPath = request.getServletContext().getRealPath("");
                String otherUserAvatarImagePath = serverPath + File.separator + "AvatarImages" + File.separator + otherUser.getMobile() + ".jpg";
//                System.out.println("Other User Img Path: " + otherUserAvatarImagePath);
                File otherUserAvatarImageFile = new File(otherUserAvatarImagePath);

                if (otherUserAvatarImageFile.exists()) {
                    chatItem.addProperty("avatar_image_found", true);
                    chatItem.addProperty("avatar_image_path", otherUserAvatarImagePath);
                } else {
                    chatItem.addProperty("avatar_image_found", false);
                    chatItem.addProperty("other_user_avatar", otherUser.getFirst_name().charAt(0) + "" + otherUser.getLast_name().charAt(0));
                }

                if (criteria2.list().isEmpty()) {
                    //no chat
                    chatItem.addProperty("message", "Say Hi, to start conversation");
                    chatItem.addProperty("dateTime", dateFormat.format(user.getRegistered_date_time()));
                    chatItem.addProperty("chat_status_id", 1);
                } else {
                    //found last chat
                    chatItem.addProperty("message", chatList.get(0).getMessage());
                    chatItem.addProperty("dateTime", dateFormat.format(chatList.get(0).getDate_time()));

                    if (chatList.get(0).getFrom_user().getId() == Integer.parseInt(userId)) {
                        System.out.println("Logged User is the From User");
                        chatItem.addProperty("from_logged_user", true);
                    } else {
                        chatItem.addProperty("from_logged_user", false);
                    }
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
