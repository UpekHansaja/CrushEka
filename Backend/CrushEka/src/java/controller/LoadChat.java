package controller;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import entity.Chat;
import entity.Chat_Status;
import entity.User;
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
@WebServlet(name = "LoadChat", urlPatterns = {"/LoadChat"})
public class LoadChat extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        //LoadChat?logged_user_id=1&other_user_id=2
        String logged_user_id = request.getParameter("logged_user_id");
        String other_user_id = request.getParameter("other_user_id");

        Gson gson = new Gson();
        //chat array
        JsonArray chatArray = new JsonArray();

        try {

            Session session = HibernateUtil.getSessionFactory().openSession();

            //get logged user
            User logged_user = (User) session.get(User.class, Integer.parseInt(logged_user_id));

            //get other user
            User other_user = (User) session.get(User.class, Integer.parseInt(other_user_id));

            //get chat
            Criteria criteria1 = session.createCriteria(Chat.class);
            criteria1.add(
                    Restrictions.or(
                            Restrictions.and(Restrictions.eq("from_user", logged_user), Restrictions.eq("to_user", other_user)),
                            Restrictions.and(Restrictions.eq("from_user", other_user), Restrictions.eq("to_user", logged_user))
                    )
            );

            //sort chat
            criteria1.addOrder(Order.asc("date_time"));

            //get chat mg
            List<Chat> chat_list = criteria1.list();

            //get chat status = 1 (seen)
            Chat_Status chat_Status = (Chat_Status) session.get(Chat_Status.class, 1);
//            Chat_Status unSeenChat_Status = (Chat_Status) session.get(Chat_Status.class, 2);

            //create date time
            SimpleDateFormat dateFormat = new SimpleDateFormat("MMM dd, hh:mm a");

            for (Chat chat : chat_list) {
                //create chat obj
                JsonObject chatObject = new JsonObject();
                chatObject.addProperty("message", chat.getMessage());
                chatObject.addProperty("datetime", dateFormat.format(chat.getDate_time()));

                //get chat only other user
                if (chat.getFrom_user().getId() == other_user.getId()) {

                    //add side to  chat object
                    chatObject.addProperty("side", "Left");

                    //get only unseen chats (chat status id=2) 
                    Integer sentID = 2;

                    if (sentID.equals(chat.getChat_status_id().getId())) {
                        //update chat status -> seen
                        chat.setChat_status_id(chat_Status);
                        session.save(chat);
                    }

                } else {
                    //get get chat from logged user

                    //add side to  chat object
                    chatObject.addProperty("side", "Right");
                    chatObject.addProperty("status", chat.getChat_status_id().getId()); //1=seen , 2=unseen
                }
                chatArray.add(chatObject);
            }
            //update db
            session.beginTransaction().commit();
//            session.close();

            //send response
            response.setContentType("application/json");
            response.getWriter().write(gson.toJson(chatArray));

        } catch (Exception e) {
            e.printStackTrace();
        }

    }

}
