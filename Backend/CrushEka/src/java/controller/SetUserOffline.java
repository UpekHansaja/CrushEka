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
@WebServlet(name = "SetUserOffline", urlPatterns = {"/SetUserOffline"})
public class SetUserOffline extends HttpServlet {

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

            User_Status user_Status = (User_Status) session.get(User_Status.class, 2);

            user.setUser_status_id(user_Status);
            session.update(user);

            jsonObject.addProperty("success", true);
            jsonObject.addProperty("message", "success");

            session.beginTransaction().commit();
            session.close();

        } catch (Exception e) {
            e.printStackTrace();
        }

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(jsonObject));

    }

}
